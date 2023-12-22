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
                  <span class="projectEngineer-form-item-value">{{form.followerNumber}}</span>
                </el-form-item>
              </el-col>
            </el-col>
            <el-col :span="24" class="formData">
              <el-col :span="8">
                <el-form-item label="工期风险：">
                  <span class="projectEngineer-form-item-value">{{form.durationRisk}}</span>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="项目地址：">
                  <span class="projectEngineer-form-item-value">{{form.address | formatValue2}}</span>
                </el-form-item>
              </el-col>
            </el-col>
          </el-col>
          <el-col :span="6" style="padding: 0 20px;">
            <div class="amountDataBox" style="border: 0px solid;min-height:300px;border-radius: 4px;min-width: 320px;">
              <div class="amountDataTop" style="display: flex;padding:20px 0 0 0;">
                <div class="amountImg">
                  <img src="../../../resources/images/desktop/sumAmount.png" style="width: 65px;height: 65px">
                </div>
                <div class="amountTitle"  style="height: 65px">
                  <div style="font-size: 13px;color: #FAFAFA">项目金额(元)</div>
                  <div style="font-size: 18px;font-weight: bold;color: #FFFFFF">{{(form.projectAmount | formatValue) | numberFixed}}</div>
                </div>
              </div>
              <div style="height: 1px;background: #EBEEF5;width: 95%;margin: 10px auto"></div>
              <div class="amountDataLeft" style="height: auto;width: 49%;display: inline-block;vertical-align: middle;margin-bottom: 10px;border-right:1px solid #EBEEF5;margin-left: 10px">
                <div class="amountDataLeftT" style="padding: 0 15px;height: 100px;width: 100%;border: 0px solid;display: flex;flex-direction: column;justify-content: space-evenly;align-items: flex-start;">
                  <div style="font-size: 13px;color: #fafafa">现金流(元)</div>
                  <div style="font-size: 16px;font-weight: bold;color: #FFFFFF">{{form.cashFlow | numberFixed}}</div>
                </div>
                <div class="amountDataLeftB" style="padding: 0 15px;height: 100px;width: 100%;border-top: 1px solid #EBEEF5;display: flex;flex-direction: column;justify-content: space-evenly;align-items: flex-start;">
                  <div style="font-size: 13px;color: #FAFAFA">利润(元)</div>
                  <div style="font-size: 16px;font-weight: bold;color: #FFFFFF">{{form.profit | numberFixed}}</div>
                </div>
              </div>
              <div class="amountDataRight" style="height: 190px;width: 47%;display: inline-block;vertical-align: middle;">
                <div style="display: flex;flex-direction: column;justify-content: space-evenly;align-items: center;height: 190px;">
                  <div style="font-size: 13px;color: #FAFAFA">项目进度(%)</div>
                  <div class="jindu" style="font-size: 16px;font-weight: bold">
                    <el-progress type="circle" :percentage="Number(Object.numFixed((form.speed?form.speed:0) * 100)) " :stroke-width="11" color="#67C23A"></el-progress>
                  </div>
                </div>
              </div>
            </div>
          </el-col>
        </el-form>
      </el-row>
    </div>
    <div class="ml20 mr20  projectEngineer-box">
      <el-row>
        <el-col :span="4" class="engineer-data-item">
          <div class="projectEngineer-box-item">
            <div class="projectEngineer-box-item-title">
              <span class="yuanBox_10"></span> 完成产值(元)
            </div>
            <div class="projectEngineer-box-item-num">
              <span>{{form.outputValue | numberFixed}}</span>
            </div>
          </div>
        </el-col>
        <el-col :span="4" class="engineer-data-item" style="margin-left:4.1%">
          <div class="projectEngineer-box-item">
            <div class="projectEngineer-box-item-title">
              <span class="yuanBox_1"></span> 累计应收(元)
            </div>
            <div class="projectEngineer-box-item-num">
              <span>{{form.receivable | numberFixed}}</span>
            </div>
          </div>
        </el-col>
        <el-col :span="4" class="engineer-data-item" style="margin-left:4.1%">
          <div class="projectEngineer-box-item">
            <div class="projectEngineer-box-item-title">
              <span class="yuanBox_2"></span> 累计收款(元)
            </div>
            <div class="projectEngineer-box-item-num">
              <span>{{form.accumulatedReceipts | numberFixed}}</span>
            </div>
          </div>
        </el-col>
        <el-col :span="4" class="engineer-data-item" style="margin-left:4.1%">
          <div class="projectEngineer-box-item">
            <div class="projectEngineer-box-item-title">
              <span class="yuanBox_3"></span> 销项发票(元)
            </div>
            <div class="projectEngineer-box-item-num">
              <span>{{form.outputInvoice | numberFixed}}</span>
            </div>
          </div>
        </el-col>
        <el-col :span="4" class="engineer-data-item" style="margin-left:4.1%">
          <div class="projectEngineer-box-item">
            <div class="projectEngineer-box-item-title">
              <span class="yuanBox_4"></span> 收款占比(%)
            </div>
            <div class="projectEngineer-box-item-num">
              <span>{{form.proportionOfReceipts | numberFixed}}</span>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="ml20 mr20 projectEngineer-box">
      <el-row>
        <el-col :span="24" class="pt10">
          <el-col :span="4" class="engineer-data-item">
            <div class="projectEngineer-box-item">
              <div class="projectEngineer-box-item-title">
                <span class="yuanBox_11"></span>  支出合同(元)
              </div>
              <div class="projectEngineer-box-item-num">
                <span>{{form.expenditureContract | numberFixed}}</span>
              </div>
            </div>
          </el-col>
          <el-col :span="4" class="engineer-data-item" style="margin-left:4.1%">
            <div class="projectEngineer-box-item">
              <div class="projectEngineer-box-item-title">
                <span class="yuanBox_6"></span> 累计应付(元)
              </div>
              <div class="projectEngineer-box-item-num">
                <span>{{form.accumulativeTotal | numberFixed}}</span>
              </div>
            </div>
          </el-col>
          <el-col :span="4" class="engineer-data-item" style="margin-left:4.1%">
            <div class="projectEngineer-box-item">
              <div class="projectEngineer-box-item-title">
                <span class="yuanBox_7"></span> 累计付款(元)
              </div>
              <div class="projectEngineer-box-item-num">
                <span>{{form.cumulativePayment | numberFixed}}</span>
              </div>
            </div>
          </el-col>
          <el-col :span="4" class="engineer-data-item" style="margin-left:4.1%">
            <div class="projectEngineer-box-item">
              <div class="projectEngineer-box-item-title">
                <span class="yuanBox_8"></span> 成本发票(元)
              </div>
              <div class="projectEngineer-box-item-num">
                <span>{{form.costInvoice | numberFixed}}</span>
              </div>
            </div>
          </el-col>
          <el-col :span="4" class="engineer-data-item" style="margin-left:4.1%">
            <div class="projectEngineer-box-item">
              <div class="projectEngineer-box-item-title">
                <span class="yuanBox_9"></span> 付款占比(%)
              </div>
              <div class="projectEngineer-box-item-num">
                <span>{{Number(Object.numFixed((form.proportionOfPayment?form.proportionOfPayment:0) * 100))}} </span>
              </div>
            </div>
          </el-col>
        </el-col>
      </el-row>
    </div>
    <div class="ml20 mr20 mt10 projectEngineer-card">
      <el-row :gutter="20">
        <el-col :span="24">
          <el-card class="box-card" shadow="never">
            <div slot="header" class="clearfix">
              <span style="font-weight: bold;font-size: 15px">支出合同占比</span>
            </div>
            <div>
              <el-col :span="8">
                <div class="projectEngineer-box-item2">
                  <div class="projectEngineer-box-item-title">
                    采购合同占比
                  </div>
                  <div class="projectEngineer-box-item-num">
                    <progress-plus style="width: 200px" :color="'#67C23A'" :percent="Number(Object.numFixed((form.proportionOfProcurement?form.proportionOfProcurement:0) * 100))" />
                  </div>
                </div>

              </el-col>
              <el-col :span="8">
                <div class="projectEngineer-box-item2">
                  <div class="projectEngineer-box-item-title">
                    租赁合同占比
                  </div>
                  <div class="projectEngineer-box-item-num">
                    <progress-plus style="width: 200px" :color="'#67C23A'" :percent="Number(Object.numFixed((form.proportionOfLeaseContracts?form.proportionOfLeaseContracts:0) * 100))" />
                  </div>
                </div>
              </el-col>
              <el-col :span="8">
                <div class="projectEngineer-box-item2">
                  <div class="projectEngineer-box-item-title">
                    专业分包占比
                  </div>
                  <div class="projectEngineer-box-item-num">
                    <progress-plus style="width: 200px" :color="'#67C23A'" :percent="Number(Object.numFixed((form.professionalContracts?form.professionalContracts:0) * 100))" />
                  </div>
                </div>
              </el-col>
              <el-col :span="8">
                <div class="projectEngineer-box-item2">
                  <div class="projectEngineer-box-item-title">
                    劳务合同占比
                  </div>
                  <div class="projectEngineer-box-item-num">
                    <progress-plus style="width: 200px" :color="'#67C23A'" :percent="Number(Object.numFixed((form.proportionOfLaborContracts?form.proportionOfLaborContracts:0) * 100))" />
                  </div>
                </div>
              </el-col>
              <el-col :span="8">
                <div class="projectEngineer-box-item2">
                  <div class="projectEngineer-box-item-title">
                    其他支出占比
                  </div>
                  <div class="projectEngineer-box-item-num">
                    <progress-plus style="width: 200px" :color="'#67C23A'" :percent="Number(Object.numFixed((form.proportionOfOtherContracts?form.proportionOfOtherContracts:0) * 100))" />
                  </div>
                </div>
              </el-col>
            </div>


          </el-card>
        </el-col>
        <el-col :span="24" style="margin-top: 10px">
          <el-card class="box-card" shadow="never">
            <div slot="header" class="clearfix">
              <span style="font-weight: bold;font-size: 15px">付款占比</span>
            </div>
            <div>
              <el-col :span="8">
                <div class="projectEngineer-box-item2">
                  <div class="projectEngineer-box-item-title">
                    材料占比
                  </div>
                  <div class="projectEngineer-box-item-num">
                    <progress-plus style="width: 200px" :color="'#67C23A'" :percent="Number(Object.numFixed((form.proportionOfMaterials?form.proportionOfMaterials:0) * 100))" />
                  </div>
                </div>
              </el-col>
              <el-col :span="8">
                <div class="projectEngineer-box-item2">
                  <div class="projectEngineer-box-item-title">
                    租赁占比
                  </div>
                  <div class="projectEngineer-box-item-num">
                    <progress-plus style="width: 200px" :color="'#67C23A'" :percent="Number(Object.numFixed((form.proportionOfLease?form.proportionOfLease:0) * 100))" />
                  </div>
                </div>

              </el-col>
              <el-col :span="8">
                <div class="projectEngineer-box-item2">
                  <div class="projectEngineer-box-item-title">
                    专业分包占比
                  </div>
                  <div class="projectEngineer-box-item-num">
                    <progress-plus style="width: 200px" :color="'#67C23A'" :percent="Number(Object.numFixed((form.proportionOfProfessional?form.proportionOfProfessional:0) * 100))" />
                  </div>
                </div>

              </el-col>
              <el-col :span="8">
                <div class="projectEngineer-box-item2">
                  <div class="projectEngineer-box-item-title">
                    劳务占比
                  </div>
                  <div class="projectEngineer-box-item-num">
                    <progress-plus style="width: 200px" :color="'#67C23A'" :percent="Number(Object.numFixed((form.proportionOfLabor?form.proportionOfLabor:0) * 100))" />
                  </div>
                </div>

              </el-col>
              <el-col :span="8">
                <div class="projectEngineer-box-item2">
                  <div class="projectEngineer-box-item-title">
                    其他占比
                  </div>
                  <div class="projectEngineer-box-item-num">
                    <progress-plus style="width: 200px" :color="'#67C23A'" :percent="Number(Object.numFixed((form.proportionOfOther?form.proportionOfOther:0) * 100))" />
                  </div>
                </div>

              </el-col>
              <el-col :span="8">
                <div class="projectEngineer-box-item2">
                  <div class="projectEngineer-box-item-title">
                    费用占比
                  </div>
                  <div class="projectEngineer-box-item-num">
                    <progress-plus style="width: 200px" :color="'#67C23A'" :percent="Number(Object.numFixed((form.proportionOfExpenses?form.proportionOfExpenses:0) * 100))" />
                  </div>
                </div>
              </el-col>
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
            <!--<el-button type="primary" size="small" style="margin-right: 20px">导出<i class="el-icon-download el-icon&#45;&#45;right"></i></el-button>-->
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
          proportionOfProcurement: 0,
          proportionOfLeaseContracts: 0,
          professionalContracts: 0,
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
        that.openCustomDialog('', '项目档案', 'BPM_XiangMuDangAn_XMDT', 'ct_bpm_projectfiles', 700, 400, false)
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
        $.extendAjax(`/extend/projectSummary/projectHallData`, JSON.stringify(data), "post", function (d) {
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
    min-height: 300px;
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
    /*background: #FFFFFF;*/
    border-radius: 4px;
    /*box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);*/
    /*border-bottom: 1px solid #EBEEF5;*/
  }
  .projectEngineer-box-item {
    height: auto;
    padding: 20px 35px;
    background: #FFFFFF;
    display: flex;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: flex-start;
    -webkit-box-pack: justify;
    -ms-flex-pack: justify;
    justify-content: flex-start;
    flex-direction: column;
    border: 2px solid #f2f6fc;
    box-shadow: 0 2px 12px 0 #f2f6fc;
    border-radius: 2px;
  }
  .projectEngineer-box-item2 {
    height: auto;
    padding: 13px 35px;
    background: #FFFFFF;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: center;
    -ms-flex-align: center;
    -webkit-box-pack: justify;
    -ms-flex-pack: justify;
    justify-content: flex-start;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    -ms-flex-direction: column;
    flex-direction: row;
  }
  .projectEngineer-box-item-title {
    font-size: 14px;
    height: 28px;
    font-family:"Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
    font-weight: 500;
    line-height: 28px;
    color: #8c8c8c;
    opacity: 1;
    -webkit-font-smoothing:subpixel-antialiased;
    display: flex;
    align-items: center;
    min-width: 85px;
  }

  .projectEngineer-box-item-num {
    font-size: 15px;
    height: 20px;
    font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
    font-weight: bold;
    line-height: 20px;
    color: #606266;
    opacity: 1;
    margin-left: 20px;
    padding: 5px 0;
  }
  .projectEngineer-box-item-first{
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
  .projectEngineer-box-item-first:after{
    content: '';
    width: 1px;
    height: 40px;
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
  .amountTitle{
    font-size: 14px;
    color: #FFFFFF;
    display: flex;
    align-items: flex-start;
    align-content: center;
    flex-direction: column;
    justify-content: space-evenly;
    /*border: 1px solid;*/
  }
  .amountNum{
    font-size: 20px;font-weight: bold;margin-top: 10px;
    color: #FFFFFF;
    padding: 10px 0;
  }
  .amountDataBox{
    background: linear-gradient(250deg, #0974f1 0%, #5151E5 100% );
    box-shadow: 0 0 8px #5151E5;
    border-radius: 4px;
    color: #FFFFFF;
    /*background: #FFFFFF;*/
    /*box-shadow: 0 0 8px #C0C4CC;*/
  }
  .amountDataTop{
    background: linear-gradient(250deg, #0974f1 0%, #5151E5 100% );
    /*box-shadow: 0 0 8px #5151E5;*/
    /*border-radius: 4px;*/
    color: #FFFFFF;
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
  }
  .engineer-data-item {
    border: 2px solid #f2f6fc;
    box-shadow: 0 2px 12px 0 #f2f6fc;
    /*height: 100%;*/
    padding: 5px 0;
    /*margin: 10px 0;*/
    border-radius: 2px
  }

  .yuanBox_1{
    display: inline-block;
    width: 25px;
    height: 25px;
    background: url("../../../resources/images/desktop/css_sprites.png") no-repeat -48px 0 ;
    background-size: cover;
  }
  .yuanBox_2{
    display: inline-block;
    width: 25px;
    height: 25px;
    background: url("../../../resources/images/desktop/css_sprites3.png") no-repeat -90px 0 ;
    background-size: cover;
  }
  .yuanBox_3{
    display: inline-block;
    width: 25px;
    height: 25px;
    background: url("../../../resources/images/desktop/css_sprites3.png") no-repeat -205px 0 ;
    background-size: cover;
  }
  .yuanBox_4 {
    display: inline-block;
    width: 25px;
    height: 25px;
    background: url("../../../resources/images/desktop/css_sprites.png") no-repeat -270px 0;
    background-size: cover;
  }
  .yuanBox_5{
    display: inline-block;
    width: 25px;
    height: 25px;
    background: url("../../../resources/images/desktop/css_sprites.png") no-repeat -195px 0;
    background-size: cover;
  }
  .yuanBox_6{
    display: inline-block;
    width: 25px;
    height: 25px;
    background: url("../../../resources/images/desktop/css_sprites3.png") no-repeat -136px 0 ;
    background-size: cover;
  }
  .yuanBox_7{
    display: inline-block;
    width: 25px;
    height: 25px;
    background: url("../../../resources/images/desktop/css_sprites3.png") no-repeat -248px 0 ;
    background-size: cover;
  }
  .yuanBox_8{
    display: inline-block;
    width: 25px;
    height: 25px;
    background: url("../../../resources/images/desktop/css_sprites3.png") no-repeat -205px 0 ;
    background-size: cover;
  }
  .yuanBox_9{
    display: inline-block;
    width: 25px;
    height: 25px;
    background: url("../../../resources/images/desktop/css_sprites.png") no-repeat -270px 0;
    background-size: cover;
  }
  .yuanBox_10{
    display: inline-block;
    width: 25px;
    height: 25px;
    background: url("../../../resources/images/desktop/css_sprites3.png") no-repeat -340px 0 ;
    background-size: cover;
  }
  .yuanBox_11{
    display: inline-block;
    width: 25px;
    height: 25px;
    background: url("../../../resources/images/desktop/css_sprites.png") no-repeat -320px 0 ;
    background-size: cover;
  }
</style>
