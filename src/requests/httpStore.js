import axios from 'axios'
// 给个口子给win
window.axios = axios
let path = '';
// let baseUrl = 'http://172.20.10.65' + path //HAS
// let baseUrl = 'http://172.20.10.78' + path //HAS
// let baseUrl = 'http://3.141.137.13/' + path //线上用户模块
let baseUrl = 'https://backend-dev.7mfitness.com/' + path //HAS
// let baseUrl = 'https://kaeya.notmagic.ai/' + path //HAS
// let baseUrl = 'http://test.heroteam.online:2086/' + path //HAS
console.log('NODE_ENV =>>>>>>',process.env.NODE_ENV)
console.log('VUE_APP_AllPERMISSION =>>>>>>',process.env.VUE_APP_AllPERMISSION)
if(process.env.NODE_ENV === 'production'){
    baseUrl = path
    // baseUrl = 'http://192.168.10.65' + path
}
// if(process.env.NODE_ENV === 'test'){
//     // baseUrl = 'http://192.168.10.65' + path
//     baseUrl = 'http://test.heroteam.online:2086' + path
// }
export default {
    axios_1:axios.create({
        baseURL:baseUrl, //location
        // timeout:40000, 
        timeout:40000, 
    }),
    axios_2:axios.create({
        baseURL:baseUrl, //location
        timeout:0,
    }),
    default_img_url:'',
    imgUploadUrl:baseUrl,
}