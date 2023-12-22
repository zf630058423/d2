<template>
  <div id="workSpace" class="workSpace-container" style="height: 100%">
    <div class="action-card">
      <div class="action-title"><span>Hi, <span v-html="currentRealName"></span>{{ hoursTips }}！</span></div>
      <div class="click-card" style="justify-content: flex-start;">
        <div
          class="card"
          style="margin-right: 20px;min-height: 125px;"
          @click="$router.push('/homeNew')"
        >
          <img src="@/resources/images/desktop/kehudengji.png">
          <div>
            <div class="txt">进入DRP</div>
          </div>
        </div>
        <div
          class="card"
          onclick="FUI.Window.openTopTab(__webpath+ '/workflow/workflowBusiness/startWorkflowList','发起流程','fa fa-pencil','wf_DoneList')"
        >
          <img src="@/resources/images/desktop/faqiliucheng.png">
          <div>
            <div class="txt">发起流程</div>
            <div class="amount">{{ numData.TaskTodoTotal }}</div>
          </div>
        </div>
      </div>
    </div>
    <el-card style="margin-top: 20px;" class="workSpace-card pb10" shadow="never">
      <div slot="header" class="clearfix" onclick="FUI.Window.openTopTab(__webpath+ '/workflow/workflowBusiness/todoList','待办事项','fa fa-pencil','wf_TodoList')">
        <div class="workSpace-card-header">
          <span>
            <span class="card-header-title">待办事项</span>
            <el-badge
              :value="numData.TaskTodoTotal"
              :max="999"
              style="margin-left: 5px"
            >
            </el-badge>
          </span>

          <i class="el-icon-right" style="cursor: pointer;" />
        </div>

      </div>
      <div
        v-for="(item,index) in row"
        :key="index"
        class="workSpace-container-banner"
        @click="openWorkflowfromView(item.appId, 2, item.workflowInstanceId, item.taskId, item.workflowTitle)"
      >
        <div class="image">
          <div class="task-image-5"></div>
        </div>
        <div class="text">
          <div class="text-txt" style="font-weight: bold;font-size: 16px;">{{ item.workflowTitle }}</div>
          <div class="text-txt" style="font-size: 14px;">{{ item.creatorRealName }}</div>
          <div class="text-txt" style="font-size: 14px;">{{ item.createdTime }}</div>
        </div>
      </div>
      <!-- <div class="box">
        <div
          class="box-item"
          onclick="FUI.Window.openTopTab(__webpath+ '/workflow/workflowBusiness/startWorkflowList','发起流程','fa fa-pencil','wf_DoneList')"
        >
          <div style="padding-top: 30px">
            <div class="task-image-1" style="width: 100px; height: 100px"></div>
          </div>
          <div style="font-size: 24px; padding-top: 10px">
            <span>发起流程 </span>
          </div>
        </div>
        <div
          class="box-item"
          onclick="FUI.Window.openTopTab(__webpath+ '/workflow/workflowBusiness/todoList','待办事项','fa fa-pencil','wf_TodoList')"
        >
          <div style="padding-top: 30px">
            <div class="task-image-2" style="width: 100px; height: 100px"></div>
          </div>
          <div class="task-name">
            <el-badge :value="numData.TaskTodoTotal" :max="999" class="item">
              <span style="padding-right: 10px; font-size: 24px"
                >待我审批
              </span>
            </el-badge>
          </div>
        </div>
        <div
          class="box-item"
          onclick="FUI.Window.openTopTab(__webpath+ '/workflow/workflowBusiness/todoCirculatedList','待阅事项','fa fa-pencil','wf_TodoCirculatedList')"
        >
          <div style="padding-top: 30px">
            <div class="task-image-3" style="width: 100px; height: 100px"></div>
          </div>
          <div class="task-name">
            <el-badge
              :value="numData.TaskStayReadTotal"
              :max="999"
              class="item"
            >
              <span style="padding-right: 10px; font-size: 24px"
                >待阅流程
              </span>
            </el-badge>
          </div>
        </div>
      </div>
      <div class="box">
        <div
          class="box-item"
          onclick="FUI.Window.openTopTab(__webpath+ '/workflow/workflowBusiness/myWorkItem','我发起的','fa fa-pencil','wf_MyWorkItem')"
        >
          <div style="padding-top: 30px">
            <div class="task-image-4" style="width: 100px; height: 100px"></div>
          </div>
          <div style="font-size: 24px; padding-top: 10px">
            <span>我发起的 </span>
          </div>
        </div>
        <div
          class="box-item"
          onclick="FUI.Window.openTopTab(__webpath+ '/workflow/workflowBusiness/doneList','已办事项','fa fa-pencil','wf_DoneList')"
        >
          <div style="padding-top: 30px">
            <div class="task-image-5" style="width: 100px; height: 100px"></div>
          </div>
          <div style="font-size: 24px; padding-top: 10px">
            <span>我处理的 </span>
          </div>
        </div>
        <div
          class="box-item"
          onclick="FUI.Window.openTopTab(__webpath+ '/workflow/workflowBusiness/draftList','草稿箱','fa fa-pencil','wf_DraftList')"
        >
          <div style="padding-top: 30px">
            <div
              class="task-image-12"
              style="width: 100px; height: 100px"
            ></div>
          </div>
          <div class="task-name">
            <el-badge :value="numData.TaskDraftTotal" :max="999" class="item">
              <span style="font-size: 24px; padding-top: 10px">待提交</span>
            </el-badge>
          </div>
        </div>
      </div> -->
    </el-card>
    <el-row :gutter="20" style="margin-bottom: 0">
      <el-col :span="24">
        <el-card class="workSpace-card pb10" shadow="never" style="margin-bottom: 20px" body-style="min-height:100px">
          <div slot="header" class="clearfix">
            <span class="card-header-title">常用菜单</span>
            <!--<span class="el-icon-refresh" style="float: right;font-size: 25px;color: #5b9dff" @click="loadFastChannelList"></span>-->
            <!--<el-button style="float: right; padding: 3px 0;color: #C0C4CC" type="text">更多<span class="el-icon-arrow-right" style="color: #c6c6c6"></span></el-button>-->
          </div>
          <div id="persionApplicationList" class="workSpace-persion-applicationList">
            <el-row>
              <el-col
                v-for="(item, index) in applicationData"
                :key="index"
                :span="2"
                class="pl10 pr5 workSpace-persion-applicationbox"
                :title="item.remarks"
              >
                <div @click="openApplication(item)">
                  <div class="application-item" :style="appBoxStyle(item)">
                    <span :style="'font-size:' + item.fontSize + 'px;'" :class="item.icon" />
                  </div>
                  <div class="workSpace-persion-applicationboxtitle">
                    {{ item.applicationName }}
                  </div>
                </div>
              </el-col>
            </el-row>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { mapGetters } from 'vuex';
export default {
  name: 'WorkSpaceIndex',
  components: {},
  data() {
    return {
      currentRealName: '',
      getCurrent: 0,
      fastChannelData: [],
      applicationData: [],
      getHeight: null,
      // todoCirculatedTotal: 0,
      showBtn: false,
      numData: {
        TaskTodoTotal: 0, // 待办
        TaskApprovalTotal: 0, // 发起未完成
        TaskStayReadTotal: 0, // 待阅
        TaskDraftTotal: 0 // 草稿
      },
      searchParams: {
        WorkflowTitle: '',
        AppName: '',
        AppCode: '',
        AppAlias: '',
        AppId: '',
        InCategoryCode: '',
        Urgency: '',
        CurrentActivityName: '',
        SheetId: '',
        CreatorRealName: '',
        WorkflowInstanceState: '',
        StartTime: '',
        EndTime: '',
        FormDatakey: '',

        searchtext: '',
        searchfields: 'SheetId,WorkflowTitle',
        filterType: 'all'
      },
      tablePage: {
        pageCount: 0,
        sort: 'createdTime',
        order: 'desc',
        startIndex: 0,
        total: 0,
        currentPage: 1,
        pageSize: 20,
        align: 'center',
        pageSizes: [2, 10, 20, 50, 100, 200, 500],
        layout: 'total, sizes, prev, pager, next, jumper'
      },
      row: []
    };
  },
  mounted() {
    // this.getHeight = document.getElementById('workSpace').scrollHeight;
    // window.autoPageHeight()
    this.currentRealName = decodeURI(this.$store.state.user.author.realName)
    const data = window.sessionStorage;
    console.log(this.$store.state);
    this.loadTaskNumCount();

    // 获取待阅条数
    // this.getTodoCirculatedTotal()
    // 获取常用菜单
    this.loadApplicationData();
    // 获取快捷入口
    this.loadFastChannelList();
    // 获取待办数量
    this.getTodoList();
  },
  created() { },
  computed: {
    ...mapGetters(['sidebar']),
    appBoxStyle(item) {
      return function(data) {
        // data.width = 100;
        // data.height = 100;
        data.width = 40;
        data.height = 40;

        var style =
          'background-image: linear-gradient(' +
          data.color +
          ',' +
          data.color2 +
          ' 95%);width:40px;height:40px;border-radius: 6px;';
        // if (data.width > 0) {
        //   style += 'width:' + data.width + 'px;';
        // }
        // if (data.height > 0) {
        //   style += 'height:' + data.height + 'px;';
        // }
        return style;
      };
    },
    userLoginDay() {
      var startDate = Date.parse(this.$store.state.user.userInfo.createdTime);
      var endDate = Date.parse(new Date());
      var days = (endDate - startDate) / (1 * 24 * 60 * 60 * 1000);
      return Math.ceil(days)
    },
    hoursTips() {
      const hours = new Date().getHours();
      if (hours >= 0 && hours <= 6) {
        return '凌晨好'
      } else if (hours > 6 && hours <= 12) {
        return '上午好'
      } else if (hours > 12 && hours <= 13) {
        return '中午好'
      } else if (hours > 13 && hours <= 18) {
        return '下午好'
      } else if (hours > 18 && hours <= 24) {
        return '晚上好'
      }
      return ''
    }
  },
  methods: {
    // 获取任务数量
    loadTaskNumCount() {
      var that = this;
      // 任务数量
      Object.toAjaxJson(
        FUI.Handlers.WorkflowMonitorHandler,
        'getTodoCount',
        null,
        true,
        null,
        function(res) {
          if (res.data) {
            that.numData = {
              TaskTodoTotal: res.data.taskTodoTotal,
              TaskApprovalTotal: res.data.taskApprovalTotal,
              TaskStayReadTotal: res.data.taskStayReadTotal,
              TaskDraftTotal: res.data.taskDraftTotal
            };
          }
        }
      );
    },
    // 常用菜单
    loadApplicationData() {
      var that = this;
      var topN = 36;
      Object.toAjaxJson(
        '/workflow/security/application/',
        'getPersonalApplicationList',
        { topN: topN },
        true,
        null,
        function(res) {
          if (res.success) {
            that.applicationData = res.data;
          } else {
            console.info(res.msg);
          }
        }
      );
    },
    // 点击跳转常用菜单
    openApplication(item) {
      var that = this;
      var applicationId = item.applicationId;
      var applicationName = item.applicationName;
      var url =
        '/workflow/security/application/applicationHome?applicationId=' +
        applicationId;
      that.$router.push(url);
    },
    // 获取快捷入口
    loadFastChannelList() {
      var that = this;
      var total = 0;
      var pageCount = 0;
      var pageIndex = 1;
      var pageSize = 9;
      var sort = 'OrderNo asc,CreatedTime';
      var order = 'desc';
      var functionID = 'FastChannel';
      var infoType = 'link';
      Object.toAjaxJson(
        '/workflow/security/article/',
        'loadPersonalArticleListJsonByPage/?infoType=' +
          infoType +
          '&publicAuthorizeType=' +
          functionID +
          '&defaultWhere=' +
          "FunctionID='" +
          functionID +
          "' s_and IsAudited=2 ",
        { page: pageIndex, rows: pageSize, sort: sort, order: order },
        true,
        null,
        function(res) {
          that.fastChannelData = res.rows;
        }
      );
    },
    // 点击常用菜单
    onFastChannelClick(item) {
      var that = this;
      var refEntityId = item.refEntityId;
      var linkType = item.linkType;
      if (refEntityId && linkType == 'startWorkflow') {
        var url =
          __webpath + '/workflow/workflowform/index/?appId=' + refEntityId;
        FUI.Window.open(url);
      } else if (linkType == 'insidelink') {
        var url = item.linkUrl;
        that.$router.push(url);
      } else if (linkType == 'outsidelink') {
        var url = item.linkUrl;
        FUI.Window.open(url);
      } else if (refEntityId && linkType == 'applicationLink') {
        var url = item.linkUrl;
        var model = Object.toAjaxJson(
          '/workflow/security/applicationLink/',
          'getModel',
          { keyId: refEntityId }
        );
        if (model && model.refApplicationId) {
          var applicationId = model.refApplicationId;
          var url =
            '/workflow/security/application/applicationHome?openlinkId=' +
            refEntityId +
            '&applicationId=' +
            applicationId;
          that.$router.push(url);
        }
      }
    },
    // 打开更多菜单
    toMoreMenu() {
      const url = '/workflow/workflowBusiness/startWorkflowList';
      this.$router.push(url);
      this.$store.dispatch('app/openSideBar', {
        withoutAnimation: true
      });
    },
    // 获取待阅事项条数
    getTodoCirculatedTotal() {
      var that = this;
      var total = 0;
      var pageCount = 0;
      var pageIndex = 1;
      var pageSize = 6;
      var type = 'circulated';
      var appendToDivId = 'todoCirculatedList';
      var method = 'getTodoCirculatedListJson';
      var sort = 'CreatedTime';
      var order = 'desc';
      var data = Object.toAjaxJson(
        '/workflow/workflowBusiness/',
        method,
        {
          page: pageIndex,
          rows: pageSize,
          sort: sort,
          order: order
        },
        true,
        null,
        function(data) {
          if (data.success === true) {
            that.todoCirculatedTotal = data.total;
          }
        }
      );
    },
    handleClose(done) {
      var that = this;
      done;
      // 清空缓存
      that.$refs.announce.clearInfo();
    },
    getTodoList() {
      var that = this;
      var parm = that.searchParams;
      parm.page = that.tablePage.currentPage;
      parm.rows = that.tablePage.pageSize;
      parm.sort = that.tablePage.sort;
      parm.order = that.tablePage.order;
      var res = Object.toAjaxJson(
        '/workflow/workflowBusiness/',
        'getTodoListJson',
        parm,
        true,
        null,
        function(res) {
          if (res.success) {
            var data = res.rows;
            that.row = data.slice(0, 3);
            console.log(that.row);
          } else {
            FUI.Window.showMsg(res.msg);
          }
        }
      );
    },
    openWorkflowfromView(appId, formAction, wiid, taskId, title) {
        var that = this;
        var url = __webpath + '/workflow/workflowform/index/?formAction=2&wiid=' + wiid + '&taskId=' + taskId;
        // FUI.Window.openEdit(url, title, 2, 'grid',null, null, null, null, null,true);
        FUI.Window.open(url, '_blank');
      }
  }
};
</script>

<style lang="scss" scoped>
@import "~@/resources/css/workSpace.css";
@import '~@/resources/scss/workSpace.scss';
$defaultFontSize: 20px;

.workSpace-container{
  // width: 100%;

  font-size: $defaultFontSize;
}

.workSpace-card .card-header-title{
  font-size: $defaultFontSize;
}

.text-txt{
  font-size: $defaultFontSize;
}

.workSpace-card .task-image-5{
    width: 65px;
    height: 65px;
}

.workSpace-card-header{
  display: flex;
  justify-content: space-between;
}

.el-row {
  margin-top: 20px;
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0;
  }
}

.bg-purple {
  background: #0d1126;
}

.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}

.task-item-box-icon {
  font-size: 35px;
}

.workSpace-header-content {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.workSpace-container-top {
  background-color: #ffffff;
  margin: 20px auto;
}
.workSpace-task-box {
  padding: 10px;
}

.workSpace-announcement-list {
  height: 200px;
  overflow: auto;
  /*border: 1px solid;*/
}

.announcement-item-title {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  /*border: 1px solid;*/
  width: 70%;
}

.announcement-item-time {
  padding-right: 10px;
  color: #909399;
  font-size: 15px;
  word-break: break-all;
  height: 50px;
  overflow: hidden;
}
.workFlow-content {
  width: 100%;
  display: flex;
  .workFlow-item {
    padding: 10px 0px 0px 0px;
  }
}
.box {
  width: 100%;
  display: flex;
  text-align: center;

  .box-item {
    width: 30%;
    height: 200px;
    padding-bottom: 20px;
  }
}
.box1 {
  width: 100%;
  display: flex;
  text-align: center;
  justify-content: flex-start;

  .box-item1 {
    margin-left: 20px;
    // width: 45%;
    width: 20%;
    padding-bottom: 20px;

    .task-image-item{
      width: 100px;
      height: 100px;
    }
  }
}

.workSpace-container-banner {
  display: flex;
  align-items: center;
  // margin: 20px 150px;
  margin: 20px 28px;
  cursor: pointer;
  .image {
    margin-right: 30px;

  }
  .text{
    font-size: 34px;
    div{
      margin:5px 0;
    }
  }
}
</style>
