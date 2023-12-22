<template>
  <div class="f2bpm-page-dialog-layout">
    <div>
      <el-form ref="formRef" :rules="formRules" size="small" :model="data" class="f2bpm-editform" label-width="120px">
        <el-form-item label="职务名称" prop="jobName">
          <el-input :disabled="isReadOnly" v-model="data.jobName" @blur.native.capture="toPinYin('jobName','jobCode')"></el-input>
        </el-form-item>
        <el-form-item label=" 职务编码" prop="jobCode">
          <el-input   :disabled="isReadOnly||formAction!='Add'" v-model="data.jobCode"></el-input>
        </el-form-item>
        <el-form-item label="上级目录" prop="ParentId">
          <treeselect :disabled="isReadOnly"  v-model="data.parentCode" :default-expand-level="3" :multiple="false" placeholder="请选择上级目录" :options="treeData" />
        </el-form-item>
        <el-form-item label=" 职务级别" prop="jobLevel">
          <el-input :disabled="isReadOnly" v-model="data.jobLevel"></el-input>
        </el-form-item>
        <el-form-item label="职务描述" prop="jobDescription">
          <el-input :disabled="isReadOnly" v-model="data.jobDescription" type="textarea" :rows="4" placeholder="" />
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
          parentCode: "root",
          id: "",
          jobCode: "",
          jobLevel: "",
          jobDescription: "",
          jobName: "",
          tenantId: "",
          createdTime: ""

        },
        formRules: {
          jobCode: [
            { required: true, message: '必填项不能为空' }
            ,{ validator: FUI.GetValidatorRule('englishchar3') }
          ],
          jobName: [
            { required: true, message: '必填项不能为空' }
          ],
        }
      };
    },
    mounted() {
      var that = this;
      window.myvm = that;
    },
    created: function () {
      var that = this;
      that.loadTreeSelect();
      that.formAction = formAction;
      that.isReadOnly=formAction=="View";
      if (formAction == FUI.FormAction.Add) {
        var parentCode = Object.toQueryString('parentCode') || 'root';
        that.data.parentCode = parentCode;
        const currUser = FUI.Sys.getAuthor();
        that.data.tenantId = currUser.tenantId;
        that.data.createdTime = Object.toGetCurrentDateTimeString();
      }
      that.loadData();
    },
    methods: {
      closeEdit() {
        FUI.Window.closeEdit();
      },
      loadTreeSelect() {
        var that = this;
        var treeUrl = '/admin/postJob/getPostJobTreeJson/?needRoot=true';
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
      loadData() {
        var that = this;
        if (formAction != FUI.FormAction.Add) {
          FUI.Form.bindDataToForm(that, "/admin/postJob/", "getModel", keyId, null, mainTable);
        }
      },
      submitForm() {
        var that = this;
        //f2bpmui.base.js中全局方法收集富文编辑器数据
        fui_global_richeditorArrValueToInput(that);
        var success = that.validateForm('formRef');
        if (!success) return;
        FUI.Form.submitForm(that, that.data, "/admin/postJob/", "saveModel", formAction, keyId, parentGridId, mainTable);
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
      , toPinYin(sourceField, targetField) {
        if (!this.data[targetField]) {
          const source = this.data[sourceField];
          this.data[targetField] = Object.toPinYin(source);
        }
      }
    }
  }
</script>