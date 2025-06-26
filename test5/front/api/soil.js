// src/api/soil.js
import request from '../utils/request.js';

export default {
  
  // 获取酸化土壤统计信息
    getAcidSoilStats(threshold) {
        return request.get('/soil/acid-stats', { params: { threshold } });
    },

    // 获取酸化土壤面积
    getAcidSoilArea(threshold) {
        return request.get('/soil/acid-area', { params: { threshold } });
    },
  // 获取酸化土壤区域
  getAcidAreas(geometry, maxPH) {
    // 将几何对象转换为GeoJSON格式
    const geoJson = typeof geometry === 'object' 
      ? JSON.stringify(geometry) 
      : geometry;
    
    return request.post('/soil/analysis/acid-areas', {
      geometry: geoJson,
      maxPH
    });
  },
  
  // 土壤属性查询
  queryProperties(params) {
    return request.get('/soil/properties', { params });
  },
  
  // 用户登录
  login(username, password) {
    return request.post('/soil-app/api/auth/login', {
      username,
      password
    });
  },
  
  // 获取用户信息
  getUserInfo() {
    return request.get('/auth/user-info');
  },
  
  // 获取所有用户
  getAllUsers() {
    return request.get('/admin/users');
  },
  
  // 创建用户
   register(username, password, email, role) {
    return request.post('/soil-app/api/auth/register', {
      username,
      password,
      email,
      role
    });
  },

  
  // 更新用户
  updateUser(userId, userData) {
    return request.put(`/admin/users/${userId}`, userData);
  },
  
  // 删除用户
  deleteUser(userId) {
    return request.delete(`/admin/users/${userId}`);
  }
};