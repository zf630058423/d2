<template>
  <el-form ref="formRef" :model="data" class="f2bpm-editform" label-width="100px">
    <el-form-item v-if="editorType=='combobox'" :label="'请选择'+fieldTitle">
      <el-select v-model="data.comboboxEditor">
        <el-option label="请选择" value="" />
      </el-select>
    </el-form-item>
    <el-form-item v-if="editorType=='textbox'" :label="fieldTitle">
      <el-input v-model="data.textboxEditor" type="textarea" :rows="4" />
    </el-form-item>
  </el-form>
</template>

<script>
  export default {
    data() {
      return {
        formAction: null,
        editorType: '',
        dataType: '',
        editorOjb: '',
        required: false,
        validType: '',
        fieldTitle: '',
        treeData: [],
         data: {
          textboxEditor: '',
          comboboxEditor: ''

        }
      }
    },
    created() {
      var that = this
      var json = {}
      // 对象名，即用户填写的JS对象或者默认的编辑器
      var editorType = ''
      var dataType = ''
      var editorOjb = null
      var required = false
      var validType = ''
      var fieldTitle = ''

      var parmsStr = Object.toQueryString('parms')
      var parms = {}
      if (parmsStr) {
        parmsStr = decodeURIComponent(parmsStr)
        parms = eval('(' + parmsStr + ')')
      }
      json = parms
      // 必填
      editorType = json.editorType
      // 数据类型，默认字符串
      dataType = json.dataType || 'string'
      // 编辑器对象:json格式{type:"combobox", options: { valueField: 'value', textField: 'text', data: [{ "text": "字符串[nvarchar]", "value"}]}}
      editorOjb = json.editor
      required = json.required
      if (editorOjb) {
        validType = editorOjb.options.validType
      }
      fieldTitle = json.fieldTitle

      that.editorType = editorType
      that.dataType = dataType
      that.editorOjb = editorOjb
      that.required = required
      that.validType = validType
      that.fieldTitle = fieldTitle
    },
     mounted() {
      window.myvm = this
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
       onOnlineFormSelect(value) {
        this.selectorModal.modalOpen = true
        this.selectorModal.currModal = 'formDefSelect'
        this.selectorModal.title = '选择'
      }, getResult() {
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
        var resultData = { value: fieldValue }
        return resultData
      }
    }
  }
  window.getResult = function() {
    var data = myvm.getResult()
    return data
  }
</script>
