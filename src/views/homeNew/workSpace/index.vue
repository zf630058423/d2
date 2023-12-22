<template>
  <div id="workSpace" class="workSpace-container">
    <div class="action-card">
      <div class="action-title"><span>Hi, <span v-html="currentRealName"></span>{{ hoursTips }}！</span></div>
      <div class="click-card">
        <div
          class="card"
          onclick="FUI.Window.openTopTab(__webpath+ '/workflow/workflowBusiness/draftList','草稿箱','fa fa-pencil','wf_DraftList')"
        >
          <img src="@/resources/images/desktop/daitijiao.png">
          <div>
            <div class="txt">待提交</div>
            <div class="amount">{{ numData.TaskDraftTotal }}</div>
          </div>
        </div>
        <div
          class="card"
          onclick="FUI.Window.openTopTab(__webpath+ '/workflow/workflowBusiness/todoList','待办事项','fa fa-pencil','wf_TodoList')"
        >
          <img src="@/resources/images/desktop/daiwoshenpi.png">
          <div>
            <div class="txt">待审批</div>
            <div class="amount">{{ numData.TaskTodoTotal }}</div>
          </div>
        </div>
        <div
          class="card"
          onclick="FUI.Window.openTopTab(__webpath+ '/workflow/workflowBusiness/todoCirculatedList','待阅事项','fa fa-pencil','wf_TodoCirculatedList')"
        >
          <img src="@/resources/images/desktop/daiyueliucheng.png">
          <div>
            <div class="txt">待阅流程</div>
            <div class="amount">{{ numData.TaskStayReadTotal }}</div>
          </div>
        </div>
        <div
          class="card"
          onclick="FUI.Window.openTopTab(__webpath+ '/workflow/workflowBusiness/myWorkItem','我发起的','fa fa-pencil','wf_MyWorkItem')"
        >
          <img src="@/resources/images/desktop/wofaqiliucheng.png">
          <div>
            <div class="txt">我发起的</div>
            <div class="amount">{{ numData.TaskApprovalTotal }}</div>
          </div>
        </div>
        <div
          class="card"
          onclick="FUI.Window.openTopTab(__webpath+ '/workflow/workflowBusiness/doneList','已办事项','fa fa-pencil','wf_DoneList')"
        >
          <img src="@/resources/images/desktop/wochulide.png">
          <div>
            <div class="txt">我处理的</div>
            <div class="amount">{{ numData.taskMyDealtTotal || 0 }}</div>
          </div>
        </div>
        <div
          class="card"
          onclick="FUI.Window.openTopTab(__webpath+ '/workflow/workflowBusiness/doneCirculatedList','已阅事项','fa fa-pencil','wf_DoneCirculatedList')"
        >
          <img src="@/resources/images/desktop/yiyueliucheng.png">
          <div>
            <div class="txt">已阅流程</div>
            <div class="amount">{{ numData.taskCheckedProcessTotal || 0 }}</div>
          </div>
        </div>
      </div>
    </div>
    <el-row :gutter="20" style="margin-bottom: 0">
      <el-col :span="24">
        <el-card class="workSpace-card pb10 mt20" shadow="never" body-style="min-height:100px">
          <div slot="header" class="clearfix">
            <span class="card-header-title">快捷入口</span>
          </div>
          <div id="fastChannelList" class="workSpace-persion-applicationList">
            <el-row>
              <el-col v-for="(item, index) in fastChannelData" :key="index" :span="2" class="pl10 pr5 workSpace-quick-entry">
                <div @click="onFastChannelClick(item)">
                  <div class="application-item" :style="appBoxStyle(item)">
                    <span :style="'font-size:' + item.fontSize + 'px;'" :class="item.icon" />
                  </div>
                  <div class="workSpace-persion-applicationboxtitle">
                    {{ item.menuName }}
                  </div>
                </div>
              </el-col>
            </el-row>
          </div>
        </el-card>
      </el-col>
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
    <div class="workItem-box">
      <div class="workItem">
        <div class="header-title">日历助手
          <div>
            <el-button type="primary" style="float: right;" size="small" @click="handleAddNote">+
              添加日程
            </el-button>
            <el-button type="primary" style="float: right;margin-right: 15px" size="small" @click="handleAddMeeting">+
              添加会议
            </el-button>
          </div>
        </div>
        <meeting ref="meet"></meeting>
      </div>
      <div class="notice">
        <div class="header-title">企业公告
          <el-button style="float: right; padding: 3px 0;color: #C0C4CC" type="text" @click="toMoreAnnouncement">
            更多<span class="el-icon-arrow-right" style="color: #c6c6c6"></span>
          </el-button>
        </div>
        <div v-for="(item, index) in getAnnounceList" :key="index" class="notice-list" @click="handelOpenAnnounce(item)">
          <el-badge :is-dot="item.StatusNo === 0 ? true : false" class="item">
            <span class="el-icon-bell" style="font-size: 20px;color: #409EFF;font-weight: 500;"></span>
          </el-badge>
          <div class="notice-title">
            {{ item.title }}
          </div>
          <div class="public-time">{{ item.createTime | formatDates }}</div>
        </div>
        <div v-if="getAnnounceList.length <= 0" class="no-data"> 暂无公告信息 </div>
      </div>
    </div>
    <div v-if="getWorkItemMenuRole.legnth>0" style="margin-top: 24px;">
      <el-col :span="24" style="margin-bottom: 20px">
        <el-card class="workSpace-card " shadow="never">
          <div slot="header" class="clearfix">
            <div class="workSpace-header-content">
              <div class="workItem-menu">
                <span
                  v-show="getWorkItemMenuRole.indexOf('首页(营销)') !== -1"
                  :class="{ 'workItem-menu-active': getCurrent === 1 }"
                  @click="handleWorkItemMenu(1)"
                >
                  营销
                </span>
                <span
                  v-show="getWorkItemMenuRole.indexOf('首页(工程)') !== -1"
                  :class="{ 'workItem-menu-active': getCurrent === 2 }"
                  @click="handleWorkItemMenu(2)"
                >
                  工程
                </span>
              </div>
            </div>
          </div>
          <div v-show="getCurrent === 1" class="workItem-content">
            <marketing ref="market"></marketing>
          </div>
          <div v-show="getCurrent === 2" class="workItem-content">
            <engineering ref="engineer"></engineering>
          </div>
        </el-card>
      </el-col>
    </div>
    <el-backtop target=".workSpace-container" :bottom="100" :visibility-height="400"></el-backtop>
    <el-dialog
      title="公告信息"
      :visible.sync="dialogAnnounceDetail"
      fullscreen
      :before-close="handleClose"
      class="dialogClass"
    >
      <div>
        <announceDetail ref="announce"></announceDetail>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import meeting from './meeting'
  import marketing from './marketing'
  import engineering from './engineering'
  import { mapGetters } from 'vuex';
  import announceDetail from './announceDetail'
  import WebSoket from '@/utils/connectionWebSoket'; // websoket载入
  import api from '@/Api/home/workSpace';

  export default {
    name: 'WorkSpaceIndex',
    components: {
      meeting, marketing, engineering, announceDetail
    },
    filters: {
      formatDates(datetime) {
        const date = new Date(datetime) // datetime时间戳为13位毫秒级别,如为10位需乘1000
        const month = ('0' + (date.getMonth() + 1)).slice(-2) // getMonth是从1-11,所以需要加1
        const sdate = ('0' + date.getDate()).slice(-2) // -2表示从倒数第二个元素开始截取
        const h = ('0' + date.getHours()).slice(-2)
        const m = ('0' + date.getMinutes()).slice(-2)
        const s = ('0' + date.getSeconds()).slice(-2)
        const thatDate = date.getFullYear() + '-' + month + '-' + sdate + ' ' + h + ':' + m + ':' + s;
        return thatDate
      }
    },
    data() {
      return {
        currentRealName: '',
        workItemMenu: [],
        // workItemMenu: ['日程'],
        getCurrent: 0,
        dialogAnnounceDetail: false, // 公告详情model
        fastChannelData: [],
        applicationData: [],
        getHeight: null,
        getAnnounceList: [],
        getMettingList: [],
        // todoCirculatedTotal: 0,
        showBtn: false,
        numData: {
          TaskTodoTotal: 0, // 待办
          TaskApprovalTotal: 0, // 发起未完成
          TaskStayReadTotal: 0, // 待阅
          TaskDraftTotal: 0, // 草稿
          taskMyDealtTotal: 0, // 我处理的
          taskCheckedProcessTotal: 0 // 已阅流程
        },
        getWorkItemMenuRole: []
      }
  },
  mounted() {
      this.getHeight = document.getElementById('workSpace').scrollHeight;
      this.currentRealName = decodeURI(this.$store.state.user.author.realName)
      window.autoPageHeight()
      const data = window.sessionStorage
      console.log(this.$store.state)

      this.loadTaskNumCount()
      // 获取公告列表
      this.getAnnouncementList()
      // 获取待阅条数
      // this.getTodoCirculatedTotal()
      // 获取常用菜单
      this.loadApplicationData()
      // 获取快捷入口
      this.queryQuickMenuList();
      // this.loadFastChannelList();
      this.getItemMenuName()
    },
    created() {
      // this.getRoleList();
      WebSoket.connectionWebSoket();
    },
    computed: {
      ...mapGetters(['sidebar']),
      appBoxStyle(item) {
        return function(data) {
          var style = 'background-image: linear-gradient(' + data.color + ',' + data.color2 + ' 95%);';
          if (data.width > 0) {
            style += 'width:' + data.width + 'px;'
          }
          if (data.height > 0) {
            style += 'height:' + data.height + 'px;'
          }
          return style
        }
      },
      currentHeight() {
        if (this.fastChannelData.length === 0) {
          return '200px';
        } else {
          return this.fastChannelData.length > 7 ? '312px' : '212px';
        }
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
    async openTopTabClick(type) {
      const typeData = {
        1: { // 发起流程
          menuName: '发起流程',
          menuUrl: '/workflow/workflowBusiness/startWorkflowList',
          menuId: 'wf_DoneList'
        },
        2: { // 待我审批 代办事项
          menuName: '待我审批',
          menuUrl: '/workflow/workflowBusiness/todoList',
          menuId: 'wf_TodoList'
        },
        3: { // 待阅流程
          menuName: '待阅流程',
          menuUrl: '/workflow/workflowBusiness/todoCirculatedList',
          menuId: 'wf_TodoCirculatedList'
        },
        4: { // 我发起的
          menuName: '我发起的',
          menuUrl: '/workflow/workflowBusiness/myWorkItem',
          menuId: 'wf_MyWorkItem'
        },
        5: { // 我处理的
          menuName: '我处理的',
          menuUrl: '/workflow/workflowBusiness/doneList',
          menuId: 'wf_DoneList'
        },
        6: { // 已阅流程
          menuName: '已阅流程',
          menuUrl: '/workflow/workflowBusiness/doneCirculatedList',
          menuId: 'wf_DoneCirculatedList'
        },
        7: { // 草稿箱 待提交
          menuName: '待提交',
          menuUrl: '/workflow/workflowBusiness/draftList',
          menuId: 'wf_DraftList'
        }
      }

      // 取消 操作流程计数
      // let params = {
      //   userId: '',
      //   menuName: typeData[type].menuName,
      //   menuId: typeData[type].menuId,
      //   menuUrl: typeData[type].menuUrl
      // };
      // await api.saveQuickMenuRecord(params);  //菜单点击计数
      const menuName = (type === 7) ? '草稿箱' : typeData[type].menuName;
      FUI.Window.openTopTab(__webpath + typeData[type].menuUrl, menuName, 'fa fa-pencil', typeData[type].menuUrl);
      // FUI.Window.open(__webpath + typeData[type].menuUrl, '_blank');
    },
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
              TaskDraftTotal: res.data.taskDraftTotal,
              taskMyDealtTotal: res.data.taskMyDealtTotal,
              taskCheckedProcessTotal: res.data.taskCheckedProcessTotal
            };
          }
        }
      )
    },
    // 常用菜单
    loadApplicationData() {
      var that = this
      var topN = 36
      Object.toAjaxJson(
        '/workflow/security/application/',
        'getPersonalApplicationList',
        { topN: topN },
        true,
        null,
        function(res) {
          if (res.success) {
            that.applicationData = res.data
          } else {
            console.info(res.msg)
          }
        }
      )
    },
    // 点击跳转常用菜单
   async openApplication(item) {
      const applicationId = item.applicationId
      const applicationName = item.applicationName
      const url = '/workflow/security/application/applicationHome?applicationId=' + applicationId;
      // let params = { userId:applicationId,menuName:applicationName, menuId:item.applicationGroupKey, menuUrl:url };
      // await api.saveQuickMenuRecord(params);  //菜单点击计数
      this.$router.push(url);
    },
    // 快捷入口新接口
    async queryQuickMenuList() {
      const { data } = await api.queryQuickMenuList();
      const aBgArray = [
        { icon: 'icon-a-ziyuan54', color2: '#479DDB', color: '#78CEF7' },
        { icon: 'icon-yewu', color2: '#E99927', color: '#F3C94F' },
        { icon: 'icon-a-ziyuan601', color2: '#0DB3A6', color: '#81D4CF' },
        { icon: 'icon-rukufangan', color2: '#28BF7B', color: '#76E299' }, // 设计管理
        { icon: 'icon-shijianguanli', color2: '#F56440', color: '#FB8871' }, // 收入合同
        { icon: 'icon-xietonggongzuo', color2: '#E99927', color: '#F3C94F' }, // 供应商协同
        { icon: 'icon-shujutaizhang', color2: '#E99927', color: '#F3C94F' }, // 报表管理
        { icon: 'icon-a-ziyuan54', color2: '#479DDB', color: '#78CEF7' },
        { icon: 'icon-yewu', color2: '#E99927', color: '#F3C94F' },
        { icon: 'icon-a-ziyuan601', color2: '#0DB3A6', color: '#81D4CF' },
        { icon: 'icon-rukufangan', color2: '#28BF7B', color: '#76E299' }, // 设计管理
        { icon: 'icon-shijianguanli', color2: '#F56440', color: '#FB8871' }, // 收入合同
        { icon: 'icon-xietonggongzuo', color2: '#E99927', color: '#F3C94F' }, // 供应商协同
        { icon: 'icon-shujutaizhang', color2: '#E99927', color: '#F3C94F' } // 报表管理
      ]
      this.fastChannelData = data ? data.map((item, index) => ({
        ...item,
        width: 40,
        height: 40,
        color: aBgArray[index].color,
        color2: aBgArray[index].color2,
        fontSize: 20,
        icon: `icon ${aBgArray[index].icon}`
      })) : [];
    },
      // 获取快捷入口
    loadFastChannelList() {
        var that = this
        var total = 0
        var pageCount = 0
        var pageIndex = 1
        var pageSize = 9
        var sort = 'OrderNo asc,CreatedTime'
        var order = 'desc'
        var functionID = 'FastChannel'
        var infoType = 'link'
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
            that.fastChannelData = res.rows
          }
        )
      },
      // 点击常用菜单
    async onFastChannelClick(item) {
      console.log('快捷进入item===:', item);
      var that = this
      const { refEntityId, linkType, userId, menuId, menuUrl, menuName } = item;
      const params = { userId, menuId, menuUrl, menuName };
      await api.saveQuickMenuRecord(params);
        if (refEntityId && linkType == 'startWorkflow') {
          var url =
            __webpath + '/workflow/workflowform/index/?appId=' + refEntityId
          FUI.Window.open(url)
        } else if (userId && menuId) {
          // const url = __webpath + menuUrl + `&userId=${userId}&menuId=${menuId}`;
          const url = __webpath + menuUrl;
          FUI.Window.open(url)
        } else if (linkType == 'insidelink') {
          var url = item.linkUrl
          that.$router.push(url)
        } else if (linkType == 'outsidelink') {
          var url = item.linkUrl
          FUI.Window.open(url)
        } else if (refEntityId && linkType == 'applicationLink') {
          var url = item.linkUrl
          var model = Object.toAjaxJson(
            '/workflow/security/applicationLink/',
            'getModel',
            { keyId: refEntityId }
          )
          if (model && model.refApplicationId) {
            var applicationId = model.refApplicationId
            var url =
              '/workflow/security/application/applicationHome?openlinkId=' +
              refEntityId +
              '&applicationId=' +
              applicationId
            that.$router.push(url)
          }
        }
      },
      // 打开更多菜单
      toMoreMenu() {
        const url = '/workflow/workflowBusiness/startWorkflowList'
        this.$router.push(url)
        this.$store.dispatch('app/openSideBar', {
          withoutAnimation: true
        })
      },
      // 点击切换workItemMenu
      handleWorkItemMenu(val) {
        const that = this;
        that.getCurrent = val;
        if (val === 1) {
          that.$refs.market.handleRestForm();
        } else if (val === 2) {
          that.$refs.engineer.handleRestForm();
        }
      },
      // 打开新增日志model
      handleAddNote() {
        this.$refs.meet.handleAdd()
      },
      // 打开新增会议页面
      handleAddMeeting() {
        const url = '/workflow/workflowform/index/?appId=AG'
        window.open(url, '_blank')
      },
      //  获取公告列表
      getAnnouncementList() {
        var that = this;
        const isOk = false;
        const data = {
          'pageIndex': 1,
          'pageSize': 10,
          'sort': ''
        };
        $.extendAjax('/noticeapply/queryNoticeapplys', JSON.stringify(data), 'post', function(res) {
            if (res.code === 200) {
              that.getAnnounceList = res.data;
            } else {
              return isOk
            }
          }
        )
      },

      // 获取待阅事项条数
      getTodoCirculatedTotal() {
        var that = this
        var total = 0
        var pageCount = 0
        var pageIndex = 1
        var pageSize = 6
        var type = 'circulated'
        var appendToDivId = 'todoCirculatedList'
        var method = 'getTodoCirculatedListJson'
        var sort = 'CreatedTime'
        var order = 'desc'
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
              that.todoCirculatedTotal = data.total
            }
          }
        )
      },
      // 点击前往公告列表
      toMoreAnnouncement() {
        this.$router.push(`/workflow/security/customDataGrid/customDataGridView/?code=custGrid_WorkflowForm_BPM_NoticeApply_4567`)
        // this.sidebar.opened = true;
        // FUI.Window.openTopTab('/workflow/security/customDataGrid/customDataGridView/?code=custGrid_WorkflowForm_BPM_NoticeApply_4567','公告申请','','')
      },
      // 打开公告详情
      handelOpenAnnounce(item) {
        const that = this
        that.dialogAnnounceDetail = true
        setTimeout(function() {
          that.$refs.announce.getAnnounceInfo(item)
        }, 500)
      },
      handleClose(done) {
        var that = this
        done
        // 刷新
        that.getAnnouncementList()
        // 清空缓存
        that.$refs.announce.clearInfo()
        that.dialogAnnounceDetail = false
      },
      // 获取公告栏图片
      getImgUrl(item) {
        // var imgType = ".jpg" || ".png";
        return require('../../../resources/images/announcementImg/img_' + item + '.jpg');
      },
      // 获取 首页部分菜单权限
      getItemMenuName() {
        var that = this;
        if (localStorage.homeAuth) {
          var arr = JSON.parse(localStorage.homeAuth);
          that.getWorkItemMenuRole = arr;
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import '~@/resources/css/workSpace.css';
  @import '~@/resources/scss/workSpace.scss';
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

  .workSpace-task-box {
    margin: 0 0.888%;
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

  ::v-deep .is-fullscreen{
    overflow: hidden;
  }

  ::v-deep .el-dialog__header{
    border-bottom: 1px solid #F3F8FF;
  }

  ::v-deep .el-dialog__body{
    padding: 0;
  }

</style>
