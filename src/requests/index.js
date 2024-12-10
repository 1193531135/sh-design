import https from './httpStore'
import router from '../router'
import { Loading } from 'element-ui'
import { Message } from 'element-ui'
import qs from 'querystring'
import { uuid } from '../tool'
import md5 from '../../node_modules/md5'
const axios_1 = https.axios_1
const showImg = https.default_img_url
const imgUploadUrl = https.imgUploadUrl

// message弹窗管理器
class MessageC {
  constructor() {
    this.codeControl = {}
  }
  open(messageConfig, code) {
    if (this.codeControl[code]) {
      return true
    } else {
      this.codeControl[code] = true
      Message({
        ...messageConfig,
        onClose: (() => {
          return () => {
            this.codeControl[code] = false
          }
        })()
      })
    }
  }
}
let message = new MessageC()
// load是否要load状态 ，customBox是否进行返回提示
let request = async (url, data, func, method, Load = false, point = true,) => {
  // 加入object解析模式
  let config = {};
  let serverToPython = false
  if (url.constructor === Object) {
    config = url
    data = config.data
    func = config.func || function () { }
    method = config.method
    Load = config.Load
    point = config.point
    url = config.url
    serverToPython = config.serverToPython
  }
  let loading;
  if (Load) {
    loading = Loading.service()
  }
  await axios_1({
    method: method || 'post',
    url,
    params: method === 'get' ? data : null,
    data: method === 'get' ? null : data,
  }).then((res) => {
    if (Load) {
      loading.close()
    }
    // token超时
    if (res.data.code === 1001) {
      localStorage.removeItem('aiSystem-token')
      router.push('/login')
    }
    if (res.data.code != 200) {
      message.open({ message: res.data.message, type: 'warning' }, res.data.code)
      res.error = res.data.message
    }
    if (res.data.code === 200 && point) {
      Message({ message: res.data.message, type: 'success' })
    }
    func(res)
  }).catch((err) => {
    if (Load) {
      loading.close()
    }
    message.open({ message: err, type: 'error' }, 'error')
    func({ error: err })
    console.log(err)
  })
  return true
}
// 全局文件上传方法
function uploadFile() {
  // 上传
  const func = ({ file, dirKey, url }) => {
    let formData = new FormData();
    formData.append("file", file);
    dirKey && formData.append("dirKey", dirKey);
    let returnData = {
      localUrl: URL.createObjectURL(file)
    }
    return new Promise(resolve => {
      request(
        url,
        formData,
        res => {
          if (!res.error) {
            returnData.fileRelativeUrl = res.data.data.fileRelativeUrl
            returnData.fileUrl = res.data.data.fileUrl
          } else {
            returnData.error = true
          }
          resolve(returnData)
        },
        "post",
        false,
        false
      );
    })
  }
  // s3上传
  const s3Func = async ({ file, dirKey, url }) => {
    /**
     *  @returns {String} returnData.error - 返回的string，error
     *  @returns {String} returnData.fileRelativeUrl - 返回的文件读取的相对路径
     *  @returns {String} returnData.fileUrl - 返回的文件读取的绝对路径
     *  @returns {String} returnData.localUrl - 返回的文件的本地读取路径
     */
    let returnData = {
      localUrl: URL.createObjectURL(file)
    }
    // 生成uuid作为名称
    const params = {
      dirKey,
      fileName: file.name.replace(/.+\./,uuid() + '.'),
      contentType: file.type
    };
    let fileUrl = await new Promise( resolve => { 
      request( url,params,res => {
          res != "error"?resolve(res.data.data):resolve('error')
        },"get",false,false)
    })
    // 对fileUrl进行处理,如果返回url路径包含name，把name的值替换为file.name,如果不包含name则在url添加name且值为file.name
    function replaceName(url,name){
      let urlObj = new URL(url)
      urlObj.searchParams.set('name',name)
      return urlObj.toString()
    }
    // 使用正则替换file.name文件名为uuid
    fileUrl.fileUrl = replaceName(fileUrl.fileUrl,file.name)
    let origin = 'https://test.com/'
    fileUrl.fileRelativeUrl = replaceName(origin + fileUrl.fileRelativeUrl,file.name).replace(origin,'')
    if (fileUrl != 'error') {
      await fetch(fileUrl.uploadUrl, {
        method: 'PUT',
        body: file,
      }).then(() => {
        // 上传成功
        returnData = { ...returnData, ...fileUrl}
        Reflect.deleteProperty(returnData,'uploadUrl')
      }).catch(() => returnData.error = true)
    }else{ returnData.error = true }
    return returnData
  }
  return {
    default: async (config) => { config.url = '/manage/file/upload'; return await func(config) },
    comPress: async (config) => { config.url = '/manage/file/uploadCompressionFile'; return await func(config) },
    s3: async (config) => { config.url = '/manage/file/getTempUploadUrl'; return await s3Func(config) }
  }
}

axios_1.interceptors.request.use(config => {
  config.headers['token'] = localStorage.getItem('aiSystem-token')
  let projId = router.app.$route.params["projId"]
  config.headers['projId'] = projId || ''
  if (config.data && config.data.formData) {
    config.data.formData = ''
    config.data = qs.stringify(config.data)
  }
  // // 对get请求做encode编码
  // if(config.method === "GET"){
  //   for(let item in config.data){
  //     config.data[item] = encodeURIComponent(config.data[item]);
  //   }
  // }
  return config
})
export default {
  request, showImg, imgUploadUrl, uploadFile
}