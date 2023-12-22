<template>
  <div class="f2bpm-page-layout">
    <el-container>
      <el-main class="f2bpm-page-right">
        <div>
          <div id="gridSearch" class="grid-search-form">
            <div id="grid-search-form-list" class="grid-search-form-list">
              <ul>
                <li>
                  <label>分组：</label>
                  <el-input v-model="searchParams.groupName" size="mini" clearable class="textBoxShort" />
                </li>
                <li>
                  <label>缓存键：</label>
                  <el-input v-model="searchParams.key" size="mini" clearable class="textBoxShort" />
                </li>

                <li style="padding-left: 10px; ">
                  <el-button size="small" class="search-btn" type="primary" @click="dataGridSearch()"><i class="fa fa-search" />{{$t('search')}}
                  </el-button>
                </li>
              </ul>
            </div>
          </div>
          <div id="grid-toolbar" class="grid-toolbar">
            <el-button size="small" type="default" @click="clearExpiredCacheByType('过期验证码','ValidateCode_')">
              清除过期验证码
            </el-button>
            <el-button size="small" type="default" @click="clearExpiredCacheByType('过期Token','TokenCache_')">
              清除过期Token
            </el-button>
            <el-button size="small" type="default" @click="clearExpiredCacheByType('所有缓存','all')">
              清除所有缓存
            </el-button>
          </div>
          <div>
            <f2bpm-datagrid ref="grid" :show-checkbox="false" :show-seq="true" height="full-190" grid="grid" pk="taskId" :pager-config="tablePage" :data="tableData" :columns="tableColumn" @page-change="pageChange" @sort-change="sortChange" />
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
        language: "",
        treeFilterText: '',
        expansMore: true,
        // ======stand:标准区=============
        currCategoryCode: '',
        expansMore: true,
        isCollapsed: false,
        modalparams: {
          appId: '',
          wiid: '',
          taskId: '',
          formAction: ''
        },
        searchFromData: {
          moreIcon: 'fa fa-angle-double-down',
          moreTitle: this.$t('expand'),
          collapsedHeight: 'grid-search-form-list-height'
        },
        searchParams: {
          groupName: '',
          key: ''
        },
        tablePage: {
          pageCount: 0,
          sort: 'key',
          order: 'asc',
          startIndex: 0,
          total: 0,
          currentPage: 1,
          pageSize: 100000,
          align: 'center',
          pageSizes: [100000],
          layout: 'total'
        },
        loading: false,
        treeData: [],
        tableData: [],
        tableColumn: [
          { type: 'seq', width: 55, title: '序号', align: 'center', fixed: 'left' },
          {
            field: 'action',
            title: '操作',
            width: 100,
            align: 'center',
            type: 'html',
            slots: {
              default: ({ row, column }, h) => {
                const that = this;
                return [
                  h('span', {
                    style: {
                      cursor: 'pointer', color: '#409eff'
                    },
                    on: {
                      click: () => that.deleteCacheByKey(row.groupName, row.key)

                    }
                  }, "删除")
                ];
              }
            }
          },
          {
            field: 'groupName',
            title: '分组',
            width: 180,
            align: 'center',
          },
          {
            field: 'key',
            title: '缓存键',
            width: 900,
            align: 'left',
          }, {
            field: 'length',
            title: '缓存大小',
            width: 120,
            align: 'center',
            formatter: function (rec, column, value, index) {
              return value / 1000 + ' MB';
            }
          },
          {
            field: 'value',
            title: '缓存值',
            width: 1980,
            align: 'left'
          }
          // ,
          // {
          //   field: 'expired',
          //   title: '过期',
          //   width: 120,
          //   align: 'left'
          // }
        ]
      };
    }, computed: {
      countGridHeight() {
        var h = $(document).height() - 145;
        return h;
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
      this.getGridData();
    },
    mounted() {
      window.myvm = this;
    },
    methods: {
      closeEdit() {
        this.modal.modalEdit = false;
        this.modal.currEditModal = '';
        this.modal.title = '';
      },
      dateFormatter(obj) {
        var rec = obj.row;
        var cellValue = obj.cellValue;
        var value = rec.createdTime;
        if (value == '' || value == null) {
          return '';
        }
        var text = Object.toJsonDateTimeFormatter(value);
        return text;
      },
      collapsedSider() {
        this.isCollapsed = !this.isCollapsed;
      },
      refreshGrid() {
        this.dataGridSearch();
      },
      onSearchExpansMore() {
        if (this.searchFromData.moreTitle == this.$t('expand')) {
          this.searchFromData.moreIcon = 'fa fa-angle-double-up';
          this.searchFromData.collapsedHeight = '';
          this.searchFromData.moreTitle = this.$t('packUp');
        } else {
          this.searchFromData.moreIcon = 'fa fa-angle-double-down';
          this.searchFromData.collapsedHeight = 'grid-search-form-list-height';
          this.searchFromData.moreTitle = this.$t('expand');
        }
      },
      dataGridReSet() {
        const that = this;
        // 重置查询
        $.each(this.searchParams, function (key, item) {
          if (key != 'filterType') {
            that.searchParams[key] = '';
          }
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
        var res = Object.toAjaxJson('/workflow/security/cacheManage/', 'cachePoolInformationList', parm, true, null, function (res) {
          if (res.success) {
            that.tableData = res.rows;
            that.tablePage.total = res.total;
            that.tablePage.pageCount = res.pageCount;
          } else {
            FUI.Window.showMsg(res.msg);
          }
        });
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
      changeList(filterType) {
        this.searchParams.filterType = filterType;
        this.dataGridSearch();
      },
      clearExpiredCacheByType(title,cacheType) {
        var that = this;
        FUI.Window.confirm(that, "确定要清除【"+title+"】缓存?", '删除提示', function (r) {
          var res = Object.toAjaxJson('/workflow/security/cacheManage/', 'clearExpiredCacheByType', {
            cacheType: cacheType
            ,title:title
          });
          if (res.success) {
            FUI.Window.showMsg2(that, res.msg, null, 1);
            that.dataGridSearch();
          }
        });
      }
      , deleteCacheByKey(groupName, key) {
        var that = this;
        FUI.Window.confirm(that, "确定要删除缓存：" + key, '删除提示', function (r) {
          var res = Object.toAjaxJson('/workflow/security/cacheManage/', 'deleteCacheByKey', {
            groupName: groupName,
            key: key
          });
          if (res.success) {
            FUI.Window.showMsg2(that, res.msg, null, 1);
            that.dataGridSearch();
          }
        });

      }
    }

  }
</script>