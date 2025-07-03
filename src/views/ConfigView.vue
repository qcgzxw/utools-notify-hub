<template>
  <div class="config-view">
    <div class="container">
      <div class="card">
        <div class="card-body">
          <!-- iNotify 配置 -->
          <div class="channel-config">
            <div class="channel-header">
              <div class="channel-info">
                <h3>iNotify</h3>
                <p>一个简易消息通知系统，支持企业微信、电报机器人、邮件推送、内置BARK推送、钉钉群机器人、飞书群机器人，类似Server酱，支持私有Docker部署</p>
              </div>
              <label class="switch">
                <input
                    type="checkbox"
                    v-model="config.channels.inotify.enabled"
                    @change="saveConfig"
                />
                <span class="switch-slider"></span>
              </label>
            </div>

            <div v-if="config.channels.inotify.enabled" class="channel-form">
              <div class="form-group">
                <label class="form-label">域名</label>
                <input
                    v-model="config.channels.inotify.server"
                    type="text"
                    class="form-control"
                    placeholder="https://notify.example.com"
                    @blur="saveConfig"
                />
              </div>

              <div class="form-group">
                <label class="form-label">ID</label>
                <input
                    v-model="config.channels.inotify.id"
                    type="text"
                    class="form-control"
                    placeholder="your_inotify_id"
                    @blur="saveConfig"
                />
              </div>

              <div class="form-actions">
                <button
                    class="btn btn-sm btn-secondary"
                    @click="testChannel('inotify')"
                    :disabled="testing.inotify"
                >
                  <span v-if="testing.inotify" class="loading"></span>
                  {{ testing.inotify ? '测试中...' : '测试连接' }}
                </button>
              </div>

              <div v-if="testResults.inotify" class="test-result">
                <div
                    :class="['status', testResults.inotify.success ? 'status-success' : 'status-error']"
                >
                  {{ testResults.inotify.message }}
                </div>
              </div>
            </div>
          </div>

          <!-- Bark 配置 -->
          <div class="channel-config">
            <div class="channel-header">
              <div class="channel-info">
                <h3>Bark</h3>
                <p>一款注重隐私、安全可控的自定义通知推送工具。</p>
              </div>
              <label class="switch">
                <input
                    type="checkbox"
                    v-model="config.channels.bark.enabled"
                    @change="saveConfig"
                />
                <span class="switch-slider"></span>
              </label>
            </div>

            <div v-if="config.channels.bark.enabled" class="channel-form">
              <div class="form-group">
                <label class="form-label">推送密钥</label>
                <input
                    v-model="config.channels.bark.key"
                    type="text"
                    class="form-control"
                    placeholder="your_bark_key"
                    @blur="saveConfig"
                />
              </div>

              <div class="form-group">
                <label class="form-label">服务器地址</label>
                <input
                    v-model="config.channels.bark.server"
                    type="url"
                    class="form-control"
                    placeholder="https://api.day.app"
                    @blur="saveConfig"
                />
              </div>

              <div class="form-actions">
                <button
                    class="btn btn-sm btn-secondary"
                    @click="testChannel('bark')"
                    :disabled="testing.bark"
                >
                  <span v-if="testing.bark" class="loading"></span>
                  {{ testing.bark ? '测试中...' : '测试连接' }}
                </button>
              </div>

              <div v-if="testResults.bark" class="test-result">
                <div
                    :class="['status', testResults.bark.success ? 'status-success' : 'status-error']"
                >
                  {{ testResults.bark.message }}
                </div>
              </div>
            </div>
          </div>

          <!-- NotifyMe 配置 -->
          <div class="channel-config">
            <div class="channel-header">
              <div class="channel-info">
                <h3>NotifyMe</h3>
                <p>NotifyMe 是一个安卓 App，通过此App你可以基于系统级推送通道（ FCM、华为推送、OPPO 推送、魅族推送、极光推送等）和应用级推送通道（极光推送）向你的安卓设备发送通知。</p>
              </div>
              <label class="switch">
                <input
                    type="checkbox"
                    v-model="config.channels.notifyme.enabled"
                    @change="saveConfig"
                />
                <span class="switch-slider"></span>
              </label>
            </div>

            <div v-if="config.channels.notifyme.enabled" class="channel-form">
              <div class="form-group">
                <label class="form-label">UUID</label>
                <input
                    v-model="config.channels.notifyme.uuid"
                    type="text"
                    class="form-control"
                    placeholder="your_notifyme_uuid"
                    @blur="saveConfig"
                />
              </div>

              <div class="form-group">
                <label class="form-label">服务器地址</label>
                <input
                    v-model="config.channels.notifyme.server"
                    type="url"
                    class="form-control"
                    placeholder="https://notifyme-server.521933.xyz"
                    @blur="saveConfig"
                />
              </div>

              <div class="form-group">
                <label class="form-label">点击动作类型</label>
                <select
                    v-model="config.channels.notifyme.opts.actionType"
                    class="form-control"
                    @change="saveConfig"
                >
                  <option value="0">默认</option>
                  <option value="1">URI启动</option>
                  <option value="4">写入剪切板</option>
                </select>
              </div>

              <div class="form-actions">
                <button
                    class="btn btn-sm btn-secondary"
                    @click="testChannel('notifyme')"
                    :disabled="testing.notifyme"
                >
                  <span v-if="testing.notifyme" class="loading"></span>
                  {{ testing.notifyme ? '测试中...' : '测试连接' }}
                </button>
              </div>

              <div v-if="testResults.notifyme" class="test-result">
                <div
                    :class="['status', testResults.notifyme.success ? 'status-success' : 'status-error']"
                >
                  {{ testResults.notifyme.message }}
                </div>
              </div>
            </div>
          </div>

          <!-- 全局设置 -->
          <div class="settings-section">
            <h3>全局设置</h3>

            <div class="setting-item">
              <label class="setting-label">
                <input
                    type="checkbox"
                    v-model="config.settings.autoSave"
                    @change="saveConfig"
                />
                自动保存配置
              </label>
              <p class="setting-desc">配置修改后自动保存，无需手动保存</p>
            </div>

            <div class="setting-item">
              <label class="setting-label">
                <input
                    type="checkbox"
                    v-model="config.settings.showNotifications"
                    @change="saveConfig"
                />
                显示系统通知
              </label>
              <p class="setting-desc">发送完成后显示系统通知提醒</p>
            </div>
          </div>

          <!-- 操作按钮 -->
          <div class="config-actions">
            <button
                class="btn btn-secondary"
                @click="resetConfig"
            >
              重置配置
            </button>

            <button
                class="btn btn-primary"
                @click="saveConfig"
                :disabled="saving"
            >
              <span v-if="saving" class="loading"></span>
              {{ saving ? '保存中...' : '保存配置' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, onMounted } from 'vue'

export default defineComponent({
  name: 'ConfigView',
  emits: ['save'],
  setup(props, { emit }) {
    const config = ref({
      channels: {
        bark: { enabled: false, key: '', server: 'https://api.day.app' },
        notifyme: { enabled: false, uuid: '', server: 'https://notifyme-server.521933.xyz', opts: { actionType: 0 } },
        inotify: { enabled: false, server: 'https://notify.example.com', id: '' },
      },
      settings: {
        autoSave: true,
        showNotifications: true,
        timeout: 10000
      }
    })

    const saving = ref(false)
    const testing = ref({
      bark: false,
      notifyme: false,
      inotify: false,
    })
    const testResults = ref({})
    // 加载配置
    const loadConfig = async () => {
      try {
        const loadedConfig = await window.notifyHubAPI.getConfig()
        config.value = { ...config.value, ...loadedConfig }

        // 从localStorage加载配置（浏览器环境）
        const savedConfig = localStorage.getItem('notify_hub_config')
        if (savedConfig) {
          const parsedConfig = JSON.parse(savedConfig)
          config.value = { ...config.value, ...parsedConfig }
        }
      } catch (error) {
        console.error('加载配置失败:', error)
      }
    }

    // 保存配置
    const saveConfig = async () => {
      if (!config.value.settings.autoSave) return

      saving.value = true
      try {
        await window.notifyHubAPI.saveConfig(config.value)
        emit('save', config.value)
      } finally {
        saving.value = false
      }
    }

    const getDefaultConfig = () => {
      return api.getDefaultConfig()
    }

    // 测试渠道连接
    const testChannel = async (channel) => {
      testing.value[channel] = true
      testResults.value[channel] = null

      try {
        const result = await window.notifyHubAPI.testChannel(
            channel,
            config.value.channels[channel],
            'NotifyHub测试',
            '这是一条来自NotifyHub的测试消息'
        )
        testResults.value[channel] = result
      } catch (error) {
        testResults.value[channel] = {
          success: false,
          message: error.message
        }
      } finally {
        testing.value[channel] = false
      }
    }

    // 重置配置
    const resetConfig = async () => {
      if (confirm('确定要重置所有配置吗？此操作不可撤销。')) {
        config.value = getDefaultConfig()
        await saveConfig()
        testResults.value = {}
        localStorage.removeItem('notify_hub_config')
      }
    }

    onMounted(() => {
      loadConfig()
    })

    return {
      config,
      saving,
      testing,
      testResults,
      saveConfig,
      testChannel,
      resetConfig
    }
  }
})
</script>

<style scoped>
.config-view {
  padding: 20px 0;
}

.card-header h2 {
  margin: 0 0 4px 0;
  font-size: 20px;
  font-weight: 600;
}

.subtitle {
  margin: 0;
  color: var(--text-muted);
  font-size: 14px;
}

.channel-config {
  margin-bottom: 32px;
  padding: 20px;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  background: var(--bg-secondary);
}

.channel-config:last-of-type {
  margin-bottom: 24px;
}

.channel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}
.channel-info {
  max-width: 90%;
}
.channel-info h3 {
  margin: 0 0 4px 0;
  font-size: 18px;
  font-weight: 600;
  color: var(--text-color);
}

.channel-info p {
  margin: 0;
  font-size: 14px;
  color: var(--text-muted);
}

.channel-form {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid var(--border-color);
}

.form-actions {
  margin-top: 16px;
}

.test-result {
  margin-top: 12px;
}

.settings-section {
  margin: 32px 0;
  padding: 20px;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  background: var(--bg-color);
}

.settings-section h3 {
  margin: 0 0 20px 0;
  font-size: 18px;
  font-weight: 600;
  color: var(--text-color);
}

.setting-item {
  margin-bottom: 16px;
}

.setting-item:last-child {
  margin-bottom: 0;
}

.setting-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
  color: var(--text-color);
  cursor: pointer;
}

.setting-label input[type="checkbox"] {
  margin: 0;
}

.setting-desc {
  margin: 4px 0 0 24px;
  font-size: 13px;
  color: var(--text-muted);
}

.config-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid var(--border-color);
}

/* 响应式 */
@media (max-width: 768px) {
  .config-view {
    padding: 16px 0;
  }

  .channel-config {
    padding: 16px;
    margin-bottom: 24px;
  }

  .channel-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .settings-section {
    padding: 16px;
  }

  .config-actions {
    flex-direction: column;
  }

  .config-actions .btn {
    width: 100%;
  }
}
</style>

