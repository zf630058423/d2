<template>
  <div>
    <el-container>
      <el-container>
        <el-aside ref="sideLeft" class="f2bpm-page-left" hide-trigger collapsible :width="isCollapsed?'20px':'200px'">
          <div class="f2bpm-panel-head">
            <div v-if="!isCollapsed" class="f2bpm-left-search-div">
              <el-input v-model="treeFilterText" class="left-htead-treeFilterText-box" size="small" clearable :placeholder="$t('enterKey')" autocomplete="off" prefix-icon="el-icon-search" />
            </div>
            <div style=" float: right;line-height:35px;padding-right: 5px;">
              <i v-if="!isCollapsed" :title="$t('refresh')" class="fa fa-refresh  cur mr10 font12 " @click="loadTree()" />
              <i title="收起/展开" :class="rotateIcon" @click="collapsedSider" />
            </div>
          </div>

          <div v-if="!isCollapsed" class="auto-window-height f2bpm-page-left-content mt4" :style="'height:'+countLeftTreeHeight+'px;'">
            <div style="text-align: left;width: 180px;padding-left: 8px;padding-top: 5px;">
              <el-tooltip effect="dark" content="在表名上鼠标右键可对表对象进行“添加、修改、删除”" placement="left-end">
                <span class="fa  fa-question-circle">说明</span>
              </el-tooltip>
            </div>
            <span v-if="isShowAddMainBustBtn" class="fa fa-plus cur   ml5 mt5 font12 btn btn-primary btn-minier" @click="addMainBust()">添加主表对象</span>
            <el-tree ref="mytree" icon-class="fa fa-table" :data="treeData" :expand-on-click-node="false" :filter-node-method="filterTreeNode" default-expand-all @node-contextmenu="treeNodeContextmenu" @node-click="onTreeSelected" />
            <div v-show="menuVisible" id="treeMenu" class="treeRightMenu">
              <el-menu id="menu" text-color="#000" @select="treeNodeRightMenuSelect">
                <el-menu-item index="editeTable">
                  <i class="fa fa-edit" /> 编辑当前对象
                </el-menu-item>
                <el-menu-item index="deleteTable">
                  <i class="fa fa-trash-o" />删除当前对象
                </el-menu-item>
                <el-menu-item index="addSubTable">
                  <i class="fa fa-plus" />添加子级对象
                </el-menu-item>
              </el-menu>
            </div>
          </div>
        </el-aside>
        <el-main class="f2bpm-page-right">

          <f2bpm-gridsearchform :tableform="tableForm" :extenddes="extenddes" @searchformbtnclick="searchFormbtnClick" @updatevalue="updateFieldValue" />
          <f2bpm-datagrid ref="grid" grid="grid" :toolbar="tableToolbar" :context-menu="{header: {options: headerMenus},className: 'my-menus'}" :pager-config="tablePage" :data="tableData" :columns="tableColumn" @cell-dblclick="celldbClick" @toolbar-button-click="toolbarButtonClickEvent" @header-contextmenu="contextMenuClickEvent" @page-change="pageChange" @sort-change="sortChange" />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
  window.refTypeEditor = FUI.Tool.createrComboboxEditor([{
    'text': '多记录',
    'value': 'hasMany'
  }, {
    'text': '单条记录',
    'value': 'hasOne'
  }]);
  export default {
    data() {
      return {
        // 是否显示添加主表的按钮
        isShowAddMainBustBtn: true,
        // ====右键菜单====
        // 对象级别：attributes.leveltype:main/sub;对象级别：attributes.busObjectId,title:busObjectTitle
        rightMenuSelected: {},
        // ============================
        // 点击树节点当前表
        busObjectId: '',
        tableId: '',
        tableTitle: '',

        categoryCode: '',
        formDefId: '',
        isCreateTable: '0',

        menuVisible: false,
        treeFilterText: '',
        extenddes: "<span class='red'>点击左侧上的按钮“添加主表对象”</span>",

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
      countLeftTreeHeight() {
        return $(document).height() - 100;
      },
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
    created() {
      var formDefId = Object.toQueryString('formDefId');
      var categoryCode = Object.toQueryString('categoryCode') || '';
      var that = this;
      that.tablePage.pageSize = 100;
      that.categoryCode = categoryCode;
      that.formDefId = formDefId;

      that.loadTree();
      var dg = FUI.DataGrid.Create(that, 'key_BusObjectInnerJoinTableDefinition', 'f2bpm_form_BusObject', 'grid', true, true, true);
      dg.SortName = 'CreatedTime';
      dg.SortOrder = 'ASC';
      dg.DefaultWhere = "busObjectId='none'";
      dg.ShowNumbers = true;
      dg.ExpansMore = false;
      dg.EnableDblClickEdite = true;
      dg.OperationAction.ShowEdit = false;
      dg.OperationAction.ShowDelete = false;
      dg.OperationAction.ShowView = false;
      dg.ToolBarDefaultButtons.ShowAdd = false;
      dg.ToolBarDefaultButtons.ShowSearch = true;
      dg.ToolBarDefaultButtons.ShowDelete = false;
      dg.ToolBarCustomButton = this.myToolBarCustomButton;
      dg.EditTitle = '编辑子业务表';
      dg.EditUrl = __webpath + '/workflow/smartForm/busObjectEdit/?designer=1&isCreateTable=' + that.isCreateTable + '&parentId=' + that.busObjectId + '&categoryCode=' + that.categoryCode;
      dg.Bind();
    },
    mounted() {
      var that = this;

      window.myvm = that;
      // 添加监听
      document.addEventListener('click', this.listen);
      window.autoPageHeight();
    },

    methods: {
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
      treeNodeContextmenu(event, value, node, element) {
        this.menuVisible = true;
        const menu = document.querySelector('#treeMenu');
        /* 菜单定位基于鼠标点击位置 */
        menu.style.left = event.clientX + 20 + 'px';
        menu.style.top = event.clientY - 10 + 'px';
        this.rightMenuSelected = value;
      },
      treeNodeRightMenuSelect(key) {
        var that = this;
        var fn = that[key];
        fn();
      },
      listen() {
        this.menuVisible = false;
      },
      showAll() {
        this.dataGridSearch();
      },
      refreshTree() {
        this.loadTree();
      },
      loadTree() {
        var that = this;
        var treeUrl = FUI.Handlers.SmartFormHandler + 'getBoTreeJsonByFormDefId/?formDefId=' + that.formDefId;
        Object.toAjaxJson(treeUrl, null, null, true, null, function (res) {
          if (res.success) {
            that.treeData = res.data;
            var msg = res.msg;
            if (that.treeData.length > 0) {
              that.isShowAddMainBustBtn = false;
              if (that.tableId == '') {
                that.private_excuteTargetBoTable(that.treeData[0]);
              }
            } else {
              that.extenddes = "<span class='red'>点击左侧上的按钮“添加主表对象”</span>";
              that.isShowAddMainBustBtn = true;
            }
          } else {
            FUI.Window.showMsg(res.msg);
          }
        });
      },
      onTreeSelected(data, treeNode, thisObj) {
        var that = this;
        that.private_excuteTargetBoTable(data);
      },
      private_excuteTargetBoTable(data) {
        var that = this;
        // data结构:busObjectId,isCreateTable,leveltype:main,tableId,tableName,type:table
        that.busObjectId = data.id;
        that.tableId = data.attributes.tableId;
        that.busObjectId = data.attributes.busObjectId;
        that.tableTitle = data.text;
        that.isCreateTable = (data.attributes.isCreateTable == 'true' || data.attributes.isCreateTable === true) ? 1 : 0;
        var status = that.isCreateTable == 1 ? "<span class='btn btn-success btn-minier'>已生成</span>" : "<span class='btn btn-grey btn-minier'>未生成</span>";
        that.extenddes = '<span>【当前表：' + that.tableTitle + '，表状态：' + status + '】</span>';
        that.dg.DefaultWhere = "busObjectId='" + that.busObjectId + "'";
        that.dg.Reload();
        that.dg.EditUrl = __webpath + '/smartForm/busObjectEdit/?designer=1&sCreateTable=' + that.isCreateTable + '&parentId=' + that.busObjectId + '&categoryCode=' + that.categoryCode;
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
      // 工具栏按钮
      myToolBarCustomButton() {
        var that = this;
        var btns = [];
        // btns.push({
        //   code: 'goFormDefEdit',
        //   type: 'primary',
        //   name: '上一步',
        //   icon: 'fa fa-arrow-left'
        // });
        // btns.push({
        //   code: 'goFormFieldList',
        //   type: 'primary',
        //   name: '下一步',
        //   icon: 'fa fa-arrow-right'
        // });
        btns.push({ code: 'closeEdit', status: 'default', name: '关闭', icon: 'fa fa-close' });
        return btns;
      },
      myOperationViewEvent(value, row, index) {
        this.showDialogEdit(FUI.FormAction.View, row[this.dg.IdField]);
      },
      myOperationEditEvent(value, row, index) {
        this.showDialogEdit(FUI.FormAction.Edit, row[this.dg.IdField], row.IsCreatedInDB);
      },
      // 工具栏按钮事件
      toolbarButtonClickEvent({ code }, event) {
        const that = this;
        if (code == 'closeEdit') {
          FUI.Window.closeEdit(true, 'grid');
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
      addMainBust() {
        var that = this;
        // 添加主业务表及业务对象
        FUI.Window.openEdit(__webpath + '/workflow/smartForm/formBusObjectEdit/?leveltype=main&formAction=Add&categoryCode=' + that.categoryCode + '&formDefId=' + that.formDefId, '添加主表对象', FUI.FormAction.Add, null, 900, 550, null, 'f2bpm_form_BusObject', null, true);
      },
      addSubTable() {
        const that = this;
        console.info(that.rightMenuSelected);
        var busObjectId = that.rightMenuSelected.id;
        FUI.Window.openEdit(__webpath + '/workflow/smartForm/formBusObjectEdit/?leveltype=sub&parentId=' + busObjectId + '&categoryCode=' + that.categoryCode + '&formDefId=' + that.formDefId, '添加子表对象', FUI.FormAction.Add, null, 900, 550, null, 'f2bpm_form_BusObject', busObjectId, true);
      },
      editeTable() {
        const that = this;
        var busObjectId = that.rightMenuSelected.id;
        var leveltype = that.rightMenuSelected.attributes.leveltype;
        FUI.Window.openEdit(__webpath + '/workflow/smartForm/formBusObjectEdit/?leveltype=' + leveltype, '编辑表对象', FUI.FormAction.Edit, null, 900, 550, null, 'f2bpm_form_BusObject', busObjectId, true);
      },
      deleteTable() {
        const that = this;
        const busObjectId = that.rightMenuSelected.id;
        const busObjectTitle = that.rightMenuSelected.title;
        FUI.Window.confirm(that, '确定要删除【' + busObjectTitle + '】及所有子对象，如果已正式使用请慎重？', null, function (r) {
          var data = Object.toAjaxJson(FUI.Handlers.SmartFormHandler, 'deleteBusObjectAndAllCascade', {
            busObjectId: busObjectId,
            busObjectTitle: busObjectTitle
          });
          that.loadTree();
          that.refreshGrid();
        });
      },
      // 表单编辑
      goFormDefEdit() {
        window.location.href = __webpath + '/workflow/smartForm/formDefEdit/?parentGridId=grid&formAction=Edit&mainTable=f2bpm_form_FormDef&keyId=' + this.formDefId;
        //无#window.location.reload()
      },
      // 关联表
      goFormDefTableRelList() {
        var that = this;
        window.location.href = __webpath + '/workflow/smartForm/table/formDefTableRelList/?formDefId=' + this.formDefId + '&categoryCode=' + that.categoryCode;
      },
      // 业务表对象编辑
      goBusObjectSubsEdit() {
        var that = this;
        window.location.href = __webpath + '/workflow/smartForm/busObjectSubsEdit/?formDefId=' + this.formDefId + '&categoryCode=' + that.categoryCode;
      },
      // 字段元素
      goFormFieldList() {
        window.location.href = __webpath + '/workflow/smartForm/formFieldList/?formDefId=' + this.formDefId + '&categoryCode=' + this.categoryCode;
      },
      tabsClick(tab) {
        var that = this;
        var name = tab.name;
        if (name == 'goFormDefEdit') {
          that.goFormDefEdit();
        } else if (name == 'goBusObjectSubsEdit') {
          that.goBusObjectSubsEdit();
        } else if (name == 'goFormFieldList') {
          that.goFormFieldList();
        } else if (name == 'goFormDefTableRelList') {
          that.goFormDefTableRelList();
        }
      }
    }

  }
</script>
<style>
  .el-tree-node__expand-icon.is-leaf {
    color: #333 !important;
  }

  .el-tree-node__expand-icon {
    color: #333 !important;
  }
</style>