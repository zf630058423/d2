import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import app from './modules/app'
import settings from './modules/settings'
import user from './modules/user'
import claimExpense from './modules/claimExpense'

Vue.use(Vuex)
// modules:是分为三个模块，每个模块都是单独的store
const store = new Vuex.Store({
  modules: {
    app,
    settings,
    user,
    claimExpense
  },
  getters
})

export default store
