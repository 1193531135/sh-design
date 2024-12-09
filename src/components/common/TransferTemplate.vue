<template>
  <div class="all table-all">
    <!-- 三表模式的查询 -->
    <div class="search-con" v-if="searchRander.length > 0 && TreeTableRander">
      <div class="search-container">
        <div class="search-item" v-for="(item, index) in searchRander" :key="index">
          <div class="search-item-text">{{ item.placeholder }}:</div>
          <el-input size="mini" v-if="item.type === 'input'" v-model="searchDataBackup[item.modelName]"
            :maxlength="item.maxlength" show-word-limit :placeholder="item.placeholder || 'input'"></el-input>
          <el-select size="mini" v-if="item.type === 'selects' || item.type === 'select'"
            v-model="searchDataBackup[item.modelName]" :placeholder="item.placeholder || 'select'"
            :multiple="item.type === 'selects'" :disabled="item.disabled" clearable collapse-tags
            :multiple-limit="item.maxlength ? item.maxlength : 0">
            <el-option v-for="option in item.options.constructor === String
              ? optionsAll[item.options]
              : item.options" :key="option.value" :label="option.label"
              :value="option.value || option.label"></el-option>
            <el-option v-if="item.type === 'selects' && !item.noNone" value="None" label="None"></el-option>
            <!-- <el-option v-if="item.type === 'select'" value="" label="All"></el-option> -->
          </el-select>
          <div v-if="item.type === 'dates'" class="dates">
            <el-date-picker v-model="searchDataBackup[item.modelName[0]]" type="date" size="mini"
              :placeholder="'Select Start Date'" value-format="yyyy-MM-dd"></el-date-picker>-
            <el-date-picker v-model="searchDataBackup[item.modelName[1]]" type="date" size="mini"
              :placeholder="'Select End Date'" value-format="yyyy-MM-dd"></el-date-picker>
          </div>
          <!-- cascader级联选择器 -->
          <el-cascader v-if="item.type === 'cascader'" v-model="searchDataBackup[item.modelName]" :options="item.options &&
            (item.options.constructor === String
              ? optionsAll[item.options]
              : item.options)
            " :props="item.props || {
              expandTrigger: 'hover',
              multiple: item.multiple,
            }
              " clearable collapse-tags @change="(value) => cascaderChange(value, item)" size="mini"></el-cascader>
        </div>
      </div>
      <el-button size="mini" type="primary" @click="searchFunc">Search</el-button>
    </div>
    <div class="rander-main">
      <!-- Base -->
      <div class="base-table">
        <!-- Base search -->
        <div class="search-con" v-if="searchRander.length > 0 && !TreeTableRander">
          <div class="search-container">
            <div class="search-item" v-for="(item, index) in searchRander" :key="index">
              <div class="search-item-text">{{ item.placeholder }}:</div>
              <div class="search-item-con">
                <el-input size="mini" v-if="item.type === 'input'" v-model="searchDataBackup[item.modelName]"
                  :maxlength="item.maxlength" show-word-limit :placeholder="item.placeholder || 'input'"></el-input>
                <el-select size="mini" v-if="item.type === 'selects' || item.type === 'select'"
                  v-model="searchDataBackup[item.modelName]" :placeholder="item.placeholder || 'select'"
                  :multiple="item.type === 'selects'" :disabled="item.disabled" clearable collapse-tags
                  :multiple-limit="item.maxlength ? item.maxlength : 0">
                  <el-option v-for="option in item.options.constructor === String
                    ? optionsAll[item.options]
                    : item.options" :key="option.value" :label="option.label"
                    :value="(!option.value && option.value != 0) ? option.label : option.value"></el-option>
                  <el-option v-if="item.type === 'selects' && !item.noNone" value="None" label="None"></el-option>
                  <!-- <el-option v-if="item.type === 'select'" value="" label="All"></el-option> -->
                </el-select>
                <div v-if="item.type === 'dates'" class="dates">
                  <el-date-picker v-model="searchDataBackup[item.modelName[0]]" type="date" size="mini"
                    :placeholder="'Select Start Date'" value-format="yyyy-MM-dd"></el-date-picker>-
                  <el-date-picker v-model="searchDataBackup[item.modelName[1]]" type="date" size="mini"
                    :placeholder="'Select End Date'" value-format="yyyy-MM-dd"></el-date-picker>
                </div>
                <!-- cascader级联选择器 -->
                <el-cascader v-if="item.type === 'cascader'" collapse-tags v-model="searchDataBackup[item.modelName]"
                  :options="item.options &&
                    (item.options.constructor === String
                      ? optionsAll[item.options]
                      : item.options)
                    " :props="item.props || {
                      expandTrigger: 'hover',
                      multiple: item.multiple,
                    }
                      " clearable @change="(value) => cascaderChange(value, item)" size="mini"></el-cascader>
              </div>
            </div>
          </div>
          <el-button size="mini" type="primary" @click="searchFunc"><i class="el-icon-search"></i> Search</el-button>
        </div>
        <el-table :data="Base" :height="39 * 10 + 50" @selection-change="(val) => changeTransfer(val, 'base')"
          ref="transferTable" v-loading="loading" :class="baseTableDisSelectAll ? 'selectAll-disabled' : ''" border>
          <el-table-column type="selection" width="42" :selectable="isDisabled"></el-table-column>
          <!-- 本地的tablecolumn，用于本地的查询 -->
          <el-table-column :prop="searchKey" label="name" v-if="!getBase">
            <template slot="header">
              <div style="display: flex">
                <div style="width: 70px">Name:</div>
                <el-input v-model="search" size="mini" />
              </div>
            </template>
          </el-table-column>
          <!--  -->
          <el-table-column :width="item.width" v-for="item in showRender" :key="item.modelName" :label="item.name"
            :prop="item.modelName" v-show="!item.noShow">
            <template slot-scope="scope" v-if="scope.row">
              <tableColumn :rowData="scope.row" :randerItems="item" :baseUrl="baseUrlLocal"></tableColumn>
            </template>
          </el-table-column>
        </el-table>
        <div class="pagin page-con">
          <el-pagination background :layout="`total${noPagin ? '' : ',sizes,prev, pager, next,jumper'}`" :total="total"
            :pager-count="5" :page-size.sync="pageSize" :current-page.sync="nowPage"
            :page-sizes="[pageSize]"></el-pagination>
        </div>
      </div>
      <div class="iconCon">
        <div class="add-all-btn hover" v-if="selectAll">
          All
          <i class="el-icon-arrow-right"></i>
        </div>
        <el-button class="el-icon-arrow-right" circle type="primary" :disabled="changeBaseList.length === 0"
          @click="SelectedData"></el-button>
        <el-button :disabled="changeDataList.length === 0" class="el-icon-arrow-left" circle type="danger"
          @click="DeleteData"></el-button>
      </div>
      <!-- data -->
      <div class="data-table">
        <div class="search-con" v-show="localSearchRander.length > 0">
          <div class="search-container">
            <div class="search-item" v-for="(item, index) in localSearchRander" :key="index">
              <div class="search-item-text">{{ item.placeholder }}:</div>
              <div class="search-item-con">
                <el-input size="mini" v-if="item.type === 'input'" v-model="localSearchDataBackup[item.modelName]"
                  :maxlength="item.maxlength" show-word-limit :placeholder="item.placeholder || 'input'"></el-input>
                <el-select size="mini" v-if="item.type === 'selects' || item.type === 'select'"
                  v-model="localSearchDataBackup[item.modelName]" :placeholder="item.placeholder || 'select'"
                  :multiple="item.type === 'selects'" :disabled="item.disabled" clearable
                  :multiple-limit="item.maxlength ? item.maxlength : 0">
                  <el-option v-for="option in item.options.constructor === String
                    ? optionsAll[item.options]
                    : item.options" :key="option.value" :label="option.label"
                    :value="option.value || option.label"></el-option>
                  <el-option v-if="item.type === 'selects' && !item.noNone" value="None" label="None"></el-option>
                  <!-- <el-option v-if="item.type === 'select'" value="" label="All"></el-option> -->
                </el-select>
                <div v-if="item.type === 'dates'" class="dates">
                  <el-date-picker v-model="localSearchDataBackup[item.modelName[0]]" type="date" size="mini"
                    :placeholder="'Select Start Date'" value-format="yyyy-MM-dd"></el-date-picker>-
                  <el-date-picker v-model="localSearchDataBackup[item.modelName[1]]" type="date" size="mini"
                    :placeholder="'Select End Date'" value-format="yyyy-MM-dd"></el-date-picker>
                </div>
                <!-- cascader级联选择器 -->
                <el-cascader v-if="item.type === 'cascader'" v-model="localSearchDataBackup[item.modelName]" :options="item.options &&
                  (item.options.constructor === String
                    ? optionsAll[item.options]
                    : item.options)
                  " :props="item.props || {
                    expandTrigger: 'hover',
                    multiple: item.multiple,
                  }
                    " clearable collapse-tags @change="(value) => cascaderChange(value, item, 'local')"
                  size="mini"></el-cascader>
              </div>
            </div>
          </div>
          <el-button size="mini" type="primary" @click="searchFunc('local')"><i class="el-icon-search"></i>
            Search</el-button>
        </div>
        <el-table :data="nowPageData" row-key="id2" :height="40 * 10 + 48"
          @selection-change="(val) => changeTransfer(val, 'data')"
          :class="dataTableDisSelectAll ? 'selectAll-disabled' : ''" ref="dataTable" border>
          <el-table-column type="selection" width="42" :selectable="isDisabledInDataTable"></el-table-column>
          <el-table-column :prop="searchKey" label="Name" v-if="!dataRender">
            <template slot-scope="scope">
              <div>
                <div>{{ scope.row.title }}</div>
              </div>
            </template>
          </el-table-column>
          <el-table-column :prop="searchKey" label="Sort" width="60px" v-if="sortable">
            <template>
              <div class="center-box">
                <i class="el-icon-rank move"></i>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="Top" width="50" v-if="topping">
            <template slot-scope="scope">
              <div class="center-box">
                <i class="el-icon-top hover" @click="sortTopping(scope)"></i>
              </div>
            </template>
          </el-table-column>
          <el-table-column :width="item.width" v-for="item in dataRender.filter(i => !i.noShow)" :key="item.id2"
            :label="item.name" :prop="item.modelName">
            <template slot="header">
              {{ item.name }} <i class="point el-icon-question" :data-title="item.point" v-if="item.point"></i>
            </template>
            <template slot-scope="scope">
              <tableColumn :rowData="scope.row" :randerItems="item" :baseUrl="baseUrlLocal"></tableColumn>
            </template>
          </el-table-column>
        </el-table>
        <div class="pagin page-con">
          <el-pagination v-if="localSearchRander.length > 0" background layout="total,sizes,prev, pager, next,jumper"
            :total="showData && showData.length" :pager-count="5" :page-size.sync="pageSize"
            :current-page.sync="localPageNum" :page-sizes="[pageSize]"></el-pagination>
          <div v-else style="height:32px;line-height:32px;font-size:13px">Total {{ nowPageData ? nowPageData.length : ''
            }}
          </div>
        </div>
      </div>
    </div>
    <div class="tree-table" style="margin-top: 6px" v-if="TreeTableRander">
      <el-table :data="nowPageData" row-key="id2" @selection-change="(val) => changeTransfer(val, 'data')" border>
        <el-table-column type="selection" width="42"></el-table-column>
        <el-table-column :width="item.width" v-for="item in TreeTableRander" :key="item.id2" :label="item.name"
          :prop="item.modelName" v-show="!item.noShow">
          <template slot-scope="scope">
            <tableColumn :rowData="scope.row" :randerItems="item" :baseUrl="baseUrlLocal"></tableColumn>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import tableColumn from "./TableColumnTemplate.vue";
export default {
  components: { tableColumn },
  props: {
    // {{ transferBase 已弃用 }}
    transferBase: {
      type: Array,
      default() {
        return [];
      }
    },
    // 选中的参数
    model: Array,
    sign: String,
    searchKey: String,
    repeat: Boolean,
    // 获取Base数据
    getBase: Function,
    showRender: {
      type: Array,
      default() {
        return [];
      }
    },
    dataRender: {
      type: Array,
      default() {
        return [];
      }
    },
    searchRander: {
      type: Array,
      default() {
        return [];
      }
    },
    localSearchRander: {
      type: Array,
      default() {
        return [];
      }
    },
    pageSize: {
      type: Number,
      default() {
        return 10;
      }
    },
    // 用于判断bas列表的唯一值的字段名
    BasekeyID: {
      type: String,
      default: "id"
    },
    // 用于判断data列表的唯一值的字段名
    DatakeyID: {
      type: String,
      default: "id"
    },
    uploadFieldTransform: Array,
    localSearchFunc: Function,
    selectAll: Boolean,
    sortable: {
      type: Boolean,
      default: true
    },
    topping: Boolean,
    // 第三个表的渲染数据
    TreeTableRander: Array,
    // noPagin base是否分页
    noPagin: Boolean,
    // BaseLocalSearch Base的数据是否为本地查询
    BaseLocalSearch: Boolean,
    // isSelectCheck 对Base数据能否被选中进行判定的函数
    isSelectCheck: Function,
    isSelectCheckInDataTable: Function,
    // baseUrl 用于图片展示的公用baseUrl
    baseUrl: String,
    // maxlength 右侧选中的最大长度
    maxlength: Number,
    /* 
      renderItem{}
      beforeMove 移动到右侧之前的钩子
    */
    renderItem: Object,
    beforeMove: Function,
    moved: Function,
    beforeDelete: Function,
    deleted: Function,
    // 用于是否禁用表全选
    dataTableDisSelectAll: Boolean,
    baseTableDisSelectAll: Boolean,
    // 右侧data表选中checkbox之后，出发回调
    dataTableSelectChange: Function,
    // 同上 base 表选中触发
    baseTableSelectChange: Function
  },
  data() {
    return {
      search: "",
      totalHeight: 400,
      changeBaseList: [],
      changeDataList: [],
      count: 1,
      Base: [],
      searchDataBackup: {},
      searchData: {},
      localSearchDataBackup: {},
      localSearchData: {},
      localPageNum: 1,
      // total
      total: 0,
      nowPage: 1,
      loading: false
    };
  },
  methods: {
    cascaderChange(value, OptionItem, local) {
      let names = OptionItem.trueModelName;
      let func = OptionItem.change;
      let searchDataBackup = local
        ? this.localSearchDataBackup
        : this.searchDataBackup;
      if (value.length === 0) {
        searchDataBackup[names[0]] = "";
        searchDataBackup[names[1]] = "";
      }
      if (value.length != 0) {
        if (OptionItem.multiple) {
          // 一级字段选中
          value && (searchDataBackup[names[0]] = value[0][0]);
          // 二级字段选中
          value && (searchDataBackup[names[1]] = value.map(i => i[1]));
        } else {
          value &&
            value.some((item, index) => {
              searchDataBackup[names[index]] = item;
            });
        }
      }
      func && func(OptionItem);
      // let data = func ? func(OptionItem) : "";
      // data && (this.searchRanderLocal = data);
    },
    searchFunc(local) {
      // 日期校验
      local = local === "local" ? true : false;
      let state = false;
      let searchRander = local ? this.localSearchRander : this.searchRander;
      searchRander.some(item => {
        let backupData = local
          ? this.localSearchDataBackup
          : this.searchDataBackup;
        // date的单独校验规则
        if (
          item.type === "dates" &&
          backupData[item.modelName[0]] &&
          backupData[item.modelName[1]]
        ) {
          let start = Number(backupData[item.modelName[0]].replaceAll("-", ""));
          let end = Number(backupData[item.modelName[1]].replaceAll("-", ""));
          if (start > end) {
            this.$message({
              message: "Start time cannot be greater than end time",
              type: "warning"
            });
            state = true;
          }
        }
      });
      if (state) return true;
      if (local) {
        // 选中的数据渲染直接通过 localSearchData 即时渲染
        this.localSearchData = { ...this.localSearchDataBackup };
        return true;
      }
      this.searchData = { ...this.searchDataBackup };
      this.getBaseLocal();
    },
    async getBaseLocal(config = {}) {
      config = {
        pageNum: this.nowPage,
        ...this.searchData,
        ...config
      };
      // 请求前array类型数据处理
      Object.keys(config).some(item => {
        if (config[item] && config[item].constructor === Array) {
          config[item] = config[item].toString();
        }
      });
      this.loading = true;
      let data = await this.getBase(config);
      // 如果为本地查询
      if (this.BaseLocalSearch) {
        let base = [];
        data.list.some(dataItem => {
          let state = true;
          this.searchRander.some(item => {
            // Base的本地查询逻辑
            if (item.type === "input") {
              if (
                dataItem[item.modelName]
                  .toUpperCase()
                  .indexOf(this.searchData[item.modelName].toUpperCase()) === -1
              ) {
                state = false;
              }
            }
            if (item.type === "selects") {
              let state2 = false;
              // 如果查询为空应该全查
              if (this.searchData[item.modelName].length === 0) {
                state2 = true;
              }
              this.searchData[item.modelName].some(searchDataItem => {
                dataItem[item.modelName].split(",").some(item2 => {
                  // console.log(searchDataItem,item2)
                  if (searchDataItem === item2) {
                    state2 = true;
                  }
                });
              });
              !state2 && (state = false);
            }
          });
          if (state) {
            base.push(dataItem);
          }
        });
        data.list = base;
      }
      this.Base = data.list;
      this.total = data.total;
      this.loading = false;
    },
    // 用于右侧data表的多选校验
    isDisabledInDataTable(row) {
      let state = true
      if (this.isSelectCheckInDataTable) {
        state = this.isSelectCheckInDataTable({ rowData: row, _this: this });
      }
      return state
    },
    isDisabled(row) {
      let state = true;
      // 外部是否允许选中校验
      if (this.isSelectCheck) {
        state = this.isSelectCheck({ rowData: row, _this: this });
      }
      // 不允许重复的校验逻辑
      if (!this.repeat) {
        this.data &&
          this.data.some(item => {
            if (item[this.DatakeyID] === row[this.BasekeyID]) {
              state = false;
            }
          });
      }
      // 最大选中数量校验 （ 多于等于的时候禁止选中 ）
      if (this.maxlength && this.maxlength <= this.data.length) {
        state = false
      }
      return state;
    },
    // 左右侧的表的选中
    changeTransfer(val, type) {
      if (type === "base") {
        this.changeBaseList = val;
        this.baseTableSelectChange && this.baseTableSelectChange(val)
      } else {
        this.changeDataList = val;
        this.dataTableSelectChange && this.dataTableSelectChange(val)
      }
    },
    // 左侧添加到右侧
    SelectedData() {
      let data = this.$deepCopy(this.changeBaseList);
      data.some(item => {
        item.id2 = "";
        // DatakeyID左侧可能不一致
        if (this.DatakeyID != this.BasekeyID) {
          item[this.DatakeyID] = item[this.BasekeyID];
        }
        // 特殊字段转化
        if (this.uploadFieldTransform) {
          this.uploadFieldTransform.some(item2 => {
            item[item2.BaseField] &&
              !item[item2.UploadField] &&
              (item[item2.UploadField] = item[item2.BaseField]);
            !item[item2.BaseField] &&
              item[item2.UploadField] &&
              (item[item2.BaseField] = item[item2.UploadField]);
          });
        }
        // Base字段中不包含dataRender字段的加上
        if (this.dataRender) {
          this.dataRender.some(item2 => {
            // 不包含的字段初始化
            if (
              !item[item2.modelName] &&
              item2.editor &&
              item[item2.modelName] !== 0 &&
              item[item2.modelName] !== false
            ) {
              // 不存在字段的话 统一字符串初始化
              if (
                !item[item2.modelName] &&
                item[item2.modelName] != 0 &&
                item[item2.modelName] != false
              ) {
                item[item2.modelName] = "";
                if (item2.type === "checkbox") {
                  item[item2.modelName] = 0;
                }
                if (item2.defaultData) {
                  // if(item2.defaultData.constructor === Function){
                  //   item[item2.modelName] = item2.defaultData()
                  // }
                  item[item2.modelName] = item2.defaultData;
                }
              }
            }
          });
        }
        // 第三表也要加上不存在的字段和默认数据
        if (this.TreeTableRander) {
          this.TreeTableRander.some(item2 => {
            // 不包含的字段初始化
            if (
              !item[item2.modelName] &&
              item2.editor &&
              item[item2.modelName] !== 0 &&
              item[item2.modelName] !== false
            ) {
              // 不存在字段的话 统一字符串初始化
              if (
                !item[item2.modelName] &&
                item[item2.modelName] != 0 &&
                item[item2.modelName] != false
              ) {
                item[item2.modelName] = "";
                if (item2.type === "checkbox") {
                  item[item2.modelName] = 0;
                }
                if (item2.defaultData) {
                  // if(item2.defaultData.constructor === Function){
                  //   item[item2.modelName] = item2.defaultData()
                  // }
                  item[item2.modelName] = item2.defaultData;
                }
              }
            }
          });
        }
      });
      // this.$set(this,'data',[...this.data, ...data])
      // this.data.push(...data)
      // maxlength 长度限制
      if (this.maxlength) {
        let len = this.maxlength - this.data.length
        data = data.slice(0, len)
      }
      // beforeMove
      this.beforeMove && this.beforeMove({ dataList: data, _this: this })
      this.data = [...this.data, ...data];
      this.moved && this.moved({ dataList: data, _this: this })
      // 右侧到最底端
      //直接梭哈100000到底
      setTimeout(() => this.$refs['dataTable'].$el.querySelector('.is-scrolling-none').scrollTo({ top: 100000, behavior: "smooth" }), 0)
      // 刷新左侧table
      // this.$refs.transferTable.doLayout()
      this.$refs.transferTable.clearSelection();
    },
    DeleteData() {
      let data = [];
      this.data.some(item => {
        let state = true;
        this.changeDataList.some(item2 => {
          if (item.id2 === item2.id2) {
            state = false;
          }
        });
        if (state) {
          data.push(item);
        }
      });
      // beforeDelete
      this.beforeDelete && this.beforeDelete({ dataList: data, _this: this })
      this.data = data;
      this.deleted && this.deleted({ dataList: data, _this: this })
      this.$refs["dataTable"].clearSelection();
    },
    sortTopping({ $index, row }) {
      this.data.splice($index, 1);
      this.data.splice(0, 0, row)
    }
  },
  computed: {
    baseUrlLocal() {
      return this.renderItem.baseUrl || this.baseUrl
    },
    // Base() {
    //   let a = [];
    //   this.transferBase.some(item => {
    //     if (item[this.searchKey].toString().indexOf(this.search) != -1) {
    //       a.push(item);
    //     }
    //   });
    //   return a;
    // },
    data: {
      get() {
        return this.model;
      },
      set(val) {
        this.$emit("update:model", val);
      }
    },
    showData() {
      let array =
        this.localSearchRander.length > 0
          ? this.localSearchFunc(this.localSearchData, this.localSearchRander)
          : this.data;
      return array;
    },
    nowPageData() {
      let array =
        // 返回当前页面的数据
        this.localSearchRander.length > 0
          ? this.showData.slice(
            this.pageSize * (this.localPageNum - 1),
            this.pageSize * this.localPageNum
          )
          : this.showData;
      return array;
    },
    optionsAll() {
      return this.$store.state.optionBase;
    },
    searchRanderLocal: {
      get() {
        return this.searchRander;
      },
      set(val) {
        this.$emit("update:searchRander", val);
      }
    }
  },
  watch: {
    nowPage: {
      handler() {
        this.getBaseLocal();
      }
    },
    // Base: {
    //   handler(val) {
    //     this.Base = val;
    //   },
    //   deep: true
    // },
    data: {
      handler(val, old) {
        // let data = this.$deepCopy(this.data);
        if (val && old && (val.length != old.length)) {
          this.data.some((item) => {
            if (!item.id2) {
              item.id2 = this.count
              this.count++
            }
          });
        }
        // console.log(val,old)
        // this.data &&
        //   this.data.some(item => {
        //     if (!item.id2) {
        //       item.id2 = this.count;
        //       this.count++;
        //     }
        //   });
        // // 赋值showData
        // {
        //     this.showData = this.data?this.data.filter(i => {
        //         let state = false
        //         Object.keys(this.localSearchData).some(item => {
        //             if(i[item].indexOf(this.localSearchData[item]) != -1){
        //                 state = true
        //             }
        //         })
        //         return state
        //     }) : []
        // }
        // this.data = data
      }
    }
  },
  async created() {
    // 初次加载
    if (this.getBase) {
      this.getBaseLocal();
    }
    // search 初始化
    this.searchRanderLocal.some(item => {
      // 基础初始化
      this.$set(this.searchData, item.modelName, item.defaultData || "");
      this.$set(this.searchDataBackup, item.modelName, item.defaultData || "");
      // 单个item多个渲染modelName
      if (item.type === "dates") {
        item.modelName.some(modelItem => {
          this.$set(this.searchData, modelItem, "");
          this.$set(this.searchDataBackup, modelItem, "");
        });
        return false;
      }
      // cascader类型提前录入多字段
      if (item.type === "cascader") {
        item.trueModelName.some(name => {
          this.$set(this.searchData, name, "");
          this.$set(this.searchDataBackup, name, "");
        });
      }
      // 空数组录入
      if (item.type === "selects") {
        this.$set(this.searchData, item.modelName, []);
        this.$set(this.searchDataBackup, item.modelName, []);
      }
      // if (item.type === "select") {
      //     this.searchDataBackup[item.modelName] = "";
      // }
    });
  },
  mounted() {
    this.$nextTick(() => {
      // console.log(this.$refs);
      this.sortable &&
        this.$sortable.create(
          this.$refs["dataTable"].$el.querySelectorAll("tbody")[0],
          {
            animation: 200,
            forceFallback: true,
            handle: ".move",
            onEnd: evt => {
              // 循环获取内容lable值返回arrary
              const item = this.data[evt.oldIndex];
              this.data.splice(evt.oldIndex, 1);
              this.data.splice(evt.newIndex, 0, item);
            }
          }
        );
    });
  }
};
</script>

<style scoped lang="less">
.rander-main {
  display: flex;
}

/* .base-table,
.data-table {
    width: 450px;
} */

.base-table {
  /* border: 1px solid rgba(0, 0, 0, 0.1); */
  border-radius: 8px;
  flex: 1;
  /* padding: 10px; */
}

/* .data-table,.base-table{
  max-width: 543px;
} */
.add-all-btn {
  border-radius: 50%;
  background-color: #409eff;
  font-size: 12px;
  height: 40px;
  width: 40px;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 10px 0;
}

.table-all,
.page-con,
.search-con {
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  padding: 10px 20px;
  color: #606266;
}

/* search */
.search-con {
  text-align: center;
  display: flex;
  align-items: center;
  /* padding-left: 10px !important; */
  /* box-shadow: 0 0 10px rgba(0,0,0,0.2); */

  .search-container {
    display: flex;
    flex-wrap: wrap;

    .search-item {
      display: flex;
      margin: 3.5px 10px 3.5px 0;
      font-size: 12px;
      align-items: center;

      .search-item-text {
        text-align: left;
        margin-right: 5px;
        width: 100px;
      }

      .search-item-con {
        width: 200px;

        .el-select,
        .el-cascader,
        .el-input {
          width: 200px;
          margin-right: 10px;
        }
      }
    }
  }
}


.el-table {
  border: 1px solid rgba(0, 0, 0, 0.1);
  /* min-width: 200px; */
  margin-top: 6px;
  border-radius: 10px 10px 0 0;
  font-size: 12px;

  /deep/ thead {
    color: #606266;
  }

  /deep/ .el-table__header-wrapper,
  /deep/ .el-table__cell,
  /deep/ .el-table__cell .cell {
    overflow: visible;
  }

  /* table的checkbox的禁用后可选中的bug修复 */
  /deep/ .el-checkbox__input,
  /deep/ .el-checkbox__inner {
    height: 14px;
    display: block;
  }

  /deep/ thead th {
    padding: 0;
    height: 40px;
  }

  /deep/ .el-table__row td .table-cell {
    width: 100%;
    height: 100%;
  }

  /deep/ .el-table__row td {
    padding: 0;
  }

  /deep/ .el-table__row td .cell {
    height: 38px;
    box-sizing: border-box;
    display: flex;
    align-items: center;
  }

  /deep/ .el-table-column--selection .cell {
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    display: flex;
    padding-left: 10px;
    padding-right: 10px;
  }
}

/* 调整pageing分页样式 */
.page-con {
  padding: 10px;
  margin: 0 0 10px 0;
  border-radius: 0 0 8px 8px;
  border-top: 0;
  text-align: left;
  /deep/.el-pagination__total,
  /deep/.el-pagination__sizes,
  /deep/.el-pagination__jump {
    margin-right: 0;
    margin-left: 0;
    font-size: 13px;
  }

  /deep/.el-pagination__sizes .el-input--suffix {
    width: 80px;
  }
}

.iconCon {
  display: flex;
  flex-direction: column;
  min-width: 60px;
  justify-content: center;
  align-items: center;
  font-size: 20px;
}

.iconCon .el-button {
  margin: 10px 0;
}

.center-box {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

.move {
  cursor: pointer;
}


.table-all {
  border: 0;
  padding: 0;
}

/* .page-con /deep/ .el-pagination{
  display: flex;
  justify-content: center;
} */
/* table */
.data-table {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.checkbox-con {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
}

/* 全选禁用 */
.selectAll-disabled /deep/ .el-table__header-wrapper .el-checkbox {
  display: none;
}
</style>