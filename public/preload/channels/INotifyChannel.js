const Channel = require('./Channel');
const httpClient = require('./httpClient');

class INotifyChannel extends Channel {

  constructor(config) {
    super(config);

    this.id = this.config.id
    this.server = this.config.server
  }
  checkConfig() {
    if (!this.config.id || !this.config.server) throw new Error('INotify 配置不完整');
  }


  async send(title, content, opts = {}) {
    if (!this.server || !this.id) throw new Error('INotify 配置不完整');
    const url = `${this.server}/${this.id}.send/` +
      `${encodeURIComponent(title)}/${encodeURIComponent(content)}`;
    const resp = await httpClient.get(url);
    if (resp.status === 200) {
      const d = JSON.parse(resp.data);
      return { success: d.code === 200, message: d.message };
    } else {
      return { success: false, message: `HTTP ${resp.status}` };
    }
  }
}
module.exports = INotifyChannel
