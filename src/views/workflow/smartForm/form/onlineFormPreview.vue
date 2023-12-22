<template>
  <div class="publish-root-worklfowform-container">
    <div id="WorkflowformContainer" class="online-workflowform">
      <!--顶部按钮 -->
      <div id="wftoolbar" class="wf_buttons_bar mb10">
        <div id="sendButtomDiv" class="workflow-buttonaction-toolbar">
          <el-button size="small" type="primary" class="mr2" @click="previewJsonData(0)"><i class="fa fa-search" />表单数据JSON结构
          </el-button>
          <el-button v-if="previewJson!=''" size="small" class="mr2" type="default" @click="previewJsonData(1)"><i class="fa fa-cog" />格式化JSON
          </el-button>
          <el-button v-if="previewJson!=''" size="small" type="default" @click="showOrHidePreviewJsonData(false)"><i class="icon icon-arrow-up-bold font12" />收起
          </el-button>
        </div>
      </div>
      <!--详细信息-->
      <el-scrollbar class="container-scroll-bar workflow-form-content-height">
        <div id="WorkflowContentDiv" class="workflow-form-content-detail-container" style="clear: both;" border="false">
          <div v-if="isShowPreviewJson" class="mt10 mb10">
            <el-input v-model="previewJson" type="textarea" :rows="8" />
          </div>
          <div id="formDetail">
            <div class="FormViewContainer online-workflowform">
              <el-form ref="formRef" :rules="formRules" size="small" :model="data" class="f2bpm-workform" :label-position="formProperty.titlePosition" :label-width="formProperty.labelWidth">
                <div v-for="(row, row_index) in fields" :id="row.id" :ordernum="row.orderNum" class="drag-row drag-box">
                  <div class="view">
                    <div v-show="row.showLabel" :class="row.showPrefixSpaced?'form-section-title mt10':'form-section-title'" :style="row.sectionStyle">
                      <span class="sectionPrefixBlueBar" v-if="row.showPrefixBar"></span>
                      <span class="section-title" v-html="langTitle(row)"></span>
                      <span v-if="row.collapse!==0&&row.collapse!==undefined" @click="onRowCollapseClick(row)" :class="rowCollapseIcon(row)"></span>
                    </div>
                    <el-row rowdetail="row.id" class="row-fluid clearfix" v-show="!row.collapse" :style="row.style" :gutter="row.gutter">
                      <el-col v-for="(col, col_index) in row.children" :id="col.id" :key="col_index" :rowid="row.id" :style="col.style" class="column" :span="col.span">
                        <div v-if="field.ctrType!='hidden'" v-for="(field, field_index) in col.children" :id="field.id" :key="field_index" :fieldId="field.fieldId" :fieldName="field.vModel" :orderNum="field.orderNum" :ctrType="field.ctrType" class="online-form-item component">
                          <el-form-item v-show="field._isShowPower" :label-width="field.labelWidth">
                            <span v-show="field.showLabel&&field.ctrType!='hidden'&&field.ctrType!='extend_table'" slot="label" :style="field.style">
                              <span v-html="langTitle(field)" />
                              <span v-if="field.helperArticle!=''&&field.helperArticle!=undefined" class="fa fa-question-circle-o" title="点击查看说明" @click="openHelperArticle(field.helperArticle)" />
                              <em v-if="field._isRequired" class="red">*</em>{{ field.labelSuffix }}
                            </span>
                            <f2bpm-onlineformitem v-if="!field.isContainer&&field.ctrType!='extend_tabs'&&field.ctrType!='extend_container'" :parentdata="data" :field="field" :fieldvalue="data[field.vModel]" @updatevalue="updateFieldValue" @appendfieldvalue="appendFieldValue" />

                            <el-tabs v-else-if="field.ctrType=='extend_tabs'" :value="field.tabSelected" :tab-position="field.tabPosition" :type="field.tabType" @tab-click="tabsClick(field,$event)">
                              <el-tab-pane v-for="tab in field.children" :label="langTitle(tab)" class="container" :rowid="row.id" :colid="col.id" :ordernum="tab.orderNum" :container_id="field.id" :subcontainer_id="tab.id" :tabsid="field.id" :tabid="tab.id" :name="tab.label">
                                <div v-for="_row in tab.children" :id="_row.id" :key="_row.orderNum" :parent_rowid="row.id" :parent_colid="col.id" :container_id="field.id" :subcontainer_id="tab.id" :ordernum="_row.orderNum" class="drag-row drag-box">
                                  <div class="view">
                                    <div v-show="_row.showLabel" class="form-section-title" :style="_row.sectionStyle">{{ langTitle(_row) }} <span v-if="_row.collapse!==0&&_row.collapse!==undefined" @click="onRowCollapseClick(_row)" :class="rowCollapseIcon(_row)"></span>
                                    </div>
                                    <el-row class="row-fluid clearfix" rowdetail="_row.id" v-show="!_row.collapse" :style="_row.style" :gutter="_row.gutter">
                                      <el-col :id="_col.id" v-for="(_col, _col_index) in _row.children" :parent_rowid="row.id" :parent_colid="col.id" :key="_col_index" :container_id="field.id" :subcontainer_id="tab.id" :rowid="_row.id" :style="_col.style" class="column container_column" :span="_col.span">
                                        <div v-if="_field.ctrType!='hidden'" :id="_field.id" class="online-form-item component" :fieldId="_field.fieldId" :fieldName="_field.vModel" :parent_rowid="row.id" :parent_colid="col.id" v-for="(_field, _field_index) in _col.children" :container_id="field.id" :subcontainer_id="tab.id" :key="_field_index" :colId="_col.id" :rowId="_row.id" :vmodel="_field.vModel" :orderNum="_field.orderNum" :ctrType="_field.ctrType">
                                          <el-form-item v-show="_field._isShowPower" :label-width="_field.labelWidth?_field.labelWidth:'90px'">
                                            <span v-show="_field.showLabel" slot="label" :style="_field.style">
                                              <span v-html="langTitle(_field)" />
                                              <span v-if="_field.helperArticle!=''&&_field.helperArticle!=undefined" class="fa fa-question-circle-o" title="点击查看说明" @click="openHelperArticle(_field.helperArticle)" />
                                              <em v-if="_field._isRequired" class="red">*</em>{{ _field.labelSuffix }}
                                            </span>
                                            <f2bpm-onlineformitem v-if="!_field.isContainer&&_field.ctrType!='extend_tabs'&&_field.ctrType!='extend_container'" :parentdata="data" :field="_field" :fieldvalue="data[_field.vModel]" @updatevalue="updateFieldValue" @appendfieldvalue="appendFieldValue" />
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
                                    <div v-show="_row.showLabel" class="form-section-title" :style="_row.sectionStyle">{{ langTitle(_row) }} <span v-if="_row.collapse!==0&&_row.collapse!==undefined" @click="onRowCollapseClick(_row)" :class="rowCollapseIcon(_row)"></span>
                                    </div>
                                    <el-row class="row-fluid clearfix" rowdetail="_row.id" v-show="!_row.collapse" :style="_row.style" :gutter="_row.gutter">
                                      <el-col :id="_col.id" v-for="(_col, _col_index) in _row.children" :parent_rowid="row.id" :parent_colid="col.id" :key="_col_index" :container_id="field.id" :subcontainer_id="tab.id" :rowid="_row.id" :style="_col.style" class="column container_column" :span="_col.span">
                                        <div v-if="_field.ctrType!='hidden'" :id="_field.id" class="online-form-item component" :fieldId="_field.fieldId" :fieldName="_field.vModel" :parent_rowid="row.id" :parent_colid="col.id" v-for="(_field, _field_index) in _col.children" :container_id="field.id" :subcontainer_id="tab.id" :key="_field_index" :colId="_col.id" :rowId="_row.id" :vmodel="_field.vModel" :orderNum="_field.orderNum" :ctrType="_field.ctrType">
                                          <el-form-item v-show="_field._isShowPower" :label-width="_field.labelWidth?_field.labelWidth:'90px'">
                                            <span v-show="_field.showLabel" slot="label" :style="_field.style">
                                              <span v-html="langTitle(_field)" /> <em v-if="_field._isRequired" class="red">*</em>
                                            </span>
                                            <f2bpm-onlineformitem v-if="!_field.isContainer&&_field.ctrType!='extend_tabs'&&_field.ctrType!='extend_container'" :parentdata="data" :field="_field" :fieldvalue="data[_field.vModel]" @updatevalue="updateFieldValue" @appendfieldvalue="appendFieldValue" />
                                          </el-form-item>
                                        </div>
                                      </el-col>
                                    </el-row>
                                  </div>
                                </div>
                              </div>
                            </el-container>
                            <div class="table-container-div" v-else-if="field.ctrType=='extend_table'">
                              <div :style="field.sectionStyle" v-show="field.showLabel"><span v-html="field.label"></span></div>
                              <table id="field.id" :style="'border-collapse: collapse;width:'+field.tableWidth+';'+field.style">
                                <tr :style="'height:'+field.rowHeight+'px;'+tr.style" v-for="tr in field.children" :rowid="row.id" :colid="col.id" :container_id="field.id" :subcontainer_id="tr.id">
                                  <td :style="getColWidths(field,tdIndex)+field.cellStyle" v-for="(td,tdIndex) in tr.children" class="container" :rowid="row.id" :colid="col.id" :container_id="field.id" :subcontainer_id="tr.id" :sub2container_id="td.id">
                                    <div v-for="_row in td.children" :id="_row.id" :key="_row.orderNum" :parent_rowid="row.id" :parent_colid="col.id" :container_id="field.id" :subcontainer_id="tr.id" :sub2container_id="td.id" :ordernum="_row.orderNum" class="drag-row drag-box">
                                      <div v-show="_row.showLabel" class="form-section-title" :style="_row.sectionStyle">{{ _row.label }}</div>
                                      <el-row class="row-fluid clearfix" :style="_row.style" :gutter="_row.gutter">
                                        <el-col :id="_col.id" v-for="(_col, _col_index) in _row.children" :parent_rowid="row.id" :parent_colid="col.id" :key="_col_index" :container_id="field.id" :subcontainer_id="tr.id" :sub2container_id="td.id" :rowid="_row.id" :style="_col.style" class="column container_column" :span="_col.span">
                                          <div v-if="_field.ctrType!='hidden'" :id="_field.id" class="online-form-item component" :fieldId="_field.fieldId" :parent_rowid="row.id" :parent_colid="col.id" :container_id="field.id" :subcontainer_id="tr.id" :sub2container_id="td.id" v-for="(_field, _field_index) in _col.children" :colId="_col.id" :key="_field_index" :rowId="_row.id" :vmodel="_field.vModel" :orderNum="_field.orderNum" :ctrType="_field.ctrType">
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
                                  </td>
                                </tr>
                              </table>
                            </div>
                            <!-- <f2bpm-subtable :key="subtableKey" v-if="field.ctrType=='subtable'" :field="field" :fieldvalue="data[field.vModel]" @updatevalue="updateFieldValue" @appendfieldvalue="appendFieldValue">
                    </f2bpm-subtable>
                    <f2bpm-mobilesubtable :key="subtableKey" v-else-if="deviceType=='mobile'&&field.ctrType=='subtable'" :field="field">
                    </f2bpm-mobilesubtable> -->
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
      </el-scrollbar>
      <el-drawer size="50%" :title="drawerTitle" :visible.sync="drawer" :direction="direction" :before-close="drawerClose">
        <div style="overflow: auto;height:700px">
          <pre>{{ drawerContent }}</pre>
        </div>
      </el-drawer>
    </div>
  </div>
</template>

<script>
  WFContext.IsMobile = false;
  WFContext.WorkflowName = '预览演示';
  WFContext.WorkflowInstanceId = '4b949840-5768-4d51-9f2e-6220ec897beb';
  WFContext.MainWorkflowInstanceId = '';
  WFContext.FormType = 'OnlineForm';
  WFContext.BusinessKey = 'bk20181224195553';
  WFContext.WorkflowTitle = '预览演示';
  WFContext.WorkflowId = '5093bc73-5edf-4a69-904d-9239c7bf3d8c';
  WFContext.WorkflowInstinceState = '0';
  WFContext.WorkflowInstinceStateName = '拟稿';
  WFContext.WorkflowformAction = 0;
  WFContext.AppId = 'FYBX';
  WFContext.CurrentActivityName = '提单';
  WFContext.CurrentActivityCode = 'start';
  WFContext.CurrentActivityId = '91de838e-5ba3-4e98-b415-aa34f34d64c2';
  WFContext.CurrentActivityType = 'Start';
  WFContext.UserId = 'testuserId';

  //流程发起人部门ID
  WFContext.CreatorOrgId = "bpmRoot";
  //流程发起人部门名称
  WFContext.CreatorOrgName = "F2BPM组织";
  //流程发起人ID
  WFContext.CreatorUserId = "3c1df0b3-a4d9-4731-b143-02e81bce17ce";

  //当前登录人的组织编码;
  WFContext.CurrentOrgId = "bpmRoot";
  //当前登录人的组织名称;
  WFContext.OrgName = "F2BPM组织";
  //当前登录人UserId;
  WFContext.CurrentUserId = "3c1df0b3-a4d9-4731-b143-02e81bce17ce";
  //当前登录人账号;
  WFContext.CurrentAccount = "admin";
  //当前登录人姓名;
  WFContext.CurrentRealName = "预览系统管理员";
  WFContext.CurrentOrgName = "预览组织名称";
  // 当前登录人租户号;
  WFContext.CurrentTenantId = "BPM";

  var formDefId = Object.toQueryString('formDefId') || '';
  var isTemplate = Object.toQueryString('isTemplate') || '';
  var formId = Object.toQueryString('formId') || '';


  import '@/resources/f2bpmUI/onlineForm/components/f2bpm-wfopinion.js';
  import '@/resources/f2bpmUI/onlineForm/components/f2bpm-approvalrecordlist.js';
  import '@/resources/f2bpmUI/onlineForm/components/f2bpm-circulatedrecordlist.js';
  import '@/resources/f2bpmUI/onlineForm/components/f2bpm-commentrecordlist.js';
  export default {
    data() {
      return {
        isShowPreviewJson: false,
        //打开或关闭的块
        collapseTarget: { baseInfoContainer: false, baseInfo: false, wrokflowFile: true, approvalrecordlist: true, circulatedrecordlist: true, commentrecordlist: true },
        language: "",
        isTemplate: '',
        formDefId: '',
        formId: '',
        deviceType: 'pc',
        // 子表组件的Key
        subtableKey: '101',
        formAction: null,
        isPropertyCollapsed: false,
        isCollapsed: false,
        // 抽屉
        drawerTitle: '查看',
        drawerContent: '',
        drawer: false,
        direction: 'rtl',
        treeData: [],
        data: {},
        //数组扁平化的页面组件字段定义
        pageFieldList: [],
        // 页面组件字段数据
        pageFieldData: {},
        formRules: {},
        previewJson: '',
        // 扁平化的字段定义
        // 被公式引用到的字段,key为字段名，value为多个数组公式
        mathFieldList: {},
        // 数组扁平化的字段定义
        fieldList: [],
        // 扁平化的字段定义
        fieldsDef: {},
        formProperty: {},
        // 字段渲染描述
        fields: [],
        jscript: '',
        fieldValue: ''

      };
    }
    , computed: {
      langTitle() {
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
      , getColWidths() {
        return function (field, colIndex) {
          var item = field.colWidths.find(a => a.colnum == (colIndex + 1));
          if (item != null && item.width != "") {
            return "width:" + item.width + ";";
          }
          return "";
        };
      }
    },
    mounted: function () {
      var that = this;
      that.$nextTick(function () {
        // 确保子组件也挂载完毕
        f2grid_global_mainVueLoadComplated = true;
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
            window.extend_fuiOnPageLoad();
          }
        }
      });

      $('body').addClass('overnone');
      that.scrollerHeight = window.innerHeight - 52;
      $(window).resize(function () {
        that.scrollerHeight = window.innerHeight - 52;
      });
      $('.workflow-form-content-height').height(that.scrollerHeight);
    },
    created: function () {
      var that = this;
      var language = this.$store.state.app.language;
      that.language = language;
      window.myvm = that;
      that.formDefId = formDefId;
      that.isTemplate = isTemplate;
      that.formId = formId;
      var $parentVue = window.opener.window.myvm;
      const currUser = FUI.Sys.getAuthor();
      var orgName = decodeURI(currUser.orgName);
      //流程发起人部门ID
      WFContext.CreatorOrgId = currUser.orgId;
      //流程发起人部门名称
      WFContext.CreatorOrgName = orgName;
      //流程发起人ID
      WFContext.CreatorUserId = currUser.userId;
      //当前登录人的组织编码;
      WFContext.CurrentOrgId = "bpmRoot预览";
      //当前登录人的组织名称;
      WFContext.OrgName = orgName;
      //当前登录人UserId;
      WFContext.CurrentUserId = currUser.userId;
      //当前登录人账号;
      WFContext.CurrentAccount = "admin预览";
      //当前登录人姓名;
      WFContext.CurrentRealName = "预览人员姓名";
      // 当前登录人租户号;
      WFContext.CurrentTenantId = currUser.tenantId;

      that.deviceType = $parentVue.deviceType;
      WFContext.deviceType = that.deviceType;
      that.jscript = $parentVue.jscript;
      that.fields = Object.toDeepClone($parentVue.fields);
      that.formProperty = Object.toDeepClone($parentVue.formProperty);
      /*  that.mathFieldList = Object.toDeepClone($parentVue.mathFieldList) */
      /*  that.fieldsDef = Object.toDeepClone($parentVue.fieldsDef)*/
      /* that.fieldList = Object.toDeepClone($parentVue.fieldList) */
      // 收集字段定义（纯字段扁平化,修改字段必填标记）
      FUI.F2Grid.collectField(that, that.fields);
      // 收集被公式引用到的字段名
      that.mathFieldList = FUI.F2Grid.getMathFieldList(that.fieldList);
      // 初始化data的结构
      FUI.F2Grid.initailData(that, that.fields);
      that.loadPageFieldData();
    },
    methods: {
      closeEdit() {
        FUI.Window.closeEdit();
      },
      // ===stand:标准化方法结束============
      loadData() {
        var that = this;
        const currUser = FUI.Sys.getAuthor();
      },
      loadPageFieldData() {
        //加载页面组件字段的值
        let that = this;
        if (that.pageFieldList && that.pageFieldList.length > 0) {
          $.each(that.pageFieldList, function (i, item) {
            if (item.vModel) {
              let name = item.vModel;
              that.pageFieldData[name] = item.value;
            }
          });
        }
      }
      , loadTreeSelect() {
        var that = this;
        var treeUrl = FUI.Handlers.CategoryHandler + '?groupKey=BusinessObject&needRoot=false';
        Object.toAjaxJson(treeUrl, null, null, true, null, function (res) {
          if (res.success) {
            that.treeData = res.data;
          } else {
            that.$message.error(
              res.msg
            );
          }
        });
      },
      submitForm(isGoNext) {
        var that = this;
        var success = that.validateForm('formRef');
        if (!success) return;
      },
      validateForm(refFormName) {
        // stand:表单校验
        var success = false;
        this.$refs[refFormName].validate(valid => {
          success = valid;
        });
        return success;
      },

      drawerClose(done) {
        done();
      },
      previewJsonData(type) {
        var that = this;
        var result = FUI.F2Grid.getData(that);
        that.previewJson = JSON.stringify(result);
        that.isShowPreviewJson = true;
        if (type == 1) {
          var json = JSON.stringify(result, null, 2);
          that.drawer = true;
          that.drawerTitle = '查看表单JSON数据结构';
          that.drawerContent = json;
        }
      },
      showOrHidePreviewJsonData(type) {
        let that = this;
        that.isShowPreviewJson = type;
      }
      , openHelperArticle(articleCode) {
        var url = __webpath + '/workflow/security/article/articleView?code=' + articleCode;
        FUI.Window.openEdit(url, '查看帮助', 'View', null, null, null, null, null, null, true);
      },
      tabsClick(field, tab) {
        //console.info(tab.label,tab,field);
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
          that.triggerFieldLinkages(field);
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
        console.info(field.label);
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
        event.stopPropagation();
        event.preventDefault();
      }
    }
  }
</script>
<style lang="scss" scoped>
  @import "~@/resources/css/workflowform.css";
  @import "/static/f2bpmUI/onlineForm/onlinedisginer.css";
</style>