<template>
  <div style="text-align: center;">
    <el-table border :data="tableData" stripe @selection-change="handleSelectionChange" header-row-class-name="tableHeadr"
      v-loading="tableLoad" ref="table" row-key="id2">
      <!-- 有selectionChange方法就有selection -->
      <el-table-column v-if="isSelect" type="selection" width="42"></el-table-column>
      <el-table-column :width="item.width" v-for="item in renderItem.dataRender.filter(i => !i.noShow)" :key="item.id2"
        :label="item.name" :prop="item.modelName">
        <template slot="header">
          {{ item.name }} <i class="point el-icon-question" :data-title="item.point" v-if="item.point"></i>
        </template>
        <template slot-scope="scope">
          <tableColumn :rowData="scope.row" :randerItems="item" :baseUrl="baseUrlLocal"></tableColumn>
        </template>
      </el-table-column>
      <el-table-column label="options" :width="renderItem.optionsWidth || '60px'" v-if="renderItem.options">
        <template slot-scope="scope">
          <div class="table-option">
            <el-button v-for="btnI in [...optionsBtns, ...(renderItem.options.optionsBtnsExtend || [])].filter(btnI =>
              btnItemVerifyLocal(
                renderItem.options.funcs,
                btnI,
                scope.row
              ) && (renderItem.options.isShow ? renderItem.options.isShow(scope.row, btnI) : true)
            )" :style="`${btnI.bgc && 'background-color:' + btnI.bgc}`" :key="btnI.name" :size="btnI.size || 'mini'"
              :type="btnI.type" class="btn-df" @click.stop="btnClick(scope.row, scope.$index, btnI, renderItem)">{{
                btnI.name }}<i :class="`${btnI.name ? '' : 'no-text '}${btnI.icon}`"></i></el-button>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="Sort" width="60px" v-if="renderItem.sortable">
        <template>
          <div class="right-table-row">
            <i class="el-icon-rank move"></i>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination v-if="!sortable && paging" background layout="total,prev, pager, next" :total="total"
        :pager-count="5" :page-size.sync="pageSize" :current-page.sync="nowPage"
        :page-sizes="[pageSize]"></el-pagination>
    <div v-else class="add-btn" @click="addRow"
      v-show="renderItem.maxlength ? (tableData.length != renderItem.maxlength) : true">+
    </div>
  </div>
</template>

<script>
import tableColumn from './TableColumnTemplate.vue'
export default {
  components: { tableColumn },
  props: {
    /*
      renderItem:{
        isSelect:Boolone,  // 是否有列选中功能
        dataRender:Array,  // dataRender中的字典用于渲染列元素，详细配置参照tableColumn
        sortable:Boolone,
        optionsBtnsExtend:Array //option选项的扩展
      }
    */
    renderItem: {
      type: Object,
      default() {
        return {}
      }
    },
    data: {
      type: Array,
    },
    baseUrl: String,
    // 公共的按钮校验方法
    btnItemVerify: {
      type: Function,
      default() {
        return true
      }
    },
    // optionsBtns 公共的操作按钮库
    optionsBtns: {
      type: Array,
      default() {
        return []
      }
    },
    // 是否是分页模式
    paging: {
      type: Boolean,
      default:false
    },
    // sortable,拖拽排序
    sortable:{
      type:Function,
    },
    getList:{
      type:Function
    },
    // 分页单页数据条数
    pageSize:{
      type:[Number,String],
      default:10
    }
  },
  data() {
    return {
      tableLoad: false,
      tableSelect: [],
      count: 1,
      nowPage:1,
      total:0,
      tableDataLocal:[]
    }
  },
  watch: {
    nowPage(){
      this.getData()
    },
    tableData(val, old) {
      if (val && old && (val.length > 0)) {
        this.tableData.some((item) => {
          if (!item.id2) {
            item.id2 = this.count
            this.count++
          }
        });
      }
    }
  },
  computed: {
    tableData: {
      get() {
        return this.data || this.tableDataLocal
      },
      set(val) {
        this.$emit('update:data', val)
      }
    },
    baseUrlLocal() {
      return this.renderItem.baseUrl || this.baseUrl
    },
    isSelect() {
      return this.renderItem.isSelect
    }
  },
  methods: {
    // 数据查询的时候传入数据
    async getData(){
      this.tableLoad = true
      let res = await this.getList({ nowPage:this.nowPage,pageSize:this.pageSize })
      this.tableLoad = false
      if(!res.error){
        this.tableDataLocal = res.data.data.list
        this.total = res.data.data.total
      }
    },
    // 用于校验option是否展示
    btnItemVerifyLocal(funcs, btnI, rowData) {
      let sign = btnI.sign
      let state = true
      let publicState = this.btnItemVerify ? this.btnItemVerify(btnI, rowData) : true
      // 1.外部组件是否包含该按钮，为空就全展示
      if (funcs && funcs.indexOf(sign) === -1) {
        state = false;
      }
      // 最小长度限制
      if (this.renderItem.minLength && this.renderItem.minLength === this.tableData.length && sign === 'delete') {
        state = false;
      }
      return publicState && state
    },
    btnClick(row, index, btnI, renderItem) {
      this.btnClickBefore && this.btnClickBefore()
      btnI.click(row, index, renderItem)
    },
    handleSelectionChange(val) {
      this.tableSelect = val;
    },
    addRow() {
      let addObj = {}
      this.renderItem.dataRender.some(item => {
        addObj[item.modelName] = ''
      })
      this.tableData.push(addObj)
    }
  },
  created() {
  }
};
</script>

<style scoped>
.el-table{
  margin-bottom: 20px;
}
.el-table>>>.tableHeadr th {
  padding: 0;
  background-color: inherit;
  height: 40px;
}

.el-table>>>.tableHeadr th .table--head-item {
  padding: 0;
  height: 40px;
  display: flex;
  align-items: center;
  /* background-color: rgba(0, 0, 0, 0.5); */
}

.el-table>>>.no-text {
  margin-left: 0;
}

.add-btn {
  border-color: rgb(235, 238, 245);
  border-width: 0 1px 1px 1px;
  border-style: solid;
}

.add-btn:hover {
  background-color: #c6e2ff;
  color: white;
  cursor: pointer;
}
</style>