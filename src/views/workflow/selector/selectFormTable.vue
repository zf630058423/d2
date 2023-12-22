<template>
  <div class="f2bpm-page-layout">

    <el-container>
      <el-aside ref="sideLeft" class="f2bpm-page-left" hide-trigger collapsible :width="isCollapsed?'20px':'250px'">
        <div class="f2bpm-panel-head">
          <div v-if="!isCollapsed" class="f2bpm-left-search-div">
            <el-input v-model="treeFilterText" class="left-htead-treeFilterText-box" size="small" clearable :placeholder="$t('enterKey')" autocomplete="off" prefix-icon="el-icon-search" />
          </div>
          <div style=" float: right;line-height:35px;padding-right: 5px;">
            <i v-if="!isCollapsed" :title="$t('refresh')" class="fa fa-refresh  cur mr10 font12 " @click="loadTree()" />
            <i title="收起/展开" :class="rotateIcon" @click="collapsedSider" />
          </div>
        </div>
        <div v-if="!isCollapsed" class="f2bpm-page-left-content auto-window-height-select mt4">
          <el-tree ref="mytree" :data="treeData" :filter-node-method="filterTreeNode" :expand-on-click-node="false" default-expand-all @node-click="onTreeSelected" />
        </div>
      </el-aside>
      <el-aside ref="sideRight" class="f2bpm-selector-page-right" width="180px">
        <f2bpm-datagrid ref="gridResult" grid="gridResult" height="full" :data="resultGridData" :columns="resultGridColumn" />
      </el-aside>
    </el-container>
  </div>
</template>

<script>
  // 选择表单中的数据库表
  export default {
    data() {
      return {
        isNeedField: '',
        formDefId: '',
        levelType: '',
        valueProName: "",
        windowparms: { resultFieldKey: 'value' },
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
        return $(window).height() - global_selector_datagridHeightDiff;
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
      var isNeedField = Object.toQueryString('isNeedField') || false;
      var formDefId = Object.toQueryString('formDefId') || '';
      // main只能选择主表或主字段,sub只能选择子表或子字段
      var levelType = Object.toQueryString('levelType') || '';
      //选择表时使用哪个属性做为值，默认为ID
      var valueProName = Object.toQueryString('valueProName') || '';
      that.valueProName = valueProName;
      that.isNeedField = isNeedField;
      that.formDefId = formDefId;
      that.levelType = levelType;
      that.loadWindowparms();
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
      loadWindowparms() {
        const that = this;
        var parmsStr = Object.toQueryString('parms');
        var parms = {};
        if (parmsStr) {
          parmsStr = decodeURIComponent(parmsStr);
          parms = eval('(' + parmsStr + ')');
          if (parms.data != undefined && parms.data.length > 0) {
            $.each(parms.data, function (i, item) {
              that.resultGridData.push(item);
            });
          }
          if (parms.singleSelect != undefined) {
            that.windowparms.singleSelect = parms.singleSelect;
          }
          if (parms.resultFieldKey != undefined) {
            that.windowparms.resultFieldKey = parms.resultFieldKey;
          }
          that.tableType = parms.tableType;
        }
      },
      onTreeSelected(data, treeNode, thisObj) {
        var that = this;
        var value = data.id;
        var text = data.title;
        if (data.attributes) {
          var str = data.attributes;
          var json = eval('(' + str + ')');
          if (that.levelType != '' && that.levelType != json.leveltype) {
            if (that.levelType == 'main') {
              FUI.Window.showMsg('您只能选择主表');
              return false;
            } else if (that.levelType == 'sub') {
              FUI.Window.showMsg('您只能选择子表');
              return false;
            }
          }
          if (json.type == 'field') {
            var valueProName = that.valueProName || "columnId";
            that.addSelect({ value: json[valueProName], text: data.text });
          } else if (json.type == 'table' || json.type == 'subtable') {
            var valueProName = that.valueProName || "tableId";
            that.addSelect({ value: json[valueProName], text: data.text });
          }
        }
      },
      filterTreeNode(value, data) {
        if (!value) return true;
        return data.title.indexOf(value) !== -1;
      },
      loadTree() {
        var that = this;
        var treeUrl = FUI.Handlers.SmartFormHandler + 'getTableTreeJsonByformDefId/?isNeedField=' + that.isNeedField + '&formDefId=' + that.formDefId;
        Object.toAjaxJson(treeUrl, null, null, true, null, function (res) {
          if (res.success) {
            that.treeData = res.data;
            console.info(that.treeData);
            var msg = res.msg;
          } else {
            FUI.Window.showMsg(res.msg);
          }
        });
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