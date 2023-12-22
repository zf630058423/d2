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
    created() {
      var that = this
      var appId = Object.toQueryString('appId')
      window.myvm = that
      var dg = FUI.DataGrid.Create(that, 'f2bpm_form_data_transfer', 'f2bpm_form_data_transfer', 'grid', true, true, true)
      dg.SortName = 'toFormDefId'
      dg.SortOrder = 'asc'
      dg.ShowNumbers = true
      dg.ExpansMore = true
      dg.DefaultWhere = "app_id='" + appId + "'"
      dg.ToolBarDefaultButtons.ShowDelete = true
      dg.ToolBarDefaultButtons.ShowAdd = true
      dg.OperationAction.ShowView = false
      dg.EnableDblClickEdite = true
      dg.ToolBarCustomButton = this.myToolBarCustomButton
      dg.OperationEditEvent = this.myOperationEditEvent
      dg.OperationViewEvent = this.myOperationViewEvent
      dg.OperationCustomButton = this.myOperationCustomButton
      dg.OperationDeleteEvent = this.myDeleteEvent
      dg.EditUrl = '/workflow/smartForm/formDataTransfer/formDataTransferEdit/?appId=' + appId
      dg.EditTitle = '转单配置'
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
        this.searchParams.CategoryCode = ''
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
      // ====stand:标准方法控制结束==============
      myOperationViewEvent(value, row, index) {
        this.showDialogEdit(FUI.FormAction.View, row[this.dg.IdField])
      },
      myOperationEditEvent(value, row, index) {
        this.showDialogEdit(FUI.FormAction.Edit, row[this.dg.IdField])
      },
      myDeleteEvent(value, row, index) {
        var that = this
        FUI.Window.confirm('<em>请警慎操作，</em>您确定要删除吗？', null, function(r) {
          if (r) {
            var data = Object.toAjaxJson('/workflow/formDataTransfer/', 'deleteAndAllCascade', {
              id: row.id
            })
            if (data.success == true) {
              that.dg.Reload()
            } else {
              FUI.Window.showMsg(data.msg)
            }
          }
        })
      },
       showDialogEdit(formAction, keyId) {
        var that = this
        var title = formAction == FUI.FormAction.Add ? '新增' + that.dg.EditTitle : '编辑' + that.dg.EditTitle
        FUI.Window.openEdit(that.dg.EditUrl, title, formAction, that.dg.GridId, 700, 550, null, that.dg.MainTable, keyId, true)
      },
      // 工具栏按钮
      myToolBarCustomButton() {
        var btns = []
        btns.push({ code: 'closeEdit', status: 'default', name: '关闭', icon: 'fa fa-close' })
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
        var item = { title: '编辑字段转换关系', tip: '编辑字段转换关系', class: 'fa fa-trash-o', code: 'custom', click: () => this.formDataTransferItemList(row.id, row.toFormTitle) }
        custBtns.push(item)
        return custBtns
      },
      formDataTransferItemList(id, title) {
        var that = this
        FUI.Window.openEdit('/workflow/smartForm/formDataTransfer/formDataTransferItemList/?transferId=' + id, '字段转换配置', 'Eidt', that.dg.GridId, that.dg.EditWidth, that.dg.EditHeight, null, that.dg.MainTable, id, true)
      },
      // 编辑器
       levelFormatter(row, column, value, index) {
        const cellValue = value
        let result = cellValue
        switch (cellValue.toString()) {
          case 'main':
            result = '主表'
            break
          case 'sub':
            result = '子表'
            break
        }
        return result
      }

    }

  }
</script>
