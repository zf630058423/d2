<template>
  <div class="f2bpm-page-layout">
    <el-container>
      <el-main class="f2bpm-page-right">
        <f2bpm-gridsearchform @expandclick="expandClick" extenddes="<span class='red font14'> 》》》非常规操作，数据管理维护，请谨慎操作！！！</span>" :tableform="tableForm" @searchformbtnclick="searchFormbtnClick" @updatevalue="updateFieldValue" />
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
        // ======stand:标准区=============
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
        headerMenus: Object.toClone(FUI.DataGridProperty.headerMenus),
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
        return this.isCollapsed ? 'fa fa-angle-double-right' : 'fa fa-angle-double-left';
      },
      positionIcon() {
        return this.isCollapsed ? 'cursor:pointer; position: relative;left: -5px;' : 'cursor:pointer; position: relative;left: 100px;';
      }
    },
    created() {
      var that = this;
      var dg = FUI.DataGrid.Create(that, 'key_FormDefJoinBusObjectInnerJoinTableDefinition', 'f2bpm_form_BusObject', 'grid', true, true, true);
      dg.ConfigTableName = 'busObjectManagerList';
      dg.SortName = 'TableName ';
      dg.SortOrder = 'asc';
      dg.ShowNumbers = true;
      dg.ExpansMore = false;
      dg.DefaultWhere = 'IsMain=1';
      dg.ToolBarDefaultButtons.ShowDelete = false;
      dg.ToolBarDefaultButtons.ShowAdd = false;
      dg.OperationAction.ShowView = false;
      dg.OperationAction.ShowEdit = false;
      dg.EnableDblClickEdite = true;
      dg.OperationDeleteEvent = this.myOperationDeleteEvent;
      dg.OperationEditEvent = this.myOperationEditEvent;
      dg.OperationViewEvent = this.myOperationViewEvent;
      dg.ToolBarCustomButton = this.myToolBarCustomButton;
      dg.OperationCustomButton = this.myOperationCustomButton;
      dg.EditUrl = __webpath + '/workflow/smartForm/busObjectEdit/';
      dg.EditTitle = '业务对象';
      dg.Bind();
    },
    mounted() {
      window.myvm = this;
    },

    methods: {
      closeEdit() {
        FUI.Window.closeEdit();
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
        this.showDialogEdit(FUI.FormAction.View, row['BusObjectId']);
      },
      myOperationDeleteEvent(value, row, index) {
        var that = this;
        FUI.Window.confirm(that, '<em>请警慎操作，</em>您确定要删除【' + row.BusObjectTitle + '】及所有关联数据吗？', null, function (r) {
          var data = Object.toAjaxJson(FUI.Handlers.SmartFormHandler, 'deleteBusObjectAndAllCascade', {
            busObjectId: row.BusObjectId,
            busObjectTitle: row.BusObjectTitle
          });
          if (data.success == true) {
            that.dg.Reload();
          } else {
            FUI.Window.showMsg(that, data.msg);
          }
        });
      },
      myOperationEditEvent(value, row, index) {
        this.showDialogEdit(FUI.FormAction.Edit, row['BusObjectId']);
      },
      // 工具栏按钮
      myToolBarCustomButton() {
        var btns = [];
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
        var item1 = { title: '编辑', alias: 'Edit', tip: '编辑', class: 'fa fa-edit', code: 'editSubTable', click: () => this.editSubTable(value, row, index) };
        var item2 = { title: '业务对象', alias: 'Business Object', tip: '业务对象', class: 'fa fa-table', code: 'editFormDefDesignier', click: () => this.editFormDefDesignier(value, row, index) };
        custBtns.push(item1);
        custBtns.push(item2);
        return custBtns;
      },
      // 业务对象
      editSubTable(value, row, index) {
        var that = this;
        var busObjectId = row.BusObjectId;
        FUI.Window.openEdit('/workflow/smartForm/formBusObjectEdit/', '编辑业务对象', FUI.FormAction.Edit, that.dg.GridId, 880, 450, null, that.dg.MainTable, busObjectId, true);
      },
      // 表单定义
      editFormDefDesignier(value, row, index) {
        var that = this;
        var formDefId = row.FormDefId;
        FUI.Window.openEdit('/workflow/smartForm/busObjectSubsEdit?formDefId=' + formDefId, '业务对象关系', FUI.FormAction.Edit, that.dg.GridId, 880, 450, null, 'f2bpm_form_FormDef', formDefId, true);
      },

      // 编辑器
      refTypeFormatter(col) {
        var arrType = [{
          Text: '多记录',
          Value: 'hasMany'
        }, {
          Text: '单条记录',
          Value: 'hasOne'
        }];
        return {
          type: 'combobox',
          options: {
            valueField: 'Value',
            textField: 'Text',
            data: arrType
          }
        };
      }
    }
  }
</script>