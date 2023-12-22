<template>
  <div class="f2bpm-page-layout">
    <el-container>
      <el-main class="f2bpm-page-right">
        <div class="search-box"  style="padding:10px 10px 0;margin: 0 20px">     
          <el-form :model="formData" inline ref="form">   
            <el-form-item label="责任人：" prop="billNo">
              <el-input  width="100%" class="inputWidthNum" size="small" v-model="formData.billNo" placeholder="请输入责任人"></el-input>
            </el-form-item>
      
            <el-form-item label="填报人：" prop="projectNo">
              <el-input v-model="formData.projectNo" class="inputWidthNum" size="small" placeholder="请输入填报人"></el-input>
            </el-form-item>
          
            <el-form-item label="任务名称：" prop="constructionUnit">
              <el-input v-model="formData.constructionUnit" class="inputWidthNum" size="small" placeholder="请输入任务名称"></el-input>
            </el-form-item>

            <el-form-item label="任务状态：" prop="taskStatus"  v-if="isOpen">
              <el-input v-model="formData.taskStatus" class="inputWidthNum" size="small" placeholder="请输入任务状态"></el-input>
            </el-form-item>

            <el-form-item label="关键任务：" class="radioHeightNum" size="small" prop="radio"  v-if="isOpen">
              <el-radio-group v-model="formData.radio">
                <el-radio :label="3">备选项</el-radio>
                <el-radio :label="6">备选项</el-radio>
                <el-radio :label="9">备选项</el-radio>
              </el-radio-group>
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

        <div class="projectInfo">
          <div class="title">项目信息</div>
          <div class="formData">
            <el-form :model="formData1" inline ref="form1">   
              <el-row :gutter="24" align="middle">
                <el-col :span="8">
                  <el-form-item label="计划完成率：">
                    <el-input :style="{ width: '100%' }" v-model="data.billNo" placeholder="自动填写" size="small" disabled></el-input>
                  </el-form-item>
                  <el-form-item label="施工单位：">
                    <el-input :style="{ width: '100%' }"  v-model="data.constructionUnit"  placeholder="自动填写" size="small"  disabled ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="项目编号：" prop="projectNo">
                    <el-input :style="{ width: '100%' }" v-model="data.projectNo" placeholder="请选择项目" size="small" disabled name="testName" >
                      <el-button slot="append"  @click="openCustomDialog( '3ddedfb0-9b70-47f4-9016-466a4d684ee5', '项目编号', 'BPM_XiangMuBianHao_4419', 'ct_bpm_projectfiles', 800, 500, 0)"
                        icon="el-icon-search" ></el-button>
                    </el-input>
                  </el-form-item>
                  <el-form-item label="项目经理：">
                    <el-input :style="{ width: '100%' }" v-model="data.projectManager" placeholder="自动填写" size="small" disabled></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="项目名称：">
                    <el-input :style="{ width: '100%' }" v-model="data.projectName" placeholder="自动填写" size="small" disabled></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </div>
        </div>

        <div class="data-total">
          <ul>
            <li v-for="item in data.dataTotal" :key="item.title">
              <span>{{item.amount}}</span>
              <p> <i :class="item.icon" ></i>{{item.title}}</p>            
            </li>
          </ul>
        </div>
        <!-- <f2bpm-datagrid
          ref="grid"
          grid="grid"
          :toolbar="tableToolbar"
          :context-menu="{
            header: { options: headerMenus },
            className: 'my-menus',
          }"
          :pager-config="tablePage"
          :data="tableData"
          :columns="tableColumn"
          @cell-dblclick="celldbClick"
          @toolbar-button-click="toolbarButtonClickEvent"
          @header-contextmenu="contextMenuClickEvent"
          @page-change="pageChange"
          @sort-change="sortChange"
        /> -->

      <el-form label-width="120px" ref="formRef" id="formRef" :model="data" :rules="formRules">
        <el-table :data="data.detail" type="index" style="width: 100%;margin-bottom: 20px;" row-key="dutyPeopleID" border 
          :default-expand-all="true"  :tree-props="{ children: 'children', hasChildren: 'hasChildren' }">
            <el-table-column prop="nodeName" label="任务名称">
            </el-table-column>
            <el-table-column prop="value" label="关键任务" width="100px" align="center" >
              <template v-slot="{ row }">
                <div v-if="row.isKeyNodes">
                  {{ row.keyNodes == 1 ? '是' : '否' }}
                </div>
              </template>
            </el-table-column>
            <el-table-column label="责任人" prop="dutyPeople" width="160px">        
              <template slot-scope="scope" v-if="scope.row.isKeyNodes">              
                <el-form-item style="margin:0" label=" " label-width="10px" >
                  <el-input :style="{ width: '100%' }" v-model="scope.row.dutyPeople" placeholder="请选责任人" name="dutyPeople" disabled >
                    <el-button slot="append" icon="el-icon-search" @click="selectorUserString1('realName','userId',true,scope.row,scope.row.dutyPeopleID)"></el-button>
                  </el-input>
                </el-form-item>       
              </template>
            </el-table-column>
            <el-table-column label="填报人" prop="dutyPeople" width="160px">
              <template slot-scope="scope" v-if="scope.row.isKeyNodes"> 
                <el-form-item style="margin:0" label=" " label-width="10px" >
                  <el-input :style="{ width: '100%' }" v-model="scope.row.dutyPeople" placeholder="请选填报人" name="dutyPeople" disabled >
                    <el-button slot="append" icon="el-icon-search" @click="selectorUserString1('realName','userId',true,scope.row,scope.row.dutyPeopleID)"></el-button>
                  </el-input>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="计划开始日期" width="160px">
              <template slot-scope="scope" v-if="scope.row.isKeyNodes">
                <el-form-item style="margin:0" label=" " label-width="10px"   >
                  <el-date-picker v-model="scope.row.planBeginTime" type="date"  disabled  placeholder="选择日期"> </el-date-picker>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="计划结束日期"  width="160px">
              <template slot-scope="scope" v-if="scope.row.isKeyNodes">
                <el-form-item style="margin:0" label=" " label-width="10px" >          
                  <el-date-picker v-model="scope.row.planEndTime" type="date"  disabled  placeholder="选择日期"> </el-date-picker>
                </el-form-item>
              </template>
            </el-table-column>

            <el-table-column label="实际开始日期" width="160px">
              <template slot-scope="scope" v-if="scope.row.isKeyNodes">
                <el-form-item style="margin:0" label=" " label-width="10px"   >
                  <el-date-picker v-model="scope.row.planBeginTime" type="date"  disabled  placeholder="选择日期"> </el-date-picker>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="实际结束日期"  width="160px">
              <template slot-scope="scope" v-if="scope.row.isKeyNodes">
                <el-form-item style="margin:0" label=" " label-width="10px" >          
                  <el-date-picker v-model="scope.row.planEndTime" type="date"  disabled  placeholder="选择日期"> </el-date-picker>
                </el-form-item>
              </template>
            </el-table-column>

            <el-table-column label="任务状态"  width="160px">
              <template slot-scope="scope" v-if="scope.row.isKeyNodes" class="myselet">
                <el-form-item style="margin:0" label=" " label-width="10px">          
                  <f2bpmui-select configtype="任务状态" field="InvoiceSituation" style="width：100px" :fieldvalue="scope.row.InvoiceSituation" @updatevalue="updateFieldValue()"  class="myselect"  />
                  <!-- <f2bpmui-select configtype="发票情况" field="InvoiceSituation"  :fieldvalue="scope.row.InvoiceSituation" @updatevalue="updateFieldValue()" class="myselect" /> -->
                </el-form-item>
              </template>
            </el-table-column>

            <el-table-column label="附件"  width="60px">
              <template slot-scope="scope" v-if="scope.row.isKeyNodes">
                <el-form-item style="margin:0" label=" " label-width="10px" > 下载 </el-form-item>
              </template>
            </el-table-column>
            <!-- <el-table-column label="操作" align="center" width="100px">
              <template slot-scope="scope" v-if="isReadOnly !== true">        
                <el-button type="text" v-if="!scope.row.isKeyNodes" @click="addChilderData(scope.row,scope.row.dutyPeopleID)" >新增</el-button>          
                <el-button type="text" v-if="scope.row.isKeyNodes" @click="delChilderData(scope.row.dutyPeopleID)" >删除</el-button>
                <el-button type="text" v-else @click="delChilderData(scope.row.dutyPeopleID,true)">清空</el-button>                    
              </template>
            </el-table-column> -->
          </el-table>
        </el-form>
      </el-main>
    </el-container>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 表单查询的一些默认条件
      tableForm: Object.toClone(FUI.DataGridProperty.tableForm),
      // 工具格 具体使用可找到UI.DataGridProperty去看
      tableToolbar: Object.toClone(FUI.DataGridProperty.tableToolbar),
      // 表头配置项 // 表头右键菜单{header: {options: headerMenus},className: 'my-menus'}
      headerMenus: FUI.DataGridProperty.headerMenus,
      // 分页配置及总数量 配置,pagination:false不分页
      tablePage: Object.toClone(FUI.DataGridProperty.tablePage),
      // 列表数据源
      tableData: [],
      // 表头字段配置
      tableColumn: [],
      isOpen:false,
      data:{
        constructionUnit:'',
        projectName:'',
        projectManager:'',
        projectManagerID :'',
        projectId:'',
        constructionUnitId:'',
        dataTotal:[
          {
            title:'需提报任务',
            amount:200,
            icon:'el-icon-notebook-1'
          },
          {
            title:'需提报关键任务',
            amount:120,
            icon:'el-icon-notebook-2'
          },
          {
            title:'未提报任务',
            amount:60,
            icon:'el-icon-collection'
          },
          {
            title:'未提报关键任务',
            amount:10,
            icon:'el-icon-notebook-1'
          },
          {
            title:'已提报任务',
            amount:12,
            icon:'el-icon-notebook-1'
          },
          {
            title:'已提报关键任务',
            amount:21,
            icon:'el-icon-notebook-1'
          }
        ],
        detail: [
          {
            "nodeName": "外收代属",
            isKeyNodes:false,
            "dutyPeopleID": "51",
            dutyPeople:'',
            "children": [
              {
                "nodeName": "养号但包",
                isKeyNodes:true,
                "dutyPeopleID": "38",
                "planBeginTime": "",
                "planEndTime": "",
                "dutyPeople": ""  ,
                taskStatus:"",                  
              },            
            ],
          },
        ],
      },

      formRules: {
        projectNo: [{ required: true, message: '请选择项目名称', trigger: 'change' }],
        dutyPeople: [{ required: true, message: '请选择责任人', trigger: 'blur' }],
        planBeginTime: [{ required: true, message: '请选择开始日期', trigger: 'change' }],
        planEndTime: [{ required: true, message: '请选择结束日期', trigger: 'change' }]
      },
      // 查询条件
      formData: {
        pageIndex: 1,
        pageSize: 20,
        billNo: "",
        projectNo: "",
        constructionUnit: "",
        taskStatus:'',
        sort: "createTime",
        radio:'',
      },
    };
  },
  mounted() {
    // window.myvm指向当前页面vue实例
    window.myvm = this;
    // 自适应计算高度
    window.autoPageHeight();
  },
  created() {
    var that = this;
    //创建DataGrid对象,生成需要的属性 很重要
    var dg = FUI.DataGrid.Create(
      that,
      "ct_bpm_planorganization",
      "ct_bpm_planorganization",
      "grid",
      true,
      true,
      true
    );
    // 流程表单ID 找到对应流程应用id(在流程应用关联流程的时候会有) 直接写死 很重要
    that.appId = "CJ";
    // 排序字段
    dg.SortName = "CreateTime";
    // 默认排序
    dg.SortOrder = "desc";
    // 获取列表数据的接口路径  很重要
    dg.Url = "/extend/engmanager/queryPagePlanOrganization";
    // 是否显示序号
    dg.ShowNumbers = true;
    //是否显示更多查询条件按钮 如果是自己开发的查询 可以不写
    dg.ExpansMore = true;
    //工具栏默认按钮显示控制
    // this.ToolBarDefaultButtons = { ShowAdd: true, ShowDelete: true, ShowSearch: true };
    dg.ToolBarDefaultButtons.ShowDelete = true;
    dg.ToolBarDefaultButtons.ShowAdd = true;
    //操作默认按钮显示控制
    // this.OperationAction = { ShowEdit: true, ShowView: true, ShowDelete: true };
    dg.OperationAction.ShowView = true;
    // 列编辑操作按钮事件绑定
    dg.OperationEditEvent = this.myOperationEditEvent;
    // 列查看操作按钮事件绑定
    dg.OperationViewEvent = this.myOperationViewEvent;
    // 头部自定义操作按钮 默认显示新增 删除
    dg.ToolBarCustomButton = this.myToolBarCustomButton;
    // 列自定义操作按钮 自主开发需要写插槽实现 可以不用
    dg.OperationCustomButton = this.myOperationCustomButton;
    // 要打开流程表单的path路径
    dg.EditUrl = "/planning";
    // 表单标题
    dg.EditTitle = "计划编制";
    // 注册外部添加的方法
    dg.Bind();
    // 自主开发需要自定义表头字段
    that.tableColumn = [
      {
        type: "checkbox",
        fixed: "left",
        width: 35,
        align: "center",
      },
      {
        field: "id",
        title: "操作",
        align: "center",
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
              click: () => this.myOperationEditEvent(row.wiid, row, 1),
            };

            const item5 = {
              index: 8,
              title: "查看",
              class: "fa fa-edit",
              code: "default.view",
              click: () => this.myOperationViewEvent(row.wiid, row, 8),
            };

            var firstItem = item1;
            allbtns.push(item1);

            var firstItem = item5;
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
        field: "projectNo",
        title: "项目编号",
        align: "center",
        type: "html",
      },
      {
        field: "projectName",
        title: "项目名称",
        align: "center",
        type: "html",
      },
      {
        field: "constructionUnit",
        title: "施工单位",
        align: "center",
        type: "html",
      },
      {
        field: "projectmanager",
        title: "项目经理",
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
          var text = getWorkflowStatus(value);
          return text;
        },
      },
    ];
  },
  methods: {
    // 重置
    resetForm() {
      this.$refs.form.resetFields();
      this.dataGridSearch();
    },
    // 搜索
    searchFn() {
      this.dataGridSearch();
    },
    // 操作列自定义按钮
    myOperationCustomButton(h, value, row, index) {
      var that = this;
      var custBtns = [];
      // var item = { title: '示自定义', tip: '提示自定义', class: 'fa fa-trash-o', code: 'custom', click: () => this.operationCustomButtonClick(value, row, index) };
      // custBtns.push(item);
      return custBtns;
    },
    // 操作列查看按钮事件
    myOperationViewEvent(value, row, index) {
      this.dg.IdField = "wiid";
      this.showDialogEdit("3", row[this.dg.IdField]);
    },
    // 操作列编辑按钮事件
    myOperationEditEvent(value, row, index) {
      this.dg.IdField = "wiid";
      this.showDialogEdit("3", row[this.dg.IdField]);
    },
    // 打开流程表单页面
    showDialogEdit(formAction, wiid) {
      // var that = this;
      // var title = formAction == FUI.FormAction.Add ? '新增' + that.dg.EditTitle : formAction == FUI.FormAction.Edit ? '编辑' + that.dg.EditTitle : '查看' + that.dg.EditTitle;
      // FUI.Window.openEdit(that.dg.EditUrl, title, formAction, that.dg.GridId, 700, 550, null, that.dg.MainTable, keyId, true);
      this.startWorkflow(formAction, wiid);
    },
    // 工具栏按钮
    myToolBarCustomButton() {
      var btns = [];
      // btns.push({ code: 'closeEdit', status: 'default', name: '关闭', icon: 'fa fa-close' });
      return btns;
    },
    // 工具栏按钮事件
    toolbarButtonClickEvent({ btn }, event) {
      const code = btn.code;
      const that = this;
      if (code == "closeEdit") {
        FUI.Window.closeEdit();
      } else if (code == "default.add") {
        // that.showDialogEdit(FUI.FormAction.Add, '');
        var fn = that["startWorkflow"];
        fn("0");
      } else if (code == "default.delete") {
        this.dg.IdField = "myId";
        // 批量删除，默认执行FUI内部的删除，如有需要可用成自己的删除方法
        that.dg.ToolBarBathDelete(that);
      } else {
        var fn = that[code];
        fn(code);
      }
    },
    // 跳转流程表单页面
    startWorkflow(formAction, wiid) {
      var that = this;
      if (that.appId) {
        if (formAction === "0") {
          var url = __webpath + "/workflow/workflowform/index/?appId=" + that.appId + "&formAction=" + formAction;
        } else {
          var url = __webpath + "/workflow/workflowform/index/?appId=" + that.appId + "&formAction=" + formAction + "&wiid=" + wiid;
        }
        window.open(url, "_blank");
      } else {
        FUI.Window.showMsg("无流程的表单应用不可发起流程！");
      }
    },
    // 刷新列表
    refreshGrid(parentGridId, parm) {
      var that = this;
      that.dataGridSearch();
    },
    // 刷新查询方法
    dataGridSearch() {
      this.tablePage.currentPage = 1;
      this.tablePage.startIndex = 0;
      this.getGridData();
    },
    // 获取数据 这里直接复制粘贴
    getGridData() {
      const that = this;
      let parm = Object.toClone(that.tableForm.data);
      that.formData.pageIndex = that.tablePage.currentPage;
      that.formData.pageSize = that.tablePage.pageSize;
      parm = Object.extend(parm, that.formData);

      console.log("that.dg.GetUrl():",that.dg.GetUrl());
      Object.toExtendAjax( that.dg.GetUrl(), null, JSON.stringify(parm), true, null, function (res) {
          if (res.code == 200) {
            that.tableData = res.rows;
            that.tablePage.total = res.total;
            that.tablePage.pageCount = res.pageCount;
          } else {
            FUI.Window.showMsg(res.msg);
          }
        }
      );
    },

    // 展开收起条件筛选
    handelIsOpen(){
      this.isOpen = !this.isOpen;
    },

        // 弹框调用 获取字段绑定
    // id：自定义对话框id
    // name：自定义对话框名称
    // code：自定义对话框别名
    // ObjName：自定义对话框数据对象名称（数据库表名）
    // width：弹框宽度
    // height：弹框高度
    // radioMultiple：是否多选
    openCustomDialog (id, name, code, ObjName, width, height, radioMultiple) {
      var that = this
      var multi = radioMultiple == '1'
      CustomDialog(that, {
        customDialog: code,
        isTest: false,
        width: width,
        height: height,
        isMulti: multi,
        data: [
          {
            field: 'testName',
            property: 'myid'
          }
        ],
        callBack: function (data) {
          console.log(data)
          //自定义回调函数不是必须的，可删除
          that.data.projectNo = data[0].BillNo
          let {
            ConstructionUnit,
            ProjectName,
            ProjectManager,
            ProjectManagerID,
            MyId,
            ConstructionUnitID
          } = data[0]
          that.data.constructionUnit = ConstructionUnit
          that.data.projectName = ProjectName
          that.data.projectManager = ProjectManager
          that.data.projectManagerID = ProjectManagerID
          that.data.projectId = MyId
          that.data.constructionUnitId = ConstructionUnitID
        }
      })
    },
  },
};
</script>

<style  lang="scss" scoped>
.inputWidthNum{ min-width: 200px; }
.radioHeightNum{ line-height: 40px;
  ::v-deep .el-form-item__content{ line-height: 40px;}

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
  .expans-more { margin-left: 15px; cursor: pointer; font-size: 10px; color: #0D1126;}
  .projectInfo {width: 100%; padding:10px 20px; box-sizing: border-box; background-color: #fff; border-top:10px solid #eee;
    .title{ font-size: 14px; color: #0099ff; line-height: 14px;  text-align: left; margin:5px auto; padding:0 6px ; box-sizing: border-box; font-weight: bold; border-left: 4px solid #0099ff;}
    ::v-deep .formData {padding: 10px 0;    
      .el-form-item{ width:100%; display: flex;margin-bottom: 10px;
        .el-form-item__label{ flex-flow: 0; flex-shrink:0; min-width: 120px;}
        .el-form-item__content{ width: 100%; flex-grow:1;flex-shrink :1; 
          .el-input__inner{ width: 100%;}
        }
      }
    }
  }

.data-total{ width: 100%; padding:10px; background:#eee; overflow: hidden; box-sizing: border-box;
  ul{ width: 100%; height:auto; display: flex; justify-content: space-between; align-content: center;
    li{ width: 16%;height: 60px; background: #fff; display:flex ;justify-content:center; align-content: center; flex-direction: column; padding: 5px 0;
      span{ text-align: center; line-height: 26px; font-size: 20px; color: #0099ff; font-weight: bold; font-family: Arial, Helvetica, sans-serif; }
      p{ font-weight:bold; font-size: 14px; text-align: center; color: #666;  line-height: 20px;
        i{color: #a2b1ff; margin-right: 5px;}
      }
    }
  }
}



.el-date-editor.el-input, .el-date-editor.el-input__inner{ width:auto;}
.textBoxSelect, .textBoxShort{ width: auto; height: 40px;}
::v-deep .myselect{ font-size: 14px; width:100%;
     div{
      input.el-input__inner{ height:40px; width:100%}
    }
  }


</style>