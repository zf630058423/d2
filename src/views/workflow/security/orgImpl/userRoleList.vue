<template>
  <div class="f2bpm-page-layout">
    <el-container>
      <el-aside ref="sideLeft" class="f2bpm-page-left" hide-trigger collapsible :width="isCollapsed?'20px':'200px'">
        <div class="f2bpm-panel-head">
          <div v-if="!isCollapsed" class="f2bpm-left-search-div">
            <el-input v-model="treeFilterText" class="left-htead-treeFilterText-box"   size="small" clearable :placeholder="$t('enterKey')" autocomplete="off" prefix-icon="el-icon-search" />
          </div>
          <div  class="f2bpm-left-search-button-div">
            <i v-if="!isCollapsed" :title="$t('refresh')" class="icon icon-shuaxin  cur mr10 font12  " @click="loadTree()"></i>
            <i title="收起/展开" :class="rotateIcon" @click="collapsedSider" />
          </div>
        </div>

        <div v-if="!isCollapsed" class="f2bpm-page-left-content auto-window-height" :style="'height:'+countLeftTreeHeight+'px;'">
          <div class="mytree-cube-box-container">
            <span class="cur  mytree-cube-box " @click="showAll()"><i class="icon icon-quanbu font16"></i>  {{$t('all')}}</span>
          </div>
          <el-tree ref="mytree" :data="treeData" :expand-on-click-node="false" :filter-node-method="filterTreeNode" default-expand-all @node-click="onTreeSelected" />
        </div>
      </el-aside>

      <el-main class="f2bpm-page-right">
        <div id="gridSearch" class="grid-search-form">
          <div id="grid-search-form-list" class="grid-search-form-list">
            <ul>
              <li><span class="mr4"> 姓名:</span>
                <el-input id="LikeRealName" v-model="searchParams.LikeRealName" size="small" class="textBoxShort" name="LikeRealName" />
              </li>
              <li><span class="ml4"> 账号：</span>
                <el-input id="LikeUserName" v-model="searchParams.LikeUserName" size="small" class="textBoxShort" name="LikeUserName" />
              </li>
              <li class="pl10">
                <el-button size="small" type="default" role="button" @click="dataGridSearch()"><i class="fa fa-search" />{{$t('search')}}
                </el-button>
                <el-button size="small" @click="dataGridReSet()"><i class="fa fa-undo" />重置
                </el-button>
              </li>

            </ul>
          </div>
        </div>

        <f2bpm-datagrid ref="grid" grid="grid" :toolbar="tableToolbar" :pager-config="tablePage" :data="tableData" :columns="tableColumn" @page-change="pageChange" @sort-change="sortChange" />
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
        tableColumn: [
          { field: 'realName', type: 'html', title: '姓名', align: 'center', fixed: 'left' },
          {
            field: 'account', type: 'html', title: '账号', align: 'center',
            formatter: function (row, column, value, index) {
              var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
              if (!myreg.test(row.account)) {
                return row.account;
              } else {
                return row.account.substring(0, 3) + '*****' + row.account.substring(8);
              }
            }
          },
          { field: 'orgName', type: 'html', title: '组织名称', align: 'center' },
          {
            field: 'isMaster', title: '主属组织', width: 90, align: 'center',
            formatter: function (row, column, value, index) {
              return row.isMaster == 1 ? '<em>是</em>' : '否';
            }
          }
        ],
        // ===========标准区结束==========
        searchParams: {
          LikeRealName: '',
          LikeUserName: '',
          // 特殊查询
          roleId: ''
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
      var $vm = this;
      this.getGridData();
      this.loadTree();
    },
    mounted() {
      window.myvm = this;
      window.autoPageHeight();
    },

    methods: {
      collapsedSider() {
        this.isCollapsed = !this.isCollapsed;
      },
      closeEdit() {
        FUI.Window.closeEdit();
      },
      sortChange({ column, field, order }) {
        this.tablePage.sort = field;
        this.tablePage.order = order;
        this.tablePage.currentPage = 1;
        this.getGridData();
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
          if (key != 'roleId') {
            that.searchParams[key] = '';
          }
        });
        // 重置查询
        this.dataGridSearch();
      },
      filterTreeNode(value, data) {
        if (!value) return true;
        return data.title.indexOf(value) !== -1;
      },
      showAll() {
        this.searchParams.roleId = '';
        this.dataGridSearch();
      },
      refreshTree() {
        var that = this;
        that.loadTree();
        that.showAll();
      },
      loadTree() {
        var that = this;
        var treeUrl = FUI.Handlers.OrgImplController + '/getRolesJson';
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
        this.searchParams.roleId = treeNode.data.id;
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
        that.tablePage.sort = '$User_UserName$';
        parm.sort = that.tablePage.sort;
        parm.order = that.tablePage.order;
        parm = Object.extend(parm, that.searchParams);

        Object.toAjaxJson(FUI.Handlers.OrgImplController, 'getUserInOrgRoleList', parm, true, null, function (res) {
          if (res.success) {
            that.tableData = res.rows;
            that.tablePage.total = res.total;
            that.tablePage.pageCount = res.pageCount;
          } else {
            FUI.Window.showMsg(that, res.msg);
          }
        });
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
      }
    }

  }
</script>