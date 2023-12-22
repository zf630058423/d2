<template>
  <div class="f2bpm-page-dialog-layout">
    <el-form ref="formRef" size="small" :rules="formRules" :model="data" class="f2bpm-editform" label-width="120px">
      <el-form-item label="字段分类" prop="CategoryCode">
        <treeselect v-model="data.CategoryCode" size="mini" :default-expand-level="3" :multiple="false" placeholder="请选择分类" :options="treeData" />
      </el-form-item>
      <el-form-item label="字段标题" prop="FieldTitle">
        <el-input v-model="data.FieldTitle" placeholder="" @blur.native.capture="toPinYin('FieldTitle','FieldName')" />
      </el-form-item>

      <el-form-item label="字段名称" prop="FieldName">
        <el-input v-model="data.FieldName" placeholder="不能超过30个字符" />
      </el-form-item>

      <el-form-item label="数据类型" prop="DataType">
        <el-select v-model="data.DataType" placeholder="请选择">
          <el-option v-for="item in dataTypeOptions" :key="item.value" :label="item.text" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="是否启用" prop="IsEnable">
        <el-switch v-model="data.IsEnable" active-color="#87DC48" inactive-color="#DEDEDE" :active-value="1" :inactive-value="0" />
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
        dataTypeOptions: [],
        treeData: [],
        data: {
          CategoryCode: null,
          TenantId: '',
          CreatedTime: '',
          LastModifyTime: '',
          IsEnable: 1,
          DataType: 'string',
          FieldTitle: '',
          FieldName: ''
        },
        // stand:表单校验规则
        formRules: {
          CategoryCode: [
            { required: true, message: '必填项不能为空' }
          ],
          FieldTitle: [
            { required: true, message: '必填项不能为空' },
            { validator: FUI.GetValidatorRule('len[2,200]') }
          ],
          FieldName: [
            { required: true, message: '必填项不能为空' },
            { validator: FUI.GetValidatorRule('englishchar') },
            { validator: FUI.GetValidatorRule('len[2,32]') }
          ],
          IsEnable: [
            { required: true, message: '必填项不能为空' }
          ]
        }
      };
    },
    created: function () {
      var that = this;
      that.formAction = formAction;
      that.dataTypeOptions = FUI.Data.baseDataTypeDic;
      if (formAction == FUI.FormAction.Add) {
        var categoryCode = Object.toQueryString('categoryCode') || '';
        const currUser = FUI.Sys.getAuthor();
        that.data.CreatorId = currUser.userId;
        that.data.CreatedTime = Object.toGetCurrentDateTimeString();
        that.data.LastModifyTime = Object.toGetCurrentDateTimeString();
        that.data.TenantId = currUser.tenantId;
        if (categoryCode) {
          that.data.CategoryCode = categoryCode;
        }
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
      loadTreeSelect() {
        var that = this;
        var treeUrl = FUI.Handlers.CategoryHandler + '?groupKey=GeneralFieldGroup&needRoot=true';
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
          this.data[targetField] = Object.toPinYin(source, true);
        }
      }
    }
  }
</script>