<template>
  <div class="f2bpm-page-dialog-layout">
    <div>
      <el-form ref="formRef" :rules="formRules" size="small" :model="data" class="f2bpm-editform" label-width="120px">
        <el-form-item label="交接人" prop="FromRealName">
          <el-input v-model="data.FromRealName" style="width: 200px;" placeholder="交接人" :disabled="true" />
          <span class="fa fa-search font12 ml4 cur" @click="selectorUserString('FromUserId', 'FromRealName', null, true, 'userId')">选择</span>
        </el-form-item>
        <el-form-item label="交接到目标人" prop="ToRealName">
          <el-input v-model="data.ToRealName" style="width: 200px;" placeholder="交接到目标人" :disabled="true" />
          <span class="fa fa-search font12 ml4 cur" @click="selectorUserString('ToUserId', 'ToRealName', null, true, 'userId')">选择</span>
        </el-form-item>

        <el-form-item label="业务类型" prop="BusinessType">
          <el-select v-model="data.BusinessType">
            <el-option label="已办事项" value="doneTask" />
          </el-select>
        </el-form-item>
        <el-form-item label="交接时间" prop="HandoverTime">
          <el-date-picker v-model="data.HandoverTime" size="mini" type="datetime" class="textBoxShort" format="yyyy-MM-dd" value-format="yyyy-MM-dd" />
        </el-form-item>
        <el-form-item label="是否启用" prop="IsEnabled">
          <el-switch v-model="data.IsEnabled" :inactive-value="0" :active-value="1" active-color="#13ce66" inactive-color="#DEDEDE" />
        </el-form-item>
        <el-form-item label="交接原因" prop="HandoverReason">
          <el-input v-model="data.HandoverReason" type="textarea" :rows="4" placeholder="交接原因" />
        </el-form-item>
        <div class="dialogfooter">
          <el-button v-if="formAction!='View'" size="small" type="primary" @click="submitForm()"><i class="fa fa-save" />保存
          </el-button>
          <el-button id="btn_cancel" size="small" @click="closeEdit"><i class="fa fa-minus-circle" />取消
          </el-button>
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
          FromUserId: '',
          ToUserId: '',
          FromRealName: '',
          ToRealName: '',
          HandoverTime: '',
          BusinessType: 'doneTask',
          IsEnabled: 1,
          HandoverReason: '',
          CreatorId: '',
          CreatorRealName: '',
          Updatetor: '',
          CreatedTime: '',
          UpdateTime: '',
          TenantId: ''
        },
         formRules: {
          BusinessType: [
            { required: true, message: '必填项不能为空' }
          ],
          HandoverReason: [
            { required: true, message: '必填项不能为空' }
          ],
          FromRealName: [
            { required: true, message: '必填项不能为空' }
          ],
          ToRealName: [
            { required: true, message: '必填项不能为空' }
          ]
        }
      }
    },
    created: function() {
      var that = this
      var isOnlyMySelf = Object.toQueryString('isOnlyMySelf')
      that.isOnlyMySelf = isOnlyMySelf
      that.formAction = formAction
      if (formAction == FUI.FormAction.Add) {
        const currUser = that.$store.state.user.author
        that.data.CreatorId = currUser.userId
        that.data.CreatorRealName = decodeURI(currUser.realName)
        that.data.CreatedTime = Object.toGetCurrentDateTimeString()
        that.data.TenantId = currUser.tenantId
        if (isOnlyMySelf == true) {
          // 私人
          that.data.OpinionType = '0'
        } else {
          // 公共
          that.data.OpinionType = '1'
        }
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
      }
    }
  }
</script>
