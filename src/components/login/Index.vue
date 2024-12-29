<template>
  <div class="login-container">
    <img class="icon" src="../../assets/image/home/logo-white.png"/>
    <div class="float-text">登录即享设计师精选<br>点亮你的生活美学</div>
    <div class="bg-img">
      <img src="../../assets/image/home/login-bg.png" alt="">
    </div>
    <div class="white-space">
      <router-view></router-view>
    </div>
  </div>
</template>
<script>
export default {
  data(){
    return{
    }
  },
}
</script>
<style scoped lang="less">
.login-container{
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  .icon{
    width: 40px;
    position: absolute;
    top: 50px;
    left: 62px;
  }
  .float-text{
    font-size: 30px;
    line-height: 50px;
    color: #D6E4EB;
    top: 230px;
    font-weight: 400;
    left: 100px;
    position: absolute;
  }
  .bg-img{
    flex: 1.5;
    object-fit: cover;
    img{
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
  .white-space{
    flex: 1;
    min-width: 580px;
    background-color: white;
    color: #7E7E8D;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

</style>