<template>
  <div class="f2bpm-page-layout">
    <el-container>
      <el-main class="f2bpm-page-right">
        <f2bpm-gridsearchform :tableform="tableForm" @expandclick="expandClick" @searchformbtnclick="searchFormbtnClick" @updatevalue="updateFieldValue" />
        <f2bpm-datagrid ref="grid" :expand-search="expandSearch" grid="grid" height="full-150" :toolbar="tableToolbar" :context-menu="{header: {options: headerMenus},className: 'my-menus'}" :pager-config="tablePage" :data="tableData" :columns="tableColumn" @cell-dblclick="celldbClick" @toolbar-button-click="toolbarButtonClickEvent" @header-contextmenu="contextMenuClickEvent" @page-change="pageChange" @sort-change="sortChange" />
      </el-main>
    </el-container>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        expandSearch: "",
        postCode: "",
        userId: "",
        currCategoryCode: '',
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
        tableColumn: []
      };
    },
    computed: {
      countGridHeight() {
        return $(document).height() - global_datagridHeightDiff;
      }
    },
    created() {
      var that = this;
      window.myvm = that;
      var postCode = Object.toQueryString('postCode');
      var userId = Object.toQueryString('userId');
      that.postCode = postCode;
      that.userId = userId;
      var dg = FUI.DataGrid.Create(that, 'vw_sys_UserPositionList', 'sys_userinposition', 'grid', true, true, true);
      dg.SortName = 'created_time';
      dg.SortOrder = 'desc';
      dg.ShowNumbers = false;
      dg.Height = 330;
      if (postCode != "") {
        dg.DefaultWhere = "post_code='" + postCode + "'";
      } else if (userId != "") {
        dg.DefaultWhere = "user_id='" + userId + "'";
      }
      dg.ShowToolbar = true;
      dg.ToolBarDefaultButtons.ShowDelete = true;
      dg.ToolBarDefaultButtons.ShowAdd = false;
      dg.OperationAction.ShowEdit = false;
      dg.OperationAction.ShowView = false;
      dg.OperationAction.ShowView = false;
      dg.EnableDblClickEdite = false;
      dg.OperationDeleteEvent = this.myOperationDeleteEvent;
      dg.ToolBarCustomButton = this.myToolBarCustomButton;
      dg.OperationEditEvent = this.myOperationEditEvent;
      dg.OperationViewEvent = this.myOperationViewEvent;
      dg.OperationCustomButton = this.myOperationCustomButton;
      dg.Bind();
    },
    mounted() {
      window.myvm = this;
    },

    methods: {
      closeEdit() {
        FUI.Window.closeEdit();
      },
      collapsedSider() {
        this.isCollapsed = !this.isCollapsed;
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
        Object.toAjaxJson(that.dg.GetUrl(), null, parm, true, null, function (
          res
        ) {
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
      myOperationDeleteEvent(value, row, index) {
        let that = this;
        let id = row[this.dg.IdField];
        let parm = { keyId: id };
        FUI.Window.confirm(that, "您确定要用户的岗位关系吗？", null, function () {
          Object.toAjaxJson("/admin/userInPosition/", "delete", parm, true, null,
            function (res) {
              if (res.success) {
                that.dataGridSearch();
                that.refreshTree();
              } else {
                FUI.Window.showMsg(res.msg);
              }
            });
        });
      },
      bathDeleteEvent() {
        let that = this;
        var ids = that.dg.getChecked();
        if (ids == "") {
          FUI.Window.showMsg(that, "请选择要删除的记录");
          return;
        }
        let parm = { keyId: ids };
        FUI.Window.confirm(that, "您确定删除所选用户的岗位关系吗？", null, function () {
          Object.toAjaxJson("/admin/userInPosition/", "deleteList", parm, true, null,
            function (res) {
              if (res.success) {
                that.dataGridSearch();
                that.refreshTree();
              } else {
                FUI.Window.showMsg(res.msg);
              }
            });
        });
      },

      showDialogEdit(formAction, keyId) {
        var that = this;
        var title = formAction == FUI.FormAction.Add ? '新增' + that.dg.EditTitle : '编辑' + that.dg.EditTitle;
        FUI.Window.openEdit(that.dg.EditUrl, title, formAction, that.dg.GridId, 700, 550, null, that.dg.MainTable, keyId);
      },
      // 工具栏按钮
      myToolBarCustomButton() {
        let that = this;
        var btns = [];
        if (that.postCode != "") {
          btns.push({ code: 'selectUserToPosition', status: 'default', title: '分配岗位人员时将同时自动将人员加入到岗位所属的组织', name: '分配人员', icon: 'fa fa-plus' });
        }
        if (that.userId != "") {
          btns.push({ code: 'selectPositionToUser', status: 'default', title: '为人员分配岗位时将自动将人员加入到岗位所属的组织', name: '分配岗位', icon: 'fa fa-plus' });
        }
        btns.push({ code: 'closeEdit', status: 'default', name: '关闭' });
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
          that.bathDeleteEvent();
        } else {
          var fn = that[code];
          fn();
        }
      },
      // 操作列自定义按钮
      myOperationCustomButton(h, value, row, index) {
        var custBtns = [];
        var item = { index: 99, title: '设置为主岗位', tip: '设置为主岗位', class: 'fa fa-external-link-square', code: 'setMasterUserOrg', click: () => this.setMasterPosition(row.postCode, row.userId, row.postName, row.isMaster, row.realName) };
        custBtns.push(item);
        return custBtns;
      },
      onBeforeDelete(value, row, index) {
        if (row.IsMaster == 1 || row.IsMaster == 'true') {
          FUI.Window.showMsg('主归属组织不能删除');
          return false;
        }
        return true;
      },
      statusFormatter(row, column, value, index) {
        const cellValue = value;
        let result = cellValue;
        switch (cellValue.toString()) {
          case '0':
            result = "<span class='cube bg-red'>禁用</span>";
            break;
          case '1':
            result = "<span class='cube bg-blue'>正常</span>";
            break;
        }
        return result;
      },
      isMasterFormatter(row, column, value, index) {
        const cellValue = value;
        let result = cellValue;
        return result ? "<span class='cube bg-light blue'>是</span>" : "<span class='cube bg-light grey'>否</span>";
      },
      //分配用户给岗位
      selectUserToPosition() {
        var that = this;
        var widht = 700;
        var height = 470;
        var url = __webpath + '/workflow/selector/selectOnlyUsers/';
        var title = '选择用户';
        if (that.orgId == '') {
          FUI.Window.showMsg2('请点击选择左侧组织');
          return false;
        }

        FUI.dialog(url, title, null, widht, height, function (objectData, index, layer) {
          if (objectData.length > 0) {
            var titles = [];
            var data = [];
            var ids = [];
            $.each(objectData, function (i, item) {
              titles.push(item.realName);
              ids.push(item.userId);
            });
            if (ids.length > 0) {
              // 批量保存
              var result = Object.toAjaxJson("/admin/userInPosition/", 'saveSelectUserToPosition', {
                postCode: that.postCode,
                userIds: ids.toString()
              });
              FUI.Window.showMsg(that, result.msg, null, 1);
              that.refreshGrid();
            }
          }
          layer.close(index);
          return false;
        }, true, null, null, 1);
      },
      //分配岗位给用户
      selectPositionToUser() {
        var that = this;
        var widht = 980;
        var height = 500;
        var url = __webpath + '/workflow/selector/selectPosition/';
        var title = '选择岗位';
        if (that.userId == '') {
          FUI.Window.showMsg2('请选择用户');
          return false;
        }
        FUI.dialog(url, title, null, widht, height, function (objectData, index, layer) {
          if (objectData.length > 0) {
            var titles = [];
            var data = [];
            var ids = [];
            $.each(objectData, function (i, item) {
              titles.push(item.postName);
              ids.push(item.postCode);
            });
            if (ids.length > 0) {
              var result = Object.toAjaxJson("/admin/userInPosition/", 'saveSelectPositionToUser', {
                postCodes: ids.toString(),
                userId: that.userId
              });
              FUI.Window.showMsg(that, result.msg, null, 1);
              that.refreshGrid();
            }
          }
          layer.close(index);
          return false;
        }, true, {fit:false}, null, 1);
      }
      , setMasterPosition(postCode, userId, postName, isMaster, realName) {
        var that = this;
        if (isMaster == true || isMaster == 1) {
          FUI.Window.showMsg2(that, '当前已是主岗位', null, "error");
          return false;
        }
        FUI.Window.confirm(that, '确定要设置【' + postName + '】为用户【' + realName + '】的主岗位吗？</br>（一个用户有且仅有一个主岗位）', null, function (r) {
          var result = Object.toAjaxJson("/admin/userInPosition/", 'setMasterPosition', {
            postCode: postCode,
            userId: userId
          });
          if (result.success == true) {
            that.refreshGrid();
            FUI.Window.showMsg2(that, result.msg, null, result.success == true ? 1 : 7);
          } else {
            FUI.Window.showMsg(that, result.msg, null, 7);
          }
        });
      },

    }
  }
</script>