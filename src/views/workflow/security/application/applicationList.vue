<template>
  <div class="f2bpm-page-layout">
    <el-container>
      <el-aside ref="sideLeft" class="f2bpm-page-left" style="padding-left:0;padding-right:0;" hide-trigger collapsible :width="isCollapsed?'20px':'200px'">
        <div class="f2bpm-panel-head f2bpm-panel-head-bg" style="padding-top:10px;padding-right: 5px;">
          <i class="fa fa-server fl mr10"> {{$t('add')}} </i> <i class="fa fa-plus fr cur" @click="eidtApplicationGroup('Add')">{{$t('add')}}</i>
        </div>
        <ul class="ul-nav">
          <li><a href="javascript:void(0)" :class="searchParams.applicationGroupKey==''?'selected':''" name="all" @click="changeGroup('')"><i class="fa fa-home"></i>{{$t('all')}}</a></li>
          <li v-for="group in groupData" @mouseenter="enters('item_'+group.groupId)" @mouseleave="leaver('item_'+group.groupId)">
            <a href="javascript:void(0)" :class="searchParams.applicationGroupKey==group.groupKey?'selected':''" @click="changeGroup(group.groupKey)">{{ group.groupTitle }}</a>
            <span :id="'item_'+group.groupId" class="fr group-item-btns"><i class="fa fa-edit cur  mr5" @click="eidtApplicationGroup('Edit',group.groupId)" /> <i class="fa fa-trash-o cur  mr5" @click="deleteGroup(group.groupTitle,group.groupId)" /></span>
          </li>
        </ul>
      </el-aside>
      <el-main class="f2bpm-page-right" :style="'height:'+countPageHeight+'px'">
        <div style=" padding: 0px; width: 100%; height: 100%; border: 0px;">
          <div id="gridSearch" class="grid-search-form">
            <div id="grid-search-form-list" class="grid-search-form-list">
              <ul>
                <li><label>{{$t('pageInfo.applicationName')}} </label>
                  <el-input v-model="searchParams.applicationName" size="small" clearable class="textBoxShort" />
                </li>
                <li><label>{{$t('remark')}}</label>
                  <el-input v-model="searchParams.remarks" size="small" clearable class="textBoxShort" />
                </li>
                <li style="margin-left: 5px; line-height: 20px;">
                  <el-button size="small" type="primary" role="button" @click="dataGridSearch()"><i class="fa fa-search" />{{$t('search')}}
                  </el-button>
                  <el-button size="small" @click="editApplication('Add')"><i class="fa fa-plus" />{{$t('add')}}
                  </el-button>
                </li>
              </ul>
            </div>
          </div>
          <div id="containDiv" class="application-manager">
            <div v-for="item in data" class="applicationbox" @mouseenter="enters('item_'+item.applicationId)" @mouseleave="leaver('item_'+item.applicationId)">
              <div>
                <span class="application-item cur" :style="appBoxStyle(item)" :title="item.remarks" @click="openApplication(item)">
                  <span :style="'font-size:'+item.fontSize+'px;'" :class="item.icon" />
                </span>
              </div>
              <div class="applicationbox-title"><span> {{ item.applicationName }}</span>
              </div>
              <div :id="'item_'+item.applicationId" class="applicationbox-action">
                <a class="sample-btn" title="编辑" href="javascript:void(0)" @click="editApplication('Edit',item.applicationId)">
                  <li class="fa fa-edit"> {{$t('edit')}}</li>
                </a>
                <a class="sample-btn" title="编辑" href="javascript:void(0)" @click="deleteApplication(item.applicationName,item.applicationId)">
                  <li class="fa fa-trash-o"> {{$t('delete')}}</li>
                </a>
                <a class="sample-btn" target="_blank" @click="publicAuthor(item.applicationId,item.applicationName)">
                  <li class="fa fa-cog"> {{$t('permission')}}</li>
                </a>
                <a class="sample-btn" target="_blank" @click="openApplication(item)">
                  <li class="fa fa-cog"> {{$t('manage')}}</li>
                </a>
              </div>
            </div>
          </div>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script>

  export default {
    data() {
      return {
        language: "",
        isCollapsed: false,
        dg: {},
        loading: false,
        data: [],
        groupData: [],
        tableColumn: [],
        searchParams: {
          applicationName: '',
          remarks: '',
          applicationGroupKey: ''
        }
      };
    }, computed: {
      appBoxStyle() {
        return function (data) {
          var style = 'background-image: linear-gradient(' + data.color + ',' + data.color2 + ' 95%);';
          if (data.width > 0) {
            style += 'width:' + data.width + 'px;';
          }
          if (data.height > 0) {
            style += 'height:' + data.height + 'px;';
          }
          return style;
        };
      },
      countPageHeight() {
        return $(document).height() - 60;
      },
      rotateIcon() {
        return this.isCollapsed ? 'icon icon-arrow-right-bold cur' : 'icon icon-arrow-left-bold cur';
      },
      positionIcon() {
        return this.isCollapsed ? 'cursor:pointer; position: relative;left: -5px;' : 'cursor:pointer; position: relative;left: 100px;';
      }
    },
    watch: {
      treeFilterText(val) {
        this.$refs.mytree.filter(val);
      }
    },

    mounted() {

    },
    created() {
      var that = this;
      that.language = that.$store.state.app.language;
      var categoryCode = Object.toQueryString('categoryCode') || '';
      var appName = Object.toQueryString('appName') || '';
      var appId = Object.toQueryString('appId') || '';
      that.searchParams.categoryCode = categoryCode;
      that.searchParams.appName = appName;
      that.searchParams.appId = appId;
      this.loadGroup();
      that.dataGridSearch();
      window.myvm = that;
    },
    mounted() {
    },

    methods: {
      enters(key) {
        $('#' + key).show();
      },
      leaver(key) {
        $('#' + key).hide();
      },
      collapsedSider() {
        this.isCollapsed = !this.isCollapsed;
      },
      closeEdit() {
        FUI.Window.closeEdit();
      },
      // 刷新列表
      refreshGrid(parentGridId, parm) {
        var that = this;
        that.dataGridSearch();
        that.loadGroup();
      },
      dataGridReSet() {

      },
      dataGridSearch() {
        this.getGridData();
      },
      changeGroup(groupKey) {
        var that = this;
        that.searchParams.applicationGroupKey = groupKey;
        that.dataGridSearch();
      },
      getGridData() {
        var that = this;
        var parms = that.searchParams;
        var res = Object.toAjaxJson('/workflow/security/application/', 'getList', parms);
        that.data = res.data;
      },
      loadGroup() {
        var that = this;
        var res = Object.toAjaxJson('/workflow/security/application/', 'getListAppLicationGroup');
        if (res.success) {
          that.groupData = res.data;
        } else {
          FUI.Window.showMsg(res.msg);
        }
      },
      deleteGroup(name, groupId) {
        var that = this;
        FUI.Window.confirm('您确定要删除分组【' + name + '】?', null, function () {
          var res = Object.toAjaxJson('/workflow/security/application/', 'deleteGroup', { groupId: groupId });
          if (res.success) {
            that.loadGroup();
          } else {
            FUI.Window.showMsg(res.msg);
          }
        });
      },
      deleteApplication(name, applicationId) {
        var that = this;
        FUI.Window.confirm('您确定要删除应用【' + name + '】?', null, function () {
          var res = Object.toAjaxJson('/workflow/security/application/', 'deleteApplication', { applicationId: applicationId });
          if (res.success) {
            that.dataGridSearch();
          } else {
            FUI.Window.showMsg(res.msg);
          }
        });
      },
      eidtApplicationGroup(formAction, keyId) {
        var that = this;
        keyId = keyId || '';
        var url = '/workflow/security/application/applicationGroupEdit/';
        var title = formAction == FUI.FormAction.Add ? '新增分组' : '编辑分组';
        FUI.Window.openEdit(url, title, formAction, 'grid', 700, 450, null, 'f2bpm_sys_application_group', keyId);
      },
      editApplication(formAction, keyId) {
        var that = this;
        keyId = keyId || '';
        var url = '/workflow/security/application/applicationEdit/';
        var title = formAction == FUI.FormAction.Add ? '新增应用' : '编辑应用';
        FUI.Window.openEdit(url, title, formAction, 'grid', 700, 550, null, 'f2bpm_sys_application', keyId);
      },
      openApplication(item) {
        var that = this;
        var applicationId = item.applicationId;
        var applicationName = item.applicationName;
        // 关闭左侧系统导航
        that.handleClickOutside();
        var url = '/workflow/security/application/applicationHome?design=true&applicationId=' + applicationId;
        that.$router.push(url);
      },
      handleClickOutside() {
        this.$store.dispatch('app/closeSideBar', {
          withoutAnimation: false
        });
      },
      publicAuthor(key, title) {
        var publicAuthorUrl = FUI.Handlers.PublicAuthorHandler;
        var that = this;
        FUI.Window.openEdit(publicAuthorUrl + 'publicAuthorEdit/?authorizeType=Application&entityKey=' + key, '设置【' + title + '】发布范围', 'Edit', null, 890, 550, null, null, key, false);
      }
    }

  }
</script>
<style>
  .application-manager {
    border: 0px;
    overflow: auto;
    border-top: 1px solid #e3e3e3;
    padding: 15px;
  }

  .application-manager .applicationbox {
    display: inline-block;
    vertical-align: middle;
    text-align: center;
    width: 194px;
    height: 140px;
    margin: 8px;
    padding-top: 20px;
    border: 0px solid #e3e3e3;
  }

  .application-manager .applicationbox:hover {
    background-color: #fcfcfc;
    border: 1px solid #e3e3e3;
    -webkit-border-radius: 6px;
    -moz-border-radius: 6px;
    border-radius: 6px;
    -webkit-box-shadow: 2px 2px 3px rgba(0, 0, 0, 0.05);
    -moz-box-shadow: 2px 2px 3px rgba(0, 0, 0, 0.05);
    box-shadow: 2px 2px 3px rgba(0, 0, 0, 0.05);
  }

  .application-manager .applicationbox-title {
    padding: 15px;
    font-size: 14px;
  }

  .application-manager .applicationbox-action {
    display: none;
    text-align: center;
    width: 100%;
    padding: 0 3px 5px 3px;
  }

  .application-manager .applicationbox-action .sample-btn {
    padding: 3px !important;
    line-height: 100% !important;
    border-radius: 2px !important;
    color: #8b8b8b !important;
  }

  .application-manager .applicationbox-action li:hover {
    color: #f7910c;
  }

  .group-item-btns {
    position: relative;
    top: -1px;
    right: 5px;
    display: none;
  }
</style>