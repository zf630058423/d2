<template>
  <div>
    <el-form ref="formRef" size="small" :rules="formRules" :model="data" class="f2bpm-editform" label-width="100px">
      <el-form-item label="原密码" prop="oldPassword">
        <el-input v-model="data.oldPassword" placeholder="请输入旧密码" type="password" prefix-icon="el-icon-lock"  show-password />
      </el-form-item>

      <el-form-item label="新密码" prop="newPassword">
        <el-input v-model="data.newPassword" placeholder="新密码必须含有字符、英文字母、数字至少8位" type="password" prefix-icon="el-icon-lock"  show-password  />
      </el-form-item>

      <el-form-item label="确认密码" prop="newPassword2">
        <el-input v-model="data.newPassword2" placeholder="再次输入新密码" type="password" prefix-icon="el-icon-lock"  show-password />
      </el-form-item>

      <div class="dialogfooter2">
        <el-button size="small" type="primary" @click="submitForm()"><i class="fa fa-save" />确认修改
        </el-button>
        <el-button id="btn_cancel" size="small" @click="closeEdit"><i class="fa fa-minus-circle" />取消
        </el-button>
      </div>
    </el-form>
  </div>
</template>

<script>
  import { encrypt, decrypt } from '@/utils/crypto-js.js';
  export default {
    data() {
      return {
        formAction: null,
        treeData: [],
        data: {
          userId: '',
          oldPassword: '',
          newPassword: '',
          newPassword2: ''
        },
        formRules: {
          oldPassword: [
            { required: true, message: '必填项不能为空' }
          ],
          newPassword: [
            { required: true, message: '必填项不能为空' },
            { validator: FUI.GetValidatorRule('safepass') }
          ],
          newPassword2: [
            { required: true, message: '必填项不能为空' }
          ]
        }
      };
    },
    created: function () {
      var that = this;
      that.formAction = formAction;
      var userId = Object.toQueryString('userId') || '';
      that.data.userId = userId;
    },
    methods: {
      closeEdit() {
        FUI.Window.closeEdit();
      },
      submitForm() {
        var that = this;
        if (that.data.newPassword != that.data.newPassword2) {
          FUI.Window.showMsg2(that, '两次密码不一致，请重新输入！');
          return false;
        }
        var success = that.validateForm('formRef');
        if (!success) return;
        var data = Object.toDeepClone(that.data);
        data.newPassword = encrypt(data.newPassword);
        data.oldPassword = encrypt(data.oldPassword);
        data.newPassword2 = encrypt(data.newPassword2);
        Object.toAjaxJson(FUI.Handlers.AdminHandler, 'changedPassword', data, true, null, function (res) {
          if (res.success) {
            FUI.Window.showMsg(that, '密码修改成功！', null, 1, function () {
              that.closeEdit();
            });
          } else {
            FUI.Window.showMsg(res.msg);
          }
        });
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
      updateFieldValue(fieldName, newVal) {
        var that = this;
        that.data[fieldName] = newVal;
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