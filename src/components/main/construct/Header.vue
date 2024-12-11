<template>
  <div class="bgcdiv">
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
        <div class="not-login" v-if="!isLogin">
          <span class="head-hover">注册</span>/<span class="head-hover">登录</span>
        </div>
        <el-dropdown v-else @command="selectChange">
          <span class="el-dropdown-link">
            {{ userName
            }}
            <i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <!-- <el-dropdown-item icon="el-icon-user" command="toMymessage">My Account</el-dropdown-item> -->
            <el-dropdown-item icon="el-icon-warning-outline" command="signout">Sign out</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <!-- selectLanguage -->
      <el-dropdown trigger="click" @command="selectLanguage">
        <span class="el-dropdown-link">
          {{ language }}
          <i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <!-- <el-dropdown-item icon="el-icon-user" command="toMymessage">My Account</el-dropdown-item> -->
          <el-dropdown-item v-for="lgItem in languageList" :key="lgItem.value"
            :command="lgItem.value">{{ lgItem.label }}</el-dropdown-item>
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
          path: "",
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
      languageList: [
        { label: "中文", value: "zh" },
        { label: "英语", value: "en" },
      ]
    };
  },
  computed: {
    icon() {
      return this.renderType === "DARK" ? logoWhite : logo
    },
    renderType() {
      return this.$store.state.styleConfig.styleType
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
    }
  },
  methods: {
    headSelectHandle(path) {
      Object.keys(this.headList).some(item => {
        this.headList[item].select = false
        if (this.headList[item].path === path) {
          this.headList[item].select = true
        }
      })
    },
    selectChange(command) {
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
    selectLanguage(command) {
      // 切换语言
      this.language = this.languageList.filter(i => i.value === command)[0].label
    }
  },
  created() {
  }
};
</script>

<style scoped>
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
  justify-content: space-between;
  position: relative;
  z-index: 2;
  padding: 0 20px;
  color: var(--color--);
}

.tit_text {
  font-size: 20px;
  height: 100%;
  display: flex;
  align-items: center;
  box-sizing: border-box;
}

.tit_text img {
  height: 3.8vh;
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
  font-size: 2.53vh;
  gap: 3.9vh;
}

.head-list-item {
  cursor: pointer;
  padding-bottom: 2px;
  border-bottom: 1px solid rgba(0, 0, 0, 0)
  /* color: #303133; */
}

.head-list-item:hover,
.selected 
{
  border-color: var(--color--);
}

.head-end {
  display: flex;
  justify-content: left;
  color: var(--color2--);
  font-size: 1.95vh;
  gap: 3.9vh;
}

.exit {
  margin-right: 20px;
  cursor: pointer;
}

.el-icon-switch-button:active {
  color: red;
}

.el-dropdown {
  background-color: inherit;
  color: inherit;
  font-size: inherit;
}
</style>