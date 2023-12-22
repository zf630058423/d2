<template>
  <div>
    <el-form ref="formRef" size="small" :model="data" class="f2bpm-editform" label-width="120px">
      <div id="CommonActorSelectTitle" style="text-align: center; font-size: 16px; font-weight: bold; height: 40px;" v-html="actorSelectTitle" />
      <el-form-item :label="labelTitle">
        <el-select v-model="data.activityInstanceId" filterable placeholder="请选择节点">
          <el-option v-for="item in listActivity" :label="item.activityName" :value="item.activityInstanceId" />
        </el-select>
      </el-form-item>

      <el-form-item label="节点处理人">
        <el-input v-model="data.realNames" placeholder="请选择处理人" readonly="readonly" class="textAutoBoxLong75" />
        <i class="fa fa-search cur" @click="selectorUserString('userIds','realNames',null,false,'userId')">选择</i>
        <a href="javascript:void(0)" class="red" @click="clearSelectedUsers('userIds','realNames')"><i class="fa fa-minus-circle" />清除</a>
      </el-form-item>

      <el-form-item label="说明">
        <span v-html="helperNote" />
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
        type: '',
        //指定节点，非必填
        activityId: "",
        actorSelectTitle: '',
        labelTitle: '',
        typeTitle: '',
        helperNote: '',
        listActivity: [],
        data: {
          activityInstanceId: '',
          userIds: '',
          realNames: ''
        }
      };
    },
    created: function () {
      var that = this;
      that.language = that.$store.state.app.language;
      var type = Object.toQueryString('type');
      var wiid = Object.toQueryString('wiid');
      var sheetId = Object.toQueryString('sheetId');

      //非必填写，仅指定节点
      var activityId = Object.toQueryString('activityId') || "";

      var titleName = '';

      titleName = type == 'appendTask' ? '加签' : '改签';
      if (type == 'appendTask') {
        var msg = '节点加签：是指在原来的处理人基础上增加处理人';
        that.helperNote = msg;
      } else {
        var msg = '节点改签：是指节点的处理人全部改为所选择新的人员。';
        that.helperNote = msg;
      }
      that.activityId = activityId;
      that.type = type;
      that.typeTitle = titleName;
      that.labelTitle = titleName + '的节点';
      that.actorSelectTitle = '给流程单号【' + sheetId + '】' + titleName + '节点处理人';
      var listActivity = Object.toAjaxJson(FUI.Handlers.WorkflowBusinessHandler, 'getListActivityInstance', { wiid: wiid });
      that.listActivity = listActivity;
      console.info(listActivity);
      if (that.activityId) {
        $.each(listActivity, function (i, item) {
          if (item.activityId == that.activityId) {
            that.data.activityInstanceId = item.activityInstanceId;
          }
        });
      }
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
        FUI.Window.confirm(that, '您确定要' + that.typeTitle, '提示', function () {
          var aiid = that.data.activityInstanceId;
          var userIds = that.data.userIds;
          if (aiid == '' || userIds == '') {
            FUI.Window.showMsg2(that, '请选择节点及处理人');
            return false;
          }
          if (userIds != '' && aiid != '') {
            var data = { 'userIds': userIds, 'aiid': aiid, 'type': that.type };
            var mssg = Object.toAjaxJson(FUI.Handlers.WorkflowBusinessHandler, 'appendOrChangeTaskInstanceByUserIds', data);
            var msgtype = mssg.success == true ? 1 : 7;
            FUI.Window.showMsg(that, mssg.msg, null, msgtype, function () {
              if (mssg.success) { FUI.Window.closeEdit(); }
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