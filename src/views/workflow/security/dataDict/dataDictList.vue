<template>
  <div class="f2bpm-page-layout">
    <el-container>
      <el-aside ref="sideLeft" class="f2bpm-page-left" hide-trigger collapsible :width="isCollapsed?'20px':'250px'">
        <div class="f2bpm-panel-head">
          <div v-if="!isCollapsed" class="f2bpm-left-search-div" style="width:180px">
            <el-input v-model="treeFilterText" class="left-htead-treeFilterText-box" size="small" clearable :placeholder="$t('enterKey')" autocomplete="off" prefix-icon="el-icon-search" />
          </div>
          <div class="f2bpm-left-search-button-div">
            <i v-if="!isCollapsed" :title="$t('refresh')" class="icon icon-shuaxin  cur mr10 font12  " @click="loadTree()"></i>
            <i title="收起/展开" :class="rotateIcon" @click="collapsedSider" />
          </div>
        </div>
        <div v-if="!isCollapsed" class="auto-window-height f2bpm-page-left-content mt4" style="width: 99%;">
          <el-tree ref="mytree" :data="treeData" highlight-current :expand-on-click-node="false" :filter-node-method="filterTreeNode" default-expand-all @node-click="onTreeSelected">
            <span slot-scope="{ node, data }" class="custom-tree-node">
              <span style="max-width:50px">{{ node.label }}</span>
              <span style="width:60px; color: #409EFF;z-index: 1000;float:right;">
                <span class="p5" title="添加子分类" @click="() => append(data)">
                  <i class="fa fa-plus" />
                </span>
                <span class="p5" v-show="data.id!='Root'" type="text" size="mini" title="修改分类名称" @click="() => editTypeName(node, data)">
                  <i class="fa fa-edit" />
                </span>
                <span class="p5" v-if="false" type="text" size="mini" title="删除字典分类" @click="() => remove(node, data)"> <!--v-show="data.id!='Root'"-->
                  <i class="fa fa-trash-o" />
                </span>
              </span>
            </span>
          </el-tree>
        </div>
      </el-aside>
      <el-main class="f2bpm-page-right">
        <f2bpm-gridsearchform :tableform="tableForm" @expandclick="expandClick" @searchformbtnclick="searchFormbtnClick" @updatevalue="updateFieldValue" />
        <f2bpm-datagrid ref="grid" grid="grid" :expand-subheight="80" :expand-search="expandSearch" :toolbar="tableToolbar" :context-menu="{header: {options: headerMenus},className: 'my-menus'}" :pager-config="tablePage" :data="tableData" :columns="tableColumn" @cell-dblclick="celldbClick" @toolbar-button-click="toolbarButtonClickEvent" @header-contextmenu="contextMenuClickEvent" @page-change="pageChange" @sort-change="sortChange" />
      </el-main>
    </el-container>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        expandSearch: "",
        currentTreeTypeName: "",
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
          // 特殊查询
          ConfigType: ""
        },
        isOnlyMySelf: 0
      };
    },
    watch: {
      treeFilterText(val) {
        this.$refs.mytree.filter(val);
      }
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
      that.loadTree();
      var dg = FUI.DataGrid.Create(that, 'f2bpm_sys_DataDict', 'f2bpm_sys_DataDict', 'grid', true, true, true);
      dg.SortName = 'ConfigType';
      dg.SortOrder = 'asc';
      dg.ShowNumbers = true;
      dg.ExpansMore = false;

      dg.ToolBarDefaultButtons.ShowDelete = false;
      dg.ToolBarDefaultButtons.ShowAdd = true;
      dg.OperationAction.ShowDelete = false; // 关闭列表删除按钮
      dg.OperationAction.ShowView = false;
      dg.EnableDblClickEdite = true;
      dg.OperationEditEvent = this.myOperationEditEvent;
      dg.OperationViewEvent = this.myOperationViewEvent;
      dg.ToolBarCustomButton = this.myToolBarCustomButton;
      dg.EditUrl = '/workflow/security/systemss/dataDictEdit/';
      dg.EditTitle = '数据字典';
      dg.Bind();
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
      showAll() {
        this.searchParams.dataDictType = '';
        this.dataGridSearch();
      },

      pageChange({ currentPage, pageSize }) {
        this.tablePage.currentPage = currentPage;
        this.tablePage.pageSize = pageSize;
        this.tablePage.startIndex = (currentPage - 1) * pageSize;
        this.getGridData();
      },
      loadTree() {
        var that = this;
        var treeUrl = '/workflow/security/dataDictType/getDataDictTypeTreeJson/?needRoot=true';
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
        if (treeNode.data.id == "Root") {
          this.searchParams.ConfigType = "";
          this.currentTreeTypeName = "";
        } else {
          this.currentTreeTypeName = data.label;
          this.searchParams.ConfigType = this.currentTreeTypeName;
        }

        this.dataGridSearch();
      },
      refreshTree() {
        var that = this;
        that.loadTree();
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
        this.showDialogEdit(FUI.FormAction.View, row[this.dg.IdField]);
      },
      myOperationEditEvent(value, row, index) {
        this.showDialogEdit(FUI.FormAction.Edit, row[this.dg.IdField]);
      },
      showDialogEdit(formAction, keyId) {
        var that = this;
        var url = that.dg.EditUrl;
        var title = formAction == FUI.FormAction.Add ? '新增' + that.dg.EditTitle : '编辑' + that.dg.EditTitle;
        if (formAction == FUI.FormAction.Add && that.currentTreeTypeName == "") {
          FUI.Window.showMsg("请先选择分类");
          return false;
        }
        if (formAction == FUI.FormAction.Add) {
          url = that.dg.EditUrl + "?configType=" + that.currentTreeTypeName;
        }
        FUI.Window.openEdit(url, title, formAction, that.dg.GridId, 700, 550, null, that.dg.MainTable, keyId);
      },

      // 工具栏按钮
      myToolBarCustomButton() {
        var btns = [];
        btns.push({ code: 'exportWorkflowConfigSqlFile', status: 'default', name: '导出SQL', alias: 'Export', icon: 'fa fa-database' });
        btns.push({ code: 'refreshcache', status: 'default', name: '刷新缓存', alias: 'Refresh Cache', icon: 'fa fa-refresh' });
        return btns;
      },
      // 工具栏按钮事件
      toolbarButtonClickEvent({ btn, code }, event) {
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
      // 导出SQL语句
      exportWorkflowConfigSqlFile() {
        var that = this;
        var ids = that.dg.getChecked();
        if (ids == '') {
          FUI.Window.showMsg2(that, '请选择要导出的记录！');
          return false;
        }
        Object.toAjaxDownloadFile(FUI.Handlers.SystemHandler, 'downloadWorkflowConfigSql', {
          ids: ids
        });
      },
      refreshcache() {
        var that = this;
        Object.toAjaxJson(FUI.Handlers.WorkflowManageHandler, 'refreshcache', null, null, null, function (data) {
          FUI.Window.showMsg(that, data.msg, null, 1);
          FUI.Data.getConfigTypeData(true);
        });
      }
      , append(data) {
        var that = this;
        var url = '/workflow/security/dataDict/dataDictTypeEdit?parentId=' + data.id;
        FUI.Window.openEdit(url, '添加字典分类', 'Add', that.dg.GridId, 600, 400, null, null, '');
      },
      editTypeName(node, data) {
        var that = this;
        var url = '/workflow/security/dataDict/dataDictTypeEdit';
        FUI.Window.openEdit(url, '修改字典分类', 'Edit', that.dg.GridId, 600, 400, null, null, data.id);
      }
      , remove(node, data) {
        var that = this;
        var typeName = data.label;
        that.deleteDataDictType(data.id, typeName);
      },
      deleteDataDictType(id, typeName) {
        var that = this;
        FUI.Window.confirm(that, '确定要删除吗？', null, function () {
          var data = Object.toAjaxJson('/workflow/security/dataDictType/', 'deleteByIdTypeName',
            { 'id': id, 'typeName': typeName });
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
    padding-right: 8px;
  }
</style>
