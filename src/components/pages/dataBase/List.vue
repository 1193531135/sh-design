<template>
  <div class="dataBase-page">
    <Search ref="search" :searchChange="getListData"></Search>
    <div class="list-container" v-loading="loading">
      <div class="card-grid" v-show="listData.length != 0" v-infinite-scroll="loadData">
        <!-- 联系客服 -->
        <div class="chart">
          <img src="../../../assets/image/dataBase/chart.png" alt="">
          <div>联系客服</div>
        </div>
        <div v-for="(itemData, index) in listData.filter((i, index) => index < randerIndex)" :key="index"
          :ref="`card-${index}`" class="card-item">
          <el-image @load="imageLoaded(itemData, `card-${index}`)" @error="imageLoaded(itemData, `card-${index}`)"
            :src="itemData.url" @click="toDetail(itemData)">
          </el-image>
          <div class="heart" @click="heartClick(itemData)">
            <img v-show="itemData.heart === false" src="../../../assets/image/dataBase/heart.png">
            <img v-show="itemData.heart === true" src="../../../assets/image/dataBase/heart-red.png">
          </div>
        </div>
      </div>
      <div class="no-data" v-show="listData.length === 0">
        <img src="../../../assets/image/dataBase/noData.png" alt="">
      </div>
    </div>
  </div>
</template>
<script>
import Search from './Search.vue'
export default {
  components:{ Search },
  data() {
    return {
      listData: [],
      randerIndex: 0,
      loading:false
    };
  },
  methods: {
    // 详情页通过id查询详情
    toDetail(itemData) {
      this.$router.push(`detail?id=${itemData.id}&searchConfigJSON=${JSON.stringify(this.$refs.search.searchConfig)}`)
    },
    // 列表图片load回调布局
    imageLoaded(itemData, refName) {
      itemData.load = false
      const el = this.$refs[refName][0]
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
          const el = this.$refs[`card-${index}`][0]
          const rows = Math.ceil(el.clientHeight / 5) + 2
          el.style.gridRowEnd = `span ${rows}`
        })
      })
    },
    // 获取后台列表数据
    getListData() {
      // 通过ref获取查询数据
      const searchConfig = this.$refs.search.searchConfig
      this.loading = true
      console.log(searchConfig)
      setTimeout(() => {
        const responese = {
          status: 200,
          data: {
            code: 200,
            data: [
              { url: "https://cdn.pixabay.com/photo/2024/12/18/23/30/red-9276345_640.jpg", heart: false },
            ],
            message: "SUCCESS"
          }
        }
        let randerListData = responese.data.data
        // 模拟数据代码块，和responese一起删除
        {
          // 模拟数据 复制多个假数据
          responese.data.data.some(i => { i.url = i.url + '?' + parseInt(Math.random() * 100) })
          for (let i = 0; i < 4; i++) {
            randerListData.push(...randerListData)
          }
        }
        // 初始化load 状态
        const img = document.createElement('img')
        randerListData.some(i => {
          // 已缓存的图片不再重复加载
          img.src = i.url
          i.load = !img.complete
        })
        this.listData = randerListData
        // 初始展示条数
        this.randerIndex = 20
        // 首次布局
        this.reloadLayout()
        // 数据加载完毕关闭load
        this.loading = false
      }, 1000)
    },
    loadData() {
      this.randerIndex += 10
    },
    // 设置like
    async heartClick(cardData) {
      let goalState = !cardData.heart
      // 先进行页面的状态切换
      cardData.heart = goalState
      // let rep = await new Promise((re) => {
      //   // goalState ? like():doLike()
      //   goalState ? 
      //   setTimeout((res) => {
      //     // 执行like方法
      //     re(res)
      //   }):
      //   setTimeout((res) => {
      //     // 执行doLike方法
      //     re(res)
      //   })
      // })
      // // 判断执行失败时，还原列表状态
      // if (rep.error) {
      //   cardData.heart = !goalState
      // }
    }
  },
  watch: {},
  mounted() {
    // 获取url带过来的查询参数
    this.$refs.search.searchConfig.name = this.$route.query.search || ""
    // 如果有携带的 searchConfigJSON 就读取
    if (this.$route.query.searchConfigJSON) {
      this.$refs.search.searchConfig = JSON.parse(this.$route.query.searchConfigJSON)
    } 
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
  display: flex;
  flex-direction: column;

  &::-webkit-scrollbar {
    width: 0;
  }

  .no-data {
    img {
      width: 420px;
      margin-top: -10vh;
    }

    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
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

    &:hover .heart {
      cursor: pointer;
      opacity: 1;
    }

    .heart {
      position: absolute;
      opacity: 0;
      transition: opacity 0.3s;
      width: 40px;
      height: 40px;
      display: flex;
      background-color: white;
      border-radius: 50%;
      align-items: center;
      justify-content: center;
      right: 20px;
      bottom: 20px;

      img {
        width: 19.5px;
      }
    }
  }
}
</style>