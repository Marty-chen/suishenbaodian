<template>
  <div class="wraper">
    <div class="title">
      <h1>填写物流信息</h1>
    </div>
    <div class="from">
      <el-form required label-position="right" label-width="120px">
        <div class="fromTitle">
          <span>物流信息</span>
        </div>
        <div class="content">
          <el-form-item required label="物流单号">
            <el-input style="width:400px;" placeholder="请输入物流单号" v-model="logisticsNum" />
          </el-form-item>

          <el-form-item label="物流公司">
            <el-input style="width:400px;" placeholder="请输入物流公司名称" v-model="company" />
          </el-form-item>
        </div>

        <div style="marginTop:200px;"></div>
      </el-form>
    </div>
    <div class="footer">
      <div class="btns">
        <el-button @click="btnClick" :loading="loading" :disabled="!logisticsNum" class="leftBtn" type="primary">确定并发货</el-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      logisticsNum: "",
      company: "",
      loading: false
    };
  },
  methods: {
    btnClick() {
      this.loading = true;
        // this.$emit('closeClick','')

    }
  }
};
</script>

<style scoped>
.wraper {
  width: 100%;
  position: relative;
}
.wraper .title h1 {
  text-align: center;
  padding-top: 30px;
  font-size: 24px;
  font-weight: 400;
  color: #333;
}

.wraper .from {
  width: 800px;
  border: 1px solid #e6e6e6;
  margin: 25px auto 0 auto;
  padding: 0 40px;
  font-size: 18px;
  box-sizing: border-box;
}

.fromTitle {
  font-size: 22px;
  color: #333;
  margin: 30px 0;
}
.content {
  width: 600px;
  margin: 0 auto;
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
</style>