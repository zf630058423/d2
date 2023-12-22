import Vue from 'vue';
var f2bpmIframe = Vue.component('f2bpm-iframe', {
  props: ['field', 'fieldvalue'],
  data: function () {
    return {
      isDesign: false,
      src: '',
      isView: false,
      isShow: true,
      isReadOnly: false,
      clearable: true,
      inputCtrlOption: null,
      value: ''
    };
  },
  watch: {
    fieldvalue: {
      handler(newV, oleV) {
        var that = this;
        if (newV != undefined && oleV != undefined && f2grid_global_mainVueLoadComplated) {
          that.value = newV;
        }
      },
      immediate: false
    }
  },
  created: function () {
    var that = this;
    var formAction = WFContext.WorkflowformAction;
    that.isView = formAction > 2;
    if (that.isView) {
      that.isReadOnly = true;
    }
    that.value = that.fieldvalue;
    if (WFContext.isDesign == true) {
      that.isDesign = true;
    }
    if (WFContext.isDesign == true || that.isShow == false) {
      return false;
    }
    that.src = that.value;
  },
  mounted() {
    var that = this;
  },
  methods: {
    initailFieldOption() {
      var that = this;
    }
  },
  template: '<div><span v-if="isDesign">iframe控件-当前为设计模式</span><iframe :src="src" :id="field.id" class="extend-iframe" :style="field.style" frameborder="0" :iframesrc="field.src" :iframeheight="field.height" scrolling="yes" width="100%" :height="field.height"></iframe></div>'
});
