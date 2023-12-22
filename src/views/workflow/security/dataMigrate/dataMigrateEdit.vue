<template>
  <div class="f2bpm-page-dialog-layout">
    <div>
      <el-form ref="formRef" :rules="formRules" size="small" :model="data" class="f2bpm-editform" label-width="120px">
        <el-form-item label="流程实例标题" prop="Title">
          <el-input v-model="data.Title" placeholder="" />
        </el-form-item>
        <el-form-item label="流程应用ID" prop="AppId">
          <el-input v-model="data.AppId" placeholder="" />
        </el-form-item>
        <el-form-item label="数据库表名" prop="DbTable">
          <el-input v-model="data.AppId" placeholder="" />
        </el-form-item>
        <el-form-item label="发起人姓名" prop="LoginRealName">
          <el-input v-model="data.LoginRealName" placeholder="" />
        </el-form-item>
        <el-form-item label="发起人UserId" prop="LoginUserId">
          <el-input v-model="data.LoginUserId" placeholder="" />
        </el-form-item>

        <el-form-item label="发送到目标节点" prop="ToActivityName">
          <el-input v-model="data.ToActivityName" placeholder="" />
        </el-form-item>

        <el-form-item label="发送到节点编码" prop="ToActivityCode">
          <el-input v-model="data.ToActivityCode" placeholder="" />
        </el-form-item>

        <el-form-item label="处理人姓名" prop="ToUserIdRealName">
          <el-input v-model="data.ToUserIdRealName" placeholder="" />
        </el-form-item>
        <el-form-item label="处理人UserId" prop="ToUserId">
          <el-input v-model="data.ToUserId" placeholder="" />
        </el-form-item>
        <el-form-item label="租户号" prop="TenantId">
          <el-input v-model="data.TenantId" placeholder="" />
        </el-form-item>
        <el-form-item label="备注" prop="Remarks">
          <el-input v-model="data.Remarks" type="textarea" :rows="4" placeholder="" />
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
        loading: false,
        formAction: null,
        isOnlyMySelf: 1,
        treeData: [],
        data: {
          Id: '',
          Title: "",
          AppId: "",
          DbTable: "",
          LoginRealName: "",
          LoginUserId: "",
          ToActivityName: "",
          ToActivityCode: "",
          ToUserIdRealName: "",
          ToUserId: "",
          Extendparms: "",
          Remarks: "",
          TenantId: '',
          CreatedTime: ''
        },
        formRules: {
          Title: [
            { required: true, message: '必填项不能为空' }
          ],
          DbTable: [
            { required: true, message: '必填项不能为空' }
          ],
          LoginUserId: [
            { required: true, message: '必填项不能为空' }
          ],
          ToUserId: [
            { required: true, message: '必填项不能为空' }
          ],
          ToActivityCode: [
            { required: true, message: '必填项不能为空' }
          ],
          AppId: [
            { required: true, message: '必填项不能为空' }
          ]
        }
      };
    },

    mounted() {
    },
    created: function () {
      var that = this;
      that.formAction = formAction;
      if (formAction == FUI.FormAction.Add) {
        const currUser = that.$store.state.user.author;
        that.data.CreatedTime = Object.toGetCurrentDateTimeString();
        that.data.TenantId = currUser.tenantId;
      }
      that.loadData();
    },
    methods: {
      // ===stand:标准化方法============
      closeEdit() {
        // stand:关闭编辑窗口
        FUI.Window.closeEdit();
      },
      // ===stand:标准化方法结束============
      loadData() {
        var that = this;

        if (formAction != FUI.FormAction.Add) {
          FUI.Form.bindDataToForm(that, FUI.Handlers.FuiFrameworkHandler, FUI.Method.AutoGetViewModelMethod, keyId, null, mainTable);
        }
      },
      submitForm() {
        var that = this;
        var success = that.validateForm('formRef');
        if (!success) return;
        FUI.Form.submitForm(that, that.data, FUI.Handlers.FuiFrameworkHandler, FUI.Method.AutoSaveMethod, formAction, keyId, parentGridId, mainTable);
      },
      validateForm(refFormName) {
        // stand:表单校验
        var success = false;
        this.$refs[refFormName].validate(valid => {
          success = valid;
        });
        return success;
      },
      selectorUserString(inputKey, inputName, passParm, singleSelect, keyName) {
        var that = this;
        WF.SelectorDialog.selectorUserString(that, inputKey, inputName, passParm, singleSelect, keyName);
      },
      selectorUserTextValue(inputKey, inputName, passParm, singleSelect, keyName) {
        var that = this;
        WF.SelectorDialog.selectorUserTextValue(that, inputKey, inputName, passParm, singleSelect, keyName);
      },
      clearSelectedUsers(inputId, inputName) {
        var that = this;
        that.data[inputId] = '';
        that.data[inputName] = '';
      },
      toPinYin(sourceField, targetField) {
        if (!this.data[targetField]) {
          const source = this.data[sourceField];
          this.data[targetField] = Object.toPinYin(source);
        }
      }
    }
  }
</script>