<template>
  <el-radio-group v-show="isShow" :disabled="isReadOnly" @change="radioClick" v-model="value" :name="field.vModel">
    <el-radio v-for="(item,  index) in data" :label="item[valueName]" :key="index">{{item[textName]}}</el-radio>
  </el-radio-group>
</template>

<script>
  export default {
    name: 'f2bpmuiRadio',
    props: ['field', 'fieldvalue','readOnly'],
     data: function () {
      return {
        isView: false,
        // 是否为只读
        isReadOnly: false,
        isShow: true,
        textName: 'text',
        valueName: 'value',
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
          isEnable: '',
          isReadOnly: ''
        }
        ],
        type: '',
        data: []

      }
    },
    watch: {
      field: {
        handler(n, o) {
          this.initail()
        },
        deep: true,
        immediate: false
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
      var that = this
      that.inputCtrlOption = that.field.inputCtrlOption
      that.value = that.fieldvalue
      that.initail();
      if (that.readOnly != undefined&&that.readOnly!=null) {
        that.isReadOnly = that.readOnly;
      }
    },
    mounted() {
      var that = this
    },
    methods: {
      radioClick(value) {
        var that = this
        this.$emit('updatevalue', that.field.fieldName, value)
      },
      initail() {
        var that = this
        if (WFContext.isDesign == true || that.isShow == false) {
          return false
        }
        if (that.field.inputCtrlOption) {
          var json = typeof that.field.inputCtrlOption === 'object' ? that.field.inputCtrlOption : eval('(' + that.field.inputCtrlOption + ')')
          if (json.type == 'custom') {
            that.type = json.type
            that.data = json.data
            that.textName = 'text'
          } else if (json.type == 'dic') {
            that.type = json.type
            var configType = json.data
            that.configTypeArray[0].configType = configType;
            that.configTypeArray[0].isEnable = that.isReadOnly === true ? '' : 1;
            that.configTypeArray[0].isReadOnly = that.isReadOnly;
            FUI.Form.initailConfigTypeComboBox(that)
          } else if (json.type == 'sql') {
            that.type = json.type
            var sql = json.data
            var data = Object.toAjaxJson('/workflow/fuiFramework/', 'getTextValueDataJsonBySql', { sql: sql })
            that.data = data
          } else if (json.type == 'dataService') {
            var code = json.data.code
            var isMulti = json.data.isMulti
            var bindFields = json.data.data
            // 高级参数格式：[{'key':'A','value':'1','orderNum':1},{'key':'B','value':'Items2','orderNum':2}]
            var parmsArr = json.data.parms || []
            if (parmsArr && typeof parmsArr === 'string') {
              parmsArr = eval('(' + parmsArr + ')')
            }
            var parms = {}
            if (parmsArr && parmsArr.length > 0) {
              $.each(parmsArr, function (i, item) {
                parms[item.key] = item.value
              })
            }
            var res = FUI.Sys.getServiceData(code, parms)
            var textValueData = []
            var data = []
            if (res.success != undefined && res.success == true) {
              data = res.data
            } else if (res.success == undefined) {
              data = res
            }
            if (data && typeof data === 'string') {
              data = eval('(' + data + ')')
            }
            textValueData = data
            // 默认认为你是存丰text,value属性的，
            // 如果存在绑定字段的配置,那么就按配置的字段钻取
            if (bindFields && bindFields.length > 0) {
              textValueData = []
              var textProName = bindFields.find(a => a.field == 'text').property
              var valueProName = bindFields.find(a => a.field == 'value').property
              $.each(data, function (_, row) {
                var t = row[textProName]
                var v = row[valueProName]
                textValueData.push({ 'text': t, 'value': v })
              })
            }
            that.data = textValueData
          }
        }
      }
    }
  }
</script>
