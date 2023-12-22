/**
* 版权声明
* F2BPM 在线Web流程设计器
* 作者: 广州致博软件科技有限公司 版权所有
* www.f2bpm.com
*/
//属性打开窗口地址
var windowDialog = {
  advancedOptionsUrl: __webpath + "/workflow/flowDesigner/advancedOptionsDialog/",
  rejectActivityUrl: __webpath + "/workflow/flowDesigner/rejectActivityDialog/",
  assistActorUrl: __webpath + "/workflow/flowDesigner/actorParamterEdit",
  circulatedActorUrl: __webpath + "/workflow/flowDesigner/actorParamterEdit",
  actorParamterUrl: __webpath + "/workflow/flowDesigner/actorParamterEdit",
  extendedPropertyUrl: __webpath + "/workflow/flowDesigner/extendedPropertyEdit",
  alertUserUrl: __webpath + "/workflow/flowDesigner/commonUserEdit",
  joinRuleParamUrl: __webpath + "/workflow/flowDesigner/extendedPropertyEdit",
  categoryCodeUrl: __webpath + "/workflow/flowDesigner/setCategoryCode",
  splitRuleParamUrl: __webpath + "/workflow/flowDesigner/splitRuleParamDialog",
  transitionConditionUrl: __webpath + "/workflow/flowDesigner/transitionConditionEdit",
  transitionConditionUrlwidth: 860,
  actionButtonsUrl: __webpath + "/workflow/flowDesigner/actionButtonsList",
  urgeRuleUrl: __webpath + "/workflow/flowDesigner/urgeRuleList",
  expirationRuleUrl: __webpath + "/workflow/flowDesigner/expirationRuleList",
  expirationRuleUrlheight: 580,
  expirationRuleUrlwidth: 900,

  procTimeLimitUrl: __webpath + "/workflow/flowDesigner/expirationRuleList",
  procTimeLimitUrlheight: 580,
  procTimeLimitUrlwidth: 900,

  monitorUserUrl: __webpath + "/workflow/flowDesigner/procMonitorUserEdit",
  monitorUserUrlheight: 580,
  monitorUserUrlwidth: 900,

  creatingEventUrl: __webpath + "/workflow/flowDesigner/assemblyEdit",
  creatingEventUrlheight: 500,
  completedEventUrlwidth: 700,

  completedEventUrl: __webpath + "/workflow/flowDesigner/assemblyEdit",
  completedEventUrlheight: 500,
  completedEventUrlwidth: 700,

  activityFormPathUrl: __webpath + "/workflow/flowDesigner/nodeFormEdit",
  subWorkflowAssemblyUrl: __webpath + "/workflow/flowDesigner/windowCommonInputEdit",
  messageTemplateUrl: __webpath + "/workflow/flowDesigner/todoNotifyMessageTemplateList",
  messageTemplateUrlheight: 580,
  messageTemplateUrlwidth: 900,
  textEditorWindowUrl: __webpath + "/workflow/flowDesigner/windowTextEdit",

  trueFalseData: { trueName: 'true', falseName: 'false' }
};
var isSimple = Object.toQueryString("isSimple") || "0";
var disabledGateway = ["eventgateway", "complexgateway", "exclusivegateway", "parallelgateway", "parallelstartgateway", "parallelendgateway", "inclusivegateway", "aggregationgateway"];
var disabledActivityType = [];
if (isSimple == 1) {
  disabledGateway = ["eventgateway", "complexgateway", "exclusivegateway", "parallelgateway", "parallelstartgateway", "parallelendgateway", "inclusivegateway", "aggregationgateway", "autogateway"];
  disabledActivityType = ["branch", "aggregation", "freewhile", "taskdister", "distributestart", "distributeend", "subworkflow", "subworkflowstart", "subworkflowend"];
};
var f2bpmDesignerEvents = {
  defalutValues: {
    //节点默认的宽度
    activityRectWidth:136,
    //节点默认的高度
    activityRectHeight:52
  }
  , customColor: {
    //路过的节点边框色
    markAct: "#87b87f",
    //加深一些路过的节点边框色
    markAct2: "#3EA406",
    //当前节点填充色
    liveActfill: "#FF7F15",
    //路过轨迹线填充色
    markTran: "#87b87f",
    //取消/驳回提单/流程作废时，开始节点或结束节点填充色
    canceled: "#E46060",
    canceled2: "#DC3830"
  },
  //disabledGateway:["autogateway","eventgateway", "complexgateway"],
  disabledGateway: disabledGateway,
  disabledActivityType: disabledActivityType,
  //disabledActivityType:["parallelstart","parallelend","branch","aggregation"],
  onButtonSaveClick: function () {
    var designer = this;
    designer.wfDataToJson();
    //加上泳道及其它画线
    var objectJson = designer.getFlowData();
    if (objectJson.area != undefined && objectJson.area != null) {
      wf.ProcessDef.AreaDescription = "#" + JSON.stringify(objectJson.area) + "#";
    }
    else {
      wf.ProcessDef.AreaDescription = "";
    }
    var jsonData = JSON.stringify(wf);
    Object.toShowLoading();
    var theData = { oper: oper, json: jsonData };
    var mssg = Object.toAjaxJson("/workflow/processDef/", "saveProcessDesigner", theData);
    if (mssg.success == true) {

      FUI.Window.showMsg(mssg.msg, "", "info", function () {
        window.parent.window.refreshTargetGrid("grid");
        try {
          window.opener.window.myvm.refreshGrid("grid");
        } catch (err) { }
        var wid = Object.toQueryString("wid");
        if (wid && wid != undefined && oper == 1) {
          window.location.href = __webpath + "/workflow/processDef/processDesigner/?isSimple=" + isSimple + "&wid=" + wid;
        }
        else {
          FUI.Window.closeBlankWindow(true, "grid");
        }
      });

    }
    else {
      FUI.Window.showMsg(mssg.msg);
    }

  },
  onButtonSaveNewVersionClick: function () {
    var designer = this;
    //升级发布为新版本
    if (oper == 0) {
      FUI.Window.showMsg("当前为全新新增流程状态,无法升级为新版本");
      return false;
    }
    FUI.Window.confirm("<em>危险操作！危险操作！危险操作!重要事情说三遍！</em>本操作是极少情况下才使用，您确定要升级新的流程版本吗（发布升级流程版本后旧的流程实例按旧的流程定义运行，新发起的实例按新的流程版本运行，那么所有的修改是需要在升级发布成功后的流程上做修改，原流程不做修改），如果您的意途不是如括号中讲的需求，请忽需发布升级版，直接点击左上角最大的保存按钮即可？", "发布新版本提醒", function (r) {
      if (r) {
        oper = 2;
        designer.onButtonSaveClick();
      }
    });
  },
  onButtonSaveAsClick: function () {
    var designer = this;
    //另存为副本流程
    if (oper == 0) {
      FUI.Window.showMsg("当前为全新新增流程状态,无法另存为副本！");
      return false;
    }
    FUI.Window.confirm("您确定要复制并另存为副本流程吗？", "升级提醒", function (r) {
      if (r) {
        oper = 3;
        designer.onButtonSaveClick();
      }
    });
  },
  onButtonNewClick: function () {
    var designer = this;
    isSysWorking = true;
    designer.clearAllData();
    wfData = {};
    wf = $.extend(true, {}, wfTemp);
    wf.ProcessDef.WorkflowId = designer.guid();
    designer.setFlowTitle(wf.ProcessDef.WorkflowName);
    designer.reRender();
    this.onFlowTitleClick();
    oper = 0;
    isSysWorking = false;
  },
  onButtonFreshClick: function () {
    var designer = this;

    isSysWorking = true;
    designer.clearAllData();
    wfData = {};
    wf = $.extend(true, {}, wfClone);
    gf = $.extend(true, {}, gfClone);
    if (!wf || !wf.ProcessDef) {
      wf = $.extend(true, {}, wfTemp);
      wf.ProcessDef.WorkflowId = designer.guid();
      designer.setFlowTitle(wf.ProcessDef.WorkflowName);
    }
    designer.loadFlowData(gf);
    designer.reRender();
    designer.onFlowTitleClick();
    isSysWorking = false;
  }
  , onExtendClick: function (name, domthis) {
    alert(name);
  }
  , onTranPointMove: function (lineId, newStartId, newEndId) {
    var designer = this;
    var type = "tran";
    this.mapToGrid(designer, lineId, type, null, null, null, null, "ToActivityId", newEndId);
    this.mapToGrid(designer, lineId, type, null, null, null, null, "FromActivityId", newStartId);
    return true;
  },
  onActivityAdd: function (id, type, json) {
    var designer = this;
    if (isSysWorking) {
      return true;
    }

    if (this.findwfData(id, type, "exists") == undefined) {
      var node = $.extend(true, {}, wfNodeTemp);
      node.ActivityId = id;
      node.WorkflowId = wf.ProcessDef.WorkflowId;
      node.ActivityType = designer.getActivityAlias(json.activitytype);
      if (json.activityName) node.ActivityName = json.activityName;
      var values = this.getDefaultValue(json.activitytype);
      node.JoinType = values.JoinType;
      node.SplitType = values.SplitType;
      node.RejectBackType = values.RejectBackType;
      json.width = values.width;
      json.height = values.height;
      node.Width = values.width;
      node.Height = values.height;
      node.PostionX = json.left;
      node.PostionY = json.top;
      if (values.RespondType) {
        node.RespondType = values.RespondType;
      }
      node.ActivityCode = values.ActivityCode;
      wf.ProcessDef.ActivityList.Activity.push(node);
      //designer.onItemFocus(id, "act");

      //this.mapToGrid(designer, id, "act", json.left, json.top, json.width, json.height, json.activityName);

    }
    return true;
  },

  onTransitionAdd: function (id, type, json) {
    if (this.findwfData(id, type, "exists") == undefined) {
      var line = $.extend(true, {}, wfLineTemp);
      line.TransitionId = id;
      line.LineType = "sl";
      line.WorkflowId = wf.ProcessDef.WorkflowId;
      line.FromActivityId = json.from;
      line.ToActivityId = json.to;

      line.PostionM = json.M || 0;
      //找到节点
      var nodeSetList = this.findwfData(json.from, "act").TransitionList;
      if (nodeSetList.Transition == undefined) {
        nodeSetList.Transition = [];
        nodeSetList.Transition.push(line);
      }
      else if (nodeSetList.Transition instanceof Array) {
        nodeSetList.Transition.push(line);
      }
      else {
        var json = nodeSetList.Transition;
        nodeSetList.Transition = [];
        nodeSetList.Transition.push(json);
        nodeSetList.Transition.push(line);
      }
      //designer.onItemFocus(id,"tran");
      //this.mapToGrid(designer, id, "tran", json.left, json.top, json.width, json.height, json.name, json.M);
    }
    return true;
  },
  onItemDel: function (id, type) {
    if (isSysWorking) {
      return true;
    }
    if (wfData[id]) {
      delete wfData[id];//删除右侧行数据
    }
    this.findwfData(id, type, "delete");//删除行数据
    return true;
  },
  onLineMove: function (id, M) {
    this.mapToGrid(this, id, null, null, null, null, null, null, M);
    return true;
  },
  onTranLineSetType: function (id, type, M) {
    this.mapToGrid(this, id, type, null, null, null, null, null, M);
    return true;
  },
  setTryPlanToUpdateItem: function (id, type, nameValueArr) {
    //设置计算要修改的对象
    if (wfData[id] == undefined) {
      wfData[id] = nameValueArr;
    }
    return wfData;
  },
  cleanWfData: function () {
    //清空编辑中的数据
    wfData = [];
    return wfData;
  },
  onItemMove: function (id, type, left, top) {
    this.mapToGrid(this, id, type, left, top, null, null, null, null);
    return true;
  },
  onItemRename: function (id, name, type) {
    this.mapToGrid(this, id, type, null, null, null, null, name, null);
    this.onItemFocus(id, type);
    return true;
  },
  onItemResize: function (id, type, width, height) {
    this.mapToGrid(designer, id, type, null, null, width, height, null, null);
    return true;
  },
  onViewFocus: function (id, name, nodeType) {
    var wiid = Object.toQueryString('wiid');
    var isHistory = Object.toQueryString('isHistory');
    FUI.Window.openEdit("/workflow/pageRoute/showActivityApprovalHistory/?isHistory=" + isHistory + "&wiid=" + wiid + "&activityId=" + id, "【" + name + "】环节经办情况", FUI.FormAction.View, '', 780, 360);
  },
  onItemFocus: function (id, type) {
    focusID = id;
    focusType = type;
    if (wfData[id] == undefined) {
      wfData[id] = this.getRows(type, id);
    }
    this.currEidtObjId = focusID;
    this.currEidtObjType = focusType;
    this.refleshGrid(wfData[id]);
    return true;
  },
  onFlowTitleClick: function () {
    focusID = "title";
    focusType = "title";
    if (wfData.title == undefined) {
      if (typeof this.getRows == "function")
        wfData.title = this.getRows("title");
    }
    this.currEidtObjId = focusID;
    this.currEidtObjType = focusType;
    this.refleshGrid(wfData.title);
  },
  refleshGrid: function (dataSource) {
    var isSimple = Object.toQueryString("isSimple") || "0";
    var FLOW = this;
    var groupRows = dataSource;
    var newDataSource = [];
    $.each(groupRows, function (g_index, g) {
      if (isSimple == "1") {
        if (g.value == 'advanced' || g.value == 'other') {
          return true;
        }
      }
      var gItem = Object.toDeepClone(g);
      var children = [];
      $.each(g.children, function (i, itemNV) {
        if (isSimple == "1") {
          if (!FLOW.isNotShowPropertyName(itemNV.name) && !FLOW.isSimpleNotShow(itemNV.name)) {
            children.push(itemNV);
          };
        } else {
          if (!FLOW.isNotShowPropertyName(itemNV.name)) {
            children.push(itemNV);
          };
        };
      });
      gItem.children = children;
      newDataSource.push(gItem);
    });
    dg.reload({ data: newDataSource });
  },
  setGridAttrValue: function (name, index) {
    var objId = designer.currEidtObjId;
    var objtype = designer.currEidtObjType;
    var jsonItem = designer.getAttrJsonFromWfData(objId, objtype, name);
    if (jsonItem.editor.type == "window" || jsonItem.editor.type == "text") {
      var opt = jsonItem.editor.options;
      var obj = new Object();
      if (jsonItem.value instanceof Object) {
        obj.value = jsonItem.value[name] || jsonItem.value["content"];
        if (obj.value == undefined) {
          obj.value = "";
        };
      } else {
        obj.value = jsonItem.value;
      }
      obj.title = opt.title || "";
      obj.name = name;
      obj.otherParm = opt.otherParm;
      window.currentWindowTargetObjectValue = obj;
      FUI.Window.openEdit(opt.url, opt.title, "Edit", null, opt.width, opt.height);
    }
  },
  gridDropPropertyChange: function (name, thisObj) {
    var selectValue = $(thisObj).val();
    setTargetValue(name, selectValue);
  },
  gridAttrCheckbox: function (name, thisObj) {
    var value = $(thisObj).is(':checked');
    setTargetValue(name, value);
  }
  , getEditor: function (name, row) {
    var FLOW = this;
    var activityTypeBoxArr = [];
    $.each(FLOW.activityTypeData, function (i, item) {
      activityTypeBoxArr.push({ "name": item.title, "value": item.alias });
    });
    $.each(FLOW.gatewayTypeData, function (i, item) {
      if (item.alias == "Lane") return true;
      activityTypeBoxArr.push({ "name": item.title, "value": item.alias });
    });

    switch (name) {
      case "WorkflowId":
      case "ActivityId":
      case "TransitionId":
      case "WorkflowKey":
      case "IsCurrent":
      case "Version":
      case "IsDeleted":
      case "FromActivityId":
      case "ToActivityId":
      case "ActorParser":
      case "PostionM":
      case "LastModifier":
      case "PostionX":
      case "PostionY":
        return "";
      case "LastModTime":
      case "CreatedTime":
        return "datetimebox";
      case "LineType":
        return {
          type: 'combobox',
          options: {
            valueField: 'value',
            textField: 'name',
            required: true,
            panelHeight: 90,
            value: "sl",
            data: [
              { "name": "直线", "value": 'sl' },
              { "name": "折线[左右移动]", "value": 'lr' },
              { "name": "折线[上下移动]", "value": 'tb' },
              { "name": "多段线[多段线]", "value": 'pl' }

            ]
          }
        };
      case "ActivityType":
        return {
          type: 'combobox',
          options: {
            valueField: 'value',
            textField: 'name',
            required: true,
            panelHeight: 250,
            value: "Normal",
            data: activityTypeBoxArr
          }
        };
      case "RespondType":
        return {
          type: 'combobox',
          options: {
            valueField: 'value',
            textField: 'name',
            required: true,
            panelHeight: 90,
            value: "anyone",
            data: [
              { "name": "任一人", "value": 'anyone' },
              { "name": "全部人", "value": 'all' },
              { "name": "动态计算", "value": 'dynamic' }
            ]
          }
        };
      case "RejectType":
        return {
          type: 'combobox',
          options: {
            valueField: 'value',
            textField: 'name',
            required: true,
            panelHeight: 150,
            value: "OnlyStart",
            data: [
              { "name": "不可驳回", "value": 'None' },
              { "name": "仅驳回开始", "value": 'OnlyStart' },
              { "name": "仅驳回上一步", "value": 'OnlyPreActivity' },
              { "name": "仅驳回最近上一步", "value": 'OnlyLastPreActivity' },
              { "name": "仅驳回开始或上一步", "value": 'OnlyStartOrPreActivity' },
              { "name": "仅驳回开始或最近上一步", "value": 'OnlyStartOrLastPreActivity' },
              { "name": "任意历史可驳回节点", "value": 'AnyHistoryActivity' },
              { "name": "指定驳回历史节点", "value": 'FixActivity' }
            ]
          }
        };
      case "JoinType":
        return {
          type: 'combobox',
          options: {
            valueField: 'value',
            textField: 'name',
            required: true,
            panelHeight: 120,
            value: "JoinXOR",
            data: [
              { "name": "异或聚合", "value": 'JoinXOR' },
              { "name": "多重聚合", "value": 'JoinOR' },
              { "name": "同步聚合", "value": 'JoinAnd' },
              { "name": "动态聚合", "value": 'JoinOrAnd' }
            ]
          }
        };
      case "SplitType":
        return {
          type: 'combobox',
          options: {
            valueField: 'value',
            textField: 'name',
            required: true,
            panelHeight: 90,
            value: "SplitXOR",
            data: [
              { "name": "异或发散", "value": 'SplitXOR' },
              { "name": "多重发散", "value": 'SplitOR' },
              { "name": "同步发散", "value": 'SplitAnd' }
            ]
          }
        };
      case "EnterType":
        return {
          type: 'combobox',
          options: {
            valueField: 'value',
            textField: 'name',
            required: true,
            panelHeight: 60,
            value: "Manual",
            data: [
              { "name": "手动[Manual]", "value": 'Manual' },
              { "name": "自动[Auto]", "value": 'Auto' }


            ]
          }
        };
      case "NodeOutType":
      case "OutType":
        return {
          type: 'combobox',
          options: {
            valueField: 'value',
            textField: 'name',
            required: true,
            panelHeight: 60,
            value: "Manual",
            data: [
              { "name": "弹窗手动再次选择", "value": 'Manual' },
              { "name": "不弹窗自动计算", "value": 'Auto' }

            ]
          }
        };
      case "NotifyType":
        return {
          type: 'combobox',
          options: {
            valueField: 'value',
            textField: 'name',
            required: true,
            panelHeight: 120,
            value: "Manual",
            data: [
              { "name": "无", "value": '0' },
              { "name": "短信", "value": '1' },
              { "name": "邮件", "value": '2' },
              { "name": "企业微信", "value": '4' },
              { "name": "系统消息", "value": '8' },

              { "name": "短信+邮件", "value": '3' },
              { "name": "短信+企业微信", "value": '5' },
              { "name": "邮件+企业微信", "value": '6' },
              { "name": "短信+邮件+企业微信", "value": '7' },
              { "name": "短信+系统消息", "value": '9' },
              { "name": "邮件+系统消息", "value": '10' },
              { "name": "邮件+系统消息+企业微信", "value": '14' },
              { "name": "短信+邮件+企业微信+系统消息", "value": '15' }
            ]
          }
        };
      case "RejectBackType":
        return {
          type: 'combobox',
          options: {
            valueField: 'value',
            textField: 'name',
            required: true,
            panelHeight: 120,
            value: "Manual",
            data: [
              { "name": "按流程图执行", "value": 'flowmap' },
              { "name": "直来直往", "value": 'direct' }

            ]
          }
        };
      case "RejectActivity":
        return {
          type: 'window',
          options: {
            title: "【" + row["ActivityName"] + "】指定驳回历史节点",
            url: windowDialog.rejectActivityUrl + '?wid=' + row["WorkflowId"],
            width: windowDialog.rejectActivityUrlwidth || 530,
            height: windowDialog.rejectActivityUrlheight || 490,
            otherParm: row["WorkflowId"]
          }
        };
      case "AssistActor":
        return {
          type: 'window',
          options: {
            title: "【" + row["ActivityName"] + "】转办参与者设置",
            url: windowDialog.assistActorUrl,
            width: windowDialog.assistActorUrlwidth || 900,
            height: windowDialog.assistActorUrlheight || 550,
            otherParm: row["WorkflowId"]
          }
        };
      case "CirculatedActor":
        return {
          type: 'window',
          options: {
            title: "【" + row["ActivityName"] + "】传阅参与者设置",
            url: windowDialog.circulatedActorUrl,
            width: windowDialog.circulatedActorUrlwidth || 900,
            height: windowDialog.circulatedActorUrlheight || 550,
            otherParm: row["WorkflowId"]
          }
        };
      case "ActorParamter":
        return {
          type: 'window',
          options: {
            title: "【" + row["ActivityName"] + "】待办参与者设置",
            url: windowDialog.actorParamterUrl,
            width: windowDialog.actorParamterUrlwidth || 900,
            height: windowDialog.actorParamterUrlheight || 550,
            otherParm: row["WorkflowId"]
          }
        };
      case "ExtendedProperty":
        return {
          type: 'window',
          options: {
            title: "【" + row["ActivityName"] + "】扩展属性",
            url: windowDialog.extendedPropertyUrl,
            width: windowDialog.extendedPropertyUrlwidth || 470,
            height: windowDialog.extendedPropertyUrlheight || 490,
            otherParm: row["WorkflowId"]
          }
        };
      case "AlertUser":
        return {
          type: 'window',
          options: {
            title: "【" + row["ActivityName"] + "】自动消息提醒用户设置",
            url: windowDialog.alertUserUrl,
            width: windowDialog.alertUserUrlwidth || 750,
            height: windowDialog.alertUserUrlheight || 500,
            otherParm: row["WorkflowId"]
          }
        };
      // case "CirculatedActor":
      // return {
      // type: 'window',
      // options: {
      // title:"设置自动传阅用户",
      // url:'../Common/CommonUserEdit.aspx',
      // width:750,
      // height:450,
      // otherParm:row["WorkflowId"]
      // }
      // };
      // case "AssistActor":
      // return {
      // type: 'window',
      // options: {
      // title:"设置转办用户",
      // url:'../Common/CommonUserEdit.aspx',
      // width:750,
      // height:450,
      // otherParm:row["WorkflowId"]
      // }
      // }
      case "JoinRuleParam":
        return {
          type: 'window',
          options: {
            title: "聚合条件设置",
            url: windowDialog.joinRuleParamUrl,
            width: windowDialog.joinRuleParamUrlwidth || 470,
            height: windowDialog.joinRuleParamUrlheight || 470,
            otherParm: row["WorkflowId"]
          }
        };
      case "MonitorUser":
        return {
          type: 'window',
          options: {
            title: "设置流程监管员",
            url: windowDialog.monitorUserUrl,
            width: windowDialog.monitorUserUrlwidth || 600,
            height: windowDialog.monitorUserUrlheight || 400,
            otherParm: JSON.stringify({ name: "MonitorUser", wid: row["WorkflowId"], des: "功能描述：设置流程监管员" })
          }
        };
      case "ProcTimeLimit":
        return {
          type: 'window',
          options: {
            title: "流程超时设置",
            url: windowDialog.procTimeLimitUrl,
            width: windowDialog.procTimeLimitUrlwidth || 870,
            height: windowDialog.procTimeLimitUrlheight || 460,
            otherParm: JSON.stringify({ name: "ProcTimeLimit", wid: row["WorkflowId"], des: "功能描述：设置流程的超时配置" })
          }
        };
      case "CategoryCode":
        return {
          type: 'window',
          options: {
            title: "设置流程定义分类",
            url: windowDialog.categoryCodeUrl,
            width: windowDialog.categoryCodeUrlwidth || 300,
            height: windowDialog.categoryCodeUrlheight || 440,
            otherParm: JSON.stringify({ wid: row["wid"] })
          }
        };
      case "SplitRuleParam":
        return {
          type: 'window',
          options: {
            title: "【" + row["ActivityName"] + "】发散条件设置",
            url: windowDialog.splitRuleParamUrl + "/?wid=" + row["WorkflowId"] + "&activityId=" + row["ActivityId"],
            width: windowDialog.splitRuleParamUrlwidth || 850,
            height: windowDialog.splitRuleParamUrlheight || 520,
            otherParm: JSON.stringify({ wid: row["WorkflowId"] })
          }
        };
      case "TransitionCondition":
        return {
          type: 'window',
          options: {
            title: "迁移条件编辑",
            url: windowDialog.transitionConditionUrl,
            width: windowDialog.transitionConditionUrlwidth || 750,
            height: windowDialog.transitionConditionUrlheight || 540,
            otherParm: JSON.stringify({ transitionId: row["TransitionId"], fromActivityId: row["FromActivityId"], toActivityId: row["ToActivityId"], wid: row["WorkflowId"] })
          }
        };
      case "ActionButtons":
        return {
          type: 'window',
          options: {
            title: "【" + row["ActivityName"] + "】操作按钮设置",
            url: windowDialog.actionButtonsUrl,
            width: windowDialog.actionButtonsUrlwidth || 670,
            height: windowDialog.actionButtonsUrlheight || 490,
            otherParm: JSON.stringify({ activityId: row["ActivityId"], wid: row["WorkflowId"], des: "功能描述：设置节点按钮上可用的按钮" })
          }
        };
      case "AdvancedOptions":
        return {
          type: 'window',
          options: {
            title: "【" + row["ActivityName"] + "】高级设置",
            url: windowDialog.advancedOptionsUrl + '?wid=' + row["WorkflowId"] + '&activityId=' + row["ActivityId"],
            width: windowDialog.advancedOptionsUrlwidth || 900,
            height: windowDialog.advancedOptionsUrlheight || 580,
            otherParm: JSON.stringify({ activityId: row["ActivityId"], wid: row["WorkflowId"], des: "功能描述：设置节点的高级配置" })
          }
        };
      case "UrgeRule":
        return {
          type: 'window',
          options: {
            title: "【" + row["ActivityName"] + "】催办设置",
            url: windowDialog.urgeRuleUrl,
            width: windowDialog.urgeRuleUrlwidth || 870,
            height: windowDialog.urgeRuleUrlheight || 520,
            otherParm: JSON.stringify({ activityId: row["ActivityId"], wid: row["WorkflowId"], des: "功能描述：设置该节点的催办规则" })
          }
        };
      case "ExpirationRule":
        return {
          type: 'window',
          options: {
            title: "【" + row["ActivityName"] + "】节点时限设置",
            url: windowDialog.expirationRuleUrl,
            width: windowDialog.expirationRuleUrlwidth || 870,
            height: windowDialog.expirationRuleUrlheight || 460,
            otherParm: JSON.stringify({ activityId: row["ActivityId"], wid: row["WorkflowId"], des: "功能描述：自定义该节点的时限" })
          }
        };

      case "CreatingEvent":
        return {
          type: 'window',
          options: {
            title: "【" + row["ActivityName"] + "】前置事件",
            url: windowDialog.creatingEventUrl,
            width: windowDialog.creatingEventUrlwidth || 600,
            height: windowDialog.creatingEventUrlheight || 400,
            otherParm: JSON.stringify({ name: "CreatingEvent", wid: row["WorkflowId"], des: "功能描述：当节点创建前触发" })
          }
        };
      case "CompletedEvent":
        return {
          type: 'window',
          options: {
            title: "【" + row["ActivityName"] + "】后置事件",
            url: windowDialog.completedEventUrl,
            width: windowDialog.completedEventUrlwidth || 600,
            height: windowDialog.completedEventUrlheight || 400,
            otherParm: JSON.stringify({ name: "CompletedEvent", wid: row["WorkflowId"], des: "功能描述：当节点完成后触发" })
          }
        };
      case "ActivityFormPath":
        return {
          type: 'window',
          options: {
            title: "【" + row["ActivityName"] + "】节点子表单",
            url: windowDialog.activityFormPathUrl,
            width: windowDialog.activityFormPathUrlwidth || 990,
            height: windowDialog.activityFormPathUrlheight || 560,
            otherParm: { wid: row["WorkflowId"], activityCode: row["ActivityCode"] }
          }
        };

      case "SubWorkflowAssembly":
        return {
          type: 'window',
          options: {
            title: "【" + row["ActivityName"] + "】子流程实现类",
            url: windowDialog.subWorkflowAssemblyUrl,
            width: windowDialog.subWorkflowAssemblyUrlwidth || 550,
            height: windowDialog.subWorkflowAssemblyUrlheight || 370,
            otherParm: row["WorkflowId"]
          }
        };
      case "MessageTemplate":
        return {
          type: 'window',
          options: {
            title: "【" + row["ActivityName"] + "】待办消息提醒设置",
            url: windowDialog.messageTemplateUrl,
            width: windowDialog.messageTemplateUrlwidth || 550,
            height: windowDialog.messageTemplateUrlheight || 370,
            otherParm: JSON.stringify({ activityId: row["ActivityId"], wid: row["WorkflowId"], des: "功能描述：待办消息模板设置" })
          }
        };

      // 是否类
      case "IsCurrent":
      case "IsDeleted":
      case "DefaultShowFlowMap":
      case "Enable":
      case "IsPowerEnable":
      case "IsEditeForm":
      case "IsMustAddOpinion":
      case "IsAttachment":
      case "IsComment":
      case "AllowTransmit":
      case "IsUserSelectedAll":
      case "IsUserRadio":
      case "CanReturnAny":
      case "IsNotifyStartor":
      case "IsWorkflowCirculation":
      case "IsEnableTransmit":
      case "IsFormApproval":
      case "IsShowFormOpinion":
      case "IsShowFormApproval":
      case "IsEnableReject":
      case "IsEnableWithdraw":
      case "IsEnableInvalid":
      case "IsActorSpread":
      case "IsTheHistoryActorPriority":
      case "IsTheEnableWithdraw":
      case "IsTheEnableInvalid":
      case "IsHistoryActorPriority":
      case "IsShowCirculationList":
      case "IsShowApprovalList":
      case "IsShowCommentList":
      case "IsJoinActor":
        return {
          type: 'checkbox',
          options: {
            on: windowDialog.trueFalseData.trueName,
            off: windowDialog.trueFalseData.falseName
          }
        };
      case "":
        break;
    }
    var attrTitle = FLOW.formatName(name, null, null);
    return {
      type: 'text',
      options: {
        title: attrTitle,
        url: windowDialog.textEditorWindowUrl,
        width: 600,
        height: 400,
        otherParm: row["WorkflowId"]
      }
    };
    return "text";
  }
};
