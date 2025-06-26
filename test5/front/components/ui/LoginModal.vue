<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 z-[100] flex items-center justify-center">
    <div class="bg-white rounded-lg p-6 w-full max-w-md mx-4">
      <h2 class="text-xl font-bold text-gray-800 mb-4">用户登录</h2>
      <form @submit.prevent="handleSubmit">
        <div class="mb-4">
          <label class="block text-gray-700 mb-2" for="username">用户名</label>
          <input 
            type="text" 
            id="username" 
            v-model="credentials.username"
            class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            required
          >
        </div>
        <div class="mb-4">
          <label class="block text-gray-700 mb-2" for="password">密码</label>
          <input 
            type="password" 
            id="password" 
            v-model="credentials.password"
            class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            required
          >
        </div>
        <div class="flex justify-end space-x-3">
          <button 
            type="button" 
            @click="$emit('close')"
            class="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            取消
          </button>
          <button 
            type="submit"
            class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600"
          >
            登录
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { reactive } from 'vue';

export default {
  name: 'LoginModal',
  emits: ['login', 'close'],
  setup(props, { emit }) {
    const credentials = reactive({
      username: '',
      password: ''
    });
    
    const handleSubmit = () => {
      emit('login', {...credentials});
    };
    
    return {
      credentials,
      handleSubmit
    };
  }
};
</script>