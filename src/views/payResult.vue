<template>
  <div class="pay">
    <elHeader />
    <div class="wraper">
      <div v-if="status == 1" class="content">
        <el-button @click="toHome('/wallet/topup')" class="ExitBtn"
          >退出充值</el-button
        >

        <div class="steps">
          <div class="imgs">
            <div class="stepImg img1">
              <img src="../assets/img/blue_arrow1_icon.png" alt />
            </div>
            <div class="stepImg img2">
              <img src="../assets/img/blue_arrow2_icon.png" alt />
            </div>
            <div class="stepImg img3">
              <img src="../assets/img/blue_arrow3_icon.png" alt />
            </div>
          </div>
        </div>

        <div class="payWindow">
          <div class="step3">
            <div class="succes">
              <img src="../assets/img/buy_success_icon.png" alt />
              <div class="msg">您已支付成功，赶快去发布一条广告吧！</div>
              <div class="goBackBtns">
                <el-button @click="toHome('/wallet/topup')" class="goBack"
                  >返回</el-button
                >
                <el-button @click="toHome('/adv/list')" class="addAdver"
                  >添加广告</el-button
                >
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="status==2" class="content">
        <el-button @click="toHome('/wallet/topup')" class="ExitBtn"
          >退出充值</el-button
        >

        <div class="steps">
          <div class="imgs">
            <div class="stepImg img1">
              <img src="../assets/img/blue_arrow1_icon.png" alt />
            </div>
            <div class="stepImg img2">
              <img src="../assets/img/blue_arrow2_icon.png" alt />
            </div>
            <div class="stepImg img3">
              <img src="../assets/img/buy_gray_arrow2_icon.png" alt />
            </div>
          </div>
        </div>
        <div class="payWindow">
          <div class="step3">
            <div class="succes">
              <img src="../assets/img/buy_fail_icon.png" alt />
              <div class="msg">您购买失败，请重新购买！</div>
              <div class="goBackBtns">
                <el-button @click="toHome('/wallet/topup')" class="goBack"
                  >返回</el-button
                >
                <el-button @click="toHome('/pay')" class="addAdver"
                  >去购买</el-button
                >
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="status==0" class="content">
        <el-button @click="toHome('/wallet/topup')" class="ExitBtn"
          >退出充值</el-button
        >

        <div class="steps">
          <div class="imgs">
            <div class="stepImg img1">
              <img src="../assets/img/blue_arrow1_icon.png" alt />
            </div>
            <div class="stepImg img2">
              <img src="../assets/img/blue_arrow2_icon.png" alt />
            </div>
            <div class="stepImg img3">
              <img src="../assets/img/buy_gray_arrow2_icon.png" alt />
            </div>
          </div>
        </div>
        <div class="payWindow">
          <div class="step3">
            <div class="succes">
              <img src="../assets/img/buy_fail_icon.png" alt />
              <div class="msg">您的订单正在支付中，网络可能延时，请稍后返回充值页面查询余额！</div>
              <div class="goBackBtns">
                <el-button @click="toHome('/wallet/topup')" class="goBack"
                  >返回</el-button
                >
                <!-- <el-button @click="toHome('/pay')" class="addAdver"
                  >去购买</el-button
                > -->
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import elHeader from "../components/elHeader";
import { dealStatus } from "../network/wallet.js";

export default {
  components: {
    elHeader
  },
  data() {
    return {
      status: ""
    };
  },
  methods: {
    //退出充值
    toHome(i) {
      this.$router.push({
        path: i
      });
    },
    //拿url传过来的参数
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
    //查询后台支付结果
    getDealStatus(code) {
      dealStatus(code).then(res => {
        console.log(res);
        if (res.data.code == "0000") {
          this.status = res.data.data;
        } else {
          this.$message.error(res.data.msg);
        }
      });
    }
  },
  created() {
    let urlSearch = this.getRequest();
    let data = { code: urlSearch.code };
    console.log(data);
    if (data.code) {
      this.getDealStatus(data);
    }
  }
};
</script>

<style scoped>
.mt30 {
  margin-top: 30px;
}
.pay {
  width: 100%;
  height: 100%;
}
.wraper {
  position: fixed;
  top: 62px;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #f2f5fa;
}
.content {
  width: 1400px;
  height: 700px;
  background-color: #fff;
  margin: 60px auto;
  position: relative;
  border-radius: 8px;
}
.ExitBtn {
  position: absolute;
  top: 10px;
  right: 10px;
  border: none;
  color: #ffa800;
  font-size: 16px;
  border: none;
}
.steps {
  width: 1160px;
  height: 165px;
  border-bottom: 1px solid #e0e0e0;
  margin: 0 auto;
  text-align: center;
}

.imgs {
  padding-top: 60px;
  position: relative;
}
.stepImg {
  display: inline-block;
}
.img1 {
  position: absolute;
  top: 60px;
  left: 260px;
}
.img3 {
  position: absolute;
  top: 60px;
  left: 675px;
}

.step1 {
  width: 600px;
  margin: 100px auto;
}
.chooseMoney {
  display: flex;
}
.leftWords {
  font-size: 18px;
  color: #666;
  margin-right: 30px;
  padding-top: 7px;
  display: inline-block;
  white-space: nowrap;
  vertical-align: middle;
}
.btns {
  display: flex;
  flex-wrap: wrap;
}
.btns .btnItems {
  display: inline-block;
  width: 100px;
  height: 36px;
  color: #333;
  border: 1px solid #ccc;
  text-align: center;
  line-height: 36px;
  margin-right: 20px;
  margin-bottom: 20px;
  vertical-align: middle;
  border-radius: 4px;
}
.btns .btnItems.active {
  border: 2px solid #ffa800;
  color: #ffa800;
}
.redMoney {
  color: #ff5033;
  font-size: 24px;
  margin-left: 25px;
}
.payBtn {
  background-color: #ffa800;
  width: 100px;
  height: 40px;
  color: #fff;
  margin: 40px 0 0 105px;
  border: none;
}
.step2 {
  width: 760px;
  margin: 0 auto;
  padding-top: 70px;
}
.moneyInfo {
  padding-bottom: 30px;
  border-bottom: 1px solid #e0e0e0;
  font-size: 18px;
  color: #333;
}
.moneyInfo span {
  font-size: 36px;
  color: #ff5033;
  margin-left: 30px;
}

.payment {
  margin-top: 30px;
  display: flex;
}
.paymentLeft {
  font-size: 18px;
  color: #666;
  margin-right: 20px;
  padding-top: 20px;
}
.paymentMethod {
  width: 500px;
  height: 60px;
  border: 1px solid #e0e0e0;
  line-height: 60px;
  padding: 0 20px;
  margin-bottom: 20px;
  border-radius: 4px;
  box-sizing: border-box;
}
.paymentMethod.active {
  border: 2px solid #ffa800;
}
.paymentMethod img {
  width: 28px;
  height: 28px;
  vertical-align: middle;
  margin-left: 20px;
}
.paymentMethod span {
  font-size: 20px;
  color: #333;
  margin-left: 15px;
  vertical-align: middle;
}
.paymentBtn {
  background-color: #ffa800;
  color: #fff;
  width: 100px;
  height: 40px;
  margin-top: 10px;
  border: none;
}

.succes {
  text-align: center;
  margin-top: 100px;
}
.msg {
  margin-top: 30px;
  font-size: 18px;
  color: #666;
}
.goBackBtns {
  margin-top: 120px;
}
.goBack {
  width: 140px;
  height: 40px;
  margin-right: 20px;
  color: #ffa800;
  border: 1px solid #ffa800;
}
.addAdver {
  width: 140px;
  height: 40px;
  background-color: #ffa800;
  color: #fff;
  border: none;
}
.dialog {
  text-align: center;
}
.dialogbBtn {
  color: #fff;
  background-color: #ffa800;
  margin-top: 70px;
}
</style>
