import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)
// FatherComponent = Vue.extend({rander:h => h('router-view')})
let routes = [
  {
    path: '/login',
    component:() =>  import("../components/main/Login.vue")
  },
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    redirect: '/home/list'
  },
  {
    path: '/',
    component:() => import("../components/main/Home.vue"),
    children: [
      {
        path: '/home/list',
        component:() => import("../components/pages/home/List.vue")
      },
    ]
  },
]

const router = new Router({ routes })
export default router