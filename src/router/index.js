import Vue from 'vue'
import VueRouter from 'vue-router'
import login from '../views/login.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/index',
    name: 'index',
    component: ()=>import('../components/index'),
    meta: {
      isLogin: true
    }
  },
  {
    path: '/login',
    name: 'login',
    component: ()=>import('../views/login.vue'),
    meta: {
      isLogin: false
    }
  },
  {
    path: '/pay',
    name: 'pay',
    component: ()=>import('../views/pay.vue'),
    meta: {
      isLogin: true
    }
  },
  {
    path: '/paymentGoods',
    name: 'paymentGoods',
    component: ()=>import('../views/paymentGoods.vue'),
    meta: {
      isLogin: true
    }
  },
  {
    path: '/adv/list',
    name: 'advertisingManage',
    component: ()=>import('../components/advertisingManage.vue'),
    meta: {
      isLogin: true
    }
  },
  {
    path: '/store/list',
    name: 'shopManage',
    component: ()=>import('../components/shopManage.vue'),
    meta: {
      isLogin: true
    }
  },
  {
    path: '/wallet/topup',
    name: 'Recharge',
    component: ()=>import('../components/Recharge.vue'),
    meta: {
      isLogin: true
    }
  },
  {
    path: '/wallet/paymentGoods',
    name: 'cash',
    component: ()=>import('../components/getCash.vue'),
    meta: {
      isLogin: true
    }
  },
  {
    path: '/order/list',
    name: 'OrderList',
    component: ()=>import('../components/OrderList.vue'),
    meta: {
      isLogin: true
    }
  },
  {
    path: '/gds/list',
    name: 'GoodsList',
    component: ()=>import('../components/GoodsList.vue'),
    meta: {
      isLogin: true
    }
  },
  {
    path: '/wallet/payResult',
    name: 'payResult',
    component: ()=>import('../views/payResult.vue'),
    meta: {
      isLogin: true
    }
  }
  
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})


export default router
