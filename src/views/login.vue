<template>
  <div class="login">
    <div class="login-container">
      <el-form
        v-if="!loginStatus"
        :model="ruleForm1"
        label-position="left"
        label-width="0px"
        class="demo-ruleForm"
      >
        <h3 class="title">
          <img src="../assets/img/small_logo.png" alt />
          <div>益得宝商家管理后台</div>
        </h3>
        <el-form-item prop="account">
          <el-input
            clearable
            type="text"
            v-model="ruleForm1.accounts"
            auto-complete="off"
            placeholder="请输入账号"
          ></el-input>
        </el-form-item>
        <el-form-item prop="checkPass">
          <el-input
            clearable
            show-password
            type="password"
            v-model="ruleForm1.password"
            auto-complete="off"
            placeholder="请输入密码"
          ></el-input>
        </el-form-item>

        <!-- <el-checkbox v-model="checked" checked class="remember">记住密码</el-checkbox> -->
        <el-form-item style="width:100%;">
          <el-button
            :disabled="isDisable1"
            style="width:100%;background-color:#FFA800;color:#fff;"
            @click.native.prevent="handleSubmit1"
            :loading="logining"
          >登录</el-button>
          <!-- <el-button @click.native.prevent="handleReset2">重置</el-button> -->
        </el-form-item>
      </el-form>

      <el-form
        v-else
        :model="ruleForm2"
        label-position="left"
        label-width="0px"
        class="demo-ruleForm"
      >
        <h3 class="title">
          <img src="../assets/img/small_logo.png" alt />
          <div>益得宝商家管理后台</div>
        </h3>
        <el-form-item prop="phone">
          <el-input
            clearable
            maxlength="11"
            type="number"
            v-model="ruleForm2.phone"
            auto-complete="off"
            placeholder="请输入手机号码"
          ></el-input>
        </el-form-item>
        <el-form-item prop="code">
          <el-input
            clearable
            type="number"
            v-model="ruleForm2.code"
            auto-complete="off"
            placeholder="请输入验证码"
          ></el-input>
          <el-button @click="CAPTCHAClick" :disabled="CAPTCHAStatus" class="CAPTCHA">{{CAPTCHA}}</el-button>
        </el-form-item>
        <!-- <el-checkbox v-model="checked" checked class="remember">记住密码</el-checkbox> -->
        <el-form-item style="width:100%;">
          <el-button
            :disabled="isDisable2"
            style="width:100%;background-color:#FFA800;color:#fff;"
            @click.native.prevent="handleSubmit2"
            :loading="logining"
          >登录</el-button>
          <!-- <el-button @click.native.prevent="handleReset2">重置</el-button> -->
        </el-form-item>
      </el-form>

      <el-button @click="changeLoginStatus" v-if="!loginStatus" class="loginStatus">验证码登陆</el-button>
      <el-button @click="changeLoginStatus" v-else class="loginStatus">密码登陆</el-button>

      <div class="quickLogon">
        <div class="quickLogonWorlds">快速登陆</div>
        <div class="imgIcons">
          <a
            href="https://open.weixin.qq.com/connect/qrconnect?appid=wx4792cd11152da182&redirect_uri=http%3A%2F%2Fwww.showlovecode.com&response_type=code&scope=snsapi_login"
          >
            <img src="../assets/img/login_weixin_click_icon@3x.png" alt />
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  phoneLogin,
  passWordLogin,
  sendSms,
  wechatLogin
} from "../network/login";
import { getMenuList } from "../network/home";

import { Decrypt, Encrypt } from "../util/crypto.js";

export default {
  data() {
    return {
      CAPTCHA: "获取验证码",
      CAPTCHAStatus: false,
      loginStatus: false,
      logining: false,
      ruleForm1: {
        accounts: "",
        password: ""
      },
      ruleForm2: {
        phone: "",
        code: ""
      },
      checked: true
    };
  },
  created() {
    //判断url 是否有参数传过来，有就自动登陆
    let urlSearch = this.getRequest();
    let data = { code: urlSearch.code };
    // console.log(data);
    if (data.code) {
      this.getWechatLogin(data);
    }
  },
  computed: {
    isDisable1() {
      return (
        this.ruleForm1.accounts.length !== 11 ||
        this.ruleForm1.password.length < 8
      );
    },
    isDisable2() {
      return (
        this.ruleForm2.phone.length != 11 || this.ruleForm2.code.length < 4
      );
    }
  },
  methods: {
    //微信快速登陆
    getWechatLogin(code) {
      wechatLogin(code).then(res => {
        console.log(res);
        if (res.data.code == "0000") {
          //登陆成功
          this.logining = false;
          //设置Vuex登录标志为true，默认userLogin为false
          this.$store.commit("userLogin", true);
          this.$store.commit("saveUserInfo", res.data.data);

          //Vuex在用户刷新的时候userLogin会回到默认值false，所以我们需要用到HTML5储存
          //我们设置一个名为Flag，值为isLogin的字段，作用是如果Flag有值且为isLogin的时候，证明用户已经登录了。
          localStorage.setItem("Flag", "isLogin");

          //友好提示
          this.$message({
            message: "登陆成功",
            type: "success"
          });
          //登录成功后跳转到指定页面
          this.$router.push({ path: "/index" });
          //网络请求   菜单列表
          getMenuList().then(res => {
            console.log(res);
            if (res.data.code == "0000") {
              this.$store.commit("saveMenuList", res.data.data);
            } else {
              //登陆失败
              this.$message.error(res.data.msg);
            }
          });
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    //获取url传过来的参数
    getRequest() {
      var url = location.search; //获取url中"?"符后的字串
      var theRequest = new Object();
      if (url.indexOf("?") != -1) {
        var str = url.substr(1);
        var strs = str.split("&");
        for (var i = 0; i < strs.length; i++) {
          theRequest[strs[i].split("=")[0]] = decodeURI(strs[i].split("=")[1]);
        }
      }
      return theRequest;
    },

    // aes 加密 用户密码
    handleSubmit1() {
      let params = {
        phone: this.ruleForm1.accounts,
        password: Encrypt(this.ruleForm1.password) // aes 加密 用户密码
      };
      this.logining = true;

      passWordLogin(params).then(res => {
        // console.log(res)
        this.login(res);
      });
    },
    handleSubmit2() {
      this.logining = true;
      //发网络请求
      phoneLogin(this.ruleForm2).then(res => {
        this.login(res);
        // console.log(res);
      });
    },
    //登陆判断函数
    login(res) {
      // console.log(res)
      if (res.data.code != "0000") {
        //登陆失败
        this.logining = false;
        this.$message.error(res.data.msg);
      } else {
        //登陆成功
        this.logining = false;
        //设置Vuex登录标志为true，默认userLogin为false
        this.$store.commit("userLogin", true);
        this.$store.commit("saveUserInfo", res.data.data);

        //Vuex在用户刷新的时候userLogin会回到默认值false，所以我们需要用到HTML5储存
        //我们设置一个名为Flag，值为isLogin的字段，作用是如果Flag有值且为isLogin的时候，证明用户已经登录了。
        localStorage.setItem("Flag", "isLogin");

        //友好提示
        this.$message({
          message: "登陆成功",
          type: "success"
        });
        //登录成功后跳转到指定页面
        this.$router.push({ path: "/index" });
        //网络请求   菜单列表
        getMenuList().then(res => {
          console.log(res);
          if (res.data.code == "0000") {
            this.$store.commit("saveMenuList", res.data.data);
          } else {
            //登陆失败
            this.$message.error(res.data.msg);
          }
        });
      }
    },

    //切换登陆方式
    changeLoginStatus() {
      this.loginStatus = !this.loginStatus;
    },
    //获取手机验证码,倒计时
    CAPTCHAClick() {
      let param = {
        phone: this.ruleForm2.phone,
        smsType: 3
      };
      //网络请求 发送短信
      sendSms(param).then(res => {
        if (res.data.code != "0000") {
          //请求失败
          this.$message.error(res.data.msg);
        } else {
          //请求成功
          this.$message({
            message: res.data.msg,
            type: "发送成功"
          });
        }
      });

      this.CAPTCHAStatus = !this.CAPTCHAStatus;
      let time = 120;
      let timer = null;
      this.CAPTCHA = "重新获取" + time;
      timer = setInterval(() => {
        time -= 1;
        this.CAPTCHA = "重新获取" + time;
        if (time == 0) {
          clearInterval(timer);
        }
      }, 1000);
      setTimeout(() => {
        this.CAPTCHAStatus = !this.CAPTCHAStatus;
        this.CAPTCHA = "重新获取";
      }, time * 1000);
    }
  }
};
</script>

<style lang="scss" scoped>
.login {
  background-image: url("../assets/img/background_image.png");
  background-repeat: no-repeat;
  background-size: 100% 100%;
  -moz-background-size: 100% 100%;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  // align-items: center;
  justify-content: center;
}

.login-container {
  -webkit-border-radius: 5px;
  border-radius: 5px;
  -moz-border-radius: 5px;
  background-clip: padding-box;
  width: 400px;
  height: 550px;
  padding: 35px 35px 15px 35px;
  background: #fff;
  border: 1px solid #eaeaea;

  margin-top: 120px;
  .title {
    margin: 0px auto 60px auto;
    text-align: center;
    color: #505458;

    img {
      transform: scale(0.8);
      vertical-align: middle;
      margin-bottom: 15px;
    }
  }
  .CAPTCHA {
    position: absolute;
    top: 0;
    right: 0;
  }
  .loginStatus {
    border: none;
    margin-top: -10px;
  }
  .remember {
    margin: 0px 0px 35px 0px;
  }
  .quickLogon {
    width: 100%;
    height: 90px;
    position: relative;
    margin-top: 65px;
    border-top: 1px solid #f2f2f2;
  }
  .quickLogonWorlds {
    font-size: 12px;
    color: #999;
    padding: 0 10px;
    background-color: #fff;
    position: absolute;
    top: -6px;
    left: 50%;
    transform: translateX(-50%);
  }
  .imgIcons {
    text-align: center;
    margin: 30px;
  }
  .imgIcons img {
    width: 35px;
    height: 35px;
  }
}
</style>