<template>
  <div class="f2bpm-page-layout">
    <el-container>
      <el-main class="f2bpm-page-right">
        <f2bpm-gridsearchform   @expandclick="expandClick" :tableform="tableForm" @searchformbtnclick="searchFormbtnClick" @updatevalue="updateFieldValue">
        </f2bpm-gridsearchform>
        <f2bpm-datagrid ref="grid" grid="grid" :expand-search="expandSearch"  @cell-dblclick="celldbClick" :toolbar="tableToolbar" @toolbar-button-click="toolbarButtonClickEvent" :context-menu="{header: {options: headerMenus},className: 'my-menus'}" @header-contextmenu="contextMenuClickEvent" :pager-config="tablePage" :data="tableData" :columns="tableColumn" @page-change="pageChange" @sort-change="sortChange">
        </f2bpm-datagrid>
      </el-main>
    </el-container>
  </div>
</template>

<script>
  export default {
    created() {
      var that = this;
      var dg = FUI.DataGrid.Create(that, 'f2bpm_sys_code_generator', 'f2bpm_sys_code_generator', 'grid', true, true, true);
      dg.SortName = "createdTime";
      dg.SortOrder = 'desc';
      dg.ShowNumbers = true;
      dg.ExpansMore = true;
      dg.ToolBarDefaultButtons.ShowDelete = true;
      dg.ToolBarDefaultButtons.ShowAdd = true;
      dg.OperationAction.ShowView = false;
      dg.EnableDblClickEdite = true;
      dg.ToolBarCustomButton = that.myToolBarCustomButton;
      dg.OperationEditEvent = this.myOperationEditEvent;
      dg.OperationViewEvent = this.myOperationViewEvent;
      dg.OperationDeleteEvent = this.myOperationDeleteEvent;
      dg.OperationCustomButton = this.myOperationCustomButton;
      dg.EditUrl = "/admin/codeGenerator/codeGeneratorEdit/";
      dg.EditTitle = "编辑";
      dg.Bind();
    },

    data() {
      return {
        expandSearch: "",
        treeFilterText: '',
        isCollapsed: false,
        //==data grid====
        dg: {},
        tablePage: Object.toClone(FUI.DataGridProperty.tablePage),
        loading: false,
        treeData: [],
        tableData: [],
        tableForm: Object.toClone(FUI.DataGridProperty.tableForm),
        tableToolbar: Object.toClone(FUI.DataGridProperty.tableToolbar),
        headerMenus: FUI.DataGridProperty.headerMenus,
        tableColumn: [],
        searchParams: {
          //特殊查询
        }
      };
    },

    methods: {
      collapsedSider() {
        this.isCollapsed = this.isCollapsed ? false : true;
      },
      filterTreeNode(value, data) {
        if (!value) return true;
        return data.title.indexOf(value) !== -1;
      },
      refreshTree() {
        var that = this;
      },
      //刷新列表
      refreshGrid(parentGridId, parm) {
        var that = this;
        that.dataGridSearch();
      }
      , showAll() {
        this.dataGridSearch();
      },
      onTreeSelected(data, treeNode, thisObj) {
        var that = this;
        var id = treeNode.data.id;
        this.searchParams.xxxxx = id;
        that.dataGridSearch();
      },
      dataGridReSet() {
        var that = this;
        $.each(this.searchParams, function (key, item) {
          that.searchParams[key] = '';
        });
        //重置查询
        this.dataGridSearch();
      },
      dataGridSearch() {
        this.tablePage.currentPage = 1;
        this.tablePage.startIndex = 0;
        this.getGridData();
      },
      getGridData() {
        let that = this;
        let parm = Object.toClone(that.tableForm.data);
        parm.page = that.tablePage.currentPage;
        parm.rows = that.tablePage.pageSize;
        parm.sort = that.tablePage.sort;
        parm.order = that.tablePage.order;
        parm = Object.extend(parm, that.searchParams);
        Object.toAjaxJson(that.dg.GetUrl(), null, parm, true, null, function (
          res
        ) {
          if (res.success) {
            that.tableData = res.rows;
            that.tablePage.total = res.total;
            that.tablePage.pageCount = res.pageCount;
          } else {
            FUI.Window.showMsg(res.msg);
          }
        });
      },
      myOperationDeleteEvent(value, row, index) {
        var that = this;
        FUI.Window.confirm("您确定要删除【" + row.genTitle + "】", null, function () {
          var data = Object.toAjaxJson('/admin/codeGenerator/', 'delete', { 'id': row.id });
          if (data.success) {
            that.dg.Reload();
            FUI.Window.showMsg2(that, data.msg, null, 1);
          } else {
            FUI.Window.showMsg(data.msg);
          }
        });
      },
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
      //工具栏按钮
      myToolBarCustomButton() {
        var btns = [];
        btns.push({ code: 'copyAdd', status: 'default', name: '复制新增(含字段)', alias: 'Copy(contains fields)', icon: 'fa fa-clipboard' });
        btns.push({ code: 'copyBaseAdd', status: 'default', name: '复制新增(不含字段)', alias: 'Copy(no fields)', icon: 'fa fa-clipboard' });
        return btns;
      },
      //工具栏按钮事件
      toolbarButtonClickEvent({ btn }, event) {
        let code = btn.code;
        console.info(code);
        let that = this;
        if (code == 'closeEdit') {
          FUI.Window.closeEdit();
        } else if (code == 'default.add') {
          that.showDialogEdit(FUI.FormAction.Add, '');
        } else if (code == 'default.delete') {
          //批量删除，默认执行FUI内部的删除，如有需要可用成自己的删除方法
          that.dg.ToolBarBathDelete(that);
        } else {
          var fn = that[code];
          fn();
        }
      },
      //操作列自定义按钮
      myOperationCustomButton(h, value, row, index) {
        var that = this;
        var custBtns = [];
        var item = { title: '字段定义', tip: '字段定义', alias: 'Field Def', class: 'fa fa-table', code: 'opTableColumn', click: () => this.opTableColumn(value, row, index) };
        custBtns.push(item);
        return custBtns;
      }
      , copyAdd(isOnlyCopyBase) {
        if (isOnlyCopyBase == undefined) {
          isOnlyCopyBase = false;
        }
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
        var data = Object.toAjaxJson('/admin/codeGenerator/', 'saveCopyAdd', { 'id': ids, isOnlyCopyBase: isOnlyCopyBase });
        if (data.success) {
          that.dg.Reload();
          FUI.Window.showMsg2(that, data.msg, null, 1);
        } else {
          FUI.Window.showMsg(data.msg);
        }
      }
      , genTypeFormatter(row, column, value, index) {
        value = value || "";
        var result = value;
        switch (value) {
          case 'standard':
            result = '<span class="cube bg-light blue">常规标准</span>';
            break;
          case 'urlform':
            result = '<span class="cube bg-blue"> URL流程表单</span>';
            break;
        }
        return result;
      }
      , copyBaseAdd() {
        this.copyAdd(true);
      }
      , opTableColumn(value, row, index, code) {
        const refId = row.id;
        const tableTitle = row.genTitle;
        FUI.Window.openEdit(__webpath + '/admin/codeGenerator/codeGenfieldList?refGenId=' + refId, '数据表【' + tableTitle + '】', FUI.FormAction.Edit, null, 880, 450, null, null, null, true, null, null, false);
      }
    }
    , mounted() {
      window.myvm = this;
    }
  }
</script>