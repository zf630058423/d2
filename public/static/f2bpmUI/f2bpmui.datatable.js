/***********F2BPM UI DataGrid********/
//==============================FUI  Grid 快速开发框架==========================================
/**
 *简约的数据表格，是datagrid的极简化版
 * 特点：
 * 1与平台无关
 * 2纯JS实现可运行在任何地址
 * 3无分页
 *Data:2020-06-10
 *author:致博软件科技有限公司版本所有 QQ:f2bpm@f2bpm.com www.f2bpm.com
 */
//==============纯前端的最简单用法一：====================
// <table id='demotable' > </table> ;
// var tableId="demotable";
// var  tableColumn=[ {
//     field : 'title',
//     title : '标题示例',
//     hide : false,
//     align:'center'
// }];
// var data=[{title:"第一行"},{title:"第二行"}];
// var mytable=FUI.DataTable.Create(tableId);
// mytable.Columns=tableColumn;
// mytable.Data=data;
// mytable.Bind();

//支付分组


//=============================================


+function ($) {
  //================DataGrid创建开始======================//
  FUI.DataTable = {
    Create: function (tableId, viewTable, mainTable) {
      //创建DataGrid对象,生成需要的属性
      var targetGrid = new DataTable(tableId, viewTable, mainTable);
      return targetGrid;
      return targetGrid;
    }
  };
  //Grid对象
  function DataTable(tableId, viewTable, mainTable) {
    // vue对象
    this.$vm = null;
    this.Grid = null;
    this.Type = 'datatable';
    this.IdField = '';//如果页面上手动设置了则以页面上为准
    this.IdDbField = '';//如果页面上手动设置了则以页面上为准
    this.ColManageField = '';//如果页面上手动设置了则以页面上为准
    this.TableId = tableId || 'mytable';
    this.Height = 'full-160';
    this.ToolbarID = 'toolbar_' + Math.floor(Math.random() * 10000);
    this.MainTable = mainTable || viewTable;
    this.ViewTable = viewTable;
    this.SortName = null;
    this.SortOrder = 'ASC';
    this.SingleSelect = false;
    this.ShowNumbers = false;
    this.Options = null;
    //获取数据源的URL，如果为null则使用框架自身原理获取数据
    this.Url = null;
    //如果有值则直接从Data中取值
    this.Data = null;
    //强制指定列表数据源,当此值不为null时，会转为从指定的这个数据源中取数据（些数据源不影响表头定义）
    this.DataSource = null;
    //自定义列，当此项不为空时，表示列头由自己处理（注意遵行的列定义格式）
    this.Columns = null;
    //=============================默认查询===============================
    this.DefaultWhere = '';//写法与SQL数据库脚本一样，如：A='111' and b='333'
  }
  DataTable.prototype = {
    //重新获取最新的请求Url，当属性改变时调用此方法将取得最新的请求Url
    getUrl: function () {
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
        requestUrl = requestUrl + 'deforder=' + targetGrid.SortOrder + '&defsort=' + Object.toTrim(targetGrid.SortName) +'&isEnableAuthor='+targetGrid.IsEnableAuthor+ '&defaultWhere=' + encodeURI(targetGrid.DefaultWhere);
      } else {
        requestUrl = FUI.Handlers.FuiFrameworkHandler + 'getViewTableListData/?deforder=' + targetGrid.SortOrder + '&defsort=' + Object.toTrim(targetGrid.SortName) + '&viewTable=' + targetGrid.ViewTable + '&dataSource=' + dataSource + '&configTableName=' + configTableName+'&isEnableAuthor='+targetGrid.IsEnableAuthor + '&defaultWhere=' + encodeURI(targetGrid.DefaultWhere);
      }
      //数据权限过滤标识参数
      if (targetGrid.Filter != null && targetGrid.Filter.AuthorizeType != undefined && targetGrid.Filter.AuthorizeField != undefined) {
        requestUrl = requestUrl + '&filterAuthorizeType=' + targetGrid.Filter.AuthorizeType + '&filterAuthorizeField=' + targetGrid.Filter.AuthorizeField;
      }
      return requestUrl;
    }
    , onCellClick: function (rowIndex, columnIndex, column, row) {
      var targetGrid = this;
    }
    , reload: function (options) {
      var targetGrid = this;
      if (options && options.data) {
        targetGrid.Data = options.data;
      }
      targetGrid.loadData();
    }
    // 根据某个字段实现对json数组的排序
    //data:要排序的数据
    //field:排序的字段
    //isreverse:是否倒序
    , dataSort: function (data, field, reverse) {
      //数组长度小于2 或 没有指定排序字段 或 不是json格式数据
      if (data.length < 2 || !field || typeof data[0] !== "object") return data;
      //数字类型排序
      if (typeof data[0][field] === "number") {
        data.sort(function (x, y) { return x[field] - y[field] });
      }
      //字符串类型排序
      if (typeof data[0][field] === "string") {
        data.sort(function (x, y) { return x[field].localeCompare(y[field]) });
      }
      //倒序
      if (reverse) {
        data.reverse();
      }
      return data;
    }
    , loadData: function () {
      var targetGrid = this;
      var columns = targetGrid.HeaderData.columns;
      //加载数据前先删除所有数据行
      $("#" + targetGrid.TableId).find("tr:gt(0)").remove();
      var html="";
      if (targetGrid.Data && targetGrid.Data.length > 0) {
        if (targetGrid.SortName) {
          targetGrid.Data = targetGrid.dataSort(targetGrid.Data, targetGrid.SortName, targetGrid.SortOrder.toLocaleString() == "desc")
        }
        var tableData = targetGrid.Data;
        if (tableData[0].type && tableData[0].type == "group") {
          var groupData = tableData;
          //带分组的列表
          $.each(groupData, function (index, groupItem) {
            var groupId=groupItem.value;
            var groupHtml= "<tr class=\"group-head "+ groupItem.value + "\">";
            groupHtml +="<td colspan='"+columns.length+"' >"
            groupHtml += "<div class='group-title' onclick=\"f2bpm_datatable_groupClick('"+targetGrid.TableId+"','"+groupItem.value+"')\"><i class='fa fa-cog'></i>" + groupItem.title + "</div>"
            groupHtml +="</td>";
            groupHtml +="</tr>";

            var tData =  targetGrid.dataSort(groupItem.children, targetGrid.SortName, targetGrid.SortOrder.toLocaleString() == "desc") ;
            var thtml = targetGrid.getTrsHtml(columns,tData,groupId,groupItem.classes);
            groupHtml += thtml;
            html+= groupHtml;
          });
          //
        } else {
          //不带分组头时
          html = targetGrid.getTrsHtml(columns,tableData);
        }
        html+="";
        $("#" + targetGrid.TableId).append(html);
      }
    }
    , getTrsHtml: function (columns, tableData,groupId,extendClass) {
      var groupId=groupId||"";
      var groupStr="";
      var classStr="";
      if(groupId!=""){
        groupStr="group='"+groupId+"'";
        classStr= " group-item ";
      }
      if(extendClass){
        classStr+= "act-attribute-default-hide";
      }
      var targetGrid = this;
      var trsHtml="";
      //根据Data获取Table的Html
        $.each(tableData,function(index,row){
          var trHtml="<tr "+groupStr+" class='datatable-data-row; "+classStr+"'>";
          $.each(columns,function(index,col){
              var style="";
              var field=col.field;
              if(col.hide===true){
                  style+=";display:none";
              }
              if(col.align){
                  style+=";text-align:"+col.align;
              }
              var td ="";
              var field= col.field;
              td+="<td field='"+field+"' style='"+style+"'>";
              var cellValue=row[field];
              if(cellValue==undefined){
                  cellValue="";
              }
              var value=col.type=='empty'?"":cellValue;
              if(col.formatter){
                  var fun= targetGrid.$vm?targetGrid.$vm[col.formatter]:col.formatter;
                  value=fun(value,row,index);
              }
              td+=value;
              td+="</td>";
              trHtml+=td;
          });
          trHtml+="</tr>";
          trsHtml+=trHtml;
      });
    
      return trsHtml;
    }
    , Bind: function () {
      var targetGrid = this;
      var opts = targetGrid.Options;
      var showToolbar = targetGrid.ShowToolbar;
      opts = opts || {};
      opts.height = targetGrid.Height;
      var dataSource = targetGrid.DataSource || '';
      var configTableName = targetGrid.ConfigTableName || '';
      var objColumns = null;
      if (targetGrid.Columns != null) {
        var data = {};
        data.columns = targetGrid.Columns || [];
        targetGrid.HeaderData = data;
      } else {
        targetGrid.HeaderData = _ajaxJson(FUI.Handlers.FuiFrameworkHandler, 'getDataGridHeader', {
          viewTable: targetGrid.ViewTable,
          configTableName: configTableName
        });
      }
      var allColumns = targetGrid.HeaderData.columns;
      var requestUrl = targetGrid.getUrl();
      var url = requestUrl;
      var tableObj = $("#" + targetGrid.TableId);
      tableObj.addClass("f2bpm-datatable");

      var headHtml = "<tr class='datatable-header'>";
      $.each(allColumns, function (index, col) {
        var style = "";
        var width = col.width;
        if (width) {
          style += "width:" + width + "px";
        }
        if (col.hide === true) {
          style += ";display:none";
        }
        var th = "";
        th += "<th field='" + col.field + "' style='" + style + "'>";
        th += col.title;
        th += "</th>";
        headHtml += th;
      });
      headHtml += "</tr>";
      tableObj.append(headHtml);

      if (targetGrid.Data && targetGrid.Data.length > 0) {
        targetGrid.loadData();
      }
      return targetGrid;
    }
  };
  //================DataTable创建结束======================//
}(window.jQuery);

function _onVueClickProxy(vueInstName) {

}


 window.f2bpm_datatable_groupClick =function(tableId,groupName){
   $("#"+tableId).find("tr[group='"+groupName+"']").toggle();
}