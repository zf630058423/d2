<template>
  <el-form :model="formData" label-width="140px" inline ref="form">
            <el-row :gutter="24" v-if="isOpen" class="transparent">
              
              <el-form-item label="关闭状态：" prop="offState">
                <el-select class="inputWidthNum" v-model="formData.offState" placeholder="请选择" size="small">
                  <el-option
                    v-for="item in inactiveStateList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="产品线：" prop="productline">
                <el-select class="inputWidthNum" v-model="formData.productline" filterable clearable placeholder="请选择" size="small">
                  <el-option
                    v-for="(item,index) in productLineList"
                    :key="index"
                    :label="item"
                    :value="item">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="立项类型：" prop="itemType">
                <el-select class="inputWidthNum" v-model="formData.itemType" clearable placeholder="请选择" size="small">
                  <el-option
                    v-for="(item,index) in projectApprovalTypeList"
                    :key="index"
                    :label="item"
                    :value="item">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="是否中标：" prop="winTheBid">
                <div class="inputWidthNum">
                  <el-radio v-model="formData.winTheBid" label="1">是</el-radio>
                  <el-radio v-model="formData.winTheBid" label="0">否</el-radio>
                </div>
              </el-form-item>
              <el-form-item label="项目地址（省-市）：" prop="projectAddress">
                <el-input class="inputWidthNum"  size="small" v-model="formData.projectAddress" clearable placeholder="请输入项目地址"></el-input>
              </el-form-item>
              <el-form-item label="入库类型：" prop="incomingType">
                <el-select class="inputWidthNum" v-model="formData.incomingType" clearable placeholder="请选择" size="small">
                  <el-option
                    v-for="(item,index) in incomingTypeList"
                    :key="index"
                    :label="item"
                    :value="item">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="是否为设计施工立项：" prop="isDesign">
                <div class="inputWidthNum">
                  <el-radio v-model="formData.isDesign" label="1">是</el-radio>
                  <el-radio v-model="formData.isDesign" label="0">否</el-radio>
                </div>
              </el-form-item>
              <el-form-item :label="'营销立项审核\n通过时间：'" prop="processFinishedTime" class="fold-label">
                <el-date-picker size="small" v-model="processFinishedTime" type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions" value-format="yyyy-MM-dd HH:mm:ss" :default-time="['00:00:00', '23:59:59']"></el-date-picker>
              </el-form-item>

              <el-form-item :label="'标前评审审批\n通过时间：'" prop="finishedTimePreBidDate" class="fold-label">
                <el-date-picker size="small" v-model="finishedTimePreBidDate" type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions" value-format="yyyy-MM-dd HH:mm:ss" :default-time="['00:00:00', '23:59:59']"></el-date-picker>
              </el-form-item>
              <el-form-item :label="'投标文件评审/资格预审\n审批通过时间：'" prop="finishedTimeBidDate" class="fold-label">
                <el-date-picker size="small" v-model="finishedTimeBidDate" type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions" value-format="yyyy-MM-dd HH:mm:ss" :default-time="['00:00:00', '23:59:59']"></el-date-picker>
              </el-form-item>
              <el-form-item :label="'开标结果\n审批通过时间：'" prop="finishedTimeBidResultDate" class="fold-label">
                <el-date-picker size="small" v-model="finishedTimeBidResultDate" type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions" value-format="yyyy-MM-dd HH:mm:ss" :default-time="['00:00:00', '23:59:59']"></el-date-picker>
              </el-form-item>

              <el-form-item label="预估投标时间：" prop="estimatedBiddingDate">
                <el-date-picker size="small" v-model="estimatedBiddingDate" type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions" value-format="yyyy-MM-dd HH:mm:ss" :default-time="['00:00:00', '23:59:59']"></el-date-picker>
              </el-form-item>
              <el-form-item label="投标截止时间：" prop="bidDeadlineDate">
                <el-date-picker size="small" v-model="bidDeadlineDate" type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions" value-format="yyyy-MM-dd HH:mm:ss" :default-time="['00:00:00', '23:59:59']"></el-date-picker>
              </el-form-item>
            </el-row>
            <el-row :gutter="24">
              <el-form-item label="业务单元：" prop="marketingUnit">
                <el-input class="inputWidthNum"  size="small" v-model="formData.marketingUnit" clearable placeholder="请输入业务单元"></el-input>
              </el-form-item>
              <el-form-item label="业务中心：" prop="marketingCenter">
                <el-input class="inputWidthNum"  size="small" v-model="formData.marketingCenter" clearable placeholder="请输入业务中心"></el-input>
              </el-form-item>
              <el-form-item label="项目介绍人：" prop="projectLeader">
                <el-input class="inputWidthNum"  size="small" v-model="formData.projectLeader" clearable placeholder="请输入项目介绍人"></el-input>
              </el-form-item>
              <el-form-item label="跟进人：" prop="follower">
                <el-input class="inputWidthNum"  size="small" v-model="formData.follower" clearable placeholder="请输入跟进人"></el-input>
              </el-form-item>
              <el-form-item label="招投标形式：" prop="biddingForm">
                <el-select class="inputWidthNum" v-model="formData.biddingForm" clearable placeholder="请选择" size="small">
                  <el-option
                    v-for="item in attractFormTenderList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.name">
                  </el-option>
                </el-select>
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
import { ATTRACT_TENDER_LIST, CLOSE_STATE_LIST, APPROVAL_TYPE, INCOMING_TYPE } from '../../enum/index';

export default {
  // props: {
  //   formData: {
  //     type: Object,
  //     default: () => {
  //       return {}
  //     }
  //   }
  // },
  data() { 
    return {
      formData: {
        marketingUnit: '',  //业务单元
        marketingCenter: '',  //业务中心
        projectLeader: '',  //项目介绍人
        follower: '',  //跟进人
        biddingForm: '',  //招投标形式
        offState: '',  //关闭状态
        productline: '',  //产品线
        itemType: '',  //立项类型
        winTheBid: '', //是否中标
        projectAddress: '',  //项目地址
        depositBusiness: '',  //入库类型
        isDesign: '',  //是否为设计施工立项 
        finishedTimeItemStartDate: '', //营销立项审核通过时间-开始时间
        finishedTimeItemEndDate: '', //营销立项审核通过时间-结束时间
        finishedTimePreBidStartDate: '',  //标前评审流程审批开始时间
        finishedTimePreBidEndDate: '', //标前评审流程审批结束时间
        finishedTimeBidStartDate: '',  // 投标文件评审/资格预审文件评审流程审批通过时间 开始时间
        finishedTimeBidEndDate:'', //投标文件评审/资格预审文件评审流程审批通过时间 结束时间
        finishedTimeBidResultStartDate: '',  //开标结果流程审批通过时间 开始时间
        finishedTimeBidResultEndDate: '',  //开标结果流程审批通过时间 结束时间
        startEstimatedBiddingDate:'', //预估投标时间 - 开始时间
        endEstimatedBiddingDate:'', //预估投标时间 - 结束时间
        startBidDeadline:'', //投标截止时间 - 开始
        endBidDeadlin: '',//投标截止时间 - 结束
      },
      attractFormTenderList:ATTRACT_TENDER_LIST,  //招投标形式
      inactiveStateList: CLOSE_STATE_LIST,   //关闭状态
      productLineList: [],  ////产品线
      projectApprovalTypeList: APPROVAL_TYPE, //立项类型
      incomingTypeList:INCOMING_TYPE,  //入库类型
      isOpen: false,
      processFinishedTime: [],  //审核通过时间
      estimatedBiddingDate: [],  //预估投标时间
      bidDeadlineDate: [],  //投标截止时间
      finishedTimePreBidDate: [],  //标前评审审批通过时间
      finishedTimeBidDate: [],  //投标文件评审/资格预审审批通过时间
      finishedTimeBidResultDate: [],  //开标结果审批通过时间
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
      let dataParam = {
        productline:''
      }
      let { data } = await getProductlineList(dataParam);
      this.productLineList = data;
    },
    // 切换状态
    handelIsOpen(){
      this.isOpen = !this.isOpen;
    },
    searchFn() {
      this.formData.startBidDeadline = (this.bidDeadlineDate && this.bidDeadlineDate.length > 0) ? this.bidDeadlineDate[0] : '';  //投标截止时间-开始
      this.formData.endBidDeadline = (this.bidDeadlineDate && this.bidDeadlineDate.length > 0) ? this.bidDeadlineDate[1] : '';  //投标截止时间-结束
      this.formData.startEstimatedBiddingDate = (this.estimatedBiddingDate && this.estimatedBiddingDate.length > 0) ? this.estimatedBiddingDate[0] : '';  //预估投标时间-开始
      this.formData.endEstimatedBiddingDate = (this.estimatedBiddingDate && this.estimatedBiddingDate.length > 0) ? this.estimatedBiddingDate[1] : '';  //预估投标时间-结束
      this.formData.finishedTimeItemStartDate = (this.processFinishedTime && this.processFinishedTime.length > 0) ? this.processFinishedTime[0] : '';  //审核通过时间-开始
      this.formData.finishedTimeItemEndDate = (this.processFinishedTime && this.processFinishedTime.length > 0) ? this.processFinishedTime[1] : '';  //审核通过时间-结束

      this.formData.finishedTimePreBidStartDate = (this.finishedTimePreBidDate && this.finishedTimePreBidDate.length > 0) ? this.finishedTimePreBidDate[0] : '';  //标前评审流程审时间-开始
      this.formData.finishedTimePreBidEndDate = (this.finishedTimePreBidDate && this.finishedTimePreBidDate.length > 0) ? this.finishedTimePreBidDate[1] : '';  //标前评审流程审批时间-结束

      this.formData.finishedTimeBidStartDate = (this.finishedTimeBidDate && this.finishedTimeBidDate.length > 0) ? this.finishedTimeBidDate[0] : '';  //投标文件评审/资格预审文件评审流程审批通过时间-开始
      this.formData.finishedTimeBidEndDate = (this.finishedTimeBidDate && this.finishedTimeBidDate.length > 0) ? this.finishedTimeBidDate[1] : '';  //投标文件评审/资格预审文件评审流程审批通过时间-结束

      this.formData.finishedTimeBidResultStartDate = (this.finishedTimeBidResultDate && this.finishedTimeBidResultDate.length > 0) ? this.finishedTimeBidResultDate[0] : '';  //开标结果审批通过时间-开始
      this.formData.finishedTimeBidResultEndDate = (this.finishedTimeBidResultDate && this.finishedTimeBidResultDate.length > 0) ? this.finishedTimeBidResultDate[1] : '';  //开标结果审批通过时间-结束
      this.$emit('search',this.formData)
    },
    resetFn() {
      this.formData = {};
      this.processFinishedTime = [];  //审核通过时间
      this.estimatedBiddingDate =[];  //预估投标时间
      this.bidDeadlineDate = [];  //投标截止时间
      this.finishedTimePreBidDate = []; //标前评审流程审时间
      this.finishedTimeBidDate = [];  //投标文件评审/资格预审文件评审流程审批通过时间
      this.finishedTimeBidResultDate = [];  //开标结果审批通过时间
      this.$emit('search',this.formData)
    },
    exportFn() { 
      this.$emit('exportExcel',this.formData)
    },
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