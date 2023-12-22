/*******************************************************************************
 *
 * 工作流选择对话框
 *
 * 作者：luoxw
 * 邮箱: 1827528476
 * 日期: 2016-5-14
 * 版权：广州致博软件科技有限公司
 *
 ******************************************************************************/
//流程定义选择对话框
WF.SelectorDialog = {
  //选择流程定义
  workflowSelector: selectorWorkflow,
  //选择流程节点
  selectorWorkflowActivity: selectorWorkflowActivity,
  //选择流程节点的表单
  selectWorkflowActForm: selectWorkflowActForm,
  //选择流程应用
  selectorProcessApp: selectorProcessApp,
  //选择表单应用
  processFormSelector: selectorProcessForm,
  //选择表单应用，返回值存放Json对象
  processFormObjectSelector: selectorProcessFormObject,
  //选择系统变量
  selectSystemVars: selectSystemVars,

  //选择图表
  selectorReport: selectorReport,

  selectorTextValue: selectorTextValue,
  selectorUserTextValue: selectorUserTextValue,
  selectOnlyUsers: selectOnlyUsers,
  selectorUserString: selectorUserString,
  selectStrUsers: selectStrUsers,
  onlineFormDefSelectorDialog: selectorOnlineFormDef,

  //选择自定义列表
  selectCustomDataGrid: selectCustomDataGrid,
  //选择应用中的项目链接
  selectorApplicationItem: selectorApplicationItem,
  //选择图表门户
  selectAppPortal: selectAppPortal,

  selectCategory: _selectCategory,


  //批量设置分类
  setCategory: _setCategory,

  selectOrg: _selectOrg,

  selectOrgListItem:_selectOrgListItem,
  //选择数据库表或视图
  selectDbTable: _selectDbTable,
  //选择在线表单定义的表的数据列
  tableColumnSelect: _tableColumnSelect,
  //选择在线表单定义的表（主表加子表）
  formTableSelect: _formTableSelect,

  //从表单应用、表，视图或MapKey中构建数据库字段条件
  dbfieldWhereSelect: _dbfieldWhereSelect,
  //从表单应用、表，视图或MapKey中构建数据库字段键值对参数条件
  dbfieldParamsSelect: _dbfieldParamsSelect,

  //从表单应用、表，视图或MapKey中选取数据库字段名
  dbfieldSelect: _dbfieldSelect,
  //表单字段选择
  selectorFormField: selectorFormField,
  //
  selectFormFieldProcInstContextVar: selectFormFieldProcInstContextVar,
  //选择流程上下文变量
  selectProcInstContextVar: selectProcInstContextVar,
  selectPublicAuthor: _selectPublicAuthor,
  //数据字典选择
  selectDataDict: selectDataDict,
  //数据字典类别选择
  selectDataDictConfigType: selectDataDictConfigType,

  //选择领导关系类型
  selectRelationType: selectRelationType,

  //选择汇报树
  selectRelation: selectRelation,
  //选择租户
  selectTenantor: selectTenantor,

  //自定义按钮构建设计
  customButtonSelect: _customButtonSelect,

  //表单自定义编码设计
  getCustomCodeDialog: _getCustomCodeDialog,

  //选择地图上的地址
  getMapAddress: _getMapAddress,

  //通用键值对编辑器
  keyValueEditor: _keyValueEditor,

  //通用弹窗文本编辑
  selectTextEditor: _selectTextEditor,

  //选择图标
  selectAweIcon: _selectAweIcon,

  //选择颜色
  selectColor: _selectColor,
  //样式颜色
  selectStyle: _selectStyle,

  //选择岗位
  selectPosition: _selectPosition,

  //选择职务
  selectPostJobTextValue: _selectPostJobTextValue

};
//选择地图位置地址
//$vm：vue对象
//amapAccessKey：高德地图的KEY
//inputKey:存放地址信息
//inputlon：存放经度
//inputlat: 存放纬度
//callback：回调函数，如果有回调，将不自动设置
//vueBackBindObj：结果存放的指定对象
function _getMapAddress($vm, amapAccessKey, inputKey, inputlon, inputlat, callback, vueBackBindObj) {
  var vueObj = vueBackBindObj || $vm.data;
  var addr = vueObj[inputKey] || "";
  var lon = vueObj[inputlon] || "";
  var lat = vueObj[inputlat] || "";
  var parm = { "addr": addr, "lon": lon, "lat": lat };
  FUI.dialog(__webpath + "/workflow/selector/selectMapAddress?amapAccessKey=" + amapAccessKey, "选择地图位置", parm, 1200, 630, function (json, index, layerObject) {
    if (callback) {
      callback(json);
    } else if (json != "") {
      vueObj[inputKey] = json[0].addr;
      vueObj[inputlon] = json[0].lon;
      vueObj[inputlat] = json[0].lat;
    } else {
      vueObj[inputKey] = "";
      vueObj[inputlon] = "";
      vueObj[inputlat] = "";
    }
    layerObject.close(index);
    ;
  }, true);
}


//选择组织部门
//inputKey:存放Key的输入框ID
//inputName：存放标题文字的输入框ID
//resultFieldKey: 取roupId还是取groupCode，默认为groupId
//singleSelect:true单选,false多选，默认单选
function _selectOrg($vm, inputKey, inputName, singleSelect, resultFieldKey, needRoot, vueDataObj) {
  if (singleSelect == undefined) {
    singleSelect = true;
  }
  if (needRoot == undefined) {
    needRoot = false;
  }
  var targetBindData = vueDataObj ? vueDataObj : $vm.data;
  var parm = { "needRoot": needRoot, singleSelect: singleSelect, resultFieldKey: resultFieldKey, data: [] };
  FUI.dialog(__webpath + "/workflow/selector/selectOrg", "选择组织", parm, 500, 560, function (objectData, index, layerObject) {
    if (objectData.length > 0) {
      var ids = [];
      var titles = [];
      $.each(objectData, function (i, item) {
        ids.push(item.value);
        titles.push(item.text);
      });
      targetBindData[inputKey] = ids.toString();
      targetBindData[inputName] = titles.toString();

    } else {
      targetBindData[inputKey] = "";
      targetBindData[inputName] = "";
    }
    layerObject.close(index);
  }, true);
}


//选择组织部门for 循环嵌套 带返回调方法
function _selectOrgListItem($vm, inputKey, inputName, singleSelect, resultFieldKey, needRoot, vueDataObj,fn) {
  if (singleSelect == undefined) {
    singleSelect = true;
  }
  if (needRoot == undefined) {
    needRoot = false;
  }
  var targetBindData = vueDataObj ? vueDataObj : $vm.data;
  var parm = { "needRoot": needRoot, singleSelect: singleSelect, resultFieldKey: resultFieldKey, data: [] };
  FUI.dialog(__webpath + "/workflow/selector/selectOrg", "选择组织", parm, 500, 560, function (objectData, index, layerObject) {
    console.log("objectData:",objectData);
    if (objectData.length > 0) {
      var ids = [];
      var titles = [];
      $.each(objectData, function (i, item) {
        ids.push(item.value);
        titles.push(item.text);
      });
        targetBindData[inputKey] = ids.toString();
        targetBindData[inputName] = titles.toString();

    } else {
      targetBindData[inputKey] = "";
      targetBindData[inputName] = "";
    }
    layerObject.close(index);

    return fn({title: titles.toString(),id:ids.toString()})
  }, true);
}

//选择物理表名
//inputKey:存放Key的输入框ID
//inputName：存放标题文字的输入框ID
//xtype:类别，V视图，U表，空或all则为所有,allns:所有但不包括系统级的，outtable仅外部表
//singleSelect:true单选,false多选，默认单选
//dbSourceCode:外部DB数据源，可为空
function _selectDbTable($vm, inputKey, inputName, xtype, singleSelect, needRoot, vueBackBindObj, dbSourceCode) {

  var vueObj = vueBackBindObj || $vm.data;
  dbSourceCode = dbSourceCode || "";
  if (singleSelect == undefined) {
    singleSelect = true;
  }
  if (needRoot == undefined) {
    needRoot = false;
  }
  var inputKeyVal = vueObj[inputKey];
  var inputNameVal = inputName == null ? "" : $vm.data[inputName];
  var parm;
  if (inputKeyVal == "" || inputName == null || inputKey == null) {
    parm = { "needRoot": needRoot, singleSelect: singleSelect, tableType: xtype, data: [], "dbSourceCode": dbSourceCode };
  } else {
    var data = [];
    var ids = inputKeyVal.split(',');
    var names = inputNameVal.split(',');
    for (index in ids) {
      data.push({ "value": ids[index], "text": names[index].replace(/%/g,'%25') });
      parm = { "needRoot": needRoot, singleSelect: singleSelect, tableType: xtype, data: data, "dbSourceCode": dbSourceCode };
    }
  }
  FUI.dialog(FUI.Handlers.Selector + "selectDbTable/", "选择数据库表", parm, 450, 520, function (objectData, index, layerObject) {
    if (objectData.length > 0) {
      var ids = [];
      var titles = [];
      $.each(objectData, function (i, item) {
        ids.push(item.value);
        titles.push(item.text);
      });
      vueObj[inputKey] = ids.toString();
      if (inputName) {
        vueObj[inputName] = titles.toString();
      }


    } else {
      vueObj[inputKey] = "";
      if (inputName) {
        vueObj[inputName] = "";
      }

    }
    layerObject.close(index);
  }, true);
}

//构建数据库字段条件
//inputId：结果值存放的目标控件ID
//或formKey：如果有值则认为是表单应用，则从表单应用的主表中取字段
//或dataMainTableName:指定物理表，视图、MapID中取字段
//或tableId: 根据TableId取定义字段
//根据formKey或dataMainTableName（此处可以是物理表名也可以是视图名也可以是MapId）或tableId 三者传其中一个取列定义
function _dbfieldWhereSelect($vm, inputId, formKey, dataMainTableName, tableId) {
  formKey = formKey || "";
  tableId = tableId || "";
  dataMainTableName = dataMainTableName || "";
  var initailData = "";
  var inputIdVal = $vm.data[inputId];
  initailData = inputIdVal ? eval("(" + inputIdVal + ")") : "";
  var url = FUI.Handlers.Selector + "dbfieldWhereSelect/?";
  var isAnd = false;
  if (tableId) {
    url = url + "tableId=" + tableId;
    isAnd = true;
  }
  if (dataMainTableName) {
    if (isAnd) {
      url = url + "&";
    }
    url = url + "dataMainTableName=" + dataMainTableName;
    isAnd = true;
  }
  if (formKey) {
    if (isAnd) {
      url = url + "&";
    }
    url = url + "formKey=" + formKey;
    isAnd = true;
  }
  FUI.dialog(url, "数据字段过滤条件", { "data": initailData }, 680, 500, function (data, index, layerObject) {
    if (data.length > 0) {
      var jsonStr = JSON.stringify(data).replace(/\"/g, "'");
      $vm.data[inputId] = jsonStr;
    } else {
      $vm.data[inputId] = "";
    }
    layerObject.close(index);
    return false;
  }, true);
}

//构建数据库字段键值对参数JSON
//inputId：结果值存放的目标控件ID
//或formKey：如果有值则认为是表单应用，则从表单应用的主表中取字段
//或dataMainTableName:指定物理表，视图、MapID中取字段
//或tableId: 根据TableId取定义字段
//根据formKey或dataMainTableName（此处可以是物理表名也可以是视图名也可以是MapId）或tableId 三者传其中一个取列定义
function _dbfieldParamsSelect($vm, inputId, formKey, dataMainTableName, tableId) {
  formKey = formKey || "";
  tableId = tableId || "";
  dataMainTableName = dataMainTableName || "";
  var initailData = "";
  var inputIdVal = $vm.data[inputId];
  if (inputIdVal != "") {
    initailData = eval("(" + inputIdVal + ")");
  }
  FUI.dialog(FUI.Handlers.Selector + "dbfieldParamsSelect/?tableId=" + tableId + "&dataMainTableName=" + dataMainTableName + "&formKey=" + formKey, "数据字段参数", {
    "data": initailData
  }, 680, 460, function (data, index, layerObject) {
    if (data.length > 0) {
      var jsonStr = JSON.stringify(data).replace(/\"/g, "'");
      $vm.data[inputId] = jsonStr;
    } else {
      $vm.data[inputId] = "";
    }
    layerObject.close(index);
    return false;
  }, true);
}

//构建自定义按钮
//inputId：结果值存放的目标控件ID
//type:大小类型，min，normal
//vueBackBindObj，值回填写到vue对象，如果不传默认为$vm.data[input]
//formDefId:表单定义ID，非必填，用于配置在线表单的自定义按钮
function _customButtonSelect($vm, inputId, type, title, vueBackBindObj, formDefId) {
  var initailData = "";
  formDefId = formDefId || "";
  var vueObj = vueBackBindObj || $vm.data;
  var valueInput = vueObj[inputId];
  try{
    if (valueInput != "" && valueInput != undefined && typeof valueInput == 'string') {
      initailData = eval("(" + valueInput + ")");
    } else if (valueInput) {
      initailData = valueInput;
    }
  }catch(err){
    console.error("自定义按钮配置出错(请尝试重新配置)："+err);
    initailData = "";
  }
  FUI.dialog(__webpath + FUI.Handlers.Selector + "customButtonSelect?formDefId=" + formDefId + "&type=" + type, title || "自定义按钮", {
    "data": initailData
  }, 580, 500, function (data, index, layer) {
    console.info(data);
    if (data.length > 0) {
      var jsonStr = JSON.stringify(data);
      vueObj[inputId] = jsonStr;
      console.info( vueObj[inputId] );
    } else {
      vueObj[inputId] = "";
    }
    layer.close(index);
    return false;
  }, true);
}

//获取自定义编码的对话框
//inputId：结果值存放的目标控件ID
//formDefId:表单定义ID（为了获取表单字段）
function _getCustomCodeDialog(inputId, formDefId) {
  if (formDefId == undefined || formDefId == "") {
    formDefId = WFContext.FormDefId;
  }
  var initailData = "";
  FUI.dialog(__webpath + "/workflow/customize/getCustomCodeDialog/?formDefId=" + formDefId, "获取自定义编码", {
    "data": initailData
  }, 860, 520, function (data, index, layerObject) {
    if (data.length > 0) {
      $("#" + inputId).val(data);
    } else {
      $("#" + inputId).val("");
    }
    layerObject.close(index);
    return false;
  }, false);
}


//根据 表单应用Key、 物理表名、视图名、MapKey选择字段名  formKey与dataMainTableName必填其中一个
//formKey: 表单应用的Key
//dataMainTableName:  物理表名、视图名、MapKey
//inputKey:存放字段名的输入框ID,多个之间使用逗号隔开
//inputTitle：存放字段标题的输入框ID,多个之间使用逗号隔开
//singleSelect:true单选,false多选，默认单选
//isAppend:是否使用追加模式，默认为false
//varSymbol:变量括起来的符合，可为空
function _dbfieldSelect($vm, formKey, dataMainTableName, inputKey, inputTitle, singleSelect, vueBackBindObj, isAppend, varSymbol) {
  var vueObj = vueBackBindObj || $vm.data;
  formKey = formKey || "";
  if (singleSelect == undefined) {
    singleSelect = true;
  }
  var parm = { singleSelect: singleSelect };
  FUI.dialog(__webpath + "/workflow/selector/dbfieldSelect/?formKey=" + formKey + "&dataMainTableName=" + dataMainTableName,
    "选择数据库字段", parm, 450, 520, function (objectData, index, layerObject) {
      if (objectData === false) {
        return false;
      }
      if (objectData.length > 0) {
        var ids = [];
        var titles = [];
        $.each(objectData, function (i, item) {
          if (varSymbol) {
            ids.push(varSymbol + item.value + varSymbol);
            titles.push(varSymbol + item.text + varSymbol);
          } else {
            ids.push(item.value);
            titles.push(item.text);
          }

        });
        if (inputKey) {
          vueObj[inputKey] = isAppend === true ? vueObj[inputKey] + ids.toString() : ids.toString();
        }
        if (inputTitle) {
          vueObj[inputTitle] = isAppend === true ? vueObj[inputTitle] + titles.toString() : titles.toString();
        }
      } else {
        if (inputKey && !isAppend) {
          vueObj[inputKey] = "";
        }
        if (inputTitle) {
          vueObj[inputTitle] = "";
        }
      }
      layerObject.close(index);
    }, true);
}


//根据TableId或FormKey选择在线表单的物理表的列名
//tableId:表定义ID,与表单应用formKey必须传递一个，都传时优先使用TableId
//inputName：存放columnName的输入框ID,多个之间使用逗号隔开
//inputKey:存放columnId的输入框ID,多个之间使用逗号隔开
//inputTitle：存放columnTitle的输入框ID,多个之间使用逗号隔开
//singleSelect:true单选,false多选，默认单选
function _tableColumnSelect(tableId, formKey, inputName, inputKey, inputTitle, singleSelect) {
  formKey = formKey || "";
  if (singleSelect == undefined) {
    singleSelect = true;
  }

  var parm = { singleSelect: singleSelect, data: [] };
  FUI.dialog(FUI.Handlers.SmartFormHandler + "tableColumnSelect/?tableId=" + tableId + "&formKey=" + formKey, "选择定义字段", parm, 600, 440, function (objectData, index, layerObject) {
    if (objectData === false) {
      return false;
    }
    if (objectData.length > 0) {
      var ids = [];
      var names = [];
      var titles = [];

      $.each(objectData, function (i, item) {
        ids.push(item.ColumnId);
        names.push(item.ColumnName);
        titles.push(item.ColumnTitle);
      });
      if (inputKey) {
        $("#" + inputKey).val(ids.toString());
      }
      if (inputName) {
        $("#" + inputName).val(names.toString());
      }
      if (inputTitle) {
        $("#" + inputTitle).val(titles.toString());
      }
    } else {
      if (inputKey) {
        $("#" + inputKey).val("");
      }
      if (inputName) {
        $("#" + inputName).val("");
      }
      if (inputTitle) {
        $("#" + inputTitle).val("");
      }
    }
    layerObject.close(index);
  }, true);
}

//批量设置类别，无还原数据
//tableName:要设置的数据表名
//fieldName：字段名
//fieldValue: 哪些记录的分类，多个之间使用英文逗号隔开
//groupKey:分类的类型，如WorkflowGroup
function _setCategory(tableName, fieldName, fieldValue, categoryField, groupKey) {
  var singleSelect = true;
  var parm = { "needRoot": false, singleSelect: singleSelect, groupKey: groupKey, data: [] };
  FUI.dialog("/workflow/selector/selectCategory/", "设置分类", parm, 450, 450, function (objectData, index, layerObject) {
    if (objectData.length > 0) {
      var ids = [];
      var titles = [];
      $.each(objectData, function (i, item) {
        ids.push(item.value);
        titles.push(item.text);
      });
      var setToCategoryCodes = ids.toString();
      var setToCategoryTitles = titles.toString();
      var res = Object.toAjaxJson("/workflow/security/category/", "setCategory", {
        "categoryField": categoryField,
        "tableName": tableName,
        "fieldName": fieldName,
        "fieldValue": fieldValue,
        "setToCategoryCodes": setToCategoryCodes,
        "setToCategoryTitles": setToCategoryTitles
      });
      refreshTargetGrid('grid');
      layerObject.close(index);
    } else {
      FUI.Window.showMsg('请选择要设置的分类 ');
    }

  });
}


//选择类别
//inputKey:存放Key的输入框ID
//inputName：存放标题文字的输入框ID
//groupKey:类别分组编码
//singleSelect:true单选,false多选，默认单选
function _selectCategory(inputKey, inputName, groupKey, singleSelect, needRoot) {
  if (singleSelect == undefined) {
    singleSelect = true;
  }
  if (needRoot == undefined) {
    needRoot = false;
  }
  var parm;
  if ($("#" + inputKey).val() == "" || $("#" + inputName).val() == "" || inputName == null || inputKey == null) {
    parm = { "needRoot": needRoot, singleSelect: singleSelect, groupKey: groupKey, data: [] };
  } else {
    var data = [];
    var ids = $("#" + inputKey).val().split(',');
    var names = $("#" + inputName).val().split(',');
    if (ids && names) {
      for (index in ids) {
        data.push({ "value": ids[index], "text": names[index].replace(/%/g,'%25') });
        parm = { "needRoot": needRoot, singleSelect: singleSelect, groupKey: groupKey, data: data };
      }
    }
  }
  FUI.dialog(__webpath + "/workflow/selector/selectCategory/", "选择类别", parm, 500, 450, function (objectData, index, layerObject) {
    if (objectData.length > 0) {
      var ids = [];
      var titles = [];
      $.each(objectData, function (i, item) {
        ids.push(item.value);
        titles.push(item.text);
      });
      $("#" + inputKey).val(ids.toString());
      $("#" + inputName).val(titles.toString());

    } else {
      $("#" + inputKey).val("");
      $("#" + inputName).val("");

    }
    layerObjectclose(index);
    ;
  }, true);
}


//选择流程定义
//inputKey:存放Key的输入框ID
//inputName：存放标题文字的输入框ID
//singleSelect:true单选,false多选，默认单选
//procInfoType:类型combine共用流程
function selectorWorkflow($vm, inputKey, inputName, singleSelect, procInfoType) {
  if (singleSelect == undefined) {
    singleSelect = true;
  }
  var inputKeyValue = $vm.data[inputKey] || "";
  var parm;
  if (inputKeyValue == "") {
    parm = { singleSelect: singleSelect, data: [] };
  } else {
    var data = [];
    var ids = inputKeyValue.split(',');
    var names = $vm.data[inputName].split(',');
    for (index in ids) {
      data.push({ "WorkflowKey": ids[index], "WorkflowName": names[index] });
      parm = { singleSelect: singleSelect, data: data };
    }
  }
  procInfoType = procInfoType || "";
  FUI.dialog(__webpath + "/workflow/selector/workflowSelect?procInfoType=" + procInfoType, "选择流程定义", parm, 900, 500, function (objectData, index, layerObject) {
    if (objectData.length > 0) {
      var ids = [];
      var titles = [];
      $.each(objectData, function (i, item) {
        ids.push(item.WorkflowKey);
        titles.push(item.WorkflowName);
      });
      $vm.data[inputKey] = ids.toString();
      $vm.data[inputName] = titles.toString();

    } else {
      $vm.data[inputKey] = "";
      $vm.data[inputName] = "";
    }
    layerObject.close(index);
  }, true);
}

//选择流程节点的表单
//inputKey:存放Key的输入框ID
//keyIsJson:存放Key的输入框是否保存全部Json，默认否
//inputName：存放标题文字的输入框ID
//singleSelect:true单选,false多选，默认单选
function selectWorkflowActForm($vm, appId, wid, inputKey, inputName, keyIsJson, singleSelect) {
  if (singleSelect == undefined) {
    singleSelect = true;
  }
  var inputKeyValue = $vm.data[inputKey] || "";
  var parm;
  if (inputKeyValue == "") {
    parm = { singleSelect: singleSelect, data: [] };
  } else {
    var data = [];
    if (keyIsJson == true) {
      data = eval("(" + inputKeyValue + ")");
      parm = { singleSelect: singleSelect, data: data };
    } else {
      var ids = inputKeyValue.split(',');
      var names = $vm.data[inputName].split(',');
      for (index in ids) {
        data.push({ "value": ids[index], "text": names[index].replace(/%/g,'%25') });
        parm = { singleSelect: singleSelect, data: data };
      }
    }

  }
  FUI.dialog(__webpath + "/workflow/selector/selectWorkflowActForm/?appId=" + appId + "&wid=" + wid, "选择流程的节点表单", parm, 500, 450, function (objectData, index, layerObject) {
    if (objectData.length > 0) {
      var ids = [];
      var titles = [];
      $.each(objectData, function (i, item) {
        ids.push(item.value);
        titles.push(item.text);
      });
      if (keyIsJson == true) {
        $vm.data[inputKey] = JSON.stringify(objectData);
      } else {
        $vm.data[inputKey] = ids.toString();
      }
      $vm.data[inputName] = titles.toString();

    } else {
      $vm.data[inputKey] = "";
      $vm.data[inputName] = "";

    }
    layerObject.close(index);
  }, true);
}

//选择流程节点
//inputKey:存放Key的输入框ID
//keyIsJson:存放Key的输入框是否保存全部Json，默认否
//inputName：存放标题文字的输入框ID
//singleSelect:true单选,false多选，默认多选
function selectorWorkflowActivity($vm, inputKey, inputName, keyIsJson, singleSelect, vueDataObj) {
  if (singleSelect == undefined) {
    singleSelect = false;
  }
  var parm;
  var targetBindData = vueDataObj ? vueDataObj : $vm.data;
  var inputKeyValue = targetBindData[inputKey] || "";
  var inputNameValue = targetBindData[inputName] || "";
  if (inputKeyValue == "") {
    parm = { singleSelect: singleSelect, data: [] };
  } else {
    var data = [];
    if (keyIsJson == true) {
      data = eval("(" + inputKeyValue + ")");
      parm = { singleSelect: singleSelect, data: data };
    } else {
      var ids = inputKeyValue.split(',');
      var names = inputNameValue.split(',');
      for (index in ids) {
        data.push({ "value": ids[index], "text": names[index].replace(/%/g,'%25') });
        parm = { singleSelect: singleSelect, data: data };
      }
    }

  }
  FUI.dialog(__webpath + "/workflow/selector/selectWorkflowActivity/", "选择流程节点", parm, 900, 560, function (objectData, index, layerObject) {
    if (objectData.length > 0) {
      var ids = [];
      var titles = [];
      $.each(objectData, function (i, item) {
        ids.push(item.value);
        titles.push(item.text);
      });
      if (keyIsJson == true) {
        targetBindData[inputKey] = JSON.stringify(objectData);
      } else {
        targetBindData[inputKey] = ids.toString();
      }
      targetBindData[inputName] = titles.toString();

    } else {
      targetBindData[inputKey] = "";
      targetBindData[inputName] = "";

    }
    layerObject.close(index);
  }, true);
}

//选择流程应用
//inputKey:存放Key的输入框ID
//inputName：存放标题文字的输入框ID
//singleSelect:true单选,false多选，默认单选
function selectorProcessApp($vm, inputKey, inputName, singleSelect) {
  if (singleSelect == undefined) {
    singleSelect = true;
  }
  var parm;
  var inputKeyValue = $vm.data[inputKey];
  var inputNameValue = $vm.data[inputName];
  if (!inputKeyValue) {
    parm = { singleSelect: singleSelect, data: [] };
  } else {
    var data = [];
    var ids = inputKeyValue.split(',');
    var names = inputNameValue.split(',');
    for (index in ids) {
      data.push({ "AppId": ids[index], "AppName": names[index] });
      parm = { singleSelect: singleSelect, data: data };
    }
  }
  FUI.dialog(__webpath + "/workflow/selector/workflowAppSelect/", "选择流程应用", parm, 860, 500, function (objectData, index, layerObject) {
    if (objectData.length > 0) {
      var ids = [];
      var titles = [];
      $.each(objectData, function (i, item) {
        ids.push(item.AppId);
        titles.push(item.AppName);
      });
      $vm.data[inputKey] = ids.toString();
      $vm.data[inputName] = titles.toString();

    } else {
      $vm.data[inputKey] = "";
      $vm.data[inputName] = "";

    }
    layerObject.close(index);
  }, true);
}


//选择图表 
//inputKey:存放Key的输入框ID
//inputName：存放标题文字的输入框ID
//singleSelect:true单选,false多选，默认单选
function selectorReport($vm, inputKey, inputName, singleSelect, vueBackBindObj) {
  if (singleSelect == undefined) {
    singleSelect = true;
  }
  var vueObj = vueBackBindObj || $vm.data;
  var parm;
  var inputKeyValue = vueObj[inputKey];
  var inputNameValue = vueObj[inputName];
  if (!inputKeyValue) {
    parm = { singleSelect: singleSelect, data: [] };
  } else {
    var data = [];
    var ids = inputKeyValue.split(',');
    var names = inputNameValue.split(',');
    for (index in ids) {
      data.push({ "AppId": ids[index], "AppName": names[index] });
      parm = { singleSelect: singleSelect, data: data };
    }
  }
  FUI.dialog(__webpath + "/workflow/selector/selectReport/", "选择图表", parm, 860, 500, function (objectData, index, layerObject) {
    if (objectData.length > 0) {
      var ids = [];
      var titles = [];
      $.each(objectData, function (i, item) {
        ids.push(item.ReportCode);
        titles.push(item.ReportName);
      });
      vueObj[inputKey] = ids.toString();
      vueObj[inputName] = titles.toString();

    } else {
      vueObj[inputKey] = "";
      vueObj[inputName] = "";
    }
    layerObject.close(index);
  }, true);
}


//选择表单应用
//inputKey:存放Key的输入框ID
//inputName：存放标题文字的输入框ID
//singleSelect:是否单选，默认单选
function selectorProcessForm($vm, inputKey, inputName, singleSelect, vueDataObj) {
  if (singleSelect == undefined) {
    singleSelect = true;
  }
  var targetBindData = vueDataObj ? vueDataObj : $vm.data;
  var inputKeyValue = targetBindData[inputKey] || "";
  var inputNameValue = targetBindData[inputName] || "";
  var parm;
  if (inputKeyValue == "" || inputNameValue == "") {
    parm = { singleSelect: singleSelect, data: [] };
  } else {
    var data = [];
    var ids = inputKeyValue.split(',');
    var names = inputNameValue.split(',');
    for (index in ids) {
      data.push({ "FormKey": ids[index], "FormName": names[index] });
      parm = { singleSelect: singleSelect, data: data };
    }
  }
  FUI.dialog(__webpath + "/workflow/selector/workflowFormSelect", "选择表单应用", parm, 900, 500, function (objectData, index, layerObject) {
    if (objectData.length > 0) {
      var ids = [];
      var titles = [];
      $.each(objectData, function (i, item) {
        ids.push(item.FormKey);
        titles.push(item.FormName);
      });
      targetBindData[inputKey] = ids.toString();
      if (inputName) {
        targetBindData[inputName] = titles.toString();
      }


    } else {
      targetBindData[inputKey] = "";
      if (inputName) {
        targetBindData[inputName] = "";
      }
    }
    layerObject.close(index);
  }, true);
}

//选择表单，inputKey存放所有信息的json对象
function selectorProcessFormObject($vm, inputKey, inputName, singleSelect, vueDataObj, callBack) {
  if (singleSelect == null || singleSelect == undefined) {
    singleSelect = true;
  }
  var targetBindData = vueDataObj ? vueDataObj : $vm.data;
  var inputkeyValue = targetBindData[inputKey] || "";
  var parm;
  if (inputkeyValue == "") {
    parm = { singleSelect: singleSelect, data: [] };
  } else {
    //[{FormKey:,FormName}]
    var data = eval("(" + inputkeyValue + ")");
    parm = { singleSelect: singleSelect, data: data };
  }

  FUI.dialog(__webpath + "/workflow/selector/workflowFormSelect", "选择表单应用", parm, 950, 500, function (objectData, index, layerObject) {
    if (objectData.length > 0) {
      var ids = [];
      var titles = [];
      $.each(objectData, function (i, item) {
        ids.push(item.FormKey);
        titles.push(item.FormName);
      });
      if (callBack) {
        var func = eval(callBack);
        func(objectData);
      } else {
        targetBindData[inputKey] = JSON.stringify(objectData);
        targetBindData[inputName] = titles.toString();
      }
    } else {
      targetBindData[inputKey] = "";
      targetBindData[inputName] = "";
    }
    layerObject.close(index);
  });
}


//表单的表树
//formDefId:表单定义ID
//inputKey:存放Key的输入框ID
//inputName：存放标题文字的输入框ID
//isNeedField：是否需要列
//levelType：只能选择的级别 main只能选择主表或主字段,sub只能选择子表或子字段
//singleSelect:是否单选，默认单选
//valueProName：返回的vaue使用哪个属性来填充，字段时默认为columnId，选择表时默认为tableId
function _formTableSelect($vm, formDefId, isNeedField, levelType, inputKey, inputName, singleSelect, vueDataObj, valueProName) {
  if (singleSelect == undefined) {
    singleSelect = true;
  }
  valueProName = valueProName || "";
  var targetBindData = vueDataObj ? vueDataObj : $vm.data;
  var parm;
  var inputKeyValue = targetBindData[inputKey] || "";
  if (inputKeyValue == "") {
    parm = { formDefId: formDefId, singleSelect: singleSelect, data: [] };
  } else {
    var data = [];
    var ids = inputKeyValue.split(',');
    var names = inputName == null ? inputKeyValue.split(',') : targetBindData[inputName].split(',');
    for (index in ids) {
      data.push({ "value": ids[index], "text": names[index].replace(/%/g,'%25') });
      parm = { singleSelect: singleSelect, data: data };
    }
  }
  FUI.dialog(__webpath + "/workflow/selector/selectFormTable/?isNeedField=" + isNeedField + "&levelType=" + levelType + "&formDefId=" + formDefId + "&valueProName=" + valueProName, "选择表单的表", parm, 500, 400, function (objectData, index, layerObject) {
    if (objectData.length > 0) {
      var ids = [];
      var titles = [];
      $.each(objectData, function (i, item) {
        ids.push(item.value);
        titles.push(item.text);
      });
      targetBindData[inputKey] = ids.toString();
      if (inputName != null)
        targetBindData[inputName] = titles.toString();
    } else {
      targetBindData[inputKey] = "";
      if (inputName != null)
        targetBindData[inputName] = "";
    }
    layerObject.close(index);
  }, true);
}

//表单字段选择
//formDefId:表单定义ID
//wid:或者流程定义ID
//inputKey:存放Key的输入框ID
//inputName：存放标题文字的输入框ID
//singleSelect:是否单选，默认单选
//vue回填写的对象，默认为$vm.data  可传入示例$vm.data.parms
//callBack:回调函数
function selectorFormField($vm, formDefId, wid, inputKey, inputName, singleSelect, vueDataObj, callBack) {
  if (singleSelect == undefined || singleSelect == null) {
    singleSelect = true;
  }
  formDefId = formDefId || "";
  wid = wid || "";
  var targetBindData = vueDataObj ? vueDataObj : $vm.data;
  var parm;
  var inputKeyValue = targetBindData[inputKey] || "";
  if (inputKeyValue == "" || !inputName) {
    parm = { formDefId: formDefId, wid: wid, singleSelect: singleSelect, data: [] };
  } else {
    var data = [];
    var ids = inputKeyValue.split(',');
    var names = !inputName ? inputKeyValue.split(',') : targetBindData[inputName].split(',');
    for (index in ids) {
      data.push({ "value": ids[index], "text": names[index].replace(/%/g,'%25') });
      parm = { singleSelect: singleSelect, data: data };
    }
  }
  FUI.dialog(__webpath + "/workflow/selector/selectFormField/?wid=" + wid + "&formDefId=" + formDefId, "选择表单字段", parm, 450, 500, function (objectData, index, layerObject) {
    if (objectData.length > 0 && callBack) {
      callBack(objectData);
      layerObject.close(index);
    }
    if (objectData.length > 0) {
      var ids = [];
      var titles = [];

      $.each(objectData, function (i, item) {
        ids.push(item.value);
        titles.push(item.text);
      });
      targetBindData[inputKey] = ids.toString();
      if (inputName) {
        targetBindData[inputName] = titles.toString();
      }
    } else {
      targetBindData[inputKey] = "";
      if (inputName) {
        targetBindData[inputName] = "";
      }
    }
    layerObject.close(index);
  }, true);
}

//表单字段变量及流程上下文变量
//wid,appId,formKey只需传其中一个。
//inputKey:存放结果输入框ID
//singleSelect:是否单选，默认单选
//vue回填写的对象，默认为$vm.data  可传入示例$vm.data.parms
function selectFormFieldProcInstContextVar($vm, wid, appId, formKey, inputId, singleSelect, vueDataObj) {
  if (singleSelect == undefined) {
    singleSelect = true;
  }
  wid = wid || "";
  appId = appId || "";
  formKey = formKey || "";
  var targetBindData = vueDataObj ? vueDataObj : $vm.data;
  var parm = { wid: wid, singleSelect: singleSelect };
  FUI.dialog(__webpath + "/workflow/selector/selectFormFieldProcInstContextVar/?type=ProcFormFieldVar&wid=" + wid + "&appId=" + appId + "&formKey=" + formKey, "选择表单字段变量", parm, 570, 500, function (objectData, index, layerObject) {
    if (objectData) {
      targetBindData[inputId] = targetBindData[inputId] + objectData;
    }
    layerObject.close(index);
  });
}

//流程上下文变量
//type:类型 type:ProcessVar流程变量,GeneralField标准字段库,在线表单字段FormDefField,WfContextVars,All,ProcFormFieldVar在线表单字段及流程上下文变量
//wid,appId,formKey只需传其中一个。
//inputKey:存放结果输入框ID
//singleSelect:是否单选，默认单选
//vue回填写的对象，默认为$vm.data  可传入示例$vm.data.parms
function selectProcInstContextVar($vm, type, wid, appId, formKey, inputId, singleSelect, vueDataObj) {
  if (singleSelect == undefined) {
    singleSelect = true;
  }
  wid = wid || "";
  appId = appId || "";
  formKey = formKey || "";
  var targetBindData = vueDataObj ? vueDataObj : $vm.data;
  var parm = { wid: wid, singleSelect: singleSelect };
  FUI.dialog(__webpath + "/workflow/selector/selectFormFieldProcInstContextVar/?type=" + type + "&wid=" + wid + "&appId=" + appId + "&formKey=" + formKey, "选择表单字段变量", parm, 570, 500, function (objectData, index, layerObject) {
    if (objectData) {
      targetBindData[inputId] = targetBindData[inputId] + objectData;
    }
    layerObject.close(index);
  });
}


//选择在线表单定义
//inputKey:存放Key的输入框ID
//inputName：存放标题文字的输入框ID
//singleSelect:是否单选，默认单选
function selectorOnlineFormDef($vm, inputKey, inputName, singleSelect, vueDataObj) {
  var targetBindData = vueDataObj ? vueDataObj : $vm.data;
  if (singleSelect == undefined) {
    singleSelect = true;
  }
  var parm = targetBindData[inputKey] == "" ? { singleSelect: singleSelect, data: [] } : {
    singleSelect: true,
    data: [{ "FormDefId": targetBindData[inputKey], "FormDefName": targetBindData[inputName] }]
  };
  FUI.dialog(__webpath + "/workflow/selector/formDefSelect/", "选择在数据模型", parm, 880, 560, function (objectData, index, layerObject) {
    if (objectData.length > 0) {
      targetBindData[inputKey] = objectData[0].FormDefId;
      targetBindData[inputName] = objectData[0].FormDefName;
    } else {
      targetBindData[inputKey] = "";
      targetBindData[inputName] = "";

    }
    layerObject.close(index);
  }, true);
};

//选择自定义列表
//inputKey:存放Key的输入框ID
//inputName：存放标题文字的输入框ID
//singleSelect:是否单选，默认单选
function selectCustomDataGrid($vm, inputKey, inputName, singleSelect, vueDataObj) {
  var targetBindData = vueDataObj ? vueDataObj : $vm.data;
  if (singleSelect == undefined) {
    singleSelect = true;
  }
  var parm = targetBindData[inputKey] == "" ? { singleSelect: singleSelect, data: [] } : {
    singleSelect: true,
    data: [{ "ConfigTableName": targetBindData[inputKey], "DataGridTitle": targetBindData[inputName] }]
  };
  FUI.dialog(__webpath + "/workflow/selector/customDataGridSelect/", "选择自定义列表", parm, 880, 560, function (objectData, index, layerObject) {
    if (objectData.length > 0) {
      targetBindData[inputKey] = objectData[0].ConfigTableName;
      targetBindData[inputName] = objectData[0].DataGridTitle;
    } else {
      targetBindData[inputKey] = "";
      targetBindData[inputName] = "";

    }
    layerObject.close(index);
  }, true);
};

//选择自定义图表门户
//inputKey:存放Key的输入框ID
//inputName：存放标题文字的输入框ID
//singleSelect:是否单选，默认单选
function selectAppPortal($vm, inputKey, inputName, singleSelect, vueDataObj) {
  var targetBindData = vueDataObj ? vueDataObj : $vm.data;
  if (singleSelect == undefined) {
    singleSelect = true;
  }
  var parm = targetBindData[inputKey] == "" ? { singleSelect: singleSelect, data: [] } : {
    singleSelect: true,
    data: [{ "id": targetBindData[inputKey], "portalName": targetBindData[inputName] }]
  };
  FUI.dialog(__webpath + "/workflow/selector/appPortalSelect/", "选择图表门户", parm, 880, 560, function (objectData, index, layerObject) {
    if (objectData.length > 0) {
      var ids = [];
      var titles = [];
      $.each(objectData, function (i, item) {
        ids.push(item.id);
        titles.push(item.portalName);
      });
      targetBindData[inputKey] = ids.toString();
      targetBindData[inputName] = titles.toString();
    } else {
      targetBindData[inputKey] = "";
      targetBindData[inputName] = "";

    }
    layerObject.close(index);
  }, true);
};

//选择应用项目
//inputKey:存放Key的输入框ID
//inputName：存放标题文字的输入框ID
//singleSelect:true单选,false多选，默认单选
function selectorApplicationItem($vm, inputKey, inputName, singleSelect, vueDataObj) {
  if (singleSelect == undefined) {
    singleSelect = true;
  }
  var targetBindData = vueDataObj ? vueDataObj : $vm.data;
  var parm;
  var inputKeyValue = targetBindData[inputKey];
  var inputNameValue = targetBindData[inputName];
  if (!inputKeyValue) {
    parm = { singleSelect: singleSelect, data: [] };
  } else {
    var data = [];
    var ids = inputKeyValue.split(',');
    var names = inputNameValue.split(',');
    for (index in ids) {
      data.push({ "value": ids[index], "text": names[index].replace(/%/g,'%25') });
      parm = { singleSelect: singleSelect, data: data };
    }
  }
  FUI.dialog(__webpath + "/workflow/selector/applicationItemSelect/", "选择应用项目", parm, 510, 550, function (objectData, index, layerObject) {
    if (objectData.length > 0) {
      var ids = [];
      var titles = [];
      $.each(objectData, function (i, item) {
        ids.push(item.value);
        titles.push(item.text);
      });
      targetBindData[inputKey] = ids.toString();
      targetBindData[inputName] = titles.toString();

    } else {
      targetBindData[inputKey] = "";
      targetBindData[inputName] = "";

    }
    layerObject.close(index);
  }, true);
}
//type:部门、角色，流程步骤，键值关键字为：text,value 通用开型选择对话框,inputKey存放的是完整的Json数据
//inputKey:默认存放结果Jon数组，通过valueIsJson=false时存放以英文逗号隔开的字符串
//inputName：存放标题文字
//passParm:页面参数{},可传入需要获取的字段关键字，如选择角色、部门时可传入{keyName:groupCode}
//singleSelect:是否单选，true：单选,false:多选,默认多选
//valueIsJson:值是否为Json格式，默认是
//vueDataObj：vue回填写的对象，默认为$vm.data  可传入示例$vm.data.parms
//callBack：vue的回调函数名
function selectorTextValue($vm, inputKey, inputName, type, passParm, singleSelect, valueIsJson, vueDataObj, callBack) {
  if (singleSelect == undefined) {
    singleSelect = false;
  }
  if (passParm && typeof passParm == "string") {
    passParm = eval("(" + passParm + ")");
  }
  passParm = passParm || {};
  if (valueIsJson == undefined) {
    valueIsJson = true;
  }
  var targetBindData = vueDataObj ? vueDataObj : $vm.data;
  var parm;
  var inputKeyValue = targetBindData[inputKey];
  parm = { "singleSelect": singleSelect, data: [] };
  if (inputKeyValue != "" && valueIsJson) {
    var data;
    try {
      data = eval("(" + inputKeyValue + ")");
    } catch (err) {
      data = [];
    }
    parm = { "singleSelect": singleSelect, data: data };
  }
  parm = Object.extend(parm, passParm);
  var widht = 520;
  var height = 480;
  var url = "";
  var title = "";
  type = type.toLowerCase();
  switch (type) {
    case "org":
      url = __webpath + "/workflow/selector/selectOrg";
      title = "选择部门";
      widht = 520;
      break;
    case "role": {
      url = __webpath + "/workflow/selector/selectRole";
      title = "选择角色";
      widht = 450;
      height = 450;
    }
      break;
    case "postJob": {
      url = __webpath + "/workflow/selector/selectPostJob";
      title = "选择角色";
      widht = 450;
      height = 450;
    }
      break;
    case "activity":
    case "historyactivity": {
      var wid = passParm.wid || "";
      var appId = passParm.appId || "";

      url = __webpath + "/workflow/selector/selectHistoryActivity/?wid=" + wid + "&appId=" + appId;
      title = "选择节点";
      widht = 500;
      height = 450;
    }
      break;
    case "approaction": {
      var wid = passParm.wid || "";
      var appId = passParm.appId || "";
      var activityId = passParm.activityId || "";
      url = __webpath + "/workflow/selector/selectApproAction/?wid=" + wid + "&activityId=" + activityId;
      title = "选择审核菜单";
      height = 450;
      widht = 430;
    }
      break;
    default:
      break;
  }
  FUI.dialog(url, title, parm, widht, height, function (objectData, index, layerObject) {
    if (objectData === false) {
      return false;
    }
    if (objectData.length > 0) {
      var titles = [];
      var ids = [];
      $.each(objectData, function (i, item) {
        titles.push(item.text);
        ids.push(item.value);
      });
      if (valueIsJson === true) {
        targetBindData[inputKey] = JSON.stringify(objectData);
      } else {
        targetBindData[inputKey] = ids.toString();
      }
      targetBindData[inputName] = titles.toString();

    } else {
      targetBindData[inputKey] = "";
      targetBindData[inputName] = "";
    }
    if (callBack) {
      $vm[callBack](type, objectData);
    }

    layerObject.close(index);
    return false;
  }, true);
};
function showSystemCurrentVars(type, passParm) {
  var parm = passParm || {};
  var widht = 550;
  var height = 450;
  var url = "";
  var title = "";
  url = __webpath + "/workflow/selector/showSystemCurrentVars/?type=" + type;
  title = "查看系统变量";
  FUI.dialog(url, title, parm, widht, height, function (objectData, index, layerObject) {
    layerObject.close(index);
    return false;
  }, false, { isShowSure: false });
}

//选择系统变量
//type:user当前用户变量，wf流程变量+用户变量
//inputKey:存放变量名的输入框
//inputName：存放标题文字的输入框
//isAppend:是否追加到输入框
//singleSelect:是否单选，true：单选,false:多选,默认单选
function selectSystemVars($vm, inputKey, inputName, isAppend, singleSelect, vueDataObj) {
  var targetBindData = vueDataObj ? vueDataObj : $vm.data;
  if (singleSelect == undefined) {
    singleSelect = true;
  }
  if (isAppend == undefined) {
    isAppend = true;
  }
  var parm = { "singleSelect": singleSelect };
  var widht = 430;
  var height = 400;
  var url = "";
  var title = "";
  var url = __webpath + "/workflow/selector/selectSystemVars";
  title = "选择系统变量";
  FUI.dialog(url, title, parm, widht, height, function (objectData, index, layerObject) {
    if (objectData.length > 0) {
      var titles = [];
      var ids = [];
      $.each(objectData, function (i, item) {
        titles.push(item.text);
        ids.push(item.value);
      });
      if (inputKey) {
        targetBindData[inputKey] = isAppend ? targetBindData[inputKey] + ids.toString() : ids.toString();
      }
      if (inputName) {
        targetBindData[inputName] = isAppend ? targetBindData[inputName] + titles.toString() : titles.toString();
      }
    } else if (isAppend != true) {
      if (inputKey) {
        targetBindData[inputKey] = "";
      }
      if (inputName) {
        targetBindData[inputName] = "";
      }
    }
    layerObject.close(index);
    return false;
  }, true);
};

//用户选择，返回以逗号隔开的字符串,弹出窗口不回显原值
//inputKey:Key以逗号隔开的字符串
//inputName：存放姓名以逗号隔开的字符串
//singleSelect:是否单选，true：单选,false:多选,默认多选
//KeyName：account账号（默认）,userId用户ID
//passParm:传递的页面参数，如orgName
function selectOnlyUsers($vm, inputKey, inputName, passParm, singleSelect, keyName) {
  if (singleSelect == undefined) {
    singleSelect = false;
  }
  passParm = passParm || {};
  keyName = keyName || "account";
  var parm = { "singleSelect": singleSelect, data: [], resultFieldKey: keyName };
  var widht = 815;
  var height = 500;
  var url = __webpath + "/workflow/selector/selectOnlyUsers/";
  var title = "选择用户";
  FUI.dialog(url, title, parm, widht, height, function (objectData, index, layerObject) {
    if (objectData.length > 0) {
      var titles = [];
      var keys = [];
      var data = [];
      $.each(objectData, function (i, item) {
        titles.push(item.realName);
        keys.push(item[keyName]);
      });
      if (inputKey) {
        $vm.data[inputKey] = keys.toString();
      }
      if (inputName) {
        $vm.data[inputName] = titles.toString();
      }
    } else {
      $vm.data[inputKey] = "";
      if (inputName) {
        $vm.data[inputName] = "";
      }
    }
    layerObject.close(index);
    return false;
  }, true);
};
//用户选择，返回以逗号隔开的字符串,弹出窗口不回显原值
//inputKey:Key以逗号隔开的字符串
//inputName：存放姓名以逗号隔开的字符串
//singleSelect:是否单选，true：单选,false:多选,默认多选
//KeyName：Account账号（默认）,UserId用户ID
//passParm:传递的页面参数，如orgName
function selectorUserString($vm, inputKey, inputName, passParm, singleSelect, keyName) {
  if (singleSelect == undefined) {
    singleSelect = false;
  }
  passParm = passParm || {};
  keyName = keyName || "account";
  var parm = { "singleSelect": singleSelect, data: [], keyName: keyName };
  var widht = 815;
  var height = 500;
  var orgName = passParm.orgName || "";
  var url = __webpath + "/workflow/selector/selectUsers/?orgName=" + orgName;
  var title = "选择用户";
  FUI.dialog(url, title, parm, widht, height, function (objectData, index, layerObject) {
    if (objectData.length > 0) {
      var titles = [];
      var keys = [];
      var data = [];
      $.each(objectData, function (i, item) {
        titles.push(item.realName);
        keys.push(item[keyName]);
      });
      if (inputKey) {
        $vm.data[inputKey] = keys.toString();
      }
      if (inputName) {
        $vm.data[inputName] = titles.toString();
      }
    } else {
      $vm.data[inputKey] = "";
      if (inputName) {
        $vm.data[inputName] = "";
      }
    }
    layerObject.close(index);
    return false;
  }, true);
};

//用户选择，键值关键字为：text,value 通用开型选择对话框,inputKey存放的是完整的Json数据
//inputKey:存放结果Jon数组
//inputName：存放标题文字
//singleSelect:是否单选，true：单选,false:多选,默认多选
//KeyName：UserId用户ID（默认）,Account用户账号
//vue回填写的对象，默认为$vm.data  可传入示例$vm.data.parms
function selectorUserTextValue($vm, inputKey, inputName, passParm, singleSelect, keyName, width, height, vueDataObj) {
  if (singleSelect == undefined) {
    singleSelect = false;
  }
  passParm = passParm || {};
  keyName = keyName || "userId";
  var targetBindData = vueDataObj ? vueDataObj : $vm.data;
  var parm;
  if (targetBindData[inputKey] == "") {
    parm = { "singleSelect": singleSelect, data: [], keyName: keyName };
  } else {
    var data;
    try {
      var inputKeyvalue = targetBindData[inputKey];
      data = eval("(" + inputKeyvalue + ")");
      if (data == undefined) {
        data = [];
      }
    } catch (err) {
      data = [];
    }
    if (data.length > 0) {
      var temData = [];
      //转换格式
      $.each(data, function (i, item) {
        if (keyName == "userId") {
          temData.push({ userId: item.value, realName: item.text });
        } else {
          temData.push({ account: item.value, realName: item.text });
        }
      });
      data = temData;
    }
    parm = { "singleSelect": singleSelect, data: data, resultFieldKey: keyName };
  }
  var widht = width || 830;
  var height = height || 480;
  var orgName = passParm.orgName || "";
  var url = __webpath + "/workflow/selector/selectUsers/?orgName=" + orgName;
  var title = "选择用户";
  FUI.dialog(url, title, parm, widht, height, function (objectData, index, layerObject) {
    if (objectData.length > 0) {
      var titles = [];
      var data = [];
      $.each(objectData, function (i, item) {
        titles.push(item.realName);
        data.push({ value: item[keyName], text: item.realName });
      });
      targetBindData[inputKey] = JSON.stringify(data);
      targetBindData[inputName] = titles.toString();

    } else {
      targetBindData[inputKey] = "";
      targetBindData[inputName] = "";

    }
    layerObject.close(index);
    return false;
  }, true);
};




//inputId 姓名关闭时回填写的控件
//hidInputId UserId的隐藏值控件 默认无
//isSingle是否单选 默认否 0 1
//columnName 取哪个字段值 可为空，默认UserId
//orgName为空时表示不限制哪个部门 默认空
function selectStrUsers($vm, inputId, hidInputId, isSingle, columnName, orgName) {
  orgName = orgName || "";
  isSingle = isSingle || 0;
  columnName = columnName || "userId";
  hidInputId = hidInputId || "";
  selectorUserString($vm, hidInputId, inputId, { "orgName": orgName }, isSingle == 1, columnName);
  //FUI.Window.openEdit("/Selector/SelectStrUsers/?inputId=" + inputId + "&hidInputId=" + hidInputId + "&isSingle=" + isSingle + "&columnName=" + columnName + "&orgName=" + orgName, "选择用户", FUI.FormAction.View, null, 800, 400);
}

//岗位选择，返回以逗号隔开的字符串,弹出窗口不回显原值
//$vm:vue对象
//vueDataObj:vue子对象
//inputKey:Key以逗号隔开的字符串(默认方式)
//inputName：存放姓名以逗号隔开的字符串
//singleSelect:是否单选，true：单选,false:多选,默认多选
//inputKeyIsJson:inputKey是否存放JSON格式 默认否
//isTextValue:是否使用text value格式 默认否
//passParm:自定义参数JSON格式，如{a:1,b1}
function _selectPosition($vm, vueDataObj, inputKey, inputName, singleSelect, inputKeyIsJson, isTextValue, passParm) {
  if (singleSelect == undefined) {
    singleSelect = false;
  }
  var keyName = "postCode";
  var targetBindData = vueDataObj ? vueDataObj : $vm.data;
  var parm = { "singleSelect": singleSelect, data: [] };
  if ((inputKeyIsJson == true || isTextValue == true) && targetBindData[inputKey] != "") {
    var data;
    try {
      var inputKeyvalue = targetBindData[inputKey];
      data = eval("(" + inputKeyvalue + ")");
      if (data == undefined) {
        data = [];
      }
    } catch (err) {
      data = [];
    }
    if (data.length > 0) {
      var temData = [];
      $.each(data, function (i, item) {
        if (isTextValue) {
          temData.push({ postCode: item.value, postName: item.text });
        } else {
          temData.push({ postCode: item.postCode, postName: item.postName });
        }
      });
      data = temData;
    }
    parm = { "singleSelect": singleSelect, data: data };
  }
  if (passParm) {
    parm = Object.extend(parm, passParm);
  }
  var widht = 815;
  var height = 500;
  var url = __webpath + "/workflow/selector/selectPosition";
  var title = "选择岗位";
  FUI.dialog(url, title, parm, widht, height, function (objectData, index, layerObject) {
    if (objectData.length > 0) {
      var titles = [];
      var keys = [];
      var dataTextValue = [];
      var dataObj = [];
      $.each(objectData, function (i, item) {
        titles.push(item.postName);
        keys.push(item[keyName]);
        dataTextValue.push({ value: item[keyName], text: item.postName });
        dataObj.push({ postCode: item[keyName], postName: item.postName });
      });
      if (inputKeyIsJson && isTextValue == false) {
        $vm.data[inputKey] = JSON.stringify(dataObj);
      }
      else if (isTextValue) {
        $vm.data[inputKey] = JSON.stringify(dataTextValue);
      } else if (inputKey) {
        $vm.data[inputKey] = keys.toString();
      }
      if (inputName) {
        $vm.data[inputName] = titles.toString();
      }
    } else {
      $vm.data[inputKey] = "";
      if (inputName) {
        $vm.data[inputName] = "";
      }
    }
    layerObject.close(index);
    return false;
  }, true);
};

//职务选择，返回以逗号隔开的字符串,弹出窗口不回显原值 
//$vm:vue对象
//vueDataObj:vue子对象
//inputKey:Key以逗号隔开的字符串(默认方式)
//inputName：存放姓名以逗号隔开的字符串
//singleSelect:是否单选，true：单选,false:多选,默认多选
//inputKeyIsJson:inputKey是否存放JSON格式 默认否.原生格式是{text:value}格式
//passParm:自定义参数JSON格式，如{a:1,b1}
function _selectPostJobTextValue($vm, vueDataObj, inputKey, inputName, singleSelect, inputKeyIsJson, passParm) {
  if (singleSelect == undefined) {
    singleSelect = false;
  }
  var keyName = "value";
  var textName = "text";
  var targetBindData = vueDataObj ? vueDataObj : $vm.data;
  var parm = { "singleSelect": singleSelect, data: [] };
  if (inputKeyIsJson && targetBindData[inputKey] != "") {
    var data;
    try {
      var inputKeyvalue = targetBindData[inputKey];
      data = eval("(" + inputKeyvalue + ")");
      if (data == undefined) {
        data = [];
      }
    } catch (err) {
      data = [];
    }
    if (data.length > 0) {
      var temData = [];
      $.each(data, function (i, item) {
        temData.push({ value: item.value, text: item.text });
      });
      data = temData;
    }
    parm = { "singleSelect": singleSelect, data: data };
  }
  if (passParm) {
    parm = Object.extend(parm, passParm);
  }
  var widht = 514;
  var height = 540;
  var url = __webpath + "/workflow/selector/selectPostJob";
  var title = "选择职务";
  FUI.dialog(url, title, parm, widht, height, function (objectData, index, layerObject) {
    if (objectData.length > 0) {
      var titles = [];
      var keys = [];
      var data = [];
      $.each(objectData, function (i, item) {
        titles.push(item[textName]);
        keys.push(item[keyName]);
        data.push({ text: item[textName], value: item[keyName] });
      });
      if (inputKeyIsJson) {
        $vm.data[inputKey] = JSON.stringify(data);
      }
      else if (inputKey) {
        $vm.data[inputKey] = keys.toString();
      }
      if (inputName) {
        $vm.data[inputName] = titles.toString();
      }
    } else {
      $vm.data[inputKey] = "";
      if (inputName) {
        $vm.data[inputName] = "";
      }
    }
    layerObject.close(index);
    return false;
  }, true);
};

//发布授权选择器
//inputKey:存放结果Json的输入框ID
//inputName：存放文字描述的输入框ID
//entityKey:授权对象数据源ID
//authorizeType:授权对象的类型
function _selectPublicAuthor(inputKey, inputName, entityKey, title, authorizeType) {
  var parm;
  var title = title || "";
  if ($("#" + inputKey).val() == "") {
    parm = { inputKey: inputKey, inputName: inputName, data: null, descript: "" };
  } else {
    var dataJson = eval("(" + $("#" + inputKey).val() + ")");
    parm = { inputKey: inputKey, inputName: inputName, data: dataJson, descript: $("#" + inputName).val() };
  }
  FUI.dialog(__webpath + "/workflow/selector/selectPublicAuthor/?entityKey=" + entityKey + "&authorizeType=" + authorizeType, title + "授权设置", parm, null, null, function (objectData, index, layerObject) {
    if (objectData != "" && objectData != null) {
      $("#" + inputKey).val(JSON.stringify(objectData.data.authorizeUserJson));
      $("#" + inputName).val(objectData.descript);

    } else {
      $("#" + inputKey).val("");
      $("#" + inputName).val("");

    }
    layerObject.close(index);
  }, true);
}

//选择数据字典配置类型
//inputId:存放结果的输入属性
function selectDataDictConfigType($vm, inputId, prex) {
  var width = 480;
  var height = 450;
  var initablValue = $vm.data[inputId] || "";
  initablValue = initablValue.replace(prex, "");
  FUI.dialog(__webpath + "/workflow/selector/selectDicConfigType/", "选择数据字典配置类型", initablValue, width, height, function (dataObject, index, layerObject) {
    if (dataObject) {
      $vm.data[inputId] = prex + dataObject;
    } else {
      $vm.data[inputId] = "";
    }
    layerObject.close(index);
  }, true);
}

//选择数据字典
//键值关键字为：text,value 通用开型选择对话框,inputKey存放的是完整的Json数据
//inputKey:存放结果Jon数组
//inputName：存放标题文字
//singleSelect:是否单选，true：单选,false:多选,默认多选
//configType:指定数据字典配置，传空则为全部
//resultKeyIsJson: inputKey控制此结果是否为Json字符串结果
//calbackFunction:回调函数
//vueDataObj回填写的对象，默认为$vm.data  可传入示例$vm.data.parms
function selectDataDict($vm, inputId, inputName, configType, passParm, singleSelect, resultKeyIsJson, calbackFunction, vueDataObj) {
  if (singleSelect == undefined) {
    singleSelect = false;
  }
  configType = configType || "";
  passParm = passParm || {};
  if (resultKeyIsJson == undefined) {
    resultKeyIsJson = true;
  }
  var targetBindData = vueDataObj ? vueDataObj : $vm.data;
  var parm;
  var initablValue = targetBindData[inputId] || "";
  if (initablValue == "") {
    parm = { "configType": configType, singleSelect: singleSelect, data: [] };
  } else {
    var data;
    try {
      data = eval("(" + initablValue + ")");
      var arr = [];
      $.each(data, function (i, item) {
        arr.push({ ConfigName: item.text, ConfigValue: item.value });
      });
      data = arr;
    } catch (err) {
      data = [];
    }
    parm = { "configType": configType, singleSelect: singleSelect, data: data };
  }
  var widht = 660;
  var height = 460;
  var title = "选择数据字典配置";
  var url = __webpath + "/workflow/selector/selectDataDict";

  FUI.dialog(url, title, parm, widht, height, function (objectData, index, layerObject) {
    if (objectData.length > 0) {
      var txArr = [];
      var titles = [];
      var keys = [];
      $.each(objectData, function (i, item) {
        titles.push(item.ConfigName);
        keys.push(item.ConfigValue);
        txArr.push({ text: item.ConfigName, value: item.ConfigValue });
      });
      if (resultKeyIsJson == true) {
        targetBindData[inputId] = JSON.stringify(txArr);
      } else {
        targetBindData[inputId] = keys.toString();
      }
      targetBindData[inputName] = titles.toString();
      layerObject.close(index);
      if (calbackFunction) {
        calbackFunction(objectData);
      }
    } else {
      targetBindData[inputKey] = "";
      targetBindData[inputName] = "";
      layerObject.close(index);
    }
    return false;
  }, true);
}
//选择标签关系类型
//键值关键字为：text,value 通用开型选择对话框,inputId存放的是完整的Json数据
//inputId:存放结果Jon数组
//inputName：存放标题文字
//singleSelect:是否单选，true：单选,false:多选,默认多选
//infoType:指定类型，传空则为全部
//resultKeyIsJson: inputId控制此结果是否为Json字符串结果
//calbackFunction:回调函数
//vueDataObj回填写的对象，默认为$vm.data  可传入示例$vm.data.parms
function selectRelationType($vm, inputId, inputName, infoType, passParm, singleSelect, resultKeyIsJson, calbackFunction, vueDataObj) {
  if (singleSelect == undefined) {
    singleSelect = false;
  }
  infoType = infoType || "";
  passParm = passParm || {};
  if (resultKeyIsJson == undefined) {
    resultKeyIsJson = true;
  }
  var targetBindData = vueDataObj ? vueDataObj : $vm.data;
  var parm;
  var data = [];
  if (inputId && inputName) {
    var initablValue = targetBindData[inputId] || "";
    if (initablValue != "" && resultKeyIsJson == true) {
      try {
        data = eval("(" + initablValue + ")");
        var arr = [];
        $.each(data, function (i, item) {
          arr.push({ typeTitle: item.text, typeCode: item.value });
        });
        data = arr;
      } catch (err) {
        data = [];
      }
    }
  }
  parm = { singleSelect: singleSelect, data: data };
  var widht = 660;
  var height = 460;
  var title = "选择关系标签";
  var url = __webpath + "/workflow/selector/selectRelationType?infoType=" + infoType;
  FUI.dialog(url, title, parm, widht, height, function (objectData, index, layerObject) {
    if (objectData.length > 0) {
      var txArr = [];
      var titles = [];
      var keys = [];
      $.each(objectData, function (i, item) {
        titles.push(item.typeTitle);
        keys.push(item.typeCode);
        txArr.push({ text: item.typeTitle, value: item.typeCode });
      });
      if (calbackFunction) {
        calbackFunction(objectData);
        layerObject.close(index);
        return false;
      }
      if (resultKeyIsJson == true) {
        targetBindData[inputId] = JSON.stringify(txArr);
      } else if (inputId) {
        targetBindData[inputId] = keys.toString();
      }
      if (inputName) {
        targetBindData[inputName] = titles.toString();
      }
      layerObject.close(index);
    } else {
      if (inputId) {
        targetBindData[inputKey] = "";
      }
      if (inputName) {
        targetBindData[inputName] = "";
      }
      layerObject.close(index);
    }
    return false;
  }, true);
}

//选择汇报树
//键值关键字为：text,value 通用开型选择对话框,inputId存放的是完整的Json数据
//inputId:存放结果Jon数组
//inputName：存放标题文字
//singleSelect:是否单选，true：单选,false:多选,默认多选
//resultKeyIsJson: inputId控制此结果是否为Json字符串结果
//calbackFunction:回调函数
//vueDataObj回填写的对象，默认为$vm.data  可传入示例$vm.data.parms
function selectRelation($vm, inputId, inputName, passParm, singleSelect, resultKeyIsJson, calbackFunction, vueDataObj) {
  if (singleSelect == undefined) {
    singleSelect = false;
  }
  passParm = passParm || {};
  if (resultKeyIsJson == undefined) {
    resultKeyIsJson = true;
  }
  var targetBindData = vueDataObj ? vueDataObj : $vm.data;
  var parm;
  var data = [];
  if (inputId && inputName) {
    var initablValue = targetBindData[inputId] || "";
    if (initablValue != "" && resultKeyIsJson == true) {
      try {
        data = eval("(" + initablValue + ")");
        var arr = [];
        $.each(data, function (i, item) {
          arr.push({ relationKey: item.text, relationTitle: item.value });
        });
        data = arr;
      } catch (err) {
        data = [];
      }
    }
  }
  parm = { singleSelect: singleSelect, data: data };
  var widht = 870;
  var height = 500;
  var title = "选择汇报树";
  var url = __webpath + "/workflow/selector/selectRelation";

  FUI.dialog(url, title, parm, widht, height, function (objectData, index, layerObject) {
    if (objectData.length > 0) {
      var txArr = [];
      var titles = [];
      var keys = [];
      $.each(objectData, function (i, item) {
        titles.push(item.relationTitle);
        keys.push(item.relationKey);
        txArr.push({ text: item.relationTitle, value: item.relationKey });
      });
      if (calbackFunction) {
        calbackFunction(objectData);
        layerObject.close(index);
        return false;
      }
      if (resultKeyIsJson == true) {
        targetBindData[inputId] = JSON.stringify(txArr);
      } else if (inputId) {
        targetBindData[inputId] = keys.toString();
      }
      if (inputName) {
        targetBindData[inputName] = titles.toString();
      }
      layerObject.close(index);
    } else {
      if (inputId) {
        targetBindData[inputKey] = "";
      }
      if (inputName) {
        targetBindData[inputName] = "";
      }
      layerObject.close(index);
    }
    return false;
  }, true);
}
//选择租户
//键值关键字为：text,value 通用开型选择对话框,inputKey存放的是完整的Json数据
//inputKey:存放Key
//inputName：存放标题文字
//singleSelect:是否单选，true：单选,false:多选,默认单选
//resultKeyIsJson: inputKey控制此结果是否为Json字符串结果,默认为false
//calbackFunction:回调函数
//vueDataObj回填写的对象，默认为$vm.data  可传入示例$vm.data.parms
function selectTenantor($vm, inputId, inputName, vueDataObj, singleSelect, resultKeyIsJson, calbackFunction) {
  if (singleSelect == undefined) {
    singleSelect = true;
  }
  var passParm = {};
  if (resultKeyIsJson == undefined) {
    resultKeyIsJson = false;
  }
  var targetBindData = vueDataObj ? vueDataObj : $vm.data;
  if (targetBindData == undefined || targetBindData == null) {
    targetBindData = {};
  }
  var parm;
  var initablValue = targetBindData[inputId] || "";
  if (initablValue == "") {
    parm = { singleSelect: singleSelect, data: [] };
  } else {
    var data;
    try {
      if (resultKeyIsJson && initablValue) {
        data = eval("(" + initablValue + ")");
      } else if (targetBindData[inputId] && targetBindData[inputName]) {
        var idsArr = targetBindData[inputId].split(",");
        var titlesArr = targetBindData[inputName].split(",");
        var arr = [];
        $.each(idsArr, function (i, item) {
          var id = item;
          var t = titlesArr[i];
          arr.push({ tenantCode: id, tenantName: t });
        });
        data = arr;
      }
    } catch (err) {
      data = [];
    }
    parm = { singleSelect: singleSelect, data: data };
  }
  var widht = 660;
  var height = 500;
  var title = "选择租户";
  var url = __webpath + "/workflow/selector/selectTenantor";

  FUI.dialog(url, title, parm, widht, height, function (objectData, index, layerObject) {
    if (objectData.length > 0) {
      if (calbackFunction) {
        calbackFunction(objectData);
      }
      var txArr = [];
      var titles = [];
      var keys = [];
      $.each(objectData, function (i, item) {
        titles.push(item.tenantName);
        keys.push(item.tenantCode);
        txArr.push({ text: item.tenantName, value: item.tenantCode });
      });
      if (resultKeyIsJson == true) {
        targetBindData[inputId] = JSON.stringify(txArr);
      } else {
        targetBindData[inputId] = keys.toString();
      }
      targetBindData[inputName] = titles.toString();
      layerObject.close(index);

    } else {
      targetBindData[inputKey] = "";
      targetBindData[inputName] = "";
      layerObject.close(index);
    }
    return false;
  }, true);
}
//选择图标
function _selectAweIcon($vm, inputId, widht, height, vueDataObj, isAddPre) {
  var targetBindData = vueDataObj ? vueDataObj : $vm.data;
  var url = __webpath + "/workflow/selector/selectAweIcon/?inputId=" + inputId;
  widht = widht || 600;
  height = height || 450;
  FUI.dialog(url, "选择图标", {}, widht, height, function (faClassName, index, layerObject) {
    var preFlag = "fa ";
    if (faClassName) {
      if (Object.toStartWith(faClassName, 'icon')) {
        preFlag = "icon ";
      }
      targetBindData[inputId] = isAddPre ? preFlag + faClassName : faClassName;
      layerObject.close(index);
    } else {
      targetBindData[inputId] = "";
      layerObject.close(index);
    }
    return false;
  }, true, { fit: true });
}
//==============通用窗口编辑器================================
//键值对编辑器
//inputId：结果JSON值存放的目标控件ID
//type:tv:text vlue键值对,kv：key,value键值对
//vueDataObj回填写的对象，默认为$vm.data  可传入示例$vm.data.parms
//isStringify:是否转成字符串，默认是
//formDefId:表单定义ID，如果有值，则属性名可选择表单字段
//wid:如果有值则可以根据wid来选择表单字段参数，优先使用formDefId
//isSelectField:是否可选择字段，false否，true是；不传为"",按默认规则执行
function _keyValueEditor($vm, inputId, type, title, vueDataObj, isStringify, formDefId, wid,isSelectField) {
  if (isStringify == null || isStringify == undefined) {
    isStringify = true;
  }
  if (isSelectField == null || isSelectField == undefined) {
    isSelectField = "";
  }
  if (formDefId == null || formDefId == undefined) {
    formDefId = "";
  }
  if (wid == null || wid == undefined) {
    wid = "";
  }
  var targetBindData = vueDataObj ? vueDataObj : $vm.data;
  var initailData = "";
  if (targetBindData[inputId] != "" && typeof targetBindData[inputId] == "string") {
    initailData = eval("(" + targetBindData[inputId] + ")");
  } else if (targetBindData[inputId] != "") {
    initailData = targetBindData[inputId];
  }
  var url = FUI.Handlers.Selector + "keyValueEditor/?type=" + type;
  if (formDefId) {
    url = FUI.Handlers.Selector + "keyValueEditor/?type=" + type + "&formDefId=" + formDefId+"&isSelectField="+isSelectField;
  }
  if (wid) {
    url = FUI.Handlers.Selector + "keyValueEditor/?type=" + type + "&wid=" + wid+"&isSelectField="+isSelectField;
  }
  FUI.dialog(url, title || "键值对", {
    "data": initailData
  }, 500, 480, function (data, index, layerObject) {
    if (data.length > 0) {
      //var jsonStr = isStringify ? JSON.stringify(data).replace(/\"/g, "'") : data;
      var jsonStr = isStringify ? JSON.stringify(data): data;
      targetBindData[inputId] = jsonStr;
    } else {
      targetBindData[inputId] = "";
    }
    layerObject.close(index);
    return false;
  }, true);
}
//通用文本输入编辑器
//inputId*：结果值存放的目标控件ID
//title*:标题
//label: 输入框的label
//tip:placeholder的输入框灰色字说明
//description:输入框下面详细描述说明
//width:窗口宽度
//height:窗口高度
//vueDataObj回填写的对象，默认为$vm.data  可传入示例$vm.data.parms
function _selectTextEditor($vm, inputId, title, label, tip, description, isShowSysVars, width, height, vueDataObj) {
  width = width || 650;
  height = height || 550;
  if (isShowSysVars == undefined || isShowSysVars == null) {
    isShowSysVars = false;
  }
  var targetBindData = vueDataObj ? vueDataObj : $vm.data;
  var initailData = "";
  if (targetBindData[inputId] != undefined) {
    initailData = targetBindData[inputId];
  }
  FUI.dialog(FUI.Handlers.Selector + "selectTextEditor", title || "编辑", {
    "data": initailData, title: title, label: label, tip: tip, description: description, isShowSysVars: isShowSysVars
  }, width, height, function (data, index, layerObject) {
    targetBindData[inputId] = data;
    layerObject.close(index);
    return false;
  }, true);
}

/**
 * 样式编辑器
 */
function _selectStyle($vm, inputId, vueDataObj) {
  var width = 750;
  var height = 550;
  var targetBindData = vueDataObj ? vueDataObj : $vm.data;
  var initailData = "";
  if (targetBindData[inputId] != undefined) {
    initailData = targetBindData[inputId];
  }
  FUI.dialog(FUI.Handlers.Selector + "selectStyle", "编辑样式", { "data": initailData }, width, height, function (data, index, layerObject) {
    targetBindData[inputId] = data;
    layerObject.close(index);
    return false;
  }, true);
}

function _selectColor($vm, inputId, vueDataObj) {
  var width = 550;
  var height = 400;
  var targetBindData = vueDataObj ? vueDataObj : $vm.data;
  var initailData = "";
  if (targetBindData[inputId] != undefined) {
    initailData = targetBindData[inputId];
  }
  FUI.dialog(FUI.Handlers.Selector + "selectColor", "选择颜色", { "data": initailData }, width, height, function (data, index, layerObject) {
    targetBindData[inputId] = data;
    layerObject.close(index);
    return false;
  }, true);
}
