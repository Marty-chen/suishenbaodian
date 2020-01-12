import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  // 设置属性
  state: {
    menuList: '',
    isLogin: false,
    userInfo: '',
    header: {
      platform: "PC",
      version: "1.0.1",
      timestamp: Date.parse(new Date()),
      'Content-Type':'application/json',
      token: ''
    }
  },
  

  // 获取属性的状态
  getters: {
    //获取登录状态
    isLogin: state => state.isLogin,
  },

  // 设置属性状态
  mutations: {
    //保存登录状态
    userLogin(state, flag) {
      state.isLogin = flag
    },
    //保存用户信息
    
    saveUserInfo (state,data) {
      state.userInfo = data
      //保存token
      state.header.token = data.webToken
      localStorage.setItem("userInfo", JSON.stringify(data));
    },
    
    //保存nav 导航列表 menuList
    saveMenuList (state,data) {
      state.menuList = data;
      localStorage.setItem("menuList", JSON.stringify(data));
    },

  },

  // 应用mutations
  actions: {
    //获取登录状态
    // setUser({commit}, flag) {
    //   commit("userStatus", flag)
    // },
  }
})


