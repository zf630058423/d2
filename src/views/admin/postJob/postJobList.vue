<template>
  <div class="f2bpm-page-layout">
    <el-container>

      <el-aside ref="sideLeft" class="f2bpm-page-left" hide-trigger collapsible :width="isCollapsed?'20px':'220px'">
        <div class="f2bpm-panel-head">
          <div v-if="!isCollapsed" class="f2bpm-left-search-div">
            <el-input v-model="treeFilterText" class="left-htead-treeFilterText-box" size="small" clearable :placeholder="$t('enterKey')" autocomplete="off" prefix-icon="el-icon-search" />
          </div>
          <div class="f2bpm-left-search-button-div">
            <i v-if="!isCollapsed" :title="$t('refresh')" class="icon icon-shuaxin  cur mr10 font12  " @click="loadTree()"></i>
            <i title="收起/展开" :class="rotateIcon" @click="collapsedSider" />
          </div>
        </div>
        <div v-if="!isCollapsed" class="f2bpm-page-left-content auto-window-height " :style="'height:'+countLeftTreeHeight+'px;'">
          <div class="mytree-cube-box-container">
            <span class="cur  mytree-cube-box " style="width:60px" @click="showAll()"><i class="icon icon-quanbu font16"></i>
              <span class="mytree-cube-box-title">{{$t('all')}}</span>
            </span>

            <span class="cur mytree-cube-box" style="width:60px" @click="importPostJobExcel()"><i class="icon icon-daoru1 font16"></i> <span class="mytree-cube-box-title"> 导入</span> </span>

            <span class="cur  mytree-cube-box" @click="changeToPage('positionList')"><i class="icon icon-fenlei font16"></i>
              <span class="mytree-cube-box-title"> 岗位管理</span>
            </span>
          </div>
          <el-tree ref="mytree" :data="treeData" :expand-on-click-node="false" highlight-current :filter-node-method="filterTreeNode" default-expand-all @node-click="onTreeSelected" />
        </div>
      </el-aside>
      <el-main class="f2bpm-page-right">
        <f2bpm-gridsearchform :tableform="tableForm" @expandclick="expandClick" @searchformbtnclick="searchFormbtnClick" @updatevalue="updateFieldValue" />
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
          parentCode: ''
        }
      };
    },
    computed: {
      countLeftTreeHeight() {
        return $(document).height() - 100;
      },
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
    watch: {

    },
    created() {
      var that = this;
      that.loadTree();
      var dg = FUI.DataGrid.Create(that, 'sys_postjob', 'sys_postjob', 'grid', true, true, true);
      dg.SortName = 'created_time';
      dg.SortOrder = 'desc';
      dg.ShowNumbers = true;
      dg.ExpansMore = true;
      //dg.Url从自己的Controller后端拿数据
      dg.Url = '/admin/postJob/getListByPage';
      dg.ToolBarCustomButton = this.myToolBarCustomButton;
      dg.ToolBarDefaultButtons.ShowDelete = false;
      dg.ToolBarDefaultButtons.ShowAdd = true;
      dg.OperationAction.ShowView = true;
      dg.EnableDblClickEdite = true;
      dg.OperationDeleteEvent = this.myOperationDeleteEvent;
      dg.OperationEditEvent = this.myOperationEditEvent;
      dg.OperationViewEvent = this.myOperationViewEvent;
      dg.OperationCustomButton = this.myOperationCustomButton;
      dg.EditUrl = '/admin/postjob/postJobEdit';
      dg.EditTitle = '职务';
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
      onTreeSelected(data, treeNode, thisObj) {
        var that = this;
        var id = treeNode.data.id;
        that.searchParams.parentCode = id;
        that.dataGridSearch();
      },
      refreshTree() {
        this.loadTree();
      },
      loadTree() {
        var that = this;
        var treeUrl = '/admin/postJob/getPostJobTreeJson/?needRoot=true';
        Object.toAjaxJson(treeUrl, null, null, true, null, function (res) {
          if (res.success) {
            that.treeData = res.data;
            var msg = res.msg;
          } else {
            FUI.Window.showMsg(that, res.msg);
          }
        });
      },
      showAll() {
        var that = this;
        that.searchParams.parentCode = "";
        this.dataGridSearch();
      },
      refreshGrid(parentGridId, parm) {
        var that = this;
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
      myOperationViewEvent(value, row, index) {
        this.showDialogEdit(FUI.FormAction.View, row[this.dg.IdField]);
      },
      myOperationEditEvent(value, row, index) {
        this.showDialogEdit(FUI.FormAction.Edit, row[this.dg.IdField]);
      },
      myOperationDeleteEvent(value, row, index) {
        let that = this;
        let id = row[this.dg.IdField];
        let parm = { keyId: id };
        FUI.Window.confirm(that, "您确定要删除吗？", null, function () {
          Object.toAjaxJson("/admin/postJob/", "delete", parm, true, null,
            function (res) {
              if (res.success) {
                that.dataGridSearch();
                that.refreshTree();
              } else {
                FUI.Window.showMsg(res.msg);
              }
            });
        });
      },
      showDialogEdit(formAction, keyId) {
        var that = this;
        var url = __webpath + '/admin/postjob/postJobEdit/?parentCode=' + that.searchParams.parentCode;
        var title = formAction == FUI.FormAction.Add ? '新增' + that.dg.EditTitle : '编辑' + that.dg.EditTitle;
        FUI.Window.openEdit(url, title, formAction, that.dg.GridId, 700, 500, null, that.dg.MainTable, keyId);
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
      operationCustomButtonClick(value) {
        alert('aa' + value);
      },
      //JS显示格式化示例
      opinitionTypeFormatter(row, column, value, index) {
        let result = value;
        switch (value.toString()) {
          case '0':
            result = '不同意类';
            break;
          case '1':
            result = '同意类';
            break;
        }
        return result;
      }
      , changeToPage() {
        var that = this;
        window.location.href = __webpath + "/admin/position/positionList";
      }
      , importPostJobExcel() {
        FUI.Window.openEdit('/admin/postJob/importPostJobByExcel', '导入职务', FUI.FormAction.Edit, '', 550, 380);
      }
    }
  }
</script>