<template>
  <div class="loginIndex">
    <el-container>
      <el-header>
        <div class="logo-container">
          <div v-if="sys.sysAliasName == 'F2BPM'">
            <i class="icon-logo-f2-blue font24 icomoon icomoon-tu2 mr4 " />
            <!-- <i class="icon-logo-f2 font36 icon icon-tu mr4"  ></i> -->
            <i class="icon-logo-f2-blue font23 icomoon icomoon-f2" />
            <i class="icon-logo-bpm-blue font23 icomoon icomoon-bpm" />
            <i class="fa fa-registered" style="position: absolute;top:28px;left: 200px;font-size: 8px;color: #2878ef" />
            <!-- <el-divider direction="vertical" class="logo-divider" /> -->

          </div>
          <div v-else style="line-height: 60px;margin-top:10px;">
            <img :src="custLogUrl" :width="sys.logoWidth + 'px'">
            <!-- <span class="login-cust-logo-title" :style="sysStyle" v-html="sys.sysName" /> -->
          </div>
        </div>
        <!--<div class="site-div">-->
        <!--<span v-if="language=='en-US'" @click="switchLanguage('zh-CN')" class="mr10 cur" style="color:#0D1126;font-size:14px;" title="切换到中文"> 中文</span>-->
        <!--<span v-if="language=='zh-CN'" @click="switchLanguage('en-US')" class="mr10 cur" style="color:#0D1126;font-size:14px;" title="switch to english"> English</span>-->
        <!--<a href="http://www.f2bpm.com" target="_blank" style="font-family: Microsoft YaHei;color: #006EFF;font-size:14px;"> <i class="fa fa-home" />访问官网</a>-->
        <!--</div>-->
      </el-header>
      <el-main class="login-container">
        <div class="login-box">
          <!--<div class="login-box-inner-left">-->
          <!--<div style="color: #fff;line-height: 20px;padding: 15px;text-align: left;">-->
          <!--<span v-html="sys.serviceHotline" />-->
          <!--</div>-->
          <!--</div>-->
          <el-form
            ref="refForm"
            :model="user"
            :rules="loginRules"
            class="login-form"
            auto-complete="on"
            label-position="left"
          >
            <div class="title-container">
              <span class="logo-title" v-html="sys.sysName"></span>
              <!-- <h3 class="title login-welcomeLogin">{{ $t('login.welcomeLogin') }}</h3> -->
            </div>
            <el-tabs v-model="loginType" @tab-click="switchLogin">
              <el-tab-pane label="账号密码" name="pwd">
                <div class="login-content">
                  <el-form-item v-if="sys.isMultiTenant" prop="tenantId" style="height: 41px;">
                    <span class="svg-container">
                      <i class="icon icon-zhanghaoxinxiuser"></i>
                    </span>
                    <el-input
                      ref="tenantId"
                      v-model="user.tenantId"
                      clearable
                      :placeholder="$t('login.tenantTip')"
                      name="tenantId"
                      type="text"
                      tabindex="1"
                      auto-complete="on"
                    />
                  </el-form-item>
                  <el-form-item prop="userName" style="height: 41px;">
                    <span class="svg-container">
                      <i class="icon icon-zhanghao"></i>
                    </span>
                    <el-input
                      ref="userName"
                      v-model="user.userName"
                      clearable
                      :placeholder="$t('login.accountTip')"
                      name="userName"
                      type="text"
                      tabindex="1"
                      auto-complete="on"
                    />
                  </el-form-item>
                  <el-form-item prop="password" style="height: 41px;line-height: 41px;">
                    <span class="svg-container">
                      <i class="icon icon-mima"></i>
                    </span>
                    <el-input
                      :key="passwordType"
                      ref="password"
                      v-model="user.password"
                      :type="passwordType"
                      :placeholder="$t('login.passwordTip')"
                      name="password"
                      tabindex="2"
                      auto-complete="on"
                      @keyup.enter.native="login"
                    />
                    <span class="show-pwd" @click="showPwd">
                      <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
                    </span>
                  </el-form-item>
                  <el-form-item
                    v-if="sys.isLoginVerifyCheckCode"
                    style="border: 0px;height: 41px;background-color: #FFFFFF;"
                  >
                    <div class="validate-input">
                      <el-input
                        v-model="user.validateCode"
                        style="border: 1px;"
                        clearable
                        :placeholder="$t('login.validateCodeTip')"
                        auto-complete="off"
                        @keyup.enter.native="login"
                      />
                    </div>
                    <img
                      id="ValidateCodeImg"
                      :src="validateCodeSrc"
                      style="cursor: pointer;margin-top: 4px;"
                      alt="点击刷新"
                      onclick="this.src=this.src+'&';"
                    >
                  </el-form-item>
                  <el-button
                    :loading="loading"
                    :disabled="isDisabled"
                    type="primary"
                    class="login-button"
                    @click.native.prevent="login"
                  >{{ $t('login.logon') }}
                  </el-button>
                </div>
              </el-tab-pane>
              <!-- <el-tab-pane label="微信登录" name="wechat">
                <div class="login-content">

                </div>
              </el-tab-pane> -->
              <el-tab-pane label="钉钉登录" name="dingding">
                <div v-loading="loading" class="login-content login-dingding">
                  <div id="logindingding"></div>
                </div>
              </el-tab-pane>
            </el-tabs>
          </el-form>
        </div>
      </el-main>
      <el-footer class="login-footer">
        <div v-html="sys.copyRight"></div>
      </el-footer>
    </el-container>
  </div>
</template>

<script>

import { encrypt, decrypt } from '@/utils/crypto-js.js';
import dingTalkApi from '@/Api/login/dingTalk';
// import cookis from "@/utils/cookie.js";

export default {
  name: 'Login',
  data() {
    const validateuserName = (rule, value, callback) => {
      if (value.length <= 0) {
        callback(new Error('请输入登录账号'));
      } else {
        callback();
      }
    };
    const validatePassword = (rule, value, callback) => {
      if (value.length <= 0) {
        callback(new Error('请输入登录密码'));
      } else {
        callback();
      }
    };
    return {
      language: '',
      sysStyle: '',
      custLogUrl: '',
      isDisabled: true,
      validateCodeSrc: '',
      loginType: 'pwd',
      sys: { isMultiTenant: false, isLoginVerifyCheckCode: false },
      user: {
        vCodeKey: '',
        validateCode: '',
        loginType: 'pc',
        tenantId: '',
        userName: '',
        password: '',
        corpId: 'AppDefault'
      },
      loginRules: {
        userName: [
          { required: true, trigger: 'blur', validator: validateuserName }
        ],
        password: [
          { required: true, trigger: 'blur', validator: validatePassword }
        ]
      },
      loading: false,
      passwordType: 'password',
      redirect: undefined
    };
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect;
      },
      immediate: true
    }
  },
  created() {
    var that = this;
    var err = Object.toQueryString('err') || '';
    if (err == '112') {
      FUI.Window.showMsg('账号在另一处登录，您已被下线，如有疑问请联系管理员或重新登录。');
    }
    var language = this.$store.state.app.language;
    that.language = language;
    that.user.vCodeKey = 'ValidateCode_' + Object.toDateFormatDate(new Date(), 'yyyy-MM-dd-hh') + '_' + Object.toGuid();
    that.validateCodeSrc = __serverpath + '/login/validateCode/?vCodeKey=' + that.user.vCodeKey;

    that.$store.dispatch('user/removeAuthor', 'all');
    that.$store.dispatch('app/removeCurrMenuId');
    var f2bpmSysConfig = sessionStorage.getItem('f2bpmSysConfig');
    if (!f2bpmSysConfig) {
      var resData = Object.toAjaxJson('/login/', 'getLoginPageData', null, true, null,
        function(resData) {
          if (resData.success) {
            that.sys = resData.data;
            that.sys.logoUrl = that.sys.logoUrl;
            if (that.sys.logoUrl) {
              var arr = eval('(' + that.sys.logoUrl + ')');
              var item = arr[0];
              that.custLogUrl = __serverpath + FUI.Handlers.Common + 'getShowImage/?pathType=logo&groupName=' + item.groupName + '&filePath=' + item.filePathName;
            }
            f2bpmSysConfig = JSON.stringify(that.sys);
            sessionStorage.setItem('f2bpmSysConfig', f2bpmSysConfig);
            that.$store.dispatch('app/setSysConfig', f2bpmSysConfig).then(() => {
              that.isDisabled = false;
            });
            that.loadSys();
          } else {
            FUI.Window.showMsg(resData.msg);
          }
        }
      );
    } else {
      that.sys = eval('(' + f2bpmSysConfig + ')');
      that.sys.logoUrl = that.sys.logoUrl;
      that.$store.dispatch('app/setSysConfig', f2bpmSysConfig).then(() => {
        that.isDisabled = false;
      });
    }
  },
  mounted() {
  },
  methods: {
    loadValidateCode() {
      var that = this;
      that.validateCodeSrc = that.validateCodeSrc + '&ram=' + Object.toGetCurrentDateTimeMillisecond();
    },
    loadSys() {
      var that = this;
      var porperties = that.sys.porperties;
      if (porperties) {
        var porpertiesObj = eval('(' + porperties + ')');
        var style = '';
        if (porpertiesObj.loginTitleFontColor) {
          style += 'color:' + porpertiesObj.loginTitleFontColor + ';';
        }
        if (porpertiesObj.loginTitleFontSize) {
          style += 'font-size:' + porpertiesObj.loginTitleFontSize + 'px;';
        }
        that.sysStyle = style;
      }
      $('title').html(that.sys.sysName);
    },
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = '';
      } else {
        this.passwordType = 'password';
      }
      this.$nextTick(() => {
        this.$refs.password.focus();
      });
    },
    validateForm(refFormName) {
      // stand:表单校验
      var success = false;
      this.$refs[refFormName].validate((valid) => {
        success = valid;
      });
      return success;
    },
    switchLanguage(name) {
      this.$store.dispatch('app/toggleLanguage', name);
      window.location.reload();
    },
    login: function() {
      var that = this;
      var user = that.user;
      if (that.sys.isMultiTenant == true && !that.user.tenantId) {
        FUI.Window.showMsg2(that, '请输入租户号', '', 'error');
        return false;
      }
      if (user.userName === '' || user.password === '') {
        FUI.Window.showMsg2(that, '请输入账号、密码', '', 'error');
        return false;
      }
      if (that.sys.isLoginVerifyCheckCode && that.user.validateCode == '') {
        FUI.Window.showMsg2(that, '请输入验证码', '', 'error');
        return false;
      }
      that.loading = true;
      var user = Object.toDeepClone(that.user);
      var integration = {};
      if (localStorage.integration) integration = JSON.parse(localStorage.integration);
      var colneUser = Object.assign({}, user, integration);
      colneUser.password = encrypt(colneUser.password);
      try {
        var resData = Object.toAjaxJson(
          '/login/',
          'loginByAndPassword',
          colneUser, true, null,
          function(result) {
            that.loading = false;
            if (result.success) {
              var authorStr = JSON.stringify(result.data);
              // 关闭侧边导航
              that.$store.dispatch('app/closeSideBar', {
                withoutAnimation: false
              });
              that.$store.dispatch('user/setAuthor', authorStr)
                .then(() => {
                  that.$router.push({ path: that.redirect || '/' });
                  that.loading = false;
                  // 清除缓存按钮数据
                  clearFieldCache()
                })
                .catch(() => {
                  that.loading = false;
                });
              that.getRoleList();
              localStorage.setItem('isLogin', true)
            } else {
              FUI.Window.showMsg2(that, result.msg);
              that.loadValidateCode();
            }
          }
        );
      } catch (e) {
        that.loading = false;
        FUI.Window.showMsg('请求异常' + e.toString());
      }
    },
    // 获取角色权限
    getRoleList() {
      var that = this;
      var getUserId = that.$store.state.user.author.userId;
      $.extendAjax(`/projecthall/marketingmanage/isCorrespondingRoles?userId=${getUserId}`, '', 'get', function (d) {
        if (d.data) {
          let menu = [];
          d.data.forEach(x => {
            menu.push(x.roleName);
          });
          // if (!menu.includes('漏斗数据')) {
          //   menu.push('项目大厅(漏斗数据)');
          // }
          localStorage.setItem('homeAuth', JSON.stringify(menu));
        } else { 
          localStorage.setItem('homeAuth', '');
        }
      })
    },
    async switchLogin(tab, event) {
      if (tab.name = 'dingding') {
        var dingdingConfig;
        if (localStorage.dingdingConfig) dingdingConfig = JSON.parse(localStorage.dingdingConfig);
        if (!dingdingConfig) {
          var res = await dingTalkApi.getQRCodeParam();
          if (res.success) {
            dingdingConfig = res.data;
            localStorage.setItem('dingdingConfig', JSON.stringify(dingdingConfig));
          }
        }
        if (dingdingConfig) {
          window.DTFrameLogin(
            {
              id: 'logindingding',
              width: 280,
              height: 280
            },
            {
              redirect_uri: encodeURIComponent(dingdingConfig.redirectUri),
              client_id: dingdingConfig.appKey,
              scope: 'openid',
              response_type: 'code',
              state: dingdingConfig.state,
              prompt: 'consent'
            },
            (loginResult) => {
              const { redirectUrl, authCode, state } = loginResult;
              // 这里可以直接进行重定向
              window.location.href = redirectUrl;
            },
            (errorMsg) => {
              // 这里一般需要展示登录失败的具体原因
              FUI.Window.showMsg(`钉钉配置出错: ${errorMsg}`);
            }
          );
        }
      }
    }

    // dingdingLogin(code) {
    //   var that = this;
    //   that.loading = true;
    //   try {
    //     $.extendAjax(`/login/dingTalkLogin/auth?code=` + code, '', "get", function (result) {
    //       that.loading = false;
    //       if (result.success) {
    //         var authorStr = JSON.stringify(result.data);
    //         // 关闭侧边导航
    //         that.$store.dispatch("app/closeSideBar", {
    //           withoutAnimation: false,
    //         });
    //         that.$store
    //           .dispatch("user/setAuthor", authorStr)
    //           .then(() => {
    //             that.$router.push({ path: that.redirect || "/" });
    //           });
    //         that.getRoleList();
    //       } else {
    //         FUI.Window.showMsg(that, result.msg);
    //         that.loadValidateCode();
    //         that.$router.push(`/login`);
    //       }
    //     });
    //   } catch (e) {
    //     that.loading = false;
    //     FUI.Window.showMsg("请求异常" + e.toString());
    //   }
    // }
  }
}
</script>

<style lang="scss">
@import "~@/resources/css/login.css";
@import "~@/resources/logo/logo.css";
@import "~@/resources/logo/style.css";

$bg: #ffffff;
$light_gray: #fff;
$cursor: #333;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    background: #fafbff;
  }
}

/* reset element-ui css */
.login-container {
  /* 垂直居中 */
  display: flex;
  align-items: center;

  .el-input {
    display: inline-block;
    height: 40px;
    width: 88%;

    input {
      background: #fafbff;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      color: #8d8f99;
      height: 37px;
      padding-right: 15px;
      /*鼠标光标色 */
      caret-color: #333;

      /* 填有值时的背景 */
      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px #fafbff inset !important;
        -webkit-text-fill-color: #8d8f99 !important;
      }

      &:-webkit-input-placeholder {
        color: #8d8f99;
        font-size: 14px;
      }
    }
  }

  .el-form-item {
    background: #fafbff;
    border: 1px solid #dde2f0;
    border-radius: 3px;
  }

  .el-tabs__nav-wrap {
    padding: 0 20px;
    line-height: 40px;
  }

  .el-tabs__item {
    font-size: 14px;
    color: #666;
  }

  .el-tabs__item.is-active {
    color: #006EFF;
  }

  .el-tabs__header {
    margin-bottom: 0px;
  }
}
</style>

<style lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #666;

.login-container {
  /* min-height: 100%; */
  width: 100%;
  overflow: auto;

  .validate-input {
    width: 150px;
    float: left;
    background: #fafbff;
    border: 1px solid #dde2f0;
    border-radius: 3px;
    color: #454545;
  }

  // .login-form {
  //   width: 400px;
  //   padding-left: 60px;
  //   padding-right: 60px;
  //   padding-top: 40px;
  //   padding-bottom: 40px;
  // }
  .logo-title {
    line-height: 50px;
    height: 50px;
    display: block;
    color: #fff;
  }

  .login-content {
    width: 400px;
    padding: 35px;
    height: 323.8px;
  }

  .login-dingding {
    padding: 20px;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    color: #5e5f66;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    text-align: center;
    background-color: #368dff;
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 1px;
    font-size: 14px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;

  }
}
</style>
