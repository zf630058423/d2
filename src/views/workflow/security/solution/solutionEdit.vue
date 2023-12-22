<template>
  <div class="f2bpm-page-dialog-layout">
    <div>
      <el-form ref="formRef" :rules="formRules" size="small" :model="data" class="f2bpm-editform" label-width="120px">
        <el-form-item label="分类" prop="categoryCode">
          <treeselect v-model="data.categoryCode" placeholder="请选择分类" :default-expand-level="2" :multiple="false" :options="treeData" />
        </el-form-item>
        </el-form-item>
        <el-form-item label="标题" prop="solutionTitle">
          <el-input v-model="data.solutionTitle" placeholder="标题" />
        </el-form-item>
        <el-form-item label="类型" prop="solutionType" :disabled="formAction=='Edit'">
          <el-select v-model="data.solutionType">
            <el-option label="请选择" value="" />
            <el-option label="有流程表单" value="workflowForm" />
            <el-option label="无流程表单" value="noWorkflowForm" />
          </el-select>
          <br><span class="font12">【有流程表单：是指创建一个带流程的表单应用】
            <br>【无流程表单：是指不需要走流程的纯在线表单应用,实现快速增删改查】</span>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="data.remarks" type="textarea" :rows="4" placeholder="" />
        </el-form-item>
        <div class="dialogfooter">
          <el-button v-if="formAction!='View'" size="small" type="primary" @click="submitForm()"><i class="fa fa-save" />保存
          </el-button>
          <el-button id="btn_cancel" size="small" @click="closeEdit"><i class="fa fa-minus-circle" />取消
          </el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>

  export default {
    data() {
      return {
        formAction: null,
        treeData: [],
        data: {
          solutionTitle: '',
          categoryCode: null,
          isEnabled: true,
          refAppId: '',
          refFormDefId: '',
          refFormDefName: '',
          formKey: '',
          creatorRealName: '',
          creatorId: '',
          createdTime: '',
          tenantId: ''
        },
        formRules: {
          solutionTitle: [
            { required: true, message: '必填项不能为空' }
          ],
          solutionType: [
            { required: true, message: '必填项不能为空' }
          ],
          categoryCode: [
            { required: true, message: '必填项不能为空' }
          ]
        }
      };
    },
    created: function () {
      var that = this;
      that.formAction = formAction;
      if (formAction == FUI.FormAction.Add) {
        var categoryCode = Object.toQueryString('categoryCode') || null;
        const currUser = that.$store.state.user.author;
        that.data.categoryCode = categoryCode;
        that.data.creatorId = currUser.userId;
        that.data.tenantId = currUser.tenantId;
        that.data.creatorRealName = decodeURI(currUser.realName);
        that.data.createdTime = Object.toGetCurrentDateTimeString();
      }
      that.loadTreeSelect();
      that.loadData();
    },
    methods: {
      closeEdit() {
        FUI.Window.closeEdit();
      },
      loadData() {
        var that = this;
        if (formAction != FUI.FormAction.Add) {
          FUI.Form.bindDataToForm(that, '/workflow/security/solution/', 'getModel', keyId, null, mainTable);
        }
      },
      loadTreeSelect() {
        var that = this;
        var treeUrl = FUI.Handlers.CategoryHandler + '?groupKey=SolutionGroup&needRoot=false';
        Object.toAjaxJson(treeUrl, null, null, true, null, function (res) {
          if (res.success) {
            that.treeData = res.data;
          } else {
            FUI.Window.showMsg(res.msg);
          }
        });
      },
      submitForm() {
        var that = this;
        var success = that.validateForm('formRef');
        if (!success) return;
        FUI.Form.submitForm(that, that.data, '/workflow/security/solution/', 'save', formAction, keyId, parentGridId, mainTable);
      },
      validateForm(refFormName) {
        var success = false;
        this.$refs[refFormName].validate(valid => {
          success = valid;
        });
        return success;
      },
      toPinYin(sourceField, targetField) {
        if (!this.data[targetField]) {
          const source = this.data[sourceField];
          this.data[targetField] = Object.toPinYin(source);
        }
      }
    }
  }
</script>