<template>
  <treeselect v-show="isShow" v-model="value" placeholder="请选择" size="mini" :disabled="isReadOnly" :default-expand-level="3" :multiple="isMultiple" :options="treeData" />
</template>

<script>
  export default {
    name: 'F2bpmDroptree',
    components: {},
    props: ['field', 'fieldvalue', 'readOnly'],
    data: function () {
      return {
        treeData: [],
        isView: false,
        isShow: true,
        isReadOnly: false,
        isMultiple: false,
        value: null
      }
    }, watch: {
      value(val, oleV) {
        var that = this
        if (val != undefined && oleV != undefined) {
          this.$emit('updatevalue', that.field.fieldName, val)
        }
      },
      fieldvalue: {
        handler(newV, oleV) {
          var that = this;
          if (newV != undefined && oleV != undefined) {
            that.value = newV;
          }
        },
        immediate: false
      }
    },
    created: function () {
      var that = this;
      that.value = that.fieldvalue;
      if (that.fieldvalue == '') {
        that.value = null;
      }
      that.loadTreeData();
      if (that.readOnly != undefined&&that.readOnly!=null) {
        that.isReadOnly = that.readOnly;
        that.isView= that.readOnly;
      }
    },
    mounted() {
      var that = this;
    },
    methods: {
      loadTreeData() {
        var that = this
        if (WFContext.isDesign == true) {
          return false;
        }
        if (that.field.inputCtrlOption) {
          var json = typeof that.field.inputCtrlOption === 'object' ? that.field.inputCtrlOption : eval('(' + that.field.inputCtrlOption + ')')
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
              })
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
    }
  }
</script>
