<template>
  <div class="f2bpm-page-layout">
    <el-container>
      <el-main class="f2bpm-page-right">

        <f2bpm-datagrid
          ref="grid"
          grid="grid"
          :pager-config="tablePage"
          height="full-80"
          :data="tableData"
          :columns="tableColumn"
          @page-change="pageChange"
          @sort-change="sortChange"
        />
      </el-main>
    </el-container>
  </div>
</template>

<script>
  export default { data() {
      return {
        // ======stand:标准区=============
        currCategoryCode: '',
        treeFilterText: '',
        expansMore: true,
        isCollapsed: false,
        modalparams: {
          appId: '',
          wiid: '',
          taskId: '',
          formAction: ''
        },
         modal: {
          currEditModal: '',

          title: '',
          width: 'auto',
          modalEdit: false,
          loading: false,
          draggable: true
        },
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
          AppId: '',
          InCategoryCode: '',
          Urgency: '',
          CurrentActivityName: '',
          SheetId: '',
          CreatorRealName: '',
          WorkflowInstanceState: '',
          StartTime: '',
          EndTime: '',

          filterType: 'all'
        },
        tablePage: {
          pageCount: 0,
          sort: 'createdTime', // 排序字段
          order: 'desc', // 排序方向

          startIndex: 0,
          total: 0,
          currentPage: 1,
          pageSize: 10,
          align: 'center',
          pageSizes: [10, 20, 50, 100, 200, 500],
          layouts: ['Sizes', 'PrevJump', 'PrevPage', 'Number', 'NextPage', 'NextJump', 'FullJump', 'Total'],
          perfect: true
        },
        loading: false,
        treeData: [],
        tableData: [],
        tableColumn: [
          { type: 'seq', width: 55, title: '序号', align: 'center', fixed: 'left' },
          { type: 'checkbox', width: 35, align: 'center', fixed: 'left' },
          {
            field: 'action',
            title: '操作',
            width: 220,
            sort: true,
            align: 'left',
            type: 'html',
            slots: {
              default: ({ row, column }, h) => {
                const that = this
                return [
                  h('span', {
                    style: {
                      cursor: 'pointer'
                    },
                    on: {
                      click: () => that.downFileLog(row.fileName)

                    }
                  }, row.sheetId)
                ]
              }
            }
          },
          {
            field: 'fileName',
            title: '文件名',
            align: 'left',
            type: 'html'
          }, {
            field: 'length',
            title: '文件大小',
            width: 180,
            align: 'center',
            formatter: function(parms) {
              var rec = parms.row
              return rec.length / 1000 + ' MB'
            }
          },
          {
            field: 'CreateTime',
            title: '创建时间',
            width: 180,
            align: 'center'
          }
        ]
      }
    }, computed: {
      countGridHeight() {
        var h = $(document).height() - 145
        return h
      },
       rotateIcon() {
        return this.isCollapsed ? 'fa fa-angle-double-right cur   font13' : 'fa fa-angle-double-left cur   font13'
      }
    },
    watch: {
      treeFilterText(val) {
        this.$refs.mytree.filter(val)
      }
    },
    created() {
      this.loadTree()
      this.getGridData()
    },
     mounted() {
      window.myvm = this
    },
    methods: {
      closeEdit() {
        this.modal.modalEdit = false
        this.modal.currEditModal = ''
        this.modal.title = ''
      },
       dateFormatter(obj) {
        var rec = obj.row
        var cellValue = obj.cellValue
        var value = rec.createdTime
        if (value == '' || value == null) {
          return ''
        }
        var text = Object.toJsonDateTimeFormatter(value)
        return text
      },
       collapsedSider() {
        this.isCollapsed = !this.isCollapsed
      },
       onTreeSelected(data, treeNode, thisObj) {
        var ids = []
        var childs = treeNode.childNodes
        ids.push(treeNode.data.id)
        $.each(childs, function(index, item) {
          ids.push(item.data.id)
          if (item.childNodes) {
            var childs2 = item.childNodes
            $.each(childs2, function(index2, item2) {
              ids.push(item2.data.id)
            })
          }
        })
        this.searchParams.InCategoryCode = ids.toString()
        this.dataGridSearch()
      },
      showAll() {
        this.searchParams.InCategoryCode = ''
        this.dataGridSearch()
      },
       filterTreeNode(value, data) {
        if (!value) return true
        return data.title.indexOf(value) !== -1
      },
       loadTree() {
        var that = this
        var treeUrl = FUI.Handlers.CategoryHandler + '?groupKey=WorkflowGroup'
        Object.toAjaxJson(treeUrl, null, null, true, null, function(res) {
          if (res.success) {
            that.treeData = res.data
            var msg = res.msg
          } else {
            FUI.Window.showMsg(that,res.msg);
          }
        })
      },
      refreshGrid() {
        this.dataGridSearch()
      },
       dataGridReSet() {
        const that = this
        // 重置查询
        $.each(this.searchParams, function(key, item) {
          if (key != 'filterType') {
            that.searchParams[key] = ''
          }
        })
        this.dataGridSearch()
      },
       dataGridSearch() {
        this.searchParams.StartTime = this.searchParams.StartTime && !Object.toIsDateStr(this.searchParams.StartTime) ? Object.toDateObjectFormat(this.searchParams.StartTime) : this.searchParams.StartTime
        this.searchParams.EndTime = this.searchParams.EndTime && !Object.toIsDateStr(this.searchParams.EndTime) ? Object.toDateObjectFormat(this.searchParams.EndTime) : this.searchParams.EndTime
        if (this.searchParams.EndTime && this.searchParams.StartTime) {
          var start = this.searchParams.StartTime
          var endTime = this.searchParams.EndTime
          const n = Object.toGetDateDiff(start, endTime, 'second')
          if (n < 0) {
            FUI.Window.showMsg2(this, '发起“截止时间”不能小于“开始时间”')
            return
          }
        }
        this.tablePage.currentPage = 1
        this.tablePage.startIndex = 0
        this.getGridData()
      },
      getGridData() {
        var that = this
        var parm = that.searchParams
        parm.page = that.tablePage.currentPage
        parm.rows = that.tablePage.pageSize
        parm.sort = that.tablePage.sort
        parm.order = that.tablePage.order
        var res = Object.toAjaxJson('/workflow/security/systemss/', 'loadLogFileList', parm, true, null, function(res) {
          if (res.success) {
            that.tableData = res.rows
            that.tablePage.total = res.total
            that.tablePage.pageCount = res.pageCount
          } else {
            FUI.Window.showMsg(res.msg)
          }
        })
      },
       sortChange({ column, field, order }) {
        this.tablePage.sort = field
        this.tablePage.order = order
        this.tablePage.currentPage = 1
        this.getGridData()
      },
       pageChange({ currentPage, pageSize }) {
        this.tablePage.currentPage = currentPage
        this.tablePage.pageSize = pageSize
        this.tablePage.startIndex = (currentPage - 1) * pageSize
        this.getGridData()
      },
      changeList(filterType) {
        this.searchParams.filterType = filterType
        this.dataGridSearch()
      },
       downFileLog(fileName) {
        Object.toAjaxDownloadFile(urlManage, 'downloadFileLog', {
          keyId: fileName
        })
      }
    }

  }
</script>
