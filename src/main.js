import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'

import axios from 'axios'
// 配置请求的根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'

// 配置请求拦截器
axios.interceptors.request.use(config=>{
  console.log(config);
  config.headers.Authorization = window.sessionStorage.getItem('token')
  // 必须return config
  return config
})

// 将axios包挂载在vue2的实例对象上，这样全局组件就可以使用这个axios
Vue.prototype.$http = axios


// 引入外部图标
import './assets/fonts/iconfont.css'

// 导入全局样式表
import './assets/css/global.css'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
  
}).$mount('#app')
