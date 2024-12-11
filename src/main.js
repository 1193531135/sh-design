import Vue from 'vue'
import App from './App.vue'
import router from './router';
import './assets/all.css'
import ElementUI, { Loading } from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import store from './store'
import axios from './requests/index.js'
import toolJs from './tool'
import md5 from 'md5'
import qs from 'querystring'
import sortable from 'sortablejs'
import Hls from 'hls.js'
import less from 'less'
Vue.use(less)
window.runType = process.env.NODE_ENV
window.Hls = Hls
// 公用组件注册
Vue.use(ElementUI)
// 加载axios所有的方法
Object.keys(axios).some((item) => { Vue.prototype['$' + item] = axios[item] })
// 加载工具类的所有方法
Object.keys(toolJs).some((item) => { Vue.prototype['$' + item] = toolJs[item] })
Vue.prototype.$sortable = sortable
Vue.prototype.$Hls = Hls
Vue.use(ElementUI)

// Object.prototype.length = function(){ return Object.keys(this).length }
Vue.prototype.$md5 = md5
Vue.prototype.$qs = qs
Vue.prototype.$loading = Loading
Vue.prototype.$message = (obj) => {
  obj = {
    ...obj
  }
  ElementUI.Message(obj)
}

Vue.config.productionTip = false //关闭生产环境不必要警告

// 路由守卫
router.beforeEach((to, from, next) => {
  let allow = true
  // main
  // storage中的token验证
  // let localStorageToken = localStorage.getItem('sh-token')
  // if (!localStorageToken) {
  //   allow = false
  // }
  // 没有token时允许访问的路由
  let allowArray = ['/login']
  allowArray.some(item => {
    if (to.path === item) {
      allow = true
    }
  })
  if (allow) { next() } 
  else {
    next('/login')
    return true
  }
})

new Vue({
  render: h => h(App),
  router,
  store,
}).$mount('#app')
