<template>
  <div class="f2bpm-page-dialog-layout">
    <div>
      <el-form ref="formRef" :rules="formRules" size="small" :model="data" class="f2bpm-editform" label-width="120px">
        <el-form-item label="转表类型" prop="levelType">
          <el-select v-model="data.levelType">
            <el-option label="请选择" value="" />
            <el-option label="主表" value="main" />
            <el-option label="子表" value="sub" />
          </el-select>
        </el-form-item>
        <el-form-item label="从此表单" prop="fromFormTitle">
          <el-input v-model="data.fromFormTitle" placeholder="请选择“来源表单”">
            <template slot="append"><i class="fa fa-search cur" @click="selectActForm('fromFormDefId','fromFormTitle')">选择</i></template>
          </el-input>
        </el-form-item>
        <el-form-item label="从此数据表名" prop="fromTableTitle">
          <el-input v-model="data.fromTableTitle" placeholder="请选择“目标数据表”">
            <template slot="append"><i class="fa fa-search cur" @click="selectFormDbTable('fromFormDefId','fromTableId','fromTableTitle')">选择</i></template>
          </el-input>
        </el-form-item>
        <el-form-item label="到表单" prop="toFormTitle">
          <el-input v-model="data.toFormTitle" placeholder="请选择“目标表单”">
            <template slot="append"><i class="fa fa-search cur" @click="selectActForm('toFormDefId','toFormTitle')">选择</i></template>
          </el-input>
        </el-form-item>
        <el-form-item label="到数据表" prop="toTableTitle">
          <el-input v-model="data.toTableTitle" placeholder="请选择“目标数据表”">
            <template slot="append"><i class="fa fa-search cur" @click="selectFormDbTable('toFormDefId','toTableId','toTableTitle')">选择</i></template>
          </el-input>
        </el-form-item>

        <div v-if="data.levelType=='sub'">
          <el-form-item label="Sql子表过滤条件" prop="transferCondition">
            <el-input v-model="data.transferCondition" type="textarea" :rows="4" placeholder="编写Sql子表过滤条件" />
          </el-form-item>

          <el-form-item label="子表过滤条件配置">
            <a class="btn btn-sm btn-white btn-info btn-bold" @click="dbfieldWhereSelect()"> <i class="ace-icon fa fa-pencil  bigger-120  " /> 编辑过滤条件</a>
          </el-form-item>

          <el-form-item label="扩展后台过滤条件" prop="defaultWhereAssembly">
            <el-input v-model="data.defaultWhereAssembly" placeholder="由扩展插件Java类返回过滤条件的sql,填写含类包路径全名称;示例参考：DemoDefaultWhereAssembly.java" />
          </el-form-item>

          <el-form-item label="是否加入过滤条件" prop="defaultWhereIsJoinAssembly">
            <el-input v-model="data.defaultWhereIsJoinAssembly" placeholder="由扩展插件Java类判断是否加入过滤条件,填写含类包路径全名称。不填写时默认为是;示例参考DemoDefaultWhereIsJoinAssembly.java" />
          </el-form-item>
        </div>


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
          appId: '',
          levelType: '',
          toFormDefId: '',
          toFormTitle: '',
          toTableTitle: '',
          toTableId: '',
          toFormDefId: '',
          fromFormTitle: '',
          fromFormDefId: '',
          fromTableTitle: '',
          fromFormDefId: '',
          fromTableId: '',
          transferCondition: '',
          defaultWhereOption: '',
          // 后台未实现
          defaultWhereAssembly: '',
          defaultWhereIsJoinAssembly: '',
          tenantId: '',
          createdTime: ''
        },
        formRules: {
          levelType: [
            { required: true, message: '必填项不能为空' }
          ],
          toFormTitle: [
            { required: true, message: '必填项不能为空' }
          ]
        }
      };
    },
    created: function () {
      var that = this;
      var appId = Object.toQueryString('appId');
      that.formAction = formAction;
      if (formAction == FUI.FormAction.Add) {
        that.data.appId = appId;
        const currUser = that.$store.state.user.author;
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
        // 检查是否同一表单
        if (that.data.toFormTitle == that.data.fromFormTitle) {
          FUI.Window.showMsg('目标表单与来源表单不能相同');
          return false;
        }
        if (that.data.fromTableId=="") {
          FUI.Window.showMsg('请选择来源数据库表');
          return false;
        }
        if (that.data.toTableId=="") {
          FUI.Window.showMsg('请选择目标数据库表');
          return false;
        }
        FUI.Form.submitForm(that, that.data, FUI.Handlers.FuiFrameworkHandler, FUI.Method.AutoSaveMethod, formAction, keyId, parentGridId, mainTable, null, null, null, function (data) {
          if (data.success) {
            FUI.Window.showMsg(data.msg, null, 1, function () {
              if (formAction != FUI.FormAction.Add) {
                var url = '/workflow/smartForm/formDataTransfer/formDataTransferItemList/?transferId=' + keyId + '&parentGridId=grid&formAction=Eidt&keyId=' + keyId + '&mainTable=f2bpm_form_data_transfer';
                window.location.href = __webpath + url;
              } else {
                FUI.Window.refreshParentGrid();
                FUI.Window.closeEdit();
              }
            });
          } else {
            FUI.Window.showMsg(data.msg);
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
      selectorUserString(inputKey, inputName, passParm, singleSelect, keyName) {
        var that = this;
        WF.SelectorDialog.selectorUserString(that, inputKey, inputName, passParm, singleSelect, keyName);
      },
      selectorUserTextValue(inputKey, inputName, passParm, singleSelect, keyName) {
        var that = this;
        WF.SelectorDialog.selectorUserTextValue(that, inputKey, inputName, passParm, singleSelect, keyName);
      },
      clearSelectedUsers(inputId, inputName) {
        var that = this;
        that.data[inputId] = '';
        that.data[inputName] = '';
      },
      toPinYin(sourceField, targetField) {
        if (!this.data[targetField]) {
          const source = this.data[sourceField];
          this.data[targetField] = Object.toPinYin(source);
        }
      },
      levelTypeChange(thisObj) {
        var that = this;
        that.data.toTableTitle = '';
        that.data.toTableId = '';
        that.data.fromTableTitle = '';
        that.data.fromTableId = '';
      },
      dbfieldWhereSelect() {
        var that = this;
        var formKey = '';
        if (that.data.fromTableId == '') {
          FUI.Window.showMsg('请选择来源表');
        }
        var tableId = that.data.fromTableId;
        WF.SelectorDialog.dbfieldWhereSelect(that, 'defaultWhereOption', '', '', tableId);
      },
      selectActForm(idInput, nameInput) {
        var that = this;
        var appId = that.data.appId;
        WF.SelectorDialog.selectWorkflowActForm(that, appId, '', idInput, nameInput);
      },
      selectFormDbTable(formDefIdInput, idInput, nameInput) {
        var that = this;
        var formDefId = that.data[formDefIdInput];
        var level = that.data.levelType;
        if (!level) {
          FUI.Window.showMsg('请先选择转表类型');
          return false;
        }
        if (!formDefId) {
          FUI.Window.showMsg('请先选择表单');
          return false;
        }

        WF.SelectorDialog.formTableSelect(that, formDefId, false, level, idInput, nameInput);
      }
    }
  }
</script>