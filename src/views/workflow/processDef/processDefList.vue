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

        <div v-if="!isCollapsed" class="f2bpm-page-left-content auto-window-height mt5">
          <span class="fa fa-home cur ml10 font12 " @click="showAll()">{{$t('all')}}</span>
          <el-tree ref="mytree" :data="treeData" :expand-on-click-node="false" :filter-node-method="filterTreeNode" default-expand-all @node-click="onTreeSelected" />
        </div>
      </el-aside>
      <el-main class="f2bpm-page-right">
        <div id="gridSearch" class="grid-search-form">
          <div id="grid-search-form-list" :class="'grid-search-form-list '+searchFromData.collapsedHeight">
            <ul>
              <li><label> {{$t('wfInfo.procName')}}：</label>
                <el-input id="WorkflowName" v-model="searchParams.WorkflowName" size="small" class="textBoxShort" name="WorkflowName" />
              </li>
              <li><label> {{$t('wfInfo.procCode')}}：</label>
                <el-input id="WorkflowKey" v-model="searchParams.WorkflowKey" size="small" class="textBoxShort" name="WorkflowKey" />
              </li>
            </ul>
          </div>
          <div class="grid-search-form-searchbtn-toolbar">
            <el-input v-model="searchParams.searchtext" size="small" :placeholder="$t('searchTip.procDefSearchTip')" clearable style="width: 347px; margin-right: 5px" :searchfields="searchParams.searchfields" />
            <el-divider direction="vertical" />
            <el-button size="small" class="search-btn" type="primary" @click="dataGridSearch()"><i class="fa fa-search" />{{$t('search')}}
            </el-button>
            <span v-if="expansMore" class="expans-more"  :title="searchFromData.moreTitle" @click="onSearchExpansMore">{{ searchFromData.moreTitle
              }}<i :class="searchFromData.moreIcon" /></span><span v-if="procInfoType!='combine'" class="red ml10 font14  "> 》》》非常规操作，数据管理维护，请谨慎操作！！！</span>
          </div>
        </div>
        <div id="grid-toolbar" class="grid-toolbar">
            <el-button size="mini" type="default" @click="addWorkflow(0)">
              <i class="fa fa-file-o" />{{$t('listButton.addWorkflowProf')}}
            </el-button>
            <el-button size="mini" type="default" @click="addWorkflow(1)">
              <i class="fa fa-file-o" />{{$t('listButton.addWorkflowSimple')}}
            </el-button>
            <el-button size="mini" type="default" @click="copyAdd">
              <i class="fa fa-clipboard" />{{$t('copyFlow')}}
            </el-button>

            <el-button size="mini" type="default" @click="uploadWorkflowXmlFile">
              <i class="fa fa-sign-in" /> {{$t('import')}}
            </el-button>
            <el-button size="mini" type="default" @click="bathSetCategory">
              <i class="fa fa-cog" /> {{$t('setCategory')}}
            </el-button>
            <el-button size="mini" type="default" @click="refreshcache">
              <i class="fa fa-refresh" />{{$t('refreshCache')}}
            </el-button>
            <el-button v-if="searchParams.historyVersion" size="mini" type="default" @click="backMasterList">
              <i class="fa fa-backward" />{{$t('goBack')}}
            </el-button>
        </div>
        <div>
          <f2bpm-datagrid ref="grid" :expand-search="expandSearch"
           :show-checkbox="false" :show-seq="true" height="full-190" grid="grid" pk="taskId" :pager-config="tablePage" :data="tableData" :columns="tableColumn" @page-change="pageChange" @sort-change="sortChange" />
        </div>
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
        expansMore: true,
        procInfoType: "",
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
          sort: 'workflowKey asc,createdTime', // 排序字段
          order: 'desc', // 排序方向
          startIndex: 0,
          total: 0,
          currentPage: 1,
          pageSize: 20,
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
            title: __f2bpmLanguage == 'en-US' ? 'Operate' : '操作',
            width: 180,
            align: 'center',
            type: 'html',
            slots: {
              default: ({ row, column }, h) => {
                const hbtns = [];
                const allbtns = [];
                const item1 = { index: 1, title: '流程设计[专业]', tip: '流程设计-专业模式', class: 'fa fa-sitemap', code: 'workflowDesigner_pro', click: () => this.workflowDesigner(row.workflowId, 0) };
                const item2 = { index: 2, title: '流程设计[简约]', tip: '流程设计-简约模式', class: 'fa fa-sitemap', code: 'workflowDesigner_smape', click: () => this.workflowDesigner(row.workflowId, 1) };
                const item3 = { index: 99, title: '导出流程定义XML', tip: '导出流程定义XML', class: 'fa fa-download', code: 'downWorkflowXmlFile', click: () => this.downWorkflowXmlFile(row.workflowId, row.workflowName) };
                const item4 = { index: 98, title: '查看引用流程应用', tip: '查看被引用流程应用', class: 'fa fa-cubes', code: 'showAppOfDef', click: () => this.showAppOfDef(row.workflowKey, row.workflowName) };
                const item5 = { index: 8, title: '编辑', tip: '编辑', class: 'fa fa-edit', code: 'showDialogEdit', click: () => this.showDialogEdit('Edit', row.workflowId) };
                const item6 = { index: 9, title: '删除', tip: '删除', class: 'fa fa-trash-o', code: 'showAppOfDef', click: () => this.deleteList(row.workflowId, row.workflowName) };

                const item8 = { title: '查看历史版本', tip: '查看历史版本', class: 'fa  fa-calendar-o', code: 'historyVersion', click: () => this.historyVersion(row.workflowKey) };
                allbtns.push(item8);
                const item9 = { title: '设为主版本', tip: '设为主版本', class: 'fa  fa-wrench', code: 'setMaster', click: () => this.setMaster(row.workflowId, row.workflowKey, row.workflowName, row.isCurrent) };
                allbtns.push(item9);

                var firstItem = item1;

                allbtns.push(item2);
                allbtns.push(item5);
                allbtns.push(item6);
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
            title: __f2bpmLanguage == 'en-US' ? 'Proc Name' : '流程名称',
            width: 280,
            align: 'center'
          }, {
            field: 'workflowKey',
            title: __f2bpmLanguage == 'en-US' ? 'Proc Code' : '流程编码',
            width: 280,
            align: 'center'
          },
          {
            field: 'version',
            title: __f2bpmLanguage == 'en-US' ? 'Version' : '版本号',
            width: 80,
            align: 'center'
          },
          {
            field: 'isCurrent',
            title: __f2bpmLanguage == 'en-US' ? 'Is Master' : '是否主版本',
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
            title: __f2bpmLanguage == 'en-US' ? 'Proce Type' : '流程类型',
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
            title: __f2bpmLanguage == 'en-US' ? 'Update Time' : '修改时间',
            width: 180,
            align: 'center'
          }, {
            field: 'remark',
            title: __f2bpmLanguage == 'en-US' ? 'Remark' : '备注',
            align: 'center',
            type: 'html'
          }

        ],

        // ===========标准区结束==========
        searchFromData: {
          moreIcon: 'fa fa-angle-double-down',
          moreTitle: __f2bpmLanguage == 'en-US' ? 'expand' : '展开',
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
      $route() {
        this.load();
      }
      , treeFilterText(val) {
        this.$refs.mytree.filter(val);
      }
    },
    created() {
      var that = this;
      var language = that.$store.state.app.language;
      that.language = language;
      that.load();
    },
    mounted() {
      window.myvm = this;
      window.autoPageHeight();
    },
    methods: {
      load() {
        var that = this;
        that.procInfoType = Object.toQueryString("procInfoType");
        this.loadTree();
        this.getGridData();
      }
      , collapsedSider() {
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
        var name = "";
        if (this.searchFromData.moreTitle == this.$t('expand')) {
          this.searchFromData.moreIcon = 'fa fa-angle-double-up';
          this.searchFromData.collapsedHeight = '';
          this.searchFromData.moreTitle = this.$t('packUp');
          name = "expand";
        } else {
          this.searchFromData.moreIcon = 'fa fa-angle-double-down';
          this.searchFromData.collapsedHeight = 'grid-search-form-list-height';
          this.searchFromData.moreTitle = this.$t('expand');
          name = "packup";
        }
        this.expandSearch = name;
      },
      dataGridReSet() {
        var that = this;
        $.each(this.searchParams, function (key, item) {
          if (key != "procInfoType" && key != 'historyVersion') {
            that.searchParams[key] = '';
          }
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
          if (key != "procInfoType") {
            that.searchParams[key] = '';
          }

        });
        that.searchParams.WorkflowKey = workflowKey;
        that.searchParams.historyVersion = true;
        that.getGridData();
      },
      backMasterList() {
        var that = this;
        $.each(that.searchParams, function (key, item) {
          if (key != "procInfoType") {
            that.searchParams[key] = '';
          }
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
        parm.procInfoType = that.procInfoType;
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
      deleteList(workflowId, msg) {
        var that = this;
        msg = '谨慎操作!!!，您确定要删除流程定义【' + msg + '】 ，将同时删除此流程版本产生的所有流程实例数据？';
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
        isSimple = isSimple || 0;
        window.open(__webpath + '/workflow/processDef/processDesigner/?isSimple=' + isSimple + '&wid=' + workflowId, '_blank');
      },

      addWorkflow(isSimple) {
        var that = this;
        window.open(__webpath + '/workflow/processDef/processDesigner/?isSimple=' + isSimple + '&categoryCode=' + this.searchParams.CategoryCode + "&procInfoType=" + that.procInfoType, '_blank');
      },
      downWorkflowXmlFile(wid, workflowName) {
        Object.toAjaxDownloadFile('/workflow/processDef/', 'downloadWorkflowXmlFile', {
          keyId: wid,
          workflowName: workflowName
        });
      },
      uploadWorkflowXmlFile() {
        FUI.Window.openEdit('/workflow/processDef/processDefImport', '导入流程定义', FUI.FormAction.Edit, '', 750, 480);
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
        var data = Object.toAjaxJson('/workflow/processDef/', 'copyAdd', { 'wid': id });
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
      }
    }

  }
</script>