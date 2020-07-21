import Vue from 'vue'
import Router from 'vue-router'
import Index from '../components/index'
import Blank from '../components/blank'
import DBOperation from '../components/tool/dbOperation/operation'
import DBOperationConfig from '../components/tool/dbOperation/operationConfig'
import DBOperationDBConfig from '../components/tool/dbOperation/databaseConfig'

Vue.use(Router)

// 解决ElementUI导航栏中的vue-router在3.0版本以上重复点菜单报错问题
const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

export default new Router({
  // 不声明mode则默认使用hash模式，路径会已#开头，使用history模式没有#前缀，而且可以使用pushState和replaceState来管理记录。
  mode: 'history', 
  routes: [{
    path: '/index',
    component: Index
  },
  {
    path: '/tool',
    component: Index,
    children: [{
      path: 'pairs',
      component: DBOperation,
      meta: ['测试工具', '正交法Pair']
    },
    {
      path: 'db-operation',
      component: Blank,
      children: [{
        path: 'operations',
        component: DBOperation,
        meta: ['测试工具', 'DB操作', "操作"]
      },
      {
        path: 'operation-configs',
        component: DBOperationConfig,
        meta: ['测试工具', 'DB操作', "操作配置"]
      },
      {
        path: 'database-configs',
        component: DBOperationDBConfig,
        meta: ['测试工具', 'DB操作', "数据库配置"]
      }
    ]},
    {
      path: 'mock-server',
      component: Blank,
      children: [
        {
          path: 'mock-configs',
          component: DBOperationDBConfig,
          meta: ['测试工具', 'Mock配置', "Mock配置"]
        }
    ]},
    ]},
  {
    path: '/', redirect: '/index'
  }]
})
