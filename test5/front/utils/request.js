import axios from 'axios'

// 根据环境切换基础URL
const baseURL = import.meta.env.DEV
  ? 'http://localhost:5173/soil-app/api' // 开发环境
  : '/api'                      // 生产环境

const service = axios.create({
  baseURL,
  timeout: 15000 // 请求超时
})
service.interceptors.request.use(config => {
  if (config.method === 'get' && config.params?.geometry) {
    // 将geometry转换为WKT格式
    config.params.geometry = `POLYGON((${config.params.geometry.join(' ')}))`;
  }
  return config;
});
export default service