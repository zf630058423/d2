<template>
  <div class="f2bpm-page-layout">
    <el-container>
      <el-main class="f2bpm-page-right">
        <div class="search-box" style="padding:10px 10px 0;">
          <el-form :model="formData" inline ref="form">        
             <el-form-item label="单据编号：" prop="billNo">
                <el-input v-model="formData.billNo" class="inputWidthNum" size="small"  placeholder="请输入单据编号" ></el-input>
              </el-form-item>
         
              <el-form-item label="项目编号：" prop="projectNo">
                <el-input v-model="formData.projectNo" class="inputWidthNum" size="small"  placeholder="请输入项目编号" ></el-input>
              </el-form-item>
       
              <el-form-item label="施工单位：" prop="constructionUnit">
                <el-input v-model="formData.constructionUnit" class="inputWidthNum" size="small"  placeholder="请输入施工单位" ></el-input>
              </el-form-item>   
         
              <el-form-item label="项目经理："   v-if="isOpen"  prop="ProjectName">
                <el-input class="inputWidthNum"  size="small" v-model="formData.projectManager" placeholder="请输入项目经理"></el-input>
              </el-form-item>

              <el-form-item label="编 制 人："  v-if="isOpen"  prop="createName">
                <el-input class="inputWidthNum"  size="small" v-model="formData.createName" placeholder="编辑人"></el-input>
              </el-form-item>
              <el-form-item label="编制时间："  v-if="isOpen"  prop="createTime">
                <el-date-picker size="small" v-model="formData.createTime" type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
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

        <f2bpm-datagrid
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
        />
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
      // 查询条件
      formData: {
      
        pageIndex: 1,
        pageSize: 20,
        billNo: "",
        projectNo: "",
        constructionUnit: "",
        sort: "createTime",
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

    // 切换状态
    handelIsOpen(){
      this.isOpen = !this.isOpen;
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep .search-box{
  .el-form-item__label{ padding: 0 5px 0 20px;}
  .el-form-item{ margin-bottom: 10px;}
} 
.inputWidthNum{  min-width: 200px;}
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