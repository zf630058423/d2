<template>
  <div class="f2bpm-page-layout">
    <el-container>
      <el-aside ref="sideLeft" class="f2bpm-page-left" hide-trigger collapsible :width="isCollapsed?'20px':'200px'">
        <div class="f2bpm-panel-head">
          <div v-if="!isCollapsed" class="f2bpm-left-search-div">
            <el-input v-model="treeFilterText" class="left-htead-treeFilterText-box" size="small" clearable :placeholder="$t('enterKey')" autocomplete="off" prefix-icon="el-icon-search" />
          </div>
          <div style="float: right;line-height:35px;padding-right: 5px;">
            <i v-if="!isCollapsed" title="刷新查看全部" class="fa fa-refresh  cur ml10 font12 " @click="loadTree()" />
            <i title="收起/展开" :class="rotateIcon" @click="collapsedSider" />
          </div>
        </div>
        <div v-if="!isCollapsed" class="f2bpm-page-left-content auto-window-height mt5">
          <span class="fa fa-home cur ml10 font12 " @click="showAll()">{{$t('all')}}</span>
          <el-tree ref="mytree" :data="treeData" :filter-node-method="filterTreeNode" :expand-on-click-node="false" default-expand-all @node-click="onTreeSelected" />
        </div>
      </el-aside>
      <el-container>
        <el-main class="f2bpm-page-right" style="overflow: hidden">
          <f2bpm-gridsearchform @expandclick="expandClick" :tableform="tableForm" @searchformbtnclick="searchFormbtnClick" @updatevalue="updateFieldValue" />
          <f2bpm-datagrid ref="grid" grid="grid" :expand-search="expandSearch" height="full-110" :context-menu="{header: {options: headerMenus},className: 'my-menus'}" :pager-config="tablePage" @checkbox-all="selectAllEvent" :data="tableData" :columns="tableColumn" @checkbox-change="selectChangeEvent" @radio-change="selectChangeEvent" @header-contextmenu="contextMenuClickEvent" @page-change="pageChange" @sort-change="sortChange" />
        </el-main>
        <el-aside ref="sideRight" class="f2bpm-selector-page-right" width="180px">
          <f2bpm-datagrid ref="gridResult" grid="gridResult" height="full-10" :data="resultGridData" :columns="resultGridColumn" />
        </el-aside>
      </el-container>
    </el-container>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        expandSearch: "",

        windowparms: { resultFieldKey: 'ReportCode', singleSelect: true, data: [] },
        // ======stand:标准区=============
        treeFilterText: '',
        isCollapsed: false,
        authorizeType: 'none',
        ismultilevelAuthorize: false,
        // ==data grid====
        dg: {},
        tablePage: Object.toClone(FUI.DataGridProperty.tablePage),
        loading: false,
        treeData: [],
        tableData: [],
        tableForm: Object.toClone(FUI.DataGridProperty.tableForm),
        tableToolbar: Object.toClone(FUI.DataGridProperty.tableToolbar),
        headerMenus: Object.toClone(FUI.DataGridProperty.headerMenus),
        tableColumn: [],
        resultGridData: [],
        resultGridColumn: [{
          field: 'ReportCode',
          title: 'ReportCode',
          hidden: true,
          align: 'center'
        }, {
          field: 'ReportName',
          title: '名称',
          align: 'center'
        }, {
          field: 'action',
          title: '操作',
          width: 50,
          type: 'html',
          slots: {
            // 使用 JSX 渲染函数
            default: ({ row, column }, h) => {
              return [
                h('button', {
                  attrs: { title: '删除' },
                  class: 'btn btn-minier btn-grey mr2 fa fa-trash',
                  on: {
                    click: () => this.delRow(row[this.windowparms.resultFieldKey])
                  }
                }, '')];
            }
          }
        }],
        // ===========标准区结束==========
        searchParams: {
          // 特殊查询
          CategoryCode: ''
        }
      };
    }, computed: {
      countGridHeight() {
        return $(window).height() - global_selector_datagridHeightDiff;
      },
      rotateIcon() {
        return this.isCollapsed ? 'icon icon-arrow-right-bold cur' : 'icon icon-arrow-left-bold cur';
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
      $vm.loadWindowparms();
      var dg = FUI.DataGrid.Create($vm, 'key_selector_erport', null, 'grid', true, true, true);
      dg.SortName = 'ReportCode';
      dg.SortOrder = 'ASC';
      dg.IsSimpleSearch = true;
      dg.SingleSelect = $vm.windowparms.singleSelect;
      // 是否开启双击编辑
      dg.EnableDblClickEdite = false;
      dg.OperationAction.ShowView = false;
      dg.OperationAction.ShowEdit = false;
      dg.OperationAction.ShowDelete = false;
      // 工具栏
      dg.ToolBarDefaultButtons.ShowAdd = false;
      dg.ToolBarDefaultButtons.ShowDelete = false;
      dg.IsSimpleSearch = true;
      dg.Bind();
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
      loadWindowparms() {
        const that = this;
        var parmsStr = Object.toQueryString('parms');
        var parms = {};
        if (parmsStr) {
          parmsStr = decodeURIComponent(parmsStr);
          parms = eval('(' + parmsStr + ')');
        }
        if (parms) {
          if (parms.data != undefined && parms.data.length > 0) {
            that.resultGridData = parms.data;
          }
          if (parms.singleSelect != undefined) {
            that.windowparms.singleSelect = parms.singleSelect;
          }
          if (parms.resultFieldKey != undefined) {
            that.windowparms.resultFieldKey = parms.resultFieldKey;
          }
          if (parms.needRoot != undefined) {
            that.windowparms.needRoot = parms.needRoot;
          }
        }
      },
      pageChange({ currentPage, pageSize }) {
        this.tablePage.currentPage = currentPage;
        this.tablePage.pageSize = pageSize;
        this.tablePage.startIndex = (currentPage - 1) * pageSize;
        this.getGridData();
      },
      onTreeSelected(data, treeNode, thisObj) {
        var currCategoryCode = treeNode.data.id;
        this.searchParams.AppCategoryID = currCategoryCode;
        this.dataGridSearch();
      },
      showAll() {
        this.searchParams.AppCategoryID = '';
        this.dataGridSearch();
      },
      filterTreeNode(value, data) {
        if (!value) return true;
        return data.title.indexOf(value) !== -1;
      },
      loadTree() {
        var that = this;
        var treeUrl = FUI.Handlers.CategoryHandler + '?groupKey=ReportGroup';
        Object.toAjaxJson(treeUrl, null, null, true, null, function (res) {
          if (res.success) {
            that.treeData = res.data;
            var msg = res.msg;
          } else {
            FUI.Window.showMsg(that, res.msg);
          }
        });
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
            FUI.Window.showMsg(that, res.msg);
          }
        });
      },
      // stand:选对结果区==================
      selectAllEvent(obj) {
        const that = this;
        const rows = obj.selection;
        const checked = obj.checked;
        var keyId = that.windowparms.resultFieldKey;
        $.each(rows, function (i, item) {
          if (checked) {
            that.addSelectRow(item);
          } else {
            that.delRow(item[keyId]);
          }
        });
      },
      selectChangeEvent(obj) {
        const that = this;
        const keyId = that.windowparms.resultFieldKey;
        let checked = obj.checked;
        if (checked == undefined) {
          checked = true;
        }
        const selectedRow = obj.row;
        if (checked) {
          that.addSelectRow(selectedRow);
        } else {
          that.delRow(selectedRow[keyId]);
        }
      },
      addSelectRow(row) {
        const that = this;
        const keyId = that.windowparms.resultFieldKey;
        if (that.windowparms.singleSelect) {
          const tem = [];
          tem.push(row);
          that.resultGridData = tem;
        } else {
          let isExist = false;
          $.each(that.resultGridData, function (i, item) {
            if (item[keyId] == row[keyId]) {
              isExist = true;
            }
          });
          if (isExist === false) {
            that.resultGridData.push(row);
          }
        }
      },
      delRow(delKeyId) {
        const that = this;
        const keyId = that.windowparms.resultFieldKey;
        var tem = [];
        $.each(that.resultGridData, function (i, item) {
          if (item[keyId] != delKeyId) {
            tem.push(item);
          }
        });
        that.resultGridData = tem;
      },
      dataSourceFormatter(row, col, value, index) {
        var result = value;
        switch (value.toString()) {
          case 'processform':
            result = '表单应用';
            break;
          case 'tableview':
            result = '表或视图';
            break;
          case 'sql':
            result = 'SQL';
            break;
        }
        return result;
      },
      rportTypeFormatter(row, col, value, index) {
        var result = value;
        switch (value.toString()) {
          case 'column':
            result = '柱状图';
            break;
          case 'line':
            result = '折线图';
            break;
          case 'bar':
            result = '条形图';
            break;
          case 'pie':
            result = '饼图';
            break;
          case 'funnel':
            result = '漏斗图';
            break;
          case 'area':
            result = '堆叠图';
            break;
          case 'radar':
            result = '雷达图';
            break;
          case 'table':
            result = '表格列表';
            break;
          case 'totalnum':
            result = '总数统计';
            break;
        }
        return result;
      },
      getResult() {
        return this.resultGridData;
      }
    }

  };

  window.getResult = function () {
    return myvm.getResult();
  }
</script>