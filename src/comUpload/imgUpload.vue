<template>
  <div class="wraper">
    
    <el-upload
      action
      ref="uploadNow"
      :auto-upload="false"
      :http-request="Upload"
      :before-upload="beforeAvatarUpload"
      :on-preview="handlePictureCardPreview"
      :before-remove="beforeRemove"
      :on-remove="handleRemove"
      :on-change="handleChange"
      :on-exceed="handleExceed"
      :on-erro="handleUploadErro"
      list-type="picture-card"
      :limit="initType.limit"
      :multiple="initType.multiple"
      :file-list="initType.fileList"
      class="upload"
    >
      <div class="uploaad-icon">
        <div class="upload-icon-img">
          <img style="width:100%;" src="../assets/img/camera.png" alt />
        </div>
        <div style="fontSize:14px;color:#999;">上传</div>
      </div>
    </el-upload>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt />
    </el-dialog>
    
  </div>
</template>

<script>
import { client, getFileNameUUID } from "../util/oss"; //前面的ali-js文件内的两个封装函数
import { STS } from "../network/common"; //请求后台的接口拿Ali-OSS数据
export default {
  name: "Upload",
  props: {
    initType: {
      type: Object,
      default() {
        return { limit: 1, multiple: false, type: 2, fileList: [] };
      }
    }
  },
  data() {
    return {
      fileList: [], //文件列
      dataObj: {}, //存签名信息
      dialogVisible: false,
      dialogImageUrl: "",
      imgList: [],
      loading: false
    };
  },
  methods: {
    //手动点击上传
    submitUpload() {
      this.$refs.uploadNow.submit();

    },
    // 上传失败
    handleUploadErro(err, file, fileList) {
      this.$message.warning(err);
    },
    // 文件超出个数限制时的钩子
    handleExceed(files, fileList) {
      this.$message.warning(`最多只能上传 ${this.initType.limit} 个文件`);
    },
    // 点击文件列表中已上传的文件时的钩子
    handlePreview(file) {},
    // 删除文件之前的钩子
    beforeRemove(file, fileList) {
      // console.log(file)

      return this.$confirm(`确定移除 ${file.name}？`);
    },
    // 文件列表移除文件时的钩子
    handleRemove(file, fileList) {
      // console.log('删除')
      this.$emit('imgLength',this.fileList.length,fileList,'删除')
    },
    // 文件变化时的钩子
    handleChange(file, fileList) {
      this.fileList = fileList;
      // console.log('变化')
      this.$emit('imgLength',this.fileList.length,fileList,'变化')
    },
    //文件上传前的校验
    beforeAvatarUpload(file) {
      const isLt100M =
        file.size / 1024 / 1024 > 10 && file.size / 1024 / 1024 < 1024;
      const isLt30 = file.name.length < 30;
      // if (["video/mp4"].indexOf(file.type) == -1) {
      //   this.$message.error("请上传正确的视频格式");
      //   return false;
      // }
      // if (!isLt100M) {
      //   this.$message.error("上传视频大小要在10MB~1GB之间哦!");
      //   return false;
      // }
      // if (!isLt30) {
      //   this.$message.error("上传视频文件名称长度必须要小于30个文字哦!");
      //   return false;
      // }
      // 请求后台接口拿配置参数
      return new Promise((resolve, reject) => {
        let data1 = { type: this.initType.type };
        STS(data1)
          .then(response => {
            this.dataObj = response.data.data; //接口返回配置参数
            // console.log(response.data.data);
            resolve(true);
          })
          .catch(err => {
            console.log(err);
            reject(false);
          });
      });
    },
    // http-request属性来覆盖默认的上传行为（即action="url"），自定义上传的实现
    Upload(file) {
      const that = this;
      async function multipartUpload() {
        let temporary = file.file.name.lastIndexOf(".");
        let fileNameLength = file.file.name.length;
        let fileFormat = file.file.name.substring(
          temporary + 1,
          fileNameLength
        );
        let fileName = getFileNameUUID() + "." + fileFormat;
        client(that.dataObj)
          .multipartUpload(`${that.dataObj.url}${fileName}`, file.file, {})
          .then(result => {
            //上传成功返回值，可针对项目需求写其他逻辑
            that.loading = false;

            // console.log(result);
            that.imgList.push(result.name);

            if (that.fileList.length == that.imgList.length) {
              that.$emit("sendImgUrl", that.imgList);
            }
          })
          .catch(err => {
            console.log("err:", err);
          });
      }
      multipartUpload();
    },

    //放大预览图片
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
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
  top: 0px;
  left: 0;
  margin-top: -19px;
  height: 60px;
  background-color: #fff;
  border-bottom: 1px solid #e6e6e6;
  z-index: 9;
}
.wraper .title h1 {
  text-align: center;
  padding-top: 15px;
  font-size: 24px;
  font-weight: 400;
  color: #333;
}

.upload >>> .el-upload--picture-card {
  width: 88px;
  height: 88px;
  line-height: 0px;
  border: 1px solid #ccc;
}
.upload >>> .el-upload-list__item {
  width: 88px;
  height: 88px;
}
.upload-icon-img {
  width: 38px;
  height: 38px;
  margin: 13px auto;
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
  color: #126ecb;
  font-size: 28px;
  padding-right: 20px;
}
.residueNumber {
  color: #ccc;
  font-size: 16px;
  position: absolute;
  bottom: 0px;
  right: 100px;
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
.addShopBtn {
  margin-top: 30px;
  background-color: #e6e6e6;
  color: #126ecb;
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
  right: -100px;
  font-size: 16px;
  color: #126ecb;
  border: none;
}
.explain {
  font-size: 12px;
  margin: 0 0 30px 100px;
  color: red;
}
</style>
