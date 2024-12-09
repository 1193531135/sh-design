<template>
  <div class="home-main" v-loading="loading" element-loading-text="Loading..." element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(255, 255, 255, 0.5)">
    <headers class="home-head"></headers>
    <!-- <div class="swicth_home_1"></div> -->
    <div class="home-body" v-if="isLoaded">
      <list class="home-list" :renderListdom="randerArray">
      </list>
      <div class="home-nowpage">
        <tabs class="tabs"></tabs>
        <!-- <div class="home-con" :style="'min-height:'+hei+'px;'"> -->
        <div class="home-con">
          <transition name="page-transition">
            <router-view class="page-con" />
          </transition>
        </div>
        <!-- <div class="movecon" :style="'height:'+hei+'px'" @click="showlistbtn = false">
                    <router-view />
        </div>-->
      </div>
    </div>
  </div>
</template>

<script>
import headers from "./construct/Header.vue";
import list from "./construct/List.vue";
import tabs from "./construct/Tabs.vue";
export default {
  name: "Home",
  components: { list, headers, tabs },
  data() {
    return {
      hei: null,
      hideBtn: false,
      showlistbtn: false,
      resourceShow: true,
      randerArray: [],
      // 防止一些页面逻辑在全局数据加载之前就初始化了
      isLoaded: true,
      loading: false
    };
  },
  computed: {
    nowPath() {
      return this.$route.path;
    },
    permission() {
      return this.$store.state.permissionPage;
    },
    projectMenu() {
      return this.$store.state.projectMenu;
    }
  },
  watch: {
    nowPath: {
      handler(val) {
        let state = false;
        // 控制不展示侧边栏的路径
        let formatArray = [
          "accountManage",
          "projectHome-",
          "my-account",
          "main"
        ];
        formatArray.some(item => {
          if (val.indexOf(item) != -1) {
            state = true;
          }
        });
        this.hideBtn = state;
        this.nowPathChange(val);
      },
      immediate: true
    }
  },
  methods: {
    // // 通过权限和菜单栏控制 项目list列表 和 资源list列表 中模块的显隐
    nowPathChange(val) {
    },
    showlist() {
      this.showlistbtn = !this.showlistbtn;
    },
    // 初始化list渲染的所有节点
    listDomRender() {
      let op = this.$router.options.routes;
      let container = [];
      op.some(item => {
        item.meta && item.meta === "start" && (container = item.children);
      });
      this.randerArray = container;
      // 手动调用第一次nowpage的change
      this.nowPathChange(this.nowPath);
    },
    fieldToLocal(obj) {
      if (obj.read) {
        obj.view = true;
      }
      if (obj.update) {
        obj.editor = true;
      }
      if (obj.del) {
        obj.delete = true;
      }
      Object.keys(obj).some(item => {
        if (typeof obj[item] === "object") {
          this.fieldToLocal(obj[item]);
        }
      });
    },
    toHump(string) {
      return string.replace(/_([a-z])/g, (all, val) => val.toUpperCase());
    },
    Permission() {
      let obj = {};
      obj.view = false;
      obj.add = false;
      obj.editor = false;
      obj.delete = false;
      return obj;
    }
  },
  async created() {
    this.hei = this.$store.state.hei - 80; //get page height
    if (this.$store.state.wid < 769) {
      this.hei = this.$store.state.hei - (this.$store.state.wid / 20) * 3.4;
    }
    let path = this.$route.path;
    this.$store.state.allDom.some(item => {
      if (item.path === path) {
        this.$store.commit("modifyData", {
          name: "showDom",
          newdata: [item]
        });
        return true;
      }
    });
    this.listDomRender();
  },
  mounted() {
    document.body.addEventListener(
      "touchmove",
      function (e) {
        e.preventDefault(); //阻止默认的处理方式(阻止下拉滑动的效果)
      },
      { passive: false }
    );
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.swicth_home_1 {
  height: 15px;
  width: 100%;
}


.home-main {
  background-color: rgb(247, 247, 247);

  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  flex-direction: column;
  .home-head{
    background-color: inherit;
  }
  .home-body {
    /* min-width: 1524px; */
    position: relative;
    display: flex;
    flex: 1;

    .home-list {
      flex: 1.5;
    }

    .home-nowpage {
      flex: 8.5;
      box-sizing: border-box;
      overflow-y: auto;
      position: relative;
      display: flex;
      flex-direction: column;

      .tabs {
        display: none;
      }


      .home-con {
        overflow: hidden;
        overflow-y: auto;
        flex: 1;
        position: relative;
        margin: 6px 6px 12px 6px;

        .page-con {
          /* border: 1px solid rgba(0, 0, 0, 0.05); */
          position: absolute;
          left: 0;
          right: 0;
          top: 0;
          bottom: 0;
          /* overflow-y: auto; */
          display: flex;
          flex-direction: column;
        }
      }
    }
  }
}


.movecon {
  display: none;
  overflow: auto;
}

@media (prefers-color-scheme: light) {
  .home-main {
    color: var( --light-color1--);
    background-color: white
  }
}

@media (prefers-color-scheme: dark) {
  .home-main {
    color: var(--dark-color--);
    background-color: var(--dark-bgc1--);
    .home-body{
      background-color: var(--dark-bgc2--);
    }
    .home-list{
      background-color: var(--dark-bgc3--);
    }
  }
}
</style>
