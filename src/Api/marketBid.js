import service from '@/utils/services';

const EXTEND = '/extend/marketing';

//营销投标台账
export const getData = (params) => {
  // return service.post(`${EXTEND}/marketingBidStatistics/getData`, params, {
  //   action: '营销投标台账',
  // });
  return service.post(`${EXTEND}/marketingBidStatistic/selectStatistic`, params, {
    action: '营销投标台账',
  });
}

//查询产品线
export const getProductlineList = (params) => {
  return service.get(`${EXTEND}/marketingBidStatistic/productlineList`, {
    params,
    action: '查询产品线',
  });
}

//营销投标台账明细表
export const getDetailStatistic = (params) => {
  return service.post(`${EXTEND}/marketingBidStatistic/selectDetailStatistic`, params, {
    action: '营销投标台账明细表',
  });
}

//导出台账明细
export const exportTable = (params) => {
  // return service.get(`/public/export/marketingDetailStatistic`, {
  //   params,
  //   action: '导出台账明细',
  // })
  return service.post(`/public/export/marketingDetailStatistic`, params, {
    action: '导出台账明细',
  });

  // return service.arrayPost(`/public/export/marketingDetailStatistic`, params)
}
