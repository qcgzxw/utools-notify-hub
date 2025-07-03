const Channel = require('./Channel');
const httpClient = require('./httpClient');

class NotifyMeChannel extends Channel {
  constructor(config) {
    super(config);

    this.uuid = this.config.uuid
    this.server = this.config.server
    this.opts = this.config.opts
  }

  extractUrlFromStr(content) {
    const urlRegex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g;
    return content.match(urlRegex);
  }
  extractDomainFromStr(content) {
    const domainRegex = /[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g;
    return content.match(domainRegex);
  }


  getOpts(title, content) {
    const urls = this.extractUrlFromStr(title) || this.extractDomainFromStr(content);
    const domains = this.extractDomainFromStr(title) || this.extractDomainFromStr(content);
    if (this.opts.actionType) {
      this.opts.actionType = parseInt(this.opts.actionType)
      switch (this.opts.actionType) {
        case 0:
        case 3:
        case 4:
          break;
        case 1:
          if (urls) {
            this.opts.action = urls[0];
          } else {
            this.opts.actionType = 0;
          }
          break;
        case 2:
          if (domains) {
            this.opts.action = domains[0];
          } else {
            this.opts.actionType = 0;
          }
          break;
        default: this.opts.actionType = 0;
      }
    }
    return this.opts
  }

  checkConfig() {
    if (!this.config.uuid || !this.config.server) throw new Error('NotifyMe 配置不完整');
  }


  async send(title, content, opts = {}) {
    if (!this.uuid) throw new Error('NotifyMe 配置不完整');
    const { ttl = 86400, priority = 'normal', ...extraData} = {
      ...this.getOpts(title, content),
      ...opts
    };
    const url = this.server || 'https://notifyme-server.521933.xyz';

    const body = {
      data: {
        uuid: this.uuid,
        ttl: ttl,
        priority: priority,
        data: { title, body: content, ...extraData }
      }
    };
    // 深度清理 undefined
    const clean = obj => {
      Object.entries(obj).forEach(([k, v]) => {
        if (v == null) delete obj[k];
        else if (typeof v === 'object') clean(v);
      });
    };
    clean(body);

    const resp = await httpClient.post(url, body, {
      headers: { 'Content-Type': 'application/json' }
    });
    if (resp.status === 200) {
      const d = JSON.parse(resp.data);
      return { success: !!d.isSuccess, message: d.isSuccess? '发送成功' : d.result };
    }
    return { success: false, message: `HTTP ${resp.status}` };
  }
}
module.exports = NotifyMeChannel
