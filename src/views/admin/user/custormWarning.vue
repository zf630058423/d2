<template>
  <div>
    <div class="content">客户状态"正常与预警"之间的修改,需填写修改原因。</div>
    <el-form
      :model="data"
      :rules="rules"
      ref="data"
      label-width="130px"
      class="demo-ruleForm"
    >
      <el-form-item label="客户状态修改原因:" prop="reason">
        <el-input
          v-model="data.reason"
          type="textarea"
          :rows="5"
          placeholder="请输入原因"
          style="width: 90%"
        ></el-input>
      </el-form-item>
    </el-form>
     <div class="dialogfooter2">
        <el-button size="small" id="btn_cancel"  @click="closeEdit"><i class="fa fa-save" />取消 
        </el-button>
        <el-button  size="small" type="primary" @click="submitForm('data')"><i class="fa fa-minus-circle" />确认
        </el-button>
      </div>
  </div>
</template>

<script>
import { updateCustormStats } from '@/Api/common'
export default {
  data() {
    return {
      data: {
        reason: "",
      },
      parm:{},
       rules: {
          reason: [
            { required: true, message: '请输入修改原因', trigger: 'change' },
          ],
        }
    };

  },
  created() {
    this.parm = JSON.parse(this.$route.query.parms)
    console.log(JSON.parse(this.$route.query.parms))
  },
  methods: {
    closeEdit() {
      FUI.Window.closeEdit();
    },
    submitForm(formName){
     this.$refs[formName].validate((valid) => {
          if (valid) {
            parent.myvm.data['CustInfoRegMaintainRevise.ModifyReason'] = this.data.reason
             FUI.Window.showMsg(`操作成功`);
        setTimeout(function () {
          FUI.Window.closeEdit(true);
        }, 1000);
           
          } else {
            console.log('error submit!!');
            return false;
          }
        });
    }
  },
};
</script>
<style scoped lang='scss'>
.content {
  font-size: 14px;
  margin: 20px;
}
</style>