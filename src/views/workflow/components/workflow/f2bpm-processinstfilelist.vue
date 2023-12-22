<template>
  <f2bpm-datagrid
    ref="grid"
    grid="grid"
    resizable
    export-config
    border
    show-overflow
    highlight-hover-row
    :height="countGridHeight"
    :pager-config="tablePage"
:seq-config="{startIndex:tablePage.startIndex}"
    row-id="taskId"
    class="mytable-scrollbar"
    :loading="loading"
    :data="tableData"
    :columns="tableColumn"
    @page-change="pageChange"
  />
</template>
<script>
  export default {
    name: 'F2bpmProcessinstfilelist',
    props: ['wiid', 'isedit', 'pagesize'],
    data: function() {
      return {
        tablePage: {
          pageCount: 0,
          sort: 'createdTime',
          order: 'asc',
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
            field: 'fileName',
            title: '附件名称',
            width: 350,
            align: 'center',
            formatter: function(rec) {
              var value = rec.fileName
              return value
            }
          }, {
            field: 'fileSize',
            title: '大小',
            width: 120,
            align: 'center',
            formatter: function(rec) {
              var value = rec.fileSize
              var newValue = value / 1024
              /*  if (newValue < 1024) {
                 return Object.toDecimal(newValue, 2) + "KB";
               } else { */
              newValue = newValue / 1024
              return Object.toDecimal(newValue, 2) + 'MB'
              /* } */
            }
          }, {
            field: 'creator',
            title: '上传者',
            width: 150,
            align: 'center'
          }, {
            field: 'createdTime',
            title: '上传时间',
            width: 180,
            align: 'center',
            templet: function(rec) {
              var value = rec.createdTime
              if (value == '' || value == null) {
                return ''
              }
              return Object.toJsonDateTimeFormatter(value)
            }
          }, {
            field: 'activityName',
            title: '上传所在节点',
            width: 150,
            align: 'center'
          }, {
            field: 'remark',
            title: '备注',
            width: 150,
            align: 'center',
            width: 150
          }, {
            field: 'action',
            title: '操作',
            align: 'center',
            slots: {
              default: ({ row, column }, h) => {
                const that = this
                var btns = []
                var item2 = [
                  h(
                    'span',
                    {
                      style: {
                        cursor: 'pointer', color: '#409eff'
                      },
                      class: 'fa fa-download cur ml10 mr10',
                      on: {
                        click: () => this.downloadProcessInstFile(row.fileId, row.fileName)
                      }
                    },
                    '下载'
                  )
                ]
                btns.push(item2)
                if (WFContext.CurrentUserId == row.creatorId && WFContext.WorkflowformAction <= 2 && WFContext.CurrentActivityName == row.activityName) {
                  var item = [
                    h(
                      'span',
                      {
                        style: {
                          cursor: 'pointer', color: '#409eff'
                        },
                        class: 'fa fa-trash-o cur ml10 mr10',
                        on: {
                          click: () => this.deleteAttachmentList(row.fileId, row.fileName)
                        }
                      },
                      '删除'
                    )
                  ]
                  btns.push(item)
                }
                return btns
              }
            }

          }
        ]
      }
    },
    computed: {
      countGridHeight() {
        return 300
      }
    },
    created: function() {
      var that = this
      that.tablePage.pageSize = that.pagesize
      this.getGridData()
    },

    methods: {
      // 刷新列表
      refreshGrid(parentGridId, parm) {
        var that = this
        that.dataGridSearch()
      },
       dataGridReSet() {
        const that = this
        this.dataGridSearch()
      },
       dataGridSearch() {
        this.tablePage.currentPage = 1
        this.tablePage.startIndex = 0
        this.getGridData()
      },
       getGridData() {
        var that = this
        var parm = {}
        parm.wiid = that.wiid
        parm.page = that.tablePage.currentPage
        parm.rows = that.tablePage.pageSize
        parm.sort = that.tablePage.sort
        parm.order = that.tablePage.order
        var res = Object.toAjaxJson(FUI.Handlers.WorkflowBusinessHandler, 'loadProcessInstFiles', parm, true, null, function(res) {
          if (res.success) {
            that.tableData = res.rows
            that.tablePage.total = res.total
            that.tablePage.pageCount = res.pageCount
          } else {
            FUI.Window.showMsg(that, res.msg)
          }
        })
      },
       pageChange({ currentPage, pageSize }) {
        this.tablePage.currentPage = currentPage
        this.tablePage.pageSize = pageSize
        this.tablePage.startIndex = (currentPage - 1) * pageSize
        this.getGridData()
      },
       deleteAttachmentList(fileId, fileName) {
        var that = this
        var msg = '您确定要删除：【' + fileName + '】？'
        FUI.Window.confirm(that, msg, null, function() {
          var data = Object.toAjaxDownloadFile('/workflow/workflowBusiness/', 'attachmentDelete', {
            keyId: fileId
          })
          that.dataGridSearch()
        })
      },
       downloadProcessInstFile(fileId, fileName) {
        var that = this
        var data = Object.toAjaxDownloadFile('/workflow/workflowBusiness/', 'downloadProcessInstFile', {
          keyId: fileId
        })
        return false
      }
    }
  }
</script>
