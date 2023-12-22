<template>
  <div class="f2bpm-page-layout">
    <el-container>
      <el-aside ref="sideLeft" v-if="ismanager" class="f2bpm-page-left" hide-trigger collapsible :width="isCollapsed?'20px':'200px'">
        <div class="f2bpm-panel-head f2bpm-panel-head-bg">
          <i class="fa fa-server mt10" />标签类型管理
        </div>
        <ul class="ul-nav">
          <li @click="changeType('userRelation')" :class="infoType=='userRelation'?'selected':''"><a href="javascript:void(0)" name="userRelation"><i class="fa fa-cube"></i>人员直线关系</a></li>
          <li @click="changeType('relationTree')" :class="infoType=='relationTree'?'selected':''"><a href="javascript:void(0)" name="relationTree"><i class="fa fa-cube"></i>人员汇报树</a></li>
          <li @click="changeType('departLeader')" :class="infoType=='departLeader'?'selected':''"><a href="javascript:void(0)" name="departLeader"><i class="fa fa-cube"></i> 部门分管领导</a></li>
          <li @click="changeType('orgLevel')" :class="infoType=='orgLevel'?'selected':''"><a href="javascript:void(0)" name="orgLevel"><i class="fa fa-cube"></i>部门级别标签</a></li>
        </ul>
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
        treeFilterText: '',
        isCollapsed: false,
        ismanager: false,
        infoType: "",
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
          // 查询
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

    },
    created() {
      var that = this;
      //const currUserId = that.$store.state.user.author.userId;
      var infoType = Object.toQueryString("infoType") || "";
      var manager = Object.toQueryString("manager") || "";
      that.ismanager = manager == "1";
      that.infoType = infoType;
      var dg = FUI.DataGrid.Create(that, 'f2bpm_sys_relation_type', 'f2bpm_sys_relation_type', 'grid', true, true, true);
      dg.SortName = 'id';
      dg.SortOrder = 'desc';
      dg.ShowNumbers = true;
      dg.ExpansMore = true;
      if (infoType && manager == "") {
        dg.DefaultWhere = "info_type='" + infoType + "'";
      }
      dg.ToolBarCustomButton = this.myToolBarCustomButton;
      dg.ToolBarDefaultButtons.ShowDelete = true;
      dg.ToolBarDefaultButtons.ShowAdd = true;
      dg.OperationAction.ShowView = true;
      dg.EnableDblClickEdite = true;
      dg.OperationDeleteEvent = this.myOperationDeleteEvent;
      dg.OperationEditEvent = this.myOperationEditEvent;
      dg.OperationViewEvent = this.myOperationViewEvent;
      dg.OperationCustomButton = this.myOperationCustomButton;
      dg.EditUrl = '/workflow/security/relation/relationTypeEdit';
      dg.EditTitle = '关系类型';
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
      changeType(infoType) {
        var that = this;
        that.infoType = infoType;
        that.searchParams.infoType = infoType;
        that.dataGridSearch();
      }
      , refreshGrid(parentGridId, parm) {
        var that = this;
        that.dataGridSearch();
      },
      dataGridReSet() {
        var that = this;
        $.each(this.searchParams, function (key, item) {
          if (key != "infoType") {
            that.searchParams[key] = '';
          }
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
      myOperationDeleteEvent(value, row, index) {
        var that = this;
        var tip = "您确定要删除【" + row.typeTitle + "】吗？";
        var id = row.id;
        FUI.Window.confirm(that, tip, null, function () {
          var res = Object.toAjaxJson('/workflow/security/relation/', 'deleteRelationType', { 'id': id });
          if (res.success == true) {
            that.refreshGrid();
          } else {
            FUI.Window.showMsg(that, res.msg);
          }
        });
      }
      , myOperationViewEvent(value, row, index) {
        this.showDialogEdit(FUI.FormAction.View, row[this.dg.IdField]);
      },
      myOperationEditEvent(value, row, index) {
        this.showDialogEdit(FUI.FormAction.Edit, row[this.dg.IdField]);
      },
      showDialogEdit(formAction, keyId) {
        var that = this;
        var title = formAction == FUI.FormAction.Add ? '新增' + that.dg.EditTitle : '编辑' + that.dg.EditTitle;
        var url = that.dg.EditUrl;
        if (that.infoType && formAction == "Add") {
          url += "?infoType=" + that.infoType;
        }
        FUI.Window.openEdit(url, title, formAction, that.dg.GridId, 700, 550, null, that.dg.MainTable, keyId);
      },
      // 工具栏按钮
      myToolBarCustomButton() {
        var that = this;
        var btns = [];
        if (that.infoType != "") {
          btns.push({ code: 'closeEdit', status: 'default', name: '关闭', alias: 'Close', icon: '' });
        }
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
          that.bathDelete();

        } else {
          var fn = that[code];
          fn();
        }
      },
      bathDelete() {
        var that = this;
        var vm = this;
        var ids = FUI.Grid.getGridChecked(vm, 'grid', 'id');
        if (!ids) {
          FUI.Window.showMsg(vm, '请选择要删除的记录！');
          return false;
        }
        var tip = "您确定要删除所选记录吗？";
        FUI.Window.confirm(that, tip, null, function () {
          var res = Object.toAjaxJson('/workflow/security/relation/', 'deleteRelationType', { 'id': ids });
          if (res.success == true) {
            that.refreshGrid();
          } else {
            FUI.Window.showMsg(that, res.msg);
          }
        });
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
      //JS显示格式化示例
      infoTypeFormatter(row, column, value, index) {
        let result = value;
        switch (value.toString()) {
          case 'departLeader':
            result = '部门分管领导';
            break;
          case 'userRelation':
            result = '人员直线关系';
            break;
          case 'relationTree':
            result = '人员汇报树';
            break;
          case 'orgLevel':
            result = '部门级别标签';
            break;
        }
        return result;
      }
    }
  }
</script>
<style>
  .ul-nav>li>.selected {
    color: #000000;
    background-color: #f1f1f1;
    border: 0px;
  }
</style>