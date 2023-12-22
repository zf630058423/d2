<template>
  <div class="f2bpm-page-dialog-layout">
    <div>
      <el-form ref="formRef" :rules="formRules" size="small" :model="data" class="f2bpm-editform" label-width="120px">
         <el-form-item label="" prop="postId">
<el-input :disabled="isReadOnly" v-model="data.postId"></el-input>
</el-form-item>
 <el-form-item label="" prop="createdTime">
 <el-date-picker :disabled="isReadOnly" v-model="data.createdTime" size="mini" type="datetime" class="textBoxShort" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" />
</el-form-item>
 <el-form-item label="" prop="tenantId">
<el-input :disabled="isReadOnly" v-model="data.tenantId"></el-input>
</el-form-item>
 <el-form-item label="" prop="userid">
<el-input :disabled="isReadOnly" v-model="data.userid"></el-input>
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
        isReadOnly:false,
        treeData: [],
                 
        data: {
          	 	id:"",
	postId:"",
	createdTime:"",
	tenantId:"",
	userid:""

        },
        formRules: {  
          	
        }
      }
    },
    mounted() {
      var that=this;
       window.myvm=that;
    },
    created: function () {
      var that = this;
      that.formAction = formAction;
      if (formAction == FUI.FormAction.Add) {
        const currUser = FUI.Sys.getAuthor();
                  that.data.tenantId=currUser.tenantId;

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
          FUI.Form.bindDataToForm(that, "/admin/user/userInPosition/", "getModel", keyId, null, mainTable);
        }
      },
      submitForm() {
        var that = this;
        //f2bpmui.base.js中全局方法收集富文编辑器数据
        fui_global_richeditorArrValueToInput(that);
        var success = that.validateForm('formRef');
        if (!success) return;
        FUI.Form.submitForm(that, that.data, "/admin/user/userInPosition/", "saveModel", formAction, keyId, parentGridId, mainTable);
      },
       // field: 可以是字段名也可以是字段定义的对象
      updateFieldValue(field, newValue, vueDataName, subVueDataName) {
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
      }
    }
  }
</script>