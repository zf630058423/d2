<template>
  <div class="f2bpm-page-layout">
    <el-container>
      <el-aside ref="sideLeft" class="f2bpm-page-left" hide-trigger collapsible :width="isCollapsed?'20px':'200px'">
        <div class="f2bpm-panel-head">
          <div v-if="!isCollapsed" class="f2bpm-left-search-div">
            <el-input v-model="treeFilterText" class="left-htead-treeFilterText-box" size="small" clearable :placeholder="$t('enterKey')" autocomplete="off" prefix-icon="el-icon-search" />
          </div>
          <div class="f2bpm-left-search-button-div">
            <i v-if="!isCollapsed" :title="$t('refresh')" class="icon icon-shuaxin  cur mr10 font12  " @click="loadTree()"></i>
            <i title="收起/展开" :class="rotateIcon" @click="collapsedSider" />
          </div>
        </div>
        <div v-if="!isCollapsed" class="f2bpm-page-left-content auto-window-height mt4">
          <div class="mytree-cube-box-container">
            <span class="cur  mytree-cube-box " @click="showAll()"><i class="icon icon-quanbu font16"></i> {{$t('all')}}</span>
            <span class="cur  mytree-cube-box" @click="categoryManager('CustomDataGridGroup')"><i class="icon icon-fenlei font16"></i> {{$t('category')}}</span>
          </div>

          <el-tree ref="mytree" :data="treeData" :filter-node-method="filterTreeNode" :expand-on-click-node="false" default-expand-all @node-click="onTreeSelected" />
        </div>
      </el-aside>
      <el-main class="f2bpm-page-right">
        <f2bpm-gridsearchform :tableform="tableForm" @expandclick="expandClick" @searchformbtnclick="searchFormbtnClick" @updatevalue="updateFieldValue" />
        <f2bpm-datagrid ref="grid" grid="grid"  :expand-search="expandSearch" :toolbar="tableToolbar" :context-menu="{header: {options: headerMenus},className: 'my-menus'}" :pager-config="tablePage" :data="tableData" :columns="tableColumn" @cell-dblclick="celldbClick" @toolbar-button-click="toolbarButtonClickEvent" @header-contextmenu="contextMenuClickEvent" @page-change="pageChange" @sort-change="sortChange" />
      </el-main>
    </el-container>
  </div>
</template>

<script>

  export default {
    data() {
      return {
        expandSearch: "",
        isSolution: false,
        // ======stand:标准区=============
        currCategoryCode: '',
        formKey: '',
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
    created() {
      var that = this;
      var formKey = Object.toQueryString('formKey') || '';
      var solutionId = Object.toQueryString('solutionId') || '';
      if (solutionId != '') {
        that.isSolution = true;
      }
      that.formKey = formKey;
      const currUserId = FUI.Sys.getAuthor().userId;
      var dg = FUI.DataGrid.Create(that, 'f2bpm_sys_CustomDataGrid', 'f2bpm_sys_CustomDataGrid', 'grid', true, true, true);
      dg.SortName = 'CreatedTime';
      dg.SortOrder = 'desc';
      dg.ShowNumbers = true;
      dg.ExpansMore = false;
      if (formKey) {
        dg.DefaultWhere = " formKey='" + formKey + "'";
      }
      dg.ToolBarDefaultButtons.ShowDelete = true;
      dg.ToolBarDefaultButtons.ShowAdd = true;
      dg.OperationAction.ShowView = false;
      dg.EnableDblClickEdite = true;
      dg.OperationDeleteEvent = this.myOperationDeleteEvent;
      dg.OperationEditEvent = this.myOperationEditEvent;
      dg.OperationViewEvent = this.myOperationViewEvent;
      dg.OperationCustomButton = this.myOperationCustomButton;
      dg.ToolBarCustomButton = this.myToolBarCustomButton;
      dg.EditUrl = '/workflow/security/customDataGrid/customDataGridEdit/?formKey=' + formKey;
      dg.EditTitle = '编辑';
      dg.Bind();
      this.loadTree();
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
      showAll() {
        this.searchParams.CategoryCode = '';
        this.dataGridSearch();
      },
      loadTree() {
        var that = this;
        var treeUrl = FUI.Handlers.CategoryHandler + '?groupKey=CustomDataGridGroup';
        Object.toAjaxJson(treeUrl, null, null, true, null, function (res) {
          if (res.success) {
            that.treeData = res.data;
            var msg = res.msg;
          } else {
            FUI.Window.showMsg(that, res.msg);
          }
        });
      },
      onTreeSelected(data, treeNode, thisObj) {
        this.currCategoryCode = treeNode.data.id;
        this.searchParams.CategoryCode = this.currCategoryCode;
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
        var title = formAction == FUI.FormAction.Add ? '新增' + that.dg.EditTitle : '';
        FUI.Window.openEdit(that.dg.EditUrl, title, formAction, that.dg.GridId, 600, 450, null, that.dg.MainTable, keyId, true);
      },
      // 工具栏按钮
      myToolBarCustomButton() {
        var that = this;
        var btns = [];
        btns.push({ code: 'copyAdd', type: 'primary', name: '复制新增', alias: 'Copy', icon: 'fa fa-clipboard' });
        btns.push({ code: 'bathSetCategory', type: 'primary', name: '设置分类', alias: 'Set Category', icon: 'fa fa-cog' });
        if (that.formKey != '' && that.isSolution == false) {
          btns.push({ code: 'closeEdit', type: 'primary', name: '关闭', alias: 'Close', icon: 'fa fa-close' });
        }
        btns.push({ code: 'customDataGridImport', status: 'default', name: '导入', alias: 'Import', icon: 'fa fa-upload' });
        btns.push({ code: 'customDataGridImportBatch', status: 'default', name: '导出', alias: 'Import', icon: 'fa fa-lemon-o' });
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
        var item = { index: 31, title: '预览配置表头', alias: 'Preview Config Header', tip: '预览配置表头', class: ' fa fa-window-maximize ', code: 'openCustomDataGridList', click: () => this.openCustomDataGridList(row.Id, row.DataGridTitle, row.ConfigTableName) };
        custBtns.push(item);
        item = { index: 32, title: '按钮权限设置', alias: 'Button Permissions', tip: '按钮权限设置', class: ' fa fa-gears ', code: 'editFormPermission', click: () => this.editFormPermission(row.Id, row.DataGridTitle) };
        custBtns.push(item);
        item = { index: 33, title: '显示地址', alias: 'Show Url', tip: '显示地址', class: ' fa fa-search ', code: 'showAddress', click: () => this.showAddress(row.ConfigTableName) };
        custBtns.push(item);
        item = { index: 34, title: '打开查看', alias: 'Open', tip: '打开查看', class: ' fa fa-search ', code: 'openViewAddress', click: () => this.openViewAddress(row.ConfigTableName) };
        custBtns.push(item);
        item = { index: 99, title: '导出', alias: 'Export', tip: '导出自定义列表', class: 'fa  fa-download', code: 'downLoadCustomGridXml', click: () => this.downLoadCustomGridXml(row.Id) };
        custBtns.push(item);
        return custBtns;
      },
      operationCustomButtonClick(value, row, index) {
        alert('操作列自定义按钮事件调用：' + value);
      },
      extend_OperationShowDefaultButton(value, row, index) {
        // 扩展控制操作列默认的三个显示按钮
        return { 'showEdit': true, 'showView': true, 'showDelete': true };
      },
      myOperationDeleteEvent(value, row, index) {
        var that = this;
        if (row.IsSystem == 1) {
          FUI.Window.showMsg2(that, '不能删除系统预置的记录');
          return false;
        }
        FUI.Window.confirm(that, '请确定要删除“' + row.DataGridTitle + '”？', '删除提示', function () {
          var data = Object.toAjaxJson('/workflow/security/customDataGrid/', 'delete', {
            'id': row.Id,
            'configTableName': row.ConfigTableName
          });
          if (data.success) {
            that.dg.Reload();
            FUI.Window.showMsg2(that, data.msg, null, 1);
          } else {
            FUI.Window.showMsg2(that, data.msg);
          }
        });
      },
      gridTypeFormatter(row, col) {
        var value = row.GridType;
        switch (row.GridType) {
          case 'WorkflowForm':
            return '表单应用';
            break;
          case 'CustSearch':
            return '普通列表';
            break;
        }
        return value;
      },
      showAddress(configTableName) {
        var that = this;
        FUI.Window.showMsg(that, '显示地址：' + '/workflow/security/customDataGrid/customDataGridView/?code=' + configTableName, null, 1);
      },
      openViewAddress(configTableName) {
        var that = this;
        var url = __webpath + '/workflow/security/customDataGrid/customDataGridView/?code=' + configTableName;
        FUI.Window.open(url, '_blank');
      },
      openCustomDataGridList(id, dataGridTitle, configTableName) {
        var that = this;
        FUI.Window.openEdit('/workflow/security/customDataGrid/customDataGridPreView/?isSetHead=1&code=' + configTableName, dataGridTitle, 'Edit', null, that.dg.EditWidth, that.dg.EditHeight, null, '', id, true);
      },
      copyAdd() {
        var that = this;
        var id = that.dg.getChecked();
        if (id == '') {
          FUI.Window.showMsg('请选择要复制的行！');
          return false;
        }
        if (id.indexOf(',') > -1) {
          FUI.Window.showMsg('只能选择一条要复制的行！');
          return false;
        }
        var data = Object.toAjaxJson('/workflow/security/customDataGrid/', 'copyAddSaveCustomDataGrid', { 'id': id });
        if (data.success) {
          that.dg.Reload();
          FUI.Window.showMsg2(that, data.msg, null, 1);
        } else {
          FUI.Window.showMsg2(that, data.msg);
        }
      }
      , customDataGridImport() {
        FUI.Window.openEdit('/workflow/security/customDataGrid/customDataGridImport', '导入自定义列表', FUI.FormAction.Edit, '', 550, 400);
      },
      customDataGridImportBatch(){
        var that = this;       
        var Id =  that.dg.getChecked('Id');
        if (Id == '') {
          FUI.Window.showMsg(this, '请选择要导出的自定义列表', null, null, function (modal) {
            modal.show = false;
          });
          return false;
        } else {
            FUI.Window.confirm("确定要导出选择的自定义列表", null, function () {
              var data = Object.toAjaxDownloadFile('/workflow/security/customDataGrid/', 'downLoadCustomDataGridXmlBatch', {
                id: Id
              });
            });
        }
      },
      downLoadCustomGridXml(id) {
        if (id == '') {
          FUI.Window.showMsg('请选择要导出的自定义列表');
          return false;
        }
        var data = Object.toAjaxDownloadFile('/workflow/security/customDataGrid/', 'downLoadCustomDataGridXml', {
          id: id
        });
      }
      , editFormPermission(id, title) {
        var that = this;
        var url = __webpath + '/workflow/smartForm/formPermission/formFieldListPermissions/?rightType=customDataGrid&formKey=' + id;
        FUI.Window.open(url);
      },
      categoryManager(groupKey) {
        var that = this;
        var url = '/workflow/security/category/categoryList_bygroupKey?groupKey=' + groupKey;
        var title = "分类管理";
        FUI.Window.openEdit(url, title, "Edit", "grid", 700, 500, null, "", "", true);
      }
      , bathSetCategory() {
        var that = this;
        var ids = that.dg.getChecked();
        if (ids == '') {
          FUI.Window.showMsg(that, '请选择要设置的行！');
          return false;
        }
        WF.SelectorDialog.setCategory('f2bpm_sys_CustomDataGrid', 'Id', ids, 'CategoryCode', 'CustomDataGridGroup');
      }
    }
  }
</script>