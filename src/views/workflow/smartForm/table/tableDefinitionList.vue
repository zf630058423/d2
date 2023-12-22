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


        <div v-if="!isCollapsed" class="auto-window-height f2bpm-page-left-content mt5">
          <span class="fa fa-home cur ml10 font12 " @click="showAll()">{{$t('all')}}</span>
          <el-tree ref="mytree" :data="treeData" :expand-on-click-node="false" :filter-node-method="filterTreeNode" default-expand-all @node-click="onTreeSelected" />
        </div>
      </el-aside>
      <el-main class="f2bpm-page-right">
        <f2bpm-gridsearchform @expandclick="expandClick" extenddes="<span class='red font14'> 》》》非常规操作，只做数据管理维护，正常操作请到数据建模中操作，请谨慎操作！！！</span>" :tableform="tableForm" @searchformbtnclick="searchFormbtnClick" @updatevalue="updateFieldValue" />
        <f2bpm-datagrid ref="grid" grid="grid" :expand-subheight="80" :toolbar="tableToolbar" :context-menu="{header: {options: headerMenus},className: 'my-menus'}" :pager-config="tablePage" :data="tableData" :columns="tableColumn" :expand-search="expandSearch" @cell-dblclick="celldbClick" @toolbar-button-click="toolbarButtonClickEvent" @header-contextmenu="contextMenuClickEvent" @page-change="pageChange" @sort-change="sortChange" />
      </el-main>
    </el-container>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        expandSearch: "",
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
    }, computed: {
      countGridHeight() {
        return $(document).height() - 145;
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
      var $vm = this;
      var that = this;
      var language = that.$store.state.app.language;
      that.language = language;
      var dg = FUI.DataGrid.Create($vm, 'f2bpm_form_TableDefinition', 'f2bpm_form_TableDefinition', 'grid', true, true, true);
      dg.SortName = 'CreatedTime';
      dg.SortOrder = 'desc';
      // 是否开启双击编辑
      dg.EnableDblClickEdite = true;
      dg.ExpansMore = true;
      dg.OperationBeforeDeleteEvent = this.myOperationBeforeDeleteEvent;
      dg.OperationAction.ShowEdit = true;
      dg.OperationEditEvent = this.myOperationEditEvent;
      dg.OperationViewEvent = this.myOperationViewEvent;
      dg.OperationDeleteEvent = this.myDeleteEvent;
      dg.OperationAfterSaveRowIsRefresh = false;
      dg.OperationAction.ShowView = false;
      dg.IsEnableReloadWhere = true;
      // 工具栏
      dg.ToolBarDefaultButtons.ShowAdd = true;
      dg.ToolBarDefaultButtons.ShowSearch = true;
      dg.ToolBarDefaultButtons.ShowDelete = false;
      dg.OperationCustomButton = this.myOperationCustomButton;
      dg.ToolBarCustomButton = this.myToolBarCustomButton;
      dg.EditUrl = '/workflow/smartForm/table/tableDefinitionEdit/';
      dg.EditTitle = '编辑主数据表';
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
      refreshTree() {
        var that = this;
        that.loadTree();
        that.showAll();
      },
      loadTree() {
        var that = this;
        var treeUrl = FUI.Handlers.CategoryHandler + '?groupKey=BusinessObject';
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
      myOperationBeforeDeleteEvent(value, row, index) {
        if ((row.IsCreateTable == true || row.IsCreateTable == 1) && !row.IsOuterTable) {
          FUI.Window.showMsg(this, row.TableTitle + '的物理表已生成，不可删除！');
          return false;
        }
        return true;
      },
      // ====stand:标准方法控制结束==============
      myDeleteEvent(value, row, index) {
        var that = this;
        FUI.Window.confirm(that, '确定要删除吗？', null, function () {
          var data = Object.toAjaxJson(FUI.Handlers.SmartFormHandler, 'deleteTable', { tableId: value });
          if (data.success == true) {
            that.dg.Reload();
          } else {
            FUI.Window.showMsg(that, data.msg);
          }
        });
      },
      myBeforeDblClickEditeEvent(value, row, index) {
        if (row.IsCreated) {
          FUI.Window.showLeftBelowMsg(this, '表已生成，如需修改请点击“编辑”按钮！');
        }
        return !row.IsCreated;
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
        if (formAction == FUI.FormAction.Add) {
          url = that.dg.EditUrl + '?categoryCode=' + that.currCategoryCode;
        }
        FUI.Window.openEdit(url, title, formAction, that.dg.GridId, 800, 500, null, that.dg.MainTable, keyId);
      },
      // 工具栏按钮
      myToolBarCustomButton() {
        var btns = [];
        btns.push({ code: 'downLoadTableDef', status: 'default', name: '导出表定义SQL', alias: 'Export', icon: 'fa fa-download' });
        btns.push({
          code: 'importExistTableDef',
          status: 'default',
          name: '导入外部表',
          alias: 'Import Out Table',
          icon: 'fa fa-download',
          title: '导入一个已存在的数据库物理表，注意导入后将会在物理表中自动添加下面字段供流程关联使用：MyId，Wiid，MyParentId，BusinessKey，FormId'
        });
        btns.push({
          code: 'backTableAndData',
          status: 'default',
          name: '备份物理表及数据',
          alias: 'Back Up Table',
          icon: 'fa fa-database',
          title: '备份物理表及数据'
        });
        btns.push({ code: 'bathSetCategory', status: 'default', name: '设置分类', alias: 'Set Category', icon: 'fa fa-cog' });
        return btns;
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
      // 操作列自定义按钮
      myOperationCustomButton(h, value, row, index) {
        var custBtns = [];
        var item = { title: '数据表定义', tip: '数据表定义', alias: 'Table Defined', class: 'fa fa-table', code: 'opTableColumn', click: () => this.opTableColumn(value, row, index) };
        var item2 = { index: 99, title: '被引用的业务对象', alias: 'Is Referenced', tip: '查看被引用的业务对象', class: 'fa fa-cubes', code: 'showBusinessObject', click: () => this.showBusinessObject(value, row, index) };
        custBtns.push(item);
        custBtns.push(item2);
        return custBtns;
      },
      opTableColumn(value, row, index, code) {
        const tableId = row.TableId;
        const tableTitle = row.TableTitle;
        FUI.Window.openEdit(__webpath + '/workflow/smartForm/tableColumnList/?tableId=' + tableId, '数据表【' + tableTitle + '】', FUI.FormAction.Edit, null, 880, 450, null, null, null, true, null, null, false);
      },
      showBusinessObject(value, row, index) {
        FUI.Window.openEdit(__webpath + '/workflow/smartForm/table/showBusObjectOfTable/?tableId=' + row.TableId, '表名【' + row.TableTitle + '】被引用到的业务对象', FUI.FormAction.View, this.dg.GridId, 700, 400, null, '', this.dg.MainTable, false);
      },
      importExistTableDef() {
        FUI.Window.openEdit(__webpath + '/workflow/smartForm/table/tableDefinitionImprot/?categoryCode=' + this.currCategoryCode, '导入外部表', 'Add', this.dg.GridId, this.dg.EditWidth, this.dg.EditHeight + 50, null, this.dg.MainTable, null);
      },
      backTableAndData() {
        var that = this;
        var dbtableNames = that.dg.getChecked('DbTableName');
        if (dbtableNames == '') {
          FUI.Window.showMsg(that, '请选择要备份的物理表！');
          return false;
        }

        FUI.Window.confirm(that, '您确定要备份所选物理表及数据？', '温馨提示', function (r) {
          var data = Object.toAjaxJson(FUI.Handlers.SmartFormHandler, 'backupDataBaseTableAndData', {
            dbtableNames: dbtableNames
          }, true, null, function (data) {
            if (data.success) {
              FUI.Window.showMsg(that, data.msg, null, 1);
            } else {
              FUI.Window.showMsg(that, data.msg);
            }
          });
        });
      },
      downLoadTableDef() {
        var that = this;
        var ids = this.dg.getChecked();
        if (ids == '') {
          FUI.Window.showMsg(that, '请选择要导出的表！');
          return false;
        }
        var data = Object.toAjaxDownloadFile(FUI.Handlers.SmartFormHandler, 'downLoadTableDef', {
          tableIds: ids
        });
      },
      bathSetCategory() {
        var that = this;
        var ids = this.dg.getChecked();
        if (ids == '') {
          FUI.Window.showMsg(that, '请选择要设置的行！');
          return false;
        }
        WF.SelectorDialog.setCategory('f2bpm_form_TableDefinition', 'TableId', ids, 'CategoryCode', 'BusinessObject');
      }
    }

  }
</script>