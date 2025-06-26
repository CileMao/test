<!-- views/Login.vue -->
<template>
  <div class="login-container">
    <el-form :model="form" :rules="rules" ref="formRef" label-width="80px">
      <el-form-item label="用户名" prop="username">
        <el-input v-model="form.username" />
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="form.password" type="password" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleLogin">登录</el-button>
        <el-button @click="goRegister">注册</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/store/auth.js';
import soilApi from '../api/soil.js';

const router = useRouter();
const authStore = useAuthStore();

const form = reactive({
  username: '',
  password: ''
});

const formRef = ref(null);

const rules = reactive({
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' }
  ]
});

// 修正后的登录处理函数
const handleLogin = async () => {
  try {
    const response = await soilApi.login(form.value.username, form.value.password);
    if (response.data === '登录成功') {
      // 登录成功后的处理，例如保存 token 和用户信息
      authStore.login('token', { username: form.value.username });
      router.push('/map');
    } else {
      ElMessage.error(response.data);
    }
  } catch (error) {
    ElMessage.error('登录失败: ' + error.message);
  }
};

const goRegister = () => {
  router.push('/register');
};
</script>