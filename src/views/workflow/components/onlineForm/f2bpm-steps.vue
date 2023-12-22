<template>
  <div>
    <el-steps v-show="isShow" :space="space" :direction="direction" :active="value" finish-status="success" align-center>
      <el-step v-for="(item,  index) in data" :key="index" :title="item.text" :description="item.value"></el-step>
    </el-steps>
    <span v-if="isDesign" v-html="field.fieldTitle">
    </span>
  </div>
</template>
<script>
  export default {
    name: 'f2bpm-steps',
    components: {},
    props: ['field', 'fieldvalue', 'rowindex', 'colindex'],
    data: function () {
      return {
        isDesign: false,
        space:"",
        direction: 'horizontal',
        isView: false,
        isShow: true,
        isReadOnly: false,
        textName: 'text',
        valueName: 'value',
        isMultiple: false,
        isClearable: false,
        value: 0,
        type: '',
        data: [],
        configTypeArray: [{
          dataField: 'data',
          configType: '',
          flag: '',
          isEnable: '',
          isReadOnly: ''
        }
        ],
      };
    },
    watch: {
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
        },
        immediate: false
      }
    },
    created: function () {
      var that = this;
      if (WFContext.isDesign === true) {
        that.isDesign = true;
      }
      that.initailFieldOption();
      if (that.fieldvalue) {
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
    },
    methods: {
      initailFieldOption() {
        var that = this;
        if (that.field.fieldOptions) {
          var fieldOptions = typeof that.field.fieldOptions === 'string' ? eval('(' + that.field.fieldOptions + ')') : that.field.fieldOptions;
          var general = fieldOptions.find(a => a.opttype == 'general');
          if (general) {
            var kvData = general.params.kvData;
            var item = kvData.find(a => a.key == 'steps_direction');
            if (item) {
              that.direction = item.value;
            }
            item = kvData.find(a => a.key == 'steps_space');
            if (item) {
              that.space = item.value;
            }
            ;
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
        if (formFieldParams) {
          arrs = eval('(' + formFieldParams + ')');
        }
        var varParams = [];
        $.each(arrs, function (i, kvItem) {
          let key=kvItem.key;
          let fieldName=kvItem.value;
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
