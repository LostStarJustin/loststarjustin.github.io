# Echo 隐私政策 / Echo Privacy Policy


---

## 中文

### 一句话

Echo 是自托管软件。开发者不运营你的服务器，不收集、不接收、不存储你的任何个人数据。

### Echo 如何工作

Echo 客户端只连接**你在登录页填写的服务器地址**。该服务器由你或你的组织自行部署和管理，开发者无法访问。

### 你的服务器上有什么

| 数据 | 存在哪里 | 谁能看到 |
|---|---|---|
| 账号（邮箱、显示名、密码的加密散列） | 你的服务器数据库 | 该服务器的管理员 |
| 房间与成员状态 | 你的服务器内存，房间结束即释放 | 房间内成员 |
| 语音 | 通过你的服务器实时转发，加密传输（WebRTC DTLS-SRTP），**不落盘** | 房间内成员 |
| 文字聊天 | 仅在房间内实时传递，**服务器不保存** | 房间内成员 |
| 录音文件 | **只保存在录制者自己的设备上** | 录制者本人 |

### 设备上有什么

- 录音文件（WAV）保存在本机：桌面端在你选择的文件夹，手机端在 app 的私有存储。删除 app 即删除这些文件。
- 登录状态和你填写的服务器地址保存在本机，用于下次自动登录。

### 权限

- **麦克风**：语音通话与录音必需。只在你进入房间后使用。
- **本地网络 / 网络**：连接你的服务器。
- 不请求位置、通讯录、相机、照片。

### 录音与他人

录音由房间主持人发起，房间内所有成员都会看到录音指示。录音内容包含其他参与者的声音，**录制者有责任事先取得参与者同意并遵守当地法律**。

### 开发者收集什么

**不收集。** Echo 不含分析、广告或崩溃上报组件，不向开发者或任何第三方发送数据。

例外：通过 Apple App Store 或 TestFlight 安装时，Apple 可能依其自身政策向开发者提供匿名的崩溃报告与使用统计，前提是你在 iOS 设置中开启了「与 App 开发者共享」。这由 Apple 控制，详见 Apple 的隐私政策。

### 演示服务器

开发者可能提供一台演示服务器供试用。演示服务器上的账号由开发者创建，其数据处理方式与上表相同；演示服务器可能随时重置或下线，不要用于正式用途。

### 未成年人

Echo 不面向 13 岁以下儿童，不会有意收集其信息。

### 变更

本政策变更时会更新页首的生效日期，重大变更会在下载页公告。

### 联系

438202344@qq.com

---

## English

### In one sentence

Echo is self-hosted software. The developer does not operate your server and does not collect, receive or store any of your personal data.

### How Echo works

The Echo client only connects to **the server address you type on the login screen**. That server is deployed and managed by you or your organisation; the developer has no access to it.

### What lives on your server

| Data | Where | Who can see it |
|---|---|---|
| Accounts (email, display name, salted password hash) | Your server's database | Administrators of that server |
| Room and participant state | Your server's memory, released when the room ends | Members of the room |
| Voice | Relayed in real time through your server, encrypted in transit (WebRTC DTLS-SRTP), **never written to disk** | Members of the room |
| Text chat | Delivered live inside the room only, **not stored by the server** | Members of the room |
| Recordings | **Only on the recording user's own device** | The person who recorded |

### What lives on your device

- Recordings (WAV) are stored locally: in a folder you choose on desktop, in the app's private storage on mobile. Deleting the app deletes them.
- Your sign-in session and the server address you entered are kept locally so you can sign in again.

### Permissions

- **Microphone**: required for voice chat and recording; used only after you join a room.
- **Network / local network**: to reach your server.
- No access to location, contacts, camera or photos is requested.

### Recording and other people

Recording is started by the room host and is indicated to everyone in the room. A recording contains other participants' voices; **the person recording is responsible for obtaining consent and complying with local law**.

### What the developer collects

**Nothing.** Echo contains no analytics, advertising or crash-reporting components and sends no data to the developer or any third party.

Exception: when installed through the Apple App Store or TestFlight, Apple may share anonymised crash reports and usage statistics with the developer under Apple's own policies, if you have enabled "Share with App Developers" in iOS Settings. This is controlled by Apple; see Apple's privacy policy.

### Demo server

The developer may provide a demo server for trying Echo. Accounts on it are created by the developer, data is handled as in the table above, and the demo server may be reset or taken offline at any time. Do not use it for real work.

### Children

Echo is not directed at children under 13 and does not knowingly collect information from them.

### Changes

When this policy changes, the effective date at the top is updated; material changes are announced on the download page.

### Contact

438202344@qq.com
