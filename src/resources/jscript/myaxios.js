/**
 * axios 的简单封装
 */
import Vue from 'vue'
import axiosRequest from '@/utils/request'
import qs from 'qs'

const myaxios = {}


// 获取json数据ajax请求 methodName:方法名,
// methodName可为null, 为null时默认请求地址方法，如 handler的 ProcessRequest
// async是否异步：默认true,异步请求需要传入回调函数
// data Json参数如{a:"aValue",b:"bValue"}
// data 数组参数形式[{name:"a",value"aValue"},{name:"b",value"bValue"}]
// type:请求类别默认post
// dataType:预期服务器返回的数据类型[string,xml,html,script,json(默认),text]
// isloading:是否加载遮罩层，默认为true
function myaxiosAjaxJson(url, method, data, callback, async, type, dataType, isloading) {
  dataType = dataType || 'json'
  if (url == undefined) {
    alert('ajaxjson url is not empty')
    return false
  }
  if (async == undefined || async == null) {
    async = true
  }
  if (async && (isloading == undefined || isloading == null)) {
    isloading = true
  } else if (isloading == undefined || isloading == null || async == undefined || async == null) {
    isloading = false
  }
  method = method || ''
  var index = url.indexOf('?')
  if (index > -1 && method) {
    var controller = url.substr(0, index)
    var parmStr = url.substring(index)
    url = controller + method + '/' + parmStr
  } else if (method) {
    url = url + method
  }
  var json = {}
  var isAsync = async
  // 只能是一个Object的Json方式
  var theData = {}
  // ================统一转为Json格式=====================
  if (Object.toIsArray(data)) {
    // 将name value对象的数组转Json
    theData = Object.toArrToJson(data)
  } else {
    // Json形式
    theData = data
  }
  // ============统一转为form data数组方式================
  // if (!myObject.toIsArray(data)) {
  // 	//如果参数是Json对象，则转为数组
  // 	var arr = myObject.toJsonToArr(data);
  // 	theData = arr;
  // } else {
  // 	//数组参数形式
  // 	theData = data;
  // }

  if (isloading) {
    // uni.showLoading({
    // 	mask: true,
    // 	title: "加载中..."
    // });
  }
  var parmsStr = ''
  if (data == undefined || data == null) {
    parmsStr = ''
  } else {
    parmsStr = qs.stringify(theData)
  }
  axiosRequest.post(url, parmsStr).then(function(d) {
    console.log(d)
    // "token过期", 111 "无效的token", 110 "无效签名", 104 "api key无效", 101
    if (d && typeof (d) === 'object' && d.success != undefined && d.success == false && d.code != undefined && d.code !=
      null && (d.code == 110 || d.code == 111 || d.code == 101 || d.code == 104)) {
      return false
    }
    if (callback && typeof (callback) !== 'function') {
      throw TypeError('the callback parameter not is a function')
    } else if (callback) {
      callback(d)
    }
    json = d
  }).catch(function(error) {
    console.log(error)
  })
}
myaxios.toAjaxJson = myaxiosAjaxJson
if (!Vue.prototype.$myaxios) {
  Vue.prototype.$myaxios = myaxios
}
export default myaxios
