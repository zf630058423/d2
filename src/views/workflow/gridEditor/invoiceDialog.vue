<template>
  <div class="test">
    <el-form label-width="120px" ref="formRef" :model="data" :rules="formRules">
      <div class="projectInfo">
        <div class="formData">
          <el-row :gutter="24" align="middle">
            <el-col>
              <el-form-item label="项目编号：" prop="projectNo">
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
                        'BPM_XiangMuBianHao_4419',
                        'ct_bpm_projectfiles',
                        800,
                        500,
                        0
                      )
                    "
                    icon="el-icon-search"
                  ></el-button>
                </el-input>
              </el-form-item>
              <el-form-item label="支出合同编号:">
                <el-input
                  v-model="data.expenditureContractNo"
                  disabled
                  style="width: 80%"
                >
                  <el-button
                    slot="append"
                    @click="
                      openCustomDialog2(
                        '',
                        '发票信息支出合同',
                        'BPM_expenditurecontract_3597',
                        'v_expenditurecontract',
                        800,
                        500,
                        0
                      )
                    "
                    icon="el-icon-search"
                  ></el-button>
                </el-input>
              </el-form-item>
              <el-form-item label="认领金额(含税):">
                <el-input
                  v-model="data.amountClaimedTax"
                  style="width: 80%"
                  :disabled="data.invoiceIds.length > 1"
                  placeholder="单张发票认领可用"
                >
                </el-input>
              </el-form-item>
              <el-form-item label="发票业务类型:" prop="invoiceBizType">
                <el-select v-model="data.invoiceBizType" placeholder="请选择" style="width: 80%">
                  <el-option v-for="item in options" :key="item.ConfigValue" :label="item.ConfigName" :value="item.ConfigValue">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="销售类项目:" prop="isSaleItem" :rules=" (isVaild === true) ? formRules.isSaleItem : [{required: false}]">
                <el-radio-group v-model="data.isSaleItem" :disabled="!isVaild">
                  <el-radio :label="1">是</el-radio>
                  <el-radio :label="0">否</el-radio>
                </el-radio-group>
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
import { getMonkeyById } from "../../../Api/financialManagement/claimExpense";
export default {
  data() {
    return {
      isReadOnly: false,
      tableData: [],
      invoiceAmount:null, //列表开票金额
      data: {
        projectId: "", //项目id
        invoiceIds: [], //发票信息采集列表id
        projectNo: "", //项目编号
        invoiceBizType: "", //发票业务类型
        expenditureContractNo: "", //支出合同编号
        amountClaimedTax: "", //认领金额(含税)(元)
        expenditureContractId: "", //支出合同Id
        expenditureContractName: "", //支出合同名称
        contractAmount: "", //合同金额(含税)(元)
        contractClaimAmount: "", //合同已认领金额(含税)(元)
        isSaleItem:''
      },
      options: [],
      formRules: {
        projectNo: [
          { required: true, message: "请选择项目名称", trigger: "change" },
        ],
         invoiceBizType: [
          { required: true, message: "请选择发票业务类型", trigger: "change" },
        ],
        isSaleItem:[{
          required: true, message: "请选择销售类项目", trigger: "change"
        }]
      },
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
    that.data.invoiceIds = obj.ids
    that.invoiceAmount = that.sum(obj.invoiceAmountList)
    let data = {
    searchtext:'发票业务类型',
    searchfields:'ConfigType,ConfigName', 
    ConfigType:'发票业务类型',
    ConfigName:'',
    ConfigValue:'',
    IsEnable:'',
    ConfigKey:'',
    ParentConfigKey:'',
    OrderNo:'',
    Flag:'',
    page:1,
    rows:20,
    sort:'',
    order:'',
    }
    let url = `/workflow/fuiFramework/getViewTableListData/?deforder=asc&defsort=ConfigType&viewTable=f2bpm_sys_DataDict&dataSource=&configTableName=&isEnableAuthor=0&defaultWhere=`
    $.extendAjax(url, data,'post', function(d) {
    that.options = d.rows
  },'application/x-www-form-urlencoded');
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
      var multi = radioMultiple == "1";
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
        callBack: function (data) {
          console.log(data);
          //自定义回调函数不是必须的，可删除
          that.data.projectNo = data[0].ProjectNo;
          that.data.projectId = data[0].MyId;
          that.getContraType(that.data.projectId)
        },
      });
    },
    openCustomDialog2(id, name, code, ObjName, width, height, radioMultiple) {
      var that = this;
      var multi = radioMultiple == "1";
      CustomDialog(that, {
        customDialog: code,
        isTest: false,
        width: width,
        height: height,
        isMulti: multi,
        data: [
          {
            field: "expenditureContractNo",
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
          console.log(data, 123);
          getMonkeyById(data[0].MyId).then((res) => {
            if (res) {
              that.data.contractClaimAmount = res;
            }
          });
          //自定义回调函数不是必须的，可删除
          that.data.expenditureContractNo = data[0].BillNo;
          that.data.expenditureContractId = data[0].MyId;
          that.data.contractAmount = data[0].ContractAmount;
          that.data.expenditureContractName = data[0].Contract;
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
      if (
        that.data.contractClaimAmount &&
        that.data.contractAmount && !that.data.amountClaimedTax
      ) {
        var total1 = that.invoiceAmount + Number(that.data.contractClaimAmount)
        var total = Object.toDecimal(total1, 2)
        if (
         total >
          that.data.contractAmount
        ) {
          FUI.Window.showMsg2(
            `该合同${that.data.expenditureContractNo}认领金额已超合同金额，请先走合同增补或结算再认领`
          );
          return false;
        }
      }
      if (
        that.data.amountClaimedTax &&
        that.data.contractClaimAmount &&
        that.data.contractAmount
      ) {
        var a =  Number(that.data.amountClaimedTax) +  Number(that.data.contractClaimAmount)
        var b = Object.toDecimal(a, 2)
        if (b > that.data.contractAmount) {
          FUI.Window.showMsg2(
            `该合同${that.data.expenditureContractNo}认领金额已超合同金额，请先走合同增补或结算再认领`
          );
          return false;
        }
      }
      that.$refs.formRef.validate((valid) => {
        if (valid) {
          $.extendAjax(
            "/extend/financialadministration/invoicecollection/InvoiceCollectionAddDetail",
            JSON.stringify(that.data),
            "post",
            function (res) {
              if (res.code === 200) {
                FUI.Window.showMsg(
                  `认领成功${that.data.invoiceIds.length}条数据`
                );
                setTimeout(function () {
                  FUI.Window.closeEdit(true);
                }, 1000);
              } else {
                FUI.Window.showMsg2(res.msg);
              }
            }
          );
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    sum(arr) {
        var sum = 0;
        for (var i = 0; i < arr.length; i++) {
          sum += arr[i];
        }
        return sum;
      },
    //获取是否是建安合同
    getContraType(id){
      var that = this;
      $.extendAjax(`/takeAContract/querySaleItemByProjectId?projectId=${id}`, '', "get", function (d) {
        if(d.code){
          that.isVaild = d.data;
        }
      });
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
