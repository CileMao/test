import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import FujianSoilMap from '../views/FujianSoilMap.vue';
const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: { requiresAuth: true }
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
  path: '/users',
  name: 'UserManage',
  component: () => import('../views/UserManage.vue'),
  meta: { 
    requiresAuth: true,
    title: '用户管理'
  }
},
  {
    path: '/fujian-soil',
    name: 'FujianSoilMap',
    component: FujianSoilMap,
    meta: {
      title: '福建省土壤专题图'
    }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

// 路由守卫 - 检查登录状态
router.beforeEach((to, from, next) => {
  const isAuthenticated = store.state.user.isAuthenticated
  document.title = to.meta.title || '土壤GIS应用';
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!isAuthenticated) {
      next({ name: 'Login' })
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router