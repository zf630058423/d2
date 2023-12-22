<template>
  <div :fieldtext="value" :name="field.vModel">
    <el-rate class="online-form-rate" v-if="isDesign==false" size="small" :disabled="isReadOnly" v-model="value" :max="rateData.max" @change="onItemChange" :llow-half="rateData.allowHalf" :allow-half="rateData.allowHalf" :low-threshold="rateData.lowThreshold" :high-threshold="rateData.highThreshold" :show-text="rateData.showText" :show-score="rateData.showScore" :texts="rateData.texts" :text-color="rateData.textColor" score-template="{value}">
    </el-rate>
    <span v-else>
      <el-rate class="online-form-rate" v-model="tempValue" size="small" :max="rateData.max" :llow-half="rateData.allowHalf" :allow-half="rateData.allowHalf" :low-threshold="rateData.lowThreshold" :high-threshold="rateData.highThreshold" :show-text="rateData.showText" :show-score="rateData.showScore" :texts="rateData.texts"  :text-color="rateData.textColor" score-template="{value}">
      </el-rate>
    </span>
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
        rateData: {
          //最大分值
          max: 5,
          //是否允许半选
          allowHalf: false,
          //低分和中等分数的界限值，值本身被划分在低分中
          lowThreshold: 2,
          //高分和中等分数的界限值，值本身被划分在高分中
          highThreshold: 4,
          colors: "",
          //未选中 icon 的颜色
          voidColor: "#C6D1DE",
          //只读时未选中 icon 的颜色
          disabledVoidColor: "#EFF2F7",
          //是否显示辅助文字，若为真，则会从 texts 数组中选取当前分数对应的文字内容
          showText: false,
          //是否显示当前分数，show-score 和 show-text 不能同时为真
          showScore: false,
          //辅助文字的颜色
          textColor: "	#1F2D3D",
          //辅助文字
          texts: ['极差', '失望', '一般', '满意', '惊喜']
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
      let v = 0;
      if (that.fieldvalue != undefined &&that.fieldvalue!=""&& typeof that.fieldvalue == "string") {
        v = parseFloat(that.fieldvalue);
      }
      that.value = v;
      if (that.field.inputCtrlOption) {
        var json = typeof that.field.inputCtrlOption === 'object' ? that.field.inputCtrlOption : eval('(' + that.field.inputCtrlOption + ')');
        that.inputCtrlOption = json;
        var optionJson = that.inputCtrlOption;
        if (optionJson.texts) {
          optionJson.texts =   optionJson.texts.split(",");
        }else{
          optionJson.texts=that.rateData.texts;
        }
        that.rateData = optionJson;
      }
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
        // if (that.field.fieldOptions) {
        //   var fieldOptions = typeof that.field.fieldOptions === 'string' ? eval('(' + that.field.fieldOptions + ')') : that.field.fieldOptions;
        //   var general = fieldOptions.find(a => a.opttype == 'general');
        //   if (general) {
        //     var kvData = general.params.kvData;
        //   }
        // }
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