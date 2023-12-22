

import request from '@/utils/request'

//获取发版数据
export const getRelease = () => {
    return request({
        url: '/extend/versionupgrade/query',
        method: 'get',
    })
}
//获取发版表单数据
export const getReleaseTable = () => {
    return request({
        url: '/extend/versionupgrade/formListAll',
        method: 'get',
    })
}

//数据建模发布
export const refreshColumnState = (data) => {
    return request({
        url: '/tableRefresh/refreshColumnState',
        method: 'post',
        data
    })
}

//数据字典全量导出
export const downLoadDataDictXml = () => {
    return request({
        url: '/ImprotUp/downLoadDataDictXml',
        method: 'get',
    })
}

//数据字典导入
export const uploadImportDataDictXml = (data) => {
    return request({
        url: '/ImprotUp/uploadImportDataDictXml',
        method: 'post',
        data
    })
}


//流水管理号导入
export const uploadImportSerialNumXml = (data) => {
    return request({
        url: '/ImprotUp/uploadImportSerialNumXml',
        method: 'post',
        data
    })
}

//流水号全量导出
export const downLoadSerialNumXml = () => {
    return request({
        url: '/ImprotUp/downLoadSerialNumXml',
        method: 'get',
    })
}

//自定义对话框导入
export const uploadImportCustomDialogXml = (data) => {
    return request({
        url: '/ImprotUp/uploadImportCustomDialogXml',
        method: 'post',
        data
    })
}
//自定义对话框全量导出
export const downLoadCustomDialogXml = () => {
    return request({
        url: '/ImprotUp/downLoadCustomDialogXml',
        method: 'get',
    })
}



//自定义列表全量导出
export const downLoadCustomDataGridXml = () => {
    return request({
        url: '/ImprotUp/downLoadCustomDataGridXml',
        method: 'get',
    })
}


//自定义列表导入
export const uploadImportCustomDataGridXml = (data) => {
    return request({
        url: '/ImprotUp/uploadImportCustomDataGridXml',
        method: 'post',
        data
    })
}



//菜单管理全量导出
export const downLoadResourceXml = () => {
    return request({
        url: '/ImprotUp/downLoadResourceXml',
        method: 'get',
    })
}

//菜单管理导入
export const uploadImportResourceXml = (data) => {
    return request({
        url: '/ImprotUp/uploadImportResourceXml',
        method: 'post',
        data
    })
}




//表单导出
export const downLoadFormXml = (data) => {
    return request({
        url: '/release/exportUpgradePackage',
        method: 'post',
        data
    })
}

//模型导出
export const downLoadModelXml = (data) => {
    return request({
        url: '/release/downLoadDataModel',
        method: 'get',
        data
    })
}

// //表单导出
// export const downLoadFormXml = (data) => {
//     return request({
//         url: '/ImprotUp/downLoadFormXml',
//         method: 'post',
//         data
//     })
// }

// //表单导入
// export const uploadImportFormXml = (data) => {
//     return request({
//         url: '/ImprotUp/uploadImportFormXml',
//         method: 'post',
//         data
//     })
// }

//表单导入
export const uploadImportFormXml = (data) => {
    return request({
        url: '/release/importUpgradePackage',
        method: 'post',
        data
    })
}



//数据服务管理导入
export const uploadImportDataService = (data) => {
    return request({
        url: '/ImprotUp/uploadImportDataService',
        method: 'post',
        data
    })
}



//角色管理导入
export const improtRoles = (data) => {
    return request({
        url: '/ImprotUp/improtRoles',
        method: 'post',
        data
    })
}

//标签管理导入
export const improtDepart = (data) => {
    return request({
        url: '/ImprotUp/improtDepart',
        method: 'post',
        data
    })
}



//流程导入
export const uploadImportProcessAppXmlBatch = (data) => {
    return request({
        url: '/workflow/workflowManage/uploadImportProcessAppXmlBatch',
        method: 'post',
        data
    })
}



//流程导出
export const downloadProcessAppXmlBatch = (data) => {
    return request({
        url: '/workflow/workflowManage/downloadProcessAppXmlBatch',
        method: 'post',
        data
    })
}

//模型导入
export const importModelXml = (data) => {
    return request({
        url: '/release/improtDataModel',
        method: 'put',
        data
    })
}

//查询发版功能列表
export const queryModel = (data) => {
    return request({
        url: '/extend/versionupgrade/query',
        method: 'get',
        data
    })
}