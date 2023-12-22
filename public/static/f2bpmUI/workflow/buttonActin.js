$.fn.actionDialog = function (title, width, height) {
  var id = $(this).attr("id");
  FUI.layuiLayer.open({
    type: 1,
    offset: '30px',
    maxmin: true,
    content: $('#' + id),
    area: [width, height],
    title: title
  });
};

//流程表单操作按钮
var ProcessFormUrl = "/workflow/workflowform/";
var workflowformSender = "/workflow/workflowformSender/";

//*****************阅式审批自动提交**********************************
$(function () {
  setTimeout(function () {
    if (WFContext.CurrentIsReadAutoApproval === true && WFContext.OutType == "Auto") {
      return sendWorkflow(window.myvm);
    }
  }, 3000);

});

//*****************提交窗口，驳回窗口定义**********************************



function cancleSendWorkflow_ButtonClick() {
  FUI.layuiLayer.closeAll();
}

//发起流程时的传阅用户
var _circulatedTempUserJson = "";

function printTable(beforeFn) {
  if (!actionButtonBefore(beforeFn)) return false;
  var oleHieght = $("#WorkflowContentDiv").css("height");
  $("#WorkflowContentDiv").css("height", "auto");
  $("#wftoolbar").hide();
  print();
  $("#wftoolbar").show();
  setTimeout(function () {
    $("#WorkflowContentDiv").css("height", oleHieght);
  }, 800);
}
//wfformId是流程表单应用的ID和printFormId只需传其中一个
function printExcelTable(beforeFn, wfformId, wiid, printFormId) {
  if (!actionButtonBefore(beforeFn)) return false;
  var url = __webpath + "/workflow/smartForm/onlineExcelView?formId=" + printFormId + "&wfformId=" + wfformId + "&wiid=" + wiid;
  FUI.Window.open(url, "_blank");
}
function showWorkflowMap(beforeFn) {
  if (!actionButtonBefore(beforeFn)) return false;
  var parmUrl = "wid=" + WFContext.WorkflowId + "&wiid=" + WFContext.WorkflowInstanceId;
  if (WFContext.WorkflowformAction == 0) {
    parmUrl = "wid=" + WFContext.WorkflowId;
  }
  var url = __webpath + "/workflow/flowDesigner/workflowMap/?" + parmUrl;
  var title = WFContext.WorkflowName;
  var width = 1100;
  var height = 600;
  FUI.Window.openEdit(url, title, null, null, width, height, null, null, null, true);

}
function openShowWorkflowMap(wiid, title) {
  var parmUrl = "wiid=" + wiid;
  var url = __webpath + "/workflow/flowDesigner/workflowMap/?" + parmUrl;
  var title = title;
  var width = 1100;
  var height = 600;
  FUI.Window.openEdit(url, title, null, null, width, height, null, null, null, true);

}
//查看办理过程
function showHistoryApproval(beforeFn) {
  var that = window.myvm;
  if (!actionButtonBefore(beforeFn)) return false;
  var url = __webpath + "/workflow/workflowBusiness/showApprovalHistory/?wiid=" + WFContext.WorkflowInstanceId;
  var title = WFContext.WorkflowName + "-" + that.$t('workflowform.showApprovalListDialogTitle');;
  var width;
  var height;
  if (window.screen.width > 500) {
    width = 800;
    height = 520;
  } else {
    width = window.screen.width;
    height = window.screen.height - 120;
  }
  FUI.Window.openEdit(url, title, null, null, width, height, null, null, null, false);
}

//查看传阅过程
function showCirculatedHistory(beforeFn) {
  var that = window.myvm;
  if (!actionButtonBefore(beforeFn)) return false;
  var url = __webpath + "/workflow/workflowBusiness/showCirculatedHistory/?wiid=" + WFContext.WorkflowInstanceId;
  var title = WFContext.WorkflowName + "-" + that.$t('workflowform.showCirculatedListDialogTitle');
  var width;
  var height;
  if (window.screen.width > 500) {
    width = 800;
    height = 520;
  } else {
    width = window.screen.width;
    height = window.screen.height - 120;
  }
  FUI.Window.openEdit(url, title, null, null, width, height, null, null, null, false);

}

//互动留言过程
function showCommentRecordHistory(beforeFn) {
  var that = window.myvm;
  if (!actionButtonBefore(beforeFn)) return false;
  var url = __webpath + "/workflow/pageRoute/showCommentRecord/?isShowDialog=1&wiid=" + WFContext.WorkflowInstanceId + "&isHistory=" + WFContext.IsHistory + "&formAction=" + WFContext.WorkflowformAction + "&activityName=" + WFContext.CurrentActivityName + "&appId=" + WFContext.AppId + "&openBizDate=" + WFContext.OpenBizDate + "&workflowId=" + WFContext.WorkflowId + "&realName=" + WFContext.RealName;
  var title = WFContext.WorkflowName + "-" + that.$t('workflowform.showCommentListDialogTitle');
  var width;
  var height;
  if (window.screen.width > 500) {
    width = 800;
    height = 520;
  } else {
    width = window.screen.width;
    height = window.screen.height - 120;
  }
  FUI.Window.openEdit(url, title, null, null, width, height, null, null, null, false);

}

//*****************打开窗口： 提交，保存，驳回 作废 等*****************
//打开提交窗口
function openSendDialog($vm, beforeFn, btnDef) {
  if (!actionButtonBefore(beforeFn)) return false;
  if (WFContext.OutType == "Manual") {

  }
  //如果是Url表单，则先调用Ifrmae的页面动作

  var WorkflowTitle = $vm.wfContext.WorkflowTitle;
  // if (!WorkflowTitle) {
  //   FUI.Window.showMsg("流程标题不能为空！");
  //   return false;
  // }
  // if (!FUI.validate("WorkflowformContainer")) {
  //     //FUI.layuiLayer.msg( "表单填写内容校验不通过，请检查是否有必填或数据类型填写是否正确！");
  // }

  //如果有审核菜单时必选
  if ($vm.approData && $vm.approData.length > 0 && $vm.approAction == '') {
    FUI.Window.showMsg("请选择审核菜单");
    return false;
  }
  //开启表单审批意见区时先校验是否必填意见
  var theFormOpinion = $vm.workflowformData.hidOpinion || "";
  if (WFContext.IsShowFormOpinion && WFContext.IsMustAddOpinion == true && theFormOpinion == "") {
    FUI.Window.showMsg(null, "请填写“审核意见”！");
    return false;
  }


  if (WFContext.OutType == "Manual" && WFContext.IsApprovalDirectBack == false) {
    //弹窗二次选择
    var width = 680;
    var height = 530;
    if (WFContext.IsShowFormOpinion) {
      height = 460;
    }
    var url = FUI.Handlers.SendActor + "actorSelect?appId=" + $vm.wfContext.AppId + "&taskId=" + $vm.wfContext.TaskId + "&wiid=" + $vm.wfContext.WorkflowInstanceId + "&formAction=" + $vm.wfContext.WorkflowformAction;
    FUI.dialog(url, "提交选择处理人", {}, width, height, function (data, index, layerObject) {
      if (data == false) {
        return false;
      }
      if (WFContext.IsShowFormOpinion) {
        //取表单处的意见
        data.hidOpinion = $vm.workflowformData.hidOpinion || "";
      }
      if (WFContext.IsMustAddOpinion == true && data.hidOpinion == "") {
        FUI.Window.showMsg(null, "请填写审核意见！");
        return false;
      }
      if (data.hidOpinion.length >= 1000) {
        FUI.Window.showMsg(null, "处理意见输入长度不能大于1000个字符！");
        return false;
      }
      //是否有自由传阅
      var tipmsg = "您确定提交到【" + data.selectedActivity + "】";
      var targetCirculatedActorValue = data.targetCirculatedActorValue;

      if (targetCirculatedActorValue) {
        tipmsg = tipmsg + ",并传阅到指定的用户";
      }
      FUI.Window.confirm($vm, tipmsg + "吗？", "温馨提示", function (index) {
        layer.close(index);
        return sendWorkflow($vm, data, btnDef);
      }
      );
      //layerObject.close(index);
      return false;
    }, false, { btnAlign: 'c', zIndex: 1000 }, { sure: { iconClass: "fa fa-share", text: "确定提交" }, close: { iconClass: "fa  fa-minus-circle", text: "取消" } });
  } else if (WFContext.OutType == "Auto" || WFContext.IsApprovalDirectBack == true) {
    var data = {
      hidOpinion: theFormOpinion
    };
    if (WFContext.IsMustAddOpinion == true && data.hidOpinion == "") {
      FUI.Window.showMsg("请填写审核意见！");
      return false;
    }
    if (data.hidOpinion.length >= 1000) {
      FUI.Window.showMsg(null, "处理意见输入长度不能大于1000个字符！");
      return false;
    }
    //不需要弹窗口、不弹出选择人员对话框
    //如需填写审批意见需要在表单中加入审批意见的控件
    FUI.Window.confirm($vm, '您确定提交吗？', "提交确认", function () {
      return sendWorkflow($vm, data, btnDef);
    });
  }
  return false;
};

//点击驳回事件
function openRejectActorSelected($vm, beforeFn, btnDef) {
  if (!actionButtonBefore(beforeFn)) return false;
  var width;
  var height;
  if (window.screen.width > 500) {
    width = 680;
    height = 520;
  } else {
    width = window.screen.width;
    height = window.screen.height - 120;
  }
  // if (WFContext.IsShowFormOpinion) {
  //   height = 380;
  // }



  //驳回的意见都在弹出窗口中填写
  // var theFormOpinion = $vm.workflowformData.hidOpinion || "";
  // if (WFContext.IsShowFormOpinion && theFormOpinion == "") {
  //   FUI.Window.showMsg(null, "请填写“审核意见”！");
  //   return false;
  // }
  FUI.dialog(FUI.Handlers.SendActor + "actorRejectSelect?taskId=" + $vm.wfContext.TaskId + "&formAction=" + $vm.wfContext.WorkflowformAction, "选择驳回节点及处理人", {
  }, width, height, function (data, index, layerObject) {
    if (data == false) {
      return false;
    }
    // if (!data.hidOpinion&&WFContext.IsShowFormOpinion) {
    //   //取表单处的意见
    //   data.hidOpinion = $vm.workflowformData.hidOpinion || "";
    // }
    if (data.hidOpinion == "") {
      FUI.Window.showMsg(null, "请填写驳回审核意见！");
      return false;
    }
    if (data.hidOpinion.length >= 1000) {
      FUI.Window.showMsg(null, "处理意见输入长度不能大于1000个字符！");
      return false;
    }
    //是否有自由传阅
    var tipmsg = "您确定提交到【" + data.selectedActivity + "】";
    FUI.Window.confirm($vm, tipmsg + "吗？", "温馨提示", function (index) {
      layer.close(index);
      return rejectWorkflow($vm, data, btnDef);
    }
    );
    //layerObject.close(index);
    return false;
  }, false, { btnAlign: 'c', zIndex: 1000 }, { sure: { iconClass: "fa fa-share", text: "确定提交" }, close: { iconClass: "fa  fa-minus-circle", text: "取消" } });
}

//打开传阅窗口
function openCirculatedActor($vm, beforeFn) {
  try {
    //调用按钮前置函数
    if (!actionButtonBefore(beforeFn)) return false;

  } catch (err) {
    alert(err);
    return false;
  }
  var width;
  var height;
  if (window.screen.width > 500) {
    width = 680;
    height = 520;
  } else {
    width = window.screen.width;
    height = window.screen.height - 120;
  }
  if (WFContext.IsShowFormOpinion) {
    height = 380;
  }
  //开启表单审批意见区时先校验是否必填意见
  var theFormOpinion = $vm.workflowformData.hidOpinion || "";
  if (WFContext.IsShowFormOpinion && theFormOpinion == "") {
    FUI.Window.showMsg(null, "请填写“审核意见”！");
    return false;
  }
  FUI.dialog(FUI.Handlers.SendActor + "circulatedActorSelect?taskId=" + $vm.wfContext.TaskId + "&formAction=" + $vm.wfContext.WorkflowformAction, "提交到要传阅的用户", {
  }, width, height, function (data, index, layerObject) {
    if (data == false) {
      return false;
    }
    if (WFContext.IsShowFormOpinion) {
      //取表单处的意见
      data.hidOpinion = theFormOpinion;
    }
    if (WFContext.IsMustAddOpinion == true && data.hidOpinion == "") {
      FUI.Window.showMsg(null, "请填写意见！");
      return false;
    }
    if (data.hidOpinion.length >= 1000) {
      FUI.Window.showMsg(null, "意见输入长度不能大于1000个字符！");
      return false;
    }
    var typeName = "传阅";
    FUI.Window.confirm($vm, "您确定要" + typeName + "吗？", "温馨提示", function (index) {
      layer.close(index);
      return circulatedWorkflow($vm, data);
    }
    );
    //layerObject.close(index);
    return false;
  }, false, { btnAlign: 'c', zIndex: 1000 }, { sure: { iconClass: "fa fa-share", text: "确定传阅" }, close: { iconClass: "fa  fa-minus-circle", text: "取消" } });
  return false;

}

//打开转交窗口
function openReferredActor($vm, beforeFn) {
  try {
    //调用按钮前置函数
    if (!actionButtonBefore(beforeFn)) return false;

  } catch (err) {
    alert(err);
    return false;
  }
  var width;
  var height;
  if (window.screen.width > 500) {
    width = 680;
    height = 520;
  } else {
    width = window.screen.width;
    height = window.screen.height - 120;
  }
  if (WFContext.IsShowFormOpinion) {
    height = 380;
  }
  //开启表单审批意见区时先校验是否必填意见
  var theFormOpinion = $vm.workflowformData.hidOpinion || "";
  if (WFContext.IsShowFormOpinion && theFormOpinion == "") {
    FUI.Window.showMsg(null, "请填写“意见”！");
    return false;
  }

  FUI.dialog(FUI.Handlers.SendActor + "assistActorSelect?taskId=" + $vm.wfContext.TaskId + "&formAction=" + $vm.wfContext.WorkflowformAction, "选择转办到用户", {
  }, width, height, function (data, index, layerObject) {
    if (data == false) {
      return false;
    }
    if (WFContext.IsShowFormOpinion) {
      //取表单处的意见
      data.hidOpinion = theFormOpinion;
    }
    if (WFContext.IsMustAddOpinion == true && data.hidOpinion == "") {
      FUI.Window.showMsg(null, "请填写意见！");
      return false;
    }
    if (data.hidOpinion.length >= 1000) {
      FUI.Window.showMsg(null, "意见输入长度不能大于1000个字符！");
      return false;
    }
    var typeName = "转办";
    FUI.Window.confirm($vm, "您确定要" + typeName + "吗？", "温馨提示", function (index) {
      layer.close(index);
      return referredWorkflow($vm, data);
    }
    );
    //layerObject.close(index);
    return false;
  }, false, { btnAlign: 'c', zIndex: 1000 }, { sure: { iconClass: "fa fa-share", text: "确定转办" }, close: { iconClass: "fa  fa-minus-circle", text: "取消" } });
  return false;

}


function sendWorkflow($vm, data, btnDef) {
  //如果是Url表单，调用Url表单
  if (WFContext.FormType == 'UrlForm') {
    var resultMsg = submitUrlFormMethod($vm, btnDef, "sendWorkflow");
    if (typeof resultMsg == "boolean" && resultMsg === false) {
      return false;
    }
    else if (typeof resultMsg == "string" && resultMsg != "") {
      FUI.Window.showMsg(resultMsg);
      return false;
    }

    // 新增url表单数据赋值 格式化
    var frameWindow = window["urlFormIframe"].contentWindow;
    var $urlFormVue = frameWindow.$urlFormVue;
    $vm.newData = $urlFormVue.newData;

    console.log("url表单赋值表单数据：", $vm.newData);
  }
  var dataJsonParm = {};
  dataJsonParm.formAction = WFContext.WorkflowformAction;
  dataJsonParm.formId = WFContext.FormId;
  dataJsonParm.businessKey = WFContext.BusinessKey;
  dataJsonParm.wiid = WFContext.WorkflowInstanceId;
  dataJsonParm.wid = WFContext.WorkflowId;
  dataJsonParm.appId = WFContext.AppId;
  dataJsonParm.taskId = WFContext.TaskId;
  dataJsonParm.circulatedUserJson = data.targetCirculatedActorValue || "";
  //选择的审核菜单
  dataJsonParm.approAction = $vm.approAction || "";
  //选择的处理人结果及处理意见
  dataJsonParm.hidOpinion = data.hidOpinion;
  dataJsonParm.hidSelectUsers = data.hidSelectUsers;
  dataJsonParm.hidSelectedActivityType = data.hidSelectedActivityType;
  dataJsonParm.hidSelectedActivityJson = data.hidSelectedActivityJson;
  //下一节点为自定义流时
  dataJsonParm.nextActIsFreeflow = WFContext.NextActIsFreeflow;
  dataJsonParm.nextActIsFreeflowJson = data.nextActIsFreeflowJson || "";
  //流程变量
  dataJsonParm.processVariablesJson = $vm.processVariablesJson || "";

  WF.Workflowform.submitWorkflowform($vm, workflowformSender, "sendWorkflow", null, dataJsonParm, null, null, function (mssg) {
    if (mssg === false) return false;
    if (mssg.success) {
      if (window.opener != null) {
        try {
          //如果有自定义的方法调用业务表单自定义刷新父窗口的方法
          if (typeof customRefreshOpenerWindow == "function") {
            customRefreshOpenerWindow.call(this);
          } else {
            window.opener.window.refreshTargetGrid("grid");
          }
        } catch (err) {
        }
      }
      if (WFContext.CurrentIsReadAutoApproval === true) {
        //阅式自动审批时跳转到工单查看页面
        window.location.href = __webpath + "/workflow/workflowform/index/?appId=" + WFContext.AppId + "&formAction=3&wiid=" + WFContext.WorkflowInstanceId;
      } else {
        var tipMsg = mssg.msg;
        //是否为新创建流程实例时的提交（含有实例时的草稿状态）
        var isNewProceInst = WFContext.WorkflowInstinceState == 0 || WFContext.WorkflowInstinceState == 1;
        var afterPoceInstJump = "default";
        var jumpToUrl = "";
        if (isNewProceInst && window.workflowConfig && window.workflowConfig.submitAfterOnCreatedNewPoceInstJump) {
          afterPoceInstJump = window.workflowConfig.submitAfterOnCreatedNewPoceInstJump;
          jumpToUrl = window.workflowConfig.submitAfterOnCreatedNewPoceInstJumpToUrl;
        }
        if (isNewProceInst && afterPoceInstJump == "continueNewProceInst") {
          tipMsg = mssg.msg + "，点击“确定”后可继续发起流程";
        }
        FUI.Window.showMsg(null, tipMsg, "提交信息", "info", function () {
          //================如果是未有流程实例时的提交 （含有实例时的草稿状态）提交成功后重新跳转到发起新增界面=====================
          if (isNewProceInst && afterPoceInstJump == "continueNewProceInst") {
            window.location.href = __webpath + "/workflow/workflowform/index/?appId=" + WFContext.AppId;
            return false;
          }
          else if (isNewProceInst && afterPoceInstJump == "jumpToUrl") {
            var url = "";
            var linkChar = jumpToUrl.indexOf("?") > -1 ? "&" : "?";
            if (jumpToUrl.indexOf("http://") == -1) {
              var redirect = __webpath + "/workflow/workflowform/index/?appId=" + WFContext.AppId;
              var pagemsg = "如需继续新增发起流程申请，可单击下面的返回按钮";
              jumpToUrl = __webpath + jumpToUrl + linkChar + "&infoType=success&title=" + tipMsg + "&redirect=" + redirect + "&message=" + pagemsg;
            } else if (jumpToUrl.indexOf("http://") > -1) {
              jumpToUrl = jumpToUrl + linkChar + "appId=" + WFContext.AppId;
            }
            window.location.href = jumpToUrl;
            return false;
          }
          //窗口关闭事件  调整适应移动端=======================================================================================================
          if (window.opener != null) {
            if (window.screen.width > 500) {
              window.close();
            } else {
              window.history.back();
            }
          }
          else {
            if (window.screen.width > 500) {
              FUI.Window.closeEdit(true, 'grid');
            } else {
              window.history.back();
            }

          }
        });
      }
    } else {
      FUI.Window.showMsg(mssg.msg);
    }
  });
  return false;
}

//驳回
function rejectWorkflow($vm, data, btnDef) {
  //如果是Url表单，调用Url表单
  if (WFContext.FormType == 'UrlForm') {
    var resultMsg = submitUrlFormMethod($vm, btnDef, "rejectWorkflow");
    if (typeof resultMsg == "boolean" && resultMsg === false) {
      return false;
    }
    else if (typeof resultMsg == "string" && resultMsg != "") {
      FUI.Window.showMsg(resultMsg);
      return false;
    }
  }
  var dataJsonParm = {};
  dataJsonParm.formAction = WFContext.WorkflowformAction;
  dataJsonParm.wiid = WFContext.WorkflowInstanceId;
  dataJsonParm.formId = WFContext.FormId;
  dataJsonParm.wid = WFContext.WorkflowId;
  dataJsonParm.appId = WFContext.AppId;
  dataJsonParm.taskId = WFContext.TaskId;
  dataJsonParm.OutType = WFContext.OutType;
  //选择的结果及处理意见
  dataJsonParm.hidOpinion = data.hidOpinion;
  dataJsonParm.hidSelectUsers = data.hidSelectUsers;
  dataJsonParm.hidSelectedActivityType = data.hidSelectedActivityType;
  dataJsonParm.hidSelectedActivityJson = data.hidSelectedActivityJson;
  dataJsonParm.rejectBackType = data.rejectBackType || "";
  var isRejectToMain = data.isRejectToMain;
  var method = isRejectToMain ? "rejectToMainWorkflow" : "rejectWorkflow";
  WF.Workflowform.submitWorkflowform($vm, workflowformSender, method, null, dataJsonParm, null, null, function (mssg) {
    Object.toCloseLoading();
    if (mssg === false) return false;
    if (mssg.success) {
      if (window.opener != null) {
        try {
          //如果有自定义的方法调用业务表单自定义刷新父窗口的方法
          if (typeof customRefreshOpenerWindow == "function") {
            customRefreshOpenerWindow.call(this);
          } else {
            window.opener.window.refreshTargetGrid("grid");

          }
        } catch (err) {
        }

      }
      FUI.Window.showMsg(mssg.msg, "驳回提示", "info", function () {
        if (window.opener != null) {
          if (window.screen.width > 500) {
            window.close();
          } else {
            window.history.back();
          }
        }
        else {
          if (window.screen.width > 500) {
            FUI.Window.closeEdit(true, 'grid');
          } else {
            window.history.back();
          }

        }
      });

    } else {
      FUI.Window.showMsg(mssg.msg);
      if (window.opener != null) {
        try {
          //如果有自定义的方法调用业务表单自定义刷新父窗口的方法
          if (typeof customRefreshOpenerWindow == "function") {
            customRefreshOpenerWindow.call(this);

          } else {
            window.opener.window.refreshTargetGrid("grid");

          }
        } catch (err) {
        }

      }
    }

  }, false);

  return false;

}

//传阅
function circulatedWorkflow($vm, data) {
  var dataJsonParm = {};
  dataJsonParm.formAction = WFContext.WorkflowformAction;
  dataJsonParm.wiid = WFContext.WorkflowInstanceId;
  dataJsonParm.formId = WFContext.FormId;
  dataJsonParm.wid = WFContext.WorkflowId;
  dataJsonParm.appId = WFContext.AppId;
  dataJsonParm.taskId = WFContext.TaskId;
  dataJsonParm.OutType = WFContext.OutType;

  //选择的结果及处理意见
  dataJsonParm.hidOpinion = data.hidOpinion;
  dataJsonParm.hidSelectUsers = data.hidSelectUsers;
  if (dataJsonParm.hidOpinion.length >= 1000) {
    FUI.Window.showMsg("审核意见输入长度不能大于1000个字符！");
    return false;
  }
  var mssg = Object.toAjaxJson(workflowformSender, "sendCirculatedWorkflow", dataJsonParm);
  if (mssg === false) return false;
  if (mssg.success) {
    FUI.Window.showMsg(mssg.msg, "温馨提示", "info", function () {
      FUI.Window.closeEditAll();
    });
  } else {
    FUI.Window.showMsg(mssg.msg);
    FUI.Window.closeEditAll();
  }
  return false;

}

//转交
function referredWorkflow($vm, data) {
  var dataJsonParm = {};
  dataJsonParm.formAction = WFContext.WorkflowformAction;
  dataJsonParm.wiid = WFContext.WorkflowInstanceId;
  dataJsonParm.formId = WFContext.FormId;
  dataJsonParm.wid = WFContext.WorkflowId;
  dataJsonParm.appId = WFContext.AppId;
  dataJsonParm.taskId = WFContext.TaskId;
  dataJsonParm.OutType = WFContext.OutType;

  //选择的结果及处理意见
  dataJsonParm.hidOpinion = data.hidOpinion;
  dataJsonParm.hidSelectUsers = data.hidSelectUsers;
  if (dataJsonParm.hidOpinion.length >= 1000) {
    FUI.Window.showMsg("审核意见输入长度不能大于1000个字符！");
    return false;
  }
  //如果是Url表单，调用Url表单
  if (WFContext.FormType == 'UrlForm') {
    var resultMsg = submitUrlFormMethod($vm, dataJsonParm.hidOpinion, "referredWorkflow");
    if (typeof resultMsg == "boolean" && resultMsg === false) {
      return false;
    }
    else if (typeof resultMsg == "string" && resultMsg != "") {
      FUI.Window.showMsg(resultMsg);
      return false;
    }
  }
  var mssg = Object.toAjaxJson(workflowformSender, "sendReferredWorkflow", dataJsonParm);
  Object.toCloseLoading();
  if (mssg === false) return false;
  if (mssg.success) {
    if (window.opener != null) {
      try {
        //如果有自定义的方法调用业务表单自定义刷新父窗口的方法
        if (typeof customRefreshOpenerWindow == "function") {
          customRefreshOpenerWindow.call(this);

        } else {
          window.opener.window.refreshTargetGrid("grid");

        }
      } catch (err) {
      }

    }
    FUI.Window.showMsg(mssg.msg, "转办成功", "info", function () {
      if (window.opener != null) {
        if (window.screen.width > 500) {
          window.close();
        } else {
          window.history.back();
        }
      }
      else {
        if (window.screen.width > 500) {
          FUI.Window.closeEdit(true, 'grid');
        } else {
          window.history.back();
        }

      }
    });
  } else {
    FUI.Window.showMsg(mssg.msg);
  }
  return false;

}

function actionButtonBefore(beforeFn) {
  try {
    var isCando = true;
    if (beforeFn) {
      if (typeof eval(beforeFn) == "function") {
        isCando = eval(beforeFn).call(this);
      }
    }
    return isCando;
  } catch (err) {
    alert(err);
    return false;
  }
}
//调用iframe的Url表单函数
window.submitUrlFormMethod = function ($vm, btnDef, methodName) {
  console.log("3333url表单")
  var cubmitResult = "";
  var frameWindow = window["urlFormIframe"].contentWindow;
  var url = $("#urlFormIframe").attr("src");
  if (!url || (url.indexOf("{") > -1 && url.indexOf("}") > -1)) {
    //配置的是JSON结构，直接返回
    return true;
  }
  if ((Object.toStartWith(url, "http") || Object.toStartWith(url, "https")) && WFContext.IsEnabledHttpform !== true) {
    console.info("使用的是外部URL表单并且配置了isEnabledHttpform为false,所以不发触与iframe交互");
    return true;
  }
  var $urlFormVue = frameWindow.$urlFormVue;
  if ($urlFormVue) {
    cubmitResult = $urlFormVue[methodName](btnDef);
  }
  else if ($urlFormVue == undefined && frameWindow[methodName]) {
    cubmitResult = frameWindow[methodName](btnDef);
  }
  return cubmitResult;
};
//暂存表单
function saveWorkflow($vm, isAutoSave, beforeFn, btnDef) {
  if (isAutoSave == false) {
    if (!actionButtonBefore(beforeFn)) return false;
    //调用固有的前置函数（在线表单或用户表单中有此函数时都触发调用）
    if (typeof $fixedFormSubmitBefore == "function") {
      var beforSaveMsg = $fixedFormSubmitBefore();
      if (beforSaveMsg != "") {
        FUI.layuiLayer.msg(beforSaveMsg);
        return false;
      }
    }
    saveWorkflowSubmit($vm, isAutoSave, btnDef);

  } else {
    saveWorkflowSubmit($vm, isAutoSave, btnDef);
  }
  return false;
}

//保存流程
function saveWorkflowSubmit($vm, isAutoSave, btnDef) {
  if (WFContext.FormType == 'UrlForm') {
    //Url表单时
    var resultMsg = submitUrlFormMethod($vm, btnDef, "saveWorkflow");
    if (typeof resultMsg == "boolean" && resultMsg === false) {
      return false;
    }
    else if (typeof resultMsg == "string" && resultMsg != "") {
      FUI.Window.showMsg(resultMsg);
      return false;
    }
    // 新增url表单数据赋值 格式化
    var frameWindow = window["urlFormIframe"].contentWindow;
    var $urlFormVue = frameWindow.$urlFormVue;
    $vm.newData = $urlFormVue.newData;
    console.log(JSON.stringify($vm.newData))
    console.log($vm.newData)
    // debugger
  }
  //保存 先保存工作流，再保存表单，如果是未有实例的情况下保存为草稿，且保存完跳转页面
  var dataJsonParm = {};
  dataJsonParm.formAction = WFContext.WorkflowformAction;
  dataJsonParm.wiid = WFContext.WorkflowInstanceId;
  dataJsonParm.formId = WFContext.FormId;
  dataJsonParm.wid = WFContext.WorkflowId;
  dataJsonParm.appId = WFContext.AppId;
  dataJsonParm.taskId = WFContext.TaskId;
  dataJsonParm.isFixEditMode = WFContext.IsFixEditMode;
  if (dataJsonParm.isFixEditMode === true) {
    //强制查看状态下的编辑模式下修改为3
    dataJsonParm.formAction = 3;
  }
  WF.Workflowform.submitWorkflowform($vm, workflowformSender, "saveWorkflow", null, dataJsonParm, null, null, function (mssg) {
    Object.toCloseLoading();
    if (mssg === false) return false;
    if (mssg.success) {
      if (window.opener != null) {
        try {
          //如果有自定义的方法调用业务表单自定义刷新父窗口的方法
          if (typeof customRefreshOpenerWindow == "function") {
            customRefreshOpenerWindow.call(this);
          } else {
            window.opener.window.refreshTargetGrid("grid");

          }
        } catch (err) {
        }

      }
      if (WFContext.WorkflowformAction == WF.WorkflowformAction.NoInstance) {
        FUI.Window.showMsg2(null, mssg.msg, null, 1);
        //拟稿保存后跳转到草稿模式
        window.location = __webpath + "/workflow/workflowform/index/?appId=" + WFContext.AppId + "&formAction=2&wiid=" + WFContext.WorkflowInstanceId + "&taskId=" + WFContext.TaskId;
        //无#//无#window.location.reload();
      } else {
        FUI.Window.showMsg2(mssg.msg, null, 1, function () {
          window.location.reload();
        });
      }
    } else {
      FUI.Window.showMsg(mssg.msg);
    }
  }, true);
  return false;
};

function saveNoWorkflowfrom($vm, isAutoSave, btnDef) {
  if (isAutoSave == false) {
    if (!actionButtonBefore(beforeFn)) return false;
    //调用固有的前置函数（在线表单或用户表单中有此函数时都触发调用）
    if (typeof $fixedFormSubmitBefore == "function") {
      var beforSaveMsg = $fixedFormSubmitBefore();
      if (beforSaveMsg != "") {
        FUI.layuiLayer.msg(beforSaveMsg);
        return false;
      }
    }
    FUI.Window.confirm("确定要保存吗？", "温馨提示", function (r) {
      if (r) {
        saveNoWorkflowSubmit($vm, isAutoSave, btnDef);
      } else {
        //取消点击
      }
    });
  } else {
    saveNoWorkflowSubmit($vm, isAutoSave, btnDef);
  }
  return false;
}

//saveNoWorkflowCallSubmit(callBack) 使用自己的按钮代码调用保存无流程表单。传入回调函数callBack返回{success:true/false,msg:"错误信息"}
function saveNoWorkflowCallSubmit(callBack) {
  var $vm = myvm;
  if (typeof callBack != "function" && callBack) {
    callBack = eval(callBack);
  }
  var dataJsonParm = {};
  dataJsonParm.formAction = WFContext.WorkflowformAction;
  dataJsonParm.formId = WFContext.FormId;
  dataJsonParm.formKey = WFContext.FormKey;
  dataJsonParm.businessKey = WFContext.BusinessKey;
  WF.Workflowform.submitWorkflowform($vm, "/workflow/noWorkflowform/", "saveNoWorkflow", null, dataJsonParm, null, null, callBack, true);
  return false;
};

//保存无流程表单
function saveNoWorkflowSubmit($vm, isAutoSave, btnDef) {
  var $vm = myvm;
  var dataJsonParm = {};
  dataJsonParm.formAction = WFContext.WorkflowformAction;
  dataJsonParm.formId = WFContext.FormId;
  dataJsonParm.formKey = WFContext.FormKey;
  dataJsonParm.businessKey = WFContext.BusinessKey;

  WF.Workflowform.submitWorkflowform($vm, "/workflow/noWorkflowform/", "saveNoWorkflow", null, dataJsonParm, null, null, function (mssg) {
    Object.toCloseLoading();
    if (mssg === false) return false;
    if (mssg.success) {
      //debugger
      // 保存后置事件
      var extendFunName = "saveWorkflow_after";
      var isExist = Object.toIsExitsFunction(extendFunName);
      if (isExist) {
        var exfunc = eval(extendFunName);
        var isPass = exfunc(mssg);
        // if (isPass === false) {
        //   return false;
        // }
      }
      if (window.parent != null) {
        try {
          //如果有自定义的方法调用业务表单自定义刷新父窗口的方法
          if (typeof customRefreshOpenerWindow == "function") {
            customRefreshOpenerWindow.call(this);
          } else {
            window.parent.refreshTargetGrid("grid");
          }
        } catch (err) {

        }
      }
      if (WFContext.WorkflowformAction == WF.WorkflowformAction.NoInstance) {
        FUI.Window.showMsg(mssg.msg, "提示", "info", function () {
          FUI.Window.closeEdit(true);
        });
        //拟稿保存后跳转到草稿模式,
        // window.location = __webpath + "/workflow/noWorkflowform/index/?formId=" + WFContext.FormId + "&formAction=2&myid=xxx"  ;
        // //无#window.location.reload();
      } else {
        FUI.Window.showMsg(mssg.msg, "提示", "info", function () {
          FUI.Window.closeEdit(true);
        });
      }
    } else {
      FUI.Window.showMsg(mssg.msg);
    }
  }, true);
  return false;
};

//设置已阅
function setDoneCirculated($vm, beforeFn) {
  try {
    //调用按钮前置函数
    if (!actionButtonBefore(beforeFn)) return false;
  } catch (err) {
    alert(err);
    return false;
  }
  FUI.Window.confirm("确定要标记为已阅吗？", "温馨提示", function (index) {
    try {
      var dataJsonParm = {};
      dataJsonParm.formAction = WFContext.WorkflowformAction;
      dataJsonParm.wiid = WFContext.WorkflowInstanceId;
      dataJsonParm.formId = WFContext.FormId;
      dataJsonParm.wid = WFContext.WorkflowId;
      dataJsonParm.appId = WFContext.AppId;
      dataJsonParm.taskId = WFContext.TaskId;
      var mssg = Object.toAjaxJson(workflowformSender, "setDoneCirculated", dataJsonParm);
      if (mssg === false) return false;
      if (mssg.success) {
        if (window.opener != null) {
          try {
            //如果有自定义的方法调用业务表单自定义刷新父窗口的方法
            if (typeof customRefreshOpenerWindow == "function") {
              customRefreshOpenerWindow.call(this);

            } else {
              window.opener.window.refreshTargetGrid("grid");

            }
          } catch (err) {
          }

        }
        FUI.Window.showMsg(mssg.msg, "提示", "info", function () {
          if (window.opener != null) {
            if (window.screen.width > 500) {
              window.close();
            } else {
              window.history.back();
            }
          }
          else {
            if (window.screen.width > 500) {
              FUI.Window.closeEdit(true, 'grid');
            } else {
              window.history.back();
            }

          }

        });

      } else {
        FUI.Window.showMsg(mssg.msg, null, 1);
      }
      return false;

    } catch (err) {
      FUI.Window.showMsg(err);
      return false;
    }

  });

  return false;
};

//锁定
function taskclaim($vm, beforeFn) {
  if (!actionButtonBefore(beforeFn)) return false;
  var isUnClaim = WFContext.TaskState == 3 ? 1 : 0;
  var title = isUnClaim == 1 ? "解除锁定？" : "锁定任务？";
  FUI.Window.confirm($vm, "您确定要" + title, null, function (r) {
    var mssg = Object.toAjaxJson(workflowformSender, "taskclaim", { taskId: WFContext.TaskId, isUnClaim: isUnClaim });
    if (mssg.success) {
      WFContext.TaskState = WFContext.TaskState == 3 ? 1 : 3;
      FUI.Window.showMsg(null, mssg.msg, null, "info", function () {
        //修改按钮样式
        var target = $("#taskclaim");
        if (WFContext.TaskState == 3) {
          target.find("span").find("i").addClass("fa-lock");
          target.find("span").find("i").removeClass("fa-unlock");
          target.find("span").find("span").text("解除锁定");
        } else {
          target.find("span").find("i").addClass("fa-unlock");
          target.find("span").find("i").removeClass("fa-lock");
          target.find("span").find("span").text("锁定任务");
        }
      });
    }
  });
  return false;
};

//作废流程
function invalidWorkflow($vm) {
  var width;
  var height;
  if (window.screen.width > 500) {
    width = 500;
    height = 330;
  } else {
    width = window.screen.width;
    height = window.screen.height - 120;
  }
  FUI.Window.showModalMsg($vm, "", "作废流程", null, { sureText: '确定作废', label: '请输入作废流程的意见原因', tip: '请输入作废流程的意见原因', width: width, height: height },
    function (content, index, layerObject) {
      if (content) {
        //如果是Url表单，调用Url表单
        if (WFContext.FormType == 'UrlForm') {
          var resultMsg = submitUrlFormMethod($vm, content, "invalidWorkflow");
          if (typeof resultMsg == "boolean" && resultMsg === false) {
            return false;
          }
          else if (typeof resultMsg == "string" && resultMsg != "") {
            FUI.Window.showMsg(resultMsg);
            return false;
          }
        }
        try {
          var opinion = content;
          var dataJsonParm = {};
          dataJsonParm.formAction = WFContext.WorkflowformAction;
          dataJsonParm.wiid = WFContext.WorkflowInstanceId;
          dataJsonParm.formId = WFContext.FormId;
          dataJsonParm.wid = WFContext.WorkflowId;
          dataJsonParm.appId = WFContext.AppId;
          dataJsonParm.taskId = WFContext.TaskId;
          dataJsonParm.OutType = WFContext.OutType;
          dataJsonParm.Opinion = opinion;
          var mssg = Object.toAjaxJson(workflowformSender, "invalidWorkflow", dataJsonParm);
          if (mssg === false) return false;
          if (mssg.success) {
            if (window.opener != null) {
              try {
                //如果有自定义的方法调用业务表单自定义刷新父窗口的方法
                if (typeof customRefreshOpenerWindow == "function") {
                  customRefreshOpenerWindow.call(this);
                } else {
                  window.opener.window.refreshTargetGrid("grid");
                }
              } catch (err) {
              }
            }

            FUI.Window.showMsg(null, mssg.msg, "流程实例作废提示", "info", function () {
              if (window.opener != null) {
                if (window.screen.width > 500) {
                  window.close();
                } else {
                  window.history.back();
                }
              }
              else {
                if (window.screen.width > 500) {
                  FUI.Window.closeEdit(true, 'grid');
                } else {
                  window.history.back();
                }

              }
            });

          } else {
            FUI.Window.showMsg(null, mssg.msg);
          }
          return false;

        } catch (err) {
          FUI.Window.showMsg(null, err);
          return false;
        }
      } else {
        FUI.Window.showMsg(null, "请输入作废原因");
      }
    });
  return false;
};

//撤回任务
function withdrawWorkflow($vm, beforeFn, isToStart) {
  if (!actionButtonBefore(beforeFn)) return false;
  var tipMsg = isToStart ? '请输入【强制撤回到开始】的原因，请谨慎操作？' : '请输入撤回原因？';
  var width;
  var height;
  if (window.screen.width > 500) {
    width = 500;
    height = 330;
  } else {
    width = window.screen.width;
    height = window.screen.height - 120;
  }
  FUI.Window.showModalMsg($vm, "", "撤回确认", null,
    { sureText: '确定撤回', label: tipMsg, tip: tipMsg, width: width, height: height },
    function (content, index, layerObject) {
      if (content) {
        try {
          var opinion = content;
          var dataJsonParm = {};
          dataJsonParm.formAction = WFContext.WorkflowformAction;
          dataJsonParm.wiid = WFContext.WorkflowInstanceId;
          dataJsonParm.formId = WFContext.FormId;
          dataJsonParm.wid = WFContext.WorkflowId;
          dataJsonParm.appId = WFContext.AppId;
          dataJsonParm.taskId = WFContext.TaskId;
          dataJsonParm.OutType = WFContext.OutType;
          dataJsonParm.Opinion = opinion;
          var action = isToStart ? "withdrawWorkflowToStart" : "withdrawWorkflow";
          var mssg = Object.toAjaxJson(workflowformSender, action, dataJsonParm);
          if (mssg === false) return false;
          if (mssg.success) {
            if (window.opener != null) {
              try {
                //如果有自定义的方法调用业务表单自定义刷新父窗口的方法
                if (typeof customRefreshOpenerWindow == "function") {
                  customRefreshOpenerWindow.call(this);
                } else {
                  window.opener.window.refreshTargetGrid("grid");
                }
              } catch (err) {
              }
            }
            FUI.Window.showMsg(mssg.msg, "流程撤回提示", "info", function () {
              if (window.opener != null) {
                if (window.screen.width > 500) {
                  window.close();
                } else {
                  window.history.back();
                }
              }
              else {
                if (window.screen.width > 500) {
                  FUI.Window.closeEdit(true, 'grid');
                } else {
                  window.history.back();
                }

              }
            });

          } else {
            FUI.Window.showMsg(mssg.msg);
          }
          return false;
        } catch (err) {
          FUI.Window.showMsg(err.toString());
          return false;
        }
      } else {
        FUI.Window.showMsg("请输入撤回原因");
      }
    });
  return false;
};
//****************加盖印章**********************************
var $officialDocumentId = null;
$(function () {
  // initailStamp();
  // if($paget_initail_sealedJson&&$paget_initail_sealedJson.length>0){
  // 	$("#hidSeal").val(JSON.stringify($paget_initail_sealedJson));
  // }
  // !$officialDocumentId.startsWith("richeditor_") &&
  // if ($officialDocumentId != null && $("#" + $officialDocumentId).get(0).tagName != "TEXTAREA") {
  //     //     //只要是富文框 就不加载已盖好的印章，放在富文本框不可编辑时解析成Html时加载
  //     //     setTimeout(function () {  loadStamp($officialDocumentId);}, 500);
  //     // }

});

function initailStamp() {
  $officialDocumentId = "mainWorkformContainer";
  if ($("#officialDocument").length > 0) {
    $officialDocumentId = "officialDocument";
  } else if ($("textarea[richeditorType='richeditorofficial']").length > 0) {
    //是否是 HTML公文编辑器  原始控制
    $officialDocumentId = $("textarea[richeditorType='richeditorofficial']").attr("richeditorId");
  }
}

function openSealSelected() {

  WF.SelectorDialog.selectPersonalSeal({ callBack: sealSign, isMulti: false, title: "选择要加盖的印章" });
  return false;
}

var $sealArr = [];

function sealSign(data) {
  var imgpath = data[0].sealPhotoFullPaht;
  if (imgpath.length < 2000 && imgpath.indexOf("http://") == -1 && Object.toStartWith(imgpath, __webpath) == false) {
    imgpath = __webpath + imgpath;
  }
  if (imgpath.length > 2000) {
    imgpath = "data:image/png;base64," + imgpath;
  }
  var sealId = data[0].sealId;
  var width = data[0].sealWidth;
  var height = data[0].sealHeight;
  var seal = FUI.SealSign.create($officialDocumentId, imgpath, sealId, null, null, sureStamp, { width: width, height: height });
  if (seal != null) {
    seal.bind();
    $sealArr.push(seal);
  }

  // seal.signSeal()
}

function sureStamp(obj) {
  // SealId: sealId, SealImgpath: options.img, StampHeight: options.height, StampWidth: options.width, PositionY: parseInt(sign.css('top')), PositionX: parseInt(sign.css('left'))
  var sealJson = $("#hidSeal").val();
  var data = [];
  if (sealJson == "") {
    data.push(obj);
  } else {
    data = eval("(" + sealJson + ")");
    data.push(obj);
  }
  $("#hidSeal").val(JSON.stringify(data));
  console.info($("#hidSeal").val());
  //alert("img:" + obj.SealImgpath + ",left:" + obj.PositionX + ",top:" + obj.PositionY);
}

function loadStamp(targetOfficialDocumentId) {
  if ($("#" + targetOfficialDocumentId).length == 0) {
    return false;
  }
  var sealJson = $("#hidSeal").val();
  if (!sealJson || sealJson == "") return false;
  var data = eval("(" + sealJson + ")");
  var seal = FUI.SealSign.create(targetOfficialDocumentId);
  if (seal != null) {
    seal.load(data);
  }
}


//****************任务分发窗口 **********************************
//打开处理分发历史处理过程窗口
function showHistoryTaskdister(that, beforeFn) {
  var width;
  var height;
  if (window.screen.width > 500) {
    width = 860;
    height = 560;
  } else {
    width = window.screen.width;
    height = window.screen.height - 120;
  }
  var taskDisterWindowUrl = __webpath + "/workflow/sendActor/showHistoryTaskdisterDailog/?type=taskdister&wiid=" + WFContext.WorkflowInstanceId + "&aiid=" + WFContext.CurrentActivityInstanceId;
  FUI.Window.openEdit(taskDisterWindowUrl, "查看任务分发过程", "View", null, width, height);
  return false;
}

//打开发分窗口,即任务分发给其它人
function openSendTaskdister(that, beforeFn) {
  if (!actionButtonBefore(beforeFn)) return false;
  var width;
  var height;
  if (window.screen.width > 500) {
    width = 860;
    height = 560;
  } else {
    width = window.screen.width;
    height = window.screen.height - 120;
  }
  //传递用户参数格式
  var parms = $collectParmsUsers();// [{"value":"admin","text":"系统管理员"},{"value":"admintest","text":"test"}];
  var taskDisterWindowUrl = __webpath + "/workflow/sendActor/taskdisterSelect/?type=taskdister&wiid=" + WFContext.WorkflowInstanceId + "&taskId=" + Object.toQueryString("taskId");
  FUI.Window.openEdit(taskDisterWindowUrl, "任务分发", "Edit", null, width, height, null, null, null, false, null, parms);
  return false;
}

//处理分发任务
function openSendTaskdisterDailog(that, beforeFn) {
  var taskDisterWindowUrl = __webpath + "/workflow/sendActor/openSendTaskdisterDailog/?wiid=" + WFContext.WorkflowInstanceId + "&taskId=" + Object.toQueryString("taskId");
  var parm = {};
  var width;
  var height;
  if (window.screen.width > 500) {
    width = 600;
    height = 400;
  } else {
    width = window.screen.width;
    height = window.screen.height - 120;
  }
  FUI.dialog(taskDisterWindowUrl, "提交并完成分发的任务", parm, width, height, function (objectData, index, layerObject) {
    var opinion = objectData;
    if (opinion == "") {
      FUI.Window.showMsg("请填写处理意见");
    } else {
      saveTaskdisterSubmit(that, opinion);
      layerObject.close(index);
    }
    return false;
  }, false);
  return false;
}

function saveTaskdisterSubmit(that, opinion) {
  //保存 先保存工作流，再保存表单，如果是未有实例的情况下保存为草稿，且保存完跳转页面
  var dataJsonParm = {};
  dataJsonParm.formAction = WFContext.WorkflowformAction;
  dataJsonParm.wiid = WFContext.WorkflowInstanceId;
  dataJsonParm.formId = WFContext.FormId;
  dataJsonParm.wid = WFContext.WorkflowId;
  dataJsonParm.appId = WFContext.AppId;
  dataJsonParm.taskId = WFContext.TaskId;
  dataJsonParm.opinion = opinion;
  WF.Workflowform.submitWorkflowform(that, workflowformSender, "sendCompletedTaskdisterTask", null, dataJsonParm, null, null, function (mssg) {
    Object.toCloseLoading();
    if (mssg === false) return false;
    if (mssg.success) {
      if (window.opener != null) {
        try {
          //如果有自定义的方法调用业务表单自定义刷新父窗口的方法
          if (typeof customRefreshOpenerWindow == "function") {
            customRefreshOpenerWindow.call(this);

          } else {
            window.opener.window.refreshTargetGrid("grid");

          }
        } catch (err) {
        }

      }
      if (WFContext.WorkflowformAction == WF.WorkflowformAction.NoInstance) {
        FUI.Window.showMsg2(mssg.msg, null, 1);
        //拟稿保存后跳转到草稿模式
        window.location = __webpath + "/workflow/workflowform/index/?appId=" + WFContext.AppId + "&formAction=2&wiid=" + WFContext.WorkflowInstanceId + "&taskId=" + WFContext.TaskId;
      } else {
        FUI.Window.showMsg(mssg.msg, null, 1, function () {
          if (window.opener != null) {
            if (window.screen.width > 500) {
              window.close();
            } else {
              window.history.back();
            }
          }
          else {
            if (window.screen.width > 500) {
              FUI.Window.closeEdit(true, 'grid');
            } else {
              window.history.back();
            }

          }
        });
      }
    } else {

      alert(mssg.msg);
    }
  });
  return false;
};

//**************************************************

//****************沟通传递窗口 **********************************
//打开沟通记录列表
function showHistoryTaskCommunication() {
  var width;
  var height;
  if (window.screen.width > 500) {
    width = 900;
    height = 500;
  } else {
    width = window.screen.width;
    height = window.screen.height - 120;
  }
  var taskDisterWindowUrl = __webpath + "/workflow/sendActor/showHistoryTaskdisterDailog/?type=taskCommunication&wiid=" + Object.toQueryString("wiid") + "&aiid=" + WFContext.CurrentActivityInstanceId;
  FUI.Window.openEdit(taskDisterWindowUrl, "查看传递沟通过程", "View", null, width, height, null, null, null, false);
  return false;
}

//打开沟通窗口
function openSendNextTaskCommunication($vm, beforeFunName) {
  var width;
  var height;
  if (window.screen.width > 500) {
    width = 900;
    height = 500;
  } else {
    width = window.screen.width;
    height = window.screen.height - 120;
  }
  var tip = "沟通动作将不影响表单数据的保存，<br>如需要保存表单数据，请点击按钮工具栏的“暂存”或“保存”按钮，然后再点进行“传递沟通”，<br>点击“取消”返回。点击“确定”将继续执行沟通传递。";
  FUI.Window.confirm(tip, "", function () {
    var taskDisterWindowUrl = __webpath + "/workflow/sendActor/taskdisterSelect/?type=taskCommunication&wiid=" + Object.toQueryString("wiid") + "&taskId=" + Object.toQueryString("taskId");
    FUI.Window.openEdit(taskDisterWindowUrl, "任务传递沟通", "Edit", null, width, height, null, null, null, false);
    return false;
  });
}

//完成沟通
function openComplateTaskCommunicationDialog() {
  var url = __webpath + "/workflow/sendActor/openSendTaskCommunicationDailog/?wiid=" + Object.toQueryString("wiid") + "&taskId=" + Object.toQueryString("taskId");
  var parm = {};
  var width;
  var height;
  if (window.screen.width > 500) {
    width = 760;
    height = 500;
  } else {
    width = window.screen.width;
    height = window.screen.height - 120;
  }
  FUI.dialog(url, "完成沟通", parm, width, height, function (objectData, index) {
    var opinion = objectData.opinion;
    var actorJson = objectData.actorJson;
    var alermMsg = actorJson == "" ? "您确定完成沟通提交？" : "您确定继续传递到下一位沟通用户？";
    if (opinion == "") {
      FUI.Window.showMsg("请填写沟通意见");
    } else {
      FUI.Window.confirm(alermMsg, "温馨提示", function (index) {
        saveTaskCommunicationSubmit(opinion, actorJson);
      }
      );
    }
    return false;
  }, false, { btnAlign: 'c', fit: false }, { sure: { "text": "提交完成沟通" } });
  return false;
}

//提交完成沟通
function saveTaskCommunicationSubmit(opinion, actorJson) {
  //保存 先保存工作流，再保存表单，如果是未有实例的情况下保存为草稿，且保存完跳转页面
  var dataJsonParm = {};
  dataJsonParm.taskId = WFContext.TaskId;
  dataJsonParm.opinion = opinion;
  dataJsonParm.actorJson = actorJson;
  var method = "sendCompletedTaskCommunication";
  if (actorJson != "") {
    method = "sendToNextTaskCommunication";
  }
  Object.toAjaxJson(workflowformSender, method, dataJsonParm, true, null, function (mssg) {
    if (mssg === false) return false;
    if (mssg.success) {
      if (window.opener != null) {
        try {
          //如果有自定义的方法调用业务表单自定义刷新父窗口的方法
          if (typeof customRefreshOpenerWindow == "function") {
            customRefreshOpenerWindow.call(this);

          } else {
            window.opener.window.refreshTargetGrid("grid");

          }
        } catch (err) {
          console.info(err);
        }
      }
      FUI.Window.showMsg(mssg.msg, null, 1, function () {
        if (window.opener != null) {
          if (window.screen.width > 500) {
            window.close();
          } else {
            window.history.back();
          }
        }
        else {
          if (window.screen.width > 500) {
            FUI.Window.closeEdit(true, 'grid');
          } else {
            window.history.back();
          }

        }
      });
    } else {

      alert(mssg.msg);
    }
  });
  // WF.Workflowform.submitWorkflowform(workflowformSender, method, null, dataJsonParm, null, null, function (mssg) {
  //     Object.toCloseLoading();
  //
  // });
  return false;
};

//**************************************************


function $collectParmsUsers() {
  return null;
  //在这里写收集用户的代码
  //var users=[{"value":"admin","text":"系统管理员"},{"value":"admintest","text":"test"}];
  //return users
}
