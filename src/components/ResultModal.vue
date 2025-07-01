<template>
  <div class="modal-overlay" @click="$emit('close')">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h3>发送结果</h3>
        <button class="close-btn" @click="$emit('close')">
          <CloseIcon />
        </button>
      </div>

      <div class="modal-body">
        <div v-if="Object.keys(results).length === 0" class="no-results">
          <div class="status status-warning">
            没有启用的通知渠道
          </div>
        </div>

        <div v-else class="results-list">
          <div
              v-for="(result, channel) in results"
              :key="channel"
              class="result-item"
          >
            <div class="result-header">
              <div class="channel-info">
                <span class="channel-name">{{ getChannelName(channel) }}</span>
                <span
                    :class="['status-badge', result.success ? 'success' : 'error']"
                >
                  {{ result.success ? '成功' : '失败' }}
                </span>
              </div>
              <div class="result-icon">
                <SuccessIcon v-if="result.success" class="success-icon" />
                <ErrorIcon v-else class="error-icon" />
              </div>
            </div>

            <div class="result-message">
              {{ result.message }}
            </div>
          </div>
        </div>
      </div>

      <div class="modal-footer">
        <button class="btn btn-primary" @click="$emit('close')">
          确定
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, computed } from 'vue'

// 图标组件
const CloseIcon = {
  template: `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <line x1="18" y1="6" x2="6" y2="18"></line>
      <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
  `
}

const SuccessIcon = {
  template: `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <polyline points="20,6 9,17 4,12"></polyline>
    </svg>
  `
}

const ErrorIcon = {
  template: `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="15" y1="9" x2="9" y2="15"></line>
      <line x1="9" y1="9" x2="15" y2="15"></line>
    </svg>
  `
}

export default defineComponent({
  name: 'ResultModal',
  components: {
    CloseIcon,
    SuccessIcon,
    ErrorIcon
  },
  props: {
    results: {
      type: Object,
      default: () => ({})
    }
  },
  emits: ['close'],
  setup(props) {
    const getChannelName = (channel) => {
      const names = {
        inotify: 'iNotify',
        bark: 'Bark',
        notifyme: 'NotifyMe',
        error: '错误'
      }
      return names[channel] || channel
    }

    const successCount = computed(() => {
      return Object.values(props.results).filter(result => result.success).length
    })

    const totalCount = computed(() => {
      return Object.keys(props.results).length
    })

    return {
      getChannelName,
      successCount,
      totalCount
    }
  }
})
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.modal-content {
  background: var(--bg-color);
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-lg);
  max-width: 500px;
  width: 100%;
  max-height: 80vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid var(--border-color);
}

.modal-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: var(--text-color);
}

.close-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: var(--text-muted);
  padding: 4px;
  border-radius: 4px;
  transition: var(--transition);
}

.close-btn:hover {
  background: var(--bg-secondary);
  color: var(--text-color);
}

.modal-body {
  padding: 20px;
  flex: 1;
  overflow-y: auto;
}

.no-results {
  text-align: center;
  padding: 20px 0;
}

.results-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.result-item {
  padding: 16px;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  background: var(--bg-secondary);
}

.result-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.channel-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.channel-name {
  font-weight: 600;
  color: var(--text-color);
}

.status-badge {
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.status-badge.success {
  background: rgba(40, 167, 69, 0.1);
  color: var(--success-color);
}

.status-badge.error {
  background: rgba(220, 53, 69, 0.1);
  color: var(--danger-color);
}

.result-icon {
  display: flex;
  align-items: center;
}

.success-icon {
  color: var(--success-color);
}

.error-icon {
  color: var(--danger-color);
}

.result-message {
  font-size: 14px;
  color: var(--text-muted);
  line-height: 1.4;
}

.modal-footer {
  padding: 20px;
  border-top: 1px solid var(--border-color);
  display: flex;
  justify-content: flex-end;
}

/* 响应式 */
@media (max-width: 480px) {
  .modal-overlay {
    padding: 16px;
  }

  .modal-content {
    max-height: 90vh;
  }

  .modal-header,
  .modal-body,
  .modal-footer {
    padding: 16px;
  }

  .result-item {
    padding: 12px;
  }

  .result-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
}
</style>

