<template>
  <div class="f2bpm-page-layout">
    <el-container>
      <el-main class="f2bpm-page-right">
        <f2bpm-gridsearchform :tableform="tableForm" @searchformbtnclick="searchFormbtnClick"
          @updatevalue="updateFieldValue" />
        <f2bpm-datagrid ref="grid" grid="grid" :toolbar="tableToolbar" :context-menu="{
          header: { options: headerMenus },
          className: 'my-menus'
        }" :pager-config="tablePage" :data="tableData" :columns="tableColumn" @cell-dblclick="celldbClick"
          @toolbar-button-click="toolbarButtonClickEvent" @header-contextmenu="contextMenuClickEvent"
          @page-change="pageChange" @sort-change="sortChange" />
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
        // 查询
      }
    }
  },
  computed: {
    countGridHeight() {
      return $(document).height() - global_datagridHeightDiff
    },
    rotateIcon() {
      return this.isCollapsed
        ? 'fa fa-angle-double-right'
        : 'fa fa-angle-double-left'
    },
    positionIcon() {
      return this.isCollapsed
        ? 'cursor:pointer; position: relative;left: -5px;'
        : 'cursor:pointer; position: relative;left: 100px;'
    }
  },
  watch: {},
  created() {
    var that = this
    //const currUserId = that.$store.state.user.author.userId;
    var dg = FUI.DataGrid.Create(
      that,
      'f2bpm_sys_integration',
      'f2bpm_sys_integration',
      'grid',
      true,
      true,
      true
    )
    dg.SortName = 'id'
    dg.SortOrder = 'desc'
    dg.ShowNumbers = true
    dg.ExpansMore = true
    dg.ToolBarCustomButton = this.myToolBarCustomButton
    dg.ToolBarDefaultButtons.ShowDelete = true
    dg.ToolBarDefaultButtons.ShowAdd = true
    dg.OperationAction.ShowView = true
    dg.EnableDblClickEdite = true
    dg.OperationEditEvent = this.myOperationEditEvent
    dg.OperationViewEvent = this.myOperationViewEvent
    dg.OperationCustomButton = this.myOperationCustomButton
    dg.EditUrl = '/workflow/security/integration/integrationEdit'
    dg.EditTitle = '集成第三方配置'
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
    refreshGrid(parentGridId, parm) {
      var that = this
      that.dataGridSearch()
    },
    dataGridReSet() {
      var that = this
      $.each(this.searchParams, function (key, item) {
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
      Object.toAjaxJson(that.dg.GetUrl(), null, parm, true, null, function (
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
      var title =
        formAction == FUI.FormAction.Add
          ? '新增' + that.dg.EditTitle
          : '编辑' + that.dg.EditTitle
      FUI.Window.openEdit(
        that.dg.EditUrl,
        title,
        formAction,
        that.dg.GridId,
        700,
        550,
        null,
        that.dg.MainTable,
        keyId
      )
    },
    // 工具栏按钮
    myToolBarCustomButton() {
      var btns = []
      // btns.push({code: 'closeEdit', status: 'default', name: '关闭', icon: 'fa fa-close'});
      return btns
    },
    // 工具栏按钮事件
    toolbarButtonClickEvent({ btn }, event) {
      const code = btn.code
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
      var item = {
        title: '示自定义',
        tip: '提示自定义',
        class: 'fa fa-trash-o',
        code: 'custom',
        click: () => this.operationCustomButtonClick(value, row, index)
      }
      // custBtns.push(item);
      return custBtns
    },
    operationCustomButtonClick(value) {
      alert('aa' + value)
    },
    //JS显示格式化示例
    integrationTypeFormatter(row, column, value, index) {
      let result = value
      switch (value.toString()) {
        case 'qyweixin':
          result = '企业微信'
          break
        case 'dingding':
          result = '钉钉'
          break
        case 'tianyancha':
          result = '天眼查'
          break
        case 'jvmeizhishu_sxr':
          result = '聚美智数_失信人'
          break
        case 'jvmeizhishu_xg':
          result = '聚美智数_限高'
          break
        case 'gomeet':
          result = '工盟'
          break
        case 'spl1':
          result = 'drp1.0单点登陆'
          break
        case 'spl2':
          result = 'drp2.0单点登陆'
          break
        case 'jianzhi':
          result = '见知'
          break
        case 'visa':
          result = '签章平台'
          break
        case 'zhiliants':
          result = '智链推送'
          break
        case 'baiwang':
          result = '百望'
          break
        case 'drp1.0API':
          result = 'drp1.0 API'
          break
        case 'dingding_ocr':
          result = '钉钉OCR'
          break
      }
      return result
    }
  }
}
</script>
