<template>
  <div class="f2bpm-page-layout">
    <el-container>
      <el-header style="padding: 0;padding-left: 5px;border-bottom: solid #e8eaec  1px;height: 40px;padding-left: 5px;">
        <el-tabs :value="actionName" @tab-click="tabsClick">
          <el-tab-pane label="栏目管理" name="goFence" />
          <el-tab-pane label="门户管理" name="goPortal" />
        </el-tabs>
      </el-header>
      <el-container>
        <el-aside ref="sideLeft" class="f2bpm-page-left" hide-trigger collapsible :width="isCollapsed?'30px':'210px'">
          <div class="f2bpm-panel-head">
            <div v-if="!isCollapsed" class="f2bpm-left-search-div">
              <el-input v-model="treeFilterText" class="left-htead-treeFilterText-box" size="small" clearable :placeholder="$t('enterKey')" autocomplete="off" prefix-icon="el-icon-search" />
            </div>
            <div class="f2bpm-left-search-button-div" style="z-index:999;">
              <i v-if="!isCollapsed" :title="$t('refresh')" class="icon icon-shuaxin  cur mr10 font12  " @click="loadTree()"></i>
              <i title="收起/展开" :class="rotateIcon" @click="collapsedSider" />
            </div>
          </div>
          <div v-if="!isCollapsed" class="f2bpm-page-left-content auto-window-height-smaller mt5">
            <div class="mytree-cube-box-container">
              <span class="cur  mytree-cube-box " @click="showAll()"><i class="icon icon-quanbu font16"></i> {{$t('all')}}</span>
              <span class="cur  mytree-cube-box" @click="categoryManager('AppFenceGroup')"><i class="icon icon-fenlei font16"></i> {{$t('category')}}</span>
            </div>
            <el-tree ref="mytree" :data="treeData" :filter-node-method="filterTreeNode" :expand-on-click-node="false" default-expand-all @node-click="onTreeSelected" />
          </div>
        </el-aside>
        <el-main class="f2bpm-page-right">
          <f2bpm-gridsearchform :tableform="tableForm" @expandclick="expandClick" @searchformbtnclick="searchFormbtnClick" @updatevalue="updateFieldValue" />
          <f2bpm-datagrid ref="grid" grid="grid" height="full-230" :expand-search="expandSearch" :toolbar="tableToolbar" :context-menu="{header: {options: headerMenus},className: 'my-menus'}" :pager-config="tablePage" :data="tableData" :columns="tableColumn" @cell-dblclick="celldbClick" @toolbar-button-click="toolbarButtonClickEvent" @header-contextmenu="contextMenuClickEvent" @page-change="pageChange" @sort-change="sortChange" />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        expandSearch: "",
        actionName: 'goFence',
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
          categoryCode: ''
        }
      };
    },
    computed: {
      countGridHeight() {
        return $(document).height() - global_datagridHeightDiff;
      },
      rotateIcon() {
        return this.isCollapsed ? 'icon icon-arrow-right-bold cur p5' : 'icon icon-arrow-left-bold cur p5';
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
      var that = this;
      var dg = FUI.DataGrid.Create(that, 'f2bpm_sys_app_fence', 'f2bpm_sys_app_fence', 'grid', true, true, true);
      dg.SortName = 'id';
      dg.SortOrder = 'desc';
      dg.ShowNumbers = true;
      dg.ExpansMore = true;
      dg.ToolBarDefaultButtons.ShowDelete = true;
      dg.ToolBarDefaultButtons.ShowAdd = true;
      dg.OperationAction.ShowView = false;
      dg.EnableDblClickEdite = true;
      dg.ToolBarCustomButton = that.myToolBarCustomButton;
      dg.OperationEditEvent = this.myOperationEditEvent;
      dg.OperationViewEvent = this.myOperationViewEvent;
      dg.OperationCustomButton = this.myOperationCustomButton;
      dg.EditUrl = '/workflow/frame/appFence/appFenceEdit/';
      dg.EditTitle = '编辑';
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
      // 刷新列表
      refreshGrid(parentGridId, parm) {
        var that = this;
        that.dataGridSearch();
      },
      showAll() {
        this.searchParams.categoryCode = '';
        this.dataGridSearch();
      },
      loadTree() {
        var that = this;
        var treeUrl = FUI.Handlers.CategoryHandler + '?groupKey=AppFenceGroup';
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
        var that = this;
        var id = treeNode.data.id;
        this.searchParams.categoryCode = id;
        that.dataGridSearch();
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
      showDialogEdit(formAction, keyId) {
        var that = this;
        var title = formAction == FUI.FormAction.Add ? '新增' + that.dg.EditTitle : '编辑' + that.dg.EditTitle;
        var url = that.dg.EditUrl;
        if (formAction == FUI.FormAction.Add) {
          url = that.dg.EditUrl + '?categoryCode=' + that.searchParams.categoryCode;
        }
        FUI.Window.openEdit(url, title, formAction, that.dg.GridId, 800, 500, null, that.dg.MainTable, keyId, true);
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
      goFence() {
        var that = this;
        window.location.href = __webpath + '/workflow/frame/appFence/appFenceList';
      },
      goPortal() {
        window.location.href = __webpath + '/workflow/frame/appPortal/appPortalList';
      },
      tabsClick(tab) {
        var that = this;
        var name = tab.name;
        var fn = that[name];
        fn();
      },
      categoryManager(groupKey) {
        var that = this;
        var url = '/workflow/security/category/categoryList_bygroupKey?groupKey=' + groupKey;
        var title = "分类管理";
        FUI.Window.openEdit(url, title, "Edit", "grid", 700, 500, null, "", "", true);
      },
      fenceTypeFormatter(row, column, value, index) {
        var cellValue = value;
        let result = cellValue;
        switch (cellValue.toString()) {
          case 'normal':
            result = '普通栏目';
            break;
          case 'report':
            result = '图表栏目';
            break;
        }
        return result;
      },
      platformTypeFormatter(row, column, value, index) {
        var cellValue = value;
        let result = cellValue;
        switch (cellValue.toString()) {
          case 'front':
            result = '前端';
            break;
          case 'back':
            result = '后端';
            break;
          case 'mobile':
            result = '手机端';
            break;
        }
        return result;
      }
    }

  }
</script>