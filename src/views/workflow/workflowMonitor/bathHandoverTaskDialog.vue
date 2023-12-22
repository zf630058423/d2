<template>
  <div>
    <el-form ref="formRef" :model="data" size="small" class="f2bpm-editform" label-width="120px">
      <div id="CommonActorSelectTitle" style="text-align: center; font-size: 16px; font-weight: bold; height: 40px;" v-html="actorSelectTitle" />

      <el-form-item label="交给处理人">
        <el-input v-model="data.realNames" placeholder="请选择处理人" readonly="readonly" class="textAutoBoxLong75" />
        <i class="fa fa-search cur" @click="selectorUserString('userIds','realNames',null,true,'userId')">选择</i>
        <a href="javascript:void(0)" class="red" @click="clearSelectedUsers('userIds','realNames')"><i class="fa fa-minus-circle" />清除</a>
      </el-form-item>

      <el-form-item label="交接原因" prop="opinion">
        <el-input v-model="data.opinion" type="textarea" :rows="4" />
      </el-form-item>
      <el-form-item label="说明">
        <span id="msg">通常是管理员干预调度，也用于人员离职时将他未处理完的任务批量交接给指定人员。</span>
      </el-form-item>
    </el-form>
    <div class="dialogfooter">
      <el-button size="small" type="primary" @click="submitForm()"><i class="fa fa-save" />确定提交
      </el-button>
      <el-button id="btn_cancel" size="small" @click="closeEdit"><i class="fa fa-minus-circle" />取消
      </el-button>
    </div>
  </div>
</template>

<script>

  export default {
    data() {
      return {
        taskIds: '',
        taskTitles: '',
        actorSelectTitle: '',
        labelTitle: '',
        typeTitle: '',
        helperNote: '',
        data: {
          userIds: '',
          realNames: '',
          opinion: ''
        }
      };
    },
    created: function () {
      var that = this;
      that.language = that.$store.state.app.language;
      var parmsStr = Object.toQueryString('parms');
      var parms = {};
      if (parmsStr) {
        parmsStr = decodeURIComponent(parmsStr);
        parms = eval('(' + parmsStr + ')');
        that.labelTitle = '可提交到的节点';
        that.taskIds = parms.taskIds;
        that.taskTitles = parms.taskTitles;
        that.actorSelectTitle = '任务批量交接';
      }
    },
    mounted() {
      window.myvm = this;
    },
    methods: {
      // ===stand:标准化方法============
      closeEdit() {
        // stand:关闭编辑窗口
        FUI.Window.closeEdit();
      },
      // ===stand:标准化方法结束============
      selectorUserString(inputKey, inputName, passParm, singleSelect, keyName) {
        var that = this;
        WF.SelectorDialog.selectorUserString(that, inputKey, inputName, passParm, singleSelect, keyName);
      },
      clearSelectedUsers(inputId, inputName) {
        var that = this;
        that.data[inputId] = '';
        that.data[inputName] = '';
      },
      submitForm() {
        var that = this;
        var targetUserId = that.data.userIds;
        var reason = that.data.opinion;
        if (targetUserId == '') {
          FUI.Window.showMsg(that, '请选择交接到用户！');
          return false;
        }
        if (reason == '') {
          FUI.Window.showMsg(that, '请填写交接原因！');
          return false;
        }
        FUI.Window.confirm(that, '您确定提交', '提示', function () {
          var data = Object.toAjaxJson(FUI.Handlers.WorkflowBusinessHandler, 'bathHandoverTask', {
            taskIds: that.taskIds,
            taskTitles: that.taskTitles,
            targetAccountUserId: targetUserId,
            reason: reason
          });
          FUI.Window.showMsg(that, data.msg, null, '', function () {
            if (data.success) { FUI.Window.closeEdit(true); }
          });
        });
      }
    }
  };
  window.getResult = function () {
    return myvm.getResult();
  }
</script>