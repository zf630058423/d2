<template>
  <div class="f2bpm-page-layout ">
    <el-container>
      <el-header style="padding: 0;padding-left: 5px;border-bottom: solid #e8eaec  1px;height: 40px;padding-left: 5px;">
        <el-tabs :value="actionName" @tab-click="tabsClick">
          <el-tab-pane label="栏目管理" name="goFence" />
          <el-tab-pane label="门户管理" name="goPortal" />
        </el-tabs>
      </el-header>
      <el-main class="f2bpm-page-right">
        <f2bpm-gridsearchform :tableform="tableForm" @searchformbtnclick="searchFormbtnClick" @updatevalue="updateFieldValue" />
        <f2bpm-datagrid
          ref="grid"
          grid="grid"
          height="full-250"
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
        actionName: 'goPortal',
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
      var dg = FUI.DataGrid.Create(that, 'f2bpm_sys_app_portal', 'f2bpm_sys_app_portal', 'grid', true, true, true)
      dg.SortName = 'id'
      dg.SortOrder = 'desc'
      dg.ShowNumbers = true
      dg.ExpansMore = true
      dg.ToolBarDefaultButtons.ShowDelete = true
      dg.ToolBarDefaultButtons.ShowAdd = true
      dg.OperationAction.ShowView = false
      dg.EnableDblClickEdite = true
      dg.ToolBarCustomButton = that.myToolBarCustomButton
      dg.OperationEditEvent = this.myOperationEditEvent
      dg.OperationViewEvent = this.myOperationViewEvent
      dg.OperationCustomButton = this.myOperationCustomButton
      dg.EditUrl = '/workflow/frame/appPortal/appPortalEdit'
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
        btns.push({ code: 'importXml', status: 'default', name: '导入门户设计',alias:'Import', icon: 'fa fa-upload' })
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
        var item = { title: '门户设计', tip: '门户设计',alias:'Portal Design', class: 'fa fa-trash-o', code: 'custom', click: () => this.appPortalDesigner(value, row, index) }
        custBtns.push(item)
        var item = { index: 99, title: '添加到系统菜单',alias:'Add To Sys Menus',  tip: '添加到系统菜单', class: 'fa fa-plus', code: 'custom', click: () => this.addToSystemResource(value, row, index) }
        custBtns.push(item)
        var item3 = { index: 98, title: '导出门户设计', alias:'Export', tip: '导出门户设计', class: 'fa fa-download', code: 'reportView', click: () => this.download(value, row, index) }
        custBtns.push(item3)
        return custBtns
      },
       addToSystemResource(value, row, index) {
        var that = this
        var portalId = value
        var title = row.portalName
        var portalKey = row.portalKey
        Sys.SelectorDialog.selectResourceCallBack(function(data, index) {
          if (data) {
            var parentId = data[0].id
            var sysMenu = '/workflow/frame/appPortal/appPortalView/?portalId=' + portalId
            var res = Object.toAjaxJson('/admin/resource/', 'saveSample', {
              'resourceId': portalKey,
              'parentId': parentId,
              'name': title,
              'functionUrl': sysMenu
            })
            FUI.Window.showMsg(that, res.msg, null, res.success == true ? 1 : 7)
          }
        })
      },
       appPortalDesigner(portalId) {
        var that = this
        var url = __webpath+ '/workflow/frame/appPortal/appPortalDesigner/'
        FUI.Window.open(url + '?portalId=' + portalId)
      },
       portalTypeFormatter(row, column, value, index) {
        var cellValue = value
        let result = cellValue
        switch (cellValue.toString()) {
          case 'front':
            result = '前端'
            break
          case 'back':
            result = '后端'
            break
          case 'mobile':
            result = '手机端'
            break
        }
        return result
      },
       goFence() {
        var that = this
        window.location.href = __webpath + '/workflow/frame/appFence/appFenceList'
      },
       goPortal() {
        window.location.href = __webpath + '/workflow/frame/appPortal/appPortalList'
      },
       tabsClick(tab) {
        var that = this
        var name = tab.name
        var fn = that[name]
        fn()
      },
       download(value) {
        var that = this
        var data = Object.toAjaxDownloadFile('/workflow/frame/appPortal/', 'downLoadXml', {
          id: value
        })
      },
       importXml() {
        FUI.Window.openEdit(__webpath + '/workflow/frame/appPortal/appPortalImport', '导入门户设计', FUI.FormAction.Edit, '', 550, 380)
      }
    }
  }
</script>
