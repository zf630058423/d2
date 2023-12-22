<template>
  <div class="f2bpm-page-dialog-layout">
    <div>
      <el-form ref="formRef" :rules="formRules" size="small" :model="data" class="f2bpm-editform" label-width="120px">
        <el-form-item label="" prop="levelType">
          <f2bpmui-radio :readOnly="isReadOnly" :field="levelType_def" :fieldvalue="data.levelType" @updatevalue="updateFieldValue" />
        </el-form-item>
        <el-form-item label="" prop="realName">
          <el-input :disabled="isReadOnly" v-model="data.realName"></el-input>
        </el-form-item>
        <el-form-item label="" prop="jobName">
          <el-input :disabled="isReadOnly" v-model="data.jobName"></el-input>
        </el-form-item>
        <el-form-item label="" prop="levelTotalday">
          <el-input :disabled="isReadOnly" v-model="data.levelTotalday"></el-input>
        </el-form-item>
        <el-form-item label="" prop="startDate">
          <el-date-picker :disabled="isReadOnly" v-model="data.startDate" size="mini" type="datetime" class="textBoxShort" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" />
        </el-form-item>
        <el-form-item label="" prop="endDate">
          <el-date-picker :disabled="isReadOnly" v-model="data.endDate" size="mini" type="datetime" class="textBoxShort" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" />
        </el-form-item>
        <el-form-item label="" prop="remarks">
          <el-input :disabled="isReadOnly" v-model="data.remarks"></el-input>
        </el-form-item>
        <el-form-item label="" prop="wiid">
          <el-input :disabled="isReadOnly" v-model="data.wiid"></el-input>
        </el-form-item>
        <el-form-item label="" prop="orgName">
          <el-input :disabled="isReadOnly" v-model="data.orgName"></el-input>
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
        loading: false,
        formAction: null,
        isReadOnly: false,
        treeData: [],
        levelType_def: { fieldName: 'levelType', fieldTitle: '', inputCtrlOption: { "data": [{ "orderNum": 1, "text": "Items1", "value": "Items1" }, { "orderNum": 2, "text": "Items2", "value": "Items2" }, { "orderNum": 3, "text": "Items3", "value": "Items3" }], "type": "custom" }, fieldOptions: null, fieldRemark: '' },

        data: {
          id: "",
          levelType: "",
          realName: "",
          jobName: "",
          levelTotalday: "",
          startDate: "",
          endDate: "",
          remarks: "",
          wiid: "",
          orgName: ""

        },
        formRules: {

        }
      };
    },
    mounted() {
      var that = this;
      window.myvm = that;
    },
    created: function () {
      var that = this;
      that.formAction = formAction;
      if (formAction == FUI.FormAction.Add) {
        const currUser = FUI.Sys.getAuthor();

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
          FUI.Form.bindDataToForm(that, "/DemoUrlForm/DemoUrlFormdemoUrlForm/", "getModel", keyId, null, mainTable);
        }
      },
      submitForm() {
        var that = this;
        //f2bpmui.base.js中全局方法收集富文编辑器数据
        fui_global_richeditorArrValueToInput(that);
        var success = that.validateForm('formRef');
        if (!success) return;
        FUI.Form.submitForm(that, that.data, "/DemoUrlForm/DemoUrlFormdemoUrlForm/", "saveModel", formAction, keyId, parentGridId, mainTable);
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