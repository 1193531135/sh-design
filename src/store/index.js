import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

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