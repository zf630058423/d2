<template>
  <div>
    <el-form ref="formRef" :model="data" class="f2bpm-editform importDialogFrom" label-width="120px">
      <el-form-item label="导入方式">
        <el-select v-model="data.deployType" size="mini">
          <el-option label="请选择" value="" />
          <el-option label="原样导入" value="OriAdd" />
          <el-option label="复制导入" value="CopyAdd" />
        </el-select>
      </el-form-item>
      <el-form-item label="上传Xml文件">
        <el-upload ref="upload" name="fileUpload"  :headers="headers" :action="postUrl" :multiple="true" :data="data" accept=".xlsx,.xml" :before-upload="beforeUpload" :on-success="onSuccess" :auto-upload="false" :on-error="onError">
          <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
          <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">确定上传
          </el-button>
          <div slot="tip" class="el-upload__tip">只能上传表单应用xlsx/xml文件</div>
        </el-upload>
      </el-form-item>
      <div style="line-height: 25px;font-size: 12px;padding-left: 30px; ">
        <em>导入方式说明：</em>
        <br>【原样导入】不改变任何ID值原样导入，如果已存在相同的表单设计则导入会失败;可应用于数据迁移中导入。
        <br>【复制导入】则会修改所有ID然后再导入，如果是多租户间导入，<i class="red">导入后需要重新绑定“数据模型”，并且表单模板需要重新生成。</i>
      </div>

      <div class="dialogfooter">
        <el-button id="btn_cancel" size="small" @click="closeEdit"><i class="fa fa-minus-circle" />取消
        </el-button>
      </div>
    </el-form>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        postUrl: __serverpath + FUI.Handlers.WorkflowManageHandler + 'uploadImportProcessFormXml',
        headers: {},
        data: {
          deployType: 'OriAdd'
        }
      };
    },
    created: function () {
      var that = this;
      var author = that.$store.state.user.author;
      var f2bpmToken = author.token;
      this.headers = { 'f2bpmToken': f2bpmToken };
    },
    methods: {
      submitUpload() {
        this.$refs.upload.submit();
      },
      beforeUpload() {
        return true;
      },
      onSuccess(response, file, fileList) {
        var that = this;
        if (response.success) {
          FUI.Window.showMsg2(this, response.msg, null, 1, function () {
            FUI.Window.closeEdit(true);
          });
        } else {
          FUI.Window.showMsg(that, '导入失败' + response.msg, null, null, function () {
            that.$refs.upload.clearFiles();
          });
        }
      },
      onError(error, file, fileList) {
        var that = this;
        FUI.Window.showMsg(that, error);
      },
      closeEdit() {
        FUI.Window.closeEdit();
      }
    }
  }
</script>
<style>

</style>