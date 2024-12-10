import Vue from 'vue'
import Vuex from 'vuex'
import base from './base'

Vue.use(Vuex)
// 对Base做点兼容处理
Object.keys(base).some(key => {
  if(base[key].length > 0){
    if(typeof base[key][0] === 'string'){
      base[key] = base[key].map(string => { return {label:string,value:string} })
    }else{
      if(!base[key][0].value && base[key][0].value !== 0 && base[key][0].value !== false){
        base[key] = base[key].map(item => { return {label:item.label,value:item.label} })
      }
    }
  }
})
export default new Vuex.Store({
    strict: true,
    state: {
        // userData
        version: '1.0.0',
        token: null,                //存放token
        defineNowPath: '/',    //基础页面路由
        nowPath: '/',          //当前页面路由
        styleConfig: {
          // 默认深色模式
          styleType: "DARK",
        },
        default_file_url: '',
        optionBase: base,
    },
    mutations: {
        modifyData(state, data) {
            state[data.name] = data.newdata
        },
        optionBaseAdd(state, data) {
            state.optionBase[data.name] = data.newdata
        },
    }
})