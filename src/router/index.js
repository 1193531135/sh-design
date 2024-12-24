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
    ]
  },
]

const router = new Router({ routes })
export default router