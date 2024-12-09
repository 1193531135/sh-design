<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: "App",
  mounted() {
    // 全局
  },
  methods: {
    checkVersion() {
      if (process.env.NODE_ENV != 'production') { return true }
      // 获取原来的version
      let versionOld = localStorage.getItem('aiSystem_version')
      fetch(`${location.origin}${location.pathname}version.txt?${new Date().getTime()}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then(res => {
          return res.json()
        })
        .catch(() => 'error')
        .then(val => {
          if (val != 'error') {
            localStorage.setItem('aiSystem_version',val)
            if (versionOld && versionOld != val) { 
              alert('检测到系统更新，点击立即更新')
              location.reload()
            }
          }
        })
    }
  },
  created() {
    this.checkVersion()
    // 五分钟一次轮询检查更新
    setInterval(this.checkVersion, 60 * 1000 * 3)
  }
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: var(--light-color1--);
  font-weight: 600;
  overscroll-behavior: none;
  --dark-bgc1--:#1f2020;
  --dark-bgc2--:#2b2b2b;
  --dark-bgc3--:#3c3c3c;
  --dark-color--:#c7c7c7;
  --light-color1--:#606266;
  --light-color2--:#c7c7c7;
}
</style>
