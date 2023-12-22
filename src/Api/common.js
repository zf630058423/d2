
import request from '@/utils/request'
//登录到1.0
export const login = (data) => {
    return request({
        url: `/drp/singlePointLogin`,
        method: 'post',
        data
    })
}

//登录到签章平台
export const yqtLogin = (data) => {
    return request({
        url: `/thirdparty/visa/yiqiantong/ssoLogin`,
        method: 'post',
        data
    })
}

//登录到工盟系统
export const gmLogin = () => {
    return request({
        url: `/extend/thirdparty/gomeet/gomeetSinglePointLogin`,
        method: 'get',
    })
}

//首页--导出文件
export const exportDatas = (data,type) => {
  var url;
  if(type === 0){
    url = '/extend/marketing/marketingProject/homePageMarketingProjectExport';
  }else {
    url = '/extend/engineering/exportModel'
  }
  return request({
    url: url,
    method: 'post',
    data: data,
    responseType:'blob'
  })
};

// 资料归档--文件下载
export const batchDownloadFiles = (data) => {
  var url;
  url = '/meansplace/batchDownFiles';
  return request({
    url: url,
    method: 'post',
    data: data,
    responseType:'blob'
  })
};



// 批量文件下载

export function downloadFilesAll(data) {
  return request({
    url: `/workflow/security/baseCommon/batchDownLoadFile`,
    method: 'post',
    responseType: 'blob',
    data
  })
}

//开票 更新附件
export const updateInvoiceFiles = (data) => {
  return request({
    url: '/makeoutinvoice/updateFile',
    method: 'post',
    data,
  })
}

//银企直联收款 批量认领
export const batchClaimBank = (data) => {
  return request({
    url: '/extend/finance/bankdirectCollection/modifyClaimStatus',
    method: 'post',
    data,
  })
}


//查询预警信息
export const getWarningInfo = (id) => {
  return request({
    url: `/home/pushMarketingBiddingFollowMeassage?userId=${id}`,
    method: 'get',
  })
}


//修改客户状态
export const updateCustormStats = (data) => {
  return request({
    url: '/custinfo/modifyCustomerStatus',
    method: 'post',
    data
  })
}