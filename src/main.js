import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
//复制到粘贴板插件
import VueClipboard from 'vue-clipboard2'
// VueClipboard.config.autoSetContainer = true
Vue.use(VueClipboard)

Vue.use(ElementUI);

Vue.config.productionTip = false;

// import {
//   Message
// } from 'element-ui';


router.beforeEach((to, from, next) => {
  //获取用户登录成功后储存的登录标志

  let getFlag = localStorage.getItem("Flag");
  // console.log(getFlag)
  //如果登录标志存在且为isLogin，即用户已登录
  if (getFlag == "isLogin") {
    //设置vuex登录状态为已登录
    store.state.isLogin = true;
    //从本地缓存中取出 用户信息赋值到VUEX
    let getUser = JSON.parse(localStorage.getItem("userInfo"));
    let menuList = JSON.parse(localStorage.getItem("menuList"));
    if(menuList) {
      store.commit("saveMenuList", menuList);
    }
    if(getUser) {
      store.commit("saveUserInfo", getUser);
    }
    
    // console.log(getUser)



    //如果已登录，还想想进入登录注册界面，则定向回首页
    if (!to.meta.isLogin) {
      //友好提示
      // console.log('222')
      next({
        path: '/index'
      })
    } else {
      next()
    }
    //如果登录标志不存在，即未登录
  } else {
    //用户想进入需要登录的页面，则定向回登录界面
    if (to.meta.isLogin) {
      next({
        path: '/login',
      })
      //用户进入无需登录的界面，则跳转继续
    } else {
      next()
    }
  }
});
router.afterEach(route => {
  window.scroll(0, 0);
});

const vm = new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

export default vm