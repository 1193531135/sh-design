<template>
  <div class="dataBase-page">
    <p style="height: 4.38vw;"></p>
    <div class="search-list">
      <div class="search-options">
        <!-- <el-cascader v-model="value" :options="options" :props="{ expandTrigger: 'hover' }"
          @change="handleChange"></el-cascader> -->
      </div>
      <div class="search-input"></div>
      <div class="search-null"></div>
    </div>
    <div class="list-container">
      <div class="page-list"></div>
      <div>Not Data</div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      list: [
        {
          title: "1",
          content: "1"
        },
        {
          title: "2",
          content: "2"
        },
        {
          title: "3",
          content: "3"
        }
      ]
    };
  },
  computed: {
    styleType() {
      return this.$store.state.styleConfig.styleType
    }
  },
  watch() { },
  created() {
  },
};
</script>
<style lang="less" scoped>
.dataBase-page{
  background-color: white;
}
.search-list {
  display: flex;
  justify-content: space-between;
}
</style>