<template>
  <div class="file-con">
    <el-button @click="uploadData" size="small" :loading="vLoad">Upload ts</el-button>
    <div class="video-con" v-show="fileUrl">
      <video
        ref="videoTs"
        type="application/x-mpegURL"
        class="video-js"
        :height="renderItem.height?renderItem.height:renderItem.fileShowType === 'audio'?'56':'200'"
        src
        controls
      ></video>
      <i class="el-icon-error field-delete-btn hover" @click="clearFieldData"></i>
    </div>
  </div>
</template>
<script>
export default {
  props: ["data", "renderItem", "uploadFile", "load"],
  data() {
    return {
      hlsPlayer: null,
      options: {
        controls: true,
        language: "zh-CN",
        fluid: true,
        sources: [
          {
            type: "application/x-mpegURL",
            src: "" //视频播放地址
          }
        ]
      }
    };
  },
  computed: {
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
    }
  },
  watch: {
    fileUrl(val) {
      val && this.createVideoPlayer(val);
    }
  },
  methods: {
    clearFieldData() {
      this.fileUrl = "";
    },
    createVideoPlayer(url) {
      // 拼上默认前缀域名
      let fileUrl = this.$store.state.default_file_url + url;
      if (this.$Hls.isSupported()) {
        let fileText = `#EXTM3U
#EXT-X-VERSION:4
#EXT-X-ALLOW-CACHE:NO
#EXT-X-TARGETDURATION:120
#EXT-X-PLAYLIST-TYPE:VOD
#EXT-X-START:TIME-OFFSET=0
#EXT-X-MEDIA-SEQUENCE:0
#EXTINF:101.000000,
${fileUrl}
#EXT-X-ENDLIST`;
        let blob = new Blob([fileText]);
        url = URL.createObjectURL(blob);
        if(!this.hlsPlayer){
          this.hlsPlayer = new this.$Hls()
          this.hlsPlayer.attachMedia(this.$refs["videoTs"]);
        }
        this.hlsPlayer.loadSource(url);
      }
    },
    async uploadData() {
      let renderItem = this.renderItem;
      let files = document.createElement("input");
      files.type = "file";
      files.onchange = async () => {
        let file = files.files[0];
        this.vLoad = true
        let upload = this.renderItem.uploadFile?this.renderItem.uploadFile:this.uploadFile
        upload(
          file,
          url => {
            this.vLoad = false;
            if (url === "error") {
              console.log('error')
            } else {
              this.fileUrl = url;
            }
          },
          renderItem.modelName,
          renderItem.dirKey,
          renderItem
        );
        // this.videos[modelName].play();
      };
      files.click();
    }
  }
};
</script>

<style scoped>
.file-con{
  text-align: left;
}
.video-con {
  width: 500px;
  position: relative;
  margin-top: 5px;
}
.video-js {
  width: 100%;
}
.video-con:hover > .field-delete-btn {
  display: block;
}
.field-delete-btn {
  position: absolute;
  right: 0;
  top: 0;
  display: none;
  z-index: 100;
}
</style>