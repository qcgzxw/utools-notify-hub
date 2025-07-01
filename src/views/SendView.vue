<template>
  <div class="send-view">
    <div class="container">
      <div class="card">
        <div class="card-body">
          <form @submit.prevent="handleSubmit" class="send-form">
            <div class="form-group">
              <label for="title" class="form-label">
                标题
              </label>
              <input
                  id="title"
                  v-model="form.title"
                  type="text"
                  class="form-control"
                  placeholder="请输入通知标题"
                  maxlength="100"
              />
              <div class="form-hint">
                {{ form.title.length }}/100
              </div>
            </div>

            <div class="form-group">
              <label for="content" class="form-label">
                内容
              </label>
              <textarea
                  id="content"
                  v-model="form.content"
                  class="form-control"
                  placeholder="请输入通知内容"
                  rows="4"
                  maxlength="500"
              ></textarea>
              <div class="form-hint">
                {{ form.content.length }}/500
              </div>
            </div>

            <!-- 启用的渠道显示 -->
            <div class="enabled-channels" v-if="enabledChannels.length > 0">
              <h4>将发送到以下渠道：</h4>
              <div class="channel-list">
                <span
                    v-for="channel in enabledChannels"
                    :key="channel"
                    class="channel-badge"
                >
                  {{ getChannelName(channel) }}
                </span>
              </div>
            </div>

            <div class="form-actions">
              <button
                  type="button"
                  class="btn btn-secondary"
                  @click="clearForm"
              >
                清空
              </button>

              <button
                  type="submit"
                  class="btn btn-primary btn-lg"
                  :disabled="!canSend || sending"
              >
                <span v-if="sending" class="loading"></span>
                {{ sending ? '发送中...' : '发送通知' }}
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- 无可用渠道提示 -->
      <div v-if="enabledChannels.length === 0" class="status status-warning">
        <strong>提示：</strong>
        当前没有启用的通知渠道，请先在设置中配置并启用至少一个通知渠道。
        <button class="btn btn-sm btn-primary ml-2" @click="$emit('navigate', 'config')">
          去设置
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, computed, onMounted, watch } from 'vue'

export default defineComponent({
  name: 'SendView',
  props: {
    quickContent: {
      type: String,
      default: ''
    }
  },
  emits: ['send', 'navigate'],
  setup(props, { emit }) {
    const form = ref({
      title: '',
      content: ''
    })

    const sending = ref(false)
    const config = ref(null)

    // 模拟API（用于浏览器环境测试）
    const mockAPI = {
      getConfig: () => {
        const savedConfig = localStorage.getItem('notify_hub_config')
        if (savedConfig) {
          return Promise.resolve(JSON.parse(savedConfig))
        }
        return Promise.resolve({
          channels: {
            inotify: { enabled: false, domain: '', id: '' },
            bark: { enabled: false, key: '', server: 'https://api.day.app' },
            notifyme: { enabled: false, uuid: '', server: 'https://notifyme-server.521933.xyz' }
          },
          settings: {
            autoSave: true,
            showNotifications: true,
            timeout: 10000
          }
        })
      },
    }

    // 获取API实例
    const getAPI = () => {
      return window.notifyHubAPI || mockAPI
    }

    // 计算属性
    const enabledChannels = computed(() => {
      if (!config.value) return []
      return Object.keys(config.value.channels).filter(
          channel => config.value.channels[channel].enabled
      )
    })

    const canSend = computed(() => {
      return (form.value.title.trim() || form.value.content.trim()) &&
          enabledChannels.value.length > 0 &&
          !sending.value
    })

    // 方法
    const loadConfig = async () => {
      try {
        const api = getAPI()
        config.value = await api.getConfig()
      } catch (error) {
        console.error('加载配置失败:', error)
      }
    }

    const getChannelName = (channel) => {
      const names = {
        inotify: 'iNotify',
        bark: 'Bark',
        notifyme: 'NotifyMe'
      }
      return names[channel] || channel
    }

    const handleSubmit = async () => {
      if (!canSend.value) return

      sending.value = true
      try {
        emit('send', {
          title: form.value.title.trim(),
          content: form.value.content.trim()
        })
      } finally {
        sending.value = false
      }
    }

    const clearForm = () => {
      form.value.title = ''
      form.value.content = ''
    }

    // 监听快速内容变化
    watch(() => props.quickContent, (newContent) => {
      if (newContent) {
        form.value.content = newContent
        // 如果没有标题，尝试从内容中提取
        if (!form.value.title && newContent.length <= 50) {
          form.value.title = newContent
          form.value.content = ''
        }
      }
    }, { immediate: true })

    onMounted(() => {
      loadConfig()
    })

    return {
      form,
      sending,
      config,
      enabledChannels,
      canSend,
      getChannelName,
      handleSubmit,
      clearForm
    }
  }
})
</script>

<style scoped>
.send-view {
  padding: 0;
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

.send-form {
  max-width: 100%;
}

.form-label.required::after {
  content: ' *';
  color: var(--danger-color);
}

.form-hint {
  font-size: 12px;
  color: var(--text-muted);
  text-align: right;
  margin-top: 4px;
}

.enabled-channels {
  padding: 16px;
  background: var(--bg-secondary);
  border-radius: var(--border-radius);
  border: 1px solid var(--border-color);
}

.enabled-channels h4 {
  margin: 0 0 12px 0;
  font-size: 14px;
  font-weight: 600;
  color: var(--text-color);
}

.channel-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.channel-badge {
  display: inline-flex;
  align-items: center;
  padding: 4px 12px;
  background: var(--primary-color);
  color: white;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 500;
}

.form-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 24px;
  flex-wrap: wrap;
}

.form-actions .btn {
  min-width: 100px;
}

/* 响应式 */
@media (max-width: 768px) {
  .send-view {
    padding: 16px 0;
  }

  .form-actions {
    flex-direction: column;
  }

  .form-actions .btn {
    width: 100%;
    min-width: auto;
  }
}
</style>

