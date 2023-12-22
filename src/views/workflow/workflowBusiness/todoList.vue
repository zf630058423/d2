<template>
  <div class="f2bpm-page-layout">
    <el-container>
      <el-aside ref="sideLeft" class="f2bpm-page-left" hide-trigger collapsible :width="isCollapsed ? '20px' : '200px'">
        <div class="f2bpm-panel-head">
          <div v-if="!isCollapsed" class="f2bpm-left-search-div">
            <el-input v-model="treeFilterText" class="left-htead-treeFilterText-box"   size="small" clearable :placeholder="$t('enterKey')" autocomplete="off" prefix-icon="el-icon-search" />
          </div>
          <div  class="f2bpm-left-search-button-div">
            <i v-if="!isCollapsed" :title="$t('refresh')" class="icon icon-shuaxin  cur mr10 font12  " @click="loadTree()"></i>
            <i title="收起/展开" :class="rotateIcon" @click="collapsedSider" />
          </div>
        </div>
        <div v-if="!isCollapsed" class="f2bpm-page-left-content mt4" style="overflow-y: auto;">
          <span class="fa fa-home cur ml10 font12 " @click="showAll()"> {{$t('all')}}</span>
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
                  <label>单据编号：</label>
                  <el-input id="FormDatakey" v-model="searchParams.FormDatakey" size="mini" clearable class="textBoxShort" name="FormDatakey" />
                </li>
                <li>
                  <label>{{$t('wfInfo.procName')}}：</label>
                  <el-input id="AppName" v-model="searchParams.AppName" size="mini" clearable class="textBoxShort" name="AppName" />
                </li>
                <li>
                  <label>{{$t('wfgrid.activityName')}}：</label>
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
                    <el-option label="驳回提单" value="5" />
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
              <span v-if="expansMore" class="expans-more" :title="searchFromData.moreTitle" @click="onSearchExpansMore">{{ searchFromData.moreTitle}}<i :class="searchFromData.moreIcon" /></span>
            </div>
          </div>
          <div id="grid-toolbar" class="grid-toolbar">
              <el-button   size="small" :type="searchParams.filterType == 'all' ? 'primary' : 'default'" @click="changeList('all')">
                {{$t('all')}}(<span v-html="countData.allCount" />)
              </el-button>
              <el-button   size="small" :type="searchParams.filterType == 'taskUrge' ? 'primary' : 'default'" @click="changeList('taskUrge')">
                {{$t('workstation.button.beUrged')}}(<span v-html="countData.urgeCount" />)
              </el-button>
              <el-button   size="small" :type="searchParams.filterType == 'reject' ? 'primary' : 'default'" @click="changeList('reject')">
                {{$t('workstation.button.beReject')}} (<span v-html="countData.rejectCount" />)
              </el-button>
              <el-button   size="small" :type="searchParams.filterType == 'transfer' ? 'primary' : 'default'" @click="changeList('transfer')">
                {{$t('workstation.button.wasTransferred')}} (<span v-html="countData.transferCount" />)
              </el-button>
              <el-button   size="small" :type="searchParams.filterType == 'willTimeOut'? 'primary': 'default'" @click="changeList('willTimeOut')">
                {{$t('workstation.button.willTimeOut')}} (<span v-html="countData.willTimeOutCount" />)
              </el-button>
              <el-button   size="small" :type="searchParams.filterType == 'timeOut' ? 'primary' : 'default'" @click="changeList('timeOut')">
                {{$t('workstation.button.timedOut')}} (<span v-html="countData.timeOutCount" />)
              </el-button>
              <el-button   size="small" :type="searchParams.filterType == 'suspended' ? 'primary' : 'default'" @click="changeList('suspended')">
                {{$t('workstation.button.suspended')}} (<span v-html="countData.suspendedCount" />)
              </el-button>
              <!-- 批量审批 -->
              <el-button   size="small" type="default" @click="batchApproval">
                 {{$t('workstation.button.batchApproval')}}
              </el-button>
              <!-- 导出 -->
              <el-button  size="small" type="default" @click="excelExportClick">
                 {{$t('workstation.button.excelExport')}}
              </el-button>
          </div>
          <div>
            <f2bpm-datagrid :expand-search="expandSearch" ref="grid" :show-checkbox="false" :show-seq="true" height="full-190" grid="grid" pk="taskId" :pager-config="tablePage" :data="tableData" :columns="tableColumn" @page-change="pageChange" @sort-change="sortChange" />
          </div>
        </div>
      </el-main>
    </el-container>
  </div>
</template>
<script>
import fun from '@/utils/fun';


  export default {
    name: 'TodoList',
    data() {
      return {
        expandSearch: "",
        language: "",
        currUser: null,
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
          AppCode: '',
          AppAlias: '',
          AppId: '',
          InCategoryCode: '',
          Urgency: '',
          CurrentActivityName: '',
          SheetId: '',
          CreatorRealName: '',
          WorkflowInstanceState: '',
          StartTime: '',
          EndTime: '',
          FormDatakey: '',

          searchtext: '',
          searchfields: 'SheetId,WorkflowTitle,FormDatakey',
          filterType: 'all'
        },
        tablePage: {
          pageCount: 0,
          sort: 'TaskUrgeTimes desc,UrgencyLevel desc,CreatedTime',
          order: 'desc',
          startIndex: 0,
          total: 0,
          currentPage: 1,
          pageSize: 20,
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
            type: 'empty', width: 60, title: this.$t('wfgrid.wfMap'), align: 'center', fixed: 'left', slots: {
              default: ({ row, column }, h) => {
                const that = this;
                return [
                  h(
                    'span',
                    {
                      style: {
                        cursor: 'pointer', color: '#409eff'
                      },
                      class: 'fa fa-photo cur ml10 mr10',
                      on: {
                        click: () => this.openWorkflowfromMap(row.workflowInstanceId, row.workflowTitle)
                      }
                    },
                    ''
                  )
                ];
              }
            }
          },
          {
            field: 'sheetId',
            title: this.$t('wfgrid.sheetId'),
            width: 220,
            fixed: 'left',
            sort: true,
            align: 'left',
            type: 'html',
            // slots: {
            //   default: ({ row, column }, h) => {
            //     const that = this;
            //     return [
            //       h(
            //         'span',
            //         {
            //           style: {
            //             cursor: 'pointer', color: '#409eff'
            //           },
            //           on: {
            //             click: () => this.openWorkflowfromView(row.appId, 2, row.workflowInstanceId, row.taskId, row.workflowTitle)
            //           }
            //         },
            //         row.sheetId
            //       )
            //     ];
            //   },
            // },
            slots: { 
              default: ({ row, column }, h) => { 
                let urgencyLevel = row.urgencyLevel;
                let textData = {
                  3: '特别紧急',
                  2: '紧急'
                }
                let img = require('@/assets/img/urgency.png')
                let spanDivArr = [];  //存储图标火
                if (urgencyLevel > 1) {
                  for (let i = 0; i < urgencyLevel; i++) {
                    spanDivArr.push(<img style="width:18px;height:18px;" src={img}/>);
                  }
                }
                return (
                  <div style="display:flex;justify-content:flex-start;">
                    <span class="window-open" style="cursor:pointer; color:#409eff;" onClick={() =>this.openWorkflowfromView(row.appId, 2, row.workflowInstanceId, row.taskId, row.workflowTitle)}>{row.sheetId}</span>
                    <span title={textData[urgencyLevel]} style="display:flex;margin-left:6px;align-items:center;">
                      {spanDivArr}
                    </span>
                  </div>
                )
              },
            },
          },
          {
            field: 'formDatakey',
            title: '单据编号',
            width: 180,
            align: 'center'
          },
          {
            field: 'workflowTitle',
            title: this.$t('title'),
            width: 480,
            align: 'center',
            type: 'html',
            slots: {
              // 使用 JSX 渲染函数
              default: ({ row, column }, h) => {
                var isdl =row.delegatorUserId&& this.currUser.userId == row.delegatorUserId&&row.delegatorUserId!=row.userId;
                var workflowTitle = isdl ? "【代理|"+row.realName+"】" + row.workflowTitle : row.workflowTitle;
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
                    workflowTitle
                  )
                ];
              }
            }
          },
          {
            field: 'activityName',
            title: this.$t('wfgrid.activityName'),
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
            title: this.$t('wfgrid.appName'),
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
            type: 'empty',
            title: this.$t('wfgrid.timeout'),
            width: 200,
            align: 'center',
            type: 'html',
            formatter: function (rec, column, value, index) {
              if (!rec.taskExpireTime) {
                return '';
              }
              var taskDealWithCount=rec.taskDealWithCount;
              var now = new Date();
              var endTime = now.toDateFormat('yyyy-MM-dd HH:mm:ss');
              var start = Object.toJsonDateTimeFormatter(rec.taskExpireTime);
              var hours = Object.toGetDateDiff(start, endTime, 'second');
              if (hours > 0) {
                var zw = Object.toGetDateDiff(start, endTime, 'zw');
                var str =
                  "<span title='已尝试执行"+taskDealWithCount+"次' class='label label-lg label-pink arrowed-right'>" +
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
            type: 'empty',
            title: this.$t('wfgrid.runingtime'),
            width: 200,
            align: 'center',
            formatter: function (rec, column, value, index) {
              var value = rec.startedTime;
              var text = '';
              if (value != null) {
                var now = new Date();
                var endTime = now.toDateFormat('yyyy-MM-dd HH:mm:ss');
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
      window.myvm = that;
      const currUser = that.$store.state.user.author;
      that.currUser = currUser;
      that.language = that.$store.state.app.language;
      this.loadTree();
      this.getGridData();
      this.getCountData();

      // this.loadCustomConfig();
    },
    mounted() {
      window.myvm = this;
       let userAgent = navigator.userAgent.toLowerCase();
       let isMobile = userAgent.match(/(iphone|ipod|ipad|android)/)
       if(isMobile){
        this.isCollapsed = true
       }
       window.autoPageHeight();
    },
  methods: {
    loadCustomConfig() {
      // let isSetHead = Object.toQueryString('isSetHead') || '0';
      // let code = Object.toQueryString('code');
      // let varParams = Object.toQueryString('varParams') || '';
      // varParams = decodeURIComponent(varParams);
      // var parm = { 'isSetHead': isSetHead, 'code': code, 'varParams': varParams };
      // //将Url参数携带进去
      // var urlParms = Object.toQueryParmJson();
      // $.each(urlParms, function (key, value) {
      //   if (!parm.hasOwnProperty(key)) {
      //     parm[key] = value;
      //   }
      // });

      // var res = Object.toAjaxJson(FUI.Handlers.CustomDataGridHandler, 'getCustomDataGridJson', parm);
      // console.log("导出res=====", res);
      // var configModel = res.data.model;
      // this.exportCommonExcel('customDataGrid',configModel.dataMainTableName);
      this.exportCommonExcel('customDataGrid','');
    },
    exportCommonExcel(type, tableName) { 
        // var idFieldValues = this.dg.getChecked();
        // var selectedIds = idFieldValues ? idFieldValues.split(',') : [];
        // if (selectedIds.length == 0) {
        //   FUI.Window.showMsg2("请选择要导出的记录");
        //   return false;
        // }

        // 导出前置事件
        // var extendFunName = "customDataGrid_exportBeforeEvent";
        // var isExist = Object.toIsExitsFunction(extendFunName);
        // if (isExist) {
        //   var exfunc = eval(extendFunName);
        //   var isPass = exfunc(tableName);
        //   var isPass = exfunc(tableName, selectedIds, selectedRows);
        //   if (isPass === false) {
        //     return false;
        //   }
        // }

        // let parm = Object.toClone(that.tableForm.data);
      let parm = Object.toClone(this.searchParams);
        parm.sort = this.tablePage.sort;
        if(!parm.sort) parm.sort = Object.toTrim(that.dg.SortName)
        parm.order = this.tablePage.order;
        if(!parm.order)parm.order = this.dg.SortOrder;
        parm = Object.extend(parm, this.searchParams);
        var downUrl = "/workflow/security/CommonImport/exportData?type=customDataGrid&tableName="+tableName;
        Object.toAjaxDownloadFile(downUrl, "", JSON.stringify({
          "params":parm,
          "defaultWhere":'',  //this.dg.DefaultWhere
          "isEnableAuthor":true,  //this.dg.IsEnableAuthor
          "selectedId": selectedIds.toString()
        }),true);
    },
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
        var res = Object.toAjaxJson('/workflow/workflowBusiness/', 'getTodoListJson', parm, true, null,
          function (res) {
            if (res.success) {
              that.tableData = res.rows;
              that.tablePage.total = res.total;
              that.tablePage.pageCount = res.pageCount;

              // that.tableData.forEach(item => { 
              //   $(`.window-open[name='${item.workflowId}']`).one('click', function (event) { 
              //     let url = $(this).attr("url")
              //     alert(url);
              //     window.open(url, '_blank');
              //   })
              // })
              
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
        var resData = Object.toAjaxJson(
          FUI.Handlers.WorkflowBusinessHandler,
          'getTodoListCountJson',
          null,
          true,
          null,
          function (resData) {
            that.countData = resData.data;
          },
          null,
          false
        );
      },
      batchApproval() {
        var vm = this;
        var taskIds = FUI.Grid.getGridChecked(vm, 'grid', 'taskId');
        if (!taskIds) {
          FUI.Window.showMsg(vm, '请选择要批量审批的待办');
          return false;
        }
        FUI.Window.openEdit('/workflow/workflowBusiness/bathSendTaskDialog/?taskIds=' + taskIds, "批量审批", 'Edit', null, 850, 450);
      },
      excelExportClick() { 
        var parm = this.searchParams;
        parm.page = this.tablePage.currentPage;
        parm.rows = this.tablePage.pageSize;
        parm.sort = this.tablePage.sort;   
        parm.order = this.tablePage.order; 
        Object.toAjaxDownloadFile('/workflow/workflowExport/', 'exportTodo', parm);
      },
      openWorkflowfromView(appId, formAction, wiid, taskId, title) {
        var that = this;
        var url = __webpath + '/workflow/workflowform/index/?formAction=2&wiid=' + wiid + '&taskId=' + taskId;
        // FUI.Window.openEdit(url, title, 2, 'grid',null, null, null, null, null,true);
        FUI.Window.open(url, '_blank');
      },
    openWorkflowfromMap(wiid, title) {
        openShowWorkflowMap(wiid, title);
      }
    }

  }
</script>
