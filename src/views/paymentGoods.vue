<template>
  <div class="pay">
    <elHeader />
    <div class="wraper">
      <div class="content">
        <el-button @click="toHome('/wallet/paymentGoods')" class="ExitBtn">退出提现</el-button>

        <div class="steps">
          <div class="imgs">
            <div class="stepImg img1">
              <img src="../assets/img/blue_arrow1_icon.png" alt />
            </div>
            <div class="stepImg img2">
              <img v-if="stepStatus==2||stepStatus==3" src="../assets/img/cash_orange_arrow2_icon.png" alt />
              <img v-else src="../assets/img/cash_gray_arrow1_icon.png" alt />
            </div>
            <div class="stepImg img3">
              <img v-if="stepStatus==3" src="../assets/img/cash_orange_arrow3_icon.png" alt />
              <img v-else src="../assets/img/cash_gray_arrow2_icon.png" alt />
            </div>
          </div>
        </div>

        <div class="payWindow">
          <div v-if="stepStatus==1" class="step1">
            
            <div class="leftWords mt30">
              支付金额：
              <el-input
                  type="number"
                  @focus="focus"
                  @blur="blur"
                  style="width:300px;height:36px;margin-left: 10px;"
                  placeholder="请输入提现金额"
                  v-model="inputValue"
                />
            </div>
              <div class="notice">
                <span style="color:red;">*</span>
                提示：每天只能提现一次          
              </div>
            <div>
              <el-button @click="toStep2" class="payBtn">开始提现</el-button>
            </div>
          </div>

          <div v-if="stepStatus==2" class="step2">
            <div class="moneyInfo">
              提现金额
              <span>￥{{money}}</span>
              <div class="explain" style="color:#666;margin-top:30px">
                订单已于
                <span style="color:#333; fontSize:18px;margin:0;">2019-12-10 15:21:46</span> 提交成功！| 订单号：468688906178683581
              </div>
            </div>
            <div class="payment">
              <div class="paymentLeft">提现方式</div>
              <div class="payChoice">
                <div class="paymentMethod" :class="{active:radio==1}">
                  <el-radio class="radio" v-model="radio" label="1">
                    <img src="../assets/img/wechat_icon.png" />
                    <span>微信支付</span>
                  </el-radio>
                </div>
                <div class="paymentMethod" :class="{active:radio==2}">
                  <el-radio class="radio" v-model="radio" label="2">
                    <img src="../assets/img/pay_treasure_icon.png" />
                    <span>支付宝支付</span>
                  </el-radio>
                </div>
                <el-button @click="toStep3" class="paymentBtn">确认提现</el-button>
              </div>
            </div>
          </div>

          <div v-if="stepStatus==3" class="step3">
            <div class="succes">
              <img src="../assets/img/pass_through_icon.png" alt />
              <div class="msg">我们将在三个工作日内处理您的提现申请！</div>
              <div class="goBackBtns">
                <el-button @click="toHome('/wallet/paymentGoods')" class="goBack">返回</el-button>
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

export default {
  components: {
    elHeader
  },
  data() {
    return {
      radio: "1",
      stepStatus: 1,
      money: 1000,
      moneyList: ["1000", "2000", "3000", "4000", "5000", "6000"],
      inputValue: "",
      currentIndex: 0
    };
  },
  methods: {
    //退出充值
    toHome(i) {
      // console.log (this.$route)

      this.$router.push({
        path: i
      });
    },
    //选择金额
    moneyClick(index) {
      this.currentIndex = index;
      this.money = this.moneyList[index];
    },
    focus() {
      this.currentIndex = null;
    },
    blur() {
      if (this.inputValue) {
        this.money = this.inputValue;
        this.inputValue = "";
      }
    },
    toStep2() {
      this.stepStatus = 2;
    },
    toStep3() {
      this.stepStatus = 3;
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
  color: #FFA800;
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
  text-align: center;
}

.leftWords {
  font-size: 18px;
  color: #666;
 
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
  border: 2px solid #FFA800;
  color: #FFA800;
}
.redMoney {
  color: #ff5033;
  font-size: 24px;
  margin-left: 25px;
}
.payBtn {
  background-color: #FFA800;
  width: 100px;
  height: 40px;
  color: #fff;
  margin: 60px 0 0 -90px;
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
  border: 2px solid #FFA800;
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
  background-color: #FFA800;
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
  color: #FFA800;
  border: 1px solid #FFA800;
}
.addAdver {
  width: 140px;
  height: 40px;
  background-color: #FFA800;
  color: #fff;
  border: none;
}
.notice {
  margin-top: 15px;
  font-size: 14px;
  color: #999;
  margin-left: -30px;
}
</style>