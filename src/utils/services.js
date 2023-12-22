/**
 * 这里是ajax的通用访问接口处理
 */
import axios from 'axios';
import Qs from 'qs';
import { Message, Loading } from 'element-ui';
import { HTTP_STATUS_CODE } from '../enums/httpStatusCode';
import { assign, isPlainObject } from 'lodash';

const showMessage = (message, type = 'error') => {
  Message({
    showClose: true,
    type: type,
    duration: 4000,
    message,
  });
};

const loadMessage = (isLock = true, msg = '加载中...') => {
  return Loading.service({
    lock: true,
    text: msg, // 可以自定义文字
    spinner: 'el-icon-loading', // 自定义加载图标类名
    background: 'rgba(0, 0, 0, 0.2)'// 遮罩层背景色
  });
}

function redirectLogin() {
  let demain = '';
  if (process.env.NODE_ENV === 'development') {
    demain = WD_PROXY_DOMAIN;
  }
  window.top.location.href = `${demain}/login.html`;
  // window.location.href = __webpath + '/login';
}

/**
 * 服务端接口empty字符串跟null返回的结果不同，过滤掉empty字符串
 * @param params
 * @param emptyString 是否过滤空字符串
 */
function filterEmptyKey(params, emptyString) {
  if (Array.isArray(params) || params == null) {
    return params;
  }

  Object.keys(params).forEach(key => {
    if (params[key] === null || (emptyString && params[key] === '')) {
      delete params[key];
    }
  });
}

class Service {
  _requests = {};
  _config = {
    mode: 'single',
    hideErrorMsg: false,
    hideLoad: false,
  };

  axiosInstance = null;

  interceptor = null; //

  loadingInstancel = null; // 请求时开启的加载组件

  _openLoadRequestNum = 0; // 当前启用 loading 的并处于请求状态的请求数（请求结束后会减一）

  constructor(config) {
    this.axiosInstance = axios.create(config);
    this._config = config;
  }

  loadingMessage = null;

  request(config) {
    const { mode = 'single' } = this._config;
    if (mode === 'single') {
      const key = this._getRequestKey(config);
      config.idKey = key;
      if (!this._requests[key] || this._requests[key] === 'done') {
        this._requests[key] = this.axiosInstance.request(config);
      }
      return this._requests[key];
    } else if (mode === 'unlimit') {
      return this.axiosInstance.request(config);
    } else {
      return Promise.reject(new Error(`请求模式(mode)只支持 'single' 和 'unlimit'，而您传入的是 '${mode}'`));
    }
  }

  urlConfig(url, me) {
    if (url == undefined) {
      alert('ajaxjson url is not empty');
      return false;
    }
    let method = me || '';
    let httpUrl = '';
    let index = url.indexOf('?');
    if (index > -1 && method) {
      const controller = url.substr(0, index);
      const parmStr = url.substring(index);

      httpUrl = controller + method + '/' + parmStr;
    } else if (method) {
      httpUrl = url + method;
    }
    if (__serverpath != '' && !Object.toStartWith(url, __serverpath) && !Object.toStartWith(url, 'http')) {
      httpUrl = __serverpath + url;
    }
    return httpUrl;
  }

  get(url, config = {}) {
    config.url = this.urlConfig(url);
    config.method = 'get';
    config.headers = this.getHeaders('');
    return this.request(config);
  }

  delete(url, config = {}) {
    config.url = this.urlConfig(url);
    config.method = 'delete';
    config.headers = this.getHeaders('');
    return this.request(config);
  }

  head(url, config = {}) {
    config.url = thsi.urlConfig(url);
    config.method = 'head';
    config.headers = this.getHeaders('');
    return this.request(config);
  }

  getHeaders(contentType) {
    let f2bpmToken = "";
    let author = localStorage.getItem('f2bpmAuthor');
    if (author) {
      author = eval("(" + author + ")");
      f2bpmToken = author.token;
    }
    return {
      'Content-Type': contentType || 'application/json',
      "f2bpmToken": f2bpmToken
    }
  }

  post(url, data, config = {}, contentType) {
    config.method = 'post';
    config.url = this.urlConfig(url);
    data && (config.data = data);

    const isArray = Object.prototype.toString.call(data) === '[object Array]';

    const defaultConfig = {
      headers: this.getHeaders(contentType),
      transformRequest: function (params, requestConfig) {
        if (isArray) {
          return JSON.stringify(data);
        }
        return JSON.stringify(params);
      },
    };
    config = Object.assign(defaultConfig, config);

    return this.request(config);
  }

  postForm(url, data, config = {}) {
    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
      'X-Requested-With': 'XMLHttpRequest',
    };
    config.headers = isPlainObject(config.headers) ? assign({}, config.headers, headers) : headers;
    config.transformRequest = d => {
      return Qs.stringify(d);
    };
    return this.post(url, data, config);
  }

  put(url, data, config = {}) {
    config.method = 'put';
    config.url = url;
    data && (config.data = data);
    return this.request(config);
  }

  patch(url, data, config = {}) {
    config.method = 'patch';
    config.url = this.urlConfig(url);
    config.headers = this.getHeaders('');
    data && (config.data = data);
    return this.request(config);
  }

  /**
   * 带有数组参数的get请求，需要对数组参数转换，如ids: [1, 2, 3]转换成ids=1&ids=2&ids=3
   * @param url
   * @param config
   * @return {AxiosPromise<any>}
   */
  arrayGet(url, config) {
    if (config) {
      config.paramsSerializer = function (params) {
        return Qs.stringify(params, { arrayFormat: 'repeat' });
      };
    }
    return this.get(url, config);
  }

  /**
   * 带有数组参数的post请求，需要对数组参数转换，如ids: [1, 2, 3]转换成同个参数名多次传递
   * @param url 请求路径
   * @param data 请求参数
   * @param config
   * @return {AxiosPromise<any>}
   */
  arrayPost(url, data, config) {
    const defaultConfig = {
      transformRequest() {
        const res = Qs.stringify(data, { arrayFormat: 'repeat' });
        return res;
      },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    };
    const newConfig = Object.assign(defaultConfig, config);
    return this.post(url, data, newConfig);
  }

  /**
   * 下载请求
   * @param {String} url 请求的url
   * @param {Object} config 配置
   * @return promise对象
   */
  download(url, config = {}) {
    const { type = 'get', isLoading = false, loadingMsg = '导出中', params = {} } = config;
    let author = window.localStorage.getItem('f2bpmAuthor');
    author = eval('(' + author + ')');
    const f2bpmToken = author.token;

    const defaultConfig = {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json; charset=utf-8',
        'f2bpmToken': f2bpmToken,
        withCredentials: true,
      },
      file: true,
      responseType: 'blob',
    };
    if (config.timeout) { 
      instance.timeout = config.timeout;
    }
    
    if (isLoading) {
      instance.loadingMessage = loadMessage(true, loadingMsg);
      // this.loadingMessage = loadMessage(true, loadingMsg);
    }
    const newConfig = Object.assign(defaultConfig, config);
    if (type === 'get') {
      defaultConfig.headers['Content-Type'] = 'application/json; charset=utf-8'
      newConfig.params = params;
      return this.arrayGet(url, newConfig);
    } else if (type === 'json') {
      defaultConfig.headers['Content-Type'] = 'application/json; charset=utf-8'
      newConfig.transformRequest = function (data, requestConfig) {
        if (Array.isArray(params)) {
          return JSON.stringify(params);
        }
        return JSON.stringify(data);
      };
    }
    return this.post(url, params, newConfig);
  }

  setRequestType(idKey, payload = 'done') {
    this._requests[idKey] = payload;
  }

  openLoad(config = {}) {
    const hideLoad = Object.prototype.hasOwnProperty.call(config, 'hideLoad') ? config.hideLoad : this._config.hideLoad;

    if (!hideLoad) {
      this._openLoadRequestNum++;
      if (!instance.loadingInstancel) {
        this.loadingInstancel = Loading.service();
      }
    }
  }

  /**
   * 关闭加载组件
   * @param { Object } 当前请求的请求配置
   */
  closeLoad(config = {}) {
    const hideLoad = Object.prototype.hasOwnProperty.call(config, 'hideLoad') ? config.hideLoad : this._config.hideLoad;

    if (!hideLoad) {
      this._openLoadRequestNum--;
      if (this._openLoadRequestNum === 0 && this.loadingInstancel) {
        this.loadingInstancel.close();
      }
    }
  }

  _getRequestKey(config) {
    let key = `${config.url}/${config.method}/`;
    if (config.data) {
      const data = { ...config.data };
      delete data._t;
      key += Qs.stringify(config.data);
    }
    if (config.params) {
      const params = { ...config.params };
      delete params._t;
      key += Qs.stringify(config.params);
    }

    return key;
  }
}

const instance = new Service({
  baseURL: '',
  timeout: 60000,
  // timeout: 90000,
  headers: {
    'Cache-Control': 'no-cache',
    'X-Requested-With': 'XMLHttpRequest',
    // 'Content-Type': 'application/x-www-form-urlencoded',
  },
  hideLoad: true,
});

instance.axiosInstance.interceptors.request.use(
  config => {
    // 请求时间，用于记录请求时间
    const _t = Date.parse(new Date()) / 1000;

    if (config.params) {
      config.params = {
        ...config.params,
        _t,
      };
    } else {
      config.params = {
        _t,
      };
    }

    // 启用
    if (!config.hideLoad) {
      instance.openLoad(config);
    }

    if (config.method === 'post') {
      const params = {
        ...config.data,
      };

      // 清楚传参中值为null的字段
      filterEmptyKey(params, false);

      config.data = params;
    } else if (config.method === 'get') {
      // get 过滤值为 null 的 空字符串
      filterEmptyKey(
        config.params,
        Object.hasOwnProperty.bind(config, 'filterEmptyString') ? config.filterEmptyString : true
      );
    }

    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

instance.axiosInstance.interceptors.response.use(
  res => {
    const { config, data } = res;
    instance.setRequestType(config.idKey);

    // 关闭 load 组件
    if (!config.hideLoad) {
      instance.closeLoad(config);
    }

    if (instance.loadingMessage) { 
       instance.loadingMessage.close()
    }

    // 判断是否文件, 如果是文件，直接走浏览器下载
    if (config.file && res.status === 200) {
      convertRes2Blob(res,config);
      return true;
    }

    // Blob 类型处理
    if (data instanceof Blob) {
      // 兼容自定义下载文件名
      if (config.withFileName) {
        return res;
      }
      return data;
    }

    if (data.code !== HTTP_STATUS_CODE.OK && (!data.success || data.success === 'false')) {
      const msg = data.errorMessage || data.message || data.msg || '';
      const code = data.errorCode || data.code || '';

      // 未手动配置 隐藏 消息提示时，公共提醒错误
      if (!config.hideErrorMsg) {
        setTimeout(() => {
          showMessage(msg ? `${config.action || '请求'}失败：${msg}` : `服务开小差了，请稍后再试！${code}`);
        }, 0);
      }

      // 登录权限跳转
      if (code === HTTP_STATUS_CODE.UNAUTHORIZED) {
        setTimeout(redirectLogin, 1000);
      }

      return Promise.reject(
        new Error(
          JSON.stringify({
            code: code || -1000,
            message: msg,
          })
        )
      );
    }

    if (data && data.totalCount) {
      data.totalCount = Number(data.totalCount);
    }

    if (data && data.total) {
      data.total = Number(data.total);
    }

    return data || {};
  },
  error => {
    const { config, response } = error;

    instance.setRequestType(config.idKey);

    // 关闭 load 组件
    if (!config.hideLoad) {
      instance.closeLoad(config);
    }

    let message = error.message;
    if (response) {
      if (response.data && response.data.msg) {
        message = response.data.msg;
      } else if (response.status === HTTP_STATUS_CODE.FORBIDDEN) {
        message = '你没有该权限！';
      } else if (response.status === HTTP_STATUS_CODE.BAD_GATEWAY) {
        message = '系统升级，请稍后重试！';
      } else if (response.status === HTTP_STATUS_CODE.GATEWAY_TIMEOUT) {
        message = '系统超时，请稍后重试！';
      }
    }

    if (!config.hideErrorMsg) {
      setTimeout(() => {
        showMessage(`${error.config.action || '请求'}失败：${message}`);
      }, 0);
    }

    return Promise.reject(error);
  }
);

/**
 * 流文件通过浏览器下载
 * @param response
 */
function convertRes2Blob(response, config) {
  const cdispostion = response.headers['content-disposition']; // 从response的headers中获取filename, 后端response.setHeader("Content-disposition", "attachment; filename=xxxx.docx") 设置的文件名;
  const contentDisposition = decodeURI(cdispostion);
  // const patt = /filename=([^;]+\\.[^\\.;]+);*/;
  // const result = patt.exec(contentDisposition);
  let result = '';
  const iFileName = 'filename';
  if (contentDisposition.includes(iFileName)) {
    const index = contentDisposition.indexOf(iFileName);
    const fileNameLen = iFileName.length;
    const startIndex = index + fileNameLen + 1;
    let lastIndex = contentDisposition.length;
    if (contentDisposition.includes('.')) { 
      lastIndex = contentDisposition.lastIndexOf('.')
    }
    result = contentDisposition.substring(startIndex, lastIndex);
  }
  const name = config.fileName || 'file';
  const fileName = result ?  `${result}.xlsx`: `${name}.xlsx`;
  // 将二进制流转为blob
  const blob = new Blob([response.data], { type: 'application/vnd.ms-excel;charset=utf-8' });
  if (typeof window.navigator.msSaveBlob !== 'undefined') {
    // 兼容IE，window.navigator.msSaveBlob：以本地方式保存文件
    window.navigator.msSaveBlob(blob, decodeURI(fileName));
  } else {
    // 创建新的URL并指向File对象或者Blob对象的地址
    const blobURL = window.URL.createObjectURL(blob);
    // 创建a标签，用于跳转至下载链接
    const tempLink = document.createElement('a');
    tempLink.style.display = 'none';
    tempLink.href = blobURL;
    tempLink.setAttribute('download', decodeURI(fileName));
    // 兼容：某些浏览器不支持HTML5的download属性
    if (typeof tempLink.download === 'undefined') {
      tempLink.setAttribute('target', '_blank');
    }
    // 挂载a标签
    document.body.appendChild(tempLink);
    tempLink.click();
    document.body.removeChild(tempLink);
    // 释放blob URL地址
    window.URL.revokeObjectURL(blobURL);
  }
}

export default instance;
