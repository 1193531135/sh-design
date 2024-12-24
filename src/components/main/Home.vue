<template>
  <div :style="colorRender()">
    <!-- <LoadingPage v-show="loading"></LoadingPage> -->
    <div class="home-main" v-if="loaded">
      <!-- <Headers class="home-head"></Headers> -->
      <div class="home-con">
        <router-view class="page-con" />
      </div>
    </div>
  </div>
</template>

<script>
import Headers from "./construct/Header.vue";
import LoadingPage from './construct/Loding.vue'
export default {
  name: "Home",
  components: { Headers, LoadingPage },
  data() {
    return {
      loading: false,
      loaded: false
    };
  },
  computed: {
    nowPath() {
      return this.$route.path;
    },
    renderType(){
      return this.$store.state.styleConfig.styleType
    }
  },
  methods: {
    colorRender(){
      const renderMeum = {
        "DARK": "--color--: white;--color2--: white;--color3--: white;--bgcolor--:black;",
        "LIGHT": "--color--: black;--color2--: black;--color3--: #3D3D51;--bgcolor--:white;",
      }
      return renderMeum[this.renderType]
    },
    // 获取样式数据
    getStyleData() {
      return new Promise((re) => {
        setTimeout(() => {
          re({ styleType: this.$route.query.styleType || "DARK", })
        }, 2000)
      })
    }
  },
  async mounted() {
    const styleConfig = await this.getStyleData()
    this.$store.commit("modifyData", { name: "styleConfig", newdata: styleConfig })
    // 获取style后开始进入加载状态
    this.loading = true
    // 加载一些东西
    await new Promise(re => {setTimeout(() => { re() }, 4000)})
    this.loading = false
    this.loaded = true
  }
};
</script>

<style scoped lang="less">

.home-main {
  background-color: rgb(247, 247, 247);
  min-width: 1440px;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  flex-direction: column;

  .home-head {
    position: absolute;
    top: 0;
    background-color: rgba(0, 0, 0, 0);
    height: 80px;
  }

  .home-con {
    flex: 1;
    overflow: hidden;
    display: flex;

    .page-con {
      flex: 1;
    }
  }
}


.movecon {
  display: none;
  overflow: auto;
}

</style>
