<template>
  <section id="appMain" class="app-main">
    <div class="navigationTabs">
      <navigation-tabs />
    </div>
    <transition name="fade-transform" mode="out-in">
      <router-view :key="key" />
      <!-- <keep-alive v-if="$route.meta.keepAlive">
        <router-view></router-view>
      </keep-alive>
      <router-view v-if="!$route.meta.keepAlive"></router-view> -->
    </transition>
  </section>
</template>

<script>
import navigationTabs from "./navigationTabs";
export default {
  name: "AppMain",
  // 注册组件
  components: {
    navigationTabs,
  },
  data() {
    return {
      tabsList: []
    };
  },
  computed: {
    key() {
      // console.log(this.$route.path, "this.$route.path1111111");
      // console.log(this.$route.meta.name, "this.$route222222");
      return this.$route.path;
    },
  },
  mounted() {
    window.addEventListener("scroll", this.handleScroll);
  },
  methods: {
    handleScroll() {
      console.log(document.getElementById("appMain").scrollHeight, "滚动高度");
    },
  },
};
</script>

<style scoped>
.app-main {
  /*50 = navbar  */
  min-height: calc(100vh - 50px);
  /*width: 100%;*/
  position: relative;
  overflow: auto;
  min-width: 1400px;
}
.fixed-header + .app-main {
  padding-top: 50px;
}
.toTop {
  width: 45px;
  height: 45px;
  border: 1px solid;
}
</style>

<style lang="scss">
.el-popup-parent--hidden {
  .fixed-header {
    padding-right: 15px;
  }
}
.navigationTabs {
  display: flex;
}
</style>
