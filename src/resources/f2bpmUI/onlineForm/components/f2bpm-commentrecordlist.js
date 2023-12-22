import Vue from 'vue';
// 流程评论显示组件
var f2bpmCommentrecordlist = Vue.component('f2bpm-commentrecordlist', {
  props: ['wiid', 'isedit', 'pagesize'],
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
          field: 'message',
          title: '内容',
          align: 'center',
          type: 'html'
        },
        {
          field: 'creator',
          title: '评论者',
          width: 120,
          align: 'center'
        },
        {
          field: 'createdTime',
          title: '评论时间',
          width: 150,
          align: 'center',
          formatter: function (rec, col, value) {
            var value = rec.createdTime;
            if (value == '' || value == null) {
              return '';
            }
            return Object.toJsonDateTimeFormatter(value);
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
      var res = Object.toAjaxJson(FUI.Handlers.WorkflowBusinessHandler, 'loadProcessInstanceComment', parm, true, null, function (res) {
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
