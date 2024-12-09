<template>
  <div class="editor-all">
    <div class="editor-con" v-loading="pageLoadState">
      <!-- <div
        class="editor-head"
        :style="add && 'background-color:#eaf4fe'"
      >{{ pageTitle || pageName }} {{ add ? "add" : "editor" }}</div>-->
      <div class="form-con" ref="form-con">
        <div :class="`kuai ${errorText[item.modelName] && 'kuai-main-error'} ${item.rowClass ? item.rowClass : ''}`"
          v-for="item in renderData" :key="item.key" v-show="!item.noShow" :ref="item.modelName">
          <div :class="`kuai-con ${item['oneRow'] ? 'oneRow' : ''}`">
            <div class="kuai-name">
              <div>
                <span v-if="item.must" style="color: #f56c6c">*</span>
                {{ item.showName || item.key }}
                <span v-if="item.type === 'selects'" class="format">(multi-select)</span>
                <i v-if="item.point" :data-title="item.point" class="el-icon-question point"></i>
                :
              </div>
            </div>
            <div v-if="item.slotNameBefore" :class="`kuai-con-item-before ${item.slotNameBefore}`">
              <slot :name="item.slotNameBefore" :item="item" :optionsAll="optionsAll"></slot>
            </div>
            <div class="kuai-con-item">
              <!-- <div v-if="item.type === 'input' || item.type === 'textarea'" class="input">
                <el-input v-model="data[item.modelName]" size="mini" :rows="8"
                  :type="item.type === 'input' ? 'text' : 'textarea'" :show-word-limit="!item.noShoWord"
                  :maxlength="item.maxlength || (item.type === 'input' ? '50' : '250')" :disabled="disabledCheck(item)"
                  :placeholder="item.placeholder" @input="(val) => formatLimit(val, item)"></el-input>
              </div> -->
              <div 
              v-if="item.type === 'select' || item.type === 'selects' || item.type === 'file' || item.type === 'input' || item.type === 'textarea'"
              class="kuai-component-con">
                <ComponentTemplate
                  :data.sync="data[item.modelName]" :renderItem="item" :dataFromObj="data" :baseUrl="baseUrlLocal"
                  :selectFocus="() => selectFocus(item)" :load.sync="loadAll[item.modelName]" ref="component"
                  :disabled="disabledCheck(item)" :isShowKey="false" :uploadFile="uploadFileFunc"></ComponentTemplate>
              </div>
              <!-- 下拉框 -->
              <!-- <div v-if="item.type === 'select' || item.type === 'selects'">
                <Select :data.sync="data[item.modelName]" :renderItem="item" :selectFocus="() => selectFocus(item)"
                  :load.sync="loadAll[item.modelName]"
                  :options="item.options.constructor === String ? optionsAll[item.options] : item.options"
                  :disabled="disabledCheck(item)"></Select>
              </div> -->
              <!-- 多个复选框 -->
              <div v-if="item.type === 'checkboxs'">
                <CheckBoxs :data.sync="data[item.modelName]"
                  :options="item.options.constructor === String ? optionsAll[item.options] : item.options"
                  :renderItem="item"></CheckBoxs>
                <!-- <el-checkbox-group v-model="data[item.modelName]">
                  <el-checkbox
                    v-for="item2 in item.options.constructor === String ? optionsAll[item.options] : item.options"
                    :disabled="disabledCheck(item2)" :label="item2.value" :key="item2.value">{{ item2.label
                    }}</el-checkbox>
                </el-checkbox-group> -->
              </div>
              <!-- 单选框 -->
              <div v-if="item.type === 'radio'">
                <el-radio-group v-model="data[item.modelName]" @input="(val) => seletChange(val, item)">
                  <el-radio
                    v-for="item2 in item.options.constructor === String ? optionsAll[item.options] : item.options"
                    :disabled="disabledCheck(item2)" :label="item2[item.uploadLabel ? 'label' : 'value']"
                    :key="item2.label">{{ item2.label }}</el-radio>
                </el-radio-group>
              </div>
              <!-- 媒体 -->
              <!-- <div class="kuai-media" v-if="item.type === 'video' || item.type === 'audio'">
                <div class="kuai-media-upload">
                  <el-button @click="selectFile(item)" size="mini" type="primary" :loading="loadAll[item.modelName]"
                    :disabled="item.disabled || loadAll[item.modelName]">Click to upload</el-button>
                  <div class="format">
                    (format:
                    {{ item.format || (item.type === "video" ? "mp4" : "mp3") }}
                    {{
                      (item.maxSize || item.minSize) &&
                      `,${item.minSize ? item.minSize + "M &lt;=" : ""} size ${item.maxSize && "&lt;= " + item.maxSize +
                      "M"}`
                    }}
                    )
                  </div>
                </div>
                <div v-if="data[item.timeModel] && item.type === 'video'" style="line-height: 32px">{{
                  data[item.timeModel] / 1000 }} s</div>
                <div class="video-con">
                  <video :style="item.type === 'video' ? 'height:150px' : ''"
                    v-show="!!data[item.modelName] && (item.filerHandle ? item.filerHandle(data, item) : true)"
                    :src="item.localFiled ? localData[item.localFiled] : (baseUrlLocal + data[item.modelName])"
                    :ref="item.modelName" controls></video>
                  <i class="el-icon-error field-delete-btn hover" @click="clearFieldData(item)"></i>
                </div>
                <div v-if="item.filerHandle && !item.filerHandle(data, item) && data[item.modelName]">{{
                  item.filerHandleText || "Processing..." }}</div>
              </div> -->
              <!-- checkbox -->
              <div v-if="item.type === 'checkbox'">
                <p style="height: 5px"></p>
                <el-checkbox :true-label="item.aloneLimit ? item.aloneLimit.on : 1"
                  :false-label="item.aloneLimit ? item.aloneLimit.off : 0" v-model="data[item.modelName]"
                  :disabled="disabledCheck(item)"></el-checkbox>
              </div>
              <!-- file upload  -->
              <!-- <div v-if="item.type === 'file'">
                <UploadFile :data.sync="data[item.modelName]" :renderItem="item" :uploadFile="uploadFileFunc"
                  :baseUrl="baseUrlLocal" :load.sync="loadAll[item.modelName]" :dataFromObj="data"></UploadFile>
              </div> -->
              <!-- switch -->
              <div v-if="item.type === 'switch'">
                <el-switch :width="50" v-model="data[item.modelName]" :active-color="item.options.on.color || '#13ce66'"
                  :inactive-color="item.options.off.color || '#ff4949'" :disabled="disabledCheck(item)"
                  :active-value="item.options.on.value" :inactive-value="item.options.off.value"
                  :active-text="item.options.on.text || 'on'" :inactive-text="item.options.off.text || 'off'"
                  @change="(val) => item.change && item.change(val)"></el-switch>
              </div>
              <!-- date -->
              <div v-if="item.type === 'date'">
                <el-date-picker v-model="data[item.modelName]" size="mini" :type="item.dateType || 'date'"
                  placeholder="select date" :disabled="disabledCheck(item)"
                  :value-format="item.valueFormat || 'yyyy-MM-dd'"></el-date-picker>
              </div>
              <!-- dates -->
              <div v-if="item.type === 'dates'" class="dates">
                <dates :startTime.sync="data[item.trueModelName[0]]" :endTime.sync="data[item.trueModelName[1]]"
                  v-bind="{ ...item }" :dataFromObj="data" :data.sync="data[item.modelName]" :renderItem="item"
                  :errorText.sync="errorText[item.modelName]" ref="dates"></dates>
              </div>
              <!-- slot自定义插槽 -->
              <div v-if="item.type === 'slot'" style="flex:1">
                <slot :name="item.slotName" :renderItem="item"></slot>
              </div>
              <div v-if="item.type === 'cascader'">
                <!-- cascader级联选择器 -->
                <el-cascader popper-class="cascader-cascader" v-model="data[item.modelName]"
                  :options="item.options && (item.options.constructor === String ? optionsAll[item.options] : item.options)"
                  :props="item.props || { expandTrigger: 'hover', multiple: item.multiple, }" clearable
                  @change="(value) => cascaderChange(value, item)" size="mini"></el-cascader>
              </div>
              <!-- 自定义穿梭框 -->
              <div v-if="item.type === 'transfer'" class="transfer">
                <transfer :ref="item.ref || 'transfer'" searchKey="title" :transferBase="item.transferBase"
                  :model.sync="data[item.modelName]" :sign="item.modelName" :showRender="item.showRender"
                  :searchRander="item.searchRander" :localSearchRander="item.localSearchRander" :repeat="item.repeat"
                  :getBase="item.getBase" :pageSize="item.pageSize" :dataRender="item.dataRender"
                  :uploadFieldTransform="item.uploadFieldTransform" :localSearchFunc="item.localSearchFunc"
                  :BasekeyID="item.BasekeyID" :DatakeyID="item.DatakeyID" :sortable="item.sortable"
                  :selectAll="item.selectAll" :TreeTableState="item.TreeTableState"
                  :TreeTableRander="item.TreeTableRander" :baseUrl="baseUrlLocal" :noPagin="item.noPagin"
                  :maxlength="item.maxlength" :renderItem="item" v-bind="{ ...item }"></transfer>
              </div>
              <!-- 富文本 -->
              <div v-if="item.type === 'richText'" class="rich-text">
                <editor :textvalue.sync="data[item.modelName]"></editor>
              </div>
              <!-- customTable 自定义table表 -->
              <div v-if="item.type === 'table'" class="table">
                <custom-table :data.sync="data[item.modelName]" :renderItem="item" :optionsBtns="optionsBtns"
                  :baseUrl="baseUrlLocal"></custom-table>
              </div>
              <!-- TabRanderList -->
              <div v-if="item.type === 'TabRanderList'">
                <TabRanderList :baseUrl="baseUrlLocal" :data.sync="data[item.modelName]" :uploadFile="uploadFileFunc"
                  :maxlength="item.maxlength"
                  :renderItem="item"></TabRanderList>
              </div>
              <div v-if="item.type === 'custom'" style="color:#606266;font-size:12px">{{ item.custom(data) }}</div>
              <!-- 自定义类型 输入列表渲染 -->
              <div v-if="item.type === 'renderList'" class="rich-text">
                <renderList :data.sync="data[item.modelName]" :renderItem="item"></renderList>
              </div>
              <!-- 自定义类型 计算数据展示 -->
              <div v-if="item.type === 'computed'" class="rich-text" style="padding-top: 5px">
                <computed :data="data" :func="item.computedFunc" :model.sync="data[item.modelName]"
                  :errorText.sync="errorText[item.modelName]" :errorTextString="item.errorText"
                  :formatFunc="item.formatFunc" :computedFunc="item.computedFunc" :disabled="disabledCheck(item)">
                </computed>
              </div>
              <div class="kuai-end"></div>
            </div>
            <div v-if="item.slotNameAfter" :class="`kuai-con-item-after ${item.slotNameAfter}`">
              <slot :name="item.slotNameAfter" :item="item" :optionsAll="optionsAll"></slot>
            </div>
          </div>
          <div class="kuai-error">
            <div v-show="errorText[item.modelName]">{{ errorText[item.modelName] }}</div>
          </div>
        </div>
      </div>
      <div class="btns" v-if="hideBtn === true ? false : true">
        <el-button class="save-btn" size="small" type="primary" @click="SaveBefore"
          v-show="checkoutShow()">Save</el-button>
        <el-button size="small" v-show="checkoutShow()" @click="SaveToDraft" v-if="SaveAsDraftState"
          style="background-color:#f1f1f1">Save as Draft</el-button>
        <el-button class="back-list" size="small" @click="backFunc ?
          backFunc() :
          $router.push(
            backRouter ||
            `list`
          )
          ">Back to List</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import renderList from "./common/renderList.vue";
import editor from "./common/Editer.vue";
import transfer from "./common/TransferTemplate.vue";
import computed from "./common/Computed.vue";
import dates from "./common/DateRange.vue";
// import UploadFile from "./common/UploadFile.vue";
import TabRanderList from "./common/TabListCustom.vue";
import customTable from "./common/Table.vue";
import CheckBoxs from "./common/CheckBoxs.vue";
import ComponentTemplate from "./common/ComponentTemplate.vue";
export default {
  components: {
    transfer,
    editor,
    renderList,
    computed,
    dates,
    // UploadFile,
    ComponentTemplate,
    TabRanderList,
    CheckBoxs,
    customTable
  },
  data() {
    return {
      // editor页面的生命周期 null => created => defaultLoaded => dataLoaded 
      pageState: null,
      pageLoadState: false,
      loadAll: {},
      disabled2: false,
      add: false,
      duplication: false,
      errorText: {},
      pageName: "",
      optionsAll: {},
      pageId: "",
      requestHeadLocal: "res",
      // 备份数据，用于和新数据做比较
      backupData: {},
      // 用于页面本地渲染不上传的渲染字段
      localData: {},
      optionsBtns: [
        {
          icon: "el-icon-delete",
          sign: "delete",
          type: "danger",
          click: (rowData, index, renderItem) => {
            this.data[renderItem.modelName].splice(index, 1)
          }
        }
      ],
      // 保存手动监听的返回值，用于统一销毁
      watchControl: []
    };
  },
  props: {
    // 用于渲染页面的的数组
    render: Array,
    // 草稿状态下的必填字段
    draftMustFields: [String, Array],
    // 页面的数据对象
    modelData: Object,
    // 自定义保存的方法
    handlerSave: Function,
    // 自定义mounted后的执行方法
    handleLoad: Function,
    // 尾部的按钮的展示，默认展示，默认为flash
    hideBtn: Boolean,
    // 为true时id从localStorage中获取
    idFromSession: {
      type: Boolean,
      default: false
    },
    // 自定义的展示title，默认使用pageName
    pageTitle: String,
    // 自定义真实的pageName,会覆盖掉默认pageName
    pageNameTrue: String,
    // 自定义获取详情数据的方法
    getDetil: Function,
    // 自定义保存为草稿方法
    SaveDraftBtn: Function,
    // 所有请求访问的head公共字段
    requestHead: {
      type: String
    },
    // 保存成功后返回的路由默认为 pageName + 'list'
    backRouter: [String, Number],
    // 保存成功的执行方法返回方法
    backFunc: Function,
    // 跳转列表页的路由 Name
    listPageName: {
      type: String,
      default: 'list'
    },
    // 是否是项目
    fromProject: Boolean,
    // 获取页面详情之后，数据默认验证之前执行的参数
    getDataAfter: Function,
    // 获取详情给data赋值之后
    changeDataAfter: Function,
    // 用于保存前对数据单独的校验
    SaveBeforeCheck: Function,
    // 用于保存前对数据的转化（因为有草稿模式，要把校验和转化分开）
    SaveBeforTransform: Function,
    // 用于当前页全局的baseUrl
    baseUrl: String,
    // 当前页上传方法
    pageUploadFile: Function
  },
  computed: {
    uploadFileFunc() {
      return this.pageUploadFile || this.$uploadFile().fireBase;
    },
    renderData: {
      get() {
        return this.render;
      },
      set(val) {
        this.$emit("update:render", val);
      }
    },
    data: {
      get() {
        return this.modelData || {};
      },
      set(val) {
        this.$emit("update:modelData", val);
      }
    },
    optionsBase() {
      let optionBase = this.$store.state.optionBase;
      return optionBase;
    },
    Permissions() {
      let permission = this.$store.state.permissionPage;
      // info add的特殊情况做权限
      if (this.pageName === "info" && this.add) {
        return permission.program;
      }
      permission = this.fromProject
        ? permission.program[this.$route.params["projId"]]
        : permission.resource || {};
      // 不存在权限key的给所有权限
      permission = (permission && permission[this.pageName]) || { add: true, editor: true, delete: true, view: true };
      // 开发模式给所有权限
      if (process.env.NODE_ENV === 'development') {
        permission = { editor: true, view: true, delete: true, add: true }
      }
      return permission;
    },
    // 保存为草稿的按钮显示校验
    SaveAsDraftState() {
      let state = false;
      if (this.SaveDraftBtn) {
        return this.SaveDraftBtn();
      } else {
        (this.add || this.data.status === 0) && (state = true);
      }
      // 不存在草稿的必传字段情况下，一定没有保存为草稿按钮
      if (!this.draftMustFields) {
        state = false;
      }
      return state;
    },
    // baseUrl当前页面的计算值
    baseUrlLocal() {
      return this.baseUrl || this.$store.state.default_file_url;
    }
  },
  watch: {
    // optionsBase 直接获取的store的数据，为了做分隔开使用optionsAll
    optionsBase: {
      handler(val) {
        // // 初始化remote类型的option
        // this.renderData
        //   .filter(i => i.remote)
        //   .some(item => {
        //     if (!this.optionsAll[item.options]) {
        //       val[item.options] = [];
        //     } else {
        //       val[item.options] = this.optionsAll[item.options];
        //     }
        //   });
        this.optionsAll = val;
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    // 清除字段的值
    clearFieldData(item) {
      this.data[item.modelName] = "";
    },
    // disabled校验
    disabledCheck(item) {
      return item.disabled || (!this.add && item.addAfterNotChange);
    },
    // 底部按钮权限控制的显隐
    checkoutShow() {
      let state = false;
      if (this.add ? this.Permissions.add : this.Permissions.editor) {
        state = true;
      }
      return state;
    },
    // 级联选中的默认方法
    cascaderChange(value, OptionItem) {
      let names = OptionItem.trueModelName;
      let func = OptionItem.change;
      if (value.length === 0) {
        this.data[names[0]] = "";
        // 多选的子属性是数组类型
        this.data[names[1]] = OptionItem.multiple ? [] : "";
      }
      if (value.length != 0) {
        if (OptionItem.multiple) {
          // 一级字段选中
          value && (this.data[names[0]] = value[0][0]);
          // 二级字段选中,字段存在
          value[0][1] && (this.data[names[1]] = value.map(i => i[1]));
        } else {
          value &&
            value.some((item, index) => {
              this.data[names[index]] = item;
            });
        }
      }
      let data = func ? func(OptionItem) : "";
      data && (this.renderData = data);
    },
    SaveToDraft() {
      if (this.draftMustFields) {
        let draftMustFields = this.draftMustFields;
        let state = true;
        if (draftMustFields.constructor === String) {
          draftMustFields = draftMustFields.split(",");
        }
        draftMustFields.some(draftMustField => {
          if (!this.modelData[draftMustField]) {
            let nullErrorText = this.renderData.filter(
              i => i.modelName === draftMustField
            )[0].nullErrorText;
            this.errorText[draftMustField] =
              nullErrorText || "Can not be empty";
            state = false;
          }
        });
        if (state) {
          // SaveBeforeHandle
          let data = this.$deepCopy(this.data);
          this.SaveBeforTransform && this.SaveBeforTransform(data);
          if (!state) {
            return true;
          }
          this.pageLoadState = true;
          let path = this.add
            ? `/${this.requestHeadLocal}/${this.pageName}/addAsDraft`
            : `/${this.requestHeadLocal}/${this.pageName}/updateAsDraft`;
          this.$request(
            path,
            data,
            res => {
              this.pageLoadState = false;
              if (!res.error)
                this.backFunc ? this.backFunc() :
                  this.$router.push(
                    this.backRouter ||
                    `list`
                  );
            },
            "post",
            false,
            true
          );
        }
      }
    },
    formatLimit(val, item) {
      // 输入前先清除 error text，（实际上改为change触发是最符合逻辑的，focus和blur都会有不准确的情况）
      this.errorText[item.modelName] = ''
      let format = item.textFormat;
      if (format) {
        let reg = new RegExp(format, "g");
        if (item.textFormatAccord) {
          !reg.test(val) && (this.data[item.modelName] = "");
        } else if (reg.test(val)) {
          this.data[item.modelName] = val.replace(reg, "");
        }
      }
      // 如果存在input方法就触发,传递已经处理过的值
      item.input && item.input(this.data[item.modelName]);
    },
    selectFocus(item) {
      // 给所有远程查询并且有数据的下拉列表一个聚焦复制的功能
      if (item.remote && item.type === "select") {
        let value = this.data[item.modelName];
        let text = "";
        if (value) {
          text = item.options?.filter(i => i.value === value)[0].label;
        }
        if (text) {
          const clipboardObj = navigator.clipboard;
          if (clipboardObj) {
            clipboardObj.writeText(text);
          } else {
            // 安全限制下只能用老办法
            let input = document.createElement("input");
            input.style.position = "absolute";
            input.style.top = "-100%";
            document.documentElement.appendChild(input);
            input.value = text;
            input.select();
            document.execCommand("Copy");
          }
        }
      }
    },
    seletChange(val, item) {
      let modelName = item.modelName;
      // 对数组进行首字母adc排序
      if (typeof this.data[modelName] === "object") {
        this.data[modelName] = this.data[modelName].sort();
      }
      item.change && item.change(val, item);
      // if (typeof array === "object") {
      //     for (let i = 0; i < array.length; i++) {
      //         for (let j = 0; j < array.length; j++) {
      //             if (j > 0) {
      //                 let oldItem = array[j - 1];
      //                 let nowItem = array[j]
      //                 if(oldItem)
      //             }
      //         }
      //     }
      // }
    },
    loadend(item) {
      this.loadAll[item.modelName] = false;
    },
    // 上传到服务器
    async uploadFile(file, func, name, dirKey, item) {
      this.loadAll[name] = true;
      let urlObj = {};
      if (item.compressionFile) {
        // 压缩的话需要提供本地路径
        urlObj = await this.$uploadFile().comPress({ file, dirKey: dirKey });
        func(urlObj.fileUrl, urlObj.localUrl);
      } else {
        urlObj = await this.uploadFileFunc({ file, dirKey: dirKey });
        func(urlObj.fileRelativeUrl);
      }
    },
    selectFile(obj) {
      if (obj.disabled) {
        return true;
      }
      // request
      let type = obj.type;
      let modelName = obj.modelName;
      // 如果要展示时间给时间一个model
      let timeModel = obj.timeModel;
      // 文件格式
      let format = obj.format;
      // 文件上传的 bucket
      let dirKey = obj.dirKey;
      // 文件最大大小
      let maxSize = obj.maxSize;
      // 文件最小限制
      let minSize = obj.minSize;
      let files = document.createElement("input");
      files.type = "file";
      files.onchange = async () => {
        let file = files.files[0];
        // 类型校验(后缀名校验)
        {
          let state = false;
          // format为空
          if (!format) {
            if (file.type.indexOf(type) === -1) {
              state = true;
            }
          } else if (file.name.indexOf(format) === -1) {
            state = true;
          }
          if (state) {
            this.$message({
              message: `Must be ${format || type}`,
              type: "warning"
            });
            return false;
          }
        }
        // // 名字校验赋值
        // if (/_([^_]{1,})\./.test(file.name)) {
        //     this.data[name] = /_([^_]{1,})\./.exec(file.name)[1];
        // } else {
        //     this.data[name] = /([^0]{1,})\./.exec(file.name)[1];
        // }

        // 文件大小校验
        if (maxSize || minSize) {
          // 默认单位是1MB
          // 默认最大为10GB
          let size = file.size / 1024 / 1024;
          maxSize = maxSize || 1024 * 10;
          minSize = minSize || 0;
          if (size > maxSize || size < minSize) {
            this.$message({
              message: `File size ranges from ${minSize}MB to ${maxSize}MB`,
              type: "warning"
            });
            return true;
          }
        }
        // 图片比例像素大小限制
        if (type === "image" && obj.limit) {
          let a = document.createElement("img");
          a.src = URL.createObjectURL(file);
          await new Promise(resolve => {
            a.onload = () => {
              resolve();
            };
          });
          if (obj.limit) {
            if (
              (obj.limit[2] === "==" &&
                !(a.width === obj.limit[0] && a.height === obj.limit[1])) ||
              (obj.limit[2] === ">" &&
                !(a.width > obj.limit[0] && a.height > obj.limit[1])) ||
              (obj.limit[2] === ">=" &&
                !(a.width >= obj.limit[0] && a.height >= obj.limit[1])) ||
              (obj.limit[2] === "<" &&
                !(a.width < obj.limit[0] && a.height < obj.limit[1])) ||
              (obj.limit[2] === "<=" &&
                !(a.width <= obj.limit[0] && a.height <= obj.limit[1]))
            ) {
              this.$message({
                message: "Incorrect size",
                type: "warning"
              });
              return true;
            }
          }
        }
        // 上传
        this.disabled2 = true;
        this.uploadFile(
          file,
          (url, localUrl) => {
            this.disabled2 = false;
            if (url === "error") {
              // 因为出现了错误，统一关闭加载状态
              this.loadAll[modelName] = false;
              return true;
            }
            // this.loadAll[modelName] = false;
            // 图片上传完毕后再等加载完成再取消掉load状态
            if (type != "image") {
              this.loadAll[modelName] = false;
            }
            // 给容器赋上路径
            this.data[modelName] = url;
            // 同步字段存在，并且没有值的情况下，将数据同步过去，因为是url不考虑值为0和false
            obj.syncField &&
              obj.syncField.some(i => {
                !this.data[i] && (this.data[i] = url);
              });
            // 需要获取时长进行赋值
            if (timeModel) {
              let video = document.createElement("video");
              video.src = obj.compressionFile
                ? localUrl
                : this.baseUrlLocal + url;
              video.onloadeddata = () => {
                this.data[timeModel] = parseInt(video.duration * 1000);
              };
            }
          },
          modelName,
          dirKey,
          obj
        );
      };
      files.click();
    },
    // 保存前的校验
    async SaveBefore() {
      // 用于总的校验状态
      let state = true;
      // 校验前清空错误提示 (废弃，改为单个单个校验顺序进行控制)
      // Object.keys(this.errorText).some(item => (this.errorText[item] = ""));
      // 子组件内部校验(已废弃)
      // {
      //   this.$refs["dates"]?.some(item => {
      //     item.SaveBeforeCheck();
      //   });
      // }

      this.renderData.some(item => {
        let itemState = true
        // 首先进行自定义校验,错误提示在check内部就进行
        if (item.check) {
          let checkText = item.check({ ...item })
          this.errorText[item.modelName] = checkText || ''
        }
        // must校验
        {
          // trim去字符串空格
          if (typeof this.data[item.modelName] === "string") {
            this.data[item.modelName] = this.data[item.modelName].trim();
          }
          if (
            item.must &&
            (!this.data[item.modelName] ||
              (this.data[item.modelName].constructor === Array &&
                this.data[item.modelName].length === 0)) &&
            this.data[item.modelName] !== 0 &&
            this.data[item.modelName] !== false &&
            item.modelName &&
            !item.noShow
          ) {
            state = false;
            itemState = false
          }
          // 有timeModel字段特殊校验
          if (
            item.must &&
            item.timeModel &&
            (
              !this.data[item.timeModel] ||
              (this.data[item.timeModel].constructor === Array && this.data[item.timeModel].length === 0)
            ) &&
            this.data[item.timeModel] !== false &&
            item.timeModel &&
            !item.noShow
          ) {
            state = false;
            itemState = false
          }
          if (!itemState) {
            this.errorText[item.modelName] =
              item.nullErrorText || "Can not be empty";
            // 通过must校验，如果此时有must的error就clear
          } else if (this.errorText[item.modelName] === "Can not be empty") {
            this.errorText[item.modelName] = ''
          }
        }
        // Tabplaylist特殊must校验
        if (item.type === "TabRanderList") {
          let fieldName = "";
          item.children
            .filter(i => i.must)
            .some(renderItem => {
              this.data[item.modelName] &&
                this.data[item.modelName].some(dataItem => {
                  // 只要有一个为空
                  if (
                    !dataItem[renderItem.modelName] &&
                    dataItem[renderItem.modelName] !== 0 &&
                    dataItem[renderItem.modelName] !== false
                  ) {
                    state = false;
                    fieldName = renderItem.key;
                  }
                  // timeModel字段校验
                  if (
                    renderItem.timeModel &&
                    !dataItem[renderItem.timeModel] &&
                    !dataItem[renderItem.timeModel] != 0 &&
                    !dataItem[renderItem.timeModel] != false
                  ) {
                    state = false;
                    fieldName = renderItem.key;
                  }
                });
            });
          if (!state && fieldName) {
            this.$message({
              message: `'${fieldName}' in '${item.key}' cannot be empty`,
              type: "warning"
            });
            return true;
          }
        }
        // 穿梭框的特殊must校验
        if (item.type === "transfer") {
          let fieldName = "";
          item.dataRender &&
            item.dataRender
              .filter(i => i.editor && i.must)
              .some(renderItem => {
                this.data[item.modelName] &&
                  this.data[item.modelName].some(dataItem => {
                    // 只要有一个为空
                    if (
                      !dataItem[renderItem.modelName] &&
                      dataItem[renderItem.modelName] !== 0 &&
                      dataItem[renderItem.modelName] !== false
                    ) {
                      state = false;
                      fieldName = renderItem.name;
                    }
                  });
              });
          item.TreeTableRander &&
            item.TreeTableRander.filter(i => i.editor && i.must).some(
              renderItem => {
                this.data[item.modelName] &&
                  this.data[item.modelName].some(dataItem => {
                    // 只要有一个为空
                    if (
                      !dataItem[renderItem.modelName] &&
                      dataItem[renderItem.modelName] != 0 &&
                      dataItem[renderItem.modelName] != false
                    ) {
                      state = false;
                      fieldName = renderItem.name;
                    }
                  });
              }
            );
          if (!state && fieldName) {
            this.$message({
              message: `'${fieldName}' in '${item.key}' cannot be empty`,
              type: "warning"
            });
            return true;
          }
        }
        // 穿梭框的特殊must校验
        if (item.type === "table") {
          let fieldName = "";
          item.dataRender &&
            item.dataRender
              .filter(i => i.editor && i.must)
              .some(renderItem => {
                this.data[item.modelName] &&
                  this.data[item.modelName].some(dataItem => {
                    // 只要有一个为空
                    if (
                      !dataItem[renderItem.modelName] &&
                      dataItem[renderItem.modelName] !== 0 &&
                      dataItem[renderItem.modelName] !== false
                    ) {
                      state = false;
                      fieldName = renderItem.name;
                    }
                  });
              });
          if (!state && fieldName) {
            this.$message({
              message: `'${fieldName}' in '${item.key}' cannot be empty`,
              type: "warning"
            });
            this.errorText
            return true;
          }
        }
        // if (
        //     item.type === "input" &&
        //     typeof this.data[item.modelName] === "string"
        // ) {
        //     this.data[item.modelName] = this.data[item.modelName].trim();
        // }
      });
      // Error校验
      let top = 0
      Object.keys(this.errorText).some(modelName => {
        if (this.errorText[modelName]) {
          state = false;
          if (top === 0) { top = this.$refs[modelName][0].offsetTop }
          this.$refs[modelName][0].offsetTop < top && (top = this.$refs[modelName][0].offsetTop)
        }
      });
      top && this.$refs['form-con'].scrollTo({ top, behavior: "smooth" })
      if (state) {
        let data = this.$deepCopy(this.data);
        this.SaveBeforeCheck && (state = this.SaveBeforeCheck(data));
        if (!state) {
          return true;
        }
        this.SaveBeforTransform && this.SaveBeforTransform(data);
        // Object.keys(this.data).some(item => {
        //     if(this.data[item] || this.data[item] === 0 || this.data[item] === false){
        //         data[item] = this.data[item]
        //     }
        // })
        this.pageLoadState = true;
        let res = await this.handlerSave ? this.handlerSave(data) : this.defaultSave(data);
        if (!res.error) {
          this.backFunc ? this.backFunc() :
            this.$router.push(
              this.backRouter || 'list');
        }
      }
    },
    async defaultSave(data) {
      return new Promise(resolve => {
        let path = this.add
          ? `/${this.requestHeadLocal}/${this.pageName}/add`
          : `/${this.requestHeadLocal}/${this.pageName}/update`;
        this.$request(
          path,
          data,
          res => resolve(res),
          "post",
          false,
          true
        );
      })
    },
    echoed(item, data) {
      // 对远程查询的数据进行还原
      if (item.remote && data[item.modelName]) {
        // selects 的options数据是通过返回的modelName数据进行反向转化
        if (item.type === "selects") {
          let ids = []
          item.options.push(...data[item.modelName].map(i => {
            let reObj = {
              value: i[item.idName] || i.id,
              label: i[item.labelName]
            };
            if (ids.indexOf(reObj.value) != -1) {
              reObj.repeat = true
            } else {
              ids.push(reObj.value)
            }
            return reObj
          }).filter(i => !i.repeat)
          );
          data[item.modelName] = data[item.modelName].map(
            i => i[item.idName] || i.id
          );
        }
        // select 获取的只有一个实际值，所以options得通过单独一个 optionModelName 来进行返回
        if (item.type === "select" && item.optionModelName) {
          if (data[item.optionModelName]) {
            item.options.push(...[
              // xxxId 对应的 xxx
              data[item.optionModelName]
            ].map(i => {
              return {
                ...i,
                // value默认为返回回显数据的id
                value: i.id,
                label: i[item.labelName]
              };
            }))
          }
        }
      }
      // 对级联数据进行还原
      if (item.type === "cascader") {
        data[item.modelName] = [];
        item.trueModelName.some((name, index) => {
          data[name] && (data[item.modelName][index] = data[name]);
        });
        // 特殊情况多选两层的情况
        if (item.multiple) {
          data[item.modelName] = [];
          data[item.trueModelName[1]].some((item2, index) => {
            data[item.modelName][index] = [];
            data[item.modelName][index][0] = data[item.trueModelName[0]];
            data[item.modelName][index][1] = item2;
          });
          if (data[item.trueModelName[1]].length === 0) {
            data[item.modelName] = [[data[item.trueModelName[0]]]];
          }
        }
        // 调用cascader选中后的chnage事件
        this.cascaderChange(data[item.modelName], item);
      }
      // 对 TabRanderList 进行还原
      if (item.type === "TabRanderList") {
        data[item.modelName]?.some(dataObj => {
          item.children.some(item2 => {
            this.echoed(item2, dataObj)
          })
        })
      }
    },
    async getData() {
      this.pageLoadState = true;
      let data;
      if (this.getDetil) {
        data = await this.getDetil();
      } else {
        data = await new Promise(resolve => {
          this.$request(
            `/${this.requestHeadLocal}/${this.pageName}/detail/${this.pageId}`,
            {},
            res => {
              if (!res.error) {
                resolve(res.data.data);
              } else {
                resolve(res.data);
              }
            },
            "get",
            false,
            false
          );
        });
      }
      // 一个获取页面参数之后的回调
      if (this.getDataAfter) {
        this.getDataAfter(data);
      }
      // 提前赋值一次是为了对一些控件默认change事件时能访问到data的数据
      this.data = { ...this.data, ...data };
      {
        this.renderData.some(item => {
          // 特殊控件数据回显准备
          this.echoed(item, data)
        });
      }
      // 因为data的set是一个回调函数，只能最后赋值
      // 保证原有数据不被完全覆盖，只覆盖已有的数据
      if (this.changeDataAfter) {
        this.changeDataAfter(data);
      }
      // 页面change执行完毕后再赋值
      this.$nextTick(() => {
        this.data = { ...this.data, ...data };
      })
      // 详情页加载数据完成
      this.pageState = 'dataLoaded'
      console.log(this.pageState)
      // 给备份数据赋值
      this.backupData = this.$deepCopy(data);
      this.pageLoadState = false;
    },
  },
  created() {
    process.env.NODE_ENV === 'development' && console.log('editor created')
    // 状态模块
    {
      // res初始化
      if (this.fromProject) {
        this.requestHeadLocal = "proj";
      }
      if (this.requestHead) {
        this.requestHeadLocal = this.requestHead;
      }
      let id = this.$route.query.id;
      if (this.idFromSession) {
        id = this.$route.params["projId"];
        id !== "add" && (id = parseInt(id));
      }
      // 复制的数据
      let duplication = this.$route.query.duplication;
      if (duplication) {
        this.duplication = true;
      }
      // add状态判定只使用头部的id = add
      if (
        this.$route.query.id === "add" ||
        duplication ||
        this.$route.params["projId"] === "add"
      ) {
        this.add = true;
      }
      this.pageId = id;
    }
    // pageName初始化
    this.pageName =
      this.pageNameTrue ||
      this.$route.path.split('/').at(-2);
    // data 数据初始化
    {
      // render渲染
      let domData = {}, load = {}, errorText = {}, dependentObj = {};
      this.renderData.some(item => {
        // 多字段录入
        item.trueModelName &&
          item.trueModelName.some(name => {
            domData[name] = "";
          });
        // cascader类型
        if (item.type === "cascader") {
          // 特殊情况，如果之后有三级级联，这里要改
          if (item.multiple) {
            domData[item.trueModelName[1]] = [];
          }
        }
        // data 空值 初始化
        // 媒体文件时长的字段初始化
        item.timeModel && (domData[item.timeModel] = "");
        // 存在modelName才初始化
        item.modelName && (domData[item.modelName] = "")
        // 特定 空数组 录入
        if (
          item.type === "dates"
        ) {
          domData[item.modelName] = [null, null];
        }
        if (
          item.type === "transfer" ||
          item.type === "TabRanderList" ||
          item.type === "renderList" ||
          item.type === "selects" ||
          item.type === "table" ||
          item.type === "checkboxs"
        ) {
          domData[item.modelName] = [];
        }
        // 图片类型录入 随机数
        if (item.type === "image") {
          item.random = parseInt(Math.random() * 100000);
        }
        // 本地字段渲染
        item.localFiled && (this.localData[item.localFiled] = null);
        // load初始化
        load[item.modelName] = false;
        // errorText初始化
        errorText[item.modelName] = "";
        // 给远程查询录入默认option
        if (item.remote) {
          item.options = [];
        }
        // 创建dependent change数据结构
        if (item.dependentChange) {
          let keys = item.dependentChange.key
          let handler = item.dependentChange.handler
          if (keys) {
            if (typeof keys == 'string') {
              dependentObj[keys] ? dependentObj[keys].push(handler) : dependentObj[keys] = [handler]
            } else if (Array.isArray(keys)) {
              keys.some(key => {
                dependentObj[key] ? dependentObj[key].push(handler) : dependentObj[key] = [handler]
              })
            }
          }
          else throw 'dependent change 缺少key'
        }
      });
      this.data = domData;
      // this.$set(this, "data", domData);
      this.$set(this, "loadAll", load);
      this.$set(this, "errorText", errorText);
      // 页面状态为创建完成
      this.pageState = 'created'
      // 默认赋值拿出来，因为要默认值也执行change事件
      this.$nextTick(() => {
        this.renderData.some(item => {
          // data使用computed声明的，赋值是异步的，得使用nextTick
          let name = `data.${item.modelName}`
          this.watchControl.push(
            this.$watch(name, {
              handler: (value, old) => {
                // 避免重复赋值递归
                if (value == old) return true
                if (value && value.toString()) {
                  this.errorText[item.modelName] = '';
                }
                // 依赖change存在就执行
                if (dependentObj[item.modelName]) {
                  dependentObj[item.modelName].some(handler => handler(value, old, item.modelName))
                }
                // 执行change事件,默认赋值只有在新增才执行change(排除掉duplication)
                // if (item.change && this.add && !this.duplication) { item.change(value) }
                if (item.change) {
                  // console.log(`${item.modelName} change`,value); 
                  item.change(value, old)
                }
              },
            })
          )
          // 默认值录入
          if (
            item.defaultData ||
            item.defaultData === 0 ||
            item.defaultData === false
          ) {
            // 加入函数变量
            this.data[item.modelName] =
              item.defaultData.constructor === Function
                ? item.defaultData()
                : item.defaultData;
          }
          // data && (this.data[item.modelName] = data);
          // 默认值装载完成
          this.pageState = 'defaultLoaded'
        });
      });
    }
    // 数据获取模块,不为新增或者为复制
    if (!this.add || this.duplication) {
      this.getData();
    }
  },
  mounted() {
    this.handleLoad && this.handleLoad();
  },
  beforeDestroy() {
    // 销毁手动的监听
    this.watchControl.some(unWatch => {
      unWatch()
    })
  }
};
</script>

<style scoped>
* {
  position: relative;
}

.editor-all {
  /* padding: 0 20px 20px; */
  display: flex;
  flex: 1;
  width: 100%;
  box-sizing: border-box;
  overflow: hidden;
}

.editor-head {
  color: black;
  background-color: var(--orange);
  border-radius: 8px 8px 0 0;
  height: 50px;
  text-transform: capitalize;
  text-align: left;
  line-height: 50px;
  padding: 0 20px;
}

.editor-con {
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.1);
  border-radius: 2px;
  margin: 6px;
  background-color: #f7f9fc;
  flex: 1;
  width: 100%;
  display: flex;
  flex-direction: column;
  /* min-width: 1190px; */
}

.form-con {
  padding: 10px 20px;
  flex: 1;
  overflow: auto;
}

.format {
  text-transform: none;
  font-weight: 400;
  font-size: 12px;
  color: #606266;
  padding-top: 4px;
}

.kuai {
  padding: 0px 10px 0;
  min-height: 50px;
  display: flex;
  flex-direction: column;
  /* border-bottom: 1px solid #eee; */
}

.oneRow {
  flex-direction: row !important;
}

.noBorder {
  border: 0;
}

.children-kuai {
  margin-left: 70px;
}

.kuai:nth-last-child(1) {
  border-bottom: 0;
}

.kuai-name {
  line-height: 27px;
  font-size: 14px;
  min-width: 160px;
  padding: 0 10px 0 0;
  /* color: #454545; */
  text-align: left;
  display: flex;
  align-items: center;
}

.kuai-name div {
  white-space: pre-wrap;
}

/* 行的error的样式 */
.kuai-main-error>>>input,
.kuai-main-error>>>textarea {
  border-color: #f56c6c;
}

/* 排除transfer */
.kuai-main-error>>>.transfer input {
  border-color: #dcdfe6;
}

.kuai-error {
  font-size: 12px;
  height: 22px;
  padding-top: 4px;
  box-sizing: border-box;
  text-align: left;
  color: #f56c6c;
}

.kuai .transfer {
  flex: 1;
  overflow: auto;
}

.kuai-con-item > .kuai-component-con,
.kuai-con-item > .l-input,
.kuai-con-item > .ates-con,
.kuai-con-item > .l-cascader,
.kuai-con-item > .able,
.kuai-con-item > .l-select {
  max-width: 624px;
  min-width: 624px;
}

.kuai .dates-con>>>.el-date-editor {
  width: 100%;
}

.kuai .el-input {
  height: 28px;
}

.kuai>>>.el-input:not(.el-date-editor) input {
  padding-left: 6px;
}

.kuai .rich-text {
  width: 624px;
}

.kuai .el-textarea {
  font-size: 12px;
  width: 624px;
}

.kuai .el-textarea>>>textarea {
  padding-left: 6px;
}

.kuai-media {
  display: flex;
}

.kuai-media-upload {
  display: flex;
  flex-direction: column;
}

.kuai-media>*:nth-child(n + 2) {
  margin-left: 40px;
}

.kuai-media video {
  width: 300px;
  height: 50px;
}

.kuai-con {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.kuai-con>>>* {
  text-transform: none;
}

.kuai-con .right-kuai {
  margin-left: 40px;
}

.kuai-con .input .el-input>>>input {
  padding: 0 6px;
  padding-right: 60px;
  line-height: normal;
  font-weight: inherit;
}

.kuai-con .kuai-con-item {
  display: flex;
  font-weight: 500;
  height: auto;
}

.kuai-point {
  font-size: 12px;
  margin-left: 5px;
}

.kuai-end {
  display: flex;
  align-items: center;
}

.image {
  display: flex;
  /* color: #f56c6c; */
}

.image .image-limit {
  font-size: 13px;
  box-sizing: border-box;
  padding-top: 4px;
}

.img {
  height: 100px;
  width: 100px;
  cursor: pointer;
  border: 1px solid rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 20px;
}

.image .img img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.video-con {
  display: flex;
  align-items: center;
  position: relative;
}

.video-con:hover>.field-delete-btn,
.img:hover>.field-delete-btn {
  display: block;
}

.field-delete-btn {
  position: absolute;
  right: 0;
  top: 0;
  display: none;
}

.btns {
  background-color: rgba(0, 0, 0, 0.03);
  border-radius: 4px;
  border: 1px solid #eee;
  padding: 1vh 20px;
  /* padding-left: 200px; */
  text-align: left;
}

.el-checkbox-group {
  text-align: left;
  width: 800px;
}
</style>
<style>
.cascader-cascader>.el-cascader-panel {
  font-size: 12px !important;
}
</style>