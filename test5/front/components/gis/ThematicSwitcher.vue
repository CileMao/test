<template>
  <div class="thematic-controls">
    <el-button @click="switchLayer('ph')">pH分布图</el-button>
    <el-button @click="switchLayer('organic')">有机质分布图</el-button>
  </div>
</template>

<script setup>
import { useMapStore } from '@/stores/map'

const mapStore = useMapStore()

const switchLayer = (layerType) => {
  mapStore.setActiveLayer(layerType)
}
</script>