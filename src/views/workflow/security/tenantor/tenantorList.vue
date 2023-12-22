<template>
  <div class="f2bpm-page-layout">
    <el-container>
      <el-main class="f2bpm-page-right">
        <f2bpm-gridsearchform @expandclick="expandClick" :tableform="tableForm" @searchformbtnclick="searchFormbtnClick" @updatevalue="updateFieldValue" />
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
        isAdmin: false,
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
        searchParams: {
          // 特殊查询
        }
      };
    },
    created() {
      var that = this;
      const currUser = that.$store.state.user.author;
      const currUserId = currUser.userId;
      that.isAdmin = decodeURI(currUser.realName).indexOf('管理员') > -1;
      var dg = FUI.DataGrid.Create(that, 'f2bpm_sys_tenantor', 'f2bpm_sys_tenantor', 'grid', true, true, true);
      dg.SortName = 'created_time';
      dg.SortOrder = 'desc';
      dg.DefaultWhere = "Tenant_Code!='System'";
      dg.ShowNumbers = true;
      dg.ExpansMore = true;
      dg.ToolBarDefaultButtons.ShowDelete = false;
      dg.ToolBarDefaultButtons.ShowAdd = true;
      dg.OperationAction.ShowView = false;
      dg.EnableDblClickEdite = true;
      dg.ToolBarCustomButton = that.myToolBarCustomButton;
      dg.OperationBeforeDeleteEvent = this.myOperationBeforeDeleteEvent;
      dg.OperationEditEvent = this.myOperationEditEvent;
      dg.OperationDeleteEvent = this.myOperationDeleteEvent;
      dg.OperationViewEvent = this.myOperationViewEvent;
      dg.OperationCustomButton = this.myOperationCustomButton;
      dg.EditUrl = '/workflow/security/tenantor/tenantorEdit/';
      dg.EditTitle = '编辑';
      dg.Bind();
    },
    mounted() {
      window.myvm = this;
      console.info(this.tableForm);
    },

    methods: {
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
      // 刷新列表
      refreshGrid(parentGridId, parm) {
        var that = this;
        that.dataGridSearch();
      },
      showAll() {
        this.dataGridSearch();
      },
      dataGridReSet() {
        var that = this;
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
      myOperationViewEvent(value, row, index) {
        this.showDialogEdit(FUI.FormAction.View, row[this.dg.IdField]);
      },
      myOperationEditEvent(value, row, index) {
        this.showDialogEdit(FUI.FormAction.Edit, row[this.dg.IdField]);
      },
      myOperationDeleteEvent(value, row, index) {
        var that = this;
        FUI.Window.confirm('您确定要删除“' + row.tenantName + '”', null, function () {
          var id = row.id;
          var res = Object.toAjaxJson('/workflow/security/tenantor/', 'deleteById', { keyId: id });
          FUI.Window.showMsg(res.msg, null, res.success ? 1 : 7);
          that.refreshGrid();
        });
      },
      myOperationBeforeDeleteEvent(value, row, index) {
        if (row.tenantCode == 'System') {
          FUI.Window.showMsg('系统默认配置不允许删除');
          return false;
        }
        if (row.tenantIsInital == 1) {
          FUI.Window.showMsg('租户数据已初始化，不允许删除');
          return false;
        }
        return true;
      },
      showDialogEdit(formAction, keyId) {
        var that = this;
        var title = formAction == FUI.FormAction.Add ? '新增' + that.dg.EditTitle : '编辑' + that.dg.EditTitle;
        FUI.Window.openEdit(that.dg.EditUrl, title, formAction, that.dg.GridId, 700, 550, null, that.dg.MainTable, keyId);
      },
      // 工具栏按钮
      myToolBarCustomButton() {
        var btns = [];
        // btns.push({code: 'closeEdit', status: 'default', name: '关闭', icon: 'fa fa-close'});
        return btns;
      },
      // 工具栏按钮事件
      toolbarButtonClickEvent({ btn }, event) {
        const code = btn.code;
        console.info(code);
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
        if (row.tenantIsInital != 1) {
          var item = { index: 40, title: '初始化数据', tip: '创建租户的初始化数据，如果组织架构是接入第三方时，只初始化菜单和常规分类数据', class: 'fa fa-id-card', code: 'custom', click: () => this.initailTenant(value, row, index) };
          custBtns.push(item);
        }
        if (row.tenantIsInital == 1) {
          var item = { index: 41, title: '清空租户数据', tip: '该租户下所有数据将会被清空，当接入第三方用户组织架构模式时此功能不可用', class: 'fa fa-trash-o', code: 'clearTenantAllData', click: () => this.clearTenantAllData(value, row, index) };
          custBtns.push(item);
        }
        var item = { index: 42, title: '查看租户菜单', tip: '该租户下的系统菜单', class: 'fa fa-search', code: 'showTenantResources', click: () => this.showTenantResources(value, row, index) };
        custBtns.push(item);

        if (row.isEnabled && row.tenantIsInital && that.isAdmin) {
          item = { index: 99, title: '一键登录', tip: '使用此账租户的管理员号进行登录，此功能用于管理员做运营', class: 'fa fa-chevron-circle-right', code: 'custom4', click: () => this.loginTenant(row.tenantCode) };
          custBtns.push(item);
          item = { index: 98, title: '恢复默认密码', tip: '恢复默认密码，当接入第三方用户组织架构模式时此功能不可用', class: 'fa fa-key', code: 'custom2', click: () => this.setDefaultPassword(value, row, index) };
          custBtns.push(item);
          item = { index: 98, title: '恢复管理员账号', tip: '恢复租户管理员账号，当接入第三方用户组织架构模式时此功能不可用', class: 'fa fa-user', code: 'custom2', click: () => this.recoveryTenantAdminUser(value, row, index) };
          custBtns.push(item);
        }

        return custBtns;
      },
      showTenantResources(value, row, index) {
        var that = this;
        var tenantCode = row.tenantCode;
        var tenantName = row.tenantName;
        /*  if (row.tenantIsInital != 1) {
           FUI.Window.showMsg('【' + tenantCode + '】未初始化')
           return false
         } */
        FUI.Window.openEdit('/workflow/security/tenantor/tenantorInResourceList/?tenantId=' + tenantCode, '查看【<em>' + tenantName + '</em>】租户菜单', FUI.FormAction.View, null, 350, 500, null, null, null, true);
      },
      initailTenant(value, row, index) {
        var that = this;
        var tenantCode = row.tenantCode;
        var tenantName = row.tenantName;
        if (row.tenantIsInital == 1) {
          FUI.Window.showMsg('【' + tenantName + tenantCode + '】租户当前已初始化');
          return false;
        }
        FUI.Window.confirm('您确定要初始化【' + tenantName + tenantCode + '】租户数据吗？', null, function () {
          Object.toAjaxJson('/admin/', 'initailTenant', { tenantCode: tenantCode }, true, null,
            function (res) {
              if (res.success) {
                FUI.Window.showMsg(res.msg, null, res.success ? 1 : 7);
                that.refreshGrid();

              } else {
                FUI.Window.showMsg(res.msg);
              }
            }
          );
        });
      },
      clearTenantAllData(value, row, index) {
        var that = this;
        var tenantCode = row.tenantCode;
        var tenantName = row.tenantName;
        FUI.Window.confirm('您确定要清空【' + tenantName + tenantCode + '】租户的所有数据吗？', null, function () {

          Object.toAjaxJson('/admin/', 'clearTenantAllData', { tenantCode: tenantCode }, true, null,
            function (res) {
              if (res.success) {
                FUI.Window.showMsg(res.msg, null, res.success ? 1 : 7);
                that.refreshGrid();

              } else {
                FUI.Window.showMsg(res.msg);
              }
            }
          );
        });
      },
      setDefaultPassword(value, row, index) {
        var that = this;
        var tenantId = row.tenantCode;
        FUI.Window.confirm(null, '您确认要将租户【' + row.tenantName + '|' + tenantId + '-租户管理员】恢复到默认密码吗？', '确认恢复密码', function () {
          Object.toAjaxJson('/admin/user/', 'setTenantAdminDefaultPassword', { 'tenantId': tenantId }, true, null,
            function (res) {
              if (res.success) {
                FUI.Window.showMsg(res.msg, null, res.success ? 1 : 7);
              } else {
                FUI.Window.showMsg(res.msg);
              }
            }
          );
        });
      },
      recoveryTenantAdminUser(value, row, index) {
        var that = this;
        var tenantId = row.tenantCode;
        FUI.Window.confirm(null, '您确认要恢复【' + row.tenantName + '|' + tenantId + '-租户管理员】账号吗？', '确认恢复', function () {
          Object.toAjaxJson('/admin/', 'recoveryTenantAdminUser', { 'tenantCode': tenantId }, true, null,
            function (res) {
              if (res.success) {
                FUI.Window.showMsg(res.msg, null, res.success ? 1 : 7);
              } else {
                FUI.Window.showMsg(res.msg);
              }
            }
          );
        });
      }
      , loginTenant(tenantCode) {
        var that = this;
        var token = '';
        var res = Object.toAjaxJson('/workflow/security/orgImpl/', 'getJWTokenByAccountTenantCode', { tenantCode: tenantCode, account: 'admin' });
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
                that.$store.dispatch('user/removeAuthor');
                var authorStr = JSON.stringify(result.data);
                that.$store.dispatch('app/removeCurrMenuId');
                that.$store.dispatch('user/setAuthor', authorStr)
                  .then(() => {
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
    }
  }
</script>