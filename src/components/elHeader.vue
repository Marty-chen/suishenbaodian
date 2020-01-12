<template>
  <el-container>
    <el-header style=" font-size: 12px">
      <div class="logo">
        <img src="../assets/img/small_logo.png" alt />
        <span>随身宝点管理后台</span>
      </div>
      <div style="float: right; font-size:20px">
        <span style="padding-right:10px; font-size:16px;">
          <span style="color:#FFA800;font-size:18px;">{{nickName}},</span> 你好！
        </span>
        <!-- <i class="el-icon-platform-eleme" style="padding-right: 30px; color:#126ECB;"></i> -->
        <el-button @click="signOut" size="small" style="margin: 0 20px 0 20px;color:#fff;background-color: #FFA800;border:none;" >退出</el-button>
      </div>
    </el-header>
  </el-container>
</template>

<script>
import { logout } from '../network/login.js'
export default {
  data() {
    return {
      userInfo: ""
    };
  },
  created() {
    
  },
  computed: {
    nickName() {
      return this.$store.state.userInfo.nickName;
    }
  },
  methods: {
    signOut() {
      this.$confirm("", "您确定要退出吗?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        center: true
      })
        .then(() => {
          localStorage.removeItem("Flag");
          localStorage.removeItem("userInfo");
          localStorage.removeItem("menuList");
          this.$store.commit("saveMenuList",[]);
          this.$store.commit("saveUserInfo", {});
        this.$message({
            type: "success",
            message: "退出成功!"
          });
          this.$router.push({
            path: "/login"
          });
          
          this.ctrlLogout()
          
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消退出"
          });
        });
    },
    //告诉后台退出登录了
    ctrlLogout() {
      logout().then(res=>{
        console.log(res)
         
      })
    }
  }
};
</script>


<style scoped>
.logo {
  display: inline-block;
  vertical-align: middle;
}
.logo img {
  width: 44px;
  height: 44px;
  vertical-align: middle;
  margin: -5px 16px 0 0;
}
.logo span {
  font-size: 24px;
}
.el-header {
  background-color: #fff;
  color: #333;
  line-height: 60px;
  /* border-bottom: 1px solid rgb(153,153,153); */
  box-shadow: 0px 2px 12px 0px rgba(153, 153, 153, 0.4);
}
</style>