
// 员工费用报销页面接口
import request from '@/utils/request'

// --新增员工费用报销接口-----
// ---http://{{ip}}/extend/finance/collectmoney/eer/addEmployeeExpenseReimbursement---
export const addEmployeeExpenseReimbursement = (id) => {
    return request({
        url: '/extend/finance/collectmoney/eer/queryEmployeeExpenseReimbursement?id='+id,
        method: 'get',
    })
}
//银企直连认领
export const claimBank = (data) => {
    return request({
        url: '/extend/finance/bankdirectCollection/modifyClaimStatusByIds',
        method: 'post',
        data
    })
}

//票据收款认领
export const billClaimBank = (data) => {
    return request({
        url: '/extend/finance/billcollertionclaim/modifyClaimStatusByIds',
        method: 'post',
        data
    })
}

//票据收款认领
export const writeBack = (data) => {
    return request({
        url: '/extend/finance/bankdirectCollection/writeBackData',
        method: 'post',
        data
    })
}

//发票信息采集认领 查询金额
export const getMonkeyById = (id) => {
    return request({
        url: `/extend/financialadministration/invoicecollection/getContractClaimAmount?myid=${id}`,
        method: 'get',
        
    })
}


//更新发票原件信息
export const updateInvicoedInfo = (data) => {
    return request({
        url: `/extend/financialadministration/invoicecollection/batchUpdateReceivedOriginalInvoice`,
        method: 'post',
        data
        
    })
}

//发票信息采集批量更新异常已经罚款

export const updateInvicoedError = (data) => {
    return request({
        url: `/extend/financialadministration/invoicecollection/batchUpdateAbnormalFinePaid`,
        method: 'post',
        data
        
    })
}

//发票信息采集导入
export const importExcel = (data) => {
    return request({
        url: `/extend/financialadministration/invoicecollection/checkInvoiceNo`,
        processData: false, // 默认不处理数据
        contentType: false, // 默认不设置内容类型
        method: 'post',
        data
        
    })  
}

//导入再次确定
export const importExcelConfirm = (data) => {
    return request({
        url: `/workflow/security/CommonImport/uploadImportExcel`,
        processData: false, // 默认不处理数据
        contentType: false, // 默认不设置内容类型
        method: 'post',
        data
    })
}

//数据建模导入模型定义校验
export const uploadImportFormDefXmlCheck = (data) => {
    return request({
        url: `/workflow/smartForm/uploadImportFormDefXml_Check`,
        processData: false, // 默认不处理数据
        contentType: false, // 默认不设置内容类型
        method: 'post',
        data
    })
}

//数据建模导入模型定义 
export const uploadImportFormDefXml = (data) => {
    return request({
        url: `/workflow/smartForm/uploadImportFormDefXml`,
        processData: false, // 默认不处理数据
        contentType: false, // 默认不设置内容类型
        method: 'post',
        data
    })
}

//确认重开
export const confirmReopen = (myId) => {
    return request({
        url: `/applicationmakeoutinvoice/confirmReopen?myId=${myId}`,
        method: 'get',
    })
}

//确认重开
export const baiwangReopen = (myId,baiWangTicket) => {
    return request({
        url: `/applicationmakeoutinvoice/baiWangConfirmReopen?myId=${myId}&baiWangTicket=${baiWangTicket}`,
        method: 'get',
    })
}

//关联预缴
export const relevancePrepay = (data) => {
    return request({
        url: `/applicationmakeoutinvoice/relatedPrepayment`,
        method: 'post',
        data
    })
}


