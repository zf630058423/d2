<template>
  <div class="f2bpm-page-layout">
    <el-form ref="formRef" :rules="formRules" size="small" :model="data" class="f2bpm-editform" label-width="120px">
      <el-form-item label="委托环节" prop="ActivityName">
        <f2bpmui-select sqlkey="CB_ActivityNameListByAppId" :props="props" field="ActivityName" :fieldvalue="data.ActivityName" @updatevalue="updateFieldValue" />
      </el-form-item>
      <el-row>
        <el-col :span="12">
          <el-form-item label="委托开始时间" prop="StartTime">
            <el-date-picker v-model="data.StartTime" size="mini" type="datetime" class="textBoxShort" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="委托结束时间" prop="EndTime">
            <el-date-picker v-model="data.EndTime" size="mini" type="datetime" class="textBoxShort" format="yyyy-MM-dd  HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="被委托人" prop="ActivityDelegateUserRealName">
        <el-input v-model="data.ActivityDelegateUserRealName" placeholder="请选择被委托的人" class="textAutoBoxLong75" />
        <a id="selectUsers" href="javascript:void(0)" title="选择用户" @click="selectorUserTextValue('ActivityDelegateUserId','ActivityDelegateUserRealName',null,true,'userId')"><i class="fa fa-search" />选择用户</a>
      </el-form-item>
      <el-form-item label="备注">
        <el-input v-model="data.Remark" type="textarea" :rows="4" placeholder="" />
        <br>
      </el-form-item>
      <el-form-item v-show="false">
        <el-input v-model="data.ActivityDelegateUserId" placeholder="请选择被委托的人" class="textBoxShort" />
      </el-form-item>

      <div class="dialogfooter">
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
        props: null,
        treeData: [],
         data: {
          ActivityName: '',
          StartTime: null,
          EndTime: null,
          ActivityDelegateUserRealName: '',
          ActivityDelegateUserId: '',
          Remark: '',
          CreatedTime: '',
          UserId: '',
          TenantId: '',
          CreatorRealName: '',
          DelegateType: '',
          ActivityAppDelegateId: '',
          AppDelegateId: ''

        },
         formRules: {
          ActivityName: [
            { required: true, message: '必填项不能为空' }
          ],
          EndTime: [
            { required: true, message: '必填项不能为空' }
          ],
          StartTime: [
            { required: true, message: '必填项不能为空' }
          ],
          ActivityDelegateUserRealName: [
            { required: true, message: '必填项不能为空' }
          ]
        }
      }
    },
    created: function() {
      var appDelegateId = Object.toQueryString('appDelegateId')
      var appId = Object.toQueryString('appId')
      var that = this
      that.formAction = formAction
      if (formAction == FUI.FormAction.Add) {
        const currUser = FUI.Sys.getAuthor()
        that.data.AppDelegateId = appDelegateId
        that.data.CreatedTime = Object.toGetCurrentDateTimeString()
        that.data.UserId = currUser.userId
        that.data.CreatorRealName = decodeURI(currUser.realName)
        that.data.TenantId = currUser.tenantId
      }
      that.props = { 'parm': 'AppId:' + appId }
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
       selectorUserString(inputKey, inputName, passParm, singleSelect, keyName) {
        var that = this
        WF.SelectorDialog.selectorUserString(that, inputKey, inputName, passParm, singleSelect, keyName)
      },
       selectorUserTextValue(inputKey, inputName, passParm, singleSelect, keyName) {
        var that = this
        WF.SelectorDialog.selectorUserString(that, inputKey, inputName, passParm, singleSelect, keyName)
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
       updateFieldValue(fieldName, newVal) {
        var that = this
        that.data[fieldName] = newVal
      }
    }
  }
</script>
