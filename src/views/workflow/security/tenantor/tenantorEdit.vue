<template>
  <div class="f2bpm-page-dialog-layout">
    <div>
      <el-form ref="formRef" :rules="formRules" size="small" :model="data" class="f2bpm-editform" label-width="120px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="租户名称" prop="tenantName">
              <el-input v-model="data.tenantName" placeholder="租户名称" @blur.native.capture="toSameName('tenantName','tenantAliasName')" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="租户别名" prop="tenantAliasName">
              <el-input v-model="data.tenantAliasName" placeholder="租户别名" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="租户号" prop="tenantCode">
              <el-input v-model="data.tenantCode" :disabled="disabled" placeholder="不能超过4个字母新增后不可修改" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="公司名称" prop="companyName">
              <el-input v-model="data.companyName" placeholder="" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="启用时间" prop="beginTime">
              <el-date-picker v-model="data.beginTime" size="mini" type="datetime" class="textBoxShort" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="截止时间" prop="endTime">
              <el-date-picker v-model="data.endTime" size="mini" type="datetime" class="textBoxShort" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" />
            </el-form-item>
          </el-col>
        </el-row>

        <!-- <el-form-item label="系统LOGO" prop="logoUrl">
          <f2bpmui-picture :field="logoUrlPhotoPathField" @updatevalue="updateFieldValue" :fieldvalue="data.logoUrl">
          </f2bpmui-picture>
        </el-form-item> -->
        <el-form-item label="是否启用" prop="isEnabled">
          <el-switch v-model="data.isEnabled" :inactive-value="0" :active-value="1" active-color="#13ce66" inactive-color="#DEDEDE" />
        </el-form-item>
        <!-- <el-form-item label="版权描述" prop="copyRight">
          <el-input v-model="data.copyRight" placeholder="版权信息描述"></el-input>
        </el-form-item> -->
        <el-form-item label="备注" prop="remarks">
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
        disabled: false,
        logoUrlPhotoPathField: { field: 'logoUrl', title: '上传LOGO图片', itemRender: { props: { limit: 1 } } },
        treeData: [],
        data: {
          sysName: '',
          sysAliasName: '',
          companyName: '',
          logoUrl: '',
          loginImageUrl: '',
          isEnabled: 1,
          copyRight: '',
          versionss: '',
          rootMenuCount: '',
          serviceHotline: '',
          isLoginVerifyCheckCode: '',
          isMobileLogin: '',
          webUrl: '',
          orderNo: 1,
          opts: '',
          remarks: '',
          beginTime: '',
          endTime: '',
          creatorId: '',
          createdTime: '',
          tenantName: '',
          tenantAliasName: '',
          tenantCode: ''
        },
        formRules: {
          sysName: [
            { required: true, message: '必填项不能为空' }
          ],
          sysAliasName: [
            { required: true, message: '必填项不能为空' }
          ],
          companyName: [
            { required: true, message: '必填项不能为空' }
          ],
          beginTime: [
            { required: true, message: '必填项不能为空' }
          ],
          endTime: [
            { required: true, message: '必填项不能为空' }
          ],
          tenantName: [
            { required: true, message: '必填项不能为空' }
          ],
          tenantAliasName: [
            { required: true, message: '必填项不能为空' }
          ],
          tenantCode: [
            { required: true, message: '必填项不能为空' },
            { validator: FUI.GetValidatorRule('englishchar3') }

          ]
        }
      };
    },
    created: function () {
      var that = this;
      that.formAction = formAction;
      if (formAction == FUI.FormAction.Add) {
        const currUser = that.$store.state.user.author;
        that.data.creatorId = currUser.userId;
        that.data.tenantId = currUser.tenantId;
        that.data.creatorRealName = decodeURI(currUser.realName);
        that.data.createdTime = Object.toGetCurrentDateTimeString();
        that.data.beginTime = Object.toGetCurrentDateTimeString();
        that.data.endTime = Object.toDateAddDays(Object.toGetCurrentDateTimeString(), 14) + " 00:00:00";
      } else {
        that.disabled = true;
      }
      that.loadData();
    },
    methods: {
      closeEdit() {
        FUI.Window.closeEdit();
      },
      loadData() {
        var that = this;
        if (formAction != FUI.FormAction.Add) {
          FUI.Form.bindDataToForm(that, FUI.Handlers.FuiFrameworkHandler, FUI.Method.AutoGetViewModelMethod, keyId, null, mainTable);
        }
      },
      submitForm() {
        var that = this;
        /*  if (that.formAction == 'Add' && that.data.tenantCode.length > 4) {
           FUI.Window.showMsg('租户ID长度不能超过4个字符');
           return false
         } */
        var success = that.validateForm('formRef');
        if (!success) return;
        if (formAction == FUI.FormAction.Add) {
          //that.data.tenantCode = that.data.tenantCode.toLowerCase();
        }
        FUI.Form.submitForm(that, that.data, '/workflow/security/tenantor/', 'save', formAction, keyId, parentGridId, mainTable);
      },
      validateForm(refFormName) {
        var success = false;
        this.$refs[refFormName].validate(valid => {
          success = valid;
        });
        return success;
      },
      toSameName(sourceField, targetField) {
        if (!this.data[targetField]) {
          const source = this.data[sourceField];
          this.data[targetField] = source;
        }
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