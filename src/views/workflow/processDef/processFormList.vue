<template>
  <div class="f2bpm-page-layout  ">
    <el-container>
      <el-header style="padding: 0;padding-left: 5px;border-bottom: solid #e8eaec  1px;height: 40px;">
        <el-tabs :value="actionName" @tab-click="tabsClick" class="my-tabtoolbar-el-tabs-hidden-content">
          <el-tab-pane :label="$t('pageInfo.procForm')" name="workflowForm" />
          <el-tab-pane :label="$t('pageInfo.generalForm')" name="noWorkflowForm" />
        </el-tabs>
      </el-header>
      <el-container>
        <el-aside ref="sideLeft" class="f2bpm-page-left" hide-trigger collapsible :width="isCollapsed?'20px':'200px'">
          <div class="f2bpm-panel-head">
            <div v-if="!isCollapsed" class="f2bpm-left-search-div">
              <el-input v-model="treeFilterText" class="left-htead-treeFilterText-box"   size="small" clearable :placeholder="$t('enterKey')" autocomplete="off" prefix-icon="el-icon-search" />
            </div>
            <div  class="f2bpm-left-search-button-div">
              <i v-if="!isCollapsed" :title="$t('refresh')" class="icon icon-shuaxin cur mr10 font12  " @click="loadTree()"></i>
              <i title="收起/展开" :class="rotateIcon" @click="collapsedSider" />
            </div>
          </div>
          <div v-if="!isCollapsed" class="f2bpm-page-left-content auto-window-height mt5">
            <div class="mytree-cube-box-container">
              <span class="cur  mytree-cube-box " @click="showAll()"><i class="icon icon-quanbu font16"></i>  {{$t('all')}}</span>
              <span class="cur  mytree-cube-box" @click="categoryManager('FormCategory')"><i class="icon icon-fenlei font16"></i> {{$t('category')}}</span>
            </div>
            <el-tree ref="mytree" :data="treeData" :expand-on-click-node="false" :filter-node-method="filterTreeNode" default-expand-all @node-click="onTreeSelected" />
          </div>
        </el-aside>
        <el-main class="f2bpm-page-right">
          <f2bpm-gridsearchform  @expandclick="expandClick"  :tableform="tableForm" @searchformbtnclick="searchFormbtnClick" @updatevalue="updateFieldValue" />
          <f2bpm-datagrid ref="grid" :expand-search="expandSearch"  height="full-230"  :show-checkbox="false"   :show-seq="true" :toolbar="tableToolbar" :context-menu="{header: {options: headerMenus},className: 'my-menus'}" grid="grid" pk="taskId" :pager-config="tablePage" :data="tableData" :columns="tableColumn" @toolbar-button-click="toolbarButtonClickEvent" @header-contextmenu="contextMenuClickEvent" @page-change="pageChange" @sort-change="sortChange" />
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
        language: "",
        actionName: 'workflowForm',
        currCategoryCode: '',
        applyType: "",
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
        searchFromData: {
          moreIcon: 'fa fa-angle-double-down',
          moreTitle: this.$t('expand'),
          collapsedHeight: 'grid-search-form-list-height'
        },
        searchParams: {
          // 特殊查询
          formCategoryCode: ''
        }
      };
    }, computed: {
      countGridHeight() {
        return $(document).height() - global_datagridHeightDiff - 150;
      },
      rotateIcon() {
        return this.isCollapsed ? 'icon icon-arrow-right-bold cur' : 'icon icon-arrow-left-bold cur';
      }
    },
    watch: {
      treeFilterText(val) {
        this.$refs.mytree.filter(val);
      },
      $route() {
        this.pageload();
      }
    },
    created() {
      var $vm = this;
      var that = this;
      that.language = that.$store.state.app.language;
      var applyType = Object.toQueryString('applyType') || 'workflowForm';
      that.actionName = applyType;
      that.applyType = applyType;
      var dg = FUI.DataGrid.Create($vm, 'f2bpm_ProcessForm', 'f2bpm_ProcessForm', 'grid', true, true, true);
      dg.SortName = 'createdTime';
      dg.SortOrder = 'desc';
      dg.ShowNumbers = true;
      dg.Url = FUI.Handlers.WorkflowManageHandler + 'getListProcessFormApp/?isMaster=1&applyType=' + that.actionName;
      dg.OperationAction.ShowEdit = true;
      dg.IsEnableReloadWhere = true;
      dg.OperationAfterSaveRowIsRefresh = true;
      dg.OperationAction.ShowView = false;
      dg.OperationCustomButton = this.myOperationCustomButton;
      dg.OperationDeleteEvent = this.myOptionDelete;
      dg.OptionBeforeDelete = this.myOptionBeforeDelete;
      dg.OptionAfterDelete = this.myOptionAfterDelete
      dg.OperationEditEvent = this.myOperationEditEvent;
      dg.ToolBarCustomButton = this.myToolBarCustomButton;
      // 工具栏
      dg.ToolBarDefaultButtons.ShowAdd = true;
      dg.ToolBarDefaultButtons.ShowDelete = false;
      dg.ToolBarAddEvent = defaultToolBarAddFunction;
      dg.EditTitle = '表单应用';

      dg.Bind();
      this.loadTree();
    },
    mounted() {
      window.myvm = this;
      $('.fa-backward').parent().parent().hide();
      window.autoPageHeight();
    },
    methods: {
      pageload() {
        var that = this;
        var applyType = Object.toQueryString('applyType') || 'workflowForm';
        that.actionName = applyType;
        that.dg.Url = FUI.Handlers.WorkflowManageHandler + 'getListProcessFormApp/?isMaster=1&applyType=' + that.actionName;
        that.dataGridReSet();
      },
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
        this.searchParams.formCategoryCode = '';
        this.dataGridSearch();
      },
      loadTree() {
        var that = this;
        var treeUrl = FUI.Handlers.CategoryHandler + '?groupKey=FormCategory';
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
        this.searchParams.formCategoryCode = this.currCategoryCode;
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
      myOperationViewEvent(value, row, index) {
        this.showDialogEdit(FUI.FormAction.View, row[this.dg.IdField]);
      },
      myOperationEditEvent(value, row, index) {
        this.showDialogEdit(FUI.FormAction.Edit, row[this.dg.IdField]);
      },
      showDialogEdit(formAction, keyId) {
        var that = this;
        var title = formAction == FUI.FormAction.Add ? '新增表单应用' : '编辑表单应用';
        var url = formAction == FUI.FormAction.Add ? __webpath + '/workflow/processDef/processFormEdit?applyType=' + that.actionName : __webpath + '/workflow/processDef/processFormEdit';
        FUI.Window.openEdit(url, title, formAction, that.dg.GridId, 890, 580, null, that.dg.MainTable, keyId);
      },

      myToolBarCustomButton() {
        var that = this;
        var btns = [];
        btns.push({ code: 'importProcessFromXml', status: 'default', name: '导入表单设计', alias: 'Import Form', icon: 'fa fa-upload' });
        btns.push({ code: 'bathSetCategory', status: 'default', name: '设置分类', alias: 'Set Category', icon: 'fa fa-cog' });
        btns.push({ code: 'backMasterList', status: 'default', name: '返回主版本列表', alias: 'Go Back', icon: 'fa fa-backward' });
        if (that.applyType == 'noWorkflowForm') {
          btns.push({ code: 'importProcessFormOneStationXml', status: 'default', alias: 'Import', title: '导入包含： 表单设计+数据建模+字段权限', name: '一站式导入', icon: 'icon  icon-Controls-58  ' });
          btns.push({ code: 'importProcessFormOneStationXmlBatch', status: 'default', alias: 'Import', title: '导出包含： 表单设计+数据建模+字段权限', name: '批量导出', icon: 'icon  icon-a-daoru1' });
       }
        return btns;
      },
      // 操作列自定义按钮
      myOperationCustomButton(h, value, row, index) {
        var custBtns = [];
        if (row.formType == 'NoneForm') {
          return custBtns;
        }
        if (row.formType == 'OnlineForm') {
          var item = { title: '表单设计', alias: 'PC Form', tip: 'PC表单设计', class: 'fa fa-desktop', code: 'onlineFormDesigner', click: () => this.onlineFormDesigner(row.formId, row.formDefId, row.formKey, row.formName, 'pc') };
          custBtns.push(item);
          if (row.applyType == 'workflowForm') {
            item = { title: '手机表单', alias: 'Mobile Form', tip: '手机表单设计', class: 'fa fa-building-o', code: 'onlineFormDesigner', click: () => this.onlineFormDesigner(row.formId, row.formDefId, row.formKey, row.formName, 'mobile') };
            custBtns.push(item);

            item = { index: 31, title: '升级版本号', alias: 'Upgrade Version', tip: '', class: 'fa fa-files-o', code: 'publishVersion', click: () => this.publishVersion(row.formId, row.formName) };
            custBtns.push(item);
            item = { index: 32, title: '查看历史版本', alias: 'Show History Version', tip: '', class: 'fa  fa-calendar-o', code: 'historyVersion', click: () => this.historyVersion(row.formKey, row.formName) };
            custBtns.push(item);
            item = { index: 33, title: '设为主版本', alias: 'Set Major Version', tip: '', class: 'fa  fa-wrench', code: 'setFormMaster', click: () => this.setFormMaster(row.formId, row.formKey, row.formName, row.isMaster) };
            custBtns.push(item);
          }
          var item = { index: 45, title: '复制表单', alias: 'PC Form', tip: '复制表单模板', class: 'fa fa-clipboard', code: 'copyProcessForm', click: () => this.copyProcessForm(row.formId, row.formKey, row.formName) };
          custBtns.push(item);
          item = { index: 46, title: '打印模板', alias: 'Print Template', tip: '打印模板设计', class: 'fa fa-print', code: 'onlineExcelDesigner', click: () => this.onlineExcelDesigner(row.formId, row.formDefId, row.formKey, row.formName) };
          custBtns.push(item);

          if (row.applyType == 'noWorkflowForm') {
            item = { title: '字段权限设置', alias: 'Field Permission', tip: '字段权限设置', class: 'fa fa-gears', code: 'editFormPermission', click: () => this.formFieldListPermissions(row.formKey, row.formName) };
            custBtns.push(item);
            item = { index: 99, title: '转为流程表单', alias: 'Change To WorkflowForm', tip: '转为流程表单，如果已设置了表单字段权限将会被删除，转成功后需要手动重新设置', class: 'icon icon-Controls-75', code: 'changeToWorkflowForm', click: () => this.changeToWorkflowForm(row.formKey, row.formName) };
            custBtns.push(item);
          }
          item = { title: '自定义列表设计', alias: 'Custom List Design', tip: '自定义列表设计', class: 'fa fa-list-alt', code: 'editCustDataGridList', click: () => this.editCustDataGridList(row.formKey, row.formName) };
          custBtns.push(item);
        }

        item = { index: 34, title: '被引用流程应用', alias: 'Show Referenced', tip: '查看被引用流程应用', class: 'fa  fa-cubes', code: 'showAppOfDef', click: () => this.showAppOfDef(row.formKey, row.formName) };
        custBtns.push(item);
        item = { index: 35, title: '导出', alias: 'Export', tip: '导出仅包含表单设计模板', class: 'fa  fa-download', code: 'downLoadProcessForm', click: () => this.downLoadProcessForm(row.formId) };
        custBtns.push(item);
        if (row.applyType == 'noWorkflowForm') {
          item = { index: 36, title: '一站式导出', alias: 'Export', tip: '包含表单设计+数据建模', class: 'fa  fa-download', code: 'downloadProcessFormOneStationXml', click: () => this.downloadProcessFormOneStationXml(row.formName, row.formId) };
          custBtns.push(item);
        }

        return custBtns;
      },
      // 工具栏按钮事件
      toolbarButtonClickEvent({ code, btn }, event) {
        const that = this;
        if (code == 'default.add') {
          that.showDialogEdit(FUI.FormAction.Add, '');
        } else if (code == 'default.delete') {
          that.dg.ToolBarBathDelete(that);
        } else if (code == 'bathSetCategory') {
          this.bathSetCategory();
        } else {
          var fn = that[code];
          fn();
        }
      },
      operationCustomButtonClick(value, row, index) {
        alert('操作列自定义按钮事件调用：' + value);
      },
      extend_OperationShowDefaultButton(value, row, index) {
        // 扩展控制操作列默认的三个显示按钮
        return { 'showEdit': true, 'showView': true, 'showDelete': true };
      },
      myOptionDelete(value, row, index) {
        var that = this;
        if (row.formKey == 'NoneForm') {
          FUI.Window.showMsg('系统的“无需表单”，不可删除');
          return false;
        }
        var msg = row.isMaster == 1 ? '注意：你要删除的表单为主版本表单，删除主版本表单会同时删除如果存在有子版本将会一并删除，请谨慎操作。 您确定还要删除【' + row.formName + '】？' : '您确定要删除【' + row.formName + '】？';
        FUI.Window.confirm(that, msg, '删除提示', function (r) {
          var data = null;
          if (row.isMaster == 1) {
            // 同时删除历史版本的表单应用
            data = Object.toAjaxJson(FUI.Handlers.WorkflowManageHandler, 'deleteProcessformAndAllVersion', {
              formKey: row.formKey
            }, false);
          } else {
            data = Object.toAjaxJson(FUI.Handlers.WorkflowManageHandler, 'deleteProcessformByFormId', {
              formId: row.formId
            }, false);
          }
          if (data.success == false) {
            FUI.Window.showMsg(that, data.msg);
            return true;
          } else {
            that.refreshGrid();
            FUI.Window.showMsg(that, data.msg);
          }
        });
        return false;
      },
      myOptionBeforeDelete(value, row, index) {
        var that = this;
        var data = Object.toAjaxJson(FUI.Handlers.WorkflowManageHandler, 'existProcessFormInstance', {
          workflowKey: row.formKey,
          formId: row.formId
        }, false);
        if (data.success == false) {
          return true;
        } else {
          FUI.Window.showMsg(data.msg);
        }
        return false;
      },
      myOptionAfterDelete(value, row, index,callback){
      console.log('删除后置事件')
      },
      // 编辑器
      formTypeEditor(col) {
        const formTypeEditor = FUI.Tool.createrComboboxEditor([{
          'text': '在线表单',
          'value': 'OnlineForm'
        }
          , {
          'text': '无需表单',
          'value': 'NoneForm'
        }
          , {
          'text': 'URL表单',
          'value': 'UrlForm'
        }
        ]);
        return formTypeEditor;
      },
      applyTypeEditor(col) {
        const formTypeEditor = FUI.Tool.createrComboboxEditor([{
          'text': '流程表单',
          'value': 'workflowForm'
        }, {
          'text': '无流程表单',
          'value': 'noWorkflowForm'
        }]);
        return formTypeEditor;
      },
      showAppOfDef(formKey, formName) {
        var that = this;
        FUI.Window.openEdit(__webpath + '/workflow/processDef/showAppOfDef/?formKey=' + formKey, '表单应用【' + formName + '】被引用到的流程应用', FUI.FormAction.View, '', 650, 350, null, '', '', false);
      },
      onlineExcelDesigner(parentFormId, formDefId, formKey, formName) {
        var that = this;
        // 换回打印模板自己的formId
        var res = Object.toAjaxJson(FUI.Handlers.SmartFormHandler, 'getPrintExcelFormId', { parentFormId: parentFormId });
        if (res.success) {
          var url = __webpath + '/workflow/smartForm/onlineExcelDesigner/';
          var printFormId = res.data.formId;
          FUI.Window.open(url + '?formId=' + printFormId + '&formDefId=' + formDefId);
        }
      },
      copyProcessForm(formId, formKey, formName) {
        var that = this;
        Object.toAjaxJson('/workflow/smartForm/', 'copyProcessForm', { formId: formId }, true, null,
          function (res) {
            if (res.success) {
              FUI.Window.showMsg(res.msg, null, res.success ? 1 : 7);
              that.refreshGrid();
            } else {
              FUI.Window.showMsg(res.msg);
            }
          }
        );
      },
      onlineFormDesigner(formId, formDefId, formKey, formName, type) {
        var that = this;
        var url = __webpath + '/workflow/smartForm/onlineFormDesigner/';
        FUI.Window.open(url + '?type=' + type + '&formKey=' + formKey + '&formDefId=' + formDefId + '&formId=' + formId);
      },
      formFieldListPermissions(formKey, formName) {
        var url = __webpath + '/workflow/smartForm/formPermission/formFieldListPermissions/?rightType=noWorkflowForm&formKey=' + formKey;
        FUI.Window.open(url);
      },
      changeToWorkflowForm(formKey, formName) {
        var that = this;
        var msg = "请谨慎操作，您确定将表单【" + formName + "】转为有流程表单吗?<br>如果已配置表单字段权限将会被删除，如果有配置自定义列表，需要手动填写绑定信息里的“流程应用ID”，<br>同时手动自行删除数据库表数据";
        FUI.Window.confirm(msg, null, function () {
          Object.toAjaxJson('/workflow/smartForm/', 'changeToWorkflowForm', { formKey: formKey }, true, null,
            function (res) {
              if (res.success) {
                FUI.Window.showMsg(res.msg, null, res.success ? 1 : 7);
                that.refreshGrid();
              } else {
                FUI.Window.showMsg(res.msg);
              }
            }
          );
        });
      }
      , editCustDataGridList(formKey, formName) {
        var that = this;
        FUI.Window.openEdit('/workflow/security/customDataGrid/customDataGridList/?formKey=' + formKey, '自定义列表', 'Edit', that.dg.GridId, 600, 400, null, null, '', true);
      },
      // 另存为模板库模板
      saveasTemplate(formId, FormName) {
        var that = this;
        FUI.Window.confirm(that, '您确定要对【' + FormName + '】另存为模板库模板吗？', '另存为模板', function (r) {
          var data = Object.toAjaxJson(FUI.Handlers.SmartFormHandler, 'saveAsToTemplate', {
            formId: formId
          });
          FUI.Window.showMsg(that, data.msg, null, data.success ? 1 : 7);
          if (data.success) {
            that.dg.Reload();
          }
        });
      },
      // 发布新版本
      publishVersion(formId, FormName) {
        var that = this;
        FUI.Window.confirm(that, '您确定要对【' + FormName + '】升级版本号？', '升级版本号', function (r) {
          if (r) {
            var data = Object.toAjaxJson(FUI.Handlers.WorkflowManageHandler, 'publishWorkflowFormVersion', {
              formId: formId
            });
            FUI.Window.showMsg(that, data.msg);
            if (data.success) {
              that.dg.Reload();
            }
          }
        });
      },
      // 设置为主版本
      setFormMaster(formId, formKey, FormName, isMaster) {
        var that = this;
        if (isMaster == 1) {
          FUI.Window.showMsg(that, '当前已是主版本');
          return false;
        }
        FUI.Window.confirm(that, '您确定要对【' + FormName + '】设置为主版？', '变更主版本', function (r) {
          if (r) {
            var data = Object.toAjaxJson(FUI.Handlers.WorkflowManageHandler, 'setMasterByFormIdAndOtherNotMaster', {
              formId: formId,
              formKey: formKey
            });
            FUI.Window.showMsg(that, data.msg);
            if (data.success) {
              that.dg.Reload();
            }
          }
        });
      },
      // 查看历史版本
      historyVersion(formKey) {
        var that = this;
        var newUrl = FUI.Handlers.WorkflowManageHandler + 'getListProcessFormApp/?formKey=' + formKey;
        that.dg.Url = newUrl;
        that.dg.Reload();
        $('.fa-backward').parent().parent().show();
      },
      backMasterList() {
        var that = this;
        var newUrl = FUI.Handlers.WorkflowManageHandler + 'getListProcessFormApp/?isMaster=1';
        that.dg.Url = newUrl;
        that.dg.Reload();
        $('.fa-backward').parent().parent().hide();
      },
      // 表单Html模板编辑
      editHtmlForm(formId, formDefId, formKey, formName, type) {
        var that = this;
        var url = __webpath + '/workflow/smartForm/formDesigner/';
        FUI.Window.open(url + '?type=' + type + '&formDefId=' + formDefId + '&formId=' + formId);
        // FUI.Window.openEdit(url + "?type=" + type + "&formDefId=" + formDefId + "&formId=" + formId, "编辑表单Html【" + formName + "】", FUI.FormAction.Edit, dg.GridId, 880, 450, null, "f2bpm_ProcessForm", "f2bpm_ProcessForm", true);
      },

      bathSetCategory() {
        var that = this;
        var ids = FUI.Grid.getGridChecked(that, 'grid', 'formId');
        if (ids == '') {
          FUI.Window.showMsg(that, '请选择要设置的行！');
          return false;
        }
        WF.SelectorDialog.setCategory('f2bpm_ProcessForm', 'formId', ids, 'formCategoryCode', 'FormCategory');
      },

      //批量导出
      importProcessFormOneStationXmlBatch(){
        var that = this;       
        var formId =  that.dg.getChecked('formId');
        if (formId == '') {
          FUI.Window.showMsg(this, '请选择要导出的表单设计', null, null, function (modal) {
            modal.show = false;
          });
          return false;
        } else {
            FUI.Window.confirm("确定要导出选择的表单设计", null, function () {
              var data = Object.toAjaxDownloadFile("/workflow/processOneStationImportExport/", 'downloadProcessFormOneStationXmlBatch', {
                  formId: formId
                });
            });
        }
      },
      downLoadProcessForm(formId) {
        if (formId == '') {
          FUI.Window.showMsg('请选择要导出的表单设计！');
          return false;
        }
        var data = Object.toAjaxDownloadFile(FUI.Handlers.WorkflowManageHandler, 'downLoadProcessFormXml', {
          formId: formId
        });
      }
      , importProcessFromXml() {
        FUI.Window.openEdit(__webpath + '/workflow/processDef/processFromImport', '导入表单设计', FUI.FormAction.Edit, '', 550, 380);
      }
      //一站式导入
      , importProcessFormOneStationXml() {
        FUI.Window.openEdit('/workflow/processDef/processOneStationImport?importType=processForm', '一站式导入表单设计', FUI.FormAction.Edit, '', 550, 440);
      }
      //一站式导出： 普通表单设计+数据建模
      , downloadProcessFormOneStationXml(formName, formId) {
        if (formId == '') {
          FUI.Window.showMsg('请选择要导出的表单设计！');
          return false;
        }
        var data = Object.toAjaxDownloadFile("/workflow/processOneStationImportExport/", 'downloadProcessFormOneStationXml', {
          formId: formId
        });
      }
      , categoryManager(groupKey) {
        var that = this;
        var url = '/workflow/security/category/categoryList_bygroupKey?groupKey=' + groupKey;
        var title = "分类管理";
        FUI.Window.openEdit(url, title, "Edit", "grid", 700, 500, null, "", "", true);
      }
      // 有流程表单
      , goWorkflowForm() {
        var that = this;
        window.location.href = __webpath + '/workflow/processDef/processFormList/?applyType=' + this.actionName;
      },
      // 无流程表单
      goNoWorkflowForm() {
        window.location.href = __webpath + '/workflow/processDef/processFormList/?applyType=' + this.actionName;
      },
      tabsClick(tab) {
        var that = this;
        var name = tab.name;
        that.actionName = name;
        if (name == 'workflowForm') {
          that.goWorkflowForm();
        } else if (name == 'noWorkflowForm') {
          that.goNoWorkflowForm();
        }
      }
    }

  }
</script>