<template>
  <el-select
    autocomplete="off"
    id="onlineSelect"
    :key="componentKey"
    :disabled="isReadOnly"
    v-show="isShow"
    filterable
    size="small"
    @focus="onFocus"
    @change="onItemChange"
    v-model="value"
    :clearable="isClearable"
    :multiple="isMultiple"
    class="online-select"
    :fieldtext="fieldtext"
    :name="field.vModel">
    <el-option v-for="item in data" :label="item[textName]" :value="item[valueName]" :key="item[valueName]"></el-option>
  </el-select>
</template>

<script>

  /**
   * 表单下拉框
   */
  export default {
    name: 'f2bpm-select',
    components: {},
    props: ['field', 'fieldvalue', 'rowindex', 'colindex'],
    data: function () {
      return {
        componentKey:'503',
        isView: false,
        isShow: true,
        isReadOnly: false,
        textName: 'text',
        valueName: 'value',
        isMultiple: false,
        isClearable: false,
        state: false, // 增加过滤禁选项目字段
        value: '',
        fieldtext: '',
        sqlkeyArray: [{
          dataField: 'data',
          sqlkey: '',
          parm: null,
          flag: null,
          change: null
        }],
        configTypeArray: [{
          dataField: 'data',
          configType: '',
          flag: '',
          isEnable:'',
          isValue: '',
          isReadOnly:''
        }
        ],
        type: '',
        data: [],
        showToolTip:false,
        inputMaxWidth: 371,
        optionValue:''
      };
    },
  watch: {
    isReadOnly: {
      handler(n, o) {
         this.field._isReadOnly = n;  //更新当前的isReadOnly
        },
        deep: true,
        immediate: false
      },
      field: {
        handler(n, o) {
          this.initail();
        },
        deep: true,
        immediate: false
      },
      fieldvalue: {
        handler(newV, oleV) {
          var that = this;
          if (newV != undefined && oleV != undefined && f2grid_global_mainVueLoadComplated) {
            that.value = newV;
          }
          that.configTypeArray[0].isValue = that.value;
        },
        immediate: false
      }
    },
    created: function () {
      var that = this;
      window[that.field.vModel + "_vm"] = that;
      that.initailFieldOption();

      if (that.isMultiple == true) {
        if (typeof that.fieldvalue === 'string' && that.fieldvalue != undefined && that.fieldvalue != null) {
          that.value = eval('(' + that.fieldvalue + ')');
        } else {
          that.value = that.fieldvalue;
        }
      } else {
        that.value = that.fieldvalue;
      }
      var formAction = WFContext.WorkflowformAction;
      that.isView = formAction > 2;
      if (that.isView) {
        that.isReadOnly = true;
      } else if (that.field._isReadOnly == true) {
        that.isReadOnly = true;
      }
      that.initail();

    }, mounted() {
      var that = this;
      //FUI.F2Grid.excuteFieldWritePowerByVueFormItem(that);
      if (that.value != null && that.value != undefined) {
        //触发控件联动
        that.triggerFieldLinkages(that.field, that.value);
      }
      that.loadfieldtext();
    },
    methods: {
      //判断选择的内容是否超过当前的选择框
      selectOnMouseEneter(){
        this.$nextTick(() => {
          let tLen = this.value ? this.data[this.value - 1].text.length : 0;   //输入的长度
          let elSelectWidth = this.$refs.elSelect.inputWidth;
          let cWidth = elSelectWidth && tLen ? Math.floor(elSelectWidth) / tLen : 0;
          this.showToolTip = cWidth >= elSelectWidth ? true : false;
          this.optionValue = (this.data && this.data.length && this.value > 0) > 0 ? this.data[this.value - 1].text : '';
        })
      },
      loadfieldtext() {
        var that = this;
        var data = that.data;
        $.each(data, function (_, row) {
          var t = row[that.textName];
          var v = row[that.valueName];
          if (v == that.value) {
            that.fieldtext = t;
            return false;
          }
        });
      }
      , initailFieldOption() {
        var that = this;
        if (that.field.fieldOptions) {
          var fieldOptions = typeof that.field.fieldOptions === 'string' ? eval('(' + that.field.fieldOptions + ')') : that.field.fieldOptions;
          var general = fieldOptions.find(a => a.opttype == 'general');
          var generalobj = {};
          if (general) {
            var kvData = general.params.kvData;
            $.each(kvData, function (index, item) {
              generalobj[item.key] = item.value;
            });
            that.textBindToFields = generalobj.textBindToFields || "";
          }
        }
      },
      onItemChange(value) {
        var that = this;
        if (value != undefined) {
          this.$emit('updatevalue', that.field, value);
          that.loadfieldtext();
          //Text标签填写到指定字段
          if (that.textBindToFields) {
            var fieldtext = that.fieldtext;
            var arr = that.textBindToFields.split(',');
            $.each(arr, function (i, tofieldName) {
              if (tofieldName) {
                that.$emit('updatevalue', tofieldName, fieldtext);
              }
            });
          }
          that.triggerFieldLinkages(that.field, value);
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
          // that.selectOnMouseEneter();
          //================================================
        }
      },
      //触发控件联动
      triggerFieldLinkages(field, value) {
        var that = this;
        if (WFContext.isDesign == true || that.isShow == false) {
          return false;
        }
        FUI.F2Grid.excuteTriggerFieldLinkages(field, value, that.isView);
      }
      , onFocus() {
        var that = this;
        if (that.field.inputCtrlOption) {
          var json = typeof that.field.inputCtrlOption === 'object' ? that.field.inputCtrlOption : eval('(' + that.field.inputCtrlOption + ')');
          //有动态参数时才需要在点击时触发重新获取下拉数据源
          var formFieldParams = json.data.formFieldParams || "";
          if (formFieldParams) {
            that.initail();
          }
        }
      }
      //获取全部配置参数{a:b}
      , getParms(inputCtrlOptionJson) {
        var that = this;
        var parms = {};
        var adParms = that.getAdParms(inputCtrlOptionJson);
        if (adParms && adParms.length > 0) {
          $.each(adParms, function (i, item) {
            parms[item.key] = item.value;
          });
        }
        var formFieldParms = that.getFormFieldParams(inputCtrlOptionJson);
        if (formFieldParms && formFieldParms.length > 0) {
          $.each(formFieldParms, function (i, item) {
            parms[item.key] = item.value;
          });
        }
        return parms;
      }
      //获取高级参数：[{'key':'A','value':'1','orderNum':1}]
      , getAdParms(inputCtrlOptionJson) {
        var that = this;
        var parms = {};
        var parmsArr = inputCtrlOptionJson.data.parms || [];
        if (parmsArr && typeof parmsArr === 'string') {
          parmsArr = eval('(' + parmsArr + ')');
        }
        return parmsArr;
      }
      //获取表单字段参数[{key:"",value:""}];
      , getFormFieldParams(inputCtrlOptionJson) {
        var that = this;
        //携带表单字段做为变量参数（需要在自定义对话框的过滤条件中配置对应的变量表达式，字段名为变量名）
        var formFieldParams = inputCtrlOptionJson.data.formFieldParams || "";
        var arrs = [];
        if (formFieldParams && formFieldParams.indexOf("{") > -1) {
          arrs = eval('(' + formFieldParams + ')');
        }
        var varParams = [];
        $.each(arrs, function (i, kvItem) {
          let key = kvItem.key;
          let fieldName = kvItem.value;
          var isSub = fieldName.split(".").length >= 3;
          var value = isSub == false ? myvm.data[fieldName] : that.$parent.data[fieldName];
          varParams.push({ "key": key, "value": value });
        });
        return varParams;
      }
      , initail() {
        var that = this;
        if (WFContext.isDesign == true || that.isShow == false) {
          return false;
        }
        if (that.field.inputCtrlOption) {
          var json = typeof that.field.inputCtrlOption === 'object' ? that.field.inputCtrlOption : eval('(' + that.field.inputCtrlOption + ')');
          if (json.type == 'custom') {
            that.type = json.type;
            that.data = json.data;
            that.textName = 'text';
          } else if (json.type == 'dic') {
            that.type = json.type;
            var configType = json.data;
            that.configTypeArray[0].configType = configType;
            that.configTypeArray[0].isEnable = that.isReadOnly === true ? '' : 1;
            that.configTypeArray[0].isValue = that.value;
            that.configTypeArray[0].isReadOnly = that.isReadOnly;
            FUI.Form.initailConfigTypeComboBox(that);
          } else if (json.type == 'sql') {
            that.type = json.type;
            var sql = json.data;
            var parms = that.getParms(json);
            parms.sql = sql;
            var data = Object.toAjaxJson('/workflow/fuiFramework/', 'getTextValueDataJsonBySql', parms);
            that.data = data;
          } else if (json.type == 'dataService') {
            var code = json.data.code;
            var isMulti = json.data.isMulti;
            var bindFields = json.data.data;
            var parms = that.getParms(json);
            var res = FUI.Sys.getServiceData(code, parms);
            var textValueData = [];
            var data = [];
            if (res.success != undefined && res.success == true) {
              data = res.data;
            } else if (res.success == undefined) {
              data = res;
            }
            if (data && typeof data === 'string') {
              data = eval('(' + data + ')');
            }
            textValueData = data;
            // 默认认为你是存丰text,value属性的，
            // 如果存在绑定字段的配置,那么就按配置的字段钻取
            if (bindFields && bindFields.length > 0) {
              textValueData = [];
              var textProName = bindFields.find(a => a.field == 'text').property;
              var valueProName = bindFields.find(a => a.field == 'value').property;
              $.each(data, function (_, row) {
                var t = row[textProName];
                var v = row[valueProName];
                textValueData.push({ 'text': t, 'value': v });
              });
            }
            that.data = textValueData;
          }
        }
      }
    }
  }
</script>
<style lang="scss">
@import url('~@/styles/global.scss');
</style>
