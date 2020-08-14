<template>
  <div id="headTop">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item v-for="(item, index) in $route.meta" :key="index">{{item}}</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="avatar">
      <el-avatar :size="40" icon="el-icon-user-solid"></el-avatar>
    </div>
  </div>
</template>

<script>
export default {
  name: "headTop"
}
</script>

<style scoped>
  #headTop{
    height: 60px;
    background-color: #EFF2F7;
    align-items: center;
    display: flex;
    /* width: 100%; */
  }

  .el-breadcrumb {
    font-size: 13px;
    line-height: 1;
    padding-left: 25px;
    position:absolute;
  }

  .avatar{
  margin-left: 90%;
  }
</style>
