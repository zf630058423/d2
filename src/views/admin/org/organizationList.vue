<template>
  <div class="f2bpm-page-layout">
    <el-container>
      <el-main class="f2bpm-page-right">
        <f2bpm-gridsearchform :tableform="tableForm" @searchformbtnclick="searchFormbtnClick" @updatevalue="updateFieldValue" />
        <f2bpm-datagrid ref="grid" grid="grid" height="full-200" :toolbar="tableToolbar" :context-menu="{header: {options: headerMenus},className: 'my-menus'}" :pager-config="tablePage" :data="tableData" :columns="tableColumn" @cell-dblclick="celldbClick" @toolbar-button-click="toolbarButtonClickEvent" @header-contextmenu="contextMenuClickEvent" @page-change="pageChange" @sort-change="sortChange" />
      </el-main>
    </el-container>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        parentId: '',
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
    watch: {
      $route() {
        this.load();
      }
    }, created() {
      this.load();
    },
    mounted() {
      window.myvm = this;
    },

    methods: {
      load() {
        var that = this;
        const parentId = Object.toQueryString('parentId');
        that.parentId = parentId;
        const currUserId = FUI.Sys.getAuthor().userId;
        var dg = FUI.DataGrid.Create(that, 'sys_Organizations', 'sys_Organizations', 'grid', true, true, true);
        dg.SortName = 'OrgOrderNo';
        dg.SortOrder = 'asc';
        dg.ShowNumbers = true;
        dg.ExpansMore = false;
        if (that.parentId) {
          dg.DefaultWhere = Object.toStringFormat("ParentOrgId='{0}' ", parentId);
        }
        dg.ToolBarDefaultButtons.ShowDelete = false;
        dg.ToolBarDefaultButtons.ShowAdd = true;
        dg.OperationAction.ShowView = false;
        dg.EnableDblClickEdite = true;
        dg.ToolBarCustomButton = this.myToolBarCustomButton;
        dg.OperationEditEvent = this.myOperationEditEvent;
        dg.OperationViewEvent = this.myOperationViewEvent;
        dg.OperationDeleteEvent = this.myOperationDeleteEvent;
        dg.EditUrl = __webpath + '/admin/org/organizationEdit?parentId=' + that.parentId;
        dg.EditTitle = '组织';
        dg.Bind();
      },
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
      refreshTree() {
        FUI.Window.refreshParentTree();
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
        FUI.Window.openEdit(that.dg.EditUrl, title, formAction, that.dg.GridId, 700, 550, null, that.dg.MainTable, keyId,null,null,null,true);
      },
      // 工具栏按钮
      myToolBarCustomButton() {
        var btns = [];
        btns.push({ code: 'exportSqlFile', status: 'default', name: '导出SQL', alias: 'Export SQL', icon: 'fa fa-database' });
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
        console.info(code);
      },
      // 导出SQL语句
      exportSqlFile() {
        var that = this;
        var ids = that.dg.getChecked();
        if (ids == '') {
          FUI.Window.showMsg2(that, '请选择要导出的记录！');
          return false;
        }
        Object.toAjaxDownloadFile(FUI.Handlers.AdminHandler, 'org/downloadOrganizationSql', {
          ids: ids
        });
      },
      myOperationDeleteEvent(value, row, index) {
        var that = this;
        var orgId=row.OrgId;
        FUI.Window.confirm('您确定要删除【' + row.OrgName + '】吗', null, function (r) {
          var data = Object.toAjaxJson(FUI.Handlers.AdminHandler, 'deleteOrg', {
            orgId: orgId
          });
          FUI.Window.showMsg2(data.msg, null, data.success ? 1 : 7);
          FUI.Window.refreshParentTree();
          that.dg.Reload();
        });
      }
      , orgLevelFormatter(row, column, value, index) {
        var result = "";
        if (value) {
          var arr = value.split(',');
          $.each(arr, function (index, item) {
            result += "<span class='cube bg-blue mr2'>" + item + "</span>";
          });
        }
        return result;
      }
    }

  }
</script>