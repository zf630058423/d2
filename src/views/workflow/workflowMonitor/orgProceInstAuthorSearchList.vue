<template>
  <div class="f2bpm-page-layout">
    <el-container>
      <el-aside ref="sideLeft" class="f2bpm-page-left" hide-trigger collapsible :width="isCollapsed?'20px':'200px'">
        <div class="f2bpm-panel-head">
          <div v-if="!isCollapsed" class="f2bpm-left-search-div">
            <el-input v-model="treeFilterText" class="left-htead-treeFilterText-box" size="mini" clearable :placeholder="$t('enterKey')" autocomplete="off" prefix-icon="el-icon-search" />
          </div>
          <div style="float: right; line-height: 35px; padding-right: 5px">
            <i v-if="!isCollapsed" :title="$t('refresh')" class="fa fa-refresh cur mr10 font12"  @click="showAll()" />
            <i title="收起/展开" :class="rotateIcon" @click="collapsedSider" />
          </div>
        </div>

        <div v-if="!isCollapsed" class="f2bpm-page-left-content">
          <span v-if="false" class="fa fa-home cur ml10 font12" @click="showAll()">
            全部</span>
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
                    <el-option label="全部" value="" />
                    <el-option label="草稿" value="1" />
                    <el-option label="审批中" value="2" />
                    <el-option label="已完成" value="3" />
                    <el-option label="已挂起" value="4" />
                    <el-option label="退回提单" value="5" />
                    <el-option label="已作废" value="99" />
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
          <div id="grid-toolbar" class="grid-toolbar">
            <el-button-group>
              <el-button size="small" :type="searchParams.isHistory==0?'primary':'default'" @click="changeList(0)">
                 {{$t('pageInfo.unfinished')}}
              </el-button>
              <el-button size="small" :type="searchParams.isHistory==1?'primary':'default'" @click="changeList(1)">
                {{$t('pageInfo.finished')}}
              </el-button>
            </el-button-group>
          </div>
          <div>
            <f2bpm-datagrid ref="grid" :show-checkbox="false" :show-seq="true" height="full-190" grid="grid" :pager-config="tablePage" :data="tableData" :columns="tableColumn" @page-change="pageChange" @sort-change="sortChange" />
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
          // 数据过滤固定参数
          searchtext: '',
          searchfields: 'SheetId,WorkflowTitle',
          isHistory: 0
        },
        tablePage: {
          pageCount: 0,
          sort: 'startedTime', // 排序字段
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
        loading: false,
        treeData: [],
        tableData: [],
        tableColumn: [
          { type: 'seq', width: 55, title: '序号', align: 'center', fixed: 'left' },
          { type: 'checkbox', width: 35, align: 'center', fixed: 'left' },
          {
            field: 'sheetId',
            title:  this.$t('wfgrid.sheetId'),
            width: 220,
            sort: true,
            align: 'left',
            type: 'html',
            slots: {
              default: ({ row, column }, h) => {
                return [
                  h('span', {
                    style: {
                      cursor: 'pointer', color: '#409eff'
                    },
                    on: {
                      click: () => this.openWorkflowfromView(row.appId, 3, row.workflowInstanceId, row.workflowTitle)
                    }
                  }, row.sheetId)
                ];
              }
            }
          },
          {
            field: 'workflowTitle',
            title:this.$t('title'),
            width: 480,
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
                      click: () => this.openWorkflowfromView(row.appId, 3, row.workflowInstanceId, row.workflowTitle)
                    }
                  }, row.workflowTitle)
                ];
              }
            }
          }, {
            field: 'currentActivityName',
            title: this.$t('wfgrid.currentActivityName'),
            width: 180,
            align: 'center'
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
            title:  this.$t('wfInfo.procName'),
            width: 180,
            align: 'center'
          }, {
            field: 'startedTime',
            title:this.$t('wfgrid.wfstartTime'),
            width: 180,
            align: 'center'
          }, {
            field: 'finishedTime',
            title:this.$t('wfgrid.finishedTime'),
            width: 180,
            align: 'center'
          }, {
            field: 'extStr',
            title: this.$t('wfgrid.runingtime'),
            width: 200,
            align: 'center',
            formatter: function (rec, column, value, index) {
              var value = rec.startedTime;
              var finishedTime = rec.finishedTime;
              var text = '';
              if (!finishedTime) {
                var now = new Date();
                var endTime = now.toDateFormat('yyyy-MM-dd HH:mm:ss');
                var start = Object.toJsonDateTimeFormatter(value);
                var subN = Object.toGetDateDiff(start, endTime, 'zw');
                text = subN;
              } else {
                var endTime = Object.toJsonDateTimeFormatter(finishedTime);
                var start = Object.toJsonDateTimeFormatter(value);
                var subN = Object.toGetDateDiff(start, endTime, 'zw');
                text = subN;
              }
              return text;
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
      window.myvm = this;
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
          if (key != 'isHistory') {
            that.searchParams[key] = '';
          }
        });
        // 页面结果搜索
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
        parm.isFilterByOrgId = true;
        var res = Object.toAjaxJson(FUI.Handlers.WorkflowBusinessHandler, 'getWorkflowInstanceSearchList', parm, true, null, function (res) {
          if (res.success) {
            that.tableData = res.rows;
            that.tablePage.total = res.total;
            that.tablePage.pageCount = res.pageCount;
          } else {
            FUI.Window.showMsg(res.msg);
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
      changeList(isHistory) {
        this.searchParams.isHistory = isHistory;
        this.dataGridSearch();
      },
      onSearchExpansMore() {
        if (this.searchFromData.moreTitle == this.$t('expand')) {
          this.searchFromData.moreIcon = 'fa fa-angle-double-up';
          this.searchFromData.collapsedHeight = '';
           this.searchFromData.moreTitle = this.$t('packUp');
        } else {
          this.searchFromData.moreIcon = 'fa fa-angle-double-down';
          this.searchFromData.collapsedHeight = 'grid-search-form-list-height';
           this.searchFromData.moreTitle = this.$t('expand');
        }
      },
      openWorkflowfromView(appId, formAction, wiid, workflowTitle) {
        var that = this;
        openWorkflowfromView(this, appId, wiid, workflowTitle);
      }
    }

  }
</script>