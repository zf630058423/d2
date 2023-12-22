<template>
  <div>
    <el-form ref="formRef" size="small" :rules="formRules" :model="data" class="f2bpm-editform" label-width="120px">
      <table class="common-FormTable" cellpadding="0" cellspacing="0">
        <tr>
          <td id="CommonActorSelectTitle" colspan="2" style="text-align: center; font-size: 16px; font-weight: bold; height: 40px;">任务催办</td>
        </tr>
        <tr>
          <td class="w130 leftTdbg">消息类型：<em>*</em></td>
          <td>
            <el-checkbox-group v-model="data.messageType">
              <!--<el-checkbox label="sms">短信</el-checkbox>-->
              <el-checkbox label="email">邮件</el-checkbox>
              <el-checkbox label="qyweixin">企业微信</el-checkbox>
              <el-checkbox label="syswindow">站内消息</el-checkbox>
              <el-checkbox label="im">即时通讯</el-checkbox>
            </el-checkbox-group>
          </td>
        </tr>
        <tr>
          <td class="leftTdbg">标题：<em>*</em></td>
          <td class="p5">
            <el-input id="title" v-model="data.title" size="small" style="width: 75%" />
          </td>
        </tr>
        <tr>
          <td class="leftTdbg"> 消息内容：<em>*</em></td>
          <td class="p5">提示：由于国家短信网关审核原因，不支持在此使用短信通知方式。
            <br>可用变量占位符： #SheetId#:流程单号， #Wiid#:流程实例ID，#AppId#:流程应用ID,#ActivityName#:当前节点名称，#ActivityCode#:当前节点编码
            <el-input id="content" v-model="data.content" type="textarea" :rows="4" />
          </td>
        </tr>
        <tr>
          <td class="leftTdbg">通知其他人员：</td>
          <td class="p5">
            <el-input v-model="data.notifyOtherUserRealName" placeholder="请选择其他人员" readonly="readonly" class="textAutoBoxLong75" />
            <i class="fa fa-search cur" @click="selectorUserTextValue('notifyOtherUser','notifyOtherUserRealName',null,false,'userId')">选择</i>
            <a href="javascript:void(0)" class="red" @click="clearSelectedUsers('notifyOtherUser','notifyOtherUserRealName')"><i class="fa fa-minus-circle" />清除</a>
          </td>
        </tr>
        <tr>
          <td class="leftTdbg">说明：</td>
          <td><span v-html="helperNode" /></td>
        </tr>
      </table>
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
        taskIds: '',
        helperNode: '',
        data: {
          messageType: [],
          title: '',
          messageTemplate: '',
          notifyOtherUser: '',
          notifyOtherUserRealName: ''

        },
        // stand:表单校验规则
        formRules: {
          notifyOtherUserRealName: [
            { required: true, message: '必填项不能为空' }
          ],
          messageType: [
            { required: true, message: '必填项不能为空' }
            // {validator: FUI.Validator.onlyBigEnglisthChar},
          ],
          messageTemplate: [
            { required: true, message: '必填项不能为空' }
          ]
        }
      };
    },
    created: function () {
      var that = this;
      that.language = that.$store.state.app.language;
      var taskIds = Object.toQueryString('taskIds');
      that.taskIds = taskIds;
      that.formAction = formAction;
      that.helperNode = '将会给任务处理人发送催办消息，并且同时通知其他人员';
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
        var url = FUI.Handlers.WorkflowBusinessHandler;
        var msg = '确定要催办所选的任务吗?';
        var title = that.data.title;
        var content = that.data.content;
        var notifyOtherUser = that.data.notifyOtherUser;
        var messageType = that.data.messageType;
        messageType = messageType.toString();
        if (messageType == '') {
          FUI.Window.showMsg('请选择消息类别');
          return false;
        }
        if (title == '') {
          FUI.Window.showMsg('标题不能为空');
          return false;
        }
        if (content == '') {
          FUI.Window.showMsg('消息内容不能为空');
          return false;
        }
        FUI.Window.confirm(msg, '温馨提示', function (r) {
          if (r) {
            var data = {
              'taskIds': that.taskIds,
              'content': content,
              'messageType': messageType,
              'title': title,
              'notifyOtherUser': notifyOtherUser
            };
            var result = Object.toAjaxJson(url, 'workflowInstanceTaskUrgeNotify', data);
            FUI.Window.showMsg(result.msg, null, 'info', function () {
              FUI.Window.refreshParentGrid();
              FUI.Window.closeEdit();
            });
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