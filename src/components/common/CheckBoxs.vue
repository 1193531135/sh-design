<template>
  <el-checkbox-group v-model="modelData">
    <el-checkbox
      v-for="item2 in optionsLocal"
      :disabled="disabled" :label="item2.value" :key="item2.value">{{ item2.label
      }}</el-checkbox>
  </el-checkbox-group>
</template>

<script>
export default {
  renderType: ['checkbox', 'checkboxs'],
  props: {
    data: [Array],
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
    publicFocus: Function
  },
  data() {
    return {
    }
  },
  computed: {
    optionsLocal() {
      return this.renderItem.optionsAdd ? [...this.options, ...this.renderItem.optionsAdd] : this.options
    },
    modelData: {
      get() {
        return this.data || []
      },
      set(val) {
        this.$emit("update:data", val);
      }
    },
  }

}
</script>

<style scoped>
.el-checkbox-group>.el-checkbox {
  text-align: left;
  width: 150px;
}
</style>