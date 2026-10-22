# Echo 技术支持 / Echo Support


---

## 中文

### Echo 是什么

免费的自托管语音房间客户端：多人实时语音，主持人可发起录音，每个参与者的录音保存在各自设备上。服务器由你自己部署。

### 我需要一台服务器吗

是。Echo 不提供公共服务器。按 [自托管服务器搭建指南](https://loststarjustin.github.io/echo/selfhost) 用 Docker 在一台有公网 IP 的机器上部署，十分钟左右。账号在部署时由你创建，没有 app 内注册。

### 登录页要填什么

服务器管理员给你的地址，形如 `http://1.2.3.4:8080`，以及管理员为你创建的邮箱和密码。

### 常见问题

- **登录失败**：确认地址含 `http://` 和端口 `:8080`；确认服务器在线（浏览器打开 `http://<地址>:8080/v1/healthz` 应返回 ok）。
- **进房后听不到 / 别人听不到我**：手机设置里确认已允许 Echo 使用麦克风；服务器端确认 `7882/udp` 已放行。
- **录音在哪里**：iOS / Android 在 app 内「录音」页查看与分享；桌面端在设置里选择的文件夹。
- **换服务器**：退出登录后在登录页填新地址。
- **忘记密码**：联系你的服务器管理员，管理员可重置。开发者无法重置任何账号。

### 联系开发者

软件缺陷与建议：438202344@qq.com。账号、服务器问题请找你的服务器管理员，开发者无法访问你的服务器。

---

## English

### What is Echo

A free, self-hosted voice-room client: real-time multi-party voice, host-initiated recording, and every participant's recording stays on their own device. You run the server.

### Do I need a server

Yes. Echo offers no public server. Follow the [self-hosting guide](https://loststarjustin.github.io/echo/selfhost) to deploy with Docker on a machine with a public IP; it takes about ten minutes. Accounts are created at deployment time; there is no in-app sign-up.

### What goes on the login screen

The address your server administrator gives you, like `http://1.2.3.4:8080`, plus the email and password they created for you.

### FAQ

- **Sign-in fails**: make sure the address includes `http://` and port `:8080`, and that the server is up (`http://<address>:8080/v1/healthz` in a browser should return ok).
- **No audio after joining**: check that Echo is allowed to use the microphone in system settings; on the server, make sure `7882/udp` is open.
- **Where are my recordings**: iOS / Android: the Recordings screen inside the app, with sharing; desktop: the folder chosen in Settings.
- **Switch server**: sign out, then enter the new address on the login screen.
- **Forgot password**: contact your server administrator, who can reset it. The developer cannot reset any account.

### Contact the developer

Bugs and suggestions: 438202344@qq.com. For account or server issues contact your server administrator; the developer has no access to your server.
