import Vue from 'vue'
import Router from 'vue-router'
import index from '@/pages/index'
import detail from '@/pages/detail'
import health from '@/pages/health'
import insureIntro from '@/pages/insureIntro'
import orderDetail from '@/pages/orderDetail'
import orderList from '@/pages/orderList'
import pay from '@/pages/pay'
import myShop from '@/pages/myShop'
import setCard from '@/pages/setCard'
import editCard from '@/pages/editCard'
import setShop from '@/pages/setShop'
import editShop from '@/pages/editShop'

Vue.use(Router)

export default new Router({
  scrollBehavior (to, from, savedPosition) {
    return { x: 0, y: 0 }
  },
  routes: [
    {
      path: '/',
      name: 'index',
      component: index
    },
    {
      path: '/detail/:id',
      name: 'detail',
      component: detail
    },
    {
      path: '/health',
      name: 'health',
      component: health
    },
    {
      path: '/insureIntro',
      name: 'insureIntro',
      component: insureIntro
    },
    {
      path: '/orderDetail',
      name: 'orderDetail',
      component: orderDetail
    },
    {
      path: '/orderList',
      name: 'orderList',
      component: orderList
    },
    {
      path: '/pay',
      name: 'pay',
      component: pay
    },
    {
      path: '/myShop',
      name: 'myShop',
      component: myShop
    },
    {
      path: '/setCard',
      name: 'setCard',
      component: setCard
    },
    {
      path: '/editCard',
      name: 'editCard',
      component: editCard
    },
    {
      path: '/setShop',
      name: 'setShop',
      component: setShop
    },
    {
      path: '/editShop',
      name: 'editShop',
      component: editShop
    }
  ]
})
