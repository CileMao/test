// src/store/map.store.js
import { defineStore } from 'pinia';

export const useMapStore = defineStore('map', {
  state: () => ({
    map: null, // Leaflet地图实例
    highlightLayers: [], // 高亮图层数组
    activeBasemap: 'osm', // 当前底图
    activeThematicLayer: null, // 当前专题图层
    mapCenter: [26.09, 118.31], // 地图中心点
    zoomLevel: 7 // 缩放级别
  }),
  actions: {
    // 设置地图实例
    setMap(mapInstance) {
      this.map = mapInstance;
    },
    
    // 添加高亮图层
    addHighlightLayer(layer) {
      if (this.map && layer) {
        layer.addTo(this.map);
        this.highlightLayers.push(layer);
      }
    },
    
    // 清除所有高亮图层
    clearHighlightLayers() {
      this.highlightLayers.forEach(layer => {
        if (this.map && layer) {
          this.map.removeLayer(layer);
        }
      });
      this.highlightLayers = [];
    },
    
    // 设置底图
    setBasemap(basemap) {
      this.activeBasemap = basemap;
    },
    
    // 设置专题图层
    setThematicLayer(layer) {
      this.activeThematicLayer = layer;
    },
    
    // 设置地图视图
    setView(center, zoom) {
      this.mapCenter = center;
      this.zoomLevel = zoom;
      if (this.map) {
        this.map.setView(center, zoom);
      }
    }
  }
});