<template>
  <div id="proiectHall" class="proiectHall-container auto-window-height-select">

    <div class="topMenuBox" :class="navBarFixed == true ? 'navBarWrap' :''">
      <el-row :gutter="20">
        <div class="projectItem-menu">
              <span v-if="getWorkItemMenuRole.indexOf('项目大厅(营销项目层)') !== -1" @click="handleWorkItemMenu(0)"
                    :class="{'projectItem-menu-active':getCurrent === 0}">
              项目层(营销)
              </span>
          <span v-if="getWorkItemMenuRole.indexOf('项目大厅(工程项目层)') !== -1" @click="handleWorkItemMenu(1)"
                :class="{'projectItem-menu-active':getCurrent === 1}">
              项目层(工程)
              </span>
               <span @click="handleWorkItemMenu(4)"
                :class="{'projectItem-menu-active':getCurrent === 4}">
              项目经理
              </span>
          <span v-if="getWorkItemMenuRole.indexOf('项目大厅(营销管理层)') !== -1" @click="handleWorkItemMenu(2)"
                :class="{'projectItem-menu-active':getCurrent === 2}">
              管理层(营销)
              </span>
          <span v-if="getWorkItemMenuRole.indexOf('项目大厅(工程管理层)') !== -1" @click="handleWorkItemMenu(3)"
                :class="{'projectItem-menu-active':getCurrent === 3}">
              管理层(工程)
            </span>
          <span v-if="getWorkItemMenuRole.indexOf('项目大厅(统计数据)') !== -1" @click="handleWorkItemMenu(4)" :class="{'projectItem-menu-active':getCurrent === 4}">
              统计数据
          </span>
          <span v-if="getWorkItemMenuRole.indexOf('项目大厅(漏斗数据)') !== -1" @click="handleWorkItemMenu(5)" :class="{'projectItem-menu-active':getCurrent === 5}">
              漏斗数据
          </span>
        </div>
      </el-row>
    </div>
    <div>
      <!--项目层(营销)-->
      <div v-if="getCurrent === 0" class="mb20">
        <project-marketing @showData="showData"></project-marketing>
      </div>
      <!--项目层(工程)-->
      <div v-if="getCurrent === 1">
        <project-engineer @showData="showData"></project-engineer>
      </div>
      <!--管理层（营销）-->
      <div v-if="getCurrent === 2">
        <manage-marketing ref="mMarket"></manage-marketing>
      </div>
      <!--管理层(工程)-->
      <div v-if="getCurrent === 3">
        <manage-engineer ref="mEngineer"></manage-engineer>
      </div>
       <div v-if="getCurrent === 4">
         <project-manager v-if="getCurrent === 4" />
      </div>
      <!-- 统计数据 -->
      <!-- 漏斗数据 -->
      <funnel-table v-if="getCurrent === 5"></funnel-table>
    </div>
  </div>
</template>

<script>
  import manageEngineer from './manageEngineer';
  import projectEngineer from './projectEngineer';
  import projectMarketing from './projectMarketing';
  import manageMarketing from './manageMarketing'
  import projectManager from './projectManager.vue';
  import funnelTable from './funnel/index.vue';

  export default {
    name: "proiectHall",
    components: {
      manageEngineer, projectEngineer, projectMarketing, manageMarketing,projectManager,funnelTable
    },
    data() {
      return {
        projectItemMenu: ['项目层(营销)', '项目层(工程)','项目经理', '管理层(营销)', '管理层(工程)'],
        getCurrent: 0,
        navBarFixed: false,
        getWorkItemMenuRole: [],
        userId:''
      }
    },
  mounted() {
      this.getItemMenuName();
      this.userId = FUI.Sys.getAuthor().userId
    },
    methods: {
      // 点击切换projectItemMenu
      handleWorkItemMenu(val) {
        this.getCurrent = val;
        if (val === 3) {
          this.$nextTick(() => {
            this.$refs.mEngineer.getNowYearData();
          })

        } else if (val === 2) {
          this.$nextTick(() => {
            this.$refs.mMarket.getNowYearData();
          })
        }
      },
      showData(val) {
        this.getCurrent = Number(val);
      },
      // 获取项目大厅部分菜单权限
      getItemMenuName() {
        // var that = this;
        // if (localStorage.homeAuth) {
        //   var arr = JSON.parse(localStorage.homeAuth);
        //   that.getWorkItemMenuRole = arr;
        // }

        this.getWorkItemMenuRole = localStorage.homeAuth ? JSON.parse(localStorage.homeAuth) : [];
      }

    }
  }
</script>

<style scoped>
  @import "~@/resources/css/projechHall.css";

  #proiectHall {
    width: 100%;
    height: auto;
    /*border: 1px solid;*/
    display: block;
    position: relative;
  }

  .topMenuBox {
    width: 100%;
    height: auto;
    /*border: 1px solid;*/
    display: block;
    /*position: fixed;*/
    /*z-index: 999;*/
    background: rgb(243 248 255);
    padding-left: 20px;
    /*margin-top: -2px;*/
  }

  .contentBox {
    width: 100%;
    height: auto;
    /*border: 1px solid;*/
    margin-top: 50px;
  }
</style>
