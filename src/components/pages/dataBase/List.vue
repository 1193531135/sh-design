<template>
  <div class="dataBase-page">
    <p style="height: 80px;"></p>
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
            @keyup.enter="getListData">
        </div>
      </div>
    </div>
    <div class="list-container">
      <div class="card-grid" v-infinite-scroll="loadData">
        <!-- 联系客服 -->
        <div class="chart">
          <img src="../../../assets/image/home/chart.png" alt="">
          <div>联系客服</div>
        </div>
        <el-image v-for="(itemData, index) in listData.filter((i, index) => index < randerIndex)" :key="index"
          class="card-item" :ref="`card-${index}`" @load="imageLoaded(itemData, `card-${index}`)"
          @error="imageLoaded(itemData, `card-${index}`)" :src="itemData.url">
        </el-image>
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
    // 列表图片load回调布局
    imageLoaded(itemData, refName) {
      itemData.load = false
      const el = this.$refs[refName][0].$el
      // 重新布局
      this.$nextTick(() => {
        const rows = Math.ceil(el.clientHeight / 5) + 2
        el.style.gridRowEnd = `span ${rows}`
      })
    },
    // 所有图片重新布局
    reloadLayout() {
      this.$nextTick(() => {
        this.listData.filter((i, index) => index < this.randerIndex).forEach((itemData, index) => {
          const el = this.$refs[`card-${index}`][0].$el
          const rows = Math.ceil(el.clientHeight / 5) + 2
          el.style.gridRowEnd = `span ${rows}`
        })
      })
    },
    searchClick() {
      this.searchFoc = true
      this.$nextTick(() => {
        this.$refs.input.focus()
      })
    },
    // 获取后台列表数据
    getListData() {
      this.searchFoc = false
      setTimeout(() => {
        const responese = {
          status: 200,
          data: {
            code: 200,
            data: [
              { url: "https://th.bing.com/th/id/OIP.AnfpGRH9jn5ISlr-MRh7PwHaHa" },
              { url: "https://th.bing.com/th/id/OIP.AnfpGRH9jn5ISlr-MRh7PwHaHa?123" },
              { url: "https://th.bing.com/th/id/OIP.Sd5fZmx5V064n2B4v5kVlgHaFT" },
              { url: "https://th.bing.com/th/id/OIP.aacN2mrGOPxMdnO9RG9NJwHaHa" },
              { url: "https://th.bing.com/th/id/OIP.Kum8his5jIIH0U4zlV46GQHaHa" },
              { url: "https://th.bing.com/th/id/OIP.ccAGfkHGtJ4CNqD7AD_AbgHaHQ" },
              { url: "https://th.bing.com/th/id/OIP.NukYPnWHTwNxgfn5zp22TgHaHa" },
              { url: "https://th.bing.com/th/id/OIP.Vx8OfvbfX4ZEpFxP05vj_gHaHa" },
              { url: "https://th.bing.com/th/id/OIP.wm-O33o4GamI5C3O4GJpIQHaHa" },
              { url: "https://th.bing.com/th/id/OIP.YFIYgExQTg-yGtiVp2es8gHaIO" },
              { url: "https://th.bing.com/th/id/OIP.sM12wu1cQlq-7_6nTSx0ywHaHa" },
              { url: "https://th.bing.com/th/id/OIP.3AbuIshgNRobf190FR6vTQHaFj" },
              { url: "https://th.bing.com/th/id/OIP.QBJ8DQgk6iLB-vKWVDtRYAHaHa" },
              { url: "https://th.bing.com/th/id/OIP.GuGKa8bmMqkhqbJLKGNYywHaHa" },
              { url: "https://th.bing.com/th/id/OIP.682w5icroBT76KIvze665AHaHa" },
              { url: "https://th.bing.com/th/id/OIP.kX5rlFiVwkleetaz2LX2MgHaJQ" },
              { url: "https://th.bing.com/th/id/OIP.H_glcHLe6pj0NyLY_cdjvgHaHL" },
              { url: "https://th.bing.com/th/id/OIP.idn8yhl_41JWeeelsIInFwHaHa" },
              { url: "https://th.bing.com/th/id/OIP.R2IOeYTxw_0pwC0qX7tm0AHaHa" },
              { url: "https://th.bing.com/th/id/OIP.BaSc9hL_BLgkhnauyLj0zwHaGl" },
            ],
            message: "SUCCESS"
          }
        }
        // 模拟数据
        let randerListData = responese.data.data.map(i => ({ url: i.url + '?' + parseInt(Math.random() * 100) }))
        // 初始化load 状态
        const img = document.createElement('img')
        randerListData.some(i => {
          // 已缓存的图片不再重复加载
          img.src = i.url
          i.load = !img.complete
        })
        // 复制多个假数据
        for (let i = 0; i < 4; i++) {
          randerListData.push(...randerListData)
        }
        this.listData = randerListData
        // 初始条数
        this.randerIndex = 20
        // 首次布局
        this.reloadLayout()
      }, 1000)
    },
    loadData() {
      this.randerIndex += 10
    },
    // 获取分类配置
    getTypeOptions() { },
    // 获取排序配置
    getSortOptions() { }
  },
  watch: {},
  mounted() {
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

.chart {
  --chart-width--: 48px;
  position: fixed;
  right: 0;
  bottom: 20%;
  z-index: 2;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 5px;
  width: var(--chart-width--);
  height: 148px;
  background-color: #F6EBDE;
  flex-direction: column;
  border-color: #C5BAB1;
  border-width: 1px 0 1px 1px;
  border-radius: 16px 0 0 16px;
  border-style: solid;
  img {
    width: 24px;
  }

  div {
    word-break: break-all;
    width: 20px;
  }
}

.search-list {
  display: flex;
  justify-content: center;
  font-size: 16px;
  line-height: 24px;
  height: 68px;
  border-bottom: 1px solid #ECECEC;
  align-items: center;

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

.list-container {
  flex: 1;
  overflow: auto;
  &::-webkit-scrollbar {
    width: 0;
  }
}

.card-grid {
  --image-width--: 264px;
  width: 100%;
  margin: 20px auto; // 剧中
  // // columns: 10 180px;
  // grid-auto-flow: row dense;
  display: grid;
  grid-auto-rows: 5px;
  grid-template-columns: repeat(auto-fill, calc(var(--image-width--) + 20px));
  align-items: start;
  justify-content: center;

  .card-item {
    width: var(--image-width--);
    border-radius: 16px;
    font-size: 12px;
    overflow: hidden;
    // display: flex;
    // flex-direction: column;
    position: relative;

    &:hover {
      cursor: pointer;
    }

    &:hover>.card-shadow {
      display: block;
    }

    &:hover>.card-shadow>.card-shadow-btns {
      display: flex;
    }

    .card-shadow {
      display: none;
      position: absolute;
      top: 0;
      bottom: 0;
      width: 100%;
      z-index: 2;
      background-color: rgba(0, 0, 0, 0.8);

      .card-shadow-btns {
        position: absolute;
        top: 0;
        bottom: 0;
        width: 100%;
        display: none;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 5px;

        >.el-button,
        >.el-dropdown {
          width: 80%;
          margin: 0;
        }

        .reject-button {
          width: 80%;
          position: relative;

          .el-button {
            width: 100%;
          }

          .reject-select {
            position: absolute;
            width: 100%;
            height: 100%;
            left: 0;
            top: 0;
            opacity: 0;
            cursor: pointer;
          }
        }

        >.el-dropdown>.el-button {
          width: 100%;
        }
      }

      .el-checkbox {
        position: absolute;
        z-index: 3;
        top: 16px;
        left: 16px;
      }
    }
  }
}
</style>