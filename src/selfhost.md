# Echo 自托管服务器搭建指南 / Echo Self-Hosted Server Guide

Echo 是一个免费的自托管语音房间客户端。你自己运行服务器，自己创建账号，只有你创建的账号能登录；
录音只保存在录制者的设备上，服务器不保存任何录音或聊天内容。

Echo is a free, self-hosted voice-room client. You run the server, you create the accounts, and only
accounts you created can sign in. Recordings stay on the recording device; the server stores no
audio and no chat history.

---

## 中文

### 你需要什么

| 项目 | 要求 |
|---|---|
| 一台服务器 | Linux（Ubuntu 22.04 / 24.04 实测），**有公网 IP**，1 核 1 GB 起步 |
| Docker | Docker Engine + `docker compose` 插件（官方安装脚本：`curl -fsSL https://get.docker.com \| sh`） |
| 防火墙 / 安全组放行 | `8080/tcp`（API）、`7880/tcp`（信令）、`7881/tcp`（TCP 回退）、`7882/udp`（媒体，**必须放行**） |
| 本目录的文件 | `docker-compose.yml`、`.env.example`、`livekit.yaml.example`、`seed-users.example.yaml`、`99-echo-livekit.conf` |

不需要域名、不需要证书。API 与信令以明文 HTTP / WebSocket 传输，语音媒体始终由 WebRTC（DTLS-SRTP）加密。
不要用于高敏感场景；需要加密信令时在前面加反向代理与 TLS，并在 `.env` 打开 `BACKEND_SCHEME` / `LK_SCHEME`。

### 首次部署

1. 把本目录的文件放到服务器上，例如 `/opt/echo`，之后的命令都在这个目录执行。
2. 宿主机内核 UDP 缓冲（LiveKit 需要，容器内改不了）：
   ```sh
   sudo install -m 644 99-echo-livekit.conf /etc/sysctl.d/99-echo-livekit.conf && sudo sysctl --system
   sysctl net.core.rmem_max net.core.wmem_max   # 应各为 5000000
   ```
3. 生成配置：
   ```sh
   cp .env.example .env
   cp livekit.yaml.example livekit.yaml
   cp seed-users.example.yaml seed-users.yaml
   openssl rand -hex 24   # 跑三次，分别填 POSTGRES_PASSWORD / LIVEKIT_API_KEY / LIVEKIT_API_SECRET
   ```
   - `.env`：填三个随机值、`SERVER_PUBLIC_IP`（本机公网 IP）、`IMAGE_TAG`（与你的客户端版本一致，如 `0.29.6`）。
   - `livekit.yaml`：把 **三处** `__LIVEKIT_API_KEY__` / `__LIVEKIT_API_SECRET__` 替换成与 `.env` 完全相同的值（`keys:` 一行两处，`webhook.api_key` 一处；漏了 webhook 会丢房间事件）。
   - `seed-users.yaml`：写入你要创建的账号（邮箱、密码、显示名；至少一个 `role: admin`）。
4. 文件权限（后端以非 root 用户 uid 65532 运行）：
   ```sh
   sudo chown 65532:65532 seed-users.yaml && sudo chmod 600 seed-users.yaml
   chmod 600 .env livekit.yaml
   ```
5. 起栈前检查变量是否套对：
   ```sh
   docker compose config | grep -E "PUBLIC_BASE_URL|LIVEKIT_WS_URL_PUBLIC|image: ghcr"
   # 期望：http://<你的IP>:8080、ws://<你的IP>:7880、echo-backend:<版本号>
   ```
6. 启动：
   ```sh
   docker compose up -d
   ```
7. 验证：
   ```sh
   curl http://<你的IP>:8080/v1/healthz        # {"status":"ok","db":"ok","livekit":"ok"}
   docker compose logs backend | grep "seed:"   # 每个账号一行 created，末行 seed: done created=N
   docker compose logs livekit | grep -i "buffer"   # 应无 UDP buffer 告警
   ```
8. 在 Echo 客户端登录页填服务器地址 `http://<你的IP>:8080`，用 `seed-users.yaml` 里的账号登录。

### 账号管理

- **新增账号**：在 `seed-users.yaml` 追加条目，然后 `docker compose up -d --force-recreate backend`，或不重启直接执行
  `docker compose run --rm backend seed --file /etc/echo/seed-users.yaml`。
- 清单是幂等的：邮箱不存在才创建；已存在的账号**不会**被改密码、改显示名；标 `role: admin` 的已有账号会被提升为管理员，但不会降级。
- 从清单删掉条目不会删除账号。
- 单个账号也可用命令行创建：`docker compose run --rm backend create-user --email a@b.c --password '…' --display-name Alice`。
- `seed-users.yaml` 含明文密码，只放在服务器上，不要提交到任何仓库。

### 升级

1. 客户端升到新版本后，把 `.env` 的 `IMAGE_TAG` 改为同一个版本号。
2. `docker compose pull && docker compose up -d`。
3. 服务器与客户端版本保持一致；不同版本之间不保证协议兼容。

改了 `livekit.yaml` 要 `docker compose up -d --force-recreate livekit`（会断一次正在进行的房间）。

### 拆除

`docker compose down -v`（`-v` 同时删除数据库卷）。

### 常见问题

- **`host-preflight` 报错、livekit 不启动**：第 2 步没做或没生效，按它打印的命令修，再 `docker compose up -d --force-recreate livekit`。
- **`bind source path does not exist`**：`seed-users.yaml` 不在当前目录。
- **后端启动报 `permission denied` 读 seed 文件**：第 4 步 `chown 65532:65532` 没做。
- **能登录、进房后没声音或单向有声**：`7882/udp` 没放行，或云厂商安全组只放了 TCP。
- **中国大陆机房**：Docker Hub / GHCR 直连可能失败，需配置镜像加速；STUN 不可靠时把 `livekit.yaml` 的 `use_external_ip` 改为 `false` 并加 `node_ip: <公网 IP>`。
- **镜像**：`ghcr.io/loststarjustin/echo-backend:<版本>`，多架构（amd64 / arm64），公开可拉取，无需登录。

---

## English

### What you need

| Item | Requirement |
|---|---|
| A server | Linux (tested on Ubuntu 22.04 / 24.04) with a **public IP**; 1 vCPU / 1 GB is enough to start |
| Docker | Docker Engine + the `docker compose` plugin (`curl -fsSL https://get.docker.com \| sh`) |
| Firewall / security group | open `8080/tcp` (API), `7880/tcp` (signalling), `7881/tcp` (TCP fallback), `7882/udp` (media, **required**) |
| Files from this folder | `docker-compose.yml`, `.env.example`, `livekit.yaml.example`, `seed-users.example.yaml`, `99-echo-livekit.conf` |

No domain and no certificate are needed. API and signalling travel as plain HTTP / WebSocket; voice media is
always encrypted by WebRTC (DTLS-SRTP). Do not use this for highly sensitive use; put a reverse proxy with TLS
in front and enable `BACKEND_SCHEME` / `LK_SCHEME` in `.env` if you need encrypted signalling.

### First deployment

1. Copy the files from this folder to the server, e.g. `/opt/echo`, and run everything below from there.
2. Host kernel UDP buffers (required by LiveKit; cannot be changed from inside a container):
   ```sh
   sudo install -m 644 99-echo-livekit.conf /etc/sysctl.d/99-echo-livekit.conf && sudo sysctl --system
   sysctl net.core.rmem_max net.core.wmem_max   # both should be 5000000
   ```
3. Create the config files:
   ```sh
   cp .env.example .env
   cp livekit.yaml.example livekit.yaml
   cp seed-users.example.yaml seed-users.yaml
   openssl rand -hex 24   # run three times: POSTGRES_PASSWORD, LIVEKIT_API_KEY, LIVEKIT_API_SECRET
   ```
   - `.env`: the three random values, `SERVER_PUBLIC_IP` (this machine's public IP) and `IMAGE_TAG` (same as your client version, e.g. `0.29.6`).
   - `livekit.yaml`: replace **all three** `__LIVEKIT_API_KEY__` / `__LIVEKIT_API_SECRET__` placeholders with exactly the values from `.env` (two on the `keys:` line, one under `webhook.api_key`; missing the webhook one silently drops room events).
   - `seed-users.yaml`: the accounts you want to create (email, password, display name; at least one `role: admin`).
4. File permissions (the backend runs as non-root uid 65532):
   ```sh
   sudo chown 65532:65532 seed-users.yaml && sudo chmod 600 seed-users.yaml
   chmod 600 .env livekit.yaml
   ```
5. Check the variables resolved correctly before starting:
   ```sh
   docker compose config | grep -E "PUBLIC_BASE_URL|LIVEKIT_WS_URL_PUBLIC|image: ghcr"
   # expect http://<your IP>:8080, ws://<your IP>:7880 and echo-backend:<version>
   ```
6. Start:
   ```sh
   docker compose up -d
   ```
7. Verify:
   ```sh
   curl http://<your IP>:8080/v1/healthz        # {"status":"ok","db":"ok","livekit":"ok"}
   docker compose logs backend | grep "seed:"   # one "created" line per account, then seed: done created=N
   docker compose logs livekit | grep -i "buffer"   # no UDP buffer warning expected
   ```
8. In the Echo client, enter `http://<your IP>:8080` as the server address on the login screen and sign in with an account from `seed-users.yaml`.

### Managing accounts

- **Add accounts**: append to `seed-users.yaml`, then `docker compose up -d --force-recreate backend`, or without a restart:
  `docker compose run --rm backend seed --file /etc/echo/seed-users.yaml`.
- The manifest is idempotent: an email is created only if it does not exist; existing accounts keep their password and display name; an existing account listed with `role: admin` is promoted, never demoted.
- Removing an entry from the manifest does not delete the account.
- One-off creation: `docker compose run --rm backend create-user --email a@b.c --password '…' --display-name Alice`.
- `seed-users.yaml` holds plaintext passwords: keep it on the server only and never commit it.

### Upgrading

1. After upgrading your clients, set `IMAGE_TAG` in `.env` to the same version.
2. `docker compose pull && docker compose up -d`.
3. Keep server and clients on the same version; protocol compatibility across versions is not guaranteed.

After editing `livekit.yaml`, run `docker compose up -d --force-recreate livekit` (this interrupts rooms in progress once).

### Tearing down

`docker compose down -v` (`-v` also deletes the database volume).

### Troubleshooting

- **`host-preflight` fails and livekit does not start**: step 2 was skipped or did not apply; run the printed fix, then `docker compose up -d --force-recreate livekit`.
- **`bind source path does not exist`**: `seed-users.yaml` is not in the current directory.
- **Backend logs `permission denied` on the seed file**: step 4 (`chown 65532:65532`) was skipped.
- **Sign-in works but no audio / one-way audio in rooms**: `7882/udp` is blocked, or the cloud security group only allows TCP.
- **Hosts in mainland China**: Docker Hub / GHCR may be unreachable without a registry mirror; if STUN is unreliable set `use_external_ip: false` in `livekit.yaml` and add `node_ip: <public IP>`.
- **Image**: `ghcr.io/loststarjustin/echo-backend:<version>`, multi-arch (amd64 / arm64), public, no login required.
