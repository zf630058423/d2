<template>
  <div class="f2bpm-page-layout">
    <el-container>
      <el-main class="f2bpm-page-right">
        <f2bpm-gridsearchform :tableform="tableForm" @searchformbtnclick="searchFormbtnClick" @updatevalue="updateFieldValue" />
        <f2bpm-datagrid ref="grid" grid="grid" :toolbar="tableToolbar" :context-menu="{header: {options: headerMenus},className: 'my-menus'}" :pager-config="tablePage" :data="tableData" :columns="tableColumn" @cell-dblclick="celldbClick" @toolbar-button-click="toolbarButtonClickEvent" @header-contextmenu="contextMenuClickEvent" @page-change="pageChange" @sort-change="sortChange" />
      </el-main>
    </el-container>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        // ======stand:标准区=============
        id: '',
        defaultWhereStr: '',
        getDataUrl: '',

        treeFilterText: '',
        isCollapsed: false,
        // ==data grid====
        config: {},
        dg: {},
        tablePage: Object.toClone(FUI.DataGridProperty.tablePage),
        loading: false,
        treeData: [],
        tableData: [],
        tableForm: Object.toClone(FUI.DataGridProperty.tableForm),
        tableToolbar: Object.toClone(FUI.DataGridProperty.tableToolbar),
        headerMenus: FUI.DataGridProperty.headerMenus,
        tableColumn: [],
        // ===========标准区结束==========
        searchParams: {

        }
      };
    },
    computed: {
      countGridHeight() {
        return $(window).height() - 10;
      },
      rotateIcon() {
        return this.isCollapsed ? 'icon icon-arrow-right-bold cur' : 'icon icon-arrow-left-bold cur';
      }
    },
    created() {
      var that = this;
      that.loadCustomConfig();

      var dg = FUI.DataGrid.Create(that, that.config.objName, 'none', 'grid', true, true, true);
      dg.DBCode = that.config.dBSource;
      dg.ColManageField = 'ColManageField';
      // 表头定义名
      dg.ConfigTableName = 'CustDialog_' + that.config.code;
      if (that.config.sortName != '') {
        dg.SortName = that.config.sortName;
        dg.SortOrder = that.config.sortOrder;
      }
      // 默认的条件
      if (that.config.divideSql != '') {
        dg.DefaultWhere = that.config.divideSql||"";
      }
      dg.ToolBarCustomButton = that.myToolBarCustomButton;
      dg.ToolBarDefaultButtons.ShowDelete = false;
      dg.ToolBarDefaultButtons.ShowAdd = false;
      dg.OperationAction.ShowView = false;
      dg.OperationAction.ShowEdit = false;
      dg.OperationAction.ShowDelete = false;
      dg.EditWidth = 750;
      dg.EditHeight = 500;
      dg.Bind();
    },
    mounted() {
      window.myvm = this;
    },

    methods: {
      collapsedSider() {
        this.isCollapsed = !this.isCollapsed;
      },
      loadCustomConfig() {
        var that = this;
        var id = Object.toQueryString('id');
        var parm = { 'isSetHead': true, 'id': id };
        that.id = id;
        var res = Object.toAjaxJson(FUI.Handlers.CustomDialogHandler, 'getCustomDialogModelJson', parm);
        var configModel = res.data;
        that.config = configModel;
      },

      pageChange({ currentPage, pageSize }) {
        this.tablePage.currentPage = currentPage;
        this.tablePage.pageSize = pageSize;
        this.tablePage.startIndex = (currentPage - 1) * pageSize;
        this.getGridData();
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
      // 刷新列表
      refreshGrid(parentGridId, parm) {
        var that = this;
        that.dataGridSearch();
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
            FUI.Window.showMsg(that, res.msg);
          }
        });
      },
      // 工具栏按钮
      myToolBarCustomButton() {
        var btns = [];
        btns.push({ code: 'configResultField', type: 'primary', name: '设置返回值字段', icon: 'fa fa-bars' });
        btns.push({ code: 'closeEdit', type: 'primary', name: '关闭', icon: 'fa fa-minus-circle' });
        return btns;
      },
      // 工具栏按钮事件
      toolbarButtonClickEvent({ code }, event) {
        const that = this;
        if (code == 'closeEdit') {
          FUI.Window.closeEdit();
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
      configResultField() {
        var that = this;
        FUI.Window.openEdit('/workflow/customDialog/settingResultField/?id=' + that.id, '设置返回值字段', 'Edit', that.dg.GridId, that.dg.EditWidth, that.dg.EditHeight, null, null, null, false);
      }
    }
  }
</script>