<template>
  <div class="f2bpmui-datagrid-vuetable-container mytable">
    <div v-if="toolbar&&toolbar.buttons.length>0" id="grid-toolbar" class="grid-toolbar">
      <template v-for="(btn,index) in toolbar.buttons">
        <el-button v-if="buttonIsHaveShowPower(btn.code)" :key="index" :code="btn.code" size="small" :type="btn.status" @click="toolbarClick(btn,$event)"><i :class="btn.icon" /><span v-html="language== 'en-US'?btn.alias: btn.name" /></el-button>
      </template>
    </div>
    <!-- row-key：之前值是PK -->
    <el-table
      id="grid"
      ref="f2bpmuiVuetable"
      :key="tableKey"
      v-loading="loading"
      :show-summary="showSummary"
      :summary-method="getSummaries"
      class="f2bpmui-datagrid-vuetable"
      size="small"
      :height="tableHeight"
      :stripe="stripe"
      :border="border"
      :row-key="rowKey"
      :data="rows"
      element-loading-text="加载中"
      fit
      highlight-current-row
      @select="selectionChange"
      @select-all="selectAll"
      @cell-dblclick="celldblclick"
      @sort-change="sortChange"
      @header-contextmenu="headRightClick"
    >
      <!--单选-->
      <el-table-column v-if="showCheckbox&&checkBoxType=='radio'" fixed="left" dir="" width="40" align="center" header-align="center">
        <template slot="header">
          <el-checkbox v-if="checkBoxType=='checkbox'" v-model="checkedAll" @change="checkAllChange" />
        </template>
        <template slot-scope="scope">
          <!-- <el-checkbox :checked="scope.row._checked" @change="checked=>checkedChange(checked, scope.row)" v-if="checkBoxType=='checkbox'"></el-checkbox> -->
          <el-radio v-model="radioVal" style="margin-left: 3px" :label="scope.row" name="radio" @change="radioChange"><span /></el-radio>
        </template>
      </el-table-column>
      <!--多选-->
      <el-table-column v-if="showCheckbox&&checkBoxType=='checkbox'" type="selection" fixed="left" align="center" width="45" @click="rowClick" />

      <el-table-column v-if="showSeq" :label="$t('number')" type="index" fixed="left" width="50" align="center" :index="indexMethod" />

      <template v-for="(col, index) in columns">
        <el-table-column v-if="!col.hidden&&col.type!='seq'&&col.type!='radio'&&col.type!='checkbox'" :key="index" :show-overflow-tooltip="true" :label="columnLangTitle(col)" :prop="col.field" header-align="center" :sortable="col.sort ? 'custom' : false" :min-width="col.width" :fixed="col.fixed" :align="col.align">
          <template slot-scope="scope">
            <div v-if="col.formatter != undefined" v-html="filterFormatter(scope.row, col, scope.row[col.field], index) " />
            <!--render 方式-->
            <div v-else-if="col.slots != undefined">
              {{ renderToHtml(col, scope.row, index) }}
              <slot :name="col.field" />
            </div>
            <div v-else v-html="scope.row[col.field]" />
          </template>

        </el-table-column>
      </template>

    </el-table>
    <div class="mt4 mb4 tc">
      <el-pagination v-if="ispager" small background :current-page="tablePage.currentPage" :page-sizes="tablePage.pageSizes" :page-size="tablePage.pageSize" :layout="tablePage.layout" :total="tablePage.total" @size-change="pageSizeChange" @current-change="pageChange" />
    </div>

    <div v-show="menuVisible" id="gridHeadMenu" :class="contextMenu.className+' treeRightMenu'">
      <el-menu id="menu" size="mini" text-color="#000" @select="headMenuClickEvent">
        <el-menu-item v-for="item in contextMenu.header.options" :key="item.code" size="mini" :index="item.code">
          <i :class="item.prefixIcon" />{{ item.name }}
        </el-menu-item>
      </el-menu>
    </div>
  </div>
</template>

<script>

  export default {
    name: 'F2bpmDatagrid',
    props: {
      // showSummary: { type: Boolean, default: () => { return false; }},
      // 使用full-12的表达式，窗口高度减去指定高度,默认自适应
      height: { default: () => { return false; } },
      // 展开或收起
      expandSearch: {},
      // 展开时高度减去的偏移量,-1为此参数不配置
      expandSubheight: { type: Number, default: () => { return -1; } },
      // 是否加载loading
      loading: { type: Boolean, default: () => { return false; } },
      // 是否带有纵向边框
      border: { type: Boolean, default: () => { return true; } },
      rowKey: { type: String, default: 'Wiid' },
      // 是否为斑马纹 table
      stripe: { type: Boolean, default: () => { return false; } },
      // 主键字段名
      pk: { type: String },
      // 列表id
      grid: { type: String, required: true },
      // 分页配置及总数量 配置,pagination:false不分页
      pagerConfig: { type: Object },
      // 列定义
      columns: { type: Array, required: true },
      // 列表行数据
      data: { type: Array, required: true },
      // 工具格
      toolbar: { type: Object },
      // 表头右键菜单{header: {options: headerMenus},className: 'my-menus'}
      contextMenu: { type: Object, default: () => { return { header: { options: [] }, className: 'my-menus' }; } },
      fieldPowers: {
        type: Object, default: () => { return null; }
      }
      // getSummaries:{type: Array, required: true }
    },
    data() {
      return {
        language: '',
        currRealName: '',
        currAccount: '',
        // 为了可以让表格重新渲染复选框控件
        tableKey: 'table',
        checkedAll: false,
        // 单选间距的行数据
        radioVal: '',
        // 序号及复选框
        showSeq: false,
        showCheckbox: false,
        checkBoxType: 'checkbox',

        menuVisible: false,
        tableHeight: 300,
        tablePage: {},
        ispager: false,
        // 主键所在操作列
        // primaryCol: {},
        tablePage_demo: {
          pageCount: 0,
          sort: '', // 排序字段
          order: 'asc', // 排序方向
          total: 0,
          currentPage: 1,
          pageSize: 15,
          align: 'center',
          pageSizes: [2, 10, 15, 20, 50, 100, 200, 500],
          layout: 'total, sizes, prev, pager, next, jumper'
        },
        rows: [],
        multipleSelection: [],
        showSummary: false,
        showSummaryNameS: []
        // tableData: [
        //     { workflowTitle: '测试1', sheetId: "BE11" },
        //     { workflowTitle: '测试2', sheetId: "BE22" },
        //     { workflowTitle: '测试3', sheetId: "BE33" },
        //     { workflowTitle: '测试4', sheetId: "BE44" }
        // ],
        // tableColumn: [
        //     {
        //         field: "sheetId",
        //         title: "流程单号",
        //         width: 220,
        //         sort: true,
        //         align: "center",
        //         type: "html",
        //         formatter: function (row, column, value, index) {
        //             return value + ":+格式化后的内容";
        //         },
        //     },
        //     {
        //         field: "workflowTitle",
        //         title: "标题",
        //         width: 480,
        //         align: "left",
        //         type: "html",
        //     },
        // ],

      };
    },
    computed: {
      columnLangTitle() {
        return function(item) {
          // console.log("是否要合计1：",item,this.showSummary)
          // 个表头是否要合计
          if (item.isAmountTo == 1) {
              // 如果有一个表头是要合计 那就显示合计行

              if (!this.showSummary) {
                //  console.log("是否要合计：",item)
                this.showSummary = true
              }
          }
          var enTitle = item.alias;
          if (enTitle == '' || enTitle == null) {
            enTitle = item.title;
          }
          var zhTitle = item.title;
          return this.language == 'en-US' ? enTitle : zhTitle;
        };
      },
       buttonIsHaveShowPower() {
        return function(buttonName) {
          var that = this;
          if (that.fieldPowers != null && that.fieldPowers.hasOwnProperty(buttonName)) {
            return that.fieldPowers[buttonName].isShow;
          }
          return true;
        };
      }
    },
    watch: {
      expandSearch(val, oldVal) {
        if (val != null && val != undefined) {
          console.info('watch:' + val);
          this.autoResizeHeight();
        }
      },
       data(val, oldVal) {
        var that = this;
        // 默认是立即执行
        if (val != undefined) {
          var data = val;
          that.checkedAll = false;
          data.forEach(function(item, index) {
            item._selectedkey = Object.toGuid();
            item._checked = false;
          });
          that.rows = data;
          // 获取需要合计字段title
          that.showSummaryNameS = [];
          for (let i = 0; i < that.columns.length; i++) {
            if (that.columns[i].isAmountTo && that.columns[i].isAmountTo === 1) {
              that.showSummaryNameS.push(that.columns[i].title)
            }
          }
          setTimeout(function() {
            /* that.$forceUpdate(); */
            that.$refs.f2bpmuiVuetable.doLayout();
          }, 80);
        }
      }
    },
    mounted() {
      var that = this;
      // 添加监听
      document.addEventListener('click', this.listen);
      window.onresize = () => {
        return (() => {
          that.autoResizeHeight();
        })();
      };
    },
    created() {
      var that = this;
      var language = this.$store.state.app.language;
      that.language = language;
      that.currRealName = decodeURI(that.$store.state.user.author.realName);
      // 找出序号列和复选框列
      console.log('this.columns:', that.columns);
      var checkBoxColumn = that.columns.find(c => c.type == 'checkbox' || c.type == 'radio');
      console.log('checkBoxColumn===:', checkBoxColumn);
      if (checkBoxColumn && !checkBoxColumn.hidden) {
        that.showCheckbox = true;
        that.checkBoxType = checkBoxColumn.type;
      }
      var seqColumn = that.columns.find(c => c.type == 'seq');
      if (seqColumn && !seqColumn.hidden) {
        that.showSeq = true;
      }
      that.autoResizeHeight();
      if (that.pagerConfig) {
        that.tablePage = that.pagerConfig;
        that.ispager = true;
      }
    },
    methods: {
      getSummaries(param) {
        const that = this;
        const { columns, data } = param;
        const sums = [];
        columns.forEach((column, index) => {
          if (index == 5) { // 第5个不要是悬浮 并且非合计字段
            sums[index] = '总计:';
            return;
          }
           const _isAmountTo = that.showSummaryNameS.includes(column.label);
            if (_isAmountTo) {
              const values = data.map(item => Number(item[column.property]));
              if (!values.every(value => isNaN(value))) {
                sums[index] = values.reduce((prev, curr) => {
                  const value = Number(curr);
                  if (!isNaN(value)) {
                    return prev + curr;
                  } else {
                    return prev;
                  }
                }, 0);
                // sums[index] += ' 元';
                sums[index] = Object.numberFixed(sums[index], 2)
              } else {
                sums[index] = '--';
              }
          } else {
            sums[index] = '';
            return;
          }
        });
        return sums;
      },

      indexMethod(index) {
        // 设置序列号
        return (
          (Number(this.tablePage.currentPage) - 1) * Number(this.tablePage.pageSize) + index + 1
        );
      },
      selectAll(selection) {
        var that = this;
        that.checkedAll = selection.length > 0;
        that.rows.forEach(function(item, index) {
          item._checked = that.checkedAll;
        });
        var selection = that.rows;
        var obj = { selection: selection, checked: that.checkedAll };
        this.$emit('checkbox-all', obj);
      },
      checkAllChange(val) {
        var that = this;
        that.rows.forEach(function(item, index) {
          item._checked = val;
        });
        that.tableKey = Object.toGuid();
        var selection = that.rows;
        var obj = { selection: selection, checked: val };
        this.$emit('checkbox-all', obj);
      },
      selectionChange(selection, row) {
        var isChecked = false;
        selection.forEach(function(item, index) {
          item._checked = true;
          if (row._selectedkey == item._selectedkey) {
            isChecked = true;
          }
        });
        row._checked = isChecked;
        var obj = { row: row, checked: isChecked };
        this.$emit('checkbox-change', obj, selection);
      },
      // 设置选中或取消选中的行
      toggleSelection(rows) {
        if (rows) {
          rows.forEach(row => {
            this.$refs.f2bpmuiVuetable.toggleRowSelection(row);
          });
        } else {
          this.$refs.f2bpmuiVuetable.clearSelection();
        }
      },
      radioChange(row) {
        var that = this;
        var obj = { row: that.radioVal, checked: that.radioVal_checked };
        this.$emit('radio-change', obj);
      },
      // 获取选中的行
      getCheckboxRecords() {
        var that = this;
        var list = [];
        if (that.checkBoxType == 'radio') {
          list.push(that.radioVal);
        } else {
          list = that.rows.filter(d => d._checked);
        }
        return list;
      },
      // 双击单元格时触发
      celldblclick(row, column, cell, event) {
        this.$emit('cell-dblclick', { row: row, column: column, cell: cell, event: event });
      },
      // 格式化
      filterFormatter: function(row, col, value, index) {
        var that = this;
        var fun = col.formatter;
        var result = fun(row, col, value, index, that);
        return result;
      },
      // 执行slots渲染 JSX 渲染函数
      renderToHtml(col, row, index) {
        if (typeof col.slots) {
          this.$slots[col.field] = [
            col.slots.default({ row: row, column: col, index: index }, this.$createElement)
          ];
          return;
        }
        return;
      },
      // 操作列按钮点击
      operateClick() {

      },
      sortChange({ column, prop, order }) {
        var orderName = order == 'ascending' ? 'asc' : 'desc';
        this.$emit('sort-change', { column: column, field: prop, order: orderName });
      },
      pageSizeChange(val) {
        var that = this;
        this.$emit('page-change', {
          currentPage: 1,
          pageSize: val
        });
      },
      pageChange(val) {
        var that = this;
        this.$emit('page-change', {
          currentPage: val,
          pageSize: that.tablePage.pageSize
        });
      },
      toolbarClick(btn, enent) {
        console.log('btn===:', this.toolbar, btn, enent);
        this.$emit('toolbar-button-click', { code: btn.code, btn: btn }, enent);
      },
      autoResizeHeight() {
        var that = this;
        var theHeight = $(window).height();
        if (that.height) {
          if (typeof that.height === 'string') {
            var express = that.height.replace('full', theHeight + '');
            theHeight = eval(express);
          } else {
            theHeight = that.height;
          }
        } else if (that.toolbar && that.toolbar.buttons.length > 0) {
          // 默认情况:有工具栏时
          theHeight = theHeight - 200;
        } else {
          // 无工具栏时
          theHeight = theHeight - 180;
        }

        if (that.expandSubheight != -1 && (that.expandSearch == 'expand' || that.expandSearch == 'expand2')) {
          // 减去列表配置展开时高度偏移量
          theHeight = theHeight - that.expandSubheight;
        } else if (that.expandSearch == 'expand') {
          // 展开时
          theHeight = theHeight - 40;
        } else if (that.expandSearch == 'expand2') {
          // 展开时
          theHeight = theHeight - 80;
        }
        that.tableHeight = theHeight;
      },
      // 表头右键点击时弹出菜单
      headRightClick(column, event) {
        var that = this;
        var isSetHead = Object.toQueryString('isSetHead') || '';
        if (isSetHead != 1 && that.currRealName.indexOf('管理员') == -1 && that.currRealName.indexOf('admin') == -1) {
          return false;
        }
        this.menuVisible = true;
        const menu = document.querySelector('#gridHeadMenu');
        menu.style.left = event.clientX - 210 + 'px';
        menu.style.top = event.clientY - 10 + 'px';
        // 取消默认的行为
        event.preventDefault();
        // 阻止一个事件起泡。
        event.stopPropagation();
      },
      // 表头菜单点击事件
      headMenuClickEvent(code) {
        this.$emit('header-contextmenu', code);
      },
      listen() {
        this.menuVisible = false;
      },
      // 行点击方法
      rowClick(row) {
        var that = this;
        if (that.checkBoxType == 'checkbox') {
          const selected = that.multipleSelection.some(item => item._selectedkey === row._selectedkey); // 是取消选择还是选中
          if (!selected) { // 不包含   代表选择
            this.multipleSelection.push(row);
            that.$refs.f2bpmuiVuetable.toggleRowSelection(row, true);
          } else { // 取消选择
            var finalArr = that.multipleSelection.filter((item) => {
              return item.id !== row.id
            });
            that.multipleSelection = finalArr; // 取消后剩余选中的
            that.$refs.f2bpmuiVuetable.toggleRowSelection(row, false);
          }
            var obj = { row: row, checked: !selected };
            that.$emit('checkbox-change', obj);
        } else if (that.checkBoxType == 'radio') {
         that.radioVal = row;
         var that = this;
         var obj = { row: that.radioVal, checked: that.radioVal_checked };
          that.$emit('radio-change', obj);
        }
      }
    }
  }
</script>
<style lang="scss" scoped>
  .el-table__body tr.hover-row>td {
    background-color: #FAFCFF !important;
  }

  .el-table__body tr.current-row>td {
    background-color: #f4f9fe;
  }

  ::v-deep .el-table__footer-wrapper {
    position: relative;
    z-index: 111;
    table{
      tr{
        td{
          div.cell{
            font-size: 12px; font-weight: bold;
          color: #666;
        }
        }
      }
    }
 }
 ::v-deep .el-table__fixed-footer-wrapper .el-table__footer{ display: none;}

 ::v-deep  .el-table_fixed,  ::v-deep .el-table__fixed-right {
height:100% !important;
}
::v-deep .el-table__fixed-body-wrapper {height:100 !important;}
::v-deep .el-table__fixed-body-wrapper .el-table__body {
padding-bottom: 60px; // 滚动条高度
}
</style>
