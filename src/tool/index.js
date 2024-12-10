class Gvalue {
  constructor(value) {
    this.value = value
  }
  get() {
    return this.value
  }
  cpt(func) {
    this.value = func(this.value)
    return this
  }
}
/**
 * 
 * @param {*} value 被处理的参数
 * @returns {*} 
 */
function cpt(value) { return new Gvalue(value) }

/**
 * 
 * @param {( Date|String )} time 需要被格式化的Date对象或者，正确时间格式的字符串
 * @param {*} state 返回的时间范围
 * 1.year 返回年份
 * 2.mounth 返回年月
 * 3.day 返回年月日
 * 3.all 返回年月日时分秒
 * @returns 
 */
function getFormatTime(time, state = 'all') {
  function fillingZero(number, digit = 2) {
    let numberArray = number.toString().split('')
    let array = new Array(digit).fill('0')
    let D_value = digit - numberArray.length
    numberArray.some((value, index) => {
      array[index + D_value] = value
    })
    return array.toString().replaceAll(',', '')
  }
  let string = ''
  let date = new Date(time)
  let year = date.getFullYear()
  let mounth = fillingZero(date.getMonth() + 1)
  let day = fillingZero(date.getDate())
  let hours = fillingZero(date.getHours())
  let Min = fillingZero(date.getMinutes())
  let second = fillingZero(date.getSeconds())
  switch (state) {
    case 'year': { string = `${year}`; break }
    case 'mounth': { string = `${year}-${mounth}-00`; break }
    case 'day': { string = `${year}-${mounth}-${day}`; break }
    case 'all': { string = `${year}-${mounth}-${day} ${hours}:${Min}:${second}`; break }
  }
  return string
}

/**
 * 
 * @param {*} second isMilliseconds为true的时候该字段传入毫秒
 * @param {Boolean} [isMilliseconds=false] 是否为毫秒级
 * @returns 
 */
function TimeShow(second, isMilliseconds = false) {
  let Time = new Date('2023-1-1 00:00:00')
  Time = new Date(isMilliseconds ? Time.setMilliseconds(second) : Time.setSeconds(second))
  let Hours = Time.getHours()
  Hours = Hours >= 10 ? Hours.toString() : `0${Hours}`
  let Min = Time.getMinutes()
  Min = Min >= 10 ? Min.toString() : `0${Min}`
  let Second = Time.getSeconds()
  Second = Second >= 10 ? Second.toString() : `0${Second}`
  let Milliseconds = Time.getMilliseconds()
  Milliseconds = Milliseconds >= 100 ? Milliseconds.toString() : (Milliseconds >= 10 ? `0${Milliseconds}` : `00${Milliseconds}`)
  Time = `${Hours}:${Min}:${Second}${isMilliseconds ? ',' + Milliseconds : ''}`
  return Time
}
// 对象深复制
function deepCopy(data) {
  if (!data && (data != false) && (data != 0)) { throw `数据为空 => ${data}` }
  let container = null;
  if (data.constructor === Array) {
    container = []
    data.some((item, index) => {
      if (typeof item === 'object' && item != null) {
        container[index] = deepCopy(item)
      } else {
        container[index] = item
      }
    })
  }
  if (data.constructor === Object) {
    container = {}
    Object.keys(data).some((item) => {
      if (typeof data[item] === 'object' && data[item] != null) {
        container[item] = deepCopy(data[item])
      } else {
        container[item] = data[item]
      }
    })
  }
  if (data.constructor != Object && data.constructor != Array) {
    container = data
  }
  return container
}
// refSearch ,ref递归查询
function refDeepSearch(vue, refName) {
  let ref = false
  if (!vue.$refs) { return false }
  if (vue.$refs[refName]) {
    ref = vue.$refs[refName]
  }
  else {
    for (let key of Object.keys(vue.$refs)) {
      let refItem = vue.$refs[key]
      // 数组需要再深入
      if (Array.isArray(refItem)) {
        for (let refItem2 of refItem) {
          let ref = refDeepSearch(refItem2, refName)
          if (ref) { return ref }
        }
      } else {
        return refDeepSearch(refItem, refName)
      }
    }
  }
  return ref
}
// 同步即时打印
function log(obj) {
  let rep = JSON.parse(JSON.stringify(obj))
  console.log(rep)
}
// uuid 生成
function uuid(is_) {
  let str = ''
  function create16() {
    return parseInt(Math.random() * 16).toString(16)
  }
  for (let i = 0; i < 32; i++) {
    if (is_ === '-' && (i == 8 || i == 12 || i == 16 || i == 20)) {
      str += '-'
    }
    str += create16()
  }
  return str
}
// 防抖延时触发器
class Debounce {
  constructor(time) {
    this.time = time
  }
  run(func) {
    this.func = func
    return new Promise(resolve => {
      let handle = setTimeout(() => {
        this.func()
        resolve()
      }, this.time)
    })
  }
}

// 渲染校验
let renderingCheck = function(permissionAll, routerItem){
  // 开发模式给所有权限
  if(process.env.NODE_ENV === 'development'){
    return true
  }
  // 暂不校验权限
  if(1){ return true }
  // routerItem 路由的节点，permission 当前路由的展示权限，cover项目or资源是否包含该路由
  let state = false
  // 判断父节点的情况
  if (routerItem.children) {
    routerItem.children.some(i => {
      if (renderingCheck(permissionAll, i)) {
        state = true
        return true
      }
    })
    return state
  }
  return state
}
let functions = {
  cpt, getFormatTime, TimeShow, deepCopy, refDeepSearch, log, uuid,Debounce,renderingCheck
}
// 全局注册方法
window.vueSystem = functions
module.exports = functions