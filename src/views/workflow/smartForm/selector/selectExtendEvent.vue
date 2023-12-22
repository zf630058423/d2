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
            'id': 'root01', 'label': '扩展工具-脚本示例', 'parentId': '0', 'children': [
              { 'id': 'onlineForm_onTabtoolBarItemClick(field)', 'label': '按钮组工具', descript: 'field为控件具体按钮的定义' },
              { 'id': 'onlineForm_onButtonClick(field)', 'label': '自定义按钮', descript: 'field为按钮控件的定义' }

            ]
          },
          {
            'id': 'root01', 'label': '明细表工具栏', 'parentId': '0', 'children': [
              { 'id': 'detailToobar_customButtonXXXClick(that, btn, tableName, rows)', 'label': '自定义按钮事件[示例]', descript: '具体结合按钮绑定JS函数名修改本函数名称' },
              { 'id': '请修改为表对象名_override_add(subVM,  tableName, rows)', 'label': '“添加”事件重写', descript: '对明细列表工具栏添加按钮事件的重写。' },
              { 'id': 'subtable_子表对象名_deleteEvent(subVM,tableName,deleRows,rows)', 'label': '“删除”后置事件触发', content: "console.info(tableName,deleRows,rows)", descript: '删除数据（只是页面数据）后触发此函数,subVM:子表Vue对象，rows：当前剩余的数据,deleRows：被删除的数据' },

              { 'id': '请修改为子表对象名_importBeforeEvent(subVM, mainTableName, tableName, rows)', 'label': '“导入子表数据”前置事件', content: "return true;", descript: 'subVM:为子表控件的Vue对象，明细数据导入的前置事件，返回true继续执行，返回false不执行。' },
              { 'id': '请修改为子表对象名_exportBeforeEvent(subVM, mainTableName, tableName, rows,selectedMyids)', 'label': '“导出子表数据”前置事件', content: "return true;", descript: 'subVM:为子表控件的Vue对象，明细数据导入的前置事件，返回true继续执行，返回false不执行。' }

            ]
          },
          {
            'id': 'root01', 'label': '明细表操作列', 'parentId': '0', 'children': [
              { 'id': 'operation_customButtonXXXClick(subthat, btn, tableName, row)', 'label': '操作列自定义按钮事件[示例]', descript: '具体结合按钮绑定JS函数名修改本函数名称' },
              { 'id': 'FUI.F2Grid.addRowData', content: ' FUI.F2Grid.addRowData("子表实体名", "主表实体名", row);<br>说明：row行的数据格式见表单预览或参照：  var row = [{ "name": "keHuDaiMa字段名","value": "值" }, {"name": "MyId","value": "" }];其中MyId必须有，MyId值为空是新增，MyId值不为空是更新', onlyshow: true, 'label': '插入一行明细[JS示例]', descript: '插入子表的一行明细数据' }
            ]
          },
          {
            'id': 'root02', 'label': '页面事件', 'parentId': '0', 'children': [
              { 'id': 'extend_fuiOnPageLoad()', 'label': 'FUI页面加载完成之后触发', descript: 'FUI页面加载完成之后触发', content: "console.info('页面加载结束')" },
              { 'id': 'myTabsClickXXX(label,tab,field)', 'label': '页面组件Tab点击事件示例', descript: '请修改本事件示例函数名', content: "console.info('tab点击事件',label)" }


            ]
          },
          {
            'id': 'root04', 'label': '流程操作按钮', 'parentId': '0', 'children': [
              { 'id': 'extend_validateWorkflowForm_before()', content: "FUI.Window.showMsg('校验前置错误信息');return false;", 'label': '校验时前置事件', descript: '务必要有返回值true/false; 返回false：校验不通过， 返回true校验通过继续执行' },
              { 'id': 'extend_sendWorkflowForm_before()', content: "FUI.Window.showMsg('提交前置错误信息');return false;", 'label': '提交时前置事件', descript: '务必要有返回值true/false; 返回false：校验不通过， 返回true校验通过继续执行' },
              { 'id': 'extend_saveWorkflowForm_before()', content: "FUI.Window.showMsg('保存前置错误信息');return false;", 'label': '保存时前置事件', descript: '务必要有返回值true/false; 返回false：校验不通过， 返回true校验通过继续执行' },
              { 'id': 'extend_isFixEditForm_click()', content: "FUI.Window.showMsg('编辑按钮事件，由开发实现是否可编辑');return false;", 'label': '编辑按钮点击事件', descript: '由开发校验当前人身份是否允许其编辑表单，流程上下文通过全局变量WFContext获取。返回值true/false; 返回false：不允许编辑， 返回true允许编辑，继续执行将跳转到特殊编辑表单模式' }

            ]
          },
          {
            'id': 'root03', 'label': '常用脚本示例', 'parentId': '0', 'children': [
              { 'id': 'openEditWindow_normal', 'label': '打开普通窗口', descript: '打开普通窗口', onlyshow: true, content: "FUI.Window.openEdit('/admin/org/xxx', '普通窗口', FUI.FormAction.Edit, '', 500, 400);" }
              , { 'id': 'openEditWindow_full', 'label': '打开全屏窗口', descript: '打开全屏窗口', onlyshow: true, content: "FUI.Window.openEdit('/admin/org/xxx', '全屏窗口', FUI.FormAction.Edit, '', 500, 400,null,null,null,true);" }
              , { 'id': 'openDialog', 'label': '打开带回调函数的窗口', descript: '打开全屏窗口', onlyshow: true, content: "FUI.dialog(url, '窗口标题', {}, 450, 500, function (objectData, index, layerObject) {console.info(objectData);layerObject.close(index);}, false);" }
              , { 'id': 'toGetCurrentDateTimeString', 'label': '获取当前时间', descript: '', onlyshow: true, content: "var time= Object.toGetCurrentDateTimeString();" }
              , { 'id': 'UrlParam', 'label': '获取Url参数', descript: '', onlyshow: true, content: " var a=QueryString('a参数名');" }
              , { 'id': 'getServiceData', 'label': '请求数据服务', descript: '', onlyshow: true, content: "var data = FUI.Sys.getServiceData('ChaXunShuJu', { 参数名:参数值 });" }
              , { 'id': 'toAjaxJson', 'label': 'Ajax请求调用', descript: '', onlyshow: true, content: "var res=Object.toAjaxJson('请求后台controller地址','请求的方法名',{参数名:参数值})" }
              , { 'id': 'getAuthor', 'label': '获取当前登录者凭证信息', descript: '', onlyshow: true, content: "var author = FUI.Sys.getAuthor();" }
              , { 'id': 'customDialog', 'label': '打开自定义对话框', descript: '', onlyshow: true, content: " var that=myvm;var customDialog = eval(CustomDialog);customDialog(that, {customDialog:'自定义对话框别名编码',callBack:function(data){console.info(data);}});" }
              , { 'id': 'getFieldValue', 'label': '获取主表字段值', descript: '', onlyshow: true, content: "var that=myvm;var value=that.data['实体名.字段名']" }
              , { 'id': 'workflowAPI', 'label': '调用工流程API脚本', descript: '', onlyshow: true, content: "var res=FUI.Sys.requestWorkflowAPI('API地址', {参数名:参数值})" }
            ]
          },
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