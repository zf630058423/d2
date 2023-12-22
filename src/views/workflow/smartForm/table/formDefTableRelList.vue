<template>
  <div class="f2bpm-page-layout">
    <el-container>
      <!--  <el-header style="padding: 0;padding-left: 5px;border-bottom: solid #e8eaec  1px;height: 40px;">
        <el-tabs value="goFormDefTableRelList" @tab-click="tabsClick">
          <el-tab-pane label="①基本信息" name="goFormDefEdit"></el-tab-pane>
          <el-tab-pane label="②关联表" name="goFormDefTableRelList"></el-tab-pane>
          <el-tab-pane label="③业务对象" name="goBusObjectSubsEdit"></el-tab-pane>
          <el-tab-pane label="④字段控件" name="goFormFieldList"></el-tab-pane>
        </el-tabs>
      </el-header> -->
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
  export default { data() {
      return {
        categoryCode: '',
        formDefId: '',
        treeFilterText: '',
        // ======stand:标准区=============
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
        // ===========标准区结束==========
         searchParams: {
          // 特殊查询
        }
      }
    }, computed: {
      countGridHeight() {
        return $(document).height() - 145
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
      var formDefId = Object.toQueryString('formDefId')
      var categoryCode = Object.toQueryString('categoryCode') || ''
      var that = this
      that.categoryCode = categoryCode
      that.formDefId = formDefId
      var dg = FUI.DataGrid.Create(that, 'sqlkey_FormdefTableRelList', 'f2bpm_form_TableDefinition', 'grid', true, true, true)
      dg.SortName = 'CreatedTime'
      dg.SortOrder = 'desc'
      dg.DefaultWhere = "FormDefId='" + formDefId + "'"
      // 是否开启双击编辑
      dg.EnableDblClickEdite = true
      dg.ExpansMore = true
      dg.OperationBeforeDeleteEvent = this.myOperationBeforeDeleteEvent
      dg.OperationAction.ShowEdit = true
      dg.OperationEditEvent = this.myOperationEditEvent
      dg.OperationViewEvent = this.myOperationViewEvent
      dg.OperationDeleteEvent = this.myDeleteEvent
      dg.OperationAfterSaveRowIsRefresh = false
      dg.OperationAction.ShowView = false
      dg.OperationAction.ShowDelete = false
      dg.IsEnableReloadWhere = true
      // 工具栏
      dg.ToolBarDefaultButtons.ShowAdd = true
      dg.ToolBarDefaultButtons.ShowSearch = true
      dg.ToolBarDefaultButtons.ShowDelete = false
      dg.OperationCustomButton = this.myOperationCustomButton
      dg.ToolBarCustomButton = this.myToolBarCustomButton
      dg.EditUrl = '/workflow/smartForm/table/tableDefinitionEdit/'
      dg.EditTitle = ''
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
       dataGridReSet() {
        var that = this
        $.each(this.searchParams, function(key, item) {
          that.searchParams[key] = ''
        })
        // 重置查询
        this.dataGridSearch()
      },
       filterTreeNode(value, data) {
        if (!value) return true
        return data.title.indexOf(value) !== -1
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
            that.$message.error(res.msg, { duration: 0 })
          }
        })
      },
       myOperationBeforeDeleteEvent(value, row, index) {
        if ((row.IsCreateTable == true || row.IsCreateTable == 1) && !row.IsOuterTable) {
          FUI.Window.showMsg(this, row.TableTitle + '的物理表已生成，不可删除！')
          return false
        }
        return true
      },
      // ====stand:标准方法控制结束==============
       myDeleteEvent(value, row, index) {
        var that = this
        FUI.Window.confirm(that, '确定要删除吗？', null, function() {
          var data = Object.toAjaxJson(FUI.Handlers.SmartFormHandler, 'deleteTable', { tableId: value })
          if (data.success == true) {
            that.dg.Reload()
          } else {
            FUI.Window.showMsg(that, data.msg)
          }
        })
      },
       myBeforeDblClickEditeEvent(value, row, index) {
        if (row.IsCreated) {
          FUI.Window.showLeftBelowMsg(this, '表已生成，如需修改请点击“编辑”按钮！')
        }
        return !row.IsCreated
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
        var url = that.dg.EditUrl
        if (formAction == FUI.FormAction.Add) {
          url = that.dg.EditUrl + '?categoryCode=' + that.categoryCode + '&formDefId=' + that.formDefId
        }
        FUI.Window.openEdit(url, title, formAction, that.dg.GridId, 800, 500, null, that.dg.MainTable, keyId)
      },
      // 工具栏按钮
       myToolBarCustomButton() {
        var btns = []
        /* btns.push({
          code: 'selectRelTableDef',
          status: 'default',
          name: '选择已有的表',
          icon: 'fa fa-search',
          title: '选择并并联一个已定义的表'
        }); */
        btns.push({ code: 'downLoadTableDef', status: 'default', name: '导出表定义SQL', icon: 'fa fa-download' })
       /*  btns.push({
          code: 'importExistTableDef',
          status: 'default',
          name: '导入外部表',
          icon: 'fa fa-upload',
          title: '导入一个已存在的数据库物理表，注意导入后将会在物理表中自动添加下面字段供流程关联使用：MyId，Wiid，MyParentId，BusinessKey，FormId'
        }); */
        btns.push({
          code: 'backTableAndData',
          status: 'default',
          name: '备份物理表及数据',
          icon: 'fa fa-database',
          title: '备份物理表及数据'
        })
        btns.push({ code: 'closeEdit', status: 'default', name: '关闭', icon: 'fa fa-close' })
        return btns
      },
      // 工具栏按钮事件
       toolbarButtonClickEvent({ code }, event) {
        const that = this
        if (code == 'default.add') {
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
        var custBtns = []
        var item1 = { title: '表定义', tip: '数据表定义', class: 'fa fa-table', code: 'opTableColumn', click: () => this.opTableColumn(value, row, index) }
        var item2 = { title: '删除关联', tip: '删除与表单的关联', class: 'fa fa-table', code: 'deleteFormDefTableRel', click: () => this.deleteFormDefTableRel(value, row, index) }
        var item3 = { index: 99, title: '删除表定义', tip: '删除物理表定义', class: 'fa fa-table', code: 'deleteTableDef', click: () => this.deleteTableDef(value, row, index) }
        var item4 = { index: 80, title: '被引用的业务对象', tip: '查看被引用的业务对象', class: 'fa fa-cubes', code: 'showBusinessObject', click: () => this.showBusinessObject(value, row, index) }
        custBtns.push(item1)
        custBtns.push(item2)
        custBtns.push(item3)
        custBtns.push(item4)
        return custBtns
      },
       deleteFormDefTableRel(value, row, index) {
        var that = this
        var id = row.Id
        FUI.Window.confirm('您确定删除【' + row.TableTitle + '】对表单的关联吗（仅做关系删除，表定义不会被删除）?', '关联删除提示', function() {
          // 会检查是否被本表单业务对象引用了
          var res = Object.toAjaxJson(FUI.Handlers.SmartFormHandler, 'deleteFormDefTableRelByIdFormDefId', { formDefId: that.formDefId, id: id })
          if (res.success) {
            that.dg.Reload()
          } else {
            FUI.Window.showMsg(res.msg)
          }
        })
      },
       deleteTableDef(value, row, index) {
        var that = this
        var tableId = row.TableId
        FUI.Window.confirm('您确定删除【' + row.TableTitle + '】表定义吗（表定义将会被删除，请慎重）?', '删除提示', function() {
          var res = Object.toAjaxJson(FUI.Handlers.SmartFormHandler, 'deleteTable', { tableId: tableId })
          if (res.success) {
            that.dg.Reload()
          } else {
            FUI.Window.showMsg(res.msg)
          }
        })
      },
       opTableColumn(value, row, index) {
        const tableId = row.TableId
        const tableTitle = row.TableTitle
        FUI.Window.openEdit('/workflow/smartForm/tableColumnList/?tableId=' + tableId, '数据表【' + tableTitle + '】', FUI.FormAction.Edit, null, 880, 450, null, null, null, true)
      },
       showBusinessObject(value, row, index) {
        FUI.Window.openEdit(__webpath + '/workflow/smartForm/table/showBusObjectOfTable/?tableId=' + row.TableId, '表名【' + row.TableTitle + '】被引用到的业务对象', FUI.FormAction.View, this.dg.GridId, 700, 400, null, '', this.dg.MainTable, false)
      },
       importExistTableDef() {
        FUI.Window.openEdit(__webpath + '/workflow/smartForm/table/tableDefinitionImprot/?categoryCode=' + this.categoryCode, '导入外部表', 'Add', this.dg.GridId, this.dg.EditWidth, this.dg.EditHeight + 50, null, this.dg.MainTable, null)
      },
       selectRelTableDef() {
        // 选择并添加关联表
        var that = this
        var parm = null
        FUI.dialog(__webpath + '/workflow/smartForm/tableDefinitionSelect', '选择表定义', parm, 900, 560, function(objectData, index, layer) {
          if (objectData.length > 0) {
            var tableId = objectData[0].TableId
            var tableTitle = objectData[0].TableTitle
            var res = Object.toAjaxJson(FUI.Handlers.SmartFormHandler, 'saveFormDefTableRel', { refFormDefId: that.formDefId, refTableId: tableId })
            if (res.success) {
              that.dg.Reload()
            } else {
              FUI.Window.showMsg(res.msg)
            }
          }
          layer.close(index)
        }, true)
      },
       backTableAndData() {
        var that = this
        var dbtableNames = that.dg.getChecked('DbTableName')
        if (dbtableNames == '') {
          FUI.Window.showMsg(that, '请选择要备份的物理表！')
          return false
        }

        FUI.Window.confirm(that, '您确定要备份所选物理表及数据？', '温馨提示', function(r) {
          var data = Object.toAjaxJson(FUI.Handlers.SmartFormHandler, 'backupDataBaseTableAndData', {
            dbtableNames: dbtableNames
          }, true, null, function(data) {
            if (data.success) {
              FUI.Window.showMsg(that, data.msg, null, 1)
            } else {
              FUI.Window.showMsg(that, data.msg)
            }
          })
        })
      },
       downLoadTableDef() {
        var that = this
        var ids = this.dg.getChecked()
        if (ids == '') {
          FUI.Window.showMsg(that, '请选择要导出的表！')
          return false
        }
        var data = Object.toAjaxDownloadFile(FUI.Handlers.SmartFormHandler, 'downLoadTableDef', {
          tableIds: ids
        })
      },
      // 表单编辑
       goFormDefEdit() {
        window.location.href = __webpath + '/workflow/smartForm/formDefEdit/?parentGridId=grid&formAction=Edit&mainTable=f2bpm_form_FormDef&keyId=' + this.formDefId
        //无#window.location.reload()
      },
      // 关联表
       goFormDefTableRelList() {
        var that = this
        window.location.href = __webpath + '/workflow/smartForm/table/formDefTableRelList/?formDefId=' + this.formDefId + '&categoryCode=' + that.categoryCode
      },
      // 业务对象设计
       goBusObjectSubsEdit() {
        var that = this
        window.location.href = __webpath + '/workflow/smartForm/busObjectSubsEdit/?formDefId=' + this.formDefId + '&categoryCode=' + that.categoryCode
      },
      // 字段元素
       goFormFieldList() {
        window.location.href = __webpath + '/workflow/smartForm/formFieldList/?formDefId=' + this.formDefId + '&categoryCode=' + this.categoryCode
      },
       tabsClick(tab) {
        var that = this
        var name = tab.name
        if (name == 'goFormDefEdit') {
          that.goFormDefEdit()
        } else if (name == 'goBusObjectSubsEdit') {
          that.goBusObjectSubsEdit()
        } else if (name == 'goFormFieldList') {
          that.goFormFieldList()
        } else if (name == 'goFormDefTableRelList') {
          that.goFormDefTableRelList()
        }
      }
    }

  }
</script>
