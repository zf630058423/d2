import store from '../store';
import defaultSettings from '@/settings';

const isCheckMenuPermission = defaultSettings.checkMenuPermission;
window._treeMenusFindItemByPath = function (arr, path) {
  if (arr == null) return null;
  for (let obj of arr) {
    if (obj.attributes&&obj.attributes.functionUrl&&obj.attributes.functionUrl.indexOf(path) > -1) {
      return obj;
    }
    let ret = window._treeMenusFindItemByPath(obj.children, path);
    if (ret) return ret;
  }
  return null;
};
export default function checkMenuPermission(to) {
  let isTrue = true;
  var meta = to.meta;
  var path = to.path;
  if (path && isCheckMenuPermission && meta && meta.requireAuth) {
    //检查访问权限
    if (Object.toEndWith(path, "/")) {
      path = path.substring(0, path.length - 1);
    }
    let memus = store.state.user.memus;
    let myAllMenus = [];
    if (memus && memus.length > 0) {
      myAllMenus = memus;
    } else {
      let f2bpmMemus = localStorage.getItem('f2bpmMemus');
      if (f2bpmMemus) {
        myAllMenus = eval('(' + f2bpmMemus + ')');
        store.dispatch('user/setMenus', myAllMenus);
      }
    }
    let item = null;
    if (myAllMenus && myAllMenus.length > 0) {
      item = window._treeMenusFindItemByPath(myAllMenus, path);
    }
    if (item != null && item.title) {
      document.title = item.title;
    }
    isTrue = item != null;
  }
  return isTrue;
}
