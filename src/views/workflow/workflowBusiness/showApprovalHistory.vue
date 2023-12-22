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
          sort: 'createdTime asc,TaskSeq', // 排序字段
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
            title: this.$t('approvalHistory.activityName'),
            width: 180,
            align: 'center'
          },
          {
            field: 'realName',
            title: this.$t('approvalHistory.realName'),
            width: 120,
            align: 'center',
            formatter: function (rec) {
              var realName = Object.toProcSecrecy(rec.realName);
              var deledateActor = rec.delegatorRealName; // rec.isDelegateDone == true
              if (deledateActor) {
                deledateActor = Object.toProcSecrecy(deledateActor);
                return realName + '<em>[' + deledateActor + ']代</em>';
              }
              return realName;
            }
          },
          {
            field: 'userDpName',
            title: this.$t('approvalHistory.userDpName'),
            width: 120,
            align: 'center'
          }
          ,
          {
            field: 'opinion',
            title: this.$t('approvalHistory.opinion'),
            align: 'left',
            width: 250,
            type: 'html',
            formatter: function (rec) {
              var value = rec.opinion || "";
              var result = '';
              let arr = ['提单','结束'];
              if (!rec.completedType && rec.taskCreateType == 'TaskCommunication') {
                result = '<em>【被沟通】</em>';
                return result;
              }
              switch (rec.completedType) {
                case 'Invalid':
                  result = '<em>【流程作废】</em>';
                  break;
                case 'Activation':
                  result = '<em>【流程重新激活】</em>';
                  break;
                case 'Reject':
                case 'RejectDirect':
                  result = '<em>【驳回】</em>';
                  break;
                case 'RejectMainWorkflow':
                  result = '<em>【驳回】</em>';
                  break;
                case 'Referred':
                  result = '<em>【转办】</em>';
                  break;
                case 'AutoApproval':
                  result = '<em>【自动通过】</em>';
                  break;
                case 'TaskCommunication':
                  result = '<em>【被沟通】</em>';
                  break;
                // default:
                //   result = !arr.includes(rec.activityName) ? '<em>【同意】</em>' : '';   //提单和结束环节不包含同意
                //   break;
              }
              if (rec.approAction) {
                result += '【' + rec.approAction + '】';
              }

              return result + value;

              // if(result.includes("转办")){
              //   return result;
              // }else{
              //   if(rec.activityName === '提单'){
              //     value = value !== '同意' ? value : '';
              //   }
              //   let res = result + value;
              //   return res.includes("同意") ? '<em>【同意】</em>' : res;
              // }
            }
          }, {
            field: 'taskState',
            title: this.$t('approvalHistory.taskState'),
            width: 150,
            align: 'center',
            formatter: function (rec) {
              var text = taskStateFormatter(rec);
              return text;
            }
          }

          ,
          {
            field: 'createdTime',
            title: this.$t('approvalHistory.createdTime'),
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
            title: this.$t('approvalHistory.completedTime'),
            width: 150,
            align: 'center',
            formatter: function (rec) {
              var value = rec.completedTime;
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
        return $(document).height() - 10;
      }
    },
    created() {
      var that = this;
      that.language = that.$store.state.app.language;
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
        var res = Object.toAjaxJson(FUI.Handlers.WorkflowBusinessHandler, 'loadApprovalHistory', parm, true, null, function (res) {
          if (res.success) {
            that.tableData = res.rows;
            that.tablePage.total = res.total;
            that.tablePage.pageCount = res.pageCount;
          } else {
            FUI.Window.showMsg(that, res.msg);
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
      }

    }
  }
</script>
