<template>
  <div class="f2bpm-page-layout">
    <el-container>
      <el-main class="f2bpm-page-right">
        <div>
          <div id="gridSearch" class="grid-search-form">
            <div id="grid-search-form-list" class=" grid-search-form-list  ">
              <ul>
                <li>
                  <label>自定义列表：</label>
                  <el-input  v-model="searchParams.sourceName" size="mini" clearable class="textBoxShort" />
                </li>
                <li>
                  <label>按钮：</label>
                  <el-input v-model="searchParams.permissionContent" size="mini" clearable class="textBoxShort" />
                </li>
                <li class="pl10">
                  <el-button size="small" class="search-btn" type="primary" @click="dataGridSearch()"><i class="fa fa-search" />{{$t('search')}}
                  </el-button>
                  <el-button size="small" class="search-btn" type="default" @click="closeEdit()"><i class="fa fa-minus-circle" />{{$t('close')}}
                  </el-button>
                </li>
              </ul>
            </div>
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
        roleId: "",
        expandSearch: "",
        language: "",
        currUser: null,
        // ======stand:标准区=============
        currCategoryCode: '',
        treeFilterText: '',
        expansMore: true,
        isCollapsed: false,
        searchFromData: {
          moreIcon: 'fa fa-angle-double-down',
          collapsedHeight: 'grid-search-form-list-height'
        },
        searchParams: {
          permissionContent: '',
          sourceName: '',

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
          pageSize: 50000,
          align: 'center',
          pageSizes: [2, 10, 20, 50, 100, 200, 50000],
          layout: 'total'
        },
        loading: false,
        treeData: [],
        tableData: [],
        tableColumn: [
          {
            type: 'empty', width: 60, title: '操作', align: 'center', fixed: 'left', slots: {
              default: ({ row, column }, h) => {
                const that = this;
                return [
                  h(
                    'span',
                    {
                      style: {
                        cursor: 'pointer', color: '#409eff'
                      },
                      class: 'fa fa-edit cur ml10 mr10',
                      on: {
                        click: () => this.editFormPermission(row.sourceId, row.sourceName)
                      }
                    },
                    '设置'
                  )
                ];
              }
            }
          },
          {
            field: 'sourceName',
            title: '自定义列表',
            width: 250,
            align: 'center',
            type: 'html'
          },
          {
            field: 'targetName',
            title: '角色',
            width: 350,
            align: 'center',
            type: 'html'
          }
          , {
            field: 'permissionContent',
            title: '按钮',
            minWidth: 680,
            align: 'left',
            type: 'html',
            formatter: function (rec, column, value, index) {
              if (value == '' || value == null || value == undefined) {
                return "";
              }
              var that = window.myvm;
              var permissionContent = that.searchParams.permissionContent;
              let text = value;
              if (permissionContent) {
                text = Object.toFlagInString(permissionContent, text);
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
      treeFilterText(val) {
        this.$refs.mytree.filter(val);
      }
    },
    created() {
      var that = this;
      window.myvm = that;
      var roleId=Object.toQueryString("roleId");
      that.roleId = roleId;
      this.getGridData();
    },
    mounted() {
      window.myvm = this;
      window.autoPageHeight();
    },
    methods: {
      closeEdit() {
        FUI.Window.closeEdit();
      },
      collapsedSider() {
        this.isCollapsed = !this.isCollapsed;
      },
      refreshGrid() {
        this.dataGridSearch();
      },
      dataGridReSet() {
        const that = this;
        // 重置查询
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
        parm.roleId = that.roleId;
        var res = Object.toAjaxJson('/admin/userPermission/', 'getRolePermissionDetailJson', parm, true, null,
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
        Object.toAjaxDownloadFile(FUI.Handlers.AdminHandler + "user/", "exportExcel", {
          type: "user",
          userName: that.searchParams.userName,
          realName: that.searchParams.realName,
          roleName: that.searchParams.roleName,
          resourceName: that.searchParams.resourceName
        });
      }
      , editFormPermission(dataGridId, title) {
        var url='/workflow/smartForm/formPermission/formFieldListPermissions/?rightType=customDataGrid&formKey='+dataGridId
        FUI.Window.open(url);
      }

    }

  }
</script>
<style>
  .el-table .cell {
    white-space: break-word;
    overflow: hidden;
  }
</style>