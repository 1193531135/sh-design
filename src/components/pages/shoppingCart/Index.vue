<template>
  <div>
    <p style="height: 80px;"></p>
    <div class="steps">
      <div :class="`steps-item ${active >= index?'':''}`" v-for="(name,index) in stepRander" :key="name">
        <div class="steps-item-icon">{{ index + 1 }}</div>
        <div class="steps-item-name">{{  }}</div>
      </div>
    </div>
    <router-view></router-view>
  </div>
</template>
<script>
export default {
  data(){
    return{
      stepRander:['aaa','bbb','ccc'],
      active:0
    }
  }
}
</script>
<style scoped lang="less">
.el-steps {
  width: 300px;
  margin: 0 auto;
  text-align: left;
  .is-finish .el-step__icon {
    background-color: #3D3D51;
  }
}
</style>