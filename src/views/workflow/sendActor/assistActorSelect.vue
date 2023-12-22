<template>
  <div class="f2bpm-page-layout">
    <div style="width: 100%; margin: 0;">
      <div class="wf-box">
        <div class="wf-box-in">
          <div class="wf-pop-in">
            <table>
              <tr>
                <td>
                  <div id="AssistActorListContainer" class="ActorListContainer" style="background-color: #fff; padding: 10px 2px 2px 5px; width: 670px; height: 300px; vertical-align: top; text-align: left; overflow-y: auto" v-html="assistActorHtml" />
                </td>
              </tr>
            </table>
          </div>
          <div v-show="isShowOpinion" id="AproOpinionDiv">
            <div class="wf-pop-tit" style="height: 35px;">
              <span>转办意见：<i v-if="wfContext.IsMustAddOpinion" class="red">*</i></span> 常用意见模板
              <el-select value="" size="mini" style="width: 450px;" filterable placeholder="请选择" @change="aproOpinionChange">
                <el-option v-for="item in aproOpinionData" :label="item.text" :value="item.value" />
              </el-select>
            </div>
            <div class="wf-pop-in p3">
              <el-input v-model="data.hidOpinion" maxlength="1000" show-word-limit type="textarea" :rows="3" placeholder="请填写审核意见" />
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
        // url参数
        appId: '',
        wiid: '',
        taskId: '',
        formAction: null,
        // ======数据============
        isShowOpinion: false,
        wfContext: {},
        circulatedActorHtml: '',
        data: {
          hidSelectUsers: '',
          hidOpinion: ''
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
      var taskId = Object.toQueryString('taskId') || '';
      var formAction = Object.toQueryString('formAction') || '';
      var parmsStr = Object.toQueryString('parms');
      var parms = {};
      if (parmsStr) {
        parmsStr = decodeURIComponent(parmsStr);
        parms = eval('(' + parmsStr + ')');
      }
      window.parms = parms;

      that.taskId = taskId;
      that.formAction = formAction;
      const currUser = FUI.Sys.getAuthor();

      // 加载页面Model数据
      var jsonData = Object.toAjaxJson('/workflow/sendActor/', 'getAssistActorSelectData', { taskId: taskId });
      that.wfContext = jsonData.wfContext;
      that.assistActorHtml = jsonData.assistActorHtml;
      that.isShowOpinion = !that.wfContext.IsShowFormOpinion;
      if (that.isShowOpinion) {
        that.sqlkeyArray[0].parm = 'opinionType:0,creatorId:' + currUser.userId;
        FUI.Form.initailSqlKeyComboBox(this);
      }
    }, mounted() {
      window.myvm = this;
      loadPageExtends();
      selectedFirstNextActivity();
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
      getResult() {
        var that = this;
        var selectedUser = $('#hidSelectUsers').val();
        var selectedActivityType = '';
        if (selectedUser == '') {
          FUI.layuiLayer.msg(null, '请选传阅人！');
          return false;
        }
        that.data.hidSelectUsers = $('#hidSelectUsers').val();
        return that.data;
      }
    }

  };

  window.getResult = function () {
    return myvm.getResult();
  };
  //* ****************业务方法*****************
  //* *选人方法**
  function loadPageExtends() {
    // 选择部门下的所有人员与反选择
    $("#AssistActorListContainer input[levelcode='department']").each(function () {
      $(this).click(function () {
        var dpid = $(this).attr('dpid');
        var activityid = $(this).attr('activityid');
        checkedActivityDepartUsers(activityid, dpid, $(this).is(':checked'), 'Assist');
        onSure('Assist');
        setAcitivtyUserSelectCount(activityid, 'Assist');
      });
    });
    $('.addRight3').click();
  }
</script>
<style lang="scss" scoped>
  @import "~@/resources/css/workflowform.css";
</style>