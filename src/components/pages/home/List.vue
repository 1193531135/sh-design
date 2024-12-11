<template>
  <div class="home-page-container">
    <video class="bg-video" :src="videoUrl" autoplay muted loop></video>
    <div class="content">
      <div class="content-box">
        <div class="center-title">AI 智能搜索，精准发现灵感！</div>
        <div class="input-container">
          <div class="input-content">
            <div class="search-input">
              <img class="search-icon" src="../../../assets/image/home/search.png">
              <input type="text" placeholder="秋冬季节的油画质感设计">
            </div>
            <div class="search-button" @click="search">
              <div class="hover">搜索</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
const DarkVideo = require("../../../assets/bg-video.mp4")
export default {
  data() {
    return {};
  },
  computed: {
    videoUrl() {
      return this.renderType === "DARK" ? DarkVideo : DarkVideo
    }
  },
  methods: {
    search() {
      // search
    }
  }
};
</script>
<style scoped lang="less">
.home-page-container {
  display: flex;
}

.bg-video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.content {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;

  .content-box {
    // 居中向上偏移
    margin-top: -4.29vh;
  }

  .center-title {
    font-size: 5.27vh;
    line-height: 5.66vh;
    color: var(--color--);
    margin-bottom: 4.29vh;
  }

  .input-container {
    width: 84.9vh;
    height: 11.7vh;
    background-color: rgba(255, 255, 255, 0.8);
    -webkit-backdrop-filter: blur(25px);
    backdrop-filter: blur(25px);
    box-shadow: 0 6px 20px 0 rgba(0, 0, 0, 0.8);
    border: 1px solid rgba(0, 0, 0, 0.6);
    border-radius: 20px;
    display: flex;
    padding: 1.95vh 2.82vh;
    box-sizing: border-box;
    flex: 1;

    .input-content {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: space-between;

      &:hover .search-button {
        opacity: 1;
      }
      .search-input {
        height: 100%;
        display: flex;
        flex: 1;
        align-items: center;
        gap: 1.95vh;

        .search-icon {
          width: 3vh;
        }

        input {
          height: 100%;
          outline: none;
          border: none;
          background-color: rgba(0, 0, 0, 0);
          font-size: 3.12vh;
          flex: 1;
          padding-right: 3vh;
          font-weight: 400;
        }

        input::placeholder {
          color: rgba(153, 153, 163, 1);
        }
      }

      .search-button {
        opacity: 0;
        transition: opacity 0.6s;
        width: 15.6vh;
        background-color: var(--color3--);
        color: var(--bgcolor--);
        height: 100%;
        font-size: 2.53vh;
        line-height: 2.92vh;
        text-align: center;
        padding-top: 2.24vh;
        box-sizing: border-box;
        border-radius: 10px;
        box-shadow: 0 2px 16px 0 rgba(0, 0, 0, 0.1);
        font-family: Anaheim;
        font-weight: 400;
        display: flex;
        > div{
          flex:1
        }
      }
    }
  }
}
</style>