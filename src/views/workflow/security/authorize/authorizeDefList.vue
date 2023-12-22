<template>
  <div class="f2bpm-page-layout">
    <el-container>
      <el-main class="f2bpm-page-right">
        <f2bpm-gridsearchform @expandclick="expandClick"  :key="gridsearchformKey" :tableform="tableForm" @searchformbtnclick="searchFormbtnClick" @updatevalue="updateFieldValue" />
        <f2bpm-datagrid  :expand-search="expandSearch" :key="datagridKey" ref="grid" grid="grid" :toolbar="tableToolbar" :context-menu="{header: {options: headerMenus},className: 'my-menus'}" :pager-config="tablePage" :data="tableData" :columns="tableColumn" @cell-dblclick="celldbClick" @toolbar-button-click="toolbarButtonClickEvent" @header-contextmenu="contextMenuClickEvent" @page-change="pageChange" @sort-change="sortChange" />
      </el-main>
    </el-container>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        expandSearch:"",
        datagridKey:"101",
        gridsearchformKey:"102",
        // ======stand:标准区=============
        isCollapsed: false,
        type: '',
        ismultilevelAuthorize: false,
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
    },
    computed: {
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
      $route() {
        this.load()
      }
    }, created() {
      this.load()
    },
    mounted() {
      window.myvm = this
    },

    methods: {
      load() {
        var that = this
        //初始页面原始数据
        that.tablePage = Object.toClone(FUI.DataGridProperty.tablePage);
        that.tableData = [];
        that.tableForm = Object.toClone(FUI.DataGridProperty.tableForm);
        that.tableToolbar = Object.toClone(FUI.DataGridProperty.tableToolbar);
        that.headerMenus = FUI.DataGridProperty.headerMenus;
        that.gridsearchformKey = Object.toGuid();
        that.datagridKey = Object.toGuid();

        var ismultilevelAuthorize = false
        const type = Object.toQueryString('type')
        that.type = type
        that.ismultilevelAuthorize = ismultilevelAuthorize
        const currUserId = FUI.Sys.getAuthor().userId
        var dg = FUI.DataGrid.Create(that, 'f2bpm_sys_AuthorizeDef', 'f2bpm_sys_AuthorizeDef', 'grid', true, true, true)
        dg.SortName = 'CreatedTime';
        dg.SortOrder = 'desc';
        dg.ShowNumbers = true;
        dg.ExpansMore = false;
        dg.DefaultWhere = " AuthorizeType='" + type + "' ";
        if (ismultilevelAuthorize == true) {
          dg.DefaultWhere = dg.DefaultWhere + " s_and CreatorId='" + currUserId + "' ";
        }
        dg.ToolBarDefaultButtons.ShowDelete = true;
        dg.ToolBarDefaultButtons.ShowAdd = true;
        dg.OperationAction.ShowView = false;
        dg.EnableDblClickEdite = true;
        dg.OperationCustomButton = this.myOperationCustomButton;
        dg.OperationEditEvent = this.myOperationEditEvent;
        dg.OperationDeleteEvent = this.myOperationDeleteEvent;
        dg.EditUrl = __webpath + '/workflow/security/authorize/authorizeDefEdit/?type=' + type;
        dg.EditTitle = '分管授权';
        dg.EditWidth = 800;
        dg.EditHeight = 500;
        dg.Bind();
      },
      collapsedSider() {
        this.isCollapsed = !this.isCollapsed;
      },
      filterTreeNode(value, data) {
        if (!value) return true
        return data.title.indexOf(value) !== -1;
      },
      showAll() {
        this.searchParams.CategoryCode = '';
        this.dataGridSearch();
      },
      searchFormbtnClick(name) {
        this.dg.searchFormbtnClick(name);
      },
      updateFieldValue(field, newValue, vueDataName, subVueDataName) {
        this.dg.updateFieldValue(field, newValue, vueDataName, subVueDataName);
      },
      pageChange({ currentPage, pageSize }) {
        this.tablePage.currentPage = currentPage;
        this.tablePage.pageSize = pageSize;
        this.tablePage.startIndex = (currentPage - 1) * pageSize;
        this.getGridData();
      },
      // 刷新列表
      refreshGrid(parentGridId, parm) {
        var that = this
        that.dataGridSearch()
      },
      dataGridReSet() {
        var that = this
        $.each(this.searchParams, function (key, item) {
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
        Object.toAjaxJson(that.dg.GetUrl(), null, parm, true, null, function (res) {
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
      myOperationViewEvent(value, row, index) {
        this.showDialogEdit(FUI.FormAction.View, row[this.dg.IdField])
      },
      myOperationEditEvent(value, row, index) {
        this.showDialogEdit(FUI.FormAction.Edit, row[this.dg.IdField])
      },
      myOperationDeleteEvent(value, row, index) {
        this.deleteList(value)
      },
      showDialogEdit(formAction, keyId) {
        var that = this
        var title = formAction == FUI.FormAction.Add ? '新增' + that.dg.EditTitle : '编辑' + that.dg.EditTitle
        FUI.Window.openEdit(that.dg.EditUrl, title, formAction, that.dg.GridId, 600, 450, null, that.dg.MainTable, keyId)
      },
      // 工具栏按钮
      myToolBarCustomButton() {
        var btns = []
        // btns.push({code: 'closeEdit', type: 'primary', name: '关闭', icon: 'fa fa-close'});
        return btns
      },
      // 工具栏按钮事件
      toolbarButtonClickEvent({ code }, event) {
        const that = this
        if (code == 'closeEdit') {
          FUI.Window.closeEdit()
        } else if (code == 'default.add') {
          that.showDialogEdit(FUI.FormAction.Add, '')
        } else if (code == 'default.delete') {
          // 批量删除，默认执行FUI内部的删除，如有需要可用成自己的删除方法
          that.deleteList()
        } else {
          var fn = that[code]
          fn()
        }
      },
      deleteList(id) {
        var that = this
        var authorizeIds = ''
        if (id) {
          authorizeIds = id
        } else {
          authorizeIds = that.dg.getChecked()
        }
        if (!authorizeIds) {
          FUI.Window.showMsg('请选择要删除的记录')
          return false
        }
        FUI.Window.confirm('您确定要删除吗', '删除提示', function () {
          var res = Object.toAjaxJson('/workflow/security/authorize/', 'deleteAuthorizeSource', { authorizeIds: authorizeIds })
          if (res.success) {
            FUI.Window.showMsg(res.msg, null, 1)
            that.refreshGrid()
          } else {
            FUI.Window.showMsg(res.msg)
          }
        })
      },
      // 操作列自定义按钮
      myOperationCustomButton(h, value, row, index) {
        var custBtns = []
        var item = { title: '授权设置', tip: '授权设置', alias:'Permission', class: 'fa fa-cog', code: 'editAuthorize', click: () => this.editAuthorize(row.AuthorizeId, row.AuthTitle) }
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
      editAuthorize(authorizeId, authTitle) {
        var that = this
        FUI.Window.openEdit('/workflow/security/authorize/authorizeSourceUserEdit/?ismultilevelAuthorize=' + that.ismultilevelAuthorize + '&type=' + that.type, '授权设置:' + authTitle, FUI.FormAction.Edit, that.dg.GridId, that.dg.EditWidth, that.dg.EditHeight, null, that.dg.MainTable, authorizeId, true)
      }
    }

  }
</script>