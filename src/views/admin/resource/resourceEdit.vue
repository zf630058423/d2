<template>
  <div class="f2bpm-page-dialog-layout">
    <el-form ref="formRef" size="small" :rules="formRules" :model="data" class="f2bpm-editform" label-width="120px">
      <el-row>
        <el-col :span="12">
          <el-form-item label="菜单名称" prop="Name">
            <el-input v-model="data.Name" placeholder="组织名称" @blur.native.capture="toPinYin('Name','ResourceId')" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="菜单编码" prop="ResourceId">
            <el-input v-model="data.ResourceId" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item label="国际化" prop="Alias">
            <el-input v-model="data.Alias" placeholder="国际化菜单名称如英文" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="上级菜单" prop="ParentId">
            <treeselect v-model="data.ParentId" :default-expand-level="3" :multiple="false" placeholder="请选择上级菜单" :options="treeData" />
          </el-form-item>

        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="排序号" prop="OrderNum">
            <el-input-number v-model="data.OrderNum" size="small" :min="1" :max="100000" label="排序号" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="图标" prop="MenuImg">
            <el-input v-model="data.MenuImg" style="width: 50%;" />
            <span class="cur" @click="selectAweIcon('MenuImg')"><i class="fa fa-search font10 ml4" /></span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="菜单类别" prop="Type">
            <f2bpmui-select field="Type" configtype="菜单类别" :fieldvalue="data.Type" @updatevalue="updateFieldValue" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="信息类别" prop="InfoType">
            <f2bpmui-select field="InfoType" configtype="菜单信息类别" :fieldvalue="data.InfoType" @updatevalue="updateFieldValue" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="是否启用" prop="Enabled">
            <el-switch v-model="data.Enabled" :inactive-value="0" :active-value="1" active-color="#13ce66" inactive-color="#DEDEDE" />
          </el-form-item>

        </el-col>
        <el-col :span="12">
          <el-form-item label="窗口目标" prop="Target">
            <f2bpmui-select field="Target" configtype="窗口目标" :fieldvalue="data.Target" @updatevalue="updateFieldValue" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item v-if="currentTenantId=='BPM'&&isMultiTenant" label="租户复制">
        <el-switch v-model="data.IsTenantMust" :inactive-value="0" :active-value="1" active-color="#13ce66" inactive-color="#DEDEDE" /><span class="fa fa-question-circle ml10" title="仅由由BPM租户配置,创建租户时同时将此菜单复制给租户" />
      </el-form-item>
      <el-form-item label="业务编码" prop="BusinessCode">
        <el-input v-model="data.BusinessCode" placeholder="适用于填写自定义列表的编码" />
      </el-form-item>
      <el-form-item label="导航地址" prop="FunctionUrl">
        <el-input v-model="data.FunctionUrl" />
      </el-form-item>
      <el-form-item label="备注" prop="Comment">
        <el-input v-model="data.Comment" type="textarea" :rows="2" placeholder="备注" />
      </el-form-item>

      <div class="dialogfooter2">
        <el-button v-if="formAction!='View'" size="small" type="primary" @click="submitForm()"><i class="fa fa-save" />保存
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
        isMultiTenant: false,
        currentTenantId: '',
        formAction: null,
        treeData: [],
        data: {
          Name: '',
          ResourceId: '',
          Alias: '',
          ParentId: '',
          OrderNum: 9999,
          MenuImg: 'fa-file-text-o',
          Type: '',
          InfoType: '',
          MultiInfo: '',
          StopN: '',
          Enabled: 1,
          Controller: '',
          FunctionUrl: '',
          Comment: '',
          TenantId: '',
          IsTenantMust: 0,
          CreatorId: '',
          CreatorRealName: '',
          CreatorOrgId: '',
          CreatedTime: '',
          Visible: 1,
          BusinessCode:""
        },
        // stand:表单校验规则
        formRules: {
          Name: [
            { required: true, message: '必填项不能为空' }
          ],
          ResourceId: [
            { required: true, message: '必填项不能为空' }
          ],
          OrderNum: [
            { required: true, message: '必填项不能为空' }
          ],
          Type: [
            { required: true, message: '必填项不能为空' }
          ]
        }
      };
    },
    created: function () {
      var that = this;
      that.loadTreeSelect();
      that.formAction = formAction;
      const currUser = FUI.Sys.getAuthor();
      that.currentTenantId = currUser.tenantId;
      if (formAction == FUI.FormAction.Add) {
        var parentId = Object.toQueryString('parentId') || null;
        that.data.ParentId = parentId;
        that.data.CreatorId = currUser.userId;
        that.data.TenantId = currUser.tenantId;
        that.data.OrderNum = 20;
        that.data.CreatorRealName = decodeURI(currUser.realName);
        that.data.CreatedTime = Object.toGetCurrentDateTimeString();
        that.data.Type = 'menu';
        that.data.MultiInfo = 2;
        that.data.InfoType = 'Navigation';
        that.data.Target = '_default';
      }
      that.isMultiTenant = currUser.isMultiTenant;
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
        var treeUrl = FUI.Handlers.AdminHandler + 'resource/resourceTreeJson/?needRoot=true';
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
        that.Alias = that.data.Name;
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
      selectAweIcon(inputKey) {
        var that = this;
        WF.SelectorDialog.selectAweIcon(that, inputKey);
      },
      clearSelectedUsers(inputId, inputName) {
        var that = this;
        that.data[inputId] = '';
        that.data[inputName] = '';
      },
      updateFieldValue(fieldName, newVal) {
        var that = this;
        that.data[fieldName] = newVal;
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