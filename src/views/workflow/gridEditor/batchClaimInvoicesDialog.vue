<template>
  <div class="batchClaimInvoices" id="batchClaim">
    <div class="projectInfo">
      <div class="title">认领信息</div>
      <div class="formData">
        <el-form label-width="150px" ref="formRef" :model="data" :rules="formRules">
          <el-row :gutter="24" align="middle">
            <el-col :span="6">
              <el-form-item label="认领项目编号：" prop="projectNo">
                <el-input v-model="data.projectNo" placeholder="请选择" disabled name="projectNo" size="small">
                  <el-button size="small" slot="append"
                             @click="openCustomDialog('' ,'项目编号', 'BPM_XiangMuBianHao_4419' ,'ct_bpm_projectfiles',800,500,0)"
                             icon="el-icon-search"></el-button>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="认领支出类合同编号：">
                <el-input v-model="data.expenditureContractNo" placeholder="请选择" disabled size="small">
                  <el-button size="small" slot="append"
                             @click="openCustomDialog2('' ,'发票信息支出合同', 'BPM_expenditurecontract_3597','v_expenditurecontract',800,500,0)"
                             icon="el-icon-search"></el-button>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="认领发票业务类型：" prop="invoiceBizType">
                <el-select v-model="data.invoiceBizType" placeholder="请选择" style="width: 80%" size="small">
                  <el-option v-for="item in ['1','2','3','4','5','6','7']" :key="item" :label="item | invoiceBizTypeFilter"
                             :value="item">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="销售类项目：" prop="isSaleItem" :rules=" (isVaild === true) ? formRules.isSaleItem : [{required: false}]">
                <el-radio-group v-model="data.isSaleItem" size="small" :disabled="!isVaild">
                  <el-radio :label="1">是</el-radio>
                  <el-radio :label="0">否</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </div>
    <div class="tableInfo">
      <div class="title">发票信息</div>
      <div class="formData ">
        <invoice-table ref="invoice" :setFormData="this.data" :isVaild="this.isVaild" @showData="showData" @changeHight="setFormIframeHeight"></invoice-table>
      </div>
    </div>
    <div class="dialogfooter">
      <el-button size="small" type="primary" @click="submitForm">
        <i class="fa fa-save"/>确认
      </el-button>
      <el-button id="btn_cancel" size="small" @click="closeEdit(false)">
        <i class="fa fa-minus-circle"/>取消
      </el-button>
    </div>
  </div>
</template>

<script>
  import invoiceTable from '../../fullDevelopment/batchClaimInvoices/subTable'
  import {getInvoiceInfo,submitInvoiceInfo} from '../../../Api/batchClaimInvoices'
  import { getMonkeyById } from "../../../Api/financialManagement/claimExpense";
  export default {
    name: "batchClaimInvoicesDialog",
    components: {
      invoiceTable
    },
    data() {
      return {
        isReadOnly: false,
        tableData: [],
        invoiceAmount: null, //列表开票金额
        data: {
          projectId: "", //项目id
          projectNo: "", //项目编号
          projectName:'', // 项目名称
          invoiceBizType: "", //发票业务类型
          expenditureContractNo: "", //支出合同编号
          expenditureContractId: "", //支出合同Id
          expenditureContractName: "", //支出合同名称
          isSaleItem:'',
          contractClaimAmount: '', // 合同认领金额
          contractAmount:'' // 合同金额
        },
        options: [],
        subTableData: [],
        parentId: "",
        id: "",
        type: "",
        isVaild: false,
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
      };
    },
    mounted() {
      //获取ifrme dom对象
      var that = this;
      that.iframeDom = parent.parent.document.getElementById("layui-layer-iframe1");
      that.iframeDocument = document.getElementById("batchClaim");
      that.setFormIframeHeight();
      that.getHeight = document.getElementById('app').scrollHeight;
      console.log(that.getHeight,'1234')
      that.iframeDocument.style.height = that.getHeight
    },
    created() {
      var that = this;
      var parms = decodeURI(that.$route.query.parms);
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
      };
      var url = `/workflow/fuiFramework/getViewTableListData/?deforder=asc&defsort=ConfigType&viewTable=f2bpm_sys_DataDict&dataSource=&configTableName=&isEnableAuthor=0&defaultWhere=`
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
           // console.log(data);
            //自定义回调函数不是必须的，可删除
            that.data.projectNo = data[0].ProjectNo;
            that.data.projectId = data[0].MyId;
            that.data.projectName = data[0].ProjectName;
            that.data.expenditureContractNo = '';
            that.data.expenditureContractId = '';
            that.data.expenditureContractName = '';
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
            //自定义回调函数不是必须的，可删除
            that.data.expenditureContractNo = data[0].BillNo;
            that.data.expenditureContractId = data[0].MyId;
            that.data.expenditureContractName = data[0].Contract;
            that.data.contractAmount = data[0].ContractAmount;
            getMonkeyById(data[0].MyId).then((res) => {
              if (res) {
                that.data.contractClaimAmount = res;
              }
            });
          },
        });
      },
      //关闭弹窗
      closeEdit(status) {
        FUI.Window.closeEdit(status);
      },
      // 保存
      submitForm(){
        var that = this;
        that.$refs.formRef.validate((valid) => {
          if (valid) {
            if (that.vaildInvoices() === false) {
              return false
            }
            let data = that.subTableData;

            console.log('保存');
            submitInvoiceInfo(data).then((res) => {
              if (res.code === 200) {
                FUI.Window.showMsg('批量认领成功', "提示", "info", function () {
                  that.closeEdit(true)
                });
              } else {
                FUI.Window.showMsg2(res.msg);
                return false
              }
            
            
            })
          }
        })
      },
      //发票校验
      vaildInvoices(){
        var that = this;
        var oIndex = 0;
        that.$refs.invoice.getTableData();
        if(that.subTableData){
          let data = that.subTableData;
          for(let i in data){
            data[i]['salesItem'] = data[i]['salesItem'] === ''?0: data[i]['salesItem'];
          }
          let arr = [];
          for(let i=0;i<data.length;i++){
            if(data[i]){
              if(!(data[i]['amountClaimedTax']).toString()){
                FUI.Window.showMsg('第'+(i+1)+'行发票信息中，认领金额(含税)(元)不能为空');
                oIndex = 3;
              }
              if(Number(data[i]['amountClaimedTax']) > Number(data[i]['invoiceAmount'])){
                FUI.Window.showMsg('第'+(i+1)+'行发票信息中，认领金额(含税)(元)不能大于发票金额(含税)');
                oIndex = 1;
              }
              // if (data[i]['contractClaimAmount'] && data[i]['contractAmount'] && data[i]['amountClaimedTax']) {
              //   var a =  Number(data[i]['amountClaimedTax']) + Number(data[i]['contractClaimAmount']);
              //   var b = Object.toDecimal(a, 2);
              //   if (b > Number(data[i]['contractAmount'])) {
              //     FUI.Window.showMsg2(
              //       `该合同${data[i]['expenditureContractNo']}认领金额已超合同金额，请先走合同增补或结算再认领`
              //     );
              //     oIndex = 7;
              //   }
              //
              // }


              // 取出所有为 '劳务分包收票' 类型的数据
              if(data[i]['invoiceBizType'] === '3'){
                arr.push(data[i]);
              }
            }


          }
          // 校验 当发票业务类型=劳务分包收票 时，同一个发票只能认领到同一个项目
          if(arr.length > 1){
            var newArr2 = this.classifyArrayGroupBySameFieldAlpha(arr,'invoiceNo');
            for(let n in newArr2){
              if(newArr2[n].data.length > 1){
                let arr2item = newArr2[n].data;
                if(this.isRepeat2(arr2item,'projectId') === false){
                  FUI.Window.showMsg('当发票业务类型=劳务分包收票 时,同一个发票'+newArr2[n].key+',只能认领到同一个项目');
                  oIndex = 4;
                }
              }
            }
          }

          // 校验同一个项目，销售类项目需要相同
          var newArr = this.classifyArrayGroupBySameFieldAlpha(data,'projectNo');
          for(let n in newArr){
            if(newArr[n].data.length > 1){
              let arritem = newArr[n].data;
              if(this.isRepeat2(arritem,'salesItem') === false){
                FUI.Window.showMsg('同一个认领项目'+newArr[n].key+',销售类项目需要相同');
                oIndex = 2;
              }
            }
          }
          // 校验认领金额+历史认领金额不能超过合同金额
          var newArr4 = this.classifyArrayGroupBySameFieldAlpha(data,'expenditureContractNo');
          for(let m in newArr4){
            if(newArr4[m].data.length > 0){
                let arritem = newArr4[m].data;
                let amount1 = 0;
                let amount2 = 0;
                let amount3 = 0;
                for(let n in arritem){
                  if(arritem[n]['expenditureContractNo']){
                     amount1 = arritem[0]['contractClaimAmount']; // 合同认领金额
                     amount2 = arritem[0]['contractAmount']; // 合同金额
                     amount3+= Number(arritem[n]['amountClaimedTax']); // 认领金额
                  }
                }
              if (amount2 && amount3) {
                var val1 =  Number(amount1) + Number(amount2);
                var val2 = Number(Object.toDecimal(val1, 2));
                if (val2-amount3 < 0) {
                  FUI.Window.showMsg(`该合同${arritem[0]['expenditureContractNo']}认领金额已超合同金额，请先走合同增补或结算再认领`);
                  oIndex = 7;
                }

              }
            }

          }

          // 校验 同一个发票认领金额不能超过发票金额 or 发票业务类型需要相同
          if(data.length > 0){
            var newArr3 = this.classifyArrayGroupBySameFieldAlpha(data,'invoiceNo');
            for(let n=0;n<newArr3.length;n++){
              if(newArr3[n].data.length > 0){
                let arr3item = newArr3[n].data;
                let amount1 = arr3item[0]['invoiceAmount']; // 发票金额
                let amount2 = 0;
                for(let i in arr3item){
                  let val = arr3item[i]['amountClaimedTax'];
                  amount2+= Number(val);

                }
                amount2 = Object.tofixed(amount2, 2);
                if(Number(amount2) > Number(amount1)){
                  FUI.Window.showMsg('同一个发票'+newArr3[n].key+',认领金额不能超过发票金额');
                  oIndex = 5;
                }
                if(this.isRepeat2(arr3item,'invoiceBizType') === false){
                  FUI.Window.showMsg('同一个发票'+newArr3[n].key+',发票业务类型需要相同');
                  oIndex = 6;
                }
              }
            }
          }


        }
        if(oIndex > 0){
          return false
        }

      },
      showData(data){
        console.log(data,'1234');
        this.subTableData = data;
      },
      //获取是否是建安合同
      getContraType(id){
        var that = this;
        $.extendAjax(`/takeAContract/querySaleItemByProjectId?projectId=${id}`, '', "get", function (d) {
          if(d.code){
            that.isVaild = d.data;
          }
        });
      },
      isRepeat2(arr,key) {
        var hash = {};
        for(let i=0;i<arr.length;i++){
          if(arr[i]){
            if (!hash[arr[i][key]]) {
              hash[arr[i][key]] = true;
            }
          }
        }
        if(Object.keys(hash).length>1){
          return false
        }else{
          return true
        }
      },
        // 根据关键字段进行分组
       classifyArrayGroupBySameFieldAlpha(arr, filed) {
        let temObj = {};
        for (let i = 0; i < arr.length; i++) {
          let item = arr[i];
          if (!temObj[item[filed]]) {
            temObj[item[filed]] = [item]
          } else {
            temObj[item[filed]].push(item)
          }
        }
        let resArr = [];
        Object.keys(temObj).forEach(key => {
          resArr.push({
            key: key,
            data: temObj[key],
          })
        });
        return resArr
      },
      //动态设置ifrme高度 自适应内容高度
      setFormIframeHeight (){
        this.$nextTick(() => {
          if (this.iframeDom) { 
            this.iframeDom.height = this.iframeDocument.scrollHeight;
            console.log("高度:",this.iframeDom.height)
          }
        })
      },
    },
  }
</script>

<style lang="scss" scoped>
  .batchClaimInvoices {
    background: #FFFFFF;
    .title {
      vertical-align: middle;
      display: flex;
      align-items: center;
      font-size: 12px;
      font-weight: bold;
      color: #0D1126;
      border-bottom: 1px solid #f3f3f3;
      padding: 5px 0;
    }

    .title::before {
      content: "";
      display: inline-block;
      width: 4px;
      height: 20px;
      margin-right: 15px;
      background-color: #006EFF;
    }

    .projectInfo {
      margin-bottom: 10px;
      padding: 5px 10px;
      background-color: #fff;

      .formData {
        padding: 10px 0;
      }
    }
    .tableInfo{
      margin-bottom: 10px;
      padding: 5px 10px;
      background-color: #fff;

      .formData {
        padding: 10px 0;
        /*height: 600px;*/
        /*overflow: auto;*/
      }
    }
  }
</style>
