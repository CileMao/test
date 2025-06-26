<template>
  <div>
  <img alt="Vue logo" src="./assets/logo.png">
  <HelloWorld msg="Welcome to Your Vue.js App"/>
  <el-button type="success">成功按钮</el-button>
  </div>
  <router-view />
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'

export default {
  name: 'App',
  components: {
    HelloWorld
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
@media screen and (max-width: 768px) {
  .el-container {
    flex-direction: column;
  }
  
  .el-aside {
    width: 100% !important;
  }
  
  .map-container {
    min-height: 300px;
  }
  
  .el-header h1 {
    font-size: 1.2rem;
  }
  
  .toolbar .el-button-group {
    display: flex;
    flex-wrap: wrap;
  }
}
</style>
