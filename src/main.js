import 'babel-polyfill';
import Vue from 'vue';
import 'normalize.css/normalize.css'; // A modern alternative to CSS resets

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

// ==============引入全局样式文件 ========================
import '@/styles/index.scss'; // global css

// import myaxios from '@/resources/jscript/myaxios';
import '@/components';  // 注册了所有的公共组件

import App from './App';
import store from './store';
import router from './router';

import '@/icons'; // icon

import '@/permission'; // permission control
import i18n from './lang/i18n';
import * as echarts from 'echarts';
import filters from './utils/filters'; //将全部过滤器放在 filters/index.js 中便于管理

// 注册全局指令
import vLoading from "./directives/loading";
Vue.directive('loading',vLoading);

Vue.use(ElementUI, { i18n: (key, value) => i18n.t(key, value) });
Vue.config.productionTip = false;
Vue.prototype.$echarts = echarts;

filters(Vue);
new Vue({
  el: '#app',
  i18n,
  router,
  store,
  render: h => h(App)
});
console.log(process.env.NODE_ENV);
