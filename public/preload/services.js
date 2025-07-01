const { ipcRenderer } = require('electron')
const https = require('node:https')
const http = require('node:http')

// 配置管理
const configKey = 'notify_hub_config'
const configManager = {
    // 获取配置
    getConfig() {
        try {
            const config = utools.db.get(configKey)
            console.log(config)
            return config ? config.data : this.getDefaultConfig()
        } catch (error) {
            console.error('获取配置失败:', error)
            return this.getDefaultConfig()
        }
    },

    // 保存配置
    saveConfig(config) {
        try {
            const safeConfig = JSON.parse(JSON.stringify(config))
            utools.db.remove(configKey)
            utools.db.put({
                _id: configKey,
                data: safeConfig
            })
            return true
        } catch (error) {
            console.error('保存配置失败:', error)
            return false
        }
    },

    // 默认配置
    getDefaultConfig() {
        return {
            channels: {
                inotify: {
                    enabled: false,
                    server: 'https://notify.example.com',
                    id: ''
                },
                bark: {
                    enabled: false,
                    key: '',
                    server: 'https://api.day.app'
                },
                notifyme: {
                    enabled: false,
                    uuid: '',
                    server: 'https://notifyme-server.521933.xyz'
                }
            },
            settings: {
                autoSave: true,
                showNotifications: true,
                timeout: 10000
            }
        }
    }
}

// 网络请求工具
const httpClient = {
    // 发送GET请求
    get(url, options = {}) {
        return new Promise((resolve, reject) => {
            const client = url.startsWith('https') ? https : http
            const timeout = options.timeout || 10000

            const req = client.get(url, (res) => {
                let data = ''
                res.on('data', chunk => data += chunk)
                res.on('end', () => {
                    try {
                        const result = {
                            status: res.statusCode,
                            data: data,
                            headers: res.headers
                        }
                        resolve(result)
                    } catch (error) {
                        reject(error)
                    }
                })
            })

            req.setTimeout(timeout, () => {
                req.destroy()
                reject(new Error('请求超时'))
            })

            req.on('error', reject)
        })
    },

    // 发送POST请求
    post(url, data, options = {}) {
        return new Promise((resolve, reject) => {
            const client = url.startsWith('https') ? https : http
            const timeout = options.timeout || 10000
            const postData = typeof data === 'string' ? data : JSON.stringify(data)

            const urlObj = new URL(url)
            const requestOptions = {
                hostname: urlObj.hostname,
                port: urlObj.port,
                path: urlObj.pathname + urlObj.search,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Content-Length': Buffer.byteLength(postData),
                    ...options.headers
                }
            }

            const req = client.request(requestOptions, (res) => {
                let responseData = ''
                res.on('data', chunk => responseData += chunk)
                res.on('end', () => {
                    try {
                        const result = {
                            status: res.statusCode,
                            data: responseData,
                            headers: res.headers
                        }
                        resolve(result)
                    } catch (error) {
                        reject(error)
                    }
                })
            })

            req.setTimeout(timeout, () => {
                req.destroy()
                reject(new Error('请求超时'))
            })

            req.on('error', reject)
            req.write(postData)
            req.end()
        })
    }
}

// 通知发送器
const notificationSender = {
    // 发送到inotify
    async sendToInotify(config, title, content) {
        try {
            if (!config.server || !config.id) {
                throw new Error('inotify配置不完整')
            }

            const url = `${config.server}/${config.id}.send/${encodeURIComponent(title)}/${encodeURIComponent(content)}`
            const response = await httpClient.get(url)

            if (response.status === 200) {
                return { success: true, message: '发送成功' }
            } else {
                return { success: false, message: `发送失败: HTTP ${response.status}` }
            }
        } catch (error) {
            return { success: false, message: error.message }
        }
    },

    // 发送到Bark
    async sendToBark(config, title, content) {
        try {
            if (!config.key) {
                throw new Error('Bark配置不完整')
            }

            const server = config.server || 'https://api.day.app'
            const url = `${server}/${config.key}`

            const data = {
                title,
                body: content, // 即 message 内容
                // 可选参数
                // sound: 'bell',
                // isArchive: 1,
                // group: 'NotifyHub',
                // url: 'https://example.com'
            }

            const response = await httpClient.post(url, data, {
                headers: { 'Content-Type': 'application/json' }
            })

            if (response.status === 200 && response.data.code === 200) {
                return { success: true, message: '发送成功' }
            } else {
                return { success: false, message: `发送失败: ${response.data?.message || '未知错误'}` }
            }
        } catch (error) {
            return { success: false, message: error.message }
        }
    },

    // 发送到Notifyme
    async sendToNotifyme(config, title, content) {
        try {
            if (!config.uuid) {
                throw new Error('NotifyMe配置不完整')
            }

            const server = config.server || 'https://notifyme-server.521933.xyz'
            const url = `${server}`

            const postBody = {
                data: {
                    uuid: config.uuid,
                    title: title,
                    ttl: 86400,
                    priority: "normal",
                    data: {
                        "title": title,
                        "body": content,
                        "group": "Messages",
                        "bigText": content.length > 50,
                    }
                }
            }

            const response = await httpClient.post(url, postBody, {
                headers: { 'Content-Type': 'application/json' }
            })

            if (response.status !== 200) {
                return {
                    success: false,
                    message: response.data?.result || `发送失败 HTTP ${response.status}`
                }
            }
            const responseData = JSON.parse(response.data)
            if (responseData?.isSuccess) {
                return { success: true, message: '发送成功' }
            } else {
                return {
                    success: false,
                    message: responseData?.result || `发送失败`
                }
            }
        } catch (error) {
            return { success: false, message: error.message }
        }
    },

    // 发送通知到所有启用的渠道
    async sendNotification(title, content) {
        const config = configManager.getConfig()
        const results = {}

        // 并行发送到所有启用的渠道
        const promises = []

        if (config.channels.inotify.enabled) {
            promises.push(
              this.sendToInotify(config.channels.inotify, title, content)
                .then(result => ({ channel: 'inotify', ...result }))
            )
        }

        if (config.channels.bark.enabled) {
            promises.push(
              this.sendToBark(config.channels.bark, title, content)
                .then(result => ({ channel: 'bark', ...result }))
            )
        }

        if (config.channels.notifyme.enabled) {
            promises.push(
              this.sendToNotifyme(config.channels.notifyme, title, content)
                .then(result => ({ channel: 'notifyme', ...result }))
            )
        }

        // 等待所有请求完成
        const allResults = await Promise.allSettled(promises)

        allResults.forEach(result => {
            if (result.status === 'fulfilled') {
                const { channel, ...channelResult } = result.value
                results[channel] = channelResult
            } else {
                console.error('发送失败:', result.reason)
            }
        })

        return results
    },

    // 测试单个渠道连接
    async testChannel(channel, config, title = '测试通知', content = '这是一条测试消息') {
        switch (channel) {
            case 'inotify':
                return await this.sendToInotify(config, title, content)
            case 'bark':
                return await this.sendToBark(config, title, content)
            case 'notifyme':
                return await this.sendToNotifyme(config, title, content)
            default:
                return { success: false, message: '未知的通知渠道' }
        }
    }
}

// 暴露API给渲染进程
window.notifyHubAPI = {
    // 配置管理
    getConfig: () => configManager.getConfig(),
    saveConfig: (config) => configManager.saveConfig(config),

    // 通知发送
    sendNotification: (title, content) => notificationSender.sendNotification(title, content),
    testChannel: (channel, config, title, content) => notificationSender.testChannel(channel, config, title, content),

    // uTools API
    hideWindow: () => utools.hideMainWindow(),
    showWindow: () => utools.showMainWindow(),
    setHeight: (height) => utools.setExpendHeight(height),

    // 剪贴板
    getClipboard: () => utools.copyText(),
    setClipboard: (text) => utools.copyText(text)
}

// 插件进入事件
utools.onPluginEnter(({ code, type, payload }) => {
    console.log('插件进入:', { code, type, payload })

    // 快速发送通知
    if (code === 'notify_quick' && payload) {
        const match = payload.match(/^(notify|通知)\s+(.+)$/)
        if (match) {
            const content = match[2]
            // 通知渲染进程处理快速发送
            window.postMessage({
                type: 'QUICK_NOTIFY',
                payload: { content }
            }, '*')
        }
    }
})

