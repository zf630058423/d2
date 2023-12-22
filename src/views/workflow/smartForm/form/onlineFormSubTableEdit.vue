<template>
  <div class="f2bpm-page-layout">
    <el-container>
      <el-main class="f2bpm-page-right">
        <f2bpm-gridsearchform :tableform="tableForm" @searchformbtnclick="searchFormbtnClick" @updatevalue="updateFieldValue" />
        <f2bpm-datagrid
          ref="grid"
          size="small"
          grid="grid"
          border
          show-overflow="tooltip"
          highlight-hover-row
          auto-resize
          :height="countGridHeight"
          :context-menu="{header: {options: headerMenus},className: 'my-menus'}"
          :seq-config="{startIndex:tablePage.startIndex}"
          class="mytable-scrollbar"
          :loading="loading"
          :data="tableData"
          :columns="tableColumn"
          :pager-config="tablePage"
          :toolbar="tableToolbar"
          @header-contextmenu="contextMenuClickEvent"
          @page-change="pageChange"
          @cell-dblclick="celldbClick"
          @toolbar-button-click="toolbarButtonClickEvent"
          @form-reset="dataGridReSet"
          @form-submit="dataGridSearch"
        />
      </el-main>
    </el-container>
  </div>
</template>

<script>
  export default { data() {
      return {
        itemId: '',
        busObjectId: '',
        deviceType: '',
        currentBoId: '',
        treeFilterText: '',
        formDefId: '',
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
      var formDefId = Object.toQueryString('formDefId');
      var formKey = Object.toQueryString('formKey');
      var busObjectId = Object.toQueryString('busObjectId');
      var itemId = Object.toQueryString('itemId');
      var deviceType = Object.toQueryString('deviceType');
      var $vm = this;

      $vm.currentBoId = busObjectId;
      $vm.formDefId = formDefId;
      $vm.deviceType = deviceType;
      $vm.busObjectId = busObjectId;
      $vm.itemId = itemId;
      $vm.formKey=formKey;
      this.tablePage.pageSize=500;
      var dg = FUI.DataGrid.Create($vm, 'key_FormFieldGridView', 'f2bpm_form_FormDefField', 'grid', true, true, true);
      dg.SortName = 'FieldOrderNo';
      dg.SortOrder = 'ASC';
      dg.EnableDblClickEdite = true;
      dg.DefaultWhere = " FormDefId='" + formDefId + "' s_and (ColumnType='base' s_or ColumnType='virtual') and s_and BusObjectId='" + busObjectId + "' ";
      dg.IdField = 'FieldId';
      dg.OperationAction.ShowEdit = true;
      dg.OperationAction.ShowView = false;
      dg.OperationBeforeDeleteEvent = this.myOperationBeforeDeleteEvent;
      dg.OperationEditEvent = this.myOperationEditEvent;
      dg.OperationViewEvent = this.myOperationViewEvent;
      dg.OperationDeleteEvent = this.myDeleteEvent;
      dg.OperationAfterSaveRowIsRefresh = false;
      dg.OperationAction.ShowView = false;
      dg.IsEnableReloadWhere = true;
      // 工具栏
      dg.ToolBarDefaultButtons.ShowAdd = false;
      dg.ToolBarDefaultButtons.ShowSearch = true;
      dg.ToolBarDefaultButtons.ShowDelete = false;
      dg.ToolBarCustomButton = this.myToolBarCustomButton;
      dg.EditUrl = __webpath + '/workflow/smartForm/formFieldEdit/?isSubtable=true&formDefId=' + formDefId;
      dg.EditTitle = '表单控件';
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
      // ====stand:标准方法控制结束==============
       myOperationBeforeDeleteEvent(value, row, index) {
        if (confirm('删除后将影响表单设计模板中对应的字段控件容器div的fieldId的ID值，请删除后需到表单设计器中删除对应的字段控件或者手动修改表单模板中的这个值。请慎重评估是否要删除！')) {
          return true
        }
        return false
      },
       myToolBarDeleteEvent() {
        var ids = this.dg.getChecked()
        this.deleteFieldDef(ids)
      },
       myDeleteEvent(value, row, index) {
        var that = this
        that.deleteFieldDef(row.FieldId)
      },
       deleteFieldDef(ids) {
        var that = this
        if (ids == '') {
          FUI.Window.showMsg(that, '请选择要删除的记录')
          return false
        }
        var data = Object.toAjaxJson('/workflow/formPermission/', 'deleteFileDefList', { 'ids': ids })
        if (data.success) {
          FUI.Window.showMsg(that, data.msg, null, 1, function() {
            that.dg.Reload()
          })
        }
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
          url = that.dg.EditUrl + '?currentBoId=' + that.currentBoId
        }
        FUI.Window.openEdit(url, title, formAction, that.dg.GridId, 850, 530, null, that.dg.MainTable, keyId)
      },
      // 工具栏按钮
       myToolBarCustomButton() {
        var btns = []
        btns.push({ code: 'saveSubmit', type: 'primary', name: '确定并返回', icon: 'fa fa-save' })
        btns.push({ code: 'busObjectEdit', type: 'primary', name: '业务对象属性', icon: 'fa fa-cogs' })
        btns.push({
          code: 'closeEdit',
          type: 'default',
          name: '关闭',
          icon: 'fa fa-close',
          title: '关闭'
        })
        return btns
      },
      // 工具栏按钮事件
       toolbarButtonClickEvent({ code }, event) {
        const that = this
        if (code == 'default.add') {
          that.showDialogEdit(FUI.FormAction.Add, '')
        } else if (code == 'default.delete') {
          that.myToolBarDeleteEvent()
        } else {
          var fn = that[code]
          fn()
        }
      },
       autoReSetFiledDefOrderNo() {
        var that = this
        if (that.currentBoId == '') {
          FUI.Window.showMsg(that, '请选择左侧指定的业务对象')
          return false
        }
        FUI.Window.confirm(that, '确定重置规整表的字段排序号？', null, function(r) {
          var data = Object.toAjaxJson(FUI.Handlers.SmartFormHandler, 'autoReSetFiledDefOrderNo', {
            'formDefId': that.formDefId,
            'busObjectId': that.currentBoId
          })
          if (data.success == true) {
            that.dg.DefaultWhere = " FormDefId='" + that.formDefId + "' s_and ColumnType='base'  s_and BusObjectId='" + that.currentBoId + "'"
            that.dg.Reload()
          } else {
            FUI.Window.showMsg(that, data.msg)
          }
        })
      },
       busObjectEdit() {
        var that = this
        FUI.Window.openEdit(__webpath + '/workflow/smartForm/formBusObjectEdit?formKey='+that.formKey+'&formDefId='+that.formDefId, '编辑业务对象', FUI.FormAction.Edit, null, 900, 550, null, 'f2bpm_form_BusObject', that.busObjectId, true)
      },
       saveSubmit() {
        var that = this
        try {
          var inputHtml = Object.toAjaxJson(FUI.Handlers.SmartFormHandler, 'getOnlineSubTableHtmlByFormDefIdBusObjectId', { 'formDefId': that.formDefId, 'busObjectId': that.busObjectId, 'type': that.deviceType }, null, null, null, 'html')
          if (inputHtml != '') {
            var $target = $('#' + that.itemId, $(window.parent.window.document))
            var rowId = $target.attr('rowId')
            var columnId = $target.attr('colId')
            var fieldStr = $(inputHtml).val() // $(".jsonItem", $(inputHtml)).val();
            var fieldItem = eval('(' + fieldStr + ')')
            window.parent.window.myvm.onFieldUpdate(fieldItem, rowId, columnId, that.itemId)
            // 调用生成新的表单Html字段
            FUI.Window.showMsg('子表列表修改成功', null, 1, function() {
              FUI.Window.closeEdit(false)
            })
          }
        } catch (err) {
          FUI.Window.showMsg(that, err)
          return false
        }
      }
    }

  }
</script>
