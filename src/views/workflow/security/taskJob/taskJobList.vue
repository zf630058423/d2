<template>
  <div class="f2bpm-page-layout">
    <el-container>
      <el-main class="f2bpm-page-right">

        <f2bpm-gridsearchform :tableform="tableForm" @searchformbtnclick="searchFormbtnClick" @updatevalue="updateFieldValue" />
        <f2bpm-datagrid ref="grid" grid="grid" :toolbar="tableToolbar" :context-menu="{header: {options: headerMenus},className: 'my-menus'}" :pager-config="tablePage" :data="tableData" :columns="tableColumn" @cell-dblclick="celldbClick" @toolbar-button-click="toolbarButtonClickEvent" @header-contextmenu="contextMenuClickEvent" @page-change="pageChange" @sort-change="sortChange" />
      </el-main>
    </el-container>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        currCategoryCode: '',
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
        tableColumn: []
      };
    },
    computed: {
      countGridHeight() {
        return $(document).height() - global_datagridHeightDiff;
      },
      rotateIcon() {
        return this.isCollapsed ? 'icon icon-arrow-right-bold cur' : 'icon icon-arrow-left-bold cur';
      },
      positionIcon() {
        return this.isCollapsed ? 'cursor:pointer; position: relative;left: -5px;' : 'cursor:pointer; position: relative;left: 100px;';
      }
    },
    created() {
      var that = this;
      var dg = FUI.DataGrid.Create(that, 'f2bpm_sys_TaskJob', 'f2bpm_sys_TaskJob', 'grid', true, true, true);
      dg.SortName = 'LastRunStatus desc,JobName';
      dg.SortOrder = 'desc';
      dg.ShowNumbers = true;
      dg.ExpansMore = false;
      dg.ToolBarDefaultButtons.ShowDelete = true;
      dg.ToolBarDefaultButtons.ShowAdd = true;
      dg.OperationAction.ShowView = false;
      dg.EnableDblClickEdite = true;
      dg.OperationEditEvent = this.myOperationEditEvent;
      dg.OperationViewEvent = this.myOperationViewEvent;
      dg.OperationCustomButton = this.myOperationCustomButton;
      dg.ToolBarCustomButton = this.myToolBarCustomButton;
      dg.EditUrl = __webpath + '/workflow/security/taskJob/taskJobEdit';
      dg.EditTitle = '定时任务';
      dg.Bind();
    },
    mounted() {
      window.myvm = this;
    },

    methods: {
      collapsedSider() {
        this.isCollapsed = !this.isCollapsed;
      },
      filterTreeNode(value, data) {
        if (!value) return true;
        return data.title.indexOf(value) !== -1;
      },
      showAll() {
        this.searchParams.CategoryCode = '';
        this.dataGridSearch();
      },
      onTreeSelected(data, treeNode, thisObj) {
        var that = this;
        var id = treeNode.data.id;
        this.searchParams.xxxxx = id;
        that.dataGridSearch();
      },
      pageChange({ currentPage, pageSize }) {
        this.tablePage.currentPage = currentPage;
        this.tablePage.pageSize = pageSize;
        this.tablePage.startIndex = (currentPage - 1) * pageSize;
        this.getGridData();
      },
      // 刷新列表
      refreshGrid(parentGridId, parm) {
        var that = this;
        that.dataGridSearch();
      },
      dataGridReSet() {
        var that = this;
        $.each(this.searchParams, function (key, item) {
          that.searchParams[key] = '';
        });
        that.searchParams.historyVersion = 'false';
        // 重置查询
        this.dataGridSearch();
      },
      dataGridSearch() {
        this.tablePage.currentPage = 1;
        this.tablePage.startIndex = 0;
        this.getGridData();
      },
      getGridData() {
        const that = this;
        let parm = Object.toClone(that.tableForm.data);
        parm.page = that.tablePage.currentPage;
        parm.rows = that.tablePage.pageSize;
        parm.sort = that.tablePage.sort;
        parm.order = that.tablePage.order;
        parm = Object.extend(parm, that.searchParams);
        Object.toAjaxJson(that.dg.GetUrl(), null, parm, true, null, function (res) {
          if (res.success) {
            that.tableData = res.rows;
            that.tablePage.total = res.total;
            that.tablePage.pageCount = res.pageCount;
          } else {
            FUI.Window.showMsg(res.msg);
          }
        });
      },
      // ====stand:标准方法控制结束==============
      myOperationViewEvent(value, row, index) {
        this.showDialogEdit(FUI.FormAction.View, row[this.dg.IdField]);
      },
      myOperationEditEvent(value, row, index) {
        this.showDialogEdit(FUI.FormAction.Edit, row[this.dg.IdField]);
      },
      showDialogEdit(formAction, keyId) {
        var that = this;
        var title = formAction == FUI.FormAction.Add ? '新增' + that.dg.EditTitle : '编辑' + that.dg.EditTitle;
        FUI.Window.openEdit(that.dg.EditUrl, title, formAction, that.dg.GridId, 700, 550, null, that.dg.MainTable, keyId, true, null, null, false);
      },
      // 工具栏按钮
      myToolBarCustomButton() {
        var btns = [];
        btns.push({ code: 'refreshCache', status: 'default', name: '刷新缓存', alias: "Refresh Cache", icon: 'fa fa-refresh' });
        btns.push({ code: 'refreshStatus', status: 'default', name: '刷新运行状态', alias: "Refresh State", icon: 'fa fa-refresh' });
        return btns;
      },
      // 工具栏按钮事件
      toolbarButtonClickEvent({ code }, event) {
        const that = this;
        if (code == 'closeEdit') {
          FUI.Window.closeEdit();
        } else if (code == 'default.add') {
          that.showDialogEdit(FUI.FormAction.Add, '');
        } else if (code == 'default.delete') {
          // 批量删除，默认执行FUI内部的删除，如有需要可用成自己的删除方法
          that.dg.ToolBarBathDelete(that);
        } else {
          var fn = that[code];
          fn();
        }
      },
      // 操作列自定义按钮
      myOperationCustomButton(h, value, row, index) {
        var custBtns = [];

        var item = {
          title: '启动任务', tip: '启动任务', class: 'fa fa-play-circle-o', code: 'custom',
          click: () => this.startJob(row.JobId, row.JobName, row.IsEnable)
        };

        custBtns.push(item);
        var item = {
          title: '停止任务', tip: '停止任务', class: 'fa fa-stop-circle-o', code: 'custom',
          click: () => this.stopJob(row.JobId, row.JobName, row.IsEnable)
        };

        custBtns.push(item);
        return custBtns;
      },
      startJob(jobId, jobTitle, jobName, isEnable) {
        var data = Object.toAjaxJson('/workflow/security/taskJob/', 'startJob', {
          'jobId': jobId
        });
        if (data.success) {
          window.location = window.location;
        } else {
          FUI.Window.showMsg(data.msg);
        }
      },
      refreshCache() {
        var data = Object.toAjaxJson('/workflow/security/taskJob/', 'refreshCache', null);
        if (data.success) {
          FUI.Window.showMsg2(data.msg, null, 1);
        } else {
          FUI.Window.showMsg(data.msg);
        }
      },
      stopJob(jobId, jobName, isEnable) {
        var data = Object.toAjaxJson(__webpath + '/workflow/security/taskJob/', 'stopJob', {
          'jobId': jobId
        });
        if (data.success) {
          window.location = window.location;
        } else {
          FUI.Window.showMsg(data.msg);
        }
      },
      formatterStatusHtml(value, rec, index) {
        var tag = '<span class="{0}"><i class="fa {1} bigger-120"></i>{2}</span>';
        var text, style, lable;
        switch (value) {
          case '停止': text = '已停止', style = 'fa-stop-circle-o'; lable = 'label label-grey'; break;
          case '运行中': text = '运行中', style = 'fa-random'; lable = 'label label-success'; break;
          default: text = value; style = 'fa-file-text-o'; lable = 'label label-grey'; break;
        }
        return Object.toStringFormat(tag, lable, style, text);
      },
      refreshStatus() {
        var that = this;
        var data = Object.toAjaxJson('/workflow/security/taskJob/', 'refreshStatusTaskJobList', null);
        if (data.success) {
          that.refreshGrid();
          FUI.Window.showMsg2(data.msg, null, 1);
        } else {
          FUI.Window.showMsg(data.msg);
        }
      }
    }
  }
</script>