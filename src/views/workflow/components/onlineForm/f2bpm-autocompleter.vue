<template>
  <el-autocomplete :disabled="isReadOnly" v-show="isShow" v-model="value" :name="field.vModel" :clearable="clearable" :trigger-on-focus="triggerOnFocus" placeholder="输入搜索关键字" :fetch-suggestions="querySearchAsync" @select="handleSelect" class="online-select"></el-autocomplete>
</template>

<script>
  export default {
    name: "f2bpm-autocompleter",
    props: ['field', 'fieldvalue', 'rowindex', 'colindex'],
    data: function () {
      return {
        isView: false,
        isShow: true,
        isReadOnly: false,
        inputCtrlOption: null,
        value: '',
        // 数据服务的编码
        code: '',
        // 就否多选
        isMulti: false,
        // 选中项的回邦到表单字段的配置
        fieldbind: [],
        //高级参数
        adParms: {},
        // 是否在输入框 focus 时显示建议列表
        clearable: false,
        triggerOnFocus: false,
        timeout: null
      };
    },
    watch: {
      value(val, oleV) {
        var that = this;
        if (val != undefined && oleV != undefined) {
          this.$emit('updatevalue', that.field, val);
        }
      }
    },
    created: function () {
      var that = this;
      that.initailFieldOption();
      that.value = that.fieldvalue;
      var formAction = WFContext.WorkflowformAction;
      that.isView = formAction > 2;
      if (that.isView) {
        that.isReadOnly = true;
      }

      if (that.field.inputCtrlOption) {
        var json = typeof that.field.inputCtrlOption === 'object' ? that.field.inputCtrlOption : eval('(' + that.field.inputCtrlOption + ')');
        that.code = json.data.code;
        that.inputCtrlOption = json;
        if (json.data.isMulti == 'true' || json.data.isMulti == true) {
          that.isMulti = true;
        }
        that.fieldbind = json.data.fieldbind;
        that.adParms = that.getAdParms(json);
      }
    }, mounted() {
      var that = this;
      FUI.F2Grid.excuteFieldWritePowerByVueFormItem(that);
    },
    methods: {
      initailFieldOption() {
        var that = this;
        if (that.field.fieldOptions) {
          var fieldOptions = typeof that.field.fieldOptions === 'string' ? eval('(' + that.field.fieldOptions + ')') : that.field.fieldOptions;
          var general = fieldOptions.find(a => a.opttype == 'general');
          if (general) {
            var kvData = general.params.kvData;
            var item = kvData.find(a => a.key == 'clearable');
            if (item) {
              that.clearable = item.value;
            }
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
          let key = kvItem.key;
          let fieldName = kvItem.value;
          var isSub = fieldName.split(".").length >= 3;
          var value = isSub == false ? myvm.data[fieldName] : that.$parent.data[fieldName];
          varParams.push({ "key": key, "value": value });
        });
        return varParams;
      }
      , querySearchAsync(searchKey, callback) {
        searchKey = Object.toTrim(searchKey);
        if (searchKey == '') {
          callback([]);
          return false;
        }
        var that = this;
        var url = '/workflow/security/autocompleter/';
        var parms = {};
        if (that.inputCtrlOption) {
          parms = that.getParms(that.inputCtrlOption);
        }
        parms.autocode = that.code;
        parms.searchKey = searchKey;
        parms.parentValue = '';
        parms.topN = 0;
        var res = Object.toAjaxJson(url, 'getAutoCompleterListJson', parms, true, null, function (data) {
          if (data.success == false) {
            FUI.Window.showMsg2(null, data.msg);
          }
          clearTimeout(that.timeout);
          that.timeout = setTimeout(function () {
            callback(data);
          }, 1000 * Math.random());
        });
      },
      handleSelect(selectItem) {
        var that = this;
        // 自身值that.value=item.value;
        that.bindMultResultListToTarget(selectItem);
        that.onBlur();
      },
      bindMultResultListToTarget(selectItem) {
        // 绑定其它属性值到目标字段
        var that = this;
        var _isMult = that.isMulti;
        // {title:,property:,field:}
        if (that.fieldbind && that.fieldbind.length > 0) {
          $.each(that.fieldbind, function (i, item) {
            var proname = Object.toTrim(item.property);
            var pval = selectItem[proname];
            var tofieldName = item.field;
            if (tofieldName != that.field.vModel && pval != '' && pval != null && pval != undefined) {
              if (_isMult === true) {
                that.$emit('appendfieldvalue', tofieldName, pval);
              } else {
                that.$emit('updatefieldvaluebyfieldname', tofieldName, pval);
              }
            }
          });
        }
      },
      onBlur() {
        var that = this;
        var fieldDef = that.field;
        var fieldValue = that.value;
        var funcName = fieldDef.vModel.replace(/\./g, '_');
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