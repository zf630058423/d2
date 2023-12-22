<template>
  <div class="f2bpm-page-layout">   
    <el-container>
      <el-aside ref="sideLeft" class="f2bpm-page-left" hide-trigger collapsible :width="isCollapsed ? '20px' : '250px'" >    
        <div class="f2bpm-panel-head f2bpm-panel-head-bg" style="padding-top: 10px; padding-right: 5px">
          <i style="color: rgb(235, 100, 4)" class="fa fa-cubes fl">{{ application.applicationName }}</i>
          <i v-if="isAdmin && !design" class="fa fa-cogs fr cur" @click="goManager()"> 进入管理</i>
          <i v-if="design" class="fa fa-cogs fr cur" @mouseenter="showAddMenus($event)" >新建 </i>
          <i v-if="design" class="fa fa-arrow-left fr cur mr15" @click="goHome()" >返回</i>
        </div>
        <div class="f2bpm-page-left-content auto-window-height">        
          <el-tree 
            class="application-layout-item-tree"
            highlight-current
            :default-expanded-keys="defaultExpandedKeys"
            :data="itemTreeData"
            check-strictly
            node-key="id"
            :expand-on-click-node="false"
            @node-click="treeNodeClick"
          >
            <span slot-scope="{ node, data }" class="custom-tree-node" @mouseenter="treeNodeMouseenter(data.id)" @mouseleave="treeNodeMouseleave(data.id)">
              <span :itemBusinessType="data.attributes.itemBusinessType">
                <i :style="iconStyle(data.attributes)" :class="data.attributes.itemIcon" />
                <span class="title">{{ node.label }}</span>           
              </span>
              <span :id="'edit_' + data.id" class="tree-node-tool">
                <span
                  class="mr5"
                  type="text"
                  title="删除"
                  size="mini"
                  @click.stop="deleteNode(node, data)"
                >
                  <i class="fa fa-trash-o" />
                </span>

                <span
                  type="text"
                  size="mini"
                  title="编辑"
                  @click.stop="editNode(node, data)"
                >
                  <i class="fa fa-edit" />
                </span>
                <span
                  v-if="
                    data.attributes.itemBusinessType == 'workflowForm' ||
                    data.attributes.itemBusinessType == 'noWorkflowForm'
                  "
                  style="margin-left: 5px"
                  type="text"
                  size="mini"
                  @click.stop="editFormNode(node, data)"
                >
                  <i
                    v-if="data.attributes.itemBusinessType == 'workflowForm'"
                    title="编辑流程表单"
                    class="icon icon-liuchengguanli"
                  />
                  <i
                    v-else-if="
                      data.attributes.itemBusinessType == 'noWorkflowForm'
                    "
                    title="编辑普通表单"
                    class="icon icon-kehuliebiao"
                  />
                </span>
              </span>         
            </span>      
          </el-tree>
        </div>
      </el-aside>
      <el-main class="f2bpm-page-right">
        <iframe id="page_iframe" :src="src" width="100%" height="900" frameborder="0"/>
      </el-main>
    </el-container>
    <div v-show="menuVisible" id="treeAddMenus" class="treeRightMenu" @mouseleave="onMenuMouseleave">
      <el-menu id="menu" text-color="#000" @select="onMenuSelect">
        <el-menu-item index="addItem">
          <i class="fa fa-file-text-o" /> 新建菜单
        </el-menu-item>
        <el-divider><i class="el-icon-more" /></el-divider>
        <el-menu-item index="addItemGroup">
          <i class="fa fa-folder-o" /> 新建分组
        </el-menu-item>
      </el-menu>
    </div>
  </div>
</template>

<script>
import api from '@/Api/home/workSpace';

export default {
  data() {
    return {
      src: "",
      menuVisible: false,
      design: false,
      isAdmin: false,
      selected: "",
      openitemId: "",
      applicationId: "",
      application: {},
      defaultExpandedKeys: [],
      itemTreeData: [],
      isCollapsed: false,
      dg: {},
      loading: false,
      data: [],

      tableColumn: [],
      searchParams: {},
    };
  },
  computed: {
    iconStyle() {
      return function (data) {
        var style = "";
        if (data.iconColor) {
          style += "color:" + data.iconColor + ";";
        }
        if (data.iconSize > 0) {
          style += "font-size:" + data.iconSize + "px;";
        }
        return style;
      };
    },
    countPageHeight() {
      return $(document).height() - 60;
    },
    rotateIcon() {
      return this.isCollapsed
        ? "fa fa-angle-double-right"
        : "fa fa-angle-double-left";
    },
    positionIcon() {
      return this.isCollapsed
        ? "cursor:pointer; position: relative;left: -5px;"
        : "cursor:pointer; position: relative;left: 100px;";
    },
  },
  watch: {
    treeFilterText(val) {
      this.$refs.mytree.filter(val);
    },
  },
  created() {
    var that = this;
    window.myvm = that;
    const currUser = that.$store.state.user.author;
    that.isAdmin = decodeURI(currUser.realName).indexOf("管理员") > -1;
    var applicationId = Object.toQueryString("applicationId") || "";
    // 打开指定的菜单
    var openitemId = Object.toQueryString("openitemId") || "";
    var design = Object.toQueryString("design") || false;
    that.applicationId = applicationId;
    that.openitemId = openitemId;
    that.design = design;
    that.loadApplication();
    that.dataGridSearch();
  },
  mounted() {
    var that = this;
    window.myvm = that;
    var defaultExpandedKeys = [];
    var firstItem = null;
    if (that.itemTreeData && that.itemTreeData.length > 0) {
      $.each(that.itemTreeData, function (i, item) {
        if (
          that.openitemId == "" &&
          firstItem == null &&
          item.children &&
          item.children.length > 0
        ) {
          firstItem = item.children[0];
        }
        defaultExpandedKeys.push(item.id);
      });
      // 展开第一级
      that.defaultExpandedKeys = defaultExpandedKeys;
    }
    window.autoPageHeight();
    $("#page_iframe").attr("height", $(window).height() - 65);
    $(window).resize(function () {
      $("#page_iframe").attr("height", $(window).height() - 65);
    });
    if (that.openitemId) {
      // 找到指定的打开项
      firstItem = Object.toTreeFindItem(that.itemTreeData, that.openitemId);
      console.info(firstItem);
    }
    // 打开第一个菜单或Url中指定的菜单
    if (firstItem != null) {
      that.treeNodeClick(firstItem);
    }
  },
  methods: {
    treeNodeMouseenter(key) {
      if (this.design) {
        $("#edit_" + key).show();
      }
    },
    treeNodeMouseleave(key) {
      if (this.design) {
        $("#edit_" + key).hide();
      }
    },
    collapsedSider() {
      this.isCollapsed = !this.isCollapsed;
    },
    closeEdit() {
      FUI.Window.closeEdit();
    },
    // 刷新列表
    refreshGrid(parentGridId, parm) {
      var that = this;
      that.dataGridSearch();
    },
    dataGridReSet() {},
    dataGridSearch() {
      this.getGridData();
    },
    getGridData() {
      var that = this;
      var res = Object.toAjaxJson(
        "/workflow/security/applicationItem/",
        "getItemTreeJson",
        { applicationId: that.applicationId }
      );
      if (res.success) {
        that.itemTreeData = res.data;
      } else {
        FUI.Window.showMsg(res.msg);
      }
    },
    loadApplication() {
      var that = this;
      var res = Object.toAjaxJson(
        "/workflow/security/application/",
        "getApplicationModel",
        { keyId: that.applicationId }
      );
      that.application = res;
    },
    loadItems() {
      var that = this;
      var res = Object.toAjaxJson(
        "/workflow/security/application/",
        "getApplicationItemListByApplicationId"
      );
      if (res.success) {
        that.itemData = res.data;
      } else {
        FUI.Window.showMsg(res.msg);
      }
    },
    treeNodeClick(data, node, obj) { 
      console.log("data===:",data);   
      var that = this;
      var model = data.attributes;
      const id = data.id;
      const title = data.title;
      var url = "";
      if (model.itemBusinessType == "group") {
      } else if (model.itemBusinessType == "customDataGrid") {
        url =
          // "/workflow/security/customDataGrid/customDataGridViewSingle?code=" +
          "/workflow/security/customDataGrid/customDataGridViewSingle?code=" +
          
          model.refKey;
        that.src = __webpath + url;
      } else if (model.itemBusinessType == "appPortal") {
        url =
          "/workflow/frame/appPortal/appPortalViewSingle?portalId=" +
          model.refKey;
        that.src = __webpath + url;
      } else if (model.itemBusinessType == "outsideitem") {
        url = model.itemUrl;
        that.src = url;
      } else if (model.itemBusinessType == "insideitem") {
        url = model.itemUrl;
        that.src = __webpath + url;
      } else if (model.itemBusinessType == "startWorkflow") {
        url = __webpath + "/workflow/workflowform/index/?appId=" + model.refKey;
      }
      // 关闭-工作台-常用菜单-里面任意详细的点击事件不会新增tabs栏每一项---lll
      this.addBas(id, title, that.src, url);
    },
    // push给tas栏的仓库方法
    async addBas(id, title, functionUrl, curUrl) {    
      let url = `/workflow/security/application/applicationHome?applicationId=${this.applicationId}`;
      let params = {
        userId: id,
        menuName: title,
        menuId: this.applicationId,
        // menuUrl: curUrl
        menuUrl: url
      };
      await api.saveQuickMenuRecord(params);  //菜单点击计数
      this.$store.dispatch("app/setCurrMenuId", {
        currMenuId: id,
        currMenuTitle: title,       
        // functionUrl: window.open(functionUrl, "_blank"),
        // functionUrl: FUI.Window.open(functionUrl),
        functionUrl: functionUrl,
        currMenuParentId:this.applicationId,
      });   

      this.$store.state.app.currState.currMenuId
      console.log("this.$store.state.app.currState.currMenuId:",this.$store.state.app.currState.currMenuId,id, title, functionUrl);
      // this.$router.push(functionUrl)
    },
    deleteItem(name, itemId) {
      var that = this;
      FUI.Window.confirm("您确定要删除【" + name + "】?", null, function () {
        var res = Object.toAjaxJson(
          "/workflow/security/applicationItem/",
          "deleteItem",
          { itemId: itemId }
        );
        if (res.success) {
          that.dataGridSearch();
        } else {
          FUI.Window.showMsg(res.msg);
        }
      });
    },
    addItemGroup() {
      var that = this;
      that.eidtItem("group", "Add");
    },
    deleteNode(node, data) {
      var that = this;
      if (data.children) {
        FUI.Window.showMsg2("【" + data.title + "】存在子节点，请先删除子节点");
        return false;
      }
      that.deleteItem(data.title, data.id);
    },
    editFormNode(node, data) {
      var that = this;
      that.editWorkflowform("Edit", data.id, data.attributes.formDefId);
    },
    editNode(node, data) {
      var that = this;
      that.eidtItem("group", "Edit", data.id);
    },
    eidtItem(itemBusinessType, formAction, keyId) {
      var that = this;
      keyId = keyId || "";
      var url =
        "/workflow/security/application/applicationItemEdit?itemBusinessType=" +
        itemBusinessType +
        "&applicationId=" +
        that.applicationId;
      var title = formAction == FUI.FormAction.Add ? "新增" : "编辑";
      FUI.Window.openEdit(
        url,
        title,
        formAction,
        "grid",
        700,
        450,
        null,
        "f2bpm_sys_application_group",
        keyId,
        true
      );
    },
    applicationFormWelcome() {
      var that = this;
      keyId = keyId || "";
      var url =
        "/workflow/security/application/applicationFormWelcome?itemBusinessType=" +
        itemBusinessType +
        "&applicationId=" +
        that.applicationId;
      var title = formAction == FUI.FormAction.Add ? "新增" : "编辑";
      FUI.Window.openEdit(
        url,
        title,
        formAction,
        "grid",
        700,
        450,
        null,
        "f2bpm_sys_application_group",
        keyId
      );
    },
    addWorkflowform() {
      var that = this;
      that.eidtItem("workflowForm", "Add", null);
    },

    showAddMenus(event) {
      console.info(event);
      this.menuVisible = true;
      const menu = document.querySelector("#treeAddMenus");
      menu.style.left = event.offsetX + 140 + "px";
      menu.style.top = event.offsetY + 5 + "px";
    },
    onMenuMouseleave() {
      this.menuVisible = false;
    },
    goHome() {
      var that = this;
      var url = "/workflow/security/application/applicationList";
      that.$router.push(url);
    },
    goManager() {
      var that = this;
      var url =
        "/workflow/security/application/applicationHome?design=true&applicationId=" +
        that.applicationId;
      window.location.href = url;
    },
    onMenuSelect(key) {
      var that = this;
      if (key == "addItem") {
        that.eidtItem("", "Add", "");
        return false;
      }
      var fn = that[key];
      fn();
    },
  },

  //监听路由变化 更新左侧菜单
  beforeRouteUpdate(to,form,next){
    next()
    this.applicationId = Object.toQueryString("applicationId") || "";
    this.loadApplication();
    this.getGridData();
    console.log("路由：",this.applicationId); 
  }
};
</script>
<style>
.application-layout-item-tree .el-tree-node__content {
  height: 40px;
}

.application-layout-item-tree .tree-node-tool {
  display: none;
}

.application-layout-item-tree .icon {
  font-size: 13px;
}

.application-layout-item-tree .custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 13px;
  padding-right: 8px;
  padding-top: 10px;
  padding-bottom: 10px;
}
</style>
