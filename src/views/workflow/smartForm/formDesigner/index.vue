<template>
  <div class="f2bpm-page-layout onlinedesigner main-container full-height">
    <el-container>
      <el-header class="main-header" v-if="!isSolution">
        <div class="float-left main-title">
          <i class="icon icon-danpin" style="position:absolute;top:0px;  color: #409EFF;font-size: 26px;" @click="editHtmlTemplate()" /> <span class="bold" style="margin-left: 30px;">{{ deviceType=='mobile'?'移动端-':'' }}表单设计</span> <span v-html="formProperty.formTitle" />
        </div>
        <div class="float-right external-link">
          <span v-if="deviceType=='pc'" class="cur mr10" title="设计手机端表单" @click="gotoMobileDesigner" target="_blank">
            <i class="fa fa-mobile"></i>手机表单</span>

          <span class="cur mr10"  title="设计打印模板" @click="gotoPrintDesigner" target="_blank">
            <i class="fa fa-print"></i> 打印模板</span>

            <span class="cur" @click="gotoOldOnlineFormDesigner" target="_blank">
            旧版 <i class="el-icon-top-right"></i></span>
        </div>
      </el-header>

      <el-container id="onlinedesigner_maincontainer">
        <el-aside ref="sideLeft" class="my-aside overnone" :width="isCollapsed?'20px':'230px'" hide-trigger collapsible>
          <div class="f2bpm-panel-head " style="height:42px;line-height: 42px;">
            <div v-if="!isCollapsed" style="width: 160px;float: left;padding-left: 10px;">
              表单组件
            </div>
            <div style=" float: right;line-height:42px;padding-right:5px;cursor: pointer;">
              <i title="收起/展开" :class="rotateIcon" @click="collapsedSider" />
            </div>
          </div>
          <leftPanel :deviceType="deviceType" :designerJson="designerJson" v-if="!isCollapsed"></leftPanel>
        </el-aside>

        <el-container class="center-layout-container">
          <el-header class="toolbar-header">
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

                <el-button size="mini" type="default" icon="fa fa-save" tip="备份当前的表单模板及Javascript脚本" @click="backupForm()">备份表单</el-button>
                <el-button size="mini" type="default" icon="fa    fa-refresh" @click="selectTemplateBackup('html')">从备份中还原</el-button>
              </el-button-group>

              <el-button-group class="mr5">
                <el-button size="mini" type="default" icon="fa  fa-cogs" @click="generaTempalte()">一键生成</el-button>
                <el-button size="mini" type="default" icon="fa  fa-trash" @click="cleanAll()">清空</el-button>
              </el-button-group>

              <el-button-group class="mr5">
                <el-button size="mini" type="primary" icon="fa fa-save" @click="submitForm()">保存</el-button>
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
          </el-header>
          <el-main style="padding: 3px; " class="form-widget-main">
            <el-scrollbar class="container-scroll-bar" :style="{height: scrollerHeight}">
              <div id="contentContainer" class="online-workflowform" style="margin-right:2px;background-color: #F5F7FA; ">
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
            </el-scrollbar>
          </el-main>
        </el-container>

        <el-aside class="my-aside" :width="isPropertyCollapsed?'20px':'300px'">
          <div class="f2bpm-panel-head ">
            <div style="float: left;line-height:35px;padding-right:1px;margin-left: 5px;cursor: pointer;">
              <i style="font-size: 14px;" title="收起/展开" :class="rotatePropertyIcon" @click="propertyCollapsedSider" />
            </div>
            <div v-show="!isPropertyCollapsed">
              <el-tooltip class="item" effect="dark" content="此在修改控件的属性不影响数据库字段控件已定义的数据，仅为修改本次模板的属性。" placement="bottom">
                <i class="fa  fa-question-circle-o" style="margin-left:5px;font-weight: bold"> 属性设置</i>
              </el-tooltip>
            </div>
          </div>
          <rightPanel :formKey="formKey" :deviceType="deviceType" :activeProperty="activeProperty" v-if="!isPropertyCollapsed"></rightPanel>
        </el-aside>
      </el-container>
    </el-container>
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
  </div>
</template>

<script>

  WFContext.isDesign = true;
  WFContext.WorkflowformAction = 0;

  window.editorHtml = null;
  window.editorJS = null;
  import leftPanel from '@/views/workflow/smartForm/formDesigner/leftPanel/index';
  import rightPanel from '@/views/workflow/smartForm/formDesigner/rightPanel/index';
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
    components: {
      leftPanel, rightPanel
    }
    ,
    data() {
      return {
        scrollerHeight: 0,
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
      var that = this;
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
      that.scrollerHeight = window.innerHeight - 56 - 36 + 'px';
      $(window).resize(function () {
        that.scrollerHeight = window.innerHeight - 56 - 36 + 'px';
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
          row = Object.toTreeFindItem(that.fields, rowId, true);
        }
        if (row == null) {
          FUI.Window.showMsg(that, "找不到行组件，请删除后重新拖拽组件");
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
        var solutionId = that.solutionId;
        var formKey = that.formKey;
        var formDefId = that.formDefId;
        var formId = that.formId;
        var type = 'pc';
        var url = __webpath + '/workflow/smartForm/solution_onlineFormDesigner?solutionId=' + solutionId + '&type=' + deviceType + '&formKey=' + formKey + '&formDefId=' + formDefId + '&formId=' + formId;
        window.location.href = url;
        //无#window.location.reload()
      },
      editFieldPermission(fieldId, title, fieldName) {
        var that = this;
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
      gotoOldOnlineFormDesigner() {
        var that = this;
        var url = __webpath + '/workflow/smartForm/old_onlineFormDesigner/';
        FUI.Window.open(url + '?type=' + that.deviceType + '&formKey=' + that.formKey + '&formDefId=' + that.formDefId + '&formId=' + that.formId);
      }
      , gotoMobileDesigner() {
        var that = this;
        var url = __webpath + '/workflow/smartForm/onlineFormDesigner/';
        FUI.Window.open(url + '?type=mobile&formKey=' + that.formKey + '&formDefId=' + that.formDefId + '&formId=' + that.formId);

      }
      , gotoPrintDesigner() {
        var that = this;
        var parentFormId=that.formId;
        // 换回打印模板自己的formId
        var res = Object.toAjaxJson(FUI.Handlers.SmartFormHandler, 'getPrintExcelFormId', { parentFormId: parentFormId });
        if (res.success) {
          var url = __webpath + '/workflow/smartForm/onlineExcelDesigner/';
          var printFormId = res.data.formId;
          FUI.Window.open(url + '?formId=' + printFormId + '&formDefId=' + that.formDefId);
        }
      }

    }
  }

</script>
<style lang="scss" scoped>
  @import "/static/f2bpmUI/onlineForm/onlinedisginer_new.css";

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

  .el-container.main-container {
    ::v-deep aside {
      /* 防止aside样式被外部样式覆盖！！ */
      margin: 0;
      padding: 0;
      background: inherit;
    }
  }

  .el-container.full-height {
    height: 100%;
    overflow-y: hidden;
  }

  .el-container.center-layout-container {
    min-width: 680px;
    border-left: 2px dotted #EBEEF5;
    border-right: 2px dotted #EBEEF5;
  }

  .el-header.main-header {
    border-bottom: 2px dotted #EBEEF5;
    height: 48px !important;
    line-height: 48px !important;
    min-width: 800px;
  }

  div.main-title {
    font-size: 18px;
    color: #242424;
    display: flex;
    align-items: center;
    justify-items: center;

    img {
      cursor: pointer;
      width: 36px;
      height: 36px;
    }

    span.bold {
      font-size: 20px;
      font-weight: bold;
      margin: 0 6px 0 6px;
    }

    span.version-span {
      font-size: 14px;
      color: #101F1C;
      margin-left: 6px;
    }
  }

  .float-left {
    float: left;
  }

  .float-right {
    float: right;
  }

  .el-dropdown-link {
    margin-right: 12px;
    cursor: pointer;
  }

  div.external-link a {
    font-size: 13px;
    text-decoration: none;
    margin-right: 10px;
    color: #606266;
  }

  .el-header.toolbar-header {
    font-size: 14px;
    border-bottom: 1px dotted #CCCCCC;
    height: 42px !important;
    text-align: right;
    line-height: 42px !important;
  }

  .el-aside.side-panel {
    width: 260px !important;
    overflow-y: hidden;
  }

  .el-main.form-widget-main {
    padding: 0;

    position: relative;
    overflow-x: hidden;
  }

  .container-scroll-bar {

    ::v-deep .el-scrollbar__wrap,
    ::v-deep .el-scrollbar__view {
      overflow-x: hidden;
    }
  }
</style>