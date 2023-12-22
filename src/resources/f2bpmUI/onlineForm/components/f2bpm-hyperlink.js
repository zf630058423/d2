import Vue from 'vue';
// 注册组件
var f2bpmHyperlink = Vue.component('f2bpm-hyperlink', {
  props: ['field', 'fieldvalue'],
  data: function () {
    return {
      isView: false,
      isShow: true,
      isReadOnly: false,
      clearable: true,
      inputCtrlOption: null,
      value: ''
    };
  },
  watch: {
    value(val, oleV) {
      var that = this;
      if (val != undefined && oleV != undefined && f2grid_global_mainVueLoadComplated) {
        this.$emit('updatevalue', that.field, val);
      }
    },
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
    } else if (that.field._isReadOnly == true) {
      that.isReadOnly = true;
    }
    that.initailFieldOption();
    that.value = that.fieldvalue;
    if (that.field.inputCtrlOption) {
      var json = typeof that.field.inputCtrlOption === 'object' ? that.field.inputCtrlOption : eval('(' + that.field.inputCtrlOption + ')');
      that.inp;
      that.inputCtrlOption = json;
    }
  }, mounted() {
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
          var item = kvData.find(a => a.key == 'clearable');
          if (item) {
            that.clearable = item.value;
          }
        }
      }
    },
    onBlur() {
      var that = this;
      var fieldDef = that.field;
      var fieldValue = that.value;
      var funcName = fieldDef.vModel.replace(/\./g, '_');
      if (Object.toIsExitsFunction(funcName)) {
        window[funcName](fieldValue, fieldDef);
      }
    },
    onlineForm_onopenHyperlink(thisObj, field) {
      var that = this;
      if (that.inputCtrlOption) {
        var value = that.value;
        var optionJson = that.inputCtrlOption;
        var hyperlinkUrl = optionJson.hyperlinkUrl;
        var linktype = optionJson.linktype;
        var opentype = optionJson.opentype || 'dialog';
        if (linktype == 'wfsheet') {
          // 换回wiid
          var res = Object.toAjaxJson('/rest/api/processEnactmentApi/', 'getProcessInstBySheetId', { sheetId: value });
          if (res.success) {
            var wiid = res.data.workflowInstanceId;
            hyperlinkUrl = __webpath + '/workflow/workflowform/index/?formAction=3&wiid=' + wiid;
          } else {
            FUI.Window.showMsg2(that, res.msg);
            return false;
          }
        } else if (linktype == 'inside' && hyperlinkUrl != '' && hyperlinkUrl.indexOf('http://' == -1)) {
          // 内部链接
          if (hyperlinkUrl.indexOf('?') > -1) {
            hyperlinkUrl = hyperlinkUrl + '&passval=' + value;
          } else {
            hyperlinkUrl = hyperlinkUrl + '?passval=' + value;
          }
          if (!Object.toStartWith(hyperlinkUrl, __webpath)) {
            hyperlinkUrl = __webpath + hyperlinkUrl;
          }
        } else {
          if (hyperlinkUrl.indexOf('?') > -1) {
            hyperlinkUrl = hyperlinkUrl + '&passval=' + value;
          } else {
            hyperlinkUrl = hyperlinkUrl + '?passval=' + value;
          }
        }
        if (opentype == 'openwin') {
          FUI.Window.open(hyperlinkUrl, '_blank');
        } else if (opentype == 'dialog') {
          // 参数位置：url, title, formAction, parentGridId, width, height, options, mainTable, keyIdValue, isFitWindow, callback, parms,buttons
          var buttons = { sure: { text: '关闭窗口' } };
          FUI.Window.openDialog(hyperlinkUrl, '查看详情', 'View', null, null, null, { isShowSure: false }, null, value, true, null);
        }
      }
    }
  },
  template: '<div><el-input  :disabled="isReadOnly"   @blur.native.capture="onBlur()" size="small" v-show="isShow"  v-model="value" :name="field.vModel" :clearable="clearable"  :style="field.style" :placeholder="field.fieldRemark"  class="input-with-select"  > <el-button id="selectId" v-if="!isReadOnly" slot="append"   @click="onlineForm_onopenHyperlink" type="primary"  title="点击查看" icon="el-icon-search"></el-button></el-input> </div>'
});
