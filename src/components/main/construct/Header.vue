<template>
  <div class="bgcdiv" :style="colorRender()">
    <div class="tit_text">
      <img :src="icon" alt style="padding-left:20px" />
    </div>
    <div class="head-list">
      <div :class="`head-list-item ${headList[item].select ? 'selected' : ''}`" v-for="item in Object.keys(headList)"
        :key="item" @click="$router.push(headList[item].path)">
        <span>{{ headList[item].name }}</span>
      </div>
    </div>
    <div class="head-end">
      <div class="username">
        <div class="not-login" v-show="!isLogin">
          <span class="head-hover">注册</span>/<span class="head-hover" @click="simulateLogin">登录</span>
        </div>
        <div class="login-container" v-show="isLogin">
          <img @click="toHeart" v-show="this.renderType !== 'DARK'" src="../../../assets/image/home/heart.png">
          <img @click="toHeart" v-show="this.renderType === 'DARK'" src="../../../assets/image/home/heart-white.png">
          <img @click="toCart" v-show="this.renderType !== 'DARK'" src="../../../assets/image/home/cart.png">
          <img @click="toCart" v-show="this.renderType == 'DARK'" src="../../../assets/image/home/cart-white.png">
          <!-- 用户设置 -->
          <el-dropdown trigger="click" :class="isFocUser ? 'sh-select' : ''" @command="accountSelect"
          placement="bottom-start"
            @visible-change="(val) => isFocUser = val">
            <div class="el-dropdown-link">
              <img v-show="this.renderType !== 'DARK'" src="../../../assets/image/home/account.png" alt="">
              <img v-show="this.renderType == 'DARK'" src="../../../assets/image/home/account-white.png" alt="">
              <img v-show="this.renderType !== 'DARK'" src="../../../assets/image/home/select-down.png" alt="">
              <img v-show="this.renderType == 'DARK'" src="../../../assets/image/home/select-down-white.png" alt="">
            </div>
            <el-dropdown-menu slot="dropdown" class="sh-popuop">
              <el-dropdown-item v-for="item in accountOption" :key="item.value" :command="item.value">{{ item.label
                }}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <!-- 关于 -->
          <el-dropdown trigger="click" :class="isFocError ? 'sh-select' : ''" @command="aboutSelect"
          placement="bottom-start"
            @visible-change="(val) => isFocError = val">
            <div class="el-dropdown-link">
              <img v-show="this.renderType !== 'DARK'" src="../../../assets/image/home/error.png" alt="">
              <img v-show="this.renderType == 'DARK'" src="../../../assets/image/home/error-white.png" alt="">
              <img v-show="this.renderType !== 'DARK'" src="../../../assets/image/home/select-down.png" alt="">
              <img v-show="this.renderType == 'DARK'" src="../../../assets/image/home/select-down-white.png" alt="">
            </div>
            <el-dropdown-menu slot="dropdown" class="sh-popuop">
              <el-dropdown-item v-for="item in aboutOption" :key="item.value" :command="item.value">{{ item.label
                }}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
      <!-- selectLanguage -->
      <el-dropdown trigger="click" :class="isFocLanguage ? 'sh-select' : ''" @command="selectLanguage"
      placement="bottom-start"
        @visible-change="(val) => isFocLanguage = val">
        <div class="el-dropdown-link">
          <div>{{ language }}</div>
          <img v-show="this.renderType !== 'DARK'" src="../../../assets/image/home/select-down.png" alt="">
          <img v-show="this.renderType == 'DARK'" src="../../../assets/image/home/select-down-white.png" alt="">
        </div>
        <el-dropdown-menu slot="dropdown" class="sh-popuop">
          <!-- <el-dropdown-item icon="el-icon-user" command="toMymessage">My Account</el-dropdown-item> -->
          <el-dropdown-item v-for="lgItem in languageList" :key="lgItem.value" :command="lgItem.value">{{ lgItem.label
            }}</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
const logo = require("../../../assets/image/home/logo.png")
const logoWhite = require("../../../assets/image/home/logo-white.png")
export default {
  name: "Header",
  data() {
    return {
      isLogin: false,
      headList: {
        homePage: {
          name: "首页",
          path: "/home/list",
          select: false
        },
        imageBase: {
          name: "素材图库",
          path: "/dataBase/list",
          select: false,
        },
        imageDesign: {
          name: "图案定制",
          path: "",
          select: false,
        },
        designer: {
          name: "设计师",
          path: "",
          select: false,
        }
      },
      language: "中文",
      accountOption: [
        { label: "购买记录", value: "购买记录" },
        { label: "我的优惠", value: "我的优惠" },
        { label: "帮助中心", value: "帮助中心" },
        { label: "退出登录", value: "退出登录" },
      ],
      aboutOption: [
        { label: "隐私与安全", value: "隐私与安全" },
        { label: "关于我们", value: "关于我们" },
      ],
      languageList: [
        { label: "中文", value: "zh" },
        { label: "英语", value: "en" },
      ],
      isFocUser: false,
      isFocError: false,
      isFocLanguage: false,
    };
  },
  computed: {
    icon() {
      return this.renderType === "DARK" ? logoWhite : logo
    },
    // 非home页都为LIGHT
    renderType() {
      return this.path === "/home/list" ? this.$store.state.styleConfig.styleType : "LIGHT"
    },
    userName() {
      return this.$store.state.userData.realName;
    },
    permissions() {
      return this.$store.state.permissionPage;
    },
    path() {
      return this.$route.path
    }
  },
  watch: {
    path: {
      handler(val) {
        val && this.headSelectHandle(val)
      }, immediate: true
    },
  },
  methods: {
    colorRender() {
      const renderMeum = {
        "DARK": "--color--: white;--color2--: white;--color3--: white;--bgcolor--:black;",
        "LIGHT": "--color--: black;--color2--: black;--color3--: #3D3D51;--bgcolor--:white;",
      }
      return renderMeum[this.renderType]
    },
    headSelectHandle(path) {
      Object.keys(this.headList).some(item => {
        this.headList[item].select = false
        if (this.headList[item].path === path) {
          this.headList[item].select = true
        }
      })
    },
    toHeart() { },
    toCart() { },
    accountSelect(command) {
      if (command === "signout") {
        this.$confirm("Are you sure?", "hint", { type: "warning" })
          .then(() => {
            sessionStorage.clear();
            localStorage.removeItem("sh-token");
            // 刷新清内存数据
            this.$router.push("/login");
          })
          .catch(() => { });
      }
    },
    aboutSelect() { },
    selectLanguage(command) {
      // 切换语言
      this.language = this.languageList.filter(i => i.value === command)[0].label
    },
    simulateLogin() {
      this.isLogin = true
    }
  },
  created() {
  }
};
</script>

<style scoped lang="less">
.head-hover:hover {
  border-bottom: 1px solid var(--color--);
  cursor: pointer;
}

.el-icon-switch-button {
  display: none;
}

.el-icon-s-tools {
  display: none;
}

.bgcdiv {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 2;
  color: var(--color--);
}

.tit_text {
  font-size: 20px;
  height: 100%;
  display: flex;
  align-items: center;
  box-sizing: border-box;
  position: absolute;
  left: 0;
}

.tit_text img {
  height: 39px;
  object-fit: contain;
  margin-right: 10px;
  top: -3px;
  position: relative;
}

.img1 {
  height: 45px;
  width: 45px;
  display: block;
  float: left;
  border-radius: 50%;
}

.head-list {
  display: flex;
  font-size: 26px;
  gap: 40px;
  flex: 1;
  justify-content: center;
}

.head-list-item {
  cursor: pointer;
  padding-bottom: 2px;
  border-bottom: 1px solid rgba(0, 0, 0, 0)
    /* color: #303133; */
}

.head-list-item:hover,
.selected {
  border-color: var(--color--);
}

.head-end {
  position: absolute;
  right: 0;
  padding-right: 20px;
  display: flex;
  justify-content: left;
  align-items: center;
  color: var(--color2--);
  font-size: 20px;

  .not-login {
    margin-right: 10px;
    padding: 10px;
  }

  .login-container {
    gap: 10px;
    display: flex;
    align-items: center;
    margin-right: 10px;

    img {
      width: 24px;
    }

    >img {
      padding: 10px;
    }

    .el-dropdown {
      padding: 10px;
    }
  }
}

.exit {
  margin-right: 20px;
  cursor: pointer;
}

.el-icon-switch-button:active {
  color: red;
}

.el-dropdown {
  padding: 10px;
  color: inherit;
  border-radius: 30px;
  font-size: 20px;
  cursor: pointer;

  .el-dropdown-link {
    display: flex;
    align-items: center;

    img {
      width: 24px;
    }
  }
}
</style>