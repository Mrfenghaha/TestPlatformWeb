<template>
  <div class="side-nav">
    <el-row style="height:100%" class="side-nav-elR">
      <el-col :span="4"  style="min-height: 100%; background-color: #545c64;">
        <el-menu :default-active="defaultActive" theme="dark" style="min-height: 100%" class="el-menu-vertical-back" @open="handleOpen" @close="handleClose" 
                :collapse="isCollapse" router background-color="#545c64"
                text-color="#fff"
                :unique-opened="true"
                active-text-color="#ffd04b">
          <el-menu-item index="/index"><i class="el-icon-menu"></i>首页</el-menu-item>
          <!-- <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-document"></i>
              <span slot="title">自动化测试</span>
            </template>
          </el-submenu> -->
          <el-submenu index="2">
            <template slot="title">
              <i class="el-icon-cpu"></i>
              <span slot="title">测试工具</span>
            </template>
            <el-menu-item index="/tool/pairs">正交法Pair</el-menu-item>
            <el-submenu index="2-1">
                <template slot="title">DB操作</template>
                  <el-menu-item index="/tool/db-operation/operations">操作</el-menu-item>
                  <el-menu-item index="/tool/db-operation/operation-configs">操作配置</el-menu-item>
                  <el-menu-item index="/tool/db-operation/database-configs">数据库配置</el-menu-item>
            </el-submenu>
            <el-menu-item index="/tool/mock-server">Mock配置</el-menu-item>
          </el-submenu>
          <!-- <el-submenu index="3">
            <template slot="title">
              <i class="el-icon-orange"></i>
              <span slot="title">产品管理</span>
            </template>
              <el-menu-item index="/product/products">产品管理</el-menu-item>
              <el-menu-item index="/product/lines">产品线管理</el-menu-item>
              <el-menu-item index="/product/modules">产品模块管理</el-menu-item>
          </el-submenu>
          <el-submenu index="4">
            <template slot="title">
              <i class="el-icon-setting"></i>
              <span slot="title">设置管理</span>
            </template>
              <el-menu-item index="/setting/classifications">用例分类管理</el-menu-item>
              <el-menu-item index="/setting/users">用户管理</el-menu-item>
              <el-menu-item index="/setting/permissions">权限管理</el-menu-item>
          </el-submenu> -->
        </el-menu>
      </el-col>
      <el-col :span="20">
        <div>
          <head-top></head-top>
          <div class="page">
          <!-- <keep-alive> -->
            <router-view v-if="isRouterAlive"/>
          <!-- </keep-alive> -->
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import headTop from './head'

export default {
  name: "sideNav",
  components: {
    headTop
  },

  provide () {
    return {
      reload: this.reload
    }
  },
  data () {
    return {
      isCollapse: false,
      isRouterAlive: true
    };
  },
  methods: {
    handleOpen (key, keyPath) {
      // console.log(key, keyPath);
    },
    handleClose (key, keyPath) {
      // console.log(key, keyPath);
    },
    // 实现局部刷新
    reload() {
      this.isRouterAlive = false
      this.$nextTick(function(){
        this.isRouterAlive = true
      })
    }
  },
  computed: {
    defaultActive: function () {
      return this.$route.path;
    }
  },
  mounted () {
    console.log(this.$route.path)
  }
}
</script>

<style>
  .side-nav{
    height: 100%;}
  .el-menu-vertical-back:not(.el-menu--collapse) {
    /*width: 200px;*/
    min-height: 100%;
  }
  .el-menu{
    border-right: none;}
  .el-menu-vertical-back{text-align: left;min-height: 100%;}
  /* 背景颜色，会影响其他设置，顾设为无色 */
  .is-active{background-color: transparent !important;}
  .el-submenu .el-menu-item {min-width: 50px !important;}

  .page {
  margin-left: 10%;
  margin-right: 10%;
  margin-top: 2%;
  }
</style>
