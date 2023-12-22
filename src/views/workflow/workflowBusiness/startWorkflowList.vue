<template>
  <div class="f2bpm-page-layout">
    <el-container>
      <el-aside ref="sideLeft" class="f2bpm-page-left" hide-trigger collapsible :width="isCollapsed?'20px':'200px'">
        <div class="f2bpm-panel-head">
          <div v-if="!isCollapsed" class="f2bpm-left-search-div">
            <el-input v-model="treeFilterText" class="left-htead-treeFilterText-box" size="small" clearable :placeholder="$t('enterKey')" autocomplete="off" prefix-icon="el-icon-search" />
          </div>
          <div class="f2bpm-left-search-button-div">
            <i v-if="!isCollapsed" :title="$t('refresh')" class="icon icon-shuaxin  cur mr10 font12  " @click="loadTree()"></i>
            <i title="收起/展开" :class="rotateIcon" @click="collapsedSider" />
          </div>
        </div>

        <div v-if="!isCollapsed" class="auto-window-height  f2bpm-page-left-content">
          <span class="fa fa-home cur ml10 font12 " @click="showAll()">{{$t('all')}}</span>
          <el-tree ref="mytree" style="font-size: 12px" :data="treeData" :filter-node-method="filterTreeNode" :expand-on-click-node="false" default-expand-all @node-click="onTreeSelected" />
        </div>
      </el-aside>
      <el-main class="auto-window-height f2bpm-page-right">
        <div style=" padding: 0px; width: 100%; height: 100%; border: 0px;">
          <div id="gridSearch" class="grid-search-form">
            <div id="grid-search-form-list" class="grid-search-form-list">
              <ul>
                <li><label>{{$t('workstation.appId')}} ：</label>
                  <el-input id="appId" v-model="searchParams.appId" size="small" clearable class="textBoxShort" name="appId" />
                </li>
                <li><label>{{$t('workstation.appName')}}：</label>
                  <el-input id="appName" v-model="searchParams.appName" size="small" clearable class="textBoxShort" name="appName" />
                </li>
                <li style="margin-left: 5px; line-height: 20px;">

                  <el-button size="small" type="primary" role="button" @click="loadData()"><i class="fa fa-search" />{{$t('search')}}
                  </el-button>
                  <el-button size="small" @click="reSetSearch()"><i class="fa fa-undo" />{{$t('reset')}}
                  </el-button>
                </li>
              </ul>
            </div>
          </div>
          <div id="containDiv" style="border: 0px; overflow: auto; border-top: 1px solid #e3e3e3;">
            <div v-for="(item,index) in data" class="appbox" :key="index">
              <div class="appbox-descript"><span :title="item.title">【{{ item.appId }}】{{ langTitle(item) }}</span>
              </div>
              <div class="appbox-action">
                <a class="map-btn" title="查看流程图" href="#" @click="showWorkflowMap(item.appId,item.workflowId);return false;">
                  <i class="icon icon-ziliucheng"></i> {{$t('wfgrid.procMap')}}
                </a>
                <a class="start-btn" :title="'发起流程'+item.title+'； '+item.description" target="_blank" @click="openWorkflowfrom(item)">
                  <i class="icon icon-yewuliufaqi"> </i> {{$t('workstation.start')}}
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
import api from '@/Api/home/workSpace';

  export default {
    data() {
      return {
        language: "",
        treeFilterText: '',
        // ======stand:标准区=============
        isCollapsed: false,
        // ==data grid====
        dg: {},
        loading: false,
        data: [],
        treeData: [],
        tableColumn: [],
        // ===========标准区结束==========
        searchParams: {
          categoryCode: '',
          appId: '',
          appName: ''
        }
      };
    }, computed: {
      langTitle() {
        return function (item) {
          var enTitle =  item.appAlias||"";
          if (enTitle == "" || enTitle == null) {
            enTitle = item.title;
          }
          var zhTitle = item.title;
          return this.language == 'en-US' ? enTitle : zhTitle;
        };
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
    created() {
      var that = this;
      that.language = that.$store.state.app.language;
      var categoryCode = Object.toQueryString('categoryCode') || '';
      var appName = Object.toQueryString('appName') || '';
      var appId = Object.toQueryString('appId') || '';
      that.searchParams.categoryCode = categoryCode;
      that.searchParams.appName = appName;
      that.searchParams.appId = appId;
      this.loadTree();
      that.loadData();
    },
    mounted() {
      window.autoPageHeight();
    },

    methods: {
      collapsedSider() {
        this.isCollapsed = !this.isCollapsed;
      },
      closeEdit() {
        FUI.Window.closeEdit();
      },
      dataGridReSet() {
        var that = this;
        $.each(this.searchParams, function (key, item) {
          that.searchParams[key] = '';
        });
        // 重置查询
        this.dataGridSearch();
      },
      filterTreeNode(value, data) {
        if (!value) return true;
        return data.title.indexOf(value) !== -1;
      },
      reSetSearch() {
        this.searchParams.categoryCode = '';
        this.searchParams.appId = '';
        this.searchParams.appName = '';
        this.loadData();
      },
      showAll() {
        this.searchParams.categoryCode = '';
        this.loadData();
      },
      refreshTree() {
        var that = this;
        that.loadTree();
        that.showAll();
      },
      loadTree() {
        var that = this;
        var treeUrl = FUI.Handlers.CategoryHandler + '?groupKey=WorkflowGroup';
        Object.toAjaxJson(treeUrl, null, null, true, null, function (res) {
          if (res.success) {
            that.treeData = res.data;
            var msg = res.msg;
          } else {
            FUI.Window.showMsg(that, res.msg);
          }
        });
      },
      onTreeSelected(data, treeNode, thisObj) {
        this.searchParams.categoryCode = treeNode.data.id;
        this.loadData();
      },
      loadData() {
        var that = this;
        var parms = that.searchParams;
        var res = Object.toAjaxJson('/workflow/workflowBusiness/', 'getStartWorkflowListJson', parms);
        that.data = res.data;
      },
      showWorkflowMap(appId, wid) {
        FUI.Window.openEdit('/workflow/flowDesigner/workflowMap/?wid=' + wid, '查看【' + appId + '】流程图', 'View', null, null, null, null, null, null, true);
      },
     async openWorkflowfrom(item) {
        let { appId, title, workflowId } = item;
        let url = __webpath + '/workflow/workflowform/index/?appId=' + appId;

        let params = { userId:workflowId,menuName:title, menuId:appId, menuUrl:url };
        await api.saveQuickMenuRecord(params);  //菜单点击计数
        
        FUI.Window.open(url, '_blank');
        // FUI.Window.openEdit(url, title, null, null, null, null, null, null, null, true);
      }
    }

  }
</script>
<style>
  .appbox {
    width: 260px;
    display: block;
    float: left;
    margin: 8px;
    border: 1px solid #EBECF0;
    -webkit-border-radius: 2px;
    -moz-border-radius: 2px;
    border-radius: 2px;
    -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.05);
    -moz-box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.05);
    box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.05);
  }

  .appbox-descript {
    padding: 20px 14px 10px 14px;
    height: 70px;
    text-align: left;
    background-color: #FAFBFF;
    font-size: 12px;
    font-family: PingFang SC;
    font-weight: bold;
    color: #0D1126;
  }

  .appbox-action {
    text-align: left;
    width: 100%;
    padding: 5px 10px;
    border-top: 1px solid #EBECF0;
    height: 45px;
    display: flex;
    justify-content: space-between;

  }

  .appbox-action .map-btn {
    display: inline-block;
    margin-top: 3px;
    height: 30px;
    line-height: 16px;
    padding: 5px 8px;
    border-radius: 2px !important;
    border: 1px solid #EBECF0 !important;
    color: #000000;
    font-family: PingFang SC;
  }

  .appbox-action .start-btn {
    display: inline-block;
    text-align: center;
    width: 75px;
    padding: 5px 8px;
    margin-top: 3px;
    font-size: 12px;
    border-radius: 2px !important;
    background-color: #fff;
    height: 30px;
    line-height: 16px;
    border: 1px solid #006EFF;
    font-family: PingFang SC;
    font-weight: 500;
    color: #006EFF;
  }

  .appbox-action .map-btn:hover,
  .appbox-action .start-btn:hover {
    color: #268bff;
    border: 1px solid #268bff;

  }

  .appbox-action .icon {
    font-size: 16px;
  }
</style>