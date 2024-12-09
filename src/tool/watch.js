
function watch(watchObject, bindObj) {
  let subsitute = {}
  let watchFunc = watchObject
  function createObjectWatch(config){
    let bindSubProp = config.bindSubProp
    let bindObj = config.bindObj
    // subsitute是被监听数据的来源器
    let subsitute = null
    // 初始赋值
    subsitute = bindObj[bindSubProp]
    Object.defineProperty(bindObj, bindSubProp, {
      set: function (val) {
        if (subsitute === val) { return }
        subsitute = val
        config.set(config.bindValue)
      },
      get: config.get ? config.get() : () => subsitute
    })
    // 检查是否有deep
    let bindSubPropType = bindObj[bindSubProp] && (bindObj[bindSubProp].constructor === Object || bindObj[bindSubProp].constructor === Array)
    if(config.deep && bindSubPropType){
      if(bindObj[bindSubProp].constructor === Object){
        Object.keys(bindObj[bindSubProp]).some(item => {
          let config2 = { ...config }
          config2.bindObj = bindObj[bindSubProp]
          config2.bindSubProp = item
          createObjectWatch(config2)
        })
      }
      if(bindObj[bindSubProp].constructor === Array){
        bindObj[bindSubProp].some((item,index) => {
          let config2 = { ...config }
          config2.bindObj = bindObj[bindSubProp]
          config2.bindSubProp = index
          createObjectWatch(config2)
        })
      }
    }
  }
  Object.keys(watchFunc).some(item => {
    if (watchFunc[item].constructor === Object) {
      console.log('数据为object')
      createObjectWatch({
        // 被绑定的父节点
        bindObj:bindObj,
        // 被监听的子节点
        bindSubProp:item,
        // 监听固定输出的值
        bindValue:bindObj[item],
        ...watchFunc[item]
      })
    } else {
      //创建缓存监听get初始化数据
      subsitute[item] = bindObj[item]
      Object.defineProperty(bindObj, item, {
        set: function (val) {
          if (subsitute[item] === val) { return }
          subsitute[item] = val
          watchFunc[item](val)
        },
        get() {
          return subsitute[item]
        }
      })
    }
  })
}

module.exports = watch