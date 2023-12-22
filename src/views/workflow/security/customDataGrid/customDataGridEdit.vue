<template>

  <div class="f2bpm-page-dialog-layout f2bpm-page-right">
    <el-container>
      <el-header class="toolbar-header">
        <div id="normalModeToolbar" class="mt4">
          <el-button-group class="mr5" v-show="currentEditType == 'editForm'">
            <el-button size="mini" type="primary" v-if="formAction=='Add'" icon="fa fa-save" @click="submitForm()">保存</el-button>
            <el-button type="primary" icon="fa fa-save" v-if="formAction!='Add'&&formAction!='View'" size="mini" title="不关闭窗口" @click="submitForm('notclose')">保存</el-button>
            <el-button size="mini" type="danger" @click="closeEdit" icon="fa fa-minus-circle">关闭</el-button>
          </el-button-group>
          <el-button-group class="mr5" v-show="currentEditType == 'editJs'">
            <el-button size="mini" type="default" icon="fa   fa-save" @click="saveEditJscriptTemplate('save')">暂存并返回</el-button>
            <el-button size="mini" type="default" icon="fa   fa-undo" @click="saveEditJscriptTemplate('cancle')">取消并返回</el-button>
            <el-button size="mini" type="default" icon="icon icon-a-ziyuan58" @click="selectExtendEventFunctionName()"> 选择扩展JS方法</el-button>
            <el-button size="mini" type="default" icon="fa fa-magic" @click="javascriptFormatter()">美化JS脚本</el-button>
          </el-button-group>
          <el-button-group class="mr5" v-show="currentEditType == 'editTree'">
            <el-button size="mini" type="default" icon="fa   fa-save" @click="saveEditLeftTree('save')">暂存并返回</el-button>
            <el-button size="mini" type="default" icon="fa   fa-undo" @click="saveEditLeftTree('cancle')">取消并返回</el-button>
          </el-button-group>
          <el-button-group class="mr5" v-show="currentEditType == 'editForm'">
            <el-button size="mini" type="default" icon="fa fa-code" @click="editJscriptTemplate()">JS脚本</el-button>
            <el-button size="mini" type="default" icon="fa fa-tree" @click="editTree">左侧树</el-button>
            <el-button size="mini" type="default" v-if="formAction!='Add'" icon="fa fa-search" @click="openViewAddress()">查看列表</el-button>
            <el-button size="mini" type="default" icon="fa fa-cubes" @click="addToSystemResource()">添加到系统菜单</el-button>
          </el-button-group>
        </div>
      </el-header>
      <el-main style="padding: 3px; " class="form-widget-main">
        <el-form v-show="currentEditType == 'editTree'" ref="formRefEditTree" :rules="formRules" :model="leftTreeDef" size="small" class="f2bpm-editform" label-width="140px">
          <el-form-item label="分类来源">
            <el-select v-model="leftTreeDef.type">
              <el-option label="请选择" value="" />
              <el-option label="系统内置分类" value="category" />
              <!-- <el-option label="从指定表中取数据" value="customtable" /> -->
              <el-option label="从Controller中取" value="controller" />
            </el-select>
          </el-form-item>
          <el-form-item label="是否启用">
            <el-switch v-model="leftTreeDef.isEnabled" :inactive-value="0" :active-value="1" active-color="#13ce66" inactive-color="#DEDEDE" />
          </el-form-item>
          <el-form-item label="右侧列表分类所在字段">
            <el-input v-model="leftTreeDef.searchFieldName" placeholder="" style="width:280px" />
            <span class="font10 pl10">即右侧列表的哪个字段来过滤分类数据</span>
          </el-form-item>
          <el-form-item label="默认展开到第几级">
            <el-input-number v-model="leftTreeDef.expandedLevel" size="small" :min="0" :max="5" />
            <span class="font10 pl10">0代表展开所有</span>
          </el-form-item>
          <div v-if="leftTreeDef.type=='category'">
            <el-form-item label="分类分组标识KEY">
              <el-input v-model="leftTreeDef.groupKey" placeholder="" style="width:280px" />
              <span class="font10 pl10">分组可看点击菜单：流程辅助=>系统设置=>系统类别分组标识</span>
            </el-form-item>

            <el-form-item label="是否管理分类">
              <el-switch v-model="leftTreeDef.isCategoryManager" :inactive-value="0" :active-value="1" active-color="#13ce66" inactive-color="#DEDEDE" />
            </el-form-item>
          </div>
          <div v-if="leftTreeDef.type=='customtable'">
            <el-form-item label="指定数据库表名">
              <el-input v-model="leftTreeDef.tableName" placeholder="" />
            </el-form-item>
            <el-form-item label="id字段名">
              <el-input v-model="leftTreeDef.idFieldName" placeholder="" />
            </el-form-item>
            <el-form-item label="parent字段名">
              <el-input v-model="leftTreeDef.parentFieldName" placeholder="" />
            </el-form-item>
            <el-form-item label="title字段名">
              <el-input v-model="leftTreeDef.titleFieldName" placeholder="" />
            </el-form-item>
            <el-form-item label="sql过滤条件">
              <el-input v-model="leftTreeDef.sqlwhere" style="width: 80%;" placeholder="请填写简单的Sql查询条件，不允许有子查询" />
              <span class="fa fa-search font12 ml10" @click="selectSystemVars2('sqlwhere','leftTreeDef')">选择系统变量</span>
              <br><span class="font10">普通字符串变量使用“#变量名#” ，数值原型变量使用“$变量名$” </span>
              <br><span class="font10">Sql关键字替代词： 【s_and替代and】【s_or替代or】</span>
            </el-form-item>
          </div>

          <div v-if="leftTreeDef.type=='controller'">
            <el-form-item label="controller地址">
              <el-input v-model="leftTreeDef.controller" placeholder="填写你自己开发的后端地址如：" />
            </el-form-item>
          </div>
        </el-form>

        <el-form v-show="currentEditType == 'editForm'" ref="formRef" :rules="formRules" :model="data" size="small" class="f2bpm-editform" label-width="140px">
          <el-row>
            <el-col :span="12">
              <el-form-item label="列表分类" prop="CategoryCode">
                <treeselect v-model="data.CategoryCode" style="width:250px" placeholder="请选择分类" :default-expand-level="3" :multiple="false" :options="treeData" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item v-if="showGridType" label="列表类型" prop="GridType">
                <el-select v-model="data.GridType" @change="onGridTypeChangeDone" :disabled="true">
                  <el-option label="请选择" value="" />
                  <el-option label="普通查询列表" value="CustSearch" />
                  <el-option label="表单应用" value="WorkflowForm" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="列表标题" prop="DataGridTitle">
                <el-input v-model="data.DataGridTitle" placeholder="" @blur.native.capture="toPinYin('DataGridTitle','ConfigTableName')" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="列表编码" prop="ConfigTableName">
                <el-input :disabled="formAction=='Edit'" v-model="data.ConfigTableName" placeholder="" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item v-if="showWorkflowForm" label="表单应用" prop="FormTitle">
            <el-input v-model="data.FormTitle" placeholder="请选择表单应用">
              <template slot="append"><i class="fa fa-search cur" @click="onFrmKeySelect">选择</i>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item label="">
            <span @click="showInfo" class="fa fa-search font10">查看绑定信息</span>
            <div class="font10" v-if="isShowInfo">
              <span > <!--v-if="data.GridType=='WorkflowForm'"-->
                表单应用Key：<el-input style="width: 300px;" v-model="data.FormKey" placeholder="表单应用Key"></el-input>
                流程应用ID：<el-input style="width: 60px;" v-model="data.AppId"></el-input>
              </span>
              物理表名：<el-input style="width: 200px;" v-model="data.ViewTableName" placeholder="物理表名"></el-input>
              <span> <!--v-if="data.GridType=='WorkflowForm'"-->
                子表表名：<el-input style="width:150px;" v-model="data.SubTableName" placeholder="子物理表表名"></el-input>
              </span>
              <span class="font10"> <!--v-if="data.GridType=='WorkflowForm'"-->
                （物理表名修改为视图时必须以"vw_"作为视图名前缀并且视图中必须包含主表中的所有字段，明细表的MyId约定使用as语法重命名为"SubMyId"）
              </span>
            </div>
          </el-form-item>
          <el-form-item v-if="data.GridType=='CustSearch'" label="表/视图/mapkey" prop="ViewTableName">
            <el-input v-model="data.ViewTableName" placeholder="可以是数据库表名、视图名、MyBatis的MapKey" :disabled="formAction!='Add'">
              <template slot="append"><i class="fa fa-search cur" v-if="formAction=='Add'" @click="selectDbTable('ViewTableName','all')">选择表或视图</i>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item v-if="false" label="主表名" prop="DataMainTableName">
            <el-input v-model="data.DataMainTableName" placeholder="主表名">
              <template slot="append"><i class="fa fa-search cur" @click="selectDbTable('DataMainTableName','outtable')">选择数据库表</i>
              </template>
            </el-input>
          </el-form-item>

          <el-row>
            <el-col :span="8">
              <el-form-item label="默认排序字段" prop="SortName">
                <el-input v-model="data.SortName" placeholder="默认排序字段" class="textAutoBoxLong65" />
                <a id="tableSelector" href="javascript:void(0)" class="font12" role="button" @click="selectDbColumn()"><i class="fa fa-search">选择字段</i></a>
                <a href="javascript:void(0)" role="button" class="font12 red" @click="clearSelect('','SortName','')"><i class="fa fa-remove">清空</i></a>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="排序方向" prop="SortOrder">
                <el-select v-model="data.SortOrder">
                  <el-option label="降序" value="desc" />
                  <el-option label="升序" value="asc" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="数据方式" prop="DataSourceName">
                <el-select v-model="data.DataSourceName">
                  <el-option label="默认" value="" />
                  <el-option v-for="item in dataSourceNameList" :label="item.title" :value="item.value" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="8">
              <el-form-item label="是否启用权限" prop="IsEnableAuthor">
                <el-switch v-model="data.IsEnableAuthor" :active-value="1" :inactive-value="0" active-color="#13ce66" inactive-color="#DEDEDE" >
                </el-switch>
              </el-form-item>
            </el-col>
          </el-row>


          <el-form-item label="配置过滤条件" prop="DefaultWhere">
            <a class="btn btn-sm btn-white btn-info btn-bold" @click="dbfieldWhereSelect"> <i class="ace-icon fa fa-pencil  bigger-120  " /> 编辑过滤条件</a>
          </el-form-item>

          <el-form-item label="Sql过滤条件" prop="DefaultWhere">
            <el-input v-model="data.DefaultWhere" style="width: 80%;" placeholder="请填写Sql语句条件" />
            <span class="fa fa-search font12 ml10" @click="selectSystemVars('DefaultWhere')">选择系统变量</span>
            <br><span class="font10">普通字符串变量使用“#变量名#” ，数值原型变量使用“$变量名$” ，URL参数变量使用“@变量名”,@参数为无符号原值替换，如需字符串查询时，需自行添加单引号如“'@变量名'”</span>
            <br><span class="font10">Sql关键字替代词： 【s_and替代and】【s_or替代or】</span>
          </el-form-item>

          <el-form-item label="扩展后台过滤条件" prop="DefaultWhereAssembly">
            <el-input v-model="data.DefaultWhereAssembly" style="width: 80%;" placeholder="由扩展插件Java类返回过滤条件的sql,填写含类包路径全名称;示例参考：DemoDefaultWhereAssembly.java" />
          </el-form-item>

          <el-form-item label="是否加入过滤条件" prop="DefaultWhereIsJoinAssembly">
            <el-input v-model="data.DefaultWhereIsJoinAssembly" style="width: 80%;" placeholder="由扩展插件Java类判断是否加入过滤条件,填写含类包路径全名称。不填写时默认为是;示例参考DemoDefaultWhereIsJoinAssembly.java" />
          </el-form-item>

          <el-form-item label="是否启用">
            <el-row>
              <el-col :span="4">
                <el-form-item label="是否启用工具栏">
                  <el-switch v-model="data.ShowToolbar" active-color="#87DC48" :active-value="1" :inactive-value="0" inactive-color="#DEDEDE" />
                </el-form-item>
              </el-col>
              <el-col :span="4">
                <el-form-item label="是否启用删除">
                  <el-switch v-model="data.IsDelete" active-color="#87DC48" :active-value="1" :inactive-value="0" inactive-color="#DEDEDE" />
                </el-form-item>
              </el-col>
              <el-col :span="4">
                <el-form-item label="启用复选框">
                  <el-switch v-model="data.ShowCheckBox" active-color="#87DC48" :active-value="1" :inactive-value="0" inactive-color="#DEDEDE" />
                </el-form-item>
              </el-col>
              <el-col :span="4">
                <el-form-item label="新增发起流程">
                  <el-switch v-model="data.IsEnableStartFlow" active-color="#87DC48" :active-value="1" :inactive-value="0" inactive-color="#DEDEDE" />
                  <span class="font10">(仅流程表单)</span>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item label="操作列按钮：">
            <el-row>
              <el-col :span="4">
                <el-form-item label="操作查看">
                  <el-switch v-model="OperationAction_temp.ShowView" active-color="#87DC48" inactive-color="#DEDEDE" />
                </el-form-item>
              </el-col>
              <el-col :span="4">
                <el-form-item label="操作列编辑">
                  <el-switch v-model="OperationAction_temp.ShowEdit" active-color="#87DC48" inactive-color="#DEDEDE" />
                </el-form-item>
              </el-col>
              <el-col :span="4">
                <el-form-item label="操作列删除">
                  <el-switch v-model="OperationAction_temp.ShowDelete" active-color="#87DC48" inactive-color="#DEDEDE" />
                </el-form-item>
              </el-col>
              <el-col :span="4">
                <el-form-item label="查看办理过程">
                  <el-switch v-model="OperationAction_temp.ShowWfMap" active-color="#87DC48" inactive-color="#DEDEDE" /><span class="font10">(仅流程表单)</span>
                </el-form-item>
              </el-col>
              <el-col :span="4">
                <el-form-item label="查看流程图">
                  <el-switch v-model="OperationAction_temp.ShowWfApproadList" active-color="#87DC48" inactive-color="#DEDEDE" /><span class="font10">(仅流程表单)</span>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item label="工具栏按钮">
            <el-row>
              <el-col :span="4">
                <el-form-item label="工具栏新增">
                  <el-switch v-model="ToolBarDefaultButtons_temp.ShowAdd" active-color="#87DC48" :active-value="1" :inactive-value="0" inactive-color="#DEDEDE" />
                </el-form-item>
              </el-col>
              <el-col :span="4">
                <el-form-item label="工具栏删除">
                  <el-switch v-model="ToolBarDefaultButtons_temp.ShowDelete" active-color="#87DC48" :active-value="1" :inactive-value="0" inactive-color="#DEDEDE" />
                </el-form-item>
              </el-col>
              <el-col :span="4">

              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item label="自定义按钮">
            <div>
              <a class="btn btn-sm btn-white btn-info  " @click="customButtonSelect('ToolBarCustomButton','min','工具栏按钮')"> <i class="icon icon-mulu" />工具栏自定义按钮</a>
              <a class="btn btn-sm btn-white btn-info  ml5" @click="customButtonSelect('OperationCustomButton','min','自定义操作列按钮')"> <i class="icon icon-jihuaweihu" />操作列自定义按钮</a>

              <a v-if="formAction=='Edit'" class="btn btn-sm btn-white btn-info ml5" @click="editFormPermission()"> <i class="icon icon-xinzengquanxian2" />按钮权限</a>
            </div>
          </el-form-item>
          <el-form-item label="备注">
            <el-input v-model="data.Remark" type="textarea" :rows="4" placeholder="" />
          </el-form-item>
          <el-form-item label="显示地址Url">
            带框架列表页，一般用于系统菜单，注意需要将code填写到菜单的“业务编码”中
            <span id="sysMenu">/workflow/security/customDataGrid/customDataGridView/?code=<span v-html="data.ConfigTableName" /> </span>

            <br>
            不带框架的纯内容列表页，一般用于有需要的iframe嵌入。
            <span id="sysMenu">/workflow/security/customDataGrid/customDataGridViewSingle/?code=<span v-html="data.ConfigTableName" /> </span>
          </el-form-item>
          <el-form-item v-if="isShowHeadContent" label="头部引用JS/CSS">
            <el-input v-model="data.HeadContent" type="textarea" :rows="4" placeholder="列表所在的Html页面head中引用JS/CSS文件" />
            <br>注：可使用#webpath#为站点名称作为占位符，示例：&lt;script src="#webpath#/resources/xxx/xxx.js"&gt; &lt;/script&gt;
          </el-form-item>
        </el-form>
        <div v-show="currentEditType == 'editJs'" id="editJscriptTemplateContainer" style="margin-left: 20px; height: 1000px; width: 98%;border:1px solid #e5e7eb;">
          <textarea id="editJscriptTemplateTextarea">{{ data.JsContent }}</textarea>
          <span><em class="em">强烈建议将脚本在本地的开发工具或notepad++等工具上编写好再复制粘贴到表单设计器</em></span>
        </div>
      </el-main>
    </el-container>
  </div>
</template>
<script>
  window.editorJS = null;
  export default {
    data() {
      return {
        leftTreeDef: {
          type: "category",
          isEnabled: true,
          groupKey: "",
          searchFieldName: "",
          expandedLevel:2,
          isCategoryManager: true,
          //指定表名
          tableName: "",
          //id字段所在字段名
          idFieldName: "",
          //上级字段名
          parentFieldName: "",
          //标题字段名
          titleFieldName: "",
          sqlwhere: "",
          //从自己开发的Controller中取
          controller: ""
        },
        currentEditType: "editForm",
        showGridType: true,
        showWorkflowForm: false,
        showCustSearch: false,
        onlyshow_WorkflowForm: true,
        isShowInfo: false,
        formAction: null,
        isShowJsContent: false,
        isShowHeadContent: false,
        //showWfMap:显示流程轨迹图，showWfApproadList：显示办理过程
        OperationAction_temp: { ShowEdit: false, ShowView: false, ShowDelete: false, ShowWfMap: false, ShowWfApproadList: false },
        ToolBarDefaultButtons_temp: { ShowAdd: 0, ShowDelete: 0 },
        treeData: [],
        dataSourceNameList: [],
        data: {
          Id: "",
          CategoryCode: null,
          GridType: 'CustSearch',
          DataGridTitle: '',
          ConfigTableName: '',
          FormTitle: '',
          ViewTableName: '',
          DataMainTableName: '',
          SortName: 'MyId',
          SortOrder: 'desc',
        IsEnableAuthor: 1,
          DefaultWhere: '',
          DefaultWhereOption: '',
          DefaultWhereAssembly: '',
          DefaultWhereIsJoinAssembly: '',
          ShowToolbar: 1,
          IsDelete: 0,
          ShowCheckBox: 0,
          IsEnableStartFlow: 1,
          IsEnableShowFlow: 0,
          OperationAction: '',
          ToolBarDefaultButtons: '',
          ToolBarCustomButton: '',
          OperationCustomButton: '',

          Remark: '',
          HeadContent: '',
          JsContent: '',
          OperationBeforeDeleteEvent: '',
          ToolBarAddEvent: '',
          Url: '',
          ColManageField: '',
          Height: '',
          DeletePostUrl: '',
          StartWorkflowUrl: '',
          OpenWorkflowUrl: '',
          IsSystem: 0,
          Options: '',
          SearchAreaCustomInputJsonArray: '',
          IdFieldName: '',
          BusinessKeyField: '',
          OperationDeleteEvent: '',
          OperationViewEvent: '',
          OperationAfterDeleteEvent: '',
          OperationEditeEvent: '',
          ToolBarBeforeDeleteEvent: '',
          OnlyMySearch: '',
          CreatorIdField: '',
          AppId: '',

          Creator: '',
          LastModifier: '',
          CreatedTime: '',
          LastModTime: '',
          TenantId: '',

          DbSourceCode: "",
          SubTableName: "",
          LeftTreeDef: ""
        },
        // stand:表单校验规则
        formRules: {
          DataGridTitle: [
            { required: true, validator: FUI.Validator.required }
          ],
          CategoryCode: [
            { required: true, message: '请选择分类' }
          ],
          GridType: [
            { required: true, validator: FUI.Validator.required }
          ],
          DataGridTitle: [
            { required: true, validator: FUI.Validator.required }
          ],
          ConfigTableName: [
            { required: true, validator: FUI.Validator.required },
            { required: true, validator: FUI.Validator.englishchar }
          ],
          SortName: [
            { required: true, validator: FUI.Validator.required }

          ]
        }
      };
    },
    created: function () {
      var that = this;
      const currUser = FUI.Sys.getAuthor();
      if (formAction == FUI.FormAction.Add) {
        var formKey = Object.toQueryString('formKey') || '';
        that.data.FormKey = formKey;
        that.data.Creator = decodeURI(currUser.realName);
        that.data.LastModifier = decodeURI(currUser.realName);
        that.data.CreatedTime = Object.toGetCurrentDateTimeString();
        that.data.LastModTime = Object.toGetCurrentDateTimeString();
        that.data.TenantId = currUser.tenantId;
        that.ShowToolbar = 1;
        if (formKey) {
          // 在线表单应用
          that.showGridType = false;
          that.data.GridType = 'WorkflowForm';
          that.data.FormKey = formKey;
          that.onGridTypeChangeDone('WorkflowForm');
          that.showWorkflowForm = false;
          that.OperationAction_temp = { ShowEdit: true, ShowView: true, ShowDelete: false };
          that.ToolBarDefaultButtons_temp = { ShowAdd: 1, ShowDelete: 1 };
        } else {
          that.onGridTypeChangeDone('CustSearch');
        }
      } else {
        that.data.LastModifier = decodeURI(currUser.realName);
        that.data.LastModTime = Object.toGetCurrentDateTimeString();
        that.showWorkflowForm = false;
      }

      that.formAction = formAction;
      that.keyId = keyId;
      that.loadTreeSelect();
      that.loadData();
      if (that.data.GridType == 'WorkflowForm') {
        that.loadTaskDataSourceName();
        if (formKey == "") {
          that.showWorkflowForm = true;
        }
      }
    },
    mounted() {
      editorJS = CodeMirror.fromTextArea(document.getElementById('editJscriptTemplateTextarea'), {
        mode: 'text/javascript',
        indentUnit: 2,
        smartIndent: true,
        tabSize: 4,
        readOnly: false,
        showCursorWhenSelecting: true,
        height: 20,
        lineNumbers: false,
        continueComments: 'Enter',
        extraKeys: {
          'Ctrl-B': 'toggleComment'
        }
      });
      //设置编辑器的大小
      editorJS.setSize($(window).width() - 50, $(window).height() - 80);
    },
    methods: {
      // ===stand:标准化方法============
      closeEdit() {
        // stand:关闭编辑窗口
        FUI.Window.closeEdit();
      },
      loadTaskDataSourceName() {
        var that = this;
        that.dataSourceNameList = [];
        //无流程表单不可做待办内联
        that.dataSourceNameList.push({ title: "内联待办事项", value: "todoList" });
        that.dataSourceNameList.push({ title: "内联已办事项", value: "doneList" });
        that.dataSourceNameList.push({ title: "内联我发起的", value: "myWorkItem" });
      }
      // ===stand:标准化方法结束============
      , loadData() {
        var that = this;
        if (formAction != FUI.FormAction.Add) {
          FUI.Form.bindDataToForm(that, FUI.Handlers.FuiFrameworkHandler, FUI.Method.AutoGetViewModelMethod, keyId, null, mainTable);
          if (that.data.OperationAction) {
            that.OperationAction_temp = eval('(' + that.data.OperationAction + ')');
          } else {
            that.OperationAction_temp = { ShowEdit: false, ShowView: false, ShowDelete: false };
          }
          if (that.data.ToolBarDefaultButtons) {
            that.ToolBarDefaultButtons_temp = eval('(' + that.data.ToolBarDefaultButtons + ')');
          } else {
            that.ToolBarDefaultButtons_temp = { ShowAdd: false, ShowDelete: false };
          }
        }
      },
      loadTreeSelect() {
        var that = this;
        var treeUrl = FUI.Handlers.CategoryHandler + '?groupKey=CustomDataGridGroup&needRoot=true';
        Object.toAjaxJson(treeUrl, null, null, true, null, function (res) {
          if (res.success) {
            that.treeData = res.data;
          } else {
            that.$message.error(
              res.msg
            );
          }
        });
      },
      editHeadContent() {
        this.isShowHeadContent = !this.isShowHeadContent;
      },
      editTree() {
        let that = this;
        that.currentEditType = 'editTree';
        if (that.data.LeftTreeDef) {
          that.leftTreeDef = eval("(" + that.data.LeftTreeDef + ")");
        }
      }
      , editJscriptTemplate() {
        var that = this;
        that.currentEditType = 'editJs';
        var js = $('#editJscriptTemplateTextarea').val();
        editorJS.setValue(js);
        setTimeout(function () {
          editorJS.setCursor(2);
        }, 300);
      },
      saveEditLeftTree(actionType) {
        var that = this;
        if (actionType == 'save') {
          that.data.LeftTreeDef = JSON.stringify(that.leftTreeDef);
        }
        that.currentEditType = 'editForm';
      }
      , saveEditJscriptTemplate(actionType) {
        var that = this;
        if (actionType == 'save') {
          var js = editorJS.getValue();
          that.data.JsContent = js;
        }
        that.currentEditType = 'editForm';
      },
      javascriptFormatter() {
        var that = this;
        var js = editorJS.getValue();
        var beauifyJs = js_beautify(js);
        editorJS.setValue(beauifyJs);
        that.data.JsContent = beauifyJs;
      },
      submitForm(type) {
        var that = this;
        that.data.OperationAction = JSON.stringify(that.OperationAction_temp);
        that.data.ToolBarDefaultButtons = JSON.stringify(that.ToolBarDefaultButtons_temp);
        if (that.data.formType == 'OnlineForm' && that.data.formDefId == '') {
          FUI.Window.showMsg(that, '请选择在线表单');
          return false;
        } else if (that.data.formType != 'OnlineForm') {
          that.data.formDefId = '';
          that.data.refFormDefName = '';
        }
        var success = that.validateForm('formRef');
        if (!success) return;
        if (type == 'notclose') {
          FUI.Form.submitForm(that, that.data, '/workflow/security/customDataGrid/', 'saveCustomDataGrid', formAction, keyId, parentGridId, null, null, null, null, function (res) {
            FUI.Window.showMsg(res.msg, null, res.success ? 1 : 7);
          });
        } else {
          FUI.Form.submitForm(that, that.data, '/workflow/security/customDataGrid/', 'saveCustomDataGrid', formAction, keyId, parentGridId, null);
        }

      },
      validateForm(refFormName) {
        // stand:表单校验
        var success = false;
        this.$refs[refFormName].validate(valid => {
          success = valid;
        });
        return success;
      },
      onGridTypeChangeDone(type) {
        var that = this;
        that.showWorkflowForm = false;
        that.showCustSearch = false;
        that['show' + type] = true;
        if (type == 'CustSearch') {
          that.onlyshow_WorkflowForm = false;
          that.dataSourceNameList = [];
        } else if (type == 'WorkflowForm') {
          that.onlyshow_WorkflowForm = true;
          that.dataSourceNameList = [];
          that.loadTaskDataSourceName();
        }
      },
      onFrmKeySelect(value) {
        // 选择表单应用
        WF.SelectorDialog.processFormSelector(this, 'FormKey', 'FormTitle');
      },
      selectDbTable(inputId, type) {
        var that = this;
        WF.SelectorDialog.selectDbTable(that, inputId, null, type, true);
      },
      addToSystemResource() {
        var that = this;
        if (that.formAction == FUI.FormAction.Add) {
          FUI.Window.showMsg(that, '当前是新增状态，请先保存后再打开本页面添加到菜单');
          return false;
        }
        Sys.SelectorDialog.selectResourceCallBack(function (data, index) {
          if (data) {
            var parentId = data[0].id;
            var title = that.data.DataGridTitle;
            var configTableName = that.data.ConfigTableName;
            var sysMenu = '/workflow/security/customDataGrid/customDataGridView/?code=' + configTableName;
            var res = Object.toAjaxJson('/admin/resource/', 'saveSample', {
              'resourceId': configTableName,
              'parentId': parentId,
              'name': title,
              'functionUrl': sysMenu,
              tenantId: that.data.TenantId

            });
            FUI.Window.showMsg(that, res.msg, null, res.success == true ? 1 : 7);
          }
        });
      },
      dbfieldWhereSelect() {
        var that = this;
        var formKey = '';
        if (that.data.GridType == 'WorkflowForm') {
          formKey = that.data.FormKey;
        }
        var dataMainTableName = that.data.DataMainTableName;
        WF.SelectorDialog.dbfieldWhereSelect(that, 'DefaultWhereOption', formKey, dataMainTableName);
      },
      toPinYin(sourceField, targetField) {
        if (!this.data[targetField]) {
          const source = this.data[sourceField];
          this.data[targetField] = Object.toPinYin(source);
        }
      },
      selectDbColumn() {
        var that = this;
        var formKey = '';
        if (that.data.GridType == 'WorkflowForm') {
          formKey = that.data.FormKey;
        }
        if (formKey == '' && that.data.GridType == 'WorkflowForm') {
          FUI.Window.showMsg(that, '请选择表单应用');
          return false;
        }
        var formKey = that.data.FormKey;
        if (that.data.DataMainTableName == '') {
          that.data.DataMainTableName = that.data.ViewTableName;
        }
        var dataMainTableName = that.data.DataMainTableName;
        if (dataMainTableName == '' && that.data.GridType != 'WorkflowForm') {
          FUI.Window.showMsg(that, '请选择数据表');
          return false;
        }
        WF.SelectorDialog.dbfieldSelect(that, formKey, dataMainTableName, 'SortName');
      },
      selectExtendEventFunctionName() {
        var that = this;
        var parm = {
          singleSelect: true,
          data: []
        };
        FUI.dialog(__webpath + '/workflow/security/customDataGrid/selectCustomDataGridExtendEvent', '选择自定义列表的扩展JS方法', parm, 500, 620, function (objectData, index, layer) {
          if (objectData == false) {
            return false;
          }
          if (objectData.length == 1) {
            var fieldName = objectData[0].value;
            var fieldTitle = objectData[0].text;
            var descript = objectData[0].descript;
            var content = objectData[0].content;
            console.info(objectData[0]);
            var func = 'function ' + fieldName + '{\r\n //' + fieldTitle + '  ' + descript + '\r\n console.info(field);}';
            if (content) {
              func = 'function ' + fieldName + '{\r\n //' + fieldTitle + '  ' + descript + '\r\n' + content + ';}';
            }

            var js = editorJS.getValue() + func;
            var beauifyJs = js_beautify(js);
            editorJS.setValue(beauifyJs);
          } else if (objectData.length > 1) {
            FUI.Window.showMsg2('每次只能选择一个字段函数');
          }
          layer.close(index);
        }, true);
      },
      clearSelect(intputId, inputId2) {
        this.data[intputId] = '';
        this.data[inputId2] = '';
      },
      customButtonSelect(inputId, type, title) {
        WF.SelectorDialog.customButtonSelect(this, inputId, type, title, this.optionItems);
      },
      selectSystemVars(inputId) {
        WF.SelectorDialog.selectSystemVars(this, inputId, null, true);
      },
      selectSystemVars2(inputId, vueObjName) {
        let vueDataObj = this[vueObjName];
        WF.SelectorDialog.selectSystemVars(this, inputId, null, true, true, vueDataObj);
      },
      openViewAddress() {
        var that = this;
        var configTableName = that.data.ConfigTableName;
        var url = __webpath + '/workflow/security/customDataGrid/customDataGridView/?code=' + configTableName;
        FUI.Window.open(url, '_blank');
      },
      publishRemoteSystem() {
        var that = this;
        var configTableName = that.data.ConfigTableName;
        var sysMenu = '/workflow/security/customDataGrid/customDataGridView/?code=' + configTableName;
        var data = FUI.Sys.getServiceData('PublishCustDataGridMenu', { menuUrl: sysMenu });
        FUI.Window.showMsg(that, data.msg);
      },
      editFormPermission() {
        var that = this;
        var id = that.data.Id;
        var title = that.data.DataGridTitle;
        var url = __webpath + '/workflow/smartForm/formPermission/formFieldListPermissions/?rightType=customDataGrid&formKey=' + id;
        FUI.Window.open(url);
      },
      showInfo() {
        this.isShowInfo = !this.isShowInfo;
      }
    }
  }
</script>
