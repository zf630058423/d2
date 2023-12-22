<template>
  <div class="f2bpm-page-dialog-layout">
    <div id="box" class="line" style="width: 100%;overflow: hidden;color: rgb(92, 90, 90);line-height: 20px;">
      <div class="fence-box result-boxlist" style="width: 180;height: 410px; padding: 5px;overflow: hidden;">
        <div style="text-align: left; padding-left: 10px;">
          <i class="fa fa-magic" />迁移条件类型：
        </div>
        <div id="listDiv" class="line" style="height: 340px; width: 160px;overflow: scroll">
          <ul id="resultList" class="fence-inner-line" title="可上下拖动排序">
            <li v-for="itemCondition in dataResult " :class="itemCondition.selected==true?'selected':''" :conditionid="itemCondition.ConditionId" @click="onClickLi(itemCondition,this)">
              <i class="fa fa-arrows-v" />
              <span v-html="itemCondition.Description" />
            </li>
          </ul>
        </div>
        <div style="text-align: center;margin-top: 10px;">
          <a id="addItem" href="javascript:void(0);" role="button" class="btn btn-primary btn-sm mr2" @click="addItem"><i class="fa fa-plus" />添加</a> <a id="delete" href="javascript:void(0);" role="button" class="btn btn-primary btn-sm mr2" @click="deleteItem()"><i class="fa fa-minus-circle" />移除</a>
        </div>
      </div>
      <div class="fence-box" style="text-align: left; width: 640px; height: 410px;">
        <div>
          迁移条件类型：
          <el-select ref="dropConditionTypeSelect" v-model="data.ConditionType" :disabled="conditionTypeDesiable" size="mini" @change="conditionTypeSelectChange">
            <el-option value="" label="无" />
            <el-option value="FormField" label="表单字段" />
            <el-option value="Role" label="角色身份条件" />
            <el-option value="Org" label="组织部门条件" />
            <el-option value="OrgLevel" label="组织级别标签" />
            <el-option value="SQL" label="SQL迁移条件" />
            <el-option value="JS" label="JS自定义脚本" />

            <el-option value="ProcVarsExpress" label="流程变量表达式" />
            <el-option value="ApproAction" label="审核菜单" />
            <el-option value="Assembly" label="自定义插件类" />
            <el-option value="Java" label="Java脚本" />
            <el-option value="Rest" label="数据服务Rest接口" />
          </el-select>
          <el-button size="mini" class="ml2" type="success" @click="saveRight"><i class="fa fa-save" />保存</el-button>
        </div>
        <div id="FormField_Div">
          <table class="common-FormTable">
            <tr>
              <td style="width: 50px;">描述：</td>
              <td>编辑在线表单字段条件。最终结果返回布尔类型的true或false;
              </td>
            </tr>
            <tr>
              <td>字段条件：</td>
              <td>
                <div class="p5">
                  <a class="btn btn-minier btn-white btn-info btn-bold font8" @click="buildFormFieldCondition">
                    <i class="ace-icon fa fa-pencil  bigger-120 blue" /> 编辑表单字段条件
                  </a>
                </div>
                <div id="result-boxlist" class="right-result-boxlist" style="min-height: 150px;">
                  <ul id="listResult">
                    <li v-for="(item,index) in data.FormFieldCondition" class="fence-li-item" :tabIndex="index" :value="item.FieldName">
                      <input type="button" disabled="disabled" :value="index" class="fence-li-index">{{ item.FieldTitle }} {{ operatorToText(item.Operator) }} {{ item.ComparValue }} {{ andOrCharText(item.AndOrChar) }}
                    </li>
                  </ul>
                </div>
              </td>
            </tr>
          </table>
        </div>

        <div id="JS_Div">
          <table class="common-FormTable">
            <tr>
              <td>JavaScript脚本描述：</td>
              <td>
                <span class="icon icon_help font10 cur ml5 " title="展开/收起" @click="inputHelper('JavaScript_helper')"><i class="fa fa-question-circle-o" />查看填写说明</span>
                <div id="JavaScript_helper" style="display: none">

                  JavaScript或Jquerye脚本<br>
                  JS自定义条件只支持弹窗选择模式<br>
                  流程表单页面中的流程上下文JS变量【WFContext】，表单数据变量【WFFormData】<br>
                  只要最终结果返回布尔类型的true或false;
                  <br> 注：ctrl+q 可快速“注释/去除注释”脚本

                </div>

              </td>
            </tr>
            <tr>
              <td>脚本：</td>
              <td>
                <div class="p2">
                  <a class="btn btn-minier btn-white btn-info btn-bold font8" @click="buildFormCondition">
                    <i class="ace-icon fa fa-pencil  bigger-120 blue" /> 编辑表单字段条件
                  </a>
                </div>
                <textarea id="JSCondition" class="textBoxLong" style="height: 150px; font-size: 18px;" />
              </td>
            </tr>
          </table>
        </div>
        <div id="ProcVarsExpress_Div">
          【流程变量表达式条件】：<br>
          <table class="common-FormTable">
            <tr>
              <td>流程变量描述：</td>
              <td>
                <span class="icon icon_help font10 cur ml5 " title="展开/收起" @click="inputHelper('ProcVarsExpress_helper')"><i class="fa fa-question-circle-o" />查看填写说明</span>
                <div id="ProcVarsExpress_helper" style="display: none">
                  由开发人员传入自定义的变量及值(或在线表单的字段名如：实体名.字段名 Holiday.Days)，<br>
                  运行时替换这些变量为传入的值组成的Java语言动态代码进行动态运行计算。<br>
                  例如传入的变量Json格式：[{"key":"Count","value":"500"},{"key":"BuType","value":"A"}]这里传入自定义了两个变量及值。<br>
                  流程实例在运行时会根据变更名获取对应的值进行变量替换。<br>
                  注意大小写区分 由Java变量组成运算表达式，运算表达式使用Java语法，<br>
                  变量使用#字符串或$非字符串包起来，如#Key#、$Key$。如：$Count$>5&&#BuType#.equals("A"),<br>
                  流程运行时将会把变量替换成值，执行的结果是：500>5&&"A".equals("A"),返回结果为：true;
                </div>
              </td>
            </tr>
            <tr>
              <td>流程变量表达式：</td>
              <td>
                <a id="math" role="button" class="btn btn-purple btn-xs mr2" @click="editVarsExpress('ProcVarsExpressCondition')"><i class="fa fa-edit" />编辑条件变量表达式</a>
                <div class="space-4" />
                <el-input v-model="data.ProcVarsExpressCondition" style="width:500px" type="textarea" :rows="4" placeholder="" />
              </td>
            </tr>
          </table>
        </div>
        <div id="SQL_Div">
          【SQL迁移条件】：<br>
          <table class="common-FormTable">
            <tr>
              <td>SQL脚本说明：</td>
              <td>
                <span class="icon icon_help font10 cur ml5 " title="展开/收起" @click="inputHelper('sql_helper')"><i class="fa fa-question-circle-o" />查看填写说明</span>
                <div id="sql_helper" style="display: none">
                  1、可使用接口传入的流程变量和持久化的流程变量。<br>2、可使用表单仅主表字段（可不带实体名）作为变量。<br>3、可用到的流程上下文变量：<br>[#Wiid#:流程实例ID][#AppId#:流程应用ID][#FormId#:表单业务键ID],[#ActivityCode#:当前环节编码],[#ActivityName#:当前环节编码],[#CurrentUserId#:当前登录用户Id],[#CurrentUserName#:当前用户登录账号],[#CurrentOrgId#:当前登录用户Id],[#CurrentRealName#:当前登录用户姓名] <br> [SQL语句示例：select 1(这里也可以使用true的字符串) from Atable where AWiid=#Wiid#] <br>[格式： <em>select 1或者'true' from XXX where XXX=#Wiid#]</em><br> 整个SQL查询结果只需要返回首行首列，且首行首列的值结果是字符串true或false或者数字1和0; <br> 如果Sql查无数据，结果则为false; true或1表示可迁移，返回false或0表示此不可迁移。
                </div>
              </td>
            </tr>
            <tr>
              <td>SQL脚本：</td>
              <td><textarea id="SQLCondition" class="textBoxMultiLineLong" style="height: 30px;" /></td>
            </tr>
          </table>
        </div>
        <div id="Assembly_Div" class="line">
          【自定义插件类迁移条件】：<br>
          <el-input v-model="data.AssemblyCondition" size="mini" placeholder="填写Java类的完整路径" />
          填写格式：[类全名，包括名的路径],自定义参数可在扩展参数中填写<br>
          示例：com.f2bpm.demo.customExtension.DemoAssemblyCondition
        </div>
        <div id="Java_Div">
          【Java脚本】：<br>
          <table class="common-FormTable">
            <tr>
              <td>描述：</td>
              <td>
                <span class="icon icon_help font10 cur ml5 " title="展开/收起" @click="inputHelper('Java_helper')"><i class="fa fa-question-circle-o" />查看填写说明</span>
                <div id="Java_helper" style="display: none">
                  Java脚本是指可被Groovy可执行的Java代码。
                  代码中可使用流程上下文：1、wfContext; 2、引擎API总入口：WorkflowAPI 3、当前请求对象 request对象，4、WfWebHelper工具类
                  </br> 示例：wfContext.getCurrentUser().getAccount().equals("admin");
                  </br> 获取表单Post请求值：request.getParameter("amount")
                  </br> 获取表单Post表单中的金额字段值： </br> 【获取int值：WfWebHelper.queryInt("amount");】</br> 【 字符串： WfWebHelper.query("amount")】 </br> 【 布尔值：WfWebHelper.queryBoolean("amount");】</br> 【 浮点值：WfWebHelper.queryLong("amount");】 <br> <em>注意：</em>整个Java脚本最终 返回true表示可迁移，返回false表示此迁移不用通行。
                </div>
              </td>
            </tr>
            <tr>
              <td>Java脚本：</td>
              <td><textarea id="JavaCondition" class="textBoxMultiLineLong" style="height: 150px; font-size: 18px;" /></td>
            </tr>
          </table>
        </div>
        <div id="Role_Div">
          【角色身份迁移条件】：<br>
          <table class="common-FormTable">
            <tr>
              <td>角色身份条件说明：</td>
              <td>角色身份条件是指通过配置指定的角色，当用户拥有这些角色中的其中任意一个或多个时则条件结果为true,当前处理人不拥有任何一个配置中的角色，即条件结果为false <br> 返回true表示可迁移，返回false表示此迁移不用通行。
              </td>
            </tr>
            <tr>
              <td>角色：</td>
              <td>

                <el-input v-model="data.RoleCondition" size="mini" :disabled="true" placeholder="请选择角色" />
                </br> <a id="selectRoles" href="javascript:void(0)" title="选择角色" @click="selectorTextValue('condition', 'RoleCondition', 'Role')"><i class="fa fa-search" />选择角色</a> <a id="clearEmpty2" href="javascript:void(0)" @click="clearConditionAndDes('Role')"><i class="fa fa-minus-circle" aria-hidden="true" />清空</a>
                <a id="clearEmpty2" href="javascript:void(0)" @click="showInputParam('condition')"><i class="fa fa-search ml5" aria-hidden="true" />查看值</a>
              </td>
            </tr>
          </table>

        </div>
        <div id="Org_Div">
          【组织部门身份迁移条件】：<br>
          <table class="common-FormTable">
            <tr>
              <td>组织部门身份条件说明：</td>
              <td>组织部门身份条件是指通过配置指定的组织，当前登录用户在这些组织部门【包括其所有子部门】中的其中任意一个或多个时则条件结果为true,当前处理人不拥有任何一个配置中的组织部门【部门包括其所有子部门】，即条件结果为false <br> 返回true表示可迁移，返回false表示此迁移不用通行。
              </td>
            </tr>
            <tr>
              <td>组织部门：</td>
              <td>
                <el-input v-model="data.OrgCondition" size="mini" :disabled="true" placeholder="请选择组织部门" />
                </br>
                <a id="selectDepart" href="javascript:void(0)" class="fa fa-search" title="选择部门" @click="selectorTextValue('condition','OrgCondition','Org')">选择部门</a> <a id="clearEmpty2" href="javascript:void(0)" @click="clearConditionAndDes('Org')"><i class="fa fa-minus-circle" aria-hidden="true" />清空</a>
                <a id="clearEmpty2" href="javascript:void(0)" @click="showInputParam('condition')"><i class="fa fa-search ml5" aria-hidden="true" />查看值</a>
              </td>
            </tr>
          </table>
        </div>
        <div v-if="data.ConditionType=='OrgLevel'">
          【组织级别标签迁移条件】：<br>
          <table class="common-FormTable">
            <tr>
              <td>组织级别标签条件说明：</td>
              <td>组组织级别标签条件是指通过配置指定组织级别标签，当前待办人登录的组织是标签中任意一个时结果为true,当前待办人不拥有任何一个配置中的组织级别标签，即条件结果为false <br> 返回true表示可迁移，返回false表示此迁移不用通行。
              </td>
            </tr>
            <tr>
              <td>组织级别标签：</td>
              <td>
                <el-input v-model="data.OrgLevelCondition" size="mini" :disabled="true" placeholder="请选择组织级别标签" />
                </br>
                <a id="selectDepart" href="javascript:void(0)" class="fa fa-search" title="选择标签" @click="selectRelationType('condition','OrgLevelCondition','orgLevel')">选择标签</a> <a id="clearEmpty2" href="javascript:void(0)" @click="clearConditionAndDes('OrgLevel')"><i class="fa fa-minus-circle" aria-hidden="true" />清空</a>
                <a href="javascript:void(0)" @click="showInputParam('condition')"><i class="fa fa-search ml5" aria-hidden="true" />查看值</a>
              </td>
            </tr>
          </table>
        </div>
        <div id="ApproAction_Div">
          【审核菜单迁移条件】：<br>
          <table class="common-FormTable">
            <tr>
              <td>条件说明：</td>
              <td>通过用户选择的审核菜单来决定迁移是否可转移<br>只能包含任意一个审核菜单，即为true，否则为false。api调用时请传入：流程变量并且 使用固定的key:processVarApproAction
              </td>
            </tr>
            <tr>
              <td>审核菜单：</td>
              <td>
                <el-input v-model="data.ApproActionCondition" size="mini" :disabled="true" placeholder="请选择审核菜单" />
                </br> <a id="selectDepart" href="javascript:void(0)" class="fa fa-search" title="选择审核菜单" @click="selectApproAction">选择审核菜单</a> <a id="clearEmpty2" href="javascript:void(0)" @click="clearConditionAndDes('ApproAction')"><i class="fa fa-minus-circle" aria-hidden="true" />清空</a>
                <a href="javascript:void(0)" @click="showInputParam('condition')"><i class="fa fa-search ml5" aria-hidden="true" />查看值</a>

              </td>
            </tr>
          </table>
        </div>
        <div v-if="data.ConditionType=='Rest'">
          【数据服务Rest迁移条件】：<br>
          <table class="common-FormTable">
            <tr>
              <td style="width: 100px;">条件说明：</td>
              <td>系统通过调用数据服务Rest接口来判断是否条件成立。
              </td>
            </tr>
            <tr>
              <td>数据服务：</td>
              <td class="p5">
                <el-input v-model="data.RestCondition" size="mini" :disabled="true" placeholder="请选择数据服务Rest接口" />
                </br>
                <a id="selectDataService" href="javascript:void(0)" title="选择数据服务" @click="selectDataService('condition','RestCondition')"><i class="fa fa-search" />选择数据服务</a>
                <a href="javascript:void(0)" @click="showInputParam('condition')"><i class="fa fa-search ml5" aria-hidden="true" />查看值</a>
              </td>
            </tr>
          </table>
        </div>
        <div class="line">
          【扩展参数】：<br>
          <el-input v-model="data.ExtendParms" clearable size="mini" placeholder="扩展参数为开发者技术一种参数填写的入口，将原样传入到对应的解析器中" />
        </div>
        <div id="LogicCalc_Div" style="border: solid 1px #ccc; width: 98%;   margin-left: 2px; padding: 5px;">
          <div v-if="data.ConditionType!='JS'" class="mb4">
            是否求反：<select id="Reverse" class="textBoxMinShort" name="Reverse">
              <option value="0">否</option>
              <option value="1">是</option>
            </select>（是否将本条件结果求反）
          </div>
          <div class="mb4">
            运算符号：<select id="LogicCalc" class="textBoxMinShort" name="LogicCalc">
              <option value="and">并且</option>
              <option value="or">或者</option>
            </select> （与当前结果的运算，每个条件计算完成之后又产生新的结果作为当前结果）
          </div>
          <div>
            条件描述：<input id="Des" name="Des" class="textBoxLong" style="width:90%;height:25px;margin-top: 3;" type="text">
          </div>
        </div>
      </div>
    </div>
    <div class="dialogfooter">
      <a role="button" href="javascript:void(0)" class="btn btn-primary btn-sm mr2" @click="save()"><i class="fa fa-save" />确定</a>
      <a role="button" href="javascript:void(0)" class="btn  btn-sm btn-primary " @click="closeEdit()"><i class="fa fa-minus-circle" />取消</a>
    </div>
  </div>
</template>

<script>
  window.editorSQL = null;
  window.editorJS = null;
  window.editorJava = null;
  export default {
    data() {
      return {
        value: '',
        wid: '',
        fromActivityId: "",
        toActivityId: "",
        transitionId: "",
        attrName: '',
        currentConditionType: '',
        dataResult: [],
        conditionTypeDesiable: false,
        // 当前编辑的Data
        data: {
          ConditionType: '',
          ConditionId: '',
          ExtendParms: '',
          condition: '',
          SQLCondition: '',
          ProcVarsExpressCondition: '',
          JSCondition: '',
          // 临时存放的字条对象条件
          FormFieldCondition: [],
          // 临时的JS内容
          JavaCondition: '',
          // 存的是Text的文本描述
          OrgCondition: '',
          // 存的是Text的文本描述
          OrgLevelCondition: '',
          // 存的是Text的文本描述
          ApproActionCondition: '',
          // 存的是Text的文本描述
          RestCondition: '',
          // 存的是Text的文本描述
          RoleCondition: '',
          AssemblyCondition: ''
        }
      };
    },
    created: function () {
      var that = this;
      var obj = parent.window.currentWindowTargetObjectValue;
      var parm = Object.toStringToJson(obj.otherParm);
      var title = obj.title;
      var value = obj.value;
      var wid = parm.wid;
      var fromActivityId = parm.fromActivityId;
      var toActivityId = parm.toActivityId;
      var transitionId = parm.transitionId;
      var attrName = obj.name;
      that.attrName = attrName;
      that.wid = wid;
      that.fromActivityId = fromActivityId;
      that.toActivityId = toActivityId;
      that.transitionId = transitionId;
      that.value = value;
    },
    mounted() {
      var that = this;
      that.loadEditor();
      that.bindXmlToResultList(that.value);
      $('#resultList').sortable({
        placeholder: 'ui-state-highlight'
      });
    },
    methods: {
      loadEditor() {
        editorJS = CodeMirror.fromTextArea(document.getElementById('JSCondition'), {
          mode: 'text/javascript',
          indentUnit: 2,
          smartIndent: true,
          tabSize: 4,
          readOnly: false,
          showCursorWhenSelecting: true,
          height: 20,
          lineNumbers: true,
          continueComments: 'Enter',
          extraKeys: {
            'Ctrl-Q': 'toggleComment'
          }
        });
        editorJS.setSize(400, 150);

        editorSQL = CodeMirror.fromTextArea(document.getElementById('SQLCondition'), {
          mode: 'text/x-sql', // 模式
          // theme : "",  // CSS样式选择
          indentUnit: 2, // 缩进单位，默认2
          smartIndent: false, // 是否智能缩进
          tabSize: 4, // Tab缩进，默认4
          readOnly: false, // 是否只读，默认false
          showCursorWhenSelecting: true,
          lineNumbers: true
        });

        editorSQL.setSize(400, 150);

        editorJava = CodeMirror.fromTextArea(document.getElementById('JavaCondition'), {
          mode: 'text/javascript', // 模式
          // theme : "",  // CSS样式选择
          indentUnit: 2, // 缩进单位，默认2
          smartIndent: false, // 是否智能缩进
          tabSize: 4, // Tab缩进，默认4
          readOnly: false, // 是否只读，默认false
          showCursorWhenSelecting: true,
          lineNumbers: true
        });
        editorJava.setSize(400, 150);
      },
      conditionTypeSelectChange(v) {
        var that = this;
        that.clearConditionAndDes(v);
        that.currentConditionType = v;
        that.changeConditionType(v);
      },
      // ===stand:标准化方法============
      closeEdit() {
        // stand:关闭编辑窗口
        FUI.Window.closeEdit();
      },
      // ===stand:标准化方法结束============
      bindXmlToResultList(conditionStr) {
        var that = this;
        var type = '';
        var logicCalc = '';
        if (conditionStr == '') {
          that.data.ConditionType = '';
          that.changeConditionType('', false);
          $('#LogicCalc_Div').hide();
          return false;
        }
        if (conditionStr != '' && conditionStr.indexOf('<Conditions>') <= -1) {
          that.data.condition = conditionStr;
          type = 'JS';
        } else {
          var xmlStr = conditionStr.replace(/&/g, '※');
          var xmlDoc = Object.toCreateXmlDoc(xmlStr, true);
          $(xmlDoc).find('Conditions>Condition').each(function () {
            type = $(this).attr('Name');
            logicCalc = $(this).attr('LogicCalc') || '';
            var reverse = $(this).attr('Reverse') || '0';
            var conditionId = $(this).attr('ConditionId') || Object.toGuid();
            var content = $(this).find('Content');
            var extendParmsEL = $(this).find('ExtendParms');
            var extendParms = extendParmsEL != null ? extendParmsEL.text() : "";
            var des = $(this).attr('Des') || '';
            var description = $(this).attr('Description') || '';
            var condition = $(content).text();
            condition = condition.replace(/〈/g, '<');
            extendParms = extendParms.replace(/〈/g, '<');
            $('#Des').val(des);
            that.data.condition = condition.replace(/※/g, '&');

            var item = { ExtendParms: extendParms, ConditionId: conditionId, Reverse: reverse, LogicCalc: logicCalc, Name: type, Description: description, Content: condition, Des: des };
            that.addOrUpdateResultList(item, true);
          });
        }
        that.data.ConditionType = '';
        that.changeConditionType('', false);
        $('#LogicCalc_Div').hide();
      },
      clearCondition() {
        var that = this;
        that.conditionTypeDesiable = false;
        that.data.condition = '';
        that.data.ExtendParms = '';
        that.data.conditionId = '';
        that.data.SQLCondition = '';
        that.data.ProcVarsExpressCondition = '';
        that.data.JSCondition = '';
        that.data.FormFieldCondition = [];
        that.data.OrgCondition = '';
        that.data.OrgLevelCondition = '';
        that.data.JavaCondition = '';
        that.data.ApproActionCondition = '';
        that.data.RestCondition = '';
        that.data.RoleCondition = '';
        that.data.AssemblyCondition = '';

        $.each(that.dataResult, function (i, item) {
          item.selected = false;
        });
        $("input[id$='Condition']").val('');
        $("textarea[id$='Condition']").val('');
        $('#Reverse').val('0');
        $('#Des').val('');
        $('#LogicCalc_Div').hide();
        editorJava.setValue('');
        editorJS.setValue('');
        editorSQL.setValue('');
      },
      clearConditionAndDes(conditionType) {
        var that = this;
        that.data.condition = '';
        that.data[conditionType + 'Condition'] = '';
        $('#' + conditionType + 'Condition').val('');
        $('#Des').val('');
      },
      changeConditionType(conditionType, isSetValue) {
        var that = this;
        $('#FormField_Div').hide();
        $('#JS_Div').hide();
        $('#SQL_Div').hide();
        $('#Java_Div').hide();
        $('#Assembly_Div').hide();
        $('#Role_Div').hide();
        $('#Org_Div').hide();
        $('#ApproAction_Div').hide();
        $('#ProcVarsExpress_Div').hide();
        $('#LogicCalc_Div').show();
        $('#' + conditionType + '_Div').show();
        if (conditionType == 'Rest') {
          if (isSetValue == true) {
            var json = that.data.condition;
            var jsonObj = eval('(' + json + ')');
            that.data[conditionType + 'Condition'] = jsonObj.title;
          }
        }
        else if (conditionType == 'Role' || conditionType == 'Org' || conditionType == 'OrgLevel' || conditionType == 'ApproAction') {
          $('#' + conditionType + '_Div').show();
          if (isSetValue == true) {
            var json = that.data.condition;
            var arr = eval('(' + json + ')');
            var names = [];
            $.each(arr, function (index, item) {
              names.push(item.text);
            });
            $('#' + conditionType + 'Condition').val(names.toString());
            that.data[conditionType + 'Condition'] = names.toString();
          }
        } else if (conditionType == 'FormField') {
          $('#' + conditionType + '_Div').show();
          if (isSetValue == true) {
            var json = that.data.condition || '[]';
            var arr = eval('(' + json + ')');
            that.data['FormFieldCondition'] = arr;
          }
        } else if (conditionType != '') {
          $('#' + conditionType + '_Div').show();
          if (isSetValue == true) {
            $('#' + conditionType + 'Condition').val(that.data.condition);
            that.data[conditionType + 'Condition'] = that.data.condition;
            if (conditionType == 'JS' && editorJS) {
              var beauifyJs = js_beautify(that.data.condition);
              editorJS.setValue(beauifyJs);
            }
            if (conditionType == 'SQL' && editorJS) {
              editorSQL.setValue(that.data.condition);
            }
            if (conditionType == 'Java' && editorJS) {
              editorJava.setValue(that.data.condition);
            }
          }
        }
      },
      addItem() {
        var that = this;
        that.data.ConditionType = '';
        that.clearCondition();
        that.changeConditionType('', false);
        $('#LogicCalc_Div').hide();
      },
      deleteItem() {
        var that = this;
        var conditionId = that.data.conditionId;
        if (that.dataResult.length == 0) {
          that.addItem();
          return false;
        }
        that.data.ConditionType = '';
        that.changeConditionType('');
        that.clearCondition();
        var tempData = [];
        $.each(that.dataResult, function (i, item) {
          if (item.ConditionId != conditionId) {
            tempData.push(item);
          }
        });
        that.dataResult = tempData;
      },
      getItemCondition(conditionId) {
        var that = this;
        var itemJson = '';
        $.each(that.dataResult, function (i, item) {
          if (item.ConditionId == conditionId) {
            itemJson = item;
            return false;
          }
        });
        return itemJson;
      },
      onClickLi(item, thisObj) {
        var that = this;
        that.clearCondition();
        var json = item;
        var logicCalc = json.LogicCalc;
        var conditionType = json.Name;
        var reverse = json.Reverse || '0';
        that.data.conditionId = json.ConditionId;
        that.data.ExtendParms = json.ExtendParms;
        that.data.condition = json.Content.replace(/※/g, '&');
        that.data.ConditionType = conditionType;
        that.changeConditionType(conditionType, true);
        $.each(that.dataResult, function (i, theItem) {
          theItem.selected = false;
        });
        item.selected = true;
        that.conditionTypeDesiable = true;
        $('#Des').val(json.Des);
        $('#LogicCalc').val(logicCalc);
        $('#Reverse').val(reverse);
      },
      addOrUpdateResultList(itemCondition, isInitail) {
        var that = this;
        var conditionId = itemCondition.ConditionId;
        if (!conditionId || isInitail == true) {
          conditionId = conditionId || Object.toGuid();
          itemCondition.ConditionId = conditionId;
          that.dataResult.push(itemCondition);
        } else {
          var tempData = [];
          $.each(that.dataResult, function (i, item) {
            if (item.ConditionId != conditionId) {
              tempData.push(item);
            } else {
              tempData.push(itemCondition);
            }
          });
          that.dataResult = tempData;
        }
      },
      saveRight(showSuccess) {
        var that = this;
        var conditionId = that.data.conditionId;
        var conditionType = that.data.ConditionType;
        var extendParms = that.data.ExtendParms;
        var reverse = $('#Reverse').val() || '0';
        if (conditionType == '') return true;
        var logicCalc = $('#LogicCalc').val() || 'and';
        var label = this.$refs.dropConditionTypeSelect.selectedLabel;
        var description = label;
        var des = $('#Des').val() || '';
        if (des == '' && (conditionType == 'Org' || conditionType == 'Role' || conditionType == 'ApproAction' || conditionType == 'Rest')) {
          des = $('#' + conditionType + 'Condition').val() || '';
        }
        if (conditionType == '') {
          conditionStr = '';
        } else {
          var condition = that.getConditionValue(conditionType);
          if (condition == '') {
            FUI.Window.showMsg('请填写' + description + '迁移条件内容');
            return false;
          }
          var item = { ExtendParms: extendParms, ConditionId: conditionId, Reverse: reverse, LogicCalc: logicCalc, Name: conditionType, Description: description, Content: condition, Des: des };
          that.addOrUpdateResultList(item);
          if (!showSuccess) {
            FUI.Window.showMsg('暂存成功');
          }
          that.data.ConditionType = '';
          that.changeConditionType('');
          $('#LogicCalc_Div').hide();
          that.clearCondition();
        }
        return true;
      },
      save() {
        var that = this;
        if (that.data.ConditionType != '') {
          if (!that.saveRight('no')) {
            return false;
          }
        }
        FUI.Window.confirm('您确定要修改迁移条件？', '温馨提示', function () {
          var conditionStr = '<Conditions>';
          $('#resultList li').each(function (i, li) {
            var conditionId = $(this).attr('conditionid');
            var item = that.getItemCondition(conditionId);
            conditionStr = conditionStr + '<Condition ConditionId="' + item.ConditionId + '"     Reverse="' + item.Reverse + '" LogicCalc="' + item.LogicCalc + '"  Name="' + item.Name + '" Description="' + item.Description + '" Des="' + item.Des + '"><Content>' + that.filterData(item.Content) + '</Content><ExtendParms>' + that.filterData(item.ExtendParms) + '</ExtendParms> </Condition>';
          });
          conditionStr = conditionStr + '</Conditions>';
          console.info(conditionStr);
          parent.setTargetValue(that.attrName, conditionStr);
          FUI.Window.closeEdit();
        });
      },
      showInputParam(inputId) {
        var that = this;
        FUI.Window.showMsg(that.data[inputId], null, 1);
      },
      // 过滤字符串
      filterData(condition) {
        condition = condition.replace(/</g, '〈');
        return condition;
      },
      getConditionValue(conditionType) {
        // 保存时获取最终的条件结果内容
        var that = this;
        if (conditionType == 'SQL') {
          return editorSQL.getValue();
        } else if (conditionType == 'JS') {
          return editorJS.getValue();
        } else if (conditionType == 'Java') {
          return editorJava.getValue();
        } else if (conditionType == 'Role') {
          return that.data.condition;
        } else if (conditionType == 'Org') {
          return that.data.condition;
        } else if (conditionType == 'Rest') {
          return that.data.condition;
        } else if (conditionType == 'OrgLevel') {
          return that.data.condition;
        } else if (conditionType == 'ApproAction') {
          return that.data.condition;
        } else if (conditionType == 'FormField') {
          return that.data.condition;
        }
        return that.data[conditionType + 'Condition'];
      },
      cancle() {
        FUI.Window.closeEdit();
      },
      btnFormApproval1() {
        var that = this;
        var oleVale = that.data.condition;
        var str = "if($(\"input[name='FormApproval']:checked\").val() == \"1\") return true; else return false;";
        that.data.condition = oleVale + '\n' + str;
      },
      btnFormApproval0() {
        var that = this;
        var oleVale = that.data.condition;
        var str = "if($(\"input[name='FormApproval']:checked\").val() == \"0\") return true; else return false;";
        that.data.condition = oleVale + '\n' + str;
      },
      buildFormCondition() {
        var that = this;
        FUI.dialog(__webpath + '/workflow/flowDesigner/buildFormCondition/?type=JS&wid=' + that.wid, '构建迁移条件', {
          wid: that.wid
        }, 680, 480, function (data, index, layer) {
          var js = data.js;
          var des = data.des || '';
          that.data.condition = js;
          $('#Des').val(des);
          var beauifyJs = js_beautify(js);
          editorJS.setValue(beauifyJs);
          layer.close(index);
          return false;
        }, true);
        return false;
      },
      buildFormFieldCondition() {
        var that = this;
        FUI.dialog(__webpath + '/workflow/flowDesigner/buildFormCondition/?type=FormField&wid=' + that.wid, '构建字段条件', {
          wid: that.wid,
          data: that.data.condition
        }, 680, 480, function (data, index, layer) {
          var json = data.json;
          var des = data.des || '';
          console.info(json);
          that.data.condition = json;
          $('#Des').val(des);
          that.data.FormFieldCondition = eval('(' + json + ')');
          layer.close(index);
          return false;
        }, true);
        return false;
      },
      selectApproAction() {
        var that = this;
        WF.SelectorDialog.selectorTextValue(that, 'condition', 'ApproActionCondition', 'ApproAction', { 'wid': that.wid, activityId: that.fromActivityId }, true, null, null, 'selectCallBack');
      },
      selectorTextValue(inputKey, inputName, type) {
        var that = this;
        WF.SelectorDialog.selectorTextValue(that, inputKey, inputName, type, null, null, null, null, 'selectCallBack');
      },
      selectDataService(inputId, inputName) {
        var that = this;
        var inputIdValue = that.data[inputId];
        var obj = null;
        if (inputIdValue) {
          var json = inputIdValue;
          try {
            obj = eval('(' + inputIdValue + ')');
          } catch (err) {
            console.info('JSON解析出错：' + json);
          }
        }
        var width = 680;
        var height = 500;
        var url = '';
        var parms = obj;
        var implType = 'Workflow';
        var url = '/workflow/flowDesigner/dataActorService/?apply=actor&implType=' + implType;
        var title = '数据服务参与者配置';
        FUI.dialog(__webpath + url, title, parms, width, height, function (dataObject, index, layer) {
          if (dataObject == false) {
            return false;
          }
          var resultStr = JSON.stringify(dataObject);
          console.info(resultStr);
          that.data[inputId] = resultStr;
          that.data[inputName] = dataObject.title;
          layer.close(index);
        }, true);
      },
      selectRelationType(inputKey, inputName, infoType) {
        var that = this;
        var that = this;
        WF.SelectorDialog.selectRelationType(that, null, null, infoType, null, false, true, function (data) {
          if (data != false) {
            var arrTV = [];
            var titleArr = [];
            $.each(data, function (i, item) {
              let typeCode = item.typeCode;
              let typeTitle = item.typeTitle;
              arrTV.push({ text: typeTitle, value: typeCode });
              titleArr.push(typeTitle);
            });
            that.data[inputKey] = JSON.stringify(arrTV);
            that.data[inputName] = titleArr.toString();
            $('#Des').val(titleArr.toString());
          }
        });
      },

      selectCallBack(type, data) {
        var that = this;
        type = type.toLowerCase();
        if (type == 'org' || type == 'role' || type == 'approaction') {
          var titles = [];
          var ids = [];
          $.each(data, function (i, item) {
            titles.push(item.text);
            ids.push(item.value);
          });
          $('#Des').val(titles.toString());
        }
      },
      editVarsExpress(inputId) {
        var that = this;
        var value = that.data[inputId];
        var url = __webpath + '/workflow/selector/processVarExpressEdit/?type=all&wid=' + that.wid;
        FUI.dialog(url, '编辑流程变量表达式', { rowmath: value }, 800, 500, function (dataObject, index, layer) {
          that.data[inputId] = dataObject;
          layer.close(index);
        }, true);
      },
      andOrCharText(char) {
        var that = this;
        switch (char) {
          case '&&': return '并且';
          case '||': return '或者';
          default: return '';
        }
      },
      operatorToText(char) {
        var that = this;
        switch (char) {
          case '>': return '大于';
          case '>=': return '大于等于';
          case '<': return '小于';
          case '<=': return '小于等于';
          case '==': return '等于';
          case '!=': return '不等于';
          case 'contain': return '包含有';
          case 'uncontain': return '不包含有';
          case '||': return ' 或者';
          case '&&': return '并且';
          default: return '';
        }
      }
      , inputHelper(id) {
        $('#' + id).toggle();
      }
    }
  }
</script>
<style>
  .column-height {
    height: 430px;
  }

  .leftTdbg {
    width: 80px;
  }

  #resultList li span {
    cursor: move;
    margin-right: 3px;
  }

  .fence-li-item {
    padding-left: 0px !important;
  }
</style>