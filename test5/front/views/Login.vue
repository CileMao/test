<!-- LoginView.vue -->
<template>
  <div class="login-container">
    <el-form @submit.prevent="handleLogin">
      <el-input v-model="form.username" placeholder="用户名" />
      <el-input v-model="form.password" type="password" placeholder="密码" />
      <el-button type="primary" native-type="submit">登录</el-button>
    </el-form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '../store/auth.store'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()
const form = ref({ username: '', password: '' })

const handleLogin = async () => {
  try {
    await authStore.login(form.value)
    router.push('/map')
  } catch (error) {
    ElMessage.error('登录失败: ' + error.message)
  }
}
</script>