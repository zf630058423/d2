<template>
  <div class="f2bpm-page-dialog-layout">
    <el-form ref="formRef" :rules="formRules" :model="data" size="small" class="f2bpm-editform" label-width="120px">
      <el-form-item label="上级分类" prop="ParentId">
        <treeselect v-model="data.ParentId" :default-expand-level="3" :multiple="false" placeholder="请选择分类" :options="treeData" />
      </el-form-item>
      <el-form-item label="分类名称" prop="CategoryName">
        <el-input v-model="data.CategoryName" placeholder="" @blur.native.capture="toPinYin('CategoryName','CategoryCode')" />
      </el-form-item>
      <el-form-item label="分类编码" prop="CategoryCode">
        <el-input v-model="data.CategoryCode" :disabled="formAction=='Edit'" placeholder="" />
      </el-form-item>
      <el-form-item label="排序" prop="OrderNo">
        <el-input-number v-model="data.OrderNo" :min="1" :max="1000000" label="排序" />
      </el-form-item>
      <el-form-item label="备注">
        <el-input v-model="data.Remark" type="textarea" :rows="4" placeholder="备注" />
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
        groupKey: '',
        formAction: null,
        treeData: [],
        data: {
          ParentId: null,
          CategoryName: '',
          CategoryCode: '',
          OrderNo: 1000,
          Remark: '',
          GroupKey: '',

          CreatedTime: '',
          LastUpdateTime: '',
          CreatorId: '',
          CreatorRealName: '',
          TenantId: ''
        },
        // stand:表单校验规则
        formRules: {
          ParentId: [
            { required: true, message: '请选择分类', trigger: 'blur' }
          ],
          CategoryName: [
            { required: true, message: '必填项不能为空', trigger: 'blur' }
          ],
          CategoryCode: [
            { required: true, message: '必填项不能为空', trigger: 'blur' }
          ]
        }
      };
    },
    created: function () {
      var that = this;
      var groupKey = Object.toQueryString('groupKey');
      var parentId = Object.toQueryString('parentId') || null;
      that.groupKey = groupKey;
      that.formAction = formAction;
      if (formAction == FUI.FormAction.Add) {
        that.data.GroupKey = groupKey;
        that.data.ParentId = parentId;
        const currUser = FUI.Sys.getAuthor();
        that.data.CreatorId = currUser.userId;
        that.data.CreatorRealName = decodeURI(currUser.realName);
        that.data.CreatedTime = Object.toGetCurrentDateTimeString();
        that.data.LastUpdateTime = Object.toGetCurrentDateTimeString();
        that.data.TenantId = currUser.tenantId;
      } else {
        that.data.LastUpdateTime = Object.toGetCurrentDateTimeString();
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
      // ===stand:标准化方法结束============
      loadData() {
        var that = this;
        if (formAction != FUI.FormAction.Add) {
          FUI.Form.bindDataToForm(that, FUI.Handlers.FuiFrameworkHandler, FUI.Method.AutoGetViewModelMethod, keyId, null, mainTable);
        }
      },
      loadTreeSelect() {
        var that = this;
        var treeUrl = FUI.Handlers.CategoryHandler + '?groupKey=' + that.groupKey + '&needRoot=true';
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
        var success = that.validateForm('formRef');
        if (!success) return;
        FUI.Form.submitForm(that, that.data, '/workflow/security/category/', 'save', formAction, keyId, parentGridId, mainTable);
      },
      validateForm(refFormName) {
        // stand:表单校验
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
      },
      onOnlineFormSelect() {
        WF.SelectorDialog.onlineFormDefSelectorDialog(this, 'formDefId', 'refFormDefName');
      }
    }
  }
</script>