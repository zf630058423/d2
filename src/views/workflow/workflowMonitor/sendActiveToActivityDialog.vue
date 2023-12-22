<template>
  <div>
    <el-form ref="formRef" :model="data" size="small" class="f2bpm-editform" label-width="120px">
      <div id="CommonActorSelectTitle" style="text-align: center; font-size: 16px; font-weight: bold; height: 40px;" v-html="actorSelectTitle" />
      <el-form-item :label="labelTitle">
        <el-select v-model="data.activityCode" filterable placeholder="请选择节点">
          <el-option v-for="item in listActivity" :label="item.activityName" :value="item.activityCode" />
        </el-select>
      </el-form-item>

      <el-form-item label="节点处理人">
        <el-input v-model="data.realNames" placeholder="请选择处理人" readonly="readonly" class="textAutoBoxLong75" />
        <i class="fa fa-search cur" @click="selectorUserString('userIds','realNames',null,false,'userId')">选择</i>
        <a href="javascript:void(0)" class="red" @click="clearSelectedUsers('userIds','realNames')"><i class="fa fa-minus-circle" />清除</a>
      </el-form-item>

      <el-form-item label="处理意见" prop="opinion">
        <el-input v-model="data.opinion" type="textarea" :rows="4" />
      </el-form-item>
      <el-form-item label="说明">
        <span id="msg">请警慎操作，对于特殊复杂流程可能会激活失败</span>
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
        wiid: '',
        sheetId: '',
        actorSelectTitle: '',
        labelTitle: '',
        typeTitle: '',
        helperNote: '',
        listActivity: [],
        data: {
          activityCode: '',
          userIds: '',
          realNames: '',
          opinion: ''
        }
      };
    },
    created: function () {
      var that = this;
      that.language = that.$store.state.app.language;
      var that = this;
      var wiid = Object.toQueryString('wiid');
      var sheetId = Object.toQueryString('sheetId');
      var titleName = '';
      that.labelTitle = '可激活到的节点';
      that.wiid = wiid;
      that.sheetId = sheetId;
      that.actorSelectTitle = '【' + sheetId + '】' + '激活到指定节点';
      var listActivity = Object.toAjaxJson(FUI.Handlers.WorkflowBusinessHandler, 'getCanSendListActivity', { wiid: wiid });
      that.listActivity = listActivity;
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
        FUI.Window.confirm(that, '您确定要提交吗？', '提示', function () {
          var activityCode = that.data.activityCode;
          var userIds = that.data.userIds;
          if (activityCode == '' || userIds == '') {
            FUI.Window.showMsg2(that, '请选择节点及处理人');
            return false;
          }
          if (that.data.opinion == '') {
            FUI.Window.showMsg(that, '请填写处理意见');
            return false;
          }
          if (userIds != '' && activityCode != '') {
            var data = { wiid: that.wiid, 'userIds': userIds, 'activityCode': activityCode, 'opinion': that.data.opinion };
            var mssg = Object.toAjaxJson(FUI.Handlers.WorkflowBusinessHandler, 'sendActiveEndActivityToActivity', data);
            var msgtype = mssg.success == true ? 1 : 7;
            FUI.Window.showMsg(that, mssg.msg, null, msgtype, function () {
              if (mssg.success) {
                FUI.Window.closeEdit(true);
              }
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