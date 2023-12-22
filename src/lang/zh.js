var lang = {
  //常规通用
  all: '全部  ',
  number: '序号',
  operate: '操作',
  title: '标题',
  search: '查询',
  reset: '重置',
  enterKey: '输入关键字搜索',
  searchKey: '搜索关键字',
  normal: '正常',
  disabled: '禁用',
  add: '新增',
  delete: '删除',
  edit: '编辑',
  modify: '修改',
  view: '查看',
  import: '导入',
  export: '导出',
  category: '分类',
  refresh: '刷新',
  setCategory: '设置分类',
  refreshCache: '刷新缓存',
  copyFlow: '复制流程',
  goBack: '返回列表',
  remark: '备注',
  manage: '管理',
  permission: '授权',
  toz: '至',
  expand: '展开',
  packUp: '收起',
  sure: '确定',
  cancel: '取消',
  close: '关闭',
  print: '打印',
  tip: '温馨提示',
  categoryFlag: '分类标识',
  select: "选择",
  clear: "清空",
  head: {
    helpDoc: 'REST API',
    fullScreen: '全屏',
    outfullScreen: '退出',
    notify: '消息',
    logonOut: '退出登录'
  }
  , login: {
    tenantTip: '请输入租户号',
    accountTip: '请输入登录账号',
    passwordTip: '请输入登录密码',
    validateCodeTip: '验证码',
    welcomeLogin: '欢迎登录',
    logon: '登 录',
  }
  , logonDrawer: {
    myAccount: '我的账户',
    logonDepart: '登录组织',
    logonAccount: '登录账号',
    switchLogonDepart: '切换登录组织',
    basicInformation: '基本信息',
    orgFullName: '组织',
    account: '账号',
    password: '密码',
    realName: '姓名',
    sex: '性别',
    email: '邮箱',
    mobile: '手机',
    accountStatus: '状态',
    status: '状态',
    effectiveTime: '有效开始时间',
    deadlineTime: '有效截止时间',
    tenantNo: '租户编号',

  }
  //个人工作台
  , workstation: {
    workbench: '工作台',
    personalWorkstation: '个人工作台',
    start: '发起',
    appId: '流程别名',
    appName: '流程名称',
    pending: '待办事项',
    pendingTasks: '待办事项',
    startProcess: '发起流程',
    myStarted: '我发起的',
    hadDone: '已办事项',
    circulate: '待阅事项',
    circulatedTodo: '待阅事项',
    circulatedDone: '已阅事项',
    draftBox: '草稿箱',
    myWarning: '我的预警',
    toDoThisMonth: '本月待办',
    toDoThisMonth_done: '已处理',
    generalApplication: '常规应用',
    quickEntry: '快捷入口',
    systemMsg: '系统消息',
    willbeTimeOutCount: '1天内将超时',
    weekWillbeTimeOutCount: '7天内将超时',
    timeOutTotalCount: '已超时数量',
    button: {
      beUrged: '被催办',
      beReject: '被驳回',
      wasTransferred: '被转办',
      willTimeOut: '将超时',
      timedOut: '已超时',
      suspended: '已挂起',
      batchApproval: '批量审批',
      excelExport: '导出'

    }
  },
  wfInfo: {
    procName: '流程名称',
    procCode: '流程编码',
    appId: '流程别名',
    appCode: '流程应用编码'
  }
  , wfstatus: {
    all: '全部',
    draft: '草稿',
    noInstance: '拟稿',
    running: '审批中',
    suspend: '已挂起',
    completed: '已完成',
    returnDraft: '驳回申请人',
    returnActivity: '驳回',
    canceled: '已作废',
    deleted: '已删除'
  }
  , taskState: {
    unread: '送达',
    readed: '已读',
    completed: '已完成',
    taskclaim: '已锁定',
    inCommunication: '沟通中',
    unknown: '未知'
  }
  //待办已办等静态列表
  , wfgrid: {
    wfMap: '流程图',
    procMap: '流程图',
    sheetId: '流程单号',
    startTime: '发起时间',
    wfstartTime: '流程发起时间',
    finishedTime: '流程结束时间',
    activityName: '当前环节',
    currentActivityName: '当前环节',
    currentActors: '当前处理人',
    creatorRealName: '发起人',
    ownerName: '待办归属人',
    taskUrgeTimes: '催办次数',
    taskState: '待办状态',
    workflowInstanceState: '流程状态',
    appName: '流程名称',
    receiptTime: '接收时间',
    taskExpireTime: '到期时间',
    timeout: '超时时长',
    runingtime: '流程已运行时长',

    //task已办历史
    taskCreatedTime: '到达时间',
    taskCompletedTime: '完成时间',
    taskActivityName: '已办所属节点',

    cirCompletedTime: '审阅时间',
    circulator: '传阅者',
    cirCreatedTime: '传阅时间',
    cirNode: "传阅所在环节",
    cirToUser: "传阅到",
    thetaskState: '任务状态',
  }
  , searchTip: {
    procDefSearchTip: "请输入流程名称,流程编码来查询",
    procConfigSearchTip: '输入关键字，如:用户姓名、角色、部门名称、汇报树名称等',
    taskSearchTip: '请输入单号,标题来查询'
  }
  , listButton: {
    addWorkflowSimple: '新增(简约模式)',
    addWorkflowProf: '新增(专业模式)',

    circulated: '传阅',
    changeStartor: '变更流程发起人',
    addAppendUser: '加签处理人',
    changeActor: '改签处理人',
    suspend: "挂起",
    unsuspend: "解除挂起",
    invalid: "作废流程",

    urged: '催办',
    turnToDo: "交接/转办",
    rejectToStart: "驳回到提单",
    sendToNode: "提交到指定节点",
    activated: "已激活待操作的实例",
    unActivated: "已归档结束的实例",

    appendComment: "追加评论",
  }
  , pageInfo: {
    generalForm: '普通表单',
    procForm: '流程表单',
    appGroup: '应用分组',
    applicationName: '应用名称',
    unfinished: '未完结',
    finished: '已完结',
    urgesb: '催办',
    bcopinion: '补充意见',
    markunread: '标记为未阅',
    markread: '标记为已阅'

  }
  , workflowMap: {
    status: "状态",
    noneTask: "未产生任务",
    candidate: "待候选人",
    note: "说明",
    nodeContent: "实际待办人将在流程流转到此节点产生任务以后才能确定",
    showProcMap: "查看流程图",
    activityName: "处理节点",
    realName: "处理人",
    userDpName: "处理人部门",
    createdTime: "到达时间",
    completedTime: "完成时间",
    taskState: "处理状态",
    opinion: "处理意见",

    sheetId: "流程单号",
    procName: "流程名称",
    procTitle: "流程标题",
    currentActivityName: "当前节点",
    startTime: "发起时间",
    finishedTime: "完成时间",
    workflowState: "流程状态",

    subProcInstanceTotal: "子流程实例数",
    doubleClickViewSubflow: "双击查看子流程图",

    exportImage: "导出图片",


  }
  , workflowform: {
    procInfo: "流程信息",
    detailContent: "详细内容",
    snapshot: "历史快照",
    workflowTitle: "流程标题",
    sheetId: "流程单号",
    startor: "提单人",
    importance: "重要级别",
    urgency: "紧急程度",
    currentActivityName: "当前节点",
    startTime: "发起时间",
    workflowState: "流程状态",
    finishedTime: "结束时间",
    approalListLineTime: "办理过程时间线",
    mainProcMap: "主流程图",

    processMap: "流程轨迹图",
    showProcMapDialogTitle: "查看流程图",
    showApprovalListDialogTitle: "查看办理过程",
    showCirculatedListDialogTitle: "查看传阅过程",
    showCommentListDialogTitle: "流程评论",

  }
  , actorSelect: {
    totalSelected: "总共选择了",
    userActor: "个处理人",
    clearAll: "全部删除",
    youOpinion: "审核意见模板",
    alsoCirculatedTo: "同时传阅给",
    fillTheOpinion: "请填写审核意见"
  }
  , approvalHistory: {
    activityName: "处理节点",
    realName: "处理人",
    userDpName: "处理人部门",
    createdTime: "到达时间",
    completedTime: "完成时间",
    taskState: "处理状态",
    opinion: "处理意见"
  }
  //在线表单子表的默认按钮
  , onlineFormSubtable: {
    add: "添加",
    delete: "删除",
    operate: "操作",
    seqNum: "序号",
    sumTotal: "合计"
  }
};
export default lang;
