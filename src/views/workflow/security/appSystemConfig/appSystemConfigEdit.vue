<template>
  <div class="f2bpm-page-dialog-layout">
    <el-form ref="formRef" :rules="formRules" size="small" :model="data" class="f2bpm-editform" label-width="120px">
      <el-form-item label="应用名称" prop="corpName">
        <el-input v-model="data.corpName" />
      </el-form-item>
      <el-row>
        <!-- <el-col :span="12">
          <el-form-item label="令牌码" prop="token">
            <el-input v-model="data.token"></el-input>
          </el-form-item>
        </el-col> -->
        <el-col :span="24">
          <el-form-item label="状态码" prop="state">
            <el-input v-model="data.state" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="是否启用">
        <el-switch v-model="data.isEnable" active-color="#87DC48" inactive-value="0" :active-value="1" inactive-color="#DEDEDE" />
      </el-form-item>
      <el-form-item label="应用系统ID">
        <el-input v-model="data.corpId" />
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="data.remark" type="textarea" :rows="4" />
      </el-form-item>
      <div class="dialogfooter2">
        <el-button v-if="formAction!='View'" size="small" type="primary" @click="submitForm()"><i class="fa fa-save" />保存
        </el-button>
        <el-button id="btn_cancel" size="small" @click="closeEdit"><i class="fa fa-minus-circle" />取消
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
          isEnable: 1,
          state: 1,
          token:"default",
          lastUpdatorName: '',
          creatorRealName: '',
          lastUpdateTime: '',
          createdTime: '',
          corpsecret: '',
          corpId: '',
          tenantId: ''

        },
        // stand:表单校验规则
         formRules: {
          corpName: [
            { required: true, message: '必填项不能为空' }
          ],
          token: [
            { required: true, message: '必填项不能为空' },
            { validator: FUI.Validator.englisthOrNumberChar }
          ],
          state: [
            { required: true, message: '必填项不能为空' },
            { validator: FUI.Validator.englisthOrNumberChar }
          ]
        }
      }
    },
    created: function() {
      var that = this
      that.formAction = formAction
      const currUser = FUI.Sys.getAuthor()
      if (formAction == FUI.FormAction.Add) {
        that.data.creatorRealName = decodeURI(currUser.realName)
        that.data.lastUpdatorName = decodeURI(currUser.realName)
        that.data.createdTime = Object.toGetCurrentDateTimeString()
        that.data.lastUpdateTime = Object.toGetCurrentDateTimeString()
        that.data.tenantId = currUser.tenantId
      } else {
        that.data.lastUpdateTime = Object.toGetCurrentDateTimeString()
        that.data.lastUpdatorName = decodeURI(currUser.realName)
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
          var url = '/workflow/security/appSystemConfig/'
          FUI.Form.bindDataToForm(that, url, 'getModel', keyId, null, mainTable)
        }
      },
       submitForm() {
        var that = this
        var success = that.validateForm('formRef')
        if (!success) return
        var url = '/workflow/security/appSystemConfig/'
        FUI.Form.submitForm(that, that.data, url, 'save', formAction, keyId, parentGridId, mainTable)
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
