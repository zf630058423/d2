<template>
  <div class="f2bpm-page-layout">
    <el-container>
      <el-main class="f2bpm-page-right">
        <f2bpm-gridsearchform :tableform="tableForm" :extenddes="extenddes" @searchformbtnclick="searchFormbtnClick" @updatevalue="updateFieldValue" />
        <f2bpm-datagrid ref="grid" grid="grid" :toolbar="tableToolbar" :context-menu="{header: {options: headerMenus},className: 'my-menus'}" :pager-config="tablePage" :data="tableData" :columns="tableColumn" @cell-dblclick="celldbClick" @toolbar-button-click="toolbarButtonClickEvent" @header-contextmenu="contextMenuClickEvent" @page-change="pageChange" @sort-change="sortChange" />
      </el-main>
    </el-container>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        tableId: '',
        tableTitle: '',
        tableName: '',
        isCreateTable: '',
        isOuterTable: '',
        // ======stand:标准区=============
        extenddes: '',
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
        return this.isCollapsed ? 'icon icon-arrow-right-bold cur' : 'icon icon-arrow-left-bold cur';
      },
      positionIcon() {
        return this.isCollapsed ? 'cursor:pointer; position: relative;left: -5px;' : 'cursor:pointer; position: relative;left: 100px;';
      }
    },
    created() {
      var that = this;
      var tableId = Object.toQueryString('tableId');

      // 获取表定义信息
      var res = Object.toAjaxJson(FUI.Handlers.SmartFormHandler, 'getModelTableDefinition', { keyId: tableId });
      if (res.success) {
        var tableDef = res.data;
        that.dbTableName = tableDef.dbTableName;
        that.isCreateTable = tableDef.isCreateTable == true ? 1 : 0;
        that.isOuterTable = tableDef.isOuterTable == true ? 1 : 0;
        that.tableTitle = tableDef.tableTitle;
      } else {
        FUI.Window.showMsg(res.msg);
        return;
      }
      that.tableId = tableId;
      var dg = FUI.DataGrid.Create(that, 'f2bpm_form_TableColumn', 'f2bpm_form_TableColumn', 'grid', true, true, true);
      dg.SortName = 'CreatedTime';
      dg.SortOrder = 'ASC';
      dg.DefaultWhere = "(ColumnType='base' s_or  ColumnType='virtual') s_and TableId='" + tableId + "'";
      dg.ShowNumbers = true;
      dg.ExpansMore = false;
      dg.EnableDblClickEdite = true;

      dg.OperationAction.ShowDelete = true;
      dg.OperationAction.ShowEdit = true;
      dg.ShowNumbers = true;
      dg.EnableDblClickEdite = false;
      dg.OperationAfterSaveRowIsRefresh = true;
      dg.OperationAction.ShowView = false;
      // 工具栏
      dg.ToolBarDefaultButtons.ShowAdd = true;
      dg.ToolBarDefaultButtons.ShowDelete = that.isCreateTable != 1;
      dg.OperationEditEvent = this.myOperationEditEvent;
      dg.OperationViewEvent = this.myOperationViewEvent;
      dg.OperationDeleteEvent= this.myOperationDeleteEvent;
      dg.OperationCustomButton = this.myOperationCustomButton;
      dg.ToolBarCustomButton = this.myToolBarCustomButton;
      dg.EditUrl = __webpath + '/workflow/smartForm/tableColumnEdit/?isCreateTable=' + that.isCreateTable + '&tableId=' + that.tableId;
      dg.EditTitle = '字段';
      dg.Bind();
      var status = that.isCreateTable == 1 ? "<span class='btn btn-success btn-minier'>已生成</span>" : "<span class='btn btn-grey btn-minier'>未生成</span>";
      that.extenddes = '<span>【数据表：' + that.tableTitle + '<em>[' + that.dbTableName + ']</em>' + ' 状态：' + status + '】</span>';
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
            FUI.Window.showMsg(that, res.msg);
          }
        });
      },
      // ====stand:标准方法控制结束==============
      myOperationBeforeDeleteEvent(value, row, index) {
        var that = this;
        var value = row.IsCreatedInDB;
        if ((value == '' || value == null || value == undefined) && row.isCreateTable == 1) {
          FUI.Window.showMsg(that, '请先校验字段是否已创建！');
          return false;
        }
        if (value == '1' || value == 1) {
          FUI.Window.showMsg(that, '数据库字段已创建,不可删除！');
          return false;
        }
        return true;
      },
      myOperationDeleteEvent(value, row, index) {
        var that=this;
        console.info(row);
        var isCreatedInDB = row.IsCreatedInDB;
        if (isCreatedInDB == null || isCreatedInDB == undefined) {
          FUI.Window.showMsg(that, '请先校验字段是否已创建！');
          return false;
        }
        if (isCreatedInDB == '1' || isCreatedInDB == 1) {
          FUI.Window.showMsg(that, '数据库字段已创建,不可删除！');
          return false;
        }
        var param = { columnId: value };
        var result = Object.toAjaxJson(FUI.Handlers.SmartFormHandler, 'deleteColumnById', param);
        if (result.success) {
          FUI.Window.showMsg2(result.msg, null, result.success ? 1 : 7);
          that.dg.Reload();
        } else {
          FUI.Window.showMsg(result.msg);
        }
      },
      myOperationViewEvent(value, row, index) {
        this.showDialogEdit(FUI.FormAction.View, row[this.dg.IdField]);
      },
      myOperationEditEvent(value, row, index) {
        this.showDialogEdit(FUI.FormAction.Edit, row[this.dg.IdField], row.IsCreatedInDB);
      },
      showDialogEdit(formAction, keyId, isCreatedInDB) {
        var that = this;
        var title = formAction == FUI.FormAction.Add ? '新增' + that.dg.EditTitle : '编辑' + that.dg.EditTitle;
        var url = formAction == FUI.FormAction.Add ? that.dg.EditUrl : that.dg.EditUrl;
        FUI.Window.openEdit(url, title, formAction, that.dg.GridId, 800, 530, null, that.dg.MainTable, keyId);
      },
      // 工具栏按钮
      myToolBarCustomButton() {
        var that = this;
        var btns = [];
        btns.push({
          code: 'selectCreateGenFieldColumn',
          status: 'default',
          name: '从标准字段选取',
          icon: 'fa fa-clone',
          title: '从标准字段库中选择字段添加到当前表中'
        });
        btns.push({
          code: 'saveAsToGenField',
          status: 'default',
          name: '另存到字段库',
          icon: 'fa fa-floppy-o',
          title: '将选择的字段另存到标准字段库（如果字段库中已存在将另存失败）'
        });
        btns.push({
          code: 'createCreatedIdAndTime',
          status: 'default',
          name: '日期/创建人Id',
          icon: 'fa fa-clone',
          title: '新增创建日期/创建人Id字段，用于存放数据的创建人Id和创建时间'
        });
        if (that.isCreateTable == 1) {
          btns.push({
            code: 'generateDBColumn',
            status: 'default',
            name: '生成物理表字段',
            icon: 'fa fa-clone',
            title: '重重新创建尚未在物理表中存在的字段。'
          });
        }
        btns.push({
          code: 'checklistDbfieldIsCreatedInDB',
          status: 'default',
          name: '检查字段是否已创建',
          icon: 'fa fa-asterisk'
        });
        btns.push({ code: 'question1', status: 'default', name: '如何删除字段', icon: 'fa fa-question' });
        btns.push({
          code: 'createDefaultColumn',
          status: 'default',
          name: '生成系统字段',
          icon: 'fa fa-clone',
          title: '重新生成在线表单默认的系统字段'
        });
        if (that.isCreateTable == 0) {
          btns.push({ code: 'createTable', status: 'default', name: '生成物理表', icon: 'fa fa-table' });
        } else if (that.isOuterTable == 0) {
          btns.push({ code: 'deleteDBTable', status: 'danger', name: '删除物理表', icon: 'fa fa-trash-o' });
        }
        btns.push({ code: 'closeEdit', status: 'default', name: '关闭', icon: 'fa fa-close' });
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
        var that = this;
        var custBtns = [];
        var value = row.IsCreatedInDB;
        if (value == '' || value == null || value == undefined) {
          return custBtns;
        }
        if (value == '1' || value == 1) {
          return custBtns;
        }
        if (that.isCreateTable == 1) {
          var item = { title: '生成物理字段', tip: '生成物理字段', class: 'fa fa-clone', code: 'generateOneDBColumn', click: () => this.generateOneDBColumn(row.ColumnId) };
          custBtns.push(item);
        }
        return custBtns;
      },
      checklistDbfieldIsCreatedInDB() {
        var that = this;
        if (that.isCreateTable == 0) {
          FUI.Window.showMsg(that, '请先生成物理表');
          return;
        }
        FUI.Window.confirm(that, '确定校验检查字段是否已创建吗？', null, function (r) {
          var param = {
            tableId: that.tableId
          };
          var result = Object.toAjaxJson(FUI.Handlers.SmartFormHandler, 'checklistDbfieldIsCreatedInDB', param);
          FUI.Window.showMsg(that, result.msg);
          that.dg.Reload();
        });
      },
      generateOneDBColumn(columnId) {
        var that = this;
        if (that.isCreateTable == 0) {
          FUI.Window.showMsg(that, '请先生成物理表。');
          return;
        }
        FUI.Window.confirm(that, '您确定要生成物理字段吗？', null, function (r) {
          if (r) {
            var param = {
              'tableId': that.tableId,
              'columnId': columnId
            };
            var result = Object.toAjaxJson(FUI.Handlers.SmartFormHandler, 'generateOneDBColumn', param);
            FUI.Window.showMsg(that, result.msg, null, result.success ? 1 : 7);
            that.dg.Reload();
          }
        });
      },
      generateDBColumn(value, row, index) {
        var that = this;
        if (that.isCreateTable == 0) {
          FUI.Window.showMsg(that, '请先生成物理表。');
          return;
        }
        FUI.Window.confirm(that, '你确定要尝试重新生成在数据表中创建的字段吗？', null, function (r) {
          var param = {
            tableId: that.tableId
          };
          Object.toAjaxJson(FUI.Handlers.SmartFormHandler, 'generateDBColumn', param, true, null, function (result) {
            FUI.Window.showMsg(that, result.msg);
            that.dg.Reload();
          });
        });
      },
      createDefaultColumn() {
        var that = this;
        if (that.isCreateTable == 0) {
          FUI.Window.showMsg(that, '请先生成物理表');
          return;
        }
        FUI.Window.confirm(that, '确定尝试重新生成系统字段吗？', null, function (r) {
          var param = {
            tableId: that.tableId
          };
          var result = Object.toAjaxJson(FUI.Handlers.SmartFormHandler, 'createFixedcolumnByTableId', param);
          FUI.Window.showMsg(that, result.msg);
        });
      },
      createCreatedIdAndTime() {
        var that = this;
        FUI.Window.confirm(that, '确定添加创建人Id和创建时间字段吗？', null, function (r) {
          var param = {
            tableId: that.tableId
          };
          var result = Object.toAjaxJson(FUI.Handlers.SmartFormHandler, 'createCreatedIdAndTime', param);
          FUI.Window.showMsg(that, result.msg);
          that.dg.Reload();
        });
      },
      saveAsToGenField() {
        var that = this;
        var colIds = that.dg.getChecked();
        if (colIds == '') {
          FUI.Window.showMsg(that, '请选择要另存到字段库的字段。');
          return false;
        }
        // 选择分类
        var parm = { 'needRoot': false, singleSelect: true, groupKey: 'GeneralFieldGroup', data: [] };
        FUI.dialog('/workflow/selector/selectCategory/', '选择分类', parm, 450, 450, function (objectData, index, layerObject) {
          if (objectData.length > 0) {
            var ids = [];
            var titles = [];
            $.each(objectData, function (i, item) {
              ids.push(item.value);
              titles.push(item.text);
            });
            var setToCategoryCodes = ids.toString();
            var setToCategoryTitles = titles.toString();
            var data = Object.toAjaxJson(FUI.Handlers.SmartFormHandler, 'saveAsToGenField', {
              columnIds: colIds,
              categoryCode: setToCategoryCodes
            });
            if (data.success) {
              FUI.Window.showMsg(data.msg, null, 1);
            } else {
              FUI.Window.showMsg2(data.msg);
            }
            layerObject.close(index);
          } else {
            FUI.Window.showMsg('请选择字段的分类 ');
          }
        });
      },
      selectCreateGenFieldColumn() {
        var that = this;
        var parm = {
          customDialog: 'GeneralFieldSelect', isMulti: true, width: 800, height: 450,
          data: [],
          callBack: function (data, index, layerObject) {
            var fieldDataJson = JSON.stringify(data);
            var param = {
              tableId: that.tableId,
              dataJson: fieldDataJson
            };
            var result = Object.toAjaxJson(FUI.Handlers.SmartFormHandler, 'saveSelectGenFields', param);
            if (result.success) {
              that.dg.Reload();
              layerObject.close(index);
            } else {
              FUI.Window.showMsg(that, result.msg, null, result.success ? 1 : 7);
            }
          }
        };
        CustomDialog(that, parm);
      },
      deleteDBTable() {
        var that = this;
        var sysConfig = that.$store.state.app.sysConfig;
        var sysName = sysConfig == null ? "系统" : that.$store.state.app.sysConfig.sysName;
        if (that.isOuterTable == 1) {
          FUI.Window.showMsg(that, '不允许删除外部导入的物理表');
          return false;
        }
        if (!that.isCreateTable || that.isCreateTable == 0) {
          FUI.Window.showMsg2(that, '物理表未生成');
          return false;
        }
        FUI.Window.confirm(that, '注意当前系统是：《' + sysName + '》，<em>严重警告！严重警告！严重警告！</em>删除后将导致此表已有<em>数据丢失</em>，请谨慎操作,您确定要删除此物理表吗？', '删除警告', function (r) {
          FUI.Window.confirm(that, '<em>再次严重警告！再次严重警告！</em>,注意当前系统是：《' + sysName + '》，删除后将导致此表已有<em>数据丢失</em>，数据丢后失将无法挽回，请谨慎操作,您再次确定要删除此物理表吗？', '删除警告', function (r) {
            var data = Object.toAjaxJson(FUI.Handlers.SmartFormHandler, 'deleteDbTableByTableId', {
              'tableId': that.tableId
            });
            if (data.success) {
              FUI.Window.showMsg(that, data.msg, null, 1, function () {
                FUI.Window.closeEdit(true);
              });
            } else {
              FUI.Window.showMsg(that, data.msg);
            }
          });
        });
      },
      createTable() {
        var that = this;

        if (that.isCreateTable == true || that.isCreateTable == 1) {
          FUI.Window.showMsg(that, '物理表已生成，如果重新执行，请先删除物理表！');
          return false;
        }
        FUI.Window.confirm(that, '您确定要执行生成数据物理表吗？', '温馨提示', function (r) {
          var data = Object.toAjaxJson(FUI.Handlers.SmartFormHandler, 'createDbTableByTableId', {
            tableId: that.tableId
          }, true, null, function (data) {
            if (data.success) {
              FUI.Window.showMsg2(that, data.msg, null, 1, function () {
                FUI.Window.closeEdit(true);
              });
            } else {
              FUI.Window.showMsg(that, data.msg);
            }
          });
        });
      },
      columnTypeFormatter(row, column, value, index) {
        const cellValue = value;
        let result = cellValue;
        switch (cellValue.toString()) {
          case 'base':
            result = '<span class="cube bg-blue">物理字段</span>';
            break;
          case 'virtual':
            result = '<span class="cube bg-grey">虚拟字段</span>';
            break;
        }
        return result;
      },
      question1() {
        FUI.Window.showMsg(this, '删除已创建到数据库中的字段，此操作一般应用于测试平台上使用，正式生产环境时请警慎操作 。</br>第1：使用数据库工具打开数据库物理表,手工删除字段。</br>第2步：点击本页面上的“检查物理表字段是否已创建”；</br>第3步：查看“字段是否已创建”的列显示为红色“否”；</br>第4步： 若要修改：通过操作列修改字段定义，若要删除时：通过操作列删除按钮进行删除。</br>第5步：若想重新生成此字段，修改完后则点击操作列的生成物理字段按钮。（完）');
      }
    }
  }
</script>