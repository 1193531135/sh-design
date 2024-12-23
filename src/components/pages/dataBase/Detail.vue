<template>
  <div class="dataBase-page" v-loading="loading">
    <Search ref="search" :searchChange="getListData"></Search>
    <div class="list-container">
      <div class="dataDetail">
        <div class="image-container">
          <el-carousel :autoplay="false" arrow="always" trigger="click" height="800px">
            <el-carousel-item v-for="(item, index) in detailData.imageUrlList" :key="item.url" v-loading="item.load"
              element-loading-background="#F8F8F8">
              <div class="image-item">
                <img @load="mainImageLoaded(item, index + 1)" :ref="`main-${index + 1}`"
                  :class="'card-image ' + `main-${index + 1}`" :src="item.url" />
                <div class="magnifier-move" :ref="`move-${index + 1}`"></div>
              </div>
            </el-carousel-item>
          </el-carousel>
          <div :class="`magnifier-preview`" ref="preview-container"></div>
        </div>
        <div class="message-container">
          <div class="data-type">{{ detailData.goodsType }}</div>
          <div class="data-title">{{ detailData.title }}</div>
          <div class="is-heart" @click="heartClick(detailData)">
            <template v-if="!detailData.heart">
              <img src="../../../assets/image/home/heart.png" alt="">
              <span>添加收藏</span>
            </template>
            <img v-else src="../../../assets/image/dataBase/heart-red.png" alt="">
          </div>
          <div style="padding:20px 0;display: flex;gap: 10px;flex-direction: column;border-top: 1px solid #ECECEC;">
            <div class="license-type">
              <span>许可类型：</span>
              <span>{{ getMappingValue(detailData.licenseType) }}</span>
              <img src="../../../assets/image/home/question.png" :title="getMappingPoint(detailData.licenseType)">
            </div>
            <div class="price">￥{{ detailData.price }}</div>
          </div>
          <div class="btns">
            <div class="btn-buy" @click="buyGoods">立即购买</div>
            <div class="btn-push" @click="pushCard">加入购物车</div>
          </div>
          <div class="shopping-wh">
            <div>产品尺寸</div>
            <div>横向重复:<span>{{ detailData.unitWidth }} 英寸</span></div>
            <div>纵向重复:<span>{{ detailData.unitHeight }} 英寸</span></div>
            <div>最大花朵直径约为 {{ detailData.flowerMaxWidth }} 英寸</div>
          </div>
          <div class="other-goods">
            <div class="el-carousel-option">
              <div>其他颜色</div>
              <div class="el-carousel-btn">
                <img class="el-carousel-btn-left hover" src="../../../assets/image/dataDetail/btn-left.png"
                  @click="$refs.carousel.prev()" />
                <img class="el-carousel-btn-right hover" src="../../../assets/image/dataDetail/btn-right.png"
                  @click="$refs.carousel.next()" />
              </div>
            </div>
            <el-carousel :autoplay="false" arrow="always" trigger="click" height="110px" ref="carousel">
              <el-carousel-item v-for="(sum, index) in Math.ceil(detailData.otherProducts.length / 3)" :key="sum">
                <img class="small hover" v-for="item in detailData.otherProducts.slice(index * 3, sum * 3)"
                  :key="item.id" :src="item.coverImageUrl" @click="toDetail(item)" />
              </el-carousel-item>
            </el-carousel>
          </div>
        </div>
      </div>
      <div class="maybe-like">
        <div>您可能还喜欢</div>
        <div class="card-grid" v-show="listData.length != 0">
          <div v-for="(itemData, index) in listData" :key="index" :ref="`card-${index}`" class="card-item">
            <el-image @load="imageLoaded(itemData, `card-${index}`)" @error="imageLoaded(itemData, `card-${index}`)"
              :src="itemData.url" @click="toDetail(itemData)">
            </el-image>
            <div class="heart" @click="heartClick(itemData)">
              <img v-show="itemData.heart === false" src="../../../assets/image/dataBase/heart.png">
              <img v-show="itemData.heart === true" src="../../../assets/image/dataBase/heart-red.png">
            </div>
          </div>
        </div>
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
      // 详情数据
      detailData: {
        coverImageUrl: "",
        imageUrlList: [],
        goodsType: "",
        title: "",
        heart: true,
        licenseType: 0,
        price: 0,
        unitWidth: "",
        unitHeight: "",
        flowerMaxWidth: "",
        otherProducts: []
      },
      // 页面加载状态
      loading: false,
      // 版权对应的映射
      licenseTypeOptions: [
        { label: "版权", value: 1, point: "问号中的提示" }
      ]
    };
  },
  methods: {
    // 更新数据
    toDetail(itemData) {
      this.$router.push(`detail?id=${itemData.id}&searchConfigJSON=${JSON.stringify(this.$refs.search.searchConfig)}`).catch(err => console.log('正常的同路由跳转报错'))
      this.getDetailData(itemData.id)
    },
    // 获取证书类型的映射值
    getMappingValue(value) {
      return this.licenseTypeOptions.filter(i => i.value == value)[0]?.label
    },
    getMappingPoint(value) {
      return this.licenseTypeOptions.filter(i => i.value == value)[0]?.point
    },
    // 主图加载完成回调
    mainImageLoaded(item, refNameIndex) {
      // 获取图片宽高
      const img = document.createElement('img')
      img.src = item.url
      img.addEventListener('load', () => {
        const el = this.$refs[`main-${refNameIndex}`][0]
        const preview = this.$refs["preview-container"]
        const move = this.$refs[`move-${refNameIndex}`][0]
        // 确定图片展示模式
        const isHeight = img.height >= img.width
        el.style[isHeight ? 'height' : 'width'] = '100%'
        // 关闭加载
        item.load = false
        // 加载完成创建放大镜
        {
          // 初始化放大镜宽高
          const magnifierWidth = 200
          const magnifierHeight = 200
          move.style.width = magnifierWidth + 'px'
          move.style.height = magnifierHeight + 'px'
          // 计算偏移量
          let offsetX = (1000 - el.clientWidth) / 2
          let offsetY = (800 - el.clientHeight) / 2
          // 给el的容器添加move事件
          el.addEventListener('mousemove', (e) => {
            move.style.display = "block"
            // 获取鼠标在容器中的定位,加上偏移量
            let x = e.offsetX + offsetX;
            let y = e.offsetY + offsetY;
            // 设置最大边距
            (x > offsetX + (el.clientWidth - magnifierWidth / 2)) && (x = offsetX + el.clientWidth - magnifierWidth / 2);
            (y > offsetY + (el.clientHeight - magnifierHeight / 2)) && (y = offsetY + el.clientHeight - magnifierHeight / 2);
            (x < offsetX + (magnifierWidth / 2)) && (x = offsetX + magnifierWidth / 2);
            (y < offsetY + (magnifierHeight / 2)) && (y = offsetY + magnifierHeight / 2);
            // 移动move模块
            move.style.left = (x - magnifierWidth / 2) + 'px'
            move.style.top = (y - magnifierHeight / 2) + 'px'
            // console.log(x, y)
            // 计算比例,只考虑正方形
            let ratio = (preview.clientWidth / move.clientWidth)
            // 去掉偏移量,还原真实x,y
            x = x - offsetX - magnifierWidth / 2
            y = y - offsetY - magnifierHeight / 2
            // 给preview模块设置图片位置
            preview.style.backgroundPosition = `-${ratio * x}px -${ratio * y}px`
            preview.style.backgroundSize = `${el.clientWidth * ratio}px ${el.clientHeight * ratio}px`
            // 容器贴合图片
            // 先还原
            preview.style.right = -(preview.clientWidth) + "px"
            preview.style.top = '0px'
            preview.style[isHeight ? 'right' : 'top'] = (isHeight ?
              -(preview.clientWidth - (el.parentNode.clientWidth - el.clientWidth) / 2) : (el.parentNode.clientHeight - el.clientHeight) / 2) + 'px'
            // 显示预览
            preview.style.backgroundImage = `url(${item.url})`
            preview.style.display = 'block'
            // console.log(preview.style.backgroundImage)
          })
          el.addEventListener('mouseleave', (e) => {
            move.style.display = "none"
            preview.style.display = 'none'
          })

        }
      })
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
        this.listData.forEach((itemData, index) => {
          const el = this.$refs[`card-${index}`][0]
          const rows = Math.ceil(el.clientHeight / 5) + 2
          el.style.gridRowEnd = `span ${rows}`
        })
      })
    },
    // 携带查询参数前往查询页面
    getListData() {
      this.$router.push({ path: "list", query: { searchConfigJSON: JSON.stringify(this.$refs.search.searchConfig) } })
    },
    // 获取分类配置
    getTypeOptions() { },
    // 获取排序配置
    getSortOptions() { },
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
    },
    getLikeList() { },
    // 获取详情数据
    getDetailData(id) {
      // 当前id
      id = id || this.$route.query.id
      // 开启加载
      this.loading = true
      // 通过query中的id查询详情数据
      setTimeout(() => {
        // 假数据
        const responese = {
          coverImageUrl: "https://images.pexels.com/photos/17827718/pexels-photo-17827718.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
          imageUrlList: [
            { url: "https://images.pexels.com/photos/18069291/pexels-photo-18069291.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500" },
            { url: "https://images.pexels.com/photos/29078812/pexels-photo-29078812.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500" },
            { url: "https://images.pexels.com/photos/29492073/pexels-photo-29492073.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500" },
            { url: "https://images.pexels.com/photos/17827718/pexels-photo-17827718.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500" }
          ],
          goodsType: "抽象/花卉",
          title: "哥特花园迷惑的花朵",
          heart: true,
          licenseType: 1,
          price: 236,
          unitWidth: "12.0",
          unitHeight: "12.0",
          flowerMaxWidth: "2.5",
          otherProducts: [
            { id: 1, coverImageUrl: 'https://cdn.pixabay.com/photo/2024/04/04/12/26/ai-generated-8675021_640.png' },
            { id: 2, coverImageUrl: 'https://cdn.pixabay.com/photo/2024/12/17/21/38/women-9273917_640.jpg' },
            { id: 3, coverImageUrl: 'https://cdn.pixabay.com/photo/2024/12/12/18/07/bird-9263496_640.jpg' },
            { id: 4, coverImageUrl: 'https://cdn.pixabay.com/photo/2024/11/22/13/53/pinecone-9216518_640.jpg' },
            { id: 5, coverImageUrl: 'https://cdn.pixabay.com/photo/2024/12/17/23/47/christmas-9274028_640.jpg' },
            { id: 6, coverImageUrl: 'https://cdn.pixabay.com/photo/2024/12/17/01/30/couple-9271968_640.png' },
            { id: 7, coverImageUrl: 'https://cdn.pixabay.com/photo/2024/12/14/00/22/greeting-card-9266363_640.jpg' },
          ],
          maybeLike: [
            { url: "https://cdn.pixabay.com/photo/2024/12/18/23/30/red-9276345_640.jpg", heart: false },
            { url: "https://cdn.pixabay.com/photo/2024/12/05/11/17/fishing-9246364_640.jpg", heart: false },
            { url: "https://cdn.pixabay.com/photo/2019/04/10/11/56/watercolor-4116932_640.png", heart: false },
            { url: "https://cdn.pixabay.com/photo/2015/12/01/20/28/road-1072823_640.jpg", heart: false },
            { url: "https://cdn.pixabay.com/photo/2017/05/09/03/46/alberta-2297204_640.jpg", heart: false },
            { url: "https://cdn.pixabay.com/photo/2024/12/13/06/48/ai-generated-9264303_640.jpg", heart: false },
            { url: "https://cdn.pixabay.com/photo/2024/03/04/14/17/ai-generated-8612487_640.jpg", heart: false },
            { url: "https://cdn.pixabay.com/photo/2024/12/17/09/06/winter-9272510_640.jpg", heart: false },
            { url: "https://cdn.pixabay.com/photo/2018/09/23/18/30/drop-3698073_640.jpg", heart: false },
            { url: "https://cdn.pixabay.com/photo/2016/10/18/21/22/beach-1751455_640.jpg", heart: false },
          ]
        }
        // 无论成功失败，关闭加载
        this.loading = false
        let detail = responese
        // 对需要放大处理的图片做本地化处理
        const img = document.createElement('img')
        detail.imageUrlList.some(i => {
          img.src = i.url
          i.load = !img.complete
        })
        // "猜你喜欢" 每个不同通过详情返回，或者 getLikeList 方法返回固定的数据，数据格式和列表相同
        const maybeLike = detail.maybeLike
        // maybeLike 初始化
        maybeLike.some(i => {
          img.src = i.url
          i.load = !img.complete
        })
        this.listData = maybeLike
        this.detailData = detail
      }, 1000)
    },
    // 购买
    buyGoods() { },
    // 加入购物车
    pushCard() { }
  },
  watch: {},
  mounted() {
    // 如果有携带的 searchConfigJSON 就读取
    if (this.$route.query.searchConfigJSON) {
      this.$refs.search.searchConfig = JSON.parse(this.$route.query.searchConfigJSON)
    }
    this.getDetailData()
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
  padding-top: 20px;

  &::-webkit-scrollbar {
    width: 0;
  }

  .dataDetail {
    margin: 0 auto;
    display: flex;
    gap: 30px;

    .image-container {
      width: 1000px;
      height: 800px;
      background-color: #F8F8F8;
      position: relative;
      border-radius: 10px;

      .magnifier-preview {
        position: absolute;
        background-color: #C5BAB1;
        top: 0;
        width: 400px;
        height: 400px;
        right: -400px;
        display: none;
        background-repeat: no-repeat;
      }

      .el-carousel {
        /deep/ .el-carousel__indicators--horizontal {
          display: none;
        }

        /deep/ .el-carousel__arrow {
          width: 60px;
          height: 60px;
          background-color: #FFFFFF;
          color: #7E7E8D;
          font-size: 18px;
          color: black;
          box-shadow: 0 4px 16px 0 rgba(0, 0, 0, 0.16);
        }

        /deep/ .el-carousel__arrow:active {
          box-shadow: none;
          margin-top: 2px;
        }

        .el-carousel__item {

          .image-item {
            height: 100%;
            position: relative;
            display: flex;
            justify-content: center;
            align-items: center;

            .card-image {
              cursor: move;
            }

            .magnifier-move {
              position: absolute;
              background-color: rgba(83, 168, 255, 0.5);
              display: none;
              pointer-events: none;
            }
          }
        }
      }
    }

    .message-container {
      width: 370px;
      font-weight: 400;
      text-align: left;
      display: flex;
      flex-direction: column;
      gap: 20px;
      font-size: 18px;
      line-height: 24px;

      .data-type {
        font-size: 16px;
      }

      .data-title {
        font-size: 32px;
        line-height: 36px;
      }

      .is-heart {
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 10px;
        height: 30px;

        img {
          height: 24px;
        }
      }

      .license-type {
        height: 36px;
        display: flex;
        align-items: center;
        gap: 6px;

        img {
          height: 16px;
          cursor: pointer;
        }
      }

      .price {
        font-size: 44px;
        font-family: Lato;
        color: #DF3939;
        line-height: 48px;
        font-weight: 500;
      }

      .btns {
        gap: 10px;
        display: flex;
        flex-direction: column;

        >div {
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 6px;
          width: 100%;
          height: 60px;
          font-weight: 700;
          box-sizing: border-box;
          cursor: pointer;
        }

        .btn-buy {
          background-color: #3D3D51;
          color: white;
        }

        .btn-push {
          background-color: #FBF8F4;
          color: black;
          border: 1px solid #D9D2CD;
        }
      }

      .shopping-wh {
        padding: 20px 10px 0 10px;
        border-top: 1px solid #ECECEC;

        >div:nth-child(1) {
          font-size: 24px;
          margin-bottom: 10px;
          line-height: 32px;
        }

        >div {
          line-height: 28px;
          font-size: 16px;
        }
      }

      .other-goods {
        padding: 20px 10px 0 10px;
        border-top: 1px solid #ECECEC;

        .el-carousel-option {
          font-size: 24px;
          height: 32px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;

          .el-carousel-btn {
            display: flex;
            gap: 20px;

            >img {
              width: 28px;
              height: auto;
            }
          }
        }

        .el-carousel {
          /deep/ .el-carousel__indicators--horizontal {
            display: none;
          }

          /deep/ .el-carousel__arrow {
            display: none;
          }

          .el-carousel__item {
            display: flex;
            align-items: center;
            gap: 10px;
          }
        }

        .small {
          width: 110px;
          height: 110px;
          object-fit: cover;
          border-radius: 4px;
        }
      }
    }
  }
  .maybe-like{
    margin: 0 auto;
    width: 1420px;
    margin-top: 30px;
    font-size: 28px;
    font-weight: 400;
    .card-grid{
      margin-top: 20px;
    }
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