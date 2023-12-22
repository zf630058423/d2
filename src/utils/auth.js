import Cookies from 'js-cookie';

const AuthorKey = 'f2bpmAuthor';

// 同域共享Seesion方式
const SSOTokenKey = 'f2bpmSSOToken';

// 本地对传入Token的存储
const accessTokenKey = 'accessToken';
export function getAuthor() {
  var author = localStorage.getItem(AuthorKey);
  // 上一次传递过来的Url token
  var local_accessToken = localStorage.getItem(accessTokenKey);
  var token = '';
  // session 方式的token
  // var sso_token =localStorage.getItem(SSOTokenKey) ;
  // 外部系统通过Url嵌入功能页面，参数传递token方式，access_token值由F2bpm_sdk发行
  // 示例：http://localhost:9528/#/workflow/workflowBusiness/access_todoList?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE2MjAxOTc1NjgsImF1dGhvckpzb24iOiJ7XCJ0aW1lU3RhbXBcIjpcIjE2MTkzMzM1NjY3MDJcIixcImxvZ2luT3JnSWRcIjpcIlwiLFwiY29ycElkXCI6XCJBcHAxOTA1MDYxMDA1MDNcIixcInNpZ25hdHVyZVwiOlwiRWlRa0p5WWN3TXJUREVUOU1DVWR1c3R5Z0dGZ09RekVqczdUS0dicjhrQVNycXljMjVWd0k1eGwycDIlMkZZQmlPa2pOM2pmcFBLRUVLJTBEJTBBWGElMkI1QmhlRkNaY2NDWG9VeTFqUlwiLFwidGVuYW50SWRcIjpcIkJQTVwiLFwibG9naW5Vc2VySWRcIjpcIjNjMWRmMGIzLWE0ZDktNDczMS1iMTQzLTAyZTgxYmNlMTdjZVwiLFwibm9uY2VcIjpcIjQ5NDBcIn0ifQ.cZWSNT4MdDJdieiu6CFxMCqTFwrVnhSlr9fnwNz8ryo
  var access_token = Object.toQueryString('token') || '';
  token = access_token;
  var isTokenLogin = false;
  if (access_token && author == null) {
    console.info('首次token登录:' + token);
    isTokenLogin = true;
  }
  // 校验本地的token是否与传入的一致，不一致时需要重新登录
  if (author != null && access_token && local_accessToken != access_token) {
    console.info('token重新登录:' + token);
    isTokenLogin = true;
  }
  if (isTokenLogin) {
    var parms = {
      'token': token
    };
    var result = Object.toAjaxJson('/login/', 'loginByToken', parms, false);
    if (result.success) {
      console.info(result.data);
      var authorStr = JSON.stringify(result.data);
      localStorage.setItem(AuthorKey, authorStr);
      localStorage.setItem(accessTokenKey, token);
      return authorStr;
    } else {
      localStorage.removeItem(AuthorKey);
      localStorage.removeItem(accessTokenKey);
      FUI.Window.showMsg('接入失败，请联运维管理员;' + result.msg);
    }
  }
  return author;
}

export function setAuthor(authorStr) {
  // return Cookies.set(TokenKey, token)
  localStorage.setItem(AuthorKey, authorStr);
}

export function removeAuthor() {
  // return Cookies.remove(TokenKey)
  localStorage.removeItem(AuthorKey);
}

// demo:
// import { getAuthor } from '@/utils/auth'
// const hasAuthor = getAuthor()
