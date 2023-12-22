<template>
  <div class="f2bpm-page-layout advance " style="padding: 4px;">
    <el-tabs value="常规">
      <el-tab-pane label="常规" name="常规">
        <div class="pl5" style="height: 380px;overflow-y: auto;">
          <el-row>
            <el-col :span="12">
              <legend style="font-size: 12px; margin: 0px;"><i class="icon icon-feeds" /> 是否允许修改流程单标题
                <el-tooltip class="item" effect="dark" content="设置本节点是否允许修改流程单标题，另外提单节点不受限制" placement="bottom">
                  <i style="margin-left: 5px;font-weight: bold" class="fa fa-question-circle-o"> </i>
                </el-tooltip>
              </legend>
              <div class="p10">
                <el-switch v-model="data.general.isModifyProcInstTitle" active-value="true" inactive-value="false" active-text="允许" inactive-text="不允许" />
                <br><em></em>
              </div>
              <legend style="font-size: 12px; margin: 0px;"><i class="icon icon-feeds" /> 与上一节点相同审批人时自动通过
                <el-tooltip class="item" effect="dark" content="说明：只有“普通节点”才会生效" placement="bottom">
                  <i style="margin-left: 5px;font-weight: bold" class="fa fa-question-circle-o"> </i>
                </el-tooltip>
              </legend>
              <div class="p10">
                <el-switch v-model="data.general.theSameApproverAutoPass" active-value="true" inactive-value="false" active-text="启用" inactive-text="不启用" />
              </div>

              <legend style="font-size: 12px; margin: 0px;"><i class="icon icon-feeds" /> 与历史相同审批人时自动通过
                <el-tooltip class="item" effect="dark" content="" placement="bottom">
                  <div slot="content">
                    说明：与历史审批过的人（同用户ID并且同部门ID）；<br>（不包含驳回指的是：不含历史上以驳回完成待办的审批人，我作为她人的驳回目标节点）相同时自动通过，<br>只有“普通节点”才会生效

                  </div>
                  <i style="margin-left: 5px;font-weight: bold" class="fa fa-question-circle-o"> </i>
                </el-tooltip>
              </legend>
              <div class="p10">
                <el-switch v-model="data.general.theSameHistoryApproverAutoPass" active-value="true" inactive-value="false" active-text="启用" inactive-text="不启用" />
              </div>
              <!--  <legend style="font-size: 12px; margin: 0px;"><i class="icon icon-feeds" /> 是否启用阅式审批
                <el-tooltip class="item" effect="dark" content="待办打开后自动流转到下一个节点，仅对“非弹出模式”有效" placement="bottom">
                  <i style="margin-left: 5px;font-weight: bold" class="fa fa-question-circle-o"> </i>
                </el-tooltip>
              </legend>
              <div class="p10">
                <el-switch v-model="data.general.isReadAutoApproval" active-value="true" inactive-value="false" active-text="启用" inactive-text="不启用" />
              </div> -->

              <legend style="font-size: 12px; margin: 0px;"><i class="icon icon-feeds" /> 是否启用多实例分组标识
                <el-tooltip class="item" effect="dark" content="在“多实例分发”时按人员产生多实例，并对这些多实例进行分组标识，到时在“多实例聚合”时按这些分组进行汇合（多实例==》按标识汇合成多实例）。仅对“多实例分发”有效" placement="bottom">
                  <i style="margin-left: 5px;font-weight: bold" class="fa fa-question-circle-o"> </i>
                </el-tooltip>
              </legend>
              <div class="p10">
                <el-switch v-model="data.general.isDistributeStartGroup" active-value="true" inactive-value="false" active-text="启用" inactive-text="不启用" />
              </div>

              <legend style="font-size: 12px; margin: 0px;"><i class="icon icon-feeds" /> 是否启用按多实例分组聚合
                <el-tooltip class="item" effect="dark" content="在“多实例聚合”节点时按前面的多实例分组标识进行多实例聚合产生多个聚合实例。本设置仅对“多实例聚合”节点有效。" placement="bottom">
                  <i style="margin-left: 5px;font-weight: bold" class="fa fa-question-circle-o"> </i>
                </el-tooltip>
              </legend>
              <div class="p10">
                <el-switch v-model="data.general.isDistributeEndGroup" active-value="true" inactive-value="false" active-text="启用" inactive-text="不启用" />
              </div>

              <legend style="font-size: 12px; margin: 0px;"><i class="icon icon-feeds" /> 是否为多实例聚合的再次聚合
                <el-tooltip class="item" effect="dark" content="此节点的前一个节点必须是多实例聚合节点，用于聚合的总聚合。本设置仅对“多实例聚合”节点有效。" placement="bottom">
                  <i style="margin-left: 5px;font-weight: bold" class="fa fa-question-circle-o"> </i>
                </el-tooltip>
              </legend>
              <div class="p10">
                <el-switch v-model="data.general.isDistributeEndEnd" active-value="true" inactive-value="false" active-text="启用" inactive-text="不启用" />
              </div>

            </el-col>
            <el-col :span="12">
              <legend style="font-size: 12px; margin: 0px;"><i class="icon icon-feeds" /> 找不到处理人时由“流程监管员”承接作为处理人
                <el-tooltip class="item" effect="dark" content="需要在流程属性中配置“流程监管员”,仅对“非弹出模式”有效" placement="bottom">
                  <i style="margin-left: 5px;font-weight: bold" class="fa fa-question-circle-o"> </i>
                </el-tooltip>
              </legend>
              <div class="p10">
                <el-switch v-model="data.general.isNoUserTransferToMonitor" active-value="true" inactive-value="false" active-text="启用" inactive-text="不启用" />
              </div>
              <legend style="font-size: 12px; margin: 0px;"><i class="icon icon-feeds" /> 处理人为空时尝试自动通过
                <el-tooltip class="item" effect="dark" content="普通节点处理人为空时自动通过,注意前后节点之间配置的合理性，仅对“非弹出模式”有效" placement="bottom">
                  <i style="margin-left: 5px;font-weight: bold" class="fa fa-question-circle-o"> </i>
                </el-tooltip>
              </legend>
              <div class="p10">
                <el-switch v-model="data.general.isNoUserTransferToNextActivity" active-value="true" inactive-value="false" active-text="启用" inactive-text="不启用" />
              </div>
              <legend style="font-size: 12px; margin: 0px;"><i class="icon icon-feeds" />同一节点再次进入时自动通过
                <el-tooltip class="item" effect="dark" content="与历史已正常审批节点（不包含以驳回方式完成的节点或者我作为她人的驳回目标节点）相同时自动通过，仅对“普通节点”有效" placement="bottom">
                  <i style="margin-left: 5px;font-weight: bold" class="fa fa-question-circle-o"> </i>
                </el-tooltip>
              </legend>
              <div class="p10">
                <el-switch v-model="data.general.comeInAgainWhetherAutoApprove" active-value="true" inactive-value="false" active-text="启用" inactive-text="不启用" />
              </div>

              <legend style="font-size: 12px; margin: 0px;"><i class="icon icon-feeds" /> 直来直往返回时人员重新计算
                <el-tooltip class="item" effect="dark" content="" placement="bottom">
                  <div slot="content">
                    直来直往返回时人员重新计算，由于直来直往是跨节点打破规则返回，<br>在计算时人员所配置的策略有些依懒当前节点环境；<br>注意设计的合理性，并行节点，聚合节点不支持此项功能。
                  </div>
                  <i style="margin-left: 5px;font-weight: bold" class="fa fa-question-circle-o"> </i>
                </el-tooltip>
              </legend>
              <div class="p10">
                <el-switch v-model="data.general.rejectDirectBackRecalculateActor" active-value="true" inactive-value="false" active-text="启用" inactive-text="不启用" />
              </div>



              <legend style="font-size: 12px; margin: 0px;"><i class="icon icon-feeds" /> 调用Rest接口判断是否自动审批通过
                <el-tooltip class="item" effect="dark" content="当进入此节点后将触发调用Rest接口进行判断是否自动审批通过，注意此功能在“会签节点”将不生效。" placement="bottom">
                  <i style="margin-left: 5px;font-weight: bold" class="fa fa-question-circle-o"> </i>
                </el-tooltip>
              </legend>
              <div class="p10">
                <el-switch v-model="data.general.restAutoApprove" active-value="true" inactive-value="false" active-text="启用" inactive-text="不启用" />
                <div class="p10 line" v-if="data.general.restAutoApprove=='true'">
                  <el-input v-model="data.general.restAutoApproveParmsTempTitle" size="mini" style="margin-bottom: 5px;" :disabled="true" placeholder="请选择数据服务Rest接口" />
                  <a href="javascript:void(0)" title="选择数据服务" @click="selectDataService('restAutoApproveParms','restAutoApproveParmsTempTitle','general')"><i class="fa fa-search" />选择数据服务</a>
                  <a href="javascript:void(0)" @click="showInputParam('restAutoApproveParms','general')"><i class="fa fa-search ml5" aria-hidden="true" />查看值</a>
                </div>
              </div>
              <legend style="font-size: 12px; margin: 0px;"><i class="icon icon-feeds" /> 查看状态下在工具栏显示“编辑”按钮 
                <el-tooltip class="item" effect="dark"   placement="bottom">
                  <div slot="content">
                    开启后任何人在查看此流程表单时（查看状态下）左上角工具栏将出现“编辑”按钮，<br>用户通过点击“编辑”按钮来获取是否允许修改的资格（资格由JS开发返回）。  
                  </div>
                  <i style="margin-left: 5px;font-weight: bold" class="fa fa-question-circle-o"> </i>
                </el-tooltip>
              </legend>
              <div class="p10">
                <el-switch v-model="data.general.isOpenFixEdit" active-value="true" inactive-value="false" active-text="启用" inactive-text="不启用" />
                
              </div>

            </el-col>
          </el-row>
        </div>
      </el-tab-pane>
      <el-tab-pane label="自由跳设置" name="自由跳设置">
        <div class="layui-tab-item " title="自由跳设置" style="padding: 3px;">
          <div>
            <div class="fence-box" style="width: 200px; height: 380px; text-align: left;">
              是否自由跳：
              <el-switch v-model="data.freejump.isFreeJump" active-value="1" inactive-value="0" active-text="是" inactive-text="否" />
              <br> <br> <span>说明：自由跳一般由于简单流程，如串行流程等。
                <br> 右侧可指定自由跳的目标节点范围。如不指定则系统默为可跳的所有目标节点。
                <br> 自由跳只能用于手动弹窗再次选择模式
              </span>
            </div>
            <div class="fence-box" style="height: 380px;">
              <div class="fence-box-title">
                <i class="fa fa-cube" aria-hidden="true" />可选节点（单击选择）：
              </div>
              <div class="fence-inner-line column-height" style="width: 200px">
                <ul id="listJumpActs">
                  <li v-for="item in leftJumpData" class="fence-li-item" :activityid="item.activityId" :activityname="item.activityName" :activitycode="item.activityCode" @click="leftJumpSelected(item.activityId)">
                    {{ item.stepId }}-{{ item.activityName }}
                  </li>
                </ul>
              </div>
            </div>
            <div class="fence-box" style="width: 200px;height: 380px;">
              <div class="fence-box-title">
                <i class="fa fa-cubes" aria-hidden="true" />已选节点(单击删除)：
              </div>
              <div id="result-boxlist" style="height: 340px;">
                <ul id="listFreejumpResult">
                  <li v-for="item in rightJumpData" class="fence-li-item" :activityid="item.activityId" :activityname="item.activityName" :activitycode="item.activityCode" @click="rightJumpSelected(item.activityId)">
                    {{ item.stepId }}-{{ item.activityName }}
                  </li>
                </ul>
              </div>
              <div style="text-align: left">
                <span class="cur red" @click="clearAll"><i class="fa fa-minus-circle" />清空所选</span>
              </div>
            </div>
          </div>
        </div>
      </el-tab-pane>
      <!--   <el-tab-pane label="自定义流" name="自定义流">
        <div style="padding: 10px;height: 380px;">
          是否为自定义流：
          <el-switch v-model="data.freeflow.isFreeflow" active-value="1" inactive-value="0" active-text="是" inactive-text="否" />
          <br> <br>
          <span>1.“自定义流”-流转模式的其中一种，是指流程节点不是由流程管理员事先设计好的流程，而是由处理人进行流程的节点设计。处理人可以是发起人也可以是本节点的前一个节点处理人。
            <br>2.“自由定义流”只针对循环节点的设置有效.
            <br>3.“自由定义流”所在的循环节点的上一节点“提交方式”必须是"弹窗手动选择模式".
          </span>
        </div>
      </el-tab-pane> -->
      <el-tab-pane label="会签响应参数" name="会签响应参数">
        <div class="layui-tab-item overauto" title="响应方式参数" closable="false" style="padding:3px;height: 430px;">
          <legend style="font-size: 12px; margin: 0px;"><i class="icon icon-feeds"></i> 再次进入会签节点时的审批策略</legend>
          <div class="p10 line">
            <el-radio-group v-model="data.dynamicsign.againInComeApproveType" style="font-size: 12px;">
              <el-radio label="needAllApprove">默认(所有人都需要审批)</el-radio>
              <el-radio label="noNeedApprove">已审批过人员不再审批（慎用）</el-radio>
            </el-radio-group>
            <div v-if="data.dynamicsign.againInComeApproveType=='noNeedApprove'">
              <legend style="font-size: 12px; margin: 10px;">当所有人都已办理过时</legend>
              <div class="p10 line">
                <el-radio-group v-model="data.dynamicsign.againInComeApproveTypeWay" style="font-size: 12px;">
                  <el-radio label="gotoNextActivity">(默认)尝试流转到下一节点</el-radio>
                  <el-radio label="needAllApprove">所有人员都需要再次审批</el-radio>
                </el-radio-group>
              </div>
            </div>
          </div>


          <legend style="font-size: 12px; margin: 0px;"><i class="icon icon-feeds"></i>会签动态计算参数</legend>
          <div class="p10 line">
            <el-radio-group v-model="data.dynamicsign.respondtype">
              <el-radio label="percent">百分比</el-radio>
              <el-radio label="amount">指定数量</el-radio>
              <el-radio label="voteApproAction">审核菜单投票结果</el-radio>
            </el-radio-group>
            <span v-if="data.dynamicsign.respondtype=='percent'">填写百分比：
              <el-input-number v-model="data.dynamicsign.numbervalue" :min="1" :max="100" label="百分比" />%
            </span>
            <span v-if="data.dynamicsign.respondtype=='amount'">填写数量：
              <el-input-number v-model="data.dynamicsign.numbervalue" :min="1" :max="100" label="指定数量" />
            </span>
            <span v-if="data.dynamicsign.respondtype=='voteApproAction'">
              <div class="line p10" style="line-height:20px">
                <div class="mb10">
                  <el-radio-group v-model="data.dynamicsign.voteApproActionType" style="font-size: 12px;">
                    <el-radio label="all">待所有人都提交才触发</el-radio>
                    <el-radio label="immediate">满足条件即时触发</el-radio>
                  </el-radio-group>
                </div>
                审核菜单投票结果：根据会签的处理人提交“审核菜单”项满足规定的数量时计算其结果。
                比如有三个审核菜单：“同意”，“不同意”，“弃权”，根据满足多少票同意结果即为同意，满足多少票不同意结果即为不同意。其数量阀值在“审核菜单”配置中设置。

              </div>

            </span>
          </div>

          <div>
            <legend style="font-size: 12px; margin: 0px; margin-bottom: 5px;"><i class="icon icon-feeds"></i>会签审批顺序规则</legend>
            <div class="line p10" style="line-height:20px">
              <span style="margin-bottom: 5px; display: block;">
                <el-radio v-model="data.dynamicsign.approOrderType" label="none" @change="approOrderTypeChange">无</el-radio>
              </span>
              <span style="margin-bottom: 5px; display: block;">
                <el-radio v-model="data.dynamicsign.approOrderType" label="assign" @change="approOrderTypeChange">按指定用户顺序（按配置的指定用户顺序）</el-radio>
              </span>
              <span style="margin-bottom: 5px; display: none;">
                <el-radio v-model="data.dynamicsign.approOrderType" label="userattr" @change="approOrderTypeChange">按用户扩展属性</el-radio>
                <input name="userattr" class="textBoxMinShort" value="">
              </span>

              <span style="margin-bottom: 5px; display: block;">
                <el-radio v-model="data.dynamicsign.approOrderType" label="custom" @change="approOrderTypeChange"> 按自定义扩展规则：</el-radio>
                <br>
                <el-input v-if="data.dynamicsign.approOrderType=='custom'" v-model="data.dynamicsign.approOrderValue" placeholder="填写Java插件类" />
                <br>说明： 从扩展Java插件类中获用户会签时的审批顺序号：即填写你的Java实现类，填写全类名，包括命名空间，
                如参考示例：com.f2bpm.demo.customExtension.DemoAssembleApprovalOrderRule
              </span>

              <span style="margin-bottom: 5px; display: block;">
                <el-radio v-model="data.dynamicsign.approOrderType" label="tableview" @change="approOrderTypeChange"> 从指定的表或视图中取：</el-radio>
                <br>
                <el-input v-if="data.dynamicsign.approOrderType=='tableview'" v-model="data.dynamicsign.approOrderValue" placeholder="填写表名视图名" />
                <br>说明： 从指定的表或视图中获取用户的审批顺序号，可用占位符变量：用户ID：#userId#、节点ID：#activityId#、流程定义ID：#workflowId#，表或视图中必须有的字段：用户userId和审批顺序号“approOrderNo”（数字）
              </span>

              <span style="margin-bottom: 5px; display: block;">
                <el-radio v-model="data.dynamicsign.approOrderType" label="sql" @change="approOrderTypeChange"> 从自定义Sql中获取：</el-radio>
                <br>
                <el-input v-if="data.dynamicsign.approOrderType=='sql'" v-model="data.dynamicsign.approOrderValue" style="width: 580px;" placeholder="填写Sql语句" />
                <br>说明： 从指定的单条Sql语句中获取，可用占位符变量：用户ID：#userId#、节点ID：#activityId#、流程定义ID：#workflowId#，返回的字段中必须有“approOrderNo”（数字），并且结果只能返回一条数据。示例select mylevelnum "approOrderNo" from mytable where acc=#userId#
              </span>
            </div>
          </div>

          <div style="border-top: 1px solid; display: none;" class="p10">
            <span>一票制：</span> 一票制是指在动态响应方式计算中如果有一票制中的处理人进行了任务处理，那即会签立即结束，不再等候其它人处理，按一票制处理人的结果作为结果。举例：如果设置为50%的会签响应方式，此时进行到30%的人已经处理了，此时 特权处理人如果进行了任务处理，而不需要等到50%就可以结束会签。
          </div>

        </div>

      </el-tab-pane>
      <el-tab-pane label="自动传阅" name="自动传阅">
        <div class="line p10">
          <legend style="font-size: 12px; margin: 0px; margin-bottom: 5px;"><i class="icon icon-feeds"></i>自动传阅给下面用户</legend>
          <div>
            <div style="margin-bottom: 5px;">
              <el-input v-model="data.autoCirculated.autoRelaNames" style="width: 80%;margin-bottom: 5px;" size="mini" readonly placeholder="请选择自动传阅的目标用户" class="textBoxLong" />
                <a   href="javascript:void(0)" class="ml5" title="选择用户" @click="selectorUserTextValue('autoUsers','autoRelaNames',null,false,'account');"> <i class="fa fa-search" />选择用户</a>
              <span class="cur red" @click="onClearAutoCirculated('autoUsers','autoRelaNames')"><i class="fa fa-minus-circle  ml5" aria-hidden="true" />清空</span>
            </div>
            <div style="margin-bottom: 5px;">
              <el-input v-model="data.autoCirculated.autoRoleNames" style="width: 80%;margin-bottom: 5px;" size="mini"  readonly placeholder="请选择自动传阅的目标角色" class="textBoxLong" />
               <a  href="javascript:void(0)" class="ml5"  title="选择角色" @click="selectorTextValue('autoRoles','autoRoleNames', 'Role');"> <i class="fa fa-search" />选择角色</a>
              <span class="cur red" @click="onClearAutoCirculated('autoRoles','autoRoleNames')"><i class="fa fa-minus-circle  ml5" aria-hidden="true" />清空</span>
            </div>
            <legend style="font-size: 12px; margin: 0px; margin-bottom: 5px;"><i class="icon icon-feeds"></i>传阅的意见</legend>
            <div>
              <el-input v-model="data.autoCirculated.opinion" style="width: 90%" size="mini" placeholder="如有需要，可填写需要传阅的意见" />
            </div>
          </div>
          <div style="border-bottom: 1px solid;" class="p10">
            <span>自动传阅：</span>自动传阅是指流程从当前节点关闭后审批至下一节点时触发，会自动传阅给指定的人员。本配置传阅用户是在当前节点中配置。比如当前正在进行A节点审批到B节点，A节点即为当前节点。
          </div>
        </div>

      </el-tab-pane>

      <el-tab-pane label="审核菜单" name="审核菜单">
        <div class="line p10">
          <div>
            <div class="fence-box" style="width:550px;  height:380px; text-align: left;float: left;line-height: 20px;">
              是否启用：
              <el-switch v-model="data.approvalAction.isApproMenuEnabled" active-value="1" inactive-value="0" active-text="是" inactive-text="否" />

              <div style="margin-top: 10px;">
                菜单名称:<br>
                <div>
                  <el-input v-model="approName" size="mini" style="width:150px;margin: 5px;" placeholder="请输入菜单名称" />
                  阀值：<el-checkbox v-model="conditionNumIsAll" @change="conditionNumIsAllChange">所有人</el-checkbox>
                  &nbsp;
                  <el-input-number v-if="!conditionNumIsAll" v-model="conditionNum" size="mini" :min="0" :max="10000" label="阀值数量" />
                </div>

                <el-button plain type="primary" size="mini" style="margin: 5px;" @click="addApprovalAction">添加菜单</el-button>
                <el-button plain type="primary" size="mini" style="margin: 5px;" title="快速添加：同意，不同意等常用菜单" @click="addApprovalAction('default')">快速添加常用菜单</el-button>
              </div>
              <br><br><span>说明：审核菜单是提供给用户审批时的路径条件，如：同意、不同意、弃权、审核通过、审核不通过、同意A方案、同意B方案、接受收入、拒绝收文等自定义菜单。后面的数字是投票数量阀值（仅在会签中使用）。阀值勾选所有人时表示所有人都要投此票。
              </span>
            </div>

            <div class="fence-box" style="width: 200px; height:380px; text-align: left;">
              <div class="fence-box-title">
                <i class="fa fa-cubes" aria-hidden="true" />已加菜单(双击删除)：
              </div>
              <div id="result-boxlist" style="height: 340px;">
                <ul id="listApprovalActionResult">
                  <li v-for="item in data.approvalAction.data" :text="item.approAction" :value="item.approName" title="'阀值：'+item.conditionNum" class="fence-li-item" @dblclick="deleteApprovalAction(item)">{{ item.approName }}（{{item.conditionNum==0?'所有':item.conditionNum}}票）</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="自循环设置" name="自循环设置">
        <div class="line p10">
          <div>
            启用自循环 <el-tooltip class="item" effect="dark" content="启用自循环" placement="right">
              <i style=" font-weight: bold" class="fa fa-question-circle-o"> </i>
            </el-tooltip>：
            <el-switch v-model="data.freeWhile.isFreeWhile" active-value="true" inactive-value="false" active-text="是" inactive-text="否" />
            <br><br>
            启用排他 <el-tooltip class="item" effect="dark" content="说明：当自循环条件满足时将排除自循环节点以外的其他分支。" placement="right">
              <i style=" font-weight: bold" class="fa fa-question-circle-o"> </i>
            </el-tooltip>：
            <el-switch v-model="data.freeWhile.isExclusive" active-value="true" inactive-value="false" active-text="是" inactive-text="否" />
            <br><br><span>说明：针对自循环节点的设置，启动后自循环只有在条件不满足时才停止循环。
            </span>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="外嵌子流程设置" name="外嵌子流程设置">

        <el-row>
          <el-col :span="12">
            <div class="line p10">
              <legend style="font-size: 12px; margin: 0px;"><i class="icon icon-feeds" />开启外嵌子流程多实例
                <el-tooltip class="item" effect="dark" content="是否启用外嵌子流程多实例，仅对“外嵌子流程节点”有效" placement="bottom">
                  <i style="margin-left: 5px;font-weight: bold" class="fa fa-question-circle-o"> </i>
                </el-tooltip>
              </legend>
              <div class="p10">
                <el-switch v-model="data.general.isSubWorkflowMultiInst" active-value="true" inactive-value="false" active-text="启用" inactive-text="不启用" />
              </div>
              <legend style="font-size: 12px; margin: 0px;"><i class="icon icon-feeds" />外嵌子流程使用主流程表单
                <el-tooltip class="item" effect="dark" content="子流程使用主流程表单，仅对“外嵌子流程节点”有效" placement="bottom">
                  <i style="margin-left: 5px;font-weight: bold" class="fa fa-question-circle-o"> </i>
                </el-tooltip>
              </legend>
              <div class="p10">
                <el-switch v-model="data.general.isSubWorkflowUseMainForm" active-value="true" inactive-value="false" active-text="启用" inactive-text="不启用" />
              </div>
              <legend style="font-size: 12px; margin: 0px;"><i class="icon icon-feeds" />外嵌子流程是否允许驳回主流程
                <el-tooltip class="item" effect="dark" content="外嵌子流程是否允许驳回主流程，并且子流程对应的节点驳回节点不能是“指定驳回历史节点”，驳回模式复杂对流转影响重大，请警慎设置。仅对“外嵌子流程节点”有效" placement="bottom">
                  <i style="margin-left: 5px;font-weight: bold" class="fa fa-question-circle-o"> </i>
                </el-tooltip>
              </legend>
              <div class="p10">
                <el-switch v-model="data.general.isCanRejectToMainWorkflow" active-value="true" inactive-value="false" active-text="启用" inactive-text="不启用" />
              </div>
              <legend style="font-size: 12px; margin: 0px;"><i class="icon icon-feeds" />外嵌子流程是否仅能驳回主流程
                <el-tooltip class="item" effect="dark" content="开启后子流程仅能驳回到主流程，并且子流程对应的节点驳回节点不能是“指定驳回历史节点”，驳回模式复杂对流转影响重大，请警慎设置。仅对“外嵌子流程节点”有效" placement="bottom">
                  <i style="margin-left: 5px;font-weight: bold" class="fa fa-question-circle-o"> </i>
                </el-tooltip>
              </legend>
              <div class="p10">
                <el-switch v-model="data.general.isOnlyCanRejectToMainWorkflow" active-value="true" inactive-value="false" active-text="启用" inactive-text="不启用" />
              </div>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="line p10">
              <legend style="font-size: 12px; margin: 0px;"><i class="icon icon-feeds" />按什么产生多实例
                <el-tooltip class="item" effect="dark" content="子流程多实例按什么方式产生多实例，默认按选择的处理人产生多实例即一个人产生一个子流程实例，仅对“外嵌子流程节点”有效" placement="bottom">
                  <i style="margin-left: 5px;font-weight: bold" class="fa fa-question-circle-o"> </i>
                </el-tooltip>
              </legend>
              <div class="p10">
                <el-radio-group v-model="data.general.subWorkflowMultiInstGenerateType" style="font-size: 12px;">
                  <el-radio label="default">默认(选择的人处理人)</el-radio>
                  <el-radio label="formField">按表单分组字段</el-radio>
                </el-radio-group>
                <div v-if="data.general.subWorkflowMultiInstGenerateType=='formField'">
                  <div class="p10 line">
                    <legend style="font-size: 12px; margin: 10px;">按表单分组字段 <a href="javascript:void(0)" @click="selectorFormField('subWorkflowMultiInstFormField', null,true,'general')"><i class="fa fa-search" />选择</a></legend>
                    <el-input clearable v-model="data.general.subWorkflowMultiInstFormField" style="width:90%;margin-bottom: 5px;" size="mini" placeholder="按表中哪具字段取值去重进行分组" class="textBoxLong mr4" />

                    <legend style="font-size: 12px; margin: 10px;">子流程处理人ID字段 <a href="javascript:void(0)" @click="selectorFormField('subWorkflowUserIdRelFormField', null,true,'general')"><i class="fa fa-search" />选择</a></legend>
                    <el-input clearable v-model="data.general.subWorkflowUserIdRelFormField" style="width: 90%;margin-bottom: 5px;" size="mini" placeholder="即表中存放处理人ID所在字段名" class="textBoxLong mr4" />

                    <legend style="font-size: 12px; margin: 10px;">回写子流程实例ID字段<a href="javascript:void(0)" @click="selectorFormField('subWorkflowWiidRelFormField', null,true,'general')"><i class="fa fa-search" />选择</a></legend>
                    <el-input clearable v-model="data.general.subWorkflowWiidRelFormField" style="width: 90%;margin-bottom: 5px;" size="mini" placeholder="即表中存放子流程实例ID所在字段名" class="textBoxLong mr4" />

                  </div>
                </div>
              </div>
            </div>
          </el-col>
        </el-row>
      </el-tab-pane>
    </el-tabs>

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
        defaultApproActons: ['同意', '不同意'],
        approName: '',
        conditionNum: 1,
        conditionNumIsAll: false,
        attrName: '',
        // 页面加载时的原始数据结构为数组[{"opttype" : "general","params" : paramsObj},{}]
        initailData: null,
        currentItem: {},
        leftJumpData: [],
        rightJumpData: [],
        data: {
          general: {
            theSameApproverAutoPass: 'false',
            theSameHistoryApproverAutoPass: 'false',
            isModifyProcInstTitle: 'false',
            isReadAutoApproval: 'false',
            isNoUserTransferToMonitor: 'false',
            isNoUserTransferToNextActivity: 'false',
            comeInAgainWhetherAutoApprove: 'false',
            rejectDirectBackRecalculateActor: 'false',
            isOpenFixEdit:'false',
            restAutoApprove: 'false',
            restAutoApproveParms: '',
            restAutoApproveParmsTempTitle: '',
          

            isSubWorkflowMultiInst: 'false',
            subWorkflowMultiInstGenerateType: "",
            subWorkflowMultiInstFormField: "",
            subWorkflowWiidRelFormField: "",
            subWorkflowUserIdRelFormField: "",
            isSubWorkflowUseMainForm: 'true',
            isCanRejectToMainWorkflow: 'false',
            isOnlyCanRejectToMainWorkflow: 'false',
            isDistributeStartGroup: 'false',
            isDistributeEndGroup: 'false',
            isDistributeEndEnd: 'false',
          },
          freejump: { isFreeJump: '0', activityrange: [] },
          freeflow: { isFreeflow: '0' },
          freeWhile: { isFreeWhile: 'false', isExclusive: 'false' },
          dynamicsign: { respondtype: 'none', numbervalue: 1, approOrderType: 'none', approOrderValue: '', againInComeApproveType: "", againInComeApproveTypeWay: "", voteApproActionType: "immediate" },
          approvalAction: { isApproMenuEnabled: 0, data: [] },
          autoCirculated: { autoUsers: '', autoRelaNames: '', autoRoles: '', autoRoleNames: '', opinion: '' }
        }

      };
    },
    created: function () {
      var that = this;
      var obj = parent.window.currentWindowTargetObjectValue;
      var value = obj.value || [];
      var title = obj.title;
      var wid = wid = Object.toQueryString('wid');
      wid = Object.toQueryString('wid');
      if (value != null && value != '' && Object.toStartWith(value, '#')) {
        value = value.toString().substr(1, value.toString().length - 2);
        value = Object.toStringToJson(value);
      }
      var initailData = value;
      var attrName = obj.name;
      that.attrName = attrName;
      that.wid = wid;
      var res = Object.toAjaxJson('/workflow/selector/', 'getHistoryActivityJson', { wid: wid });
      if (res.success) {
        that.leftJumpData = res.data;
      } else {
        FUI.Window.showMsg(that, res.msg);
      }
      that.initailData = initailData || [];
    },
    mounted() {
      var that = this;
      that.initail();
    },
    methods: {
      // ===stand:标准化方法============
      closeEdit() {
        // stand:关闭编辑窗口
        FUI.Window.closeEdit();
      },
      // ===stand:标准化方法结束============
      initail() {
        var that = this;
        var left = [];
        if (that.initailData == null || that.initailData.length == 0) {
          return false;
        }
        console.info(that.initailData);
        $.each(that.initailData, function (opttype, item) {
          var opttype = item.opttype;
          if (opttype == 'general') {
            var kvData = item.params.kvData || [];
            var theSameApproverAutoPass = 'false';
            var theSameHistoryApproverAutoPass = 'false';
            var isModifyProcInstTitle = 'false';
            var kvObj = {};
            $.each(kvData, function (i, item) {
              kvObj[item.key] = item.value;
            });
            that.data.general.theSameApproverAutoPass = kvObj.theSameApproverAutoPass || 'false';
            that.data.general.theSameHistoryApproverAutoPass = kvObj.theSameHistoryApproverAutoPass || 'false';

            that.data.general.isModifyProcInstTitle = kvObj.isModifyProcInstTitle || 'false';
            that.data.general.isReadAutoApproval = kvObj.isReadAutoApproval || 'false';
            that.data.general.isNoUserTransferToMonitor = kvObj.isNoUserTransferToMonitor || 'false';
            that.data.general.isNoUserTransferToNextActivity = kvObj.isNoUserTransferToNextActivity || 'false';
            that.data.general.comeInAgainWhetherAutoApprove = kvObj.comeInAgainWhetherAutoApprove || 'false';
            that.data.general.rejectDirectBackRecalculateActor = kvObj.rejectDirectBackRecalculateActor || 'false';
            that.data.general.isOpenFixEdit = kvObj.isOpenFixEdit || 'false';
            that.data.general.restAutoApprove = kvObj.restAutoApprove || 'false';
            that.data.general.restAutoApproveParms = kvObj.restAutoApproveParms || '';
            if (that.data.general.restAutoApproveParms) {
              var restAutoApproveParmsJson = eval("(" + that.data.general.restAutoApproveParms + ")");
              that.data.general.restAutoApproveParmsTempTitle = restAutoApproveParmsJson.title;
            }

            that.data.general.isSubWorkflowMultiInst = kvObj.isSubWorkflowMultiInst || 'false';
            that.data.general.subWorkflowMultiInstGenerateType = kvObj.subWorkflowMultiInstGenerateType || 'default';

            that.data.general.subWorkflowMultiInstFormField = kvObj.subWorkflowMultiInstFormField || '';
            that.data.general.subWorkflowWiidRelFormField = kvObj.subWorkflowWiidRelFormField || '';
            that.data.general.subWorkflowUserIdRelFormField = kvObj.subWorkflowUserIdRelFormField || '';



            that.data.general.isSubWorkflowUseMainForm = kvObj.isSubWorkflowUseMainForm || 'false';
            that.data.general.isCanRejectToMainWorkflow = kvObj.isCanRejectToMainWorkflow || 'false';
            that.data.general.isOnlyCanRejectToMainWorkflow = kvObj.isOnlyCanRejectToMainWorkflow || 'false';

            that.data.general.isDistributeStartGroup = kvObj.isDistributeStartGroup || 'false';
            that.data.general.isDistributeEndGroup = kvObj.isDistributeEndGroup || 'false';
            that.data.general.isDistributeEndEnd = kvObj.isDistributeEndEnd || 'false';


          } else if (opttype == 'freejump') {
            that.data.freejump.isFreeJump = item.params.isFreeJump;
            that.data.freejump.activityrange = item.params.activityrange;
          } else if (opttype == 'freeflow') {
            that.data.freeflow.isFreeflow = item.params.isFreeflow;
          }
          else if (opttype == 'freeWhile') {
            console.info(item.params);
            that.data.freeWhile.isExclusive = item.params.isExclusive || 'false';
            that.data.freeWhile.isFreeWhile = item.params.isFreeWhile || 'false';
          }
          else if (opttype == 'dynamicsign') {
            that.data.dynamicsign.respondtype = item.params.respondtype;
            that.data.dynamicsign.approOrderType = item.params.approOrderType;
            that.data.dynamicsign.numbervalue = item.params.numbervalue;
            that.data.dynamicsign.approOrderValue = item.params.approOrderValue;
            that.data.dynamicsign.againInComeApproveType = item.params.againInComeApproveType || "";
            that.data.dynamicsign.againInComeApproveTypeWay = item.params.againInComeApproveTypeWay || "";
            that.data.dynamicsign.voteApproActionType = item.params.voteApproActionType || "immediate";

          } else if (opttype == 'approvalAction') {
            that.data.approvalAction.isApproMenuEnabled = item.params.isApproMenuEnabled;
            that.data.approvalAction.data = item.params.data;
          } else if (opttype == 'autoCirculated') {
            that.data.autoCirculated.autoRelaNames = item.params.autoRelaNames;
            that.data.autoCirculated.autoUsers = item.params.autoUsers;

            that.data.autoCirculated.autoRoleNames = item.params.autoRoleNames||"";
            that.data.autoCirculated.autoRoles = item.params.autoRoles||"";
            that.data.autoCirculated.opinion = item.params.opinion;
           
          }
        });
        var left = [];
        var right = [];
        $.each(that.leftJumpData, function (i, item) {
          var theItem = null;
          $.each(that.data.freejump.activityrange, function (i, it) {
            var code = it.value;
            if (code == item.activityCode) {
              right.push(item);
              theItem = item;
            }
          });
          if (theItem == null) {
            left.push(item);
          }
        });
        that.leftJumpData = left;
        that.rightJumpData = right;
      },
      validateForm(refFormName) {
        // stand:表单校验
        var success = false;
        this.$refs[refFormName].validate(valid => {
          success = valid;
        });
        return success;
      },
      saveAndClose() {
        var that = this;
        FUI.Window.confirm(that, '您确定要提交暂存？', '温馨提示', function () {
          var data = [];
          var freeJumpObject = { opttype: 'freejump', params: that.data.freejump };
          var jumpData = [];
          $.each(that.rightJumpData, function (index, item) {
            var activityCode = item.activityCode;
            var activityname = item.activityname;
            jumpData.push({
              value: activityCode,
              text: activityname
            });
          });
          freeJumpObject.params.activityrange = jumpData;
          data.push(freeJumpObject);

          var freeflowObject = { opttype: 'freeflow', params: that.data.freeflow };
          data.push(freeflowObject);

          var freeWhileObject = { opttype: 'freeWhile', params: that.data.freeWhile };
          data.push(freeWhileObject);
          console.info(freeWhileObject);

          var respondTypeObject = { opttype: 'dynamicsign', params: that.data.dynamicsign };
          data.push(respondTypeObject);

          var approvalActionObject = { opttype: 'approvalAction', params: that.data.approvalAction };
          data.push(approvalActionObject);

          var autoCirculatedObject = { opttype: 'autoCirculated', params: that.data.autoCirculated };
          data.push(autoCirculatedObject);

          var kvData = [];
          kvData.push({ 'key': 'theSameApproverAutoPass', 'value': that.data.general.theSameApproverAutoPass });
          kvData.push({ 'key': 'theSameHistoryApproverAutoPass', 'value': that.data.general.theSameHistoryApproverAutoPass });

          kvData.push({ 'key': 'isModifyProcInstTitle', 'value': that.data.general.isModifyProcInstTitle });
          kvData.push({ 'key': 'isReadAutoApproval', 'value': that.data.general.isReadAutoApproval });
          kvData.push({ 'key': 'isNoUserTransferToMonitor', 'value': that.data.general.isNoUserTransferToMonitor });
          kvData.push({ 'key': 'isNoUserTransferToNextActivity', 'value': that.data.general.isNoUserTransferToNextActivity });
          kvData.push({ 'key': 'comeInAgainWhetherAutoApprove', 'value': that.data.general.comeInAgainWhetherAutoApprove });
          kvData.push({ 'key': 'rejectDirectBackRecalculateActor', 'value': that.data.general.rejectDirectBackRecalculateActor });
          kvData.push({ 'key': 'isOpenFixEdit', 'value': that.data.general.isOpenFixEdit });
          kvData.push({ 'key': 'restAutoApprove', 'value': that.data.general.restAutoApprove });
          kvData.push({ 'key': 'restAutoApproveParms', 'value': that.data.general.restAutoApproveParms });



          kvData.push({ 'key': 'isSubWorkflowMultiInst', 'value': that.data.general.isSubWorkflowMultiInst });
          kvData.push({ 'key': 'subWorkflowMultiInstFormField', 'value': that.data.general.subWorkflowMultiInstFormField });
          kvData.push({ 'key': 'subWorkflowWiidRelFormField', 'value': that.data.general.subWorkflowWiidRelFormField });
          kvData.push({ 'key': 'subWorkflowUserIdRelFormField', 'value': that.data.general.subWorkflowUserIdRelFormField });



          kvData.push({ 'key': 'subWorkflowMultiInstGenerateType', 'value': that.data.general.subWorkflowMultiInstGenerateType });

          kvData.push({ 'key': 'isSubWorkflowUseMainForm', 'value': that.data.general.isSubWorkflowUseMainForm });
          kvData.push({ 'key': 'isCanRejectToMainWorkflow', 'value': that.data.general.isCanRejectToMainWorkflow });
          kvData.push({ 'key': 'isOnlyCanRejectToMainWorkflow', 'value': that.data.general.isOnlyCanRejectToMainWorkflow });

          kvData.push({ 'key': 'isDistributeStartGroup', 'value': that.data.general.isDistributeStartGroup });
          kvData.push({ 'key': 'isDistributeEndGroup', 'value': that.data.general.isDistributeEndGroup });
          kvData.push({ 'key': 'isDistributeEndEnd', 'value': that.data.general.isDistributeEndEnd });

          var paramsObj = {
            'kvData': kvData
          };
          var generalObject = { opttype: 'general', params: paramsObj };
          data.push(generalObject);

          var resultStr = JSON.stringify(data);
          if (resultStr == '[]') {
            parent.setTargetValue(attrName, '');
          } else {
            resultStr = '#' + resultStr + '#';
            parent.setTargetValue(that.attrName, resultStr);
          }
          FUI.Window.closeEditAll();
        });
      },
      getResult() {
        var that = this;
      },
      leftJumpSelected(activityid) {
        var that = this;
        var left = [];
        var theItem = null;
        $.each(that.leftJumpData, function (i, item) {
          if (item.activityId != activityid) {
            left.push(item);
          } else {
            theItem = item;
          }
        });
        that.leftJumpData = left;
        if (theItem) {
          that.rightJumpData.push(theItem);
        }
      },
      rightJumpSelected(activityid) {
        var that = this;
        var right = [];
        var theItem = null;
        $.each(that.rightJumpData, function (i, item) {
          if (item.activityId != activityid) {
            right.push(item);
          } else {
            theItem = item;
          }
        });
        that.rightJumpData = right;
        if (theItem) {
          that.leftJumpData.push(theItem);
        }
      },
      clearAll() {
        var that = this;
        $.each(that.rightJumpData, function (i, item) {
          that.leftJumpData.push(item);
        });
        that.rightJumpData = [];
      },
      addApprovalAction(type) {
        var that = this;
        if (type && type == 'default') {
          $.each(that.defaultApproActons, function (i, defItem) {
            //conditionNum：条件数量
            var action = { approAction: defItem, approName: defItem, orderNo: i + 1, conditionNum: 1 };
            that.data.approvalAction.data.push(action);
          });
          return false;
        }
        if (that.approName == '') {
          FUI.Window.showMsg('请输入菜单名称');
          return false;
        }
        if (that.conditionNum == '' && that.conditionNumIsAllChange == false) {
          FUI.Window.showMsg('请输入菜单条件数量');
          return false;
        }
        var isExist = false;
        $.each(that.data.approvalAction.data, function (i, item) {
          if (item.approName == that.approName) {
            isExist = true;
            return false;
          }
        });
        if (isExist) {
          FUI.Window.showMsg(that.approName + ',菜单已存在，可先删除后再新添加');
          return false;
        }

        var action = { approAction: that.approName, approName: that.approName, orderNo: 100, remark: '', isEnabled: 1, conditionNum: that.conditionNum };
        that.data.approvalAction.data.push(action);
        that.approName = '';
      },
      deleteApprovalAction(actionItem) {
        var approName = actionItem.approName;
        var that = this;
        var tempData = [];
        var theItem = null;
        $.each(that.data.approvalAction.data, function (i, item) {
          if (item.approName != approName) {
            tempData.push(item);
          }
        });
        that.data.approvalAction.data = tempData;
      },
      onClearAutoCirculated(id, id2) {
        var that = this;
        that.data.autoCirculated[id] = '';
        that.data.autoCirculated[id2] = '';
      },
      approOrderTypeChange(v) {
        var that = this;
        that.data.dynamicsign.approOrderValue = '';
      },
      selectorUserTextValue(inputKey, inputName, passParm, singleSelect, keyName) {
        var that = this;
        WF.SelectorDialog.selectorUserTextValue(that, inputKey, inputName, passParm, singleSelect, keyName, null, null, that.data.autoCirculated);
      }
      , selectorFormField(inputId, inputName, singleSelect, subDataName) {
        var that = this;
        var subObj = null;
        if (subDataName) {
          subObj = that.data[subDataName];
        }
        WF.SelectorDialog.selectorFormField(that, null, that.wid, inputId, inputName, singleSelect, subObj);
      }
      ,
      selectDataService(inputId, inputName, subDataName) {
        var that = this;
        var dataObj = subDataName != undefined ? that.data[subDataName] : that.data;
        var inputIdValue = dataObj[inputId];
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
          dataObj[inputId] = resultStr;
          dataObj[inputName] = dataObject.title;
          layer.close(index);
        }, true);
      }
      ,selectorTextValue(inputKey, inputName, type) {
        var that = this;
        var vueDataObj=that.data.autoCirculated;
        WF.SelectorDialog.selectorTextValue(that, inputKey, inputName, type, null, false, true,vueDataObj);
      }
      , conditionNumIsAllChange(v) {
        var that = this;
        that.conditionNum = v == true ? 0 : 1;
      }
      , showInputParam(inputId, subDataName) {
        var that = this;
        var value = subDataName ? that.data[subDataName][inputId] : that.data[inputId];
        FUI.Window.showMsg(value, null, 1);
      }
    }
  }
</script>
<style>
  .common-FormTable td {
    text-align: left
  }

  .el-radio__label {
    font-size: 12px;
  }

  .advance .el-switch__label * {
    font-size: 12px !important;
  }

  .advance legend {
    color: #0D1126;
  }
  .advance .el-tabs__item{
    color: #0D1126;
  }
  .advance .el-tabs__item.is-active{
    color: #006EFF;
  }
</style>