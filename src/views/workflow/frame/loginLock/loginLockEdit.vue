<template>
  <div class="f2bpm-page-dialog-layout">
    <div>
      <el-form ref="formRef" :rules="formRules" size="small" :model="data" class="f2bpm-editform" label-width="120px">
        <el-form-item label="账号" prop="account">
          <el-input :disabled="isReadOnly" v-model="data.account"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <f2bpmui-radio :readOnly="isReadOnly" :field="status_def" :fieldvalue="data.status" @updatevalue="updateFieldValue" />
        </el-form-item>
        <el-form-item label="锁定时间" prop="lockTime">
          <el-date-picker :disabled="isReadOnly" v-model="data.lockTime" size="mini" type="datetime" class="textBoxShort" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" />
        </el-form-item>
        <el-form-item label="截止时间" prop="deadlineTime">
          <el-date-picker :disabled="isReadOnly" v-model="data.deadlineTime" size="mini" type="datetime" class="textBoxShort" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" />
        </el-form-item>
        <el-form-item label="锁定原因" prop="reasons">
          <el-input :disabled="isReadOnly" v-model="data.reasons"></el-input>
        </el-form-item>
        <el-form-item label="解锁人" prop="unlocker">
          <el-input :disabled="true" v-model="data.unlocker"></el-input>
        </el-form-item>
        <el-form-item label="解锁原因" prop="unlockReasons">
          <el-input :disabled="isReadOnly" v-model="data.unlockReasons"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remarks">
          <el-input :disabled="isReadOnly" v-model="data.remarks"></el-input>
        </el-form-item>
        <!--  <el-form-item label="姓名" prop="realName">
          <el-input :disabled="isReadOnly" v-model="data.realName"></el-input>
        </el-form-item> -->

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
        isReadOnly: false,
        treeData: [],
        status_def: { fieldName: 'status', fieldTitle: '状态', inputCtrlOption: { "data": [{ "orderNum": 1, "text": "已锁定", "value": 1 }, { "orderNum": 2, "text": "无效", "value": 0 }, { "orderNum": 3, "text": "解锁", "value": 2 }], "type": "custom" }, fieldOptions: null, fieldRemark: '' },
        oldStatus: 0,
        data: {
          id: "",
          account: "",
          status: "",
          lockTime: "",
          deadlineTime: "",
          reasons: "",
          unlocker: "",
          unlockReasons: "",
          remarks: "",
          realName: "",
          tenantId: ''

        },
        formRules: {
          account: [{ required: true, message: '必填项不能为空' }],
          status: [{ required: true, message: '必填项不能为空' }],
          lockTime: [{ required: true, message: '必填项不能为空' }],
          deadlineTime: [{ required: true, message: '必填项不能为空' }],

        }
      };
    },
    mounted() {
      var that = this;
      window.myvm = that;
    },
    created: function () {
      var that = this;
      that.formAction = formAction;
      if (formAction == FUI.FormAction.Add) {
        const currUser = FUI.Sys.getAuthor();
        that.data.tenantId = currUser.tenantId;
      }
      that.loadData();
    },
    methods: {
      closeEdit() {
        FUI.Window.closeEdit();
      },
      loadData() {
        var that = this;
        if (formAction != FUI.FormAction.Add) {
          FUI.Form.bindDataToForm(that, "/frame/loginLock/loginLock/", "getModel", keyId, null, mainTable);
          that.oldStatus = that.data.status;
        }
      },
      submitForm() {
        var that = this;
        var success = that.validateForm('formRef');
        if (!success) return;
        if (that.oldStatus != that.data.status && that.data.status == 2) {
          const currUser = FUI.Sys.getAuthor();
          that.data.unlocker =decodeURI(currUser.realName);
        }
        FUI.Form.submitForm(that, that.data, "/frame/loginLock/loginLock/", "saveModel", formAction, keyId, parentGridId, mainTable);
      },
      // field: 可以是字段名也可以是字段定义的对象
      updateFieldValue(field, newValue, vueDataName, subVueDataName) {
        // 更新控件值
        var that = this;
        var vueDataObj = vueDataName ? that[vueDataName] : that.data;
        if (subVueDataName) {
          vueDataObj = that[vueDataName][subVueDataName];
        }
        if (typeof field === 'string') {
          vueDataObj[field] = newValue;
        } else {
          if (field.fieldName) {
            vueDataObj[field.fieldName] = newValue;
          }
          else if (field.vModel) {
            vueDataObj[field.vModel] = newValue;
          } else if (field['field']) {
            vueDataObj[field['field']] = newValue;
          }
        }
      },
      validateForm(refFormName) {
        var success = false;
        this.$refs[refFormName].validate(valid => {
          success = valid;
        });
        return success;
      }
    }
  }
</script>