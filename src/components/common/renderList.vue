<template>
  <div class="all">
    <div class="btns" v-for="(item, index) in modules" :key="index">
      <template v-if="renderItem.isHaveHeader">
        <el-input @input="(val) => input(val,'left',item,renderItem.headName)" v-model="item[renderItem.headName]" :placeholder="renderItem.headPlaceholder || 'head'" class="head-input" :maxlength="renderItem.headMaxLength || 30"></el-input>
        <el-input @input="(val) => input(val,'right',item,renderItem.contentName)" v-model="item[renderItem.contentName]" :placeholder="renderItem.contentPlaceholder || 'content'" class="content-input" :maxlength="renderItem.contentMaxLength || 30"></el-input>
      </template>
      <el-input v-else 
      @input="(val) => input(val,'left',modules,index)"
      v-model="modules[index]" show-word-limit maxlength="30"></el-input>
      <el-button v-show="renderItem.minSum?(modules.length > renderItem.minSum):true" class="square" icon="el-icon-remove" @click="deleteInput(index)"></el-button>
      <!-- <div>
      <i class="el-icon-rank move"></i>
      </div>-->
    </div>
    <el-button
      icon="el-icon-circle-plus"
      @click="addInput"
      v-show="renderItem.maxSum?(modules.length != renderItem.maxSum):true"
    ></el-button>
  </div>
</template>   

<script>
export default {
  props: ["data", "renderItem"],
  data() {
    return {};
  },
  methods: {
    addInput() {
      this.modules.push(
        this.renderItem.isHaveHeader ? { header: "", content: "" } : ""
      );
    },
    deleteInput(index) {
      this.modules.splice(index, 1);
    },
    input(val,type,Base,key){
      let format = this.renderItem.format
      if(type === 'right'){ 
        format = this.renderItem.rightFormat
      }
      if (format) {
        let reg = new RegExp(format);
        if (this.renderItem.textFormatAccord) {
          !reg.test(val) && (Base[key] = "");
        }
        else if (reg.test(val)) {
          Base[key] = "";
        }
      }
    }
  },
  computed: {
    modules: {
      get() {
        return this.data || [];
      },
      set(val) {
        this.$emit("update:data", val);
      }
    }
  },
  created() {
    if (this.renderItem.sortable) {
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
.all {
  /* height: 240px; */
  text-align: left;
}
.btns {
  display: flex;
  margin-bottom: 2px;
}
.square {
  width: 56px;
  padding: 0;
  margin-left: 2px;
  /* color: #409eff;
  border-color: #c6e2ff;
  background-color: #ecf5ff; */
}
.square:hover{
  /* background-color: rgba(0, 0, 0, 0.1); */
}
.head-input {
  /* flex: 1; */
  width: 193px;
}
.content-input {
  flex: 2;
  width: 375px;
}
</style>