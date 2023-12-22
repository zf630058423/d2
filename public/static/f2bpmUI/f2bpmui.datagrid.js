/***********F2BPM UI DataGrid********/
//==============================FUI  Grid 快速开发框架==========================================
/**
 *FUI（F2UI）开发框架快速开发框架
 *Data:2013-12-10
 *Update:2020-02-24
 *author:致博软件科技有限公司版本所有 QQ:f2bpm@f2bpm.com www.f2bpm.com
 */

+ function ($) {
  //================DataGrid创建开始======================//
  FUI.DataGrid = {
    /*
     *viewTableName：视图名，表名，或者sqlMap文件指定的Key
     *mainTableName:指定的操作主表名称
     *gridId 目标grid元素ID
     *showCheckBox：是否显示复选框
     *showToolbar：是否显示工具栏
     *showSearch：是否显示查询栏
     *options：options的重载，可查看easyui的API
     *editor editor对象
     */
    Create: function (vm, viewTable, mainTable, gridId, showCheckBox, showToolbar, showSearch) {
      //把数据字典先加载出来放到FUI.Data.ConfigTypeData中
      __getConfigTypeData();

      //创建DataGrid对象,生成需要的属性
      var targetGrid = new DataGrid(vm, viewTable, mainTable, gridId, showCheckBox, showToolbar, showSearch);
      //=============================快捷的操作方法===============================
      targetGrid.TreeShowAll = function (treeId) {
        FUI.Tree.cleanSelectedClass(treeId);
        var thisGridId = this.GridId;
        defaultResetSearch(null, thisGridId);
      };
      targetGrid.ReSetSearch = function (treeId) {
        if (treeId) {
          FUI.Tree.cleanSelectedClass(treeId);
        }
        var thisGridId = this.GridId;
        defaultResetSearch(null, thisGridId);
      };
      //Reload刷新或查询Grid
      targetGrid.Reload = function (searchFiledParm) {
        var thisGridId = this.GridId;
        if (searchFiledParm) {
          $.each(searchFiledParm, function (key, value) {
            $('#' + key).val(value);
          });
        }
        defaultQuery(this.$vm, thisGridId);
      };
      //重新加载默认条件
      targetGrid.ReLoadDefaultWhere = function () {
        if (targetGrid.IsEnableReloadWhere == false) return false;
        var defaultWhere = targetGrid.DefaultWhere;
        var newUrl = '';
        var url = targetGrid.Grid.config.url;
        newUrl = url.substr(0, url.indexOf('defaultWhere') + 13) + encodeURI(defaultWhere);
        targetGrid.Grid.reload({
          url: newUrl,
          where: {},
          page: { curr: 1 }
        });
        return targetGrid;
      };
      //重新加载新的Url
      targetGrid.ReLoadUrl = function (newUrl) {
        var defaultWhere = targetGrid.DefaultWhere;
        if (newUrl.indexOf('?') != -1) {
          newUrl = newUrl + '&' + encodeURI(defaultWhere) + '&defsort=' + targetGrid.SortName + '&deforder=' + targetGrid.SortOrder;
        } else {
          newUrl = newUrl + '?' + encodeURI(defaultWhere) + '&defsort=' + targetGrid.SortName + '&deforder=' + targetGrid.SortOrder;
        }
        targetGrid.Grid.reload({
          url: newUrl,
          where: {},
          page: { curr: 1 }
        });
        return targetGrid;
      };

      targetGrid.GetOptions = function () {
        dataGridSearch;
        return targetGrid.Grid.config;
      };

      //以英文逗号隔开的主键值
      targetGrid.getChecked = function (filed) {
        var grid = targetGrid.GridId;
        filed = filed || targetGrid.IdField;
        var data = targetGrid.$vm.$refs[grid].getCheckboxRecords();
        var ids = new Array();
        if (data.length == 0) {
          return '';
        }
        for (var i = 0; i < data.length; i++) {
          var id = data[i][filed];
          ids.push(id);
        }
        var result = ids.toString();
        return result;

      };
      //获取选择中的所有数据
      targetGrid.getCheckedRows = function (filed) {
        var grid = targetGrid.GridId;
        var data = targetGrid.$vm.$refs[grid].getCheckboxRecords();
        return data;
      };
      //以英文逗号隔开的主键值
      // targetGrid.getSelected = function (filed) {
      //     var gridId = this.GridId;
      //     filed = filed || this.IdField;
      //     var selRows = FUI.layuiTable.checkStatus(gridId);
      //     var ids = new Array();
      //     var data = selRows.data;
      //     if (data.length == 0) {
      //         return false;
      //     }
      //     for (var i = 0; i < data.length; i++) {
      //         var id = data[i][filed];
      //         ids.push(id);
      //     }
      //     var result = ids.toString();
      //     return result;
      // };

      // targetGrid.getSelectedRows = function () {
      //     var gridId = this.GridId;
      //     var selRows = FUI.layuiTable.checkStatus(gridId);
      //     return selRows.data;
      // };

      return targetGrid;
    }
  };

  //Grid对象
  function DataGrid(vm, viewTable, mainTable, gridId, showCheckBox, showToolbar, showSearch) {
    //vm是vue对象
    this.$vm = vm;
    this.Grid = null;
    this.Type = 'datagrid';
    this.IdField = ''; //如果页面上手动设置了则以页面上为准
    this.IdDbField = ''; //如果页面上手动设置了则以页面上为准
    this.ColManageField = ''; //如果页面上手动设置了则以页面上为准
    this.GridId = gridId || 'grid';
    this.Height = 'full-160'; //full-130高度，默认自适应
    this.ToolbarID = 'toolbar_' + Math.floor(Math.random() * 10000);
    this.BtnQuery = 'queryBtn_' + Math.floor(Math.random() * 10000);
    this.BtnReset = 'resetBtn_' + Math.floor(Math.random() * 10000);
    this.MainTable = mainTable || viewTable;
    this.ViewTable = viewTable;
    this.IsEnableReloadWhere = true;
    this.SingleSelect = false;
    this.ShowNumbers = false;
    //DB数据源编码
    this.DBCode = "";
    //是不显示更多查询条件按钮
    this.ExpansMore = false;
    this.EnableConfigGridHead = true; //是否开户表头配置
    //列自适应，如果开启为true在则冻结列的拖动会变为无效，默认为false
    this.FitColumns = false;
    //获取数据源的URL，如果为null则使用框架自身原理获取数据
    this.Url = null;
    //强制指定列表数据源,当此值不为null时，会转为从指定的这个数据源中取数据（些数据源不影响表头定义）,如果使用"todoList"则表与待办列表进行inner join
    this.DataSource = null;
    //自定义列，当此项不为空时，表示列头由自己处理（注意遵行的列定义格式）
    this.Columns = null;
    //分组列
    this.GroupColumns = null;
    //自定义冻结列，当此项不为空时，表示冻结列头由自己处理（注意遵行EasyUI的列定义格式）
    this.FrozenColumns = null;
    //自定义冻结分组列
    this.FrozenGroupColumns = null;
    //Options最终请求数据的配置,
    this.Options = {};
    //整个列表呈现后需要隐藏的列，如["aaa","bbb"]
    this.HidColumns = null;
    //修改表头名称：如[{field:"字段名",title:"标题"}]
    this.ColumnsTitle = null;

    //=============================编辑页相关===============================
    this.EditUrl = '';
    this.EditTitle = '';
    this.EditWidth = 740;
    this.EditHeight = 500;
    //=============================特殊功能===============================
    // sys_gridconfig的tableName名称，如果为null，则默认与viewTable名称相同
    this.ConfigTableName = null;
    //=============================默认查询===============================
    this.DefaultWhere = ''; //写法与SQL数据库脚本一样，如：A='111' and b='333'
    //Json参数：如{a:b,c:d}
    this.JsonParam = null;
    this.SortName = '';
    this.SortOrder = 'ASC';
    this.IsEnableAuthor = 0;
    //=============================数据过滤授权参数（结合分管授权发布使用）===============================

    this.Filter = {}; //{AuthorizeType:授权类别,AuthorizeField:查询字段}; 示例：dg.Filter.AuthorizeType=1;dg.Filter.AuthorizeField="WorkflowKey";
    //=============================开关属性===============================
    this.ShowCheckBox = showCheckBox || false;
    //是否显示工具栏
    this.ShowToolbar = showToolbar || false;
    //是否显示查询区域
    this.ShowSearch = showSearch;
    //是否显示查询按钮
    this.ShowSearchBtn = true;
    //是否显示重置按钮
    this.ShowReSearchBtn = true;
    //是否简化搜索查询区（输入框变短，只有图标的查询按钮）
    this.IsSimpleSearch = false;
    //=============================可重写事件方法===============================
    //DataGrid属性以下方法调用都可重写，参数都是 row
    //操作列格式化重载 参数row
    this.PrimaryKeyFormatter = null;

    //是否开启行内双击编辑
    this.EnableDblClickEdite = false;
    //行双击之前事件  参数：row,index 需要返回ture执行事件，false不执行事件
    this.BeforeDblClickEditeEvent = false;
    //*********************操作列事件及相关*********************

    //操作列自定义按钮:html形式的string
    this.OperationCustomButton = null;
    //操作默认按钮显示控制
    this.OperationAction = { ShowEdit: true, ShowView: true, ShowDelete: true };

    //双击保存成功后触发事件,默认false
    this.OperationAfterSaveRowIsRefresh = false;

    //操作列的删除事件重载 参数：value,row,index
    this.OperationDeleteEvent = null;

    //操作列的查看按钮事件重载 参数：value,row,index
    this.OperationViewEvent = null;

    //行内编辑时保存事件 参数：value,row,index
    this.OperationSaveRowEvent = null;

    //操作列的编辑事件重载 参数：value,row,index
    this.OperationEditEvent = null;

    //操作列的删除事件之前触发的事件重载 需要返回ture执行事件，false不执行事件 参数：value,row,index
    this.OperationBeforeDeleteEvent = null;

    //操作列的删除事件成功之后触发事件
    this.OperationAfterDeleteEvent = null;

    //操作列的查看按钮事件之前触发重载 需要返回ture执行事件，false不执行事件 参数：value,row,index
    this.OperationBeforeViewEvent = null;

    //行内编辑时保存事件之前触发 需要返回ture执行事件，false不执行事件 参数：value,row,index
    this.OperationBeforeSaveRowEvent = null;

    //操作列的编辑事件之前触发 需要返回ture执行事件，false不执行事件 重载 参数：value,row,index
    this.OperationBeforeEditEvent = null;
    //*********************工具栏事件及相关*********************
    //工具栏默认按钮显示控制
    this.ToolBarDefaultButtons = { ShowAdd: true, ShowDelete: true, ShowSearch: true };
    //批量删除
    this.ToolBarBathDelete = defaultToolBarBathDeleteFunction;
    //批量删除事件 参数：gridId, mainTable, idField
    this.ToolBarDeleteEvent = null;
    //批量删除事件之前触发的事件重载 需要返回ture执行事件，false不执行事件 参数：gridId, mainTable, idField
    this.ToolBarBeforeDeleteEvent = null;
    //参数：gridId, mainTable, idField
    this.ToolBarAddEvent = null;
    //工具栏自定义按钮html形式的string，参数无
    this.ToolBarCustomButton = null;
    //工具栏自定义按钮最后面html形式的string，参数无
    this.ToolBarCustomButtonAfter = null;

    //====查询区域扩展========================

    //自定义查询输入框查询Jons数组结构：[{text:"标签中文名", name:"字段名",prend:"=",type:"validatebox"},{text:"标签中文名2",name:"字段名",prend:"=",type:"combobox"}]
    //type为EasyUI的控件类型
    this.SearchAreaCustomInputJsonArray = null;
    //检查区自定义的Html
    this.SearchAreaCustomInputHtml = null;
    //=============================可重写事件方法===============================
  }

  //构建DataGrid
  DataGrid.prototype = {
    //重新获取最新的请求Url，当属性改变时调用此方法将取得最新的请求Url
    GetUrl: function () {
      var targetGrid = this;
      var dataSource = targetGrid.DataSource || '';
      var configTableName = targetGrid.ConfigTableName || '';
      var requestUrl = '';
      if (targetGrid.Url) {
        if (targetGrid.Url.indexOf('?') != -1) {
          requestUrl = targetGrid.Url + '&';
        } else {
          requestUrl = targetGrid.Url + '?';
        }
        requestUrl = requestUrl + 'deforder=' + targetGrid.SortOrder + '&defsort=' + Object.toTrim(targetGrid.SortName) + '&isEnableAuthor=' + targetGrid.IsEnableAuthor + '&defaultWhere=' + encodeURI(targetGrid.DefaultWhere);
      } else {
        requestUrl = FUI.Handlers.FuiFrameworkHandler + 'getViewTableListData/?deforder=' + targetGrid.SortOrder + '&defsort=' + Object.toTrim(targetGrid.SortName) + '&viewTable=' + targetGrid.ViewTable + '&dataSource=' + dataSource + '&configTableName=' + configTableName + '&isEnableAuthor=' + targetGrid.IsEnableAuthor + '&defaultWhere=' + encodeURI(targetGrid.DefaultWhere);
      }
      //数据权限过滤标识参数
      if (targetGrid.Filter != null && targetGrid.Filter.AuthorizeType != undefined && targetGrid.Filter.AuthorizeField != undefined) {
        requestUrl = requestUrl + '&filterAuthorizeType=' + targetGrid.Filter.AuthorizeType + '&filterAuthorizeField=' + targetGrid.Filter.AuthorizeField;
      }
      //DB数据源
      if (targetGrid.DBCode != null && targetGrid.DBCode != "") {
        requestUrl = requestUrl + '&_dbCode=' + targetGrid.DBCode;
      }
      return requestUrl;
    },
    onCellClick: function (row, column, cell, event) {
      if (column.title == '操作') {
        return false;
        itemRender;
      }
      var targetGrid = this;
      var $vm = targetGrid.$vm;
      //监听单元格事件
      var opts = targetGrid.Options;
      var enabledEdite = targetGrid.EnableDblClickEdite;
      if (enabledEdite == false) {
        return false;
      }
      //触发编辑前扩展事件
      var canExcute = true;
      if (targetGrid.BeforeDblClickEditeEvent) {
        var beforeDbClickEvent = targetGrid.BeforeDblClickEditeEvent;
        var beforeDbClickEvent = eval(targetGrid.BeforeDblClickEditeEvent);
        canExcute = beforeDbClickEvent(row, rowIndex);
      }
      if (canExcute != true) {
        return false;
      }

      var primaryKey = targetGrid.IdField;
      var primaryValue = row[primaryKey];
      // var eventString = column.params;
      // console.info(eventString);
      // var json=eval("("+eventString+")");

      var json = column.params;
      if (json == undefined) return false;
      var editorType = json.editorType;
      //对象名，即用户填写的JS对象或者默认的编辑器
      var editorName = json.editorName;
      //编辑器对象
      var editorOjb = json.editor;
      var required = json.required;
      var dataType = json.dataType;
      var columnName = json.field;
      var columnTitle = json.title;
      var theValue = row[columnName] || "";
      theValue = theValue.toString();
      if (dataType == "bit" || dataType == "bool") {
        return false;
      }
      var tableName = "";
      if (targetGrid.MainTable == "f2bpm_sys_GridConfig") {
        tableName = row.TableName;
        if (tableName == undefined) {
          tableName = row.TABLENAME;
        }
      }
      json.mainTable = targetGrid.MainTable;
      json.viewTable = targetGrid.ViewTable;
      //tableName主要用于刷新表头配置
      json.tableName = tableName;

      json.idField = primaryKey;
      json.primaryValue = primaryValue;
      json.fieldName = columnName;
      json.fieldValue = theValue;
      //json.operationBeforeSaveRowEvent = targetGrid.OperationBeforeSaveRowEvent;
      //json.rowIndex = null;
      //json.row = row;防止Url参数过长
      FUI.dialog("/workflow/gridEditor/defaultEditor", '修改 [' + columnTitle + ']', json, 700, 560, function (objectData, index, layer) {
        if (objectData.success == false) {
          return false;
        }
        var fieldName = objectData.fieldName;
        var fieldValue = objectData.fieldValue;
        //引用会自动更新修改的字段值
        row[fieldName] = fieldValue;
        if (targetGrid.OperationAfterSaveRowIsRefresh) {
          targetGrid.Reload();
        }
        layer.close(index);
      });

    }
    //=============搜索查询触发 start===========
    ,
    searchFormbtnClick(name) {
      var that = this.$vm;
      var fun = that[name];
      if (fun) {
        fun();
      }
    }
    //更新搜索字段值
    ,
    updateFieldValue(field, newValue, vueDataName, subVueDataName) {
      var that = this.$vm;
      var vueDataObj = vueDataName ? that[vueDataName] : that.data;
      if (subVueDataName) {
        vueDataObj = that[vueDataName][subVueDataName];
      }
      if (typeof field == "string") {
        vueDataObj[field] = newValue;
      } else {
        vueDataObj[field.vModel] = newValue;
      }
    }
    //=============搜索查询触发 end===========
    //==============注册vue的方法==========
    ,
    regVueMethod: function () {
      //当前的DataGrid对象
      //注册默认方法
      var targetGrid = this;

      targetGrid.$vm["searchFormbtnClick"] = function (name) {
        targetGrid.searchFormbtnClick(name);
      };
      targetGrid.$vm["updateFieldValue"] = function (field, newValue, vueDataName, subVueDataName) {
        targetGrid.updateFieldValue(field, newValue, vueDataName, subVueDataName);
      };
      targetGrid.$vm["contextMenuClickEvent"] = function (code) {
        if (code == 'configHead') {
          var configTableName = targetGrid.ConfigTableName || "";
          var tableName = targetGrid.ViewTable;
          var configGridId = targetGrid.GridId;
          var dataSource = targetGrid.DataSource;
          __openGridConfig(tableName, configTableName, configGridId, dataSource);
        }
      };
      targetGrid.$vm["celldbClick"] = function ({ row, column, cell, event }) {
        //column:这是原生elementui table自己的列字段。需要转换datagrid自己的列定义
        var colName = column.property;
        var col = targetGrid.$vm.tableColumn.find(a => a.field == colName);
        targetGrid.onCellClick(row, col, cell, event);
      };
      //dagagrid相关的事件触发
      targetGrid.$vm["sortChange"] = function ({ column, field, order }) {
        targetGrid.$vm.tablePage.sort = field;
        targetGrid.$vm.tablePage.order = order;
        targetGrid.$vm.tablePage.currentPage = 1;
        targetGrid.$vm.getGridData();
      };
      targetGrid.$vm["pageChange"] = function ({ currentPage, pageSize }) {
        targetGrid.$vm.tablePage.currentPage = currentPage;
        targetGrid.$vm.tablePage.pageSize = pageSize;
        targetGrid.$vm.tablePage.startIndex = (currentPage - 1) * pageSize;
        targetGrid.$vm.getGridData();
      };
      //刷新列表
      targetGrid.$vm["refreshGrid"] = function (parentGridId, parm) {
        var that = this;
        targetGrid.$vm.dataGridSearch();
      };
      //搜索框的展开与收缩
      targetGrid.$vm["expandClick"] = function (name) {
        targetGrid.$vm.expandSearch = name;
      };

      //扩展注册外部方法
    },
    Bind: function () {
      var targetGrid = this; //当前的DataGrid对象
      //注册默认和自定义的vue方法
      targetGrid.regVueMethod();

      var opts = targetGrid.Options;
      var showToolbar = targetGrid.ShowToolbar;
      opts = opts || {};
      opts.height = targetGrid.Height;
      var dataSource = targetGrid.DataSource || '';
      var configTableName = targetGrid.ConfigTableName || '';
      var frozenColumns = [];
      var columns = [];
      var objColumns = null;
      if (targetGrid.Columns != null) {
        var data = {};
        data.frozenGroupColumns = targetGrid.FrozenGroupColumns || [];
        data.frozenColumns = targetGrid.FrozenColumns || [];
        data.groupColumns = targetGrid.GroupColumns || [];
        data.columns = targetGrid.Columns || [];
        targetGrid.HeaderData = data;
      } else {
        //获取EasyUI DataGrid列的定义数据 HeaderData:{FrozenGroupColumns:[],FrozenColumns:[],GroupColumns:[],Columns:[]}
        targetGrid.HeaderData = _ajaxJson(FUI.Handlers.FuiFrameworkHandler, 'getDataGridHeader', {
          viewTable: targetGrid.ViewTable,
          configTableName: configTableName,
          dataSource: dataSource,
          _dbCode: targetGrid.DBCode
        });
      }
      var objColumns = targetGrid.HeaderData;
      //查找主键
      setGridFieldId(targetGrid, objColumns);

      var allComumn = [];

      //分组列
      if (objColumns.groupColumns.length > 0) {
        targetGrid.HeaderData.groupColumns = formatHeader(targetGrid, objColumns.groupColumns, 'GroupColumns');
        var tempColumn = [];
        $.each(targetGrid.HeaderData.groupColumns, function (_, item) {
          if (!item.IsHiddenInput) {
            tempColumn.push(item);
          }
        });
        columns.push(tempColumn);
      }

      //冻结列
      if (objColumns.frozenColumns.length > 0) {
        targetGrid.HeaderData.frozenColumns = formatHeader(targetGrid, objColumns.frozenColumns, 'FrozenColumns');
        $.each(targetGrid.HeaderData.frozenColumns, function (_, item) {
          if (!item.IsHiddenInput) {
            allComumn.push(item);
          }
        });
      }

      if (objColumns.columns.length > 0) {
        targetGrid.HeaderData.columns = formatHeader(targetGrid, objColumns.columns, 'Columns');
        $.each(targetGrid.HeaderData.columns, function (_, item) {
          if (!item.IsHiddenInput) {
            allComumn.push(item);
          }
        });
      }
      columns.push(allComumn);
      //console.info(JSON.stringify(columns));
      // var requestUrl = '';
      // if (targetGrid.Url) {
      //   if (targetGrid.Url.indexOf('?') != -1) {
      //     requestUrl = targetGrid.Url + '&';
      //   } else {
      //     requestUrl = targetGrid.Url + '?';
      //   }
      //   requestUrl = requestUrl + 'deforder=' + targetGrid.SortOrder + '&defsort=' + Object.toTrim(targetGrid.SortName) + '&defaultWhere=' + encodeURI(targetGrid.DefaultWhere);
      // } else {
      //   requestUrl = FUI.Handlers.FuiFrameworkHandler + 'getViewTableListData/?deforder=' + targetGrid.SortOrder + '&defsort=' + Object.toTrim(targetGrid.SortName) + '&viewTable=' + targetGrid.ViewTable + '&dataSource=' + dataSource + '&configTableName=' + configTableName + '&defaultWhere=' + encodeURI(targetGrid.DefaultWhere);
      // }
      // //数据权限过滤标识参数
      // if (targetGrid.Filter != null && targetGrid.Filter.AuthorizeType != undefined && targetGrid.Filter.AuthorizeField != undefined) {
      //   requestUrl = requestUrl + '&filterAuthorizeType=' + targetGrid.Filter.AuthorizeType + '&filterAuthorizeField=' + targetGrid.Filter.AuthorizeField;
      // }
      requestUrl = targetGrid.GetUrl();
      var url = requestUrl;
      var mycfg = {
        id: targetGrid.GridId,
        elem: '#' + targetGrid.GridId,
        url: url,
        //toolbar: "#" + targetGrid.ToolbarID,
        sort: targetGrid.SortName,
        order: targetGrid.SortOrder,
        page: true,
        loading: true,
        text: { none: '暂无数据' },
        //height: 'full-100',
        size: 'sm',
        even: false,
        autoSort: false,
        response: {
          statusName: 'success',
          statusCode: true,
          countName: 'total',
          dataName: 'rows'
        },
        pageSize: 15,
        pageSizes: [10, 15, 20, 25, 30, 35, 40, 50, 500],
        cols: columns,
        idField: targetGrid.IdField,
        striped: true,
        nowrap: false,
        singleSelect: targetGrid.SingleSelect,
        checkOnSelect: false,
        selectOnCheck: false,
        done: function (res, curr, count) {

        }

      };
      targetGrid.$vm.tableColumn = columns[0];

      if (targetGrid.ShowSearch == true) {
        createSearchForm(targetGrid); //创建SearchForm表单
      }
      if (targetGrid.ShowToolbar == true) {
        createToolbar(targetGrid);
      }
      //是否显示查询更多
      if (targetGrid.ExpansMore === false) {
        let gridId = targetGrid.GridId;
        setTimeout(function () {
          $(".vxe-form--item-trigger-node", $("div[grid='" + gridId + "']")).hide();
        }, 100);

      }
      var options = $.extend(mycfg, opts);
      targetGrid.Options = options;
      //var dg=options;
      targetGrid.$vm.dg = targetGrid;
      // targetGrid.$vm.tablePage.sort=options.sort;
      // targetGrid.$vm.tablePage.order=options.order;
      
      // 业务信息预查询不初始化表格数据
      if (this.$vm.code !== 'custGrid_CustSearch_YeWuXinXiYuChaXun') {
        targetGrid.$vm.getGridData();
      }


      //var dg = FUI.layuiTable.render(options);
      //targetGrid.Grid = dg;
      // FUI.layuiTable.on("checkbox(" + targetGrid.GridId + ")", function (obj) {
      //     if (targetGrid.Options && targetGrid.Options.onCheck && obj.type == "one" && obj.checked) {
      //         targetGrid.Options.onCheck(obj.data.ROWNUM, obj.data);
      //     } else if (targetGrid.Options && targetGrid.Options.onCheckAll && obj.type == "all" && obj.checked) {
      //         targetGrid.Options.onCheckAll(targetGrid.getSelectedRows());
      //     }
      // });
      // if ($EnableConfigGridHead === true&&targetGrid.EnableConfigGridHead==true) {
      //     var configTableName = targetGrid.ConfigTableName||"";
      //     var tableName=targetGrid.ViewTable;
      //     var configGridId = targetGrid.GridId;
      //     $('.layui-table-header').contextmenu(function (e) {
      //         if (e && e.preventDefault) {
      //             e.preventDefault();
      //         } else {
      //             window.event.returnValue = false;
      //         }
      //         if (e.which == 3) {
      //             var html = "<div id=\"grid-head-menu\" class=\"mymenu\" style=\"width: 150px;\"><ul class=\"mymenu_ul\">";
      //             html += "<li  fun=\"openGridConfig\" onclick=\"onGridHeadMenuClick(this,'" + tableName + "','" + configTableName + "','" + configGridId + "');\"><a href=\"javascript:void(0)\"> <i  class=\"fa fa-edit\" ></i>表头配置</a></li></ul></div>";
      //             if ($("#grid-head-menu").length == 0) {
      //                 $("body").append(html);
      //             }
      //             var x = e.pageX;
      //             var y = e.pageY;
      //             $("#grid-head-menu").css({ "top": y + "px", "left": x + "px", "visibility": "visible" });
      //             $("body").bind("click", function onBodyMouseDown(event) {
      //                 $("#grid-head-menu").css({ "visibility": "hidden" });
      //                 $("#grid-head-menu").remove();
      //             });
      //         }
      //     });
      // }
      //  //监听单元格事件
      //  FUI.layuiTable.on("tool(" + targetGrid.GridId + ")", function(obj){
      //    var row = obj.data;
      //    var rowIndex=$(obj.tr.selector).attr("data-index");
      //    var opts = targetGrid.Options;
      //    var afterSaveRowIsRefresh = targetGrid.OperationAfterSaveRowIsRefresh;
      //    var enabledEdite= targetGrid.EnableDblClickEdite;
      //    if(enabledEdite==false){
      //     	return false;
      //    }
      //    	//触发编辑前扩展事件
      //    var canExcute = true;
      //    if (targetGrid.BeforeDblClickEditeEvent) {
      //         var beforeDbClickEvent = targetGrid.BeforeDblClickEditeEvent;
      //         var beforeDbClickEvent = eval(targetGrid.BeforeDblClickEditeEvent);
      //         canExcute = beforeDbClickEvent(row, rowIndex);
      //    }
      //    if (canExcute != true){
      // 	   return false;
      //    }
      //
      //     var primaryKey=targetGrid.IdField;
      //     var primaryValue=row[primaryKey];
      //     var eventString = obj.event;
      //     console.info(eventString);
      //
      //     var json=eval("("+eventString+")");
      //     var editorType=json.editorType;
      //     //对象名，即用户填写的JS对象或者默认的编辑器
      //     var editorName=json.editorName;
      //     //编辑器对象
      //     var editorOjb=json.editor;
      //     var required=json.required;
      //     var dataType=json.dataType;
      //     var columnName=json.field;
      //     var columnTitle=json.title;
      //     var theValue = row[columnName]||"";
      //     theValue = theValue.toString();
      //     if(dataType=="bit"||dataType=="bool"){
      // 	   return false;
      //     }
      //
      //     json.mainTable = targetGrid.MainTable;
      //     json.viewTable = targetGrid.ViewTable;
      //     json.idField = primaryKey;
      //     json.primaryValue=primaryValue;
      //     json.fieldName=columnName;
      //     json.fieldValue=theValue;
      //     json.operationBeforeSaveRowEvent=targetGrid.OperationBeforeSaveRowEvent;
      //     json.rowIndex=rowIndex;
      //     json.row=row;
      // 	   FUI.dialog(__webpath+"/workflow/selector/defaultEditor", '修改 ['+ columnTitle+']', json,700, 560, function (objectData, index) {
      // 	       if(objectData.success==false){
      // 	   	       return false;
      // 	       }
      // 	        var fieldName=objectData.fieldName;
      // 		    var fieldValue=objectData.fieldValue;
      //             var updateObj={};
      //    	    	updateObj[fieldName]=fieldValue;
      //
      //             obj.update(updateObj);
      //             if(targetGrid.OperationBeforeSaveRowEvent){
      //             	targetGrid.Reload();
      //             }
      //             layer.close(index);
      // 	    }, true);
      //   });
      //
      // var searchId = targetGrid.ToolbarID + '_SearchArea';
      // //字段排序事件
      // FUI.layuiTable.on("sort(" + targetGrid.GridId + ")", function (obj) {
      // 	 var parm ={};
      // 	if (targetGrid.ShowSearch == true) {
      //       parm = FUI.DataGridSearchData(searchId);
      // 	}
      // 	if(obj.type==undefined||obj.type==null){
      // 		obj.type="desc";
      // 	}
      //     parm.order = obj.type;
      //     parm.sort = obj.field;
      //     FUI.layuiTable.reload("" + targetGrid.GridId + "", {
      //         initSort: obj,
      //        where: parm
      //     });
      // });

      return targetGrid;
    }
  };
  //================DataGrid创建结束======================//

  //================DataGrid 表头格式化开始======================//

  // 设置Grid主键标识,和管理列所在字段，无管理列则取主键列为 管理列
  function setGridFieldId(targetGrid, columns) {
    var idField = targetGrid.IdField;
    var idDbField = targetGrid.IdDbField;
    var colManageField = targetGrid.ColManageField;
    if (targetGrid.ColManageField == '' || targetGrid.IdField == '') {
      a: for (ob in columns) {
        var columnArr = columns[ob];
        for (index in columnArr) {
          if (columnArr[index].isPK) {
            if (idField == '') {
              idField = columnArr[index].field;
            }
            if (idDbField == '') {
              idDbField = columnArr[index].dbField;
            }

          }

          if (columnArr[index].field == 'ColManage') {
            if (colManageField == '') {
              colManageField = columnArr[index].field;
            }
          }
          if (colManageField != '' && idField != '') {
            break a;
          }
        }
      }
    }

    if (targetGrid.IdField == '') {
      targetGrid.IdField = idField;
      if (targetGrid.SortName == '') {
        targetGrid.SortName = idField;
      }
    }
    if (targetGrid.IdDbField == '') {
      targetGrid.IdDbField = idDbField;
    }

    if (targetGrid.IdField == '') {
      console.info('注意：当前Grid列表缺少主键列配置');
    }
    if (colManageField == '') {
      colManageField = idField;
    }
    if (targetGrid.ColManageField == '') {
      targetGrid.ColManageField = colManageField;
    }

  }


  //对默认表头进行处理分组。
  function formatHeader(targetGrid, columns, type) {
    if (columns == null || columns.length == 0) {
      return null;
    }
    var tempColumns = [];

    //combobox的查询条件
    var _post_combox_data = new Array();

    // 管理列所有字段，默认colManage，否则为Grid主键标识列
    var colManageField = targetGrid.ColManageField;
    var columnsTitle = targetGrid.ColumnsTitle;
    for (var i = 0, len = columns.length; i < len; i++) {
      //var coldef = columns[i];
      //处理 个性化标题表头  ColumnsTitle
      if (targetGrid.ColumnsTitle && columnsTitle.length > 0) {
        $.each(targetGrid.ColumnsTitle, function (i, itemTitle) {
          return false;
          if (columns[i].field.toLowerCase() == itemTitle.field.toLowerCase()) {
            columns[i].title = itemTitle.title;
          }
        });
      }
      if (columns[i].sortable != undefined && columns[i].sortable != null) {
        columns[i]['sort'] = columns[i].sortable;
      }

      if (columns[i].formatter) {
        columns[i]['templet'] = columns[i].formatter;
      } else {
        delete columns[i].formatter;
      }

      if (targetGrid.HidColumns && targetGrid.HidColumns.length > 0) {
        $.each(targetGrid.HidColumns, function (index, hideField) {
          if (hideField == columns[i].field) {
            columns[i].hidden = true;
          }
        });
      }
      if (columns[i].hidden == true) {
        columns[i]['visible'] = false;
      }
      //主键列放在最后一列，通过运行时修改它的排序号是最大,在后台Java中修改
      // if ((columns[i].Frozen == 1 || columns[i].frozen == true)&&!columns[i].isPK&&columns[i].field!=colManageField) {
      //   columns[i]['fixed'] = 'left';

      // }
      //操作列放最左时
      if (columns[i].Frozen == 1 || columns[i].frozen == true) {
        columns[i]['fixed'] = 'left';
      }

      if (columns[i].width == -1) {
        columns[i].width = null;
      } else if (columns[i].width < -1) {
        //最小宽度适应
        columns[i].minWidth = columns[i].width;
      } else {
        columns[i].width = parseInt(columns[i].width * 1.4);
      }
      if (targetGrid.EnableDblClickEdite == false) {
        columns[i].edit = false;
      }
      columns[i].enableEdit = false;
      if (columns[i].edit == true) {
        //由于layui默认就是使用edit来并开行内的text输入框，这里不使用它的默认规则改用enableEidt
        columns[i].enableEdit = true;
        //columns[i].edit = false;
      }
      if (i == 0 && targetGrid.isHaveCheckBox == undefined) {
        var checkBoxType = targetGrid.SingleSelect == true ? 'radio' : 'checkbox';
        //复选框
        if (targetGrid.ShowCheckBox && type == 'FrozenGroupColumns') {
          tempColumns.push({
            align: 'center',
            fixed: 'left',
            type: checkBoxType,
            hidden: false,
            width: 35
          });
        } else if (targetGrid.ShowCheckBox) {
          tempColumns.push({
            align: 'center',
            fixed: 'left',
            type: checkBoxType,
            hidden: false,
            width: 35
          });

        }
        //就否加序号列
        if (targetGrid.ShowNumbers && type == 'FrozenGroupColumns') {
          tempColumns.push({
            align: 'center',
            fixed: 'left',
            title: '序号',
            type: 'seq',
            visible: true,
            width: 50
          });
        } else if (targetGrid.ShowNumbers) {
          tempColumns.push({
            align: 'center',
            fixed: 'left',
            title: '序号',
            visible: true,
            type: 'seq',
            width: 50
          });
        }
        targetGrid.isHaveCheckBox = true;
      }
      //取第一个主键列同时作为操作列
      if (columns[i].hidden != true && columns[i].field == colManageField) {
        columns[i].type = 'html';
        columns[i].slots = primaryKeySlots(targetGrid, columns[i].field);
      }

      //formatter处理
      if (columns[i].templet != undefined && columns[i].templet != '' && columns[i].templet != null) {
        if (columns[i].templet.toString().indexOf('#') > -1) {
          //配置字典的翻译
          columns[i].formatter = configFormatter(columns[i].templet.toString().substr(1), columns[i].field);
        } else if (columns[i].templet.toString().indexOf('sqlkey:') > -1) {
          var dataJson = [];
          var formatterSqlkey = columns[i].templet.toString();
          var isExist = false;
          if (FUI.Data.SqlKeyData.length > 0) {
            $.each(FUI.Data.SqlKeyData, function (index, item) {
              if (item.sqkkey == formatterSqlkey) {
                dataJson = item.data;
                isExist = true;
                return false;
              }
            });
          }
          if (isExist == false) {
            //sqlkey翻译：
            dataJson = Object.toAjaxJson(FUI.Handlers.FuiFrameworkHandler, FUI.Method.GetTextValueDataJsonBySqlKey, { sqlkey: columns[i].editor.toString().substr(7) });
            FUI.Data.SqlKeyData.push({ sqkkey: formatterSqlkey, data: dataJson });
          }

          var objectEditor = FUI.Tool.createrComboboxEditor(dataJson);
          columns[i].formatter = editorFormatter(objectEditor, columns[i].field);
        } else {
          try {
            var formatterActor = Object.toIsExitsFunction(columns[i].templet) ? eval(columns[i].templet) : columns[i].templet.toString();
            columns[i].type = 'html';
            columns[i].formatter = typeof (formatterActor) == 'function' ? convertFormatterAdapt(columns[i].field, formatterActor, targetGrid) : targetGrid.$vm[columns[i].templet];
            delete columns[i].templet;

          } catch (err) {
            FUI.Window.showMsg(targetGrid.$vm, 'formatter:' + columns[i].templet + ',有错误，请检查！');
          }
        }
      } else if (columns[i].dataType == 'datetime') {
        columns[i].formatter = dateTimeFormatter(columns[i].field);
      } else if (columns[i].dataType == 'date') {
        columns[i].formatter = dateFormatter(columns[i].field);
      } else if (columns[i].dataType == 'bit' || columns[i].dataType == 'bool') {
        if (columns[i].enableEdit == true) {
          //可编辑开启时直接使用可切换的是否控件
          columns[i].type = 'html';
          columns[i].formatter = convertFormatterAdapt(columns[i].field, boolCheckBoxEditFormatter, targetGrid);
        } else {
          columns[i].type = 'html';
          columns[i].formatter = convertFormatterAdapt(columns[i].field, boolFormatter, targetGrid);
        }

      } else if ((columns[i].templet == '' || columns[i].templet == undefined || columns[i].templet == null) && columns[i].editor != undefined && columns[i].editor != '') {
        //调用Editor的编辑器来翻译
        if (columns[i].editor.toString().indexOf('#') > -1) {
          //配置字典的翻译
          columns[i].formatter = configFormatter(columns[i].editor.toString().substr(1), columns[i].field);

        } else if (columns[i].editor.toString().indexOf('sqlkey:') > -1) {
          var dataJson = [];
          var sqlkey = columns[i].editor.toString();
          var isExist = false;
          if (FUI.Data.SqlKeyData.length > 0) {
            $.each(FUI.Data.SqlKeyData, function (index, item) {
              if (item.sqkkey == sqlkey) {
                dataJson = item.data;
                isExist = true;
                return false;
              }
            });
          }
          if (isExist == false) {
            //sqlkey翻译：
            dataJson = Object.toAjaxJson(FUI.Handlers.FuiFrameworkHandler, FUI.Method.GetTextValueDataJsonBySqlKey, { sqlkey: sqlkey.substr(7) });
            FUI.Data.SqlKeyData.push({ sqkkey: sqlkey, data: dataJson });
          }

          var objectEditor = FUI.Tool.createrComboboxEditor(dataJson);
          columns[i].formatter = editorFormatter(objectEditor, columns[i].field);
        } else {
          //从编辑器的对象中格式化翻译
          try {
            //优先在vue对象中查找编辑器
            var fun = targetGrid.$vm[columns[i].editor];
            var editeActor = null;
            if (fun != undefined) {
              editeActor = fun(columns[i]);
            }
            //如果在vue中没有找到编辑器，则从当前页面中找
            if (fun == undefined) {
              fun = eval(columns[i].editor);
              editeActor = fun;
            }
            if (typeof (editeActor) == 'object') {
              columns[i].formatter = editorFormatter(editeActor, columns[i].field);
            }
          } catch (err) {
            FUI.Window.showMsg(targetGrid.$vm, 'edite:' + columns[i].editor + ',有错误，请检查！');
          }
        }
      }
      //formatter处理结束

      //样式styler formatter处理
      if (columns[i].styler != undefined && columns[i].styler != '' && columns[i].styler != null) {
        var stylerActor = eval(columns[i].styler);
        columns[i].styler = typeof (stylerActor) == 'function' ? stylerActor : null;
      }
      //样式styler formatter处理结束

      //============editor处理=============
      if (columns[i].field != colManageField && columns[i].hidden != true && columns[i].enableEdit == true && columns[i].editor != undefined && columns[i].editor != '' && columns[i].editor != null) {
        var editorName = columns[i].editor.toString();
        if (columns[i].editor.toString().indexOf('#') > -1) {
          var theData = [];
          var configType = columns[i].editor.toString().substr(1);
          for (configTypeIndex in FUI.Data.ConfigTypeData) {
            if (FUI.Data.ConfigTypeData[configTypeIndex].configType == configType) {
              theData = FUI.Data.ConfigTypeData[configTypeIndex].data;
              break;
            }
          }
          var objEditor = {
            type: 'combobox',
            options: { required: columns[i].required, valueField: 'value', textField: 'text', data: theData }
          };
          columns[i].editor = objEditor;
        } else if (columns[i].editor.toString().indexOf('sqlkey:') > -1) {
          //sqlkey翻译：
          var dataJson = Object.toAjaxJson(FUI.Handlers.FuiFrameworkHandler, FUI.Method.GetTextValueDataJsonBySqlKey, { sqlkey: columns[i].editor.toString().substr(7) });
          var objectEditor = FUI.Tool.createrComboboxEditor(dataJson);
          columns[i].editor = objectEditor;
        } else {
          //自定义编辑器
          var fun = Object.toIsExitsFunction(columns[i].editor) ? eval(columns[i].editor) : targetGrid.$vm[columns[i].editor];
          var editeActor = (typeof fun == 'function') ? fun(columns[i]) : (typeof fun == 'object') ? eval(columns[i].editor) : null;
          if (typeof (editeActor) == 'object' && editeActor != null && editeActor != '') {
            editeActor.options.required = columns[i].Required;
            columns[i].editor = editeActor;
          } else {
            columns[i].editor = null;
          }
        }
        if (columns[i].editor) {
          var eventJson = {
            'editorName': editorName,
            'editor': columns[i].editor,
            'editorType': columns[i].editor.type
          };
          eventJson.field = columns[i].field;
          eventJson.title = columns[i].title;
          eventJson.required = columns[i].required;
          columns[i].style = 'cursor: pointer;';
          columns[i].params = eventJson;
        }

      } else if (columns[i].field != colManageField && columns[i].hidden != true && columns[i].enableEdit == true && columns[i].dataType != 'bool' && columns[i].dataType != 'bit') {
        //默认的Editor处理
        var eventJson = { 'editorName': 'default', editor: null };
        eventJson.field = columns[i].field;
        eventJson.title = columns[i].title;
        eventJson.editorType = 'textbox';
        eventJson.required = columns[i].required;
        columns[i].style = 'cursor: pointer;';
        if (columns[i].dataType == 'nvarchar' || columns[i].dataType == 'varchar' || columns[i].dataType == 'char') {
          columns[i].editor = { type: 'textbox', options: { required: columns[i].required } };
          eventJson.dataType = 'string';
        } else if (columns[i].dataType == 'float' || columns[i].dataType == 'double' || columns[i].dataType == 'decimal') {
          columns[i].editor = {
            type: 'textbox',
            options: { required: columns[i].required, validType: 'floatNumber' }
          };
          eventJson.dataType = 'number';
        } else if (columns[i].dataType == 'int' || columns[i].dataType == 'number') {
          columns[i].editor = {
            type: 'textbox',
            options: { required: columns[i].required, validType: 'floatNumber' }
          };
          eventJson.dataType = 'number';
        } else if (columns[i].dataType == 'datetime') {
          columns[i].editor = {
            type: 'datetimebox',
            options: {
              required: columns[i].required,
              validType: 'datetime',
              tip: '请填写yyyy-MM-dd HH:mm:ss格式的日期时间'
            }
          };
          eventJson.dataType = 'datetime';
        } else if (columns[i].dataType == 'date') {
          columns[i].editor = {
            type: 'datebox',
            options: { required: columns[i].required, validType: 'date', tip: '请填写yyyy-MM-dd格式的日期' }
          };
          eventJson.dataType = 'date';
        } else {
          columns[i].editor = { type: 'textbox', options: { required: columns[i].required } };
          eventJson.dataType = 'string';
        }
        eventJson.editor = columns[i].editor;
        columns[i].params = eventJson;
      }
      //editor处理结束

      tempColumns.push(columns[i]);
    }

    return tempColumns;

  }

  //================DataGrid 表头格式化结束======================//

  //================Editor开始======================//

  //================Editor结束======================//

  //================formatter开始======================//
  function searchParamaterFormatter(value, row, index) {
    var theData = FUI.Data.SearchParamaterEditor.options.data;

    for (theIndex in theData) {
      if (theData[theIndex].value == value) {
        return theData[theIndex].text;
        break;
      }
    }
    if (value == undefined || value == null) return '';
    return value;

  }

  //数据字典翻译
  function configFormatter(configType, field) {
    return function configFormatter(row, column, value, index) {
      var theData = [];
      for (configTypeIndex in FUI.Data.ConfigTypeData) {
        if (FUI.Data.ConfigTypeData[configTypeIndex].configType == configType) {
          theData = FUI.Data.ConfigTypeData[configTypeIndex].data;
          break;
        }
      }
      var isJson = false;
      try {
        var obj = JSON.parse(value);
        if (typeof obj == 'object' && obj) {
          isJson = true;
        } else {
          isJson = false;
        }
      } catch (e) {
        isJson = false;
      }

      if (isJson) {
        var objs = JSON.parse(value).sort();
        var text = [];
        for (objIndex in objs) {
          for (theIndex in theData) {
            if (theData[theIndex].value ==objs[objIndex]) {
              text.push(theData[theIndex].text);
              break;
            }
          }
        }
        return text.toString();
      } else {
        for (theIndex in theData) {
          if (theData[theIndex].value == value) {
            return theData[theIndex].text;
          }
        }
      }
      return value;
    };
  }

  // 格式化函数转换,使其支持formatter(value,row,index)格式化函数
  function convertFormatterAdapt(field, fun, targetGrid) {
    return function formatterAdapt(row, column, value, index) {
      return fun(row[field], row, index, targetGrid, field);
    };
  }

  //编辑器转为格式化函数
  function editorFormatter(editor, field) {
    return function editorFormatter(row, column, value, index) {
      if (value == null) value = '';
      var theData = [];
      if (editor.type != undefined && editor.type != null && editor.type == 'combobox') {
        theData = editor.options.data;
        var valueName = editor.options.valueField || 'value';
        var textName = editor.options.textField || 'text';
        for (theIndex in theData) {
          if (theData[theIndex][valueName] == value) {
            return theData[theIndex][textName];
            break;
          }
        }
      }
      return value;
    };
  }

  function dateTimeFormatter(filed) {
    return function (row, column, value, index) {
      if (value == null || value == '') return '';
      var result = value;
      return Object.toJsonDateTimeFormatter(value);
    };

  }

  function dateFormatter(filed) {
    return function (row, column, value, index) {
      if (value == null || value == '') {
        return '';
      }
      var result = value;
      if (!Object.toIsDateStr(value)) {
        return Object.toJsonDateFormatter(value);
      } else {
        return new Date(result).toDateFormat('yyyy-MM-dd');
      }
      return result;
    };

  }

  function boolFormatter(value, row, index) {
    // if (value == 'true' || value == 1 || value == true) {
    //   return '<span class="cube bg-light ">是</span>';
    // }
    // return '<span class="cube bg-light black">否</span>';

    if (value == 'true' || value == 1 || value == true) {
      return '是';
    }
    return '否';
  }

  function boolCheckBoxFormatter(value, row, index) {
    if (value == 'true' || value == 1 || value == true) {
      return '<input type="checkbox" disabled="disabled" lay-ignore checked="checked"/>';
    }
    return '<input type="checkbox" lay-ignore disabled="disabled"/>';
  }

  function boolCheckBoxEditFormatter(value, row, index, targetGrid, fieldName) {
    var primaryKey = targetGrid.IdField;
    var primaryValue = row[primaryKey];
    var changeObj = {};
    changeObj.mainTable = targetGrid.MainTable;
    changeObj.viewTable = targetGrid.ViewTable;
    changeObj.idField = primaryKey;
    changeObj[primaryKey] = primaryValue;
    if (changeObj.mainTable == "f2bpm_sys_GridConfig" && row.TableName) {
      changeObj.tableName = row.TableName;
    }
    var data = JSON.stringify(changeObj).replace(/\"/g, '\'');
    if (value == 1 || value == '1' || value == true) {
      return '<input data="' + data + '" fieldName=\'' + fieldName + '\' type=\'checkbox\' name=\'' + fieldName + '\'  lay-ignore    value=\'1\' checked onclick="onBoolCheckBoxEditFormatterClick(this);"/>';
    } else {
      return '<input data="' + data + '" fieldName=\'' + fieldName + '\' type=\'checkbox\'  name=\'' + fieldName + '\'   lay-ignore   value=\'0\'  onclick="onBoolCheckBoxEditFormatterClick(this);" />';
    }
  }

  //主键列插槽
  function primaryKeySlots(targetGrid, field) {
    var overrideEditFunction = Object.toGetFunctionName(targetGrid.OperationEditEvent);
    var overrideDeleteFunction = Object.toGetFunctionName(targetGrid.OperationDeleteEvent);
    var overrideViewFunction = Object.toGetFunctionName(targetGrid.OperationViewEvent);
    var overrideSaveRowFunction = Object.toGetFunctionName(targetGrid.OperationSaveRowEvent);

    //操作列befor事件
    var overrideBeforeEditFunction = Object.toGetFunctionName(targetGrid.OperationBeforeEditEvent);
    var overrideBeforeDeleteFunction = Object.toGetFunctionName(targetGrid.OperationBeforeDeleteEvent);
    var overafterDeleteEvent = Object.toGetFunctionName(targetGrid.OperationAfterDeleteEvent);
    var overrideBeforeViewFunction = Object.toGetFunctionName(targetGrid.OperationBeforeViewEvent);
    var overrideBeforeSaveRowFunction = Object.toGetFunctionName(targetGrid.OperationBeforeSaveRowEvent);
    var afterSaveRowIsRefresh = targetGrid.OperationAfterSaveRowIsRefresh;
    var mainTable = targetGrid.MainTable;
    var viewTable = targetGrid.ViewTable;
    var gridId = targetGrid.GridId;
    var slot = {
      // 使用 JSX 渲染函数
      "default": function ({ row, column, index }, h) {
        var value = row[field];
        var custom = [];
        var resultBtns = [];
        if (targetGrid.OperationCustomButton) {
          try {
            custom = targetGrid.OperationCustomButton(h, value, row, index);
          } catch (err) {
            alert(err);
          }
        };
        var btnShowConfig = { 'showEdit': true, 'showView': true, 'showDelete': true };
        //如果配置了权限先执行配置的权限
        if (window.myvm && myvm && myvm.fieldPowers != null && myvm.fieldPowers.hasOwnProperty("default.view") && myvm.fieldPowers["default.view"].isShow === false) {
          btnShowConfig.showView = false;
        }
        if (window.myvm && myvm && myvm.fieldPowers != null && myvm.fieldPowers.hasOwnProperty("default.edit") && myvm.fieldPowers["default.edit"].isShow === false) {
          btnShowConfig.showEdit = false;
        }
        if (window.myvm && myvm && myvm.fieldPowers != null && myvm.fieldPowers.hasOwnProperty("default.delete") && myvm.fieldPowers["default.delete"].isShow === false) {
          btnShowConfig.showDelete = false;
        }
        var funcName = 'extend_OperationShowDefaultButton';
        var fun = targetGrid.$vm[funcName] || window[funcName];
        var isExist = fun != undefined;
        if (isExist) {
          //自定义控制显示按钮
          btnShowConfig = fun(value, row, index);
        }

        var hbtns = [];
        var allbtns = [];
        var firstItem = null;
        if (custom && custom.length > 0) {
          allbtns = custom;
        };
        var itemView = { index: 20, title: '查看', alias: 'View', tip: '查看', class: 'fa fa-search', code: 'default.view', click: () => defaultViewFunction(targetGrid.$vm, value, index, gridId, overrideViewFunction, overrideBeforeViewFunction, row) };
        var itemEdit = { index: 21, title: '编辑', alias: 'Edit', tip: '编辑', class: 'fa fa-edit', code: 'default.edit', click: () => defaultEditFunction(targetGrid.$vm, value, index, gridId, overrideEditFunction, overrideBeforeEditFunction, row) };
        var itemDel = { index: 22, title: '删除', alias: 'Delete', tip: '删除', class: 'fa fa-trash-o', code: 'default.delete', click: () => defaultDeleteFunction(targetGrid.$vm, value, index, gridId, mainTable, targetGrid.IdField, targetGrid.IdDbField, overrideDeleteFunction, overrideBeforeDeleteFunction, overafterDeleteEvent, row) };


        // var itemViewDemo = h('el-dropdown-item', {
        //     attrs: {
        //         btn_code: 'default.view'
        //     },
        //     class: 'fa fa-search',
        //     nativeOn: {
        //         //click: () =>  this.defaultViewFunction可直接访问vue对象的方法
        //         click: () => defaultViewFunction(targetGrid.$vm, value, index, gridId, overrideViewFunction, overrideBeforeViewFunction, row)
        //     }
        // }, ' 查看');

        if (targetGrid.OperationAction.ShowView && btnShowConfig.showView === true) {
          allbtns.push(itemView);
        }
        if (targetGrid.OperationAction.ShowEdit && btnShowConfig.showEdit === true) {
          allbtns.push(itemEdit);
        }
        if (targetGrid.OperationAction.ShowDelete && btnShowConfig.showDelete === true) {
          allbtns.push(itemDel);
        }
        if (allbtns && allbtns.length > 0) {
          $.each(allbtns, function (i, item) {
            if (item.index == undefined) {
              item.index = i;
            }
          });
          allbtns = Object.dataSort(allbtns, 'index');
        }
        if (allbtns && allbtns.length > 0) {
          $.each(allbtns, function (i, item) {
            if (i == 0 && firstItem == null) {
              firstItem = item;
            } else {
              let btn_title = __f2bpmLanguage == 'en-US' ? item.alias : item.title;
              if (btn_title == undefined || btn_title == null) {
                btn_title = item.title;
              }
              var itemBtn = h('el-dropdown-item', {
                attrs: {
                  btn_code: item.code,
                  title: item.tip
                },
                class: item.class + " block minw80",
                nativeOn: { click: item.click }
              }, " " + btn_title);
              hbtns.push(itemBtn);
            }
          });
        };
        var dropMenus = null;
        if (allbtns.length == 1) {
          //取第一个
          let first_title = __f2bpmLanguage == 'en-US' ? firstItem.alias : firstItem.title;
          if (first_title == undefined || first_title == null) {
            first_title = firstItem.title;
          }
          var button = h('el-button',
            {
              props: {
                size: 'mini',
                type: 'text'
              }
              , attrs: {
                btn_code: firstItem.code,
                title: firstItem.tip
              },
              on: {
                click: firstItem.click
              }
            }
            , [
              h("i", { class: 'fa ' + firstItem.class }, " " + first_title)
            ]
          );
          return button;
        } else if (allbtns.length > 1) {
          let first_title = __f2bpmLanguage == 'en-US' ? firstItem.alias : firstItem.title;
          if (first_title == undefined || first_title == null) {
            first_title = firstItem.title;
          }
          dropMenus = h('el-dropdown',
            {
              props: {
                size: 'mini',
                splitButton: true,
                type: 'default'
              }
              , attrs: {
                btn_code: firstItem.code
              },
              on: {
                click: firstItem.click
              }
            }
            , [
              h("i", { class: firstItem.class, attrs: { title: firstItem.tip } }, " " + first_title),
              h('el-dropdown-menu',
                {
                  props: {
                    slot: "dropdown"
                  }
                },
                hbtns
                // [
                //     h('el-dropdown-item', {
                //         attrs: {
                //             btn_code: 'AAA'
                //         }
                //     }, '黄金糕'),
                // ]
              )
            ]
          );
        }
        return dropMenus;
      }
    };
    return slot;
  }

  //================formatter结束======================//

  //********************操作列默认事件函数********************//
  defaultDataGridReload = function ($vm) {
    $vm.dataGridSearch();
  };
  //操作列自定义按钮点击触发
  customButtonClickFunction = function ($vm, clickfunction, value, index, row) {
    //检查是否自定义的重写了before函数事件
    var canExcuteEvent = true;
    if (clickfunction && clickfunction != 'null') {
      var func = typeof clickfunction == 'function' ? clickfunction : $vm[clickfunction];
      func(value, row, index);
    }
    return false;
  };
  defaultViewFunction = function ($vm, value, index, gridId, overrideFunction, overrideBeforeFunction, row) {
    //检查是否自定义的重写了before函数事件
    var canExcuteEvent = true;
    if (overrideBeforeFunction && overrideBeforeFunction != 'null') {
      var overrideMyBeforeFunction = typeof overrideBeforeFunction == 'function' ? overrideBeforeFunction : $vm[overrideBeforeFunction];
      canExcuteEvent = overrideMyBeforeFunction(value, row, index);
    }
    if (canExcuteEvent != true) return false;
    //检查是否自定义的重写函数
    if (overrideFunction && overrideFunction != 'null') {
      var overrideMyFunction = typeof overrideFunction == 'function' ? overrideFunction : $vm[overrideFunction];
      overrideMyFunction(value, row, index);
    }
    return false;
  };
  defaultEditFunction = function ($vm, value, index, gridId, overrideFunction, overrideBeforeFunction, row) {
    //检查是否自定义的重写了before函数事件
    var canExcuteEvent = true;
    if (overrideBeforeFunction && overrideBeforeFunction != 'null') {
      var overrideMyBeforeFunction = typeof overrideBeforeFunction == 'function' ? overrideBeforeFunction : $vm[overrideBeforeFunction];
      canExcuteEvent = overrideMyBeforeFunction(value, row, index);
    }
    if (canExcuteEvent != true) return false;

    //检查是否自定义的重写函数
    if (overrideFunction && overrideFunction != 'null') {
      var overrideMyFunction = typeof overrideFunction == 'function' ? overrideFunction : $vm[overrideFunction];
      overrideMyFunction(value, row, index);
    }
    return false;
  };
  defaultDeleteFunction = function ($vm, value, index, gridId, mainTable, idField, idDbField, overrideFunction, overrideBeforeFunction, afterDeleteEvent, row) {
    //检查是否自定义的重写了before函数事件
    var canExcuteEvent = true;
    if (overrideBeforeFunction && overrideBeforeFunction != 'null') {
      var overrideMyBeforeFunction = typeof overrideBeforeFunction == 'function' ? overrideBeforeFunction : $vm[overrideBeforeFunction];
      canExcuteEvent = overrideMyBeforeFunction(value, row, index);
    }
    if (canExcuteEvent != true) return false;
    //检查是否自定义的重写函数
    if (overrideFunction && overrideFunction != 'null') {
      var overrideMyFunction = typeof overrideFunction == 'function' ? overrideFunction : $vm[overrideFunction];
      overrideMyFunction(value, row, index);
      return false;
    }
    FUI.Window.confirm($vm, '您确定删除所选记录吗？', null, function () {
      //执行默认的删除动作
      var data = _ajaxJson(FUI.Handlers.FuiFrameworkHandler, 'deleteViewTableModel', {
        'mainTable': mainTable,
        'idField': idField,
        'idDbField': idDbField,
        'idFieldValues': value
      });
      if (data.success) {
        defaultQuery($vm);
        if (afterDeleteEvent && afterDeleteEvent != 'null') {
          var afterDeleteEventMyFunction = typeof afterDeleteEvent == 'function' ? afterDeleteEvent : $vm[afterDeleteEvent];
          afterDeleteEventMyFunction(value);
          return false;
        }
        FUI.Window.showMsg2($vm, data.msg, null, 1);
      } else {
        FUI.Window.showMsg($vm, data.msg);
      }
    });
    return false;
  };
  //********************操作列默认事件函数结束********************//

  //********************工具栏默认事件函数********************//

  defaultToolBarBathDeleteFunction = function ($vm) {
    var targetGrid = $vm.dg;
    let gridId = targetGrid.GridId;
    let mainTable = targetGrid.MainTable;
    let idField = targetGrid.IdField;
    let idDbField = targetGrid.IdDbField;
    var overrideBeforeFunction = targetGrid.ToolBarBeforeDeleteEvent;
    var overrideFunction = targetGrid.ToolBarDeleteEvent;

    var idFieldValues = FUI.Grid.getGridChecked($vm, gridId, idField);
    if (idFieldValues == '') {
      FUI.Window.showMsg($vm, '请选择要删除的记录！');
      return false;
    }

    //检查是否自定义的重写了before函数事件
    var canExcuteEvent = true;
    if (overrideBeforeFunction && overrideBeforeFunction != 'null') {
      var overrideMyBeforeFunction = typeof overrideBeforeFunction == 'function' ? overrideBeforeFunction : $vm[overrideBeforeFunction];
      canExcuteEvent = overrideMyBeforeFunction(gridId, mainTable, idField);
    }
    if (canExcuteEvent != true) return false;

    FUI.Window.confirm($vm, '您确定删除所选记录吗？', null, function (r) {
      //检查是否自定义的重写函数
      if (overrideFunction && overrideFunction != 'null') {
        var overrideMyFunction = typeof overrideFunction == 'function' ? overrideFunction : $vm[overrideFunction];
        overrideMyFunction(gridId, mainTable, idField, idFieldValues);
      } else {
        //执行默认的删除动作
        var data = _ajaxJson(FUI.Handlers.FuiFrameworkHandler, 'deleteViewTableModel', {
          mainTable: mainTable,
          idDbField: idDbField,
          idField: idField,
          idFieldValues: idFieldValues
        });
        if (data.success) {
          defaultQuery($vm);
          FUI.Window.showLeftBelowMsg($vm, data.msg);
        } else {
          FUI.Window.showMsg($vm, data.msg);
        }
      }
    });

  };

  defaultToolBarAddFunction = function (gridId, mainTable, idField, overrideFunction) {
    if (overrideFunction && overrideFunction != 'null') {
      var overrideMyFunction = eval(overrideFunction);
      overrideMyFunction(gridId, mainTable, idField);
    } else {

    }
  };
  //********************工具栏默认事件函数********************//

  //******************DataGrid 编辑器相关事件********************

  //更新操作列当，双击编辑时显示出保存与取消按钮
  defaultCancelEditRow = function (gridId, index) {
    $('#' + gridId).datagrid('cancelEdit', index);
  };


  //******************DataGrid 编辑器相关事件********************

  //*****************查询相关********************
  defaultSearchArea = function (areaId) {
    $('#' + areaId).toggle(500);
  };
  defaultResetSearch = function (areaId, grid) {
    areaId = areaId || grid + '_gridSearchContainer';
    defaultClearSearch(areaId);
    defaultQuery(areaId, grid);
  };
  //通用查询
  defaultQuery = function ($vm) {
    $vm.dataGridSearch();
  };
  //收集查询区域参数数据
  defaultCollectSearchAreaData = function (areaId) {
    var tagsData = FUI.DataGridSearchData(areaId);
    return tagsData;
  };
  //清空查询参数
  defaultClearSearch = function (areaId) {
    FUI.DataGridClearSearch(areaId);
  };

  createSearchForm = function (targetGrid) {
    var searchItem = Array();
    var searchHiddenInputList = [];
    var headerData = targetGrid.HeaderData;
    var columns = headerData.columns;
    var frozenColumns = headerData.frozenColumns;
    var frozenGroupColumns = headerData.frozenGroupColumns;
    var groupColumns = headerData.groupColumns;
    if (headerData) {
      for (var i = 0, len = frozenColumns.length; i < len; i++) {
        var myItem = frozenColumns[i];
        if (myItem.search && !myItem.isHiddenInput) {
          searchItem.push(myItem);
        } else if (myItem.search && myItem.isHiddenInput == true) {
          searchHiddenInputList.push(myItem);
        }
      }
      for (var i = 0, len = frozenGroupColumns.length; i < len; i++) {
        var myItem = frozenGroupColumns[i];
        if (myItem.search && !myItem.isHiddenInput) {
          searchItem.push(myItem);
        } else if (myItem.search && myItem.isHiddenInput == true) {
          searchHiddenInputList.push(myItem);
        }
      }
      for (var i = 0, len = columns.length; i < len; i++) {
        var myItem = columns[i];
        if (myItem.search && !myItem.isHiddenInput) {
          searchItem.push(myItem);
        } else if (myItem.search && myItem.isHiddenInput == true) {
          searchHiddenInputList.push(myItem);
        }
      }
      for (var i = 0, len = groupColumns.length; i < len; i++) {
        var myItem = groupColumns[i];
        if (myItem.search && !myItem.isHiddenInput) {
          searchItem.push(myItem);
        } else if (myItem.search && myItem.isHiddenInput == true) {
          searchHiddenInputList.push(myItem);
        }
      }

    }
    //添加自定义的查询输入框
    var customSearchInput = targetGrid.SearchAreaCustomInputJsonArray;
    if (customSearchInput) {
      for (var i in customSearchInput) {
        searchItem.push(customSearchInput[i]);
      }
    }
    //过滤页面自定义隐藏列
    var newSearchItem = [];
    if (targetGrid.HidColumns && targetGrid.HidColumns.length > 0) {
      $.each(targetGrid.HidColumns, function (index, item1) {
        $.each(searchItem, function (index, item2) {
          if (item1 != item2.field) {
            newSearchItem.push(item2);
          }
        });
      });
      searchItem = newSearchItem;
    }
    createSearchHtml(searchItem, searchHiddenInputList, targetGrid);
  };

  createSearchHtml = function (searchItem, searchItemHidden, targetGrid) {
    var gridId = targetGrid.GridId;
    //创建查询区域HTML
    //targetGrid.$vm.tableToolbar.id = targetGrid.ToolbarID;
    if (searchItem.length > 0) {
      //查询区域
      var tableFormItems = [];
      var n = searchItem.length;
      for (i = 0; i < n; i++) {
        var columnEditor = searchItem[i].editor;
        //查询匹配方式like,=,bowteen
        var matchingMode = searchItem[i].searchParamter || '';
        if (typeof (columnEditor) == 'string' && columnEditor.indexOf('#') == -1 && columnEditor.indexOf('sqlkey:') == -1 && columnEditor.indexOf('autokey:') == -1) {
          var fun = targetGrid.$vm[columnEditor];
          var cust_editor = fun && fun(searchItem[i]);
          columnEditor = cust_editor || columnEditor;
          searchItem[i].editor = columnEditor;
        } else if (typeof (columnEditor) == 'string' && columnEditor.indexOf('#') == 0) {
          var theData = [];
          var configType = columnEditor.toString().substr(1);
          for (configTypeIndex in FUI.Data.ConfigTypeData) {
            if (FUI.Data.ConfigTypeData[configTypeIndex].configType == configType) {
              theData = FUI.Data.ConfigTypeData[configTypeIndex].data;
              break;
            }
          }
          var editor = { type: 'combobox', options: { valueField: 'value', textField: 'text', data: theData } };
          columnEditor = editor;
        } else if (typeof (columnEditor) == 'string' && columnEditor.indexOf('sqlkey:') == 0) {
          var dataJson = [];
          var sqlkey = columnEditor.toString();
          var isExist = false;
          if (FUI.Data.SqlKeyData.length > 0) {
            $.each(FUI.Data.SqlKeyData, function (index, item) {
              if (item.sqkkey == sqlkey) {
                dataJson = item.data;
                isExist = true;
                return false;
              }
            });
          }
          if (isExist == false) {
            //sqlkey翻译：
            dataJson = Object.toAjaxJson(FUI.Handlers.FuiFrameworkHandler, FUI.Method.GetTextValueDataJsonBySqlKey, { sqlkey: sqlkey.substr(7) });
            FUI.Data.SqlKeyData.push({ sqkkey: sqlkey, data: dataJson });
          }
          var theData = dataJson;
          var editor = { type: 'combobox', options: { valueField: 'value', textField: 'text', data: theData } };
          columnEditor = editor;
        }
        var dataType = searchItem[i].dataType;
        var searchCombobox = searchItem[i].searchCombobox || null;
        var inputType = undefined;
        if (columnEditor != null && typeof columnEditor == 'object' && columnEditor.type != null) {
          inputType = columnEditor.type;
        } else {
          //默认
          if (dataType == 'bit') {
            inputType = 'bit';
          }
        }
        if (searchCombobox != null && searchCombobox.indexOf("dateformat:") == -1) {
          if (Object.toStartWith(searchCombobox.toString(), 'sqlkey:')) {
            //sqlkey:CB_ConfigType
            var textField = 'text';
            var valueField = 'value';
            var myData = Object.toAjaxJson(FUI.Handlers.FuiFrameworkHandler, FUI.Method.GetTextValueDataJsonBySqlKey, { sqlkey: searchCombobox.toString().substr(7) });
            var selectItem = {
              fieldName: '',
              fieldTitle: '',
              span: 4,
              itemRender: { props: { clearable: true }, name: '$select', options: [] }
            };
            selectItem.fieldName = searchItem[i].field;
            selectItem.fieldAlias = searchItem[i].alias;
            selectItem.fieldTitle = searchItem[i].title;
            var inputclass = "";
            $.each(myData, function (i, item) {
              var v = item[valueField];
              var t = item[textField];
              var op = { value: v, label: t };
              selectItem.itemRender.options.push(op);
            });
            tableFormItems.push(selectItem);

          } else if (Object.toStartWith(searchCombobox.toString(), 'dataServiceKey:')) {
            //dropSelect_category|parm:{'groupKey':'GeneralFieldGroup'}
            var keyStr = searchCombobox.toString();
            var parmObj = {};
            if (searchCombobox.indexOf('|') > -1) {
              var arr = searchCombobox.split('|');
              keyStr = arr[0];
              parmObj = eval('(' + arr[1].replace('parm:', '') + ')');
            }
            var key = keyStr.toString().substr(15);
            parmObj.code = key;

            var textField = 'text';
            var valueField = 'value';
            var myData = Object.toAjaxJson(FUI.Handlers.FuiFrameworkHandler, 'getTextValueDataJsonByDataServiceCode', parmObj);
            var selectItem = {
              fieldName: '',
              fieldTitle: '',
              span: 4,
              itemRender: { props: { clearable: true, textName: 'label' }, name: '$select', options: [] }
            };
            selectItem.fieldName = searchItem[i].field;
            selectItem.fieldAlias = searchItem[i].alias;
            selectItem.fieldTitle = searchItem[i].title;
            $.each(myData, function (i, item) {
              var v = item[valueField];
              var t = item[textField];
              var op = { value: v, label: t };
              selectItem.itemRender.options.push(op);
            });
            tableFormItems.push(selectItem);

          }
          else if (Object.toStartWith(searchCombobox.toString(), 'custom:')) {
            //custom:[{'text':'苹果','value':'apple'}]
            var keyStr = searchCombobox.toString();
            var dataStr = searchCombobox.replace('custom:', "");
            var textField = 'text';
            var valueField = 'value';
            var myData = eval("(" + dataStr + ")");
            var selectItem = {
              fieldName: '',
              fieldTitle: '',
              span: 4,
              itemRender: { props: { clearable: true, textName: 'label' }, name: '$select', options: [] }
            };
            selectItem.fieldName = searchItem[i].field;
            selectItem.fieldAlias = searchItem[i].alias;
            selectItem.fieldTitle = searchItem[i].title;
            $.each(myData, function (i, item) {
              var v = item[valueField];
              var t = item[textField];
              var op = { value: v, label: t };
              selectItem.itemRender.options.push(op);
            });
            tableFormItems.push(selectItem);

          }
          else if (Object.toStartWith(searchCombobox.toString(), 'autokey:')) {
            // autokey:Auto_DataDict|parm:{'isOnFocusToSearch':true}
            var keyStr = searchCombobox.toString();
            var parmStr = '';
            if (searchCombobox.indexOf('|') > -1) {
              var arr = searchCombobox.split('|');
              keyStr = arr[0];
              parmStr = arr[1];
            }
            var autokey = keyStr.toString().substr(8);
            var parm = parmStr != '' ? parmStr.substr(5) : '';
            var selectItem = {
              fieldName: '',
              fieldTitle: '',
              span: 4,
              itemRender: { props: { clearable: true, code: autokey, parm: parm }, name: 'autocompleter', options: [] }
            };
            selectItem.fieldName = searchItem[i].field;
            selectItem.fieldAlias = searchItem[i].alias;
            selectItem.fieldTitle = searchItem[i].title;
            tableFormItems.push(selectItem);

          } else if ( Object.toStartWith(searchCombobox.toString(), 'extend:') || Object.toStartWith(searchCombobox.toString(), '#')) {
            //数据字典
            var theData = [];
            var selectItem = {
              fieldName: '',
              fieldTitle: '',
              span: 4,
              itemRender: { props: { clearable: true, textName: 'text' }, name: '$select', options: [] }
            };
            var configType ="";
            if(Object.toStartWith(searchCombobox.toString(), 'extend:')){
              var json =JSON.parse(searchCombobox.toString().substr(7));
              configType = json.value.substr(1);
              selectItem.itemRender.props.isMultiple=json.isMultiple;
            }else{
              configType = searchCombobox.toString().substr(1);
            }
            
            for (configTypeIndex in FUI.Data.ConfigTypeData) {
              if (FUI.Data.ConfigTypeData[configTypeIndex].configType == configType) {
                theData = FUI.Data.ConfigTypeData[configTypeIndex].data;
                break;
              }
            }
           
            selectItem.fieldName = searchItem[i].field;
            selectItem.fieldAlias = searchItem[i].alias;
            selectItem.fieldTitle = searchItem[i].title;
            var valueField = "value";
            var textField = "text";
            $.each(theData, function (i, item) {
              var v = item[valueField];
              var t = item[textField];
              var op = { value: v, text: t };
              selectItem.itemRender.options.push(op);
            });
            tableFormItems.push(selectItem);

          }
        } else if (inputType == 'combobox') {
          var textField = columnEditor.options.textField;
          var valueField = columnEditor.options.valueField;
          var myData = columnEditor.options.data;
          var selectItem = {
            fieldName: '',
            fieldTitle: '',
            span: 4,
            itemRender: { props: { clearable: true }, name: '$select', options: [] }
          };
          selectItem.fieldName = searchItem[i].field;
          selectItem.fieldAlias = searchItem[i].alias;
          selectItem.fieldTitle = searchItem[i].title;
          $.each(myData, function (i, item) {
            var v = item[valueField];
            var t = item[textField];
            var op = { value: v, label: t };
            selectItem.itemRender.options.push(op);
          });
          tableFormItems.push(selectItem);
        } else if (inputType == 'bit') {
          var myData = [{ 'label': '请选择', 'value': '' }, { 'label': '是', 'value': '1' }, {
            'label': '否',
            'value': '0'
          }];
          var selectItem = {
            fieldName: searchItem[i].field,
            fieldTitle: searchItem[i].title,
            fieldAlias: searchItem[i].alias,
            span: 4,
            itemRender: { name: '$select', options: myData }
          };
          tableFormItems.push(selectItem);
        } else {
          var dateTypeStyle = "";
          if (searchCombobox != null && Object.toStartWith(searchCombobox.toString(), "dateformat:")) {
            //日期的格式化参数：格式化参数请见表单控件
            dateTypeStyle = searchCombobox.toString().substr(11);
          }
          var datetimeItem = {
            fieldName: searchItem[i].field,
            fieldTitle: searchItem[i].title,
            fieldAlias: searchItem[i].alias,
            span: 4,
            itemRender: { name: '$datetime', props: { clearable: true, type: 'date', dateformat: dateTypeStyle } }
          };
          if (targetGrid.IsSimpleSearch) {
            datetimeItem.span = 10;
          }
          switch (dataType) {
            case 'datetime':
              {
                datetimeItem.itemRender.props.type = matchingMode == 'bowteen' ? 'datetimerange' : 'datetime';
              }
              break;
            case 'date':
              {
                datetimeItem.itemRender.props.type = matchingMode == 'bowteen' ? 'daterange' : 'date';
              }
              break;
            default:
              {
                // 区间搜索
                if (matchingMode == 'bowteen') {
                  datetimeItem.itemRender = {
                    name: '$inputBowteen',
                    props: {
                      clearable: true
                    },
                    attrs: {
                      "class": 'aaa'
                    }
                  };
                } else {
                  datetimeItem.itemRender = {
                    name: '$input',
                    props: { clearable: true },
                    attrs: { "class": 'aaa' }
                  };
                }
              }
              break;
          }
          tableFormItems.push(datetimeItem);
        }
      }
      if (searchItemHidden && searchItemHidden.length > 0) {
        $.each(searchItemHidden, function (index, hidenItem) {
          var hiddenItem = {
            fieldName: hidenItem.field,
            fieldTitle: hidenItem.title,
            itemRender: { name: '$hidden', props: {} }
          };
          tableFormItems.push(hiddenItem);
        });
      }
      if (targetGrid.ToolBarDefaultButtons.ShowSearch && targetGrid.IsSimpleSearch === true) {

      }
      let search_btn_title = __f2bpmLanguage == 'en-US' ? "Search" : "查询";
      let reset_btn_title = __f2bpmLanguage == 'en-US' ? "Reset" : "重置";
      let searchTitle = targetGrid.IsSimpleSearch ? "" : search_btn_title;
      let spanNum = targetGrid.IsSimpleSearch ? 2 : 24;
      var searchBtnItem = {
        span: spanNum,
        isSimpleSearch: targetGrid.IsSimpleSearch,
        align: 'center',
        collapseNode: true,
        itemRender: {
          name: '$buttons',
          children: [{
            props: {
              icon: 'fa fa-search',
              type: 'submit',
              content: searchTitle,
              status: 'default'
            }
          }]
        }
      };
      if (targetGrid.ShowReSearchBtn && !targetGrid.IsSimpleSearch) {
        searchBtnItem.itemRender.children.push({ props: { icon: 'fa  fa-undo', type: 'reset', content: reset_btn_title } });
      }
      tableFormItems.push(searchBtnItem);
      //searchtext：搜索的内容
      //searchfields:字段名多个之间使用英文逗号隔开
      var tableFormData = { searchtext: "", searchfields: "" };
      var searchPlaceholder = "";
      var searchNames = [];
      var searchTitles = [];
      $.each(tableFormItems, function (i, item) {
        if (item.fieldName) {
          //搜索字段值设置为空
          tableFormData[item.fieldName] = '';
          //取前两个
          if (i < 2) {
            searchNames.push(item.fieldName);
            if (__f2bpmLanguage == 'en-US') {
              searchTitles.push(item.fieldAlias);
            } else {
              searchTitles.push(item.fieldTitle);
            }
          }
        }
      });
      if (tableFormData.searchfields == "" && searchNames.length > 0) {
        tableFormData.searchfields = searchNames.toString();
        if (__f2bpmLanguage == 'en-US') {
          searchPlaceholder = "Please Enter " + searchTitles.toString() + " To Search";
        } else {
          searchPlaceholder = "请输入" + searchTitles.toString() + "来搜索";
        }

      }
      targetGrid.$vm.tableForm.items = tableFormItems;
      targetGrid.$vm.tableForm.data = tableFormData;
      targetGrid.$vm.tableForm.props.searchPlaceholder = searchPlaceholder;
    }

  };
  createToolbar = function (targetGrid) {
    if (targetGrid.ShowToolbar) {
      var mybtns = [];
      let add_title = "新增";
      let delete_title = "删除";
      if (targetGrid.ToolBarDefaultButtons.ShowAdd) {
        var addbtnItem = {
          code: 'default.add',
          name: add_title,
          alias: 'Add',
          status: 'default',
          icon: 'icon icon-xinzeng',
          attrs: { btn_code: 'default.add' }
        };
        mybtns.push(addbtnItem);
      }

      if (targetGrid.ToolBarDefaultButtons.ShowDelete) {
        var removebtnItem = { code: 'default.delete', name: delete_title, alias: 'Delete', status: 'default', icon: 'fa fa-remove' };
        mybtns.push(removebtnItem);
      }
      if (targetGrid.ToolBarCustomButton) {
        let fun = typeof targetGrid.ToolBarCustomButton == 'function' ? targetGrid.ToolBarCustomButton : targetGrid.$vm[targetGrid.ToolBarCustomButton];
        if (fun) {
          let custBtns = fun();
          $.each(custBtns, function (i, item) {
            mybtns.push(item);
          });
        }
      }
      if (targetGrid.IsSimpleSearch === true) {
        targetGrid.$vm.tableForm.titleWidth = 'auto';
      }
      if (targetGrid.ToolBarCustomButtonAfter) { }
      targetGrid.$vm.tableToolbar.buttons = mybtns;
    }
  };
  //*****************查询相关********************
}(window.jQuery);
var global_datagridHeightDiff = 145;
var global_selector_datagridHeightDiff = 55;
//CheckBox 编辑器
function onBoolCheckBoxEditFormatterClick(thisObj) {
  var isChecked = $(thisObj).is(':checked');
  var thisValue = 0;
  if (isChecked) {
    thisValue = 1;
  }
  var dataStr = $(thisObj).attr('data');
  var fieldName = $(thisObj).attr('fieldName');
  var changeObj = eval('(' + dataStr + ')');
  changeObj[fieldName] = thisValue;
  console.info(changeObj);
  var data = _ajaxJson(FUI.Handlers.FuiFrameworkHandler, 'saveViewTableModel', changeObj);
  if (data.success) {
    //FUI.Window.showLeftBelowMsg(data.msg);
  } else {
    alert(data.msg);
  }
}

//================表头配置====================//
function openGridConfig($vm) {
  var that = $vm;
  var configTableName = that.dg.ConfigTableName || "";
  var tableName = that.dg.ViewTable;
  var configGridId = that.dg.GridId;
  var dataSource = that.dg.DataSource;
  __openGridConfig(tableName, configTableName, configGridId, dataSource);
}

function __openGridConfig(tableName, configTableName, gridId, dataSource) {
  var titleTableName = configTableName || tableName;
  dataSource = dataSource || "";
  FUI.Window.openEdit('/workflow/security/gridConfig/gridConfigList/?dataSource=' + dataSource + '&tableName=' + tableName + '&configTableName=' + configTableName, '配置表头：' + titleTableName, 'Edit', gridId, 1000, 450, null, null, null, true);
}
