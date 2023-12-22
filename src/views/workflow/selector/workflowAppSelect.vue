<template>
  <div class="f2bpm-page-layout">

    <el-container>
      <el-main class="f2bpm-page-right" style="overflow: hidden">
        <f2bpm-gridsearchform @expandclick="expandClick" :tableform="tableForm" @searchformbtnclick="searchFormbtnClick" @updatevalue="updateFieldValue" />
        <f2bpm-datagrid
          ref="grid"
          grid="grid"
          height="full-110"
          :expand-search="expandSearch"
          :context-menu="{header: {options: headerMenus},className: 'my-menus'}"
          :pager-config="tablePage"
@checkbox-all="selectAllEvent" :data="tableData" :columns="tableColumn" @checkbox-change="selectChangeEvent" @radio-change="selectChangeEvent"
          @header-contextmenu="contextMenuClickEvent"
          @page-change="pageChange"
          @sort-change="sortChange"
        />
      </el-main>
      <el-aside ref="sideRight" class="f2bpm-selector-page-right" width="180px">
        <f2bpm-datagrid ref="gridResult" grid="gridResult" height="full-10" :data="resultGridData" :columns="resultGridColumn" />
      </el-aside>
    </el-container>

  </div>
</template>

<script>
  export default { data() {
      return {
        expandSearch: "",
        windowparms: { resultFieldKey: 'AppId', singleSelect: true, data: [] },
        // ======stand:标准区=============
        treeFilterText: '',
        isCollapsed: false,
        // ==data grid====
        dg: {},
        tablePage: Object.toClone(FUI.DataGridProperty.tablePage),
        loading: false,
        treeData: [],
        tableData: [],
        tableForm: Object.toClone(FUI.DataGridProperty.tableForm),
        tableToolbar: Object.toClone(FUI.DataGridProperty.tableToolbar),
        headerMenus: Object.toClone(FUI.DataGridProperty.headerMenus),
        tableColumn: [],

        // =======选择结果Grid===========
         resultGridData: [],
         resultGridColumn: [{
          field: 'AppId',
          title: 'AppId',
          hidden: true,
          align: 'center'
        }, {
          field: 'AppName',
          title: '名称',
          align: 'center'
        }, {
          field: 'action',
          title: '操作',
          width: 50,
          type: 'html',
          slots: {
            // 使用 JSX 渲染函数
            default: ({ row, column }, h) => {
              return [
                h('button', {
                  attrs: { title: '删除' },
                   class: 'btn btn-minier btn-grey mr2 fa fa-trash',
                   on: {
                    click: () => this.delRow(row[this.windowparms.resultFieldKey])
                  }
                }, '')]
            }
          }
        }],
        // ===========标准区结束==========
         searchParams: {
          // 特殊查询
          AppCategoryID: ''
        }
      }
    }, computed: {
      countGridHeight() {
        return $(window).height() - global_selector_datagridHeightDiff
      },
       rotateIcon() {
        return this.isCollapsed ? 'fa fa-angle-double-right' : 'fa fa-angle-double-left'
      }
    },
    watch: {
      treeFilterText(val) {
        this.$refs.mytree.filter(val)
      }
    },
     created() {
      var $vm = this
      var that = this
      $vm.loadWindowparms()
      var dg = FUI.DataGrid.Create($vm, 'key_selector_ProcessApp', null, 'grid', true, true, true)
      dg.SortName = 'AppId'
      dg.SortOrder = 'desc'
      dg.IsSimpleSearch = true
      dg.SingleSelect = $vm.windowparms.singleSelect
      // 是否开启双击编辑
      dg.EnableDblClickEdite = false
      dg.OperationAction.ShowView = false
      dg.OperationAction.ShowEdit = false
      dg.OperationAction.ShowDelete = false
      // 工具栏
      dg.ToolBarDefaultButtons.ShowAdd = false
      dg.ToolBarDefaultButtons.ShowDelete = false
      dg.IsSimpleSearch = true
      dg.Bind()
      this.loadTree()
    },
     mounted() {
      window.myvm = this
    },

    methods: {
      collapsedSider() {
        this.isCollapsed = !this.isCollapsed
      },
       loadWindowparms() {
        const that = this
        var parmsStr = Object.toQueryString('parms')
        var parms = {}
        if (parmsStr) {
          parmsStr = decodeURIComponent(parmsStr)
          parms = eval('(' + parmsStr + ')')
        }
        if (parms) {
          if (parms.data != undefined && parms.data.length > 0) {
            that.resultGridData = parms.data
          }
          if (parms.singleSelect != undefined) {
            that.windowparms.singleSelect = parms.singleSelect
          }
          if (parms.resultFieldKey != undefined) {
            that.windowparms.resultFieldKey = parms.resultFieldKey
          }
          if (parms.needRoot != undefined) {
            that.windowparms.needRoot = parms.needRoot
          }
          if (parms.ismultilevelAuthorize == true || parms.ismultilevelAuthorize == 'true') {
            that.ismultilevelAuthorize = true
          }
        }
      },
       pageChange({ currentPage, pageSize }) {
        this.tablePage.currentPage = currentPage
        this.tablePage.pageSize = pageSize
        this.tablePage.startIndex = (currentPage - 1) * pageSize
        this.getGridData()
      },
       onTreeSelected(data, treeNode, thisObj) {
        var currCategoryCode = treeNode.data.id
        this.searchParams.AppCategoryID = currCategoryCode
        this.dataGridSearch()
      },
      showAll() {
        this.searchParams.AppCategoryID = ''
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
            FUI.Window.showMsg(that,res.msg)
          }
        })
      },
       dataGridReSet() {
        var that = this
        $.each(this.searchParams, function(key, item) {
          that.searchParams[key] = ''
        })
        that.searchParams.historyVersion = 'false'
        // 重置查询
        this.dataGridSearch()
      },
      // 刷新列表
       refreshGrid(parentGridId, parm) {
        var that = this
        that.dataGridSearch()
      },
       dataGridSearch() {
        this.tablePage.currentPage = 1
        this.tablePage.startIndex = 0
        this.getGridData()
      },
       getGridData() {
        const that = this
        let parm = Object.toClone(that.tableForm.data)
        parm.page = that.tablePage.currentPage
        parm.rows = that.tablePage.pageSize
        parm.sort = that.tablePage.sort
        parm.order = that.tablePage.order
        parm = Object.extend(parm, that.searchParams)
        Object.toAjaxJson(that.dg.GetUrl(), null, parm, true, null, function(res) {
          if (res.success) {
            that.tableData = res.rows
            that.tablePage.total = res.total
            that.tablePage.pageCount = res.pageCount
          } else {
            FUI.Window.showMsg(that,res.msg)
          }
        })
      },
      // stand:选对结果区==================
       selectAllEvent(obj) {
        const that = this
        const rows = obj.selection
        const checked = obj.checked
        var keyId = that.windowparms.resultFieldKey
        $.each(rows, function(i, item) {
          if (checked) {
            that.addSelectRow(item)
          } else {
            that.delRow(item[keyId])
          }
        })
      },
      selectChangeEvent(obj) {
        const that = this
        const keyId = that.windowparms.resultFieldKey
        let checked = obj.checked
        if (checked == undefined) {
          checked = true
        }
        const selectedRow = obj.row
        if (checked) {
          that.addSelectRow(selectedRow)
        } else {
          that.delRow(selectedRow[keyId])
        }
      },
       addSelectRow(row) {
        const that = this
        const keyId = that.windowparms.resultFieldKey;
        if (that.windowparms.singleSelect) {
          const tem = []
          tem.push(row)
          that.resultGridData = tem
        } else {
          let isExist = false
          $.each(that.resultGridData, function(i, item) {
            if (item[keyId] == row[keyId]) {
              isExist = true
            }
          })
          if (isExist === false) {
            that.resultGridData.push(row)
          }
        }
      },
       delRow(delKeyId) {
        const that = this
        const keyId = that.windowparms.resultFieldKey
        var tem = []
        $.each(that.resultGridData, function(i, item) {
          if (item[keyId] != delKeyId) {
            tem.push(item)
          }
        })
        that.resultGridData = tem
      },
       getResult() {
        return this.resultGridData
      }
    }

  }

  window.getResult = function() {
    return myvm.getResult()
  }
</script>
