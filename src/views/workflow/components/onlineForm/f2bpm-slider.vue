<template>
  <div :fieldtext="value" :name="field.vModel" class="ml3">
    <el-slider class="online-form-slider" size="small" 
    :disabled="isReadOnly" v-model="value" :min="def.min" 
    :max="def.max" :show-tooltip="true"
     @change="onItemChange" :step="def.step" :show-stops="def.showStops" :show-input="def.showInput" :show-input-controls="def.showInputControls" input-size="mini" :range="def.range" :vertical="def.vertical" :height="def.height+'px'">
    </el-slider>
  </div>
</template>

<script>
  export default {
    name: "f2bpm-rate",
    components: {},
    props: ['field', 'fieldvalue', 'rowindex', 'colindex'],
    //rowindex:子表时才有值行索引，colindex子表时才有值列索引
    data: function () {
      return {
        tempValue: null,
        iconClasses: ['icon-rate-face-1', 'icon-rate-face-2', 'icon-rate-face-3'],
        def: {
          min: 0,
          //最大分值
          max: 5,
          //步长
          step: 1,
          //是否显示 tooltip
          showTooltip: true,
          //是否显示间断点
          showStops: false,
          //是否显示输入框，仅在非范围选择时有效
          showInput: false,
          //在显示输入框的情况下，是否显示输入框的控制按钮
          showInputControls: false,
          //是否为范围选择
          range: false,
          //是否竖向模式
          vertical: false,
          //高度，竖向模式时必填
          height: 0,
        }
        //是否为设计状态
        , isDesign: false,
        isView: false,
        isShow: true,
        isReadOnly: false,
        clearable: true,
        inputCtrlOption: null,
        qrCodeUrl: '',
        wiid: "",
        myid: "",
        value: 0
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
    
      if (that.field.inputCtrlOption) {
        var json = typeof that.field.inputCtrlOption === 'object' ? that.field.inputCtrlOption : eval('(' + that.field.inputCtrlOption + ')');
        that.inputCtrlOption = json;
        var optionJson = that.inputCtrlOption;
        that.def = optionJson;

      }
      if (that.isReadOnly) {
        that.def.showInput=false;
        that.def.showInputControls=false;
      }
      let v = 0;
      if (that.fieldvalue != undefined && that.fieldvalue != "" && typeof that.fieldvalue == "string"&&that.def.range==false) {
        v = parseFloat(that.fieldvalue);
      }
      else if (that.fieldvalue != undefined && that.fieldvalue != "" && typeof that.fieldvalue == "string"&&that.def.range==true) {
        v = eval("("+ that.fieldvalue+")");
      }
      that.value = v;
    }
    , mounted() {
      var that = this;
      if (WFContext.isDesign == true || that.isShow == false) {
        that.isDesign = true;
        return false;
      }
    },
    methods: {
      initailFieldOption() {
        var that = this;
      },
      onItemChange(value) {
        var that = this;
        console.info(value);
        if (value != undefined) {
          this.$emit('updatevalue', that.field, value);
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
            window[funcName](value, that.field, parms);
          }
          //================================================
        }
      }
    }
  }
</script>