<template>
  <div class="f2bpm-page-layout">
    <div class="f2bpm-panel-head">
      <div v-if="!isCollapsed" class="f2bpm-left-search-div" style="width: 70%">
        <el-input v-model="treeFilterText" class="left-htead-treeFilterText-box" size="mini" clearable :placeholder="$t('enterKey')" autocomplete="off" prefix-icon="el-icon-search" />
      </div>
      <div style=" float: right;line-height:35px;padding-right: 5px;">
        <i v-if="!isCollapsed" :title="$t('refresh')" class="fa fa-refresh  cur mr10 font12 " @click="loadTree()" />
      </div>
    </div>
    <div v-if="!isCollapsed" class="f2bpm-page-left-content  auto-window-height   mt4" style="height:370px;overflow-y: auto;">
      <el-tree
        :key="treeKey"
        ref="mytree"
        :data="treeData"
        :filter-node-method="filterTreeNode"
        :expand-on-click-node="false"
        node-key="id"
        show-checkbox
        :default-checked-keys="checkIds"
:check-strictly="true" default-expand-all
        @check-change="onTreeCheckChange"
      />
    </div>
    <div class="dialogfooter2">
      <el-button size="mini" type="primary" @click="submitForm()"><i class="fa fa-save" />保存
      </el-button>
      <el-button id="btn_cancel" size="mini" @click="closeEdit"><i class="fa fa-minus-circle" />取消
      </el-button>
    </div>
  </div>
</template>
<script>
  export default { data() {
      return {
        treeKey: '001',
        isCheckeding: false,
        roleId: '',
        rresType: '',
        roleName: '',
        treeFilterText: '',
        isCollapsed: false,
        checkIds: [],
        treeData: [],
        // id,parentId
        treeIdList: []
      }
    }, computed: {},
    watch: {
      treeFilterText(val) {
        this.$refs.mytree.filter(val)
      }
    },
     created() {
      var that = this

      window.myvm = that
      that.formAction = formAction
      var roleId = Object.toQueryString('roleId') || ''
      var rresType = Object.toQueryString('rresType') || ''
      var roleName = Object.toQueryString('roleName') || ''
      that.roleId = roleId
      that.rresType = rresType
      that.roleName = decodeURI(roleName)
      var url = FUI.Handlers.AdminHandler + 'resource/'
      var data = Object.toAjaxJson(url, 'getResourceIdsByRoleId', { roleId: roleId, rresType: rresType })
      that.checkIds = data
      that.loadTree()
      that.initailIdList(that.treeData[0])
    },
     mounted() {
      window.myvm = this
    },
    methods: {
      closeEdit() {
        FUI.Window.closeEdit()
      },
      collapsedSider() {
        this.isCollapsed = !this.isCollapsed
      },
       onTreeCheckChange(data, checked, indeterminate) {
        var that = this
        // 传递给 data属性的数组中该节点所对应的对象、checked节点本身是否被选中、indeterminate 节点的子树中是否有被选中的节点
        var isNode = data.children != undefined && data.children.length > 0
        var isLeaf = !isNode
        var checkIdArr = []
        if (isNode && checked) {
          // ==============节点选中时触发============
          // 向上收集ID不包括自己
          that.collectParentIds(data.id, checkIdArr)
          // 向下收集子级包括自己
          that.findchildren(data, checkIdArr)
        } else if (isNode && checked == false) {
          // 向下收集子级包括自己
          that.findchildren(data, checkIdArr)
        } else if (isLeaf && data.parentId) {
          checkIdArr.push(data.id)
          if (checked) {
            // 向上收集ID不包括自己
            that.collectParentIds(data.id, checkIdArr)
          }
        }
        if (checked) {
          $.each(checkIdArr, function(index, checkId) {
            var isExist = false
            if ($.inArray(checkId, that.checkIds) == -1) {
              that.checkIds.push(checkId)
            }
          })
        } else {
          var newCheckIds = []
          $.each(that.checkIds, function(index, id) {
            if ($.inArray(id, checkIdArr) == -1) {
              newCheckIds.push(id)
            }
          })
          that.checkIds = newCheckIds
        }
        that.treeKey = Object.toGuid()
      },
      // 触发选中或取消子级包括自己
       findchildren(current, arr) {
        var that = this
        // this.$refs.mytree.setChecked(current.id, checked, checked);
        arr.push(current.id)
        const children = current.children
        if (children && children.length > 0) {
          children.forEach(a => {
            this.findchildren(a, arr)
          })
        }
      },
      // 向上收集ID不包括自己
       collectParentIds(currentId, arr) {
        var that = this
        $.each(that.treeIdList, function(i, item) {
          if (item.id == currentId && item.parentId && item.parentId != 'Root' && item.parentId != 'root' && currentId != 'Root' && currentId != 'root') {
            arr.push(item.parentId)
            that.collectParentIds(item.parentId, arr)
          }
        })
        return arr
      },
       initailIdList(current) {
        // 初始化收集ID，PID
        var that = this
        that.treeIdList.push({ id: current.id, parentId: current.parentId })
        const children = current.children
        if (children && children.length > 0) {
          children.forEach(a => {
            this.initailIdList(a)
          })
        }
      },
       filterTreeNode(value, data) {
        if (!value) return true
        return data.title.indexOf(value) !== -1
      },
       loadTree() {
        var that = this
        var treeUrl = FUI.Handlers.AdminHandler + 'resource/allResourceTreeJson'
        var res = Object.toAjaxJson(treeUrl)
        if (res.success) {
          that.treeData = res.data
          var msg = res.msg
        } else {
          FUI.Window.showMsg(that, res.msg)
        }
      },
       submitForm() {
        var that = this
        var selectJson = that.getResult()
        var resoruceIds = []
        $.each(selectJson, function(i, nodeId) {
          if (nodeId != 'Root' && nodeId != 'root') {
            resoruceIds.push(nodeId)
          }
        })
        var parm = {
          'roleId': that.roleId,
          'rresType': that.rresType,
          'roleName': that.roleName,
          'resoruceIds': resoruceIds.toString()
        }
        var data = Object.toAjaxJson(FUI.Handlers.AdminHandler, 'role/saveRoleResource', parm)
        FUI.Window.showMsg(data.msg, '操作提示', 1, function() {
          if (data.success) {
            FUI.Window.refreshParentGrid()
            FUI.Window.closeEdit()
          }
        })
      },

       getResult() {
        var data = this.$refs.mytree.getCheckedKeys()
        var halfdata = this.$refs.mytree.getHalfCheckedKeys()
        if (halfdata && halfdata.length > 0) {
          $.each(halfdata, function(i, item) {
            data.push(item)
          })
        }
        // 关选中的值
        return data
      }
    }

  }
</script>
