<template>
  <div>
    <el-form ref="formRef" :model="data" size="small" class="f2bpm-editform" label-width="120px">
      <div id="CommonActorSelectTitle" style="text-align: center; font-size: 16px; font-weight: bold; height: 40px;" v-html="actorSelectTitle" />
      <el-form-item label="流程单号">
        <span v-html="sheetId" />
      </el-form-item>
      <el-form-item label="核对流程信息">
        <span v-html="wfInfoMsg" />
      </el-form-item>
      <el-form-item label="提单人变更为">
        <el-input v-model="data.realNames" placeholder="请选择处理人" readonly="readonly" class="textAutoBoxLong75" />
        <i class="fa fa-search cur" @click="selectorUserString('userIds','realNames',null,true,'userId')">选择</i>
        <a href="javascript:void(0)" class="red" @click="clearSelectedUsers('userIds','realNames')"><i class="fa fa-minus-circle" />清除</a>
      </el-form-item>

      <el-form-item label="备注" prop="remarks">
        <el-input v-model="data.remarks" type="textarea" :rows="4" />
      </el-form-item>
      <div class="dialogfooter">
        <el-button size="small" type="primary" @click="submitForm()"><i class="fa fa-save" />保存
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
        wfInfoMsg: '',
        wiid: '',
        sheetId: '',
        actorSelectTitle: '',
        labelTitle: '',
        typeTitle: '',
        helperNote: '',
        listActivity: [],
        data: {
          userIds: '',
          realNames: '',
          remarks: ''
        }
      };
    },
    created: function () {
      var that = this;
      that.language = that.$store.state.app.language;
      var wiid = Object.toQueryString('wiid');
      var that = this;
      that.wiid = wiid;

      var data = Object.toAjaxJson(FUI.Handlers.WorkflowBusinessHandler, 'getProcessInstanceJsonByWiid', { 'wiid': wiid });
      var wtitle = data.workflowTitle;
      var sheetId = data.sheetId;
      that.sheetId = sheetId;
      that.actorSelectTitle = '【' + sheetId + '】' + '变更流程发起人';
      var creatorRealname = data.creatorRealName;
      var creator = data.creator;
      var msg = '【流程单号：' + sheetId + '】' + '【标题：' + wtitle + '】' + '【发起人：' + creatorRealname + '；发起人账号：' + creator + '】' + '【流程实例ID：' + data.workflowInstanceId + '】';
      that.wfInfoMsg = msg;
    },
    methods: {
      // ===stand:标准化方法============
      closeEdit() {
        // stand:关闭编辑窗口
        FUI.Window.closeEdit();
      },
      // ===stand:标准化方法结束============
      submitForm() {
        var that = this;
        var titleName = that.wfInfoMsg + '的发起人变更到==>' + that.data.realNames;
        var wiid = that.wiid;
        var userId = that.data.userIds;
        if (userId == '') {
          FUI.Window.showMsg('请选择变更用户');
          return false;
        }
        FUI.Window.confirm(that, '您确定将' + titleName, '提示', function () {
          if (wiid == '') {
            return false;
          }
          if (wiid != '') {
            var remarks = that.data.remarks;
            var type = 'meddle';
            var data = { 'wiid': wiid, 'userId': userId, 'type': type, 'remarks': remarks };
            var mssg = Object.toAjaxJson(FUI.Handlers.WorkflowBusinessHandler, 'saveChangeProcessInstanceStator', data);
            FUI.Window.showMsg(that, mssg.msg, null, mssg.success == true ? 1 : 7, function () {
              if (mssg.success) { FUI.Window.closeEdit(true); }
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
      selectorUserString(inputKey, inputName, passParm, singleSelect, keyName) {
        var that = this;
        WF.SelectorDialog.selectorUserString(that, inputKey, inputName, passParm, singleSelect, keyName);
      },
      clearSelectedUsers(inputId, inputName) {
        var that = this;
        that.data[inputId] = '';
        that.data[inputName] = '';
      }

    }
  }
</script>