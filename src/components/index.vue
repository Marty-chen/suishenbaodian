<template>
  <div class="firstPage">
    <el-row :gutter="30">
      <el-col :span="8">
        <div class="item">
          <div class="words">
            <div class="title">图文发布</div>
            <span class="num">{{homeData.imgSum}}条</span>
          </div>
          <img src="../assets/img/tuwen.png" alt />
        </div>
      </el-col>
      <el-col :span="8">
        <div class="item">
          <div class="words">
            <div class="title">短视频发布</div>
            <span class="num">{{homeData.videoSum}}条</span>
          </div>
          <img src="../assets/img/shiping.png" alt />
        </div>
      </el-col>
      <el-col :span="8">
        <div class="item">
          <div class="words">
            <div class="title">草稿箱</div>
            <span class="num">{{homeData.draftSum}}条</span>
          </div>
          <img src="../assets/img/caogao.png" alt />
        </div>
      </el-col>
    </el-row>

    <el-row style="margin-top:80px" :gutter="30">
      <el-col :span="12">
        <div>
          <div style="color:#FFA800;font-size:22px;letterSpacing:3px;display:inline-block">我的店铺</div>
          <span @click="goToMore('/store/list')" class="chectMore">查看更多  &gt;</span>
          
        </div>
        <div class="myShop">
          <el-table :data="homeData.storeVOS">
            <el-table-column align="left" label=" 店铺名" width>
              <template slot-scope="scope">
                <span>{{scope.row.storeName}}</span>
                <div v-if="scope.row.type==0" class="green">线下</div>
                <div v-if="scope.row.type==1" class="purple">线上</div>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="createDate" fixed="right" label="创建时间"></el-table-column>
          </el-table>
        </div>
      </el-col>
      <el-col :span="12">
        <div>
          <div style="color:#FFA800;font-size:22px;letterSpacing:3px;display:inline-block">我的商品</div>
          <span @click="goToMore('/gds/list')" class="chectMore">查看更多 &gt;</span>
          
        </div>
        <div class="myShop">
          <el-table :data="homeData.goodsVOS">
            <el-table-column align="left" prop="title" label=" 商品名" width>
            </el-table-column>
            <el-table-column align="center" prop="createDate" fixed="right" label="创建时间"></el-table-column>
          </el-table>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getHomeData } from "../network/home.js";

export default {
  data() {
    return {
      homeData: "",
     
    };
  },
  created() {
    getHomeData().then(res => {
      // console.log(res)
      if(res.data.code=='0000') {
         this.homeData = res.data.data;
        
        }else{
          this.$message.error(res.data.msg);
        }
    });
  },
  methods: {
    goToMore(path) {
      this.$router.push({
        path: path
      })
    }
  }
};
</script>

<style scoped>
.firstPage {
  min-width: 1000px;
}
.el-table {
  font-size: 18px;
  color: #666;
  border-radius: 8px;
}
.el-table>>>th {
  font-weight: 400;
  font-size: 20px;
  /* background-color: #E6E6E6; */
  color: #333;
}
.tab {
  width: 100%;
  border-bottom: 1px solid #e0e0e0;
  font-size: 22px;
  /* color: #666; */
  margin-bottom: 50px;
}
.green {
  width: 44px;
  height: 20px;
  display: inline-block;
  margin-left: 15px;
  background-color: #cce3d7;
  color: #0c9a4e;
  text-align: center;
  font-size: 12px;
  border-radius: 4px;
}
.purple {
  width: 44px;
  height: 20px;
  display: inline-block;
  margin-left: 15px;
  background-color: #F7EBB2;
  color: #CAA600;
  text-align: center;
  font-size: 12px;
  border-radius: 4px;
}
.item {
  min-width: 320px;
  height: 200px;
  background-color: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 60px;
  box-sizing: border-box;
  border-radius: 8px;
}
.words {
  min-width: 150px;
  font-size: 24px;
}
.words .title {
  margin-bottom: 20px;
  color: #333;
}
.words .num {
  font-size: 20px;
  color: #666;
}
/* .item img {
   width: 100px;
  height: 100px; 
}  */
.myShop {
  margin-top: 20px;
  height: 440px;
  background-color: #fff;
  border-radius: 8px;
  border: 1px solid rgba(230, 230, 230, 1);
}
.chectMore {
   color:#666;
   font-size:16px;
   float:right;
   white-space:pre;
   cursor: pointer;
}
</style>