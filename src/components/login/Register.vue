<template>
  <div class="login-container-2">
    <div class="titles">
      <div>新用户注册</div>
    </div>
    <div class="form">
      <template>
        <div class="form-item" :class="errorText.account ? 'error-item' : ''">
          <el-input v-model="registerCommit.account" placeholder="请输入账号名"></el-input>
          <div class="errorText">{{ errorText.account }}</div>
        </div>
        <div class="form-item" :class="errorText.pwd ? 'error-item' : ''">
          <el-input v-model="registerCommit.pwd" type="password" placeholder="请输入登录密码"></el-input>
          <div class="errorText">{{ errorText.pwd }}</div>
        </div>
        <div class="form-item" :class="errorText.checkPwd ? 'error-item' : ''">
          <el-input v-model="checkPwd" type="password" placeholder="再次输入密码" @blur="pwdCheck" @focus="errorText.checkPwd = ''"></el-input>
          <div class="errorText">{{ errorText.checkPwd }}</div>
        </div>
        <div class="form-item" :class="errorText.phone ? 'error-item' : ''">
          <el-input v-model="registerCommit.phone" placeholder="输入手机号"></el-input>
          <div class="errorText">{{ errorText.phone }}</div>
        </div>
        <div class="form-item" :class="errorText.code ? 'error-item' : ''">
          <div class="checkCode">
            <el-input v-model="registerCommit.code" placeholder="输入验证码"></el-input>
            <div class="checkCode-code hover" @click="timeStart">{{ time || "发送" }}</div>
          </div>
          <div class="errorText">{{ errorText.code }}</div>
        </div>
      </template>
      <div class="agree-text"> <el-checkbox v-model="agree"></el-checkbox> 我已阅读并同意 <span>用户协议</span>、 <span>隐私政策</span>、
        <span>产品服务协议</span>
      </div>
      <div class="login-button hover" @click="register">注册</div>
      <div class="login-option">
        <div class="hover">忘记账号名</div>
        <div class="hover">找回密码</div>
      </div>
      <div class="endText">
        <div>已有账号？</div>
        <div class="hover" @click="$router.push('login')">立即登录</div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      time: 0,
      agree: false,
      checkPwd: "",
      errorText: {
        account: "",
        pwd: "",
        checkPwd: "",
        phone: "",
        code: "",
      },
      registerCommit: {
        account: "",
        pwd: "",
        phone: "",
        code: "",
      },
    }
  },
  methods: {
    pwdCheck() {
      console.log(1)
      console.log(this.checkPwd,this.registerCommit.pwd)
      if (this.checkPwd !== this.registerCommit.pwd) {
        this.errorText.checkPwd = "两次密码不一致"
      } else {
        this.errorText.checkPwd = ""
      }
    },
    timeStart() {
      let statr = null
      if (this.time === 0) {
        // 发送获取验证码请求
        // request()
        // 计时逻辑
        this.time = 60;
        statr = setInterval(() => {
          this.time -= 1;
          if (this.time <= 0) {
            clearInterval(statr)
          }
        }, 1000)
      }
    },
    register(){
      // 用户名未输入
      if (!this.registerCommit.account) {
        this.errorText.account = "请输入账号名"
        return true
      }
    }
  }
}
</script>
<style scoped lang="less">
.login-container-2 {
  width: 460px;
  padding: 10px 20px;
  color: #7E7E8D;

  .titles {
    display: flex;
    padding: 10px 0;
    font-size: 26px;
    gap: 40px;
    line-height: 64px;
    margin-bottom: 18px;
    color: black;
  }

  .form {
    display: flex;
    flex-direction: column;
    gap: 6px;

    .error-item {
      .errorText {
        visibility: visible !important;
      }

      .el-input {
        /deep/ input {
          border-color: #DF3939 !important;
        }
      }
    }

    .form-item {
      font-weight: 400;

      .errorText {
        color: #DF3939;
        font-size: 14px;
        height: 16px;
        visibility: hidden;
        margin-top: 4px;
        text-align: left;
      }

      .el-input {
        height: 48px;

        /deep/ input {
          height: 48px;
          border-radius: 8px;
          border-color: #E8E8E8;
        }
      }
    }

    .checkCode {
      display: flex;
      border-collapse: collapse;

      .el-input {
        /deep/ input {
          border-radius: 8px 0 0 8px;
        }
      }

      .checkCode-code {
        color: black;
        width: 112px;
        min-width: 112px;
        justify-content: center;
        align-items: center;
        display: flex;
        background-color: #F3F3F3;
        box-sizing: border-box;
        border: 1px solid #E8E8E8;
        border-left: 0;
        font-weight: 800;
        border-radius: 0 8px 8px 0;
      }
    }

    .agree-text {
      display: flex;
      font-size: 14px;
      line-height: 16px;
      align-items: center;
      height: 18px;

      .el-checkbox {
        padding-top: 5px;
        margin-right: 8px;
      }

      span {
        color: black;
      }
    }

    .login-button {
      background-color: #3D3D51;
      height: 48px;
      border-radius: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      margin: 10px 0;
    }

    .login-option {
      display: flex;
      justify-content: space-between;
      font-size: 16px;
      font-weight: 16px;
    }

    .endText {
      font-size: 16px;
      line-height: 20px;
      margin-top: 40px;
      display: flex;
      gap: 8px;
      justify-content: center;
      align-items: center;
      font-weight: 400;

      >div:nth-child(2) {
        color: black;
        font-weight: 800;
        margin-bottom: 5px;
      }
    }
  }
}
</style>