<template>
  <div class="dates-con">
    <el-date-picker v-model="startTimeLocal" :type="renderItem.dateType || 'date'" size="mini" @focus="clearError"
      :placeholder="'Select Start Date'" :value-format="renderItem.valueFormat || 'yyyy-MM-dd'"
      :picker-options="startPickerOptions"></el-date-picker>
    <div style="width: 10px; height: 1px; background-color: black;margin:0 10px"></div>
    <el-date-picker v-model="endTimeLocal" :type="renderItem.dateType || 'date'" @focus="clearError" size="mini"
      :placeholder="'Select End Date'" :value-format="renderItem.valueFormat || 'yyyy-MM-dd'"
      :picker-options="endPickerOptions"></el-date-picker>
    <!-- <div class="hot-key">
                  <span @click="selectDate(item.modelName, 1)">Today</span>
                  <span @click="selectDate(item.modelName, 3)">Three Days</span>
                  <span @click="selectDate(item.modelName, 7)">Last Week</span>
    </div>-->
  </div>
</template>

<script>
export default {
  props: {
    "renderItem": Object,
    'errorText': {
      default: "",
      type: String
    },
    trueModelName: Array,
    'data': {
      type: [Array, String],
      default() {
        return ['', '']
      }
    },
    dataFromObj: Object
  },
  data() {
    return {
      startTimeUnWatch: null,
      endTimeUnWatch: null,
      startTimeLocal:"",
      endTimeLocal:"",
      startPickerOptions: {
        disabledDate: (time) => {
          let state = false
          if (this.endTimeLocal) {
            state = time.getTime() > new Date(this.endTimeLocal).getTime();
          }
          return state
        }
      },
      endPickerOptions: {
        disabledDate: (time) => {
          let state = false
          if (this.startTimeLocal) {
            state = time.getTime() < new Date(this.startTimeLocal).getTime();
          }
          return state
        }
      }
    }
  },
  computed: {
    errorTextLocal: {
      get() {
        return this.errorText
      },
      set(val) {
        this.$emit('update:errorText', val)
      }
    },
    dataLocal: {
      get() {
        return this.data
      },
      set(val) {
        this.$emit('update:data', val)
      }
    },
  },
  watch: {
    startTimeLocal(val,old){
      this.dataChange(val,old)
    },
    endTimeLocal(val,old){
      this.dataChange(val,old)
    },
    dataLocal(val) {
      if (val && val.length == 2) {
        this.startTimeLocal = val[0]
        this.endTimeLocal = val[1]
      }
    },
  },
  methods: {
    clearError() {
      this.errorTextLocal = ''
    },
    dataChange(old,val){
      if(old != val){
        this.dataLocal = [this.startTimeLocal,this.endTimeLocal]
        if(this.trueModelName){
          this.dataFromObj[this.trueModelName[0]] = this.startTimeLocal
          this.dataFromObj[this.trueModelName[1]] = this.endTimeLocal
        }
      }
    }
  },
  created() {
    // 存在trueModelName添加反向监听
    if (this.trueModelName) {
      // start
      this.startTimeUnWatch = this.$watch(`dataFromObj.${this.trueModelName[0]}`, (val, old) => {
        if (val != old) {
          this.startTimeLocal = val
        }
      })
      this.endTimeUnWatch = this.$watch(`dataFromObj.${this.trueModelName[1]}`, (val, old) => {
        if (val != old) {
          this.endTimeLocal = val
        }
      })
    }
  },
  beforeDestroy() {
    this.startTimeUnWatch && this.startTimeUnWatch()
    this.endTimeUnWatch && this.endTimeUnWatch()
  }
};
</script>

<style scoped>
.dates-con {
  display: flex;
  align-items: center;
}
</style>