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

        <div v-if="!isCollapsed" class="f2bpm-page-left-content auto-window-height mt5">
          <div class="mytree-cube-box-container">
            <span class="cur  mytree-cube-box " @click="showAll()"><i class="icon icon-quanbu font16"></i> {{$t('all')}}</span>
            <span class="cur  mytree-cube-box" @click="categoryManager('DataServiceGroup')"><i class="icon icon-fenlei font16"></i> {{$t('category')}}</span>
          </div>

          <el-tree ref="mytree" :data="treeData" highlight-current   :filter-node-method="filterTreeNode" :expand-on-click-node="false" default-expand-all @node-click="onTreeSelected" />
        </div>
      </el-aside>
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
        currTenantId: '',
        currentUser: {},
        currCategoryCode: '',
        treeFilterText: '',
        // ======stand:标准区=============
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
    watch: {
      $route() {
        this.load();
      },
      treeFilterText(val) {
        this.$refs.mytree.filter(val);
      }
    }, created() {
      this.load();
    },
    mounted() {
      window.myvm = this;
      window.autoPageHeight();
    },

    methods: {
      load() {
        var $vm = this;
        var that = this;
        var isSys = Object.toQueryString('isSys') || 0;
        const currUser = that.$store.state.user.author;
        that.currentUser = currUser;
        var dg = FUI.DataGrid.Create($vm, 'f2bpm_sys_DataService', 'f2bpm_sys_DataService', 'grid', true, true, true);
        dg.SortName = 'SourceType desc,CreatedTime';
        dg.SortOrder = 'desc';
        // 是否开启双击编辑
        dg.EnableDblClickEdite = true;
        if (isSys == 1) {
          that.currTenantId = 'System';
        } else {
          that.currTenantId = currUser.tenantId;
        }
        dg.DefaultWhere = "TenantId='" + that.currTenantId + "'";
        dg.OperationAction.ShowEdit = true;
        dg.OperationEditEvent = this.myOperationEditEvent;
        dg.OperationViewEvent = this.myOperationViewEvent;
        dg.OperationAfterSaveRowIsRefresh = false;
        dg.OperationAction.ShowView = false;
        dg.IsEnableReloadWhere = true;
        dg.OperationBeforeDeleteEvent = this.beforeDeleteEvent;

        // 工具栏
        dg.ToolBarDefaultButtons.ShowAdd = true;
        dg.ToolBarDefaultButtons.ShowSearch = true;
        dg.ToolBarDefaultButtons.ShowDelete = true;
        dg.OperationCustomButton = this.myOperationCustomButton;
        dg.ToolBarCustomButton = this.myToolBarCustomButton;
        dg.EditUrl = '/workflow/security/dataService/dataServiceEdit/';
        dg.EditTitle = '数据服务';
        dg.Bind();
        that.loadTree();
      },
      collapsedSider() {
        this.isCollapsed = !this.isCollapsed;
      },
      closeEdit() {
        FUI.Window.closeEdit();
      },
      pageChange({ currentPage, pageSize }) {
        this.tablePage.currentPage = currentPage;
        this.tablePage.pageSize = pageSize;
        this.tablePage.startIndex = (currentPage - 1) * pageSize;
        this.getGridData();
      },
      dataGridReSet() {
        var that = this;
        $.each(this.searchParams, function (key, item) {
          that.searchParams[key] = '';
        });
        // 重置查询
        this.dataGridSearch();
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
        var treeUrl = FUI.Handlers.CategoryHandler + '?groupKey=DataServiceGroup';
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
      // 刷新列表
      refreshGrid(parentGridId, parm) {
        var that = this;
        that.dataGridSearch();
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
      sourceTypeFormatter(row, column, value, index) {
        var cellValue = value;
        let result = cellValue;
        switch (cellValue) {
          case 'db':
            result = "<span class='cube bg-grey2 grey'>DB数据库</span>";
            break;
          case 'rest':
            result = "<span class='cube bg-gree'>REST接口</span>";
            break;
        }
        return result;
      },
      // ====stand:标准方法控制结束==============
      beforeDeleteEvent(value, row, index) {
        var that = this;
        if (row.Flag == 'System') {
          FUI.Window.showMsg('系统预定义的不可删除！');
          return false;
        }
        return true;
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
        var url = that.dg.EditUrl;
        var tenantId = that.currTenantId;
        if (formAction == FUI.FormAction.Add) {
          url = that.dg.EditUrl + '?categoryCode=' + that.currCategoryCode + '&tenantId=' + tenantId;
        }
        FUI.Window.openEdit(url, title, formAction, that.dg.GridId, 800, 500, null, that.dg.MainTable, keyId, true);
      },
      // 工具栏按钮
      myToolBarCustomButton() {
        var btns = [];
        btns.push({ code: 'copyAdd', type: 'primary', name: '复制新增', alias: 'Copy', icon: 'fa fa-clipboard' });
        btns.push({ code: 'importDataServiceXml', status: 'default', name: '导入数据服务定义', alias: 'Import', icon: 'fa fa-upload' });
        btns.push({ code: 'bathSetCategory', type: 'primary', name: '设置分类', alias: 'Set Category', icon: 'fa fa-cog' });
        return btns;
      },

      // 操作列自定义按钮
      myOperationCustomButton(h, value, row, index) {
        var custBtns = [];
        var item = { index: 35, title: '导出', alias: 'Export', tip: '导出数据服务定义', class: 'fa  fa-download', code: 'downLoadDataServiceXml', click: () => this.downLoadDataServiceXml(row.Id) };
        custBtns.push(item);

        return custBtns;
      },
      // 工具栏按钮事件
      toolbarButtonClickEvent({ code }, event) {
        const that = this;
        if (code == 'default.add') {
          that.showDialogEdit(FUI.FormAction.Add, '');
        } else if (code == 'default.delete') {
          // 批量删除，默认执行FUI内部的删除，如有需要可用成自己的删除方法
          that.dg.ToolBarBathDelete(that);
        } else {
          var fn = that[code];
          fn();
        }
      },
      categoryManager(groupKey) {
        var that = this;
        var url = '/workflow/security/category/categoryList_bygroupKey?groupKey=' + groupKey;
        var title = "分类管理";
        FUI.Window.openEdit(url, title, "Edit", "grid", 700, 500, null, "", "", true);
      }
      , bathSetCategory() {
        var that = this;
        var ids = this.dg.getChecked();
        if (ids == '') {
          FUI.Window.showMsg(that, '请选择要设置的行！');
          return false;
        }
        WF.SelectorDialog.setCategory('f2bpm_sys_DataService', 'Id', ids, 'CategoryCode', 'DataServiceGroup');
      }
      , importDataServiceXml() {
        FUI.Window.openEdit('/workflow/security/dataService/dataServiceImport', '导入数据服务定义', FUI.FormAction.Edit, '', 550, 400);
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
        var data = Object.toAjaxJson('/workflow/security/dataService/', 'copyAdd', { 'id': id });
        if (data.success) {
          that.dg.Reload();
          FUI.Window.showMsg2(that, data.msg, null, 1);
        } else {
          FUI.Window.showMsg2(that, data.msg);
        }
      }
      , downLoadDataServiceXml(id) {
        if (id == '') {
          FUI.Window.showMsg('请选择要导出的数据服务定义！');
          return false;
        }
        var data = Object.toAjaxDownloadFile('/workflow/security/dataService/', 'downLoadDataServiceXml', {
          id: id
        });
      }
      , implTypeFormatter(row, column, value, index) {
        const cellValue = value;
        let result = cellValue;
        switch (cellValue.toString()) {
          case 'GeneralQuery':
            result = '普通查询';
            break;
          case 'Autocompleter':
            result = '自动完成';
            break;
          case 'Cascselect':
            result = '级联选择';
            break;
          case 'DropSelect':
            result = '选项查询';
            break;
          case 'Tree':
            result = '树形结构';
            break;
          case 'Workflow':
            result = '流程引擎';
            break;

        }
        return result;
      }
    }

  }
</script>