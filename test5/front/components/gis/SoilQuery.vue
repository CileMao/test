<template>
  <van-popup v-model:show="showQuery" position="top">
    <van-form @submit="executeQuery">
      <van-field
        v-model="queryParams.phMin"
        label="pH最小值"
        type="number"
        step="0.1"
      />
      <van-field
        v-model="queryParams.phMax"
        label="pH最大值"
        type="number"
        step="0.1"
      />
      <van-field
        v-model="queryParams.organicMin"
        label="有机质(%)"
        type="number"
        step="0.1"
      />
      <van-button block type="primary">查询</van-button>
    </van-form>
  </van-popup>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'

const showQuery = ref(false)
const queryParams = ref({
  phMin: null,
  phMax: null,
  organicMin: null
})

// 执行查询
const executeQuery = async () => {
  try {
    const response = await axios.get('/api/soil/query', {
      params: queryParams.value
    })
    
    // 处理查询结果
    processQueryResults(response.data)
    showQuery.value = false
  } catch (error) {
    console.error('查询失败:', error)
  }
}

// 暴露方法给父组件
defineExpose({ show: () => showQuery.value = true })
</script>