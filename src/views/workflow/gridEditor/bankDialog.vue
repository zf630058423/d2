<template>
  <div class="f2bpm-page-layout">
    <!--<el-container>-->
      <!--<el-main class="f2bpm-page-right" style="overflow: hidden">-->
        <!--<f2bpm-gridsearchform @expandclick="expandClick" :tableform="tableForm" @searchformbtnclick="searchFormbtnClick"-->
                              <!--@updatevalue="updateFieldValue"/>-->
        <!--<f2bpm-datagrid-->
          <!--ref="grid"-->
          <!--grid="grid"-->
          <!--height="full-95"-->
          <!--:expand-search="expandSearch"-->
          <!--:context-menu="{header: {options: headerMenus},className: 'my-menus'}"-->
          <!--:pager-config="tablePage"-->
          <!--@checkbox-all="selectAllEvent" :data="tableData" :columns="tableColumn" @checkbox-change="selectChangeEvent"-->
          <!--@radio-change="selectChangeEvent"-->
          <!--@header-contextmenu="contextMenuClickEvent"-->
          <!--@page-change="pageChange"-->
          <!--@sort-change="sortChange"-->
        <!--/>-->
      <!--</el-main>-->
      <!--<el-aside ref="sideRight" class="f2bpm-selector-page-right" width="180px">-->
        <!--<f2bpm-datagrid ref="gridResult" grid="gridResult" height="full" :data="resultGridData"-->
                        <!--:columns="resultGridColumn"/>-->
      <!--</el-aside>-->
    <!--</el-container>-->
    <div class="table-container p10" >
      <div class="form-container">
        <el-form :inline="true" :model="form" class="demo-form-inline" label-width="80px">
          <div v-if="this.isCollapsed">
            <el-form-item label="银行支行：">
              <el-input v-model="form.BankBranch" placeholder="请输入 银行支行" size="small"></el-input>
            </el-form-item>
            <el-form-item label="联行号：">
              <el-input v-model="form.CombineNum" placeholder="请输入 联行号" size="small"></el-input>
            </el-form-item>
            <el-form-item label="银行类别：">
              <el-input v-model="form.BankType" placeholder="请输入 银行类别" size="small"></el-input>
            </el-form-item>
          </div>
          <el-form-item label="">
            <el-input v-model="form.searchtext" placeholder="请输入 银行支行、联行号来搜索" size="small" style="width: 250px"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="dataGridSearch" size="small" class="mr20">查询</el-button>

            <span v-if="!this.isCollapsed"  @click="collapsedSider">展开 <i class="el-icon-arrow-down" style="font-size: 20px"></i> </span>
            <span v-else  @click="collapsedSider">收起 <i class="el-icon-arrow-up" style="font-size: 20px"></i></span>
          </el-form-item>
        </el-form>
      </div>
      <el-table ref="singleTable" :data="tableData" highlight-current-row size="small" height="300px"
                @row-click="singleElection" style="width: 100%">
        <el-table-column align="center" width="45" label="">
          <template slot-scope="scope">
            <!-- 可以手动的修改label的值，从而控制选择哪一项 -->
            <el-radio class="radio" v-model="templateSelection" :label="scope.row.MyId" style="padding:0 11px">&nbsp;</el-radio>
          </template>
        </el-table-column>
        <el-table-column property="BankBranch" label="银行支行" align="center">
        </el-table-column>
        <el-table-column property="CombineNum" label="联行号" align="center">
        </el-table-column>
        <el-table-column property="BankType" label="银行类别" align="center">
        </el-table-column>
      </el-table>
      <div>

        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage2"
          :page-sizes="[20, 30,50,100]"
          :page-size="20"
          layout="total, sizes, prev, pager, next, jumper"
          :total="this.tablePage.total">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
  var code = Object.toQueryString('code')
  // 自定义对话框的定义数据
  var _config = null
  // 右侧结果集属性(返回结果集) fieldData:[{ fieldTitle: "字段1", fieldName: "1", propertyName: "", isKey: 1 }]
  var fieldData = {}// config为数据库整个配置实体对象
  // 参数说明{isMulti:true,customDialog:customDialog, initailData: [] }  initailData:为还原显示的数据
  var parms = {}
  // isMulti是否多选：true多选，false:单选，默认单选
  var isMulti = false
  export default {
    data() {
      return {
        expandSearch: "",
        keyName: '',
        currentPage2:1,
        form:{
          BankBranch:'',
          CombineNum:'',
          BankType:'',
          searchtext:''
        },
        isOpen: false,
        //   当前选择的行的id
        templateSelection: "",
        //   当前选择的行的数据
        checkList: [],
        //varParams自定义变量参数
        windowparms: {resultFieldKey: '', isMulti: false, data: [], varParams: "", isSetHead: 0},
        // ======stand:标准区=============
        code: '',
        defaultWhereStr: '',
        getDataUrl: '',

        treeFilterText: '',
        isCollapsed: false,
        // ==data grid====
        config: {},
        dg: {},
        tablePage: Object.toClone(FUI.DataGridProperty.tablePage),
        loading: false,
        treeData: [],
        tableData: [],
        tableForm: Object.toClone(FUI.DataGridProperty.tableForm),
        tableToolbar: Object.toClone(FUI.DataGridProperty.tableToolbar),
        headerMenus: FUI.DataGridProperty.headerMenus,
        tableColumn: [],
        ViewTable: 'ct_bpm_bankbranch ',
        IsEnableReloadWhere: true,
        SingleSelect: false,
        ShowNumbers: false,
        SortName: 'CreateTime',
        SortOrder: 'desc',
        IsEnableAuthor: 0,
        DefaultWhere: 'EnableState=1',
        // ===========标准区结束==========
        searchParams: {}
      }
    },
    computed: {
      countGridHeight() {
        return $(document).height() - global_selector_datagridHeightDiff
      },
      rotateIcon() {
        return this.isCollapsed ? 'fa fa-angle-double-right' : 'fa fa-angle-double-left'
      }
    },
    created() {
      var that = this;
      that.loadWindowparms();
      that.loadCustomConfig();
      that.config = _config;
      var dg = FUI.DataGrid.Create(that, that.config.objName, 'none', 'grid', true, false, true);
      dg.ToolBarDefaultButtons.ShowDelete = false;
      dg.DBCode = that.config.dBSource;
      dg.IsSimpleSearch = true;
      dg.ToolBarDefaultButtons.ShowAdd = false;
      dg.SingleSelect = !that.windowparms.isMulti;
      dg.ColManageField = 'ColManageField';
      // 表头定义名
      dg.ConfigTableName = 'CustDialog_' + that.config.code;
      if (that.config.sortName != '') {
        dg.SortName = that.config.sortName;
        dg.SortOrder = that.config.sortOrder;
      }
      dg.IsEnableAuthor = that.config.isEnableAuthor;
      // 默认的条件
      if (that.config.divideSql != '') {
        dg.DefaultWhere = that.config.divideSql;
      }
      dg.OperationAction.ShowView = false;
      dg.OperationAction.ShowEdit = false;
      dg.OperationAction.ShowDelete = false;
      dg.EditWidth = 700;
      dg.EditHeight = 360;
      dg.Bind()
    },
    mounted() {
      window.myvm = this;
    },
    methods: {
      collapsedSider() {
        this.isCollapsed = !this.isCollapsed;
      },
      loadWindowparms() {
        const that = this;
        var parmsStr = Object.toQueryString('parms');
        var isSetHead = Object.toQueryString('isSetHead') || 0;
        that.windowparms.isSetHead = isSetHead;
        that.dataGridReSet();
        var parms = {};
        if (parmsStr) {
          parmsStr = decodeURIComponent(parmsStr);
          parms = eval('(' + parmsStr + ')');
          if (parms.isMulti == true || parms.isMulti == 'true') {
            isMulti = true;
          }
          if (parms.varParams) {
            that.windowparms.varParams = parms.varParams;
          }

          if (parms.data != undefined && parms.data.length > 0) {
            that.windowparms.data = parms.data;
            that.resultGridData = parms.data;
          }
          if (parms.isMulti != undefined) {
            that.windowparms.isMulti = parms.isMulti;
          }
          if (parms.resultFieldKey != undefined) {
            that.windowparms.resultFieldKey = parms.resultFieldKey;
          }
          if (parms.needRoot != undefined) {
            that.windowparms.needRoot = parms.needRoot;
          }
        }
      },
      loadCustomConfig() {
        var that = this;
        //格式：[{key:"",value:""}]
        var varParams = that.windowparms.varParams != "" ? JSON.stringify(that.windowparms.varParams) : "";
        var urls = window.top.location.href;
        var key = urls.split('?')[1].split('=')[1];
        var parm = {'isSetHead': that.windowparms.isSetHead, 'code': code, 'varParams': varParams, 'secretKey': key};

        var res = Object.toAjaxJson(FUI.Handlers.supplierOutsideLink, 'getOpenCustomDialogJson', parm);
        var configModel = res.data;
        fieldData = eval('(' + configModel.resultField + ')')
        $.each(fieldData, function (index, item) {
          if (item.isKey == 1) {
            that.keyName = item.fieldName
            that.windowparms.resultFieldKey = that.keyName
          } else {
            that.resultGridColumn[1].field = item.fieldName
            that.resultGridColumn[1].title = item.fieldTitle
          }
        })
        that.dataGridReSet();
        _config = configModel
      },
      pageChange({currentPage, pageSize}) {
        this.tablePage.currentPage = currentPage
        this.tablePage.pageSize = pageSize
        this.tablePage.startIndex = (currentPage - 1) * pageSize
        this.getGridData()
      },
      onTreeSelected(data, treeNode, thisObj) {
        var currCategoryCode = treeNode.data.id
        this.dataGridSearch()
      },
      showAll() {
        this.dataGridSearch()
      },
      filterTreeNode(value, data) {
        if (!value) return true
        return data.title.indexOf(value) !== -1
      },
      dataGridReSet() {
        var that = this
        $.each(this.form, function (key, item) {
          that.form[key] = ''
        })
        that.form.historyVersion = 'false'
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
        const that = this;
        var urls = window.top.location.href;
        var key = urls.split('?')[1].split('=')[1];
        let parm = Object.toClone(that.tableForm.data);
        parm.page = that.tablePage.currentPage;
        parm.rows = that.tablePage.pageSize;
        parm.sort = that.tablePage.sort;
        parm.order = that.tablePage.order;
        parm.searchfields = 'BankBranch,CombineNum';
        parm.secretKey = key;
        parm = Object.extend(parm, that.form);
        var dataSource = '';
        var configTableName = 'CustDialog_BPM_BankBranch_8352';
        var url = FUI.Handlers.supplierOutsideLink + 'getViewTableListData/?deforder=' + that.SortOrder + '&defsort=' + Object.toTrim(that.SortName) + '&viewTable=' + that.ViewTable + '&dataSource=' + dataSource + '&configTableName=' + configTableName + '&isEnableAuthor=' + that.IsEnableAuthor + '&defaultWhere=' + encodeURI(that.DefaultWhere);

        Object.toAjaxJson(url, null, parm, true, null, function (res) {
          if (res.success) {
            that.tableData = res.rows
            that.tablePage.total = res.total
            that.tablePage.pageCount = res.pageCount
          } else {
            FUI.Window.showMsg(res.msg)
          }
        })
      },
      // stand:选对结果区==================
      selectAllEvent(obj) {
        const that = this
        const rows = obj.selection
        const checked = obj.checked
        var keyId = that.windowparms.resultFieldKey
        $.each(rows, function (i, item) {
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
        if (that.windowparms.isMulti == false) {
          const tem = []
          tem.push(row)
          that.resultGridData = tem
        } else {
          let isExist = false
          $.each(that.resultGridData, function (i, item) {
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
        $.each(that.resultGridData, function (i, item) {
          if (item[keyId] != delKeyId) {
            tem.push(item)
          }
        })
        that.resultGridData = tem
      },
      getResult() {
        return this.resultGridData
      },
      onSubmit(){


      },
      singleElection(row) {
        this.templateSelection = row.MyId;
        this.checkList = this.tableData.filter((item) => item.MyId === row.MyId)
        console.log(`该行的编号为${row.MyId}`)
        console.log(this.checkList)
        this.resultGridData = this.checkList;
      },
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
        this.tablePage.currentPage = 1
        this.tablePage.pageSize = val
        this.getGridData()
      },
      handleCurrentChange(val) {
        this.tablePage.currentPage = val
        this.getGridData()
      }
    }
  }
  window.getResult = function () {
    return myvm.getResult()
  }

</script>
