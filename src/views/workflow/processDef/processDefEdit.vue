<template>
  <el-form ref="formRef" size="small" :rules="formRules" :model="data" class="f2bpm-editform" label-width="120px">
    <!-- <el-form-item label="流程定义分类" prop="categoryCode">
      <treeselect v-model="data.categoryCode" :defaultExpandLevel='2' :multiple="false" placeholder="请选择分类" :options="treeData" />
    </el-form-item> -->
    <el-form-item label="流程名称" prop="workflowName">
      <el-input v-model="data.workflowName" placeholder="" />
    </el-form-item>
    <el-row>
      <el-col :span="12">
        <el-form-item label="流程版本号" prop="version">
          <el-input v-model="data.version" placeholder="" type="number" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="是否主版本" prop="isCurrent">
          <el-switch v-model="data.isCurrent" active-color="#87DC48" inactive-color="#DEDEDE" />
        </el-form-item>
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="12">
        <el-form-item label="流程定义Key">
          {{ data.workflowKey }}
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="流程类型">
          <span class="font12" v-html="procInfoTypeFormatter(data.procInfoType)"></span>   
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        <el-form-item label="创建时间">
          {{ data.createdTime }}
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="最后更新时间">
          {{ data.lastModTime }}
        </el-form-item>
      </el-col>
    </el-row>

    <el-form-item label="备注说明" prop="remark">
      <el-input v-model="data.remark" type="textarea" :rows="4" placeholder="备注说明" />
    </el-form-item>

    <div class="dialogfooter">
      <el-button v-if="formAction!='View'" size="small" type="primary" @click="submitForm()"><i class="fa fa-save" />保存
      </el-button>
      <el-button id="btn_cancel" size="small" @click="closeEdit"><i class="fa fa-minus-circle" />取消
      </el-button>
    </div>
  </el-form>
</template>

<script>
  export default {
    data() {
      return {
        formAction: '',
        keyId: '',
        treeData: [],
        data: { workflowName: '' },
        // stand:表单校验规则
        formRules: {
          isCurrent: [
            { required: true, message: '不能为空', type: 'boolean' }
          ],
          workflowName: [
            { required: true, message: '流程名称不能为空' },
            { type: 'string', min: 2, message: '长度不能小于2' }
          ],
          version: [
            { required: true, message: '版本号不能为空', type: 'number' }
          ]
        }
      };
    },
    created: function () {
      var that = this;
      that.formAction = formAction;
      that.keyId = keyId;
      that.loadTreeSelect();
      that.loadData();
    },
    methods: {
      loadTreeSelect() {
        var that = this;
        var treeUrl = FUI.Handlers.CategoryHandler + '?groupKey=WorkflowGroup&needRoot=false';
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
        if (that.formAction != FUI.FormAction.Add) {
          var data = Object.toAjaxJson(FUI.Handlers.WorkflowManageHandler, 'getOneProcessDef', { keyId: that.keyId });
          that.data = data;
        }
      },
      submitForm() {
        var that = this;
        var success = that.validateForm('formRef');
        if (!success) return;
        FUI.Form.submitForm(that, that.data, FUI.Handlers.WorkflowManageHandler, 'saveProcessDef', that.formAction, that.keyId, null);
      },
      validateForm(refFormName) {
        // stand:表单校验
        var success = false;
        this.$refs[refFormName].validate(valid => {
          success = valid;
        });
        return success;
      },
      procInfoTypeFormatter(value) {
        if (value == 'combine') {
          return '<span class="cube bg-gree ">共用流程</span>';
        }
        return '<span class="cube bg-grey ">默认</span>';;
      }
      ,closeEdit() {
        FUI.Window.closeEdit();
      }
    }
  }
</script>