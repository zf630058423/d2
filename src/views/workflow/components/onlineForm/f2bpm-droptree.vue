<template>
    <treeselect append-to-body :fieldtext="fieldtext" :clearable="false" @select="treeselectSelect" :disabled="isReadOnly" @deselect="deselect" v-show="isShow" v-model="value" placeholder="请选择" size="mini" :default-expand-level="3" :flat="isMultiple" :multiple="isMultiple" :sort-value-by="sortValueBy" :options="treeData" />
  
</template>
<script>
  export default {
    name: 'f2bpm-droptree',
    components: {},
    props: ['field', 'fieldvalue', 'rowindex', 'colindex'],
    data: function () {
      return {
        sortValueBy: "ORDER_SELECTED",
        fieldtext: '',
        //text回绑字段
        textBindToFields: '',
        treeData: [],
        isView: false,
        isShow: true,
        isReadOnly: false,
        isMultiple: false,
        value: null
      };
    }, watch: {
      value(val, oleV) {
        var that = this;
        if (val != undefined && f2grid_global_mainVueLoadComplated) {
          this.$emit('updatevalue', that.field, val);
          //Text标签填写到指定字段
          if (that.textBindToFields) {
            that.loadfieldtext();
            var fieldtext = that.fieldtext;
            var arr = that.textBindToFields.split(',');
            $.each(arr, function (i, tofieldName) {
              if (tofieldName) {
                that.$emit('updatevalue', tofieldName, fieldtext);
              }
            });
          }
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
      that.initFieldOptions();
      that.loadTreeData();
      if (that.isMultiple) {
        if (that.fieldvalue == '') {
          that.value = [];
        } else {
          if (that.fieldvalue.indexOf('[') > -1 && that.fieldvalue.indexOf(']') > -1) {
            that.value = eval("(" + that.fieldvalue + ")");
          } else {
            that.value = [];
            that.value.push(that.fieldvalue);
          }
        }
      } else {
        that.value = that.fieldvalue == '' ? null : that.fieldvalue;
      }
      if (that.isView) {
        that.isReadOnly = true;
      }
    },
    mounted() {
      var that = this;
      FUI.F2Grid.excuteFieldWritePowerByVueFormItem(that);
      if (that.value != null && that.value != undefined) {
        //触发控件联动
        that.triggerFieldLinkages(that.field, that.value);
      }
      that.loadfieldtext();
    },
    methods: {
      loadfieldtext() {
        var that = this;
        var data = that.treeData;
        var texts = [];
        if (that.isMultiple) {
          if (that.value && that.value.length > 0) {
            $.each(that.value, function (i, vitem) {
              var item = Object.toTreeFindItem(data, vitem, true);
              if (item) {
                texts.push(item.title);
              }
            });
            that.fieldtext = texts.toString();
          }
        }
        else if (that.value != null && that.value != undefined) {
          var item = Object.toTreeFindItem(data, that.value, true);
          if (item) {
            that.fieldtext = item.title;
          }
        }
        return that.fieldtext;
      }
      //删除时触发
      , deselect(node, instanceId) {
        console.info(node);
      }
      , treeselectSelect(node, instanceId) {
        var that = this;
        var val = node.id;
        var title = node.title;
        var valueResult = that.value;
        if (that.isMultiple) {
          valueResult.push(val);
        } else {
          valueResult = val;
        }
        that.triggerFieldLinkages(that.field, val);
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
          window[funcName](valueResult, that.field, parms);
        }
        //================================================
      }
      , loadTreeData() {
        var that = this;
        if (WFContext.isDesign == true) {
          return false;
        }
        if (that.field.inputCtrlOption) {
          var json = typeof that.field.inputCtrlOption === 'object' ? that.field.inputCtrlOption : eval('(' + that.field.inputCtrlOption + ')');
          if (json.type == 'dataService') {
            var code = json.data.code;
            var isMulti = json.data.isMulti;
            var bindFields = json.data.data;
            that.isMultiple = isMulti;
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
            // 返回标准的tree结构数据
            textValueData = data;
            that.treeData = textValueData;
          }
        }
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
      //触发控件联动
      , triggerFieldLinkages(field, value) {
        var that = this;
        if (WFContext.isDesign == true) {
          return false;
        }
        FUI.F2Grid.excuteTriggerFieldLinkages(field, value, that.isView);
      }
    }
  }
</script>
