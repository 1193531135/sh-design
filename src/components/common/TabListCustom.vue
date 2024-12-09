<template>
  <div class="subtitle-con rander-list">
    <el-tabs v-model="tabs" v-show="listData.length > 0" type="border-card" :closable="!renderItem.noClose"
      @tab-remove="removeTab">
      <el-tab-pane class="list-item" v-for="(item, index) in listData" :key="index"
        :label="renderItem.tabModelName === '_index' ? `Tab ${index + 1}` : $searchOptionName(optionsBack, item[renderItem.tabModelName])"
        :name="renderItem.tabModelName === '_index' ? `Tab ${index + 1}` : item[renderItem.tabModelName]">
        <ComTemplate v-for="randerItemChilren in renderItem.children" :key="randerItemChilren.modelName"
          :renderItem="randerItemChilren" :data.sync="item[randerItemChilren.modelName]" :dataFromObj="item"
          :isShowKey="true" :uploadFile="uploadFile" :baseUrl="baseUrlLocal"></ComTemplate>
      </el-tab-pane>
    </el-tabs>
    <div class="btn-con" v-if="!renderItem.noAdd">
      <el-button v-if="renderItem.tabModelName == '_index'" size="mini" circle icon="el-icon-plus" type="success"
        @click="addTab()"></el-button>
      <el-dropdown v-else trigger="click" @command="addTab">
        <el-button size="mini" circle icon="el-icon-plus" type="success"></el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item v-for="item in optionsBack" :key="item.key" :disabled="isDisbled(item.value)"
            :command="item.value">{{ item.label }}</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import ComTemplate from "./ComponentTemplate.vue";
export default {
  components: { ComTemplate },
  props: {
    data: null,
    renderItem: Object,
    baseUrl: String,
    uploadFile: Function
  },
  data() {
    return {
      tabs: ""
    };
  },
  computed: {
    listData: {
      get() {
        return this.data || [];
      },
      set(val) {
        this.$emit("update:data", val);
      }
    },
    optionsBack() {
      let returnData = this.renderItem.options || [];
      if (returnData.constructor === String) {
        returnData = this.$store.state.optionBase[returnData] || [];
      }
      return this.$deepCopy(returnData);
    },
    baseUrlLocal() {
      return this.renderItem.baseUrl || this.baseUrl
    }
  },
  watch: {
    // 浅监听，用于list tab初始化时，定位到默认的tab两种情况
    /*
      1.从空数组到默认值赋值
      2.默认值被覆盖
    */
    listData: {
      handler(val, oldVal) {
        // list 从无到有 默认选中第一个
        // 正对走数据层直接赋值的逻辑做的兼容
        if (oldVal && oldVal.length == 0 && val && val.length > 0) {
          // let tabModelName = this.renderItem.tabModelName === '_index'? `Tab 1` : this.renderItem.tabModelName
          let tabModelName = this.renderItem.tabModelName
          this.tabs = tabModelName === '_index' ? `Tab 1` : val[0][tabModelName];
          // _index模式下，后台返回的初始化数据是没有_index的，所以在这里加上
          val.some((item, index) => {
            // index 模式更新索引key
            if (tabModelName === '_index') {
              item[tabModelName] = `Tab ${index + 1}`
            }
          })
        }
      },
      immediate: true,
      // deep: true
    }
    // optionsBack: {
    //   handler(val) {
    //     this.options = this.$deepCopy(val);
    //   },
    //   immediate: true
    // }
  },
  methods: {
    createNullItem() {
      let obj = {};
      this.renderItem.children.some(i => {
        obj[i.modelName] = "";
        // 兼容video控件获取时长
        i.timeModel && (obj[i.timeModel] = "")
      });
      return obj;
    },
    isDisbled(value) {
      return (
        this.listData
          ?.map(i => i[this.renderItem.tabModelName])
          .indexOf(value) != -1
      );
    },
    addTab(val) {
      let nullObj = this.createNullItem();
      val = val || `Tab ${this.listData.length + 1}`
      this.listData.push({ ...nullObj, [this.renderItem.tabModelName]: val });
      // tab自动切换到最新的
      this.$nextTick(() => {
        // console.log('tabs change =>>', val)
        this.tabs = val;
      });
    },
    removeTab(val) {
      let tabModelName = this.renderItem.tabModelName
      let listData = this.listData.filter(
        i => i[tabModelName] != val
      )
      listData.some((item, index) => {
        // index 模式更新索引key
        if (tabModelName === '_index') {
          item[tabModelName] = `Tab ${index + 1}`
        }
      })
      this.listData = listData
      this.$nextTick(() => {
        // 如过删除的是当前的tab，并且不是最后一个，就切换到最后一个tab
        if (val === this.tabs && this.listData.length > 0) {
          this.tabs = this.listData[this.listData.length - 1][
            tabModelName
          ];
        }
      });
    }
  }
};
</script>

<style scoped>
.rander-list {
  display: flex;
  font-size: 12px;
}

.el-tabs {
  width: 750px;
}

.list-item {
  /* display: flex; */
}

.list-item>div {
  margin-right: 5px;
}

/* .list-item >>> .file-con > .el-button{ height: 28px;padding: 0 10px; } */
.btn-con {
  margin-left: 10px;
}

.component-con {
  margin-bottom: 10px;
}
</style>