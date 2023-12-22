<template>
  <div class="f2bpm-page-layout overauto">
    <table class="common-FormTable" cellpadding="0" cellspacing="0">
      <tr id="commandType_tr" style="display: none;">
        <td class="leftTdbg">消息类型<em>*</em></td>
        <td>
          <el-select v-model="data.commandType" size="small">
            <el-option label="请选择" value="" />
            <el-option label="待办（产生本节点待办）" value="Approval" />
            <el-option label="驳回（本节点操作驳回）" value="Reject" />
            <el-option label="转办（本节点操作转办）" value="Referred" />
            <el-option label="传阅（本节点操作传阅）" value="Circulated" />
            <el-option label="作废（本节点操作作废）" value="Invalid" />
            <el-option label="撤回（本节点操作撤回）" value="Withdraw" />
          </el-select>
          <span id="helperBtn" class="icon icon_help cur ml5 font8 blue" @click="inputHelper('commandType_node')"><i class="fa fa-question-circle-o " />查看说明</span>
          <div id="commandType_node" class="font10" style="line-height:20px;display: none; ">
            【待办】是指由其他节点提交审批到达本节点所产生的待办，使用的是提交待办审批时的目标节点的消息模板。即目标节点。
            <br><span style="padding-left:45px;"> 示例说明：在A节点操作审批提交给B，使用的是B节点的消息模板。</span>
            <br>【驳回】使用的是“操作驳回”动作所在的节点模板，即当前节点。
            <br><span style="padding-left:45px;"> 示例说明：在B节点操作驳回到A节点，使用的是B节点的消息模板。</span>
            <br>【转办】使用的是“操作转办”动作所在的节点模板，即当前节点。
            <br><span style="padding-left:45px;"> 示例说明：在A节点操作了转办动作，使用的是A节点的消息模板。</span>
            <br>【传阅】使用的是“操作传阅”动作所在的节点模板，即当前节点。
            <br><span style="padding-left:45px;"> 示例说明：在A节点操作了传阅动作，使用的是A节点的消息模板。</span>
            <br>【作废】使用的是“操作作废”动作所在的节点模板，即当前节点。
            <br><span style="padding-left:45px;"> 示例说明：在A节点操作了作废动作，使用的是A节点的消息模板。并且勾选发送的“待办人”是指流程实例下所有当前待办人。</span>
            <br>【撤回】使用的是“撤回”时当前流程实例的当前节点，即当前节点。
            <br><span style="padding-left:45px;"> 示例说明：流程实例当前节点是A节点，此时操作撤回动作，使用的是A节点的消息模板。并且勾选发送的“待办人”是指流程实例下所有当前待办人。</span>
          </div>
        </td>
      </tr>
      <tr id="hour_tr">
        <td class="leftTdbg"><span v-html="typeTitle" /> </td>
        <td>
          <el-input-number v-model="data.hour" size="small" :min="0" :max="240" label="小时" />小时
        </td>
      </tr>
      <tr>
        <td class="leftTdbg">消息发送方式<em>*</em></td>
        <td>
          <el-checkbox-group v-model="data.messageType" size="small">
            <el-checkbox label="sms">短信</el-checkbox>
            <el-checkbox label="email">邮件</el-checkbox>
            <el-checkbox label="syswindow">站内消息</el-checkbox>
            <el-checkbox label="im">即时通讯</el-checkbox>
          </el-checkbox-group>
        </td>
      </tr>
      <tr>
        <td class="leftTdbg">消息标题<em>*</em></td>
        <td>
          <el-input id="title" v-model="data.title" size="small" style="width: 78%" />
          <span class="fa fa-search cur" @click="selectVar('title')">选择变量</span>
        </td>
      </tr>
      <tr>
        <td class="leftTdbg">消息内容<em>*</em></td>
        <td>
          <div class="space-4" />
          <span id="sms_tab" class="cur btn btn-white btn-minier btn-yellow" @click="msgContentTab('sms')">短信</span>
          <span id="email_tab" class="cur btn btn-white btn-minier" @click="msgContentTab('email')">邮件</span>
          <span id="syswindow_tab" class="cur btn btn-white btn-minier" @click="msgContentTab('syswindow')">站内消息</span>
          <span id="im_tab" class="cur btn btn-white btn-minier" @click="msgContentTab('im')">即时通讯</span>
          <div class="space-4" />
          <el-input v-if="currMsgType=='sms'" id="smsContent" v-model="data.smsContent" type="textarea" :rows="3" placeholder="短信消息通常要结合短信网关的要求使用变量模板，可在这里构建自己的终端发送要的数据结构格式,示例如：SheetId:#SheetId#,ActivityName:#CurrentActivityName#" />
          <el-input v-if="currMsgType=='email'" id="emailContent" v-model="data.emailContent" type="textarea" :rows="3" placeholder="邮件消息内容" />
          <el-input v-if="currMsgType=='syswindow'" id="syswindowContent" v-model="data.syswindowContent" type="textarea" :rows="3" placeholder="站内消息内容" />
          <el-input v-if="currMsgType=='im'" id="imContent" v-model="data.imContent" type="textarea" :rows="3" placeholder="即时通讯消息内容" />
          <div class="space-2" />
          <span class="fa fa-search cur" @click="selectVar()">选择变量</span>

        </td>
      </tr>
      <tr>
        <td class="leftTdbg">发送人员<em>*</em>：
        </td>
        <td style="padding-bottom: 3px;">
          <el-checkbox-group v-model="data.sendUserType" size="mini">
            <el-checkbox label="tasker">待办人</el-checkbox>
            <el-checkbox label="startor">提单人</el-checkbox>
            <el-checkbox label="targetor">指定人员</el-checkbox>
          </el-checkbox-group>
          <div class="space-4" />
          <el-input v-model="data.targetRealName" size="small" placeholder="选择发送指定人员" class="textBoxLong" readonly="readonly" />
          <div class="space-4" />
          <span class="fa fa-search cur mr4" @click="selectorUserTextValue('targetUser','targetRealName',null,false,'userId')">选择人员</span>
          <span class="fa fa-trash cur" @click="cleanInput('targetUser,targetRealName')">清除</span>
          <div class="space-4" />

          <el-input v-model="data.targetRoleName" size="small" placeholder="选择发送指定角色" class="textBoxLong" readonly="readonly" />
          <div class="space-4" />
          <span class="fa fa-search cur mr4" @click="selectorTextValue('targetRole','targetRoleName','Role')">选择角色</span>
          <span class="fa fa-trash cur" @click="cleanInput('targetRole,targetRoleName')">清除</span>
        </td>
      </tr>
      <tr>
        <td class="leftTdbg">抄送人员：</td>
        <td style="padding-bottom: 3px;">
          <el-checkbox-group v-model="data.ccUserType" size="small">
            <el-checkbox label="cctasker">待办人</el-checkbox>
            <el-checkbox label="ccstartor">提单人</el-checkbox>
            <el-checkbox label="cctargetor">指定人员</el-checkbox>
          </el-checkbox-group>
          <div class="space-4" />
          <el-input v-model="data.cctargetRealName" size="small" placeholder="选择抄送指定人员" class="textBoxLong" readonly="readonly" />
          <div class="space-4" />
          <span class="fa fa-search cur mr4" @click="selectorUserTextValue('cctargetUser','cctargetRealName',null,false,'userId')">选择人员</span>
          <span class="fa fa-trash cur" @click="cleanInput('cctargetUser,cctargetRealName')">清除</span>
          <div class="space-4" />
          <el-input v-model="data.cctargetRoleName" size="small" placeholder="选择抄送指定角色" class="textBoxLong" readonly="readonly" />
          <div class="space-4" />
          <span class="fa fa-search cur mr4" @click="selectorTextValue('cctargetRole','cctargetRoleName','Role')">选择角色</span>
          <span class="fa fa-trash cur" @click="cleanInput('cctargetRole,cctargetRoleName')">清除</span>
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        typeTitle: '',
        formAction: '',
        wid: '',
        currMsgType: 'sms',
        data: {
          formAction: '',
          type: '',
          id: '',
          commandType: '',
          hour: '1',
          messageType: [],
          title: '',
          smsContent: '',
          emailContent: '',
          syswindowContent: '',
          imContent: '',
          sendUserType: [],
          ccUserType: [],
          targetUser: '',
          targetRealName: '',
          targetRole: '',
          targetRoleName: '',
          cctargetUser: '',
          cctargetRealName: '',
          cctargetRole: '',
          cctargetRoleName: ''
        },
        formRules: {
          title: [
            { required: true, message: '必填项不能为空' }
          ],
          sendUserType: [
            { required: true, message: '必填项不能为空' }
          ],
          messageType: [
            { required: true, message: '必填项不能为空' }
          ]
        }
      };
    },
    created: function () {
      var that = this;
      // 模板类型：warning预警模板
      var type = Object.toQueryString('type');
      var formAction = Object.toQueryString('formAction');
      var wid = Object.toQueryString('wid');
      var parms = {};
      var msgType = 'sms';
      var initailData = {};

      var parmsStr = Object.toQueryString('parms');
      var parms = {};
      if (parmsStr) {
        parmsStr = decodeURIComponent(parmsStr);
        parms = eval('(' + parmsStr + ')');
      }
      initailData = parms.data || {};

      that.formAction = formAction;
      that.data.formAction = formAction;
      that.wid = wid;
      if (formAction == 'Add') {
        that.data.type = type;
        that.data.id = Object.toGuid();
      } else {
        initailData.messageType = $.isArray(initailData.messageType) ? initailData.messageType : initailData.messageType.split(',');
        initailData.sendUserType = $.isArray(initailData.sendUserType) ? initailData.sendUserType : initailData.sendUserType.split(',');
        initailData.ccUserType = $.isArray(initailData.ccUserType) ? initailData.ccUserType : initailData.ccUserType.split(',');

        initailData.targetUser = $.isArray(initailData.targetUser) ? JSON.stringify(initailData.targetUser) : initailData.targetUser;
        initailData.targetRole = $.isArray(initailData.targetRole) ? JSON.stringify(initailData.targetRole) : initailData.targetRole;
        initailData.cctargetUser = $.isArray(initailData.cctargetUser) ? JSON.stringify(initailData.cctargetUser) : initailData.cctargetUser;
        initailData.cctargetRole = $.isArray(initailData.cctargetRole) ? JSON.stringify(initailData.cctargetRole) : initailData.cctargetRole;
        that.data = initailData;
        console.info(that.data);
      }
    },
    mounted() {
      var that = this;
      if (that.data.type == 'timeOutWarning') {
        that.typeTitle = '提前';
      } else if (that.data.type == 'timeOutDealWith') {
        that.typeTitle = '超期';
      } else if (that.data.type == 'taskNotify') {
        // 任务消息
        $('#hour_tr').hide();
        $('#commandType_tr').show();
      }
      window.myvm = that;
    },
    methods: {
      closeEdit() {
        FUI.Window.closeEdit();
      },
      cleanForm() {
        var that = this;
        that.data.content = '';
        that.data.formName = '';
      },
      getResult() {
        var that = this;
        var json = Object.toClone(that.data);
        if (json.commandType == '' && json.type == 'taskNotify') {
          FUI.Window.showMsg('请选择“动作类型”');
          return false;
        }
        if (json.messageType == '') {
          FUI.Window.showMsg('请选择“消息发送方式”');
          return false;
        }
        if (json.title == '') {
          FUI.Window.showMsg('请填写“消息标题”');
          return false;
        }
        json.messageType = that.data.messageType ? that.data.messageType.toString() : '';
        json.sendUserType = that.data.sendUserType ? that.data.sendUserType.toString() : '';
        json.ccUserType = that.data.ccUserType ? that.data.ccUserType.toString() : '';

        json.targetUser = that.data.targetUser && typeof that.data.targetUser == 'string' ? eval('(' + that.data.targetUser.replace(/\"/g, "'") + ')') : that.data.targetUser;
        json.targetRole = that.data.targetRole && typeof that.data.targetRole == 'string' ? eval('(' + that.data.targetRole.replace(/\"/g, "'") + ')') : that.data.targetRole;
        json.cctargetUser = that.data.cctargetUser && typeof that.data.cctargetUser == 'string' ? eval('(' + that.data.cctargetUser.replace(/\"/g, "'") + ')') : that.data.targetRole;
        json.cctargetRole = that.data.cctargetRole && typeof that.data.cctargetRole == 'string' ? eval('(' + that.data.cctargetRole.replace(/\"/g, "'") + ')') : that.data.targetRole;
        console.info(json);
        json.formAction = formAction;
        if (json.messageType.indexOf('sms') != -1 && json.smsContent == '') {
          FUI.Window.showMsg('请填写“短信消息内容”');
          return false;
        }
        if (json.messageType.indexOf('email') != -1 && json.emailContent == '') {
          FUI.Window.showMsg('请填写“邮件消息内容”');
          return false;
        }
        if (json.messageType.indexOf('syswindow') != -1 && json.syswindowContent == '') {
          FUI.Window.showMsg('请填写“站内消息内容”');
          return false;
        }
        if (json.messageType.indexOf('im') != -1 && json.imContent == '') {
          FUI.Window.showMsg('请填写“即时通讯消息内容”');
          return false;
        }
        if (json.sendUserType == '') {
          FUI.Window.showMsg('请选择“发送人员”');
          return false;
        }
        var result = json;
        return result;
      },
      inputHelper(id) {
        let that = this;
        $("#" + id).toggle();
      }
      , msgContentTab(msgType) {
        var that = this;
        that.currMsgType = msgType;
        $('#sms_tab').removeClass('btn-yellow');
        $('#email_tab').removeClass('btn-yellow');
        $('#syswindow_tab').removeClass('btn-yellow');
        $('#im_tab').removeClass('btn-yellow');
        $('#' + msgType + '_tab').addClass('btn-yellow');
      },
      selectorUserTextValue(inputKey, inputName, passParm, singleSelect, keyName) {
        var that = this;
        WF.SelectorDialog.selectorUserTextValue(that, inputKey, inputName, passParm, singleSelect, keyName);
      },
      selectorTextValue(inputKey, inputName, type, passParm, singleSelect) {
        var that = this;
        WF.SelectorDialog.selectorTextValue(that, inputKey, inputName, type, passParm, singleSelect);
      },
      selectVar(targetId) {
        var that = this;
        var inputId = that.currMsgType + 'Content';
        if (targetId) {
          inputId = targetId;
        }
        WF.SelectorDialog.selectFormFieldProcInstContextVar(that, that.wid, null, null, inputId);
      },
      cleanInput(targetId) {
        var that = this;
        if (targetId.indexOf(',') > -1) {
          var arr = targetId.split(',');
          $.each(arr, function (i, item) {
            that.data[item] = "";
          });
        } else {
          that.data[targetId] = "";
        }
      }
    }

  };
  window.getResult = function () {
    return myvm.getResult();
  }
</script>
<style>
  .leftTdbg {
    width: 80px;
    text-align: right;
  }

  .common-FormTable td {
    padding: 5px;
  }

  .el-checkbox__label {
    font-size: 12px;
  }
</style>