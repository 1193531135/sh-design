<template>
  <el-input v-model="modelData" size="mini" :rows="8" :type="renderItem.type === 'input' ? 'text' : 'textarea'"
    :show-word-limit="!noShoWord" :maxlength="maxlength || (renderItem.type === 'input' ? '50' : '250')"
    :disabled="disabledLocal" :placeholder="placeholder" @input="localInput"></el-input>
</template>

<script>
export default {
  renderType: ['input', 'textarea'],
  props: {
    data: [String, Number],
    renderItem: Object,
    load: { type: Boolean, default: false },
    noShoWord: {
      type: Boolean,
      default: false
    },
    maxlength: {
      type: [String, Number],
    },
    placeholder: {
      type: String,
    },
    disabled: Boolean,
    publicFocus: Function,
    sort: [Function, Boolean],
    type: String,
    textFormat:String,
    textFormatAccord:Boolean,
    input:Function,
  },
  data() {
    return {}
  },
  methods: {
    localInput(val) {
      // 输入前先清除 error text，（实际上改为change触发是最符合逻辑的，focus和blur都会有不准确的情况）
      // this.errorText[item.modelName] = ''
      let format = this.textFormat;
      if (format) {
        let reg = new RegExp(format, "g");
        if (this.textFormatAccord) {
          !reg.test(val) && (this.modelData = "");
        } else if (reg.test(val)) {
          this.modelData = val.replace(reg, "");
        }
      }
      // 如果存在input方法就触发,传递已经处理过的值
      this.input && this.input(this.modelData);
    }
  },
  computed: {
    disabledLocal() {
      return this.disabled
    },
    modelData: {
      get() {
        return this.data || '';
      },
      set(val) {
        this.$emit("update:data", val);
      }
    },
  }
}
</script>

<style scoped></style>