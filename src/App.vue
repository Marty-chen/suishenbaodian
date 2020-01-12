<template>
  <div class="home">
    <elHeader />
    <el-container style="height: 100%;">
      <el-aside width="280px" style="font-size:20px">
        <el-menu
          @select="changeClick"
          :default-openeds="defaultOpeneds"
          class="navMenu"
          text-color="#666"
          active-text-color="#FFA800"
          style="border:none;"
          
        >
          <el-submenu :index="(index+1).toString()" v-for="(item,index) in menuList" :key="index">
            <template slot="title">
              <div @click="handleMenuTitleClick(item.url)" style="font-size:18px">
                <i class="el-icon-message" style="marginLeft:30px;font-size:25px"></i>
                {{item.name}}
              </div>
            </template>
            <el-menu-item-group>
              <el-menu-item
                style="background-color:#fff;font-size:16px;"
                :index="list.url"
                v-for="(list,i) in item.children"
                :key="i"

              >
                <div class="menuItem">{{list.name}}</div>
              </el-menu-item>
            </el-menu-item-group>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main class="el-main">
        <router-view :key="$route.path + $route.query.t" />
      </el-main>
    </el-container>
  </div>
</template>

<script>
import elHeader from "./components/elHeader";

export default {
  components: {
    elHeader
  },
  data() {
    return {
      menuCode: "/home",
      defaultOpeneds: []
    };
  },
  methods: {
    //点击第一级菜单事件
    handleMenuTitleClick(url) {
      if (url == "/home") {
        if (this.$route.path != "/index") {
          this.$router.push({ path: "/index" });
        }
      }
    },
    //点击第二级菜单事件
    changeClick(val, i) {
      if (this.$route.path !== val) {
        this.$router.push({ path: val });
        this.defaultOpeneds = i;
      }
    }
  },
  created() {
    if (this.$route.params.menuCode) {
      this.menuCode = this.$route.params.menuCode;
    }
  },
  computed: {
    menuList() {
      return this.$store.state.menuList;
    }
  }
};
</script>

<style>
@import "assets/css/base.css";

.el-radio__input.is-checked .el-radio__inner {
  border-color: #FFA800;
    background: #FFA800;
}

/* 禁止textarea拖动大小 */
.el-textarea .el-textarea__inner {
  resize: none;
}

/* input 关于不显示上下箭头 */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}
input[type="number"] {
  -moz-appearance: textfield;
}
element.style:hover{

background-color: #fff !important;
}

.el-menu-item, .el-submenu__title {
  height: 60px;
}
.el-submenu .el-menu-item {
  line-height: 0;
  height: 10px;
}
.el-menu-item-group__title {
  padding: 0 0 0 20px !important;
}
.el-aside {
  color: #666;
  position: absolute;
  top: 61px;
  left: 0;
  bottom: 0;
  right: 0;
  
}
/* 去掉滚动条 */
/* .el-aside::-webkit-scrollbar {
  display: none;
} */
.el-main {
  background-color: #F7F7F7;
  position: absolute;
  top: 62px;
  left: 280px;
  right: 0px;
  bottom: 0;
  padding: 60px 40px 0 40px;
  box-sizing: border-box;
}
.navMenu {
  width: 100%;
  border: none;
  margin-top: 20px;
}

.menuItem {
  padding-left: 45px;

  /* width: 280px; */
}

/* .nav {
  width: 100%;
  margin-top: 35px;
}

.nav .navItem {
  height: 75px;
  font-size: 16px;
  color: #fff;
  padding-left: 55px;
  display: flex;
  align-items: center;
}
.active {
  background-color: #1c5b9b;
}

.nav .navItem img {
  width: 24px;
  height: 24px;
  margin-right: 12px;
  vertical-align: middle;
}
.nav .navItem .arrow {
  width: 11px;
  height: 19px;
  position: absolute;
  right: -13px;
  display: none;
}

.nav .navItem.active .arrow {
  display: inline-block;
} */
</style>
