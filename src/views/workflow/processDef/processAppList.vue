<template>
  <div class="f2bpm-page-layout">
    <el-container>
      <el-aside ref="sideLeft" class="f2bpm-page-left" hide-trigger collapsible :width="isCollapsed?'20px':'210px'">
        <div class="f2bpm-panel-head">
          <div v-if="!isCollapsed" class="f2bpm-left-search-div">
            <el-input v-model="treeFilterText" class="left-htead-treeFilterText-box" size="small" clearable :placeholder="$t('enterKey')" autocomplete="off" prefix-icon="el-icon-search" />
          </div>
          <div class="f2bpm-left-search-button-div">
            <i v-if="!isCollapsed" :title="$t('refresh')" class="icon icon-shuaxin  cur mr10 font12  " @click="loadTree()"></i>
            <i title="收起/展开" :class="rotateIcon" @click="collapsedSider" />
          </div>
        </div>
        <div v-if="!isCollapsed" class="f2bpm-page-left-content auto-window-height-bigger mt4 pr5">
          <div class="mytree-cube-box-container">
            <span class="cur  mytree-cube-box " @click="showAll()"><i class="icon icon-quanbu font16"></i> <span class="mytree-cube-box-title">{{$t('all')}}</span></span>
            <span class="cur  mytree-cube-box" @click="categoryManager('WorkflowGroup')"><i class="icon icon-fenlei font16"></i> <span class="mytree-cube-box-title">{{$t('category')}}</span> </span>
          </div>
          <el-tree ref="mytree" :data="treeData" highlight-current 
          :filter-node-method="filterTreeNode" :expand-on-click-node="false" 
          default-expand-all @node-click="onTreeSelected" />
        </div>
      </el-aside>
      <el-main class="f2bpm-page-right">
        <f2bpm-gridsearchform @expandclick="expandClick" :tableform="tableForm" @searchformbtnclick="searchFormbtnClick" @updatevalue="updateFieldValue" />
        <f2bpm-datagrid :expand-search="expandSearch" ref="grid" grid="grid" :toolbar="tableToolbar" :context-menu="{header: {options: headerMenus},className: 'my-menus'}" :pager-config="tablePage" :data="tableData" :columns="tableColumn" @cell-dblclick="celldbClick" @toolbar-button-click="toolbarButtonClickEvent" @header-contextmenu="contextMenuClickEvent" @page-change="pageChange" @sort-change="sortChange" />
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
        searchFromData: {
          moreIcon: 'fa fa-angle-double-down',
          moreTitle: this.$t('expand'),
          collapsedHeight: 'grid-search-form-list-height'
        },
        searchParams: {
          // 特殊查询
          appCategoryID: ''
        }
      };
    }, computed: {
      countGridHeight() {
        return $(document).height() - global_datagridHeightDiff;
      },
      rotateIcon() {
        return this.isCollapsed ? 'icon icon-arrow-right-bold cur' : 'icon icon-arrow-left-bold cur';
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
      that.language = that.$store.state.app.language;
      var currUser = that.$store.state.user.author;
      that.tenantId = currUser.tenantId;
      that.isMultiTenant = currUser.isMultiTenant;
      var dg = FUI.DataGrid.Create($vm, 'f2bpm_ProcessApp', 'f2bpm_ProcessApp', 'grid', true, true, true);
      dg.SortName = 'createdTime';
      dg.SortOrder = 'desc';
      dg.ShowNumbers = true;
      dg.ExpansMore = false;
      dg.Url = FUI.Handlers.WorkflowManageHandler + 'getListProcessApp';
      // 是否开启双击编辑
      dg.EnableDblClickEdite = true;
      dg.OperationAction.ShowEdit = true;
      dg.OperationAction.ShowDelete = false;
      dg.OperationAction.ShowView = false;
      dg.OperationEditEvent = this.myOperationEditEvent;
      dg.ToolBarCustomButton = this.myToolBarCustomButton;
      // 工具栏
      dg.ToolBarDefaultButtons.ShowAdd = true;
      dg.ToolBarDefaultButtons.ShowDelete = false;
      // dg.ToolBarAddEvent = this.defaultToolBarAddFunction;
      dg.OperationCustomButton = this.myOperationCustomButton;
      dg.EditTitle = '流程应用';
      dg.Bind();
      this.loadTree();
    },
    mounted() {
      window.myvm = this;
      $('.f2bpm-page-layout').height($(window).height() - 50);
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
      refreshTree() {
        this.loadTree();
      }
      , showAll() {
        this.searchParams.appCategoryID = '';
        this.dataGridSearch();
      },
      loadTree() {
        var that = this;
        var treeUrl = FUI.Handlers.CategoryHandler + '?groupKey=WorkflowGroup';
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
            FUI.Window.showMsg(that, res.msg);
          }
        });
      },
      myToolBarCustomButton() {
        var that = this;
        var btns = [];

        btns.push({ code: 'copyAdd', type: 'primary', name: '复制', alias: 'Copy Add', title: '复制包括：流程设计+字段权限配置', icon: 'icon icon-fuzhi1' });
        btns.push({ code: 'importProcessAppXml', status: 'default', alias: 'Import', title: '导入包含：流程设计+字段权限', name: '导入流程设计', icon: 'icon icon-daoru1' });
        btns.push({ code: 'importProcessOneStationXml', status: 'default', alias: 'Import', title: '导入包含：流程设计+表单设计+数据建模+字段权限', name: '一站式导入', icon: 'icon  icon-a-daoru1' });
        btns.push({ code: 'leadingOutOneStationXml', status: 'default', alias: 'Import', title: '导出包含：流程设计+表单设计+数据建模+字段权限', name: '一站式导出', icon: 'icon  icon-a-daoru1' });
             
        btns.push({ code: 'combinAdd', type: 'primary', name: '新增（共用流程）', alias: 'Combine Add', title: '使用共用流程来新建流程应用', icon: 'icon icon-wenjianxinzeng' });
        btns.push({ code: 'bathSetCategory', type: 'primary', name: '设置分类', alias: 'Set Category', icon: 'icon icon-shezhi' });
        btns.push({ code: 'cleanWfInstanceData', type: 'primary', name: '清除流程实例数据', alias: 'Clear Process Instance Data', icon: 'icon icon-qingchu' });
        btns.push({ code: 'refreshcache', type: 'primary', name: '刷新缓存', alias: 'Refresh Cache', icon: 'icon icon-shuaxin' });
        // if (that.isMultiTenant && that.tenantId == 'BPM') {
        //   btns.push({ code: 'publishToTenantor', title: '只克隆分发流程设计本身，对于系统基础数据并不会克隆，请注意数据基础。', status: 'default', name: '克隆分发给租户', alias: 'Publish To Tenantor', icon: 'fa fa-share' });
        // }
        return btns;
      },
      myOperationEditEvent(value, row, index) {
        this.showDialogEdit(FUI.FormAction.Edit, row.appId);
      },
      // ====stand:标准方法控制结束==============
      myOperationViewEvent(value, row, index) {
        this.showDialogEdit(FUI.FormAction.View, row.appId, row.appType);
      },
      myOperationEditEvent(value, row, index) {
        this.showDialogEdit(FUI.FormAction.Edit, row.appId, row.appType);
      },
      showDialogEdit(formAction, keyId, appType) {
        var that = this;
        if (appType == "combine") {
          that.processAppCombinEdit(formAction, keyId);
          return false;
        }
        var title = formAction == FUI.FormAction.Add ? '新增流程应用' : '编辑流程应用';
        FUI.Window.openEdit(__webpath + '/workflow/processDef/processAppEdit', title, formAction, that.dg.GridId, 890, 580, null, that.dg.MainTable, keyId, true);
      },
      // 工具栏按钮事件,包括扩展按钮事件
      toolbarButtonClickEvent({ code }, event) {
        if (code == 'cleanWfInstanceData') {
          this.cleanWfInstanceData();
        } else if (code == 'default.add') {
          this.showDialogEdit(FUI.FormAction.Add, '');
        } else if (code == 'bathSetCategory') {
          this.bathSetCategory();
        } else if (code == 'combinAdd') {
          this.processAppCombinEdit(FUI.FormAction.Add, '');
        } else {
          this[code]();
        }
      },
      myOperationViewEvent(value, row, index) {
      },
      myOperationDeleteEvent(value, row, index) {
      },
      myOperationCustomButton(h, value, row, index) {
        var custBtns = [];
        var item = {
          index: 30, title: '删除', alias: 'Delete', tip: '删除', class: 'fa fa-trash-o', code: 'deleteAppId',
          click: () => this.deleteAppId(value, row, index)
        };
        custBtns.push(item);
        item = { index: 31, title: '导出', alias: 'Export', tip: '包含：流程设计+字段权限配置（如有）', class: 'icon icon-daoru1', code: 'downloadProcessApp', click: () => this.downloadProcessApp(row.appId, row.appName) };
        custBtns.push(item);
        item = { index: 32, title: '一站式导出', alias: 'Export', tip: '包含：流程设计+表单设计+数据建模+字段权限配置（如有）', class: 'icon icon-beifen', code: 'downloadProcessOneStationXml', click: () => this.downloadProcessOneStationXml(row.appId, row.appName) };
        custBtns.push(item);
        // var item4 = { index: 35, title: '字段权限', tip: '表单字段权限设置', class: 'fa fa-gears', code: 'formFieldListPermission', click: () => this.editFormPermission(row.appId, row.appName) };
        if (row.formKey != 'NoneForm' && !Object.toStartWith(row.formKey, 'urlForm')) {
          item = { index: 35, title: '表单字段权限', alias: 'Field Permissions', tip: '表单字段权限设置', class: 'icon icon-baobiaoshouquan', code: 'formFieldListPermissions', click: () => this.editFormPermissions(row.appId, row.appName) };
          custBtns.push(item);
          item = {
            index: 100, title: '节点表单数据转单', alias: 'Node Form Data Transfer', tip: '配置流程节点表单节点之间数据转单', class: 'icon icon-dingdanbohui', code: 'formDataTransferSet',
            click: () => this.formDataTransferSet(row.appId, row.appName)
          };
          custBtns.push(item);
        }
        item = {
          index: 90, title: '流程仿真', tip: '流程仿真', alias: 'Process Simulation', class: 'icon icon-fuzhi1', code: 'workflowSimulation',
          click: () => this.workflowSimulation(value, row, index)
        };
        custBtns.push(item);
        item = {
          index: 99, title: '发起流程', tip: '发起流程', alias: 'Start Process', class: 'icon icon-yewuliufaqi', code: 'startWorkflow',
          click: () => this.startWorkflow(value, row, index)
        };
        custBtns.push(item);

        return custBtns;
      },
      formDataTransferSet(appId, appTitle) {
        var that = this;
        FUI.Window.openEdit('/workflow/smartForm/formDataTransfer/formDataTransferList?appId=' + appId, '【' + appId + appTitle + '】配置节点表单数据转单', 'Edit', that.dg.GridId, that.dg.EditWidth, that.dg.EditHeight, null, that.dg.MainTable, appId, true);
      },
      deleteAppId(value, row, index) {
        var that = this;
        var appId = row.appId;
        var appName = row.appName;
        var isDeleteProcessDef = true;
        var tip = "【流程定义】";
        if (row.appType == "combine") {
          isDeleteProcessDef = false;
          tip = "";
        }
        var msg = '<em>谨慎操作!!!</em>，您确定要删除流程应用【' + appId + appName + '】 ，将会同时删除' + tip + '【流程实例数据】？';
        FUI.Window.confirm(that, msg, '删除数据提示', function (r) {
          var data = Object.toAjaxJson(FUI.Handlers.WorkflowManageHandler, 'deleteAppIdAndInstData', { 'appId': appId, "isDeleteProcessDef": isDeleteProcessDef });
          if (data.success) {
            FUI.Window.showMsg2(data.msg, null, 1);
            that.dataGridSearch();
          } else {
            FUI.Window.showMsg(data.msg);
          }
        });
      },
      workflowSimulation(value, row, index) {
        var appId = row.appId;
        var appTitle = row.appName;
        // 挽回wid
        var res = Object.toAjaxJson(FUI.Handlers.ProcessDef, 'getWorkflowSimpleInfoByAppId', { appId: appId });
        if (res.success) {
          var wid = res.data.wid;
          var url = '/workflow/flowDesigner/workflowSimulation/?isSimulation=true&wid=' + wid + "&appId=" + appId;
          FUI.Window.openEdit(url, '流程仿真：【' + appId + appTitle + '】', null, null, null, null, null, null, null, true);
        } else {
          FUI.Window.showMsg2(this, '后台请求出错');
        }
      },
      startWorkflow(value, row, index) {
        var appId = row.appId;
        var url = __webpath + '/workflow/workflowform/index/?appId=' + appId;
        FUI.Window.open(url);
      },
      editFormPermission(appId, appName) {
        var that = this;
        FUI.Window.openEdit('/workflow/smartForm/formFieldListPermission/?appId=' + appId, '【' + appName + '】表单字段权限', 'Edit', that.dg.GridId, 600, 400, null, null, '', true);
      },
      editFormPermissions(appId, appName) {
        var that = this;
        var url = __webpath + '/workflow/smartForm/formPermission/formFieldListPermissions/?rightType=globalWfForm&appId=' + appId;
        FUI.Window.open(url);
        // FUI.Window.openEdit(url, "【" + appName + "】表单字段权限", "Edit", that.dg.GridId, 600, 400, null, null, "", true);
      },
      //导出流程应用导出包含：流程应用+流程定义（只包含主版本）+字段权限配置（如查有）
      downloadProcessApp(appId, appName) {
        if (appId == '') {
          FUI.Window.showMsg('请选择要导出的流程应用！');
          return false;
        }
        FUI.Window.confirm("流程设计导出包含：流程设计+全局表单字段权限配置", null, function () {
          var data = Object.toAjaxDownloadFile(FUI.Handlers.WorkflowManageHandler, 'downloadProcessAppXml', {
            appId: appId
          });
        });

      },
      //一站式导出：流程设计+表单设计+数据建模
      downloadProcessOneStationXml(appId, appName) {
        if (appId == '') {
          FUI.Window.showMsg('请选择要导出的流程设计！');
          return false;
        }
        FUI.Window.confirm("导出包含：流程设计+表单设计+数据建模+字段权限配置", null, function () {
          var data = Object.toAjaxDownloadFile("/workflow/processOneStationImportExport/", 'downloadProcessOneStationXml', {
            appId: appId
          });
        });
      },
      copyAdd() {
        var that = this;
        var appId = FUI.Grid.getGridChecked(that, 'grid', 'appId');
        if (!appId) {
          FUI.Window.showMsg('请选择要复制的流程应用！');
          return false;
        }
        if (appId.indexOf(',') > -1) {
          FUI.Window.showMsg('只能选择一条要复制的流程应用！');
          return false;
        }
        var data = Object.toAjaxJson(FUI.Handlers.WorkflowManageHandler, 'copyAddProcessApp', { 'appId': appId });
        if (data.success) {
          that.refreshGrid();
          FUI.Window.showMsg2(that, data.msg, null, 1);
        } else {
          FUI.Window.showMsg2(that, data.msg);
        }
      },
      processAppCombinEdit(formAction, keyId) {
        var that = this;
        var title = formAction == FUI.FormAction.Add ? '新增（共用流程）' : '编辑（共用流程）';
        FUI.Window.openEdit(__webpath + '/workflow/processDef/processAppCombinEdit', title, formAction, that.dg.GridId, 890, 580, null, that.dg.MainTable, keyId, true);
      }
      , importProcessAppXml() {
        FUI.Window.openEdit('/workflow/processDef/processAppImport', '导入流程设计应用', FUI.FormAction.Edit, '', 550, 440);
      }
      , importProcessOneStationXml() {
        FUI.Window.openEdit('/workflow/processDef/processOneStationImport?importType=processApp', '一站式导入流程设计', FUI.FormAction.Edit, '', 550, 440);
      },
      leadingOutOneStationXml() {        
        var that = this;       
        var appIds = that.dg.getChecked('appId');
        if (appIds == '') {
          FUI.Window.showMsg(this, '请选择要导出的实例数据的流程应用', null, null, function (modal) {
            modal.show = false;
          });
          return false;
        } else {
            FUI.Window.confirm("导出包含：流程设计+表单设计+数据建模+字段权限配置", null, function () {
              var data = Object.toAjaxDownloadFile("/workflow/processOneStationImportExport/", 'downloadProcessOneStationXml1', {
                appId: appIds
              });
            });
        }
      }
      , cleanWfInstanceData() {
        var that = this;
        var appIds = that.dg.getChecked('appId');
        if (appIds == '') {
          FUI.Window.showMsg(this, '请选择要清除实例数据的流程应用', null, null, function (modal) {
            modal.show = false;
          });
          return false;
        } else {
          FUI.Window.confirm(this, '请确定要清除' + appIds + '的流程实例数据吗', '删除数据提示', function () {
            var data = Object.toAjaxJson(FUI.Handlers.WorkflowManageHandler, 'cleanWfInstanceData', {
              'appIds': appIds
            });
            FUI.Window.showMsg(that, data.msg, null, null, function (modal) {
              modal.show = false;
            });
            return false;
          });
        }
      },
      categoryManager(groupKey) {
        var that = this;
        var url = '/workflow/security/category/categoryList_bygroupKey?groupKey=' + groupKey;
        var title = "分类管理";
        FUI.Window.openEdit(url, title, "Edit", "grid", 700, 500, null, "", "", true);
      }
      , refreshcache() {
        var that = this;
        Object.toAjaxJson(FUI.Handlers.WorkflowManageHandler, 'refreshcache', null, null, null, function (data) {
          // 刷新Session中的缓存
          that.$store.dispatch('user/removeCache');
          FUI.Window.showMsg(that, data.msg, null, 1);
        });
      },
      bathSetCategory() {
        var that = this;
        var ids = FUI.Grid.getGridChecked(that, 'grid', 'id');
        if (ids == '') {
          FUI.Window.showMsg(that, '请选择要设置的行！');
          return false;
        }
        WF.SelectorDialog.setCategory('f2bpm_ProcessApp', 'id', ids, 'appCategoryID', 'WorkflowGroup');
      }
      , publishToTenantor() {
        var that = this;
        var appId = that.dg.getChecked("appId");
        if (appId == '') {
          FUI.Window.showMsg2('请选择要发布给租户的流程！');
          return false;
        }
        if (appId.indexOf(",") > -1) {
          FUI.Window.showMsg2('只能选择一条流程！');
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
          if (keys.length > 3) {
            FUI.Window.showMsg(that, "由于克隆过程数据处理复杂，一次分发不能超过3个租户，请分多次克隆分发。");
            return false;
          }
          var titles = titles.toString();
          FUI.Window.confirm('只克隆分发流程设计本身，对于系统基础数据并不会克隆，您确定要将所选流程设计克隆并分发给以下租户：' + titles, null, function () {
            var parm = {
              appId: appId,
              tenantCodes: keys.toString()
            };
            var data = Object.toAjaxJson('/workflow/processOneStationImportExport/', 'publishProcessOneStationCloneToTenantor', parm);
            //var data = { success: true, msg: "分发成功" };
            if (data.success) {
              FUI.Window.confirm(data.msg + "，</br>========是否继续发布物理表========</br>选择“确定”将继续“发布物理表”，选择“取消”将不发布物理表", null, function () {
                //同时发布生成物理表
                var res2 = Object.toAjaxJson('/workflow/processOneStationImportExport/', 'createTargetTenantorsDbTableStructure', parm);
                FUI.Window.showMsg(res2.msg, null, 1);
              });
            } else {
              FUI.Window.showMsg(data.msg);
            }
          });
        });
      }
      , formKeyFormatter(row, column, value, index) {
        if (value == null) {
          return "未知";
        }
        if (value == 'NoneForm') {
          return '<span class="cube bg-light black">无表单</span>';
        }
        else if (Object.toStartWith(value, 'urlForm')) {
          return '<span class="cube bg-light black">URL表单</span>';
        }
        else {
          return '<span class="cube bg-light blue">有表单</span>';
        }
      }
      , appTypeFormatter(row, column, value, index) {
        if (value == null || value == '' || value == undefined) {
          return "";
        }
        if (value == 'combine') {
          return '<span class="cube  bg-light blue">使用共用流程</span>';
        }
        return value;
      }
    }

  }
</script>