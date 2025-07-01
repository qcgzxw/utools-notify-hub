<template>
  <div id="app">
    <Header
        :current-view="currentView"
        @navigate="handleNavigate"
    />

    <main class="main-content">
      <Transition name="fade" mode="out-in">
        <SendView
            v-if="currentView === 'send'"
            key="send"
            @send="handleSend"
            :quick-content="quickContent"
        />
        <ConfigView
            v-else-if="currentView === 'config'"
            key="config"
            @save="handleConfigSave"
        />
      </Transition>
    </main>

    <!-- 发送结果弹窗 -->
    <Transition name="fade">
      <ResultModal
          v-if="showResult"
          :results="sendResults"
          @close="showResult = false"
      />
    </Transition>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue'
import Header from './components/Header.vue'
import SendView from './views/SendView.vue'
import ConfigView from './views/ConfigView.vue'
import ResultModal from './components/ResultModal.vue'

export default {
  name: 'App',
  components: {
    Header,
    SendView,
    ConfigView,
    ResultModal
  },
  setup() {
    const currentView = ref('send')
    const showResult = ref(false)
    const sendResults = ref({})
    const quickContent = ref('')

    // 导航处理
    const handleNavigate = (view) => {
      currentView.value = view
    }
    const mockAPI = {
      getConfig: () => Promise.resolve(config.value),
      sendNotification: (title, content) => {
        return new Promise((resolve) => {
          setTimeout(() => {
            const savedConfig = localStorage.getItem('notify_hub_config')
            const config = savedConfig ? JSON.parse(savedConfig) : { channels: {} }
            const results = {}

            if (config.channels.inotify?.enabled) {
              results.inotify = { success: true, message: '发送成功' }
            }
            if (config.channels.bark?.enabled) {
              results.bark = { success: true, message: '发送成功' }
            }
            if (config.channels.notifyme?.enabled) {
              results.notifyme = { success: true, message: '发送成功' }
            }

            resolve(results)
          }, 1500)
        })
      }
    }

    // 发送通知处理
    const handleSend = async (data) => {
      try {
        const api = window.notifyHubAPI || mockAPI
        const results = await api.sendNotification(data.title, data.content)
        sendResults.value = results
        showResult.value = true
      } catch (error) {
        console.error('发送失败:', error)
        sendResults.value = {
          error: { success: false, message: error.message }
        }
        showResult.value = true
      }
    }

    // 配置保存处理
    const handleConfigSave = async (config) => {
      console.log(JSON.parse(JSON.stringify(config)))
    }

    // 监听快速发送消息
    const handleQuickNotify = (event) => {
      if (event.data && event.data.type === 'QUICK_NOTIFY') {
        quickContent.value = event.data.payload.content
        currentView.value = 'send'
      }
    }

    onMounted(() => {
      // 监听来自preload的消息
      window.addEventListener('message', handleQuickNotify)

      // 设置窗口高度
      if (window.notifyHubAPI && window.notifyHubAPI.setHeight) {
        window.notifyHubAPI.setHeight(600)
      }
    })

    onUnmounted(() => {
      window.removeEventListener('message', handleQuickNotify)
    })

    return {
      currentView,
      showResult,
      sendResults,
      quickContent,
      handleNavigate,
      handleSend,
      handleConfigSave
    }
  }
}
</script>

<style scoped>
#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  padding: 0;
  overflow: hidden;
}

/* 过渡动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

