<template>
  <div class="f2bpm-page-layout">
    <el-container>
      <el-main class="f2bpm-page-right">
        <f2bpm-gridsearchform :tableform="tableForm" @searchformbtnclick="searchFormbtnClick" @updatevalue="updateFieldValue" />
        <f2bpm-datagrid
          ref="grid"
          grid="grid"
          height="full-40"
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
        // fui的dg对象
        dg: {},
         searchParams: {},
        tablePage: {
          pageCount: 0,
          // 切换排序字段
          sort: '',
          // 切换排序方向
          order: '',

          startIndex: 0,
          total: 0,
          currentPage: 1,
          pageSize: 10,
          align: 'center',
          pageSizes: [10, 20, 50, 100, 200, 500],
          layouts: ['Sizes', 'PrevJump', 'PrevPage', 'Number', 'NextPage', 'NextJump', 'FullJump', 'Total'],
          perfect: true
        },
        loading: false,
        treeData: [],
        tableData: [],
        tableForm: {
          titleWidth: 100,
          titleAlign: 'right',
          data: {

          },
          items: [
          ]
        },
        // 表头右键菜单
        headerMenus: [
          [
            { code: 'configHead', name: '配置表头' }
          ]
        ],
        // 列定义
        tableColumn: []
      }
    },
    computed: {
      countGridHeight() {
        return $(document).height() - 10
      }
    },
     created() {
      var workflowKey = Object.toQueryString('workflowKey')
      var formKey = Object.toQueryString('formKey')
      var $vm = this
      var dg = FUI.DataGrid.Create($vm, 'f2bpm_ProcessApp', 'f2bpm_ProcessApp', 'grid', false, false)
      dg.SortName = 'appId'
      dg.SortOrder = 'ASC'
      dg.ShowNumbers = true
      if (workflowKey) {
        dg.DefaultWhere = "WorkflowKey='" + workflowKey + "' "
      }
      if (formKey) {
        dg.DefaultWhere = " formKey='" + formKey + "' "
      }
      dg.ToolBarDefaultButtons.ShowDelete = false
      dg.ToolBarDefaultButtons.ShowAdd = false
      dg.OperationAction.ShowView = false
      dg.HidColumns = ['id']
      dg.Bind()
    },
     mounted() {
      window.myvm = this
    },
    methods: {
      dataGridSearch(type2) {
        this.tablePage.currentPage = 1
        this.tablePage.startIndex = 0
        this.getGridData()
      },
       getDrillGridData(data) {
        return data
      },
       getGridData() {
        // this.loading = true;
        var that = this
        var parm = that.tableForm.data
        parm.page = that.tablePage.currentPage
        parm.rows = that.tablePage.pageSize
        parm.sort = that.tablePage.sort
        parm.order = that.tablePage.order
        var res = Object.toAjaxJson(that.dg.GetUrl(), null, parm, true, null, function(res) {
          if (res.success) {
            that.tableData = that.getDrillGridData(res.rows)
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
       pageChange({ currentPage, pageSize }) {
        this.tablePage.currentPage = currentPage
        this.tablePage.pageSize = pageSize
        this.tablePage.startIndex = (currentPage - 1) * pageSize
        this.getGridData()
      }
    }
  }
</script>
