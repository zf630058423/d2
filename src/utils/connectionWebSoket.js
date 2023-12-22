import Vue from 'vue'
import websocketFeature from "@/utils/websocket";  //websoket载入
import store from "@/store";

export default {

  connectionWebSoket() {
    const currUser = store.state.user.author;
    console.log("用户信息：", currUser);
    if (currUser) {
      let url = `${__websoket}/${currUser.userId}`;   //测试环境
      if (!store.state.myWebsocketKey) {
        store.state.myWebsocketKey = websocketFeature.create(url, this.websocketMessageHandler.bind(this));
      }
    }
  },
  //监听websoket的数据
  websocketMessageHandler(e) {
    let mData = JSON.parse(e.data);
    console.log("soket消息===:", mData);
    if (!mData) return;
    if (mData) {
      let COLORTITLE = {  //图标
        SUCCESS: 'el-icon-success',  //绿色 成功
        WARN: 'el-icon-warning',  //橙色 警告
        ERROR: 'el-icon-error' //红色 错误
      }
      let CLOSESTATE = {
        NORMAL: '',  //是否隐藏关闭按钮 隐藏
        CONFIRM: 'el-icon-close',
        PROGRESS: 'el-icon-close'
      }
      let iconType = COLORTITLE[mData.level] || 'el-icon-success'; //标题前面图标类型
      let closeType = CLOSESTATE[mData.type] || '';  //是否显示关闭
      let msg = (mData.type !== 'PROGRESS') ? mData.data.message : '';  //如果不是滚动条显示消息
      let current = (mData.type === 'PROGRESS') ? mData.data.current : 0;
      let total = (mData.type === 'PROGRESS') ? mData.data.total : 0;
      let isAutoClearNotificat = (mData.type === 'NORMAL' || mData.type === 'PROGRESS') ? true : false;  //是否自动关闭

      //如果是进度条progress
      if (mData.type === 'PROGRESS') {
        if (current < total) { //如果进度条没有到100%
          isAutoClearNotificat = false; //不能自动关闭消息框
          closeType = '';  //不显示关闭图标
        }
      }

      let data = {
        type: mData.type,  //消息类型 PROGRESS：进度条  NORMAL：普通消息  confirm：对话框
        iconType,  //类型 消息通知(normal)、对话框消息(confirm)、进度条消息(progress)
        closeType,  //是否显示关闭图标
        title: mData.title || '提示',  //通知消息的标题
        msg, //消息内容
        duration: 600,   //动画时间
        easing: 'linear',  //动画方式  默认线性
        clearTimer: 3000,   //多久自动关闭弹框
        isAutoClearNotificat, //是否自动关闭
        key: mData.keyNo,
        current,  //当前的进度 只有为进度条(progress)类型时才有这个值
        total   //进度的总长度 只有为进度条(progress)类型时才有这个值
      }
      // notification弹框  参数： 标题、消息、动画时间、动画方式、动画多久消失
      Object.toNotification(data); //自定义消息框
    }
  },
  clearWebSoket() {
    if (store.state.myWebsocketKey) {
      websocketFeature.remove(store.state.myWebsocketKey);
      store.state.myWebsocketKey = '';
    }
    Object.toClearNotification();
    console.log("websocket已断开！！！");
  }
}