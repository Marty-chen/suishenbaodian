<template>
  <div class="wraper">
    <div class="title">
      <h1>新建店铺</h1>
      
    </div>
    <div class="from">
      <el-form required label-position="right" label-width="120px">
        <div class="fromList">
          <div class="fromTitle">
            <span class="blueNum">1</span>
            <span>店铺基本信息</span>
          </div>
          <el-form-item required label="店铺名">
            <el-input
              style="width: 360px;height:36px;"
              placeholder="请输入店铺名称"
              v-model="storeList.storeName"
            />
          </el-form-item>
          <el-form-item required label="行业">
            <el-select @visible-change="getStoreList" v-model="storeList.tradeId" placeholder="请选择">
              <el-option
                v-for="item in tradeOptions"
                :key="item.tradeId"
                :label="item.name"
                :value="item.tradeId"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item required label="上传logo">
            <upload :initType="logoInitType" @sendImgUrl="getLogoImg" ref="uploadLogoImg" />
          </el-form-item>
          <div class="explain">最多只能上传 1 张logo图片</div>

          <el-form-item required label="店铺形象图">
            <upload :initType="shopInitType" @sendImgUrl="getShopImg" ref="uploadImg" />
          </el-form-item>
          <div class="explain">最多只能上传 5 张图片</div>
        </div>

        <div v-if="this.editStore.type != 0" class="fromList" style="border-bottom:none;">
          <div class="fromTitle">
            <span class="blueNum">2</span>
            <span>店铺门店</span>
          </div>
          <el-collapse
            @change="collapaseChang"
            v-model="collaActiveName"
            accordion
            style="margin-left:80px;width:450px"
          >
            <div class="shopList" v-for="(item,index) in storeList.storeShopVOS" :key="index">
              <el-collapse-item
                :title="'门店'+(index+1)+' '+ item.shopName"
                :name="index+1"
                class="collapseItem"
              >
                <el-form-item required label="门店名">
                  <el-input style="width:300px;" placeholder="请输入门店名称" v-model="item.shopName" />
                </el-form-item>

                <el-form-item required label="电话号码">
                  <el-input
                    style="width:300px;"
                    placeholder="请输入电话号码"
                    v-model="item.phone"
                    type="number"
                  />
                </el-form-item>

                <el-form-item required label="所在地区">
                  <el-cascader
                    :options="citys"
                    v-model="item.disId"
                    :props="props"
                    placeholder="请选择地区"
                    change-on-select
                    style="width:300px"
                    @change="cascarder(index)"
                  />
                </el-form-item>

                <el-form-item required label="门店地址">
                  <el-input
                    style="width:300px;"
                    placeholder="请输入详细地址"
                    v-model="item.disDetailInfo"
                  />
                </el-form-item>

                <el-form-item required label>
                  <!-- <el-button @click="Determine(index)" size="small">确定</el-button> -->
                </el-form-item>
              </el-collapse-item>
              <el-button v-show="caseNum!==(index+1)" @click="deleShop(index)" class="deleShop">删除</el-button>
            </div>
          </el-collapse>

          <el-form-item>
            <el-button class="addShopBtn" @click="addShopBtn" size="small">+ 添加门店</el-button>
          </el-form-item>
        </div>
        <div style="marginTop:100px;"></div>
      </el-form>
    </div>
    <div class="footer">
      <div class="btns">
        <el-button
          :loading="loading"
          @click="saveShopData"
          :disabled="loading"
          class="leftBtn"
        >保存并提交</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import {
  detailList,
  storeTrade,
  storeEdit,
  storeSave
} from "../network/shop.js";
import { getCitys, STS } from "../network/common.js";
import ossClient from "../util/aliyun.oss.client";

import upload from "../comUpload/imgUpload";

export default {
  components: {
    upload
  },
  props: ["editStore"],
  data() {
    return {
      logoInitType: { limit: 1, multiple: false, type: 2, fileList: [] },
      shopInitType: { limit: 5, multiple: true, type: 2, fileList: [] },
      loading: false,
      tradeOptions: "", //行业类型请求后台返回
      storeList: {
        storeLogo: "",
        storeId: "",
        type: "",
        storeName: "",
        tradeId: "",
        storeImg1: "",
        storeImg2: "",
        storeImg3: "",
        storeImg4: "",
        storeImg5: "",
        storeShopVOS: [
          // { shopName: "", phone: "", disDetailInfo: "", disId: "" }
        ]
      },
      imgList1: [],
      imgList2: [],
      citys: [],
      props: {
        label: "name",
        value: "code",
        children: "children"
      },
      collaActiveName: 0,
      caseNum: ""
    };
  },

  methods: {
    //接收上传得logo图片
    getLogoImg(val) {
      if (val[0]) {
        this.storeList.storeLogo = val[0];
      }
    },
    getShopImg(val) {
      if (val[0]) {
        this.storeList.storeImg1 = val[0];
      }
      if (val[1]) {
        this.storeList.storeImg2 = val[1];
      }
      if (val[2]) {
        this.storeList.storeImg3 = val[2];
      }
      if (val[3]) {
        this.storeList.storeImg4 = val[3];
      }
      if (val[4]) {
        this.storeList.storeImg5 = val[4];
      }
    },
    //门店折叠收起
    collapaseChang(val) {
      this.caseNum = val;
    },
    //行业selec
    getStoreList() {
      if (!this.tradeOptions) {
        //获取行业
        this.getStoreTrade();
      }
    },

    // 拿城市3级数据
    cascarder(index) {
      let IdLen = this.storeList.storeShopVOS[index].disId.length - 1;
      let disIdStr = this.storeList.storeShopVOS[index].disId[IdLen];
      this.storeList.storeShopVOS[index].disId = disIdStr;
    },

    //删除店铺
    deleShop(index) {
      this.storeList.storeShopVOS.splice(index, 1);
    },

    //添加店铺
    addShopBtn() {
      this.storeList.storeShopVOS.push({
        shopName: " ",
        phone: " ",
        disDetailInfo: " ",
        disId: " "
      });
      //自动展开新增的项
      this.collaActiveName = this.storeList.storeShopVOS.length;
    },

    //确定更改
    Determine(index) {
      this.collaActiveName = 0;
    },

    //新建保存提交
    saveShopData() {
      this.loading = true;
      this.$refs.uploadLogoImg.submitUpload();
      this.$refs.uploadImg.submitUpload();
      this.storeList.type = this.editStore.type;
      let that = this;
      let timer = null;
      timer = setInterval(() => {
        if (that.storeList.storeImg1 && that.storeList.storeLogo) {
          clearInterval(timer);
          timer = null;
          storeSave(that.storeList).then(res => {
            console.log(res);
            if (res.data.code == "0000") {
              that.$message({
                message: "提交成功",
                type: "success"
              });
              that.loading = false;
              //关闭窗口
              that.$emit("closeClick", "");
            } else {
              this.$alert("", res.data.msg, {
                confirmButtonText: "确定",
                type: "warning",
                center: true
              })
                .then(() => {
                  that.loading = false;
                })
                .catch(() => {});
            }
          });
        }
      }, 2000);
    },

    //获取行业信息
    getStoreTrade() {
      storeTrade().then(res => {
        if (res.data.code == "0000") {
          this.tradeOptions = res.data.data;
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    //获取城市数据
    getCityData() {
      getCitys().then(res => {
        this.citys = res.data.data;
      });
    }
  },
  created() {
    if (this.editStore.type == 1) {
      //获取城市信息
      this.getCityData();
    }
  }
};
</script>

<style scoped>
.wraper {
  width: 100%;
  position: relative;
}
.wraper .title {
  width: 100%;
  position: sticky;
  top: 0px;
  left: 0;
  margin-top: -19px;
  height: 60px;
  background-color: #fff;
  border-bottom: 1px solid #e6e6e6;
  z-index: 9;
}
.wraper .title h1 {
  text-align: center;
  padding-top: 15px;
  font-size: 24px;
  font-weight: 400;
  color: #333;
}

.upload >>> .el-upload--picture-card {
  width: 88px;
  height: 88px;
  line-height: 0px;
  border: 1px solid #ccc;
}
.upload >>> .el-upload-list--picture-card .el-upload-list__item {
  width: 88px;
  height: 88px;
}
.upload-icon-img {
  width: 38px;
  height: 38px;
  margin: 13px auto;
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
.fromTitle {
  font-size: 22px;
  color: #333;
  margin: 30px 0;
}
.fromTitle .blueNum {
  color: #ffa800;
  font-size: 28px;
  padding-right: 20px;
}
.residueNumber {
  color: #ccc;
  font-size: 16px;
  position: absolute;
  bottom: 0px;
  right: 100px;
}

.footer {
  width: 100%;
  height: 80px;
  margin: 0 auto;
  box-shadow: 0px -2px 8px 0px rgba(153, 153, 153, 0.26);
  border-radius: 0px 0px 8px 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: sticky;
  bottom: 1px;
  left: 0;
  background-color: #fff;
}
.addShopBtn {
  margin-top: 30px;
  background-color: #e6e6e6;
  color: #ffa800;
  font-size: 14px;
  border: none;
  box-sizing: border-box;
}
.shopList {
  position: relative;
}
.deleShop {
  position: absolute;
  top: 6px;
  right: -100px;
  font-size: 16px;
  color: #ffa800;
  border: none;
}
.explain {
  font-size: 12px;
  margin: 0 0 30px 120px;
  color: #ff5777;
}
.leftBtn {
  color: #fff;
  background-color: #ffa800;
  border: none;
}
</style>