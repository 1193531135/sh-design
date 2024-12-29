<template>
  <div class="login-container-2">
    <div class="titles">
      <div class="hover" @click="isPhone = true" :class="isPhone ? 'title-focus' : ''">手机号登录</div>
      <div class="hover" @click="isPhone = false" :class="isPhone ? '' : 'title-focus'">账号登录</div>
    </div>
    <div class="form">
      <template v-if="isPhone">
        <div class="form-item">
          <el-input v-model="phoneCommit.phone" placeholder="输入手机号"></el-input>
        </div>
        <div class="form-item checkCode">
          <el-input v-model="phoneCommit.code" placeholder="输入验证码"></el-input>
          <div class="checkCode-code hover" @click="timeStart">{{ time || "获取验证码" }}</div>
        </div>
      </template>
      <template v-else>
        <div class="form-item">
          <el-input v-model="accountCommit.account" placeholder="请输入账号名"></el-input>
        </div>
        <div class="form-item">
          <el-input v-model="accountCommit.pwd" type="password" placeholder="请输入登录密码"></el-input>
        </div>
      </template>
      <div class="agree-text" v-show="isPhone"> <el-checkbox v-model="agree"></el-checkbox> 我已阅读并同意 <span>用户协议</span>、 <span>隐私政策</span>、 <span>产品服务协议</span></div>
      <div class="login-button hover">登录</div>
      <div class="login-option" v-show="!isPhone">
        <div class="hover">忘记账号名</div>
        <div class="hover">找回密码</div>
      </div>
      <div class="divider">其他登录方式</div>
      <div class="login-icon">
        <img class="hover" src="../../assets/image/home/qq.png" alt="">
        <img class="hover" src="../../assets/image/home/wx.png" alt="">
      </div>
      <div class="endText">
        <div>还没有账号？</div>
        <div class="hover" @click="$router.push('register')">立即注册</div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      isPhone: true,
      time: 0,
      agree: false,
      phoneCommit:{
        phone:"",
        code:"",
      },
      accountCommit:{
        account:"",
        pwd:""
      }
    }
  },
  methods: {
    timeStart() {
      let statr = null
      if (this.time === 0) {
        this.time = 60;
        statr = setInterval(() => {
          this.time -= 1;
          if (this.time <= 0) {
            clearInterval(statr)
          }
        }, 1000)
      }
    }
  }
}
</script>
<style scoped lang="less">
.login-container-2 {
  width: 460px;
  height: 540px;
  padding: 10px 20px;
  color: #7E7E8D;
  .titles {
    display: flex;
    padding: 10px 15px;
    font-size: 22px;
    gap: 40px;
    line-height: 44px;
    margin-bottom: 18px;

    >div {
      border-bottom: 1px solid white;
    }

    .title-focus {
      color: #000000;
      border-color: black;
    }
  }

  .form {
    display: flex;
    flex-direction: column;
    gap: 6px;

    .form-item {
      font-weight: 400;
      .el-input {
        height: 48px;
        /deep/ input {
          height: 48px;
          border-radius: 8px;
          border-color: #E8E8E8;
        }
      }

      margin-bottom: 20px;
    }

    .checkCode {
      display: flex;
      border-collapse: collapse;
      .el-input{
        /deep/ input{
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
        border-radius:0 8px 8px 0;
      }
    }
    .agree-text{
      display: flex;
      font-size: 14px;
      line-height: 16px;
      align-items: center;
      height: 18px;
      .el-checkbox{
        padding-top: 5px;
        margin-right: 8px;
      }
      span{ color: black; }
    }
    .login-button{
      background-color: #3D3D51;
      height: 48px;
      border-radius: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      margin: 10px 0;
    }
    .login-option{
      display: flex;
      justify-content: space-between;
      font-size: 16px;
      font-weight: 16px;
    }
    .divider{
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 14px;
      font-weight: 400;
      margin: 10px 0;
      &::before,&::after{ 
        height: 1px;flex: 1;background-color: #E8E8E8; 
        content: "";
      }
    }
    .login-icon{
      margin-top: 10px;
      display: flex;
      gap: 50px;
      justify-content: center;
      img{
        width: 48px;
      }
    }
    .endText{
      font-size: 16px;
      line-height: 20px;
      margin-top: 40px;
      display: flex;
      gap: 8px;
      justify-content: center;
      align-items: center;
      font-weight: 400;
      > div:nth-child(2){ 
        color: black;font-weight: 800;
        margin-bottom: 5px;
       }
    }
  }
}
</style>