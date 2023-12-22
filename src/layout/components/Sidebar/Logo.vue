<template>
  <div
    class="sidebar-logo-container cur"
    :class="{'collapse':collapse}"
    @click="ngrouter('/')"
  >
    <transition name="sidebarLogoFade">
      <div
        v-if="collapse"
        key="collapse"
        class="sidebar-logo-link"
      >
        <!--关闭时-->
        <div v-if="sys.sysAliasName=='F2BPM'">
          <div style="margin-top: 10px">
            <i class="icon-logo-f2-blue  font26 icomoon icomoon-tu2 mr4" />
          </div>
        </div>
        <div
          v-else
          class="logo-div"
          style="text-align: center;width:45px;"
        >
          <img
            :src="custLogUrl"
            :width="logoWidth+'px'"
            style="vertical-align:middle;"
          >
        </div>
      </div>
      <div
        v-else
        key="expand"
        class="sidebar-logo-link"
        style="display: inline-block; text-align: left;  padding-left: 10px;line-height: 50px;  "
      >
        <div v-if="sys.sysAliasName=='F2BPM'">
          <div style="float: left;margin-top:6px">
            <i class="icomoon icomoon-tu2 icon-logo-f2-blue font24 mr4" />
            <i class="icomoon icomoon-f2 icon-logo-f2-blue font23  mr4  " />
            <i class="icomoon icomoon-bpm icon-logo-f2-blue font23" />
          </div>
        </div>
        <div v-else>
          <div class="logo-div">
            <img
              :src="custLogUrl"
              :width="logoWidth+'px'"
              style="vertical-align:middle; "
            >
            <span
              class="cust-sidebar-title"
              :style="sysStyle"
            >{{ title }}</span>
          </div>
        </div>
      </div>

    </transition>
  </div>
</template>

<script>
export default {
  name: "SidebarLogo",
  props: {
    collapse: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      sysStyle: "",
      sys: {},
      title: "",
      custLogUrl: "",
      logoWidth: 50,
    };
  },

  created() {
    var that = this;
    that.loadf2bpmSysConfig();
    this.sys = this.$store.state.app.sysConfig;
    var logoUrl = this.$store.state.app.sysConfig.logoUrl;
    this.logoWidth = this.$store.state.app.sysConfig.logoWidth - 5;
    that.title = this.sys.sysAliasName;
    if (logoUrl) {
      var arr = eval("(" + logoUrl + ")");
      var item = arr[0];
      that.custLogUrl =
        __serverpath +
        FUI.Handlers.Common +
        "getShowImage/?pathType=logo&groupName=" +
        item.groupName +
        "&filePath=" +
        item.filePathName;
    }
    var porperties = that.sys.porperties;
    if (porperties) {
      var porpertiesObj = eval("(" + porperties + ")");
      var style = "";
      if (porpertiesObj.sysTitleFontColor) {
        style += "color:" + porpertiesObj.sysTitleFontColor + ";";
      }
      if (porpertiesObj.sysTitleFontSize) {
        style += "font-size:" + porpertiesObj.sysTitleFontSize + "px;";
      }
      that.sysStyle = style;
    }
  },
  methods: {
    loadf2bpmSysConfig() {
      var that = this;
      var f2bpmSysConfig = localStorage.getItem("f2bpmSysConfig");
      if (!f2bpmSysConfig) {
        var resData = Object.toAjaxJson(
          "/login/",
          "getLoginPageData",
          null,
          false,
          null,
          function (resData) {
            if (resData.success) {
              that.sys = resData.data;
              that.sys.logoUrl = that.sys.logoUrl;
              f2bpmSysConfig = JSON.stringify(that.sys);
              localStorage.setItem("f2bpmSysConfig", f2bpmSysConfig);
              that.$store.dispatch("app/setSysConfig", f2bpmSysConfig);
            } else {
              FUI.Window.showMsg(resData.msg);
            }
          }
        );
      }
    },
    ngrouter(url) {
      this.$parent.ngrouter("/");
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~@/resources/logo/logo.css";
@import "~@/resources/logo/style.css";

.logo-div {
  display: table-cell;
  vertical-align: middle;
  text-align: left;
  height: 50px;
}

.cust-sidebar-title {
  margin: 0;
  margin-left: 4px;
  color: #ff6a00;
  vertical-align: middle;
  font-weight: 600;
  height: 50px;
  font-size: 18px;
  font-family: Avenir, Helvetica Neue, Arial, Helvetica, sans-serif;
}

.sidebarLogoFade-enter-active {
  transition: opacity 1.5s;
}

.sidebarLogoFade-enter,
.sidebarLogoFade-leave-to {
  opacity: 0;
}

.sidebar-logo-container {
  margin-right: 3px;
  z-index: 999999;
  float: left;
  display: inline-block;
  height: 50px;
  line-height: 50px;
  background: #ffffff;
  text-align: center;
  overflow: hidden;

  & .sidebar-logo-link {
    height: 100%;
    width: 100%;
    padding-left: 3px;

    & .sidebar-logo {
      //width:60px;
      height: 35px;
      vertical-align: middle;
      margin-right: 12px;
    }

    & .sidebar-logo-min {
      width: 45px;
      vertical-align: middle;
      margin-right: 12px;
    }

    & .sidebar-title {
      display: inline-block;
      margin: 0;
      margin-left: 4px;
      color: #fff;
      font-weight: 600;
      /* line-height: 50px; */
      font-size: 18px;
      font-family: Avenir, Helvetica Neue, Arial, Helvetica, sans-serif;
      /* vertical-align: middle; */
    }
  }

  &.collapse {
    .sidebar-logo {
      margin-right: 0px;
    }
  }
}
</style>