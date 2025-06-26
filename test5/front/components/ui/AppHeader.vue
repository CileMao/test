<template>
  <header class="bg-white shadow-md fixed top-0 left-0 right-0 z-50">
    <div class="container mx-auto px-4 py-3 flex justify-between items-center">
      <div class="flex items-center space-x-2">
        <i class="fa fa-map-o text-primary text-2xl"></i>
        <h1 class="text-xl font-bold text-gray-800">{{ title }}</h1>
      </div>
      
      <div class="flex items-center space-x-3">
        <!-- 用户登录状态 -->
        <div v-if="user" class="hidden md:flex items-center">
          <span class="text-sm text-gray-600 mr-2">欢迎, <span class="font-medium">{{ user.username }}</span></span>
          <button @click="$emit('logout')" class="text-sm text-red-500 hover:text-red-700">退出</button>
        </div>
        
        <button 
          v-else
          @click="$emit('login')"
          class="text-sm bg-primary text-white px-3 py-1 rounded hover:bg-blue-600 transition"
        >
          <i class="fa fa-user mr-1"></i>登录
        </button>
        
        <button 
          @click="$emit('toggle-sidebar')"
          class="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200 hidden md:block"
        >
          <i class="fa fa-bars text-gray-600"></i>
        </button>
        
        <button 
          @click="toggleFullscreen"
          class="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200 hidden md:block"
        >
          <i :class="fullscreenIcon"></i>
        </button>
      </div>
    </div>
  </header>
</template>

<script>
import { ref } from 'vue';

export default {
  name: 'AppHeader',
  props: {
    title: String,
    user: Object
  },
  emits: ['login', 'logout', 'toggle-sidebar'],
  setup() {
    const isFullscreen = ref(false);
    const fullscreenIcon = ref('fa fa-expand text-gray-600');
    
    const toggleFullscreen = () => {
      const docEl = document.documentElement;
      
      if (!document.fullscreenElement) {
        if (docEl.requestFullscreen) {
          docEl.requestFullscreen();
        }
        fullscreenIcon.value = 'fa fa-compress text-gray-600';
        isFullscreen.value = true;
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        }
        fullscreenIcon.value = 'fa fa-expand text-gray-600';
        isFullscreen.value = false;
      }
    };
    
    return {
      isFullscreen,
      fullscreenIcon,
      toggleFullscreen
    };
  }
};
</script>