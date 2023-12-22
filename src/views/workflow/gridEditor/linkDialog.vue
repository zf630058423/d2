1<template>
  <div class="test">
    <el-form label-width="120px" ref="formRef" :model="data" label-position="top">
      <div class="projectInfo">
        <div class="formData">
              <el-form-item label="外部注册地址:">
                <el-input
                  type="textarea"
                  :autosize="{ minRows: 2, maxRows: 4}"
                  placeholder="请输入内容"
                  readonly
                  v-model="data.linkUrl">
                </el-input>
              </el-form-item>
        </div>
        <div style="padding: 0 10px;color: #909399"><span class="el-icon-info" style="color: #E6A23C"></span> 此链接有效期为 3 天，请尽快使用此链接完成自主注册</div>
      </div>
      <div class="dialogfooter">
        <el-button id="btn_cancel" size="small" @click="closeEdit">
          <i class="fa fa-minus-circle" />取消
        </el-button>
      </div>
    </el-form>
  </div>
</template>

<script>
  // import { getMonkeyById } from "../../../Api/financialManagement/claimExpense";
  export default {
    data() {
      return {
        isReadOnly: false,
        tableData: [],
        invoiceAmount:null, //列表开票金额
        data: {
          linkUrl:''
        },
        options: [],
        parentId: "",
        id: "",
        type: "",
        isVaild: false
      };
    },
    mounted() {},

    created() {
      var that = this;
      var parms = decodeURI(that.$route.query.parms);
      var obj = JSON.parse(parms);
      var origin = window.location.origin;
      console.log(obj);
      var url = origin +'/supplierReg';
      if(obj){
          url = url+'?code='+JSON.parse(obj);
          that.data.linkUrl = url
      }
    },
    methods: {
      //关闭弹窗
      closeEdit() {
        FUI.Window.closeEdit();
      }
    },
  };
</script>

<style lang="scss" scoped>
  .test {
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
      padding: 0;
      background-color: #fff;

      .formData {
        padding:0 10px;
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
