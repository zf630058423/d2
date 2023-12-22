<template>
  <div class="f2bpm-page-layout">
    <el-container>
      <el-main class="f2bpm-page-right">
        <f2bpm-gridsearchform :tableform="tableForm" @searchformbtnclick="searchFormbtnClick" @updatevalue="updateFieldValue" />
        <f2bpm-datagrid
          ref="grid"
          grid="grid"
          height="full-100"
          :toolbar="tableToolbar"
          :context-menu="{header: {options: headerMenus},className: 'my-menus'}"
          :pager-config="tablePage"
          :data="tableData"
          :columns="tableColumn"
          @cell-dblclick="celldbClick"
@header-contextmenu="contextMenuClickEvent"
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
        busObjectId: '',
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
        // ===========标准区结束==========
         searchParams: {
          // 特殊查询
        }
      }
    },
    computed: {
      countGridHeight() {
        return $(window).height() - global_selector_datagridHeightDiff
      }
    },
     created() {
      var that = this
      that.tablePage.pageSize = 500
      var busObjectId = Object.toQueryString('busObjectId')
      that.busObjectId = busObjectId
      var dg = FUI.DataGrid.Create(that, 'key_selector_BusObjectColumn', null, 'grid', true, true, true)
      dg.SortName = ' CreatedTime '
      dg.SortOrder = 'asc'
      dg.ShowNumbers = true
      dg.ExpansMore = false
      dg.DefaultWhere = " BusObjectId='" + busObjectId + "'"
      dg.OperationAction.ShowEdit = false
      dg.OperationAction.ShowDelete = false
      dg.OperationAfterSaveRowIsRefresh = false
      dg.OperationAction.ShowView = false
      // 工具栏
      dg.ToolBarDefaultButtons.ShowAdd = false
      dg.IsSimpleSearch = true
      dg.ToolBarDefaultButtons.ShowDelete = false
      dg.Bind()
    },
     mounted() {
      window.myvm = this
    },

    methods: {
      collapsedSider() {
        this.isCollapsed = !this.isCollapsed
      },
       closeEdit() {
        FUI.Window.closeEdit()
      },
       pageChange({ currentPage, pageSize }) {
        this.tablePage.currentPage = currentPage
        this.tablePage.pageSize = pageSize
        this.tablePage.startIndex = (currentPage - 1) * pageSize
        this.getGridData()
      },
      // 刷新列表
       refreshGrid(parentGridId, parm) {
        var that = this
        that.dataGridSearch()
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
            that.$message.error(res.msg, { duration: 0 })
          }
        })
      },
       getResult() {
        var that = this
        var columnId = that.dg.getChecked('ColumnId')
        var columnTitle = that.dg.getChecked('ColumnTitle')
        var columnName = that.dg.getChecked('ColumnName')
        var dataType = that.dg.getChecked('DataType')
        var data = {
          columnName: columnName,
          columnId: columnId,
          columnTitle: columnTitle,
          dataType: dataType
        }
        return data
      }
    }
  }
  window.getResult = function() {
    return myvm.getResult()
  }
</script>
