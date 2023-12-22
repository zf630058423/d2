<template>
  <div ref="contentData" :class="classObj" class="app-wrapper">
    <div class="layout-head" :style="{ overflow:getWidthNum > 500? 'hidden': 'auto' }">
      <!--header导航区-->
      <navbar />
    </div>
    <div id="main-container" class="main-container">
      <!--左侧导航-->
      <sidebar class="sidebar-container" :mangement-side="mangementSide" />
      <!--主显容器区-->
      <app-main id="main-content" />
    </div>
    <!--抽屉个人信息-->
    <el-drawer
      :with-header="withHeader"
      :size="drawerSize"
      :visible.sync="drawer"
      :direction="direction"
    >
      <div class="account-tabs-bar">
        <div class="account-tab-item">{{ $t('logonDrawer.myAccount') }}</div>
        <div class="account-head-colose cur" @click="coloseDrawer">
          <i class="icon icon-arrow-right-bold" />
        </div>
      </div>
      <div class="demo-drawer__content">
        <div class="account-common">
          <div class="account-basic" @click="ngToUserInfo">
            <img class="account-basic-image" :src="userImg">
            <div class="account-basic-box">
              <div class="account-basic-info">
                <a
                  class="ace-link ace-link-primary account-basic-name cur font12 pl5"
                  target="_blank"
                >
                  {{ $t('logonDrawer.logonAccount') }}：{{
                    userInfo.realName
                  }}</a>
              </div>
              <div class="account-basic-authentication mt5">
                {{ $t('logonDrawer.logonDepart') }}：{{ userInfo.orgName }}
              </div>
            </div>
          </div>
          <div class="mt10" style="text-align: left;padding-left:60px;">
            <span
              class="mr10 cur account-switchlogin"
              @click="switchLoginOrg"
            ><i style="font-size:12px;" class="icon  icon-qiehuan"></i>
              {{ $t('logonDrawer.switchLogonDepart') }}</span>
            <span
              style="color: #006EFF"
              class="cur fa fa-sign-out   font12"
              @click="quit"
            >{{ $t('head.logonOut') }}
            </span>
          </div>
        </div>
        <div class="account-common">
          <div class="account-common-title">
            {{ $t('logonDrawer.basicInformation') }}
            <span
              style="color: #006EFF;cursor: pointer;font-weight: normal; "
              title="点击修改用户基本信息"
              @click="modifyUserBaseInfo"
            ><i class="icon icon-a-tianxiexiangqing   "> </i><span class="font10">修改</span>
            </span>
          </div>
          <div class="account-common-box account-common-box-first">
            <div class="account-common-left">
              {{ $t('logonDrawer.logonAccount') }}：
            </div>
            <div class="account-common-right">{{ userInfo.account }}</div>
          </div>

          <div class="account-common-box account-common-box-first">
            <div class="account-common-left">
              {{ $t('logonDrawer.password') }} ：
            </div>
            <div
              class="account-common-right cur"
              style="color: #006EFF"
              @click="modifyNewPassword('')"
            >
              <i class="icon icon-a-tianxiexiangqing" />{{ $t('modify') }}
            </div>
          </div>

          <div class="account-common-box">
            <div class="account-common-left">
              {{ $t('logonDrawer.realName') }}：
            </div>
            <div class="account-common-right">{{ userInfo.realName }}</div>
          </div>
          <div class="account-common-box">
            <div class="account-common-left">
              {{ $t('logonDrawer.orgFullName') }}：
            </div>
            <div class="account-common-right">{{ userInfo.orgNames }}</div>
          </div>
          <div class="account-common-box">
            <div class="account-common-left">{{ $t('logonDrawer.sex') }}：</div>
            <div class="account-common-right">{{ userInfo.sex }}</div>
          </div>
          <div class="account-common-box">
            <div class="account-common-left">
              {{ $t('logonDrawer.email') }}：
            </div>
            <div class="account-common-right">{{ userInfo.email }}</div>
          </div>
          <div class="account-common-box">
            <div class="account-common-left">
              {{ $t('logonDrawer.mobile') }}：
            </div>
            <i style="color: #006EFF; " class="icon icon-shouji cur  "></i>{{ userInfo.mobile }}
          </div>
        </div>
        <div class="account-common">
          <div class="account-common-title">{{ $t('logonDrawer.status') }}</div>
          <div class="account-common-box">
            <div class="account-common-left">
              {{ $t('logonDrawer.accountStatus') }}：
            </div>
            {{ userInfo.status == 1 ? $t('normal') : $t('disabled') }}
          </div>
          <div v-if="isMultiTenant" class="account-common-box">
            <div class="account-common-left">
              {{ $t('logonDrawer.tenantNo') }}：
            </div>
            <div class="account-common-right">
              {{ userInfo.tenantId }}
            </div>
          </div>
          <div v-if="false" class="account-common-box">
            <div class="account-common-left">
              {{ $t('logonDrawer.effectiveTime') }}：
            </div>
            <div class="account-common-right">{{ userInfo.beginTime }}</div>
          </div>
          <div v-if="false" class="account-common-box">
            <div class="account-common-left">
              {{ $t('logonDrawer.deadlineTime') }} ：
            </div>
            <div class="account-common-right">{{ userInfo.endTime }}</div>
          </div>
        </div>
      </div>
      <div class="service-login-out" @click="quit">
        <span
          class="ervice-login-out-button"
        ><i class="icon icon-daoru1" />{{ $t('head.logonOut') }}</span>
      </div>
    </el-drawer>
    <!--主导航-->
    <div
      v-show="mainMenuVisible"
      id="mainMenu"
      class="fixed-menu  main-fix-menu"
      @mouseleave="onMenuMouseleave"
    >
      <el-menu id="menu" text-color="#000" @select="mainMenuSelect">
        <el-menu-item index="fix_desktop">
          <i style="color:#006EFF" class="icon icon-zichan" />
          <span>{{ $t('workstation.workbench') }}</span>
        </el-menu-item>
        <el-menu-item v-for="menu in mainMenus" v-if="menu.attributes.type === 'menu'" :index="menu.id">
          <i style="color:#006EFF;font-size: 14px;" :class=" menu.attributes.menuImg.indexOf('fa') > -1? 'fa ' + menu.attributes.menuImg : 'icon ' + menu.attributes.menuImg" />
          <span style="margin-left: 7px" v-html="menuLangTitle(menu)"></span>
        </el-menu-item>
      </el-menu>
      <!--       <el-divider></el-divider> -->
    </div>
    <el-backtop target=".app-wrapper" :bottom="100">
      <div
        style="{
        height: 100%;
        width: 100%;
        background-color: #f2f5f6;
        box-shadow: 0 0 6px rgba(0,0,0, .12);
        text-align: center;
        line-height: 40px;
        color: #1989fa;
      }"
      >
        UP
      </div>
    </el-backtop>
  </div>
</template>

<script>
  import WebSoket from '@/utils/connectionWebSoket'; // websoket载入
  import { Navbar, Sidebar, AppMain } from './components'
  import ResizeMixin from './mixin/ResizeHandler'
  import NProgress from 'nprogress' // 路由加载时进度条
  import 'nprogress/nprogress.css' // 路由加载时进度条样式
  import {
  getWarningInfo
} from '../Api/common'

  export default {
    name: 'Layout',
    components: {
      Navbar,
      Sidebar,
      AppMain
    },
    mixins: [ResizeMixin],
    data() {
      return {
        language: '',
        isMultiTenant: false,
        mainMenus: [],
        // 主菜单导航
        mainMenuVisible: false,
        userImg: '',
        // 抽屉
        withHeader: false,
        drawerSize: '350px',
        drawerTitle: '查看',
        drawerContent: '',
        drawer: false,
        direction: 'rtl',
        mangementSide: '',
        currOrgId: '',
        userInfo: {
          orgName: '',
          // 多部门时，显示所有部门名称
          orgFullName: '',
          realName: '',
          userName: '',
          email: '',
          endTime: '',
          beginTime: '',
          mobile: '',
          status: '',
          sex: ''
        },
        getWidthNum: null,
        isApiCalled: localStorage.getItem('isLogin')

      }
    },
    computed: {
      sidebar() {
        return this.$store.state.app.sidebar
      },
      device() {
        return this.$store.state.app.device
      },
      fixedHeader() {
        return this.$store.state.settings.fixedHeader
      },
      menuLangTitle() {
        return function(item) {
          var language = this.$store.state.app.language
          var enTitle = item.attributes.alias
          if (enTitle == '') {
            enTitle = item.title
          }
          var zhTitle = item.title
          return language == 'en-US' ? enTitle : zhTitle
        }
      },
      classObj() {
        return {
          hideSidebar: !this.sidebar.opened,
          openSidebar: this.sidebar.opened,
          withoutAnimation: this.sidebar.withoutAnimation,
          mobile: this.device === 'mobile'
        }
      }
    },
    created() {
      const that = this
      var language = this.$store.state.app.language
      that.language = language
      that.userImg = require('@/resources/images/' +
        that.$store.state.user.avatar)
      that.mangementSide = that.$store.state.app.currState.mangementSide
      that.loadUserInfo()
      that.loadMainMenus()
      var author = that.$store.state.user.author
      that.isMultiTenant = author.isMultiTenant
      that.getWidthNum = window.screen.width;
      console.log(localStorage.getItem('isLogin'))
      if (this.isApiCalled === 'true') {
      this.callApi()
      localStorage.setItem('isLogin', false)
    }
    },
    mounted() {
      var that = this
      setTimeout(function() {
      that.checkNeedChangePwd()
      }, 1000)
    },
    methods: {
      // 检查是否需要定期修改密码
      checkNeedChangePwd() {
        const that = this
        var userId = that.$store.state.user.userId
        var title = ''
        Object.toAjaxJson(
          '/admin/user/',
          'checkNeedChangePwd',
          { userId: userId },
          true,
          null,
          function(res) {
            var data = {}
            if (res.success) {
              if (res.msg == 'NeedModifyInitailPwd') {
                // 请修改初始化登录密码
                title = '请修改初始化登录密码'
                that.modifyNewPassword(title)
              } else if (res.msg) {
                // 距上次修改密码已超过天，请修改密码
                title = '距上次修改密码已超过' + res.msg + '天，请修改登录密码'
                that.modifyNewPassword(title)
              }
            }
          }
        )
      },
      ngToUserInfo() {
        var that = this
        that.drawer = false
        that.$router.push({
          path: '/userInfo'
        })
      },
      clickNotice() {
        var that = this
        that.drawer = false
        that.$router.push({
          path: '/workflow/notification/personMessageCenter'
        })
      },
      switchManage(mangementside) {
        var that = this
        NProgress.start()
        // 写入状态，同时写入session
        this.$store.dispatch('app/setMangementSide', mangementside)
        this.mangementSide = mangementside
        this.handleClickOpenside()
        NProgress.done()
        if (that.$store.state.app.currState.currMenuId == '') {
          setTimeout(function() {
            // 点击打开第一项
            $('.sidebar-container  .el-menu-item')[0].click()
          }, 100)
        }
      },
      drawerAccountInfo() {
        var that = this
        var json = ''
        that.drawer = true
        that.drawerTitle = '我的账户'
      },
      drawerMainNavigation() {
        // 打开主导航菜单
        var that = this
        that.mainMenuVisible = !that.mainMenuVisible
      },
      mainMenuSelect(key) {
        var that = this
        this.mainMenuVisible = false
        that.$store.dispatch('app/removeCurrMenuId')
        if (key == 'fix_desktop') {
          that.handleClickOutside()
          that.ngrouter('/')
          return
        } else if (key == 'fix_knowledge') {
          that.handleClickOutside()
          that.ngrouter('/')
          return
        } else {
          that.switchManage(key)
          return
        }
      },
      ngrouter(url) {
        this.$router.push(url)
      },
      onMenuMouseleave() {
        this.mainMenuVisible = false
      },
      loadMainMenus() {
        var that = this
        Object.toAjaxJson(
          '/home/',
          'getMainMemus',
          { menuId: 'Root' },
          true,
          null,
          function(res) {
            that.mainMenus = res.data
          }
        )
      },
      loadUserInfo() {
        const that = this
        var userId = that.$store.state.user.userId
        var orgId = that.$store.state.user.author.orgId

        that.currOrgId = orgId
        var orgName = decodeURI(that.$store.state.user.author.orgName)
        Object.toAjaxJson(
          FUI.Handlers.OrgImplController,
          'getUserInfo',
          { userId: userId },
          true,
          null,
          function(res) {
            console.info(res)
            that.userInfo = res.data
            that.userInfo.orgName = orgName
            that.userInfo.userId = userId
            that.userInfo.orgNames = that.userInfo.orgNameList.toString()
            if (that.userInfo.sex == '2') {
              that.userInfo.sex = '女'
            } else if (that.userInfo.sex == '1') {
              that.userInfo.sex = '男'
            } else if (that.userInfo.sex == -'0') {
              that.userInfo.sex = '未填写'
            }
            that.$store.dispatch('user/setUserInfo', that.userInfo)
          }
        )
      },
      coloseDrawer() {
        var that = this
        that.drawer = false
      },
      modifyNewPassword(titleMsg) {
        var that = this
        that.coloseDrawer()
        var url = '/admin/user/updatePwdEdit/?userId=' + that.userInfo.userId
        if (titleMsg == '' || titleMsg == undefined || titleMsg == null) {
          titleMsg = '修改登录密码'
        }
        FUI.Window.openEdit(url, titleMsg, 'View', null, 450, 300, null, null)
      },
      modifyUserBaseInfo() {
        var that = this
        var url =
          '/admin/user/updateBaseInfoEdit/?formAction=Edit&parentGridId=grid&mainTable=sys_Users&keyId=' +
          that.userInfo.userId
        FUI.Window.openEdit(
          url,
          '修改用户信息',
          'View',
          null,
          750,
          500,
          null,
          null
        )
        that.coloseDrawer()
      },
      handleClickOutside() {
        this.$store.dispatch('app/closeSideBar', {
          withoutAnimation: false
        })
      },
      handleClickOpenside() {
        this.$store.dispatch('app/openSideBar', {
          withoutAnimation: true
        })
      },
      switchLoginOrg() {
        var that = this
        var url =
          '/admin/user/switchLoginOrg/?userId=' +
          that.userInfo.userId +
          '&orgId=' +
          that.currOrgId
        FUI.Window.openEdit(url, '切换登录组织', null, null, 550, 400, null, null)
        that.coloseDrawer()
      },
      async quit() {
        await this.$store.dispatch('user/removeAuthor', 'all')
        this.$store.state.app.tagsView = []
        // this.$router.push(`/login?redirect=${this.$route.fullPath}`);
        WebSoket.clearWebSoket();
        this.$router.push(`/login`);
        // 清空会话
        sessionStorage.clear();
      },
      // 查询预警
      async callApi() {
      var userId = FUI.Sys.getAuthor().userId
      await getWarningInfo(userId)
    }

    }
  }
</script>

<style lang="scss" scoped>
  @import '~@/styles/mixin.scss';
  @import '~@/styles/variables.scss';
  @import '~@/resources/css/home_layout.css';

  .app-wrapper {
    @include clearfix;
    position: relative;
    height: 100%;
    width: 100%;
    overflow: auto;

    &.mobile.openSidebar {
      position: fixed;
      top: 0;
    }
  }

  .drawer-bg {
    background: #000;
    opacity: 0.3;
    width: 100%;
    top: 0;
    height: 100%;
    position: absolute;
    z-index: 999;
  }

  .fixed-header {
    position: fixed;
    top: 0;
    right: 0;
    z-index: 9;
    width: calc(100% - #{$sideBarWidth});
    transition: width 0.28s;
  }

  .hideSidebar .fixed-header {
    width: calc(100% - 54px);
  }

  .mobile .fixed-header {
    width: 100%;
  }
  .layout-head {
    border-bottom: 1px solid #ebecf0;
    position: fixed;
    left: 0;
    top: 0;
    z-index: 2000;
    width: 100%;
    /*overflow-x: scroll;*/
  }
  .main-container {
    margin-top: 50px;
  }
</style>
