<template>
  <div class="f2bpm-page-layout">
    <el-form ref="formRef" :model="data" label-position="top" class="f2bpm-editform" label-width="130px">
      <el-form-item v-if="editorType=='combobox'" :label="'请选择'+fieldTitle">
        <el-select v-model="data.comboboxEditor">
          <el-option v-for="item in comboboxListData" :label="item[textField]" :value="item[valueField]" />
        </el-select>
      </el-form-item>

      <el-form-item v-if="editorType=='textbox'" :label="fieldTitle">
        <el-input v-model="data.textboxEditor" type="textarea" :rows="4" />
        <div style="line-height: 25px;font-size: 12px;padding-top: 3px;">
          <el-button size="mini" type="primary" @click="selectDataDictType('textboxEditor')"><i class="fa fa-search" />选择数据字典</el-button>
          <br>1、支持mapxml中sqlkey数据源规则填写示例：sqlkey:CB_ConfigType
          <br>其中key为mybatis的 xml中Sql语句配置id值
          <br>2、支持autokey数据源规则填写示例： autokey:Auto_DataDict|parm:{'isOnFocusToSearch':true}
          <br>3、支持数据服务dataServiceKey填写示例：dataServiceKey:dropSelect_category|parm:{'groupKey':'GeneralFieldGroup'}
          <br>4、查询字段使用自定义下拉选项：custom:[{'text':'苹果','value':'apple'}]
          <br>5、查询字段使用自定义下拉多选选项：extend:{"value":"#流程状态","isMultiple":true}
          <br>6、流程状态的格式化显示：getWorkflowStatusFormatter
          <br>7、日期字符串格式化查询：dateformat:yyyy年MM月（在“扩展查询下拉框数据源”中填写）
          <br>8、设置宽度时：设置为-1时为自动浏览器剩余自动宽度。
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
var json = {}
// 对象名，即用户填写的JS对象或者默认的编辑器
var editorName = ''
var editorType = 'textbox'
var dataType = ''
var editorOjb = null
var required = false
var validType = ''
var columnTitle = ''
var columnName = ''
var fieldTitle = ''
var theValue = ''

function pageLoad() {
  var parms = Object.toQueryString('parms')
  parms = parms.replace(/%/g,'%25')
  parms = decodeURIComponent(parms)
  json = eval('(' + parms + ')')
  // 页面加载时会先执行里
  //   json = window.parms || {};
  editorName = json.editorName
  editorType = json.editorType
  // 编辑器对象:json格式{ type: "combobox", options: { valueField: 'value', textField: 'text', data: [{ "text": "字符串[nvarchar]", "value"}]}}
  editorOjb = json.editor
  required = json.required
  validType = editorOjb.options.validType
  dataType = json.dataType
  columnName = json.field
  columnTitle = json.title
  fieldTitle = json.title
  theValue = json.fieldValue
}

var thevue = {
  created: function() {
    console.info('created')
    var that = this
    pageLoad()
    that.editorType = editorType
    that.dataType = dataType
    that.editorOjb = editorOjb
    that.required = required
    that.validType = validType
    that.fieldTitle = fieldTitle
    if (that.editorType == 'combobox') {
      that.data.comboboxEditor = theValue
      if (that.editorOjb.options) {
        that.valueField = that.editorOjb.options.valueField || 'value'
        that.textField = that.editorOjb.options.textField || 'text'
        that.comboboxListData = that.editorOjb.options.data
      }
    } else if (that.editorType == 'textbox' || that.editorType == 'datetimebox' || that.editorType == 'datebox') {
      if (theValue && that.dataType == 'date') {
        that.data.textboxEditor = theValue.substr(0, 10)
      } else {
        that.data.textboxEditor = theValue
      }
    }
  },
  mounted() {
      window.myvm = this
  },
  data() {
    return {
      form: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      },
      formAction: null,
      json: null,
      editorType: '',
      dataType: '',
      editorOjb: '',
      required: false,
      validType: '',
      fieldTitle: '',

      valueField: 'value',
      textField: 'text',
      comboboxListData: [],

      treeData: [],
       data: {
        textboxEditor: '',
        comboboxEditor: ''
      }
    }
  },
  methods: {
    // ===stand:标准化方法============
    closeEdit() {
      // stand:关闭编辑窗口
      FUI.Window.closeEdit()
    },
    // ===stand:标准化方法结束============
     validateForm(refFormName) {
      // stand:表单校验
      var success = false
      this.$refs[refFormName].validate(valid => {
        success = valid
      })
      return success
    },
     selectDataDictType(inputId) {
      WF.SelectorDialog.selectDataDictConfigType(this, inputId, '#')
    },
     getResult() {
      var that = this
      var fieldValue = ''
      if (that.editorType == 'combobox') {
        fieldValue = that.data.comboboxEditor
        fieldValue = Object.toTrim(fieldValue)
      }
      if (that.editorType == 'textbox' || that.editorType == 'datetimebox' || that.editorType == 'datebox') {
        fieldValue = that.data.textboxEditor
        fieldValue = Object.toTrim(fieldValue)
        if (that.dataType == 'datetime' && fieldValue.length == 10) {
          fieldValue = fieldValue + ' 00:00:00'
        }
      }
      if ((that.required == true || that.required == 'true') && fieldValue == '') {
        FUI.Window.showMsg(that, that.fieldTitle + ',输入不能为空。')
        return {
          success: false
        }
      }
      if (that.dataType == 'number' && isNaN(fieldValue)) {
        FUI.Window.showMsg(that, that.fieldTitle + ',请输入数字。')
        return { success: false }
      }
      var resultData = fieldValue
      return resultData
    }
  }
}

export default thevue
function submitSave() {
  var fieldValue = myvm.getResult()
  var changeObj = {}
  changeObj.mainTable = json.mainTable
  changeObj.viewTable = json.viewTable
  changeObj.tableName = json.tableName
  changeObj.idField = json.idField
  changeObj[json.idField] = json.primaryValue
  changeObj[json.fieldName] = fieldValue
  if (changeObj.mainTable == 'f2bpm_sys_GridConfig' && (columnName == 'DbField' || columnName == 'Field') && fieldValue != '' && !isNaN(fieldValue)) {
    FUI.Window.showMsg('“字段名”不允许是纯数字')
    return {
      success: false
    }
  }

  var data = Object.toAjaxJson(FUI.Handlers.FuiFrameworkHandler, 'saveViewTableModel', changeObj)
  if (data.success) {
    var resultJson = {
      'success': true,
      'fieldName': json.fieldName,
      'fieldValue': fieldValue,
      msg: ''
    }
    return resultJson
  } else {
    FUI.Window.showMsg2(myvm, data.msg)
    var resultJson = data
    return resultJson
  }
}

window.getResult = function() {
  var data = submitSave()
  return data
}

</script>
