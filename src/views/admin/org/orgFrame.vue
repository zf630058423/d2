<template>
  <div class="f2bpm-page-layout">
    <el-container>
      <el-aside ref="sideLeft" class="f2bpm-page-left" hide-trigger collapsible :width="isCollapsed?'20px':'250px'">
        <div class="f2bpm-panel-head">
          <div v-if="!isCollapsed" class="f2bpm-left-search-div">
            <el-input v-model="treeFilterText" class="left-htead-treeFilterText-box"   size="small" clearable :placeholder="$t('enterKey')" autocomplete="off" prefix-icon="el-icon-search" />
          </div>
          <div  class="f2bpm-left-search-button-div">
            <i v-if="!isCollapsed" :title="$t('refresh')" class="icon icon-shuaxin  cur mr10 font12  " @click="loadTree()"></i>
            <i title="收起/展开" :class="rotateIcon" @click="collapsedSider" />
          </div>
        </div>

        <div v-if="!isCollapsed" class="f2bpm-page-left-content auto-window-height">
          <div class="mytree-cube-box-container">
            <span class="cur mytree-cube-box" style="width:60px" @click="showAll()"><i class="icon icon-quanbu font16"></i> 
             <span class="mytree-cube-box-title">  {{$t('all')}}</span> </span> 
            <span  class="cur mytree-cube-box" style="width:60px"  @click="importOrgExcel()"><i class="icon icon-daoru1 font16"></i>  <span class="mytree-cube-box-title">  导入</span> </span>
            <span  class="cur mytree-cube-box"  style="width:100px"  title="系统将自动根据组织的id和parentId来构建她的组织全路径编码" @click="rebuildOrgFullCode"><i class="icon icon-jihuaweihu font16"></i><span class="mytree-cube-box-title">重构路径编码</span></span>
          </div>
          <el-tree ref="mytree" node-key="id" highlight-current :default-expanded-keys="defaultExpandedKeys" :data="treeData" :expand-on-click-node="false" :filter-node-method="filterTreeNode" @node-click="onTreeSelected" />
        </div>
      </el-aside>
      <el-main class="f2bpm-page-right" style="overflow: hidden; ">
        <el-tabs v-model="activeName" class="f2bpm-page-left-content" @tab-click="handleClick">
          <el-tab-pane label="下级组织" name="orgPage">
            <iframe id="orgPage" src="" style="overflow: hidden; border: 0px;" width="100%" />
          </el-tab-pane>
          <el-tab-pane label="组织用户" name="userPage">
            <iframe id="userPage" src="" style="overflow: hidden; border: 0px;" width="100%" />
          </el-tab-pane>
          <el-tab-pane label="组织岗位" name="userPostition">
            <iframe id="userPostition" src="" style="overflow: hidden; border: 0px;" width="100%" />
          </el-tab-pane>
          <el-tab-pane label="组织领导" name="leadPage">
            <iframe id="leadPage" src="" style="overflow: hidden; border: 0px;" width="100%" />
          </el-tab-pane>
        </el-tabs>
      </el-main>
    </el-container>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        defaultExpandedKeys: [],
        hidOrgId: 'Root',
        activeName: 'orgPage',
        treeFilterText: '',
        isCollapsed: false,
        // ==data grid====
        dg: {},
        loading: false,
        treeData: []
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
    created() {
      window.myvm = this;
      var that = this;
      that.loadTree();
    },
    mounted() {
      var that = this;
      that.loadframe();
      window.autoPageHeight();
    },

    methods: {
      collapsedSider() {
        this.isCollapsed = !this.isCollapsed;
      },
      onTreeSelected(data, treeNode, thisObj) {
        var that = this;
        var orgId = treeNode.data.id;
        that.hidOrgId = orgId;
        that.hidOrgName = treeNode.data.title;
        that.loadframe();
      },
      showAll() {
        var that = this;
        that.hidOrgId = '';
        $("div[role='treeitem']").removeClass("is-current");
        that.loadframe();

      },
      loadframe() {
        var that = this;
        var code = that.activeName;
        if (code == 'userPage') {
          $('#userPage').attr('src', __webpath + '/admin/org/orgUserList/?orgId=' + that.hidOrgId);
          $('#userPage').height($(window).height() - 100);
        }
        else if (code == 'orgPage') {
          $('#orgPage').attr('src', __webpath + '/admin/org/organizationList/?parentId=' + that.hidOrgId);
          $('#orgPage').height($(window).height() - 100);
        }
        else if (code == 'leadPage') {
          var orgId = that.hidOrgId;
          $('#leadPage').attr('src', __webpath + '/workflow/security/departAssignLeader/departAssignLeaderList_byorgid?signle=1&orgId=' + orgId + '&hidOrgName=' + that.hidOrgName);
          $('#leadPage').height($(window).height() - 100);
        }
        else if (code == 'userPostition') {
          var orgId = that.hidOrgId;
          $('#userPostition').attr('src', __webpath + '/admin/position/positionList_byorgid?signle=1&orgId=' + orgId + '&hidOrgName=' + that.hidOrgName);
          $('#userPostition').height($(window).height() - 100);
        }
      },
      filterTreeNode(value, data) {
        if (!value) return true;
        return data.title.indexOf(value) !== -1;
      },
      refreshTree() {
        this.loadTree();

      },
      loadTree() {
        var that = this;
        var treeUrl = FUI.Handlers.OrgImplController + 'getOrgList';
        Object.toAjaxJson(treeUrl, null, null, true, null, function (res) {
          if (res.success) {
            that.treeData = res.data;
            var msg = res.msg;
            that.loadDefaultExpandedKeys();
          } else {
            FUI.Window.showMsg(that, res.msg);
          }
        });
      },
      loadDefaultExpandedKeys() {
        var that = this;
        that.defaultExpandedKeys = [];
        //默认展开到第几级
        var level=2;
        Object.toTreeCollection(that.treeData, 'id', that.defaultExpandedKeys, level);
      }
      , handleClick(tab) {
        var that = this;
        var code = tab.name;
        that.activeName = code;
        that.loadframe();
      }
      , rebuildOrgFullCode(tab) {
        var that = this;
        FUI.Window.confirm(null, "系统将自动根据上下级的组织编码来构建她的组织全路径编码，格式如“,a,b,c,”其中逗号为分隔符合（分隔符可在配置文件中修改），自动重构需要花费一些时间，点击“确定”执行重构，点击“取消”将关闭窗口。", "重构组织的路径编码", function () {
          Object.toAjaxJson("/admin/org/", "rebuildOrgFullCode", null, true, null, function (res) {
            if (res.success) {
              var msg = res.msg;
              FUI.Window.showMsg2(that, res.msg, null, 1);
            } else {
              FUI.Window.showMsg(that, res.msg);
            }
          });
        });
      }
      , importOrgExcel() {
        FUI.Window.openEdit('/admin/org/importOrgByExcel', '导入组织', FUI.FormAction.Edit, '', 550, 380);
      }
    }

  }
</script>