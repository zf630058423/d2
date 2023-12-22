//工作流表单，参考者处理人通用脚本
//作者：罗雄伟
//创建时间：2016-5-8
//描述：处理人的弹出窗口相关操作

var activityContainerId = "ActivitySelectListContainer";
var actorContainerId = "ActorListContainer";

//清除所有选中的用户
window.deleteAllSelectedUser = function (rejectPre) {
  rejectPre = rejectPre || "";
  $("#" + rejectPre + actorContainerId + " input:checked").each(function () {
    $(this).prop("checked", false);
  });

  $(".activityUserSelectCount").each(function () {
    $(this).html("0");
  });
  onSure(rejectPre);
};
//当下一步有且仅有一条分支时选择第一个分支及所有处理人
window.selectedFirstNextActivity = function () {
  //如果只有一条分支时，默认选中第一条及所有人
  var nextTran = $("#ActivitySelectListContainer li:visible").length;
  console.info(nextTran);
  if (nextTran > 0) {
    var rightFirstCheckbox = $("input[activityid][levelcode='activitySelectAllUser']:visible:eq(0)", $("#ActorListContainer"));
    if (nextTran == 1 && rightFirstCheckbox.is(":visible")) {
      rightFirstCheckbox.click();
    }
  }
};
//去除所有左侧单选步骤的选中
window.clearSelectAllActivity = function (rejectPre) {
  rejectPre = rejectPre || "";
  if (WFContext.SplitType != "SplitAnd" && IsOnlyTheEndActivity != "true") {
    $("#" + rejectPre + activityContainerId + " input[levelcode='activity']").each(function () {
      $(this).prop("checked", false);
    });
  }
};


//右侧步骤 全选/反全选指定步骤的处理人
window.onActivitySelectAllUser = function (object, rejectPre) {
  var isChecked = $(object).is(":checked");
  var activityid = $(object).attr("activityid");
  rejectPre = rejectPre || "";
  if ($(object).is(":checked")) {
    //选中左侧节点
    checkedActivity($(object).attr("activityid"), rejectPre);
  }
  //选中与反选下面所有用户
  checkedAndUnCheckActivityActor(object, isChecked, rejectPre);
  onSure(rejectPre);
  setAcitivtyUserSelectCount($(object).attr("activityid"), rejectPre);

};
window.onSure = function (rejectPre) {
  rejectPre = rejectPre || "";
  var selectUsers = [];
  var n = $("#" + rejectPre + actorContainerId + " input[nodeType='user']:checked").length;
  $("#" + rejectPre + "selectCount").html(n);
  if (n > 0) {
    var index = 0;
    $("#" + rejectPre + actorContainerId + " input[nodetype='user']:checked").each(function () {
      var attributes = eval("(" + $(this).attr("attributes") + ")");
      selectUsers.push(attributes);

    });
  }
  var result = selectUsers.length == 0 ? selectUsers = "" : JSON.stringify(selectUsers);
  $("#ActorSelectedDiv input[actorselected='SelectUsers']").val(result);
};

//自动获取指定供选择人，不管选不选中都获取
window.onAutoSureUser = function (rejectPre) {
  rejectPre = rejectPre || "";
  var selectUsers = [];
  var n = $("#" + rejectPre + actorContainerId + " input[nodeType='user']").length;

  if (n > 0) {
    var index = 0;
    $("#" + rejectPre + actorContainerId + " input[nodetype='user']").each(function () {
      var attributes = eval("(" + $(this).attr("attributes") + ")");
      selectUsers.push(attributes);

    });
  }
  else {
    $.messager.alert("提示", "找不到可驳回的处理人");
    return false;
  }
  var result = selectUsers.length == 0 ? selectUsers = "" : JSON.stringify(selectUsers);
  $("#ActorSelectedDiv input[actorselected='SelectUsers']").val(result);
};

//步骤前面展开或收缩
window.showStretch = function (activityid, rejectPre) {
  rejectPre = rejectPre || "";
  $("#" + rejectPre + actorContainerId + " ul[levelcode='activityactor']").each(function () {
    if ($(this).attr("activityid") == activityid) {
      if ($(this).is(":hidden")) {
        $(this).show();
        $("#expend_" + rejectPre + activityid).removeClass("addRight3");
        $("#expend_" + rejectPre + activityid).addClass("subRight3");
      }
      else {
        $(this).hide();
        $("#expend_" + rejectPre + activityid).removeClass("subRight3");
        $("#expend_" + rejectPre + activityid).addClass("addRight3");
      }
    }

  });
};

//获取选中的节点类型
window.getSelectedActivityType = function (rejectPre) {
  rejectPre = rejectPre || "";
  var selectedActivityType = "";
  $("#" + rejectPre + activityContainerId + " input[levelcode='activity']").each(function () {
    if ($(this).is(":checked")) {
      selectedActivityType += $(this).attr("activitytype") + ",";
    }
  });
  if (selectedActivityType != "") {
    return selectedActivityType.substr(0, selectedActivityType.length - 1);
  }
  return selectedActivityType;
};


//显示或隐藏指定节点处理人区域
window.showActivityActorArea = function (activityid, rejectPre) {
  rejectPre = rejectPre || "";
  $("#" + rejectPre + actorContainerId + " ul[levelcode='activityactor']").each(function () {
    var targetActivityid = $(this).attr("activityid");
    if (targetActivityid != activityid) {
      $(this).hide();
      $("#expend_" + rejectPre + targetActivityid).removeClass("subRight3");
      $("#expend_" + rejectPre + targetActivityid).addClass("addRight3");
    }
    else {
      $(this).show();
      $("#expend_" + rejectPre + targetActivityid).removeClass("addRight3");
      $("#expend_" + rejectPre + targetActivityid).addClass("subRight3");

    }
  });

  setActivitybackground(activityid, rejectPre);

};


//设置左侧指定节点的背景色
window.setActivitybackground = function (activityid, rejectPre) {
  rejectPre = rejectPre || "";
  $("#" + rejectPre + activityContainerId + " li").each(function () {
    if ($(this).attr("activityid") != activityid) {
      $(this).removeClass("activityBackground");
    }
    else {
      $(this).addClass("activityBackground");
    }
  });
};
//全选或不全选指定步骤区域的处理人
window.checkedAndUnCheckActivityActor = function (obj, isChecked, rejectPre) {
  rejectPre = rejectPre || "";
  var activityArea = $(obj).parent().parent();
  $("input[type=checkbox]", activityArea).each(function () {
    if (isChecked)
      $(this).prop("checked", true);
    else
      $(this).prop("checked", false);
  });
};

//选中左侧指定的节点
window.checkedActivity = function (activityid, rejectPre) {
  rejectPre = rejectPre || "";
  var $obActivity = $("#" + rejectPre + activityContainerId + " input[levelcode='activity'][activityid='" + activityid + "']");
  $obActivity.prop("checked", true);
  //如果为单选的节点则需要清除其它节点已选择的人
  if ($obActivity.attr("type") == "radio")
    clearExceptActivitySelectedUser(activityid, rejectPre);
};


//清除除指定步骤ID以外的其它步骤已选中的处理人
window.clearExceptActivitySelectedUser = function (activityid, rejectPre) {
  rejectPre = rejectPre || "";
  $("#" + rejectPre + actorContainerId + " ul[levelcode=\"activityactor\"][activityid] ").each(function () {
    if ($(this).attr("activityid") != activityid) {
      $("input:checked", $(this)).each(function () {
        $(this).prop("checked", false);
      });
    }
  });
  $("#" + rejectPre + actorContainerId + " ul[levelcode=\"activityactor\"][activityid]").each(function () {
    if ($(this).attr("activityid") != activityid) {
      setAcitivtyUserSelectCount($(this).attr("activityid"), rejectPre);
    }

  });
};

//统计指定步骤已选中人数
window.setAcitivtyUserSelectCount = function (activityid, rejectPre) {
  rejectPre = rejectPre || "";
  var count = $("#" + rejectPre + actorContainerId + " ul[activityid='" + activityid + "'] input[nodeType='user']:checked").length;
  var countSpan = $("span[activityid='" + activityid + "']", $("#" + rejectPre + actorContainerId));
  countSpan.html(count);
  if (count == 0) {
    countSpan.prev("input[type=checkbox]").prop("checked", false);
  }
};
//节点扩展与收缩
window.onMyTreeNodeStretch = function (obj) {
  var target = $(obj);
  var ul = $(obj).parent().parent().parent().find("ul");
  if (ul.length > 1) {
    ul = $(ul[0]);
  }
  if (ul.is(":hidden")) {
    ul.show();
    $(obj).removeClass("addRight3");
    $(obj).addClass("subRight3");
  }
  else {
    ul.hide();
    $(obj).removeClass("subRight3");
    $(obj).addClass("addRight3");
  }
};
//右侧选中树型的标题文本被选中时(选中人或部门名称)
window.onTreeNodeTitleClick = function (obj) {
  var theInnerCheckBox = $(obj).prev("input[type=\"checkbox\"],input[type=\"radio\"]");
  theInnerCheckBox.click();

};

//右侧选中复选框时(选中人或部门筛选框),同时注意把左侧节点给自动选上防止异或变并行
window.onTreeNodeSelect = function (obj) {
  //部门下用户所在的DIV
  var userDiv = $(obj).parent().next();
  var attributes = eval("(" + $(obj).attr("attributes") + ")");
  var rejectPre = attributes.rejectPre;
  if ($(obj).is(":checked")) {
    //选中左侧节点
    checkedActivity(attributes.activityId, rejectPre);
  }
  $("input[type='checkbox']", userDiv).each(function () {
    $(this).prop("checked", $(obj).is(":checked"));
  });

  onSure(rejectPre);
  setAcitivtyUserSelectCount(attributes.activityId, rejectPre);
  setActivitybackground(attributes.activityId, rejectPre);
};


//最后校验是否处理人选择完毕(当左侧有多个选中节点时确保右侧每个节点都有选中处理人)
window.onVerificationSelectUserCanSend = function (rejectPre) {
  rejectPre = rejectPre || "";
  var result = true;
  var needActivityName = "";
  $("#" + rejectPre + activityContainerId + " input[levelcode='activity']:checked").each(function () {
    var acitvityId = $(this).attr("activityid");
    var activityName = $(this).attr("activityname");
    //是否为满足条件可行的分支
    var isTheCangoBreach = $(this).css("display").indexOf("block") > -1;
    if (isTheCangoBreach) {
      if (parseInt($("#" + rejectPre + actorContainerId + " span[activityid='" + acitvityId + "']").html()) == 0) {
        needActivityName += activityName + ",";
      }
    }
  });
  if (needActivityName != "") {
    var names = needActivityName.substr(0, needActivityName.length - 1);
    FUI.Window.showMsg("请为【" + names + "】选择处理人");
    result = false;
  }
  return result;
};
//处理人选择人员
//orgName：非必填，过滤指定部门人员
window.selectActorUsers = function (inputId, appId, activityCode, activityId, activityName, activityType, isSingle, rejectPre, orgName) {
  isSingle = isSingle || 0;
  if (isSingle == "False" || isSingle == "false") isSingle = 0;
  var taskId = Object.toQueryString("taskId") || "";
  checkedActivity(activityId, rejectPre);
  var keyName = "userId";
  var parm = { "singleSelect": isSingle == 1, data: [], "keyName": keyName };
  var widht = 815;
  var height = 500;
  var orgName = orgName || "";
  var url = __webpath + "/workflow/selector/selectUsers/?orgName=" + orgName;
  var title = "选择用户";
  FUI.dialog(url, title, parm, widht, height, function (objectData, index, layerObject) {
    if (objectData.length > 0) {
      var titles = [];
      var keys = [];
      var data = [];
      //构建选人复选框
      var html = "";
      var intpuType = isSingle == 1 ? "radio" : "checkbox";
      $.each(objectData, function (i, row) {
        var realName = row.realName;
        var userName = row.account;
        var userId = row.userId;
        var dpid = row.orgId;
        var dpname = row.orgName;
        var mobile = row.mobile;
        var email = row.email;
        var tenantId = row.tenantId;
        var item = {
          type: "user", "status": 1, "tenantId": tenantId, "userId": userId, account: userName, realName: realName, "orgId": dpid, orgName: dpname,
          activityType: activityType, activityId: activityId, "activityCode": activityCode, "activityName": activityName,
          rejectPre: rejectPre, mobile: mobile, email: email
        };
        var itemStr = JSON.stringify(item);
        itemStr = itemStr.replace(/\"/g, "'");
        var itemHtml = "<input id=\"" + item.userId + "\" state=\"open\" attributes=\"" + itemStr + "\" class=\"mytree-checkbox\" type=\"" + intpuType + "\" name=\"" + activityCode + "\" checked=\"checked\" nodetype=\"user\" onclick=\"onTreeNodeSelect(this)\">";
        itemHtml = itemHtml + "<span class=\"mytree-title\">" + item.realName + "</span>";
        html = html + itemHtml;
      });
      $("div[class='" + inputId + "']").html(html);
      console.info(objectData);
    } else {
      $("div[class='" + inputId + "']").html("");
    }
    window.onSure(rejectPre);
    window.setAcitivtyUserSelectCount(activityId, rejectPre);
    window.setActivitybackground(activityId, rejectPre);
    layerObject.close(index);
    return false;
  }, true);
};

//角色或部门参与者的分页处理人选择人员--选择的界面暂未实现
window.selectActorByPage = function (inputId, appId, activityCode, activityId, activityName, activityType, isSingle, rejectPre) {
  isSingle = isSingle || 0;
  if (isSingle == "False" || isSingle == "false") isSingle = 0;
  var taskId = Object.toQueryString("taskId") || "";
  checkedActivity(activityId, rejectPre);
  var keyName = "userId";
  var parm = { "singleSelect": isSingle == 1, data: [], "keyName": keyName };
  var widht = 815;
  var height = 500;
  var orgName = orgName || "";
  var url = __webpath + "/workflow/selector/selectUsers/?orgName=" + orgName;
  var title = "选择用户";
  FUI.dialog(url, title, parm, widht, height, function (objectData, index, layerObject) {
    if (objectData.length > 0) {
      var titles = [];
      var keys = [];
      var data = [];
      //构建选人复选框
      var html = "";
      var intpuType = isSingle == 1 ? "radio" : "checkbox";
      $.each(objectData, function (i, row) {
        var realName = row.realName;
        var userName = row.account;
        var userId = row.userId;
        var dpid = row.orgId;
        var dpname = row.orgName;
        var mobile = row.mobile;
        var email = row.email;
        var tenantId = row.tenantId;
        var item = {
          type: "user", "status": 1, "tenantId": tenantId, "userId": userId, account: userName, realName: realName, "orgId": dpid, orgName: dpname,
          activityType: activityType, activityId: activityId, "activityCode": activityCode, "activityName": activityName,
          rejectPre: rejectPre, mobile: mobile, email: email
        };
        var itemStr = JSON.stringify(item);
        itemStr = itemStr.replace(/\"/g, "'");
        var itemHtml = "<input id=\"" + item.userId + "\" state=\"open\" attributes=\"" + itemStr + "\" class=\"mytree-checkbox\" type=\"" + intpuType + "\" name=\"" + activityCode + "\" checked=\"checked\" nodetype=\"user\" onclick=\"onTreeNodeSelect(this)\">";
        itemHtml = itemHtml + "<span class=\"mytree-title\">" + item.realName + "</span>";
        html = html + itemHtml;
      });
      $("div[class='" + inputId + "']").html(html);
      console.info(objectData);
    } else {
      $("div[class='" + inputId + "']").html("");
    }
    window.onSure(rejectPre);
    window.setAcitivtyUserSelectCount(activityId, rejectPre);
    window.setActivitybackground(activityId, rejectPre);
    layerObject.close(index);
    return false;
  }, true);
};
