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
            :on-send="handleSend"
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

    // 发送通知处理
    const handleSend = async (data) => {
      try {
        sendResults.value = await window.notifyHubAPI.sendNotification(data.title, data.content)
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
        window.notifyHubAPI.setHeight(800)
      }

      // 监听快速发送通知
      utools.onPluginEnter(({ code, type, payload }) => {
        console.log('插件进入:', { code, type, payload })

        // 快速发送通知
        if (code === 'notify_quick' && payload) {
          if (payload) {
            handleSend({
              title: '',
              content: payload,
            }).catch((error) => {
              console.error('发送失败:', error)
            })
          }
        }
      })
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

