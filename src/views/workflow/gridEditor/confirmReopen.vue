<template>
  <div>
    <div class="form">
      <div class="top">
        <div>开票申请单号: {{data[0].Billno}}</div> <div>操作人:{{userName}}</div
        >
         <div>操作时间: {{time}}</div>
      </div>
      <div style="margin: 0 0 100px 20px">
        已操作过对接百望开票,请确认是否继续对接百望操作
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
  </div>
</template>

<script>
import { confirmReopen } from "../../../Api/financialManagement/claimExpense";
export default {
  data() {
    return {
      myId: "",
      data:{},
      userName:"",
      time:""
    };
  },
  created() {
    var obj = JSON.parse(localStorage.getItem('invoiceData'))
    console.log(obj)
    this.myId = obj[0].MyId
    this.data = obj
    console.log(this.myId);
    const currUser = FUI.Sys.getAuthor();
    this.userName = decodeURI(currUser.realName);
    this.time = Object.toGetCurrentDateTimeString();
  },
  methods: {
    closeEdit() {
      FUI.Window.closeEdit();
    },

    async submitForm() {
      const { code } = await confirmReopen(this.myId);
      if (code === 200) {
        FUI.Window.showMsg(`确认重开成功`);
        setTimeout(function () {
          FUI.Window.closeEdit(true);
        }, 1000);
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
  div{
    margin: 10px 0;
  }
}
</style>