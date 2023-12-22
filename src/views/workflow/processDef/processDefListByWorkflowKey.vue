<template>
  <div class="f2bpm-page-layout">
    <el-container>
      <el-header v-if="!isSolution" style="padding: 0;padding-left: 5px;border-bottom: solid #e8eaec  1px;height: 40px;">
        <el-tabs :value="actionName" @tab-click="tabsClick">
          <el-tab-pane label="①基础信息" name="goProcessAppEdit" />
          <el-tab-pane label="②流程定义" name="goProcessDefListByWorkflowKey" />
        </el-tabs>
      </el-header>
      <el-main class="f2bpm-page-right">
        <div id="grid-toolbar" class="grid-toolbar" style="margin-top: 10px;">
          <el-button-group>
            <el-button size="small" v-if="appType!='combine'" type="default" title="将新增一条新的模板流程" @click="saveNewDefaultProcessDef">
              <i class="fa fa-file-o" /> 新增模板流程
            </el-button>
            <el-button size="small" type="default" @click="copyAdd">
              <i class="fa fa-clipboard" />复制流程
            </el-button>
            <el-button size="small" v-if="appType!='combine'" type="default" @click="uploadWorkflowXmlFile">
              <i class="fa fa-sign-in" /> 流程导入
            </el-button>
            <el-button size="small" type="default" @click="refreshcache">
              <i class="fa fa-refresh" /> 刷新缓存
            </el-button>
            <el-button size="small" type="default" @click="dataGridSearch">
              <i class="fa fa-refresh" /> 刷新列表
            </el-button>
            <el-button size="small" type="default" @click="startWorkflowPermission">
              <i class="fa fa-cogs" /> 发起权限设置
            </el-button>
            <el-button size="small" type="default" @click="startWorkflow">
              <i class="fa fa-play-circle" /> 发起流程
            </el-button>

            <el-button v-if="!isSolution" size="small" type="default" @click="closeEdit">
              <i class="fa fa-close" /> 关闭
            </el-button>
          </el-button-group>
        </div>
        <div>
          <f2bpm-datagrid ref="grid" :show-checkbox="false" :show-seq="true" height="full-190" grid="grid" pk="taskId" :pager-config="tablePage" :data="tableData" :columns="tableColumn" @page-change="pageChange" @sort-change="sortChange" />
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        isSolution: false,
        appType: "",
        appId: '',
        workflowKey: '',
        actionName: 'goProcessDefListByWorkflowKey',
        expansMore: true,
        // ======stand:标准区=============
        currCategoryCode: '',
        treeFilterText: '',
        isCollapsed: false,
        // ==data grid====
        dg: {},
        loading: false,
        treeData: [],
        tableData: [],
        tableForm: Object.toClone(FUI.DataGridProperty.tableForm),
        tableToolbar: Object.toClone(FUI.DataGridProperty.tableToolbar),
        headerMenus: Object.toClone(FUI.DataGridProperty.headerMenus),
        tablePage: {
          pageCount: 0,
          sort: 'isCurrent desc,createdTime', // 排序字段
          order: 'desc', // 排序方向
          startIndex: 0,
          total: 0,
          currentPage: 1,
          pageSize: 10,
          align: 'center',
          pageSizes: [10, 20, 50, 100, 200, 500],
          layout: 'total, sizes, prev, pager, next, jumper',
          perfect: true
        },
        tableColumn: [
          { type: 'checkbox', width: 45, align: 'center', fixed: 'left' },
          { type: 'seq', width: 45, title: '#', align: 'center', fixed: 'left' },
          {
            field: 'workflowId',
            title: '操作',
            width: 180,
            sort: true,
            align: 'center',
            type: 'html',
            slots: {
              default: ({ row, column }, h) => {
                const hbtns = [];
                const allbtns = [];
                const item2 = { index: 1, title: '流程设计-简约', tip: '流程设计-简约模式', class: 'fa fa-sitemap', code: 'workflowDesigner_smape', click: () => this.workflowDesigner(row.workflowId, 1) };
                const item1 = { index: 2, title: '流程设计', tip: '流程设计-专业模式', class: 'fa fa-sitemap', code: 'workflowDesigner_pro', click: () => this.workflowDesigner(row.workflowId, 0) };
                const item3 = { index: 99, title: '导出流程定义XML', tip: '导出流程定义XML', class: 'fa fa-download', code: 'downWorkflowXmlFile', click: () => this.downWorkflowXmlFile(row.workflowId, row.workflowName) };
                const item4 = { index: 98, title: '查看引用流程应用', tip: '查看被引用流程应用', class: 'fa fa-cubes', code: 'showAppOfDef', click: () => this.showAppOfDef(row.workflowKey, row.workflowName) };
                const item5 = { index: 8, title: '编辑', tip: '编辑', class: 'fa fa-edit', code: 'showDialogEdit', click: () => this.showDialogEdit('Edit', row.workflowId) };
                let item6 = null;
                if (row.procInfoType != "combine" && this.appType != "combine") {
                  item6 = { index: 9, title: '删除', tip: '删除', class: 'fa fa-trash-o', code: 'showAppOfDef', click: () => this.deleteList(row.workflowId, row.workflowName, row.procInfoType,row.isCurrent) };
                }
                const item9 = { index: 3, title: '设为主版本', tip: '设为主版本', class: 'fa  fa-wrench', code: 'setMaster', click: () => this.setMaster(row.workflowId, row.workflowKey, row.workflowName, row.isCurrent) };
                var firstItem = item1;
                allbtns.push(item2);
                allbtns.push(item5);
                if (item6 != null) {
                  allbtns.push(item6);
                }
                allbtns.push(item9);

                allbtns.push(item3);
                allbtns.push(item4);

                $.each(allbtns, function (i, item) {
                  if (i == 0 && firstItem == null) {
                    firstItem = item;
                  } else {
                    var itemBtn = h('el-dropdown-item', {
                      attrs: {
                        btn_code: item.code,
                        title: item.tip
                      },
                      class: item.class + ' block minw80',
                      nativeOn: { click: item.click }
                    }, ' ' + item.title);
                    hbtns.push(itemBtn);
                  }
                });
                var dropMenus = h('el-dropdown',
                  {
                    props: {
                      size: 'mini',
                      splitButton: true,
                      type: 'default'
                    },
                    attrs: {
                      btn_code: firstItem.code
                    },
                    on: {
                      click: firstItem.click
                    }
                  }
                  , [
                    h('i', { class: firstItem.class, attrs: { title: firstItem.tip } }, ' ' + firstItem.title),
                    h('el-dropdown-menu',
                      {
                        props: {
                          slot: 'dropdown'
                        }
                      },
                      hbtns
                    )
                  ]
                );
                return dropMenus;
              }
            }
          },
          {
            field: 'workflowName',
            title: this.$t('wfInfo.procName'),
            width: 280,
            align: 'center'
          }, {
            field: 'workflowKey',
            title: '流程编码',
            width: 280,
            align: 'center'
          },
          {
            field: 'version',
            title: '版本号',
            width: 60,
            align: 'center'
          },
          {
            field: 'isCurrent',
            title: '是否主版本',
            width: 120,
            align: 'center',
            formatter: function (rec, column, value, index) {
              if (value == 'true' || value == 1 || value == true) {
                return '<span class="cube bg-blue ">主版本</span>';
              }
              return '<span class="cube bg-grey ">非主版本</span>';
            }
          },
          {
            field: 'procInfoType',
            title: '流程类型',
            width: 100,
            align: 'center',
            formatter: function (rec, column, value, index) {
              if (value == 'combine') {
                return '<span class="cube bg-gree ">共用流程</span>';
              }
              return '';
            }
          },
          {
            field: 'lastModTime',
            title: '修改时间',
            width: 180,
            align: 'center'
          }, {
            field: 'remark',
            title: '备注',
            align: 'center',
            type: 'html'
          }

        ],

        // ===========标准区结束==========
        searchFromData: {
          moreIcon: 'fa fa-angle-double-down',
          moreTitle: this.$t('expand'),
          collapsedHeight: 'grid-search-form-list-height'
        },
        searchParams: {
          WorkflowName: '',
          WorkflowKey: '',
          historyVersion: false,

          searchtext: '',
          searchfields: 'WorkflowName,WorkflowKey',
          // 特殊查询
          CategoryCode: ''
        }
      };
    }, computed: {
      countGridHeight() {
        var h = $(document).height() - 145;
        return h;
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

    },
    mounted() {
      window.myvm = this;
      var that = this;
      var appId = Object.toQueryString('appId') || '';
      var workflowKey = Object.toQueryString('workflowKey') || '';
      var solutionId = Object.toQueryString('solutionId') || '';
      var appType = Object.toQueryString('appType') || '';
      that.appType = appType;
      that.appId = appId;
      that.workflowKey = workflowKey;
      that.solutionId = solutionId;
      if (solutionId != '') {
        that.isSolution = true;
      }
      if (workflowKey) {
        that.historyVersion(workflowKey);
      }
    },
    methods: {
      collapsedSider() {
        this.isCollapsed = !this.isCollapsed;
      },
      closeEdit() {
        FUI.Window.closeEdit();
      },
      sortChange({ column, field, order }) {
        this.tablePage.sort = field;
        this.tablePage.order = order;
        this.tablePage.currentPage = 1;
        this.getGridData();
      },
      pageChange({ currentPage, pageSize }) {
        this.tablePage.currentPage = currentPage;
        this.tablePage.pageSize = pageSize;
        this.tablePage.startIndex = (currentPage - 1) * pageSize;
        this.getGridData();
      },
      onSearchExpansMore() {
        if (this.searchFromData.moreTitle == this.$t('expand')) {
          this.searchFromData.moreIcon = 'fa fa-angle-double-up';
          this.searchFromData.collapsedHeight = '';
          this.searchFromData.moreTitle = '收起';
        } else {
          this.searchFromData.moreIcon = 'fa fa-angle-double-down';
          this.searchFromData.collapsedHeight = 'grid-search-form-list-height';
          this.searchFromData.moreTitle = '展开';
        }
      },
      refreshGrid() {
        var that = this;
        that.dataGridSearch();
      },
      refreshTargetGrid() {
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
      // 设置为主版本
      setMaster(workflowId, workflowKey, workflowName, isMaster) {
        var that = this;
        if (isMaster == true || isMaster == 1) {
          FUI.Window.showMsg(that, '当前已是主版本');
          return false;
        }
        FUI.Window.confirm(that, '您确定要将【' + workflowName + '】设置为主版？', '变更主版本', function (r) {
          var data = Object.toAjaxJson(FUI.Handlers.WorkflowManageHandler, 'setWorkflowMasterByWidAndOtherNotMaster', {
            workflowId: workflowId,
            workflowKey: workflowKey
          });
          FUI.Window.showMsg(data.msg, null, data.success ? 1 : 7, function () {
            if (data.success) {
              that.getGridData();
            }
          });
        });
      },
      // 查看历史版本
      historyVersion(workflowKey) {
        var that = this;
        $.each(that.searchParams, function (key, item) {
          that.searchParams[key] = '';
        });
        that.searchParams.WorkflowKey = workflowKey;
        that.searchParams.historyVersion = true;
        that.getGridData();
      },
      backMasterList() {
        var that = this;
        $.each(that.searchParams, function (key, item) {
          that.searchParams[key] = '';
        });
        that.searchParams.WorkflowKey = '';
        that.searchParams.historyVersion = false;
        that.getGridData();
      },
      getGridData() {
        const that = this;
        let parm = Object.toClone(that.tableForm.data);
        parm.page = that.tablePage.currentPage;
        parm.rows = that.tablePage.pageSize;
        parm.sort = that.tablePage.sort;
        parm.order = that.tablePage.order;
        parm = Object.extend(parm, that.searchParams);
        Object.toAjaxJson(FUI.Handlers.WorkflowManageHandler, 'getListProcessDefJson', parm, true, null, function (res) {
          if (res.success) {
            that.tableData = res.rows;
            that.tablePage.total = res.total;
            that.tablePage.pageCount = res.pageCount;
          } else {
            FUI.Window.showMsg(that, res.msg);
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
        var title = formAction == FUI.FormAction.Add ? '新增流程' : '编辑流程';
        FUI.Window.openEdit(__webpath + '/workflow/processDef/processDefEdit', title, formAction, that.dg.GridId, 890, 580, null, that.dg.MainTable, keyId);
      },
      showAppOfDef(workflowKey, workflowName) {
        var that = this;
        var title = '【' + workflowName + '】被引用到的流程应用';
        FUI.Window.openEdit(__webpath + '/workflow/processDef/showAppOfDef/?workflowKey=' + workflowKey, '流程【' + workflowName + '】被引用到的流程应用', FUI.FormAction.View, '', 600, 350, null, '', '', false);
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
        console.info(code);
      },
      // 操作列自定义按钮
      myOperationCustomButton(h, value, row, index) {
        var custBtns = [];
        var item = h('button', {
          attrs: {
            title: '文字',
            btn_code: 'custom'
          },
          class: 'btn btn-minier btn-grey mr2',
          on: {
            click: () => this.operationCustomButtonClick(value, row, index)
          }
        }, '自定义');
        custBtns.push(item);
        return custBtns;
      },
      operationCustomButtonClick(value, row, index) {
        alert('操作列自定义按钮事件调用：' + value);
      },
      extend_OperationShowDefaultButton(value, row, index) {
        // 扩展控制操作列默认的三个显示按钮
        return { 'showEdit': true, 'showView': true, 'showDelete': true };
      },

      deleteList(workflowId, msg, procInfoType,isCurrent) {
        var that = this;
        if (procInfoType == "combine") {
          FUI.Window.showMsg('当前流程类型为“共用流程”不允许在此删除。');
          return false;
        }
        if (isCurrent==true) {
          FUI.Window.showMsg('“主版本”不允许删除。');
          return false;
        }
        if (that.tablePage.total <= 1) {
          FUI.Window.showMsg('至少必须保留一条流程定义数据。');
          return false;
        }
        msg = '<em>谨慎操作!!!</em>，您确定要删除流程定义【' + msg + '】 ，将同时删除此版本的流程定义产生的所有流程实例数据？';
        FUI.Window.confirm(that, msg, '删除数据提示', function (r) {
          var data = Object.toAjaxJson(FUI.Handlers.WorkflowManageHandler, 'deleteProcessDefAndInstData', { 'workflowId': workflowId });
          if (data.success) {
            FUI.Window.showMsg2(that, data.msg, null, 1);
            that.dataGridSearch();
          } else {
            FUI.Window.showMsg(data.msg);
          }
        });
      },
      workflowDesigner(workflowId, isSimple) {
        var that = this;
        var appId = that.appId;
        isSimple = isSimple || 0;
        window.open(__webpath + '/workflow/processDef/processDesigner/?isSimple=' + isSimple + '&wid=' + workflowId, '_blank');
      },
      startWorkflow(value, row, index) {
        var that = this;
        var appId = that.appId;
        var url = __webpath + '/workflow/workflowform/index/?appId=' + appId;
        FUI.Window.open(url);
      },
      startWorkflowPermission(value, row, index) {
        var that = this;
        var appId = that.appId;
        var res = Object.toAjaxJson('/workflow/security/authorize/', 'getOrCreateAuthorizeIdByAppId', { appId: appId });
        if (res.success) {
          var keyId = res.data;
          var url = __webpath + '/workflow/security/authorize/authorizeSourceUserEdit/?isAppIdAuthor=true&ismultilevelAuthorize=false&type=4&keyId=' + keyId + '&mainTable=f2bpm_sys_AuthorizeDef';
          FUI.Window.openEdit(url, '发起权限设置', FUI.FormAction.Edit, '', 750, 480, null, null, null, true);
        }
      },
      downWorkflowXmlFile(wid, workflowName) {
        Object.toAjaxDownloadFile('/workflow/processDef/', 'downloadWorkflowXmlFile', {
          keyId: wid,
          workflowName: workflowName
        });
      },
      uploadWorkflowXmlFile() {
        var that = this;
        FUI.Window.openEdit('/workflow/processDef/processDefImport?workflowKey=' + that.workflowKey, '导入流程定义', FUI.FormAction.Edit, '', 750, 480);
      },
      bathSetCategory() {
        var that = this;
        var ids = FUI.Grid.getGridChecked(that, 'grid', 'workflowId');
        if (ids == '') {
          FUI.Window.showMsg(that, '请选择要设置的行！');
          return false;
        }
        WF.SelectorDialog.setCategory('f2bpm_processdef', 'WorkflowId', ids, 'CategoryCode', 'WorkflowGroup');
      },
      saveNewDefaultProcessDef() {
        var that = this;
        var res = Object.toAjaxJson('/workflow/processDef/', 'saveNewDefaultProcessDef', { 'appId': that.appId });
        if (res.success) {
          FUI.Window.showMsg2(that, res.msg, null, 1);
          that.dataGridSearch();
        } else {
          FUI.Window.showMsg2(that, res.msg);
        }
      },
      copyAdd() {
        var that = this;
        var id = FUI.Grid.getGridChecked(that, 'grid', 'workflowId');
        if (!id) {
          FUI.Window.showMsg('请选择要复制的流程！');
          return false;
        }
        if (id.indexOf(',') > -1) {
          FUI.Window.showMsg('只能选择一条要复制的流程！');
          return false;
        }
        var data = Object.toAjaxJson('/workflow/processDef/', 'copyAdd', { 'wid': id, workflowKey: that.workflowKey });
        if (data.success) {
          that.refreshGrid();
          FUI.Window.showMsg2(that, data.msg, null, 1);
        } else {
          FUI.Window.showMsg2(that, data.msg);
        }
      },
      refreshcache() {
        var that = this;
        Object.toAjaxJson(FUI.Handlers.WorkflowManageHandler, 'refreshcache', null, null, null, function (data) {
          // 刷新Session中的缓存
          that.$store.dispatch('user/removeCache');
          FUI.Window.showMsg(that, data.msg, null, 1);
        });
      },
      // 表单应用编辑
      goProcessAppEdit() {
        var that = this;
        if (that.appId == ""||that.appId=="NaN") {
          return;
        }
        if (that.appType == 'combine') {
          window.location.href = __webpath + '/workflow/processDef/processAppCombinEdit/?parentGridId=grid&formAction=Edit&mainTable=f2bpm_ProcessApp&keyId=' + that.appId;
        } else {
          window.location.href = __webpath + '/workflow/processDef/processAppEdit/?parentGridId=grid&formAction=Edit&mainTable=f2bpm_ProcessApp&keyId=' + that.appId;
        }
      },
      // 流程定义
      goProcessDefListByWorkflowKey() {
        var that = this;
        window.location.href = __webpath + '/workflow/processDef/processDefListByWorkflowKey/?appId=' + +this.appId + '&workflowKey=' + this.workflowKey;
      },
      tabsClick(tab) {
        var that = this;
        var name = tab.name;
        var fn = that[name];
        fn();
      }
    }

  }
</script>