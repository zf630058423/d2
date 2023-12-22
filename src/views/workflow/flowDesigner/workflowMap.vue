<template>
  <div class="f2bpm-page-layout">
    <form id="form1">
      <div id="layoutDiv" style="width: 100%; overflow: hidden;">
        <div id="wftoolbar" style="padding: 3px; padding-left: 7px;height: 30px;margin-top: 5px;">
          <a onclick="approvlTimeline();return false;" style="margin-right: 2px;" title="办理过程时间线" class="btn btn-default btn-sm">
            <i class="fa fa-list" />{{$t('workflowform.approalListLineTime')}}
          </a>
          <a onclick="printTable();return false;" style="margin-right: 2px;" title="打印时请在打印机设置勾打印“选背景和图片”" class="btn btn-default btn-sm">
            <i class="fa fa-print" />{{$t('print')}}
          </a>
          <a @click="dowloadImg()" style="margin-right: 2px;" title="下载图片" class="btn btn-default btn-sm">
            <i class="fa fa-download" />{{$t('workflowMap.exportImage')}}
          </a>
          <a id="btn_mainWorkflowMap" onclick="mainWorkflowMap();return false;" style="margin-right: 2px;display: none;" title="查看主流程轨迹图”" class="btn btn-default btn-sm">
            <i class="fa fa-file-image-o" />{{$t('workflowform.mainProcMap')}}
          </a>
          <a id="cancel" role="button" onclick="FUI.Window.closeEdit();" class="btn  btn-default btn-sm mr2">
            <i class="fa fa-times" />{{$t('close')}}
          </a>
        </div>
        <div id="centerDiv" style="overflow: hidden;">
          <div id="f2bpmflow" style="float: left;" />
        </div>
      </div>
    </form>
  </div>
</template>

<script>
  window.oper = 1;
  window.isSysWorking = false;// 是否系统加载中。
  $('body').removeClass('class');
  window.appId = Object.toQueryString('appId') || '';
  window.wid = Object.toQueryString('wid') || '';
  window.wiid = Object.toQueryString('wiid') || '';
  window.mainWiid = Object.toQueryString('mainWiid') || '';
  // 是否为外部调用
  window.outer = Object.toQueryString('outer');
  window.prodessDefData = {};
  if (outer == '1') {
    $('#wftoolbar').hide();
  }
  prodessDefData = Object.toAjaxJson('/workflow/flowDesigner/', 'getWorkflowMapJson', {
    wid: wid,
    wiid: wiid,
    appId: appId
  });

  window.wfData = {};
  window.wf = prodessDefData.data.xmlToJson;
  window.wfClone = $.extend(true, {}, wf);
  window.gf = prodessDefData.data.designerJson;
  window.gfClone = $.extend(true, {}, gf);
  window.approvalRecord = prodessDefData.data.approvalRecord; // 历史审批记录
  console.info(window.gf);
  // 待候选人
  window.listActivityUserPending = prodessDefData.data.listActivityUserPending;
  window.wfTemp = {};
  window.wfNodeTemp = {};
  window.wfLineTemp = {};
  var openDesign = true;
  var designer = null;
  $(function () {
    setTimeout(function () {
      designer = F2BPM.FlowDesigner.create('f2bpmflow');
      ////画布的大小
      designer.canvasHeight=5000;
      designer.canvasWidth=8000;
      designer.designerPath = __webpath + '/static/f2bpmDesigner';
      designer.editable = false;
      designer.language = __f2bpmLanguage;
      designer.showActivityApproval = window.showActivityApproval;
      designer.showActivityOnDbClick = window.showActivityOnDbClick;
      designer.activityApprovalId = 'activityApprovalblok';
      isSysWorking = true;
      designer.loadFlowData(gf);
      isSysWorking = false;
      designer.bind();
      if (mainWiid == "" && window.approvalRecord && window.approvalRecord.length > 0 && window.approvalRecord[0].mainWorkflowInstanceId) {
        $("#btn_mainWorkflowMap").show();
      }
    }, 500);
  });

  window.showActivityOnDbClick = function (actId, x, y) {
    $('#activityApprovalblok').remove();
    $('#subWorkflowListBlok').remove();
    console.info(x);
    console.info(y);
    x = x - 200;
    y = y - 30;
    if (!approvalRecord) return false;

    var theRecord = null;
    $.each(approvalRecord, function (i, item) {
      if (item.activityId != actId) return true;
      theRecord = item;
    });
    if (!theRecord) {
      FUI.Window.showMsg2('未有子流程实例');
      return false;
    }
    var activityInstanceId = theRecord.activityInstanceId;
    var activityName = theRecord.activityName;
    // 通过ActivityInstanceId换回此节点实例所产生的流程实例,会存多批次
    var res = Object.toAjaxJson('/workflow/flowDesigner/', 'getSubWiidByAiid', { aiid: activityInstanceId });
    if (res.success) {
      console.info(res.data);
      if (res.data.length == 1) {
        var wiid = res.data[0].workflowInstanceId;
        window.openSubWorkflowMap(wiid, activityName);
      } else {
        var divHtml = "<div id=\"subWorkflowListBlok\" cellpadding=\"0\" cellspacing=\"0\" style='background:#fff;left:" + x + 'px;top:' + y + "px;'  class='subWorkflowListblok'>";
        var tableHtml = "<table  class='common-table'  style='background:#fff;' cellpadding=\"0\" cellspacing=\"0\">";
        tableHtml += '<tr>';
        tableHtml += '<th style="width:140px">' + window.lang_sheetId + '</th>';
        tableHtml += '<th style="width:200px">' + window.lang_procTitle + '</th>';
        tableHtml += '<th style="width:120px">' + window.lang_currentActivityName + '</th>';
        tableHtml += '<th>' + window.lang_startTime + '</th>';
        tableHtml += '<th>' + window.lang_finishedTime + '</th>';
        tableHtml += '<th>' + window.lang_procName + '</th>';
        tableHtml += '<th>' + window.lang_workflowState + '</th>';
        tableHtml += '</tr>';
        $.each(res.data, function (i, item) {
          item.finishedTime = item.finishedTime || "";
          tableHtml += '<tr>';
          tableHtml += '<td class="blue cur" onclick="openSubWorkflowMap(\'' + item.workflowInstanceId + '\',\'' + activityName + '\')">' + item.sheetId + '</td>';
          tableHtml += '<td>' + item.workflowTitle + '</td>';
          tableHtml += '<td>' + item.currentActivityName + '</td>';
          tableHtml += '<td>' + item.startedTime + '</td>';
          tableHtml += '<td>' + item.finishedTime + '</td>';
          tableHtml += '<td>' + item.workflowName + '</td>';
          tableHtml += '<td>' + getWorkflowStatusFormatter(item) + '</td>';
          tableHtml += '<tr>';
        });
        tableHtml += '<tr>';
        tableHtml += '<td>' + window.lang_subProcInstanceTotal + '：</td>';
        tableHtml += "<td>" + res.data.length + "</td>";
        tableHtml += '<td  colspan="3"> </td>';
        tableHtml += '<td colspan="2"><span onclick="closeSubWorkflowListBlok()" class=" btn btn-sm btn-default fa fa-minus-circle"> 关闭<span></td>';
        tableHtml += '</tr>';
        tableHtml += '</table>';
        divHtml += tableHtml;
        divHtml += '</div>';
        designer.drawingBoardInner.append(divHtml);
      }

    } else {
      FUI.Window.showMsg(res.msg);
    }
  };
  window.closeSubWorkflowListBlok = function () {
    $('#subWorkflowListBlok').remove();
  };
  window.openSubWorkflowMap = function (wiid, activityName) {
    var mainWiid = window.wiid;
    FUI.Window.openEdit('/workflow/flowDesigner/workflowMap?mainWiid=' + mainWiid + '&wiid=' + wiid, '【' + activityName + '】子流程', null, '', 780, 360, null, null, null, true);
  };
  window.mainWorkflowMap = function () {
    if (window.approvalRecord && window.approvalRecord.length > 0 && window.approvalRecord[0].mainWorkflowInstanceId) {
      var wiid = window.approvalRecord[0].mainWorkflowInstanceId;
      FUI.Window.openEdit('/workflow/flowDesigner/workflowMap?wiid=' + wiid, '主流程图', null, '', 780, 360, null, null, null, true);
    }
  };
  window.showActivityApproval = function (actId, x, y) {
    $('#activityApprovalblok').remove();
    if (!approvalRecord) return false;
    var divHtml = "<div id=\"activityApprovalblok\" cellpadding=\"0\" cellspacing=\"0\" style='background:#fff;left:" + x + 'px;top:' + y + "px;'  class='activityApprovalblok'>";
    var divMsgHtml = "<div id=\"activityApprovalblokInner\" cellpadding=\"0\" cellspacing=\"0\" style='width:auto;background:#fff;left:" + x + 'px;top:' + y + "px;' class='activityApprovalblok' >";
    var approvalHtml = '';
    approvalHtml += "<table  class='common-table'  style='background:#fff;' cellpadding=\"0\" cellspacing=\"0\">";
    approvalHtml += '<tr>';
    approvalHtml += '<th class="w100">' + window.lang_activityName + '</th>';
    approvalHtml += '<th class="w100">' + window.lang_realName + '</th>';
    approvalHtml += '<th class="w100">' + window.lang_userDpName + '</th>';
    approvalHtml += '<th class="w120">' + window.lang_createdTime + '</th>';
    approvalHtml += '<th class="w120">' + window.lang_completedTime + '</th>';
    approvalHtml += '<th class="w100">' + window.lang_taskState + '</th>';
    // approvalHtml+="<th>审核菜单</th>";
    approvalHtml += '<th class="w150">' + window.lang_opinion + '</th>';
    approvalHtml += '</tr>';
    var isExist = false;
    var completedType = '';
    $.each(approvalRecord, function (i, item) {
      if (item.activityId != actId) return true;
      isExist = true;
      var completedTime = item.completedTime || '';
      if (completedTime) {
        completedTime = Object.toJsonDateTimeFormatter(completedTime);
      }
      var createdTime = Object.toJsonDateTimeFormatter(item.createdTime);
      var taskName = '';
      completedType = item.completedType;
      switch (item.taskState) {
        case 0:
          taskName = window.lang_unread;
          break;
        case 1:
          taskName = window.lang_readed;
          break;
        case 3:
          taskName = window.lang_taskclaim;
          break;
        case 2:
          taskName = window.lang_completed;
          break;
        case 66:
          taskName = window.lang_inCommunication;
          break;
        default:
          taskName = window.unknown;
          break;
      }

      var opinion = '';
      switch (item.completedType) {
        case 'Invalid':
          opinion = '<em>【流程作废】</em>';
          break;
        case 'Activation':
          opinion = '<em>【流程重新激活】</em>';
          break;
        case 'Reject':
        case 'RejectDirect':
          opinion = '<em>【驳回】</em>';
          break;
        case 'RejectMainWorkflow':
          opinion = '<em>【驳回】</em>';
          break;
        case 'Referred':
          opinion = '<em>【转办】</em>';
          break;
        case 'AutoApproval':
          opinion = '<em>【自动通过】</em>';
          break;
        case 'TaskCommunication':
          opinion = '<em>【被沟通】</em>';
          break;
      }
      if (!item.completedType && item.taskCreateType == 'TaskCommunication') {
        opinion = '<em>【被沟通】</em>';
      }
      if (item.approAction) {
        opinion += '【' + item.approAction + '】';
      }
      opinion += item.opinion || "";
      var approAction = item.approAction || '';
      approvalHtml += '<tr>';
      approvalHtml += '<td>' + item.activityName + '</td>';
      var deledateActor = item.delegatorRealName;
      var isDelegatorCompleted = item.isDelegatorCompleted;
      var realName = Object.toProcSecrecy(item.realName);
      if (deledateActor && isDelegatorCompleted) {
        deledateActor = Object.toProcSecrecy(deledateActor);
        realName = realName + '<em>[' + deledateActor + ']代</em>';
      }
      approvalHtml += '<td>' + realName + '</td>';
      approvalHtml += '<td>' + item.userDpName + '</td>';
      approvalHtml += '<td>' + createdTime + '</td>';
      approvalHtml += '<td>' + completedTime + '</td>';
      approvalHtml += '<td >' + taskName + '</td>';
      //                   approvalHtml+="<td >"+approAction+"</td>";
      approvalHtml += '<td >' + opinion + '</td>';
      approvalHtml += '</tr>';
    });
    approvalHtml += '</table>';

    if (isExist && completedType != 'SubWorkflow') {
      // 找到有审批任务
      divHtml += approvalHtml;
    } else if (completedType == 'SubWorkflow') {
      divHtml = divMsgHtml;
      divHtml += "<em class='p10 msg'>" + window.lang_doubleClickViewSubflow + "</em>";
    } else {
      // 找不到时从待候选人中取
      var pendingAct = null;
      $.each(listActivityUserPending, function (_i, act) {
        if (act.activityId == actId) {
          divHtml += "<table  class='common-FormTable user-pending'>";
          divHtml += "<tr><th>" + window.lang_status + "：</th><td class='red fb'>" + window.lang_noneTask + "</td></tr>";
          divHtml += "<tr><th>" + window.lang_candidate + "：</th><td>" + act.todoActor + "</td></tr>";
          divHtml += "<tr><th>" + window.lang_note + "：</th><td><i class='fa fa-question-circle'></i> " + window.lang_nodeContent + "</td></tr>";
          divHtml += '</table> ';
          pendingAct = act;
        }
      });
      if (pendingAct == null) {
        divHtml += "<em class='p10 msg'>" + window.lang_noneTask + "</em>";
      }
    }
    divHtml += '</div>';
    designer.drawingBoardInner.append(divHtml);
    if (!isExist) {
      $('#activityApprovalblok').width(180);
    }
  };
  $(function () {
    var flowName = wf.ProcessDef.WorkflowName;
    this.title = flowName;
    var isMobile = Object.toQueryString('isMobile');
    var isouter = Object.toQueryString('outer');
    if (isMobile == 1) {
      $('#f2bpmflow_4').width(1500);
      $('#f2bpmflow_4').height(1500);
      $('#wftoolbar').hide();
    }
    if (isouter == 1) {
      $('#wftoolbar').hide();
    }
    $(window).resize(function () {
      var height = $(window).height() - 60;
      var width = $(window).width() - 20;
      designer.reinitDrawingSize(width, height);
    });
    setTimeout(function () {
      $("g[brand='F2BPM Copyright']").hide();
    }, 8000);
  });

  window.printTable = function () {
    $('#wftoolbar').hide();
    var tem = $('.f2bpm_drawing_board_inner').css('background-image');
    $('.f2bpm_drawing_board_inner').css('background-image', "url('')");
    var tem2 = $('.f2bpm_drawing_board').css('background-image');
    $('.f2bpm_drawing_board').css('background-image', "url('')");
    print();
    $('#wftoolbar').show();
    $('.f2bpm_drawing_board_inner').css('background-image', tem);
    $('.f2bpm_drawing_board').css('background-image', tem2);
  };
  window.approvlTimeline = function () {
    var url = __webpath + '/workflow/flowDesigner/workflowMapTimeline?appId=' + appId + '&wid=' + wid + '&wiid=' + wiid;
    window.location.href = url;
  };
  $(function () {
    var isMobile = Object.toQueryString('isMobile');
    var isouter = Object.toQueryString('outer');
    if (isMobile == 1) {
      $('#f2bpmflow_4').width(1500);
      $('#f2bpmflow_4').height(1500);
      $('#wftoolbar').hide();
    }
    if (isouter == 1) {
      $('#wftoolbar').hide();
    }
    $(window).resize(function () {
      height = $(window).height() - 60;
      width = $(window).width() - 20;
      designer.reinitDrawingSize(width, height);
    });
    setTimeout(function () {
      $("g[brand='F2BPM Copyright']").hide();
    }, 8000);
  });

  import html2canvas from 'html2canvas';
  export default {
    data() {
      return {
        language: ""
      };
    }
    , created: function () {
      var that = this;
      window.myvm = that;
      that.language = that.$store.state.app.language;
      window.lang_sheetId = that.$t("workflowMap.sheetId");

      window.lang_status = that.$t("workflowMap.status");
      window.lang_noneTask = that.$t("workflowMap.noneTask");
      window.lang_candidate = that.$t("workflowMap.candidate");
      window.lang_note = that.$t("workflowMap.note");
      window.lang_nodeContent = that.$t("workflowMap.nodeContent");

      window.lang_showProcMap = that.$t("workflowMap.showProcMap");
      window.lang_activityName = that.$t("workflowMap.activityName");
      window.lang_realName = that.$t("workflowMap.realName");
      window.lang_userDpName = that.$t("workflowMap.userDpName");
      window.lang_createdTime = that.$t("workflowMap.createdTime");
      window.lang_completedTime = that.$t("workflowMap.completedTime");
      window.lang_taskState = that.$t("workflowMap.taskState");
      window.lang_opinion = that.$t("workflowMap.opinion");


      window.lang_sheetId = that.$t("workflowMap.sheetId");
      window.lang_procName = that.$t("workflowMap.procName");
      window.lang_procTitle = that.$t("workflowMap.procTitle");
      window.lang_currentActivityName = that.$t("workflowMap.currentActivityName");
      window.lang_startTime = that.$t("workflowMap.startTime");
      window.lang_finishedTime = that.$t("workflowMap.finishedTime");
      window.lang_workflowState = that.$t("workflowMap.workflowState");
      window.lang_subProcInstanceTotal = that.$t("workflowMap.subProcInstanceTotal");
      window.lang_doubleClickViewSubflow = that.$t("workflowMap.doubleClickViewSubflow");


      window.lang_unread = that.$t("taskState.unread");
      window.lang_readed = that.$t("taskState.readed");
      window.lang_completed = that.$t("taskState.completed");
      window.lang_taskclaim = that.$t("taskState.taskclaim");
      window.lang_inCommunication = that.$t("taskState.inCommunication");



    }
    , mounted: function () {

    }
    , methods: {
      dowloadImg() {
        html2canvas(document.querySelector(".f2bpm_drawing_board_inner"), { backgroundColor: '#49586e' }).then(canvas => {
          const canvasData = canvas.toDataURL("image/jpeg");
          console.info(canvasData);
          Object.toFileDownload(canvasData, wf.ProcessDef.WorkflowName + '.jpg');
        });
      }
    }
  }
</script>
<style>
  @import "/static/f2bpmDesigner/f2bpm.flowdesigner.css";

  .user-pending {
    width: 500px;
    background-color: #FFFFFF;
  }

  .user-pending th {
    padding: 5px;
    width: 100px !important;
    text-align: left !important;
  }

  .user-pending td {
    padding: 5px;
    text-align: left !important;
  }
</style>