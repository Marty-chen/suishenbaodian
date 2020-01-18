<template>
  <div class="wrap">
    <div class="balance">
      <div class="words">
        <div class="money">
          {{rechargeTotal.amount}}
          <span style="fontSize:20px;color:#999;">元</span>
        </div>
        <span class="num">发布红包抽屉</span>

        <el-popover
          ref="popover1"
          placement="bottom-start"
          title=""
          width="250"
          trigger="hover"
          content="发布红包抽屉说明文案。"
        >
        </el-popover>
          <div v-popover:popover1 class="circle">?</div>

      </div>
      <el-button @click="toPay" class="btn">购买</el-button>
    </div>

    <el-row style="margin-top:80px">
      <el-col :span="24">
        <div style="color:#FFA800;font-size:24px;letterSpacing:3px;">购买记录</div>
        <div class="lable">
          <el-table
            :data="rechargeList.records"
            border
            tooltip-effect="dark"
            style="width: 100%;text-align:center;"
          >
            <el-table-column align="center" prop="createDate" label="购买时间"></el-table-column>
            <el-table-column align="center" prop="code" label="交易单号"></el-table-column>
            <!-- <el-table-column align="center" prop="type" label="业务类型"></el-table-column> -->
            <el-table-column align="center" prop="platType" label="购买方式"></el-table-column>
            <el-table-column align="center" prop="amount" label="红包(个)"></el-table-column>
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
import { walletList } from "../network/wallet.js"

export default {
  data() {
    return {
      rechargeList:'',
      rechargeTotal:'',
      
    };
  },
  computed: {
    pageNum() {
      return Math.ceil(this.rechargeList.total / this.rechargeList.size) * 10;
    }
  },
  created() {
    this.getWalletList(1)
  },
  methods: {
    toPay() {
      this.$router.push({ path: "/pay" });
    },

     //点击翻页
    handleChangePage(val) {

      this.getWalletList(val);
    },

    /***网络请求函数 */
    getWalletList(current) {
      let data = {
        size: 5,
        current: current
      };
      walletList(data).then(res=>{
        if (res.data.code == "0000") {
          console.log(res)
          this.rechargeList = res.data.data.businessVOIPage;
          this.rechargeTotal = res.data.data;
          // console.log(this.rechargeList)
          this.rechargeList.records.forEach((item,index)=>{
            if(item.platType==0) {
              this.rechargeList.records[index].platType = '微信'
            }else {
              this.rechargeList.records[index].platType = '支付宝'

            }
          })

        } else {
          this.$message.error(res.data.msg);
        }
      })
    }
  }
};
</script>

<style scoped>
.wrap {
  min-width: 800px
}
.el-table {
  font-size: 16px;
  color: #666;
  border-radius: 10px;
}
.el-table>>>thead {
  color: #333;
}
.el-table>>>th {
  font-weight: 400;
  font-size: 18px;
  background-color: #E6E6E6;
}
.wrap {
  padding: 40px 20px;
}
.balance {
  width: 500px;
  height: 220px;
  background-color: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 40px;
  box-sizing: border-box;
  border-radius: 8px;
  border: 1px solid rgba(230, 230, 230, 1);
}

.words .money {
  font-size: 40px;
  margin-bottom: 35px;
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
  background-color: #FFA800;
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