<template>
  <div class="bgcdiv">
    <div class="tit_text">
      <img src="../../../assets/image/home/logo.png" alt style="padding-left:20px" />
    </div>
    <div class="head-list">
      <div :class="`head-list-item ${headList[item].select ? 'selected' : ''}`" v-for="item in Object.keys(headList)"
        :key="item" @click="$router.push(headList[item].path)">
        <span>{{ headList[item].name }}</span>
      </div>
    </div>
    <div class="head-end">
      <div class="username hover">
        <div class="not-login" v-if="!isLogin">
          <span>注册</span>/<span>登录</span>
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
    </div>
  </div>
</template>

<script>
export default {
  name: "Header",
  data() {
    return {
      isLogin:false,
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
      }
    };
  },
  computed: {
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
      // proj
      let select = ''
      if (path.indexOf('-proj') != -1 || path === '/projectHome-list') {
        select = 'program'
      }
      else if (path === '/accountManage-list' || path.indexOf('accountManage-editor') != -1) {
        select = 'user'
      }
      // 上面已经筛选掉proj和user了所以满足这个正则的都是资源
      else if (/[a-z A-Z 0-9]{1,}-(list|editor)/.test(path)) {
        select = 'resource'
      }
      Object.keys(this.headList).some(item => {
        this.headList[item].select = false
        if (this.headList[item].show === select) {
          this.headList[item].select = true
        }
      })
    },
    selectChange(command) {
      if (command === "toMymessage") {
        this.$router.push("/my-account");
      }
      if (command === "signout") {
        this.$confirm("Are you sure?", "hint", { type: "warning" })
          .then(() => {
            sessionStorage.clear();
            localStorage.removeItem("aiSystem-token");
            // 刷新清内存数据
            this.$router.push("/login");
          })
          .catch(() => { });
      }
    }
  },
  created() {
    let username = localStorage.getItem("username");
    if (username) {
      this.$store.commit("modifyData", {
        name: "username",
        newdata: username
      });
    }
  }
};
</script>

<style scoped>
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
  height: 20px;
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
}

.head-list-item {
  padding: 0 10px;
  cursor: pointer;
  border-left: 1px solid rgba(0, 0, 0, 0.1);
  /* color: #303133; */
}

.head-list-item:nth-child(1) {
  border: 0;
}

.head-list-item>span:hover {
  border-bottom: 1px solid var(--color--);
}

.head-end {
  display: flex;
  justify-content: left;
  color: var(--color2--);
  font-size: 1.95vh;
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
}
</style>