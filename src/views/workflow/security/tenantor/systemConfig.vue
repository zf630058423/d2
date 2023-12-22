<template>
  <div id="systemConfig" class="f2bpm-page-dialog-layout">
    <div>
      <el-form ref="formRef" :rules="formRules" size="small" :model="data" class="f2bpm-editform" label-width="120px">
        <el-row>
          <el-col :span="8">
            <el-form-item label="系统名称" prop="sysName">
              <el-input v-model="data.sysName" placeholder="系统名称标准名称" @blur.native.capture="toSameName('sysName','sysAliasName')" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="系统简称" prop="sysAliasName">
              <el-input v-model="data.sysAliasName" placeholder="系统简称,字数过长将无法显示" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="公司名称" prop="companyName">
              <el-input v-model="data.companyName" placeholder="" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="8">
            <el-form-item label="是否启用" prop="isEnabled">
              <el-switch v-model="data.isEnabled" :inactive-value="false" :active-value="true" active-color="#13ce66" inactive-color="#DEDEDE" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="启用时间" prop="beginTime">
              <el-date-picker v-model="data.beginTime" size="mini" type="datetime" class="textBoxShort" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="截止时间" prop="endTime">
              <el-date-picker v-model="data.endTime" size="mini" type="datetime" class="textBoxShort" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="系统LOGO" prop="logoUrl">
              <f2bpmui-picture :field="logoUrlPhotoPathField" :fieldvalue="data.logoUrl" @updatevalue="updateFieldValue" />
              <div>
                请上传正方形的透明".png"图片
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="LOGO宽度" prop="logoWidth">
              <el-input-number v-model="data.logoWidth" size="small" :min="20" :max="200" />(单位：px)
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item label="属性设置">
              <span class="fa fa-cogs cur" @click="setFieldOptions()" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="登录验证码">
              <el-switch v-model="data.isLoginVerifyCheckCode"  active-color="#13ce66" inactive-color="#DEDEDE" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="启用登录错误锁定">
              <el-switch v-model="data.isEnabledLoginErrorLock"  active-color="#13ce66" inactive-color="#DEDEDE" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="登录错误次数阀值">
              <el-input-number v-model="data.loginErrLimit" size="small" :min="1" :max="50"   />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="版权描述" prop="copyRight">
          <el-input v-model="data.copyRight" type="textarea" :rows="2" placeholder="版权信息描述" />
        </el-form-item>
        <el-form-item label="本站地址" prop="webUrl">
          <el-input v-model="data.webUrl" placeholder="本站地址" />
        </el-form-item>
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
        logoUrlPhotoPathField: { fieldName: 'logoUrl', fieldTitle: '上传LOGO图片', itemRender: { props: { accept: '.png', limit: 1, parms: { pathType: 'logo' } } } },
        treeData: [],
        data: {
          id: '',
          sysName: '',
          sysAliasName: '',
          companyName: '',
          logoUrl: '',
          logoWidth: 40,
          loginImageUrl: '',
          isEnabled: '',
          copyRight: '',
          versions: '',
          rootMenuCount: '',
          serviceHotline: '',
          isLoginVerifyCheckCode: false,
          isEnabledLoginErrorLock:false,
          loginErrLimit:0,
          isMobileLogin: '',
          webUrl: '',
          orderNo: 100,
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
            { validator: FUI.Validator.englisthOrNumberChar }
          ]
        }
      };
    },
    mounted() {
      $('.f2bpm-page-dialog-layout').height($(window).height() - 50);
      window.myvm = this;
    },
    created: function () {
      mainTable = 'f2bpm_sys_tenantor';
      formAction = 'Edit';
      keyId = 'System';
      var that = this;
      that.formAction = formAction;
      if (formAction == FUI.FormAction.Add) {
        const currUser = that.$store.state.user.author;
        that.data.creatorId = currUser.userId;
        that.data.tenantId = currUser.tenantId;
        that.data.creatorRealName = decodeURI(currUser.realName);
        that.data.createdTime = Object.toGetCurrentDateTimeString();
        that.data.beginTime = Object.toGetCurrentDateTimeString();
        that.data.endTime = '9999-12-31 23:59:59';
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
          FUI.Form.bindDataToForm(that, '/workflow/security/tenantor/', 'getModelByTenantCode', keyId, null, mainTable);
        }
      },
      submitForm() {
        var that = this;
        var success = that.validateForm('formRef');
        if (!success) return;
        FUI.Form.submitForm(that, that.data, '/workflow/security/tenantor/', 'save', formAction, that.data.id, '', mainTable);
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
      setFieldOptions() {
        var that = this;
        var fieldTitle = that.data.fieldTitle;
        FUI.Window.openEdit('/workflow/security/tenantor/optionsEdit/', '属性设置', 'Edit', '', 700, 480, null, null, keyId);
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
  };
  window.getOptions = function () {
    return myvm.data.opts;
  };
  window.saveOptions = function (v) {
    console.info(v);
    return myvm.data.opts = v;
  }
</script>