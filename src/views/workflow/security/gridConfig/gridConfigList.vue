<template>
  <div class="f2bpm-page-layout">
    <el-container>
      <el-main class="f2bpm-page-right">
        <f2bpm-gridsearchform :tableform="tableForm" @searchformbtnclick="searchFormbtnClick" @updatevalue="updateFieldValue" />
        <f2bpm-datagrid ref="grid" grid="grid" :toolbar="tableToolbar" :context-menu="{header: {options: headerMenus},className: 'my-menus'}" :pager-config="tablePage" :data="tableData" :columns="tableColumn" @toolbar-button-click="toolbarButtonClickEvent" @header-contextmenu="contextMenuClickEvent" @cell-dblclick="celldbClick" @page-change="pageChange" @sort-change="sortChange" />
      </el-main>
    </el-container>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        // ======stand:标准区=============
        is_extend_custgrid: false,
        searchListName: '',
        configTableName: '',
        tableName: '',
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
        // ===========标准区结束==========
        searchParams: {
          // 特殊查询
        }
      };
    },
    computed: {
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
    created() {
      var that = this;
      var tableName = Object.toQueryString('tableName');
      var configTableName = Object.toQueryString('configTableName') || '';
      var searchListName = configTableName;
      if (configTableName == '') {
        searchListName = tableName;
      }
      that.tableName = tableName;
      that.configTableName = configTableName;
      that.searchListName = searchListName;
      that.is_extend_custgrid = false;
      if (configTableName != '' && Object.toStartWith(configTableName, 'extend_custgrid_')) {
        that.is_extend_custgrid = true;
      }
      that.tablePage.pageSize = 200;
      var dg = FUI.DataGrid.Create(that, 'f2bpm_sys_GridConfig', 'f2bpm_sys_GridConfig', 'grid', true, true, true);
      dg.SortName = 'OrderNum';
      dg.SortOrder = 'ASC';
      dg.ShowNumbers = true;
      dg.ExpansMore = false;
      if (tableName) {
        dg.DefaultWhere = Object.toStringFormat(" tableName='{0}' ", searchListName);
      }
      // 是否开启双击编辑
      dg.EnableDblClickEdite = true;
      dg.OperationAction.ShowEdit = false;
      dg.OperationAfterSaveRowIsRefresh = false;
      dg.OperationAction.ShowView = false;
      dg.ToolBarDefaultButtons.ShowAdd = false;
      // 工具栏
      if (that.is_extend_custgrid == true) {
        dg.ToolBarDefaultButtons.ShowAdd = true;
      }
      dg.ToolBarDefaultButtons.ShowDelete = true;
      dg.OperationEditEvent = this.myOperationEditEvent;
      dg.OperationViewEvent = this.myOperationViewEvent;
      dg.ToolBarCustomButton = this.myToolBarCustomButton;
      if (searchListName == 'f2bpm_sys_GridConfig') {
        dg.HidColumns = ['DbField'];
      }
      dg.EditUrl = __webpath + '/workflow/pageRoute/opinionEdit/';
      dg.EditTitle = '常用意见';
      dg.Bind();
    },
    mounted() {
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
            that.$message.error(res.msg, { duration: 0 });
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
        FUI.Window.openEdit(that.dg.EditUrl + '?isOnlyMySelf=' + that.isOnlyMySelf, title, formAction, that.dg.GridId, 600, 450, null, that.dg.MainTable, keyId);
      },
      // 工具栏按钮
      myToolBarCustomButton() {
        var that = this;
        var btns = [];
        btns.push({ code: 'copyAdd', type: 'primary', name: '复制', alias: 'Copy Add', title: '复制字段', icon: 'icon icon-fuzhi1' });
        btns.push({ code: 'exportSqlFile', type: 'primary', name: '导出SQL脚本', alias: 'Export SQL Script', icon: 'fa fa-database' });
        btns.push({ code: 'autoReSetFiledDefOrderNo', type: 'primary', name: '规整排序', alias: 'Auto Set Sort No', icon: 'fa fa-cog' });
        if (that.is_extend_custgrid != true) {
          btns.push({ code: 'setFieldTheSameDbField', type: 'primary', name: '字段属性等于数据库字段', alias: 'Set Property Field  Equals Database Field', icon: 'fa fa-cog', title: '将全部“字段属性名”设置为“数据库字段”的名称' });
          btns.push({ code: 'refreshGridConfigField', type: 'primary', name: '同步字段', alias: 'Sync Field', icon: 'fa fa-retweet' });
        }
        btns.push({ code: 'bathSetWidth', type: 'primary', name: '设置宽度', alias: 'Set Width', icon: 'fa fa-cog' });
        btns.push({ code: 'refreshcache', type: 'primary', name: '刷新缓存', alias: 'Flush Cache', icon: 'fa fa-refresh' });
        btns.push({ code: 'closeEdit', type: 'primary', name: '关闭', alias: 'Close', icon: 'fa fa-close' });
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
          that.dg.ToolBarBathDelete(that);
        } else {
          var fn = that[code];
          fn();
        }
      },
      showQuestion() {
        FUI.Window.showMsg(this, '【大文本[text]字段务必将“是否Select输出”即是列表Json是否输出,在列表的Json中不输出此大文本的字段值，以减少页面资源浪费】');
      },
      refreshcache() {
        var that = this;
        Object.toAjaxJson(FUI.Handlers.WorkflowManageHandler, 'refreshcache', null, null, null, function (data) {
          FUI.Window.showMsg2(that, data.msg, null, 1);
        });
      },
      refreshGridConfigField() {
        var that = this;
        var tipMsg = '确定要同步字段配置吗？';
        if (Object.toStartWith(that.searchListName, 'custGrid_WorkflowForm_')) {
          tipMsg = '这是一个来自“表单应用”的列表配置，是否重新对比表单字段，表头配置如果不存在的字段则新增，已存在的不变化。（如果您手动修改了物理表为视图，则会反射取视图进行对比）。';
          FUI.Window.confirm(that, tipMsg, null, function (r) {
            var param = {
              'configTableName': that.configTableName
            };
            var result = Object.toAjaxJson('/workflow/security/customDataGrid/', 'synchronizeCustomDataGridHead', param);
            FUI.Window.showMsg(that, result.msg);
            that.dg.Reload();
          });
          return false;
        }

        FUI.Window.confirm(that, tipMsg, null, function (r) {
          var param = {
            'tableName': that.tableName,
            'configTableName': that.configTableName
          };
          var result = Object.toAjaxJson('/workflow/fuiFramework/', 'refreshGridConfigField', param);
          FUI.Window.showMsg(that, result.msg);
          that.dg.Reload();
        });
      },
      exportSqlFile(saveSqlFile) {
        var that = this;
        var isSaveSqlFile = saveSqlFile || false;
        var ids = that.dg.getChecked();
        try {
          var exportName = that.searchListName;
          Object.toAjaxDownloadFile(FUI.Handlers.WorkflowManageHandler, 'downloadGridConfigSql', {
            'ids': ids,
            isSaveSqlFile: isSaveSqlFile,
            tableName: exportName
          });
        } catch (err) {
          FUI.Window.showMsg(that, '下载失败');
        }
      },
      closePage() {
        parent.FUI.layuiLayer.closeAll();
      },
      fromTemplate(type) {
        return false;
        FUI.Window.openEdit('showFromTemplateHtml/?tableName=' + Object.toQueryString('tableName') + '&type=' + type, '查看表单模板', FUI.FormAction.View, null);
      },
      copyAdd() {
        var that = this;
        var ids = FUI.Grid.getGridChecked(that, 'grid', 'Id');
        if (!ids) {
          FUI.Window.showMsg('请选择要复制的数据！');
          return false;
        }
        // if (ids.indexOf(',') > -1) {
        //   FUI.Window.showMsg('只能选择一条要复制的数据！');
        //   return false;
        // }
        var tableName = that.tableName;
        Object.toAjaxJson(FUI.Handlers.FuiFrameworkHandler, 'copyAddGridConfigItem', { 'ids': ids }, true, null, function (data) {
          if (data.success) {
            that.refreshGrid();
            FUI.Window.showMsg2(that, data.msg, null, 1);
          } else {
            FUI.Window.showMsg2(that, data.msg);
          }
        });

      },
      autoReSetFiledDefOrderNo() {
        var that = this;
        FUI.Window.confirm(that, '确定规整排序号吗？', null, function (r) {
          var data = Object.toAjaxJson(FUI.Handlers.FuiFrameworkHandler, 'autoSetGridFieldOrderNo', {
            'configTableName': that.searchListName
          });
          if (data.success == true) {
            that.dg.Reload();
          } else {
            FUI.Window.showMsg(data.msg);
          }
        });
      },
      setFieldTheSameDbField() {
        var that = this;
        FUI.Window.confirm(that, '将全部“字段属性名”重新设置为“数据库字段”的名称吗？', null, function () {
          var data = Object.toAjaxJson(FUI.Handlers.FuiFrameworkHandler, 'setFieldTheSameDbField', {
            'configTableName': that.searchListName
          });
          if (data.success == true) {
            that.dg.Reload();
          } else {
            FUI.Window.showMsg(that, data.msg);
          }
        });
      },
      bathSetWidth() {
        var that = this;
        var ids = that.dg.getChecked();
        if (ids == '') {
          FUI.Window.showMsg(that, '请选择要批量设置宽度的行！');
          return false;
        }
        var json = {};
        // 初始值
        json.fieldValue = '';
        json.fieldTitle = '宽度';
        // 编辑器对象
        json.editor = null;
        json.editorType = 'textbox';
        json.dataType = 'number';
        json.required = true;
        FUI.dialog(__webpath + '/workflow/selector/commonEditor', '编辑[' + json.fieldTitle + ']', json, 700, 460, function (objectData, index, layer) {
          if (objectData.success == false) {
            return false;
          } else {
            var value = objectData.value;
            var data = Object.toAjaxJson(FUI.Handlers.FuiFrameworkHandler, 'setFieldWdith', {
              'tableName': that.searchListName,
              'ids': ids,
              'width': value

            });
            if (data.success == true) {
              that.dg.Reload();
              layer.close(index);
            } else {
              FUI.Window.showMsg(that, data.msg);
            }
          }
        }, true);
      }

    }
  }
</script>