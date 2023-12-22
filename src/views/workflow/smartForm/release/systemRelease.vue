<template>
  <div class="f2bpm-page-layout" v-loading="loading">
    <el-container>
      <el-main class="f2bpm-page-right">
        <div class="projectInfo">
          <div class="title">发版信息</div>
          <div class="release-box">
            <div class="release" v-for="(releaseData, rIndex) in releaseArray" :key="rIndex">
              <div class="left">
                <p>{{releaseData.title}}：</p>
                <el-button
                  type="primary"
                  size="mini"
                  @click="customDataGridImportBatch(releaseData.type)"
                  >{{releaseData.exportBtn}}</el-button
                >
                <el-button
                  type="success"
                  size="mini"
                  @click="customDataGridImport(releaseData.type)"
                  >{{releaseData.importBtn}}</el-button
                >
              </div>
              <div class="center">
                <p>导出状态：</p>
                <i v-if="releaseData.exportPerson && releaseData.exportDate" class="el-icon-circle-check"></i>
                <i v-else class="el-icon-circle-close"></i>
                <span style="display: inline-block;width:100px">{{ releaseData.exportPerson }}</span> 
                <span>{{ releaseData.exportDate }}</span>
              </div>
              <div class="right">
                <p>导入状态：</p>
                <i v-if="releaseData.importPerson && releaseData.importDate" class="el-icon-circle-check"></i>
                <i v-else class="el-icon-circle-close"></i>
                <span style="display: inline-block;width:100px">{{ releaseData.importPerson }}</span>
                <span>{{ releaseData.importDate }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="projectInfo">
          <div class="title" @click="gettex">表单信息</div>
          <div class="typebtn">
            <el-button
              type="primary"
              size="mini"
              @click="customDataGridImportBatch(6)"
              >一站式导出</el-button
            >
            <el-button
              type="success"
              size="mini"
              @click="customDataGridImport(6)"
              >一站式导入</el-button
            >
            <el-button
              type="warning"
              size="mini"
              @click="refreshColumnStateFn()"
              >一键发布物理表</el-button
            >
            <el-button
              type="primary"
              size="mini"
              @click="customDataGridImportBatch(7)"
              >流程导出</el-button
            >
            <el-button
              type="success"
              size="mini"
              @click="customDataGridImport(7)"
              >流程导入</el-button
            >
          </div>
          <el-table
            ref="multipleTable"
            header-row-class-name="tableheader"
            height="750"
            :data="tableData"
            tooltip-effect="dark"
            style="width: 100%"
          >
            <el-table-column type="selection"></el-table-column>
            <el-table-column type="index" label="序号"></el-table-column>
            <el-table-column
              label="表单应用"
              prop="formName"
              width="180"
            ></el-table-column>
            <el-table-column label="流程类型" prop="formType"></el-table-column>
            <el-table-column
              label="创建时间"
              prop="createDate"
              width="180"
            ></el-table-column>
            <el-table-column
              label="数据建模导入状态"
              :show-overflow-tooltip="true"
            >
              <template slot-scope="scope">
                <i
                  v-if="scope.row.tableImprotState"
                  class="el-icon-circle-check"
                ></i>
                <i v-else class="el-icon-circle-close"></i>
                {{ scope.row.tableImprotPerson }}
                {{ scope.row.tableImprotTime }}
              </template>
            </el-table-column>
            <el-table-column
              label="数据建模导出状态"
              width="180"
              :show-overflow-tooltip="true"
            >
              <template slot-scope="scope">
                <i
                  v-if="scope.row.tableDeriveState"
                  class="el-icon-circle-check"
                ></i>
                <i v-else class="el-icon-circle-close"></i>
                {{ scope.row.tableDerivePerson }}
                {{ scope.row.tableDeriveTime }}
              </template>
            </el-table-column>
            <el-table-column
              label="表单设计导入状态"
              width="180"
              :show-overflow-tooltip="true"
            >
              <template slot-scope="scope">
                <i
                  v-if="scope.row.formImprotState"
                  class="el-icon-circle-check"
                ></i>
                <i v-else class="el-icon-circle-close"></i>
                {{ scope.row.formImprotPerson }} {{ scope.row.formImprotTime }}
              </template>
            </el-table-column>
            <el-table-column
              label="表单设计导出状态"
              width="180"
              :show-overflow-tooltip="true"
            >
              <template slot-scope="scope">
                <i
                  v-if="scope.row.formDeriveState"
                  class="el-icon-circle-check"
                ></i>
                <i v-else class="el-icon-circle-close"></i>
                {{ scope.row.formDerivePerson }} {{ scope.row.formDeriveTime }}
              </template>
            </el-table-column>
            <el-table-column
              label="物理表发布状态"
              :show-overflow-tooltip="true"
            >
              <template slot-scope="scope">
                <i
                  v-if="scope.row.dbTableState"
                  class="el-icon-circle-check"
                ></i>
                <i v-else class="el-icon-circle-close"></i>
                {{ scope.row.formImprotPerson }} {{ scope.row.formImprotDate }}
              </template>
            </el-table-column>
            <el-table-column
              label="流程导出状态"
              width="180"
              :show-overflow-tooltip="true"
            >
              <template slot-scope="scope">
                <i
                  v-if="scope.row.flowDeriveState"
                  class="el-icon-circle-check"
                ></i>
                <i v-else class="el-icon-circle-close"></i>
                {{ scope.row.flowDerivePerson }} {{ scope.row.flowDeriveTime }}
              </template>
            </el-table-column>
            <el-table-column label="流程导入状态" :show-overflow-tooltip="true">
              <template slot-scope="scope">
                <i
                  v-if="scope.row.flowImprotState"
                  class="el-icon-circle-check"
                ></i>
                <i v-else class="el-icon-circle-close"></i>
                {{ scope.row.flowImprotPerson }} {{ scope.row.flowImprotTime }}
              </template>
            </el-table-column>
          </el-table>

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
        </div>
      </el-main>
    </el-container>
  </div>
</template>
 
<script>
import {
  getRelease,
  getReleaseTable,
  refreshColumnState,
  downloadProcessAppXmlBatch,
  downLoadFormXml,
  downLoadModelXml,
  queryModel
} from "@/Api/financialManagement/releasea_api";

const CODE_STATUS = {
          SJZD: 'SJZD',  //数据字典
          LSHGL: 'LSHGL', //流水号管理
          ZDYDHK: 'ZDYDHK',  //自定义对话框
          ZDYLB: 'ZDYLB',  //自定义列表
          CDGL:'CDGL',  //菜单管理
          SJFWGL:'SJFWGL', //数据服务管理
          JSGL:'JSGL', //角色管理
          BQGL:'BQGL',  //标签管理
          SJMX:'SJMX'   //数据模型
}
        
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
      titleData: [],
      // 表头字段配置
      tableColumn: [],
      isOpen: false,
      releaseArray: [
        { title: '数据字典', exportBtn: '一站式导出', importBtn: '一站式导入', code: 'SJZD', exportStatus: false, exportPerson: '', exportDate: '', importStatus: false, importPerson: '', importDate: '', type: 1},
        { title: '流水号管理', exportBtn: '一站式导出', importBtn: '一站式导入', code: 'LSHGL', exportStatus: false, exportPerson: '', exportDate: '', importStatus: false, importPerson: '', importDate: '', type: 2 },
        { title: '自定义对话框', exportBtn: '一站式导出', importBtn: '一站式导入', code: 'ZDYDHK', exportStatus: false, exportPerson: '', exportDate: '', importStatus: false, importPerson: '', importDate: '', type: 3 },
        { title: '自定义列表', exportBtn: '一站式导出', importBtn: '一站式导入', code: 'ZDYLB', exportStatus: false, exportPerson: '', exportDate: '', importStatus: false, importPerson: '', importDate: '' , type: 4},
        { title: '菜单管理', exportBtn: '一站式导出', importBtn: '一站式导入', code: 'CDGL', exportStatus: false, exportPerson: '', exportDate: '', importStatus: false, importPerson: '', importDate: '' , type: 5},
        { title: '数据服务管理', exportBtn: '一站式导出', importBtn: '一站式导入', code: 'SJFWGL', exportStatus: false, exportPerson: '', exportDate: '', importStatus: false, importPerson: '', importDate: '' , type: 8},
        { title: '角色管理', exportBtn: '一站式导出', importBtn: '一站式导入', code: 'JSGL', exportStatus: false, exportPerson: '', exportDate: '', importStatus: false, importPerson: '', importDate: '' , type: 9},
        { title: '标签管理', exportBtn: '一站式导出', importBtn: '一站式导入', code: 'BQGL', exportStatus: false, exportPerson: '', exportDate: '', importStatus: false, importPerson: '', importDate: '' , type: 10},
        {title:'数据模型',exportBtn:'一站式导出',importBtn:'一站式导入',code:'SJMX',exportStatus:false,exportPerson:'',exportDate:'',importStatus:false,importPerson:'',importDate:'', type: 11},
      ],
      releaseData: {}, //发版数据
      data: {
        constructionUnit: "",
        projectName: "",
        projectManager: "",
        projectManagerID: "",
        projectId: "",
        constructionUnitId: "",
        dataTotal: [
          {
            title: "需提报任务",
            amount: 200,
            icon: "el-icon-notebook-1",
          },
          {
            title: "需提报关键任务",
            amount: 120,
            icon: "el-icon-notebook-2",
          },
          {
            title: "未提报任务",
            amount: 60,
            icon: "el-icon-collection",
          },
          {
            title: "未提报关键任务",
            amount: 10,
            icon: "el-icon-notebook-1",
          },
          {
            title: "已提报任务",
            amount: 12,
            icon: "el-icon-notebook-1",
          },
          {
            title: "已提报关键任务",
            amount: 21,
            icon: "el-icon-notebook-1",
          },
        ],
        detail: [
          {
            nodeName: "外收代属",
            isKeyNodes: false,
            dutyPeopleID: "51",
            dutyPeople: "",
            children: [
              {
                nodeName: "养号但包",
                isKeyNodes: true,
                dutyPeopleID: "38",
                planBeginTime: "",
                planEndTime: "",
                dutyPeople: "",
                taskStatus: "",
              },
            ],
          },
        ],
      },

      formRules: {
        projectNo: [
          { required: true, message: "请选择项目名称", trigger: "change" },
        ],
        dutyPeople: [
          { required: true, message: "请选择责任人", trigger: "blur" },
        ],
        planBeginTime: [
          { required: true, message: "请选择开始日期", trigger: "change" },
        ],
        planEndTime: [
          { required: true, message: "请选择结束日期", trigger: "change" },
        ],
      },
      // 查询条件
      formData: {
        pageIndex: 1,
        pageSize: 20,
        billNo: "",
        projectNo: "",
        constructionUnit: "",
        taskStatus: "",
        sort: "createTime",
        radio: "",
      },
      loading: false,
    };
  },
  mounted() {
    // window.myvm指向当前页面vue实例
    window.myvm = this;
    this.getQueryModelData();
    this.getReleaseTableFn();
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
    dg.Url = "/extend/versionupgrade/formListAll";
    // 是否显示序号
    dg.ShowNumbers = true;
    //是否显示更多查询条件按钮 如果是自己开发的查询 可以不写
    dg.ExpansMore = true;
    //工具栏默认按钮显示控制
    // this.ToolBarDefaultButtons = { ShowAdd: true, ShowDelete: true, ShowSearch: true };
    dg.ToolBarDefaultButtons.ShowDelete = false;
    dg.ToolBarDefaultButtons.ShowAdd = false;
    //操作默认按钮显示控制
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
    dg.EditTitle = "发版";
    that.dg = dg;
    
  },
  methods: {
    gettex() {
      console.log(this.$refs.multipleTable.selection);
    },
    divisor() {
      var object = this.tableData[0];
      this.titleData = Object.values(object);
      this.keysData = Object.keys(object);
      console.log(this.titleData, this.keysData);
      // this.tableData = this.tableData.splice(1);
    },
    renovatePage() {
      console.log("刷新");
    },
    //获取导出状态
    getQueryModelData() { 
      let _this = this;
      queryModel().then((res) => { 
        let dataList = res.data;
        _this.loading = false;
        if (dataList && dataList.length > 0) { 
          _this.releaseArray.forEach(item => { 
            let oData = dataList.find(d => d.code === item.code);
            item.exportStatus = oData ? oData.exportStatus : false; //导出状态
            item.exportPerson = oData ? oData.exportPerson : ''; //导出人
            item.exportDate = oData ? oData.exportDate : '';  //导出时间
            item.importStatus = oData ? oData.importStatus : false; //导入状态
            item.importPerson = oData ? oData.importPerson : '';  //导入人
            item.importDate = oData ? oData.importDate : '';  //导入时间
          })
        }
      })
    },
    //导入
    customDataGridImport(type) {
      let submitData = { type };
      let url = `/workflow/security/customDataGrid/customDataGridImportAll`;
      let titleArray = ['导入数据字典', '导入流水号', '导入自定义对话框', '导入自定义列表', '导入菜单', '导入表单', '导入流程', '数据服务管理', '角色管理', '标签管理', '数据模型'];
      let title = (type > 1) ? titleArray[type - 1] : '';

      FUI.Window.openEdit(
        url,
        title,
        FUI.FormAction.Edit,
        this.dg.MainTable,
        550,
        400,
        null,
        "",
        "",
        "",
        this.renovatePage,
        submitData,
        true
      );
    },
    customDataGridImportBatch(type) {
      let _this = this;
      let titleData = {
        1: '数据字典',
        2: '流水号',
        3: '自定义对话框',
        4: '自定义列表',
        5: '菜单管理',
        8: '数据服务管理',
        9: '角色管理',
        10: '标签管理',
        11: '数据模型'
      }
      let aUrlData = {
        1: '/ImprotUp/downLoadDataDictXml',
        2: '/ImprotUp/downLoadSerialNumXml', 
        3: '/ImprotUp/downLoadCustomDialogXml',
        4: '/ImprotUp/downLoadCustomDataGridXml',
        5: '/ImprotUp/downLoadResourceXml',
        8: '/ImprotUp/downLoadDataService',
        9: '/ImprotUp/downLoadRoles',
        10: '/ImprotUp/downLoadDepart',
        11: '/release/downLoadDataModel',
        // 11: 'release/downloadUpgradePackage'
      }
      if (type == 6 || type == 7) {
        let dataList = this.$refs.multipleTable.selection;
        let ids = dataList.map(mItem => ({
          formKey: mItem.formKey,
          appId: mItem.appId,
          formType: mItem.formType,
        }))
        if (type == 6) {
          if (ids.length == 0) {
            FUI.Window.showMsg2("请选择要导出的表单");
          } else {
            FUI.Window.confirm("确定要导出选择的表单", null, function () {
              _this.loading = true;
              try {
                let formKeys = ids.map(x => { return x.formKey });
                downLoadFormXml(formKeys).then((res) => {
                  FUI.Window.showMsg2(res.msg, null, 1);
                  _this.loading = false;
                  // _this.getReleaseFn();
                  _this.getQueryModelData();
                });
              } catch (error) {
                _this.loading = false;
              }
            });
          }
        }
        if (type == 7) {
          if (ids == "" || ids.length <= 0) {
            FUI.Window.showMsg(this, "请选择要导出的流程", null, null, function (modal) {
              modal.show = false;
            });
            return false;
          } else {
            FUI.Window.confirm("确定要导出选择的流程", null, function () {
              _this.loading = true;
              downloadProcessAppXmlBatch(ids).then((res) => {
                let blob = new Blob([res], {
                  // 下载的文件类型(此处可更改：具体取值参考以下链接地址)
                  type: "text/xml",
                });
                let fileName = (dataList.length == 1) ? `${dataList[0].formName}-导出流程` : '导出流程';
                let url = window.URL.createObjectURL(blob);
                let link = document.createElement("a");
                link.style.display = "none";
                link.download = fileName;
                link.href = url;
                document.body.appendChild(link);
                link.click();
                _this.loading = false;
                _this.getReleaseTableFn();
                // _this.getReleaseFn();
                _this.getQueryModelData();
              });
            });
          }
        }
      }
      else if (type == 11) { 
         let msg = `确定导出${titleData[type]}` || '';
        FUI.Window.confirm(msg, null, function () {
            _this.loading = true;
            Object.toAjaxDownloadFile(aUrlData[type], "", {});
             _this.getQueryModelData();
            //   downLoadModelXml(null).then((res) => {
            //     FUI.Window.showMsg2(res.msg, null, 1);
            //     _this.loading = false; 
            //     _this.getQueryModelData();
            // });
          })
      } else { 
        let msg = `确定导出${titleData[type]}` || '';
        FUI.Window.confirm(msg, null, function () {
          Object.toAjaxDownloadFile(aUrlData[type],"",{});
            // _this.getReleaseFn();
            _this.getQueryModelData();
        })
      }
    },
    //发表物理表
    refreshColumnStateFn() {
      let that = this;
      let dataList = that.$refs.multipleTable.selection;
      let ids = [];
      for (let i = 0; i < dataList.length; i++) {
        ids.push({ formKey: dataList[i].formKey });
      }
      if (ids && ids.length > 0) {
        FUI.Window.confirm("是否发布选择的物理表", null, function () {
          refreshColumnState().then((res) => {
            FUI.Window.showMsg(res.msg, "", "OK1");
          });
        });
      } else {
        FUI.Window.confirm("否发布全部物理表", null, function () {
          refreshColumnState().then((res) => {
            FUI.Window.showMsg(res.msg, "", "OK1");
          });
        });
      }
    },

    //获取发版数据
    getReleaseFn() {
      let that = this;
      getRelease().then((res) => {
        if (res.code == 200) {
          that.releaseData = res.data;
          console.log("releaseData===:",that.releaseData);
        } else {
          FUI.Window.showMsg(res.msg);
        }
      });
    },

    //获取发版表单数据
    getReleaseTableFn() {
      let that = this;
      getReleaseTable().then((res) => {
        that.tableData = res.data;
        // this.divisor();
      });
    },
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
      // this.startWorkflow(formAction, wiid);
    },
    // 工具栏按钮
    myToolBarCustomButton() {
      var btns = [];
      // btns.push({ code: 'closeEdit1', status: 'primary', name: '一站式导出', icon: '' });
      // btns.push({ code: 'closeEdit2', status: 'success', name: '一站式导入', icon: '' });
      // btns.push({ code: 'closeEdit3', status: 'warning', name: '一键发版物理表', icon: '' });
      // btns.push({ code: 'closeEdit4', status: 'primary', name: '流程导出', icon: '' });
      // btns.push({ code: 'closeEdit5', status: 'success', name: '流程导入', icon: '' });
      return btns;
    },

    // 刷新列表
    refreshGrid(parentGridId, parm) {
      // that.getReleaseFn();
      this.getQueryModelData();
      this.getReleaseTableFn();
    },
    // 刷新查询方法
    dataGridSearch() {
      this.tablePage.currentPage = 1;
      this.tablePage.startIndex = 0;
      // this.getGridData();
    },

    // 展开收起条件筛选
    handelIsOpen() {
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
    openCustomDialog(id, name, code, ObjName, width, height, radioMultiple) {
      var that = this;
      var multi = radioMultiple == "1";
      CustomDialog(that, {
        customDialog: code,
        isTest: false,
        width: width,
        height: height,
        isMulti: multi,
        data: [
          {
            field: "testName",
            property: "myid",
          },
        ],
        callBack: function (data) {
          console.log(data);
          //自定义回调函数不是必须的，可删除
          that.data.projectNo = data[0].BillNo;
          let {
            ConstructionUnit,
            ProjectName,
            ProjectManager,
            ProjectManagerID,
            MyId,
            ConstructionUnitID,
          } = data[0];
          that.data.constructionUnit = ConstructionUnit;
          that.data.projectName = ProjectName;
          that.data.projectManager = ProjectManager;
          that.data.projectManagerID = ProjectManagerID;
          that.data.projectId = MyId;
          that.data.constructionUnitId = ConstructionUnitID;
        },
      });
    },
  },
};
</script>

<style  lang="scss" scoped>
.app-main {
  min-width: 1200px;
}
.typebtn {
  padding: 10px 0;
}
::v-deep .tableheader th {
  background: #f6f6f6;
}
.projectInfo {
  width: 100%;
  padding: 10px 20px;
  box-sizing: border-box;
  background-color: #fff;
  border-top: 10px solid #eee;
  box-sizing: border-box;
  .release-box {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    flex-direction: column;
    width: 100%;
    padding: 10px 0;
    .release {
      display: flex;
      justify-content: space-between;
      vertical-align: middle;
      height: 46px;
      line-height: 46px;
      align-items: center;
      width: 100%;
      padding: 0;
      background: #fff;
      .left,
      .center,
      .right {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        height: 46px;
        line-height: 46px;
      }
      .left {
        width: 25%;
        flex-shrink: 0;
        justify-content: flex-end;
      }
      .center,
      .right {
        width: 35%;
        flex-shrink: 1;
        // justify-content: center;
        justify-content: flex-start;
        margin-left: 80px;
      }
      .left p,
      .center p,
      .right p {
        font-size: 14px;
        list-style: 30px;
        font-weight: bold;
      }
      .center span,
      .right span {
        font-size: 14px;
        list-style: 30px;
        font-weight: bold;
        padding: 0 5px;
        color: #56576c;
      }
      .center span:last-child,
      .right span:last-child {
        font-size: 12px;
        font-family: Arial, Helvetica, sans-serif;
        font-weight: normal;
      }
      .center i,
      .right i {
        font-size: 26px;
        color: #00bd3f;
      }
      .center i.el-icon-circle-close,
      .right i.el-icon-circle-close {
        font-size: 26px;
        color: #d10011;
      }
      .cente {
        display: flex;
        justify-content: flex-start;
        align-items: center;
      }
      .right {
        display: flex;
        justify-content: flex-start;
        align-items: center;
      }
    }
    .release:hover {
      background: #f8f8f8;
      border-radius: 46px;
    }

    .myicon {
      font-size: 16px;
    }
  }
  ::v-deep i.el-icon-circle-check {
    color: #00bd3f;
    font-size: 16px;
    margin-top: 6px;
  }
  ::v-deep i.el-icon-circle-close {
    color: #d10011;
    font-size: 16px;
    margin-top: 6px;
  }
  .title {
    font-size: 14px;
    color: #0099ff;
    line-height: 14px;
    text-align: left;
    margin: 5px auto;
    padding: 0 6px;
    box-sizing: border-box;
    font-weight: bold;
    border-left: 4px solid #0099ff;
  }
  ::v-deep .formData {
    padding: 10px 0;

    .el-form-item {
      width: 100%;
      display: flex;
      margin-bottom: 10px;
      .el-form-item__label {
        flex-flow: 0;
        flex-shrink: 0;
        min-width: 120px;
      }
      .el-form-item__content {
        width: 100%;
        flex-grow: 1;
        flex-shrink: 1;
        .el-input__inner {
          width: 100%;
          
        }
      }
    }
  }
}
</style>