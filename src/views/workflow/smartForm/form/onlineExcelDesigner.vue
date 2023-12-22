<template>
  <div>
    <el-container >
      <el-header id="header" style="background: #2B3541; color: white; height: 45px;line-height: 45px;box-shadow: #BCC2CD ">
        <el-row>
          <el-col :span="4">
            <span class="brand"><i class="fa fa-print" style="margin-right: 3px;" />打印模板设计<span id="deviceTypeTitle" />【<span v-html="formProperty.formTitle" />】</span>
          </el-col>
          <el-col :span="20">
            <div id="normalModeToolbar">
              <el-button-group class="mr10">
                <el-button v-if="previewType=='outpreview'" size="mini" type="default" icon="fa fa-code" @click="editHtmlTemplate()">HTML</el-button>
                <el-button size="mini" type="default" icon="fa fa-code" @click="editJscriptTemplate()">脚本</el-button>
                <el-button size="mini" type="default" title="仅预览表格效果，无内容数据" icon="fa fa-search" @click="previewOnlineForm()">打印预览</el-button>
              </el-button-group>

              <el-button-group v-if="previewType=='outpreview'" class="mr10">
                <el-button size="mini" type="default" icon="icon icon-daoru" @click="onlineExcelImport()">上传EXCEL模板</el-button>
                <el-button size="mini" type="default" @click="exportCurrentDataToExcel()" icon="icon icon-daochu">导出到EXCEL</el-button>
              </el-button-group>
              <el-button-group v-if="previewType=='outpreview'" class="mr10">
                <el-button size="mini" type="default" title="清除所有样式" icon="fa  fa-trash" @click="cleanStyle()">清除样式</el-button>
                <el-button size="mini" type="default" title="清空重做" icon="fa  fa-trash" @click="cleanAll()">清空重置</el-button>
                <el-button size="mini" type="default" icon="fa  fa-question" @click="helper()">帮助</el-button>
              </el-button-group>

              <el-button-group v-if="previewType=='outpreview'" class="mr10">
                <el-button size="mini" type="default" icon="fa fa-cog" @click="editFormOptions()">属性设置</el-button>
                <el-button size="mini" type="default" icon="fa fa-save" @click="submitForm()">保存</el-button>
                <el-button size="mini" type="default" icon="fa fa-save" tip="备份当前的表单模板及Javascript脚本" @click="backupForm()">备份模板</el-button>

                <el-button size="mini" type="default" icon="fa fa-trash" tip="删除打印模板" @click="deletePrintTemplate()">删除打印模板</el-button>
              </el-button-group>
            </div>
            <div id="htmlModeToolbar" style="display: none" class="mr10">
              <el-button size="mini" type="default" icon="fa   fa-save" @click="saveEditHtmlTemplate('save')">暂存并返回</el-button>
              <el-button size="mini" type="default" icon="fa   fa-undo" @click="saveEditHtmlTemplate('cancle')">取消并返回</el-button>
              <el-button size="mini" type="default" icon="fa    fa-save" @click="selectTemplateBackup('html')">从备份中还原Html</el-button>
            </div>
            <div id="jscriptModeToolbar" style="display: none" class="mr10">
              <el-button-group>
                <el-button size="mini" type="default" icon="fa   fa-save" @click="saveEditJscriptTemplate('save')">暂存并返回</el-button>
                <el-button size="mini" type="default" icon="fa   fa-undo" @click="saveEditJscriptTemplate('cancle')">取消并返回</el-button>
              </el-button-group>

              <el-button-group class="ml10">
                <el-button size="mini" type="default" icon="fa fa-magic" @click="javascriptFormatter()">格式化美化脚本排版</el-button>
                <el-button size="mini" type="default" icon="fa fa-save" @click="selectTemplateBackup('js')">从备份中还原JS脚本</el-button>
              </el-button-group>
            </div>
          </el-col>
        </el-row>
      </el-header>
      <el-container id="excel_maincontainer">
        <el-aside ref="sideLeft" class="my-aside" :width="isCollapsed?'20px':'300px'" hide-trigger collapsible>
          <div id="left" style="height: 1800px;background-color: #F5F5F7; margin: 0px; padding: 0px; width:100%; overflow-x: hidden; overflow-y: auto">
            <div class="f2bpm-panel-head bg-gray">
              <div v-if="!isCollapsed" style="width: 230px;float: left;">
                <input id="searchKey" type="text" placeholder="输入搜索关键字" class="textBoxAutoShort" style="border: 0px; margin-top: 2px;margin-left: 3px;   height: 24px;">
              </div>
              <div style=" float: right;line-height:35px;padding-right: 5px;">
                <span v-if="!isCollapsed" class="cur fa fa-search mr10" onclick="searchfield()" />
                <span v-if="!isCollapsed" class="cur fa fa-undo mr10" onclick="searchReSet()" />
                <i title="收起/展开" :class="rotateIcon" @click="collapsedSider" />
              </div>
            </div>
            <div v-show="!isCollapsed" class="left-sidebar-nav" style="background-color: #F5F5F7;">
              <div class="group-title">
                <span style="cursor: pointer" onclick="onClickLeftPanel(this, 'drap_ctrs')"><i class="fa  fa-list-alt" style="margin:6px;" />系统字段</span>
              </div>
              <div id="drap_ctrs" class="ctrs" style="padding-left: 3px; padding-right: 3px;display: none;">
                <div class="online-form-item component" ctr_type="extend_process_vars">
                  <label class="component-drag-widget  online-form-label  online-label-label ">
                    <i class="fa fa-text-width" /><span class="label-title">流程应用ID</span></label>
                  <div class="online-input-block online-block-label">
                    <input class="jsonItem" type="hidden" value="AppId">
                  </div>
                </div>
                <div class="online-form-item component" ctr_type="extend_process_vars">
                  <label class="component-drag-widget  online-form-label  online-label-label ">
                    <i class="fa fa-text-width" /><span class="label-title">流程单号</span></label>
                  <div class="online-input-block online-block-label">
                    <input class="jsonItem" type="hidden" value="SheetId">
                  </div>
                </div>

                <div class="online-form-item component" ctr_type="extend_process_vars">
                  <label class="component-drag-widget  online-form-label  online-label-textbox">
                    <i class="fa fa-text-width" />
                    <span class="label-title">当前节点</span>
                  </label>
                  <div class="online-input-block online-block-textbox">
                    <input class="jsonItem" type="hidden" value="CurrentActivityName">
                  </div>
                </div>
                <div class="online-form-item component" ctr_type="extend_process_vars">
                  <label class="component-drag-widget  online-form-label  online-label-textbox">
                    <i class="fa fa-text-width" />
                    <span class="label-title">实例标题</span>
                  </label>
                  <div class="online-input-block online-block-textbox">
                    <input class="jsonItem" type="hidden" value="WorkflowTitle">
                  </div>
                </div>
                <div class="online-form-item component" ctr_type="extend_process_vars">
                  <label class="component-drag-widget  online-form-label  online-label-textbox">
                    <i class="fa fa-text-width" />
                    <span class="label-title">发起时间</span>
                  </label>
                  <div class="online-input-block online-block-textbox">
                    <input class="jsonItem" type="hidden" value="StartedTime">
                  </div>
                </div>
                <div class="online-form-item component" ctr_type="extend_process_vars">
                  <label class="component-drag-widget  online-form-label  online-label-textbox">
                    <i class="fa fa-text-width" />
                    <span class="label-title">结束时间</span>
                  </label>
                  <div class="online-input-block online-block-textbox">
                    <input class="jsonItem" type="hidden" value="FinishedTime">
                  </div>
                </div>
                <div class="online-form-item component" ctr_type="extend_process_vars">
                  <label class="component-drag-widget  online-form-label  online-label-textbox">
                    <i class="fa fa-text-width" />
                    <span class="label-title">发起人部门</span>
                  </label>
                  <div class="online-input-block online-block-textbox">
                    <input class="jsonItem" type="hidden" value="ProcInstCreatorOrgName">
                  </div>
                </div>

                <div class="online-form-item component" ctr_type="extend_process_vars">
                  <label class="component-drag-widget  online-form-label  online-label-textbox">
                    <i class="fa fa-text-width" />
                    <span class="label-title">发起人姓名</span>
                  </label>
                  <div class="online-input-block online-block-textbox">
                    <input class="jsonItem" type="hidden" value="ProcInstCreatorRealName">
                  </div>
                </div>
                <div class="online-form-item component" ctr_type="extend_process_vars">
                  <label class="component-drag-widget  online-form-label  online-label-textbox">
                    <i class="fa fa-text-width" />
                    <span class="label-title">流程名称</span>
                  </label>
                  <div class="online-input-block online-block-textbox">
                    <input class="jsonItem" type="hidden" value="WorkflowName">
                  </div>
                </div>
                <div class="online-form-item component" ctr_type="extend_process_vars">
                  <label class="component-drag-widget  online-form-label  online-label-textbox">
                    <i class="fa fa-text-width" />
                    <span class="label-title">流程状态</span>
                  </label>
                  <div class="online-input-block online-block-textbox">
                    <input class="jsonItem" type="hidden" value="WorkflowInstinceStateName">
                  </div>
                </div>

                <div class="online-form-item component" ctr_type="extend_process_vars">
                  <label class="component-drag-widget  online-form-label  online-label-textbox">
                    <i class="fa fa-text-width" />
                    <span class="label-title">当前日期</span>
                  </label>
                  <div class="online-input-block online-block-textbox">
                    <input class="jsonItem" type="hidden" value="CurrentDate">
                  </div>
                </div>
                <div class="online-form-item component" ctr_type="extend_process_vars">
                  <label class="component-drag-widget  online-form-label  online-label-textbox">
                    <span class="label-title">当前日期时间</span>
                  </label>
                  <div class="online-input-block online-block-textbox">
                    <input class="jsonItem" type="hidden" value="CurrentDateTime">
                  </div>
                </div>
                <div class="online-form-item component" ctr_type="extend_process_vars">
                  <label class="component-drag-widget  online-form-label  online-label-textbox">
                    <i class="fa fa-list" />
                    <span class="label-title">办理过程</span>
                  </label>
                  <div class="online-input-block online-block-textbox">
                    <input class="jsonItem" type="hidden" value="ApproalRecordList">
                  </div>
                </div>
                <div class="online-form-item component" ctr_type="extend_process_vars">
                  <label class="component-drag-widget  online-form-label  online-label-textbox">
                    <i class="fa fa-list" />
                    <span class="label-title">传阅过程</span>
                  </label>
                  <div class="online-input-block online-block-textbox">
                    <input class="jsonItem" type="hidden" value="CirculatedRecordList">
                  </div>
                </div>
                <div class="online-form-item component" ctr_type="extend_process_vars">
                  <label class="component-drag-widget  online-form-label  online-label-textbox">
                    <i class="fa fa-list" />
                    <span class="label-title">流程评论</span>
                  </label>
                  <div class="online-input-block online-block-textbox">
                    <input class="jsonItem" type="hidden" value="ProcessinstCommentList">
                  </div>
                </div>
              </div>
              <div class="group-title" style="display:none">
                <span style="cursor: pointer" onclick="onClickLeftPanel(this, 'drap_pageFields')"><i class="fa  fa-list-alt" style="margin:6px; " />页面组件字段</span>
              </div>
              <div id="drap_pageFields" class="ctrs" style="background-color: #F5F5F7;">
                <ul>
                  <li v-for="pageField in pageFieldList">
                    <div class="online-form-item component" :ctrType="pageField.ctrType" :filedid="pageField.vModel" :id="pageField.vModel" :title="pageField.label" attributes="{type:'pageField',leveltype:'main'}">
                      <label class="component-drag-widget  online-form-label">
                        <i class="fa fa-file-o"></i>{{pageField.label}}</label>
                      <div class="online-input-block"></div>
                    </div>
                  </li>
                </ul>

              </div>

              <div class="group-title">
                <span style="cursor: pointer" onclick="onClickLeftPanel(this, 'drap_fields')"><i class="fa  fa-list-alt" style="margin:6px; " />在线表单字段</span>
                <span style="color:#f37c1f;font-size:12px;padding-left: 10px; "><input id="drapFieldTitle" title="选中此复选框，代表拖拽控件的文字名称到Excel单元格" type="checkbox">名称选取</span>
              </div>
              <div id="drap_fields" class="ctrs" style="background-color: #F5F5F7;" v-html="designerJson.leftfilesHtml" />
            </div>
          </div>
        </el-aside>
        <el-main style="padding: 3px;">
          <div id="contentContainer">
            <div v-show="currentEditType == 'designer'" id="drapDesignContainer" class="drapDesignContainer">
              <div id="onlineExcel" class="onlineExcel f2bpm-sheet-designer" />
            </div>
            <div v-show="currentEditType == 'editHtml'" id="editHtmlTemplateContainer" style="height: 1000px; width: 100%;">
              <textarea id="editHtmlTemplateTextarea" />
            </div>
            <div v-show="currentEditType == 'editJs'" id="editJscriptTemplateContainer" style="height: 1000px; width: 100%;">
              <textarea id="editJscriptTemplateTextarea">{{ jscript }}</textarea>
              <span><em class="em">强烈建议将脚本在本地的开发工具或notepad++等工具上编写好再复制粘贴到表单设计器</em></span>
            </div>
            <div style="height:90px;" />
          </div>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
  // 模拟上下文
  WFContext = { isDesign: true, WorkflowformAction: 0 };
  WFContext.AppId = 'TS';
  WFContext.SheetId = 'TS123';
  WFContext.CurrentActivityName = '测试节点';
  WFContext.ProcInstCreatorRealName = '测试姓名';
  WFContext.ProcInstCreatorOrgName = '测试组织';
  WFContext.WorkflowInstinceStateName = '测试状态';
  WFContext.WorkflowName = '测试流程名称';
  WFContext.WorkflowTitle = '测试流程标题';
  WFContext.FinishedTime = '2021-01-01 12:22:22';
  WFContext.StartedTime = '2021-01-01 12:22:22';
  WFContext.CurrentDate = Object.toGetCurrentDateString();
  WFContext.CurrentDateTime = Object.toGetCurrentDateTimeString();

  window.excel = null;
  //打印模板自己的FormId
  window.formId = Object.toQueryString('formId') || '';


  // 是否为模板设计
  window.isTemplate = 0;
  window.editorHtml = null;
  window.editorJS = null;
  window.onlineSheetName = 'onlineSheet';
  export default {
    data() {
      return {
        wfContext: null,
        previewType: 'outpreview',
        formAction: null,
        isPropertyCollapsed: false,
        isCollapsed: false,
        // editHtml,editJs,designer
        currentEditType: 'designer',
        isShowEditHtml: true,

        // Url参数
        deviceType: 'pc',
        //对应表单的定义ID
        formDefId: '',
        //打印模板自己的FormId
        formId: '',
        isTemplate: 0,
        // 右键相关
        currentRightData: null,
        currentRightParms: null,
        menuVisible: false,
        // 抽屉
        drawerTitle: '查看',
        drawerContent: '',
        drawer: false,
        direction: 'rtl',
        // 表单应用设计JSON
        designerJson: {},
        htmlcontent: '',
        // 数据源
        data: {},
        //数组扁平化的页面组件字段定义
        pageFieldList: [],
        // 页面组件字段数据
        pageFieldData: {},
        jscript: '',
        formProperty: {},
        //打印表单的属性
        optionsData: null,
        printArea: {},
        fieldValue: '组件字段的值'
      };
    },
    computed: {
      rotatePropertyIcon() {
        return this.isPropertyCollapsed ? 'fa fa-angle-double-left' : 'fa fa-angle-double-right';
      },
      rotateIcon() {
        return this.isCollapsed ? 'icon icon-arrow-right-bold cur' : 'icon icon-arrow-left-bold cur';
      }
    },
    created: function () {
      var that = this;
      window.myvm = that;
      that.formId = formId;
      var $parentVue = window.opener.window.myvm;
      that.pageFieldData = Object.toDeepClone($parentVue.pageFieldData);
      that.pageFieldList = Object.toDeepClone($parentVue.pageFieldList);
      that.formDefId = Object.toQueryString('formDefId') || '';
      var res = Object.toAjaxJson(FUI.Handlers.SmartFormHandler, 'getOnlineExcelDesignerJson', { formId: formId });
      if (!res.success) {
        return false;
      }
      that.designerJson = res.data;
      that.wfContext = WFContext;
      that.formProperty = that.designerJson.formProperty;
      that.optionsData = that.formProperty.optionsData;
      if (that.optionsData) {
        var printArea = that.optionsData.find(r => r.ruleCode == 'printArea');
        that.printArea = printArea;
      }
      $('title').html('表单设计-' + that.formProperty.formTitle);
      if (that.designerJson.htmlcontent) {
        that.htmlcontent = that.designerJson.htmlcontent;
        that.jscript = that.designerJson.jscript;
      } else {
        that.htmlcontent = '';
      }
    },
    mounted() {
      var that = this;
      that.initailExcel();

      editorHtml = CodeMirror.fromTextArea(document.getElementById('editHtmlTemplateTextarea'), {
        mode: 'text/javascript',
        indentUnit: 2, // 缩进单位，默认2
        smartIndent: true, // 是否智能缩进
        tabSize: 4, // Tab缩进，默认4
        readOnly: false,
        showCursorWhenSelecting: true,
        height: 900,
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
        height: 900,
        lineNumbers: false,
        continueComments: 'Enter',
        extraKeys: {
          'Ctrl-B': 'toggleComment'
        }
      });
      editorJS.setSize($(window).width() - 500, $(window).height() - 80);

      window.myvm = this;

      setTimeout(function () {
        //控制子表显示
        var subTitleDom = $("div[attributes*='subtable']");
        if (subTitleDom.length > 0) {
          subTitleDom.addClass("onlineexceldesigner-left-subtable-title-block");
          subTitleDom.removeClass("component");
          subTitleDom.removeClass("online-form-item");
        }
      }, 500);
       

    },
    methods: {
      initailExcel() {
        var that = this;
        var browserType = Object.toGetBrowserType();
        if (browserType != 'Chrome') {
          FUI.Window.showMsg('检测到当前浏览器是IE较早前版本，建议使用“谷歌浏览器”获取最佳体验效果！');
        }
        var formName = that.formProperty.formTitle;
        excel = FUI.Excel.Create('onlineExcel');
        excel.excelName = '在线Excel';
        if (that.htmlcontent != '') {
          var sheet = FUI.Excel.getNewSheet({ sheetId: onlineSheetName, sheetName: formName, html: that.htmlcontent });
          // var sheet = FUI.Excel.getNewSheet({ sheetId: "onlineSheet",sheetName:formName, html: "",colNum:20 });
          excel.sheets.push(sheet);
        } else {
          var sheet = FUI.Excel.getNewSheet({ sheetId: onlineSheetName, sheetName: formName, html: '', rowNum: 31 });
          excel.sheets.push(sheet);
        }
        excel.bind();
        that.setExcelWidth(excel);
      },
      setExcelWidth(excel) {
        var that = this;
        if (excel && that.printArea && that.printArea.ruleParams && that.printArea.ruleParams.excelWidth && that.printArea.ruleParams.excelWidth > 200) {
          var excelWidth = that.printArea.ruleParams.excelWidth;
          $(".f2bpm-sheet-table").width(excelWidth + "px");
        } else {
          $(".f2bpm-sheet-table").width("");
        }
      }
      , importExcelJsonData(dataJson) {
        excel.reloadSheetData(onlineSheetName, dataJson);
      },
      // 通过后台导出到Excel
      exportCurrentDataToExcel() {
        var data = excel.getSheetData(onlineSheetName);
        console.info(data);
        var currentDataJson = JSON.stringify(data);
        Object.toAjaxDownloadFile(FUI.Handlers.SmartFormHandler, 'downloadOnlineExcelJsonToExcelFile', currentDataJson, true);
      },
      saveAs(obj, fileName) {
        var tmpa = document.createElement('a');
        tmpa.download = fileName || '下载';
        tmpa.href = URL.createObjectURL(obj); // 绑定a标签
        tmpa.click(); // 模拟点击实现下载
        setTimeout(function () { // 延时释放
          URL.revokeObjectURL(obj); // 用URL.revokeObjectURL()来释放这个object URL
        }, 100);
      },
      cleanStyle() {
        excel.cleanSheetStyle(onlineSheetName);
      },
      importDemoJson() {
        var that = this;

      },
      collapsedSider() {
        this.isCollapsed = !this.isCollapsed;
      },
      propertyCollapsedSider() {
        this.isPropertyCollapsed = !this.isPropertyCollapsed;
      },
      closeEdit() {
        FUI.Window.closeEdit();
      },
      drawerClose(done) {
        done();
      },
      onStyleClick(vueObj) {
        var that = this;
        WF.SelectorDialog.selectTextEditor(that, 'style', '编辑样式', '样式内容', '编辑为Style样式内容，如：border: 1px solid #DDDDDD;', '只能填写style样式内容，注意使用标准写法，如：border: 1px solid #DDDDDD;', null, null, vueObj);
      },
      submitForm() {
        var that = this;
        var html = excel.getSheetTableHtmlBySheetId(onlineSheetName);
        that.htmlcontent = html;
        Object.toAjaxJson(FUI.Handlers.SmartFormHandler, 'saveFormDesigner', {
          'isTemplate': 0,
          'TemplateContent': that.htmlcontent,
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
        this.htmlcontent = '';
        // excel.reloadSheetHtml(onlineSheetName, "");
        excel.clearSheetHtml(onlineSheetName);
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
        FUI.Window.openEdit(__webpath + '/workflow/smartForm/onlineExcelOptionsEdit/?formId=' + formId + '&formDefId=' + that.formDefId, '属性设置', 'Edit', '', 660, 450, null, null, formId);
      },
      previewOnlineForm() {
        var that = this;
        var html = excel.getSheetTableHtmlBySheetId(onlineSheetName);
        that.htmlcontent = html;
        FUI.Window.open(__webpath + '/workflow/smartForm/onlineExcelView?isPrintPreview=1&formId=' + formId);
      },
      deletePrintTemplate() {
        var that = this;
        var formId = that.formId;
        FUI.Window.confirm('您确定要删除本打印模板吗？', '温馨提示', function () {
          Object.toAjaxJson('/workflow/smartForm/', 'deletePrintTemplate', { formId: formId }, true, null,
            function (res) {
              if (res.success) {
                FUI.Window.showMsg(res.msg, null, res.success ? 1 : 7, function () {
                  window.close();
                });
              } else {
                FUI.Window.showMsg(res.msg);
              }
            }
          );
        });
      }
      , backupForm() {
        var that = this;
        var html = excel.getSheetTableHtmlBySheetId(onlineSheetName);
        that.htmlcontent = html;
        if (that.htmlcontent.length == 0) {
          FUI.Window.showMsg(that, '当前模板为空，备份失败！');
          return false;
        }
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
        var html = excel.getSheetTableHtmlBySheetId(onlineSheetName);
        html = HTMLFormat(html);
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
          var html = editorHtml.getValue();
          that.htmlcontent = html;
          excel.reloadSheetHtml(onlineSheetName, html);
        } else if (actionType == 'cancle') {

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
      // 选择备份的历史表单模板列表
      selectTemplateBackup(restoreType) {
        var that = this;
        var typeMsg = that.currentEditType == 'editHtml' ? 'Html' : 'JavaScript脚本';
        var parm = {
          singleSelect: true,
          data: [],
          formId: formId
        };
        FUI.dialog(__webpath + '/workflow/selector/selectTemplateBackup/?formId=' + formId, '选择备份的表单模板', parm, 800, 520, function (objectData, index, layer) {
          if (objectData.length == 1) {
            var id = objectData[0].Id;
            var name = objectData[0].FormName;
            var Remark = objectData[0].Remark;
            var time = Object.toJsonDateTimeFormatter(objectData[0].CreatedTime);

            FUI.Window.confirm('您确定使用【表单名称：“' + name + '”;备份时间:“' + time + '”;备注为:“' + Remark + '”】的版本复盖当前编辑中的【' + typeMsg + '】模板吗？', '温馨提示', function () {
              that.restoreFromBackup(id);
            });
          } else if (objectData.length > 1) {
            FUI.Window.showMsg2('只能选择一个要还原的模板！');
          }
          layer.close(index);
        }, true);
      },
      // 从备份中的模板中还原
      restoreFromBackup(backupId) {
        var that = this;
        var data = Object.toAjaxJson(FUI.Handlers.SmartFormHandler, 'getBackupFormHtml', {
          type: that.deviceType,
          id: backupId
        });
        if (data.success == undefined && data.formName) {
          if (that.currentEditType == 'editHtml') {
            var templateHtml = that.deviceType == 'pc' ? data.templateContent : data.mobileTemplateContent;
            var templateHtml = HTMLFormat(templateHtml);
            editorHtml.setValue(templateHtml);
            FUI.Window.showMsg(that, '还原Html模板成功', null, 1);
          }
          if (that.currentEditType == 'editJs') {
            var scriptStr = that.deviceType == 'pc' ? data.templateContentJavaScript : data.mobileTemplateJavaScript;
            editorJS.setValue(scriptStr);
            FUI.Window.showMsg(that, '还原JavaScript脚本成功', null, 1);
          }
        } else {
          FUI.Window.showMsg(that, data.msg);
        }
      },
      generateId(ctrtype, id) {
        var that = this;
        var newId = 'form_item_' + Object.toGuid(false);
        if (id == 'field') {
          newId = ctrtype + '_' + Object.toGetTimeRandomNum();
        }
        that.activeProperty.id = newId;
      },
      downloadHtmlTemplate() {
        var that = this;
        var html = excel.getSheetTableHtmlBySheetId(onlineSheetName);
        this.htmlcontent = html;
        var html = this.htmlcontent;
        var jscript = this.jscript;
        var r = Object.toAjaxDownloadFile(FUI.Handlers.SmartFormHandler, 'downloadFormTemplate', {
          'isTemplate': isTemplate,
          'TemplateContent': html,
          'jscriptContent': jscript,
          type: that.deviceType,
          formId: that.formId
        });
      },
      refreshcache() {
        var that = this;
        Object.toAjaxJson(FUI.Handlers.WorkflowManageHandler, 'refreshcache', null, null, null, function (data) {
          FUI.Window.showMsg(that, data.msg, null, 1);
        });
      },
      helper() {
        var msg = '1、设计操作方法与办公软件“Excel”类似，但并非真正的Excel，只支持极常规简单的操作。</br>2、建议下载示例Excel表格模板，在本地Excel中画表格，然后导入。</br>3、默认为A4纸的宽度，即最右边为L列，如果有调整也可以在属性中设置打印的“行”或“列”边界。 <br>4、打印时会以当前页面的大小自动按比例缩放至最佳的大小适应打印纸大小，打印会调用浏览器的打印功能。';
        FUI.Window.showMsg(null, msg, null, 1);
      }
      , onlineExcelImport() {
        var that = this;
        FUI.Window.openEdit(__webpath + '/workflow/smartForm/onlineExcelImport', '上传Excel表格', FUI.FormAction.Edit, '', 550, 450);
      }
    }
  };
  window.onlineExcelImportJson = function (jsonStr) {
    if (jsonStr != false && jsonStr != "") {
      console.info(jsonStr);
      var jsonObj = eval("(" + jsonStr + ")");
      window.myvm.importExcelJsonData(jsonObj);
    }
  };
  window.searchfield = function () {
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
  };

  window.searchReSet = function () {
    $('#searchKey').val('');
    var list = $('#onlineFormFileList');
    $('li', list).show();
  };

  window.onClickLeftPanel = function (thisObj, id) {
    $('#' + id).toggle();
  };

  $(function () {
    $('body').css('overflow-y', 'auto');
    $('body').css('overflow-x', 'hidden');
  });
  $(function () {
    // $("#contentContainer").height($(window).height() - 50);
    // $("#left").height($(window).height() - 50);
    // $(".el-main").height($(window).height() + 350);

    // 			$("#contentContainer").width($(window).width() - 180);
    $(window).resize(function () {
      // $("#contentContainer").height($(window).height() - 50);
      // $("#left").height($(window).height() - 50);
      // $(".el-main").height($(window).height() + 350);
      // 				$("#contentContainer").width($(window).width() - 180);
    });
  })
</script>
<style lang="scss" scoped>
  @import "/static/f2bpmUI/onlineExcel/exceldesigner.css";
</style>