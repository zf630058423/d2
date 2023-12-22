//项目维修申请列表
export const getRepairRequest = (data) => {

    console.log("api:", data);
    // return $.extendAjax({
    //     // url: '/extend/projectMaintenanceApplication/queryPageProjectMaintenanceApplication',
    //     url:data.url,
    //     method: 'get',
    //     data:JSON.stringify(data),
    // })

    // return $.extendAjax(data.url,'get',JSON.stringify(data),false,'get')
}


/*********************Aajx操作***************
//获取json数据ajax请求 methodName:方法名,
//methodName可为null, 为null时默认请求地址方法，如 handler的 ProcessRequest
//async是否异步：默认false,异步请求需要传入回调函数
//data Json参数如{a:"aValue",b:"bValue"}
//data 数组参数形式[{name:"a",value"aValue"},{name:"b",value"bValue"}]
//type:请求类别默认post
//dataType:预期服务器返回的数据类型[string,xml,html,script,json(默认),text]
//isloading:是否加载遮罩层，默认为true
function _ajaxJson(url, method, data, async, type, callback, dataType, isloading) {
}
***************************/
//项目维修申请新增
export const addRepairRequest = (params) => {
    return $.extendAjax({
        url: '/extend/projectMaintenanceApplication/addProjectMaintenanceApplication',
        method: 'POST',
        data: params,
    })
}

