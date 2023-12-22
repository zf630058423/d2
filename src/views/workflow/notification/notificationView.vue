<template>
  <div class="f2bpm-page-layout">
    <div>
      <table class="common-FormTable" cellpadding="0" cellspacing="0">
        <tr>
          <td style="width:130px">标题：</td>
          <td colspan="3">{{ data.title }}</td>
        </tr>
        <tr>
          <td>发送时间：</td>
          <td colspan="3">{{ data.createdTime }}</td>
        </tr>
        <tr style="display: none;">
          <td>发送渠道：</td>
          <td>{{ data.channelType }}</td>
          <td>消息来源：</td>
          <td>{{ data.sender }}</td>
        </tr>
        <tr>
          <td>消息内容：</td>
          <td colspan="3" style="height:200px;vertical-align: top; padding:10px;">{{ data.messageContent }}</td>
        </tr>
      </table>
      <div class="dialogfooter">
        <el-button id="btn_cancel" size="small" @click="closeEdit">
          <i class="fa fa-minus-circle" />关闭
        </el-button>
        <a role="button" href="javascript:void(0)" class="btn btn-primary btn-sm mr2 ml10" @click="setAlreadyRead(this);"><i class="fa fa-check-square-o" />标记为已读</a>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        formAction: null,
        messageId: '',
        data: {
        }
      };
    },
    created: function () {
      var that = this;
      var messageId = Object.toQueryString('messageId') || '';
      that.messageId = messageId;
      that.formAction = formAction;
      that.loadData();
    },
    methods: {
      closeEdit() {
        FUI.Window.closeEdit();
      },
      loadData() {
        var that = this;
        if (formAction != FUI.FormAction.Add) {
          var data = Object.toAjaxJson('/workflow/notification/', 'getMessageJson', { messageId: that.messageId });
          that.data = data;
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
      setAlreadyRead() {
        var that = this;
        var messageId = that.messageId;
        var param = { messageId: messageId };
        var result = Object.toAjaxJson('/workflow/notification/', 'setAlreadyRead', param);
        FUI.Window.showMsg(that, result.msg, null, 1, function () {
          FUI.Window.refreshParentGrid();
          FUI.Window.closeEdit();
        });
        return false;
      }

    }
  }
</script>