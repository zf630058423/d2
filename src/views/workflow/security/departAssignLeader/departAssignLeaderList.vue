<template>
  <div class="f2bpm-page-layout">
    <el-container v-if="!isShow404">
      <el-aside ref="sideLeft" v-if="isShowLeft" class="f2bpm-page-left" hide-trigger collapsible :width="isCollapsed?'20px':'200px'">
        <div class="f2bpm-panel-head">
          <div v-if="!isCollapsed" class="f2bpm-left-search-div">
            <el-input v-model="treeFilterText" class="left-htead-treeFilterText-box" size="small" clearable :placeholder="$t('enterKey')" autocomplete="off" prefix-icon="el-icon-search" />
          </div>
          <div class="f2bpm-left-search-button-div">
            <i v-if="!isCollapsed" :title="$t('refresh')" class="icon icon-shuaxin  cur mr10 font12  " @click="loadTree()"></i>
            <i title="收起/展开" :class="rotateIcon" @click="collapsedSider" />
          </div>
        </div>

        <div v-if="!isCollapsed" class="auto-window-height f2bpm-page-left-content mt4" :style="'height:'+countLeftTreeHeight+'px;'">
          <div class="mytree-cube-box-container">
            <span class="cur  mytree-cube-box " @click="showAll()"><i class="icon icon-quanbu font16"></i> {{$t('all')}}</span>
            <span class="cur  mytree-cube-box" @click="relationTypeList()" title="管理组织分管领导类型"><i class="icon icon-fenlei font16"></i> {{$t('manage')}}</span>
          </div>
          <el-tree ref="mytree" :data="treeData" :expand-on-click-node="false" :filter-node-method="filterTreeNode" default-expand-all @node-click="onTreeSelected" />
        </div>
      </el-aside>
      <el-main class="f2bpm-page-right">
        <f2bpm-gridsearchform @expandclick="expandClick" :tableform="tableForm" @searchformbtnclick="searchFormbtnClick" @updatevalue="updateFieldValue" />
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
        isShow404: false,
        expandSearch: "",
        signle: 0,
        isShowLeft: true,
        hidOrgId: '',
        hidOrgName: '',
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
        data: {
          AddLeaderType: '',
          AddLeaderTypeTitle: "",
        },
        // ===========标准区结束==========
        searchParams: {
          // 特殊查询
          AssignOrgId: ''
        }
      };
    }, computed: {
      countLeftTreeHeight() {
        return $(document).height() - 120;
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
      var $vm = this;
      var that = this;
      const orgId = Object.toQueryString('orgId');
      const hidOrgName = Object.toQueryString('hidOrgName');
      const signle = Object.toQueryString('signle') || 0;
      var departassignleaderMode = 'default';
      if (orgId) {
        that.hidOrgId = orgId;
        that.hidOrgName = hidOrgName;
        that.searchParams.AssignOrgId = orgId;
      }
      if (signle == 1) {
        that.isShowLeft = false;
        that.signle = 1;
      }
      var dg = FUI.DataGrid.Create($vm, 'key_departAssignLeader', 'f2bpm_sys_DepartAssignLeader', 'grid', true, true, true);
      dg.SortName = 'UserAccount';
      dg.SortOrder = 'asc';
      dg.OperationAction.ShowEdit = false;
      dg.OperationAction.ShowView = false;
      dg.OperationAction.ShowDelete = departassignleaderMode == 'default';
      dg.ToolBarDefaultButtons.ShowDelete = departassignleaderMode == 'default';
      // 工具栏
      dg.ToolBarDefaultButtons.ShowAdd = false;
      dg.ToolBarDefaultButtons.ShowSearch = true;
      dg.ToolBarDefaultButtons.ShowDelete = true;
      dg.ToolBarCustomButton = this.myToolBarCustomButton;
      if (departassignleaderMode != 'default') {
        dg.HidColumns = ['Id'];
      }
      dg.Bind();
      if (that.signle == 0) {
        that.loadTree();
      }
    },
    mounted() {
      var that = this;
      window.myvm = this;
      if (that.hidOrgId == 'Root') {
        that.isShow404 = true;
      } else {
        that.isShow404 = false;
      }
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
      showAll() {
        this.searchParams.AssignOrgId = '';
        this.dataGridSearch();
      },
      loadTree() {
        var that = this;
        var treeUrl = FUI.Handlers.OrgImplController + 'getOrgList/?needRoot=false';
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
        this.hidOrgId = treeNode.data.id;
        this.hidOrgName = treeNode.data.title;
        this.searchParams.AssignOrgId = treeNode.data.id;
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
      // 工具栏按钮
      myToolBarCustomButton() {
        var btns = [];
        btns.push({ code: 'addAssignLeader', type: 'primary', name: '分配组织领导', alias: 'Assign Leader To Dep', icon: 'fa fa-users' });
        return btns;
      },
      // 工具栏按钮事件
      toolbarButtonClickEvent({ code }, event) {
        const that = this;
        if (code == 'default.add') {
          that.showDialogEdit(FUI.FormAction.Add, '');
        } else if (code == 'default.delete') {
          // 批量删除，默认执行FUI内部的删除，如有需要可用成自己的删除方法
          that.dg.ToolBarBathDelete(that);
        } else {
          var fn = that[code];
          fn();
        }
      },
      formatterRelTypeName(row, column, value, index) {
        var str = '<span class="label label-info arrowed-right arrowed-in">' + value + '</span>';
        return str;
      }
      //选择关系类型
      , selectRelationType(inputKey, inputName, infoType, passParm, singleSelect, resultKeyIsJson) {
        var that = this;
        WF.SelectorDialog.selectRelationType(that, inputKey, inputName, infoType, passParm, singleSelect, resultKeyIsJson, function (data) {
          that.data.AddLeaderType = data[0].typeCode;
          that.data.AddLeaderTypeTitle = data[0].typeTitle;
          that.addAssignLeader2();
        });
      },
      addAssignLeader() {
        var that = this;
        var orgId = that.hidOrgId;
        var orgName = that.hidOrgName;
        if (orgId == '' || orgId == '00000000-0000-0000-0000-000000000000') {
          FUI.Window.showMsg(that, '请在左侧列表中选择组织');
          return false;
        }
        that.selectRelationType(null, null, 'departLeader', null, true, false);
      },
      addAssignLeader2() {
        var that = this;
        var leaderType = that.data.AddLeaderType;
        var leaderTypeTitle = that.data.AddLeaderTypeTitle;
        var orgId = that.hidOrgId;
        var orgName = that.hidOrgName;
        if (leaderType == '') {
          FUI.Window.showMsg(that, '请选择分管领导类型');
          $('#AddLeaderType').focus();
          return false;
        }
        if (orgId == '' || orgId == '00000000-0000-0000-0000-000000000000') {
          FUI.Window.showMsg(that, '请在左侧列表中选择组织');
          return false;
        }
        var widht = 850;
        var height = 520;
        var url = __webpath + '/workflow/selector/selectUsers';
        var title = '选择用户';
        FUI.dialog(url, title, null, widht, height, function (objectData, index, layer) {
          if (objectData.length > 0) {
            var json = JSON.stringify(objectData);
            // 批量保存
            var result = Object.toAjaxJson('/workflow/security/departAssignLeader/', 'saveDepartAssignLeader', {
              'orgId': orgId,
              'orgName': orgName,
              'leaderType': leaderType,
              'leaderTypeTitle': leaderTypeTitle,
              'json': json
            });
            FUI.Window.showMsg2(that, result.msg, null, 1);
            if (result.success) {
              that.dg.Reload();
            }
          }
          layer.close(index);
          return false;
        }, true, null, null, 1);
      }

      , relationTypeList() {
        var that = this;
        var url = '/workflow/security/relation/relationTypeListByInfotype?infoType=departLeader';
        var title = "领导分管类型";
        FUI.Window.openEdit(url, title, "Edit", "grid", 700, 500, null, "", keyId, true);
      }
    }

  }
</script>