<template>
  <div>
  <el-form ref="formRef" :model="data" class="f2bpm-editform" label-width="120px">
    <el-form-item label="上传文件">
      <el-upload ref="upload" name="fileUpload" :auto-upload="true" :limit="1" :headers="headers" :action="postUrl" :multiple="false" :data="data" :before-upload="beforeUpload" :on-change="onChange" :on-success="onSuccess" :on-error="onError">
        <el-button slot="trigger" :disabled="isSuccess" size="small" type="primary">选取文件</el-button>
        <el-button v-if="false" style="margin-left: 10px;" size="small" type="success" @click="submitUpload">点击上传
        </el-button>
      </el-upload>
      <el-button v-if="isSuccess" size="small" type="success" @click="cleanUpload">重新上传
      </el-button>
    </el-form-item>
    <div style="line-height: 25px;font-size: 12px;padding-left: 120px; text-align: left;">
      <span class="red" v-html="msg"></span>
    </div>
    <div style="line-height: 25px;font-size: 12px;padding-left: 30px; ">
      <!-- 可以在这里根据不同的类型说不同的说明 -->
      <em>导入说明：</em>
      <br>Excel文件必须是office2010版及以上,只能上传.xlsx文件;
      <br>Excel内容上不允许有公式，函数，宏脚本、控件、组件等，必须是纯文本内容。
      <br> <br><span @click="downloadExcelTemplate" style="color: blue;margin-top: 30px;cursor: pointer;"><i class="icon icon-Controls-82"></i> 点击下载Excel模板</span>
      <br> <span @click="downloadExcelTemplateDemo" style="margin-top: 10px;cursor: pointer;"><i class="icon icon-Controls-82"></i> 下载表单子表导入模板示例</span>
    </div>
    <div class="dialogfooter">
      <el-button id="btn_cancel" v-if="data.type!='subtable'" size="small" @click="closeEdit"><i class="fa fa-minus-circle" />取消
      </el-button>
    </div>
  </el-form>
  <el-dialog
    title="提示"
    :visible.sync="dialogErrorVisible"
    width="65%">
    <div style="display: flex;align-items: center;min-height: 100px;overflow-y: scroll"><span class="el-icon-warning" style="font-size: 25px;color: #F56C6C;padding: 10px"></span><span>{{getMessage}}</span></div>
    <span slot="footer" class="dialog-footer">
    <el-button type="primary" @click="closeDialog">确 定</el-button>
  </span>
  </el-dialog>
  </div>
</template>

<script>
  /**
   * 上传导入组件
   */
  export default {
    data() {
      return {
        //窗口返回给调用者的数据
        resultData: "",
        isSuccess: false,
        dialogErrorVisible: false,
        getMessage: false,
        msg: "",
        postUrl: __serverpath + '/workflow/security/CommonImport/uploadImportExcel',
        headers: {},
        data: {
          //类型：【subtable在线表单子表】、【customDataGrid自定义列表】
          type: '',
          //表实体名或表名
          tableName: ''
        }
      };
    },
    created: function () {
      var that = this;
      var author = that.$store.state.user.author;
      var f2bpmToken = author.token;
      this.headers = { 'f2bpmToken': f2bpmToken };
      let type = Object.toQueryString("type") || "";
      let tableName = Object.toQueryString("tableName") || "";
      that.data.type = type;
      if (tableName === 'InvoiceApplicationDetails') { //如果是开票申请的 申请明细信息 导入
        that.postUrl = __serverpath + '/applicationmakeoutinvoice/importDetailData';
      }
      that.data.tableName = tableName;
      window.myvm = that;
    },
    methods: {
      cleanUpload() {
        var that = this;
        that.isSuccess = false;
        that.msg = "";
        that.resultData = "";
        that.$refs['upload'].clearFiles();
      }
      , submitUpload() {
        this.$refs.upload.submit();
      },
      onChange(e) {
        console.log("change===：",e);
        if (this.data.tableName === 'InvoiceApplicationDetails') { //如果是开票申请的 申请明细信息 导入
          this.data.file = e.raw;
          this.data.fileName = e.name;
        }
        // this.isSuccess = false;
      },
      beforeUpload(e) {
        console.log("上传===：",e);
        var that = this;
        that.isSuccess = false;
        that.msg = "";
        return true;
      },
      onSuccess(response, file, fileList) {
        var that = this;
        if (response.success) {
          that.isSuccess = true;
          if (that.data.type == "subtable") {
            that.msg = response.msg + ",请点击确定导入数据";
            that.resultData = response.data;
          } else if (that.data.type == "customDataGrid") {
            that.msg = response.msg;
            FUI.Window.showMsg(that, that.msg, null, null, function () {
              that.closeEdit(true);
            });
          }
        } else {
          that.isSuccess = false;
         // that.dialogErrorVisible = true;
         // that.getMessage = response.msg;
          FUI.Window.showMsg(that, '导入失败：' + response.msg, null, null, function () {
            that.cleanUpload();
          });
        }
      },
      onError(error, file, fileList) {
        var that = this;
        FUI.Window.showMsg(that, error);
      },
      downloadExcelTemplate() {
        console.log("this.data:",this.data);
        var downUrl = "/workflow/security/CommonImport/";
        // Object.toAjaxDownloadFile2(downUrl, "downloadExcelFiles", {
        //   "type": this.data.type,  //"customDataGrid"
        //   "tableName": this.data.tableName  //"ct_BPM_TeamContract"
        // });
        Object.toAjaxDownloadFile(downUrl, "downloadExcelFiles", {
          "type": this.data.type,  //"customDataGrid"
          "tableName": this.data.tableName  //"ct_BPM_TeamContract"
        });
      }
      , downloadExcelTemplateDemo() {
        var that = this;
        var downUrl = "/workflow/security/CommonImport/";
        Object.toAjaxDownloadFile(downUrl, "downloadExcelFiles", {
          "type": "subtable",
          "tableName": "dxjydetail"
        });
      }
      , getResult() {
        var that = this;
        if (that.isSuccess === true) {
          return that.resultData;
        } else {
          FUI.Window.showMsg(that, "请先上传文件");
          return false;
        }
      }
      , closeEdit() {
        FUI.Window.closeEdit(true);
      },
      closeDialog(){
        this.dialogErrorVisible = false;
        this.getMessage = '';
      }
    }
  };
  window.getResult = function () {
    return myvm.getResult();
  }
</script>
