<!-- src/components/gis/SoilMap.vue -->
<template>
  <div class="flex-1 map-height ml-0 transition-all duration-300" :class="{'ml-[300px]': sidebarOpen}">
    <div ref="mapContainer" class="w-full h-full"></div>
    
    <!-- 加载指示器 -->
    <div v-if="loading" class="loading-indicator">
      <van-loading type="spinner" size="24px" vertical>
        加载图层中...
      </van-loading>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useMapStore } from '../../store/map.store.js';
import { useSoilStore } from '../../store/soil.store.js';
export default {
  name: 'SoilMap',
  props: {
    sidebarOpen: Boolean,
    activeLayer: String,
    opacity: Number
  },
  emits: ['map-mounted'],
  setup(props, { emit }) {
    const mapContainer = ref(null);
    const map = ref(null);
    const osmLayer = ref(null);
    const esriLayer = ref(null);
    const wmsLayer = ref(null);
    const loading = ref(false);
    
    const mapStore = useMapStore();
    const soilStore = useSoilStore();
    
    const geoserverConfig = {
      url: 'http://localhost:8080/geoserver/wms',
      workspace: 'test',
      layerGroups: {
        'soilType': '福建土壤速效钾专题图',
        'organicMatter': '福建土壤有机质专题图'
      }
    };
    
    // 监听 activeLayer 变化
    watch(() => props.activeLayer, (newLayer) => {
      if (newLayer) {
        updateThematicLayer(newLayer);
      }
    });
    
    // 监听透明度变化
    watch(() => props.opacity, (newOpacity) => {
      setLayerOpacity(newOpacity / 100);
    });
    
    onMounted(() => {
      initMap();
    });
    
    onBeforeUnmount(() => {
      if (map.value) {
        map.value.remove();
      }
      mapStore.clearHighlightLayers();
    });
    
    const initMap = () => {
      map.value = L.map(mapContainer.value).setView(mapStore.mapCenter, mapStore.zoomLevel);
      
      // 添加OpenStreetMap底图
      osmLayer.value = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19
      }).addTo(map.value);
      
      // 添加ESRI卫星影像底图
      esriLayer.value = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
        maxZoom: 19
      });
      
      // 添加初始专题图层
      addWmsLayer(props.activeLayer || 'soilType');
      
      // 添加比例尺控件
      L.control.scale({ position: 'bottomleft' }).addTo(map.value);
      
      // 添加缩放控件
      L.control.zoom({ position: 'topleft' }).addTo(map.value);
      
      // 将地图实例存入store
      mapStore.setMap(map.value);
      
      emit('map-mounted', map.value);
    };
    
    // 添加或更新专题图层
    const addWmsLayer = (layerKey) => {
      // 移除旧图层
      if (wmsLayer.value) {
        map.value.removeLayer(wmsLayer.value);
      }
      
      loading.value = true;
      
      const layerName = geoserverConfig.layerGroups[layerKey];
      
      if (!layerName) {
        console.error(`未找到图层配置: ${layerKey}`);
        loading.value = false;
        return;
      }
      
      wmsLayer.value = L.tileLayer.wms(geoserverConfig.url, {
        layers: `${geoserverConfig.workspace}:${layerName}`,
        format: 'image/png',
        transparent: true,
        version: '1.1.0',
        attribution: 'GeoServer图层',
        tileSize: 256,
        detectRetina: true
      }).addTo(map.value);
      
      // 设置初始透明度
      setLayerOpacity(props.opacity / 100);
      
      // 保存到store
      mapStore.setThematicLayer(wmsLayer.value);
      
      // 模拟加载完成
      setTimeout(() => {
        loading.value = false;
      }, 500);
    };
    
    // 更新专题图层（供外部调用）
    const updateThematicLayer = (layerKey) => {
      addWmsLayer(layerKey);
    };
    
    // 设置图层透明度
    const setLayerOpacity = (value) => {
      if (wmsLayer.value) {
        wmsLayer.value.setOpacity(value);
      }
    };
    
    // 切换底图
    const changeBasemap = (basemap) => {
      if (basemap === 'osm') {
        map.value.removeLayer(esriLayer.value);
        map.value.addLayer(osmLayer.value);
        mapStore.setBasemap('osm');
      } else if (basemap === 'esri') {
        map.value.removeLayer(osmLayer.value);
        map.value.addLayer(esriLayer.value);
        mapStore.setBasemap('esri');
      }
    };
    
    // 执行土壤查询
    const executeSoilQuery = async (queryParams) => {
      try {
        loading.value = true;
        await soilStore.queryProperties(queryParams);
        
        // 在地图上显示查询结果
        displayQueryResults(soilStore.queryResults);
      } catch (error) {
        console.error('土壤查询失败:', error);
      } finally {
        loading.value = false;
      }
    };
    
    // 在地图上显示查询结果
    const displayQueryResults = (results) => {
      // 清除之前的结果
      mapStore.clearHighlightLayers();
      
      if (results.length === 0) {
        L.popup()
          .setLatLng(map.value.getCenter())
          .setContent('未找到符合条件的土壤地块')
          .openOn(map.value);
        return;
      }
      
      // 创建GeoJSON图层
      const geoJsonLayer = L.geoJSON(results, {
        pointToLayer: (feature, latlng) => {
          return L.circleMarker(latlng, {
            radius: 8,
            fillColor: "#ff7800",
            color: "#000",
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8
          });
        },
        onEachFeature: (feature, layer) => {
          // 添加弹出信息
          const popupContent = `
            <div class="feature-popup">
              <h4>地块 ${feature.properties.id}</h4>
              <p>pH值: ${feature.properties.pH}</p>
              <p>有机质含量: ${feature.properties.organic_matter}%</p>
              <p>位置: ${feature.properties.location}</p>
            </div>
          `;
          layer.bindPopup(popupContent);
        }
      }).addTo(map.value);
      
      // 保存到store
      mapStore.addHighlightLayer(geoJsonLayer);
      
      // 调整视图以包含所有结果
      map.value.fitBounds(geoJsonLayer.getBounds());
    };
    
    // 初始化区域绘制
    const initAreaDraw = (threshold) => {
      console.log('初始化区域绘制', threshold);
      // 实际实现应在此处添加绘图工具
      // 现在只是演示
      loading.value = true;
      
      // 模拟API调用
      setTimeout(() => {
        loading.value = false;
        const area = (Math.random() * 50 + 10).toFixed(2);
        const count = Math.floor(Math.random() * 20) + 5;
        
        L.popup()
          .setLatLng(map.value.getCenter())
          .setContent(`在选定区域内找到 ${count} 个酸化地块<br>总面积: ${area} km²`)
          .openOn(map.value);
      }, 1500);
    };
    
    return {
      mapContainer,
      loading,
      changeBasemap,
      updateThematicLayer,
      setLayerOpacity,
      executeSoilQuery,
      initAreaDraw
    };
  }
};
</script>

<style scoped>
.map-height {
  height: calc(100vh - 64px);
}

.loading-indicator {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1001;
  background: rgba(255, 255, 255, 0.8);
  padding: 15px 25px;
  border-radius: 8px;
  font-weight: bold;
}
</style>