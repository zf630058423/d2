<template>
  <el-select :disabled="isReadOnly" filterable :style="style" class="textBoxSelect" size="small" @change="onItemChange" v-model="value" :clearable="isClearable" :multiple="isMultiple" :name="field.vModel">
    <el-option v-for="(item,  index) in data" :key='index' :label="item[textName]" :value="item[valueName]"></el-option>
  </el-select>
</template>
<script>
  export default {
    name: 'f2bpmuiSelect',
    components: {},
    // configtype:非必传，主要是为了方便页面直接配置configtype的值
    // sqlkey:非必传，主要是为了方便页面直接配置sqlkey的值
    // field为字符串时，则认为它是字段名,否则则认为它是字段UI的定义，如inputCtrlOption
    // props,其它属性,{parm:'aaa:aaa,bbb:bbb'},parm为字符串
    props: ['field', 'fieldvalue', 'readOnly', 'configtype', 'sqlkey', 'props'],
    data: function () {
      return {
        theprops: null,
        style: '',
        class: 'textBoxShort',
        isReadOnly: false,
        textName: 'label',
        valueName: 'value',
        isMultiple: false,
        isClearable: true,
        value: '',
        sqlkeyArray: [
          {
            dataField: 'data',
            sqlkey: '',
            parm: null,
            flag: null,
            change: null
          }
        ],
        configTypeArray: [
          {
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
      fieldvalue: {
        handler(newVal, oldVal) {
          if (newVal != this.value && newVal != oldVal && oldVal != undefined) {
            this.value = newVal
          }
        },
        deep: true,
        immediate: false
      }
    },
    created: function () {
      var that = this
      if (that.readOnly != undefined&&that.readOnly!=null) {
        that.isReadOnly = that.readOnly;
      }
      if (that.fieldvalue != undefined && that.fieldvalue != null) {
        that.value = that.fieldvalue.toString()
      }
      var props = null;
      if (that.props && typeof that.props === 'string') {
        props = eval('(' + that.props + ')')
      } else if (that.props && typeof that.props === 'object') {
        props = that.props
      }
      if (props && props.class) {
        that.class = props.class
      }
      if (props && props.style) {
        that.style = props.style
      }
      that.theprops = props;
      var that = this
      if (typeof that.field === 'string') {
        if (that.configtype) {
          var configType = that.configtype
          that.configTypeArray[0].configType = configType
          that.textName = 'text'
          if (that.theprops && that.theprops.parm) {
            that.configTypeArray[0].parm = that.theprops.parm
          }
          FUI.Form.initailConfigTypeComboBox(that)
        } else if (that.sqlkey) {
          that.sqlkeyArray[0].sqlkey = that.sqlkey
          that.textName = 'text'
          if (that.theprops && that.theprops.parm) {
            that.sqlkeyArray[0].parm = that.theprops.parm
          }
          FUI.Form.initailSqlKeyComboBox(that)
        }

        return false
      }
      that.initailFieldOption();
      if (that.field.itemRender && that.field.itemRender.props) {
        that.initailItemRender();
      }

    },
    methods: {
      initailFieldOption() {
        var that = this
        if (typeof that.field === 'string') {
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
            that.configTypeArray[0].configType = configType
            that.configTypeArray[0].isEnable = that.isReadOnly === true ? '' : 1;
            that.configTypeArray[0].isReadOnly = that.isReadOnly;
            FUI.Form.initailConfigTypeComboBox(that)
          } else if (json.type == 'sql') {
            that.type = json.type
            var sql = json.data
            var data = Object.toAjaxJson('/workflow/fuiFramework/', 'getTextValueDataJsonBySql', { sql: sql })
            that.data = data
          } else if (json.type == 'dataService') {
            that.textName = 'text';
            var code = json.data.code;
            var isMulti = json.data.isMulti;
            var bindFields = json.data.data;
            // 高级参数格式：[{'key':'A','value':'1','orderNum':1},{'key':'B','value':'Items2','orderNum':2}]
            var parmsArr = json.data.parms || []
            if (parmsArr && typeof parmsArr === 'string') {
              parmsArr = eval('(' + parmsArr + ')');
            }
            var parms = {}
            if (parmsArr && parmsArr.length > 0) {
              $.each(parmsArr, function (i, item) {
                parms[item.key] = item.value;
              })
            }
            var res = FUI.Sys.getServiceData(code, parms)
            var textValueData = [];
            var data = [];
            if (res.success != undefined && res.success == true) {
              data = res.data;
            } else if (res.success == undefined) {
              data = res;
            }
            if (data && typeof data === 'string') {
              data = eval('(' + data + ')')
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
              })
            }
            that.data = textValueData;
          }
        }
      },
      initailItemRender() {
        var that = this;
        if (typeof that.field === 'string') {
          return false
        }
        if (that.field.itemRender.props.isMultiple != undefined) {
          that.isMultiple = that.field.itemRender.props.isMultiple
        }
        if (that.field.itemRender.props.isReadOnly != undefined) {
          that.isReadOnly = that.field.itemRender.props.isReadOnly
        }
        if (that.field.itemRender.props.isClearable != undefined) {
          that.isClearable = that.field.itemRender.props.isClearable
        }
        var theSqlKey = ''
        if (that.field.itemRender.props && that.field.itemRender.props.sqlkey) {
          theSqlKey = that.field.itemRender.props.sqlkey
        }
        if (that.field.itemRender && that.field.itemRender.options && that.field.itemRender.options.length > 0) {
          // 指定数据
          if (that.field.itemRender.props && that.field.itemRender.props.textName) {
            that.textName = that.field.itemRender.props.textName
          }
          that.data = that.field.itemRender.options
        } else if (theSqlKey) {
          var keyStr = that.field.itemRender.props.sqlkey
          var parmObj = {}
          if (keyStr.indexOf('|') > -1) {
            var arr = keyStr.split('|')
            keyStr = arr[0]
            parmObj = eval('(' + arr[1].replace('parm:', '') + ')')
          }
          var key = keyStr.toString().substr(15)
          parmObj.code = key
          var textField = 'text'
          var valueField = 'value'
          that.textName = 'text'
          var myData = Object.toAjaxJson(FUI.Handlers.FuiFrameworkHandler, 'getTextValueDataJsonByDataServiceCode', parmObj)
          var data = []
          $.each(myData, function (i, item) {
            var v = item[valueField]
            var t = item[textField]
            var op = { value: v, label: t }
            data.push(op)
          })
          that.data = data
        } else if (that.field.itemRender.props && that.field.itemRender.props.configtype) {
          var configType = that.field.itemRender.props.configtype
          that.configTypeArray[0].configType = configType
          that.textName = 'text'
          FUI.Form.initailConfigTypeComboBox(that)
        }
      }
      , onItemChange(value) {
        var that = this
        var fieldName = '';
        if (typeof that.field === 'string') {
          fieldName = that.field;
        } else {
          fieldName = that.field.fieldName;
        }
        var itemData = typeof value !== 'object' ? that.data.find(a => a[that.valueName]==value) : value;
        // var newValue = typeof value == 'object' ? newValue[that.valueName] : value;
        this.$emit('updatevalue', fieldName, value,itemData)
      }
    }
  }
</script>
