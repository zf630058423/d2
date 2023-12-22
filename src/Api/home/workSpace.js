//首页工作台接口
import service from '@/utils/services';


const EXTENDMARKING = '/extend/marketing';
const PROJECTSUMMARY = '/extend/projectSummary';
const EXTEND = '/extend';

export default {


  ////////////////////////////////////////////////////日程////////////////////////////
  /**
   * 获取日志列表
   */
  queryMeetingapplyNo(params) {
    return service.post(`/themeetingtoapplyfor/queryMeetingapplyNo`, params, {
      action: '获取日志列表',
    });
  },


  ////////////////////////////////////////////////////////////营销页签数据/////////////////////////////////////

  /**
   * 获取日程数据
   * @returns 
   */
  queryMarketingProjectStageCount(params) {
    return service.post(EXTENDMARKING + `/marketingProject/queryMarketingProjectStageCount`, params, {
      action: '获取日程数据',
    });
  },

  /**
   * 获取日程table数据
   */
  queryHomePageMarketingProject(params) {
    return service.post(EXTENDMARKING + `/marketingProject/queryHomePageMarketingProject`, params, {
      action: '获取日程table数据',
    });
  },

  /**
   * 流程表单跳转
   */
  getHyperLink(params) {
    return service.post(EXTEND + `/hyperLink/getHyperLink`, params, {
      action: '流程表单跳转',
    });
  },


  /////////////////////////////////工程页签数据///////////////////////////////////

  /**
   * 查询汇总数据
   * @returns 
   */
  projectDatSummary(params) {
    return service.post(PROJECTSUMMARY + `/projectDatSummary`, params, {
      action: '查询汇总数据',
    });
  },

  /**
   * 查询列表数据
   */
  pageProjectList(params) {
    return service.post(PROJECTSUMMARY + `/pageProjectList`, params, {
      action: '查询列表数据',
    });
  },

  /**
   * 数据同步，仅供测试使用
   */
  handleTest(params) {
    return service.get(PROJECTSUMMARY + `/test`, {
      params,
      action: '数据同步，仅供测试使用',
    });
  },

  /**
   * 快捷入口列表
   * @param {*} params 
   * @returns 
   */
  queryQuickMenuList(params) {
    return service.get(EXTEND + `/base/quickMenu/queryQuickMenuList`, {
      params,
      action: '快捷入口列表',
    });
  },

  /**
   * 菜单点击计数
   * @param {*} params 
   * @returns 
   */
  saveQuickMenuRecord(params) {
    return service.post(EXTEND + `/base/quickMenu/saveQuickMenuRecord`, params, {
      action: '菜单点击计数',
    });
  }

}
