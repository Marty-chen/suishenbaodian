<template>
  <div class="wraper">
    <div class="title">
      <h1>广告详情</h1>
    </div>
    <div class="from">
      <el-form label-position="right" label-width="120px">
        <div class="fromList">
          <div class="fromTitle">
            <span class="blueNum">1</span>
            <span>广告基本信息</span>
          </div>
          <el-form-item label="广告标题">
            <div class="containei">{{detailList.title}}</div>
          </el-form-item>

          <div v-if="detailList.type==0">
            <el-form-item label="封面图">
              <div class="masterImg">
                <el-image
                  style="width: 88px; height: 88px; border-radius: 3px; vertical-align: middle;"
                  :src="detailList.ossUrl+detailList.masterImg"
                  :preview-src-list="srcList1"
                  fit="cover"
                />
              </div>
            </el-form-item>

            <el-form-item
              class="contenWrap"
              :label="'内容段' + (index+1)"
              v-for="(item,index) in detailList.advertisImgVOS"
              :key="index"
            >
              <div class="masterImg">
                <el-image
                  style="width:100%; vertical-align: middle;"
                  :src="detailList.ossUrl+item.advImg"
                  :preview-src-list="srcList2"
                  fit="cover"
                />
              </div>
              <div class="content">{{item.content}}</div>
            </el-form-item>
          </div>

          <div v-else>
            <el-form-item label="视频">
              <div class="masterImg">
                <div class="prewVideo">
                  <img
                  style="width:100%; vertical-align: middle;"
                  :src="videoImg"
                  fit="cover"
                />
                  <div @click="dialogVisible=true" class="playImg">
                    <img src="../assets/img/ss_icon_pause@2x.png" alt />
                  </div>
                </div>
                <el-dialog
                  :visible.sync="dialogVisible"
                  :modal="false"
                  :before-close="handleClose"
                  class="dialog"
                >
                  <video :src="detailList.videoUrl+detailList.video" autoplay muted controls loop></video>
                </el-dialog>
              </div>
            </el-form-item>
          </div>
        </div>

        <div class="fromList">
          <div class="fromTitle">
            <span class="blueNum">2</span>
            <span>广告标签</span>
          </div>
          <el-form-item label="广告标签">
            <div class="font18">{{ detailList.tag }}</div>
          </el-form-item>
        </div>

        <div class="fromList">
          <div class="fromTitle">
            <span class="blueNum">3</span>
            <span>发布条件</span>
          </div>
          <el-form-item label="年龄段">
            <div class="font18" v-if="detailList.minAge">
              <span>{{ detailList.minAge }}</span> --
              <span>{{ detailList.maxAge }}</span>
              岁
            </div>
            <div v-else class="font18">不限</div>
          </el-form-item>

          <el-form-item label="性别">
            <div class="font18">{{detailList.setSex?detailList.setSex:"不限"}}</div>
          </el-form-item>

          <el-form-item label="地域">
            <div class="font18" v-if="detailList.disList[0]">
              <div
                v-for="(item,index) in detailList.disList"
                :key="index"
                style="margin-bottom: 15px;"
              >
                <div class="addre1">
                  地域{{index+1}}：
                  <span>{{item.name}}</span>——
                </div>
                <div class="addre2">
                  <span
                    style="marginRight:8px;"
                    v-for="list in item.children"
                    :key="list.disId"
                  >{{list.name}}</span>
                </div>
              </div>
            </div>
            <div v-else class="font18">不限</div>
          </el-form-item>
          <el-form-item label="发放时段">
            <div class="font18">{{detailList.startissueTime}}:00~{{detailList.endissueTime}}:00</div>
          </el-form-item>
          <el-form-item label="发放红包">
            <div class="font18">{{detailList.issueSingle}}个/天</div>
          </el-form-item>
        </div>

        <div class="fromList">
          <div class="fromTitle">
            <span class="blueNum">4</span>
            <span>店铺</span>
          </div>
          <el-form-item label="店铺">
            <div class="font18">{{detailList.storeName}} {{detailList.storeType==0? '(线上)':'(线下)'}}</div>
          </el-form-item>
          <el-form-item label="商城链接" v-if="detailList.storeType==0">
            <div class="font18">{{detailList.url}}</div>
          </el-form-item>
          <el-form-item label="优惠劵链接" v-if="detailList.storeType==0">
            <div class="font18">{{detailList.couponsUrl}}</div>
          </el-form-item>
        </div>

        <div class="fromList" style="border:none;">
          <div class="fromTitle">
            <span class="blueNum">5</span>
            <span>投放红包总数</span>
          </div>
          <el-form-item label="投放红包">
            <div class="font18">{{detailList.totalPrice}}个</div>
          </el-form-item>
          <div style="margin-bottom:100px;"></div>
        </div>
      </el-form>
    </div>
    <div style="margin-bottom:100px;"></div>
  </div>
</template>

<script>
import { advDetail } from "../network/adv.js";

export default {
  data() {
    return {
      detailList: { disList: [] },
      contentList: [],
      srcList2: [],
      srcList1: [],
      dialogVisible: false
    };
  },
  props: ["toDetailsId"],
  created() {
    if (this.toDetailsId) {
      let id = { advId: this.toDetailsId };
      this.getAdvDetail(id);
    }
  },
  methods: {
    //关闭视频预览
    handleClose(done) {
      done();
    },
    getAdvDetail(data) {
      advDetail(data).then(res => {
        if (res.data.code == "0000") {
          this.detailList = res.data.data;
          // console.log(this.detailList);
          let list = res.data.data;
          this.srcList1.push(list.ossUrl + list.masterImg);
          list.advertisImgVOS.forEach(item => {
            this.srcList2.push(list.ossUrl + item.advImg);
          });
        } else {
          this.$message.error(res.data.msg);
        }
      });
    }
  },
  computed: {
    setSex() {
      if (this.detailList.sex === 1) {
        return "男";
      } else {
        if (this.detailList.sex === 0) {
          return "女";
        } else {
          return " ";
        }
      }
    },
    videoImg() {
      return this.detailList.ossUrl+this.detailList.videoFrame
    }
  }
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
.fromList:last-child {
  border: none;
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
.masterImg {
  width: 88px;
  height: 88px;
  border-radius: 4px;
  overflow: hidden;

  margin: 0px 20px 0 20px;
  display: inline-block;
}
.masterImg img {
  width: 100%;
}

.content {
  display: inline-block;
  width: 550px;
  line-height: 20px;
  color: #333;
  font-size: 16px;
  vertical-align: top;
  line-height: 30px;
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
.dialog {
  text-align: center;
}
.prewVideo {
  width: 88px;
  height: 88px;
  overflow: hidden;
  border-radius: 6px;
  display: inline-block;
  position: relative;
  border: 1px solid #ccc;
}
.playImg {
  width: 88px;
  height: 88px;
  position: absolute;
  top: 0;
  left: 0;
  text-align: center;
  cursor: pointer;
}
.playImg img {
  width: 80%;
  margin-top: 8px;
}
.closeBtn {
  position: absolute;
  top: -1px;
  right: -1px;
  cursor: pointer;
}
</style>