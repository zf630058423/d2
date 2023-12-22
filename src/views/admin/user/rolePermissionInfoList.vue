<template>
  <div class="f2bpm-page-layout">
    <el-container>
      <el-main class="f2bpm-page-right">
        <div>
          <div id="gridSearch" class="grid-search-form">
            <div id="grid-search-form-list" class=" grid-search-form-list  ">
              <ul>
                <li>
                  <label>角色：</label>
                  <el-input id="AppName" v-model="searchParams.roleName" size="mini" clearable class="textBoxShort" />
                </li>
                <li>
                  <label>菜单：</label>
                  <el-input id="CurrentActivityName" v-model="searchParams.resourceName" size="mini" clearable class="textBoxShort" />
                </li>
                <li class="pl10">
                  <el-button size="small" class="search-btn" type="primary" @click="dataGridSearch()"><i class="fa fa-search" />{{$t('search')}}
                  </el-button>
                </li>
              </ul>
            </div>
          </div>
          <div id="grid-toolbar" class="grid-toolbar">
            <el-button size="small" type="primary" @click="exportExcel">
              <i class="fa fa-file-excel-o"></i>导出Exce
            </el-button>
          </div>
          <div>
            <f2bpm-datagrid :expand-search="expandSearch" ref="grid" :show-checkbox="false" :show-seq="true" height="full-190" grid="grid" pk="taskId" :pager-config="tablePage" :data="tableData" :columns="tableColumn" @page-change="pageChange" @sort-change="sortChange" />
          </div>
        </div>
      </el-main>
    </el-container>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        expandSearch: "",
        language: "",
        currUser: null,
        currCategoryCode: '',
        treeFilterText: '',
        expansMore: true,
        isCollapsed: false,
        searchFromData: {
          moreIcon: 'fa fa-angle-double-down',
          moreTitle: this.$t('expand'),
          collapsedHeight: 'grid-search-form-list-height'
        },
        searchParams: {
          userName: '',
          realName: '',
          roleName: '',
          resourceName: '',

          searchtext: '',
          searchfields: 'userName,realName'
        },
        tablePage: {
          pageCount: 0,
          sort: 'createdTime',
          order: 'desc',
          startIndex: 0,
          total: 0,
          currentPage: 1,
          pageSize: 200000,
          align: 'center',
          pageSizes: [2, 10, 20, 50, 100, 200, 500, 200000],
          layout: 'total'
        },
        loading: false,
        treeData: [],
        tableData: [],
        tableColumn: [
          { type: 'seq', width: 55, title: '序号', align: 'center', fixed: 'left' },
          {
            type: 'empty', width: 150, title: '操作', align: 'center', fixed: 'left', slots: {
              default: ({ row, column }, h) => {
                const that = this;
                return [
                  h(
                    'span',
                    {
                      style: {
                        cursor: 'pointer', color: '#409eff'
                      },
                      title: '查看自定义列表按钮权限',
                      class: 'fa fa-search cur ml10 mr10',
                      on: {
                        click: () => this.editDetail(row.roleId, row.roleName)
                      }
                    },
                    '自定义列表按钮权限'
                  )
                ];
              }
            }
          },
          {
            field: 'roleName',
            title: '角色',
            width: 220,
            align: 'center'
          }
          , {
            field: 'resourceNames',
            title: '菜单',
            minWidth: 680,
            align: 'left',
            type: 'html',
            formatter: function (rec, column, value, index) {
              if (value == '' || value == null || value == undefined) {
                return "";
              }
              var that = window.myvm;
              var resourceName = that.searchParams.resourceName;
              let text = value;
              if (resourceName) {
                text = Object.toFlagInString(resourceName, text);
              }
              var html = "<div style='height:200px;white-space: pre-wrap;overflow-y: auto;'>" + text + "</div>";
              return html;
            }
          }
        ]
      };
    },
    computed: {
      rotateIcon() {
        return this.isCollapsed ? 'icon icon-arrow-right-bold cur' : 'icon icon-arrow-left-bold cur';
      }
    },
    watch: {
    },
    created() {
      var that = this;
      window.myvm = that;
      this.getGridData();
    },
    mounted() {
      window.myvm = this;
      window.autoPageHeight();
    },
    methods: {
      collapsedSider() {
        this.isCollapsed = !this.isCollapsed;
      },
      refreshGrid() {
        this.dataGridSearch();
      },
      dataGridReSet() {
        const that = this;
        $.each(this.searchParams, function (key, item) {
          that.searchParams[key] = '';
        });
        this.dataGridSearch();
      },
      dataGridSearch() {
        this.tablePage.currentPage = 1;
        this.tablePage.startIndex = 0;
        this.getGridData();
      },
      getGridData() {
        var that = this;
        var parm = that.searchParams;
        parm.page = that.tablePage.currentPage;
        parm.rows = that.tablePage.pageSize;
        parm.sort = that.tablePage.sort;
        parm.order = that.tablePage.order;
        var res = Object.toAjaxJson('/admin/userPermission/', 'getRolePermissionInfoList', parm, true, null,
          function (res) {
            if (res.success) {
              that.tableData = res.rows;
              that.tablePage.total = res.total;
              that.tablePage.pageCount = res.pageCount;
            } else {
              FUI.Window.showMsg(res.msg);
            }
          }
        );
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
        this.getGridData();
      },
      changeList(filterType) {
        this.searchParams.filterType = filterType;
        this.dataGridSearch();
      },
      onSearchExpansMore() {
        var name = "";
        if (this.searchFromData.moreTitle == this.$t('expand')) {
          this.searchFromData.moreIcon = 'fa fa-angle-double-up';
          this.searchFromData.collapsedHeight = '';
          this.searchFromData.moreTitle = this.$t('packUp');
          name = "expand2";
        } else {
          this.searchFromData.moreIcon = 'fa fa-angle-double-down';
          this.searchFromData.collapsedHeight = 'grid-search-form-list-height';
          this.searchFromData.moreTitle = this.$t('expand');
          name = "packup";
        }
        this.expandSearch = name;
      }
      , exportExcel() {
        var that = this;
        Object.toAjaxDownloadFile(FUI.Handlers.AdminHandler + "userPermission/", "exportExcel", {
          type : "role",
          roleName: that.searchParams.roleName,
          resourceName: that.searchParams.resourceName
        });
      }
      , editDetail(roleId, roleName) {
        FUI.Window.openEdit("/admin/user/rolePermissionInfoDetail?roleId=" + roleId, "角色【" + roleName + "】的自定义列表的按钮权限", "Edit", "grid", 900, 580, null, null, null, true);
      }
    }
  }
</script>
<style>

</style>