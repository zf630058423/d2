<template>
  <div class="f2bpm-page-dialog-layout">
    <div>
      <el-form ref="formRef" :rules="formRules" size="small" :model="data" class="f2bpm-editform" label-width="120px">
        <el-form-item label="所属职务" prop="postJobCode">
          <treeselect :disabled="isReadOnly" @select="postJobChange" style="width:200px" v-model="data.postJobCode" :default-expand-level="3" :multiple="false" placeholder="请选择职务" :options="treeData" />
        </el-form-item>
        <el-form-item label="所属组织" prop="orgId">
          <el-input v-model="data.orgName" size="mini" style="width:200px;margin-right: 3px;" :disabled="true" placeholder="请选择初始组织" />
          <a href="javascript:void(0)" v-if="!(formAction=='Add'&&data.orgId!='')&&formAction!='Edit'&&formAction!='View'" class="fa fa-search font10" title="选择部门" @click="selectorTextValue('orgId','orgName','Org')">选择</a>
        </el-form-item>
        <el-form-item label="岗位名称" prop="postName">
          <el-input :disabled="isReadOnly" v-model="data.postName" @blur.native.capture="toPinYin('postName','postCode')"></el-input>
        </el-form-item>
        <el-form-item label="岗位编码" prop="postCode">
          <el-input :disabled="formAction!='Add'" v-model="data.postCode" placeholder="岗位编码,新增后不可修改"></el-input>
        </el-form-item>
        <el-row>
          <el-col :span="24">
            <el-form-item label="是否固定" prop="isFixed">
              <el-switch :disabled="isReadOnly" v-model="data.isFixed" :inactive-value="false" :active-value="true" active-color="#13ce66" inactive-color="#DEDEDE" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="岗位描述" prop="postDescription">
          <el-input :disabled="isReadOnly" v-model="data.postDescription" type="textarea" :rows="4" placeholder="" />
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
          postId: "",
          postStatus: "",
          postName: "",
          companyCode: "",
          createdTime: "",
          tenantId: "",
          isFixed: false,
          postJobCode: null,
          postCode: "",
          postDescription: "",
          orgId: "",
          //非持久化属性
          orgName: ""

        },
        formRules: {
          orgId: [{ required: true, message: '必填项不能为空' }],
          postName: [{ required: true, message: '必填项不能为空' }],
          postJobCode: [{ required: true, message: '必填项不能为空' }],
          postCode: [
            { required: true, message: '必填项不能为空' }
            ,{ validator: FUI.GetValidatorRule('englishchar3') }
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
      that.isReadOnly = that.formAction == "View";
      if (formAction == FUI.FormAction.Add) {
        const currUser = FUI.Sys.getAuthor();
        const orgId = Object.toQueryString('orgId') || "";
        const orgName = Object.toQueryString('orgName') || "";
        const postJobCode = Object.toQueryString('postJobCode') || null;
        that.data.postJobCode = postJobCode;
        that.data.orgId = orgId;
        that.data.orgName = orgName;
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

        var treeUrl = '/admin/postJob/getPostJobTreeJson/?needRoot=false';
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
          FUI.Form.bindDataToForm(that, "/admin/position/", "getModel", keyId, null, mainTable);
        }
      },
      postJobChange(node, instanceId) {
        let that = this;
        if (that.formAction == "Add" && that.data.postName == "") {
          that.data.postName = node.title;
        }
      }
      , submitForm() {
        var that = this;
        //f2bpmui.base.js中全局方法收集富文编辑器数据
        fui_global_richeditorArrValueToInput(that);
        var success = that.validateForm('formRef');
        if (!success) return;
        FUI.Form.submitForm(that, that.data, "/admin/position/", "saveModel", formAction, keyId, parentGridId, mainTable);
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
      , selectorTextValue(inputKey, inputName, singleSelect) {
        var that = this;
        WF.SelectorDialog.selectOrg(that, inputKey, inputName, singleSelect);
      },
      toPinYin(sourceField, targetField) {
        if (!this.data[targetField]) {
          const source = this.data[sourceField];
          this.data[targetField] = Object.toPinYin(source);
        }
      }
    }
  }
</script>