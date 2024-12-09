<template>
  <el-select size="mini" v-model="modelData" :multiple="renderItem.type === 'selects'" @change="seletChange"
    @focus="selectFocus" :disabled="disabledLocal" clearable :placeholder="placeholder?placeholder:renderItem.type"
    :multiple-limit="renderItem.maxlength ? renderItem.maxlength : 0" :filterable="renderItem.remote"
    :remote="renderItem.remote"
    :remote-method="(query) => renderItem.remoteMethod(query, renderItem.modelName, renderItem)" :loading="vLoad"
    @visible-change="visibleChange"
    >
    <template v-if="renderItem.group">
      <el-option-group v-for="options in optionsLocal" :key="options.label" :label="options.label" v-show="!options.noShow">
        <el-option v-for="option in options.options" v-show="!option.noShow" :label="option.label"
          :value="renderItem.uploadLabel ? option.label : option.value" :key="option.key || option.value"
          :disabled="option.disabled"></el-option>
      </el-option-group>
    </template>
    <template v-else>
      <el-option v-for="option in optionsLocal" v-show="!option.noShow" :label="option.label"
        :value="renderItem.uploadLabel ? option.label : option.value" :key="option.key || option.value"
        :disabled="option.disabled"></el-option>
    </template>
  </el-select>
</template>
<script>
export default {
  renderType:['select','selects'],
  props: {
    data: [String, Number, Array],
    /*
      renderItem:{
        group:是否为分组模式
        optionsAdd:添加的option
      }
    */
    renderItem: Object,
    load: { type: Boolean, default: false },
    options: { type: Array, default() { return [] } },
    disabled: Boolean,
    publicFocus:Function,
    sort:[Function,Boolean],
    type:String,
    placeholder:String
  },
  data() {
    return {
    };
  },
  computed: {
    optionsLocal(){
      return this.renderItem.optionsAdd?[...this.options,...this.renderItem.optionsAdd]:this.options
    },
    disabledLocal() {
      return this.disabled
    },
    modelData: {
      get() {
        return this.data || (this.type === 'select'?'':[]);
      },
      set(val) {
        this.$emit("update:data", val);
      }
    },
    vLoad: {
      get() {
        return this.load;
      },
      set(val) {
        this.$emit("update:load", val);
      }
    }
  },
  methods: {
    visibleChange(val){
      let renderItem = this.renderItem
      val && renderItem.remote && renderItem.remoteMethod('', renderItem.modelName, renderItem)
    },
    selectFocus() {
      this.publicFocus && this.publicFocus(this.renderItem);
      this.renderItem.focus && this.renderItem.focus(this.renderItem);
    },
    seletChange(val) {
      if(this.sort && typeof val === "object"){
        if(this.sort.constructor === Function){
          this.modelData = this.sort(val)
        }else{
          this.modelData = val?.sort()
        }
      }
      // if (typeof val === "object") {
      //   this.modelData = this.modelData.sort();
      // }
      this.renderItem.change && this.renderItem.change(val, this.renderItem);
    },
  }
};
</script>

<style scoped>
.el-select{
  width: 100%;
}
</style>