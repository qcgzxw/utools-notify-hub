const Channel = require('./Channel');
const httpClient = require('./httpClient');

class BarkChannel extends Channel {

  constructor(config) {
    super(config);
    this.key = this.config.key
    this.server = this.config.server
  }

  checkConfig() {
    if (!this.config.key || !this.config.server) throw new Error('Bark 配置不完整');
  }

  async send(title, content, opts = {}) {
    if (!this.key) throw new Error('Bark 配置不完整');
    const server = this.server || 'https://api.day.app';
    const url = `${server}/${this.key}`;

    const payload = { title, body: content, ...opts };
    Object.keys(payload).forEach(k => payload[k] == null && delete payload[k]);

    const resp = await httpClient.post(url, payload, {
      headers: { 'Content-Type': 'application/json' }
    });
    if (resp.status === 200) return { success: true, message: '发送成功' };
    return { success: false, message: `HTTP ${resp.status}` };
  }
}
module.exports = BarkChannel
