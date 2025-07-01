import { createApp } from 'vue'
import App from './App.vue'
import './style.css'

const app = createApp(App)

// 全局错误处理
app.config.errorHandler = (err, vm, info) => {
  console.error('Vue错误:', err, info)
}

app.mount('#app')
