<template>
  <div class="f2bpm-page-dialog-layout" style="padding: 4px;">
    <el-tabs value="常规">
      <el-tab-pane label="常规" name="常规">
        <div class="pl5" style="height: 380px;">
          <legend style="font-size: 12px; margin: 0px;"><i class="fa fa-edit" />字段标题排版方式</legend>
          <div class="p10">
            <el-radio-group v-model="data.formGeneral.ruleParams.titlePosition">
              <el-radio label="right">右对齐</el-radio>
              <el-radio label="left">左对齐</el-radio>
              <el-radio label="top">上边对齐</el-radio>
            </el-radio-group>
            <br> <br>
            <em >说明：置后需要刷新页面才能看到效果。</em>
          </div>
          <legend style="font-size: 12px; margin: 0px;"><i class="fa fa-edit" />表单标签默认宽度（label-width）</legend>
          <div class="p10">
            <el-input v-model="data.formGeneral.ruleParams.labelWidth" size="mini"  placeholder="表单标签默认宽度,例如120px" />
            <br> <br>
            <em >说明：表单标签默认宽度，默认为120px</em>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="自定义按钮" name="自定义按钮" v-if="applyType=='noWorkflowForm'">
        <div>
          <div class="fence-box" style="width:99%; height: 280px; text-align: left;">
            <i class="fa fa-file-o" />自定义按钮
            <div class="p10">
              <a class="btn btn-sm btn-white btn-info btn-bold" @click="customButtonSelect('ruleParams','normal','表单自定义按钮')"> <i class="ace-icon fa fa-pencil  bigger-120  " />表单自定义按钮</a>
            </div>
            <i class="fa fa-file-o" />表单自定义按钮权限
            <div class="p10 " style="line-height:20px;">
              <a class="btn btn-sm btn-white btn-info btn-bold" @click="editFormPermission('')"> <i class="ace-icon fa fa-gears  bigger-120  " />自定义按钮权限</a>
              <br><br>1、普通表单时可添加默认"打印按钮"，按钮编码为print,点击事件无需填写。
              <br> 2、新增的按钮需要先保存到数据库后再打开本页面进行权限配置
              <br>3、<em>注意：</em>设置权限后，按钮定义的英文名请勿修改，否则权限将失效。
              <br>4、 本功能自定义按钮一般用于“无流程表单”即普通表单中，有流程表单请在流程节点上配置自定义按钮。
            </div>
          </div>
        </div>
      </el-tab-pane>
      
    </el-tabs>
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
        applyType:"",
        isShowCustomButton:false,
        isTemplate: '',
        formId: '',
        formKey:"",
        appId: '',
        initailData: [],
        data: {
          formGeneral: { ruleTitle: '表单控件标题排版位置', ruleType: 'form_general', ruleCode: 'formGeneral', whenExcute: {}, ruleParams: { 'titlePosition': 'right',labelWidth:'' } },
          formCustButton: { ruleTitle: '表单自定义按钮', ruleType: 'form_button', ruleCode: 'formCustButton', whenExcute: {}, ruleParams: [] }
        }
      };
    },
    computed: {},
    created() {
      var that = this;
      var formKey = Object.toQueryString('formKey') || '';
      var formId = Object.toQueryString('formId') || '';
      var isTemplate = Object.toQueryString('isTemplate') || 0;
      that.formId = formId;
      that.formKey = formKey;
      that.isTemplate = isTemplate;
      var res = Object.toAjaxJson(FUI.Handlers.SmartFormHandler, 'getFormOptionsData', { 'formId': formId, 'isTemplate': isTemplate });
      that.initailData = res.data || [];
      if(res.success){
        that.applyType=res.msg;
      }
    },
    mounted() {
      var that = this;
      window.myvm = that;
      that.initail();
    },
    methods: {
      closeEdit() {
        // stand:关闭编辑窗口
        FUI.Window.closeEdit();
      },
      initail() {
        var that = this;
        if (that.initailData == null || that.initailData.length == 0) {
          return false;
        }
        $.each(that.initailData, function (opttype, item) {
          if (item != null) {
            var opttype = item.ruleCode;
            that.data[opttype] = item;
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
      collectData() {
        var that = this;
        try {
          var data = [];
          var formGeneralJson = that.data.formGeneral;
          data.push(formGeneralJson);

          var custFormButtonJson = that.data.formCustButton;
          data.push(custFormButtonJson);

          var resultStr = JSON.stringify(data);
          if (resultStr == '[]') {
            return '';
          } else {
            return resultStr;
          }
        } catch (err) {
          console.info(err);
          FUI.Window.showMsg(err);
          return false;
        }
      },
      saveAndClose() {
        var that = this;
        var formOptions = that.collectData();
        var data = Object.toAjaxJson(FUI.Handlers.SmartFormHandler, 'saveFormOptions', {
          'formId': that.formId,
          'isTemplate': that.isTemplate,
          'formOptions': formOptions
        });
        if (data.success == true) {
          FUI.Window.showMsg(data.msg, null, 1, function () {
            FUI.Window.closeEdit();
          });
        } else {
          FUI.Window.showMsg(data.msg);
        }
      },
      selectorUserTextValue(inputKey, inputName, passParm, singleSelect, keyName) {
        var that = this;
        WF.SelectorDialog.selectorUserTextValue(that, inputKey, inputName, passParm, singleSelect, keyName, null, null, that.data.autoCirculated);
      },
      customButtonSelect(inputId, type, title) {
        WF.SelectorDialog.customButtonSelect(this, inputId, type, title, this.data.formCustButton);
      },
      editFormPermission() {
        var that = this;
        var rightType="formCustButton";
        var url="/workflow/smartForm/formPermission/formFieldListPermissions";
        FUI.Window.openEdit(url+'?rightType='+rightType+'&formKey=' + that.formKey, '表单自定义按钮权限', 'Edit', '', 850, 500, null, null, null, true,null,null,true);
      }
    }

  };

  window.getResult = function () {
    return myvm.getResult();
  }
</script>