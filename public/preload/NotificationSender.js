const { createChannels, BarkChannel, INotifyChannel, NotifyMeChannel} = require('./channels')
const configManager     = require('./config/configManager')

class NotificationSender {
  constructor() {
    this.config = configManager.getConfig()
    this.channels = createChannels(this.config)
  }

  async sendToInotify(title, content) {
    const channel = this.channels.inotify
    return channel.send(title, content)
  }

  async sendToBark(title, content) {
    const channel = this.channels.bark
    return channel.send(title, content)
  }

  async sendToNotifyme(title, content) {
    const channel = this.channels.notifyme
    return channel.send(title, content)
  }

  async sendNotification(title, content) {
    const results = {}

    // 并行发送到所有启用的渠道
    const promises = []

    if (this.config.channels.inotify.enabled) {
      promises.push(
        this.sendToInotify(title, content).then(result => ({ channel: 'inotify', ...result }))
      )
    }

    if (this.config.channels.bark.enabled) {
      promises.push(
        this.sendToBark(title, content).then(result => ({ channel: 'bark', ...result }))
      )
    }

    if (this.config.channels.notifyme.enabled) {
      promises.push(
        this.sendToNotifyme(title, content).then(result => ({ channel: 'notifyme', ...result }))
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
  }

  async testChannel(channel, config, title = '测试通知', content = '这是一条测试消息') {
    let testChannel = null
    switch (channel) {
      case 'inotify':
        testChannel = new INotifyChannel(config)
        return await testChannel.send(title, content)
      case 'bark':
        testChannel = new BarkChannel(config)
        return await testChannel.send(title, content)
      case 'notifyme':
        testChannel = new NotifyMeChannel(config)
        return await testChannel.send(title, content)
      default:
        return {success: false, message: '未知的通知渠道'}
    }
  }
}
module.exports = NotificationSender
