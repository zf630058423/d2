import service from '@/utils/services';

const EXTENDRATEOFPROGRESS = '/extend/rateOfProgress';

export default {

  /**
   * 非设计类项目数量转化率
   * @returns 
   */
  numberNoDesignApi(params) {
    return service.get(EXTENDRATEOFPROGRESS + `/impl/outvalfofill/numberNoDesign`, {
      params,
      action: '非设计类项目数量转化率',
    });
  },

  /**
   * 非设计类项目数量转化率(营销立项)
   * @returns 
   */
  getMNumNoDesignApi(params) {
    return service.get(EXTENDRATEOFPROGRESS + `/impl/outvalfofill/getMNumNoDesign`, {
      params,
      action: '非设计类项目数量转化率(营销立项)'
    });
  },

  /**
   * 设计类项目数量转化率
   * @param {*} params 
   * @returns 
   */
  numberDesignApi(params) {
    return service.get(EXTENDRATEOFPROGRESS + `/impl/outvalfofill/numberDesign`, {
      params,
      action: '设计类项目数量转化率',
    });
  },

  /**
   * 设计类项目数量转化率(营销立项)
   * @param {*} params 
   * @returns 
   */
  getMNumDesignApi(params) {
    return service.get(EXTENDRATEOFPROGRESS + `/impl/outvalfofill/getMNumDesign`, {
      params,
      action: '设计类项目数量转化率(营销立项)',
    });
  },

  /**
   * 非设计类项目金额转化率
   * @param {*} params 
   * @returns 
   */
  amountTaxNoDesignApi(params) {
    return service.get(EXTENDRATEOFPROGRESS + `/impl/outvalfofill/amountTaxNoDesign`, {
      params,
      action: '非设计类项目金额转化率',
    });
  },

  /**
   * 设计类项目金额转化
   * @param {*} params 
   * @returns 
   */
  amountTaxDesignApi(params) {
    return service.get(EXTENDRATEOFPROGRESS + `/impl/outvalfofill/amountTaxDesign`, {
      params,
      action: '设计类项目金额转化',
    });
  },
}