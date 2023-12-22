<template>
  <div class="f2bpm-page-layout">
    <div>
      <div style="padding: 5px;">
        &nbsp;<i class="fa fa-plus" />选择添加要返回的字段 (将显示名的字段放在最后一个)
        <el-select value="" size="mini" filterable placeholder="请选择" @change="myChange">
          <el-option v-for="item in fieldList" :label="item.text" :value="item" />
        </el-select>
      </div>
      <div id="parmList" style="overflow-x: auto;height:350px;">
        <table id="parmTable" class="common-grid">
          <tbody>
            <tr>
              <th>字段名称</th>
              <th>字段名</th>
              <th>属性名</th>
              <th>是否主键</th>
              <th>操作</th>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div class="dialogfooter">
      <el-button size="small" type="primary" @click="submitForm()"><i class="fa fa-save" />保存</el-button>
      <el-button id="btn_cancel" size="small" @click="closeEdit"> <i class="fa fa-minus-circle" />取消</el-button>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        templateTr: "<tr><td><input type=\"text\" readonly=\"readonly\" name=\"fieldTitle\" value=\"{0}\" class=\"textBoxNoneShort vxe-input--inner w80\" /></td><td><input type=\"text\" value=\"{1}\" readonly=\"readonly\"  name=\"fieldName\" class=\"textBoxNoneShort vxe-input--inner w80\" /> </td><td><input type=\"text\" value=\"{2}\"  name=\"propertyName\" class=\"textBoxShort vxe-input--inner\" /> </td><td>  <input type=\"radio\"  name=\"isKey\"   {3} />   </td><td><i  class=\"fa fa-times cur\" onclick='deleteRow(this)'>删除<i> </td></tr>",

        formAction: null,
        id: '',
        // ===========SqlKey==========
        fieldList: null,
        sqlkeyArray: [{
          dataField: 'fieldList',
          sqlkey: 'CB_SelectCustomDialogField',
          parm: null,
          flag: null,
          change: null
        }],
         configModel: [],
         ResultField: [],
         data: {}
      }
    },
    mounted() {
      var that = this
      that.loadData()
    },
     created: function() {
      var that = this
      var id = Object.toQueryString('id')
      that.id = id
      that.formAction = formAction
      that.loadCustomConfig()

      that.sqlkeyArray[0].parm = 'tableName:CustDialog_' + that.configModel.code
      FUI.Form.initailSqlKeyComboBox(that)
    },
    methods: {
      closeEdit() {
        FUI.Window.closeEdit()
      },
       loadData() {
        var that = this
        if (that.configModel.resultField) {
          that.data = eval('(' + that.configModel.resultField + ')')
        }
        if (that.data && that.data.length > 0) {
          that.ResultField = that.data
          that.loadParm(that.data)
        }
      },
       loadCustomConfig() {
        var that = this
        var parm = { 'isSetHead': false, 'id': that.id }
        var res = Object.toAjaxJson(FUI.Handlers.CustomDialogHandler, 'getCustomDialogModelJson', parm)
        var configModel = res.data
        that.configModel = configModel
      },
       submitForm() {
        var that = this
        var isCanSubmit = that.collectParmJson()
        if (!isCanSubmit) return false
        var param = { id: that.id, resultField: that.ResultField }
        var result = Object.toAjaxJson('/workflow/customDialog/', 'saveResultField', param)
        if (result.success) {
          FUI.Window.showMsg(that, result.msg, null, 1, function() {
            FUI.Window.closeEdit()
          })
        }
      },
       myChange(selectItem) {
        var that = this
        var value = selectItem.value
        var text = selectItem.text
        that.addParm(text, value)
      },
       addParm(fieldTitle, fieldName) {
        var that = this
        if (that.isExist(fieldName)) {
          FUI.Window.showMsg(that, fieldTitle + '|' + fieldName + ',字段已存在')
          return false
        }
        var htmlTr = Object.toStringFormat(that.templateTr, fieldTitle, fieldName, fieldName, '')
        $(htmlTr).insertAfter("table[id='parmTable'] tbody>tr:last")
      },
       isExist(newFieldName, isCheckKey) {
        isCheckKey = isCheckKey || false
        var isKey = 0
        var isExist = isCheckKey
        $("table[id='parmTable'] tbody>tr").each(function(index, item) {
          if (index != 0) {
            var fieldName = $("input[name='fieldName']", $(item)).val()
            if (isCheckKey) {
              if ($("input[name='isKey']", $(item)).is(':checked')) {
                isKey = 1
                return false
              }
            } else if (newFieldName == fieldName) {
              isExist = true
              return false
            }
          }
        })
        // 没有设置Key
        if (isCheckKey && isKey == 0) {
          return false
        }
        return isExist
      },
       collectParmJson() {
        var that = this
        var isCanSubmit = true
        var resultData = []
        $("table[id='parmTable'] tbody>tr").each(function(index, item) {
          if (index != 0) {
            var fieldTitle = $("input[name='fieldTitle']", $(item)).val()
            var fieldName = $("input[name='fieldName']", $(item)).val()
            var propertyName = $("input[name='propertyName']", $(item)).val()
            var isKey = 0
            if ($("input[name='isKey']", $(item)).is(':checked')) {
              isKey = 1
            }
            if (propertyName == '') {
              FUI.Window.showMsg('别名不能为空')
              isCanSubmit = false
              return false
            }
            resultData.push({
              fieldTitle: fieldTitle,
              fieldName: fieldName,
              propertyName: propertyName,
              isKey: isKey
            })
          }
        })
        if (isCanSubmit && !that.isExist(null, true)) {
          FUI.Window.showMsg(that, '没有指定Key字段')
          return false
        }
        that.ResultField = JSON.stringify(resultData)
        return isCanSubmit
      },
       loadParm(data) {
        var that = this
        // var data = [{ fieldTitle: "字段1", fieldName: "1", propertyName: "", isKey: 0 }, { fieldTitle: "字段2", fieldName: "1", propertyName: "", isKey: 1 }];
        $.each(data, function(index, item) {
          var checked = item.isKey == 1 ? "checked='checked'" : ''
          var htmlTr = Object.toStringFormat(that.templateTr, item.fieldTitle, item.fieldName, item.propertyName || '', checked)
          $(htmlTr).insertAfter("table[id='parmTable'] tbody>tr:last")
        })
      }
    }
  }
  window.deleteRow = function(obj) {
    $(obj).parent().parent().remove()
  }
</script>
