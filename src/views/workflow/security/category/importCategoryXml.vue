<template>
  <div>
    <el-form ref="formRef" :model="data" class="f2bpm-editform" label-width="120px">
      <el-form-item label="上传Xml文件">
        <el-upload ref="upload" name="fileUpload" :limit="1" :headers="headers" :action="postUrl" :multiple="false" :data="data" accept=".xml" :before-upload="beforeUpload" :on-success="onSuccess" :auto-upload="false" :on-error="onError">
          <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
          <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">确定上传
          </el-button>
          <div slot="tip" class="el-upload__tip">只能上传分类的Xml文件</div>
        </el-upload>
      </el-form-item>
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
        postUrl: __serverpath + '/workflow/security/category/uploadImportCategoryXml',
        headers: {},
        data: {
          deployType: ''
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
          FUI.Window.showMsg(this, response.msg, null, 1, function () {
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