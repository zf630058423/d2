<template>
  <div class="f2bpm-page-layout">
    <el-container>
      <el-aside ref="sideLeft" class="f2bpm-page-left" hide-trigger collapsible :width="isCollapsed?'20px':'295px'">
        <div class="f2bpm-panel-head">
          <div v-if="!isCollapsed" class="f2bpm-left-search-div">
            <el-input v-model="treeFilterText" size="mini" style="border: 0px;" clearable :placeholder="$t('enterKey')" autocomplete="off" prefix-icon="el-icon-search" />
          </div>
          <div style=" float: right;line-height:35px;padding-right: 5px;">
            <i v-if="!isCollapsed" :title="$t('refresh')" class="fa fa-refresh  cur mr10 font12 " @click="loadTree" />
          </div>
        </div>
        <div v-if="!isCollapsed" class="f2bpm-page-left-content auto-window-height">
          <span class="fa fa-home cur ml10 font12 " @click="showAll()">{{$t('all')}}</span>
          <el-tree ref="mytree" :data="treeData" :filter-node-method="filterTreeNode" :expand-on-click-node="false" node-key="id" show-checkbox default-expand-all @node-click="onTreeSelected" />
        </div>
        <div class="dialogfooter">
          <a href="javascript:void(0);" role="button" class="btn btn-primary btn-sm mr2" @click="save()"><i class="fa fa-save" />确定</a>
          <a href="javascript:void(0);" role="button" class="btn btn-default btn-sm" @click="closeEdit"><i class="fa fa-minus-circle" />取消</a>
        </div>
      </el-aside>
    </el-container>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        wid: '',
        attrName: '',
        currCategoryCode: '',
        // ======stand:标准区=============
        treeFilterText: '',
        isCollapsed: false,
        // ==data grid====
        dg: {},
        loading: false,
        treeData: [],
        tableData: []
      };
    }, computed: {
      rotateIcon() {
        return this.isCollapsed ? 'icon icon-arrow-right-bold cur' : 'icon icon-arrow-left-bold cur';
      }
    },
    watch: {
      treeFilterText(val) {
        this.$refs.mytree.filter(val);
      }
    },
    mounted() {
      var that = this;
      this.$refs.mytree.setCheckedKeys([that.currCategoryCode]);
      window.autoPageHeight();
    },
    created: function () {
      var obj;
      var wid;
      var value;
      obj = parent.window.currentWindowTargetObjectValue;
      var title = obj.title;
      value = obj.value;
      this.currCategoryCode = value;
      this.attrName = obj.name;
      var parm = null;
      if (obj.otherParm) parm = JSON.parse(obj.otherParm);
      var wid = parm.wid;
      this.wid = wid;
      this.content = value;
      this.loadTree();
    },
    methods: {
      closeEdit() {
        FUI.Window.closeEditAll();
      },
      collapsedSider() {
        this.isCollapsed = !this.isCollapsed;
      },
      onTreeSelected(data, treeNode, thisObj) {
        var that = this;
        var value = treeNode.data.id;
        var text = treeNode.data.title;
        that.currCategoryCode = value;
        this.$refs.mytree.setCheckedKeys([that.currCategoryCode]);
      },
      filterTreeNode(value, data) {
        if (!value) return true;
        return data.title.indexOf(value) !== -1;
      },
      loadTree() {
        var that = this;
        var treeUrl = FUI.Handlers.CategoryHandler + '?groupKey=WorkflowGroup';
        Object.toAjaxJson(treeUrl, null, null, true, null, function (res) {
          if (res.success) {
            that.treeData = res.data;
            var msg = res.msg;
          } else {
            FUI.Window.showMsg(that, res.msg);
          }
        });
      },
      save() {
        var that = this;
        var arr = this.$refs.mytree.getCheckedKeys();
        if (arr.length == 0) {
          FUI.Window.showMsg(that, '请选择分类！');
          return false;
        }
        if (arr.length > 1) {
          FUI.Window.showMsg(that, '只能选择一个分类！');
          return false;
        }
        that.currCategoryCode = arr[0];
        parent.setTargetValue(that.attrName, that.currCategoryCode);
        FUI.Window.closeEditAll();
      }
    }
  }
</script>