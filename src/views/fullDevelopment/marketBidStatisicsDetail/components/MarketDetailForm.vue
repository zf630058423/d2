<template>
  <el-form :model="formData" label-width="154px" inline ref="form">
            <el-row :gutter="24" v-if="isOpen" class="transparent" >
              <el-form-item label="项目编号：" prop="projectNo" class="default-label">
                <el-input class="inputWidthNum"  size="small" v-model="formData.projectNo" clearable placeholder="请输入项目编号"></el-input>
              </el-form-item>
              <el-form-item label="业务单元：" prop="marketingUnit" class="default-label">
                <el-input class="inputWidthNum"  size="small" v-model="formData.marketingUnit" clearable placeholder="请输入业务单元"></el-input>
              </el-form-item>
              <el-form-item label="跟进人：" prop="follower" class="default-label">
                <el-input class="inputWidthNum"  size="small" v-model="formData.follower" clearable placeholder="请输入跟进人"></el-input>
              </el-form-item>
              <el-form-item label="客户：" prop="customer" class="default-label">
                <el-input class="inputWidthNum"  size="small" v-model="formData.customer" clearable placeholder="请输入客户"></el-input>
              </el-form-item>
              <el-form-item label="项目负责人：" prop="projectLeader" class="default-label">
                <el-input class="inputWidthNum"  size="small" v-model="formData.projectLeader" clearable placeholder="项目负责人"></el-input>
              </el-form-item>
              <el-form-item label="立项类型：" prop="itemType" class="default-label">
                <el-select class="inputWidthNum" v-model="formData.itemType" clearable placeholder="请选择" size="small">
                  <el-option
                    v-for="(item,index) in projectApprovalTypeList"
                    :key="index"
                    :label="item"
                    :value="item">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="是否预选承包商入库：" prop="isPreContractor" class="default-label">
                <div class="inputWidthNum">
                  <el-radio v-model="formData.isPreContractor" label="1">是</el-radio>
                  <el-radio v-model="formData.isPreContractor" label="0">否</el-radio>
                </div>
              </el-form-item>
              <el-form-item label="产品线：" prop="productline" class="default-label">
                <el-select class="inputWidthNum" v-model="formData.productline" filterable clearable placeholder="请选择" size="small">
                  <el-option
                    v-for="(item,index) in productLineList"
                    :key="index"
                    :label="item"
                    :value="item">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="招投标形式：" prop="biddingForm" class="default-label">
                <el-select class="inputWidthNum" v-model="formData.biddingForm" clearable placeholder="请选择" size="small">
                  <el-option
                    v-for="item in attractFormTenderList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.name">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="项目地址（省-市）：" prop="projectAddress" class="default-label">
                <el-input class="inputWidthNum"  size="small" v-model="formData.projectAddress" clearable placeholder="请输入项目地址"></el-input>
              </el-form-item>
              <el-form-item label="项目当前状态：" prop="itemStatus" class="default-label">
                <el-select class="inputWidthNum" v-model="formData.itemStatus" clearable placeholder="请选择" size="small">
                  <el-option
                    v-for="item in projectCurrentStatusList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.name">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="入库片区范围：" prop="districtScope" class="default-label">
                <el-input class="inputWidthNum"  size="small" v-model="formData.districtScope" clearable placeholder="请输入入库片区范围"></el-input>
              </el-form-item>
              <el-form-item label="关闭状态：" prop="closeState" class="default-label">
                <el-select class="inputWidthNum" v-model="formData.closeState" placeholder="请选择" size="small">
                  <el-option
                    v-for="item in inactiveStateList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="关闭原因：" prop="closeReason" class="default-label">
                <el-select class="inputWidthNum" v-model="formData.closeReason" placeholder="请选择" size="small">
                  <el-option
                    v-for="item in closeReaseList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="未中标原因：" prop="loseBidReason" class="default-label">
                <el-select class="inputWidthNum" v-model="formData.loseBidReason" placeholder="请选择" size="small">
                  <el-option
                    v-for="item in closeReaseList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="是否后补流程：" prop="isMakeAmendsFlowPath" class="default-label">
                <div class="inputWidthNum">
                  <el-radio v-model="formData.isMakeAmendsFlowPath" label="1">是</el-radio>
                  <el-radio v-model="formData.isMakeAmendsFlowPath" label="0">否</el-radio>
                </div>
              </el-form-item> 
              
              <el-form-item label="当前流程：" prop="currentProcess" class="default-label">
                <el-select class="inputWidthNum" v-model="formData.currentProcess" placeholder="请选择" size="small">
                  <el-option
                    v-for="item in currentProcessList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="标前评审结果：" prop="preBidResult" class="default-label">
                <div class="inputWidthNum">
                  <el-radio v-model="formData.preBidResult" label="1">同意投标</el-radio>
                  <el-radio v-model="formData.preBidResult" label="0">不同意投标</el-radio>
                </div>
              </el-form-item> 
              <el-form-item label="资格预审文件审批结果：" prop="qualificateResult" class="default-label">
                <div class="inputWidthNum">
                  <el-radio v-model="formData.qualificateResult" label="1">同意</el-radio>
                  <el-radio v-model="formData.qualificateResult" label="0">不同意</el-radio>
                </div>
              </el-form-item> 
              <el-form-item label="投标文件评审结果：" prop="bidResult" class="default-label">
                <div class="inputWidthNum">
                  <el-radio v-model="formData.bidResult" label="1">同意</el-radio>
                  <el-radio v-model="formData.bidResult" label="0">不同意</el-radio>
                </div>
              </el-form-item>
              <el-form-item label="是否中标：" prop="winTheBid" class="default-label">
                <div class="inputWidthNum">
                  <el-radio v-model="formData.winTheBid" label="1">是</el-radio>
                  <el-radio v-model="formData.winTheBid" label="0">否</el-radio>
                </div>
              </el-form-item>
              <el-form-item label="投标截止时间：" prop="bidDeadlineDate" class="default-label">
                <el-date-picker size="small" v-model="bidDeadlineDate" type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions" value-format="yyyy-MM-dd HH:mm:ss" :default-time="['00:00:00', '23:59:59']"></el-date-picker>
              </el-form-item>
              <el-form-item label="关闭时间：" prop="cloaseDate" class="default-label">
                <el-date-picker size="small" v-model="cloaseDate" type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions" value-format="yyyy-MM-dd HH:mm:ss" :default-time="['00:00:00', '23:59:59']"></el-date-picker>
              </el-form-item>
              <el-form-item :label="'营销立项/预选承包商\n入库审批通过时间：'" prop="processFinishedTimeItemDate" class="fold-label">
                <el-date-picker size="small" v-model="processFinishedTimeItemDate" type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions" value-format="yyyy-MM-dd HH:mm:ss" :default-time="['00:00:00', '23:59:59']"></el-date-picker>
              </el-form-item>
              <el-form-item label="标前评审审批通过时间：" prop="processFinishedTimePreBidDate" class="default-label">
                <el-date-picker size="small" v-model="processFinishedTimePreBidDate" type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions" value-format="yyyy-MM-dd HH:mm:ss" :default-time="['00:00:00', '23:59:59']"></el-date-picker>
              </el-form-item>
              <el-form-item :label="'投标文件评审/资格预审\n文件审批通过时间：'" prop="processFinishedTimeBidDate" class="fold-label">
                <el-date-picker size="small" v-model="processFinishedTimeBidDate" type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions" value-format="yyyy-MM-dd HH:mm:ss" :default-time="['00:00:00', '23:59:59']"></el-date-picker>
              </el-form-item>
              <el-form-item label="开标结果审批通过时间：" prop="processFinishedTimeBidResultDate" class="default-label">
                <el-date-picker size="small" v-model="processFinishedTimeBidResultDate" type="datetimerange" range-separator="至" start-placeholder="开始日期" :picker-options="pickerOptions" end-placeholder="结束日期" value-format="yyyy-MM-dd HH:mm:ss" :default-time="['00:00:00', '23:59:59']"></el-date-picker>
              </el-form-item> 
            </el-row>
            <el-row :gutter="24">
              <el-form-item label="立项编号：" prop="itemNo" class="default-label">
                <el-input class="inputWidthNum"  size="small" v-model="formData.itemNo" clearable placeholder="请输入立项编号"></el-input>
              </el-form-item>
              <el-form-item label="合同编号：" prop="contractNo" class="default-label">
                <el-input class="inputWidthNum"  size="small" v-model="formData.contractNo" clearable placeholder="请输入合同编号"></el-input>
              </el-form-item>
              <el-form-item label="项目名称：" prop="itemName" class="default-label">
                <el-input class="inputWidthNum"  size="small" v-model="formData.itemName" clearable placeholder="请输入项目名称"></el-input>
              </el-form-item>
              <el-form-item label="业务中心：" prop="marketingCenter" class="default-label">
                <el-input class="inputWidthNum"  size="small" v-model="formData.marketingCenter" clearable placeholder="请输入业务中心"></el-input>
              </el-form-item>
              <el-form-item label="">
                <!-- <span class="el-divider el-divider--vertical"></span> -->
                <el-button type="primary" size="small" class="fa fa-search" @click="searchFn">查询</el-button>
                <el-button type="primary" size="small" class="fa" @click="resetFn">重置</el-button>
                <el-button type="primary" size="small" class="fa" @click="exportFn">导出</el-button>
                <span v-if="!isOpen" class="expans-more" @click="handelIsOpen">展开 <i class="icon icon-arrow-down-bold"></i></span>
                <span v-else class="expans-more" @click="handelIsOpen">收起 <i class="icon icon-arrow-up-bold"></i></span>
              </el-form-item>
            </el-row>
          </el-form>
</template>
<script>
import { getProductlineList } from '@/Api/marketBid.js';
import { getStartDateTime, getEndDateTime } from '../marketBidDetailColumn.js';
import { ATTRACT_TENDER_LIST, CLOSE_STATE_LIST, CLOSE_REASE_LIST, PROJECT_STATUS_LIST, PROCESS_LIST, APPROVAL_TYPE, INCOMING_TYPE } from '../../enum/index';

export default {
  data() { 
    return {
      formData: {
        itemNo: '',  //立项编号
        projectNo: '',  //项目编号
        contractNo:'',  //合同编号
        itemName: '',  //项目名称
        itemName:'',  //立项名称
        marketingCenter: '',  //业务中心
        marketingUnit: '',  //业务单元
        projectLeader: '',  //项目负责人
        customer:'',   //客户
        itemType: '',  //立项类型
        isPreContractor: '',  //是否预选承包商入库
        productline: '', //产品线
        biddingForm: '',  //招投标形式
        projectAddress: '',  //项目地址
        itemStatus: '',  //项目当前状态
        districtScope: '',  //入库片区范围
        closeState: '',  //关闭状态
        closeReason: '',  //关闭原因
        loseBidReason: '',  //未中标原因
        isMakeAmendsFlowPath: '',  //是否后补流程
        follower: '',  //跟进人
        currentProcess: '',  //当前流程
        preBidResult: '',  //标前评审结果
        qualificateResult: '', //资格预审文件审批结果
        bidResult: '',  //投标文件评审结果
        winTheBid: '',  //是否中标
        bidDeadlineStartDate:'', //投标截止时间 - 开始 bidDeadlineStartDate startBidDeadlineTime
        bidDeadlineEndDate: '',//投标截止时间 - 结束 bidDeadlineEndDate endBidDeadlinTime
        closeTimeStartDate: '',  //关闭时间-开始
        closeTimeEndDate: '',  //关闭时间-结束
        finishedTimeItemStartDate: '',  //营销立项/预选承包商入库审批通过时间- 开始
        finishedTimeItemEndDate: '',  //营销立项/预选承包商入库审批通过时间- 结束
        finishedTimePreBidStartDate: '',  //标前评审审批通过时间 - 开始
        finishedTimePreBidEndDate: '',  //标前评审审批通过时间 - 结束
        finishedTimeBidStartDate: '', //投标文件评审/资格预审文件审批通过时间 - 开始
        finishedTimeBidEndDate: '',  //投标文件评审/资格预审文件审批通过时间 - 结束
        finishedTimeBidResultStartDate: '',  //开标结果审批通过时间 - 开始
        finishedTimeBidResultEndDate: '',  //开标结果审批通过时间 - 结束
      },
      attractFormTenderList: ATTRACT_TENDER_LIST,  //招投标形式
      inactiveStateList: CLOSE_STATE_LIST,  //关闭状态
      closeReaseList: CLOSE_REASE_LIST,  //关闭原因,
      projectCurrentStatusList: PROJECT_STATUS_LIST,  //项目当前状态
      currentProcessList:PROCESS_LIST,   //当前流程
      productLineList: [],  //产品线
      projectApprovalTypeList: APPROVAL_TYPE,//立项类型
      incomingTypeList:INCOMING_TYPE,  //入库类型
      isOpen: false,
      bidDeadlineDate: [],  //投标截止时间
      cloaseDate: [],  //关闭时间
      processFinishedTimeItemDate: [],  //营销立项/预选承包商入库审批通过时间
      processFinishedTimePreBidDate: [],   //标前评审 审批通过时间
      processFinishedTimeBidDate: [],   //投标文件评审/资格预审文件审批通过时间
      processFinishedTimeBidResultDate: [],  //开标结果审批通过时间
      pickerOptions: {
        disabledDate(time) { 
          return time.getTime() < new Date('2021-12-31').getTime()
        }
      }
    }
  },
  created() { 
    this.getProductlineData();
  },
  methods: {
    //产品线查找
    async getProductlineData() { 
      const dataParam = { productline: '' };
      let { data } = await getProductlineList(dataParam);
      this.productLineList = data;
    },
    // 切换状态
    handelIsOpen(){
      this.isOpen = !this.isOpen;
    },
    searchFn() {
      let { bidDeadlineDate, cloaseDate, processFinishedTimeItemDate, processFinishedTimePreBidDate, processFinishedTimeBidDate, processFinishedTimeBidResultDate} = this;
      let dataParams = {
        ...this.formData,
        bidDeadlineStartDate: getStartDateTime(bidDeadlineDate), //投标截止时间 - 开始
        bidDeadlineEndDate: getEndDateTime(bidDeadlineDate),//投标截止时间 - 结束
        closeTimeStartDate: getStartDateTime(cloaseDate),  //关闭时间-开始
        closeTimeEndDate: getEndDateTime(cloaseDate),  //关闭时间-结束
        finishedTimeItemStartDate: getStartDateTime(processFinishedTimeItemDate),  //营销立项/预选承包商入库审批通过时间- 开始
        finishedTimeItemEndDate: getEndDateTime(processFinishedTimeItemDate),  //营销立项/预选承包商入库审批通过时间- 结束
        finishedTimePreBidStartDate: getStartDateTime(processFinishedTimePreBidDate),  //标前评审审批通过时间 - 开始
        finishedTimePreBidEndDate: getEndDateTime(processFinishedTimePreBidDate),  //标前评审审批通过时间 - 结束
        finishedTimeBidStartDate: getStartDateTime(processFinishedTimeBidDate), //投标文件评审/资格预审文件审批通过时间 - 开始
        finishedTimeBidEndDate: getEndDateTime(processFinishedTimeBidDate),  //投标文件评审/资格预审文件审批通过时间 - 结束
        finishedTimeBidResultStartDate: getStartDateTime(processFinishedTimeBidResultDate),  //开标结果审批通过时间 - 开始
        finishedTimeBidResultEndDate: getEndDateTime(processFinishedTimeBidResultDate),  //开标结果审批通过时间 - 结束
      }
      this.$emit('search',dataParams)
    },
    exportFn() { 
      this.$emit('exportExcel',this.formData)
    },
    resetFn() { 
      this.formData = {};
      this.bidDeadlineDate = [];
      this.cloaseDate = [];
      this.processFinishedTimeItemDate = [];
      this.processFinishedTimePreBidDate = [];
      this.processFinishedTimeBidDate = [];
      this.processFinishedTimeBidResultDate = [];
      this.$emit('search', this.formData)
    }
  }
}
</script>
<style scoped>
.inputWidthNum{
    min-width: 200px;
  }
  .expans-more {
    margin-left: 15px;
    cursor: pointer;
    font-size: 10px;
    color: #0D1126;
  }
  .costListClass .el-form-item{
    margin-bottom: 10px;
    margin-right: 15px;
  }
  .el-form-item__content .el-input-group {
    vertical-align: middle;
  }

  ::v-deep .el-form-item__label{
    font-family: PingFang SC;
    font-weight: 500;
    color: #56576C;
  }
</style>