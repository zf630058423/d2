<template>
  <div class="f2bpm-page-layout">
    <div class="f2bpm-panel-head">
      <div v-if="!isCollapsed" class="f2bpm-left-search-div" style="width: 90%">
        <el-input v-model="treeFilterText" class="left-htead-treeFilterText-box" size="small" clearable :placeholder="$t('enterKey')" autocomplete="off" prefix-icon="el-icon-search" />
      </div>
      <div style=" float: right;line-height:35px;padding-right: 5px;">
        <i v-if="!isCollapsed" :title="$t('refresh')" class="fa fa-refresh  cur mr10 font12 " @click="loadTree()" />
      </div>
    </div>
    <div v-if="!isCollapsed" class="f2bpm-page-left-content  auto-window-height   mt4" style="height:370px;overflow-y: auto;">
      <el-tree ref="mytree" :data="treeData" :filter-node-method="filterTreeNode" :expand-on-click-node="false" node-key="id" :show-checkbox="false" :check-strictly="true" default-expand-all />
    </div>
    <div class="dialogfooter2">
      <el-button id="btn_cancel" size="mini" @click="closeEdit"><i class="fa fa-minus-circle" />关闭
      </el-button>
    </div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        tenantId: '',
        treeFilterText: '',
        isCollapsed: false,
        treeData: [],
      };
    }, computed: {},
    watch: {
      treeFilterText(val) {
        this.$refs.mytree.filter(val);
      }
    },
    created() {
      var that = this;
      window.myvm = that;
      that.formAction = formAction;
      var tenantId = Object.toQueryString('tenantId') || '';
      that.tenantId = tenantId;
      that.loadTree();
    },
    mounted() {
      window.myvm = this;
      window.autoPageHeight();
    },
    methods: {
      closeEdit() {
        FUI.Window.closeEdit();
      },
      collapsedSider() {
        this.isCollapsed = !this.isCollapsed;
      },
      filterTreeNode(value, data) {
        if (!value) return true;
        return data.title.indexOf(value) !== -1;
      },
      loadTree() {
        var that = this;
        var treeUrl = FUI.Handlers.AdminHandler + 'resource/resourceTreeJsonByTenantId?tenantId=' + that.tenantId;
        var res = Object.toAjaxJson(treeUrl);
        if (res.success) {
          that.treeData = res.data;
          var msg = res.msg;
        } else {
          FUI.Window.showMsg(that, res.msg);
        }
      }
    }
  }
</script>