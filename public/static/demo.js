let nRContractType = '';
let nPaymentAmount = ''; //【审批通过+审批中+当前开票申请】且 是否关闭=否开票申请金额（含税）+ 审核通过 且 是否关闭=是 剩余可开票金额(含税)(元) 累计值
function extend_fuiOnPageLoad() {
  //FUI页面加载完成之后触发  FUI页面加载完成之后触发
  console.log("myData===", myData);
  var myId = myvm.data['ApplicationMakeOutInvoice.MyId'];
  var state = WFContext.WorkflowInstinceState;
  myvm.fieldsDef['subtable.InvoiceApplicationDetails']['ApplicationMakeOutInvoice.InvoiceApplicationDetails.ClassificationGoodsService']._isRequired = true;
  //  myvm.data['ApplicationMakeOutInvoice.TypeDocument'] = JSON.parse(myvm.data['ApplicationMakeOutInvoice.TypeDocument']);
  // 根据节点名称和发票类型判断
  setFildsValueByType();
  //查询累计已开票金额（含税）
  getAccumulatedInvoicedAmount();
  if (state === 0 || state === 1 || state === 5) { //拟稿 新增  驳回
    setFildsByApplyInfo();
    setMailingAddress();
    //  更新数据
    var id = myvm.data['ApplicationMakeOutInvoice.ProjectId'];
    if (id) {
      requestDataById();
    }
    // 获取开票信息
    getInvoiceInfo()
  }
    
  if(state === 2){
    var id = myvm.data['ApplicationMakeOutInvoice.ProjectId'];
    if (id) {
      fnRequestDataById();
    }
  }

  
  if (state === 0 || state === 5) {
    //根据 预缴情况 设置 预缴完税凭证号 字段状态
    setFildsByState()
  }

  //如果预缴情况为已缴税 预缴完税凭证号必填
  fnJuadgePrepaymentSituation();

  var name = myvm.wfContext.CurrentActivityName; // 流程节点名称
  var redType = myvm.data['ApplicationMakeOutInvoice.WhetherRedTicket']; // 红票状态
  var wfNames = ['财务管理中心税务主管', '税务会计', '建工税务会计', '园林税务会计开票', '幕墙税务会计2']
  if (state === 2 || state === 3) {
    if (wfNames.indexOf(name) == -1) {
      setFildByState();
    } else if (redType == 1) {
      setFildByState();
    } else if (wfNames.indexOf(name) !== -1 && redType == 0) {
      setFildByState('1');
    }
  }


  //  驳回和草稿，点击详情的时候，调接口刷最新数据
  if (state === 1 || state === 5) {
    // 可申请开票金额
    getRoadworkAmount();
    //初始化预计申请开票金额
    getExpectInvoiceApplicationAmount();
  }
  // 销售方
  var seller = myvm.data['ApplicationMakeOutInvoice.Seller'];
  if (seller) {
    setFildsBy(seller)
  }

//   isAdvancePayment();
  // 未预缴开票原因 是否显示 0显示 1不显示
  if (myvm.fieldsDef['ApplicationMakeOutInvoice.UnpaidInvoicingReason']._isShowPower) {
    myvm.data['ApplicationMakeOutInvoice.IsUnpaidInvoicingReason'] = '1'
  } else {
    myvm.data['ApplicationMakeOutInvoice.IsUnpaidInvoicingReason'] = '0'
  }

  // 预计申请开票金额(含保留两位小数）
  if (myvm.data['ApplicationMakeOutInvoice.ExpectApplyInvoicingAmountTax']) {
    myvm.data['ApplicationMakeOutInvoice.ExpectApplyInvoicingAmountTax'] = parseFloat(myvm.data['ApplicationMakeOutInvoice.ExpectApplyInvoicingAmountTax']).toFixed(2);  
  }

  // 累计已预缴计税基数(元)(含保留两位小数）
  if (myvm.data['ApplicationMakeOutInvoice.AccumulatedPrepaidTaxBase']) {
    myvm.data['ApplicationMakeOutInvoice.AccumulatedPrepaidTaxBase'] = parseFloat(myvm.data['ApplicationMakeOutInvoice.AccumulatedPrepaidTaxBase']).toFixed(2); 
  }

  nRContractType = myvm.data['ApplicationMakeOutInvoice.RContractType'];
  if (nRContractType != '' && state === 0) { //如果收入合同编号不能为空 判断 开票类型
    fnClassificatMakeOutInvoice(nRContractType);
  }

  fnPrepaymentSituation();

  fnOverOutputReason();

  fnNoteInvoiceStatus();  //发票备注

  setTimeout(() => {
    if (state === 3) {
      taxNumber();
    }
//     if (WFContext.CurrentActivityName == '提单') {
//       myvm.fieldsDef['ApplicationMakeOutInvoice.TaxAcross']._isRequired = true;
//     }
    let valStatus = myvm.data['ApplicationMakeOutInvoice.WhetherRedTicket'];
    fnTaxAcrossStatus(valStatus);
      
    if(WFContext.CurrentActivityName == '财务管理中心税务主管'){
      myvm.fieldsDef['ApplicationMakeOutInvoice.RedLetterInfoNumber']._isReadOnly = false;
    }
  }, 1000)

  setTimeout(() => {
    fnJuadgeStatus();
    let val = myvm.data['ApplicationMakeOutInvoice.ExpressWay'];
    fnExpressWay(val);
    let type = myvm.data['ApplicationMakeOutInvoice.ClassificationMakeOutInvoice'];
    fnOutInvoiceStatus(type);
  }, 500)
}

function fnJuadgeStatus() {
  let arr = ['财务管理中心税务主管', '税务会计', '建工税务会计', '园林税务会计开票', '幕墙税务会计2'];
  let arrDiv = 'ApplicationMakeOutInvoice';
  if (arr.includes(WFContext.CurrentActivityName)) {
    myvm.fieldsDef['ApplicationMakeOutInvoice.BuyersAddress']._isRequired = false; //购方地址
    myvm.fieldsDef['ApplicationMakeOutInvoice.BuyerAccount']._isRequired = false; //购方账号
    myvm.fieldsDef['ApplicationMakeOutInvoice.BuyerBank']._isRequired = false; //购方开户行
    myvm.fieldsDef['ApplicationMakeOutInvoice.AcquiringPhone']._isRequired = false; //购方电话
    myvm.fieldsDef['ApplicationMakeOutInvoice.Recipient']._isRequired = false; //收件人
    myvm.fieldsDef['ApplicationMakeOutInvoice.RecipientPhone']._isRequired = false; //收件人手机号码
    myvm.fieldsDef['ApplicationMakeOutInvoice.MailingAddress']._isRequired = false; //收件人地址
    myvm.fieldsDef['ApplicationMakeOutInvoice.TaxAcross']._isRequired = false; //跨税报号
  }
}

//如果是提单环节可以编辑
function fnJuadgeStatusEnde(){
    if(WFContext.CurrentActivityName=='提单'){
      myvm.fieldsDef['ApplicationMakeOutInvoice.BuyersAddress']._isReadOnly = false; //购方地址
        myvm.fieldsDef['ApplicationMakeOutInvoice.BuyerAccount']._isReadOnly = false; //购方账号
        myvm.fieldsDef['ApplicationMakeOutInvoice.BuyerBank']._isReadOnly = false; //购方开户行
        myvm.fieldsDef['ApplicationMakeOutInvoice.AcquiringPhone']._isReadOnly = false; //购方电话
        myvm.fieldsDef['ApplicationMakeOutInvoice.Recipient']._isReadOnly = false; //收件人
        myvm.fieldsDef['ApplicationMakeOutInvoice.RecipientPhone']._isReadOnly = false; //收件人手机号码
        myvm.fieldsDef['ApplicationMakeOutInvoice.MailingAddress']._isReadOnly = false; //收件人地址
    //     myvm.fieldsDef['ApplicationMakeOutInvoice.TaxAcross']._isRequired = false; //跨税报号
    }
    
}

function fnOverOutputReason() {
  let nAdvancePayment = myvm.data['ApplicationMakeOutInvoice.AdvancePayment'];
  if (Number(nAdvancePayment) == 1) {
    myvm.fieldsDef['ApplicationMakeOutInvoice.OverOutputReason']._isShowPower = false;
    myvm.fieldsDef['ApplicationMakeOutInvoice.OverOutputReason']._isRequired = false;
  }
}

function fnPrepaymentSituation() {
  let state = WFContext.WorkflowInstinceState;
  let isWhetherRedTicket = myvm.data['ApplicationMakeOutInvoice.WhetherRedTicket'];   //是否红票  1：是  0： 否
  let isWhetherOperatePlace = myvm.data['ApplicationMakeOutInvoice.WhetherOperatePlace'];  //是否异地经营 
  let sClassificationMakeOutInvoice = myvm.data['ApplicationMakeOutInvoice.ClassificationMakeOutInvoice'];  //开票分类

  myvm.fieldsDef['ApplicationMakeOutInvoice.PrepaymentSituation']._isReadOnly = false;
  if (state == 2) {
    myvm.fieldsDef['ApplicationMakeOutInvoice.PrepaymentSituation']._isReadOnly = true; //预缴情况 不可编辑
  }
  if (state == 0 || state == 1 || state == 5) {
    fnPreJuadge();
    myvm.fieldsDef['ApplicationMakeOutInvoice.PrepaymentSituation']._isReadOnly = false; //预缴情况 可编辑
    let status = myvm.data['ApplicationMakeOutInvoice.PrepaymentSituation'];
    if (Number(status) == 2 || Number(status) == 3) {
      myvm.fieldsDef['ApplicationMakeOutInvoice.TaxYaymentVoucherNumber']._isReadOnly = true; //预缴完税凭证号 可编辑
    }
  }
}

function fnPrepaymentStatus() { 
  if (myvm.data['ApplicationMakeOutInvoice.PrepaymentSituation'] == '' || myvm.data['ApplicationMakeOutInvoice.PrepaymentSituation'] == '3') { 
    myvm.fieldsDef['ApplicationMakeOutInvoice.UnpaidInvoicingReason']._isShowPower = false;
  }
}

//通过是否红票 判断 预缴情况控件 和 预缴完税凭证号必填
function fnPreJuadge() {
  let isWhetherRedTicket = myvm.data['ApplicationMakeOutInvoice.WhetherRedTicket'];   //是否红票  1：是  0： 否
  let isWhetherOperatePlace = myvm.data['ApplicationMakeOutInvoice.WhetherOperatePlace'];  //是否异地经营 
  let sClassificationMakeOutInvoice = myvm.data['ApplicationMakeOutInvoice.ClassificationMakeOutInvoice'];  //开票分类
  if (Number(isWhetherRedTicket) == 1) {  //如果红票为是
    myvm.data['ApplicationMakeOutInvoice.PrepaymentSituation'] = '';
    myvm.fieldsDef['ApplicationMakeOutInvoice.PrepaymentSituation']._isReadOnly = true; //预缴情况 不可编辑
    myvm.fieldsDef['ApplicationMakeOutInvoice.PrepaymentSituation']._isRequired = false; //预缴情况 不必填
    myvm.fieldsDef['ApplicationMakeOutInvoice.TaxYaymentVoucherNumber']._isRequired = false;
    setTimeout(() => {
      myvm.fieldsDef['ApplicationMakeOutInvoice.TaxYaymentVoucherNumber']._isReadOnly = true;  //预缴完税凭证号 不可编辑
    }, 500)

  }
  //     if(Number(sClassificationMakeOutInvoice) == 1){  //开票分类为施工
  //       if(Number(isWhetherRedTicket) == 0 || Number(isWhetherOperatePlace) == 1){  //如果红票为否  是否异地经营=是

  //        }
  //       if(Number(isWhetherRedTicket) == 0 || Number(isWhetherOperatePlace) == 0){  //如果红票为否  是否异地经营=否

  //        }
  //     }
  if (Number(isWhetherRedTicket) == 0) {
    myvm.fieldsDef['ApplicationMakeOutInvoice.PrepaymentSituation']._isReadOnly = false; //预缴情况 不可编辑
    myvm.fieldsDef['ApplicationMakeOutInvoice.PrepaymentSituation']._isRequired = false; //预缴情况 不必填
    myvm.fieldsDef['ApplicationMakeOutInvoice.TaxYaymentVoucherNumber']._isRequired = true;  //预缴完税凭证号 必填
  }
}


//如果预缴情况为已缴税 预缴完税凭证号必填
function fnJuadgePrepaymentSituation() {
  let nPrepaymentSituation = myvm.data['ApplicationMakeOutInvoice.PrepaymentSituation']; //获取预缴情况
  myvm.fieldsDef['ApplicationMakeOutInvoice.TaxYaymentVoucherNumber']._isRequired = Number(nPrepaymentSituation) === 1 ? true : false; //预缴完税凭证号是否必填
}

//***************************根据 预缴情况 设置 预缴完税凭证号 字段状态***********************************
function setFildsByState() {
  var state = myvm.data['ApplicationMakeOutInvoice.PrepaymentSituation']; // 预缴情况
  if (state && state === '1') {
    myvm.fieldsDef['ApplicationMakeOutInvoice.TaxYaymentVoucherNumber']._isRequired = true;
    myvm.fieldsDef['ApplicationMakeOutInvoice.TaxYaymentVoucherNumber']._isReadOnly = false;
  } else {
    myvm.fieldsDef['ApplicationMakeOutInvoice.TaxYaymentVoucherNumber']._isRequired = false;
    myvm.fieldsDef['ApplicationMakeOutInvoice.TaxYaymentVoucherNumber']._isReadOnly = true;
  }

}

function getExpectInvoiceApplicationAmount() {
  // 初始化预计申请开票金额(备用)
  var params = {
    myId: myvm.data['ApplicationMakeOutInvoice.MyId'],
    projectId: myvm.data['ApplicationMakeOutInvoice.ProjectId'],
    rContractCode: myvm.data['ApplicationMakeOutInvoice.RContractCode'],
    classificationMakeOutInvoice: myvm.data['ApplicationMakeOutInvoice.ClassificationMakeOutInvoice'],
  }
  if (!params.projectId || !params.rContractCode || !params.classificationMakeOutInvoice) return
  $.extendAjax(`/applicationmakeoutinvoice/getExpectInvoiceApplicationAmount`, JSON.stringify(params), "post", function (d) {
    if (d.code == 200) {
      let nMoney = d.data.money || '0.00';
      let fieldDecimalLen = myvm.fieldsDef['ApplicationMakeOutInvoice.ExpectInvoiceApplicationAmount'].fieldDecimalLen;
      let nCurVal = (nMoney).toString() ? Object.tofixed(nMoney, fieldDecimalLen) : Object.tofixed(0, fieldDecimalLen);  //设置
      myvm.data['ApplicationMakeOutInvoice.ExpectInvoiceApplicationAmount'] = nCurVal;
    }
  })
}

//开票分类点击的时候
function ApplicationMakeOutInvoice_ClassificationMakeOutInvoice(value, field, parms) {
  //开票分类 prepaymentSituation
  console.log("开票分类：", value);
  var state = WFContext.WorkflowInstinceState;
  if(value){
     prepaymentSituation();
     fnClassificationMakeOutInvoice(value);
     if (state === 3) {
      taxNumber();
    }
  }
}

//开票分类点击时
function fnClassificationMakeOutInvoice(value){
    myvm.data['ApplicationMakeOutInvoice.TaxRate'] = '';
    myvm.data['ApplicationMakeOutInvoice.TaxRateId'] = '';
    getAccumulatedInvoicedAmount()
    fnNoteInvoiceStatus();  //开票备注
    $.extendAjax(`/applicationmakeoutinvoice/getTax?billId=${myvm.data['ApplicationMakeOutInvoice.IncomeContractId']}&taxType=${value}`, '', "get", function (d) {
      if (d.data) {
        myvm.data['ApplicationMakeOutInvoice.TaxRate'] = d.data.TaxRate
        if (d.data.ContractSignTaxAmount != null && d.data.ContractSignTaxAmount != '') {
          myvm.data['ApplicationMakeOutInvoice.PayableAmountTax'] = ''
          myvm.data['ApplicationMakeOutInvoice.PayableAmountTax'] = d.data.ContractSignTaxAmount
        }
      }
    });
    var id = myvm.data['ApplicationMakeOutInvoice.IncomeContractId']; // 收入合同ID
    if (id) {
      $.extendAjax(
        `/takeAContract/queryTakeaAndOtherContractByMyID?myId=${id}`,
        '',
        'get',
        function (d) {
          if (d && d.data) {
            let takeaAndOtherContract = d.data
            switch (value) {
              case 1:
                //税率
                myvm.data['ApplicationMakeOutInvoice.TaxRate'] = takeaAndOtherContract.constructionRate === null ? '' : takeaAndOtherContract.constructionRate;
                myvm.data['ApplicationMakeOutInvoice.TaxRateId'] = takeaAndOtherContract.constructionRateId === null ? '' : takeaAndOtherContract.constructionRateId;
                break
              case 2:
                //设计税率
                myvm.data['ApplicationMakeOutInvoice.TaxRate'] = takeaAndOtherContract.designTaxRate === null ? '' : takeaAndOtherContract.designTaxRate;
                myvm.data['ApplicationMakeOutInvoice.TaxRateId'] = takeaAndOtherContract.designTaxRateId === null ? '' : takeaAndOtherContract.designTaxRateId;
                break
              case 3:
                myvm.data['ApplicationMakeOutInvoice.TaxRate'] = takeaAndOtherContract.salesTaxRate === null ? '' : takeaAndOtherContract.salesTaxRate;
                myvm.data['ApplicationMakeOutInvoice.TaxRateId'] = takeaAndOtherContract.salesTaxRateId === null ? '' : takeaAndOtherContract.salesTaxRateId;
                break
              case 4:
                myvm.data['ApplicationMakeOutInvoice.TaxRate'] = takeaAndOtherContract.otherTax === null ? '' : takeaAndOtherContract.otherTax;
                myvm.data['ApplicationMakeOutInvoice.TaxRateId'] = takeaAndOtherContract.otherTaxId === null ? '' : takeaAndOtherContract.otherTaxId;
                break
            }
          }
        }
      )
    }
    //可申请开票金额
    getRoadworkAmount();
    // 初始化预计申请开票金额(备用)
    getExpectInvoiceApplicationAmount()
}

//项目编号超链接

function jumpProjectId() {
  var id = myvm.data['ApplicationMakeOutInvoice.ProjectId']
  if (!id) {
    FUI.Window.showMsg2('请选择需要跳转的项目编号')
  } else {
    Object.siteLink(myvm, 'ct_bpm_ProjectFiles', id)

  }
}
//合同编号超链接

function jumpContarct() {
  var id = myvm.data['ApplicationMakeOutInvoice.IncomeContractId']
  var tableName = ''
  console.log(myvm.data['ApplicationMakeOutInvoice.TypeDocument'])
  if (myvm.data['ApplicationMakeOutInvoice.TypeDocument'] == 2) {
    tableName = 'ct_bpm_OtherRevenueContract'
  } else if (myvm.data['ApplicationMakeOutInvoice.TypeDocument'] == 1 || myvm.data['ApplicationMakeOutInvoice.TypeDocument'].includes('1') === true) {
    tableName = 'ct_bpm_TakeAContract'

  } else if (myvm.data['ApplicationMakeOutInvoice.TypeDocument'] == 4) {
    tableName = 'ct_bpm_OtherRevenueContract'

  }
  if (!id) {
    FUI.Window.showMsg('请选择需要跳转的合同编号')
  } else {
    Object.siteLink(myvm, tableName, id)

  }
}

//产值上报链接
function jumpCumulativeReportedTax() {
  let sProjectNo = myvm.data['ApplicationMakeOutInvoice.ProjectNo']; //项目编号
  if (sProjectNo) {
    localStorage.setItem("ProjectNo", sProjectNo); //缓存项目编号
  }
  var url = `/workflow/security/customDataGrid/customDataGridView/?code=custGrid_WorkflowForm_BPM_ChanXianTianBao&appId=CA`;
  window.open(url);
}
//蓝字发票超链接

function jumpCorrespondBlueInvoiceNumber() {
  var id = myvm.data['ApplicationMakeOutInvoice.CorrespondBlueInvoiceId']
  if (!id) {
    FUI.Window.showMsg('请先选择需要跳转的蓝字发票号码')
  } else {
    Object.siteLink(myvm, 'ct_bpm_makeoutinvoice', id)
  }
}
//预缴完税凭证超链接

function handelTaxYamentLink() {
  var ids = myvm.data['ApplicationMakeOutInvoice.TaxYaymentVoucherNumberId'];
  if (!ids) {
    FUI.Window.showMsg('请先选择需要跳转的预缴完税凭证')
  } else if (ids.indexOf(",") !== -1) {
    var array = ids.split(',');
    array.forEach((item) => {
      setTimeout(function () {
        Object.siteLink(myvm, 'ct_bpm_taxpaymentvoucheradvance', item)
      }, 1000)
    });
  } else {
    Object.siteWiidLink(myvm, 'ct_bpm_taxpaymentvoucheradvance', ids)
  }
}

function ApplicationMakeOutInvoice_RContractCode_after(that, bindFieldData) {
  //收入合同编号
  console.log("收入合同编号that===:", that, bindFieldData);
  console.log("收入合同编号bindFieldData===:", bindFieldData['ApplicationMakeOutInvoice.RContractType']);
  setTimeout(function () {
    //         fn();
    let type = bindFieldData['ApplicationMakeOutInvoice.RContractType'];
    fnOutInvoiceStatus(type);
    
    //发票备注 
    fnNoteInvoiceStatus();
    //         fnPrepaymentSituation();
    fun1();
    isAdvancePayment();
    getAccumulatedInvoicedAmount();
    getAccumulatedPrepaidTaxBase();
    prepaymentSituation();
    getExpectInvoiceApplicationAmount()
    fnOverOutputReason();
  }, 500)

  setTimeout(() => {
    getRoadworkAmount();
  }, 1000)
}

function fun1() {

  if (myvm.data['ApplicationMakeOutInvoice.TypeDocument'] == '2') {
    myvm.data['ApplicationMakeOutInvoice.ClassificationMakeOutInvoice'] = '2'
  } else if (myvm.data['ApplicationMakeOutInvoice.TypeDocument'] == '1') {
    // var a = JSON.parse(myvm.data['ApplicationMakeOutInvoice.ClassificationMakeOutInvoice']).toString()
    myvm.data['ApplicationMakeOutInvoice.ClassificationMakeOutInvoice'] = '1'
  }
  var id = myvm.data['ApplicationMakeOutInvoice.RContractCode']
  var id2 = myvm.data['ApplicationMakeOutInvoice.ProjectId']
  var typeDocument = myvm.data['ApplicationMakeOutInvoice.TypeDocument']; //单据类型
  var type = ''
  if (typeDocument == 1 || typeDocument == '1') {
    type = 1
  } else if (typeDocument == 2 || typeDocument == '2') {
    type = 2
  } else if (typeDocument == 4 || typeDocument == '4') {
    type = 4
  }

  fnPrepaymentSituation();

  var data = {
    projectId: id2,
    typeDocument: type,
    rContractCode: id,
    myId: myvm.data['ApplicationMakeOutInvoice.MyId'],
    apiModelProperty: myvm.data['ApplicationMakeOutInvoice.ClassificationMakeOutInvoice'],
    classificationMakeOutInvoice: myvm.data['ApplicationMakeOutInvoice.ClassificationMakeOutInvoice'],
  }
  //         console.log("可申请开票金额===：", d)
  //         if (d.data) {
  //             var a = d.data.money || '';
  //             myvm.data['ApplicationMakeOutInvoice.PayableAmountTax'] = a
  //         }
  //     });

  if (myvm.data['ApplicationMakeOutInvoice.ProjectNo'].includes('PM') === true) {
    myvm.data['ApplicationMakeOutInvoice.ClassificationMakeOutInvoice'] = '2'
  }
  let incomeContractId = myvm.data['ApplicationMakeOutInvoice.IncomeContractId'];
  let taxType = myvm.data['ApplicationMakeOutInvoice.ClassificationMakeOutInvoice']

  if (incomeContractId && taxType) {
    $.extendAjax(`/applicationmakeoutinvoice/getTax?billId=${incomeContractId}&taxType=${taxType}`, '', "get", function (d) {
      if (d.data) {
        myvm.data['ApplicationMakeOutInvoice.TaxRate'] = d.data.TaxRate
        if (d.data.ContractSignTaxAmount != null && d.data.ContractSignTaxAmount != '') {
          myvm.data['ApplicationMakeOutInvoice.PayableAmountTax'] = ''
          myvm.data['ApplicationMakeOutInvoice.PayableAmountTax'] = d.data.ContractSignTaxAmount
        }
      }
    });
  }
  $.extendAjax(`/applicationmakeoutinvoice/queryCustomerInfo?rContractCode=${id}&typeDocument=${type}`, '', "get", function (d) {
    if (d.data) {
      var res = d.data
      myvm.data['ApplicationMakeOutInvoice.Seller'] = res.seller
      myvm.data['ApplicationMakeOutInvoice.TaxIdentificationNumberSeller'] = res.taxIdentificationNumberSeller
      myvm.data['ApplicationMakeOutInvoice.AddressSeller'] = res.addressSeller
      myvm.data['ApplicationMakeOutInvoice.SellerTelephoneNumber'] = res.sellerTelephoneNumber || '';
      myvm.data['ApplicationMakeOutInvoice.SellerOpenAccountBank'] = res.invoicingBank
      myvm.data['ApplicationMakeOutInvoice.SellerAccountNumber'] = res.billingBankAccountNumber
      myvm.data['ApplicationMakeOutInvoice.BuySquare'] = res.buySquare
      myvm.data['ApplicationMakeOutInvoice.BuyerTaxIdentificationNumber'] = res.buyerTaxIdentificationNumber
      myvm.data['ApplicationMakeOutInvoice.BuyersAddress'] = res.buyersAddress
      myvm.data['ApplicationMakeOutInvoice.AcquiringPhone'] = res.acquiringPhone
      myvm.data['ApplicationMakeOutInvoice.BuyerBank'] = res.lssuingBank
      myvm.data['ApplicationMakeOutInvoice.BuyerAccount'] = res.billingBankAccountNo
      myvm.data['ApplicationMakeOutInvoice.SellerOpenAccountBank'] = res.invoicingBank
      fnJuadgeStatusEnde();
    }
  });

  //发票备注
  fnNoteInvoiceStatus();
  if (myvm.data['ApplicationMakeOutInvoice.WhetherRedTicket'] == '0' && myvm.data['ApplicationMakeOutInvoice.DifferentPlaces'] == '1') {
    myvm.fieldsDef['ApplicationMakeOutInvoice.TaxAcross']._isRequired = true
  } else {
    myvm.fieldsDef['ApplicationMakeOutInvoice.TaxAcross']._isRequired = false
  }
  $.extendAjax(`/applicationmakeoutinvoice/queryCustomer?billId=${myvm.data['ApplicationMakeOutInvoice.IncomeContractId']}`, '', "get", function (d) {
    queryCustomerList(d.data);
  });
}

function queryCustomerList(cArray) {
  let customerArray = cArray && cArray.length > 0 ? cArray.map(item => ({
    text: item.customer,
    value: item.customerId
  })) : [];
  window["ApplicationMakeOutInvoice.BuySquare_vm"].data = [...customerArray];
}

function ApplicationMakeOutInvoice_ExpressWay(value, field, parms) {
  //快递方式
  console.info("快递方式:", value);
  if (value) {
    setMailingAddress();
  }
  fnExpressWay(value)
}

//快递方式
function fnExpressWay(value) {
  if (Number(value) === 3) {
    myvm.data['ApplicationMakeOutInvoice.Recipient'] = ''; //收件人
    myvm.data['ApplicationMakeOutInvoice.RecipientPhone'] = '';  //收件人手机号码
    myvm.data['ApplicationMakeOutInvoice.MailingAddress'] = '';  //收件人地址
  }
}

function extend_sendWorkflowForm_before() {
  //提交时前置事件  务必要有返回值true/false; 返回false：校验不通过， 返回true校验通过继续执行
  var isOk = false
  var invoiceApplicationAmountTax = Number(myvm.data['ApplicationMakeOutInvoice.InvoiceApplicationAmountTax']); // 开票申请金额(含税)(元)
  var payableAmountTax = Number(myvm.data['ApplicationMakeOutInvoice.PayableAmountTax']) // 可申请开票金额(含税)(元)
  var wholeOrderDiscountAmount = Number(myvm.data['ApplicationMakeOutInvoice.WholeOrderDiscountAmount']); // 整单折扣金额(含税)
  var wholeOrderDiscountRate = myvm.data['ApplicationMakeOutInvoice.WholeOrderDiscountRate']; // 整单折扣率
  var state = WFContext.WorkflowInstinceState;
  var grossGroundMark = myvm.data['ApplicationMakeOutInvoice.CrossGroundMark']; // 是否跨地
  myvm.data['ApplicationMakeOutInvoice.CrossGroundMark'] = grossGroundMark === null ? '' : grossGroundMark === 'null' ? '' : grossGroundMark;
  if (typeof (invoiceApplicationAmountTax) != 'undefined' && typeof (payableAmountTax) != 'undefined' && state != 2) {
    if (invoiceApplicationAmountTax > payableAmountTax) {
      FUI.Window.showMsg('开票申请金额(含税)(元)需小于等于可申请开票金额(含税)(元)')
      return isOk
    }
  }
  //      if(!wholeOrderDiscountAmount && !wholeOrderDiscountRate){
  //       	FUI.Window.showMsg('整单折扣率与 整单折扣金额(含税)至少有一个不为空！')
  //         return isOk
  //      }
  if (invoiceApplicationAmountTax && wholeOrderDiscountAmount) {
    if (wholeOrderDiscountAmount > invoiceApplicationAmountTax) {
      FUI.Window.showMsg('整单折扣金额(含税)不能 大于 开票申请金额(含税)(元)！');
      return isOk
    }
  }
  if (wholeOrderDiscountRate) {
    if (Number(wholeOrderDiscountRate) < 0 || Number(wholeOrderDiscountRate) > 1) {
      FUI.Window.showMsg('整单折扣率需要在【0%-100%】闭区间之间！');
      return false
    }
  }
  var arr = FUI.F2Grid.getSubData('InvoiceApplicationDetails', true)
  var numList = []
  var numList2 = []
  if (arr) {
    for (var j = 0; j <= arr.length; j++) {
      var a1 = arr[j] && arr[j].map((i) => i);
      if (a1) {

        var unit = a1.find(x => x.name === "Unit");
        var num = a1.find(x => x.name === "Num");
        var money = a1.find(x => x.name === "Money");
        var tax = a1.find(x => x.name === "TaxRate").value;
        if (unit.value && !num.value) {
          numList.push(true)
        }
        if (!unit.value && num.value) {
          numList.push(true)
        }
        if (!money.value) {
          numList2.push(true)
        }
        if (+tax !== +myvm.data['ApplicationMakeOutInvoice.TaxRate']) {
          FUI.Window.showMsg('开票明细税率必须等于主表税率！');
          return isOk
        }
      }
    }

  }
  //     if (numList.length > 0) {
  //         FUI.Window.showMsg('开票明细单位或数量其中一个有值时,另外一个也要有值！');
  //         return isOk
  //     }
  if (numList2.length > 0) {
    FUI.Window.showMsg('开票明细-金额(含税)不能为空');
    return isOk
  }
  if (myvm.data['ApplicationMakeOutInvoice.WhetherOperatePlace'] == 1 && myvm.data['ApplicationMakeOutInvoice.ClassificationMakeOutInvoice'] == 1) { //是否异地经营为是 开票分类为施工 
    if (myvm.data['ApplicationMakeOutInvoice.PrepaymentSituation'] == 3 || myvm.data['ApplicationMakeOutInvoice.PrepaymentSituation'] == '' || myvm.data['ApplicationMakeOutInvoice.PrepaymentSituation'] == null) { //无需预缴
      FUI.Window.showMsg('开票分类=施工且是否异地经营=是,只能选择已预缴或者未预缴');
      return isOk

    }


  }
  //     isAdvancePayment();  
  setFildsByApplyInfo();
  if (setPriceNumByRedInvoice() === false) {
    return false
  }
  // 校验超产值开票原因 
  if (setOverOutputReasonFild() === false) {
    return false
  }

  //  开票申请金额含税 赋值 剩余可开票金额（含税）
  myData.setData('ApplicationMakeOutInvoice.RemainingInvoicAmountTax', myvm.data['ApplicationMakeOutInvoice.InvoiceApplicationAmountTax'])

  // 校验 开票申请的开票申请金额(含税)(元) =预计申请开票金额(含税)
  if (myvm.data['ApplicationMakeOutInvoice.ExpectApplyInvoicingAmountTax'] && parseFloat(myvm.data['ApplicationMakeOutInvoice.RemainingInvoicAmountTax']) !=
    parseFloat(myvm.data['ApplicationMakeOutInvoice.ExpectApplyInvoicingAmountTax'])) {
    FUI.Window.showMsg('当前开票申请的开票申请金额(含税)(元)≠预计申请开票金额(含税)');
    return false
  }
  // 预计申请开票金额(含税),预计申请开票金额(备用) 等于空的时候不让提交
  //     if (!myvm.data['ApplicationMakeOutInvoice.ExpectApplyInvoicingAmountTax'] && !myvm.data['ApplicationMakeOutInvoice.ExpectInvoiceApplicationAmount']) {
  //         FUI.Window.showMsg('当前开票申请的开票申请金额(含税)(元) ≤预计申请开票金额(备用)');
  //         return false
  //     }
  // 预计申请开票金额(含税)有值时不校验，否则校验：当前开票申请的开票申请金额(含税)(元) ≤预计申请开票金额(备用)
  //     if (!myvm.data['ApplicationMakeOutInvoice.ExpectApplyInvoicingAmountTax'] && myvm.data['ApplicationMakeOutInvoice.ExpectInvoiceApplicationAmount'] != '' && parseFloat(myvm.data['ApplicationMakeOutInvoice.RemainingInvoicAmountTax']) > parseFloat(myvm.data['ApplicationMakeOutInvoice.ExpectInvoiceApplicationAmount'])) {
  //         FUI.Window.showMsg('当前开票申请的开票申请金额(含税)(元) ≤预计申请开票金额(备用)');
  //         return false
  //     }

}


function ApplicationMakeOutInvoice_ProjectNo_after(that, bindFieldData) {
  //项目编号
  fn();
  //     if (myvm.data['ApplicationMakeOutInvoice.ClassificationMakeOutInvoice'] == 1 || myvm.data['ApplicationMakeOutInvoice.ClassificationMakeOutInvoice'] == 2) {
  //         myvm.fieldsDef['ApplicationMakeOutInvoice.AdvancePayment']._isShowPower = true
  //         myvm.fieldsDef['ApplicationMakeOutInvoice.AdvancePayment']._isRequired = true
  //     } else {
  //         myvm.fieldsDef['ApplicationMakeOutInvoice.AdvancePayment']._isShowPower = false
  //         myvm.fieldsDef['ApplicationMakeOutInvoice.AdvancePayment']._isRequired = false
  //     }
  isAdvancePayment()
  getAccumulatedInvoicedAmount()
  getAccumulatedPrepaidTaxBase()
  getRoadworkAmount();
  prepaymentSituation();
  // 预计申请开票金额(备用)
  getExpectInvoiceApplicationAmount()

  fnOverOutputReason();
}

function fn() {

  var id = myvm.data['ApplicationMakeOutInvoice.ProjectId']
  $.extendAjax(`/applicationmakeoutinvoice/queryCumulativeReport?projectId=${id}`, '', "get", function (d) {
    console.log(d)
    myvm.data['ApplicationMakeOutInvoice.CumulativeReportedTax'] = d.data
  });
  if (myvm.data['ApplicationMakeOutInvoice.WhetherRedTicket'] == '0' && myvm.data['ApplicationMakeOutInvoice.WhetherOperatePlace'] == '1') {
    myvm.fieldsDef['ApplicationMakeOutInvoice.TaxAcross']._isRequired = true
  } else {
    myvm.fieldsDef['ApplicationMakeOutInvoice.TaxAcross']._isRequired = false
  }
  var id = myvm.data['ApplicationMakeOutInvoice.ProjectId']
  $.extendAjax(`/applicationmakeoutinvoice/queryContractByProjectId?projectId=${id}`, '', "get", function (d) {
    if (d.data) {

      var res = d.data
      myvm.data['ApplicationMakeOutInvoice.RContractCode'] = res.vbillCode;
      myvm.data['ApplicationMakeOutInvoice.IncomeContractId'] = res.myId;
      myvm.data['ApplicationMakeOutInvoice.TypeDocument'] = res.contractType;
      nRContractType = res.contractType;
      myvm.data['ApplicationMakeOutInvoice.RContractName'] = res.contract;
      var type = JSON.parse(res.contractType).toString();
      fnOutInvoiceStatus(type);
      fnNoteInvoiceStatus();  //发票备注必填
      if (res.vbillCode) {
        var id = myvm.data['ApplicationMakeOutInvoice.RContractCode']
        var id2 = myvm.data['ApplicationMakeOutInvoice.ProjectId']
        var typeDocument = myvm.data['ApplicationMakeOutInvoice.TypeDocument']
        var data = {
          projectId: id2,
          typeDocument: type,
          rContractCode: id,
          myId: myvm.data['ApplicationMakeOutInvoice.MyId'],
          classificationMakeOutInvoice: myvm.data['ApplicationMakeOutInvoice.ClassificationMakeOutInvoice'],
          apiModelProperty: myvm.data['ApplicationMakeOutInvoice.ClassificationMakeOutInvoice']
        }
        if (data.classificationMakeOutInvoice && data.projectId && data.rContractCode && data.typeDocument) {
          $.extendAjax(`/applicationmakeoutinvoice/queryRoadworkAmount`, JSON.stringify(data), "post", function (d) {
            console.log(d)
            if (d.data) {
              var a = d.data.money || '';
              myvm.data['ApplicationMakeOutInvoice.PayableAmountTax'] = a
            }
          });
        }

        $.extendAjax(`/applicationmakeoutinvoice/queryCustomerInfo?rContractCode=${id}&typeDocument=${type}`, '', "get", function (d) {
          if (d.data) {
            var res = d.data
            myvm.data['ApplicationMakeOutInvoice.Seller'] = res.seller
            myvm.data['ApplicationMakeOutInvoice.TaxIdentificationNumberSeller'] = res.taxIdentificationNumberSeller
            myvm.data['ApplicationMakeOutInvoice.AddressSeller'] = res.addressSeller
            myvm.data['ApplicationMakeOutInvoice.SellerTelephoneNumber'] = res.sellerTelephoneNumber || '';
            myvm.data['ApplicationMakeOutInvoice.SellerOpenAccountBank'] = res.invoicingBank
            myvm.data['ApplicationMakeOutInvoice.SellerAccountNumber'] = res.billingBankAccountNumber
            myvm.data['ApplicationMakeOutInvoice.BuySquare'] = res.buySquare
            myvm.data['ApplicationMakeOutInvoice.BuyerTaxIdentificationNumber'] = res.buyerTaxIdentificationNumber
            myvm.data['ApplicationMakeOutInvoice.BuyersAddress'] = res.buyersAddress
            myvm.data['ApplicationMakeOutInvoice.AcquiringPhone'] = res.acquiringPhone
            myvm.data['ApplicationMakeOutInvoice.BuyerBank'] = res.lssuingBank
            myvm.data['ApplicationMakeOutInvoice.BuyerAccount'] = res.billingBankAccountNo
            myvm.data['ApplicationMakeOutInvoice.SellerOpenAccountBank'] = res.invoicingBank
            fnJuadgeStatusEnde();
          }

        });
        $.extendAjax(`/applicationmakeoutinvoice/queryCustomer?billId=${myvm.data['ApplicationMakeOutInvoice.IncomeContractId']}`, '', "get", function (d) {
          let cArray = d.data;
          queryCustomerList(cArray);
        });
      }
    }
  })
  $.extendAjax(`/applicationmakeoutinvoice/getTax?billId=${myvm.data['ApplicationMakeOutInvoice.IncomeContractId']}&taxType=${myvm.data['ApplicationMakeOutInvoice.ClassificationMakeOutInvoice']}`, '', "get", function (d) {
    if (d.data) {
      myvm.data['ApplicationMakeOutInvoice.TaxRate'] = d.data.TaxRate
      if (d.data.ContractSignTaxAmount != null && d.data.ContractSignTaxAmount != '') {
        myvm.data['ApplicationMakeOutInvoice.PayableAmountTax'] = ''
        myvm.data['ApplicationMakeOutInvoice.PayableAmountTax'] = d.data.ContractSignTaxAmount
      }
    }
  });

  setTimeout(() => {
    fnPrepaymentSituation();
  }, 500)

}

function fnOutInvoiceStatus(type) { 
  if (Number(type) == 2) {
    myvm.data['ApplicationMakeOutInvoice.ClassificationMakeOutInvoice'] = '2'; //开票类型
    myvm.fieldsDef['ApplicationMakeOutInvoice.ClassificationMakeOutInvoice']._isReadOnly = true;
  } else if (Number(type) == 1) {
    myvm.data['ApplicationMakeOutInvoice.ClassificationMakeOutInvoice'] = '1';
    myvm.fieldsDef['ApplicationMakeOutInvoice.ClassificationMakeOutInvoice']._isReadOnly = false;
  } else {
    myvm.fieldsDef['ApplicationMakeOutInvoice.ClassificationMakeOutInvoice']._isReadOnly = false;
  }
}

function ApplicationMakeOutInvoice_CorrespondBlueInvoiceNumber(value, field, parms) {
  //对应蓝字发票号码
  console.info(value);
  if (value && myvm.data['ApplicationMakeOutInvoice.WhetherRedTicket'] == 1) {
    setTimeout(function () {
      var id = myvm.data['ApplicationMakeOutInvoice.ProjectId']
      var correspondBlueInvoiceNumber = myvm.data['ApplicationMakeOutInvoice.CorrespondBlueInvoiceNumber']
      $.extendAjax(`/applicationmakeoutinvoice/queryBlueCrossTaxNum?projectId=${id}&correspondBlueInvoiceNumber=${correspondBlueInvoiceNumber}`, '', "get", function (d) {
        if (d.data) {
          var res = d.data
          myvm.data['ApplicationMakeOutInvoice.TaxAcross'] = res.taxAcross;
          myvm.data['ApplicationMakeOutInvoice.TaxYaymentVoucherNumber'] = res.taxYaymentVoucherNumber;
        }
      });
      $.extendAjax(`/applicationmakeoutinvoice/queryChildData?correspondBlueInvoiceNumber=${correspondBlueInvoiceNumber}`, '', "get", function (d) {
        if (d) {
          var arr = d.data
          var rowDatas = [];
          var vm = window["InvoiceApplicationDetails_vm"];
          FUI.F2Grid.delAllRow(vm, false);

          var type = myvm.data['ApplicationMakeOutInvoice.WhetherRedTicket']; // 是否红票
          // myvm.data['subtable.InvoiceApplicationDetails'].splice(0, myvm.data['subtable.InvoiceApplicationDetails'].length);
          for (var i = 0; i < arr.length; i++) {

            arr[i].num = type === '1' ? (0 - Number(arr[i].num)) : arr[i].num; //数量
            arr[i].money = type === '1' ? (0 - Number(arr[i].money)) : arr[i].money;
            arr[i].tax = type === '1' ? (0 - Number(arr[i].tax)) : arr[i].tax;
            arr[i].noTaxMoney = type === '1' ? (0 - Number(arr[i].noTaxMoney)) : arr[i].noTaxMoney;
            if (arr[i]) {
              var result = Object.keys(arr[i]).map((el) => {
                return {
                  "name": firstToUpper(el),
                  "value": arr[i][el] === null ? '' : arr[i][el]
                }
              })
              rowDatas.push(result);
            }

          }

          console.log(rowDatas)
          FUI.F2Grid.addRowData('InvoiceApplicationDetails', 'ApplicationMakeOutInvoice', rowDatas, true);
        }
      });
    }, 500)
  }
}

function ApplicationMakeOutInvoice_BuySquare(value, field, parms) {
  //购方
  console.info(value);
  if (value) {
    $.extendAjax(`/applicationmakeoutinvoice/queryBuySquareByName?name=${value}`, '', "get", function (d) {
      if (d.data) {
        var res = d.data
        myvm.data['ApplicationMakeOutInvoice.BuyerTaxIdentificationNumber'] = res.buyerTaxIdentificationNumber
        myvm.data['ApplicationMakeOutInvoice.BuyersAddress'] = res.buyersAddress
        myvm.data['ApplicationMakeOutInvoice.AcquiringPhone'] = res.acquiringPhone
        myvm.data['ApplicationMakeOutInvoice.BuyerBank'] = res.lssuingBank
        myvm.data['ApplicationMakeOutInvoice.BuyerAccount'] = res.billingBankAccountNo
        fnJuadgeStatusEnde();
      }

    });
  }
}

function ApplicationMakeOutInvoice_Seller(value, field, parms) {
  //销售方
  console.info(value);
  if (value) {
    $.extendAjax(`/applicationmakeoutinvoice/querySellerInfoByName?name=${value}`, '', "get", function (d) {
      if (d.data) {
        var res = d.data;
        myvm.data['ApplicationMakeOutInvoice.TaxIdentificationNumberSeller'] = res.taxIdentificationNumberSeller;
        myvm.data['ApplicationMakeOutInvoice.AddressSeller'] = res.addressSeller;
        myvm.data['ApplicationMakeOutInvoice.SellerTelephoneNumber'] = res.sellerTelephoneNumber || '';
        myvm.data['ApplicationMakeOutInvoice.SellerOpenAccountBank'] = res.invoicingBank;
        myvm.data['ApplicationMakeOutInvoice.SellerAccountNumber'] = res.billingBankAccountNumber;
        var state = res.baiWangState;
        if (state !== '1') {
          myvm.data['ApplicationMakeOutInvoice.BaiWangTicket'] = '1';
          myvm.fieldsDef['ApplicationMakeOutInvoice.BaiWangTicket']._isReadOnly = true;
        } else {
          myvm.data['ApplicationMakeOutInvoice.BaiWangTicket'] = '';
          // myvm.fieldsDef['ApplicationMakeOutInvoice.BaiWangTicket']._isReadOnly = false;
        }
      } else {
        myvm.data['ApplicationMakeOutInvoice.BaiWangTicket'] = '1';
        myvm.fieldsDef['ApplicationMakeOutInvoice.BaiWangTicket']._isReadOnly = true;
      }

    });
  }
}


// 首字母大写
function firstToUpper(str) {
  const characters = [...str];
  characters[0] = characters[0].toUpperCase();
  str = characters.join("");
  return str;
}

function ApplicationMakeOutInvoice_WhetherRedTicket(value, field, parms) {
  //是否红票 
  fnTaxAcrossStatus(value);
  fnPreJuadge();
}

//通过是否红票判断税跨保号
function fnTaxAcrossStatus(value){
   if (value) {
    if (myvm.data['ApplicationMakeOutInvoice.WhetherRedTicket'] == '0' && myvm.data['ApplicationMakeOutInvoice.WhetherOperatePlace'] == '1') {
      myvm.fieldsDef['ApplicationMakeOutInvoice.TaxAcross']._isRequired = true
    } else {
      myvm.fieldsDef['ApplicationMakeOutInvoice.TaxAcross']._isRequired = false
    }
  }
}

function ApplicationMakeOutInvoice_InvoiceApplicationDetails_Num(value, field, parms) {
  //数量
  var data = parms.row
  var sumAmount = +data['ApplicationMakeOutInvoice.InvoiceApplicationDetails.TaxUnitPrice'] * +(data['ApplicationMakeOutInvoice.InvoiceApplicationDetails.Num'])
  data['ApplicationMakeOutInvoice.InvoiceApplicationDetails.Money'] = Object.toDecimal(sumAmount, 2)
  if (data['ApplicationMakeOutInvoice.InvoiceApplicationDetails.Money']) {

    var amount = +data['ApplicationMakeOutInvoice.InvoiceApplicationDetails.Money'] / (1 + (Number(data['ApplicationMakeOutInvoice.InvoiceApplicationDetails.TaxRate'])))
    data['ApplicationMakeOutInvoice.InvoiceApplicationDetails.NoTaxMoney'] = Object.toDecimal(amount, 2)
  }
  isAdvancePayment()
}

function ApplicationMakeOutInvoice_InvoiceApplicationDetails_TaxUnitPrice(value, field, parms) {
  //单价（含税）
  var data = parms.row
  var sumAmount = +data['ApplicationMakeOutInvoice.InvoiceApplicationDetails.TaxUnitPrice'] * +(data['ApplicationMakeOutInvoice.InvoiceApplicationDetails.Num'])
  data['ApplicationMakeOutInvoice.InvoiceApplicationDetails.Money'] = Object.toDecimal(sumAmount, 2)
  if (data['ApplicationMakeOutInvoice.InvoiceApplicationDetails.Money']) {
    var amount = +data['ApplicationMakeOutInvoice.InvoiceApplicationDetails.Money'] / (1 + (Number(data['ApplicationMakeOutInvoice.InvoiceApplicationDetails.TaxRate'])))
    data['ApplicationMakeOutInvoice.InvoiceApplicationDetails.NoTaxMoney'] = Object.toDecimal(amount, 2)

  }
  isAdvancePayment()
}



function ApplicationMakeOutInvoice_InvoiceApplicationDetails_Money(value, field, parms) {
  //金额（含税）
  var data = parms.row
  var sumAmount = +data['ApplicationMakeOutInvoice.InvoiceApplicationDetails.Money'] / (1 + (Number(data['ApplicationMakeOutInvoice.InvoiceApplicationDetails.TaxRate'])))
  data['ApplicationMakeOutInvoice.InvoiceApplicationDetails.NoTaxMoney'] = Object.toDecimal(sumAmount, 2)
  isAdvancePayment()

}

// *********************************************导入子表后置事件****************************************************************

function InvoiceApplicationDetails_importAfterEvent(objectData) {
  console.log(objectData, '23333');

  if (objectData.length > 0) {
    //myvm.data['subtable.ExitDeviceInformation'].splice(0, myvm.data['subtable.ExitDeviceInformation'].length);
    var vm = window["InvoiceApplicationDetails_vm"];
    FUI.F2Grid.delAllRow(vm, false);
    var arr = objectData;

    var rowDatas = [];
    for (var i = 0; i < arr.length; i++) {
      if (arr[i]) {
        var result = Object.keys(arr[i]).map((el) => {
          //console.log(arr[i][el])   
          return {
            "name": firstToUpper(arr[i][el].name),
            "value": arr[i][el].value === null ? '' : arr[i][el].value === '0.0000' ? '' : arr[i][el].value === 0 ? '' : arr[i][el].value
          }
        })

        rowDatas.push(result);
      }

    }
    console.log(result, 666)
    result.forEach(item => {

      var obj = {
        name: 'Money',
        value: ''
      }

      //   var taxUnitPrice = item.find(item => item.name == 'TaxUnitPrice').value
      //var num = item.find(item => item.name == 'Num').value
      // console.log(taxUnitPrice,num)
      //obj.value = +(taxUnitPrice) * +(num)
      //item.push(obj)

    })
    for (var j = 0; j < rowDatas.length; j++) {
      if (rowDatas[j]) {
        FUI.F2Grid.addRowData('InvoiceApplicationDetails', 'ApplicationMakeOutInvoice', rowDatas[j], {
          isReadonly: true
        });
      }
    }
  }
}


function ApplicationMakeOutInvoice_InvoiceApplicationDetails_TaxRate(value, field, parms) {
  //税率
  console.log("税率===：", value);
  if (value) {
    let data = parms.row
    //单价 无税
    data['ApplicationMakeOutInvoice.InvoiceApplicationDetails.NoTaxMoney'] = data['ApplicationMakeOutInvoice.InvoiceApplicationDetails.Money'] / (1 + (+value))
    //setTimeout(function(){
    //data['ApplicationMakeOutInvoice.InvoiceApplicationDetails.Tax'] = data['ApplicationMakeOutInvoice.InvoiceApplicationDetails.Money']-(data['ApplicationMakeOutInvoice.InvoiceApplicationDetails.NoTaxMoney'])

    //  },1500)

    //税额 



  }
}

function ApplicationMakeOutInvoice_BuySquare(value, field, parms) {
  //购方
  console.info("购方===：", value);
  let cArray = window["ApplicationMakeOutInvoice.BuySquare_vm"].data;
  if (cArray.length > 0) {
    myvm.data['ApplicationMakeOutInvoice.BuySquareId'] = cArray.find(item => item.value === value).value;
    myvm.data['ApplicationMakeOutInvoice.BuySquare'] = cArray.find(item => item.value === value).text;
  }

}
//******************************* 设置收件人地址状态 ApplicationMakeOutInvoice.MailingAddress***********************************************************

function setMailingAddress() {
  var ways = myvm.data['ApplicationMakeOutInvoice.ExpressWay'];
  if (ways === '1' || ways === '2') {
    //收件地址
    myvm.fieldsDef['ApplicationMakeOutInvoice.MailingAddress']._isReadOnly = false;
    myvm.fieldsDef['ApplicationMakeOutInvoice.MailingAddress']._isRequired = true;
    // 收件人
    myvm.fieldsDef['ApplicationMakeOutInvoice.Recipient']._isReadOnly = false;
    myvm.fieldsDef['ApplicationMakeOutInvoice.Recipient']._isRequired = true;
    // 收件电话
    myvm.fieldsDef['ApplicationMakeOutInvoice.RecipientPhone']._isReadOnly = false;
    myvm.fieldsDef['ApplicationMakeOutInvoice.RecipientPhone']._isRequired = true;
  } else {
    //收件地址
    myvm.fieldsDef['ApplicationMakeOutInvoice.MailingAddress']._isReadOnly = true;
    myvm.fieldsDef['ApplicationMakeOutInvoice.MailingAddress']._isRequired = false;
    // 收件人
    myvm.fieldsDef['ApplicationMakeOutInvoice.Recipient']._isReadOnly = true;
    myvm.fieldsDef['ApplicationMakeOutInvoice.Recipient']._isRequired = false;
    // 收件电话
    myvm.fieldsDef['ApplicationMakeOutInvoice.RecipientPhone']._isReadOnly = true;
    myvm.fieldsDef['ApplicationMakeOutInvoice.RecipientPhone']._isRequired = false;
  }
  if (ways === '4') {
    myvm.fieldsDef['ApplicationMakeOutInvoice.RecipientEmail']._isReadOnly = false;
    myvm.fieldsDef['ApplicationMakeOutInvoice.RecipientEmail']._isRequired = true;
  } else {
    myvm.fieldsDef['ApplicationMakeOutInvoice.RecipientEmail']._isReadOnly = true;
    myvm.fieldsDef['ApplicationMakeOutInvoice.RecipientEmail']._isRequired = false;
  }
}

function ApplicationMakeOutInvoice_WholeOrderDiscountRate(fieldValue) {
  //整单折扣率
  console.info('整单折扣率 == ', fieldValue);
  if (parseFloat(fieldValue)) {
    myvm.data['ApplicationMakeOutInvoice.WholeOrderDiscountAmount'] = '';
    myvm.data['ApplicationMakeOutInvoice.DiscountType'] = '';
    myvm.fieldsDef['ApplicationMakeOutInvoice.WholeOrderDiscountAmount']._isReadOnly = true
    if (Number(fieldValue < 0) || Number(fieldValue > 1)) {
      FUI.Window.showMsg('整单折扣率需要在【0%-100%】闭区间之间！');
      return false
    }
  } else {
    myvm.data['ApplicationMakeOutInvoice.WholeOrderDiscountRate'] = '';
    myvm.data['ApplicationMakeOutInvoice.WholeOrderDiscountAmount'] = '';
    myvm.fieldsDef['ApplicationMakeOutInvoice.WholeOrderDiscountAmount']._isReadOnly = false
  }
}

function ApplicationMakeOutInvoice_WholeOrderDiscountAmount(fieldValue) {
  //整单折扣金额(含税)
  console.info('整单折扣金额 含税== ', fieldValue);
  if (parseFloat(fieldValue)) {
    myvm.data['ApplicationMakeOutInvoice.WholeOrderDiscountRate'] = '';
    myvm.data['ApplicationMakeOutInvoice.DiscountType'] = '';
    myvm.fieldsDef['ApplicationMakeOutInvoice.WholeOrderDiscountRate']._isReadOnly = true;
    var amount = myvm.data['ApplicationMakeOutInvoice.InvoiceApplicationAmountTax'];
    if (Number(fieldValue) < 0) {
      FUI.Window.showMsg('整单折扣金额(含税)不能小于 0 ！');
      return false
    } else if (Number(amount) > 0 && Number(fieldValue) > Number(amount)) {
      FUI.Window.showMsg('整单折扣金额(含税)不能 大于 开票申请金额(含税)(元)！');
      return false
    }
  } else {
    myvm.data['ApplicationMakeOutInvoice.WholeOrderDiscountRate'] = '';
    myvm.data['ApplicationMakeOutInvoice.WholeOrderDiscountAmount'] = '';
    myvm.fieldsDef['ApplicationMakeOutInvoice.WholeOrderDiscountRate']._isReadOnly = false
  }
}
//**************************根据申请明细设置字段的属性、值*******************************************************

function setFildsByApplyInfo() {

  var array = myvm.data['subtable.InvoiceApplicationDetails']; // 申请明细
  var type = myvm.data['ApplicationMakeOutInvoice.InvoiceType']; // 发票类型
  if (array.length > 0) {
    var goodList = [];
    for (var i in array) {
      var num = array[i]['ApplicationMakeOutInvoice.InvoiceApplicationDetails.ClassificationGood'];
      if (num) {
        num = num.slice(0, 3)
        if (num === '305' || num === '612') {
          // CrossGroundMark BuildingServiceTakesPlace BuildingServiceAddress BuildingProjectName
          goodList.push(array[i]['ApplicationMakeOutInvoice.InvoiceApplicationDetails.ClassificationGood'])

        }
      }

    }
    if (goodList.length > 0 && (type === '16' || type === '17')) {
      var arr = [{
        name: 'CrossGroundMark',
        _isRequired: true,
        _isReadOnly: false
      }, {
        name: 'BuildingServiceTakesPlace',
        _isRequired: true,
        _isReadOnly: false
      }, {
        name: 'BuildingServiceAddress',
        _isRequired: true,
        _isReadOnly: false
      }, {
        name: 'BuildingProjectName',
        _isRequired: true,
        _isReadOnly: false
      }]
      myData.setDiffFieldsDefs(arr, 'ApplicationMakeOutInvoice');
      // 赋值、
      if (!myvm.data['ApplicationMakeOutInvoice.CrossGroundMark']) {
        myData.setData('ApplicationMakeOutInvoice.CrossGroundMark', myvm.data['ApplicationMakeOutInvoice.WhetherOperatePlace']) // 是否跨区
      }
      if (!myvm.data['ApplicationMakeOutInvoice.BuildingServiceTakesPlace']) {
        myData.setData('ApplicationMakeOutInvoice.BuildingServiceTakesPlace', myvm.data['ApplicationMakeOutInvoice.ProjectAddress']) // 区域
      }
      if (!myvm.data['ApplicationMakeOutInvoice.BuildingServiceAddress']) {
        myData.setData('ApplicationMakeOutInvoice.BuildingServiceAddress', myvm.data['ApplicationMakeOutInvoice.Address']) // 详细地址
      }
      if (!myvm.data['ApplicationMakeOutInvoice.BuildingProjectName']) {
        myData.setData('ApplicationMakeOutInvoice.BuildingProjectName', myvm.data['ApplicationMakeOutInvoice.ProjectName']) // 名称
      }

    } else {
      var arr = [{
        name: 'CrossGroundMark',
        _isRequired: false,
        _isReadOnly: true
      }, {
        name: 'BuildingServiceTakesPlace',
        _isRequired: false,
        _isReadOnly: true
      }, {
        name: 'BuildingServiceAddress',
        _isRequired: false,
        _isReadOnly: true
      }, {
        name: 'BuildingProjectName',
        _isRequired: false,
        _isReadOnly: true
      }]
      myData.setDiffFieldsDefs(arr, 'ApplicationMakeOutInvoice');
      // 清空
      myvm.data['ApplicationMakeOutInvoice.CrossGroundMark'] = '';
      myvm.data['ApplicationMakeOutInvoice.BuildingServiceTakesPlace'] = '';
      myvm.data['ApplicationMakeOutInvoice.BuildingServiceAddress'] = '';
      myvm.data['ApplicationMakeOutInvoice.BuildingProjectName'] = '';

    }

  } else {
    var arr = [{
      name: 'CrossGroundMark',
      _isRequired: false,
      _isReadOnly: true
    }, {
      name: 'BuildingServiceTakesPlace',
      _isRequired: false,
      _isReadOnly: true
    }, {
      name: 'BuildingServiceAddress',
      _isRequired: false,
      _isReadOnly: true
    }, {
      name: 'BuildingProjectName',
      _isRequired: false,
      _isReadOnly: true
    }]
    myData.setDiffFieldsDefs(arr, 'ApplicationMakeOutInvoice');
    // 清空
    myvm.data['ApplicationMakeOutInvoice.CrossGroundMark'] = '';
    myvm.data['ApplicationMakeOutInvoice.BuildingServiceTakesPlace'] = '';
    myvm.data['ApplicationMakeOutInvoice.BuildingServiceAddress'] = '';
    myvm.data['ApplicationMakeOutInvoice.BuildingProjectName'] = '';
  }

}
// ******************根据节点名称和发票类型判断******************************************************

function setFildsValueByType() {
  var name = myvm.wfContext.CurrentActivityName; // 流程节点名称
  var type = myvm.data['ApplicationMakeOutInvoice.InvoiceType']; // 发票类型
  var isRed = myvm.data['ApplicationMakeOutInvoice.WhetherRedTicket']; // 是否红票
  // 红字信息表编号
  if (isRed === '1' && (name === '财务管理中心税务主管' || name === '建工税务会计' || name === '园林税务会计开票') && (type === '11' || type === '16' || type === '17')) {
    myvm.fieldsDef['ApplicationMakeOutInvoice.RedLetterInfoNumber']._isReadOnly = false;
    myvm.fieldsDef['ApplicationMakeOutInvoice.RedLetterInfoNumber']._isRequired = true;
  } else {
    myvm.fieldsDef['ApplicationMakeOutInvoice.RedLetterInfoNumber']._isReadOnly = true;
    myvm.fieldsDef['ApplicationMakeOutInvoice.RedLetterInfoNumber']._isRequired = false;
  }
  // 红字信息标UUID
  if (isRed === '1' && (name === '财务管理中心税务主管' || name === '建工税务会计' || name === '园林税务会计开票') && (type === '16' || type === '17')) {
    myvm.fieldsDef['ApplicationMakeOutInvoice.RedLetterInfoUUID']._isReadOnly = false;
    myvm.fieldsDef['ApplicationMakeOutInvoice.RedLetterInfoUUID']._isRequired = true;
  } else {
    myvm.fieldsDef['ApplicationMakeOutInvoice.RedLetterInfoUUID']._isReadOnly = true;
    myvm.fieldsDef['ApplicationMakeOutInvoice.RedLetterInfoUUID']._isRequired = false;
  }


}

function ApplicationMakeOutInvoice_InvoiceType(value, field, parms) {
  //发票类型
  console.info(value);
  if (value === '11' || value === '16' || value === '4') {
    myvm.fieldsDef['ApplicationMakeOutInvoice.BuyersAddress']._isRequired = true;
    myvm.fieldsDef['ApplicationMakeOutInvoice.BuyerAccount']._isRequired = true;
    myvm.fieldsDef['ApplicationMakeOutInvoice.AcquiringPhone']._isRequired = true;
    myvm.fieldsDef['ApplicationMakeOutInvoice.BuyerBank']._isRequired = true;
  } else {
    myvm.fieldsDef['ApplicationMakeOutInvoice.BuyersAddress']._isRequired = false;
    myvm.fieldsDef['ApplicationMakeOutInvoice.BuyerAccount']._isRequired = false;
    myvm.fieldsDef['ApplicationMakeOutInvoice.AcquiringPhone']._isRequired = false;
    myvm.fieldsDef['ApplicationMakeOutInvoice.BuyerBank']._isRequired = false;
  }
  setFildsByApplyInfo()
}

function ApplicationMakeOutInvoice_InvoiceApplicationDetails_ClassificationGoodsService(value, field, parms) {
  //商品服务分类
  console.info(value);
  if (value) {
    setTimeout(function () {
      setFildsByApplyInfo();
    }, 500)
  }
}
//************************根据是否红票判断申请明细信息的单价、数量***************************************************

function setPriceNumByRedInvoice() {
  var isOk = false;
  var aa = 0;
  var isRed = myvm.data['ApplicationMakeOutInvoice.WhetherRedTicket']; // 是否红票
  var list = myvm.data['subtable.InvoiceApplicationDetails']; // 申请明细信息
  if (list.length > 0) {
    for (var i in list) {
      var price = list[i]['ApplicationMakeOutInvoice.InvoiceApplicationDetails.TaxUnitPrice']; // 单价(含税)
      var num = list[i]['ApplicationMakeOutInvoice.InvoiceApplicationDetails.Num']; // 数量
      if (num && !price) {
        var oIndex2 = Number(i) + 1;
        FUI.Window.showMsg('申请明细信息第' + oIndex2 + '行中，当数量不为空时，单价(含税)也不能为空！ ');
        aa = 3;
        return false
      }
      //                 if (!num && price) {
      //                     var oIndex2 = Number(i) + 1;
      //                     FUI.Window.showMsg('申请明细信息第' + oIndex2 + '行中，当单价(含税)不为空时，数量也不能为空！ ');
      //                     aa = 4;
      //                     return false
      //                 }
      if (isRed === '1' && price) {
        if (Number(price) < 0) {
          var oIndex = Number(i) + 1;
          aa = 1;
          FUI.Window.showMsg('当是否红票=是 时，申请明细信息中第' + oIndex + '行中，单价(含税)金额需要 > 0 ');
          return false
        }
      }
      if (isRed === '1' && num) {
        if (Number(num) > 0) {
          var oIndex2 = Number(i) + 1;
          aa = 2;
          FUI.Window.showMsg('当是否红票=是 时，申请明细信息中第' + oIndex2 + '行中，数量需要 ≤ 0 ');
          return false
        }
      }

    }
  }
  if (aa > 0) {
    return isOk
  } else {
    return !isOk
  }
}
//********************在审批中状态下，设置字段属性********************************************************************

function setFildByState(val) {
  var isReq = val ? true : false;
  var isRed = val ? false : true;
  var arr = [{
    name: 'InvoiceType', //发票类型
    _isRequired: isReq,
    _isReadOnly: isRed
  }, {
    name: 'Seller', // 销售方
    _isRequired: isReq,
    _isReadOnly: isRed
  }, {
    name: 'TaxIdentificationNumberSeller', // 销售方纳税识别号
    _isRequired: isReq,
    _isReadOnly: isRed
  }, {
    name: 'AddressSeller', // 销售方地址
    _isRequired: isReq,
    _isReadOnly: isRed
  }, {
    name: 'SellerTelephoneNumber', // 销售方电话
    _isRequired: isReq,
    _isReadOnly: isRed
  }, {
    name: 'SellerOpenAccountBank', // 销售方开户行
    _isRequired: isReq,
    _isReadOnly: isRed
  }, {
    name: 'SellerAccountNumber', // 销售方账号
    _isRequired: isReq,
    _isReadOnly: isRed
  }, {
    name: 'BuySquare', // 购方
    _isRequired: isReq,
    _isReadOnly: isRed
  }, {
    name: 'BuyerTaxIdentificationNumber', // 购方纳税识别号
    _isRequired: isReq,
    _isReadOnly: isRed
  }, {
    name: 'BuyersAddress', // 购方地址
    _isRequired: isReq,
    _isReadOnly: isRed
  }, {
    name: 'AcquiringPhone', // 购方电话
    _isRequired: isReq,
    _isReadOnly: isRed
  }, {
    name: 'BuyerBank', // 购方开户行
    _isRequired: isReq,
    _isReadOnly: isRed
  }, {
    name: 'BuyerAccount', // 购方账号
    _isRequired: isReq,
    _isReadOnly: isRed
  }, {
    name: 'Recipient', // 收件人
    _isRequired: isReq,
    _isReadOnly: isRed
  }, {
    name: 'RecipientPhone', // 收件人手机号
    _isRequired: isReq,
    _isReadOnly: isRed
  }, {
    name: 'MailingAddress', // 收件人地址
    _isRequired: isReq,
    _isReadOnly: isRed
  }, {
    name: 'TaxAcross', // 税跨报号
    _isRequired: isReq,
    _isReadOnly: isRed
  }, {
    name: 'TaxYaymentVoucherNumber', // 预缴完税凭证号
    _isRequired: isReq,
    _isReadOnly: isRed
  }, {
    name: 'UnpaidInvoicingReason', // 未预缴开票原因 
    _isRequired: isReq,
    _isReadOnly: isRed
  }];
  myData.setDiffFieldsDefs(arr, 'ApplicationMakeOutInvoice');

  // 申请明细信息（商品服务分类）
  myvm.fieldsDef['subtable.InvoiceApplicationDetails']['ApplicationMakeOutInvoice.InvoiceApplicationDetails.ClassificationGoodsService']._isReadOnly = true

}
//************************ 根据业务单元设置百望开票的字段状态******************************************************

function setFildsBy(value) {

  if (value) {
    $.extendAjax(`/applicationmakeoutinvoice/querySellerInfoByName?name=${value}`, '', "get", function (d) {
      if (d.data) {
        var res = d.data
        var state = res.baiWangState;
        if (state !== '1') {
          myvm.data['ApplicationMakeOutInvoice.BaiWangTicket'] = '1';
          myvm.fieldsDef['ApplicationMakeOutInvoice.BaiWangTicket']._isReadOnly = true;
        }
      } else {
        myvm.data['ApplicationMakeOutInvoice.BaiWangTicket'] = '1';
        myvm.fieldsDef['ApplicationMakeOutInvoice.BaiWangTicket']._isReadOnly = true;
      }

    });
  }
}

//查询是否预付款
function isAdvancePayment() {
  var data = {
    myId: myvm.data['ApplicationMakeOutInvoice.MyId'],
    rContractId: myvm.data['ApplicationMakeOutInvoice.IncomeContractId'],
    contractType: myvm.data['ApplicationMakeOutInvoice.RContractType'] || nRContractType, 
    invoiceApplicationAmountTax: myvm.data['ApplicationMakeOutInvoice.InvoiceApplicationAmountTax'],
  }
  $.extendAjax(`/applicationmakeoutinvoice/checkAdvanceCharge`, JSON.stringify(data), "post", function (d) {
    if (d.data) {
      console.log("checkAdvanceCharge===:", d);
      var num = d.data.advancePayment.toString();
      nPaymentAmount = d.data.paymentAmount; //【审批通过+审批中+当前开票申请】且 是否关闭=否开票申请金额（含税）+ 审核通过 且 是否关闭=是 剩余可开票金额(含税)(元) 累计值
      myvm.data['ApplicationMakeOutInvoice.AdvancePayment'] = num;
      if (num == 1) {
        myvm.fieldsDef['ApplicationMakeOutInvoice.OverOutputReason']._isShowPower = false
        myvm.data['ApplicationMakeOutInvoice.IsOverOutputReason'] = '0'
      } else {
        myvm.fieldsDef['ApplicationMakeOutInvoice.OverOutputReason']._isShowPower = true
        myvm.data['ApplicationMakeOutInvoice.IsOverOutputReason'] = '1'
      }
      var cumulativeReportedTax = myvm.data['ApplicationMakeOutInvoice.CumulativeReportedTax']
      if (+cumulativeReportedTax < +d.data.paymentAmount) {
        myvm.fieldsDef['ApplicationMakeOutInvoice.OverOutputReason']._isShowPower = true
        myvm.fieldsDef['ApplicationMakeOutInvoice.OverOutputReason']._isRequired = true
        myvm.data['ApplicationMakeOutInvoice.IsOverOutputReason'] = '1'
      } else {
        myvm.fieldsDef['ApplicationMakeOutInvoice.OverOutputReason']._isShowPower = false
        myvm.fieldsDef['ApplicationMakeOutInvoice.OverOutputReason']._isRequired = false
        myvm.data['ApplicationMakeOutInvoice.IsOverOutputReason'] = '0'
      }
      setTimeout(() => {
        setFildsByState();
      }, 500)
      fnOverOutputReason();
    }

  });

}


//查询累计已开票金额（含税）
function getAccumulatedInvoicedAmount() {
  var data = {
    projectId: myvm.data['ApplicationMakeOutInvoice.ProjectId'],
    rContractId: myvm.data['ApplicationMakeOutInvoice.IncomeContractId'],
    classificationMakeOutInvoice: myvm.data['ApplicationMakeOutInvoice.ClassificationMakeOutInvoice'],
  }
  $.extendAjax(`/applicationmakeoutinvoice/getAccumulatedInvoicedAmount`, JSON.stringify(data), "post", function (d) {
    if (d.data) {

      let nMoney = d.data.money || '0.00';
      let fieldDecimalLen = myvm.fieldsDef['ApplicationMakeOutInvoice.AccumulatedInvoicedAmount'].fieldDecimalLen;
      let nCurVal = (nMoney).toString() ? Object.tofixed(nMoney, fieldDecimalLen) : Object.tofixed('0', fieldDecimalLen);   //设置
      myvm.data['ApplicationMakeOutInvoice.AccumulatedInvoicedAmount'] = nCurVal;
    }

  });

}



//查询累计已预缴计税基数（元）
function getAccumulatedPrepaidTaxBase() {
  var data = {
    projectId: myvm.data['ApplicationMakeOutInvoice.ProjectId'],
  }
  $.extendAjax(`/applicationmakeoutinvoice/getAccumulatedPrepaidTaxBase`, JSON.stringify(data), "post", function (d) {

    if (d.data) {
      let nMoney = d.data.money || '0.00';
      let fieldDecimalLen = myvm.fieldsDef['ApplicationMakeOutInvoice.AccumulatedPrepaidTaxBase'].fieldDecimalLen;
      let nCurVal = (nMoney).toString() ? Object.tofixed(nMoney, fieldDecimalLen) : Object.tofixed(0, fieldDecimalLen);  //设置
      myvm.data['ApplicationMakeOutInvoice.AccumulatedPrepaidTaxBase'] = nCurVal; //AccumulatedPrepaidTaxBase  累计已预缴计税基数(元)
    }
  });

}

function ApplicationMakeOutInvoice_WhetherOperatePlace(value, field, parms) {
  //是否异地经营
  console.info('是否异地经营===:', value);
  if (value == 0) {
    myvm.data['ApplicationMakeOutInvoice.PrepaymentSituation'] = '3'
  } else {
    myvm.data['ApplicationMakeOutInvoice.PrepaymentSituation'] = ''
  }
  fnPrepaymentSituation();
}
//查询可申请开票金额

function getRoadworkAmount() {

  var id = myvm.data['ApplicationMakeOutInvoice.RContractCode']
  var id2 = myvm.data['ApplicationMakeOutInvoice.ProjectId']
  var typeDocument = myvm.data['ApplicationMakeOutInvoice.TypeDocument']
  var type = ''
  if (typeDocument == 1 || typeDocument == '1') {
    type = 1
  } else if (typeDocument == 2 || typeDocument == '2') {
    type = 2
  } else if (typeDocument == 4 || typeDocument == '4') {
    type = 4
  }
  var data = {
    projectId: id2,
    typeDocument: type,
    rContractCode: id,
    myId: myvm.data['ApplicationMakeOutInvoice.MyId'],
    classificationMakeOutInvoice: myvm.data['ApplicationMakeOutInvoice.ClassificationMakeOutInvoice'],
    apiModelProperty: myvm.data['ApplicationMakeOutInvoice.ClassificationMakeOutInvoice']
  }
  if (data.typeDocument && data.rContractCode && data.classificationMakeOutInvoice && data.projectId) {
    $.extendAjax(`/applicationmakeoutinvoice/queryRoadworkAmount`, JSON.stringify(data), "post", function (d) {
      console.log("可申请开票金额===:", d)
      if (d.data) {
        var a = d.data.money || '';
        myvm.data['ApplicationMakeOutInvoice.PayableAmountTax'] = a
      }
    });
  }
}

//预缴情况
function prepaymentSituation() {
  if (myvm.data['ApplicationMakeOutInvoice.ClassificationMakeOutInvoice'] == 1 && myvm.data['ApplicationMakeOutInvoice.WhetherOperatePlace'] == 0) {
    myvm.data['ApplicationMakeOutInvoice.PrepaymentSituation'] = '3'
  } else {
    myvm.data['ApplicationMakeOutInvoice.PrepaymentSituation'] = ''
  }


}

//税跨报号
//
function taxNumber() {
  if ((myvm.data['ApplicationMakeOutInvoice.ClassificationMakeOutInvoice'] == 2 || myvm.data['ApplicationMakeOutInvoice.ClassificationMakeOutInvoice'] == 3 ||
    myvm.data['ApplicationMakeOutInvoice.ClassificationMakeOutInvoice'] == 4) && myvm.data['ApplicationMakeOutInvoice.WhetherRedTicket'] == 0) {
    myvm.fieldsDef['ApplicationMakeOutInvoice.TaxAcross']._isReadOnly = true
    myvm.fieldsDef['ApplicationMakeOutInvoice.TaxAcross']._isRequired = false
  } else if (myvm.data['ApplicationMakeOutInvoice.WhetherRedTicket'] == 0 && myvm.data['ApplicationMakeOutInvoice.ClassificationMakeOutInvoice'] == 1 && myvm.data['ApplicationMakeOutInvoice.WhetherOperatePlace'] == 0) {
    myvm.fieldsDef['ApplicationMakeOutInvoice.TaxAcross']._isReadOnly = false

  } else if (myvm.data['ApplicationMakeOutInvoice.WhetherRedTicket'] == 0 && myvm.data['ApplicationMakeOutInvoice.ClassificationMakeOutInvoice'] == 1 && myvm.data['ApplicationMakeOutInvoice.WhetherOperatePlace'] == 1) {
    myvm.fieldsDef['ApplicationMakeOutInvoice.TaxAcross']._isReadOnly = false
    myvm.fieldsDef['ApplicationMakeOutInvoice.TaxAcross']._isRequired = true

  }



}
//*******************************根据条件设置【超产值开票原因】字段的属性********************************************************************

function setOverOutputReasonFild() {
  var type = myvm.data['ApplicationMakeOutInvoice.AdvancePayment']; // 是否预付款 0  
  if (Number(type) === 0) {
    var amount1 = myvm.data['ApplicationMakeOutInvoice.InvoiceApplicationAmountTax']; // 开票申请金额（含税）
    var amount2 = myvm.data['ApplicationMakeOutInvoice.RemainingInvoicAmountTax']; // 剩余开票金额
    let applyAmount = myvm.data['ApplicationMakeOutInvoice.CumulativeReportedTax']; // 累计上报产值（含税）

    if (Number(nPaymentAmount) > Number(applyAmount)) {
      //         if (Number(amount1) + Number(amount2) > Number(applyAmount)) {
      var reason = myvm.data['ApplicationMakeOutInvoice.OverOutputReason'];
      if (!reason) {
        FUI.Window.showMsg('当开票申请金额(含税)+ 剩余可开票金额(含税)(元) ＞ 累计上报产值(含税)(元)时，超产值开票原因不能为空 ');
        return false
      }
    }
  }
}

function ApplicationMakeOutInvoice_RContractType(value, field, parms) {
  //收入合同类型
  console.info("收入合同类型===:", value);
  console.info("收入合同类型field===:", field);
  console.info("收入合同类型parms===:", parms);
  fnPrepaymentSituation();
}

function ApplicationMakeOutInvoice_PrepaymentSituation(value, field, parms) {
  //预缴情况
  console.info('预缴情况 == ', value);
  if (value == 2) {
    myvm.data['ApplicationMakeOutInvoice.IsUnpaidInvoicingReason'] = '1';
  } else {
    myvm.data['ApplicationMakeOutInvoice.IsUnpaidInvoicingReason'] = '0';
  }

}

//判断开票类型
function fnClassificatMakeOutInvoice(type) {
  if (Number(type) === 1) { //建安合同
    myvm.fieldsDef['ApplicationMakeOutInvoice.ClassificationMakeOutInvoice']._isReadOnly = false;
    myvm.data['ApplicationMakeOutInvoice.ClassificationMakeOutInvoice'] = '1';
  } else if (Number(type) === 2) { //设计合同
    myvm.fieldsDef['ApplicationMakeOutInvoice.ClassificationMakeOutInvoice']._isReadOnly = true;
    myvm.data['ApplicationMakeOutInvoice.ClassificationMakeOutInvoice'] = '2';
  } else {
    myvm.data['ApplicationMakeOutInvoice.ClassificationMakeOutInvoice'] = '2';
    myvm.fieldsDef['ApplicationMakeOutInvoice.ClassificationMakeOutInvoice']._isReadOnly = false;
  }
  fnNoteInvoiceStatus();  //发票备注
}

//        var nRIndex = 0;
//        function ApplicationMakeOutInvoice_InvoiceApplicationDetails_TaxRate(value, field, parms){
//             console.info("申请明细税率===：",value, field, parms);
//            nRIndex = parms.rowIndex;
//        }

//子表点击税率后
//         function ApplicationMakeOutInvoice_InvoiceApplicationDetails_TaxRate_after(obj, field, parms) {
//             console.info("申请明细税率2===：",obj, field, parms);
//             let value =  obj.data['ApplicationMakeOutInvoice.InvoiceApplicationDetails.TaxRate'];
//             console.info("value===：",value);
//             console.log("nRIndex===",nRIndex);
//             if(value == '' || Number(value) == 0){
//                myvm.data['subtable.InvoiceApplicationDetails'][nRIndex+1]['ApplicationMakeOutInvoice.InvoiceApplicationDetails.TaxRate'] = '0.0';
//           $($("table[tablename='InvoiceApplicationDetails']").find('tr')[nRIndex+1]).find("input[name='ApplicationMakeOutInvoice.InvoiceApplicationDetails.TaxRate']").val("0.0");
//             }
//         }
        
//根据接口获取合同类别 再跟进合同类别调用
function fnRequestDataById(){
    var id = myvm.data['ApplicationMakeOutInvoice.ProjectId']
  $.extendAjax(`/applicationmakeoutinvoice/queryCumulativeReport?projectId=${id}`, '', "get", function (d) {
    console.log(d)
    myvm.data['ApplicationMakeOutInvoice.CumulativeReportedTax'] = d.data
  });
  $.extendAjax(`/applicationmakeoutinvoice/queryContractByProjectId?projectId=${id}`, '', "get", function (d) {
    if (d.data) {

      var res = d.data
      myvm.data['ApplicationMakeOutInvoice.RContractCode'] = res.vbillCode;
      myvm.data['ApplicationMakeOutInvoice.IncomeContractId'] = res.myId;
      myvm.data['ApplicationMakeOutInvoice.TypeDocument'] = res.contractType;
      nRContractType = res.contractType;
      myvm.data['ApplicationMakeOutInvoice.RContractName'] = res.contract;
      var type = JSON.parse(res.contractType).toString();
      isAdvancePayment();
      //             if (type == '2') {
      //                 myvm.data['ApplicationMakeOutInvoice.ClassificationMakeOutInvoice'] = '2'; //开票类型
      //                 myvm.fieldsDef['ApplicationMakeOutInvoice.ClassificationMakeOutInvoice']._isReadOnly = true;
      //             } else if (type == '1') {
      //                 myvm.data['ApplicationMakeOutInvoice.ClassificationMakeOutInvoice'] = '1';
      //                 myvm.fieldsDef['ApplicationMakeOutInvoice.ClassificationMakeOutInvoice']._isReadOnly = false;
      //             } else {
      //                 myvm.fieldsDef['ApplicationMakeOutInvoice.ClassificationMakeOutInvoice']._isReadOnly = false;
      //             }
      if (res.vbillCode) {
        var id = myvm.data['ApplicationMakeOutInvoice.RContractCode']
        var id2 = myvm.data['ApplicationMakeOutInvoice.ProjectId']
        var typeDocument = myvm.data['ApplicationMakeOutInvoice.TypeDocument']
        var data = {
          projectId: id2,
          typeDocument: type,
          rContractCode: id,
          myId: myvm.data['ApplicationMakeOutInvoice.MyId'],
          classificationMakeOutInvoice: myvm.data['ApplicationMakeOutInvoice.ClassificationMakeOutInvoice'],
          apiModelProperty: myvm.data['ApplicationMakeOutInvoice.ClassificationMakeOutInvoice']
        }
        if (data.classificationMakeOutInvoice && data.projectId && data.rContractCode && data.typeDocument) {
          $.extendAjax(`/applicationmakeoutinvoice/queryRoadworkAmount`, JSON.stringify(data), "post", function (d) {
            console.log(d)
            if (d.data) {
              var a = d.data.money || '';
              myvm.data['ApplicationMakeOutInvoice.PayableAmountTax'] = a
            }
          });
        }
      }
    }
  });
}

// *************************************初始化时根据projectId调用接口************************************************************
function requestDataById() {
  var id = myvm.data['ApplicationMakeOutInvoice.ProjectId']
  $.extendAjax(`/applicationmakeoutinvoice/queryCumulativeReport?projectId=${id}`, '', "get", function (d) {
    console.log(d)
    myvm.data['ApplicationMakeOutInvoice.CumulativeReportedTax'] = d.data
  });
  $.extendAjax(`/applicationmakeoutinvoice/queryContractByProjectId?projectId=${id}`, '', "get", function (d) {
    if (d.data) {

      var res = d.data
      myvm.data['ApplicationMakeOutInvoice.RContractCode'] = res.vbillCode;
      myvm.data['ApplicationMakeOutInvoice.IncomeContractId'] = res.myId;
      myvm.data['ApplicationMakeOutInvoice.TypeDocument'] = res.contractType;
      nRContractType = res.contractType;
      myvm.data['ApplicationMakeOutInvoice.RContractName'] = res.contract;
      var type = JSON.parse(res.contractType).toString();
      //             if (type == '2') {
      //                 myvm.data['ApplicationMakeOutInvoice.ClassificationMakeOutInvoice'] = '2'; //开票类型
      //                 myvm.fieldsDef['ApplicationMakeOutInvoice.ClassificationMakeOutInvoice']._isReadOnly = true;
      //             } else if (type == '1') {
      //                 myvm.data['ApplicationMakeOutInvoice.ClassificationMakeOutInvoice'] = '1';
      //                 myvm.fieldsDef['ApplicationMakeOutInvoice.ClassificationMakeOutInvoice']._isReadOnly = false;
      //             } else {
      //                 myvm.fieldsDef['ApplicationMakeOutInvoice.ClassificationMakeOutInvoice']._isReadOnly = false;
      //             }
      if (res.vbillCode) {
        var id = myvm.data['ApplicationMakeOutInvoice.RContractCode']
        var id2 = myvm.data['ApplicationMakeOutInvoice.ProjectId']
        var typeDocument = myvm.data['ApplicationMakeOutInvoice.TypeDocument']
        var data = {
          projectId: id2,
          typeDocument: type,
          rContractCode: id,
          myId: myvm.data['ApplicationMakeOutInvoice.MyId'],
          classificationMakeOutInvoice: myvm.data['ApplicationMakeOutInvoice.ClassificationMakeOutInvoice'],
          apiModelProperty: myvm.data['ApplicationMakeOutInvoice.ClassificationMakeOutInvoice']
        }
        if (data.classificationMakeOutInvoice && data.projectId && data.rContractCode && data.typeDocument) {
          $.extendAjax(`/applicationmakeoutinvoice/queryRoadworkAmount`, JSON.stringify(data), "post", function (d) {
            console.log(d)
            if (d.data) {
              var a = d.data.money || '';
              myvm.data['ApplicationMakeOutInvoice.PayableAmountTax'] = a || '';
            }
          });
        }
      }
    }
  });
  //             }
  //         }
  //     });
  // 获取项目档案信息 
  $.extendAjax(`/projectfiles/queryModel?myId=${id}`, '', "get", function (d) {
    console.log(d, '项目档案')
    if (d) {
      myvm.data['ApplicationMakeOutInvoice.BuildingServiceTakesPlace'] = d.data.projectAddres; // 建筑发生地
      myvm.data['ApplicationMakeOutInvoice.BuildingServiceAddress'] = d.data.address; // 建筑详细地址
      myvm.data['ApplicationMakeOutInvoice.CrossGroundMark'] = d.data.differentPlaces; // 是否跨域
      myvm.data['ApplicationMakeOutInvoice.WhetherOperatePlace'] = d.data.differentPlaces; // 是否异地经营
      myvm.data['ApplicationMakeOutInvoice.BuildingProjectName'] = d.data.projectName; // 建筑项目名称
      myvm.data['ApplicationMakeOutInvoice.WhetherRedTicket'] = '0'; // 是否红票
    }
  });
  getAccumulatedInvoicedAmount();
  getAccumulatedPrepaidTaxBase();

  let state = WFContext.WorkflowInstinceState;
  if (state != 1) {
    // 开票分类方法
    var val = myvm.data['ApplicationMakeOutInvoice.ClassificationMakeOutInvoice'];
    fnClassificationMakeOutInvoice(val);
  }

}

function extend_saveWorkflowForm_before() {
  //  开票申请金额含税 赋值 剩余可开票金额（含税）
  myData.setData('ApplicationMakeOutInvoice.RemainingInvoicAmountTax', myvm.data['ApplicationMakeOutInvoice.InvoiceApplicationAmountTax'])
}
//***************************************获取开票部分信息**************************************************************************

function getInvoiceInfo() {
  var id = myvm.data['ApplicationMakeOutInvoice.RContractCode'];
  var typeDocument = myvm.data['ApplicationMakeOutInvoice.TypeDocument'];
  var type = JSON.parse(typeDocument).toString();
  if (id && type) {

    $.extendAjax(`/applicationmakeoutinvoice/queryCustomerInfo?rContractCode=${id}&typeDocument=${type}`, '', "get", function (d) {
      if (d.data) {
        var res = d.data;
        if (res.seller) {
          myvm.data['ApplicationMakeOutInvoice.Seller'] = res.seller;  //销售方
        }
        if (res.taxIdentificationNumberSeller) {
          myvm.data['ApplicationMakeOutInvoice.TaxIdentificationNumberSeller'] = res.taxIdentificationNumberSeller;  //销售方纳税识别号
        }
        if (res.addressSeller) {
          myvm.data['ApplicationMakeOutInvoice.AddressSeller'] = res.addressSeller;   //销售方地址
        }
        if (res.sellerTelephoneNumber) {
          myvm.data['ApplicationMakeOutInvoice.SellerTelephoneNumber'] = res.sellerTelephoneNumber || '';  //销售方电话
        }
        if (res.invoicingBank) {
          myvm.data['ApplicationMakeOutInvoice.SellerOpenAccountBank'] = res.invoicingBank;  //销售方开户行
        }
        if (res.billingBankAccountNumber) {
          myvm.data['ApplicationMakeOutInvoice.SellerAccountNumber'] = res.billingBankAccountNumber;  //SellerAccountNumber
        }
        if (res.buySquare) {
          myvm.data['ApplicationMakeOutInvoice.BuySquare'] = res.buySquare;
        }
        if (res.buyerTaxIdentificationNumber) {
          myvm.data['ApplicationMakeOutInvoice.BuyerTaxIdentificationNumber'] = res.buyerTaxIdentificationNumber;
        }
        if (res.buyersAddress) {
          myvm.data['ApplicationMakeOutInvoice.BuyersAddress'] = res.buyersAddress;  //购方地址
        }
        if (res.acquiringPhone) {
          myvm.data['ApplicationMakeOutInvoice.AcquiringPhone'] = res.acquiringPhone;  //购房电话
        }
        if (res.lssuingBank) {
          myvm.data['ApplicationMakeOutInvoice.BuyerBank'] = res.lssuingBank; //购方开户行
        }

        if (res.billingBankAccountNo) {
          myvm.data['ApplicationMakeOutInvoice.BuyerAccount'] = res.billingBankAccountNo;  //购方账号
        }
        if (res.invoicingBank) {
          myvm.data['ApplicationMakeOutInvoice.SellerOpenAccountBank'] = res.invoicingBank;
        }

      fnJuadgeStatusEnde();
      }
    });

  }
}

//判断开票备注必填
function fnNoteInvoiceStatus() {
  let nNoteInvoice = myvm.data['ApplicationMakeOutInvoice.ClassificationMakeOutInvoice'];  //如果开票备注为1  开票备注必填
  if (Number(nNoteInvoice) === 1) {
    myvm.fieldsDef['ApplicationMakeOutInvoice.NoteInvoice']._isRequired = true;
  } else {
    myvm.fieldsDef['ApplicationMakeOutInvoice.NoteInvoice']._isRequired = false;
  }
}