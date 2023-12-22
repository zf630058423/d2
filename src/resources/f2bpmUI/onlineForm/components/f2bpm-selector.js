import Vue from 'vue';
// 注册组件
var f2bpmSelector = Vue.component('f2bpm-selector', {
  props: ['field', 'fieldvalue'], data: function () {
    return {
      isView: false,
      isShow: true,
      isReadOnly: false,

      inputCtrlOption: null,
      customJSON: null,
      isDisabled: false,

      selectId: '',
      data: {},
      value: '',
      clearable: true
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
    that.initailFieldOption();
    that.value = that.fieldvalue;
    that.isView = formAction > 2;
    if (that.isView) {
      that.isReadOnly = true;
    } else if (that.field._isReadOnly == true) {
      that.isReadOnly = true;
    }
    if (that.field.inputCtrlOption) {
      var json = typeof that.field.inputCtrlOption === 'object' ? that.field.inputCtrlOption : eval('(' + that.field.inputCtrlOption + ')');
      that.inputCtrlOption = json;
    }
    that.init();
  },
  mounted() {
    var that = this;
    //FUI.F2Grid.excuteFieldWritePowerByVueFormItem(that);
    if (that.isReadOnly == true) {
      that.isDisabled = true;
    }
  },
  methods: {
    initailFieldOption() {
      var that = this;
      if (that.field.fieldOptions && that.field.fieldOptions != '') {
        var fieldOptionsObj = typeof that.field.fieldOptions === 'string' ? eval(that.field.fieldOptions) : that.field.fieldOptions;
        var general = fieldOptionsObj.find(a => a.opttype == 'general');
        if (general) {
          var kvData = general.params.kvData;
          var item = kvData.find(a => a.key == 'clearable');
          if (item) {
            that.clearable = item.value;
          }
        }
      }
    },
    init() {
      var that = this;
      var name = that.field.vModel;
      var field = that.field.vModel;
      var defaultvalue = that.field.fieldDefaultValue || '';
      if (that.inputCtrlOption) {
        var customJSON = that.inputCtrlOption.data;
        that.customJSON = customJSON;
        var isEnableEdit = customJSON.isEnableEdit;
        that.isMulti = customJSON.isMulti;
        if (isEnableEdit == undefined || isEnableEdit == null) {
          isEnableEdit = true;
        }
        var selectId = Object.toGuid();
        that.selectId = selectId;
        var formAction = WFContext.WorkflowformAction;
        if (formAction > 2) {
          that.isReadOnly = true;
        }
        if (Object.toQueryString('formAction') && isNaN(Object.toQueryString('formAction')) && Object.toQueryString('formAction') != 'Add' && Object.toQueryString('formAction') != 'Edit') {
          that.isReadOnly = true;
          that.isDisabled = true;
        }
        if (WFContext.WorkflowformAction == 0 && defaultvalue) {
          var myValue = getSysDefaultValue(defaultvalue);
          that.value = myValue;
        }
        if (isEnableEdit == false || isEnableEdit == 'false') {
          // 只能选，不能对输入框进行输入
          that.isDisabled = true;
        }
        if (that.isReadOnly) {
          that.isDisabled = true;
        }
      }
    },
    openDialogClick() {
      var that = this;
      if (that.inputCtrlOption) {
        var customJSON = that.inputCtrlOption.data;
        customJSON.selectId = that.selectId;
        var fieldName = that.field.vModel;
        customJSON.backBindIsdetail = fieldName.split('.').length >= 3;
        if (customJSON.isMulti == 'true') {
          customJSON.isMulti = true;
        }
        if (customJSON.isMulti == 'false') {
          customJSON.isMulti = false;
        }
        var selectorName = customJSON.selectorName;
        var selector = eval(selectorName);
        selector(that, customJSON);
      }
      return false;
    },
    onSelectedSuccess(vueDataObj) {
      var that = this;
      $.each(vueDataObj, function (tofieldName, pval) {
        if (tofieldName == that.field.vModel) {
          that.value = pval;
          that.onBlur();
        } else {
          that.$emit('updatevalue', tofieldName, pval);
        }
      });
    },
    onBlur() {
      var that = this;
      var fieldDef = that.field;
      var fieldValue = that.value;
      var funcName = fieldDef.vModel.replace(/\./g, '_');
      if (Object.toIsExitsFunction(funcName)) {
        window[funcName](fieldValue, fieldDef);
      }
    }
  },
  template: '<el-input v-show="isShow"   size="small" v-model="value" :name="field.vModel"  :clearable="clearable"   :disabled="isDisabled" :placeholder="field.fieldRemark"  class="input-with-select"  > <el-button id="selectId" v-if="!isReadOnly" slot="append"   @click="openDialogClick()" type="primary" icon="el-icon-search"></el-button></el-input> '
});
