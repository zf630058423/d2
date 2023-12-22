/*******************************************************************************
 *
 * 在线表单数据处理
 * 邮箱: 1827528476
 * 日期: 2020=08-13
 * 版权：广州致博软件科技有限公司
 *
 ******************************************************************************/
if (!FUI) {
  var FUI = {};
}

//删除数据收集的主键
var f2grid_global_deleteData = [];//格式：[{tableName:"",keys:[{name: "kj.ZiBiaoKongJian.MyId", value: "12da4e92-3dc4-499a-8ead-163240031cc2"}] } ]
//全局子表字段合计
var f2grid_global_columnCountData = {};
//主vue是否创建并加载完毕
var f2grid_global_mainVueLoadComplated = false;
FUI.F2Grid = {
  //添加一行
  getMathFieldList: $getMathFieldList,
  excuteAllMath: $excuteAllMath,
  checkMyChangeIsNeedToExcuteMath: $checkMyChangeIsNeedToExcuteMath,
  initailData: $initailData,
  collectField: $collectField,
  getData: $getBusObjectData,
  getMainTableData: $getMainTableData,
  getSubData: $getSubData,
  getSubRow: $getSubRow,
  appendToDeleteRows: $appendToDeleteRows,
  addRow: $addRow,
  subAddNVRows: $subAddNVRows,
  addRowData: $addRowData,
  delRow: $delRow,
  delBathRow: $delBathRow,
  delAllRow: $delAllRow,
  custbtnOnClick: $custbtnOnClick,
  toolBarCustbtnOnClick: $toolBarCustbtnOnClick,
  updateParentSubData: $updateParentSubData,
  convertToNameValData: $convertToNameValData,
  convertToPropertyData: $convertToPropertyData,
  convertArrToPropertyData: $convertArrToPropertyData,
  // 重新加载数据
  load: $load,
  //根据默认值的表达式获取系统默认值
  getSysDefaultValue: getSysDefaultValue,
  //公式
  math: {
    checkMath: $checkMath,
    getExpressionFieldList: $getExpressionFieldList
  },
  //是否可编辑
  isHaveWritePower: $isHaveWritePower,
  //是否显示
  isHaveShowPower: $isHaveShowPower,
  //是否必填
  isHaveRequiredPower: $isHaveRequiredPower,
  //执行字段组件的权限
  excuteFieldPowerByVueFormItem: f2bpm_onlineform_excuteFieldPowerByVueFormItem,
  //执行Vue组件的写权限
  excuteFieldWritePowerByVueFormItem: f2bpm_onlineform_excuteFieldWritePowerByVueFormItem,
  //执行控件联动
  excuteTriggerFieldLinkages: f2bpm_onlineform_triggerFieldLinkages,
  //改变控件状态
  changeFieldStatus: f2bpm_onlineform_changeFieldStatus,
  //隐藏或显示子列表操作列
  showOrHideSubtableOperate: f2bpm_onlineform_showOrHideSubtableOperate,
  //隐藏或显示子列表操作列
  showOrHideSubtableColumn: f2bpm_onlineform_showOrHideSubtableColumn,
  //隐藏或显示子列表的默认删除按钮
  showOrHideSubtableDefaultDeleteButton: f2bpm_onlineform_showOrHideSubtableDefaultDeleteButton,
  //隐藏或显示子列表的默认添加按钮
  showOrHideSubtableDefaultAddButton: f2bpm_onlineform_showOrHideSubtableDefaultAddButton,
  //隐藏或显示子列表指定编码的按钮
  showOrHideSubtableTargetButton: f2bpm_onlineform_showOrHideSubtableTargetButton
};
function f2bpm_onlineform_excuteFieldWritePowerByVueFormItem($vm) {
  if (!WFContext.formRightJson || WFContext.isDesign == true) {
    return true;
  }
  var that = $vm;
  if (that.isView === false) {
    //执行编辑权限:isReadOnly：true为不可编辑，false为可编辑
    that.isReadOnly = !FUI.F2Grid.isHaveWritePower(that.field.vModel);
  }
}

//是否可写；应用按钮时：为是否满足显示的条件
function $isHaveWritePower(fieldName) {
  var power = f2bpm_onlineform_excuteFieldPowerByVueFormItem(fieldName);
  if (power.write && power.hidden == false) {
    return true;
  }
  return false;
}
//是否显示
function $isHaveShowPower(fieldName) {
  var power = f2bpm_onlineform_excuteFieldPowerByVueFormItem(fieldName);
  return !power.hidden;
}

//是否必填
function $isHaveRequiredPower(fieldName) {
  var power = f2bpm_onlineform_excuteFieldPowerByVueFormItem(fieldName);
  return power.required;
}

//执行控件联动
function f2bpm_onlineform_triggerFieldLinkages(field, fieldValue, isView) {
  var workflowFormVm = window.myvm;
  var that = workflowFormVm;
  var fieldName = field.vModel;
  var fieldLinkages = field.fieldLinkages || null;
  var isSub = fieldName.split(".").length >= 3;
  if (isSub) {
    //子表触发联动出来，这是不被支持的。
    return false;
  }
  //权重：hidden>write>required
  //格式示例：
  /*   fieldLinkages = [
      {
        id:"01",case: "办公费用", title:"办公费用",then: [
          { type: "field", fieldName: "cost_pay.bz",fieldTitle: "备注", hidden: false, write: true, required: false },
        ]
      }
    ]; */
  if (fieldLinkages && typeof fieldLinkages == "string") {
    fieldLinkages = eval("(" + fieldLinkages + ")");
  }
  if (fieldLinkages == null || fieldLinkages == undefined || fieldLinkages == "") {
    return false;
  }

  console.info(fieldValue);
  //扁平化的字段定义
  var fieldsDef = that.fieldsDef;
  //console.info("控件联动" + fieldName + "| " + fieldValue);
  var canRecoverObj = { required: {}, readOnly: {}, showPower: {} };
  var tiggerFieldList = [];
  $.each(fieldLinkages, function (i, item) {
    var thenArr = item.then;
    $.each(thenArr, function (j, thenItem) {
      var fieldName = thenItem.fieldName;
      if ($.inArray(fieldName, tiggerFieldList) == -1) {
        tiggerFieldList.push(fieldName);
      }
    });
  });
  $.each(fieldLinkages, function (i, item) {
    var caseValue = item.case;
    var isTrue = false;
    if (fieldValue instanceof Array && typeof caseValue == "string" && caseValue) {
      //联动比较值转为数组
      var caseValueArr = caseValue.split(",");
      isTrue = Object.toArrayEqueals(fieldValue, caseValueArr);
    }
    else if (caseValue instanceof Array && fieldValue instanceof Array) {
      isTrue = Object.toArrayEqueals(fieldValue, caseValue);
    } else {
      isTrue = fieldValue == caseValue;
    }
    if (isTrue) {
      var thenArr = item.then;
      $.each(thenArr, function (j, thenItem) {
        var fieldName = thenItem.fieldName;
        var arr = fieldName.split(".");
        var isSub = arr.length >= 3;
        if (isSub) {
          //联动目标子表字段列
          var subTableName = arr[1];
          var subfieldsDef = fieldsDef['subtable.' + subTableName];
          if (thenItem.hidden == true) {
            //隐藏权限最高，如果有开启则其它权限不需要再看，查看状态下只执行此项
            subfieldsDef[fieldName]._isShowPower = false;
            subfieldsDef[fieldName]._isRequired = false;
            canRecoverObj["showPower"][fieldName] = false;
            canRecoverObj["required"][fieldName] = false;
          } else if (thenItem.write == false) {
            //不可写，即为只读
            subfieldsDef[fieldName]._isReadOnly = true;
            subfieldsDef[fieldName]._isRequired = false;
            canRecoverObj["readOnly"][fieldName] = false;
            canRecoverObj["required"][fieldName] = false;

          } else if (thenItem.write == true && !isView) {
            //可写时，才去修改它是否必填
            subfieldsDef[fieldName]._isReadOnly = false;
            subfieldsDef[fieldName]._isRequired = thenItem.required;
            canRecoverObj["readOnly"][fieldName] = false;
            canRecoverObj["required"][fieldName] = false;
          }
        } else {
          //联动目标主表字段
          if (thenItem.hidden == true) {
            //隐藏权限最高，如果有开启则其它权限不需要再看，查看状态下只执行此项
            if (fieldsDef[fieldName]) {
              fieldsDef[fieldName]._isShowPower = false;
              fieldsDef[fieldName]._isRequired = false;
            }

            canRecoverObj["showPower"][fieldName] = false;
            canRecoverObj["required"][fieldName] = false;
          } else if (thenItem.write == false) {
            //不可写，即为只读
            if (fieldsDef[fieldName]) {
              fieldsDef[fieldName]._isReadOnly = true;
              fieldsDef[fieldName]._isRequired = false;
            }

            canRecoverObj["readOnly"][fieldName] = false;
            canRecoverObj["required"][fieldName] = false;

          } else if (thenItem.write == true && !isView) {
            //可写时，才去修改它是否必填
            if (fieldsDef[fieldName]) {
              fieldsDef[fieldName]._isReadOnly = false;
              fieldsDef[fieldName]._isRequired = thenItem.required;
            }

            canRecoverObj["readOnly"][fieldName] = false;
            canRecoverObj["required"][fieldName] = false;
          }
        }
      });
    }
  });
  if (tiggerFieldList && !isView && tiggerFieldList.length > 0) {
    //还原回元始状态
    $.each(tiggerFieldList, function (i, name) {
      var arr = name.split(".");
      var isSub = arr.length >= 3;
      if (isSub) {
        //联动目标子表字段列
        var subTableName = arr[1];
        var subfieldsDef = fieldsDef['subtable.' + subTableName];
        if (canRecoverObj["required"][name] == undefined || canRecoverObj["required"][name]) {
          subfieldsDef[name]._isRequired = subfieldsDef[name]._oldisRequired;
        }
        if (canRecoverObj["readOnly"][name] == undefined || canRecoverObj["readOnly"][name]) {
          subfieldsDef[name]._isReadOnly = subfieldsDef[name]._oldisReadOnly;
        }
        if (canRecoverObj["showPower"][name] == undefined || canRecoverObj["showPower"][name]) {
          subfieldsDef[name]._isShowPower = subfieldsDef[name]._oldisShowPower;
        }
      } else {
        if (canRecoverObj["required"][name] == undefined || canRecoverObj["required"][name]) {
          if (fieldsDef[name]) {
            fieldsDef[name]._isRequired = fieldsDef[name]._oldisRequired;
          }
          // fieldsDef[name]._isRequired = fieldsDef[name]._oldisRequired;
        }
        if (canRecoverObj["readOnly"][name] == undefined || canRecoverObj["readOnly"][name]) {
          if (fieldsDef[name]) fieldsDef[name]._isReadOnly = fieldsDef[name]._oldisReadOnly;
        }
        if (canRecoverObj["showPower"][name] == undefined || canRecoverObj["showPower"][name]) {
          if (fieldsDef[name]) fieldsDef[name]._isShowPower = fieldsDef[name]._oldisShowPower;
        }
      }
    });
  }
}



//改变字段控件的状态
//fieldName:带表名的字段名
//power:权限状态{hidden: 是隐藏，否显示, write: 是否可，否不可写, required: 是否必填，否不必填}
function f2bpm_onlineform_changeFieldStatus(fieldName, power) {
  var arr = fieldName.split(".");
  var formAction = WFContext.WorkflowformAction;
  var isView = formAction > 2;
  var isSub = arr.length >= 3;
  var workflowFormVm = window.myvm;
  var that = workflowFormVm;
  var fieldsDef = null;
  if (isSub) {
    var subTableName = arr[1];
    fieldsDef = that.fieldsDef['subtable.' + subTableName];
  } else {
    //扁平化的字段定义
    fieldsDef = that.fieldsDef;
  }
  if (power.hidden == true) {
    //隐藏权限最高，如果有开启则其它权限不需要再看，查看状态下只执行此项
    fieldsDef[fieldName]._isShowPower = false;
    fieldsDef[fieldName]._isRequired = false;
  } else if (power.write == false) {
    //不可写，即为只读
    fieldsDef[fieldName]._isReadOnly = true;
    fieldsDef[fieldName]._isRequired = false;

  } else if (power.write == true && !isView) {
    //可写时，才去修改它是否必填
    fieldsDef[fieldName]._isReadOnly = false;
    fieldsDef[fieldName]._isRequired = power.required;
  }
}
//显示或隐藏子列表操作列
//subTableName:子实体名
//type:hide隐藏，show显示
function f2bpm_onlineform_showOrHideSubtableOperate(subTableName, type) {
  if (type == 'hide') {
    $("." + subTableName + "_operate_td").hide();
    $("." + subTableName + "_operate_th").hide();
  }
  else if (type == 'show') {
    $("." + subTableName + "_operate_td").show();
    $("." + subTableName + "_operate_th").show();
  }
}
//Dom操作显示或隐藏子列指定列
//subTableName:子实体名
//type:hide隐藏，show显示
function f2bpm_onlineform_showOrHideSubtableColumn(fileFullName, type) {
  fileFullName = fileFullName.replaceAll(".", "_");
  if (type == 'hide') {
    $("." + fileFullName + "_th").hide();
    $("." + fileFullName + "_td").hide();

  }
  else if (type == 'show') {
    $("." + fileFullName + "_th").show();
    $("." + fileFullName + "_td").show();
  }
}

//显示或隐藏子列表默认的删除按钮
//subTableName:子实体名
//type:hide隐藏，show显示
function f2bpm_onlineform_showOrHideSubtableDefaultDeleteButton(subTableName, type) {
  if (type == 'hide') {
    $("a[field='" + subTableName + ".deleteRow']").hide();
    $("i[field='" + subTableName + ".deleteRow']").hide();
  }
  else if (type == 'show') {
    $("a[field='" + subTableName + ".deleteRow']").show();
    $("i[field='" + subTableName + ".deleteRow']").show();
  }
}
//显示或隐藏子列表默认的添加按钮
//subTableName:子实体名
//type:hide隐藏，show显示
function f2bpm_onlineform_showOrHideSubtableDefaultAddButton(subTableName, type) {
  if (type == 'hide') {
    $("a[field='" + subTableName + ".addRow']").hide();
    $("i[field='" + subTableName + ".addRow']").hide();
  }
  else if (type == 'show') {
    $("a[field='" + subTableName + ".addRow']").show();
    $("i[field='" + subTableName + ".addRow']").show();
  }
}

//显示或隐藏子列表指定编码的按钮
//subTableName:子实体名
//type:hide隐藏，show显示
function f2bpm_onlineform_showOrHideSubtableTargetButton(subTableName, buttonName, type) {
  if (type == 'hide') {
    $("a[field='" + subTableName + "." + buttonName + "']").hide();
    $("i[field='" + subTableName + "." + buttonName + "']").hide();
  }
  else if (type == 'show') {
    $("a[field='" + subTableName + "." + buttonName + "']").show();
    $("i[field='" + subTableName + "." + buttonName + "']").show();
  }
}

/**
 * 初始化在线表单字段值
 * @param $vm  vue实例对象
 */
function $initailData($vm, fields) {
  var that = $vm || myvm;
  var fields = fields;
  var dataObj = {};
  $.each(fields, function (index, item) {
    $collectInitailDataField(that, item.children, dataObj);
  });
  //添加一个固定的myId主键
  var mainTable = "";
  for (var key in dataObj) {
    if (Object.toStartWith(key, "subtable.") == false) {
      mainTable = key.split(".")[0];
      break;
    }
  }
  if (mainTable) {
    var myIdName = mainTable + "." + "MyId";
    dataObj[myIdName] = "";
  }
  that.data = dataObj;
}

/**
 * 收集初始化字段的数据
 * @param children
 * @param dataObj
 * @returns {*}
 */
function $collectInitailDataField($vm, children, dataObj) {
  var that = $vm;
  $.each(children, function (index, item) {
    if (item.type == 'field') {
      var value = "";
      var ctrType = item.ctrType;
      switch (ctrType) {
        case "checkbox": value = []; break;
        case "file": value = []; break;
        default: break;
      }
      //获取默认值
      if (item.fieldDefaultValue) {
        value = getSysDefaultValue(item.fieldDefaultValue);
      }
      dataObj[item.vModel.toString()] = value;
    }
    else if (item.type == 'subtable') {
      //子表开始是空的
      var value = [];
      dataObj[item.vModel.toString()] = value;
    } else if (item.children && item.children.length > 0) {
      $collectInitailDataField($vm, item.children, dataObj);
    }
  });
  return dataObj;
}

/**
 * 收集主表和子表字段定义（对象扁平化和数组扁平化）,同时收集页面组件字段
 * @param $vm  vue实例对象
 */
function $collectField($vm, fields) {
  var that = $vm || myvm;
  var dataObj = {};
  var fieldList = [];
  var pageFieldList = [];
  $.each(fields, function (index, item) {
    $collectFieldDef(that, item.children, dataObj, fieldList, pageFieldList);
  });
  that.fieldsDef = dataObj;
  that.fieldList = fieldList;
  that.pageFieldList = pageFieldList;
  return dataObj;
}
/**
 * 收集主表字段定义（扁平化）,pageFieldList为页面组件字段
 * @param children
 * @param dataObj 扁平化的字段转为对象式定义
 * @returns {*}
 */
function $collectFieldDef($vm, children, dataObj, fieldList, pageFieldList) {
  var that = $vm;
  $.each(children, function (index, item) {
    if (item.type == 'field') {
      //标识必填权限
      item._oldisRequired = FUI.F2Grid.isHaveRequiredPower(item.vModel);
      item._oldisShowPower = FUI.F2Grid.isHaveShowPower(item.vModel);
      item._oldisReadOnly = !FUI.F2Grid.isHaveWritePower(item.vModel);

      item._isRequired = item._oldisRequired;
      item._isShowPower = item._oldisShowPower;
      item._isReadOnly = item._oldisReadOnly;

      var value = item;
      dataObj[item.vModel.toString()] = value;
      fieldList.push(item);
    }
    else if (item.ctrType && item.ctrType.indexOf("extend_") > -1 && item.ctrType != 'extend_tabs' && item.ctrType != 'extend_table' && item.ctrType != 'extend_container') {
      if (item.vModel) {
        item._oldisRequired = FUI.F2Grid.isHaveRequiredPower(item.vModel);
        item._oldisShowPower = FUI.F2Grid.isHaveShowPower(item.vModel);
        item._oldisReadOnly = !FUI.F2Grid.isHaveWritePower(item.vModel);
        item._isRequired = item._oldisRequired;
        item._isShowPower = item._oldisShowPower;
        item._isReadOnly = item._oldisReadOnly;
        var value = item;
        dataObj[item.vModel.toString()] = value;
        pageFieldList.push(item);
      }
    }
    else if (item.type == 'subtable') {
      //子表开始是空的
      var tableName = item.props.tableName;
      var value = {};
      var columns = item.columns;
      item._isShowPower = true;
      $.each(columns, function (i, c) {
        //显示权限由子表列td控件
        c._isRequired = FUI.F2Grid.isHaveRequiredPower(c.vModel);
        c._isReadOnly = !FUI.F2Grid.isHaveWritePower(c.vModel);
        value[c.vModel] = c;

      });

      dataObj[item.vModel.toString()] = value;
      fieldList.push(item);
    } else if (item.children && item.children.length > 0) {
      $collectFieldDef($vm, item.children, dataObj, fieldList, pageFieldList);
    }
  });
  return dataObj;
}
function getSysDefaultValue(express) {
  if (WFContext.isDesign === true) {
    return express;
  }
  if (!express) {
    return "";
  }
  if (Object.toStartWith(express, "Sql:") || Object.toStartWith(express, "sql:")) {
    return getDefaultSHSLValueBySql(express);
  }
  else if (Object.toStartWith(express, "#") && express.indexOf("#") > -1) {
    return getWildcardValue(express);
  }
  return express;
}

//获取通配符的值
function getWildcardValue(express) {
  if (WFContext.isDesign === true) {
    return express;
  }
  if (express.indexOf("#") == -1) {
    return "";
  }
  var otherObj = {};
  if (WFContext.OtherProperty && WFContext.OtherProperty.length > 0) {
    $.each(WFContext.OtherProperty, function (i, item) {
      otherObj[item.key] = item.value;
    });
  }
  var listVars = Object.toGetVarsInStr(express);
  var resultStr = express;
  $.each(listVars, function (i, name) {
    var name = name.toString().replace("#", "").replace("#", "");
    switch (name) {
      case "GuId": resultStr = resultStr.replace("#" + name + "#", Object.toGuid()); break;
      case "CurrentDateTime": resultStr = resultStr.replace("#" + name + "#", Object.toGetCurrentDateTimeString()); break;
      case "CurrentDate": resultStr = resultStr.replace("#" + name + "#", Object.toGetCurrentDateString()); break;
      case "yyyyMMddhhmmssSSS": resultStr = resultStr.replace("#" + name + "#", Object.toGetCurrentDateTimeMillisecond()); break;
      default: {
        if (WFContext[name]) resultStr = resultStr.replace("#" + name + "#", WFContext[name]);
        if (otherObj[name]) resultStr = resultStr.replace("#" + name + "#", otherObj[name]);
        break;
      }
    }
  });
  return resultStr;
}


function getDefaultSHSLValueBySql(sql) {
  sql = sql.replace("#CurrentUserId#", "'" + WFContext["CurrentUserId"] + "'");
  sql = sql.replace("#CurrentAccount#", "'" + WFContext["CurrentAccount"] + "'");
  sql = sql.replace("#CurrentRealName#", "'" + WFContext["CurrentRealName"] + "'");
  sql = sql.replace("#CurrentOrgId#", "'" + WFContext["CurrentOrgId"] + "'");
  sql = sql.replace("#CurrentOrgName#", "'" + WFContext["CurrentOrgName"] + "'");
  sql = sql.replace("#CurrentTenantId#", "'" + WFContext["CurrentTenantId"] + "'");

  sql = sql.replace("#CurrentDateTime#", "'" + Object.toGetCurrentDateTimeString() + "'");
  sql = sql.replace("#CurrentDate#", "'" + Object.toGetCurrentDateString() + "'");
  sql = sql.replace("#GuId#", "'" + Object.toGuid() + "'");
  sql = sql.replace("#yyyyMMddhhmmssSSS#", "'" + Object.toGetCurrentDateTimeMillisecond() + "'");
  sql = sql.replace("#WorkflowInstanceId#", "'" + WFContext["WorkflowInstanceId"] + "'");
  sql = sql.replace("#CurrentActivityName#", "'" + WFContext["CurrentActivityName"] + "'");
  sql = sql.replace("#CurrentActivityCode#", "'" + WFContext["CurrentActivityCode"] + "'");
  //sql = sql.replace("#MySelfValue#", "'" + $text.val() + "'");
  if (WFContext.OtherProperty && WFContext.OtherProperty.length > 0) {
    $.each(WFContext.OtherProperty, function (i, item) {
      sql = sql.replace("#" + item.key + "#", "'" + item.value + "'");
    });
  }
  var result = Object.toAjaxJson(FUI.Handlers.FuiFrameworkHandler, "getSHSLBySql", { sql: sql });

  if (result.success) {
    return result.msg;
  } else {
    FUI.Window.showMsg(result.msg);
  }
  return "";
}
//=============装载数据===========================
//装载页面所有表格数据
function $load($vm, data) {
  var that = $vm;
  //格式data = [ {"mainTable" : "ZhuBiaoDanYuanSu","data" : [ {name:,value:}],
  //"subTables" : [ {
  //"subTable" : "ZiBiaoDanYuanSu",
  //"data" : [ [ {name:,value:},{name:,value:}]]}
  var mainTableObject = {};
  var mainData = [];
  //遍历主表
  $.each(data, function (index, item) {
    var mainTable = item.mainTable;
    var mainData = item.data;
    //加载主表
    $loadForm($vm, mainTable, mainData);

    //绑定子表
    var subTables = item.subTables || [];
    $.each(subTables, function (i, sub) {
      var subTableName = sub.subTable;
      var subRowsData = sub.data;
      $loadSubTable(that, mainTable, subTableName, subRowsData);
      //$columnMath(subTableName);
    });

  });
  //$buttonSetViewState();

}
//排除掉的字段
var excepFiels = ["businesskey", "procinststate", "formid", "wiid", "myparentid"];
//装载Form表单格式数据
function $loadForm($vm, tableName, mainData) {
  var that = $vm;
  // console.info(JSON.stringify(mainData));
  $.each(mainData, function (index, d) {
    var name = tableName + "." + d.name;
    //自身存在的属性才可付值，避免从数据库取出来的数据字段多于表单原拖放时的字段
    if (that.data.hasOwnProperty(name) || d.name.toLocaleLowerCase() == "myid") {
      that.data[name] = d.value;
    }
    //if(Array.isArray(d.value)){
    //that.data[name] =JSON.stringify(d.value).replace(/\"/g,"\'");
    //that.data[name] =d.value;
    //}
  });
  //绑定主表公式
  //$bindAllMainTableMathEvent();
}
//装载Form表单格式数据
//子表是整个表字段一定是全部出来的
function $loadSubTable($vm, mainTable, subTableName, subRowsData) {
  var that = $vm;
  var data = [];
  //遍历所有子表数据行
  $.each(subRowsData, function (index, nvRow) {
    var row = {};
    $.each(nvRow, function (key, d) {
      if ($.inArray(d.name.toLocaleLowerCase(), excepFiels) == -1) {
        var name = mainTable + "." + subTableName + "." + d.name;
        row[name] = d.value;
      }
    });
    data.push(row);
  });
  that.data["subtable." + subTableName] = data;
}

//获取主表数据的Json对象
//isNameValue:是否以name，vlaue键值对的方式返回结果，默认为否
//isRemoveTableName:是否删除前缀表名，默认为是
function $getMainTableData(isNameValue, isRemoveTableName) {
  if (isRemoveTableName == undefined) {
    isRemoveTableName = true;
  }
  var busObjectDatas = $getBusObjectData(null, isRemoveTableName);
  var data = busObjectDatas[0].data;
  var json = {};
  var arrData = [];
  if (data && data.length > 0) {
    $.each(data, function (_, nv) {
      var propertyName = nv.name;//isRemoveTableName?nv.name.substr(nv.name.lastIndexOf(".")+1):nv.name;
      if (isNameValue) {
        nv.name = propertyName;
        arrData.push(nv);
      } else {
        json[propertyName] = nv.value;
      }
    });
  }
  if (isNameValue) {
    json = arrData;
  }
  return json;
}
//获取子表数据的Json对象(name为纯字段名，无前缀),
//isNameValue行数据是否为[{name:1,value:2}]格式,默认为否，即默认返回{aa:1,bbb:2}格式
function $getSubData(tableName, isNameValue) {
  if (isNameValue == undefined) {
    isNameValue = false;
  }
  var busObjectDatas = $getBusObjectData(null, true);
  var subs = busObjectDatas[0].subTables;
  var sub = {};
  $.each(subs, function (_, s) {
    if (s.subTable == tableName) {
      sub = s;
      return false;
    }
  });
  var rows = [];
  var subData = sub.data;
  if (subData && subData.length > 0) {
    $.each(subData, function (index, nvrow) {
      var r = {};
      var innerData = [];
      r.ROWINDEX = index;
      $.each(nvrow, function (_, nv) {
        var propertyName = nv.name;//nv.name.substr(nv.name.lastIndexOf(".")+1);
        if (isNameValue) {
          nv.name = propertyName;
          innerData.push(nv);
        } else {
          r[propertyName] = nv.value;
          r.ROWINDEX = index;
        }
      });
      if (isNameValue) {
        innerData.push({ name: "ROWINDEX", value: index });
        rows.push(innerData);
      } else {
        rows.push(r);
      }
    });
  }
  return rows;
}
function $getSubRow(index, tableName, isNameValue) {
  var subData = $getSubData(tableName, isNameValue);
  var result = null;
  $.each(subData, function (i, row) {
    if (i == index) {
      result = row;
      return false;
    }
  });
  return result;
}
/**
 * 获取表单数据
 * @param isRemoveTableName 字段名是否删除表名，默认是
 * @returns {Array}
 */
function $getBusObjectData($vm, isRemoveTableName) {
  console.log("获取数据设置格式");
  var that = $vm || myvm;
  if (isRemoveTableName == undefined) {
    isRemoveTableName = true;
  }
  //在线表单收集数据
  //一个数据对象数据格式：
  // {
  //  mainTable:"表名",data:[{name:"",value:""}],
  //  	subTables:[{
  //			subTable:"子表名",
  //			deleteData:[{name:"字段名",value:""}],
  //          data:[
  //                 [{name:"",value:""},{name:"",value:""}],
  //                 [{name:"",value:""},{name:"",value:""}]
  //               ]
  //       }]
  // }
  //收集富文本编辑器的数据
  richeditorArrValueToInput(that);
  //收集所有数据
  var alldata = Object.toDeepClone(that.data);
  var mainTableNames = [];
  //判断是否为主表字段的表达式
  var mainFieldExpress = /^[a-zA-z_]{1,}[a-zA-Z0-9_]{0,}[\.]{1}[a-zA-Z0-9_]+$/g;
  //子表字段表达式
  var subTableFieldExpress = new RegExp(/^[a-zA-z_]{1,}[a-zA-Z0-9_]{0,}[\.]{1}[a-zA-Z0-9_]{1,}[\.]{1,}[a-zA-Z0-9_]+$/g);
  //所有主表字段数据
  var allmaindata = [];
  //收集所有主表名
  $.each(alldata, function (key, val) {
    var item = { name: key, value: val };
    var fieldName = item.name;
    //判断是否为主表字段的表达式
    var isTrue = /^[a-zA-z_]{1,}[a-zA-Z0-9_]{0,}[\.]{1}[a-zA-Z0-9_]+$/g.test(fieldName);
    if (isTrue) {
      allmaindata.push(item);
      var arr = fieldName.split('.');
      if ($.inArray(arr[0], mainTableNames) == -1 && arr[0] != "subtable") {
        mainTableNames.push(arr[0]);
      }
    }
  });
  //收集所有数据对象数据(目前只考虑一个数据对象的情况)
  var busObjectsData = [];//格式：[{mainTable:"",data:[]},{}]

  $.each(mainTableNames, function (index, mainTableName) {
    var busObject = {};//一个数据对象
    var tableData = [];
    $.each(allmaindata, function (index, item) {
      var name = item.name.split('.')[0];
      if (name == mainTableName) {
        if (isRemoveTableName) {
          var propertyName = item.name.substr(item.name.lastIndexOf(".") + 1);
          item.name = propertyName;
        }
        if (typeof item.value == "object") {
          item.value = JSON.stringify(item.value);
        }
        //防XSS攻击过滤转换
        else if (typeof item.value == 'string') {
          item.value = filterXSS(item.value);
        }
        tableData.push(item);
      }
    });
    busObject["mainTable"] = mainTableName;
    busObject["data"] = tableData;

    var subTables = [];
    //遍历主表的所有子表
    $.each(alldata, function (key, dataList) {
      if (!Object.toStartWith(key, "subtable")) {
        return true;
      }
      var arr = key.split(".");
      var tableName = arr[1];
      var subObject = {};
      subObject.subTable = tableName;
      subObject.data = [];
      subObject.deleteData = [];
      if (!dataList) {
        return true;
      }
      $.each(dataList, function (index, row) {
        var row2 = [];
        $.each(row, function (fieldName, value) {
          var cell = { name: fieldName, value: value };
          if (isRemoveTableName) {
            var propertyName = fieldName.substr(fieldName.lastIndexOf(".") + 1);
            cell.name = propertyName;
          }
          if (typeof cell.value == "object") {
            cell.value = JSON.stringify(cell.value);
          }
          //防XSS攻击过滤转换
          else if (typeof cell.value == 'string') {
            cell.value = filterXSS(cell.value);
          }
          if (fieldName != 'tempid') {
            row2.push(cell);
          }
        });
        subObject.data.push(row2);
      });
      //找出删除的键
      $.each(f2grid_global_deleteData, function (i, t) {
        if (t.tableName == tableName) {
          subObject.deleteData = t.keys;
          return false;
        }
      });
      subTables.push(subObject);
    });
    busObject.subTables = subTables;
    busObjectsData.push(busObject);

  });
  //var jsonStr = busObjectsData;//JSON.stringify(busObjectsData);
  //var busData = { name: "BusObjectDatas", value: jsonStr };
  // console.info(jsonStr);
  return busObjectsData;
}

//===============================子列表操作==============================//
//获取新空行数据
function $getEmptyRow($subtablevm) {
  var that = $subtablevm;
  var row = {};
  that.colunms.forEach(function (col, index, array) {
    let key = col.vModel;
    let ctrType = col.ctrType;
    var value = "";
    switch (ctrType) {
      case "checkbox":
        value = [];
        break;
      case "file":
        value = [];
        break;
      default:
        break;
    }
    //获取默认值
    if (col.fieldDefaultValue) {
      value = getSysDefaultValue(col.fieldDefaultValue);
    }
    row[key] = value;
  });
  row.tempid = "temp_" + Object.toGuid();
  return row;
}
// 2023-01-12 新增是否二次询问 isShow
function $delBathRow($subtablevm, isShow) {
  var that = $subtablevm;
  var newRows = [];
  if (that.checkList.length == 0) {
    FUI.Window.showMsg2("请选择要删除的记录");
    return false;
  }
  if (isShow === undefined && isShow === null) isShow = true;
  if (isShow) {
    FUI.Window.confirm(that, "确定要删除所选记录吗？", null, function () {
      //删除数据
      $.each(that.rows, function (index, r) {
        if ($.inArray(r.tempid, that.checkList) == -1) {
          newRows.push(r);
        }
      });
      var deleRows = [];
      //收集删除的MyId键值
      $.each(that.checkList, function (index, checkId) {
        var checkRow = that.rows.find(a => a.tempid == checkId);
        if (checkRow != null) {
          deleRows.push(checkRow);
        }
        if (checkRow != null && checkRow[that.primaryKey]) {
          var key = checkRow[that.primaryKey];

          if (key != '' && key != null && key != undefined) {
            FUI.F2Grid.appendToDeleteRows(that.props.tableName, { name: that.primaryKey, value: key });
          }
        }
      });

      that.rows = newRows;
      that.checkList = [];
      that.isCheckAll = false;
      that.updateParentSubData('delete');
      //$updateParentSubData(that, 'delete');
      //扩展JS
      var tableName = that.field.vModel.replace("subtable.", "");
      var extendFunName = tableName + "_deleteEvent";
      var isExist = Object.toIsExitsFunction(extendFunName);
      if (isExist) {
        var exfunc = eval(extendFunName);
        exfunc(that, tableName, that.rows, deleRows);
      }
    });

  } else {
    //删除数据
    $.each(that.rows, function (index, r) {
      if ($.inArray(r.tempid, that.checkList) == -1) {
        newRows.push(r);
      }
    });
    var deleRows = [];
    //收集删除的MyId键值
    $.each(that.checkList, function (index, checkId) {
      var checkRow = that.rows.find(a => a.tempid == checkId);
      if (checkRow != null) {
        deleRows.push(checkRow);
      }
      if (checkRow != null && checkRow[that.primaryKey]) {
        var key = checkRow[that.primaryKey];

        if (key != '' && key != null && key != undefined) {
          FUI.F2Grid.appendToDeleteRows(that.props.tableName, { name: that.primaryKey, value: key });
        }
      }
    });

    that.rows = newRows;
    that.checkList = [];
    that.isCheckAll = false;
    that.updateParentSubData('delete');
    //$updateParentSubData(that, 'delete');
    //扩展JS
    var tableName = that.field.vModel.replace("subtable.", "");
    var extendFunName = tableName + "_deleteEvent";
    var isExist = Object.toIsExitsFunction(extendFunName);
    if (isExist) {
      var exfunc = eval(extendFunName);
      exfunc(that, tableName, that.rows, deleRows);
    }
  }
}
function $delAllRow($subtablevm, isShow) {
  var that = $subtablevm;
  var primaryKey = $subtablevm.primaryKey;
  var rows = that.rows;
  if (isShow === undefined && isShow === null) isShow = true;
  if (isShow) {
    FUI.Window.confirm(that, "确定要删除所有记录吗？", null, function () {
      //收集删除的MyId键值
      $.each(rows, function (index, r) {
        if (r[primaryKey]) {
          var key = r[primaryKey];
          if (key != '' && key != null && key != undefined) {
            FUI.F2Grid.appendToDeleteRows(that.props.tableName, { name: primaryKey, value: key });
          }
        }
      }
      );
      that.rows = [];
      that.updateParentSubData('delete');
    });
  } else {
    $.each(rows, function (index, r) {
      if (r[primaryKey]) {
        var key = r[primaryKey];
        if (key != '' && key != null && key != undefined) {
          FUI.F2Grid.appendToDeleteRows(that.props.tableName, { name: primaryKey, value: key });
        }
      }
    }
    );
    that.rows = [];
    that.updateParentSubData('delete');
  }
}
function $delRow($subtablevm, tempid) {
  var that = $subtablevm;
  var temprows = [];

  FUI.Window.confirm(that, "确定要删除吗？", null, function () {
    //console.info("delRow前：" + JSON.stringify(that.rows));
    //删除数据
    $.each(that.rows, function (_, r) {
      if (r.tempid != tempid) {
        temprows.push(r);
      }
    });
    var deleRows = [];
    //收集删除键
    var checkRow = that.rows.find(a => a.tempid == tempid);
    if (checkRow != null) {
      deleRows.push(checkRow);
    }
    if (checkRow != null && checkRow[that.primaryKey]) {
      var key = checkRow[that.primaryKey];
      if (key != '' && key != null && key != undefined) {
        FUI.F2Grid.appendToDeleteRows(that.props.tableName, { name: that.primaryKey, value: key });
      }
    }
    //console.info("delRow 后：" + JSON.stringify(temprows));
    that.rows = temprows;
    that.updateParentSubData('delete');

    // setTimeout(function(){
    //   $updateParentSubData(that, "delete");
    // },3000);
    //扩展JS
    var tableName = that.field.vModel.replace("subtable.", "");
    var extendFunName = tableName + "_deleteEvent";
    var isExist = Object.toIsExitsFunction(extendFunName);
    if (isExist) {
      var exfunc = eval(extendFunName);
      exfunc(that, tableName, that.rows, deleRows);
    }
  });
}
function $addRow($subtablevm) {
  var that = $subtablevm;
  //扩展JS
  var tableName = that.props.tableName;
  var extendFunName = tableName + "_override_add";
  var isExist = Object.toIsExitsFunction(extendFunName);
  if (isExist) {
    var exfunc = eval(extendFunName);
    exfunc(that, tableName, that.rows);
    that.updateParentSubData('add');
    //$updateParentSubData(that, 'add');
    return false;
  }
  //子表添加行 默认序号 2023/6/1
  var row = $getEmptyRow(that);
  row[`${tableName}.Sort`] = that.rows.length + 1
  that.rows.push(Object.toClone(row));
  that.updateParentSubData('add');
  //$updateParentSubData(that, 'add');
}
//从子表控件中添加子表数据subNVRows:为[[ {name:value} ]]
function $subAddNVRows($subtablevm, mainTableName, tableName, subNVRows) {
  var that = $subtablevm;
  var rowObj = $getEmptyRow(that);
  $.each(subNVRows, function (i, data) {
    var rowTemp = Object.toClone(rowObj);
    rowTemp.tempid = "temp_" + Object.toGuid();
    $.each(data, function (i, nv) {
      let key = mainTableName + "." + tableName + "." + nv.name;
      if (rowTemp.hasOwnProperty(key)) {
        rowTemp[key] = nv.value;
      }
    });
    that.rows.push(rowTemp);
  });
  that.updateParentSubData('add');
}
//此时点击添加子表行时，行模板已经是被渲染过并且模板中也有默认值了。
//当添加行时需要直接付值通过rowData传当前行的值，
//rowData中可包括主表与子表名前缀则mainTableName不需要填否则mainTableName必填
//opt:{isReadonly:true/false,rowIndex:插入到第几行默认最后一行}
//rownvData:[{name:,value:}]
//isBatchData:是否为批量数据添加，如果为，则rownvData格式为：[ [{name:'',value:''}],[] ]
function $addRowData(tableName, mainTableName, rownvData, isBatchData) {
  var that = myvm;
  var rowsData = [];
  if (isBatchData != undefined && isBatchData != null && isBatchData === true) {
    rowsData = rownvData;
  } else {
    rowsData.push(rownvData);
  }
  var subDataName = "subtable." + tableName;
  var prefix = "";
  if (mainTableName != undefined && mainTableName != null) {
    prefix = mainTableName + "." + tableName;
  }
  $.each(rowsData, function (index, rowNameValueItem) {
    if (rowNameValueItem) {
      var rowData = {};
      $.each(rowNameValueItem, function (index, d) {
        var name = d.name;
        if (prefix) {
          name = prefix + "." + d.name;
        }
        rowData[name] = d.value;
        if (Array.isArray(d.value)) {
          rowData[name] = JSON.stringify(d.value);//.replace(/\"/g,"\'");
        }
      });
      rowData.tempid = "temp_" + Object.toGuid();
      that.data[subDataName].push(rowData);
    }
  });
}


//删除时让子表重新渲染
function $updateParentSubData($subtablevm, actionType) {
  var that = $subtablevm;
  console.info(actionType + JSON.stringify(that.rows));
  that.$emit('updatevalue', "subtable." + that.props.tableName, that.rows);
  if (actionType == "delete" || actionType == "add") {
    //让子控件重新渲染
    //that.onlineformKey = Object.toGetTimeRandomNum();
    that.subtableKey = Object.toGetTimeRandomNum();
  }
}

//操作列自定义按钮事件
//$vm:子列表的vue对象
function $custbtnOnClick($subtablevm, btn, tableName, row) {
  var excutefun = btn.excutefun;
  var buttonName = btn.buttonName;
  var btnField = tableName + "." + btn.buttonName;
  var isExist = Object.toIsExitsFunction(excutefun);
  if (isExist) {
    var exfunc = eval(excutefun);
    exfunc($subtablevm, btn, tableName, row);
  }
}
//工具栏自定义按钮事件
//btn:按钮本身
//tableName：实体对象名
//rows:子表所有行数据
//$vm:子列表的vue对象
function $toolBarCustbtnOnClick($subtablevm, btn, tableName, rows) {
  var excutefun = btn.excutefun;
  var buttonName = btn.buttonName;
  var btnField = tableName + "." + btn.buttonName;
  var btnType = btn.buttonType;
  if (btnType == "" && excutefun) {
    var isExist = Object.toIsExitsFunction(excutefun);
    if (isExist) {
      var exfunc = eval(excutefun);
      exfunc($subtablevm, btn, tableName, rows);
    }
  }

}


//[
// {tableName:表名,keys:[{name:"属性全名",value:"值"}]}
//]
//示例：[{tableName:"",keys:[{name: "kj.ZiBiaoKongJian.MyId", value: "12da4e92-3dc4-499a-8ead-163240031cc2"}] }  ]
//keyItem:{name:value}，name为包括表名的字段全名称
function $appendToDeleteRows(tableName, keyItem) {
  if (keyItem == null) return false;
  var temItem = { tableName: tableName, keys: [] };
  $.each(f2grid_global_deleteData, function (i, tbRows) {
    if (tbRows.tableName == tableName) {
      temItem = tbRows;
      return false;
    }
  });
  temItem.tableName = tableName;
  temItem.keys.push(keyItem);
  var tem = [];
  $.each(f2grid_global_deleteData, function (i, tbRows) {
    if (tbRows.tableName == tableName) {
      return true;
    }
    tem.push(tbRows);
  });
  tem.push(temItem);
  f2grid_global_deleteData = tem;
}
//================================其它通用=============================
//将1行对象数据{key1:v1,k2:v2}数据转为[{name:,value},{name:value}]格式
function $convertToNameValData(row) {
  //去掉实体对象前缀名称
  var rowNV = [];
  $.each(row, function (key, value) {
    var index = key.lastIndexOf(".");
    var k = index > 0 ? key.substr(index + 1) : key;
    rowNV.push({ "name": k, "value": value });
  });
  return rowNV;
}
//将1行数组数据[{name:value},{name:value}],[{name:value}]转为{key:v,key2:v2}格式
function $convertToPropertyData(rowArr) {
  //去掉实体对象前缀名称
  var obj = {};
  $.each(rowArr, function (index, item) {
    var index = item.name.lastIndexOf(".");
    var keyName = index > 0 ? item.name.substr(index + 1) : item.name;
    obj[keyName] = item.value;
  });
  return obj;
}
//将多行数组数据[[{name:value},{name:value}],[{name:value}]]转为[{key:v,key2:v2}]格式
function $convertArrToPropertyData(arrList) {
  //去掉实体对象前缀名称
  var data = [];
  $.each(arrList, function (index, rowArr) {
    var item = $convertToPropertyData(rowArr);
    data.push(item);
  });
  return data;
}
//=========富文本编辑的编辑的数据赋值到输入框中=========
function richeditorArrValueToInput($vm) {
  if (undefined != richeditorArr && richeditorArr != null && richeditorArr.length > 0) {
    // richeditorArr变量放在index.html全局中
    for (var i = 0; i < richeditorArr.length; i++) {
      var name = richeditorArr[i].name;
      var html = richeditorArr[i].editor.getContent();
      //过滤
      var result = filterXSS(html);
      var arr = name.split(".");
      if (arr.length >= 3) {
        //如果是子列表时,dataSelf为子列表所在行的数据对象
        if (richeditorArr[i].dataSelf && richeditorArr[i].dataSelf.hasOwnProperty(name)) {
          richeditorArr[i].dataSelf[name] = result;
        }
      } else {
        $vm.data[name] = result;
      }
    }
  }
}

//====================================公式计算=============================
//字段的表达式
var fieldExpress = /\[{1}[a-zA-Z0-9_.]{3,}\]{1}/g;
//公式检查
function $checkMath(formulaExpression) {
  if (formulaExpression == "") {
    return true;
  }
  //检查是否存在[],)[,](,(),][这种两个字段拼在一起的情况

  var exp = /\[{1}\]{1}/g;
  if (exp.test(formulaExpression)) {
    FUI.Window.showMsg("公式有误：公式中存在“[]”存在空字段");
    return false;

  }
  var exp = /\){1}\({1}/g;
  if (exp.test(formulaExpression)) {
    FUI.Window.showMsg("公式有误：公式中存在“)(”括号之间要有运算符号");
    return false;

  }
  exp = /\){1}\[{1}/g;
  if (exp.test(formulaExpression)) {
    FUI.Window.showMsg("公式有误：公式中存在“)[”括号后与字段之间要有运算符号");
    return false;

  }
  exp = /\]{1}\({1}/g;
  if (exp.test(formulaExpression)) {
    FUI.Window.showMsg("公式有误：公式中存在“](”，字段后面的括号要有运算符号");
    return false;

  }
  exp = /\({1}\){1}/g;
  if (exp.test(formulaExpression)) {
    FUI.Window.showMsg("公式有误：公式存在空的括号“()”");
    return false;

  }
  exp = /\]{1}\[{1}/g;
  if (exp.test(formulaExpression)) {
    FUI.Window.showMsg("公式有误：公式存在“][”，字段间要有运算符号");
    return false;

  }
  exp = /\){1}Math.{1}/g;
  if (exp.test(formulaExpression)) {
    FUI.Window.showMsg("公式有误：公式存在“)Math.”，括号与函数之间要有运算符");
    return false;

  }
  exp = /\]{1}Math.{1}/g;
  if (exp.test(formulaExpression)) {
    FUI.Window.showMsg("公式有误：公式存在“]Math.”，字段与函数之间要有运算符");
    return false;

  }

  var mathStr = formulaExpression.replace(fieldExpress, "1");
  try {
    var result = eval(mathStr);
    console.info(result);
    return true;
  }
  catch (err) {
    FUI.Window.showMsg("模拟赋值执行公式：【" + mathStr + "】计算出错，请根据模拟公式结果修正公式中的错误。");
    return false;
  }
}

/**
 * 获取主子表所有公式表达中的字段
 * @param fieldList 扁平表单字段定义列表
 * @returns 对象{字段名:[公式对象1,公式对象2]}
 */
function $getMathFieldList(fieldList) {
  var result = {};
  var mainFields = fieldList.filter(c => c.countRule != "" && c.countRule != undefined);
  var subFields = fieldList.filter(c => c.type == "subtable");
  //收集仅字段名
  //var resultNeedMathFieldList=[];
  $.each(mainFields, function (index, item) {
    var name = item.vModel;
    var countRule = {};
    if (typeof item.countRule == "string") {
      countRule = eval("(" + item.countRule + ")");
    } else {
      countRule = item.countRule;
    }

    countRule["name"] = name;
    var formulaExpression = countRule.rowmath;
    var arr = $getExpressionFieldList(formulaExpression);
    if (arr && arr.length > 0) {
      //resultNeedMathFieldList=resultNeedMathFieldList.concat(arr);
      $.each(arr, function (i, item) {
        if (result[item]) {
          result[item].push(countRule);
        } else {
          result[item] = [countRule];
        }
      });
    }
  });
  $.each(subFields, function (index, item) {
    var subMathFields = item.columns.filter(c => c.countRule != "" && c.countRule != undefined);
    $.each(subMathFields, function (index, item) {
      var name = item.vModel;
      var countRule = {};
      if (typeof item.countRule == "string") {
        countRule = eval("(" + item.countRule + ")");
      } else {
        countRule = item.countRule;
      }
      countRule["name"] = name;
      var formulaExpression = countRule.rowmath;
      var arr = $getExpressionFieldList(formulaExpression);
      if (arr && arr.length > 0) {
        //resultNeedMathFieldList=resultNeedMathFieldList.concat(arr);
        $.each(arr, function (i, item) {
          if (result[item]) {
            result[item].push(countRule);
          } else {
            result[item] = [countRule];
          }
        });
      }
    });
  });
  return result;
}

/**
 * 收集所有公式
 * @param fieldList 所有扁平化的字段数组
 * @returns  公式列表[{}]
 */
function $getMathRuleList(fieldList) {
  var mainFields = fieldList.filter(c => c.countRule != "" && c.countRule != undefined);
  var subFields = fieldList.filter(c => c.type == "subtable");
  var allRule = [];
  $.each(mainFields, function (index, item) {
    var name = item.vModel;
    var countRule = item.countRule;
    countRule["name"] = name;
    allRule.push(countRule);
  });
  $.each(subFields, function (index, item) {
    var subMathFields = item.columns.filter(c => c.countRule != "" && c.countRule != undefined);
    $.each(subMathFields, function (index, item) {
      var name = item.vModel;
      var countRule = item.countRule;
      countRule["name"] = name;
      allRule.push(countRule);
    });
  });
  return allRule;
}

/**
 * 表达式取出公式中所有的字段
 * @param formulaExpression 公式表达式
 * @returns {Array}
 */
function $getExpressionFieldList(formulaExpression) {
  if (!formulaExpression) return "";
  var arr = formulaExpression.match(fieldExpress);
  var result = [];
  arr = arr || [];
  $.each(arr, function (index, item) {
    var name = item.replace("[", "").replace("]", "");
    result.push(name);
  });
  return result;
}
//========================== 使用全局myvm============================
/**
 * 检查我是否需要触发公式 使用了全局myvm
 * @param fieldName 字段名
 * @returns {boolean}
 */
function $checkMyChangeIsNeedToExcuteMath(fieldName) {
  return myvm.mathFieldList[fieldName] != undefined;
}

/**
 * 执行所有公式
 * @param triggerFieldName 触发变化所在的字段
 * @param rowData 触发控件所在Vue的Data对象，子表为row，主表为主对象data
 */
function $excuteAllMath(triggerFieldName, rowData) {
  //是否在子表行触发的
  var triggerIsSubtable = triggerFieldName.split('.').length >= 3;
  var listCountRuleObj = myvm.mathFieldList[triggerFieldName];
  if (!listCountRuleObj) {
    return false;
  }
  //公式结构：
  // "countRuleObj": {
  //     "name":公式所在结果字段名
  //     "formulaType": "number",
  //      "isCapitalAmount": "0",
  //      "rowmath": "[crm_agreement.crm_agreementProduct.xsj]*[crm_agreement.crm_agreementProduct.sl]"
  // }
  //字段的表达式
  var isDateMath = false;
  var n = listCountRuleObj.length;
  if (n <= 0) return false;
  //执行本字段被所引用到的多个公式
  for (var i = 0; i < n; i++) {
    var countRuleObj = listCountRuleObj[i];
    var jsonRule = countRuleObj;
    var resultInputName = jsonRule.name;
    var resultIsSubtable = resultInputName.split('.').length >= 3;
    var formulaExpression = jsonRule.rowmath;
    var digitlen = jsonRule.digitlen;
    if (digitlen == undefined) {
      digitlen = 2;
    }
    if (!formulaExpression) return false;
    //公式类型，默认为数字公式，string表示字拼接符串加减公式
    var formulaType = jsonRule.formulaType || "number";
    // 是否大写金额
    var isCapitalAmount = jsonRule.isCapitalAmount == undefined ? "0" : jsonRule.isCapitalAmount;
    var isHoursCalc = jsonRule.isHoursCalc == "1";
    //var str="[ZhuBiaoDanYuanSu.ZiBiaoDanYuanSu.XiaLaKuang]+[ZhuBiaoDanYuanSu.ZiBiaoDanYuanSu.FuXuanAnNiu]";
    var iscalculate = true;
    var expStr = "";
    expStr = formulaExpression.replace(fieldExpress, function (item) {
      var name = item.replace("[", "").replace("]", "");
      var targetField = name;
      var arr = targetField.split('.');
      var arrN = arr.length;
      var isSubtable = false;
      var isColunmSum = false;
      if (arrN >= 3) {
        if (f2grid_global_columnCountData[name] != undefined && formulaExpression.indexOf("MyMath.sum([" + name + "])") > -1) {
          //计算因子是子列表合计列
          isColunmSum = true;
        }
        isSubtable = true;
      }
      name = targetField;
      var inputValue = undefined;
      if (isColunmSum) {
        inputValue = f2grid_global_columnCountData[name];
      } else {
        if (isSubtable && triggerIsSubtable) {
          if (rowData == null) {
            //说明是列合计的变化，所以rowData为空，无需计算
            iscalculate = false;
            return false;
          }
          //子表触发
          inputValue = rowData[name];
          if (inputValue === "" || inputValue === null || inputValue === undefined) {
            inputValue = 0;
          }
        } else if (isSubtable && triggerIsSubtable == false) {
          //主表触发,rowData为主对象的data,此时要找子表内的值，需要在主对象中找
          // 即主表某个字段为子表的计算因子，当主表字段变化时需要触发修改子表所在行计算结果,暂未实现
          inputValue = undefined;
        } else if (isSubtable == false) {
          inputValue = myvm.data[name];
        }
      }

      if (inputValue == undefined || inputValue === "") {
        inputValue = Number(inputValue)
      }

      if ((inputValue === "" || inputValue == undefined) && formulaType != "string") {
        iscalculate = false;
        return false;
      } else {
        iscalculate = true;
      }
      //判断是不是日期
      if (Object.toIsDateStr(inputValue)) {
        isDateMath = true;
        var time = inputValue.replace(/\-/g, "/");
        var theTime = new Date(time);
        var divNum = isHoursCalc ? 1000 * 3600 : 1000 * 3600 * 24;
        var days = parseFloat(theTime.getTime() / parseInt(divNum));
        return days;
      } else if (isNaN(inputValue) && formulaType == "string") {
        //targetInput.focus();
        //alert("请输入数字");
        console.info("公式运算，请输入数字");
        iscalculate = false;
        return false;
      }
      if (formulaType == "string" && typeof inputValue == "number") {
        return "\"" + inputValue + "\"";
      }
      return inputValue;
    });
    if (iscalculate === true && formulaType == "string") {
      try {
        var result = "";
        if (expStr.indexOf("+") == -1 && expStr.indexOf("-") == -1) {
          //为单个值
          result = expStr;
        } else {
          result = eval(expStr);
        }
        if (resultIsSubtable) {
          rowData[resultInputName] = result;
        } else {
          myvm.data[resultInputName] = result;
        }
      } catch (err) {
        console.info(err);
      }
    } else if (iscalculate === true && formulaType == "number") {
      try {
        expStr = expStr.replace(/MyMath.sum/g, "");
        var result = eval(expStr);
        if (!isNaN(result)) {
          //四舍五入,保留N位小数  Object.toDecimal(Number(f2grid_global_columnCountData[name]), digitlen);
          if (isDateMath) {
            // result = isHoursCalc ? (Number(result)).toFixed(digitlen) : (Number(result)).toFixed(digitlen);
            result = isHoursCalc ? Object.tofixed(result, digitlen) : Object.tofixed(result, digitlen);
          }
          else {
            result = Object.tofixed(result, digitlen);
          }
        }
        if (isCapitalAmount == "1") {
          result = Object.toChinaNum(result);
        }
        if (resultIsSubtable) {
          if (rowData && rowData.hasOwnProperty(resultInputName)) {
            rowData[resultInputName] = !isNaN(result) ? result : '';
          }
        } else {
          if (myvm.data.hasOwnProperty(resultInputName)) {
            myvm.data[resultInputName] = !isNaN(result) ? result : '';
          }
        }
      } catch (err) {
        console.info(err);
      }
    }
  }
}
