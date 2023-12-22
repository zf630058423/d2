<template>
  <div class="f2bpm-page-layout">
    <el-container>
      <el-main class="f2bpm-page-right">
        <f2bpm-datagrid ref="grid" grid="grid" height="full-50" :pager-config="tablePage" :data="tableData" :columns="tableColumn" @page-change="pageChange" />
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
        wiid: '',
        tablePage: {
          pageCount: 0,
          sort: 'createdTime', // 排序字段
          order: 'asc', // 排序方向
          startIndex: 0,
          total: 0,
          currentPage: 1,
          pageSize: 500,
          align: 'center',
          pageSizes: [10, 20, 50, 100, 200, 500],
          layout: 'total, sizes, prev, pager, next, jumper',
          perfect: true
        },
        loading: false,
        treeData: [],
        tableData: [],
        tableColumn: [
          { type: 'seq', width: 55, title: '序号', align: 'center' },
          {
            field: 'activityName',
            title: this.$t('wfgrid.cirNode'),
            width: 180,
            align: 'center'
          },
          {
            field: 'fromCreator',
            title: this.$t('wfgrid.circulator'),
            width: 120,
            align: 'center',
            formatter: function (rec, col, value) {
              return Object.toProcSecrecy(rec.fromCreator);
            }
          },
          {
            field: 'realName',
            title: this.$t('wfgrid.cirToUser'),
            width: 120,
            align: 'center',
            formatter: function (rec, col, value) {
              var depName = rec.userDpName == null ? '' : '(' + rec.userDpName + ')';
              return Object.toProcSecrecy(rec.realName) + depName;
            }
          },
          {
            field: 'createdTime',
            title: this.$t('wfgrid.cirCreatedTime'),
            width: 150,
            align: 'center',
            formatter: function (rec, col, value) {
              var value = rec.createdTime;
              if (value == '' || value == null) {
                return '';
              }
              return Object.toJsonDateTimeFormatter(value);
            }
          }, {
            field: 'completedTime',
            title: this.$t('wfgrid.cirCompletedTime'),
            width: 150,
            align: 'center',
            formatter: function (rec, col, value) {
              var value = rec.completedTime;
              if (value == '' || value == null) {
                return '';
              }
              return Object.toJsonDateTimeFormatter(value);
            }
          }, {
            field: 'taskState',
            title: this.$t('wfgrid.thetaskState'),
            width: 150,
            type: 'html',
            align: 'center',
            formatter: function (rec, col, value) {
              var text = taskStateFormatter(rec);
              return text;
            }
          },
          {
            field: 'opinion',
            title:  this.$t('approvalHistory.opinion'),
            align: 'center',
            type: 'html',
            width: 250,
            formatter: function (rec, col, value) {
              value=value||"";
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
              return result + value;
            }
          }
        ]
      };
    },
    computed: {
      countGridHeight() {
        return $(document).height() - 10;
      }
    },
    created() {
      var that = this;
      that.language =  that.$store.state.app.language;
      that.wiid = Object.toQueryString('wiid');
      this.getGridData();
    },
    mounted() {
      window.myvm = this;
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

    }
  }
</script>
