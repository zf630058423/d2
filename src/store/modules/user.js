import { getAuthor, setAuthor, removeAuthor } from '@/utils/auth';
import { resetRouter } from '@/router';
const getDefaultState = () => {
  return {
    token: '',
    // 当前登录的用户UserId
    userId: '',
    myWebsocketKey: '', // soket对象
    // 鉴权对象
    author: null,
    // 头像
    avatar: 'user_blue.png',
    // 用户的菜单
    memus: [],
    // 首页部分权限
    homeAuth: [],
    userInfo: {}
  };
};
// ================使用方式=================
// this.$store.dispatch('user/setAuthor',"aaa")
// that.$store.state.user.author.userId;
// that.$store.state.user.author.orgId;
// decodeURI(that.$store.state.user.author.realName);
// =========================================
const state = getDefaultState();

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState());
  },
  SET_TOKEN: (state, token) => {
    state.token = token;
  },
  SET_USERID: (state, userId) => {
    state.userId = userId;
  },
  SET_AUTHOR: (state, author) => {
    state.author = author;
  },
  SET_Menus: (state, memus) => {
    state.memus = memus;
  },
  SET_USERINFO: (state, userInfo) => {
    state.userInfo = userInfo;
  },
  // 首页部分权限管理
  HOME_AUTH: (state, auth) => {
    state.homeAuth = auth;
  }
};

const actions = {
  setUserInfo({
    commit
  }, userInfo) {
    return new Promise((resolve, reject) => {
      console.log('SET_USERINFO == ', userInfo)
      commit('SET_USERINFO', userInfo);
      resolve();
    })
  },
  setAuthor({ commit }, authorStr) {
    // Promise对象用来将异步操作以同步操作的流程表达出来
    return new Promise((resolve, reject) => {
      setAuthor(authorStr);
      var authorObj = eval('(' + authorStr + ')');
      commit('SET_TOKEN', authorObj.token);
      commit('SET_USERID', authorObj.userId);
      commit('SET_AUTHOR', authorObj);
      // decodeURI(authorObj.realName);
      resolve();
    });
  },
  setMenus({ commit }, memus) {
    return new Promise((resolve, reject) => {
      commit('SET_Menus', memus);
      resolve();
    });
  },
  removeAuthor: function({ commit }, type) { // 退出登录
    return new Promise((resolve, reject) => {
      removeAuthor();
      localStorage.removeItem('f2bpmMemus');
      localStorage.removeItem('f2bpmBreadcrumbMenus');
      localStorage.removeItem('f2bpmHomeData');
      localStorage.removeItem('activeMenuName');
      localStorage.removeItem('currState');
      localStorage.removeItem('sidebarStatus');
      localStorage.removeItem('f2bpmSysConfig');
      localStorage.removeItem('homeAuth');
      localStorage.removeItem('f2bpmConfigTypeListData');
      localStorage.removeItem('dingdingConfig');
      localStorage.removeItem('progressData');
      localStorage.removeItem('integration');
      localStorage.removeItem('TeamContractNo');
      localStorage.removeItem('funnelData');
      commit('RESET_STATE');
      commit('HOME_AUTH');
      resolve();
    });
  },
  removeCache: function({ commit }) {
    // 刷新缓存
    return new Promise((resolve, reject) => {
      localStorage.removeItem('f2bpmConfigTypeListData');
      resolve();
    });
  },
  // 仅删除登录票据
  resetAuthor({ commit }) {
    return new Promise(resolve => {
      removeAuthor();
      commit('RESET_STATE');
      resolve();
    });
  }
  // GetHomeAuth({commit, state, dispatch}) {
  //   return new Promise((resolve, reject) => {
  //     setTimeout(function () {
  //       var getUserId = state.userId;
  //       console.log(getUserId,'12323');
  //       $.extendAjax(`/projecthall/marketingmanage/isCorrespondingRoles?userId=${getUserId}`, '', "get", function (d) {
  //         if (d.data) {
  //           commit('HOME_AUTH', d.data);
  //           resolve();
  //         }
  //       })
  //     }, 500);
  //
  //   })
  // },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};

