<template>
  <div>
    <div class="form" v-if="flag === false">
      <div class="top">
        <div>开票申请单号: {{ data[0].Billno }}</div>
        <div>操作人:{{ userName }}</div>
        <div>操作时间: {{ time }}</div>
      </div>
      <div style="margin: 0 0 20px 20px">
        已操作过对接百望开票,若继续对接百望操作,
      </div>
      <div style="margin: 0 0 80px 20px">
        请先联系税务主管确认重开后再操作百望重开!
      </div>
    </div>
    <div v-if="flag" class="form">
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="140px"
        class="demo-ruleForm"
        style="margin-top: 20px"
      >
        <el-form-item label="百望开票:" prop="name">
          <el-radio v-model="ruleForm.name" label="2">直联开票</el-radio>
          <el-radio v-model="ruleForm.name" label="3">流水单开票</el-radio>
        </el-form-item>

        <el-form-item label="开票申请金额(含税)(元):">
          <el-input
            v-model="ruleForm.delivery"
            style="width: 80%"
            disabled
          ></el-input>
        </el-form-item>
      </el-form>
    </div>
    <div class="dialogfooter2">
      <el-button size="small" type="primary" @click="submitForm()"
        ><i class="fa fa-save" />确认
      </el-button>
      <el-button id="btn_cancel" size="small" @click="closeEdit"
        ><i class="fa fa-minus-circle" />取消
      </el-button>
    </div>
  </div>
</template>

<script>
import { baiwangReopen } from "../../../Api/financialManagement/claimExpense";
export default {
  data() {
    return {
      myId: "",
      data: {},
      userName: "",
      time: "",
      isReopen: "",
      flag:'',
      ruleForm: {
        name: "",
        delivery: "",
      },
      rules: {
        name: [{ required: true, message: "请填写百望开票", trigger: "blur" }],
      },
    };
  },
  created() {
    var obj = JSON.parse(localStorage.getItem("invoiceData"));
    var parms =  JSON.parse(decodeURI(this.$route.query.parms))
    this.flag = parms.flag




    console.log(obj);
    this.myId = obj[0].MyId;
    this.isReopen = obj[0].IsReopen;
    this.data = obj;
    console.log(this.myId);
    const currUser = FUI.Sys.getAuthor();
    this.userName = decodeURI(currUser.realName);
    this.time = Object.toGetCurrentDateTimeString();
    // this.ruleForm.delivery = obj[0].InvoiceApplicationAmountTax;
    this.ruleForm.delivery = obj[0].RemainingInvoicAmountTax;
  },
  methods: {
    closeEdit() {
      FUI.Window.closeEdit();
    },

    submitForm() {
      if (this.flag) {
        this.$refs.ruleForm.validate(async (valid) => {
          if (valid) {
            const { code } = await baiwangReopen(this.myId, this.ruleForm.name);
            if (code === 200) {
              FUI.Window.showMsg(`百望重开成功`);
              setTimeout(function () {
                FUI.Window.closeEdit(true);
              }, 1000);
            }
          }
        });
      }else{
       FUI.Window.closeEdit();
      }
    },
  },
};
</script>
<style scoped lang='scss'>
.form {
  font-size: 14px;
}
.top {
  margin: 20px 0 40px 20px;
  div {
    margin: 10px 0;
  }
}
</style>