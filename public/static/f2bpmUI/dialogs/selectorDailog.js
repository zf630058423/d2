/*****自定义选择器*****/

//组织选择器
//$vm：vue实例对象，
//vueDataObj:回绑数据的对象，如果不传，默认为$vm.data
var orgSelector = function ($vm, conf, vueDataObj) {
  var vueDataObj = vueDataObj || $vm.data;
  //comfig指的是选择器配置中{"selectorName":"orgSelector",isMulti: isMulti,"data":[{"title":"组织名称","property":"OrgName","field":"CarApplyfor.CarSector"}]}
  //返回的属性参数：OrgCode，OrgName

  //绑定目标字段
  var targetOrgName = "";
  var targetOrgCode = "";
  var temData = conf.data || [];
  $.each(temData, function (index, item) {
    if (item.property == "OrgName") {
      targetOrgName = item.field;
    }
    if (item.property == "OrgCode") {
      targetOrgCode = item.field;
    }
  });
  // var isMulti = conf.isMulti || true;
  // if (isMulti == "true" || isMulti == true) {
  //   isMulti = true;
  // } else {
  //   isMulti = false;
  // }
  var singleSelect = !conf.isMulti;
  var passParm = conf.passParm || {};
  var inputKey = targetOrgCode;
  var inputName = targetOrgName;
  var parm = { singleSelect: singleSelect, data: [] };
  var widht = 620;
  var height = 420;
  var url = __webpath + "/workflow/selector/selectOrg";
  var title = "选择部门";
  FUI.dialog(url, title, parm, widht, height, function (objectData, index, layer) {
    var titles = [];
    var ids = [];
    $.each(objectData, function (i, item) {
      console.log("item:",item);
      titles.push(item.text);
      ids.push(item.value);
    });
    var resultBindFieldData = {};
    if (inputKey != "") {
      //绑定到多个目标字段
      var targetField = targetOrgCode;
      var fieldArr = targetField.split(",");
      var targetValue = ids.toString();
      $.each(fieldArr, function (_, fieldName) {
        if (vueDataObj.hasOwnProperty(fieldName)) {
          //字段付值
          vueDataObj[fieldName] = targetValue;
        }
        resultBindFieldData[fieldName] = targetValue;
        //扩展JS
        var extendFunName = fieldName.replace(/\./g, "_");
        var isExist = Object.toIsExitsFunction(extendFunName);
        if (isExist) {
          var exfunc = eval(extendFunName);
          exfunc(targetValue, fieldName, $vm);
        }
      });
    }
    if (inputName != "") {
      var targetField = targetOrgName;
      var fieldArr = targetField.split(",");
      var targetValue = titles.toString();
      $.each(fieldArr, function (_, fieldName) {
        if (vueDataObj.hasOwnProperty(fieldName)) {
          //字段付值
          vueDataObj[fieldName] = targetValue;
        }
        resultBindFieldData[fieldName] = targetValue;
        //扩展JS
        var extendFunName = fieldName.replace(/\./g, "_");
        var isExist = Object.toIsExitsFunction(extendFunName);
        if (isExist) {
          var exfunc = eval(extendFunName);
          exfunc(targetValue, fieldName, $vm);
        }
      });
    }
    //回调
    if ($vm["onSelectedSuccess"]) {
      var fn = $vm["onSelectedSuccess"];
      fn(resultBindFieldData);
    }
    layer.close(index);
    return false;
  }, true);
  return false;
};

//个人已授权的印章选择器（未发布印章授权的将选取不到）
//vueDataObj:回绑数据的对象，如果不传，默认为$vm.data
var selectPersonalSealSelector = function ($vm, conf, vueDataObj) {
  var vueDataObj = vueDataObj || $vm.data;
  //comfig指的是选择器配置中{"selectorName":"sealSelector",isMulti: isMulti,callBack:callBackFunction "data":[{"title":"印章名称","property":"SealTitle","field":"回填目标控件ID SealTitle"},{"title":"印章Id","property":"SealId","field":"SealId"}]}
  //返回的属性参数：OrgCode，OrgName
  var targetSealTitle = "";
  var targetSealId = "";
  var temData = conf.data || [];
  $.each(temData, function (index, item) {
    if (item.property == "sealTitle") {
      targetSealTitle = item.field;
    }
    if (item.property == "sealId") {
      targetSealId = item.field;
    }
  });
  var isMulti = false;
  if (conf.isMulti == "true" || conf.isMulti == true) {
    isMulti = true;
  } else {
    isMulti = false;
  }

  var singleSelect = !isMulti;
  var passParm = conf.passParm || {};
  var inputKey = targetSealId;
  var inputName = targetSealTitle;
  var parm = { singleSelect: singleSelect, data: [] };
  var widht = 750;
  var height = 440;
  var url = url = __webpath + "/workflow/selector/selectPersonalSeal";
  var title = conf.title || "选择印章";
  FUI.dialog(url, title, parm, widht, height, function (objectData, index) {
    var titles = [];
    var ids = [];
    $.each(objectData, function (i, item) {
      titles.push(item.SealTitle);
      ids.push(item.SealId);
    });
    if (inputKey != "") {
      $("input[name='" + inputKey + "']").val("");
      $("input[name='" + inputKey + "']").val(ids.toString());
    }

    if (inputName != "") {
      $("input[name='" + inputName + "']").val("");
      $("input[name='" + inputName + "']").val(titles.toString());
    }
    if (conf.callBack) {
      var callBackFunction = eval(conf.callBack);
      callBackFunction(objectData);
    }

    layer.close(index);

  }, true);
  return false;
};

//用户选择器
//selectorName：选择器名称
//isMulti:是否多选，默认是
//data:需要返回值属性，及返回后绑定到指定控件的配置
//initailData:初始化显示数据 格式：[{"属性名":值}]，如[{ "Account": "2222", "RealName": "55555" }]
//$vm：vue实例对象，
//vueDataObj:回绑数据的对象，如果不传，默认为$vm.data
var userSelector = function ($vm, conf, vueDataObj) {
  var vueDataObj = vueDataObj || $vm.data;
  //comfig指的是选择器配置中{"selectorName":"userSelector",isMulti: isMulti,callBack:,"data":[{"title":"组织名称","property":"OrgName","field":"CarApplyfor.CarSector"}]}
  //title：标题，property:对话框返回值的属性，field：返回值绑定到的name目标字段
  //返回参数：UserId，Account,RealName,Mobile,Email, OrgName,OrgCode,Sex
  var isMulti = conf.isMulti;
  if (isMulti == "true" || isMulti == true) {
    isMulti = true;
  } else {
    isMulti = false;
  }
  var callBack = conf.callBack || null;
  var isTest = conf.isTest || false;//是否测试预览
  var isSelectOnlyUsers = conf.isOnlyUser || 0;
  var singleSelect = !isMulti;

  var initailData = conf.initailData || [];//初始化显示数据
  var fieldData = conf.data;//返回绑定目标字段
  var passParm = conf.passParm || {};
  var parm = { singleSelect: singleSelect, data: initailData };
  //高级参数 
  conf.varParams = conf.varParams || "";
  if (conf.varParams) {
    //varParams结构[{key:"",value:""}]
    parm.varParams = conf.varParams;
  }
  console.info(parm);
  var widht = 860;
  var height = 520;
  var url = __webpath + "/workflow/selector/selectUsers/";
  if (isSelectOnlyUsers == 1) {
    url = __webpath + "/workflow/selector/selectOnlyUsers/";
  }
  var title = "选择用户";
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

//在线表单字段选择器
//selectorName：选择器名称
//isMulti:是否多选，默认true
//widht:宽默认570
//height:高，默认420
//data:需要返回值属性，及返回后绑定到指定控件的配置
//initailData:初始化显示数据 格式：[{"属性名":值}]，如[{ "property": "2222", "title": "55555" }]
//示例：conf参数 {"selectorName":"smartFormFieldSelector",widht:570,height:420, formDefId：formDefId,isMulti: isMulti,"data":[{"title":"字段名","property":"text","field":"返回值绑定"},{"title":"字段名","property":"value","field":"返回值绑定"}]}
var smartFormFieldSelector = function (conf) {
  var isMulti = conf.isMulti || true;
  if (isMulti == "true" || isMulti == true) {
    isMulti = true;
  } else {
    isMulti = false;
  }
  var singleSelect = !isMulti;
  var formDefId = conf.formDefId;
  var initailData = conf.initailData || [];//初始化显示数据 
  var passParm = conf.passParm || {};
  var parm = { singleSelect: singleSelect, data: initailData };
  var widht = conf.widht || 530;
  var height = conf.height || 420;

  var url = __webpath + "/workflow/selector/selectFormField/?formDefId=" + formDefId + "&wid=" + conf.wid;
  if (!formDefId || formDefId == "" || formDefId == "null") {
    url = __webpath + "/workflow/selector/selectFormField/?&wid=" + conf.wid;
  }
  var title = "选择表单字段";

  FUI.dialog(url, title, parm, widht, height, function (objectData, index, layer) {
    //objectData格式:[{value:,text}]
    $.each(conf.data, function (index, confItem) {
      if (confItem.property == "") return true;
      var targetField = confItem.field;
      var arr = targetField.split('.');
      var arrN = arr.length;
      if (arrN >= 3) {
        targetField = arr[arrN - 2] + "." + arr[arrN - 1];
      }
      ;
      var targetInput = $("input[name$='" + targetField + "']");
      targetInput.val("");
    });

    $.each(objectData, function (i, item) {
      $.each(conf.data, function (index, confItem) {
        if (confItem.property == "") return true;
        if (item[confItem.property]) {
          var targetField = confItem.field;
          var arr = targetField.split('.');
          var arrN = arr.length;
          if (arrN >= 3) {
            targetField = arr[arrN - 2] + "." + arr[arrN - 1];
          }
          ;
          var targetInput = $("input[name$='" + targetField + "']");
          var targetValue = targetInput.val();
          if (targetValue != "" && singleSelect != true) {
            targetInput.val(targetValue + "," + item[confItem.property]);
          } else {
            targetInput.val(item[confItem.property]);
          }
        }
      });
    });
    layer.close(index);
    return false;
  }, true);
  return false;
};


/*
 * 地图位置选择器
 */
var mapPositionSelector = function (conf) {
  //comfig指的是选择器配置中{"selectorName":"mapPositionSelector",isMulti: isMulti,"data":[{"title":"","property":"address","field":""}]}
  //返回的属性参数：addr，lon经度,lat纬度
  var isMulti = conf.isMulti || true;
  if (isMulti == "true" || isMulti == true) {
    isMulti = true;
  } else {
    isMulti = false;
  }
  var singleSelect = !isMulti;
  var initailData = conf.initailData || [];//初始化数据 
  var passParm = conf.passParm || {};
  var parm = { singleSelect: singleSelect, data: initailData };
  var widht = 800;
  var height = 530;
  var url = __webpath + "/workflow/selector/selectMapAddress";
  var title = "选择地图位置";
  FUI.dialog(url, title, parm, widht, height, function (objectData, index, layer) {
    $.each(conf.data, function (index, confItem) {
      if (confItem.property == "") return true;
      var targetInput = $("input[name='" + confItem.field + "']");
      if (conf.selectId != undefined && conf.backBindIsdetail != undefined && conf.backBindIsdetail == true) {
        targetInput = $("input[name='" + confItem.field + "']", $("#" + conf.selectId).parent().parent());
      }
      targetInput.val("");
    });
    $.each(objectData, function (i, item) {
      $.each(conf.data, function (index, confItem) {
        if (confItem.property == "") return true;
        var targetField = confItem.field;
        var arr = targetField.split('.');
        var arrN = arr.length;
        if (arrN >= 3) {
          targetField = arr[arrN - 2] + "." + arr[arrN - 1];
        }
        ;
        if (item[confItem.property]) {
          var targetInput = $("input[name$='" + targetField + "']");
          if (conf.selectId != undefined && conf.backBindIsdetail != undefined && conf.backBindIsdetail == true) {
            targetInput = $("input[name$='" + targetField + "']", $("#" + conf.selectId).parent().parent());
          }
          var targetValue = targetInput.val();
          if (targetValue != "" && singleSelect != true) {
            targetInput.val(targetValue + "," + item[confItem.property]);
          } else {
            targetInput.val(item[confItem.property]);
          }
        }
      });
    });
    layer.close(index);
    return false;
  }, true);
  return false;
};