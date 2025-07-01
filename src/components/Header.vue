<template>
  <header class="header">
    <div class="header-content">
      <div class="header-left">
        <div class="logo">
          <img src="/logo.png" alt="NotifyHub" class="logo-img" />
          <span class="logo-text">NotifyHub</span>
        </div>
      </div>

      <div class="header-center">
        <nav class="nav-tabs">
          <button
              class="nav-tab"
              :class="{ active: currentView === 'send' }"
              @click="$emit('navigate', 'send')"
          >
            <SendIcon />
            发送通知
          </button>
          <button
              class="nav-tab"
              :class="{ active: currentView === 'config' }"
              @click="$emit('navigate', 'config')"
          >
            <SettingsIcon />
            设置
          </button>
        </nav>
      </div>
    </div>
  </header>
</template>

<script>
import { defineComponent } from 'vue'

// 简单的图标组件
const SendIcon = {
  template: `
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <line x1="22" y1="2" x2="11" y2="13"></line>
      <polygon points="22,2 15,22 11,13 2,9"></polygon>
    </svg>
  `
}

const SettingsIcon = {
  template: `
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <circle cx="12" cy="12" r="3"></circle>
      <path d="m12 1 1.68 2.32L16 2.24l.71 2.88L19.59 4l1.41 2.59L24 8l-1.41 2.59L19.59 12l-2.88 1.12L16 15.76l-2.32-1.68L12 15l-1.68-1.68L8 15.76l-.71-2.88L4.41 12 3 9.41 0 8l3-1.41L4.41 4l2.88-1.12L8 2.24l2.32 1.68z"></path>
    </svg>
  `
}

const MinimizeIcon = {
  template: `
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
  `
}

export default defineComponent({
  name: 'Header',
  components: {
    SendIcon,
    SettingsIcon,
    MinimizeIcon
  },
  props: {
    currentView: {
      type: String,
      default: 'send'
    }
  },
  emits: ['navigate'],
  setup() {
    const minimizeWindow = () => {
      if (window.notifyHubAPI && window.notifyHubAPI.hideWindow) {
        window.notifyHubAPI.hideWindow()
      }
    }

    return {
      minimizeWindow
    }
  }
})
</script>

<style scoped>
.header {
  background: var(--bg-color);
  border-bottom: 1px solid var(--border-color);
  padding: 0;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: var(--shadow);
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 20px;
  max-width: 100%;
}

.header-left {
  flex: 0 0 auto;
}

.logo {
  display: flex;
  align-items: center;
  gap: 8px;
}

.logo-img {
  width: 24px;
  height: 24px;
  border-radius: 4px;
}

.logo-text {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-color);
}

.header-center {
  flex: 1;
  display: flex;
  justify-content: center;
}

.nav-tabs {
  display: flex;
  gap: 4px;
  background: var(--bg-secondary);
  padding: 4px;
  border-radius: var(--border-radius);
}

.nav-tab {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border: none;
  background: transparent;
  color: var(--text-muted);
  border-radius: calc(var(--border-radius) - 2px);
  cursor: pointer;
  transition: var(--transition);
  font-size: 14px;
  font-weight: 500;
}

.nav-tab:hover {
  background: var(--bg-color);
  color: var(--text-color);
}

.nav-tab.active {
  background: var(--primary-color);
  color: white;
  box-shadow: var(--shadow);
}

.header-right {
  flex: 0 0 auto;
}

/* 响应式 */
@media (max-width: 480px) {
  .header-content {
    padding: 8px 16px;
  }

  .logo-text {
    display: none;
  }

  .nav-tab {
    padding: 6px 12px;
    font-size: 13px;
  }
}
</style>

