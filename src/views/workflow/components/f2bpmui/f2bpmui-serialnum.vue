<template>
  <el-input v-model="value" @blur.native.capture="onBlur()" v-show="isShow" size="small" :disabled="isReadOnly" :name="field.vModel" clearable :counterCode="counterCode" placeholder="流水号"></el-input>
</template>

<script>
  export default {
    name: 'f2bpmuiSerialnum',
    components: {},
    props: ['field', 'fieldvalue','readOnly'],
    data: function () {
      return {
        isView: false,
        isShow: true,
        isReadOnly: false,
        value: '',
        counterCode: ''
      }
    },
    watch: {
      value(val, oleV) {
        var that = this
        if (val != undefined && oleV != undefined) {
          this.$emit('updatevalue', that.field.fieldName, val)
        }
      }
    },
    created: function () {
      var that = this;
      if (that.readOnly != undefined&&that.readOnly!=null) {
        that.isReadOnly = that.readOnly;
        that.isView= that.readOnly;
      }
      that.value = that.fieldvalue;
      var formAction = WFContext.WorkflowformAction;
      var currentActivityType = WFContext.CurrentActivityType;
      var workflowInstinceState = WFContext.WorkflowInstinceState;
      // 只有拟搞或提单时才取序列号
      if (!that.value && !that.isView && that.field.inputCtrlOption) {
        var json = typeof that.field.inputCtrlOption === 'object' ? that.field.inputCtrlOption : eval('(' + that.field.inputCtrlOption + ')');
        if (json.counterCode) {
          that.counterCode = json.counterCode;
          if ((!that.fieldvalue) && that.counterCode) {
            var result = Object.toAjaxJson(FUI.Handlers.FuiFrameworkHandler, 'getSerialNumber', { 'counterCode': that.counterCode });
            if (result.success == true) {
              that.value = result.msg;
              that.$emit('updatevalue', that.field.fieldName, that.value);
            }
          }
        }
      }
    },
    mounted() {
      var that = this;
    },
    methods: {
      onBlur() {
        var that = this;
        var fieldDef = that.field;
        var fieldValue = that.value;
      }
    }
  }
</script>