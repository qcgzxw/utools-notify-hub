## NotifyHub - uTools 插件
一个聚合多个通知服务的平台化消息推送工具，适用于 uTools 插件生态。支持 iNotify、Bark、NotifyMe 等多个渠道，配置灵活、发送便捷。

---

### ✨ 功能特色

- 🧩 支持多种通知渠道：
    - [x] iNotify
    - [x] Bark（iOS 推送）
    - [x] NotifyMe（跨平台推送）
- 🔐 支持配置 API 地址、密钥、UUID 等参数
- 🔄 自动保存配置（可选）
- 🧪 一键测试各渠道连接
- 🧼 提供重置配置功能
- 🧰 简洁 UI，使用方便

---

### 📦 安装方式

在 uTools 插件市场中搜索 `NotifyHub` 安装，或手动导入本项目源码进行本地开发调试。

---

### 🚀 使用方法

1. 打开插件，切换到对应的“通知通道”Tab。
2. 填写各平台参数，如密钥、UUID、服务器地址等。
3. 点击“测试连接”以验证通道可用性。
4. 点击“发送消息”进行测试推送（开发中）。
5. 可在“全局设置”中开启“自动保存”和“系统通知提醒”。

---


### 🧪 支持的推送服务说明

#### ✅ iNotify

- 官网：https://inotify.ink
- 填写你的self-hosted 服务器域名和UUID

#### ✅ Bark

- 官网：https://bark.day.app
- 仅支持 iOS，需填写密钥（key）
- 可自定义服务器地址

#### ✅ NotifyMe

- 官网：https://notifyme.521933.xyz
- 填写你的 UUID

---

### 📝 更新日志

#### v1.0.0

- 🎉 首个正式版本发布
- 添加 iNotify、Bark、NotifyMe 支持
- 实现配置管理、保存、测试等功能

---

### 📮 联系与反馈

如需功能建议、Bug反馈或提交 PR，欢迎前往 GitHub 项目页：

👉 [GitHub 仓库地址](https://github.com/qcgzxw/utools-notify-hub)

### 🌟 感谢
- 使用ChatGPT、Manus等AI工具协助开发
