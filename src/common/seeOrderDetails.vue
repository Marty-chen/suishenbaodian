<template>
  <div class="wraper">
    <div class="title">
      <h1>订单详情</h1>
    </div>
    <div class="from">
      <el-form label-position="right" label-width="120px">
        <div class="fromList">
          <div class="fromTitle">
            <span class="blueNum">1</span>
            <span>购买信息</span>
          </div>
          <el-form-item label="商品名称">
            <div class="containei">{{detailList.title}}</div>
          </el-form-item>

          <el-form-item label="购买信息">
            <div class="font18">
              <el-image
                style="width: 60px; height: 60px; border-radius: 3px; vertical-align: middle;"
                @click="preview(detailList.img1)"
                :src="detailList.img1"
                :preview-src-list="srcList"
                fit="cover"
              ></el-image>
              <span style="margin:0 15px;">{{detailList.skuName}}: {{detailList.price}}元</span>
              <span style="margin:0 15px;">X{{detailList.totalQty}}</span>
              <span style="margin:0 55px;">实付: {{detailList.totalPrice}}元</span>

           </div>
          </el-form-item>
        </div>

        <div class="fromList">
          <div class="fromTitle">
            <span class="blueNum">2</span>
            <span>订单信息</span>
          </div>
          <el-form-item label="订单编号">
            <div class="font18">{{ detailList.code}}</div>
          </el-form-item>
          <el-form-item label="订单状态">
            <div class="font18">{{ getStatus }}</div>
          </el-form-item>
          <el-form-item label="物流单号">
            <div class="font18">{{ detailList.logisticsCode}}</div>
          </el-form-item>
          <el-form-item label="物流公司">
            <div class="font18">{{ detailList.logisticsCompany}}</div>
          </el-form-item>
          <el-form-item label="下单时间">
            <div class="font18">{{ detailList.createDate}}</div>
          </el-form-item>
        </div>

        <div class="fromList">
          <div class="fromTitle">
            <span class="blueNum">3</span>
            <span>收货人信息</span>
          </div>
          <el-form-item label="收货人">
            <div class="font18">{{detailList.userName}}</div>
          </el-form-item>

          <el-form-item label="手机号码">
            <div class="font18">{{detailList.phone}}</div>
          </el-form-item>

          <el-form-item label="收货地址">
            <div class="font18">{{detailList.disName}} {{detailList.disDetailInfo}}</div>
          </el-form-item>
        </div>

        <div class="fromList">
          <div class="fromTitle">
            <span class="blueNum">4</span>
            <span>买家留言</span>
          </div>
          <el-form-item label="留言内容">
            <div class="font18">{{detailList.note}}</div>
          </el-form-item>
        </div>

        <div class="fromList" style="border:none;">
          <div class="fromTitle">
            <span class="blueNum">5</span>
            <span>退款信息</span>
          </div>
          <el-form-item label="凭证图">
            <div class="font18"></div>
          </el-form-item>
          <el-form-item label="退款原因">
            <div class="font18"></div>
          </el-form-item>
          <el-form-item label="退款编号">
            <div class="font18"></div>
          </el-form-item>
          <el-form-item label="申请时间">
            <div class="font18"></div>
          </el-form-item>
          <div style="margin-bottom:60px;"></div>
        </div>
      </el-form>
    </div>
    <div style="margin-bottom:100px;"></div>
  </div>
</template>

<script>
import { orderDetail } from "../network/order.js";

export default {
  data() {
    return {
      detailList: "",
      srcList: []
    };
  },
  props: {
    orderId: {
      type: Object
    }
  },
  created() {
    this.getOrderDetail(this.orderId);
  },
  methods: {
    //图片预览
    preview(url) {
      let img = [];
      img.push(url);
      this.srcList = img;
    },
    //请求数据
    getOrderDetail(id) {
      orderDetail(id).then(res => {
        console.log(res);
        this.detailList = res.data.data;
      });
    }
  },
  computed: {
    getStatus() {
      switch(this.detailList.status) {
        case 0:
        return "待付款";
        case 1:
        return "付款失败";
        case 2:
        return "待发货";
        case 3:
        return "待收货";
        case 4:
        return "已完成";
        case 9:
        return "已取消";
      }
    }
  }
};
</script>

<style scoped>
.el-form-item {
  margin-bottom: 10px;
}
.el-form-item>>>.el-icon-circle-close {
  color: #fff;
 
}
.el-form-item >>> .el-form-item__label {
  font-size: 18px;
}
.fromList:last-child {
  border: none;
}
.wraper {
  position: relative;
  color: #333;
  font-size: 18px;
}
.wraper .title {
  width: 100%;
  position: sticky;
  top: 0;
  left: 0%;
  height: 60px;
  background-color: #fff;
  border-bottom: 1px solid #e6e6e6;
  z-index: 9;
  margin-top: -19px;
}
.wraper .title h1 {
  text-align: center;
  padding-top: 15px;
  font-size: 28px;
  font-weight: 400;
  color: #333;
}

.wraper .from {
  width: 900px;
  border: 1px solid #e6e6e6;
  margin: -2px auto 0 auto;
  padding: 0 40px;
  font-size: 18px;
  box-sizing: border-box;
}
.fromList {
  border-bottom: 1px solid #e6e6e6;
}
.content {
  display: inline-block;
  width: 560px;
  line-height: 20px;
  color: #333;
  font-size: 16px;
  vertical-align: top;
}
.fromTitle {
  font-size: 22px;
  color: #333;
  margin: 20px 0;
}
.fromTitle .blueNum {
  color: #ffa800;
  font-size: 28px;
  padding-right: 20px;
}
.containei {
  font-size: 18px;
  margin-left: 20px;
}
.font18 {
  font-size: 18px;
  margin-left: 30px;
  margin-bottom: 0px;
}
.addre1 {
  display: inline-block;
}
.addre2 {
  display: inline-block;
  width: 500px;
  vertical-align: top;
}
</style>