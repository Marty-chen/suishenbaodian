<template>
  <div class="wraper">
    <div class="title">
      <h1>新增商品</h1>
    </div>
    <div class="from">
      <el-form required label-position="right" label-width="120px">
        <div class="fromList">
          <div class="fromTitle">
            <span class="blueNum">1</span>
            <span>商品基本信息</span>
          </div>
          <el-form-item required label="商品名称">
            <el-input
              style="width: 560px;height:36px;"
              placeholder="请输入商品标题"
              v-model="goodsList.title"
            />
          </el-form-item>

          <el-form-item required label="商品轮播图">
            <upload
              @imgLength="getLubotuLength"
              :initType="lunbotuImgType"
              @sendImgUrl="getLunbotuImg"
              ref="uploadLunbotuImg"
            />
          </el-form-item>
          <div class="explain">最多只能上传 5 张图片</div>
          <el-form-item required label="商品详情图">
            <upload
              @imgLength="getgoodsFileVOSLength"
              :initType="goodsFileVOSImgType"
              @sendImgUrl="getgoodsFileVOSImg"
              ref="uploadgoodsFileVOSImg"
            />
          </el-form-item>
          <div class="explain">最多只能上传 10 张图片</div>
        </div>

        <div class="fromList">
          <div class="fromTitle">
            <span class="blueNum">2</span>
            <span>商品属性与价格</span>
          </div>
          <el-form-item required label="商品">
            <el-table :data="goodsList.goodsSkuVOS" border>
              <el-table-column align="center" prop="skuImg" label=" 商品图" width>
                <template slot-scope="scope">
                  <miniNewUpload
                    :initType="scope.row.skuType"
                    @sendImgUrl="getSkuImg"
                    :ref="scope.row.uploadSku"
                  />
                </template>
              </el-table-column>
              <el-table-column align="center" width="240" label="商品属性">
                <template slot-scope="scope">
                  <input
                    class="inputStyle"
                    placeholder="输入商品属性"
                    v-model="scope.row.skuName"
                    style="border: none;padding: 3px 3px;width: 100%;height:50px; text-align:center;"
                  />
                </template>
              </el-table-column>

              <el-table-column align="center" width="150" label="商品单价">
                <template slot-scope="scope">
                  <input
                    type="number"
                    class="inputStyle"
                    placeholder="输入商品价格"
                    v-model="scope.row.price"
                    style="border: none;padding: 3px 3px;width: 100%;height:50px; text-align:center;"
                  />
                </template>
              </el-table-column>
              <el-table-column align="center" label="操作">
                <template slot-scope="scope">
                  <el-button @click="deleGoodsList(scope.row,scope.$index)" class="deleGoodsList">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
          <el-form-item>
            <el-button @click="addGoodsList" class="addGoodsBtn">+ 添加商品</el-button>
          </el-form-item>
        </div>

        <div class="fromList">
          <div class="fromTitle">
            <span class="blueNum">3</span>
            <span>服务与承诺</span>
          </div>
          <el-form-item required label="运费">
            <div class="radios">
              <i @click="changeFreight(0)">
                <img v-if="goodsList.exemption" src="../assets/img/selection_default_icon.png" alt />
                <img v-else src="../assets/img/selection_icon.png" alt />
              </i>

              <el-input
                type="number"
                :disabled="goodsList.exemption==1"
                style="width:180px;height:36px;"
                placeholder="请输入运费金额"
                v-model="goodsList.freight"
              />
              <span style="margin-left:5px;">元</span>
            </div>
            <div class="radios" @click="changeFreight(1)">
              <img v-if="!goodsList.exemption" src="../assets/img/selection_default_icon.png" alt />
              <img v-else src="../assets/img/selection_icon.png" alt />免运费
            </div>
          </el-form-item>

          <el-form-item label="承诺">
            <div class="radios" @click="changeReason">
              <img v-if="!goodsList.reason" src="../assets/img/selection_default_icon.png" alt />
              <img v-else src="../assets/img/selection_icon.png" alt />7天无理退换
            </div>

            <div class="radios" @click="changeCompensate">
              <img v-if="!goodsList.compensate" src="../assets/img/selection_default_icon.png" alt />
              <img v-else src="../assets/img/selection_icon.png" alt />假一赔三
            </div>

            <div class="radios" @click="changeRefund">
              <img v-if="!goodsList.refund" src="../assets/img/selection_default_icon.png" alt />
              <img v-else src="../assets/img/selection_icon.png" alt />极速退款
            </div>
          </el-form-item>
        </div>

        <div class="fromList">
          <div class="fromTitle">
            <span class="blueNum">4</span>
            <span>商家联系方式</span>
          </div>
          <el-form-item required label="电话号码">
            <el-input
              type="number"
              style="width: 360px;height:36px;"
              placeholder="请输入联系人电话号码"
              v-model="goodsList.phone"
            />
          </el-form-item>

          <div style="margin-bottom:50px;"></div>
        </div>

        <div style="margin-bottom:120px;"></div>
      </el-form>
    </div>
    <div class="footer">
      <div class="btns">
        <el-button @click="saveAdv" v-loading="loading" class="leftBtn">提交并发布</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { goodsSave } from "../network/goods.js";
import upload from "../comUpload/imgUpload";
import miniNewUpload from "../comUpload/miniNewUpload";

export default {
  components: {
    upload,
    miniNewUpload
  },

  data() {
    return {
      lunbotuImgType: { limit: 5, multiple: true, type: 4, fileList: [] },
      goodsFileVOSImgType: { limit: 10, multiple: true, type: 4, fileList: [] },
      goodsList: {
        title: "",
        phone: "",
        img1: "",
        img2: "",
        img3: "",
        img4: "",
        img5: "",
        exemption: 1, //是否包邮 0-否 1-是
        freight: "", //运费
        compensate: 0,
        reason: 0,
        refund: 0,
        goodsFileVOS: [], //详情图集合
        goodsSkuVOS: [{
        skuName: "",
        price: "",
        skuImg: "",
        skuType: { limit: 1, multiple: false, type: 4, fileList: [] },
        uploadSku: 'uploadSkuImg1'
      }] //sku属性集合
      },
      loading: false,
      lubotuLength: "",
      goodsFileVOSLength: "",
      lubotuUploadedLength: "",
      goodsImgIndex: 0
    };
  },
  methods: {
    //上传图片前知道要上传图片的数量
    getLubotuLength(val) {
      // console.log(val);
      this.lubotuLength = val;
    },
    getgoodsFileVOSLength(val) {
      // console.log(val);
      this.goodsFileVOSLength = val;
    },
    //拿到轮播图片地址
    getLunbotuImg(val) {
      // console.log(val);
      this.lubotuUploadedLength = val.length;

      if (val[0]) {
        this.goodsList.img1 = val[0];
      }
      if (val[1]) {
        this.goodsList.img2 = val[1];
      }
      if (val[2]) {
        this.goodsList.img3 = val[2];
      }
      if (val[3]) {
        this.goodsList.img4 = val[3];
      }
      if (val[4]) {
        this.goodsList.img5 = val[4];
      }
    },
    //拿到详情图片地址
    getgoodsFileVOSImg(val) {
      // console.log(val);
      val.forEach(item => {
        this.goodsList.goodsFileVOS.push({ url: item });
      });
    },
    //拿商品图片地址
    getSkuImg(val) {
      console.log(val);
      this.goodsList.goodsSkuVOS[this.goodsImgIndex].skuImg = val[0];
      this.goodsImgIndex++;
    },

    //运费选择
    changeFreight(val) {
      this.goodsList.exemption = val;
      if (val == 1) {
        this.goodsList.freight = "";
      }
    },
    //7天无理由
    changeReason() {
      if (this.goodsList.reason == 0) {
        this.goodsList.reason = 1;
      } else {
        this.goodsList.reason = 0;
      }
    },
    //假一赔三
    changeCompensate() {
      if (this.goodsList.compensate == 0) {
        this.goodsList.compensate = 1;
      } else {
        this.goodsList.compensate = 0;
      }
    },
    //急速退款
    changeRefund() {
      if (this.goodsList.refund == 0) {
        this.goodsList.refund = 1;
      } else {
        this.goodsList.refund = 0;
      }
    },
    //删除商品
    deleGoodsList(row, index) {
      this.goodsList.goodsSkuVOS.splice(index, 1);
    },
    //增加商品
    addGoodsList() {
      this.goodsList.goodsSkuVOS.push({
        skuName: "",
        price: "",
        skuImg: "",
        skuType: { limit: 1, multiple: false, type: 4, fileList: [] },
        uploadSku: "uploadSkuImg" + (this.goodsList.goodsSkuVOS.length + 1)
      });
    },
    /***
     *      网络请求函数
     */
    //提交并发布
    saveAdv() {
      this.loading = true;
      if (!this.goodsList.title) {
        this.$alert("", "请输入商品名称", {
          confirmButtonText: "确定",
          type: "warning",
          center: true
        });
        this.loading = false;
        return;
      }
       if (this.goodsList.exemption==0 && !this.goodsList.freight) {
        this.$alert("", "请输入运费", {
          confirmButtonText: "确定",
          type: "warning",
          center: true
        });
        this.loading = false;
        return;
      }

      //通知组件开始上传图片
      this.$refs.uploadLunbotuImg.submitUpload();
      this.$refs.uploadgoodsFileVOSImg.submitUpload();
      if (this.goodsList.goodsSkuVOS[0]) {
        this.$refs.uploadSkuImg1.submitUpload();
      }
      if (this.goodsList.goodsSkuVOS[1]) {
        this.$refs.uploadSkuImg2.submitUpload();
      }
      if (this.goodsList.goodsSkuVOS[2]) {
        this.$refs.uploadSkuImg3.submitUpload();
      }
      if (this.goodsList.goodsSkuVOS[3]) {
        this.$refs.uploadSkuImg4.submitUpload();
      }
      if (this.goodsList.goodsSkuVOS[4]) {
        this.$refs.uploadSkuImg5.submitUpload();
      }
      if (this.goodsList.goodsSkuVOS[5]) {
        this.$refs.uploadSkuImg6.submitUpload();
      }
      if (this.goodsList.goodsSkuVOS[6]) {
        this.$refs.uploadSkuImg7.submitUpload();
      }
      if (this.goodsList.goodsSkuVOS[7]) {
        this.$refs.uploadSkuImg8.submitUpload();
      }
      if (this.goodsList.goodsSkuVOS[8]) {
        this.$refs.uploadSkuImg9.submitUpload();
      }
      if (this.goodsList.goodsSkuVOS[9]) {
        this.$refs.uploadSkuImg10.submitUpload();
      }

      //上传图片，拿地址

      let that = this;
      let timer = null;
      let time = 0;
      timer = setInterval(() => {
        time += 2;
        // console.log(this.goodsList.goodsSkuVOS.length);
        let len = 1
        if(this.goodsList.goodsSkuVOS.length>=1) {
           len = this.goodsList.goodsSkuVOS.length;
        }
        
        if (
          that.goodsFileVOSLength == that.goodsList.goodsFileVOS.length &&
          that.lubotuUploadedLength == that.lubotuLength &&
          that.goodsList.goodsSkuVOS[len-1].skuImg
        ) {
          clearInterval(timer);
          timer = null;
          this.loading = false;
          if (!this.goodsList.img1) {
            this.$alert("", "请上传轮播图", {
              confirmButtonText: "确定",
              type: "warning",
              center: true
            });
            return;
          }
          if (!this.goodsList.goodsFileVOS[0].url) {
            this.$alert("", "请上传详情图", {
              confirmButtonText: "确定",
              type: "warning",
              center: true
            });
            return;
          }
          if (!this.goodsList.goodsSkuVOS[0].skuImg) {
            this.$alert("", "请上商品图", {
              confirmButtonText: "确定",
              type: "warning",
              center: true
            });
            return;
          }

          console.log(that.goodsList);

          goodsSave(that.goodsList).then(res => {
            console.log(res);
            if (res.data.code == "0000") {
              that.$message({
                message: "提交成功",
                type: "success"
              });
              that.loading = false;
              //关闭窗口
              that.$emit("closeMongolia", "");
            } else {
              that
                .$alert("", res.data.msg, {
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
        } else if (time >= 30) {
          clearInterval(timer);
          timer = null;
          this.$alert("", "图片上传失败，请重新提交", {
            confirmButtonText: "确定",
            type: "warning",
            center: true
          });
          that.loading = false;
        }
      }, 2000);
    }
  },
  created() {}
};
</script>



<style scoped>
.el-table {
  font-size: 16px;
  color: #666;
  border-radius: 4px;
}
.el-table >>> thead {
  color: #333;
  line-height: 0px;
}
.el-table >>> th {
  font-weight: 400;
  font-size: 16px;
  background-color: #e6e6e6;
}

.el-form-item >>> .el-radio__inne {
  background: #ffa800;
  border-color: #ffa800;
}
.el-form-item {
  margin-bottom: 30px;
}
.el-form-item >>> .el-icon-circle-close {
  color: #fff;
}
.el-form-item >>> .el-form-item__label {
  font-size: 18px;
}
.wraper {
  width: 100%;
  position: relative;
}
.wraper .title {
  width: 100%;
  position: sticky;
  top: 0;
  left: 0;
  height: 60px;
  background-color: #fff;
  border-bottom: 1px solid #e6e6e6;
  z-index: 9;
  margin-top: -19px;
}
.wraper .title h1 {
  text-align: center;
  padding-top: 15px;
  font-size: 24px;
  font-weight: 400;
  color: #333;
}

.photoAds {
  border-bottom: 1px solid #e6e6e6;
  margin-bottom: 40px;
}
.photoAdsWraper .photoAds:nth-last-child(2) {
  border: none;
}
.addAdsBtn {
  width: 160px;
  height: 40px;
  background: rgba(242, 245, 250, 1);
  color: #ffa800;
}

.upload-icon-img {
  width: 38px;
  height: 38px;
  margin: 15px auto;
  line-height: normal;
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
.footer .leftBtn {
  color: #fff;
  background-color: #ffa800;
  border: none;
}

.explain {
  font-size: 12px;
  margin: 0 0 30px 120px;
  color: var(--color-high-text);
}
.collapseItem {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.delContent {
  font-size: 14px;
  float: right;
}
.delContentBtn {
  color: #ffa800;
  border: none;
  background: #fff;
  width: 100px;
  height: 20px;
  text-align: center;
  line-height: 0px;
}
.radios {
  display: inline-block;
  margin-right: 40px;
}
.radios img {
  width: 18px;
  height: 18px;
  margin-right: 12px;
  vertical-align: middle;
}
.addGoodsBtn {
  width: 160px;
  height: 40px;
}
.deleGoodsList {
  border: none;
  color: #ff5033;
  background-color: #fff;
}
</style>