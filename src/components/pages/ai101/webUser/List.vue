<template>
  <div class="list-all">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>User List</el-breadcrumb-item>
    </el-breadcrumb>
    <page-list :tableRander="tableRander" :searchRander="searchRander" headBtnsString=" " ref="listPage" baseUrl=""
      :IdNoShow="true" :getList="getList"></page-list>
  </div>
</template>
<script>
export default {
  data() {
    return {
      pageName: "",
      searchRander: [],
      tableRander: [
        {
          viewName: "User Id",
          modelName: "uid",
          type: "text",
          jump: true,
          jumpFunc:(rowData) => {
            this.$router.push(`userCreateList?uid=${rowData.uid}`)
          },
        },
        {
          viewName: "Create Time",
          modelName: "createTime",
        },
      ],
    };
  },
  methods: {
    getList(config) {
      return new Promise(resolve => {
        this.$request("/ai101/webuser/page", config, res => {
          resolve(res)
        }, 'get',false,false)
      })
    }
  }
};
</script>

<style scoped>
.list-all>>>.func-btns {
  display: none;
}

.list-all>>>.all {
  min-width: 0;
}

.list-all {
  overflow: auto;
}
.el-breadcrumb{
  margin: 10px;
}
</style>