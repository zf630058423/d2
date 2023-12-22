<template>
  <div class="cost">
    <el-form label-width="120px" ref="formRef" id="formRef" :model="data" :rules="formRules">
      <div class="pageTitle">员工费用报销</div>
      <div class="projectInfo">
        <div class="title">报销信息</div>
        <div class="formData">
          <el-row class="row-bg" :gutter="10">
              <el-col :span="8">
                <div class="grid-content bg-purple">
                  <el-form-item prop="billNo" label="单据编号:">
                    <el-input :style="{ width: '100%' }" placeholder="保存生成" v-model="data.billNo" :disabled="true" ></el-input>
                  </el-form-item>
                </div>
              </el-col>
              <el-col :span="8">
                <div class="grid-content bg-purple">
                  <el-form-item prop="reimbursementObject" label="报销对象:" :rules="formRules.reimbursementObject" >
                    <template>
                      <el-radio v-model="data.reimbursementObject" label="1">对私</el-radio>
                      <el-radio v-model="data.reimbursementObject" label="2">对公</el-radio>
                    </template>
                  </el-form-item>
                </div>
              </el-col>
              <el-col :span="8">
                <div class="grid-content bg-purple">
                  <el-form-item  v-if="data.reimbursementObject == 1"  prop="staff"  label="员工:"  >
                    <el-input :style="{ width: '100%' }" disabled v-model="data.staff" placeholder="请选择员工">
                      <el-button slot="append" icon="el-icon-search" @click="selectStrUsers('staff','staffId',true,'userId')"></el-button></el-input>
                  </el-form-item>

                  <el-form-item  v-else  prop="supplier"  label="供应商:"   >
                    <el-input :style="{ width: '100%' }" v-model="data.supplier" placeholder="请选择供应商">
                      <el-button slot="append" icon="el-icon-search" @click=" openCustomDialog5('3ddedfb0-9b70-47f4-9016-466a4d684ee5' ,'供应商', 'BPM_GongYingShangDangAn_1852' ,'ct_bpm_customerfiles',800,500,0) "></el-button
                    ></el-input>
                  </el-form-item>
                </div>
              </el-col>
          </el-row>
          <el-row class="row-bg" :gutter="10">
              <el-col :span="8">
                <div class="grid-content bg-purple">
                  <el-form-item prop="projectApproval" label="关联立项">
                    <el-radio v-model="data.projectApproval" label="1" >线索登记</el-radio>
                    <el-radio v-model="data.projectApproval" label="2">营销立项</el-radio>
                    <el-radio v-model="data.projectApproval" label="3">无</el-radio>
                  </el-form-item>
                </div>
              </el-col>
              <el-col :span="8">
                <div class="grid-content bg-purple">
                  <el-form-item v-if="data.projectApproval == 1" prop="clueRegistrationNo" :rules="formRules.clueRegistrationNo"  label="线索编号:" >
                    <el-input :style="{ width: '100%' }" v-model="data.clueRegistrationNo" placeholder="请选择线索编号"  >
                      <el-button slot="append" @click="openCustomDialog7('3ddedfb0-9b70-47f4-9016-466a4d684ee5' ,'线索', 'BPM_ClueRegistration_6393' ,'ct_bpm_clueregistration',800,500,0) " icon="el-icon-search"></el-button
                    ></el-input>
                  </el-form-item>

                  <el-form-item v-else-if="data.projectApproval ==2" prop="marketingProjectNo" label="立项编号:" :rules="formRules.marketingProjectNo">
                    <el-input :style="{ width: '100%' }" v-model="data.marketingProjectNo" placeholder="请选择立项编号" >
                      <el-button slot="append" icon="el-icon-search"  @click="openCustomDialog6('3ddedfb0-9b70-47f4-9016-466a4d684ee5' ,'立项编号', 'BPM_MarketingProject_9093' ,'ct_bpm_marketingproject',800,500,0) "></el-button
                    ></el-input>
                  </el-form-item>
                </div>
              </el-col>
              <el-col :span="8">
                <div class="grid-content bg-purple">
                  <el-form-item v-if="data.projectApproval == 1" label="拟跟进项目名称:" :prop="data.planFollowedProject" :rules="formRules.planFollowedProject" >
                    <el-input :style="{ width: '100%' }" v-model="data.planFollowedProject" :disabled="true" placeholder="拟跟进项目名称"></el-input>
                  </el-form-item>

                  <el-form-item v-else-if="data.projectApproval ==2" label="立项名称:">
                    <el-input :style="{ width: '100%' }" v-model="data.marketingProjectName" :disabled="true" placeholder="立项名称"></el-input>
                  </el-form-item>
                </div>
              </el-col>
          </el-row>
  
          <el-row class="row-bg" :gutter="10">
            <el-col :span="8">
              <div class="grid-content bg-purple">
                <el-form-item label="报销金额:">
                  <el-input :style="{ width: '100%' }" v-model="reimbursementAmountTotal" :disabled="true" placeholder="系统计算"></el-input>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="grid-content bg-purple">
                <el-form-item label="付款财务组织:" :prop="data.payOrgId" :rules="formRules.payOrgId">
                  <el-input :style="{ width: '100%' }" :disabled="data.staff ? true :false" v-model="data.payOrg" placeholder="请选择付款财务组织" >
                    <el-button slot="append" icon="el-icon-search" @click="selectStrCollectionOrg('payOrg','payOrgId',true)"></el-button>
                  </el-input>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="grid-content bg-purple">
                <el-form-item label="付款账号：" :prop="data.bankaccSub" :rules="formRules.bankaccSub">
                  <el-input :style="{ width: '100%' }" disabled v-model="data.bankaccSub" placeholder="请选择付款账号" >
                    <el-button slot="append" @click="selectStrCollectionOrg2('bankaccSubId','bankaccSub',true)" icon="el-icon-search"></el-button>
                  </el-input>
                </el-form-item>
              </div>
            </el-col>
          </el-row>
         
          <el-row class="row-bg" :gutter="10">
            <el-col :span="8">
              <div class="grid-content bg-purple">
                <el-form-item prop="checkNo" label="票据号:">
                  <el-input :style="{ width: '100%' }" v-model="data.checkNo"   placeholder="请输入票据号"></el-input>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="grid-content bg-purple">
                <el-form-item prop="payeeBankAcc" label="收款账号:" :prop="data.payeeBankAcc"  :rules="isOnlineBanking ? formRules.payeeBankAcc : [{required: false}]" >
                  <el-input  :style="{ width: '100%' }"  v-model="data.payeeBankAcc" placeholder="请输入收款账号"></el-input>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="grid-content bg-purple">
                <el-form-item label="收款银行："  :prop="data.payeeBank"  :rules="data.bankaccSub ? formRules.payeeBank : [{required: false}]" >
                  <el-input  :style="{ width: '100%' }"  v-model="data.payeeBank" disabled  placeholder="选择收款银行">
                    <el-button slot="append" icon="el-icon-search"  @click="openCustomDialog8('3ddedfb0-9b70-47f4-9016-466a4d684ee5' ,'收款银行', 'BPM_BankBranch_8352' ,'ct_bpm_bankbranch',800,500,0) "></el-button>
                  </el-input>
                </el-form-item>
              </div>
            </el-col>
          </el-row>
       
          <el-row class="row-bg" :gutter="10">
            <el-col :span="8">
              <div class="grid-content bg-purple">
                <el-form-item prop="receivingBankJointNumber" label="收款银行联行号:">
                  <el-input :style="{ width: '100%' }" v-model="data.receivingBankJointNumber" :disabled="true" placeholder="系统带出"></el-input>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="grid-content bg-purple">
                <el-form-item prop="refundAmount" label="退款金额（元）:">
                  <el-input :style="{ width: '100%' }" v-model="data.refundAmount" placeholder="系统反写" :disabled="true" ></el-input>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="grid-content bg-purple">
                <el-form-item prop="paymentStatus" label="付款状态">
                  <el-input :style="{ width: '100%' }" v-model="data.paymentStatus == 1 ? '成功' : ''" :disabled="true"></el-input>
                </el-form-item>
              </div>
            </el-col>
          </el-row>
          <el-row class="row-bg" :gutter="10">
            <el-col :span="24">
              <div class="grid-content bg-purple">
                <el-form-item prop="memo" label="备注:">
                  <el-input :style="{ width: '100%' }" type="textarea" :rows="2" placeholder="请输入内容" v-model="data.memo">
                  </el-input>
                </el-form-item>
              </div>
            </el-col>
          </el-row>          
        </div>
      </div>

      <div class="costInfo">
        <div style="border-bottom: 1px solid #f3f3f3;display:flex;justify-content:space-between;padding-bottom:5px;align-items:center;">
          <div class="title" style="border:none;">报销明细</div>        
        </div>

        <div v-for="(item,index) in data.employeetReimbursementDetails" :key="item.id" class="maintenance-allocation">
          <div class="maintenance-allocation-title">
            <h6>报销明细{{index+1}}</h6>           
            <span v-if="index > 0" @click="isDelete({text :'确定删除报销明细分摊信息'+(index+1)+'?',dialogVisible: true, btnText:['取消','删除'], btnFn:'deleteMoreList',index:index})">删除</span>
          </div>
           <div class="formData">
            <el-row :gutter="24" align="middle">
              <el-col :span="8">
                <el-form-item label="摘要："  :prop="`employeetReimbursementDetails.${index}.remark`" :rules="formRules.remark">
                  <el-input v-model="item.remark" placeholder="输入摘要"></el-input>
                </el-form-item>     
                
                <el-form-item label="发票情况：" :prop="`employeetReimbursementDetails.${index}.invoiceSituation`"  :rules="formRules.invoiceSituation"  >
                  <f2bpmui-select configtype="发票情况"  class="myselect" :field="'invoiceSituation'" :fieldvalue="item.invoiceSituation" v-model="item.invoiceSituation" @updatevalue="updateFieldInvoiceSituationValue(index,arguments)" />
                </el-form-item>

                <el-form-item label="冲借款：" :prop="`employeetReimbursementDetails.${index}.amountBorrowed`"  :rules="formRules.amountBorrowed">
                  <el-input v-model="item.amountBorrowed" placeholder="自动计算" disabled  onkeyup="value=value.replace(/[^\d^\.]/g,'')" >
                    <template slot="prepend">￥</template>
                  </el-input>
                </el-form-item>
              </el-col>
            
              <el-col :span="8">
                <el-form-item label="收支项目：" :prop="`employeetReimbursementDetails.${index}.subjCode`"  :rules="formRules.subjCode"  >
                  <el-input v-model="item.subjCode" placeholder="输入收支项目"  disabled name="subjCode">
                    <el-button slot="append" @click=" openCustomDialog1('3ddedfb0-9b70-47f4-9016-466a4d684ee5' ,'收支项目', 'BPM_BalanceProject_8833' ,'ct_bpm_balanceproject',800,500,0,index) " icon="el-icon-search"></el-button>
                  </el-input> 
                </el-form-item>
                
                <el-form-item label="借款单号：" :prop="`employeetReimbursementDetails.${index}.borrowingFormNo`"  :rules=" (item.balaType=='冲借款') ? formRules.borrowingFormNo : [{required: false}]"   >
                  <el-input v-model="item.borrowingFormNo" placeholder="输入借款单号"  disabled name="borrowingFormNo">
                    <el-button slot="append" @click=" openCustomDialog9('3ddedfb0-9b70-47f4-9016-466a4d684ee5' ,'借款单号', 'BPM_BorrowingForm_1625' ,'ct_bpm_personalloan',800,500,0,index) " icon="el-icon-search"></el-button>
                  </el-input> 
                </el-form-item>   

                <el-form-item label="是否分摊：" :prop="`employeetReimbursementDetails.${index}.whetherOrNotSplit`"  :rules="formRules.whetherOrNotSplit">
                  <el-radio-group v-model="item.whetherOrNotSplit" @change="whetherornotSplitFn($event,index)">
                    <el-radio label="1">是</el-radio>
                    <el-radio label="0">否</el-radio>
                  </el-radio-group>
                </el-form-item>  
              </el-col>
              <el-col :span="8">                
                <el-form-item label="结算方式：" :prop="`employeetReimbursementDetails.${index}.balaType`"  :rules="formRules.balaType">
                  <el-input v-model="item.balaType" placeholder="输入结算方式"  disabled >
                    <el-button slot="append" @click="openCustomDialog('3ddedfb0-9b70-47f4-9016-466a4d684ee5' ,'结算方式', 'BPM_MethodPayment_6063' ,'ct_bpm_methodpayment',800,500,0,index) " icon="el-icon-search"></el-button>
                  </el-input>
                </el-form-item>  

                <el-form-item label="报销金额："  :prop="`employeetReimbursementDetails.${index}.reimbursementAmount`"  :rules="formRules.materialsExpenses" >
                  <el-input v-model="item.reimbursementAmount" placeholder="输入报销金额"   onkeyup="value=value.replace(/[^\d^\.]/g,'')"  @blur="getAddNumber($event,index,'reimbursementAmount')" >
                    <template slot="prepend">￥</template>
                  </el-input>
                </el-form-item>                        
              </el-col>
            </el-row>
           </div>
           <div class="my-table">
              <ul class="table-th" >                
                <li>序号</li>
                <li>分摊部门</li>            
                <li>分摊金额</li>
                <li v-if="!isFormDisabled"><i @click="addTableRow(index)" class="el-icon-circle-plus-outline addicon"></i></li>
              </ul>

              <ul class="table-tr" v-for="(tableItem, i) in item.inputs" :key="tableItem.id+'childer-'+i" >                
                  <li>{{i+1}}</li>      
                  <li>   
                    <el-form-item  style="margin:0" label=" " label-width="10px"  :prop="`employeetReimbursementDetails.${index}.inputs.${i}.shareTheObject`"  :rules="formRules.shareTheObject" >
                      <el-input v-model="tableItem.shareTheObject" placeholder="请输入部门 " :disabled="true" >
                        <el-button slot="append" @click="selectStrCollectionOrg1('shareTheObjectId','shareTheObject',true,[index,i])" icon="el-icon-search"></el-button>
                      </el-input>
                    </el-form-item> 
                  </li>
                  <li>
                    <el-form-item  style="margin:0" label=" " label-width="10px" :prop="`employeetReimbursementDetails.${index}.inputs.${i}.money`" :rules="formRules.tableRowMoney"  >
                      <el-input v-model="tableItem.money" placeholder="请输入分摊金额"   onkeyup="value=value.replace(/[^\d^\.]/g,'')" @blur="getAddTableNumber($event,index,i,'money')">
                        <template slot="prepend">￥</template>
                      </el-input>
                    </el-form-item>
                  </li>
                  <li v-if="!isFormDisabled">
                    <i slot="reference" class="el-icon-remove-outline delicon"  @click="isDelete({text :'确认删除序号'+(i+1)+'分摊项吗？',dialogVisible: true, btnText:['取消','删除'], btnFn:'deleteTableRow',index:index,itemIndex:i})"></i> 
                  </li>
              </ul>
              <div class="total">
                <p v-if=" (item.tableTotal*1) > (item.totalCost*1) ">列表合计金额不能 > 费用合计金额</p>
                <p v-else></p> 
                合计：{{item.tableTotal ? item.tableTotal : '0.00' }}
              </div> 
           </div>
        </div>        

        <div class="contentBtn-box" v-if="!isFormDisabled">  
          <el-button type="primary" size="small" @click="addMoreList">添加明细</el-button>
        </div>  
      </div>


      <div class="projectInfo projectInfo1">
        <div class="title">关联发票 
          <div class="table-btns">
            <el-button size="small" type="primary" icon="el-icon-edit">导入</el-button> 
            <el-button size="small" type="primary" icon="el-icon-share">导出</el-button>
          </div>
        </div>
        <div class="formData">
          <el-table :data="data.associatedInvoiceList" style="width: 100%"  :header-cell-style="{ background:'#efefef'}" :show-summary="true" :summary-method="getSummaries">
            <el-table-column type="index" label="序号" width="30" > </el-table-column>
            <el-table-column align="center"  label="发票号码">
              <template slot-scope="scope">  
               
                <el-form-item  style="margin:0; position: relative;" label=" " label-width="10px" :prop="'associatedInvoiceList.'+scope.$index+'.invoiceNo'" >
                  <span style="    margin-right: 5px; color: rgb(255, 0, 0); position: absolute; left: -14px; top: 0; z-index: 1">*</span>
                  <el-input v-model="scope.row.invoiceNo" disabled placeholder="请选择发票号"  name="invoiceNo">
                    <el-button slot="append" @click="openCustomDialog4('3ddedfb0-9b70-47f4-9016-466a4d684ee5' ,'发票号码', 'BPM_FaPiaoXinXiCaiJi_9754' ,'ct_bpm_invoicecollection',800,500,0,scope.$index)" icon="el-icon-search"></el-button>
                  </el-input>
                </el-form-item>
              </template>
            </el-table-column>

            <el-table-column align="center"  label="发票代码">
              <template slot-scope="scope">  
                <el-form-item  style="margin:0" label=" " label-width="10px">
                  <el-input v-model="scope.row.invoiceCode" disabled placeholder="请输入发票代码" ></el-input>
                </el-form-item>
              </template>
            </el-table-column>

            <el-table-column  align="center" prop="date"  label="开票日期" >               
              <template slot-scope="scope">
                <el-form-item  style="margin:0" label=" " label-width="10px">
                  <el-date-picker v-model="scope.row.paybillDate" disabled  type="date" class="myselect"  value-format="yyyy-MM-dd"  format="yyyy-MM-dd"  placeholder="选择日期"></el-date-picker>
                </el-form-item>
              </template>   
            </el-table-column>
            
            <el-table-column  align="center" prop="date"  label="发票类型" >               
              <template slot-scope="scope">
                <el-form-item  style="margin:0" label=" " label-width="10px">
                  <f2bpmui-select configtype="发票类型" :readOnly="true"  disabled field="invoiceType" class="myselect"  :fieldvalue="scope.row.invoiceType" @updatevalue="updateFieldListValue(scope.$index,arguments)" />
                </el-form-item>
              </template>   
            </el-table-column>             

            <el-table-column align="center"  label="销售方名称">
              <template slot-scope="scope">  
                <el-form-item  style="margin:0" label=" " label-width="10px">
                  <el-input v-model="scope.row.sellerName" disabled placeholder="销售方名称" ></el-input>
                </el-form-item>
              </template>
            </el-table-column>

            <el-table-column align="center" prop="invoiceAmount"  width="120"  label="发票金额（含税）">
              <template slot-scope="scope">  
                <el-form-item  style="margin:0" label=" "  label-width="10px">
                  <el-input v-model="scope.row.invoiceAmount" disabled  placeholder="发票金额（含税）" ></el-input>
                </el-form-item>
              </template>
            </el-table-column>

            <el-table-column align="center"  prop="tax"  width="120"  label="税额">
              <template slot-scope="scope">  
                <el-form-item  style="margin:0" label=" " label-width="10px">
                  <el-input v-model="scope.row.tax" disabled placeholder="税额" ></el-input>
                </el-form-item>
              </template>
            </el-table-column>

            <el-table-column align="center"  prop="invoiceAmountNoTax" width="120" label="占用发票（元）">
              <template slot-scope="scope">  
                <el-form-item  style="margin:0" label=" " disabled label-width="10px">
                  <el-input v-model="scope.row.invoiceAmountNoTax" disabled placeholder="占用发票（元）" ></el-input>
                </el-form-item>
              </template>
            </el-table-column>

            <el-table-column  align="center" label="发票上传">
                <template slot-scope="scope">                    
                    <uploadFile ref="file1" @showFile="showFile1($event, scope.$index)" :isReadOnly="!isFormDisabled" >
                      <template slot="tip" ><span></span></template>
                    </uploadFile>                      
                </template>
            </el-table-column>

            <el-table-column width="40px" v-if="!isFormDisabled"  align="right" label="操作">
              <template slot="header" slot-scope="scope"><i @click="addTableRow1()" class="el-icon-circle-plus-outline addicon"></i></template>
              <template slot-scope="scope"><i   @click="isDelete({text :'确认删除序号'+(scope.$index+1)+'分摊项吗？',dialogVisible: true, btnText:['取消','删除'], btnFn:'deleteTableRow1',index:scope.$index})" class="el-icon-remove-outline delicon"></i></template>
            </el-table-column>
          </el-table>
        </div>
      </div>
                 
      <div class="projectInfo">        
        <div class="title">附件上传</div>
        <div class="formData">
          <div  class="upload-box">          
            <uploadFile ref="file" @showFile="showFile" :isReadOnly="!isFormDisabled">
              <div name="tip"  style="font-size:14px; color:#666; line-height:24px; margin-top: 10px; ">
              <p>允许上传的文件类型：*.doc;*.docx;*.ppt;*.pptx;*.xls;*.xlsx;*.jpg;*.gif;*.png;*.zip;*.rar;*.pdf;*.vsd;*.ppsx;*.dwt;*.dwg;*.dws;*.dxf;*.mp4;*.bmp;*.vsdx每个文件大小不能超过2G；</p>
              <p>文件名称请使用中英文或数字，特殊字符不能作为文件名</p>
            </div>
            </uploadFile>
          </div>
        </div>     
      </div>
      <div class="footer">
        <el-row :gutter="24">
          <el-col :span="8">
            <el-form-item label="编制人：">
              <el-input disabled placeholder="保存生成" v-model="data.createName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="编制人部门：">
              <el-input disabled placeholder="保存生成" v-model="data.createDept"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="编制时间：">
              <el-input disabled placeholder="保存生成" v-model="data.createTime"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
    </el-form>    
  </div>
</template>

<script>
  import uploadFile from '@/views/fullDevelopment/repairRequest/upload_file';
  export default {
    components: {
      uploadFile
    },
    data() {
      const validateNumber = (rule,value,callback) =>{      
        console.log("value1:",value);
        if( value ===undefined || value===null || value ==='' ){          
            callback(new Error('金额不能为空'))
         }else{
          callback();
          // if (!(/^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/).test(value)) {
          //   callback(new Error('请输入数字值'))
          // } else{
          //     // if(value.indexOf(".") != -1 && value.split('.').length > 2){
          //     //   callback(new Error('请输入正确格式的金额')) //防止输入多个小数点
          //     // }else if(value.indexOf(".") != -1 && value.split('.')[1].length > 2){
          //     //   callback(new Error('请输入正确的小数位数')) //小数点后两位
          //     // }else{
          //       callback();
          //     // }
          //   }
         }
       };

      return {

        totalval:0,
        disabled:false,
        iframeDom:null,
        iframeDocument:null,
        isReadOnly: false,
        isFormDisabled:false,
        // isOnlineBanking:false,    
        isInvoiceSituation:false,//发票情况 是否有票
        data: {  
          createName:'',
          createDept:'',
          createTime:'',
          fileData: [], // 附件数据   
          billNo: '', //单据编号
          clueRegistrationNo:'',//线索编号
          clueRegistrationId:'',//线索id
          reimbursementObject: '1', //报销对象  (对公对私)
          staff: '', //员工
          staffId: '', //员工ID
          supplierId:'',//供应商id
          supplier:'',//供应商
          projectApproval: '', //关联立项、营销立项、无
          marketingProjectId:'',//立项ID
          marketingProjectNo: '', //立项编号
          marketingProjectName: '', //立项名称
          checkNo: '', //票据号
          payeeBankAcc: '', //收款账号
          payeeBank: '', //收款银行
          receivingBankJointNumber: '', //收款银行联行号
          refundAmount: '', //退款金额(含税)(元)
          paymentStatus: '', //付款状态------------1是成功  2是失败
          memo: '', //备注
          reimbursementAmount: '', //报销金额
      
          formId: '', //表单应用ID
          wiid: '', //流程实例ID
          businessKey: '', //业务key
          payOrg: '', //付款财务组织      
          payOrgId: '', //付款财务组织ID
          bankaccSubId: '', //付款账号ID
          bankaccSub: '', //付款账号
          payeeBankAccId: '', //收款账号ID
          payeeBankId: '', //收款银行ID
          subjCode:'',//收支项目
          subjCodeId:'',//收支项目Id

          //报销明细
          employeetReimbursementDetails:[{
            formId: "",
            wiid: "",
            businessKey: "",
            // bbstract: "",
            // reItemId: "",
            // reItemName: "",
            balaTypeId: "",
            balaType: "",
            invoiceSituation: "",
            borrowingFormId: "",
            borrowingFormNo: "",
            reimbursementAmount: "",
            amountBorrowed:'',
            whetherOrNotSplit: "1",
            tableTotal:"",
            inputs: [
                {                
                  formId: "",
                  wiid: "",
                  businessKey: "",
                  money: "",
                  shareTheObject: "",
                  shareTheObjectId: ""
                },
              ]
            },
          ],
       
          //关联发票
          associatedInvoiceList:[
            {
              wiid: "",
              businessKey: "",        
              invoiceCode: "",
              paybillDate: "",
              invoiceType: "",
              invoiceNo:'',
              sellerName:'',
              invoiceAmount:'',
              tax:'',
              invoiceAmountNoTax:'',
            } 
          ],         
   
          detail: []
        },
        formRules: {
          //报销信息
          reimbursementObject:[{required: true, message: '请选报销对象', trigger: 'change'}],       
          projectNo: [{required: true, message: '请选择项目名称', trigger: 'change'}], 
          staff:[ {required: true, message: '请选择员工', trigger: 'change'}], 
          supplier:[{required: true, message: '请选择供应商', trigger: 'change'}],
          projectApproval:[{required: true, message: '请选择关联立项', trigger: 'change'}], 
          clueRegistrationNo:[{required: true, message: '请输入线索编号', trigger: 'change'}],
          marketingProjectNo:[{required: true, message: '请输入立项编号', trigger: 'blur'}],
          planFollowedProject:[{required: true, message: '请输入拟跟进项目名称', trigger: 'blur'}],
          payOrgId:[{required: true, message: '请输选择付款财务组织', trigger: 'blur'}],
          bankaccSub:[{required: true, message: '请输选择付款财务组织', trigger: 'blur'}],          
          payeeBank:[{required: true, message: '请选择收款银行', trigger: 'change'}],
          payeeBankAcc:[{required: true, message: '请输入收款账号', trigger: 'change'}],
 

          //报销明细
          remark:[ { required: true, message: '请输入摘要', trigger: 'blur' }],
          subjCode:[ { required: true, message: '请选择收支项目', trigger: 'change' }],
          balaType:[{ required: true, message: '请选择结算方式', trigger: 'change' }],
          invoiceSituation:[ { required: true, message: '请选择发票情况', trigger: 'change' }],
          borrowingFormNo:[ { required: true, message: '请选择借款单号', trigger: 'change' }],
          amountBorrowed:[{required: true, message: '请输入冲借款', trigger: 'change'}],
          whetherornotSplit:[ { required: true, message: '选择是否分摊', trigger: 'change' }],  

             
          shareTheObject:[{required: true, message: '请选择部门', trigger: 'change'}],
          money:[{required: true, message: '请输入分摊金额', trigger: 'change'}],

          tableRowName:[ { required: true, message: '请输入分摊部门', trigger: 'blur' }],
          tableRowMoney:[ { required: true,validator: validateNumber, trigger: 'blur' }],


          invoiceNo:[{ required: true, message: '请选择发票号',  trigger: 'blur' }],

          materialsExpenses:[ { required: true, validator: validateNumber, trigger: 'blur' }], 
          totalCost:[ { required: true, message: '输入费用合计', trigger: 'change' }], 
        },
        parentId: '',
        id: '',
        type: '',    
    
      }
    },

    computed:{
      isOnlineBanking:{
        get(){
          let _data=this.data.employeetReimbursementDetails.filter((val) => val.balaType === '网银(银行转账)' );
          return _data.length ? true : false
        }
      },

      //页面报销金额
      reimbursementAmountTotal:{
        get(){
          let _employeetReimbursementDetails=this.data.employeetReimbursementDetails;
          let _reimbursementAmountTotal=0;
          for(let i=0; i<_employeetReimbursementDetails.length; i++){
            if(_employeetReimbursementDetails){
              _reimbursementAmountTotal+=(_employeetReimbursementDetails[i].reimbursementAmount*1);
            }           
          }         
          return this.priceFormat(_reimbursementAmountTotal) 
        }
      }

    },

    mounted() {
      var that = this;
      // window.myvm指向当前页面vue实例 复制粘贴
      window.myvm = that;
      // window.$urlFormVue指向当前页面vue实例 复制粘贴
      window.$urlFormVue = that;   

      if (that.$route.query && that.$route.query.formAction === '0') {
        that.getSerialNumber();
        that.data.wfContext = window.parent.myvm.wfContext;
        that.data.createName = that.wfContext.ProcInstCreatorRealName;
        that.data.createDept = that.wfContext.ProcInstCreatorOrgName;
        that.data.createTime = that.wfContext.StartedTime;
        //获取编制人信息
        that.extend_fuiOnPageLoad();
      }
      if (that.$route.query.formAction !== '0') {
        that.getProjectData(that.$route.query.wiid)
      }


      window.addEventListener('message',this.deleteFn);
      that.iframeDom = parent.parent.document.getElementById("urlFormIframe");
      that.iframeDocument = document.getElementById("formRef");
      that.setFormIframeHeight();

    
    },

    created() {
      this.initailWorkflowParms() 
    },
    methods: { 
      // field: 可以是字段名也可以是字段定义的对象
      // updateFieldValue11(field, newValue, vueDataName, subVueDataName) {  
      //   console.log("123323",field, newValue, vueDataName, subVueDataName);
      //   // 更新控件值
      //   var that = this;
      //   var vueDataObj = vueDataName ? that[vueDataName] : that.data;
      //   if (subVueDataName) vueDataObj = that[vueDataName][subVueDataName];
      //   if (typeof field === 'string') {
      //     vueDataObj[field] = newValue;
      //   } else {
      //     if (field.fieldName) {
      //       vueDataObj[field.fieldName] = newValue;
      //     } else if (field.vModel) {
      //       vueDataObj[field.vModel] = newValue;
      //     } else if (field['field']) {
      //       vueDataObj[field['field']] = newValue;
      //     }
      //   }
      // },

      // 接受上传文件
   


      //动态设置ifrme高度 自适应内容高度
      setFormIframeHeight (){
         this.$nextTick(()=>{
          this.iframeDom.height = this.iframeDocument.scrollHeight
          console.log("box.scrollHeight:",this.iframeDom.height)
         })      
      },

      //FUI页面加载完成之后触发  FUI页面加载完成之后触发
      extend_fuiOnPageLoad() {
        let that=this;
        let userDataOrgId=myvm.$store.state.user.author.orgId;
        //根据 编制人所属部门（根据关联组织 找到 财务组织） 判断自动带出 付款财务组织
        setTimeout(() => {
          // 调用接口
          $.extendAjax(`/extend/everydaywork/queryFinanceOrganization?associatedOrganizationsId=${userDataOrgId}`,'','get',function (d) {
              if (myvm.data['payOrgId'] == '') {
                myvm.data['payOrg'] = d.data.superiorFinancialOrganization
                myvm.data['payOrgId'] = d.data.superiorFinancialOrganizatId
                that.paymentAccountNumber();
              }
            }
          )
        }, 500)
      },
      // 单个属性表格 接受上传文件
      showFile(arr){
        console.log(arr,'文件');
        this.data.fileData = arr;
      },
      // 循环或表格 接受上传文件
      showFile1(field, index ){        
        console.log('文件',index,field);
        this.$set(this.data.associatedInvoiceList[index],'fileData',field)
        console.log("this.data.associatedInvoiceList[index],'fileData':",this.data.associatedInvoiceList[index]);
      },
      //合计方法
      getSummaries(param) {
        const { columns, data } = param;
        const sums = [];
        columns.forEach((column, index) => {
          if (index === 5) {
            sums[index] = '总计:';
            return;
          }
          if (index  > 5 &&  index  < 9) {      
            console.log("param:columns,",columns,data);
            const values = data.map(item => Number(item[column.property]));
            if (!values.every(value => isNaN(value))) {
              sums[index] = values.reduce((prev, curr) => {
                const value = Number(curr);
                if (!isNaN(value)) {
                  return prev + curr;
                } else {
                  return prev;
                }
              }, 0);
              sums[index] += ' 元';
            } else {
              sums[index] = 'N/A';
            }
          }else{    
            sums[index] = '';
            return;
          }   
        });
        return sums;
      },

      //循环 或表格数据选择处理方法
      updateFieldListValue(index, childerData){
        console.log("(name,val, data",index,childerData);
        // this.$set(eval(name.url),name.lable,val)
        // console.log(eval('this.data.employeetReimbursementDetails[0]'),data)
      },

      //单个表格数据选择处理方法
      updateFieldValue(name,val, data){
        console.log("name,val, data",name,val, data,this.data.employeetReimbursementDetails);
      },

      //选择发票情况
      updateFieldInvoiceSituationValue(index, childerData){     
        let that=this;  
        that.$set(that.data.employeetReimbursementDetails[index], childerData[0] ,childerData[1])
    
        let _datas= that.data.employeetReimbursementDetails.filter((item)=> {return item.invoiceSituation=='1'});
        console.log('childerData:',that.data.employeetReimbursementDetails,_datas);
        if(_datas.length > 0){
          console.log(_datas);
          that.isInvoiceSituation=true;
          if(that.data.associatedInvoiceList.length <=0){
            that.data.associatedInvoiceList=[
              {
                wiid: "",
                businessKey: "",        
                invoiceCode: "",
                paybillDate: "",
                invoiceType: "",
                invoiceNo:'',
                sellerName:'',
                invoiceAmount:'',
                tax:'',
                invoiceAmountNoTax:'',
              } 
            ];
          }
        
        }else{

          that.data.associatedInvoiceList=[];
          that.isInvoiceSituation=false;
        }
      },

      //获取付款账号
      paymentAccountNumber() {
        //付款账号优先级方法
        // var arr = myvm.data['PersonalLoan.ProjectId'] //项目id
        // var arr1 = myvm.data['PersonalLoan.ConstructionUnitId'] //施工单位id
        // var arr2 = myvm.data['PersonalLoan.PayOrgId'] //付款组织id
        // var arr3 = WFContext.FormKey //表单key
        setTimeout(() => {
          let that=this;
          $.extendAjax('/extend/financefiles/queryBankAccSub',JSON.stringify({ projectId: '', constructionUnitId: '', bankOraganizationId:  myvm.data['payOrgId'], menuName: '' }),'post',function (res) {
              if (res.data !== null && that.data.bankaccSubId=='') { 
                that.data['bankaccSub'] =  res.data.bankaccSub ? res.data .bankaccSub :' ' 
                that.data['bankaccSubId'] = res.data.bankaccSubId ? res.data.bankaccSubId :''
              }
            }
          )
        }, 500)
      },
  
      //是否分摊切换 e=选中值(0/1) index=当前明细下标 
      whetherornotSplitFn(e,index){
        if(e!=='1'){//0
          this.$confirm('修改后会清除当前已填写分摊项列表明细，确定分摊改为否？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$set(this.data.employeetReimbursementDetails[index],'inputs',[])   
          }).catch(() => {
            this.$set(this.data.employeetReimbursementDetails[index],'whetherOrNotSplit','1')
          });
        }
      },

      //新增明细
      addMoreList(){
        let _length= this.data.employeetReimbursementDetails.length;
        this.data.employeetReimbursementDetails.push(
          {
              id:_length,
              problemClassification:'1',
              otherExpenses:'',
              materialsExpenses:'',
              // totalCost:'',         
              // costofLabor:'',
              whetherOrNotSplit:"1",
              inputs:[
                {
                  id:`table${_length}`,
                  splitType: '',
                  shareTheObject: '',
                  shareTheObjectId:'',               
                  money: '',                 
                }, 
              ]
          }
        )
        this.setFormIframeHeight();
      },

      //调起父窗口二次询问框 index=当前操作下标 btnText=[]取消确定按钮文字 btnFn=确定删除事件 dialogVisible=是否显示二次询问框 text=询问类容 itemIndex=双重循环第二层下标
      // {text :'确定删除维修费用分摊信息'+(index+1)+'?',dialogVisible: true, btnText:['取消','删除'], btnFn:'deleteMoreList',index:index,itemIndex:i}
      isDelete(data){  
        console.log("data1111:",data);
        window.parent.postMessage(data,'/');        
      },
      
      //二次询问框 确认删除
      deleteFn(deldteData){
        console.log("data2222:",deldteData);
        if(deldteData.data.btnFn){
          this[deldteData.data.btnFn](deldteData.data.index,deldteData.data.itemIndex);
        }
      },

      //删除明细 index=当前明细下标 
      deleteMoreList(index){
        this.data.employeetReimbursementDetails.splice(index,1);
        this.setFormIframeHeight();
      },
    

      //添加明细表格单行 i=当前明细下标
      addTableRow(i){
        let _id= this.data.employeetReimbursementDetails[i]['id'];
        this.data.employeetReimbursementDetails[i].inputs.push(  {
          id:`${_id}chidler${i}`,
          // splitType:'',
          shareTheObject: '',               
          money:'',
        })
        this.setFormIframeHeight();     
      },

      //删除明细表格单行 i=当前明细下标  index=当前明细表格行下标
      deleteTableRow(i,index){
        this.data.employeetReimbursementDetails[i].inputs.splice(index,1)  
        this.setFormIframeHeight();
        this.sumNumber(i);
      },

      //计算单项合计  index=当前分摊下标 
      sumNumber(index){
        let item= this.data.employeetReimbursementDetails[index].inputs;
        let newTotal =0
        for(let i=0; i<item.length; i++){
          newTotal+=(item[i].money *1)    
        }
        this.$set(this.data.employeetReimbursementDetails[index], 'tableTotal', this.priceFormat(newTotal))
        console.log("newTotal:",newTotal);
      },

      //设置金额格式 el=当前input index=当前分摊项下标 当前下标分摊项 属性名
      getAddNumber(el,index,name){
        console.log("el,index:",el.target.value,index);
        let temp = Number(el.target.value);
        this.$set(this.data.employeetReimbursementDetails[index], name, this.priceFormat(temp))    
      },

      //设置分摊项表格金额格式 el=当前input index=当前分摊项下标 itemIndex=当前下标分摊项detailsInputs当前下标 name=当前下标分摊项属性名
      getAddTableNumber(el,index,itemIndex,name){
        let temp = Number(el.target.value);
        this.data.employeetReimbursementDetails[index].inputs[itemIndex][name] = this.priceFormat(temp);
        this.sumNumber(index);
      },

    
      //保留两位小数
      priceFormat (num, n) {
        if(num==='0' || num===0){
          num=0
        }else{
          n = n || 2;
          let symbol = ",";
          if (num === null) return num;
          if (typeof num !== 'number') throw new TypeError('num参数应该是一个number类型');
          if (n < 0) throw new Error('参数n不应该小于0');
          let hasDot = parseInt(num) != num;//这里检测num是否为小数，true表示小数
          let m = (n != undefined && n != null) ? n : 1;
          num = m == 0 ? num.toFixed(m) + '.' : hasDot ? (n ? num.toFixed(n) : num) : num.toFixed(m);
          // symbol = symbol || ',';
          // num = num.toString().replace(/(\d)(?=(\d{3})+\.)/g, function (match, p1, p2) {
          //   return p1 + symbol;
          // });
          if (n == 0 || (!hasDot && !n)) {//如果n为0或者传入的num是整数并且没有指定整数的保留位数，则去掉前面操作中的小数位
            num = num.substring(0, num.indexOf('.'));
          }
        }
        
        return num;
      },

      //附件上传
      handleRemove(file, fileList) {
        console.log(file, fileList);
      },
      handlePreview(file) {
        console.log(file);
      },
      handleExceed(files, fileList) {
        this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
      },
      beforeRemove(file, fileList) {
        return this.$confirm(`确定移除 ${ file.name }？`);
      },

      //添加关联发票行
      addTableRow1(){
        this.data.associatedInvoiceList.push({
          wiid: "",
          businessKey: "",        
          invoiceCode: "",
          paybillDate: "",
          invoiceType: "",
          invoiceNo:'',
          sellerName:'',
          invoiceAmount:'',
          tax:'',
          invoiceAmountNoTax:'',

        })
        this.setFormIframeHeight();     
      },

      //删除明细表格单行 i=当前明细下标
      deleteTableRow1(i){
        this.data.associatedInvoiceList.splice(i,1)   
        this.setFormIframeHeight();
      },

      // 返回  没用上
      backBtn() {
        FUI.Window.closeEdit();
      },
      // 获取详情
      getProjectData(id) {
        console.log("id:",id)        
        let res = Object.toExtendAjax('/extend/finance/collectmoney/eer/','queryEmployeeExpenseReimbursement', {'id': id}, false, 'get');
        if (res.code == 200) {
          this.data = res.data
        } else {         
          this.$message.error(res.msg) 
        }
      },

      // 保存整体数据  没用上
      saveConfirm() {
        const res = this.submitForm()
        if (res == 200) {
          if (this.$route.query.formAction == '0') {
            this.$message.success('新增成功！')

          } else {
            this.$message.success('编辑成功！')
          }
          setTimeout(() => {
            FUI.Window.closeEdit(true, this.$route.query.parentGridId);
          }, 1500)
        }
      },
      // 编辑节点
      editNode(row, type) {
        this.type = type
        this.$refs.addDialog.FormVisible = true
        this.$refs.addDialog.data = JSON.parse(JSON.stringify(row))
      },
      // 编辑节点确认
      editConfim(data) {
        this.recursionFn(this.data.detail, data, 'edit')
      },
      // 子节点
      addSonNode(row, type) {
        this.myId = ''
        this.parentId = row.myId
        this.type = type
        this.$refs.addDialog.FormVisible = true
      },
      // 新增节点
      addNodeData(data) {
        if (data.parentId == '') {
          data.idx = 0
          this.data.detail.push(data)
        } else {
          this.recursionFn(this.data.detail, data, 'add')
        }
      },
      // 树结构递归函数
      recursionFn(list, data, type) {
        if (list.length > 0) {
          list.forEach((item, index) => {
            if (type == 'add') {
              if (item.myId == data.parentId) {
                data.idx = item.idx + 1
                return item.children.push(data)
              } else {
                return this.recursionFn(item.children, data, 'add')
              }
            } else if (type == 'delete') {
              if (item.myId == data.myId) {
                if (item.children.length > 0) {
                  return this.$message.error('无法删除有子任务的节点！')
                } else {
                  this.$message.success('删除成功');
                  return list.splice(index, 1)
                }
              } else {
                return this.recursionFn(item.children, data, 'delete')
              }
            } else if (type == 'edit') {
              if (item.myId == data.myId) {
                return list.splice(index, 1, data)
              } else {
                return this.recursionFn(item.children, data, 'edit')
              }
            }

          })
        } else {
          return
        }

      },

      // 删除节点
      deleteNode(row) {
        this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.recursionFn(this.data.detail, row, 'delete')
        }).catch(() => {
        });
      },
      // 新增顶级父节点
      fatherNode(id, parentId) {
        this.myId = id
        this.parentId = parentId
        this.$refs.addDialog.FormVisible = true
      },

      // 获取单据编号
      getSerialNumber() {
        var that = this;
        let res = Object.toAjaxJson(FUI.Handlers.FuiFrameworkHandler, 'getSerialNumber', {'counterCode': 'BPM_test'});
        if (res.success) {
          that.data.billNo = res.msg
        }
      },

      //日期字符串转日期
      parserDate (date) {  
        var t = Date.parse(date);  
        if (!isNaN(t)) {  
            return new Date(Date.parse(date.replace(/-/g, "/")));  
            
        } else {  
            return new Date();  
        }  
      },
      // 弹框调用 获取字段绑定
      // id：自定义对话框id
      // name：自定义对话框名称
      // code：自定义对话框别名
      // ObjName：自定义对话框数据对象名称（数据库表名）
      // width：弹框宽度
      // height：弹框高度
      // radioMultiple：是否多选
      //i 数据列表当前下标
      //结算方式
      openCustomDialog(id, name, code, ObjName, width, height, radioMultiple,i) {
        var that = this;
        var multi = radioMultiple == '1';
        CustomDialog(that, {
          customDialog: code,
          isTest: false,
          width: width,
          height: height,
          isMulti: multi,
          data: [
            {
              field: 'testName',
              property: 'myid'
            }
          ],
          callBack: function (data) {
            console.log(data);
            that.$set(that.data.employeetReimbursementDetails[i],"balaType", data[0].Balatype)
            that.$set(that.data.employeetReimbursementDetails[i],"balaTypeId",data[0].MyId)          
          }
        });
      },

      //收支项目
      openCustomDialog1(id, name, code, ObjName, width, height, radioMultiple,i) {
        var that = this;
        var multi = radioMultiple == '1';
        CustomDialog(that, {
          customDialog: code,
          isTest: false,
          width: width,
          height: height,
          isMulti: multi,
          data: [
            {
              field: 'name',
              property: 'myid'
            }
          ],
          callBack: function (data) {
            console.log(data);
            //自定义回调函数不是必须的，可删除           
            // that.$set(that.data.employeetReimbursementDetails[i],"subjCode", data[0].NameBalancePayments)
            that.$set(that.data.employeetReimbursementDetails[i],"subjCodeId",data[0].MyId) 
            that.$set(that.data.employeetReimbursementDetails[i],"subjCode",data[0].NameBalancePayments)    
          }
        });
      },
      
      //发票选择
      openCustomDialog4(id, name, code, ObjName, width, height, radioMultiple,indexData) {
        var that = this;
        var multi = radioMultiple == '1';
        CustomDialog(that, {
          customDialog: code,
          isTest: false,
          width: width,
          height: height,
          isMulti: multi,
          data: [
            {
              field: 'testName',
              property: 'myid'
            }
          ],
          callBack: function (data) {
            console.log(data);
            //自定义回调函数不是必须的，可删除           
            that.$set(that.data.associatedInvoiceList[indexData],"invoiceNo", data[0].InvoiceNo)
            that.$set(that.data.associatedInvoiceList[indexData],"MyId",data[0].MyId)  
            that.$set(that.data.associatedInvoiceList[indexData],"invoiceAmount", data[0].InvoiceAmount)
            that.$set(that.data.associatedInvoiceList[indexData],"invoiceCode",data[0].InvoiceCode)  
            that.$set(that.data.associatedInvoiceList[indexData],"paybillDate",that.parserDate(data[0].MakeInvoiceDate))
            // that.$set(that.data.associatedInvoiceList[indexData],"invoiceNo",data[0].InvoiceType)  
            that.$set(that.data.associatedInvoiceList[indexData],"sellerName",data[0].SellerName)  
            that.$set(that.data.associatedInvoiceList[indexData],"tax",data[0].Tax)
            // that.$set(that.data.associatedInvoiceList[indexData],"invoiceOccupancy",data[0].Tax)    
            that.$set(that.data.associatedInvoiceList[indexData],"invoiceType",data[0].InvoiceType)  
          }
        });
      },

      // 供应商选择 
      openCustomDialog5(id, name, code, ObjName, width, height, radioMultiple) {
        var that = this;
        var multi = radioMultiple == '1';
        CustomDialog(that, {
          customDialog: code,
          isTest: false,
          width: width,
          height: height,
          isMulti: multi,
          data: [
            {
              field: 'testName',
              property: 'myid'
            }
          ],
          callBack: function (data) {
            console.log(data);
            that.$set(that.data,"supplierId", data[0].yId)
            that.$set(that.data,"supplier",data[0].CustomerName);
          }
        });
      },     

      
      //立项编号选择
      openCustomDialog6(id, name, code, ObjName, width, height, radioMultiple) {
        var that = this;
        var multi = radioMultiple == '1';
        CustomDialog(that, {
          customDialog: code,
          isTest: false,
          width: width,
          height: height,
          isMulti: multi,
          data: [
            {
              field: 'testName',
              property: 'myid'
            }
          ],
          callBack: function (data) {
            console.log(data);
            that.$set(that.data,"marketingProjectNo", data[0].BillNo);
            that.$set(that.data,"marketingProjectId", data[0].MyId)
            that.$set(that.data,"marketingProjectName",data[0].ItemName);
          }
        });
      },


     //线索编号选择
      openCustomDialog7(id, name, code, ObjName, width, height, radioMultiple) {
        var that = this;
        var multi = radioMultiple == '1';
        CustomDialog(that, {
          customDialog: code,
          isTest: false,
          width: width,
          height: height,
          isMulti: multi,
          data: [
            {
              field: 'testName',
              property: 'myid'
            }
          ],
          callBack: function (data) {
            console.log(data);
            that.$set(that.data,"clueRegistrationNo", data[0].BillNo)            
            that.$set(that.data,"clueRegistrationId", data[0].MyId)
            that.$set(that.data,"planFollowedProject",data[0].PlanFollowProjectName);
          }
        });
      },

      //收款银行
      openCustomDialog8(id, name, code, ObjName, width, height, radioMultiple) {
        var that = this;
        var multi = radioMultiple == '1';
        CustomDialog(that, {
          customDialog: code,
          isTest: false,
          width: width,
          height: height,
          isMulti: multi,
          data: [
            {
              field: 'testName',
              property: 'myid'
            }
          ],
          callBack: function (data) {
            console.log(data);
            that.$set(that.data,"payeeBankId", data[0].MyId)
            that.$set(that.data,"payeeBank",data[0].BankBranch);
            that.$set(that.data,"receivingBankJointNumber",data[0].CombineNum);
          }
        });
      },

 
      //借款单号
      openCustomDialog9(id, name, code, ObjName, width, height, radioMultiple,i) {
        var that = this;
        var multi = radioMultiple == '1';
        CustomDialog(that, {
          customDialog: code,
          isTest: false,
          width: width,
          height: height,
          isMulti: multi,
          data: [
            {
              field: 'testName',
              property: 'myid'
            }
          ],
          callBack: function (data) {
            console.log("借款单号:",data);
            if(data && data[0].MyId){//获取冲借款
              that.$set(that.data.employeetReimbursementDetails[i],"borrowingFormId", data[0].MyId)
              that.$set(that.data.employeetReimbursementDetails[i],"borrowingFormNo",data[0].BillNo);      
              $.extendAjax("/extend/finance/collectmoney/eer/rushedToBorrow",{loanBillId: data[0].MyId}, "get", function(res) {
                if(res){
                  if (res.code === 200) {                 
                    that.$set(that.data.employeetReimbursementDetails[i],"amountBorrowed",res.data.amount);            
                  } else {
                    FUI.Window.showMsg(res.msg);     
                  }
                }
              });
            }
                 
          }
        });
      },

      //X 选择用户
      //inputId 姓名关闭时回填写的控件
      //hidInputId UserId的隐藏值控件 默认无
      //isSingle是否单选 默认否 0 1
      //columnName 取哪个字段值 可为空，默认UserId
      //orgName为空时表示不限制哪个部门 默认空
      // function selectStrUsers($vm, inputId, hidInputId, isSingle, columnName, orgName) {
      selectStrUsers (inputId, hidInputId, isSingle, columnName) {
        WF.SelectorDialog.selectStrUsers(this, inputId, hidInputId,'1','userId');
      },
      
  
      //选择组织部门
      //inputKey:存放Key的输入框ID
      //inputName：存放标题文字的输入框ID
      //resultFieldKey: 取roupId还是取groupCode，默认为groupId
      //singleSelect:true单选,false多选，默认单选
      // function _selectOrg($vm, inputKey, inputName, singleSelect, resultFieldKey, needRoot, vueDataObj)
      selectStrCollectionOrg (inputKey, inputName, isSingle) {
        WF.SelectorDialog.selectOrgListItem(this, inputKey, inputName, isSingle,'','','',function(res){ 
          console.log("选择部门111：",res );
          this.$set(this.data,'payOrgId',res.title)
          this.$set(this.data,'payOrgIdId',res.id)        
        }); ;
      },

      //付款账号
      selectStrCollectionOrg2 (inputKey, inputName, isSingle) {     
        WF.SelectorDialog.selectOrgListItem(this, inputKey, inputName, isSingle,'','','',function(res){ 
          console.log("选择部门111：",res);
          this.$set(this.data,'bankaccSub',res.title)
          this.$set(this.data,'bankaccSubId',res.id)        
        }); ;
      },

      //选择部门
      selectStrCollectionOrg1 (inputKey, inputName, isSingle,itemData) {
        let that=this;
        WF.SelectorDialog.selectOrgListItem(this, inputKey, inputName, isSingle,'','','',function(res){ 
          console.log("选择部门：",res);
          that.$set(that.data.employeetReimbursementDetails[itemData[0]].inputs[itemData[1]],'shareTheObject',res.title)
          that.$set(that.data.employeetReimbursementDetails[itemData[0]].inputs[itemData[1]],'shareTheObjectId',res.id)        
        });       
      },

      // 下面的方法不要动 全部复制粘贴
      //============================================工作流操作按钮交互的函数=====================================
      //初始化iframe中url传入的流程相关参数
      initailWorkflowParms() {
        var that = this;
        //获取流程页面的流程上下文[实用的流程信息从这里获取]
        that.wfContext = window.parent.myvm.wfContext;
        //流程应用定义ID
        var appId = Object.toQueryString("appId") || "";
        console.log("appId:",appId);
        //流程实例ID
        var wiid = Object.toQueryString("wiid") || "";
        // 判断流程实例id如果为空就从上下文取
        if (wiid == "") {
          wiid = that.wfContext.WorkflowInstanceId;          
        }
        //  当前页面状态：0未有实例，2待办，3查看,4待阅
        var formAction = Object.toQueryString("formAction") || 0;
        //待办任务ID，待办时才有此参数
        var taskId = Object.toQueryString("taskId") || "";
        if (formAction > 2) {
          // 判断状态是否禁用输入框
          that.isReadOnly = true;
        }
        // 流程表单ID
        that.appId = appId;
        // 流程实例ID
        that.wiid = wiid;
        // 流程状态
        that.formAction = formAction;
        // 流程上下文id, 流程结束之后就不会再有
        that.taskId = taskId;
        console.log("that.wiid:",that.wiid);
      }
      //工作流点击"保存"时触发此函数，返回true:工作流继续提交， false:工作流不提交
      , saveWorkflow(btnDef) {
        var that = this;
       
        if (that.data.associatedInvoiceList.filter((item=>{return item.invoiceNo==''})).length > 0){
          FUI.Window.showMsg('请选择发票号');
        }else{
          console.info("urlFormDemo sendWorkflow", btnDef);
          var result = "";
          result = that.submitForm();
          return fasle;
        }
      }
      //工作流点击"提交"时触发此函数，返回:空字符串:工作流继续提交，返回"具体错误信息":工作流不提交
      , sendWorkflow(btnDef) {
        var that = this;

        if (that.data.associatedInvoiceList.filter((item=>{return item.invoiceNo==''})).length > 0){
          FUI.Window.showMsg('请选择发票号');
        }else{
          console.info("urlFormDemo sendWorkflow", btnDef);
          var result = "";
          result = that.submitForm();
          return fasle;
        }
    
      }
      //工作流点击"驳回"时触发此函数，返回:空字符串:工作流继续提交，返回"具体错误信息":工作流不提交
      , rejectWorkflow(btnDef) {
        var that = this;
        console.info("urlFormDemo rejectWorkflow", btnDef);
        var result = "";
        result = that.submitForm();
        return result;
      }
      //工作流点击"作废"时触发此函数，返回:空字符串:工作流继续提交，返回"具体错误信息":工作流不提交
      //content为作废意见
      , invalidWorkflow(content) {
        var that = this;
        console.info("urlFormDemo invalidWorkflow", content);
        var result = "";// "invalidWorkflow:"+content;
        return result;
      }
      //工作流点击"确认转办"时触发此函数，返回:空字符串:工作流继续提交，返回"具体错误信息":工作流不提交
      //opinion:转办意见
      , referredWorkflow(opinion) {
        var that = this;
        console.info("urlFormDemo referredWorkflow", opinion);
        var result = "";// "referredWorkflow:"+opinion;
        return result;
      }
      //工作流点击"提交"时触发此函数，返回:true校验通过，false校验不通过；
      //也可以返回具体的错误信息：空字符串，校验通过，返回具体错误信息校验不通过，同时弹出具体的错误信息。
      , validateWorkflowForm(btnDef) {
        var that = this;
        var success = that.validateForm('formRef');
        return success;
      }
      //工作流工具栏上的其它按钮操作时返回:空字符串: 按钮继续执行，返回"具体错误信息":按钮不再执行
      , otherWorkflowButtonClick(btnDef) {
        var that = this;
        var actionName = btnDef.actionName;
        //btnDef：按钮的定义实体
        console.info(actionName);
        console.info(btnDef);
        return "";
      },
      //============================================工作流操作按钮交互 结束==================================
      
      // 绑定表单数据
      loadData() {
        var that = this;
        if (that.formAction != 0) {
          FUI.Form.bindDataToForm(that, "/workflow/demo/demoUrlForm/", "getModelByWiid", that.wiid, null, null);
        }
      },

      //为二级三级数据加上主表 myId formid wiid  businessKey
      setDataKes(setData){
        let that=this;
        let _data=JSON.parse(setData);
        for(let i=0; i<_data.length; i++){
          // _data[i].myId=that.myId;
          _data[i].wiid = that.wiid;
          _data[i].formId = that.data.formId;
          _data[i].businessKey = that.data.businessKey;
          _data[i].procInstState= that.data.procInstState;
          _data[i].reimbursementAmount=_data[i].reimbursementAmount*1;
          if(_data[i]['inputs'] && _data[i]['inputs'].length >0){
            for(let j=0; j<_data[i]['inputs'].length; j++){
              _data[i].inputs[j].myId=that.myId;
              _data[i].inputs[j].wiid = that.wiid;
              _data[i].inputs[j].formId = that.data.formId;
              _data[i].inputs[j].businessKey = that.data.businessKey;
              _data[i].inputs[j].money=_data[i].inputs[j].money*1
            }
          }
         
        }
        console.log("格式：",_data);
        return  _data;
      },
      // 表单提交
      submitForm() {
        var that = this;
        let isOk=false;
        fui_global_richeditorArrValueToInput(that);
        var success = that.validateForm('formRef');
        // that.$refs.file.returnData();
        if (!success) return;
       
        let _isUpwardsTotal=that.isUpwardsTotal(that.data.employeetReimbursementDetails)       
        if(_isUpwardsTotal){          
          that.data.wiid = that.wiid;
          that.data.formId = window.parent.myvm.wfContext.FormId;
          that.data.businessKey = window.parent.myvm.wfContext.BusinessKey;    
          let _data=that.setDataKes(JSON.stringify(that.data.employeetReimbursementDetails));
          that.data.employeetReimbursementDetails=_data;
          // that.data.refundAmount=100
          // that.data.reimbursementAmount=20    
          console.log("提交that.data:",that.data, that.data.refundAmount,that.data.reimbursementAmount);
          // that.data.field = '1234';
          // 调用我们自己的表单保存接口
          if(that.data.fileData.length === 0){
            FUI.Window.showMsg('附件不能为空');
            return isOk;
          }else{
            that.data.file = JSON.stringify(that.data.fileData);
          }
          
          console.log("_isUpwardsTotal:",_isUpwardsTotal)   
          let _submitData=JSON.parse(JSON.stringify(that.data));
          _submitData.createTime= that.parserDate(that.createTime);    
          setTimeout(function () {
            $.extendAjax("/extend/finance/collectmoney/eer/addEmployeeExpenseReimbursement", JSON.stringify(_submitData), "post", function(res) {
              if(res){
                if (res.code === 200) {
                  FUI.Window.showMsg(res.msg);
                  return isOk
                } else {
                  FUI.Window.showMsg(res.msg);
                  return isOk
                }
              }
            });
          }, 500)
        }
      },

      //单项合计是否大于单项总数
      isUpwardsTotal(newData){
        for(let i=0; i<newData.length; i++){
          if(newData[i].tableTotal *1 > newData[i].totalCost *1){
            return false
          }      
        }
        return true
      },

      // 表单效验
      validateForm(refFormName) {
        var success = false;
        this.$refs[refFormName].validate(valid => {
          success = valid;
        });
        return success;
      },
    }
  }
</script>

<style lang="scss" scoped>
.form-box{ width: 100%; overflow: hidden; box-sizing: border-box;}
.addicon{ font-size: 20px; cursor: pointer; color: #006EFF;} 
.delicon{ font-size: 20px; cursor: pointer; color: #F00;}
.upload-box{ padding:16px; box-sizing: border-box;}

.maintenance-allocation{ padding:20px;
 .maintenance-allocation-title {margin: 0 10px; border-top: 1px dashed #ddd; line-height: 24px; display: flex; justify-content: space-between;
   align-items: center;
    h6{ position: relative;top:-12px; background: #fff; font-size: 12px; line-height: 24px; color: #333; padding-right: 10px;}
    span{ display:inline-block; background: #006EFF; color: #fff; font-size: 1px; line-height: 24px; height: 24px; text-align: center;
  position: relative; top: -12px; cursor: pointer;  width: 40px; border-radius: 4px;}
}
}
.maintenance-allocation:nth-child(1){
    .maintenance-allocation-title { border:0; }
}

.contentBtn-box{ display: flex; align-items: center; justify-content: space-around; margin-bottom: 20px;}



.my-table{  padding:0 0 10px 120px;
  ul { width: 100%; display: flex; align-items: center;  justify-content: flex-start;
    li { list-style: none;  width:30%; flex-shrink: 1; justify-content: center; align-items: center; display: flex; flex-grow:1;
      .el-form-item{ display: flex; justify-content: flex-start; align-items: center;} 
    }

    li:last-child, li:nth-child(1){ width: 50px; flex-shrink: 0;  flex-grow:0; }
  }
  ul.table-th{ height:40px; background: #efefef; font-size: 14px; color: #333; font-weight: bold;
    li:last-child{ font-size: 30px; font-weight: bold; color: #006EFF;}    
  }
  ul.table-tr{ height:60px; border-top: 1px solid #ddd;background:#fff; 
    li:last-child{ font-size: 30px; font-weight: bold; color: #F00;}
  }
}

.total{display: flex; justify-content: space-between; align-items: center; height: 40px; background: #f9f9f9; 
  border-top: 1px dashed #ddd;padding: 0 20px; box-sizing: border-box; font-size: 16px; font-family: arial;color:#666;
  p{ font-size: 14px; color: #F00; line-height: 40px; }
}
  .cost {
    height: 100%; overflow: hidden;
    .title {
      vertical-align: middle;
      display: flex;
      line-height:40px;
      align-items: center;
      font-size: 12px;
      font-weight: bold;
      color: #0099ff;
      border-bottom: 1px solid #f3f3f3;
      // padding-bottom: 5px;
    }

    .title::before {
      content: "";
      display: inline-block;
      width: 4px;
      height: 17px;
      margin-right:10px;
      background: #006EFF;
    }

    .projectInfo {
      // padding: 5px;
      background-color: #fff;
      margin-bottom: 10px;
      .formData {
        padding: 20px;
      }
    }

    .projectInfo1 {
      // padding: 5px;
      background-color: #fff;
      margin-bottom: 10px;
      .title{ width: 100%; display: block;   box-sizing: border-box;
        .table-btns{ width: 160px; display: flex; justify-content: center; align-items: center;float: right; margin-right: 20px; height:40px; display: flex; align-items: center;}

    }
    :before{position: relative;top: 0px;}
  }
    .costInfo{
      min-height: 100px;
      background-color: #fff;
      overflow: hidden;
      margin: 10px auto;
      >div{padding-bottom: 0;}


      .formData {
        padding: 10px 5px;
      }

    }

    .planCenter {
      min-height: 600px;
      background-color: #fff;
      padding: 5px;
      margin-bottom: 10px;

      .formData {
        padding: 10px 15px;
      }
    }

    .footer {
      background-color: #fff;
      padding:20px 5px 5px;
      margin-top: 10px;
    }
    .pageTitle{
      text-align: center;
      font-size: 26px;
      color: rgb(0, 140, 255);
      height: 48px;
      background: #FFFFFF;
      margin-bottom: 10px;
      line-height: 48px;
    }
  }

  ::v-deep .myselect{ font-size: 14px; width:100%;
     div{
      input.el-input__inner{ height:40px; width:100%}
    }
  }
</style>
