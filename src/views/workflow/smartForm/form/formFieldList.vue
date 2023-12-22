<template>
  <div class="f2bpm-page-layout">
    <el-container>
      <!--  <el-header style="padding: 0;padding-left: 5px;border-bottom: solid #e8eaec  1px;height: 40px;">
        <el-tabs value="goFormFieldList" @tab-click="tabsClick">
          <el-tab-pane label="①基本信息" name="goFormDefEdit"></el-tab-pane>
          <el-tab-pane label="②关联表" name="goFormDefTableRelList"></el-tab-pane>
          <el-tab-pane label="③业务对象" name="goBusObjectSubsEdit"></el-tab-pane>
          <el-tab-pane label="④字段控件" name="goFormFieldList"></el-tab-pane>
        </el-tabs>
      </el-header> -->
      <el-container>
        <el-aside ref="sideLeft" class="f2bpm-page-left" hide-trigger collapsible :width="isCollapsed?'20px':'200px'">
          <div class="f2bpm-panel-head">
            <div v-if="!isCollapsed" class="f2bpm-left-search-div">
              <el-input v-model="treeFilterText" class="left-htead-treeFilterText-box" size="small" clearable :placeholder="$t('enterKey')" autocomplete="off" prefix-icon="el-icon-search" />
            </div>
            <div style=" float: right;line-height:35px;padding-right: 5px;">
              <i v-if="!isCollapsed" :title="$t('refresh')" class="fa fa-refresh  cur mr10 font12 " @click="showAll()" />
              <i title="收起/展开" :class="rotateIcon" @click="collapsedSider" />
            </div>
          </div>

          <div v-if="!isCollapsed" class="auto-window-height f2bpm-page-left-content mt4">
            <el-tree ref="mytree" :data="treeData" :filter-node-method="filterTreeNode" :expand-on-click-node="false" default-expand-all @node-click="onTreeSelected" />
          </div>
        </el-aside>
        <el-main class="f2bpm-page-right">
          <f2bpm-gridsearchform :tableform="tableForm" :extenddes="extenddes" @searchformbtnclick="searchFormbtnClick" @updatevalue="updateFieldValue" />
          <f2bpm-datagrid ref="grid" grid="grid" :toolbar="tableToolbar" :context-menu="{header: {options: headerMenus},className: 'my-menus'}" :pager-config="tablePage" :data="tableData" :columns="tableColumn" @cell-dblclick="celldbClick" @toolbar-button-click="toolbarButtonClickEvent" @header-contextmenu="contextMenuClickEvent" @page-change="pageChange" @sort-change="sortChange" />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
  window.refTypeEditor = FUI.Tool.createrComboboxEditor([{
    'text': '多记录',
    'value': 'hasMany'
  }, {
    'text': '单条记录',
    'value': 'hasOne'
  }]);
  export default {
    data() {
      return {
        categoryCode: '',
        currentBoId: '',
        treeFilterText: '',
        formDefId: '',
        extenddes: "<span class='red'>请选择左侧表</span>",
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
        }
      };
    }, computed: {
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
      treeFilterText(val) {
        this.$refs.mytree.filter(val);
      }
    },
    created() {
      var formDefId = Object.toQueryString('formDefId');
      // 分类必传
      var categoryCode = Object.toQueryString('categoryCode');
      var $vm = this;
      $vm.tablePage.pageSize = 1000;
      $vm.formDefId = formDefId;
      $vm.categoryCode = categoryCode;
      var dg = FUI.DataGrid.Create($vm, 'key_FormFieldGridView', 'f2bpm_form_FormDefField', 'grid', true, true, true);
      dg.SortName = 'FieldOrderNo';
      dg.SortOrder = 'ASC';
      dg.EnableDblClickEdite = true;
      //ColumnType in ('base','virtual')  s_and
      dg.DefaultWhere = " FormDefId='" + formDefId + "' s_and  BusObjectId='none'";
      dg.IdField = 'FieldId';
      dg.OperationAction.ShowEdit = true;
      dg.OperationAction.ShowView = false;
      dg.OperationBeforeDeleteEvent = this.myOperationBeforeDeleteEvent;
      dg.OperationEditEvent = this.myOperationEditEvent;
      dg.OperationViewEvent = this.myOperationViewEvent;
      dg.OperationDeleteEvent = this.myDeleteEvent;
      dg.OperationAfterSaveRowIsRefresh = false;
      dg.OperationAction.ShowView = false;
      dg.IsEnableReloadWhere = true;
      // 工具栏
      dg.ToolBarDefaultButtons.ShowAdd = false;
      dg.ToolBarDefaultButtons.ShowSearch = true;
      dg.ToolBarDefaultButtons.ShowDelete = true;
      dg.ToolBarCustomButton = this.myToolBarCustomButton;
      dg.EditUrl = __webpath + '/workflow/smartForm/formFieldEdit/?formDefId=' + formDefId;
      dg.EditTitle = '表单控件';
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
        FUI.Window.closeEdit(true, 'grid');
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
        this.dataGridSearch();
      },
      loadTree() {
        var that = this;
        var treeUrl = FUI.Handlers.SmartFormHandler + 'getBoTreeJsonByFormDefId/?formDefId=' + that.formDefId;
        Object.toAjaxJson(treeUrl, null, null, true, null, function (res) {
          if (res.success) {
            that.treeData = res.data;
            var msg = res.msg;
            if (that.currentBoId == '') {
              that.private_excuteTargetBoTable(that.treeData[0]);
            }
          } else {
            FUI.Window.showMsg(that, res.msg);
          }
        });
      },
      onTreeSelected(data, treeNode, thisObj) {
        var that = this;
        that.private_excuteTargetBoTable(data);
      },
      private_excuteTargetBoTable(data) {
        var that = this;
        if (!data) return false;
        this.currentBoId = data.id;
        this.dg.DefaultWhere = " FormDefId='" + this.formDefId + "'   s_and BusObjectId='" + this.currentBoId + "'";
        this.dataGridSearch();
        that.extenddes = '<span>【当前表：' + data.text + ' 】</span>';
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
      // ====stand:标准方法控制结束==============
      myOperationBeforeDeleteEvent(value, row, index) {
        if (confirm('如果已正式使用，请慎重评估是否要删除，点击【确定】继续删除，点击【取消】则不执行删除！')) {
          return true;
        }
        return false;
      },
      myToolBarDeleteEvent() {
        var ids = this.dg.getChecked();
        this.deleteFieldDef(ids);
      },
      myDeleteEvent(value, row, index) {
        var that = this;
        that.deleteFieldDef(row.FieldId);
      },
      deleteFieldDef(ids) {
        var that = this;
        if (ids == '') {
          FUI.Window.showMsg(that, '请选择要删除的记录');
          return false;
        }
        var data = Object.toAjaxJson(FUI.Handlers.FormPermission, 'deleteFileDefList', { 'ids': ids });
        if (data.success) {
          FUI.Window.showMsg(that, data.msg, null, 1, function () {
            that.dg.Reload();
          });
        }
      },
      myBeforeDblClickEditeEvent(value, row, index) {
        if (row.IsCreated) {
          FUI.Window.showLeftBelowMsg(this, '表已生成，如需修改请点击“编辑”按钮！');
        }
        return !row.IsCreated;
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
          url = that.dg.EditUrl + '?currentBoId=' + that.currentBoId;
        }
        FUI.Window.openEdit(url, title, formAction, that.dg.GridId, 800, 550, null, that.dg.MainTable, keyId);
      },
      // 工具栏按钮
      myToolBarCustomButton() {
        var btns = [];
        btns.push({ code: 'selectColumn', type: 'primary', name: '选取业务字段', icon: 'fa fa-search' });
        btns.push({
          code: 'autoReSetFiledDefOrderNo',
          type: 'primary',
          name: '规整重新排序',
          icon: 'fa fa-cog',
          title: '将按原来的顺序将序号重置为规整排序'
        });
        // btns.push({
        //   code: 'goBusObjectSubsEdit',
        //   type: 'primary',
        //   name: '上一步',
        //   icon: 'fa fa-arrow-left'
        // });
        btns.push({
          code: 'closeEdit',
          type: 'primary',
          name: '关闭',
          icon: 'fa fa-close',
          title: '关闭'
        });
        return btns;
      },
      // 工具栏按钮事件
      toolbarButtonClickEvent({ code }, event) {
        const that = this;
        if (code == 'default.add') {
          that.showDialogEdit(FUI.FormAction.Add, '');
        } else if (code == 'default.delete') {
          that.myToolBarDeleteEvent();
        } else {
          var fn = that[code];
          fn();
        }
      },
      autoReSetFiledDefOrderNo() {
        var that = this;
        if (that.currentBoId == '') {
          FUI.Window.showMsg(that, '请选择左侧指定的业务对象');
          return false;
        }
        FUI.Window.confirm(that, '确定重置规整表的字段排序号？', null, function (r) {
          var data = Object.toAjaxJson(FUI.Handlers.SmartFormHandler, 'autoReSetFiledDefOrderNo', {
            'formDefId': that.formDefId,
            'busObjectId': that.currentBoId
          });
          if (data.success == true) {
            that.dg.DefaultWhere = " FormDefId='" + that.formDefId + "' s_and ColumnType='base'  s_and BusObjectId='" + that.currentBoId + "'";
            that.dg.Reload();
          } else {
            FUI.Window.showMsg(that, data.msg);
          }
        });
      },
      selectColumn() {
        var that = this;
        if (that.currentBoId == '') {
          FUI.Window.showMsg(that, '请选择左侧业务对象');
          return false;
        }
        FUI.dialog(__webpath + '/workflow/smartForm/busObjectColumnSelect/?busObjectId=' + that.currentBoId, '选择业务字段', null, 800, 450, function (objectData, index, layerObj) {
          Object.toAjaxJson(FUI.Handlers.SmartFormHandler, 'saveColumnSelect', {
            busObjectId: that.currentBoId,
            formDefId: that.formDefId,
            columnIds: objectData.columnId
          });
          setTimeout(function () {
            that.dg.Reload();
          }, 300);
          layerObj.close(index);
        }, true);
      },
      // 表单编辑
      goFormDefEdit() {
        window.location.href = __webpath + '/workflow/smartForm/formDefEdit/?parentGridId=grid&formAction=Edit&mainTable=f2bpm_form_FormDef&keyId=' + this.formDefId;
        //无#window.location.reload()
      },
      // 关联表
      goFormDefTableRelList() {
        var that = this;
        window.location.href = __webpath + '/workflow/smartForm/table/formDefTableRelList/?formDefId=' + this.formDefId + '&categoryCode=' + that.categoryCode;
      },
      // 业务表对象编辑
      goBusObjectSubsEdit() {
        var that = this;
        window.location.href = __webpath + '/workflow/smartForm/busObjectSubsEdit/?formDefId=' + this.formDefId + '&categoryCode=' + that.categoryCode;
      },
      // 字段元素
      goFormFieldList() {
        window.location.href = __webpath + '/workflow/smartForm/formFieldList/?formDefId=' + this.formDefId + '&categoryCode=' + this.categoryCode;
      },
      tabsClick(tab) {
        var that = this;
        var name = tab.name;
        if (name == 'goFormDefEdit') {
          that.goFormDefEdit();
        } else if (name == 'goBusObjectSubsEdit') {
          that.goBusObjectSubsEdit();
        } else if (name == 'goFormFieldList') {
          that.goFormFieldList();
        } else if (name == 'goFormDefTableRelList') {
          that.goFormDefTableRelList();
        }
      }
    }
  }
</script>