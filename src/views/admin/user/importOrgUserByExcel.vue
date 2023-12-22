<template>
  <div>
    <el-form ref="formRef" :model="data" class="f2bpm-editform" label-width="120px">
      <el-form-item label="上传模板">
        <el-upload :fileList="attachmentList" ref="upload" name="fileUpload" :limit="1" :headers="headers" :action="postUrl" :multiple="false" :data="data" accept=".xlsx" :before-upload="beforeUpload" :on-success="onSuccess" :auto-upload="false" :on-error="onError">
          <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
          <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">确定上传
          </el-button>
          <div slot="tip" class="el-upload__tip">只能上传用户导入Excel模板</div>
        </el-upload>
      </el-form-item>
      <el-form-item label="用户初始登录密码">
        <el-input v-model="data.initailPwd" size="mini" style="width: 200px;" placeholder="导入用户时设置的初始登录密码" />
        <span class="font10 ml4">仅对新增时有效</span>
      </el-form-item>
      <el-form-item label="">
        <span v-html="message"></span>
      </el-form-item>
      <div style="line-height: 25px;font-size: 14px;padding-left: 30px; ">
        <el-tooltip class="item" effect="dark" content="新增导入用户、组织、角色，如果系统中组织或角色不存在则会自动创建; 如果账号已存在，则会进行复盖更新。<br>导入只做增量式导入。 此功能一般用于初始化时的批量导入。" placement="right">
          <i class="el-icon-question">说明</i>新增导入用户、组织、角色，如果系统中组织或角色不存在则会自动创建; 如果账号已存在，则会进行复盖更新。
        </el-tooltip>
      </div>
      <div style="line-height: 25px;font-size: 14px;padding-left: 30px; ">
        <em>下载一体化导入模板：</em><span class="cur blue" @click="dowloadTemplate">用户组织角色一体化导入模板.xlsx</span> <br>
      </div>
      <div class="dialogfooter">
        <el-button id="btn_cancel" size="small" @click="closeEdit"><i class="fa fa-minus-circle" />关闭
        </el-button>
      </div>
    </el-form>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        attachmentList: [],
        postUrl: __serverpath + '/admin/user/saveImportUsers',
        headers: {},
        message: "",
        data: {
          excelType: 'myexcel',
          initailPwd: 'd123'
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
        that.message = response.msg;
        if (response.success) {
          FUI.Window.showMsg2(this, response.msg, null, 1, function () {
            FUI.Window.closeEdit(true);
          });
        } else {
          that.attachmentList = [];
          FUI.Window.showMsg(that, '导入失败' +response.msg, null, null, function () {
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
      , dowloadTemplate() {
        var downUrl = '/admin/user/downloadTemplateFile';
        Object.toAjaxDownloadFile(downUrl, "", {
          "templateName": "UserOrgImportTemplate.xlsx",
          "fileName": "用户组织角色一体化导入模板.xlsx"
        });
      }
    }
  }
</script>