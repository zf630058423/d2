<template>
  <div class="f2bpm-page-layout">
    <el-container>
      <el-aside ref="sideLeft" class="f2bpm-page-left" hide-trigger collapsible :width="isCollapsed?'20px':'250px'">
        <div class="f2bpm-panel-head">
          <div v-if="!isCollapsed" class="f2bpm-left-search-div">
            <el-input v-model="treeFilterText" class="left-htead-treeFilterText-box" style="width:240px" size="small" clearable :placeholder="$t('enterKey')" autocomplete="off" prefix-icon="el-icon-search" />
          </div>
        </div>
        <div v-if="!isCollapsed" class="f2bpm-page-left-content auto-window-height">
          <el-tree ref="mytree" :data="treeData" :filter-node-method="filterTreeNode" :expand-on-click-node="false" default-expand-all @node-click="onTreeSelected" />
        </div>
      </el-aside>
      <el-aside ref="sideRight" class="f2bpm-selector-page-right" width="243px">
        <f2bpm-datagrid ref="gridResult" grid="gridResult" height="full" :data="resultGridData" :columns="resultGridColumn" />
      </el-aside>
    </el-container>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        formDefId: '',
        wid: '',
        windowparms: { resultFieldKey: 'value', singleSelect: true },
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
        tableColumn: [],

        // ===========标准区结束==========
        searchParams: {
          // 特殊查询
          CategoryCode: ''
        },
        // =======选择结果Grid===========
        resultGridData: [],
        resultGridColumn: [{
          field: 'value',
          title: '值',
          hidden: true,
          align: 'center'
        }, {
          field: 'text',
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
                    click: () => this.delRow(row.value)
                  }
                }, '')];
            }
          }
        }]
      };
    },
    watch: {
      treeFilterText(val) {
        this.$refs.mytree.filter(val);
      }
    },
    computed: {
      countGridHeight() {
        return $(document).height() - global_datagridHeightDiff;
      },
      rotateIcon() {
        return this.isCollapsed
          ? 'fa fa-angle-double-right'
          : 'fa fa-angle-double-left';
      },
      positionIcon() {
        return this.isCollapsed
          ? 'cursor:pointer; position: relative;left: -5px;'
          : 'cursor:pointer; position: relative;left: 100px;';
      }
    },
    created() {
      var that = this;
      var formDefId = Object.toQueryString('formDefId') || '';
      var wid = Object.toQueryString('wid') || '';
      that.loadWindowparms();
      that.formDefId = formDefId;
      that.wid = wid;
      that.loadTree();
    },
    mounted() {
      window.myvm = this;
      window.autoPageHeight();
    },

    methods: {
      filterTreeNode(value, data) {
        if (!value) return true;
        return data.label.indexOf(value) !== -1;
      },
      collapsedSider() {
        this.isCollapsed = !this.isCollapsed;
      },
      onTreeSelected(data, treeNode, thisObj) {
        var value = treeNode.data.id;
        var text = treeNode.data.label;
        var descript = treeNode.data.descript;
        var onlyshow = treeNode.data.onlyshow;
        var content = treeNode.data.content;
        if (onlyshow === true) {
          var lable = treeNode.data.label;
          FUI.Window.showMsg(treeNode.data.content, lable, 1);
          return false;
        }
        this.addSelect({ value: value, text: text, descript: descript, content: content });
      },
      loadWindowparms() {
        const that = this;
        var parmsStr = Object.toQueryString('parms');
        var parms = {};
        if (parmsStr) {
          parmsStr = decodeURIComponent(parmsStr);
          parms = eval('(' + parmsStr + ')');
          if (parms.data != undefined && parms.data.length > 0) {
            that.windowparms.data = parms.data;
            that.resultGridData = parms.data;
          }
          if (parms.singleSelect != undefined) {
            that.windowparms.singleSelect = parms.singleSelect;
          }
        }
      },
      loadTree() {
        var that = this;
        var treeData = [
          {
            'id': 'root02', 'label': '页面事件', 'parentId': '0', 'children': [
              { 'id': 'extend_pageLoad()', 'label': '页面加载完成之后触发', descript: '页面加载完成之后触发', content: "console.info('页面加载结束')" },
              { 'id': 'extend_gridDone($vm,data,curr,count)', 'label': 'Grid列表加载完时触发', descript: 'data为当前页数据、count为数据总长度、curr当前页码', content: "console.info('Grid列表加载完时触发')" },

            ]
          },
          {
            'id': 'root03', 'label': '工具栏按钮事件', 'parentId': '0', 'children': [
              { 'label': '导出按钮前置事件', 'id': 'customDataGrid_exportBeforeEvent(tableName, selectedIds, selectedRows)', content: "FUI.Window.showMsg('导出按钮前置事件');console.info(tableName, selectedIds, selectedRows);return false;", descript: 'tableName:物理表名；selectedIds:当前选中的主键；selectedRows：选中的多行数据；返回true或者false; true继续执行，false：阻断执行 ' },
              { 'label': '导入按钮前置事件', 'id': 'customDataGrid_importBeforeEvent(tableName)', content: "FUI.Window.showMsg('导入按钮前置事件'); return false;", descript: 'tableName:物理表名；返回true或者false; true继续执行，false：阻断执行 ' },
              { 'label': '工具栏批量删除时的前置事件', 'id': 'myToolBarBeforeDelete($vm,idFieldValues)', content: "return false;", descript: '返回true或者false; true继续执行，false：阻断执行 ' },
              { 'label': '工具栏批量删除时的后置事件', 'id': 'myToolBarAfterDelete($vm,idFieldValues)', content: "删除后置事件;", descript: 'callback中调用自己的逻辑代码' },
            ]
          },
          {
            'id': 'root04', 'label': '操作列按钮事件', 'parentId': '0', 'children': [
              { 'label': '操作列查看按钮前置事件', 'id': 'perationViewEvent_before($vm,value, row, index)', content: "return false;", descript: '返回true或者false; true继续执行，false：阻断执行 ' },
              { 'label': '操作列编辑按钮前置事件', 'id': 'perationEditEvent_before($vm,value, row, index)', content: "return false;", descript: '返回true或者false; true继续执行，false：阻断执行 ' },
              { 'label': '操作列自定义按钮的事件示例', 'id': 'myTestXXX($vm,value, pkValue,row, index)', content: " ", descript: '$vm：vue对象；value:所在单元格的值；pkValue:所在行的主键值；row:当前行值Json；index:所在行索引，从0开始；获取其它属性：row["列属性名"]；  ' },
              { 'label': '是否显示操作列的某个自定义按钮', 'id': 'extend_OperationShowCustomButton(btn, row, index)', content: " console.info(btn);return true; ", descript: '是否显示自定义操作按钮，返回true/false' },

            ]
          }
          , {
            'id': 'root05', 'label': '其它示例脚本方法', 'parentId': '0', 'children': [
              { 'label': '格式化列单元格显示值示例', 'id': 'myFormatterXXX(value, row, index)', content: "return '返回你格式化后的值，支持html';", descript: '需要将此函数对象名“myFormatterXXX”配置到列表表头配置中的“显示格式化JS对象”,返回你格式化后的值，支持html' },
              { 'label': '是否显示操作列的默认按钮：查看，编辑，删除', 'id': 'extend_OperationShowDefaultButton(value, row, index)', content: "var config={showEdit:true,showView:true,showDelete:true}; return config;", descript: '  //showEdit编辑，showView查看，showDelete:删除 ' },

            ]
          }
          , {
            'id': 'root99', 'label': '获取数据', 'parentId': '0', 'children': [
              { 'label': '获取选中行指定列数据', 'id': 'normal1', onlyshow: true,  content: "var appIds = that.dg.getChecked('字段名');", descript: '' },
              { 'label': '获取选中行的数据', 'id': 'normal2', onlyshow: true,  content: "var rows=that.dg.getCheckedRows();", descript: '' },
              { 'label': '刷新列表', 'id': 'normal3', onlyshow: true,  content: "var that=myvm;that.dg.Reload();", descript: '' },
              { 'label': '获取当前登录用户的信息', 'id': 'normal4', onlyshow: true,  content: "var currUser  = FUI.Sys.getAuthor();var currUserRealName=decodeURI(currUser.realName);", descript: '' },
             
            ]
          }
        ];
        that.treeData = treeData;
      },
      // stand:选对结果区==================
      addSelect(row) {
        const that = this;
        const keyId = that.windowparms.resultFieldKey;
        if (parms.singleSelect) {
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
      getResult() {

        return this.resultGridData;
      }
    }
  };
  window.getResult = function () {
    return myvm.getResult();
  }
</script>