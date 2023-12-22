<template>
  <div class="f2bpm-page-layout">
    <el-container>
      <el-aside ref="sideLeft" class="f2bpm-page-left" hide-trigger collapsible :width="isCollapsed?'20px':'340px'">
        <div class="f2bpm-panel-head" style="height: 30px; ">
          <div v-if="!isCollapsed" class="f2bpm-left-search-div" style="line-height: 30px;">
            <el-input v-model="treeFilterText" style="border:0;height: 25px; width: 260px;" clearable :placeholder="$t('enterKey')" size="mini" autocomplete="off" prefix-icon="el-icon-search" />
          </div>
          <div style=" float: right;line-height:35px;padding-right: 5px;">
            <i v-if="!isCollapsed" :title="$t('refresh')" class="fa fa-refresh  cur mr10 font12 " @click="showAll()" />
            <i title="收起/展开" :class="rotateIcon" @click="collapsedSider" />
          </div>
        </div>
        <div v-if="!isCollapsed" class="auto-window-height f2bpm-page-left-content mt4" style="width: 99%;">
          <div style="border-bottom: 1px solid #ddd;padding-bottom: 3px;" v-if="showGroupKeyDrop">
            {{$t('categoryFlag')}}：
            <el-select v-model="groupKey" size="mini" style="width: 200px;margin-top: 2px;" filterable placeholder="请选择" @change="groupKeyChange">
              <el-option v-for="item in groupKeyData" :label="item.text" :value="item.value" />
            </el-select>
          </div>
          <div class="mytree-cube-box-container">
            <span class="cur  mytree-cube-box " @click="showAll()"><i class="icon icon-quanbu font16"></i> <span class="mytree-cube-box-title">{{$t('all')}}</span></span>
          </div>
          <el-tree ref="mytree" :data="treeData" highlight-current :expand-on-click-node="false" :filter-node-method="filterTreeNode" default-expand-all @node-click="onTreeSelected">
            <span slot-scope="{ node, data }" class="custom-tree-node">
              <span>{{ node.label }}</span>
              <span>
                <el-button type="text" size="mini" title="添加子分类" @click="() => append(data)">
                  <i class="fa fa-plus" />
                </el-button>
                <el-button v-if="data.id!='Root'" type="text" size="mini" title="编辑" @click="() => edit(data)">
                  <i class="fa fa-edit" />
                </el-button>
                <el-button v-if="data.id!='Root'" type="text" size="mini" title="删除分类" @click="() => remove(node, data)">
                  <i class="fa fa-trash-o" />
                </el-button>
              </span>
            </span>
          </el-tree>
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
        showGroupKeyDrop: true,
        currCategoryCode: '',
        treeFilterText: '',
        groupKey: 'BusinessObject',
        currentTreeNodeId: '',
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
        groupKeyData: [], // ===========SqlKey==========

        sqlkeyArray: [{
          dataField: 'groupKeyData',
          sqlkey: 'CB_CategoryGroup',
          parm: null,
          flag: null,
          change: null
        }], // ===========标准区结束==========

        searchParams: {
          // 特殊查询
          ParentId: '',
          GroupKey: 'BusinessObject'
        }
      };
    }, computed: {
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
      treeFilterText(val) {
        this.$refs.mytree.filter(val);
      }
    },
    created() {
      var $vm = this;
      var that = this;
      var theUrlGroupKey = Object.toQueryString("groupKey") || "";
      if (theUrlGroupKey) {
        that.groupKey = theUrlGroupKey;
        that.showGroupKeyDrop = false;
        that.searchParams.GroupKey = theUrlGroupKey;
      }
      this.loadTree();
      var dg = FUI.DataGrid.Create($vm, 'f2bpm_sys_Category', 'f2bpm_sys_Category', 'grid', true, true, true);
      dg.SortName = 'OrderNo';
      dg.SortOrder = 'ASC';
      // 是否开启双击编辑
      dg.EnableDblClickEdite = true;
      dg.OperationAction.ShowEdit = true;
      dg.OperationEditEvent = this.myOperationEditEvent;
      dg.OperationViewEvent = this.myOperationViewEvent;
      dg.OperationDeleteEvent = this.myOperationDeleteEvent;
      dg.OperationAction.ShowView = false;
      dg.IsEnableReloadWhere = true;
      // 工具栏
      dg.ToolBarDefaultButtons.ShowAdd = true;
      dg.ToolBarDefaultButtons.ShowSearch = true;
      dg.ToolBarDefaultButtons.ShowDelete = false;
      dg.ToolBarCustomButton = this.myToolBarCustomButton;
      dg.EditUrl = '/workflow/security/category/categoryEdit/';
      dg.EditTitle = '类别';
      dg.Bind();

      // 最后加载
      FUI.Form.initailSqlKeyComboBox(this);
    },
    mounted() {
      window.myvm = this;
      $('.auto-window-height').height($(window).height() - 100);
    },

    methods: {
      collapsedSider() {
        this.isCollapsed = !this.isCollapsed;
      },
      closeEdit() {
        FUI.Window.closeEdit(true);
      },
      searchFormbtnClick(name) {
        this.dg.searchFormbtnClick(name);
      },
      updateFieldValue(field, newValue, vueDataName, subVueDataName) {
        this.dg.updateFieldValue(field, newValue, vueDataName, subVueDataName);
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
        this.searchParams.ParentId = '';
        this.dataGridSearch();
      },
      groupKeyChange(value) {
        var that = this;
        var groupKey = value;
        that.groupKey = groupKey;
        that.searchParams.GroupKey = groupKey;
        that.searchParams.ParentId = '';
        that.currCategoryCode = "";
        that.currentTreeNodeId = "";
        that.loadTree();
        that.dg.Reload();
      },
      loadTree() {
        var that = this;
        var treeUrl = FUI.Handlers.CategoryHandler + '?needRoot=true&groupKey=' + that.groupKey;
        Object.toAjaxJson(treeUrl, null, null, true, null, function (res) {
          if (res.success) {
            that.treeData = res.data;
            var msg = res.msg;
          } else {
            FUI.Window.showMsg(res.msg);
          }
        });
      },
      onTreeSelected(data, treeNode, thisObj) {
        this.parentId = treeNode.data.id;
        this.currentTreeNodeId = treeNode.data.id;
        this.searchParams.ParentId = this.parentId;
        this.dataGridSearch();
      },
      refreshTree() {
        var that = this;
        that.loadTree();
      },
      // 刷新列表
      refreshGrid(parentGridId, parm) {
        console.info('=========refreshGrid=====');
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
      // ====stand:标准方法控制结束==============
      myOperationDeleteEvent(value, row, index) {
        var that = this;
        var delGroupKey = row.GroupKey;
        var delCategoryCode = row.CategoryCode;
        that.deleteCategory(delGroupKey, delCategoryCode);
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
          url = that.dg.EditUrl + '?groupKey=' + that.groupKey + '&parentId=' + that.currentTreeNodeId;
        } else {
          url = that.dg.EditUrl + '?groupKey=' + that.groupKey;
        }
        FUI.Window.openEdit(url, title, formAction, that.dg.GridId, 800, 500, null, that.dg.MainTable, keyId);
      },
      // 工具栏按钮
      myToolBarCustomButton() {
        var btns = [];
        btns.push({ code: 'exportWorkflowConfigSqlFile', status: 'default', name: '导出到SQL', alias: 'Export', icon: 'fa fa-download' });
        btns.push({ code: 'downloadCategoryXml', status: 'default', name: '导出到XML', alias: 'Export', icon: 'fa fa-download' });
        btns.push({ code: 'importCategoryXml', status: 'default', name: '导入分类XML', alias: 'Import Form', icon: 'fa fa-upload' });
        if (Object.toQueryString("groupKey")) {
          btns.push({ code: 'closeEdit', status: 'default', name: '关闭', icon: '' });
        }
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
      exportWorkflowConfigSqlFile() {
        var that = this;
        var ids = this.dg.getChecked();
        if (ids == '') {
          FUI.Window.showMsg(that, '请选择要导出的记录！');
          return false;
        }
        var data = Object.toAjaxDownloadFile('/workflow/security/category/', 'downloadCategorySql', {
          ids: ids
        });
      },
      downloadCategoryXml() {
        var that = this;
        var ids = this.dg.getChecked();
        if (ids == '') {
          FUI.Window.showMsg(that, '请选择要导出的记录！');
          return false;
        }
        var data = Object.toAjaxDownloadFile('/workflow/security/category/', 'downloadCategoryXml', {
          ids: ids,
          title: '人员汇报树分类'
        });
      },
      importCategoryXml() {
        FUI.Window.openEdit('/workflow/security/category/importCategoryXml', '导入分类', FUI.FormAction.Edit, '', 550, 380);
      },
      append(data) {
        var that = this;
        var url = that.dg.EditUrl + '?groupKey=' + that.groupKey + '&parentId=' + data.id;
        FUI.Window.openEdit(url, '添加分类', 'Add', that.dg.GridId, 800, 500, null, that.dg.MainTable, '');
      },
      edit(data) {
        console.info(data);
        var that = this;
        var keyId = data.attributes.id;
        var url = that.dg.EditUrl + '?groupKey=' + that.groupKey;
        FUI.Window.openEdit(url, '编辑分类', 'Edit', that.dg.GridId, 800, 500, null, that.dg.MainTable, keyId);
      },
      remove(node, data) {
        var that = this;
        that.deleteCategory(that.groupKey, data.id);
        // const parent = node.parent;
        // const children = parent.data.children || parent.data;
        // const index = children.findIndex(d => d.id === data.id);
        // children.splice(index, 1);
      },
      deleteCategory(delGroupKey, delCategoryCode) {
        var that = this;
        FUI.Window.confirm(that, '确定要删除吗？', null, function () {
          var data = Object.toAjaxJson('/workflow/security/category/', 'deleteCategory',
            { 'groupKey': delGroupKey, 'categoryCode': delCategoryCode });
          if (data.success == true) {
            that.dg.Reload();
            that.loadTree();
          } else {
            FUI.Window.showMsg(that, data.msg);
          }
        });
      }
    }

  }
</script>
<style>
  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 12px;
    padding-right: 1px;
  }
</style>