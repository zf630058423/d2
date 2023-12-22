//FUI 表单元素构建
function getSysDefaultValue(express,WFContext) {
    if (Object.toStartWith(express, "Sql:")) {
        return getDefaultSHSLValueBySql(express,WFContext);
    }
    else if (Object.toStartWith(express, "#") && express.indexOf("#") > -1) {
        return getWildcardValue(express,WFContext);
    }

    return express;
}

//获取通配符的值
function getWildcardValue(express,WFContext) {
    if (express.indexOf("#") > -1) {
        var otherObj={};
        if(WFContext.OtherProperty&&WFContext.OtherProperty.length>0){
            $.each(WFContext.OtherProperty,function(i,item){
                otherObj[item.key]=item.value;
            });
        }
        var name = express.toString().replace("#", "").replace("#", "");
        switch (name) {
            case "GuId": return Object.toGuid();
            case "CurrentDateTime": return Object.toGetCurrentDateTimeString();
            case "CurrentDate": return Object.toGetCurrentDateString();
            case "yyyyMMddhhmmssSSS": return  Object.toGetCurrentDateTimeMillisecond();
            default: {
                if (WFContext[name]) return WFContext[name];
                if (otherObj[name]) return otherObj[name];
            }
        }
    }
    return "";
}

function getDefaultSHSLValueBySql(sql,WFContext) {
    sql = sql.replace("#UserId#", "'" + WFContext["UserId"] + "'");
    sql = sql.replace("#Account#", "'" + WFContext["Account"] + "'");
    sql = sql.replace("#RealName#", "'" + WFContext["RealName"] + "'");
    sql = sql.replace("#OrgId#", "'" + WFContext["OrgId"] + "'");
    sql = sql.replace("#OrgName#", "'" + WFContext["OrgName"] + "'");
    sql = sql.replace("#TenantId#", "'" + WFContext["TenantId"] + "'");

    sql = sql.replace("#CurrentDateTime#", "'" + Object.toGetCurrentDateTimeString() + "'");
    sql = sql.replace("#CurrentDate#", "'" + Object.toGetCurrentDateString() + "'");
    sql = sql.replace("#yyyyMMddhhmmssSSS#", "'" +Object.toGetCurrentDateTimeMillisecond()+ "'");
    sql = sql.replace("#GuId#", "'" +Object.toGuid()+ "'");
    sql = sql.replace("#WorkflowInstanceId#", "'" + WFContext["WorkflowInstanceId"] + "'");
    sql = sql.replace("#CurrentActivityName#", "'" + WFContext["CurrentActivityName"] + "'");
    sql = sql.replace("#CurrentActivityCode#", "'" + WFContext["CurrentActivityCode"] + "'");
   // sql = sql.replace("#MySelfValue#", "'" +inputVal+ "'");
    if(WFContext.OtherProperty&&WFContext.OtherProperty.length>0){
        $.each(WFContext.OtherProperty,function(i,item){
            sql = sql.replace("#"+item.key+"#", "'" +item.value + "'");
        })
    }
    var result = Object.toAjaxJson(FUI.Handlers.FuiFrameworkHandler, "getSHSLBySql", { sql: sql });
    if (result.success) {
        return result.msg;
    } else {
        FUI.Window.showMsg(result.msg);
    }
    return "";
}

//===============扩展单选，多选，下拉选择外部事件=================
function elementExtendEvent(name, value, thisObj) {
  var extendFunName = name.replace(/\./g, "_");
  var isExist = _isExitsFunction(extendFunName);
  if (isExist) {
      var exfunc = eval(extendFunName);
      exfunc(value, name, thisObj);
  }
}

function _isExitsFunction(funcName) {
    try {
        if (typeof(eval(funcName)) == "function") {
            return true;
        }
    } catch(e) {}
    return false;
}