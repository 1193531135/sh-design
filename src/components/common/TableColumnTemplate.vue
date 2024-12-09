<template ref="">
  <div class="table-cell-children">
    <div v-if="editor || isDirectlyEditor" style="width: 100%; height: 100%" class="cell-show cell-editor">
      <!-- 能直接进行修改的 -->
      <div v-if="renderItem.type === 'checkbox'" class="checkbox-con">
        <p style="height: 5px"></p>
        <el-checkbox :true-label="renderItem.aloneLimit.on" :false-label="renderItem.aloneLimit.off"
          v-model="value"></el-checkbox>
      </div>
      <el-input v-if="renderItem.type === 'input' || renderItem.type === 'textarea'" v-model="value" size="mini" :rows="8"
        :type="renderItem.type === 'input' ? 'text' : 'textarea'"
        :maxlength="renderItem.maxlength || (renderItem.type === 'input' ? '30' : '250')" :disabled="cellDisabled"
        :placeholder="renderItem.placeholder" @input="(val) => formatLimit(val, renderItem, rowData)"></el-input>
      <el-select v-if="renderItem.type === 'select' || renderItem.type === 'selects'" size="mini" v-model="value"
        :multiple="renderItem.type === 'selects'" @change="(val) => seletChange(val, renderItem)"
        :disabled="cellDisabled" collapse-tags clearable
        :multiple-limit="renderItem.maxlength ? renderItem.maxlength : 0">
        <!-- option可能为string 可能为array 可能为function返回string -->
        <el-option v-for="option in renderItem.options.constructor === String
          ? optionsAll[renderItem.options]
          : typeof renderItem.options === 'function'
            ? optionsAll[renderItem.options(rowData)]
            : renderItem.options" :label="option.label"
          :value="renderItem.uploadLabel ? option.label : option.value" :key="option.value"></el-option>
      </el-select>
      <!-- editorType类型 需要点击修改 -->
      <!-- 下拉框 -->
      <div v-if="renderItem.editorType === 'select' || renderItem.editorType === 'selects'">
        <el-select size="mini" v-model="value" :multiple="renderItem.editorType === 'selects'"
          @change="(val) => seletChange(val, renderItem)" :disabled="cellDisabled" collapse-tags clearable
          :multiple-limit="renderItem.maxlength ? renderItem.maxlength : 0
            ">
          <!-- option可能为string 可能为array 可能为function返回string -->
          <el-option v-for="option in renderItem.options.constructor ===
            String
            ? optionsAll[renderItem.options]
            : typeof renderItem.options === 'function'
              ? optionsAll[renderItem.options(rowData)]
              : renderItem.options" :label="option.label" :value="renderItem.uploadLabel ? option.label : option.value
      " :key="option.value"></el-option>
        </el-select>
        <!-- <div v-if="item.type === 'selects'" class="format">
                            (multi-select)
        </div>-->
      </div>
      <el-button v-show="editor" size="mini" icon="el-icon-check" class="editor-icon editor-icon2"
        @click="btnClick('save')"></el-button>
    </div>
    <div v-else :class="`cell-show ${renderItem.click ? 'hover' : ''}`" @click="rowClick(rowData)">
      <!-- 自定义slot -->
      <slot v-if="renderItem.type === 'slot'" :name="renderItem.slotName" :row="rowData"></slot>
      <!-- 自定义展示 -->
      <div class="table-input-text" v-if="renderItem.type === 'custom' || renderItem.custom"
        :title="renderItem.noTitle ? '' : renderItem.custom(rowData)" v-html="renderItem.custom(rowData)"></div>
      <!-- text展示 -->
      <div :class="`table-input-text ${renderItem.jump ? 'hover' : ''}`"
        v-if="renderItem.type === 'text' || !renderItem.type" :title="rowData[renderItem.modelName]"
        @click="jumpFuncLocal(rowData)"
        :style="renderItem.style ? renderItem.style : (renderItem.jump ? 'color:#409eff' : '')">{{
          rowData[renderItem.modelName] && rowData[renderItem.modelName].toString() }}</div>
      <!-- img展示 -->
      <div class="table-input-img" v-if="renderItem.type === 'image'">
        <el-image v-if="rowData[renderItem.modelName]" :src="baseUrlLocal + rowData[renderItem.modelName]"
          :preview-src-list="[baseUrlLocal + rowData[renderItem.modelName]]"></el-image>
      </div>
      <!-- select展示 -->
      <div class="table-input-select" v-if="renderItem.type === 'select'" v-html="$searchOptionName(
        renderItem.options.constructor === Array
          ? renderItem.options
          : optionsAll[renderItem.options],
        rowData[renderItem.modelName]
      )">
      </div>
    </div>
    <!-- 点击进入编辑状态的按钮 -->
    <el-button v-if="randerItems.editor && (typeof randerItems.editor === 'function' && randerItems.editor(rowData))"
      v-show="!editor" size="mini" icon="el-icon-edit-outline" class="editor-icon"
      @click="btnClick('editor')"></el-button>
  </div>
</template>

<script>
export default {
  renderType:"tableColumn",
  props: {
    // 行数据
    rowData: Object,
    // 渲染的item数据
    randerItems: Object,
    // jump单独的函数
    jumpFunc: Function,
    // pageName用于判断所在模块
    pageName: String,
    // cellSave用于保存单元格调用
    cellSave: Function,
    // permission当前页面权限
    permission: Object,
    // 用于当前全局的baseUrl
    baseUrl: String
  },
  data() {
    return {
      editor: false,
      value: ""
    };
  },
  computed: {
    renderItem() {
      return this.randerItems;
    },
    modelValue: {
      get() {
        return this.rowData[this.randerItems.modelName]
      },
      set(val) {
        this.rowData[this.randerItems.modelName] = val
      }
    },
    isDirectlyEditor() {
      return this.randerItems.editor && this.randerItems.editor === true;
    },
    optionsAll() {
      return this.$store.state.optionBase;
    },
    baseUrlLocal() {
      return this.renderItem.baseUrl || this.baseUrl
    },
    cellDisabled(){
      if(this.renderItem.disabled && typeof this.renderItem.disabled === 'function' ){
        return this.renderItem.disabled(this.rowData)
      }else{
        return this.renderItem.disabled
      }
    }
  },
  watch: {
    value(val) {
      this.rowData[this.renderItem.modelName] = val
    },
    rowData: {
      handler() {
        let data = this.rowData[this.renderItem.modelName];
        // 多选结构是数组
        if (!data) { return true }
        if (this.randerItems.editorType === "selects" && data.constructor !== Array) {
          data = data.split(",");
        }
        this.value = data;
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    rowClick(rowData){
      this.renderItem.click && this.renderItem.click(rowData)
    },
    jumpFuncLocal(rowData) {
      if (!this.randerItems.jump) return () => { }
      let func = this.randerItems.jumpFunc || this.jumpFunc
      func(rowData)
    },
    btnClick(state) {
      this.editor = !this.editor;
      // 进入编辑状态后进行第一次赋值
      // save接口
      if (state && state === "save") {
        // 如果是selects，将数组类型转为字符串
        let updataValue = this.value;
        if (this.randerItems.editorType === "selects") {
          updataValue = updataValue.toString();
        }
        // 空校验
        if (!updataValue) {
          return true;
        }
        this.cellSave({
          cellName: this.renderItem.modelName,
          cellValue: updataValue,
          id: this.rowData.id
        });
      }
    },
    seletChange(val, item) {
      item.change && item.change(val, item);
    },
    formatLimit(val, item) {
      let format = item.format;
      if (format) {
        let reg = new RegExp(format);
        if (this.renderItem.textFormatAccord) {
          !reg.test(val) && (this.value = "");
        }
        else if (reg.test(val)) {
          this.value = "";
        }
      } else if (item.formatFunc) {
        if (!item.formatFunc(val)) {
          this.value = "";
        }
      } else {
        return val;
      }
    }
  },
  created() {
    // 默认参数传参
    // 因为cell组件在获取详情的逻辑下是先获取数据再进行渲染，所以cell添加defaultData会导致覆盖真实数据
    // if(this.renderItem.defaultData){
    //   console.log('cell组件开始设置默认值')
    //   this.rowData[this.renderItem.modelName] = this.renderItem.defaultData
    // }
  }
};
</script>

<style scoped>
.table-cell-children {
  width: 100%;
  height: 100%;
  display: flex;
}

.table-input-text,
.table-input-select,
.table-option,
.table--head-item {
  /* padding: 12px 4px; */
  width: 100%;
  /* height: inherit; */
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.table-input-img {
  width: 100%;
  height: 100%;
}

.table-input-img .el-image {
  width: 100%;
  height: 100%;
}

.table-input-img .el-image>>>img {
  height: 100%;
  width: 100%;
  object-fit: contain;
}

.table-input-img .el-image>>>.el-image-viewer__canvas img {
  width: 50%;
}

.cell-show {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
}

.cell-editor {}

/* 单独给编辑按钮设定样式 */
.editor-icon {
  padding: 0.5px;
  font-size: 12px;
  height: 16px;
  position: absolute;
  right: 0;
}

.editor-icon2 {
  position: relative;
  height: 28px;
}

/* 清掉按钮默认的focus */
.el-icon-edit-outline:focus {
  background: #fff;
  border: 1px solid #dcdfe6;
  color: #606266;
}

/* 让多选的select不换行 */
.table-cell-children>>>.el-select__tags {
  flex-wrap: nowrap;
}
</style>