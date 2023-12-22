<template>
  <div>
    <el-form ref="formRef" :model="data" class="f2bpm-editform" label-width="140px">
      <el-form-item label="区域最右列字母">
        <el-select v-model="data.lastColumnABC" size="mini">
          <el-option label="自动识别" value="" />
          <el-option label="B" value="B" />
          <el-option label="C" value="C" />
          <el-option label="D" value="D" />
          <el-option label="E" value="E" />
          <el-option label="F" value="F" />
          <el-option label="G" value="G" />
          <el-option label="H" value="H" />
          <el-option label="I" value="I" />
          <el-option label="J" value="J" />
          <el-option label="K" value="K" />
          <el-option label="L" value="L" />
          <el-option label="M" value="M" />
          <el-option label="N" value="N" />
          <el-option label="O" value="O" />
          <el-option label="P" value="P" />
          <el-option label="Q" value="Q" />
          <el-option label="R" value="R" />
          <el-option label="S" value="S" />
          <el-option label="T" value="T" />
          <el-option label="U" value="U" />
          <el-option label="V" value="V" />
          <el-option label="W" value="W" />
          <el-option label="X" value="X" />
          <el-option label="Y" value="Y" />
          <el-option label="Z" value="Z" />
        </el-select>
      </el-form-item>
      <el-form-item label="表格模板">
        <el-upload ref="upload" name="fileUpload" :limit="1" :headers="headers" :action="postUrl" :multiple="false" :data="data" accept=".xlsx" :before-upload="beforeUpload" :on-success="onSuccess" :auto-upload="false" :on-error="onError">
          <el-button slot="trigger" size="small" type="primary">选取EXCEL文件</el-button>
          <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">确定上传
          </el-button>
        </el-upload>
      </el-form-item>
      <div style="line-height: 25px;font-size: 12px;padding-left: 30px; ">
        <em>导入说明：</em>
        <br>Excel模板文件必须是office2010版及以上;
        <br>Excel模板内容上不允许有公式，函数，宏脚本、控件、组件等，必须是纯文本内容。
        <br>Excel模板导入仅作为辅助手段，具体导入后仍需要进行调整。
        <br>Excel模板中的表格边框线注意要同时设置内边框和外边框。
        <br> <br><span @click="downloadExcelDemo" style="color: blue;margin-top: 30px;cursor: pointer;"><i class="icon icon-Controls-82"></i> 点击下载Excel表格示例模板</span>
      </div>
    </el-form>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        postUrl: __serverpath + FUI.Handlers.SmartFormHandler + 'convertImportExcelToJson',
        headers: {},
        excelJson: "",
        data: {
          lastColumnABC: ''
        }
      };
    },
    created: function () {
      var that = this;
      window.myvm = that;
      var author = that.$store.state.user.author;
      var f2bpmToken = author.token;
      this.headers = { 'f2bpmToken': f2bpmToken };
    },
    methods: {
      submitUpload() {
        /* if (this.data.lastColumnABC == "") {
          FUI.Window.showMsg("请填写表格最右侧列名");
          return false;
        } */
        this.$refs.upload.submit();
      },
      beforeUpload() {
        return true;
      },
      onSuccess(response, file, fileList) {
        var that = this;
        if (response.success) {
          FUI.Window.showMsg2(that, '上传成功', null, 1, function () {
            that.excelJson = response.msg;
            window.parent.onlineExcelImportJson(that.excelJson);
            FUI.Window.closeEdit(false);
          });

        } else {
          FUI.Window.showMsg2(that, '导入失败' + response.msg, null, null, function () {
            window.location.reload();
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
      , downloadExcelDemo() {
        var downUrl =  FUI.Handlers.SmartFormHandler;
        Object.toAjaxDownloadFile(downUrl, "downloadExcelDemoFiles", {
          "templateName": "onlineExcelDemo.zip",
          "fileName": "Excel表格模板示例.zip"
        });
      }
      ,
      getResult() {
        return this.excelJson;
      }
    }
  };

</script>