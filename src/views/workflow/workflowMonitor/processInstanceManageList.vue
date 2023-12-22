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
          <div id="grid-toolbar" class="grid-toolbar">
            <el-button size="small" :type="searchParams.isHistory==0?'primary':'default'" @click="changeList(0)">
              {{$t('pageInfo.unfinished')}}
            </el-button>
            <el-button size="small" :type="searchParams.isHistory==1?'primary':'default'" @click="changeList(1)">
              {{$t('pageInfo.finished')}}
            </el-button>
            <el-button size="small" type="default" @click="batchCirculation">
              <i class="fa fa-share" /> {{$t('listButton.circulated')}}
            </el-button>
            <el-button size="small" type="default" @click="changeProcessInstanceStator">
              <i class="fa fa-wrench" />{{$t('listButton.changeStartor')}}
            </el-button>
            <el-button v-if="searchParams.isHistory==0" size="small" type="default" @click="appendOrChangeTask('appendTask')">
              <i class="fa fa-user-plus" title="增加处理人" />{{$t('listButton.addAppendUser')}}
            </el-button>
            <el-button v-if="searchParams.isHistory==0" size="small" type="default" @click="appendOrChangeTask('changeTask')">
              <i class="fa fa-edit" title="修改成其它处理人" />{{$t('listButton.changeActor')}}
            </el-button>
            <el-button v-if="searchParams.isHistory==0" size="small" type="default" @click="updateState(4)"><i class="fa fa-lock" />{{$t('listButton.suspend')}}
            </el-button>
            <el-button v-if="searchParams.isHistory==0" size="small" type="default" @click="updateState(2)"><i class="fa fa-unlock" />{{$t('listButton.unsuspend')}}
            </el-button>
            <el-button v-if="searchParams.isHistory==0" size="small" type="default" @click="invalidProcessInst()"><i class="fa fa-wrench" />{{$t('listButton.invalid')}}
            </el-button>
            <el-button v-if="searchParams.isHistory==0" size="small" type="default" @click="appendComment()"><i class="icon icon-message" />{{$t('listButton.appendComment')}}
            </el-button>

          </div>
          <div>
            <f2bpm-datagrid ref="grid" :expand-search="expandSearch" :show-checkbox="false" :show-seq="true" height="full-190" grid="grid" :pager-config="tablePage" :data="tableData" :columns="tableColumn" @page-change="pageChange" @sort-change="sortChange" />
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
            title: this.$t('operate'),
            width: 120,
            align: 'center',
            type: 'html',
            slots: {
              default: function ({ row, column, index }, h) {
                let that = window.myvm;
                let hbtns = [];
                var itemBtn = h('el-dropdown-item', {
                  attrs: {
                    btn_code: "modifyworkflowtitle",
                    title: "修改流程实例标题"
                  },
                  class: "fa fa-edit block minw80",
                  nativeOn: { click: () => that.modifyWorkflowTitle(row.sheetId, row.workflowInstanceId, row.workflowTitle) }
                }, " 修改标题");
                hbtns.push(itemBtn);
                if (row.currentActivityName == '' && that.searchParams.isHistory == 0) {
                  var itemBtn2 = h('el-dropdown-item', {
                    attrs: {
                      btn_code: "reactivateTodoTask",
                      title: "重新激活待办"
                    },
                    class: "fa fa-deafness block minw80",
                    nativeOn: { click: () => that.reactivateTodoTask(row.sheetId, row.workflowInstanceId, row.workflowTitle) }
                  }, " 重新激活待办");
                  hbtns.push(itemBtn2);
                }


                return [
                  h('el-dropdown',
                    {
                      props: {
                        size: 'mini',
                        splitButton: true,
                        type: 'default'
                      }
                      , attrs: {
                        btn_code: "delete"
                      },
                      on: {
                        click: () => that.deleteInst(row.sheetId, row.workflowInstanceId, row.workflowTitle)
                      }
                    }
                    , [
                      h("i", { class: " fa fa-trash-o", attrs: { title: " 删除" } }, "删除"),
                      h('el-dropdown-menu',
                        {
                          props: {
                            slot: "dropdown"
                          }
                        },
                        hbtns
                      )
                    ]
                  )
                ];
              }
            }
          },
          {
            field: 'sheetId',
            title: this.$t('wfgrid.sheetId'),
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
            title: this.$t('title'),
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
            title: this.$t('wfInfo.procName'),
            width: 180,
            align: 'center'
          }, {
            field: 'startedTime',
            title: this.$t('wfgrid.wfstartTime'),
            width: 180,
            align: 'center'
          }, {
            field: 'finishedTime',
            title: this.$t('wfgrid.finishedTime'),
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
      window.myvm = this;
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
        var res = Object.toAjaxJson(FUI.Handlers.WorkflowBusinessHandler, 'getWorkflowInstanceSearchList', parm, true, null, function (res) {
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
      changeList(isHistory) {
        this.searchParams.isHistory = isHistory;
        this.dataGridSearch();
      },
      onSearchExpansMore() {
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
      // 批量传阅
      batchCirculation() {
        var that = this;
        var ids = FUI.Grid.getGridChecked(that, 'grid', 'workflowInstanceId');
        if (!ids) {
          FUI.Window.showMsg('请选择要传阅的流程实例！');
          return false;
        }
        var n = ids.split(',').length;
        if (n > 5) {
          FUI.Window.showMsg('一次传阅最多不能超过5条！');
          return false;
        }
        FUI.Window.openEdit('/workflow/workflowMonitor/bathCirculationDialog/?wiids=' + ids, '批量传阅干预', 'Add', 'grid', 680, 500);
      },
      deleteInst(sheetId, wiid, title) {
        var that = this;
        FUI.Window.confirm('您确定要删除【' + sheetId + '】，删除后将无法恢复，请慎重！', '', function () {
          var result = Object.toAjaxJson(FUI.Handlers.WorkflowManageHandler, 'onlyDeletewii', {
            'wiid': wiid
          });
          if (result.success) {
            that.refreshGrid();
            FUI.Window.showMsg2(result.msg, null, 1);
          } else {
            FUI.Window.showMsg2(result.msg);
          }
        });
      },
      modifyWorkflowTitle(sheetId, wiid, title) {
        var that = this;
        var msg = '您确定要修改流程实例的标题【' + title + '】？ ';
        FUI.Window.confirm(that, msg, '温馨提示', function (r) {
          if (r) {
            layer.prompt({
              formType: 2,
              btnAlign: 'c',
              title: '请输入新的流程实例标题',
              value: '',
              yes: function (index, layero) {
                var value = layero.find('.layui-layer-input').val();
                if (value == '') {
                  FUI.Window.showMsg('输入不能为空。');
                  return false;
                }
                var data = {
                  wiid: wiid,
                  sheetId: sheetId,
                  newWorkflowTitle: value,
                  oldWorkflowTitle: title
                };
                var result = Object.toAjaxJson(FUI.Handlers.WorkflowBusinessHandler, 'modifyWorkflowTitle', data);
                FUI.Window.showMsg(result.msg, null, result.success ? 'info' : 'error', function () {
                  that.refreshGrid();
                  layer.close(index);
                });
              }
            });
          }
        });
      },
      reactivateTodoTask(sheetId, wiid, title) {
        var that = this;
        var msg = '您确定要将流程实例【' + title + '】的最后一条办理任务重新激活为待办任务吗？ ';
        FUI.Window.confirm(that, msg, '温馨提示', function (r) {
          if (r) {
            var data = {
              wiid: wiid,
              sheetId: sheetId
            };
            var result = Object.toAjaxJson(FUI.Handlers.WorkflowBusinessHandler, 'reactivateTodoTask', data);
            FUI.Window.showMsg(result.msg, null, result.success ? 'info' : 'error', function () {
              that.refreshGrid();
            });
          }
        });
      },

      changeProcessInstanceStator() {
        var that = this;
        var wiid = FUI.Grid.getGridChecked(that, 'grid', 'workflowInstanceId');
        if (wiid.indexOf(',') > -1) {
          FUI.Window.showMsg(that, '只能选择一条记录');
          return false;
        }
        if (!wiid) {
          FUI.Window.showMsg('请选择流程实例。');
          return false;
        }
        var sheetId = FUI.Grid.getGridChecked(that, 'grid', 'sheetId');
        FUI.Window.openEdit('/workflow/workflowMonitor/changeProcessInstanceStator/?wiid=' + wiid, '流程实例 【' + sheetId + '】变更发起人', 'Add', 'grid', 860, 560);
      },
      openWorkflowfromView(appId, formAction, wiid, workflowTitle) {
        var that = this;
        openWorkflowfromView(this, appId, wiid, workflowTitle);
      },
      appendOrChangeTask(type) {
        var that = this;
        var typeTitle = type == 'appendTask' ? '加签处理人' : '改签处理人';
        var wiid = FUI.Grid.getGridChecked(that, 'grid', 'workflowInstanceId');
        var sheetId = FUI.Grid.getGridChecked(that, 'grid', 'sheetId');
        if (wiid.indexOf(',') > -1) {
          FUI.Window.showMsg(that, '只能选择一条记录');
          return false;
        }
        if (!wiid) {
          FUI.Window.showMsg('请选择要“' + typeTitle + '”的流程实例。');
          return false;
        }
        FUI.Window.openEdit('/workflow/workflowMonitor/appendTask/?type=' + type + '&wiid=' + wiid + '&sheetId=' + sheetId, '流程单号【' + sheetId + '】', 'Add', 'grid', 880, 580);
      },
      updateState(state) {
        var that = this;
        var wiids = FUI.Grid.getGridChecked(that, 'grid', 'workflowInstanceId');
        var sheetIds = FUI.Grid.getGridChecked(that, 'grid', 'sheetId');
        var workflowInstanceStates = FUI.Grid.getGridChecked(that, 'grid', 'workflowInstanceState');
        if (!wiids) {
          FUI.Window.showMsg(that, '请选择要挂起的流程。');
          return false;
        }

        if (state == 4 && workflowInstanceStates.indexOf('4') > -1) {
          // 挂起
          FUI.Window.showMsg(that, '挂起操作不能包括状态为“已挂起”的记录');
          return false;
        }
        if (state == 2) {
          // 解除挂起
          var isErr = false;
          var statusArr = workflowInstanceStates.split(',');
          $.each(statusArr, function (i, item) {
            if (item != 4) {
              isErr = true;
              return false;
            }
          });
          if (isErr) {
            FUI.Window.showMsg(that, '解除挂只能选择状态为“已挂起”的记录');
            return false;
          }
        }
        var msg = state == 2 ? '确定要解除挂起工单【' + sheetIds + '】吗?' : '确定要挂起工单【' + sheetIds + '】吗?';
        FUI.Window.confirm(that, msg, '温馨提示', function (r) {
          if (r) {
            var data = {
              wiid: wiids,
              WorkflowInstanceState: state
            };
            var result = Object.toAjaxJson(FUI.Handlers.WorkflowBusinessHandler, 'updateWorkflowInstanceState', data);
            FUI.Window.showMsg(result.msg, null, 'info', function () {
              that.refreshGrid();
            });
          }
        });
      },
      appendComment() {
        var that = this;
        var wiids = FUI.Grid.getGridChecked(that, 'grid', 'workflowInstanceId');
        if (!wiids) {
          FUI.Window.showMsg(that, '请选择要追加评论的流程实例');
          return false;
        }
        FUI.Window.openEdit('/workflow/workflowMonitor/appendComment/?wiids=' + wiids, '追加评论', 'Add', 'grid', 880, 580);
      },

      invalidProcessInst(wiid, sheetId) {
        var that = this;
        var wiids = FUI.Grid.getGridChecked(that, 'grid', 'workflowInstanceId');
        var sheetIds = FUI.Grid.getGridChecked(that, 'grid', 'sheetId');
        if (!wiids) {
          FUI.Window.showMsg(that, '请选择要作废的流程。');
          return false;
        }
        var msg = '您确定要将选中的流程【' + sheetIds + '】进行作废吗？确定后将选中的数据进行作废，流程结束。';
        FUI.Window.confirm(that, msg, '温馨提示', function (r) {
          if (r) {
            layer.prompt({
              formType: 2,
              btnAlign: 'c',
              title: '作废流程单的原因及意见',
              value: '',
              yes: function (index, layero) {
                var value = layero.find('.layui-layer-input').val();
                if (value == '') {
                  FUI.Window.showMsg('输入不能为空。');
                  return false;
                }
                var data = {
                  wiid: wiids,
                  opinion: value
                };
                var result = Object.toAjaxJson(FUI.Handlers.WorkflowBusinessHandler, 'invalidProcessInst', data);
                FUI.Window.showMsg(result.msg, null, result.success ? 'info' : 'error', function () {
                  that.refreshGrid();
                  layer.close(index);
                });
              }
            });
          }
        });
      }
    }

  }
</script>