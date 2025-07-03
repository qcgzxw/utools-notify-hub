const CONFIG_KEY = 'notify_hub_config'

function getDefaultConfig() {
  return {
    channels: {
      notifyme:{ enabled: false, uuid: '', server: 'https://notifyme-server.521933.xyz', opts: {actionType: 0}},
      inotify: { enabled: false, id: '', server: 'https://notify.example.com', opts: {}},
      bark:    { enabled: false, key: '', server: 'https://api.day.app', opts:{}},
    },
    settings: {
      autoSave: true,
      showNotifications: true,
      timeout: 10000
    }
  }
}
// 深度合并，保证新增字段不会丢失
function mergeDeep(target, source) {
  const isObject = obj => obj && typeof obj === 'object' && !Array.isArray(obj);
  const output = Object.assign({}, target);
  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach(key => {
      const srcVal = source[key];
      const tgtVal = target[key];
      if (isObject(srcVal) && isObject(tgtVal)) {
        output[key] = mergeDeep(tgtVal, srcVal);
      } else {
        output[key] = srcVal;
      }
    });
  }
  return output;
}

const configManager = {
  getConfig() {
    try {
      const rec = utools.db.get(CONFIG_KEY)
      const stored = rec && rec.data ? rec.data : {}
      // 深度合并默认与存储
      return mergeDeep(getDefaultConfig(), stored)
    } catch {
      return getDefaultConfig()
    }
  },
  getDefaultConfig() {
    return getDefaultConfig()
  },

  saveConfig(cfg) {
    try {
      const safe = JSON.parse(JSON.stringify(cfg))
      utools.db.remove(CONFIG_KEY)
      utools.db.put({ _id: CONFIG_KEY, data: safe })
      return true
    } catch {
      return false
    }
  },
  mockGetConfig() {
    try {
      const rec = localStorage.getItem(CONFIG_KEY)
      const stored = rec && rec.data ? rec.data : {}
      // 深度合并默认与存储
      return mergeDeep(getDefaultConfig(), stored)
    } catch {
      return getDefaultConfig()
    }
  },
  mockSaveConfig(cfg) {
    try {
      const safe = JSON.parse(JSON.stringify(cfg))
      localStorage.removeItem(CONFIG_KEY)
      localStorage.setItem(CONFIG_KEY, safe)
      return true
    } catch {
      return false
    }
  }
}
module.exports = configManager
