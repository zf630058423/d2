import service from '@/utils/services';

const MARKETSERVICE = '/projecthall/marketingmanage';
const PROJECTSERVICE = '/projecthall/projectmanage';

export default {

  /**
   * 年度立项造价
   * @returns 
   */
  projectCostData(params) {
    return service.get(MARKETSERVICE + `/queryYearProjectInitiationCost`, {
      params,
      action: '年度立项造价',
    });
  },

  /**
   * 年度中标金额
   * @param {*} params 
   * @returns 
   */
  bidAmountData(params) {
    return service.get(MARKETSERVICE + `/queryYearBidWinningAmount`, {
      params,
      action: '年度中标金额',
    });
  },

  /**
   * 年度投标转化率
   * @param {*} params 
   * @returns 
   */
  TDReviewRateData(params) {
    return service.get(MARKETSERVICE + `/queryYearTenderDocumentReviewRate`, {
      params,
      action: '年度投标转化率',
    });
  },

  /**
   * 年度中标率曲线
   * @param {*} params 
   * @returns 
   */
  bidRateData(params) {
    return service.get(MARKETSERVICE + `/queryYearBidWinningRate`, {
      params,
      action: '年度中标率曲线',
    });
  },

  /**
   * 百名合作满意度高客户
   * @param {*} params 
   * @returns 
   */
  tableData_1(params) {
    return service.get(MARKETSERVICE + `/getCustomerSatisfaction`, {
      params,
      action: '年度立项造价',
    });
  },

  /**
   * 年度立项造价占比
   * @param {*} params 
   * @returns 
   */
  projectPieData(params) {
    return service.get(MARKETSERVICE + `/queryMarketingProjectPieChart`, {
      params,
      action: '年度立项造价占比',
    });
  },

  /**
   * 年度中标金额占比
   * @param {*} params 
   * @returns 
   */
  queryBidOpeningResultPieChart(params) {
    return service.get(MARKETSERVICE + `/queryYearProjectInitiationCost`, {
      params,
      action: '年度中标金额占比',
    });
  },
  /**
  * 招标方式占比
  * @param {*} params 
  * @returns 
  */
  bidOpeningData(params) {
    return service.get(MARKETSERVICE + `/queryBidOpeningResultPieChart`, {
      params,
      action: '招标方式占比',
    });
  },

  /**
   * 招标方式占比
   * @param {*} params 
   * @returns 
   */
  tenderingMannerData(params) {
    return service.get(MARKETSERVICE + `/queryBidOpeningResultBiddingForm`, {
      params,
      action: '招标方式占比',
    });
  },

  /**
   * 中标产品线占比
   * @param {*} params 
   * @returns 
   */
  productlineData(params) {
    return service.get(MARKETSERVICE + `/queryBidOpeningResultProductline`, {
      params,
      action: '中标产品线占比',
    });
  },



  //////////////////////////////////////////////////////////////管理层(工程)接口//////////////////////////////////////////////

  /**
   * 中标产品线占比
   * @param {*} params 
   * @returns 
   */
  contractData(params) {
    return service.get(PROJECTSERVICE + `/getAnnualRevenueContract`, {
      params,
      action: '收入合同',
    });
  },

  /**
   * 累计产值
   * @param {*} params 
   * @returns 
   */
  priceData(params) {
    return service.get(PROJECTSERVICE + `/queryGraphAnnualCumulative`, {
      params,
      action: '累计产值',
    });
  },

  /**
   * 累计回款
   * @param {*} params 
   * @returns 
   */
  collectionData(params) {
    return service.get(PROJECTSERVICE + `/queryAnCumulativePayCollect`, {
      params,
      action: '累计回款',
    });
  },

  /**
  * 产品线占比
  * @param {*} params 
  * @returns 
  */
  productData(params) {
    return service.get(PROJECTSERVICE + `/queryProductProportion`, {
      params,
      action: '产品线占比',
    });
  },

  /**
   * 产值占比
   * @param {*} params 
   * @returns 
   */
  priceProportionData(params) {
    return service.get(PROJECTSERVICE + `/queryPropAnCumulative`, {
      params,
      action: '产值占比',
    });
  },

  /**
  * 收入方式占比
  * @param {*} params 
  * @returns 
  */
  payAccountData(params) {
    return service.get(PROJECTSERVICE + `/queryPayAccountProportion`, {
      params,
      action: '收入方式占比',
    });
  },

  /**
  * 回款占比
  * @param {*} params 
  * @returns 
  */
  receivableData(params) {
    return service.get(PROJECTSERVICE + `/queryProportReceivable`, {
      params,
      action: '回款占比',
    });
  },

  /**
   * 地图汇总
   * @param {*} params 
   * @returns 
   */
  sumData(params) {
    return service.get(PROJECTSERVICE + `/queryMapData`, {
      params,
      action: '地图汇总',
    });
  },

  /**
   * 百名优秀材料供应商
   * @param {*} params 
   * @returns 
   */
  tableData_1_reg(params) {
    return service.get(PROJECTSERVICE + `/getTopHundredMaterialSupplier`, {
      params,
      action: '百名优秀材料供应商',
    });
  },

  /**
   * 百名优秀劳务供应商
   * @param {*} params 
   * @returns 
   */
  tableData_2(params) {
    return service.get(PROJECTSERVICE + `/getOneHundredQualityLaborSuppliers`, {
      params,
      action: '百名优秀劳务供应商',
    });
  },

  /**
   * 地图数据
   * @param {*} params 
   * @returns 
   */
  getMapData(params) {
    return service.post(PROJECTSERVICE + `/queryMapProvince`, params, {
      action: '地图数据',
    });
  },

}