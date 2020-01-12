<template>
  <div class="container">
    <div class="upload">
      <div class="filebox" v-if="!videoFristImg">
        <input type="file" @change="fileChange($event)" class="filebtn" />
        <div class="flletit">
          <img src="../assets/img/upload_video_icon.png" alt />
          <p>上传视频</p>
        </div>
      </div>
      <!-- <div class="filetitle">{{fileTitle}}</div>
      
      <label class="status">
        上传状态:
        <span>{{statusText}}</span>
      </label>-->

      <!-- <div class="upload-type">
        <el-button
          slot="trigger"
          size="small"
          type="primary"
          @click="authUpload"
          :disabled="uploadDisabled"
        >开始上传</el-button>
      </div>-->
    </div>
    <div v-if="videoFristImg" class="prewVideo">
      <!-- <video width="88px" :src="videoLocalUrl"></video> -->
      <img :src="videoFristImg" alt />
      <!-- <img :src="blobUrl" alt=""> -->
      <div @click="dialogVisible=true" class="playImg">
        <img src="../assets/img/ss_icon_pause@2x.png" alt />
      </div>
      <div @click="deleVideo" class="closeBtn">
        <img src="../assets/img/delete_red_icon.png" alt />
      </div>
    </div>
    <el-dialog
      title
      :modal="false"
      :visible.sync="dialogVisible"
      :before-close="handleClose"
      class="dialog"
    >
      <video :src="videoLocalUrl" autoplay muted controls loop></video>
    </el-dialog>
  </div>
</template>
<script>
import { uploadVideo } from "../network/video.js";
import { client, getFileNameUUID } from "../util/oss"; //前面的ali-js文件内的两个封装函数
import { STS } from "../network/common"; //请求后台的接口拿Ali-OSS数据
export default {
  data() {
    return {
      dialogVisible: false,
      vid: "",
      fileTitle: "",
      timeout: "",
      partSize: "",
      parallel: "",
      retryCount: "",
      retryDuration: "",
      region: "cn-shanghai",
      userId: "1303984639806000",
      file: null,
      authProgress: 0,
      uploadDisabled: true,
      resumeDisabled: true,
      pauseDisabled: true,
      uploader: null,
      statusText: "",
      videoLocalUrl: "",
      videoUrl: "",
      duration: 0, //视频时长
      // videoFristImg: "", //视频第一帧
      blobUrl: ""
    };
  },
  props:{
    videoFristImg: {
      type: String
    }
  },
  methods: {
    //关闭视频预览
    handleClose(done) {
      done();
    },
    //删除选中的视频
    deleVideo() {
      this.videoLocalUrl = "";
    },
    emitEventVod() {
      this.authProgress = 0;
      this.fileTitle = "";
      this.statusText = "";
      this.pauseDisabled = true;
      this.resumeDisabled = true;
      this.uploadDisabled = true;
    },
    fileChange(e) {
      this.file = e.target.files[0];
      //以下调用方法顺序不能变
      /********** 拿视频的本地链接************/
      this.getVideoLocalUrl();
      /*********** 拿视频的第一帧图片************/
      this.getVideoFristImg();
      /*********** 获取视频或者音频时长************/
      this.getDuration();

      /***************************************************************** */
      if (!this.file) {
        this.$message.error("请先选择需要上传的文件!");
        return;
      }
      if (this.file.type !== "video/mp4") {
        this.$message.error("请选择.mp4文件!");
        return;
      }
      this.fileTitle = this.file.name;
      var userData = '{"Vod":{}}';
      if (this.uploader) {
        this.uploader.stopUpload();
        this.authProgress = 0;
        this.statusText = "";
      }
      this.uploader = this.createUploader();
      // console.log(userData);
      this.uploader.addFile(this.file, null, null, null, userData);
      this.uploadDisabled = false;
      this.pauseDisabled = true;
      this.resumeDisabled = true;
    },
    /***************************开始上传************************************** */
    authUpload() {
      // 然后调用 startUpload 方法, 开始上传
      if (this.uploader !== null) {
        this.uploader.startUpload();
        this.uploadDisabled = true;
        this.pauseDisabled = false;
      }
    },
    /******************************暂停上传*********************************** */
    //
    pauseUpload() {
      if (this.uploader !== null) {
        this.uploader.stopUpload();
        this.resumeDisabled = false;
        this.pauseDisabled = true;
      }
    },
    /******************************恢复上传*********************************** */
    resumeUpload() {
      if (this.uploader !== null) {
        this.uploader.startUpload();
        this.resumeDisabled = true;
        this.pauseDisabled = false;
      }
    },
    createUploader(type) {
      let self = this;
      // eslint-disable-next-line
      let uploader = new AliyunUpload.Vod({
        timeout: self.timeout || 60000,
        partSize: self.partSize || 1048576,
        parallel: self.parallel || 5,
        retryCount: self.retryCount || 3,
        retryDuration: self.retryDuration || 2,
        region: self.region,
        userId: self.userId,
        // 添加文件成功
        addFileSuccess: function(uploadInfo) {
          self.uploadDisabled = false;
          self.resumeDisabled = false;
          self.statusText = "添加文件成功, 等待上传...";
          // console.log("addFileSuccess: " + uploadInfo.file.name);
        },
        // 开始上传
        onUploadstarted: function(uploadInfo) {
          // 如果是 UploadAuth 上传方式, 需要调用 uploader.setUploadAuthAndAddress 方法
          // 如果是 UploadAuth 上传方式, 需要根据 uploadInfo.videoId是否有值，调用点播的不同接口获取uploadauth和uploadAddress
          // 如果 uploadInfo.videoId 有值，调用刷新视频上传凭证接口，否则调用创建视频上传凭证接口
          // 注意: 这里是测试 demo 所以直接调用了获取 UploadAuth 的测试接口, 用户在使用时需要判断 uploadInfo.videoId 存在与否从而调用 openApi
          // 如果 uploadInfo.videoId 存在, 调用 刷新视频上传凭证接口(https://help.aliyun.com/document_detail/55408.html)
          // 如果 uploadInfo.videoId 不存在,调用 获取视频上传地址和凭证接口(https://help.aliyun.com/document_detail/55407.html)
          if (!uploadInfo.videoId) {
            let title = uploadInfo.file.name.substr(
              0,
              uploadInfo.file.name.lastIndexOf(".")
            );
            let vidioData = { fileName: uploadInfo.file.name };
            uploadVideo(vidioData).then(res => {
              console.log(res);
              if (res.data.code != "0000") {
                return self.$message.error(res.data.msg);
              }
              let uploadAuth = res.data.data.uploadAuth;
              let uploadAddress = res.data.data.uploadAddress;
              let videoId = res.data.data.videoId;
              self.vid = res.data.data.VideoId;
              uploader.setUploadAuthAndAddress(
                uploadInfo,
                uploadAuth,
                uploadAddress,
                videoId
              );
            });

            self.statusText = "文件开始上传...";
          } else {
            // 如果videoId有值，根据videoId刷新上传凭证
            let vidioData = { fileName: uploadInfo.file.name };
            uploadVideo(vidioData).then(res => {
              // console.log(res);
              if (res.data.code != "0000") {
                return self.$message.error(res.data.msg);
              }
              let uploadAuth = res.data.data.uploadAuth;
              let uploadAddress = res.data.data.uploadAddress;
              let videoId = res.data.data.videoId;
              self.vid = res.data.data.VideoId;
              uploader.setUploadAuthAndAddress(
                uploadInfo,
                uploadAuth,
                uploadAddress,
                videoId
              );
            });
          }
        },
        // 文件上传成功
        onUploadSucceed: function(uploadInfo) {
          self.statusText = "文件上传成功!";
          this.videoUrl = uploadInfo.object;

          this.uploadFristImg() ;//执行上传第一帧图片
          console.log(uploadInfo);
          // this.videoLocalUrl = uploadInfo.bucket + uploadInfo.endpoint.replace(/https:\/\//,'.') + uploadInfo.object
        },
        // 文件上传失败
        onUploadFailed: function(uploadInfo, code, message) {
          console.log(
            "onUploadFailed: file:" +
              uploadInfo.file.name +
              ",code:" +
              code +
              ", message:" +
              message
          );
          self.statusText = "文件上传失败!";
        },
        // 取消文件上传
        onUploadCanceled: function(uploadInfo, code, message) {
          console.log(
            "Canceled file: " +
              uploadInfo.file.name +
              ", code: " +
              code +
              ", message:" +
              message
          );
          self.statusText = "文件已暂停上传";
        },
        // 文件上传进度，单位：字节, 可以在这个函数中拿到上传进度并显示在页面上
        onUploadProgress: function(uploadInfo, totalSize, progress) {
          // console.log(
          //   "onUploadProgress:file:" +
          //     uploadInfo.file.name +
          //     ", fileSize:" +
          //     totalSize +
          //     ", percent:" +
          //     Math.ceil(progress * 100) +
          //     "%"
          // );
          let progressPercent = Math.ceil(progress * 100);
          self.authProgress = progressPercent;
          self.statusText = "文件上传中...";
        },
        // 上传凭证超时
        onUploadTokenExpired: function(uploadInfo) {
          // 上传大文件超时, 如果是上传方式一即根据 UploadAuth 上传时
          // 需要根据 uploadInfo.videoId 调用刷新视频上传凭证接口(https://help.aliyun.com/document_detail/55408.html)重新获取 UploadAuth
          // 然后调用 resumeUploadWithAuth 方法, 这里是测试接口, 所以我直接获取了 UploadAuth
          uploadVideo(vidioData).then(res => {
            // console.log(res);
            if (res.data.code != "0000") {
              return self.$message.error(res.data.msg);
            }
            let uploadAuth = res.data.data.uploadAuth;
            uploader.resumeUploadWithAuth(uploadAuth);
            console.log(
              "upload expired and resume upload with uploadauth " + uploadAuth
            );
          });

          self.statusText = "文件超时...";
        },
        // 全部文件上传结束
        onUploadEnd: function(uploadInfo) {
          self.statusText = "文件上传完毕";
         
        }
      });
      return uploader;
    },
    emitEvent(senData) {
      this.$emit("my-event", senData);
    },
    /**
     * ********** 拿视频的本地链接************
     *
     */
    getVideoLocalUrl() {
      var getUrl = null;
      if (window.createObjectURL != undefined) {
        // basic
        getUrl = window.createObjectURL(this.file);
      } else if (window.URL != undefined) {
        // mozilla(firefox)
        getUrl = window.URL.createObjectURL(this.file);
      } else if (window.webkitURL != undefined) {
        // webkit or chrome
        getUrl = window.webkitURL.createObjectURL(this.file);
      }
      this.videoLocalUrl = getUrl;
      // console.log(getUrl);
    },

    /**
     * ********** 拿视频的第一帧图片************
     *
     */
    getVideoFristImg() {
      this.$nextTick(() => {
        // 创建视频
        let video = document.createElement("video");
        video.controls = "controls";
        video.crossOrigin = "anonymous";
        // 播放地址
        let source = document.createElement("source");
        source.src = this.videoLocalUrl;
        source.type = "video/mp4";
        video.appendChild(source);
        // 这很重要
        video.currentTime = 0.1;
        // 当前帧的数据已加载
        video.addEventListener("loadeddata", () => {
          // 创建画布
          var canvas = document.createElement("canvas");
          canvas.width = video.videoWidth * 0.5;
          canvas.height = video.videoHeight * 0.5;
          canvas
            .getContext("2d")
            .drawImage(video, 0, 0, canvas.width, canvas.height);
          let src = canvas.toDataURL("image/jpg"); //得到第一帧图片的base64
          this.videoFristImg = src;
          console.log(this.videoFristImg);
          // 转码添加
          // var img = document.createElement("img");
          // img.src = src;
          // 给特定vue节点添加
          // this.$refs["video-img-xxx"].appendChild(img);
        });
      });
    },
    /**
     * 获取视频时长和文件大小
     */
    getDuration() {
      let m_file = this.file;
      let fileurl = URL.createObjectURL(m_file);
      let audioElement = new Audio(fileurl);
      audioElement.addEventListener("loadedmetadata", _event => {
        this.duration = Math.floor(audioElement.duration); //单位秒
      });
      let fileSize = Math.round(m_file.size / 1024); //单位：kb
    },

    /********将 base64转换为 blob******** */
    dataURLtoBlob(dataurl) {
      var arr = dataurl.split(","),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new Blob([u8arr], { type: mime });
    },

    /****************拿到blob上传到OSS*********************** */
    uploadFristImg() {
      /***blob转换 blobUrl路径************* */
      let blob = this.dataURLtoBlob(this.videoFristImg); // 传入base64字符串
      let blobUrl = window.URL.createObjectURL(blob);
      // console.log(this.blobUrl)

      let data1 = { type: 3 };
      STS(data1).then(res => {
        if (res.data.code == "0000") {
          let dataObj = res.data.data; //接口返回配置参数
          this.Upload(blobUrl, dataObj);
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },

    // http-request属性来覆盖默认的上传行为（即action="url"），自定义上传的实现
    Upload(file, dataObj) {
      const that = this;
      async function multipartUpload() {
        let temporary = file.file.name.lastIndexOf(".");
        let fileNameLength = file.file.name.length;
        let fileFormat = file.file.name.substring(
          temporary + 1,
          fileNameLength
        );
        let fileName = getFileNameUUID() + "." + fileFormat;
        client(dataObj)
          .multipartUpload(`${dataObj.url}${fileName}`, file.file, {})
          .then(result => {
            //上传成功返回值，可针对项目需求写其他逻辑
            // console.log(result);
            let senData = { url: that.videoUrl, duration: that.duration, firstImg: result };
            that.emitEvent(senData);
          })
          .catch(err => {
            console.log("err:", err);
          });
      }
      multipartUpload();
    }
  }
};
</script>
<style>
.prewVideo {
  width: 88px;
  height: 88px;
  overflow: hidden;
  border-radius: 6px;
  display: inline-block;
  position: relative;
  border: 1px solid #ccc;
}
.prewVideo img {
  width: 100%;
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
  width: 60%;
  margin-top: 14px;
}
.closeBtn {
  position: absolute;
  top: -1px;
  right: -1px;
  cursor: pointer;
}
.container {
  cursor: pointer;
  line-height: 1;
}
.upload {
  display: inline-block;
  cursor: pointer;
}
.upload-type {
  margin: 15px 0;
}
.filebox {
  width: 88px;
  height: 88px;
  color: #999;
  background-color: #fff;
  border: 1px solid #ccc;
  position: relative;
  border-radius: 6px;
  text-align: center;
  line-height: 20px;
  margin-right: 20px;
  display: inline-block;
  vertical-align: bottom;
}
.flletit img {
  width: 44px;
  height: 28px;
  margin-top: 18px;
}
.flletit p {
  font-size: 12px;
}
.filebox .filebtn {
  width: 100%;
  height: 100%;
  border: none;
  background: none;
  position: absolute;
  left: 0;
  top: 0;
  opacity: 0;
}
.filebox .flletit {
  width: 100%;
  height: 100%;
  vertical-align: middle;
}
.filetitle {
  margin: 10px 0;
}
.status span {
  color: #ff4c52;
}
.dialog {
  text-align: center;
}
.hiden {
  width: 0;
  height: 0;
  overflow: hidden;
}
</style>

