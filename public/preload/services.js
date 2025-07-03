const configManager = require('./config/configManager')
const NotificationSender = require('./NotificationSender')

// 暴露API给渲染进程
window.notifyHubAPI = {
    // 配置管理
    getConfig: () => configManager.getConfig(),
    getDefaultConfig: () => configManager.getDefaultConfig(),
    saveConfig: (config) => configManager.saveConfig(config),

    // 通知发送
    sendNotification: (title, content) => {
        const notificationSender = new NotificationSender()
        return notificationSender.sendNotification(title, content)
    },
    testChannel: (channel, config, title, content) => {
        const notificationSender = new NotificationSender()
        return notificationSender.testChannel(channel, config, title, content)
    },

    // uTools API
    hideWindow: () => utools.hideMainWindow(),
    showWindow: () => utools.showMainWindow(),
    setHeight: (height) => utools.setExpendHeight(height),

    // 剪贴板
    getClipboard: () => utools.copyText(),
    setClipboard: (text) => utools.copyText(text)
}

/*
// 测试代码
window.mockApi = {
    getConfig: () => configManager.mockGetConfig(),
    getDefaultConfig: () => configManager.getDefaultConfig(),
    saveConfig: (config) => configManager.mockSaveConfig(config),

    // 通知发送
    sendNotification: (title, content) => {
        const notificationSender = new NotificationSender()
        return notificationSender.sendNotification(title, content)
    },
    testChannel: (channel, config, title, content) => {
        const notificationSender = new NotificationSender()
        return notificationSender.testChannel(channel, config, title, content)
    },
}
*/
