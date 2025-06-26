import { createPinia } from 'pinia'

// 创建 pinia 实例
const pinia = createPinia()

// 可选：添加全局插件
pinia.use(({ store }) => {
  // 可以在这里添加全局逻辑
})

// 默认导出 pinia 实例
export default pinia