<template>
  <div class="f2bpm-page-layout">
    <el-container>
      <el-main class="f2bpm-page-right" v-if="!isShow404">
        <f2bpm-gridsearchform :tableform="tableForm" @searchformbtnclick="searchFormbtnClick" @updatevalue="updateFieldValue" />
        <f2bpm-datagrid ref="grid" grid="grid" height="full-200" :toolbar="tableToolbar" :context-menu="{header: {options: headerMenus},className: 'my-menus'}" :pager-config="tablePage" :data="tableData" :columns="tableColumn" @cell-dblclick="celldbClick" @toolbar-button-click="toolbarButtonClickEvent" @header-contextmenu="contextMenuClickEvent" @page-change="pageChange" @sort-change="sortChange" />
      </el-main>
      <f2bpmui-404 content="请选择左侧一个组织进行操作~" :isShow="isShow404"></f2bpmui-404> 
    </el-container>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        isShow404: false,
        tenantId: "",
        orgId: '',
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
        searchParams: {}
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
      var that = this;
      this.load();
      if (that.orgId == 'Root') {
        that.isShow404 = true;
      } else {
        that.isShow404 = false;
      }
    },
    mounted() {
      var that = this;
      window.myvm = this;
    },

    methods: {
      load() {
        var that = this;
        const orgId = Object.toQueryString('orgId');
        that.orgId = orgId;
        const currUserId = FUI.Sys.getAuthor().userId;
        that.tenantId = FUI.Sys.getAuthor().tenantId;
        var dg = FUI.DataGrid.Create(that, 'vw_sys_OrgUsers', 'sys_UserInOrg', 'grid', true, true, true);
        dg.SortName = 'OrderNo';
        dg.SortOrder = 'asc';
        dg.ShowNumbers = true;
        dg.ExpansMore = false;
        if (that.orgId) {
          dg.DefaultWhere = Object.toStringFormat("orgId='{0}' ", orgId);
        }
        dg.ToolBarDefaultButtons.ShowDelete = true;
        dg.ToolBarDefaultButtons.ShowAdd = true;
        dg.OperationAction.ShowView = false;
        dg.EnableDblClickEdite = false;
        dg.ToolBarCustomButton = this.myToolBarCustomButton;
        dg.OperationEditEvent = this.myOperationEditEvent;
        dg.OperationDeleteEvent = this.myOperationDeleteEvent;
        dg.OperationViewEvent = this.myOperationViewEvent;
        dg.OperationCustomButton = this.myOperationCustomButton;
        dg.Bind();
      },
      collapsedSider() {
        this.isCollapsed = !this.isCollapsed;
      },
      searchFormbtnClick(name) {
        this.dg.searchFormbtnClick(name);
      },
      updateFieldValue(field, newValue, vueDataName, subVueDataName) {
        this.dg.updateFieldValue(field, newValue, vueDataName, subVueDataName);
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
      bathDeleteUserOrgList() {
        var that = this;
        var tenantId = that.tenantId;
        var ids = FUI.Grid.getGridChecked(that, 'grid', 'Id');
        if (!ids) {
          FUI.Window.showMsg('请选择要删除的用户组织！');
          return false;
        }
        FUI.Window.confirm('您确定要删除所选记录吗', null, function () {
          var data = Object.toAjaxJson('/admin/user/', 'deleteUserInOrgList', {
            ids: ids
          });
          FUI.Window.showMsg2(data.msg, null, data.success ? 1 : 7);
          that.dg.Reload();
        });
      }
      , myOperationDeleteEvent(value, row, index) {
        var that = this;
        var id = row.Id;
        var tenantId = row.TenantId;
        var tip = row.IsMaster == 1 ? "【" + row.OrgName + "】为【" + row.RealName + "】的主组织（用户至少有一个归属组织），您确定要删除吗？" : "您确定要删除用户【" + row.RealName + "】的【" + row.OrgName + "】组织吗？";
        FUI.Window.confirm(null, tip, "", function () {
          var result = Object.toAjaxJson(FUI.Handlers.AdminHandler, 'user/deleteUserInOrgList', {
            ids: id
          });
          FUI.Window.showMsg(result.msg, null, 1);
          that.refreshGrid();
        });
      },
      myOperationViewEvent(value, row, index) {
        this.showDialogEdit(FUI.FormAction.View, row[this.dg.IdField]);
      },
      myOperationEditEvent(value, row, index) {
        this.showDialogEdit(FUI.FormAction.Edit, row.UserId);
      },
      showDialogEdit(formAction, keyId) {
        var that = this;
        var title = formAction == FUI.FormAction.Add ? '新增' + that.dg.EditTitle : '编辑' + that.dg.EditTitle;
        FUI.Window.openEdit('/admin/user/userEdit/?orgId=' + that.orgId, title, formAction, that.dg.GridId, 800, 550, null, 'sys_Users', keyId, true, null, null, true);
      },
      // 工具栏按钮
      myToolBarCustomButton() {
        var btns = [];
        btns.push({ code: 'selectUserToOrg', status: 'default', name: '分配用户', alias: 'Add User', icon: 'fa fa-plus' });
        //btns.push({ code: 'exportSqlFile', status: 'default', name: '导出SQL',alias:'Export SQL', icon: 'fa fa-database' });
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
          that.bathDeleteUserOrgList();
        } else {
          var fn = that[code];
          fn();
        }
      },
      // 操作列自定义按钮
      myOperationCustomButton(h, value, row, index) {
        var custBtns = [];
        var item = { index: 99, title: '设置为主归属部门', tip: '设置为主归属部门', class: 'fa fa-external-link-square', code: 'setMasterUserOrg', click: () => this.setMasterUserOrg(row.OrgId, row.UserId, row.OrgName, row.IsMaster, row.RealName) };
        custBtns.push(item);
        return custBtns;
      },
      opinitionTypeFormatter(obj) {
        var row = obj.row;
        var cellValue = obj.cellValue;
        let result = cellValue;
        switch (cellValue.toString()) {
          case '0':
            result = '不同意类';
            break;
          case '1':
            result = '同意类';
            break;
        }
        return result;
      },
      selectUserToOrg() {
        var that = this;
        var widht = 700;
        var height = 470;
        var url = __webpath + '/workflow/selector/selectOnlyUsers/';
        var title = '选择用户';
        if (that.orgId == '') {
          FUI.Window.showMsg2('请点击选择左侧组织');
          return false;
        }
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
              var result = Object.toAjaxJson(FUI.Handlers.AdminHandler, 'user/saveSelectUserToOrg', {
                orgId: that.orgId,
                userIds: ids.toString()
              });
              FUI.Window.showMsg(that,result.msg, null, 1);
              that.refreshGrid();
            }
          }
          layer.close(index);
          return false;
        }, true, null, null, 1);
      },

      setMasterUserOrg(orgId, userId, orgName, isMaster, realName) {
        var that = this;
        if (isMaster == true || isMaster == 1) {
          FUI.Window.showMsg('当前已是主归属部门');
          return false;
        }
        FUI.Window.confirm(null, '确定要设置【' + orgName + '】为【' + realName + '】的主归属部门吗？</br>（一个用户有且仅有一个主归属部门）', null, function (r) {
          var result = Object.toAjaxJson(FUI.Handlers.AdminHandler, 'user/setMasterUserOrg', {
            orgId: orgId,
            userId: userId
          });
          FUI.Window.showMsg(result.msg, null, result.success == true ? 1 : 7);
          that.refreshGrid();
        });
      },
      exportSqlFile() {
        var that = this;
        var ids = that.dg.getChecked('UserId');
        if (ids == '') {
          FUI.Window.showMsg2('请选择要导出的记录！');
          return false;
        }
        Object.toAjaxDownloadFile(FUI.Handlers.AdminHandler, 'user/downloadUsersSql', {
          ids: ids
        });
      }
    }

  }
</script>