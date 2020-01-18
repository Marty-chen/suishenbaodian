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
        :disabled="!deleStoreIdList.length"
        @click="allDele"
        style="background-color:#F7C927;color:#fff;"
      >批量删除</el-button>
      <el-button @click="showMoogolia" style="background-color:#FFA800;color:#fff;">+添加新店铺</el-button>
    </div>

    <el-table
      :data="tableData"
      border
      tooltip-effect="dark"
      style="width: 100%;text-align:center;"
      @selection-change="handleSelectionChange"
    >
      <el-table-column align="center" type="selection" width="60"></el-table-column>
      <el-table-column align="center" label="店铺头像">
        <template scope="scope">
          <div class="seleImg">
            <el-image style="width: 72px; height: 72px;" :src="scope.row.storeLogo" fit="cover" />
          </div>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="storeName" label="店铺名"></el-table-column>
      <el-table-column align="center" prop="createDate" label="创建时间"></el-table-column>
      <el-table-column align="center" fixed="right" label="操作" width="150">
        <template scope="scope">
          <img
            class="editBtn"
            @click="handleEdit(scope.$index, scope.row)"
            src="../assets/img/edit_icon.png"
            alt
          />
          <img
            @click="handleDelete(scope.$index, scope.row)"
            src="../assets/img/delete_icon.png"
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
      <newShop v-if="isNewOrEdit==0" :editStore="editStore" @closeClick="closeMongolia" slot="container"/>
      <editShop v-if="isNewOrEdit==1" :editStore="editStore" @closeClick="closeMongolia" slot="container"/>
    </Mongolia>
  </div>
</template>

<script>
import { storeList, storeDele } from "../network/shop.js";

import Mongolia from "../common/Mongolia";
import newShop from "../common/newShop";
import editShop from "../common/editShop";

export default {
  components: {
    Mongolia,
    newShop,
    editShop
  },
  data() {
    return {
      storeData: "",
      tabCtrl: ["线上店铺", "线下店铺"],
      currentIndex: 0,
      isShowMongolia: false,
      tableData: [],
      deleStoreIdList: [],
      deleIndex: [],
      editStore: '',
      isNewOrEdit: ''
    };
  },
  created() {
    this.getStoreList(0);
  },
  methods: {
    //切换TAB
    tabClick(index) {
      if(this.currentIndex != index) {
        this.currentIndex = index;
      this.getStoreList(index);
      }
    },
    //添加新店铺
    showMoogolia() {
      this.editStore = {
        type: this.currentIndex,
      }
      this.isNewOrEdit = 0;
      this.isShowMongolia = true;
    },
    //编辑
    handleEdit(index,storeInfo) {
      this.editStore = {
        type: this.currentIndex,
        storeId: storeInfo.storeId,
      }
      this.isNewOrEdit = 1;
      this.isShowMongolia = true;

    },
    //点击删除单个
    handleDelete(index, shop) {
      this.$confirm("此操作将永久删除该数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        center: true
      })
        .then(() => {
          let storeId = [shop.storeId];
          //后台删除
          this.deleShop(storeId);
          //页面删除
          this.tableData.splice(index, 1);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    //批量删除
    allDele() {
      this.$confirm("此操作将永久删除该数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        center: true
      })
        .then(() => {
          //后台删除
          this.deleShop(this.deleStoreIdList);
          console.log(this.deleStoreIdList)
         
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    //多选，全选事件
    handleSelectionChange(val) {
      let deleStoreIdList = [];
      let deleIndex = [];
      val.forEach(item => {
        deleStoreIdList.push(item.storeId);
      });
      this.deleStoreIdList = deleStoreIdList;

      this.tableData.forEach((item, index) => {
        val.forEach(list => {
          if (item.storeId == list.storeId) {
            deleIndex.push(index);
          }
        });
      });
      this.deleIndex = deleIndex;
    },
    
    //关闭蒙层
    closeMongolia() {
      this.isShowMongolia = false;
      // 刷新数据
      this.getStoreList(0);
      // this.currentIndex = 0
      this.isNewOrEdit = '';
    },
    //点击翻页
    handleChangePage(val) {
      this.getStoreList(this.currentIndex, val);
    },
    /************网络请求函数**************/

    //获取店铺列表
    getStoreList(type, current) {
      let data = {
        type: type,
        size: 5,
        current: current
      };
      storeList(data).then(res => {
        this.storeData = res.data.data;
        this.tableData = res.data.data.records;
      });
    },
    //删除店铺
    deleShop(Ids) {
      storeDele(Ids).then(res => {
        if (res.data.code == "0000") {
           //页面同时删除
          this.deleIndex.forEach((item, index) => {
            if (index == 0) {
              this.tableData.splice(item, 1);
              return;
            }
            this.tableData.splice(item - index, 1);
          });

          this.$message({
            message: "删除成功！",
            type: "success"
          });
        } else {
          this.$message.error(res.data.msg);
        }
      });
    }
  },
  computed: {
    pageNum() {
      return Math.ceil(this.storeData.total / this.storeData.size) * 10;
    }
  }
};
</script>

<style scoped>
.wrap{
  min-width: 800px;
}
.el-table {
  font-size: 16px;
  color: #666;
  border-radius: 10px;
}
.el-table>>>thead {
  color: #333;
}
.el-table>>>th {
  font-weight: 400;
  font-size: 18px;
  background-color: #E6E6E6;
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
  color: #999;
}
.tabItem {
  display: inline-block;
  margin-right: 50px;
  padding: 0 30px 20px 0;
  box-sizing: border-box;
}
.tabCircle {
  margin-right: 10px;
  font-size: 14px;
  color: rgba(18, 110, 203, 0);
  vertical-align: middle;
}
.active .tabCircle {
  color: #FFA800;
}
.active {
  border-bottom: 3px solid #FFA800;
  color: #FFA800;
}
.seleImg {
  display: inline-block;
  width: 72px;
  height: 72px;
  border-radius: 8px;
  overflow: hidden;
  margin: auto 0;
}
.editBtn {
  width: 18px;
  height: 18px;
  margin-right: 30px;
}
.paging {
  text-align: center;
  margin-top: 90px;
}

</style>