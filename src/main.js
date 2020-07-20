import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// import BASE_URL from "../config/env"

Vue.use(ElementUI)
Vue.prototype.axios = axios
axios.defaults.baseURL = '/api'
axios.defaults.headers.post['Content-Type'] = 'application/json';
Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
