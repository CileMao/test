import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
//import ElementPlus from 'element-plus'
//import 'element-plus/dist/index.css'
import 'amfe-flexible' // 自动设置根字体大小
// 导入字体图标
import 'font-awesome/css/font-awesome.min.css';

// 创建Vue应用
const app = createApp(App)

// 使用插件
app.use(router)
app.use(store)
app.use(ElementPlus)

// 挂载应用
app.mount('#app')