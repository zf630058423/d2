<template>
  <div>
    <el-form ref="formRef" size="small" :rules="formRules" :model="data" class="f2bpm-editform" label-width="120px">
      <el-form-item label="流程单号" prop="SheetId">
        <el-input v-model="data.SheetId" placeholder="" />
      </el-form-item>
      <el-form-item label="流程实例ID" prop="ProcInstId">
        <el-input v-model="data.ProcInstId" placeholder="" />
      </el-form-item>
      <el-form-item label="变量标题" prop="VarText">
        <el-input v-model="data.VarText" placeholder="" />
      </el-form-item>
      <el-form-item label="变量名" prop="VarName">
        <el-input v-model="data.VarName" />
      </el-form-item>
      <el-form-item label="变量值" prop="VarValue">
        <el-input v-model="data.VarValue" />
      </el-form-item>
      <el-form-item label="数据类型" prop="DataType">
        <el-select v-model="data.DataType" filterable placeholder="请选择">
          <el-option v-for="item in DataTypeData" :label="item.text" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="扩展数据" prop="ExtData">
        <el-input v-model="data.ExtData" />
      </el-form-item>
      <el-form-item label="变量定义ID" prop="VarId">
        <el-input v-model="data.VarId" />
      </el-form-item>
      <el-form-item label="最近更新任务ID" prop="LastUpdateTaskId">
        <el-input v-model="data.LastUpdateTaskId" />
      </el-form-item>
      <el-form-item v-if="false" label="更新类型" prop="UpdateType">
        <el-input v-model="data.UpdateType" />
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
          ProcInstId: '',
          VarText: '',
          VarName: '',
          DataType: 'string',
          ParserPlugin: '',
          IsEnable: 1,
          CreatedTime: '',
          LastModifyTime: '',

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
          ProcInstId: [
            { required: true, message: '必填项不能为空' }
          ],
          VarValue: [
            { required: true, message: '必填项不能为空' }
          ],
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
