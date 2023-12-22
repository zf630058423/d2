<template>
  <div class="f2bpm-page-dialog-layout">
    <div>
      <el-form ref="formRef" :rules="formRules" size="small" :model="data" class="f2bpm-editform" label-width="120px">
         <el-form-item label="最近操作人姓名" prop="lastUpdateRealName">
<el-input :disabled="isReadOnly" v-model="data.lastUpdateRealName"></el-input>
</el-form-item>
 <el-form-item label="存储物理表名" prop="physicalTableName">
<el-input :disabled="isReadOnly" v-model="data.physicalTableName"></el-input>
</el-form-item>
 <el-form-item label="期望切割实例数" prop="expectNum">
<el-input :disabled="isReadOnly" v-model="data.expectNum"></el-input>
</el-form-item>
 <el-form-item label="切割摘要描述" prop="detailDescript">
<el-input :disabled="isReadOnly" v-model="data.detailDescript"></el-input>
</el-form-item>
 <el-form-item label="" prop="lastExcuteTime">
 <el-date-picker :disabled="isReadOnly" v-model="data.lastExcuteTime" size="mini" type="datetime" class="textBoxShort" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" />
</el-form-item>
 <el-form-item label="创建人ID" prop="creatorId">
<el-input :disabled="isReadOnly" v-model="data.creatorId"></el-input>
</el-form-item>
 <el-form-item label="创建人姓名" prop="creatorRealName">
<el-input :disabled="isReadOnly" v-model="data.creatorRealName"></el-input>
</el-form-item>
 <el-form-item label="创建人时间" prop="createdTime">
 <el-date-picker :disabled="isReadOnly" v-model="data.createdTime" size="mini" type="datetime" class="textBoxShort" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" />
</el-form-item>
 <el-form-item label="最近操作时间" prop="lastUpdateTime">
 <el-date-picker :disabled="isReadOnly" v-model="data.lastUpdateTime" size="mini" type="datetime" class="textBoxShort" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" />
</el-form-item>
 <el-form-item label="最近操作人ID" prop="lastUpdateOperatorId">
<el-input :disabled="isReadOnly" v-model="data.lastUpdateOperatorId"></el-input>
</el-form-item>
 <el-form-item label="方案ID" prop="refDivisionId">
<el-input :disabled="isReadOnly" v-model="data.refDivisionId"></el-input>
</el-form-item>
 <el-form-item label="切割状态" prop="detailStatus">
<el-input :disabled="isReadOnly" v-model="data.detailStatus"></el-input>
</el-form-item>
 <el-form-item label="执行次数" prop="executeNum">
<el-input :disabled="isReadOnly" v-model="data.executeNum"></el-input>
</el-form-item>
 <el-form-item label="成功切割实例数" prop="successNum">
<el-input :disabled="isReadOnly" v-model="data.successNum"></el-input>
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
	lastUpdateRealName:"",
	physicalTableName:"",
	expectNum:"",
	detailDescript:"",
	lastExcuteTime:"",
	creatorId:"",
	creatorRealName:"",
	createdTime:"",
	lastUpdateTime:"",
	lastUpdateOperatorId:"",
	refDivisionId:"",
	detailStatus:"",
	executeNum:"",
	successNum:""

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
      that.isReadOnly = formAction == FUI.FormAction.View;
      if (formAction == FUI.FormAction.Add) {
        const currUser = FUI.Sys.getAuthor();
                  
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
          FUI.Form.bindDataToForm(that, "/security/workflow/dataDivisionDetail/", "getModel", keyId, null, mainTable);
        }
      },
      submitForm() {
        var that = this;
        //f2bpmui.base.js中全局方法收集富文编辑器数据
        fui_global_richeditorArrValueToInput(that);
        var success = that.validateForm('formRef');
        if (!success) return;
        FUI.Form.submitForm(that, that.data, "/security/workflow/dataDivisionDetail/", "saveModel", formAction, keyId, parentGridId, mainTable);
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