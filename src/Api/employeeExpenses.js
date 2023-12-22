


//员工费用报销详情
export const getRepairRequest = (data) => {
    return $.extendAjax({
        url: '/extend/projectMaintenanceApplication/queryPageProjectMaintenanceApplication',
        method: 'get',
        data:data,
    })
}

//新增员工费用报销
export const addEmployeeExpenseReimbursement = (params) => {
    return $.extendAjax({
        url: '/extend/finance/collectmoney/eer/queryEmployeeExpenseReimbursement',
        method: 'POST',
        data:params,
    })
}

