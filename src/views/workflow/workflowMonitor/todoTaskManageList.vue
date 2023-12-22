<template>
  <div class="f2bpm-page-layout">
    <el-container>
      <el-aside ref="sideLeft" class="f2bpm-page-left" hide-trigger collapsible :width="isCollapsed ? '20px' : '200px'">
        <div class="f2bpm-panel-head">
          <div v-if="!isCollapsed" class="f2bpm-left-search-div">
            <el-input v-model="treeFilterText" class="left-htead-treeFilterText-box" size="mini" clearable :placeholder="$t('enterKey')" autocomplete="off" prefix-icon="el-icon-search" />
          </div>
          <div style="float: right; line-height: 35px; padding-right: 5px">
            <i v-if="!isCollapsed" :title="$t('refresh')" class="fa fa-refresh cur mr10 font12" @click="showAll()" />
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
                <li>
                  <label>当前环节：</label>
                  <el-input id="CurrentActivityName" v-model="searchParams.CurrentActivityName" size="mini" clearable name="CurrentActivityName" class="textBoxShort" />
                </li>

                <li>
                  <label>{{$t('wfgrid.creatorRealName')}}：</label>
                  <el-input id="CreatorRealName" v-model="searchParams.CreatorRealName" size="mini" clearable class="textBoxShort" name="CreatorRealName" />
                </li>
                <li>
                  <label>{{$t('wfgrid.workflowInstanceState')}}：</label>
                  <el-select id="WorkflowInstanceState" v-model="searchParams.WorkflowInstanceState" size="mini" class="textBoxShort" name="WorkflowInstanceState">
                    <el-option label="全部" value="" />
                    <el-option label="审批中" value="2" />
                    <el-option label="已挂起" value="4" />
                    <el-option label="退回提单" value="5" />
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
              <span v-if="expansMore" class="expans-more" :title="searchFromData.moreTitle" @click="onSearchExpansMore">{{ searchFromData.moreTitle
                }}<i :class="searchFromData.moreIcon" /></span>
            </div>
          </div>
          <div id="grid-toolbar" class="grid-toolbar">
            <el-button size="small" :type="searchParams.filterType=='all'?'primary':'default'" @click="changeList('all')">
              {{$t('all') }}({{ countData.allCount }})
            </el-button>
            <el-button size="small" :type="searchParams.filterType=='willTimeOut'?'primary':'default'" @click="changeList('willTimeOut')">
              {{$t('workstation.button.willTimeOut') }}({{ countData.willTimeOutCount }})
            </el-button>
            <el-button size="small" :type="searchParams.filterType=='timeOut'?'primary':'default'" @click="changeList('timeOut')">
              {{$t('workstation.button.timedOut') }}({{ countData.timeOutCount }})
            </el-button>
            <el-button size="small" type="default" @click="urgeTodo()"><i class="fa fa-mobile" /> {{$t('listButton.urged') }}
            </el-button>
            <el-button size="small" type="default" @click="bathHandoverTask()"><i class="fa fa-wrench" /> {{$t('listButton.turnToDo') }}
            </el-button>

            <el-button size="small" type="default" @click="rejectToStart()"><i class="fa fa-reply" /> {{$t('listButton.rejectToStart') }}
            </el-button>
            <el-button size="small" type="default" @click="sendToActivity()"><i class="fa fa-deafness" /> {{$t('listButton.sendToNode') }}
            </el-button>
          </div>
          <div>
            <f2bpm-datagrid ref="grid" :expand-search="expandSearch" :show-checkbox="false" :show-seq="true" height="full-190" grid="grid" pk="taskId" :pager-config="tablePage" :data="tableData" :columns="tableColumn" @page-change="pageChange" @sort-change="sortChange" />
          </div>
        </div>
      </el-main>
    </el-container>
  </div>
</template>
<script>
  export default {
    name: 'TodoList',
    data() {
      return {
        expandSearch:"",
        onlyAppId: '',
        filterType: '',
        // ======stand:标准区=============
        currCategoryCode: '',
        treeFilterText: '',
        expansMore: true,
        isCollapsed: false,
        countData: {
          allCount: 0,
          urgeCount: 0,
          rejectCount: 0,
          transferCount: 0,
          willTimeOutCount: 0,
          timeOutCount: 0,
          suspendedCount: 0
        },
        searchFromData: {
          moreIcon: 'fa fa-angle-double-down',
          moreTitle: this.$t('expand'),
          collapsedHeight: 'grid-search-form-list-height'
        },
        searchParams: {
          WorkflowTitle: '',
          AppName: '',
          RealName: '',
          AppId: '',
          InCategoryCode: '',
          Urgency: '',
          CurrentActivityName: '',
          SheetId: '',
          CreatorRealName: '',
          WorkflowInstanceState: '',
          StartTime: '',
          EndTime: '',

          filterType: 'all',
          searchtext: '',
          searchfields: 'SheetId,WorkflowTitle'
        },
        tablePage: {
          pageCount: 0,
          sort: 'createdTime',
          order: 'desc',
          startIndex: 0,
          total: 0,
          currentPage: 1,
          pageSize: 10,
          align: 'center',
          pageSizes: [2, 10, 20, 50, 100, 200, 500],
          layout: 'total, sizes, prev, pager, next, jumper'
        },
        loading: false,
        treeData: [],
        tableData: [],
        tableColumn: [
          { type: 'seq', width: 55, title: '序号', align: 'center', fixed: 'left' },
          { type: 'checkbox', width: 35, align: 'center', fixed: 'left' },
          {
            field: 'sheetId',
            title: this.$t('wfgrid.sheetId'),
            width: 220,
            fixed: 'left',
            sort: true,
            align: 'left',
            type: 'html',
            slots: {
              default: ({ row, column }, h) => {
                const that = this;
                return [
                  h(
                    'span',
                    {
                      style: {
                        cursor: 'pointer', color: '#409eff'
                      },
                      on: {
                        click: () => this.openWorkflowfromView(row.appId, 2, row.workflowInstanceId, row.taskId, row.workflowTitle)
                      }
                    },
                    row.sheetId
                  )
                ];
              }
            }
          },
          {
            field: 'workflowTitle',
            title: this.$t('title'),
            width: 480,
            align: 'left',
            type: 'html',
            slots: {
              // 使用 JSX 渲染函数
              default: ({ row, column }, h) => {
                return [
                  h(
                    'span',
                    {
                      style: {
                        cursor: 'pointer'
                      },
                      on: {
                        click: () => this.openWorkflowfromView(row.appId, 2, row.workflowInstanceId, row.taskId, row.workflowTitle)
                      }
                    },
                    row.workflowTitle
                  )
                ];
              }
            }
          },
          {
            field: 'activityName',
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
            field: 'realName',
            title: this.$t('wfgrid.ownerName'),
            width: 120,
            align: 'center'
          },
          {
            field: 'taskUrgeTimes',
            title: this.$t('wfgrid.taskUrgeTimes'),
            sort: true,
            width: 120,
            type: 'html',
            align: 'center',
            formatter: function (row, column, value, index) {
              var text = WF.Formatter.urgeTimesFormatter(row);
              return text;
            }
          },
          {
            field: 'taskState',
            title: this.$t('wfgrid.taskState'),
            type: 'html',
            sort: true,
            width: 120,
            align: 'center',
            formatter: function (row, column, value, index) {
              var text = taskStateFormatter(row);
              return text;
            }
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
          },
          {
            field: 'createdTime',
            title: this.$t('wfgrid.receiptTime'),
            width: 180,
            sort: true,
            align: 'center'
          },
          {
            field: 'taskExpireTime',
            title: this.$t('wfgrid.taskExpireTime'),
            width: 180,
            align: 'center',
            formatter: function (rec, column, value, index) {
              var value = rec.taskExpireTime;
              if (value == '' || value == null) {
                return '';
              }
              var text = Object.toJsonDateTimeFormatter(value);
              return text;
            }
          },
          {
            field: 'currentActors',
            title: this.$t('wfgrid.timeout'),
            width: 200,
            align: 'center',
            type: 'html',
            formatter: function (rec, column, value, index) {
              if (!rec.taskExpireTime) {
                return '';
              }
              var now = new Date();
              var endTime = now.toDateFormat('yyyy-MM-dd HH:mm:ss');
              var start = Object.toJsonDateTimeFormatter(rec.taskExpireTime);
              var hours = Object.toGetDateDiff(start, endTime, 'second');
              if (hours > 0) {
                var zw = Object.toGetDateDiff(start, endTime, 'zw');
                var str =
                  "<span class='label label-lg label-pink arrowed-right'>" +
                  zw +
                  '</span>';
              }
              var text = hours > 0 ? str : '';
              return text;
            }
          },
          {
            field: 'startedTime',
            title: this.$t('wfgrid.wfstartTime'),
            width: 180,
            align: 'center',
            formatter: function (rec, column, value, index) {
              var value = rec.startedTime;
              if (value == '' || value == null) {
                return '';
              }
              return Object.toJsonDateTimeFormatter(value);
            }
          },
          {
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
      var onlyAppId = Object.toQueryString('appId') || '';
      // 默认过滤类型
      var filterType = Object.toQueryString('filterType') || '';
      this.onlyAppId = onlyAppId;
      this.filterType = filterType;

      this.loadTree();
      this.getGridData();
      this.getCountData();
    },
    mounted() {
      window.myvm = this;
    }, mounted() {
      window.myvm = this;
      window.autoPageHeight();
    },
    methods: {
      collapsedSider() {
        this.isCollapsed = !this.isCollapsed;
      },
      onTreeSelected(data, treeNode, thisObj) {
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
      showAll() {
        this.searchParams.InCategoryCode = '';
        this.dataGridSearch();
      },
      filterTreeNode(value, data) {
        if (!value) return true;
        return data.title.indexOf(value) !== -1;
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
      refreshGrid() {
        this.dataGridSearch();
      },
      dataGridReSet() {
        const that = this;
        // 重置查询
        $.each(this.searchParams, function (key, item) {
          if (key != 'filterType') {
            that.searchParams[key] = '';
          }
        });
        this.dataGridSearch();
      },
      dataGridSearch() {
        if (this.searchParams.EndTime && this.searchParams.StartTime) {
          var start = this.searchParams.StartTime;
          var endTime = this.searchParams.EndTime;
          const n = Object.toGetDateDiff(start, endTime, 'second');
          if (n < 0) {
            FUI.Window.showMsg2(this, '发起“截止时间”不能小于“开始时间”');
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
        parm.isAllTask = true;
        parm.onlyAppId = that.onlyAppId;
        var res = Object.toAjaxJson('/workflow/workflowBusiness/', 'getTodoListJson', parm, true, null,
          function (res) {
            if (res.success) {
              that.tableData = res.rows;
              that.tablePage.total = res.total;
              that.tablePage.pageCount = res.pageCount;
            } else {
              FUI.Window.showMsg(res.msg);
            }
          }
        );
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
        this.getGridData();
      },
      changeList(filterType) {
        this.searchParams.filterType = filterType;
        this.dataGridSearch();
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

      async getCountData() {
        var that = this;
        var resData = Object.toAjaxJson(FUI.Handlers.WorkflowBusinessHandler, 'getTodoManagerListCountJson', null, true, null, function (resData) {
          that.countData = resData.data;
        }, null, false);
      },
      rejectToStart() {
        var that = this;
        var ids = FUI.Grid.getGridChecked(that, 'grid', 'taskId');
        if (!ids) {
          FUI.Window.showMsg(that, '请选择要退回到提单待办任务。');
          return false;
        }
        if (ids.indexOf(',') > -1) {
          FUI.Window.showMsg(that, '退回到提单只能选择一条记录');
          return false;
        }
        layer.prompt({
          formType: 2,
          btnAlign: 'c',
          title: '退回意见',
          value: '',
          yes: function (index, layero) {
            var value = layero.find('.layui-layer-input').val();
            if (value == '') {
              FUI.Window.showMsg('输入不能为空。');
              return false;
            }
            var data = {
              'taskId': ids,
              'opinion': value
            };
            var result = Object.toAjaxJson('/workflow/workflowMonitor/', 'rejectToStart', data);
            FUI.Window.showMsg2(that, result.msg, null, 'info', function () {
              that.refreshGrid();
              layer.close(index);
            });
          }
        });
      },
      // 批量交接
      bathHandoverTask() {
        var that = this;
        var ids = FUI.Grid.getGridChecked(that, 'grid', 'taskId');
        var taskTitles = FUI.Grid.getGridChecked(that, 'grid', 'workflowTitle', that.filterTitle);

        if (!ids) {
          FUI.Window.showMsg(that, '请选择要交接/转办的待办任务。');
          return false;
        }
        FUI.Window.openEdit('/workflow/workflowMonitor/bathHandoverTaskDialog', '交接/转办待办任务', 'Add', 'grid', 860, 560,
          null, null, null, null, null, {
          taskIds: ids,
          taskTitles: taskTitles
        });

        // FUI.dialog(__webpath + "/workflow/workflowMonitor/bathHandoverTaskDialog", "交接/转办待办任务", {
        //   taskIds: ids,
        //   taskTitles: taskTitles
        // }, 800, 450, function (data, index, layerObj) {
        //   if (data != false) {
        //     layerObj.close(index);
        //     FUI.Window.showMsg(that, data);
        //   }
        //   that.refreshGrid();
        // }, true, { btnAlign: 'c', fit: false }, { sure: { text: "提交" } } );
      },

      sendToActivity() {
        var that = this;
        var taskId = FUI.Grid.getGridChecked(that, 'grid', 'taskId');
        if (taskId.indexOf(',') > -1) {
          FUI.Window.showMsg(that, '只能选择一条记录');
          return false;
        }
        if (!taskId) {
          FUI.Window.showMsg(that, '请选择要提交到指定节点的办任务。');
          return false;
        }
        var taskTitle = FUI.Grid.getGridChecked(that, 'grid', 'workflowTitle', that.filterTitle);
        var sheetId = FUI.Grid.getGridChecked(that, 'grid', 'sheetId');
        FUI.Window.openEdit('/workflow/workflowMonitor/sendToActivityDialog/?taskId=' + taskId + '&sheetId=' + sheetId, '流程 【' + sheetId + '|' + taskTitle + '】 提交到指定节点', 'Add', 'grid', 860, 560);
      },
      urgeTodo() {
        var that = this;
        var taskIds = FUI.Grid.getGridChecked(that, 'grid', 'taskId');
        if (!taskIds) {
          FUI.Window.showMsg(that, '请选择要催办的任务。');
          return false;
        }
        FUI.Window.openEdit('/workflow/workflowMonitor/urgeRemind/?taskIds=' + taskIds, '任务催办', 'Add', 'grid', 880, 580);
      },

      filterTitle(value) {
        return Object.toReplaceAll(value, ',', '，', true);
      },
      openWorkflowfromView(appId, formAction, wiid, taskId, title) {
        var that = this;
        var url = __webpath + '/workflow/workflowform/index/?formAction=2&appId=' + appId + '&wiid=' + wiid + '&taskId=' + taskId;
        // FUI.Window.openEdit(url, title, 2, 'grid',null, null, null, null, null,true);
        window.open(url, '_blank');
      }
    }

  }
</script>