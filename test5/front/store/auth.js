// store/auth.js
import { defineStore } from 'pinia';
import soilApi from '@/api/soil.js'; // 引入 API 模块

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token') || null,
    user: JSON.parse(localStorage.getItem('user')) || null,
  }),
  actions: {
    // 修正后的登录方法
    async login(username, password) {
      try {
        // 调用 soil.js 中的 API
        const response = await soilApi.login(username, password);
        
        // 假设后端返回格式为 { success: true, token: 'xxx', user: { ... } }
        // 或简单返回成功消息
        if (response.data === '登录成功') {
          // 实际项目中应从响应获取 token 和用户信息
          this.token = 'dummy-token'; // 临时示例，实际应从响应获取
          this.user = { username };
          
          // 存储到本地存储
          localStorage.setItem('token', this.token);
          localStorage.setItem('user', JSON.stringify(this.user));
          
          return true;
        } else {
          throw new Error(response.data || '登录失败');
        }
      } catch (error) {
        console.error('登录错误:', error);
        throw error;
      }
    },
    
    logout() {
      this.token = null;
      this.user = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  }
});