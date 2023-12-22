<template>
  <div class="f2bpm-page-layout">
    <el-container v-if="!isShow404">
      <el-aside v-if="isShowLeft" ref="sideLeft" class="f2bpm-page-left" hide-trigger collapsible :width="isCollapsed?'20px':'220px'">
        <div class="f2bpm-panel-head">
          <div v-if="!isCollapsed" class="f2bpm-left-search-div">
            <el-input v-model="treeFilterText" class="left-htead-treeFilterText-box" size="small" clearable :placeholder="$t('enterKey')" autocomplete="off" prefix-icon="el-icon-search" />
          </div>
          <div class="f2bpm-left-search-button-div">
            <i v-if="!isCollapsed" :title="$t('refresh')" class="icon icon-shuaxin  cur mr10 font12  " @click="loadTree()"></i>
            <i title="收起/展开" :class="rotateIcon" @click="collapsedSider" />
          </div>
        </div>
        <div v-if="!isCollapsed" class="f2bpm-page-left-content auto-window-height " :style="'height:'+countLeftTreeHeight+'px;'">
          <div class="mytree-cube-box-container">
            <span class="cur  mytree-cube-box " @click="showAll()"><i class="icon icon-quanbu font16"></i>
              <span class="mytree-cube-box-title">{{$t('all')}}</span>
            </span>

            <span class="cur  mytree-cube-box" @click="changeToPage('postJboList')"><i class="icon icon-fenlei font16"></i>
              <span class="mytree-cube-box-title"> 职务管理</span>
            </span>
          </div>
          <el-tree ref="mytree" :data="treeData" highlight-current :expand-on-click-node="false" :filter-node-method="filterTreeNode" default-expand-all @node-click="onTreeSelected" />
        </div>
      </el-aside>
      <el-main class="f2bpm-page-right">
        <f2bpm-gridsearchform :tableform="tableForm" @expandclick="expandClick" @searchformbtnclick="searchFormbtnClick" @updatevalue="updateFieldValue" />
        <f2bpm-datagrid ref="grid" grid="grid" :expand-search="expandSearch" :toolbar="tableToolbar" :context-menu="{header: {options: headerMenus},className: 'my-menus'}" :pager-config="tablePage" :data="tableData" :columns="tableColumn" @cell-dblclick="celldbClick" @toolbar-button-click="toolbarButtonClickEvent" @header-contextmenu="contextMenuClickEvent" @page-change="pageChange" @sort-change="sortChange" />
      </el-main>
    </el-container>
    <f2bpmui-404 content="请选择左侧一个组织进行操作~" :isShow="isShow404"></f2bpmui-404>
  </div>
</template>
<script>
  export default {
    components: {   },
    data() {
      return {
        isShow404: "",
        hidOrgId: "",
        hidOrgName: "",
        isShowLeft: true,
        signle: 0,
        expandSearch: "",
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
          postJobCode: "",
          orgId: ""
        }
      };
    },
    computed: {
      countLeftTreeHeight() {
        return $(document).height() - 100;
      },
      countGridHeight() {
        return $(document).height() - global_datagridHeightDiff;
      },
      rotateIcon() {
        return this.isCollapsed ? 'fa fa-angle-double-right' : 'fa fa-angle-double-left';
      },
      positionIcon() {
        return this.isCollapsed ? 'cursor:pointer; position: relative;left: -5px;' : 'cursor:pointer; position: relative;left: 100px;';
      }
    },
    watch: {

    },
    created() {
      var that = this;
      const orgId = Object.toQueryString('orgId');
      const hidOrgName = Object.toQueryString('hidOrgName');
      const signle = Object.toQueryString('signle') || 0;
      var departassignleaderMode = 'default';
      if (orgId) {
        that.hidOrgId = orgId;
        that.hidOrgName = hidOrgName;
        that.searchParams.orgId = orgId;
      }
      if (signle == 1) {
        that.isShowLeft = false;
        that.signle = 1;
      }
      if (that.signle == 0) {
        that.loadTree();
      }
      if (that.hidOrgId == 'Root') {
        that.isShow404 = true;
      } else {
        that.isShow404 = false;
      }
      var dg = FUI.DataGrid.Create(that, 'vw_sys_PostitionList', 'sys_position', 'grid', true, true, true);
      dg.SortName = 'post_code';
      dg.SortOrder = 'desc';
      dg.ShowNumbers = true;
      dg.ExpansMore = true;
      dg.ToolBarCustomButton = this.myToolBarCustomButton;
      dg.ToolBarDefaultButtons.ShowDelete = true;
      dg.ToolBarDefaultButtons.ShowAdd = true;
      dg.OperationAction.ShowView = true;
      dg.EnableDblClickEdite = true;
      dg.OperationDeleteEvent = this.myOperationDeleteEvent;
      dg.OperationEditEvent = this.myOperationEditEvent;
      dg.OperationViewEvent = this.myOperationViewEvent;
      dg.OperationCustomButton = this.myOperationCustomButton;
      dg.EditUrl = '/admin/position/positionEdit';
      dg.EditTitle = '岗位';
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
      onTreeSelected(data, treeNode, thisObj) {
        var that = this;
        var id = treeNode.data.id;
        that.searchParams.postJobCode = id;
        that.dataGridSearch();
      },
      showAll() {
        var that = this;
        that.searchParams.postJobCode = "";
        this.dataGridSearch();
      },
      refreshTree() {
        this.loadTree();
      },
      loadTree() {
        var that = this;
        var treeUrl = '/admin/postJob/getPostJobTreeJson/?needRoot=false';
        Object.toAjaxJson(treeUrl, null, null, true, null, function (res) {
          if (res.success) {
            that.treeData = res.data;
            var msg = res.msg;
          } else {
            FUI.Window.showMsg(that, res.msg);
          }
        });
      },
      refreshGrid(parentGridId, parm) {
        var that = this;
        that.dataGridSearch();
      },
      dataGridReSet() {
        var that = this;
        $.each(this.searchParams, function (key, item) {
          that.searchParams[key] = '';
        });
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
      myOperationViewEvent(value, row, index) {
        this.showDialogEdit(FUI.FormAction.View, row[this.dg.IdField]);
      },
      myOperationEditEvent(value, row, index) {
        this.showDialogEdit(FUI.FormAction.Edit, row[this.dg.IdField]);
      },
      myOperationDeleteEvent(value, row, index) {
        let that = this;
        let id = row[this.dg.IdField];
        let parm = { keyId: id };
        FUI.Window.confirm(that, "您确定要删除吗（如果岗位下存在人员则无法删除）？", null, function () {
          Object.toAjaxJson("/admin/position/", "delete", parm, true, null,
            function (res) {
              if (res.success) {
                that.dataGridSearch();
                that.refreshTree();
              } else {
                FUI.Window.showMsg(that, res.msg);
              }
            });
        });
      },
      showDialogEdit(formAction, keyId) {
        var that = this;
        var title = formAction == FUI.FormAction.Add ? '新增' + that.dg.EditTitle : '编辑' + that.dg.EditTitle;
        var url = that.dg.EditUrl;
        if (formAction == FUI.FormAction.Add) {
          url = url + "?orgId=" + that.hidOrgId + "&orgName=" + that.hidOrgName + "&postJobCode=" + that.searchParams.postJobCode;
        }
        FUI.Window.openEdit(url, title, formAction, that.dg.GridId, 700, 500, null, that.dg.MainTable, keyId, null, null, null, true);
      },
      // 工具栏按钮
      myToolBarCustomButton() {
        var btns = [];
        btns.push({ code: 'importPositionByExcel', status: 'default', title: '导入岗位', alias: 'Import', name: '导入岗位', icon: 'fa fa-upload' });
        btns.push({ code: 'importUserPositionByExcel', status: 'default', title: '导入用户岗位关系', alias: 'Import', name: '导入用户岗位关系', icon: 'fa fa-upload' });
        return btns;
      },
      // 工具栏按钮事件
      toolbarButtonClickEvent({ btn }, event) {
        const code = btn.code;
        const that = this;
        if (code == 'closeEdit') {
          FUI.Window.closeEdit();
        } else if (code == 'default.add') {
          that.showDialogEdit(FUI.FormAction.Add, '');
        } else if (code == 'default.delete') {
          // 批量删除，默认执行FUI内部的删除，如有需要可用成自己的删除方法
          that.bathDeleteEvent();
        } else {
          var fn = that[code];
          fn();
        }
      },
      bathDeleteEvent() {
        let that = this;
        var ids = that.dg.getChecked();
        if (ids == "") {
          FUI.Window.showMsg(that, "请选择要删除的记录");
          return;
        }
        let parm = { keyId: ids };
        FUI.Window.confirm(that, "您确定删除所选岗位吗<br>（如果岗位下存在人员则不删除）？", null, function () {
          Object.toAjaxJson("/admin/position/", "deleteList", parm, true, null,
            function (res) {
              if (res.success) {
                that.dataGridSearch();
                that.refreshTree();
              } else {
                FUI.Window.showMsg(that, res.msg);
              }
            });
        });
      },
      // 操作列自定义按钮
      myOperationCustomButton(h, value, row, index) {
        var that = this;
        var custBtns = [];
        var item = { index: 0, title: '岗位人员', tip: '查看或管理岗位下的人员', class: 'fa fa-user', code: 'showUserPosition', click: () => this.showUserPosition(value, row, index) };
        custBtns.push(item);
        return custBtns;
      },
      showUserPosition(value, row, index) {
        let that = this;
        let postName = row.postName;
        let postCode = row.postCode;
        FUI.Window.openEdit('/admin/user/showUserPosition/?postCode=' + postCode, '【' + postName + '】岗位人员', 'Edit', that.dg.GridId, 780, 500, null, null, null, true);
      },
      //JS显示格式化示例
      opinitionTypeFormatter(row, column, value, index) {
        let result = value;
        switch (value.toString()) {
          case '0':
            result = '不同意类';
            break;
          case '1':
            result = '同意类';
            break;
        }
        return result;
      }
      , changeToPage() {
        var that = this;
        window.location.href = __webpath + "/admin/postjob/postJobList";
      }
      , importPositionByExcel() {
        FUI.Window.openEdit('/admin/position/importPositionByExcel', '导入岗位', FUI.FormAction.Edit, '', 550, 380);
      }
      , importUserPositionByExcel() {
        FUI.Window.openEdit('/admin/position/importUserPositionByExcel', '导入用户岗位关系', FUI.FormAction.Edit, '', 550, 380);
      }
    }
  }
</script>