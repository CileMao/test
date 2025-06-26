<template>
  <div class="home-container">
    <el-container>
      <el-header>
        <h1>数字土壤WebGIS系统</h1>
        <div class="user-info">
          <span>欢迎, {{ username }}</span>
          <el-button @click="logout" size="small">退出</el-button>
        </div>
      </el-header>
      
      <el-container>
        <el-aside width="300px">
          <el-tabs v-model="activeTab">
            <el-tab-pane label="土壤查询" name="query">
              <SoilQueryForm 
                @query="handleQuery"
                @reset="handleReset"
              />
            </el-tab-pane>
            
            <el-tab-pane label="专题分析" name="thematic">
              <el-radio-group v-model="thematicType">
                <el-radio-button label="ph">pH值分布</el-radio-button>
                <el-radio-button label="organic">有机质含量</el-radio-button>
              </el-radio-group>
              
              <div class="stats-section" v-if="statsResult">
                <h3>统计结果</h3>
                <p>酸化地块数: {{ statsResult.plotCount }}</p>
                <p>总面积: {{ statsResult.totalArea.toFixed(2) }} 平方米</p>
              </div>
            </el-tab-pane>
          </el-tabs>
        </el-aside>
        
        <el-main>
          <div class="toolbar">
            <el-button-group>
              <el-button 
                :type="activeTool === 'select' ? 'primary' : ''"
                @click="setActiveTool('select')"
              >选择</el-button>
              <el-button 
                :type="activeTool === 'draw' ? 'primary' : ''"
                @click="setActiveTool('draw')"
              >拉框统计</el-button>
            </el-button-group>
          </div>
          
          <MapContainer
            ref="map"
            :active-tool="activeTool"
            :thematic-type="thematicType"
            @feature-selected="handleFeatureSelected"
            @draw-complete="handleDrawComplete"
          />
          
          <el-dialog 
            title="地块详情" 
            :visible.sync="featureDialogVisible"
            width="50%"
          >
            
          </el-dialog>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import MapContainer from '../components/gis/SoilMap.vue';
import SoilQuery from '../components/gis/SoilQuery.vue';
//import SoilFeatureDetail from '../components/gis/SoilFeatureDetail';

export default {
  name: 'Home',
  components: {
    MapContainer,
    SoilQuery,
    //SoilFeatureDetail,,,<SoilFeatureDetail :feature="selectedFeature" />
  },
  data() {
    return {
      username: localStorage.getItem('username') || '用户',
      activeTab: 'query',
      activeTool: 'select',
      thematicType: '',
      selectedFeature: null,
      featureDialogVisible: false,
      statsResult: null
    };
  },
  methods: {
    logout() {
      this.$api.auth.logout().then(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        this.$router.push('/login');
      });
    },
    
    setActiveTool(tool) {
      this.activeTool = tool;
    },
    
    handleQuery(queryParams) {
      this.$refs.map.loadSoilData(queryParams);
    },
    
    handleReset() {
      this.$refs.map.loadSoilData();
    },
    
    handleFeatureSelected(feature) {
      this.selectedFeature = feature;
      this.featureDialogVisible = true;
    },
    
    handleDrawComplete(geometry) {
      const extent = geometry.getExtent();
      const [minX, minY, maxX, maxY] = extent;
      
      this.$api.soil.statsAcidSoil(minX, minY, maxX, maxY, 5.5).then(response => {
        this.statsResult = response.data;
      });
    }
  }
};
</script>

<style scoped>
.home-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.el-header {
  background-color: #409EFF;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.toolbar {
  margin-bottom: 10px;
}

.stats-section {
  margin-top: 20px;
  padding: 10px;
  background-color: #f5f5f5;
  border-radius: 4px;
}
</style>