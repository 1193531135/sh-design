<template>
  <div :class="`component-con ${renderItem.rowClass?renderItem.rowClass:''}`" >
    <div class="component-name" v-if="isShowKey">{{ renderItem.key }}:</div>
    <component 
      :is="componentsRender"
      :ref="renderItem.ref || renderItem.modelName"
      v-bind="{sort:true,...renderItem}"
      :renderItem="renderItem"
      :data.sync="componentData"
      :uploadFile="uploadFile"
      :load.sync="loadLocal"
      :options="optionsBack"
      :disabled="disabledLocal"
      :dataFromObj="fatherObj"
      :baseUrl="baseUrlLocal"
      :publicFocus="publicFocus"
    ></component>
    <!-- <UploadFile
      v-if="renderItem.type === 'file'"
      :renderItem="renderItem"
      :data.sync="componentData"
      :uploadFile="uploadFile"
      :dataFromObj="fatherObj"
      :baseUrl="baseUrlLocal"
      :load.sync="load"
    ></UploadFile>
    <UploadTs
      v-if="renderItem.type === 'tsVideo'"
      :renderItem="renderItem"
      :data.sync="componentData"
      :uploadFile="uploadFile"
      :load.sync="load"
    ></UploadTs> -->
    <template v-if="renderItem.type === 'slot'">
      <templateCustom v-if="renderItem.deepSlot" :renderItem="renderItem" class="slot-content"></templateCustom>
      <slot v-else :name="renderItem.slotName" :renderItem="renderItem"></slot>
    </template>
    <!-- <Select
      v-if="renderItem.type === 'select' || renderItem.type === 'selects'"
      :renderItem="renderItem"
      :data.sync="componentData"
      :uploadFile="uploadFile"
      :load.sync="load"
      :options="options"
      :disabled="disabledLocal"
    ></Select> -->
  </div>
</template>

<script>
import componentObj from './register'
function getNodeArray(VueComponent,VNodeName){
  let cacheVNodeArray = null
  function searchNode(VueComponent,VNodeName){
    if(!VueComponent){
      return false
    }
    return VueComponent.$slots[VNodeName]?VueComponent.$slots[VNodeName]:searchNode(VueComponent.$parent,VNodeName)
  }
  cacheVNodeArray = searchNode(VueComponent,VNodeName)
  if(!cacheVNodeArray) throw `not found ${VNodeName} in getNodeArray Function`
  return cacheVNodeArray
}
const components = {
    ...componentObj,
    // 自定义模板接收任意节点的slots进行渲染
    templateCustom:{
      props:{ renderItem:Object },
      render(h){
        let renderItem = this.renderItem
        return h('div',getNodeArray(this,renderItem.slotName))
      }
    }
}
export default {
  components,
  props: {
    data: null,
    // 数据的父节点（容器），所在的obj(暂时只有obj类型的父节点)
    dataFromObj: Object,
    renderItem: Object,
    baseUrl: String,
    isShowKey:Boolean,
    uploadFile: Function,
    publicFocus: Function,
    disabled:Boolean,
    load:Boolean
  },
  data() {
    return {
      options: [],
      add: false,
    };
  },
  computed: {
    loadLocal:{
      get(){ return this.load },
      set(val){ this.$emit("update:load",val) }
    },
    componentsRender(){
      let com = ''
      Object.keys(components).some(comKey => {
        if(components[comKey].renderType){
          if(typeof components[comKey].renderType === 'object'){
            components[comKey].renderType.some(type => {
              if(this.renderItem.type === type){
                com = components[comKey]
                return true
              }
            })
          }else{
            if(components[comKey].renderType === this.renderItem.type){
              com = components[comKey]
              return true
            }
          }
        }
      })
      if(!com && this.renderItem.type !== 'slot'){
        console.error(`Type '${this.renderItem.type}' in components is not found`);
      }
      return com
    },
    fatherObj: {
      get() {
        return this.dataFromObj;
      },
      set(val) {
        this.$emit("update:dataFromObj", val);
      }
    },
    componentData: {
      get() {
        return this.data;
      },
      set(val) {
        this.$emit("update:data", val);
      }
    },
    // optionsAdd 和 options 拼接
    optionsBack() {
      let returnData = this.renderItem.options || [];
      if (returnData.constructor === String) {
        returnData = this.$store.state.optionBase[returnData] || [];
      }
      return [...returnData,...(this.renderItem.optionsAdd || [])];
    },
    baseUrlLocal() {
      return this.renderItem.baseUrl || this.baseUrl;
    },
    disabledLocal() {
      return this.disabled;
    },
  },
  methods: {
    // checkout
    checkout(){
      
    },
  },
  created() {
    if (this.$route.query.id === "add" || this.$route.query.duplication) {
      this.add = true;
    }
  },
};
</script>

<style scoped>
.component-con {
  text-align: left;
  display: flex;
  flex: 1;
  /* flex-direction: column; */
}
.component-name {
  margin-top: 5px;
  width: 140px;
}
.slot-content{
  flex: 1;
}
</style>