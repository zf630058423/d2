import request from '@/utils/request'

//查询发票认领信息
export const getInvoiceInfo = (myId) => {
  return request({
    url: '/extend/financialadministration/invoicecollection/getInvoiceClaimInfo',
    method: 'post',
    data:myId
  })
};

//提交发票认领信息
export const submitInvoiceInfo = (data) => {
  return request({
    url: '/extend/financialadministration/invoicecollection/invoiceBatchClaim',
    method: 'post',
    data
  })
};
