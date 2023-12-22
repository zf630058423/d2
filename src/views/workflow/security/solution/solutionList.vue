<template>
  <div class="f2bpm-page-layout">
    <el-container>
      <el-aside
        ref="sideLeft"
        class="f2bpm-page-left"
        hide-trigger
        collapsible
        :width="isCollapsed?'20px':'200px'"
      >
        <div class="f2bpm-panel-head">
          <div
            v-if="!isCollapsed"
            class="f2bpm-left-search-div"
          >
            <el-input
              v-model="treeFilterText"
              class="left-htead-treeFilterText-box"
              size="small"
              clearable
              :placeholder="$t('enterKey')"
              autocomplete="off"
              prefix-icon="el-icon-search"
            />
          </div>
          <div style=" float: right;line-height:35px;padding-right: 5px;">
            <i
              v-if="!isCollapsed"
              :title="$t('refresh')"
              class="fa fa-refresh  cur mr10 font12 "
              @click="loadTree()"
            />
            <i
              title="收起/展开"
              :class="rotateIcon"
              @click="collapsedSider"
            />
          </div>
        </div>
        <div
          v-if="!isCollapsed"
          class="f2bpm-page-left-content auto-window-height-bigger mt4"
        >
          <span
            class="fa fa-home cur ml10 font12 "
            @click="showAll()"
          >{{$t('all')}}</span>
          <span
            class="fa fa-cog cur ml10 font12 "
            @click="categoryManager('SolutionGroup')"
          > {{$t('category')}}</span>
          <el-tree
            ref="mytree"
            :data="treeData"
            :filter-node-method="filterTreeNode"
            :expand-on-click-node="false"
            default-expand-all
            @node-click="onTreeSelected"
          />
        </div>
      </el-aside>
      <el-main class="f2bpm-page-right">
        <f2bpm-gridsearchform
          @expandclick="expandClick"
          :tableform="tableForm"
          @searchformbtnclick="searchFormbtnClick"
          @updatevalue="updateFieldValue"
        />
        <f2bpm-datagrid
          :expand-search="expandSearch"
          ref="grid"
          grid="grid"
          :toolbar="tableToolbar"
          :context-menu="{header: {options: headerMenus},className: 'my-menus'}"
          :pager-config="tablePage"
          :data="tableData"
          :columns="tableColumn"
          @cell-dblclick="celldbClick"
          @toolbar-button-click="toolbarButtonClickEvent"
          @header-contextmenu="contextMenuClickEvent"
          @page-change="pageChange"
          @sort-change="sortChange"
        />
      </el-main>
    </el-container>
  </div>
</template>

<script>
export default {
  data() {
    return {
      expandSearch: "",
      treeFilterText: "",
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
        categoryCode: "",
      },
    };
  },
  computed: {
    countGridHeight() {
      return $(document).height() - global_datagridHeightDiff;
    },
    rotateIcon() {
      return this.isCollapsed
        ? "fa fa-angle-double-right"
        : "fa fa-angle-double-left ml4";
    },
    positionIcon() {
      return this.isCollapsed
        ? "cursor:pointer; position: relative;left: -5px;"
        : "cursor:pointer; position: relative;left: 100px;";
    },
  },
  watch: {
    treeFilterText(val) {
      this.$refs.mytree.filter(val);
    },
  },
  created() {
    var that = this;
    var dg = FUI.DataGrid.Create(
      that,
      "f2bpm_sys_solution",
      "f2bpm_sys_solution",
      "grid",
      true,
      true,
      true
    );
    dg.SortName = "created_time";
    dg.SortOrder = "desc";
    dg.ShowNumbers = true;
    dg.ExpansMore = true;
    dg.ToolBarDefaultButtons.ShowDelete = true;
    dg.ToolBarDefaultButtons.ShowAdd = true;
    dg.OperationAction.ShowView = false;
    dg.EnableDblClickEdite = true;
    dg.ToolBarCustomButton = that.myToolBarCustomButton;
    dg.OperationEditEvent = that.myOperationEditEvent;
    dg.OperationViewEvent = that.myOperationViewEvent;
    dg.OperationCustomButton = that.myOperationCustomButton;
    dg.OperationDeleteEvent = that.myOperationDeleteEvent;
    dg.EditUrl = "/workflow/security/solution/solutionEdit";
    dg.EditTitle = "编辑";
    dg.Bind();
    that.loadTree();
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
    refreshTree() {
      var that = this;
    },
    showAll() {
      this.searchParams.appCategoryID = "";
      this.dataGridSearch();
    },
    loadTree() {
      var that = this;
      var treeUrl = FUI.Handlers.CategoryHandler + "?groupKey=SolutionGroup";
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
      this.searchParams.appCategoryID = this.currCategoryCode;
      this.dataGridSearch();
    },
    // 刷新列表
    refreshGrid(parentGridId, parm) {
      var that = this;
      that.dataGridSearch();
    },
    showAll() {
      this.dataGridSearch();
    },
    onTreeSelected(data, treeNode, thisObj) {
      var that = this;
      var id = treeNode.data.id;
      this.searchParams.categoryCode = id;
      that.dataGridSearch();
    },
    dataGridReSet() {
      var that = this;
      $.each(this.searchParams, function (key, item) {
        that.searchParams[key] = "";
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
      Object.toAjaxJson(
        that.dg.GetUrl(),
        null,
        parm,
        true,
        null,
        function (res) {
          if (res.success) {
            that.tableData = res.rows;
            that.tablePage.total = res.total;
            that.tablePage.pageCount = res.pageCount;
          } else {
            FUI.Window.showMsg(res.msg);
          }
        }
      );
    },
    myOperationDeleteEvent(value, row, index) {
      this.deleteSolution(row.solutionTitle, row[this.dg.IdField]);
    },
    myOperationViewEvent(value, row, index) {
      this.showDialogEdit(FUI.FormAction.View, row[this.dg.IdField]);
    },
    myOperationEditEvent(value, row, index) {
      this.showDialogEdit(FUI.FormAction.Edit, row);
    },
    showDialogEdit(formAction, row) {
      var that = this;
      var title =
        formAction == FUI.FormAction.Add
          ? "新增" + that.dg.EditTitle
          : "编辑" + that.dg.EditTitle;
      var url = that.dg.EditUrl;
      if (formAction == "Add") {
        url =
          that.dg.EditUrl + "?categoryCode=" + that.searchParams.categoryCode;
        FUI.Window.openEdit(
          url,
          title,
          formAction,
          that.dg.GridId,
          700,
          550,
          null,
          that.dg.MainTable,
          null
        );
      } else if (formAction == FUI.FormAction.Edit) {
        that.formModeDesigner(row.id, row.refFormDefId, row.solutionTitle);
        return false;
      }
    },
    formModeDesigner(solutionId, formDefId, formDefName) {
      var that = this;
      localStorage.removeItem("solution_activeIndex");
      FUI.Window.openEdit(
        __webpath +
          "/workflow/smartForm/form/solution_formModeDesigner?solutionId=" +
          solutionId +
          "&formDefId=" +
          formDefId,
        "",
        FUI.FormAction.Edit,
        this.dg.GridId,
        880,
        450,
        null,
        "",
        "",
        true
      );
    },
    deleteSolution(name, id) {
      var that = this;
      FUI.Window.confirm("您确定要删除【" + name + "】?", null, function () {
        var res = Object.toAjaxJson("/workflow/security/solution/", "delete", {
          id: id,
        });
        if (res.success) {
          that.dataGridSearch();
        } else {
          FUI.Window.showMsg(res.msg);
        }
      });
    },
    // 工具栏按钮
    myToolBarCustomButton() {
      var btns = [];
      return btns;
    },
    // 工具栏按钮事件
    toolbarButtonClickEvent({ btn }, event) {
      const code = btn.code;
      const that = this;
      if (code == "closeEdit") {
        FUI.Window.closeEdit();
      } else if (code == "default.add") {
        that.showDialogEdit(FUI.FormAction.Add, "");
      } else if (code == "default.delete") {
        // 批量删除，默认执行FUI内部的删除，如有需要可用成自己的删除方法
        that.dg.ToolBarBathDelete(that);
      } else {
        var fn = that[code];
        fn();
      }
    },
    iconfaformatter(row, column, value, index) {
      return "<i class='" + value + "'></i>";
    },
    solutionTypeFormatter(row, column, value, index) {
      var result = value;
      switch (value) {
        case "workflowForm":
          result = '<span class="cube bg-blue"> 有流程表单</span>';
          break;
        case "noWorkflowForm":
          result = '<span class="cube bg-gree"> 无流程表单</span>';
          break;
      }
      return result;
    },
    //汇报树分类
    categoryManager(groupKey) {
      var that = this;
      var url =
        "/workflow/security/category/categoryList_bygroupKey?groupKey=" +
        groupKey;
      var title = "分类管理";
      FUI.Window.openEdit(
        url,
        title,
        "Edit",
        "grid",
        700,
        500,
        null,
        "",
        "",
        true
      );
    },
    // 操作列自定义按钮
    myOperationCustomButton(h, value, row, index) {
      var that = this;
      var custBtns = [];
      var item = {
        title: "示自定义",
        tip: "提示自定义",
        class: "fa fa-trash-o",
        code: "custom",
        click: () => this.operationCustomButtonClick(value, row, index),
      };

      // custBtns.push(item);
      return custBtns;
    },
  },
};
</script>