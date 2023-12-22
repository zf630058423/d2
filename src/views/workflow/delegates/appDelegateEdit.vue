<template>
  <div class="f2bpm-page-layout">
    <el-form ref="formRef" :rules="formRules" size="small" :model="data" class="f2bpm-editform" label-width="120px">
      <el-form-item label="标题" prop="Title">
        <el-input v-model="data.Title" />
      </el-form-item>
      <el-form-item label="是否启用" prop="IsEnable">
        <el-switch v-model="data.IsEnable" :inactive-value="0" :active-value="1" active-color="#13ce66" inactive-color="#DEDEDE" />
      </el-form-item>
      <el-row>
        <el-col :span="12">
          <el-form-item label="委托类型" prop="DelegateType">
            <el-select v-model="data.DelegateType" class="textBoxSelect" @change="delegateTypeChange">
              <el-option label="委托全部流程" :value="0" />
              <el-option label="指定流程应用" :value="1" />
              <el-option label="按环节委托" :value="2" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item v-if="data.DelegateType!=0&&formAction!='Add'" label="流程应用">
            <f2bpmui-select sqlkey="dbType_CB_AppIdList" field="AppId" :fieldvalue="data.AppId" @updatevalue="updateFieldValue" />
          </el-form-item>
          <el-form-item v-if="data.DelegateType!=0&&formAction=='Add'" label="流程应用">
            <el-input v-model="data.AppNames" size="mini" placeholder="请选择流程" class="textBoxShort" />
            <a role="button" @click="selectApps()"><i class="fa fa-search" />选择</a>
          </el-form-item>

        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="委托开始时间" prop="StartTime">
            <el-date-picker v-model="data.StartTime" size="mini" type="datetime" class="textBoxShort" format="yyyy-MM-dd" value-format="yyyy-MM-dd" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="委托结束时间" prop="EndTime">
            <el-date-picker v-model="data.EndTime" size="mini" type="datetime" class="textBoxShort" format="yyyy-MM-dd" value-format="yyyy-MM-dd" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="被委托人" prop="DelegateUserRealName">
        <el-input v-model="data.DelegateUserRealName" placeholder="请选择被委托的人" class="textAutoBoxLong75" />
        <a id="selectUsers" href="javascript:void(0)" title="选择用户" @click="selectorUserTextValue('DelegateUserId','DelegateUserRealName',null,true,'userId')"><i class="fa fa-search" />选择用户</a>
      </el-form-item>
      <el-form-item label="备注">
        <el-input v-model="data.Remark" type="textarea" :rows="4" placeholder="" />
        <br>
      </el-form-item>
      <el-form-item v-show="false">
        <el-input v-model="data.ActivityDelegateUserId" placeholder="请选择被委托的人" class="textBoxShort" />
      </el-form-item>

      <div class="dialogfooter">
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
        formAction: null,
        props: null,
        treeData: [],
        data: {
          AppDelegateId: "",
          Title: '',
          IsEnable: 1,
          DelegateType: 1,
          AppId: '',
          AppName: '',
          AppNames: '',
          AppIds: '',
          StartTime: null,
          EndTime: null,
          DelegateUserRealName: '',
          DelegateUserId: '',
          Remark: '',
          CreatedTime: '',
          UserId: '',
          TenantId: '',
          CreatorRealName: ''
        },
        formRules: {
          Title: [
            { required: true, message: '必填项不能为空' }
          ],
          AppId: [
            { required: true, message: '必填项不能为空' }
          ],
          EndTime: [
            { required: true, message: '必填项不能为空' }
          ],
          StartTime: [
            { required: true, message: '必填项不能为空' }
          ],
          DelegateUserRealName: [
            { required: true, message: '必填项不能为空' }
          ]
        }
      };
    },
    created: function () {
      var appId = Object.toQueryString('appId');
      var that = this;
      that.formAction = formAction;

      if (formAction == FUI.FormAction.Add) {
        const currUser = that.$store.state.user.author;
        that.data.AppDelegateId = Object.toGuid();
        that.data.CreatedTime = Object.toGetCurrentDateTimeString();
        that.data.UserId = currUser.userId;
        that.data.CreatorRealName = decodeURI(currUser.realName);
        that.data.TenantId = currUser.tenantId;
        that.data.StartTime = Object.toGetCurrentDateString();
      }
      that.props = { 'parm': 'AppId:' + appId };
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
        if (formAction == FUI.FormAction.Add && that.data.AppIds == '' && that.data.DelegateType != 0) {
          FUI.Window.showMsg('请选择流程应用');
          return false;
        }
        if (formAction == FUI.FormAction.Edit && that.data.AppId == '' && that.data.DelegateType != 0) {
          FUI.Window.showMsg('请选择流程应用');
          return false;
        }
       
        var success = that.validateForm('formRef');
        if (!success) return;
        var sub=Object.toGetDateDiff(that.data.StartTime, that.data.EndTime, "day");
        if(sub<0){
          FUI.Window.showMsg('结束时间必须大于等于开始时间');
          return false;
        }
        // 如果是全部流程委托 
        if (formAction == FUI.FormAction.Add && that.data.DelegateType == 0) {
          var json = Object.toAjaxJson('/workflow/delegates/', 'isExistAllDelegate', that.data);
          if (json.success == true) {
            FUI.Window.showMsg(json.msg);
            return false;
          }
        }
        if (formAction == FUI.FormAction.Add) {
          FUI.Form.submitForm(that, that.data, '/workflow/delegates/', 'bathSaveAppDelegate', formAction, keyId, parentGridId, mainTable);
        } else {
          FUI.Form.submitForm(that, that.data, '/workflow/delegates/', 'saveAppDelegate', formAction, keyId, parentGridId, mainTable);
        }
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
        WF.SelectorDialog.selectorUserString(that, inputKey, inputName, passParm, singleSelect, keyName);
      },
      selectApps() {
        var that = this;
        var inputTitle = 'AppNames';
        var inputKey = 'AppIds';
        WF.SelectorDialog.selectorProcessApp(that, inputKey, inputTitle, false);
      },
      clearSelectedUsers(inputId, inputName) {
        var that = this;
        that.data[inputId] = '';
        that.data[inputName] = '';
      },
      delegateTypeChange(v) {
        var that = this;
        if (v == 0) {
          that.data.AppId = '';
        }
      },
      toPinYin(sourceField, targetField) {
        if (!this.data[targetField]) {
          const source = this.data[sourceField];
          this.data[targetField] = Object.toPinYin(source);
        }
      },
      updateFieldValue(fieldName, newVal) {
        var that = this;
        that.data[fieldName] = newVal;
      }
    }
  }
</script>