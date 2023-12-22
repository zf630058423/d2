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
  window.WFContext = {};
  export default {
    data() {
      return {
        treeFilterText: '',
        isCollapsed: false,
        wiid: '',
        userId: '',
        tablePage: {
          pageCount: 0,
          sort: 'createdTime', // 排序字段
          order: 'asc', // 排序方向
          startIndex: 0,
          total: 0,
          currentPage: 1,
          pageSize: 100,
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
            field: 'taskId',
            title: '操作',
            width: 120,
            align: 'center',
            slots: {
              default: ({ row, column }, h) => {
                var rec = row;
                const that = this;
                if (row.taskState == 2 && rec.userId == that.userId && rec.activityName != '结束') {
                  return [
                    h(
                      'span',
                      {
                        style: {
                          cursor: 'pointer', color: '#FFFFFF'
                        },
                        class: 'btn btn-primary btn-minier fa fa-edit',
                        on: {
                          click: () => this.appendOpinion(row.taskId, row.activityName)
                        }
                      },
                      '补充意见'
                    )
                  ];
                } else {
                  return [];
                }
              }
            }
          },
          {
            field: 'activityName',
            title: '处理节点',
            width: 120,
            align: 'center'
          },
          {
            field: 'realName',
            title: '处理人',
            width: 150,
            align: 'center',
            formatter: function (rec, col, value) {
              var realName = value;
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
            field: 'opinion',
            title: '处理意见',
            align: 'left',
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
                case 'RejectDirect':
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
          }, {
            field: 'taskState',
            title: '处理状态',
            width: 150,
            type: 'html',
            align: 'center',
            formatter: function (rec, col, value) {
              var text = taskStateFormatter(rec);
              return text;
            }
          },
          {
            field: 'completedTime',
            title: '完成时间',
            width: 150,
            align: 'center',
            formatter: function (rec, col, value) {
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
      that.userId = that.$store.state.user.userId;
      var $opinionWidth = 300;
      var $f2bpmProcSecrecy = false;
      this.getGridData();
    }, mounted() {
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
      pageChange({ currentPage, pageSize }) {
        this.tablePage.currentPage = currentPage;
        this.tablePage.pageSize = pageSize;
        this.tablePage.startIndex = (currentPage - 1) * pageSize;
        this.getGridData();
      },
      appendOpinion(taskId, activityName) {
        var that = this;
        layer.prompt({
          formType: 2,
          btnAlign: 'c',
          title: '[' + activityName + ']补充审批意见',
          value: '',
          yes: function (index, layero) {
            // 获取文本框输入的值
            var value = layero.find('.layui-layer-input').val();
            if (value == '') {
              FUI.Window.showMsg(columnTitle + ',输入不能为空。');
              return false;
            }
            value = '【补充：' + value + '(' + Object.toGetCurrentDateString() + ')】';
            var data = _ajaxJson(FUI.Handlers.WorkflowBusinessHandler, 'saveAppendOpinion', { 'taskId': taskId, 'opinion': value });
            if (data.success) {
              that.refreshGrid();
            } else {
              FUI.Window.showMsg(data.msg);
              return false;
            }
            layer.close(index);
          }

        });
      }
    }

  }
</script>