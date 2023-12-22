<template>
  <div>

    <el-tooltip 
      placement="bottom" 
      :disabled="isShowTip" 
      v-if="isShowFormatterValue==false"
      popper-class="atooltip" 
      effect="light">
        <div slot="content" :style="{'max-width':`${inputMaxWidth}px`}" v-html="value"></div>
        <el-input v-show="isShow" v-if="isShowFormatterValue==false" size="small" v-model="value" :name="field.vModel" @blur.native.capture="onBlur()" :clearable="clearable" :disabled="isDisabled" :placeholder="field.fieldRemark" class="input-with-select" @mouseover.native="inputOnMouseOver($event)">
      <el-button id="selectId" v-if="!isReadOnly" slot="append" @click="openDialogClick()" type="primary" icon="el-icon-search"></el-button>
    </el-input>
    </el-tooltip>

    <!-- <el-input v-show="isShow" v-if="isShowFormatterValue==false" size="small" v-model="value" :name="field.vModel" @blur.native.capture="onBlur()" :clearable="clearable" :disabled="isDisabled" :placeholder="field.fieldRemark" class="input-with-select">
      <el-button id="selectId" v-if="!isReadOnly" slot="append" @click="openDialogClick()" type="primary" icon="el-icon-search"></el-button>
    </el-input> -->

    <el-input v-if="isShow&&isShowFormatterValue&&showFormat!=''" @focus.native.capture="changeToNormalInput" size="small" v-model="getFormatterValue" :name="field.vModel" :clearable="clearable" :disabled="isDisabled" :placeholder="field.fieldRemark" class="input-with-select">
      <el-button id="selectId" v-if="!isReadOnly" slot="append" @click="openDialogClick()" type="primary" icon="el-icon-search"></el-button>
    </el-input>
  </div>

</template>
<script>
  export default {
    name: "f2bpm-selector",
    props: ['field', 'fieldvalue', 'rowindex', 'colindex'],
    data: function () {
      return {
        //当前是否为格式化显示
        isShowFormatterValue: false,
        //显示格式:千分位qianfenwei,大写金额daxiejine,百分比percent
        showFormat: "",

        isView: false,
        isShow: true,
        isReadOnly: false,

        inputCtrlOption: null,
        customJSON: null,
        isDisabled: false,

        selectId: '',
        data: {},
        value: '',
        clearable: true,
        isShowTip: false,
        inputMaxWidth: 370
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
    computed: {
      getFormatterValue() {
        var that = this;
        var showFormat = that.showFormat;
        if (showFormat == 'qianfenwei') {
          return Object.toQianfenWeiStr(that.value);
        } else if (showFormat == 'daxiejine') {
          return Object.toChinaNum(that.value);
        } else if (showFormat == 'percent') {
          if (that.value == undefined || that.value == 0 || that.value == "") {
            return "";
          }
          let num = (parseFloat(that.value) * 1000 / 10);
          if ((num + "").indexOf(".") > -1) {
            //保留两位小数
            num = Object.toDecimal(num, 2);
          }
          return num + '%';
        }
      }
    }
    , created: function () {
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
      if (that.field.inputCtrlOption) {
        var json = typeof that.field.inputCtrlOption === 'object' ? that.field.inputCtrlOption : eval('(' + that.field.inputCtrlOption + ')');
        that.inputCtrlOption = json;
      }
      that.init();
      console.info(that.showFormat);
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
            var item = kvData.find(a => a.key == 'showFormat');
            if (item) {
              that.showFormat = item.value || "";
            }
            item = kvData.find(a => a.key == 'clearable');
            if (item) {
              that.clearable = item.value;
            }
          }
        }
      },
      changeToNormalInput(e) {
        var that = this;
        if (that.isReadOnly) {
          return false;
        }
        let dom = e.target;
        let parentDom = $(dom).parent().parent();
        that.isShowFormatterValue = false;
        setTimeout(function () {
          $("input[type='text']", parentDom).focus();
        }, 300);

      }
      , init() {
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

      //获取高级参数：[{'key':'A','value':'1','orderNum':1}]
      getAdParms(inputCtrlOptionJson) {
        var that = this;
        var parmsArr = inputCtrlOptionJson.data.parms || [];
        if (parmsArr && typeof parmsArr === 'string') {
          parmsArr = eval('(' + parmsArr + ')');
        }
        return parmsArr;
      }
      //获取全部配置参数{a:b}
      , getObjParms(inputCtrlOptionJson) {
        var that = this;
        var parms = {};
        var adParms = that.getAdParms(inputCtrlOptionJson);
        if (adParms && adParms.length > 0) {
          $.each(adParms, function (i, item) {
            parms[item.key] = item.value;
          });
        }
        return parms;
      }
      //获取全部配置参数返回格式：[{key:"",value:""}]
      , getArrParms(inputCtrlOptionJson) {
        var that = this;
        var allArr = [];
        var adParms = that.getAdParms(inputCtrlOptionJson);
        if (adParms && adParms.length > 0) {
          $.each(adParms, function (i, item) {
            allArr.push(item);
          });
        }
        console.info(allArr);
        return allArr;
      }
      , openDialogClick() {
        var that = this;
        var isPass = true;
        var fieldDef = that.field;
        var funcName_before = fieldDef.vModel.replace(/\./g, '_') + "_before";
        if (Object.toIsExitsFunction(funcName_before)) {
          let parms = {};
          let isSubField = that.rowindex != undefined && that.rowindex != null;
          if (isSubField) {
            let row = that.$parent.data;
            parms.row = row;
            parms.rowIndex = that.rowindex;
            parms.colIndex = that.colindex;
          }
          isPass = window[funcName_before](that.value, fieldDef, parms);
        }
        if (isPass == false) {
          return false;
        }

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
          var varParams = that.getArrParms(that.inputCtrlOption);
          if (varParams.length > 0) {
            customJSON.varParams = varParams;
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
        var funcName_after = that.field.vModel.replace(/\./g, '_') + "_after";
        if (Object.toIsExitsFunction(funcName_after)) {
          window[funcName_after](that, vueDataObj);
        }
      },
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
        if (that.showFormat != "") {
          that.isShowFormatterValue = true;
        }
      },
      inputOnMouseOver(event){
        const target = event.target;
        this.inputMaxWidth = target.offsetWidth ? target.offsetWidth : 371;
        this.isShowTip = target.offsetWidth >= target.scrollWidth ? true : false;
      }
    }
  }
</script>