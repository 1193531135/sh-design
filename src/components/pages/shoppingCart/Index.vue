<template>
  <div class="order-container">
    <p style="height: 80px;"></p>
    <div class="steps">
      <div :class="`steps-item ${active >= index?'is-success':''}`" v-for="(name,index) in stepRander" :key="name">
        <div class="steps-item-line" v-if="index != 0"></div>
        <div class="steps-item-icon">{{ index + 1 }}</div>
        <div class="steps-item-name">{{ name }}</div>
      </div>
    </div>
    <router-view></router-view>
  </div>
</template>
<script>
export default {
  data(){
    return{
      stepRander:['我的购物车','填写订单信息','成功提交订单'],
      active:0
    }
  },
  computed:{
    path(){
      return this.$route.path
    }
  },
  watch:{
    path(val){
      if(val == '/shopping-cart/card'){
        this.active = 0
      }else if(val == '/shopping-cart/order-input'){
        this.active = 1
      }else{
        this.active = 2
      }
    }
  }
}
</script>
<style scoped lang="less">
.order-container{
  background-color: white;
  display: flex;
  flex-direction: column;
  font-weight: 400;
}
.steps {
  margin: 30px auto 0;
  text-align: left;
  display: flex;
  justify-content: center;
  gap: 10px;
  .steps-item{
    display: flex;
    align-items: center;
    gap: 10px;
    color: #9999A3;
    .steps-item-line{
      width: 50px;
      border: 1px dashed #9999A3;
    }
    .steps-item-icon{
      border: 1px solid #9999A3;
      border-radius: 50%;
      width: 34px;
      height: 34px;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      justify-content: center;
      padding-bottom: 5px;
    }
    .steps-item-name{
      margin-top: -5px;
    }
  }
  .steps-item.is-success {
    color:#000000;
    .steps-item-icon{
      background-color: #3D3D51;
      color: white;
    }
  }
}
</style>