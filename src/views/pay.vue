<template>
  <div class="pay">
    <elHeader />
    <div class="wraper">
      <div class="content">
        <el-button @click="toHome('/wallet/topup')" class="ExitBtn">退出充值</el-button>

        <div class="steps">
          <div class="imgs">
            <div class="stepImg img1">
              <img src="../assets/img/blue_arrow1_icon.png" alt />
            </div>
            <div class="stepImg img2">
              <img v-if="stepStatus==2||stepStatus==3" src="../assets/img/blue_arrow2_icon.png" alt />
              <img v-else src="../assets/img/gray_arrow1_icon.png" alt />
            </div>
            <div class="stepImg img3">
              <img v-if="stepStatus==3" src="../assets/img/blue_arrow3_icon.png" alt />
              <img v-else src="../assets/img/gray_arrow2_icon.png" alt />
            </div>
          </div>
        </div>

        <div class="payWindow">
          <div v-if="stepStatus==1" class="step1">
            <div class="chooseMoney">
              <div class="leftWords">充值金额</div>
              <div class="btns">
                <div
                  @click="moneyClick(index)"
                  class="btnItems"
                  :class="{active:currentIndex==index}"
                  v-for="(item,index) in moneyList"
                  :key="index"
                >{{item.price}}元</div>
                <!-- <el-input
                  type="number"
                  @focus="focus"
                  @blur="blur"
                  style="width:220px;height:36px;display:inline-block;"
                  placeholder="请输入1000的整数"
                  v-model="inputValue"
                />-->
              </div>
            </div>
            <div class="leftWords mt30">
              支付金额
              <span class="redMoney">￥{{selectPrice}} 元</span>
            </div>
            <div>
              <el-button @click="toStep2" class="payBtn">开始充值</el-button>
            </div>
          </div>

          <div v-if="stepStatus==2" class="step2">
            <div class="moneyInfo">
              支付金额
              <span>￥{{selectPrice}}元</span>
              <div class="explain" style="color:#666;margin-top:30px">
                订单已
                <span style="color:#333; fontSize:18px;margin:0;"></span>生成，请您尽快付款！
              </div>
            </div>
            <div class="payment">
              <div class="paymentLeft">支付方式</div>
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
                <el-button @click="toStep3" class="paymentBtn">确认支付</el-button>
              </div>
            </div>
            <el-dialog
              width="800px"
              height="80%"
              :modal="false"
              :visible.sync="dialogVisible"
              :before-close="handleClose"
              class="dialog"
            >
            <div style="margin-top:60px"></div>
            <p style="fontSize:26px">请用微信扫码支付</p>
              <img :src="weChatImg" alt />
            <div>
              <el-button@click="payDone" class="dialogbBtn">支付完成点击返回</el-button@click="payDone">
            </div>
            <div style="margin-top:70px"></div>
            </el-dialog>
          </div>

          <div v-if="stepStatus==3" class="step3">
            <div class="succes">
              <img src="../assets/img/pass_through_icon.png" alt />
              <div class="msg">您已支付成功，赶快去发布一条广告吧！</div>
              <div class="goBackBtns">
                <el-button @click="toHome('/wallet/topup')" class="goBack">返回</el-button>
                <el-button @click="toHome('/adv/list')" class="addAdver">添加广告</el-button>
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
import {
  setMeal,
  alipayOrderIsPc,
  weChatOrderIsPc
} from "../network/wallet.js";
import { md5, aes } from "../util/signCrypto.js";
import { Loading, Message } from "element-ui";
export default {
  components: {
    elHeader
  },
  data() {
    return {
      radio: "1", //1微信，2支付宝
      stepStatus: 1,
      money: 1000,
      moneyList: [{ price: 0 }],
      inputValue: "",
      currentIndex: 0,
      dialogVisible: false,
      aliHtml: "",
      loading: "",
      weChatImg: ""
    };
  },
  methods: {
    //关闭支付弹框
    handleClose(done) {
      this.$confirm('确认关闭？')
          .then(_ => {
            done();
          })
          .catch(_ => {});
    },
    //支付完成返回页面判断状态
    payDone() {
      this.dialogVisible = false;
    },
    //退出充值
    toHome(i) {
      this.$router.push({
        path: i
      });
    },
    //选择金额
    moneyClick(index) {
      this.currentIndex = index;
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
      //显示加载组件
      this.loading = Loading.service({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      let id = this.moneyList[this.currentIndex].packId;
      let header = this.$store.state.header;
      let key = aes.de(this.$store.state.userInfo.key);
      if (this.radio == 2) {
        //支付宝支付
        let alipayData = { packId: id };
        let sign = `${JSON.stringify(alipayData)}&platform=${
          header.platform
        }&timestamp=${header.timestamp}&version=${header.version}&key=${key}`;
        header.sign = md5(sign);

        this.aliPay(alipayData, header);
      } else if (this.radio == 1) {
        //微信支付
        let ip = returnCitySN["cip"];
        let weChatData = { packId: id, ip: ip };
        let sign = `${JSON.stringify(weChatData)}&platform=${
          header.platform
        }&timestamp=${header.timestamp}&version=${header.version}&key=${key}`;
        header.sign = md5(sign);
        this.weChatPay(weChatData, header);
      }

      // this.stepStatus = 3;
    },
    //支付宝支付
    aliPay(id, header) {
      alipayOrderIsPc(id, header).then(res => {
        console.log(res);
        this.loading.close(); //关闭加载提示
        if (res.data.code == "0000") {
          console.log(res.data.data.body);

          document.querySelector("body").innerHTML = res.data.data.body;
          const div = document.createElement("div"); // 创建div
          div.innerHTML = res.data.data.body; // 将返回的form 放入div
          document.body.appendChild(div);
          document.forms[0].submit();
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    //微信支付
    weChatPay(id, header) {
      this.dialogVisible = true;
     let img = weChatOrderIsPc(id, header).then(res => {
        console.log(res);
        this.loading.close(); //关闭加载提示
        if (res.status == "200") {
          return (
            "data:image/png;base64," +
            btoa(
              new Uint8Array(res.data).reduce(
                (data, byte) => data + String.fromCharCode(byte),
                ""
              )
            )
          );
        } else {
          this.$message.error("请求错误");
        }
      });
      img.then(body=>{
        this.weChatImg = body;
        // console.log(body)
      })
    },
    //网络请求
    getPaket() {
      let type = { type: 0 };
      setMeal(type).then(res => {
        console.log(res);
        if (res.data.code == "0000") {
          this.moneyList = res.data.data;
        } else {
          //失败
          this.$message.error(res.data.msg);
        }
      });
    }
  },
  created() {
    this.getPaket();
  },
  computed: {
    selectPrice() {
      return this.moneyList[this.currentIndex].price;
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
  background-color: var(--color-tint);
  margin-top: 70px;
}
</style>