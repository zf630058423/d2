export default {
  namespaced: true,
  state: {
    claimExpenseFrom: {
      formId: 'e7661248-8622-4122-8b33-8b3efged370d', //表单应用ID
      wiid: 'e7661248-8622-4122-8b33-8b3e6fed370d', //流程实例ID
      businessKey: 'bk_4c2fbd03-12cf-41cc-a4cb-8d25e11438c6', //业务key
      billNo: 'IFCN_2022100201', //单据编号
      reimbursementObject: '1', //报销对象  (对公对私)
      staffId: 'zzzz', //员工ID
      staff: 'zzzzz', //员工
      projectApproval: '3', //关联立项
      marketingProjectNo: 'sdasdasdas', //立项编号
      marketingProjectName: 'asdasdasd', //立项名称
      reimbursementAmount: '50000',
      payOrgId: 'asdasda', //付款财务组织ID
      payOrg: 'asdasda', //付款财务组织
      bankaccSubId: 'asdasda', //付款账号ID
      bankaccSub: 'asdasda', //付款账号
      checkNo: 'asdasda', //票据号
      payeeBankAccId: 'asdasd', //收款账号ID
      payeeBankAcc: 'asdasd', //收款账号
      payeeBankId: 'asdas', //收款银行ID
      payeeBank: 'asdasda', //收款银行
      receivingBankJointNumber: '20asdasda00', //收款银行联行号
      refundAmoun: '3000', //退款金额(含税)(元)
      paymentStatus: '2', //付款状态------------1是成功  2是失败
      memo: 'asdasads', //备注
      file: 'asdasdasda', //附件
      //-----------------------------------------------------------------------------------
      //员工费用报销-报销明细 (弹框)
      employeetReimbursementDetails: [
        {
          formId: 'e7661248-8622-4122-8b33-8b3efgdw370d', //表单应用ID
          wiid: 'e7661248-8622-4122-8b33-8sdse6fed370d', //流程实例ID
          businessKey: 'bk_4c2fbd03-12cf-41vv-a4cb-8d25e11438c6', //业务键
          bbstract: 'asdasda', //摘要
          reItemId: 'asdasd', //收支项目ID
          reItemName: 'asdasd', //收支项目
          balaTypeId: 'asdasd', //结算方式ID
          balaType: 'asdasd', //结算方式
          invoiceSituation: 'asdasd', //发票情况
          borrowingFormId: 'asdasd', //项目借款单id
          borrowingFormNo: 'asda', //项目借款单编号
          reimbursementAmount: '5000', //本次报销金额(含税)(元)
          amountBorrowed: '1000', //冲借款（元）
          whetherOrNotSplit: '1', //是否分摊   --
          // 弹框下面的form表单

          inputs: [
            {
              formId: 'asdaawdasdas', //表单应用ID
              wiid: 'asdasdas', ////流程实例ID
              businessKey: 'asdasd', //业务键
              money: '3000', //分摊金额
              deparTmentId: 'asdad', //部门Id
              deparTment: 'asdasd' //部门名称
            },
            {
              formId: '11111',
              wiid: '111',
              businessKey: '1111',
              money: '6000',
              deparTmentId: '111',
              deparTment: '111'
            }
          ]
        },
        {
          myId: '这是第二个', //表主建ID
          formId: '', //表单应用ID
          wiid: '', //流程实例ID
          businessKey: '', //业务键
          myParentId: '', //--上级键ID
          bbstract: '', //摘要
          reItemId: '', //收支项目ID
          reItemName: '', //收支项目
          balaTypeId: '', //结算方式ID
          balaType: '', //结算方式
          invoiceSituation: '', //发票情况
          borrowingFormId: '', //项目借款单id
          borrowingFormNo: '', //项目借款单编号
          reimbursementAmount: '', //本次报销金额(含税)(元)
          amountBorrowed: '', //冲借款（元）
          whetherOrNotSplit: '', //是否分摊
          inputs: [
            {
              myId: '', //表主建ID
              formId: '', //表单应用ID
              wiid: '', //流程实例ID
              businessKey: '', //业务键
              myParentId: '', //--上级键ID
              money: '', //分摊金额
              deparTmentId: '', //部门Id
              deparTment: '' //部门名称
            },
            {
              myId: '', //表主建ID
              formId: '', //表单应用ID
              wiid: '', //流程实例ID
              businessKey: '',
              myParentId: '',
              money: '',
              deparTmentId: '',
              deparTment: ''
            }
          ]
        }
      ],
      //-----------------------------------------------------------------------------------
      // 关联发票列表
      associatedInvoiceList: [
        {
          formId: 'asdasd', //表单应用ID
          wiid: 'asdasd', ////流程实例ID
          businessKey: 'asdas', ////业务键

          invoiceNo: 'asda', //发票号码
          invoiceCode: 'asda', //发票代码
          paybillDate: 'asda', //开票日期
          invoiceType: 'asdas', //发票类型
          sellerName: 'asdasda', //销售方名称
          invoiceAmount: '233333', //发票金额（含税）
          tax: '30', //税额
          invoiceAmountNoTax: '444444' //发票金额（无税）
        }
      ]
    }
  },
  getters: {},
  mutations: {
    // 增加费用
    setClaimExpenseERDFrom (state, { employeetReimbursementDetails, index }) {
      console.log('仓库的表单的弹框部分value:', employeetReimbursementDetails)
      console.log('仓库的表单的弹框部分index:', index)
      console.log(index == '', 'index == ""')

      if (index == '' && index !== 0) {
        console.log('新增')
        state.claimExpenseFrom.employeetReimbursementDetails.push(
          employeetReimbursementDetails
        )
      } else {
        console.log('编辑')
        // 写替换方法

        state.claimExpenseFrom.employeetReimbursementDetails[
          index
        ] = employeetReimbursementDetails

        // aa.forEach(item => {
        //   console.log('item:', item)
        //   item[index] = employeetReimbursementDetails
        // })
        console.log(
          'state.claimExpenseFrom.employeetReimbursementDetails:',
          state.claimExpenseFrom.employeetReimbursementDetails
        )
      }
    }
  },
  actions: {},
  Module: {}
}
