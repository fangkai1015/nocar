import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  scrollBehavior (to, from, savedPosition) {
    return { x: 0, y: 0 }
  },
  routes: [
    {
      path: '/',
      name: 'index',
      component: resolve=>require(["@/pages/index"],resolve)
    },
    {
      path: '/detail/:id',
      name: 'detail',
      component: resolve=>require(["@/pages/detail"],resolve)
    },
    {
      path: '/health',
      name: 'health',
      component: resolve=>require(["@/pages/health"],resolve)
    },
    {
      path: '/insureIntro',
      name: 'insureIntro',
      component: resolve=>require(["@/pages/insureIntro"],resolve)
    },
    {
      path: '/orderDetail',
      name: 'orderDetail',
      component: resolve=>require(["@/pages/orderDetail"],resolve)
    },
    {
      path: '/orderList',
      name: 'orderList',
      component: resolve=>require(["@/pages/orderList"],resolve)
    },
    {
      path: '/pay',
      name: 'pay',
      component: resolve=>require(["@/pages/pay"],resolve)
    },
    {
      path: '/myShop',
      name: 'myShop',
      component: resolve=>require(["@/pages/myShop"],resolve)
    },
    {
      path: '/setCard',
      name: 'setCard',
      component: resolve=>require(["@/pages/setCard"],resolve)
    },
    {
      path: '/editCard',
      name: 'editCard',
      component: resolve=>require(["@/pages/editCard"],resolve)
    },
    {
      path: '/setShop',
      name: 'setShop',
      component: resolve=>require(["@/pages/setShop"],resolve)
    },
    {
      path: '/editShop',
      name: 'editShop',
      component: resolve=>require(["@/pages/editShop"],resolve)
    }
  ]
})
