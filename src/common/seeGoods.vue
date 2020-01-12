<template>
  <div class="wraper">
    <div class="title">
      <h1>商品详情</h1>
    </div>
    <div class="from">
      <el-form label-position="right" label-width="120px">
        <div class="fromList">
          <div class="fromTitle">
            <span class="blueNum">1</span>
            <span>商品基本信息</span>
          </div>
          <el-form-item label="商品名称">
            <div class="containei">{{goodsList.title}}</div>
          </el-form-item>

          <el-form-item label="商品轮播图">
            <div class="preview" v-for="(item,index) in swiper" :key="index">
              <el-image
                style="width: 88px; height: 88px;"
                fit="cover"
                :src="item.url"
                :preview-src-list="swiperPreview"
              ></el-image>
            </div>
          </el-form-item>

          <el-form-item label="商品详情图">
            <div class="preview" v-for="(item,index) in gdsFile" :key="index">
              <el-image
                style="width:88px; height: 88px;"
                fit="cover"
                :src="item.url"
                :preview-src-list="gdsFilePreview"
              />
            </div>
          </el-form-item>
        </div>

        <div class="fromList">
          <div class="fromTitle">
            <span class="blueNum">2</span>
            <span>商品属性与价格</span>
          </div>
          <el-form-item label="商品">
            <div class="sku-item" v-for="(item,index) in skuList" :key="index">
              <div class="skuImg">
                <el-image
                  style="width:60px; height: 60px;"
                  fit="cover"
                  :src="item.url"
                  :preview-src-list="skuPreview"
                />
              </div>
              <span class="sku-name">{{item.skuName}}: {{item.price}}元</span>
            </div>
          </el-form-item>
        </div>

        <div class="fromList">
          <div class="fromTitle">
            <span class="blueNum">3</span>
            <span>服务与承诺</span>
          </div>
          <el-form-item label="运费">
            <div class="font18">
              <span>{{ goodsList.freight==0? '包邮' : goodsList.freight }}</span>
            </div>
          </el-form-item>

          <el-form-item label="承诺">
            <div class="font18">
              <span>{{ goodsList.reason? '七天无理由退款;' : '' }} {{ goodsList.compensate? '假一赔三;' : ''}} {{ goodsList.refund? '极速退款' :'' }}</span>
            </div>
          </el-form-item>
        </div>

        <div class="fromList">
          <div class="fromTitle">
            <span class="blueNum">4</span>
            <span>商家联系方式</span>
          </div>
          <el-form-item label="电话号码">
            <div class="font18">{{goodsList.phone}}</div>
          </el-form-item>
        

       
          <div style="margin-bottom:100px;"></div>
        </div>
      </el-form>
    </div>
    <div style="margin-bottom:100px;"></div>
  </div>
</template>

<script>
import { goodsDetail } from "../network/goods.js";

export default {
  data() {
    return {
      goodsList: {},
      contentList: [],
      detailList: [],
      skuList: [],
      skuPreview: [],
      swiper: [],
      swiperPreview: [],
      gdsFile: [],
      gdsFilePreview: []
    };
  },
  props: ["goodsId"],
  created() {
    this.getGoodsDetail(this.goodsId);
  },
  methods: {
    getGoodsDetail(data) {
      goodsDetail(data).then(res => {
        console.log(res);
        if (res.data.code == "0000") {
          this.goodsList = res.data.data;
          let list = res.data.data;
          //拼接轮播图路径
          this.getSwiper(list);
          //拼接sku路径
          this.getSku(list);
          //拼接商品详情图路径
          this.getGdsFile(list);
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },

    //拼接商品详情图路径
    getGdsFile(list) {
      let gdsFile = [];
      let gdsFilePreview = [];
      list.goodsFileVOS.forEach(item => {
        gdsFile.push({ url: list.ossUrl + item.url });
      });
      this.gdsFile = gdsFile;
      gdsFile.forEach(item => {
        gdsFilePreview.push(item.url);
      });
      this.gdsFilePreview = gdsFilePreview;
    },

    //拼接sku路径
    getSku(list) {
      let skuList = [];
      list.goodsSkuVOS.forEach(item => {
        skuList.push({
          url: list.ossUrl + item.skuImg,
          price: item.price,
          skuId: item.skuId,
          skuName: item.skuName
        });
      });
      this.skuList = skuList;
      let skuPreview = [];
      skuList.forEach(item => {
        skuPreview.push(item.url);
      });
      this.skuPreview = skuPreview;
    },
    //拼接轮播图url
    getSwiper(list) {
      let swiper = [];
      if (list.img1) {
        swiper.push({ url: list.ossUrl + list.img1 });
      }
      if (list.img2) {
        swiper.push({ url: list.ossUrl + list.img2 });
      }
      if (list.img3) {
        swiper.push({ url: list.ossUrl + list.img3 });
      }
      if (list.img4) {
        swiper.push({ url: list.ossUrl + list.img4 });
      }
      if (list.img5) {
        swiper.push({ url: list.ossUrl + list.img5 });
      }
      this.swiper = swiper;

      //得到轮播图放大数组
      let swiperPreview = [];
      swiper.forEach(item => {
        swiperPreview.push(item.url);
      });
      this.swiperPreview = swiperPreview;
    }
  },
  computed: {}
};
</script>

<style scoped>
.el-form-item {
  margin-bottom: 10px;
}
.el-form-item >>> .el-icon-circle-close {
  color: #fff;
}
.el-form-item >>> .el-form-item__label {
  font-size: 18px;
}
.wraper {
  position: relative;
  color: #333;
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
  font-size: 24px;
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
.fromList:last-child {
  border: none;
}
.preview img {
  width: 100%;
}
.preview {
  width: 88px;
  height: 88px;
  border-radius: 4px;
  overflow: hidden;
  margin: 10px 10px 0 10px;
  display: inline-block;
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
  margin: 30px 0;
}
.fromTitle .blueNum {
  color: var(--color-tint);
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
  margin-bottom: 20px;
}
.sku-name {
  font-size: 18px;
}

.skuImg {
  display: inline-block;
  width: 60px;
  height: 60px;
  border-radius: 3px;
  overflow: hidden;
  vertical-align: middle;
  margin: 10px 15px 20px 0;
}
</style>