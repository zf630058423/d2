<template>
  <el-dialog
    :title="title"
    fullscreen
    :visible.sync="visible"
    :before-close="handleClose">
    <div class="flow-form">
      <el-form class="class wf-box-section-title" :model="dataForm" ref="dataForm" :rules="dataRule" label-suffix="：" label-width="142px">
        <row-layout title="认领信息" :cols="4">
           <el-form-item slot="col_1" label="认领项目编号" prop="claimCode">
             <select-dialog :disabled="true" :isLinkBtn="true" :btnDisabled="false" :width="800" :modelData="claimCodeModel" :height="360" :placeholder="msgTip.AUTO_PLACEHOLDER" :value="dataForm.claimCode" @updateValue="claimCodeChange" dynamicModel="customDialog"></select-dialog>
           </el-form-item>
           <el-form-item slot="col_2" label="认领支出类合同编号" prop="claimConstructCode">
            <!-- <select-dialog :disabled="true" :isLinkBtn="true" :btnDisabled="false" :width="800" :modelData="claimConstructCodeModel" :height="360" :placeholder="msgTip.AUTO_PLACEHOLDER" :value="dataForm.claimConstructCode" @updateValue="claimConstructCodeChange" dynamicModel="customDialog"></select-dialog> -->
           </el-form-item>
           <el-form-item slot="col_3" label="认领发票业务类型" prop="invoiceBizType">
            <el-select v-model="dataForm.invoiceBizType" placeholder="请输入">
              <el-option :label="item.configName" :value="item.configValue" :key="item.configValue" v-for="item in invoiceBizTypeArray">{{ item.configName }}</el-option>
            </el-select>
           </el-form-item>
           <el-form-item slot="col_4" label="销售类项目" prop="isSaleItem">
            <el-radio-group v-model="dataForm.isSaleItem">
              <el-radio :label="'1'" :key="'1'" :name="'是'">是</el-radio>
              <el-radio :label="'0'" :key="'0'" :name="'否'">否</el-radio>
            </el-radio-group>
           </el-form-item>
        </row-layout>
        <row-layout title="发票信息"></row-layout>
        <row-layout :cols="4" cell="4">
          <el-form-item slot="col_1" label-width="0">
            <div class="invoice-btns">
              <el-button type="primary" size="small" @click="addRow">新增</el-button>
              <el-button type="danger" size="small" @click="delRows">批量删除</el-button>
            </div>
            <el-table :data="tableList" @selection-change="invoiceSelectionChange" ref="invoiceInfoRef">
              <el-table-column prop="selection" type="selection" width="45"></el-table-column>
              <el-table-column prop="index" width="55" :align="alignCenter" label="序号">
                <template slot-scope="scope">
                  <span>{{ scope.row.index }}</span>
                </template>
              </el-table-column>
              <el-table-column label="发票号码" prop="invoiceNo">
                <template slot-scope="scope">
                 <text-input v-model="scope.row.invoiceNo" disabled></text-input>
                </template>
              </el-table-column>
              <el-table-column label="发票代码" prop="invoiceCode">
                <template slot-scope="scope">
                 <text-input v-model="scope.row.invoiceCode" disabled></text-input>
                </template>
              </el-table-column>
              <el-table-column label="销售方名称" prop="sellerName">
                <template slot-scope="scope">
                 <text-input v-model="scope.row.sellerName" disabled></text-input>
                </template>
              </el-table-column>
              <el-table-column label="发票金额(含税)" prop="invoiceAmountTax">
                <template slot-scope="scope">
                 <amount-input v-model="scope.row.invoiceAmountTax" disabled></amount-input>
                </template>
              </el-table-column>
              <el-table-column label="税额" prop="tax">
                <template slot-scope="scope">
                 <amount-input v-model="scope.row.tax" disabled></amount-input>
                </template>
              </el-table-column>
              <el-table-column label="认领项目编号" prop="constructArchiveMainCode" width="190">
                <template slot-scope="scope">
                 <select-dialog :disabled="true" :btnDisabled="false" :width="800" :modelData="projectCodeMode" :height="360" :value="scope.row.constructArchiveMainCode" @updateValue="constructArchiveMainCodeChange($event, scope.row)" dynamicModel="customDialog"></select-dialog>
                </template>
              </el-table-column>
              <el-table-column label="认领支出类合同编号" prop="contractOutMainCode" width="190">
                <template slot-scope="scope">
                 <select-dialog :disabled="true" :btnDisabled="false" :width="800" :modelData="claimConstructCodeModel" :height="360" :placeholder="msgTip.AUTO_PLACEHOLDER" :value="scope.row.contractOutMainCode" @updateValue="contractOutMainCodeChange($event, scope.row)" dynamicModel="customDialog"></select-dialog>
                </template>
              </el-table-column>
              <el-table-column label="认领发票业务类型" prop="invoiceBizType">
                <template slot-scope="scope">
                  <el-select v-model="scope.row.invoiceBizType" placeholder="请输入">
                    <el-option :label="item.configName" :value="item.configValue" :key="item.configValue" v-for="item in invoiceBizTypeArray">{{ item.configName }}</el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column label="销售类项目" prop="isSaleItem">
                <template slot-scope="scope">
                  <el-radio-group v-model="scope.row.isSaleItem">
                    <el-radio :label="'1'" :key="'1'" :name="'是'">是</el-radio>
                    <el-radio :label="'0'" :key="'0'" :name="'否'">否</el-radio>
                  </el-radio-group>
                </template>
              </el-table-column>
              <el-table-column label="认领金额(含税)" prop="claimAmountTax">
                <template slot-scope="scope">
                 <amount-input v-model="scope.row.claimAmountTax" @change="claimAmountTaxChange($event, scope.row)"></amount-input>
                </template>
              </el-table-column>
              <el-table-column label="认领税额(元)" prop="claimTaxAmount" width="120">
                <template slot-scope="scope">
                 <amount-input v-model="scope.row.claimTaxAmount" disabled></amount-input>
                </template>
              </el-table-column>
              <el-table-column label="操作" align="center">
                <template slot-scope="scope">
                  <span class="copy-oper" @click="copyRow(scope.row)">复制</span>
                  <span class="del-oper" @click="delRow(scope.row)">删除</span>
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
        </row-layout>
        
      </el-form>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" size="small" @click="invoiceInfoClick">确认</el-button>
      <el-button size="small" @click="handleClose">取消</el-button>
    </div>

    <!-- 自定义对话框 -->
    <!-- <pop-table-dialog :visible.sync="popVisible" ref="tableDialogRef" :dialogParams="dialogParams"  @updateValue="updateStockMaterialValue" :btnDisabled="false"></pop-table-dialog> -->
  </el-dialog>
</template>

<script>
import RowLayout from '@/components/basic/fromLayout/rowLayout.vue';
import RuleRequired from '@/views/enum/requiredMsg';
import TextInput from '@/components/basic/elInput/textInput.vue';
import AmountInput from '@/components/basic/elInput/amountInput.vue';
// import SelectDialog from '@/components/workflow/selector/selectorDialog.vue';
// import PopTableDialog from '@/components/workflow/customDialog/popTableDialog.vue';
// import { getDataDictByConfigType } from '@/Api/dataDict';
// import businessTreeVue from '../../marketBusinessUnitMain/components/businessTree.vue';
// import { queryInvoiceClaimInfoApi, invoiceConfirmBatchClaimApi } from '@/Api/invoice/invoiceApplyApi';

import myFun from '@/utils/fun';

const requiredFileds = ['claimCode','invoiceBizType'];

export default {
  name: 'invoiceClaimPop',
  components: {
    RowLayout,
    // SelectDialog,
    TextInput,
    AmountInput,
    // PopTableDialog
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: '批量发票信息认领'
    }
  },
  data() { 
    return {
      dialogVisible: false,
      popVisible: false,
      msgTip: RuleRequired.tipMsg,
      alignCenter:'center',
      tableList:[],
      dataForm: {
        claimCode: '',  //认领项目编号
        claimConstructCode: '',  //认领合同编号
        invoiceBizType: '',//认领发票业务类型
        isSaleItem:'',  //销售类项目 1：是 0：否
      },
      invoiceBizTypeArray: [],  //认领发票业务类型
      projectCodeMode: {
        code: 'RenLingXiangMuBianHao',
        parm: {
          isEnableAuthor: 0,
          data: [],
          isMulti: false
        }
      },
      claimCodeModel: {
        code:'RenLingXiangMuBianHao',
        parm: {
          isEnableAuthor: 0,
          data: [],
          isMulti: false
        }    
      },
      claimConstructCodeModel: {
        code: 'QiTaZhiChuHeTong',
        isSetHead: 1,
        isMulti: false,
        initailData: []
      },
      dialogParams: {
        // apiUrl: '/invoice/invoiceCollectionMain/queryFinancePayoutInvoiceControl', // 接口
        apiUrl: '/invoice/invoiceCollectionMain/queryClaimInvoiceControl', // 接口
        searchParams: [{
          property: 'invoiceCode',
          label: '发票代码',
          value: '',
          isSearch: true
        },
          {
            property: 'sellerName',
            label: '销售方',
            value: '',
            isSearch: true
          }
        //   {
        //   property: 'constructArchiveMainId',
        //   value: '',
        // },{
        //   property: 'contractSupplierId',
        //   value: '',
        // },{
        //   property: 'purchaseContractId',
        //   value: '',
        //   }
        ], // 请求参数
        isMulti: false, //是否多选  businessTreeVue
        columns: [
          { property:'buyerName',label:'购方名称' },
          { property: 'invoiceCode', label: '发票代码' },
          { property: 'invoiceNo', label:'发票号码'},
          { property:'invoiceStatus',label:'发票状态', dict:'发票状态'},
          { property: 'invoiceType', label: '发票类型',dict:'发票类型' },
          { property: 'sellerName', label:'销售方名称'}
        ], // 字段
      },
      dataRule: RuleRequired.dataRule(requiredFileds),
      selectRows:[],   //列表选中的数据
    }
  },
  created() { 
    // this.getDataDictByConfigType();
  },
  methods: {
    //新增发票信息
    addRow() {
      this.$refs['dataForm'].validate(valid => { 
        if (valid) { 
          this.popVisible = true;
          this.$refs.tableDialogRef.search();
        }
      })
    },
    //确认提交
    invoiceInfoClick() { 
      let _this = this;
      let projectStatus = this.tableList.length > 0 ? this.tableList.every(item => item.constructArchiveMainCode) : false;
      if (!projectStatus) { 
        const indexTemp = this.tableList.filter(item => !item.constructArchiveMainCode).map(item => item.index).join('、');
        this.$message.error(`第${indexTemp}行认领项目编号不能为空`);
        return false;
      }
      _this.$refs['dataForm'].validate(valid => { 
        if (valid) { 
          // _this.invoiceConfirmBatchClaimData();
        }
      })
    },
    //确认认领接口
    async invoiceConfirmBatchClaimData() {
      const { code } = await invoiceConfirmBatchClaimApi(this.tableList);
      if (code === 200) { 
        this.$message.success("批量认领成功");
        this.dataForm = {};
        this.tableList = [];
        this.$emit('clamiSuccess')
      }
    },
    //认领金额(含税 )输入完后 =认领金额(含税)(元)/发票金额(含税)(元) *主表税额
    claimAmountTaxChange(e,row) { 
      console.log("认领金额===:", e,row);  //claimTaxAmount: 认领税额
      const invoiceAmountTax = row.invoiceAmountTax;  //发票金额含税
      const tax = row.tax;  //主表税额
      if (e && invoiceAmountTax && tax) { 
        let multi = myFun.getNumDiv(e.toString(), invoiceAmountTax.toString());
        let claimAmount = myFun.getNumMulti(multi.toString(), tax.toString());  //认领金额
        this.tableList.find(el => el.index === row.index).claimTaxAmount = claimAmount;
      }
    },
    //认领项目编号
    constructArchiveMainCodeChange(data, row) {
      if (data && data.length > 0) { 
        this.tableList.find(el => el.index === row.index).constructArchiveMainCode = data[0].code;
        this.tableList.find(el => el.index === row.index).constructArchiveMainId = data[0].id;  //获取项目id
      }
    },
    //认领支出合同类编号
    claimConstructCodeChange(data) {
      if (data && data.length > 0) { 
        this.dataForm.claimConstructCode = data[0].code;
      }
    },
    //发票信息列表 认领支出类合同编号
    contractOutMainCodeChange(data, row) {
      if (data && data.length > 0) { 
        this.tableList.find(el => el.index === row.index).contractOutMainCode = data[0].code;
      }
    },
    invoiceSelectionChange(list) {
      this.selectRows = list;
     },
    delRows() { 
      // const ids = this.selectRows.map(el => el.id);
      // this.deletedRows(ids);
      const indexs = this.selectRows.map(el => el.index);
      this.deletedRows(indexs);
    },
    delRow(row) {
      // this.deletedRows([row.id]);
      this.deletedRows([row.index]);
    },
    //复制
    copyRow(row) {
      let obj = JSON.parse(JSON.stringify(row));
      obj.id = null;
      obj.constructArchiveMainCode = null;
      obj.contractOutMainCode = null;
      obj.index = this.tableList.length > 0 ? Math.max(...this.tableList.map(item => item.index)) + 1 : 1;
      this.tableList.push(obj);
      this.tableListSort(this.tableList);
    },
    //删除和批量删除
    deletedRows(indexs) {
      // this.tableList = this.tableList.filter(el => !ids.includes(el.id));
      this.tableList = this.tableList.filter(el => !indexs.includes(el.index));
      this.tableListSort(this.tableList);
    },
    updateStockMaterialValue(list) {
      const idList = (list && list.length > 0) ? list.map(item => item.id) : [];
      // this.queryInvoiceClaimInfoData(idList);
      this.popVisible = false;
    },
    //批量认领 获取发票信息
    async queryInvoiceClaimInfoData(idList) {
      let { data, code } = await queryInvoiceClaimInfoApi(idList);
      if (code === 200) {
        this.tableListSort(data);
      }
    },
    //列表tableList重新排列
    tableListSort(arr) { 
      this.tableList = arr.length > 0 ? arr.map((item, index) => ({
        ...item,
        index: index + 1
      })) : []
    },
   async getDataDictByConfigType() { 
      const configTypes = '发票业务类型';
      const { data, success } = await getDataDictByConfigType({ params: { configTypes: configTypes } });
      if (success) { 
        if (data && data.length > 0) { 
          //获取发票业务类型
          this.invoiceBizTypeArray = data.find(item => item.dataDictType === '发票业务类型')?.dataDict || [];
        }
      }
    },
    handleClose() { 
      this.dataForm = {};
      this.tableList = [];
      this.$emit("update:visible", false)
    },
    claimCodeChange(e) {
      console.log("认领项目编号===:", e);
      this.dataForm.claimCode = e[0].code;
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../style/form.scss';
// @import "../../../style/searchForm.scss";

.invoice-btns{
  text-align: right;
}

 //调整表头高度
  ::v-deep .el-table__header tr,
  .el-table__header th {
    padding: 0;
    height: 35px;
    font-size: 12px;
  }
  //调整表格高度
  ::v-deep .el-table__body tr,
  .el-table__body td {
    padding: 0;
    height: 35px;
    font-size: 12px;
  }

  ::v-deep .el-table .el-table__cell{
    padding:  4px 0;
  }

  ::v-deep .el-input__inner {
    height: 32px;
    line-height: 32px;
  }

  ::v-deep .el-dialog__footer{
    position: absolute;
    width: 100%;
    bottom: 10px;
    text-align: center;
  }

  .dialog-footer{
    position: relative;
    bottom: 10px;
    text-align: center;
  }

  .copy-oper{
    color: #268bff;
    margin-right: 8px;
    cursor: pointer;
  }
</style>