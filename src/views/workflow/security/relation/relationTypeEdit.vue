<template>
  <div class="f2bpm-page-dialog-layout">
    <div>
      <el-form ref="formRef" :rules="formRules" size="small" :model="data" class="f2bpm-editform" label-width="120px">
        <el-form-item label="类型名称" prop="typeTitle" @blur.native.capture="toPinYin('typeTitle','typeCode')">
          <el-input v-model="data.typeTitle"></el-input>
        </el-form-item>
        <el-form-item label="类型编码" prop="typeCode">
          <el-input v-model="data.typeCode" :disabled="formAction=='Edit'"></el-input>
        </el-form-item>
        <el-form-item label="使用类型" prop="infoType">
          <f2bpmui-select :field="infoType_def" :fieldvalue="data.infoType" @updatevalue="updateFieldValue" />
        </el-form-item>
        <el-form-item label="备注" prop="remarks">
          <el-input v-model="data.remarks" type="textarea" :rows="4" placeholder="" />
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
        infoType:"",
        loading: false,
        formAction: null,
        treeData: [],
        infoType_def: { fieldName: 'infoType', fieldTitle: '使用类型', itemRender: { props: { isReadOnly: false } }, inputCtrlOption: { "data": [{ "orderNum": 1, "text": "部门分管领导", "value": "departLeader" }, { "orderNum": 2, "text": "人员直线关系", "value": "userRelation" }, { "orderNum": 3, "text": "人员汇报树", "value": "relationTree" }, { "orderNum":4, "text": "部门级别标签", "value": "orgLevel" }], "type": "custom" } },
        data: {
          id: "",
          infoType: "",
          typeCode: "",
          typeTitle: "",
          remarks: "",
          tenantid: ""

        },
        formRules: {
          infoType: [{ required: true, message: '必填项不能为空' }],
          typeCode: [{ required: true, message: '必填项不能为空' }],
          typeTitle: [{ required: true, message: '必填项不能为空' }]

        }
      }
    },
    mounted() {
      var that = this;
      window.myvm = that;
    },
    created: function () {
      var that = this;
      that.formAction = formAction;
      if (formAction == FUI.FormAction.Add) {
        var infoType = Object.toQueryString("infoType") || "";
        const currUser = that.$store.state.user.author;
        that.data.infoType = infoType;
        that.data.tenantid = currUser.tenantId;
        that.infoType=infoType;
        that.infoType_def.itemRender.props.isReadOnly = true;
      } else {
        that.infoType_def.itemRender.props.isReadOnly = true;
      }
      that.loadData();
    },
    methods: {
      closeEdit() {
        FUI.Window.closeEdit()
      },
      loadData() {
        var that = this
        if (formAction != FUI.FormAction.Add) {
          FUI.Form.bindDataToForm(that, "/workflow/security/relation/relationType/", "getModel", keyId, null, mainTable);
        }
      },
      submitForm() {
        var that = this;
        //f2bpmui.base.js中全局方法收集富文编辑器数据
        fui_global_richeditorArrValueToInput(that);
        var success = that.validateForm('formRef');
        if (!success) return;
        FUI.Form.submitForm(that, that.data, "/workflow/security/relation/relationType/", "saveModel", formAction, keyId, parentGridId, mainTable);
      },
      // field: 可以是字段名也可以是字段定义的对象
      updateFieldValue(field, newValue, vueDataName, subVueDataName) {
        console.info(field);
        console.info(newValue);
        // 更新控件值
        var that = this
        var vueDataObj = vueDataName ? that[vueDataName] : that.data
        if (subVueDataName) {
          vueDataObj = that[vueDataName][subVueDataName]
        }
        if (typeof field === 'string') {
          vueDataObj[field] = newValue
        } else {
          if (field.fieldName) {
            vueDataObj[field.fieldName] = newValue
          }
          else if (field.vModel) {
            vueDataObj[field.vModel] = newValue
          } else if (field['field']) {
            vueDataObj[field['field']] = newValue
          }
        }
      },
      validateForm(refFormName) {
        var success = false;
        this.$refs[refFormName].validate(valid => {
          success = valid;
        })
        return success;
      },
      toPinYin(sourceField, targetField) {
        if (!this.data[targetField]) {
          const source = this.data[sourceField]
          this.data[targetField] = Object.toPinYin(source)
        }
      }
    }
  }
</script>