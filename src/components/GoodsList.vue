<template>
  <div class="wrap">
    <div style="margin-top: 60px;"></div>
    <div style="margin-bottom: 30px;float:right;">
      <el-button
        :disabled="!deleGoodsList.length"
        @click="allDele"
        style="background-color:#F7C927;color:#fff;"
      >批量删除</el-button>
      <el-button @click="showMoogolia" style="background-color:#FFA800;color:#fff;">+添加新商品</el-button>
    </div>

    <el-table
      :data="tableData"
      border
      tooltip-effect="dark"
      style="width: 100%;text-align:center;"
      @selection-change="handleSelectionChange"
    >
      <el-table-column align="center" type="selection" width="60"></el-table-column>
      <el-table-column align="center" label="商品图">
        <template scope="scope">
          <img :src="scope.row.img1" class="seleImg" />
        </template>
      </el-table-column>
      <el-table-column align="center" prop="title" label="商品名称"></el-table-column>
      <el-table-column align="center" prop="gdsId" label="商品ID"></el-table-column>
      <el-table-column align="center" prop="price" label="价格（元）"></el-table-column>
      <el-table-column align="center" prop="createDate" label="创建时间"></el-table-column>
      <el-table-column align="center" fixed="right" label="操作" width="200">
        <template scope="scope">
          <img
            class="editBtn"
            @click="handleDetails(scope.$index, scope.row)"
            src="../assets/img/see.png"
            alt
          />
          <img
            class="editBtn"
            @click="handleEdit(scope.$index, scope.row)"
            src="../assets/img/edit_icon.png"
            alt
          />
          <img
          class="editBtn"
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
      <seeGoods v-if="showComp==3" slot="container" :goodsId="goodsId" />
      <newGoods v-if="showComp==1" slot="container" @closeMongolia="closeMongolia" />
      <editGoods v-if="showComp==2" slot="container" :goodsId="goodsId" @closeMongolia="closeMongolia"/>
    </Mongolia>
  </div>
</template>

<script>
import { goodsList,goodsDel } from "../network/goods.js";

import Mongolia from "../common/Mongolia";
import seeGoods from "../common/seeGoods";
import newGoods from "../common/newGoods";
import editGoods from "../common/editGoods";
export default {
  components: {
    Mongolia,
    seeGoods,
    newGoods,
    editGoods
  },
  data() {
    return {
      goodsData: "",
      isShowMongolia: false,
      showComp: "",
      tableData: [],
      deleGoodsList: [],
      deleIndex: [],
      goodsId: ""
    };
  },
  
  methods: {
    //查看详情
    handleDetails(index, row) {
      // console.log(row)
      this.showComp = 3;
      this.isShowMongolia = true;
      this.goodsId = { gdsId: row.gdsId };
    },
    //编辑
    handleEdit(index, row) {
      this.showComp = 2;
      this.isShowMongolia = true;
      this.goodsId = { gdsId: row.gdsId };
    },
    //点击删除单个
    handleDelete(index, row) {
      this.$confirm("此操作将永久删除该数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        center: true
      })
        .then(() => {
          let gdsId = [row.gdsId];
          //后台删除
          this.deleGoods(gdsId);
          //页面删除deleGoods
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
          this.deleGoods(this.deleGoodsList);
          // console.log(this.deleGoodsList);
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
      let deleGoodsList = [];
      let deleIndex = [];
      val.forEach(item => {
        deleGoodsList.push(item.gdsId);
      });
      this.deleGoodsList = deleGoodsList;

      this.tableData.forEach((item, index) => {
        val.forEach(list => {
          if (item.gdsId == list.gdsId) {
            deleIndex.push(index);
          }
        });
      });
      this.deleIndex = deleIndex;
    },
    //添加新商品
    showMoogolia() {
      this.showComp = 1;
      this.isShowMongolia = true;
    },
    //关闭蒙层
    closeMongolia() {
      this.isShowMongolia = false;
      this.goodsIdId = "";
      this.showComp = '';
      // 刷新数据
      this.getGoodsList();
    },
    //点击翻页
    handleChangePage(val) {
      this.getGoodsList(val);
    },
    /************网络请求函数**************/

    //获取店铺列表
    getGoodsList(current) {
      let data = {
        size: 5,
        current: current
      };
      goodsList(data).then(res => {

        if(res.data.code=='0000') {
          this.goodsData = res.data.data;
        // console.log(res)
        let records = [];
        res.data.data.records.forEach(item => {
          records.push({
            createDate: item.createDate,
            gdsId: item.gdsId,
            img1: item.img1,
            title: item.title,
            userId: item.userId,
            price: item.minPrice + "-" + item.maxPrice
          });
        });
        this.tableData = records;
        }else{
          this.$message.error(res.data.msg);
        }
      });
    },
    //删除店铺
    deleGoods(Ids) {
      goodsDel(Ids).then(res => {
        // console.log(res)
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
  created() {
    
    this.getGoodsList(1);
  },
  computed: {
    pageNum() {
      return Math.ceil(this.goodsData.total / this.goodsData.size) * 10;
    }
  }
};
</script>

<style scoped>
.el-table {
  font-size: 18px;
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
}
.tabItem {
  display: inline-block;
  margin-right: 50px;
  padding: 0 30px 20px 0;
  box-sizing: border-box;
  color:#999;
}
.tabCircle {
  margin-right: 10px;
  font-size: 14px;
  color: #999;
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
.editBtn {
  margin: 0 10px;
}
</style>