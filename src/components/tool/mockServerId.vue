<template>
  <div>
    <el-page-header @back="goBack" :content="content"></el-page-header>
    <div style="margin-top: 30px"></div>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="Mock详情" name="first"><detail v-if="isRouterAlive"/></el-tab-pane>
      <el-tab-pane label="Response配置" name="second"><response v-if="isRouterAlive"/></el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import mockServerDetail from './mockServerIdDetail'
import mockServerResponse from './mockServerIdResponse'
import {toolMockServerGetMock} from '../../api/tool/mockServer'
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

    handleClick(){
      // this.reload()
    },

    // 实现局部刷新
    reload() {
      this.isRouterAlive = false
      this.$nextTick(function(){
        this.isRouterAlive = true
      })
    },

    getData(){
      toolMockServerGetMock(this.mock_id).then((response) => {
        response = response.data;
        if (response.success === true) {
          this.content = "/mock/" + response.data.url
        }
      }).catch(err => {
        // 对于200之外的错误status，需要添加err获取接口数据
        this.$message({type: 'error',message: err.response.data.error_message})
      })
    },
  },
// 进入页面默认执行的钩子函数
  mounted () {
    this.getData()
  },


  data() {
    return {
      // 当前mock的id
      mock_id: Number(this.$route.params.id),
      // 默认进入的页签
      activeName: "first",
      // 局部刷新
      isRouterAlive: true,
      content: ''
    };
  }
};
</script>

<style>
</style>
