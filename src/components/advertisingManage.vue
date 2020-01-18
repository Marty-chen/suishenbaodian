<template>
  <div class="wrap">
    <div class="tab">
      <div class="tabCtrl">
        <div
          @click="tabClick(index)"
          :class="{active:currentIndex==index}"
          class="tabItem"
          v-for="(item,index) in tabCtrl"
          :key="index"
        >
          <span class="tabCircle">●</span>
          {{item}}
        </div>
      </div>
    </div>

    <div style="margin-bottom: 30px;float:right;">
      <el-button
        @click="allDele"
        :disabled="!deleAdvIdList.length"
        style="background-color:#F7C927;color:#fff;"
      >批量删除</el-button>
      <el-button
        v-if="currentIndex!=2"
        @click="showMoogolia"
        style="background-color:#FFA800;color:#fff;"
      >+添加新广告</el-button>
    </div>

    <el-table
      :data="tableData"
      border
      tooltip-effect="dark"
      style="width: 100%;text-align:center;"
      @selection-change="handleSelectionChange"
    >
      <el-table-column align="center" type="selection" width="60"></el-table-column>
      <el-table-column align="center" label="视频/图片">
        <template scope="scope">
          <div v-if="scope.row.masterImg" class="seleImg">
            <el-image style="width: 60px; height: 60px;" :src="scope.row.masterImg" fit="cover" />
            <div v-if="scope.row.putaway==0" class="off">
              <div>已下架</div>
            </div>
          </div>
          <div v-if="scope.row.videoFrame" class="seleImg">
            <el-image style="width: 60px; height: 60px;" fit="cover" :src="scope.row.videoFrame" />
            <div v-if="scope.row.putaway==0" class="off">
              <div>已下架</div>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="title" label="广告标题"></el-table-column>
      <el-table-column align="center" prop="watchNum" label="浏览数"></el-table-column>
      <el-table-column align="center" prop="collectNum" label="收藏数"></el-table-column>
      <el-table-column align="center" prop="shareNum" label="分享数"></el-table-column>
      <el-table-column align="center" prop="createDate" label="创建时间" width="200"></el-table-column>
      <el-table-column align="center" fixed="right" label="操作" width="230">
        <template scope="scope">
          <div class="ctrlImg">
            <el-tooltip content="上架广告" placement="bottom" effect="light">
              <img
                v-if="currentIndex != 2 && scope.row.putaway==0"
                @click="handleUpload(scope.$index, scope.row)"
                src="../assets/img/upload_icon.png"
                alt
              />
            </el-tooltip>
            <el-tooltip content="编辑广告" placement="bottom" effect="light">
              <img
              v-if="scope.row.putaway==0"
              @click="handleEdit(scope.$index, scope.row)"
              src="../assets/img/edit_icon.png"
              alt
            />
            </el-tooltip>
            <el-tooltip content="删除广告" placement="bottom" effect="light">
              <img
              v-if="scope.row.putaway==0"
              @click="handleDelete(scope.$index, scope.row)"
              src="../assets/img/delete_icon.png"
              alt
            />
            </el-tooltip>
            <el-tooltip content="查看广告" placement="bottom" effect="light">
              <img
              v-if="currentIndex != 2"
              @click="handleDetails(scope.$index, scope.row)"
              src="../assets/img/see.png"
              alt
            />
            </el-tooltip>

            
            
            
          </div>
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
      <newAdvertising
        v-if="isShowDetails==0"
        @closeClick="closeMongolia"
        slot="container"
        :toNewAdvProps="toNewAdvProps"
      />
      <editAdv
        v-if="isShowDetails==1"
        @closeClick="closeMongolia"
        slot="container"
        :toNewAdvProps="toNewAdvProps"
      />
      <seeAdvDetails v-if="isShowDetails==2" :toDetailsId="toDetailsId" slot="container" />
    </Mongolia>
  </div>
</template>

<script>
import { advList, deleAdv, putawayAdv } from "../network/adv.js";

import Mongolia from "../common/Mongolia";
import newAdvertising from "../common/newAdvertising";
import editAdv from "../common/editAdv";

import seeAdvDetails from "../common/seeAdvDetails";
import { getCitys } from "../network/common.js";

export default {
  components: {
    Mongolia,
    newAdvertising,
    editAdv,
    seeAdvDetails
  },
  data() {
    return {
      tabCtrl: ["图文发布", "短视频发布", "草稿箱"],
      currentIndex: 0,
      isShowMongolia: false,
      isShowDetails: "",
      advList: "",
      tableData: [],
      deleIndex: [],
      deleAdvIdList: [],
      loading: false,
      isAllAllowDele: "",
      toDetailsId: "",
      toNewAdvProps: {
        advId: "",
        type: "",
        isNewOrEdit: ""
      }
    };
  },
  methods: {
    tabClick(index) {
      if (this.currentIndex != index) {
        this.loading = true;
        this.currentIndex = index;
        this.getAdvList();
      }
    },

    //多选，全选事件
    handleSelectionChange(val) {
      let deleAdvIdList = [];
      let deleIndex = [];
      //遍历得到要删除的列表
      val.forEach(item => {
        deleAdvIdList.push(item.advId);
      });
      this.deleAdvIdList = deleAdvIdList;

      this.tableData.forEach((item, index) => {
        val.forEach(list => {
          if (item.advId == list.advId) {
            deleIndex.push(index);
          }
        });
      });
      this.deleIndex = deleIndex;
      //判断选中的是否全部可以删除
      this.isAllAllowDele = val.every(item => item.putaway == 0);
    },

    //上架
    handleUpload(index, row) {
      this.handlePutawayAdv(row.advId, index);
    },
    //编辑
    handleEdit(index, row) {
      // console.log(row);
      this.isShowDetails = 1;

      this.toNewAdvProps = {
        advId: row.advId,
        type: this.currentIndex,
        isNewOrEdit: 1,
        caogaoType: row.type
      };
      this.isShowMongolia = true;
    },
    //查看详情
    handleDetails(index, row) {
      // console.log(index);
      this.isShowDetails = 2;
      this.isShowMongolia = true;
      this.toDetailsId = row.advId;
    },
    //添加新广告
    showMoogolia() {
      this.isShowDetails = 0;
      this.toNewAdvProps = {
        advId: "",
        type: this.currentIndex,
        isNewOrEdit: 0
      };
      this.isShowMongolia = true;
    },
    //关闭蒙层
    closeMongolia() {
      this.isShowMongolia = false;
      this.isShowDetails = "";
      this.getAdvList();
    },
    //删除当前单个
    handleDelete(index, row) {
      console.log(index, row);
      let idList = [];
      idList.push(row.advId);
      this.deleAdvIdList = idList;
      this.$confirm("此操作将永久删除该数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        center: true
      })
        .then(() => {
          //后台删除
          this.handleDeleAdv(this.deleAdvIdList, index);
        })
        .catch(() => {});
    },

    //批量删除
    allDele() {
      if (!this.isAllAllowDele) {
        this.$notify.error({
          title: "错误",
          message: "只能删除已下架的广告，请重新选择"
        });
        return;
      }

      this.$confirm("此操作将永久删除该数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        center: true
      })
        .then(() => {
          //后台删除
          this.handleDeleAdv(this.deleAdvIdList);
        })
        .catch(() => {});
    },

    //点击翻页
    handleChangePage(val) {
      this.getAdvList(val);
    },
    /**************网络请求函数************* */
    //请求广告列表
    getAdvList(current = 1) {
      let data = {
        size: 5,
        current: current,
        type: this.currentIndex
      };
      advList(data).then(res => {
        // console.log(res);
        if (res.data.code == "0000") {
          this.loading = false;
          this.tableData = res.data.data.records;
          this.advList = res.data.data;
        } else {
          this.$message.error(res.data.msg);
          this.loading = false;
        }
      });
    },
    //请求删除广告
    handleDeleAdv(data, index) {
      deleAdv(data).then(res => {
        // console.log(res);
        if (res.data.code == "0000") {
          //页面同时删除多个
          this.deleIndex.forEach((item, index) => {
            if (index == 0) {
              this.tableData.splice(item, 1);
              return;
            }
            this.tableData.splice(item - index, 1);
          });
          //页面实时删除单个
          this.tableData.splice(index, 1);

          this.$message({
            message: "删除成功！",
            type: "success"
          });
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },

    //请求上架
    handlePutawayAdv(data, changeIndex) {
      console.log(data);
      putawayAdv(data).then(res => {
        // console.log(res)
        if (res.data.code == "0000") {
          this.$message({
            message: "上架成功！",
            type: "success"
          });
          //实时改变页面
          this.tableData[changeIndex].putaway = 1;
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },

    //获取城市列表信息
    handleGetCitys() {
      getCitys().then(res => {
        if (res.data.code == "0000") {
          localStorage.setItem("citys", JSON.stringify(res.data.data));

          // console.log(citys);
        } else {
          this.$message.error(res.data.msg);
        }
      });
    }
  },
  created() {
    this.getAdvList();
    //获取城市信息
    let citys = JSON.parse(localStorage.getItem("citys"));
    if (!citys) {
      this.handleGetCitys();
    }
  },
  computed: {
    pageNum() {
      return Math.ceil(this.advList.total / this.advList.size) * 10;
    }
  }
};
</script>

<style scoped>
.wrap {
  min-width: 900px;
}
.el-table {
  font-size: 18px;
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
.tab {
  width: 100%;
  border-bottom: 1px solid #e0e0e0;
  font-size: 22px;
  color: #333;
  margin-bottom: 50px;
}
.tabCtrl {
  min-width: 700px;
}
.tabItem {
  display: inline-block;
  margin-right: 50px;
  padding: 0 30px 20px 0;
  box-sizing: border-box;
  color: #999;
}
.tabCircle {
  margin-right: 10px;
  font-size: 14px;
  color: rgba(0,0,0,0);
  vertical-align: middle;
}
.active .tabCircle {
  color: #ffa800;
}
.active {
  border-bottom: 3px solid #ffa800;
  color: #ffa800;
}
.seleImg {
  display: inline-block;
  width: 60px;
  height: 60px;
  border-radius: 8px;
  overflow: hidden;
  position: relative;
}
.off {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  color: #fff;
  font-size: 12px;
  text-align: center;
  background-color: rgba(51, 51, 51, 0.6);
}
.off {
  line-height: 60px;
}
.seleImg img {
  width: 100%;
  height: 100%;
}
.ctrlImg {
  text-align: center;
}
.ctrlImg img {
  margin: 0 10px;
}
.paging {
  text-align: center;
  margin-top: 30px;
}
</style>