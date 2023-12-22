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
        <div v-if="!isCollapsed" class="auto-window-height-small  f2bpm-page-left-content" style="overflow-x: auto;">
          <div class="mytree-cube-box-container">
            <span class="cur  mytree-cube-box " @click="showAll()"><i class="icon icon-quanbu font16"></i> {{$t('all')}}</span>
          </div>
          <el-tree ref="mytree" :data="treeData" :expand-on-click-node="false" :default-expanded-keys="expandedKeys" node-key="id" :filter-node-method="filterTreeNode" @node-click="onTreeSelected" />
        </div>
      </el-aside>
      <el-main class="f2bpm-page-right">
        <f2bpm-gridsearchform :tableform="tableForm" @expandclick="expandClick" @searchformbtnclick="searchFormbtnClick" @updatevalue="updateFieldValue" />
        <f2bpm-datagrid ref="grid" grid="grid" :expand-search="expandSearch" :expand-subheight="80" :toolbar="tableToolbar" :context-menu="{header: {options: headerMenus},className: 'my-menus'}" :pager-config="tablePage" :data="tableData" :columns="tableColumn" @cell-dblclick="celldbClick" @toolbar-button-click="toolbarButtonClickEvent" @header-contextmenu="contextMenuClickEvent" @page-change="pageChange" @sort-change="sortChange" />
      </el-main>
    </el-container>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        expandSearch: "",
        tenantId: "",
        isMultiTenant: false,
        expandedKeys: ['Root'],
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
          ParentId: ''
        }
      };
    }, computed: {
      countLeftTreeHeight() {
        return $(document).height() - 100;
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
      var currUser = that.$store.state.user.author;
      that.tenantId = currUser.tenantId;
      that.isMultiTenant = currUser.isMultiTenant;
      var dg = FUI.DataGrid.Create($vm, 'sys_Resource', 'sys_Resource', 'grid', true, true, true);
      dg.SortName = 'OrderNum';
      dg.SortOrder = 'asc';
      // 是否开启双击编辑
      dg.EnableDblClickEdite = true;
      dg.OperationBeforeDeleteEvent = this.myOperationBeforeDeleteEvent;
      dg.OperationAction.ShowEdit = true;
      dg.OperationEditEvent = this.myOperationEditEvent;
      dg.OperationViewEvent = this.myOperationViewEvent;
      dg.OperationDeleteEvent = this.myDeleteFunction;
      dg.OperationAction.ShowView = false;
      dg.IsEnableReloadWhere = true;
      // 工具栏
      dg.ToolBarDefaultButtons.ShowAdd = true;
      dg.ToolBarDefaultButtons.ShowSearch = true;
      dg.ToolBarDefaultButtons.ShowDelete = false;
      dg.OperationCustomButton = this.myOperationCustomButton;
      dg.ToolBarCustomButton = this.myToolBarCustomButton;
      dg.EditUrl = '/admin/resource/resourceEdit';
      dg.EditTitle = '菜单资源';
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
      refreshTree() {
        var that = this;
        that.loadTree();
      },
      loadTree() {
        var that = this;
        var treeUrl = FUI.Handlers.AdminHandler + 'resource/resourceTreeJson/';
        Object.toAjaxJson(treeUrl, null, null, true, null, function (res) {
          if (res.success) {
            that.treeData = res.data;
            if (res.data.length > 0) {
              var arr = [];
              arr.push(res.data[0].id);
              var childs = res.data[0].children;
              if (childs && childs.length > 0) {
                childs.forEach(m => {
                  arr.push(m.id);
                }
                );
              }
              that.expandedKeys = arr;
            }
            var msg = res.msg;
          } else {
            FUI.Window.showMsg(that, res.msg);
          }
        });
      },
      onTreeSelected(data, treeNode, thisObj) {
        this.currCategoryCode = treeNode.data.id;
        this.searchParams.ParentId = this.currCategoryCode;
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
          url = that.dg.EditUrl + '?parentId=' + that.currCategoryCode;
        }
        FUI.Window.openEdit(url, title, formAction, that.dg.GridId, 800, 560, null, that.dg.MainTable, keyId);
      },
      // 工具栏按钮
      myToolBarCustomButton() {
        var that = this;
        var btns = [];
        btns.push({ code: 'copyAdd', status: 'default', name: '复制新增', alias: 'Copy Add', icon: 'fa fa-clipboard' });
        btns.push({ code: 'exportSqlFile', status: 'default', name: '导出SQL', alias: 'Export SQL', icon: 'fa fa-download' });
        if (that.isMultiTenant && that.tenantId == 'BPM') {
          btns.push({ code: 'publishToTenantor', status: 'default', name: '克隆分发给租户', alias: 'Publish To Tenantor', icon: 'fa fa-share' });
        }
        btns.push({ code: 'refreshAllCache', status: 'default', name: '刷新缓存', alias: 'Refresh Cache', icon: 'fa fa-refresh' });
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
        var item = { index: 99, title: '打开菜单', alias: 'Open Menu', tip: '提示自定义', class: 'fa fa-search', code: 'openMenu', click: () => this.openMenu(row.FunctionUrl, row.Name, row.MenuImg) };
        custBtns.push(item);
        return custBtns;
      },
      openMenu(url, title, icon) {
        FUI.Window.open(url, title, icon);
      },
      myDeleteFunction(value, row, index) {
        var that = this;
        that.deleteResource(row.Name, row.ResourceId);
      },
      deleteResource(name, resourceId) {
        var that = this;
        FUI.Window.confirm('您确定要删除【' + name + '】及其所有子菜单吗', null, function (r) {
          if (r) {
            var parm = {
              keyId: resourceId
            };
            Object.toAjaxJson(FUI.Handlers.AdminHandler + 'resource/', 'deleteResource', parm, true, null, function (res) {
              if (res.success) {
                that.refreshGrid();
                that.refreshTree();
                FUI.Window.showMsg2(res.msg, null, 1);
              } else {
                FUI.Window.showMsg2(res.msg);
              }
            });
          }
        });
      },
      copyAdd() {
        const that = this;
        var ids = that.dg.getChecked();
        if (ids == '') {
          FUI.Window.showMsg(that, '请选择要复制的行！');
          return false;
        }
        var arr = ids.split(',');
        if (arr.length > 1) {
          FUI.Window.showMsg(that, '只能选择一条要复制的数据！');
          return false;
        }
        var data = Object.toAjaxJson('/admin/resource/', 'saveCopyAdd', { 'id': ids });
        if (data.success) {
          that.dg.Reload();
          FUI.Window.showMsg2(that, data.msg, null, 1);
        } else {
          FUI.Window.showMsg(data.msg);
        }
      },
      exportSqlFile() {
        var that = this;
        var ids = that.dg.getChecked();
        if (ids == '') {
          FUI.Window.showMsg2('请选择要导出的菜单！');
          return false;
        }
        Object.toAjaxDownloadFile(FUI.Handlers.AdminHandler + 'resource/', 'downloadResourceSql', {
          ids: ids
        });
      },
      publishToTenantor() {
        var that = this;
        var ids = that.dg.getChecked();
        if (ids == '') {
          FUI.Window.showMsg2('请选择要发布给租户的菜单！');
          return false;
        }

        WF.SelectorDialog.selectTenantor(that, "none", "none", null, false, false, function (objectData) {
          if (!objectData || objectData.length <= 0) {
            return false;
          }
          var titles = [];
          var keys = [];
          $.each(objectData, function (i, item) {
            titles.push(item.tenantName);
            keys.push(item.tenantCode);
          });
          var titles = titles.toString();
          FUI.Window.confirm('您确定要将所选菜单发布给以下租户：' + titles, null, function () {
            var parm = {
              ids: ids,
              tenantCodes: keys.toString()
            };
            var data = Object.toAjaxJson(FUI.Handlers.AdminHandler + 'resource/', 'publishResourceToTenantor', parm);
            if (data.success) {
              FUI.Window.showMsg2(data.msg, null, 1);
            } else {
              FUI.Window.showMsg2(data.msg);
            }
          });
        });
      },
      refreshAllCache() {
        var that = this;
        Object.toAjaxJson(FUI.Handlers.WorkflowManageHandler, 'refreshcache', null, null, null, function (data) {
          FUI.Window.showMsg(that, data.msg, null, 1);
        });
      },
      iconStyleFormatter(row, col, value) {
        if (!value) { return ''; }
        if (value.indexOf('fa-') != -1) {
          return Object.toStringFormat('<i   class="fa {0}"></i>', value);
        } else if (value.indexOf('icon-') != -1) {
          return Object.toStringFormat('<i   class="icon {0}"></i>', value);
        } else {
          return Object.toStringFormat('<svg-icon icon-class="{0}"/>', value);
        }
      }
    }

  }
</script>