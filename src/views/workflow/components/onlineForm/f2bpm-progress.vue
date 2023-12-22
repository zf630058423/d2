<template>
  <div :fieldtext="value" :name="field.vModel">
    <el-progress class="online-form-progress" v-if="isDesign==false" :type="def.type" :stroke-width="def.strokeWidth" :width="def.width" :show-text="def.showText" :color="def.color" :stroke-linecap="def.strokeLinecap" :percentage="value"></el-progress>
    <el-progress class="online-form-progress" v-else :type="def.type" :stroke-width="def.strokeWidth" :width="def.width" :show-text="def.showText" :color="def.color" :stroke-linecap="def.strokeLinecap" :percentage="tempValue"></el-progress>
    <div v-if="def.isEditNumber">
      <el-button-group  v-if="!isReadOnly&&isDesign==false">
        <el-input-number v-model="value" size="mini" :min="0" :max="100" />
      </el-button-group>
      <el-button-group v-if="isDesign==true">
        <el-input-number v-model="tempValue" size="mini" :min="0" :max="100" />
      </el-button-group>
    </div>
  </div>
</template>

<script>
  export default {
    name: "f2bpm-progress",
    components: {},
    props: ['field', 'fieldvalue', 'rowindex', 'colindex'],
    //rowindex:子表时才有值行索引，colindex子表时才有值列索引
    data: function () {
      return {
        tempValue: 45,
        def: {
          //进度条类型:	line/circle/dashboard
          type: "line",
          //进度条背景色（会覆盖 status 状态颜色）
          color: "",
          //进度条的宽度，单位 px
          strokeWidth: 12,
          //环形进度条画布宽度（只在 type 为 circle 或 dashboard 时可用）
          width: 126,
          //是否显示进度条文字内容
          showText: true,
          //circle/dashboard 类型路径两端的形状 butt/round/square
          strokeLinecap: "round",
          //是否编辑数字
          isEditNumber:true
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
        //0到100的数字
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
      if (that.fieldvalue != undefined&&that.fieldvalue!=""&& typeof that.fieldvalue == "string") {
        v = parseFloat(that.fieldvalue);
      }
      that.value = v;
      console.info(that.value);
      if (that.field.inputCtrlOption) {
        var json = typeof that.field.inputCtrlOption === 'object' ? that.field.inputCtrlOption : eval('(' + that.field.inputCtrlOption + ')');
        that.inputCtrlOption = json;
        var optionJson = that.inputCtrlOption;
        that.def = optionJson;
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
      increase() {
        if (WFContext.isDesign == true) {
          this.temppercentage += 10;
          if (this.temppercentage > 100) {
            this.temppercentage = 100;
          }
        } else {
          this.value += 10;
          if (this.value > 100) {
            this.value = 100;
          }
        }

      },
      decrease() {
        if (WFContext.isDesign == true) {
          this.temppercentage -= 10;
          if (this.temppercentage < 0) {
            this.temppercentage = 0;
          }
        } else {
          this.value -= 10;
          if (this.value < 0) {
            this.value = 0;
          }
        }

      }
      , initailFieldOption() {
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