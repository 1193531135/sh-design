<template>
  <div>
    <template v-if="editor"></template>
    <template v-else>
        <div>{{ data }}</div>
    </template>
  </div>
</template>

<script>
export default {
    props:{
        templateType:String,
        saveFunc:Function,
        data:String || Number,
        item:Array,
    },
    data(){
        return{
            value:'',
            editor:false
        }
    }
}
</script>

<style>

</style>