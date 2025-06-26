<template>
  <div class="area-stat-drawer">
    <div class="toolbar">
      <van-button 
        v-for="tool in drawingTools"
        :key="tool.type"
        :type="activeTool === tool.type ? 'primary' : 'default'"
        size="small"
        @click="activateTool(tool.type)"
      >
        <van-icon :name="tool.icon" />
        {{ tool.label }}
      </van-button>
      
      <van-button 
        type="danger" 
        size="small"
        @click="clearDrawings"
      >
        <van-icon name="delete" />
        清除
      </van-button>
    </div>
    
    <div v-if="statResult" class="stat-result">
      <van-cell-group>
        <van-cell title="酸化地块数量" :value="statResult.plotCount" />
        <van-cell title="酸化总面积" :value="`${statResult.totalArea.toFixed(2)} km²`" />
        <van-cell title="平均pH值" :value="statResult.avgPH.toFixed(2)" />
      </van-cell-group>
      
      <van-button 
        block 
        type="primary" 
        @click="exportResults"
        class="mt-2"
      >
        导出结果
      </van-button>
    </div>
    
    <div v-else class="instruction">
      <van-icon name="info" class="text-blue-500" />
      <span class="ml-1">请在地图上绘制区域进行统计分析</span>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import L from 'leaflet';
import 'leaflet-draw/dist/leaflet.draw.css';
import { useMapStore } from '@/stores/map';
import { useSoilStore } from '@/stores/soil';
import { showToast } from 'vant';

const mapStore = useMapStore();
const soilStore = useSoilStore();

// 绘图工具配置
const drawingTools = ref([
  { type: 'rectangle', icon: 'stop-circle-o', label: '矩形' },
  { type: 'polygon', icon: 'flower-o', label: '多边形' },
  { type: 'circle', icon: 'circle', label: '圆形' }
]);

const activeTool = ref(null);
const drawControl = ref(null);
const statResult = ref(null);

// 激活绘图工具
const activateTool = (toolType) => {
  // 清除之前的绘图工具
  if (drawControl.value) {
    mapStore.map.removeControl(drawControl.value);
  }
  
  // 设置当前激活工具
  activeTool.value = toolType;
  
  // 配置绘图选项
  const drawOptions = {
    rectangle: {
      shapeOptions: {
        color: '#3388ff',
        weight: 2,
        fillOpacity: 0.2
      }
    },
    polygon: {
      shapeOptions: {
        color: '#3388ff',
        weight: 2,
        fillOpacity: 0.2
      }
    },
    circle: {
      shapeOptions: {
        color: '#3388ff',
        weight: 2,
        fillOpacity: 0.2
      }
    }
  };
  
  // 创建绘图控件
  drawControl.value = new L.Draw[capitalizeFirstLetter(toolType)](
    mapStore.map,
    drawOptions[toolType]
  );
  
  // 启用绘图工具
  drawControl.value.enable();
  
  // 监听绘图完成事件
  mapStore.map.on(L.Draw.Event.CREATED, handleDrawCreated);
};

// 处理绘图完成事件
const handleDrawCreated = async (e) => {
  const layer = e.layer;
  const geometry = layer.toGeoJSON().geometry;
  
  // 添加到地图
  layer.addTo(mapStore.map);
  
  try {
    // 获取酸化地块数据
    const result = await soilStore.getAcidAreas(geometry, 5.5);
    statResult.value = result;
    
    // 高亮显示酸化地块
    highlightAcidAreas(result.features);
    
    showToast({
      type: 'success',
      message: `找到 ${result.plotCount} 个酸化地块`,
    });
  } catch (error) {
    console.error('获取酸化地块失败:', error);
    showToast({
      type: 'fail',
      message: '获取酸化地块数据失败',
    });
  } finally {
    // 禁用绘图工具
    if (drawControl.value) {
      drawControl.value.disable();
    }
    activeTool.value = null;
  }
};

// 高亮显示酸化地块
const highlightAcidAreas = (features) => {
  // 清除之前的高亮
  mapStore.clearHighlightLayers();
  
  // 创建GeoJSON图层
  const geoJsonLayer = L.geoJSON(features, {
    style: {
      color: '#ff0000',
      weight: 2,
      fillOpacity: 0.3
    },
    onEachFeature: (feature, layer) => {
      // 添加弹出信息
      const popupContent = `
        <div class="feature-popup">
          <h4>酸化地块</h4>
          <p>地块ID: ${feature.properties.id}</p>
          <p>pH值: ${feature.properties.pH.toFixed(2)}</p>
          <p>面积: ${(feature.properties.area / 10000).toFixed(2)} 公顷</p>
        </div>
      `;
      layer.bindPopup(popupContent);
    }
  }).addTo(mapStore.map);
  
  // 保存到store以便后续清除
  mapStore.addHighlightLayer(geoJsonLayer);
};

// 清除所有绘图
const clearDrawings = () => {
  if (drawControl.value) {
    mapStore.map.removeControl(drawControl.value);
    drawControl.value = null;
  }
  
  mapStore.clearHighlightLayers();
  statResult.value = null;
  activeTool.value = null;
  
  // 移除绘图事件监听器
  mapStore.map.off(L.Draw.Event.CREATED, handleDrawCreated);
};

// 导出结果
const exportResults = () => {
  if (!statResult.value) return;
  
  // 创建CSV内容
  let csvContent = "地块ID,经度,纬度,pH值,面积(km²)\n";
  
  statResult.value.features.forEach(feature => {
    const center = L.GeoJSON.coordsToLatLng(
      feature.geometry.coordinates[0][0]
    );
    
    csvContent += `${feature.properties.id},${center.lng},${center.lat},${feature.properties.pH},${feature.properties.area}\n`;
  });
  
  // 创建下载链接
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `酸化地块统计_${new Date().toISOString().slice(0,10)}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  showToast({
    type: 'success',
    message: '导出成功',
  });
};

// 工具函数：首字母大写
const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

// 组件卸载时清理
onBeforeUnmount(() => {
  clearDrawings();
});
</script>

<style scoped>
.area-stat-drawer {
  background-color: white;
  padding: 12px;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  margin-top: 10px;
}

.toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 12px;
}

.stat-result {
  background-color: #f9f9f9;
  border-radius: 6px;
  padding: 10px;
  margin-top: 10px;
}

.instruction {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px;
  background-color: #f0f7ff;
  border-radius: 6px;
  color: #1989fa;
  font-size: 14px;
}

.mt-2 {
  margin-top: 8px;
}
</style>