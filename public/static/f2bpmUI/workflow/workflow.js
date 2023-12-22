
/***工作流引擎的封装通用工具类 2014-06-30***/
WF.Workflowform = {
  submitWorkflowform: wf_submitWorkflowForm,
  submitMobileWorkflowForm: wf_submitMobileWorkflowForm,
  submitWorkflow: wf_submitWorkflow
};
WF.Formatter = {
  taskStateFormatter: taskStateFormatter,
  getWorkflowStatusFormatter: getWorkflowStatusFormatter,
  urgeTimesFormatter: urgeTimesFormatter
};
WF.WorkflowformAction = {
  NoInstance: 0,
  Todo: 2,
  View: 3,
  TodoCirculated: 4
};

WF.EnumData = {
  UrgencyData: [{ Value: 0, Text: "" }, { Value: 1, Text: "一般" }, { Value: 2, Text: "紧急" }, { Value: 3, Text: "特别紧急" }, { Value: 4, Text: "最紧急" }],
  ImportanceData: [{ Value: 0, Text: "" }, { Value: 1, Text: "一般" }, { Value: 2, Text: "重要" }, { Value: 3, Text: "特别重要" }]
};
/**********************WrokflowForm 表单相关操作的封装开始**************************/
function procInstStateFormatter(value, row, index) {
  if (value == null || value == undefined || value == "") {
    return "";
  }
  var status = parseInt(value);
  return getWorkflowStatus(status);
}
function getWorkflowStatusFormatter(value, row, index) {
  return getWorkflowStatusFormatter(row);
}

function getWorkflowStatusFormatter(rec) {
  if (typeof rec == 'number') {

    return getWorkflowStatus(rec);
  }
  var status = rec.workflowInstanceState;
  if (status == undefined) {
    status = rec.WorkflowInstanceState;
  }
  if (status == undefined) {
    status = rec.workflowInstanceState;
  }
  return getWorkflowStatus(status);
}
function getWorkflowStatus(status) {
  var myvm = window.myvm;
  //var tag = '<span class="tabbtn {0}">{1}</span>';
  var tag = '<span class="{0}"><i class="fa {1} bigger-120"></i>{2}</span>';
  var tag2 = '<span class="{0}"> {1}</span>';
  var text, style, lable;
  switch (status) {
    case 0: text = myvm != null ? myvm.$t('wfstatus.noInstance') : "拟&nbsp;稿"; style = "fa-file-text-o"; lable = "label label-grey"; break;
    case 1: text = myvm != null ? myvm.$t('wfstatus.draft') : "草&nbsp;稿"; style = "fa-file-text-o"; lable = "label label-grey"; break;
    case 2: text = myvm != null ? myvm.$t('wfstatus.running') : "审批中"; style = "fa-random"; lable = "label label-success"; break;
    case 3: text = myvm != null ? myvm.$t('wfstatus.completed') : "已完成"; style = "fa-stop-circle"; lable = "label label-info"; break;
    case 4: text = myvm != null ? myvm.$t('wfstatus.suspend') : "已挂起"; style = "fa-pause-circle-o"; lable = "label label-inverse"; break;
    case 5: text = myvm != null ? myvm.$t('wfstatus.returnDraft') : "驳回发起人"; lable = "label label-danger"; break;
    case 6: text = myvm != null ? myvm.$t('wfstatus.returnActivity') : "退&nbsp;回"; style = "fa-reply"; lable = "label label-warning"; break;
    case 99: text = myvm != null ? myvm.$t('wfstatus.canceled') : "已作废"; style = "fa-trash"; lable = "label label-grey"; break;
    case 100: text = myvm != null ? myvm.$t('wfstatus.deleted') : "已删除"; style = "fa-trash"; lable = "label label-grey"; break;
  }
  if (status == 5) {
    return Object.toStringFormat(tag2, lable, text);
  }
  return Object.toStringFormat(tag, lable, style, text);
}

function taskStateFormatter(rec, isCube) {
  var myvm = window.myvm;
  var value = rec.taskState;
  let unread = myvm != null ? myvm.$t('taskState.unread') : '送达';
  let readed = myvm != null ? myvm.$t('taskState.readed') : '处理中';
  let completed = myvm != null ? myvm.$t('taskState.completed') : '已完成';
  let taskclaim = myvm != null ? myvm.$t('taskState.taskclaim') : '已锁定';
  let inCommunication = myvm != null ? myvm.$t('taskState.inCommunication') : '沟通中';
  if (isCube) {
    switch (value) {
      case 0: return "<span class='cube bg-orange font10'>" + unread + "</span>"; break;
      case 1: return "<span class='cube bg-orange font10'>" + readed + "</span>"; break;
      case 2: return "<span class='cube bg-gree font10'>" + completed + "</span>"; break;
      case 3: return "<em class='cube bg-red font10'>" + taskclaim + "</em>"; break;
      case 66: return "<em class='cube bg-red font10'>" + inCommunication + "</em>"; break;
    }
  } else {
    switch (value) {
      case 0: return unread; break;
      case 1: return readed; break;
      case 2: return completed; break;
      case 3: return "<i class='red'>" + taskclaim + "</i>"; break;
      case 66: return "<i class='red'>" + inCommunication + "</i>"; break;
    }
  }

  return "未知";
}

function urgeTimesFormatter(rec) {
  var value = rec.taskUrgeTimes || 0;
  if (value == 0)
    return "<span class=\"badge badge-grey\">" + value + "</span>";
  if (value > 0 && value <= 2)
    return "<span class=\"badge badge-warning\">" + value + "</span>";
  if (value > 2)
    return "<span class=\"badge badge-danger\">" + value + "</span>";
}
var $IsValidateWorkflowForm = true;
//表单提交
//formAction Add，Edit操作类型
//keyId 主键ID值，非必填时可传null
//提交按钮的Jq对象，methodName自定义方法名
//dataJsonParm 额外Json参数，非必填
//clearEmptyValue移除（不提交）空值, callBack回调函数
//isValidate是否校验必填写，默认true
function wf_submitWorkflowForm($vm, url, method, formAction, dataJsonParm, keyId, clearEmptyValue, callBack, isValidate) {
  try {
    var that = $vm;
    if (isValidate == null || isValidate == undefined) {
      isValidate = $IsValidateWorkflowForm;
    }
    var deleteArr = [];
    var item = { name: "formAction", value: formAction };
    var itemkeyId = { name: "keyId", value: keyId };

    // if (isValidate &&FUI.validate($targetForm)== false) {
    // 	 //FUI.Window.showMsg("请填写或选择（*）必填项");
    // 	console.info("请填写或选择（*）必填项");
    //     return false;
    // }
    var formData = [];

    if (that.wfContext.FormType == 'OnlineForm') {
      var busObjectData = FUI.F2Grid.getData($vm);
      var jsonStr = JSON.stringify(busObjectData);
      var busData = { name: "BusObjectDatas", value: jsonStr };
      formData.push(busData);
    } else {
      // 全开发表单
      var jsonStr = JSON.stringify($vm.newData);
      var busData = { name: "BusObjectDatas", value: jsonStr };
      formData.push(busData);
    }

    //能不能最终修改取决于后端的控制
    formData.push({ name: "WorkflowTitle", value: that.wfContext.WorkflowTitle });
    formData.push({ name: "Importance", value: that.wfContext.Importance });
    formData.push({ name: "Urgency", value: that.wfContext.Urgency });

    formData.push({ name: "WorkflowTitle", value: that.wfContext.WorkflowTitle });
    // if(that.wfContext.WorkflowTitle ==""){
    //  FUI.Window.showMsg(null,"工单标题不能为空!");
    //  return false;
    // }


    if (formAction) formData.push(item);
    if (dataJsonParm) {
      var arr = Object.toJsonToArr(dataJsonParm);
      $.each(arr, function (i, item) { formData.push(item); });
    }
    if (keyId) formData.push(itemkeyId);
    //console.log(JSON.stringify(formData));
    var obj = _ajaxJson(url, method, formData, null, null, null);
    if (callBack) {
      callBack(obj);
    }
    else {
      if (obj.success != undefined && obj.success) {
        obj.msg = obj.msg || "操作成功！";
      }
      return obj;
    }
  } catch (err) {
    Object.toCloseLoading();
    FUI.Window.showMsg(null, "提交出错，如有疑问请联系管理员：" + err);
    return false;
  }
  return false;
}


//手机表单提交
//formAction Add，Edit操作类型
//keyId 主键ID值，非必填时可传null
//提交按钮的Jq对象，methodName自定义方法名
//dataJsonParm 额外Json参数，非必填
//clearEmptyValue移除（不提交）空值, callBack回调函数
//isValidate是否校验必填写，默认true
function wf_submitMobileWorkflowForm(url, method, formAction, dataJsonParm, keyId, clearEmptyValue, callBack, isValidate) {
  try {
    isValidate = isValidate || $IsValidateWorkflowForm;
    var deleteArr = [];
    var item = { name: "formAction", value: formAction };
    var itemkeyId = { name: "keyId", value: keyId };
    var $targetForm = $("#WorkflowformContainer");


    //        if (isValidate && $targetForm.form("validate") == false) {
    //           FUI.Window.showMsg("请填写或选择（*）必填项");
    //           return false;
    //        }

    var formData = [];
    if (WFContext.FormType == "OnlineForm") {
      var busObjectData = FUI.F2Grid.getData();
      formData.push(busObjectData);
      if (WFContext.CurrentActivityType == "Start") {
        formData.push({ name: "WorkflowTitle", value: $("#WorkflowTitle").val() });
      }
      else if (WFContext.CurrentIsModifyProcInstTitle == true) {
        formData.push({ name: "WorkflowTitle", value: $("#WorkflowTitle").val() });
        //  if($("#WorkflowTitle").val()==""){
        // 	 FUI.Window.showMsg("工单标题不能为空!");
        // 	 return false;
        //  }
      }
      //var actorSelectedDivData = $("#ActorSelectedDiv").find("[name]:input").serializeArray();
      // $.each(actorSelectedDivData, function (i, item) { formData.push(item); });
    }
    else {
      formData = $targetForm.serializeArray();

    }
    formData.push({ name: "hidSelectUsers", value: $("#hidSelectUsers").val() });
    formData.push({ name: "hidSelectedActivityType", value: $("#hidSelectedActivityType").val() });
    formData.push({ name: "hidSelectedActivityJson", value: $("#hidSelectedActivityJson").val() });
    formData.push({ name: "hidOpinion", value: $("#hidOpinion").val() });

    for (var i in formData) {
      var itemValue = formData[i].value;
      var itemName = formData[i].name;
      //去除服务器端提交过来的东西
      if (itemName == '__VIEWSTATE' || itemName == "__EVENTVALIDATION" || itemName == "__EVENTTARGET") {
        deleteArr.push(i);
      }
      if (itemValue == '请选择' || (clearEmptyValue && itemValue == '')) {
        deleteArr.push(i);
      }
      //处理用户控件时Name去除被加了$的前缀
      if (itemName) {
        var indexNumber = itemName.indexOf("$");
        if (indexNumber > -1) {
          var tempName = itemName.substr(indexNumber + 1);
          formData[i].name = tempName;
        }
      }
    }
    if (deleteArr.length > 0) {
      for (var index in deleteArr)
        delete formData[deleteArr[index]]
    }
    if (formAction) formData.push(item);
    if (dataJsonParm) {
      var arr = Object.toJsonToArr(dataJsonParm);
      $.each(arr, function (i, item) { formData.push(item); });
    }
    if (keyId) formData.push(itemkeyId);
    var obj = _ajaxJson(url, method, formData, null, null, null);
    if (callBack) {
      callBack(obj);
    }
    else {
      if (obj.success != undefined && obj.success) {
        obj.msg = obj.msg || "操作成功！";
      }

      return obj;
    }

  } catch (err) {
    $.alert("submitWorkflowForm内脚本出错：" + err);
    return false;
  }
  return false;
}

//提交工作流但不提交表单
function wf_submitWorkflow(url, method, formAction, dataJsonParm, keyId, callBack) {
  try {
    var formData = [];
    var deleteArr = [];
    var item = { name: "formAction", value: formAction };
    var itemkeyId = { name: "keyId", value: keyId };
    if (formAction) formData.push(item);
    if (dataJsonParm) {
      var arr = Object.toJsonToArr(dataJsonParm);
      $.each(arr, function (i, item) { formData.push(item); });
    }
    if (keyId) formData.push(itemkeyId);
    var obj = _ajaxJson(url, method, formData, null, null, callBack);
    if (callBack) {
      callBack(obj);
    }
    else {
      if (obj.success != undefined && obj.success) {
        obj.msg = obj.msg || "操作成功！";
      }

      return obj;
    }
  } catch (err) {
    FUI.Window.showMsg("submitWorkflow内脚本出错：" + err);
    return false;
  }
  return false;
}
window.toggleWorkflowFormDiv = function (id) {
  $("#" + id).slideToggle(300);
}
//查看流程实例：打开查询流程表单审批详情页面  taskId不为空时是查看已办历史
function openWorkflowfromView($vm, appId, workflowInstanceId, title, taskId, urlStatus) {
  openWindowWorkflowfromView($vm, appId, workflowInstanceId, title, taskId, urlStatus);
  return false;
  // var url=__webpath+"/workflow/workflowform/index/?appId=" + appId + "&wiid=" + workflowInstanceId;
  // FUI.Window.openEdit(url, title, 3, 'grid',null, null, null, null, null,true);
}
//查看： 在浏览器新tab窗口打开详情页面
function openWindowWorkflowfromView($vm, appId, workflowInstanceId, title, taskId, urlStatus) {
  //taskId不为空时是查看已办历史
  var url = __webpath + "/workflow/workflowform/index/?formAction=3&wiid=" + workflowInstanceId;
  if (taskId) {
    url = url + "&taskId=" + taskId;
  }
  let urlOpen = urlStatus || '_blank';
  FUI.Window.open(url, urlOpen)
}
/**********************WrokflowForm 表单相关操作的封装结束**************************/

/**********************流程设计器相关通用脚本开始**************************/
//选择用户：flag：role，user
function selectUserOrRoleItem(flag, targetInputId) {
  var inputId = targetInputId || "ActorInputParam";
  var columnName = "";
  var url = flag == 'role' ? "SelectRoles/" : "SelectUsers/";
  var title = flag == 'role' ? "选择角色" : "选择用户";
  var width = 450;
  var height = 420;
  if (flag == "user") {
    columnName = "UserName";
    var width = 720;
    var height = 400;
  }
  FUI.Window.openEdit(url + "?inputId=" + inputId + "&columnName=" + columnName, title, null, null, width, height);
}



function selectHistoryActivity(wid, targetInputId) {
  var inputId = targetInputId || "ActorInputParam";
  var url = "SelectHistoryActivity.aspx";
  var title = "选择历史审批环节";
  var width = 300;
  var height = 400;
  FUI.Window.openEdit(url + "?inputId=" + inputId + "&keyId=" + wid, title, null, null, width, height);

}

//选择组织
function selectOrg(inputId) {
  inputId = inputId || "BaseDepart";
  var url = "SelectOrg/";
  var title = "选择部门";
  var width = 450;
  var height = 420;
  FUI.Window.openEdit(url + "?inputId=" + inputId + "&keyId=" + wid, title, null, null, width, height);


}
//模太窗口关闭
function cancle() {
  FUI.Window.confirm("您确定要取消本次修改吗？", "温馨提示", function () {
    window.returnValue = null;
    window.close();
  });
}
//清空指定输入框
function onClearEmpty(inputId) {
  $("#" + inputId).val("");
}
/**********************流程设计器相关通用脚本结束**************************/

function appIdformatter(value, row, index) {
  if (!value) return "";
  var tag = '<i class="wfname wf-{0}">{1}</i>';
  var styleFlag;
  if (value.length > 1) {
    styleFlag = value.substring(0, 1);
  }
  var FormateTag = Object.toStringFormat(tag, styleFlag, value);
  return FormateTag;
}

function licenseMessage() {
  var data = Object.toAjaxJson(FUI.Handlers.WorkflowManageHandler, "getLicenseInfo", null, null, null, null, 'json');
  return data;
}


//===运行中的列表&归档结束的实例列表===
var isHistory = Object.toQueryString("isHistory") || 0;
var operatorType = Object.toQueryString("operatorType") || "";
function changeRunningHistoryList(isHistory, url) {
  var newUrl = url.replace('#', '').indexOf('?') > -1 ? url.replace('#', '') + "&isHistory=" + isHistory + "&operatorType=" + operatorType : url.replace('#', '') + "?isHistory=" + isHistory + "&operatorType=" + operatorType;
  location = newUrl;
}
function changeRunningHistoryBtnClass(type) {
  if (type == 0) {
    $("#btn-history").remove("btn-warning");
    $("#btn-history").addClass("btn-default");

    $("#btn-runing").addClass("btn-warning");
    $("#btn-runing").removeClass("btn-default");
  }
  else {
    $("#btn-history").removeClass("btn-default");
    $("#btn-history").addClass("btn-warning");

    $("#btn-runing").removeClass("btn-warning");
    $("#btn-runing").addClass("btn-default");
  }
}
//===运行中的列表&归档结束的实例列表===

