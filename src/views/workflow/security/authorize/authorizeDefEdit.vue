<template>
  <div class="f2bpm-page-dialog-layout">
    <div>
      <el-form ref="formRef" :rules="formRules" size="small" :model="data" class="f2bpm-editform" label-width="120px">
        <el-form-item label="标题" prop="AuthTitle">
          <el-input v-model="data.AuthTitle" placeholder="" />
        </el-form-item>

        <el-form-item label="详细描述" prop="AuthContent">
          <el-input v-model="data.AuthContent" type="textarea" :rows="4" placeholder="详细描述" />
        </el-form-item>
        <div class="dialogfooter">
          <el-button v-if="formAction!='View'" size="small" type="primary" @click="submitForm()"><i class="fa fa-save" />保存</el-button>
          <el-button id="btn_cancel" size="small" @click="closeEdit"> <i class="fa fa-minus-circle" />取消</el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>

  export default {
    data() {
      return {
        formAction: null,
        treeData: [],
         data: {
          AuthorizeType: '1',
          TenantId: '',
          CreatorId: '',
          CreatorRealName: '',
          CreatedTime: ''
        },
        // stand:表单校验规则
         formRules: {
          AuthTitle: [
            { required: true, message: '必填项不能为空' }
          ]

        }
      }
    },
    created: function() {
      var that = this
      that.formAction = formAction
      if (formAction == FUI.FormAction.Add) {
        var type = Object.toQueryString('type')
        that.data.AuthorizeType = type
        const currUser = FUI.Sys.getAuthor()
        that.data.CreatorId = currUser.userId
        that.data.CreatorRealName = decodeURI(currUser.realName)
        that.data.CreatedTime = Object.toGetCurrentDateTimeString()
        that.data.TenantId = currUser.tenantId
      }
      that.loadData()
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
          FUI.Form.bindDataToForm(that, FUI.Handlers.FuiFrameworkHandler, FUI.Method.AutoGetViewModelMethod, keyId, null, mainTable)
        }
      },
       submitForm() {
        var that = this
        var success = that.validateForm('formRef')
        if (!success) return
        FUI.Form.submitForm(that, that.data, FUI.Handlers.FuiFrameworkHandler, FUI.Method.AutoSaveMethod, formAction, keyId, parentGridId, mainTable)
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
