<template>
  <div class="card-container">
    <div style="margin: 20px 0;font-size: 22px;line-height: 34px;">商品信息</div>
    <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 1380px"
      @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="186">
      </el-table-column>
      <el-table-column label="商品" width="480">
        <template slot-scope="scope">{{ scope.row.date }}</template>
      </el-table-column>
      <el-table-column label="许可类型" width="182">
      </el-table-column>
      <el-table-column label="价格" width="156">
      </el-table-column>
      <el-table-column label="操作">
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
export default {
  data() {
    return {
      tableData: [
        {
          id: 1,
          coverImage: "https://images.pexels.com/photos/18069291/pexels-photo-18069291.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
          sum: 1,
          licenseType: 1,
          price: 236,
        },
        {
          id: 2,
          coverImage: "https://images.pexels.com/photos/18069291/pexels-photo-18069291.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
          sum: 1,
          licenseType: 1,
          price: 456,
        },
      ],
      licenseTypeOptions: [
        { label: "版权", value: 1, point: "问号中的提示" }
      ]
    }
  },
  methods: {
    // 获取证书类型的映射值
    getMappingValue(value) {
      return this.licenseTypeOptions.filter(i => i.value == value)[0]?.label
    },
  }
}
</script>
<style scoped lang="less">
.card-container {
  margin: 20px auto 0;
  text-align: left;
}

.el-table {
  font-size: 18px;

  /deep/ .el-checkbox__input {

    .el-checkbox__inner {
      width: 32px;
      height: 32px;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 4px;
      border-color: #3D3D51;
      &::after {
        width: 7px;
        height: 14px;
        border-width: 2.5px;
        left: auto;
        top: 4px;
      }
    }
    &.is-checked {
      .el-checkbox__inner{
        background-color: #3D3D51;
      }
    }
    &.is-indeterminate {
      .el-checkbox__inner{
        background-color: #3D3D51;
        &::before {
          top: auto;
        }
      }
    }
  }

  /deep/ .el-table__header-wrapper {
    border: 1px solid #ECECEC;
    box-sizing: border-box;

    .el-table__cell {
      background-color: #F8F8F8;
      // font-size: 18px;
      line-height: 20px;
      font-weight: 400;
    }

    th.el-table__cell:nth-child(n+3) {
      text-align: center;
    }
  }
}
</style>