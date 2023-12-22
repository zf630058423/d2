//缓存起来，当第二次读时自动从这里取:格式:{fieldName:{write:true}}
var fieldWritePowers = {};
//缓存起来，当第二次读时自动从这里取:格式:{fieldName:{read:true}}
var fieldReadPowers = {};
//缓存起来，当第二次读时自动从这里取:格式:{fieldName:{read:true,write,required,hidden}}
var fieldPowersCache = {};
//判断指定字段是否有指定类型的权限：powerType：read,write,required,hidden
//没有配置时执行默认规则：read:包括了显示\不可编辑 返回true,write：返回true,required:返回false,hidden:返回false
//权重：hidden>write=read>required
//为空时的状态,为空时不参与运算
var f2bpm_onlineform_getPowerTypeNonePermission = function (powerType) {
  if (powerType == "read") {
    return null;
  } else if (powerType == "write") {
    return null;
  }
  else if (powerType == "required") {
    return null;
  }
  else if (powerType == "hidden") {
    return null;
  }
  return null;
}
// 则从WFContext.formRightJson[fieldName]中取权限的字段或按钮权限定义
var f2bpm_onlineform_isHavePowerByPowerType = function (fieldName, powerType) {
  if (fieldName == undefined || !WFContext.formRightJson || WFContext.isDesign == true) {
    return true;
  }
  //编辑权限
  var currentAccount = WFContext.CurrentAccount || "";
  var currentOrgId = WFContext.CurrentOrgId || "";
  var actCode = WFContext.CurrentActivityCode || "";
  var currentRoleCodes = WFContext.RoleCodes || "";
  var isEnd = WFContext.CurrentActivityType == "End";
  var isView = WFContext.WorkflowformAction > 2;
  var isHavePower = false;
  var fieldItem = WFContext.formRightJson[fieldName];
  if (!fieldItem) {
    //没有配置，
    isHavePower = f2bpm_onlineform_getPowerTypeNonePermission(powerType);
    return isHavePower;
  }
  //尝试从临时缓存中取
  if (fieldPowersCache.hasOwnProperty(fieldName) && fieldPowersCache[fieldName][powerType] != undefined && fieldPowersCache[fieldName][powerType] != null) {
    return fieldPowersCache[fieldName][powerType];
  }

  var powerTypeData = fieldItem[powerType];
  if (powerTypeData == undefined || powerTypeData.type == "none") {
    isHavePower = f2bpm_onlineform_getPowerTypeNonePermission(powerType);
    return isHavePower;
  }
  if (powerTypeData.type == "all") {
    return true;
  }
  var result = false;
  //执行detail运算
  $.each(powerTypeData.detail, function (index, detailItem) {
    var activitys = detailItem.activitys;
    var users = detailItem.users;
    //运算是否在节点范围内要不要执行用户权限计算,如果type为none或all那是一定要执行用户计算的
    if (activitys && activitys.type == "detail") {
      var actArr = activitys.detail.act;
      var isCanExcute = false;
      $.each(actArr, function (i, act) {
        if (act.value == actCode) {
          isCanExcute = true;
        }
      });
      if (isCanExcute == false) {
        //不计算，跳到一个detailItem
        return true;
      }
    }
    //开始执行用户计算
    var users = detailItem.users;
    if (users && users.type == "all") {
      result = true;
    }
    if (result) {
      return false;
    }
    if (users && users.type == "detail") {
      var userDetail = users.detail;
      var userArr = userDetail.user;
      var orgArr = userDetail.org;
      var roleArr = userDetail.role;
      //用户
      if (userArr && userArr.length > 0) {
        $.each(userArr, function (i, tv) {
          if (tv.value == currentAccount) {
            result = true;
          }
        });
      }
      if (result) {
        return false;
      }
      //组织
      if (orgArr && orgArr.length > 0) {
        $.each(orgArr, function (i, tv) {
          if (tv.value == currentOrgId) {
            result = true;
          }
        });
      }
      if (result) {
        return false;
      }
      //角色
      if (roleArr && roleArr.length > 0) {
        var currRoleArr = currentRoleCodes.split(",");
        $.each(roleArr, function (i, tv) {
          if ($.inArray(tv.value, currRoleArr) != -1) {
            result = true;
          }
        });
      }
      if (result) {
        return false;
      }
    }
  });
  if (fieldPowersCache[fieldName] != undefined) {
    fieldPowersCache[fieldName][powerType] = result;
  } else {
    fieldPowersCache[fieldName] = {};
    fieldPowersCache[fieldName][powerType] = result;
  }

  return result;
};
//隐藏权限
var f2bpm_onlineform_isHaveHiddenPower = function (fieldName) {
  if (fieldName == undefined || !WFContext.formRightJson || WFContext.isDesign == true) {
    return null;
  }
  var isHavePower = f2bpm_onlineform_isHavePowerByPowerType(fieldName, "hidden");
  return isHavePower;
}

//只读权限
var f2bpm_onlineform_isHaveReadPower = function (fieldName) {
  if (fieldName == undefined || !WFContext.formRightJson || WFContext.isDesign == true) {
    return null;
  }
  var isHavePower = f2bpm_onlineform_isHavePowerByPowerType(fieldName, "read");
  return isHavePower;
}
//编辑权限
var f2bpm_onlineform_isHaveWritePower = function (fieldName) {
  if (fieldName == undefined || !WFContext.formRightJson || WFContext.isDesign == true) {
    return null;
  }
  var isHavePower = f2bpm_onlineform_isHavePowerByPowerType(fieldName, "write");
  return isHavePower;
};
//必填权限
var f2bpm_onlineform_isHaveRequiredPower = function (fieldName) {
  if (fieldName == undefined || !WFContext.formRightJson || WFContext.isDesign == true) {
    return null;
  }
  var isHavePower = f2bpm_onlineform_isHavePowerByPowerType(fieldName, "required");
  return isHavePower;
}

//执行组件字段的读写必填权限
//返回结果：{hidden:false,write:true,required:false}，只看这三项
var f2bpm_onlineform_excuteFieldPowerByVueFormItem = function (fieldName) {
  //四种结果的默认值，没有配置返回的就是默认值
  var resultPower = { read: false, write: true, required: false, hidden: false };
  if (!WFContext.formRightJson || WFContext.isDesign == true) {
    return resultPower;
  }
  //执行隐藏权限
  var hiddenPower = f2bpm_onlineform_isHaveHiddenPower(fieldName);
  if (hiddenPower) {
    resultPower.hidden = true;
    resultPower.write = false;
    return resultPower;
  }
  //执行只读权限
  var readOnlyPower = f2bpm_onlineform_isHaveReadPower(fieldName);
  if (readOnlyPower != null && readOnlyPower != undefined) {
    resultPower.write = !readOnlyPower;
  }
  //执行编辑权限--按钮时为显示权限
  var writePower = f2bpm_onlineform_isHaveWritePower(fieldName);
  if (writePower != null && writePower != undefined) {
    resultPower.write = writePower;
  }
  //执行必填权限
  if (resultPower.write == true) {
    var requiredPower = f2bpm_onlineform_isHaveRequiredPower(fieldName);
    if (requiredPower != null && requiredPower != undefined) {
      resultPower.required = requiredPower;
    }
  }
  //console.info("resultPower:" +fieldName+ ":" + JSON.stringify(resultPower));
  return resultPower;
}

/**
 * 清除按钮权限缓存数据
 */
var clearFieldCache = function () {
  fieldWritePowers = {}
  fieldReadPowers = {}
  fieldPowersCache = {}
}
