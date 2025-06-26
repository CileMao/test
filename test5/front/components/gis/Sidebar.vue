<template>
  <aside 
    class="sidebar-width bg-white shadow-lg fixed left-0 top-16 bottom-0 z-40 overflow-y-auto transition-transform duration-300"
    :class="{'translate-x-0': open, '-translate-x-full': !open}"
  >
    <div class="p-4">
      <div class="flex justify-between items-center mb-3">
        <h2 class="text-lg font-semibold text-gray-800">图层控制</h2>
        <button @click="$emit('toggle-sidebar')" class="md:hidden p-1 rounded hover:bg-gray-100">
          <i class="fa fa-times text-gray-600"></i>
        </button>
      </div>
      
      <div class="space-y-3">
        <!-- 底图图层 -->
        <div class="p-3 bg-gray-50 rounded-lg shadow-sm">
          <h3 class="font-medium text-gray-700 mb-2 flex items-center">
            <i class="fa fa-globe mr-2 text-primary"></i>底图图层
          </h3>
          <div class="space-y-2">
            <div class="flex items-center">
              <input 
                type="radio" 
                id="osm" 
                name="basemap" 
                class="mr-2 accent-primary" 
                value="osm"
                checked
                @change="$emit('change-basemap', 'osm')"
              >
              <label for="osm" class="text-gray-700">OpenStreetMap</label>
            </div>
            <div class="flex items-center">
              <input 
                type="radio" 
                id="esri" 
                name="basemap" 
                class="mr-2 accent-primary"
                value="esri"
                @change="$emit('change-basemap', 'esri')"
              >
              <label for="esri" class="text-gray-700">ESRI卫星影像</label>
            </div>
          </div>
        </div>

        <!-- 专题图层 -->
        <div class="p-3 bg-gray-50 rounded-lg shadow-sm">
          <h3 class="font-medium text-gray-700 mb-2 flex items-center">
            <i class="fa fa-layers mr-2 text-primary"></i>专题图层
          </h3>
          <div class="map-controls flex flex-wrap gap-2">
            <button 
              @click="$emit('change-layer', 'soilType')"
              :class="{'btn-active': activeLayer === 'soilType'}"
              class="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 transition"
            >
              土壤速效钾
            </button>
            <button 
              @click="$emit('change-layer', 'organicMatter')"
              :class="{'btn-active': activeLayer === 'organicMatter'}"
              class="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 transition"
            >
              土壤有机质
            </button>
          </div>
        </div>

        <!-- 透明度调整 -->
        <div class="p-3 bg-gray-50 rounded-lg shadow-sm">
          <h3 class="font-medium text-gray-700 mb-2 flex items-center">
            <i class="fa fa-sliders mr-2 text-primary"></i>透明度调整
          </h3>
          <div>
            <input 
              type="range" 
              v-model="localOpacity"
              min="0" 
              max="100" 
              class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
              @input="handleOpacityChange"
            >
            <div class="flex justify-between text-xs text-gray-500 mt-1">
              <span>0%</span>
              <span>100%</span>
            </div>
          </div>
        </div>
        
        <!-- 土壤查询表单 -->
        <div class="p-3 bg-gray-50 rounded-lg shadow-sm">
          <h3 class="font-medium text-gray-700 mb-2 flex items-center">
            <i class="fa fa-search mr-2 text-primary"></i>土壤属性查询
          </h3>
          <div class="space-y-2">
            <div class="flex items-center">
              <label class="w-24 text-gray-700">pH范围:</label>
              <input type="number" v-model="queryParams.phMin" class="w-20 px-2 py-1 border rounded" placeholder="最小值" step="0.1" min="0" max="14">
              <span class="mx-2">-</span>
              <input type="number" v-model="queryParams.phMax" class="w-20 px-2 py-1 border rounded" placeholder="最大值" step="0.1" min="0" max="14">
            </div>
            <div class="flex items-center">
              <label class="w-24 text-gray-700">有机质含量:</label>
              <input type="number" v-model="queryParams.organicMin" class="w-20 px-2 py-1 border rounded" placeholder="最小值" step="0.1" min="0">
              <span class="mx-2">-</span>
              <input type="number" v-model="queryParams.organicMax" class="w-20 px-2 py-1 border rounded" placeholder="最大值" step="0.1" min="0">
            </div>
            <button 
              @click="executeQuery"
              class="w-full mt-2 py-2 bg-primary text-white rounded hover:bg-blue-600 transition"
            >
              查询
            </button>
          </div>
        </div>
        
        <!-- 区域统计功能 -->
        <div class="p-3 bg-gray-50 rounded-lg shadow-sm">
          <h3 class="font-medium text-gray-700 mb-2 flex items-center">
            <i class="fa fa-calculator mr-2 text-primary"></i>区域统计分析
          </h3>
          <div class="space-y-2">
            <div class="flex items-center">
              <label class="text-gray-700 mr-2">pH阈值:</label>
              <input type="number" v-model="acidThreshold" class="w-20 px-2 py-1 border rounded" value="5.5" step="0.1" min="0" max="14">
            </div>
            <button 
              @click="initAreaDraw"
              class="w-full py-2 bg-accent text-white rounded hover:bg-orange-600 transition"
            >
              绘制统计区域
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="p-4 border-t border-gray-200">
      <h3 class="font-medium text-gray-700 mb-2 flex items-center">
        <i class="fa fa-info-circle mr-2 text-primary"></i>地图信息
      </h3>
      <div class="bg-gray-50 p-3 rounded-lg text-sm text-gray-600">
        <p>当前图层: {{ activeLayer === 'soilType' ? '土壤速效钾' : '土壤有机质' }}</p>
      </div>
    </div>
  </aside>
</template>

<script>
import { ref, reactive, watch } from 'vue';

export default {
  name: 'Sidebar',
  props: {
    open: Boolean,
    activeLayer: String,
    opacity: Number,
    statResult: Object
  },
  emits: [
    'toggle-sidebar',
    'change-basemap',
    'change-layer',
    'change-opacity',
    'execute-query',
    'init-area-draw'
  ],
  setup(props, { emit }) {
    const localOpacity = ref(props.opacity);
    const queryParams = reactive({
      phMin: null,
      phMax: null,
      organicMin: null,
      organicMax: null
    });
    const acidThreshold = ref(5.5);
    
    watch(() => props.opacity, (newVal) => {
      localOpacity.value = newVal;
    });
    
    const handleOpacityChange = () => {
      emit('change-opacity', localOpacity.value);
    };
    
    const executeQuery = () => {
      if (!queryParams.phMin && !queryParams.phMax && 
          !queryParams.organicMin && !queryParams.organicMax) {
        alert('请输入至少一个查询条件');
        return;
      }
      emit('execute-query', {...queryParams});
    };
    
    const initAreaDraw = () => {
      emit('init-area-draw', acidThreshold.value);
    };
    
    return {
      localOpacity,
      queryParams,
      acidThreshold,
      handleOpacityChange,
      executeQuery,
      initAreaDraw
    };
  }
};
</script>

<style scoped>
.sidebar-width {
  width: 300px;
}

.btn-active {
  background-color: #22c55e !important;
  color: white !important;
}

@media (max-width: 768px) {
  .sidebar-width {
    width: 85vw;
  }
}
</style>