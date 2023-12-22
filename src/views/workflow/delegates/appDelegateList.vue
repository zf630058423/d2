<template>
  <div class="f2bpm-page-layout">
    <el-container>
      <el-main class="f2bpm-page-right">
        <f2bpm-gridsearchform :tableform="tableForm" @expandclick="expandClick" @searchformbtnclick="searchFormbtnClick" @updatevalue="updateFieldValue" />
        <f2bpm-datagrid
        :expand-search="expandSearch"
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

export default { data() {
    return {
      expandSearch: "",
      treeFilterText: '',
      // ======stand:标准区=============
      isCollapsed: false,
       modalparams: {
        keyId: '',
        formAction: '',
        mainTable: '',
        parentGridId: 'grid'
      },
       modal: {
        currEditModal: '',
        title: '',
        width: 'auto',
        modalEdit: false,
        loading: false,
        draggable: true
      },
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
  }, computed: {
    countGridHeight() {
      return $(document).height() - global_datagridHeightDiff
    },
     rotateIcon() {
      return this.isCollapsed ? 'fa fa-angle-double-right' : 'fa fa-angle-double-left'
    },
    positionIcon() {
      return this.isCollapsed ? 'cursor:pointer; position: relative;left: -5px;' : 'cursor:pointer; position: relative;left: 100px;'
    }
  },
  watch: {
    treeFilterText(val) {
      this.$refs.mytree.filter(val)
    }
  },
   created() {
    const $vm = this
    const currUserId = FUI.Sys.getAuthor().userId
    const dg = FUI.DataGrid.Create($vm, 'f2bpm_AppDelegate', 'f2bpm_AppDelegate', 'grid', true, true, true)
    dg.SortName = 'CreatedTime'
    dg.SortOrder = 'Desc'
    dg.ShowNumbers = true
    dg.DefaultWhere = Object.toStringFormat("UserId='{0}'", currUserId)
    dg.ToolBarDefaultButtons.ShowDelete = true
    dg.ToolBarDefaultButtons.ShowAdd = true
    dg.OperationAction.ShowView = false
    dg.EnableDblClickEdite = true
    dg.OperationEditEvent = this.myOperationEditEvent
    dg.OperationViewEvent = this.myOperationViewEvent
    dg.OperationCustomButton = this.myOperationCustomButton
    dg.EditUrl = '/workflow/delegates/appDelegateEdit/'
    dg.EditTitle = '流程委托'
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
      this.modal.modalEdit = false
      this.modal.currEditModal = ''
      this.modal.title = ''
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
      const parm = Object.toClone(that.tableForm.data)
      parm.page = that.tablePage.currentPage
      parm.rows = that.tablePage.pageSize
      parm.sort = that.tablePage.sort
      parm.order = that.tablePage.order
      Object.toAjaxJson(that.dg.GetUrl(), null, parm, true, null, function(res) {
        if (res.success) {
          that.tableData = res.rows
          that.tablePage.total = res.total
          that.tablePage.pageCount = res.pageCount
        } else {
          that.$Notice.error({
            title: '错误',
            desc: res.msg
          })
        }
      })
    },
    // ====stand:标准方法控制结束==============
     myOperationViewEvent(value, row, index) {
      this.showDialogEdit(FUI.FormAction.View, row[this.dg.IdField])
    },
     myOperationEditEvent(value, row, index) {
      this.showDialogEdit(FUI.FormAction.Edit, row[this.dg.IdField])
    },
     showDialogEdit(formAction, keyId) {
      var that = this
      var title = formAction == FUI.FormAction.Add ? '新增' + that.dg.EditTitle : '编辑' + that.dg.EditTitle
      FUI.Window.openEdit(that.dg.EditUrl, title, formAction, that.dg.GridId, 950, 550, null, that.dg.MainTable, keyId)
    },
    // 工具栏按钮事件
     toolbarButtonClickEvent({ btn }, event) {
      const code = btn.code
      const that = this
      if (code == 'default.add') {
        that.showDialogEdit(FUI.FormAction.Add, '')
      } else if (code == 'default.delete') {
        // 批量删除，默认执行FUI内部的删除，如有需要可用成自己的删除方法
        that.dg.ToolBarBathDelete(that)
      }
    },
     myOperationCustomButton(h, value, row, index) {
      if (row.DelegateType != 2) {
        return ''
      }
      var custBtns = []
      var item = { title: '环节委托', tip: '编辑各环节委托用户', class: 'fa fa-group', code: 'ActivityAppDelegate', click: () => this.editActivityDelegate(row.AppDelegateId, row.AppId) }
      custBtns.push(item)
      return custBtns
    },
     operationCustomButtonClick(value, row, index) {
      alert('操作列自定义按钮事件调用：' + value)
    },
     extend_OperationShowDefaultButton(value, row, index) {
      // 扩展控制操作列默认的三个显示按钮
      return { 'showEdit': true, 'showView': true, 'showDelete': true }
    },
     editActivityDelegate(appDelegateId, appId) {
      var that = this
      FUI.Window.openEdit('/workflow/delegates/activityDelegateList?appDelegateId=' + appDelegateId + '&appId=' + appId, '编辑【' + appId + '】的环节被委托用户', FUI.FormAction.Edit, that.dg.GridId, 600, 350, null, that.dg.MainTable, '', true, null, null, false)
    },
     formatterDelegateType(row, col, value) {
      switch (value) {
        case 0:
          return '全部流程'
          break
        case 1:
          return '指定流程'
          break
        case 2:
          return '指定节点'
          break
      }
      return ''
    }
  }

}
</script>
