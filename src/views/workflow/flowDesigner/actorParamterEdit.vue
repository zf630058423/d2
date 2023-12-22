<template>
  <div class="f2bpm-page-layout">
    <div class="line">
      <div class="fence-box" style="width: 180px;height: 420px;">
        <div class="fence-box-title">
          <span id="addItem" class="cur mr4" role="button" @click="addItem();"><i class="fa fa-plus" />添加参与者</span>
          <span class="cur" role="button" @click="dataSort()"><i class="fa fa-refresh" />刷新排序</span>
        </div>
        <ul id="listResult">
          <li v-for="item in leftData" title="双击删除，单击修改" :class="item.ActorId==currentItem.ActorId?'selected fence-li-item':'fence-li-item'"   :ActorParser="item.ActorParser" :ActorDescription="item.ActorDescription" @dblclick="deleteItem(item)" @click="listResultItemSelected(item)">
            <input type="button" disabled="disabled" :value="item.OrderNum" class="fence-li-index">{{ item.ActorDescription }}
          </li>
        </ul>
      </div>
      <div class="fence-box" style="width: 650px;height:420px;">
        <div class="fence-box-title">
          <i class="" @click="showParmValue()">.</i> 参与者计算器属性： <a id="delete" href="javascript:void(0);" role="button" @click="deleteItem()"><i class="fa fa-minus-circle" />删除除参与者</a>
        </div>
        <div class="line">
          <table class="common-FormTable" cellpadding="0" cellspacing="0">
            <tr>
              <td class="leftTdbg"> 参与者计算器：</td>
              <td class="p3">
                <el-select v-model="data.ActorParser" size="mini" filterable placeholder="请选择参与者" @change="selectChange">
                  <el-option v-for="item in ActorParserData" :label="item.text" :value="item.value" />
                </el-select>
                排序号：
                <el-input-number v-model="data.OrderNum" size="mini" style="width: 120px;" :min="1" :max="99" label="排序" />
              </td>
            </tr>

            <tr id="ActorInputTr">
              <td class="leftTdbg">
                <span v-html="ActorInputParamText">角色名称</span>：
              </td>
              <td style="padding-top: 3px;">
                <el-input v-if="isShowActorInputParamDes" v-model="data.ActorInputParamDes" size="mini" readonly="readonly" />
                <el-input v-if="isShowActorInputParam" v-model="data.ActorInputParam" size="mini" />
                <div v-if="data.ActorParser=='AssemblyActor'">
                  Java类自定义参数：
                  <el-input clearable placeholder="将会把填写的参数内容原样的传入到Java类的执行函数中" v-model="data.ActorOptions.javaParms" size="mini" />
                </div>

                <span id="customActorBtn" class="icon icon_tools" onclick="customActor()"><i class="fa fa-cog" />设置</span>
                <a id="selectRelation" href="javascript:void(0)" role="button" @click="selectRelation('ActorInputParam', 'ActorInputParamDes',   null, true, true)"><i class="fa fa-search">选择汇报树</i></a>

                <a id="selectRelationType" href="javascript:void(0)" role="button" @click="selectRelationType('ActorInputParam', 'ActorInputParamDes', 'userRelation', null, true, true)"><i class="fa fa-search">选择关系名称</i></a>
                <a id="selectDepartLeaderRelationType" href="javascript:void(0)" title="选择配置" @click="selectRelationType('ActorInputParam','ActorInputParamDes','departLeader')"><i class="fa fa-search" />选择分管类型</a>
                <a id="selectRoles" href="javascript:void(0)" title="选择角色" @click="selectorTextValue('ActorInputParam','ActorInputParamDes','Role')"><i class="fa fa-search" />选择角色</a>
                <a id="selectUsers" href="javascript:void(0)" title="选择用户" @click="selectorUserTextValue('ActorInputParam','ActorInputParamDes',null,false,'userId')"><i class="fa fa-search" />选择用户</a>
                <a id="selectPosition" href="javascript:void(0)" title="选择岗位" @click="selectorPositionTextValue('ActorInputParam','ActorInputParamDes', false)"><i class="fa fa-search" />选择岗位</a>
                <a id="selectPostJob" href="javascript:void(0)" title="选择职务" @click="selectorPostJobTextValue('ActorInputParam','ActorInputParamDes', false)"><i class="fa fa-search" />选择职务</a>


                <a id="selectDataService" href="javascript:void(0)" title="选择数据服务" @click="selectDataService('ActorInputParam','ActorInputParamDes')"><i class="fa fa-search" />选择数据服务</a>

                <a id="selectHistoryActivity" href="javascript:void(0)" title="选择历史审批环节" @click="dataSelectHistoryActivity('ActorInputParam','ActorInputParamDes');"><i class="fa fa-search" />选择历史审批环节</a>
                <a id="selectSelectFormField" href="javascript:void(0)" tip="所选字段的值只能是：用户ID，账号，姓名 3种的任何一种且可多种同时存在，优先使用用户ID" @click="selectorFormField('ActorInputParam', 'ActorInputParamDes',false)"><i class="fa fa-search" />选择表单字段</a>
                <a id="clearEmpty2" href="javascript:void(0)" @click="onClearEmpty('ActorInputParam')"><i class="fa fa-minus-circle  ml5" aria-hidden="true" />清空</a>
                <a id="clearEmpty2" href="javascript:void(0)" @click="showInputParam('ActorInputParam')" title="查看配置的参数内容"><i class="fa fa-search ml5" aria-hidden="true" />查看内容</a>
                <span id="helperBtn" class="icon icon_help cur ml5 font8" @click="inputHelper()"><i class="fa fa-question-circle-o" />查看填写说明</span>
                <br>
                <div id="inputHelper" style="display: none">

                  <div class="SqlActor" style="padding-left: 10px; border: solid 1px #CDCDCD;">
                    <em>【SQL参与者】填写说明</em><br>
                    SQL参与者仅限用于非弹窗提交模式<br>
                    Sql不要使用过于复杂的嵌套或查询效率低的复杂Sql避免查询过慢导致不可预知的错误。<br>
                    1、可使用接口传入的流程变量和持久化的流程变量。<br>
                    2、可使用当前表单【仅主表字段】作为变量，字段名如：#mytable.ximing#。<br>
                    3、使用标准的SQL语句查询，查询语句中只要求必段返回[用户登录UserId]字段，且将字段命一个别名为UserId，
                    SQL语句中可以使用流程实例运行时上下文变量。注意需要把账号字段放在Select后的第一个字段。 <br>
                    可用到的流程变量：[#ProcInstCreatorId#:流程发起人][#Wiid#:流程实例ID][#AppId#:流程应用ID][#FormId#:表单业务键ID],[#ActivityCode#:当前环节编码],[#ActivityName#:当前环节编码],[#CurrentUserId#:当前登录用户Id],[#CurrentOrgId#:当前登录用户的组织ID],[#CurrentAccount#:当前用户登录账号],[#CurrentOrgId#:当前登录用户Id],[#CurrentRealName#:当前登录用户姓名]
                    使用表单主表字段作为变量名如：[#KongJian.ceShiA#]
                    假如你有业务表 Atable，取字段 ActorUserId,通常你的业务表也要保存流程实例ID字段，假如是字段AWiid <br>
                    [SQL语句示例：select ActorUserId as UserId from Atable where AWiid=#Wiid#]
                    [格式： <em>select XXX as UserId from XXX where XXX=#Wiid#</em>]
                  </div>
                  <div class="ProcVarActor" style="padding-left: 10px; border: solid 1px #CDCDCD;">
                    <em>【流程变量参与者】填写说明</em><br>
                    流程变量参与者通常用于API接口调用或存在持久化变量<br>
                    填写说明：填写流程变量的名称，多个变量之间使用英文逗号隔开，如：myuserA,myuserB。变量最终解析出来的值必须是用户的UserId或用户的账号,变量解析出来的值允许有多个用户，用户值之间使用英文逗号隔开（变量的值要么全是用户UserId要么全是用户Account）。
                  </div>

                  <div class="XmlActor" style="padding-left: 10px; border: solid 1px #CDCDCD;">
                    <em>【Xml文件参与者】填写说明</em><br>
                    填写XML的文件名，文件目录默认读解决方案中的"/App_Data/XmlActor/"这个目录，可以在配置文件
                    "f2bpm.xmlActorPath"来修改默认路径；支持直接填写绝对物理路径 <br> XML文件内容的格式示例如下：<br>
                    <textarea style="width: 99%; height:80px;margin-bottom: 3px;" cols="20" rows="2">
<?xml version="1.0" encoding="utf-8" ?>
                                          <users>
<user account="ls" realName="李四"></user>
<user account="ww" realName="王五"></user>
</users>
                          </textarea>
                    <br>
                  </div>
                  <div class="CookieActor" style="padding-left: 10px; border: solid 1px #CDCDCD;display: none;">
                    <em>【Cookie参与者】填写说明</em><br> 填写Cookie的名称，Cookie名称使用全大写如：MYCOOKIEACTOR。<br>Cookie的值
                    为Json格式，如下示例：
                    <textarea id="TextArea1" style="width: 99%; height: 80px;margin-bottom: 3px;" cols="20" rows="2">
[{"text":"张三","value":"zs"},{"text":"文本2","value":"值2"}]
                          </textarea>
                    <br>
                  </div>
                  <div class="AssemblyActor" style="display: none">
                    格式[Java类的全路径名] 示例：com.f2bpm.demo.customExtension.DemoAssemblyActor<br> <em>【自定义插件参与者】示例代码</em><br>

                    <textarea style="width: 99%; height: 150px;" cols="20" rows="2">
                      public class DemoAssemblyActor implements IAssemblyActor {
                        @Override
                        public List<IUser> resolve(String javaParms,String actorXml,WorkflowContext wfContext) {
                          List<IUser> result =null;
                          return result;
                        }
                      }
                </textarea>
                  </div>

                </div>

              </td>
            </tr>
            <tr id="IncludeMyselfTr">
              <td class="leftTdbg"><span>是否包含本部门：</span></td>
              <td>
                <el-select v-model="data.BaseParam.IncludeMyself" size="mini">
                  <el-option label="请选择" value="" />
                  <el-option label="否" value="false" />
                  <el-option label="是" value="true" />
                </el-select>
              </td>
            </tr>
            <tr v-if="data.ActorParser=='DepartAssignLeaderActor'">
              <td class="leftTdbg"><span>钻取上一级部门领导</span></td>
              <td>
                <el-switch v-model="data.ActorOptions.isDrillParentWhenUserIsDepLeader" active-color="#13ce66" inactive-color="#DEDEDE" />

                <el-tooltip class="item" effect="dark" content="如果当前人本身是计算得出结果的部门领导，是否钻取此人所在分管的部门的上一级部门的领导作为处理人，此设置不常用，一般设置为“否”" placement="right">
                  <i style="margin-left: 5px;font-weight: bold" class="fa fa-question-circle-o"> </i>
                </el-tooltip>
              </td>
            </tr>
            <tr id="DirectTypeTr">
              <td class="leftTdbg"><span>钻取方向：</span></td>
              <td>
                <el-select v-model="data.DirectType" size="mini">
                  <el-option label="请选择" value="" />
                  <el-option label="向上钻取" value="DirectUp" />
                  <el-option label="向下钻取" value="DirectDown" />
                </el-select>
                <br>
              </td>
            </tr>
            <tr id="DrillLevelNumTr">
              <td class="leftTdbg"><span>汇报树钻取级数:</span></td>
              <td class="p3">
                <el-input-number v-model="data.DrillLevelNum" size="mini" :min="0" :max="100" label="钻取级数" />
                <el-tooltip class="item" effect="dark"   placement="right">
                  <div slot="content">
                    【规则一】：填写“0”将忽略钻取方向获取的是当前在树形位置的同级节点；填写“N”（N小于99）表示在方向钻取N级，即从第1级到第N级都钻取。
                    <br/>
                    【规则二】：填写“99”表示钻取指定标签节点（直到找到第一个标签的节点就停止），多个标签是或的关系。
                  </div>
                  <i style="margin-left: 5px;font-weight: bold" class="fa fa-question-circle-o"> 规则说明</i>
                </el-tooltip>
              </td>
            </tr>
            <tr v-if="(data.ActorParser=='ParentDepartRoleActor'||data.ActorParser=='ParentDepartPostJobActor')&&data.RelationTypeParam==''">
              <td class="leftTdbg"><span>钻取第几级:</span></td>
              <td class="p3">
                <el-input-number v-model="data.DrillLevelNum" size="mini" :min="0" :max="100" label="钻取第几级" />
                <el-tooltip class="item" effect="dark" content="只钻取第几级部门，假如设置了2，那么只向上钻取第2级。最小为1；如果配置了“钻取指定部门标签”则此参数无效。" placement="right">
                  <i style="margin-left: 5px;font-weight: bold" class="fa fa-question-circle-o"> </i>
                </el-tooltip>
              </td>
            </tr>
            <tr id="RelationTypeTr">
              <td class="leftTdbg">
                <span v-if="getIsShow('RelationTreeActor',data.ActorParser)&&data.DrillLevelNum==99">钻取节点标签：</span>
                <span v-if="getIsShow('RelationTreeActor',data.ActorParser)&&data.DrillLevelNum!=99">钻取关系类型的路径：</span>
                <span v-if="getIsShow('drillDepartLabel',data.ActorParser)">钻取指定部门标签：</span>
              </td>
              <td class="p3">
                <el-input v-if="getIsShow('RelationTreeActor',data.ActorParser)" style="width: 490px;" v-model="data.RelationTypeParamDes" size="mini" readonly="readonly" :placeholder="data.DrillLevelNum==99?'请选择要钻取的节点标签，钻取到第一个符合标签条件的节点时停止。':'人员汇报树：钻取指定关系标签的对象,不填写则取全部。'"></el-input>
                <el-input v-if="getIsShow('drillDepartLabel',data.ActorParser)" style="width: 490px;" v-model="data.RelationTypeParamDes" size="mini" readonly="readonly" placeholder="在本部门逐级向上级部门（下级部门）含有指定标签的部门中查找指定角色的人。"></el-input>
                <el-input v-model="data.RelationTypeParam" size="mini" v-show="false"></el-input>
                <a v-if="getIsShow('RelationTreeActor',data.ActorParser)"  href="javascript:void(0)" role="button" @click="selectRelationType('RelationTypeParam', 'RelationTypeParamDes', 'relationTree', null, false, true)"> <i class="fa fa-search">选择标签</i></a>
                <a v-if="getIsShow('drillDepartLabel',data.ActorParser)" href="javascript:void(0)" role="button" @click="selectRelationType('RelationTypeParam', 'RelationTypeParamDes', 'orgLevel', null, false, true)"> <i class="fa fa-search">选择组织标签</i></a>
                <a id="clearEmpty2" href="javascript:void(0)" @click="onClearEmpty('RelationTypeParam')"><i class="fa fa-minus-circle  ml5" aria-hidden="true" />清空</a>
                <a id="clearEmpty2" href="javascript:void(0)" @click="showInputParam('RelationTypeParam')" title="查看配置的参数内容"><i class="fa fa-search ml5" aria-hidden="true" />查看内容</a>
                <el-tooltip v-if="data.ActorParser=='RelationTreeActor'&&data.DrillLevelNum!=99" class="item" effect="dark" content="通过设置特定标签类型来筛选业务关系上的人员" placement="right">
                
                  <i style="margin-left: 5px;font-weight: bold" class="fa fa-question-circle-o"> </i>
                </el-tooltip>
             

                <!--  上级/子级部门角色参与者 上级/子级部门职务参与者 -->
                <el-tooltip v-if="getIsShow('findRelationLabelStopType',data.ActorParser)" class="item" effect="dark" content="找部门规则： 在本部门逐级向上级部门（向下级部门）含有指定标签的部门（多个标签时只要此部门含有其中一个标签就满足条件）”。" placement="right">
                  <i style="margin-left: 5px;font-weight: bold" class="fa fa-question-circle-o"> </i>
                </el-tooltip>
                <div class="m10" v-if="getIsShow('findRelationLabelStopType',data.ActorParser)">
                  找标签部门停止条件 <el-select style="width: 70%" v-model="data.ActorOptions.findRelationLabelStopType" size="mini">
                    <el-option label="钻取标签部门，找到第一个符合标签的部门就停止" value="first" />
                    <el-option label="钻取标签部门，找到所有符合标签的部门" value="all" />
                    <el-option label="不钻取标签部门（需配虚拟标签），在所有上级（下级）部门中找" value="allOrgUserInRoles" />
                  </el-select>
                </div>



              </td>
            </tr>
            <tr id="IsListPageTr">
              <td class="leftTdbg"><span>供选择人</br>是否分页列表：
                </span></td>
              <td>
                <el-select v-model="data.IsListPage" size="mini">
                  <el-option label="请选择" value="" />
                  <el-option label="否" value="false" />
                  <el-option label="是" value="true" />
                </el-select>
                (一般为"否")
              </td>
            </tr>
            <tr id="CustomDialogActorTr">
              <td class="leftTdbg"><span>选择器类型：</span></td>
              <td style="padding-top: 3px; padding-bottom: 3px;">
                <el-select v-model="data.CustomDialogType" size="mini">
                  <el-option label="开发自定义选择器" value="MyCustomDialog" />
                </el-select>
              </td>
            </tr>
            <tr id="BaseTypeTr">
              <td class="leftTdbg"><span id="baseTypeTitle">基准部门</span>：</td>
              <td>
                <el-select v-model="data.BaseParam.BaseType" size="mini" @change="baseTypeChange">
                  <el-option label="无" value="0" />
                  <el-option label="当前登录用户" value="2" />
                  <el-option label="流程发起人" value="3" />
                  <el-option label="指定部门" value="4" />
                  <el-option label="指定用户" value="6" />
                  <el-option label="指定历史环节处理人" value="5" />
                  <el-option label="表单用户ID字段" value="9" />
                  <el-option label="表单组织ID字段" value="10" />
                  <el-option label="流程变量" value="11" />
                  <el-option label="待办归属人" value="12" />
                  <el-option label="扩展属性" value="1" />
                  <el-option label="扩展Xml文件" value="7" />
                  <!-- <el-option label="扩展Cookie值" value="8" /> -->
                </el-select>
              </td>
            </tr>
            <tr v-show="data.BaseParam.BaseType!='0'&&data.BaseParam.BaseType!=''&&data.BaseParam.BaseType!='2'&&data.BaseParam.BaseType!='12'"">
              <td class=" leftTdbg">基准参数：</td>
              <td style="vertical-align: top">
                <el-input v-if="isShowBaseDes" v-model="data.BaseParam.BaseDes" size="mini" readonly="readonly" />
                <el-input v-if="isShowBaseList" v-model="data.BaseParam.BaseList" size="mini" />
                <a id="selectBaseFormUserIdField" href="javascript:void(0)" tip="所选字段的值只能是“用户ID字段”" @click="selectorFormField('BaseList', 'BaseDes',true,'BaseParam')"><i class="fa fa-search" />选择表单字段</a>
                <a id="selectDepart" href="javascript:void(0)" class="fa fa-search" title="选择部门" @click="selectorTextValueOfBaseParam('BaseList','BaseDes','Org');">选择部门</a>
                <a id="selectHistoryActivityDepart" href="javascript:void(0)" class="" data-options="plain:true,iconCls:'icon-search'" title="选择历史审批环节" @click="selectHistoryActivity('BaseList','BaseDes')">选择历史审批环节</a>
                <a id="selectUsersOfBaseParm" href="javascript:void(0)" title="选择用户" @click="selectorUserTextValueOfBaseParam('BaseList','BaseDes',null,false,'account');"><i class="fa fa-search" />选择用户</a>

                <i class="fa fa-search cur ml5" @click="showParmValue('BaseList')" title="查看配置的参数内容">查看内容</i>
                <a id="A1" type="button" class="fa fa-minus-circle cur" @click="cleanEmptyBase('BaseList')">清空</a>
                <br> 当“基准部门\人类型”为“指定部门”时请选择部门<br> 当“基准部门\人类型”为“指定历史环节处理人部门”请填选择历史环节<br>
                当“基准部门\人类型”为“指定用户”请填选择人员<br>
                当“基准部门\人类型”为“表单用户ID字段”请填选表单中的用户ID字段<br>
                当“基准部门\人类型”为“表单组织ID字段”请填选表单中的组织ID字段<br>
                当“基准部门\人类型”为“流程变量”请填写流程变量名<br>
                当“基准部门\人类型”为“Cookie值”请填写Cooike名，值为Json结构格式：[{"text":"文字1","value":"值1"},{"text":"文字2","value":"值2"}]
                <br> 当“基准部门\人类型”为“扩展Xml文件”请填写Xml的文件绝对地址，并确保文件能被访问,Xml内容格式,支持直接填写绝对物理路径 ：

                <br>
              </td>
            </tr>
            <tr>
              <td class="leftTdbg">扩展参数：</td>
              <td>
                <el-input placeholder="将会把填写的参数内容原样的传入到参与者计算器中" clearable v-model="data.ActorOptions.extendParms" size="mini" />
              </td>
            </tr>
            <tr>
              <td class="leftTdbg">计算规则：</td>
              <td>
                <el-select v-model="data.CalculationRule" size="mini">
                  <el-option label="并集" value="UnionAll" />
                  <el-option label="交集" value="Common" />
                  <el-option label="差集" value="Differ" />
                  <el-option label="互拆" value="Mutual" />
                </el-select>

                <span class="fa fa-book ml5 cur" @click="showOrHideTarget('calculationRule_node')">说明</span>
                <div id="calculationRule_node" style="display: none;">
                  计算规则说明：计算规则是指从第一个“参与者计算器”开始顺序求解出新的当前结果集，
                  每个计算器求解出来的结果与当前结果集之间的计算。【算法：并集=自己∪当前结果集、 交集=自己∩当前结果集、差集=当前结果集-自己、互拆=自己变成当前结果集】
                  每个计算器必须求解处理人不为空的情况下才进行规则计算，各个“参与者类型成员”按序号顺序执行。
                  举例：第一个计算器是并集求得的结果为：A、B、C，侧将A、B、C做为结果存在在临时结果集中； 继续求解第二个计算器，假设是交集且第二个计算器的运算结果是：B，
                  那么就使用自己 B、C相交当前结果集A、B、C得出B作为新的当前结果集，将此结果作为新的临时结果集，依此类推。
                </div>

              </td>
            </tr>
          </table>
        </div>
      </div>
    </div>
    <div class="dialogfooter">
      <a href="javascript:void(0);" role="button" class="btn btn-primary btn-sm mr2" @click="saveAndClose()"><i class="fa fa-save" />确定</a>
      <a href="javascript:void(0);" role="button" class="btn btn-primary btn-sm" @click="closeEdit"><i class="fa fa-minus-circle" />取消</a>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        actorXmlTemplate: '',
        attrName: '',
        wid: '',
        // 页面加载时的原始数据
        initailData: null,
        currentItem: {},
        ActorInputParamText: '',
        isShowBaseList: false,
        isShowBaseDes: true,
        isShowActorInputParamDes: true,
        isShowActorInputParam: false,
        ActorParserData: [
          { text: '当前用户参与者', value: 'CurrentLoginActor' },
          { text: '自由选择参与者', value: 'FreeChoiceActor' },
          { text: '指定用户参与者', value: 'AssignActor' },

          { text: '在线表单字段参与者', value: 'SmartFormFieldActor' },
          { text: '部门分管领导参与者', value: 'DepartAssignLeaderActor' },
          { text: '直线关系参与者', value: 'DirectRelationActor' },
          { text: '汇报树参与者', value: 'RelationTreeActor' },
          { text: '角色参与者', value: 'RoleActor' },
          { text: '上级部门角色参与者', value: 'ParentDepartRoleActor' },
          { text: '子级部门角色参与者', value: 'ChilredDeaprtRoleActor' },
          { text: '历史审批环节参与者', value: 'HistoryActivityActor' },
          { text: '部门参与者', value: 'DepartActor' },
          { text: '自定义插件参与者', value: 'AssemblyActor' },
          { text: '自定义选择器参与者', value: 'CustomDialogActor' },
          { text: '数据服务Rest接口参与者', value: 'RestActor' },

          { text: '上级部门职务参与者', value: 'ParentDepartPostJobActor' },
          { text: '子级部门职务参与者', value: 'ChilredDeaprtPostJobActor' },
          { text: '职务(岗位类型)参与者', value: 'PostJobActor' },
          { text: '指定岗位参与者', value: 'PositionActor' },


          { text: '主流程发起人参与者（仅在子流程使用）', value: 'MainProcCreatorActor' },
          { text: '本流程发起人参与者', value: 'ProcCreatorActor' },
          { text: '流程变量参与者', value: 'ProcVarActor' },
          { text: 'SQL参与者', value: 'SqlActor' },
          { text: 'XML参与者', value: 'XmlActor' }
          // { text: 'Cookie参与者', value: 'CookieActor' }
        ],
        data: {
          ActorId: '',
          OrderNum: '1',
          ActorParser: 'CurrentLoginActor',
          ActorDescription: '当前用户参与者',
          ActorInputParam: '',
          ActorInputParamDes: '',
          RelationTypeParamDes: "",
          RelationTypeParam: "",
          DrillLevelNum: 1,
          BaseParam: { BaseType: '0', IncludeMyself: 'false', BaseList: '', BaseDes: '' },
          CalculationRule: 'UnionAll',
          IsListPage: 'false',
          CustomDialogType: '',
          DirectType: '',
          //属性设置，扩展其它参数可在这个属性中添加
          ActorOptions: {}
        },
        leftData: [],
        leftData: [],
        formRules: {
          text: [
            { required: true, message: '必填项不能为空', trigger: 'blur' }
          ],
          value: [
            { required: true, message: '必填项不能为空', trigger: 'blur' }
          ]
        }

      };
    },
    created: function () {
      var that = this;
      var actorXmlTemplate = '<Actor ActorId="{ActorId}" OrderNum="{OrderNum}" ActorParser="{ActorParser}" ActorDescription="{ActorDescription}">'
        + '<ActorInputParam>{ActorInputParam}</ActorInputParam><ActorInputParamDes>{ActorInputParamDes}</ActorInputParamDes>'
        + '<BaseParam><BaseType>{BaseType}</BaseType><IncludeMyself>{IncludeMyself}</IncludeMyself>'
        + '<BaseList BaseDes="{BaseDes}">{BaseList}</BaseList> </BaseParam>'
        + '<CustomDialogType>{CustomDialogType}</CustomDialogType>'
        + '<IsListPage>{IsListPage}</IsListPage>'
        + '<DirectType>{DirectType}</DirectType>'
        + '<RelationTypeParamDes>{RelationTypeParamDes}</RelationTypeParamDes>'
        + '<RelationTypeParam>{RelationTypeParam}</RelationTypeParam> '
        + '<DrillLevelNum>{DrillLevelNum}</DrillLevelNum>'
        + '<CalculationRule>{CalculationRule}</CalculationRule>'
        + '<ActorOptions>{ActorOptions}</ActorOptions>'
        + '</Actor>';
      var obj = null;
      var wid = null;
      var data = [];
      var attrName = null;
      var currentActorId = '';
      var initailData = [];
      obj = parent.window.currentWindowTargetObjectValue;
      var actorParam = obj.value;
      var title = obj.title;
      $(window.document).attr('title', title);
      wid = obj.otherParm;
      attrName = obj.name;
      that.attrName = attrName;
      if (actorParam == '') {
        actorParam = [];
        actorParam.push(that.buildDefaultActor());
        initailData = actorParam;
      } else {
        var xmlStr = actorParam;
        initailData = that.actorsXmlToJsons(xmlStr);
      }
      that.actorXmlTemplate = actorXmlTemplate;
      that.initailData = initailData || [];
      that.wid = wid;
    },
    mounted() {
      var that = this;
      window.myvm = that;
      that.initail();
    },
    methods: {
      getIsShow(type, actorParser) {
        if (type == "RelationTreeActor") {
          var arr = ['RelationTreeActor'];
          if ($.inArray(actorParser, arr) != -1) {
            return true;
          }
        }
        else if (type == "drillDepartLabel" || type == "findRelationLabelStopType") {
          var arr = ['ParentDepartRoleActor', 'ChilredDeaprtRoleActor', 'ParentDepartPostJobActor', 'ChilredDeaprtPostJobActor'];
          if ($.inArray(actorParser, arr) != -1) {
            return true;
          }
        }
      }
      , closeEdit() {
        FUI.Window.closeEdit();
      },
      autoOrderNum() {
        var that = this;
        $.each(that.leftData, function (i, item) {
          item.OrderNum = i + 1;
        });
      },
      dataSort() {
        var that = this;
        that.rightData = Object.dataSort(that.leftData, 'OrderNum');
        that.autoOrderNum();
      },
      initail() {
        var that = this;
        var left = [];
        if (that.initailData == null || that.initailData.length == 0) {
          return false;
        }
        $.each(that.initailData, function (i, item) {
          item.OrderNum = i + 1;
          item.BaseParam.IncludeMyself = item.BaseParam.IncludeMyself.toLocaleLowerCase();
          if (item.ActorId == '') {
            item.ActorId = Object.toGuid();
          }
          left.push(item);
          if (i == 0) {
            that.incrementalAttributes(item);
            that.currentItem = item;
            that.data = item;
            that.actorParserChangeShow(item.ActorParser);
          }
        });
        that.leftData = left;
      },
      //构建增量属性
      incrementalAttributes(item) {
        let that = this;
        if (item == null || item == undefined) {
          return false;
        }
        if (item.RelationTypeParamDes == undefined) {
          item.RelationTypeParamDes = "";
        }
        if (item.RelationTypeParam == undefined) {
          item.RelationTypeParam = "";
        }
        if (item.DrillLevelNum == undefined) {
          item.DrillLevelNum = 1;
        }
      }
      , addEmpty() {
        var that = this;
        that.currentAction = 'add';
        that.clearLeft();
      },
      clearLeft() {
        var that = this;
        $.each(that.data, function (key, value) {
          if (key != 'Type') {
            that.data[key] = '';
          }
        });
      },
      getNewDefaultActor() {
        var defaultActor = this.buildDefaultActor();
        return defaultActor;
      },
      addItem() {
        var that = this;
        that.dataSort();
        var item = {};
        item = that.getNewDefaultActor();
        item.OrderNum = that.leftData.length + 1;
        that.data = item;
        that.leftData.push(item);
        that.data = item;
      },
      selectChange(actorParser) {
        console.info(actorParser);
        var that = this;
        var actorDescription = '';
        $.each(that.ActorParserData, function (i, item) {
          if (item.value == actorParser) {
            actorDescription = item.text;
            return true;
          }
        });
        that.data.ActorDescription = actorDescription;
        that.data.ActorParser = actorParser;
        that.data.DrillLevelNum = 1;
        $('#inputHelper').hide();
        that.setInitailDefaultValue(actorParser);
        that.actorParserChangeShow(actorParser);
      },
      deleteItem() {
        var that = this;
        var delitem = that.currentItem;
        if (that.leftData.length == 1) {
          FUI.Window.showMsg('至少需要有一个参与者');
          return false;
        }
        if (delitem == null && that.leftData.length > 0) {
          delitem = that.leftData[that.leftData.length - 1];
        } else if (delitem == null) {
          return false;
        };
        var tem = [];
        $.each(that.leftData, function (index, item) {
          if (item.ActorId != delitem.ActorId) {
            tem.push(item);
          }
        });
        that.leftData = tem;
        that.dataSort();
        if (that.leftData.length > 0) {
          that.currentItem = that.leftData[that.leftData.length - 1];
          that.data = that.currentItem;
        }
      },
      listResultItemSelected(item) {
        var that = this;
        that.data = item;
        that.currentItem = item;
        that.actorParserChangeShow(item.ActorParser);
      },
      saveAndClose() {
        var that = this;
        var isTrue = that.validate();;
        if (isTrue == false) {
          return false;
        }
        FUI.Window.confirm(null, '您确定要提交暂存？', '温馨提示', function () {
          var xml = that.actorsJsonToXml(that.leftData);
          parent.setTargetValue(that.attrName, xml);
          FUI.Window.closeEditAll();
        });
      },
      validate(jsons) {
        var that = this;
        var isTrue = true;
        var leftData = that.leftData;
        $.each(leftData, function (i, item) {
          var msg = "";
          if (item.ActorParser == "DepartAssignLeaderActor") {
            if (!item.ActorInputParam) {
              msg += "【请选择“部门分管领导参与者”】";
            }
            if (item.BaseParam.BaseType == 0 && item.BaseParam.BaseType == '0') {
              msg += "【请选择“基准部门”】";
            }
          } else if (item.ActorParser == "DepartActor") {
            if (item.BaseParam.BaseType == 0 && item.BaseParam.BaseType == '0') {
              msg += "【请选择“基准部门”】";
            }
          }
          else if (item.ActorParser == "RoleActor") {
            if (!item.ActorInputParam) {
              msg += "【请选择“角色”】";
            }
          } else if (item.ActorParser == "ParentDepartRoleActor" || item.ActorParser == "ChilredDeaprtRoleActor") {
            if (!item.ActorInputParam) {
              msg += "【请选择“角色”】";
            }
            if (item.BaseParam.BaseType == 0 && item.BaseParam.BaseType == '0') {
              msg += "【请选择“基准部门”】";
            }
          }
          else if (item.ActorParser == "ParentDepartPostJobActor" || item.ActorParser == "ChilredDeaprtPostJobActor") {
            if (!item.ActorInputParam) {
              msg += "【请选择“职务”】";
            }
            if (item.BaseParam.BaseType == 0 && item.BaseParam.BaseType == '0') {
              msg += "【请选择“基准部门”】";
            }
          }

          else if (item.ActorParser == "AssignActor") {
            if (!item.ActorInputParam) {
              msg += "【请选择“指定用户”】";
            }
          }
          else if (item.ActorParser == "PositionActor") {
            if (!item.ActorInputParam) {
              msg += "【请选择“指定岗位”】";
            }
          }
          else if (item.ActorParser == "PostJobActor") {
            if (!item.ActorInputParam) {
              msg += "【请选择“职务(岗位类型)”】";
            }
          }
          else if (item.ActorParser == "SmartFormFieldActor") {
            if (!item.ActorInputParam) {
              msg += "【请选择“表单字段”】";
            }
          } else if (item.ActorParser == "DirectRelationActor") {
            if (!item.ActorInputParam) {
              msg += "【请选择“直线关系名”】";
            }
            if (!item.DirectType) {
              msg += "【请选择“关系方向类型”】";
            }
          } else if (item.ActorParser == "RelationTreeActor") {
            if (!item.ActorInputParam) {
              msg += "【请选择“汇报树”】";
            }
            if (item.DrillLevelNum==99&&!item.RelationTypeParam) {
              msg += "【请选择要钻取的节点“标签”】";
            }
            if (!item.DirectType) {
              msg += "【请选择“关系方向类型”】";
            }
            if (item.BaseParam.BaseType == '4') {
              msg += "【“基准人类型”不能是“指定部门”】";
            }
            if (item.BaseParam.BaseType == '0') {
              msg += "【请选择“基准人类型”】";
            }
          } else if (item.ActorParser == "HistoryActivityActor") {
            if (!item.ActorInputParam) {
              msg += "【请选择“环节名称”】";
            }
          } else if (item.ActorParser == "AssemblyActor") {
            if (!item.ActorInputParam) {
              msg += "【请填写“Java插件类地址”】";
            }
          } else if (item.ActorParser == "CustomDialogActor") {
            if (!item.ActorInputParam) {
              msg += "【请填写“JS对象名”】";
            }
            if (!item.CustomDialogType) {
              msg += "【请选择“对话框类型”】";
            }
          } else if (item.ActorParser == "RestActor") {
            if (!item.ActorInputParam) {
              msg += "【请选择“服务接口”】";
            }
          } else if (item.ActorParser == "ProcVarActor" || item.ActorParser == "SqlActor" || item.ActorParser == "XmlActor" || item.ActorParser == "CookieActor") {
            if (!item.ActorInputParam) {
              msg += "【请填写对应参数】";
            }
          }
          if (msg != "") {
            isTrue = false;
            FUI.Window.showMsg(msg);
            return false;
          }
        });
        return isTrue;
      },
      // 切换时设置初始化值
      setInitailDefaultValue(actorType) {
        var that = this;
        that.data.ActorInputParam = '';
        that.data.ActorInputParamDes = '';
        $('#baseTypeTitle').html('基准部门');
        that.data.BaseParam.BaseType = '0';
        that.data.BaseParam.BaseDes = '';
        that.data.BaseParam.BaseList = '';
        that.data.IsListPage = 'false';
        that.data.IncludeMyself = 'false';
        if (actorType == 'DirectRelationActor' || actorType == 'RelationTreeActor') {
          that.data.BaseParam.BaseType = '2';
        }
      },
      // 切换到对应的参与者显示或隐藏
      actorParserChangeShow(actorType) {
        var that = this;
        var name = '';
        that.isShowActorInputParam = false;
        that.isShowActorInputParamDes = true;
        $('#CustomDialogActorTr').hide();
        $('#BaseTypeTr').hide();
        $('#IncludeMyselfTr').hide();
        $('#IsListPageTr').hide();

        $('#selectHistoryActivity').hide();
        $('#selectSelectFormField').hide();
        $('#ActorInputTr').hide();
        $('#selectUsers').hide();
        $('#selectPosition').hide();
        $('#selectPostJob').hide();
        $('#selectRoles').hide();
        $('#selectOrg2').hide();
        $('#selectDepartLeaderRelationType').hide();
        $('#selectRelationType').hide();
        $("#selectRelation").hide();
        $('#selectOrg').hide();
        $('#customActorBtn').hide();
        $('#helperBtn').hide();
        $('#DirectTypeTr').hide();
        $('#RelationTypeTr').hide();
        $('#DrillLevelNumTr').hide();
        $('#selectDataService').hide();
        switch (actorType) {
          case 'MainProcCreatorActor':
            name = '主流程发起人';
            $('#ActorInputParamDes').hide();
            break;
          case 'ProcCreatorActor':
            name = '本流程发起人';
            $('#ActorInputParamDes').hide();
            break;
          case 'CurrentLoginActor':
            name = '当前登录用户';
            $('#ActorInputParamDes').hide();
            break;
          case 'FreeChoiceActor': {
            name = '自由选择参与者';
          }
            break;
          case 'AssignActor':
            name = '账号用户名';
            $('#ActorInputTr').show();
            $('#selectUsers').show();
            $('#BaseTypeTr').show();
            break;
          case 'PositionActor':
            name = '岗位名称';
            $('#ActorInputTr').show();
            $('#selectPosition').show();
            $('#BaseTypeTr').hide();
            break;
          case 'PostJobActor':
            name = '职务（岗位类型）名称';
            $('#ActorInputTr').show();
            $('#selectPostJob').show();
            $('#BaseTypeTr').show();
            break;
          case 'ChilredDeaprtPostJobActor': {
            name = '职务名称';
            $('#IncludeMyselfTr').show();
            $('#IsListPageTr').hide();
            $("#RelationTypeTr").show();
            $('#ActorInputTr').show();
            $('#selectPostJob').show();
            $('#BaseTypeTr').show();
          } break;
          case 'ParentDepartPostJobActor': {
            name = '职务名称';
            $('#IncludeMyselfTr').show();
            $('#IsListPageTr').hide();
            $("#RelationTypeTr").show();
            $('#ActorInputTr').show();
            $('#selectPostJob').show();
            $('#BaseTypeTr').show();
          } break;

          case 'ChilredDeaprtRoleActor': {
            $('#IncludeMyselfTr').show();
            $('#IsListPageTr').hide();
            $('#selectRoles').show();
            $("#RelationTypeTr").show();

            name = '角色名';
            $('#ActorInputTr').show();
            $('#selectRoles').show();
            $('#BaseTypeTr').show();
          } break;
          case 'ParentDepartRoleActor': {
            $('#IncludeMyselfTr').show();
            $('#IsListPageTr').hide();
            $('#selectRoles').show();
            $("#RelationTypeTr").show();
            name = '角色名';
            $('#ActorInputTr').show();
            $('#selectRoles').show();
            $('#BaseTypeTr').show();
          } break;
          case 'RoleActor': {
            name = '角色名';
            $('#ActorInputTr').show();
            $('#selectRoles').show();
            $('#BaseTypeTr').show();
            //$('#IsListPageTr').show();
          }
            break;
          case 'DirectRelationActor': {
            name = '直线关系参与者';
            $('#ActorInputTr').show();
            $('#DirectTypeTr').show();
            $('#selectRoles').hide();
            $('#selectRelationType').show();
            $('#BaseTypeTr').show();
            $('#baseTypeTitle').html('基准人类型');
          }
            break;
          case 'RelationTreeActor': {
            name = '汇报树';
            $('#ActorInputTr').show();
            $('#DirectTypeTr').show();
            $("#RelationTypeTr").show();
            $('#DrillLevelNumTr').show();
            $('#selectRoles').hide();
            $('#selectRelation').show();
            $('#BaseTypeTr').show();
            $('#baseTypeTitle').html('基准人类型');
          }
            break;
          case 'DepartAssignLeaderActor': {
            name = '部门分管领导';
            $('#ActorInputTr').show();
            $('#DirectTypeTr').hide();
            $('#selectDepartLeaderRelationType').show();

            $('#BaseTypeTr').show();
          }
            break;
          case 'SmartFormFieldActor': {
            name = '在线表单字段';
            $('#ActorInputTr').show();
            $('#selectSelectFormField').show();
          }
            break;
          case 'HistoryActivityActor': {
            name = '环节名称';
            $('#ActorInputTr').show();
            $('#selectHistoryActivity').show();
          }
            break;
          case 'CustomDialogActor': {
            name = 'JS对象名';
            that.isShowActorInputParam = true;
            that.isShowActorInputParamDes = false;
            $('#ActorInputTr').show();
            $('#CustomDialogActorTr').show();
          }
            break;
          case 'DepartActor': {
            name = '部门名称';
            $('#ActorInputTr').hide();
            $('#BaseTypeTr').show();
          }
            break;
          case 'RestActor': {
            name = '数据服务接口';
            $('#ActorInputTr').show();
            $('#helperBtn').hide();
            $('#selectUsers').hide();
            $('#selectDataService').show();
            that.isShowActorInputParam = false;
            that.isShowActorInputParamDes = true;
          }
            break;
          case 'AssemblyActor': {
            name = 'Java类全名';
            $('#ActorInputTr').show();
            $('#helperBtn').show();
            $('#helperBtn').show();
            that.isShowActorInputParam = true;
            that.isShowActorInputParamDes = false;
          }
            break;
          case 'SqlActor': {
            name = 'Sql语句';
            $('#ActorInputTr').show();
            $('#helperBtn').show();
            that.isShowActorInputParam = true;
            that.isShowActorInputParamDes = false;
          }
            break;
          case 'ProcVarActor': {
            name = '流程变量';
            $('#ActorInputTr').show();
            $('#helperBtn').show();
            that.isShowActorInputParam = true;
            that.isShowActorInputParamDes = false;
          }
            break;
          case 'XmlActor': {
            name = 'XML文件名地址';
            $('#ActorInputTr').show();
            $('#helperBtn').show();
            that.isShowActorInputParam = true;
            that.isShowActorInputParamDes = false;
          }
            break;
          case 'CookieActor': {
            name = 'Cookie名称(大写)';
            $('#ActorInputTr').show();
            $('#helperBtn').show();
            that.isShowActorInputParam = true;
            that.isShowActorInputParamDes = false;
          }
            break;
          default: {
            name = $('#ActorParser option:selected').text();
            $('#ActorInputTr').show();
            $('#customActorBtn').show();
          }
        }
        that.ActorInputParamText = name;
        // 不考虑这种情况
        $('#IsListPageTr').hide();
        //初始化显示或隐藏基准参数
        that.showBaseTr(that.data.BaseParam.BaseType);
      },
      baseTypeChange(selectValue) {
        var that = this;
        that.data.BaseParam.BaseDes = '';
        that.data.BaseParam.BaseList = '';
        that.showBaseTr(selectValue);
      }, // 基准部门参数显示控制

      showBaseTr(baseType) {
        baseType = baseType.toString();
        var that = this;
        that.isShowBaseList = false;
        that.isShowBaseDes = true;
        $('#selectDepart').hide();
        $('#selectHistoryActivityDepart').hide();
        $('#selectBaseFormUserIdField').hide();
        $('#selectUsersOfBaseParm').hide();
        if (baseType == '4' || baseType == '5' || baseType == '6' || baseType == '7' || baseType == '11' || baseType == '8' || baseType == '9' || baseType == '10') {
          $('#BaseTr').show();
          $('#BaseList').hide();
          $('#BaseDes').show();
          if (baseType == '4') {
            $('#selectDepart').show();
          }
          else if (baseType == '5') { $('#selectHistoryActivityDepart').show(); }
          else if (baseType == '9' || baseType == '10') { $('#selectBaseFormUserIdField').show(); }
          else if (baseType == '6') { $('#selectUsersOfBaseParm').show(); }
          else if (baseType == '7' || baseType == '11') {
            $('#BaseList').show();
            that.isShowBaseList = true;
            that.isShowBaseDes = false;
            $('#BaseDes').hide();
          } else if (baseType == '8') {
            $('#BaseList').show();
            that.isShowBaseList = true;
            that.isShowBaseDes = false;
            $('#BaseDes').hide();
          }
        } else {
          $('#BaseTr').hide();
        }
      },
      showParmValue() {
        var that = this;
        alert(JSON.stringify(that.data));
      },
      onClearEmpty(id) {
        var that = this;
        that.data[id] = '';
        that.data[id + 'Des'] = '';
      },
      showInputParam(inputId) {
        var that = this;
        FUI.Window.showMsg(that.data[inputId], null, 1);
      },
      cleanEmptyBase(id) {
        var that = this;
        that.data.BaseParam[id] = '';
        that.data.BaseParam['BaseDes'] = '';
      },
      dataSelectHistoryActivity(inputId, inputText) {
        var that = this;
        WF.SelectorDialog.selectorTextValue(that, inputId, inputText, 'HistoryActivity', {
          wid: that.wid
        }, false);
      },
      selectHistoryActivity(inputId, inputText) {
        var that = this;
        WF.SelectorDialog.selectorTextValue(that, inputId, inputText, 'HistoryActivity', {
          wid: that.wid
        }, false, null, that.data.BaseParam);
      },
      selectorTextValueOfBaseParam(inputKey, inputName, type, passParm, singleSelect, valueIsJson) {
        var that = this;
        WF.SelectorDialog.selectorTextValue(that, inputKey, inputName, type, passParm, singleSelect, valueIsJson, that.data.BaseParam);
      },
      selectorTextValue(inputKey, inputName, type, passParm, singleSelect, valueIsJson) {
        var that = this;
        WF.SelectorDialog.selectorTextValue(that, inputKey, inputName, type, passParm, singleSelect, valueIsJson);
      },
      selectorUserTextValueOfBaseParam(inputKey, inputName, passParm, singleSelect, keyName, width, height) {
        var that = this;
        WF.SelectorDialog.selectorUserTextValue(that, inputKey, inputName, passParm, singleSelect, keyName, width, height, that.data.BaseParam);
      },
      selectorUserTextValue(inputKey, inputName, passParm, singleSelect, keyName, width, height) {
        var that = this;
        WF.SelectorDialog.selectorUserTextValue(that, inputKey, inputName, passParm, singleSelect, keyName, width, height);
      },
      selectorPositionTextValue(inputKey, inputName, singleSelect) {
        var that = this;
        var inputKeyIsJson = true;
        var isTextValue = true;
        var subVueObj = null;
        var passParm = null;
        WF.SelectorDialog.selectPosition(that, subVueObj, inputKey, inputName, singleSelect, inputKeyIsJson, isTextValue, passParm);
      },
      selectorPostJobTextValue(inputKey, inputName, singleSelect) {
        var that = this;
        var inputKeyIsJson = true;
        var subVueObj = null;
        var passParm = null;
        WF.SelectorDialog.selectPostJobTextValue(that, subVueObj, inputKey, inputName, singleSelect, inputKeyIsJson, passParm);
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
      selectDataDict(inputId, inputName, configType, passParm, singleSelect, resultKeyIsJson) {
        var that = this;
        WF.SelectorDialog.selectDataDict(that, inputId, inputName, configType, passParm, singleSelect, resultKeyIsJson);
      },
      //选择关系类型
      selectRelationType(inputId, inputName, infoType, passParm, singleSelect, resultKeyIsJson) {
        var that = this;
        WF.SelectorDialog.selectRelationType(that, inputId, inputName, infoType, null, singleSelect, resultKeyIsJson);
      }
      //选择汇报树
      , selectRelation(inputId, inputName, passParm, singleSelect, resultKeyIsJson) {
        var that = this;
        WF.SelectorDialog.selectRelation(that, inputId, inputName, null, singleSelect, resultKeyIsJson);
      }
      , selectorFormField(inputId, inputName, singleSelect, subDataName) {
        var that = this;
        var subObj = null;
        if (subDataName) {
          subObj = that.data[subDataName];
        }
        WF.SelectorDialog.selectorFormField(that, null, that.wid, inputId, inputName, singleSelect, subObj);
      },
      inputHelper() {
        var that = this;
        $('#inputHelper').toggle();
        var actoryType = that.data.ActorParser;
        $('#inputHelper div').hide();
        $('.' + actoryType).show();
      },
      showOrHideTarget(targetId) {
        var that = this;
        $('#' + targetId).toggle();
      },
      buildDefaultActor() {
        var that = this;

        var defActorOptions = that.getDefaultActorOptions();
        var defaultActor = {
          ActorId: Object.toGuid(),
          OrderNum: '1',
          ActorParser: 'CurrentLoginActor',
          ActorDescription: '当前登录用户参与者',
          ActorInputParam: '',
          ActorInputParamDes: '',
          RelationTypeParamDes: "",
          RelationTypeParam: "",
          DrillLevelNum: 1,
          BaseParam: { BaseType: '0', IncludeMyself: 'false', BaseList: '', BaseDes: '' },
          CalculationRule: 'UnionAll',
          IsListPage: 'false',
          CustomDialogType: '',
          DirectType: '',
          ActorOptions: defActorOptions

        };
        return defaultActor;
      },
      //默认的扩展属性
      getDefaultActorOptions() {
        //获取默认的参与者属性结构
        var that = this;
        //isDepLeaderDillParentDepLeader:如果当前基准人是部门领导则钻取基准人的上一级部门领导
        //javaParms:java插件类的自定义参数，值为字符串形式，最后通过反射传入自定义的Java插件中，Java插件类传属的参数
        //extendParms:有流程引擎源码时，才能使用到，会原样传入到解析中，所有选择器都会有的扩展参数
        //findRelationLabelStopType:上级（下级）部门角色参与者钻取标签时的停止条件：找到第一个，找所有
        var options = { isDrillParentWhenUserIsDepLeader: false, javaParms: "", extendParms: "", findRelationLabelStopType: "first" };
        return Object.toDeepClone(options);

      }
      // $(this).attr("Text")取属性
      // $(this).text() 取内容
      // Xml参与者转Json
      , actorXmlToJson(xml) {
        var that = this;
        var doc = $(Object.toCreateXmlDoc(xml));
        return that.xmlObjectToJson(doc);
      },

      // Xml对象
      xmlObjectToJson(doc) {
        var that = this;
        var json = {};
        var actor = doc;
        json.ActorId = actor.attr('ActorId');
        json.OrderNum = actor.attr('OrderNum');
        json.ActorParser = actor.attr('ActorParser');
        json.ActorDescription = actor.attr('ActorDescription');
        json.CalculationRule = actor.find('CalculationRule').text();
        json.IsListPage = actor.find('IsListPage').text();
        json.DirectType = actor.find('DirectType').text();
        json.CustomDialogType = actor.find('CustomDialogType ').text();
        json.ActorInputParam = that.recoverData(actor.find('ActorInputParam').text());
        json.ActorInputParamDes = actor.find('ActorInputParamDes').text();

        json.RelationTypeParamDes = actor.find('RelationTypeParamDes').text();
        json.RelationTypeParam = actor.find('RelationTypeParam').text();
        json.DrillLevelNum = actor.find('DrillLevelNum').text();
        var optionsStr = that.recoverData(actor.find('ActorOptions').text());
        json.ActorOptions = optionsStr ? eval("(" + optionsStr + ")") : that.getDefaultActorOptions();
        json.BaseParam = {};
        if (actor.find('BaseDepartParam').length > 0) {
          json.BaseParam.BaseType = actor.find('BaseDepartParam>BaseDepartType').text();
          json.BaseParam.IncludeMyself = actor.find('BaseDepartParam>IncludeMyselfDepart').text();
          json.BaseParam.BaseList = actor.find('BaseDepartParam>BaseDepart').text();
          json.BaseParam.BaseDes = actor.find('BaseDepartParam>BaseDepart').attr('BaseDes');
        } else {
          json.BaseParam.BaseType = actor.find('BaseParam>BaseType').text();
          json.BaseParam.IncludeMyself = actor.find('BaseParam>IncludeMyself').text();
          json.BaseParam.BaseList = actor.find('BaseParam>BaseList').text();
          json.BaseParam.BaseDes = actor.find('BaseParam>BaseList').attr('BaseDes');
        }

        return json;
      },

      // 所有Xml参与者转Json数组对象
      actorsXmlToJsons(xmls) {
        var that = this;
        var jsons = [];
        var doc = $(Object.toCreateXmlDoc(xmls));
        doc.find('Actors>Actor').each(function () {
          var json = that.xmlObjectToJson($(this));
          jsons.push(json);
        });
        return jsons;
      },
      // Json参与者转Xml
      actorJsonToXml(json) {
        var that = this;
        json.BaseType = json.BaseParam.BaseType;
        json.IncludeMyself = json.BaseParam.IncludeMyself;
        json.BaseList = json.BaseParam.BaseList ? json.BaseParam.BaseList : '';
        json.BaseDes = json.BaseParam.BaseDes;
        json.ActorOptions = json.ActorOptions ? that.convertData(JSON.stringify(json.ActorOptions)) : "";
        if(json.ActorInputParam){
          json.ActorInputParam=that.convertData(json.ActorInputParam);
        }
        var xml = Object.toStringFormat(that.actorXmlTemplate, json);
        return xml;
      },
      //转换特殊字符
      convertData(str) {
        str = str.replace(/</g, '〈');
        return str;
      },
      // 还原特殊字符
      recoverData(str) {
        str = str.replace(/〈/g, '<');
        return str;
      },
      // 数组参与者Json转为Xml
      actorsJsonToXml(jsons) {
        var that = this;
        var xml = '<Actors>';
        $.each(jsons, function (i, item) {
          xml += that.actorJsonToXml(item);
        });
        xml += '</Actors>';
        return xml;
      },
      getResult() {
        var that = this;
        return JSON.stringify(that.leftData);
      }
    }
  }

</script>
<style>
  .common-FormTable td {
    text-align: left;
    line-height: 25px;
  }
</style>