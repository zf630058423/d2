import router from './router';
import store from './store';
import { Message } from 'element-ui';
import NProgress from 'nprogress'; // 路由加载时进度条
import 'nprogress/nprogress.css'; // 路由加载时进度条样式
import { getAuthor, removeAuthor } from '@/utils/auth'; // Cookie或Session储存身份工具
import getPageTitle from '@/utils/get-page-title';
import checkMenuPermission from '@/utils/checkMenuPermission';
import dd from 'dingtalk-jsapi'; //钉钉
import dingTalkApi from '@/Api/login/dingTalk';
import workflowformApi from '@/Api/workflow/workflowform';
NProgress.configure({ showSpinner: false }); // NProgress Configuration

// 不拦截验证登录状态的白名单
const whiteList = ['/login', '/denied', '/localstorage', '/workflow/public/handsign/', '/workflow/public/handsign', '/supplierReg', '/workflow/gridEditor/bankDialog'];

//获取当前是pc还是移动端设备
const userAgent = navigator.userAgent.toLowerCase();

router.beforeEach(async (to, from, next) => {
  // 开始进度条
  NProgress.start();
  var hasAuthor;
  if (to.path == "") {
    return false;
  }
  if (to.query.refresh) {
    to.meta.keepAlive = false;
  } else {
    to.meta.keepAlive = true;
  }

  let corpId = to.query.corpId;
  //let redirect = to.query.redirect;
  // 设置页面标题
  console.log("查看标题：", to.meta);
  document.title = getPageTitle(to.meta.title || "");
  if (whiteList.indexOf(to.path) !== -1) {
    next();
    NProgress.done();
    return false;
  } else if (!hasAuthor) {
    // 确定用户是否已登录
    hasAuthor = getAuthor();
    if (corpId) hasAuthor = "";
  }

  if (!hasAuthor && to.query.hasAuthor) {
    hasAuthor = to.query.hasAuthor;
    hasAuthor = window.atob(hasAuthor);
  }

  let toUrl;
  if (!hasAuthor && to.path == "/homeNew") {
    let code = to.query.authCode;
    if (corpId) {
      await dd.runtime.permission.requestAuthCode({
        corpId: corpId, // 企业id
        onSuccess: function (info) {
          code = info.code;
        }
      });
    }
    if (code) {
      let state = to.query.state;
      if (!state) state = "INTEGRATION";
      let res = await dingTalkApi.loginCode(state, code);
      if (res.success) {
        var data = res.data;
        var integration = {
          openId: data.openId,
          platformId: data.platformId,
          loginApp: "dingding"
        }
        localStorage.setItem("integration", JSON.stringify(integration));
        if (data.author) hasAuthor = JSON.stringify(data.author);
      } else {
        FUI.Window.showMsg(`授权出错: ${res.msg}`);
      }
    }
    toUrl = to.path;
  }

  if (hasAuthor) {
    if (to.path === '/login') {
      next({ path: '/' });
      NProgress.done();
      return false;
    } else {
      const hasUserId = store.getters.userId;
      if (!hasUserId) {
        // 当刷新后再次加载页面时尝试从token中读取登录用户还原到state中
        store.dispatch('user/setAuthor', hasAuthor).then(() => {
          //=================【检查Url的菜单访问权限】跨系统页面集成时，建议注释此段代码=========
          var isTrue = checkMenuPermission(to);
          if (!isTrue) {
            next(`/denied`);
            NProgress.done();
            return false;
          }
        }).catch(() => {
          // 删除鉴权票据并跳转到登录
          store.dispatch('user/removeAuthor');
          Message.error(error || 'Has Error');
          next(`/login?redirect=${to.path}`);
          NProgress.done();
        });
        // 系统设置
        var sysConfigStr = localStorage.getItem('f2bpmSysConfig');
        store.dispatch('app/setSysConfig', sysConfigStr);
        // 当前系统状态,如当前是前端还是后端管理front前端，brand后端
        store.dispatch('app/loadCurrState');
      } else {
        // const currentRoutePath = from.path;
        // const newRoutePath = to.path;
        //=================【检查Url的菜单访问权限】跨系统页面集成时，建议注释此段代码=========
        var isTrue = checkMenuPermission(to);
        if (!isTrue) {
          next(`/denied`);
          NProgress.done();
          return false;
        }
      }

      if (to.path == "/homeNew") {
        let isMobile = userAgent.match(/(iphone|ipod|ipad|android)/)
        let wiid = to.query.wiid;
        let formId = to.query.formId;
        let myId = to.query.myId;
        if (wiid) {
          let res = await workflowformApi.getWorkflowTask(wiid);
          if (res.success) {
            toUrl = `/workflow/workflowform/index/?wiid=${res.data.wiid}`;
            if (res.data.taskId) toUrl += `&formAction=2&taskId=${res.data.taskId}`;
            else toUrl += `&formAction=3`;
          } else {
            FUI.Window.showMsg(`获取流程异常`);
          }

        } else if (formId && myId) {
          let parentGridId = to.query.parentGridId;
          let mainTable = to.query.mainTable;
          let formAction = to.query.formAction;
          toUrl = `/workflow/noWorkflowform/index/?formId=${formId}&formAction=${formAction}&parentGridId=${parentGridId}&mainTable=${mainTable}&myId=${myId}`;
        } else if (isMobile) {
          toUrl = '/newHome'
        } else {
          var userAgentStr = window.navigator.userAgent;
          if (/DingTalk/.test(userAgentStr)) {
            var url = window.location.origin;
            url += to.path
            url += "?hasAuthor="
            url += window.btoa(hasAuthor);
            await dd.biz.util.openLink({
              url: url,
              onSuccess: async function (result) {
                localStorage.removeItem("integration");
                removeAuthor();
                await dd.biz.navigation.close()
              }
            });
          }
        }
      }
      //------------------------ ocr跳转-------------------------
      let redirect = to.query.redirect;
      if (redirect) {
        toUrl = redirect;
      }
      if (toUrl) next(toUrl);
      next();
    }
  } else {
    /* 未登录时*/
    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next();
    } else {
      // 没有登录访问则跳转登录页，如需登录后返回原页面，next(`/login?redirect=${to.path}`)
      next(`/login`);
      NProgress.done();
    }
  }
});

router.afterEach((to, from) => {
  // finish progress bar
  NProgress.done();
});
