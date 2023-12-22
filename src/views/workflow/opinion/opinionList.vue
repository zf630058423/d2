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
        // ===========SqlKey==========
        sqlkeyArray: [{
          // dataField: 'groupKeyData',
          // sqlkey: 'CB_CategoryGroup',
          // parm: null,
          // flag: null,
          // change: null
        }],
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
        return this.isCollapsed
          ? 'fa fa-angle-double-right'
          : 'fa fa-angle-double-left';
      },
      positionIcon() {
        return this.isCollapsed
          ? 'cursor:pointer; position: relative;left: -5px;'
          : 'cursor:pointer; position: relative;left: 100px;';
      }
    },
    watch: {
      $route() {
        this.load();
      }
    },
    created() {
      this.load();
      // 最后加载Sqlkey
      // FUI.Form.initailSqlKeyComboBox(this);
    },
    mounted() {
      window.myvm = this;
    },

    methods: {
      load() {
        var that = this;
        window.myvm = that;
        const type = Object.toQueryString('type');
        var isOnlyMySelf = type == 'OnlyMySelf';
        that.isOnlyMySelf = isOnlyMySelf;
        const currUserId = that.$store.state.user.author.userId;
        var dg = FUI.DataGrid.Create(that, 'f2bpm_ProcessOpinion', 'f2bpm_ProcessOpinion', 'grid', true, true, true);
        dg.SortName = 'OrderNum asc,createdTime';
        dg.SortOrder = 'desc';
        dg.ShowNumbers = true;
        dg.ExpansMore = true;
        dg.DefaultWhere = 'OpinionType=1';
        if (that.isOnlyMySelf) {
          dg.DefaultWhere = Object.toStringFormat("CreatorId='{0}' s_and OpinionType=0", currUserId);
        }
        dg.ToolBarCustomButton = this.myToolBarCustomButton;
        dg.ToolBarDefaultButtons.ShowDelete = true;
        dg.ToolBarDefaultButtons.ShowAdd = true;
        dg.OperationAction.ShowView = false;
        dg.EnableDblClickEdite = true;
        dg.OperationEditEvent = this.myOperationEditEvent;
        dg.OperationViewEvent = this.myOperationViewEvent;
        dg.OperationCustomButton = this.myOperationCustomButton;
        dg.EditUrl = '/workflow/opinion/opinionEdit/?isOnlyMySelf=' + that.isOnlyMySelf;
        dg.EditTitle = '常用意见';
        dg.Bind();
      },
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
        this.searchParams.CategoryCode = '';
        this.dataGridSearch();
      },
      onTreeSelected(data, treeNode, thisObj) {
        var that = this;
        var id = treeNode.data.id;
        this.searchParams.xxxxx = id;
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
        Object.toAjaxJson(that.dg.GetUrl(), null, parm, true, null,
          function (res) {
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
      myOperationEditEvent(value, row, index) {
        this.showDialogEdit(FUI.FormAction.Edit, row[this.dg.IdField]);
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
        // btns.push({code: 'bathSetCategory', status: 'default', name: '设置分类', icon: 'fa fa-cog'});
        return btns;
      },
      // 工具栏按钮事件
      toolbarButtonClickEvent({ btn }, event) {
        const code = btn.code;
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
        var item = { title: '示自定义', tip: '提示自定义', class: 'fa fa-trash-o', code: 'custom', click: () => this.operationCustomButtonClick(value, row, index) };

        // custBtns.push(item);
        return custBtns;
      },
      operationCustomButtonClick(value) {
        alert('aa' + value);
      },
      opinitionTypeFormatter(row, column, value, index) {
        var cellValue = value;
        let result = cellValue;
        switch (cellValue.toString()) {
          case '0':
            result = '驳回意见';
            break;
          case '1':
            result = '审核意见';
            break;
        }
        return result;
      },
      // 编辑器
      typeFormatter(row, column, value, index) {
        const cellValue = value;
        let result = cellValue;
        switch (cellValue.toString()) {
          case '0':
            result = '个人';
            break;
          case '1':
            result = '公共';
            break;
        }
        return result;
      },
      // 编辑器
      typeEditor(col) {
        var arrType = [{
          Text: '个人',
          Value: '0'
        }, {
          Text: '公共',
          Value: '1'
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