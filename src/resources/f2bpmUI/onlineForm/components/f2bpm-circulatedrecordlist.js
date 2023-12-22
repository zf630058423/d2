import Vue from 'vue';
// 传阅过程显示组件
var f2bpmCirculatedrecordlist = Vue.component('f2bpm-circulatedrecordlist', {
  props: ['wiid', 'pagesize'],
  data: function () {
    return {
      tablePage: {
        pageCount: 0,
        sort: 'createdTime', // 排序字段
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
          title: '传阅所在环节',
          width: 180,
          align: 'center'
        },
        {
          field: 'fromCreator',
          title: '传阅者',
          width: 120,
          align: 'center',
          formatter: function (rec) {
            return Object.toProcSecrecy(rec.fromCreator);
          }
        },
        {
          field: 'realName',
          title: '传阅到',
          width: 120,
          align: 'center',
          formatter: function (rec) {
            var depName = rec.userDpName == null ? '' : '(' + rec.userDpName + ')';
            return Object.toProcSecrecy(rec.realName) + depName;
          }
        },
        {
          field: 'createdTime',
          title: '传阅时间',
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
          title: '审阅时间',
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
          type: 'html',
          align: 'center',
          formatter: function (rec) {
            var text = taskStateFormatter(rec);
            return text;
          }
        },
        {
          field: 'opinion',
          title: '传阅留言',
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
      return 300;
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
      var res = Object.toAjaxJson(FUI.Handlers.WorkflowBusinessHandler, 'loadCirculatedHistory', parm, true, null, function (res) {
        if (res.success) {
          that.tableData = res.rows;
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
