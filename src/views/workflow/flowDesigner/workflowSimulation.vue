<template>
  <div id="layoutDiv" style="width: 100%; ">
    <div id="wftoolbar" style="padding: 3px; padding-left: 7px;height:30px;margin-top:8px;">
      <a id="createSimulation" onclick="createSimulation();return false;" title="创建一条仿真实例" class="btn btn-primary    btn-sm mr2">
        <i class="fa fa-file" />创建仿真实例
      </a>
      <a id="singleRun" onclick="singleRun();return false;" title="手动点击一次触发执行一次直到结束" class="btn btn-primary  mr2 btn-sm btn-run">
        <i class="fa fa-step-forward" />单步运行仿真
      </a>
      <a id="autoRun" onclick="autoRun();return false;" title="将自动执行触发执行每一环节运行直到结束" class="btn btn-default mr2 btn-sm btn-run">
        <i id="auto-title-i" class="fa fa-play-circle-o" /><span id="auto-title">开始自动仿真</span>
      </a>
      <a onclick="simulationParams();return false;" title="流程实例运行时存在参数条件时，则会从这里取，以便满足仿真运行。" class="btn btn-default  btn-sm mr2 ">
        <i class="fa fa-cogs" />设置仿真参数
      </a>
      <a id="btn_showHistoryApproval" role="button" onclick="showHistoryApproval('');return false;" class="btn btn-default btn-sm mr2"><i class="fa fa-list-ol" />办理过程</a>
      <a role="button" onclick="question();" class="btn btn-default btn-sm mr2">
        <i class="fa fa-question" />说明
      </a>
      <a onclick="printTable();return false;" title="打印时请在打印机设置勾打印“选背景和图片”" class="btn btn-default btn-sm mr2">
        <i class="fa fa-print" />打印流程图
      </a>
      <a id="cancel" role="button" onclick="FUI.Window.closeEdit();" class="btn btn-default btn-sm mr2">
        <i class="fa fa-times" />关闭
      </a>
    </div>
    <div id="centerDiv" style="overflow: hidden;">
      <div id="f2bpmflow" style="float: left;" />
    </div>
  </div>
</template>

<script>
  window.oper = 1;
  window.isSysWorking = false;// 是否系统加载中。
  $('body').removeClass('class');
  window.wid = Object.toQueryString('wid');
  window.wiid = Object.toQueryString('wiid');
  window.appId = Object.toQueryString('appId');
  // 是否仿真
  window.isSimulation = Object.toQueryString('isSimulation');
  // 仿真
  window.isauto = Object.toQueryString('isauto') || 0;
  window.spanSecend = 3;
  window.winstIsEnd = false;
  window.prodessDefData = {};
  window.approvalRecord = [];
  window.designer = null;
  window.openDesign = true;
  window.wf = null;
  window.wfClone = null;
  window.wfData = {};
  window.gf = null;
  window.gfClone = null;
  window.wfTemp = {};
  window.wfNodeTemp = {};
  window.wfLineTemp = {};
  window.loadWorkflowMap = function () {
    $('#f2bpmflow').html('');
    prodessDefData = Object.toAjaxJson('/workflow/flowDesigner/', 'getWorkflowMapJson', { wid: wid, wiid: wiid });

    wf = prodessDefData.data.xmlToJson;
    wfClone = $.extend(true, {}, wf);
    gf = prodessDefData.data.designerJson;
    gfClone = $.extend(true, {}, gf);
    var flowName = wf.ProcessDef.WorkflowName;
    this.title = '流程仿真-' + flowName;
    WFContext.WorkflowName = flowName;

    approvalRecord = prodessDefData.data.approvalRecord;// 历史审批记录
    designer = F2BPM.FlowDesigner.create('f2bpmflow');
    designer.designerPath = __webpath + '/static/f2bpmDesigner';
    designer.editable = false;
    designer.showActivityApproval = window.showActivityApproval;
    designer.activityApprovalId = 'activityApprovalblok';
    isSysWorking = true;
    designer.loadFlowData(gf);
    isSysWorking = false;
    designer.bind();

    $.each(approvalRecord, function (i, item) {
      if (item.activityCode == 'end') {
        $('.btn-run').hide();
        winstIsEnd = true;
        return false;
      }
    });
    // ==流程仿真=====
    if (winstIsEnd == true) {
      FUI.Window.showMsg('流程仿真结束', null, 1);
      return false;
    }
  };

  window.showActivityApproval = function (actId, x, y) {
    $('#activityApprovalblok').remove();
    if (!approvalRecord) return false;
    var divHtml = "<div id=\"activityApprovalblok\" cellpadding=\"0\" cellspacing=\"0\" style='background:#fff;left:" + x + 'px;top:' + y + "px;'  class='activityApprovalblok'>";
    var approvalHtml = '';
    approvalHtml += "<table  class='common-table'  style='background:#fff;' cellpadding=\"0\" cellspacing=\"0\">";
    approvalHtml += '<tr>';
    approvalHtml += '<th>节点名称</th>';
    approvalHtml += '<th>处理人</th>';
    approvalHtml += '<th>处理人部门</th>';
    approvalHtml += '<th>到达时间</th>';
    approvalHtml += '<th>完成时间</th>';
    approvalHtml += '<th>处理状态</th>';
    //               approvalHtml+="<th>审核菜单</th>";
    approvalHtml += '<th>处理意见</th>';
    approvalHtml += '</tr>';
    var isExist = false;
    $.each(approvalRecord, function (i, item) {
      if (item.activityId != actId) return true;
      isExist = true;
      var completedTime = item.completedTime || '';
      if (completedTime) {
        completedTime = Object.toJsonDateTimeFormatter(completedTime);
      }
      var createdTime = Object.toJsonDateTimeFormatter(item.createdTime);
      var taskName = '';
      switch (item.taskState) {
        case 0:
          taskName = '送达';
          break;
        case 1:
          taskName = '已读';
          break;
        case 3:
          taskName = '锁定';
          break;
        case 2:
          taskName = '完成';
          break;
        default:
          taskName = '未知';
          break;
      }
      var opinion = '';
      switch (item.completedType) {
        case 'Invalid':
          opinion = '<em>【流程作废】</em>' + opinion;
          break;
        case 'Reject':
          opinion = '<em>【退回】</em>' + opinion;
          break;
        case 'Referred': ;
          opinion = '<em>【转交】</em>' + opinion;
          break;
      }
      if (item.approAction) {
        opinion += '【' + item.approAction + '】';
      }
      opinion += item.opinion;
      if (item.activityName == '结束') opinion = item.opinion;
      var approAction = item.approAction || '';
      approvalHtml += '<tr>';
      approvalHtml += '<td>' + item.activityName + '</td>';
      approvalHtml += '<td>' + Object.toProcSecrecy(item.realName) + '</td>';
      approvalHtml += '<td>' + item.userDpName + '</td>';
      approvalHtml += '<td>' + createdTime + '</td>';
      approvalHtml += '<td>' + completedTime + '</td>';
      approvalHtml += '<td >' + taskName + '</td>';
      //                   approvalHtml+="<td >"+approAction+"</td>";
      approvalHtml += '<td >' + opinion + '</td>';
      approvalHtml += '</tr>';
    });
    approvalHtml += '</table>';
    if (isExist) {
      divHtml += approvalHtml;
    } else {
      divHtml += "<em class='p10 msg'>暂时查无审批记录</em>";
    }
    divHtml += '</div>';
    designer.drawingBoardInner.append(divHtml);
    if (!isExist) {
      $('#activityApprovalblok').width(180);
    }
  };

  $(function () {
    setTimeout(function () {
      window.loadWorkflowMap();
    }, 500);

    // ==自动仿真=====
    if (isauto == 1) {
      $('#auto-title').html('停止自动仿真(<em>' + spanSecend + '</em>秒后执行)');
      $('#auto-title-i').removeClass('fa-play-circle-o');
      $('#auto-title-i').addClass('fa-pause-circle-o');
    } else {
      $('#auto-title').html('开始自动仿真');
    }
    if (wiid == '') {
      $('#singleRun').hide();
      $('#autoRun').hide();
    } else if (wiid != '' && isauto == 1 && winstIsEnd != true) {
      var interval = setInterval(function () {
        spanSecend--;
        if (isauto == 1 && spanSecend >= 0) {
          $('#auto-title').html('停止自动仿真(<em>' + spanSecend + '</em>秒后执行)');
        }
        if (spanSecend == 0) {
          singleRun();
          if (winstIsEnd != true) {
            spanSecend = 5;
          }
        }
        if (winstIsEnd) {
          clearInterval(interval);
        }
      }, 1000);
    }
    // ==流程仿真=====
  });
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

  // 仿真
  window.singleRun = function () {
    if (!wiid) {
      FUI.Window.showMsg('请先新建仿真实例！');
      return false;
    }
    var parm = { wiid: wiid };
    var data = Object.toAjaxJson('/workflow/flowDesigner/', 'simulationSingleRun', parm);
    if (data.success) {
      // window.location.reload();
      loadWorkflowMap();
    } else {
      FUI.Window.showMsg(data.msg, null, null, function () {
        if (isauto == 1) {
          // 如果有自动仿真需要关闭
          autoRun();
        }
      });
    }
  };

  window.autoRun = function () {
    if (isauto == 0) {
      if (!wiid) {
        FUI.Window.showMsg('请先新建仿真实例！');
        return false;
      }
      FUI.Window.confirm('确定要全自动执行仿真吗?', null, function () {
        var url = window.location.href;
        if (url.indexOf('isauto=0') > -1) {
          url = window.location.href.replace('&isauto=0', '&isauto=1');
        } else {
          url = window.location.href + '&isauto=1';
        }
        window.location.href = url;
        //无#window.location.reload()
      });
    } else {
      var url = window.location.href.replace('&isauto=1', '&isauto=0');
      window.location.href = url;
    }
  };
  window.createSimulation = function () {
    var url = __webpath + '/workflow/flowDesigner/workflowSimulation/?isSimulation=true&appId=' + appId + '&wid=' + wid + '&wiid=';
    var parm = {  appId:appId };
    var data = Object.toAjaxJson('/workflow/flowDesigner/', 'createSimulation', parm);
    if (data.success) {
      FUI.Window.showMsg('仿真实例创建成功，稍后请点击工具栏上的“单步运行仿真”或“开始自动仿真”', null, 1, function () {
        window.location.href = url + data.msg;
      });
    } else {
      FUI.Window.showMsg(data.msg);
    }
  };
  window.question = function () {
    var content = '以下情况仿真可能会执行失败：' +
      '<br>1、由于缺乏真实运行环境所以仿真具有一定的局限情，如有需要根据实际情况将流程设置做临时性调整以便仿真能够运行。' +
      '<br>2、节点处理人需要人工选择才能确定处理人。' +
      '<br>3、条件是需要人工在实际中运行时才能确定的。' +
      '<br>4、存在不确定性的变量条件。' +
      '<br>5、仿真时只跑流程与表单无关，分支条件中如果使用了表单字段作为变量，需在仿真参数中配置该变量的值。';
    FUI.Window.showMsg(content);
  };

  window.simulationParams = function () {
    var wid = Object.toQueryString('wid');
    // var res = Object.toAjaxJson(FUI.Handlers.ProcessDef, 'getWorkflowSimpleInfoByWid', {appId:appId, 'wid': wid })
    var appId = window.appId;
    var url = __webpath + '/workflow/simulationParams/simulationParamsList/?appId=' + appId+"&wid="+wid;
    FUI.Window.openEdit(url, '设置仿真参数', null, null, null, null, null, null, null, true,null,null,true);
  };
  // 查看办理过程
  window.showHistoryApproval = function () {
    if (!wiid) {
      FUI.Window.showMsg('尚未创建仿真实例');
      return;
    }
    var isHistory = winstIsEnd ? 1 : 0;
    var url = __webpath + '/workflow/workflowBusiness/showApprovalHistory/?isHistory=' + isHistory + '&wiid=' + wiid;
    var title = '查看仿真办理过程';
    var width = 780;
    var height = 460;
    FUI.Window.openEdit(url, title, null, null, width, height, null, null, null, false);
  }
</script>
<style>
  @import "/static/f2bpmDesigner/f2bpm.flowdesigner.css";
</style>