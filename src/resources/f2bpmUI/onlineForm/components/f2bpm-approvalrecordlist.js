import Vue from 'vue';
// 流程审批过程显示组件
var f2bpmApprovalrecordlist = Vue.component('f2bpm-approvalrecordlist', {
  props: ['wiid', 'pagesize'],
  data: function () {
    return {
      tablePage: {
        pageCount: 0,
        sort: 'createdTime asc,TaskSeq', // 排序字段
        order: 'asc', // 排序方向
        startIndex: 0,
        total: 0,
        currentPage: 1,
        pageSize: 100,
        align: 'center',
        pageSizes: [10, 15, 20, 50, 100, 200, 500],
        layout: 'total, sizes, prev, pager, next, jumper'
      },
      loading: false,
      treeData: [],
      tableData: [],
      tableColumn: [
        { type: 'seq', width: 55, title: '序号', align: 'center' },
        {
          field: 'activityName',
          title: '处理节点',
          width: 180,
          align: 'center'
        },
        {
          field: 'realName',
          title: '处理人',
          width: 120,
          align: 'center',
          formatter: function (rec) {
            var realName = Object.toProcSecrecy(rec.realName);
            if (rec.isDelegateDone == true) {
              var deledateActor = rec.delegatorRealName;
              if (deledateActor) {
                deledateActor = Object.toProcSecrecy(deledateActor);
              }
              return realName + '<em>[' + deledateActor + ']代</em>';
            }
            return realName;
          }
        },
        {
          field: 'userDpName',
          title: '处理人部门',
          width: 120,
          align: 'center'
        },
        {
          field: 'createdTime',
          title: '到达时间',
          width: 150,
          align: 'center',
          formatter: function (rec) {
            var value = rec.createdTime;
            if (value == '' || value == null) {
              return '';
            }
            return Object.toJsonDateTimeFormatter(value);
          }
        }, {
          field: 'completedTime',
          title: '完成时间',
          width: 150,
          align: 'center',
          formatter: function (rec) {
            var value = rec.completedTime;
            if (value == '' || value == null) {
              return '';
            }
            return Object.toJsonDateTimeFormatter(value);
          }
        }, {
          field: 'taskState',
          title: '处理状态',
          width: 150,
          align: 'center',
          formatter: function (rec) {
            var text = taskStateFormatter(rec);
            return text;
          }
        },
        {
          field: 'opinion',
          title: '处理意见',
          align: 'center',
          type: 'html',
          formatter: function (rec) {
            var value = rec.opinion;
            if (value == null) { value = ''; }
            var result = '';
            switch (rec.completedType) {
              case 'Invalid':
                result = '<em>【流程作废】</em>';
                break;
              case 'Activation':
                result = '<em>【流程重新激活】</em>';
                break;
              case 'Reject':
                result = '<em>【退回】</em>';
                break;
              case 'Referred':
                result = '<em>【转办】</em>';
                break;
              case 'TaskCommunication':
                result = '【沟通】';
                break;
            }

            if (rec.approAction) {
              result += '【' + rec.approAction + '】';
            }
            if (rec.activityName == '结束' && rec.completedType == 'Approval') {
              return value;
            }
            return result + value;
          }
        }
      ]
    };
  },
  computed: {
    countGridHeight() {
      return 500;
    }
  },
  created: function () {
    var that = this;
    that.tablePage.pageSize = that.pagesize;
    this.getGridData();
  },
  methods: {
    // 刷新列表
    refreshGrid(parentGridId, parm) {
      var that = this;
      that.dataGridSearch();
    },
    dataGridReSet() {
      const that = this;
      this.dataGridSearch();
    },
    dataGridSearch() {
      this.tablePage.currentPage = 1;
      this.tablePage.startIndex = 0;
      this.getGridData();
    },
    getGridData() {
      var that = this;
      var parm = {};
      parm.wiid = that.wiid;

      parm.page = that.tablePage.currentPage;
      parm.rows = that.tablePage.pageSize;
      parm.sort = that.tablePage.sort;
      parm.order = that.tablePage.order;
      var res = Object.toAjaxJson(FUI.Handlers.WorkflowBusinessHandler, 'loadApprovalHistory', parm, true, null, function (res) {
        if (res.success) {
          that.tableData = res.rows;
          console.info(that.tableData);
          that.tablePage.total = res.total;
          that.tablePage.pageCount = res.pageCount;
        } else {
          FUI.Window.showMsg(that, res.msg);
        }
      });
    },
    pageChange({ currentPage, pageSize }) {
      this.tablePage.currentPage = currentPage;
      this.tablePage.pageSize = pageSize;
      this.tablePage.startIndex = (currentPage - 1) * pageSize;
      this.getGridData();
    }

  },
  template: '<f2bpm-datagrid' +
    '   ref="grid"' +
    '  grid="grid"' +
    '   resizable' +
    '  export-config' +
    '   border' +
    '  show-overflow' +
    '  highlight-hover-row' +
    '  :height="countGridHeight"' +
    '  :pager-config="tablePage"' +
    '  :seq-config="{startIndex:tablePage.startIndex}"' +
    '  @page-change="pageChange"' +
    '  rowId="taskId"' +
    '  class="mytable-scrollbar"' +
    '  :loading="loading"' +
    '  :data="tableData"' +
    '  :columns="tableColumn">' +
    '   </f2bpm-datagrid>'
});
