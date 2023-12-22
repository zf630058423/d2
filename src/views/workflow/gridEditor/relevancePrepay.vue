<template>
  <div class="test">
    <el-form label-width="120px" ref="formRef" :model="data" :rules="formRules">
      <div class="projectInfo">
        <div class="formData">
          <el-row :gutter="24" align="middle">
            <el-col>
              <el-form-item label="预缴完税凭证号:" prop="projectNo">
                <el-input
                  v-model="data.projectNo"
                  disabled
                  style="width: 80%"
                  name="testName"
                >
                  <el-button
                    slot="append"
                    @click="
                      openCustomDialog(
                        '',
                        '项目编号',
                        'BPM_YuJiaoWanShuiPingZheng_3180',
                        'ct_bpm_taxpaymentvoucheradvance',
                        800,
                        500,
                        0
                      )
                    "
                    icon="el-icon-search"
                  ></el-button>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </div>
      <div class="dialogfooter">
        <el-button size="small" type="primary" @click="submitForm()"
          ><i class="fa fa-save" />确认
        </el-button>
        <el-button id="btn_cancel" size="small" @click="closeEdit"
          ><i class="fa fa-minus-circle" />取消
        </el-button>
      </div>
    </el-form>
  </div>
</template>

<script>
import { relevancePrepay } from "../../../Api/financialManagement/claimExpense";
export default {
  data() {
    return {

      data: {
        projectNo: null, //预缴完税凭证编号
        taxYaymentVoucherNumberId: null,
        projectId:''
      },
      myId: '',
      formRules: {
        projectNo: [
          { required: true, message: "请选择预缴完税凭证编号", trigger: "change" },
        ],

      },
    };
  },
  mounted() {},

  created() {
    var obj = JSON.parse(localStorage.getItem('invoiceData'))
    console.log(obj,'接收列表传值')
    this.myId = obj[0].MyId;
    this.data.projectId = obj[0].ProjectID;
  },
  methods: {
    // 弹框调用 获取字段绑定
    // id：自定义对话框id
    // name：自定义对话框名称
    // code：自定义对话框别名
    // ObjName：自定义对话框数据对象名称（数据库表名）
    // width：弹框宽度
    // height：弹框高度
    // radioMultiple：是否多选
    openCustomDialog(id, name, code, ObjName, width, height, radioMultiple) {
      var that = this;
      var multi = true;
      CustomDialog(that, {
        customDialog: code,
        isTest: false,
        width: width,
        height: height,
        isMulti: multi,
        data: [
          {
            field: "projectNo",
            property: "ProjectNo",
          },
          {
            field: "projectId",
            property: "MyId",
          },
        ],
        varParams: [
          {
            key: "ProjectId",
            value: that.data.projectId,
          },
        ],
        callBack: function (data) {
          console.log(data);
          var myIds = [];
          var nums = [];
          for(let i in data){
            myIds.push(data[i].MyId);
            nums.push(data[i].TaxPaymentVoucherNumber)
          }
          that.data.projectNo = nums.join() ;
          that.data.taxYaymentVoucherNumberId = myIds.join();
        },
      });
    },
    //关闭弹窗
    closeEdit() {
      FUI.Window.closeEdit();
    },
    //提交
    submitForm() {
      var that = this;
      var data = {
        myId:this.myId,
        taxYaymentVoucherNumber:this.data.projectNo,
        taxYaymentVoucherNumberId:this.data.taxYaymentVoucherNumberId
      }
      that.$refs.formRef.validate( async(valid) => {
        if (valid) {
        const {code } = await relevancePrepay(data)
           if (code === 200) {
                FUI.Window.showMsg(`关联成功1条数据`);
                setTimeout(function () {
                  FUI.Window.closeEdit(true);
                }, 1000);
              } else {
                FUI.Window.showMsg2(res.msg);
              }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
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
