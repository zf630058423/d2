<template>
  <div class="f2bpm-page-dialog-layout">
    <div>
      <el-form ref="formRef" :rules="formRules" size="small" :model="data" class="f2bpm-editform" label-width="140px">
        <el-form-item label="方案标题" prop="genTitle">
          <el-input v-model="data.genTitle" placeholder="填写本配置方案的标题名称"></el-input>
        </el-form-item>
        <el-form-item label="生成类型" prop="genType">
          <el-select v-model="data.genType">
            <el-option label="请选择" value="" />
            <el-option label="常规标准" value="standard" />
            <el-option label="URL流程表单" value="urlform" />
          </el-select>
        </el-form-item>
        <el-form-item label="数据库表" prop="tableName">
          <el-input v-model="data.tableName" placeholder="请选择数据库表">
            <template slot="append"><i class="fa fa-search cur" @click="selectDbTable">选择</i>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="实体名" prop="modelName">
          <el-input v-model="data.modelName" style="width: 580px;" placeholder="按“删除前缀级数”去掉“_”下划线前面的字符串，使用pascal命名规则，请点击“自动填写” "></el-input>
          <span class="font12 ml5 mr2">删除前缀级数</span>
          <el-input-number v-model="removeLevel" size="mini" :min="0" :max="3" label="前缀级数" /> <span class="font12 fa fa-cog cur" @click="toPascal('tableName','modelName')">点击自动填写</span>

        </el-form-item>
        <el-form-item label="Model命名空间" prop="modelPackage">
          <el-input v-model="data.modelPackage" placeholder="实体类的命名空间，例如：package com.f2bpm.system.frame.impl.model"></el-input>
        </el-form-item>
        <el-form-item label="IService命名空间" prop="iservicePackage">
          <el-input v-model="data.iservicePackage" placeholder="服务层的类的接口命名空间，例如：package com.f2bpm.system.frame.impl.iservices"></el-input>
        </el-form-item>
        <el-form-item label="Service命名空间" prop="servicePackage">
          <el-input v-model="data.servicePackage" placeholder="服务层类的命名空间，例如：package com.f2bpm.system.frame.impl.services"></el-input>
        </el-form-item>
        <el-form-item label="Controller命名空间" prop="controllerPackage">
          <el-input v-model="data.controllerPackage" placeholder="Controller类的命名空间,例如：package com.f2bpm.controller.admin"></el-input>
        </el-form-item>
        <el-form-item label="View目录地址" prop="viewFolder">
          <el-input v-model="data.viewFolder" placeholder="view目录地址，例如：/admin/codeGenerator/"></el-input>
        </el-form-item>
        <el-form-item label="代码作者" prop="author">
          <el-input v-model="data.author" placeholder="在Java代码头部的作者声明"></el-input>
        </el-form-item>
        <el-form-item label="代码版权信息" prop="copyright">
          <el-input v-model="data.copyright" placeholder="在Java代码头部的版权信息"></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="descriptions">
          <el-input v-model="data.descriptions" type="textarea" :rows="4" placeholder="" />
        </el-form-item>
        <div class="dialogfooter">
          <el-button size="small" type="primary" v-if="formAction!='View'" @click="submitForm()"><i class="fa fa-save"></i>保存
          </el-button>
          <el-button size="small" id="btn_cancel" @click="closeEdit"><i class="fa fa-minus-circle"></i>取消
          </el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>

  export default {
    created: function () {
      var that = this;
      that.formAction = formAction;
      if (formAction == FUI.FormAction.Add) {
        let currUser = that.$store.state.user.author;
        that.data.creatorId = currUser.userId;
        that.data.tenantId = currUser.tenantId;
        that.data.creatorRealName = decodeURI(currUser.realName);
        that.data.createdTime = Object.toGetCurrentDateTimeString();
      }
      that.loadData();
    },
    data() {
      return {
        formAction: null,
        removeLevel: 2,
        treeData: []
        , data: {
          genTitle: '',
          genType: "standard",
          categoryCode: '',
          iservicePackage: '',
          servicePackage: '',
          modelPackage: '',
          controllerPackage: '',
          moduleName: '',
          subModuleName: '',
          viewFolder: '',
          descriptions: '',
          tableName: '',
          modelName: '',
          author: '',
          copyright: '',
          creatorRealName: '',
          creatorId: '',
          createdTime: '',

        }
        , formRules: {
          genTitle: [
            { required: true, message: '必填项不能为空' }
          ],
          genType: [
            { required: true, message: '必填项不能为空' }
          ],
          iservicePackage: [
            { required: true, message: '必填项不能为空' }
          ],
          servicePackage: [
            { required: true, message: '必填项不能为空' }
          ],
          modelPackage: [
            { required: true, message: '必填项不能为空' }
          ],
          controllerPackage: [
            { required: true, message: '必填项不能为空' }
          ],
          viewFolder: [
            { required: true, message: '必填项不能为空' }
          ],
          tableName: [
            { required: true, message: '必填项不能为空' }
          ],
          modelName: [
            { required: true, message: '必填项不能为空' }
          ]
        }
      };
    },
    methods: {
      closeEdit() {
        FUI.Window.closeEdit();
      }
      , loadData() {
        var that = this;
        if (formAction != FUI.FormAction.Add) {
          FUI.Form.bindDataToForm(that, FUI.Handlers.FuiFrameworkHandler, FUI.Method.AutoGetViewModelMethod, keyId, null, mainTable);
        }
      }
      , submitForm() {
        var that = this;
        var success = that.validateForm('formRef');
        if (!success) return;
        FUI.Form.submitForm(that, that.data, FUI.Handlers.FuiFrameworkHandler, FUI.Method.AutoSaveMethod, formAction, keyId, parentGridId, mainTable);
      },
      codeGenfieldList() {
        var that = this;
      },
      selectDbTable(value) {
        WF.SelectorDialog.selectDbTable(this, 'tableName', null, 'table', true);
      }
      , validateForm(refFormName) {
        var success = false;
        this.$refs[refFormName].validate(valid => {
          success = valid;
        });
        return success;
      }
      , toPascal(sourceField, targetField) {
        var that = this;
        let source = this.data[sourceField];
        this.data[targetField] = Object.toPascal(source, that.removeLevel);
      }
      , toPinYin(sourceField, targetField) {
        if (!this.data[targetField]) {
          let source = this.data[sourceField];
          this.data[targetField] = Object.toPinYin(source);
        }
      }
    }
  }
</script>