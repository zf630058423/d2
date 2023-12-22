<template>
  <div class="f2bpm-page-layout costListClass">
    <el-container>
      <el-main class="f2bpm-page-right">
        <div class="search-box" style="padding:10px 10px 0;margin: 0 20px">
          <el-form :model="formData" inline ref="form">        
            <el-form-item label="单据编号：" prop="billNo">
              <el-input class="inputWidthNum" size="small" placeholder="请选择单据编号" v-model="formData.billNo">
                <!--<el-button size="small" slot="append" icon="el-icon-search" @click="handelOpenBillNo"></el-button>-->
              </el-input>
            </el-form-item>
      
            <el-form-item label="员    工：" prop="staff">
              <el-input class="inputWidthNum" size="small" placeholder="请输入员工" v-model="formData.staff">
                <!--<el-button size="small" slot="append" icon="el-icon-search" @click="handelProId"></el-button>-->
              </el-input>
            </el-form-item>
    
            <el-form-item label="付款财务组织：" prop="payOrg">
              <el-input class="inputWidthNum" size="small" placeholder="请输入付款财务组织" v-model="formData.payOrg">
                <!--<el-button size="small" slot="append" icon="el-icon-search" @click="handelCostructId"></el-button>-->
              </el-input>
            </el-form-item> 
            
            <el-form-item label="发票情况："  v-if="isOpen"  prop="invoiceSituation">
              <el-input class="inputWidthNum" size="small" placeholder="请输入发票情况：" v-model="formData.invoiceSituation">
                <!--<el-button size="small" slot="append" icon="el-icon-search" @click="handelCostructId"></el-button>-->
              </el-input>
            </el-form-item>     

          <!-- <div :gutter="24" v-if="isOpen" class="transparent"> -->
            <el-form-item label="结算方式："  v-if="isOpen"  prop="balaType">
              <el-input class="inputWidthNum"  size="small" v-model="formData.balaType" placeholder="请输入结算方式"></el-input>
            </el-form-item>
            <el-form-item label="收支项目："   v-if="isOpen"  prop="subjCode">
              <el-input class="inputWidthNum"  size="small" v-model="formData.subjCode" placeholder="请输入收支项目"></el-input>
            </el-form-item>

            <el-form-item label="付款账号："   v-if="isOpen"  prop="bankaccSub">
              <el-input class="inputWidthNum"  size="small" v-model="formData.bankaccSub" placeholder="请输入付款账号"></el-input>
            </el-form-item>
            <el-form-item label="票 据 号："   v-if="isOpen"  prop="checkNo">
              <el-input class="inputWidthNum"  size="small" v-model="formData.checkNo" placeholder="请输入票据号"></el-input>
            </el-form-item>
            <el-form-item label="付款状态："   v-if="isOpen"  prop="ProjectName">
              <el-input class="inputWidthNum"  size="small" v-model="formData.projectManager" placeholder="请输入付款状态"></el-input>
            </el-form-item>

            <el-form-item label="编 制 人："  v-if="isOpen"  prop="createName">
              <el-input class="inputWidthNum"  size="small" v-model="formData.createName" placeholder="编辑人"></el-input>
            </el-form-item>
            <el-form-item label="编制时间："  v-if="isOpen"  prop="createTime">
              <el-date-picker size="small" v-model="formData.createTime" type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
            </el-form-item>                    

            <el-form-item label="单据状态："  v-if="isOpen"  prop="procInState">
              <el-checkbox-group v-model="formData.procInState">
                <el-checkbox label="0" name="type" >拟稿</el-checkbox>
                <el-checkbox label="1" name="type" >草稿</el-checkbox>
                <el-checkbox label="2" name="type" >审批中</el-checkbox>
                <el-checkbox label="3" name="type">已完成</el-checkbox>
                <el-checkbox label="4" name="type">已挂起</el-checkbox>
              </el-checkbox-group>
            </el-form-item>     
            <el-form-item label="" prop="constructionUnitId">
              <span class="el-divider el-divider--vertical"></span>
              <el-button type="primary" size="small" class="fa fa-search" @click="searchFn">查询</el-button>
              <el-button type="primary" size="small" @click="resetForm">重置</el-button>
              <span v-if="!isOpen" class="expans-more" @click="handelIsOpen">展开 <i class="icon icon-arrow-down-bold"></i></span>
              <span v-else class="expans-more" @click="handelIsOpen">关闭 <i class="icon icon-arrow-up-bold"></i></span>
            </el-form-item>

          </el-form>
        </div>
        <f2bpm-datagrid ref="grid"
          grid="grid"
          :toolbar="tableToolbar"
          :context-menu="{header: {options: headerMenus},className: 'my-menus'}"
          :pager-config="tablePage"
          :data="tableData"
          :columns="tableColumn"
          @cell-dblclick="celldbClick"
          @toolbar-button-click="toolbarButtonClickEvent"
          @header-contextmenu="contextMenuClickEvent"
          @page-change="pageChange"
          @sort-change="sortChange" />
      </el-main>
    </el-container>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 表单查询的一些默认条件
      tableForm: Object.toClone(FUI.DataGridProperty.tableForm),
      // 工具格 具体使用可找到UI.DataGridProperty去看
      tableToolbar: Object.toClone(FUI.DataGridProperty.tableToolbar),
      // 表头配置项 // 表头右键菜单{header: {options: headerMenus},className: 'my-menus'}
      headerMenus: FUI.DataGridProperty.headerMenus,
      // 分页配置及总数量 配置,pagination:false不分页
      tablePage: Object.toClone(FUI.DataGridProperty.tablePage),
      // 表头字段配置
      tableColumn: [],

      // 列表数据源
      tableData: [],
 
      isOpen: false,
      // 查询条件
      formData: {
        pageIndex: 1,
        pageSize: 20,
        billNo: '',
        staff: '',
        bankaccSub: '',
        payOrg:'',
        invoiceSituation:'',
        balaType:'',
        checkNo:'',
        sort: 'createTime',  
        procInState:[],
        createName: null,
        beginTime: null,
        endTime: null
      },
  
    }
  },
  mounted () {
    // window.myvm指向当前页面vue实例
    window.myvm = this;
    // 自适应计算高度
    window.autoPageHeight();  
  },
  created () {
    var that = this;
    //创建DataGrid对象,生成需要的属性 很重要
    var dg = FUI.DataGrid.Create( that, "ct_bpm_planorganization", "ct_bpm_planorganization", "grid", true, true, true );
    // 流程表单ID 找到对应流程应用id(在流程应用关联流程的时候会有) 直接写死 很重要
    that.appId = "DI";
    // 排序字段
    dg.SortName = "CreateTime";
    // 默认排序
    dg.SortOrder = "desc";
    // 获取列表数据的接口路径  很重要
    
    // dg.Url = "/extend/engmanager/queryPagePlanOrganization";
    dg.Url = "/extend/finance/collectmoney/eer/queryEmployeeExpenseReimbursement"
    // 是否显示序号
    dg.ShowNumbers = true;
    //是否显示更多查询条件按钮 如果是自己开发的查询 可以不写
    dg.ExpansMore = true;
    //工具栏默认按钮显示控制
    // this.ToolBarDefaultButtons = { ShowAdd: true, ShowDelete: true, ShowSearch: true };
    
    dg.ToolBarDefaultButtons.ShowDelete = false;
    dg.ToolBarDefaultButtons.ShowAdd = false;
    // dg.ToolBarDefaultButtons.ShowSearch=true 

    // that.tableToolbar=[{code:"sk",status:''}]
    //操作默认按钮显示控制
    // this.OperationAction = { ShowEdit: true, ShowView: true, ShowDelete: true };
    dg.OperationAction.ShowView = true;
    // 列编辑操作按钮事件绑定
    dg.OperationEditEvent = this.myOperationEditEvent;
    // 列查看操作按钮事件绑定
    dg.OperationViewEvent = this.myOperationViewEvent;
    // 头部自定义操作按钮 默认显示新增 删除
    dg.ToolBarCustomButton = that.myToolBarCustomButton;
    // 列自定义操作按钮 自主开发需要写插槽实现 可以不用
    dg.OperationCustomButton = this.myOperationCustomButton;
    // 要打开流程表单的path路径
    dg.EditUrl = '/claimExpenseDetail';
    // 表单标题
    dg.EditTitle = '员工费用报销';
    // 注册外部添加的方法
    dg.Bind();
    // 自主开发需要自定义表头字段
    that.tableColumn = [
      {
        type: "checkbox",
        fixed: 'left',
        width: 35,
        align: "center",
      },
      { type: 'seq', width: 55, title: '序号', align: 'center', fixed: 'left' },
      {
        field: "id",
        title: "操作",
        align: "center",
        type: "html",
        slots: {
          default: ({ row, column }, h) => {
            const hbtns = [];
            const allbtns = [];
            const item0= {
              index: 110,
              title: "修改付款状态",
              class: "fa fa-edit",
              code: "default.setPaymentStatus",
              // click: () => this.setPayType(row.wiid, row, 110),
              click:()=>this.handelUpdate(row),
            };

            const item1 = {
              index: 1,
              title: "编辑",
              class: "fa fa-edit",
              code: "default.edit",
              click: () => this.myOperationEditEvent(row.wiid, row, 1),
            };

            const item5 = {
              index: 8,
              title: "查看",
              class: "fa fa-edit",
              code: "default.view",
              click: () => this.myOperationViewEvent(row.wiid, row, 8),
            };
            allbtns.push(item0);
            var firstItem = item5;
            allbtns.push(item1);
            allbtns.push(item5);
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
        field: "billNo",
        title: "单据编号",
        align: "center",
        type: "html",
      },
      {
        field: "staff",
        title: "员工",
        align: "center",
        type: "html",
      },

      {
        field: "payOrg",
        title: "付款财务组织",
        align: "center",
        type: "html",
      },
   
      {
        field: "reimbursementAmount",
        title: "报销金额（含税）(元)",
        align: "center",
        type: "html",
      },  
      {
        field: "createName",
        title: "编制人",
        align: "center",
        type: "html",
      },
      {
        field: "createTime",
        title: "编制时间",
        align: "center",
        type: "html",
      }, 
      {
        field: "procInstState",
        title: "单据状态",
        align: "center",
        type: "html",
        formatter: function (row, column, value, index) {
          var text = getWorkflowStatus(Number(value));
          return text;
        }
      },
      //
    ]
  },
  methods: {
    // 重置
    resetForm () {
      this.$refs.form.resetFields()
      this.dataGridSearch()
    },
    // 搜索
    searchFn () {
      this.dataGridSearch()
    },

    // 操作列自定义按钮
    myOperationCustomButton (h, value, row, index) {
      var that = this;
      var custBtns = [];
      // var item = { title: '示自定义', tip: '提示自定义', class: 'fa fa-trash-o', code: 'custom', click: () => this.operationCustomButtonClick(value, row, index) };
      // custBtns.push(item);
      return custBtns;
    },

    // 操作列查看按钮事件
    myOperationViewEvent (value, row, index) {
      console.log("row[this.dg.IdField]:",row[this.dg.IdField]);
      this.dg.IdField = 'wiid'
      this.showDialogEdit('3', row[this.dg.IdField]);
    },
    // 操作列编辑按钮事件
    myOperationEditEvent (value, row, index) {
      this.dg.IdField = 'wiid'
      this.showDialogEdit('3', row[this.dg.IdField]);
    },
    // 打开流程表单页面
    showDialogEdit (formAction, wiid) {
      var that = this;
      // var title = formAction == FUI.FormAction.Add ? '新增' + that.dg.EditTitle : formAction == FUI.FormAction.Edit ? '编辑' + that.dg.EditTitle : '查看' + that.dg.EditTitle;
      // FUI.Window.openEdit(that.dg.EditUrl, title, formAction, that.dg.GridId, 700, 550, null, that.dg.MainTable, keyId, true);
      this.startWorkflow(formAction, wiid)
    },

    //工具栏按钮
    myToolBarCustomButton() {
      var btns = [];
      btns.push({ code: 'Add', status: 'default', name: '新增', alias: 'Add', icon: 'icon icon-xinzeng' });        
      // btns.push({ code: 'Edit', status: 'default', name: '编辑', alias: 'Edit', icon: 'icon icon-bianji' });
      // btns.push({ code: 'Delete', status: 'default', name: '删除', alias: 'Delete', icon: 'icon icon-shanchu' });
      btns.push({ code: 'Export', status: 'primary', name: '导出', alias: 'Export', icon: 'icon icon-daochu' });
      return btns;
    },

    //工具栏按钮事件
    toolbarButtonClickEvent({ btn }, event) {
      let code = btn.code;
      console.info(code);
      let that = this;
      // if (code == 'closeEdit') {
      //   FUI.Window.closeEdit();
      // } else if (code == 'default.add') {
      //   that.showDialogEdit(FUI.FormAction.Add, '');
      // } else if (code == 'default.delete') {
      //   //批量删除，默认执行FUI内部的删除，如有需要可用成自己的删除方法
      //   that.dg.ToolBarBathDelete(that);
      if(code==='Add'){      
        // this.showDialogEdit('Add',);  
        this.showDialogEdit('0');
      }else if( code==='Edit' ){
        this.showDialogEdit(code);
      }else if(code==='Delete'){
        console.log("Delete");
        let da=  FUI.Grid.getGridChecked(that,grid);
        console.log("da:",da);
      } else {
        var fn = that[code];
        fn();
      }
    },

    // 跳转流程表单页面
    startWorkflow (formAction, wiid) {
      var that = this;
      if (that.appId) {
        if (formAction === '0') {
          var url = __webpath + '/workflow/workflowform/index/?appId=' + that.appId + '&formAction=' + formAction;
          // var url = __webpath + '/workflow/workflowform/index/?appId=' + that.appId;
        } else {
          var url = __webpath + '/workflow/workflowform/index/?appId=' + that.appId + '&formAction=' + formAction + '&wiid=' + wiid;
        }
        window.open(url, '_blank');
        // this.$router.push(url)
      
      } else {
        FUI.Window.showMsg('无流程的表单应用不可发起流程！');
      }
    },
    // 刷新列表
    refreshGrid (parentGridId, parm) {
      var that = this;
      that.dataGridSearch();
    },
    // 刷新查询方法
    dataGridSearch () {
      this.tablePage.currentPage = 1;
      this.tablePage.startIndex = 0;
      this.getGridData();
    },
    // 获取数据 这里直接复制粘贴
    getGridData () {
      const that = this;
      let parm = Object.toClone(that.tableForm.data);
      that.formData.pageIndex = that.tablePage.currentPage
      that.formData.pageSize = that.tablePage.pageSize;
      parm = Object.extend(parm, that.formData);
      if(parm.createTime && parm.createTime.length>0){
        parm.beginTime=parm.createTime[0];
        parm.endTime=parm.createTime[1]        
      }else{
        parm.beginTime=null ;
        parm.endTime=null;
      }
      parm.endTime=null;
      delete parm.createTime
      Object.toExtendAjax(that.dg.GetUrl(), null, JSON.stringify(parm), true, 'POST', function (res) {
        if (res.code == 200) {
          that.tableData = res.rows;   
          that.tablePage.total = res.total;
          that.tablePage.pageCount = res.pageCount;
        } else {
          that.tableData =[]
          FUI.Window.showMsg(res.msg);
   
        }
      });
    },
    // 切换状态
    handelIsOpen(){
      this.isOpen = !this.isOpen;
    },
    // 打开单据选择
    handelOpenBillNo(){
      var that=myvm;
      var customDialog = eval(CustomDialog);
      customDialog(that, {customDialog:"WorkflowSheetIdSelect",callBack:function(data){
        console.log(data);
      }});
    },
    // 操作列修改付款状态
    handelUpdate(field) {
      var json = {
          editorName: '修改付款状态',
          editorType: 'combobox',
          id: field.MyId,
          url: '/extend/finance/collectmoney/eer/updatePaymentState',
          editor: {
            options: {
              validType: [],
              data: [
                {
                  "text": "成功",
                  "value": '1'
                }, {
                    "text": "失败",
                    "value": '2'
                }, {
                    "text": "待付款",
                    "value": '3'
                }
              ]
            }
          },
          required: true,
          dataType: 'json',
          fieId: 'XieYiState',
          title: '修改状态',
          fieldName: 'status' 
      }
      var columnTitle = '付款状态修改';
      FUI.dialog("/workflow/gridEditor/defaultEditor2", '修改 [' + columnTitle + ']', json, 700, 560, function(objectData, index, layer) {
          console.log(objectData, index, 'hhhhhh')
          if (objectData && objectData.success == false) {
              return false;
          } else if (objectData && objectData.code == 500) {
              return false;
          } else if(objectData && objectData.success == true) {
              layer.close(index);
              myvm.load(index);
              myvm.$message({
                message: '修改状态成功',
                type: 'success'
              });
          }
      }, false);
    }
  }
}
</script>

<style>

.grid-toolbar{ width: 100%;  padding: 0 20px; box-sizing: border-box;}
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

  .costListClass .el-form-item:last-child{
    margin-bottom: 10px;
    margin-right:0;
  }
  .el-form-item__content .el-input-group {
    vertical-align: middle;
  }


</style>
