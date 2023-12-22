/*****开发者自己扩展编写的自定义选择器*****/

//表单上使用：自定义选择器示例
//$vm：vue实例对象，
//vueDataObj:回绑数据的对象，如果不传，默认为$vm.data
var custDemoSelector = function ($vm, conf, vueDataObj) {
  var vueDataObj = vueDataObj || $vm.data;
  //comfig指的是选择器配置中{"selectorName":"myNameDemoSelector",isMulti: isMulti,"data":[{"title":"标题","property":"值来源属性","field":"绑定到表单目标字段"}]}
  var isMulti = conf.isMulti;
  if (isMulti == "true" || isMulti == true) {
    isMulti = true;
  } else {
    isMulti = false;
  }
  var callBack = conf.callBack || null;
  var isTest = conf.isTest || false;//是否测试预览
  var singleSelect = !isMulti;
  var initailData = conf.initailData || [];//初始化显示数据
  var fieldData = conf.data;//返回绑定目标字段
  var passParm = conf.passParm || {};
  //传递给页面的对象参数
  var parm = { singleSelect: singleSelect, data: initailData };
  //高级参数 
  conf.varParams = conf.varParams || "";
  if (conf.varParams) {
    //varParams结构[{key:"",value:""}]
    parm.varParams = conf.varParams;
  }
  console.info(parm);
  //*************以下为可修改的代码******************************************** */
  //只需修改这里的页面地址，同时可在URL传入你自己的固定参数和标题
  //当在线表单时：如果需要携带表单上的其它字段做为动态参数，可以通过window.myvm.data来获取表单上的字段值
  //如获取表单某个字段值：
  //console.info(window.myvm.data['KongJian.danXuanAnNiu'])
  var widht = 860;
  var height = 520;
  var url = __webpath + "/workflow/custSelector/custDemoSelector?a=3";
  var title = "自定义对话框开发示例";
  //*************以下代码无需修改******************************************** */
  FUI.dialog(url, title, parm, widht, height, function (objectData, index, layer) {
    if (isTest == true) {
      alert(JSON.stringify(objectData));
    } else if (callBack) {
      callBack.call(this, objectData, index, layerObject);
    } else {
      var resultBindFieldData = {};
      $.each(fieldData, function (index, confItem) {
        //多个字段
        var fieldArr = confItem.field.split(",");
        var propertyName = confItem.property;
        $.each(fieldArr, function (_, fieldName) {
          var targetValue = [];
          //字段取值
          $.each(objectData, function (i, item) {
            var selectedValue = item[propertyName];
            targetValue.push(selectedValue);
          });
          if (vueDataObj.hasOwnProperty(fieldName)) {
            //字段付值
            vueDataObj[fieldName] = targetValue.toString();
          }
          resultBindFieldData[fieldName] = targetValue.toString();
        });
      });
      //回调
      if ($vm["onSelectedSuccess"]) {
        var fn = $vm["onSelectedSuccess"];
        fn(resultBindFieldData);
      }
    }
    layer.close(index);
    return false;
  }, true);
  return false;
};


//节点弹窗选择处理人的自定义选择器示例
//======================自定义对话框 示例参考============================
//自定义对话框选择人员示例
window.demoMyCustomDialogActorUsers = function (inputId, appId, activityCode, activityId, activityName, activityType, isSingle, rejectPre, actorExtendParms) {
  //actorExtendParms：参与者计算器的扩展参数
  if (actorExtendParms) {
    //将~还原回双引号。
    actorExtendParms = actorExtendParms.replaceAll("~", "\"");
    console.info("actorExtendParms:" + actorExtendParms);
  }
  //是否单选
  isSingle = isSingle || 0;
  if (isSingle == "False" || isSingle == "false") isSingle = 0;
  var taskId = Object.toQueryString("taskId") || "";
  checkedActivity(activityId, rejectPre);
  var parm = {};
  var widht = 815;
  var height = 500;
  var orgName = orgName || "";
  //======================================只需要修改Url的地址,标准和所需要的参数==============================
  //在全局变量 WFFormData为当前表单数据 通过 WFFormData["实体名.字段名"]示例： WFFormData["dxjyzb.xingMing"] 拿到具体的表单字段值，可将字段参数拼接在Url后面
  var a = "123";//示例：WFFormData["dxjyzb.xingMing"];
  var url = __webpath + "/workflow/custSelector/custDemoActorSelector?activityCode=" + activityCode + "&activityName=" + activityName + "&isSingle=" + isSingle + "&a=" + a;
  var title = "自定义对话选人框 示例：选择【" + activityName + "】处理人";
  //========================================以下无需要做任何修改=================================================================
  FUI.dialog(url, title, parm, widht, height, function (objectData, index, layerObject) {
    if (objectData.length > 0) {
      var titles = [];
      var keys = [];
      var data = [];
      //构建选人复选框
      var html = "";
      var intpuType = isSingle == 1 ? "radio" : "checkbox";
      $.each(objectData, function (i, row) {
        //返回的数据必须有如下属性realName、account、userId、orgId、orgName、mobile、email、tenantId
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
