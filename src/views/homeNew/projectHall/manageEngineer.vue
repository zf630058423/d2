<template>
  <div class="manageEngineer" v-loading.fullscreen.lock="fullscreenLoading">
    <div class="ml10 mr10 p15 mb20 bg-white">
      <span class="demonstration">年 份：</span>
      <el-date-picker
        v-model="getTime"
        type="year"
        style="width: 250px"
        size="small"
        placeholder="选择年份">
      </el-date-picker>
      <el-button type="primary" style="margin-left: 20px" @click="openFullScreen1" size="small">查 询</el-button>
    </div>
    <div class="ml10 mr10">
      <el-row :gutter="20" class="manageEngineer-chart">
        <el-col :span="10" class="manageEngineer-left-content">
          <el-card class="manageEngineer-chart-card-1 " shadow="never">
            <div slot="header" class="clearfix">
              <span class="card-header-title">年收入合同统计</span>
            </div>
            <div>
              <line-and-bar setId="chart-9" :yearData="contractData"></line-and-bar>
            </div>
          </el-card>

          <el-card class="manageEngineer-chart-card-1 " shadow="never">
            <div slot="header" class="clearfix">
              <span class="card-header-title">年度累计产值统计</span>
            </div>
            <div>
              <line-and-bar setId="chart-10" :yearData="priceData"></line-and-bar>
            </div>
          </el-card>

          <el-card class="manageEngineer-chart-card-1 " shadow="never">
            <div slot="header" class="clearfix">
              <span class="card-header-title">年度累计回款统计</span>
            </div>
            <div>
              <line-and-bar setId="chart-11" :yearData="collectionData"></line-and-bar>
            </div>
          </el-card>

          <el-card class="manageEngineer-chart-card-1 " shadow="never">
            <div slot="header" class="clearfix">
              <span class="card-header-title">收款方式占比</span>
            </div>
            <div>
              <ring-chart setId="chart-12" height="346px" width="718px" :yearData="payAccountData"></ring-chart>
            </div>
          </el-card>

          <el-card class="manageEngineer-chart-card-1 " shadow="never">
            <div slot="header" class="clearfix">
              <span class="card-header-title">产品线占比</span>
            </div>
            <div>
              <ring-chart setId="chart-13" height="346px" width="718px" :yearData="productData"></ring-chart>
            </div>
          </el-card>
        </el-col>

        <el-col :span="14" class="manageEngineer-right-content">
          <el-card class="manageEngineer-chart-card-2 " shadow="never">
            <div slot="header" class="clearfix">
              <span class="card-header-title">各省项目统计</span>
            </div>
            <div class="province-data">
              <el-row :gutter="25">
                  <el-col :span="8">
                    <div class="province-data-item">
                      <div class="province-data-item-img-1"></div>
                      <div class="province-data-item-text">
                        <div class="province-data-item-text-num">{{sumData.projectNum}}</div>
                        <div class="province-data-item-text-label">项目数量(个)</div>
                      </div>
                    </div>
                  </el-col>
                  <el-col :span="8">
                    <div class="province-data-item">
                      <div class="province-data-item-img-2"></div>
                      <div class="province-data-item-text">
                        <div class="province-data-item-text-num">{{sumData.money}}</div>
                        <div class="province-data-item-text-label">项目金额(万)</div>
                      </div>
                    </div>
                  </el-col>
                  <el-col :span="8">
                    <div class="province-data-item">
                      <div class="province-data-item-img-3"></div>
                      <div class="province-data-item-text">
                        <div class="province-data-item-text-num">{{sumData.accumulatedValue}}</div>
                        <div class="province-data-item-text-label">累计完成产值(万)</div>
                      </div>
                    </div>
                  </el-col>
              </el-row>
            </div>
            <div>
              <map-chart ref="map" :yearData="mapData"></map-chart>
            </div>
          </el-card>
          <el-card class="manageEngineer-chart-card-1 " shadow="never">
            <div slot="header" class="clearfix">
              <span class="card-header-title">年度累计产值占比</span>
            </div>
            <div>
              <pir-chart setId="chart-14" width="718px" height="346px" :yearData="priceProportionData"></pir-chart>
            </div>
          </el-card>
          <el-card class="manageEngineer-chart-card-1 " shadow="never">
            <div slot="header" class="clearfix">
              <span class="card-header-title">年度累计回款占比</span>
            </div>
            <div>
              <pir-chart setId="chart-15" width="718px" height="346px" :yearData="receivableData"></pir-chart>
            </div>
          </el-card>
          <div>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-card class="manageMarketing-chart-card-1 " shadow="never">
                  <div slot="header" class="clearfix">
                    <span class="card-header-title">百名优质材料供应商</span>
                  </div>
                  <div>
                    <el-table :data="tableData_1" style="width: 100%" v-bind:header-cell-style="{background:'#ffffff',color:'#000000',fontWeight:'bold'}" height="336px">
                      <el-table-column type="index" width="50" label="序号">
                      </el-table-column>
                      <el-table-column label="名称" :show-tooltip-when-overflow="true" width="150">
                        <template slot-scope="scope">
                          <span >{{ scope.row.supplier }}</span>
                        </template>
                      </el-table-column>
                      <el-table-column label="类型" width="100" align="center">
                        <template slot-scope="scope">
                          <span >{{ scope.row.customerCategory }}</span>
                        </template>
                      </el-table-column>
                      <el-table-column label="合作金额(万)" width="120" align="center">
                        <template slot-scope="scope">
                          <span >{{Object.tofixed(Number(scope.row.totalContractAmount))}}</span>
                        </template>
                      </el-table-column>
                      <el-table-column label="合作项目(个)" width="120" align="center">
                        <template slot-scope="scope">
                          <span >{{ scope.row.projectNum }}</span>
                        </template>
                      </el-table-column>
                      <el-table-column label="供应商满意度" width="120" align="center">
                        <template slot-scope="scope">
                          <span v-if="scope.row.satisfaction >= 0">{{ scope.row.satisfaction }} 颗星</span>
                        </template>
                      </el-table-column>
                    </el-table>
                  </div>
                </el-card>
              </el-col>
              <el-col :span="12">
                <el-card class="manageMarketing-chart-card-1 " shadow="never">
                  <div slot="header" class="clearfix">
                    <span class="card-header-title">百名优质劳务供应商</span>
                  </div>
                  <div>
                    <el-table :data="tableData_2" style="width: 100%" v-bind:header-cell-style="{background:'#ffffff',color:'#000000',fontWeight:'bold'}" height="336px">
                      <el-table-column type="index" width="50" label="序号">
                      </el-table-column>
                      <el-table-column label="名称" :show-tooltip-when-overflow="true"  width="150">
                        <template slot-scope="scope">
                          <span >{{ scope.row.supplier }}</span>
                        </template>
                      </el-table-column>
                      <el-table-column label="类型" width="100">
                        <template slot-scope="scope">
                          <span >{{ scope.row.customerCategory }}</span>
                        </template>
                      </el-table-column>
                      <el-table-column label="合作金额(万)" width="120">
                        <template slot-scope="scope">

                          <span >{{Object.tofixed(Number(scope.row.totalContractAmount))}}</span>
                        </template>
                      </el-table-column>
                      <el-table-column label="合作项目(个)" width="120" align="center">
                        <template slot-scope="scope">
                          <span >{{ scope.row.projectNum }}</span>
                        </template>
                      </el-table-column>
                      <el-table-column label="供应商满意度" width="120" align="center">
                        <template slot-scope="scope">
                          <span v-if="scope.row.satisfaction >= 0">{{ scope.row.satisfaction }} 颗星</span>
                        </template>
                      </el-table-column>
                    </el-table>
                  </div>
                </el-card>
              </el-col>
            </el-row>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
  import LineAndBar from './projectMarketCharts/LineAndBar';
  import RingChart from './projectMarketCharts/Ring'
  import PirChart from  './projectMarketCharts/Pie';
  //import MapChart from './projectMarketCharts/Map';
  import MapChart from './projectMarketCharts/MapChart';
  import api from '@/Api/home/homeNew';

  export default {
    name: "manageEngineer",
    components:{
      LineAndBar,RingChart,PirChart,MapChart
    },
    data() {
      return {
        value1: '',
        value2: '',
        fullscreenLoading: false,
        getTime: null,
        getYearNum: null,
        contractData: [],
        priceData: [],
        collectionData:[],
        productData: [],
        priceProportionData: [],
        payAccountData: [],
        receivableData: [],
        mapData: [],
        tableData_1:[],
        tableData_2:[],
        sumData:{
          accumulatedValue: 0,
          money: 0,
          projectNum: 0
        },
        tableData: [{
          date: '2016-05-02',
          name: '王小虎',
          number: 20,
          tag: '家'
        }, {
          date: '2016-05-04',
          name: '王小虎',
          number: 20,
          tag: '公司'
        }, {
          date: '2016-05-01',
          name: '王小虎',
          number: 20,
          tag: '家'
        }, {
          date: '2016-05-03',
          name: '王小虎',
          number: 20,
          tag: '公司'
        },{
          date: '2016-05-02',
          name: '王小虎',
          number: 20,
          tag: '家'
        }, {
          date: '2016-05-04',
          name: '王小虎',
          number: 20,
          tag: '公司'
        }, {
          date: '2016-05-01',
          name: '王小虎',
          number: 20,
          tag: '家'
        }, {
          date: '2016-05-03',
          name: '王小虎',
          number: 20,
          tag: '公司'
        }],
        currIndex:0
      }
    },
    mounted(){

    },
    methods:{
      // 获取本年收入合同
      getNowYearData(){
        var that = this;
        let date = new Date();
        that.getTime = date;
        if(that.getTime){
          that.openFullScreen1();
        }
      },
      // 查询年度
      handelQueryData(){
        let date = new Date(this.getTime);
        let year = date.getFullYear();
        this.getYearNum = year;

        let urlArray = [  //管理层接口汇总
           {key:'contractData',api:api.contractData,url:'/projecthall/projectmanage/getAnnualRevenueContract'},   //收入合同
           {key:'priceData',api:api.priceData,url:'/projecthall/projectmanage/queryGraphAnnualCumulative'},   //累计产值
           {key:'collectionData',api:api.collectionData,url:'/projecthall/projectmanage/queryAnCumulativePayCollect'},   //累计回款
           {key:'productData',api:api.productData,url:'/projecthall/projectmanage/queryProductProportion'},   //产品线占比
           {key:'priceProportionData',api:api.priceProportionData,url:'/projecthall/projectmanage/queryPropAnCumulative'},   //产值占比
           {key:'payAccountData',api:api.payAccountData,url:'/projecthall/projectmanage/queryPayAccountProportion'},   //收入方式占比
           {key:'receivableData',api:api.receivableData,url:'/projecthall/projectmanage/queryProportReceivable'},  //回款占比
           {key:'sumData',api:api.sumData,url:'/projecthall/projectmanage/queryMapData'},  //地图汇总
           {key:'tableData_1',api:api.tableData_1_reg,url:'/projecthall/projectmanage/getTopHundredMaterialSupplier'},  //百名优秀材料供应商
           {key:'tableData_2',api:api.tableData_2,url:'/projecthall/projectmanage/getOneHundredQualityLaborSuppliers'},  //百名优秀劳务供应商
        ]

        this.fnExtendAjax(urlArray, year);

        // 收入合同
        // $.extendAjax(`/projecthall/projectmanage/getAnnualRevenueContract?year=${year}`, '', "get", function (res) {
        //   if(res.code === 200){
        //     that.contractData = res.data;
        //   }
        // });
        // 累计产值
        // $.extendAjax(`/projecthall/projectmanage/queryGraphAnnualCumulative?year=${year}`, '', "get", function (res) {
        //   if(res.code === 200){
        //     that.priceData = res.data;
        //   }
        // });
        // 累计回款
        // $.extendAjax(`/projecthall/projectmanage/queryAnCumulativePayCollect?year=${year}`, '', "get", function (res) {
        //   console.log("累计回款：",res);
        //   if(res.code === 200){
        //     that.collectionData = res.data;
        //   }
        // });
        // 产品线占比
        // $.extendAjax(`/projecthall/projectmanage/queryProductProportion?year=${year}`, '', "get", function (res) {
        //   if(res.code === 200){
        //     that.productData = res.data;
        //   }
        // });
        // 产值占比
        // $.extendAjax(`/projecthall/projectmanage/queryPropAnCumulative?year=${year}`, '', "get", function (res) {
        //   if(res.code === 200){
        //     that.priceProportionData = res.data;
        //   }
        // });

        // 收入方式占比
        // $.extendAjax(`/projecthall/projectmanage/queryPayAccountProportion?year=${year}`, '', "get", function (res) {
        //   if(res.code === 200){
        //     that.payAccountData = res.data;
        //   }
        // });
        // 回款占比
        // $.extendAjax(`/projecthall/projectmanage/queryProportReceivable?year=${year}`, '', "get", function (res) {
        //   if(res.code === 200){
        //     that.receivableData = res.data;
        //   }
        // });
        // 地图汇总
        // $.extendAjax(`/projecthall/projectmanage/queryMapData?year=${year}`, '', "get", function (res) {
        //   if(res.code === 200){
        //     const arr = res.data;
        //     if(arr.length > 0){
        //       that.sumData = arr[0];
        //     }
        //   }
        // });
        // 百名优秀材料供应商
        // $.extendAjax(`/projecthall/projectmanage/getTopHundredMaterialSupplier?year=${year}`, '', "get", function (res) {
        //   if(res.code === 200){
        //     that.tableData_1 = res.data;
        //   }
        // });
        // 百名优秀劳务供应商
        // $.extendAjax(`/projecthall/projectmanage/getOneHundredQualityLaborSuppliers?year=${year}`, '', "get", function (res) {
        //   if(res.code === 200){
        //     that.tableData_2 = res.data;
        //   }
        // });
        // 地图数据
        this.getMapData();
      },
     async fnExtendAjax(urlArray, year){
        let _this = this;
        if(_this.currIndex == urlArray.length) {
          _this.fullscreenLoading = false;
          _this.currIndex = 0;
          return;
        }
        else {
          try {
            let item = urlArray[_this.currIndex];
            let res = await item.api({year: year});
              if(item.key === 'sumData'){  //如果是地图汇总
                _this[item.key] = res.data && res.data.length > 0 ? res.data[0] : [];
              }else{
                _this[item.key] = res.data || [];
              }
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
        this.fullscreenLoading = true;
        this.handelQueryData();
      },
      // 获取值
     async getMapData(){
        let _this = this;
        let obj = {
          "year": _this.getYearNum,
          "money": _this.sumData.money ? _this.sumData.money : 0
        };
        let { data } = await api.getMapData(obj);
        _this.fullscreenLoading = false;
        _this.mapData = data;
      },
    }
  }
</script>

<style scoped>
  @import "~@/resources/css/workSpace.css";

  .manageEngineer {
    width: 100%;
  }

  .manageEngineer-left-content, .manageEngineer-right-content {
    min-height: 856px;
  }

  .manageEngineer-chart-card-1 {
    height: 418px;
    background: #FFFFFF;
    opacity: 1;
    border-radius: 4px;
    margin-bottom: 20px;
  }

  .manageEngineer-chart-card-2 {
    height: 856px;
    background: #FFFFFF;
    opacity: 1;
    border-radius: 4px;
    margin-bottom: 20px;
  }

</style>
