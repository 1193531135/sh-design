<template>
  <div>
    <div class="conta" :style="'height:' + hei + 'px'">
      <div class="conta2">
        <div class="header">
          <div>System</div>
        </div>
        <div class="input">
          <!-- <div>Account</div> -->
          <input :class="accountError ? 'errorInput' : ''" placeholder="account" v-model="account"
            @focus="accountError = ''" />
        </div>
        <div class="error">{{ accountError }}</div>
        <div class="input">
          <!-- <div>Password</div> -->
          <input :class="passwordError ? 'errorInput' : ''" @focus="passwordError = ''" v-model="password"
            placeholder="password" @keyup.enter="login" type="password" />
        </div>
        <div class="error">{{ passwordError }}</div>
        <el-button class="btn" type="primary" @click="login" :loading="loading">Sign in</el-button>
        <div class="end-con">
          <!-- <div @click="$router.push('/register')">Register</div> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      account: "",
      password: "",
      verify: true,
      accountError: "",
      passwordError: "",
      loading: false
    };
  },
  computed: {
    hei() {
      return this.$store.state.hei;
    }
  },
  methods: {
    async login() {
      if (!this.password) {
        this.passwordError = "Please input password";
      }
      if (!this.account) {
        this.accountError = "Please input account";
      }
      if (!this.account || !this.password) {
        return false;
      }
      // 都存在清掉error
      this.accountError = "";
      this.passwordError = "";
      this.loading = true
      let state = await new Promise(resolve => {
        setTimeout(() => {}, 1000);
      })
      this.loading = false
      if (state) {
        let token = this.password;
        this.$store.commit("modifyData", { name: "token", newdata: token });
        this.localDown(token);
        this.$router.push(this.$store.state.defineNowPath);
      }
    },
    change(val) {
      console.log(val);
    },
    localDown(token) {
      localStorage.setItem("sh-token", token);
    }
  },
  created() { }
};
</script>
<style scoped lang="less">
.conta {
  /* background-color: rgba(50, 65, 87); */
  /* background-color: rgba(0, 0, 0, 0.7); */
  background-color: #fafbfc;
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-repeat: no-repeat, no-repeat;
  background-attachment: fixed, fixed;
  background-size: 368px, 368px;
  background-position: left bottom, right bottom;
}

.conta2 {
  width: 400px;
  background-color: white;
  border-radius: 5px;
  box-sizing: border-box;
  position: relative;
  padding: 50px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.05);
}

.header {
  text-align: center;
  color: rgb(66, 124, 234);
  font-size: 40px;
  display: flex;
  justify-content: center;
  margin-bottom: 30px;
  height: 50px;
}

.header>div {
  position: relative;
}

.header>img {
  margin-right: 10px;
  height: 100%;
}

.error {
  height: 30px;
  color: #f56c6c;
  text-align: left;
  font-size: 12px;
  margin-left: 10px;
  padding-top: 3px;
}

.input {
  width: 100%;
  margin: auto;
  height: 35px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.input>div {
  text-align: left;
  min-width: 80px;
}

.input input {
  width: 100%;
  height: 40px;
  box-sizing: border-box;
  outline: none;
  border: 1px solid rgba(0, 0, 0, 0.15);
  border-radius: 5px;
  padding: 0 15px;
  font-size: 15px;
  /* margin-left: 20px; */
}

.input input:focus {
  border: 1px solid rgb(102, 177, 255) !important;
}

.input input:hover {
  border-color: rgba(0, 0, 0, 0.3);
}

.input input::-webkit-input-placeholder {
  color: rgba(0, 0, 0, 0.2);
}

.btn {
  width: 100%;
  height: 40px;
  color: white;
  font-weight: 700;
}

.end-con {
  color: #409eff;
  font-size: 12px;
  display: flex;
  flex-direction: row-reverse;
  width: 80%;
  margin: auto;
  margin-top: 10px;
}

.end-con>div {
  cursor: pointer;
}

@media (prefers-color-scheme: dark) {
  .conta {
    color: var(--dark-color1--);
    background-color: var(--dark-bgc3--);
    /deep/ input{ 
      background-color: var(--dark-bgc3--); 
      color: var(--dark-color1--)
    }
    .conta2 {
      background-color: #4d4d4d !important;
    }

    .content-main {
      .el-loading-mask {
        background-color: rgba(0, 0, 0, .9);
      }
    }
  }
}
</style>