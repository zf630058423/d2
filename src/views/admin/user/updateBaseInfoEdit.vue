<template>
  <div>
    <el-form ref="formRef" size="small" :rules="formRules" :model="data" class="f2bpm-editform" label-width="120px">
      <el-row>
        <el-col :span="12">
          <el-form-item label="姓名" prop="RealName">
            <el-input v-model="data.RealName" placeholder="姓名" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="性别" prop="Sex">
            <f2bpmui-select field="Sex" configtype="性别" :fieldvalue="data.Sex" @updatevalue="updateFieldValue" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="电子邮箱" prop="Email">
            <el-input v-model="data.Email" placeholder="电子邮箱" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="手机号码" prop="Mobile">
            <el-input v-model="data.Mobile" placeholder="手机号码" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="企业微信Id" prop="WeixinId">
            <el-input v-model="data.WeixinId" placeholder="企业微信Id" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="企业微信号" prop="WeixinNo">
            <el-input v-model="data.WeixinNo" placeholder="企业微信号" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="即时通讯号" prop="QQ">
            <el-input v-model="data.QQ" placeholder="即时通讯号" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="现居住地址" prop="Address">
        <el-input v-model="data.Address" placeholder="现居住地址" />
      </el-form-item>
      <el-form-item label="备 注" prop="Remark">
        <el-input v-model="data.Remark" type="textarea" :rows="4" placeholder="备 注" />
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
          RealName: '',
          UserName: '',
          Password: '',
          OrgId: null,
          BeginTime: '',
          EndTime: '',
          Email: '',
          Mobile: '',
          WeixinId: '',
          WeixinNo: '',
          Address: '',
          Remark: '',
          QQ: '',
          Status: '1',
          Sex: '0',
          UserType: '0',
          UserId: '',
          LastModifier: '',
          LastModTime: ''
        },
        // stand:表单校验规则
         formRules: {
          RealName: [
            { required: true, message: '必填项不能为空' }
          ],
          UserName: [
            { required: true, message: '必填项不能为空' }
          ],
          BeginTime: [
            { required: true, message: '必填项不能为空' }
          ],
          EndTime: [
            { required: true, message: '必填项不能为空' }
          ],
          Sex: [
            { required: true, message: '必填项不能为空' }
          ],
          Status: [
            { required: true, message: '必填项不能为空' }
          ],
          Email: [
            { validator: FUI.GetValidatorRule('email') }
          ],
          Mobile: [
            { validator: FUI.GetValidatorRule('mobile') }
          ]
        }
      }
    },
    created: function() {
      var that = this
      that.formAction = formAction
      if (formAction == FUI.FormAction.Add) {
        const currUser = FUI.Sys.getAuthor()
        var orgId = Object.toQueryString('orgId') || null
        that.data.OrgId = orgId
        that.data.Creator = decodeURI(currUser.realName)
        that.data.LastModifier = decodeURI(currUser.realName)
        that.data.LastModTime = Object.toGetCurrentDateTimeString()
        that.data.BeginTime = Object.toGetCurrentDateTimeString()
        that.data.EndTime = '2082-01-01 00:00:00'
      }
      that.loadTreeSelect()
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
       loadTreeSelect() {
        var that = this
        var treeUrl = FUI.Handlers.OrgImplController + 'getOrgList/?needroot=true'
        Object.toAjaxJson(treeUrl, null, null, true, null, function(res) {
          if (res.success) {
            that.treeData = res.data
          } else {
            that.$message.error(
              res.msg
            )
          }
        })
      },
       submitForm() {
        var that = this
        if (that.formAction == FUI.FormAction.Add) {
          if (that.data.Password == '') {
            FUI.Window.showMsg2(that, '请填写初始密码')
            return false
          }
          if (that.data.OrgId == '' || that.data.OrgId == null) {
            FUI.Window.showMsg2(that, '请选择所属组织')
            return false
          }
        }
        var success = that.validateForm('formRef')
        if (!success) return
        FUI.Form.submitForm(that, that.data, FUI.Handlers.AdminHandler + 'user/', 'saveUser', formAction, keyId, parentGridId, mainTable, null, null, null, function(obj) {
          FUI.Window.showMsg2(that, obj.msg, null, 1, function() {
            if (obj.success) {
              window.parent.location.reload()
            }
          })
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
       updateFieldValue(fieldName, newVal) {
        var that = this
        that.data[fieldName] = newVal
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
