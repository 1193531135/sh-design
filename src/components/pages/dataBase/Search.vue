<template>
  <div class="search-list">
    <div class="search-options">
      <div class="search-item search-type" :class="isFocType ? 'sh-select' : ''">
        <span class="search-title-text">{{ "分类" }}</span>
        <img src="../../../assets/image/home/select-down.png" alt="">
        <el-cascader v-model="searchConfig.type" :options="typeOptions" @visible-change="(val) => isFocType = val"
          placement="bottom-start" popper-class="sh-popuop"
          :props="{ expandTrigger: 'hover', emitPath: false, value: 'label' }"></el-cascader>
      </div>
      <div class="search-item search-sort" :class="isFocSort ? 'sh-select' : ''">
        <span class="search-title-text">{{ "综合排序" }}</span>
        <img src="../../../assets/image/home/select-down.png" alt="">
        <el-select v-model="searchConfig.sort" popper-class="sh-popuop" @visible-change="(val) => isFocSort = val">
          <el-option v-for="item in SortOptions" :key="item.label" :value="item.label">
            <span>{{ item.label }}</span>
            <i class="el-icon-check" style="position: absolute;right: 10px;opacity: 0;"></i>
          </el-option>
        </el-select>
      </div>
    </div>
    <div class="search-input" @click="searchClick">
      <img class="search-icon" src="../../../assets/image/home/search.png" />
      <div class="search-content">
        <span class="search-text-card" v-show="!searchFoc && searchConfig.name">{{ searchConfig.name }}</span>
        <input ref="input" class="search-input-text" v-show="searchFoc" v-model="searchConfig.name" type="text"
          @keyup.enter="searchData">
      </div>
    </div>
  </div>
</template>
<script>

export default {
  props:["getListData"],
  data() {
    return {
      listData: [],
      randerIndex: 0,
      searchConfig: {
        type: "",
        sort: "",
        name: ""
      },
      typeOptions: [
        {
          label: '抽象',
          children: [
            {
              label: '几何'
            },
            {
              label: '条格'
            },
            {
              label: '花卉'
            },
            {
              label: '北欧极简'
            },
            {
              label: '肌理'
            },
            {
              label: '渐变'
            },
          ]
        },
        {
          label: '花卉',
          children: [
            {
              label: '1',
              children: [
                { label: 'a' },
                { label: 'b' },
                { label: 'c' },
                { label: 'd' },
                { label: 'e' },
              ]
            },
            {
              label: '2'
            },
            {
              label: '3'
            },
            {
              label: '4'
            },
            {
              label: '5'
            },
            {
              label: '6'
            },
          ]
        },
      ],
      SortOptions: [
        { label: "价格从低到高" },
        { label: "价格从高到低" },
        { label: "最多收藏" },
        { label: "最新作品" },
      ],
      isFocType: false,
      isFocSort: false,
      searchFoc: false,
    };
  },
  methods: {
    coverConfig(data){
      this.searchConfig = data
    },
    searchClick() {
      this.searchFoc = true
      this.$nextTick(() => {
        this.$refs.input.focus()
      })
    },
    // 获取后台列表数据
    searchData() {
      this.searchFoc = false
      this.getListData()
    },
    // 获取分类配置
    getTypeOptions() { },
    // 获取排序配置
    getSortOptions() { },
  },
};
</script>
<style lang="less" scoped>
.search-list {
  display: flex;
  justify-content: center;
  font-size: 16px;
  line-height: 24px;
  height: 68px;
  border-bottom: 1px solid #ECECEC;
  align-items: center;
  margin-top: 80px;

  .search-options {
    padding-left: 20px;
    position: absolute;
    left: 0;
    display: flex;
    gap: 10px;

    .search-item {
      position: relative;
      // overflow: hidden;
      padding: 0 16px;
      border-radius: 24px;
      display: flex;
      height: 48px;
      align-items: center;

      img {
        width: 24px;
      }

      .el-cascader,
      .el-select {
        opacity: 0;
        position: absolute;
        width: 100%;
        height: 100%;
        left: 0;
      }
    }
  }

  .search-input {
    width: 750px;
    height: 48px;
    background-color: #F9F9F9;
    display: flex;
    box-sizing: border-box;
    padding: 0 20px;
    align-items: center;
    gap: 10px;
    border: 1px solid #E8E8E8;
    border-radius: 10px;

    .search-icon {
      width: 24px;
    }

    .search-content {
      flex: 1;

      .search-text-card {
        padding: 0 20px;
        background-color: white;
        box-sizing: border-box;
        border: 1px solid #E8E8E8;
        height: 40px;
        border-radius: 6px;
        display: flex;
        align-items: center;
        width: max-content
      }

      .search-input-text {
        outline: none;
        border: 0;
        font-size: inherit;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0);
      }
    }
  }
}

</style>