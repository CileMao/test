// src/store/soil.store.js
import { defineStore } from 'pinia';
import soilApi from '../api/soil.js';

export const useSoilStore = defineStore('soil', {
  state: () => ({
    acidAreas: [], // 酸化地块数据
    queryResults: [], // 查询结果
    statResult: null, // 统计结果
    isLoading: false // 加载状态
  }),
  actions: {
    // 获取酸化地块数据
    async getAcidAreas(geometry, maxPH = 5.5) {
      try {
        this.isLoading = true;
        const response = await soilApi.getAcidAreas(geometry, maxPH);
        
        // 保存结果
        this.acidAreas = response.data.features;
        this.statResult = {
          plotCount: response.data.plotCount,
          totalArea: response.data.totalArea,
          avgPH: response.data.avgPH
        };
        
        return response.data;
      } catch (error) {
        console.error('获取酸化地块失败:', error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },
    
    // 执行土壤属性查询
    async queryProperties(params) {
      try {
        this.isLoading = true;
        const response = await soilApi.queryProperties(params);
        this.queryResults = response.data;
        return response.data;
      } catch (error) {
        console.error('土壤属性查询失败:', error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },
    
    // 清除查询结果
    clearResults() {
      this.acidAreas = [];
      this.queryResults = [];
      this.statResult = null;
    }
  },
  getters: {
    // 获取酸化地块数量
    acidPlotCount: (state) => state.acidAreas.length,
    
    // 获取酸化总面积
    acidTotalArea: (state) => state.acidAreas.reduce((sum, area) => sum + area.properties.area, 0)
  }
});