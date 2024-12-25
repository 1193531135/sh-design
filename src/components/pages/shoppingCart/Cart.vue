<template>
  <div class="card-container">
    <div style="margin: 20px 0;font-size: 22px;line-height: 34px;">商品信息</div>
    <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 1380px"
      @selection-change="(val) => selected = val">
      <el-table-column type="selection" width="186">
      </el-table-column>
      <el-table-column label="商品" width="480">
        <template slot-scope="scope">
          <div class="table-image">
            <el-image fit="contain" :src="scope.row.coverImage"></el-image>
            <div style="display: flex;flex-direction: column;gap: 10px;">
              <div class="table-image-title">{{ scope.row.title }}</div>
              <div class="table-image-sum">数量：{{ scope.row.sum }}</div>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="许可类型" width="182">
        <template slot-scope="scope">
          <div class="table-license">{{ getMappingValue(scope.row.licenseType) }}</div>
        </template>
      </el-table-column>
      <el-table-column label="价格" width="156">
        <template slot-scope="scope">
          <div class="table-price">￥{{ scope.row.price }}</div>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <div class="table-options">
            <div class="options-button hover">
              <img src="../../../assets/image/home/delete.png" alt="">删除
            </div>
            <div class="options-button hover">
              <img src="../../../assets/image/home/heart.png" alt="">收藏
            </div>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <div class="settle">
      <div class="btns">
        <div class="options">
          <div class="hover" @click="deleteGoods">删除选中商品</div>
          <div class="hover" @click="clearGoods">清空购物车</div>
        </div>
        <div class="settle-message">已选 {{ selected.length }} 件商品 总价：
          <span style="font-size: 22px;color: #DF3939;font-weight: 700;font-family: Lato;">￥{{ selected.length ? selected.map(i =>i.price).reduce((i, j) => i + j) : 0 }}
          </span>
        </div>
      </div>
      <div style="display: flex;flex-direction: row-reverse;">
        <div class="settle-button hover" @click="inputOrder">去结算</div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      tableData: [],
      licenseTypeOptions: [
        { label: "版权", value: 1, point: "问号中的提示" }
      ],
      selected: [],
      tableHeight: 200,
    }
  },
  methods: {
    deleteGoods() {
      // 选中的id列表
      let ids = this.selected.map(i => i.id)
      // 接口成功后更新数据
      this.getOrderList()
    },
    clearGoods() {
      // 接口成功后更新数据
      this.getOrderList()
    },
    // 获取用户订单列表数据
    getOrderList() {
      const res = [
        {
          title: "哥特花园迷惑的花朵",
          id: 1,
          coverImage: "https://images.pexels.com/photos/18069291/pexels-photo-18069291.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
          sum: 1,
          licenseType: 1,
          price: 236,
        },
        {
          title: "哥特",
          id: 2,
          coverImage: "https://images.pexels.com/photos/18069291/pexels-photo-18069291.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
          sum: 1,
          licenseType: 1,
          price: 456,
        },
      ]
      // 模拟数据 复制多个假数据
      for (let i = 0; i < 4; i++) {
        res.push(...res.map(i => ({ id: parseInt(Math.random() * 1000), ...i })))
      }
      this.tableData = res
    },
    inputOrder() {
      this.$router.psuh("/shopping-cart/order-input",{
        query:{
          orderMessage: JSON.stringify(this.selected)
        }
      })
    },
    // 获取证书类型的映射值
    getMappingValue(value) {
      return this.licenseTypeOptions.filter(i => i.value == value)[0]?.label
    },
  },
  created() {
    this.getOrderList()
  }
}
</script>
<style scoped lang="less">
.card-container {
  margin: 0 auto;
  text-align: left;
  display: flex;
  flex: 1;
  flex-direction: column;
  overflow-y: auto;
}

.el-table {
  font-size: 18px;
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow-y: auto;

  /deep/ .el-table__body-wrapper {
    overflow-y: auto;
    flex: 1;
    &::-webkit-scrollbar {
      width: 0;
    }
  }

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
      .el-checkbox__inner {
        background-color: #3D3D51;
      }
    }

    &.is-indeterminate {
      .el-checkbox__inner {
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
    height: 48px;

    .el-table__cell {
      background-color: #F8F8F8;
      // font-size: 18px;
      line-height: 20px;
      font-weight: 400;
      height: 48px;
      padding: 0;
    }

    th.el-table__cell:nth-child(n+3) {
      text-align: center;
    }
  }
  .table-license,
  .table-price{
    display: flex;
    justify-content: center;
    font-size: 16px;
  }
  .table-price{
    font-size: 22px;
    font-family: Lato;
    font-weight: 700;
    color: #DF3939;
  }
  .table-image {
    display: flex;
    align-items: center;
    gap: 20px;
    .el-image {
      width: 100px;
      height: 100px;
    }
    .table-image-title{
      font-size: 26px;
    }
    .table-image-sum{
      font-size: 16px;
    }
  }
  .table-options{
    display: flex;
    gap: 20px;
    font-size: 16px;
    justify-content: center;
    .options-button{
      display: flex;
      border-radius: 6px;
      align-items: center;
      background-color: #F3F3F3;
      box-sizing: border-box;
      border: 1px solid #E8E8E8;
      width: 98px;
      height: 36px;
      justify-content: center;
      gap: 2px;
      img{ width: 18px; }
    }
  }
}

.settle {
  .btns {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #F8F8F8;
    height: 48px;
    padding: 0 30px;
    font-weight: 800;
    .options {
      display: flex;
      gap: 40px;
    }
  }

  .settle-button {
    margin: 30px 0;
    width: 174px;
    height: 48px;
    background-color: #3D3D51;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    font-weight: 800;
    border-radius: 6px;
  }
}
</style>