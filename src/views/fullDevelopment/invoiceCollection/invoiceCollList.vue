<template>
  <div class="f2bpm-page-layout costListClass">
    <el-container>
      <el-main class="f2bpm-page-right">
        <searchFrom ref="marketFormRef" :formData='formData' :dataDictArray="dataDictArray" @search="searchFormBtnclick"></searchFrom>

        <workTable ref="grid"
          grid="grid"
          :toolbar="tableToolbar"
          :context-menu="{header: {options: headerMenus},className: 'my-menus'}"
          :pager-config="tablePage"
          :table-data="tableData"
          :columns="tableColumn"
          @toolbar-button-click="toolbarButtonClickEvent"
          @page-change="pageChange"
          @sort-change="sortChange"
          @selection-change="handleSelectionChange"
          @checkbox-change="checkboxChange"
          @checkbox-all="checkboxChangeAll"
          v-loading="loading"
        />
      </el-main>
    </el-container>
    
    <!-- 批量认领弹框 -->
    <!-- <invoice-clami-pop :visible.sync="clamiVisible" @clamiSuccess="clamiSuccess"></invoice-clami-pop> -->

    <!-- 异常已交罚款 弹框 -->
    <!-- <fui-dialog :visible.sync="visibleBox" title="提醒" cancelText="取消" confirmText="确定" @on-cancel="onCancel" @on-confirm="abnormalConfirm">
      <div class="abnormal-fine-paid">
        <p>异常已交罚款？</p>
        <el-radio-group class="abnormal-fine-paid_radio" v-model="abnormalFinePaidStatus">
          <el-radio :label="1">已交</el-radio>
          <el-radio :label="2">未交</el-radio>
        </el-radio-group>
      </div>
    </fui-dialog> -->

    <!-- 收到发票原件 弹框 -->
    <!-- <fui-dialog :visible.sync="visibleInvoice" title="提醒" cancelText="取消" confirmText="确定" @on-cancel="onInvoiceCancel" @on-confirm="invoiceConfirm">
      <div class="abnormal-fine-paid">
        <p>是否收到发票原件？</p>
        <el-radio-group class="abnormal-fine-paid_radio" v-model="invoiceFineStatus">
          <el-radio :label="1">是</el-radio>
          <el-radio :label="0">否</el-radio>
        </el-radio-group>
      </div>
    </fui-dialog> -->

    <!-- 更新发票信息 -->
    <!-- <uploader-details title="更新发票信息" confirmText="确定更新" successText="更新发票信息成功" :visible.sync="updateInvoiceData.visible" :keyword="updateInvoiceData.key" :uploaderUrl="updateInvoiceData.url" @importSuccess="updateSuccess"></uploader-details> -->

    <!-- 导入弹框 -->
    <uploader-details :visible.sync="importData.visible" :keyword="importData.key" :uploaderUrl="importData.url" @importSuccess="importSuccess"></uploader-details>
  </div>
</template>
<script>
/**
 * 发票信息采集 列表
 */
import workTable from '@/components/table/workTable'
import searchFrom from './components/searchFrom.vue';
import InvoiceClamiPop from './components/invoiceClaimPop.vue'; //发票信息采集批量认领 弹框
import UpdateUploaderFile from '@/components/basic/importTemplateDialog/updateUploaderFile.vue';
import { getDataDictByConfigType } from '@/Api/dataDict.js';
import {
  getList,
  checkOutPushExpenseApi,
  pushExpenseHoldingApi,
  invoiceCollectionUpdateReviewApi,
  invoiceCollectionCancelReviewApi,
  exportApi,
  delTableModelApi
} from "@/Api/invoice/invoiceCollectionApi";
import FuiDialog from '@/components/basic/FuiDialog/index.vue';
import UploaderDetails from '@/components/basic/importTemplateDialog/uploaderDetails.vue';
import MyFun from '@/utils/fun';
  
export default {
  components: {
    workTable, searchFrom, UpdateUploaderFile, InvoiceClamiPop, FuiDialog, UploaderDetails
  },
  data() {
    return {
      gridId: 'grid',
      mainTable:'ct_BPM_InvoiceCollection',
      clamiVisible: false,  //批量认领弹框
      visibleInvoice: false, 
      loading: false, 
      // 表单查询的一些默认条件
      tableForm: {
        titleWidth: 100,
        titleAlign: 'right',
        props: { searchPlaceholder: "" },
        data: {
          "code": "",
          "name": "",
          "enableStatus": "",  // 启用状态
          "taxRegistrationNum": "",
          "natureOfSupplier": "",
          "customerProperty": "",
        },
      },
      invoiceTypeArray: [],  //发票类型
      haveReceivedOriginalInvoiceArray:[],  //是否收到发票原件
      // 工具格 具体使用可找到UI.DataGridProperty去看
      tableToolbar: {
        id: '',
        buttons: this.myToolBarCustomButton(),
      },
      importData: {
        visible: false,
        url: '/invoice/invoiceCollectionMain/importDataInvoiceCollection',
        key:'invoiceCollectionExportModel'
      },
      updateInvoiceData: {
        visible: false,
        url: '/invoice/invoiceCollectionMain/importDataUpdateInvoiceCollection',
        key:'updateInvoiceModel'
      },
      updateData: {
        visible: false,
        url: '/invoice/invoiceOpenMain/update'
      },
      // 表头配置项 // 表头右键菜单{header: {options: headerMenus},className: 'my-menus'}
      headerMenus: [{ code: 'configHead', name: '配置表头', prefixIcon: 'fa fa-cog', }],
      // 分页配置及总数量 配置,pagination:false不分页
      tablePage: {
        pageCount: 0,
        sort: '', // 排序字段
        order: 'asc', // 排序方向
        total: 0,
        currentPage: 1,
        pageSize: 20,
        align: 'center',
        pageSizes: [10, 20, 30, 40, 50, 100, 200, 500],
        layout: 'total, sizes, prev, pager, next, jumper'
      },
      dataDictArray: [],
      // 列表数据源
      tableData: [],
      // 表头字段配置
      tableColumn: [],
      // 表格查询条件
      formData: {
        code: '', // 单据编号
        invoiceNo: '', //发票号码
        sellerName: '',  //销售方
        buyersName: '', //购方
        invoiceState: '', //发票状态
        invoiceType: '',  //发票类型
        // makeInvoiceDate: [], //开票日期
        nameGoodsTaxableService: '',
        projectNo: '',
        projectName: '',
        typeInvoiceError: '', //发票错误类型
        contractNo: '', //支出合同编号
        contractName: '', //支出合同名称
        isHaveTypeInvoiceError: '',
        whetherRedTicket: '',
        contractOutMainName: '',
        receiveTickets: '',
        haveReceivedOriginalInvoice: '',
        ticketTime: '',
        personClaimingInvoice:'',  //发票认领人
        reviewOne: '',  //复核人
        review:'',
        invoiceAmountStart: '',
        invoiceAmountEnd: '',
        claimStatus: '',
        claimTime: '',
        checkTimeTime: '',
        blueFontInvoiceNo: '',
        invoiceBizType: '',
        // periodOutputTime:[], //进项转出期间
        checkWhether: '',
        createUserName: '',
        createTime: '',
        accrualExpenseStatus: '',
        applicationRedInformation: '',
        billNo: '',
        sourceInvoice: '',
        noteInvoice: '',
        memo: '',
        paymentDocumentNumber: '',
        taxRate:''
      },
      selectRows:[], //选择的
      fileId: '',  //文件的id
      isOpen: false,
      multipleSelection: [], // 存储列表勾选rows
      enableStateList: [],
      invoiceStatusArray: [],  //开票状态
      sourceInvoiceArray: [],  //发票来源
      accrualExpenseArray: [],  //是否推费用预提单
      applicationRedInformationArray: [],  //已申请红字信息表
      visibleBox: false,
      abnormalFinePaidStatus: '',  //异常已交罚款(1-已交；2-未交；)	
      invoiceFineStatus: '',  //是否收到发票原件(0-否；1-是；)	
      wfAction:0,  //0:add 2:edit 3:view
    }
  },
  watch: {
    '$route': function (to, from) { 
      if (from.path === '/noWorkflowForm') { 
        this.dataGridSearch();
      }
    }
  },
  created() {
    this.getDataDictByConfigType();
    this.tableColumn = [
      {
        type: "checkbox",
        fixed: 'left',
        width: 35,
        align: "center"
      },
      {
        type: "seq",
        title: "序号",
        fixed: 'left',
        width: 35,
        align: "center",
      },
      {
        field: "id",
        title: "操作",
        align: "center",
        fixed: 'left',
        width: 135,
        type: "html",
        slots: {
            default: ({ row, column }, h) => {
              const hbtns = [];
              const allbtns = [];
              const item1 = {
                index: 1,
                title: "编辑",
                class: "fa fa-edit",
                code: "default.edit",
                click: () => this.myOperationEditEvent(row.id, row, 1,'edit'),
              };
              const item2 = {
                index: 2,
                title: "删除",
                class: "fa fa-remove",
                code: "default.remove",
                click: () => this.myOperationDeleteEvent(row.id, row, 2, 'del'),
              };
              const item5 = {
                index: 8,
                title: "查看",
                class: "fa fa-edit",
                code: "default.view",
                click: () => this.myOperationViewEvent(row.id, row, 8,'detail'),
              };

              let firstItem = null;
              allbtns.push(item5);
              allbtns.push(item1);
              allbtns.push(item2);
              $.each(allbtns, function (i, item) {
                if (i == 0 && firstItem == null) {
                  firstItem = item;
                } else {
                  var itemBtn = h(
                    "el-dropdown-item",
                    {
                      attrs: {
                        btn_code: item.code,
                        title: item.tip,
                      },
                      class: item.class + " block minw80",
                      nativeOn: { click: item.click },
                    },
                    " " + item.title
                  );
                  hbtns.push(itemBtn);
                }
              });
              var dropMenus = h(
                "el-dropdown",
                {
                  props: {
                    size: "mini",
                    splitButton: true,
                    type: "default",
                  },
                  attrs: {
                    btn_code: firstItem.code,
                  },
                  on: {
                    click: firstItem.click,
                  },
                },
                [
                  h(
                    "i",
                    { class: firstItem.class, attrs: { title: firstItem.tip } },
                    " " + firstItem.title
                  ),
                  h(
                    "el-dropdown-menu",
                    {
                      props: {
                        slot: "dropdown",
                      },
                    },
                    hbtns
                  ),
                ]
              );
              return dropMenus;
            },
        },
      },
      {
        field: "invoiceNo",
        title: "发票号码",
        align: "center",
        width: MyFun.fnTiteWidth(false,'发票号码', 100),
        type: "html",
      },
      {
        field: "invoiceCode",
        title: "发票代码",
        align: "center",
        width: MyFun.fnTiteWidth(false,'发票代码', 100),
        type: "html",
      },
      {
        field: "nameGoodsTaxableService",
        title: "货物或应税劳务、服务名称",
        align: "center",
        width: MyFun.fnTiteWidth(false,'货物或应税劳务、服务名称', 100),
        type: "html",
      },
      {
        field: "makeInvoiceDate",
        title: "开票日期",
        align: "center",
        width: MyFun.fnTiteWidth(false,'开票日期', 100),
        type: "html",
      },
      {
        field: "invoiceAmount",
        title: "发票金额(含税)(元)",
        align: "center",
        width: MyFun.fnTiteWidth(false,'发票金额(含税)(元)', 100),
        type: "html",
      },
      {
        field: "tax",
        title: "税额",
        align: "center",
        width: MyFun.fnTiteWidth(false,'税额', 100),
        type: "html",
      },
      {
        field: "invoiceAmountNoTax",
        title: "发票金额(无税)(元)",
        align: "center",
        width: MyFun.fnTiteWidth(false,'发票金额(无税)(元)', 100),
        type: "html",
      },
      {
        field: "sellerName",
        title: "销售方",
        align: "center",
        width: MyFun.fnTiteWidth(false,'销售方', 100),
        type: "html",
      },
      {
        field: "buyersName",
        title: "购方",
        align: "center",
        width: MyFun.fnTiteWidth(false,'购方', 100),
        type: "html",
      },
      {
        field: "haveReceivedOriginalInvoice",
        title: "是否收到发票原件",
        align: "center",
        width: MyFun.fnTiteWidth(false,'是否收到发票原件', 100),
        type: "html",
        slots: {
          default: ({ row, column }, h) => { 
            const text = this.haveReceivedOriginalInvoiceArray.find(item => item.ConfigValue === row.haveReceivedOriginalInvoice)?.ConfigName || '';
            return (
              <span>{ text }</span>
            )
          }
        }
      },
      {
        field: "projectNo",
        title: "认领项目编号",
        align: "center",
        width: MyFun.fnTiteWidth(false,'认领项目编号', 100),
        type: "html",
      },
      {
        field: "amountClaimedTax",
        title: "认领金额(含税)",
        align: "center",
        width: MyFun.fnTiteWidth(false,'认领金额(含税)', 100),
        type: "html",
      },
      {
        field: "taxClaimedRate",
        title: "认领税额",
        align: "center",
        width: MyFun.fnTiteWidth(false,'认领税额', 100),
        type: "html",
      },
      {
        field: "invoiceState",
        title: "发票状态",
        align: "center",
        width: MyFun.fnTiteWidth(false,'发票状态', 100),
        type: "html",
        slots: {
          default: ({ row, column }, h) => { 
            const text = this.invoiceStatusArray.find(item => item.ConfigValue === row.invoiceState)?.ConfigName || '';
            return (<span>{ text }</span>)
          }
        }
      },
      {
        field: "invoiceType",
        title: "发票类型",
        align: "center",
        width: MyFun.fnTiteWidth(false,'发票类型', 100),
        type: "html",
        slots: {
          default: ({ row, column }, h) => {
            const text = this.invoiceTypeArray.find(item => item.ConfigValue === row.invoiceType)?.ConfigName || '';
            return (
              <span>{ text }</span>
             )
           }
        }
      },
      {
        field: "personClaimingInvoice",
        title: "发票认领人",
        align: "center",
        width: MyFun.fnTiteWidth(false,'发票认领人', 100),
        type: "html",
      },
      {
        field: "sourceInvoice",
        title: "发票来源",
        align: "center",
        width: MyFun.fnTiteWidth(false,'发票来源', 100),
        type: "html",
        slots: {
          default: ({ row, column }, h) => { 
            const text = this.sourceInvoiceArray.find(item => item.ConfigValue === row.sourceInvoice)?.ConfigName || '';
            return (<span>{ text }</span>)
          }
        }
      },
      {
        field: "checkWhether",
        title: "是否勾选",
        align: "center",
        width: MyFun.fnTiteWidth(false,'是否勾选', 100),
        type: "html",
        slots: {
          default: ({ row, column }, h) => { 
            let textData = {
              '0': '否',
              '1': '是',
              '2': '不勾选'
            }
            const text = textData[row.checkWhether] || '';
            return (<span>{ text }</span>)
          }
        }
      },
      {
        field: "accrualExpenseStatus",
        title: "是否推费用预提单",
        align: "center",
        width: MyFun.fnTiteWidth(false,'是否推费用预提单', 100),
        type: "html",
        slots: {
          default: ({ row, column }, h) => { 
            const text = this.accrualExpenseArray.find(item => item.ConfigValue === row.accrualExpenseStatus)?.ConfigName || '';
            return (<span>{text}</span>);
          }
        }
      },
      {
        field: "applicationRedInformation",
        title: "已申请红字信息表",
        align: "center",
        width: MyFun.fnTiteWidth(false,'已申请红字信息表', 100),
        type: "html",
        slots: {
          default: ({ row, column }, h) => { 
            const text = this.applicationRedInformationArray.find(item => item.ConfigValue === row.applicationRedInformation)?.ConfigName || '';
            return (<span>{ text }</span>);
          }
        }
      },
      {
        field: "noteInvoice",
        title: "发票备注",
        align: "center",
        width: MyFun.fnTiteWidth(false,'发票备注', 100),
        type: "html",
      },
      {
        field: "memo",
        title: "备注",
        align: "center",
        width: MyFun.fnTiteWidth(false,'备注', 100),
        type: "html",
      }
    ]
  },
  mounted () {
    // window.myvm指向当前页面vue实例
    window.myvm = this;
    // 自适应计算高度
    window.autoPageHeight();
    this.dataGridSearch();
  },
  methods: {
    // 操作列查看按钮事件
    myOperationViewEvent(value, row, index, type) {
      this.showDialogEdit(type, row, 3);
    },
    //操作列删除
    async myOperationDeleteEvent(id, row, index, type) {
      this.invoiceCollDelData(row.myId);
    },
    //操作列编辑
    myOperationEditEvent(id, row, index, type) {
      this.showDialogEdit(type, row, 2);
    },
    invoiceCollDelData(ids) {
      this.$confirm('您确定要删除所选记录吗?', '温馨提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.deleteInvoiceCollData(ids);
        })
    },
    async deleteInvoiceCollData(ids) { 
      const params = {
        customDataGridId: '04804226-928c-456c-8ec3-ea30360e1093',
        wiids: '',
        idField: 'MyId',
        idFieldValues: ids
      }
      let { success } = await delTableModelApi(params);
      if (success) {
        this.$message.success("删除成功");
        setTimeout(() => { 
          this.dataGridSearch();
        },800)
      }
    },
    // 打开无流程表单页面
    showDialogEdit(type, row, formAction) {
      const titleData = {
        'edit': '编辑',
        'detail': '查看'
      }
      const url = `/workflow/noWorkflowform/index/?formId=${row.formId}&myId=${row.myId}&businessKey=0764889e-a582-4071-aefe-ce65122a2ee0&formAction=${formAction}&parentGridId=${this.gridId}&mainTable=${this.mainTable}`;
      FUI.Window.openEdit(url,titleData[type], type, this.gridId, null, null, null, this.mainTable, '', true, null, null, true);
    },
    async getDataDictByConfigType() {
      const configTypes = '发票状态,发票类型,发票错误类型,发票有错误类型,是否收到发票原件,认领状态,复核状态,发票业务类型,是否红票,已申请红字信息表,发票来源,是否推费用预提单,已申请红字信息表';
      let params = {
        searchtext: '来源',
        searchfields: 'ConfigType,ConfigName',
        ConfigType: '',  //费用预提单来源
        page: 1,
        rows: 20,
        ConfigName: '',
        ConfigValue: '',
        IsEnable: '',
        order: '',
        ConfigKey: '',
        ParentConfigKey: '',
        sort: '',
        OrderNo: '',
        Flag:''
        // viewTable: 'f2bpm_sys_DataDict'
      }
      let { rows, success } = await getDataDictByConfigType(params);
      if (success) {
        this.dataDictArray = rows;
        //发票类型
        this.invoiceTypeArray = rows.filter(item => item.ConfigType === '发票类型') || [];
        //haveReceivedOriginalInvoiceArray 是否收到发票原件
        this.haveReceivedOriginalInvoiceArray = rows.filter(item => item.ConfigType === '是否收到发票原件') || [];
        // 发票状态
        this.invoiceStatusArray = rows.filter(item => item.ConfigType === '发票状态') || [];
        //发票来源
        this.sourceInvoiceArray = rows.filter(item => item.ConfigType === '发票来源') || [];
        //是否推费用预提单
        this.accrualExpenseArray = rows.filter(item => item.ConfigType === '是否推费用预提单') || [];
        //已申请红字信息表
        this.applicationRedInformationArray = rows.filter(item => item.ConfigType === '是否推费用预提单') || [];
      }
    },
    // 工具栏按钮 (添加自定义按钮)
    myToolBarCustomButton() {
      const btns = [
        { code: 'add', status: 'primary', name: '新增', icon: 'fa fa-play-circle' },
        { code: 'delete', status: 'danger', name: '删除', icon: 'fa fa-remove' },
        { code: 'att', status: 'primary', name: '认领', icon: '' },
        { code: 'downloadAtt', status: 'primary', name: '批量认领', icon: '' },
        { code: 'pushOrder', status: 'primary', name: '推费用预提单', icon: 'icon' },
        { code: 'reCheck', status: 'primary', name: '复核', icon: '' },
        { code: 'clickReview', status: 'primary', name: '一键复核', icon: '' },
        { code: 'cancelReview', status: 'primary', name: '取消复核', icon: '' },
        { code: 'updateInvoice', status: 'primary', name: '更新发票信息', icon: 'fa' },
        { code: 'receiptInvoice', status: 'primary', name: '收到发票原件', icon: '' },
        { code: 'abnormalFine', status: 'primary', name: '异常已交罚款', icon: '' },
        { code: 'import', status: 'primary', name: '导入', icon: 'icon icon-daoru1' },
        { code: 'export', status: 'primary', name: '导出', icon: 'icon icon-daochu' }
      ]
      return btns;
    },
    //工具栏按钮事件
    toolbarButtonClickEvent({ btn }, event) {
      const code = btn.code;
      const currUser = FUI.Sys.getAuthor();
      const currUserId = currUser.userId;
      const currUserRealName = decodeURI(currUser.realName);
      const currUserOrgName = decodeURI(currUser.orgName);
      const time = Object.toGetCurrentDateTimeString();
      const { createTimeStart, createTimeEnd, createUserName } = this.formData;
      const idList = this.selectRows.map(item => item.myId) || [];
      
      if (code === 'add') {
        this.wfAction = 0;
        const url = `/workflow/noWorkflowform/index/?formKey=OnlineForm_InvoiceInformationCollection20220905105551&formAction=0&parentGridId=${this.gridId}&mainTable=${this.mainTable}`;
        FUI.Window.openEdit(url, '新增', this.wfAction, this.gridId, null, null, null, this.mainTable, '', true, null, null, true);
      } else if (code === 'delete') { //批量删除
        if (idList.length === 0) {
          this.$message.error("请至少选择一条数据");
          return false;
        }
        const ids = idList.join(',');
        this.invoiceCollDelData(ids);
      } else if (code === 'att') { //认领
        const result = this.selectRows.find(res => res.whetherRedTicket === '1');
        const invoiceAmount = this.selectRows.map(item => Number(item.invoiceAmount));
        const list = this.selectRows.filter(item => item.sourceInvoice === '1' && item.review === '0');
        if (idList.length === 0) { 
          this.$message.error("请至少选择一条数据");
          return false;
        } else if (result) {
         this.$message.error('不能直接认领红票，请到详情页关联蓝票')
         return false;
        }
        else if (list.length > 0) {
          this.$message.error('发票需要先复核再认领')
          return false;
        }
        const data = { ids: idList, invoiceAmountList: invoiceAmount }
        const url = `/workflow/gridEditor/invoiceDialog`;
        FUI.Window.openEdit(url,"发票信息采集",'Add',this.gridId,800,500,null,this.mainTable, "", "", "",
          data, {
              sure: {
                  iconClass: "",
                  text: "xxxx"
              },
              close: {
                  iconClass: "",
                  text: "cccc"
              }
          }
        );
        // this.fnOpenEdit(params);
      } else if (code === 'downloadAtt') { //批量认领
        FUI.Window.openEdit('/workflow/gridEditor/batchClaimInvoicesDialog', '批量发票信息认领', 'add', '', null, null, null, null, null, true);
      } else if (code === 'pushOrder') { //推费用预提单
        if (this.selectRows.length === 0) {
          this.$message.error("请至少选择一条数据");
          return false;
        }
        this.pushOrderApi(idList);
      } else if (code === 'reCheck') {  //复核
        if (this.selectRows.length === 0) {
          this.$message.error("请至少选择一条数据进行发票复核");
          return false;
        }
        const createNameList = this.selectRows.filter(item => item.createName === currUserRealName);
        const arr = this.selectRows.filter(item => item.review && item.reviewOne && item.checkTime);
        if (arr.length !== 0) { 
          this.$message.error('此数据已复核过了,无需重复复核');
          return false;
        }
        if (createNameList.length > 0) { 
          this.$message.error("编制人与复核人不能是同一人");
          return false;
        }
        this.$confirm('请确认是否复核?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const param = {
            invoiceIds: idList,
            reviewOne: currUserRealName,
            checkTime: time,
            Review: 1,
            reviewOneId: currUserId
          }
          this.batchUpdateReviewData(param);
        })
      } else if (code === 'cancelReview') { //取消复核
        if (this.selectRows.length === 0) {
          this.$message.error("请至少选择一条数据进行取消发票复核");
          return false;
        }
        if (!createUserName) { 
          this.$message.error("使用取消复核,查询条件需输入编制人");
          return false;
        }
        this.$confirm('请确认是否取消复核?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          if (this.selectRows.length > 0) {
            const res = {
              invoiceIds: idList,
              reviewOne: currUserRealName,
              checkTime: time,
              Review: 1,
              reviewOneId: currUserId,
              cancelCheck: 1
            }
            this.batchUpdateReviewData(res);
          } else { 
            const params = {
              reviewOne: currUserRealName,
              reviewOneId: currUserId,
              createName: createUserName,
              createTimeBegin: createTimeStart,
              checkTime: time,
              createTimeEnd: createTimeEnd,
              updateStatus: 2
            }
            this.batchCancelReviewData(params);
          }
        })
      } else if (code === 'clickReview') { //一键复核
        if (!createUserName) {
          this.$message.error('使用一键复核，查询条件需输入编制人');
          return false;
        } else if (createUserName === currUserRealName) {
          this.$message.error('编制人与复核人不能是同一人');
          return false;
        }
        this.$confirm('请确认是一键复核？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const params = {
            reviewOne: currUserRealName,
            reviewOneId: currUserId,
            createName: createUserName,
            createTimeBegin: createTimeStart,
            createTimeEnd: createTimeEnd,
            updateStatus: 1,
            checkTime: time,
          }
          this.batchCancelReviewData(params);
        })
      } else if (code === 'updateInvoice') { //更新发票信息
        const data = { type: 3 };
        const params = {
          title: '更新发票',
          type: 'Add',
          gridId: this.gridId,
          mainTable: this.mainTable,
          data,
          width: 600,
          height: 400
        }
        this.fnOpenEdit(params);
      } else if (code === 'receiptInvoice') { //收到发票原件
        if (this.selectRows.length === 0) {
          this.$message.error("请至少选择一条数据");
          return false;
        }
        const data = { type: 1, ids: idList };
        const params = {
          title: '发票原件',
          type: 'Add',
          gridId: this.gridId,
          mainTable: this.mainTable,
          data,
          width: 600,
          height: 400
        }
        this.fnOpenEdit(params);
      } else if (code === 'abnormalFine') { //异常已交罚款
        if (this.selectRows.length === 0) {
          this.$message.error("请至少选择一条数据");
          return false;
        }
        const data = { type: 1, ids: idList };
        const params = {
          title: '异常罚款',
          type: 'Add',
          gridId: this.gridId,
          mainTable: this.mainTable,
          data,
          width: 600,
          height: 400
        }
        this.fnOpenEdit(params);
      } else if (code === 'import') { //导入
        const url = `/workflow/security/commonImport/commonExcelImport?type=customDataGrid&tableName=${this.mainTable}&formAction=Edit`;
        FUI.Window.openEdit(url, '数据导入', 'Edit', this.gridId, 600, 400, null, this.mainTable, "", "", "",
        '', {
          sure: {
            iconClass: "",
            text: "xxxx"
          },
          close: {
            iconClass: "",
            text: "cccc"
          }
        });
      } else if (code === 'export') { //导出
        this.$confirm('由于数据量大，导出数据可能需要您耐心等待。请问是否确定导出？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type:'warning'
        }).then(() => { 
          this.exportData();
        }).catch(() => { 
          this.$message.info('已取消导出')
        })
        
      }
    },
    //导出
    async exportData() { 
      try { 
        this.loading = true;
        await exportApi(this.formData);
      } catch (e) {
        this.loading = false;
      } finally {
        this.loading = false;
      }
    },
    //复核
    async batchUpdateReviewData(param) {
      let { code } = await invoiceCollectionUpdateReviewApi(param);
      if (code === 200) {
        this.$message.success('复核成功');
        this.dataGridSearch();
      }
    },
    //取消复核 和 一键复核
    async batchCancelReviewData(param) {
      let { code } = await invoiceCollectionCancelReviewApi(param);
      if (code === 200) { 
        this.$message.success('取消复核成功');
        this.dataGridSearch();
      }
    },
    refreshGrid(e) {
      console.log("e===:",e); 
      this.dataGridSearch();
    },
    //更新发票信息 收到发票原件 异常已交罚款
    fnOpenEdit(obj) {
      let _this = this;
      const { title, type, gridId, mainTable, data, width, height } = obj;
      FUI.Window.openEdit(`/workflow/gridEditor/updateInvicode`, title, type, gridId, width, height, null, mainTable, "", "", "",
      data, {
        sure: {
          iconClass: "",
          text: "xxxx"
        },
        close: {
          iconClass: "",
          text: "cccc"
        }
      });
    },
    //推费用预提单
    async pushOrderApi(ids) { 
      const { code } = await checkOutPushExpenseApi(ids);
      if (code === 200) { 
        this.pushExpenseHoldingData(ids);
      }
    },
    async pushExpenseHoldingData(ids) { 
      const { success, msg } = await pushExpenseHoldingApi(ids);
      if (success) {
        this.$message.success(msg || '预提单推送成功')
      } else { 
        this.$message.error(msg || '预提单推送失败')
      }
    },
    // 页面初始化/刷新查询方法
      dataGridSearch () {
        this.tablePage.currentPage = 1;
        this.tablePage.startIndex = 0;
        this.formData = this.$refs.marketFormRef.dataFormFormater();
        this.getGridData();
      },
    // 获取table数据 
      async getGridData () {
        const that = this;
        let parm = Object.toClone(that.formData);
        parm.currentPage = that.tablePage.currentPage;
        parm.pageSize = that.tablePage.pageSize;
        parm.sort = that.tablePage.sort;
        // parm.order = that.tablePage.order;
        // 调用请求api
        try {
          that.loading = true;
          let res = await getList(parm);
          that.tableData = res.data.list;
          that.tablePage.total = res.data.pagination.total;
          that.tablePage.pageCount = res.data.pagination.currentPage;
          if (that.tableData.length === 0) { 
            that.$message.info('当前没有发票信息采集信息');
          }
        } catch (error) {
          that.loading = false;
          that.$message.error(error.message || error.msg);
        } finally { 
          that.loading = false;
        }
    },
    //导入成功回调
    importSuccess(dataList) {
      this.tableData = dataList;
      this.importData.visible = false;
      this.dataGridSearch();
    },
    //查询
    searchFormBtnclick(obj) {
      this.formData = obj;
      this.getGridData();
    },
    pageChange({ currentPage, pageSize }) { 
      this.tablePage.currentPage = currentPage;
      this.tablePage.pageSize = pageSize;
      this.getGridData();
    },
    sortChange() { },
    handleSelectionChange(rows) {
      console.log("选择的数据===：",rows);
    },
    checkboxChange({ row, checked}) {
      if (checked) {
        this.selectRows.push(row)
      } else { 
        this.selectRows = this.selectRows.filter(el => el.id !== row.id);
      }
     },
    checkboxChangeAll(obj) { }
  },
}
</script>

<style lang="scss" scoped>
.inputWidthNum{
    min-width: 200px;
  }
  .expans-more {
    margin-left: 15px;
    cursor: pointer;
    font-size: 10px;
    color: #0D1126;
  }
  .costListClass .el-form-item{
    margin-bottom: 10px;
    margin-right: 15px;
  }
  .el-form-item__content .el-input-group {
    vertical-align: middle;
  }

  .abnormal-fine-paid{
    padding: 16px;
    p{
      font-size: 14px;
      font-weight: bold;
      margin-bottom: 16px;
    }

    &_radio{
      text-align: center;
      margin: 0 auto;
      width: 100%;
    }
  }
</style>