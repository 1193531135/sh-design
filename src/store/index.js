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
        username: 'ddd',
        userImg: '',
        userData: {
            "userName": "admin",
            "nickName": "admin",
            "realName": "admin",
            "status": 1,
            "email": null,
            "phone": null,
            "sex": null,
            "dept": ""
        },
        permissionTree: [],
        projectMenu:{
            info:true,
        },
        permissionPage: {
            // 判断是否为本地数据
            local: true,
            user: {
                view: false,
                add: false,
                delete: false,
                editor: false,
            },
            resource: {
                view: false,
                add: false,
                delete: false,
                editor: false,
            },
            program: {
                view: false,
                add: false,
                delete: false,
                editor: false,
            },
        },

        token: null,                //存放token
        defineNowPath: '/',    //基础页面路由
        nowPath: '/operationRecord-list',          //当前页面路由
        showDom: [],         //给Tab的数据
        allDom: [],    //全部的dom
        wid: null,      //页面宽度
        hei: null,      //页面高度
        randerStyle: null,
        publicAddress: null,
        language: {},
        default_file_url: '',
        default_file_cloudflare_url: '',
        optionBase: base,
    },
    mutations: {
        modifyData(state, data) {
            state[data.name] = data.newdata
        },
        resourcePermissionAdd(state, data) {
            state.permissionPage.resource[data.name] = data.newdata
        },
        optionBaseAdd(state, data) {
            state.optionBase[data.name] = data.newdata
        },
        showDomConfig(state, obj) {
            if (obj['type'] === 'add') {
                state.showDom.push(obj.data)
            }
        }
    }
})