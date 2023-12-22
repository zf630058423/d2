<template>
  <!--表单字段批量授权-->
  <div class="f2bpm-page-layout">
    <el-container>
      <el-aside v-if="needLeftTree" ref="sideLeft" class="f2bpm-page-left" hide-trigger collapsible :width="isCollapsed?'20px':'200px'">
        <div class="f2bpm-panel-head">
          <div v-if="!isCollapsed" class="f2bpm-left-search-div">
            <el-input v-model="treeFilterText" class="left-htead-treeFilterText-box" size="small" clearable :placeholder="$t('enterKey')" autocomplete="off" prefix-icon="el-icon-search" />
          </div>
          <div style=" float: right;line-height:35px;padding-right: 5px;">
            <i v-if="!isCollapsed" :title="$t('refresh')" class="fa fa-refresh  cur mr10 font12 " @click="loadTree()" />
            <i title="收起/展开" :class="rotateIcon" @click="collapsedSider" />
          </div>
        </div>
        <div v-if="!isCollapsed" class="auto-window-height f2bpm-page-left-content mt4">
          <el-tree ref="mytree" :data="treeData" :filter-node-method="filterTreeNode" :expand-on-click-node="false" default-expand-all @node-contextmenu="treeNodeContextmenu" @node-click="onTreeSelected" />
          <div v-show="menuVisible" id="treeMenu" class="treeRightMenu">
            <el-menu id="menu" text-color="#000" @select="treeNodeRightMenuSelect">
              <el-menu-item index="tableRowAddPower">
                <i class="fa fa-edit" /> 设置“添加按钮”的权限
              </el-menu-item>
              <el-menu-item index="tableRowDelPower">
                <i class="fa fa-trash-o" />设置“删除按钮”的权限
              </el-menu-item>
              <el-menu-item index="tableOperationCustomButtonPower">
                <i class="fa fa-plus" />设置“自定义按钮”权限
              </el-menu-item>
            </el-menu>
          </div>
        </div>
      </el-aside>

      <el-main class="f2bpm-page-right">
        <div style="margin-top: 10px;margin-left:3px;">

          <el-button size="mini" type="primary" @click="save"><i class="fa fa-save" />保存
          </el-button>
          <el-button size="mini" @click="closeEdit"><i class="fa fa-minus-circle" />关闭
          </el-button>
        </div>
        <table v-if="isNeedTableFiledPermissionList" class="common-grid">
          <tr>
            <th colspan="7" style="text-align: left;padding:5px;">
              <div class="p5">
                当前{{ isSubtable?'子':'' }}表字段权限：<span v-if="currentBoTitle!=''" class="cube bg-blue" v-html="currentBoTitle+'('+currentTableName+')'" />
                <span v-if="currentBoTitle!=''" title="将从数据库中删除此表的所有权限字段，点击保存后会重新加载字段" class="red ml10 cur" @click="deleteAll(false)"><i class="fa fa-trash" />删除所有权限字段
                </span>
              </div>
              <div class="p5" style="line-height:20px;">
                字段“原始状态”：显示、可写、不必填。<br>
                权限权重：隐藏>只读=编辑>必填<br>
                字段“行权”：是往天然权限状态中添加对应的权限，即向字段执行该权限。<br>
                权限配置说明：“空”：表示没有配置该权限，数据库对该权限为空。“所有人”：表示所有人都设置了该权限。“详细”：表示该权限按详细配置的内容授权。
                  <br>“[新]”的标识代表表单本身存在此字段，但权限定义不存在。
              </div>
            </th>
          </tr>
          <tr>
            <th style="width:35px;">
              <el-checkbox v-model="isFieldCheckAll" @change="changeFieldCheckAll"><span style="color: #FFFFFF;">.</span> </el-checkbox>
            </th>
            <th style="width:40px;">序号</th>
            <th style="width:180px;">
              <span style="display: block;">字段标题</span>
              <el-button size="mini" class="mt4" title="同步刷新字段标题和字段名称" @click="refreshFieldTitle">
                <i class="fa fa-refresh" /> 刷新字段
              </el-button>
            </th>
            <th> <span style="font-size: 14px;display: block;margin-bottom: 5px;">隐藏<span class="font8">(不显示+不可写)</span> </span>
              <el-button size="mini" @click="bathSetType('hidden','none','field')"><i class="fa fa-close" />清空
              </el-button>
              <el-button size="mini" @click="bathSetType('hidden','all','field')"><i class="fa fa-users" />所有人
              </el-button>
              <el-button size="mini" @click="bathSetDetail('hidden','隐藏','detail','field')"><i class="fa fa-cogs" />批量详细
              </el-button>
              <el-checkbox v-model="showDetail.hidden" class="ml5">显示详细</el-checkbox>
            </th>
            <th style="height: 60px;">
              <span style="font-size: 14px;display: block;margin-bottom: 5px;">只读<span class="font8">(不可写)</span> </span>
              <el-button size="mini" @click="bathSetType('read','none','field')"><i class="fa fa-close" />清空
              </el-button>
              <el-button size="mini" @click="bathSetType('read','all','field')"><i class="fa fa-users" />所有人
              </el-button>
              <el-button size="mini" @click="bathSetDetail('read','只读','detail','field')"><i class="fa fa-cogs" />批量详细
              </el-button>
              <el-checkbox v-model="showDetail.read" class="ml5">显示详细</el-checkbox>
            </th>
            <th>
              <span style="font-size: 14px;display: block;margin-bottom: 5px;">编辑<span class="font8">(可写)</span> </span>
              <el-button size="mini" @click="bathSetType('write','none','field')"><i class="fa fa-close" />清空
              </el-button>
              <el-button size="mini" @click="bathSetType('write','all','field')"><i class="fa fa-users" />所有人
              </el-button>
              <el-button size="mini" @click="bathSetDetail('write','编辑','detail','field')"><i class="fa fa-cogs" />批量详细
              </el-button>
              <el-checkbox v-model="showDetail.write" class="ml5">显示详细</el-checkbox>
            </th>
            <th>
              <span style="font-size: 14px;display: block;margin-bottom: 5px;">必填<span class="font8">(前提是可编辑) </span></span>
              <el-button size="mini" @click="bathSetType('required','none','field')"><i class="fa fa-close" />清空
              </el-button>
              <el-button size="mini" @click="bathSetType('required','all','field')"><i class="fa fa-users" />所有人
              </el-button>
              <el-button size="mini" @click="bathSetDetail('required','必填','detail','field')"><i class="fa fa-cogs" />批量详细
              </el-button>
              <el-checkbox v-model="showDetail.required" class="ml5">显示详细</el-checkbox>
            </th>
          </tr>
          <tr v-for="(field,indexNo) in fieldPremsList">
            <td class="numberNo">
              <el-checkbox v-model="field.checked"><span style="color: #FFFFFF;">.</span> </el-checkbox>
            </td>
            <td class="numberNo"><span :title="field.rightItemId">{{ indexNo+1 }}</span> </td>
            <td>
              <i class="red" v-if="field.rightItemId==''" title="新加入的字段">[新]</i><span :class="field.rightItemId==''?'add_state':''" :title="field.fieldName" v-html="field.fieldTitle" />
              <i title="删除权限字段，如果表单本身存在此字段删除后会自动重新加入。" v-if="field.rightItemId!=''" @click="deleteRightItem(field.rightItemId,field.fieldTitle,false)" class="fa fa-trash ml3 fr cur"></i>
            </td>
            <td>
              <el-radio-group v-model="field.itemPermission.hidden.type">
                <el-radio label="none">空</el-radio>
                <el-radio label="all">所有人</el-radio>
                <el-radio label="detail"><span class="pr10 cur" @click="setFieldPermissionDetail(field.itemPermission.hidden,field.fieldName,'hidden', field.fieldTitle,'隐藏',field.fieldType)">详细</span></el-radio>
              </el-radio-group>
              <div v-if="field.itemPermission.hidden.type=='detail'&&showDetail.hidden">
                <table class="common-grid" cellpadding="0" cellspacing="0">
                  <tr>
                    <th v-if="needActivity" style="width: 180px;">节点</th>
                    <th>授权对象</th>
                  </tr>
                  <tr v-for="detailItem in field.itemPermission.hidden.detail">
                    <td v-if="needActivity">
                      <span :class="detailItem.activitys.type=='none'?'cube bg-grey':'cube bg-gree'">{{ detailItem.activitys.type=='all'?'所有节点':detailItem.activitys.type=='detail'?'详细':'无' }}</span>
                      <div v-if="detailItem.activitys.type=='detail'">
                        <div v-if="detailItem.activitys.detail.act&&detailItem.activitys.detail.act.length>0" class="p5"> <span v-for="a in detailItem.activitys.detail.act"><span class="cube bg-blue mr2" v-html="a.text" /> </span></div>
                      </div>
                    </td>
                    <td style="text-align: left;">
                      <span :class="detailItem.users.type=='none'?'cube bg-grey':'cube bg-gree'">{{ detailItem.users.type=='all'?'所有人':detailItem.users.type=='detail'?'详细':'无' }} </span>
                      <div v-if="detailItem.users.type=='detail'">
                        <div v-if="detailItem.users.detail.user&&detailItem.users.detail.user.length>0" class="p5"><span class="cube bg-orange mr2">用户 》》</span><span v-for="u in detailItem.users.detail.user"><span class="cube bg-blue mr2" v-html="u.text" /> </span></div>
                        <div v-if="detailItem.users.detail.org&&detailItem.users.detail.org.length>0" class="p5"> <span class="cube bg-orange mr2">组织 》》</span><span v-for="g in detailItem.users.detail.org"> <span class="cube bg-blue mr2" v-html="g.text" /> </span></div>
                        <div v-if="detailItem.users.detail.role&&detailItem.users.detail.role.length>0" class="p5"><span class="cube bg-orange mr2">角色 》》</span><span v-for="r in detailItem.users.detail.role"> <span class="cube bg-blue mr2" v-html="r.text" /> </span></div>
                      </div>
                    </td>
                  </tr>
                </table>
              </div>
            </td>
            <td>
              <el-radio-group v-model="field.itemPermission.read.type">
                <el-radio label="none">空</el-radio>
                <el-radio label="all">所有人</el-radio>
                <el-radio label="detail"><span class="pr10 cur" @click="setFieldPermissionDetail(field.itemPermission.read,field.fieldName,'read', field.fieldTitle,'只读',field.fieldType)">详细</span></el-radio>
              </el-radio-group>
              <div v-if="field.itemPermission.read.type=='detail'&&showDetail.read">
                <table class="common-grid" cellpadding="0" cellspacing="0">
                  <tr>
                    <th v-if="needActivity" style="width: 180px;">节点</th>
                    <th>授权对象</th>
                  </tr>
                  <tr v-for="detailItem in field.itemPermission.read.detail">
                    <td v-if="needActivity">
                      <span :class="detailItem.activitys.type=='none'?'cube bg-grey':'cube bg-gree'">{{ detailItem.activitys.type=='all'?'所有节点':detailItem.activitys.type=='detail'?'详细':'无' }}</span>
                      <div v-if="detailItem.activitys.type=='detail'">
                        <div v-if="detailItem.activitys.detail.act&&detailItem.activitys.detail.act.length>0" class="p5"> <span v-for="a in detailItem.activitys.detail.act"><span class="cube bg-blue mr2" v-html="a.text" /> </span></div>
                      </div>
                    </td>
                    <td style="text-align: left;">
                      <span :class="detailItem.users.type=='none'?'cube bg-grey':'cube bg-gree'">{{ detailItem.users.type=='all'?'所有人':detailItem.users.type=='detail'?'详细':'无' }} </span>
                      <div v-if="detailItem.users.type=='detail'">
                        <div v-if="detailItem.users.detail.user&&detailItem.users.detail.user.length>0" class="p5"><span class="cube bg-orange mr2">用户 》》</span><span v-for="u in detailItem.users.detail.user"><span class="cube bg-blue mr2" v-html="u.text" /> </span></div>
                        <div v-if="detailItem.users.detail.org&&detailItem.users.detail.org.length>0" class="p5"> <span class="cube bg-orange mr2">组织 》》</span><span v-for="g in detailItem.users.detail.org"> <span class="cube bg-blue mr2" v-html="g.text" /> </span></div>
                        <div v-if="detailItem.users.detail.role&&detailItem.users.detail.role.length>0" class="p5"><span class="cube bg-orange mr2">角色 》》</span><span v-for="r in detailItem.users.detail.role"> <span class="cube bg-blue mr2" v-html="r.text" /> </span></div>
                      </div>
                    </td>
                  </tr>
                </table>
              </div>

            </td>
            <td>
              <el-radio-group v-model="field.itemPermission.write.type">
                <el-radio label="none">空</el-radio>
                <el-radio label="all">所有人</el-radio>
                <el-radio label="detail"><span class="pr10 cur" @click="setFieldPermissionDetail(field.itemPermission.write,field.fieldName,'write', field.fieldTitle,'编辑',field.fieldType)">详细</span></el-radio>
              </el-radio-group>
              <div v-if="field.itemPermission.write.type=='detail'&&showDetail.write">
                <table class="common-grid" cellpadding="0" cellspacing="0">
                  <tr>
                    <th v-if="needActivity" style="width: 180px;">节点</th>
                    <th>授权对象</th>
                  </tr>
                  <tr v-for="detailItem in field.itemPermission.write.detail">
                    <td v-if="needActivity">
                      <span :class="detailItem.activitys.type=='none'?'cube bg-grey':'cube bg-gree'">{{ detailItem.activitys.type=='all'?'所有节点':detailItem.activitys.type=='detail'?'详细':'无' }}</span>
                      <div v-if="detailItem.activitys.type=='detail'">
                        <div v-if="detailItem.activitys.detail.act&&detailItem.activitys.detail.act.length>0" class="p5"> <span v-for="a in detailItem.activitys.detail.act"><span class="cube bg-blue mr2" v-html="a.text" /> </span></div>
                      </div>
                    </td>
                    <td style="text-align: left;">
                      <span :class="detailItem.users.type=='none'?'cube bg-grey':'cube bg-gree'">{{ detailItem.users.type=='all'?'所有人':detailItem.users.type=='detail'?'详细':'无' }} </span>
                      <div v-if="detailItem.users.type=='detail'">
                        <div v-if="detailItem.users.detail.user&&detailItem.users.detail.user.length>0" class="p5"><span class="cube bg-orange mr2">用户 》》</span><span v-for="u in detailItem.users.detail.user"><span class="cube bg-blue mr2" v-html="u.text" /> </span></div>
                        <div v-if="detailItem.users.detail.org&&detailItem.users.detail.org.length>0" class="p5"> <span class="cube bg-orange mr2">组织 》》</span><span v-for="g in detailItem.users.detail.org"> <span class="cube bg-blue mr2" v-html="g.text" /> </span></div>
                        <div v-if="detailItem.users.detail.role&&detailItem.users.detail.role.length>0" class="p5"><span class="cube bg-orange mr2">角色 》》</span><span v-for="r in detailItem.users.detail.role"> <span class="cube bg-blue mr2" v-html="r.text" /> </span></div>
                      </div>
                    </td>
                  </tr>
                </table>
              </div>

            </td>
            <td>
              <el-radio-group v-model="field.itemPermission.required.type">
                <el-radio label="none">空</el-radio>
                <el-radio label="all">所有人</el-radio>
                <el-radio label="detail"> <span class="pr10 cur" @click="setFieldPermissionDetail(field.itemPermission.required,field.fieldName,'required', field.fieldTitle,'必填',field.fieldType)">详细</span> </el-radio>
              </el-radio-group>
              <div v-if="field.itemPermission.required.type=='detail'&&showDetail.required">
                <table class="common-grid" cellpadding="0" cellspacing="0">
                  <tr>
                    <th v-if="needActivity" style="width: 180px;">节点</th>
                    <th>授权对象</th>
                  </tr>
                  <tr v-for="detailItem in field.itemPermission.required.detail">
                    <td v-if="needActivity">
                      <span :class="detailItem.activitys.type=='none'?'cube bg-grey':'cube bg-gree'">{{ detailItem.activitys.type=='all'?'所有节点':detailItem.activitys.type=='detail'?'详细':'无' }}</span>
                      <div v-if="detailItem.activitys.type=='detail'">
                        <div v-if="detailItem.activitys.detail.act&&detailItem.activitys.detail.act.length>0" class="p5"> <span v-for="a in detailItem.activitys.detail.act"><span class="cube bg-blue mr2" v-html="a.text" /> </span></div>
                      </div>
                    </td>
                    <td style="text-align: left;">
                      <span :class="detailItem.users.type=='none'?'cube bg-grey':'cube bg-gree'">{{ detailItem.users.type=='all'?'所有人':detailItem.users.type=='detail'?'详细':'无' }} </span>
                      <div v-if="detailItem.users.type=='detail'">
                        <div v-if="detailItem.users.detail.user&&detailItem.users.detail.user.length>0" class="p5"><span class="cube bg-orange mr2">用户 》》</span><span v-for="u in detailItem.users.detail.user"><span class="cube bg-blue mr2" v-html="u.text" /> </span></div>
                        <div v-if="detailItem.users.detail.org&&detailItem.users.detail.org.length>0" class="p5"> <span class="cube bg-orange mr2">组织 》》</span><span v-for="g in detailItem.users.detail.org"> <span class="cube bg-blue mr2" v-html="g.text" /> </span></div>
                        <div v-if="detailItem.users.detail.role&&detailItem.users.detail.role.length>0" class="p5"><span class="cube bg-orange mr2">角色 》》</span><span v-for="r in detailItem.users.detail.role"> <span class="cube bg-blue mr2" v-html="r.text" /> </span></div>
                      </div>
                    </td>
                  </tr>
                </table>
              </div>
            </td>

          </tr>
        </table>

        <!--子表按钮权限-->
        <table v-if="isNeedButtonPermissionList" class="common-grid">
          <tr>
            <th colspan="7" style="text-align: left;padding:5px;">
              <div class="p5">
                当前{{ isSubtable?'子':'' }}表按钮权限：<span v-if="currentBoTitle!=''" class="cube bg-blue" v-html="currentBoTitle+'('+currentTableName+')'" />
                <span v-if="currentBoTitle!=''" title="将从数据库中删除此权限按钮" class="red ml10 cur" @click="deleteAll(true)"><i class="fa fa-trash" />删除所有权限按钮
                </span>
              </div>
              <div class="p5">
                权限：隐藏权限>显示权限
                权限配置说明：“无”：表示没有配置该权限，数据库对该权限为空。“所有人”：表示所有人都设置了该权限。“详细”：表示该权限按详细配置的内容授权。
                <br> <br>“[新]”的标识代表表单本身存在此按钮，但权限定义不存在。
              </div>
            </th>
          </tr>
          <tr>
            <th style="width:35px;">
              <el-checkbox v-model="isButtonCheckAll" @change="changeButtonCheckAll"><span style="color: #FFFFFF;">.</span> </el-checkbox>
            </th>
            <th style="width:40px;">序号</th>
            <th style="width:180px;">按钮名称</th>
            <th style="height: 60px;">
              <span style="font-size: 14px;display: block;margin-bottom: 5px;">显示 </span>
              <el-button size="mini" @click="bathSetType('write','none','button')"><i class="fa fa-close" />清空
              </el-button>
              <el-button size="mini" @click="bathSetType('write','all','button')"><i class="fa fa-users" />所有人
              </el-button>
              <el-button size="mini" @click="bathSetDetail('write','显示','detail','button')"><i class="fa fa-cogs" />批量详细
              </el-button>
              <el-checkbox v-model="showBtnDetail.write" class="ml5">显示详细</el-checkbox>
            </th>
            <th> <span style="font-size: 14px;display: block;margin-bottom: 5px;">隐藏 </span>
              <el-button size="mini" @click="bathSetType('hidden','none','button')"><i class="fa fa-close" />清空
              </el-button>
              <el-button size="mini" @click="bathSetType('hidden','all','button')"><i class="fa fa-users" />所有人
              </el-button>
              <el-button size="mini" @click="bathSetDetail('hidden','隐藏','detail','button')"><i class="fa fa-cogs" />批量详细
              </el-button>
              <el-checkbox v-model="showBtnDetail.hidden" class="ml5">显示详细</el-checkbox>
            </th>
          </tr>
          <tr v-for="(field,indexNo) in buttonFieldPremsList">
            <td class="numberNo">
              <el-checkbox v-model="field.checked"><span style="color: #FFFFFF;">.</span> </el-checkbox>
            </td>
            <td class="numberNo"><span :title="field.rightItemId">{{ indexNo+1 }}</span> </td>
            <td>
              <i class="red" v-if="field.rightItemId==''" title="新加入的按钮">[新]</i>
              <span :class="field.rightItemId==''?'add_state':''" :title="field.fieldName" v-html="field.fieldTitle" />
              <i title="删除权限按钮，如果表单本身存在此按钮删除后会自动重新加入。" v-if="field.rightItemId!=''" @click="deleteRightItem(field.rightItemId,field.fieldTitle,true)" class="fa fa-trash ml3 fr cur"></i>
            </td>
            <td>
              <el-radio-group v-model="field.itemPermission.write.type">
                <el-radio label="none">无</el-radio>
                <el-radio label="all">所有人</el-radio>
                <el-radio label="detail"><span class="pr10 cur" @click="setFieldPermissionDetail(field.itemPermission.write,field.fieldName,'write', field.fieldTitle,'显示',field.fieldType)">详细</span></el-radio>
              </el-radio-group>
              <div v-if="field.itemPermission.write.type=='detail'&&showBtnDetail.write">
                <table class="common-grid" cellpadding="0" cellspacing="0">
                  <tr>
                    <th v-if="needActivity" style="width: 180px;">节点</th>
                    <th>授权对象</th>
                  </tr>
                  <tr v-for="detailItem in field.itemPermission.write.detail">
                    <td v-if="needActivity">
                      <span :class="detailItem.activitys.type=='none'?'cube bg-grey':'cube bg-gree'">{{ detailItem.activitys.type=='all'?'所有节点':detailItem.activitys.type=='detail'?'详细':'无' }}</span>
                      <div v-if="detailItem.activitys.type=='detail'">
                        <div v-if="detailItem.activitys.detail.act&&detailItem.activitys.detail.act.length>0" class="p5"> <span v-for="a in detailItem.activitys.detail.act"><span class="cube bg-blue mr2" v-html="a.text" /> </span></div>
                      </div>
                    </td>
                    <td style="text-align: left;">
                      <span :class="detailItem.users.type=='none'?'cube bg-grey':'cube bg-gree'">{{ detailItem.users.type=='all'?'所有人':detailItem.users.type=='detail'?'详细':'无' }} </span>
                      <div v-if="detailItem.users.type=='detail'">
                        <div v-if="detailItem.users.detail.user&&detailItem.users.detail.user.length>0" class="p5"><span class="cube bg-orange mr2">用户 》》</span><span v-for="u in detailItem.users.detail.user"><span class="cube bg-blue mr2" v-html="u.text" /> </span></div>
                        <div v-if="detailItem.users.detail.org&&detailItem.users.detail.org.length>0" class="p5"> <span class="cube bg-orange mr2">组织 》》</span><span v-for="g in detailItem.users.detail.org"> <span class="cube bg-blue mr2" v-html="g.text" /> </span></div>
                        <div v-if="detailItem.users.detail.role&&detailItem.users.detail.role.length>0" class="p5"><span class="cube bg-orange mr2">角色 》》</span><span v-for="r in detailItem.users.detail.role"> <span class="cube bg-blue mr2" v-html="r.text" /> </span></div>
                      </div>
                    </td>
                  </tr>
                </table>
              </div>
            </td>
            <td>
              <el-radio-group v-model="field.itemPermission.hidden.type">
                <el-radio label="none">无</el-radio>
                <el-radio label="all">所有人</el-radio>
                <el-radio label="detail"><span class="pr10 cur" @click="setFieldPermissionDetail(field.itemPermission.hidden,field.fieldName,'hidden', field.fieldTitle,'隐藏',field.fieldType)">详细</span></el-radio>
              </el-radio-group>
              <div v-if="field.itemPermission.hidden.type=='detail'&&showBtnDetail.hidden">
                <table class="common-grid" cellpadding="0" cellspacing="0">
                  <tr>
                    <th v-if="needActivity" style="width: 180px;">节点</th>
                    <th>授权对象</th>
                  </tr>
                  <tr v-for="detailItem in field.itemPermission.hidden.detail">
                    <td v-if="needActivity">
                      <span :class="detailItem.activitys.type=='none'?'cube bg-grey':'cube bg-gree'">{{ detailItem.activitys.type=='all'?'所有节点':detailItem.activitys.type=='detail'?'详细':'无' }}</span>
                      <div v-if="detailItem.activitys.type=='detail'">
                        <div v-if="detailItem.activitys.detail.act&&detailItem.activitys.detail.act.length>0" class="p5"> <span v-for="a in detailItem.activitys.detail.act"><span class="cube bg-blue mr2" v-html="a.text" /> </span></div>
                      </div>
                    </td>
                    <td style="text-align: left;">
                      <span :class="detailItem.users.type=='none'?'cube bg-grey':'cube bg-gree'">{{ detailItem.users.type=='all'?'所有人':detailItem.users.type=='detail'?'详细':'无' }} </span>
                      <div v-if="detailItem.users.type=='detail'">
                        <div v-if="detailItem.users.detail.user&&detailItem.users.detail.user.length>0" class="p5"><span class="cube bg-orange mr2">用户 》》</span><span v-for="u in detailItem.users.detail.user"><span class="cube bg-blue mr2" v-html="u.text" /> </span></div>
                        <div v-if="detailItem.users.detail.org&&detailItem.users.detail.org.length>0" class="p5"> <span class="cube bg-orange mr2">组织 》》</span><span v-for="g in detailItem.users.detail.org"> <span class="cube bg-blue mr2" v-html="g.text" /> </span></div>
                        <div v-if="detailItem.users.detail.role&&detailItem.users.detail.role.length>0" class="p5"><span class="cube bg-orange mr2">角色 》》</span><span v-for="r in detailItem.users.detail.role"> <span class="cube bg-blue mr2" v-html="r.text" /> </span></div>
                      </div>
                    </td>
                  </tr>
                </table>
              </div>
            </td>
          </tr>
        </table>

      </el-main>
    </el-container>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        needLeftTree: true,
        needActivity: false,
        showDetail: { hidden: false, read: false, write: false, required: false },
        showBtnDetail: { hidden: false, read: false, write: false, required: false },
        isFieldCheckAll: false,
        isButtonCheckAll: false,
        menuVisible: false,
        ghtType: '',
        formKey: '',
        appId: '',
        rightId: '',
        formDefId: '',
        activityCode: '',
        // 是否需要配置主表字段的列表
        isNeedTableFiledPermissionList: true,
        // 是否需要配置按钮权限的列表
        isNeedButtonPermissionList: false,
        isSubtable: false,
        currentBoId: '',
        currentBoTitle: '',
        currentTableId: '',
        currentTableName: '',
        treeFilterText: '',
        isCollapsed: false,
        loading: false,
        treeData: [],
        powerTypeArr: ['read', 'write', 'required', 'hidden'],
        currentDetail: [],
        // 当前编辑的是哪个字段powerType:read,write,required,hidden
        currentField: { fieldName: '', powerType: '' },
        fieldPremsList: [],
        // 按钮字段权限
        buttonFieldPremsList: [],
        total: 0,
        searchParams: {
        }
      };
    }, computed: {
      countGridHeight() {
        return $(document).height() - global_datagridHeightDiff;
      },
      rotateIcon() {
        return this.isCollapsed ? 'icon icon-arrow-right-bold cur' : 'icon icon-arrow-left-bold cur';
      },
      positionIcon() {
        return this.isCollapsed ? 'cursor:pointer; position: relative;left: -5px;' : 'cursor:pointer; position: relative;left: 100px;';
      }
    },
    watch: {
      treeFilterText(val) {
        this.$refs.mytree.filter(val);
      }
    },
    mounted() {
      // 添加监听
      document.addEventListener('click', this.listen);
      window.autoPageHeight();
    },
    created() {
      window.myvm = this;
      var that = this;
      // 权限类型:必填
      var rightType = Object.toQueryString('rightType') || '';
      // ========================有流程表单====================
      // 流程应用ID：有流程时必填
      var appId = Object.toQueryString('appId') || '';
      // 节点表单时节点编码
      var activityCode = Object.toQueryString('activityCode') || '';
      // =======================无流程表单=====================
      //  表单KEY：无流程表单时必填,自定义列表时必填写（自定义列表时formKey对应的是dataGridId）
      var formKey = Object.toQueryString('formKey') || '';
      var mothed = appId ? 'getWorkflowRightId' : 'getNoWorkflowRight';
      that.formKey = formKey;
      if (rightType == 'globalWfForm') {
        that.needActivity = true;
      } else if (rightType == 'customDataGrid') {
        //自定义列表的按钮权限
        mothed = 'getCustomDataGridRight';
        that.needLeftTree = false;
        // 是否加载字段权限配置列表
        that.isNeedTableFiledPermissionList = false;
        // 是否需要按钮的配置列表
        that.isNeedButtonPermissionList = true;
      } else if (rightType == 'formCustButton') {
        //表单属性中的自定义按钮
        mothed = 'geFormCustButtonRight';
        that.needLeftTree = false;
        // 是否加载字段权限配置列表
        that.isNeedTableFiledPermissionList = false;
        // 是否需要按钮的配置列表
        that.isNeedButtonPermissionList = true;
      }
      // 获取授权RightInfo,不存在时会自动创建
      var res = Object.toAjaxJson('/workflow/formPermission/', mothed, { rightType: rightType, appId: appId, activityCode: activityCode, formKey: formKey });
      console.info(res);
      if (res.success) {
        var rightInfo = res.data;
        that.rightId = rightInfo.rightId;
        that.appId = rightInfo.appId;
        that.rightType = rightType;
        that.formDefId = rightInfo.formDefId;
        that.activityCode = rightInfo.activityCode;
      } else {
        FUI.Window.showMsg('获取权限定义请求出错' + res.msg);
      }
      if (that.needLeftTree) {
        that.loadTree();
      } else if (that.rightType == 'customDataGrid') {
        that.loadFieldList();
      } else if (that.rightType == 'formCustButton') {
        that.loadFieldList();
      }
    },

    methods: {
      loadFieldList() {
        var that = this;
        if (that.isNeedTableFiledPermissionList) {
          var res = Object.toAjaxJson('/workflow/formPermission/', 'getFormFieldListPermissionsByFormDefIdBusObjectId', { rightId: that.rightId, formDefId: that.formDefId, busObjectId: that.currentBoId });
          if (res.success) {
            var data = res.data;
            $.each(data, function (i, item) {
              if (item.itemPermission && typeof item.itemPermission === 'string') {
                item.itemPermission = eval('(' + item.itemPermission + ')');
              }
              item.checked = false;
            });
            that.fieldPremsList = data;
            that.total = that.fieldPremsList.length;
          }
        }
        if (that.rightType == 'customDataGrid') {
          that.loadCustomDataGridButtonFieldList();
        } if (that.rightType == 'formCustButton') {
          that.loadFormCustButtonFieldList();
        } else if (that.isSubtable) {
          that.loadButtonFieldList();
        }
      },
      loadButtonFieldList() {
        // 获取按钮字段权限
        var that = this;
        var res = Object.toAjaxJson('/workflow/formPermission/', 'getSubTableButtonFieldPermission', { rightId: that.rightId, busObjectId: that.currentBoId });
        if (res.success) {
          var data = res.data;
          $.each(data, function (i, item) {
            item.checked = false;
            if (item.itemPermission && typeof item.itemPermission === 'string') {
              item.itemPermission = eval('(' + item.itemPermission + ')');
            }
          });
          that.buttonFieldPremsList = data;
        }
      },
      loadCustomDataGridButtonFieldList() {
        // 自定义列表按钮
        var that = this;
        var res = Object.toAjaxJson('/workflow/formPermission/', 'getCustomDataGridButtonFieldPermission', { rightId: that.rightId, dataGridId: that.formKey });
        if (res.success) {
          var data = res.data;
          $.each(data, function (i, item) {
            item.checked = false;
            if (item.itemPermission && typeof item.itemPermission === 'string') {
              item.itemPermission = eval('(' + item.itemPermission + ')');
            }
          });
          that.buttonFieldPremsList = data;
        }
      },
      loadFormCustButtonFieldList() {
        // 自定义列表按钮
        var that = this;
        var res = Object.toAjaxJson('/workflow/formPermission/', 'getFormCustButtonFieldPermission', { rightId: that.rightId, formKey: that.formKey });
        if (res.success) {
          var data = res.data;
          $.each(data, function (i, item) {
            item.checked = false;
            if (item.itemPermission && typeof item.itemPermission === 'string') {
              item.itemPermission = eval('(' + item.itemPermission + ')');
            }
          });
          that.buttonFieldPremsList = data;
        }
      },
      changeFieldCheckAll(v) {
        var that = this;
        $.each(that.fieldPremsList, function (i, item) {
          item.checked = v;
        });
      },
      changeButtonCheckAll(v) {
        var that = this;
        $.each(that.buttonFieldPremsList, function (i, item) {
          item.checked = v;
        });
      },
      bathSetType(powertype, value, fieldType) {
        var that = this;
        var data = [];
        if (fieldType == 'field') {
          data = that.fieldPremsList;
        } else if (fieldType == 'button') {
          data = that.buttonFieldPremsList;
        }
        $.each(data, function (i, item) {
          item.itemPermission[powertype].type = value;
          item.itemPermission[powertype].detail = [];
        });
      },
      save() {
        var that = this;
        var saveData = Object.toDeepClone(that.fieldPremsList);

        if (that.isNeedButtonPermissionList) {
          var saveSubButtonData = Object.toDeepClone(that.buttonFieldPremsList);
          $.each(saveSubButtonData, function (i, btnItemPermis) {
            saveData.push(btnItemPermis);
          });
        }
        $.each(saveData, function (i, item) {
          // 如果设置了 无或所有人时，应该将详细设置为空
          $.each(that.powerTypeArr, function (i, ptype) {
            if (item.itemPermission[ptype] && (item.itemPermission[ptype].type == 'all' || item.itemPermission[ptype].type == 'none')) {
              item.itemPermission[ptype].detail = [];
            }
          });
          if (item.itemPermission && typeof item.itemPermission === 'object') {
            item.itemPermission = JSON.stringify(item.itemPermission);
          }
        });
        var fieldPremsListJson = JSON.stringify(saveData);
        var res = Object.toAjaxJson('/workflow/formPermission/', 'saveFormFieldListPermissions', { fieldPremsListJson: fieldPremsListJson });
        if (res.success) {
          FUI.Window.showMsg(res.msg, null, 1, function () {
            that.loadFieldList();
            // that.closeEdit();
          });
        } else {
          FUI.Window.showMsg(res.msg);
        }
      },
      listen() {
        this.menuVisible = false;
      },
      collapsedSider() {
        this.isCollapsed = !this.isCollapsed;
      },
      closeEdit() {
        if (window.opener != null) {
          FUI.Window.close();
        } else {
          FUI.Window.closeEdit();
        }
      },
      filterTreeNode(value, data) {
        if (!value) return true;
        return data.title.indexOf(value) !== -1;
      },
      showAll() {
        this.searchParams.CategoryCode = '';
        this.dataGridSearch();
      },
      loadTree() {
        var that = this;
        var treeUrl = FUI.Handlers.SmartFormHandler + 'getBoTreeJsonByFormDefId/?formDefId=' + that.formDefId;
        Object.toAjaxJson(treeUrl, null, null, true, null, function (res) {
          if (res.success) {
            that.treeData = res.data;
            var msg = res.msg;
            if (that.currentBoId == '') {
              that.onTreeSelected(that.treeData[0]);
            }
          } else {
            FUI.Window.showMsg(res.msg);
          }
        });
      },
      onTreeSelected(data, treeNode, thisObj) {
        if (data == null) {
          return false;
        }
        this.currentBoId = data.id;
        this.currentBoTitle = data.title;
        var attObj = data.attributes;
        this.currentTableName = attObj.tableName;
        this.currentTableId = attObj.tableId;
        this.isSubtable = attObj.type == 'subtable';
        this.isNeedButtonPermissionList = this.isSubtable;
        this.loadFieldList();
      },
      // ====stand:标准方法控制结束==============
      myOperationBeforeDeleteEvent(value, row, index) {
        if (confirm('删除后将影响表单设计模板中对应的字段控件容器div的fieldId的ID值，请删除后需到表单设计器中删除对应的字段控件或者手动修改表单模板中的这个值。请慎重评估是否要删除！')) {
          return true;
        }
        return false;
      },
      myOperationEditEvent(value, row, index) {
        var fieldTitle = row.FieldTitle;
        this.showDialogEdit(value, FUI.FormAction.Edit, fieldTitle);
      },
      showDialogEdit(keyIdValue, fromAction, fieldTitle) {
        var that = this;
        var title = '设置【' + fieldTitle + that.dg.EditTitle;
        var url = that.dg.EditUrl;
        var parms = {
          fieldIds: keyIdValue
        };
        FUI.Window.openEdit(url, title, formAction, that.dg.GridId, 870, 500, null, that.dg.MainTable, keyIdValue, false, null, parms);
      },
      bathSetDetail(powertype, powertypeTitle, value, fieldType) {
        var that = this;
        var data = [];
        if (fieldType == 'field') {
          data = that.fieldPremsList;
        } else if (fieldType == 'button') {
          data = that.buttonFieldPremsList;
        }
        var arr = data.filter(a => a.checked);
        var n = arr.length;
        if (n <= 0) {
          FUI.Window.showMsg('请选择要批量设置的行');
          return false;
        }
        that.setFieldPermissionDetail({ detail: [] }, null, powertype, '批量' + n + '个' + powertypeTitle, '详细', fieldType, 1);
      },
      setFieldPermissionDetail(powerTypeObj, fieldName, powerType, title, typetitle, fieldType, isbathDetail) {
        const that = this;
        if (!powerTypeObj.detail || powerTypeObj.detail.length == 0) {
          powerTypeObj.detail = [];
        }
        if (!isbathDetail) {
          isbathDetail = 0;
        }
        that.currentField = { fieldName: fieldName, powerType: powerType };
        that.currentDetail = powerTypeObj.detail;
        var title = '配置【' + title + '】' + typetitle + '权限';
        var url = '/workflow/smartForm/formPermission/setFieldPermissionDetail/?rightType=' + that.rightType + '&isbathDetail=' + isbathDetail + '&fieldType=' + fieldType + '&appId=' + that.appId;
        FUI.Window.openEdit(url, title, FUI.FormAction.Edit, null, 880, 580, null, null, null, true);
      },
      updateCurrentFieldDetail(newDetail, fieldType, isbathDetail) {
        // fieldType:field字段，button：按钮
        var that = this;
        if (!isbathDetail) {
          // 是否为批量详细设置
          isbathDetail = 0;
        }
        var data = [];
        if (fieldType == 'field') {
          data = that.fieldPremsList;
          that.isFieldCheckAll = false;
        } else if (fieldType == 'button') {
          data = that.buttonFieldPremsList;
          that.isButtonCheckAll = false;
        }
        var powerType = that.currentField.powerType;
        if (isbathDetail == 1) {
          $.each(data, function (i, field) {
            if (field.checked) {
              field.itemPermission[powerType].type = 'detail';
              field.itemPermission[powerType].detail = newDetail;
              field.checked = false;
            }
          });
        } else {
          var fieldName = that.currentField.fieldName;
          $.each(data, function (i, field) {
            if (field.fieldName == fieldName) {
              field.itemPermission[powerType].detail = newDetail;
              field._changeFlag = Object.toGuid();
              return false;
            }
          });
        }
      },
      treeNodeContextmenu(event, value, node, element) {
        // 不使用右键了
        return false;
        var attObj = value.attributes;
        if (attObj.type != 'subtable') {
          // 子表才允许
          return false;
        }
        this.currentTableId = attObj.tableId;
        this.currentBoId = attObj.busObjectId;
        this.currentTableName = attObj.tableName;
        this.currentBoTitle = value.text;
        this.menuVisible = true;
        const menu = document.querySelector('#treeMenu');
        /* 菜单定位基于鼠标点击位置 */
        menu.style.left = event.clientX + 20 + 'px';
        menu.style.top = event.clientY - 10 + 'px';
      },
      refreshFieldTitle() {
        var that = this;
        var res = Object.toAjaxJson('/workflow/formPermission/', "refreshFieldPermissionTitleByRightBoId", { rightId: that.rightId, formDefId: that.formDefId, busObjectId: that.currentBoId });
        if (res.success) {
          FUI.Window.showMsg(res.msg, null, 1, function () {
            that.loadFieldList();
          });
        } else {
          FUI.Window.showMsg(res.msg);
        }
      }
      , deleteAll(isDeleteButtonPermis) {
        var that = this;
        var msg = isDeleteButtonPermis ? '您确定删除【' + that.currentBoTitle + '】所有权限按钮' : '您确定删除【' + that.currentBoTitle + '】所有权限字段';
        var method = isDeleteButtonPermis ? 'deleteButtonListPermissionsByRightIdBoId' : 'deleteFormFieldListPermissionsByRightBoId';
        FUI.Window.confirm(msg, null, function () {
          var res = Object.toAjaxJson('/workflow/formPermission/', method, { rightId: that.rightId, formDefId: that.formDefId, busObjectId: that.currentBoId });
          if (res.success) {
            FUI.Window.showMsg(res.msg, null, 1, function () {
              that.loadFieldList();
            });
          } else {
            FUI.Window.showMsg(res.msg);
          }
        });
      }
      //删除一个权限字段
      , deleteRightItem(rightItemId, title, isBtn) {
        var that = this;
        var msg = '您确定删除【' + title + '】权限字段，如果表单本身存在此字段，删除后列表会自动重新加入。';
        if (isBtn == true) {
          msg = '您确定删除【' + title + '】权限按钮，如果表单本身存在此按钮，删除后列表会自动重新加入。';
        }
        var method = 'deleteRightItem';
        FUI.Window.confirm(msg, null, function () {
          var res = Object.toAjaxJson('/workflow/formPermission/', method, { rightItemIds: rightItemId });
          if (res.success) {
            FUI.Window.showMsg(res.msg, null, 1, function () {
              that.loadFieldList();
            });
          } else {
            FUI.Window.showMsg(res.msg);
          }
        });
      },
      treeNodeRightMenuSelect(key) {
        var that = this;
        var fn = that[key];
        fn();
      }
    }
  }
</script>
<style>
  .add_state {
    font-weight: bold;
  }

  .el-checkbox__label {
    padding-left: 0px;
  }

  .common-grid td {
    vertical-align: top !important;
  }
</style>