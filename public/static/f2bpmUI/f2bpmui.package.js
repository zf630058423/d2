//********************** 相关操作的封装**************************/
//系统类服务
FUI.Sys = {
  //获取数据服务数据
  getServiceData: fui_dataServiceGetJson,
  getAuthor: fui_getAuthor,
  getSysConfig: fui_getSysConfig,
  getRouterParm: fui_getRouterQuery,
  requestWorkflowAPI: fui_requestWorkflowAPI
};
//特殊字符
FUI.Characters = {
  //空的复选框
  checkBox: "&#9744;",
  //打勾的复选框
  checkedBox: "&#9745;",
  //打勾符
  tick: "&#10003;",
  //加粗的打勾符
  tickbold: "&#10004;",
  //带x的复选框
  tickbold: "&#9746;",
  //选票x
  tickbold: "&#10007;",
  //重型选票x
  tickbold: "&#10008;",
  //小圆圈
  circle: "&#959;",
  //小圆圈加一划
  empty: "&#8709;",
  //小圆圈里面加个X
  otimes: "&otimes;",
  //小圆圈里面加个+
  oplus: "&oplus;",
  //小圆圈里面加个一竖Φ
  Phi: "&Phi;",
  //商标注册符
  reg: "&#174;",
  //版权符合
  copyright: "&#169;"

};
//系统窗口类
FUI.Window = {
  showMsg: fui_showMsg,
  showMsg2: fui_showMsg2,
  showModalMsg: fui_showModalMsg,
  confirm: fui_confirm,
  closeEdit: fui_closeEdit,
  closeEditAll: fui_closeEditAll,
  openDialog: fui_openDialog,
  openEdit: fui_openEdit,
  open: fui_windowOpen,
  close: fui_windowClose,
  openTopTab: _openUrlOnParentTab,
  closeBlankWindow: fui_closeBlankWindow,
  refreshParentGrid: fui_refreshParentGrid,
  refreshParentTree: fui_refreshParentTree
};
FUI.Grid = {
  getGridChecked: fui_grid_getGridChecked,
  getSelectedRows: fui_grid_getSelectedRows,
  reload: fui_grid_reload
};
FUI.Form = {
  submitForm: fui_submitForm,
  ajaxSubmit: f2ui_ajaxSubmit,
  bindDataToForm: fui_bindDataToForm,
  loadFormSpantext: loadFormSpantext,
  initailSqlKeyComboBox: _InitailSqlKeyComboBox,
  initailConfigTypeComboBox: _InitailConfigTypeComboBox,
  setReadOnly: fui_setReadOnly,
  setUnReadOnly: fui_setUnReadOnly,
  richeditorArrValueToInput: fui_richeditorArrValueToInput
};
//窗口动作
FUI.FormAction = {
  Add: 'Add',
  Edit: 'Edit',
  View: 'View',
  Unknown: 'Unknown'
};

FUI.Method = {
  //根据SQL获取Json数据，返回数据格式[{Value:"",Text:""}]，参数sql:XXX
  GetTextValueDataJsonBySql: 'getTextValueDataJsonBySql',
  //根据SqlKey获取Json数据，返回数据格式[{Value:"",Text:""}]，参数sql:XXX
  GetTextValueDataJsonBySqlKey: 'getTextValueDataJsonBySqlKey',
  //根据SqlKey获取Json数据
  GetDataJsonBySqlKey: 'getDataJsonBySqlKey',

  AutoSaveMethod: 'saveViewTableModel',
  AutoGetViewModelMethod: 'getViewTableModel'
};

FUI.Handlers = {
  FuiFrameworkHandler: '/workflow/fuiFramework/',
  CustomDialogHandler: '/workflow/customDialog/',
  CustomDataGridHandler: '/workflow/security/customDataGrid/',
  OrgImplController: '/workflow/security/orgImpl/',
  CategoryHandler: '/workflow/security/category/getCategoryTreeJson/',
  DataService: '/workflow/security/dataService/',
  Common: '/workflow/security/baseCommon/',
  OfficeHandler: '/office/',

  WorkflowManageHandler: '/workflow/workflowManage/',
  FormPermission: '/workflow/formPermission/',
  ProcessDef: '/workflow/processDef/',
  ProcessFormHandler: '/workflow/processForm/',
  Selector: '/workflow/selector/',
  SendActor: '/workflow/sendActor/',
  WorkflowBusinessHandler: '/workflow/workflowBusiness/',
  WorkflowMonitorHandler: '/workflow/workflowMonitor/',
  SmartTableHandler: '/smartForm/',
  SystemHandler: '/workflow/security/systemss/',
  AdminHandler: '/admin/',
  LoginHandler: '/login/',
  PublicAuthorHandler: '/workflow/security/publicAuthor/',
  SealController: '/workflow/security/seal/',
  //自定义表单
  SmartFormHandler: '/workflow/smartForm/',
  DocumentController: '/workflow/document/',
  Report: '/workflow/security/report/',
  // 材料供应商外部注册链接
  supplierOutsideLink: '/supplierOutsideLink/'
};

//===========================通用数据源===================//
FUI.Data = {
  //流程变量类型
  varTypeDic: [{ text: "表单变量", value: "formvar" }, { text: "流程变量", value: "flowvar" }],
  //基础数据类型 double:只有mysql是特殊，mssql的float精度是53位，Oracel的number的精度38位，mysql的number修改对应为double，以便提高精确度。
  baseDataTypeDic: [{ text: "字符串", value: "string" }, { text: "整型（整数）", value: "int" }, { text: "数值（带小数）", value: "number" }, { text: "大数值(double)", value: "double" }, { text: "大数值(decimal)", value: "decimal" }, { "text": "大文本(text)", "value": "text" }, { text: "布尔型", value: "bool" }, { text: "日期", value: "date" }, { text: "日期时间", value: "datetime" }, { "text": "longtext(Msql专有)", "value": "longtext" }, { "text": "GUID(Mssql专有)", "value": "uniqueidentifier" },],
  //校验类型
  verifyType: [
    { text: "字符串", value: "" }, { text: "邮箱", value: "email" }, { text: "数字", value: "floatNumber" },
    { text: "整数", value: "int" }, { text: "正整数", value: "zint" }, { text: "负整数", value: "fint" },
    { text: "大于0的数字", value: "biggerZero" }, { text: "大于或等于0的数字", value: "biggerOrEqualZero" }, { text: "小于或等于0的数字", value: "litterOrEqualZero" },
    { text: "身份证号码", value: "idcard" }, { text: "QQ号码", value: "QQ" }, { text: "邮政编码", value: "ZIP" }, { text: "汉字", value: "CHS" },
    { text: "大写字母", value: "onlyBigEnglisthChar" }, { text: "数字或英文", value: "englisthOrNumberChar" }, { text: "chars", value: "数字英文下划线" },
    { text: "手机号码", value: "mobile" }, { text: "正则表达式", value: "regular" }
  ],
  DataTypeEditor: { type: "combobox", options: { valueField: 'value', textField: 'text', data: [{ "text": "字符串[nvarchar]", "value": "nvarchar" }, { "text": "大文本[text]", "value": "text" }, { "text": "整型[int]", "value": "int" }, { "text": "浮点型[float]", "value": "float" }, { "text": "GUID", "value": "uniqueidentifier" }, { "text": "布尔[bit]", "value": "bit" }, { "text": "时间[datetime]", "value": "datetime" }, { "text": "日期[date]", "value": "date" }, { "text": "大数值(decimal)", "value": "decimal" }] } },
  SearchParamaterEditor: { type: "combobox", options: { valueField: 'value', textField: 'text', data: [{ "text": "like", "value": "like" }, { "text": "=", "value": "equal" }, { "text": ">=", "value": "bigEqual" }, { "text": "<=", "value": "smallEqual" }, { "text": "bowteen", "value": "bowteen" }, { "text": "In", "value": "In" }] } },
  AlignEditor: { type: "combobox", options: { valueField: 'value', textField: 'text', data: [{ "text": "left", "value": "left" }, { "text": "center", "value": "center" }, { "text": "right", "value": "right" }] } },
  ConfigTypeData: __getConfigTypeData,
  SqlKeyData: [],
  getConfigTypeData: __getConfigTypeData,
  getDicDataByConfigType: __getDicDataByConfigType
};

function __getConfigTypeData(isRefreshCache) {
  if (isRefreshCache == undefined || isRefreshCache == null) {
    isRefreshCache = false;
  }
  var $ConfigTypeData = [];
  //ConfigType数据源格式[{ConfigType:"aaa",Data:[{text:"",value:"",Flag:"",ConfigKey:"",ParentConfigKey:"",OrderNo:""}]}]
  var method = 'configTypeListData';
  var f2bpmConfigTypeListData = localStorage.getItem('f2bpmConfigTypeListData');
  if (isRefreshCache == false && f2bpmConfigTypeListData) {
    $ConfigTypeData = eval("(" + f2bpmConfigTypeListData + ")");
  } else {
    var url = '/workflow/fuiFramework/',
      $ConfigTypeData = Object.toAjaxJson(url, method, { isRefreshCache: isRefreshCache });
    if ($ConfigTypeData) {
      localStorage.setItem('f2bpmConfigTypeListData', JSON.stringify($ConfigTypeData));
    }

  }
  FUI.Data.ConfigTypeData = $ConfigTypeData;
  return FUI.Data.ConfigTypeData;
}

function __getDicDataByConfigType(configType) {
  var data = __getConfigTypeData();
  var result = data.find(a => a.configType == configType);
  return result;

}
// +function ($) {
//     if(window.location.href.indexOf("/login/")==-1){
//         //初始化FUI.Data数据
//         __getConfigTypeData();
//     }
// }(window.jQuery);

//===========================工具类===================//
FUI.Tool = {
  createrComboboxEditor: _CreaterComboboxEditor,
  //获取树节点下所有无限层级子节点的ID
  getTreeNodeAndAllSubChild: _getTreeNodeAndAllSubChild
};
//创建下框列表编辑器对象 arrData传入数据格式，必传,如：[{ "text": "整型[int]", "value": "int" }, { "text": "浮点型[float]", "value": "float" }]
//默认:valueField：Value，textField：Text
function _CreaterComboboxEditor(arrData, valueField, textField) {
  valueField = valueField || 'value';
  textField = textField || 'text';
  var editor = { type: "combobox", options: { valueField: valueField, textField: textField, data: arrData } };
  return editor;
}

var baseDataTypeEditor = { type: "combobox", options: { valueField: 'value', textField: 'text', data: FUI.Data.baseDataTypeDic } };
var dataTypeEditor = FUI.Data.DataTypeEditor;
var searchParamaterEditor = FUI.Data.SearchParamaterEditor;
var alignEditor = FUI.Data.AlignEditor;
var varTypeEditor = FUI.Tool.createrComboboxEditor(FUI.Data.varTypeDic);
var baseDataTypeEditor = FUI.Tool.createrComboboxEditor(FUI.Data.baseDataTypeDic);
var dataVerifyEditor = FUI.Tool.createrComboboxEditor(FUI.Data.verifyType);

//=====================Grid 通用属性 ===================//
FUI.DataGridProperty = {
  tablePage: {
    pageCount: 0,
    //切换排序字段
    sort: '',
    //切换排序方向
    order: '',
    total: 0,
    currentPage: 1,
    pageSize: 20,
    align: 'center',
    pageSizes: [10, 15, 20, 25, 50, 100, 200, 500],
    layout: "total, sizes, prev, pager, next, jumper"
  },
  tableForm: {
    titleWidth: 100,
    titleAlign: 'right',
    props: { searchPlaceholder: "" },
    data: {},
    items: []
  },
  tableToolbar: {
    id: '',
    buttons: [
      // {code: 'cleanWfInstanceData', status: 'primary', name: '清除流程实例数据', icon: 'fa fa-trash'}
    ]
  },
  headerMenus: [{ code: 'configHead', name: '配置表头', prefixIcon: 'fa fa-cog', }]
};

/**********************系统基础相关开始**************************/
function fui_toPinYin(sourceId, targetId) {
  if ($('#' + targetId).val() == '') {
    $('#' + targetId).val($('#' + sourceId).toPinyin());
  }
}

function fui_toPinYinFirst(sourceId, targetId) {
  if ($('#' + targetId).val() == '') {
    $('#' + targetId).val($('#' + sourceId).toPinyinFirst());
  }
}

function fui_cleanInput(targetId) {
  if (targetId.indexOf(',') > -1) {
    var arr = targetId.split(',');
    $.each(arr, function (i, item) {
      $('#' + item).val('');
    });
  } else {
    $('#' + targetId).val('');
  }
}
function fui_cleanInput(that, targetId) {
  if (targetId.indexOf(',') > -1) {
    var arr = targetId.split(',');
    $.each(arr, function (i, item) {
      that.data[item] = "";
    });
  } else {
    that.data[targetId] = "";
  }
}
function fui_dataServiceGetJson(code, parm) {
  parm = parm || {};
  parm['code'] = code;
  var url = FUI.Handlers.DataService;
  var data = Object.toAjaxJson(url, 'getDataServiceJson', parm);
  return data;
}
//todo 后续要改，localStorage存储不会清空
function fui_getAuthor() {
  var author = localStorage.getItem('f2bpmAuthor');
  if (author) {
    var json = eval('(' + author + ')');
    return json;
  }
  return null;
}

//获取Vue路由参数
function fui_getRouterQuery($vm, key) {
  var obj = $vm.$route.query;
  return obj[key];
}

//获取系统基础信息
function fui_getSysConfig() {
  var config = localStorage.getItem('f2bpmSysConfig');
  if (config) {
    var json = eval('(' + config + ')');
    return json;
  }
  return null;
}

//isFilterXSS:是否过滤掉XSS
function fui_richeditorArrValueToInput($vm, vueDataName, isFilterXSS) {
  $vm = $vm || myvm;
  if (isFilterXSS == null || isFilterXSS == undefined) {
    isFilterXSS = true;
  }
  if (undefined != richeditorArr && richeditorArr != null && richeditorArr.length > 0) {
    for (var i = 0; i < richeditorArr.length; i++) {
      var name = richeditorArr[i].name;
      var html = richeditorArr[i].editor.getContent();
      var result = isFilterXSS ? filterXSS(html) : html;
      if (vueDataName) {
        $vm[vueDataName][name] = result;
      } else {
        $vm.data[name] = result;
      }
    }
  }
}
//============================系统基础相关结束=============================
/**********************window 相关操作的封装开始**************************/
//自己的对话消息框
//title标题：默认温馨提示
//msg:消息内容
//icon:图标
//callback:点击确认后触发函数
//option:其它配置参数：tip:'',width,height,showCancel:false,label:'内容的标题',sureText:'确定按钮的文字'，isShowSure:是否显示确定按钮
function fui_showModalMsg(vm, msg, title, icon, option, callback) {
  option = option || {};
  var sureTxt_lang = vm != null ? vm.$t('sure') : '确定';
  var closeText_lang = vm != null ? vm.$t('close') : "关闭";
  icon = icon || 'fa fa-info';
  var sureText = option.sureText || sureTxt_lang;
  var closeText = option.closeText || closeText_lang;
  var title = title || '温馨提示';
  var isShowSure = true;
  if (option.isShowSure && option.isShowSure == false) {
    isShowSure = false;
  }

  let config = {
    label: '',
    icon: icon,
    description: msg,
    //是否带填写输入框
    isInput: option.isInput,
    //输入框的提示
    inputTip: option.tip,
    //输入框的内容
    inputContent: option.inputContent
  };
  config.label = option.label || '';
  var width = option.width || 300;
  var height = option.height || 150;
  FUI.dialog(__webpath + "/workflow/dialog/showModalMsg", title, config, width, height, function (content, index, layerObject) {
    if (callback) {
      callback(content, index, layerObject);
    } else {
      layerObject.close(index);
    }
    return false;
  }, true, { btnAlign: 'c', isShowSure: isShowSure, zIndex: 998 }, { sure: { iconClass: "", text: sureText }, close: { iconClass: "", text: closeText } });
}

//弹对话消息框
//title标题：默认温馨提示
//msg:消息内容
//icon:OK1,info,error,warning,3:question问号,!
//fn:点击确认后触发函数
function fui_showMsg(vm, msg, title, icon, fn) {
  if (vm == undefined || vm == null) {
    fui_layerShowMsg(msg, title, icon, fn);
    return false;
  }
  if (typeof vm == 'string') {
    fui_layerShowMsg(vm, msg, title, icon);
    return false;
  }
  var tip_lang = vm != null ? vm.$t('tip') : '温馨提示';
  title = title || tip_lang;
  var sureTxt = vm != null ? vm.$t('sure') : '确定';
  var config = { dangerouslyUseHTMLString: true, confirmButtonText: sureTxt, iconClass: 'el-icon-info blue' };
  if (fn) {
    config.callback = fn;
  }
  if (icon == 'success' || icon == 1) {
    config.iconClass = "el-icon-success gree";
  } else if (icon == 'info' || icon == 2) {
    config.iconClass = "el-icon-info blue";
  } else if (icon == 'warning' || icon == 3) {
    config.iconClass = "el-icon-warning orange";
  } else if (icon == 'error' || icon == 4) {
    config.iconClass = "el-icon-warning red";
  } else if (icon == 'alert' || icon == 5) {
    config.iconClass = "el-icon-info blue";
  } else if (icon == 'question') {
    config.iconClass = "el-icon-question blue";
  }
  vm.$alert(msg, title, config).catch(); //这个.catch()删除掉就会打印Uncaught (in promise) cancel;
}

function fui_layerShowMsg(msg, title, icon, fn) {
  if (icon && icon == "info") icon = 1;
  layer.alert(msg, { "icon": icon || 7 }, function (index) {
    if (fn && typeof (fn) == "function") {
      fn();
      layer.close(index);
    } else {
      layer.close(index);
    }
  });
}

function fui_showMsg2(vm, msg, title, icon, callback) {

  title = title || "温馨提示";
  if (vm == undefined || vm == null) {
    fui_layerShowMsg2(msg, title, icon, callback);
    return false;
  }
  if (typeof vm == 'string') {
    fui_layerShowMsg2(vm, msg, title, icon);
    return false;
  }
  var config = { message: msg };
  if (callback) {
    config.onClose = callback;
  }
  if (icon == undefined) {
    vm.$message(config);
  } else if (icon == 'success' || icon == 1 || icon == 'info' || icon == 2) {
    config.type = "success";
    config.duration = 2000;
    vm.$message(config);
  } else if (icon == 'warning' || icon == 3) {
    config.type = "warning";
    vm.$message.warning(config);
  } else if (icon == 'error' || icon == 4) {
    vm.$message.error(config);
  } else {
    vm.$message(config);
  }
}

function fui_layerShowMsg2(msg, title, icon, fn) {
  if (icon && icon == "info") icon = 1;
  layer.msg(msg, { "icon": icon || 7, time: 3000 }, function (index) {
    if (fn && typeof (fn) == "function") {
      fn();
      layer.close(index);
    } else {
      layer.close(index);
    }

  });
}

function fui_confirm(vm, msg, title, asyncFun, opts) {
  if (vm == undefined || vm == null) {
    fui_layerConfirm(msg, title, asyncFun, opts);
    return false;
  }
  if (typeof vm == 'string') {
    fui_layerConfirm(vm, msg, title, asyncFun);
    return false;
  }
  var tip_lang = vm != null ? vm.$t('tip') : '温馨提示';
  var sureTxt_lang = vm != null ? vm.$t('sure') : '确定';
  var closeText_lang = vm != null ? vm.$t('close') : "关闭";
  title = title || tip_lang;
  var config = { dangerouslyUseHTMLString: true, type: "warning", cancelButtonText: closeText_lang, confirmButtonText: sureTxt_lang };
  if (opts) {
    config = Object.extend(config, opts);
  }
  vm.$confirm(msg, title, config).then(function () {
    if (asyncFun) {
      asyncFun(true);
    }
  }).catch(function () {

  });
  return false;
}

//确认对话框 msg：消息；title标题； asyncFun回调函数（非必填）
function fui_layerConfirm(msg, title, asyncFun) {
  layer.confirm(msg, { icon: 3, "title": title || "温馨提示" }, function (index) {
    if (typeof (asyncFun) == "function") {
      asyncFun.call(this, index);
      layer.close(index);
    } else {
      layer.close(index);
    }
  });
  return true;
}

//关闭窗口
//$vm:vue对象（主要用于刷新父页面列表，可不传）
//isRefreshParentGrid:是否刷新父页面的Grid 默认否，Grid的ID，默认为空
//parentGridId:父窗列表ID
//getResultFunction：获取返回值的函数,返回值为Json格式
function fui_closeEdit(isRefreshParentGrid, parentGridId, getResultFunction) {
  isRefreshParentGrid = isRefreshParentGrid || false;
  if (getResultFunction) {
    //        var result = getResultFunction.call();
    //        var callback = window.parent.$("#EditWindow").window("options").callback;
    //        callback(result);
  }
  if (isRefreshParentGrid == true && parentGridId == undefined) {
    parentGridId = "grid";
  }
  if (isRefreshParentGrid == true && parentGridId) {
    fui_refreshParentGrid(null, parentGridId);
    fui_refreshParentTree();
  }
  var theOpenerWin = null;
  var theOpenerParent = null;
  if (window.openerLayerWin) {
    //打开layer窗口的所在层
    theOpenerParent = window.openerLayerWin;
  } else {
    theOpenerWin = window.openerWin || window;
    theOpenerParent = theOpenerWin.parent;
  }
  try {
    var ly = theOpenerParent.layer;
    var index = ly.getFrameIndex(window.name); //先得到当前iframe层的索引
    if (index == undefined) {
      return false;
    }
    theOpenerParent.layer.close(index); //再执行关闭
    return true;
  } catch (err) {
    window.location.href = "/";
    return true;
  }
}



function fui_closeEditAll(type) {
  //layer.closeAll(); //疯狂模式，关闭所有层
  //layer.closeAll('dialog'); //关闭信息框
  //layer.closeAll('page'); //关闭所有页面层
  //layer.closeAll('iframe'); //关闭所有的iframe层
  //layer.closeAll('loading'); //关闭加载层
  //layer.closeAll('tips'); //关闭所有的tips层
  var theOpenerWin = null;
  var theOpenerParent = null;
  if (window.openerLayerWin) {
    //打开layer窗口的所在层
    theOpenerParent = window.openerLayerWin;
  } else {
    theOpenerWin = window.openerWin || window;
    theOpenerParent = theOpenerWin.parent;
  }
  var ly = theOpenerParent.layer;
  if (type) {
    ly.closeAll(type);
  } else {
    ly.closeAll();
  }
}

function refreshTargetTree($vm) {
  try {
    if ($vm && $vm.refreshTree) {
      $vm.refreshTree();
    } else {
      if (window.myvm && window.myvm.refreshTree) {
        window.myvm.refreshTree();
      }
    }
  } catch (e) {
    console.info(e);
  }

}

function fui_refreshParentTree($vm) {
  var theParentWin = window.openerWin || window.parent;
  if ($vm) {
    if (theParentWin.myvm && theParentWin.myvm.refreshTree) {
      theParentWin.myvm.refreshTree($vm);
    }
  } else {
    if (theParentWin.myvm && theParentWin.myvm.refreshTree) {
      theParentWin.myvm.refreshTree();
    }

  }

}

//$vm指定父页面所在的 vm对象
//刷新父页面列表
function fui_refreshParentGrid($targetVm, parentGridId) {
  //这个动作是从子窗口中点击进来的，需要找到是谁（哪个窗口）打开的它
  //由哪个窗口调用FUI.Widow.openEdit所在页面的window对象（即从哪个页面点击打开的窗口），正常openerWin都会有值，因为打开时已经把打开者所在窗口告诉iframe子窗口了
  //这个函数中的window即是iframe中的窗口，此处的window代表我是子窗口
  var theParentWin = window.openerWin || window.parent;
  if ($targetVm) {
    theParentWin.refreshTargetGrid(parentGridId, $targetVm);
  } else {
    theParentWin.refreshTargetGrid(parentGridId);
  }

}

//去除父页面指定ID的Grid的头部全选
function fui_removeParentGridHeadCheckbox(gridId) {
  gridId = gridId || "grid";
  window.parent.removeGridHeadCheckbox(gridId);
}

//调用parent.location.reload()
function fui_refreshParent() {
  parent.location.reload();
}

//刷新指定的Vue对象,默认myvm
function refreshTargetGrid(parentGridId, $targetVm, parm) {
  parentGridId = parentGridId || "grid";
  var $vm = $targetVm || window.myvm;
  try {
    if ($vm) {
      $vm.refreshGrid(parentGridId, parm);
    }
  } catch (e) {
    console.info(e);
  }
}

/**********************Grid相关操作的封装开始**************************/
//收集Grid复选框选中的行
//Gird 指定的grid,默认grid
//fieldName要收集的字段名，默认Id
//replaceCall:选中值传的过虑转换函数
function fui_grid_getGridChecked(vm, grid, fieldName, replaceCall) {
  var gridId = grid || "grid";
  fieldName = fieldName || "Id";
  var data = vm.$refs[grid].getCheckboxRecords();
  var ids = new Array();
  if (data.length == 0) {
    return "";
  }
  for (var i = 0; i < data.length; i++) {
    var id = data[i][fieldName];
    if (replaceCall) {
      id = replaceCall(id);
    }
    ids.push(id);
  }
  var result = ids.toString();

  return result;
}

function fui_grid_getSelectedRows(vm, grid) {
  grid = grid || "grid";
  var data = vm.$refs[grid].getCheckboxRecords();
  return data;
}

function fui_grid_reload(vm) {
  vm.dataGridSearch('reload');
};

/**********************Grid相关操作的封装结束**************************/
/**********************Form 表单相关操作的封装开始**************************/
//表单提交
//formAction Add，Edit操作类型
//keyId 主键ID值，非必填时可传null
//提交按钮的Jq对象，methodName自定义方法名
//targetFormId目标From 不为null时提交指定的form，
//clearEmptyValue移除（不提交）空值, callBack回调函数
//dataJsonParm:{aa:bb}或[{name:"a",value:"bbbb"},{}]参数
function fui_submitForm(vm, formData, url, method, formAction, keyId, parentGridId, mainTable, dataJsonParm, targetFormId, clearEmptyValue, callBack) {
  var theData = [];

  try {
    if (dataJsonParm) {
      if (typeof (dataJsonParm) == 'object') {
        for (var properyName in dataJsonParm) {
          theData.push({ name: properyName, value: dataJsonParm[properyName] });
        }
      } else if (!Object.toIsArray(dataJsonParm)) {
        //Json参数形式
        theData = dataJsonParm;

      } else {
        //数组参数形式
        theData = dataJsonParm;
      }
    }
    var item = { name: "formAction", value: formAction };
    var itemkeyId = { name: "keyId", value: keyId };
    var itemMainTable = { name: "mainTable", value: mainTable };
    var $targetForm;

    formData = formData || [];
    if (!Object.toIsArray(formData)) {
      //转为数组方式
      formData = Object.toJsonToArr(formData);
    }
    if (formAction) formData.push(item);
    if (keyId) formData.push(itemkeyId);
    if (mainTable) formData.push(itemMainTable);

    //url, method, data, async, type, callback, dataType, isloading
    _ajaxJson(url, method, formData, true, null, function (obj) {
      if (callBack) {
        callBack(obj);
      } else {
        if (obj.success != undefined && obj.success) {
          obj.msg = obj.msg || "操作成功！";
        }
        if (obj.success) {
          FUI.Window.showMsg2(vm, obj.msg, null, 1, function () {
            if (obj.success) {
              FUI.Window.closeEdit(true, parentGridId); //关闭当前窗口，而（可能）不是父窗口。
            }
          });
          return true;
        } else {
          FUI.Window.showMsg(vm, obj.msg);
        }
      }
    });
  } catch (err) {
    FUI.Window.showMsg(vm, "提交表单异常出错" + err);
  }

}

/* Ajax Post方式进行form提交**/
//submit提交，使用Ajax Post方式进行form提交
//params:Json格式的参数
//callBack：回调函数
//formId：表单ID，可为空，默认取页面第0个表单
//options:Jquery Form原生配置
function f2ui_ajaxSubmit(postUrl, params, callBack, formId, options) {
  options = options || {};
  params = params || {};
  var jqueryObj = null;
  if (Object.toIsEmpty(formId)) {
    jqueryObj = $("form:eq(0)");
  } else {
    jqueryObj = $("#" + formId);
  }
  options = options || {};
  var author = window.localStorage.getItem('f2bpmAuthor');
  author = eval("(" + author + ")");
  jqueryObj.ajaxSubmit(Object.extend({
    data: params,
    url: postUrl,
    type: 'post',
    headers: {
      "f2bpmToken": author.token
    },
    beforeSubmit: function () {
      Object.toShowLoading();
    },
    success: function (dataStr) {
      Object.toCloseLoading();
      if (callBack) {
        if (dataStr) {
          var data = eval("(" + dataStr + ")");
          callBack(data);
        } else {
          callBack("");
        }

      }
    },
    error: function (data) {
      console.info(data);
      Object.toCloseLoading();
      FUI.Window.showMsg("提交出错：" + data.responseText);
    }
  }, options));
  return false;
}

//绑定表单数据
//Url请求地址
//method请求方法名
//keyId业务键ID
//dataJsonParm其它参数，Jaon格式或数组格式
//callBack回调函数，如果callBack不为空则会把Json结果付给callBack并且不进行Form的绑定
//targetFormId指定表单Id，默认为页面上第一个form
// mainTable主表, idField主键字段名
function fui_bindDataToForm($vm, url, method, keyId, dataJsonParm, mainTable, callBack, targetFormId) {
  try {
    var theData = [];
    keyId = keyId || "";
    dataJsonParm = dataJsonParm || [];
    var item = { name: "keyId", value: keyId };
    var itemMainTable = { name: "mainTable", value: mainTable };
    if (!Object.toIsArray(dataJsonParm)) {
      //Json参数形式
      theData = dataJsonParm;
      if (keyId || itemMainTable) {
        var arr = Object.toJsonToArr(dataJsonParm);
        theData = arr;
        if (keyId) theData.push(item);
        if (mainTable) theData.push(itemMainTable);
      }
    } else {
      //数组参数形式
      theData = dataJsonParm;
      if (keyId) theData.push(item);
      if (mainTable) theData.push(itemMainTable);
    }
    var obj = _ajaxJson(url, method, theData, null, null, callBack);
    if (obj.success != undefined && !obj.success) {
      obj.msg = obj.msg || "获取数据失败！";
      FUI.Window.showMsg($vm, obj.msg);
      return obj;
    } else {
      obj = fui_dataFormatter(obj);
      if (obj.success != undefined) {
        $vm.data = obj.data;
        return obj.data;
      } else {
        $vm.data = obj;
        return obj;
      }
    }
  } catch (err) {
    console.info(err);
    FUI.Window.showMsg($vm, "绑定业务表单异常出错" + err);
  }
}

//加载编辑表单前对数据处理,转为对象
function fui_dataFormatter(data) {
  $.each(data, function (key, value) {
    if ((value != null && value.time != null && value.time != "") || (typeof value == "string" && Object.toStartWith(value.toString(), "/Date("))) {
      var strDate = Object.toJsonDateTimeFormatter(value);
      data[key] = strDate;
    }
  });
  return data;
}

/**********************Form 表单相关操作的封装开始**************************/

/**********************window 相关操作的封装开始**************************/
//window.close()关闭窗口，isRefreshParent：是否调用 window.opener.window.refreshTargetGrid("grid");
function fui_closeBlankWindow(isRefreshParent, grid) {
  isRefreshParent = isRefreshParent || false;
  if (isRefreshParent == true) {
    if (window.opener != null) {
      try {
        window.opener.window.myvm.refreshGrid(grid);
      } catch (err) { }
    }
    window.close();

  }
}
function fui_windowClose(isRefreshOperner) {
  if (isRefreshOperner === true && window.opener != null) {
    window.opener.window.reload();
  }
  window.close();
}
function fui_windowOpen(url, target) {
  target = target || "_blank";
  var userAgentStr = window.navigator.userAgent;
  if (/DingTalk/.test(userAgentStr)) {
    var hasAuthor = JSON.stringify(FUI.Sys.getAuthor());
    if (url.indexOf("?") < 0) url += "?";
    else url += "&";
    url += "hasAuthor=" + window.btoa(hasAuthor);
  }
  window.open(url, target);
}

//在上级页面的tab窗口打开icon：fa fa fa-pencil
//没有父页面时将会在浏览器新窗口中打开
function _openUrlOnParentTab(url, title, icon, id) {
  window.location.href = url;
}
//打开窗口
//url地址 title标题 formAction窗口动作：Add新增，Edit修改，View查看；
//parentGridId 列表的Grid列表ID值,没有时传null,主要为了让编辑窗口关闭时自动刷新父页面的Grid列表
//（width：宽度，默认400px）（height：高度，默认350px）
//options layer的窗口options参数格式为Json格式，默认已初始
//mainTable 自动保存的主表名
//keyId 主键值
//isFitWindow 是否为固定的最大化窗口
//passParms:向窗口传递参数。获取方式：window.parms
//isTop:是否在顶层窗口打开，默认为false
function fui_openEdit(url, title, formAction, parentGridId, width, height, options, mainTable, keyIdValue, isFitWindow, callback, parms, isTop) {
  mainTable = mainTable || null;
  keyIdValue = keyIdValue || null;
  isFitWindow = isFitWindow || false;
  options = options || {};
  if (isTop != undefined && isTop != null) {
    options.isTop = isTop;
  } else {
    options.isTop = false;
  }

  if (isFitWindow != false) {
    options.fit = isFitWindow;
  }
  if (callback) {
    options.callback = callback;
  }
  if (!Object.toStartWith(url, __webpath)) {
    url = __webpath + url;
  }
  _openEdit(url, title, mainTable, formAction, keyIdValue, parentGridId, width, height, options, parms);
}

//打开对话框
//url地址 title标题 formAction窗口动作：Add新增，Edit修改，View查看；
//parentGridId 列表的Grid列表ID值,没有时传null,主要为了让编辑窗口关闭时自动刷新父页面的Grid列表
//（width：宽度，默认400px）（height：高度，默认350px）
//options 窗口options参数格式为Json格式，默认已初始比如：
//        options.shade 遮罩层，默认是0.3透明度的黑色背景（'#000'）。如果你想定义别的颜色，可以shade: [0.8, '#393D49']；如果你不想显示遮罩，可以shade: 0
//mainTable 自动保存的主表名
//keyId 主键值
//isFitWindow 是否为固定的最大化窗口
//passParms:向窗口传递参数。获取方式：window.parms
//buttons：重写按钮样式及文字{sure:{iconClass:"",text:""},close:{iconClass:"",text:""}}
function fui_openDialog(url, title, formAction, parentGridId, width, height, options, mainTable, keyIdValue, isFitWindow, callback, parms, buttons) {

  mainTable = mainTable || null;
  keyIdValue = keyIdValue || null;
  if (isFitWindow == undefined || isFitWindow == null) {
    isFitWindow = false;
  }
  options = options || {};
  options.fit = isFitWindow;
  if (callback) {
    options.callback = callback;
  }
  //url, title, mainTable, formAction, keyId, parentGridId, width, height,parms, options,buttons
  _openDialog(url, title, mainTable, formAction, keyIdValue, parentGridId, width, height, parms, options, buttons);
}

//私有通用打开窗口
function _openEdit(url, title, mainTable, formAction, keyId, parentGridId, width, height, options, parms) {
  if (width) {
    if (!isNaN(width)) width = width + "px";
  }
  if (height) {
    if (!isNaN(height)) height = height + "px";
  }
  parentGridId = parentGridId || "";
  var parentGridIdStr = parentGridId ? "&parentGridId=" + parentGridId : "";
  var theWidth = width || "640px";
  var theHeight = height || "400px";
  var theUrl = url;
  if (formAction != undefined && formAction != null) {
    theUrl = url + "";
    if (theUrl.indexOf("?") > -1) {
      theUrl = theUrl + "&formAction=" + formAction + parentGridIdStr;
    } else {
      theUrl = theUrl + "?formAction=" + formAction + parentGridIdStr;
    }
    if (keyId != null && keyId != undefined && url.indexOf("keyId") == -1) theUrl = theUrl + "&keyId=" + keyId;
    if (mainTable && mainTable != "") theUrl = theUrl + "&mainTable=" + mainTable;
  }
  //拼接Url参数
  if (parms && theUrl.indexOf("?") > -1) {
    theUrl = theUrl + "&parms=" + encodeURI(JSON.stringify(parms));
  } else if (parms && theUrl.indexOf("?") == -1) {
    theUrl = theUrl + "?parms=" + encodeURI(JSON.stringify(parms));
  }
  if (options.fit == true) {
    width = "100%";
    height = "100%";
  }
  //遮罩层
  var shade = 0.3;
  if (options && options.shade != undefined && options.shade != null) {
    shade = options.shade;
  }
  var maxMin = options.fit != true;
  var isShowCloseBtn = (title == "" || title == null || title == undefined) ? 0 : 1;
  if (isShowCloseBtn == 0) {
    maxMin = false;
  }
  var windowMe = window;
  var layerWin = window;
  var isTopOpen = false;
  var layerObject = layer;
  try {
    //页面集成时并且跨域时 不能访问window.parent.layer
    if (window.parent && window.parent.layer && options.isTop === true) {
      //优先使用上层的layer来打开
      isTopOpen = true;
      layerObject = window.parent.layer;
      layerWin = window.parent;
    }
  } catch (err) {

  }
  var index = layerObject.open({
    type: 2,
    //遮罩层，默认是0.3透明度的黑色背景（'#000'）。如果你想定义别的颜色，可以shade: [0.8, '#393D49']；如果你不想显示遮罩，可以shade: 0
    shade: shade,
    maxmin: maxMin,
    closeBtn: isShowCloseBtn,
    area: [width, height],
    title: title,
    content: theUrl,
    success: function (layero, index) {
      //iframe中的window对象
      var iframeWin = null;
      if (isTopOpen) {
        iframeWin = window.parent.window[layero.find('iframe')[0]['name']];
      } else {
        iframeWin = window[layero.find('iframe')[0]['name']];
      }
      //需要iframe页面全部加载完这后才能拿到这个openerWin对象
      iframeWin.openerWin = windowMe;
      //layer所归属的window,届时需要使用这个来关闭窗口
      iframeWin.openerLayerWin = layerWin;
      iframeWin.parms = parms;
      if (iframeWin.pageLoad) {
        iframeWin.pageLoad();
      }
    }
  });
  if (options.fit == true) {
    layerObject.full(index);
  }
  return index;
}

//私有通用对话框
function _openDialog(url, title, mainTable, formAction, keyId, parentGridId, width, height, parms, options, buttons) {
  options = options || {};
  if (options.fit == undefined || options.fit == null) {
    options.fit = false;
  }
  parentGridId = parentGridId || "";
  var theWidth = width || 640;
  var theHeight = height || 350;
  var theUrl = url;
  if (formAction) {
    theUrl = url + "";
    if (theUrl.indexOf("?") > -1) {
      theUrl = theUrl + "&parentGridId=" + parentGridId + "&formAction=" + formAction;
    } else {
      theUrl = theUrl + "?parentGridId=" + parentGridId + "&formAction=" + formAction;
    }
    if (keyId != null && keyId != undefined && url.indexOf("keyId") == -1) theUrl = theUrl + "&keyId=" + keyId;
    if (mainTable && mainTable != "") theUrl = theUrl + "&mainTable=" + mainTable;

  }
  //(url, title, parms, width, height, callback, isTopdialog, opt, buttons,topN
  //callback函数：function (objectData, index) {layer.close(index);}
  FUI.dialog(theUrl, title, parms, theWidth, theHeight, options.callback, false, options, buttons);
}
//加载表单显示文本的标签
function loadFormSpantext(data, targetFormId) {
  $targetForm = $("form:eq(0) span[name]");
  if (targetFormId) {
    $targetForm = $("#" + targetFormId + " span[name]");
  }
  $targetForm.each(function () {
    var name = $(this).attr("name");
    if (data[name] != undefined) {
      var value = data[name];
      $(this).html(value);
    }
  });
}
/**********************window 相关操作的封装结束 **************************/


/***********页面 ComboBox 渲染开始*****************/
function _InitailSqlKeyComboBox($vm, options) {
  options = options || {};
  var listComboBox = [];
  var method = "sqlComboBox";
  var url = FUI.Handlers.FuiFrameworkHandler;
  $.each($vm.sqlkeyArray, function (i, item) {
    var sqlKey = item.sqlkey;
    var id = item.dataField;
    var param = item.parm || "";
    var flag = item.flag || "";
    var change = item.change || "";
    //先收集进行一次性请求

    var item = Object.toStringFormat("{comboBoxId:\"{0}\",sqlKey:\"{1}\", param: \"{2}\", change: \"{3}\" , flag: \"{4}\"}", id, sqlKey, param, change, flag);
    listComboBox.push(item);

  });

  if (listComboBox.length > 0) {
    var data = { jsonParam: "[" + listComboBox.toString() + "]" };
    var resultData = Object.toAjaxJson(url, method, data);
    if (resultData.success == false) {
      FUI.Window.showMsg($vm, resultData.msg);
    }
    for (var itemIndex in resultData) {
      var comboBoxId = resultData[itemIndex].comboBoxId;
      $vm[comboBoxId] = resultData[itemIndex].data;
      // $("#" + comboBoxId).combobox({
      //   emptyText:options.emptyText,
      //   data: resultData[itemIndex].data,
      //   valueField: 'value',
      //   textField: 'text',
      //   onSelect: $("#" + comboBoxId).attr("change")
      // });
    }
  }

}

function _InitailConfigTypeComboBox($vm, options) {
  __getConfigTypeData();
  options = options || {};
  var listComboBox = [];
  var method = "configTypeComboBox";
  var url = FUI.Handlers.FuiFrameworkHandler;
  if ($vm.configTypeArray) {
    $.each($vm.configTypeArray, function (i, item) {
      var id = item.dataField;
      var configType = item.configType || item.configtype;
      var flag = item.flag;
      var isEnable = item.isEnable;
      var isValue = item.isValue;
      var isReadOnly = item.isReadOnly;
      var item = { comboBoxId: id, configType: configType, flag: flag, isEnable: isEnable, isValue: isValue, isReadOnly: isReadOnly };
      listComboBox.push(item);
    });
  }
  var configTypeData = FUI.Data.ConfigTypeData;
  if (listComboBox.length > 0) {
    if (configTypeData.length != 0) {
      for (var itemIndex in listComboBox) {
        var comboBoxId = listComboBox[itemIndex].comboBoxId;
        var configType = listComboBox[itemIndex].configType;
        var flag = listComboBox[itemIndex].flag || "";
        var isEnable = listComboBox[itemIndex].isEnable || "";
        var isValue = listComboBox[itemIndex].isValue || "";
        var isReadOnly = listComboBox[itemIndex].isReadOnly;
        var comboBoxData = [];
        for (configTypeIndex in configTypeData) {
          if (configTypeData[configTypeIndex].configType == configType) {
            if (flag === "" && isEnable === '' && !isValue) {
              comboBoxData = configTypeData[configTypeIndex].data;
            } else if (flag === "" && isEnable === '' && isValue) {
              var temData = configTypeData[configTypeIndex].data;
              for (var i in isValue) {
                for (itemIndex in temData) {
                  if (temData[itemIndex].value === isValue[i] || temData[itemIndex].text === isValue[i])
                    temData[itemIndex].isEnable = 1;
                }
              }
              // 过滤禁用数据
              for (itemIndex in temData) {
                if (Number(temData[itemIndex].isEnable) === 1)
                  comboBoxData.push(temData[itemIndex]);
              }

            } else if (isEnable) {
              //过滤
              var temData = configTypeData[configTypeIndex].data;
              for (itemIndex in temData) {
                if (temData[itemIndex].isEnable == undefined || temData[itemIndex].isEnable === '') {
                  temData[itemIndex].isEnable = 1;
                }
                if (Number(temData[itemIndex].isEnable) === isEnable) {
                  comboBoxData.push(temData[itemIndex]);
                }

              }
            } else {
              //过滤Flag
              var temData = configTypeData[configTypeIndex].data;
              for (itemIndex in temData) {
                if (temData[itemIndex].flag == flag)
                  comboBoxData.push(temData[itemIndex]);
              }
            }
            break;
          }
        }
        $vm[comboBoxId] = comboBoxData;
      }
    }
  }
}


/***********页面 ComboBox 渲染结束*****************/

//=========================Jquery================
//设置指定元素为只读
function fui_setReadOnly(inputId) {
  return $("#" + inputId).attr('readonly', true).css('opacity', 0.7);
}

//设置指定元素为非只读
function fui_setUnReadOnly(inputId) {
  return $("#" + inputId).attr('readonly', false).css('opacity', 1);
}

$.fn.form = function (actionType, data) {
  var formObj = this;
  if (actionType == "validate") {
    return FUI.validate($(formObj));
  }
  if (actionType = "load") {
    if (data == undefined) {
      return false;
    }
    if (typeof data !== "object") {
      throw "data no object";
    }
    for (var key in data) {
      if (data.hasOwnProperty(key)) {
        if (!isNaN(key)) continue;
        var inputs = formObj.find('input[name = "' + key + '"],textarea[name = "' + key + '"]');
        if (inputs.length > 0) {
          var input = inputs[0];
          switch (input.type) {
            case "password":
            case "text":
              input.value = data[key];
              break;
            case "textarea":
              input.value = data[key];
              break;
            case "hidden":
              input.value = data[key];
              break;
            case "radio":
              {
                if (key === undefined) {
                  throw "name no undefined";
                }
                var val = data[key];
                if (val != undefined && val.toString().indexOf(",")) {
                  var vArr = val.toString().split(",");
                  $.each(vArr, function (_, checkItemValue) {
                    formObj.find('input[type="radio"][name="' + key + '"][value="' + checkItemValue + '"]').prop("checked", true);
                  });
                } else {
                  formObj.find('input[type="radio"][name="' + key + '"][value="' + val + '"]').prop("checked", true);
                }
                if (FUI.layuiForm) {
                  FUI.layuiForm.render('radio');
                }
              }
              break;
            case "checkbox":
              {
                if (key === undefined) {
                  throw "name no undefined";
                }
                var val = data[key];
                if (val != undefined && val.toString().indexOf(",")) {
                  var vArr = val.toString().split(",");
                  $.each(vArr, function (_, checkItemValue) {
                    formObj.find('input[type="checkbox"][name="' + key + '"][value="' + checkItemValue + '"]').prop("checked", true);
                  });
                } else {
                  formObj.find('input[type="checkbox"][name="' + key + '"][value="' + val + '"]').prop("checked", true);
                }

                if (FUI.layuiForm) {
                  FUI.layuiForm.render('checkbox');
                }

              }
              break;
          }
        }
        var select = formObj.find('select[name="' + key + '"]');
        if (select.length > 0) {
          var val = data[key];
          var isOnSelect = true;
          if (key === undefined) {
            throw "name no undefined";
          }
          if (typeof val == "boolean") {
            val = val.toString();
          }
          select.val(val);
          if (select.attr("ctr_type") == "flow_cascselect") {
            select.attr("initvalue", val);
          }
          //FUI.layuiForm.render('select'); 不使用lay的select 渲染
          //if (typeof (isOnSelect) === "boolean") {
          //    if (isOnSelect) {
          //        formObj.find("dd[lay-value='" + val + "']").trigger("click");
          //    }
          //}
        }
      }
    }
  }
};

/**
 * 获取树形节点无限子级的节点ID
 * @param isContailMySelf
 * @param 获取值的属性名，默认为id
 * @private
 */
function _getTreeNodeAndAllSubChild(node, isContailMySelf, propertyName) {
  propertyName = propertyName || "id";
  var ids = [];
  if (isContailMySelf === true) {
    ids.push(node.data[propertyName]);
  }
  if (node.childNodes && node.childNodes.length > 0) {
    _getTreeChildNodesAndAllSub(node.childNodes, propertyName, ids);
  }
  return ids;
}

/**
 * 获取树型节点所有子级节点指定属性值
 * @param childNodes 节点列表
 * @param propertyName 属性名
 * @param resultList 结果集，传入一个引用的数组对象，引用类型
 * @private
 */
function _getTreeChildNodesAndAllSub(childNodes, propertyName, resultList) {
  $.each(childNodes, function (i, node) {
    var v = node.data[propertyName];
    resultList.push(v);
    if (node.childNodes && node.childNodes.length > 0) {
      _getTreeChildNodesAndAllSub(node.childNodes, propertyName, resultList);
    }
  });
}
//==============prototype================

/**
 * 请求流程rest API
 * @param {*} api api路径名称
 * @param {*} parms  参数
 */
function fui_requestWorkflowAPI(api, parms) {
  parms = parms || {};
  var url = api;
  var data = Object.toAjaxJson(url, '', parms);
  return data;
}
