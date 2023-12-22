<template>
  <div class="publish-root-worklfowform-container" style="overflow: hidden;">
    <div id="WorkflowformContainer" class="online-workflowform">
      <!--顶部按钮 -->
      <div id="wftoolbar" class="wf_buttons_bar" style="margin-bottom: 0px;clear: both;">
        <div id="sendButtomDiv" class="workflow-buttonaction-toolbar">
          <el-button v-show="isHaveFormCustButtonPower(btn)" :key="bIndex" v-for="(btn,bIndex) in pageBaseInfo.buttons" :id="btn.actionName" type="button" :type="btn.btnType" size="small" @click="buttonAction(btn)"><i :class="btn.icon&&btn.icon.indexOf('icon')>-1?'icon '+btn.icon: 'fa '+btn.icon" /><span v-html="btn.buttonName" />
          </el-button>
        </div>
      </div>
      <!--详细信息-->
      <el-scrollbar class="container-scroll-bar workflow-form-content-height" style="overflow: auto;">
        <div id="WorkflowContentDiv" class="workflow-form-content-detail-container" style="clear: both;overflow:hidden;padding-top: 10px;" border="false">
          <!--表单内容-->
          <div id="formDetail">
            <div id="mainWorkformContainer" class="FormViewContainer" style="position: relative; ">
              <el-form ref="formRef" :rules="formRules" size="small" :label-position="formProperty.titlePosition" :model="data" class="f2bpm-workform" :label-width="formProperty.labelWidth">
                <div v-for="(row, row_index) in fields" :key="row_index" :id="row.id" :ordernum="row.orderNum" class="drag-row drag-box">
                  <div class="view">
                    <div v-show="row.showLabel" :class="row.showPrefixSpaced?'form-section-title mt10':'form-section-title'"  :style="row.sectionStyle">
                      <span class="sectionPrefixBlueBar" v-if="row.showPrefixBar"></span>
                      <span class="section-title" v-html="langTitle(row)"></span>
                      <span v-if="row.collapse!==0&&row.collapse!==undefined" @click="onRowCollapseClick(row)" :class="rowCollapseIcon(row)"></span>
                    </div>
                    <el-row class="row-fluid clearfix" rowdetail="row.id" v-show="!row.collapse" :style="row.style" :gutter="row.gutter">
                      <el-col v-for="(col, col_index) in row.children" :id="col.id" :key="col_index" :rowid="row.id" :style="col.style" class="column" :span="col.span">
                        <div v-if="field.ctrType!='hidden'" v-for="(field, field_index) in col.children" :id="field.id" :key="field_index" :fieldId="field.fieldId" :orderNum="field.orderNum" :ctrType="field.ctrType" class="online-form-item component">
                          <el-form-item v-show="field._isShowPower" :label-width="field.labelWidth">
                            <span v-show="field.showLabel&&field.ctrType!='hidden'&&field.ctrType!='extend_table'" slot="label" :style="field.style">
                              <em v-if="field._isRequired" class="red mr2">*</em>
                              <span v-html="langTitle(field)" />
                              <span v-if="field.helperArticle!=''&&field.helperArticle!=undefined" class="fa fa-question-circle-o" title="点击查看说明" @click="openHelperArticle(field.helperArticle)" />
                              {{ field.labelSuffix }}
                            </span>
                            <f2bpm-onlineformitem v-if="!field.isContainer&&field.ctrType!='extend_tabs'&&field.ctrType!='extend_container'" :parentdata="data" :field="field" :fieldvalue="data[field.vModel]" @rendercomponent="renderComponent" @updatevalue="updateFieldValue" @appendfieldvalue="appendFieldValue" />
                            <el-tabs v-else-if="field.ctrType=='extend_tabs'" :value="field.tabSelected" :tab-position="field.tabPosition" :type="field.tabType" @tab-click="tabsClick(field,$event)">
                              <el-tab-pane v-for="tab in field.children" :label="langTitle(tab)" class="container" :rowid="row.id" :colid="col.id" :ordernum="tab.orderNum" :container_id="field.id" :subcontainer_id="tab.id" :tabsid="field.id" :tabid="tab.id" :name="tab.label">
                                <div v-for="_row in tab.children" :id="_row.id" :key="_row.orderNum" :parent_rowid="row.id" :parent_colid="col.id" :container_id="field.id" :subcontainer_id="tab.id" :ordernum="_row.orderNum" class="drag-row drag-box">
                                  <div class="view">
                                    <div v-show="_row.showLabel" class="form-section-title" :style="_row.sectionStyle">{{ _row.label }}</div>
                                    <el-row class="row-fluid clearfix" :style="_row.style" :gutter="_row.gutter">
                                      <el-col :id="_col.id" v-for="(_col, _col_index) in _row.children" :parent_rowid="row.id" :parent_colid="col.id" :key="_col_index" :container_id="field.id" :subcontainer_id="tab.id" :rowid="_row.id" :style="_col.style" class="column container_column" :span="_col.span">
                                        <div v-if="_field.ctrType!='hidden'" :id="_field.id" class="online-form-item component" :fieldId="_field.fieldId" :parent_rowid="row.id" :parent_colid="col.id" v-for="(_field, _field_index) in _col.children" :container_id="field.id" :subcontainer_id="tab.id" :key="_field_index" :colId="_col.id" :rowId="_row.id" :vmodel="_field.vModel" :orderNum="_field.orderNum" :ctrType="_field.ctrType">
                                          <el-form-item v-show="_field._isShowPower" :label-width="_field.labelWidth?_field.labelWidth:'90px'">
                                            <span v-show="_field.showLabel" slot="label" :style="_field.style">
                                              <em v-if="_field._isRequired" class="red mr2">*</em><span v-html="langTitle(_field)" />
                                              <span v-if="_field.helperArticle!=''&&_field.helperArticle!=undefined" class="fa fa-question-circle-o" title="点击查看说明" @click="openHelperArticle(_field.helperArticle)" />
                                              {{ _field.labelSuffix }}
                                            </span>
                                            <f2bpm-onlineformitem v-if="!_field.isContainer&&_field.ctrType!='extend_tabs'&&_field.ctrType!='extend_container'" :parentdata="data" :field="_field" :fieldvalue="data[_field.vModel]" @rendercomponent="renderComponent" @updatevalue="updateFieldValue" @appendfieldvalue="appendFieldValue" />
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
                                  <div class="view">
                                    <div v-show="_row.showLabel" class="form-section-title" :style="_row.sectionStyle">{{ langTitle(_row) }}</div>
                                    <el-row class="row-fluid clearfix" :style="_row.style" :gutter="_row.gutter">
                                      <el-col :id="_col.id" v-for="(_col, _col_index) in _row.children" :parent_rowid="row.id" :parent_colid="col.id" :key="_col_index" :container_id="field.id" :subcontainer_id="tab.id" :rowid="_row.id" :style="_col.style" class="column container_column" :span="_col.span">
                                        <div v-if="_field.ctrType!='hidden'" :id="_field.id" class="online-form-item component" :fieldId="_field.fieldId" :parent_rowid="row.id" :parent_colid="col.id" v-for="(_field, _field_index) in _col.children" :container_id="field.id" :subcontainer_id="tab.id" :key="_field_index" :colId="_col.id" :rowId="_row.id" :vmodel="_field.vModel" :orderNum="_field.orderNum" :ctrType="_field.ctrType">
                                          <el-form-item v-show="_field._isShowPower" :label-width="_field.labelWidth?_field.labelWidth:'90px'">
                                            <span v-show="_field.showLabel" slot="label" :style="_field.style">
                                              <em v-if="_field._isRequired" class="red mr2">*</em><span v-html="langTitle(_field)" />
                                              <span v-if="_field.helperArticle!=''&&_field.helperArticle!=undefined" class="fa fa-question-circle-o" title="点击查看说明" @click="openHelperArticle(_field.helperArticle)" />
                                              {{ _field.labelSuffix }}
                                            </span>
                                            <f2bpm-onlineformitem v-if="!_field.isContainer&&_field.ctrType!='extend_tabs'&&_field.ctrType!='extend_container'" :parentdata="data" :field="_field" :fieldvalue="data[_field.vModel]" @rendercomponent="renderComponent" @updatevalue="updateFieldValue" @appendfieldvalue="appendFieldValue" />
                                          </el-form-item>
                                        </div>
                                      </el-col>
                                    </el-row>
                                  </div>
                                </div>
                              </div>
                            </el-container>
                            <div class="table-container-div" v-else-if="field.ctrType=='extend_table'">
                              <div :style="field.sectionStyle" v-show="field.showLabel"><span v-html="langTitle(field)"></span></div>
                              <table id="field.id" :style="'border-collapse: collapse;width:'+field.tableWidth+';'+field.style">
                                <tr :style="'height:'+field.rowHeight+'px;'+tr.style" v-for="tr in field.children" :rowid="row.id" :colid="col.id" :container_id="field.id" :subcontainer_id="tr.id">
                                  <td :style="getColWidths(field,tdIndex)+field.cellStyle" v-for="(td,tdIndex) in tr.children" class="container" :rowid="row.id" :colid="col.id" :container_id="field.id" :subcontainer_id="tr.id" :sub2container_id="td.id">
                                    <div v-for="_row in td.children" :id="_row.id" :key="_row.orderNum" :parent_rowid="row.id" :parent_colid="col.id" :container_id="field.id" :subcontainer_id="tr.id" :sub2container_id="td.id" :ordernum="_row.orderNum" class="drag-row drag-box">
                                      <div v-show="_row.showLabel" class="form-section-title" :style="_row.sectionStyle">{{langTitle(_row) }}</div>
                                      <el-row class="row-fluid clearfix" :style="_row.style" :gutter="_row.gutter">
                                        <el-col :id="_col.id" v-for="(_col, _col_index) in _row.children" :parent_rowid="row.id" :parent_colid="col.id" :key="_col_index" :container_id="field.id" :subcontainer_id="tr.id" :sub2container_id="td.id" :rowid="_row.id" :style="_col.style" class="column container_column" :span="_col.span">
                                          <div v-for="(_field, _field_index) in _col.children" v-if="_field.ctrType!='hidden'" :id="_field.id" class="online-form-item component" :fieldId="_field.fieldId" :parent_rowid="row.id" :parent_colid="col.id" :container_id="field.id" :subcontainer_id="tr.id" :sub2container_id="td.id" :colId="_col.id" :key="_field_index" :rowId="_row.id" :vmodel="_field.vModel" :orderNum="_field.orderNum" :ctrType="_field.ctrType">
                                            <el-form-item v-show="_field._isShowPower" :label-width="_field.labelWidth?_field.labelWidth:'90px'">
                                              <span v-show="_field.showLabel" slot="label" :style="_field.style">
                                                <span v-html="langTitle(_field)" />
                                                <span v-if="_field.helperArticle!=''&&_field.helperArticle!=undefined" class="fa fa-question-circle-o" title="点击查看说明" />
                                                {{ _field.labelSuffix }}
                                              </span>
                                              <f2bpm-onlineformitem v-if="!_field.isContainer&&_field.ctrType!='extend_tabs'&&_field.ctrType!='extend_container'" :parentdata="data" :field="_field" />
                                            </el-form-item>
                                          </div>
                                        </el-col>
                                      </el-row>
                                    </div>
                                  </td>
                                </tr>
                              </table>
                            </div>
                          </el-form-item>
                        </div>
                      </el-col>
                    </el-row>
                  </div>
                </div>
              </el-form>
            </div>
          </div>
        </div>
        <div class="workflow-form-content-bottom-empty-space">
          <div class="workflow-form-content-bottom-empty-space-content">
          </div>
        </div>
      </el-scrollbar>
      <!--详细信息结束-->
    </div>
  </div>
</template>

<script>



  import '@/resources/f2bpmUI/onlineForm/components/f2bpm-approvalrecordlist.js';
  import '@/resources/f2bpmUI/onlineForm/components/f2bpm-circulatedrecordlist.js';
  import '@/resources/f2bpmUI/onlineForm/components/f2bpm-commentrecordlist.js';
  import f2bpmApprovalAction from '@/views/workflow/components/workflow/f2bpm-approval-action.vue';
  import f2bpmProcessinstfilelist from '@/views/workflow/components/workflow/f2bpm-processinstfilelist.vue';
  import { B } from 'pdfjs-dist';
  export default {
    components: {
      f2bpmApprovalAction, f2bpmProcessinstfilelist
    },
    data() {
      return {
        scrollerHeight: 300,
        workflowTitleIsDisabled: false,
        isReadOnly: false,
        deviceType: 'pc',
        // 子表组件的Key
        subtableKey: '101',
        // url参数
        myId: '',
        formId: '',
        formKey: '',
        formAction: null,
        // 打印模板的ID
        printFormId: '',
        // 页面流程数据
        indexJson: null,
        // 流程上下文
        wfContext: {},
        // 在线表单业务数据
        onLineFormData: [],
        // 基础展示信息
        pageBaseInfo: { workflowTitle: '' },
        // 表单应用设计JSON
        designerJson: {},
        // Html渲染的字段域
        fields: [],
        // 被公式引用到的字段,key为字段名，value为多个数组公式
        mathFieldList: {},
        // 数组扁平化的字段定义
        fieldList: [],
        // 扁平化的字段定义
        fieldsDef: {},
        jscript: '',
        formProperty: {},
        // 流程自己的数据，比如表单内的审批意见
        workflowformData: {
          hidOpinion: ''
        },
        //自定义按钮权限
        formCustButtonPowers: {},
        // 表单字段数据
        data: {},
        // 评论抽屉
        drawerTitle: '流程评论',
        drawerContent: '',
        drawer: false,
        direction: 'rtl',
        commentData: {
          content: '',
          total: 0,
          data: []
        },
        // stand:表单校验规则
        formRules: {
        }
      };
    }, computed: {
      isHaveShowPower() {
        return function (field) {
          return FUI.F2Grid.isHaveShowPower(field.vModel);
        };
      }
      , getColWidths() {
        return function (field, colIndex) {
          var item = field.colWidths.find(a => a.colnum == (colIndex + 1));
          if (item != null && item.width != "") {
            return "width:" + item.width + ";";
          }
          return "";
        };
      }
      , langTitle() {
        return function (item) {
          var enTitle = item.alias;
          if (enTitle == "" || enTitle == null) {
            enTitle = item.label;
          }
          var zhTitle = item.label;
          return this.language == 'en-US' ? enTitle : zhTitle;
        };
      }
      , rowCollapseIcon() {
        return function (row) {
          var icon = row.collapse == true ? 'el-icon-arrow-down' : 'el-icon-arrow-up';
          return 'onlineform-row-collapse-button ' + icon;
        };
      }
    },
    mounted: function () {
      var that = this;

      that.$nextTick(function () {
        // 这里是在子组件全部执行完后才触发 ，确保子组件也挂载完毕
        f2grid_global_mainVueLoadComplated = true;
        that.loadUrlParmsToData();
        // 加载表单的动态脚本
        if (that.jscript) {
          const script = document.createElement('script');
          script.type = 'text/javascript';
          script.text = `
          console.info('========加载表单动态脚本==========');
            //========加载表单动态脚本==========
            ${that.jscript}
          `;
          document.getElementsByTagName('head')[0].appendChild(script);
          if (Object.toIsExitsFunction('extend_fuiOnPageLoad')) {
            // 执行迁移条件
            window.extend_fuiOnPageLoad();
          }
        }
      });
      $('body').addClass('overnone');
      that.scrollerHeight = window.innerHeight - 60;
      $(window).resize(function () {
        that.scrollerHeight = window.innerHeight - 60;
      });
      $('.workflow-form-content-height').height(that.scrollerHeight);
      that.resizeEmptySpaceHeight();
    },
    beforeCreate: function () {
      var that = this;
      // 获取到data
      // var data = that.$options.data();
    },
    created: function () {
      var that = this;
      window.myvm = this;
      that.language = that.$store.state.app.language;
      var myId = Object.toQueryString('myId') || '';
      var formKey = Object.toQueryString('formKey') || '';
      var formAction = Object.toQueryString('formAction') || '';
      var formId = Object.toQueryString('formId') || '';
      that.myId = myId;
      that.formId = formId;
      that.formKey = formKey;
      that.formAction = formAction;
      if (formAction > 2) {
        that.isReadOnly = true;
        that.workflowTitleIsDisabled = true;
      }
      // 加载页面Model数据
      var indexJson = Object.toAjaxJson('/workflow/noWorkflowform/', 'getIndexJson', { myId: myId, formId: formId, formKey: formKey, formAction: formAction });
      that.indexJson = indexJson;
      that.pageBaseInfo = indexJson.pageBaseInfo;
      that.wfContext = indexJson.JSWorkflowContext;
      that.wfContext.formRightJson = indexJson.FormRightJson;
      that.wfContext.formCustButtonRightJson = indexJson.FormCustButtonRightJson;
      that.printFormId = indexJson.pageBaseInfo.printFormId;
      // 将权限数组转为对象
      $.each(that.wfContext.formRightJson, function (index, item) {
        var name = item.name;
        that.wfContext.formRightJson[name] = item;
      });

      WFContext = that.wfContext;
      WFContext.deviceType = that.deviceType;
      that.taskState = WFContext.TaskState;
      that.taskIsValid = WFContext.TaskIsValid;
      that.taskValid();

      $('title').html('表单-' + that.wfContext.WorkflowTitle);
      if (that.wfContext.CurrentIsModifyProcInstTitle != true && WFContext.CurrentActivityType != 'Start') {
        that.workflowTitleIsDisabled = true;
      }
      var onLineFormData = that.indexJson.OnlineFormHtml.busObjectDataJson;
      // 加载表单模板渲染
      that.designerJson = that.indexJson.OnlineFormHtml;
      that.formProperty = that.designerJson.formProperty;
      if (that.designerJson.htmlfields) {
        that.fields = that.designerJson.htmlfields;
        that.jscript = that.designerJson.jscript;
      }
      // 收集字段定义（纯字段扁平化）
      FUI.F2Grid.collectField(that, that.fields);
      // 收集被公式引用到的字段名
      that.mathFieldList = FUI.F2Grid.getMathFieldList(that.fieldList);

      if (that.fields && that.fields.length > 0) {
        // 初始化data的结构
        FUI.F2Grid.initailData(that, that.fields);
        var busObjectDataJson = that.designerJson.busObjectDataJson;
        onLineFormData = busObjectDataJson;
        that.onLineFormData = onLineFormData;
      } else {
        that.fields = [];
      }

      if (that.wfContext.FormType == 'OnlineForm') {
        // 在线表单数据
        that.loadOnlineFormData(onLineFormData);
        that.loadFormCustButtonPermission();
      }
      FUI.Form.initailConfigTypeComboBox(this);
    },
    methods: {
      resizeEmptySpaceHeight() {
        let that = this;
        let scrollerHeight = that.scrollerHeight;
        setTimeout(function () {
          let WorkflowContentDivHeight = $("#WorkflowContentDiv").height();
          var spaceHeight = scrollerHeight - WorkflowContentDivHeight - 10;
          console.info("scrollerHeight:" + scrollerHeight, WorkflowContentDivHeight, spaceHeight);
          $(".workflow-form-content-bottom-empty-space-content").height(spaceHeight);
        }, 300);
      },
      //拟搞时将Url字段参数填写到表单上
      loadUrlParmsToData() {
        var that = this;
        if (that.wfContext.WorkflowformAction == 0) {
          var urlParms = Object.toQueryParmJson();
          console.info(urlParms);
          $.each(urlParms, function (key, value) {
            if (that.data.hasOwnProperty(key)) {
              that.data[key] = value;
            }
          });
        }
      }
      , loadOnlineFormData(onLineFormData) {
        var that = this;
        if (WFContext.WorkflowformAction != 0 &&
          onLineFormData.length > 0 && onLineFormData != undefined &&
          onLineFormData != null && onLineFormData[0].data != null &&
          onLineFormData[0].data != undefined) {
          try {
            FUI.F2Grid.load(that, onLineFormData);
          } catch (err) {
            FUI.Window.showMsg('表单数据获取失败，请联系管理员！');
          }
        } else {
          // FUI.F2Grid.bindAllMainTableMathEvent();
          // FUI.F2Grid.doSomething();
        }
      },
      isHaveFormCustButtonPower(btn) {
        var that = this;
        var isHavePoser = true;
        if (btn.type && btn.type == 'cust' && that.formCustButtonPowers.hasOwnProperty(btn.buttonName) && that.formCustButtonPowers[btn.buttonName].isShow == false) {
          isHavePoser = false;
        }
        return isHavePoser;
      }
      //表单属性里的自定义按钮权限
      , loadFormCustButtonPermission() {
        var that = this;
        // 格式：字段名:{isShow:true }
        var formCustButtonPowers = {};
        if (that.pageBaseInfo.buttons && that.pageBaseInfo.buttons.length > 0) {
          $.each(that.pageBaseInfo.buttons, function (index, btn) {
            if (btn.type && btn.type == 'cust') {
              var fieldName = btn.buttonName;
              var isShow = FUI.F2Grid.isHaveWritePower(fieldName);
              if (btn.icon == "" && btn.actionName == 'print') {
                btn.icon = "fa-print";

              }
              if (btn.actionName == 'print' && that.wfContext.WorkflowformAction == 0) {
                isShow = false;
              }
              formCustButtonPowers[fieldName] = { isShow: isShow };
            }
          });
          that.formCustButtonPowers = formCustButtonPowers;
        }
      },
      commentDelete(id) {
        var that = this;
        var res = Object.toAjaxJson(FUI.Handlers.WorkflowBusinessHandler, 'commentDelete', { keyId: id });
        if (res.success) {
          that.loadComment();
        } else {
          FUI.Window.showMsg(res.msg);
        }
      },
      sendComment() {
        var that = this;
        if (that.commentData.content == '') {
          FUI.Window.showMsg2(null, '请填写评论内容');
          return false;
        }
        var parm = {
          formAction: 'Add',
          WorkflowInstanceId: that.wiid,
          message: that.commentData.content
        };
        var res = Object.toAjaxJson(FUI.Handlers.WorkflowBusinessHandler, 'saveComment', parm);
        if (res.success) {
          that.commentData.content = '';
          that.loadComment();
        }
      },
      loadComment() {
        var that = this;
        var parm = {};
        parm.wiid = that.wiid;
        parm.page = 1;
        parm.rows = 10000;
        parm.sort = 'createdTime';
        parm.order = 'asc';
        var res = Object.toAjaxJson(FUI.Handlers.WorkflowBusinessHandler, 'loadProcessInstanceComment', parm, true, null, function (res) {
          if (res.success) {
            that.commentData.data = res.rows;
            that.commentData.total = res.total;
          } else {
            FUI.Window.showMsg(that, res.msg);
          }
        });
      },
      taskValid() {
        var that = this;
        // 任务有效性检查 4待阅 2待办
        if (that.formAction != 0 && (that.formAction <= 2 || that.formAction == 4)) {
          if (WFContext.TaskState == 2 || WFContext.TaskState == 99 || WFContext.TaskIsValid == false) {
            FUI.Window.showMsg(that, '当前任务已失效，任务可能已被处理', null, null, function () {
              if (window.opener != null) {
                window.opener.window.refreshTargetGrid('grid');
                window.close();
              } else {
                FUI.Window.closeEdit(true, 'grid');
              }
            });
          }
        }
      },
      // 按钮动作
      buttonAction(butItem) {
        var that = this;
        if (butItem.actionName) {
          var fun = butItem.actionName;
          if (butItem.type == 'cust' && butItem.actionName == 'print') {
            //默认的模板打印
            if (!that.printFormId) {
              var res = Object.toAjaxJson('/workflow/workflowform/', 'getPrintFormId', { wfformId: that.formId });
              if (res.success) {
                that.printFormId = res.data;
              }
            }
            if (that.printFormId == '' || that.printFormId == null || that.printFormId == undefined) {
              // 判断有没有打印模板，没有时则使用打印页面
              printTable(butItem.beforeFn);
            } else {
              printExcelTable(butItem.beforeFn, '', "", that.printFormId);
            }
          }
          else if (butItem.type == 'cust' && butItem.excuteFn) {
            var isExist = Object.toIsExitsFunction(butItem.excuteFn);
            if (isExist) {
              var exfunc = eval(butItem.excuteFn);
              exfunc(that, that.data);
            }
          }
          else if (that[fun]) {
            var fn = that[fun];
            fn(butItem);
          } else {
            switch (butItem.actionName) {
              case 'flowmap': {
                showWorkflowMap(butItem.beforeFn);
              }
                break;
              case 'print': {
                // printTable(butItem.beforeFn);
                printExcelTable(butItem.beforeFn, that.wfContext.FormId, that.wfContext.WorkflowInstanceId);
              }

                break;
              case 'approvalHistory': {
                showHistoryApproval(butItem.beforeFn);
              }

                break;
              case 'showCirculatedHistory': {
                showCirculatedHistory(butItem.beforeFn);
              }

                break;
              case 'taskCommunication': {
                openSendNextTaskCommunication(butItem.beforeFn);
              }

                break;
              case 'complateTaskCommunication': {
                openComplateTaskCommunicationDialog();
              }

                break;
              case 'taskCommunicationList': {
                showHistoryTaskCommunication(butItem.beforeFn);
              }

                break;
              case 'send': {
                var success = that.validateForm('formRef');
                if (!success) return;
                openSendDialog(that, butItem.beforeFn);
              }

                break;
              case 'invalid': {
                invalidWorkflow(that, butItem.beforeFn);
              }

                break;
              case 'taskclaim': {
                taskclaim(that, butItem.beforeFn);
              }

                break;
              case 'sendCirculated': {
                openCirculatedActor(that, butItem.beforeFn);
              }
                break;
              case 'setDoneCirculated': {
                setDoneCirculated(that, butItem.beforeFn);
              }
                break;
              case 'sendReferred': {
                openReferredActor(that, butItem.beforeFn);
              }

                break;
              case 'reject': {
                openRejectActorSelected(that, butItem.beforeFn);
              }

                break;
              case 'comment': {
                that.openComment(butItem);
              }

                break;
            }
          }
        }
      },
      save(butItem) {
        var that = this;
        //校验子表行数必须
        if (that.validateRequiredNumOfRows() === false) {
          return;
        }
        //如果有则调用前置事件的扩展
        if (Object.toIsExitsFunction("extend_saveWorkflowForm_before")) {
          var isExtendValidatePass = extend_saveWorkflowForm_before();
          if (isExtendValidatePass == false) {
            return;
          }
        }
        var beforeFn = butItem.beforeFn;
        if (that.wfContext.FormType == 'UrlForm') {
          var resultMsg = submitUrlFormMethod(that, butItem, "validateWorkflowForm");
          if (typeof resultMsg == "boolean" && resultMsg === false) {
            return false;
          }
          else if (typeof resultMsg == "string" && resultMsg != "") {
            FUI.Window.showMsg(resultMsg);
            return false;
          }
        } else {
          var success = that.validateForm('formRef');
          if (!success) return;
        }
        saveNoWorkflowfrom(false, beforeFn);
      },
      showWorkflowMap(butItem) {
        var that = this;
        var url = __webpath + '/workflow/flowDesigner/workflowMap/?wid=' + that.wid + '&wiid=' + that.wiid;
        var title = '查看流程图：';
        FUI.Window.openEdit(url, title, null, null, null, null, null, null, null, true);
      },
      // ===stand:标准化方法============
      closeEdit(e) {
        //  关闭编辑窗口
        let status = e.actionName !== 'closeEdit';  //如果是关闭或者取消弹框 则取消后不刷新列表
        FUI.Window.closeEdit(status);
      },
      // ===stand:标准化方法结束============
      loadData() {
        var that = this;
        if (formAction != FUI.FormAction.Add) {
          FUI.Form.bindDataToForm(that, FUI.Handlers.FuiFrameworkHandler, FUI.Method.AutoGetViewModelMethod, keyId, null, mainTable);
        }
      },
      submitForm() {
        var that = this;
        var success = that.validateForm('formRef');
        if (!success) return;
        FUI.Form.submitForm(that, that.data, FUI.Handlers.FuiFrameworkHandler, FUI.Method.AutoSaveMethod, formAction, keyId, parentGridId, mainTable);
      },
      validateForm(refFormName) {
        var that = this;
        richeditorArrValueToInput(that);
        var success = FUI.validate(that.fieldsDef, that.data);
        return success;
      }
      ,
      validateRequiredNumOfRows() {
        //子表可见时才校验
        let that = this;
        let subFields = that.fieldList.filter(c => c.type == "subtable" && c.requiredNumOfRows != undefined && c.requiredNumOfRows != 0);
        let isPass = true;
        $.each(subFields, function (i, subtableDef) {
          isPass = FUI.validateRequiredNumOfRows(subtableDef);
          if (isPass == false) {
            return false;
          }
        });
        return isPass;
      }
      ,
      openHelperArticle(articleCode) {
        var url = __webpath + '/workflow/security/article/articleView?code=' + articleCode;
        FUI.Window.openEdit(url, '查看帮助', 'View', null, null, null, null, null, null, true);
      },
      tabsClick(tab, event) {
        if (field && field.tabsClick) {
          var funcName = field.tabsClick;
          if (Object.toIsExitsFunction(funcName)) {
            window[funcName](tab.label, tab, field);
          }
        }
      },
      toPinYin(sourceField, targetField) {
        if (!this.data[targetField]) {
          const source = this.data[sourceField];
          this.data[targetField] = Object.toPinYin(source);
        }
      },
      updateWorkflowformData(propertyName, newValue) {
        var that = this;
        that.workflowformData[propertyName] = newValue;
      },
      openComment(butItem) {
        var that = this;
        that.loadComment();
        that.drawer = true;
        that.drawerTitle = '流程评论';
      },
      uploadWorkflowAttachment() {
        var that = this;
        if (that.wfContext.WorkflowformAction == WF.WorkflowformAction.Todo) {
          var url = __webpath + '/workflow/pageRoute/attachmentUpload/?bk=' + that.wfContext.WorkflowInstanceId + '&AttachmentType=Workflow&ActivityName=' + that.wfContext.CurrentActivityName + '&ActivityId=' + that.wfContext.CurrentActivityId;
          FUI.Window.openEdit(url, '上传流程附件', 'Add', 'AttachmentsGrid', 600, 450);
        } else {
          FUI.Window.showMsg('当前不是您待办事项，不能上传附近');
        }
        return false;
      },
      // ===========================表单数据相关=====================
      // 重新渲染指定的组件
      renderComponent(keyName) {
        var that = this;
        that.subtableKey = Object.toGetRandomNum(100, 2000);
        // that.subtableKey=that.subtableKey+1;
        // that[keyName]=that[keyName]+1;
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
      // 扩展事件
      extendTabtoolbarClick(field) {
        event.stopPropagation();
        event.preventDefault();
      },
      extendButtonClidk(field) {
        // console.info(field.label);
        // console.info(field.clickEventName);
        that.resizeEmptySpaceHeight();
        event.stopPropagation();
        event.preventDefault();
      }
      , onRowCollapseClick(row) {
        var that = this;
        if (row.collapse == undefined) {
          row.collapse = false;
        } else {
          row.collapse = !row.collapse;
        }
        that.resizeEmptySpaceHeight();
        event.stopPropagation();
        event.preventDefault();

      }
    }
  };
//* **********当前上下文变量说明开始***********//
    // var WFContext ={ };

    // 是否已归档:1是，0否
    // WFContext.IsHistory="0";

    // 下一节点是否为自定义流节点
    // WFContext.NextActIsFreeflow="0";

    // //是否手机端
    // WFContext.IsMobile=false;
    //
    // //流程版本
    // WFContext.Version="1";

    // //流程名称
    // WFContext.WorkflowName="控件";
    //
    // //流程实例ID
    // WFContext.WorkflowInstanceId="6e43ea3d-05c5-4aae-b2f8-b9a02f7c90b4";
    //
    // //父流程实例ID
    // WFContext.MainWorkflowInstanceId="";
    //
    // //表单应用ID
    // WFContext.FormId="70b57f3a-1e19-4f21-81d4-623f467ad6eb";
    //
    // //表单定义ID
    // WFContext.FormDefId="2c02d911-513f-4057-b0d0-2abaae477ddb";
    //
    // //表单应用Key
    // WFContext.FormKey="KongJian20200508023134";
    //
    // //表单类型
    // WFContext.FormType="OnlineForm";
    //
    // //业务键
    // WFContext.BusinessKey="bk20200825162134";
    // //========================节点表单=====================
    // //节点表单应用ID
    // WFContext.ActFormId="";
    //
    // //节点定义的表单Key
    // WFContext.ActFormKey="";
    //
    // //节点定义的表单定义ID
    // WFContext.ActFormDefId="";
    //
    // //节点定义的表单名称
    // WFContext.ActFormName="";
    // //=================================================
    // //标题
    // WFContext.WorkflowTitle="控件test2";
    //
    // //流程定义ID
    // WFContext.WorkflowId="c6f3ed10-8e10-4717-9040-c617df8cc36a";
    //
    // //任务实例ID
    // WFContext.TaskId="21c14035-2dc3-4a7e-87d9-1a21d0807e3d";
    //
    // //流程状态：0:拟稿（未创建实例时）；1：初始（草稿）状态；2：流程运行中；3：流程已完成；4：挂起中 ；5：退回提单； 99：流程取消作废；100：已删除
    // WFContext.WorkflowInstinceState="2";
    //
    // //任务状态：0未读1已读 2已完成 3已锁定
    // WFContext.TaskState="0";
    //
    // //流程状态中文名
    // WFContext.WorkflowInstinceStateName="审核中";
    //
    // //当前页面状态：0未有实例，2待办，3查看,4待阅
    // WFContext.WorkflowformAction=4;
    //
    // //紧急程度  0：无，1：一般 ，2：紧急 3：特别紧急 4：最紧急
    // WFContext.Urgency="";
    //
    // //重要级别 0：无，1：一般 2：重要 3：特别重要
    // WFContext.Importance="";
    //
    // //应用ID
    // WFContext.AppId="KJ";
    //
    // //开单日期
    // WFContext.OpenBizDate="2020-08-25";
    //
    // //当前环节名称
    // WFContext.CurrentActivityName="普通节点3";
    //
    // //当前环节编码
    // WFContext.CurrentActivityCode="atcode1591958394699";
    //
    // //当前环节ID
    // WFContext.CurrentActivityId="352327d2-ac17-424d-9b15-6af8c36469f8";
    //
    // //当前环节实例ID
    // WFContext.CurrentActivityInstanceId="9092a207-e046-4dce-9517-1ae11441e856";
    //
    // //当前环节类别
    // WFContext.CurrentActivityType="Normal";
    //
    // //当前节点是否允许修改标题
    // WFContext.CurrentIsModifyProcInstTitle=false;
    //
    // //当前节点是否为阅式审批
    // WFContext.CurrentIsReadAutoApproval=false;
    //
    // //发散方式
    // WFContext.SplitType="SplitXOR";
    // //聚合方式
    // WFContext.JoinType="JoinXOR";
    // //进入方式
    // WFContext.EnterType="Manual";
    // //发出方式
    // WFContext.OutType="Auto";
    // //表单是否可编辑开关
    // WFContext.IsEditeForm=true;
    //
    // //是否显示表单审核选项
    // WFContext.IsShowFormApproval=false;
    //
    // //审核意见是否必填
    // WFContext.IsMustAddOpinion=false;
    //
    //
    // //表单中显示审批意见填写区
    // WFContext.IsShowFormOpinion=true;
    //
    // //流程发起人部门ID
    // WFContext.CreatorOrgId="bpmRoot";
    // //流程发起人部门名称
    // WFContext.CreatorOrgName="F2BPM组织";
    // //流程发起人ID
    // WFContext.CreatorUserId="3c1df0b3-a4d9-4731-b143-02e81bce17ce";
    //
    //
    // WFContext.OrgId="bpmRoot";
    //
    // WFContext.OrgName="F2BPM组织";
    //
    // WFContext.UserId="3c1df0b3-a4d9-4731-b143-02e81bce17ce";
    //
    // WFContext.Account="admin";
    //
    // WFContext.RealName="系统管理员";
    //
    // WFContext.TenantId="BPM";
    //
    //
    // WFContext.RoleCodes="superadmin,20191230151132131";
    //
    // //当前登录用户其它扩展属性
    // WFContext.OtherProperty=[{key:'Aihao',value:'羽毛球'},{key:'Job',value:'高级工程师'}];

    //* **********流程实例上下文结束***********//

</script>
<style lang="scss" scoped>
  @import "~@/resources/css/workflowform.css";
  @import "/static/f2bpmUI/onlineForm/onlinedisginer.css";

  .container-scroll-bar {

    ::v-deep .el-scrollbar__wrap,
    ::v-deep .el-scrollbar__view {
      overflow-x: auto;
    }
  }
</style>