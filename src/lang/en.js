var lang = {
  //常规通用
  all: 'All',
  operate: 'Operate',
  number: 'No',
  title: 'Title',
  search: 'Search',
  reset: 'Reset',
  enterKey: 'enter a keyword',
  searchKey: 'Search Key',
  normal: 'Normal',
  disabled: 'Disabled',
  add: 'Add',
  delete: 'Delete',
  edit: 'Edit',
  modify: 'Modify',
  view: 'View',
  import: 'Import',
  export: 'Export',
  category: 'Category',
  refresh: 'Refresh',
  setCategory: 'Set Category',
  refreshCache: 'Refresh Cache',
  copyFlow: 'Copy Proc',
  goBack: 'Go Back',
  remark: 'Remark',
  manage: 'Manage',
  permission: 'permission',
  toz: 'To',
  expand: 'expand',
  packUp: 'pack up',
  sure: 'Sure',
  cancel: 'Cancel',
  close: 'Close',
  canceled: 'Canceled',
  print: 'Print',
  tip: 'Tip',
  categoryFlag: 'Group',
  select: "Select",
  clear: "Clear",
  head: {
    helpDoc: 'Rest Api',
    fullScreen: 'Full Screen',
    outfullScreen: 'Quit',
    notify: 'Notify',
    logonOut: 'Logon Out'

  }
  , login: {
    tenantTip: 'please enter tenant number',
    accountTip: 'please enter account',
    passwordTip: 'please enter password',
    validateCodeTip: 'validate code',
    welcomeLogin: 'Welcome',
    logon: 'Logon'
  }
  , logonDrawer: {
    myAccount: 'Logon Account',
    logonAccount: 'Logon Name',
    logonDepart: 'Logon Depart',
    switchLogonDepart: 'Switch Logon Depart',
    basicInformation: 'Basic Information',
    orgFullName: 'Depart',
    account: 'Account',
    password: 'Prassword',
    realName: 'Name',
    sex: 'Sex',
    email: 'Email',
    mobile: 'Mobile',
    accountStatus: 'Account Status',
    status: 'Status',
    effectiveTime: 'Effective Time',
    deadlineTime: 'Deadline Time',
    tenantNo: 'Tenant No',
  }
  //个人工作台
  , workstation: {
    workbench: 'Workbench',
    personalWorkstation: 'Personal Workstation',
    start: 'Start',
    appId: 'AppId',
    appName: 'Proc Name',
    pending: 'Pending',
    pendingTasks: 'Pending Tasks',
    startProcess: 'Start Process',
    myStarted: 'My Started',
    hadDone: 'Had Done',
    circulate: 'Circulate',
    circulatedTodo: 'Circulated Todo',
    circulatedDone: 'Circulated Done',
    draftBox: 'Draft Box',
    myWarning: 'Warning',
    toDoThisMonth: 'To Do This Month',
    toDoThisMonth_done: 'Done',
    generalApplication: 'Application',
    quickEntry: 'Quick Entry',
    systemMsg: 'System Msg',
    willbeTimeOutCount: '1 day will time out',
    weekWillbeTimeOutCount: '7 day will time out',
    timeOutTotalCount: 'had timed out',
    button: {
      beUrged: 'Be Urged',
      beReject: 'Be Reject',
      wasTransferred: 'Was Transferred',
      willTimeOut: 'Will TimeOut',
      timedOut: 'TimedOut',
      suspended: 'Suspended',
      batchApproval: 'Batch Approval',
      excelExport: 'excel Export'
    }
  },
  wfInfo: {
    procName: 'Proc Name',
    procCode: 'Proc Code',
    appId: 'AppId',
    appCode: 'App Code'
  }
  , wfstatus: {
    all: 'all',
    noInstance: 'No Instance',
    draft: 'draft',
    running: 'running',
    suspend: 'suspend',
    completed: 'completed',
    returnDraft: 'returnDraft',
    returnActivity: 'rejected',
    canceled: 'Canceled',
    deleted: 'deleted'
  }
  , taskState: {
    unread: 'Unread',
    readed: 'Readed',
    completed: 'Completed',
    taskclaim: 'Locking',
    inCommunication: 'In Communication',
    unknown: 'UnKnown'
  }
  //静态列表
  , wfgrid: {
    wfMap: 'Map',
    procMap: 'Proc Map',

    sheetId: 'Proc Inst Num',
    startTime: 'Start Time',
    wfstartTime: 'Proc Start Time',
    finishedTime: 'Proc Finished Time',
    activityName: 'Current Node',
    currentActivityName: 'Current Node ',
    currentActors: 'Current User',
    creatorRealName: 'Creator',
    ownerName: 'Task Owner',
    taskUrgeTimes: 'Urge Times',
    taskState: 'Task State',
    workflowInstanceState: 'Wf State',
    appName: 'Proc Name',
    receiptTime: 'Receipt Time',
    taskExpireTime: 'Expire Date',
    timeout: 'Timeout',
    runingtime: 'Duration',

    //task已办历史
    taskCreatedTime: 'Created Time',
    taskCompletedTime: 'Complete Time',
    taskActivityName: 'On The Node',

    cirCompletedTime: 'Done Time',
    circulator: 'Circulator',
    cirToUser: "Circulator To",
    cirCreatedTime: 'Receipt Time',
    cirNode: "Circulated Node",
    thetaskState: 'Task State',


  }
  , searchTip: {
    procDefSearchTip: 'please enter  process name or code to search',
    procConfigSearchTip: 'such as: user,role,department,report tree name',
    taskSearchTip: 'please enter  process number or title to search'
  }
  , listButton: {
    addWorkflowSimple: 'Add(simple)',
    addWorkflowProf: 'Add(profession)',

    circulated: 'Circulated',
    changeStartor: 'ChangeStartor',
    addAppendUser: 'AddAppendUser',
    changeActor: 'ChangeActor',
    suspend: "Suspend",
    unsuspend: "Unsuspend",
    invalid: "Invalid",

    urged: 'Urged',
    turnToDo: "TurnToDo",
    rejectToStart: "Reject To Start",
    sendToNode: "Send To Target",

    activated: "Activated",
    unActivated: "UnActivated",

    appendComment: "Append Comment",
  }
  , pageInfo: {
    generalForm: 'General Form',
    procForm: 'Proc Form',
    appGroup: 'Group',
    applicationName: 'ApplicationName',
    unfinished: 'Running',
    finished: 'Finished',
    urgesb: 'Urgesb',
    bcopinion: 'Append Opinion',
    markunread: 'Mark Unread',
    markread: 'Mark Done'
  }
  , workflowMap: {
    status: "Status",
    noneTask: "None Task",
    candidate: "Candidate",
    note: "Node",
    nodeContent: "The actual to-do person will not be determined until the process flow goes to this node to generate the task",
    showProcMap: "Show ProcMap",
    activityName: "Node Name",
    realName: "Approver",
    userDpName: "Depart",
    createdTime: "Created Time",
    completedTime: "Complete Time",
    taskState: "Task State",
    opinion: "Opinion",

    sheetId: "Proc No",
    procName: "Proc Name",
    procTitle: "Title",
    currentActivityName: "Current Node",
    startTime: "Start Time",
    finishedTime: "Finished Time",
    workflowState: "Proc State",
    exportImage: "export image",
    subProcInstanceTotal: "SubProcInstance Total",
    doubleClickViewSubflow: "Double Click View The Subflows"
  }
  , workflowform: {
    procInfo: "Process Instance Info",
    detailContent: "Request Detail",
    snapshot: "Snapshot",
    workflowTitle: "Proc Title",
    sheetId: "Proc No",
    startor: "Startor",
    importance: "Importance",
    urgency: "Urgency",
    currentActivityName: "Current Activity",
    startTime: "StartTime",
    workflowState: "Proc State",
    finishedTime: "Finished Time",
    approalListLineTime: "Approal List Time Line",
    mainProcMap: "Main Proc Map",
    processMap: "Process Map",
    showProcMapDialogTitle: "View Proc Map",
    showApprovalListDialogTitle: "View Approval List",
    showCirculatedListDialogTitle: "View Circulated List",
    showCommentListDialogTitle: "View Comment List",
  }
  , actorSelect: {
    totalSelected: "Total Selected",
    userActor: "User",
    clearAll: "Clear All",
    youOpinion: "Opinion",
    alsoCirculatedTo: "Also Circulated To",
    fillTheOpinion: "Fill The Opinion"
  }
  , approvalHistory: {
    activityName: "Node Name",
    realName: "Approver",
    userDpName: "Depart",
    createdTime: "Created Time",
    completedTime: "Complete Time",
    taskState: "Task State",
    opinion: "Opinion"

  }
  //在线表单子表的默认按钮
  , onlineFormSubtable: {
    add: "Add",
    delete: "Delete",
    operate: "Operate",
    seqNum: "Seq",
    sumTotal: "Total"
  }
};
export default lang;