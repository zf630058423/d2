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
          <el-tree ref="mytree" node-key="id" :default-expanded-keys="defaultExpandedKeys" :data="treeData" :filter-node-method="filterTreeNode" :expand-on-click-node="false" @node-click="onTreeSelected" />
        </div>
      </el-aside>
      <el-aside ref="sideRight" class="f2bpm-selector-page-right" width="260px">
        <div style="padding-left: 3px;height: 340px;">
          <f2bpm-datagrid ref="gridResult" grid="gridResult" height="full-40" :data="resultGridData" :columns="resultGridColumn" />
          <div>
            <span id="clearEmpty2" class="cur" @click="clearAll()"><i class="fa fa-minus-circle" />清空所选</span>
          </div>
        </div>
      </el-aside>
    </el-container>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        defaultExpandedKeys: [],
        windowparms: { resultFieldKey: 'groupId', needRoot: false, data: [] },
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
          field: 'id',
          title: '值',
          hidden: true,
          align: 'center'
        }, {
          field: 'text',
          title: '部门名称',
          align: 'center'
        }, {
          field: 'action',
          title: '操作',
          width: 50,
          type: 'html',
          align: 'center',
          slots: {
            // 使用 JSX 渲染函数
            default: ({ row, column }, h) => {
              return [
                h('button', {
                  attrs: { title: '删除' },
                  class: 'btn btn-minier btn-grey mr2 fa fa-trash',
                  on: {
                    click: () => this.delRow(row.id)
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

    }, mounted() {
      window.myvm = this;
      this.loadTree();
      this.loadWindowparms();
      window.autoPageHeight();
    },

    methods: {
      collapsedSider() {
        this.isCollapsed = !this.isCollapsed;
      },
      loadWindowparms() {
        const that = this;
        var parmsStr = Object.toQueryString('parms');
        console.log(parmsStr,'dasa')
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
          if (parms.resultFieldKey != undefined) {
            that.windowparms.resultFieldKey = parms.resultFieldKey;
          }
          if (parms.needRoot != undefined) {
            that.windowparms.needRoot = parms.needRoot;
          }
        }
      },
      onTreeSelected(data, treeNode, thisObj) {
        var that = this;
        var attributes = data.attributes;
        var id = attributes.groupId; //groupId
        var text = attributes.groupName;
        that.addSelect({ id: id, text: text });
      },
      filterTreeNode(id, data) {
        if (!id) return true;
        return data.title.indexOf(id) !== -1;
      },
      loadTree() {
        var that = this;
        var treeUrl = FUI.Handlers.OrgImplController + 'getOrgList/?needRoot=' + that.windowparms.needRoot;
        Object.toAjaxJson(treeUrl, null, null, true, null, function (res) {
          if (res.success) {
            that.treeData = res.data;
            console.log(that.treeData)
            var msg = res.msg;
            that.loadDefaultExpandedKeys();
          } else {
            FUI.Window.showMsg(res.msg);
          }
        });
      },
      loadDefaultExpandedKeys() {
        var that = this;
        that.defaultExpandedKeys = [];
        //默认展开到第几级
        var level = 2;
        Object.toTreeCollection(that.treeData, 'id', that.defaultExpandedKeys, level);
      }
      // stand:选对结果区==================
      , addSelect(row) {
        const that = this;
        const keyId = 'id';
        if (that.windowparms.singleSelect) {
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
        const keyId = 'id';
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
      },
      clearAll() {
        this.resultGridData = [];
      }
    }

  };

  window.getResult = function () {
    return myvm.getResult();
  }
</script>
