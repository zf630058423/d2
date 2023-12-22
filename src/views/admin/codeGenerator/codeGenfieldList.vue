<template>
  <div class="f2bpm-page-layout">
    <el-container>
      <el-main class="f2bpm-page-right">
        <f2bpm-gridsearchform :tableform="tableForm" :extenddes="extenddes" @searchformbtnclick="searchFormbtnClick" @updatevalue="updateFieldValue" />
        <f2bpm-datagrid ref="grid" grid="grid" :toolbar="tableToolbar" :context-menu="{header: {options: headerMenus},className: 'my-menus'}" :pager-config="tablePage" :data="tableData" :columns="tableColumn" @cell-dblclick="celldbClick" @toolbar-button-click="toolbarButtonClickEvent" @header-contextmenu="contextMenuClickEvent" @page-change="pageChange" @sort-change="sortChange" />
      </el-main>
    </el-container>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        refGenId: '',
        genTitle: '',
        tableName: '',
        // ======stand:标准区=============
        extenddes: '',
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
      var refGenId = Object.toQueryString('refGenId');

      // 获取表定义信息
      var res = Object.toAjaxJson("/admin/codeGenerator/", 'getCodeGeneratorModel', { keyId: refGenId });
      if (res.success) {
        var generatorDef = res.data;
        that.tableName = generatorDef.tableName;
        that.genTitle = generatorDef.genTitle;
      } else {
        FUI.Window.showMsg(res.msg);
        return;
      }
      that.tablePage.pageSize = 1000;
      that.refGenId = refGenId;
      var dg = FUI.DataGrid.Create(that, 'f2bpm_sys_code_genfield', 'f2bpm_sys_code_genfield', 'grid', true, true, true);
      dg.SortName = 'field_order_no';
      dg.SortOrder = 'ASC';
      dg.DefaultWhere = "ref_gen_id='" + refGenId + "'";
      dg.ShowNumbers = true;
      dg.ExpansMore = false;
      // 是否开启双击编辑
      dg.EnableDblClickEdite = true;
      dg.OperationAction.ShowDelete = true;
      dg.OperationAction.ShowEdit = true;
      dg.ShowNumbers = true;
      dg.OperationAfterSaveRowIsRefresh = true;
      dg.OperationAction.ShowView = false;
      dg.ToolBarDefaultButtons.ShowAdd = true;
      dg.ToolBarDefaultButtons.ShowDelete = that.isCreateTable != 1;
      dg.OperationEditEvent = this.myOperationEditEvent;
      dg.OperationViewEvent = this.myOperationViewEvent;
      dg.OperationCustomButton = this.myOperationCustomButton;
      dg.ToolBarCustomButton = this.myToolBarCustomButton;
      dg.EditUrl = __webpath + '/admin/codeGenerator/codeGenfieldEdit/?refGenId=' + that.refGenId;
      dg.EditTitle = '字段控件配置';
      dg.Bind();
      that.extenddes = '<span>【' + that.genTitle + '<em> [' + that.tableName + ']</em>】</span>';
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
            FUI.Window.showMsg2(that, res.msg);
          }
        });
      },
      // ====stand:标准方法控制结束==============
      myOperationDeleteEvent(value, row, index) {
        var param = { fieldId: value };
        var result = Object.toAjaxJson("/admin/codeGenerator/", 'deleteCodeGenfieldById', param);
        if (result.success) {
          FUI.Window.showMsg2(result.msg, null, result.success ? 1 : 7);
          dg.Reload();
        } else {
          FUI.Window.showMsg2(result.msg);
        }
      },
      myOperationViewEvent(value, row, index) {
        this.showDialogEdit(FUI.FormAction.View, row[this.dg.IdField]);
      },
      myOperationEditEvent(value, row, index) {
        this.showDialogEdit(FUI.FormAction.Edit, row[this.dg.IdField], row.IsCreatedInDB);
      },
      showDialogEdit(formAction, keyId, isCreatedInDB) {
        var that = this;
        var title = formAction == FUI.FormAction.Add ? '新增' + that.dg.EditTitle : '编辑' + that.dg.EditTitle;
        var url = formAction == FUI.FormAction.Add ? that.dg.EditUrl : that.dg.EditUrl;
        FUI.Window.openEdit(url, title, formAction, that.dg.GridId, 800, 530, null, that.dg.MainTable, keyId);
      },
      // 工具栏按钮
      myToolBarCustomButton() {
        var that = this;
        var btns = [];
        btns.push({ code: 'autoGenerateFieldByGenerator', status: 'default', name: '从数据表钻取字段', icon: 'fa fa-cogs' });
        btns.push({ code: 'generatorCode', status: 'default', name: '生成代码', icon: 'fa fa-cogs' });
        btns.push({ code: 'closeEdit', status: 'default', name: '关闭', icon: 'fa fa-close' });
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
        var that = this;
        var custBtns = [];
        var value = row.IsCreatedInDB;
        if (value == '' || value == null || value == undefined) {
          return custBtns;
        }
        if (value == '1' || value == 1) {
          return custBtns;
        }
        if (that.isCreateTable == 1) {
          var item = { title: '生成物理字段', tip: '生成物理字段', class: 'fa fa-clone', code: 'generateOneDBColumn', click: () => this.generateOneDBColumn(row.ColumnId) };
          custBtns.push(item);
        }
        return custBtns;
      },
      autoGenerateFieldByGenerator() {
        var that = this;
        FUI.Window.confirm(that, '从数据库表获取字段吗？', null, function (r) {
          var param = {
            refGenId: that.refGenId
          };
          var result = Object.toAjaxJson("/admin/codeGenerator/", 'autoGenerateFieldByGenerator', param);
          if (result.success) {
            that.refreshGrid();
          } else {
            FUI.Window.showMsg(that, result.msg);
          }
        });
      }
      , generatorCode() {
        var that = this;
        FUI.Window.confirm(that, '您确定要生成代码吗？', null, function (r) {
          var param = {
            refGenId: that.refGenId
          };
          Object.toAjaxDownloadFile("/admin/codeGenerator/", 'generatorCode', param);
        });
      }


    }
  }
</script>