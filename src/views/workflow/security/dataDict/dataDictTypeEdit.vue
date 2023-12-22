<template>
  <div class="f2bpm-page-dialog-layout">
    <div>
      <el-form ref="formRef" :rules="formRules" size="small" :model="data" class="f2bpm-editform" label-width="120px">
        <el-form-item label="上级分类" prop="parentId">
          <treeselect v-model="data.parentId" :default-expand-level="3" :multiple="false" placeholder="请选择分类" :options="treeData" />
        </el-form-item>
        <el-form-item label="分类名称" prop="typeName">
          <el-input v-model="data.typeName"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remarks">
          <el-input  type="textarea" :rows="4"  v-model="data.remarks"></el-input>
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
          parentId: "",
          typeName: "",
          remarks: "",
          tenantid: ""

        },
        formRules: {
          parentId: [
            { required: true, message: '请选择上级分类', trigger: 'blur' }
          ],
          typeName: [
            { required: true, message: '请填写分类名称', trigger: 'blur' }
          ]
        }
      };
    },
    mounted() {
      var that = this;
      window.myvm = that;
    },
    created: function () {
      var that = this;
      var parentId = Object.toQueryString('parentId') || null;
      that.formAction = formAction;
      if (formAction == FUI.FormAction.Add) {
        const currUser = FUI.Sys.getAuthor();
        that.data.parentId = parentId;
        that.data.tenantid = currUser.tenantId;

      }
      that.loadTree();
      that.loadData();
    },
    methods: {
      closeEdit() {
        FUI.Window.closeEdit();
      },
      loadTree() {
        var that = this;
        var treeUrl = '/workflow/security/dataDictType/getDataDictTypeTreeJson/?needRoot=true';
        Object.toAjaxJson(treeUrl, null, null, true, null, function (res) {
          if (res.success) {
            that.treeData = res.data;
            var msg = res.msg;
          } else {
            FUI.Window.showMsg(res.msg);
          }
        });
      },
      loadData() {
        var that = this;
        if (formAction != FUI.FormAction.Add) {
          FUI.Form.bindDataToForm(that, "/workflow/security/dataDictType/", "getModel", keyId, null, mainTable);
        }
      },
      submitForm() {
        var that = this;
        //f2bpmui.base.js中全局方法收集富文编辑器数据
        fui_global_richeditorArrValueToInput(that);
        var success = that.validateForm('formRef');
        if (!success) return;
        FUI.Form.submitForm(that, that.data, "/workflow/security/dataDictType/", "saveModel", formAction, keyId, parentGridId, mainTable);
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