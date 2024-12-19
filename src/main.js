import Vue from 'vue'
import App from './App.vue'
import router from './router';
import './assets/all.css'
import ElementUI, { Loading } from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import store from './store'
import toolJs from './tool'
import md5 from 'md5'
import less from 'less'
import Magnifier from 'magnifier.js';

Vue.use(less)
window.runType = process.env.NODE_ENV
// 公用组件注册
Vue.use(ElementUI)
// 加载工具类的所有方法
Object.keys(toolJs).some((item) => { Vue.prototype['$' + item] = toolJs[item] })
Vue.use(ElementUI)

// Object.prototype.length = function(){ return Object.keys(this).length }
Vue.prototype.$md5 = md5
Vue.prototype.$loading = Loading
Vue.prototype.$Magnifier = Magnifier
Vue.prototype.$message = (obj) => {
  obj = {
    ...obj
  }
  ElementUI.Message(obj)
}

Vue.config.productionTip = false //关闭生产环境不必要警告

new Vue({
  render: h => h(App),
  router,
  store,
}).$mount('#app')
