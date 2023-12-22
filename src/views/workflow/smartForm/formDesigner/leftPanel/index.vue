<template>
  <el-scrollbar class="side-scroll-bar" :style="{height: scrollerHeight}">
    <div class="panel-container left-sidebar-nav ">

      <!--       <el-tabs v-model="firstTab" class="no-bottom-margin indent-left-margin">
        <el-tab-pane name="componentLib">
          <span slot="label"><i class="el-icon-set-up"></i>组件库</span> -->

      <el-collapse v-model="activeNames" class="widget-collapse" v-show="!isCollapsed">
        <el-collapse-item name="1">
          <template slot="title">
            <i class="icon icon-biaoge font14 mr5"></i> 栅格布局
          </template>
          <div id="drap_boxs" style="padding-left: 3px; padding-right: 3px;  ">
            <div v-if="deviceType=='pc'" class="drag-row drag-box">
              <div>
                <span class="drag-label"><i class="fa fa-arrows" /></span>
              </div>
              <div class="preview">
                <input value="8,8,8" type="text">
              </div>
              <div class="view" />
            </div>
            <div v-if="deviceType=='pc'" class="drag-row drag-box">
              <div>
                <span class="drag-label"><i class="fa fa-arrows" /></span>
              </div>
              <div class="preview">
                <input value="6,6,6,6" type="text">
              </div>
              <div class="view" />
            </div>
            <div v-if="deviceType=='pc'" class="drag-row drag-box">
              <div>
                <span class="drag-label"><i class="fa fa-arrows" /></span>
              </div>
              <div class="preview">
                <input value="6,18" type="text">
              </div>
              <div class="view" />
            </div>
            <div v-if="deviceType=='pc'" class="drag-row drag-box">
              <div>
                <span class="drag-label"><i class="fa fa-arrows" /></span>
              </div>
              <div class="preview">
                <input value="8,16" type="text">
              </div>
              <div class="view" />
            </div>

            <div class="drag-row drag-box">
              <div>
                <span class="drag-label"><i class="fa fa-arrows" /></span>
              </div>
              <div class="preview">
                <input value="12,12" type="text">
              </div>
              <div class="view" />
            </div>
            <div class="drag-row drag-box">
              <div>
                <span class="drag-label"><i class="fa fa-arrows" /></span>
              </div>
              <div class="preview">
                <input value="24" type="text">
              </div>
              <div class="view" />
            </div>
          </div>
        </el-collapse-item>

        <el-collapse-item name="2">
          <template slot="title">
            <i class="icon  icon-buju-02 font16 mr5"></i>布局容器
          </template>
          <div id="drap_ctrs_container" class="ctrs" style="padding-left: 3px; padding-right: 3px;">
            <div class="online-form-item component" ctr_type="extend_tabs">
              <label class="online-form-label component-drag-widget online-label-tabs"><i class="fa fa-newspaper-o" /> <span class="label-title">页签容器</span></label>
              <div class="online-input-block  online-input-block-full online-block-tabs">
                <input class="jsonItem" type="hidden" value="">
              </div>
            </div>
            <div class="online-form-item component" ctr_type="extend_container">
              <label class="online-form-label component-drag-widget  online-label-container"><i class="fa fa-newspaper-o" /> <span class="label-title">布局容器</span></label>
              <div class="online-input-block  online-input-block-full online-block-container">
                <input class="jsonItem" type="hidden" value="">
              </div>
            </div>
            <div class="online-form-item component" ctr_type="extend_table">
              <label class="online-form-label component-drag-widget  online-label-table"><i class="fa fa-newspaper-o" /> <span class="label-title">表格容器</span></label>
              <div class="online-input-block  online-input-block-full online-block-table">
                <input class="jsonItem" type="hidden" value="">
              </div>
            </div>
          </div>
        </el-collapse-item>

        <el-collapse-item name="3">
          <template slot="title">
            <i class="icon icon-zujian font16 mr5"></i>页面组件
          </template>
          <div id="drap_ctrs" class="ctrs" style="padding-left: 3px; padding-right: 3px;">
            <div class="online-form-item component" ctr_type="extend_label">
              <label class="component-drag-widget  online-form-label  online-label-label "><i class="fa fa-text-width" /><span class="label-title">文字标签</span></label>
              <div class="online-input-block online-block-label">
                <input class="jsonItem" type="hidden" value="">
              </div>
            </div>
            <!-- <div class="online-form-item component" ctr_type="extend_textbox">
              <label class="component-drag-widget  online-form-label  online-label-textbox">
                <i class="fa fa-text-width" />
                <span class="label-title">单行文本框</span>
              </label>
              <div class="online-input-block online-block-textbox">
                <input class="jsonItem" type="hidden" value="">
              </div>
            </div> -->
            <div class="online-form-item component" ctr_type="extend_picture">
              <label class="component-drag-widget online-form-label  online-label-picture"><i class="fa  fa-file-image-o" /> <span class="label-title">上传图片</span></label>
              <div class="online-input-block  online-input-block-full online-block-picture">
                <div class="divider-div" ctr_type="extend_picture">
                  <input class="jsonItem" type="hidden" value="">
                </div>
              </div>
            </div>
            <div class="online-form-item component" ctr_type="extend_file">
              <label class="component-drag-widget online-form-label  online-label-file"><i class="fa  fa-upload" /> <span class="label-title">上传附件</span></label>
              <div class="online-input-block  online-input-block-full online-block-file">
                <div class="divider-div" ctr_type="extend_file">
                  <input class="jsonItem" type="hidden" value="">
                </div>
              </div>
            </div>

            <div class="online-form-item component" ctr_type="extend_custhtml">
              <label class="component-drag-widget  online-form-label online-label-custhtml"><i class="fa fa-code" /><span class="label-title">自定义Html</span></label>
              <div class="online-input-block online-block-custhtml">
                <input class="jsonItem" type="hidden" value="">
              </div>
            </div>
            <div class="online-form-item component" ctr_type="extend_button">
              <label class="component-drag-widget  online-form-label  online-label-button"><i class="fa fa-search" /> <span class="label-title">自定义按钮</span></label>
              <div class="online-input-block online-block-button">
                <input class="jsonItem" type="hidden" value="">
              </div>
            </div>
            <div class="online-form-item component" ctr_type="extend_tabtoolbar">
              <label class="component-drag-widget  online-form-label  online-label-tabtoolbar"><i class="fa fa-magic" /> <span class="label-title">按钮组工具</span></label>
              <div class="online-input-block  online-input-block-full online-block-tabtoolbar">
                <input class="jsonItem" type="hidden" value="">
              </div>
            </div>
            <div class="online-form-item component" ctr_type="extend_selectbutton" style="display: none;">
              <label class="component-drag-widget  online-form-label  online-label-selectbutton"><i class="fa fa-search" /> <span class="label-title">选择器按钮</span></label>
              <div class="online-input-block online-block-selectbutton">
                <input class="jsonItem" type="hidden" value="">
              </div>
            </div>

            <div class="online-form-item component" ctr_type="extend_iframe">
              <label class="component-drag-widget online-form-label  online-label-iframe"><i class="fa fa-object-group" /> <span class="label-title">iframe控件</span></label>
              <div class="online-input-block  online-input-block-full online-block-iframe">
                <div class="iframe-div" ctr_type="extend_iframe">
                  <input class="jsonItem" type="hidden" value="">
                </div>
              </div>
            </div>

            <div class="online-form-item component" ctr_type="extend_divider">
              <label class="component-drag-widget online-form-label  online-label-divider"><i class="fa  fa-window-minimize" /> <span class="label-title">分割线</span></label>
              <div class="online-input-block  online-input-block-full online-block-divider">
                <div class="divider-div" ctr_type="extend_divider">
                  <input class="jsonItem" type="hidden" value="">
                </div>
              </div>
            </div>


            <div class="online-form-item component" ctr_type="extend_custgrid" style="display: none;">
              <label class="component-drag-widget online-form-label  online-label-custgrid"><i class="fa fa-list-alt" /> <span class="label-title">显示列表</span></label>
              <div class="online-input-block  online-input-block-full online-block-custgrid">
                <div class="custgrid-div" ctr_type="extend_custgrid">
                  <input class="jsonItem" type="hidden" value="">
                </div>
              </div>
            </div>
          </div>
        </el-collapse-item>

        <el-collapse-item name="4">
          <template slot="title">
            <i class="icon icon-from  font16 mr5"></i>表单字段
          </template>
          <div class="f2bpm-panel-head " style="border:1px solid #ddd; border-radius: 4px;width:92.5%;clear: both;margin-left: 11px;">
            <div v-if="!isCollapsed" style="width: 160px;float: left;">
              <el-input v-model="searchKey" class="left-htead-treeFilterText-box" size="mini" clearable :placeholder="$t('enterKey')" autocomplete="off" prefix-icon="el-icon-search" />
            </div>
            <div style=" float: right;line-height:35px;padding-right: 5px;cursor: pointer;padding-left: 10px;">
              <span v-if="!isCollapsed" title="搜索字段" class="cur fa fa-search mr4" @click="searchfield()" />
              <span v-if="!isCollapsed" title="刷新字段列表" class="cur icon icon-shuaxin mr4" @click="reloadLeftfilesHtml()" />
            </div>
          </div>
          <!-- <div class="m5">
            <span class="fa fa-plus ml10 blue font10 cur" @click="addNewField"> 新增字段</span>
          </div> -->
          <div id="drap_fields" class="ctrs" style=" padding-bottom: 30px;" :key="leftHtmlKey" v-html="leftfilesHtml" />
        </el-collapse-item>
      </el-collapse>

      <!--       </el-tab-pane> -->
      <!--         <el-tab-pane v-if="showFormTemplates()" name="formLib" style="padding: 8px">
          <span slot="label"><i class="el-icon-c-scale-to-original"></i>表单模板</span>
        </el-tab-pane> -->
      <!--   </el-tabs> -->

    </div>
  </el-scrollbar>
</template>

<script>
  export default {
    name: "leftPanel",
    components: {
    },
    props: {

      designer: Object,
      deviceType: String,
      designerJson: Object
    },
    data() {
      return {
        formDefId: "",
        formId: "",
        leftHtmlKey: "101",
        isCollapsed: false,
        searchKey: "",
        firstTab: 'componentLib',
        scrollerHeight: 0,
        activeNames: ['1', '4'],
        leftfilesHtml: ""
      };

    },
    computed: {
      rotateIcon() {
        return this.isCollapsed ? 'icon icon-arrow-right-bold cur' : 'icon icon-arrow-left-bold cur';
      }
    },
    watch: {
      searchKey: {
        handler(val, oleV) {
          var that = this;
          that.searchfield();
        }
      }
    },
    created: function () {
      var that = this;
      that.leftfilesHtml = that.designerJson.leftfilesHtml;
      that.formDefId = that.designerJson.formProperty.formDefId;
      that.formId = that.designerJson.formProperty.formId;
    }
    , mounted() {
      var that = this;
      this.scrollerHeight = window.innerHeight - 56 + 'px';
      $(window).resize(function () {
        that.$nextTick(() => {
          that.scrollerHeight = window.innerHeight - 56 + 'px';
        });
      });
    },
    methods: {
      collapsedSider() {
        this.isCollapsed = !this.isCollapsed;
      },
      searchfield() {
        var that = this;
        var searchKey = that.searchKey;
        if (searchKey != '') {
          var list = $('#onlineFormFileList');
          $('li', list).hide();
          $("div[title*='" + searchKey + "']", list).each(function (index, item) {
            $(item).parent().show();
            $(item).parent().parent().show();
            $(item).parent().parent().parent().show();
          });
        } else {
          that.searchReSet();
        }
      },
      searchReSet() {
        var that = this;
        that.searchKey = "";
        var list = $('#onlineFormFileList');
        $('li', list).show();
      },
      refresh() {
        var that = this;
        that.reloadLeftfilesHtml();
      }
      , reloadLeftfilesHtml() {
        var that = this;
        console.info(that.designerJson);
        Object.toAjaxJson(FUI.Handlers.SmartFormHandler, 'getLeftfilesHtml', { formDefId: that.formDefId },
          true, null, function (res) {
            if (res.success) {
              that.leftfilesHtml = res.data.leftfilesHtml;
              that.leftHtmlKey = Object.toGuid();
              let leftFieldListJson= res.data.leftFieldListJson;
              //更新主窗口中的leftFieldListJson
              that.$emit('setLeftFieldListJson',leftFieldListJson);
            }
          });
      }
      , showFormTemplates() {
        return true;
      },
      addNewField() {
        let that = this;

      }

    }

  }
</script>

<style lang="scss" scoped>
  @import "/static/f2bpmUI/onlineForm/onlinedisginer.css";

  .side-scroll-bar {
    ::v-deep .el-scrollbar__wrap {
      overflow-x: hidden;
    }
  }

  div.panel-container {
    padding-bottom: 10px;
  }

  .no-bottom-margin ::v-deep .el-tabs__header {
    margin-bottom: 0;
  }

  .indent-left-margin {
    ::v-deep .el-tabs__nav {
      margin-left: 20px;
    }
  }

  .el-collapse-item ::v-deep ul>li {
    list-style: none;
  }

  .widget-collapse {
    border-top-width: 0;

    ::v-deep .el-collapse-item__header {
      margin-left: 8px;
      font-weight: bold;
    }

    ::v-deep .el-collapse-item__content {
      padding-bottom: 6px;

      ul {
        padding-left: 10px;
        margin: 0;
        margin-block-start: 0;
        margin-block-end: 0.25em;
        padding-inline-start: 10px;

        &:after {
          content: "";
          display: block;
          clear: both;
        }

        .container-widget-item,
        .field-widget-item {
          display: inline-block;
          height: 28px;
          line-height: 28px;
          width: 115px;
          float: left;
          margin: 2px 6px 6px 0;
          cursor: move;
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
          background: #f1f2f3;
        }

        .container-widget-item:hover,
        .field-widget-item:hover {
          background: #EBEEF5;
          outline: 1px solid;
        }

        .drag-handler {
          position: absolute;
          top: 0;
          left: 160px;
          background-color: #dddddd;
          border-radius: 5px;
          padding-right: 5px;
          font-size: 11px;
          color: #666666;
        }
      }
    }
  }

  .el-card.ft-card {
    border: 1px solid #8896B3;
  }

  .ft-card {
    margin-bottom: 10px;

    .bottom {
      margin-top: 10px;
      line-height: 12px;
    }

    /*
    .image-zoom {
      height: 500px;
      width: 620px
    }
    */

    .ft-title {
      font-size: 13px;
      font-weight: bold;
    }

    .right-button {
      padding: 0;
      float: right;
    }

    .clear-fix:before,
    .clear-fix:after {
      display: table;
      content: "";
    }

    .clear-fix:after {
      clear: both;
    }

  }
</style>