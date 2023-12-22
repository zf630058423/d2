import service from '@/utils/services';

const INVOICE = `/extend/financialadministration/invoicecollection`;

/**
 * 获取发票信息采集列表
 */
export const getList = (params) => {
  // return service.post(`/workflow/fuiFramework/getViewTableListData`, params);
   return service.post(`${INVOICE}/list`, params, {
    action: '获取发票信息采集列表',
  });
}

//校验推费用预提单
export const checkOutPushExpenseApi = (params) => { 
  return service.post(`${INVOICE}/checkOutInvoiceDataPushExpenseHolding`, params, {
    action:'校验推费用预提单'
  })
}

//推费用预提单
export const pushExpenseHoldingApi = (params) => { 
  return service.post(`${INVOICE}/pushExpenseHolding`, params, {
    action:'推费用预提单'
  })
}

//确认复核
export const invoiceCollectionUpdateReviewApi = (params) => { 
  return service.post(`${INVOICE}/InvoiceCollectionUpdateReview`, params, {
    action: '复核'
  })
}

//取消复核
export const invoiceCollectionCancelReviewApi = (params) => { 
  return service.post(`${INVOICE}/oneClickReviewInvoiceCollectionUpdate`, params, {
    action: '取消复核'
  })
}

//删除
export const delTableModelApi = (params) => {
  return service.get(`/workflow/security/customDataGrid/deleteCustomDataGridTableModel`, {
    params,
    action: '删除',
  })
}


//发票信息采集 导出
export const exportApi = (params) => {
  return service.download(`${INVOICE}/exportData`, {
    type: 'json',
    timeout: 600000,  //导出等待10分钟
    isLoading: false, // 是否有加载提示
    loadingMsg: '导出中', // 提示信息
    fileName:'发票信息采集',
    'Content-Type': 'application/json; charset=utf-8',
    params // 传的参数
   })
}