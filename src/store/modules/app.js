import Cookies from 'js-cookie'

const state = {
  // 系统的一些当前状态，刷新后依然存在
  currState: {
    // 当前应用管理端：desktop首页桌面 或主菜单导航的菜单资源ID
    mangementSide: 'desktop',
    // 当前菜单
    currMenuId: '',
    currMenuTitle: '',
    currMenUrl: '',
    currMenuParentId: ''//新增父级菜单url id
  },
  // tagsView专用数组
  tagsView: [],
  sysConfig: {},

  sidebar: {
    // opened: Cookies.get('sidebarStatus') ? !!+Cookies.get('sidebarStatus') : true,
    opened: localStorage.getItem('sidebarStatus')
      ? !!+localStorage.getItem('sidebarStatus')
      : false,
    // 动画
    withoutAnimation: false
  },
  language: localStorage.getItem('f2bpm-language')
    ? localStorage.getItem('f2bpm-language')
    : 'zh-CN', //en-US,zh-CN
  device: 'desktop'
}
// 用于处理同步数据修改
const mutations = {
  // 设置当前菜单
  SET_CurrMenuId: (state, { currMenuId, currMenuTitle, functionUrl, currMenuParentId }) => {
    state.currState.currMenuId = currMenuId
    state.currState.currMenuTitle = currMenuTitle
    state.currState.currMenUrl = functionUrl;
    state.currState.currMenuParentId = currMenuParentId;
    if (state.tagsView.length === 0) {
      state.tagsView.push({
        currMenuId: currMenuId,
        currMenuTitle: currMenuTitle,
        functionUrl: functionUrl,
        currMenuParentId: currMenuParentId
      })
    } else {
      if (state.tagsView.some(x => x.functionUrl === functionUrl) === true)
        return
      state.tagsView.push({
        currMenuId: currMenuId,
        currMenuTitle: currMenuTitle,
        functionUrl: functionUrl,
        currMenuParentId: currMenuParentId
      })
    }
    localStorage.setItem('currState', JSON.stringify(state.currState))
  },

  SET_SysConfig: (state, sysConfig) => {
    state.sysConfig = sysConfig
  },
  TOGGLE_SIDEBAR: state => {
    state.sidebar.opened = !state.sidebar.opened
    state.sidebar.withoutAnimation = false
    if (state.sidebar.opened) {
      localStorage.setItem('sidebarStatus', 1)
      // Cookies.set('sidebarStatus', 1)
    } else {
      localStorage.setItem('sidebarStatus', 0)
      // Cookies.set('sidebarStatus', 0)
    }
  },
  CLOSE_SIDEBAR: (state, withoutAnimation) => {
    localStorage.setItem('sidebarStatus', 0)
    state.sidebar.opened = false
    state.sidebar.withoutAnimation = withoutAnimation
  },
  OPEN_SIDEBAR: (state, withoutAnimation) => {
    localStorage.setItem('sidebarStatus', 1)
    state.sidebar.opened = true
    state.sidebar.withoutAnimation = withoutAnimation
  },
  TOGGLE_DEVICE: (state, device) => {
    state.device = device
  },
  toggle_language: (state, language) => {
    state.language = language
    localStorage.setItem('f2bpm-language', language)
  },
  // 设置管理端类型
  SET_MangementSide: (state, mangementSide) => {
    state.currState.mangementSide = mangementSide
    localStorage.setItem('currState', JSON.stringify(state.currState))
  },
  // 清除当前菜单
  Remove_CurrMenuId: state => {
    state.currState.currMenuId = ''
    state.currState.currMenuTitle = ''
    state.currState.currMenUrl = ''
    state.currState.mangementSide = 'desktop'
    localStorage.removeItem('currState')
    localStorage.setItem('sidebarStatus', 0)
  },
  // 将从session中加载到state
  Load_CurrState(state) {
    var currStateStr = localStorage.getItem('currState')
    if (currStateStr) {
      state.currState = eval('(' + currStateStr + ')')
    }
  }
}
// action用于异步修改
// =====写入示例：this.$store.dispatch("app/setMangementSide", mangementside);
// that.$store.dispatch("app/removeCurrMenuId");
// that.$store.dispatch("app/closeSideBar");
// =====读取示例：this.$store.state.app.currState.currMenuId;
const actions = {
  loadCurrState({ commit }, mangementSide) {
    return new Promise((resolve, reject) => {
      commit('Load_CurrState')
      resolve()
    })
  },
  setMangementSide({ commit }, mangementSide) {
    return new Promise((resolve, reject) => {
      commit('SET_MangementSide', mangementSide)
      resolve()
    })
  },
  setCurrMenuId({ commit }, { currMenuId, currMenuTitle, functionUrl, currMenuParentId }) {
    return new Promise((resolve, reject) => {
      commit('SET_CurrMenuId', {
        currMenuId: currMenuId,
        currMenuTitle: currMenuTitle,
        functionUrl: functionUrl,
        currMenuParentId: currMenuParentId,
      })
      resolve()
    })
  },
  removeCurrMenuId({ commit }) {
    return new Promise((resolve, reject) => {
      commit('Remove_CurrMenuId')
      resolve()
    })
  },

  setSysConfig({ commit }, sysConfigStr) {
    // Promise对象用来将异步操作以同步操作的流程表达出来
    return new Promise((resolve, reject) => {
      var sysConfigObj = eval('(' + sysConfigStr + ')')
      commit('SET_SysConfig', sysConfigObj)
      resolve()
    })
  },

  toggleSideBar({ commit }) {
    commit('TOGGLE_SIDEBAR')
  },
  closeSideBar({ commit }, { withoutAnimation }) {
    commit('CLOSE_SIDEBAR', withoutAnimation)
  },
  openSideBar({ commit }, { withoutAnimation }) {
    commit('OPEN_SIDEBAR', withoutAnimation)
  },
  toggleDevice({ commit }, device) {
    commit('TOGGLE_DEVICE', device)
  },
  toggleLanguage({ commit }, language) {
    commit('toggle_language', language)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
