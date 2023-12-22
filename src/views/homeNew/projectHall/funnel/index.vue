<template>
  <div class="funnel-table">
    <el-form ref="form" label-suffix=":" label-width="100px" :model="form" class="funnel-form">
      <el-row :gutter="20">
        <el-col :span="7">
           <el-form-item label="业务中心" prop="marketingCenter">
              <el-input placeholder="请选择" v-model="form.marketingCenter" class="w256" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="7">
            <el-form-item label="业务单元" prop="marketingUnit">
                <el-input placeholder="请选择" v-model="form.marketingUnit" class="w256" clearable></el-input>
            </el-form-item>
        </el-col>
        <el-col :span="10">
            <el-form-item label="审批通过" prop="dateArray">
              <el-date-picker
                class="w300"
                v-model="dateArray"
                type="daterange"
                range-separator="至"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                :picker-options="pickerOptions"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
              </el-date-picker>
              <el-button class="search-btn" type="primary" @click="searchClick">搜索</el-button>
          </el-form-item>
        </el-col>
      </el-row>
      
    </el-form>
    <div class="echarts-table">
      <el-row>
        <el-col :span="12">
          <!-- 非设计类项目数量转化率 -->
          <div ref="noDesignProjectNumEchart" class="echart-d" v-loading="noDesignProjectNumLoading" :element-loading-background="loadingBg"></div>
        </el-col>
        <el-col :span="12">
         <!-- 设计类项目数量转化率 -->
          <div ref="designProjectNumEchart" class="echart-d" v-loading="designProjectNumLoading" :element-loading-background="loadingBg"></div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
           <!-- 非设计类项目金额转化率 -->
           <div ref="noDesignProjectMoneyEchart" class="echart-d" v-loading="noDesignProjectMoneyLoading" :element-loading-background="loadingBg"></div>
        </el-col>
        <el-col :span="12">
           <!-- 设计类项目金额转化率 -->
           <div ref="designProjectMoneyEchart" class="echart-d" v-loading="designProjectMoneyLoading" :element-loading-background="loadingBg"></div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
import api from '@/Api/home/funnel-api';
import chartFun from './echart';

export default {
  name: 'funnelTable',
  data() { 
    return {
      form: {
        marketingCenter:'',  //业务中心
        marketingUnit: '',   //业务单元
        startDate: '',
        endDate:''
      },
      dateArray: [],  //审批通过时间
      noDesignProjectNumLoading: false,
      designProjectNumLoading: false,
      noDesignProjectMoneyLoading: false,
      designProjectMoneyLoading: false,
      loadingBg: '#f3f8ff',
      optionConfig: {
        isShowLegend: true,
        isShowToolBox: false,  //是否显示数据视图、下载
        labelHeight: 70,   //每个label的高度
      },
      searchForm: null,
      pickerOptions: {
        disabledDate(time) { 
          return time.getTime() < new Date('2021-12-31').getTime()
        }
      }
    }
  },
  mounted() { 
    this.initData(this.form);
  },
  methods: {
    //搜索
    searchClick() { 
      let { dateArray, form } = this;
      let dataParams = {
        ...form
      }
      dataParams.startDate = (dateArray && dateArray.length > 0) ? dateArray[0] : '';
      dataParams.endDate = (dateArray && dateArray.length > 0) ? dateArray[1] : '';
      this.searchForm = dataParams;
      this.initData(dataParams);
    },
    initData(dataParams) { 
      this.getNumberNoDesign(dataParams);
      this.getNumberDesign(dataParams);
      this.getamountTaxNoDesignApi(dataParams);
      this.getAmountTaxDesignData(dataParams);
    },
    //非设计类项目数量转化率
    async getNumberNoDesign(params) { 
      this.noDesignProjectNumLoading = true;
      let { data } = await api.numberNoDesignApi(params);
      this.noDesignProjectNumLoading = false;
        let option = {
          ...this.optionConfig,
          type: 1, 
          chartRef: this.$refs.noDesignProjectNumEchart,
          title: '非设计类项目数量转化率',
          data: {
            ...data,
            ...await this.getMNumNoDesignData(params)
          }
        }
      const noDesignProjectNumEchart = this.$echarts.init(option.chartRef);
      noDesignProjectNumEchart.setOption(chartFun.fnOption(option));
      noDesignProjectNumEchart.on('click', (params) => { //漏斗点击事件
        this.myChartClick(params);
      })
    },
    //非设计类项目数量转化率(营销立项)
    async getMNumNoDesignData(params) {
      let { data } = await api.getMNumNoDesignApi(params);
      return {
        yxlx:data.value
      }
    },
    //设计类项目数量转化率(营销立项)
    async getMNumDesignData(params) {
      let { data } = await api.getMNumDesignApi(params);
      return {
        yxlx:data.value
      }
     },
    //设计类项目数量转化率
    async getNumberDesign(params) { 
      this.designProjectNumLoading = true;
      let { data } = await api.numberDesignApi(params);
      this.designProjectNumLoading = false;
        let option = { 
          ...this.optionConfig,
          type: 2,
          chartRef: this.$refs.designProjectNumEchart,
          title: '设计类项目数量转化率',
          data: {
            ...data,
            ...await this.getMNumDesignData(params)
          }
        }
        const designProjectNumEchart = this.$echarts.init(option.chartRef);
        designProjectNumEchart.setOption(chartFun.fnOption(option));
        designProjectNumEchart.on('click', (params) => { //漏斗点击事件
          this.myChartClick(params);
        })
    },
    //非设计类项目金额转化率
    async getamountTaxNoDesignApi(params) { 
      this.noDesignProjectMoneyLoading = true;
      let { data } = await api.amountTaxNoDesignApi(params);
      this.noDesignProjectMoneyLoading = false;
      if (data) { 
        let option = { 
          ...this.optionConfig,
          type: 3,
          chartRef: this.$refs.noDesignProjectMoneyEchart,
          title: '非设计类项目金额转化率',
          data,
        }
        const noDesignProjectMoneyEchart = this.$echarts.init(option.chartRef);
        noDesignProjectMoneyEchart.setOption(chartFun.fnOption(option));
        noDesignProjectMoneyEchart.on('click', (params) => { //漏斗点击事件
          this.myChartClick(params);
        })
      }
    },
    //设计类项目金额转化
    async getAmountTaxDesignData(params) { 
      this.designProjectMoneyLoading = true;
      let { data } = await api.amountTaxDesignApi(params);
      this.designProjectMoneyLoading = false;
      if (data) { 
        let option = { 
          ...this.optionConfig,
          type: 4, 
          chartRef: this.$refs.designProjectMoneyEchart,
          title: '设计类项目金额转化',
          data,
        }
        const designProjectMoneyEchart = this.$echarts.init(option.chartRef);
        designProjectMoneyEchart.setOption(chartFun.fnOption(option));
        designProjectMoneyEchart.on('click', (params) => { //漏斗点击事件
          this.myChartClick(params);
        })
      }
    },
    myChartClick(params) { 
      let urlData = {
          'yxlx': `custGrid_WorkflowForm_BPM_MarketingProject`,  //营销立项
          'bqps': `custGrid_WorkflowForm_BPM_PreBidReview_0268`, //标前评审
          'sglx': `custGrid_WorkflowForm_BPM_TheConstructionProject`,  //施工立项
          'kbjg': 'custGrid_WorkflowForm_BPM_BidOpeningResult', //开标结果
          'tbwjps': `custGrid_WorkflowForm_BPM_TenderDocumentReview_0257`, //投标文件评审
          'jaht': `custGrid_WorkflowForm_BPM_JianAnHeTong_2357`,  //建安合同
          'zgyswjps': `custGrid_WorkflowForm_ZiGeYuShenWenJianPingShen`,  //资格预审文件
          'sjsrht': `custGrid_WorkflowForm_BPM_OtherRevenueContract`,  //设计收入合同
          'sjsglx': `custGrid_WorkflowForm_designcustGrid_WorkflowForm_BPM_TheConstructionProject`,  //设计施工立项
        }
        if (urlData[params.data.id]) { 
          if (this.searchForm) {
            let { marketingCenter, marketingUnit, startDate, endDate } = this.searchForm;
            let funnelData = {
              MarketingCenter: marketingCenter,
              MarketingUnit: marketingUnit,
              StartDate: startDate,
              EndDate: endDate
            }
            localStorage.setItem("funnelData", JSON.stringify(funnelData))
          } else { 
            localStorage.setItem("funnelData", JSON.stringify({}))
          }
          
          let url = `/workflow/security/customDataGrid/customDataGridView/?code=${urlData[params.data.id]}&type=funnel`;
          window.open(url, '_blank')
        }
    }
  }
}
</script>
<style lang="scss" scoped>

@mixin inputStyle{
  height: 32px;
  line-height: 32px;
}
.funnel-table{
 .funnel-form{
    margin: 16px 0 8px 0;
    .el-row {
      width: 100%;
      display: flex;
      height: 50px;

      &:last-child {
        margin-bottom: 0;
      }
    }
    .w184{
      width: 184px;
    }
    .w256{
      width: 256px;
    }
    .w356{
      width: 356px;
    }
    .search-btn{
      margin-left: 16px;
    }

  }
  .echarts-table{
    padding-top: 16px;
  }

  .echart-d{
    width: 50%;
    height: 560px;
    margin: 0 auto;
  }
}
</style>