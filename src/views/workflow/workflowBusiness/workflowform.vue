<template>
  <div class="publish-root-worklfowform-container">
    <!-- 流程删除事件二次询问  -->
    <div v-if="myMsg.dialogVisible" >
      <el-dialog title="温馨提示" :visible.sync="myMsg.dialogVisible"  custom-class="mymsg" >
        <span class="iconbox">{{myMsg.text}}</span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="myMsg.dialogVisible = false" size="small" style="margin-right: 10px;">{{myMsg.btnText[0]}}</el-button>
          <el-button type="primary" size="small" @click="myMsgOk(myMsg)">{{myMsg.btnText[1]}}</el-button>
        </span>
      </el-dialog>
    </div>
    <div id="WorkflowformContainer" class="online-workflowform">
      <!--顶部按钮 -->
      <div v-if="traceId==''" id="wftoolbar" class="wf_buttons_bar" style="clear: both;">
        <div id="sendButtomDiv" class="workflow-buttonaction-toolbar">
          <el-button v-for="(btn, bIndex) in pageBaseInfo.buttons" :key="bIndex" :id="btn.actionName" :type="btn.btnType" size="small" @click="buttonAction(btn)"><i :class="btn.icon&&btn.icon.indexOf('icon')>-1?'icon '+btn.icon: 'fa '+btn.icon" /><span v-html="btnLangTitle(btn)" />
          </el-button>
          <el-dropdown size="small" class="ml2" v-if="actFormList&&actFormList.length>0">
            <el-button type="primary" size="small">
              查看节点表单<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item v-for="(item,index) in actFormList" :key="index" @click.native="openActFormView(item)"><span :class="item.activityName==forceActivityName?'red':''" v-html="item.activityName"></span> </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
      <!--表单内容-->
      <el-scrollbar class="container-scroll-bar workflow-form-content-height">
        <div id="WorkflowContentDiv" class="workflow-form-content-detail-container" style="clear: both;" border="true">
          <!--快照节点-->
          <div v-if="traceId!=''" class="wf-form wf-box">
            <div class="wf-box-section-title cur">
              <i class="fa fa-file-o cur ml10" />{{$t('workflowform.snapshot')}}
            </div>
            <div style="padding: 10px;">
              <span v-for="item in snapshotDataList" :key="item.id" :class="item.id==traceId?'cube white bg-orange ml2 cur':'cube white bg-grey ml2 cur'" @click="traceFormView(item.id)">【{{ item.activityName }}({{ item.creatorRealName }}{{ item.createdTime }})】</span>
            </div>
          </div>
          <!--结束时查看节点表单-->
          <div v-if="traceId!=''" class="wf-form wf-box">
            <div class="wf-box-section-title cur">
              <i class="fa fa-file-o cur ml10" />节点表单
            </div>
            <div style="padding: 10px;">
              <span v-for="item in snapshotDataList" :key="item.id" :class="item.id==traceId?'cube white bg-orange ml2 cur':'cube white bg-grey ml2 cur'" @click="traceFormView(item.id)">【{{ item.activityName }}({{ item.creatorRealName }}{{ item.createdTime }})】</span>
            </div>
          </div>
          <!--流程信息-->
          <div v-if="traceId==''" id="workflowInstanceBaseInfo" class="wf-box" v-show="collapseTarget.baseInfoContainer">
            <div class="wf-box-section-title cur" @click="collapseTargetClick('baseInfo')">
              <span class="sectionPrefixBlueBar"></span><span class="section-title">{{$t('workflowform.procInfo')}}</span>
              <span :class="collapseTarget.baseInfo?'onlineform-row-collapse-button el-icon-arrow-down':'onlineform-row-collapse-button el-icon-arrow-up'"></span>
            </div>
            <!--流程基础信息-->
            <div id="workflow-base-info" class="p2 workflow_base_info" v-show="collapseTarget.baseInfo">
              <table cellpadding="0" cellspacing="0" border="0" width="100%" class="wf-table">
                <tr>
                  <th>{{$t('workflowform.workflowTitle')}} ：</th>
                  <td class="p3">
                    <el-tooltip
                      placement="bottom"
                      :disabled="isShowTip"
                      popper-class="atooltip"
                      effect="light">
                        <div slot="content" :style="{'max-width':`${inputMaxWidth}px`}" v-html="wfContext.WorkflowTitle"></div>
                        <span>
                          <el-input id="WorkflowTitle" v-model="wfContext.WorkflowTitle" v-if="!workflowTitleIsDisabled" size="small" placeholder="工单标题" width="95%" @mouseover.native="inputOnMouseOver($event)"/>
                          <span v-html="wfContext.WorkflowTitle" v-if="workflowTitleIsDisabled"></span>
                        </span>
                      </el-tooltip>
                  </td>
                  <th>{{$t('workflowform.importance')}}：</th>
                  <td class="pl3">
                    <el-select v-model="wfContext.Importance" :disabled="isReadOnly||wfContext.CurrentActivityType!='Start'" size="small" filterable placeholder="请选择">
                      <el-option v-for="item in importanceData" :key="item.value" :label="item.text" :value="item.value" />
                    </el-select>
                  </td>
                  <th>{{$t('workflowform.urgency')}}：</th>
                  <td class="pl3">
                    <el-select v-model="wfContext.Urgency" :disabled="isReadOnly||wfContext.CurrentActivityType!='Start'" size="small" filterable placeholder="请选择">
                      <el-option v-for="item in urgencyData" :key="item.value" :label="item.text" :value="item.value" />
                    </el-select>
                  </td>
                </tr>
                <tr>
                  <th width="10%">{{$t('workflowform.sheetId')}}：</th>
                  <td width="26%" class="pl3">
                    <span v-html="pageBaseInfo.sheetId" />
                  </td>
                  <th width="10%">{{$t('workflowform.currentActivityName')}}：</th>
                  <td width="26%" class="pl3">
                    <span v-html="language=='en-US'?pageBaseInfo.currentActivityAlias:pageBaseInfo.currentActivityName" />
                  </td>
                  <th width="10%">{{$t('workflowform.workflowState')}}：</th>
                  <td width="26%" class="pl3" v-html="langworkflowInstinceState(pageBaseInfo.workflowInstinceState)" />
                </tr>
                <tr>
                  <th>{{$t('workflowform.startor')}}：</th>
                  <td class="pl3">
                    <span v-html="pageBaseInfo.creator" />
                  </td>
                  <th>{{$t('workflowform.startTime')}}：</th>
                  <td class="pl3">
                    <span v-html="pageBaseInfo.startTime" />
                  </td>
                  <th>{{$t('workflowform.finishedTime')}}：</th>
                  <td class="pl3">
                    <span v-html="pageBaseInfo.finishedTime" />
                  </td>
                </tr>
              </table>
            </div>
          </div>
          <!--审核菜单 -->
          <f2bpm-approval-action :appro-data="approData" @updateapproalaction="updateapproalaction" />
          <!--表单内容-->
          <div id="formDetail" class="mt10">
            <div id="mainWorkformContainer" class="FormViewContainer" style="position: relative; ">
              <!--Url表单-->
              <iframe v-if="wfContext.FormType == 'UrlForm'" id="urlFormIframe" :src="urlForm.url" width="100%" height="900" frameborder="0" />
              <!--在线表单-->
              <el-form v-if="wfContext.FormType == 'OnlineForm'||(wfContext.FormType == 'NoneForm'&&fields)" ref="formRef" :rules="formRules" size="small" :label-position="formProperty.titlePosition" :model="data" :label-width="formProperty.labelWidth">
                <div v-for="(row, row_index) in fields" :key="row_index" :id="row.id" :ordernum="row.orderNum" class="drag-row drag-box">
                  <div class="view">
                    <div v-show="row.showLabel" :class="row.showPrefixSpaced?'form-section-title mt10':'form-section-title'" :style="row.sectionStyle">
                      <span class="sectionPrefixBlueBar" v-if="row.showPrefixBar"></span>
                      <span class="section-title" v-html="langTitle(row)"></span>
                      <span v-if="row.collapse!==0&&row.collapse!==undefined" @click="onRowCollapseClick(row)" :class="rowCollapseIcon(row)"></span>
                    </div>
                    <el-row class="row-fluid clearfix" rowdetail="row.id" v-show="!row.collapse" :style="row.style" :gutter="row.gutter">
                      <el-col v-for="(col, col_index) in row.children" :id="col.id" :key="col_index" :rowid="row.id" :style="col.style" class="column" :span="col.span">
                        <template v-for="(field, field_index) in col.children">
                          <div v-if="field.ctrType!='hidden'" :id="field.id" :key="field_index" :fieldId="field.fieldId" :orderNum="field.orderNum" :ctrType="field.ctrType" class="online-form-item component">
                            <el-form-item v-show="field._isShowPower" :label-width="field.labelWidth">
                              <span v-show="field.showLabel&&field.ctrType!='hidden'&&field.ctrType!='extend_table'" slot="label" :style="field.style">
                                <em v-if="field._isRequired && !isReadOnly" class="red mr2">*</em>
                                <span v-html="langTitle(field)" />
                                <span v-if="field.helperArticle !=='' && field.helperArticle !== undefined && (field.fieldTip ==='' || field.fieldTip === undefined)" class="fa fa-question-circle-o" title="点击查看说明" @click="openHelperArticle(field.helperArticle)" />
                                <el-tooltip 
                                  placement="bottom" 
                                  v-else-if="field.fieldTip&& !field.helperArticle"
                                  popper-class="atooltip" 
                                  effect="light">
                                    <div slot="content" v-html="field.fieldTip"></div>
                                    <span class="fa fa-question-circle-o orange"></span>
                                </el-tooltip>
                                <span v-else></span>
                                {{ field.labelSuffix }}
                              </span>

                              <f2bpm-onlineformitem v-if="!field.isContainer&&field.ctrType!='extend_tabs'&&field.ctrType!='extend_container'" :parentdata="data" :field="field" :fieldvalue="data[field.vModel]" @rendercomponent="renderComponent" @updatevalue="updateFieldValue" @appendfieldvalue="appendFieldValue" />

                              <el-tabs v-else-if="field.ctrType=='extend_tabs'" :value="field.tabSelected" :tab-position="field.tabPosition" :type="field.tabType" @tab-click="tabsClick(field,$event)">
                                <el-tab-pane v-for="(tab, tIndex) in field.children" :key="tIndex" :label="langTitle(tab)" class="container" :rowid="row.id" :colid="col.id" :ordernum="tab.orderNum" :container_id="field.id" :subcontainer_id="tab.id" :tabsid="field.id" :tabid="tab.id" :name="tab.label">
                                  <div v-for="_row in tab.children" :id="_row.id" :key="_row.orderNum" :parent_rowid="row.id" :parent_colid="col.id" :container_id="field.id" :subcontainer_id="tab.id" :ordernum="_row.orderNum" class="drag-row drag-box">
                                    <div class="view">
                                      <div v-show="_row.showLabel" class="form-section-title" :style="_row.sectionStyle">{{ langTitle(_row) }} <span v-if="_row.collapse!==0&&_row.collapse!==undefined" @click="onRowCollapseClick(_row)" :class="rowCollapseIcon(_row)"></span></div>
                                      <el-row class="row-fluid clearfix" rowdetail="_row.id" v-show="!_row.collapse" :style="_row.style" :gutter="_row.gutter">
                                        <el-col :id="_col.id" v-for="(_col, _col_index) in _row.children" :parent_rowid="row.id" :parent_colid="col.id" :key="_col_index" :container_id="field.id" :subcontainer_id="tab.id" :rowid="_row.id" :style="_col.style" class="column container_column" :span="_col.span">
                                          <template v-for="(_field, _field_index) in _col.children">
                                            <div :id="_field.id" class="online-form-item component" :fieldId="_field.fieldId" :parent_rowid="row.id" :parent_colid="col.id" v-if="_field.ctrType!='hidden'" :container_id="field.id" :subcontainer_id="tab.id" :key="_field_index" :colId="_col.id" :rowId="_row.id" :vmodel="_field.vModel" :orderNum="_field.orderNum" :ctrType="_field.ctrType">
                                            <el-form-item v-show="_field._isShowPower" :label-width="_field.labelWidth?_field.labelWidth:'90px'">
                                              <span v-show="_field.showLabel" slot="label" :style="_field.style">
                                                <em v-if="_field._isRequired && !isReadOnly" class="red mr2">*</em><span v-html="langTitle(_field)" />
                                                <span v-if="field.helperArticle !=='' && field.helperArticle !== undefined && (field.fieldTip ==='' || field.fieldTip === undefined)" class="fa fa-question-circle-o" title="点击查看说明" @click="openHelperArticle(field.helperArticle)" />
                                                  <el-tooltip :content="field.fieldTip" placement="bottom" effect="light" v-else-if="field.fieldTip&& !field.helperArticle">
                                                    <span class="fa fa-question-circle-o orange"/>
                                                  </el-tooltip>
                                                <span v-else/>
                                                {{ _field.labelSuffix }}
                                              </span>

                                              <f2bpm-onlineformitem v-if="!_field.isContainer&&_field.ctrType!='extend_tabs'&&_field.ctrType!='extend_container'" :parentdata="data" :field="_field" :fieldvalue="data[_field.vModel]" @rendercomponent="renderComponent" @updatevalue="updateFieldValue" @appendfieldvalue="appendFieldValue" />
                                            </el-form-item>
                                          </div>
                                          </template>
                                        </el-col>
                                      </el-row>
                                    </div>
                                  </div>
                                </el-tab-pane>
                              </el-tabs>
                              <el-container v-else-if="field.ctrType=='extend_container'">
                                <div v-for="(tab, tIndex) in field.children" :key="tIndex" :class="'f2bpm-'+tab.tag+' container'" :rowid="row.id" :colid="col.id" :ordernum="tab.orderNum" :container_id="field.id" :subcontainer_id="tab.id" :style="tab.style">
                                  <div v-for="_row in tab.children" :id="_row.id" :key="_row.orderNum" :parent_rowid="row.id" :parent_colid="col.id" :container_id="field.id" :subcontainer_id="tab.id" :ordernum="_row.orderNum" class="drag-row drag-box">
                                    <div class="view">
                                      <div v-show="_row.showLabel" class="form-section-title" :style="_row.sectionStyle">{{ langTitle(_row) }} <span v-if="_row.collapse!==0&&_row.collapse!==undefined" @click="onRowCollapseClick(_row)" :class="rowCollapseIcon(_row)"></span></div>

                                      <el-row class="row-fluid clearfix" rowdetail="_row.id" v-show="!_row.collapse" :style="_row.style" :gutter="_row.gutter">
                                        <el-col :id="_col.id" v-for="(_col, _col_index) in _row.children" :parent_rowid="row.id" :parent_colid="col.id" :key="_col_index" :container_id="field.id" :subcontainer_id="tab.id" :rowid="_row.id" :style="_col.style" class="column container_column" :span="_col.span">
                                          <template v-for="(_field, _field_index) in _col.children">
                                            <div v-if="_field.ctrType!='hidden'" :id="_field.id" class="online-form-item component" :fieldId="_field.fieldId" :parent_rowid="row.id" :parent_colid="col.id" :container_id="field.id" :subcontainer_id="tab.id" :key="_field_index" :colId="_col.id" :rowId="_row.id" :vmodel="_field.vModel" :orderNum="_field.orderNum" :ctrType="_field.ctrType">
                                            <el-form-item v-show="_field._isShowPower" :label-width="_field.labelWidth?_field.labelWidth:'90px'">
                                              <span v-show="_field.showLabel" slot="label" :style="_field.style">
                                                <em v-if="_field._isRequired && !isReadOnly" class="red mr2">*</em><span v-html="langTitle(_field)" />
                                                <span v-if="field.helperArticle !=='' && field.helperArticle !== undefined && (field.fieldTip ==='' || field.fieldTip === undefined)" class="fa fa-question-circle-o" title="点击查看说明" @click="openHelperArticle(field.helperArticle)" />
                                                <el-tooltip :content="field.fieldTip" placement="bottom" effect="light" v-else-if="field.fieldTip&& !field.helperArticle">
                                                  <span class="fa fa-question-circle-o orange"/>
                                                </el-tooltip>
                                                <span v-else/>
                                                {{ _field.labelSuffix }}
                                              </span>
                                              <f2bpm-onlineformitem v-if="!_field.isContainer&&_field.ctrType!='extend_tabs'&&_field.ctrType!='extend_container'" :parentdata="data" :field="_field" :fieldvalue="data[_field.vModel]" @rendercomponent="renderComponent" @updatevalue="updateFieldValue" @appendfieldvalue="appendFieldValue" />
                                            </el-form-item>
                                          </div>
                                          </template>
                                          
                                        </el-col>
                                      </el-row>
                                    </div>
                                  </div>
                                </div>
                              </el-container>
                              <div class="table-container-div" v-else-if="field.ctrType=='extend_table'">
                                <div :style="field.sectionStyle" v-show="field.showLabel"><span v-html="field.label"></span></div>
                                <table id="field.id" :style="'border-collapse: collapse;width:'+field.tableWidth+';'+field.style">
                                  <tr :style="'height:'+field.rowHeight+'px;'+tr.style" v-for="tr in field.children" :key="tr.id" :rowid="row.id" :colid="col.id" :container_id="field.id" :subcontainer_id="tr.id">
                                    <td :style="getColWidths(field,tdIndex)+field.cellStyle" :key="tdIndex" v-for="(td,tdIndex) in tr.children" class="container" :rowid="row.id" :colid="col.id" :container_id="field.id" :subcontainer_id="tr.id" :sub2container_id="td.id">
                                      <div v-for="_row in td.children" :id="_row.id" :key="_row.orderNum" :parent_rowid="row.id" :parent_colid="col.id" :container_id="field.id" :subcontainer_id="tr.id" :sub2container_id="td.id" :ordernum="_row.orderNum" class="drag-row drag-box">
                                        <div v-show="_row.showLabel" class="form-section-title" :style="_row.sectionStyle">{{ _row.label }}</div>
                                        <el-row class="row-fluid clearfix" :style="_row.style" :gutter="_row.gutter">
                                          <el-col :id="_col.id" v-for="(_col, _col_index) in _row.children" :parent_rowid="row.id" :parent_colid="col.id" :key="_col_index" :container_id="field.id" :subcontainer_id="tr.id" :sub2container_id="td.id" :rowid="_row.id" :style="_col.style" class="column container_column" :span="_col.span">
                                            <template v-for="(_field, _field_index) in _col.children">
                                              <div v-if="_field.ctrType!='hidden'" :id="_field.id" class="online-form-item component" :fieldId="_field.fieldId" :parent_rowid="row.id" :parent_colid="col.id" :container_id="field.id" :subcontainer_id="tr.id" :sub2container_id="td.id" :colId="_col.id" :key="_field_index" :rowId="_row.id" :vmodel="_field.vModel" :orderNum="_field.orderNum" :ctrType="_field.ctrType">
                                              <el-form-item v-show="_field._isShowPower" :label-width="_field.labelWidth?_field.labelWidth:'90px'">
                                                <span v-show="_field.showLabel" slot="label" :style="_field.style">
                                                  <em v-if="_field._isRequired && !isReadOnly" class="red mr2">*</em>
                                                  <span v-html="langTitle(_field)" />
                                                  <span v-if="field.helperArticle !=='' && field.helperArticle !== undefined && (field.fieldTip ==='' || field.fieldTip === undefined)" class="fa fa-question-circle-o" title="点击查看说明" @click="openHelperArticle(field.helperArticle)"></span>
                                                  <el-tooltip :content="field.fieldTip" placement="bottom" effect="light" v-else-if="field.fieldTip&& !field.helperArticle">
                                                    <span class="fa fa-question-circle-o orange"/>
                                                  </el-tooltip>
                                                  <span v-else></span>
                                                  {{ _field.labelSuffix }}
                                                </span>
                                                <f2bpm-onlineformitem v-if="!_field.isContainer&&_field.ctrType!='extend_tabs'&&_field.ctrType!='extend_container'" :parentdata="data" :field="_field" />
                                              </el-form-item>
                                            </div>
                                            </template>
                                            
                                          </el-col>
                                        </el-row>
                                      </div>
                                    </td>
                                  </tr>
                                </table>
                              </div>
                            </el-form-item>
                          </div>
                        </template>
                      </el-col>
                    </el-row>
                  </div>
                </div>
              </el-form>
            </div>
          </div>
          <!--审批意见填写 -->
          <f2bpm-wfopinion @updateworkflowformdata="updateWorkflowformData" />
          <!--流程附件 -->
          <div v-if="wfContext.IsShowWrokflowFileList" class="wf-box">
            <div class="wf-box-section-title mr0">
              <span class="sectionPrefixBlueBar"></span><span class="section-title">流程附件</span>
              <span @click="collapseTargetClick('wrokflowFile')" :class="collapseTarget.wrokflowFile?'onlineform-row-collapse-button el-icon-arrow-down':'onlineform-row-collapse-button el-icon-arrow-up'"></span>
            </div>
            <div id="wfattachmentlist" class="p20" v-if="collapseTarget.wrokflowFile">
              <f2bpm-processinstfilelist v-if="wfContext.IsShowWrokflowFileList" ref="processinstfilelist" :pagesize="50" :wiid="wiid" />
            </div>
          </div>
          <!--办理过程 -->
          <div v-if="wfContext.IsShowApprovalList" class="wf-box">
            <div class="wf-box-section-title mr0">
              <span class="sectionPrefixBlueBar"></span><span class="section-title">办理过程</span>
              <span @click="collapseTargetClick('approvalrecordlist')" :class="collapseTarget.approvalrecordlist?'onlineform-row-collapse-button el-icon-arrow-down':'onlineform-row-collapse-button el-icon-arrow-up'"></span>
            </div>
            <div id="approvalrecordlist" class="p20" v-if="collapseTarget.approvalrecordlist">
              <f2bpm-approvalrecordlist v-if="wfContext.IsShowApprovalList" :pagesize="50" :wiid="wiid" />
            </div>
          </div>
          <!--传阅过程 -->
          <div v-if="wfContext.IsShowCirculationList" class="wf-box">
            <div class="wf-box-section-title mr0">
              <span class="sectionPrefixBlueBar"></span><span class="section-title">传阅过程</span>
              <span @click="collapseTargetClick('circulatedrecordlist')" :class="collapseTarget.circulatedrecordlist?'onlineform-row-collapse-button el-icon-arrow-down':'onlineform-row-collapse-button el-icon-arrow-up'"></span>
            </div>
            <div id="circulatedrecordlist" class="p20" v-if="collapseTarget.circulatedrecordlist">
              <f2bpm-circulatedrecordlist v-if="wfContext.IsShowCirculationList" :pagesize="50" :wiid="wiid" />
            </div>
          </div>
          <!--流程评论 -->
          <div v-if="wfContext.IsShowCommentList" class="wf-box">
            <div class="wf-box-section-title mr0">
              <span class="sectionPrefixBlueBar"></span><span class="section-title">流程评论</span>
              <span @click="collapseTargetClick('commentrecordlist')" :class="collapseTarget.commentrecordlist?'onlineform-row-collapse-button el-icon-arrow-down':'onlineform-row-collapse-button el-icon-arrow-up'"></span>
            </div>
            <div id="commentrecordlist" class="p20" v-if="collapseTarget.commentrecordlist">
              <f2bpm-commentrecordlist v-if="wfContext.IsShowCommentList" :pagesize="50" :wiid="wiid" />
            </div>
          </div>
        </div>
        <div class="workflow-form-content-bottom-empty-space">
          <div class="workflow-form-content-bottom-empty-space-content">
          </div>
        </div>
      </el-scrollbar>
    </div>
    <el-drawer size="330px" :title="drawerTitle" :visible.sync="drawer" :direction="direction">
      <div d="talk-drawer-content">
        <div :key="index" v-for="(item,index) in commentData.data">
          <div class="talk-message-container">
            <div class="user-information">
              <div>
                <img src="/static/images/user.jpg" class="user-image">
              </div>
              <div class="username">{{ item.creatorId==wfContext.UserId?'我':item.creator }}</div>
              <div class="time"> {{ item.createdTime }}</div>
            </div>
            <div class="talk-msg">{{ item.message }}</div>
          </div>
        </div>
      </div>
      <div class="drawer-footer">
        <div class="talk-send-message-container">
          <div>
            <el-input v-model="commentData.content" type="textarea" :rows="4" placeholder="输入评论内容" />
          </div>
          <div style="height:30px;" class="mt10">
            <span class="fl font12">当前共{{ commentData.total }}条</span> <span class="talk-send-button" @click="sendComment"><i class="fa fa-share" />发送</span>
          </div>
        </div>
      </div>
    </el-drawer>
    <div class="menuBox">
      <customMenu></customMenu>
    </div>
    <el-dialog
      title="标记已阅"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      width="30%">
      <div style="font-size: 14px;padding: 5px;margin-bottom: 5px;">请填写批注内容</div>
      <el-input
        type="textarea"
        :autosize="{ minRows: 4, maxRows: 6}"
        placeholder="请输入内容"
        v-model="AnnotationContent">
      </el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="clearForm" size="small">取 消</el-button>
        <el-button type="primary" @click="submitSetDone" size="small">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  import '@/resources/f2bpmUI/onlineForm/components/f2bpm-wfopinion.js';
  import '@/resources/f2bpmUI/onlineForm/components/f2bpm-approvalrecordlist.js';
  import '@/resources/f2bpmUI/onlineForm/components/f2bpm-circulatedrecordlist.js';
  import '@/resources/f2bpmUI/onlineForm/components/f2bpm-commentrecordlist.js';
  import f2bpmApprovalAction from '@/views/workflow/components/workflow/f2bpm-approval-action.vue';
  import f2bpmProcessinstfilelist from '@/views/workflow/components/workflow/f2bpm-processinstfilelist.vue';
  import customMenu from '@/components/customMenu.vue'
  export default {
    components: {
      f2bpmProcessinstfilelist, f2bpmApprovalAction,customMenu
    },
    data() {
      return {
        dialogVisible: false,
        AnnotationContent:'',
        scrollerHeight: 300,
        //打开或关闭的块
        collapseTarget: { baseInfoContainer: true, baseInfo: false, wrokflowFile: true, approvalrecordlist: true, circulatedrecordlist: true, commentrecordlist: true },
        language: "",
        deviceType: 'pc',
        // 节点表单
        actFormList: null,
        // 快照节点数据
        snapshotDataList: [],
        //流程变量
        processVariablesJson: "",
        // 选中的审核菜单
        approAction: '',
        // 可选的审核菜单
        approData: [], // [ {approAction:"同意",approName:"同意",orderNo:100 },{ approAction:"反对",   approName: "反对",orderNo:101 }],
        // 打印模板的ID
        printFormId: '',
        workflowTitleIsDisabled: false,
        isReadOnly: false,
        // 子表组件的Key
        subtableKey: '101',
        // url参数

        appId: '',
        wiid: '',
        wid: '',
        taskId: '',
        //强制指定表单模板
        forceFormId: "",
        forceActivityName: "",
        // 历史留痕ID
        traceId: '',
        taskState: 0,
        taskIsValid: 1,
        formAction: null,
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
        // 扁平化的字段定义(包含页面组件字段)
        fieldsDef: {},
        jscript: '',
        formProperty: {},
        //url表单
        urlForm: {},
        // 流程自己的数据，比如表单内的审批意见
        workflowformData: {
          hidOpinion: ''
        },
        // 表单字段数据
        data: {},
        //数组扁平化的页面组件字段定义
        pageFieldList: [],
        // 页面组件字段数据
        pageFieldData: {},
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
        importanceData: [],
        urgencyData: [],
        configTypeArray: [
          { dataField: 'importanceData', configType: '流程配置_重要级别', flag: '' },
          { dataField: 'urgencyData', configType: '流程配置_紧急程度', flag: '' }
        ],
        // stand:表单校验规则
        formRules: {
          'kj.wenBenYu': [
            { required: true, message: '必填项不能为空' }
            // {validator: FUI.Validator.onlyBigEnglisthChar},
          ],
          opinionContent: [
            { required: true, message: '必填项不能为空' }
          ]
        },
        //自定义二次确认框
        iframeWin:'',
        myMsg:{
          dialogVisible: false,
          text:'',
          btnText:['',''],
          btnFn:'',
          index:'',
          itemIndex:''
        },
        isShowTip:false,
        inputMaxWidth: 370
      };
    }
    , computed: {
      langworkflowInstinceState() {
        return function (status) {
          return window.getWorkflowStatus(status);
        };
      }
      , btnLangTitle() {
        return function (item) {
          var enTitle = item.buttonAlias;
          if (enTitle == "" || enTitle == null) {
            enTitle = item.buttonName;
          }
          var zhTitle = item.buttonName;
          return this.language == 'en-US' ? enTitle : zhTitle;
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
      , isHaveShowPower() {
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
    },
    mounted: function () {
      var that = this;
      let documentTitle = "";
      if (that.wfContext.WorkflowformAction == 0) {
        let workflowName = that.wfContext.WorkflowName;
        documentTitle = workflowName;
        that.collapseTarget.baseInfo = false;
      } else {
        let workflowName = that.wfContext.WorkflowName;
        documentTitle = workflowName ? workflowName : that.wfContext.WorkflowTitle;
        that.collapseTarget.baseInfo = true;
      }
      console.log("查看标题===：", that.wfContext.WorkflowformAction, documentTitle);
      document.title = documentTitle;
      that.$nextTick(function () {
        // 这里是在子组件全部执行完后才触发 ，确保子组件也挂载完毕
        f2grid_global_mainVueLoadComplated = true;
        that.loadUrlParmsToData();
        // 加载表单的动态脚本
        if (that.jscript) {
          try {
            const script = document.createElement('script');
            script.type = 'text/javascript';
            script.text = `
          console.info('========加载表单动态脚本==========');
            //========加载表单动态脚本==========
            ${that.jscript}
          `;
            document.getElementsByTagName('head')[0].appendChild(script);
          } catch (err) {
            console.info(err);
            FUI.Window.showMsg2('扩展脚本出错，请联系管理员');
          }
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
      that.resizeEmptySpaceHeight();
      that.refreshOnlineFormDataStatus();
      if (that.wfContext.FormType == 'UrlForm') {
        //获取url表单iframe
        that.iframeWin = that.$refs.iframeDom.contentWindow;
      }

      //监听流程表单 二次确认框
      window.addEventListener("message",event=>{
        console.log("postMessage:",event)
        that.myMsg=event.data;
      })
      that.$once('hook:beforeDestroy', function () {
        window.removeEventListener('message')
      })
    }

    , beforeCreate: function () {
      var that = this;
      // 获取到data
      // var data = that.$options.data();
    },
    created: function () {
      var that = this;
      that.language = that.$store.state.app.language;
      window.myvm = this;
      var fixedit = Object.toQueryString('fixedit') || '';
      var appId = Object.toQueryString('appId') || '';
      var wiid = Object.toQueryString('wiid') || '';
      var wid = Object.toQueryString('wid') || '';
      var taskId = Object.toQueryString('taskId') || '';
      var formAction = Object.toQueryString('formAction') || '';
      // 历史留痕ID，传入此参数表示查看的是历史留痕
      var traceId = Object.toQueryString('traceId') || '';
      //强制指定表单模板做为当前显示的表单
      var forceFormId = Object.toQueryString('forceFormId') || '';
      var forceActivityName = Object.toQueryString('forceActivityName') || '';
      that.forceActivityName = forceActivityName;
      that.traceId = traceId;
      that.forceFormId = forceFormId;
      that.appId = appId;
      that.wiid = wiid;
      that.wid = wid;
      that.taskId = taskId;
      that.formAction = formAction;
      if (formAction > 2) {
        that.isReadOnly = true;
        that.workflowTitleIsDisabled = true;
      }
      // 加载页面Model数据
      var indexJson = Object.toAjaxJson('/workflow/workflowform/', 'getIndexJson', { appId: appId, wiid: wiid, wid: wid, taskId: taskId, formAction: formAction, traceId: traceId, forceFormId: forceFormId, fixedit: fixedit });
      if (indexJson.success != undefined && indexJson.success == false) {
        FUI.Window.showMsg(indexJson.msg);
        return false;
      }
      that.indexJson = indexJson;
      //全开发表单获取pid
      if(indexJson.BusObjectDataJson && indexJson.BusObjectDataJson.length>0 && indexJson.BusObjectDataJson[0].data && indexJson.BusObjectDataJson[0].data.length >0 ){
        let _data=indexJson.BusObjectDataJson[0].data;
        that.pidData=  _data.filter(item =>item.name=='Pid')
      }

      that.pageBaseInfo = indexJson.pageBaseInfo;
      that.printFormId = indexJson.pageBaseInfo.printFormId;
      that.wfContext = indexJson.JSWorkflowContext;
      // 传递沟通时不允许修改表单
      if (that.wfContext.IsTaskCommunication === true) {
        that.wfContext.WorkflowformAction = 3;
        that.isReadOnly = true;
        that.workflowTitleIsDisabled = true;
      }
      if (that.wfContext.IsFixEditMode === true) {
        //是否强制为“编辑”模式（最终结果）
        that.wfContext.WorkflowformAction = 2;
      }

      that.wfContext.formRightJson = indexJson.FormRightJson;
      if (!that.wiid) {
        that.wiid = that.wfContext.WorkflowInstanceId;
      }
      if (!that.wid) {
        that.wid = that.wfContext.WorkflowId;
      }
      // 快照列表
      if (that.traceId != '') {
        that.snapshotDataList = indexJson.SnapshotDataList;
      }
      //结束时显示节点表单
      if (that.wfContext.CurrentActivityType == 'End') {
        that.actFormList = indexJson.actFormList || null;
      }

      // 将权限数组转为对象
      $.each(that.wfContext.formRightJson, function (index, item) {
        var name = item.name;
        that.wfContext.formRightJson[name] = item;
      });
      // 审核菜单
      if (that.pageBaseInfo.approData && that.pageBaseInfo.approData.length > 0) {
        that.approData = that.pageBaseInfo.approData;
      }
      WFContext = that.wfContext;
      WFContext.deviceType = that.deviceType;
      that.taskState = WFContext.TaskState;
      that.taskIsValid = WFContext.TaskIsValid;
      that.taskValid();
      if (that.wfContext.WorkflowTitle) {
        $('title').html(that.wfContext.WorkflowTitle);
      }
      if (that.wfContext.CurrentIsModifyProcInstTitle != true && WFContext.CurrentActivityType != 'Start') {
        that.workflowTitleIsDisabled = true;
      }
      if (that.wfContext.FormType == 'OnlineForm' || (that.wfContext.FormType == 'NoneForm' && that.indexJson.OnlineFormHtml.htmlfields)) {
        that.initailOnlineForm();
        try {
          that.loadPageFieldData();
        } catch (error) {
          console.info("加载页面组件数据出错：" + error);
        }
      } if (that.wfContext.FormType == 'UrlForm') {
        that.initailUrlForm();
      }
      FUI.Form.initailConfigTypeComboBox(this);
    },
    methods: {
      inputOnMouseOver(event){
        const target = event.target;
        this.inputMaxWidth = target.offsetWidth ? target.offsetWidth : 370;
        this.isShowTip = target.offsetWidth >= target.scrollWidth ? true : false;
      },
      //二次确认 确定方法
      myMsgOk(myMsg){
        console.log("index:",myMsg)
        this.myMsg.dialogVisible=false;
        this.iframeWin.postMessage({index:myMsg.index,btnFn:myMsg.btnFn,itemIndex:myMsg.itemIndex},"/");
      },

      refreshOnlineFormDataStatus() {
        let that = this;
        if (WFContext.formDataProcInstState != null && WFContext.formDataProcInstState != undefined && WFContext.formDataProcInstState != -1 && WFContext.formDataProcInstState != WFContext.WorkflowInstinceState) {
          let wiid = WFContext.WorkflowInstanceId;
          Object.toAjaxJson("/workflow/workflowform/", 'refreshOnlineFormDataStatus', { wiid: wiid }, true, null, function () {
            console.info('刷新表单表状态');
          });
        }
      }
      , resizeEmptySpaceHeight() {
        let that = this;
        let scrollerHeight = that.scrollerHeight;
        setTimeout(function () {
          let WorkflowContentDivHeight = $("#WorkflowContentDiv").height();
          var spaceHeight = scrollerHeight - WorkflowContentDivHeight - 10;
          console.info("scrollerHeight:" + scrollerHeight, WorkflowContentDivHeight, spaceHeight);
          $(".workflow-form-content-bottom-empty-space-content").height(spaceHeight);
        }, 300);
      }
      //初始Url表单
      , initailUrlForm() {
        var that = this;
        var htmlfields = that.indexJson.OnlineFormHtml.htmlfields;
        var urlParmsStr = window.location.search.substr(1);
        var url = htmlfields.url;
        if (url == null || url == "" || (url.indexOf("{") > -1 && url.indexOf("}") > -1)) {
          //配置的是JSON结构，直接返回
          return false;
        }
        //将浏览器的Url参数拼接进去
        if (urlParmsStr) {
          var theChar = url.indexOf("?") > -1 ? "&" : "?";
          url = url + theChar + urlParmsStr;
        }
        if (url.indexOf("wiid=") == -1) {
          url = url + "&wiid=" + that.wfContext.WorkflowInstanceId;
        }
        if (url.indexOf("formAction=") == -1) {
          url = url + "&formAction=" + that.wfContext.WorkflowformAction;
        }
        that.urlForm = htmlfields;
        that.urlForm.url = url;

      }
      //初始化在线表单设计
      , initailOnlineForm(formType) {
        var that = this;
        var onLineFormData = that.indexJson.OnlineFormHtml.busObjectDataJson;
        if (onLineFormData && onLineFormData.length > 0 && onLineFormData[0].data) {
          var procInstStateItem = onLineFormData[0].data.find(nv => nv.name == 'ProcInstState');
          var formDataProcInstState = procInstStateItem ? procInstStateItem.value : -1;
          WFContext.formDataProcInstState = formDataProcInstState != "" ? parseInt(formDataProcInstState) : -1;
        }
        // 加载表单模板渲染
        that.designerJson = that.indexJson.OnlineFormHtml;
        that.formProperty = that.designerJson.formProperty || {};
        if (that.designerJson.htmlfields) {
          that.fields = that.designerJson.htmlfields;
          that.jscript = that.designerJson.jscript || "";
        }
        // 收集字段定义（纯字段扁平化,修改字段必填标记）
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
        if (onLineFormData) {
          // 在线表单数据
          that.loadOnlineFormData(onLineFormData);
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
            console.info(err);
            FUI.Window.showMsg('表单数据获取失败，请联系管理员！');
          }
        } else {
          // FUI.F2Grid.bindAllMainTableMathEvent();
          // FUI.F2Grid.doSomething();
        }

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
      //拟搞时将Url字段参数填写到表单上
      , loadUrlParmsToData() {
        var that = this;
        if (that.wfContext.WorkflowformAction == 0) {
          var urlParms = Object.toQueryParmJson();
          $.each(urlParms, function (key, value) {
            if (that.data.hasOwnProperty(key)) {
              that.data[key] = value;
            }
          });
        }
      }
      , commentDelete(id) {
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
      validateForm(refFormName) {
        // stand:表单校验
        var success = false;
        this.$refs[refFormName].validate(valid => {
          success = valid;
        });
        return success;
      },
      taskValid() {
        var that = this;
        if (that.traceId) {
          return false;
        }
        // 任务有效性检查 4待阅 2待办
        if (that.formAction != 0 && (that.formAction <= 2 || that.formAction == 4)) {
          if (WFContext.TaskState == 2 || WFContext.TaskState == 99 || WFContext.TaskIsValid == false) {
            FUI.Window.showMsg(that, '当前任务已失效，任务可能已被处理', null, null, function () {
              if (window.opener != null) {
                window.opener.window.refreshTargetGrid('grid');
                window.close();
                return false;
              } else {
                FUI.Window.closeEdit(true, 'grid');
                return false;
              }
            });
          }
        }
        // 检查是否为我的待办
        if (that.formAction != 0 && that.formAction == 2 && WFContext.IsMySelfTask == false) {
          FUI.Window.showMsg(that, '当前任务不是你的待办，无权处理', null, null, function () {
            if (window.opener != null) {
              window.opener.window.refreshTargetGrid('grid');
              window.close();
              return false;
            } else {
              FUI.Window.closeEdit(true, 'grid');
              return false;
            }
          });
        }
        // 是否存在当前用户需要跳转到的待办
        if (that.formAction == 3 && WFContext.JumpToTaskId) {
          var url = __webpath + '/workflow/workflowform/index/?formAction=2&&wiid=' + WFContext.WorkflowInstanceId + '&taskId=' + WFContext.JumpToTaskId;
          window.location.href = url;
          //无#window.location.reload();

        }
      },
      // 按钮动作
      buttonAction(butItem) {
        var that = this;
        console.info(butItem);
        if (!butItem.actionName) {
          return false;
        }
        var excludeActionArr = ['save', 'send', 'invalid', 'sendReferred', 'reject'];
        if ($.inArray(butItem.actionName, excludeActionArr) == -1 && WFContext.FormType == 'UrlForm') {
          var resultMsg = submitUrlFormMethod(that, butItem, "otherWorkflowButtonClick");
          if (typeof resultMsg == "boolean" && resultMsg === false) {
            return false;
          }
          else if (typeof resultMsg == "string" && resultMsg != "") {
            FUI.Window.showMsg(resultMsg);
            return false;
          }
        }
        var fun = butItem.actionName;
        if ((butItem.type == 'cust_always'||butItem.type == 'cust') && butItem.excuteFn) {
          var isExist = Object.toIsExitsFunction(butItem.excuteFn);
          if (isExist) {
            var exfunc = eval(butItem.excuteFn);
            exfunc(that, that.data);
          }
        }
        else if (that[fun]) {
          var fn = that[fun];
          fn(butItem);
        }
        else {
          switch (butItem.actionName) {
            case 'flowmap': {
              showWorkflowMap(butItem.beforeFn);
            }
              break;
            case 'print': {
              if (!that.printFormId) {
                var res = Object.toAjaxJson('/workflow/workflowform/', 'getPrintFormId', { wfformId: that.wfContext.FormId });
                if (res.success) {
                  that.printFormId = res.data;
                }
              }
              if (that.printFormId == '' || that.printFormId == null || that.printFormId == undefined) {
                // 判断有没有打印模板，没有时则使用打印页面
                printTable(butItem.beforeFn);
              } else {
                printExcelTable(butItem.beforeFn, '', that.wfContext.WorkflowInstanceId, that.printFormId);
              }
            }
              break;
            case 'showHistoryApproval':
            case 'approvalHistory': {
              showHistoryApproval(butItem.beforeFn);
            }

              break;
            case 'circulatedHistory':
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
              //如果有则调用前置事件的扩展
              if (Object.toIsExitsFunction("extend_sendWorkflowForm_before")) {
                var isExtendValidatePass = extend_sendWorkflowForm_before();
                if (isExtendValidatePass == false) {
                  return;
                }
              }
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
              openSendDialog(that, butItem.beforeFn, butItem);
            }

              break;
            case 'invalid': {
              invalidWorkflow(that, butItem.beforeFn, butItem);
            }

              break;
            case 'taskclaim': {
              taskclaim(that, butItem.beforeFn, butItem);
            }

              break;
            case 'sendCirculated': {
              openCirculatedActor(that, butItem.beforeFn, butItem);
            }
              break;
            case 'setDoneCirculated': {
              // 修改为可以添加已阅意见
              this.setDoneCirculateds(that, butItem.beforeFn, butItem);
            }
              break;
            case 'sendReferred': {
              openReferredActor(that, butItem.beforeFn, butItem);
            }

              break;
            case 'reject': {
              openRejectActorSelected(that, butItem.beforeFn, butItem);
            }

              break;
            case 'comment': {
              that.openComment(butItem);
            }

              break;
            case 'withdraw': {
              withdrawWorkflow(that, butItem.beforeFn);
            }

              break;
            case 'withdrawToStart': {
              withdrawWorkflow(that, butItem.beforeFn, true);
            }

              break;
            case 'taskdister': {
              openSendTaskdister(that, butItem.beforeFn);
            }

              break;
            case 'taskdisterList': {
              showHistoryTaskdister(that, butItem.beforeFn);
            }

              break;
            case 'sendTaskdister': {
              openSendTaskdisterDailog(that, butItem.beforeFn);
            }

              break;
            case 'snapshot': {
              that.openFormDataTrace(that, butItem.beforeFn);
            }

              break;
            case 'appendTask': {
              that.appendTaskUser(that, butItem.beforeFn);
            }

              break;
            case 'procInstBaseInfo': {
              that.procInstBaseInfo(that, butItem.beforeFn);
            }

              break;

          }
        }

      },

      // ===stand:标准化方法============
      closeEdit() {
        // stand:关闭编辑窗口
        FUI.Window.closeEdit();
      },
      // ===stand:标准化方法结束============
      loadData() {
        var that = this;
        if (formAction != FUI.FormAction.Add) {
          FUI.Form.bindDataToForm(that, FUI.Handlers.FuiFrameworkHandler, FUI.Method.AutoGetViewModelMethod, keyId, null, mainTable);
        }
      },
      save(butItem) {
        var that = this;
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

          var success = that.validateForm('formRef', true);
          if (!success) return false;
        }
        saveWorkflow(that, false, beforeFn, butItem);
      },
      isFixEditForm(butItem) {
        let that = this;
        let funcName = "extend_isFixEditForm_click";
        let isPass = false;
        if (Object.toIsExitsFunction(funcName)) {
          isPass = window[funcName](butItem);
        } else {
          FUI.Window.showMsg(that, "未实现JS事件函数,请在表单设计的“JS脚本”中编写。");
          return false;
        }
        if (isPass === true) {
          window.location.href = window.location.href + "&fixedit=1";
        }

      },
      //校验表单
      validateForm(refFormName, isNotToCheckTheEmptyValue) {
        var that = this;
        richeditorArrValueToInput(that);
        //校验子表行数必须
        if (that.validateRequiredNumOfRows() === false) {
          return;
        }
        //如果有则调用前置事件的扩展
        if (Object.toIsExitsFunction("extend_validateWorkflowForm_before")) {
          var isExtendValidatePass = extend_validateWorkflowForm_before();
          if (isExtendValidatePass == false) {
            return;
          }
        }
        var success = isNotToCheckTheEmptyValue ? FUI.validate(that.fieldsDef, that.data, null, true) : FUI.validate(that.fieldsDef, that.data);
        return success;
      },
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
      , openHelperArticle(articleCode) {
        var url = __webpath + '/workflow/security/article/articleView?code=' + articleCode;
        FUI.Window.openEdit(url, '查看帮助', 'View', null, null, null, null, null, null, true);
      },
      traceFormView(traceId) {
        var that = this;
        var url = __webpath + '/workflow/workflowform/index/?formAction=3&wiid=' + that.wiid + '&traceId=' + traceId;
        window.location.href = url;
      },
      openActFormView(item) {
        var that = this;
        var forceFormId = item.actFormId;
        that.forceFormId = forceFormId;
        var forceActivityName = item.activityName;
        var url = __webpath + '/workflow/workflowform/index/?formAction=3&wiid=' + that.wiid + '&forceFormId=' + forceFormId + "&forceActivityName=" + forceActivityName;
        if (!forceFormId) {
          url = __webpath + '/workflow/workflowform/index/?formAction=3&wiid=' + that.wiid;
        }
        window.location.href = url;
      }
      , openFormDataTrace() {
        var that = this;
        var res = Object.toAjaxJson('/workflow/workflowform/', 'getLastTraceIdByWiid', { wiid: that.wiid });
        if (res.success) {
          var traceId = res.data;
          var url = __webpath + '/workflow/workflowform/index/?formAction=3&wiid=' + that.wiid + '&traceId=' + traceId;
          FUI.Window.open(url);
        } else {
          FUI.Window.showMsg(res.msg);
        }
      },
      toPinYin(sourceField, targetField) {
        if (!this.data[targetField]) {
          const source = this.data[sourceField];
          this.data[targetField] = Object.toPinYin(source);
        }
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
      updateWorkflowformData(propertyName, newValue) {
        var that = this;
        that.workflowformData[propertyName] = newValue;
      },
      updateapproalaction(value) {
        var that = this;
        that.approAction = value;
      },
      openComment(butItem) {
        var that = this;
        that.loadComment();
        that.drawer = true;
        that.drawerTitle = '流程评论';
      },
      //流程信息
      procInstBaseInfo(butItem) {
        var that = this;
        var type = "appendTask";
        var typeTitle = '加签处理人';
        var appId = that.wfContext.AppId;
        var wiid = that.wfContext.WorkflowInstanceId;
        var taskId = that.wfContext.TaskId;
        var formAction = that.wfContext.WorkflowformAction;
        var width;
        var height;
        if(window.screen.width > 500){
          width = 700;
          height = 400;
        }else{
          width = window.screen.width;
          height = window.screen.height-120;
        }
        FUI.Window.openEdit('/workflow/workflowBusiness/showProcInstBaseInfo/?appId=' + appId + '&wiid=' + wiid + '&taskId=' + taskId, '流程信息', formAction, 'grid', width, height);
      },
      //加签
      appendTaskUser() {
        var that = this;
        var type = "appendTask";
        var typeTitle = '加签处理人';
        var wiid = that.wfContext.WorkflowInstanceId;
        var sheetId = that.wfContext.SheetId;
        var activityId = that.wfContext.CurrentActivityId;
        var width;
        var height;
        if(window.screen.width > 500){
          width = 880;
          height = 580;
        }else{
          width = window.screen.width;
          height = window.screen.height-120;
        }
        FUI.Window.openEdit('/workflow/workflowMonitor/appendTask/?type=' + type + '&wiid=' + wiid + '&sheetId=' + sheetId + "&activityId=" + activityId, '流程单号【' + sheetId + '】', 'Add', 'grid', width, height);
      }
      , uploadWorkflowAttachment() {
        var that = this;
        var width;
        var height;
        if(window.screen.width > 500){
          width = 600;
          height = 450;
        }else{
          width = window.screen.width;
          height = window.screen.height-120;
        }
        if (that.wfContext.WorkflowformAction == WF.WorkflowformAction.Todo || that.wfContext.WorkflowformAction == 0) {
          var url = __webpath + '/workflow/workflowBusiness/attachmentUpload?bk=' + that.wfContext.WorkflowInstanceId + '&attachmentType=Workflow&activityName=' + that.wfContext.CurrentActivityName + '&activityId=' + that.wfContext.CurrentActivityId;
          FUI.Window.openEdit(url, '上传流程附件', 'Add', 'AttachmentsGrid', width, height);
        } else {
          FUI.Window.showMsg('当前不是您待办事项，不能上传附件');
        }
        return false;
      },
      refreshProcessinstfilelist() {
        this.$refs.processinstfilelist.dataGridSearch();
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
          that.triggerFieldLinkages(field);
        }
      }

      , appendFieldValue(fieldName, newValue, vueDataName, subVueDataName) {
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
      , collapseTargetClick(name) {
        var that = this;
        that.collapseTarget[name] = !that.collapseTarget[name];
        that.resizeEmptySpaceHeight();
        event.stopPropagation();
        event.preventDefault();

      },
      // 打开意见弹窗
      handleOpen(){
        var that = this;
        that.AnnotationContent = '';
        that.dialogVisible = true;
      },
      // 关闭弹窗
      clearForm(){
        this.dialogVisible = false;
        this.AnnotationContent = '';
      },
      //打开弹窗设置已阅
      setDoneCirculateds($vm, beforeFn) {
        var that = this;
        try {
          //调用按钮前置函数
          if (!actionButtonBefore(beforeFn)) return false;
        } catch (err) {
          alert(err);
          return false;
        }
        FUI.Window.confirm("确定要标记为已阅吗？", "温馨提示", function (index) {
          that.AnnotationContent = '';
          that.dialogVisible = true;
        });

        return false;
      },
      // 确认已阅
      submitSetDone(){
        var that = this;
        try {
          var dataJsonParm = {};
          dataJsonParm.formAction = WFContext.WorkflowformAction;
          dataJsonParm.wiid = WFContext.WorkflowInstanceId;
          dataJsonParm.formId = WFContext.FormId;
          dataJsonParm.wid = WFContext.WorkflowId;
          dataJsonParm.appId = WFContext.AppId;
          dataJsonParm.taskId = WFContext.TaskId;
          dataJsonParm.opinion = that.AnnotationContent;
          var mssg = Object.toAjaxJson(workflowformSender, "setDoneCirculated", dataJsonParm);
          if (mssg === false) return false;
          if (mssg.success) {
            that.dialogVisible = false;
            if (window.opener != null) {
              try {
                //如果有自定义的方法调用业务表单自定义刷新父窗口的方法
                if (typeof customRefreshOpenerWindow == "function") {
                  customRefreshOpenerWindow.call(this);

                } else {
                  window.opener.window.refreshTargetGrid("grid");

                }
              } catch (err) {
              }

            }
            FUI.Window.showMsg(mssg.msg, "提示", "info", function () {
              if (window.opener != null) {
                window.close();
              }
              else {
                FUI.Window.closeEdit(true, 'grid');
              }

            });

          } else {
            FUI.Window.showMsg(mssg.msg, null, 1);
          }
          return false;

        } catch (err) {
          FUI.Window.showMsg(err);
          return false;
        }
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
    // WFContext.WorkflowformAction=2;
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
    // 当前登录人的组织编码
    // WFContext.CurrentOrgId="bpmRoot";
    // 当前登录人的组织名称
    // WFContext.OrgName="F2BPM组织";
    // 当前登录人UserId
    // WFContext.CurrentUserId="3c1df0b3-a4d9-4731-b143-02e81bce17ce";
    // 当前登录人账号
    // WFContext.CurrentAccount="admin";
    // 当前登录人姓名
    // WFContext.CurrentRealName="系统管理员";
    // 当前登录人租户号
    // WFContext.CurrentTenantId="BPM";
    //
    // 当前登录人所拥有的角色编码
    // WFContext.RoleCodes="superadmin,20191230151132131";
    //
    // //当前登录用户其它扩展属性
    // WFContext.OtherProperty=[{key:'Aihao',value:'羽毛球'},{key:'Job',value:'高级工程师'}];

    //* **********流程实例上下文结束***********//
</script>
<style lang="scss" scoped>
  @import "~@/resources/css/workflowform.css";
  @import "/static/f2bpmUI/onlineForm/onlinedisginer.css";

  ::v-deep .mymsg{
    width: 400px!important;

    .el-dialog__body { padding:15px 15px !important;
      span{font-family: element-icons!important;  speak: none;  font-style: normal;
        font-weight: 400;  font-variant: normal;  text-transform: none;  line-height: 1;  vertical-align: baseline;
        display: flex;  align-items: center; -webkit-font-smoothing: antialiased;}
      span:before { content: "\e7a3"; color: #E6A23C; font-size: 20px;  margin-right: 10px;  }
    }
    .dialog-footer{ width:100%;display: flex; align-items: center; justify-content: flex-end; }

  }

  .el-dialog__wrapper {
    transition-duration: 0.3s;
  }
  .dialog-fade-enter-active{
    animation: none !important;
  }
  .dialog-fade-leave-active {
    transition-duration: 0.15s !important;
    animation: none !important;
  }

  .dialog-fade-enter-active .el-dialog,
  .dialog-fade-leave-active .el-dialog{
    animation-fill-mode: forwards;
  }

  .dialog-fade-enter-active .el-dialog{
    animation-duration: 0.3s;
    animation-name: anim-open;
    animation-timing-function: cubic-bezier(0.6,0,0.4,1);
  }

  .dialog-fade-leave-active .el-dialog{
    animation-duration: 0.3s;
    animation-name: anim-close;
  }


  @keyframes anim-open {
    0% { opacity: 0;  transform: scale3d(0, 0, 1); }
    100% { opacity: 1; transform: scale3d(1, 1, 1); }
  }


  @keyframes anim-close {
    0% { opacity: 1; }
    100% { opacity: 0; transform: scale3d(0.5, 0.5, 1); }
  }


  .container-scroll-bar {
    ::v-deep .el-scrollbar__wrap,
    ::v-deep .el-scrollbar__view {
      overflow-x: auto;
    }
  }
  .formBox{
    position: relative;
  }
  .menuBox{
    position: fixed;
    left: 90%;
    top: 90%;
  }
</style>
