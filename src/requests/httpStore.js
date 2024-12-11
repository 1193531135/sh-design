import axios from 'axios'
// 给个口子给win
window.axios = axios
let path = '';
let baseUrl = 'https://xxx.com/' + path //HAS
console.log('NODE_ENV =>>>>>>',process.env.NODE_ENV)
console.log('VUE_APP_AllPERMISSION =>>>>>>',process.env.VUE_APP_AllPERMISSION)
if(process.env.NODE_ENV === 'production'){
    baseUrl = path
}
export default {
    axios_1:axios.create({
        baseURL:baseUrl, //location
        // timeout:40000, 
        timeout:40000, 
    }),
    default_img_url:'',
    imgUploadUrl:baseUrl,
}