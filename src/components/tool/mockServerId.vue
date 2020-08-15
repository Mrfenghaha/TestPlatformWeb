<template>
  <div>
    <el-page-header @back="goBack"></el-page-header>
    <div style="margin-top: 30px"></div>
    <el-tabs v-model="activeName">
      <el-tab-pane label="Mock详情" name="first"><detail v-if="isRouterAlive"/></el-tab-pane>
      <el-tab-pane label="Response配置" name="second"><response v-if="isRouterAlive"/></el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import mockServerDetail from './mockServerIdDetail'
import mockServerResponse from './mockServerIdResponse'
export default {
  name: "MockServerId",
  components: {
    detail: mockServerDetail,
    response: mockServerResponse
  },

  provide () {
    return {
      reload: this.reload
    }
  },

  methods: {
    goBack() {
      this.$router.replace('/tool/mock-server')
    },

    // 实现局部刷新
    reload() {
      this.isRouterAlive = false
      this.$nextTick(function(){
        this.isRouterAlive = true
      })
    }
  },
  data() {
    return {
      // 默认进入的页签
      activeName: "first",
      // 局部刷新
      isRouterAlive: true
    };
  }
};
</script>

<style>
</style>
