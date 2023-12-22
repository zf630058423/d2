<template>
  <div class="f2bpm-page-layout">
    <div class="line">
      <div style="padding: 5px;">

        <div>
          <b v-html="nameText" />
          <div class="space-4" />
          <el-input v-model="data.formName" style="width:50%;margin-right: 5px;" size="small" readonly="readonly" placeholder="请选择表单" class="textBoxLong" />
          <a role="button" size="small" class="btn btn-primary btn-sm mr2" @click="selectWorkflowForm">
            <i class="fa fa-search">选择表单</i></a>
          <a role="button" size="small" class="btn btn-primary btn-sm mr2" @click="editFormPermissions">
            <i class="fa fa-cogs">配置表单权限</i></a>
          <span role="button" class="red cur" @click="cleanForm">
            <i class="fa fa-trash-o">清除表单</i></span>
          <br>
          <i class="fa fa-search cur" @click="showValue">查看JSON值</i></span>
          <br>

          <br> <em>注意事项：</em><br>
          <span v-html="description" />
        </div>
      </div>
    </div>
    <div class="dialogfooter">
      <a href="javascript:void(0);" role="button" class="btn btn-primary btn-sm mr2" @click="saveAndClose()"><i class="fa fa-save" />确定</a>
      <a href="javascript:void(0);" role="button" class="btn btn-primary btn-sm" @click="closeEdit"><i class="fa fa-minus-circle" />取消</a>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        wid: '',
        activityCode: '',
        appId: '',
        attrName: '',
        nameText: '',
        description: '如果“环节子表单”不为空时优先使用环节子表单，为空时默认加载“流程主表单”。',
        data: {
          formName: '',
          content: ''
        }

      };
    },
    created: function () {
      var that = this;
      var obj;
      var title;
      var attrName;
      var initailData = '';
      obj = parent.window.currentWindowTargetObjectValue;
      title = obj.title;
      console.info(obj);
      var value = obj.value || '';
      var wid = obj.otherParm.wid;
      var activityCode = obj.otherParm.activityCode;
      that.activityCode = activityCode;
      attrName = obj.name;
      value = value.replace(/#/g, '');
      initailData = value;
      this.attrName = attrName;
      this.wid = wid;

      // 通过wid换取AppId,只支持非共用流程才能配置节点表单 
      var res = Object.toAjaxJson('/workflow/processDef/', 'getProcessAppByWid', { wid: wid });
      if (res.success) {
        that.appId = res.data.appId;
      } else {
        FUI.Window.showMsg('获取流程应用信息失败:'+res.msg);
      }
      that.nameText = '配置' + title;
      that.data.content = initailData;
      if (initailData) {
        var json = eval('(' + initailData + ')');
        that.data.formName = json[0].FormName;
      }
    },
    mounted() {
      window.myvm = this;
    },
    methods: {
      closeEdit() {
        FUI.Window.closeEdit();
      },
      cleanForm() {
        var that = this;
        that.data.content = '';
        that.data.formName = '';
      },
      showValue() {
        var that = this;
        FUI.Window.showMsg(JSON.stringify(that.data), null, 1);
      },
      saveAndClose() {
        var that = this;
        var content = that.data.content;
        if (content != '') {
          content = '#' + content + '#';
        }
        FUI.Window.confirm(that, '您确定要提交保存？', '温馨提示', function () {
          parent.setTargetValue(that.attrName, content);
          FUI.Window.closeEditAll();
        });
      },
      getResult() {
        var that = this;
        return JSON.stringify(that.content);
      },
      editFormPermissions() {
        var that = this;
        var content = that.data.content;
        var appId = that.appId;
        var activityCode = that.activityCode;
        if (content == ''||appId=="") {
          FUI.Window.showMsg('请先选择节点表单');
          return false;
        }
        var json = eval('(' + content + ')');
     
        console.info(json);
        var formType=json[0].FormType;
        var formKey = json[0].FormKey;
        if(formType=="UrlForm"){
          FUI.Window.showMsg('所选表单类型为“URL表单”无需配置表单权限。');
          return false;
        }
        if (formKey) {
          var url = __webpath + '/workflow/smartForm/formPermission/formFieldListPermissions/?rightType=activityForm&appId=' + appId + '&activityCode=' + activityCode + '&formKey=' + formKey;
          FUI.Window.open(url);
        }
      },
      selectWorkflowForm() {
        var that=this;
        if(that.appId==""){
          FUI.Window.showMsg('当前流程不支持节点表单');
          return false;
        }
        // 选择表单应用
        WF.SelectorDialog.processFormObjectSelector(this, 'content', 'formName');
      }
    }
  };
  window.getResult = function () {
    return myvm.getResult();
  }
</script>