import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)
// FatherComponent = Vue.extend({rander:h => h('router-view')})
let routes = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    redirect: '/home/list'
  },
  {
    path: '/account-lr',
    component:() => import("../components/login/Index.vue"),
    children:[
      {
        path: '/account-lr/register',
        component:() => import("../components/login/Register.vue"),
      },
      {
        path: '/account-lr/login',
        component:() => import("../components/login/Login.vue"),
      },
    ]
  },
  {
    path: '/',
    component:() => import("../components/main/Home.vue"),
    children: [
      {
        path: '/home/list',
        component:() => import("../components/pages/home/List.vue")
      },
      {
        path: '/dataBase/list',
        name: "dataBase",
        component:() => import("../components/pages/dataBase/List.vue")
      },
      {
        path: '/dataBase/detail',
        name: "dataBase",
        component:() => import("../components/pages/dataBase/Detail.vue")
      },
      {
        path: '/shopping-cart',
        component:() => import("../components/pages/shoppingCart/Index.vue"),
        children:[
          {
            path: '/shopping-cart/card',
            component:() => import("../components/pages/shoppingCart/Cart.vue"),
          },
          {
            path: '/shopping-cart/order-input',
            component:() => import("../components/pages/shoppingCart/orderFill.vue"),
          },
          {
            path: '/shopping-cart/order-pay',
            component:() => import("../components/pages/shoppingCart/orderPay.vue"),
          },
        ]
      },
      {
        path: '/account-manage',
        component:() => import("../components/pages/account/Index.vue"),
        children:[
          {
            path: '/account-manage/dovip',
            component:() => import("../components/pages/account/DoVIP.vue"),
          },
        ]
      },
    ]
  },
]

const router = new Router({ routes })
export default router