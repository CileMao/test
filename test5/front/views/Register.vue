<template>
  <div class="register-container">
    <el-form @submit.prevent="handleRegister">
      <el-input v-model="form.username" placeholder="用户名" />
      <el-input v-model="form.password" type="password" placeholder="密码" />
      <el-input v-model="form.email" placeholder="邮箱" />
      <el-input v-model="form.role" placeholder="角色" />
      <el-button type="primary" native-type="submit">注册</el-button>
    </el-form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import soilApi from '../api/soil.js';
import { useRouter } from 'vue-router';

const router = useRouter();
const form = ref({ username: '', password: '', email: '', role: '' });

const handleRegister = async () => {
  try {
    const response = await soilApi.register(form.value.username, form.value.password, form.value.email, form.value.role);
    if (response.data === '注册成功') {
      ElMessage.success('注册成功，请登录');
      router.push('/login');
    } else {
      ElMessage.error(response.data);
    }
  } catch (error) {
    ElMessage.error('注册失败: ' + error.message);
  }
};
</script>