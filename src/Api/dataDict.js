import service from '@/utils/services';
/**
 * 获取字典列表（多选）
 */
export const getDataDictByConfigType = (params) => {
  const url = `/workflow/fuiFramework/getViewTableListData/?deforder=asc&defsort=ConfigType&viewTable=f2bpm_sys_DataDict&dataSource=&configTableName=&isEnableAuthor=0&defaultWhere=`;
  //  return service.post(`/workflow/fuiFramework/getViewTableListData`, params, {
  //   action: '获取字典列表',
  // });
  return service.post(url, params, {action: '获取字典列表'});
}
