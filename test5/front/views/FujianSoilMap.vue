<template>
  <div class="font-inter bg-gray-100 min-h-screen">
    <AppHeader :title="title" :user="user" @login="showLoginModal = true" @logout="handleLogout" />
    
    <div class="pt-16 flex">
      <Sidebar 
        :sidebarOpen="sidebarOpen"
        :activeLayer="activeLayer"
        :opacity="opacity"
        :statResult="statResult"
        @toggle-sidebar="sidebarOpen = !sidebarOpen"
        @change-basemap="changeBasemap"
        @change-layer="changeLayer"
        @change-opacity="changeOpacity"
        @execute-query="executeSoilQuery"
        @init-area-draw="initAreaDraw"
      />
      
      <SoilMap 
        ref="soilMap"
        :sidebarOpen="sidebarOpen"
        :activeLayer="activeLayer"
        :opacity="opacity"
        @map-mounted="onMapMounted"
      />
    </div>
    
    <LoginModal 
      v-if="showLoginModal"
      @login="handleLogin"
      @close="showLoginModal = false"
    />
  </div>
</template>

<script>
import { ref, reactive } from 'vue';
import AppHeader from '../components/ui/AppHeader.vue';
import Sidebar from '../components/gis/Sidebar.vue';
import SoilMap from '../components/gis/SoilMap.vue';
import LoginModal from '../components/ui/LoginModal.vue';
import soilApi from '../api/soil.js';

export default {
  name: 'FujianSoilMap',
  components: {
    AppHeader,
    Sidebar,
    SoilMap,
    LoginModal
  },
  setup() {
    const title = ref('福建省土壤专题图');
    const user = ref(null);
    const sidebarOpen = ref(false);
    const showLoginModal = ref(false);
    const activeLayer = ref('soilType');
    const opacity = ref(100);
    const statResult = reactive({
      visible: false,
      area: 0,
      count: 0
    });
    
    const soilMap = ref(null);
    
    const geoserverConfig = {
      url: 'http://localhost:8080/geoserver/wms',
      workspace: 'test',
      layerGroups: {
        'soilType': '福建土壤速效钾专题图',
        'organicMatter': '福建土壤有机质专题图'
      }
    };
    
    const onMapMounted = (mapInstance) => {
      console.log('地图已加载', mapInstance);
    };
    
    const changeBasemap = (basemap) => {
      if (soilMap.value) {
        soilMap.value.changeBasemap(basemap);
      }
    };
    
    const changeLayer = (layer) => {
      activeLayer.value = layer;
      if (soilMap.value) {
        soilMap.value.changeLayer(layer);
      }
    };
    
    const changeOpacity = (value) => {
      opacity.value = value;
      if (soilMap.value) {
        soilMap.value.setLayerOpacity(value / 100);
      }
    };
    
    const executeSoilQuery = (queryParams) => {
      console.log('执行土壤查询', queryParams);
      // 这里调用API执行查询
      if (soilMap.value) {
        soilMap.value.executeSoilQuery(queryParams);
      }
    };
    
    const initAreaDraw = (threshold) => {
      console.log('初始化区域绘制', threshold);
      if (soilMap.value) {
        soilMap.value.initAreaDraw(threshold);
      }
    };
    
    const handleLogin = (credentials) => {
      console.log('用户登录', credentials);
      // 这里调用API进行登录验证
      user.value = {
        username: credentials.username,
        role: 'admin'
      };
      showLoginModal.value = false;
    };
    
    const handleLogout = () => {
      user.value = null;
    };
    
    return {
      title,
      user,
      sidebarOpen,
      showLoginModal,
      activeLayer,
      opacity,
      statResult,
      soilMap,
      geoserverConfig,
      onMapMounted,
      changeBasemap,
      changeLayer,
      changeOpacity,
      executeSoilQuery,
      initAreaDraw,
      handleLogin,
      handleLogout
    };
  }
};
</script>

<style scoped>
/* 响应式布局 */
@media (max-width: 768px) {
  .map-height {
    height: calc(100vh - 56px);
  }
}
</style>