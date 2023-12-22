<template>
  <div
    id="app"
    class="workdesk-container auto-window-height-select"
  >
    <div>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-card class="box-card mt10">
            <div
              class="task-wrapper"
              onclick="FUI.Window.openTopTab(__webpath+ '/workflow/workflowBusiness/access_todoList','待办事项','fa fa-pencil','wf_TodoList')"
            >
              <div class="task-item-box">
                <div class="task-todo-image-wrapper">
                  <div class="task-todo-image">
                    <i class="icon icon-Interface-61" />
                  </div>
                </div>
                <div class="task-todo-count">
                  <div class="task-todo-name">{{$t('workstation.pendingTasks')}} </div>
                  <div
                    class="task-todo-number"
                    v-html="numData.TaskTodoTotal"
                  />
                </div>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="16">
          <el-card class="box-card mt10">
            <div class="task-wrapper">
              <el-row>
                <el-col
                  :span="4"
                  class="pl10 pr5"
                >
                  <div
                    style="float: left"
                    class="cur"
                    onclick="FUI.Window.openTopTab(__webpath+ '/workflow/workflowBusiness/access_startWorkflowList','发起流程','fa fa-pencil','wf_DoneList')"
                  >
                    <div class="task-item-box">
                      <div class="task-icon">
                        <i class="icon icon-paperplane-fill" />
                      </div>
                      <div class="task-name"><span>{{$t('workstation.startProcess')}} </span></div>
                    </div>
                  </div>
                </el-col>
                <el-col
                  :span="4"
                  class="pl10 pr5"
                >
                  <div
                    style="float: left"
                    class="cur"
                    onclick="FUI.Window.openTopTab(__webpath+ '/workflow/workflowBusiness/access_doneList','我发起的','fa fa-pencil','wf_DoneList')"
                  >
                    <div class="task-item-box">
                      <div class="task-icon">
                        <i class="icon icon-Files-66" />
                      </div>
                      <div class="task-name"><span>{{$t('workstation.myStarted')}}</span></div>
                    </div>
                  </div>
                </el-col>
                <el-col
                  :span="4"
                  class="pl10 pr5"
                >
                  <div
                    style="float: left"
                    class="cur"
                    onclick="FUI.Window.openTopTab(__webpath+ '/workflow/workflowBusiness/access_doneList','已办事项','fa fa-pencil','wf_DoneList')"
                  >
                    <div class="task-item-box">
                      <div class="task-icon">
                        <i class="icon icon-check-item-filling" />
                      </div>
                      <div class="task-name"> <span>{{$t('workstation.hadDone')}} </span></div>
                    </div>
                  </div>
                </el-col>
                <el-col
                  :span="4"
                  class="pl10 pr5"
                >
                  <div
                    style="float: left"
                    class="cur"
                    onclick="FUI.Window.openTopTab(__webpath+ '/workflow/workflowBusiness/access_todoCirculatedList','待阅事项','fa fa-pencil','wf_TodoCirculatedList')"
                  >
                    <div class="task-item-box">
                      <div class="task-icon">
                        <i class="icon icon-a-Calendar3" />
                      </div>
                      <div class="task-name"><span>{{$t('workstation.circulatedTodo')}} </span></div>
                    </div>
                  </div>
                </el-col>
                <el-col
                  :span="4"
                  class="pl10 pr5"
                >
                  <div
                    style="float: left"
                    class="cur"
                    onclick="FUI.Window.openTopTab(__webpath+ '/workflow/workflowBusiness/access_doneCirculatedList','已阅事项','fa fa-pencil','wf_DoneCirculatedList')"
                  >
                    <div class="task-item-box">
                      <div class="task-icon">
                        <i class="icon icon-a-Calendar5" />
                      </div>
                      <div class="task-name"><span>{{$t('workstation.circulatedDone')}} </span></div>
                    </div>
                  </div>
                </el-col>
                <el-col
                  :span="4"
                  class="pl10 pr5"
                >
                  <div
                    style="float: left"
                    class="cur"
                    onclick="FUI.Window.openTopTab(__webpath+ '/workflow/workflowBusiness/access_draftList','草稿箱','fa fa-pencil','wf_DraftList')"
                  >
                    <div class="task-item-box">
                      <div class="task-icon">
                        <i class="icon icon-work-filling" />
                      </div>
                      <div class="task-name"><span> {{$t('workstation.draftBox')}} </span></div>
                    </div>
                  </div>

                </el-col>
              </el-row>
            </div>

          </el-card>
        </el-col>
      </el-row>
    </div>
    <div class="mt20">
      <el-row :gutter="20">
        <el-col :span="14">
          <el-card class="box-card">
            <div
              slot="header"
              class="clearfix"
            >
              <span class="section-title">{{$t('workstation.toDoThisMonth')}}</span>
              <el-button
                style="float: right; padding: 3px 0"
                type="text"
                @click="getChartBar"
              ><i class="fa fa-refresh" /></el-button>
            </div>
            <div style="height: 280px">
              <div
                class="chart-bar"
                ref="daiban"
              ></div>
            </div>
          </el-card>
        </el-col>

        <el-col :span="10">
          <el-card class="box-card">
            <div
              slot="header"
              class="clearfix"
            >
              <span class="section-title">{{$t('workstation.myWarning')}} </span>
              <el-button
                style="float: right; padding: 3px 0"
                type="text"
                @click="loadTaskExpireTimeReport"
              ><i class="fa fa-refresh" /></el-button>
            </div>
            <div
              class="chart-pie"
              ref="warning"
            ></div>
          </el-card>
        </el-col>
      </el-row>
    </div>
    <div class="mt20">
      <el-row :gutter="20">
        <el-col :span="14">
          <el-card class="box-card">
            <div
              slot="header"
              class="clearfix"
            >
              <span class="section-title">{{$t('workstation.generalApplication')}}</span>
              <el-button
                style="float: right; padding: 3px 0"
                type="text"
                @click="loadApplicationData"
              ><i class="fa fa-refresh" /></el-button>
            </div>
            <div
              id="persionApplicationList"
              class="persion-applicationList"
              style="height: 140px;"
            >
              <div
                v-for="item in applicationData"
                class="persion-applicationbox"
                :title="item.remarks"
                @click="openApplication(item)"
              >
                <div>
                  <span
                    class="application-item"
                    :style="appBoxStyle(item)"
                  >
                    <span
                      :style="'font-size:'+item.fontSize+'px;'"
                      :class="item.icon"
                    />
                  </span>
                </div>
                <div class="persion-applicationboxtitle"> {{ item.applicationName }} </div>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="10">
          <el-card class="box-card">
            <div
              slot="header"
              class="clearfix"
            >
              <span class="section-title">{{$t('workstation.quickEntry')}} </span>
              <el-button
                style="float: right; padding: 3px 0"
                type="text"
                @click="loadFastChannelList"
              ><i class="fa fa-refresh" /></el-button>
            </div>
            <div style="height:140px">
              <div id="fastChannelList">
                <div
                  v-for="item in fastChannelData"
                  class="link-box  link-text-box   rowlink"
                  :tip="item.description"
                  :articleId="item.articleId"
                  :functionID="item.functionID"
                  @click="onFastChannelClick(item)"
                >
                  <span :style="'color:'+item.color"" :class="'link-inner-text-icon '
                    +item.icon"
                  />
                  <span class="link-inner-title">{{ item.articleTitle }}</span>
                </div>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <div class="mt20">
      <el-row :gutter="10">
        <el-col :span="16">
          <el-card
            class="box-card todoList"
            style="height:430px;"
          >
            <el-tabs
              value="todoList"
              @tab-click="tabsClick"
            >
              <el-tab-pane
                :label="$t('workstation.pending')"
                name="todoList"
              >
                <div
                  id="todoList"
                  style="min-height: 200px"
                />
              </el-tab-pane>
              <el-tab-pane
                :label="$t('workstation.circulate')"
                name="todoCirculatedList"
              >
                <div
                  id="todoCirculatedList"
                  style="min-height: 200px"
                />
              </el-tab-pane>
            </el-tabs>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card
            class="box-card"
            style="height:430px;"
          >
            <div
              slot="header"
              class="clearfix"
            >
              <span class="section-title">{{$t('workstation.systemMsg')}} </span>
              <el-button
                style="float: right; padding: 3px 0"
                type="text"
                @click="loadMessageList"
              ><i class="fa fa-refresh" /></el-button>
            </div>
            <div>
              <div id="messageList" />
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
    <div style="height: 20px" />
  </div>
</template>

<script>
import desktop from "@/resources/f2bpmUI/desktopIndex.js";
import bar from "@/config/echarts/bar";
import pie from "@/config/echarts/pie";
export default {
  name: "Desktop2",
  data() {
    return {
      language: "",
      fastChannelData: [],
      applicationData: [],
      numData: {
        UnReadTaskTotal: 0,
        TaskTodoTotal: 0,
        TaskDoneTotal: 0,
        TaskCirculatedTodoTotal: 0,
        TaskCirculatedDoneTotal: 0,
        DraftTotal: 0,
      },
      articleData: {},
      data: {},
    };
  },
  computed: {
    appBoxStyle() {
      return function (data) {
        var style =
          "background-image: linear-gradient(" +
          data.color +
          "," +
          data.color2 +
          " 95%);";
        if (data.width > 0) {
          style += "width:" + data.width + "px;";
        }
        if (data.height > 0) {
          style += "height:" + data.height + "px;";
        }
        return style;
      };
    },
  },
  mounted() {
    var that = this;
    window.autoPageHeight();
    that.getChartBar();
    that.loadTaskExpireTimeReport();
    that.loadTaskNumCount();
    that.loadFastChannelList();
    that.loadApplicationData();
    that.loadToDoList();
    that.loadMessageList();
    that.loadMyMenus();
  },
  created() {
    var that = this;
    var language = that.$store.state.app.language;
    that.language = language;
    // 关闭左侧导航
    that.handleClickOutside();
  },
  methods: {
    //加载当前登录人的所有菜单资源
    loadMyMenus() {
      let that = this;
      let f2bpmMemus = localStorage.getItem("f2bpmMemus");
      if (!f2bpmMemus) {
        const resData = Object.toAjaxJson("/home/", "getLeftMemus", {
          //menuId: that.rootMenuId// 'wf_PersonalTodoList',// syssysroot
          menuId: "Root",
        });
        if (resData.success) {
          that.myMenus = resData.leftMenu;
          that.$store.dispatch("user/setMenus", that.myMenus);
          f2bpmMemus = JSON.stringify(that.myMenus);
          localStorage.setItem("f2bpmMemus", f2bpmMemus);
        }
      } else {
        let myAllMenus = eval("(" + f2bpmMemus + ")");
        that.myMenus = myAllMenus;
        that.$store.dispatch("user/setMenus", myAllMenus);
      }
    },
    loadApplicationData() {
      var that = this;
      Object.toAjaxJson(
        "/workflow/security/application/",
        "getPersonalApplicationList",
        null,
        true,
        null,
        function (res) {
          if (res.success) {
            that.applicationData = res.data;
          } else {
            console.info(res.msg);
          }
        }
      );
    },
    handleClickOutside() {
      this.$store.dispatch("app/closeSideBar", {
        withoutAnimation: false,
      });
    },
    getChartBar() {
      let myChart = echarts.init(this.$refs.daiban);
      let options = JSON.parse(JSON.stringify(bar));
      const ajaxUrl = FUI.Handlers.WorkflowMonitorHandler;
      Object.toAjaxJson(
        ajaxUrl,
        "getEveryDayDoneNumOfMonthReportByUserId",
        null,
        true,
        null,
        function (res) {
          if (res.success) {
            options.xAxis.data = res.data.names;
            options.series[0].data = res.data.values;
            myChart.setOption(options, true);
          }
        }
      );
    },
    getChartPie() {
      var that = this;
      let myChart = echarts.init(this.$refs.warning);
      let options = pie;
      let seriesData = [];
      const obj = {
        WillbeTimeOutCount: that.$t("workstation.willbeTimeOutCount"),
        WeekWillbeTimeOutCount: that.$t("workstation.weekWillbeTimeOutCount"),
        TimeOutTotalCount: that.$t("workstation.timeOutTotalCount"),
      };
      const ajaxUrl = FUI.Handlers.WorkflowMonitorHandler;
      Object.toAjaxJson(
        ajaxUrl,
        "taskExpireTimeReport",
        null,
        true,
        null,
        function (jsonData) {
          console.info(jsonData);
          for (let key in jsonData) {
            seriesData.push({
              value: jsonData[key],
              name: obj[key],
            });
          }
          options.series[0].data = seriesData;
          myChart.setOption(options, true);
          myChart.dispatchAction({ type: "highlight", dataIndex: 0 }); // dataIndex属性为data传入的索引值
          myChart.on("mouseover", (e) => {
            if (e.dataIndex !== 1) {
              // 当鼠标移除的时候 使默认的索引值去除默认选中
              myChart.dispatchAction({ type: "downplay", dataIndex: 0 });
            }
          });
        }
      );
    },

    loadTaskNumCount() {
      var that = this;
      // 任务数量
      Object.toAjaxJson(
        FUI.Handlers.WorkflowMonitorHandler,
        "getTodoCount",
        null,
        true,
        null,
        function (res) {
          that.numData.TaskTodoTotal = res.data;
        }
      );
    },
    loadFastChannelList() {
      var that = this;
      var total = 0;
      var pageCount = 0;
      var pageIndex = 1;
      var pageSize = 999;
      var sort = "OrderNo asc,CreatedTime";
      var order = "desc";
      var functionID = "FastChannel";
      var infoType = "link";
      Object.toAjaxJson(
        "/workflow/security/article/",
        "loadPersonalArticleListJsonByPage/?infoType=" +
          infoType +
          "&publicAuthorizeType=" +
          functionID +
          "&defaultWhere=" +
          "FunctionID='" +
          functionID +
          "' s_and IsAudited=2 ",
        { page: pageIndex, rows: pageSize, sort: sort, order: order },
        true,
        null,
        function (res) {
          that.fastChannelData = res.rows;
          console.info(res.rows);
        }
      );
    },
    refreshTodoList() {
      desktop.loadToDoList();
      desktop.loadCirculatedList();
    },
    loadToDoList() {
      desktop.loadToDoList();
    },
    loadCirculatedList() {
      desktop.loadCirculatedList();
    },
    loadTaskExpireTimeReport() {
      this.getChartPie();
    },
    loadMessageList() {
      desktop.loadMessageList();
    },
    onFastChannelClick(item) {
      var that = this;
      var refEntityId = item.refEntityId;
      var linkType = item.linkType;
      if (refEntityId && linkType == "startWorkflow") {
        var url =
          __webpath + "/workflow/workflowform/index/?appId=" + refEntityId;
        FUI.Window.open(url);
      } else if (linkType == "insidelink") {
        var url = item.linkUrl;
        that.$router.push(url);
      } else if (linkType == "outsidelink") {
        var url = item.linkUrl;
        FUI.Window.open(url);
      } else if (refEntityId && linkType == "applicationLink") {
        var url = item.linkUrl;
        var model = Object.toAjaxJson(
          "/workflow/security/applicationLink/",
          "getModel",
          { keyId: refEntityId }
        );
        if (model && model.refApplicationId) {
          var applicationId = model.refApplicationId;
          var url =
            "/workflow/security/application/applicationHome?openlinkId=" +
            refEntityId +
            "&applicationId=" +
            applicationId;
          that.$router.push(url);
        }
      }
    },
    tabsClick(tab) {
      var that = this;
      if (tab.name == "loadToDoList") {
        that.loadToDoList();
      } else if (tab.name == "todoCirculatedList") {
        that.loadCirculatedList();
      }
    },
    openApplication(item) {
      var that = this;
      var applicationId = item.applicationId;
      var applicationName = item.applicationName;
      var url =
        "/workflow/security/application/applicationHome?applicationId=" +
        applicationId;
      that.$router.push(url);
    },
  },
};
</script>
<style lang="scss" scoped>
@import "~@/resources/css/desktop.css";
</style>