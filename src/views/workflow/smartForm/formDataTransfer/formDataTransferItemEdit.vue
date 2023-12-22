<template>
  <div class="f2bpm-page-dialog-layout">
    <div>
      <el-form ref="formRef" :rules="formRules" size="small" :model="data" class="f2bpm-editform" label-width="120px">
        <el-form-item label="从此字段" prop="fromColId">
          <f2bpmui-select sqlkey="CB_TableColumn" :props="props2" field="fromColId" :fieldvalue="data.fromColId" @updatevalue="updateFieldValue" />
        </el-form-item>
        <el-form-item label="到目标字段" prop="toColId">
          <f2bpmui-select sqlkey="CB_TableColumn" :props="props1" field="toColId" :fieldvalue="data.toColId" @updatevalue="updateFieldValue" />
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
        fromTableId: '',
        toTableId: '',
        props1: { parm: 'TableId:' },
        props2: { parm: 'TableId:' },
        treeData: [],
        data: {
          transferId: '',
          toColId: '',
          fromColId: '',
          fromColTitle: '',
          toColTitle: '',
          tenantId: '',
          createdTime: ''
        },
        formRules: {
          toColId: [
            { required: true, message: '必填项不能为空' }
          ],
          fromColId: [
            { required: true, message: '必填项不能为空' }
          ]
        }
      };
    },
    created: function () {
      var that = this;
      var transferId = Object.toQueryString('transferId');
      that.data.transferId = transferId;
      var res = Object.toAjaxJson('/workflow/formDataTransfer/', 'getModelFormDataTransferItem', { transferId: transferId });
      console.info(res);
      if (res.success) {
        var formDataTransfer = res.data;
        that.fromTableId = formDataTransfer.fromTableId;
        that.toTableId = formDataTransfer.toTableId;
        that.props1.parm = 'TableId:' + that.toTableId;
        that.props2.parm = 'TableId:' + that.fromTableId;
      }
      that.formAction = formAction;
      if (formAction == FUI.FormAction.Add) {
        const currUser = that.$store.state.user.author;
        that.data.createdTime = Object.toGetCurrentDateTimeString();
        that.data.tenantId = currUser.tenantId;
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
        FUI.Form.submitForm(that, that.data, "/workflow/formDataTransfer/", "saveTransferItem", formAction, keyId, parentGridId, mainTable);
      },
      validateForm(refFormName) {
        // stand:表单校验
        var success = false;
        this.$refs[refFormName].validate(valid => {
          success = valid;
        });
        return success;
      },
      updateFieldValue(fieldName, newVal, itemData) {
        var that = this;
        that.data[fieldName] = newVal;
        var text = itemData.text;
        if (fieldName.indexOf('to') > -1) {
          that.data.toColTitle = text;
        } else {
          that.data.fromColTitle = text;
        }
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