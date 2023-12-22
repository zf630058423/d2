<template>
  <div class="f2bpm-page-dialog-layout">
    <el-container>
      <el-aside ref="sideLeft" class="f2bpm-page-left" hide-trigger collapsible :width="isCollapsed?'20px':'250px'">
        <div class="f2bpm-panel-head">
          <div v-if="!isCollapsed" class="f2bpm-left-search-div" style="width:210px">
            <el-input v-model="treeFilterText" size="mini" style="border: 0px;" clearable :placeholder="$t('enterKey')" autocomplete="off" prefix-icon="el-icon-search" />
          </div>
          <div style=" float: right;line-height:35px;padding-right: 5px;">
            <i v-if="!isCollapsed" :title="$t('refresh')" class="fa fa-refresh  cur mr10 font12 " @click="loadTree()" />
          </div>
        </div>
        <div v-if="!isCollapsed" class="f2bpm-page-left-content auto-window-height mt5">
          <el-tree ref="mytree" :data="treeData" :filter-node-method="filterTreeNode" :expand-on-click-node="false" default-expand-all @node-click="onTreeSelected" />
        </div>
      </el-aside>
      <el-aside ref="sideRight" class="f2bpm-selector-page-right" width="193px">
        <f2bpm-datagrid ref="gridResult" grid="grid" height="full" :ispager="false" :data="resultGridData" :columns="resultGridColumn" />
      </el-aside>
    </el-container>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        parms: {},
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
    }, computed: {
      countGridHeight() {
        return $(document).height() - global_selector_datagridHeightDiff;
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
      var that = this;
      var parmsStr = Object.toQueryString('parms');
      var parms = {};
      if (parmsStr) {
        // {"needRoot": false, singleSelect: singleSelect, groupKey: groupKey, data: []}
        parmsStr = decodeURIComponent(parmsStr);
        parms = eval('(' + parmsStr + ')');
        that.parms = parms;
        // 是否单选：true单选，false:多选
        var singleSelect = false;
        // 参数说明{singleSelect:false,data[{},{}]}
        // 初始化选中的数据，[{ "value": "2222", "text": "55555" }]
        var resultGridData = parms.data || [];
        that.resultGridData = resultGridData;
      }
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
      onTreeSelected(data, treeNode, thisObj) {
        var value = treeNode.data.id;
        var text = treeNode.data.title;
        this.addSelect({ value: value, text: text });
      },
      filterTreeNode(value, data) {
        if (!value) return true;
        return data.title.indexOf(value) !== -1;
      },
      loadTree() {
        var that = this;
        var treeUrl = FUI.Handlers.CategoryHandler + '?groupKey=' + that.parms.groupKey + '&needRoot=' + that.parms.needRoot;
        Object.toAjaxJson(treeUrl, null, null, true, null, function (res) {
          if (res.success) {
            that.treeData = res.data;
            var msg = res.msg;
          } else {
            FUI.Window.showMsg(that, res.msg);
          }
        });
      },
      // stand:选对结果区==================
      addSelect(row) {
        const that = this;
        const keyId = 'value';
        if (that.parms.singleSelect) {
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
        const keyId = 'value';
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