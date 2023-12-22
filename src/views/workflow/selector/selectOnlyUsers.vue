<template>
  <div class="f2bpm-page-layout">
    <el-container>
      <el-main class="f2bpm-page-right" style="overflow: hidden">
        <div id="gridSearch" class="grid-search-form">
          <div id="grid-search-form-list" :class="'grid-search-form-list ' + searchFromData.collapsedHeight">
            <ul>
              <li>
                <label style="width: 50px;"> 姓名：</label>
                <el-input id="LikeRealName" v-model="searchParams.LikeRealName" size="mini" clearable class="textBoxShort" name="LikeRealName" />
              </li>
              <li>
                <label style="width: 50px;"> 账号：</label>
                <el-input id="LikeUserName" v-model="searchParams.LikeUserName" size="mini" class="textBoxShort" name="LikeUserName" />
              </li>
            </ul>
          </div>
          <div class="grid-search-form-searchbtn-toolbar">
            <el-input v-model="searchParams.searchtext" size="small" placeholder="请输入姓名,账号来查询" clearable style="width: 257px; margin-right: 5px" :searchfields="searchParams.searchfields" />
            <el-divider direction="vertical" />
            <el-button size="small" class="search-btn" type="primary" @click="dataGridSearch()"><i class="fa fa-search" />{{$t('search')}}
            </el-button>
            <span class="expans-more" :title="searchFromData.moreTitle" @click="onSearchExpansMore">{{ searchFromData.moreTitle }}<i :class="searchFromData.moreIcon" /></span>
          </div>
        </div>
        <f2bpm-datagrid
        :expand-search="expandSearch"
          ref="grid"
          grid="grid"
          height="full-100"
          :pager-config="tablePage"
          :data="tableData"
@checkbox-all="selectAllEvent" :columns="tableColumn" @checkbox-change="selectChangeEvent" @radio-change="selectChangeEvent" @page-change="pageChange"
          @sort-change="sortChange"
        />
      </el-main>
      <el-aside ref="sideRight" class="f2bpm-selector-page-right" width="180px">
        <f2bpm-datagrid ref="gridResult" grid="gridResult" height="full-25" :data="resultGridData" :columns="resultGridColumn" />
        <div class="p3">
          <span id="clearEmpty2" class="cur red font10" @click="clearAll()"><i class="fa fa-minus-circle" />清空所选</span>
        </div>
      </el-aside>
    </el-container>
  </div>
</template>

<script>
  export default { data() {
      return {
        expandSearch: "",
        windowparms: { resultFieldKey: 'userId', singleSelect: false, data: [] },
        searchFromData: {
          moreIcon: 'fa fa-angle-double-down',
           moreTitle: this.$t('expand'),
          collapsedHeight: 'grid-search-form-list-height'
        },
        // ======stand:标准区=============
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
        headerMenus: Object.toClone(FUI.DataGridProperty.headerMenus),
        tableColumn: [
          { type: this.singleSelect ? 'radio' : 'checkbox', width: 35, align: 'center', fixed: 'left' },
          { field: 'realName', type: 'html', title: '姓名', width: 230, align: 'center', fixed: 'left' },
          {
            field: 'account', type: 'html', title: '账号', align: 'center',
            formatter: function(row, column, value, index) {
            /*   var myreg = /^(((1[0-9]{1}[0-9]{1})|(13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
              if (!myreg.test(row.account)) { */
                return row.account
             /*  } else {
                return row.account.substring(0, 3) + "*****" + row.account.substring(8)
              } */
            }
          }
         /*  { field: 'orgName', type: 'html', title: '组织名称', width: 150, align: 'center' }, */
     /*      {
            field: 'isMaster', title: '主属组织', width: 90, align: 'center',
            formatter: function (row, column, value, index) {
              return row.isMaster == 1 ? "是" : "否";
            }
          } */

        ],

        // =======选择结果Grid===========
         resultGridData: [],
         resultGridColumn: [{
          field: 'userId',
          title: 'userId',
          hidden: true,
          align: 'center'
        }, {
          field: 'realName',
          title: '姓名',
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
                }, '')]
            }
          }
        }],
        // ===========标准区结束==========
         searchParams: {
          searchtext: '',
          searchfields: 'RealName,UserName',

          LikeRealName: '',
          LikeUserName: '',
          orgId: ''
        }
      }
    }, computed: {
      countGridHeight() {
        return $(window).height() - global_selector_datagridHeightDiff
      },
       countGridHeight2() {
        return $(window).height() - 30
      },
       rotateIcon() {
        return this.isCollapsed ? 'fa fa-angle-double-right' : 'fa fa-angle-double-left'
      }
    },
    watch: {
      treeFilterText(val) {
        this.$refs.mytree.filter(val)
      }
    },
     created() {
      var $vm = this
      $vm.loadWindowparms()
      this.getGridData()
    },
     mounted() {
      window.myvm = this
    },

    methods: {
      collapsedSider() {
        this.isCollapsed = !this.isCollapsed
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
      },
       loadWindowparms() {
        const that = this
        var parmsStr = Object.toQueryString('parms')
        var parms = {}
        if (parmsStr) {
          parmsStr = decodeURIComponent(parmsStr)
          parms = eval('(' + parmsStr + ')')
          if (parms.data != undefined && parms.data.length > 0) {
            setTimeout(function() {
              that.resultGridData = parms.data
            }, 500)
          }
          if (parms.singleSelect != undefined) {
            that.windowparms.singleSelect = parms.singleSelect
          }
          if (parms.resultFieldKey != undefined) {
            that.windowparms.resultFieldKey = parms.resultFieldKey
          }
        }
      },
       sortChange({ column, field, order }) {
        this.tablePage.sort = field
        this.tablePage.order = order
        this.tablePage.currentPage = 1
        this.getGridData()
      },
       pageChange({ currentPage, pageSize }) {
        this.tablePage.currentPage = currentPage
        this.tablePage.pageSize = pageSize
        this.tablePage.startIndex = (currentPage - 1) * pageSize
        this.getGridData()
      },
       dataGridReSet() {
        var that = this
        $.each(this.searchParams, function(key, item) {
          that.searchParams[key] = ''
        })
        that.searchParams.historyVersion = 'false'
        // 重置查询
        this.dataGridSearch()
      },
      // 刷新列表
       refreshGrid(parentGridId, parm) {
        var that = this
        that.dataGridSearch()
      },
       dataGridSearch() {
        this.tablePage.currentPage = 1
        this.tablePage.startIndex = 0
        this.getGridData()
      },
       getGridData() {
        const that = this
        let parm = Object.toClone(that.tableForm.data)
        parm.page = that.tablePage.currentPage
        parm.rows = that.tablePage.pageSize
        that.tablePage.sort = '$User_UserName$'
        parm.sort = that.tablePage.sort
        parm.order = that.tablePage.order
        parm = Object.extend(parm, that.searchParams)

        Object.toAjaxJson(FUI.Handlers.OrgImplController, 'getOnlyUserList', parm, true, null, function(res) {
          if (res.success) {
            that.tableData = res.rows
            that.tablePage.total = res.total
            that.tablePage.pageCount = res.pageCount
          } else {
            FUI.Window.showMsg(that,res.msg)
          }
        })
      },
      // stand:选对结果区==================
       selectAllEvent(obj) {
        const that = this
        const rows = obj.selection
        const checked = obj.checked
        var keyId = that.windowparms.resultFieldKey
        $.each(rows, function(i, item) {
          if (checked) {
            that.addSelectRow(item)
          } else {
            that.delRow(item[keyId])
          }
        })
      },
      selectChangeEvent(obj) {
        const that = this
        const keyId = that.windowparms.resultFieldKey
        let checked = obj.checked
        if (checked == undefined) {
          checked = true
        }
        const selectedRow = obj.row
        if (checked) {
          that.addSelectRow(selectedRow)
        } else {
          that.delRow(selectedRow[keyId])
        }
      },
       addSelectRow(row) {
        const that = this
        const keyId = that.windowparms.resultFieldKey
        if (that.windowparms.singleSelect) {
          const tem = []
          tem.push(row)
          that.resultGridData = tem
        } else {
          let isExist = false
          $.each(that.resultGridData, function(i, item) {
            if (item[keyId] == row[keyId]) {
              isExist = true
            }
          })
          if (isExist === false) {
            that.resultGridData.push(row)
          }
        }
      },
       delRow(delKeyId) {
        const that = this
        const keyId = that.windowparms.resultFieldKey
        var tem = []
        $.each(that.resultGridData, function(i, item) {
          if (item[keyId] != delKeyId) {
            tem.push(item)
          }
        })
        that.resultGridData = tem
      },
       clearAll() {
        this.resultGridData = []
      },
       getResult() {
        return this.resultGridData
      }
    }

  }
  window.getResult = function() {
    return myvm.getResult()
  }
</script>
