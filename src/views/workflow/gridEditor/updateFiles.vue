
<template>
  <div class="test">
    <el-row>
    <el-col :span="24" style="padding: 10px">
      <el-col :span="4" style="line-height: 40px;text-align: right"><span class="red">*</span> 上传附件：</el-col>
      <el-col :span="20" style="font-size: 16px;line-height: 25px">
        <upload-file ref="file"   @showFile="showFile" :isReadOnly="isAble"></upload-file>
      </el-col>
    </el-col>
    </el-row>
    <div class="dialogfooter">
      <el-button size="small" type="primary" @click="submitForm()">
        <i class="fa fa-save" />确认
      </el-button>
      <el-button id="btn_cancel" size="small" @click="closeEdit">
        <i class="fa fa-minus-circle" />取消
      </el-button>
    </div>
  </div>
</template>

<script>
  import { updateInvoiceFiles } from "../../../Api/common";
  import uploadFile from '../../fullDevelopment/targetCost/upload_file'
  export default {
    components:{
      uploadFile
    },
    data() {
      return {
        isReadOnly: false,
        tableData: [],
        isAble: true,
        data: {
          fileUpload: [],
          wiid:''
        },
        formRules: {
          subjCode: [
            { required: true, message: "请选择收支项目名称", trigger: "change" },
          ],
        },
        parentId: "",
        id: "",
        type: "",
      };
    },
    mounted() {},

    created() {
      var that = this;
      var parms = decodeURI(that.$route.query.parms);
      var obj = JSON.parse(parms);
      console.log(obj,'12341234');
      that.data.wiid = JSON.parse(obj);
    },
    methods: {
      //关闭弹窗
      closeEdit() {
        FUI.Window.closeEdit();
      },
      //提交
      submitForm() {
        var that = this;
        var fileUpload = that.data.fileUpload;
        var data = that.data;
        if(fileUpload.length === 0){
          FUI.Window.showMsg2('请上传附件');
          return false
        }else{
          // data.fileUpload = JSON.stringify(data.fileUpload);
          console.log(data);
          updateInvoiceFiles(data).then((res) =>{
            if(res.code === 200){
              FUI.Window.showMsg('附件更新成功', "提示", "info", function() {
                that.closeEdit()
              });
            }else{
              FUI.Window.showMsg2(res.msg);
              return false
            }

          })
        }
      },
      getFileData() {
        this.$refs.file.returnData();
      },
      showFile(arr){
        var that = this;
        if(arr){
          that.data.fileUpload = arr;
        }

      }
    },
  };
</script>

<style lang="scss" scoped>
  .test {
    height: 100%;
    overflow-y: scroll;
    .title {
      vertical-align: middle;
      display: flex;
      align-items: center;
      font-size: 16px;
      color: #0099ff;
      border-bottom: 1px solid #f3f3f3;
      padding-bottom: 5px;
    }

    .title::before {
      content: "";
      display: inline-block;
      width: 4px;
      height: 20px;
      margin-right: 5px;
      background-color: #0099ff;
    }

    .projectInfo {
      margin-bottom: 10px;
      padding: 5px;
      background-color: #fff;

      .formData {
        padding: 10px 0;
      }
    }

    .planCenter {
      min-height: 600px;
      background-color: #fff;
      padding: 5px;
      margin-bottom: 10px;

      .formData {
        padding: 10px 0;
      }
    }

    .footer {
      background-color: #fff;
      padding: 5px;
    }
  }
</style>
