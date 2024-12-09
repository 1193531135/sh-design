<template>
  <div class="bgcdiv">
    <div class="tit_text">
      <!-- <img src="../../../assets/lion.png" alt style="padding-left:20px" /> -->
      <span>AI System</span>
    </div>
    <div class="head-ll">
      <div class="user">
        <!-- <img class="img1" :src="headeimg" /> -->
        <div class="username hover">
          <el-dropdown @command="selectChange">
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
        <!-- <div class="exit" @click="signOut">
                <p class="swicth_1">Logout</p>
                <i class="el-icon-switch-button"></i>
        </div>-->
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Header",
  data() {
    return {
      headeimg: require("../../../assets/default_head.jpg"),
      headList: {
        // firstPage: {
        //   name: "Home",
        //   path: "/main",
        //   show: true
        // },
        programPage: {
          name: "APP Project",
          path: "/projectHome-list",
          show: "program",
          select: false
        },
        resourcePage: {
          name: "Basic Resource",
          // 资源管理默认跳转到animation
          path: "/operationRecord-list",
          show: "resource",
          select: false,
        },
        accountPage: {
          name: "User Account",
          path: "/accountManage-list",
          show: "user",
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
  height: 50px;
  min-height: 50px;
  width: 100%;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
  position: relative;
  z-index: 2;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  padding: 0 20px;
}

.bgcdiv>div {
  /* color: white; */
}

.head-ll {
  flex: 8.5;
  display: flex;
  justify-content: left;
}

.tit_text {
  flex: 1.5;
  font-size: 20px;
  height: 100%;
  display: flex;
  align-items: center;
  box-sizing: border-box;
  color: #409eff;
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
  flex: 6;
}

.head-list-item {
  padding: 0 10px;
  cursor: pointer;
  border-left: 1px solid rgba(0, 0, 0, 0.1);
  /* color: #303133; */
  color: #606266;
  font-size: 14px;
}

.head-list-item:nth-child(1) {
  border: 0;
}

.head-list-item>span:hover {
  color: #409eff;
  border-bottom: 1px solid #409eff;
}

.selected {
  color: #409eff;
}

.user {
  /* width: 200px; */
  font-size: 14px;
  flex: 2;
  display: flex;
  justify-content: right;
  align-items: center;
  margin-right: 20px;
}

.exit {
  margin-right: 20px;
  cursor: pointer;
}

.el-icon-switch-button:active {
  color: red;
}

.username {
  margin: 0 30px 0 15px;
}

.el-dropdown {
  background-color: inherit;
}
</style>