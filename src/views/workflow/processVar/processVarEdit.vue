<template>
  <div>
    <el-form ref="formRef" size="small" :rules="formRules" :model="data" class="f2bpm-editform" label-width="120px">
      <el-form-item label="标签名" prop="VarText">
        <el-input v-model="data.VarText" placeholder="" @blur.native.capture="toPinYin('VarText','VarName')" />
      </el-form-item>
      <el-form-item label="变量名" prop="VarName">
        <el-input v-model="data.VarName" />
      </el-form-item>
      <el-form-item label="数据类型" prop="DataType">
        <el-select v-model="data.DataType" filterable placeholder="请选择">
          <el-option v-for="item in DataTypeData" :label="item.text" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item v-if="false" label="扩展插件" prop="ParserPlugin">
        <el-input v-model="data.ParserPlugin" />
      </el-form-item>

      <el-form-item label="是否启用">
        <el-switch v-model="data.IsEnable" active-color="#87DC48" :active-value="1" :inactive-value="0" inactive-color="#DEDEDE" />
      </el-form-item>
      <el-form-item label="备注" prop="Remark">
        <el-input v-model="data.Remark" type="textarea" :rows="4" placeholder="备注" />
      </el-form-item>
      <div class="dialogfooter2">
        <el-button v-if="formAction!='View'" size="small" type="primary" @click="submitForm()"><i class="fa fa-save" />保存</el-button>
        <el-button id="btn_cancel" size="small" @click="closeEdit"> <i class="fa fa-minus-circle" />取消</el-button>
      </div>
    </el-form>
  </div>
</template>

<script>

  export default {
    data() {
      return {
        formAction: null,
        isOnlyMySelf: 1,
        treeData: [],
         data: {
          VarText: '',
          VarName: '',
          DataType: 'string',
          ParserPlugin: '',
          IsEnable: 1,
          CreatedTime: '',
          LastModifyTime: '',
          IsMaster: '1',
          VerNo: '1',
          TenantId: ''
        },
         DataTypeData: [],
         configTypeArray: [{
          dataField: 'DataTypeData',
          configType: '基本数据类型',
          flag: ''
        }
        ],
        // stand:表单校验规则
         formRules: {
          VarText: [
            { required: true, message: '必填项不能为空' }
          ],
          DataType: [
            { required: true, message: '必填项不能为空' }
          ],
          VarName: [
            { required: true, message: '必填项不能为空' }
          ]
        }
      }
    },
    created: function() {
      var that = this
      that.formAction = formAction
      if (formAction == FUI.FormAction.Add) {
        const currUser = FUI.Sys.getAuthor()
        that.data.CreatorId = currUser.userId
        that.data.CreatedTime = Object.toGetCurrentDateTimeString()
        that.data.LastModifyTime = Object.toGetCurrentDateTimeString()
        that.data.TenantId = currUser.tenantId
      } else {
        that.data.LastModifyTime = Object.toGetCurrentDateTimeString()
      }
      FUI.Form.initailConfigTypeComboBox(this)
      that.loadData()
    },
    methods: {
      closeEdit() {
        FUI.Window.closeEdit()
      },
       loadData() {
        var that = this
        if (formAction != FUI.FormAction.Add) {
          FUI.Form.bindDataToForm(that, FUI.Handlers.FuiFrameworkHandler, FUI.Method.AutoGetViewModelMethod, keyId, null, mainTable)
        }
      },
       submitForm() {
        var that = this
        var success = that.validateForm('formRef')
        if (!success) return
        if (that.data.VarName != '' && !Object.toStartWith(that.data.VarName, 'flow_')) {
          that.data.VarName = 'flow_' + that.data.VarName
        }
        FUI.Form.submitForm(that, that.data, FUI.Handlers.FuiFrameworkHandler, FUI.Method.AutoSaveMethod, formAction, keyId, parentGridId, mainTable)
      },
       toPinYin(sourceField, targetField) {
        if (!this.data[targetField]) {
          const source = this.data[sourceField]
          this.data[targetField] = Object.toPinYin(source)
        }
      },
       validateForm(refFormName) {
        // stand:表单校验
        var success = false
        this.$refs[refFormName].validate(valid => {
          success = valid
        })
        return success
      }
    }
  }
</script>
