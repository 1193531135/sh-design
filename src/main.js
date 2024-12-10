import Vue from 'vue'
import App from './App.vue'
import router from './router';
import './assets/all.css'
import ElementUI, { Loading } from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import store from './store'
import axios from './requests/index.js'
import toolJs from './tool'
import single from "./assets/js/single";
import md5 from 'md5'
import qs from 'querystring'
import sortable from 'sortablejs'
import Hls from 'hls.js'
import less from 'less'
Vue.use(less)
window.runType = process.env.NODE_ENV
store.commit('modifyData', { name: 'allDom', newdata: single.getPageData(router) })  //初始化页面节点
window.Hls = Hls
// 公用组件注册
Vue.component('upload-file', re => require(['./components/common/FileUploadPop.vue'], re))

Vue.use(ElementUI)
// 加载axios所有的方法
Object.keys(axios).some((item) => { Vue.prototype['$' + item] = axios[item] })
// 加载工具类的所有方法
Object.keys(toolJs).some((item) => { Vue.prototype['$' + item] = toolJs[item] })
Vue.prototype.$sortable = sortable
Vue.prototype.$Hls = Hls
Vue.use(ElementUI)

// 通过key查找到对应的对象数组的value
function $searchOptionName(options, value) {
  let name = "";
  if (options && options.constructor === String) {
    options = store.state.optionBase[options]
  }
  if (options.constructor != Array || !options) {
    // console.log(options)
    // throw '类型不为Array'
    return true
  }
  options.some((item) => {
    if (item.value == value) {
      name = item.label;
      return true;
    }
  });
  return name;
}
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
Vue.prototype.$searchOptionName = $searchOptionName
// array截取
Vue.prototype.$cutArray = (array, name, state, search = false) => {
    state = state || 'cut'
    // 检索为空，全返回
    if ((!name && name !== 0) || (name.constructor === Object && !name.value && name.value !== 0)) {
      // console.log(array, name, state)
      return array
    }
    const newData = []
    array.some((item, index) => {
      // index为准做切割
      if (typeof name === 'number') {
        if (state === 'cut' && index != name) { newData.push(item) }
        if (state === 'get' && index === name) { newData.push(item) }
      }
      // 用数组内容做切割
      // item 有可能是 file 之类的其他对象字典，这里用name进行判定
      else if (name.constructor === Object) {
        // 为字典数组的情况,search 为 true是 模糊查询
        if (search) {
          if (state === 'cut' && item[name.key].indexOf(name.value) === -1) { newData.push(item) }
          if (state === 'get' && item[name.key].indexOf(name.value) != -1) { newData.push(item) }
        } else {
          if (state === 'cut' && item[name.key] != name.value) { newData.push(item) }
          if (state === 'get' && item[name.key] === name.value) { newData.push(item) }
        }
      } else {
        if (search) {
          if (state === 'cut' && item.indexOf(name) === -1) { newData.push(item) }
          if (state === 'get' && item.indexOf(name) != -1) { newData.push(item) }
        } else {
          if (state === 'cut' && item != name) { newData.push(item) }
          if (state === 'get' && item === name) { newData.push(item) }
        }
      }
    })
    return newData
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
