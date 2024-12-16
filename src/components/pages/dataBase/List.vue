<template>
  <div class="dataBase-page">
    <p style="height: 4.38vw;"></p>
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
          <span class="search-text-card" v-show="!searchFoc">{{ searchConfig.name }}</span>
          <input ref="input" class="search-input-text" @blur="searchFoc = false" v-show="searchFoc"
            v-model="searchConfig.name" type="text" @keyup.enter="getListData">
        </div>
      </div>
      <div class="search-null"></div>
    </div>
    <div class="list-container">
      <div class="page-list" v-infinite-scroll="loadData">
        <img v-for="(url,index) in listData.filter((i, index) => index < randerIndex)" :key="index" class="rander-item" :src="url">
      </div>
      <div v-if="listData.length === 0">没有更多了</div>
    </div>
  </div>
</template>
<script>

export default {
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
              label: '1'
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
  computed: {
    styleType() {
      return this.$store.state.styleConfig.styleType
    }
  },
  methods: {
    searchClick() {
      this.searchFoc = true
      this.$nextTick(() => {
        this.$refs.input.focus()
      })
    },
    // 获取后台列表数据
    getListData() {
      setTimeout(() => {
        const responese = {
          status: 200,
          data: {
            code: 200,
            data: [
              "https://th.bing.com/th/id/OIP.AnfpGRH9jn5ISlr-MRh7PwHaHa?w=173&h=180&c=7&r=0&o=5&pid=1.7",
              "https://th.bing.com/th/id/OIP.Sd5fZmx5V064n2B4v5kVlgHaFT?w=242&h=180&c=7&r=0&o=5&pid=1.7",
              "https://th.bing.com/th/id/OIP.aacN2mrGOPxMdnO9RG9NJwHaHa?w=185&h=185&c=7&r=0&o=5&pid=1.7",
              "https://th.bing.com/th/id/OIP.Kum8his5jIIH0U4zlV46GQHaHa?w=185&h=185&c=7&r=0&o=5&pid=1.7",
              "https://th.bing.com/th/id/OIP.ccAGfkHGtJ4CNqD7AD_AbgHaHQ?w=190&h=186&c=7&r=0&o=5&pid=1.7",
              "https://th.bing.com/th/id/OIP.NukYPnWHTwNxgfn5zp22TgHaHa?w=186&h=186&c=7&r=0&o=5&pid=1.7",
              "https://th.bing.com/th/id/OIP.Vx8OfvbfX4ZEpFxP05vj_gHaHa?w=186&h=186&c=7&r=0&o=5&pid=1.7",
              "https://th.bing.com/th/id/OIP.wm-O33o4GamI5C3O4GJpIQHaHa?w=184&h=186&c=7&r=0&o=5&pid=1.7",
              "https://th.bing.com/th/id/OIP.YFIYgExQTg-yGtiVp2es8gHaIO?w=180&h=200&c=7&r=0&o=5&pid=1.7",
              "https://th.bing.com/th/id/OIP.sM12wu1cQlq-7_6nTSx0ywHaHa?w=200&h=200&c=7&r=0&o=5&pid=1.7",
              "https://th.bing.com/th/id/OIP.3AbuIshgNRobf190FR6vTQHaFj?w=267&h=200&c=7&r=0&o=5&pid=1.7",
              "https://th.bing.com/th/id/OIP.QBJ8DQgk6iLB-vKWVDtRYAHaHa?w=201&h=200&c=7&r=0&o=5&pid=1.7",
              "https://th.bing.com/th/id/OIP.GuGKa8bmMqkhqbJLKGNYywHaHa?w=227&h=220&c=7&r=0&o=5&pid=1.7",
              "https://th.bing.com/th/id/OIP.682w5icroBT76KIvze665AHaHa?w=199&h=199&c=7&r=0&o=5&pid=1.7",
              "https://th.bing.com/th/id/OIP.kX5rlFiVwkleetaz2LX2MgHaJQ?w=141&h=180&c=7&r=0&o=5&pid=1.7",
              "https://th.bing.com/th/id/OIP.H_glcHLe6pj0NyLY_cdjvgHaHL?w=197&h=191&c=7&r=0&o=5&pid=1.7",
              "https://th.bing.com/th/id/OIP.idn8yhl_41JWeeelsIInFwHaHa?w=197&h=196&c=7&r=0&o=5&pid=1.7",
              "https://th.bing.com/th/id/OIP.R2IOeYTxw_0pwC0qX7tm0AHaHa?w=180&h=180&c=7&r=0&o=5&pid=1.7",
              "https://th.bing.com/th/id/OIP.BaSc9hL_BLgkhnauyLj0zwHaGl?w=208&h=190&c=7&r=0&o=5&pid=1.7",
            ],
            message: "SUCCESS"
          }
        }
        for(let i = 0;i < 10;i ++){
          responese.data.data = [...responese.data.data,...responese.data.data]
        }
        this.listData = responese.data.data
        // 初始条数
        this.randerIndex = 20
      }, 2000)
    },
    loadData(){
      this.randerIndex += 10
    },
    // 获取分类配置
    getTypeOptions() { },
    // 获取排序配置
    getSortOptions() { }
  },
  watch: {},
  created() {
    // 获取url带过来的查询参数
    this.searchConfig.name = this.$route.query.search || ""
    // 查询
    this.getListData()
  },
};
</script>
<style lang="less" scoped>
.dataBase-page {
  background-color: white;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  flex-direction: column;
}

.search-list {
  display: flex;
  justify-content: space-between;
  font-size: 0.833vw;
  line-height: 1.25vw;
  height: 3.64vw;
  border-bottom: 1px solid #ECECEC;
  align-items: center;
  padding: 0 20px;

  .search-options {
    display: flex;
    gap: 0.52vw;

    .search-item {
      position: relative;
      // overflow: hidden;
      padding: 0 0.833vw;
      border-radius: 1.64vw;
      display: flex;
      height: 2.5vw;
      align-items: center;

      img {
        width: 1.25vw;
      }

      .el-cascader,
      .el-select {
        opacity: 0;
        position: absolute;
        width: 100%;
        height: 100%;
        top: -10px;
      }
    }
  }

  .search-input {
    width: 39.06vw;
    height: 2.5vw;
    background-color: #F9F9F9;
    display: flex;
    box-sizing: border-box;
    padding: 0 1.04vw;
    align-items: center;
    gap: 0.52vw;
    border: 1px solid #E8E8E8;
    border-radius: 0.52vw;

    .search-icon {
      width: 1.25vw;
    }

    .search-content {
      flex: 1;

      .search-text-card {
        padding: 0 1.04vw;
        background-color: white;
        box-sizing: border-box;
        border: 1px solid #E8E8E8;
        height: 2.08vw;
        border-radius: 0.31vw;
        display: flex;
        align-items: center;
        width: max-content
      }

      .search-input-text {
        outline: none;
        border: 0;
        font-size: inherit;
        width: 100%;
        background-color: rgba(0, 0, 0, 0);
      }
    }
  }
}
.container{
  flex: 1;
  overflow: auto;
}
</style>