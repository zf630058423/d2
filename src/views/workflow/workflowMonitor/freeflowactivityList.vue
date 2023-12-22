<template>
  <div class="f2bpm-page-layout">
    <el-container>
      <el-main class="f2bpm-page-right">
        <div>
          <f2bpm-datagrid ref="grid" :show-checkbox="false" :show-seq="true" height="full-190" grid="grid" :pager-config="tablePage" :data="tableData" :columns="tableColumn" @page-change="pageChange" @sort-change="sortChange" />
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script>
  export default {
    data() {
      return {

        searchParams: {

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
            field: 'workflowInstanceId',
            title: '操作',
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
                      click: () => this.editFlowActivityList(row.workflowInstanceId, row.sheetId)
                    }
                  }, row.sheetId)
                ];
              }
            }
          },
          {
            field: 'orderNum',
            title: '排序',
            width: 220
          },
          {
            field: 'activityName',
            title: '节点名称',
            width: 160

          }, {
            field: 'respondType',
            title: '响应方式',
            width: 180,
            formatter: function (row, column, value, index) {
              return rec.respondType == 'anyone' ? '任一人' : '全部人';
            }
          },
          {
            field: 'actors',
            title: '参与者',
            type: 'html',
            width: 100,
            sort: true,
            align: 'center',
            formatter: function (row, column, value, index) {
              if (value == '') { return ''; }
              var users = '';
              var json = eval('(' + value + ')');
              $.each(json, function (i, item) {
                users += "<span class='owner-span'>" + item.text + '</span>';
              });
              return users;
            }
          },
          {
            field: 'createRealName',
            title: '创建人',
            width: 120,
            align: 'center'
          }, {
            field: 'createdTime',
            title: '创建时间',
            width: 160,
            align: 'center'
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
    },
    methods: {
      collapsedSider() {
        this.isCollapsed = !this.isCollapsed;
      },
      // 刷新列表
      refreshGrid(parentGridId, parm) {
        var that = this;
        that.dataGridSearch();
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
        var res = Object.toAjaxJson(FUI.Handlers.WorkflowBusinessHandler, 'getListFreeflowactivityJson', parm, true, null, function (res) {
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
      editFlowActivityList(wiid, sheetId) {
        var url = __webpath + '/workflow/workflowMonitor/freeflowactivityList/?wiid=' + wiid;
        FUI.Window.openEdit(url, '编辑' + sheetId + '的自定义流节点', 'Edit', null, 850, 520, null, null, null, true);
      },
      openWorkflowfromView(appId, formAction, wiid, workflowTitle) {
        var that = this;
        openWorkflowfromView(this, appId, wiid, workflowTitle);
      }
    }

  }
</script>