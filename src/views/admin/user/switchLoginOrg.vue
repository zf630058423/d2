<template>
  <div class="f2bpm-page-dialog-layout">
    <el-form
      ref="formRef"
      size="small"
      :rules="formRules"
      :model="data"
      class="f2bpm-editform"
      label-width="100px"
    >
      <div style="font-weight: bold; text-align: center;font-size: 16px;">切换登录组织</div>
      <div style="margin-left: 10px;">当前登录组织：{{ userInfo.orgName }}</div>
      <div v-for="(orgId,indexNo) in userInfo.orgIdList"><span
        :class="orgId==currentLoginOrgId?'cube bg-gree m10':'cube bg-grey m10 cur'"
        style="margin: 10px;height: 30px;display: inline-block; width:450px;cursor: pointer; "
      >
        <span style="display: inline;">
          <el-radio
            v-model="radioOrgId"
            :label="orgId"
          >.</el-radio>
        </span>
        <span v-html="orgNameList[indexNo]" /> </span></div>
      <div class="dialogfooter">
        <el-button
          size="small"
          type="primary"
          @click="submitForm()"
        ><i class="fa fa-sign-in" />确定
        </el-button>
        <el-button
          id="btn_cancel"
          size="small"
          @click="closeEdit"
        ><i class="fa fa-minus-circle" />取消
        </el-button>
      </div>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      radioOrgId: '',
      currentLoginOrgId: '',
      userInfo: {},
      orgNameList: [],
      formAction: null,
      treeData: [],
      data: {
        userId: '',
        orgId: '',
        corpId: 'AppDefault'
      },
      formRules: {}
    };
  },
  created: function() {
    var that = this;
    that.formAction = formAction;
    var userId = Object.toQueryString('userId') || '';
    var orgId = Object.toQueryString('orgId') || '';
    that.data.userId = userId;
    that.currentLoginOrgId = orgId;
    that.radioOrgId = orgId;
    var userId = that.$store.state.user.userId;
    var orgName = decodeURI(that.$store.state.user.author.orgName);
    var res = Object.toAjaxJson(FUI.Handlers.OrgImplController, 'getUserInfo', {
      userId: userId
    });
    if (res.success) {
      that.userInfo = res.data;
      that.userInfo.orgName = orgName;
      that.orgNameList = that.userInfo.orgNameList;
      console.info(that.userInfo);
      that.$store.dispatch('user/setUserInfo', that.userInfo)
    }
  },
  methods: {
    closeEdit() {
      FUI.Window.closeEdit();
    },
    submitForm() {
      var that = this;
      if (that.radioOrgId == that.currentLoginOrgId) {
        FUI.Window.showMsg2(that, '要切换的组织已经是当前登录组织！');
        return false;
      }
      that.data.orgId = that.radioOrgId;
      Object.toAjaxJson(
        '/workflow/security/orgImpl/',
        'switchLoginOrg',
        that.data,
        true,
        null,
        function(res) {
          if (res.success) {
            JSON.stringify(res.data);
            var authorStr = JSON.stringify(res.data);
            window.parent.localStorage.setItem('f2bpmAuthor', authorStr);
            FUI.Window.showMsg(that, '切换登录组织成功', null, 1, function() {
              // 写入Seesion
              window.parent.location.reload();
              FUI.Window.closeEdit();
            });
          } else {
            FUI.Window.showMsg(res.msg);
          }
        }
      );
    },
    validateForm(refFormName) {
      // stand:表单校验
      var success = false;
      this.$refs[refFormName].validate((valid) => {
        success = valid;
      });
      return success;
    },
    selectorUserString(inputKey, inputName, passParm, singleSelect, keyName) {
      var that = this;
      WF.SelectorDialog.selectorUserString(
        that,
        inputKey,
        inputName,
        passParm,
        singleSelect,
        keyName
      );
    },
    selectorUserTextValue(
      inputKey,
      inputName,
      passParm,
      singleSelect,
      keyName
    ) {
      var that = this;
      WF.SelectorDialog.selectorUserTextValue(
        that,
        inputKey,
        inputName,
        passParm,
        singleSelect,
        keyName
      );
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
};
</script>
