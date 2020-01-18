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
          style="border:none;padding-top:66px;"
        >
          <el-submenu
            :index="(index + 1).toString()"
            v-for="(item, index) in menuList"
            :key="index"
          >
            <template slot="title">
              <div
                @click="handleMenuTitleClick(item.url)"
                style="font-size:18px;padding-left:60px;"
              >
                <!-- <i class="el-icon-message" style="marginLeft:30px;font-size:25px"></i> -->
                {{ item.name }}
              </div>
            </template>
            <el-menu-item-group>
              <el-menu-item
                style="background-color:#fff;font-size:16px;padding-left: 60px;"
                :index="list.url"
                v-for="(list, i) in item.children"
                :key="i"
              >
                <div class="menuItem">{{ list.name }}</div>
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

.el-submenu__title:hover {
  background-color: #ffa800 !important;
}
.el-menu-item:focus,
.el-menu-item:hover {
  background-color: #fff !important;
}
.el-submenu__icon-arrow.el-icon-arrow-down {
  display: none;
}
/* .el-radio__input.is-checked .el-radio__inner {
  border-color: #ffa800;
  background: #ffa800;
} */
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
element.style:hover {
  background-color: #fff !important;
  text-align: center;
}

.el-menu-item,
.el-submenu__title {
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
  background-color: #f7f7f7;
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
}
</style>
