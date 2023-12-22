<template>
  <div class="f2bpm-page-layout">
    <el-container>
      <el-main class="f2bpm-page-right">
        <f2bpm-gridsearchform :tableform="tableForm" @searchformbtnclick="searchFormbtnClick" @updatevalue="updateFieldValue" />
        <f2bpm-datagrid
          ref="grid"
          grid="grid"
          :toolbar="tableToolbar"
          :context-menu="{header: {options: headerMenus},className: 'my-menus'}"
          :pager-config="tablePage"
          :data="tableData"
          :columns="tableColumn"
          @cell-dblclick="celldbClick"
          @toolbar-button-click="toolbarButtonClickEvent"
@header-contextmenu="contextMenuClickEvent"
          @page-change="pageChange"
          @sort-change="sortChange"
        />
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
        // ==data grid====
        dg: {},
        tablePage: Object.toClone(FUI.DataGridProperty.tablePage),
        loading: false,
        treeData: [],
        tableData: [],
        tableForm: Object.toClone(FUI.DataGridProperty.tableForm),
        tableToolbar: Object.toClone(FUI.DataGridProperty.tableToolbar),
        headerMenus: FUI.DataGridProperty.headerMenus,
        tableColumn: [],
        searchParams: {
          // 特殊查询
        }
      }
    },
    created() {
      var that = this
      window.myvm = that
      var dg = FUI.DataGrid.Create(that, 'f2bpm_sys_application', 'f2bpm_sys_application', 'grid', true, true, true)
      dg.SortName = 'order_no'
      dg.SortOrder = 'asc'
      dg.ShowNumbers = true
      dg.ExpansMore = true
      dg.ToolBarDefaultButtons.ShowDelete = true
      dg.ToolBarDefaultButtons.ShowAdd = true
      dg.OperationAction.ShowView = false
      dg.EnableDblClickEdite = true
      dg.OperationEditEvent = this.myOperationEditEvent
      dg.OperationViewEvent = this.myOperationViewEvent
      dg.OperationCustomButton = this.myOperationCustomButton
      dg.EditUrl = '/workflow/security/application/applicationEdit/'
      dg.EditTitle = '编辑'
      dg.Bind()
    },
     mounted() {
      window.myvm = this
    },

    methods: {
      collapsedSider() {
        this.isCollapsed = !this.isCollapsed
      },
      filterTreeNode(value, data) {
        if (!value) return true
        return data.title.indexOf(value) !== -1
      },
      refreshTree() {
        var that = this
      },
      // 刷新列表
      refreshGrid(parentGridId, parm) {
        var that = this
        that.dataGridSearch()
      },
       showAll() {
        this.dataGridSearch()
      },
      onTreeSelected(data, treeNode, thisObj) {
        var that = this
        var id = treeNode.data.id
        this.searchParams.xxxxx = id
        that.dataGridSearch()
      },
      dataGridReSet() {
        var that = this
        $.each(this.searchParams, function(key, item) {
          that.searchParams[key] = ''
        })
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
        Object.toAjaxJson(that.dg.GetUrl(), null, parm, true, null, function(
          res
        ) {
          if (res.success) {
            that.tableData = res.rows
            that.tablePage.total = res.total
            that.tablePage.pageCount = res.pageCount
          } else {
            FUI.Window.showMsg(res.msg)
          }
        })
      },
      myOperationViewEvent(value, row, index) {
        this.showDialogEdit(FUI.FormAction.View, row[this.dg.IdField])
      },
      myOperationEditEvent(value, row, index) {
        this.showDialogEdit(FUI.FormAction.Edit, row[this.dg.IdField])
      },
      showDialogEdit(formAction, keyId) {
        var that = this
        var title = formAction == FUI.FormAction.Add ? '新增' + that.dg.EditTitle : '编辑' + that.dg.EditTitle
        FUI.Window.openEdit(that.dg.EditUrl, title, formAction, that.dg.GridId, 700, 550, null, that.dg.MainTable, keyId)
      },
      // 工具栏按钮
      myToolBarCustomButton() {
        var btns = []
        // btns.push({code: 'closeEdit', status: 'primary', name: '关闭', icon: 'fa fa-close'});
        return btns
      },
      // 工具栏按钮事件
      toolbarButtonClickEvent({ btn }, event) {
        const code = btn.code
        console.info(code)
        const that = this
        if (code == 'closeEdit') {
          FUI.Window.closeEdit()
        } else if (code == 'default.add') {
          that.showDialogEdit(FUI.FormAction.Add, '')
        } else if (code == 'default.delete') {
          // 批量删除，默认执行FUI内部的删除，如有需要可用成自己的删除方法
          that.dg.ToolBarBathDelete(that)
        } else {
          var fn = that[code]
          fn()
        }
      },
      // 操作列自定义按钮
      myOperationCustomButton(h, value, row, index) {
        var that = this
        var custBtns = []
        var item = { index: 41, title: '应用项列表', tip: '应用项列表', class: 'fa fa-list', code: 'applicationlinklist', click: () => this.applicationlinklist(value, row, index) }

        custBtns.push(item)
        return custBtns
      },
       iconfaformatter(row, column, value, index) {
        return "<i class='" + value + "'></i>"
      },
       applicationlinklist(value, row, index) {
        var that = this
        var applicationId = row.applicationId
        var applicationName = row.applicationName
        var url = '/workflow/security/application/applicationLinkList/?applicationId=' + applicationId
        FUI.Window.openEdit(url, applicationName + '的应用项', 'Edit', null, 800, 500, null, null, '', true)
      }
    }
  }
</script>
