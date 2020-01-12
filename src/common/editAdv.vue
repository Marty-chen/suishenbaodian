<template>
  <div class="wraper">
    <div class="title">
      <h1>编辑广告</h1>
    </div>
    <div class="from">
      <el-form required label-position="right" label-width="120px">
        <div class="fromList">
          <div class="fromTitle">
            <span class="blueNum">1</span>
            <span>广告基本信息</span>
          </div>
          <el-form-item required label="广告标题">
            <el-input
              style="width: 560px;height:36px;"
              placeholder="请输入广告标题"
              v-model="detailList.title"
            />
          </el-form-item>

          <div v-if="isShowImgOrVidio" class="fromList" style="margin-bottom: 30px;">
            <el-form-item required label="封面图">
              <goodsEditUpload
                :initType="masterImgType"
                @imgLength="getMasterImgLen"
                @sendImgUrl="getMasterImg"
              />
            </el-form-item>
          </div>

          <div v-if="isShowImgOrVidio" class="photoAdsWraper">
            <div class="photoAds" v-for="(item,index) in detailList.advertisImgVOS" :key="index">
              <el-form-item required label="内容段">
                <el-input
                  :rows="7"
                  :show-word-limit="true"
                  maxlength="100"
                  type="textarea"
                  style="width:560px;height:160px;"
                  @input="change($event)"
                  placeholder="请输入广告内容"
                  v-model="item.content"
                />
              </el-form-item>
              <el-form-item required label="广告图">
                <goodsEditUpload
                  :initType="item.advertisImgVOSType"
                  @imgLength="getAdvImgLen(arguments[0],index)"
                  @sendImgUrl="getAdvImg(arguments[0],index)"
                />
              </el-form-item>
            </div>
            <el-form-item>
              <el-button @click="addAds" class="addAdsBtn">+ 添加内容段</el-button>
            </el-form-item>
          </div>

          <div v-else>
            <el-form-item required label="视频广告">
              <uploadVod @my-event="getMyEvent" :videoFristImg="videoFristImg" ref="childVod" />
            </el-form-item>
          </div>
        </div>

        <div class="fromList">
          <div class="fromTitle">
            <span class="blueNum">2</span>
            <span>广告标签</span>
          </div>
          <el-form-item required label="广告标签">
            <el-input
              :disabled="detailList.tags.length==3"
              style="width:360px;height:36px;"
              placeholder="请输入标签名（最多3个标签）"
              v-model="inputTag"
              type="text"
            />
            <el-button
              @click="addTag"
              :disabled="!inputTag.length || detailList.tags.length==3"
              style="margin-left:10px;color:#fff; background-color:var(--color-tint)"
            >确定</el-button>
            <div class="tags">
              <el-tag
                class="tagsItem"
                v-for="(item,index) in detailList.tags"
                :key="index"
                :closable="true"
                @close="handleClose(index)"
              >{{ item }}</el-tag>
            </div>
          </el-form-item>
        </div>

        <div class="fromList">
          <div class="fromTitle">
            <span class="blueNum">3</span>
            <span>广告投放范围(选填)</span>
          </div>
          <el-form-item label="年龄段">
            <el-radio-group v-model="radioAge">
              <el-radio :label="0">不限定</el-radio>
              <el-radio :label="1">
                <el-input
                  type="number"
                  :disabled="!radioAge"
                  style="width:140px;height:36px;"
                  placeholder="请输入年龄"
                  v-model="detailList.minAge"
                />
                <span style="padding:0 10px;color:#999">一</span>
                <el-input
                  type="number"
                  :disabled="!radioAge"
                  style="width:140px;height:36px;"
                  placeholder="请输入年龄"
                  v-model="detailList.maxAge"
                />
              </el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="性别">
            <el-radio-group v-model="detailList.sex">
              <el-radio>不限定</el-radio>
              <el-radio :label="1">男</el-radio>
              <el-radio :label="0">女</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="地域">
            <el-collapse
              @change="collapaseChang"
              v-model="collaActiveName"
              accordion
              style="margin-top:10px;width:670px"
            >
              <div class="shopList" v-for="(item,index) in detailList.disList" :key="index">
                <el-collapse-item
                  :title="'已选地域'+(index+1)+'：'+ item.name + '一一' + item.actives"
                  :name="index+1"
                  class="collapseItem"
                >
                  <el-select
                    @change="handleCityChoose(index)"
                    v-model="item.disId"
                    style="width:300px;color:#333;"
                    placeholder="请选择省"
                  >
                    <el-option
                      v-for="item1 in citys"
                      :key="item1.code"
                      :label="item1.name"
                      :value="item1.disId"
                    >
                      <span style="float: left">{{ item1.name }}</span>
                      <span style="float: right; color: #8492a6; font-size: 13px">{{ item1.disId }}</span>
                    </el-option>
                  </el-select>
                  <div class="citys">
                    <div
                      @click="handleCityList(index,i)"
                      class="cityList"
                      :class="{active:list.active}"
                      v-for="(list,i) in item.children"
                      :key="i"
                    >{{list.name}}</div>
                  </div>
                  <div style="margin-top:10px;">
                    <el-button @click="handleAllChoose(index)" class="cityBtns1">全选</el-button>
                    <!-- <el-button
                      @click="Determine(index)"
                      :disabled="!item.disId"
                      class="cityBtns2"
                    >确定</el-button>-->
                  </div>
                </el-collapse-item>
                <el-button v-show="caseNum!==(index+1)" @click="deleCity(index)" class="deleShop">删除</el-button>
              </div>
            </el-collapse>
            <el-form-item>
              <el-button class="addShopBtn" @click="addCityBtn" size="small">+ 添加地域</el-button>
            </el-form-item>
          </el-form-item>
        </div>

        <div class="fromList">
          <div class="fromTitle">
            <span class="blueNum">4</span>
            <span>选择店铺</span>
          </div>
          <el-form-item required label="店铺">
            <el-select
              @change="shopChange"
              v-model="detailList.storeId"
              style="width:300px"
              placeholder="请选择店铺"
            >
              <el-option
                v-for="item in advLimits.storeVOS"
                :key="item.storeId"
                :label="item.storeName"
                :value="item.storeId"
              >
                <span style="float: left">{{ item.storeName }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px">{{ item.storeId }}</span>
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item v-if="isOnlineShop" required label="链接">
            <el-input
              style="width: 400px;height:36px;"
              placeholder="请输入您的商铺链接"
              v-model="detailList.url"
            />
          </el-form-item>
        </div>

        <div class="fromList" style="border:none;">
          <div class="fromTitle">
            <span class="blueNum">5</span>
            <span>广告费</span>
          </div>
          <el-form-item required label="总金额">
            <el-input
              style="width:300px;;"
              type="number"
              :placeholder="'输入广告投放金额,余额:'+detailList.balancePrice+'元'"
              v-model="detailList.totalPrice"
            />
          </el-form-item>
          <div style="margin-bottom:120px;"></div>
        </div>
      </el-form>
    </div>
    <div class="footer">
      <div class="btns">
        <el-button @click="saveAdv" v-loading="loading" :disabled="loading" class="leftBtn">提交并发布</el-button>

        <el-button @click="saveDraft">存为草稿</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { advDetail, advLimit, releaseAdv, editAdv } from "../network/adv.js";
import goodsEditUpload from "../comUpload/goodsEditUpload";
import { getCitys } from "../network/common.js";

export default {
  components: {
    goodsEditUpload
  },
  props: {
    toNewAdvProps: {
      type: Object
    }
  },
  data() {
    return {
      inputTag: "",
      masterImgType: { limit: 1, multiple: false, type: 3, fileList: [] },
      detailList: {
        videoFrame: "", //视频第一帧
        totalPrice: "", //总金额
        watchNum: "", //观看数
        collectNum: "", //收藏数
        title: "", //标题
        type: "", //类型 0-图文 1-视频 2-图文草稿  3-视频草稿
        putaway: "", //是否上架  0-否  1-是
        shareNum: "", //分享数
        storeName: "", //店铺名字
        tags: [], //标签
        balancePrice: "", //剩余金额
        advId: "", //广告id
        storeId: "", //店铺id
        maxAge: "", //最大年纪
        minAge: "", //最小年纪
        storeLogo: "", //店铺logo
        video: "", //视频
        sex: "", //性别  0-女  1-男
        second: "", //秒数
        ossUrl: "", //oss路劲
        videoUrl: "", //视频路径
        masterImg: "", //封面图
        url: "", //链接
        disList: [], //城市数据
        districtValidVOS: [],
        advertisImgVOS: [
          {
            advImg: "", //图片
            content: "", //内容段
            advertisImgVOSType: {
              limit: 1,
              multiple: false,
              type: 3,
              fileList: []
            }
          }
        ]
      },
      collaActiveName: 0,
      caseNum: "",
      citys: "", //从后台获取到得城市数据

      active: false,
      cityes: [],
      radioAge: 0,
      advLimits: "",

      loading: false,
      isOnlineShop: false,
      videoFristImg: ""
    };
  },
  methods: {
    //视频上传得到URL
    getMyEvent(vid) {
      this.detailList.video = vid.url;

      console.log(vid);
      this.detailList.second = vid.duration;
      this.detailList.videoFrame = vid.firstImg;
    },
    //输入框数据及时更新
    change(e) {
      this.$forceUpdate();
    },
    //判断线上还是线下店铺
    shopChange(val) {
      console.log(val);
      let shop = this.advLimits.storeVOS.find(item => item.storeId == val);
      if (shop.type == 0) {
        this.isOnlineShop = true;
      } else {
        this.isOnlineShop = false;
      }
    },
    //提交前图片处理
    getMasterImgLen() {
      this.detailList.masterImg = "";
    },
    getAdvImgLen(fileList, index) {
      // console.log(fileList, index);
      this.detailList.advertisImgVOS[index].advImg = "";
    },
    //拿到封面图片地址
    getMasterImg(val) {
      this.detailList.masterImg = val.name;
      // console.log(this.detailList.masterImg);
    },
    //拿到内容段图片地址
    getAdvImg(val, index) {
      this.detailList.advertisImgVOS[index].advImg = val.name;
      console.log(val);
    },

    //增加内容段
    addAds() {
      this.detailList.advertisImgVOS.push({
        content: "",
        advertisImgVOSType: { limit: 1, multiple: false, type: 3, fileList: [] }
      });
    },

    //删除标签
    handleClose(index) {
      this.detailList.tags.splice(this.detailList.tags[index], 1);
    },
    //增加标签
    addTag() {
      this.detailList.tags.push("#" + this.inputTag);
      this.inputTag = "";
    },

    //打开省选择获取城市信息
    handleCityChoose(index) {
      this.$forceUpdate();
      // console.log(index);

      let cityes = [];
      let findCity = this.citys.find(item => {
        return item.disId == this.detailList.disList[index].disId;
      });
      console.log(findCity);

      findCity.children.forEach(item => {
        cityes.push({
          name: item.name,
          disId: item.disId,
          parentId: item.parentId,
          active: false
        });
      });
      this.cityes = cityes;

      this.detailList.disList[index] = {
        children: this.cityes,
        name: findCity.name,
        disId: findCity.disId,
        isAll: "",
        disPid: "",
        actives: ""
      };
      console.log(this.detailList.disList[index]);
    },

    //切换城市选中状态
    handleCityList(index, i) {
      this.$forceUpdate();
      this.detailList.disList[index].children[i].active = !this.detailList
        .disList[index].children[i].active;
      // this.detailList.disList[index].actives = 444
      let acts = this.detailList.disList[index].children.filter(
        item => item.active == true
      );
      // console.log(acts);
      let words = "";
      acts.forEach(item => {
        words += item.name + "、";
      });
      this.detailList.disList[index].actives = words;
    },
    //城市全选切换
    handleAllChoose(index) {
      this.detailList.disList[index].children.forEach(item => {
        item.active = !this.active;
      });
      this.active = !this.active;

      let acts = this.detailList.disList[index].children.filter(
        item => item.active == true
      );
      // console.log(acts);
      let words = "";
      acts.forEach(item => {
        words += item.name + "、";
      });
      this.detailList.disList[index].actives = words;
    },
    //确定更改城市
    Determine(index) {
      this.collaActiveName = 0;
    },
    //删除城市一项
    deleCity(index) {
      this.detailList.disList.splice(index, 1);
    },
    // {children:[],name:'',disId:'',isAll:'',disPid:'',actives:'请展开选择城市，或者删除该项'}
    //添加地域
    addCityBtn() {
      this.detailList.disList.push({
        children: [],
        name: "",
        disId: "",
        actives: "请展开选择城市，否则删除该项",
        isAll: "",
        disPid: ""
      });
      //自动展开新增的项
      this.collaActiveName = this.detailList.disList.length;
    },
    //城市折叠收起
    collapaseChang(val) {
      this.caseNum = val;
    },

    //提交并发布
    saveAdv() {
      //提交内容判断并提示
      if (this.contentJudgment()) {
        //0-保存为草稿 1-发布
        this.detailList.putaway = 1;
        this.handleData();
      }
    },
    //存为草稿
    saveDraft() {
      //提交内容判断并提示
      if (this.contentJudgment()) {
        //0-保存为草稿 1-发布
        this.detailList.putaway = 0;
        this.handleData();
      }
    },

    //处理数据 做提交前准备
    handleData() {
      //显示加载组件
      this.loading = Loading.service({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });

      if (this.detailList.type == 0 || this.detailList.type == 2) {
        //上传图片，拿地址
      } else {
        //上传视频，拿地址
        this.$refs.childVod.authUpload();
      }
      //梳理城市数据
      let districtValidVOS = [];
      this.detailList.disList.forEach(item => {
        let atvs = item.children.filter(list => list.active == true);
        let disIds = "";
        if (atvs.length == 0 || atvs.length == item.children.length) {
          districtValidVOS.push({
            disPid: item.disId
          });
        } else {
          atvs.forEach(n => {
            disIds += n.disId + ",";
          });
          districtValidVOS.push({
            disPid: item.disId,
            disId: disIds
          });
        }
      });
      this.detailList.districtValidVOS = districtValidVOS.filter(
        item => item.disPid
      );
      console.log(this.detailList.districtValidVOS);

      let that = this;
      let timer = null;
      let time = 0;
      let advConLen = this.detailList.advertisImgVOS.length;
      timer = setInterval(() => {
        time += 2;
        //设置类型 类型 0-图文 2-图文草稿  1-视频 3-视频草稿
        if (this.detailList.type == 0 || this.detailList.type == 2) {
          console.log("图片");
          if (
            this.detailList.advertisImgVOS[advConLen - 1].advImg &&
            this.detailList.masterImg
          ) {
            clearInterval(timer);
            timer = null;
            this.loading.close(); //关闭加载提示
            this.senEditAdv();
          }
        } else {
          console.log(this.detailList.type);
          console.log("shipin");
          if (this.detailList.video) {
            clearInterval(timer);
            timer = null;
            this.loading.close(); //关闭加载提示
            this.senDataToJava();
          }
        }
        if (time >= 30) {
          clearInterval(timer);
          timer = null;
          this.$alert("", "图片上传失败，请重新提交", {
            confirmButtonText: "确定",
            type: "warning",
            center: true
          });
          this.loading.close(); //关闭加载提示
        }
      }, 2000);
    },

    /***
     ****************网络请求函数**************************
     */
    //向后台发送编辑请求
    senEditAdv() {
      editAdv(this.detailList).then(res => {
        // console.log(res);
        if (res.data.code == "0000") {
          this.$message({
            message: "提交成功",
            type: "success"
          });
          //关闭窗口

          this.$emit("closeClick", "");
        } else {
          this.$alert("", res.data.msg, {
            confirmButtonText: "确定",
            type: "warning",
            center: true
          })
            .then(() => {})
            .catch(() => {});
        }
      });
    },

    //编辑广告  请求详情数据
    getAdvDetail(data) {
      advDetail(data).then(res => {
        if (res.data.code == "0000") {
          let list = res.data.data;
          console.log(list);
          //绑定第一层数据
          this.detailList = list;
          //设置视频第一帧
          if (list.videoFrame) {
            this.videoFristImg = ossUrl + videoFrame;
          }

          //设置内容段默认数据
          list.advertisImgVOS.forEach((item, index) => {
            this.detailList.advertisImgVOS[index] = {
              advImg: item.advImg,
              content: item.content,
              advertisImgVOSType: {
                limit: 1,
                multiple: false,
                type: 3,
                fileList: [{ url: list.ossUrl + item.advImg }]
              }
            };
          });

          // 封面图数据
          this.masterImgType = {
            limit: 1,
            multiple: false,
            type: 3,
            fileList: [{ url: list.ossUrl + list.masterImg }]
          };

          //城市数据处理

          list.disList.forEach((item, index) => {
            let findCity = this.citys.find(item => {
              return item.disId == list.disList[index].disId;
            });
            let cityes = [];
            findCity.children.forEach(item => {
              cityes.push({
                name: item.name,
                disId: item.disId,
                parentId: item.parentId,
                active: false
              });
            });
            this.cityes = cityes;
            this.detailList.disList[index] = {
              children: this.cityes,
              name: findCity.name,
              disId: findCity.disId,
              isAll: "",
              disPid: "",
              actives: ""
            };
          });
          // console.log(this.detailList.disList)
          //遍历出已选中的城市
          this.detailList.disList.forEach((itemP, index) => {
            itemP.children.forEach((itemC, i) => {
              list.disList[index].children.forEach(list => {
                if (itemC.disId == list.disId) {
                  this.detailList.disList[index].children[i].active = true;
                }
              });
            });
          });
          // 循环出要显示的市区
          list.disList.forEach((item, index) => {
            let words = "";
            item.children.forEach(list => {
              words += list.name + "、";
            });
            this.detailList.disList[index].actives = words;
          });
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },

    //店铺列表，视频/图文时长，最低发布金额
    getAdvLimit() {
      advLimit().then(res => {
        if (res.data.code == "0000") {
          this.advLimits = res.data.data;
          // console.log(this.advLimits);
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    //提交内容判断并提示
    contentJudgment() {
      if (!this.detailList.title) {
        this.$alert("", "请输入广告标题", {
          confirmButtonText: "确定",
          callback: action => {}
        });
        this.loading.close(); //关闭加载提示
        return false;
      }
      if (!this.detailList.tags.length) {
        this.$alert("", "请添加广告标签", {
          confirmButtonText: "确定",
          callback: action => {}
        });
        this.loading.close(); //关闭加载提示
        return false;
      }
      if (!this.detailList.storeId) {
        this.$alert("", "请选择店铺", {
          confirmButtonText: "确定",
          callback: action => {}
        });
        this.loading.close(); //关闭加载提示
        return false;
      }
      if (
        +this.detailList.issueSingle <
        +this.advLimits.advertisRestrictVO.minissueSingle
      ) {
        this.$alert(
          "",
          `发放红包不得低于${this.advLimits.advertisRestrictVO.minissueSingle}个/天`,
          {
            confirmButtonText: "确定",
            callback: action => {}
          }
        );
        this.loading.close(); //关闭加载提示
        return false;
      }
      if (+this.detailList.issueSingle > +this.detailList.totalPrice) {
        this.$alert("", "每天发放红包数量不得大于投放红包总数", {
          confirmButtonText: "确定",
          callback: action => {}
        });
        this.loading.close(); //关闭加载提示
        return false;
      }
      return true;
    }
  },
  created() {
    // 获取城市

    let citys = JSON.parse(localStorage.getItem("citys"));
    this.citys = citys;
    // console.log(citys)
    //店铺列表，视频/图文时长，最低发布金额
    this.getAdvLimit();
    // console.log(this.toNewAdvProps)
    //判断是否编辑状态 请求详情数据
    if (this.toNewAdvProps.advId) {
      let id = { advId: this.toNewAdvProps.advId };
      this.getAdvDetail(id);
    }
  },
  computed: {
    isShowImgOrVidio() {
      if (this.toNewAdvProps.type != 2) {
        return !this.toNewAdvProps.type;
      } else {
        return this.toNewAdvProps.caogaoType == 2;
      }
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
  color: var(--color-tint);
}

.upload >>> .el-upload--picture-card {
  width: 88px;
  height: 88px;
  line-height: 88px;
  border: 1px solid #ccc;
}
.upload >>> .el-upload-list--picture-card .el-upload-list__item {
  width: 88px;
  height: 88px;
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
  color: var(--color-tint);
  font-size: 28px;
  padding-right: 20px;
}
.residueNumber {
  color: #ccc;
  font-size: 16px;
  position: absolute;
  bottom: 0px;
  right: 200px;
}
.tags {
  margin-top: 20px;
}
.tagsItem {
  margin-right: 30px;
  color: var(--color-tint);
  font-size: 16px;
  background-color: #fff;
  border: 1px dashed var(--color-tint);
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
  margin-right: 40px;
  color: #fff;
  background-color: var(--color-tint);
  border: none;
}
.citys {
  display: flex;
  margin-top: 30px;
  flex-wrap: wrap;
}
.cityList {
  width: 100px;
  height: 36px;
  border: 1px dashed #ccc;
  color: #666;
  font-size: 14px;
  text-align: center;
  line-height: 36px;
  margin-right: 20px;
  margin-bottom: 20px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.cityList.active {
  border: 1px dashed #005bea;
  color: var(--color-tint);
}
.cityBtns1 {
  width: 100px;
  height: 36px;
  border: 1px solid var(--color-tint);
  color: var(--color-tint);
  line-height: 10px;
  margin-right: 10px;
}
.cityBtns2 {
  width: 100px;
  height: 36px;
  line-height: 10px;
  color: #fff;
  background-color: var(--color-tint);
  border: none;
}
.addShopBtn {
  margin-top: 30px;
  background-color: #e6e6e6;
  color: var(--color-tint);
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
  right: -65px;
  font-size: 16px;
  color: var(--color-tint);
  border: none;
}
.explain {
  font-size: 12px;
  margin: 0 0 30px 100px;
  color: #ccc;
}
.collapseItem {
  width: 650px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>