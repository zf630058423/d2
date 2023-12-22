<template>
  <div>
    <el-form ref="formRef" :model="data" class="f2bpm-editform" label-width="120px">
      <el-form-item label="上传附件">
        <el-upload ref="upload" name="fileUpload" :limit="1" :headers="headers" :action="postUrl" :multiple="false" :data="data" :before-upload="beforeUpload" :on-success="onSuccess" :auto-upload="false" :on-error="onError">
          <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
          <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">确定上传
          </el-button>
        </el-upload>
      </el-form-item>
      <el-form-item label="备注">
        <el-input v-model="data.remark" type="textarea" :rows="4" placeholder="备注" />
      </el-form-item>
      <div class="dialogfooter">
        <el-button id="btn_cancel" size="small" @click="closeEdit"><i class="fa fa-minus-circle" />取消
        </el-button>
      </div>
    </el-form>
  </div>
</template>

<script>
  window.WFContext = {};
  export default {
    data() {
      return {
        postUrl: '',
        headers: {},
        data: {
          remark: '',
          activityName: '',
          activityId: ''
        }
      };
    },
    computed: {
      countGridHeight() {
        return $(document).height() - 10;
      }
    },
    created() {
      var that = this;
      that.language =  that.$store.state.app.language;
      var src = '/';
      var bk = Object.toQueryString('bk');
      var activityName = Object.toQueryString('activityName');
      var activityId = Object.toQueryString('activityId');
      that.data.activityName = activityName;
      that.data.activityId = activityId;
      var postUrl = __serverpath + FUI.Handlers.WorkflowBusinessHandler + 'uploadAttachment/?attachmentType=Workflow&bk=' + bk;
      that.postUrl = postUrl;
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
            // 刷新表单中的附件列表
            window.openerWin.myvm.refreshProcessinstfilelist();
            FUI.Window.closeEdit(false);
          });
        } else {
          FUI.Window.showMsg2(that, '上传失败' + response.msg);
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