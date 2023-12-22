<template>
  <div class="navbar">
    <!--主按钮-->
    <hamburger
      :is-active="sidebar.opened"
      class="hamburger-container"
      @toggleClick="toggleSideBar"
    />
    <!--Logo-->
    <logo v-if="showLogo" :collapse="isCollapse" />
    <!--分隔线-->
    <el-divider direction="vertical" class="f-divider" />
    <!--顶部 个人工作台 -->

    <div class="nav-left-menu">
       <span class="persion-work cur" @click="ngrouter()" style="margin-left: 5px">
        <i class="icon icon-integral cur" />
        {{$t('workstation.workbench')}}
      </span>
      <span v-if="isShowMenu" class="persion-work cur" @click="handleSelect(1)" style="margin-left: 15px">
        <i class="icon icon-wodeyingyong cur" style="font-size: 18px;"/>
         项目大厅
      </span>
      <!--<span v-show="isShowMenu" class="persion-work cur" @click="handleSelect(2)" style="margin-left: 15px">-->
      <!--<i class="icon icon-wodeyingyong cur" style="font-size: 18px;"/>-->
      <!--预警大厅-->
      <!--</span>-->
      <!-- <span  class="persion-work cur" @click="handleSelect(3)" style="margin-left: 15px">
        <i class="icon icon-shouye1 cur" style="font-size: 18px;"/>
         登录1.0
      </span> -->
      <span  class="persion-work cur" @click="handleSelect(4)" style="margin-left: 15px">
        <i class="el-icon-document-remove" style="font-size: 18px;"/>
         签章平台
      </span>
      <span  class="persion-work cur" @click="handleSelect(5)" style="margin-left: 15px">
        <i class="el-icon-tickets" style="font-size: 18px;"/>
         工盟平台
      </span>
      <span  class="persion-work cur" @click="handleSelect(6)" style="margin-left: 15px">
        <i class="el-icon-share" style="font-size: 18px;"/>
         流程指引
      </span>
    </div>
    <!--面包绡-->
    <!--     <breadcrumb class="breadcrumb-container" /> -->

    <div class="right-menu">
      <el-menu
        mode="horizontal"
        size="small"
        style="height: 50px; border: 0px"
        class="head-menu"
        @select="headmenuclick"
      >
        <!-- <el-menu-item v-if="language=='zh-CN'" index="en-US" style="padding: 0 12px" title="switch to english">
          <i class="font12">English</i>
        </el-menu-item>
        <el-menu-item v-if="language=='en-US'" index="zh-CN" style="padding: 0 12px" title="切换到中文">
          <i class="font12">中文</i>
        </el-menu-item> -->
        <!-- <el-menu-item style="padding:0">
          <span  class="divider-line">|</span>
        </el-menu-item> -->
        <!-- 导航栏 搜索框功能---------------------------------------------------------------------- -->
        <el-menu-item>
          <!-- 远程搜索的输入框 -->
          <SearchNavbar style="padding: 0 12px" />
        </el-menu-item>
        <el-menu-item
          v-if="!isScreenfull"
          index="infullScreen"
          style="padding: 3px 12px"
          :title="$t('head.fullScreen')"
        >
          <span class="icon icon-quanpingmu font12" /><i class="font12"></i>
          {{ $t('head.fullScreen') }}
        </el-menu-item>
        <el-menu-item
          v-if="isScreenfull"
          index="outfullScreen"
          style="padding: 0 12px"
          :title="$t('head.outfullScreen')"
        >
          <span class="icon icon-quxiaoquanping" /><i class="font12"> </i
        >{{ $t('head.outfullScreen') }}
        </el-menu-item>
        <el-menu-item style="padding: 0">
          <span class="divider-line">|</span>
        </el-menu-item>
        <!-- <el-menu-item index="restApi" style="padding: 0 12px">
          <i class="icon icon-interfaceConnected" /> {{$t('head.helpDoc')}}
        </el-menu-item> -->
        <!-- <el-menu-item style="padding:0">
          <span  class="divider-line">|</span>
        </el-menu-item> -->
        <el-menu-item index="message" style="padding: 0 10px">
          <i
            style="font-size: 11px; margin-right: 0; width: auto"
            class="el-icon-message-solid"
          />
          <span> {{ $t('head.notify') }}</span>
          <el-badge
            id="top_todo_message_number"
            :value="homeOtherData.megCount"
            class="item"
            style="position: relative; top: -4px"
          />
        </el-menu-item>
        <el-menu-item style="padding: 0px; padding-right: 10px">
          <span class="divider-line">|</span>
        </el-menu-item>
        <el-menu-item index="currUser" style="padding: 0 5px; padding-left: 0px; padding-right: 10px">
          <span v-html="currentRealName" />
          <el-dropdown class="avatar-container">
            <div class="avatar-wrapper" @click="drawerAccountInfo">
              <img :src="userImg" class="user-avatar" />
              <i class="el-icon-caret-bottom" />
            </div>
            <el-dropdown-menu slot="dropdown" class="user-dropdown" />
          </el-dropdown>
        </el-menu-item>
      </el-menu>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import Breadcrumb from '@/components/Breadcrumb'
  import Hamburger from '@/components/Hamburger'
  import Logo from './Sidebar/Logo'
  import SearchNavbar from './searchNavbar'
  import { login,yqtLogin, gmLogin } from '@/Api/common'



  export default {
    components: {
      Breadcrumb,
      Hamburger,
      Logo,
      SearchNavbar //搜索框显示框
    },
    computed: {
      ...mapGetters(['sidebar', 'avatar'])
    },
    created () {
      var that = this;
      that.getItemMenuName();
      that.currentRealName = decodeURI(that.$store.state.user.author.realName)
      that.loadHomeOtherData()
      that.mangementSide = that.$store.state.app.currState.mangementSide
      that.userImg = require('@/resources/images/' + that.avatar)
      var language = that.$store.state.app.language
      that.language = language
    },
    data () {
      return {
        language: '',
        showLogo: true,
        isCollapse: false,
        currentRealName: '',
        mangementSide: '',
        isScreenfull: false,
        homeOtherData: { megCount: 0 },
        userImg: '',
        activeIndex: '0', //导航栏菜单序号
        getPathData: null, // 获取当前页面的路由地址
        isShowMenu: true
      }
    },
    methods: {
      loadHomeOtherData () {
        const that = this
        const resData = Object.toAjaxJson('/home/', 'getHomeOtherData')
        that.homeOtherData = resData
        that.getPathData = that.$route.path
        console.log(that.getPathData, '当前路由')
        // console.log(that.$store.state)
      },
      headmenuclick (name, keyPath) {
        console.log(name)
        if (name == 'showUserInfo') {
          this.showUserInfo()
        } else if (name == 'updatePassword') {
          this.modifyNewPassword()
        } else if (name == 'infullScreen') {
          this.screenfull()
        } else if (name == 'outfullScreen') {
          this.screenexit()
        } else if (name == 'message') {
          this.clickNotice()
        } else if (name == 'drawerAccountInfo') {
          this.drawerAccountInfo()
        } else if (name == 'updatePassword') {
          this.modifyNewPassword()
        } else if (name == 'quit') {
          this.quit()
        } else if (name == 'restApi') {
          window.open(__serverpath + '/doc.html', '_blank')
        } else if (name == 'en-US' || name == 'zh-CN') {
          this.$store.dispatch('app/toggleLanguage', name)
          window.location.reload()
        }
      },
      clickNotice () {
        this.$parent.clickNotice()
      },
      drawerAccountInfo () {
        // 直接使用上级vue对象
        this.$parent.drawerAccountInfo()
      },

      toggleSideBar () {
        // this.$store.dispatch("app/toggleSideBar");
        this.$parent.drawerMainNavigation()
      },
      screenfull () {
        var el = document.documentElement
        var rfs =
          el.requestFullScreen ||
          el.webkitRequestFullScreen ||
          el.mozRequestFullScreen ||
          el.msRequestFullscreen
        if (typeof rfs !== 'undefined' && rfs) {
          rfs.call(el)
          this.isScreenfull = true
        } else {
          return
        }
      },
      screenexit () {
        if (document.exitFullscreen) {
          document.exitFullscreen()
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen()
        } else if (document.webkitCancelFullScreen) {
          document.webkitCancelFullScreen()
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen()
        }
        if (typeof cfs !== 'undefined' && cfs) {
          cfs.call(el)
        }
        this.isScreenfull = false
      },
       ngrouter () {
        let userAgent = navigator.userAgent.toLowerCase();
        let isMobile = userAgent.match(/(iphone|ipod|ipad|android)/)
        this.$parent.handleClickOutside()
        var getHeight = ''
        // this.$router.push(url)
        // this.activeIndex = '0'
        if(isMobile){
        this.$router.push('/newHome')
        }else{
         this.$router.push('/')
        }
      },
      async logout () {
        await this.$store.dispatch('user/removeAuthor')
        this.$router.push(`/login?redirect=${this.$route.fullPath}`)
      },
      // 导航栏菜单切换
      async handleSelect (key) {
        let that = this
        if (key === '0' || key === 0) {
          // 跳转到首页
          that.ngrouter('/')
        } else if (key === '1' || key === 1) {
          // 跳转到项目大厅
          that.$router.push(`/home/projectHall`);
          this.$parent.handleClickOutside();
        } else if (key === '2' || key === 2) {
          // 跳转到预警大厅
          that.$router.push(`/home/warningHall`)
        }
        else if (key === '3' || key === 3) {
          // 跳转到1.0
          var author = window.localStorage.getItem('f2bpmAuthor');
          if (author) {
            author = eval("(" + author + ")");
            var f2bpmToken = author.token;
          }
          var res = {
            token: f2bpmToken
          }
          const {data} = await login(JSON.stringify(res))
          window.open(data);
        }
        else if (key === '4' || key === 4) {
          // 跳转到签章平台
          try {
            var resData = {
              contractId: '',
              customerName: ''
            }
            const {msg} = await yqtLogin(JSON.stringify(resData))
            window.open(msg);
          } catch (error) {
            console.log(error)
          }
        } else if (key === '5' || key === 5) {
          // 跳转到工盟平台
          try {
            const res = await gmLogin()
            window.open(res.data);
          } catch (error) {
            console.log(error)
          }
        } 
        else if (key === '6' || key === 6) {
          // 跳转到流程指引
          this.$router.push(`/flowGuide`)
          this.$parent.handleClickOutside();
        }
      },
      // 获取到项目大厅菜单权限
      getItemMenuName(){
        var that = this;
        if(localStorage.homeAuth){
          var arr = JSON.parse(localStorage.homeAuth);
          if(arr.indexOf('项目大厅(营销项目层)') !== -1 || arr.indexOf('项目大厅(工程项目层)') !== -1 || arr.indexOf('项目大厅(营销管理层)') !== -1 || arr.indexOf('项目大厅(工程管理层)') !== -1){
            that.isShowMenu = true;
          }else {
            that.isShowMenu = false;
          }
        }else{
          that.isShowMenu = false;
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .f-divider.el-divider--vertical {
    display: inline-block;
    height: 22px !important;
    margin: 0 5px;
    vertical-align: middle;
    border: solid #e9e9e9;
    border-width: 0 0 0 1px;
    position: relative;
    top: -2px;
  }

  .el-menu--horizontal > .el-menu-item {
    height: 50px;
    line-height: 50px;
  }

  .persion-work {
    height: 35px;
    display: inline-block;
    line-height: 32px;
    margin: 0 1px;
    width: auto;
    padding-left: 5px;
    padding-right: 5px;
    text-align: center;
    z-index: 999;
    margin-top: 6px;

    font-size: 16px;
    font-family: PingFang SC;
    color: #000000;
  }

  .persion-work:hover {
    background-color: #f6f6fa;
    border-radius: 5px;
  }

  .persion-work .icon {
    color: #555755;
    font-size: 22px;
    position: relative;
    top: 2px;
  }

  .head-menu .el-menu-item,
  .head-menu .el-submenu__title {
    font-size: 12px !important;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: #0d1126;
  }

  /* 顶部右边的图标色 */
  .head-menu .el-menu-item i {
    font-size: 12px;
    color: #0d1126 !important;
  }

  /*  shadow 水平位置，垂直位置，模糊距离，阴影的大小 */
  .navbar {
    height: 50px;
    min-width: 1200px; /*防止界面太小，右侧菜单坍塌*/
    position: relative;
    background: #fff;
    -webkit-box-shadow: 0 2px 8px 1px #ebecf0;
    -moz-box-shadow: 0 2px 8px 1px #ebecf0;
    box-shadow: 0px -1px 0px 0px #ebecf0;
    margin-bottom: 0;
    display: flex;
    
    .hamburger-container {
      line-height: 46px;
      height: 100%;
      float: left;
      cursor: pointer;
      transition: background 0.3s;
      -webkit-tap-highlight-color: transparent;

      &:hover {
        background: #268bff;
      }
    }

    .breadcrumb-container {
      float: left;
    }
    /* 新增 nav-left-menu 样式*/
    .nav-left-menu {
      display: inline-block;
      height: 100%;

      .nav-left-menu-content {
        display: inline-block;
        height: 100%;
        line-height: 50px;
        float: right;
      }
    }
    /*清除浮动*/
    .nav-left-menu:after {
      content: '';
      display: block;
      visibility: hidden;
      clear: both;
    }
    .right-menu {
      display: flex;
      justify-content: flex-end;
      
      // width: 50%;
      // float: right;
      height: 100%;
      line-height: 50px;
      position: absolute;
      right: 8px;

      &:focus {
        outline: none;
      }

      .divider-line {
        color: #8d8f99;
      }

      .right-menu-item {
        display: inline-block;
        padding: 0 8px;
        width: 10%;
        height: 100%;
        font-size: 18px;
        color: #5a5e66;
        vertical-align: text-bottom;
        margin-right: 0px;
        span {
          margin-right: 70% !important;
        }

        &.hover-effect {
          cursor: pointer;
          transition: background 0.3s;

          &:hover {
            background: rgba(0, 0, 0, 0.025);
          }
        }
      }
      .el-menu-item:nth-child(1) {
        // margin-left: -40%;
        // margin-right: 5%;
        // flex: 1;
        // width: 40%;
        // background-color: yellow;
      }

      .avatar-container {
        margin-right: 30px;
        margin-left: 5px;

        .avatar-wrapper {
          //margin-top: 8px;
          position: relative;

          .user-avatar {
            cursor: pointer;
            width: 28px;
            height: 28px;
            border-radius: 10px;
          }

          .el-icon-caret-bottom {
            cursor: pointer;
            position: absolute;
            right: -25px;
            top: 20px;
            font-size: 12px;
          }
        }
      }
    }
  }
</style>
