<template>
  <div class="wraper">
    <div class="title">
      <h1>编辑商品</h1>
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
            <goodsEditUpload
              @imgLength="getLubotuLength"
              :initType="lunbotuImgType"
              @sendImgUrl="getLunbotuImg"
              ref="uploadLunbotuImg"
            />
          </el-form-item>
          <div class="explain">最多只能上传 5 张图片</div>
          <el-form-item required label="商品详情图">
            <goodsEditUpload
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
                  <miniEditUpload
                    @imgLength="getGoodsSkuVOSLength(scope.$index,arguments[0])"
                    :initType="scope.row.skuType"
                    @sendImgUrl="getSkuImg(scope.$index,arguments[0])"
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
        <el-button @click="saveAdv" v-loading="loading" :disabled="loading" class="leftBtn">提交并发布</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { goodsDetail, goodsEdit } from "../network/goods.js";
import goodsEditUpload from "../comUpload/goodsEditUpload";
import miniEditUpload from "../comUpload/miniEditUpload";

export default {
  components: {
    goodsEditUpload,
    miniEditUpload
  },
  props: {
    goodsId: {
      type: Object
    }
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
        goodsFileVOS: [{ url: "" }], //详情图集合
        goodsSkuVOS: [
          {
            skuName: "",
            price: "",
            skuImg: "",
            skuType: { limit: 1, multiple: false, type: 4, fileList: [] },
            uploadSku: "uploadSkuImg1"
          }
        ] //sku属性集合
      },
      loading: false,
      lubotuLength: "", //点击按钮前的长度
      goodsFileVOSLength: "",
      lubotuUploadedLength: "", //点击按钮后的长度
      goodsImgIndex: 0
    };
  },
  methods: {
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

    //上传图片前知道要上传图片的数量
    getLubotuLength( fileList8, type) {
      if (type == "删除") {
        // console.log(fileList8, type);
        this.goodsList.img1 = "";
        this.goodsList.img2 = "";
        this.goodsList.img3 = "";
        this.goodsList.img4 = "";
        this.goodsList.img5 = "";
        let fileList = fileList8.filter(item => item.status == "success");

        if (fileList[0]) {
          this.goodsList.img1 = fileList[0].url.split(".com/")[1];
        }
        if (fileList[1]) {
          this.goodsList.img2 = fileList[1].url.split(".com/")[1];
        }
        if (fileList[2]) {
          this.goodsList.img3 = fileList[2].url.split(".com/")[1];
        }
        if (fileList[3]) {
          this.goodsList.img4 = fileList[3].url.split(".com/")[1];
        }
        if (fileList[4]) {
          this.goodsList.img5 = fileList[4].url.split(".com/")[1];
        }
      }
      
    },
    getgoodsFileVOSLength( fileList8, type) {
      // console.log( fileList8);
      let fileList = fileList8.filter(item => item.status == "success");
      if (type == "删除") {
        // 先清空再赋值
        this.goodsList.goodsFileVOS.forEach((item, index) => {
          this.goodsList.goodsFileVOS[index].url = "";
        });
        fileList.forEach((item, index) => {
          this.goodsList.goodsFileVOS[index].url = item.url.split(".com/")[1];
        });
      }
      
    },
    //商品图提交前处理
    getGoodsSkuVOSLength(index,val) {
      console.log(index,val)
      if(this.goodsList.goodsSkuVOS[index].skuImg) { //有值，代表删除动作
        this.goodsList.goodsSkuVOS[index].skuImg = ''
      }
    },
    //拿到轮播图片地址
    getLunbotuImg(val) {
      if (!this.goodsList.img1) {
        this.goodsList.img1 = val.name;
        return;
      }
      if (!this.goodsList.img2) {
        this.goodsList.img2 = val.name;
        return;
      }
      if (!this.goodsList.img3) {
        this.goodsList.img3 = val.name;
        return;
      }
      if (!this.goodsList.img4) {
        this.goodsList.img4 = val.name;
        return;
      }
      if (!this.goodsList.img5) {
        this.goodsList.img5 = val.name;
        console.log(this.goodsList);
        return;
      }
    },
    //拿到详情图片地址
    getgoodsFileVOSImg(val) {
     

      if(!this.goodsList.goodsFileVOS[0].url) {
          this.goodsList.goodsFileVOS[0].url = val.name;
          return
        }
        if(!this.goodsList.goodsFileVOS[1].url) {
          this.goodsList.goodsFileVOS[1].url = val.name;
          return
        }
        if(!this.goodsList.goodsFileVOS[2].url) {
          this.goodsList.goodsFileVOS[2].url = val.name;
          return
        }
        if(!this.goodsList.goodsFileVOS[3].url) {
          this.goodsList.goodsFileVOS[3].url = val.name;
          return
        }
        if(!this.goodsList.goodsFileVOS[4].url) {
          this.goodsList.goodsFileVOS[4].url = val.name;
          return
        }
        if(!this.goodsList.goodsFileVOS[5].url) {
          this.goodsList.goodsFileVOS[5].url = val.name;
          return
        }
        if(!this.goodsList.goodsFileVOS[6].url) {
          this.goodsList.goodsFileVOS[6].url = val.name;
          return
        }
        if(!this.goodsList.goodsFileVOS[7].url) {
          this.goodsList.goodsFileVOS[7].url = val.name;
          return
        }
        if(!this.goodsList.goodsFileVOS[8].url) {
          this.goodsList.goodsFileVOS[8].url = val.name;
          return
        }
        if(!this.goodsList.goodsFileVOS[9].url) {
          this.goodsList.goodsFileVOS[9].url = val.name;
          return
        }
      console.log(this.goodsList.goodsFileVOS);
    },
    //拿商品图片地址
    getSkuImg(index,val) {
      console.log(index,val);
      this.goodsList.goodsSkuVOS[index].skuImg = val.name;
      
    },
    /***
     *      网络请求函数
     */
    //提交并发布
    saveAdv() {
      this.loading = true;
      // if (!this.goodsList.title) {
      //   this.$alert("", "请输入商品名称", {
      //     confirmButtonText: "确定",
      //     type: "warning",
      //     center: true
      //   });
      //   this.loading = false;
      //   return;
      // }
      //  if (this.goodsList.exemption==0 && !this.goodsList.freight) {
      //   this.$alert("", "请输入运费", {
      //     confirmButtonText: "确定",
      //     type: "warning",
      //     center: true
      //   });
      //   this.loading = false;
      //   return;
      // }

      let that = this;
      setTimeout(() => {
        this.loading = false;

        //过滤掉多余数据
        let goodsFileVOS = that.goodsList.goodsFileVOS.filter(item => item.url);
        that.goodsList.goodsFileVOS = goodsFileVOS;

        goodsEdit(that.goodsList).then(res => {
          console.log(res);

          if (res.data.code == "0000") {
            //关闭窗口
            that.$emit("closeMongolia", "");

            that.$message({
              message: "提交成功",
              type: "success"
            });
            that.loading = false;
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
      }, 8000);
    },

    //获取商品详情原始数据
    getGoodsDetail(id) {
      goodsDetail(id).then(res => {
        if (res.data.code == "0000") {
          console.log(res);
          let list = res.data.data;
          this.goodsList = res.data.data;

          //处理详情图片预览
          this.goodsList.goodsFileVOS.forEach(item => {
            this.goodsFileVOSImgType.fileList.push({
              url: list.ossUrl + item.url
            });
          });

          //  处理轮播图预览
          if (list.img1) {
            this.lunbotuImgType.fileList.push({ url: list.ossUrl + list.img1 });
          }
          if (list.img2) {
            this.lunbotuImgType.fileList.push({ url: list.ossUrl + list.img2 });
          }
          if (list.img3) {
            this.lunbotuImgType.fileList.push({ url: list.ossUrl + list.img3 });
          }
          if (list.img4) {
            this.lunbotuImgType.fileList.push({ url: list.ossUrl + list.img4 });
          }
          if (list.img5) {
            this.lunbotuImgType.fileList.push({ url: list.ossUrl + list.img5 });
          }

          // 处理商品图片预览
          list.goodsSkuVOS.forEach((item, index) => {
            this.goodsList.goodsSkuVOS[index].skuType = {
              limit: 1,
              multiple: false,
              type: 4,
              fileList: [{ url: list.ossUrl + item.skuImg }]
            };
            this.goodsList.goodsSkuVOS[index].uploadSku =
              "uploadSkuImg" + (index + 1);
          });

          //格式化详情图集合数据
          let FileVOS8 = [
            //详情图集合
            { url: "" },
            { url: "" },
            { url: "" },
            { url: "" },
            { url: "" },
            { url: "" },
            { url: "" },
            { url: "" },
            { url: "" },
            { url: "" }
          ];
          list.goodsFileVOS.forEach((item, index) => {
            FileVOS8[index].url = item.url;
          });
          this.goodsList.goodsFileVOS = FileVOS8;
          console.log(FileVOS8);
        } else {
          this.$message.error(res.data.msg);
        }
      });
    }
  },
  created() {
    this.getGoodsDetail(this.goodsId);
  }
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