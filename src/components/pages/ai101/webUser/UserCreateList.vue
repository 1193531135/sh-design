<template>
  <div class="list-all">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item to="list">User List</el-breadcrumb-item>
      <el-breadcrumb-item>{{ $route.query.uid }}</el-breadcrumb-item>
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
          viewName: "Name",
          modelName: "name",
          type: "text",
          jump: true,
          jumpFunc:(rowData) => {
            const router = this.$route.query.uid
            this.$router.push(`userDetail?uid=${router}&&id=${rowData.id}`)
          },
        },
        {
          viewName: "Id",
          modelName: "id",
          width:100,
        },
        {
          viewName: "Product Id",
          modelName: "productId",
        },
        {
          viewName: "Uid",
          type:"custom",
          custom:() => {
            return this.$route.query.uid
          }
        },
        {
          viewName: "Expected Time",
          modelName: "expectedTime",
        },
        {
          viewName: "Gender",
          modelName: "gender",
        },
        {
          viewName: "Status",
          modelName: "status",
          type:"select",
          options:[ { label:"success",value:2 } ]
        },
      ],
    };
  },
  methods: {
    getList(config) {
      config.uid = this.$route.query.uid
      return new Promise(resolve => {
        this.$request("/ai101/webpack/list", config, res => {
          res.data.data.list = res.data.data
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
.list-all>>>.el-pagination{
  display: none;
}
</style>