<template>
  <div class="f2bpm-page-layout">
    <el-container>
      <el-aside ref="sideLeft" class="f2bpm-page-left" hide-trigger collapsible :width="isCollapsed?'20px':'250px'">
        <div class="f2bpm-panel-head">
          <div v-if="!isCollapsed" class="f2bpm-left-search-div" style="width:190px">
            <el-input v-model="treeFilterText" class="left-htead-treeFilterText-box"   size="small" clearable :placeholder="$t('enterKey')" autocomplete="off" prefix-icon="el-icon-search" />
          </div>
          <div  class="f2bpm-left-search-button-div">
            <i v-if="!isCollapsed" :title="$t('refresh')" class="icon icon-shuaxin  cur mr10 font12  " @click="loadTree()"></i>
            <i title="收起/展开" :class="rotateIcon" @click="collapsedSider" />
          </div>
        </div>
        <div v-if="!isCollapsed" class="f2bpm-page-left-content auto-window-height  mt4" :style="'height:'+countLeftTreeHeight+'px;'">
          <span class="fa fa-home cur ml10 font12 " @click="showAll()">{{$t('all')}}</span>
          <el-tree ref="mytree" :data="treeData" :expand-on-click-node="false" :filter-node-method="filterTreeNode" default-expand-all @node-click="onTreeSelected" />
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
        roleName: '',
        roleId: '',
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
          RoleId: ''
        }
      };
    },
    computed: {
      countLeftTreeHeight() {
        return $(document).height() - 100;
      },
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
      treeFilterText(val) {
        this.$refs.mytree.filter(val);
      }
    },
    created() {
      var that = this;
      that.loadTree();
      var dg = FUI.DataGrid.Create(that, 'vw_sys_UserInRole', 'sys_UserInRole', 'grid', true, true, true);
      dg.SortName = 'CreatedTime';
      dg.SortOrder = 'desc';
      dg.ShowNumbers = true;
      dg.ToolBarDefaultButtons.ShowDelete = true;
      dg.ToolBarDefaultButtons.ShowAdd = false;
      dg.OperationAction.ShowView = false;
      dg.OperationAction.ShowEdit = false;
      dg.EnableDblClickEdite = false;
      dg.ToolBarCustomButton = this.myToolBarCustomButton;
      dg.OperationEditEvent = this.myOperationEditEvent;
      dg.OperationViewEvent = this.myOperationViewEvent;
      dg.EditTitle = '角色';
      dg.Bind();
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
      onTreeSelected(data, treeNode, thisObj) {
        var that = this;
        var id = treeNode.data.id;
        that.searchParams.RoleId = id;
        that.roleId = id;
        that.roleName = treeNode.data.title;
        that.dataGridSearch();
      },
      refreshTree() {
        this.loadTree();
      },
      loadTree() {
        var that = this;
        var treeUrl = '/admin/role/getRoleTreeJson/?needRoot=true';
        Object.toAjaxJson(treeUrl, null, null, true, null, function (res) {
          if (res.success) {
            that.treeData = res.data;
            var msg = res.msg;
          } else {
            FUI.Window.showMsg(that, res.msg);
          }
        });
      },
      showAll() {
        that.searchParams.RoleId = '';
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
        var url = __webpath + '/admin/role/roleEdit/?roleType=' + that.roleType + '&parentId=' + that.searchParams.ParentId;
        var title = formAction == FUI.FormAction.Add ? '新增' + that.dg.EditTitle : '编辑' + that.dg.EditTitle;
        FUI.Window.openEdit(url, title, formAction, that.dg.GridId, 650, 500, null, that.dg.MainTable, keyId);
      },
      // 工具栏按钮
      myToolBarCustomButton() {
        var btns = [];
        btns.push({ code: 'addResource', status: 'default', name: '为角色分配用户', alias: 'Assign Users', icon: 'fa fa-gamepad' });
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
          that.dg.ToolBarBathDelete(that);
        } else {
          var fn = that[code];
          fn();
        }
      },
      addResource() {
        var that = this;
        var roleId = that.roleId;
        if (roleId == '' || roleId == '00000000-0000-0000-0000-000000000000') {
          FUI.Window.showMsg2('请在左侧列表中选择角色');
          return false;
        }
        var roleId = $('#hidRoleId').val();
        if (roleId == '' || roleId == '00000000-0000-0000-0000-000000000000') {
          FUI.Window.showLeftBelowMsg('请在左侧列表中选择角色');
          return false;
        }

        var widht = 850;
        var height = 500;
        var url = __webpath + '/workflow/selector/selectUsers';
        var title = '【' + that.roleName + '角色】分配用户';
        FUI.dialog(url, title, null, widht, height, function (objectData, index, layer) {
          if (objectData.length > 0) {
            var titles = [];
            var data = [];
            var ids = [];
            $.each(objectData, function (i, item) {
              titles.push(item.realName);
              ids.push(item.userId);
            });
            if (ids.length > 0) {
              // 批量保存
              var result = Object.toAjaxJson(FUI.Handlers.AdminHandler, 'role/saveRoleUser', {
                roleId: that.roleId,
                userIds: ids.toString()
              });
              if (result.success) {
                that.refreshGrid();
              }
              FUI.Window.showMsg2(result.msg, null, result.success ? 1 : 7);
            }
          }
          layer.close(index);
          return false;
        }, true, null, null, 1);
      },
      exportSqlFile() {
        var that = this;
        var ids = that.dg.getChecked();
        if (ids == '') {
          FUI.Window.showMsg2('请选择要导出的记录！');
          return false;
        }
        Object.toAjaxDownloadFile(FUI.Handlers.AdminHandler + 'user/', 'downloadUserInRoleSql', {
          ids: ids
        });
      }
    }
  }
</script>