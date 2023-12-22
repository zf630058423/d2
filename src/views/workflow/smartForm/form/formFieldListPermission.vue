<template>
  <div class="f2bpm-page-layout">
    <el-container>
      <el-aside ref="sideLeft" class="f2bpm-page-left" hide-trigger collapsible :width="isCollapsed?'20px':'200px'">
        <div class="f2bpm-panel-head">
          <div v-if="!isCollapsed" class="f2bpm-left-search-div">
            <el-input v-model="treeFilterText" class="left-htead-treeFilterText-box" size="small" clearable :placeholder="$t('enterKey')" autocomplete="off" prefix-icon="el-icon-search" />
          </div>
          <div style=" float: right;line-height:35px;padding-right: 5px;">
            <i v-if="!isCollapsed" :title="$t('refresh')" class="fa fa-refresh  cur mr10 font12 " @click="showAll()" />
            <i title="收起/展开" :class="rotateIcon" @click="collapsedSider" />
          </div>
        </div>

        <div v-if="!isCollapsed" class="auto-window-height f2bpm-page-left-content mt4">
          <el-tree ref="mytree" :data="treeData" :filter-node-method="filterTreeNode" :expand-on-click-node="false" default-expand-all @node-contextmenu="treeNodeContextmenu" @node-click="onTreeSelected" />
          <div v-show="menuVisible" id="treeMenu" class="treeRightMenu">
            <el-menu id="menu" text-color="#000" @select="treeNodeRightMenuSelect">
              <el-menu-item index="tableRowAddPower">
                <i class="fa fa-edit" /> 设置“添加按钮”的权限
              </el-menu-item>
              <el-menu-item index="tableRowDelPower">
                <i class="fa fa-trash-o" />设置“删除按钮”的权限
              </el-menu-item>
              <el-menu-item index="tableOperationCustomButtonPower">
                <i class="fa fa-plus" />设置“自定义按钮”权限
              </el-menu-item>
            </el-menu>
          </div>
        </div>
      </el-aside>
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
        menuVisible: false,
        formKey: '',
        appId: '',
        rightId: '',
        formDefId: '',
        currentBoId: '',
        currentBoTitle: '',
        currentTableId: '',
        currentTableName: '',
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
      };
    }, computed: {
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
    watch: {
      treeFilterText(val) {
        this.$refs.mytree.filter(val);
      }
    },
    mounted() {
      // 添加监听
      document.addEventListener('click', this.listen);
      window.autoPageHeight();
    },
    created() {
      // 纯表单字段权限或其它权限
      var formKey = Object.toQueryString('formKey') || '';
      // 流程应用 字段权限
      var appId = Object.toQueryString('appId') || '';
      var $vm = this;
      $vm.formKey = formKey;
      var mothed = appId ? 'getRightInfoByAppId' : 'getRightInfoByFormKey';
      // 获取授权RightInfo
      var res = Object.toAjaxJson(FUI.Handlers.SmartFormHandler, mothed, { formKey: formKey, appId: appId });
      if (res.success) {
        var rightInfo = res.data;
        $vm.rightId = rightInfo.rightId;
        $vm.appId = rightInfo.appId;
        $vm.formDefId = rightInfo.formDefId;
      } else {
        FUI.Window.showMsg('获取权限定义请求出错' + res.msg);
      }
      var dg = FUI.DataGrid.Create($vm, 'key_FormFieldListPermission', 'f2bpm_form_FormDefField', 'grid', true, true, true);
      dg.SortName = 'FieldOrderNo';
      dg.SortOrder = 'ASC';
      dg.DefaultWhere = " FormDefId='" + $vm.formDefId + "' s_and ColumnType='base' ";
      dg.Options = {
        pageSize: 1000
      };
      dg.OperationAction.ShowEdit = true;
      dg.OperationAction.ShowView = false;
      dg.OperationEditEvent = this.myOperationEditEvent;
      dg.OperationAction.ShowView = false;
      // 工具栏
      dg.ToolBarDefaultButtons.ShowAdd = false;
      dg.ToolBarDefaultButtons.ShowSearch = true;
      dg.ToolBarDefaultButtons.ShowDelete = false;
      dg.ToolBarCustomButton = this.myToolBarCustomButton;
      dg.EditUrl = '/workflow/smartForm/formFieldPermissionEdit/?appId=' + $vm.appId + '&rightId=' + $vm.rightId;
      dg.EditTitle = '】字段权限';
      dg.Bind();
      $vm.loadTree();
    },

    methods: {
      listen() {
        this.menuVisible = false;
      },
      collapsedSider() {
        this.isCollapsed = !this.isCollapsed;
      },
      closeEdit() {
        FUI.Window.closeEdit();
      },
      pageChange({ currentPage, pageSize }) {
        this.tablePage.currentPage = currentPage;
        this.tablePage.pageSize = pageSize;
        this.tablePage.startIndex = (currentPage - 1) * pageSize;
        this.getGridData();
      },
      dataGridReSet() {
        var that = this;
        $.each(this.searchParams, function (key, item) {
          that.searchParams[key] = '';
        });
        // 重置查询
        this.dataGridSearch();
      },
      filterTreeNode(value, data) {
        if (!value) return true;
        return data.title.indexOf(value) !== -1;
      },
      showAll() {
        this.searchParams.CategoryCode = '';
        this.dataGridSearch();
      },
      loadTree() {
        var that = this;
        var treeUrl = FUI.Handlers.SmartFormHandler + 'getBoTreeJsonByFormDefId/?formDefId=' + that.formDefId;
        Object.toAjaxJson(treeUrl, null, null, true, null, function (res) {
          if (res.success) {
            that.treeData = res.data;
            var msg = res.msg;
          } else {
            FUI.Window.showMsg(that, res.msg);
          }
        });
      },
      onTreeSelected(data, treeNode, thisObj) {
        this.currentBoId = treeNode.data.id;
        this.currentBoTitle = treeNode.data.title;
        var attObj = data.attributes;
        this.currentTableName = attObj.tableName;
        this.currentTableId = attObj.tableId;
        this.dg.DefaultWhere = " FormDefId='" + this.formDefId + "' s_and ColumnType='base'  s_and BusObjectId='" + this.currentBoId + "'";
        this.dataGridSearch();
      },
      // 刷新列表
      refreshGrid(parentGridId, parm) {
        var that = this;
        that.dataGridSearch();
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
      myOperationBeforeDeleteEvent(value, row, index) {
        if (confirm('删除后将影响表单设计模板中对应的字段控件容器div的fieldId的ID值，请删除后需到表单设计器中删除对应的字段控件或者手动修改表单模板中的这个值。请慎重评估是否要删除！')) {
          return true;
        }
        return false;
      },
      myOperationEditEvent(value, row, index) {
        var fieldTitle = row.FieldTitle;
        this.showDialogEdit(value, FUI.FormAction.Edit, fieldTitle);
      },
      showDialogEdit(keyIdValue, fromAction, fieldTitle) {
        var that = this;
        var title = '设置【' + fieldTitle + that.dg.EditTitle;
        var url = that.dg.EditUrl;
        var parms = {
          fieldIds: keyIdValue
        };
        FUI.Window.openEdit(url, title, formAction, that.dg.GridId, 870, 500, null, that.dg.MainTable, keyIdValue, false, null, parms);
      },
      // 工具栏按钮
      myToolBarCustomButton() {
        var btns = [];
        btns.push({
          code: 'editPermission',
          type: 'primary',
          name: '批量授权',
          icon: 'fa fa-gears',
          title: ''
        });
        btns.push({
          code: 'closeEdit',
          type: 'primary',
          name: '关闭',
          icon: 'fa fa-close',
          title: '关闭'
        });
        return btns;
      },
      // 工具栏按钮事件
      toolbarButtonClickEvent({ code }, event) {
        const that = this;
        if (code == 'default.add') {
          that.showDialogEdit(FUI.FormAction.Add, '');
        } else if (code == 'default.delete') {
          that.myToolBarDeleteEvent();
        } else {
          var fn = that[code];
          fn();
        }
      },
      editPermission() {
        const that = this;
        var ids = that.dg.getChecked('FieldId');
        if (ids == '') {
          FUI.Window.showMsg(that, '请选择字段');
          return false;
        }
        var parm = {
          fieldIds: ids,
          type: 'field'
        };
        FUI.Window.openEdit(that.dg.EditUrl, '【批量设置' + that.dg.EditTitle, FUI.FormAction.Edit, that.dg.GridId, 880, 580, null, that.dg.MainTable, null, false, null, parm);
      },
      tableRowAddPower() {
        const that = this;
        var fieldId = that.currentBoId;
        var parms = {
          fieldIds: fieldId,
          type: 'bo',
          actionName: that.currentTableName + '.addRow'
        };
        FUI.Window.openEdit(that.dg.EditUrl, '设置【' + that.currentBoTitle + '】添加行权限', FUI.FormAction.Edit, that.dg.GridId, 880, 580, null, null, fieldId, false, null, parms);
      },
      tableRowDelPower() {
        var that = this;
        var fieldId = that.currentTableId;
        var parms = {
          fieldIds: fieldId,
          type: 'bo',
          actionName: that.currentTableName + '.deleteRow'
        };
        FUI.Window.openEdit(that.dg.EditUrl, '设置【' + that.currentBoTitle + '】删除行权限', FUI.FormAction.Edit, that.dg.GridId, 880, 580, null, null, fieldId, false, null, parms);
      },
      // 操作列自定义按钮权限
      tableOperationCustomButtonPower() {
        var that = this;
        var url = '/workflow/smartForm/formSubTableCustButtonPermission?obTableName=' + that.currentTableName + '&boId=' + that.currentBoId + '&appId=' + that.appId + '&rightId=' + that.rightId;
        FUI.Window.openEdit(url, '设置【' + that.currentBoTitle + '】操作列按钮权限', FUI.FormAction.Edit, that.dg.GridId, 880, 580, null, null, '', true);
      },
      treeNodeContextmenu(event, value, node, element) {
        this.menuVisible = true;
        const menu = document.querySelector('#treeMenu');
        /* 菜单定位基于鼠标点击位置 */
        menu.style.left = event.clientX + 20 + 'px';
        menu.style.top = event.clientY - 10 + 'px';
        console.info(value);
        var attObj = value.attributes;
        this.currentTableId = attObj.tableId;
        this.currentBoId = attObj.busObjectId;
        this.currentTableName = attObj.tableName;
        this.currentBoTitle = value.text;
      },
      treeNodeRightMenuSelect(key) {
        var that = this;
        var fn = that[key];
        fn();
      }
    }
  }
</script>