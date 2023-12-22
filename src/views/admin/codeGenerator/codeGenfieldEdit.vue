<template>
  <div class="f2bpm-page-dialog-layout">
    <el-form ref="formRef" :rules="formRules" :model="data" size="mini" class="f2bpm-editform" label-width="120px">
      <div>
        <table class="common-FormTable" cellpadding="0" cellspacing="0">
          <tr>
            <td class="leftTdbg">控件标题：<em>*</em></td>
            <td>
              <el-input v-model="data.fieldTitle" class="textBoxShort" size="mini" />
            </td>
            <td class="leftTdbg">数据库字段名<em>*</em></td>
            <td>
              <el-input v-model="data.dbColumnName" class="textBoxShort" size="mini" />
            </td>
          </tr>

          <tr>
            <td class="leftTdbg">属性名<em>*</em></td>
            <td>
              <el-input v-model="data.fieldName" class="textBoxShort" size="mini" />
            </td>
            <td class="leftTdbg">属性类型<em>*</em></td>
            <td>
              <el-select v-model="data.propertyType" size="mini" class="textBoxShort">
                <el-option label="请选择" value="" />
                <el-option label="String" value="String" />
                <el-option label="Date" value="Date" />
                <el-option label="int" value="int" />
                <el-option label="float" value="float" />
                <el-option label="boolean" value="boolean" />
              </el-select>
            </td>
          </tr>
          <tr>
            <td class="leftTdbg"> 控件类型：<em>*</em></td>
            <td>
              <el-select v-model="data.inputCtrlType" size="mini" class="textBoxShort" filterable placeholder="请选择" @change="onInputCtrlTypeChange">
                <el-option v-for="item in ctrTypeArr" :label="item.text" :value="item.value" />
              </el-select>
            </td>
            <td class="leftTdbg">排序：<em>*</em></td>
            <td>
              <el-input-number v-model="data.fieldOrderNo" size="mini" :min="0" :max="100000" label="排序" />
            </td>
          </tr>
          <tr id="optionTr">
            <td class="leftTdbg">数据源配置：</td>
            <td colspan="3" style="padding: 10px;">
              <el-radio-group v-model="datasourceData.type" style="width:70%" size="mini">
                <div id="optionDatasource" style="margin-bottom: 10px;">
                  <el-radio label="custom">自定义</el-radio>
                  <el-radio label="dic">数据字典</el-radio>
                  <el-radio label="sql">SQL语句</el-radio>
                </div>
                <div>
                  <el-radio id="dataServiceDatasource" label="dataService">数据服务</el-radio>
                  <el-radio id="selectorDatasource" label="selector">自定义选择器</el-radio>
                  <el-radio id="customdialogDatasource" label="customdialog">自定义选择对话框</el-radio>
                </div>
              </el-radio-group>
              <a id="OptionEdit" role="button" class="btn btn-purple btn-sm mr2" @click="editOption('inputCtrlOption')"><i class="fa fa-edit" />配置数据</a>
            </td>
          </tr>
          <tr>
            <td class="leftTdbg">是否必填</td>
            <td>
              <el-switch v-model="data.isRequired" :inactive-value="false" :active-value="true" active-color="#13ce66" inactive-color="#DEDEDE" />
            </td>
            <td class="leftTdbg">是否数据库字段</td>
            <td>
              <el-switch v-model="data.isDbField" :inactive-value="false" :active-value="true" active-color="#13ce66" inactive-color="#DEDEDE" />
            </td>
          </tr>
          <tr id="serialnum_tr">
            <td class="leftTdbg">流水号计数器：</td>
            <td colspan="3" style="padding-top: 3px;">
              <el-input v-model="serialNumData.counterCode" size="mini" class="textBoxShort" />
              <span class="cur p3" @click="selectSerialGenerator()"><i class="fa fa-search" />选择流水号生成器</span>
            </td>
          </tr>
          <tr id="richeditor_tr">
            <td class="leftTdbg">工具条类型：</td>
            <td colspan="3" style="padding-top: 3px;">
              <el-select v-model="richeditorData.toolbarsType" size="mini" class="textBoxShort">
                <el-option value="minToolbars" label="极简约" />
                <el-option value="sampleToolbars" label="一般" />
                <el-option value="myToolbars" label="复杂" />
              </el-select>
            </td>
          </tr>
          <tr id="fieldVerifyRuleTr">
            <td class="leftTdbg">校验值类型：</td>
            <td>
              <el-select v-model="data.fieldDataType" size="mini" class="textBoxShort" @change="onFieldDataTypeChange">
                <el-option value="" label="字符串" />
                <el-option value="floatNumber" label="数字" />
                <el-option value="int" label="整数" />
                <el-option value="zint" label="正整数" />
                <el-option value="fint" label="负整数" />
                <el-option value="biggerZero" label="大于0的数字" />
                <el-option value="biggerOrEqualZero" label="大于或等于0的数字" />
                <el-option value="litterOrEqualZero" label="小于或等于0的数字" />
                <el-option value="email" label="邮箱" />
                <el-option value="idcard" label="身份证号码" />
                <el-option value="QQ" label="QQ号码" />
                <el-option value="ZIP" label="邮政编码" />
                <el-option value="CHS" label="汉字" />
                <el-option value="onlyBigEnglisthChar" label="大写字母" />
                <el-option value="englisthOrNumberChar" label="数字或英文" />
                <el-option value="chars" label="数字英文下划线" />
                <el-option value="mobile" label="手机号码" />
                <el-option value="regular" label="正则表达式" />
              </el-select>
            </td>
            <td class="leftTdbg"> </td>
            <td>
            </td>
          </tr>
          <tr id="regular_div">
            <td class="leftTdbg">正式表达式</td>
            <td colspan="3">
              <el-input v-model="fieldVerifyRuleData.regular" placeholder="输入正式表达式如：^1\d{10}$" size="mini" style="width: 60%;margin-right: 2px;" class="textBoxShort" />
              <el-input v-model="fieldVerifyRuleData.regularTitle" placeholder="校验错误提示信息" size="mini" style="width:38%;" class="textBoxShort" />
            </td>
          </tr>
          <tr id="defaultValueTr">
            <td class="leftTdbg">默认值：</td>
            <td colspan="3">
              <el-input v-model="data.fieldDefaultValue" placeholder="默认值" size="mini" style="width: 65%;" />
              <a id="editDefaultValue" role="button" @click="editDefaultValue('fieldDefaultValue')"><i class="fa fa-edit ml2" />编辑默认值</a>
            </td>
          </tr>
          <tr id="tormatTd">
            <td class="leftTdbg">显示格式：</td>
            <td colspan="3">
              <el-select v-model="data.formater" size="mini" class="textBoxShort" style="width: 250px;">
                <el-option label="yyyy-MM-dd" value="yyyy-MM-dd" selected="selected" />
                <el-option label="yyyy-MM-dd HH:mm" value="yyyy-MM-dd HH:mm" />
                <el-option label="yyyy-MM-dd HH:mm:ss" value="yyyy-MM-dd HH:mm:ss" />
                <el-option label="yyyy-MM" value="yyyy-MM" />
                <el-option label="HH:mm:ss" value="HH:mm:ss" />
                <el-option label="HH:mm" value="HH:mm" />
                <el-option label="HH时mm分" value="HH时mm分" />
                <el-option label="HH时mm分ss秒" value="HH时mm分ss秒" />
                <el-option label="MM-dd" value="MM-dd" />
                <el-option label="yyyy年MM月dd日" value="yyyy年MM月dd日" />
                <el-option label="yyyy年MM月" value="yyyy年MM月" />
                <el-option label="MM月dd日" value="MM月dd日" />
              </el-select>
              <span style="color: #333;line-height:21px;display: none;">
                <em>注意：</em>不规则日期格式，数据库字段必务使用字符串类型，否则运行时将无法保存。 <br>不规则日期格式是指除了yyyy-MM-dd和yyyy-MM-dd HH:mm:ss之外的日期格式。
              </span>
            </td>
          </tr>
          <tr id="fieldDataTypeTr">
            <td class="leftTdbg">输入类型:</td>
            <td>
              <el-radio v-model="data.entertextType" label="text">明文</el-radio>
              <el-radio v-model="data.entertextType" label="password">密文</el-radio>
            </td>
          </tr>
          <tr id="nameOfId_tr">
            <td class="leftTdbg">转换为显示名：</td>
            <td colspan="3">
              <el-input v-model="data.NameOfId" />
              <a id="editDefaultValue" role="button" class="btn btn-purple btn-xs mr2" @click="editDefaultValue('NameOfId')"><i class="fa fa-edit" />编辑数据源</a>
              （如果字段本身存储的是ID，可使用些转换方法使ID显示为对应的名称，通常用于隐藏域）
            </td>

          </tr>
          <tr>
            <td class="leftTdbg">底纹填写提示：</td>
            <td colspan="3">
              <el-input v-model="data.fieldRemark" type="textarea" :rows="2" placeholder="如填写了“底纹填写提示”则在表单控件显示如同本效果！" />
            </td>
          </tr>
          <tr>
            <td class="leftTdbg">关联说明文章：</td>
            <td colspan="3">
              <span v-html="data.helperArticle" /> <span v-if="data.helperArticle!=''&&data.helperArticle!=undefined" class="fa fa-times red" @click="clearHelperArticle">清除</span> <span class="fa fa-search cur" @click="selectArticle">选择文章</span>
            </td>
          </tr>
          <tr>
            <td class="leftTdbg">属性设置：</td>
            <td colspan="3">
              <span class="fa fa-cogs cur" @click="setFieldOptions()">属性设置</span>
            </td>
          </tr>

        </table>
        <div class="p10">
          说明：</em>此界面的字段控件修改为表单定义中字段元数据定义的修改,将影响所有使用了此表单定义的表单应用。
        </div>
        <input id="formDefId" type="hidden" name="formDefId">
        <input id="fieldCreator " type="hidden" name="fieldCreator ">
        <input id="fieldCreatedTime  " type="hidden" name="fieldCreatedTime  ">
        <input id="fieldLastUpdateTime  " type="hidden" name="fieldLastUpdateTime  ">
        <input id="fieldLastUpdateActor" type="hidden" name="fieldLastUpdateActor">
        <input id="columnId" type="hidden" name="columnId">
        <input id="oleFieldId" type="hidden" name="oleFieldId">
        <input id="busObjectId" type="hidden" name="busObjectId">
        <input id="fieldVerifyRule" type="hidden" name="fieldVerifyRule">
        <input id="fieldOptions" type="hidden" name="fieldOptions">
      </div>
      <div class="dialogfooter">
        <el-button v-if="formAction!='View'" size="mini" type="primary" @click="submitForm(0)"><i class="fa fa-save" />保存
        </el-button>
        <el-button id="btn_cancel" size="mini" @click="closeEdit"><i class="fa fa-minus-circle" />取消
        </el-button>
      </div>
    </el-form>
  </div>
</template>

<script>

  export default {
    data() {
      return {
        fieldId: '',
        formAction: null,
        formDefId: '',
        treeData: [],
        // 控件类型
        ctrTypeArr: [
          { 'text': '文本框', 'value': 'text' },
          { 'text': '文本域', 'value': 'textarea' },
          { 'text': '富文本编辑器', 'value': 'richeditor' },
          { 'text': '下拉选择框', 'value': 'select' },
          { 'text': '下拉树', 'value': 'droptree' },
          { 'text': '级联选择', 'value': 'cascselect' },
          { 'text': '自动完成', 'value': 'autocompleter' },
          //{ 'text': '自定义选择器', 'value': 'selector' },
          //{ 'text': '自定义选择对话框', 'value': 'customdialog' },
          //{ 'text': '地图地址', 'value': 'mapAddress' },
          { 'text': '单选按钮', 'value': 'radio' },
          { 'text': '复选框', 'value': 'checkbox' },
          { 'text': '附件上传', 'value': 'file' },
          { 'text': '日期时间', 'value': 'datetime' },
          { 'text': '上传图片', 'value': 'picture' },
          //{ 'text': '上传图章', 'value': 'stamp' },
          //{ 'text': '手写签名', 'value': 'handsign' },
          //{ 'text': '超链接', 'value': 'hyperlink' },
          //{ 'text': '隐藏域', 'value': 'hidden' }
        ],
        hyperlinkData: {
          opentype: '',
          linktype: '',
          hyperlinkUrl: ''
        },
        stampData: {
          showPathPrefix: ''
        },
        serialNumData: {
          counterCode: ''
        },
        richeditorData: {
          toolbarsType: ''
        },
        fieldVerifyRuleData: {
          regular: '',
          regularTitle: ''
        },
        datasourceData: {
          type: '',
          data: []
        },
        data: {
          fieldTitle: '',
          inputCtrlType: '',
          isRequired: false,
          fieldOrderNo: 0,
          inputCtrlOption: '',

          fieldLength: 0,
          fieldDecimalLen: 0,
          width: 0,
          height: 0,
          helperArticle: '',

          counterCode: '',
          fieldDataType: '',
          isColumnCount: '',
          fieldDefaultValue: '',
          formater: 'yyyy-MM-dd HH:mm:ss',
          entertextType: 'text',
          nameOfId: '',
          fieldRemark: '',

          formDefId: '',
          fieldCreator: '',
          fieldCreatedTime: '',
          fieldLastUpdateTime: '',
          fieldLastUpdateActor: '',
          columnId: '',
          oleFieldId: '',
          busObjectId: '',
          fieldVerifyRule: '',
          fieldOptions: ''
        },
        formRules: {
          Flag: [
            { required: true, message: '必填项不能为空' }
            // {validator: FUI.Validator.onlyBigEnglisthChar},
          ],
          OpinionContent: [
            { required: true, message: '必填项不能为空' }
          ]
        }
      }
    },
    created: function () {
      var formDefId = Object.toQueryString('formDefId')
      var that = this;
      that.formDefId = formDefId;
      that.fieldId = keyId;
      that.formAction = formAction;
      const currUser = FUI.Sys.getAuthor();
      if (formAction == FUI.FormAction.Add) {
        that.data.fieldCreator = decodeURI(currUser.realName);
        that.data.fieldCreatedTime = Object.toGetCurrentDateTimeString();
        that.data.fieldLastUpdateActor = decodeURI(currUser.realName);
        that.data.fieldLastUpdateTime = Object.toGetCurrentDateTimeString();
      } else {
        that.data.fieldLastUpdateActor = decodeURI(currUser.realName);
        that.data.fieldLastUpdateTime = Object.toGetCurrentDateTimeString();
        that.loadData();
      }
    },
    mounted() {
      var that = this
      window.myvm = that
      var ctrType = that.data.inputCtrlType
      var inputCtrlOption = that.data.inputCtrlOption
      that.changeFunction({
        text: '',
        value: ctrType
      })
      if (formAction != FUI.FormAction.Add) {
        that.fieldDataTypeChangeDone(that.data.fieldDataType)
        that.initailSourceType(inputCtrlOption)
        that.loadInputCtrlOption(ctrType, inputCtrlOption)
        that.loadFieldVerifyRule(ctrType, that.data.fieldVerifyRule)
      }
    },
    methods: {
      // ===stand:标准化方法============
      closeEdit() {
        // stand:关闭编辑窗口
        FUI.Window.closeEdit()
      },
      // ===stand:标准化方法结束============
      loadData() {
        var that = this
        if (formAction != FUI.FormAction.Add) {
          FUI.Form.bindDataToForm(that, '/admin/codeGenerator/', 'getCodeGenfieldModel', keyId, null, null)
        }
      },
      submitForm(btntype) {
        var that = this
        var success = that.validateForm('formRef')
        if (!success) return
        var inputCtrlType = that.data.inputCtrlType
        if (inputCtrlType == 'stamp') {
          $('#option_prefix_tr').hide()
        } else if (inputCtrlType == 'hyperlink') {
          that.saveHyperlink()
        } else if (inputCtrlType == 'serialnum') {
          that.saveSerialNum()
        } else if (inputCtrlType == 'text') {
          that.saveText()
        } else if (inputCtrlType == 'textarea') {
          that.saveTextarea()
        } else if (inputCtrlType == 'richeditor') {
          that.saveRicheditor()
        } else if (inputCtrlType == 'datetime' && !that.data.formater) {
          FUI.Window.showMsg(that, '请选择日期时间显示格式')
          return false
        }

        var inputCtrlOption = that.data.inputCtrlOption
        if (inputCtrlOption == '' && (inputCtrlType == 'select' || inputCtrlType == 'cascselect' || inputCtrlType == 'autocompleter' || inputCtrlType == 'selector' || inputCtrlType == 'customdialog' || inputCtrlType == 'radio' || inputCtrlType == 'checkbox')) {
          FUI.Window.showMsg(that, '请点击“配置数据按钮”进行数据源配置')
          return false
        }
        if (inputCtrlOption == '' && inputCtrlType == 'serialnum') {
          FUI.Window.showMsg(that, '请点击“请选择配置流水号计数器”')
          return false
        }
        FUI.Form.submitForm(that, that.data, "/admin/codeGenerator/", 'saveCodeGenfield', formAction, keyId, parentGridId, null, null, null, null, function (obj) {
          if (obj.success) {
            FUI.Window.showMsg2(that, obj.msg, null, 1, function () {
              if (obj.success) {
                FUI.Window.closeEdit(true)
              }
            })
          } else {
            FUI.Window.showMsg(obj.msg)
          }
        })
      },
      validateForm(refFormName) {
        // stand:表单校验
        var success = false
        this.$refs[refFormName].validate(valid => {
          success = valid
        })
        return success
      },

      selectorUserString(inputKey, inputName, passParm, singleSelect, keyName) {
        var that = this
        WF.SelectorDialog.selectorUserString(that, inputKey, inputName, passParm, singleSelect, keyName)
      },
      selectorUserTextValue(inputKey, inputName, passParm, singleSelect, keyName) {
        var that = this
        WF.SelectorDialog.selectorUserTextValue(that, inputKey, inputName, passParm, singleSelect, keyName)
      },
      clearSelectedUsers(inputId, inputName) {
        var that = this
        that.data[inputId] = ''
        that.data[inputName] = ''
      },
      toPinYin(sourceField, targetField) {
        if (!this.data[targetField]) {
          const source = this.data[sourceField]
          this.data[targetField] = Object.toPinYin(source)
        }
      },
      initailSourceType(data) {
        if (data) {
          try {
            var obj = eval('(' + data + ')')
            var sourceType = obj.type
            this.datasourceData = obj
          } catch (err) {
            console.info('JSON解析出错：' + data)
          }
        }
      },
      onInputCtrlTypeChange(v) {
        this.changeFunction({
          text: '',
          value: v
        })
      },
      onFieldDataTypeChange(value) {
        var type = value
        this.fieldDataTypeChangeDone(type)
      },
      fieldDataTypeChangeDone(type) {
        var that = this
        if (type == 'regular') {
          $('#regular_div').show()
        } else {
          that.fieldVerifyRuleData.regular = ''
          that.fieldVerifyRuleData.regularTitle = ''
          $('#regular_div').hide()
        }
      },
      changeFunction(rec) {
        var that = this
        $('#optionDatasource').show()
        $('#selectorDatasource').hide()
        $('#customdialogDatasource').hide()
        $('#dataServiceDatasource').hide()
        $('#dataServiceRadio').prop('checked', false)
        $('#selectorRadio').prop('checked', false)
        $('#customdialogRadio').prop('checked', false)
        $('#format').hide()
        $('#tormatTd').hide()
        $('#optionTr').hide()
        $('#editDefaultValue').show()
        $('#defaultValueTr').show()
        $('#fieldLengthTr').show()
        $('#fieldVerifyRuleTr').show()
        $('#fieldDataTypeTr').show()
        $('#hyperlink_tr').hide()
        $('#serialnum_tr').hide()
        $('#richeditor_tr').hide()

        $('#nameOfId_tr').hide()
        $('#isColumnCount_tr').show()
        $('#option_prefix_tr').hide()

        switch (rec.value) {
          case 'hidden': {
            $('#NameOfId_tr').show()
            $('#fieldLengthTr').hide()
            $('#isColumnCount_tr').hide()
            $('#fieldDataTypeTr').hide()
            $('#fieldVerifyRuleTr').hide()
            $('#WidthTr').hide()
          }

            break
          case 'file': {
            $('#isColumnCount_tr').hide()
            $('#fieldLengthTr').hide()
            $('#fieldVerifyRuleTr').hide()
            $('#defaultValueTr').hide()
            $('#editDefaultValue').hide()
            $('#fieldDataTypeTr').hide()
            $('#WidthTr').hide()
          }

            break
          case 'richeditor':
          case 'richeditorofficial': {
            $('#richeditor_tr').show()
            $('#fieldVerifyRuleTr').hide()
            $('#editDefaultValue').hide()
            $('#isColumnCount_tr').hide()
            $('#fieldDataTypeTr').hide()
            if (that.data.width == '' || that.data.width == 0) {
              that.data.width = 0
            }
            if (that.data.height == '' || that.data.height == 0) {
              that.data.height = 300
            }
            that.data.fieldDataType = ''
            that.fieldDataTypeChangeDone('')
          }

            break
          case 'textarea': {
            $('#isColumnCount_tr').hide()
          }

            break
          case 'label': {
            $('#editDefaultValue').hide()
          }

            break
          case 'select': {
            $('#fieldLengthTr').hide()
            $('#WidthTr').hide()
            $('#fieldDataTypeTr').hide()
            $('#fieldVerifyRuleTr').hide()
            $('#optionTr').show()
            $('#dataServiceDatasource').show()
          }

            break
          case 'droptree': {
            $('#fieldLengthTr').hide()
            $('#WidthTr').hide()
            $('#fieldDataTypeTr').hide()
            $('#fieldVerifyRuleTr').hide()
            $('#optionTr').show()
            $('#optionDatasource').hide()
            $('#dataServiceDatasource').show()
          }

            break
          case 'autocompleter': {
            $('#fieldLengthTr').hide()
            $('#fieldVerifyRuleTr').hide()
            $('#fieldDataTypeTr').hide()
            $('#optionTr').show()
            $('#optionDatasource').hide()
            $('#dataServiceDatasource').show()
            that.data.datasource = 'dataService'
          }

            break
          case 'cascselect': {
            $('#fieldLengthTr').hide()
            $('#fieldVerifyRuleTr').hide()
            $('#fieldDataTypeTr').hide()

            $('#optionTr').show()

            $('#fieldLengthTr').hide()
            $('#fieldVerifyRuleTr').hide()
            $('#optionDatasource').hide()
            $('#dataServiceDatasource').show()
            that.data.datasource = 'dataService'
          }

            break
          case 'customdialog': {
            $('#fieldLengthTr').hide()
            $('#fieldVerifyRuleTr').hide()
            $('#optionTr').show()
            $('#fieldDataTypeTr').hide()
            $('#optionDatasource').hide()
            $('#selectorDatasource').hide()
            $('#customdialogDatasource').show()
            that.data.datasource = 'customdialog'
          }

            break
          case 'selector': {
            $('#fieldLengthTr').hide()
            $('#fieldVerifyRuleTr').hide()
            $('#optionTr').show()
            $('#optionDatasource').hide()
            $('#fieldDataTypeTr').hide()
            $('#selectorDatasource').show()
            that.data.datasource = 'selector'
          }

            break
          case 'radio': {
            $('#fieldLengthTr').hide()
            $('#fieldVerifyRuleTr').hide()
            $('#fieldDataTypeTr').hide()
            $('#isColumnCount_tr').hide()
            $('#optionTr').show()
            $('#dataServiceDatasource').show()
          }

            break
          case 'checkbox': {
            $('#fieldLengthTr').hide()
            $('#fieldVerifyRuleTr').hide()
            $('#fieldDataTypeTr').hide()
            $('#isColumnCount_tr').hide()
            $('#optionTr').show()
            $('#dataServiceDatasource').show()
          }

            break
          case 'datetime': {
            $('#format').show()
            $('#tormatTd').show()
            $('#isColumnCount_tr').hide()
            $('#fieldLengthTr').hide()
            $('#fieldVerifyRuleTr').hide()
            $('#fieldDataTypeTr').hide()
          }
            break
          case 'picture': {
            $('#format').hide()
            $('#tormatTd').hide()
            $('#isColumnCount_tr').hide()
            $('#fieldLengthTr').hide()
            $('#fieldVerifyRuleTr').hide()
            $('#fieldDataTypeTr').hide()
          }

            break
          case 'stamp': {
            $('#option_prefix_tr').hide()
            $('#isColumnCount_tr').hide()
            $('#fieldVerifyRuleTr').hide()
            $('#fieldDataTypeTr').hide()
            $('#fieldLengthTr').hide()
          }

            break
          case 'hyperlink': {
            $('#hyperlink_tr').show()
            $('#isColumnCount_tr').hide()
            $('#fieldVerifyRuleTr').hide()
            $('#fieldDataTypeTr').hide()
            $('#fieldLengthTr').hide()
          }

            break
          case 'serialnum': {
            $('#serialnum_tr').show()
            $('#isColumnCount_tr').hide()
            $('#fieldVerifyRuleTr').hide()
            $('#fieldDataTypeTr').hide()
            $('#fieldLengthTr').hide()
            $('#defaultValueTr').hide()
          }

            break
          case 'handsign': {
            $('#isColumnCount_tr').hide()
            $('#fieldLengthTr').hide()
            $('#fieldVerifyRuleTr').hide()
            $('#fieldDataTypeTr').hide()
          }

            break
            break
        }
      },

      saveHyperlink() {
        var that = this
        var json = that.hyperlinkData
        that.data.inputCtrlOption = JSON.stringify(json)
      },
      saveSerialNum() {
        var that = this
        var json = that.serialNumData
        that.data.inputCtrlOption = JSON.stringify(json)
      },
      saveRicheditor() {
        var that = this
        var toolbarsType = that.richeditorData.toolbarsType
        var json = {
          'toolbarsType': toolbarsType
        }
        that.data.inputCtrlOption = JSON.stringify(json)
      },

      saveText() {
        var that = this
        var regular = that.fieldVerifyRuleData.regular
        var regularTitle = that.fieldVerifyRuleData.regularTitle
        var json = {
          'regular': regular,
          'regularTitle': regularTitle
        }
        var jsonStr = JSON.stringify(json).replace(/\"/g, "'")
        that.data.fieldVerifyRule = jsonStr
      },
      saveTextarea() {
        var that = this
        var regular = that.fieldVerifyRuleData.regular
        var regularTitle = that.fieldVerifyRuleData.regularTitle
        var json = {
          'regular': regular,
          'regularTitle': regularTitle
        }
        var jsonStr = JSON.stringify(json).replace(/\"/g, "'")
        that.data.fieldVerifyRule = jsonStr
      },
      loadInputCtrlOption(ctrType, optionData) {
        var that = this
        switch (ctrType) {
          case 'stamp':
            that.loadStampOption(optionData)
            break
          case 'hyperlink':
            that.loadHyperlink(optionData)
            break
          case 'serialnum':
            that.loadSerialNum(optionData)
            break
          case 'text':
            that.loadTextOption(optionData)
          case 'textarea':
            that.loadTextareaOption(optionData)
            break
          case 'richeditor':
            that.loadRicheditor(optionData)
            break
          default:
            break
        }
      },
      loadFieldVerifyRule(ctrType, fieldVerifyRule) {
        var that = this
        switch (ctrType) {
          case 'text':
            that.loadTextOption(fieldVerifyRule)
          case 'textarea':
            that.loadTextareaOption(fieldVerifyRule)
            break
          default:
            break
        }
      },
      loadStampOption(inputCtrlOptionStr) {
        var that = this
        if (inputCtrlOptionStr) {
          var json = eval('(' + inputCtrlOptionStr + ')')
          that.stampData = json
        }
      },
      loadRicheditor(inputCtrlOptionStr) {
        var that = this
        if (inputCtrlOptionStr) {
          var json = eval('(' + inputCtrlOptionStr + ')')
          that.richeditorData = json
        }
      },
      loadHyperlink(inputCtrlOptionStr) {
        var that = this
        if (inputCtrlOptionStr) {
          var json = eval('(' + inputCtrlOptionStr + ')')
          that.hyperlinkData = json
        }
      },
      loadSerialNum(inputCtrlOptionStr) {
        console.info(inputCtrlOptionStr)
        var that = this
        if (inputCtrlOptionStr) {
          var json = eval('(' + inputCtrlOptionStr + ')')
          that.serialNumData = json
        }
      },
      loadTextOption(fieldVerifyRule) {
        var that = this
        if (fieldVerifyRule) {
          var json = eval('(' + fieldVerifyRule + ')')
          that.fieldVerifyRuleData = json
        }
      },
      loadTextareaOption(fieldVerifyRule) {
        var that = this
        if (fieldVerifyRule) {
          var json = eval('(' + fieldVerifyRule + ')')
          that.fieldVerifyRuleData = json
        }
      },
      editOption(inputId) {
        var that = this
        var typeSource
        var inputCtrlType = that.data.inputCtrlType
        var fieldTitle = that.data.fieldTitle
        // 格式{type:"sql\dic\custom\selector\customdialog",data:}
        var obj = {
          type: that.datasourceData.type,
          data: []
        }
        if (that.datasourceData.type == 'sql') {
          obj.data = ''
        }
        typeSource = obj.type
        if (!typeSource) {
          FUI.Window.showMsg2('请选择数据源类型')
          return false
        }
        var inputIdValue = that.data[inputId]
        if (inputIdValue) {
          var json = inputIdValue
          try {
            obj = eval('(' + inputIdValue + ')')
            if (typeSource != obj.type) {
              obj = {
                type: that.datasourceData.type,
                data: []
              }
              if (typeSource == 'sql') {
                obj.data = ''
              }
            }
          } catch (err) {
            console.info('JSON解析出错：' + json)
          }
        }
        var width = 680
        var height = 500
        var url = ''
        var title = '编辑【' + fieldTitle + '】选项'
        var parms = { data: obj.data }
        switch (typeSource) {
          case 'sql': {
            url = '/selector/selectTextEditor/'
            parms = {
              data: obj.data, label: 'SQL语句', isShowSysVars: true, tip: '请填写标准的Sql语句', description: '1.SQL应返回两个字段<br>' +
                '2.字段为值的列重命名为：value ，字段为文本的列重命名为：text<br>' +
                '3.可选择下拉框中的系统变量作为占位符，如：【当前登录用户ID：#CurrentUserId#】  <br>' +
                '4.示例：SELECT RealName as value,RealName as text FROM sys_Users where userId=#CurrentUserId#'
            }
          }
            break
          case 'dic':
            url = '/selector/selectDicConfigType/'
            break
          case 'custom':
            url = '/selector/keyValueEditor/?type=tv'
            width = 500
            height = 500
            break
          case 'selector':
            url = '/smartForm/getSelector/?formDefId=' + that.formDefId
            title = '【' + fieldTitle + '】设置选择器'
            break
          case 'dataService':
            var implType = inputCtrlType
            switch (inputCtrlType) {
              case 'cascselect':
                implType = 'Cascselect'
                break
              case 'select':
              case 'checkbox':
              case 'radio':
                implType = 'DropSelect'
                break
              case 'droptree':
                implType = 'Tree'
                break
              case 'autocompleter':
                implType = 'Autocompleter'
                break
              default:
                break
            }
            url = '/smartForm/getDataService/?formDefId=' + that.formDefId + '&implType=' + implType
            title = '【' + fieldTitle + '】设置选择器'
            break
          case 'customdialog':
            url = '/smartForm/getCustomDialog/?formDefId=' + that.formDefId
            title = '【' + fieldTitle + '】设置选择对话框'
            break
        }

        FUI.dialog(__webpath + '/workflow' + url, title, parms, width, height, function (dataObject, index, layer) {
          if (dataObject == false) {
            return false
          }
          var objJson = {
            type: typeSource,
            data: dataObject
          }
          that.datasourceData = objJson
          var resultStr = JSON.stringify(objJson)
          // resultStr = resultStr.replace(/\"/g, "\'");
          console.info(resultStr)
          that.data[inputId] = resultStr
          layer.close(index)
        }, true)
      },
      setFieldOptions() {
        var that = this
        var fieldTitle = that.data.fieldTitle
        FUI.Window.openEdit('/admin/codeGenerator/codeFieldOptionsEdit/?fieldId=' + keyId, '【' + fieldTitle + '】属性', 'Edit', '', 700, 480, null, null, keyId)
      },
      editDefaultValue(inputId, fieldTitle) {
        var that = this
        fieldTitle = fieldTitle || that.data.fieldTitle
        var initailValue = that.data[inputId]
        var url = __webpath + '/workflow/selector/selectTextEditor/'
        parms = {
          data: initailValue, label: '默认值', tip: '填写或选择默认值', isShowSysVars: true, description: ' 注：【从Sql取单个值】Sql的select字段只能有一个，结果只会查出第一条.' +
            '<br> 示例：  Sql:select   RealName from sys_users where realName=#CurrentRealName#  <br>Sql语句中可包含系统变量的通配符'
        }
        FUI.dialog(url, '编辑【' + fieldTitle + '】的默认值', parms, 600, 450, function (dataObject, index, layer) {
          that.data[inputId] = dataObject
          layer.close(index)
        }, true)
      },
      editMath(inputId, fieldTitle) {
        var that = this
        fieldTitle = fieldTitle || that.data.fieldTitle
        // 格式 countrule = "{rowmath:''}"
        var obj = {
          rowmath: '',
          formulaType: '',
          isCapitalAmount: '0',
          // 小数位
          digitlen: 2
        }
        var value = that.data[inputId]
        if (value != '') {
          obj = eval('(' + value + ')')
        }
        var url = __webpath + '/workflow/smartForm/mathEdit/?formDefId=' + that.formDefId
        FUI.dialog(url, '编辑【' + fieldTitle + '】的公式', obj, 750, 500, function (dataObject, index, layer) {
          that.data[inputId] = dataObject
          layer.close(index)
        }, true)
      },
      selectArticle() {
        var that = this
        var parm = {
          customDialog: 'selectHelptipArticle',
          isMulti: 0,
          width: 800,
          height: 450,
          data: [{
            property: 'ArticleCode',
            field: 'helperArticle'
          }]
        }
        CustomDialog(that, parm)
      },
      clearHelperArticle() {
        this.data.helperArticle = ''
      },
      selectSerialGenerator() {
        var that = this
        var parm = {
          customDialog: 'SerialNumberGenerator',
          isMulti: false,
          data: [{
            property: 'CounterCode',
            field: 'counterCode'
          }],
          width: 800,
          height: 450
        }
        CustomDialog(that, parm, that.serialNumData)
      }
    }
  }

  window.getFieldOptions = function () {
    return myvm.data.fieldOptions
  }

  window.saveFieldOptions = function (v) {
    console.info(v)
    return myvm.data.fieldOptions = v
  }
</script>
<style>
  .leftTdbg {
    width: 130px;
  }
</style>