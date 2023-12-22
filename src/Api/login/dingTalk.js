//钉钉集成授权接口
import request from '@/utils/request'

const DINGTALKLOGIN = '/login/dingTalkLogin';

export default {
  loginCode: async (loginWay,code) => {
    let type = 'dingding';
    return await request({
      url: DINGTALKLOGIN + `/loginCode?loginWay=${loginWay}&code=${code}&type=${type}`,
      method: 'post',
    })
  },
  getQRCodeParam: async () => {
    return await request({
      url: DINGTALKLOGIN + '/getQRCodeParam',
      method: 'get',
    })
  }
}

