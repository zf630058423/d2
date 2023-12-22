<template>
  <div class="f2bpm-page-layout">
    <el-container>
      <el-main class="f2bpm-page-right">

        <f2bpm-gridsearchform @expandclick="expandClick" :tableform="tableForm" @searchformbtnclick="searchFormbtnClick" @updatevalue="updateFieldValue" />
        <f2bpm-datagrid ref="grid" grid="grid" :expand-search="expandSearch" :expand-subheight="80" :toolbar="tableToolbar" :context-menu="{header: {options: headerMenus},className: 'my-menus'}" :pager-config="tablePage" :data="tableData" :columns="tableColumn" @cell-dblclick="celldbClick" @toolbar-button-click="toolbarButtonClickEvent" @header-contextmenu="contextMenuClickEvent" @page-change="pageChange" @sort-change="sortChange" />
      </el-main>
    </el-container>
  </div>
</template>

<script>
  export default {
    data() {
      return {

        expandSearch: "",
        isAdmin: false,
        currUserId: "",
        currCategoryCode: '',
        treeFilterText: '',
        tenantId: "",
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
    created() {
      var that = this;
      const currUser = that.$store.state.user.author;
      const currUserId = currUser.userId;
      that.tenantId = currUser.tenantId;
      that.currUserId = currUserId;
      that.isAdmin = decodeURI(currUser.realName).indexOf('系统管理员') > -1;
      var dg = FUI.DataGrid.Create(that, 'sys_Users', 'sys_Users', 'grid', true, true, true);
      dg.SortName = 'OrderNo';
      dg.SortOrder = 'asc';
      dg.ShowNumbers = true;
      dg.ExpansMore = false;
      dg.ToolBarDefaultButtons.ShowDelete = that.isAdmin;
      dg.ToolBarDefaultButtons.ShowAdd = true;
      dg.OperationAction.ShowView = false;
      dg.OperationAction.ShowDelete = that.isAdmin;
      dg.EnableDblClickEdite = false;
      dg.OperationDeleteEvent = this.myOperationDeleteEvent;
      dg.OperationEditEvent = this.myOperationEditEvent;
      dg.OperationViewEvent = this.myOperationViewEvent;
      dg.OperationCustomButton = this.myOperationCustomButton;
      dg.ToolBarCustomButton = this.myToolBarCustomButton;
      dg.EditUrl = __webpath + '/admin/user/userEdit/';
      dg.EditTitle = '用户';
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
            FUI.Window.showMsg(res.msg);
          }
        });
      },
      // ====stand:标准方法控制结束==============
      myOperationViewEvent(value, row, index) {
        this.showDialogEdit(FUI.FormAction.View, row[this.dg.IdField]);
      },
      myOperationDeleteEvent(value, row, index) {
        var that = this;
        if (row.UserName == 'admin') {
          FUI.Window.showMsg('“系统管理员账号”不允许删除');
          return false;
        }
        FUI.Window.confirm('您确定要删除【' + row.UserName + '】吗', null, function (r) {
          if (r) {
            var data = Object.toAjaxJson('/admin/user/', 'deleteUser', {
              userId: row.UserId,
              tenantId: row.TenantId
            });
            FUI.Window.showMsg2(data.msg, null, data.success ? 1 : 7);
            that.dg.Reload();
          }
        });
      },
      bathDeleteUserList() {
        var that = this;
        var tenantId = that.tenantId;
        var userIds = FUI.Grid.getGridChecked(that, 'grid', 'UserId');
        if (!userIds) {
          FUI.Window.showMsg('请选择要删除的用户！');
          return false;
        }
        FUI.Window.confirm('您确定要删除所选用户吗', null, function (r) {
          if (r) {
            var data = Object.toAjaxJson('/admin/user/', 'deleteUserList', {
              userIds: userIds,
              tenantId: tenantId
            });
            FUI.Window.showMsg2(data.msg, null, data.success ? 1 : 7);
            that.dg.Reload();
          }
        });
      }
      , myOperationBeforeDeleteEvent(value, row, index) {
        if (row.UserName == 'admin') {
          FUI.Window.showMsg('系统管理员账号不允许删除');
          return false;
        }
        return true;
      },
      myOperationEditEvent(value, row, index) {
        this.showDialogEdit(FUI.FormAction.Edit, row[this.dg.IdField]);
      },
      showDialogEdit(formAction, keyId) {
        var that = this;
        var title = formAction == FUI.FormAction.Add ? '新增' + that.dg.EditTitle : '编辑' + that.dg.EditTitle;
        FUI.Window.openEdit(that.dg.EditUrl, title, formAction, that.dg.GridId, 800, 550, null, that.dg.MainTable, keyId, true, null, null, false);
      },
      // 工具栏按钮
      myToolBarCustomButton() {
        var btns = [];
        btns.push({ code: 'importUserOrgExcel', status: 'default', title: '仅导入用户数据', name: '导入用户', alias: 'Import User And Depart', icon: 'fa fa-upload' });

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
          that.bathDeleteUserList();
        } else {
          var fn = that[code];
          fn();
        }
      },
      // 操作列自定义按钮
      myOperationCustomButton(h, value, row, index) {
        var that = this;
        var custBtns = [];
        var item = null;
        item = { index: 81, title: '分配组织', alias: 'Show Departs', tip: '管理用户的归属组织', class: 'fa fa-bank', code: 'custom1', click: () => this.setUserOrgs(row.UserId, row.RealName) };
        custBtns.push(item);
        item = { index: 82, title: '分配角色', alias: 'Show Roles', tip: '看用户的角色', class: 'fa fa-group', code: 'custom1', click: () => this.setUserRoles(row.UserId, row.RealName) };
        custBtns.push(item);
        item = { index: 83, title: '分配岗位', alias: 'Show Roles', tip: '看用户的岗位', class: 'fa  fa-graduation-cap', code: 'custom1', click: () => this.setUserPosition(row.UserId, row.RealName) };
        custBtns.push(item);
        if (that.isAdmin) {
          item = { index: 88, title: '恢复默认密码', alias: 'Restore Default passowrd', tip: '恢复默认密码', class: 'fa fa-key', code: 'custom2', click: () => this.setDefaultPassword(row.UserId, row.RealName) };
          custBtns.push(item);
        }
        item = { index: 91, title: '查看用户的Id', alias: 'Show UserId', tip: '查看用户的UserId', class: 'fa fa-search', code: 'custom3', click: () => this.showUserId(row.UserId, row.RealName) };
        custBtns.push(item);
        item = { index: 92, title: '获取用户的Token', alias: 'Get Token', tip: '获取用户的Token', class: 'fa fa-search', code: 'custom3', click: () => this.showUserToken(row.UserId, row.RealName) };
        custBtns.push(item);
        if (that.isAdmin) {
          item = { index: 99, title: '一键登录', alias: 'Click Login', tip: '使用此账号进行登录，此功能用于管理员做运营', class: 'fa fa-chevron-circle-right', code: 'custom4', click: () => this.loginUser(row.UserId, row.UserName, row.RealName, row.Password) };
          custBtns.push(item);
        }
        return custBtns;
      },
      exportSqlFile() {
        var ids = dg.getChecked();
        if (ids == '') {
          FUI.Window.showLeftBelo1wMsg('请选择要导出的记录！');
          return false;
        }
        Object.toAjaxDownloadFile(FUI.Handlers.AdminHandler + 'user/', 'downloadUsersSql', {
          ids: ids
        });
      },
      setDefaultPassword(userId, realName) {
        var that = this;
        FUI.Window.confirm(that, '您确认要将用户[' + realName + ']恢复到默认密码吗？', '确认恢复密码', function () {
          var data = Object.toAjaxJson('/admin/user/', 'setDefaultPassword', { 'userId': userId });
          FUI.Window.showMsg(data.msg, null, data.success ? 1 : 7);
        });
      },
      showUserId(userId, realName) {
        FUI.Window.showMsg('用户姓名：' + realName + '</br>用户UserId：' + userId, null, 1);
      },
      showUserToken(userId, realName) {
        var res = Object.toAjaxJson('/workflow/security/orgImpl/', 'getJWTokenByUserId', { userId: userId });
        if (res.success) {
          FUI.Window.showMsg(res.data, null, res.success ? 1 : 7);
        } else {
          FUI.Window.showMsg(res.msg);
          return false;
        }
      },
      setUserOrgs(userId, realName) {
        var that = this;
        FUI.Window.openEdit(FUI.Handlers.AdminHandler + 'user/showUserOrgList/?userId=' + userId, '【' + realName + '】归属组织', 'Edit', that.dg.GridId, 780, 500, null, null, userId);
      },
      setUserRoles(userId, realName) {
        var that = this;
        FUI.Window.openEdit(FUI.Handlers.AdminHandler + 'user/showUserRoleList/?userId=' + userId, '【' + realName + '】已分配角色', 'Edit', that.dg.GridId, 780, 500, null, null, userId);
      },
      setUserPosition(userId, realName) {
        var that = this;
        FUI.Window.openEdit(FUI.Handlers.AdminHandler + 'user/showUserPosition/?userId=' + userId, '【' + realName + '】已分配岗位', 'Edit', that.dg.GridId, 780, 500, null, null, null,true);
      },
      statusFormatter(row, column, value, index) {
        const cellValue = value;
        let result = cellValue;
        switch (cellValue.toString()) {
          case '0':
            result = "<span class='cube bg-red'>禁用</span>";
            break;
          case '1':
            result = "<span class='cube bg-blue'>正常</span>";
            break;
        }
        return result;
      },
      loginUser(userId, userName, realName, password) {
        var that = this;
        var token = '';
        var res = Object.toAjaxJson('/workflow/security/orgImpl/', 'getJWTokenByUserId', { userId: userId });
        if (res.success) {
          token = res.data;
        } else {
          FUI.Window.showMsg(res.msg);
          return false;
        }
        try {
          var urltokenType = '';
          // ===使用自己的ajax======
          var resData = Object.toAjaxJson('/login/', 'loginByToken', { token: token, urltokenType: 'virtualLogin' }, true, null,
            function (result) {
              that.loading = false;
              if (result.success) {
                var authorStr = JSON.stringify(result.data);
                that.$store.dispatch('user/removeAuthor', 'all');
                that.$store.dispatch('app/removeCurrMenuId');
                that.$store.dispatch('user/setAuthor', authorStr)
                  .then(() => {
                    // that.$router.push({ path: that.redirect || "/" });
                    window.open('/', '_top');
                    that.loading = false;
                  })
                  .catch(() => {
                    that.loading = false;
                  });
              } else {
                FUI.Window.showMsg(result.msg + ',可能此用户没有分配组织');
              }
            }
          );
        } catch (e) {
          that.loading = false;
          FUI.Window.showMsg('请求异常' + e.toString());
        }
      }
      , importUserOrgExcel() {
        FUI.Window.openEdit('/admin/user/importUserByExcel', '导入用户组织', FUI.FormAction.Edit, '', 550, 380);
      }
    }
  }
</script>