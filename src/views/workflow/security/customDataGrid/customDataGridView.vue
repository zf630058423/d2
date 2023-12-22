<template>
  <div class="f2bpm-page-layout">
    <el-container>
      <el-aside v-if="leftTreeDef.isEnabled" ref="sideLeft" class="f2bpm-page-left" hide-trigger collapsible :width="isCollapsed?'20px':'200px'">
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
            <span class="cur  mytree-cube-box " @click="showAll()"><i class="icon icon-quanbu font16"></i> {{ $t('all') }}</span>
            <span v-if="leftTreeDef.isCategoryManager" class="cur  mytree-cube-box" @click="categoryManager"><i class="icon icon-fenlei font16"></i> {{ $t('category') }}</span>
          </div>
          <el-tree ref="mytree" :default-expand-all="defaultExpandAll" node-key="id" :default-expanded-keys="defaultExpandedKeys" highlight-current :data="treeData" :filter-node-method="filterTreeNode" :expand-on-click-node="false" @node-click="onTreeSelected" />
        </div>
      </el-aside>
      <el-main class="f2bpm-page-right">
        <f2bpm-gridsearchform :key="gridsearchformKey" :tableform="tableForm" @expandclick="expandClick" @searchformbtnclick="searchFormbtnClick" @updatevalue="updateFieldValue" />
        <f2bpm-datagrid
          :key="datagridKey"
          ref="grid"
          :field-powers="fieldPowers"
          :expand-search="expandSearch"
          grid="grid"
          :toolbar="tableToolbar"
          :context-menu="{header: {options: headerMenus},className: 'my-menus'}"
          :pager-config="tablePage"
          :data="tableData"
          :columns="tableColumn"
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
        userContextInfo: null,
        // 是否在顶层打开
        isOpenTop: false,
        defaultExpandedKeys: [],
        defaultExpandAll: false,
        leftTreeDef: {
          type: '',
          // 默认展开到第几级
          expandedLevel: 2,
          isEnabled: false,
          groupKey: '',
          searchFieldName: '',
          isCategoryManager: false,
          // 指定表名
          tableName: '',
          // id字段所在字段名
          idFieldName: '',
          // 上级字段名
          parentFieldName: '',
          // 标题字段名
          titleFieldName: '',
          // 条件
          sqlwhere: '',
          // 从自己开发的Controller中取
          controller: ''
        },
        expandSearch: '',
        // 自定义变量[{key:value}]格式
        varParams: '',
        dataSource: '',
        gridsearchformKey: '01',
        datagridKey: '02',
        appId: '',
        formKey: '',
        gridType: '',
        jsContent: '',
        // 定义ID
        customDataGridId: '',
        isSetHead: 0,
        code: '',
        // 如果有指定businessKey做为添加时的businessKey
        fixBusinessKey: '',
        // 通过Url传递控制高度
        height: '',
        // 2编辑，3可看
        formAction: null,
        // ======stand:标准区=============
        currCategoryCode: '',
        treeFilterText: '',
        isCollapsed: false,
        operationJson: {},
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
        },
        // 配置对象
        configModel: {},
        // 操作列自定义按钮
        operationCustomButtonJson: [],
        // 工具栏自定义按钮
        toolBarCustomButtonJson: [],
        currentUserId: '',
        currentAccount: '',
        currentOrgId: '',
        currentRealName: '',
        currentRoleCode: '',
        formRightJson: [],
        // 解析后的权限，格式：字段名:{isShow:true/false}
        fieldPowers: {},
        // 子物理表名，如果有值则为明细表的列表
        subTableName: ''
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
      },
      $route() {
        this.load();
      }
    },
    created() {
      var that = this;
      const currUser = that.$store.state.user.author;
      var res = Object.toAjaxJson('/workflow/security/orgImpl/', 'getUserContextInfo', { userId: currUser.userId });
      if (res.success) {
        that.userContextInfo = res.data;
      }
      that.load();
    },
    mounted() {
      var that = this;
      window.myvm = this;

      setTimeout(function() {
        // 加载调用扩展extnedPageLoad()
        var isExist = Object.toIsExitsFunction('extend_pageLoad');
        if (isExist) {
          extend_pageLoad(that);
        }
      }, 400);
    },

    methods: {
      filterTreeNode(value, data) {
        if (!value) return true;
        return data.title.indexOf(value) !== -1;
      },
      showAll() {
        var that = this;
        this.searchParams[that.leftTreeDef.searchFieldName] = '';
        this.dataGridSearch();
      },
      loadTree() {
        var that = this;
        var treeUrl = FUI.Handlers.CategoryHandler + '?groupKey=' + that.leftTreeDef.groupKey;
        if (that.leftTreeDef == null || that.leftTreeDef == undefined || !that.leftTreeDef.isEnabled) {
          return false;
        }
        if (that.leftTreeDef.type == 'controller') {
          treeUrl = that.leftTreeDef.controller;
        }
        Object.toAjaxJson(treeUrl, null, null, true, null, function(res) {
          if (res.success) {
            that.treeData = res.data;
            var msg = res.msg;
            that.loadDefaultExpandedKeys();
          } else {
            FUI.Window.showMsg(that, res.msg);
          }
        });
      },
      onTreeSelected(data, treeNode, thisObj) {
        const that = this;
        const id = treeNode.data.id;
        console.info(id);
        this.searchParams[that.leftTreeDef.searchFieldName] = id;
        this.dataGridSearch();
      },
      loadDefaultExpandedKeys() {
        var that = this;
        that.defaultExpandedKeys = [];
        const level = that.leftTreeDef.expandedLevel;
        if (level != 0) {
          const listResult = Object.toTreeCollection(that.treeData, 'id', that.defaultExpandedKeys, level);
        }
      },
       load() {
        var that = this;
        that.dataSource = '';
        that.subTableName = '';
        var currUser = FUI.Sys.getAuthor();
        var currUserId = currUser.userId;
        var currUserRealName = decodeURI(currUser.realName);
        // url中添加一个isOpenTop=1 即可在层面打开
        const isOpenTop = Object.toQueryString('isOpenTop');
        if (isOpenTop == 1) {
          that.isOpenTop = true;
        }
        const isSetHead = Object.toQueryString('isSetHead') || '0';
        var code = Object.toQueryString('code');
        // 2编辑，3可看
        var formAction = Object.toQueryString('formAction') || '';

        // 切换dataSource
        var dataSource = Object.toQueryString('dataSource') || '';
        // 自定义变量
        var varParams = Object.toQueryString('varParams') || '';
        varParams = decodeURIComponent(varParams);
        that.isSetHead = isSetHead;
        that.code = code;
        that.varParams = varParams;

        // 初始页面原始数据
        that.tablePage = Object.toClone(FUI.DataGridProperty.tablePage);
        that.tableData = [];

        that.tableForm = Object.toClone(FUI.DataGridProperty.tableForm);
        that.tableToolbar = Object.toClone(FUI.DataGridProperty.tableToolbar);
        that.headerMenus = FUI.DataGridProperty.headerMenus;
        that.gridsearchformKey = Object.toGuid();
        that.datagridKey = Object.toGuid();

        that.loadCustomConfig();
        that.loadCustDataGridPermission();
        that.formAction = formAction;
        that.loadDynamicScript();

        var dg = FUI.DataGrid.Create(that, that.configModel.viewTableName, that.configModel.dataMainTableName, 'grid', that.configModel.showCheckBox == '1', true, true);
        dg.ConfigTableName = that.configModel.configTableName;
        that.subTableName = that.configModel.subTableName || '';
        // dg.DBCode=that.configModel.dBSource;
        if (that.configModel.dataSourceName && dataSource == '') {
          dg.DataSource = that.configModel.dataSourceName;
          that.dataSource = that.configModel.dataSourceName;
        } else if (dataSource != '') {
          that.dataSource = dataSource;
          dg.DataSource = dataSource;
        }
        dg.DBCode = '';
        if (that.configModel.dbSourceCode) {
          dg.DBCode = that.configModel.dbSourceCode;
        }
        dg.SortName = that.configModel.sortName;
        dg.SortOrder = that.configModel.sortOrder;
        dg.IsEnableAuthor = that.configModel.isEnableAuthor;
        if (that.configModel.defaultWhere != '') {
          dg.DefaultWhere = that.configModel.defaultWhere;
        }
        if (that.configModel.onlyMySearch == '1') {
          if (dg.DefaultWhere) {
            dg.DefaultWhere += ' s_and +' + that.configModel.creatorIdField + "='" + currUserId + "' ";
          } else {
            dg.DefaultWhere += that.configModel.creatorIdField + "='" + currUserId + "' ";
          }
        }
        if (that.configModel.toolBarDefaultButtons) {
          dg.ToolBarDefaultButtons = eval('(' + that.configModel.toolBarDefaultButtons + ')');
        }
        if (that.configModel.operationAction) {
          var operationJson = eval('(' + that.configModel.operationAction + ')');
          dg.OperationAction = operationJson;
          that.operationJson = operationJson;
        }
        dg.OperationCustomButton = that.myOperationCustomButton;
        if (that.configModel.isDelete != '1' || that.gridType != 'WorkflowForm') {
          dg.ToolBarDefaultButtons.ShowDelete = false;
          dg.OperationAction.ShowDelete = false;
        }
        if (that.appId) {
          // 有流程表单不可以有新增按钮，需要从发起流程中创建新的实例,同时也不允许有编辑
          dg.ToolBarDefaultButtons.ShowAdd = false;
          dg.OperationAction.ShowEdit = false;
        }
        if (that.formAction == '3') {
          // 只看列表，不允许删除和编辑
          dg.ToolBarDefaultButtons.ShowDelete = false;
          dg.ToolBarDefaultButtons.ShowAdd = false;
          dg.OperationAction.ShowDelete = false;
          dg.OperationAction.ShowEdit = false;
        }
        if (that.height) {
          dg.Height = that.height;
        }
        dg.ShowToolbar = that.configModel.showToolbar == '1';
        dg.ToolBarDefaultButtons.ShowSearch = true;
        dg.ShowNumbers = true;
        dg.ToolBarCustomButton = that.myToolBarCustomButton;
        dg.OperationCustomButton = that.myOperationCustomButton;
        dg.OperationEditEvent = that.myOperationEditEvent;
        dg.OperationDeleteEvent = that.myOperationDeleteEvent;
        dg.ToolBarDeleteEvent = that.myToolBarDeleteEvent;
        dg.OperationViewEvent = that.myOperationViewEvent;
        // 未实现
        // dg.SearchFormCreatedAfterEvent = that.mySearchFormCreatedAfterEvent;
        dg.EditWidth = 700;
        dg.EditHeight = 400;
        dg.EditTitle = that.configModel.dataGridTitle;
        dg.Bind();

        that.loadTree();
      },
      collapsedSider() {
        this.isCollapsed = !this.isCollapsed;
      },
      loadCustomConfig() {
        var that = this;
        // 加载配置对象
        var varParams = that.varParams;
        var parm = { 'isSetHead': that.isSetHead, 'code': that.code, 'varParams': varParams };
        // 将Url参数携带进去
        var urlParms = Object.toQueryParmJson();
        $.each(urlParms, function(key, value) {
          if (!parm.hasOwnProperty(key)) {
            parm[key] = value;
          }
        });
        var res = Object.toAjaxJson(FUI.Handlers.CustomDataGridHandler, 'getCustomDataGridJson', parm);
        var configModel = res.data.model;
        if (configModel.leftTreeDef) {
          that.leftTreeDef = eval('(' + configModel.leftTreeDef + ')');
        }
        if (that.leftTreeDef.expandedLevel == undefined) {
          that.leftTreeDef.expandedLevel = 2;
        }
        const level = that.leftTreeDef.expandedLevel;
        if (level == 0) {
          that.defaultExpandAll = true;
        }
        var formRightJson = res.data.formRightJson;
        // 将权限数组转为对象
        $.each(formRightJson, function(index, item) {
          var name = item.name;
          formRightJson[name] = item;
        });
        that.formRightJson = formRightJson;
        that.currentUserId = res.data.currentUserId;
        that.currentAccount = res.data.currentAccount;
        that.currentOrgId = res.data.currentOrgId;
        that.currentRealName = res.data.currentRealName;
        that.currentRoleCode = res.data.currentRoleCode;

        that.configModel = configModel;
        that.appId = configModel.appId;
        that.customDataGridId = configModel.id;
        that.isEnableStartFlow = configModel.isEnableStartFlow;
        that.formKey = configModel.formKey;
        that.gridType = configModel.gridType;
        that.jsContent = configModel.jsContent;
        that.operationCustomButtonJson = [];
        that.toolBarCustomButtonJson = [];
        if (configModel.operationCustomButton) {
          // [{'orderNum':1,'buttonTitle':'我的按钮','buttonName':'abc','excutefun':'myToolFunc','btnColor':'btn-success','btnSize':'btn-sm','faClass':' fa-snowflake-o','type':'normal'}]
          that.operationCustomButtonJson = typeof configModel.operationCustomButton === 'string' ? eval('(' + configModel.operationCustomButton + ')') : configModel.operationCustomButton;
        }
        if (configModel.toolBarCustomButton) {
          that.toolBarCustomButtonJson = typeof configModel.toolBarCustomButton === 'string' ? eval('(' + configModel.toolBarCustomButton + ')') : configModel.toolBarCustomButton;
        }
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
        $.each(this.searchParams, function(key, item) {
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
      /**
       * @param {*} obj 对象
       * @param {*} fieldNames 不检验的字段属性 通过,号隔开
       */
      objectKeyIsEmpty(obj, fieldNames) {
        for (const key in obj) {
          if (obj.hasOwnProperty(key) && fieldNames.indexOf(key) === -1 && obj[key]) {
            return false;
          }
        }
        return true;
      },
      getGridData() {
        const that = this;
        const type = Object.toQueryString('type') || '';
        const TeamContractNo = localStorage.getItem('TeamContractNo');
        const sAppId = Object.toQueryString('appId') || '';
        const ProjectNo = localStorage.getItem('ProjectNo');
        // 如果是项目大厅漏斗过来的 取得漏斗筛选的数据 赋值到当前的筛选form表单中
        if (type && type === 'funnel') {
          const funnelData = JSON.parse(localStorage.getItem('funnelData'));
          if (funnelData && funnelData.MarketingCenter) {
            that.tableForm.data.MarketingCenter = funnelData.MarketingCenter;
          }
          if (funnelData && funnelData.MarketingUnit) {
            that.tableForm.data.MarketingUnit = funnelData.MarketingUnit;
          }
          if (funnelData) {
            const startDate = funnelData.StartDate;
            const endDate = funnelData.EndDate;
            if (startDate && endDate) {
              // that.tableForm.data.ProcessFinishedTime = `${startDate},${endDate}`;
              that.tableForm.data.ProcessFinishedTime = [`${startDate} 00:00:00`, `${endDate} 00:00:00`];
            }
          }
        }

        if (TeamContractNo) {
          that.tableForm.data.TeamContractNo = TeamContractNo;
        }

        if (sAppId && sAppId == 'CA' && ProjectNo) {
          that.tableForm.data.ProjectNo = ProjectNo;
        }
        // if (sAppId && sAppId == 'BL' && ProjectNo) {
        //   that.tableForm.data.ProjectCode = ProjectNo;
        // }
        if (sAppId && sAppId == 'CP' && ProjectNo) {
          that.tableForm.data.ProjectNo = ProjectNo;
        }
        if (sAppId && sAppId == 'DK' && ProjectNo) {
          that.tableForm.data.ProjectNo = ProjectNo;
        }
        // if (sAppId && sAppId == 'AY' && ProjectNo) {
        //   that.tableForm.data.ProjectNo = ProjectNo;
        // }
        // if (sAppId && sAppId == 'AJ' && ProjectNo) {
        //   that.tableForm.data.ProjectNo = ProjectNo;
        // }
        // if (sAppId && sAppId == 'AQ' && ProjectNo) {
        //   that.tableForm.data.ProjectNo = ProjectNo;
        // }
        if(Object.toQueryString('code') === 'custGrid_WorkflowForm_YinQiZhiLianFuKuan' && type === 'link2'){
          that.tableForm.data.ProjectNo = ProjectNo;
        }
        // 班组核量跳转到产值填报,带参ProjectNo，ProcInstState
        if(type && type === 'link'){
          const getParms = JSON.parse(localStorage.getItem('GetParms'));
          that.tableForm.data.ProjectNo = getParms.ProjectNo;
          that.tableForm.data.ProjectCode = getParms.ProjectNo;
          that.tableForm.data.ProcInstState = getParms.ProcInstState;
        }
        let parm = Object.toClone(that.tableForm.data);
        if (Object.toQueryString('code') === 'custGrid_CustSearch_YeWuXinXiYuChaXun' && this.objectKeyIsEmpty(parm, 'searchfields')) {
          that.tableData = []
          return
        }
        parm.page = that.tablePage.currentPage;
        parm.rows = that.tablePage.pageSize;
        parm.sort = that.tablePage.sort;
        parm.order = that.tablePage.order;

        parm = Object.extend(parm, that.searchParams);
        Object.toAjaxJson(that.dg.GetUrl(), null, parm, true, null, function(res) {
          if (res.success) {
            that.tableData = res.rows;
            that.tablePage.total = res.total;
            that.tablePage.pageCount = res.pageCount;
            setTimeout(function() {
              var excutefun = 'extend_gridDone';
              if (Object.toIsExitsFunction(excutefun)) {
                var fun = eval(excutefun);
                fun(that, that.tableData, that.tablePage.currentPage, that.tablePage.total);
              }
            }, 500);
          } else {
            FUI.Window.showMsg(res.msg);
          }
        });
      },
      myOperationEditEvent(value, row, index) {
        var that = this;
        // 编辑前置事件
        const funcName_before = 'perationEditEvent_before';
        var isExist = Object.toIsExitsFunction(funcName_before);
        if (isExist) {
          var exfunc = eval(funcName_before);
          var isPass = exfunc(that, value, row, index);
          if (isPass === false) {
            return false;
          }
        }
        if (row.Wiid) {
          that.openWorkflowView(row.Wiid);
        } else {
          // 打开无流程的表单
          that.defaultActionShowEdit(value, row, index);
        }
      },
      myOperationViewEvent(value, row, index) {
        var that = this;
        // 编辑前置事件
        const funcName_before = 'perationViewEvent_before';
        var isExist = Object.toIsExitsFunction(funcName_before);
        if (isExist) {
          var exfunc = eval(funcName_before);
          var isPass = exfunc(that, value, row, index);
          if (isPass === false) {
            return false;
          }
        }
        if (row.Wiid) {
          // 打开有流程表单
          var taskId = row.TaskId || row.TASKID || row.taskid;
          that.openWorkflowView(row.Wiid, taskId);
        } else {
          // 打开无流程的表单
          that.defaultCommonEdit(row.MyId, row.BusinessKey, row.FormId, FUI.FormAction.View);
        }
      },
      defaultActionShowEdit(value, row, index) {
        var that = this;
        that.defaultCommonEdit(row.MyId, row.BusinessKey, row.FormId, FUI.FormAction.Edit);
      },
      defaultCommonEdit(myId, businessKey, formId, formAction) {
        var that = this;
        myId = myId || '';
        businessKey = businessKey || '';
        var viewTitle = window.defaultViewTitle != undefined ? window.defaultViewTitle : '查看';
        var addTitle = window.defaultAddTitle != undefined ? window.defaultAddTitle : '新增';
        var editTitle = window.defaultEditTitle != undefined ? window.defaultEditTitle : '编辑';
        var preTitle = formAction == 'Edit' ? editTitle : formAction == 'View' ? viewTitle : addTitle;
        var addUrl = __webpath + '/workflow/noWorkflowform/index/?formKey=' + that.formKey;
        var editUrl = __webpath + '/workflow/noWorkflowform/index/?formId=' + formId + '&myId=' + myId + '&businessKey=' + businessKey;
        if (that.fixBusinessKey) {
          addUrl = addUrl + '&businessKey=' + that.fixBusinessKey;
        }
        if (formAction == 'Add' && this.searchParams[that.leftTreeDef.searchFieldName] && that.leftTreeDef && that.leftTreeDef.isEnabled) {
          addUrl = addUrl + '&' + that.leftTreeDef.searchFieldName + '=' + this.searchParams[that.leftTreeDef.searchFieldName];
        }
        var url = formAction == 'Add' ? addUrl : editUrl;
        var wfAction = 0;
        if (formAction == 'Add') {
          wfAction = 0;
        } else if (formAction == 'View') {
          wfAction = 3;
        } else if (formAction == FUI.FormAction.Edit) {
          wfAction = 2;
        }
        if (that.isOpenTop) {
          FUI.Window.openEdit(url, preTitle, wfAction, that.dg.GridId, null, null, null, that.dg.MainTable, '', true, null, null, true);
        } else {
          FUI.Window.openEdit(url, preTitle, wfAction, that.dg.GridId, null, null, null, that.dg.MainTable, '', true);
        }
      },
      openWorkflowView(wiid, taskId) {
        var that = this;
        that.openWorkflowfromView(that.appId, wiid, taskId, '窗口信息');
      },
      openWorkflowfromView(appId, workflowInstanceId, taskId, title) {
        var url = __webpath + '/workflow/workflowform/index/?formAction=3&appId=' + appId + '&wiid=' + workflowInstanceId;
        if (taskId) {
          url = __webpath + '/workflow/workflowform/index/?formAction=2&appId=' + appId + '&wiid=' + workflowInstanceId + '&taskId=' + taskId;
        }
        window.open(url, '_blank');
      },
      // 工具栏按钮
      myToolBarCustomButton() {
        var that = this;
        var btns = [];
        var unfinished = that.$t('pageInfo.unfinished');
        var finished = that.$t('pageInfo.finished');
        if (that.gridType == 'WorkflowForm' && that.appId != '' && that.dataSource && (that.dataSource == 'doneList' || that.dataSource == 'doneHiList' || that.dataSource == 'myWorkItem' || that.dataSource == 'myHiWorkItem')) {
          btns.push({ code: 'doneList', excutefun: 'doneList', type: 'success', name: unfinished, icon: 'fa fa-list' });
          btns.push({ code: 'doneHiList', excutefun: 'doneHiList', type: 'success', name: finished, icon: 'fa fa-server' });
        }
        // btns.push({code: 'closeEdit', type: 'primary', name: '关闭', icon: 'fa fa-close'});
        if (that.gridType == 'WorkflowForm' && that.isEnableStartFlow == 1 && that.appId != '') {
          btns.push({ code: 'default.startWorkflow', excutefun: 'startWorkflow', type: 'primary', name: '新增', icon: 'fa fa-play-circle' });
        }
        if (that.toolBarCustomButtonJson && that.toolBarCustomButtonJson.length > 0) {
          var btnArr = that.toolBarCustomButtonJson;
          $.each(btnArr, function(i, item) {
            if (item.btnColor == '') {
              item.btnColor = 'default';
            }
            var isHavePoser = true;
            if (that.isSetHead != 1 && that.fieldPowers.hasOwnProperty('toolbar_' + item.buttonName) && that.fieldPowers['toolbar_' + item.buttonName].isShow == false) {
              isHavePoser = false;
            }
            if (isHavePoser) {
              var iconPre = item.faClass.indexOf('icon') > -1 ? 'icon ' : ' fa ';
              btns.push({ excutefun: item.excutefun, code: item.buttonName, status: item.btnColor, name: item.buttonTitle, icon: iconPre + item.faClass });
            }
          });
        }
        return btns;
      },
      // 工具栏按钮事件
      toolbarButtonClickEvent({ code, btn }) {
        const that = this;
        if (code == 'closeEdit') {
          FUI.Window.closeEdit();
        } else if (code == 'default.add') {
          that.defaultCommonEdit(null, null, null, FUI.FormAction.Add);
        } else if (code == 'default.delete') {
          // 批量删除，默认执行FUI内部的删除，如有需要可用成自己的删除方法
          that.dg.ToolBarBathDelete(that);
        } else if (code == 'sys_excelImport') {
          // 统一的导入界面
          that.importCommonExcel('customDataGrid', that.configModel.dataMainTableName);
        } else if (code == 'sys_excelExport') {
          // 统一的导出事件
          console.log("dataMainTableName===:", that.configModel.dataMainTableName);
          that.exportCommonExcel('customDataGrid', that.configModel.dataMainTableName);
        } else {
          var btndef = btn;// that.toolBarCustomButtonJson.find(a => a.buttonName = code);
          var excutefun = btndef.excutefun;
          if (Object.toIsExitsFunction(excutefun)) {
            var fun = eval(excutefun);
            fun(that);
          } else if (that[excutefun]) {
            var fun = that[excutefun];
            fun();
          }
        }
      },
      // 操作列自定义按钮
      myOperationCustomButton(h, value, row, index) {
        var that = this;
        var custBtns = [];
        if (that.gridType == 'WorkflowForm' && that.operationJson.ShowWfMap && that.operationJson.ShowWfMap === true) {
          var itemShowWfApproadList = { index: 26, title: '查看办理过程', tip: '查看办理过程', alias: 'ShowWfApproadList', class: 'fa fa-search', code: 'ShowWfApproadList', click: () => this.ShowWfApproadList(value, row, index) };
          custBtns.push(itemShowWfApproadList);
        }
        if (that.gridType == 'WorkflowForm' && that.operationJson.ShowWfMap && that.operationJson.ShowWfMap === true) {
          var itemShowWfMap = { index: 28, title: '查看流程图', tip: '查看流程图', alias: 'ShowWfMap', class: 'fa fa-search', code: 'ShowWfMap', click: () => this.ShowWfMap(value, row, index) };
          custBtns.push(itemShowWfMap);
        }
        if (that.operationCustomButtonJson && that.operationCustomButtonJson.length > 0) {
          var rowJson = row;
          var btnArr = that.operationCustomButtonJson;
          $.each(btnArr, function(i, item) {
            if (item.btnColor == '') {
              item.btnColor = 'btn-info';
            }
            var classStr = 'fa ' + item.faClass;
            var excutefun = item.excutefun;
            var isHavePoser = true;
            var buttonName = 'operation_' + item.buttonName;
            if (that.isSetHead != 1 && that.fieldPowers.hasOwnProperty(buttonName) && that.fieldPowers[buttonName].isShow == false) {
              isHavePoser = false;
            }
            if (isHavePoser) {
              var btnitem = {
                index: item.orderNum,
                title: item.buttonTitle, tip: item.buttonTitle, class: classStr,
                code: item.buttonName, click: () => that.operationCustomButtonClick(excutefun, value, row, index)
              };
              var isShow = true;
              if (Object.toIsExitsFunction('extend_OperationShowCustomButton')) {
                isShow = extend_OperationShowCustomButton(item, row, index);
              }
              if (isShow) {
                custBtns.push(btnitem);
              }
            }
          });
        }
        return custBtns;
      },
      operationCustomButtonClick(excutefun, value, row, index) {
        var that = this;
        if (Object.toIsExitsFunction(excutefun)) {
          var fun = eval(excutefun);
          var pkValue = row[that.dg.IdField];
          fun(that, value, pkValue, row, index);
        }
      },
      startWorkflow() {
        var that = this;
        if (that.appId) {
          var url = __webpath + '/workflow/workflowform/index/?appId=' + that.appId;
          if (this.searchParams[that.leftTreeDef.searchFieldName] && that.leftTreeDef && that.leftTreeDef.isEnabled) {
            url = url + '&' + that.leftTreeDef.searchFieldName + '=' + this.searchParams[that.leftTreeDef.searchFieldName];
          }
          window.open(url, '_blank');
        } else {
          FUI.Window.showMsg('无流程的表单应用不可发起流程！');
        }
      },
      loadCustDataGridPermission() {
        var that = this;
        // 格式：字段名:{isShow:true}
        var fieldPowers = {};
        if (that.formRightJson && that.formRightJson.length > 0) {
          WFContext.formRightJson = that.formRightJson;
          if (that.userContextInfo) {
            WFContext.CurrentAccount = that.userContextInfo.account;
            WFContext.CurrentOrgId = that.userContextInfo.orgId;
            WFContext.RoleCodes = that.userContextInfo.roleCodes;
          }
          $.each(that.formRightJson, function(index, fieldItem) {
            var fieldName = fieldItem.name;
            var power = f2bpm_onlineform_excuteFieldPowerByVueFormItem(fieldName);
            var isShow = true;
            if (power.hidden === true) {
              isShow = false;
            } else if (power.hidden === false && power.write === false) {
              isShow = false;
            }
            fieldPowers[fieldName] = { isShow: isShow };
          });
          that.fieldPowers = fieldPowers;
        }
      },
      myOperationDeleteEvent(value, row, index) {
        var that = this;
        var funcName = 'myOptionBeforeDelete';
        var isExist = Object.toIsExitsFunction(funcName);
        var canRun = true;
        if (isExist) {
          var fun = eval(funcName);
          canRun = fun(that, value, row, index);
        }
        if (canRun != true) {
          return false;
        }
        canRun = Object.optionBeforeDelete(that, value, row, index);
        if (!canRun) return false;
        if (that.subTableName) {
          // 只删明细项
          var idFieldValues = row.SubMyId || row.subMyId;
          if (!idFieldValues) {
            FUI.Window.showMsg('取不到列表中的子表主键SubMyId字段的值，请检查！');
            return false;
          }
          FUI.Window.confirm(null, '您确定要删除所选明细记录吗？', null, function() {
            // 只删除明细表的记录
            var data = Object.toAjaxJson('/workflow/security/customDataGrid/', 'deleteCustomDataGridSubTableDataItem', { customDataGridId: that.customDataGridId, 'idField': 'MyId', 'idFieldValues': idFieldValues });
            if (data.success) {
              that.dg.Reload();
              FUI.Window.showMsg2(data.msg, null, 1);
            } else {
              FUI.Window.showMsg(data.msg);
            }
          });
          return false;
        }
        FUI.Window.confirm(null, '您确定要删除所选记录吗？', null, function() {
          // 删除表及子表数据,如果有流程同时删除流程实例
          var wiids = row.Wiid || '';
          var data = Object.toAjaxJson('/workflow/security/customDataGrid/', 'deleteCustomDataGridTableModel', { customDataGridId: that.customDataGridId, wiids: wiids, idField: that.dg.IdField, idFieldValues: value });
          if (data.success) {
            var funcNameAfter = 'myOptionAfterDelete';
          var isExistAfter = Object.toIsExitsFunction(funcNameAfter);
          if (isExistAfter) {
          var fun2 = eval(funcNameAfter);
           fun2(that, value, row, index);
        }
            that.dg.Reload();
            FUI.Window.showMsg2(data.msg, null, 1);
          } else {
            FUI.Window.showMsg(data.msg);
          }
        });
      },
      myToolBarDeleteEvent(gridId, mainTable, idField, idFieldValues) {
        var that = this;
        var funcName = 'myToolBarBeforeDelete';
        var isExist = Object.toIsExitsFunction(funcName);
        var canRun = true;
        if (isExist) {
          var fun = eval(funcName);
          canRun = fun(that, idFieldValues);
        }
        if (canRun != true) {
          return false;
        }
        canRun = Object.toolBarBeforeDelete(that, idFieldValues);
        if (!canRun) return false;
        if (that.subTableName) {
          // 只删明细项
          var idFieldValues = that.dg.getChecked('SubMyId');
          if (!idFieldValues) {
            FUI.Window.showMsg('取不到列表中的子表主键SubMyId字段的值，请检查！');
            return false;
          }
          FUI.Window.confirm(null, '您确定要删除所选明细记录吗？', null, function() {
            // 只删除明细表的记录
            var data = Object.toAjaxJson('/workflow/security/customDataGrid/', 'deleteCustomDataGridSubTableDataItem', { customDataGridId: that.customDataGridId, 'idField': 'MyId', 'idFieldValues': idFieldValues });
            if (data.success) {
              that.dg.Reload();
              FUI.Window.showMsg2(data.msg, null, 1);
            } else {
              FUI.Window.showMsg(data.msg);
            }
          });
          return false;
        }
        FUI.Window.confirm(null, '请再次确认您要批量删除所选记录吗？', null, function() {
          // 删除表及子表数据，如果有流程同时删除流程实例
          var wiids = that.dg.getChecked('Wiid');
          idFieldValues = that.dg.getChecked('MyId');
          wiids = wiids === ',' ? '' : wiids;
          var data = Object.toAjaxJson('/workflow/security/customDataGrid/', 'deleteCustomDataGridTableModel', { customDataGridId: that.customDataGridId, wiids: wiids, idField: idField, idFieldValues: idFieldValues });
          if (data.success) {
            // 删除后置事件批量
            var funcNameAfter = 'myToolBarAfterDelete';
              var isExistAfter = Object.toIsExitsFunction(funcNameAfter);
              if (isExistAfter) {
               var fun2 = eval(funcNameAfter);
               fun2(that, idFieldValues);
            }
            that.dg.Reload();
            FUI.Window.showMsg2(data.msg, null, 1);
          } else {
            FUI.Window.showMsg(data.msg);
          }
        });
      },
      doneList() {
        var that = this;
        var newDataSource = '';
        if (that.dataSource == 'doneHiList') {
          newDataSource = 'doneList';
        } else if (that.dataSource == 'myHiWorkItem') {
          newDataSource = 'myWorkItem';
        }
        if (newDataSource != '') {
          var url = __webpath + '/workflow/security/customDataGrid/customDataGridView/?code=' + that.code + '&dataSource=' + newDataSource;
          window.location.href = url;
          // window.location.reload();
        }
      },
      doneHiList() {
        var that = this;
        var newDataSource = '';
        if (that.dataSource == 'doneList') {
          newDataSource = 'doneHiList';
        } else if (that.dataSource == 'myWorkItem') {
          newDataSource = 'myHiWorkItem';
        }
        if (newDataSource != '') {
          var url = __webpath + '/workflow/security/customDataGrid/customDataGridView/?code=' + that.code + '&dataSource=' + newDataSource;
          window.location.href = url;
          // window.location.reload();
        }
      },
      ShowWfApproadList(value, row, index) {
        var that = this;
        var wiid = row.Wiid || row.wiid || row.WIID;
        if (!wiid) {
          FUI.Window.showMsg('未产生流程实例');
          return false;
        }
        FUI.Window.openEdit('/workflow/workflowBusiness/showApprovalHistory/?wiid=' + wiid, '查看办理过程', FUI.FormAction.View, '', 780, 460);
      },
      ShowWfMap(value, row, index) {
        var that = this;
        var wiid = row.Wiid || row.wiid || row.WIID;
        if (!wiid) {
          FUI.Window.showMsg('未产生流程实例');
          return false;
        }
        FUI.Window.openEdit('/workflow/flowDesigner/workflowMap/?wiid=' + wiid, '查看流程图', FUI.FormAction.View, '', null, null, null, null, null, true);
      },
      importCommonExcel(type, tableName) {
        var that = this;
        // 导入前置事件
        var extendFunName = 'customDataGrid_importBeforeEvent';
        var isExist = Object.toIsExitsFunction(extendFunName);
        if (isExist) {
          var exfunc = eval(extendFunName);
          var isPass = exfunc(tableName);
          if (isPass === false) {
            return false;
          }
        }
        var url = '/workflow/security/commonImport/commonExcelImport?type=' + type + '&tableName=' + tableName;
        FUI.Window.openEdit(url, '数据导入', FUI.FormAction.Edit, '', 600, 400);
        // FUI.dialog(url, "数据导入", null, 600, 400, function (objectData, index, layerObject) {
        //   if (objectData == undefined || objectData == null || objectData == false) {
        //     return false;
        //   }
        //   if (objectData.length > 0) {
        //     that.refreshGrid();
        //   }
        // }, true, null, { sure: { iconClass: "", text: "确定导入" } });
      },
      // 导出
       exportCommonExcel(type, tableName) {
        var that = this;
        var idFieldValues = that.dg.getChecked();
        var selectedIds = idFieldValues ? idFieldValues.split(',') : [];
        // if (selectedIds.length == 0) {
        //   FUI.Window.showMsg2("请选择要导出的记录");
        //   return false;
        // }

        // 导出前置事件
        var extendFunName = 'customDataGrid_exportBeforeEvent';
        var isExist = Object.toIsExitsFunction(extendFunName);
        if (isExist) {
          var exfunc = eval(extendFunName);
          // var selectedRows = that.dg.getCheckedRows();
          var isPass = exfunc(tableName);
          var isPass = exfunc(tableName, selectedIds, selectedRows);
          if (isPass === false) {
            return false;
          }
        }
        let parm = Object.toClone(that.tableForm.data);
        // parm.page = that.tablePage.currentPage;
        // parm.rows = that.tablePage.pageSize;
        parm.sort = that.tablePage.sort;
        if (!parm.sort) parm.sort = Object.toTrim(that.dg.SortName)
        parm.order = that.tablePage.order;
        if (!parm.order)parm.order = that.dg.SortOrder;
        parm = Object.extend(parm, that.searchParams);
        var downUrl = '/workflow/security/CommonImport/exportData?type=customDataGrid&tableName=' + tableName;
        Object.toAjaxDownloadFile(downUrl, '', JSON.stringify({
          'params': parm,
          'defaultWhere': that.dg.DefaultWhere,
          'isEnableAuthor': that.dg.IsEnableAuthor,
          'selectedId': selectedIds.toString()
        }), true);
      },
       categoryManager() {
        const that = this;
        const groupKey = that.leftTreeDef.groupKey;
        const url = '/workflow/security/category/categoryList_bygroupKey?groupKey=' + groupKey;
        const title = '分类管理';
        FUI.Window.openEdit(url, title, 'Edit', 'grid', 700, 500, null, '', '', true);
      },

       loadDynamicScript() {
        var that = this;
        // 加载表单的动态脚本
        if (that.jsContent) {
          const script = document.createElement('script');
          script.type = 'text/javascript';
          script.text = `
            //========加载表单动态脚本==========
            ${that.jsContent}
          `;
          document.getElementsByTagName('head')[0].appendChild(script);
          if (Object.toIsExitsFunction('extend_fuiOnPageLoad')) {
            // 执行迁移条件
            window.extend_fuiOnPageLoad();
          }
        }
      }
    }
  };

  // ================================== 扩展示例=====================================//

  // //导出按钮前置事件
  // function customDataGrid_exportBeforeEvent(tableName, selectedIds, selectedRows) {
  //   //tableName:物理表名
  //   //selectedIds:当前选中的主键
  //   //selectedRows：选中的多行数据
  //   //返回true或者false; true继续执行，false：阻断执行
  //   console.info(tableName, selectedIds, selectedRows);
  //   return false;
  // }
  // //导入按钮前置事件
  // function customDataGrid_importBeforeEvent(tableName) {
  //   //tableName:物理表名
  //   //返回true或者false; true继续执行，false：阻断执行
  //   console.info(tableName);
  //   return false;
  // }

  // 【页面加载完时的扩展（页面最后加载的脚本）】
  // 请在扩展脚本中写如下的函数脚本
  // function extend_pageLoad($vm){
  // 	//你的具体想要干的事情
  // }

  // 【操作列前置删除事件示例--在定义列表的扩展JS中写】
  // function myOptionBeforeDelete($vm,value, row, index) {

  // 	alert('前置删除事件');
  // 	return true/false;
  // }

  // 【操作列查看按钮前置事件--在定义列表的扩展JS中写】
  // function perationViewEvent_before($vm,value, row, index) {
  // 	alert('查看前置事件');
  // 	return true/false;
  // }

  // 【操作列编辑按钮前置事件--在定义列表的扩展JS中写】
  // function perationEditEvent_before($vm,value, row, index) {
  // 	alert('编辑前置事件');
  // 	return true/false;
  // }

  // 【工具栏批量删除时的前置事件示例---在定义列表的扩展JS中写】
  // function myToolBarBeforeDelete($vm,idFieldValues) {
  // 	alert('工具栏批量删除时的前置事件'+idFieldValues);
  // 	return true/false;
  // }

  // 【操作列自定义按钮的事件示例】
  // function myTest($vm,value, pkValue,row, index){
  // 	$vm：vue对象
  // 	value:所在单元格的值
  // 	pkValue:所在行的主键值
  // 	row： 当前行值Json
  // 	index:所在行索引，从0开始
  // 	获取其它属性：row["列属性名"]
  // 	alert(pkValue);
  // }

  // 【格式化列显示值】需要将此函数对象名myFormatter配置到列表表头配置中的“显示格式化JS对象”
  // function myFormatter(value, row, index) {
  //    return "返回你格式化后的值，支持html";
  // }

  // 【是否显示操作列的默认按钮：查看，编辑，删除】
  // function extend_OperationShowDefaultButton(value, row, index){
  // 	//showEdit编辑，showView查看，showDelete:删除
  // 	var config={"showEdit":true,"showView":true,"showDelete":true};
  // 	return config;
  // }

  // 【是否显示操作列的某个自定义按钮】
  // btn:按钮定义本身
  // row:行记录值的
  /*   function extend_OperationShowCustomButton(btn, row, index) {
      //是否显示自定义操作按钮，返回true/false
      console.info(btn);
      if (btn.buttonName == 'btn4') {
        return true;
      }
      return false;
    }
   */
  // 【Grid列表加载完时触发的done】
  // 请在扩展脚本中写如下的函数脚本
  // function extend_gridDone($vm,data,curr,count){
  //    //data即为你接口返回的数据
  //     //data即为： 为当前页数据及信息、count为数据总长度
  //     co1nsole.log(data);
  //     //得到当前页码
  //     console.log(curr);
  //     //得到数据总量
  //     console.log(count);
  // }

  // ===================格式化列显示值点击弹出对话框示例=================
  function myUserFormatter(value, row, index) {
    return "<span class='cur cube bg-blue' onclick=\"showUser('" + row.sfrID + "')\">" + value + '</span>';
  }

  function showUser(myId) {
    var url = '/workflow/noWorkflowform/index/?formId=a4059cc8-c349-4ada-a142-3590296678de&myId=' + myId + '&businessKey=&formAction=3&parentGridId=grid&mainTable=cust_TuiWuJunRenBiao';
    FUI.Window.openEdit(url, '查看', null, null, 700, 550, null, null, null, true);
  }

// ================================================================
</script>
