<template>
  <list-search-form @handelIsOpen="handelIsOpen" @search="searchFn" @reset="resetFn">
    <template slot="form">
      <el-form ref="sDataFrom" :model="formDataPop" label-width="130px" inline label-suffix="：">
        <row-layout :cols="3" cell="1-1-1">
          <el-form-item label="发票号码" slot="col_1" prop="invoiceNo">
             <text-input v-model="formDataPop.invoiceNo" :placeholder="msgTip.ENTER_PLACEHOLDER" clearable></text-input>
          </el-form-item>
          <el-form-item label="销售方" slot="col_2" prop="sellerName">
             <text-input v-model="formDataPop.sellerName" :placeholder="msgTip.ENTER_PLACEHOLDER" clearable></text-input>
          </el-form-item>
          <el-form-item label="购方" slot="col_3" prop="buyersName">
             <text-input v-model="formDataPop.buyersName" :placeholder="msgTip.ENTER_PLACEHOLDER" clearable></text-input>
          </el-form-item>
        </row-layout>
        <row-layout :cols="3">
          <el-form-item label="发票状态" slot="col_1" prop="invoiceState">
             <el-select v-model="formDataPop.invoiceState" :placeholder="msgTip.SELECT_PLACEHOLDER" clearable>
               <el-option :label="item.ConfigName" :value="item.ConfigValue" :key="item.ConfigValue" v-for="item in selectData.invoiceStatusArray"></el-option>
             </el-select>
          </el-form-item>
          <el-form-item label="发票类型" slot="col_2" prop="invoiceType">
            <el-select v-model="formDataPop.invoiceType" :placeholder="msgTip.SELECT_PLACEHOLDER" clearable>
               <el-option :label="item.ConfigName" :value="item.ConfigValue" :key="item.ConfigValue" v-for="item in selectData.invoiceTypeArray"></el-option>
             </el-select>
          </el-form-item>
          <el-form-item label="开票日期" slot="col_3" prop="makeInvoiceDate">
             <el-date-picker size="small" style="width: cac(100% - 122px)" v-model="invoiceCreateTimeArray" type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd HH:mm:ss" :default-time="['00:00:00', '23:59:59']"></el-date-picker>
          </el-form-item>
        </row-layout>
        <div v-if="isOpen">
          <row-layout :cols="3">
            <el-form-item :label="'货物或应税劳务、服务名称'" slot="col_1" prop="nameGoodsTaxableService" class="fold-label">
              <text-input v-model="formDataPop.nameGoodsTaxableService" :placeholder="msgTip.ENTER_PLACEHOLDER" clearable></text-input>
            </el-form-item>
            <el-form-item label="认领项目编号" slot="col_2" prop="projectNo">
              <text-input v-model="formDataPop.projectNo" :placeholder="msgTip.ENTER_PLACEHOLDER" clearable></text-input>
            </el-form-item>
            <el-form-item label="认领项目名称" slot="col_3" prop="projectName">
              <text-input v-model="formDataPop.projectName" :placeholder="msgTip.ENTER_PLACEHOLDER" clearable></text-input>
            </el-form-item>
          </row-layout>
          <row-layout :cols="3">
            <el-form-item label="发票错误类型" slot="col_1" prop="typeInvoiceError">
              <el-select v-model="formDataPop.typeInvoiceError" :placeholder="msgTip.SELECT_PLACEHOLDER" clearable>
                <el-option :label="item.ConfigName" :value="item.ConfigValue" :key="item.ConfigValue" v-for="item in selectData.invoiceErrorTypeArray"></el-option>
              </el-select>
              </el-form-item>
            <el-form-item label="支出合同编号" slot="col_2" prop="contractNo">
              <text-input v-model="formDataPop.contractNo" :placeholder="msgTip.ENTER_PLACEHOLDER" clearable></text-input>
              </el-form-item>
            <el-form-item label="支出合同名称" slot="col_3" prop="contractName">
              <text-input v-model="formDataPop.contractName" :placeholder="msgTip.ENTER_PLACEHOLDER" clearable></text-input>
            </el-form-item>
          </row-layout>
          <row-layout :cols="3">
            <el-form-item label="发票有错误类型" slot="col_1" prop="isHaveTypeInvoiceError">
              <el-select v-model="formDataPop.isHaveTypeInvoiceError" :placeholder="msgTip.SELECT_PLACEHOLDER" clearable>
                <el-option :label="item.ConfigName" :value="item.ConfigValue" :key="item.ConfigValue" v-for="item in selectData.isHaveInvoiceErrorTypeArray"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="是否红票" slot="col_2" prop="whetherRedTicket">
              <el-select v-model="formDataPop.whetherRedTicket" :placeholder="msgTip.SELECT_PLACEHOLDER" clearable>
                <el-option :label="item.ConfigName" :value="item.ConfigValue" :key="item.ConfigValue" v-for="item in selectData.isRedTicketArray"></el-option>
              </el-select>
              </el-form-item>
            <el-form-item label="发票金额(含税)(元)" slot="col_3" prop="contractOutMainName">
              <!-- <text-input v-model="formDataPop.contractOutMainName" :placeholder="msgTip.ENTER_PLACEHOLDER" clearable></text-input> -->
              <amount-interval :inputStart="formDataPop.invoiceAmountStart" :inputEnd="formDataPop.invoiceAmountEnd" @change="invoiceAmountChange"></amount-interval>
            </el-form-item>
          </row-layout>
          <row-layout :cols="3">
            <el-form-item label="收票人" slot="col_1" prop="receiveTickets">
              <text-input v-model="formDataPop.receiveTickets" :placeholder="msgTip.ENTER_PLACEHOLDER" clearable></text-input>
            </el-form-item> 
            <el-form-item label="是否收到发票原件" slot="col_2" prop="haveReceivedOriginalInvoice">
              <el-select v-model="formDataPop.haveReceivedOriginalInvoice" :placeholder="msgTip.SELECT_PLACEHOLDER" clearable>
                <el-option :label="item.ConfigName" :value="item.ConfigValue" :key="item.ConfigValue" v-for="item in selectData.haveReceivedOriginalInvoice"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="收票时间" slot="col_3" prop="ticketTime">
              <el-date-picker size="small" style="width: cac(100% - 122px)" v-model="ticketTimeArray" type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd HH:mm:ss" :default-time="['00:00:00', '23:59:59']"></el-date-picker>
            </el-form-item>
          </row-layout>
          <row-layout :cols="3">
            <el-form-item label="发票认领人" slot="col_1" prop="personClaimingInvoice">
              <text-input v-model="formDataPop.personClaimingInvoice" :placeholder="msgTip.ENTER_PLACEHOLDER" clearable></text-input>
            </el-form-item>
            <el-form-item label="认领状态" slot="col_2" prop="claimStatus">
              <el-select v-model="formDataPop.claimStatus" :placeholder="msgTip.SELECT_PLACEHOLDER" clearable>
                <el-option :label="item.ConfigName" :value="item.ConfigValue" :key="item.ConfigValue" v-for="item in selectData.claimStatusArray"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="认领时间" slot="col_3" prop="claimTime">
              <el-date-picker size="small" style="width: cac(100% - 122px)" v-model="claimTimeArray" type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd HH:mm:ss" :default-time="['00:00:00', '23:59:59']"></el-date-picker>
            </el-form-item>
          </row-layout>
          <row-layout :cols="3">
            <el-form-item label="复核人" slot="col_1" prop="reviewOne">
              <text-input v-model="formDataPop.reviewOne" :placeholder="msgTip.ENTER_PLACEHOLDER" clearable></text-input>
              </el-form-item>
            <el-form-item label="复核状态" slot="col_2" prop="review">
              <el-select v-model="formDataPop.review" :placeholder="msgTip.SELECT_PLACEHOLDER" clearable>
                <el-option :label="item.ConfigName" :value="item.ConfigValue" :key="item.ConfigValue" v-for="item in selectData.reviewStatusArray"></el-option>
              </el-select>
              </el-form-item>
            <el-form-item label="复核时间" slot="col_3" prop="checkTimeTime">
              <el-date-picker size="small" style="width: cac(100% - 122px)" v-model="checkTimeTimeArray" type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd HH:mm:ss" :default-time="['00:00:00', '23:59:59']"></el-date-picker>
            </el-form-item>
          </row-layout>
          <row-layout :cols="3">
            <el-form-item label="对应蓝字发票号码" slot="col_1" prop="blueFontInvoiceNo">
              <text-input v-model="formDataPop.blueFontInvoiceNo" :placeholder="msgTip.ENTER_PLACEHOLDER" clearable></text-input>
            </el-form-item>
            <el-form-item label="发票业务类型" slot="col_2" prop="invoiceBizType">
              <!-- <text-input v-model="formDataPop.invoiceBizType" :placeholder="msgTip.ENTER_PLACEHOLDER"></text-input> -->
              <el-select v-model="formDataPop.invoiceBizType" :placeholder="msgTip.SELECT_PLACEHOLDER" clearable>
                <el-option :label="item.ConfigName" :value="item.ConfigValue" :key="item.ConfigValue" v-for="item in selectData.invoiceBizTypeArray"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="进项转出期间" slot="col_3" prop="periodOutputTime">
              <!-- <text-input v-model="formDataPop.periodOutputTime" :placeholder="msgTip.ENTER_PLACEHOLDER"></text-input> -->
              <el-date-picker size="small" style="width: cac(100% - 122px)" v-model="periodOutputTimeArray" type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd HH:mm:ss" :default-time="['00:00:00', '23:59:59']"></el-date-picker>
            </el-form-item>
          </row-layout>
          <row-layout :cols="3">
            <el-form-item label="是否勾选" slot="col_1" prop="checkWhether">
              <el-radio-group v-model="formDataPop.checkWhether">
                <el-radio :label="1">是</el-radio>
                <el-radio :label="0">否</el-radio>
              </el-radio-group>
              <!-- <text-input v-model="formDataPop.checkWhether" :placeholder="msgTip.ENTER_PLACEHOLDER" clearable></text-input> -->
            </el-form-item>
            <el-form-item label="编制人" slot="col_2" prop="createName">
              <text-input v-model="formDataPop.createName" :placeholder="msgTip.ENTER_PLACEHOLDER" clearable></text-input>
            </el-form-item>
            <el-form-item label="编制时间" slot="col_3" prop="createTime">
              <el-date-picker size="small" style="width: cac(100% - 122px)" v-model="createTimeArray" type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd HH:mm:ss" :default-time="['00:00:00', '23:59:59']" @change="clearChange"></el-date-picker>
            </el-form-item>
          </row-layout> 
          <row-layout :cols="3">
            <el-form-item label="是否推费用预提单" slot="col_1" prop="accrualExpenseStatus">
              <!-- <text-input v-model="formDataPop.accrualExpenseStatus" :placeholder="msgTip.ENTER_PLACEHOLDER" clearable></text-input> -->
              <el-select v-model="formDataPop.accrualExpenseStatus" :placeholder="msgTip.SELECT_PLACEHOLDER" clearable>
                <el-option :label="item.ConfigName" :value="item.ConfigValue" :key="item.ConfigValue" v-for="item in selectData.accrualExpenseArray"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="已申请红字信息表" slot="col_2" prop="applicationRedInformation">
              <!-- <text-input v-model="formDataPop.applicationRedInformation" :placeholder="msgTip.ENTER_PLACEHOLDER" clearable></text-input> -->
              <el-select v-model="formDataPop.applicationRedInformation" :placeholder="msgTip.SELECT_PLACEHOLDER" clearable>
                <el-option :label="item.ConfigName" :value="item.ConfigValue" :key="item.ConfigValue" v-for="item in selectData.applicationRedInformationArray"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="单据编号" slot="col_3" prop="billNo">
              <text-input v-model="formDataPop.billNo" :placeholder="msgTip.ENTER_PLACEHOLDER" clearable></text-input>
            </el-form-item>
          </row-layout>
          <row-layout :cols="3">
            <el-form-item label="发票来源" slot="col_1" prop="sourceInvoice">
              <el-select v-model="formDataPop.sourceInvoice" :placeholder="msgTip.SELECT_PLACEHOLDER" clearable>
                <el-option :label="item.ConfigName" :value="item.ConfigValue" :key="item.ConfigValue" v-for="item in selectData.sourceInvoiceArray"></el-option>
              </el-select>
              <!-- <text-input v-model="formDataPop.sourceInvoice" :placeholder="msgTip.ENTER_PLACEHOLDER" clearable></text-input> -->
            </el-form-item>
            <el-form-item label="发票备注" slot="col_2" prop="noteInvoice">
              <text-input v-model="formDataPop.noteInvoice" :placeholder="msgTip.ENTER_PLACEHOLDER" clearable></text-input>
            </el-form-item>
            <el-form-item label="备注" slot="col_3" prop="memo">
              <text-input v-model="formDataPop.memo" :placeholder="msgTip.ENTER_PLACEHOLDER" clearable></text-input>
            </el-form-item>
          </row-layout>
          <row-layout :cols="3">
            <el-form-item label="付款单据编号" slot="col_1" prop="paymentDocumentNumber">
              <text-input v-model="formDataPop.paymentDocumentNumber" :placeholder="msgTip.ENTER_PLACEHOLDER" clearable></text-input>
            </el-form-item>
            <el-form-item label="税率" slot="col_2" prop="taxRate">
              <text-input v-model="formDataPop.taxRate" :placeholder="msgTip.ENTER_PLACEHOLDER" clearable></text-input>
            </el-form-item>
            <el-form-item slot="col_3"></el-form-item>
          </row-layout>
        </div>
      </el-form>
    </template>
  </list-search-form>
</template>

<script>
// 发票信息采集搜索条件
import RowLayout from '@/components/basic/fromLayout/rowLayout.vue';
import RuleRequired from '@/views/enum/requiredMsg';
import ListSearchForm from '@/components/basic/fromLayout/listSearchForm.vue';
import TextInput from '@/components/basic/elInput/textInput.vue';
import AmountInterval from '@/components/basic/elInput/amountInterval';
import Formater from './invoice.js';

export default {
  components: {
    RowLayout,
    ListSearchForm,
    TextInput,
    AmountInterval
  },
  props: {
    formData: {
      type: Object,
      default: () => { }
    },
    dataDictArray: {
      type: Array,
      default: () => []
    }
  },
  watch: {
    dataDictArray: {
      handler(newData, newVal) { 
        if (newData) { 
          //发票状态
          this.selectData.invoiceStatusArray = this.curSelectArray(newData,'发票状态');
          //发票类型
          this.selectData.invoiceTypeArray = this.curSelectArray(newData,'发票类型');
          //发票错误类型
          this.selectData.invoiceErrorTypeArray = this.curSelectArray(newData, '发票错误类型');
          //发票有错误类型
          this.selectData.isHaveInvoiceErrorTypeArray = this.curSelectArray(newData, '发票有错误类型');
          //是否红票
          this.selectData.isRedTicketArray = this.curSelectArray(newData, '是否红票');
          //是否收到发票原件
          this.selectData.haveReceivedOriginalInvoice = this.curSelectArray(newData, '是否收到发票原件');
          //认领状态
          this.selectData.claimStatusArray = this.curSelectArray(newData, '认领状态');
          //复核状态
          this.selectData.reviewStatusArray = this.curSelectArray(newData, '复核状态');
          //发票业务类型
          this.selectData.invoiceBizTypeArray = this.curSelectArray(newData, '发票业务类型');
          //是否推费用预提单
          this.selectData.accrualExpenseArray = this.curSelectArray(newData, '是否推费用预提单');
          //已申请红字信息表
          this.selectData.applicationRedInformationArray = this.curSelectArray(newData, '已申请红字信息表');
          //发票来源
          this.selectData.sourceInvoiceArray = this.curSelectArray(newData, '发票来源');
        }
      },
      deep: true,
      immediate: true
    }
  },
  data() { 
    return {
      msgTip: RuleRequired.tipMsg,
      formDataPop: this.formData,   // 处理父子组件渲染报错问题
      selectData: {
        invoiceStatusArray: [],  //发票状态
        invoiceTypeArray: [],  //发票类型
        invoiceErrorTypeArray: [],  //发票错误类型 单选
        isHaveInvoiceErrorTypeArray: [],  //发票有错误类型 单选
        isRedTicketArray: [],  //是否红票
        haveReceivedOriginalInvoice: [],  //是否收到发票原件
        claimStatusArray: [],  //认领状态
        reviewStatusArray: [],  //复核状态
        invoiceBizTypeArray: [],  //发票业务类型
        checkWhetherArray: [],  //是否勾选
        accrualExpenseArray: [], ///是否推费用预提单
        applicationRedInformationArray: [],//已申请红字信息表
        sourceInvoiceArray:[]  //发票来源
      },
      isOpen: false,
      invoiceCreateTimeArray: Formater.defaultDate(),  //开票日期
      ticketTimeArray: [],  //收票时间
      claimTimeArray: [],  //认领时间
      checkTimeTimeArray: [], //复核时间
      periodOutputTimeArray: [],  //进项转出期间
      createTimeArray:[],  //编制时间
    }
  },
  methods: {
    curSelectArray(arr, name) {
      return name ? arr.filter(item => item.ConfigType === name) : [];
    },
    handelIsOpen() {
      this.isOpen = !this.isOpen;
    },
    searchFn() {
      const dataForm = this.dataFormFormater();
      this.$emit('search', dataForm);
    },
    invoiceAmountChange(amountStart, amountEnd) { 
      this.formDataPop.invoiceAmountStart = amountStart;
      this.formDataPop.invoiceAmountEnd = amountEnd;
    },
    dataFormFormater() { 
      const dataForm = Formater.dateFormater(this);
      return dataForm;
    },
    resetFn() { 
      this.formDataPop = {};
      this.invoiceCreateTimeArray = [],  //开票日期
      this.ticketTimeArray = [],  //收票时间
      this.claimTimeArray = [],  //认领时间
      this.checkTimeTimeArray = [], //复核时间
      this.periodOutputTimeArray = [],  //进项转出期间
      this.createTimeArray = [],  //编制时间
      this.$emit('search',this.formDataPop);
    },
    clearChange(value) {
      if (!value) { 
        this.$nextTick(() => { 
          this.createTimeArray = [];
        })
      }
     }
  }
}
</script>

<style lang="scss" scoped>
@import '../../style/form.scss';
@import "../../style/searchForm.scss";

.el-form-item {
  margin-bottom: 0px;
}

::v-deep .fold-label .el-form-item__label{
  line-height: 18px;
}

::v-deep .form-layout-row{
  margin: 3px 8px;
}
</style>