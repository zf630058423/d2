//自定义对话框
//customDialog:自定义选择对话框名称
//isMulti:是否多选，默认是
//data：需要返回哪些字段并绑定以哪些控件上的配置
//initailData:初始化显示数据 格式[{"属性名":值}]
//$vm：vue实例对象，
//vueDataObj:回绑数据的对象，如果不传，默认为$vm.data
var CustomDialog = function ($vm, conf, vueDataObj) {
  var vueDataObj = vueDataObj || $vm.data;
  //selectId 选择按钮的ID
  //backbindIsdetail,返回绑定是否是在线表单的明细行中，可为空，非明细列表时则为当前整个页面中找绑定返回字段
  //conf指的是选择器配置中{selectId:"",backBindIsdetail:true false,"customDialog":"XX",isMulti:true, callBack,"data":[{"title":"组织名称","property":"OrgName","field":"CarApplyfor.CarSector",isKey:0}]}
  var customDialog = conf.customDialog;
  var urlParamsOption = conf.urlParamsOption || [];
  var callBack = conf.callBack || null;
  var fieldData = conf.data;//返回绑定目标字段
  var isTest = conf.isTest || false;//是否测试预览
  var isSubTableAdd = conf.isSubTableAdd || false;//是否为子列表开窗选择添加
  var passParm = conf.passParm || {};
  //自定义变量参数：过滤条件
  conf.varParams = conf.varParams || "";
  var isMulti = true;
  if (conf.isMulti == false) {
    isMulti = false;
  }
  var initailData = conf.initailData || [];//初始化显示数据 格式：[{"属性名":值}]
  var parm = { customDialog: customDialog, isMulti: isMulti, initailData: initailData };
  if (conf.varParams) {
    //varParams结构[{key:"",value:""}]
    parm.varParams = conf.varParams;
  }
  var width = conf.width;
  var height = conf.height;

  var url = "/workflow/customDialog/openCustomDialog/?code=" + customDialog;
  if (isTest == true) {
    url = "/workflow/customDialog/openCustomDialog/?isSetHead=1&code=" + customDialog;
  }
  var urlParmString = "";
  if (urlParamsOption && urlParamsOption.length > 0) {
    $.each(urlParamsOption, function (index, item) {
      var key = item.fieldName;
      var domName = item.comparValue;
      var operator = item.operator;
      var value = "";
      if (operator == 'default' || operator == '') {
        //默认使用结尾field名控件[field$='']来查找Dom元素
        value = $("[field$='" + domName + "']").val();
      }
      urlParmString = "&" + key + "=" + value;
    });
    if (urlParmString != "") {
      url = url + urlParmString;
    }
  }

  var title = isSubTableAdd ? "选择添加" : "选择";
  FUI.dialog(url, title, parm, width, height, function (objectData, index, layerObject) {
    if (isTest == true) {
      alert(JSON.stringify(objectData));
    } else if (callBack) {
      callBack.call(this, objectData, index, layerObject);
    }
    else {
      //字段值结果
      var resultBindFieldData = {};
      if (isSubTableAdd === false) {
        //常规
        $.each(fieldData, function (index, confItem) {
          //多个字段
          var fieldArr = confItem.field.split(",");
          var propertyName = confItem.property;
          $.each(fieldArr, function (_, fieldName) {
            var targetValue = [];
            //对选中的行钻取字段值，多个值之间使用英文逗号隔开
            $.each(objectData, function (i, item) {
              var selectedValue = item[propertyName];
              targetValue.push(selectedValue);
            });
            var v = targetValue.toString();
            if (fieldName) {
              //字段付值
              vueDataObj[fieldName] = v;
              resultBindFieldData[fieldName] = v;
            }
          });
        });
      } else {
        //子表开窗选择添加行,可一次选择添加多行
        var rowDatas = [];
        var mainTableName = "";
        var subTableName = "";
        var nameList = [];
        $.each(objectData, function (i, item) {
          var oneRow = [];
          $.each(fieldData, function (index, confItem) {
            //多个字段
            var fieldArr = confItem.field.split(",");
            var propertyName = confItem.property;
            $.each(fieldArr, function (_, fieldName) {
              if (fieldName) {
                //对选中的行钻取字段值，多个值之间使用英文逗号隔开
                var arr = fieldName.split(".");
                mainTableName = arr[0];
                subTableName = arr[1];
                var theName = arr[2];
                var v = item[propertyName];
                v = v === null?'':v === 'null'?'':v;
                oneRow.push({ "name": theName, "value": v });
                nameList.push(theName);
              }
            });
          });
          nameList.push("MyId");
          oneRow.push({ "name": "MyId", "value": "" });
          if ($vm) {
            var row = $getEmptyRow($vm);
            $.each(row, function (key, value) {
              var index = key.lastIndexOf('.');
              var thekey = index > 0 ? key.substr(index + 1) : key;
              if ($.inArray(thekey, nameList) == -1) {
                // 过滤null
                value = value === null?'':value === 'null'?'':value;
                oneRow.push({ "name": thekey, "value": value });
              }
            });
          }
          rowDatas.push(oneRow);
        });
        if (rowDatas && rowDatas.length > 0) {
          $.each(rowDatas, function (_, row) {
            FUI.F2Grid.addRowData(subTableName, mainTableName, row);
          });
        }
      }
      //回调控件
      var fn = $vm["onSelectedSuccess"] || "";
      if (fn) {
        fn(resultBindFieldData);
      }
    }
    layerObject.close(index);
    return false;
  }, true);
  return false;
};
