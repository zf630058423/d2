<template>
  <div class="f2bpm-page-dialog-layout">
    <el-form ref="formRef" :rules="formRules" size="small" :model="data" class="f2bpm-editform" label-width="120px">
      <el-form-item label="关系名称" prop="relTypeName">
        <el-input v-model="data.relTypeName" placeholder="直线关系名称">
          <template slot="append"><i class="fa fa-search cur" @click="selectRelationType('relTypeId', 'relTypeName', 'userRelation',null, true, false)">选择</i>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item label="直线上级" prop="toUserRealName">
        <el-input v-model="data.toUserRealName" placeholder="直线用户">
          <template slot="append"><i class="fa fa-search cur" @click="selectStrUsers('toUserRealName','toUserId',true)">选择</i>
          </template>
        </el-input>
      </el-form-item>

      <el-form-item label="直线下级" prop="fromUserIdRealNames">
        <a id="selectUsers" href="javascript:void(0)" title="选择用户" @click="selectStrUsers('fromUserIdRealNames','fromUserId',false);"><i class="fa fa-search" />选择 </a>
        </br>
        <el-input v-model="data.fromUserIdRealNames" type="textarea" :disabled="true" :rows="4" placeholder="请选择直线下级用户" />
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
        relTypeId: '',
        formAction: null,
        treeData: [],
        data: {
          relTypeName: '',
          relTypeId: '',
          toUserRealName: '',
          toUserId: '',
          fromUserId: '',
          fromUserIdRealNames: ''
        },
        // stand:表单校验规则
        formRules: {
          relTypeName: [
            { required: true, message: '必填项不能为空' }
          ],
          toUserRealName: [
            { required: true, message: '必填项不能为空' }
          ],
          fromUserIdRealNames: [
            { required: true, message: '必填项不能为空' }
          ]
        }
      }
    },
    created: function () {
      var that = this
      var relTypeId = Object.toQueryString('relTypeId')
      that.relTypeId = relTypeId
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
      },
      submitForm() {
        var that = this
        var success = that.validateForm('formRef')
        if (!success) return
        FUI.Form.submitForm(that, that.data, '/workflow/security/userRelation/', 'saveUserRelation', formAction, keyId, parentGridId, mainTable)
      },
      validateForm(refFormName) {
        // stand:表单校验
        var success = false
        this.$refs[refFormName].validate(valid => {
          success = valid
        })
        return success
      },
      selectStrUsers(inputId, hidInputId, isSingle) {
        WF.SelectorDialog.selectStrUsers(this, inputId, hidInputId, isSingle)
      }
      //选择关系类型
      , selectRelationType(inputId, inputName, infoType, passParm, singleSelect, resultKeyIsJson) {
        var that = this
        WF.SelectorDialog.selectRelationType(that, inputId, inputName, infoType, null, singleSelect, resultKeyIsJson);
      }
    }
  }
</script>