<template>
  <div class="projectEngineer">
    <div class="ml20 mr20 projectEngineer-form">
      <el-row>
        <el-form ref="form" :inline="true" :model="form" size="small">
          <el-col :span="18" class="topDataBox">
            <el-col :span="24" class="searchBox">
              <el-col :span="8">
                <el-form-item label="项目编号：">
                  <el-input placeholder="请选择" readonly v-model="form.projectNo" class="input-searchCont">
                    <el-button slot="append" icon="el-icon-search" @click="handleOpenNo"></el-button>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="项目名称：">
                  <span class="projectEngineer-form-item-value">{{form.projectName}}</span>
                </el-form-item>
              </el-col>
            </el-col>
            <el-col :span="24">
              <el-col :span="8">
                <el-form-item label="客户：">
                  <span class="projectEngineer-form-item-value">{{form.customer}}</span>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="项目状态：">
                  <span class="projectEngineer-form-item-value">{{form.projectStatus}}</span>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="收入合同：">
                  <span class="projectEngineer-form-item-value">{{form.contractState}}</span>
                </el-form-item>
              </el-col>
            </el-col>
            <el-col :span="24">
              <el-col :span="8">
                <el-form-item label="开工日期：">
                  <span class="projectEngineer-form-item-value">{{form.commencementDate}}</span>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="营销单位：">
                  <span class="projectEngineer-form-item-value">{{form.marketingUnit}}</span>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="施工单位：">
                  <span class="projectEngineer-form-item-value">{{form.constructionUnit}}</span>
                </el-form-item>
              </el-col>

            </el-col>
            <el-col :span="24">
              <el-col :span="8">
                <el-form-item label="竣工日期：">
                  <span class="projectEngineer-form-item-value">{{form.contEndDate}}</span>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="项目经理：">
                  <span class="projectEngineer-form-item-value">{{form.projectManager}}</span>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="联系方式：">
                  <span class="projectEngineer-form-item-value">{{form.projectManagerTel}}</span>
                </el-form-item>
              </el-col>
            </el-col>
            <el-col :span="24" class="formData">
              <el-col :span="8">
                <el-form-item label="计税方式：">
                  <span class="projectEngineer-form-item-value">{{form.projectTaxMethod}}</span>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="营销跟进人：">
                  <span class="projectEngineer-form-item-value">{{form.follower}}</span>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="联系方式：">
                  <span class="projectEngineer-form-item-value">{{form.follower}}</span>
                </el-form-item>
              </el-col>
            </el-col>
            <el-col :span="24" class="formData">
              <el-col :span="8">
                <el-form-item label="项目地址：">
                  <span class="projectEngineer-form-item-value">{{form.address}}</span>
                </el-form-item>
              </el-col>
            </el-col>
          </el-col>
          <el-col :span="6">
            <div class="amountBox">
              <div class="amountTitle"><span class="el-icon-coin" style="font-size: 20px;margin-right: 5px"></span> 现金流(元)</div>
              <div class="amountNum">
                <span>{{form.cashFlow | formatValue}}</span>
              </div>
            </div>
            <div class="amountBox2">
              <div class="amountTitle"><span class="el-icon-money" style="font-size: 20px;margin-right: 5px;"></span> 利润(元)</div>
              <div class="amountNum">
                <span>{{form.profit | formatValue}}</span>
              </div>
            </div>
          </el-col>
        </el-form>
      </el-row>
    </div>
    <div class="ml20 mr20  projectEngineer-box">
      <el-row>
        <el-col :span="4">
          <div class="projectEngineer-box-item-first">
            <div class="projectEngineer-box-item-title-first">
              项目金额(元)
            </div>
            <div class="projectEngineer-box-item-num-first">
              <span>{{form.projectAmount}}</span>
            </div>
          </div>
        </el-col>
        <el-col :span="20">
          <el-col :span="24">
            <el-col :span="6">
              <div class="projectEngineer-box-item">
                <span class="yuanBox"></span>
                <div class="projectEngineer-box-item-title">
                  完成产值(元)
                </div>
                <div class="projectEngineer-box-item-num">
                  <span>{{form.outputValue}}</span>
                </div>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="projectEngineer-box-item">
                <span class="yuanBox"></span>
                <div class="projectEngineer-box-item-title">
                  累计应收(元)
                </div>
                <div class="projectEngineer-box-item-num">
                  <span>{{form.receivable}}</span>
                </div>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="projectEngineer-box-item">
                <span class="yuanBox"></span>
                <div class="projectEngineer-box-item-title">
                 累计收款(元)
                </div>
                <div class="projectEngineer-box-item-num">
                  <span>{{form.accumulatedReceipts}}</span>
                </div>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="projectEngineer-box-item">
                <span class="yuanBox"></span>
                <div class="projectEngineer-box-item-title">
                  销项发票(元)
                </div>
                <div class="projectEngineer-box-item-num">
                  <span>{{form.outputInvoice}}</span>
                </div>
              </div>
            </el-col>
          </el-col>
          <el-col :span="24">
            <el-col :span="6">
              <div class="projectEngineer-box-item">
                <span class="yuanBox"></span>
                <div class="projectEngineer-box-item-title">
                  收款占比(%)
                </div>
                <div class="projectEngineer-box-item-num">
                  <span>{{form.proportionOfReceipts }}</span>
                </div>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="projectEngineer-box-item">
                <span class="yuanBox"></span>
                <div class="projectEngineer-box-item-title">
                  工期风险
                </div>
                <div class="projectEngineer-box-item-num">
                  <span>{{form.durationRisk}}</span>
                </div>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="projectEngineer-box-item">
                <span class="yuanBox"></span>
                <div class="projectEngineer-box-item-title">
                  进度
                </div>
                <div class="projectEngineer-box-item-num">
                  <!--<el-progress :text-inside="true" :stroke-width="15" :percentage="form.speed" status="success" style="width: 150px"></el-progress>-->
                  <progress-plus style="width: 150px" :color="'#67C23A'" :percent="form.speed" />
                </div>
              </div>
            </el-col>

          </el-col>
        </el-col>

      </el-row>
    </div>
    <div class="ml20 mr20 projectEngineer-box">
      <el-row>
        <el-col :span="4">
          <div class="projectEngineer-box-2-item-first">
            <div class="projectEngineer-box-2-item-title-first">
              支出合同(元)
            </div>
            <div class="projectEngineer-box-2-item-num-first">
              <span>{{form.expenditureContract}}</span>
            </div>
          </div>
        </el-col>
        <el-col :span="20" class="pt10 pb10">
          <el-col :span="24">
            <el-col :span="6">
              <div class="projectEngineer-box-item">
                <span class="yuanBox"></span>
                <div class="projectEngineer-box-item-title">
                  累计应付(元)
                </div>
                <div class="projectEngineer-box-item-num">
                  <span>{{form.accumulativeTotal}}</span>
                </div>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="projectEngineer-box-item">
                <span class="yuanBox"></span>
                <div class="projectEngineer-box-item-title">
                  累计付款(元)
                </div>
                <div class="projectEngineer-box-item-num">
                  <span>{{form.cumulativePayment}}</span>
                </div>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="projectEngineer-box-item">
                <span class="yuanBox"></span>
                <div class="projectEngineer-box-item-title">
                  成本发票(元)
                </div>
                <div class="projectEngineer-box-item-num">
                  <span>{{form.costInvoice}}</span>
                </div>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="projectEngineer-box-item">
                <span class="yuanBox"></span>
                <div class="projectEngineer-box-item-title">
                  付款占比(%)
                </div>
                <div class="projectEngineer-box-item-num">
                  <span>{{form.proportionOfPayment}}</span>
                </div>
              </div>
            </el-col>
          </el-col>
        </el-col>
      </el-row>
    </div>

    <div class="ml20 mr20 mt10 projectEngineer-card">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-card class="box-card" shadow="never">
            <div slot="header" class="clearfix">
              <span style="font-weight: bold;font-size: 15px">支出合同占比</span>
            </div>
            <div>
              <div class="projectEngineer-box-item">
                <el-col :span="1"> <span class="yuanBox"></span></el-col>
                <el-col :span="6">
                  <div class="projectEngineer-box-item-title">
                  采购合同占比
                </div>
                </el-col>
                <el-col :span="16">
                  <div class="projectEngineer-box-item-num">
                    <!--<el-progress :text-inside="true" :stroke-width="24" :percentage="form.proportionOfProcurementContracts" status="success" style="width:100%"></el-progress>-->
                    <progress-plus style="width: 100%" :color="'#67C23A'" :percent="form.proportionOfProcurementContracts" />

                  </div>
                </el-col>
              </div>
              <div class="projectEngineer-box-item">
                <el-col :span="1">
                  <span class="yuanBox"></span>
                </el-col>
                <el-col :span="6">
                  <div class="projectEngineer-box-item-title">
                    租赁合同占比
                  </div>
                </el-col>
                <el-col :span="16">
                  <div class="projectEngineer-box-item-num">
                    <!--<el-progress :text-inside="true" :stroke-width="24" :percentage="form.proportionOfLeaseContracts" status="success" style="width: 100%"></el-progress>-->
                    <progress-plus style="width: 100%" :color="'#67C23A'" :percent="form.proportionOfLeaseContracts" />
                  </div>
                </el-col>
              </div>
              <div class="projectEngineer-box-item">
                <el-col :span="1">
                  <span class="yuanBox"></span>
                </el-col>
                <el-col :span="6">
                  <div class="projectEngineer-box-item-title">
                    专业分包占比
                  </div>
                </el-col>
                <el-col :span="16">
                  <div class="projectEngineer-box-item-num">
                    <!--<el-progress :text-inside="true" :stroke-width="24" :percentage="form.proportionOfProfessionalContracts" status="success" style="width: 100%"></el-progress>-->
                  <!---->
                    <progress-plus style="width: 100%" :color="'#67C23A'" :percent="form.proportionOfProfessionalContracts" />
                  </div>
                </el-col>
              </div>

              <div class="projectEngineer-box-item">
                <el-col :span="1">
                  <span class="yuanBox"></span>
                </el-col>
                <el-col :span="6">
                  <div class="projectEngineer-box-item-title">
                    劳务合同占比
                  </div>
                </el-col>
                <el-col :span="16">
                  <div class="projectEngineer-box-item-num">
                    <!--<el-progress :text-inside="true" :stroke-width="24" :percentage="form.proportionOfLaborContracts" status="success" style="width: 100%"></el-progress>-->
                    <progress-plus style="width: 100%" :color="'#67C23A'" :percent="form.proportionOfLaborContracts" />

                  </div>
                </el-col>
              </div>
              <div class="projectEngineer-box-item">
                <el-col :span="1">
                  <span class="yuanBox"></span>
                </el-col>
                <el-col :span="6">
                  <div class="projectEngineer-box-item-title">
                    其他支出占比
                  </div>
                </el-col>
                <el-col :span="16">
                  <div class="projectEngineer-box-item-num">
                    <!--<el-progress :text-inside="true" :stroke-width="24" :percentage="form.proportionOfOtherContracts" status="success" style="width: 100%"></el-progress>-->
                    <progress-plus style="width: 100%" :color="'#67C23A'" :percent="form.proportionOfOtherContracts" />

                  </div>
                </el-col>
              </div>
              <div class="projectEngineer-box-item">
                <el-col :span="1"></el-col>
                <el-col :span="6">
                  <div class="projectEngineer-box-item-title">

                  </div>
                </el-col>
                <el-col :span="16">
                  <div class="projectEngineer-box-item-num">
                    <span></span>
                  </div>
                </el-col>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="12">
          <el-card class="box-card" shadow="never">
            <div slot="header" class="clearfix">
              <span style="font-weight: bold;font-size: 15px">付款占比</span>
            </div>
            <div>
              <div class="projectEngineer-box-item">
                <el-col :span="1">
                  <span class="yuanBox"></span>
                </el-col>
                <el-col :span="6">
                  <div class="projectEngineer-box-item-title">
                    材料占比
                  </div>
                </el-col>
                <el-col :span="16">
                  <div class="projectEngineer-box-item-num">
                    <!--<el-progress :text-inside="true" :stroke-width="24" :percentage="form.proportionOfMaterials" status="success" style="width: 100%"></el-progress>-->
                    <progress-plus style="width: 100%" :color="'#67C23A'" :percent="form.proportionOfMaterials" />

                  </div>
                </el-col>
              </div>
              <div class="projectEngineer-box-item">
                <el-col :span="1">
                  <span class="yuanBox"></span>
                </el-col>
                <el-col :span="6">
                  <div class="projectEngineer-box-item-title">
                    租赁占比
                  </div>
                </el-col>
                <el-col :span="16">
                  <div class="projectEngineer-box-item-num">
                    <!--<el-progress :text-inside="true" :stroke-width="24" :percentage="form.proportionOfLease" status="success" style="width: 100%"></el-progress>-->
                    <progress-plus style="width: 100%" :color="'#67C23A'" :percent="form.proportionOfLease" />

                  </div>
                </el-col>
              </div>
              <div class="projectEngineer-box-item">
                <el-col :span="1">
                  <span class="yuanBox"></span>
                </el-col>
                <el-col :span="6">
                  <div class="projectEngineer-box-item-title">
                    专业分包占比
                  </div>
                </el-col>
                <el-col :span="16">
                  <div class="projectEngineer-box-item-num">
                    <!--<el-progress :text-inside="true" :stroke-width="24" :percentage="form.proportionOfProfessional" status="success" style="width: 100%"></el-progress>-->
                    <progress-plus style="width: 100%" :color="'#67C23A'" :percent="form.proportionOfProfessional" />
                  </div>
                </el-col>
              </div>
              <div class="projectEngineer-box-item">
                <el-col :span="1">
                  <span class="yuanBox"></span>
                </el-col>
                <el-col :span="6">
                  <div class="projectEngineer-box-item-title">
                    劳务占比
                  </div>
                </el-col>
                <el-col :span="16">
                  <div class="projectEngineer-box-item-num">
                    <!--<el-progress :text-inside="true" :stroke-width="24" :percentage="form.proportionOfLabor" status="success" style="width: 100%"></el-progress>-->
                    <progress-plus style="width: 100%" :color="'#67C23A'" :percent="form.proportionOfLabor" />
                  </div>
                </el-col>
              </div>
              <div class="projectEngineer-box-item">
                <el-col :span="1">
                  <span class="yuanBox"></span>
                </el-col>
                <el-col :span="6">
                  <div class="projectEngineer-box-item-title">
                    其他占比
                  </div>
                </el-col>
                <el-col :span="16">
                  <div class="projectEngineer-box-item-num">
                    <!--<el-progress :text-inside="true" :stroke-width="24" :percentage="form.proportionOfOther" status="success" style="width: 100%"></el-progress>-->
                    <progress-plus style="width: 100%" :color="'#67C23A'" :percent="form.proportionOfOther" />
                  </div>
                </el-col>
              </div>
              <div class="projectEngineer-box-item">
                <el-col :span="1">
                  <span class="yuanBox"></span>
                </el-col>
                <el-col :span="6">
                  <div class="projectEngineer-box-item-title">
                    费用占比
                  </div>
                </el-col>
                <el-col :span="16">
                  <div class="projectEngineer-box-item-num">
                    <!--<el-progress :text-inside="true" :stroke-width="24" :percentage="form.proportionOfExpenses" status="success" style="width: 100%"></el-progress>-->
                    <progress-plus style="width: 100%" :color="'#67C23A'" :percent="form.proportionOfExpenses" />
                  </div>
                </el-col>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <div class="ml20 mr20 mt10 projectEngineer-menu">
      <el-row :gutter="20">
        <div class="projectEngineer-item-menu">
              <!--<span v-for="(item,index) in projectEngineerMenu" :key="index" @click="handleWorkItemMenu(index)"-->
                    <!--:class="{'projectItem-menu-active':getCurrent === index}">-->
              <!--{{item}}-->
              <!--</span>-->
          <div style="margin-bottom: -1px;">
            <el-menu :default-active="activeName" class="el-menu-demo" mode="horizontal" @select="handleSelect">
              <el-menu-item index="0">收入</el-menu-item>
              <el-menu-item index="1">料</el-menu-item>
              <el-menu-item index="2">工</el-menu-item>
              <el-menu-item index="3">费</el-menu-item>
              <el-menu-item index="4">租赁</el-menu-item>
              <el-menu-item index="5">其他合同</el-menu-item>
              <el-menu-item index="6">成员</el-menu-item>
              <el-menu-item index="7">文档</el-menu-item>
            </el-menu>
          </div>

          <div style="display: inline-block;float: right">
            <!--<div style="font-weight: bold;font-size: 16px;padding-right: 20px;display: inline-block">单位：元</div>-->
            <el-button type="primary" size="small" style="margin-right: 20px">导出<i class="el-icon-download el-icon--right"></i></el-button>
          </div>
        </div>
      </el-row>
    </div>
    <div class="ml20 mr20 projectEngineer-table">
      <div class="projectEngineer-table-content">
        <div v-show="getCurrent === '0'">
          <income-table ref="income"></income-table>
        </div>
        <div v-show="getCurrent === '1'">
          <material-table ref="material"></material-table>
        </div>
        <div v-show="getCurrent === '2'">
          <engineer-table ref="engineer"></engineer-table>
        </div>
        <div v-show="getCurrent === '3'">
          <cost-table ref="cost"></cost-table>
        </div>
        <div v-show="getCurrent === '4'">
          <lease-table ref="lease"></lease-table>
        </div>
        <div v-show="getCurrent === '5'">
          <other-table ref="other"></other-table>
        </div>
        <div v-show="getCurrent === '6'">
          <member-table ref="member"></member-table>
        </div>
        <div v-show="getCurrent === '7'">
          <file-table ref="file"></file-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import IncomeTable from './projectEngineerTable/income';
  import MaterialTable from './projectEngineerTable/material';
  import EngineerTable from './projectEngineerTable/engineer';
  import LeaseTable from './projectEngineerTable/lease';
  import OtherTable from './projectEngineerTable/other';
  import MemberTable from './projectEngineerTable/member';
  import FileTable from './projectEngineerTable/file';
  import CostTable from './projectEngineerTable/cost';
  import ProgressPlus from '@/components/progressPlus.vue'
  export default {
    name: "projectEngineer",
    components:{
      IncomeTable,MaterialTable,EngineerTable,LeaseTable,OtherTable,MemberTable,FileTable,CostTable,ProgressPlus
    },
    data() {
      return {
        form: {
          myId: null,
          projectNo: null,
          projectName: null,
          customer: null,
          contractState: null,
          projectStatus: null,
          commencementDate: null,
          marketingUnit: null,
          constructionUnit: null,
          projectManager: null,
          projectManagerTel: null,
          contEndDate: null,
          projectTaxMethod: null,
          durationRisk: null,
          follower: null,
          followerNumber: null,
          projectAmount: 0,
          outputValue: 0,
          cashFlow: 0,
          profit: 0,
          address: null,
          receivable: 0,
          accumulatedReceipts: 0,
          outputInvoice: 0,
          expenditureContract: 0,
          accumulativeTotal: 0,
          cumulativePayment: 0,
          costInvoice: 0,
          speed: 0,
          proportionOfReceipts: 0,
          proportionOfPayment: 0,
          proportionOfMaterials: 0,
          proportionOfLabor: 0,
          proportionOfProfessional: 0,
          proportionOfLease: 0,
          proportionOfOther: 0,
          proportionOfExpenses: 0,
          proportionOfProcurementContracts: 0,
          proportionOfLeaseContracts: 0,
          proportionOfProfessionalContracts: 0,
          proportionOfLaborContracts: 0,
          proportionOfOtherContracts: 0
        },
        getCurrent: '0',
        activeName: '0',
        projectEngineerMenu: ['收入','料', '工', '费', '租赁', '其他合同', '成员', '文档']
      }
    },
    mounted(){
      var that = this;
      console.log(window.location.href);
      var myId = Object.toQueryString('myId');
      var oIndex = Object.toQueryString('oIndex');
      var projectNo = Object.toQueryString('projectNo');
      if(oIndex){
        that.$emit('showData',oIndex);
        that.form.myId = myId;
        that.form.projectNo = projectNo;
        that.getDetailInfo();
      }
      console.log(myId,oIndex)
    },
    methods: {
      // 点击切换projectItemMenu
      handleWorkItemMenu(val) {
        let that = this;
        that.getCurrent = val;
        console.log(val)
      },
      // 点击切换projectItemMenu
      handleSelect(key, keyPath) {
        let that = this;
        that.getCurrent = key;
        const data = {
          projectId: that.form.myId,
          projectNo: that.form.projectNo
        };
        switch (that.getCurrent) {
          case '0':
            that.$refs.income.getData(data);
            break;
          case '1':
            that.$refs.material.getData(data);
            break;
          case '2':
            that.$refs.engineer.getData(data);
            break;
          case '3':
            that.$refs.cost.getData(data);
            break;
          case '4':
            that.$refs.lease.getData(data);
            break;
          case '5':
            that.$refs.other.getData(data);
            break;
          case '6':
            that.$refs.member.getData(data);
            break;
          case '7':
            that.$refs.file.getData(data);
            break;
        }
        console.log(key, keyPath);
      },
      // 打开项目列表选择
      handleOpenNo(){
        var that = this;
        that.openCustomDialog('', '项目档案', 'BPM_XiangMuBianHao_4419', 'ct_bpm_projectfiles', 700, 400, false)
      },
      openCustomDialog(id, name, code, ObjName, width, height, radioMultiple) {
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
            //自定义回调函数不是必须的，可删除
            console.log(data)
            const obj = data[0];
            that.form = {
              projectNo: obj.BillNo,
              myId: obj.MyId
            };
            setTimeout(function () {
              that.getDetailInfo();
            }, 500);

          }
        });
      },
      // 查询报表数据
      getDetailInfo(){
         let that = this;
        const data = {
          projectId: that.form.myId,
          projectNo: that.form.projectNo
        };
        $.extendAjax(`/extend/projectHall/headerReports`, JSON.stringify(data), "post", function (d) {
          if(d.data){
            that.form = d.data;
            that.$refs.income.getData(data)
          }
        });


      }
    }
  }
</script>

<style scoped>
  @import "~@/resources/css/projechHall.css";

  .projectEngineer-form {
    /*min-width: 1600px;*/
    /*border: 1px solid;*/
    /*background: #FFFFFF;*/
    border-radius: 4px;
    border: 1px solid #f2f6fc;
    box-shadow: 0 2px 12px 0 #f2f6fc;
  }

  .projectEngineer-form-item-value {
    font-size: 13px;
    font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
    font-weight: 500;
    line-height: 18px;
    color: #FFFFFF;
    opacity: 1;
  }

  .projectEngineer-form /deep/ .el-form-item__label {
    font-size: 13px;
    font-family:"Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
    font-weight: 500;
    color: #FFFFFF;
    opacity: 1;
  }
  .projectEngineer-form /deep/ .el-form-item__content {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    /*width: 200px;*/
  }

  .projectEngineer-data-item {
    /*border: 1px solid #eaeaea;*/
    height: 85px;
    padding: 13px 20px;
    margin: 10px auto;
    background: #FFFFFF;
    border: 1px solid #f2f6fc;
    box-shadow: 0 2px 12px 0 #f2f6fc;
    border-radius: 3px;
  }

  .projectEngineer-data-item .projectEngineer-data-item-title {
    font-size: 16px;
    height: 28px;
    font-family:"Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
    font-weight: 700;
    line-height: 28px;
    color: #616161;
    opacity: 1;
    -webkit-font-smoothing:subpixel-antialiased;
  }

  .projectEngineer-data-item .projectEngineer-data-item-num {
    margin-top: 10px;
    font-size: 14px;
    height: 20px;
    font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
    font-weight: 400;
    line-height: 20px;
    color: #595959;
    opacity: 1;

  }

  .projectEngineer-data-item .projectEngineer-icon-class {
    font-size: 15px;
    margin-right: 6px;
  }

  .projectEngineer .projectEngineer-menu {
    /*border: 1px solid;*/
    /*margin: 10px 0;*/
    height: auto;
    background: #FFFFFF;
  }

  .projectEngineer .projectEngineer-item-menu span {
    width: 102px;
    height: 25px;
    border: 1px solid #538EFF;
    opacity: 1;
    border-radius: 16px;
    font-size: 16px;
    font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
    line-height: 25px;
    font-weight: 500;
    padding: 4px 20px;
    margin-right: 23px;
    color: #538EFF;
    cursor: pointer;
  }

  .projectItem-menu-active {
    border: 1px solid #538eff;
    border-radius: 16px;
    background: #538eff;
    color: #FFFFFF !important;
    font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
  }

  .projectEngineer-item-menu {
    margin: 0 20px;
    display: flex;
    /* width: 100%; */
    justify-content: space-between;
    align-items: center;
    background: #fff;
    border-bottom: 1px solid #e6e6e6;
  }
  .projectEngineer-table{
    /*background: #FFFFFF;*/
    border: 1px solid #f2f6fc;
    box-shadow: 0 2px 12px 0 #f2f6fc;
    border-radius: 3px;
  }
  /*顶部模块样式*/
  .topDataBox {
    padding: 0 20px;
    /*min-height: 300px;*/
    background-image: url("../../../resources/images/desktop/bg4.png");
    background-position: left bottom;
    background-origin: content-box;
    background-repeat: no-repeat;
    background-color: #0974f1;
    background-size: 77%;
    color: #FFFFFF;
    border: 0px solid #0974f1;
    border-radius: 4px;
    box-shadow: 0 0 8px #0974f1;
    margin-bottom: 15px;
  }

  .searchBox {
    padding-top: 15px;
    border-bottom: 1px dotted;
    margin-bottom: 10px;
    min-width: 950px;
  }

  .searchInput {
    width: 100%;
    border: 1px solid;
    border-radius: 4px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0px 12px;
  }

  .searchBth {
    font-size: 20px;
    cursor: pointer;
  }

  .searchCont {
    width: 200px;
    height: 32px;
    line-height: 32px;
    /*超出隐藏*/
    overflow:hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    -o-text-overflow:ellipsis;
  }

  .searchBox /deep/ .el-form-item {
    margin-bottom: 15px;

  }
  /*projectEngineer-box 样式*/
  .projectEngineer-box{
    /*margin: 10px auto;*/
    background: #FFFFFF;
    border-radius: 4px;
    /*box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);*/
    border-bottom: 1px solid #EBEEF5;
  }
  .projectEngineer-box-item {
    height: 60px;
    padding: 13px 35px;
    background: #FFFFFF;
    display: flex;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    -webkit-box-pack: justify;
    -ms-flex-pack: justify;
    justify-content: flex-start;
  }
  .projectEngineer-box-item .projectEngineer-box-item-title {
    font-size: 14px;
    height: 28px;
    font-family:"Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
    font-weight: 500;
    line-height: 28px;
    color: #303133;
    opacity: 1;
    -webkit-font-smoothing:subpixel-antialiased;
  }

  .projectEngineer-box-item .projectEngineer-box-item-num {
    font-size: 14px;
    height: 20px;
    font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
    font-weight: 400;
    line-height: 20px;
    color: #606266;
    opacity: 1;
    margin-left: 25px;
  }
  .projectEngineer-box-item-first{
    height: 120px;
    padding: 13px 20px;
    background: #FFFFFF;
    /*border: 1px solid;*/
    text-align: center;
    display: flex;
    align-content: center;
    flex-direction: column;
    justify-content: space-evenly;
  }
  .projectEngineer-box-item-first:after{
    content: '';
    width: 1px;
    height: 80px;
    background: #EEEEEE;
    left: 15%;
    /* top: 0; */
    position: absolute;
  }
  .projectEngineer-box-item-first .projectEngineer-box-item-title-first{
    font-size: 15px;
    height: 28px;
    font-family:"Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
    font-weight: 700;
    line-height: 28px;
    color: #303133;
    opacity: 1;
    -webkit-font-smoothing:subpixel-antialiased;
  }

  .projectEngineer-box-item-first .projectEngineer-box-item-num-first {
    font-size: 14px;
    height: 20px;
    font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
    font-weight: 400;
    line-height: 20px;
    color: #595959;
    opacity: 1;

  }
  .projectEngineer-box-2-item-first{
    height: 80px;
    padding: 13px 20px;
    background: #FFFFFF;
    /*border: 1px solid;*/
    text-align: center;
    display: flex;
    align-content: center;
    flex-direction: column;
    justify-content: space-evenly;
  }
  .projectEngineer-box-2-item-first:after{
    content: '';
    width: 1px;
    height: 40px;
    background: #EEEEEE;
    left: 15%;
    /* top: 0; */
    position: absolute;
  }
  .projectEngineer-box-2-item-first .projectEngineer-box-2-item-title-first{
    font-size: 15px;
    height: 28px;
    font-family:"Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
    font-weight: 700;
    line-height: 28px;
    color: #303133;
    opacity: 1;
    -webkit-font-smoothing:subpixel-antialiased;
  }

  .projectEngineer-box-2-item-first .projectEngineer-box-2-item-num-first {
    font-size: 14px;
    height: 20px;
    font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
    font-weight: 400;
    line-height: 20px;
    color: #595959;
    opacity: 1;

  }
  .yuanBox{
    width: 5px;
    height: 5px;
    border-radius: 10px;
    background: #67C23A;
    display: inline-block;
    margin: 5px;
  }
  .box-card{
    width: 100%;
  }
  .input-searchCont /deep/ input{
    background: transparent;
    color: white;
  }
  .input-searchCont /deep/ .el-input-group__append{
    background: transparent;
    color: #FFFFFF;
    border-color: #FFFFFF;
  }
  .input-searchCont /deep/ .el-input__inner{
    border-color: #FFFFFF;
    color: #FFFFFF;
  }
  .input-searchCont /deep/ input::placeholder{
    color: #FAFAFA;
  }
  .input-searchCont /deep/ input::-webkit-input-placeholder{
    color: #FAFAFA;
  }
  .input-searchCont /deep/ input:-moz-placeholder{
    color: #FAFAFA;
  }
  .input-searchCont /deep/ input::-moz-placeholder{
    color: #FAFAFA;
  }
  .input-searchCont /deep/ input:-ms-input-placeholder{
    color: #FAFAFA;
  }
  .input-searchCont /deep/ input::-ms-input-placeholder{
    color: #FAFAFA;
  }
  .amountBox{
    height: 120px;
    /* border: 1px solid; */
    padding: 20px;
    /*background: linear-gradient(250deg, #ffa500 0%, #f76b1c 100% );*/
    background-image: linear-gradient( 135deg, #F761A1 10%, #8C1BAB 100%);
    box-shadow: 0 0 8px #000DFF;
    border-radius: 4px;
    margin: 10px 20px 0 20px;
  }
  .amountBox2{
    height: 120px;
    /* border: 1px solid; */
    padding: 20px;
    background: linear-gradient(250deg, #0974f1 0%, #5151E5 100% );
    box-shadow: 0 0 8px #5151E5;
    border-radius: 4px;
    margin: 15px 20px 0 20px
  }
  .amountTitle{
    font-size: 14px;
    color: #FFFFFF;
    padding-top: 10px;
    display: flex;
    align-items: center;
    justify-content: flex-start;
  }
  .amountNum{
    font-size: 20px;font-weight: bold;margin-top: 10px;
    color: #FFFFFF;
    padding: 10px 0;
  }
</style>
