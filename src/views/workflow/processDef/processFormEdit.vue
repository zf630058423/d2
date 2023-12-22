<template>
  <div class="f2bpm-page-dialog-layout">
    <el-form ref="formRef" size="small" :rules="formRules" :model="data" class="f2bpm-editform" label-width="120px">
      <el-form-item label="表单应用分类" prop="formCategoryCode">
        <treeselect v-model="data.formCategoryCode" size="mini" :default-expand-level="2" :multiple="false" placeholder="请选择分类" :options="treeData" />

      </el-form-item>
      <el-form-item label="表单名称" prop="formName">
        <el-input v-model="data.formName" placeholder="" @blur.native.capture="toPinYin('formName','formKey')" />
      </el-form-item>
      <el-form-item label="表单KEY" prop="formKey">
        <el-input v-model="data.formKey" placeholder="" :disabled="formAction!='Add'" />
      </el-form-item>
      <el-form-item v-if="false" label="应用方式" prop="applyType">
        <el-select v-model="data.applyType">
          <el-option label="请选择" value="" />
          <el-option label="流程表单" value="workflowForm" />
          <el-option label="普通表单" value="noWorkflowForm" />
        </el-select>
        <br><span class="font12">【流程表单：是指专门提供给流程使用的在线表单】【无流程表单：是指不需要走流程的纯在线表单,实现快速增删改查】</span>
      </el-form-item>

      <el-form-item label="表单类型" prop="formType">
        <el-select v-model="data.formType" :disabled="formAction=='Edit'">
          <el-option label="请选择" value="" />
          <el-option label="在线表单" value="OnlineForm" />
          <el-option label="URL表单" value="UrlForm"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item v-show="data.formType=='UrlForm'" label="PC端URL">
        <el-input v-model="data.templateContent" placeholder="填写PC端URL地址">
        </el-input>
      </el-form-item>
      <el-form-item v-show="data.formType=='UrlForm'" label="手机端URL">
        <el-input v-model="data.mobileTemplateContent" placeholder="填写手机端URL地址">
        </el-input>
      </el-form-item>

      <el-form-item v-show="data.formType=='OnlineForm'" label="数据模型">
        <el-input v-model="data.refFormDefName" placeholder="请选择“数据模型”">
          <template slot="append"><i class="fa fa-search cur" @click="onOnlineFormSelect">选择</i></template>
        </el-input>
        <span v-if="formAction!='Add'" class="fa fa-cog font10 cur" title="数据模型" @click="openFormDefEdit">查看数据模型</span>
      </el-form-item>


      <el-form-item label="备注">
        <el-input v-model="data.remark" type="textarea" :rows="4" placeholder="备注" />
      </el-form-item>
      <div class="dialogfooter">
        <el-button v-if="formAction!='View'" size="small" type="primary" @click="submitForm()"><i class="fa fa-save" />保存</el-button>
        <el-button id="btn_cancel" size="small" @click="closeEdit"> <i class="fa fa-minus-circle" />取消</el-button>
      </div>
    </el-form>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        formAction: null,
        treeData: [],
        data: {
          formId: '',
          formCategoryCode: null,
          formName: '',
          formKey: '',
          formType: 'OnlineForm',
          formDefId: '',
          refFormDefName: '',
          applyType: '',
          isMaster: 1,
          versionNo: 0,
          creatorId: '',
          lastModifier: '',
          lastModTime: '',
          createdTime: '',
          creatorRealName: '',
          templateContent: "",
          mobileTemplateContent: ""

        },
        formRules: {
          formCategoryCode: [
            { required: true, message: '请选择分类', trigger: 'blur' }
          ],
          formType: [
            { required: true, message: '请选择表单类型' }
          ],
          formName: [
            { required: true, message: '必填项不能为空', trigger: 'blur' }
          ],
          applyType: [
            { required: true, message: '必填项不能为空', trigger: 'blur' }
          ],
          formKey: [
            { required: true, message: '必填项不能为空', trigger: 'blur' }
          ]
        }
      };
    },
    created: function () {
      var that = this;
      var applyType = Object.toQueryString('applyType') || '';
      if (formAction == FUI.FormAction.Add) {
        that.data.applyType = applyType;
      }
      that.formAction = formAction;
      that.loadTreeSelect();
      that.loadData();
    },
    mounted() {
      window.myvm = this;
    },
    methods: {
      // ===stand:标准化方法============
      closeEdit() {
        // stand:关闭编辑窗口
        FUI.Window.closeEdit();
      },
      // ===stand:标准化方法结束============
      loadData() {
        var that = this;
        if (formAction != FUI.FormAction.Add) {
          FUI.Form.bindDataToForm(that, "/workflow/processForm/", "getModel", keyId, null, mainTable);
        }
      },
      loadTreeSelect() {
        var that = this;
        var treeUrl = FUI.Handlers.CategoryHandler + '?groupKey=FormCategory&needRoot=false';
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
        if (that.data.formType == "OnlineForm" && that.data.formDefId == '') {
          FUI.Window.showMsg(that, '请选择数据模型');
          return false;
        } else if (that.data.formType != "OnlineForm") {
          that.data.formDefId = '';
          that.data.refFormDefName = '';
        }
        if (that.data.formType == "UrlForm" && !that.data.templateContent) {
          FUI.Window.showMsg(that, '请填写Url表单地址');
          return false;
        }
        var success = that.validateForm('formRef');
        if (!success) return false;
        FUI.Form.submitForm(that, that.data, "/workflow/processForm/", 'saveProcessForm', formAction, keyId, parentGridId, null, null, null, null, function (res) {
          if (res.success) {
            if (formAction == FUI.FormAction.Add && that.data.formType == "OnlineForm") {
              let type = "pc";
              let formKey = res.data.formKey;
              let formDefId = res.data.formDefId;
              let formId = res.data.formId;
              var url = __webpath + '/workflow/smartForm/onlineFormDesigner/';
              FUI.Window.showMsg2(that, res.msg, null, 1, function () {
                FUI.Window.open(url + '?type=' + type + '&formKey=' + formKey + '&formDefId=' + formDefId + '&formId=' + formId);
                FUI.Window.closeEdit(true);
              });
            } else {
              FUI.Window.showMsg2(that, res.msg, null, 1, function () {
                FUI.Window.closeEdit(true);
              });
            }
          } else {
            FUI.Window.showMsg(that,res.msg);
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
      openFormDefEdit() {
        var that = this;
        var title = that.data.refFormDefName;
        var formDefId = that.data.formDefId;
        var url = '/workflow/smartForm/form/formModeDesigner?formDefId=' + formDefId;
        FUI.Window.openEdit(url, title, 'Edit', null, 600, 450, null, null, null, true, null, null, true);
      },
      toPinYin(sourceField, targetField) {
        if (!this.data[targetField]) {
          const source = this.data[sourceField];
          this.data[targetField] = Object.toPinYin(source);
        }
      },
      onOnlineFormSelect() {
        WF.SelectorDialog.onlineFormDefSelectorDialog(this, 'formDefId', 'refFormDefName');
      }
    }
  }
</script>