<template>
  <div class="show-con">
    <list105 ref="list105"></list105>
  </div>
</template>
<script>
import list105 from './List.vue'
export default {
  components: { list105 },
  methods: {
    clearOptions() {
      const list = this.$refs.list105
      // 隐藏dom
      list.$nextTick(() => {
        document.querySelector('.home-list').remove();
        document.querySelector('.bgcdiv').remove();
        [ ...list.$el.querySelector(".search-con").children ].forEach(i => {
          (
            i.className.indexOf('time-select') === -1 && 
            i.className.indexOf('style-filter') === -1 && 
            i.className.indexOf('sort-select') === -1 
          )
          && i.remove()
        })
        list.$el.querySelector('.interval').remove();
        // 禁用方法
        list.setHeart = () => { }
        list.deleteData = () => { }
        list.passData = () => { }
        list.ignoreReport = () => { }
        list.rejectData = () => { }
        list.unpinData = () => { }
        list.toppingData = () => { }
      })
    },
  },
  mounted() {
    this.clearOptions()
  }
}
</script>
<style lang="less" scoped>
.show-con {
  /deep/ .list-all {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    .search-con{
    }
    .el-dialog .detail-options,
    .report-item-btn
    { display: none; }
    .card-item {
      .el-checkbox,
      .el-button:not(.detail-button) {
        display: none;
      }
    }
  }

}
</style>