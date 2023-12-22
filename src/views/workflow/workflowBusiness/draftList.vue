<template>
  <div class="f2bpm-page-layout">
    <el-container>
      <el-aside ref="sideLeft" class="f2bpm-page-left" hide-trigger collapsible :width="isCollapsed?'20px':'200px'">
        <div class="f2bpm-panel-head">
          <div v-if="!isCollapsed" class="f2bpm-left-search-div">
            <el-input v-model="treeFilterText" class="left-htead-treeFilterText-box"   size="small" clearable :placeholder="$t('enterKey')" autocomplete="off" prefix-icon="el-icon-search" />
          </div>
          <div  class="f2bpm-left-search-button-div">
            <i v-if="!isCollapsed" :title="$t('refresh')" class="icon icon-shuaxin  cur mr10 font12  " @click="loadTree()"></i>
            <i title="收起/展开" :class="rotateIcon" @click="collapsedSider" />
          </div>
        </div>

        <div v-if="!isCollapsed" class="f2bpm-page-left-content">
          <span class="fa fa-home cur ml10 font12" @click="showAll()">
            {{$t('all')}}</span>
          <el-tree ref="mytree" style="font-size: 12px" :data="treeData" :filter-node-method="filterTreeNode" :expand-on-click-node="false" default-expand-all @node-click="onTreeSelected" />
        </div>
      </el-aside>
      <el-main class="f2bpm-page-right">
        <div>
          <div id="gridSearch" class="grid-search-form">
            <div id="grid-search-form-list" :class="'grid-search-form-list ' + searchFromData.collapsedHeight">
              <ul>
                <li>
                  <label>{{$t('wfgrid.sheetId')}}：</label>
                  <el-input id="SheetId" v-model="searchParams.SheetId" size="mini" clearable class="textBoxShort" name="SheetId" />
                </li>
                <li>
                  <label>{{$t('title')}}：</label>
                  <el-input id="WorkflowTitle" v-model="searchParams.WorkflowTitle" size="mini" clearable class="textBoxShort" name="WorkflowTitle" />
                </li>
                <li>
                  <label>{{$t('wfInfo.procName')}}：</label>
                  <el-input id="AppName" v-model="searchParams.AppName" size="mini" clearable class="textBoxShort" name="AppName" />
                </li>
                <li> <label>{{$t('wfInfo.appId')}}：</label>
                  <el-input v-model="searchParams.AppId" size="mini" class="textBoxShort" />
                </li>
                <li>
                  <label>{{$t('wfgrid.creatorRealName')}}：</label>
                  <el-input id="CreatorRealName" v-model="searchParams.CreatorRealName" size="mini" clearable class="textBoxShort" name="CreatorRealName" />
                </li>
                <li>
                  <label>{{$t('wfgrid.workflowInstanceState')}}：</label>
                  <el-select id="WorkflowInstanceState" v-model="searchParams.WorkflowInstanceState" size="mini" class="textBoxShort" name="WorkflowInstanceState">
                    <el-option :label="$t('wfstatus.all')" value="" />
                    <el-option :label="$t('wfstatus.running')" value="2" />
                    <el-option :label="$t('wfstatus.completed')" value="3" />
                    <el-option :label="$t('wfstatus.suspend')" value="4" />
                    <el-option :label="$t('wfstatus.returnDraft')" value="5" />
                    <el-option :label="$t('wfstatus.canceled')" value="99" />
                  </el-select>
                </li>
                <li>
                  <label>{{$t('wfgrid.startTime')}}：</label>
                  <el-date-picker v-model="searchParams.StartTime" size="mini" clearable type="date" class="textBoxShort" format="yyyy-MM-dd" value-format="yyyy-MM-dd" />
                </li>
                <li>
                  <label>&nbsp;&nbsp;&nbsp;&nbsp;{{$t('toz')}}：</label>
                  <el-date-picker v-model="searchParams.EndTime" size="mini" clearable type="date" class="textBoxShort" format="yyyy-MM-dd" value-format="yyyy-MM-dd" />
                </li>
              </ul>
            </div>
            <div class="grid-search-form-searchbtn-toolbar">
              <el-input v-model="searchParams.searchtext" size="small" :placeholder="$t('searchTip.taskSearchTip')" clearable style="width: 347px; margin-right: 5px" :searchfields="searchParams.searchfields" />
              <el-divider direction="vertical" />
              <el-button size="small" class="search-btn" type="primary" @click="dataGridSearch()"><i class="fa fa-search" />{{$t('search')}}
              </el-button>
              <span v-if="expansMore" class="expans-more" :title="searchFromData.moreTitle" @click="onSearchExpansMore">{{ searchFromData.moreTitle }}<i :class="searchFromData.moreIcon" /></span>
            </div>
          </div>

          <div>
            <f2bpm-datagrid :expand-search="expandSearch" ref="grid" :show-checkbox="false" :show-seq="true" height="full-190" grid="grid" :pager-config="tablePage" :data="tableData" :columns="tableColumn" @page-change="pageChange" @sort-change="sortChange" />
          </div>
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
        treeFilterText: '',
        isCollapsed: false,
        expansMore: true,
        searchFromData: {
          moreIcon: 'fa fa-angle-double-down',
          moreTitle: this.$t('expand'),
          collapsedHeight: 'grid-search-form-list-height'
        },
        searchParams: {
          WorkflowTitle: '',
          AppName: '',
          AppId: '',
          InCategoryCode: '',
          Urgency: '',
          SheetId: '',
          CreatorRealName: '',
          WorkflowInstanceState: '',
          StartTime: '',
          EndTime: '',
          // 当前节点的搜索是钻取当前页面的结果再次过滤
          drillCurrentActivityNames: '',
          drillCurrentActors: '',
          // 数据过滤固定参数
          searchtext: '',
          searchfields: 'SheetId,WorkflowTitle'
        },
        tablePage: {
          pageCount: 0,
          sort: 'startedTime', // 排序字段
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
        loading: false,
        treeData: [],
        tableData: [],
        tableColumn: [
          { type: 'seq', title: '序号', align: 'center', fixed: 'left' },
          {
            field: 'sheetId',
            title: this.$t('wfgrid.sheetId'),
            width: 220,
            sort: true,
            align: 'left',
            slots: {
              default: ({ row, column }, h) => {
                return [
                  h('span', {
                    style: {
                      cursor: 'pointer', color: '#409eff'
                    },
                    on: {
                      click: () => this.openWorkflowfromView(row.appId, 2, row.workflowInstanceId, row.taskId, row.workflowTitle)
                    }
                  }, row.sheetId)
                ];
              }
            }
          },
          {
            field: 'workflowTitle',
            title: this.$t('title'),
            align: 'left',
            type: 'html',
            slots: {
              default: ({ row, column }, h) => {
                return [
                  h('span', {
                    style: {
                      cursor: 'pointer'
                    },
                    on: {
                      click: () => this.openWorkflowfromView(row.appId, 2, row.workflowInstanceId, row.taskId, row.workflowTitle)
                    }
                  }, row.workflowTitle)
                ];
              }
            }
          },
          {
            field: 'creatorRealName',
            title: this.$t('wfgrid.creatorRealName'),
            width: 120,
            align: 'center'
          },
          {
            field: 'workflowInstanceState',
            title: this.$t('wfgrid.workflowInstanceState'),
            type: 'html',
            width: 100,
            sort: true,
            align: 'center',
            formatter: function (row, column, value, index) {
              var text = getWorkflowStatusFormatter(row);
              return text;
            }
          },
          {
            field: 'appName',
            title: this.$t('wfInfo.procName'),
            width: 180,
            align: 'center'
          }, {
            field: 'startedTime',
            title: this.$t('wfgrid.wfstartTime'),
            width: 180,
            align: 'center'
          },
          {
            field: 'sheetId',
            title: this.$t('operate'),
            width: 120,
            align: 'center',
            slots: {
              default: ({ row, column }, h) => {
                return [
                  h('span', {
                    style: {
                      cursor: 'pointer', color: '#409eff'
                    },
                    attr: {
                      title: '删除流程实例，流程实例将会被物理删除，且不可恢复'
                    },
                    class: 'fa fa-close ',
                    on: {
                      click: () => this.deletewii(row.workflowInstanceId, row.sheetId, row.formId)
                    }
                  }, '删除草稿')
                ];
              }
            }
          }

        ]
      };
    },
    computed: {
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
      that.language = that.$store.state.app.language;
      this.loadTree();
      this.getGridData();
    }, mounted() {
      window.autoPageHeight();
    },
    methods: {
      collapsedSider() {
        this.isCollapsed = !this.isCollapsed;
      },

      onTreeSelected(h, treeNode) {
        var ids = [];
        var childs = treeNode.childNodes;
        ids.push(treeNode.data.id);
        $.each(childs, function (index, item) {
          ids.push(item.data.id);
          if (item.childNodes) {
            var childs2 = item.childNodes;
            $.each(childs2, function (index2, item2) {
              ids.push(item2.data.id);
            });
          }
        });
        this.searchParams.InCategoryCode = ids.toString();
        this.dataGridSearch();
      },
      filterTreeNode(value, data) {
        if (!value) return true;
        return data.title.indexOf(value) !== -1;
      },
      showAll() {
        this.searchParams.InCategoryCode = '';
        this.dataGridSearch();
      },
      loadTree() {
        const that = this;
        var treeUrl = '/workflow/security/category/getCategoryTreeJson/?groupKey=WorkflowGroup';
        Object.toAjaxJson(treeUrl, null, null, true, null, function (res) {
          if (res.success) {
            that.treeData = res.data;
            var msg = res.msg;
          } else {
            FUI.Window.showMsg(that, res.msg);
          }
        });
      },
      // 刷新列表
      refreshGrid(parentGridId, parm) {
        var that = this;
        that.dataGridSearch();
      },
      dataGridReSet() {
        const that = this;
        // 重置查询
        $.each(this.searchParams, function (key, item) {

        });
        // 页面结果搜索
        this.searchParams.drillCurrentActivityNames = '';
        this.searchParams.drillCurrentActors = '';
        this.dataGridSearch();
      },
      dataGridSearch() {
        if (this.searchParams.EndTime && this.searchParams.StartTime) {
          var start = this.searchParams.StartTime;
          var endTime = this.searchParams.EndTime;
          const n = Object.toGetDateDiff(start, endTime, 'second');
          if (n < 0) {
            this.$Message.error('发起截止时间不能小于开始时间');
            return;
          }
        }
        this.tablePage.currentPage = 1;
        this.tablePage.startIndex = 0;
        this.getGridData();
      },
      getGridData() {
        var that = this;
        var parm = that.searchParams;
        parm.page = that.tablePage.currentPage;
        parm.rows = that.tablePage.pageSize;
        parm.sort = that.tablePage.sort;
        parm.order = that.tablePage.order;
        var res = Object.toAjaxJson(FUI.Handlers.WorkflowBusinessHandler, 'getMyDraftList', parm, true, null, function (res) {
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
          name = "expand2";
        } else {
          this.searchFromData.moreIcon = 'fa fa-angle-double-down';
          this.searchFromData.collapsedHeight = 'grid-search-form-list-height';
          this.searchFromData.moreTitle = this.$t('expand');
          name = "packup";
        }
        this.expandSearch = name;
      },
      deletewii(wiid, sheetId, formId) {
        var that = this;
        FUI.Window.confirm('您确定要删除【' + sheetId + '】，删除后将无法恢复，请慎重！', '', function (r) {
          if (r) {
            var result = Object.toAjaxJson(FUI.Handlers.WorkflowManageHandler, 'deletewii', {
              'wiid': wiid,
              'formId': formId
            });
            if (result.success) {
              FUI.Window.showMsg2(result.msg, null, 1, function() {
                that.refreshGrid();
              });
            } else {
              FUI.Window.showMsg2(result.msg);
            }
          }
        });
      },
      openWorkflowfromView(appId, formAction, wiid, taskId, title) {
        var that = this;
        var url = __webpath + '/workflow/workflowform/index/?formAction=2&appId=' + appId + '&wiid=' + wiid + '&taskId=' + taskId;
        // FUI.Window.openEdit(url, title, 2, 'grid',null, null, null, null, null,true);
        FUI.Window.open(url, '_blank');
      }
    }

  }
</script>