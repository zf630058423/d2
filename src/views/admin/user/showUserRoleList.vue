<template>
  <div class="f2bpm-page-layout">
    <el-container>
      <el-main class="f2bpm-page-right">
        <div class="grid-search-form-searchbtn-toolbar">
          <el-button-group class="mr5 ml5">
            <el-button size="mini" type="default" icon="fa fa-plus" @click="assignRole()">分配角色</el-button>
            <el-button size="mini" type="default" @click="closeEdit" icon="fa fa-minus-circle">关闭</el-button>
          </el-button-group>
        </div>
        <f2bpm-gridsearchform :tableform="tableForm" @searchformbtnclick="searchFormbtnClick" @updatevalue="updateFieldValue" />
        <f2bpm-datagrid ref="grid" grid="grid" height="full-100" :toolbar="tableToolbar" :context-menu="{header: {options: headerMenus},className: 'my-menus'}" :pager-config="tablePage" :data="tableData" :columns="tableColumn" @cell-dblclick="celldbClick" @toolbar-button-click="toolbarButtonClickEvent" @header-contextmenu="contextMenuClickEvent" @page-change="pageChange" @sort-change="sortChange" />
      </el-main>
    </el-container>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        userId:"",
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
        tableColumn: []
      };
    },
    computed: {
      countGridHeight() {
        return $(document).height() - global_datagridHeightDiff;
      },
      rotateIcon() {
        return this.isCollapsed
          ? 'fa fa-angle-double-right'
          : 'fa fa-angle-double-left';
      },
      positionIcon() {
        return this.isCollapsed
          ? 'cursor:pointer; position: relative;left: -5px;'
          : 'cursor:pointer; position: relative;left: 100px;';
      }
    },
    created() {
      var that = this;
      window.myvm = that;
      var userId = Object.toQueryString('userId');
      that.userId=userId;
      var dg = FUI.DataGrid.Create(that, 'vw_sys_UserInRole', 'sys_UserInRole', 'grid', false, false, false);
      dg.SortName = 'CreatedTime';
      dg.SortOrder = 'desc';
      dg.ShowNumbers = false;
      dg.Height = 330;
      dg.DefaultWhere = "userId='" + userId + "'";
      dg.ShowToolbar = false;
      dg.ToolBarDefaultButtons.ShowDelete = true;
      dg.ToolBarDefaultButtons.ShowAdd = false;
      dg.OperationAction.ShowEdit = false;
      dg.OperationAction.ShowView = false;
      dg.OperationAction.ShowView = false;
      dg.EnableDblClickEdite = false;
      dg.OperationEditEvent = this.myOperationEditEvent;
      dg.OperationViewEvent = this.myOperationViewEvent;
      dg.OperationCustomButton = this.myOperationCustomButton;
      dg.Bind();
    },
    mounted() {
      window.myvm = this;
    },

    methods: {
      closeEdit() {
        FUI.Window.closeEdit();
      },
      collapsedSider() {
        this.isCollapsed = !this.isCollapsed;
      },
      filterTreeNode(value, data) {
        if (!value) return true;
        return data.title.indexOf(value) !== -1;
      },
      refreshTree() {
        var that = this;
      },
      showAll() {
        this.searchParams.CategoryCode = '';
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
      toolbarButtonClickEvent({ btn }, event) {
        const code = btn.code;
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
        var that = this;
        var custBtns = [];
        return custBtns;
      },
      onBeforeDelete(value, row, index) {
        if (row.IsMaster == 1 || row.IsMaster == 'true') {
          FUI.Window.showMsg('主归属组织不能删除');
          return false;
        }
        return true;
      },
      assignRole() {
        var that = this;
        var widht = 450;
        var height = 500;
        var url = __webpath + '/workflow/selector/selectRole/';
        var title = '为用户分配角色';
        if (that.userId == '') {
          FUI.Window.showMsg2('用户不能为空');
          return false;
        }
        FUI.dialog(url, title, { resultFieldKey: 'groupId' }, widht, height, function (objectData, index, layer) {
          if (objectData.length > 0) {
            var titles = [];
            var data = [];
            var ids = [];
            $.each(objectData, function (i, item) {
              titles.push(item.text);
              ids.push(item.value);
            });
            if (ids.length > 0) {
              var result = Object.toAjaxJson(FUI.Handlers.AdminHandler, 'role/saveRolesToUser', {
                roleIds: ids.toString(),
                userId: that.userId
              });
              FUI.Window.showMsg(result.msg, null, 1);
              that.refreshGrid();
            }
          }
          layer.close(index);
          return false;
        }, true, null, null, 1);
      }

    }
  }
</script>