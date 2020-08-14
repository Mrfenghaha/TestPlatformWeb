<template>
  <div>
    <el-page-header @back="goBack"></el-page-header>
    <div style="margin-top: 30px"></div>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="Mock详情" name="first"><detail></detail></el-tab-pane>
      <el-tab-pane label="Response配置" name="second"><response></response></el-tab-pane>
    </el-tabs>
  </div>
</template>


<script>
import mockServerDetail from './mockServerIdDetail'
import mockServerResponse from './mockServerIdResponse'
export default {
  name: "MockServerId",
  inject: ["reload"],
  components: {
    detail: mockServerDetail,
    response: mockServerResponse
  },
  methods: {
    goBack() {
      this.$router.replace('/tool/mock-server')
    },
    handleClick(tab, event) {
      // console.log(tab, event);
    }
  },
  data() {
    return {
      activeName: "first"
    };
  }
};
</script>

<style>
</style>
