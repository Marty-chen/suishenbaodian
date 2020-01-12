<template>
  <div class="wraper">
    <div class="title">
      <h1>新建广告</h1>
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
              <upload :initType="masterImgType" @sendImgUrl="getMasterImg" ref="uploadMasterImg" />
            </el-form-item>
          </div>

          <div v-if="isShowImgOrVidio" class="photoAdsWraper">
            <div class="photoAds" v-for="(item,index) in detailList.advertisImgVOS" :key="index">
              <el-form-item required label="内容段" style="position: relative;">
                <el-input
                  :rows="7"
                  :show-word-limit="true"
                  maxlength="100"
                  style="width:560px;height:160px;"
                  type="textarea"
                  placeholder="请输入广告内容"
                  v-model="item.content"
                />
              </el-form-item>
              <el-form-item required label="广告图">
                <upload :initType="item.uploadImgType" @sendImgUrl="getAdvImg" ref="uploadAdvImg" />
              </el-form-item>
              <div class="delContent">
                <el-button @click="delContent(index)" class="delContentBtn">删除内容段</el-button>
              </div>
            </div>
            <el-form-item>
              <el-button @click="addAds" class="addAdsBtn">+ 添加内容段</el-button>
            </el-form-item>
          </div>

          <div v-else>
            <el-form-item required label="视频广告">
              <uploadVod @my-event="getMyEvent" ref="childVod" />
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
              style="width:360px;height:36px;"
              placeholder="请输入标签名（最多3个标签）"
              v-model="inputTag"
              type="text"
            />
            <el-button
              @click="addTag"
              :disabled="!inputTag.length || detailList.tags.length==3"
              style="margin-left:10px;background-color:#FFA800;color: #fff;"
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
            <span>发布条件</span>
          </div>
          <el-form-item label="年龄段">
            <el-radio-group v-model="radioAge" text-color="#FFA800" fill="#FFA800">
              <el-radio :label="0" text-color="#FFA800" fill="#FFA800">不限定</el-radio>
              <el-radio :label="1" text-color="#FFA800" fill="#FFA800">
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

          <el-form-item required label="发放时段">
            <el-select
              v-model="detailList.startissueTime"
              style="width:180px;margin-right:20px;"
              placeholder="开始时间"
            >
              <el-option
                v-for="item in startTime"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
                <span style="float: left">{{ item.label }}</span>
                <!-- <span style="float: right; color: #8492a6; font-size: 13px">{{ item.value }}</span> -->
              </el-option>
            </el-select>

            <el-select v-model="detailList.endissueTime" style="width:180px" placeholder="结束时间">
              <el-option
                v-for="item in endTime"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
                <span style="float: left">{{ item.label }}</span>
                <!-- <span style="float: right; color: #8492a6; font-size: 13px">{{ item.value }}</span> -->
              </el-option>
            </el-select>
            <span
              style="margin-left:40px;"
            >全天候(不包括0{{detailList.startissueTime}}:00～0{{detailList.endissueTime}}:00)</span>
          </el-form-item>
          <el-form-item required label="发放红包">
            <el-input
              type="number"
              min="100"
              style="width: 180px;height:36px;"
              :placeholder="'不低于'+advLimits.advertisRestrictVO.minissueSingle +'个'"
              v-model="detailList.issueSingle"
            />个/天
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
              style="width:220px"
              placeholder="请选择店铺"
            >
              <el-option
                v-for="item in advLimits.storeVOS"
                :key="item.storeId"
                :label="item.storeName"
                :value="item.storeId"
              >
                <span style="float: left">{{ item.storeName }}</span>
                <!-- <span style="float: right; color: #8492a6; font-size: 13px">{{ item.storeId }}</span> -->
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item v-if="isOnlineShop" required label="商城链接">
            <el-input
              style="width: 360px;height:36px;"
              placeholder="请输入您的商铺链接"
              v-model="detailList.url"
            />
          </el-form-item>
          <el-form-item v-if="isOnlineShop" label="现金券链接">
            <el-input
              style="width: 360px;height:36px;"
              placeholder="请输入现金券第三方链接"
              v-model="detailList.couponsUrl"
            />
          </el-form-item>
        </div>

        <div class="fromList" style="border:none;">
          <div class="fromTitle">
            <span class="blueNum">5</span>
            <span>投放红包总数</span>
          </div>
          <el-form-item required label="投放红包">
            <el-input
              style="width:220px;"
              type="number"
              min="1000"
              :placeholder="'不低于'+advLimits.advertisRestrictVO.imgPrice"
              v-model="detailList.totalPrice"
            />个
          </el-form-item>
          <div style="margin-bottom:120px;"></div>
        </div>
      </el-form>
    </div>
    <div class="footer">
      <div class="btns">
        <el-button @click="saveAdv" class="leftBtn">提交并发布</el-button>
        <el-button
          v-if="toNewAdvProps.isNewOrEdit !=1 || toNewAdvProps.type ==2"
          @click="saveDraft"
        >存为草稿</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { advDetail, advLimit, releaseAdv, editAdv } from "../network/adv.js";
import upload from "../comUpload/imgUpload";
import uploadVod from "../comUpload/uploadVod";
import { getCitys } from "../network/common.js";
import { Loading } from "element-ui";

export default {
  components: {
    upload,
    uploadVod
  },
  props: ["toNewAdvProps"],
  data() {
    return {
      visible: false, //视频上传预览需要
      inputTag: "",
      masterImgType: { limit: 1, multiple: false, type: 3, fileList: [] },
      detailList: {
        video: "", //上传得到的视频路径
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
        advertisImgVOS: [
          {
            content: "",
            advImg: "",
            uploadImgType: { limit: 1, multiple: false, type: 3, fileList: [] }
          }
        ],
        disList: [
          // {children: [],name: "",disId: "",isAll: "",disPid: "",actives: "请展开选择城市，否则删除该项"}
        ],
        //城市数据
        districtValidVOS: [],
        startissueTime: "5", //起始时间
        endissueTime: "2", //终止时间
        issueSingle: "", //每天发放数
        couponsUrl: "", //优惠卷链接
        storeType: "" //店铺类型  0-线上店铺   1-线下店铺
      },
      collaActiveName: 0,
      caseNum: "",
      citys: "", //从后台获取到得城市数据

      active: false,
      cityes: [],
      radioAge: 0,
      advLimits: { advertisRestrictVO: { minissueSingle: "", imgPrice: "" } },
      uploadSendImg: [],
      loading: false,
      isOnlineShop: false,
      startTime: [
        { value: "5", label: "5:00" },
        { value: "6", label: "6:00" },
        { value: "7", label: "7:00" },
        { value: "8", label: "8:00" },
        { value: "9", label: "9:00" },
        { value: "10", label: "10:00" },
        { value: "11", label: "11:00" },
        { value: "12", label: "12:00" },
        { value: "13", label: "13:00" },
        { value: "14", label: "14:00" },
        { value: "15", label: "15:00" },
        { value: "16", label: "16:00" },
        { value: "17", label: "17:00" },
        { value: "18", label: "18:00" },
        { value: "19", label: "19:00" },
        { value: "20", label: "20:00" },
        { value: "21", label: "21:00" },
        { value: "22", label: "22:00" },
        { value: "23", label: "23:00" },
        { value: "0", label: "0:00" },
        { value: "1", label: "1:00" },
        { value: "2", label: "2:00" }
      ],
      endTime: [
        { value: "6", label: "6:00" },
        { value: "7", label: "7:00" },
        { value: "8", label: "8:00" },
        { value: "9", label: "9:00" },
        { value: "10", label: "10:00" },
        { value: "11", label: "11:00" },
        { value: "12", label: "12:00" },
        { value: "13", label: "13:00" },
        { value: "14", label: "14:00" },
        { value: "15", label: "15:00" },
        { value: "16", label: "16:00" },
        { value: "17", label: "17:00" },
        { value: "18", label: "18:00" },
        { value: "19", label: "19:00" },
        { value: "20", label: "20:00" },
        { value: "21", label: "21:00" },
        { value: "22", label: "22:00" },
        { value: "23", label: "23:00" },
        { value: "0", label: "0:00" },
        { value: "1", label: "1:00" },
        { value: "2", label: "2:00" }
      ],
      advImgIndex: 0,
      isGetImg: false
    };
  },
  created() {
    // 获取城市

    let citys = JSON.parse(localStorage.getItem("citys"));
    this.citys = citys;

    //店铺列表，视频/图文时长，最低发布金额
    this.getAdvLimit();
  },
  computed: {
    isShowImgOrVidio() {
      if (this.toNewAdvProps.type != 2) {
        return !this.toNewAdvProps.type;
      } else {
        return this.toNewAdvProps.caogaoType == 2;
      }
    }
  },
  methods: {
    //视频上传得到URL
    getMyEvent(vid) {
      this.detailList.video = vid.url;

      console.log(vid);
      this.detailList.second = vid.duration;
      this.detailList.videoFrame = vid.firstImg;
    },

    //判断线上还是线下的店铺
    shopChange(val) {
      let shop = this.advLimits.storeVOS.find(item => item.storeId == val);
      if (shop.type == 0) {
        this.isOnlineShop = true;
      } else {
        this.isOnlineShop = false;
      }
    },
    //拿到封面图片地址
    getMasterImg(val) {
      this.detailList.masterImg = val[0];
      // console.log(this.detailList.masterImg);
    },
    //拿到广告图片地址
    getAdvImg(val) {
      this.detailList.advertisImgVOS[this.advImgIndex].advImg = val[0];
      this.advImgIndex++;
      this.isGetImg = true;
    },
    //删除内容段
    delContent(index) {
      this.detailList.advertisImgVOS.splice(index, 1);
    },
    //增加内容段
    addAds() {
      this.detailList.advertisImgVOS.push({
        content: "",
        advImg: "",
        uploadImgType: { limit: 1, multiple: false, type: 3, fileList: [] }
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

    /****
     * **************提交并发布**********************
     */
    saveAdv() {
      //判断 必填内容是否为空
      if (this.contentJudgment()) {
        //设置类型 类型 0-图文 2-图文草稿  1-视频 3-视频草稿
        this.detailList.type = this.toNewAdvProps.type;
        this.handleData();
      }
    },

    /****
     * **************存为草稿**********************
     */
    saveDraft() {
      //判断 必填内容是否为空
      if (this.contentJudgment()) {
        //设置类型 类型 0-图文 2-图文草稿  1-视频 3-视频草稿
        if (this.toNewAdvProps.type == 0) {
          this.detailList.type = 2;
        } else if (this.toNewAdvProps.type == 1) {
          this.detailList.type = 3;
        }
        this.handleData();
      }
    },

    /*********提交前处理梳理数据******/
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
        this.$refs.uploadMasterImg.submitUpload();
        this.detailList.advertisImgVOS.forEach((item, index) => {
          this.$refs.uploadAdvImg[index].submitUpload();
        });
      } else {
        //上传视频，拿地址
        this.$refs.childVod.authUpload();
      }
      //处理城市数据
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
      let advConLen = this.detailList.advertisImgVOS.length;
      let that = this;
      let timer = null;
      let time = 0;
      timer = setInterval(() => {
        time += 2;
        //设置类型 类型 0-图文 2-图文草稿  1-视频 3-视频草稿
        if (this.detailList.type == 0 || this.detailList.type == 2) {
          console.log("图片");
          if (
            that.detailList.advertisImgVOS[advConLen - 1].advImg &&
            that.detailList.masterImg
          ) {
            clearInterval(timer);
            timer = null;
            this.loading.close(); //关闭加载提示
            this.senDataToJava();
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

    //向后台发请求，把数据给后台
    senDataToJava() {
      releaseAdv(this.detailList).then(res => {
        console.log(this.detailList);
        if (res.data.code == "0000") {
          this.$message({
            message: "提交成功",
            type: "success"
          });
          this.loading.close(); //关闭加载提示
          //关闭窗口
          this.$emit("closeClick", this.toNewAdvProps.type);
        } else {
          this.$alert("", res.data.msg, {
            confirmButtonText: "确定",
            type: "warning",
            center: true
          })
            .then(() => {
              this.loading.close(); //关闭加载提示
            })
            .catch(() => {});
        }
      });
    },

    /***
     *      网络请求函数
     */
    //编辑广告  请求详情数据

    //店铺列表，视频/图文时长，最低发布金额
    getAdvLimit() {
      advLimit().then(res => {
        if (res.data.code == "0000") {
          this.advLimits = res.data.data;
          // console.log(this.advLimits);
          this.detailList.startissueTime = this.advLimits.advertisRestrictVO.startissueTime.toString();
          this.detailList.endissueTime = this.advLimits.advertisRestrictVO.endissueTime.toString();
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
  }
};
</script>

<style scoped>
.el-form-item >>> .el-radio__inne {
  background: #ffa800;
  border-color: #ffa800;
}
.el-form-item {
  margin-bottom: 25px;
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
  color: #ffa800;
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
  color: #333;
  font-size: 16px;
  background-color: #fff;
  border: 1px dashed #ffa800;
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
  border: 1px dashed #ffa800;
  color: #ffa800;
}
.cityBtns1 {
  width: 100px;
  height: 36px;
  border: 1px solid #ffa800;
  color: #ffa800;
  line-height: 10px;
  margin-right: 10px;
}
.cityBtns2 {
  width: 100px;
  height: 36px;
  line-height: 10px;
  color: #fff;
  background-color: #ffa800;
  border: none;
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
  right: -65px;
  font-size: 16px;
  color: #126ecb;
  border: none;
}
.explain {
  font-size: 12px;
  margin: 0 0 30px 100px;
  color: #ccc;
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
</style>
