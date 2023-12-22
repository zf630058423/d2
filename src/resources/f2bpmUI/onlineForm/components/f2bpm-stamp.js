import Vue from 'vue';
// 注册组件
var f2bpmStamp = Vue.component('f2bpm-stamp', {
  props: ['field', 'fieldvalue'],
  data: function () {
    return {
      isView: false,
      isReadOnly: false,
      isShow: false,
      value: '',
      src: '',
      inputCtrlOption: null,
      prefix: '',
      width: ''
    };
  },
  watch: {
    value(val, oleV) {
      var that = this;
      if (val != undefined && oleV != undefined && f2grid_global_mainVueLoadComplated) {
        this.$emit('updatevalue', that.field, val);
      }
    }
  },
  created: function () {
    var that = this;
    that.initailFieldOption();
    that.value = that.fieldvalue;
    var formAction = WFContext.WorkflowformAction;
    that.isView = formAction > 2;
    if (that.isView) {
      that.isReadOnly = true;
    } else if (that.field._isReadOnly == true) {
      that.isReadOnly = true;
    }
    var prefix = '';
    if (that.field.inputCtrlOption) {
      var json = typeof that.field.inputCtrlOption === 'object' ? that.field.inputCtrlOption : eval('(' + that.field.inputCtrlOption + ')');
      that.inputCtrlOption = json;
      prefix = that.inputCtrlOption.showPathPrefix;
    }
    var width = that.field.width || 120;
    if (width == 0) {
      width = 120;
    }
    that.width = width + 'px';
    that.prefix = prefix;
    that.showSrc();
    if (that.value) {
      this.isShow = true;
    }
  },
  mounted() {
    var that = this;
    //FUI.F2Grid.excuteFieldWritePowerByVueFormItem(that);
  },
  methods: {
    initailFieldOption() {
      var that = this;
      if (that.field.fieldOptions) {
        var fieldOptions = typeof that.field.fieldOptions === 'string' ? eval('(' + that.field.fieldOptions + ')') : that.field.fieldOptions;
        var general = fieldOptions.find(a => a.opttype == 'general');
        if (general) {
          var kvData = general.params.kvData;
        }
      }
    },
    openDialogClick() {
      var that = this;
      if (WFContext.isDesign == true) {
        return false;
      }
      var wiid = WFContext.WorkflowInstanceId;
      var currUserId = WFContext.UserId;
      var url = __webpath + '/workflow/selector/selectPersonalSeal/?sealType=&currUserId=' + currUserId;
      FUI.dialog(url, '选择图章', {}, 800, 450, function (data, index, layer) {
        if (data && data.length > 0) {
          that.value = data[0].sealPhoto;
          that.showSrc();
          that.isShow = true;
        }
        layer.close(index);
        return false;
      }, false, null, { sure: { text: '确定' } });
    },
    showSrc() {
      var that = this;
      var src = '';
      var pathType = 'seal';
      if (that.value) {
        // 数组
        var item = eval('(' + that.value + ')');
        item = item[0];
        src = __serverpath + FUI.Handlers.Common + 'getShowImage/?pathType=' + pathType + '&groupName=' + item.groupName + '&filePath=' + item.filePathName;
      }
      that.src = src;
    }
  },
  template: '<div :fieldrender="field.vModel"><div v-show="isShow"> <img  field="field.vModel"  handsign-field="field.vModel" :src="src" :width="width"/></div> <el-button :field="field.vModel"  size="mini"  v-if="!isReadOnly"  type="primary" title="选择" @click="openDialogClick"><i class="fa fa-search">选择图章</i></el-button></div>'
});
