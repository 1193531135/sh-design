<template>
  <div class="loading">
    <div class="icon-container">
      <div class="bg-slider"></div>
      <img :src="loadingLogoUrl" alt="">
    </div>
  </div>
</template>
<script>
const loadingDark = require("../../../assets/image/home/logo-loading-dark.png")
const loadingLight = require("../../../assets/image/home/logo-loading-light.png")
export default {
  data() {
    return {};
  },
  computed: {
    renderType(){
      return this.$store.state.styleConfig.styleType
    },
    loadingLogoUrl(){
      return this.renderType === "DARK" ? loadingDark : loadingLight
    }
  },
  metheds:{
  }
};
</script>
<style scoped lang="less">
.loading{
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: var(--bgcolor--);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 4;
}
.icon-container{
  width: 23.43vh;
  height: 18.55vh;
  position: relative;
  overflow: hidden;
  background-color: #CCCCCC;
  .bg-slider{
    width: 100%;
    height: 100%;
    position: absolute;
    left: -100%;
    animation: 2s linear 1s infinite running slidein;
    background-color: var(--color--);
  }
  img{
    position: relative;
    width: 100%;
    height: 100%;
    z-index: 2;
  }
}
@keyframes slidein {
  from { left: -100%; }
  to { left: 100%; }
}
</style>