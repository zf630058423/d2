<template>
  <div class="f2bpm-page-layout">
    <el-container>
      <el-main class="f2bpm-page-right">
        <f2bpm-gridsearchform  @expandclick="expandClick" :tableform="tableForm" @searchformbtnclick="searchFormbtnClick" @updatevalue="updateFieldValue" />
        <f2bpm-datagrid :expand-search="expandSearch" ref="grid" grid="grid" :toolbar="tableToolbar" :context-menu="{header: {options: headerMenus},className: 'my-menus'}" :pager-config="tablePage" :data="tableData" :columns="tableColumn" @cell-dblclick="celldbClick" @toolbar-button-click="toolbarButtonClickEvent" @header-contextmenu="contextMenuClickEvent" @page-change="pageChange" @sort-change="sortChange" />
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
        return this.isCollapsed ? 'fa fa-angle-double-right' : 'fa fa-angle-double-left';
      },
      positionIcon() {
        return this.isCollapsed ? 'cursor:pointer; position: relative;left: -5px;' : 'cursor:pointer; position: relative;left: 100px;';
      }
    },
    created() {
      var that = this;
      var dg = FUI.DataGrid.Create(that, 'f2bpm_sys_Seal', 'f2bpm_sys_Seal', 'grid', true, true, true);
      dg.SortName = 'CreatedTime';
      dg.SortOrder = 'desc';
      dg.ShowNumbers = true;
      dg.ExpansMore = false;
      dg.ToolBarDefaultButtons.ShowDelete = true;
      dg.ToolBarDefaultButtons.ShowAdd = true;
      dg.OperationAction.ShowView = false;
      dg.EnableDblClickEdite = true;
      dg.OperationEditEvent = this.myOperationEditEvent;
      dg.OperationViewEvent = this.myOperationViewEvent;
      dg.OperationDeleteEvent = this.myOperationDeleteEvent;
      dg.OperationCustomButton = this.myOperationCustomButton;
      dg.EditUrl = FUI.Handlers.SealController + 'sealEdit/';
      dg.EditTitle = '印章';
      dg.Bind();
    },
    mounted() {
      window.myvm = this;
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
        FUI.Window.openEdit(that.dg.EditUrl, title, formAction, that.dg.GridId, 700, 550, null, that.dg.MainTable, keyId);
      },
      // 工具栏按钮
      myToolBarCustomButton() {
        var btns = [];
        // btns.push({code: 'closeEdit', status: 'primary', name: '关闭', icon: 'fa fa-close'});
        // btns.push({code: 'bathSetCategory', status: 'primary', name: '设置分类', icon: 'fa fa-cog'});
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
      // 操作列自定义按钮
      myOperationCustomButton(h, value, row, index) {
        var custBtns = [];
        var item = { index: 40, title: '印章授权', tip: '印章授权', class: 'fa fa-cogs', code: 'cuspublicAuthortom', click: () => this.publicAuthor(value, row.SealTitle, index) };
        custBtns.push(item);
        return custBtns;
      },
      myOperationDeleteEvent(value, row, index) {
        var that = this;
        FUI.Window.confirm('您确定要删除【' + row.SealTitle + '】印章？', null, function () {
          var sealId = row.SealId;
          var result = Object.toAjaxJson(FUI.Handlers.SealController, 'deleteBySealId', {
            sealId: sealId
          });
          if (result.success) {
            FUI.Window.showMsg(result.msg, null, null, function () {
              that.dg.Reload();
            });
          }
        });
      },
      publicAuthor(key, title) {
        var that = this;
        var publicAuthorUrl = FUI.Handlers.PublicAuthorHandler;
        FUI.Window.openEdit(publicAuthorUrl + 'publicAuthorEdit/?authorizeType=Seal&entityKey=' + key, '设置【' + title + '】印章授权', 'Edit', null, 950, 580, null, that.dg.MainTable, key, false);
      }
    }
  }
</script>