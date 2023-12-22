import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getAuthor } from '@/utils/auth'

// console.log("11111111111111"+__serverpath);
// 创建请求axios实例
const service = axios.create({
  baseURL: __serverpath, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5*20*1000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent
    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      // 'Content-type': 'application/x-www-form-urlencoded',
      var f2bpmToken = ''
      var author = getAuthor()
      if (author) {
        author = eval('(' + author + ')')
        f2bpmToken = author.token
        // XMLHttpRequest.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        // XMLHttpRequest.setRequestHeader('f2bpmToken', f2bpmToken);
      }

      config.headers['f2bpmToken'] = f2bpmToken
      config.headers['Content-Type'] = 'application/json'
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
   */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const res = response.data
    var loginStatus = response.statusCode
    if (res.errMsg && res.errMsg.indexOf('ERR_CONNECTION_REFUSED')) {
      Message({
        message: '网络错误，请求失败',
        type: 'error',
        duration: 5 * 1000
      })
    }
    //发票信息采集导入异常处理
    if(res.code === 500 && res.success == false){
      return res
    }
    // if the custom code is not 20000, it is judged as an error.
    if (res.success != undefined && res.success == false) {
      Message({
        message: res.msg || 'Error',
        type: 'error',
        duration: 5 * 1000
      })

      // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
      if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
        // to re-login
        MessageBox.confirm(
          'You have been logged out, you can cancel to stay on this page, or log in again',
          'Confirm logout',
          {
            confirmButtonText: 'Re-Login',
            cancelButtonText: 'Cancel',
            type: 'warning'
          }
        ).then(() => {
          store.dispatch('user/resetToken').then(() => {
            location.reload()
          })
        })
      }
      return Promise.reject(new Error(res.message || 'Error'))
    } else {
      return res
    }
  },
  error => {
    console.log('err' + error) // for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
