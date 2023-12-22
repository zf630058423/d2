//钉钉集成授权接口
import request from '@/utils/request'

const DINGTALKLOGIN = '/extend/workflow/';

export default {
    getWorkflowTask: async (wiid) => {
        return await request({
            url: DINGTALKLOGIN + `/getWorkflowTask?wiid=${wiid}`,
            method: 'get',
        })
    }
}

