<template>
  <div class="manageMarketing" v-loading.fullscreen.lock="fullscreenLoading">
    <div class="ml10 mr10 p15 mb20 bg-white">
      <span class="demonstration">年 份：</span>
      <el-date-picker
        v-model="getTime"
        style="width: 250px"
        type="year"
        value-format="yyyy"
        size="small"
        placeholder="选择年份">
      </el-date-picker>
      <el-button type="primary" style="margin-left: 20px" @click="openFullScreen1" size="small" :disabled="isBtn">查 询</el-button>
    </div>
    <div class="ml10 mr10">
      <el-row :gutter="20" class="manageMarketing-chart">
        <el-col :span="10" class="manageMarketing-left-content">
          <el-card class="manageMarketing-chart-card-1 " shadow="never">
            <div slot="header" class="clearfix">
              <span class="card-header-title">年度立项造价统计</span>
            </div>
            <div>
              <line-and-bar setId="chart-1" :yearData="projectCostData"></line-and-bar>
            </div>
          </el-card>
          <el-card class="manageMarketing-chart-card-1 " shadow="never">
            <div slot="header" class="clearfix">
              <span class="card-header-title">年度中标金额统计</span>
            </div>
            <div>
              <line-and-bar setId="chart-2" :yearData="bidAmountData"></line-and-bar>
            </div>
          </el-card>
          <el-card class="manageMarketing-chart-card-1 " shadow="never">
            <div slot="header" class="clearfix">
              <span class="card-header-title">年度中标率曲线图</span>
            </div>
            <div>
              <line-chart setId="chart-3" :yearData="bidRateData"></line-chart>
            </div>
          </el-card>
          <el-card class="manageMarketing-chart-card-1 " shadow="never">
            <div slot="header" class="clearfix">
              <span class="card-header-title">年度投标转化率曲线图</span>
            </div>
            <div>
              <line-chart setId="chart-4" :yearData="TDReviewRateData"></line-chart>
            </div>
          </el-card>
        </el-col>
        <el-col :span="14" class="manageMarketing-right-content">
          <el-card class="manageMarketing-chart-card-1 " shadow="never">
            <div slot="header" class="clearfix">
              <span class="card-header-title">年度立项造价占比</span>
            </div>
            <div>
              <pir-chart setId="chart-5" width="100%" height="346px" :yearData="projectPieData"></pir-chart>
            </div>
          </el-card>
          <div>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-card class="manageMarketing-chart-card-1 " shadow="never">
                  <div slot="header" class="clearfix">
                    <span class="card-header-title">中标产品线占比</span>
                  </div>
                  <div>
                    <ring-chart setId="chart-8" height="346px" width="100%" :yearData="productlineData"></ring-chart>
                  </div>
                </el-card>
              </el-col>
              <el-col :span="12">
                <el-card class="manageMarketing-chart-card-1 " shadow="never">
                  <div slot="header" class="clearfix">
                    <span class="card-header-title">招标方式占比</span>
                  </div>
                  <div>
                    <ring-chart setId="chart-7" width="100%" height="346px" :yearData="tenderingMannerData"></ring-chart>
                  </div>
                </el-card>
              </el-col>
            </el-row>
          </div>
          <el-card class="manageMarketing-chart-card-1 " shadow="never">
            <div slot="header" class="clearfix">
              <span class="card-header-title">年度中标金额占比</span>
            </div>
            <div>
              <ring-chart setId="chart-6" width="100%" height="346px" :yearData="bidOpeningData"></ring-chart>
            </div>
          </el-card>
          <el-card class="manageMarketing-chart-card-1 " shadow="never">
            <div slot="header" class="clearfix">
              <span class="card-header-title">百名合作满意度高客户</span>
            </div>
            <div>
              <el-table :data="tableData_1" style="width: 100%" v-bind:header-cell-style="{background:'#ffffff',color:'#000000',fontWeight:'bold'}" height="346px">
                <el-table-column type="index" width="50" label="序号">
                </el-table-column>
                <el-table-column label="名称" show-tooltip-when-overflow align="center">
                  <template slot-scope="scope">
                    <span >{{ scope.row.customerName }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="类型" align="center" >
                  <template slot-scope="scope">
                    <span >{{ scope.row.categoryName }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="合作项目" align="center">
                  <template slot-scope="scope">
                    <span >{{ scope.row.projectNum }}个</span>
                  </template>
                </el-table-column>
                <el-table-column label="合作金额(万)" align="center">
                  <template slot-scope="scope">
                    <span >{{Object.tofixed(Number(scope.row.projectAmount))}} 万</span>
                  </template>
                </el-table-column>
                <el-table-column label="满意度" align="center">
                  <template slot-scope="scope">
                    <span v-if="scope.row.satisfaction">{{ scope.row.satisfaction }}颗星</span>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
  import LineAndBar from './projectMarketCharts/LineAndBar';
  import LineChart from './projectMarketCharts/mLine';
  import PirChart from  './projectMarketCharts/Pie';
  import RingChart from './projectMarketCharts/Ring'
  import api from '@/Api/home/homeNew';
  
  export default {
    name: "manageMarketing",
    components:{
      LineAndBar,LineChart,PirChart,RingChart
    },
    data() {
      return {
        form: {},
        getTime: null,
        isBtn: false,
        value1: '',
        value2: '',
        fullscreenLoading: false,
        projectCostData:[],
        bidAmountData:[],
        TDReviewRateData:[],
        projectPieData: [],
        bidRateData:[],
        bidOpeningData:[],
        productlineData:[],
        tenderingMannerData:[],
        tableData_1:[],
        currIndex:0
      }
    },
    mounted(){
    },
    methods: {
      // 查询年度收入合同
      getNowYearData(){
        let date = new Date();
        this.getTime = date;
        if(this.getTime){
          this.openFullScreen1();
        }
      },
      // 查询年度
     handelQueryData(){
        let date = new Date(this.getTime);
        let year = date.getFullYear();

        let ajaxArray = [
          {key:'projectCostData',api:api.projectCostData,url:'/projecthall/marketingmanage/queryYearProjectInitiationCost'},  //年度立项造价
          {key:'bidAmountData',api:api.bidAmountData,url:'/projecthall/marketingmanage/queryYearBidWinningAmount'},  //年度中标金额
          {key:'TDReviewRateData',api:api.TDReviewRateData,url:'/projecthall/marketingmanage/queryYearTenderDocumentReviewRate'}, //年度投标转化率
          {key:'bidRateData',api:api.bidRateData,url:'/projecthall/marketingmanage/queryYearBidWinningRate'},   //年度中标率曲线
          {key:'tableData_1',api:api.tableData_1,url:'/projecthall/marketingmanage/getCustomerSatisfaction'},  //百名合作满意度高客户
          {key:'projectPieData',api:api.projectPieData,url:'/projecthall/marketingmanage/queryMarketingProjectPieChart'},  //年度立项造价占比
          {key:'bidOpeningData',api:api.bidOpeningData,url:'/projecthall/marketingmanage/queryBidOpeningResultPieChart'},  //年度中标金额占比
          {key:'tenderingMannerData',api:api.tenderingMannerData,url:'/projecthall/marketingmanage/queryBidOpeningResultBiddingForm'},  //招标方式占比
          {key:'productlineData',api:api.productlineData,url:'/projecthall/marketingmanage/queryBidOpeningResultProductline'},  //中标产品线占比
        ]

        this.fnExtendAjax(ajaxArray, year);
      },
     async fnExtendAjax(urlArray, year){
        let _this = this;
        if(_this.currIndex == urlArray.length) {
          _this.fullscreenLoading = false;
          _this.isBtn = false;
          _this.currIndex = 0;
          return;
        }
        else {
          let item = urlArray[_this.currIndex];
         try {
          let res = await item.api({year: year});
         _this[item.key] = res.data || [];
         } catch (error) {
          _this.fullscreenLoading = false;
          _this.isBtn = false;
          throw new Error("接口执行错误", error)
         } finally {
          _this.currIndex ++;
          _this.fnExtendAjax(urlArray, year);
         }
          
        }
      },
      openFullScreen1() {
        var that = this;
        that.fullscreenLoading = true;
        that.isBtn = true;
        that.handelQueryData();
      }

    }
  }
</script>

<style scoped>
  @import "~@/resources/css/workSpace.css";

  .manageMarketing {
    /*border: 1px solid;*/
  }

  .manageMarketing-left-content, .manageMarketing-right-content {
    min-height: 856px;
    /*background: #FAFAFA;*/
    /*border: 1px solid;*/
  }

  .manageMarketing-chart-card-1 {
    width: 100%;
    height: 418px;
    /*background: rgba(255, 255, 255, 0.39);*/
    opacity: 1;
    background: #FFFFFF;
    border-radius: 4px;
    margin-bottom: 20px;
  }

  .manageMarketing-chart-card-2 {
    height: 856px;
    /*background: rgba(255, 255, 255, 0.39);*/
    opacity: 1;
    background: #FFFFFF;
    border-radius: 4px;
    margin-bottom: 20px;
  }

  .manageMarketing .demonstration {
    font-size: 13px;
    font-family:"Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
    font-weight: 500;
    line-height: 18px;
    color: #000000;
    opacity: 1;
  }

  .manageMarketing .manageMarketing-chart-content {
    width: 718px;
    height: 346px;
    /*border: 1px solid;*/
  }
</style>
