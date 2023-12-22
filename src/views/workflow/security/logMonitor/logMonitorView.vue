<template>
  <div class="f2bpm-page-dialog-layout">
    <el-form ref="formRef" :rules="formRules" :model="data" class="f2bpm-editform" label-width="100px">
      <el-row>
        <el-col :span="12">
          <el-form-item label="日志类型：">
            <span v-html="data.MonitorLogType" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="操作人姓名：">
            <span v-html="data.OperatorRealName" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="操作时间：">
            <span v-html="data.OperatorTime" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="记录时间：" prop="Flag">
            <span v-html="data.CreatedTime" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item label="内容">
        <el-input v-model="data.MonitorLogContent" type="textarea" :rows="10" />
      </el-form-item>
      <el-form-item label="备注">
        <el-input v-model="data.Remark" type="textarea" :rows="2" />
      </el-form-item>
      <div class="dialogfooter">
        <el-button id="btn_cancel" size="small" @click="closeEdit"><i class="fa fa-minus-circle" />关闭
        </el-button>
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
          MonitorLogType: '',
          OperatorRealName: '',
          MonitorLogContent: '',
          OperatorTime: '',
          Remark: '',
          CreatedTime: ''
        }

      }
    },
    created: function() {
      var that = this
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
      },
       toPinYin(sourceField, targetField) {
        if (!this.data[targetField]) {
          const source = this.data[sourceField]
          this.data[targetField] = Object.toPinYin(source)
        }
      }
    }
  }
</script>
