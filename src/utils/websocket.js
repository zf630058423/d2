/**
 * websoket管理类
 */

import { Message, Loading } from 'element-ui';

const showMessage = (message, type = 'error') => {
  Message({
    showClose: true,
    type: type,
    duration: 4000,
    message,
  });
};

/**
 * websocket控制类
 * 在此新增、编辑、删除、获取websocket
 * */
class WebsocketFeature {
  baseUrl; //默认URL，在config.js中配置，在main.js中注入
  websocket_container; //websocket容器
  constructor() {
    this.websocket_container = new Map(); //初始化
  }
  /**
   * 创建新的websocket
   * @param urlV：
   * 如果是带着wss://或者ws://的字符串，则视为完整的websocketURL,直接作为WebSocket实例化的参数，
   * 如果是普通字符串，则视为拼接到websocketURL后面的参数
   * @param callback：回调函数，用于获取onmessage事件返回的数据
   * @param key: websocketKey，不传值时自动生成，传值时使用给定key
   * @returns 返回websocketKey
   */
  create(urlV, callback, key) {
    let url = this.baseUrl;
    if (typeof urlV == "string" && urlV.constructor == String) {
      if (urlV.match(/wss?:\/\//g)) {
        url = urlV;
      } else {
        url += urlV;
      }
    }
    let websocketValue = new WebSocket(url);
    websocketValue.onmessage = function (e) {
      console.log("消息：", e);
      callback(e);
    };
    websocketValue.onclose = function (e) {
      console.log("websocket断开连接，请查看当前环境和后台服务", e);
    };
    websocketValue.onopen = function () {
      console.log("websocket连接成功！！！");
      // websocketValue.send("111");
    };
    //连接发生错误,第一时间清楚容器里的websocket
    websocketValue.onerror = function (e) {
      console.log(e);
      // showMessage('WebSocket连接发生错误');
      setTimeout(
        function () {
          this.create(urlV, callback, websocketKey);
        }.bind(this),
        10000
      );
    }.bind(this);
    //生成唯一键值
    // const websocketKey = Symbol(websocketValue);
    let websocketKey;
    if (key) {
      websocketKey = key;
    } else {
      websocketKey = Symbol(url);
    }
    this.websocket_container.set(websocketKey, websocketValue);
    return websocketKey;
  }

  /**
   * 根据key获取websocket实例
   * @param key 唯一键值
   * @returns websocket实例或者undefined
   */
  get(key) {
    return this.websocket_container.get(key);
  }

  /**
   * 根据key删除websocket实例，并关闭连接
   * @param key 唯一键值
   * @returns true:成功；false失败
   */
  remove(key) {
    if (this.websocket_container.has(key)) {
      const websocket = this.websocket_container.get(key);
      websocket.close();
      return this.websocket_container.delete(key);
    } else {
      return false;
    }
  }

  /**
   * 清理websocket容器中连接已经关闭或者打开链接失败的websocket
   */
  clear() {
    for (let [key, value] of this.websocket_container.entries()) {
      if (value.readyState == WebSocket.CLOSED) {
        this.websocket_container.delete(key);
      }
    }
  }
}
const websocketFeature = new WebsocketFeature();

export default websocketFeature;