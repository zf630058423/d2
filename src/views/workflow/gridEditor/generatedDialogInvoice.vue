<template>
  <div class="test">
    <el-form label-width="120px" ref="formRef" :model="data" :rules="formRules">
      <div class="projectInfo">
        <div class="formData">
          <el-row :gutter="24" align="middle">
            <el-col>
              <el-form-item
                label="剩余可开票金额(含税)(元)"
                prop="projectNo"
                label-width="148px"
              >
                <el-input
                  v-model="data.projectNo"
                  style="width: 70%; height: 32px"
                  name="testName"
                  :disabled="true"
                >
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </div>

        <div class="projectInfo-centent">
          <div>
            <div class="grid-content bg-purple" style="margin-left: 20px">
              序号
            </div>
          </div>
          <div>
            <div class="grid-content bg-purple" style="margin: 0 45px 0 50px">
              单张开票金额(含税)(元)
            </div>
          </div>
          <div>
            <el-button
              style="margin-left: 65px"
              size="small"
              type="primary"
              @click="addDomain"
              >添加</el-button
            >
          </div>

          <div></div>
        </div>
        <div class="formData">
          <el-form-item
            style="margin-right: 10px"
            v-for="(domain, index) in data.domains"
            :label="index + 1"
            :key="domain.key"
            :prop="'domains.' + index + '.value'"
            :rules="rules"
          >
            <el-input v-model="domain.value" style="width: 70%"></el-input>
            <el-button
              style="margin-left: 10px"
              size="small"
              type="primary"
              @click.prevent="removeDomain(domain)"
              >删除</el-button
            >
          </el-form-item>
        </div>
      </div>
      <div class="dialogfooter">
        <el-button size="small" type="primary" @click="submitForm()"
          ><i class="fa fa-save" />确认
        </el-button>
        <el-button
          id="btn_cancel"
          size="small"
          @click="closeEdit"
          type="primary"
          ><i class="fa fa-minus-circle" />取消
        </el-button>
      </div>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isReadOnly: false,
      tableData: [],
      data: {
        projectNo: "",
        domains: [
          {
            value: undefined,
            key: Date.now(),
          },
        ],
      },
      rules: [
        {
          required: true,
          trigger: "change",
          message: "请输入单张开票金额(含税)(元)",
        },
        {
          pattern:
            /(^-?(?:\d+|\d{1,3}(?:,\d{3})+)(?:.\d{1,2})?$)/,
          message: "请输入正确的格式,可保留两位小数",
        },
      ],

      formRules: {},
      parentId: "",
      id: "",
      type: "",
      arr: [],
      list: [],
      detailsId: [],
      rowData: [],
      sellerName: "",
      sellerType: "",
      number: null,
      myId: "",
    };
  },
  mounted() {},

  created() {
    var that = this;
    // window.myvm指向当前页面vue实例 复制粘贴
    window.myvm = that;
    (window.sum = function sum(arr) {
      var sum = 0;
      for (var i = 0; i < arr.length; i++) {
        sum += arr[i];
      }
      return sum;
    }),
      console.log(window.myvm, 123);
    // window.$urlFormVue指向当前页面vue实例 复制粘贴
    window.$urlFormVue = that;
    var list = JSON.parse(localStorage.getItem('invoiceData'))
    //var list = JSON.parse(myvm.$route.query.parms);
    if (list.length) {
       const arr = list.map((item) => {
         return Number(item.RemainingInvoicAmountTax);
       });
      that.detailsId = list.map((item) => {
        return {
          projectId: item.ProjectID,
          billNo: item.Billno,
        };
      });
       var arr2 = arr;
       that.data.projectNo = window.sum(arr2);
      that.list = list;
      that.list.forEach((item) => {
        item.invoiceAmountTaxFree = item.invoiceApplicAmountTaxFree;
      });
      that.sellerName = list[0].Seller;
      that.myId = list[0].MyId;
    } else {
      that.data.projectNo = list.RemainingInvoicAmountTax;
      that.list.invoiceAmountTaxFree = list.invoiceApplicAmountTaxFree
      that.detailsId.push({ projectId: list.ProjectID, billNo: list.Billno });
      that.list.push(list);
      that.sellerName = list.Seller;
      that.myId = list.MyId;
    }
    $.extendAjax(
      `/makeoutinvoice/queryDetailList`,
      JSON.stringify(that.detailsId),
      "post",
      function (res) {
        const data = res;
        that.rowData = data.data;
        if (data.code == 200) {
          console.log(111);
          //window.parent.location.reload();
        } else {
          FUI.Window.showMsg2(data.msg);
          return false;
        }
      }
    );
    $.extendAjax(
      `/applicationmakeoutinvoice/queryBalance?seller=${that.sellerName}`,
      "",
      "get",
      function (res) {
        console.log(res);
        if (res.data) {
          that.sellerType = res.data;
        }
      }
    );
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
    //关闭弹窗
    closeEdit() {
      this.$refs.formRef.resetFields();
      FUI.Window.closeEdit();
    },

    //提交
    submitForm() {
      var that = this;
      var numList = [];
      that.data.domains.forEach((item) => {
        numList.push(Number(item.value));
      });

      let str1;
      if (that.list.length) {
        that.list.forEach((val) => {
          for (let key in val) {
            str1 = key.slice(0, 1).toLowerCase();
            val[str1 + key.slice(1)] = val[key];
            delete val[key];
          }
        });
        var moneyList = that.data.domains.map((item) => {
          return Number(item.value);
        });
        that.list.forEach((item) => {
          //item.invoiceAmountTaxFree = that.data.projectNo;
          item.detailList = that.rowData;
          item.invoiceMoneyList = moneyList;
          //item.invoiceAmountTaxFree = item.invoiceApplicAmountTaxFree;
        });
      }
      var data = that.list;
      var res = [];
      if (that.sellerType) {
        if (that.sellerType == "1") {
          that.number = 100;
        }
        if (that.sellerType == "2") {
          that.number = 1000;
        }
        if (that.sellerType == "3") {
          that.number = 10000;
        }
        if (that.sellerType == "4") {
          that.number = 100000;
        }
        if (that.sellerType == "5") {
          that.number = 1000000;
        }
        if (that.sellerType == "6") {
          that.number = 10000000;
        }
        if (that.sellerType == "7") {
          that.number = 100000000;
        }
        that.data.domains.forEach((item) => {
          if (Number(item.value) > that.number) {
            res.push(true);
          }
        });
        if (res && res.length) {
          FUI.Window.showMsg2("销售方开票限额,单张开票金额应小于开票限额");
          return false;
        }
      }
      if (sum(numList) > that.data.projectNo) {
        FUI.Window.showMsg2("单张开票金额合计不能超过可开票金额");
        return false;
      }

      if (sum(numList) <= that.data.projectNo && numList.length > 1  || sum(numList) < that.data.projectNo && numList.length === 1 ) {
        if (that.rowData.length) {
          that.rowData.forEach((item) => {  
            item.num = "";
            item.money = "";
            item.tax = "";
            item.noTaxMoney = "";
          });
           that.list.forEach((x) => {
            x.tax = "";
            x.invoiceApplicAmountTaxFree = "";
            x.invoiceAmountTaxFree = "";
           
          });
        }
      }
      
      that.$refs.formRef.validate((valid) => {
        if (valid) {
          $.extendAjax(
            `/makeoutinvoice/addMakeOutInvoice`,
            JSON.stringify(data),
            "post",
            function (res) {
              const data = res;
              if (data.code == 200) {
                FUI.Window.closeEdit(true);
                //window.parent.location.reload();
              } else {
                FUI.Window.showMsg2(data.msg);
              }
            }
          );
        }
      });
    },
    addDomain() {
      this.data.domains.push({
        value: "",
        key: Date.now(),
      });
    },
    //删除
    removeDomain(item) {
      console.log(item);
      var index = this.data.domains.indexOf(item);
      if (index !== -1) {
        this.data.domains.splice(index, 1);
      }
    },
    sum(arr) {
      var s = 0;
      for (var i = arr.length - 1; i >= 0; i--) {
        s += arr[i];
      }
      return s;
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
    cursor: pointer;
    margin-bottom: 10px;
    padding: 5px;
    background-color: #fff;
    .formData {
      padding: 10px 0;
    }
    .projectInfo-centent {
      margin-left: 15px;
      background-color: #e6e6e6;
      height: 40px;
      line-height: 40px;
      border-radius: 15px;
      display: flex;
      align-items: center;
      justify-content: space-around;
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
<style >
.test .el-input__inner {
  -webkit-appearance: none;
  background-color: #fff;
  background-image: none;
  border-radius: 4px;
  border: 1px solid #dcdfe6;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  color: #606266;
  display: inline-block;
  font-size: inherit;
  height: 32px;
  line-height: 32px;
  outline: 0;
  padding: 0 15px;
  -webkit-transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
  transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
  width: 100%;
}
</style>