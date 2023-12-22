<template>
  <div class="f2bpm-page-dialog-layout">
    <div>
      <el-form ref="formRef" :rules="formRules" size="small" :model="data" class="f2bpm-editform" label-width="120px">
        <el-form-item label="对象类别" prop="objType">
          <el-select v-model="data.objType" :disabled="isReadOnly">
            <el-option label="请选择" value="" />
            <el-option label="登录日志" value="loginLog" />
          </el-select>
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="对象标题" prop="objTitle">
              <el-input :disabled="isReadOnly" v-model="data.objTitle"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="对象编码" prop="objCode">
              <el-input :disabled="formAction!='Add'" v-model="data.objCode"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="当前标题" prop="currentTitle">
          <el-input :disabled="isReadOnly" v-model="data.currentTitle"></el-input>
        </el-form-item>
        <el-form-item label="当前状态值" prop="currentValue">
          <el-input :disabled="isReadOnly" v-model="data.currentValue"></el-input>
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="当前状态值2" prop="currentValue2">
              <el-input :disabled="isReadOnly" v-model="data.currentValue2"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="当前状态值3" prop="currentValue3">
              <el-input :disabled="isReadOnly" v-model="data.currentValue3"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="是否全局使用" prop="isGlobal">
              <el-switch :disabled="isReadOnly" v-model="data.isGlobal" :inactive-value="0" :active-value="1" active-color="#13ce66" inactive-color="#DEDEDE" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="租户号" prop="tenantId">
              <el-input :disabled="isReadOnly" v-model="data.tenantId"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="备注" prop="remarks">
          <el-input :disabled="isReadOnly" v-model="data.remarks"></el-input>
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

        data: {
          id: "",
          objType: "",
          objTitle: "",
          objCode: "",
          currentTitle: "",
          currentValue: "",
          currentValue2: "",
          currentValue3: "",
          isGlobal: "",
          remarks: "",
          createdTime: "",
          updateTime: "",
          tenantId: ""

        },
        formRules: {
          objType: [{ required: true, message: '必填项不能为空' }],
          objTitle: [{ required: true, message: '必填项不能为空' }],
          objCode: [{ required: true, message: '必填项不能为空' }],
          currentTitle: [{ required: true, message: '必填项不能为空' }],
          createdTime: [{ required: true, message: '必填项不能为空' }],
          tenantId: [{ required: true, message: '必填项不能为空' }],

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
        that.data.tenantId = currUser.tenantId;
      }
      that.loadData();
    },
    methods: {
      closeEdit() {
        FUI.Window.closeEdit();
      },
      loadData() {
        var that = this;
        that.isReadOnly = formAction == FUI.FormAction.View;
        if (formAction != FUI.FormAction.Add) {
          FUI.Form.bindDataToForm(that, "/workflow/security/systemStatus/", "getModel", keyId, null, mainTable);
        }
      },
      submitForm() {
        var that = this;
        //f2bpmui.base.js中全局方法收集富文编辑器数据
        fui_global_richeditorArrValueToInput(that);
        var success = that.validateForm('formRef');
        if (!success) return;
        FUI.Form.submitForm(that, that.data, "/workflow/security/systemStatus/", "saveModel", formAction, keyId, parentGridId, mainTable);
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