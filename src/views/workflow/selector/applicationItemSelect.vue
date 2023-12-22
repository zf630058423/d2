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
          <el-tree ref="mytree" :data="treeData" :filter-node-method="filterTreeNode" :expand-on-click-node="false" @node-click="onTreeSelected" />
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
        windowparms: { resultFieldKey: 'itemId', needRoot: false, data: [] },
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
          title: '项目名称',
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
                    click: () => this.delRow(row.value)
                  }
                }, '')]
            }
          }
        }]
      }
    }, computed: {
      countGridHeight() {
        return $(document).height() - global_selector_datagridHeightDiff
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

    }, mounted() {
      window.myvm = this
      this.loadTree()
      this.loadWindowparms()
    },

    methods: {
      collapsedSider() {
        this.isCollapsed = !this.isCollapsed
      },
       loadWindowparms() {
        const that = this
        var parmsStr = Object.toQueryString('parms')
        var parms = {}
        if (parmsStr) {
          parmsStr = decodeURIComponent(parmsStr)
          parms = eval('(' + parmsStr + ')')
          if (parms.data != undefined && parms.data.length > 0) {
            that.windowparms.data = parms.data
            that.resultGridData = parms.data
          }
          if (parms.singleSelect != undefined) {
            that.windowparms.singleSelect = parms.singleSelect
          }
          if (parms.resultFieldKey != undefined) {
            that.windowparms.resultFieldKey = parms.resultFieldKey
          }
          if (parms.needRoot != undefined) {
            that.windowparms.needRoot = parms.needRoot
          }
        }
      },
       onTreeSelected(data, treeNode, thisObj) {
        var that = this
        var attributes = data.attributes
        console.info(data)
        if (data.nodeType == 'group') {
          return false
        }
        var value = attributes[that.windowparms.resultFieldKey]
        var text = treeNode.data.title
        this.addSelect({ value: value, text: text })
      },
       filterTreeNode(value, data) {
        if (!value) return true
        return data.title.indexOf(value) !== -1
      },
       loadTree() {
        var that = this
        var treeUrl = '/workflow/security/applicationItem/getAllItemTreeJson'
        Object.toAjaxJson(treeUrl, null, null, true, null, function(res) {
          if (res.success) {
            that.treeData = res.data
            var msg = res.msg
          } else {
            FUI.Window.showMsg(res.msg)
          }
        })
      },
      // stand:选对结果区==================
       addSelect(row) {
        const that = this
        const keyId = 'value'
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
        const keyId = 'value'
        var tem = []
        $.each(that.resultGridData, function(i, item) {
          if (item[keyId] != delKeyId) {
            tem.push(item)
          }
        })
        that.resultGridData = tem
      },
       getResult() {
        return this.resultGridData
      },
       clearAll() {
        this.resultGridData = []
      }
    }

  }

  window.getResult = function() {
    return myvm.getResult()
  }
</script>
