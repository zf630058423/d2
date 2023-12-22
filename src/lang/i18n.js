import Vue from 'vue';
import VueI18n from 'vue-i18n'
import enLocale from './en.js';
import usLocal from './zh.js';
import el_zh from 'element-ui/lib/locale/lang/zh-CN';
import el_en from 'element-ui/lib/locale/lang/en';
//注意重要说明：====vue-i18n一定要使用v8.24.4 的版本======
//引用方式一：
//安装命令：npm install vue-i18n@8.24.4 --save-dev   然后在本文件中使用 import VueI18n from 'vue-i18n' 来引入
//引用方式二：
//在static中已单独将i18n放在单独目录中，在public/index.html中使用<script src="<%=BASE_URL%>static/vue-i18n/distt/vue-i18n.js"></script>来引入


Vue.use(VueI18n);
//合并ElementUI的语言包
const messages = {
  'en-US': {
    ...enLocale,
    ...el_en
  },
  'zh-CN': {
    ...usLocal,
    ...el_zh
  }
};
const i18n = new VueI18n({
  locale: localStorage.getItem('f2bpm-language') || 'zh-CN',
  messages,
  //去除国际化警告
  silentTranslationWarn:true
});
export default i18n;