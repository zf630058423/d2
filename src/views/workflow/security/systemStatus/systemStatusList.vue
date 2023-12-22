<template>
  <div class="f2bpm-page-layout">
    <el-container>
      <el-main class="f2bpm-page-right">
        <f2bpm-gridsearchform :tableform="tableForm" @expandclick="expandClick" @searchformbtnclick="searchFormbtnClick" @updatevalue="updateFieldValue" />
        <f2bpm-datagrid ref="grid" grid="grid" :expand-search="expandSearch" :toolbar="tableToolbar" :context-menu="{header: {options: headerMenus},className: 'my-menus'}" :pager-config="tablePage" :data="tableData" :columns="tableColumn" @cell-dblclick="celldbClick" @toolbar-button-click="toolbarButtonClickEvent" @header-contextmenu="contextMenuClickEvent" @page-change="pageChange" @sort-change="sortChange" />
      </el-main>
    </el-container>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        expandSearch: "",
        treeFilterText: '',
        isCollapsed: false,
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
          // 查询
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
    watch: {

    },
    created() {
      let that = this;
      //const currUserId = that.$store.state.user.author.userId;
      let dg = FUI.DataGrid.Create(that, 'f2bpm_sys_system_status', 'f2bpm_sys_system_status', 'grid', true, true, true);
      dg.SortName = 'id';
      dg.SortOrder = 'desc';
      dg.ShowNumbers = true;
      dg.ExpansMore = true;
      //注释此行dg.Url从自己的Controller后端拿数据
      dg.Url = '/workflow/security/systemStatus/getListByPage';
      dg.ToolBarCustomButton = this.myToolBarCustomButton;
      //是否显示工具栏上的删除按钮
      dg.ToolBarDefaultButtons.ShowDelete = true;
      //是否显示工具栏上的添加按钮
      dg.ToolBarDefaultButtons.ShowAdd = true;
      dg.OperationAction.ShowView = true;
      dg.EnableDblClickEdite = true;
      dg.OperationDeleteEvent = this.myOperationDeleteEvent;
      dg.OperationEditEvent = this.myOperationEditEvent;
      dg.OperationViewEvent = this.myOperationViewEvent;
      dg.OperationCustomButton = this.myOperationCustomButton;
      dg.EditUrl = '/workflow/security/systemStatus/systemStatusEdit';
      dg.EditTitle = '【系统状态】';
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
      refreshGrid(parentGridId, parm) {
        let that = this;
        that.dataGridSearch();
      },
      dataGridReSet() {
        let that = this;
        $.each(this.searchParams, function (key, item) {
          that.searchParams[key] = '';
        });
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
            FUI.Window.showMsg(res.msg);
          }
        });
      },
      myOperationViewEvent(value, row, index) {
        this.showDialogEdit(FUI.FormAction.View, row[this.dg.IdField]);
      },
      myOperationEditEvent(value, row, index) {
        this.showDialogEdit(FUI.FormAction.Edit, row[this.dg.IdField]);
      },
      myOperationDeleteEvent(value, row, index) {
        let that = this;
        let id = row[this.dg.IdField];
        let parm = { keyId: id };
        FUI.Window.confirm(that, "您确定要删除吗？", null, function () {
          Object.toAjaxJson("/workflow/security/systemStatus/", "delete", parm, true, null,
            function (res) {
              if (res.success) {
                that.dataGridSearch();
                //that.refreshTree();
              } else {
                FUI.Window.showMsg(res.msg);
              }
            });
        });
      },
      showDialogEdit(formAction, keyId) {
        let that = this;
        let title = formAction == FUI.FormAction.Add ? '新增' + that.dg.EditTitle : '编辑' + that.dg.EditTitle;
        FUI.Window.openEdit(that.dg.EditUrl, title, formAction, that.dg.GridId, 700, 550, null, that.dg.MainTable, keyId);
      },
      // 工具栏按钮
      myToolBarCustomButton() {
        let btns = [];
        // btns.push({code: 'closeEdit', status: 'default', name: '关闭', icon: 'fa fa-close'});
        return btns;
      },
      // 工具栏按钮事件
      toolbarButtonClickEvent({ btn }, event) {
        const code = btn.code;
        const that = this;
        if (code == 'closeEdit') {
          FUI.Window.closeEdit();
        } else if (code == 'default.add') {
          that.showDialogEdit(FUI.FormAction.Add, '');
        } else if (code == 'default.delete') {
          that.bathDeleteEvent();
        } else {
          let fn = that[code];
          fn();
        }
      },
      bathDeleteEvent() {
        let that = this;
        var ids = that.dg.getChecked();
        if (ids == "") {
          FUI.Window.showMsg(that, "请选择要删除的记录");
          return;
        }
        let parm = { keyId: ids };
        FUI.Window.confirm(that, "您确定删除记录吗？", null, function () {
          Object.toAjaxJson("/workflow/security/systemStatus/", "deleteList", parm, true, null,
            function (res) {
              if (res.success) {
                that.dataGridSearch();
              } else {
                FUI.Window.showMsg(res.msg);
              }
            });
        });
      },
      // 操作列自定义按钮
      myOperationCustomButton(h, value, row, index) {
        let that = this;
        let custBtns = [];
        //index属性是按钮的排序号
        let item = { index: 1, title: '示自定义', tip: '提示自定义', class: 'fa fa-trash-o', code: 'custom', click: () => this.operationCustomButtonClick(value, row, index) };
        // custBtns.push(item);
        return custBtns;
      },
      operationCustomButtonClick(value) {
        alert('aa' + value);
      },
      objTypeFormatter(row, column, value, index) {
        let result = value;
        switch (value.toString()) {
          case 'loginLog':
            result = '登录日志';
            break;
        }
        return result;
      }
    }
  }
</script>