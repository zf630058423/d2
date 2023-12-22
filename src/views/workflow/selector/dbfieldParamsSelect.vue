<template>
  <div class="f2bpm-page-dialog-layout">
    <el-form ref="formRef" size="mini" :rules="formRules" :model="data" class="f2bpm-editform" label-width="120px">
      <div class="fence-box" style="width: 340px;height: 350px;">
        <div style="padding-left: 10px; text-align: left;">
          <i class="fa fa-cube" aria-hidden="true" />编辑条件：
        </div>
        <div class="fence-inner-line column-height" style="width: 330px">
          <div class="p3">
            数据字段：
            <el-select value="" class="textBoxShort" size="mini" @change="selectChange">
              <el-option label="请选择" value="" />
              <el-option v-for="item in fieldData" :key="item.value" :label="item.text" :value="item" />
            </el-select>
          </div>
          <table id="table" class="common-FormTable" cellpadding="0" cellspacing="0">
            <tr>
              <td class="leftTdbg">参数标题</td>
              <td>
                <el-input v-model="data.fieldTitle" size="mini" />

              </td>
            </tr>
            <tr>
              <td class="leftTdbg">参数名</td>
              <td class="pl3">
                <el-input v-model="data.fieldName" size="mini" />
              </td>
            </tr>
            <tr>
              <td class="leftTdbg">取值的表单字段</td>
              <td class="p3">
                <el-input v-model="data.comparValue" size="mini" />
              </td>
            </tr>
            <tr>
              <td class="leftTdbg">取值方式:</td>
              <td style="text-align: left;">
                <el-select v-model="data.operator" style="width: 100%;" size="mini">
                  <el-option value="default" label="默认" />
                </el-select>
              </td>
            </tr>

          </table>
        </div>
      </div>
      <div class="fence-box" style="width:80px;margin: 0px;border: 0px;padding-top: 140px; ">
        <a href="javascript:void(0);" role="button" class="btn btn-primary btn-sm mr2" @click="save()"><span>{{ currentAction=='add'?'添加':'保存' }}</span> <i class="fa  fa-arrow-right" /></a><br> <br> <a href="javascript:void(0);" title="清空左侧编辑输入，重置后可保存新增按钮" role="button" class="btn btn-primary btn-sm mr2" @click="clearLeft()"><i class="fa  fa-undo" />重置</a>
      </div>
      <div class="fence-box right-result-boxlist" style="width: 200px;height: 350px;">
        <div style="text-align: left; padding-left: 10px; margin-right: 10px;">
          <i class="fa fa-cubes" aria-hidden="true" />结果(双击删除，单击修改)：
        </div>
        <div id="result-boxlist" class="right-result-boxlist fence-inner-line column-height">
          <ul id="listResult">
            <li v-for="(item,index) in resultData" class="fence-li-item" :tabIndex="index" :value="item.fieldName" :text="item.fieldTitle" title="双击删除" @click="editItem(this,item)" @dblclick="deleteItem(this,item.fieldName)">
              <input type="button" disabled="disabled" :value="index" class="fence-li-index">{{ item.fieldTitle }}
            </li>
          </ul>
        </div>
      </div>
    </el-form>
  </div>
</template>

<script>
  export default { data() {
      return {
        fieldSelectValue: '',
        fieldData: [],
        currentAction: 'add',
        currentEditFieldName: '',
        tableId: '',
        readOnlyFieldName: false,
        // item: { orderNum: orderNum, fieldTitle: text, fieldName: value, operator: operator, comparValue: comparValue  };
        resultData: [],
        index: 0,
        data: {
          fieldTitle: '',
          fieldName: '',
          operator: '',
          comparValue: '',
          andOrChar: '',
          orderNum: 1000
        },
        // stand:表单校验规则
         formRules: {
          fieldTitle: [
            { required: true, message: '必填项不能为空' }
          ],
          fieldName: [
            { required: true, message: '必填项不能为空' },
            { validator: FUI.Validator.englishchar }
          ],
          operator: [
            { required: true, message: '必填项不能为空' }
          ],
          comparValue: [
            { required: true, message: '必填项不能为空' }
          ],
          andOrChar: [
            { required: true, message: '必填项不能为空' }
          ]
        }
      }
    },
    created: function() {
      var that = this
      that.loadWindowparms()
      var value = []
      // 1、根据formKey或dataMainTableName或tableId 三者传其中一个
      var formKey = Object.toQueryString('formKey') || ''
      var dataMainTableName = Object.toQueryString('dataMainTableName') || ''
      var tableId = Object.toQueryString('tableId') || ''
      that.tableId = tableId
      var res = Object.toAjaxJson(FUI.Handlers.Selector, 'getDbfieldSelectJson', { tableId: tableId, formKey: formKey, dataMainTableName: dataMainTableName })
      that.fieldData = res
    },
    mounted() {
      window.myvm = this
    },
    methods: {
      loadWindowparms() {
        const that = this
        var parmsStr = Object.toQueryString('parms')
        var parms = {}
        if (parmsStr) {
          parmsStr = decodeURIComponent(parmsStr)
          parms = eval('(' + parmsStr + ')')
          if (parms.data != undefined && parms.data.length > 0) {
            that.resultData = parms.data
          }
          if (parms.singleSelect != undefined) {
            that.windowparms.singleSelect = parms.singleSelect
          }
          if (parms.resultFieldKey != undefined) {
            that.windowparms.resultFieldKey = parms.resultFieldKey
          }
        }
      },
       initailResult(data) {
        var that = this
        index = 0
        $.each(data, function(index, item) {
          add(item.fieldTitle, item.fieldName, null)
        })
      },
       operatorToText(char) {
        var that = this
        switch (char) {
          case '>': return '大于'
          case '>=': return '大于等于'
          case '<': return '小于'
          case '<=': return '小于等于'
          case '==': return '等于'
          case '!=': return '不等于'
          case 'contain': return '包含有'
          case 'uncontain': return '不包含有'
          case '||': return ' 或者'
          case '&&': return '并且'
          default: return ''
        }
      },
       clearLeft() {
        var that = this
        that.currentAction = 'add'
        $.each(that.data, function(k) {
          that.data[k] = ''
        })
      },
       cancle() {
        var that = this
        FUI.Window.closeEdit()
      },

       actinNameState() {
        var that = this
        if (that.currentAction == 'edit') {
          that.readOnlyFieldName = true
        }
      },
       save() {
        var that = this
        var text = that.data.fieldTitle
        var value = that.data.fieldName
        var operator = that.data.operator
        var comparValue = that.data.comparValue
        var andOrChar = that.data.andOrChar
        var orderNum = that.data.orderNum
        if (text == '' || value == '') {
          FUI.Window.showMsg('字段不能为空')
          return false
        }
        if (operator == '') {
          FUI.Window.showMsg('请选择比较运算符')
          return false
        }
        if (comparValue == '') {
          FUI.Window.showMsg('比较值不能为空')
          return false
        }
        if (andOrChar == '') {
          FUI.Window.showMsg('请选择并集运算符')
          return false
        }
        var jsonItem = { orderNum: orderNum, fieldTitle: text, fieldName: value, operator: operator, comparValue: comparValue }
        if (that.currentAction == 'add') {
          that.add(text, value, jsonItem)
        } else {
          var tem = []
          $.each(that.resultData, function(index, item) {
            if (item.fieldName != value) {
              tem.push(item)
            } else {
              tem.push(jsonItem)
            }
          })
          that.resultData = tem
          // 更新
          var msg = that.currentAction == 'add' ? '添加成功' : '更新成功！'
          FUI.Window.showMsg('【' + text + '】' + msg, null, 1)
          that.clearLeft()
        }
      },
       add(text, value, jsonItem) {
        var that = this
        if (that.isExist(value) && that.currentAction == 'add') {
          FUI.Window.showMsg('【' + text + '】' + '已存在！')
          return false
        }
        if (jsonItem) {
          that.addToData(jsonItem)
        }
      },
       addToData(jsonItem) {
        var that = this
        that.resultData.push(Object.toClone(jsonItem))
        that.clearLeft()
      },
       isExist(addValue) {
        var that = this
        var exist = false
        $.each(that.resultData, function(index, item) {
          if (item.fieldName == addValue) {
            exist = true
            return true
          }
        })
        return exist
      },
       editItem(thisObj, item) {
        var that = this
        that.data = Object.toClone(item)
        that.currentAction = 'edit'
        that.currentEditFieldName = item.fieldName
        that.actinNameState()
      },
       deleteItem(thisObj, value) {
        var that = this
        var tem = []
        $.each(that.resultData, function(index, item) {
          if (item.fieldName != value) {
            tem.push(item)
          }
        })
        that.resultData = tem
        that.clearLeft()
      },
       selectChange(item) {
        var that = this
        that.currentAction = 'add'
        var fieldName = item.value
        var fieldTitle = item.text
        that.data.fieldTitle = fieldTitle
        that.data.fieldName = fieldName
        that.data.comparValue = ''
        that.data.operator = '=='
        that.data.andOrChar = '&&'
        that.readOnlyFieldName = true
      },
       clearAll() {
        var that = this
        index = 0
        that.resultData = []
      },
       upOrderNo(sort) {
        // var that = this;
        // Object.toUpdateOrderNo(sort, that.resultData, initailResult, currentEditFieldName, "fieldName", "orderNum");
      },
       getResult() {
        var that = this
        var result = that.resultData
        return result
      }
    }
  }
  window.getResult = function() {
    return myvm.getResult()
  }
</script>
