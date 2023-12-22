<template>
  <div class="f2bpm-page-dialog-layout">
    <div>
      <el-form ref="formRef" :rules="formRules" size="small" :model="data" class="f2bpm-editform" label-width="120px">
        <el-form-item label="方案标题" prop="title">
          <el-input :disabled="isReadOnly" style="width: 80%;" v-model="data.title"></el-input>
          <span class="blue cur font10" @click="generalTitle"> 生成标题</span>
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="业务类型" prop="divisionInfo">
              <el-select v-model="data.divisionInfo">
                <el-option label="请选择" value="" />
                <el-option label="流程实例" value="procInst" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="按什么方式切" prop="divisionType">
              <el-select v-model="data.divisionType">
                <el-option label="请选择" value="" />
                <el-option label="流程发起所在年份" value="procInstYear" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="切割年份" prop="divisionValue">
              <el-date-picker v-model="data.divisionValue" :value-format="data.divisionType=='procInstYear'?'yyyy':'yyyy-MM'" :type="data.divisionType=='procInstYear'?'year':'month'" placeholder="选择年">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="状态" prop="divisionStatus">
              <el-select v-model="data.divisionStatus">
                <el-option label="请选择" value="" />
                <el-option label="未执行" :value="0" />
                <el-option label="表已创建" :value="1" />
                <el-option label="已执行分割" :value="2" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="摘要描述" prop="divisionDescript">
          <el-input v-model="data.divisionDescript" type="textarea" :rows="4" placeholder="" />
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
          title: "",
          divisionInfo: "procInst",
          divisionDescript: "",
          creatorRealName: "",
          lastUpdateOperatorId: "",
          divisionValue: "",
          creatorId: "",
          executeTimes: "",
          lastUpdateRealName: "",
          divisionType: "procInstYear",
          lastUpdateTime: "",
          createdTime: "",
          divisionStatus: 0

        },
        formRules: {
          title: [
            { required: true, message: '必填项不能为空' }
          ],
          divisionType: [
            { required: true, message: '必填项不能为空' }
          ],
          divisionValue: [
            { required: true, message: '必填项不能为空' }
          ],
          divisionStatus: [
            { required: true, message: '必填项不能为空' }
          ],
          divisionInfo: [
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
      that.formAction = formAction;
      that.isReadOnly = formAction == FUI.FormAction.View;
      if (formAction == FUI.FormAction.Add) {
        const currUser = FUI.Sys.getAuthor();
        that.data.creatorId = currUser.userId;
        that.data.creatorRealName = decodeURI(currUser.realName);
        that.data.createdTime = Object.toGetCurrentDateTimeString();
        that.data.lastUpdateTime = Object.toGetCurrentDateTimeString();
        that.data.lastUpdateRealName = decodeURI(currUser.realName);
      }
      that.loadData();
    },
    methods: {
      closeEdit() {
        FUI.Window.closeEdit();
      },
      generalTitle() {
        var that = this;
        if(that.data.divisionValue==''){
          FUI.Window.showMsg("请先选择切割年份");
          return false;
        }
        that.data.title = "按【" + that.data.divisionValue + "】年切割流程实例数据";
      }
      , loadData() {
        var that = this;
        if (formAction != FUI.FormAction.Add) {
          FUI.Form.bindDataToForm(that, "/workflow/security/dataDivision/", "getModel", keyId, null, mainTable);
        }
      },
      submitForm() {
        var that = this;
        var success = that.validateForm('formRef');
        if (!success) return;
        FUI.Form.submitForm(that, that.data, "/workflow/security/dataDivision/", "saveModel", formAction, keyId, parentGridId, mainTable);
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