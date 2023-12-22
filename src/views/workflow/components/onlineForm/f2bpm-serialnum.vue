<template>
  <el-input v-model="value" @blur.native.capture="onBlur()" v-show="isShow" size="small" :disabled="isReadOnly" :name="field.vModel" clearable :counterCode="counterCode" placeholder="流水号"></el-input>
</template>

<script>
  export default {
    name: "f2bpm-serialnum",
    components: {},
    props: ['field', 'fieldvalue', 'rowindex', 'colindex'],
    data: function () {
      return {
        isView: false,
        isShow: true,
        isReadOnly: false,
        value: '',
        counterCode: ''
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
      that.value = that.fieldvalue;
      var formAction = WFContext.WorkflowformAction;
      var currentActivityType = WFContext.CurrentActivityType;
      var workflowInstinceState = WFContext.WorkflowInstinceState;
      that.isView = formAction > 2;
      if (that.isView) {
        that.isReadOnly = true;
      } else if (that.field._isReadOnly == true) {
        that.isReadOnly = true;
      }
      // 只有拟搞或提单时才取序列号
      if ((formAction == 0 && !that.value) || (!that.value && (workflowInstinceState == 0 || workflowInstinceState == 1) && formAction <= 2 && that.field.inputCtrlOption)) {
        var json = typeof that.field.inputCtrlOption === 'object' ? that.field.inputCtrlOption : eval('(' + that.field.inputCtrlOption + ')');
        if (json.counterCode) {
          that.counterCode = json.counterCode;
          if (WFContext.isDesign == true) {
            return false;
          }
          if ((!that.fieldvalue) && that.counterCode) {
            var result = Object.toAjaxJson(FUI.Handlers.FuiFrameworkHandler, 'getSerialNumber', { 'counterCode': that.counterCode });
            if (result.success == true) {
              that.value = result.msg;
              that.$emit('updatevalue', that.field, that.value);
            }
          }
        }
      }
    },
    mounted() {
      var that = this;
      //FUI.F2Grid.excuteFieldWritePowerByVueFormItem(that);
    },
    methods: {
      onBlur() {
        var that = this;
        var fieldDef = that.field;
        var fieldValue = that.value;
        //=================字段事件=========================
        let isSubField = that.rowindex != undefined && that.rowindex != null;
        var funcName = that.field.vModel.replace(/\./g, '_');
        if (Object.toIsExitsFunction(funcName)) {
          let parms = {};
          if (isSubField) {
            let row = that.$parent.data;
            parms.row = row;
            parms.rowIndex = that.rowindex;
            parms.colIndex = that.colindex;
          }
          window[funcName](fieldValue, that.field, parms);
        }
        //================================================
      }
    }
  }
</script>
