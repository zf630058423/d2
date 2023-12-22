<template>
  <div class="f2bpm-page-layout">
    <el-container>
      <el-main class="f2bpm-page-right">
        <f2bpm-gridsearchform  @expandclick="expandClick" :tableform="tableForm" @searchformbtnclick="searchFormbtnClick" @updatevalue="updateFieldValue" />
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
        // ======stand:标准区=============
        isCollapsed: false,
        tenantId: '',
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
        },
        isOnlyMySelf: 0
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
      const currUser = FUI.Sys.getAuthor();
      let tenantId = Object.toQueryString('tenantId');
      if (tenantId == '' || tenantId == null) {
        tenantId = currUser.tenantId;
      }
      that.tenantId = tenantId;
      var dg = FUI.DataGrid.Create(that, 'f2bpm_sys_CustomDialog', 'f2bpm_sys_CustomDialog', 'grid', true, true, true);
      dg.SortName = 'CreatedTime';
      dg.SortOrder = 'desc';
      dg.ShowNumbers = true;
      dg.ExpansMore = false;
      dg.DefaultWhere = " TenantId='" + tenantId + "'  ";
      dg.ToolBarDefaultButtons.ShowDelete = true;
      dg.ToolBarDefaultButtons.ShowAdd = true;
      dg.OperationAction.ShowView = false;
      dg.EnableDblClickEdite = true;
      dg.OperationDeleteEvent = this.myOperationDeleteEvent;
      dg.OperationEditEvent = this.myOperationEditEvent;
      dg.OperationViewEvent = this.myOperationViewEvent;
      dg.OperationCustomButton = this.myOperationCustomButton;
      dg.ToolBarCustomButton = this.myToolBarCustomButton;
      dg.EditUrl = '/workflow/customDialog/customDialogEdit/?tenantId=' + tenantId;
      dg.EditHeight = 550;
      dg.EditWidth = 900;
      dg.EditTitle = '自定义对话框';
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
        FUI.Window.openEdit(that.dg.EditUrl, title, formAction, that.dg.GridId, that.dg.EditWidth, that.dg.EditHeight, null, that.dg.MainTable, keyId, true);
      },
      // 工具栏按钮
      myToolBarCustomButton() {
        var btns = [];
        btns.push({ code: 'copyAdd', type: 'primary', name: '复制新增', alias: 'Copy', icon: 'fa fa-copy' });
        btns.push({ code: 'importCustomDialogXml', status: 'default', name: '导入', alias: 'Import', icon: 'fa fa-upload' });
        btns.push({ code: 'importCustomDialogXmlBatch', status: 'default', name: '导出', alias: 'Import', icon: 'fa fa-lemon-o' });
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

        var item1 = { index: 40, title: '配置对话框', alias: 'Config', tip: '配置对话框', class: 'fa fa-cogs', code: 'settingDialog', click: () => this.settingDialog(row.Id, row.Name, row.Code, row.ObjName) };
        var item2 = { index: 41, title: '预览', alias: 'Preview', tip: '预览', class: 'fa fa-search', code: 'openCustomDialog', click: () => this.openCustomDialog(row.Id, row.Name, row.Code, row.ObjName, row.Width, row.Height, row.RadioMultiple) };
        custBtns.push(item1);
        custBtns.push(item2);
        var item = { index: 36, title: '导出', alias: 'Export', tip: '包含设计和表头配置', class: 'fa  fa-download', code: 'downLoadCustomDialogXml', click: () => this.downLoadCustomDialogXml(row.Name, row.Id) };
        custBtns.push(item);
        return custBtns;
      },
      openCustomDialog(id, name, code, ObjName, width, height, radioMultiple) {
        var that = this;
        var multi = radioMultiple == '1';
        CustomDialog(that, {
          customDialog: code,
          isTest: true, width: width, height: height, isMulti: multi
        });
      },
      copyAdd() {
        var that = this;
        var id = that.dg.getChecked();
        if (id == '') {
          FUI.Window.showMsg(that, '请选择要复制的记录!');
          return false;
        }
        FUI.Window.confirm('确定要复制新增吗？', null, function () {
          var result = Object.toAjaxJson('/workflow/customDialog/', 'copyAddSave', { id: id });
          if (result.success == true) {
            FUI.Window.showMsg(that, result.msg, null, 1);
            that.dg.Reload();
          } else {
            FUI.Window.showMsg(that, result.msg);
          }
          return true;
        });
        return false;
      },
      openHelper(id, name, code, objName) {
        var that = this;
        FUI.Window.openEdit('/workflow/customDialog/helperDialog/?code=' + code + '&id=' + id, ' 【' + name + '】自定义对话框-使用帮助', 'Eidt', that.dg.GridId, that.dg.EditWidth, that.dg.EditHeight, null, that.dg.MainTable, null, true);
      },
      settingDialog(id, name, code, objName) {
        var that = this;
        FUI.Window.openEdit('/workflow/customDialog/settingDialog/?isSetHead=1&id=' + id, '设置【' + name + '】自定义对话框', 'Eidt', that.dg.GridId, that.dg.EditWidth, that.dg.EditHeight, null, that.dg.MainTable, null, true);
      },
      downLoadCustomDialogXml(name,id) {
        if (id == '') {
          FUI.Window.showMsg('请选择要导出的数据！');
          return false;
        }
        var res = Object.toAjaxDownloadFile("/workflow/customDialog/", 'downLoadCustomDialogXml', {
          id: id
        });
      }
      , importCustomDialogXml() {
        FUI.Window.openEdit(__webpath + '/workflow/customDialog/customDialogImport', '导入自定义对话框', FUI.FormAction.Edit, '', 550, 380);
      },
      importCustomDialogXmlBatch(){
        var that = this;       
        var Id =  that.dg.getChecked('Id');
        if (Id == '') {
          FUI.Window.showMsg(this, '请选择要导出的自定义对话框', null, null, function (modal) {
            modal.show = false;
          });
          return false;
        } else {
            FUI.Window.confirm("确定要导出选择的自定义对话框，包含设计和表头配置", null, function () {
              var data = Object.toAjaxDownloadFile('/workflow/customDialog/customDialogImport/', 'downLoadCustomDialogXmlBatch', {
                id: Id
              });
            });
        }
      }
      , myOperationDeleteEvent(value, row, index) {
        var that = this;
        if (row.IsSystem == 1) {
          FUI.Window.showMsg2(that, '不能删除系统预置的记录');
          return false;
        }
        FUI.Window.confirm(that, '请确定要删除“' + row.Name + '”？', '删除提示', function () {
          var data = Object.toAjaxJson('/workflow/customDialog/', 'delete', {
            'id': row.Id
          });
          if (data.success) {
            that.dg.Reload();
            FUI.Window.showMsg2(that, data.msg, null, 1);
          } else {
            FUI.Window.showMsg2(that, data.msg);
          }
        });
      }

    }
  }
</script>