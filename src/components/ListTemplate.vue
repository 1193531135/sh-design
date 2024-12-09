<template>
  <div class="all">
    <!-- 抽屉本体 -->
    <el-drawer size="200px" title="Settings" :modal="false" :visible.sync="fieldsConfigDrawer" direction="rtl">
      <div class="drawer-con">
        <el-checkbox-group v-model="checkList">
          <el-checkbox size="medium" :label="item" v-for="item in tableRander" :key="item.viewName"
            :disabled="item.fieldsIrreversible">{{ item.viewName }}</el-checkbox>
        </el-checkbox-group>
        <div class="drwaer-btns">
          <el-button size="small" @click="drawerResetFields">
            <i class="el-icon-refresh-left"></i> Reset
          </el-button>
        </div>
      </div>
    </el-drawer>
    <div v-if="fieldsFilter && noCellEditor" class="drawer-open hover" @click="openDrawer">
      <!-- <div class="top-white-area drawer-item"></div> -->
      <div class="center-area drawer-item">
        <i class="el-icon-s-tools"></i>
      </div>
      <!-- <div class="bottom-white-area drawer-item"></div> -->
    </div>
    <!-- search -->
    <div class="search-con" v-if="searchRanderLocal.length > 0">
      <div style="display:flex;">
        <div class="search-container" ref="search-con">
          <div class="search-item"
            v-for="(item, index) in searchRanderLocal.slice(0, searchRanderSumLimit ? 4 : searchRanderLocal.lenght)"
            :key="index">
            <div class="search-item-text">{{ item.placeholder }}:</div>
            <div class="search-item-con">
              <el-input size="mini" v-if="item.type === 'input'" v-model="searchDataBackup[item.modelName]"
                @input="(val) => formatLimit(val, item)" :maxlength="item.maxlength" show-word-limit
                @keyup.enter.native="search" :placeholder="item.placeholder || 'input'"></el-input>
              <el-select size="mini" v-if="item.type === 'selects' || item.type === 'select'"
                v-model="searchDataBackup[item.modelName]" :placeholder="item.placeholder || 'select'"
                :multiple="item.type === 'selects'" :disabled="item.disabled" :clearable="!item.must" collapse-tags
                :multiple-limit="item.maxlength ? item.maxlength : 0">
                <el-option v-for="(option, index) in item.options.constructor === String ? item.optionsAdd ? [...optionsAll[item.options], ...item.optionsAdd] : optionsAll[item.options]
                  : item.options" :key="index" :label="option.label" :disabled="option.disabled"
                  :value="item.uploadLabel ? option.label : option.value"></el-option>
                <el-option v-if="item.type === 'selects' && !item.noNone" value="None" label="None"></el-option>
                <!-- <el-option v-if="item.type === 'select'" value="" label="All"></el-option> -->
              </el-select>
              <div v-if="item.type === 'dates'" class="dates">
                <el-date-picker v-model="searchDataBackup[item.modelName[0]]" type="date" size="mini"
                  :placeholder="'Start Date'" value-format="yyyy-MM-dd"></el-date-picker>
                <div style="width: 10px; height: 1px; background-color: black;margin:0 5px"></div>
                <el-date-picker v-model="searchDataBackup[item.modelName[1]]" type="date" size="mini"
                  :placeholder="'End Date'" value-format="yyyy-MM-dd"></el-date-picker>
                <!-- <div class="hot-key">
                <span @click="selectDate(item.modelName, 1)">Today</span>
                <span @click="selectDate(item.modelName, 3)">Three Days</span>
                <span @click="selectDate(item.modelName, 7)">Last Week</span>
                </div>-->
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
        </div>
        <div class="btn-con">
          <el-button size="mini" @click="reset" class="btn-df reset-btn">
            <i class="el-icon-refresh-left"></i> Reset
          </el-button>
          <el-button size="mini" type="primary" @click="search" class="btn-df">
            <i class="el-icon-search"></i> Search
          </el-button>
        </div>
        <!-- <div class="search-con-end"></div> -->
      </div>
      <div v-if="isSearchConOver">
        <span v-show="searchRanderSumLimit" class="more" @click="searchRanderSumLimit = !searchRanderSumLimit">
          More
          <i class="el-icon-arrow-down"></i>
        </span>
        <span v-show="!searchRanderSumLimit" class="more" @click="searchRanderSumLimit = !searchRanderSumLimit">
          Close
          <i class="el-icon-arrow-up"></i>
        </span>
      </div>
    </div>
    <div class="table-all">
      <div class="func-btns">
        <div class="left-btns">
          <el-button size="mini" v-for="btnI in [...headBtns, ...batchBtnsExtend]" :key="btnI.name" :plain="btnI.plain"
            :type="btnI.type" class="btn-df"
            :style="`${btnI.bgc ? 'background-color:' + btnI.bgc : ''};${btnI.color ? 'color:' + btnI.color : ''}`"
            v-show="btnItemVerify(headBtnsString, btnI)" @click="batchHandle(btnI)"
            :disabled="tableSelect.length === 0 && !btnI.noDisabled">{{ btnI.name }}</el-button>
        </div>
        <div class="right-btn">
          <el-button size="mini" type="primary" @click="customAdd ? customAdd() : toDetail()" class="btn-df add-btn"
            v-show="btnItemVerify('', { sign: 'add', permission: 'add' })">
            + Add
            <!-- Add {{ title || pageName }} -->
          </el-button>
          <el-button size="mini" v-for="btnI in mainBtnsRander || []" :key="btnI.name" :type="btnI.type"
            v-show="btnItemVerify('', btnI)" class="btn-df customBtn hover"
            :style="`background-color:${btnI.bgc || '#409EFF'};color:white`" @click="btnI.click()">{{ btnI.name
            }}</el-button>
        </div>
      </div>
      <!-- height="448px" -->
      <el-table :data="tableData" stripe header-row-class-name="tableHeadr" v-loading="tableLoad"
        @expand-change="expandChange" @selection-change="handleSelectionChange" border :cell-class-name="cellClassName"
        ref="libraryTable" row-key="id">
        <!-- <el-table-column type="expand" width="55" v-if="!NobatchOption && headBtnsString != ' '">
          <template slot-scope="props">{{ props.row.id }}</template>
</el-table-column>-->
        <!-- 展开行内容 -->
        <el-table-column type="expand" v-if="isColumnExpand">
          <template slot-scope="scope">
            <slot name="tableExpand" :row="scope.row"></slot>
          </template>
        </el-table-column>
        <el-table-column type="selection" width="55" v-if="!NobatchOption && headBtnsString != ' '"></el-table-column>
        <el-table-column label="Sort" width="60px" v-if="sortable">
          <template>
            <div class="right-table-row">
              <i class="el-icon-rank move"></i>
            </div>
          </template>
        </el-table-column>
        <el-table-column v-if="!IdNoShow" label="Id" prop="id" width="55"></el-table-column>
        <el-table-column min-width="140" label="phone image" v-for="item in filterTableData" :key="item.modelName"
          :width="columnWidthComputed(item)" :fixed="item.fixed">
          <template slot="header">
            <div class="table--head-item" :title="item.viewName">{{ item.viewName }}</div>
          </template>
          <template slot-scope="scope">
            <div class="table-cell">
              <!-- 因为有些slot类型或者custom类型数据没有modelName的字段，这里用viewName做ref的标识 -->
              <ColumnTemplate :ref="item.viewName" :permission="permission" :cellSave="cellSave" :pageName="pageName"
                :tableData="tableData" :rowData="scope.row" :randerItems="item" :jumpFunc="jumpFunc"
                :baseUrl="baseUrlLocal">
                <template :slot="item.slotName" slot-scope="scope">
                  <slot :name="item.slotName" :row="scope.row"></slot>
                </template>
              </ColumnTemplate>
              <!-- option按钮展示 -->
              <div class="table-option" v-if="item.type === 'option'">
                <el-button v-for="btnI in [...optionsBtns, ...optionsBtnsExtend]"
                  :style="`${btnI.bgc && 'background-color:' + btnI.bgc}`" :key="btnI.name" :size="btnI.size || 'mini'"
                  :type="btnI.type" class="btn-df" v-show="btnItemVerify(
                    item.funcs,
                    btnI,
                    scope.row.status,
                    scope.row.compressionStatus
                  ) && (item.isShow ? item.isShow(scope.row, btnI) : true)
                    " @click.stop="btnClickBefore(scope.row, btnI, scope.$index)">{{ btnI.name }}</el-button>
              </div>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination v-show="!sortable" background layout="total,sizes,prev, pager, next,jumper" :total="total"
        :pager-count="5" :page-size.sync="pageSize" :current-page.sync="nowPage"
        :page-sizes="pageSizeOption || [10, 50, 100]"></el-pagination>
    </div>
  </div>
</template>

<script>
import ColumnTemplate from "./common/TableColumnTemplate.vue";
export default {
  components: { ColumnTemplate },
  props: {
    mainBtnsRander: Array,
    headBtnsString: String, //头部按钮渲染的字符串
    permissionName: String,
    // 外部传入的权限参数
    permissionTrue: Object,
    searchRander: {
      type: Array,
      default() {
        return [];
      }
    },
    tableRander: Array,
    // 自定义方法
    getList: Function,
    EnableFunc: Function,
    DisableFunc: Function,
    DeleteFunc: Function,
    customAdd: Function,
    pageNameTrue: String,
    title: String,
    fromProject: Boolean,
    sortable: Function,
    requestHead: {
      type: String
    },
    // 是否不批量操作
    NobatchOption: Boolean,
    // 是否隐藏id
    IdNoShow: Boolean,
    // 是否开启字段筛选渲染
    fieldsFilter: Boolean,
    // 用于当前页全局的baseUrl
    baseUrl: String,
    // isColumnExpand 是否支持行展开
    isColumnExpand: Boolean,
    // expandChange 展开的回调
    expandChange: {
      type: Function,
      default() { return () => { } }
    },
    // default page size 默认展示分页数据条数
    defaultPageSize: Number,
    // pageSizeOption 分页可选page数量
    pageSizeOption: Array,
    // batchHandleBefore 批量操作之前的钩子
    batchHandleBefore: Function,
    // optionsBtnsExtend 页面自定义的表内操作按钮
    optionsBtnsExtend: {
      default: () => [],
      type: Array
    },
    // batchBtnsExtend 页面自定义的表内操作按钮
    batchBtnsExtend: {
      default: () => [],
      type: Array
    },
    cellClassName: Function,
    // startNoGetList 是否页面进入时不自动获取列表
    startNoGetList: Boolean,
    // 跳转详情页的路由 Name
    editorPageName:{
        type:String,
        default:'editor'
    }
  },
  data() {
    return {
      pagePath: '',
      checkList: [],
      pageName: "",
      // 控制search渲染数量
      searchRanderSumLimit: true,
      // fields控制抽屉的开关
      fieldsConfigDrawer: false,
      requestHeadLocal: "res",
      optionsAll: {},
      optionsBtns: [
        {
          name: "Detail",
          type: "primary",
          sign: "view",
          permission: "view",
          click: ({ id }) => this.toDetail(id)
        },
        {
          name: "Duplicate",
          type: "primary",
          sign: "duplication",
          permission: "add",
          click: ({ id }) => this.toDetail(id, "duplication")
        },
        {
          name: "Enable",
          type: "success",
          sign: "enable",
          permission: "editor",
          click: ({ id }) => this.Enable([id])
        },
        {
          name: "Disable",
          sign: "disabled",
          permission: "editor",
          click: ({ id }) => this.Disable([id]),
          bgc: "#f1f1f1",
          color: "#606266"
        },
        {
          name: "Delete",
          type: "danger",
          sign: "delete",
          permission: "delete",
          click: ({ id }) => this.Delete([id])
        },
      ],
      headBtns: [
        {
          name: "Batch Enable",
          sign: "enables",
          bgc: "#add698",
          permission: "editor",
          color: "white"
        },
        {
          name: "Batch Disable",
          sign: "disableds",
          permission: "editor",
          bgc: "#f1f1f1"
        },
        {
          name: "Batch Delete",
          sign: "deletes",
          // color:'white'
          permission: "delete",
          type: "danger"
        }
      ],
      pageSize: 10,
      total: 0,
      nowPage: 1,
      tableLoad: false,
      searchData: {},
      searchDataBackup: {},
      tableData: [],
      tableSelect: [],
      scriptOption: [],
      // 用于判断cell单元格有没有编辑状态
      noCellEditor: true,
      // 保存手动监听的返回值，用于统一销毁
      watchControl: []
    };
  },
  watch: {
    nowPage: {
      handler(val) {
        console.log("pageChange", val);
        this.getData();
      }
    },
    pageSize() {
      this.getData();
    },
    // 开启fieldsFilter之后及时记录选中展示字段，存在local里面
    checkList(val) {
      if (val.length > 0 && this.fieldsFilter) {
        let viewNameList = val.map(i => i.viewName).toString();
        // 项目模块和资源模块 模块名可能会重，这里用一级url做key
        localStorage.setItem(`aiSystem_${this.$route.path}_fields`, viewNameList);
      }
    },
    optionsBase: {
      handler(val) {
        this.optionsAll = val;
      },
      deep: true,
      immediate: true
    }
  },
  computed: {
    isSearchConOver() {
      return this.searchRanderLocal.length > 4;
    },
    filterTableData() {
      return this.tableRander.filter(i =>
        this.fieldsFilter ? !!this.checkList.find(e => e === i) : true
      );
    },
    searchRanderLocal: {
      get() {
        return this.searchRander;
      },
      set(val) {
        this.$emit("update:searchRander", val);
      }
    },
    optionsBase() {
      return this.$store.state.optionBase;
    },
    // 当前资源的权限
    permission() {
      let field = this.permissionName || this.pageName;
      if (this.permissionTrue) {
        return this.permissionTrue
      }
      let returnData;
      try {
        if (this.fromProject) {
          let id = this.$route.params["projId"];
          let returnDataFather =
            this.$store.state.permissionPage.program[id] || {};
          returnData = returnDataFather[field];
        } else {
          returnData = this.$store.state.permissionPage.resource[field];
        }
      } catch (errpr) {
        console.log(errpr);
      }
      return returnData || { add: true, editor: true, delete: true, view: true };
    },
    // baseUrl当前页面的计算值
    baseUrlLocal() {
      return this.baseUrl || this.$store.state.default_file_url;
    }
  },
  methods: {
    // 输入校验
    formatLimit(val, item) {
      let format = item.textFormat;
      if (format) {
        let reg = new RegExp(format, "g");
        if (item.textFormatAccord) {
          !reg.test(val) && (this.searchDataBackup[item.modelName] = "");
        } else if (reg.test(val)) {
          this.searchDataBackup[item.modelName] = val.replace(reg, "");
        }
      }
      // 如果存在input方法就触发,传递已经处理过的值
      item.input && item.input(this.data[item.modelName]);
    },
    // 点击打开抽屉
    openDrawer() {
      let state = this.checkTableIsEditor();
      if (state) {
        this.$message({
          message: "Please finish editing before setting",
          type: "warning"
        });
      } else {
        this.fieldsConfigDrawer = true;
      }
    },
    // check列表是否有编辑状态
    checkTableIsEditor() {
      let state = false;
      let array = this.tableRander;
      // tableRander中有option，应该去掉
      for (let item of array) {
        // this.$refs[item.viewName]存在并且是有length 的数组结构
        if (this.$refs[item.viewName] && this.$refs[item.viewName].length) {
          // console.log(item.viewName)
          for (let i = 0; i < this.$refs[item.viewName].length; i++) {
            let item2 = this.$refs[item.viewName][i];
            if (item2.editor) {
              state = true;
            }
          }
        }
      }
      return state;
    },
    // 重置展示的字段初始化
    drawerResetFields() {
      this.checkList = this.tableRander.filter(i => i.fieldsDefaultShow);
    },
    // 用于列的保存方法
    cellSave(updateData) {
      let requestUrl = "";
      if (this.pageName === "regularExercise") {
        requestUrl = "/res/regularExercise/updateOneCell";
      }
      requestUrl &&
        this.$request(
          requestUrl,
          updateData,
          res => {
            if (!res.error) {
              // 成功后给本地赋值
              // 获取当前修改的行
              let modifyRowData = this.tableData.filter(
                i => i.id === updateData.id
              )[0];
              modifyRowData[updateData.cellName] = updateData.cellValue;
              // 保存成功，查询列表是否存在对应id，如果有就将其修改
              let id = res.data.data;
              let dataMap = [];
              id && (dataMap = this.tableData.filter(i => i.id === id));
              // 对应赋值
              dataMap.length > 0 &&
                (dataMap[0][updateData.cellName] = updateData.cellValue);
            }
          },
          "post",
          false,
          false
        );
    },
    // 用于计算列宽
    columnWidthComputed(item) {
      let width = "";
      if (item.type == "option") {
        width = 260;
      }
      // 给编辑类型特殊定宽，不同组件宽度不一样
      if (item.editor) {
        if (item.editorType === "selects") {
          width = 180;
        }
      }
      item.width && (width = item.width);
      return width;
    },
    dataInit() {
      // search 初始化
      this.searchRanderLocal.some(item => {
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
        let defaultData = "";
        this.$set(this.searchData, item.modelName, defaultData);
        this.$set(this.searchDataBackup, item.modelName, defaultData);
        // if (item.type === "select") {
        //     this.searchDataBackup[item.modelName] = "";
        // }
      });
    },
    reset() {
      // search 初始化
      this.searchRanderLocal.some(item => {
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
        let defaultData = "";
        if (item.defaultData || item.defaultData == false) {
          defaultData = item.defaultData;
        }
        this.$set(this.searchData, item.modelName, defaultData);
        this.$set(this.searchDataBackup, item.modelName, defaultData);
        // if (item.type === "select") {
        //     this.searchDataBackup[item.modelName] = "";
        // }
      });
    },
    // Date选择快捷
    selectDate(modelNames, key) {
      let date = new Date();
      let day = date.getDate();
      let month = date.getMonth() + 1;
      let year = date.getFullYear();
      let time = date.getTime();
      if (key.constructor === Number) {
        key -= 1;
        let fillZeroMonth = month < 10;
        let fillZeroDay = day < 10;
        this.searchDataBackup[modelNames[1]] = `${year}-${fillZeroMonth ? "0" : ""
          }${month}-${fillZeroDay ? "0" : ""}${day}`;
        let DateNew = new Date(time - 24 * 3600 * 1000 * key);
        fillZeroMonth = DateNew.getMonth() + 1 < 10;
        fillZeroDay = DateNew.getDate() < 10;
        this.searchDataBackup[modelNames[0]] = `${DateNew.getFullYear()}-${fillZeroMonth ? "0" : ""
          }${DateNew.getMonth() + 1}-${fillZeroDay ? "0" : ""
          }${DateNew.getDate()}`;
      }
    },
    // option按钮点击前的验证触发
    async btnClickBefore(row, btnState) {
      // regularExercise的特殊校验
      let state = true;
      if (
        this.pageName === "regularExercise" &&
        row.combination === "Left & Right" &&
        btnState.sign != "view" &&
        btnState.sign != "duplication"
      ) {
        state = false;
        await this.$confirm(
          "This operation will work on both Left and Right data.",
          "",
          { type: "warning" }
        ).then(() => (state = true));
      }
      if (state) {
        // 给所有delete按钮一个默认询问
        if (btnState.sign === "delete") {
          let texts = "This will permanently delete the data. Continue?";
          if (this.pageName === "reminder") {
            texts =
              "This will permanently delete the data，and if the data is already used by the project, then the data will be removed from the project；Continue?";
          }
          this.$confirm(texts, "", { type: "warning" })
            .then(() => {
              btnState.click(row);
            })
            .catch(() => { });
        } else {
          btnState.click(row);
        }
      }
    },
    // 级联选中的默认方法
    cascaderChange(value, OptionItem) {
      let names = OptionItem.trueModelName;
      let func = OptionItem.change;
      if (value.length === 0) {
        this.searchDataBackup[names[0]] = "";
        this.searchDataBackup[names[1]] = "";
      }
      if (value.length != 0) {
        if (OptionItem.multiple) {
          // 一级字段选中
          value && (this.searchDataBackup[names[0]] = value[0][0]);
          // 二级字段选中
          value && (this.searchDataBackup[names[1]] = value.map(i => i[1]));
        } else {
          value &&
            names.some((item, index) => {
              this.searchDataBackup[item] = value[index] || "";
            });
        }
      }
      let data = func ? func(OptionItem) : "";
      data && (this.searchRanderLocal = data);
    },
    // 批处理按钮的公共执行方法
    async batchHandle(btnItem) {
      let sign = btnItem.sign;
      let text = "";
      let texts = "";
      if (
        this.pageName === "animation" ||
        this.pageName === "regularExercise" ||
        this.pageName === "programWorkout" ||
        this.pageName === "programCategory" ||
        this.pageName === "videoSlice" ||
        this.pageName === "workout"
      ) {
        if (sign === "enables") {
          text = "Disabled";
        }
        if (sign === "disableds") {
          text = "Enabled";
        }
        if (sign === "deletes") {
          text = "Draft";
        }
        texts = `Data status other than '${text}' will be ignored`;
      }
      if (this.pageName === "workoutScene") {
        if (sign === "deletes") {
          texts = `Tip: the used data will not be deleted.`;
        }
      }
      if (
        this.pageName === "poseLibrary" ||
        this.pageName === "workoutVideo105" ||
        this.pageName === "regularVideo" ||
        this.pageName === "video120" ||
        this.pageName === "workoutVideo111" ||
        this.pageName === "video111Library" ||
        this.pageName === "challenge111" ||
        this.pageName === "video106" ||
        this.pageName === "video105"
      ) {
        texts = `Confirm to continue?`
        if (sign === "disableds") {
          texts = 'This operation only applies to data in the "Enabled" status, confirm to continue?'
        }
        if (sign === "deletes" && (
          this.pageName != "workoutVideo105"
        )) {
          texts = 'This operation only applies to data in the "Not Enable" status, confirm to continue?'
        }
      }
      if (this.pageName === "sound" || this.pageName === "music") {
        if (sign === "enables") {
          text = "Draft-Done";
        }
        if (sign === "deletes") {
          text = "Draft";
        }
        texts = `Data status other than '${text}' will be ignored`;
      }
      if (this.pageName === "reminder") {
        texts =
          "This will permanently delete the data，and if the data is already used by the project, then the data will be removed from the project；Continue?";
      }
      if (
        this.pageName === "quote" ||
        this.pageName === "keyword" ||
        this.pageName === "dailyWorkout" ||
        this.pageName === "programCategory"
      ) {
        if (sign === "deletes") {
          texts = "This will permanently delete the data. Continue?";
        }
      }
      this.batchHandleBefore && (texts = this.batchHandleBefore(btnItem, texts))
      if (texts) {
        let answer;
        await this.$confirm(texts, "", { type: "warning" })
          .then(() => {
            answer = 1;
          })
          .catch(() => {
            answer = 0;
          });
        if (!answer) {
          return true;
        }
      }
      {
        let list = this.tableSelect.map(i => i.id);
        // 批启用
        if (sign === "enables") {
          if (
            this.pageName === "animation" ||
            this.pageName === "regularExercise"
          ) {
            list = this.$cutArray(
              this.tableSelect,
              { key: "status", value: 2 },
              "get"
            ).map(i => i.id);
          }
          if (this.pageName === "sound" || this.pageName === "music") {
            // 草稿并且压缩成功
            list = this.$cutArray(
              this.tableSelect,
              { key: "status", value: 0 },
              "get"
            );
            list = this.$cutArray(
              list,
              { key: "compressionStatus", value: 2 },
              "get"
            ).map(i => i.id);
          }
          if (list.length === 0) {
            return;
          }
          this.Enable(list);
        }
        // 批禁用
        if (sign === "disableds") {
          if (
            this.pageName === "animation" ||
            this.pageName === "regularExercise"
          ) {
            list = this.$cutArray(
              this.tableSelect,
              { key: "status", value: 1 },
              "get"
            ).map(i => i.id);
          }
          if (list.length === 0) {
            return;
          }
          this.Disable(list);
        }
        // 批删除
        if (sign === "deletes") {
          if (
            this.pageName === "animation" ||
            this.pageName === "regularExercise"
          ) {
            list = this.$cutArray(
              this.tableSelect,
              { key: "status", value: 0 },
              "get"
            ).map(i => i.id);
          }
          if (this.pageName === "sound" || this.pageName === "music") {
            list = this.$cutArray(
              this.tableSelect,
              { key: "status", value: 0 },
              "get"
            ).map(i => i.id);
          }
          if (list.length === 0) {
            return;
          }
          this.Delete(list);
        }
        // 存在自定义方法就执行
        btnItem.func && btnItem.func(list);
      }
    },
    // 根据权限设定按钮的显隐
    btnItemVerify(funcs, itemProperty, status, status2) {
      let state = true,
        sign = itemProperty.sign;

      // 1.外部组件是否包含该按钮，为空就全展示,没有sign的按钮默认直接展示
      if (funcs && sign && (funcs.split(',').indexOf(sign) === -1)) {
        state = false;
      }
      // 2.是否有当前功能的权限
      {
        let permission = this.permission;
        // 没有permission字段直接判定为通过
        if (itemProperty.permission) {
          let state2 = true
          itemProperty.permission.split(',').some(item => {
            permission[item] && (state2 = false)
          })
          state2 && (state = false)
        }
      }
      // 3.根据当前数据状态判定一些按钮是否展示（数据有状态这个字段情况下）
      // 0是草稿，得验证
      if (status || status === 0) {
        if (this.pageName === "regularExercise") {
          if (
            (status === 0 &&
              (sign === "view" ||
                sign === "delete" ||
                sign === "duplication")) ||
            (status === 1 &&
              (sign === "view" ||
                sign === "disabled" ||
                sign === "duplication")) ||
            (status === 2 &&
              (sign === "view" || sign === "enable" || sign === "duplication"))
          ) {
            1;
          } else {
            state = false;
          }
        }
        if (this.pageName === "sound" || this.pageName === "music") {
          // 在sound中 status2 为compressionStatus
          if (
            (status === 0 && (sign === "view" || sign === "delete")) ||
            (status === 0 && status2 === 2 && sign === "enable") ||
            (status === 1 && sign === "view")
          ) {
            1;
          } else {
            state = false;
          }
        }
        if (
          this.pageName === "workoutVideo" ||
          this.pageName === "playlist" ||
          this.pageName === "dailyImg" ||
          this.pageName === "template" ||
          this.pageName === "todayImage"
        ) {
          if (
            (status === 2 &&
              (sign === "view" || sign === "enable" || sign === "delete")) ||
            (status === 0 &&
              (sign === "view" || sign === "enable" || sign === "delete")) ||
            (status === 1 && (sign === "view" || sign === "disabled"))
          ) {
            1;
          } else {
            state = false;
          }
        }
        if (
          this.pageName === "regularVideo" ||
          this.pageName === "video120" ||
          this.pageName === "collection" ||
          (this.pageName === "video105" && !this.fromProject) ||
          (this.pageName === "poseLibrary" && !this.fromProject)
        ) {
          if (
            (status === 2 && (sign === "view" || sign === "enable")) ||
            (status === 0 &&
              (sign === "view" || sign === "enable" || sign === "delete")) ||
            (status === 1 && (sign === "view" || sign === "disabled"))
          ) {
            1;
          } else {
            state = false;
          }
        }
      }
      return state;
    },
    search() {
      // 日期校验
      let state = false;
      this.searchData = { ...this.searchDataBackup };
      this.searchRander.some(item => {
        let backupData = this.searchDataBackup;
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
            return true;
          }
        }
        // 清掉全选子属性的级联的子属性
        // 未选择的级联option有可能是字符串
        if (item.type === "cascader" && item.options.constructor === Array) {
          // 级联的option都已经获取了obj不再是字符串
          // 获取option,filter可能获取是空数组
          let options = item.options.filter(
            i => i.value === this.searchData[item.trueModelName[0]]
          )[0];
          options && (options = options.children);
          // 为处理的子数据是数组格式
          // 如果存在子option 转化成字符串数组,全选就清空子数据
          if (
            options &&
            options.map(i => i.value).toString() ===
            this.searchData[item.trueModelName[1]].toString()
          ) {
            this.searchData[item.trueModelName[1]] = "";
          }
        }
      });
      if (state) return true;
      // getData前定位到第一页
      this.nowPage = 1;
      this.getData();
    },
    jumpFunc(rowData) {
      this.toDetail(rowData.id)
    },
    toDetail(id, type) {
      // 跳转前记住数据
      this.$router.push(
        `${this.editorPageName}?id=${id ? id : "add"
        }${type ? "&" + type + "=" + type : ""}`
      );
    },
    handleSelectionChange(val) {
      this.tableSelect = val;
    },
    async Enable(idList) {
      if (this.EnableFunc) {
        await this.EnableFunc(idList);
      } else {
        await new Promise(reslove => {
          this.$request(
            `/${this.requestHeadLocal}/${this.pageName}/enable`,
            { idList },
            res => {
              reslove();
            }
          );
        });
      }
      this.getData();
    },
    async Disable(idList) {
      if (this.DisableFunc) {
        await this.DisableFunc(idList);
      } else {
        await new Promise(reslove => {
          this.$request(
            `/${this.requestHeadLocal}/${this.pageName}/disable`,
            { idList },
            res => {
              reslove();

            }
          );
        });
      }
      this.getData();
    },
    async Delete(idList) {
      if (this.DeleteFunc) {
        await this.DeleteFunc(idList);
      } else {
        await new Promise(reslove => {
          this.$request(
            `/${this.requestHeadLocal}/${this.pageName}/del`,
            { idList },
            res => {
              reslove()
            }
          );
        });
      }
      this.getData();
    },
    defaultGetList(data) {
      return new Promise(resolve => {
        this.$request(
          `/${this.requestHeadLocal}/${this.pageName}/page`,
          data,
          res => {
            resolve(res);
          },
          "get",
          false,
          false
        );
      });
    },
    async getData() {
      this.tableLoad = true;
      let uploadData = {
        ...this.searchData,
        pageNum: this.nowPage,
        pageSize: this.pageSize
      };
      Object.keys(uploadData).some(item => {
        if (uploadData[item] && uploadData[item].constructor === Array) {
          uploadData[item] = uploadData[item].toString();
        }
      });
      let res = this.getList
        ? await this.getList(uploadData)
        : await this.defaultGetList(uploadData);
      this.tableLoad = false;
      if (!res.error) {
        this.tableData = res.data.data?.list;
        // this.$refs.libraryTable.doLayout()
        // 由于分页组件的原因，不能赋空值会导致pageNum被赋空值导致，页面再次拉取list
        this.total = res.data.data.total || 0;
      }
    },
    readCache() {

    }
  },
  async created() {
    // 数据初始化
    {
      // res初始化
      if (this.fromProject) {
        this.requestHeadLocal = "proj";
      }
      if (this.requestHead) {
        this.requestHeadLocal = this.requestHead;
      }
      // search 初始化
      this.dataInit()
      // 初始化完成后加入监听
      this.searchRanderLocal.some(item => {
        let name = `searchDataBackup.${item.modelName}`
        this.watchControl.push(
          this.$watch(name, {
            handler: (val, old) => {
              // 避免重复赋值递归
              if (val == old) return true  
              if (item.change) {
                item.change(val, old)
              }
            }
          })
        )
        // 监听完毕后有些默认值也要触发change
        if (item.defaultData || item.defaultData == false) {
          let defaultData = item.defaultData
          this.searchDataBackup[item.modelName] = defaultData
        }

      })
      // pageName初始化
      this.pageName =
        this.pageNameTrue ||
        this.$route.path.split('/').at(-2);
    }
    // 表的缓存数据读取逻辑
    let PageCache = sessionStorage.getItem(this.$route.path + "#search");
    // 用于beforeDestroy读取正确的path
    this.$set(this, 'pagePath', this.$route.path)
    if (PageCache) {
      PageCache = JSON.parse(PageCache);
      PageCache.nowPage && (this.nowPage = Number(PageCache.nowPage));
      PageCache.pageSize && (this.pageSize = Number(PageCache.pageSize));
      // PageCache.searchData 需要解析赋值，直接赋值容易导致绑定值丢失
      Object.keys(PageCache.searchData).some(key => {
        this.searchData[key] = PageCache.searchData[key];
        this.searchDataBackup[key] = PageCache.searchData[key];
      })
    }
    // 读取完毕后清掉
    // sessionStorage.removeItem(this.$route.path + "#search");
    // 初始完毕后请求
    !this.startNoGetList && this.getData();
  },
  beforeDestroy() {
    let searchData = {}
    Object.keys(this.searchData).some(key => {
      if (this.searchData[key] !== '' && this.searchData[key]?.toString() != '') {
        searchData[key] = this.searchData[key]
      }
    })
    let Data = {
      searchData,
      nowPage: this.nowPage,
      pageSize: this.pageSize,
    };
    sessionStorage.setItem(this.pagePath + "#search", JSON.stringify(Data))
    // 销毁手动的监听
    this.watchControl.some(unWatch => {
      unWatch()
    })
  },
  mounted() {
    // 在开启fieldsFilter模式后 给checkList赋上初值
    if (this.fieldsFilter) {
      let localData = localStorage.getItem(`aiSystem_${this.$route.path}_fields`);
      if (localData) {
        localData = localData.split(",");
        let array = [];
        localData.some(viewName => {
          this.tableRander.some(item => {
            if (item.viewName === viewName) {
              array.push(item);
            }
          });
        });
        this.checkList = array;
      } else {
        this.drawerResetFields();
      }
    }
    // 页面渲染后加入列表排序
    if (this.sortable) {
      this.$sortable.create(
        this.$refs.libraryTable.$el.querySelectorAll("tbody")[0],
        {
          animation: 200,
          handle: ".move",
          filter: ".table-option",
          forceFallback: true,
          onEnd: evt => {
            // 循环获取内容lable值返回arrary
            const item = this.tableData[evt.oldIndex];
            this.tableData.splice(evt.oldIndex, 1);
            this.tableData.splice(evt.newIndex, 0, item);
            this.sortable(this.tableData);
          }
        }
      );
    }
  }
};
</script>

<style scoped>
.btn-df {
  font-size: 14px;
}

.right-btn button {
  margin-right: 0 !important;
  margin-left: 10px !important;
}

.el-table {
  /* color: #303133; */
  font-size: 14px;
}

.el-table>>>.tableHeadr {
  color: rgba(0, 0, 0, 0.6);
  background-color: #f2f3f5;
}

.el-table>>>.el-table__row * {
  text-transform: none;
}

.all {
  box-sizing: border-box;
  text-align: left;
  min-width: 1094px;
  /* margin-top: 15px; */
}

.title {
  font-size: 20px;
  margin: 0px 0 10px;
  text-transform: capitalize;
}

.search-con {
  padding: 0 2px;
  text-align: center;
  /* box-shadow: 0 0 10px rgba(0,0,0,0.2); */
  display: flex;
  flex-direction: column;
}

.search-container {
  display: flex;
  flex-wrap: wrap;
  width: 950px;
}

.search-con-end {
  flex: 1;
}

.search-item {
  display: flex;
  margin: 3.5px 80px 3.5px 0;
  font-size: 14px;
  max-width: 100%;
  align-items: center;
}

.search-item-text {
  text-align: left;
  margin-right: 5px;
  width: 100px;
  /* color: #303133; */
}

.search-con .el-select,
.search-con .el-cascader,
.search-con .el-input-number,
.search-con .el-input {
  width: 100%;
  /* margin-right: 10px; */
}

.btn-con {
  width: 90px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.btn-con .el-button {
  margin: 3.5px 0;
  width: 100%;
}

/* search-item-con自定义search子组件自适应宽度 */
.search-item-con {
  display: flex;
  width: 290px;
}

.search-item-con>.el-input,
.search-item-con>.el-input>input,
.search-item-con>.el-select>.el-input,
.search-item-con>.el-select>.el-input>input {
  flex: 1;
}

/* 自定义dates*/
.dates {
  /* margin-right: 10px; */
  display: flex;
  align-items: center;
}

.dates>.el-input {
  width: 135px;
}

.dates>div {
  /* margin-right: 5px; */
}

.dates>.hot-key span {
  font-size: 12px;
  color: #409eff;
}

.hot-key span {
  cursor: pointer;
  margin-right: 10px;
}

/* 自定义级联 */
.cascaderCustom>.el-select {
  margin: 0;
}

.table-all,
.search-con {
  box-shadow: 0 0 1px rgba(0, 0, 0, 0.1);
  border-radius: 2px;
  /* margin-top: 6px; */
  padding: 10px 20px;
  background-color: white;
}

.table-all {
  padding-bottom: 0px;
}

/* extend */
.more {
  color: #409eff;
  font-size: 14px;
  cursor: pointer;
}

/* 功能按钮列表 */
.move {
  cursor: pointer;
}

.func-btns {
  margin-bottom: 5px;
  display: flex;
  justify-content: space-between;
}

.func-btns .el-button {
  text-transform: capitalize;
  margin: 0 10px 0 0;
}

.customBtn:nth-last-child(1) {
  margin-right: 0;
}

/* 设置表的超出单元格隐藏  和 表的最大高度 */
/* .el-table >>> .el-table__body-wrapper {
    height: 400px;
    overflow-y: auto;
} */
/* 展开icon按钮颜色控制 */
.el-table>>>.el-table__expand-column i {
  color: #409EFF;
}

/* 表头设置 */
.el-table>>>.tableHeadr th {
  padding: 0;
  background-color: inherit;
}

.el-table>>>.tableHeadr th .table--head-item {
  padding: 0;
  height: 40px;
  display: flex;
  align-items: center;
  /* background-color: rgba(0, 0, 0, 0.5); */
}

.el-table>>>.el-table__row td .table-cell {
  width: 100%;
  height: 100%;
  position: relative;
}

.el-table>>>.el-table__row td {
  padding: 0;
}

.el-table>>>.el-table__row td .cell {
  height: 38px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
}

/* .el-table >>> .cell {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
} */
/* 设置表内单元格 和 表头的样式 */
.table--head-item {}

.table-input-text,
.table-input-select,
.table-option,
.table--head-item {
  padding: 12px 4px;
  width: 100%;
  height: inherit;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  height: 100%;
}

.table-input-img {
  width: 100%;
  height: 100%;
}

.table-input-img img {
  height: 100%;
  width: 100%;
  object-fit: contain;
}

/* 设置表内按钮样式 */
.table-option {
  /* 给予absolute定位用于覆盖掉空白的cell */
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  display: flex;
  align-items: center;
  padding: 0;
}

.table-option .el-button {
  padding: 4px 10px;
  margin-right: 5px;
  margin-left: 0;
}

.el-pagination {
  text-align: right;
  padding: 10px 0;
}

/* 打开抽屉的按钮样式 */
.drawer-open {
  position: fixed;
  width: 30px;
  right: 0;
  top: 104px;
  color: white;
  z-index: 5;
  background-color: #409eff;
  /* box-shadow: 0 0 5px rgba(0, 0, 0, 0.5); */
  border-radius: 3px;
}

.drawer-open:hover {
  /* color: black; */
}

.drawer-item {
  height: 30px;
  width: 30px;
}

.top-white-area {
  background-image: radial-gradient(30px at 0px 0px,
      rgba(0, 0, 0, 0) 100px,
      sandybrown 0px);
}

.center-area {
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 3px 0 0 3px;
}

.bottom-white-area {
  background-image: radial-gradient(30px at 0px 30px,
      rgba(0, 0, 0, 0) 100px,
      sandybrown 0px);
}

/* 抽屉内的样式 */
.drawer-con {
  padding: 0 20px;
}

.drwaer-btns {
  margin-top: 30px;
}
</style>