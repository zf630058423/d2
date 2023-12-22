//招投标形式
export const ATTRACT_TENDER_LIST = [
  { id: 1, name: '政府公开' },
  { id: 2, name: '其他公开' },
  { id: 3, name: '议标' },
  { id: 4, name: '邀请' },
  { id: 5, name: '其他' },
]

//关闭状态
export const CLOSE_STATE_LIST = [
  { id: 1, name: '正常' },
  { id: 2, name: '主动关闭' },
  { id: 3, name: '被动关闭' },
  { id: 4, name: '预警' },
  { id: 5, name: '已开标' },
  { id: 6, name: '已投标未走开标结果被动关闭' }
]

//关闭原因  不转换
export const CLOSE_REASE_LIST = [  //关闭原因
  { id: 1, name: '业务关系不够' },
  { id: 2, name: '合同条件限制' },
  { id: 3, name: '客户终止招标或招标发生重大变化' },
  { id: 4, name: '公开项目市场环境原因' },
  { id: 5, name: '资信业绩不够' },
  { id: 6, name: '不符合营销底限' },
  { id: 7, name: '垫资过大' },
  { id: 8, name: '控制价过低' },
  { id: 9, name: '其他' },
  { id: 10, name: '长期无动态系统关闭' },
]

//项目当前状态
export const PROJECT_STATUS_LIST = [
  { id: 1, name: '已立项未投标' },
  { id: 2, name: '在投' },
  { id: 3, name: '已投待定' },
  { id: 4, name: '中标' },
  { id: 5, name: '未中标' },
  { id: 6, name: '已施工立项' },
  { id: 7, name: '已设计施工立项' },
  { id: 8, name: '已签合同' }
]

//当前流程
export const PROCESS_LIST = [
  { id: 1, name: '营销立项' },
  { id: 2, name: '预选承包商入库' },
  { id: 3, name: '标前评审' },
  { id: 4, name: '投标文件评审' },
  { id: 5, name: '资格预审文件评审' },
  { id: 6, name: '开标结果' },
  { id: 7, name: '设计施工立项' },
  { id: 8, name: '施工立项' },
  { id: 9, name: '建安合同' },
  { id: 10, name: '设计收入合同' }
]

//立项类型
export const APPROVAL_TYPE = ['市政园林', '施工', '地产园林', '设计施工一体化', '设计', '建工', '幕墙门窗']

//入库类型
export const INCOMING_TYPE = ['企业入库', '投标入库', '设计投标入库'];