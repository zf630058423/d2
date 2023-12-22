import Vue from 'vue';

//==============引入自定义vue组件控件 ======================
const component = require.context('@/views/workflow/components/f2bpmui', true, /\.vue$/);
const requireAll = context => context.keys().map(context);
requireAll(component).forEach((item) => {
  let name = item.default.name;
  Vue.component(`${name}`, item.default);
});

// ==============引入扩展Vue源生方式编写的组件 =================
import f2bpmGridsearchform from '@/views/workflow/components/f2bpmui-gridsearchform';
Vue.component('f2bpm-gridsearchform', f2bpmGridsearchform);
import f2bpmDatagrid from '@/views/workflow/components/f2bpmui-datagrid';
Vue.component('f2bpm-datagrid', f2bpmDatagrid);

import Treeselect from '@riophae/vue-treeselect';
import '@riophae/vue-treeselect/dist/vue-treeselect.css';
Vue.component('treeselect', Treeselect);

// ============== 在线表单控件组件 ============================
import f2bpmSubtable from '@/views/workflow/components/onlineForm/f2bpm-subtable';
Vue.component('f2bpm-subtable', f2bpmSubtable);
import f2bpmMobilesubtable from '@/views/workflow/components/onlineForm/f2bpm-mobilesubtable';
Vue.component('f2bpm-mobilesubtable', f2bpmMobilesubtable);

import f2bpmOnlineformitem from '@/views/workflow/components/onlineForm/f2bpm.online.formitem';
Vue.component('f2bpm-onlineformitem', f2bpmOnlineformitem);
