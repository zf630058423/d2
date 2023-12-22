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


        <div v-if="!isCollapsed" class="f2bpm-page-left-content auto-window-height mt5">
          <div class="mytree-cube-box-container">
            <span class="cur  mytree-cube-box " @click="showAll()"><i class="icon icon-quanbu font16"></i> {{$t('all')}}</span>
            <span class="cur  mytree-cube-box" @click="categoryManager('BusinessObject')"><i class="icon icon-fenlei font16"></i> {{$t('category')}}</span>
          </div>
          <el-tree ref="mytree" :data="treeData" :filter-node-method="filterTreeNode" :expand-on-click-node="false" default-expand-all @node-click="onTreeSelected" />
        </div>
      </el-aside>
      <el-main class="f2bpm-page-right">
        <f2bpm-gridsearchform :tableform="tableForm" @expandclick="expandClick" @searchformbtnclick="searchFormbtnClick" @updatevalue="updateFieldValue" />
        <f2bpm-datagrid ref="grid" :expand-search="expandSearch" grid="grid" :toolbar="tableToolbar" :context-menu="{header: {options: headerMenus},className: 'my-menus'}" :pager-config="tablePage" :data="tableData" :columns="tableColumn" @cell-dblclick="celldbClick" @toolbar-button-click="toolbarButtonClickEvent" @header-contextmenu="contextMenuClickEvent" @page-change="pageChange" @sort-change="sortChange" />
      </el-main>
    </el-container>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        expandSearch: "",
        language: "",
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
        headerMenus: Object.toClone(FUI.DataGridProperty.headerMenus),
        tableColumn: [],
        // ===========标准区结束==========
        searchParams: {
          // 特殊查询
        }
      };
    }, computed: {
      countGridHeight() {
        return $(document).height() - 145;
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
      var that = this;
      var $vm = this;
      that.language = that.$store.state.app.language;
      var dg = FUI.DataGrid.Create($vm, 'f2bpm_form_FormDef', 'f2bpm_form_FormDef', 'grid', true, true, true);
      dg.SortName = 'CreatedTime';
      dg.SortOrder = 'desc';
      // 是否开启双击编辑
      dg.EnableDblClickEdite = true;
      dg.OperationBeforeDeleteEvent = this.myOperationBeforeDeleteEvent;
      dg.OperationAction.ShowEdit = true;
      dg.OperationEditEvent = this.myOperationEditEvent;
      dg.OperationDeleteEvent = this.myDeleteEvent;
      dg.OperationAfterSaveRowIsRefresh = false;
      dg.OperationAction.ShowView = false;
      dg.IsEnableReloadWhere = true;
      // 工具栏
      dg.ToolBarDefaultButtons.ShowAdd = true;
      dg.ToolBarDefaultButtons.ShowSearch = true;
      dg.ToolBarDefaultButtons.ShowDelete = false;
      dg.OperationCustomButton = this.myOperationCustomButton;
      dg.ToolBarCustomButton = this.myToolBarCustomButton;
      dg.EditUrl = __webpath + '/workflow/smartForm/formDefEdit/';
      dg.EditTitle = '数据模型';
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
      closeEdit() {
        this.modal.modalEdit = false;
        this.modal.currEditModal = '';
        this.modal.title = '';
      }
      ,
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
        // 重置查询
        this.dataGridSearch();
      },
      filterTreeNode(value, data) {
        if (!value) return true;
        return data.title.indexOf(value) !== -1;
      },
      showAll() {
        this.searchParams.CategoryCode = '';
        this.dataGridSearch();
      },
      loadTree() {
        var that = this;
        var treeUrl = FUI.Handlers.CategoryHandler + '?groupKey=BusinessObject';
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
        this.searchParams.CategoryCode = this.currCategoryCode;
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
            that.$Notice.error({
              title: '错误',
              desc: res.msg
            });
          }
        });
      },
      // ====stand:标准方法控制结束==============
      myOperationBeforeDeleteEvent(value, row, index) {
        if (confirm('删除后将影响已使用的表单应用及表单模板内容。可先查看是否已被表单应用正式使用，如果已被使用将无法删除，请慎重评估是否要删除！')) {
          return true;
        }
        return false;
      },
      myDeleteEvent(value, row, index) {
        var that = this;
        // 会删除表单定义及业务对象字义等
        FUI.Window.confirm(that, '确定要删除【' + row.FormDefName + '】？', null, function (r) {
          if (r) {
            var data = Object.toAjaxJson(FUI.Handlers.SmartFormHandler, 'deleteFormDef', {
              formDefId: row.FormDefId
            });
            if (data.success == true) {
              that.dg.Reload();
            } else {
              FUI.Window.showMsg(that, data.msg);
            }
          }
        });
      },
      myOperationViewEvent(value, row, index) {
        this.showDialogEdit(FUI.FormAction.View, row[this.dg.IdField]);
      },
      myOperationEditEvent(value, row, index) {
        this.showDialogEdit(FUI.FormAction.Edit, row[this.dg.IdField], row.FormDefName);
      },
      showDialogEdit(formAction, keyId, formDefName) {
        var that = this;
        var title = formAction == FUI.FormAction.Add ? '新增' + that.dg.EditTitle : '编辑' + that.dg.EditTitle;
        var url = that.dg.EditUrl;
        if (formAction == FUI.FormAction.Add) {
          var categoryCode = that.currCategoryCode;
          url = url + '?categoryCode=' + categoryCode;
        } else if (formAction == FUI.FormAction.Edit) {
          var categoryCode = that.currCategoryCode;
          that.formModeDesigner(keyId, formDefName);
          return false;
        }
        FUI.Window.openEdit(url, title, formAction, that.dg.GridId, 600, 450, null, that.dg.MainTable, keyId, true);
      },
      // 工具栏按钮
      myToolBarCustomButton() {
        var btns = [];
        btns.push({ code: 'importFormDefXml', status: 'default', title: '导入包含：模型定义+数据库表定义', name: '导入模型定义', alias: 'Import Model Designer', icon: 'fa fa-upload' });

        /*  btns.push({ code: 'cleanUnusedDefData', status: 'default', name: '清理过时定义数据', icon: 'fa fa-cog', title: '手动清理表单中引用了已被删除的字段或其它已不存在的数据。' }); */

        btns.push({ code: 'bathSetCategory', status: 'default', name: '设置分类', alias: 'Set Category', icon: 'fa fa-cog' });
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
        var item = {};

        item = { index: 99, title: '查看被引用', alias: 'Show Be Used', tip: '查看被哪些“表单应用”使用了', class: 'fa fa-th', code: 'showProcessFormOfFormDef', click: () => this.showProcessFormOfFormDef(value, row, index) };
        custBtns.push(item);
        item = { index: 90, title: '导出', alias: 'Export', tip: '导出包含：数据模型+数据库表定义', class: 'fa fa-download', code: 'downLoadFormDef', click: () => this.downLoadFormDef(row.FormDefId) };
        custBtns.push(item);
        return custBtns;
      },
      // 查看被哪些“表单应用”引用了
      showProcessFormOfFormDef(value, row, index) {
        var formDefId = row.FormDefId;
        var formDefName = row.FormDefName;
        var width;
        var height;
        if(window.screen.width > 500){
          width = 670;
          height = 350;
        }else{
          width = window.screen.width;
          height = window.screen.height-120;
        }
        FUI.Window.openEdit('/workflow/smartForm/showProcessFormOfFormDef/?formDefId=' + formDefId, '【' + formDefName + '】被下列表单应用使用了', FUI.FormAction.View, this.dg.GridId, width, height, null, '', '', false);
      },
      cleanUnusedDefData() {
        var that = this;
        FUI.Window.confirm(that, '您确定要进行“过时定义数据”的清理？', '温馨提示', function (r) {
          var data = Object.toAjaxJson(FUI.Handlers.SmartFormHandler, 'cleanUnusedDefData');
          FUI.Window.showMsg(that, data.msg, null, data.success ? 1 : 7);
        });
      },
      formModeDesigner(formDefId, formDefName) {
        var that = this;
        FUI.Window.openEdit(__webpath + '/workflow/smartForm/form/formModeDesigner?formDefId=' + formDefId, '【' + formDefName + '】数据建模', FUI.FormAction.Edit, this.dg.GridId, 880, 450, null, '', '', true);
      },
      bathSetCategory() {
        var that = this;
        var ids = this.dg.getChecked();
        if (ids == '') {
          FUI.Window.showMsg(that, '请选择要设置的行！');
          return false;
        }
        WF.SelectorDialog.setCategory('f2bpm_form_FormDef', 'FormDefId', ids, 'CategoryCode', 'BusinessObject');
      },
      //分类
      categoryManager(groupKey) {
        var that = this;
        var url = '/workflow/security/category/categoryList_bygroupKey?groupKey=' + groupKey;
        var title = "分类管理";
        FUI.Window.openEdit(url, title, "Edit", "grid", 700, 500, null, "", "", true);
      }
      , downLoadFormDef(formDefId) {
        if (formDefId == '') {
          FUI.Window.showMsg('请选择要导出的表单定义！');
          return false;
        }
        FUI.Window.confirm("导出包含：表单定义+数据库表定义", null, function () {
          var data = Object.toAjaxDownloadFile(FUI.Handlers.SmartFormHandler, 'downLoadFormDef', {
            formDefId: formDefId
          });
        });
      },

      importFormDefXml() {
        FUI.Window.openEdit(FUI.Handlers.SmartFormHandler + 'importFormDef', '导入表单定义', FUI.FormAction.Edit, '', 550, 380);
      }
    }

  }
</script>
