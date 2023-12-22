
<template>
  <div class="test">
    <div v-if="type === 1">是否收到发票原件?</div>
    <div v-if="type === 2">异常已交罚款?</div>
    <div v-if="type === 1">
      <el-radio v-model="radio" label="1">是</el-radio>
      <el-radio v-model="radio" label="0">否</el-radio>
    </div>
    <div v-if="type === 2">
      <el-radio v-model="radio" label="1">已交</el-radio>
      <el-radio v-model="radio" label="2">未交</el-radio>
    </div>
    <div v-if="type === 3">
      <el-upload
        style="marigin: 0; padding: 0"
        ref="upload"
        :multiple="false"
        :show-file-list="true"
        accept=".xls,.xlsx"
        action="#"
        :on-preview="handlePreview"
        :on-remove="handleRemove"
        :before-remove="beforeRemove"
        :on-exceed="handleExceed"
        :on-change="onChange"
        :file-list="fileList"
        :limit="1"
        :auto-upload="false"
      >
        <el-button type="primary">导入文件</el-button>
      </el-upload>

      <div>
        <el-button type="primary" @click="downloadExcelTemplate"
          >下载模板</el-button
        >
      </div>
    </div>
    <div class="dialogfooter">
      <el-button
        v-if="type === 1 || type === 2"
        size="small"
        type="primary"
        @click="submitForm()"
        ><i class="fa fa-save" />确认
      </el-button>
      <el-button v-if="type === 3" id="btn_cancel" type="primary" size="small" @click="setUpload"
        ><i class="fa fa-minus-circle" />确定上传
      </el-button>

      <el-button id="btn_cancel" size="small" @click="closeEdit"
        ><i class="fa fa-minus-circle" />取消
      </el-button>
    </div>
  </div>
</template>

<script>
import {
  updateInvicoedInfo,
  updateInvicoedError,
  importExcel,
  importExcelConfirm,
} from "@/Api/financialManagement/claimExpense";
export default {
  data() {
    return {
      type: undefined,
      radio: "",
      ids: [],
      fileList: [],
      data: {}
    }
  },
  mounted() {},
  created() {
    var that = this;
    var parms = decodeURI(that.$route.query.parms);
    var obj = JSON.parse(parms);
    console.log(obj);
    that.type = obj.type;
    that.ids = obj.ids;
    var author = that.$store.state.user.author;
    var f2bpmToken = author.token;
    this.headers = { f2bpmToken: f2bpmToken };
    let type = Object.toQueryString("type") || "";
    let tableName = Object.toQueryString("tableName") || "";
    that.data.type = type;
    that.data.tableName = tableName;
    window.myvm = that;
  },
  methods: {
    handleRemove() { },
    //关闭弹窗
    closeEdit() {
      FUI.Window.closeEdit(false);
    },
    handlePreview(file) {
      console.log(file);
    },
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${
          files.length + fileList.length
        } 个文件`
      );
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },
    // 选取完文件触发事件
    onChange(a, fileList) {
      this.fileList = fileList;
    },

    setUpload() {
      //确认上传

      var _this = this;
      //如果没有选择文件则不允许点击,并给出提示选择文件后点击上传按钮
      if (_this.fileList == "") {
        this.$notify.info({
          title: "消息",
          message: "请先选择 [浏览文件] 后在点击上传!",
        });
      } else {
        //创建formData对象
        var param = new FormData();
        //将文件append到formData对象
        param.append("file", _this.fileList[0].raw);
        var data = new FormData();
        data.append("fileUpload", _this.fileList[0].raw);

        data.append("type", "customDataGrid");
        data.append("tableName", "ct_BPM_ModifyInvoiceCollection");

        importExcel(param).then((res) => {
          if (res.code === 200) {
            importExcelConfirm(data).then((resuluts) => {
              FUI.Window.showMsg(resuluts.msg);
              setTimeout(function () {
                FUI.Window.closeEdit(true);
              }, 1000);
            });
          }else if(res.msg === '一次最多导入500条数据'){
           FUI.Window.showMsg(res.msg)
          }  else {
            var str = ''
            if(res.data){
              res.data.forEach(x => {
                x.invoiceNo = x.invoiceNo + ','
                str += (x.invoiceNo)
              })
              str = `此发票号码${str}不存在`
            }else{
              str = '数据重复'  
            }
          this.$confirm(`${str},是否继续导入?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          cancelButtonClass:'btn-cancel',
          customClass:'del-model',
          type: 'warning'
        }).then(() => {
           importExcelConfirm(data).then((resuluts) => {
              setTimeout(function () {
                FUI.Window.closeEdit(true);
              }, 1000);
            });
        
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消导入'
          });          
        });
          }
        });
      }
    },

    //提交
    async submitForm() {
      var that = this;
      if (that.radio && that.type == 1) {
        var data = {
          invoiceIds: that.ids,
          haveReceivedOriginalInvoice: that.radio,
        };
        const res = await updateInvicoedInfo(JSON.stringify(data)); 
        if (res.code === 200) {
          FUI.Window.showMsg(`更新成功${that.ids.length}条数据`);
          setTimeout(function () {
            FUI.Window.closeEdit(true);
          }, 1000);
        } else {
          FUI.Window.showMsg(res.msg);
        }
      }
      if (that.radio && that.type == 2) {
        var result = {
          invoiceIds: that.ids,
          abnormalFinePaid: that.radio,
        };
        const res = await updateInvicoedError(JSON.stringify(result));
        if (res.code === 200) {
          FUI.Window.showMsg(`更新成功${that.ids.length}条数据`);
          this.$emit('change',10)
          setTimeout(function () {
            // FUI.Window.closeEdit(true);
          }, 1000);
        } else {
          FUI.Window.showMsg(res.msg);
        }
      }
    },
    //下载模板
    downloadExcelTemplate() {
      let downUrl = "/workflow/security/CommonImport/";
      Object.toAjaxDownloadFile(downUrl, "downloadExcelFiles", {
        type: "customDataGrid",
        tableName: "ct_BPM_ModifyInvoiceCollection",
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.test {
  width: 100%;
  div {
    margin: 20px;
    font-size: 14px;
  }
}

</style>

<style lang='scss'>
  .el-message-box.del-model  {
    width: 500px !important;
    word-wrap: break-word;
    .el-message-box__message p{
        width: 440px;
        height: 240px;
        overflow-y: scroll;
    }
}

.btn-cancel{
  float: right !important;
  margin-left: 10px !important;
}

</style>