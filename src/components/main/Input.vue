<template>
  <el-input 
    v-model="data[item.modelName]" 
    @focus="errorText[item.modelName] = ''" 
    size="mini" 
    :rows="8"
    :type="item.type === 'input' ? 'text' : 'textarea'" 
    :show-word-limit="!item.noShoWord"
    :maxlength="item.maxlength || (item.type === 'input' ? '50' : '250')" 
    :disabled="disabledCheck(item)"
    :placeholder="item.placeholder" 
    @input="(val) => formatLimit(val, item)"
  ></el-input>
</template>