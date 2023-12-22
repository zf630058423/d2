<template>
  <div class="f2bpm-page-dialog-layout">
    <div>
      <el-form ref="formRef" size="small" :rules="formRules" :model="data" class="f2bpm-editform" label-width="120px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="配置类别" prop="ConfigType">
              <el-input v-model="data.ConfigType" :disabled="disabledConfigType" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="排序" prop="OrderNo">
              <el-input-number v-model="data.OrderNo" :min="1" :max="1000" label="排序" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="配置名称" prop="ConfigName">
              <el-input v-model="data.ConfigName" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="标识">
              <el-input v-model="data.Flag" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="配置值" prop="ConfigValue">
          <el-input v-model="data.ConfigValue" placeholder="建议多使用有意义的英文或通用的中文代名词" />
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="上级配置值" prop="ParentConfigKey">
              <el-input v-model="data.ParentConfigKey" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="配置项编码" prop="ConfigKey">
              <el-input v-model="data.ConfigKey" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="备注">
          <el-input v-model="data.Remark" type="textarea" :rows="4" placeholder="备注" />
        </el-form-item>
        <el-form-item label="租户ID" prop="TenantId">
          <!-- <el-input v-model="data.TenantId" /> -->
          {{data.TenantId}}
        </el-form-item>
        <el-form-item label="启用状态" prop="IsEnable">
          <el-select v-model="data.IsEnable" placeholder="请选择">
            <el-option
              v-for="item in [0,1]"
              :key="item.value"
              :label="item | userStateType"
              :value="item">
            </el-option>
          </el-select>
        </el-form-item>
        <div class="dialogfooter2">
          <el-button v-if="add_save" size="small" type="primary" @click="submitForm('save')"><i class="fa fa-save" />保存
          </el-button>
          <el-button v-if="add_btn" size="small" type="primary" @click="submitForm('saveAndNew')"><i class="fa fa-save" />新增
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
        disabledConfigType: true,
        formAction: null,
        add_btn: false,
        add_save: false,
        treeData: [],
        data: {
          ConfigType: '',
          Flag: '',
          OrderNum: 1,
          TenantId: '',
          OpinionType: '',
          CreatorId: '',
          CreatorRealName: '',
          CreatorOrgId: '',
          CreatedTime: '',
          OrderNo: 1,
          IsEnable: 1
        },
        // stand:表单校验规则
        formRules: {
          ConfigValue: [
            { required: true, message: '必填项不能为空' }
          ],
          TenantId: [
            { required: true, message: '必填项不能为空' }
          ],
          ConfigType: [
            { required: true, message: '必填项不能为空' }
          ],
          ConfigName: [
            { required: true, message: '必填项不能为空' }
          ]
        }
      };
    },
    created: function () {
      var that = this;
      var configType = Object.toQueryString('configType') || '';
      var orderNo = Object.toQueryString('orderNo') || '';
      var tenantId = Object.toQueryString('tenantId') || '';
      if (orderNo) {
        that.data.OrderNo = parseInt(orderNo) + 1;
      }
      that.formAction = formAction;
      if (formAction == FUI.FormAction.Add) {
        that.data.ConfigType = configType;
        if (configType == "") {
          that.disabledConfigType = false;
        }
        const currUser = FUI.Sys.getAuthor();
        that.data.Creator = decodeURI(currUser.realName);
        that.data.CreatedTime = Object.toGetCurrentDateTimeString();
        that.data.TenantId = tenantId || currUser.tenantId;
        that.add_btn = true;
        that.add_save = false;
      } else {
        that.add_save = true;
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
      submitForm(btnType) {
        var that = this;
        var success = that.validateForm('formRef');
        if (!success) return;
        FUI.Form.submitForm(that, that.data, FUI.Handlers.FuiFrameworkHandler, FUI.Method.AutoSaveMethod, formAction, keyId, parentGridId, mainTable, null, null, null, function (obj) {
          if (obj.success) {
            FUI.Window.showMsg2(that, obj.msg, null, 1, function () {
              FUI.Data.getConfigTypeData(true);
              if (btnType == 'save') {
                FUI.Window.closeEdit(true, parentGridId);
              } else {
                FUI.Window.refreshParentGrid();
                // 继续新增
                var url = __webpath + '/workflow/security/systemss/dataDictEdit/?parentGridId=grid&formAction=Add&mainTable=f2bpm_sys_DataDict&configType=' + that.data.ConfigType + '&orderNo=' + that.data.OrderNo + '&&tenantId=' + that.data.TenantId;
                window.location = url;
                //无#window.location.reload()
              }
            });
          } else {
            FUI.Window.showMsg(that, obj.msg);
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
      }

    }
  }
</script>
