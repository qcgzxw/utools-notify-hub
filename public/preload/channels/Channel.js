class Channel {
  constructor(config) {
    this.config = config;
    this.checkConfig();
  }

  checkConfig() {
    return true
  }

  /**
   * 发送通知接口，子类必须实现
   * @param {string} title 标题
   * @param {string} content 内容
   * @param {object} options 渠道专属参数
   * @returns {Promise<{success: boolean, message?: string}>}
   */
  async send(title, content, options = {}) {
    throw new Error('子类必须实现 send 方法');
  }
}
module.exports = Channel
