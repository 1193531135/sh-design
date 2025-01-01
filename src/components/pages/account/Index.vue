<template>
  <div class="account-container">
    <div style="min-height: var(--head-height);"></div>
    <div class="account-content">
      <div class="account-list">
        <el-menu default-active="2" class="el-menu-vertical-demo" background-color="#545c64" text-color="#fff"
          active-text-color="#ffd04b">
          <el-submenu index="1">
            <template slot="title">
              <span>订单中心</span>
            </template>
            <el-menu-item v-for="item in orderConfig" :key="item.title" :index="item.title">{{ item.title
              }}</el-menu-item>
          </el-submenu>
          <el-submenu index="2">
            <template slot="title">
              <span>订单中心</span>
            </template>
            <el-menu-item v-for="item in orderConfig" :key="item.title" :index="item.title">{{ item.title
              }}</el-menu-item>
          </el-submenu>
        </el-menu>
      </div>
      <router-view class="account-page"></router-view>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      orderConfig: [
        { title: "我的订单", router: "" },
        { title: "收货地址", router: "" },
      ],
      active: 0
    }
  },
  computed: {
    path() {
      return this.$route.path
    }
  },
  watch: {
    path(val) {
      if (val == '/shopping-cart/card') {
        this.active = 0
      } else if (val == '/shopping-cart/order-input') {
        this.active = 1
      } else {
        this.active = 2
      }
    }
  }
}
</script>
<style scoped lang="less">
.account-container {
  background-color: white;
  display: flex;
  flex-direction: column;
  font-weight: 400;
}

.account-content {
  background-color: #F8F8F8;
  padding-top: 1px;
  display: flex;
  flex: 1;

  .account-list {
    width: 320px;
    min-width: 320px;
    text-align: left;
    padding: 30px;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    .el-menu{
      border-radius: 10px;
      overflow: hidden;
      .el-submenu{ 
        font-size: 18px;
        /deep/ .el-submenu__title{ font-size: inherit; }
       }
      .el-menu-item{font-size: 16px;}
    }
  }

  .account-page {
    flex: 1;
  }
}
</style>