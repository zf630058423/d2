<template>
  <div class="f2bpm-page-dialog-layout">
    <el-form ref="formRef" size="small" :rules="formRules" :model="data" class="f2bpm-editform" label-width="120px">
      <el-row>
        <el-col :span="12">
          <el-form-item label="姓名" prop="RealName">
            <el-input v-model="data.RealName" placeholder="姓名" @blur.native.capture="toPinYin('RealName','UserName')" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="登录账号" prop="UserName">
            <el-input v-model="data.UserName" placeholder="登录账号,新增后不可修改" :disabled="formAction!='Add'" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item v-if="formAction=='Add'" label="初始密码" prop="Password">
            <el-input v-model="data.Password" placeholder="必须由字母、数字、特殊字符组成至少8位" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item v-if="formAction=='Add'" label="初始组织" prop="OrgId">
            <el-input v-model="data.OrgTitle" size="mini" style="width:180px;margin-right: 3px;" :disabled="true" placeholder="请选择初始组织" />
            <a href="javascript:void(0)" class="fa fa-search font10" title="选择部门" @click="selectorTextValue('OrgId','OrgTitle','Org')">选择</a>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="有效开始时间" prop="BeginTime">
            <el-date-picker v-model="data.BeginTime" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="有效截止时间" prop="EndTime">
            <el-date-picker v-model="data.EndTime" :disabled="!isAdmin" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="电子邮箱" prop="Email">
            <el-input v-model="data.Email" placeholder="电子邮箱" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="手机号码" prop="Mobile">
            <el-input v-model="data.Mobile" placeholder="手机号码" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="企业微信Id" prop="WeixinId">
            <el-input v-model="data.WeixinId" placeholder="企业微信Id" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="企业微信号" prop="WeixinNo">
            <el-input v-model="data.WeixinNo" placeholder="企业微信号" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="即时通讯号" prop="ImNo">
            <el-input v-model="data.ImNo" placeholder="即时通讯号" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="状态" prop="Status">
            <f2bpmui-select field="Status" configtype="用户状态" :fieldvalue="data.Status" @updatevalue="updateFieldValue" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="员工编号" prop="EmployeeId">
            <el-input v-model="data.EmployeeId" placeholder="员工编号" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="职级" prop="PostLevel">
            <el-input v-model="data.PostLevel" placeholder="职级" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="座机" prop="Tel">
            <el-input v-model="data.Tel" placeholder="座机" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="性别" prop="Sex">
            <el-select v-model="data.Sex">
              <el-option label="请选择" value="" />
              <el-option label="男" value="男" />
              <el-option label="女" value="女" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="用户类别" prop="UserType">
            <f2bpmui-select field="UserType" configtype="用户类别" :fieldvalue="data.UserType" @updatevalue="updateFieldValue" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="排序号" prop="OrderNo">
            <el-input-number v-model="data.OrderNo" size="small" :min="0" :max="100000" label="排序号" />
          </el-form-item>
        </el-col>
      </el-row>
       <el-row>
        <el-col :span="8">
          <el-form-item label="身份证号" prop="IdentityCard">
            <el-input placeholder="身份证号" v-model="data.IdentityCard" />
          </el-form-item>
        </el-col>
       
        
      </el-row>
      <el-form-item label="地址" prop="Address">
        <el-input v-model="data.Address" placeholder="地址" />
      </el-form-item>
      <el-form-item label="备 注" prop="Remark">
        <el-input v-model="data.Remark"   placeholder="备 注" />
      </el-form-item>
      <div class="dialogfooter" style="margin-top: 0px;padding-top: 0px;">
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
        isAdmin: false,
        formAction: null,
        treeData: [],
        data: {
          UserId:"",
          Tel:"",
          PostLevel:"",
          RealName: '',
          UserName: '',
          Password: '',
          OrgId: null,
          BeginTime: '',
          EndTime: '',
          Email: '',
          Mobile: '',
          WeixinId: '',
          WeixinNo: '',
          Address: '',
          Remark: '',
          QQ: '',
          Status: '1',
          Sex: '男',
          UserType: '0',
          OrderNo:100,
          UserId: '',
          LastModifier: '',
          LastModTime: '',
          TenantId:"",
          IdentityCard:'',
          //非持久化
          OrgTitle:''
        },
        // stand:表单校验规则
        formRules: {
          RealName: [
            { required: true, message: '必填项不能为空' }
          ],
          UserName: [
            { required: true, message: '必填项不能为空' }
          ],
          BeginTime: [
            { required: true, message: '必填项不能为空' }
          ],
          EndTime: [
            { required: true, message: '必填项不能为空' }
          ],
          Sex: [
            { required: true, message: '必填项不能为空' }
          ],
          Status: [
            { required: true, message: '必填项不能为空' }
          ],
          Email: [
            { validator: FUI.GetValidatorRule('email') }
          ],
          Mobile: [
            { validator: FUI.GetValidatorRule('mobile') }
          ],
          IdentityCard: [
            { validator: FUI.GetValidatorRule('identity') }
          ],
        }
      };
    },
    created: function () {
      var that = this;
      that.formAction = formAction;
      const currUser = that.$store.state.user.author;
      that.isAdmin = decodeURI(currUser.realName).indexOf('管理员') > -1;
      if (formAction == FUI.FormAction.Add) {
        var orgId = Object.toQueryString('orgId') || null;
        that.data.OrgId = orgId;
        that.data.Creator = decodeURI(currUser.realName);
        that.data.LastModifier = decodeURI(currUser.realName);
        that.data.LastModTime = Object.toGetCurrentDateTimeString();
        that.data.BeginTime = Object.toGetCurrentDateTimeString();
        that.data.EndTime = new Date().addYear(20).Format("yyyy-MM-dd 00:00:00");
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
      loadTreeSelect() {
        var that = this;
        var treeUrl = FUI.Handlers.OrgImplController + 'getOrgList/?needroot=true';
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
        if (that.formAction == FUI.FormAction.Add) {
          if (that.data.Password == '') {
            FUI.Window.showMsg2(that, '请填写初始密码');
            return false;
          }
          if (that.data.Password ==that.data.UserName) {
            FUI.Window.showMsg2(that, '账号和密码不可相同');
            return false;
          }
          let vmsg = FUI.ValidValue(that.data.Password, 'safepass');
          if (vmsg != "") {
            FUI.Window.showMsg(that, "密码"+vmsg);
            return false;
          }
          if (that.data.OrgId == '' || that.data.OrgId == null) {
            FUI.Window.showMsg2(that, '请选择所属组织');
            return false;
          }
         
        }
        var success = that.validateForm('formRef');
        if (!success) return;
        FUI.Form.submitForm(that, that.data, FUI.Handlers.AdminHandler + 'user/', 'saveUser', formAction, keyId, parentGridId, mainTable);
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
      selectorTextValue(inputKey, inputName, singleSelect) {
        var that = this;
        WF.SelectorDialog.selectOrg(that, inputKey, inputName, singleSelect );
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
      updateFieldValue(fieldName, newVal) {
        var that = this;
        that.data[fieldName] = newVal;
      },
      toPinYin(sourceField, targetField) {
        if (!this.data[targetField]) {
          const source = this.data[sourceField];
          this.data[targetField] = Object.toPinYin(source);
        }
      },
    }
  }
</script>