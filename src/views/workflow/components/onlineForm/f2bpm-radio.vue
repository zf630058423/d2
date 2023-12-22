<template>
  <el-radio-group :class="isReadOnly=== true?'filldStyle':''" v-show="isShow" :disabled="isReadOnly" @change="radioClick" v-model="value" :fieldalltext="fieldalltext" :fieldtext="fieldtext" :name="field.vModel">
    <el-radio v-for="(item, index) in data" :label="item[valueName]" :key="index" >{{item[textName]}}</el-radio>
  </el-radio-group>
</template>

<script>
  export default {
    name: "f2bpm-radio",
    components: {},
    props: ['field', 'fieldvalue', 'rowindex', 'colindex'],
    data: function () {
      return {
        formAction: 0,
        isView: false,
        // 是否为只读
        isReadOnly: false,
        isShow: true,
        textName: 'text',
        valueName: 'value',
        fieldtext: "",
        fieldalltext: "",
        value: '',
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
          isReadOnly: ''
        }
        ],
        type: '',
        data: []
      };
    },
    watch: {
      field: {
        handler(n, o) {
          this.initail();
        },
        deep: true,
        immediate: false
      }
      , fieldvalue: {
        handler(newV, oleV) {
          var that = this;
          if (newV == undefined || oleV == undefined || !f2grid_global_mainVueLoadComplated) {
            return false;
          }
          if (typeof newV == "object" && $.isArray(newV)) {
            newV = newV.toString();
          }
          //单选框输入值只接受的格式：数组，字符串数组，单个字符值；注意：只取第一个存在的选项
          if (typeof newV != "object" && newV != "" && newV != undefined) {
            var existNoVaue = false;
            newV = newV + "";
            var arr = Object.toStartWith(newV, "[") ? eval("(" + newV + ")") : newV.split(",");
            var newCheckedValue = "";
            $.each(arr, function (i, itemV) {
              itemV = itemV + "";
              let isExist = that.data.find(a => a[that.valueName] == itemV);
              if (isExist) {
                newCheckedValue = itemV;
                return false;
              } else if (itemV != "" && existNoVaue == false) {
                existNoVaue = true;
                console.info(that.field.vModel + "给单选控件赋一个不存在的选项值:" + itemV);
              }
            });
            that.value = newCheckedValue+"";
            if (existNoVaue) {
              //存在付了一个不存在的选项值
              this.$emit('updatevalue', that.field, newCheckedValue);
              console.info(that.field.vModel + "给单选控件赋一个不存在的选项值需重置最顶层Data值为：" + newCheckedValue);
            }
          } else {
            that.value = "";
            //单选按钮的值必须是字符串,否则重置顶层为空
            if (newV != "") {
              this.$emit('updatevalue', that.field, that.value);
            }
          }
          that.configTypeArray[0].isValue = that.value;


        },
        immediate: false
      }
    },
    created: function () {
      var that = this;
      that.inputCtrlOption = that.field.inputCtrlOption;
      that.value = that.fieldvalue;
      var formAction = WFContext.WorkflowformAction;
      that.formAction = formAction;
      that.isView = that.formAction > 2;
      if (that.isView) {
        that.isReadOnly = true;
      }
      else if (that.field._isReadOnly == true) {
        that.isReadOnly = true;
      }
      that.initFieldOptions();
      that.initail();
    },
    mounted() {
      var that = this;
      //FUI.F2Grid.excuteFieldWritePowerByVueFormItem(that)
      if (that.value != null && that.value != undefined) {
        //触发控件联动
        that.triggerFieldLinkages(that.field, that.value);
        that.loadfieldtext();
      }
    },
    methods: {
      loadfieldtext() {
        var that = this;
        var data = that.data;
        console.log("radio组件data===:",data);
        var allTextArr = [];
        $.each(data, function (_, row) {
          var t = row[that.textName];
          var v = row[that.valueName];
          allTextArr.push(t);
          if (that.value == v) {
            that.fieldtext = t;
          }
        });
        that.fieldalltext = allTextArr.toString();
      },
      radioClick(value) {
        var that = this;
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
        //================================================
        that.loadfieldtext();
      }
      //触发控件联动
      , triggerFieldLinkages(field, value) {
        var that = this;
        if (WFContext.isDesign == true || that.isShow == false) {
          return false;
        }
        FUI.F2Grid.excuteTriggerFieldLinkages(field, value, that.isView);
      }
      , initFieldOptions() {
        var that = this;
        //获取控件其它属性
        if (that.field.fieldOptions) {
          var fieldOptions = eval("(" + that.field.fieldOptions + ")");
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
            that.configTypeArray[0].isValue = that.value;
            FUI.Form.initailConfigTypeComboBox(that);
          } else if (json.type == 'sql') {
            that.type = json.type;
            var sql = json.data;
            var data = Object.toAjaxJson('/workflow/fuiFramework/', 'getTextValueDataJsonBySql', { sql: sql });
            that.data = data;
          } else if (json.type == 'dataService') {
            var code = json.data.code;
            var isMulti = json.data.isMulti;
            var bindFields = json.data.data;
            // 高级参数格式：[{'key':'A','value':'1','orderNum':1},{'key':'B','value':'Items2','orderNum':2}]
            var parmsArr = json.data.parms || [];
            if (parmsArr && typeof parmsArr === 'string') {
              parmsArr = eval('(' + parmsArr + ')');
            }
            var parms = {};
            if (parmsArr && parmsArr.length > 0) {
              $.each(parmsArr, function (i, item) {
                parms[item.key] = item.value;
              });
            }
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
      //  console.log(that.data)
      }
    }
  }
</script>
<style lang="scss">
  @import url('~@/styles/global.scss');
</style>
