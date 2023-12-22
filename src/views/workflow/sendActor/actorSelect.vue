<template>
  <div class="f2bpm-page-layout">
    <div style="width: 100%; margin: 0;">
      <div class="wf-box">
        <div class="wf-box-in">
          <div class="wf-pop-in">
            <table>
              <tr>
                <td>
                  <div class="fl" style="font-size:12px; overflow-y: auto; background-color: #fff; border-right: 1px solid #e7e7e7; padding: 10px 15px; width: 200px; height: 200px; line-height: 24px;">
                    <div id="ActivitySelectListContainer" v-html="activitylistHtml" />
                  </div>

                </td>
                <td>
                  <div id="ActorListContainer" class="ActorListContainer" style="background-color: #fff; padding: 10px 2px 2px 5px; width: 470px; height: 200px; vertical-align: top; text-align: left; overflow-y: auto" v-html="userListHtml" />
                </td>
              </tr>
            </table>
          </div>

          <div class="wf-pop-tit" style="margin-top: 2px; height: 30px;padding-left: 10px;">
            <h3>{{$t('actorSelect.totalSelected')}}(<span id="selectCount">0</span>){{$t('actorSelect.userActor')}}<a href="javascript:void(0)" onclick="deleteAllSelectedUser()" class="red" title=""><i class="fa fa-trash" />{{$t('actorSelect.clearAll')}}</a></h3>
          </div>
          <div v-if="isShowOpinion" id="AproOpinionDiv">
            <div class="wf-pop-tit" style="height: 35px;padding-left: 10px;">
              <span>{{$t('actorSelect.youOpinion')}}：<i v-if="wfContext.IsMustAddOpinion" class="red">*</i></span>
              <el-select value="" size="mini" style="width: 450px;" filterable @change="aproOpinionChange">
                <el-option v-for="item in aproOpinionData" :label="item.text" :value="item.value" />
              </el-select>
            </div>
            <div class="wf-pop-in p3">
              <el-input v-model="data.hidOpinion" maxlength="1000" show-word-limit type="textarea" :rows="3" :placeholder="$t('actorSelect.fillTheOpinion')" />
            </div>
          </div>
          <div v-if="isShowCirculated" id="targetCirculatedActor-div">
            <div class="wf-pop-tit" style="height:60px;padding-left: 10px;">
              <span>{{$t('actorSelect.alsoCirculatedTo')}}：</span>
              <el-input v-model="data.targetCirculatedActorText" size="mini" style="width: 65%" placeholder="" :disabled="true" />
              <a role="button" class="btn btn-primary btn-sm mr2" @click="selectorUserTextValue('targetCirculatedActorValue','targetCirculatedActorText',false);"><i class="fa fa-search" />{{$t('select')}}</a>
              <span id="clearEmpty2" class="cur red" @click="clearSelected"><i class="fa fa-minus-circle" />{{$t('clear')}}</span>
            </div>
          </div>
          <div id="ActorSelectedDiv" style="display: none">
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
        language: "",
        // url参数
        appId: '',
        wiid: '',
        taskId: '',
        formAction: null,
        // ======数据============
        isShowCirculated: false,
        isShowOpinion: true,
        activitylistHtml: '',
        userListHtml: '',
        isOnlyTheEndActivity: false,

        transitionConditionJscript: '',
        wfContext: {},
        // 表单值数据
        wfFormData: {},
        data: {
          hidSelectUsers: '',
          hidSelectedActivityType: '',
          hidSelectedActivityJson: '',
          hidOpinion: '',

          targetCirculatedActorText: '',
          targetCirculatedActorValue: '',

          // 辅助
          selectedActivity: ''

        },

        aproOpinionData: [],
        sqlkeyArray: [{
          dataField: 'aproOpinionData',
          sqlkey: 'CB_ProcessOpinion_Select',
          flag: '1',
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
      that.language = that.$store.state.app.language;
      var appId = Object.toQueryString('appId') || '';
      var taskId = Object.toQueryString('taskId') || '';
      var formAction = Object.toQueryString('formAction') || '';
      var wiid = Object.toQueryString('wiid') || '';
      var IsOnlyTheEndActivity = false;
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
      // 上级vue对象
      var $parentVue = null;
      if (window.opener) {
        $parentVue = window.opener.window.myvm;
      } else {
        $parentVue = window.parent.myvm;
      }

      that.wfFormData = $parentVue.data;
      window.WFFormData = Object.toClone(that.wfFormData);
      window.WFFormData.approAction = $parentVue.approAction;

      var busObjectData = FUI.F2Grid.getData($parentVue);
      var jsonDataStr = busObjectData != "" && busObjectData != undefined && busObjectData != null ? JSON.stringify(busObjectData) : "";
      var approAction = $parentVue.approAction || "";
      var processVariablesJson = $parentVue.processVariablesJson || "";

      that.appId = appId;
      that.wiid = wiid;
      that.taskId = taskId;
      that.formAction = formAction;
      const currUser = FUI.Sys.getAuthor();
      var dataJsonParm = { appId: appId, wiid: wiid, taskId: taskId, formAction: formAction };
      dataJsonParm.busObjectDatas = jsonDataStr;
      dataJsonParm.approAction = approAction;
      dataJsonParm.processVariablesJson=processVariablesJson;
      // 加载页面Model数据
      var jsonData = Object.toAjaxJson('/workflow/sendActor/', 'getActorSelectData', dataJsonParm);
      if (jsonData) {
        that.activitylistHtml = jsonData.activitylistHtml;
        that.userListHtml = jsonData.userListHtml;
        that.isOnlyTheEndActivity = jsonData.isOnlyTheEndActivity;
        that.wfContext = jsonData.wfContext;
        that.transitionConditionJscript = jsonData.transitionConditionJscript;
        that.createDynamicScript(that.transitionConditionJscript);
        IsOnlyTheEndActivity = that.isOnlyTheEndActivity;
      }
      if (that.wfContext.CurrentActivityType == 'Start') {
        that.isShowCirculated = true;
      }
      if (that.wfContext.IsShowFormOpinion == true) {
        that.isShowOpinion = false;
      }  
      that.sqlkeyArray[0].parm = 'opinionType:0,creatorId:' + currUser.userId;
        FUI.Form.initailSqlKeyComboBox(that);
    },
    mounted() {
      var that = this;
      window.myvm = this;
      if (that.transitionConditionJscript) {
        // 执行JS迁移条件
        window.onExeCuteTransitionCondition();
      }
      // 最后触发
      setTimeout(function () {
        loadPageExtends();
        selectedFirstNextActivity();

      }, 800);
    },

    methods: {
      collapsedSider() {
        this.isCollapsed = !this.isCollapsed;
      },
      aproOpinionChange(v) {
        this.data.hidOpinion = this.data.hidOpinion + v;
      },
      selectorUserTextValue(inputKey, inputName, passParm, singleSelect, keyName, width, height) {
        var that = this;
        WF.SelectorDialog.selectorUserTextValue(that, inputKey, inputName, passParm, singleSelect, keyName, width, height);
      },
      clearSelected() {
        this.data.targetCirculatedActorValue = '';
        this.data.targetCirculatedActorText = '';
      },
      createDynamicScript(jsContent) {
        //console.info(jsContent);
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.text = `
          //执行JS迁移条件
          window.onExeCuteTransitionCondition = function (){
            var $targetActivity;
            var $targetActorArea;
            var $targetActivityInput;
            var $targetActorAreaUsers; 
            try {
              ${jsContent}
            }
            catch (err) {
                alert("迁移条件执行出错：" + err);
                return false;
            }
            return true;
          }`;
        document.getElementsByTagName('head')[0].appendChild(script);
      },
      getResult() {
        var that = this;
        var selectedUser = $('#hidSelectUsers').val();
        var selectedActivityType = '';
        var selectedActivity = '';
        // 格式[{"activityid":"",activityname:"","activitytype":""}]
        var selectedActivityJson = [];
        // 收集选中的节点列表
        $("#ActivitySelectListContainer input[levelcode='activity']:checked").each(function () {
          if (selectedActivity != '') {
            selectedActivity = selectedActivity + ',';
          }
          selectedActivity = selectedActivity + $(this).attr('activityshowname');
          if (selectedActivityType != '') selectedActivityType = selectedActivityType + ',';
          selectedActivityType = selectedActivityType + $(this).attr('activitytype');
          var item = { 'ActivityId': $(this).attr('activityid'), 'ActivityName': $(this).attr('activityname'), 'ActivityShowName': $(this).attr('activityshowname'), 'ActivityType': $(this).attr('activitytype') };
          selectedActivityJson.push(item);
        });
        that.data.selectedActivity = selectedActivity;
        $('#hidSelectedActivityType').val(selectedActivityType);
        if (selectedActivityType == '') {
          FUI.Window.showMsg(null, '请选择下一审批节点！');
          return false;
        }

        var activityJsonString = JSON.stringify(selectedActivityJson);
        $('#hidSelectedActivityJson').val(activityJsonString);
        if (selectedUser == '' && selectedActivityType != 'End' && selectedActivityType != 'SubWorkflowEnd') {
          FUI.Window.showMsg(null, '请选择审批人！');
          return false;
        }
        if (!onVerificationSelectUserCanSend()) {
          // 检查左侧选中多个节点时，右侧是否有选择处理人
          return false;
        }

        that.data.hidSelectUsers = $('#hidSelectUsers').val();
        that.data.hidSelectedActivityType = $('#hidSelectedActivityType').val();
        that.data.hidSelectedActivityJson = $('#hidSelectedActivityJson').val();
        return that.data;
      }
    }

  };
  window.getResult = function () {
    return myvm.getResult();
  };

  //* ****************业务方法*****************
  window.customDialogName = function (choiceLiActivity, appId, activityCode, activityId, activityName, activityType, isSingle, rejectPre, customDialogName) {
    console.info(choiceLiActivity, appId, activityCode, activityId, activityName, activityType, isSingle, rejectPre, customDialogName);


  };
  //* *选人方法**
  window.loadPageExtends = function () {
    //* *事件控制**
    // 右侧节点标题节点选择
    $('.ActivityUserAreaTitle').each(function () {
      $(this).click(function () {
        var selectedActivityid = $(this).attr('activityid');
        showActivityActorArea(selectedActivityid);
      });
    });

    // 左侧节点li选择
    $('#ActivitySelectListContainer li').each(function () {
      $(this).click(function () {
        var selectedActivityid = $(this).attr('activityid');
        showActivityActorArea(selectedActivityid);
      });
    });
    // 节点input选择
    $("#ActivitySelectListContainer input[levelcode='activity']").each(function () {
      $(this).click(function () {
        var selectedActivityid = $(this).attr('activityid');
        var selectedActivityType = $(this).attr('activitytype');
        var isUserSelectedAll = $(this).attr('isUserSelectedAll');
        var isUserRadio = $(this).attr('isUserRadio');

        showActivityActorArea(selectedActivityid);

        // 当为radio单选时，在切换另一个节点时需要清除其它节点已选择的人
        if ($(this).attr('type') == 'radio') { deleteAllSelectedUser(); }

        // 如果不为选中则去掉所有该节点下的处理人
        if (!$(this).is(':checked')) {
          checkedAndUnCheckActivityActor(selectedActivityid, false);
          onSure();
          setAcitivtyUserSelectCount(selectedActivityid);
        } else {
          if (isUserSelectedAll == 'true') {
            checkedAndUnCheckActivityActor(selectedActivityid, true);
            onSure();
            setAcitivtyUserSelectCount(selectedActivityid);
          }
        }
      });
    });
    // 选择部门下的所有人员与反选择
    $("#ActorListContainer input[levelcode='department']").each(function () {
      $(this).click(function () {
        var dpid = $(this).attr('dpid');
        var activityid = $(this).attr('activityid');
        checkedActivityDepartUsers(activityid, dpid, $(this).is(':checked'));
        if ($(this).is(':checked')) {
          checkedActivity(activityid);
        }
        onSure();
        setAcitivtyUserSelectCount(activityid);
      });
    });
  }
</script>
<style lang="scss" scoped>
  @import "~@/resources/css/workflowform.css";
</style>