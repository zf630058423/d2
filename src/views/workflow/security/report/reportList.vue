<template>
  <div class="f2bpm-page-layout">
    <el-container>
      <el-aside ref="sideLeft" class="f2bpm-page-left" hide-trigger collapsible :width="isCollapsed?'20px':'200px'">
        <div class="f2bpm-panel-head">
          <div v-if="!isCollapsed" class="f2bpm-left-search-div">
            <el-input v-model="treeFilterText" class="left-htead-treeFilterText-box" size="small" clearable :placeholder="$t('enterKey')" autocomplete="off" prefix-icon="el-icon-search" />
          </div>
          <div class="f2bpm-left-search-button-div">
            <i v-if="!isCollapsed" :title="$t('refresh')" class="icon icon-shuaxin  cur mr10 font12  " @click="loadTree()"></i>
            <i title="收起/展开" :class="rotateIcon" @click="collapsedSider" />
          </div>
        </div>
        <div v-if="!isCollapsed" class="f2bpm-page-left-content auto-window-height mt5">
          <div class="mytree-cube-box-container">
            <span class="cur  mytree-cube-box " @click="showAll()"><i class="icon icon-quanbu font16"></i> {{$t('all')}}</span>
            <span class="cur  mytree-cube-box" @click="categoryManager('ReportGroup')"><i class="icon icon-fenlei font16"></i> {{$t('category')}}</span>
          </div>
          <el-tree ref="mytree" :data="treeData" :filter-node-method="filterTreeNode" :expand-on-click-node="false" default-expand-all @node-click="onTreeSelected" />
        </div>
      </el-aside>
      <el-main class="f2bpm-page-right">
        <f2bpm-gridsearchform :tableform="tableForm" @expandclick="expandClick" @searchformbtnclick="searchFormbtnClick" @updatevalue="updateFieldValue" />
        <f2bpm-datagrid ref="grid" grid="grid" :toolbar="tableToolbar" :expand-search="expandSearch" :context-menu="{header: {options: headerMenus},className: 'my-menus'}" :pager-config="tablePage" :data="tableData" :columns="tableColumn" @cell-dblclick="celldbClick" @toolbar-button-click="toolbarButtonClickEvent" @header-contextmenu="contextMenuClickEvent" @page-change="pageChange" @sort-change="sortChange" />
      </el-main>
    </el-container>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        expandSearch: "",
        currCategoryCode: '',
        treeFilterText: '',
        isCollapsed: false,
        // ==data grid====
        dg: {},
        tablePage: Object.toClone(FUI.DataGridProperty.tablePage),
        loading: false,
        treeData: [],
        tableData: [],
        tableForm: Object.toClone(FUI.DataGridProperty.tableForm),
        tableToolbar: Object.toClone(FUI.DataGridProperty.tableToolbar),
        headerMenus: FUI.DataGridProperty.headerMenus,
        tableColumn: [],
        // ===========SqlKey==========
        sqlkeyArray: [{
          // dataField: 'groupKeyData',
          // sqlkey: 'CB_CategoryGroup',
          // parm: null,
          // flag: null,
          // change: null
        }],
        // ===========标准区结束==========
        searchParams: {
          // 特殊查询
        }
      };
    },
    computed: {
      countGridHeight() {
        return $(document).height() - global_datagridHeightDiff;
      },
      rotateIcon() {
        return this.isCollapsed ? 'icon icon-arrow-right-bold cur' : 'icon icon-arrow-left-bold cur';
      },
      positionIcon() {
        return this.isCollapsed ? 'cursor:pointer; position: relative;left: -5px;' : 'cursor:pointer; position: relative;left: 100px;';
      }
    },
    created() {
      var that = this;
      var dg = FUI.DataGrid.Create(that, 'f2bpm_sys_Report', 'f2bpm_sys_Report', 'grid', true, true, true);
      dg.SortName = 'ReportCode';
      dg.SortOrder = 'asc';
      dg.ShowNumbers = true;
      dg.ExpansMore = false;
      dg.ToolBarDefaultButtons.ShowDelete = false;
      dg.ToolBarDefaultButtons.ShowAdd = true;
      dg.OperationAction.ShowView = false;
      dg.EnableDblClickEdite = true;
      dg.ToolBarCustomButton = that.myToolBarCustomButton;
      dg.OperationEditEvent = this.myOperationEditEvent;
      dg.OperationViewEvent = this.myOperationViewEvent;
      dg.OperationCustomButton = this.myOperationCustomButton;
      dg.OperationDeleteEvent = this.myOptionDelete;
      dg.EditUrl = '/workflow/security/report/reportEdit/';
      dg.EditTitle = '图表设计';
      dg.Bind();
      that.loadTree();
    },
    mounted() {
      window.myvm = this;
      window.autoPageHeight();
    },

    methods: {
      collapsedSider() {
        this.isCollapsed = !this.isCollapsed;
      },
      filterTreeNode(value, data) {
        if (!value) return true;
        return data.title.indexOf(value) !== -1;
      },
      showAll() {
        this.searchParams.CategoryCode = '';
        this.dataGridSearch();
      },
      loadTree() {
        var that = this;
        var treeUrl = FUI.Handlers.CategoryHandler + '?groupKey=ReportGroup';
        Object.toAjaxJson(treeUrl, null, null, true, null, function (res) {
          if (res.success) {
            that.treeData = res.data;
            var msg = res.msg;
          } else {
            FUI.Window.showMsg(that, res.msg);
          }
        });
      },
      onTreeSelected(data, treeNode, thisObj) {
        this.currCategoryCode = treeNode.data.id;
        this.searchParams.CategoryCode = this.currCategoryCode;
        this.dataGridSearch();
      },
      pageChange({ currentPage, pageSize }) {
        this.tablePage.currentPage = currentPage;
        this.tablePage.pageSize = pageSize;
        this.tablePage.startIndex = (currentPage - 1) * pageSize;
        this.getGridData();
      },
      // 刷新列表
      refreshGrid(parentGridId, parm) {
        var that = this;
        that.dataGridSearch();
      },
      dataGridReSet() {
        var that = this;
        $.each(this.searchParams, function (key, item) {
          that.searchParams[key] = '';
        });
        that.searchParams.historyVersion = 'false';
        // 重置查询
        this.dataGridSearch();
      },
      dataGridSearch() {
        this.tablePage.currentPage = 1;
        this.tablePage.startIndex = 0;
        this.getGridData();
      },
      getGridData() {
        const that = this;
        let parm = Object.toClone(that.tableForm.data);
        parm.page = that.tablePage.currentPage;
        parm.rows = that.tablePage.pageSize;
        parm.sort = that.tablePage.sort;
        parm.order = that.tablePage.order;
        parm = Object.extend(parm, that.searchParams);
        Object.toAjaxJson(that.dg.GetUrl(), null, parm, true, null, function (res) {
          if (res.success) {
            that.tableData = res.rows;
            that.tablePage.total = res.total;
            that.tablePage.pageCount = res.pageCount;
          } else {
            that.$message.error(res.msg, { duration: 0 });
          }
        });
      },
      // ====stand:标准方法控制结束==============
      myOperationViewEvent(value, row, index) {
        this.showDialogEdit(FUI.FormAction.View, row[this.dg.IdField]);
      },
      myOperationEditEvent(value, row, index) {
        this.showDialogEdit(FUI.FormAction.Edit, row[this.dg.IdField]);
      },
      showDialogEdit(formAction, keyId) {
        var that = this;
        var title = formAction == FUI.FormAction.Add ? '新增' + that.dg.EditTitle : '编辑' + that.dg.EditTitle;
        FUI.Window.openEdit(that.dg.EditUrl, title, formAction, that.dg.GridId, 700, 550, null, that.dg.MainTable, keyId, true);
      },
      myOptionDelete(value, row, index) {
        var that = this;
        if (row.IsSystem == 1) {
          FUI.Window.showMsg('不可删除系统预定义的图表');
          return false;
        }
        var msg = '您确定要删除【' + row.ReportName + '】？';
        FUI.Window.confirm(that, msg, '删除提示', function (r) {
          var data = null;
          data = Object.toAjaxJson(FUI.Handlers.Report, 'delete', {
            id: value
          }, false);
          if (data.success == false) {
            FUI.Window.showMsg(that, data.msg);
            return true;
          } else {
            that.refreshGrid();
            FUI.Window.showMsg2(that, data.msg);
          }
        });
        return false;
      },

      // 操作列自定义按钮
      myOperationCustomButton(h, value, row, index) {
        var that = this;
        var custBtns = [];
        var item = { index: 1, title: '图表设计', alias: 'Graphic Design', tip: '图表设计', class: 'fa fa-bar-chart-o', code: 'reportDesigner', click: () => this.reportDesigner(value, row, index) };
        var item2 = { index: 2, title: '查看图表', alias: 'View Chart', tip: '查看图表', class: 'fa fa-search', code: 'reportView', click: () => this.reportView(value, row, index) };
        var item3 = { index: 3, title: '导出图表设计', alias: 'Export', tip: '导出图表设计', class: 'fa fa-download', code: 'reportView', click: () => this.download(value, row, index) };
        var item4 = { index: 4, title: '添加到菜单', alias: 'Add To Sys Menus', tip: '添加到菜单', class: 'fa fa-cubes', code: 'addToSystemResource', click: () => this.addToSystemResource(value, row, index) };

        custBtns.push(item);
        custBtns.push(item2);
        custBtns.push(item3);
        custBtns.push(item4);
        return custBtns;
      },
      // 工具栏按钮
      myToolBarCustomButton() {
        var btns = [];
        btns.push({ code: 'copyAdd', status: 'default', name: '复制新增', alias: 'Copy', icon: 'fa fa-clipboard' });
        btns.push({ code: 'importReportXml', status: 'default', name: '导入图表设计', alias: 'Import', icon: 'fa fa-upload' });
        return btns;
      },
      // 工具栏按钮事件
      toolbarButtonClickEvent({ code }, event) {
        const that = this;
        if (code == 'closeEdit') {
          FUI.Window.closeEdit(); gridConfigList;
        } else if (code == 'default.add') {
          that.showDialogEdit(FUI.FormAction.Add, '');
        } else if (code == 'default.delete') {
          // 批量删除，默认执行FUI内部的删除，如有需要可用成自己的删除方法
          that.dg.ToolBarBathDelete(that);
        } else {
          var fn = that[code];
          fn();
        }
      },
      copyAdd() {
        const that = this;
        var ids = that.dg.getChecked();
        if (ids == '') {
          FUI.Window.showMsg(that, '请选择要复制的行！');
          return false;
        }
        var arr = ids.split(',');
        if (arr.length > 1) {
          FUI.Window.showMsg(that, '只能选择一条要复制的数据！');
          return false;
        }
        var data = Object.toAjaxJson('/workflow/security/report/', 'copyAdd', { 'id': ids });
        if (data.success) {
          that.dg.Reload();
          FUI.Window.showMsg2(that, data.msg, null, 1);
        } else {
          FUI.Window.showMsg(data.msg);
        }
      },
      dataSourceFormatter(row, col, value, index) {
        var result = value;
        switch (value.toString()) {
          case 'processform':
            result = '表单应用';
            break;
          case 'tableview':
            result = '表或视图';
            break;
          case 'sql':
            result = 'SQL';
            break;
        }
        return result;
      },
      rportTypeFormatter(row, col, value, index) {
        var result = value;
        switch (value.toString()) {
          case 'column':
            result = '柱状图';
            break;
          case 'line':
            result = '折线图';
            break;
          case 'bar':
            result = '条形图';
            break;
          case 'pie':
            result = '饼图';
            break;
          case 'funnel':
            result = '漏斗图';
            break;
          case 'area':
            result = '堆叠图';
            break;
          case 'radar':
            result = '雷达图';
            break;
          case 'table':
            result = '表格列表';
            break;
          case 'totalnum':
            result = '总数统计';
            break;
        }
        return result;
      },
      reportDesigner(value, row, index) {
        var that = this;
        var url = __webpath + '/workflow/security/report/reportDesigner/';
        FUI.Window.open(url + '?reportId=' + value);
      },
      reportView(value, row, index) {
        var that = this;
        var reportCode = row.ReportCode;
        var ReportName = row.ReportName;
        var url = __webpath + '/workflow/security/report/reportView/';
        FUI.Window.openEdit(url + '?reportCode=' + reportCode, ReportName, null, null, null, null, null, null, null, true);
      },
      download(value) {
        var that = this;
        var data = Object.toAjaxDownloadFile(FUI.Handlers.Report, 'downLoadReportXml', {
          id: value
        });
      },
      addToSystemResource(value, row, index) {
        var that = this;
        Sys.SelectorDialog.selectResourceCallBack(function (data, index) {
          if (data) {
            var parentId = data[0].id;
            var title = row.ReportName;
            var reportCode = row.ReportCode;
            var sysMenu = '/workflow/security/report/reportView/?reportCode=' + reportCode;
            var res = Object.toAjaxJson('/admin/resource/', 'saveSample', {
              'resourceId': reportCode,
              'parentId': parentId,
              'name': title,
              'functionUrl': sysMenu
            });
            FUI.Window.showMsg(that, res.msg, null, res.success == true ? 1 : 7);
          }
        });
      },
      categoryManager(groupKey) {
        var that = this;
        var url = '/workflow/security/category/categoryList_bygroupKey?groupKey=' + groupKey;
        var title = "分类管理";
        FUI.Window.openEdit(url, title, "Edit", "grid", 700, 500, null, "", "", true);
      },
      importReportXml() {
        FUI.Window.openEdit(__webpath + '/workflow/security/report/reportImport', '导入图表设计', FUI.FormAction.Edit, '', 550, 380);
      }
    }
  }
</script>