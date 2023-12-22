<template>
  <div class="f2bpm-page-dialog-layout">
    <div>
      <el-form ref="formRef" :model="data" size="small" class="f2bpm-editform" label-width="120px">
        <el-form-item label="上传Xml文件">
          <el-upload
            ref="upload"
            name="fileUpload"
            :limit="1"
            :headers="headers"
            :action="postUrl"
            :multiple="false"
            :data="data"
            accept=".xml"
            :before-upload="beforeUpload"
            :on-success="onSuccess"
            :auto-upload="false"
            :on-error="onError"
          >
            <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
            <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">确定上传
            </el-button>
            <div slot="tip" class="el-upload__tip">只能上传流程定义Xml文件</div>
          </el-upload>
        </el-form-item>
        <!-- <el-form-item label="导入方式">
          <el-select v-model="data.deployType">
            <el-option label="请选择" value=""></el-option>
            <el-option label="新增流程" value="0"></el-option>
            <el-option label="更新修改" value="1"></el-option>
            <el-option label="升级版本" value="2"></el-option>
          </el-select>
        </el-form-item> -->
        <div style="line-height: 25px;font-size: 14px;padding-left: 30px; ">
          <em>说明：</em><br>
          导入后都会成为流程的非主版本
          <br>如果流程应用想使用导入后的流程作为主版本，需导入成功后手动设置。
          <br>
        </div>

        <div class="dialogfooter">
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
        postUrl: __serverpath + '/workflow/processDef/uploadImportWorkflowXmlFile',
        headers: {},
         data: {
          workflowKey: '',
          deployType: '0'
        }
      }
    },
    created: function() {
      var that = this
      var workflowKey = Object.toQueryString('workflowKey') || ''
      that.data.workflowKey = workflowKey
      var author = this.$store.state.user.author
      var f2bpmToken = author.token
      this.headers = { 'f2bpmToken': f2bpmToken }
    },
    methods: {
      submitUpload() {
        this.$refs.upload.submit()
      },
      beforeUpload() {
        return true
      },
       onSuccess(response, file, fileList) {
        var that = this
        if (response.success) {
          FUI.Window.showMsg2(this, response.msg, null, 1, function() {
            FUI.Window.closeEdit(true)
          })
        } else {
          FUI.Window.showMsg2(that, '导入失败' + response.msg)
        }
      },
       onError(error, file, fileList) {
        var that = this
        FUI.Window.showMsg(that, error)
      },
      closeEdit() {
        FUI.Window.closeEdit()
      }
    }
  }
</script>
