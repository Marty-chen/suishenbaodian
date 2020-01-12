<template>
  <div class="wrapp">
    <div class="balance-wrap">
      <div class="balance">
        <div class="words">
          <div class="money">
            {{rechargeTotal.amount}}
            <span style="fontSize:20px;color:#999;">元</span>
          </div>
          <span class="num">货款余额</span>
          <el-popover
            ref="popover1"
            placement="bottom-start"
            title
            width="250"
            trigger="hover"
            content="发布红包抽屉说明文案。发布红包抽屉说明文案。。"
          ></el-popover>
          <div v-popover:popover1 class="circle">?</div>
        </div>
        <el-button @click="toGetCash" class="btn">提现</el-button>
      </div>
    </div>

    <div class="balance-wrap">
      <div class="balance1">
        <div class="mode">第三方提现方式</div>
        <div class="wechat">
          <div class="payImg">
            <img src="../assets/img/wechat_icon.png" alt="">微信
          </div>
          <el-button v-if="rechargeTotal.wx==0" @click="bindWech" size="small" class="bingdingBtn1">去绑定</el-button>
          <el-button v-else size="small" class="bingdingBtn2">已绑</el-button>
        </div>

        <div class="wechat">
          <div class="payImg">
            <img src="../assets/img/pay_treasure_icon.png" alt="">支付宝
          </div>
          <el-button v-if="rechargeTotal.alipay==0" @click="bindAli" size="small" class="bingdingBtn1">去绑定</el-button>
          <el-button v-else size="small" class="bingdingBtn2">已绑</el-button>
        </div>
        
        
      </div>
    </div>

    <el-row style="margin-top:80px">
      <el-col :span="24">
        <div style="color:#FFA800;font-size:24px;letterSpacing:3px;">提现记录</div>
        <div class="lable">
          <el-table
            :data="rechargeList.records"
            border
            tooltip-effect="dark"
            style="width: 100%;text-align:center;"
          >
            <el-table-column align="center" prop="createDate" label="提现时间"></el-table-column>
            <el-table-column align="center" prop="code" label="交易单号"></el-table-column>
            <!-- <el-table-column align="center" prop="type" label="业务类型"></el-table-column> -->
            <el-table-column align="center" prop="platType" label="提现方式"></el-table-column>
            <el-table-column align="center" prop="amount" label="提现金额(元)"></el-table-column>
          </el-table>
        </div>
      </el-col>
    </el-row>

    <!-- 分页 -->
    <div class="paging">
      <el-pagination
        @current-change="handleChangePage"
        background
        layout="prev, pager, next"
        :total="pageNum"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import { paymentGoods,bindAlipay,bindWechat } from "../network/wallet.js";

export default {
  data() {
    return {
      rechargeList: "",
      rechargeTotal: ""
    };
  },
  computed: {
    pageNum() {
      return Math.ceil(this.rechargeList.total / this.rechargeList.size) * 10;
    }
  },
  created() {
    this.getWalletList(1);
  },
  methods: {
    // 去提现去提现
    toGetCash() {
      this.$router.push({ path: "/paymentGoods" });
    },
    //点击翻页
    handleChangePage(val) {
      this.getWalletList(val);
    },
    //绑定微信
    bindWech() {

    },
    //绑定支付宝
    bindAli() {

    },

    /***网络请求函数 */
    getWalletList(current) {
      let data = {
        size: 5,
        current: current
      };
      paymentGoods(data).then(res => {
        if (res.data.code == "0000") {
          console.log(res);
          this.rechargeList = res.data.data.businessVOIPage;
          this.rechargeTotal = res.data.data;
          
          this.rechargeList.records.forEach((item, index) => {
            if (item.platType == 0) {
              this.rechargeList.records[index].platType = "微信";
            } else {
              this.rechargeList.records[index].platType = "支付宝";
            }
          });
        } else {
          this.$message.error(res.data.msg);
        }
      });
    }
  }
};
</script>

<style scoped>
.el-table {
  font-size: 16px;
  color: #666;
  border-radius: 10px;
}
.el-table >>> thead {
  color: #333;
}
.el-table >>> th {
  font-weight: 400;
  font-size: 18px;
  background-color: #e6e6e6;
}
.wrapp {
  padding: 40px 20px;
  white-space: nowrap;

}
.balance-wrap {
  display: inline-block;
  vertical-align: middle;
}
.balance {
  width: 500px;
  height: 220px;
  background-color: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0px 40px;
  box-sizing: border-box;
  border-radius: 8px;
  border: 1px solid rgba(230, 230, 230, 1);
  margin-right: 30px;
}
.balance1 {
  width: 500px;
  height: 220px;
  background-color: #fff;
  padding: 40px 60px;
  box-sizing: border-box;
  border-radius: 8px;
  border: 1px solid rgba(230, 230, 230, 1);
}
.wechat {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 18px;
  margin-bottom: 20px;
}
.payImg img{
  width: 28px;
  height: 28px;
  vertical-align: middle;
  margin-right: 13px;
}
.bingdingBtn1 {
  width: 100px;
  height: 36px;
   border: 1px solid #FFA800;
  color: #FFA800;
  background-color: #fff;
  font-size: 18px;
}
.bingdingBtn2 {
  width: 100px;
  height: 36px;
   border: 1px solid #999;
  color: #999;
  background-color: #fff;
  font-size: 18px;
}
.words .money {
  font-size: 40px;
  margin-bottom: 33px;
  color: #333;
}
 .mode {
  font-size: 20px;
  margin-bottom: 20px;
  color: #333;
  
}
.words .num {
  font-size: 20px;
  color: #666;
}
.circle {
  text-align: center;
  width: 20px;
  height: 20px;
  font-size: 16px;
  border-radius: 50%;
  border: 1px solid #999;
  color: #999;
  display: inline-block;
  margin-left: 20px;
}
.btn {
  width: 120px;
  height: 40px;
  color: #fff;
  background-color: #ffa800;
  border-radius: 4px;
  border: none;
}
.lable {
  margin-top: 17px;
}
.paging {
  text-align: center;
  margin-top: 90px;
}
</style>