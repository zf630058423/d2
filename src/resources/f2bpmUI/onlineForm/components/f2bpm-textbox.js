import Vue from 'vue';
var f2bpmTextbox = Vue.component('f2bpm-textbox', {
  props: ['field', 'fieldvalue'],
  data: function () {
    return {
      componentKey: "502",
      // 校验的输入类型
      fieldDataType: '',
      isView: false,
      isShow: true,
      isReadOnly: false,
      value: ""
    };
  },
  watch: {
    value: {
      handler(val, oleV) {
        var that = this;
        if (val != undefined && oleV != undefined && f2grid_global_mainVueLoadComplated) {
          this.$emit('updatevalue', that.field, val);
        }
      },
      // 当值第一次绑定的时候，不会执行监听函数,第一次时值为undefined
      immediate: false
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
    that.value = that.fieldvalue;
    that.fieldDataType = that.field.fieldDataType;
    var formAction = WFContext.WorkflowformAction;
    that.isView = formAction > 2;
    if (that.isView) {
      that.isReadOnly = true;
    }
    else if (that.field._isReadOnly == true) {
      that.isReadOnly = true;
    }
  }, mounted() {
    var that = this;
    //FUI.F2Grid.excuteFieldWritePowerByVueFormItem(that)
    // 公式结果字段不可编辑
    if (that.field.countRule && that.field.countRule.rowmath != '') {
      that.isReadOnly = true;
    }
  },
  methods: {
    validate() {
      var that = this;
      var fieldDef = that.field;
      var fieldValue = that.value;
      if (!Object.toIsEmpty(fieldValue)) {
        var isPass = FUI.validateSingleField(fieldDef, fieldValue, null, true);
        if (isPass != false) {
          var funcName = fieldDef.vModel.replace(/\./g, '_');
          if (Object.toIsExitsFunction(funcName)) {
            window[funcName](fieldValue, fieldDef);
          }
        }
      }
    }

  },
  template: '<div v-show="isShow">' +
    '            <el-input :key="componentKey"  @blur.native.capture="validate()" v-model="value"   size="small"  :name="field.vModel" :disabled="isReadOnly" v-if="field.ctrType==\'text\'||field.ctrType==\'extend_textbox\'" :show-password="field.entertextType==\'password\'" :clearable="true" :placeholder="field.fieldRemark"></el-input>' +
    '            <el-input :key="componentKey"  @blur.native.capture="validate()"  v-model="value"  size="small"   :name="field.vModel" :disabled="isReadOnly" v-else-if="field.ctrType==\'textarea\'" type="textarea" :rows="2" :placeholder="field.fieldRemark" ></el-input>' +

    '</div> '
});
