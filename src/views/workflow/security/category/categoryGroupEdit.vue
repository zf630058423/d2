<template>
  <div class="f2bpm-page-dialog-layout">
    <el-form ref="formRef" size="small" :rules="formRules" :model="data" class="f2bpm-editform" label-width="120px">

      <el-form-item label="分组名" prop="Name">
        <el-input v-model="data.Name" placeholder="" @blur.native.capture="toPinYin('Name','GroupKey')" />
      </el-form-item>
      <el-form-item label="分组编码" prop="GroupKey">
        <el-input v-model="data.GroupKey" placeholder="" />
      </el-form-item>
      <el-form-item label="标识" prop="Flag">
        <el-input v-model="data.Flag" placeholder="" />
      </el-form-item>
      <el-form-item label="排序" prop="OrderNo">
        <el-input-number v-model="data.OrderNo" :min="1" :max="100000" label="排序" />
      </el-form-item>
      <el-form-item label="系统预定义">
        <el-switch v-model="data.IsSystem" active-color="#87DC48" :active-value="1" :inactive-value="0" inactive-color="#DEDEDE" />
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
        treeData: [],
         data: {
          StyleType: 'tree',
          IsSystem: 0,
          OrderNo: 100,
          TenantId: '',
          Name: '',
          GroupKey: ''
        },
        // stand:表单校验规则
         formRules: {
          Name: [
            { required: true, message: '必填项不能为空' }
          ],
          GroupKey: [
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
       toPinYin(sourceField, targetField) {
        if (!this.data[targetField]) {
          const source = this.data[sourceField]
          this.data[targetField] = Object.toPinYin(source)
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
