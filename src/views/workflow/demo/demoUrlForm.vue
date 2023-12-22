<template>
  <div class="bg-white">
    <div style="font-size: 20px; text-align: center; padding: 10px;">URL内部表单示例 </div>
    <el-form ref="formRef" :rules="formRules" size="small" :model="data" class="f2bpm-editform" label-width="120px">
      <el-form-item label="姓名123" prop="realName">
        <el-input :disabled="isReadOnly" v-model="data.realName"></el-input>
      </el-form-item>
      <el-form-item label="部门名称" prop="orgName">
        <el-input :disabled="isReadOnly" v-model="data.orgName"></el-input>
      </el-form-item>
      <el-form-item label=" 职位" prop="jobName">
        <el-input :disabled="isReadOnly" v-model="data.jobName"></el-input>
      </el-form-item>
      <el-form-item label="请假类型" prop="levelType">
        <f2bpmui-checkbox :readOnly="isReadOnly" :field="levelType_def" :fieldvalue="data.levelType" @updatevalue="updateFieldValue" />
      </el-form-item>
      <el-form-item label="开始时间" prop="startDate">
        <el-date-picker :disabled="isReadOnly" v-model="data.startDate" size="mini" type="datetime" class="textBoxShort" format="yyyy-MM-dd" value-format="yyyy-MM-dd" />
      </el-form-item>
      <el-form-item label="结束时间" prop="endDate">
        <el-date-picker :disabled="isReadOnly" v-model="data.endDate" size="mini" type="datetime" class="textBoxShort" format="yyyy-MM-dd" value-format="yyyy-MM-dd" />
      </el-form-item>
      <el-form-item label="请假天数" prop="levelTotalday">
        <el-input :disabled="isReadOnly" v-model="data.levelTotalday"></el-input>
      </el-form-item>
      <el-form-item label="流程实例ID" prop="wiid">
        <el-input :disabled="isReadOnly" v-model="data.wiid"></el-input>
      </el-form-item>
      <el-form-item label="备注" prop="remarks">
        <el-input :disabled="isReadOnly" v-model="data.remarks" type="textarea" :rows="4" placeholder="" />
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        loading: false,
        //当前页面状态：0未有实例，2待办，3查看,4待阅
        formAction: null,
        isReadOnly: false,
        treeData: [],
        levelType_def: { fieldName: 'levelType', fieldTitle: '请假类型', inputCtrlOption: { "data": [{ "orderNum": 1, "text": "事假", "value": "事假" }, { "orderNum": 2, "text": "年假", "value": "年假" }, { "orderNum": 3, "text": "病假", "value": "病假" }, { "orderNum": 4, "text": "婚假", "value": "婚假" }], "type": "custom" }, fieldOptions: null, fieldRemark: '' },

        data: {
          id: "",
          realName: "",
          orgName: "",
          jobName: "",
          levelType: "",
          startDate: "",
          endDate: "",
          levelTotalday: "",
          wiid: "",
          remarks: ""

        },
        formRules: {
          levelType: [{ required: true, message: '必填项不能为空' }],
          realName: [{ required: true, message: '必填项不能为空' }],
          startDate: [{ required: true, message: '必填项不能为空' }],
          endDate: [{ required: true, message: '必填项不能为空' }],
          levelTotalday: [{ required: true, message: '必填项不能为空' }],

        }
      };
    },
    mounted() {
      var that = this;
      window.myvm = that;
      window.$urlFormVue = that;
    },
    created: function () {
      var that = this;
      that.initailWorkflowParms();
      if (that.formAction == 0) {
        const currUser = FUI.Sys.getAuthor();
        that.data.realName = decodeURI(currUser.realName);
        that.data.orgName = decodeURI(currUser.orgName);
        that.data.startDate = Object.toGetCurrentDateString();
        that.data.endDate = Object.toGetCurrentDateString();
        that.data.levelTotalday = 0;
        that.data.wiid = that.wiid;
      }
      that.loadData();
    },
    methods: {
      //============================================工作流操作按钮交互的函数=====================================
      //初始化iframe中url传入的流程相关参数
      initailWorkflowParms() {
        var that = this;
        //获取流程页面的流程上下文[实用的流程信息从这里获取]
        that.wfContext = window.parent.myvm.wfContext;
        console.info(that.wfContext);
        //流程应用定义ID
        var appId = Object.toQueryString("appId") || "";
        //流程实例ID
        var wiid = Object.toQueryString("wiid") || "";
        if (wiid == "") {
          wiid = that.wfContext.WorkflowInstanceId;
        }
        //  当前页面状态：0未有实例，2待办，3查看,4待阅
        var formAction = Object.toQueryString("formAction") || 0;
        //待办任务ID，待办时才有此参数
        var taskId = Object.toQueryString("taskId") || "";
        if (formAction > 2) {
          that.isReadOnly = true;
        }
        that.appId = appId;
        that.wiid = wiid;
        that.formAction = formAction;
        that.taskId = taskId;
      }
      //工作流点击"保存"时触发此函数，返回true:工作流继续提交， false:工作流不提交
      , saveWorkflow(btnDef) {
        var that = this;
        console.info("urlFormDemo saveWorkflow:", btnDef);
        var result = "";
        result = that.submitForm();
        return result;

      }
      //工作流点击"提交"时触发此函数，返回:空字符串:工作流继续提交，返回"具体错误信息":工作流不提交
      , sendWorkflow(btnDef) {
        var that = this;
      
        console.info("urlFormDemo sendWorkflow", btnDef);
        var result = "";
        result = that.submitForm();
        return result;
      }
      //工作流点击"提交"时触发此函数，返回:空字符串:工作流继续提交，返回"具体错误信息":工作流不提交
      , rejectWorkflow(btnDef) {
        var that = this;
        console.info("urlFormDemo rejectWorkflow", btnDef);
        var result = "";
        result = that.submitForm();
        return result;
      }
      //工作流点击"作废"时触发此函数，返回:空字符串:工作流继续提交，返回"具体错误信息":工作流不提交
      //content为作废意见
      , invalidWorkflow(content) {
        var that = this;
        console.info("urlFormDemo invalidWorkflow", content);
        var result = "";// "invalidWorkflow:"+content;
        return result;
      }
      //工作流点击"确认转办"时触发此函数，返回:空字符串:工作流继续提交，返回"具体错误信息":工作流不提交
      //opinion:转办意见
      , referredWorkflow(opinion) {
        var that = this;
        console.info("urlFormDemo referredWorkflow", opinion);
        var result = "";// "referredWorkflow:"+opinion;
        return result;
      }
      //工作流点击"提交"时弹出窗口前触发此函数，返回:true校验通过，false校验不通过；
      //也可以返回具体的错误信息：空字符串，校验通过，返回具体错误信息校验不通过，同时弹出具体的错误信息。
      , validateWorkflowForm(btnDef) {
        var that = this;
        var success = that.validateForm('formRef');
        //校验通过后可通过设置流程变量来达到与流程引擎的交互,变量Key“以flow_开头并且在流程变量定义中存在的变量”引擎会帮你做持久化否则为临时变量
        window.parent.myvm.processVariablesJson=JSON.stringify([{key:"flow_count",value:500}]);
        return success;
      }
      //工作流工具栏上的其它按钮操作时返回:空字符串: 按钮继续执行，返回"具体错误信息":按钮不再执行
      , otherWorkflowButtonClick(btnDef) {
        var that = this;
        var actionName = btnDef.actionName;
        //btnDef：按钮的定义实体
        console.info(actionName);
        console.info(btnDef);
        return "";
      }
      //============================================工作流操作按钮交互 结束==================================
      , loadData() {
        var that = this;
        if (that.formAction != 0) {
          FUI.Form.bindDataToForm(that, "/workflow/demo/demoUrlForm/", "getModelByWiid", that.wiid, null, null);
        }
      },
      submitForm() {
        var that = this;
        fui_global_richeditorArrValueToInput(that);
        var success = that.validateForm('formRef');
        if (!success) return;
        var res = Object.toAjaxJson("/workflow/demo/demoUrlForm/", "saveWorkflowForm", that.data);
        if (res.success) {
          return "";
        } else {
          return res.msg;
        }
      },
      // field: 可以是字段名也可以是字段定义的对象
      updateFieldValue(field, newValue, vueDataName, subVueDataName) {
        // 更新控件值
        var that = this;
        var vueDataObj = vueDataName ? that[vueDataName] : that.data;
        if (subVueDataName) {
          vueDataObj = that[vueDataName][subVueDataName];
        }
        if (typeof field === 'string') {
          vueDataObj[field] = newValue;
        } else {
          if (field.fieldName) {
            vueDataObj[field.fieldName] = newValue;
          }
          else if (field.vModel) {
            vueDataObj[field.vModel] = newValue;
          } else if (field['field']) {
            vueDataObj[field['field']] = newValue;
          }
        }
      },
      validateForm(refFormName) {
        var success = false;
        this.$refs[refFormName].validate(valid => {
          success = valid;
        });
        return success;
      }
    }
  }
</script>