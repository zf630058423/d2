<template>
  <div class="f2bpm-page-layout">
    <el-container>
      <el-main class="f2bpm-page-right">
        <div>
          <div id="gridSearch" class="grid-search-form">
            <div id="grid-search-form-list" :class="'grid-search-form-list ' + searchFromData.collapsedHeight">
              <ul>
                <li>
                  <label>{{$t('wfInfo.procName')}}：</label>
                  <el-input v-model="searchParams.workflowName" size="mini" clearable class="textBoxShort" />
                </li>
                <li>
                  <label>{{$t('searchKey')}}：</label>
                  <el-input v-model="searchParams.searchText" style="width: 380px;" size="mini" clearable :placeholder="$t('searchTip.procConfigSearchTip')" class="textBoxShort" />
                </li>
                <li style="padding-left: 10px; ">
                  <el-button size="small" class="search-btn" type="primary" @click="dataGridSearch()"><i class="fa fa-search" />{{$t('search')}}
                  </el-button>
                </li>
              </ul>
            </div>

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
        currCategoryCode: '',
        treeFilterText: '',
        expansMore: true,
        searchFromData: {
          moreIcon: 'fa fa-angle-double-down',
           moreTitle: this.$t('expand'),
          collapsedHeight: 'grid-search-form-list-height'
        },
        searchParams: {
          searchText: '',
          workflowName: ""
        },
        tablePage: {
          pageCount: 0,
          sort: 'workflowName',
          order: 'desc',
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
          { type: 'seq', width: 55, title:  __f2bpmLanguage == 'en-US' ? 'No' : '序号', align: 'center', fixed: 'left' },
          {
            type: 'empty', width: 220, title: __f2bpmLanguage == 'en-US' ? 'Proc Name':'流程名称', align: 'center', fixed: 'left', slots: {
              default: ({ row, column }, h) => {
                const that = this;
                return [
                  h(
                    'span',
                    {
                      style: {
                        cursor: 'pointer', color: '#409eff'
                      },
                      on: {
                        click: () => this.openProcessDesigner(row.wid, row.workflowName)
                      }
                    },
                    row.workflowName
                  )
                ];
              }
            }
          },

          {
            field: 'version',
            title: __f2bpmLanguage == 'en-US' ? 'Version':'版本号',
            width: 90,
            align: 'center'
          },
          {
            field: 'activityName',
            title: __f2bpmLanguage == 'en-US' ? 'Node Name':'环节名称',
            width: 180,
            align: 'center'
          },
          {
            field: 'todoActor',
            title: __f2bpmLanguage == 'en-US' ? 'To do actor':'待办参与者配置',
            type: 'html',
            width: 420,
            align: 'center',
            formatter: function (row, column, value, index) {
              var text = value;
              var that = window.myvm;
              var s_searchText = that.searchParams.searchText;
              if (s_searchText) {
                text = Object.toFlagInString(s_searchText, text);
              }
              return text;
            }
          },
          {
            field: 'todoCirculatedActor',
            type: 'html',
            title: __f2bpmLanguage == 'en-US' ? 'Circulation actor':'待阅参与者配置',
            width: 420,
            align: 'center',
            formatter: function (row, column, value, index) {
              var text = value;
              var that = window.myvm;
              var s_searchText = that.searchParams.searchText;
              if (s_searchText) {
                text = Object.toFlagInString(s_searchText, text);
              }
              return text;
            }
          },
          {
            field: 'assistActor',
            title: __f2bpmLanguage == 'en-US' ? 'Turn to do actor':'转办参与者配置',
            sort: true,
            width: 300,
            type: 'html',
            align: 'center',
            formatter: function (row, column, value, index) {
              var text = value;
              var that = window.myvm;
              var s_searchText = that.searchParams.searchText;
              if (s_searchText) {
                text = Object.toFlagInString(s_searchText, text);
              }
              return text;
            }
          },
          {
            field: 'autoCirculated',
            title:  __f2bpmLanguage == 'en-US' ? 'Auto circulation actor':'自动传阅人',
            type: 'html',
            sort: true,
            width: 300,
            align: 'center',
            formatter: function (row, column, value, index) {
              var text = value;
              var that = window.myvm;
              var s_searchText = that.searchParams.searchText;
              if (s_searchText) {
                text = Object.toFlagInString(s_searchText, text);
              }
              return text;
            }
          }
          , {
            field: 'activityCode',
            title:  __f2bpmLanguage == 'en-US' ? 'Node code':'环节编码',
            width: 180,
            align: 'center'
          }
        ]
      };
    },
    computed: {
      rotateIcon() {
        return this.isCollapsed ? 'icon icon-arrow-right-bold cur' : 'icon icon-arrow-left-bold cur';
      }
    },
    created() {
      window.myvm = this;
      var that = this;
      var language = this.$store.state.app.language;
      that.language = language;
      this.onSearchExpansMore();
      this.getGridData();
    },
    mounted() {
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
        var res = Object.toAjaxJson('/workflow/processDef/', 'configurationCheckListJson', parm, true, null,
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
      openProcessDesigner(wid) {
        var that = this;
        var url = __webpath + '/workflow/processDef/processDesigner/?isSimple=0&wid=' + wid;
        window.open(url, '_blank');
      }
    }

  }
</script>