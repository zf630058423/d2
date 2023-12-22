<template>
  <div>
    <el-form ref="formRef" :rules="formRules" size="small" :model="data" class="f2bpm-editform" label-width="120px">
      <el-form-item label="角色名称" prop="RoleName">
        <el-input v-model="data.RoleName" placeholder="角色名称" @blur.native.capture="toPinYin('RoleName','RoleCode')" />
      </el-form-item>
      <el-form-item label="角色编码" prop="RoleCode">
        <el-input v-model="data.RoleCode" placeholder="角色编码" :disabled="formAction!='Add'" />
      </el-form-item>
      <el-form-item label="上级目录" prop="ParentId">
        <treeselect v-model="data.ParentId" :default-expand-level="3" :multiple="false" placeholder="请选择上级目录" :options="treeData" />
      </el-form-item>

      <el-form-item label="备注" prop="CommentDes">
        <el-input v-model="data.CommentDes" type="textarea" :rows="4" placeholder="备注" />
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
        treeData: [],
        data: {
          Id: "",
          RoleId: "",
          RoleName: '',
          RoleCode: '',
          RoleType: 'role',
          ParentId: null,
          CommentDes: '',
          TenantId: '',
          RoleId: '',
          Creator: '',
          LastModTime: '',
          CreatedTime: '',
          LastModifier: ''
        },
        // stand:表单校验规则
        formRules: {
          RoleName: [
            { required: true, message: '必填项不能为空' }
          ],
          ParentId: [
            { required: true, message: '必填项不能为空' }
          ],
          RoleCode: [
            { required: true, message: '必填项不能为空' },
            { validator: FUI.GetValidatorRule('englishchar3') }
          ]
        }
      };
    },
    created: function () {
      var that = this;
      that.loadTreeSelect();
      that.formAction = formAction;
      const currUser = FUI.Sys.getAuthor();
      if (formAction == FUI.FormAction.Add) {
        var parentId = Object.toQueryString('parentId') || null;
        that.data.ParentId = parentId;
        that.data.Creator = decodeURI(currUser.realName);
        that.data.LastModifier = decodeURI(currUser.realName);
        that.data.TenantId = currUser.tenantId;
        that.data.LastModTime = Object.toGetCurrentDateTimeString();
        that.data.CreatedTime = Object.toGetCurrentDateTimeString();
        that.data.RoleCode = "ROLE" + (new Date()).toDateFormat('yyyyMMddhhmmssS');
      } else {
        that.data.LastModifier = decodeURI(currUser.realName);
        that.data.LastModTime = Object.toGetCurrentDateTimeString();
      }
      that.loadData();
    },
    methods: {
      // ===stand:标准化方法============
      closeEdit() {
        // stand:关闭编辑窗口
        FUI.Window.closeEdit();
      },
      loadTreeSelect() {
        var that = this;
        var treeUrl = '/admin/role/getRoleTreeJson/?needRoot=true';
        Object.toAjaxJson(treeUrl, null, null, true, null, function (res) {
          if (res.success) {
            that.treeData = res.data;
          } else {
            that.$message.error(
              res.msg
            );
          }
        });
      },
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
        FUI.Form.submitForm(that, that.data, "/admin/role/", "saveRole", formAction, keyId, parentGridId, mainTable);
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