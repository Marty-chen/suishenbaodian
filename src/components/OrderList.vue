<template>
  <div class="wrap" style="margin-top: 40px;">
    <div style="margin-bottom: 30px;">
      <el-select v-model="chooseValue" @change="chooseStatus" placeholder="请选择">
        <el-option
          v-for="item in statusOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </div>

    <el-table
      :data="tableData"
      border
      tooltip-effect="dark"
      style="width: 100%;text-align:center;"
      class="tableStyle"
    >
      <el-table-column align="center" prop="code" label="订单编号"></el-table-column>
      <el-table-column align="center" prop="title" label="商品名称"></el-table-column>
      <el-table-column align="center" prop="status" label="订单状态"></el-table-column>
      <el-table-column align="center" prop="createDate" label="下单时间"></el-table-column>
      <el-table-column align="center" fixed="right" label="操作" width="200">
        <template scope="scope">
          <!-- v-if="scope.row.status=='待发货'" -->
          <img
            v-if="scope.row.status=='待发货'"
            class="editBtn"
            @click="handleDelive_goods(scope.$index, scope.row)"
            src="../assets/img/delive_goods_icon.png"
            alt
          />
          <!-- <img class="editBtn" src="../assets/img/refund_reject_icon.png" alt /> -->
          <!-- <img
            class="editBtn"
            @click="handleRefund(scope.$index, scope.row)"
            src="../assets/img/refund_agree_icon.png"
            alt
          /> -->
          <img
            class="editBtn"
            @click="handleToSeeOrderDetail(scope.$index, scope.row)"
            src="../assets/img/see.png"
            alt
          />
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <div class="paging">
      <el-pagination
        @current-change="handleChangePage"
        background
        layout="prev, pager, next"
        :total="pageNum"
      ></el-pagination>
    </div>
    <!-- 显示蒙层组件 -->
    <Mongolia v-if="isShowMongolia" @closeMongolia="closeMongolia">
      <!-- 插入蒙层内容组件 -->
      <seeOrderDetails v-if="seeOrderDetails" :orderId="orderId" slot="container" />
      <Logistics v-else :logisticsOrderId="logisticsOrderId" slot="logistics"  @closeClick="closeMongolia"/>

    </Mongolia>
  </div>
</template>

<script>
import { orderList } from "../network/order.js";

import Mongolia from "../common/Mongolia";
import Logistics from "../common/Logistics";
import seeOrderDetails from "../common/seeOrderDetails";

export default {
  components: {
    Mongolia,
    Logistics,
    seeOrderDetails
  },
  data() {
    return {
      logisticsOrderId: '',
      orderId: "",
      seeOrderDetails: false,
      chooseValue: "",
      statusOptions: [
        {
          value: "",
          label: "全部"
        },
        {
          value: "2",
          label: "未发货"
        },
        {
          value: "3",
          label: "已发货"
        },
        {
          value: "4",
          label: "已签收"
        },
        {
          value: "9",
          label: "已取消"
        }
      ],
      tableData: [],
      currentIndex: 0,
      isShowMongolia: false,
      orderList: ""
    };
  },
  created() {
    this.getOrderList();
  },
  methods: {
    chooseStatus(val) {
      this.getOrderList();
    },
    //去查看订单详情
    handleToSeeOrderDetail(index, row) {
      this.orderId = { orderId: row.orderId };
      this.seeOrderDetails = true;
      // console.log(this.orderId)
      this.isShowMongolia = true;
    },
    //点击转换已发货
    handleDelive_goods(index, row) {
      console.log(row);
      this.$confirm("", "请前去填写物流信息", {
        confirmButtonText: "前去",
        cancelButtonText: "取消",
        center: true,
        confirmButtonClass: "confirmBtn"
      })
        .then(() => {
          this.logisticsOrderId = row.orderId;
          this.isShowMongolia = true;
        })
        .catch(() => {});
    },
    //点击同意退款
    handleRefund(index, row) {
      this.$confirm("退款金额将在3-5分钟退回到买家账户，确定退款吗？", "", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        center: true,
        confirmButtonClass: "confirmBtn"
      })
        .then(() => {})
        .catch(() => {});
    },

    //关闭蒙层
    closeMongolia() {
      this.isShowMongolia = false;
      this.seeOrderDetails = false;
    },
    //点击翻页
    handleChangePage(val) {
      this.getOrderList(val);
    },
    /************网络请求函数**************/

    //获取店铺列表
    getOrderList(current) {
      let data = {
        status: this.chooseValue,
        size: 5,
        current: current
      };

      orderList(data).then(res => {
        if (res.data.code == "0000") {
          // console.log(res);
          this.orderList = res.data.data;
          this.tableData = res.data.data.records;
          this.tableData.forEach((item, index) => {
            switch (item.status) {
              case 0:
                this.tableData[index].status = "待付款";
                break;
              case 1:
                this.tableData[index].status = "付款失败";
                break;
              case 2:
                this.tableData[index].status = "待发货";
                break;
              case 3:
                this.tableData[index].status = "待收货";
                break;
              case 4:
                this.tableData[index].status = "已完成";
                break;
              case 9:
                this.tableData[index].status = "已取消";
                break;
            }
          });
        } else {
          this.$message.error(res.data.msg);
        }
      });
    }
  },
  computed: {
    //计算页数
    pageNum() {
      return Math.ceil(this.orderList.total / this.orderList.size) * 10;
    }
  }
};
</script>

<style scoped>
.wrap {
  min-width: 920px
}
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

.seleImg {
  width: 36px;
  height: 36px;
  border-radius: 6px;
  overflow: hidden;
}
.tableStyle {
  text-align: center;
}
.editBtn {
  height: 16px;
  margin-right: 20px;
}
.paging {
  text-align: center;
  margin-top: 70px;
}
.confirmBtn {
  background-color: red;
}
</style>