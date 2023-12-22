import Vue from 'vue';
import Router from 'vue-router';
Vue.use(Router);

/* 系统主框架 */
import Layout from '@/layout';

import solutionLayout from '@/views/workflow/security/solution/solutionLayout';
export const constantRoutes = [
  // testList测试
  {
    path: '/test',
    name: 'test',
    meta: { title: 'test', requireAuth: true },
    component: () => import('@/views/testVue/test.vue')
  },
  {
    path: '/testList',
    name: 'testList',
    meta: { title: 'testList', requireAuth: true },
    component: () => import('@/views/testVue/testList.vue')
  },
  {
    path: '/tableDemo',
    name: 'tableDemo',
    meta: { title: 'tableDemo', requireAuth: true },
    component: () => import('@/views/testVue/tableDemo.vue')
  },
  {
    path: '/login',
    component: () => import('@/views/login/login'),
    hidden: true
  },

  {
    path: '/localstorage',
    component: () => import('@/views/login/localstorage'),
    hidden: true
  },
  {
    path: '/denied',
    meta: { title: '没有访问权限' },
    component: () => import('@/views/denied'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
  // 目标成本
  {
    path: '/cost',
    name: 'cost',
    component: () => import('@/views/fullDevelopment/targetCost/cost.vue'),
    meta: { title: 'cost', requireAuth: true }
  },
  // 目标成本调整
  {
    path: '/adjustment',
    name: 'adjustment',
    component: () => import('@/views/fullDevelopment/adjustmentCost/adjustment.vue'),
    meta: { title: 'adjustment', requireAuth: true }
  },
  // 目标成本分析
  {
    path: '/analysis',
    name: 'analysis',
    component: () => import('@/views/fullDevelopment/analysisCost/analysis.vue'),
    meta: { title: 'analysis', requireAuth: true }
  },
  // 资料归档
  {
    path: '/archiving',
    name: 'archiving',
    component: () => import('@/views/fullDevelopment/dataArchiving/archiving.vue'),
    meta: { title: 'archiving', requireAuth: true }
  },
  // 材料供应商注册
  {
    path: '/supplierReg',
    name: 'supplierReg',
    component: () => import('@/views/fullDevelopment/supplierRegister/supplier.vue'),
    meta: { title: 'supplierReg', requireAuth: true }
  },
  // 新首页

  {
    path: '/',
    component: Layout,
    redirect: '/homeNew',
    children: [
      {
        path: 'homeNew',
        name: 'dashboard',
        component: () => import('@/views/homeNew/workSpace/index'),
        meta: { title: '工作台', icon: 'icon icon-integral' }
      },
      {
        path: '/home/announceDetail',
        name: 'announceDetail',
        component: () => import('@/views/homeNew/workSpace/announceDetail'),
        meta: { title: '公告详情', icon: 'dashboard' }
      }]
  },
  {
    path: '/projectHall',
    component: Layout,
    redirect: '/home/projectHall',
    children: [{
      path: '/home/projectHall',
      name: 'projectHall',
      component: () => import('@/views/homeNew/projectHall/index'),
      meta: { title: '项目大厅', icon: 'dashboard' }
    }]
  },
  {
    path: '/newHome',
    component: Layout,
    redirect: '/newHome',
    name: 'newHome',
    children: [{
      path: '/newHome',
      name: 'newHome',
      component: () => import('../views/newHome/index.vue'),
      hidden: true
    }]

  },
  // 流程指引
  {
    path: '/flowGuide',
    component: Layout,
    redirect: '/home/flowGuide',
    children: [{
      path: '/home/flowGuide',
      name: 'flowGuide',
      component: () => import('@/views/flowGuide/index'),
      meta: { title: '流程指引', icon: 'dashboard' }
    }]
  },
  {
    path: '/warningHall',
    component: Layout,
    redirect: '/home/warningHall',
    children: [{
      path: '/home/warningHall',
      name: 'warningHall',
      component: () => import('@/views/homeNew/warningHall/index'),
      meta: { title: '预警大厅', icon: 'dashboard' }
    }]
  },
  {
    path: '/userInfo',
    component: Layout,
    redirect: '/home/userInfo',
    children: [{
      path: '/home/userInfo',
      name: 'userInfo2',
      component: () => import('@/views/home/userInfo'),
      meta: { title: '账号信息', icon: 'dashboard' }
    }]
  },
  // ======================= 发票信息采集 总表 ================================
  {
    path: '/invoiceCollection',
    component: Layout,
    redirect: '/invoiceCollection/invoiceCollList',
    children: [
      {
        path:'/invoiceCollection/invoiceCollList',
        name: 'invoiceCollList',
        component: () => import('@/views/fullDevelopment/invoiceCollection/invoiceCollList.vue'),
        meta: {title: '发票信息采集', icon:'dashboard'}
      }
    ]
    
  },
  // =======================全开发 营销投标新增统计表(总表)====================
  {
    path: '/marketBidStatisics',
    component: Layout,
    // component: () => import('@views/fullDevelopment/marketBidStatisics/marketBidList.vue'),
    // meta: { title: '营销投标统计', icon: 'dashboard' },
    redirect: '/marketBidStatisics/marketBidList',
    children: [{
      path: '/marketBidStatisics/marketBidList',
      name: 'marketBidList',
      component: () => import('@/views/fullDevelopment/marketBidStatisics/marketBidList.vue'),
      meta: { title: '营销投标统计总表', icon: 'dashboard' }
    }]
  },
  // =======================全开发 营销投标新增统计表(明细表)====================
  {
    path: '/marketBidStatisicsDetail',
    component: Layout,
    // component: () => import('@views/fullDevelopment/marketBidStatisics/marketBidDetailList.vue'),
    // meta: { title: '营销投标统计', icon: 'dashboard' },
    redirect: '/marketBidStatisicsDetail/marketBidDetailList',
    children: [{
      path: '/marketBidStatisicsDetail/marketBidDetailList',
      name: 'marketBidDetailList',
      component: () => import('@/views/fullDevelopment/marketBidStatisicsDetail/marketBidDetailList.vue'),
      meta: { title: '营销投标统计明细表', icon: 'dashboard' }
    }]
  },
  // =============全开发 目标成本 =======================//
  {
    path: '/targetCost',
    component: Layout,
    redirect: '/targetCost',
    children: [{
      path: '/targetCost/costList',
      name: 'targetCost',
      component: () => import('@/views/fullDevelopment/targetCost/costList'),
      meta: { title: '目标成本', icon: 'dashboard' }
    }]
  },
  // =============全开发 资料归档 =======================//
  {
    path: '/dataArchiving',
    component: Layout,
    redirect: '/dataArchiving',
    children: [{
      path: '/dataArchiving/archivingList',
      name: 'dataArchiving',
      component: () => import('@/views/fullDevelopment/dataArchiving/archivingList'),
      meta: { title: '资料归档', icon: 'dashboard' }
    }]
  },
  // =================全开发 目标成本调整====================//
  {
    path: '/adjustmentCost',
    component: Layout,
    redirect: '/adjustmentCost',
    children: [{
      path: '/adjustmentCost/adjustmentList',
      name: 'adjustmentCost',
      component: () => import('@/views/fullDevelopment/adjustmentCost/adjustmentList'),
      meta: { title: '目标成本调整', icon: 'dashboard' }
    }]
  },
  // =================全开发 目标成本分析====================//
  {
    path: '/analysisCost',
    component: Layout,
    redirect: '/analysisCost',
    children: [{
      path: '/analysisCost/analysisList',
      name: 'analysisCost',
      component: () => import('@/views/fullDevelopment/analysisCost/analysisList'),
      meta: { title: '目标成本分析', icon: 'dashboard' }
    }]
  },

  // =============全开发 维修申请 =======================//
  {
    path: '/repair',
    name: 'repair',
    component: () => import('@/views/fullDevelopment/repairRequest/repair.vue'),
    meta: { title: 'repair', requireAuth: true }
  },

  {
    path: '/targetRepair',
    component: Layout,
    redirect: '/targetRepair',
    children: [{
      path: '/targetRepair/repairList',
      name: 'targetRepair',
      component: () => import('@/views/fullDevelopment/repairRequest/repairList.vue'),
      meta: { title: '项目维修', requireAuth: true }
    }]
  },

  // =============全开发表单  员工报销(新) 详细页================//
  {
    path: '/claimExpense',
    name: 'claimExpense',
    meta: { title: 'claimExpense', requireAuth: true },
    component: () => import('@/views/fullDevelopment/claimExpense/claimExpense.vue')
  },

  {
    path: '/targetClaimExpense',
    component: Layout,
    redirect: '/targetClaimExpense',
    children: [{
      path: '/targetClaimExpense/claimExpenseList',
      name: 'targetClaimExpense',
      component: () => import('@/views/fullDevelopment/claimExpense/claimExpenseList.vue'),
      meta: { title: '员工费用报销', requireAuth: true }
    }]
  },

  // =============全开发 计划编制 =======================//
  //  {
  //   path: '/planning',
  //   name: 'planning',
  //   component: () => import('@/views/fullDevelopment/planning/planning.vue'),
  //   meta: { title: 'planning', requireAuth: true }
  // },

  // {
  //   path: '/targetPlanning',
  //   component: Layout,
  //   redirect: '/targetPlanning',
  //   children: [{
  //     path: '/targetPlanning/planningList',
  //     name: 'targetPlanning',
  //     component: () => import('@/views/fullDevelopment/planning/planningList.vue'),
  //     meta: { title: '计划编制', requireAuth: true }
  //   }]
  // },

  // =============全开发 计划总览=======================//
  // {
  //   path: '/targetPlanOverview',
  //   component: Layout,
  //   redirect: '/targetPlanOverview',
  //   children: [{
  //     path: '/targetPlanOverview/planOverviewList',
  //     name: 'targetPlanOverview',
  //     component: () => import('@/views/fullDevelopment/planOverview/planOverviewList.vue'),
  //     meta: { title: '计划总览', requireAuth: true }
  //   }]
  // },

  // ==============系统管理    ===================//
  {
    path: '/adminresourceList',
    component: Layout,
    redirect: '/admin/resource/resourceList',
    name: 'PersonalTodoList',
    meta: { title: '系统管理' },
    children: [
      {
        path: '/admin/resource/resourceList',
        name: 'resourceList',
        meta: { title: '菜单管理', requireAuth: true },
        component: () => import('@/views/admin/resource/resourceList')
      },
      {
        path: '/workflow/security/systemss/systemDataDictList',
        name: 'systemDataDictList',
        meta: { title: '数据字典', requireAuth: true },
        component: () => import('@/views/workflow/security/dataDict/systemDataDictList')
      },
      {
        path: '/workflow/security/systemss/dataDictList',
        name: 'dataDictList',
        meta: { title: '数据字典', requireAuth: true },
        component: () => import('@/views/workflow/security/dataDict/dataDictList')
      },
      {
        path: '/workflow/security/tenantor/tenantorList',
        name: 'tenantorList',
        meta: { title: '租户管理', requireAuth: true },
        component: () => import('@/views//workflow/security/tenantor/tenantorList')
      },

      {
        path: '/workflow/security/tenantor/systemConfig',
        name: 'systemConfig',
        meta: { title: '系统设置', requireAuth: true },
        component: () => import('@/views//workflow/security/tenantor/systemConfig')
      },
      {
        path: '/admin/org/orgFrame',
        name: 'orgFrame',
        meta: { title: '组织管理', requireAuth: true },
        component: () => import('@/views/admin/org/orgFrame')
      },
      {
        path: '/admin/user/userList',
        name: 'userList',
        meta: { title: '用户管理', requireAuth: true },
        component: () => import('@/views/admin/user/userList')
      },
      {
        path: '/admin/role/roleList',
        name: 'roleList',
        meta: { title: '角色管理', requireAuth: true },
        component: () => import('@/views/admin/role/roleList')
      },
      {
        path: '/admin/role/roleInResourceList',
        name: 'roleInResourceList',
        meta: { title: '角色授权', requireAuth: true },
        component: () => import('@/views/admin/role/roleInResourceList')
      },
      {
        path: '/admin/user/userInRoleList',
        name: 'userInRoleList',
        meta: { title: '角色用户', requireAuth: true },
        component: () => import('@/views/admin/user/userInRoleList')
      },
      {
        name: 'postJobList',
        meta: { title: '职务管理', requireAuth: true },
        path: '/admin/postjob/postJobList',
        component: () => import('@/views/admin/postJob/postJobList')
      },
      {
        name: 'positionList',
        meta: { title: '岗位管理', requireAuth: true },
        path: '/admin/position/positionList',
        component: () => import('@/views/admin/position/positionList')
      },

      {
        path: '/admin/sys/loginLogList',
        name: 'loginLogList',
        meta: { title: '登录日志', requireAuth: true },
        component: () => import('@/views/admin/sys/loginLogList')
      },
      {
        path: '/admin/sys/cachePoolInformationList',
        name: 'cachePoolInformationList',
        meta: { title: '查看缓存', requireAuth: true },
        component: () => import('@/views/admin/sys/cachePoolInformationList')
      },
      {
        path: '/admin/sqlExecuteLog/sqlExecuteLogList',
        name: 'sqlExecuteLogList',
        component: () => import('@/views/admin/sqlExecuteLog/sqlExecuteLogList')
      },
      {
        name: 'loginLockList',
        meta: { title: '登录锁定', requireAuth: true },
        path: '/workflow/frame/loginLock/loginLockList',
        component: () => import('@/views/workflow/frame/loginLock/loginLockList')
      },
      {
        path: '/admin/sys/sysFilelogList',
        name: 'sysFilelogList',
        meta: { title: '系统日志', requireAuth: true },
        component: () => import('@/views/admin/sys/sysFilelogList')
      },

      {
        name: 'permutationsList',
        meta: { title: '排列组合工具', requireAuth: true },
        path: '/admin/sys/permutationsList',
        component: () => import('@/views/admin/sys/permutationsList')
      },
      {
        name: 'codeGeneratorList',
        meta: { title: '代码生成器', requireAuth: true },
        path: '/admin/codeGenerator/codeGeneratorList',
        component: () => import('@/views/admin/codeGenerator/codeGeneratorList')
      },
       {
        name: 'leaveList',
        meta: { title: '代码生成示例', requireAuth: true },
        path: '/admin/demo/leaveList',
        component: () => import('@/views/admin/demo/leaveList')
      }

    ]
  },
  {
    name: 'showUserPosition',
    meta: { title: '用户岗位' },
    path: '/admin/user/showUserPosition',
    component: () => import('@/views/admin/user/showUserPosition')
  },
  {
    name: 'positionList_byorgid',
    path: '/admin/position/positionList_byorgid',
    component: () => import('@/views/admin/position/positionList')
  },
  {
    name: 'positionEdit',
    path: '/admin/position/positionEdit',
    component: () => import('@/views/admin/position/positionEdit')
  },
  {
    path: '/admin/sqlExecuteLog/sqlExecuteLogEdit',
    name: 'sqlExecuteLogEdit',
    component: () => import('@/views/admin/sqlExecuteLog/sqlExecuteLogEdit')
  },
  {
    name: 'importPositionByExcel',
    path: '/admin/position/importPositionByExcel',
    component: () => import('@/views/admin/position/importPositionByExcel')
  },
  {
    name: 'importUserPositionByExcel',
    path: '/admin/position/importUserPositionByExcel',
    component: () => import('@/views/admin/position/importUserPositionByExcel')
  },
  {
    name: 'postJobEdit',
    path: '/admin/postjob/postJobEdit',
    component: () => import('@/views/admin/postJob/postJobEdit')
  },
  {
    name: 'importPostJobByExcel',
    path: '/admin/postjob/importPostJobByExcel',
    component: () => import('@/views/admin/postJob/importPostJobByExcel')
  },

  {
    name: 'loginLockEdit',
    path: '/workflow/frame/loginLock/loginLockEdit',
    component: () => import('@/views/workflow/frame/loginLock/loginLockEdit')
  },
  {
    path: '/admin/demo/leaveEdit',
    name: 'leaveEdit',
    component: () => import('@/views/admin/demo/leaveEdit')
  },
  {
    path: '/admin/codeGenerator/codeGeneratorEdit',
    name: 'codeGeneratorEdit',
    component: () => import('@/views/admin/codeGenerator/codeGeneratorEdit')
  },
  {
    path: '/admin/codeGenerator/codeFieldOptionsEdit',
    name: 'codeFieldOptionsEdit',
    component: () => import('@/views/admin/codeGenerator/codeFieldOptionsEdit')
  },

  {
    path: '/admin/codeGenerator/codeGenfieldList',
    name: 'codeGenfieldList',
    component: () => import('@/views/admin/codeGenerator/codeGenfieldList')
  },
  {
    path: '/admin/codeGenerator/codeGenfieldEdit',
    name: 'tenantoroptionsEdit',
    component: () => import('@/views/admin/codeGenerator/codeGenfieldEdit')
  },
  {
    path: '/workflow/security/tenantor/optionsEdit',
    name: 'optionsEdit',
    component: () => import('@/views/workflow/security/tenantor/optionsEdit')
  },
  {
    path: '/workflow/security/tenantor/tenantorInResourceList',
    name: 'tenantorInResourceList',
    component: () => import('@/views/workflow/security/tenantor/tenantorInResourceList')
  },
  {
    path: '/workflow/security/tenantor/tenantorEdit',
    name: 'tenantorEdit',
    component: () => import('@/views/workflow/security/tenantor/tenantorEdit')
  },
  {
    path: '/admin/sys/systemControlpanel',
    name: 'systemControlpanel',
    meta: { title: '系统控制台' },
    component: () => import('@/views/admin/sys/systemControlpanel')
  },
  {
    path: '/admin/role/roleEdit',
    name: 'roleEdit',
    component: () => import('@/views/admin/role/roleEdit')
  },
  {
    path: '/admin/role/roleInResourceEdit',
    name: 'roleInResourceEdit',
    component: () => import('@/views/admin/role/roleInResourceEdit')
  },
  {
    path: '/admin/user/showUserOrgList',
    name: 'showUserOrgList',
    component: () => import('@/views/admin/user/showUserOrgList')
  },
  {
    path: '/admin/user/showUserRoleList',
    name: 'showUserRoleList',
    component: () => import('@/views/admin/user/showUserRoleList')
  },
  {
    path: '/admin/user/updateBaseInfoEdit',
    name: 'updateBaseInfoEdit',
    component: () => import('@/views/admin/user/updateBaseInfoEdit')
  },
  // 客户信息登记弹窗
  {
    path: '/admin/user/custormWarning',
    name: 'custormWarning',
    component: () => import('@/views/admin/user/custormWarning')
  },
  {
    path: '/admin/user/updatePwdEdit',
    name: 'updatePwdEdit',
    component: () => import('@/views/admin/user/updatePwdEdit')
  },
  // 开票申请确认重开弹窗
  {
    path: '/workflow/gridEditor/confirmReopen',
    name: 'confirmReopen',
    component: () => import('@/views/workflow/gridEditor/confirmReopen')
  },
  // 开票申请百望重开
  {
    path: '/workflow/gridEditor/baiwangReopen',
    name: 'baiwangReopen',
    component: () => import('@/views/workflow/gridEditor/baiwangReopen')
  },
  // 开票申请关联预缴
  {
    path: '/workflow/gridEditor/relevancePrepay',
    name: 'relevancePrepay',
    component: () => import('@/views/workflow/gridEditor/relevancePrepay')
  },
  {
    path: '/admin/user/switchLoginOrg',
    name: 'switchLoginOrg',
    component: () => import('@/views/admin/user/switchLoginOrg')
  },
  {
    path: '/admin/user/userEdit',
    name: 'userEdit',
    component: () => import('@/views/admin/user/userEdit')
  },
  {
    path: '/admin/user/importUserByExcel',
    name: 'importUserByExcel',
    component: () => import('@/views/admin/user/importUserByExcel')
  },
  {
    path: '/admin/org/importOrgByExcel',
    name: 'importOrgByExcel',
    component: () => import('@/views/admin/org/importOrgByExcel')
  },
  {
    path: '/admin/role/importRoleByExcel',
    name: 'importRoleByExcel',
    component: () => import('@/views/admin/role/importRoleByExcel')
  },
  {
    path: '/admin/user/userInfo',
    name: 'userInfo',
    component: () => import('@/views/admin/user/userInfo')
  },

  {
    path: '/admin/org/organizationList',
    name: 'organizationList',
    component: () => import('@/views/admin/org/organizationList')
  },
  {
    path: '/admin/org/organizationEdit',
    name: 'organizationEdit',
    component: () => import('@/views/admin/org/organizationEdit')
  },
  {
    path: '/admin/org/orgUserList',
    name: 'orgUserList',
    component: () => import('@/views/admin/org/orgUserList')
  },
  {
    path: '/admin/resource/resourceEdit',
    name: 'resourceEdit',
    component: () => import('@/views/admin/resource/resourceEdit')
  },

  {
    path: '/admin/resource/selectResource',
    name: 'selectResource',
    component: () => import('@/views/admin/resource/selectResource')
  },
  // ==============个人工作台    ===================//
  {
    path: '/PersonalTodoList',
    component: Layout,
    redirect: '/workflow/workflowBusiness/todoList',
    name: 'PersonalTodoListName',
    meta: { title: '个人工作台', requireAuth: true },
    children: [
      {
        path: '/workflow/workflowBusiness/todoList',
        name: 'todoList',
        meta: { title: '待办事项', requireAuth: true },
        component: () => import('@/views/workflow/workflowBusiness/todoList')
      },
      {
        path: '/workflow/workflowBusiness/doneList',
        name: 'doneList',
        meta: { title: '已办事项', requireAuth: true },
        component: () => import('@/views/workflow/workflowBusiness/doneList')
      },
      {
        path: '/workflow/workflowBusiness/doneDetailList',
        name: 'doneDetailList',
        meta: { title: '已办历史' },
        component: () => import('@/views/workflow/workflowBusiness/doneDetailList')
      },
      {
        path: '/workflow/workflowBusiness/doneHandoverList',
        name: 'doneHandoverList',
        meta: { title: '交来已办', requireAuth: true },
        component: () => import('@/views/workflow/workflowBusiness/doneHandoverList')
      },
      {
        path: '/workflow/workflowBusiness/myWorkItem',
        name: 'myWorkItem',
        meta: {
          title: '我的发起的', requireAuth: true
        },
        component: () => import('@/views/workflow/workflowBusiness/myWorkItem')
      },
      {
        path: '/workflow/workflowBusiness/todoCirculatedList',
        name: 'todoCirculatedList',
        meta: {
          title: '待阅事项',
          requireAuth: true
        },
        component: () => import('@/views/workflow/workflowBusiness/todoCirculatedList')
      },
      {
        path: '/workflow/workflowBusiness/doneCirculatedList',
        name: 'doneCirculatedList',
        meta: {
          title: '已阅事项',
          requireAuth: true
        },
        component: () => import('@/views/workflow/workflowBusiness/doneCirculatedList')
      }, {
        path: '/workflow/workflowBusiness/myCirculatedList',
        name: 'myCirculatedList',
        meta: {
          title: '我的传阅',
          requireAuth: true
        },
        component: () => import('@/views/workflow/workflowBusiness/myCirculatedList')
      },
      {
        path: '/workflow/delegates/appDelegateList',
        name: 'appDelegateList',
        meta: {
          title: '流程委托', requireAuth: true
        },
        component: () => import('@/views/workflow/delegates/appDelegateList')
      },
      {
        path: '/workflow/workflowBusiness/draftList',
        name: 'draftList',
        meta: {
          title: '草稿箱',
          requireAuth: true
        },
        component: () => import('@/views/workflow/workflowBusiness/draftList')
      },
      {
        path: '/workflow/workflowBusiness/myCancelList',
        name: 'myCancelList',
        meta: {
          title: '已作废箱',
          requireAuth: true
        },
        component: () => import('@/views/workflow/workflowBusiness/myCancelList')
      },

      {
        path: '/workflow/pageRoute/opinionList',
        name: 'opinionList',
        meta: {
          title: '常用意见',
          requireAuth: true
        },
        component: () => import('@/views/workflow/opinion/opinionList')
      },
      {
        path: '/workflow/workflowBusiness/startWorkflowList',
        name: 'startWorkflowList',
        meta: {
          title: '发起流程',
          requireAuth: true
        },
        component: () => import('@/views/workflow/workflowBusiness/startWorkflowList')
      },
      {
        path: '/workflow/notification/personMessageCenter',
        meta: {
          title: '个人消息'
        },
        name: 'personMessageCenter',
        component: () => import('@/views/workflow/notification/personMessageCenter')
      },
      {
        name: 'appPortalView',
        meta: {
          requireAuth: true
        },
        path: '/workflow/frame/appPortal/appPortalView',
        component: () => import('@/views/workflow/frame/appPortal/appPortalView')
      }
    ]
  },
  {
    path: '/workflow/notification/notificationView',
    name: 'notificationView',
    component: () => import('@/views/workflow/notification/notificationView')
  },
  // ==============表单应用设计方案一体化设计===============================//
  {
    path: '/apaasDesigner',
    component: solutionLayout,
    redirect: '/',
    name: '应用设计方案',
    meta: { title: '' },
    children: [
      {
        name: 'solution_formModeDesigner',
        meta: { title: '数据建模' },
        path: '/workflow/smartForm/form/solution_formModeDesigner',
        component: () => import('@/views/workflow/smartForm/form/formModeDesigner')
      },
      {
        name: 'solution_onlineFormDesigner',
        meta: { title: '表单设计' },
        path: '/workflow/smartForm/solution_onlineFormDesigner',
        component: () => import('@/views/workflow/smartForm/formDesigner/onlineFormDesigner')

      },

      {
        name: 'solution_processDefListByWorkflowKey',
        meta: { title: '流程设计' },
        path: '/workflow/processDef/solution_processDefListByWorkflowKey',
        component: () => import('@/views/workflow/processDef/processDefListByWorkflowKey')
      },
      {
        path: '/workflow/security/customDataGrid/solution_customDataGridList',
        name: 'solution_customDataGridList',
        meta: { title: '自定义列表设计' },
        // meta: { title: '' },
        component: () => import('@/views/workflow/security/customDataGrid/customDataGridList')
      },
      {
        name: 'solutionConfig',
        meta: { title: '方案设置' },
        path: '/workflow/security/solution/solutionConfig',
        component: () => import('@/views/workflow/security/solution/solutionConfig')
      }
    ]
  },
  {
    name: 'tableModeEdit',
    path: '/workflow/smartForm/table/tableModeEdit',
    component: () => import('@/views/workflow/smartForm/table/tableModeEdit')
  },
  {
    name: 'processAppConfig',
    path: '/workflow/security/solution/processAppConfig',
    component: () => import('@/views/workflow/security/solution/processAppConfig')
  },
  // ==============流程管理===============================//
  {
    path: '/processManager',
    component: Layout,
    redirect: '/',
    name: 'processManager',
    meta: { title: '' },
    children: [
      {
        name: 'processFormList',
        meta: { title: '表单设计', requireAuth: true },
        path: '/workflow/processDef/processFormList',
        component: () => import('@/views/workflow/processDef/processFormList')
      },
      {
        name: 'processDefList',
        meta: { title: '流程定义', requireAuth: true },
        path: '/workflow/processDef/processDefList',
        component: () => import('@/views/workflow/processDef/processDefList')
      },

      {
        name: 'processAppList',
        meta: { title: '流程应用', requireAuth: true },
        path: '/workflow/processDef/processAppList',
        component: () => import('@/views/workflow/processDef/processAppList')
      },
      {
        name: 'solutionList',
        meta: { title: '方案列表' },
        path: '/workflow/security/solution/solutionList',
        component: () => import('@/views/workflow/security/solution/solutionList')
      },
      {
        name: 'authorizeDefList',
        meta: { title: '分管授权', requireAuth: true },
        path: '/workflow/security/authorize/authorizeDefList',
        component: () => import('@/views/workflow/security/authorize/authorizeDefList')
      }
    ]
  },
  {
    name: 'solutionEdit',
    meta: { title: '方案编辑' },
    path: '/workflow/security/solution/solutionEdit',
    component: () => import('@/views/workflow/security/solution/solutionEdit')
  },

  {
    name: 'processDesigner',
    path: '/workflow/processDef/processDesigner',
    meta: { title: '流程设计' },
    component: () => import('@/views/workflow/processDef/processDesigner')
  },

  {
    name: 'processDefListByWorkflowKey',
    meta: { title: '流程定义' },
    path: '/workflow/processDef/processDefListByWorkflowKey',
    component: () => import('@/views/workflow/processDef/processDefListByWorkflowKey')
  },
  {
    name: 'processDefImport',
    path: '/workflow/processDef/processDefImport',
    meta: { title: '流程导入' },
    component: () => import('@/views/workflow/processDef/processDefImport')
  },
  {
    name: 'processAppImport',
    path: '/workflow/processDef/processAppImport',
    meta: { title: '流程应用导入' },
    component: () => import('@/views/workflow/processDef/processAppImport')
  },
  {
    name: 'processOneStationImport',
    path: '/workflow/processDef/processOneStationImport',
    meta: { title: '一站式流程设计导入' },
    component: () => import('@/views/workflow/processDef/processOneStationImport')
  },
  // ==============SmartForm===============================//
  {
    path: '/smartFormBlock',
    component: Layout,
    redirect: '/workflow/smartForm/table/tableDefinitionList',
    name: 'smartFormBlock',
    meta: { title: '' },
    children: [
      {
        name: 'tableDefinitionList',
        meta: { title: '数据库表', requireAuth: true },
        path: '/workflow/smartForm/table/tableDefinitionList',
        component: () => import('@/views/workflow/smartForm/table/tableDefinitionList')
      },
      {
        name: 'formDefList',
        meta: { title: '数据建模', requireAuth: true },
        path: '/workflow/smartForm/formDefList',
        component: () => import('@/views/workflow/smartForm/form/formDefList')
      },
      {
        name: 'generalFieldList',
        meta: { title: '标准字段库', requireAuth: true },
        path: '/workflow/security/generalField/generalFieldList',
        component: () => import('@/views/workflow/security/generalField/generalFieldList')
      }

    ]
  },

  {
    name: 'todoList2',
    path: '/workflow/workflowBusiness/todoList2',
    component: () => import('@/views/workflow/workflowBusiness/todoList')
  },

  {
    name: 'generalFieldEdit',
    path: '/workflow/security/generalField/generalFieldEdit',
    component: () => import('@/views/workflow/security/generalField/generalFieldEdit')
  },
  {
    name: 'formFieldList',
    path: '/workflow/smartForm/formFieldList',
    component: () => import('@/views/workflow/smartForm/form/formFieldList')
  },
  {
    name: 'formFieldListPermission',
    path: '/workflow/smartForm/formFieldListPermission',
    component: () => import('@/views/workflow/smartForm/form/formFieldListPermission')
  },
  {
    name: 'formFieldListPermissions',
    path: '/workflow/smartForm/formPermission/formFieldListPermissions',
    component: () => import('@/views/workflow/smartForm/formPermission/formFieldListPermissions')
  },
  {
    name: 'setFieldPermissionDetail',
    path: '/workflow/smartForm/formPermission/setFieldPermissionDetail',
    component: () => import('@/views/workflow/smartForm/formPermission/setFieldPermissionDetail')
  },
  {
    name: 'onlineFormPreview',
    path: '/workflow/smartForm/onlineFormPreview',
    component: () => import('@/views/workflow/smartForm/form/onlineFormPreview')
  },
  {
    name: 'onlineFormDesigner',
    path: '/workflow/smartForm/onlineFormDesigner',
    component: () => import('@/views/workflow/smartForm/formDesigner/onlineFormDesigner')
  },

  {
    name: 'formDesigner',
    path: '/workflow/smartForm/formDesigner/index',
    component: () => import('@/views/workflow/smartForm/formDesigner/onlineFormDesigner')
  },
  {
    name: 'generationTempaltePlan',
    path: '/workflow/smartForm/generationTempaltePlan',
    component: () => import('@/views/workflow/smartForm/form/generationTempaltePlan')
  },
  {
    name: 'onlineExcelCellStyle',
    path: '/workflow/smartForm/onlineExcelCellStyle',
    component: () => import('@/views/workflow/smartForm/form/onlineExcelCellStyle')
  },
  {
    name: 'onlineExcelDesigner',
    path: '/workflow/smartForm/onlineExcelDesigner',
    component: () => import('@/views/workflow/smartForm/form/onlineExcelDesigner')
  },
  {
    name: 'onlineExcelImport',
    path: '/workflow/smartForm/onlineExcelImport',
    component: () => import('@/views/workflow/smartForm/form/onlineExcelImport')
  },
  {
    name: 'processFromImport',
    path: '/workflow/processDef/processFromImport',
    component: () => import('@/views/workflow/processDef/processFromImport')
  },
  {
    name: 'dataServiceImport',
    path: '/workflow/security/dataService/dataServiceImport',
    component: () => import('@/views/workflow/security/dataService/dataServiceImport')
  },
  {
    name: 'onlineExcelOptionsEdit',
    path: '/workflow/smartForm/onlineExcelOptionsEdit',
    component: () => import('@/views/workflow/smartForm/form/onlineExcelOptionsEdit')
  },
  {
    name: 'onlineExcelView',
    path: '/workflow/smartForm/onlineExcelView',
    component: () => import('@/views/workflow/smartForm/form/onlineExcelView')
  },
  {
    name: 'formBusObjectEdit',
    path: '/workflow/smartForm/formBusObjectEdit',
    component: () => import('@/views/workflow/smartForm/form/formBusObjectEdit')
  },
  {
    name: 'formBusObjectList',
    path: '/workflow/smartForm/formBusObjectList',
    component: () => import('@/views/workflow/smartForm/form/formBusObjectList')
  },
  {
    name: 'busObjectSubsEdit',
    path: '/workflow/smartForm/busObjectSubsEdit',
    component: () => import('@/views/workflow/smartForm/form/busObjectSubsEdit')
  },
  {
    name: 'onlineFormSubTableEdit',
    path: '/workflow/smartForm/onlineFormSubTableEdit',
    component: () => import('@/views/workflow/smartForm/form/onlineFormSubTableEdit')
  },
  {
    name: 'formCustButtonPermission',
    path: '/workflow/smartForm/formCustButtonPermission',
    component: () => import('@/views/workflow/smartForm/form/formCustButtonPermission')
  },
  {
    name: 'formSubTableCustButtonPermission',
    path: '/workflow/smartForm/formSubTableCustButtonPermission',
    component: () => import('@/views/workflow/smartForm/form/formSubTableCustButtonPermission')
  },
  {
    name: 'formOptionsEdit',
    path: '/workflow/smartForm/formOptionsEdit',
    component: () => import('@/views/workflow/smartForm/form/formOptionsEdit')
  },
  {
    name: 'showProcessFormOfFormDef',
    path: '/workflow/smartForm/showProcessFormOfFormDef',
    component: () => import('@/views/workflow/smartForm/form/showProcessFormOfFormDef')
  },

  {
    name: 'fieldOptionsEdit',
    path: '/workflow/smartForm/fieldOptionsEdit',
    component: () => import('@/views/workflow/smartForm/form/fieldOptionsEdit')
  },
  {
    name: 'fieldLinkagesEdit',
    path: '/workflow/smartForm/fieldLinkagesEdit',
    component: () => import('@/views/workflow/smartForm/form/fieldLinkagesEdit')
  },
  {
    name: 'formDefEdit',
    path: '/workflow/smartForm/formDefEdit',
    component: () => import('@/views/workflow/smartForm/form/formDefEdit')
  },
  {
    name: 'formModeDesigner',
    meta: { title: '数据建模' },
    path: '/workflow/smartForm/form/formModeDesigner',
    component: () => import('@/views/workflow/smartForm/form/formModeDesigner')
  },
  {
    name: 'importFormDef',
    path: '/workflow/smartForm/importFormDef',
    component: () => import('@/views/workflow/smartForm/form/importFormDef')
  },

  {
    name: 'formFieldEdit',
    path: '/workflow/smartForm/formFieldEdit',
    component: () => import('@/views/workflow/smartForm/form/formFieldEdit')
  },
  {
    name: 'formFieldPermissionEdit',
    path: '/workflow/smartForm/formFieldPermissionEdit',
    component: () => import('@/views/workflow/smartForm/form/formFieldPermissionEdit')
  },
  {
    name: 'showFormDefOfBusObject',
    path: '/workflow/smartForm/showFormDefOfBusObject',
    component: () => import('@/views/workflow/smartForm/form/showFormDefOfBusObject')
  },
  {
    name: 'formDataTransferList',
    path: '/workflow/smartForm/formDataTransfer/formDataTransferList',
    component: () => import('@/views/workflow/smartForm/formDataTransfer/formDataTransferList')
  },
  {
    name: 'formDataTransferEdit',
    path: '/workflow/smartForm/formDataTransfer/formDataTransferEdit',
    component: () => import('@/views/workflow/smartForm/formDataTransfer/formDataTransferEdit')
  },
  {
    name: 'formDataTransferItemEdit',
    path: '/workflow/smartForm/formDataTransfer/formDataTransferItemEdit',
    component: () => import('@/views/workflow/smartForm/formDataTransfer/formDataTransferItemEdit')
  },
  {
    name: 'formDataTransferItemList',
    path: '/workflow/smartForm/formDataTransfer/formDataTransferItemList',
    component: () => import('@/views/workflow/smartForm/formDataTransfer/formDataTransferItemList')
  },
  // Controls
  {
    name: 'getSelector',
    path: '/workflow/smartForm/getSelector',
    component: () => import('@/views/workflow/smartForm/controls/getSelector')
  },

  {
    name: 'getCustomDialog',
    path: '/workflow/smartForm/getCustomDialog',
    component: () => import('@/views/workflow/smartForm/controls/getCustomDialog')
  },
  {
    name: 'getDataService',
    path: '/workflow/smartForm/getDataService',
    component: () => import('@/views/workflow/smartForm/controls/getDataService')
  },
  {
    name: 'mathEdit',
    path: '/workflow/smartForm/mathEdit',
    component: () => import('@/views/workflow/smartForm/controls/mathEdit')
  },
  // table
  {
    name: 'formDefTableRelList',
    path: '/workflow/smartForm/table/formDefTableRelList',
    component: () => import('@/views/workflow/smartForm/table/formDefTableRelList')
  },
  {
    name: 'tableDefinitionEdit',
    path: '/workflow/smartForm/table/tableDefinitionEdit',
    component: () => import('@/views/workflow/smartForm/table/tableDefinitionEdit')
  },
  {
    name: 'tableDefinitionImprot',
    path: '/workflow/smartForm/table/tableDefinitionImprot',
    component: () => import('@/views/workflow/smartForm/table/tableDefinitionImprot')
  },
  {
    name: 'tableColumnList',
    path: '/workflow/smartForm/tableColumnList',
    component: () => import('@/views/workflow/smartForm/table/tableColumnList')
  },
  {
    name: 'tableColumnEdit',
    path: '/workflow/smartForm/tableColumnEdit',
    component: () => import('@/views/workflow/smartForm/table/tableColumnEdit')
  },
  {
    name: 'showBusObjectOfTable',
    path: '/workflow/smartForm/table/showBusObjectOfTable',
    component: () => import('@/views/workflow/smartForm/table/showBusObjectOfTable')
  },
  // Selector
  {
    name: 'busObjectColumnSelect',
    path: '/workflow/smartForm/busObjectColumnSelect',
    component: () => import('@/views/workflow/smartForm/selector/busObjectColumnSelect')
  },
  {
    name: 'selectExtendEvent',
    path: '/workflow/smartForm/selectExtendEvent',
    component: () => import('@/views/workflow/smartForm/selector/selectExtendEvent')
  },
  {
    name: 'tableDefinitionSelect',
    path: '/workflow/smartForm/tableDefinitionSelect',
    component: () => import('@/views/workflow/smartForm/selector/tableDefinitionSelect')
  },
  {
    name: 'selectSystemVars',
    path: '/workflow/selector/selectSystemVars',
    component: () => import('@/views/workflow/selector/selectSystemVars')
  },
  {
    name: 'commonExcelImport',
    path: '/workflow/security/commonImport/commonExcelImport',
    meta: { title: '通用导入' },
    component: () => import('@/views/workflow/security/commonImport/commonExcelImport')
  },
  // ==============扩展开发的自定选择器 统一写在这里==============================//
  {
    name: 'custDemoSelector',
    path: '/workflow/custSelector/custDemoSelector',
    component: () => import('@/views/workflow/custSelector/custDemoSelector')
  },
  // 节点参与者的自定义选择器
  {
    name: 'custDemoActorSelector',
    path: '/workflow/custSelector/custDemoActorSelector',
    component: () => import('@/views/workflow/custSelector/custDemoActorSelector')
  },
  // ==============流程辅助===============================//
  {
    path: '/liucnegfuzhu',
    component: Layout,
    redirect: '/workflow/security/category/categoryList',
    name: 'liucnegfuzhu_',
    meta: { title: '' },
    children: [
      {
        name: 'categoryList',
        meta: { title: '类别管理', requireAuth: true },
        path: '/workflow/security/category/categoryList',
        component: () => import('@/views/workflow/security/category/categoryList')
      },
      {
        name: 'userRelationList',
        meta: { title: '直线领导', requireAuth: true },
        path: '/workflow/security/userRelation/userRelationList',
        component: () => import('@/views/workflow/security/userRelation/userRelationList')
      },
      {
        name: 'departAssignLeaderList',
        meta: { title: '部门分管领导', requireAuth: true },
        path: '/workflow/security/departAssignLeader/departAssignLeaderList',
        component: () => import('@/views/workflow/security/departAssignLeader/departAssignLeaderList')
      },
      {
        name: 'relationList',
        meta: { title: '汇报树', requireAuth: true },
        path: '/workflow/security/relation/relationList',
        component: () => import('@/views/workflow/security/relation/relationList')
      },
      {
        name: 'relationTypeList',
        meta: { title: '关系标签类型', requireAuth: true },
        path: '/workflow/security/relation/relationTypeList',
        component: () => import('@/views/workflow/security/relation/relationTypeList')
      },
      {
        name: 'customDialogList',
        meta: { title: '自定义对话框', requireAuth: true },
        path: '/workflow/customDialog/customDialogList',
        component: () => import('@/views/workflow/customDialog/customDialogList')
      },
      {
        name: 'selectorDailogList',
        meta: { title: '自定义选择器', requireAuth: true },
        path: '/workflow/selectorDailog/selectorDailogList',
        component: () => import('@/views/workflow/selectorDailog/selectorDailogList')
      },
      {
        name: 'systemSelectorDailogList',
        meta: { title: '自定义选择器', requireAuth: true },
        path: '/workflow/selectorDailog/systemSelectorDailogList',
        component: () => import('@/views/workflow/selectorDailog/systemSelectorDailogList')
      },
      {
        path: '/workflow/security/dataService/dataServiceList',
        name: 'dataServiceList',
        meta: { title: '数据服务', requireAuth: true },
        component: () => import('@/views/workflow/security/dataService/dataServiceList')
      },
      {
        path: '/workflow/security/dataBaseSource/dataBaseSourceList',
        name: 'dataBaseSourceList',
        meta: { title: 'DB数据源配置', requireAuth: true },
        component: () => import('@/views/workflow/security/dataBaseSource/dataBaseSourceList')
      },
      {
        path: '/workflow/pageRoute/holidayCalendar',
        name: 'holidayCalendar',
        meta: { title: '公共假期设置', requireAuth: true },
        component: () => import('@/views/workflow/holiday/holidayCalendar')
      },
      {
        path: '/workflow/pageRoute/workTimeSetting',
        name: '工作时制设置',
        meta: { title: '', requireAuth: true },
        component: () => import('@/views/workflow/holiday/workTimeSetting')
      },
      {
        path: '/workflow/security/taskJob/taskJobList',
        name: '定时器管理',
        meta: { title: '', requireAuth: true },
        component: () => import('@/views/workflow/security/taskJob/taskJobList')
      },
      {
        path: '/workflow/security/report/reportList',
        name: '图表设计',
        meta: { title: '', requireAuth: true },
        component: () => import('@/views/workflow/security/report/reportList')
      },

      {
        name: 'appPortalList',
        meta: { title: '门户管理', requireAuth: true },
        path: '/workflow/frame/appPortal/appPortalList',
        component: () => import('@/views/workflow/frame/appPortal/appPortalList')
      },
      {
        name: 'appFenceList',
        meta: { title: '栏目管理' },
        path: '/workflow/frame/appFence/appFenceList',
        component: () => import('@/views/workflow/frame/appFence/appFenceList')
      },
      {
        path: '/workflow/security/customDataGrid/customDataGridAllList',
        name: '自定义列表2',
        meta: { title: '' },
        component: () => import('@/views/workflow/security/customDataGrid/customDataGridList')
      },
      {
        path: '/workflow/processVar/processVarList',
        name: '流程变量',
        meta: { title: '', requireAuth: true },
        component: () => import('@/views/workflow/processVar/processVarList')
      },
      {
        path: '/workflow/processVarInst/processVarInstList',
        name: '流程变量实例',
        meta: { title: '', requireAuth: true },
        component: () => import('@/views/workflow/processVarInst/processVarInstList')
      },
      {
        path: '/workflow/security/serialNum/serialNumList',
        name: '流水号管理',
        meta: { title: '', requireAuth: true },
        component: () => import('@/views/workflow/security/serialNum/serialNumList')
      },
       {
        name: 'integrationList',
        meta: { title: '集成企业微信第三方配置', requireAuth: true },
        path: '/workflow/security/integration/integrationList',
        component: () => import('@/views/workflow/security/integration/integrationList')
      }
    ]
  },
  {
    path: '/workflow/security/integration/integrationEdit',
    name: 'integrationEdit',
    component: () => import('@/views/workflow/security/integration/integrationEdit')
  },
  {
    name: 'departAssignLeaderList_byorgid',
    meta: { title: '部门分管领导' },
    path: '/workflow/security/departAssignLeader/departAssignLeaderList_byorgid',
    component: () => import('@/views/workflow/security/departAssignLeader/departAssignLeaderList')
  },
  {
    name: 'categoryList_bygroupKey',
    meta: { title: '类别管理' },
    path: '/workflow/security/category/categoryList_bygroupKey',
    component: () => import('@/views/workflow/security/category/categoryList')
  },
  {
    name: 'relationTypeListByInfotype',
    meta: { title: '汇报关系类型' },
    path: '/workflow/security/relation/relationTypeListByInfotype',
    component: () => import('@/views/workflow/security/relation/relationTypeList')
  },
  {
    path: '/workflow/security/relation/relationEdit',
    name: 'relationEdit',
    component: () => import('@/views/workflow/security/relation/relationEdit')
  },
  {
    path: '/workflow/security/relation/relationImportXml',
    name: 'relationEdit',
    component: () => import('@/views/workflow/security/relation/relationImportXml')
  },
  {
    path: '/workflow/security/relation/relationTypeEdit',
    name: 'relationTypeEdit',
    component: () => import('@/views/workflow/security/relation/relationTypeEdit')
  },
  {
    path: '/workflow/security/customDataGrid/customDataGridList',
    name: '自定义列表',
    meta: { title: '' },
    component: () => import('@/views/workflow/security/customDataGrid/customDataGridList')
  },
  {
    name: 'processVarInstEdit',
    path: '/workflow/processVarInst/processVarInstEdit',
    component: () => import('@/views/workflow/processVarInst/processVarInstEdit')
  },
  {
    path: '/workflow/security/serialNum/serialNumEdit',
    meta: { title: '' },
    component: () => import('@/views/workflow/security/serialNum/serialNumEdit')
  },
  {
    name: 'processVarEdit',
    path: '/workflow/processVar/processVarEdit',
    component: () => import('@/views/workflow/processVar/processVarEdit')
  },

  {
    name: 'appPortalDesigner',
    path: '/workflow/frame/appPortal/appPortalDesigner',
    component: () => import('@/views/workflow/frame/appPortal/appPortalDesigner')
  },
  {
    name: 'appPortalEdit',
    path: '/workflow/frame/appPortal/appPortalEdit',
    component: () => import('@/views/workflow/frame/appPortal/appPortalEdit')
  },
  {
    name: 'appPortalImport',
    path: '/workflow/frame/appPortal/appPortalImport',
    component: () => import('@/views/workflow/frame/appPortal/appPortalImport')
  },
  {
    name: 'appPortalOptionsEdit',
    path: '/workflow/frame/appPortal/appPortalOptionsEdit',
    component: () => import('@/views/workflow/frame/appPortal/appPortalOptionsEdit')
  },
  {
    name: 'appPortalPreView',
    path: '/workflow/frame/appPortal/appPortalPreView',
    component: () => import('@/views/workflow/frame/appPortal/appPortalView')
  },
  {
    name: 'appPortalViewSingle',
    path: '/workflow/frame/appPortal/appPortalViewSingle',
    component: () => import('@/views/workflow/frame/appPortal/appPortalView')
  },

  {
    name: 'appFenceEdit',
    path: '/workflow/frame/appFence/appFenceEdit',
    component: () => import('@/views/workflow/frame/appFence/appFenceEdit')
  },
  {
    name: 'reportDesigner',
    path: '/workflow/security/report/reportDesigner',
    component: () => import('@/views/workflow/security/report/reportDesigner')
  },

  {
    name: 'reportView',
    meta: { title: '查看图表', requireAuth: true },
    path: '/workflow/security/report/reportView',
    component: () => import('@/views/workflow/security/report/reportView')
  },
  {
    name: 'reportEdit',
    path: '/workflow/security/report/reportEdit',
    component: () => import('@/views/workflow/security/report/reportEdit')
  },
  {
    name: 'reportImport',
    path: '/workflow/security/report/reportImport',
    component: () => import('@/views/workflow/security/report/reportImport')
  },

  {
    name: 'customDataGridImport',
    path: '/workflow/security/customDataGrid/customDataGridImport',
    component: () => import('@/views/workflow/security/customDataGrid/customDataGridImport')
  },

  {
    name: 'customDataGridImportAll',
    path: '/workflow/security/customDataGrid/customDataGridImportAll',
    component: () => import('@/views/workflow/security/customDataGrid/customDataGridImportAll')
  },

  {
    name: 'customDataGridEdit',
    path: '/workflow/security/customDataGrid/customDataGridEdit',
    component: () => import('@/views/workflow/security/customDataGrid/customDataGridEdit')
  },
  {
    name: 'customDataGridPermission',
    path: '/workflow/security/customDataGrid/customDataGridPermission',
    component: () => import('@/views/workflow/security/customDataGrid/customDataGridPermission')
  },

  {
    name: 'customDataGridPreView',
    path: '/workflow/security/customDataGrid/customDataGridPreView',
    component: () => import('@/views/workflow/security/customDataGrid/customDataGridView')
  },
  {
    name: 'customDataGridViewSingle',
    path: '/workflow/security/customDataGrid/customDataGridViewSingle',
    component: () => import('@/views/workflow/security/customDataGrid/customDataGridView')
  },
  {
    name: 'taskJobEdit',
    path: '/workflow/security/taskJob/taskJobEdit',
    component: () => import('@/views/workflow/security/taskJob/taskJobEdit')
  },
  {
    name: 'holidayEdit',
    path: '/workflow/pageRoute/holidayEdit',
    component: () => import('@/views/workflow/holiday/holidayEdit')
  },
  {
    name: 'dataServiceEdit',
    path: '/workflow/security/dataService/dataServiceEdit',
    component: () => import('@/views/workflow/security/dataService/dataServiceEdit')
  },
  {
    name: 'dataBaseSourceEdit',
    path: '/workflow/security/dataBaseSource/dataBaseSourceEdit',
    component: () => import('@/views/workflow/security/dataBaseSource/dataBaseSourceEdit')
  },
  {
    name: 'userRelationEdit',
    path: '/workflow/security/userRelation/userRelationEdit',
    component: () => import('@/views/workflow/security/userRelation/userRelationEdit')
  },

  {
    name: 'selectorDailogEdit',
    path: '/workflow/selectorDailog/selectorDailogEdit',
    component: () => import('@/views/workflow/selectorDailog/selectorDailogEdit')
  },

  {
    name: 'settingDialog',
    path: '/workflow/customDialog/settingDialog',
    component: () => import('@/views/workflow/customDialog/settingDialog')
  },
  {
    name: 'helperDialog',
    path: '/workflow/customDialog/helperDialog',
    component: () => import('@/views/workflow/customDialog/helperDialog')
  },

  // ==============维护管理===============================//
  {
    path: '/weihu',
    component: Layout,
    redirect: '/workflow/smartForm/form/busObjectList',
    name: 'weihu',
    meta: { title: '' },
    children: [
      {
        name: 'busObjectList',
        meta: { title: '业务对象', requireAuth: true },
        path: '/workflow/smartForm/form/busObjectList',
        component: () => import('@/views/workflow/smartForm/form/busObjectList')
      },
       {
        name: 'processDesignerConfigurationQuery',
        path: '/workflow/processDef/processDesignerConfigurationQuery',
        meta: { title: '流程配置查询', requireAuth: true },
        component: () => import('@/views/workflow/processDef/processDesignerConfigurationQuery')
      }
    ]
  },

  // ==============发版管理===============================//
  {
    path: '/release',
    component: Layout,
    redirect: '/workflow/smartForm/release/systemRelease',
    name: 'release',
    meta: { title: '' },
    children: [
      {
        name: 'systemRelease',
        meta: { title: '发版', requireAuth: true },
        path: '/workflow/smartForm/release/systemRelease',
        component: () => import('@/views/workflow/smartForm/release/systemRelease')
      }
    ]
  },
  // ==========sendActor============
  {
    name: 'actorRejectSelect',
    path: '/workflow/sendActor/actorRejectSelect',
    component: () => import('@/views/workflow/sendActor/actorRejectSelect')
  },
  {
    name: 'actorSelect',
    path: '/workflow/sendActor/actorSelect',
    component: () => import('@/views/workflow/sendActor/actorSelect')
  },
  {
    name: 'assistActorSelect',
    path: '/workflow/sendActor/assistActorSelect',
    component: () => import('@/views/workflow/sendActor/assistActorSelect')
  },
  {
    name: 'circulatedActorSelect',
    path: '/workflow/sendActor/circulatedActorSelect',
    component: () => import('@/views/workflow/sendActor/circulatedActorSelect')
  },
  {
    name: 'openSendTaskCommunicationDailog',
    path: '/workflow/sendActor/openSendTaskCommunicationDailog',
    component: () => import('@/views/workflow/sendActor/openSendTaskCommunicationDailog')
  },
  {
    name: 'openSendTaskdisterDailog',
    path: '/workflow/sendActor/openSendTaskdisterDailog',
    component: () => import('@/views/workflow/sendActor/openSendTaskdisterDailog')
  },
  {
    name: 'showHistoryTaskdisterDailog',
    path: '/workflow/sendActor/showHistoryTaskdisterDailog',
    component: () => import('@/views/workflow/sendActor/showHistoryTaskdisterDailog')
  },
  {
    name: 'taskdisterSelect',
    path: '/workflow/sendActor/taskdisterSelect',
    component: () => import('@/views/workflow/sendActor/taskdisterSelect')
  },
  // ====================流程监控  workflowMonitor=========================//
  {
    path: '/Processmonitoring',
    component: Layout,
    redirect: '/workflow/workflowMonitor/orgProceInstAuthorSearchList',
    name: 'Processmonitoring',
    meta: { title: '' },
    children: [
      {
        name: 'orgProceInstAuthorSearchList',
        meta: { title: '部门授权实例查询', requireAuth: true },
        path: '/workflow/workflowMonitor/orgProceInstAuthorSearchList',
        component: () => import('@/views/workflow/workflowMonitor/orgProceInstAuthorSearchList')
      },
      {
        name: 'orgProceInstSearchList',
        meta: { title: '部门实例查询', requireAuth: true },
        path: '/workflow/workflowMonitor/orgProceInstSearchList',
        component: () => import('@/views/workflow/workflowMonitor/orgProceInstSearchList')
      },
      {
        name: 'orgCustProceInstSearchList',
        meta: { title: '扩展实例查询', requireAuth: true },
        path: '/workflow/workflowMonitor/orgCustProceInstSearchList',
        component: () => import('@/views/workflow/workflowMonitor/orgCustProceInstSearchList')
      },
      {
        name: 'advancedSearchList',
        meta: { title: '流程实例查询', requireAuth: true },
        path: '/workflow/workflowMonitor/advancedSearchList',
        component: () => import('@/views/workflow/workflowMonitor/advancedSearchList')
      },
      {
        name: 'todoTaskManageList',
        meta: { title: '待办任务管理', requireAuth: true },
        path: '/workflow/workflowMonitor/todoTaskManageList',
        component: () => import('@/views/workflow/workflowMonitor/todoTaskManageList')
      },
      {
        name: 'activationProcessList',
        meta: { title: '激活归档实例', requireAuth: true },
        path: '/workflow/workflowMonitor/activationProcessList',
        component: () => import('@/views/workflow/workflowMonitor/activationProcessList')
      },
      {
        name: 'processInstanceManageList',
        meta: { title: '流程实例管理', requireAuth: true },
        path: '/workflow/workflowMonitor/processInstanceManageList',
        component: () => import('@/views/workflow/workflowMonitor/processInstanceManageList')
      },
      {
        name: 'freeflowWorkflowInstanceList',
        meta: { title: '自定义流管理', requireAuth: true },
        path: '/workflow/workflowMonitor/freeflowWorkflowInstanceList',
        component: () => import('@/views/workflow/workflowMonitor/freeflowWorkflowInstanceList')
      },
      {
        name: 'logMonitorList',
        meta: { title: '流程日志监控', requireAuth: true },
        path: '/workflow/security/logMonitor/logMonitorList',
        component: () => import('@/views/workflow/security/logMonitor/logMonitorList')
      },
      {
        name: 'logRestAccessList',
        meta: { title: 'REST接口日志', requireAuth: true },
        path: '/workflow/security/logMonitor/logRestAccessList',
        component: () => import('@/views/workflow/security/logMonitor/logRestAccessList')
      },
      {
        name: 'logChangeList',
        meta: { title: '流程变更记录', requireAuth: true },
        path: '/workflow/security/logChange/logChangeList',
        component: () => import('@/views/workflow/security/logChange/logChangeList')
      },
      {
        name: 'taskHandoverList',
        meta: { title: '已办交接管理', requireAuth: true },
        path: '/workflow/taskHandover/taskHandoverList',
        component: () => import('@/views/workflow/taskHandover/taskHandoverList')
      },
      {
        name: 'customDataGridView',
        path: '/workflow/security/customDataGrid/customDataGridView',
        component: () => import('@/views/workflow/security/customDataGrid/customDataGridView')
      }
    ]
  },
  {
    name: 'taskHandoverEdit',
    path: '/workflow/taskHandover/taskHandoverEdit',
    component: () => import('@/views/workflow/taskHandover/taskHandoverEdit')
  },
  {
    name: 'changeProcessInstanceStator',
    path: '/workflow/workflowMonitor/changeProcessInstanceStator',
    component: () => import('@/views/workflow/workflowMonitor/changeProcessInstanceStator')
  },
  {
    name: 'bathCirculationDialog',
    path: '/workflow/workflowMonitor/bathCirculationDialog',
    component: () => import('@/views/workflow/workflowMonitor/bathCirculationDialog')
  },
  {
    name: 'bathHandoverTaskDialog',
    path: '/workflow/workflowMonitor/bathHandoverTaskDialog',
    component: () => import('@/views/workflow/workflowMonitor/bathHandoverTaskDialog')
  },
  {
    name: 'bathSendTaskDialog',
    path: '/workflow/workflowBusiness/bathSendTaskDialog',
    component: () => import('@/views/workflow/workflowBusiness/bathSendTaskDialog')
  },
  {
    name: 'freeflowactivityEdit',
    path: '/workflow/workflowMonitor/freeflowactivityEdit',
    component: () => import('@/views/workflow/workflowMonitor/freeflowactivityEdit')
  },
  {
    name: 'freeflowactivityList',
    path: '/workflow/workflowMonitor/freeflowactivityList',
    component: () => import('@/views/workflow/workflowMonitor/freeflowactivityList')
  },
  {
    name: 'urgeRemind',
    path: '/workflow/workflowMonitor/urgeRemind',
    component: () => import('@/views/workflow/workflowMonitor/urgeRemind')
  },
  {
    name: 'appendComment',
    path: '/workflow/workflowMonitor/appendComment',
    component: () => import('@/views/workflow/workflowMonitor/appendComment')
  },
  {
    name: 'logMonitorView',
    path: '/workflow/security/logMonitor/logMonitorView',
    component: () => import('@/views/workflow/security/logMonitor/logMonitorView')
  },
  {
    name: 'appendTask',
    path: '/workflow/workflowMonitor/appendTask',
    component: () => import('@/views/workflow/workflowMonitor/appendTask')
  },
  {
    name: 'sendToActivityDialog',
    path: '/workflow/workflowMonitor/sendToActivityDialog',
    component: () => import('@/views/workflow/workflowMonitor/sendToActivityDialog')
  },
  {
    name: 'sendActiveToActivityDialog',
    path: '/workflow/workflowMonitor/sendActiveToActivityDialog',
    component: () => import('@/views/workflow/workflowMonitor/sendActiveToActivityDialog')
  },
  {
    path: '/workflowAnalysis',
    component: Layout,
    redirect: '/workflow/workflowAnalysis/instStatePieReport',
    name: 'workflowAnalysis',
    meta: { title: '' },
    children: [
      {
        name: 'instStatePieReport',
        meta: { title: '流程实例状态', requireAuth: true },
        path: '/workflow/workflowAnalysis/instStatePieReport',
        component: () => import('@/views/workflow/workflowAnalysis/instStatePieReport')
      },
      {
        name: 'departTaskTotalDistReport',
        meta: { title: '部门流程任务状态', requireAuth: true },
        path: '/workflow/workflowAnalysis/departTaskTotalDistReport',
        component: () => import('@/views/workflow/workflowAnalysis/departTaskTotalDistReport')
      },
      {
        name: 'personalTaskDistReport',
        meta: { title: '个人流程任务状态', requireAuth: true },
        path: '/workflow/workflowAnalysis/personalTaskDistReport',
        component: () => import('@/views/workflow/workflowAnalysis/personalTaskDistReport')
      },
      {
        name: 'activityTimeCostReport',
        meta: { title: '查询流程节点耗时', requireAuth: true },
        path: '/workflow/workflowAnalysis/activityTimeCostReport',
        component: () => import('@/views/workflow/workflowAnalysis/activityTimeCostReport')
      },
      {
        name: 'activityTaskCountReport',
        meta: { title: '查询流程任务数量', requireAuth: true },
        path: '/workflow/workflowAnalysis/activityTaskCountReport',
        component: () => import('@/views/workflow/workflowAnalysis/activityTaskCountReport')
      },
      {
        name: 'instCountPillReport',
        meta: { title: '流程发起实例数', requireAuth: true },
        path: '/workflow/workflowAnalysis/instCountPillReport',
        component: () => import('@/views/workflow/workflowAnalysis/instCountPillReport')
      },
      {
        name: 'instStatetPillReport',
        meta: { title: '流程实例状态', requireAuth: true },
        path: '/workflow/workflowAnalysis/instStatetPillReport',
        component: () => import('@/views/workflow/workflowAnalysis/instStatetPillReport')
      },
      {
        name: 'instDayCountLineReport',
        meta: { title: '每日流程实例数', requireAuth: true },
        path: '/workflow/workflowAnalysis/instDayCountLineReport',
        component: () => import('@/views/workflow/workflowAnalysis/instDayCountLineReport')
      },
      {
        name: 'instMonthCountLineReport',
        meta: { title: '每月流程实例数', requireAuth: true },
        path: '/workflow/workflowAnalysis/instMonthCountLineReport',
        component: () => import('@/views/workflow/workflowAnalysis/instMonthCountLineReport')
      },
      {
        name: 'processTaskWarningReport',
        meta: { title: '用户任务超时分析', requireAuth: true },
        path: '/workflow/workflowAnalysis/processTaskWarningReport',
        component: () => import('@/views/workflow/workflowAnalysis/processTaskWarningReport')
      },
      {
        name: 'participatTaskReport',
        meta: { title: '用户参与任务数', requireAuth: true },
        path: '/workflow/workflowAnalysis/participatTaskReport',
        component: () => import('@/views/workflow/workflowAnalysis/participatTaskReport')
      }
    ]
  },
  // ==============集成接入===============================//
  {
    path: '/jinchengjieru',
    component: Layout,
    redirect: '/workflow/security/orgImpl/userOrgList',
    name: 'jinchengjieru',
    meta: { title: '' },
    children: [
      {
        name: 'userOrgList',
        meta: { title: '接入的用户组织', requireAuth: true },
        path: '/workflow/security/orgImpl/userOrgList',
        component: () => import('@/views/workflow/security/orgImpl/userOrgList')
      },
      {
        name: 'roleList_',
        meta: { title: '接入的角色查询', requireAuth: true },
        path: '/workflow/security/orgImpl/roleList',
        component: () => import('@/views/workflow/security/orgImpl/roleList')
      },
      {
        name: 'postJobList_',
        meta: { title: '接入的职务查询', requireAuth: true },
        path: '/workflow/security/orgImpl/implPostJobList',
        component: () => import('@/views/workflow/security/orgImpl/implPostJobList')
      },
      {
        name: 'positionList_',
        meta: { title: '接入的岗位查询', requireAuth: true },
        path: '/workflow/security/orgImpl/implPositionList',
        component: () => import('@/views/workflow/security/orgImpl/implPositionList')
      },
      {
        name: 'userRoleList',
        meta: { title: '接入的用户角色', requireAuth: true },
        path: '/workflow/security/orgImpl/userRoleList',
        component: () => import('@/views/workflow/security/orgImpl/userRoleList')
      },
      {
        name: 'roleInResourceList_',
        meta: { title: '接入角色的菜单', requireAuth: true },
        path: '/workflow/security/orgImpl/roleInResourceList',
        component: () => import('@/views/workflow/security/orgImpl/roleInResourceList')
      },
      {
        name: 'dataMigrateList',
        meta: { title: '从已有数据发起', requireAuth: true },
        path: '/workflow/security/dataMigrate/dataMigrateList',
        component: () => import('@/views/workflow/security/dataMigrate/dataMigrateList')
      },
      {
        name: 'organizationConfigList',
        meta: { title: '组织架构接入', requireAuth: true },
        path: '/workflow/security/adaptConfig/organizationConfigList',
        component: () => import('@/views/workflow/security/adaptConfig/organizationConfigList')
      },
      {
        name: 'clusterWebsiteList',
        meta: { title: '集群站点管理', requireAuth: true },
        path: '/workflow/security/clusterWebsite/clusterWebsiteList',
        component: () => import('@/views/workflow/security/clusterWebsite/clusterWebsiteList')
      },
      {
        name: 'appSystemConfigList',
        meta: { title: '鉴权验证管理', requireAuth: true },
        path: '/workflow/security/appSystemConfig/appSystemConfigList',
        component: () => import('@/views//workflow/security/appSystemConfig/appSystemConfigList')
      }
    ]

  },
  {
    name: 'implShowUserInPosition',
    path: '/workflow/security/orgImpl/implShowUserInPosition',
    component: () => import('@/views/workflow/security/orgImpl/implShowUserInPosition')
  },
  {
    name: 'clusterWebsiteEdit',
    path: '/workflow/security/clusterWebsite/clusterWebsiteEdit',
    component: () => import('@/views/workflow/security/clusterWebsite/clusterWebsiteEdit')
  },
  {
    name: 'appSystemConfigEdit',
    path: '/workflow/security/appSystemConfig/appSystemConfigEdit',
    component: () => import('@/views/workflow/security/appSystemConfig/appSystemConfigEdit')
  },
  // ==============印章管理===============================//
  {
    path: '/selManager',
    component: Layout,
    redirect: '/workflow/security/seal/sealList',
    name: 'selManager',
    meta: { title: '' },
    children: [
      {
        name: 'sealList',
        meta: { title: '印章管理', requireAuth: true },
        path: '/workflow/security/seal/sealList',
        component: () => import('@/views/workflow/security/seal/sealList')
      },
      {
        name: 'sealInstList',
        meta: { title: '印章实例', requireAuth: true },
        path: '/workflow/security/seal/sealInstList',
        component: () => import('@/views/workflow/security/seal/sealInstList')
      }
    ]
  },
  {
    name: 'sealEdit',
    path: '/workflow/security/seal/sealEdit',
    component: () => import('@/views/workflow/security/seal/sealEdit')
  },
  {
    name: 'sealInstEdit',
    path: '/workflow/security/seal/sealInstEdit',
    component: () => import('@/views/workflow/security/seal/sealInstEdit')
  }, // ==============应用管理===============================//

  {
    path: '/application',
    component: Layout,
    redirect: '/workflow/security/application/applicationList',
    name: 'application_',
    meta: { title: '' },
    children: [
      {
        name: 'applicationList',
        meta: { title: '应用管理', requireAuth: true },
        path: '/workflow/security/application/applicationList',
        component: () => import('@/views/workflow/security/application/applicationList')
      },
      {
        name: 'applicationHome',
        meta: { title: '应用' },
        path: '/workflow/security/application/applicationHome',
        component: () => import('@/views/workflow/security/application/applicationHome')
      }
    ]
  },
  {
    name: 'applicationGroupEdit',
    path: '/workflow/security/application/applicationGroupEdit',
    component: () => import('@/views/workflow/security/application/applicationGroupEdit')
  },
  {
    name: 'applicationEdit2',
    path: '/workflow/security/application/applicationEdit',
    component: () => import('@/views/workflow/security/application/applicationEdit')
  },
  {
    name: 'applicationItemList',
    path: '/workflow/security/application/applicationItemList',
    component: () => import('@/views/workflow/security/application/applicationItemList')
  },
  {
    name: 'applicationItemEdit',
    path: '/workflow/security/application/applicationItemEdit',
    component: () => import('@/views/workflow/security/application/applicationItemEdit')
  },
  {
    name: 'applicationEdit',
    path: '/workflow/security/application/applicationEdit',
    component: () => import('@/views/workflow/security/application/applicationEdit')
  },
  // ==============信息管理===============================//
  {
    path: '/articleManager',
    component: Layout,
    redirect: '/workflow/security/article/articleList',
    name: 'articleManager',
    meta: { title: '' },
    children: [
      {
        name: 'articleList',
        meta: { title: '文章管理', requireAuth: true },
        path: '/workflow/security/article/articleList/',
        component: () => import('@/views/workflow/security/article/articleOfInfoTypeList')
      },
      {
        name: 'linkOfInfoTypeList',
        meta: { title: '链接管理', requireAuth: true },
        path: '/workflow/security/article/linkList',
        component: () => import('@/views/workflow/security/article/linkOfInfoTypeList')
      },
      {
        name: 'announcementList',
        meta: { title: '通知公告', requireAuth: true },
        path: '/workflow/security/article/announcementList',
        component: () => import('@/views/workflow/security/article/linkOfInfoTypeList')
      }

    ]
  },
  {
    name: 'articleEdit',
    path: '/workflow/security/article/articleEdit',
    component: () => import('@/views/workflow/security/article/articleEdit')
  },
  {
    name: 'fastChannelEdit',
    path: '/workflow/security/article/fastChannelEdit',
    component: () => import('@/views/workflow/security/article/fastChannelEdit')
  },
  {
    name: 'articleView',
    path: '/workflow/security/article/articleView',
    component: () => import('@/views/workflow/security/article/articleView')
  },
  {
    name: 'publicAuthorEdit',
    path: '/workflow/security/publicAuthor/publicAuthorEdit',
    component: () => import('@/views/workflow/security/publicAuthor/publicAuthorEdit')
  },
  // ==============系统设置===============================//
  {
    path: '/flowSystem',
    component: Layout,
    redirect: '/workflow/security/category/categoryGroupList',
    name: 'flowSystem',
    meta: { title: '' },
    children: [
      {
        name: 'categoryGroupList',
        meta: { title: '类别分组', requireAuth: true },
        path: '/workflow/security/category/categoryGroupList',
        component: () => import('@/views/workflow/security/category/categoryGroupList')
      },
      {
        name: 'licenseRegisterInfo',
        meta: { title: 'License授权注册', requireAuth: true },
        path: '/workflow/security/register/licenseRegisterInfo',
        component: () => import('@/views/workflow/security/register/licenseRegisterInfo')
      },
      {
        name: 'jvmRuntimeInfo',
        meta: { title: '服务器资源情况' },
        path: '/workflow/security/register/jvmRuntimeInfo',
        component: () => import('@/views/workflow/security/register/jvmRuntimeInfo')
      },
       {
        name: 'systemStatusList',
        meta: { title: '系统状态管理', requireAuth: true },
        path: '/workflow/security/systemStatus/systemStatusList',
        component: () => import('@/views/workflow/security/systemStatus/systemStatusList')
      }
    ]
  },
  {
    name: 'registerLicList',
    path: '/workflow/security/register/registerLicList',
    component: () => import('@/views/workflow/security/register/registerLicList')
  },
  {
    name: 'registerLicEdit',
    path: '/workflow/security/register/registerLicEdit',
    component: () => import('@/views/workflow/security/register/registerLicEdit')
  },
  {
    name: 'systemStatusEdit',
    path: '/workflow/security/systemStatus/systemStatusEdit',
    component: () => import('@/views/workflow/security/systemStatus/systemStatusEdit')
  },
  // ==============interfaceConfig    ===================//
   {
    name: 'gridConfigList',
    path: '/workflow/security/gridConfig/gridConfigList',
    component: () => import('@/views/workflow/security/gridConfig/gridConfigList')
  },
  // ==============customDialog  ===================//
  {
    name: 'openCustomDialog',
    path: '/workflow/customDialog/openCustomDialog',
    component: () => import('@/views/workflow/customDialog/openCustomDialog')
  },
  {
    name: 'customDialogEdit',
    path: '/workflow/customDialog/customDialogEdit',
    component: () => import('@/views/workflow/customDialog/customDialogEdit')
  },
  {
    name: 'customDialogImport',
    path: '/workflow/customDialog/customDialogImport',
    component: () => import('@/views/workflow/customDialog/customDialogImport')
  },
  {
    name: 'settingResultField',
    path: '/workflow/customDialog/settingResultField',
    component: () => import('@/views/workflow/customDialog/settingResultField')
  },
  // ==============SelectorController 选择器  ===================//

  // grid Editor编辑器
  {
    name: 'defaultEditor',
    path: '/workflow/gridEditor/defaultEditor',
    component: () => import('@/views/workflow/gridEditor/defaultEditor')
  },

  {
    name: 'listCloseDialog',
    path: '/workflow/gridEditor/listCloseDialog',
    component: () => import('@/views/workflow/gridEditor/listCloseDialog')
  },
  {
    name: 'defaultEditor2',
    path: '/workflow/gridEditor/defaultEditor2',
    component: () => import('@/views/workflow/gridEditor/defaultEditor2')
  },
  {
    name: 'updateInvicode',
    path: '/workflow/gridEditor/updateInvicode',
    component: () => import('@/views/workflow/gridEditor/updateInvicode')
  },
  {
    name: 'invoiceDialog',
    path: '/workflow/gridEditor/invoiceDialog',
    component: () => import('@/views/workflow/gridEditor/invoiceDialog')
  },
  {
    // 银企直连收款
    name: 'bankCollectionDialog',
    path: '/workflow/gridEditor/bankCollectionDialog',
    component: () => import('@/views/workflow/gridEditor/bankCollectionDialog')
  },
  {
    name: 'generateDialogInvoiceDialog',
    path: '/workflow/gridEditor/generatedDialogInvoice',
    component: () => import('@/views/workflow/gridEditor/generatedDialogInvoice.vue')
  },
  {
    name: 'billCollectorDialog',
    path: '/workflow/gridEditor/billCollectorDialog',
    component: () => import('@/views/workflow/gridEditor/billCollectorDialog.vue')
  },
  // 材料供应商 链接弹窗
  {
    name: 'linkDialog',
    path: '/workflow/gridEditor/linkDialog',
    component: () => import('@/views/workflow/gridEditor/linkDialog')
  },
  // 开票 更新附件
  {
    name: 'updateFiles',
    path: '/workflow/gridEditor/updateFiles',
    component: () => import('@/views/workflow/gridEditor/updateFiles')
  },
  // 银行信息控件
  {
    name: 'bankDialog',
    path: '/workflow/gridEditor/bankDialog',
    component: () => import('@/views/workflow/gridEditor/bankDialog')
  },
  // 批量认领发票 batchClaimInvoicesDialog
  {
    name: 'bankDialog',
    path: '/workflow/gridEditor/batchClaimInvoicesDialog',
    component: () => import('@/views/workflow/gridEditor/batchClaimInvoicesDialog')
  },
  {
    name: 'commonEditor',
    path: '/workflow/selector/commonEditor',
    component: () => import('@/views/workflow/gridEditor/commonEditor')
  },
  // 通用editors 编辑器
  {
    name: 'keyValueEditor',
    path: '/workflow/selector/keyValueEditor',
    component: () => import('@/views/workflow/editors/keyValueEditor')
  },
  {
    name: 'selectTextEditor',
    path: '/workflow/selector/selectTextEditor',
    component: () => import('@/views/workflow/editors/selectTextEditor')
  },

  // selector 通用选择器
  {
    name: 'selectReport',
    path: '/workflow/selector/selectReport',
    component: () => import('@/views/workflow/selector/selectReport')
  },
  {
    name: 'processVarExpressEdit',
    path: '/workflow/selector/processVarExpressEdit',
    component: () => import('@/views/workflow/selector/processVarExpressEdit')
  },
  {
    name: 'selectDicConfigType',
    path: '/workflow/selector/selectDicConfigType',
    component: () => import('@/views/workflow/selector/selectDicConfigType')
  },
  {
    name: 'selectMapAddress',
    path: '/workflow/selector/selectMapAddress',
    component: () => import('@/views/workflow/selector/selectMapAddress')
  },
  {
    name: 'selectCategory',
    path: '/workflow/selector/selectCategory',
    component: () => import('@/views/workflow/selector/selectCategory')
  },
  {
    name: 'selectTemplateBackup',
    path: '/workflow/selector/selectTemplateBackup',
    component: () => import('@/views/workflow/selector/selectTemplateBackup')
  },
  {
    name: 'customButtonSelect',
    path: '/workflow/selector/customButtonSelect',
    component: () => import('@/views/workflow/selector/customButtonSelect')
  },
  {
    name: 'workflowAppSelect',
    path: '/workflow/selector/workflowAppSelect',
    component: () => import('@/views/workflow/selector/workflowAppSelect')
  },
  {
    name: 'workflowFormSelect',
    path: '/workflow/selector/workflowFormSelect',
    component: () => import('@/views/workflow/selector/workflowFormSelect')
  },
  {
    name: 'selectUsers',
    path: '/workflow/selector/selectUsers',
    component: () => import('@/views/workflow/selector/selectUsers')
  },
  {
    name: 'selectPosition',
    path: '/workflow/selector/selectPosition',
    component: () => import('@/views/workflow/selector/selectPosition')
  },
  {
    name: 'selectPostJob',
    path: '/workflow/selector/selectPostJob',
    component: () => import('@/views/workflow/selector/selectPostJob')
  },
  {
    name: 'selectOnlyUsers',
    path: '/workflow/selector/selectOnlyUsers',
    component: () => import('@/views/workflow/selector/selectOnlyUsers')
  },
  {
    name: 'selectRole',
    path: '/workflow/selector/selectRole',
    component: () => import('@/views/workflow/selector/selectRole')
  },
  {
    name: 'selectOrg',
    path: '/workflow/selector/selectOrg',
    component: () => import('@/views/workflow/selector/selectOrg')
  },
  // 添加部门选择（修改版） selectOrg_custom
  {
    name: 'selectOrg_custom',
    path: '/workflow/selector/selectOrg_custom',
    component: () => import('@/views/workflow/selector/selectOrg_custom')
  },
  {
    name: 'selectHistoryActivity',
    path: '/workflow/selector/selectHistoryActivity',
    component: () => import('@/views/workflow/selector/selectHistoryActivity')
  },
  {
    name: 'selectApproAction',
    path: '/workflow/selector/selectApproAction',
    component: () => import('@/views/workflow/selector/selectApproAction')
  },
  {
    name: 'selectFormField',
    path: '/workflow/selector/selectFormField',
    component: () => import('@/views/workflow/selector/selectFormField')
  },
  {
    name: 'formDefSelect',
    path: '/workflow/selector/formDefSelect',
    component: () => import('@/views/workflow/selector/formDefSelect')
  },
  {
    name: 'customDataGridSelect',
    path: '/workflow/selector/customDataGridSelect',
    component: () => import('@/views/workflow/selector/customDataGridSelect')
  },
  {
    name: 'appPortalSelect',
    path: '/workflow/selector/appPortalSelect',
    component: () => import('@/views/workflow/selector/appPortalSelect')
  },
  {
    name: 'applicationItemSelect',
    path: '/workflow/selector/applicationItemSelect',
    component: () => import('@/views/workflow/selector/applicationItemSelect')
  },
  {
    name: 'selectDataDict',
    path: '/workflow/selector/selectDataDict',
    component: () => import('@/views/workflow/selector/selectDataDict')
  },
  {
    name: 'selectRelationType',
    path: '/workflow/selector/selectRelationType',
    component: () => import('@/views/workflow/selector/selectRelationType')
  },
  {
    name: 'selectRelation',
    path: '/workflow/selector/selectRelation',
    component: () => import('@/views/workflow/selector/selectRelation')
  },
  {
    name: 'selectTenantor',
    path: '/workflow/selector/selectTenantor',
    component: () => import('@/views/workflow/selector/selectTenantor')
  },
  {
    name: 'selectFormFieldProcInstContextVar',
    path: '/workflow/selector/selectFormFieldProcInstContextVar',
    component: () => import('@/views/workflow/selector/selectFormFieldProcInstContextVar')
  },
  {
    name: 'workflowSelect',
    path: '/workflow/selector/workflowSelect',
    component: () => import('@/views/workflow/selector/workflowSelect')
  },
  {
    name: 'selectPersonalSeal',
    path: '/workflow/selector/selectPersonalSeal',
    component: () => import('@/views/workflow/selector/selectPersonalSeal')
  },
  {
    name: 'selectDbTable',
    path: '/workflow/selector/selectDbTable',
    component: () => import('@/views/workflow/selector/selectDbTable')
  },
  {
    name: 'selectAweIcon',
    path: '/workflow/selector/selectAweIcon',
    component: () => import('@/views/workflow/selector/selectAweIcon')
  },
  {
    name: 'dbfieldSelect',
    path: '/workflow/selector/dbfieldSelect',
    component: () => import('@/views/workflow/selector/dbfieldSelect')
  },
  {
    name: 'dbfieldWhereSelect',
    path: '/workflow/selector/dbfieldWhereSelect',
    component: () => import('@/views/workflow/selector/dbfieldWhereSelect')
  },
  {
    name: 'dbfieldParamsSelect',
    path: '/workflow/selector/dbfieldParamsSelect',
    component: () => import('@/views/workflow/selector/dbfieldParamsSelect')
  },
  {
    name: 'handsignQRCodeDialog',
    path: '/workflow/selector/handsignQRCodeDialog',
    component: () => import('@/views/workflow/selector/handsignQRCodeDialog')
  },
  {
    name: 'selectWorkflowActForm',
    path: '/workflow/selector/selectWorkflowActForm',
    component: () => import('@/views/workflow/selector/selectWorkflowActForm')
  },
  {
    name: 'selectWorkflowActivity',
    path: '/workflow/selector/selectWorkflowActivity',
    component: () => import('@/views/workflow/selector/selectWorkflowActivity')
  },
  {
    name: 'selectFormTable',
    path: '/workflow/selector/selectFormTable',
    component: () => import('@/views/workflow/selector/selectFormTable')
  },
  {
    name: 'formDefTableRelSelect',
    path: '/workflow/selector/formDefTableRelSelect',
    component: () => import('@/views/workflow/selector/formDefTableRelSelect')
  },
  {
    name: 'selectColor',
    path: '/workflow/selector/selectColor',
    component: () => import('@/views/workflow/selector/selectColor')
  },
  {
    name: 'selectStyle',
    path: '/workflow/selector/selectStyle',
    component: () => import('@/views/workflow/selector/selectStyle')
  },

  {
    name: 'handsign',
    path: '/workflow/public/handsign',
    component: () => import('@/views/workflow/public/handsign')
  },

  // ==============flowDesigner  ===================//
  {
    name: 'buildFormCondition',
    path: '/workflow/flowDesigner/buildFormCondition',
    component: () => import('@/views/workflow/flowDesigner/buildFormCondition')
  },
  {
    name: 'transitionConditionEdit',
    path: '/workflow/flowDesigner/transitionConditionEdit',
    component: () => import('@/views/workflow/flowDesigner/transitionConditionEdit')
  },
  {
    name: 'actionButtonsList',
    path: '/workflow/flowDesigner/actionButtonsList',
    component: () => import('@/views/workflow/flowDesigner/actionButtonsList')
  },
  {
    name: 'workflowMap',
    path: '/workflow/flowDesigner/workflowMap',
    component: () => import('@/views/workflow/flowDesigner/workflowMap')
  },
  {
    name: 'workflowMapTimeline',
    path: '/workflow/flowDesigner/workflowMapTimeline',
    component: () => import('@/views/workflow/flowDesigner/workflowMapTimeline')
  },
  {
    name: 'workflowSimulation',
    path: '/workflow/flowDesigner/workflowSimulation',
    component: () => import('@/views/workflow/flowDesigner/workflowSimulation')
  },
  {
    name: 'simulationParamsList',
    path: '/workflow/simulationParams/simulationParamsList',
    component: () => import('@/views/workflow/simulationParams/simulationParamsList')
  },
  {
    name: 'simulationParamsEdit',
    path: '/workflow/simulationParams/simulationParamsEdit',
    component: () => import('@/views/workflow/simulationParams/simulationParamsEdit')
  },
  {
    name: 'windowTextEdit',
    path: '/workflow/flowDesigner/windowTextEdit',
    component: () => import('@/views/workflow/flowDesigner/windowTextEdit')
  },

  {
    name: 'actorParamterEdit',
    path: '/workflow/flowDesigner/actorParamterEdit',
    component: () => import('@/views/workflow/flowDesigner/actorParamterEdit')
  },
  {
    name: 'advancedOptionsDialog',
    path: '/workflow/flowDesigner/advancedOptionsDialog',
    component: () => import('@/views/workflow/flowDesigner/advancedOptionsDialog')
  },
  {
    name: 'assemblyEdit',
    path: '/workflow/flowDesigner/assemblyEdit',
    component: () => import('@/views/workflow/flowDesigner/assemblyEdit')
  },
  {
    name: 'dataActorService',
    path: '/workflow/flowDesigner/dataActorService',
    component: () => import('@/views/workflow/flowDesigner/dataActorService')
  },
  {
    name: 'expirationRuleList',
    path: '/workflow/flowDesigner/expirationRuleList',
    component: () => import('@/views/workflow/flowDesigner/expirationRuleList')
  },
  {
    name: 'importActivity',
    path: '/workflow/flowDesigner/importActivity',
    component: () => import('@/views/workflow/flowDesigner/importActivity')
  },
  {
    name: 'configurationCheckView',
    path: '/workflow/flowDesigner/configurationCheckView',
    component: () => import('@/views/workflow/flowDesigner/configurationCheckView')
  },
  {
    name: 'extendedPropertyEdit',
    path: '/workflow/flowDesigner/extendedPropertyEdit',
    component: () => import('@/views/workflow/flowDesigner/extendedPropertyEdit')
  },
  {
    name: 'messageTemplateEdit',
    path: '/workflow/flowDesigner/messageTemplateEdit',
    component: () => import('@/views/workflow/flowDesigner/messageTemplateEdit')
  },
  {
    name: 'nodeFormEdit',
    path: '/workflow/flowDesigner/nodeFormEdit',
    component: () => import('@/views/workflow/flowDesigner/nodeFormEdit')
  },
  {
    name: 'procMonitorUserEdit',
    path: '/workflow/flowDesigner/procMonitorUserEdit',
    component: () => import('@/views/workflow/flowDesigner/procMonitorUserEdit')
  },
  {
    name: 'rejectActivityDialog',
    path: '/workflow/flowDesigner/rejectActivityDialog',
    component: () => import('@/views/workflow/flowDesigner/rejectActivityDialog')
  },
  {
    name: 'selectActorByPage',
    path: '/workflow/flowDesigner/selectActorByPage',
    component: () => import('@/views/workflow/flowDesigner/selectActorByPage')
  },
  {
    name: 'selectActorUsers',
    path: '/workflow/flowDesigner/selectActorUsers',
    component: () => import('@/views/workflow/flowDesigner/selectActorUsers')
  },
  {
    name: 'setCategoryCode',
    path: '/workflow/flowDesigner/setCategoryCode',
    component: () => import('@/views/workflow/flowDesigner/setCategoryCode')
  },
  {
    name: 'todoNotifyMessageTemplateList',
    path: '/workflow/flowDesigner/todoNotifyMessageTemplateList',
    component: () => import('@/views/workflow/flowDesigner/todoNotifyMessageTemplateList')
  },
  {
    name: 'windowCommonInputEdit',
    path: '/workflow/flowDesigner/windowCommonInputEdit',
    component: () => import('@/views/workflow/flowDesigner/windowCommonInputEdit')
  },

  // ==============WorkflowBusiness ===================//
  {
    name: 'workflowform',
    path: '/workflow/workflowform/index',
    component: () => import('@/views/workflow/workflowBusiness/workflowform')
  },
  {
    name: 'noWorkflowform',
    path: '/workflow/noWorkflowform/index',
    component: () => import('@/views/workflow/workflowBusiness/noWorkflowform')
  },
  {
    name: 'showApprovalHistory',
    path: '/workflow/workflowBusiness/showApprovalHistory',
    component: () => import('@/views/workflow/workflowBusiness/showApprovalHistory')
  },
  {
    name: 'showCirculatedHistory',
    path: '/workflow/workflowBusiness/showCirculatedHistory',
    component: () => import('@/views/workflow/workflowBusiness/showCirculatedHistory')
  },
  {
    name: 'showAppendOpinion',
    path: '/workflow/workflowBusiness/showAppendOpinion',
    component: () => import('@/views/workflow/workflowBusiness/showAppendOpinion')
  },
  {
    name: 'showProcInstBaseInfo',
    path: '/workflow/workflowBusiness/showProcInstBaseInfo',
    component: () => import('@/views/workflow/workflowBusiness/showProcInstBaseInfo')
  },
  {
    name: 'attachmentUpload',
    path: '/workflow/workflowBusiness/attachmentUpload',
    component: () => import('@/views/workflow/workflowBusiness/attachmentUpload')
  },
  // ==============通用dialog start=========//
  {
    name: 'showModalMsg',
    path: '/workflow/dialog/showModalMsg',
    component: () => import('@/views/workflow/dialog/showModalMsg')
  },
  // ==============PageRoute 非菜路由 start=========//
  {
    name: 'opinionEdit',
    path: '/workflow/opinion/opinionEdit',
    component: () => import('@/views/workflow/opinion/opinionEdit')
  },
  {
    name: 'activityDelegateEdit',
    path: '/workflow/delegates/activityDelegateEdit',
    component: () => import('@/views/workflow/delegates/activityDelegateEdit')
  },
  {
    name: 'activityDelegateList',
    path: '/workflow/delegates/activityDelegateList',
    component: () => import('@/views/workflow/delegates/activityDelegateList')
  },
  {
    name: 'appDelegateEdit',
    path: '/workflow/delegates/appDelegateEdit',
    component: () => import('@/views/workflow/delegates/appDelegateEdit')
  },
  {
    name: 'dataDictEdit',
    path: '/workflow/security/systemss/dataDictEdit',
    component: () => import('@/views/workflow/security/dataDict/dataDictEdit')
  },
  {
    name: 'dataDictTypeEdit',
    path: '/workflow/security/dataDict/dataDictTypeEdit',
    component: () => import('@/views/workflow/security/dataDict/dataDictTypeEdit')
  },
  {
    name: 'processFormEdit',
    path: '/workflow/processDef/processFormEdit',
    component: () => import('@/views/workflow/processDef/processFormEdit')
  },
  {
    name: 'showAppOfDef',
    path: '/workflow/processDef/showAppOfDef',
    component: () => import('@/views/workflow/processDef/showAppOfDef')
  },
  {
    name: 'processDefEdit',
    path: '/workflow/processDef/processDefEdit',
    component: () => import('@/views/workflow/processDef/processDefEdit')
  },
  {
    name: 'processFromImport',
    path: '/workflow/processDef/processFromImport',
    component: () => import('@/views/workflow/processDef/processFromImport')
  },
  {
    name: 'processAppCombinEdit',
    path: '/workflow/processDef/processAppCombinEdit',
    component: () => import('@/views/workflow/processDef/processAppCombinEdit')
  },
  {
    name: 'processAppCombinBathAdd',
    path: '/workflow/processDef/processAppCombinBathAdd',
    component: () => import('@/views/workflow/processDef/processAppCombinBathAdd')
  },
  {
    name: 'processAppEdit',
    path: '/workflow/processDef/processAppEdit',
    component: () => import('@/views/workflow/processDef/processAppEdit')
  },
  {
    name: 'authorizeDefEdit',
    path: '/workflow/security/authorize/authorizeDefEdit',
    component: () => import('@/views/workflow/security/authorize/authorizeDefEdit')
  },
  {
    name: 'authorizeSourceUserEdit',
    path: '/workflow/security/authorize/authorizeSourceUserEdit',
    component: () => import('@/views/workflow/security/authorize/authorizeSourceUserEdit')
  },
  {
    name: 'categoryEdit',
    path: '/workflow/security/category/categoryEdit',
    component: () => import('@/views/workflow/security/category/categoryEdit')
  },
  {
    name: 'importCategoryXml',
    path: '/workflow/security/category/importCategoryXml',
    component: () => import('@/views/workflow/security/category/importCategoryXml')
  },
  {
    name: 'categoryGroupEdit',
    path: '/workflow/security/category/categoryGroupEdit',
    component: () => import('@/views/workflow/security/category/categoryGroupEdit')
  },

  {
    name: 'previewpdf',
    path: '/workflow/security/pdfview/previewpdf',
    component: () => import('@/views/workflow/security/pdfview/previewpdf')
  },
  {
    name: 'previewpicture',
    path: '/workflow/security/pdfview/previewpicture',
    component: () => import('@/views/workflow/security/pdfview/previewpicture')
  },

  {
    name: 'previewpdf2',
    path: '/workflow/security/pdfview/previewpdf2',
    component: () => import('@/views/workflow/security/pdfview/previewpdf2')
  },
  {
    name: 'previewpdf3',
    path: '/workflow/security/pdfview/previewpdf3',
    component: () => import('@/views/workflow/security/pdfview/previewpdf3')
  },
  {
    path: '/workflow/security/customDataGrid/selectCustomDataGridExtendEvent',
    name: 'selectCustomDataGridExtendEvent',
    meta: { title: '自定义列表扩展方法' },
    component: () => import('@/views/workflow/security/customDataGrid/selectCustomDataGridExtendEvent')
  },
  // ====================================== Demo===================//
  {
    path: '/workflow/demo/demoUrlForm',
    name: 'demoUrlForm',
    component: () => import('@/views/workflow/demo/demoUrlForm')
  },
  {
    path: '/workflow/demo/demoUrlFormList',
    name: 'demoUrlFormList',
    component: () => import('@/views/workflow/demo/demoUrlFormList')
  },
  {
    path: '/workflow/demo/demoUrlFormEdit',
    name: 'demoUrlFormEidt',
    component: () => import('@/views/workflow/demo/demoUrlFormEdit')
  },
  // ============== 外部系统iframe集成页面 start===================//
  {
    path: '/home/access_desktopIndex',
    name: 'access_desktopIndex',
    meta: { title: '首页' },
    component: () => import('@/views/home/access_desktopIndex')
  },
  {
    path: '/workflow/workflowBusiness/access_startWorkflowList',
    name: 'access_startWorkflowList',
    meta: { title: '发起流程' },
    component: () => import('@/views/workflow/workflowBusiness/startWorkflowList')
  },
  {
    path: '/workflow/workflowBusiness/access_todoList',
    name: 'access_todoList',
    meta: { title: '待办事项' },
    component: () => import('@/views/workflow/workflowBusiness/todoList')
  },
  {
    path: '/workflow/workflowBusiness/access_doneList',
    name: 'access_doneList',
    meta: { title: '已办流程' },
    component: () => import('@/views/workflow/workflowBusiness/doneList')
  },
  {
    path: '/workflow/workflowBusiness/access_doneDetailList',
    name: 'access_doneDetailList',
    meta: { title: '已办历史' },
    component: () => import('@/views/workflow/workflowBusiness/doneDetailList')
  },
  {
    path: '/workflow/workflowBusiness/access_myWorkItem',
    name: 'access_myWorkItem',
    meta: { title: '我发起的' },
    component: () => import('@/views/workflow/workflowBusiness/myWorkItem')
  },
  {
    path: '/workflow/workflowBusiness/access_draftList',
    name: 'access_draftList',
    meta: { title: '草稿箱' },
    component: () => import('@/views/workflow/workflowBusiness/draftList')
  },

  {
    path: '/workflow/workflowBusiness/access_myCancelList',
    name: 'access_myCancelList',
    meta: { title: '已作废' },
    component: () => import('@/views/workflow/workflowBusiness/myCancelList')
  },
  {
    path: '/workflow/pageRoute/access_opinionList',
    name: 'access_opinionList',
    meta: { title: '常用意见' },
    component: () => import('@/views/workflow/opinion/opinionList')
  },

  {
    path: '/workflow/smartForm/access_formDefList',
    name: 'access_formDefList',
    meta: { title: '表单定义' },
    component: () => import('@/views/workflow/smartForm/form/formDefList')
  },
  {
    path: '/workflow/processDef/access_processFormList',
    name: 'access_processFormList',
    meta: { title: '表单应用' },
    component: () => import('@/views/workflow/processDef/processFormList')
  },
  {
    name: 'access_processDefList',
    meta: { title: '流程设计' },
    path: '/workflow/processDef/access_processDefList',
    component: () => import('@/views/workflow/processDef/processDefList')
  },
  {
    name: 'access_processAppList',
    meta: { title: '流程应用' },
    path: '/workflow/processDef/access_processAppList',
    component: () => import('@/views/workflow/processDef/processAppList')
  },

  {
    name: 'access_authorizeDefList',
    meta: { title: '分管授权' },
    path: '/workflow/security/authorize/access_authorizeDefList',
    component: () => import('@/views/workflow/security/authorize/authorizeDefList')
  },
  {
    path: '/workflow/delegates/access_appDelegateList',
    name: 'access_appDelegateList',
    meta: { title: '流程委托' },
    component: () => import('@/views/workflow/delegates/appDelegateList')
  },
  // ==============外部系统iframe集成页面 end===================//

  // 404未找到页面时将跳到此页面
  { path: '*', redirect: '/404', hidden: true }

];

const createRouter = () => new Router({
  // 以下mode设置为history就是去掉Url中的#号，此时必须设置base为'/'
  mode: 'history', // 去掉mode设置的话vue会默认使用hash模式，该模式下回将路径格式化为 # 开头。
  base: '/', // 路由的根路径，通常是/
  // base: '/f2web/',
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
});

const router = createRouter();

export function resetRouter() {
  const newRouter = createRouter();
  router.matcher = newRouter.matcher; // reset router
}

export default router;
