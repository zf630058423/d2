<template>
  <div class="f2bpm-page-layout rejectDialog">
    <div style="width: 100%; margin: 0;">
      <div class="wf-box">
        <div class="wf-box-in">
          <div class="wf-pop-in">
            <div style="height:30px;line-height: 30px;padding-left: 15px; font-size:12px;border-bottom: 1px solid #ddd;">
              <span class="font12">驳回后返回方式：</span>
              <el-radio-group v-model="data.rejectBackType" @change="rejectBackTypeChange" size="mini">
                <el-radio label="flowmap"><span class="font12">按流程图执行</span> </el-radio>
                <el-radio label="direct"><span class="font12">直来直往</span></el-radio>
              </el-radio-group>
              <span class="fr mr10">是否选择人<el-switch size="mini" v-model="isShowRejectRightActorList" active-color="#13ce66" inactive-color="#DCDFE6">
                </el-switch>
              </span>
            </div>
            <table>
              <tr>
                <td>
                  <div class="fl" style="font-size:12px; overflow-y: auto; background-color: #fff; border-right: 1px solid #e7e7e7; padding: 10px 15px; width: 200px; height: 200px; line-height: 24px;overflow-x:hidden;white-space:nowrap;text-overflow:ellipsis">
                    <div :key="'ActivityListContainer_'+htmlKey" class="ActivityListContainer" id="RejectActivitySelectListContainer" v-html="rejectActivitylistHtml" />
                  </div>
                </td>
                <td v-show="isShowRejectRightActorList">
                  <div :key="'RejectActorListContainer_'+htmlKey" id="RejectActorListContainer" class="ActorListContainer" style="background-color: #fff; padding: 10px 2px 2px 5px; width: 445px; height: 200px; vertical-align: top; text-align: left; overflow-y: auto" v-html="rejectUserListHtml" />
                </td>
              </tr>
            </table>
          </div>
          <div v-if="isShowRejectRightActorList" class="wf-pop-tit" style="margin-top: 2px; height: 30px;">
            <h3>总共选择了(<span id="RejectselectCount">0</span>)个处理人 <a  v-if="isShowRejectRightActorList" href="javascript:void(0)" onclick="deleteAllSelectedUser()" class="red" title=""><i class="fa fa-trash" />清空</a></h3>
          </div>

          <div v-show="isShowOpinion" id="AproOpinionDiv">
            <div class="wf-pop-tit" style="height: 35px;">
              <span>驳回意见：<em>*</em></span>
              <el-select value="" size="mini" maxlength="1000" show-word-limit style="width: 450px;" filterable placeholder="请选择常用意见" @change="aproOpinionChange">
                <el-option v-for="item in aproOpinionData" :label="item.text" :value="item.value" />
              </el-select>
            </div>
            <div class="wf-pop-in p3">
              <el-input v-model="data.hidOpinion" type="textarea" :rows="3" placeholder="请填写驳回意见" />
            </div>
          </div>
          <div id="ActorSelectedDiv" style="visibility: hidden;">
            <input id="hidSelectUsers" name="hidSelectUsers" actorselected="SelectUsers" type="hidden" value="">
            <input id="hidSelectedActivityType" name="hidSelectedActivityType" actorselected="SelectedActivityType" type="hidden" value="">
            <input id="hidSelectedActivityJson" name="hidSelectedActivityJson" actorselected="SelectedActivityJson" type="hidden" value="">
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        // url参数
        appId: '',
        wiid: '',
        taskId: '',
        formAction: null,
        // ======数据============
        wfContext: {},
        isShowOpinion: true,
        activitylistHtml: '',
        userListHtml: '',
        //是否显示右侧人员
        isShowRejectRightActorList: false,
        rejectActivitylistHtml: "",
        rejectUserListHtml: "",
        htmlKey: "1001",
        data: {
          rejectBackType: "",
          hidSelectUsers: '',
          hidSelectedActivityType: '',
          hidSelectedActivityJson: '',
          hidOpinion: '',
          // 辅助
          selectedActivity: '',
          //是否选择的是驳回到主流程
          isRejectToMain: false
        },

        aproOpinionData: [],
        sqlkeyArray: [{
          dataField: 'aproOpinionData',
          sqlkey: 'CB_ProcessOpinion_Select',
          flag: '0',
          parm: ''
        }
        ]
      };
    }, computed: {
      countGridHeight() {
        return $(document).height() - global_datagridHeightDiff;
      },
      rotateIcon() {
        return this.isCollapsed ? 'icon icon-arrow-right-bold cur' : 'icon icon-arrow-left-bold cur';
      }
    },
    watch: {
      treeFilterText(val) {
        this.$refs.mytree.filter(val);
      }
    },
    created() {
      var that = this;
      var appId = Object.toQueryString('appId') || '';
      var taskId = Object.toQueryString('taskId') || '';
      var formAction = Object.toQueryString('formAction') || '';
      var wiid = Object.toQueryString('wiid') || '';

      var parms = {};
      // 是否单选：true单选，false:多选
      var singleSelect = false;
      // 参数说明{singleSelect:false,data[{},{}]}
      var resultGridData = [];

      var parmsStr = Object.toQueryString('parms');
      var parms = {};
      if (parmsStr) {
        parmsStr = decodeURIComponent(parmsStr);
        parms = eval('(' + parmsStr + ')');
      }
      window.parms = parms;
      that.appId = appId;
      that.wiid = wiid;
      that.taskId = taskId;
      that.formAction = formAction;
      const currUser = FUI.Sys.getAuthor();

      that.sqlkeyArray[0].parm = 'opinionType:0,creatorId:' + currUser.userId;
      FUI.Form.initailSqlKeyComboBox(this);
      //表单上如果有意见，复制到本窗口
      if (that.wfContext.IsShowFormOpinion == true) {
        try {
          var theFormOpinion = window.parent.myvm.workflowformData.hidOpinion || "";
          that.data.hidOpinion = theFormOpinion;
        } catch (err) {

        }
      }
    }, mounted() {
      var that = this;
      window.myvm = this;
      that.loadActorRejectSelectData();
    },

    methods: {
      rejectBackTypeChange(v) {
        var that = this;
        that.loadActorRejectSelectData();
        that.htmlKey = v;

      }
      , loadActorRejectSelectData() {
        var that = this;
        // 加载页面Model数据
        //flowmap：按流程图执行, direct：直来直往;
        var rejectBackType = that.data.rejectBackType;
        Object.toAjaxJson('/workflow/sendActor/', 'getActorRejectSelectData',
          { appId: that.appId, wiid: that.wiid, taskId: that.taskId, formAction: that.formAction, rejectBackType: rejectBackType }
          , true, null, function (jsonData) {
            that.rejectActivitylistHtml = jsonData.rejectActivitylistHtml;
            that.rejectUserListHtml = jsonData.rejectUserListHtml;
            that.wfContext = jsonData.wfContext;
            if (that.data.rejectBackType == ""&&jsonData.defaultRejectBackType) {
              that.data.rejectBackType = jsonData.defaultRejectBackType;
            }
            setTimeout(function () {
              window.loadPageExtends();
            }, 500);
          });
      }
      , collapsedSider() {
        this.isCollapsed = !this.isCollapsed;
      },
      aproOpinionChange(v) {
        this.data.hidOpinion = this.data.hidOpinion + v;
      },
      selectorUserTextValue(inputKey, inputName, passParm, singleSelect, keyName, width, height) {
        var that = this;
        WF.SelectorDialog.selectorUserTextValue(that, inputKey, inputName, passParm, singleSelect, keyName, width, height);
      },
      getResult() {
        var that = this;
        var selectedUser = $('#hidSelectUsers').val();
        var selectedActivityType = '';
        var selectedActivity = '';
        // 格式[{"activityid":"",activityname:"","activitytype":""}]
        var selectedActivityJson = [];
        // 收集选中的节点列表
        $("#RejectActivitySelectListContainer input[levelcode='activity']:checked").each(function () {
          if (selectedActivity != '') {
            selectedActivity = selectedActivity + ',';
          }
          selectedActivity = selectedActivity + $(this).attr('activityname');

          if (selectedActivityType != '') {
            selectedActivityType = selectedActivityType + ',';
          }
          selectedActivityType = selectedActivityType + $(this).attr('activitytype');

          var item = { 'ActivityId': $(this).attr('activityid'), 'ActivityName': $(this).attr('activityname'), 'ActivityShowName': $(this).attr('activityname'), 'ActivityType': $(this).attr('activitytype') };
          selectedActivityJson.push(item);
        });
        that.data.selectedActivity = selectedActivity;
        $('#hidSelectedActivityType').val(selectedActivityType);
        if (selectedActivity == '') {
          FUI.Window.showMsg(null, '请选择要驳回的节点！');
          return false;
        }
        var activityJsonString = JSON.stringify(selectedActivityJson);
        $('#hidSelectedActivityJson').val(activityJsonString);
        if (selectedUser == '') {
          FUI.Window.showMsg(null, '请选择驳回审批人！');
          return false;
        }
        if (!onVerificationSelectUserCanSend('Reject')) {
          return false;
        }
        that.data.hidSelectUsers = $('#hidSelectUsers').val();
        that.data.hidSelectedActivityType = $('#hidSelectedActivityType').val();
        that.data.hidSelectedActivityJson = $('#hidSelectedActivityJson').val();
        that.data.isRejectToMain = that.data.selectedActivity.indexOf("[主流程]") > -1;
        return that.data;
      }
    }

  };

  window.getResult = function () {
    return myvm.getResult();
  };

  window.rejectPreChar = 'Reject';
  window.loadPageExtends = function () {

    // 左侧节点li选择
    $('#RejectActivitySelectListContainer li').each(function () {
      $(this).click(function () {
        var selectedActivityid = $(this).attr('activityid');
        showActivityActorArea(selectedActivityid, rejectPreChar);
      });
    });
    //左侧节点input选择
    $("#RejectActivitySelectListContainer input[levelcode='activity']").each(function () {
      $(this).click(function () {
        var selectedActivityid = $(this).attr('activityid');
        var selectedActivityType = $(this).attr('activitytype');
        var isUserSelectedAll = $(this).attr('isUserSelectedAll');
        var isUserRadio = $(this).attr('isUserRadio');

        showActivityActorArea(selectedActivityid, rejectPreChar);

        // 如果不为选中则去掉所有该节点下的处理人
        if (!$(this).is(':checked')) {
          checkedAndUnCheckActivityActor(selectedActivityid, false, rejectPreChar);
          onSure(rejectPreChar);
          setAcitivtyUserSelectCount(selectedActivityid, rejectPreChar);
        }
        // 当为radio单选时，在切换另一个节点时需要清除其它节点已选择的人
        if ($(this).attr('type') == 'radio') { deleteAllSelectedUser(rejectPreChar); }
        //选中右侧对应节点下的所有人
        var rightFirstCheckbox = $("input[activityid='" + selectedActivityid + "'][levelcode='activitySelectAllUser']:eq(0)", $("#RejectActorListContainer"));
        rightFirstCheckbox.click();
      });
    });
    // 右侧节点标题节点选择
    $('.RejectActivityUserAreaTitle').each(function () {
      $(this).click(function () {
        var selectedActivityid = $(this).attr('activityid');
        showActivityActorArea(selectedActivityid, rejectPreChar);
      });
    });
    // 选择部门下的所有人员与反选择
    $("#RejectActorListContainer input[levelcode='department']").each(function () {
      $(this).click(function () {
        var dpid = $(this).attr('dpid');
        var activityid = $(this).attr('activityid');
        checkedActivityDepartUsers(activityid, dpid, $(this).is(':checked'), rejectPreChar);
        if ($(this).is(':checked')) {
          checkedActivity(activityid, rejectPreChar);
        }
        onSure(rejectPreChar);
        setAcitivtyUserSelectCount(activityid, rejectPreChar);
      });
    });
    //如果只有一条分支时并且是驳回到提单时默认选中
    var nextTran = $("#RejectActivitySelectListContainer li").length;
    if (nextTran > 0) {
      var rightFirstCheckbox = $("input[activityid][levelcode='activitySelectAllUser']:eq(0)", $("#RejectActorListContainer"));
      var isRejectToStart = $("#RejectActivitySelectListContainer li:eq(0)").attr("activitycode") == "start";
      if (nextTran == 1 && isRejectToStart) {
        rightFirstCheckbox.click();

      }
    }
  }
</script>
<style lang="scss" scoped>
  @import "~@/resources/css/workflowform.css";
</style>
