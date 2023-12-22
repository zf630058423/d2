<template>
  <div class="f2bpm-page-dialog-layout  f2bpm-page-right">
    <el-form ref="formRef" size="small" :rules="formRules" :model="data" class="f2bpm-editform" label-width="120px">
      <el-row>
        <el-col :span="24">
          <el-form-item label="流程分类" prop="appCategoryID">
            <treeselect v-model="data.appCategoryID" placeholder="请选择分类" :default-expand-level="2" :multiple="false" :options="treeData" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="表单应用" prop="formKey">
            <el-input v-model="data.formName" placeholder="请选择表单应用" :disabled="formAction=='Edit'">
              <template slot="append"><i class="fa fa-search cur" @click="onFrmKeySelect">选择</i>
              </template>
            </el-input>
            <span class="blue font10">可选择多个表单进行批量添加</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="表单KEY">
            <span class="cube bg-blue" v-html="data.formKey" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="共用流程定义" prop="workflowKey">
            <el-input v-model="data.workflowDefTitle" placeholder="请选择流程定义" :disabled="formAction=='Edit'">
              <template v-if="isCanModifyWf" slot="append"><i class="fa fa-search cur" @click="onWorkflowKeySelect">选择</i>
              </template>
            </el-input>
            <span class="font10">共用流程定义即选择被共用的流程，使用时需注意被共用的流程请勿配置个性化的设置，比如不可设置节点表单等。</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="流程KEY">
            <span class="cube bg-blue" v-html="data.workflowKey" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-form-item label="显示顺序" prop="showOrder">
            <el-input-number v-model="data.showOrder" placeholder="" />
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item label="手机端发起" prop="isMobileStart">
            <el-switch v-model="data.isMobileStart" active-color="#87DC48" inactive-color="#DEDEDE" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="手机端审批" prop="isMobileApproval">
            <el-switch v-model="data.isMobileApproval" active-color="#87DC48" inactive-color="#DEDEDE" />
          </el-form-item>
        </el-col>
        <el-col v-if="!isNoneProcessForm" :span="6">
          <el-form-item label="表单快照留痕">
            <el-switch v-model="data.isSnapshot" active-color="#87DC48" inactive-color="#DEDEDE" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="应用说明">
        <el-input v-model="data.description" type="textarea" :rows="4" placeholder="" />
      </el-form-item>
      <el-form-item label="说明">
        <spna class="font12">1、批量添加流程应用的名称将使用表单名称作为流程应用名称<br>2、标题模板将使用表单名称作为标题模板。</spna>
      </el-form-item>
      <div class="dialogfooter2">
        <el-button v-if="formAction=='Add'" size="small" type="primary" @click="submitForm"><i class="fa fa-save" />保存
        </el-button>
        <el-button id="btn_cancel" size="small" @click="closeEdit"><i class="fa fa-minus-circle" />取消
        </el-button>
      </div>
    </el-form>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        // 共用流程与表单组合-批量添加
        appIdInstCount: 0,
        isCanModify: true,
        isCanModifyWf: true,
        isCanModifyAppId: true,
        actionName: 'goProcessAppEdit',
        isNoneProcessForm: false,
        formAction: null,
        loading: false,
        treeData: [],
        data: {
          appId: '',
          appType: "combine",
          appCategoryID: null,
          workflowKey: '',
          formKey: '',
          formName: '',
          workflowName: '',
          creatorRealName: '',
          workflowDefTitle: '',
          titleTemplate: '#WorkflowName#',
          createdTime: null,
          showOrder: 0,
          enable: true,
          isSnapshot: false,

          appCode: "",
          appAlias: "",
          appAlias2: "",
        },
        // stand:表单校验规则
        formRules: {
          showOrder: [
            { required: true, validator: FUI.Validator.required },
            { validator: FUI.Validator.number }
          ],
          appCategoryID: [
            { required: true, message: '请选择分类' }
          ],
          formKey: [
            { required: true, message: '请选择“表单应用”' }
          ],
          workflowKey: [
            { required: true, message: '请选择流程定义' }
          ]

        }
      };
    },
    created: function () {
      var that = this;
      that.formAction = formAction;
      that.keyId = keyId;
      if (formAction == FUI.FormAction.Add) {
        that.loadNewAppId();
      }
      that.loadTreeSelect();
      that.loadData();
    },
    methods: {
      // ===stand:标准化方法============
      closeEdit() {
        // stand:关闭编辑窗口
        FUI.Window.closeEdit();
      },
      changeIsNoneProcessForm(v) {
        var that = this;
        if (v) {
          that.data.formKey = 'NoneForm';
          that.data.formName = '无需表单';
          that.data.isSnapshot = false;
        } else {
          that.data.formKey = '';
          that.data.formName = '';
        }
      },
      loadNewAppId() {
        var that = this;
        var res = Object.toAjaxJson(FUI.Handlers.WorkflowManageHandler, 'getAutoNewAppId', null);
        if (res.success) {
          that.data.appId = res.data;
        }
      },
      // ===stand:标准化方法结束============
      loadData() {
        var that = this;
      },
      loadTreeSelect() {
        var that = this;
        var treeUrl = FUI.Handlers.CategoryHandler + '?groupKey=WorkflowGroup&needRoot=false';
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
      submitForm() {
        var that = this;
        if (that.data.formType == 'OnlineForm' && that.data.formDefId == '') {
          FUI.Window.showMsg(that, '请选择在线表单');
          return false;
        } else if (that.data.formType != 'OnlineForm') {
          that.data.formDefId = '';
          that.data.refFormDefName = '';
        }
        var success = that.validateForm('formRef');
        if (!success) return;
        if (!that.data.formKey) {
          FUI.Window.showMsg(that, '请选择“表单应用”');
          return false;
        }
        FUI.Form.submitForm(that, that.data, FUI.Handlers.WorkflowManageHandler, 'saveBathProcessApppCombin', formAction, keyId, parentGridId,
          null, null, null, null,
          function (data) {
            if (data.success) {
              FUI.Window.refreshParentGrid();
              FUI.Window.showMsg(that, data.msg, null, 1, function () {
                FUI.Window.closeEdit(true, parentGridId);
              });
            } else {
              FUI.Window.showMsg(that, data.msg);
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
      onWorkflowKeySelect() {
        WF.SelectorDialog.workflowSelector(this, 'workflowKey', 'workflowDefTitle', null, 'combine');
      },
      selectVar(inputId) {
        var that = this;
        if (that.data.formKey == '') {
          FUI.Window.showMsg('请配置表单应用');
          return false;
        }
        WF.SelectorDialog.selectFormFieldProcInstContextVar(that, null, null, that.data.formKey, inputId, false);
      },

      onFrmKeySelect(value) {
        // 选择表单应用
        WF.SelectorDialog.processFormSelector(this, 'formKey', 'formName', false);
      },
      openOnlineFormDesigner() {
        var that = this;
        var res = Object.toAjaxJson(FUI.Handlers.SmartFormHandler, 'getMasterProcessFormByFormKey', { formKey: that.data.formKey });
        if (res.success) {
          var formDefId = res.data.formDefId;
          var formId = res.data.formId;
          var formKey = res.data.formKey;
          var url = __webpath + '/workflow/smartForm/onlineFormDesigner/?type=pc&formKey=' + formKey + '&formDefId=' + formDefId + '&formId=' + formId;
          FUI.Window.open(url, '_blank');
        }
      },
      // 流程应用编辑
      goProcessAppEdit() {
        window.location.href = __webpath + '/workflow/processDef/processAppCombinEdit/?parentGridId=grid&formAction=Edit&mainTable=f2bpm_ProcessApp&keyId=' + this.data.appId;
      },
      // 流程定义
      goProcessDefListByWorkflowKey() {
        var that = this;
        window.location.href = __webpath + '/workflow/processDef/processDefListByWorkflowKey?appType=combine&appId=' + that.data.appId + '&workflowKey=' + this.data.workflowKey;
      },
      tabsClick(tab) {
        var that = this;
        var name = tab.name;
        if (formAction == 'Add') {
          FUI.Window.showMsg('首次新增，请填写并点击“保存”基础信息');
          return;
        }
        var fn = that[name];
        fn();
      }
    }
  }
</script>