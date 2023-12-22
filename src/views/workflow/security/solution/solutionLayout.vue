<template>
  <div class="f2bpm-page-layout">
    <el-container>
      <el-header class="f2bpm-layout-header  tc">
        <div class="header-left">
          <div class="head_title_container">
            <a
              class="nav-home"
              title="返回"
              @click="closeEdit"
            ><i class="icon icon-arrow-left-bold home-icon" /></a>
            <span
              style="font-size: 14px;font-weight: 500;cursor: pointer;"
              @click="closeEdit"
            >返回 </span> <span style="position: relative; top:-3px;padding-left: 10px;">
              <el-divider direction="vertical" />
            </span>
            <span class="home-title">{{ solutionMode.solutionTitle }}</span>
          </div>
        </div>
        <div class="navigation-container">
          <el-menu
            :default-active="activeIndex"
            class="el-menu-demo"
            mode="horizontal"
            @select="menuSelect"
          >
            <el-menu-item index="formModeDesigner"><span class="menu-item">数据建模</span> </el-menu-item>
            <el-menu-item index="formDesigner"><span class="menu-item">表单设计</span> </el-menu-item>
            <el-menu-item
              index="workflowDesinger"
              v-if="solutionMode.solutionType=='workflowForm'"
            ><span class="menu-item">流程设计</span> </el-menu-item>
            <el-menu-item index="custDataGridList"><span class="menu-item">列表设计</span> </el-menu-item>
            <el-menu-item
              index="solution_config"
              v-if="solutionMode.solutionType=='workflowForm'"
            ><span class="menu-item">设置</span> </el-menu-item>
          </el-menu>
        </div>
      </el-header>
      <el-main
        class="f2bpm-page-right"
        style="padding-left: 1px;"
      >
        <transition
          name="fade-transform"
          mode="out-in"
        >
          <router-view :key="key" />
        </transition>
      </el-main>
    </el-container>
  </div>
</template>
<script>
export default {
  name: "SolutionLayout",
  data() {
    return {
      solutionId: "",
      solutionMode: { solutionTitle: "", solutionType: "" },
      activeIndex: "formModeDesigner",
      isCollapsed: false,
    };
  },
  computed: {
    key() {
      return this.$route.path;
    },
    countGridHeight() {
      return $(document).height() - global_datagridHeightDiff;
    },
  },
  watch: {
    /*  $route() {
         this.load();
       } */
  },
  created() {
    var that = this;
    var solutionId = Object.toQueryString("solutionId") || "";
    that.solutionId = solutionId;
    var solution_activeIndex =
      localStorage.getItem("solution_activeIndex") || "";
    if (solution_activeIndex) {
      that.activeIndex = solution_activeIndex;
    }
    that.load();
  },

  methods: {
    closeEdit() {
      FUI.Window.closeEdit();
    },
    load() {
      var that = this;
      var data = Object.toAjaxJson("/workflow/security/solution/", "getModel", {
        keyId: that.solutionId,
        isdrill: true,
      });
      console.info(data);
      that.solutionMode = data;
    },
    menuSelect(name) {
      var that = this;
      localStorage.setItem("solution_activeIndex", name);
      if (name == "formModeDesigner") {
        that.formModeDesigner();
      } else if (name == "formDesigner") {
        that.solution_onlineFormDesigner();
      } else if (name == "workflowDesinger") {
        that.ngProcessDefListByWorkflowKey();
      } else if (name == "custDataGridList") {
        that.solution_custDataGridList();
      } else if (name == "solution_config") {
        that.solution_config();
      }
    },
    // 数据建模
    formModeDesigner() {
      var that = this;
      var solutionId = that.solutionMode.id;
      var formDefId = that.solutionMode.refFormDefId;
      var url =
        "/workflow/smartForm/form/solution_formModeDesigner?formAction=Edit&solutionId=" +
        solutionId +
        "&formDefId=" +
        formDefId;
      that.$router.push(url);
    },
    // 流程设计
    ngProcessDefListByWorkflowKey() {
      var that = this;
      var workflowKey = that.solutionMode.workflowKey;
      var appId = that.solutionMode.refAppId;
      var solutionId = that.solutionMode.id;
      var url =
        "/workflow/processDef/solution_processDefListByWorkflowKey?solutionId=" +
        solutionId +
        "&appId=" +
        appId +
        "&workflowKey=" +
        workflowKey;
      that.$router.push(url);
    },
    // 表单设计
    solution_onlineFormDesigner() {
      var that = this;
      var solutionId = that.solutionMode.id;
      var formKey = that.solutionMode.formKey;
      var formDefId = that.solutionMode.refFormDefId;
      var formId = that.solutionMode.formId;
      var type = "pc";
      var url =
        "/workflow/smartForm/solution_onlineFormDesigner?solutionId=" +
        solutionId +
        "&type=" +
        type +
        "&formKey=" +
        formKey +
        "&formDefId=" +
        formDefId +
        "&formId=" +
        formId;
      // FUI.Window.open("#"+url);
      that.$router.push(url);
    },
    // 列表设计
    solution_custDataGridList() {
      var that = this;
      var solutionId = that.solutionMode.id;
      var formKey = that.solutionMode.formKey;
      var formDefId = that.solutionMode.refFormDefId;
      var formId = that.solutionMode.formId;
      var type = "pc";
      var url =
        "/workflow/security/customDataGrid/solution_customDataGridList?solutionId=" +
        solutionId +
        "&formKey=" +
        formKey +
        "&formAction=Edit";
      that.$router.push(url);
    },
    // 配置设置
    solution_config() {
      var that = this;
      var solutionId = that.solutionMode.id;
      var formKey = that.solutionMode.formKey;
      var formDefId = that.solutionMode.refFormDefId;
      var formId = that.solutionMode.formId;
      var type = "pc";
      var url =
        "/workflow/security/solution/solutionConfig?solutionId=" +
        solutionId +
        "&formKey=" +
        formKey +
        "&formAction=Edit";
      that.$router.push(url);
    },
  },
};
</script>
<style>
</style>
