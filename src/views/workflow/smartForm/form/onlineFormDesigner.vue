<template>
  <div class="f2bpm-page-layout onlinedesigner">
    <el-container>
      <el-header :class="isSolution?'head_tool_bg_solution':'head_tool_bg'">
        <el-row>
          <el-col :span="4">
            <span class="brand"><i class="fa fa-th" style="margin-right: 3px;" @click="editHtmlTemplate()" /><span>{{ deviceType=='mobile'?'移动端-':'' }}</span>表单设计<span id="deviceTypeTitle" />【<span v-html="formProperty.formTitle" />】</span>
          </el-col>
          <el-col :span="20">
            <div id="normalModeToolbar">
              <el-button-group class="mr5">

                <el-button v-if="false" size="mini" type="default" icon="fa fa-code" @click="editHtmlTemplate()">JSON</el-button>

                <el-button size="mini" type="default" icon="fa fa-code" @click="editJscriptTemplate()">脚本</el-button>
                <el-button size="mini" type="default" icon="fa fa-search" @click="previewOnlineForm()">预览</el-button>
              </el-button-group>
              <el-button-group class="mr5">
                <el-button v-if="!isSolution" size="mini" type="default" icon="fa fa-download" @click="downloadHtmlTemplate()">导出本地</el-button>
                <el-button size="mini" type="default" icon="fa fa-cog" @click="editFormOptions()">表单属性</el-button>
                <el-button size="mini" type="default" icon="fa  fa-refresh" @click="refreshcache()">刷新缓存</el-button>
              </el-button-group>

              <el-button-group class="mr5">
                <el-button size="mini" type="default" icon="fa fa-save" @click="submitForm()">保存</el-button>
                <el-button size="mini" type="default" icon="fa fa-save" tip="备份当前的表单模板及Javascript脚本" @click="backupForm()">备份表单</el-button>
                <el-button size="mini" type="default" icon="fa    fa-refresh" @click="selectTemplateBackup('html')">从备份中还原</el-button>
              </el-button-group>

              <el-button-group class="mr5">
                <el-button size="mini" type="warning" icon="fa  fa-cogs" @click="generaTempalte()">一键生成</el-button>
                <el-button size="mini" type="danger" icon="fa  fa-trash" @click="cleanAll()">清空</el-button>
              </el-button-group>

              <el-button-group class="mr5">
                <el-button v-if="!isSolution" size="mini" type="default" onclick="FUI.Window.close()" icon="fa fa-minus-circle">关闭</el-button>
              </el-button-group>
              <div class="mr5" style="float:right;margin-top:0px;display:inline-block;">
                <el-button v-if="isSolution&&deviceType=='pc'" size="mini" plain icon="fa fa-mobile" @click="swicthDeviceDesigner('mobile')">切换移动端设计</el-button>
                <el-button v-if="isSolution&&deviceType=='mobile'" size="mini" plain icon="fa fa-television" @click="swicthDeviceDesigner('pc')">切换电脑端设计</el-button>
              </div>
            </div>
            <div id="htmlModeToolbar" style="display: none">
              <el-button size="mini" type="default" icon="fa   fa-save" @click="saveEditHtmlTemplate('save')">暂存并返回</el-button>
              <el-button size="mini" type="default" icon="fa   fa-undo" @click="saveEditHtmlTemplate('cancle')">取消并返回</el-button>
              <el-button size="mini" type="default" icon="fa    fa-save" @click="selectTemplateBackup('html')">从备份中还原JSON</el-button>
            </div>
            <div id="jscriptModeToolbar" style="display: none">
              <el-button-group class="mr5">
                <el-button size="mini" type="default" icon="fa   fa-save" @click="saveEditJscriptTemplate('save')">暂存并返回</el-button>
                <el-button size="mini" type="default" icon="fa   fa-undo" @click="saveEditJscriptTemplate('cancle')">取消并返回</el-button>
              </el-button-group>

              <el-button-group>
                <el-button size="mini" type="default" icon="fa fa-search" @click="selectFieldEventFunctionName('save')">选择字段事件函数</el-button>
                <el-button size="mini" type="default" icon="fa fa-search" @click="selectExtendEventFunctionName()">选择扩展事件函数</el-button>
                <el-button size="mini" type="default" icon="fa fa-magic" @click="javascriptFormatter()">格式化美化脚本排版</el-button>
                <el-button size="mini" type="default" icon="fa fa-save" @click="selectTemplateBackup('js')">从备份中还原JS脚本</el-button>
              </el-button-group>
            </div>
          </el-col>
        </el-row>
      </el-header>
      <el-container id="onlinedesigner_maincontainer">
        <el-aside ref="sideLeft" class="my-aside overnone" :width="isCollapsed?'20px':'230px'" hide-trigger collapsible>
          <div id="left" style=" margin: 0px; padding: 0px;  width:100%;">
            <div class="f2bpm-panel-head bg-gray">
              <div v-if="!isCollapsed" style="width: 160px;float: left;">
                <input id="searchKey" type="text" placeholder="输入搜索关键字" class="textBoxAutoShort" style="border: 0px; margin-top: 2px;margin-left: 3px;   height: 24px;">
              </div>
              <div style=" float: right;line-height:35px;padding-right: 5px;cursor: pointer;">
                <span v-if="!isCollapsed" title="搜索字段" class="cur fa fa-search mr2" @click="searchfield()" />
                <span v-if="!isCollapsed" title="重置" class="cur fa fa-undo mr4" @click="searchReSet()" />
                <i title="收起/展开" :class="rotateIcon" @click="collapsedSider" />
              </div>
            </div>
            <div v-show="!isCollapsed" class="left-sidebar-nav auto-window-height overy">
              <div class="group-title">
                <span style="cursor: pointer" @click="onClickLeftPanel(this,'drap_boxs')"><i class="fa fa-columns" style="margin-right: 4px; margin-left: 6px;" />栅格布局</span>
              </div>
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
              <div class="group-title">
                <span style="cursor: pointer" @click="onClickLeftPanel(this, 'drap_ctrs_container')"><i class="fa  fa-columns" style="margin-right: 4px; margin-left: 6px;" />布局容器</span>
              </div>
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
              </div>
              <div class="group-title">
                <span style="cursor: pointer" @click="onClickLeftPanel(this, 'drap_ctrs')"><i class="fa  fa-list-alt" style="margin-right: 4px; margin-left: 6px;" />扩展控件</span>
              </div>
              <div id="drap_ctrs" class="ctrs" style="padding-left: 3px; padding-right: 3px;">
                <div class="online-form-item component" ctr_type="extend_label">
                  <label class="component-drag-widget  online-form-label  online-label-label "><i class="fa fa-text-width" /><span class="label-title">文字标签</span></label>
                  <div class="online-input-block online-block-label">
                    <input class="jsonItem" type="hidden" value="">
                  </div>
                </div>

                <div class="online-form-item component" ctr_type="extend_textbox">
                  <label class="component-drag-widget  online-form-label  online-label-textbox">
                    <i class="fa fa-text-width" />
                    <span class="label-title">单行文本框</span>
                  </label>
                  <div class="online-input-block online-block-textbox">
                    <input class="jsonItem" type="hidden" value="">
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
                <div class="online-form-item component" ctr_type="extend_custgrid" style="display: none;">
                  <label class="component-drag-widget online-form-label  online-label-custgrid"><i class="fa fa-list-alt" /> <span class="label-title">显示列表</span></label>
                  <div class="online-input-block  online-input-block-full online-block-custgrid">
                    <div class="custgrid-div" ctr_type="extend_custgrid">
                      <input class="jsonItem" type="hidden" value="">
                    </div>
                  </div>
                </div>
              </div>
              <div class="group-title">
                <span style="cursor: pointer" @click="onClickLeftPanel(this, 'drap_fields')"><i class="fa  fa-list-alt" style="margin-right: 4px; margin-left: 6px;" />表单字段</span>
              </div>
              <div id="drap_fields" class="ctrs" style=" padding-bottom: 30px;" v-html="designerJson.leftfilesHtml" />
            </div>
          </div>
        </el-aside>
        <el-main style="padding: 3px; ">
          <div id="contentContainer" class="online-workflowform" style="overflow-y: auto;margin-right:2px;background-color: #F5F7FA; ">
            <div v-show="currentEditType=='designer'" id="drapDesignContainer" class="drapDesignContainer">
              <el-form ref="elForm3" label-suffix=":" :label-position="formProperty.titlePosition" size="medium" label-width="100px">
                <div v-for="(row, row_index) in fields" :id="row.id" :ordernum="row.orderNum" class="drag-row drag-box">
                  <div class="drag-row-tool-bar">
                    <span title="删除行" class="remove-label" @click="onFieldDeleteClick('row',row.id)"><i class="fa fa-remove" /></span>
                    <span title="行布局" class="edit-label" @click="onFieldClick('row',row,$event)"><i class="fa fa-columns" /></span>
                    <span title="拖动" class="drag-label"><i class="fa fa-arrows" /></span>
                  </div>
                  <div class="view">
                    <div v-show="row.showLabel" class="form-section-title" :style="row.sectionStyle">{{ row.label }}</div>
                    <el-row class="row-fluid clearfix" :style="row.style" :gutter="row.gutter">
                      <el-col v-for="(col, col_index) in row.children" :id="col.id" :key="col_index" :rowid="row.id" :style="col.style" class="column" :span="col.span">
                        <div :id="field.id" v-for="(field, field_index) in col.children" class="online-form-item component" :fieldId="field.fieldId" :key="field_index" :colId="col.id" :rowId="row.id" :vmodel="field.vModel" :orderNum="field.orderNum" :ctrType="field.ctrType" @contextmenu.prevent="onFieldRightClick(field,row.id,col.id,$event)" @click="onFieldClick('field',field,$event)">
                          <div class="component-drag-widget"><i class="fa fa-arrows ml2" /></div>
                          <el-form-item :label-width="field.labelWidth">
                            <span v-show="field.showLabel" slot="label" :style="field.style">
                              <span v-html="field.label" />
                              <span v-if="field.helperArticle!=''&&field.helperArticle!=undefined" class="fa fa-question-circle-o" title="点击查看说明" />
                              {{ field.labelSuffix }}
                            </span>
                            <f2bpm-onlineformitem v-if="field.ctrType!='extend_tabs'&&field.ctrType!='extend_container'" :parentdata="data" :field="field" />

                            <el-tabs v-else-if="field.ctrType=='extend_tabs'" :value="field.tabSelected" :tab-position="field.tabPosition" :type="field.tabType" @tab-click="tabsClick">
                              <el-tab-pane v-for="tab in field.children" :label="tab.label" class="container" :rowid="row.id" :colid="col.id" :ordernum="tab.orderNum" :container_id="field.id" :subcontainer_id="tab.id" :tabsid="field.id" :tabid="tab.id" :name="tab.label">
                                <div v-for="_row in tab.children" :id="_row.id" :key="_row.orderNum" :parent_rowid="row.id" :parent_colid="col.id" :container_id="field.id" :subcontainer_id="tab.id" :ordernum="_row.orderNum" class="drag-row drag-box">
                                  <div class="drag-row-tool-bar">
                                    <span title="删除行" class="remove-label" @click="onFieldDeleteClick('row',_row.id,null,null,row.id,col.id,field.id,tab.id)"><i class="fa fa-remove" /></span>
                                    <span title="行布局" class="edit-label" @click="onFieldClick('row',_row,$event)"><i class="fa fa-columns" /></span>
                                    <span title="拖动" class="drag-label"><i class="fa fa-arrows" /></span>
                                  </div>
                                  <div class="view">
                                    <div v-show="_row.showLabel" class="form-section-title" :style="_row.sectionStyle">{{ _row.label }}</div>
                                    <el-row class="row-fluid clearfix" :style="_row.style" :gutter="_row.gutter">
                                      <el-col :id="_col.id" v-for="(_col, _col_index) in _row.children" :parent_rowid="row.id" :parent_colid="col.id" :key="_col_index" :container_id="field.id" :subcontainer_id="tab.id" :rowid="_row.id" :style="_col.style" class="column container_column" :span="_col.span">
                                        <div :id="_field.id" class="online-form-item component" :fieldId="_field.fieldId" :parent_rowid="row.id" :parent_colid="col.id" :container_id="field.id" :subcontainer_id="tab.id" v-for="(_field, _field_index) in _col.children" :colId="_col.id" :key="_field_index" :rowId="_row.id" :vmodel="_field.vModel" :orderNum="_field.orderNum" :ctrType="_field.ctrType" @contextmenu.prevent="onFieldRightClick(_field,_row.id,_col.id,row.id,col.id,field.id,tab.id,$event)" @click="onFieldClick('field',_field,$event)">
                                          <div class="component-drag-widget"><i class="fa fa-arrows ml2" /></div>
                                          <el-form-item :label-width="_field.labelWidth?_field.labelWidth:'90px'">
                                            <span v-show="_field.showLabel" slot="label" :style="_field.style">
                                              <span v-html="_field.label" />
                                              <span v-if="_field.helperArticle!=''&&_field.helperArticle!=undefined" class="fa fa-question-circle-o" title="点击查看说明" />
                                              {{ _field.labelSuffix }}
                                            </span>
                                            <f2bpm-onlineformitem v-if="_field.ctrType!='extend_tabs'&&_field.ctrType!='extend_container'" :parentdata="data" :field="_field" />
                                          </el-form-item>
                                        </div>
                                      </el-col>
                                    </el-row>
                                  </div>
                                </div>
                              </el-tab-pane>
                            </el-tabs>
                            <el-container v-else-if="field.ctrType=='extend_container'">
                              <div v-for="tab in field.children" :class="'f2bpm-'+tab.tag+' container'" :rowid="row.id" :colid="col.id" :ordernum="tab.orderNum" :container_id="field.id" :subcontainer_id="tab.id" :style="tab.style">
                                <div v-for="_row in tab.children" :id="_row.id" :key="_row.orderNum" :parent_rowid="row.id" :parent_colid="col.id" :container_id="field.id" :subcontainer_id="tab.id" :ordernum="_row.orderNum" class="drag-row drag-box">
                                  <div class="drag-row-tool-bar">
                                    <span title="删除行" class="remove-label" @click="onFieldDeleteClick('row',_row.id,null,null,row.id,col.id,field.id,tab.id)"><i class="fa fa-remove" /></span>
                                    <span title="行布局" class="edit-label" @click="onFieldClick('row',_row,$event)"><i class="fa fa-columns" /></span>
                                    <span title="拖动" class="drag-label"><i class="fa fa-arrows" /></span>
                                  </div>

                                  <div class="view">
                                    <div v-show="_row.showLabel" class="form-section-title" :style="_row.sectionStyle">{{ _row.label }}</div>
                                    <el-row class="row-fluid clearfix" :style="_row.style" :gutter="_row.gutter">
                                      <el-col :id="_col.id" v-for="(_col, _col_index) in _row.children" :parent_rowid="row.id" :parent_colid="col.id" :key="_col_index" :container_id="field.id" :subcontainer_id="tab.id" :rowid="_row.id" :style="_col.style" class="column container_column" :span="_col.span">
                                        <div :id="_field.id" class="online-form-item component" :fieldId="_field.fieldId" :parent_rowid="row.id" :parent_colid="col.id" :container_id="field.id" :subcontainer_id="tab.id" v-for="(_field, _field_index) in _col.children" :colId="_col.id" :key="_field_index" :rowId="_row.id" :vmodel="_field.vModel" :orderNum="_field.orderNum" :ctrType="_field.ctrType" @contextmenu.prevent="onFieldRightClick(_field,_row.id,_col.id,row.id,col.id,field.id,tab.id,$event)" @click="onFieldClick('field',_field,$event)">
                                          <el-form-item :label-width="_field.labelWidth?_field.labelWidth:'90px'">
                                            <span v-show="_field.showLabel" slot="label" :style="_field.style">
                                              <span v-html="_field.label" />
                                            </span>
                                            <f2bpm-onlineformitem v-if="_field.ctrType!='extend_tabs'&&_field.ctrType!='extend_container'" :parentdata="data" :field="_field" />
                                          </el-form-item>
                                        </div>
                                      </el-col>
                                    </el-row>
                                  </div>
                                </div>
                              </div>
                            </el-container>
                          </el-form-item>
                        </div>
                      </el-col>
                    </el-row>
                  </div>
                </div>
              </el-form>
            </div>

            <div v-show="currentEditType == 'editHtml'" id="editHtmlTemplateContainer" style="height: 1000px; width: 95%;border:1px solid #e5e7eb;">
              <textarea id="editHtmlTemplateTextarea" />
            </div>
            <div v-show="currentEditType == 'editJs'" id="editJscriptTemplateContainer" style="height: 1000px; width: 95%;border:1px solid #e5e7eb;">
              <textarea id="editJscriptTemplateTextarea">{{ jscript }}</textarea>
              <span><em class="em">强烈建议将脚本在本地的开发工具或notepad++等工具上编写好再复制粘贴到表单设计器</em></span>
            </div>
            <div style="height:90px;" />
          </div>
        </el-main>

        <el-aside class="my-aside" :width="isPropertyCollapsed?'20px':'300px'">
          <div class="f2bpm-panel-head  bg-gray">
            <div style=" float: left;line-height:35px;padding-right:1px;margin-left: 5px;">
              <i style="font-size: 14px;" title="收起/展开" :class="rotatePropertyIcon" @click="propertyCollapsedSider" />
            </div>
            <div v-show="!isPropertyCollapsed">
              <el-tooltip class="item" effect="dark" content="此在修改控件的属性不影响数据库字段控件已定义的数据，仅为修改本次模板的属性。" placement="bottom">
                <i class="fa  fa-question-circle-o cur" style="margin-left:5px;font-weight: bold"> 属性设置</i>
              </el-tooltip>

            </div>

          </div>
          <div v-show="!isPropertyCollapsed" style="padding-right: 10px;font-size: 12px;padding-top: 10px; " class="overy auto-window-height">
            <!--行属性设置-->
            <el-form v-if="activeProperty.type=='row'" ref="rowFormRef" class="miniform" label-suffix="：" size="mini" label-width="90px">
              <el-tooltip class="item" effect="dark" content="行布局基础属性" placement="bottom">
                <i style="margin-left: 5px;font-weight: bold">行布局基础属性 </i>
              </el-tooltip>
              <el-form-item label="行序号">
                {{ activeProperty.orderNum }}
              </el-form-item>
              <el-form-item label="行标题">
                <el-input v-model="activeProperty.label" />
              </el-form-item>
              <el-form-item label="国际化英文">
                <el-input v-model="activeProperty.alias" />
              </el-form-item>
              <el-form-item label="显示标题">
                <el-switch v-model="activeProperty.showLabel" active-color="#87DC48" inactive-color="#DEDEDE" />
              </el-form-item>

              <el-form-item label="标题样式">
                <span class="cur fa fa-cog font10" title="编辑为Style样式内容，如：border: 1px solid #DDDDDD;" @click="onStyleClick(activeProperty,'sectionStyle')">标题样式</span>
              </el-form-item>
              <el-form-item label="栅格间隔">
                <el-input-number v-model="activeProperty.gutter" />
              </el-form-item>
              <el-form-item label="行样式">
                <span class="cur fa fa-cog  font10" title="编辑为Style样式内容，如：border: 1px solid #DDDDDD;" @click="onStyleClick(activeProperty)">设置行样式</span>
              </el-form-item>
              <el-form-item label="ID">
                <el-input v-model="activeProperty.id" :disabled="true" />
              </el-form-item>
              <el-tooltip class="item" effect="dark" content="一行被切分为24分栏，通过列配置可以将一行划分为多列，每一列指定包含几个分栏。" placement="bottom">
                <i class="fa  fa-question-circle-o" style="margin-left: 15px;"> 列配置:</i>
              </el-tooltip>
              <el-form-item label-width="0" style="padding-left:5px">
                <div v-for="(col, col_index) in activeProperty.children" style="margin-bottom: 3px;margin-left: 10px;">
                  <i class="fa fa-trash  cur" title="删除列" @click="onDeleteChildOfObject(activeProperty, col.id)" /> <span class="cur font12" title="点击设置列属性"><i class="fa fa-cog " /> 第{{ col_index+1 }}列</span>
                  <el-input-number v-model="col.span" size="mini" :min="0" />
                  <span class="cur font12" title="编辑为Style样式内容，如：border: 1px solid #DDDDDD;" @click="onStyleClick(col)">样式</span>
                </div>
                <el-tooltip class="item" effect="dark" content="一行最多被切分为24分栏，每一列指定包含几个分栏，所有列的栏数合计不超过24,否则将导航布局异样" placement="bottom">
                  <i class="fa  fa-plus cur font12" style="margin-left: 5px;font-weight: bold" @click="onAddColByRow(activeProperty)"> 添加列</i>
                </el-tooltip>
              </el-form-item>

              <el-tooltip class="item" effect="dark" content="设置列属性，请选择“列配置”中的具体列" placement="bottom">
                <i class="fa  fa-question-circle-o cur" style="margin-left: 10px;margin-right: 10px; font-weight: bold"> 列属性设置</i>
              </el-tooltip>
            </el-form>
            <!--字段属性设置-->
            <el-form v-if="activeProperty.type=='field'" ref="fieldFormRef" class="miniform" label-suffix="：" size="mini" label-width="90px">
              <el-tooltip class="item" effect="dark" content="基础属性" placement="bottom">
                <i class="fa  fa-question-circle-o" style="margin-left: 5px;font-weight: bold">基础属性</i>
              </el-tooltip>
              <el-form-item label="控件标题">
                <el-input v-model="activeProperty.label" />
              </el-form-item>
              <el-form-item label="国际化英文">
                <el-input v-model="activeProperty.alias" />
              </el-form-item>
              <el-form-item label="标签后缀">
                <el-input v-model="activeProperty.labelSuffix" placeholder="比如冒号“：”" />
              </el-form-item>

              <el-form-item label="显示标题">
                <el-switch v-model="activeProperty.showLabel" active-color="#87DC48" inactive-color="#DEDEDE" />
              </el-form-item>

              <el-form-item label="标题样式">
                <span class="cur fa fa-cog" title="编辑为style样式内容，如：border: 1px solid #DDDDDD;" @click="onStyleClick(activeProperty)">设置样式</span>
              </el-form-item>
              <el-form-item v-if="activeProperty.ctrType!='extend_label'" label="标题宽度">
                <el-input v-model="activeProperty.labelWidth" size="mini" placeholder="标题宽度,例如80px" />
              </el-form-item>
              <el-form-item label-width="0">
                <span class="bolder">输入提示：</span>
                <br>
                <el-input v-model="activeProperty.fieldRemark" type="textarea" :rows="4" placeholder="如本底纹提示" />
              </el-form-item>
              <el-tooltip class="item" effect="dark" content="其它属性" placement="bottom">
                <i class="fa  fa-question-circle-o" style="margin-left: 5px;font-weight: bold"> 其它属性</i>
              </el-tooltip>
              <el-form-item label="序号">
                {{ activeProperty.orderNum }}
              </el-form-item>
              <el-form-item label="ID">
                <el-input v-model="activeProperty.id" :disabled="true" size="mini" />
              </el-form-item>
              <el-form-item v-if="activeProperty.ctrType!='extend_label'" label="绑定字段">
                <el-input v-model="activeProperty.vModel" />
              </el-form-item>
            </el-form>
            <!--tabs控件属性设置-->
            <el-form v-if="activeProperty.type=='tabs'" ref="fieldFormRef" class="miniform" label-position="left" label-suffix="：" size="mini" label-width="90px">
              <el-tooltip class="item" effect="dark" content="基础属性" placement="bottom">
                <i class="fa  fa-question-circle-o" style="margin-left: 5px;font-weight: bold">基础属性</i>
              </el-tooltip>
              <el-form-item label="控件标题">
                <span slot="label" class="bolder"> 控件标题：</span>
                {{ activeProperty.label }}
              </el-form-item>
              <el-form-item label="" label-width="0px">
                <span style="font-weight:bold">风格类型：</span>
                <br>
                <el-radio-group v-model="activeProperty.tabType">
                  <el-radio-button label="">默认</el-radio-button>
                  <el-radio-button label="card">选项卡</el-radio-button>
                  <el-radio-button label="border-card">卡片化</el-radio-button>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="" label-width="0px">
                <span style="font-weight:bold">选项卡位置：</span>
                <br>
                <el-radio-group v-model="activeProperty.tabPosition">
                  <el-radio-button label="top">顶部</el-radio-button>
                  <el-radio-button label="left">左侧</el-radio-button>
                  <el-radio-button label="right">右侧</el-radio-button>
                  <el-radio-button label="bottom">底部</el-radio-button>
                </el-radio-group>
              </el-form-item>
              <el-form-item label-width="0" style="padding-left:5px;font-size: 12px;">
                <span style="font-weight:bold">选项卡配置项：</span>
                <br>
                <div v-for="(child, c_index) in activeProperty.children" style="margin-bottom: 3px;margin-left: 10px;">
                  <span class="mr5">第{{ c_index+1 }}项</span>
                  <el-input v-model="child.label" placeholder="输入选项卡标题" style="width:100px;" />
                  <el-input v-model="child.alias" placeholder="国际化英文" style="width:80px;margin-left: 2px;" />
                  <i class="fa fa-trash  cur" title="删除" @click="onDeleteChildOfObject(activeProperty, child.id)" />
                </div>
                <i class="fa  fa-plus cur" style="margin-left: 5px;font-weight: bold" @click="onAddChildOfObject(activeProperty,'tabpane')"> 添加选项卡</i>
              </el-form-item>
              <el-form-item>
                <span slot="label" class="bolder"> 默认标签：</span>
                <el-input v-model="activeProperty.tabSelected" />
              </el-form-item>
              <el-form-item label="序号">
                <span slot="label" class="bolder"> 序号：</span>
                {{ activeProperty.orderNum }}
              </el-form-item>
              <el-form-item label="ID">
                <span slot="label" class="bolder"> ID：</span>
                <el-input v-model="activeProperty.id" :disabled="true" size="mini" />
              </el-form-item>

            </el-form>
            <!--扩展控件或子列表控件属性设置-->
            <el-form v-if="activeProperty.ctrType&&((activeProperty.ctrType.indexOf('extend_')>-1&&activeProperty.type!='tabs'&&activeProperty.type!='field')||activeProperty.ctrType=='subtable')" ref="fieldFormRef" style="font-size: 12px;padding-left: 3px;" class="miniform" label-position="top" label-suffix="：" size="mini" label-width="80px">
              <el-tooltip class="item" effect="dark" :content="activeProperty.label+'基础属性'" placement="bottom">
                <i class="fa  fa-question-circle-o" style="margin-left: 5px;font-weight: bold;margin-top: 10px;">【{{ activeProperty.label }}】属性</i>
              </el-tooltip>
              <el-form-item v-if="activeProperty.ctrType=='extend_custhtml'" label="控件标题">
                <el-input v-model="activeProperty.label" />
              </el-form-item>

              <!--extend_label-->
              <el-form-item v-if="activeProperty.ctrType=='extend_label'" label-width="0">
                <span style="font-weight:bold">文字内容：</span>
                <br>
                <el-input v-model="activeProperty.content" type="textarea" :rows="4" placeholder="文字内容" />
              </el-form-item>
              <!--extend_custhtml-->
              <el-form-item v-if="activeProperty.ctrType=='extend_custhtml'" label-width="0">
                <span style="font-weight:bold">Html内容：</span>
                <br>
                <el-input v-model="activeProperty.content" type="textarea" :rows="4" placeholder="Html内容" />
              </el-form-item>
              <!--extend_tabtoolbar-->
              <el-form-item v-if="activeProperty.ctrType=='extend_tabtoolbar'" label-width="0" style="padding-left:5px">
                <span class="font12 bolder">配置项：</span>
                <br>
                <div v-for="(child, c_index) in activeProperty.children" style="margin-bottom: 3px;margin-left: 10px;">
                  <span class="mr2">第{{ c_index+1 }}个</span>
                  <el-input v-model="child.label" style="width: 130px;" />
                  <span class="cur" title="编辑为Style样式内容，如：border: 1px solid #DDDDDD;" @click="onStyleClick(child)">样式</span>
                  <i class="fa fa-trash  cur" title="删除" @click="onDeleteChildOfObject(activeProperty, child.id)" />

                </div>
                <el-tooltip class="item" effect="dark" content="" placement="bottom">
                  <i class="fa  fa-plus cur" style="margin-left: 5px;font-weight: bold" @click="onAddChildOfObject(activeProperty,'tabbtn')"> 添加按钮</i>
                </el-tooltip>
              </el-form-item>
              <!--extend_button-->
              <el-form-item v-if="activeProperty.ctrType=='extend_button'" label="" label-width="0px">
                <span style="font-weight:bold">风格类型：</span>
                <br>
                <el-radio-group v-model="activeProperty.btnStyle">
                  <el-radio-button label="">默认</el-radio-button>
                  <el-radio-button label="plain">素按钮</el-radio-button>
                  <el-radio-button label="round">圆角按钮</el-radio-button>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="控件标题">
                <el-input v-model="activeProperty.label" class="textBoxAutoShort" />
              </el-form-item>
              <el-form-item v-if="activeProperty.ctrType=='extend_button'" label="按钮大小">
                <el-select v-model="activeProperty.size">
                  <el-option label="默认" value="" />
                  <el-option label="中等按钮" value="medium" />
                  <el-option label="小型按钮" value="small" />
                  <el-option label="超小按钮" value="mini" />
                </el-select>
              </el-form-item>
              <el-form-item v-if="activeProperty.ctrType=='extend_button'" label="按钮风格">
                <el-select v-model="activeProperty.btnType">
                  <el-option label="主要按钮" value="primary" />
                  <el-option label="成功按钮" value="success" />
                  <el-option label="信息按钮" value="info" />
                  <el-option label="警告按钮" value="warning" />
                  <el-option label="危险按钮" value="danger" />
                </el-select>
              </el-form-item>
              <el-form-item v-if="activeProperty.ctrType=='extend_button'||activeProperty.ctrType=='extend_tabtoolbar'" label="按钮事件">
                <el-input v-model="activeProperty.clickEventName" placeholder="请填写按钮的JS事件函数名" />
              </el-form-item>
              <!--extend_iframe-->
              <el-form-item v-if="activeProperty.ctrType=='extend_iframe'" label="iframe地址">
                <el-input v-model="activeProperty.src" placeholder="iframe的src" />
              </el-form-item>

              <!--extend_container-->
              <el-form-item v-if="activeProperty.ctrType=='extend_container'" label-width="0" style="padding-left:5px">
                <span class="font12 bolder">配置项：</span>
                <br>
                <div v-for="(child, c_index) in activeProperty.children" style="margin-bottom: 3px;margin-left: 10px;">
                  <span>第{{ c_index+1 }}栏</span>
                  <el-select v-model="child.tag" style="width: 130px">
                    <el-option label="aside侧边区" value="aside" />
                    <el-option label="main主内容区" value="main" />
                    <el-option label="header头部区" value="header" />
                  </el-select>
                  <span class="cur" title="编辑为Style样式内容，如：border: 1px solid #DDDDDD;" @click="onStyleClick(child)">样式</span>
                  <i class="fa fa-trash  cur" title="删除" @click="onDeleteChildOfObject(activeProperty, child.id)" />

                </div>
                <el-tooltip class="item" effect="dark" content="" placement="bottom">
                  <i class="fa  fa-plus cur" style="margin-left: 5px;font-weight: bold" @click="onAddChildOfObject(activeProperty,'containerPane')"> 添加分栏</i>
                </el-tooltip>
              </el-form-item>

              <!--字段绑定名称-->
              <el-form-item v-if="activeProperty.ctrType=='extend_button'||activeProperty.ctrType=='extend_tabtoolbar'" label="字段名称">
                <span slot="label" class="bolder">字段名称：</span>
                <el-input v-model="activeProperty.vModel" placeholder="英文名称" />

              </el-form-item>
              <!--权限设置-->
              <el-form-item v-if="activeProperty.ctrType=='extend_button'||activeProperty.ctrType=='extend_tabtoolbar'" label="字段权限">
                <span slot="label" class="bolder">字段名称：</span>
                <a class="btn btn-minier btn-purple mr2" title="字段权限设置" @click="editFieldPermission"><i class="fa fa-gears bigger-120" />权限配置</a>
              </el-form-item>
              <!--常见-->
              <el-form-item v-if="activeProperty.ctrType=='extend_iframe'" label="高度">
                <el-input-number v-model="activeProperty.height" size="mini" :min="0" label="高度" />
              </el-form-item>
              <!--都有的-->
              <el-row>
                <el-col :span="3">样式</el-col>
                <el-col :span="12"> <span class="cur fa fa-edit font10" title="编辑为Style样式内容" @click="onStyleClick(activeProperty,'style')">样式设置</span></el-col>
              </el-row>
              <el-row class="mt10">
                <el-col :span="3">序号</el-col>
                <el-col :span="12">{{ activeProperty.orderNum }}</el-col>
              </el-row>
              <el-row class="mt10 lh30">
                <el-col :span="3">ID</el-col>
                <el-col :span="11">
                  <el-input v-model="activeProperty.id" :disabled="true" size="mini" />
                </el-col>
                <el-col :span="6">
                  <span v-if="false" class="fa fa-cog cur font12" style="line-height: 20px;" title="分配权限后勿再次修改" @click="generateId(activeProperty.ctrType,'field')"> 生成唯一值 </span>
                </el-col>
              </el-row>
            </el-form>

          </div>
          <el-drawer :title="drawerTitle" :visible.sync="drawer" :direction="direction" :before-close="drawerClose">
            <div>
              <pre>{{ drawerContent }}}</pre>
            </div>
          </el-drawer>
          <div v-show="menuVisible" id="rightMenu" class="treeRightMenu" @mouseleave="rightMenuMouseleave()">
            <el-menu id="menu" text-color="#000" @select="rightMenuSelect">
              <el-menu-item v-if="isShowEditFieldMenu" index="rightMenuEdit">
                <i class="fa fa-edit" /> 编辑控件
              </el-menu-item>
              <el-menu-item index="rightMenuDelete">
                <i class="fa fa-trash-o" />删除控件
              </el-menu-item>
            </el-menu>
          </div>
        </el-aside>
      </el-container>
    </el-container>
  </div>
</template>

<script>

  WFContext.isDesign = true;
  WFContext.WorkflowformAction = 0;

  window.editorHtml = null;
  window.editorJS = null;

  import '@/resources/f2bpmUI/onlineForm/components/f2bpm-radio';
  import '@/resources/f2bpmUI/onlineForm/components/f2bpm-checkbox.js';
  import '@/resources/f2bpmUI/onlineForm/components/f2bpm-file.js';
  import '@/resources/f2bpmUI/onlineForm/components/f2bpm-picture.js';
  import '@/resources/f2bpmUI/onlineForm/components/f2bpm-serialnum.js';
  import '@/resources/f2bpmUI/onlineForm/components/f2bpm-hyperlink.js';
  import '@/resources/f2bpmUI/onlineForm/components/f2bpm-stamp.js';
  import '@/resources/f2bpmUI/onlineForm/components/f2bpm-richeditor.js';
  import '@/resources/f2bpmUI/onlineForm/components/f2bpm-selector.js';

  import '@/resources/f2bpmUI/onlineForm/components/f2bpm-datetime.js';

  import '@/resources/f2bpmUI/onlineForm/components/f2bpm-textbox.js';
  import '@/resources/f2bpmUI/onlineForm/components/f2bpm-wfopinion.js';
  import '@/resources/f2bpmUI/onlineForm/components/f2bpm-approvalrecordlist.js';
  import '@/resources/f2bpmUI/onlineForm/components/f2bpm-circulatedrecordlist.js';
  import '@/resources/f2bpmUI/onlineForm/components/f2bpm-commentrecordlist.js';

  import '@/resources/f2bpmUI/onlineForm/components/f2bpm-iframe.js';
  export default {
    data() {
      return {
        isSolution: false,
        solutionId: '',
        formAction: null,
        isPropertyCollapsed: false,
        isCollapsed: false,
        subtableKey: 101,
        // editHtml,editJs,designer
        currentEditType: 'designer',
        isShowEditHtml: true,

        // Url参数
        deviceType: 'pc',
        formDefId: '',
        formKey: '',
        formId: '',
        isTemplate: 0,
        // 右键相关
        currentRightData: null,
        currentRightParms: null,
        menuVisible: false,
        isShowEditFieldMenu: true,
        // 抽屉
        drawerTitle: '查看',
        drawerContent: '',
        drawer: false,
        direction: 'rtl',
        // 表单应用设计JSON
        designerJson: {},
        activeProperty: {},
        // 左侧：表单字段控件的Json定义 一维结构：{id:,fieldName,type,preFix,data},
        // ID有两种,type为字段或表：字段是为fieldId,子表时为busObjectId
        leftFieldListJson: [],
        // 表单设计的Json描述
        fields: [],
        // 数据源
        data: {},
        jscript: '',
        formProperty: {},
        fieldValue: '组件字段的值',
        radioValueTest: 'Item1',
        // 控件类型
        ctrTypeArr: [
          { 'text': '文本框', 'value': 'text' },
          { 'text': '文本域', 'value': 'textarea' },
          { 'text': '富文本编辑器', 'value': 'richeditor' },
          { 'text': '下拉选择框', 'value': 'select' },
          { 'text': '级联选择', 'value': 'cascselect' },
          { 'text': '自动完成', 'value': 'autocompleter' },
          { 'text': '自定义选择器', 'value': 'selector' },
          { 'text': '自定义选择对话框', 'value': 'customdialog' },
          { 'text': '单选按钮', 'value': 'radio' },
          { 'text': '复选框', 'value': 'checkbox' },
          { 'text': '附件上传', 'value': 'file' },
          { 'text': '日期时间', 'value': 'datetime' },
          { 'text': '上传图片', 'value': 'picture' },
          { 'text': '图章（与选择按钮联用）', 'value': 'stamp' },
          { 'text': '电子签名', 'value': 'handsign' },
          { 'text': '超链接', 'value': 'hyperlink' },
          { 'text': '隐藏域', 'value': 'hidden' },
          { 'text': '流水号', 'value': 'serialnum' }
        ],
        formRules: {
          categoryCode: [
            { required: true, message: '请选择分类', trigger: 'blur' }
          ],
          formDefName: [
            { required: true, message: '必填项不能为空', trigger: 'blur' }
          ],
          formDefKey: [
            { required: true, message: '必填项不能为空', trigger: 'blur' }
          ]
        }

      };
    },
    computed: {
      rotatePropertyIcon() {
        return this.isPropertyCollapsed ? 'fa fa-angle-double-left' : 'fa fa-angle-double-right';
      },
      rotateIcon() {
        return this.isCollapsed ? 'fa fa-angle-double-right' : 'fa fa-angle-double-left';
      }
    },

    created: function () {
      var that = this;
      // 方案设计ID，方案时才需要传入此参数
      var solutionId = Object.toQueryString('solutionId') || '';
      var formDefId = Object.toQueryString('formDefId') || '';
      var deviceType = Object.toQueryString('type') || '';
      var formKey = Object.toQueryString('formKey') || '';
      var formId = Object.toQueryString('formId') || '';
      // 是否为模板设计
      var isTemplate = Object.toQueryString('isTemplate') || 0;
      that.formDefId = formDefId;
      that.deviceType = deviceType;
      that.formKey = formKey;
      that.formId = formId;
      that.isTemplate = isTemplate;
      that.solutionId = solutionId;
      if (solutionId != '') {
        that.isSolution = true;
      }
      WFContext.deviceType = that.deviceType;

      var res = Object.toAjaxJson(FUI.Handlers.SmartFormHandler, 'getOnlineFormDesignerJson', { formDefId: that.formDefId, formId: that.formId, type: deviceType });
      if (res.success) {
        that.designerJson = res.data;
        that.formProperty = that.designerJson.formProperty;
        $('title').html('表单设计-' + that.formProperty.formTitle);
        that.leftFieldListJson = that.designerJson.leftFieldListJson || [];
        if (that.designerJson.htmlfields) {
          // Html模板内容设计
          that.fields = that.designerJson.htmlfields;
          that.jscript = that.designerJson.jscript;
          // 收集字段定义（纯字段扁平化）
          FUI.F2Grid.collectField(that, that.fields);
          // 收集被公式引用到的字段名
          that.mathFieldList = FUI.F2Grid.getMathFieldList(that.fieldList);
          // 初始化data的结构
          FUI.F2Grid.initailData(that, that.fields);
        } else {
          that.fields = [];
        }
      }
    },
    mounted() {
      window.myvm = this;
      document.addEventListener('click', this.listen);

      editorHtml = CodeMirror.fromTextArea(document.getElementById('editHtmlTemplateTextarea'), {
        mode: 'text/javascript',
        indentUnit: 2, // 缩进单位，默认2
        smartIndent: true, // 是否智能缩进
        tabSize: 4, // Tab缩进，默认4
        readOnly: false,
        showCursorWhenSelecting: true,
        height: 300,
        lineNumbers: true,
        continueComments: 'Enter',
        extraKeys: {
          'Ctrl-B': 'toggleComment'
        }
      });
      editorHtml.setSize($(window).width() - 500, $(window).height() - 80);

      editorJS = CodeMirror.fromTextArea(document.getElementById('editJscriptTemplateTextarea'), {
        mode: 'text/javascript',
        indentUnit: 2, // 缩进单位，默认2
        smartIndent: true, // 是否智能缩进
        tabSize: 4, // Tab缩进，默认4
        readOnly: false,
        showCursorWhenSelecting: true,
        height: 300,
        lineNumbers: false,
        continueComments: 'Enter',
        extraKeys: {
          'Ctrl-B': 'toggleComment'
        }
      });
      editorJS.setSize($(window).width() - 500, $(window).height() - 80);

      $('#contentContainer').height($(window).height() - 80);
      $(window).resize(function () {
        $('#contentContainer').height($(window).height() - 80);
      });
      $('body').css('overflow', 'hidden');

      window.load_layout();
      window.load_frombuild();
    },
    methods: {

      collapsedSider() {
        this.isCollapsed = !this.isCollapsed;
      },
      propertyCollapsedSider() {
        this.isPropertyCollapsed = !this.isPropertyCollapsed;
      },
      closeEdit() {
        FUI.Window.closeEdit();
      },
      rightMenuMouseleave() {
        this.menuVisible = false;
      },
      listen() {
        this.menuVisible = false;
      },
      // field: 可以是字段名也可以是字段定义的对象
      updateFieldValue(field, newValue, vueDataName, subVueDataName) {
        // 更新自己控件值
        var that = this;
        var vueDataObj = vueDataName ? that[vueDataName] : that.data;
        if (subVueDataName) {
          vueDataObj = that[vueDataName][subVueDataName];
        }
        if (typeof field === 'string') {
          vueDataObj[field] = newValue;
        } else {
          if (field.vModel) {
            vueDataObj[field.vModel] = newValue;
          } else if (field['field']) {
            vueDataObj[field['field']] = newValue;
          }
        }
      },
      appendFieldValue(fieldName, newValue, vueDataName, subVueDataName) {
        console.info('appendFieldValue');
        // 追加值到指定字段
        var that = this;
        var vueDataObj = vueDataName ? that[vueDataName] : that.data;
        if (subVueDataName) {
          vueDataObj = that[vueDataName][subVueDataName];
        }
        var oleValue = vueDataObj[fieldName] || '';
        if (oleValue) {
          vueDataObj[fieldName] = oleValue + ',' + newValue;
        }
        vueDataObj[fieldName] = newValue;
      },
      drawerClose(done) {
        done();
      },
      showJson() {
        var that = this;
        var json = JSON.stringify(that.fields, null, 2);
        that.drawer = true;
        that.drawerTitle = '查看JSON';
        that.drawerContent = json;
        // FUI.Window.showMsg(that, json, "查看JSON", 1);
      },
      onAddCol(rowId) {
        var that = this;
        var row = that.fields.find(a => a.id == rowId);
        var cols = row.children;
        var spanValue = 4;
        cols.push({ type: 'col', id: Object.toGuid(), label: '', span: spanValue, style: '', children: [] });
      },
      onAddColByRow(row) {
        var that = this;
        var cols = row.children;
        var spanValue = 4;
        cols.push({ type: 'col', id: Object.toGuid(), label: '', span: spanValue, style: '', children: [] });
      },
      onAddChildOfObject(obj, type) {
        var that = this;
        var childs = obj.children;
        var orderNum = childs.length + 1;
        if (type == 'tabpane') {
          var item = { type: 'tabpane', id: 'tabpane_' + Object.toGuid(false), ctrType: 'tabpane', label: '标签页' + orderNum, orderNum: orderNum, style: '', children: [] };
          childs.push(item);
        } else if (type == 'containerPane') {
          var item = Object.toClone(container_template.children[1]);
          item.id = 'containerPane_' + Object.toGuid(false);
          item.orderNum = orderNum;
          childs.push(item);
        } else if (type == 'tabbtn') {
          var item = Object.toClone(tabtoolbar_template.children[0]);
          item.id = 'tabbtn_' + Object.toGuid(false);
          item.orderNum = orderNum;
          childs.push(item);
        }
      },
      onDeleteChildOfObject(obj, id) {
        var that = this;
        var childs = obj.children.filter(a => a.id != id);
        obj.children = childs;
      },
      tabsClick(tab, event) {
        var that = this;
        var label = tab.label;
        that.activeProperty.tabSelected = label;
        console.log(tab, event);
      },

      rightMenuSelect(key) {
        var that = this;
        var fn = that[key];
        fn();
      },
      rightMenuEdit() {
        var that = this;
        var currField = this.currentRightData;
        var ctrType = currField.ctrType;

        // 编辑控件
        var fieldid = currField.fieldId;
        var itemId = currField.id;
        if (ctrType.indexOf('extend_') > -1) {
          var url = FUI.Handlers.SmartFormHandler + 'onlineFormComponentEdit/?deviceType=' + that.deviceType + '&formKey=' + that.formKey + '&formDefId=' + that.formDefId + '&itemId=' + itemId;
          FUI.Window.openEdit(url, '编辑扩展控件', 'Edit', '', 890, 580, null, null, fieldid, true);
        } else if (ctrType != 'subtable') {
          var url = FUI.Handlers.SmartFormHandler + 'formFieldEdit/?deviceType=' + that.deviceType + '&formDefId=' + that.formDefId + '&itemId=' + itemId;
          FUI.Window.openEdit(url, '编辑控件', 'Edit', '', 880, 540, null, null, fieldid);
        } else if (ctrType == 'subtable') {
          var busObjectId = currField.props.busObjectId;
          var url = FUI.Handlers.SmartFormHandler + 'onlineFormSubTableEdit/?deviceType=' + that.deviceType + '&busObjectId=' + busObjectId + '&formDefId=' + that.formDefId + '&formKey=' + that.formKey + '&itemId=' + itemId;
          FUI.Window.openEdit(url, '编辑子表列表', 'Edit', '', 880, 540, null, null, null, true);
        }
      },
      rightMenuDelete() {
        var that = this;
        var currField = this.currentRightData;
        this.onFieldDeleteClick('field', that.currentRightParms.rowId, that.currentRightParms.colId, currField.id, that.currentRightParms.parentRowId, that.currentRightParms.parentColId, that.currentRightParms.containerId, that.currentRightParms.subContainerId);
      },
      onFieldRightClick(field, rowId, colId, parentRowId, parentColId, containerId, subContainerId, eve) {
        var that = this;
        this.menuVisible = true;
        this.currentRightData = field;
        this.currentRightRowId = rowId;
        this.currentRightParms = { rowId: rowId, colId: colId, parentRowId: parentRowId, parentColId: parentColId, containerId: containerId, subContainerId: subContainerId };
        if (field.ctrType.indexOf('extend_') > -1) {
          this.isShowEditFieldMenu = false;
        } else {
          this.isShowEditFieldMenu = true;
        }

        const menu = document.querySelector('#rightMenu');
        /* 菜单定位基于鼠标点击位置 */
        menu.style.left = event.clientX + 20 + 'px';
        menu.style.top = event.clientY - 10 + 'px';
        event.stopPropagation();
      },
      onFieldClick(type, fieldItem, eve) {
        var that = this;
        that.activeProperty = fieldItem;
        console.info(fieldItem.type);
        if (fieldItem.type != 'tabs' && fieldItem.type != 'container') {
          //  阻止事件冒泡
          eve.stopPropagation();
        }
      },
      onFieldDeleteClick(type, rowId, colId, fieldId, parentRowId, parentColId, containerId, subContainerId) {
        var that = this;
        // 删除对象
        var tip = '';
        if (type == 'row') {
          tip = '您确定要删除行？';
        } else if (type == 'col') {
          tip = '您确定要删除列？';
        } else if (type == 'field') {
          tip = '您确定要删除控件吗？';
        }
        var data = that.fields;
        var theRowContainer = null;
        if (parentRowId && parentColId) {
          // 找到容器下面的行数据
          var prow = data.find(a => a.id == parentRowId);
          var pcol = prow.children.find(a => a.id == parentColId);
          var fromcontainer = pcol.children.find(a => a.id == containerId);
          if (subContainerId) {
            var from_subContainer = fromcontainer.children.find(a => a.id == subContainerId);
            theRowContainer = from_subContainer;
            data = from_subContainer.children;
          } else {
            theRowContainer = fromcontainer;
            data = fromcontainer.children;
          }
        }
        FUI.Window.confirm(that, tip, '删除提示', function () {
          if (type == 'row' && theRowContainer != null) {
            theRowContainer.children = data.filter(a => a.id != rowId);
          } else if (type == 'row') {
            that.fields = data.filter(a => a.id != rowId);
          } else if (type == 'col') {
            var row = data.find(a => a.id == rowId);
            var cols = row.children.filter(a => a.id != colId);
            row.children = cols;
          } else if (type == 'field') {
            var row = data.find(a => a.id == rowId);
            var col = row.children.find(a => a.id == colId);
            var fs = col.children.filter(a => a.id != fieldId);
            col.children = fs;
          }
        });
      },


       onFieldUpdate(fieldItemJson, rowId, colId, id, isUpdateBaseLabel) {
        // isUpdateBaseLabel:是否替换标签
        if (isUpdateBaseLabel == undefined || isUpdateBaseLabel == null) {
          isUpdateBaseLabel = true;
        }
        var that = this;
        // 更新控件对象
        var tip = '';
        var row = that.fields.find(a => a.id == rowId);
        if (row == null) {
          //如果由于嵌套导致找不到时，则遍历所有组件下找直到找到为止
          row=Object.toTreeFindItem(that.fields,rowId,true);
        }
        if (row == null) {
          FUI.Window.showMsg(that,"找不到行组件，请删除后重新拖拽组件")
          return false;
        }
        var col = row.children.find(a => a.id == colId);
        var field = col.children.find(a => a.id == id);
        // =================更新到左侧控件待选里================
        try {
          var defid = '';
          if (fieldItemJson.type == 'field') {
            defid = fieldItemJson.fieldId;
          } else if (fieldItemJson.type == 'subtable') {
            defid = fieldItemJson.props.busObjectId;
          }
          if (defid) {
            var item = that.leftFieldListJson.find(f => f.id == defid);
            item.data = Object.toClone(fieldItemJson);
          }
        } catch (err) {
          console.info(err);
        }
        // ========================================================

        // 不可修改的属性
        fieldItemJson.style = field.style;
        fieldItemJson.slot = field.slot;
        fieldItemJson.orderNum = field.orderNum;
        fieldItemJson.labelWidth = field.labelWidth;
        if (isUpdateBaseLabel === false) {
          fieldItemJson.label = field.label;
          fieldItemJson.isRequired = field.isRequired;
        }
        field = Object.extend(field, fieldItemJson);

        // 重新渲染
        if (fieldItemJson.ctrType == 'subtable') {
          var newKey = that.subtableKey + 1;
          that.subtableKey = newKey;
        }
      },
      onStyleClick(vueObj, propName) {
        propName = propName || 'style';
        var that = this;
        WF.SelectorDialog.selectStyle(that, propName, vueObj);
      },
      // ===stand:标准化方法结束============
      submitForm() {
        var that = this;
        var filedsJson = JSON.stringify(that.fields);
        Object.toAjaxJson(FUI.Handlers.SmartFormHandler, 'saveFormDesigner', {
          'isTemplate': that.isTemplate,
          'TemplateContent': filedsJson,
          'jscriptContent': that.jscript,
          type: that.deviceType,
          formId: that.formId
        }, true, null, function (r) {
          if (r.success == true) {
            FUI.Window.showMsg(that, r.msg, null, 1, function () {
              window.location.reload();
            });
          } else {
            FUI.Window.showMsg(that, r.msg);
          }
        });
      },
      cleanAll() {
        this.fields = [];
      },
      validateForm(refFormName) {
        // stand:表单校验
        var success = false;
        this.$refs[refFormName].validate(valid => {
          success = valid;
        });
        return success;
      },
      editFormOptions() {
        var that = this;
        FUI.Window.openEdit(__webpath + '/workflow/smartForm/formOptionsEdit/?isTemplate=' + that.isTemplate + '&formId=' + that.formId + '&formKey=' + that.formKey, '表单属性配置', 'Edit', '', 760, 500, null, null, that.formId);
      },
      previewOnlineForm() {
        var that = this;
        var url = __webpath + '/workflow/smartForm/onlineFormPreview/?formId=' + that.formId + '&formDefId=' + that.formDefId;
        window.open(url, '_blank');
      },
      generaTempalte() {
        var that = this;
        // 在弹出窗口做
        FUI.dialog('/workflow/smartForm/generationTempaltePlan?formDefId=' + that.formDefId + '&deviceType=' + that.deviceType,
          '生成表单模板方案', null, 400, 250, function (data, index, layerObject) {
            if (data == false) {
              return false;
            }
            try {
              // var arr = eval("(" + data + ")");
              that.fields = data;
              FUI.Window.showMsg('表单模板生成成功', null, 1);
            } catch (e) {
              console.info(data);
              FUI.Window.showMsg('表单模板生成失败');
            }
            layerObject.close(index);
          }, true);
      },
      backupForm() {
        var that = this;
        if (that.fields.length == 0) {
          FUI.Window.showMsg(that, '当前模板为空，备份失败！');
          return false;
        }
        var html = JSON.stringify(that.fields);
        FUI.Window.confirm('确定要新增备份吗？', '温馨提示', function () {
          var jscript = that.jscript;
          var remark = '';
          layer.prompt({
            formType: 2,
            btnAlign: 'c',
            title: '请输入备注',
            value: '',
            yes: function (index, layero) {
              // 获取文本框输入的值
              var value = layero.find('.layui-layer-input').val();
              var r = Object.toAjaxJson(FUI.Handlers.SmartFormHandler, 'saveBackupFormDesigner', {
                'templateContent': html,
                'jscriptContent': jscript,
                type: that.deviceType,
                formId: that.formId,
                remark: value
              });
              if (r.success == true) {
                FUI.Window.showMsg(that, r.msg, null, 1);
              } else {
                FUI.Window.showMsg(that, r.msg);
              }
              layer.close(index);
            }
          });
        });
      },
      editHtmlTemplate() {
        var that = this;
        that.currentEditType = 'editHtml';
        var html = JSON.stringify(that.fields, null, 2);
        editorHtml.setValue(html);
        $('#htmlModeToolbar').show();
        $('#normalModeToolbar').hide();
        setTimeout(function () {
          editorHtml.setCursor(2);
        }, 300);
      },
      editJscriptTemplate() {
        var that = this;
        that.currentEditType = 'editJs';
        var js = $('#editJscriptTemplateTextarea').val();
        editorJS.setValue(js);
        $('#jscriptModeToolbar').show();
        $('#normalModeToolbar').hide();
        setTimeout(function () {
          editorJS.setCursor(2);
        }, 300);
      },
      saveEditHtmlTemplate(actionType) {
        var that = this;
        if (actionType == 'save') {
          var htmlFields = editorHtml.getValue();
          if (htmlFields != '') {
            that.fields = eval('(' + htmlFields + ')');
          } else {
            that.fields = [];
          }
        }
        $('#htmlModeToolbar').hide();
        $('#normalModeToolbar').show();
        that.currentEditType = 'designer';
      },
      saveEditJscriptTemplate(actionType) {
        var that = this;
        if (actionType == 'save') {
          var js = editorJS.getValue();
          that.jscript = js;
        }
        $('#jscriptModeToolbar').hide();
        $('#normalModeToolbar').show();
        that.currentEditType = 'designer';
      },

      javascriptFormatter() {
        var that = this;
        var js = editorJS.getValue();
        var beauifyJs = js_beautify(js);
        editorJS.setValue(beauifyJs);
        that.jscript = beauifyJs;
      },
      selectFieldEventFunctionName() {
        var that = this;
        var parm = {
          singleSelect: true,
          data: []
        };
        FUI.dialog(__webpath + '/workflow/selector/selectFormField/?formDefId=' + that.formDefId, '选择表单字段', parm, 500, 620, function (objectData, index) {
          if (objectData.length == 1) {
            var fieldName = objectData[0].value;
            var fieldTitle = objectData[0].text;

            var func = 'function ' + fieldName.replace(/\./g, '_') + '(value, field){\r\n //' + fieldTitle + '\r\n console.info(value);}';
            var js = editorJS.getValue() + func;
            var beauifyJs = js_beautify(js);
            editorJS.setValue(beauifyJs);
          } else if (objectData.length > 1) {
            FUI.Window.showMsg2('每次只能选择一个字段函数');
          }
          layer.close(index);
        }, true);
      },
      selectExtendEventFunctionName() {
        var that = this;
        var parm = {
          singleSelect: true,
          data: []
        };
        FUI.dialog(__webpath + '/workflow/smartForm/selectExtendEvent/?formDefId=' + that.formDefId, '选择扩展事件函数', parm, 500, 620, function (objectData, index, layer) {
          if (objectData == false) {
            return false;
          }
          if (objectData.length == 1) {
            var fieldName = objectData[0].value;
            var fieldTitle = objectData[0].text;
            var descript = objectData[0].descript;
            var func = 'function ' + fieldName + '{\r\n //' + fieldTitle + '  ' + descript + '\r\n console.info(field);}';
            var js = editorJS.getValue() + func;
            var beauifyJs = js_beautify(js);
            editorJS.setValue(beauifyJs);
          } else if (objectData.length > 1) {
            FUI.Window.showMsg2('每次只能选择一个字段函数');
          }
          layer.close(index);
        }, true);
      },
      // 选择备份的历史表单模板列表
      selectTemplateBackup(restoreType) {
        var that = this;
        var typeMsg = restoreType == 'html' ? 'Html表单设计' : 'JavaScript脚本';
        var isdirectHtml = restoreType == 'html';
        var parm = {
          singleSelect: true,
          data: [],
          formId: that.formId
        };
        FUI.dialog(__webpath + '/workflow/selector/selectTemplateBackup/?formId=' + that.formId, '选择备份的表单模板', parm, 800, 520, function (objectData, index, layer) {
          if (objectData.length == 1) {
            var id = objectData[0].Id;
            var name = objectData[0].FormName;
            var Remark = objectData[0].Remark;
            var time = Object.toJsonDateTimeFormatter(objectData[0].CreatedTime);

            FUI.Window.confirm('您确定使用【表单名称：“' + name + '”;备份时间:“' + time + '”;备注为:“' + Remark + '”】的版本复盖当前编辑中的【' + typeMsg + '】模板吗？', '温馨提示', function () {
              that.restoreFromBackup(id, isdirectHtml);
            });
          } else if (objectData.length > 1) {
            FUI.Window.showMsg2('只能选择一个要还原的模板！');
          }
          layer.close(index);
        }, true);
      },
      // 从备份中的模板中还原
      restoreFromBackup(backupId, isdirectHtml) {
        var that = this;
        var data = Object.toAjaxJson(FUI.Handlers.SmartFormHandler, 'getBackupFormHtml', {
          type: that.deviceType,
          id: backupId
        });
        if (data.success == undefined && data.formName) {
          if (that.currentEditType == 'editHtml' || isdirectHtml) {
            var templateHtml = that.deviceType == 'pc' ? data.templateContent : data.mobileTemplateContent;
            if (isdirectHtml) {
              if (templateHtml != '') {
                that.fields = eval('(' + templateHtml + ')');
              } else {
                that.fields = [];
              }
            } else {
              var templateHtml = js_beautify(templateHtml);
              editorHtml.setValue(templateHtml);
            }
            FUI.Window.showMsg(that, '模板还原成功', null, 1);
          } else if (that.currentEditType == 'editJs') {
            var scriptStr = that.deviceType == 'pc' ? data.templateContentJavaScript : data.mobileTemplateJavaScript;
            editorJS.setValue(scriptStr);
            FUI.Window.showMsg(that, '还原JavaScript脚本成功', null, 1);
          }
        } else {
          FUI.Window.showMsg(that, data.msg);
        }
      },
      swicthDeviceDesigner(deviceType) {
        var that = this;
        var that = this;
        var solutionId = that.solutionId;
        var formKey = that.formKey;
        var formDefId = that.formDefId;
        var formId = that.formId;
        var type = 'pc';
        var url = __webpath + '/workflow/smartForm/solution_onlineFormDesigner?solutionId=' + solutionId + '&type=' + deviceType + '&formKey=' + formKey + '&formDefId=' + formDefId + '&formId=' + formId;
        window.location.href = url;
        //无#window.location.reload()
      },
      generateId(ctrtype, id) {
        var that = this;
        var newId = 'form_item_' + Object.toGuid(false);
        if (id == 'field') {
          newId = ctrtype + '_' + Object.toGetTimeRandomNum();
        }
        that.activeProperty.id = newId;
      },
      editFieldPermission() {
        var that = this;
        var fieldId = that.activeProperty.id;
        var title = that.activeProperty.label;
        var fieldName = that.activeProperty.vModel;
        if (fieldName == '') {
          FUI.Window.showMsg('“字段名称”不能为空');
          return false;
        }
        // 权限配置
        var rightAppIdData = Object.toAjaxJson(FUI.Handlers.SmartFormHandler, 'getRightIdAppIdByFormKey', { formKey: that.formKey });
        var url = '/workflow/smartForm/formFieldPermissionEdit/?appId=' + rightAppIdData.data.appId + '&rightId=' + rightAppIdData.data.rightId;
        var parms = {
          fieldIds: fieldId,
          fieldTitle: title,
          type: 'extend',
          actionName: fieldName
        };
        FUI.Window.openEdit(url, '设置【' + title + '】的删除行权限', FUI.FormAction.Edit, null, 880, 580, null, null, fieldId, false, null, parms);
      },
      downloadHtmlTemplate() {
        var that = this;
        var data = Object.toAjaxDownloadFile(FUI.Handlers.WorkflowManageHandler, 'downLoadProcessFormXml', {
          formId: that.formId
        });
      },
      refreshcache() {
        var that = this;
        Object.toAjaxJson(FUI.Handlers.WorkflowManageHandler, 'refreshcache', null, null, null, function (data) {
          // 刷新Session中的缓存
          that.$store.dispatch('user/removeCache');
          FUI.Window.showMsg(that, data.msg, null, 1);
        });
      },
      // 扩展事件
      extendTabtoolbarClick(field) {
        event.stopPropagation();
        event.preventDefault();
      },
      extendButtonClidk(field) {
        event.stopPropagation();
        event.preventDefault();
      },
      searchfield() {
        var searchKey = $('#searchKey').val();
        if (searchKey != '') {
          var list = $('#onlineFormFileList');
          $('li', list).hide();
          $("div[title*='" + searchKey + "']", list).each(function (index, item) {
            $(item).parent().show();
            $(item).parent().parent().show();
            $(item).parent().parent().parent().show();
          });
        }
      },
      searchReSet() {
        $('#searchKey').val('');
        var list = $('#onlineFormFileList');
        $('li', list).show();
      },
      onClickLeftPanel(thisObj, id) {
        $('#' + id).toggle();
      }
    }
  }

</script>
<style lang="scss" scoped>
  @import "/static/f2bpmUI/onlineForm/onlinedisginer.css";

  .head_tool_bg {
    background-color: rgb(48, 65, 86);
    color: white;
    height: 45px !important;
    line-height: 45px !important;
  }

  .head_tool_bg_solution {
    background-color: #FFFFFF;
    color: white;
    height: 45px !important;
    line-height: 45px !important;
    -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.05);
    -moz-box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.05);
    box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.05);
    border-bottom: 2px solid rgba(0, 0, 0, 0.05);
  }

  .head_tool_bg_solution .brand {
    color: #333 !important;
  }
</style>
