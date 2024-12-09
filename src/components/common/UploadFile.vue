<template>
  <div class="all-con">
    <!-- 图片一体化的特殊结构区分出来-->
    <div class="image-con" v-if="file.fileShowType === 'image2'">
      <div class="img-list" v-if="renderItem.multiple">
        <div class="img" v-for="imageSrc in fileUrl" :key="imageSrc"></div>
      </div>
      <div @click="selectFile" class="img hover" v-loading="vLoad">
        <img style="width: 100%" v-show="fileUrl" :src="fileUrl ? `${baseUrlLocal}${fileUrl}` : ''" @load="loadend" />
        <i v-if="fileUrl" class="el-icon-error field-delete-btn hover" @click.stop="clearFieldData"></i>
        <i v-if="!fileUrl" class="el-icon-plus"></i>
      </div>
      <!-- 有像素限制或者文件类型限制再展示 -->
      <div v-if="renderItem.pixelLimit || renderItem.fileLimit" class="format image-limit">{{ limitText }}</div>
    </div>
    <!-- 上传+展示 两部分结构的上传控件 -->
    <div v-else>
      <!-- 上传 -->
      <div style="display:flex;align-items:center">
        <el-button-group class="el-button-group-btns">
          <el-button @click="selectFile" size="small" type="primary" :loading="vLoad" :disabled="disabledLocal">
            Upload file
            <span>{{ limitText }}</span>
          </el-button>
          <el-button size="small" icon="el-icon-download" v-show="fileUrl" @click="downloadFile"></el-button>
        </el-button-group>
        <span class="file-name">{{ fileName }}</span>
      </div>
      <!-- 文件渲染的内容 -->
      <div v-show="fileUrl" class="show-body">
        <!-- 文字 -->
        <div class="text-con" v-if="file.fileShowType === 'text'">
          {{ renderItem.randerText || "Upload Success" }}
          <i class="el-icon-success" style="color:#67C23A;margin-left:5px"></i>
        </div>
        <!-- 图片 -->
        <div class="image-con" v-else-if="file.fileShowType === 'image'">
          <el-image class="img" :src="showFileUrl" fit="contain" :preview-src-list="[showFileUrl]"
            @load="loadend"></el-image>
          <!-- <img style="width: 100%" :src="fileUrl ? `${baseUrlLocal}${fileUrl}` : ''" @load="loadend" /> -->
        </div>
        <!-- 音视频 -->
        <div class="video-con" v-else-if="file.fileShowType === 'audio' || file.fileShowType === 'video'">
          <video ref="videoTs" type="application/x-mpegURL" class="video-js" :src="showFileUrl" controls
            :height="videoHeight"></video>
          <div class="video-duation" v-if="renderItem.showTime && fatherObj[renderItem.timeModel]">{{ mediaDuation }}
          </div>
        </div>
        <i v-show="!disabledLocal" class="el-icon-error field-delete-btn hover" @click="clearFieldData"></i>
      </div>
    </div>
  </div>
</template>
<script>
import { file } from 'jszip';

export default {
  renderType: "file",
  props: {
    "data": String,
    "renderItem": Object,
    "uploadFile": Function,
    "load": Boolean,
    "dataFromObj": Object,
    "baseUrl": String,
    "disabled": Boolean,
    "fileShowType": String,
    "height": [String, Number]
  },
  data() {
    return {
      window: window,
      hlsPlayer: null,
      showFileUrl: "",
      showTypeDir: {
        image: ['webp', 'png', 'jpg', 'jpeg', 'gif', 'svg'],
        video: ['mp4', 'webm'],
        audio: ['mp3']
      },
      file: {
        // 文件后缀名
        suffix: '',
        // 展示方式
        fileShowType: '',
        // 展示的高度
        showHeight: ''
      },
    };
  },
  computed: {
    // videoHeight 媒体容器的高度
    disabledLocal() {
      return this.disabled
    },
    videoHeight() {
      let height;
      if (this.file.showHeight) {
        height = this.file.showHeight;
      } else if (this.file.fileShowType === "audio") {
        height = "46";
      } else {
        height = "200";
      }
      return height;
    },
    limitText() {
      let text = "";
      let renderItem = this.renderItem;
      // 文件像素点限制文字
      if (renderItem.pixelLimit) {
        text += renderItem.pixelLimit[0] + "x" + renderItem.pixelLimit[1];
      }
      // 文件大小限制文字
      if (renderItem.maxSize || renderItem.minSize) {
        text += ` ${renderItem.minSize ? renderItem.minSize + "M <=" : ""
          } size ${renderItem.maxSize && "< " + renderItem.maxSize + "M"}`;
      }
      // 类型限制
      if (renderItem.fileLimit) {
        text += " " + renderItem.fileLimit;
      }
      text && (text = `( format:${text} )`);
      return text;
    },
    mediaDuation() {
      return window.vueSystem.TimeShow(
        this.fatherObj[this.renderItem.timeModel],
        true
      );
    },
    fileName() {
      let string = "";
      if (this.fileUrl) {
        // 先转数组
        // 创建存key的obj
        let obj = {};
        let array = this.fileUrl.split("&");
        array.some(item => {
          if (item.indexOf("=") != -1) {
            let array2 = item.split("=");
            obj[array2[0]] = array2[1];
          }
        });
        obj.name &&
          (string = decodeURIComponent(obj.name.replaceAll("+", "%20")));
      }
      return string;
    },
    fileUrl: {
      get() {
        return this.data;
      },
      set(val) {
        this.$emit("update:data", val);
      }
    },
    vLoad: {
      get() {
        return this.load;
      },
      set(val) {
        this.$emit("update:load", val);
      }
    },
    fatherObj: {
      get() {
        return this.dataFromObj;
      },
      set(val) {
        this.$emit("update:dataFromObj", val);
      }
    },
    baseUrlLocal() {
      return this.renderItem.baseUrl || this.baseUrl;
    },
    fileShowTypeLocal() {
      return this.fileShowType
    }
  },
  watch: {
    fileUrl: {
      handler(val) {
        val && this.fileUrlChange(val);
      },
      immediate: true
    }
  },
  methods: {
    // 通过读取的URL获取文件后缀名
    readTypeInUrl(url) {
      if (url) {
        let array = url.split("?")
        let type = array[0].split(".")
        return type[type.length - 1]
      }
    },
    // checkout,校验方法
    checkout() {
      // must 校验
      if (!this.fileUrl && this.renderItem.must) {
        return false
      }
      // 时长校验
      {
        let timeModel = this.renderItem.timeModel
        if (timeModel && (!this.fatherObj[timeModel])) {
          return false
        }
      }
    },
    // 加载完后关闭加载状态
    loadend() {
      this.vLoad = false;
    },
    downloadFile() {
      let a = document.createElement("a");
      a.download = this.fileName;
      a.target = "_blank"
      a.href = this.baseUrlLocal + this.fileUrl;
      a.click();
    },
    // 清除数据
    clearFieldData() {
      this.fileUrl = "";
    },
    fileUrlChange(url) {
      // 获取文件后缀名
      this.file.suffix = this.readTypeInUrl(url)
      let suffix = this.file.suffix
      // url补全
      url = this.processUrl(url)
      // 通过后缀名映射文件的展示类型，showTypeDir的key作为展示类型
      Object.keys(this.showTypeDir).some(key => {
        if (this.showTypeDir[key].includes(suffix)) {
          this.file.fileShowType = key
          return true
        }
      })
      // 一些特殊的类型需要做一些处理
      // 对ts和m3u8的特殊解析处理
      if (suffix === "ts" || suffix === "m3u8") {
        // 先默认设置为audio，把dom渲染出来
        this.file.fileShowType = "audio"
      }
      // showType没有对应映射的时候，设置默认值text
      if (!this.file.fileShowType) {
        this.file.fileShowType = "text"
      }
      // 开始进行dom渲染完毕的一些操作
      this.$nextTick(() => {
        // ts 和 m3u8 挂载dom
        if (suffix === "ts" || suffix === 'm3u8') {
          this.createVideoPlayer(suffix === 'ts'?this.tsTransformM3u8(url):url);
        }
        // 媒体文件添加时长监听
        this.addGetTimeListener()
      });
      // fileUrl更新后，更新页面上控件绑定的url
      this.showFileUrl = url
      // 有change事件就触发
      this.renderItem.change && this.renderItem.change(url, this.renderItem);
    },
    // 检查路径是否为全路径，相对路径就用baseUrl拼接
    processUrl(url) {
      // 从头部判断是否为全地址, 兼容没有host详情返回的相对路径的url
      if (!/(^blob:http)|(^http)/.test(url)) {
        url = `${this.baseUrlLocal}${url}`
      }
      return url
    },
    tsTransformM3u8(tsUrl) {
      let m3u8Url = ''
      let m3u8DataArray = ["#EXTM3U",
        "#EXT-X-VERSION:4",
        "#EXT-X-ALLOW-CACHE:NO",
        "#EXT-X-TARGETDURATION:3000",
        "#EXT-X-PLAYLIST-TYPE:VOD",
        "#EXT-X-START:TIME-OFFSET=0",
        "#EXT-X-MEDIA-SEQUENCE:0",
        "#EXTINF:0.000000,",
        `${tsUrl}`,
        "#EXT-X-ENDLIST"];
      let m3u8DataText = m3u8DataArray.map(str => str + '\n').join("")
      let blob = new Blob([m3u8DataText]);
      m3u8Url = URL.createObjectURL(blob);
      return m3u8Url
    },
    createVideoPlayer(m3u8Url) {
      // console.log(fileUrl);
      if (this.$Hls.isSupported()) {
        // 不存在就创建player
        if (!this.hlsPlayer) {
          this.hlsPlayer = new this.$Hls();
          this.hlsPlayer.attachMedia(this.$refs["videoTs"]);
        }
        this.hlsPlayer.loadSource(m3u8Url);
        // 在buffer create时间中监听数据包是否包含video
        this.hlsPlayer.once(this.$Hls.Events.BUFFER_CREATED, (event, data) => {
          // data中tracks存在video属性，那么当前ts文件为视频ts
          if (data.tracks.video) {
            this.file.fileShowType = "video"
          }
        })
      }
    },
    async selectFile() {
      let obj = this.renderItem;
      if (obj.disabled) {
        return true;
      }
      // request
      let type = obj.fileShowType;
      // 文件格式限制
      let limit = obj.fileLimit;
      // 文件名称限制
      let fileNameLimit = obj.nameFormat
      // 文件上传的 bucket
      let dirKey = obj.dirKey;
      // 文件最大大小
      let maxSize = obj.maxSize;
      // 文件最小限制
      let minSize = obj.minSize;
      // timeModel 的字段
      let timeModel = obj.timeModel
      let files = document.createElement("input");
      files.type = "file";
      files.onchange = async () => {
        let file = files.files[0];
        // 类型校验(包含校验)(可用于后缀名或者固定名称格式)
        if (limit) {
          let state = true;
          limit.split(",").some(i => {
            let fileType = file.name.substring(file.name.lastIndexOf('.') + 1)
            fileType.toUpperCase() === i.toUpperCase() && (state = false)
          });
          if (state) {
            return this.$message({
              message: "Incorrect file format",
              type: "warning"
            });
          }
        }
        // 文件名称校验
        if (fileNameLimit) {
          let state = true;
          fileNameLimit.split(",").some(i => {
            let reg = new RegExp(i)
            reg.test(file.name) && (state = false)
          });
          if (state) {
            return this.$message({
              message: `file name must be ${fileNameLimit}`,
              type: "warning"
            });
          }
        }
        // 文件大小校验
        if (maxSize || minSize) {
          // 默认单位是1MB
          // 默认最大为10GB
          let size = file.size / 1024 / 1024;
          maxSize = maxSize || 1024 * 10;
          minSize = minSize || 0;
          if (size > maxSize || size < minSize) {
            this.$message({
              message: `File size ranges from ${minSize}MB to ${maxSize}MB`,
              type: "warning"
            });
            return true;
          }
        }
        // 图片比例像素大小限制
        if (type === "image" && obj.pixelLimit) {
          let a = document.createElement("img");
          a.src = URL.createObjectURL(file);
          await new Promise(resolve => {
            a.onload = () => {
              resolve();
            };
          });
          if (obj.pixelLimit) {
            if (
              (obj.pixelLimit[2] === "==" &&
                !(
                  a.width === obj.pixelLimit[0] &&
                  a.height === obj.pixelLimit[1]
                )) ||
              (obj.pixelLimit[2] === ">" &&
                !(
                  a.width > obj.pixelLimit[0] && a.height > obj.pixelLimit[1]
                )) ||
              (obj.pixelLimit[2] === ">=" &&
                !(
                  a.width >= obj.pixelLimit[0] && a.height >= obj.pixelLimit[1]
                )) ||
              (obj.pixelLimit[2] === "<" &&
                !(
                  a.width < obj.pixelLimit[0] && a.height < obj.pixelLimit[1]
                )) ||
              (obj.pixelLimit[2] === "<=" &&
                !(
                  a.width <= obj.pixelLimit[0] && a.height <= obj.pixelLimit[1]
                ))
            ) {
              this.$message({
                message: "Incorrect size",
                type: "warning"
              });
              return true;
            }
          }
        }
        // 上传
        this.vLoad = true;
        // 字典绑定方法优先级大于默认传入方法
        let uploadHandle = this.renderItem.uploadFile || this.uploadFile;
        // 上传前前清空timeModel
        if (timeModel) {
          this.fatherObj[timeModel] = ''
        }
        let urlObj = await uploadHandle({ file, dirKey, renderItem: this.renderItem });
        // 有uploaded触发loaded事件
        this.renderItem.uploaded && this.renderItem.uploaded();
        if (type != "image" || urlObj.error) {
          // 图片上传完毕后再等加载完成再取消掉load状态,或者出现了错误
          this.vLoad = false;
        }
        // 默认赋值相对路径
        urlObj.fileRelativeUrl && (this.fileUrl = urlObj.fileRelativeUrl);
        // 同步字段存在，并且没有值的情况下，将数据同步过去，因为是url不考虑值为0和false
        obj.syncField?.some(i => {
          !this.fatherObj[i] && (this.fatherObj[i] = urlObj.fileRelativeUrl);
        });
      };
      files.click();
    },
    addGetTimeListener() {
      if (this.renderItem.timeModel) {
        // 时长监听，用以准确获取时长
        // 当时长大于0的时候，发起一个延时更新，当在延时更新0.2s内再次发生change，就销毁之前的延时器，
        let timeOut = null;
        this.$refs["videoTs"].addEventListener("durationchange", () => {
          this.duration = this.$refs["videoTs"].duration * 1000
          if (this.duration > 0) {
            if (timeOut) {
              clearTimeout(timeOut)
              timeOut = null
            }
            timeOut = setTimeout(() => {
              this.$set(
                this.fatherObj,
                this.renderItem.timeModel,
                parseInt(this.$refs["videoTs"].duration * 1000)
              );
            }, 200)
          }
        });
      }
    },
  },
  mounted() {
    // 有timeModel的情况等loaded视频赋值时长
    // 等待加载完成再添加监听
  }
};
</script>

<style scoped>
/* button and video class */
.el-button-group-btns {
  flex-wrap: nowrap;
  display: flex;
}

.file-con {
  text-align: left;
}

.show-body {
  width: 500px;
}

.show-body:hover>.text-con {
  background-color: rgba(0, 0, 0, 0.1);
  cursor: default;
}

.text-con {
  text-align: left;
  padding-left: 10px;
  border-radius: 10px;
  box-sizing: border-box;
  user-select: none;
  display: flex;
  align-items: center;
}

.video-con {
  position: relative;
  font-size: 12px;
  color: #606266;
}

.video-duation {
  text-align: left;
}

.video-js {
  width: 100%;
}

.show-body {
  position: relative;
  margin-top: 5px;
}

.show-body:hover .field-delete-btn,
.img:hover>.field-delete-btn {
  display: block;
}

.field-delete-btn {
  position: absolute;
  right: -6px;
  top: -6px;
  display: none;
  z-index: 100;
}

.file-name {
  display: flex;
  align-items: center;
  margin-left: 10px;
  font-size: 12px;
  color: #606266;
}

/* setting video time class */
video::-webkit-media-controls-current-time-display,
video::-webkit-media-controls-time-remaining-display {
  font-size: 12px;
}

video::-webkit-media-controls-enclosure {
  border-radius: 15px;
}
</style>

<style scoped>
/* image class */
.image-con {
  display: flex;
  /* color: #f56c6c; */
}

.image-con .image-limit {
  font-size: 13px;
  box-sizing: border-box;
  padding-top: 4px;
}

.img {
  height: 100px;
  width: 100px;
  cursor: pointer;
  border: 1px solid rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 20px;
  position: relative;
}

.image-con .img img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}
</style>