<template>
  <div class="f2bpm-page-dialog-layout">
    <el-form ref="formRef" :rules="formRules" size="small" :model="data" class="f2bpm-editform" label-width="120px">
      <el-form-item label="标题" prop="simulationTitle">
        <el-input v-model="data.simulationTitle" />
      </el-form-item>
      <el-form-item label="仿真发起人" prop="startorRealname">
        <el-input v-model="data.startorRealname" readonly="readonly" placeholder="请选择仿真发起人，如果为空则为当前登录人" class="textAutoBoxLong75" />
        <i class="fa fa-search cur" @click="selectorUserString('startorUser','startorRealname',null,true, 'userId')">选择</i>
        <a href="javascript:void(0)" class="red" @click="clearSelectedUsers('startorUser','startorRealname')"><i class="fa fa-minus-circle" />清除</a>
      </el-form-item>
      <el-form-item label="变量设置">
        <a class="btn btn-sm btn-white btn-info btn-bold" @click="keyValueEditor('vars','kv', '流程仿真变量设置' )"> <i class="ace-icon fa fa-pencil  bigger-120  " />设置仿真变量</a>
      </el-form-item>
      <el-form-item label="表单字段值">
        <a class="btn btn-sm btn-white btn-info btn-bold" @click="keyValueFormFieldEditor('formFieldParms','kv', '流程仿真表单字段')"> <i class="ace-icon fa fa-pencil  bigger-120  " />设置仿真变量</a>
      </el-form-item>
      <el-form-item label="当前使用">
        <el-switch v-model="data.isMaster" active-color="#87DC48" inactive-value="0" :active-value="1" inactive-color="#DEDEDE" />
        <span class="font10">
          （仅能有一个为当前使用的状态）
        </span>
      </el-form-item>
      <el-form-item label="是否启用">
        <el-switch v-model="data.isEnable" active-color="#87DC48" inactive-value="0" :active-value="1" inactive-color="#DEDEDE" />
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="data.remark" type="textarea" :rows="4" />
      </el-form-item>
      <div class="dialogfooter">
        <el-button v-if="formAction!='View'" size="small" type="primary" @click="submitForm()"><i class="fa fa-save" />保存
        </el-button>
        <el-button id="btn_cancel" size="small" @click="closeEdit"><i class="fa fa-minus-circle" />取消</el-button>
      </div>
    </el-form>
  </div>
</template>

<script>

  export default {
    data() {
      return {
        formAction: null,
        isOnlyMySelf: 1,
        treeData: [],
        data: {
          startorRealname: '',
          startorUser: '',
          vars: '',
          formFieldParms: '',
          isMaster: 1,
          isEnable: 1,
          remark: '',
          appId: '',
          tenantId: '',
          createdTime: ''
        },
        formRules: {
          simulationTitle: [
            { required: true, message: '必填项不能为空' }
          ]
        }
      };
    },
    created: function () {
      var that = this;
      var appId = Object.toQueryString('appId');
      var wid = Object.toQueryString('wid');
      that.data.appId = appId;
      that.wid = wid;
      that.formAction = formAction;
      if (formAction == FUI.FormAction.Add) {
        const currUser = FUI.Sys.getAuthor();
        that.data.createdTime = Object.toGetCurrentDateTimeString();
        that.data.tenantId = currUser.tenantId;
      }
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
      submitForm() {
        var that = this;
        var success = that.validateForm('formRef');
        if (!success) return;
        FUI.Form.submitForm(that, that.data, "/workflow/simulationParams/", "saveModel", formAction, keyId, parentGridId, mainTable);
      },
      validateForm(refFormName) {
        // stand:表单校验
        var success = false;
        this.$refs[refFormName].validate(valid => {
          success = valid;
        });
        return success;
      },
      selectorUserString(inputKey, inputName, passParm, singleSelect, keyName) {
        var that = this;
        WF.SelectorDialog.selectorUserString(that, inputKey, inputName, passParm, singleSelect, keyName);
      },
      clearSelectedUsers(inputId, inputName) {
        var that = this;
        that.data[inputId] = '';
        that.data[inputName] = '';
      },
      keyValueEditor(inputId, type, title, formDefId) {
        WF.SelectorDialog.keyValueEditor(this, inputId, type, title);
      },
      keyValueFormFieldEditor(inputId, type, title) {
        var that = this;
        var wid = that.wid;
        WF.SelectorDialog.keyValueEditor(this, inputId, type, title, null, true, "", wid);
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