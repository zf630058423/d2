<template>
  <div class="f2bpm-page-layout">
    <el-container>
      <el-header style="background-color: rgb(48, 65, 86); color: white; height: 45px;line-height: 45px; ">
        <el-row>
          <el-col :span="4">
            <span class="brand"><i class="fa fa-th" style="margin-right: 3px;" /><span />图表元件设计【<span v-html="data.reportName" />】</span>
          </el-col>
          <el-col :span="20">
            <div id="normalModeToolbar">
              <el-button-group class="mr5">
                <el-button size="mini" type="default" icon="fa fa-code" @click="editJscriptTemplate()">脚本</el-button>
              </el-button-group>
              <el-button-group class="mr5">
                <!-- <el-button size="mini" type="default" @click="editFormOptions()" icon="fa fa-cog">高级属性</el-button> -->
              </el-button-group>

              <el-button-group class="mr5">
                <el-button size="mini" type="default" icon="fa fa-save" @click="submitForm()">保存</el-button>
                <el-button size="mini" type="default" onclick="FUI.Window.close()" icon="fa fa-minus-circle">关闭</el-button>
              </el-button-group>

              <el-button-group class="mr5">
                <!-- <el-button size="mini" type="danger" @click="cleanAll()" icon="fa  fa-trash">清空</el-button> -->
              </el-button-group>
            </div>
            <div id="jscriptModeToolbar" style="display: none">
              <el-button-group class="mr5">
                <el-button size="mini" type="default" icon="fa   fa-save" @click="saveEditJscriptTemplate('save')">暂存并返回</el-button>
                <el-button size="mini" type="default" icon="fa   fa-undo" @click="saveEditJscriptTemplate('cancle')">取消并返回</el-button>
              </el-button-group>

              <el-button-group>
                <el-button size="mini" type="default" icon="fa fa-search" @click="selectExtendEventFunctionName()">选择扩展事件函数</el-button>
                <el-button size="mini" type="default" icon="fa fa-magic" @click="javascriptFormatter()">格式化美化脚本排版</el-button>
              </el-button-group>
            </div>
          </el-col>
        </el-row>
      </el-header>
      <el-container id="onlinedesigner_maincontainer">
        <el-aside ref="sideLeft" class="dash-chart-left" :width="isCollapsed?'20px':'220px'" hide-trigger collapsible>
          <div id="left" style=" margin: 0px; padding: 0px; width:100%; overflow-x: hidden; overflow-y: auto">
            <div class="f2bpm-panel-head bg-gray">
              <span class="ml10">图表元件设计</span>
              <!-- <div v-if="!isCollapsed" style="width: 160px;float: left;">
                <input type="text" placeholder="输入搜索关键字" class="textBoxAutoShort" style="border: 0px; margin-top: 2px;margin-left: 3px;   height: 24px;" id="searchKey">
              </div> -->
              <div style=" float: right;line-height:35px;padding-right: 5px;cursor: pointer;">
                <!-- <span v-if="!isCollapsed" class="cur fa fa-search mr2" onclick="searchfield()"></span> -->
                <!-- <span v-if="!isCollapsed" class="cur fa fa-undo mr4" onclick="searchReSet()"></span> -->
                <i title="收起/展开" :class="rotateIcon" @click="collapsedSider" />
              </div>
            </div>
            <div v-show="!isCollapsed" class="left-sidebar-nav">

              <div class="group-title">
                <span style="cursor: pointer" onclick="onClickLeftPanel(this, 'drap_ctrs_container')"><i class="fa  fa-columns" style="margin-right: 4px; margin-left: 6px;" />图表类型</span>
              </div>
              <div class="config-block">
                <div class="config-type">

                  <div class="chart-type" data-type="totalnum" @click="changeChartType('totalnum',$event)">
                    <div class="chart-image chart-type-0" title="总数统计：0个维度，可多个指标" />
                  </div>
                  <div class="chart-type" data-type="table" @click="changeChartType('table',$event)">
                    <div class="chart-image chart-type-1" title="表格列表：多个维度多个指标" />
                  </div>

                  <div class="chart-type  cur" data-type="column" title="柱状图：单个维度或可多个维度合成分组，可多个指标" @click="changeChartType('column',$event)">
                    <div class="chart-image chart-type-2" />
                  </div>
                  <div class="chart-type cur" data-type="line" title="折线图：单个维度或可多个维度合成分组，可多个指标" @click="changeChartType('line',$event)">
                    <div class="chart-image chart-type-4" />
                  </div>
                  <div class="chart-type cur" data-type="bar" title="条形图：单个维度或可多个维度合成分组，可多个指标" @click="changeChartType('bar',$event)">
                    <div class="chart-image chart-type-3" />
                  </div>
                  <div class="chart-type  cur" data-type="pie" title="饼图：单个维度或可多个维度合成分组，只能配置1个指标" @click="changeChartType('pie',$event)">
                    <div class="chart-image chart-type-7" />
                  </div>
                  <div class="chart-type  cur" data-type="funnel" title="漏斗图：单个维度或可多个维度合成分组，，只能配置1个指标" @click="changeChartType('funnel',$event)">
                    <div class="chart-image chart-type-6" />
                  </div>

                  <div class="chart-type  cur" data-type="area" title="面积堆叠图" @click="changeChartType('area',$event)">
                    <div class="chart-image chart-type-5" />
                  </div>

                  <div class="chart-type  cur" data-type="radar" title="雷达图：单个维度或可多个维度合成分组，多个指标" @click="changeChartType('radar',$event)">
                    <div class="chart-image chart-type-8" />
                  </div>
                  <!-- <div class="chart-type disable" data-type="map" title="地图" @click="changeChartType('map',$event)">
                    <div class="chart-image chart-type-9"></div>
                  </div> -->
                </div>
              </div>

              <div class="group-title">
                <span style="cursor: pointer" onclick="onClickLeftPanel(this, 'drap_fields')"><i class="fa  fa-database" style="margin-right: 4px; margin-left: 6px;" />数据源</span>
              </div>

              <div class="config-block">
                <div class="block-body">

                  <div class="block-body-item">
                    <div class="input-label" style="width:55px;">
                      数据源<i class="red">*</i>
                    </div>
                    <div class="input-block" style="width: 124px;">
                      <el-select v-model="data.dataSorceType" size="mini">
                        <el-option label="表单应用" value="processform" />
                        <el-option label="表或视图" value="tableview" />
                        <el-option label="SQL" value="sql" />
                      </el-select>
                    </div>
                  </div>
                  <div v-if="data.dataSorceType=='sql'" class="block-body-item">
                    <div class="input-label" style="width:55px;">
                      SQL
                    </div>
                    <div class="input-block" style="width: 154px;">
                      <el-input v-model="data.chartSql" size="mini" placeholder="SQL" style="width:125px;margin-right:3px; " />
                      <span class="cur font12 fa fa-cog pl5" title="编辑SQL" @click="onSqlClick('chartSql')" />
                    </div>
                  </div>
                  <div v-if="data.dataSorceType=='processform'" class="block-body-item">
                    <div class="input-label" style="width:55px;">
                      表单
                    </div>
                    <div class="input-block" style="width: 154px;">
                      <el-input v-model="dataSorceOpt.processform.title" size="mini" placeholder="选择表单" style="width:125px;margin-right:3px; " />
                      <span class="cur font12 fa fa-cog pl5" title="选择表单" @click="selectProcessForm()" />
                    </div>
                  </div>
                  <div v-if="data.dataSorceType=='tableview'" class="block-body-item">
                    <div class="input-label" style="width:55px;">
                      表或视图
                    </div>
                    <div class="input-block" style="width: 154px;">
                      <el-input v-model="dataSorceOpt.tableview.name" size="mini" placeholder="选择表或视图" style="width:125px;margin-right:3px; " />
                      <span class="cur font12 fa fa-cog pl5" title="选择表或视图" @click="selectDbTable('name','allns')" />
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </el-aside>
        <el-main class="dash-chart-main" style="overflow: hidden;padding: 0px;">
          <!--内容-->
          <div id="contentContainer" style="overflow: hidden; ">
            <div v-show="currentEditType == 'designer'">
              <div class="chart-axis">
                <div class="input-label">图表名称</div>
                <div class="input-block">
                  <el-input v-model="data.reportName" size="small" placeholder="请填写图表名称" />
                </div>
              </div>
              <div class="chart-axis">
                <div class="input-label">SQL过滤条件</div>
                <div class="input-block">
                  <el-input v-model="adOptions.where" size="small" clearable style="width:600px" placeholder="配置SQL过滤条件" />
                  <span class="fa fa-search font12 ml10 cur" @click="selectSystemVars('where')">选择系统变量</span>
                  <span class="fa fa-search font12 ml10 cur" @click="selectFormField('where')">选择字段</span>
                </div>
              </div>
              <div class="chart-axis">
                <div class="input-label">扩展条件插件类</div>
                <div class="input-block">
                  <el-input v-model="adOptions.whereAssembly" size="small" clearable placeholder="由扩展插件Java类返回过滤条件的sql,填写含类包路径全名称;示例参考：DemoDefaultWhereAssembly.java" />
                </div>
              </div>
              <div id="drapDesignContainer" :style="'height:'+countGridHeight+'px;overflow:auto;background-color:#FFFFFF'">
                <f2bpm-report :code="reportCode" />
              </div>
            </div>
            <div v-show="currentEditType == 'editHtml'" id="editHtmlTemplateContainer" style="height: 700px; width: 100%;">
              <textarea id="editHtmlTemplateTextarea" />
            </div>
            <div v-show="currentEditType == 'editJs'" id="editJscriptTemplateContainer" style="height: 700px; width: 100%;">
              <textarea id="editJscriptTemplateTextarea">{{ jscript }}</textarea>
              <span><em class="em">强烈建议将脚本在本地的开发工具或notepad++等工具上编写好再复制粘贴到表单设计器</em></span>
            </div>
            <div style="height:90px;" />
          </div>
        </el-main>
        <!--右侧属性设置-->
        <el-aside class="dash-chart-right" :width="isPropertyCollapsed?'20px':'300px'">
          <div class="f2bpm-panel-head  bg-gray">
            <div style=" float: left;line-height:35px;padding-right:1px;margin-left: 5px;">
              <i style="font-size: 14px;" title="收起/展开" :class="rotatePropertyIcon" @click="propertyCollapsedSider" />
            </div>
            <div v-show="!isPropertyCollapsed">
              <el-tooltip class="item" effect="dark" content="属性设置" placement="bottom">
                <i class="fa  fa-question-circle-o cur" style="margin-left:5px;font-weight: bold"> 属性设置</i>
              </el-tooltip>
            </div>

          </div>
          <div v-show="!isPropertyCollapsed" class="auto-window-height" style="padding: 10px;font-size: 12px; ">
            <!-- 属性设置-->
            <el-form ref="fieldFormRef" class="miniform" label-suffix="：" size="mini" label-width="90px">
              <div class="config-block">
                <div class="block-head">基础信息</div>
                <div class="block-body">
                  <div>
                    <div class="input-label" style="width:50px;">
                      标题
                    </div>
                    <div class="input-block" style="width: 190px;">
                      <el-input v-model="activeProperty.title" size="mini" placeholder="请输入标题" />
                    </div>
                  </div>
                  <div>
                    <div class="input-label" style="width:50px;">
                      子标题
                    </div>
                    <div class="input-block" style="width: 190px;">
                      <el-input v-model="activeProperty.subtitle" size="mini" placeholder="请输入子标题" />
                    </div>
                  </div>

                  <div>
                    <div class="input-label" style="width:50px;">
                      显示标题
                    </div>
                    <div class="input-block" style="width: 190px;">
                      <el-switch v-model="activeProperty.showTitle" active-color="#87DC48" inactive-color="#DEDEDE" />
                    </div>
                  </div>

                </div>
              </div>

              <div class="config-block">
                <div class="block-head">坐标X轴</div>
                <div class="block-body">
                  <div class="block-body-item">
                    <div class="input-label" style="width:72px;">
                      X轴名称<i class="red">*</i>
                    </div>
                    <div class="input-block" style="width: 144px;">
                      <el-input v-model="activeProperty.xName" size="mini" placeholder="请输入y轴名称" />
                    </div>
                  </div>

                  <div class="block-body-item">
                    <div class="input-label" style="width:72px;">
                      旋转初始值
                    </div>
                    <div class="input-block" style="width: 144px;">
                      <el-input-number v-model="activeProperty.axisLabel.interal" size="mini" :max="180" placeholder="请输入初始值" />
                    </div>
                  </div>
                  <div class="block-body-item">
                    <div class="input-label">
                      文字旋转角度
                    </div>
                    <div class="input-block" style="width: 144px;">
                      <el-input-number v-model="activeProperty.axisLabel.rotate" size="mini" :step="15" :min="-180" :max="180" placeholder="请输入旋转角度数值" />
                    </div>
                  </div>

                  <div v-if="activeProperty.chartType!='totalnum'" class="block-body-item" style="margin-top:15px;">
                    <el-tooltip class="item" effect="dark" content="分组维度：是指统计依据哪个字段作为分组统计，也就是说按哪几个字段合起来做为分类计算，即Group By字段" placement="bottom">
                      <span style="margin-left:7px;font-weight: bold;">分组维度(按什么分类计算)</span>
                    </el-tooltip><i class="red">*</i><i class="fa  fa-question-circle-o" />
                    <div style="padding-left:5px;">
                      <div v-for="(item, _index) in activeProperty.groupbys" style="margin-bottom: 3px;margin-left:3px;margin-top: 5px;">
                        <span class="cur font12" style="font-size:9px;  border-radius:2px;padding:6px;">第{{ _index+1 }}维度</span>
                        <el-input v-model="item.title" size="mini" placeholder="标题" style="width: 80px;margin-right: 2px;margin-left: 3px;" />
                        <el-input v-model="item.field" size="mini" placeholder="字段名" style="width: 75px;margin-right: 3px;margin-left:2px;" />
                        <span class="cur font12 fa fa-search pl5" title="选择维度字段" @click="selectDbColumn(item)" />
                        <i class="fa fa-trash  cur ml10 red font12" title="删除维度字段" @click="deleteItemInProps(activeProperty,_index,'groupbys')" />
                      </div>
                      <i class="fa  fa-plus cur font12 mt10" style="margin-left: 5px;font-weight: bold" @click="addItemInProps(activeProperty.groupbys,'groupbys')">添加维度</i>
                    </div>
                  </div>

                </div>
              </div>

              <div class="config-block">
                <div class="block-head">坐标Y轴</div>
                <div class="block-body">
                  <div class="block-body-item">
                    <div class="input-label" style="width:60px;">
                      Y轴名称<i class="red">*</i>
                    </div>
                    <div class="input-block" style="width: 180px;">
                      <el-input v-model="activeProperty.yName" size="mini" placeholder="请输入y轴名称" />
                    </div>
                  </div>

                  <div class="block-body-item" style="margin-top: 15px;">
                    <el-tooltip class="item" effect="dark" content="指标：是指Y轴上需要显示目标统计分类，比如数量、增涨量、同比量" placement="bottom">
                      <span style="margin-left:7px;font-weight: bold;">指标配置</span>
                    </el-tooltip><i class="red">*</i><i class="fa  fa-question-circle-o" />
                    <div style="padding-left:2px;margin-top: 10px;">
                      <div v-for="(legend, _index) in activeProperty.legends" style="margin-bottom: 3px;margin-left:3px;margin-top: 5px;">
                        <span class="cur font12" title="选择颜色" :style="' margin-right:2px;font-size:9px;color: #FFFFFF; border-radius:2px;padding:6px;background-color:'+legend.color">第{{ _index+1 }}</span>
                        <el-input v-model="legend.title" size="mini" placeholder="字段标题" :style="data.dataSorceType=='sql'?'width: 80px;':'width: 150px;'" />
                        <el-input v-if="data.dataSorceType=='sql'" v-model="legend.field" size="mini" placeholder="字段名" style="width:70px; margin-left:1px; " />
                        <el-select v-model="legend.math" size="mini" style="width: 75px;margin-left:1px; ">
                          <el-option label="计数" value="count" />
                          <el-option label="合计" value="sum" />
                          <el-option label="平均" value="avg" />
                        </el-select>
                        <div style="text-align: right;padding: 3px;padding-right: 10px;">
                          <span v-if="data.dataSorceType!='sql'" class="cur font12 fa fa-search pl5" title="选择字段指标" @click="selectDbColumn(legend)" />
                          <span class="cur font12 fa fa-paint-brush pl5" title="选择颜色" @click="colorSelect(legend)" />
                          <span class="fa fa-trash  cur ml10 red font12" title="删除指标" @click="deleteItemInProps(activeProperty,_index,'legends')" />
                        </div>

                      </div>
                      <i class="fa  fa-plus cur font12" style="margin-left: 5px;font-weight: bold" @click="addItemInProps(activeProperty.legends,'legends')">添加指标</i>
                    </div>
                  </div>

                </div>
              </div>

              <div class="config-block">
                <div class="block-head">通用颜色</div>
                <div class="block-body">
                  <div class="block-body-item" style="margin-top: 15px;">
                    <el-tooltip class="item" effect="dark" content="如：饼图、漏斗图 的颜色" placement="bottom">
                      <span style="margin-left:7px;font-weight: bold;">颜色配置</span>
                    </el-tooltip><i class="red">*</i><i class="fa  fa-question-circle-o" />
                    <div style="padding-left:5px;margin-top: 10px;">
                      <div v-for="(color, _index) in activeProperty.colors" style="margin-bottom: 3px;margin-left:3px;margin-top: 5px;">
                        <span class="cur font12" title="选择颜色" :style="'font-size:9px;color: #FFFFFF; border-radius:2px;padding:6px;background-color:'+color.color">第{{ _index+1 }}</span>
                        <el-input v-model="color.color" size="mini" placeholder="请选颜色" style="width: 90px;margin-right: 5px;margin-left: 3px;" />
                        <el-input v-model="color.title" size="mini" placeholder="填写名称" style="width: 80px;margin-right: 5px;margin-left: 3px;" />
                        <span class="cur font12 fa fa-paint-brush pl5" title="选择颜色" @click="colorSelect(color)" />
                        <i class="fa fa-trash  cur ml10 red font12" title="删除指标" @click="deleteItemInProps(activeProperty,_index,'colors')" />
                      </div>
                      <i class="fa  fa-plus cur font12" style="margin-left: 5px;font-weight: bold" @click="addItemInProps(activeProperty.colors,'colors')">添加颜色</i>
                    </div>
                  </div>
                </div>
              </div>

              <div class="config-block">
                <div class="block-head">其它属性</div>
                <div class="block-body">
                  <div class="block-body-item" style="margin-top: 15px;">
                    <el-tooltip class="item" effect="dark" content="配置其它属性" placement="bottom">
                      <span style="margin-left:7px;font-weight: bold;">其它属性</span>
                    </el-tooltip><i class="fa  fa-question-circle-o" />
                    <div style="padding-left:5px;margin-top: 10px;">
                      <div style="margin-bottom: 3px;margin-left:3px;margin-top: 5px;">
                        <span class="cur font12">数值小数位<i class="red">*</i></span>
                        <el-input-number v-model="activeProperty.properties.digit" size="mini" placeholder="填写数值小数位" style="width:120px;margin-right: 5px;margin-left: 3px;" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div style="height: 80px;" />
            </el-form>

          </div>
          <el-drawer :title="drawerTitle" :visible.sync="drawer" :direction="direction" :before-close="drawerClose">
            <div>
              <pre>{{ drawerContent }}}</pre>
            </div>
          </el-drawer>
          <div v-show="menuVisible" id="rightMenu" class="treeRightMenu" @mouseleave="rightMenuMouseleave()">
            <el-menu id="menu" text-color="#000" @select="rightMenuSelect">
              <el-menu-item v-if="isShowEditFieldMenu" index="rightMenuEdit">
                <i class="fa fa-edit" /> 编辑控件
              </el-menu-item>
              <el-menu-item index="rightMenuDelete">
                <i class="fa fa-trash-o" />删除控件
              </el-menu-item>
            </el-menu>
          </div>
        </el-aside>
      </el-container>
    </el-container>
  </div>
</template>

<script>
  import f2bpmReport from '@/views/workflow/components/onlineForm/f2bpm-report'
  window.editorJS = null
  export default {
    components: {
      f2bpmReport
    }, data() {
      return {
        report_error_msg: '',
        formAction: null,
        isPropertyCollapsed: false,
        isCollapsed: false,
        subtableKey: 101,
        // editHtml,editJs,designer
        currentEditType: 'designer',
        isShowEditHtml: true,
        reportCode: '',
        // Url参数
        formDefId: '',
        reportId: '',
        // 右键相关
        currentRightData: null,
        currentRightParms: null,
        menuVisible: false,
        isShowEditFieldMenu: true,
        // 抽屉
        drawerTitle: '查看',
        drawerContent: '',
        drawer: false,
        direction: 'rtl',
        // 图表显示的数据
        chartData: [],
        // Model Json
        data: { rportType: '' },
        // 图表JSON
        designerJson: {},
        // 高级属性
        adOptions: {},
        // 数据源参数配置
        dataSorceOpt: {},
        // 扩展的脚本
        jscript: '',
        // 当前编辑的属性
        activeProperty: {},
        // echart 展现
        echart: {},
        digit: 2,
        // table展现
        table: {
          columns: [{ title: '维度', field: 'name' }, { title: '指标1', field: 'value' }, { title: '指标2', field: 'value1' }, { title: '指标3', field: 'value2' }],
          data: [
            { name: '南昌', value: 439, value1: 146, value2: 3 },
            { name: '张三', value: 439, value1: 146, value2: 3 }
          ]
        },
        formRules: {
        }

      }
    },
     computed: {
      countGridHeight() {
        return $(document).height() - 190
      },
      rotatePropertyIcon() {
        return this.isPropertyCollapsed ? 'fa fa-angle-double-left' : 'fa fa-angle-double-right'
      },
      rotateIcon() {
        return this.isCollapsed ? 'fa fa-angle-double-right' : 'fa fa-angle-double-left'
      }
    },
     created: function() {
      window.myvm = this
      // 标准结构
      var default_options_demo = {
        'chart':
        {
          // 自己的属性
          'chartType': 'column', // bar,line
          'properties': { digit: 2 }, // 其它属性配置,digit数值小数位
          'colors:': [{ color: '', title: '' }],
          'legends': [{ title: '数量', field: '字段名', math: 'count,avg', color: '#000' }],
          'groupbys': [{ title: '流程应用', field: 'AppId' }],
          'showTitle': true,
          // echart的属性
          'title': '',
          'subtitle': '',
          'xName': '',
          'yName': '',
          'axisLabel': { 'rotate': '', 'interal': '' },
          'legend': [], 'legendColor': ''
        },
        'grid':
        {
          'sort': '',
          'order': 'desc'
        }
      }

      var default_options = { 'chart': { 'title': '', 'subtitle': '', 'xName': '', 'yName': '', 'axisLabel': { 'rotate': '', 'interal': '' }, 'showTitle': true, 'groupbys': [], 'legends': [], 'legend': [], 'legendColor': '' }, 'grid': { 'sort': '', 'order': 'desc' }}

      var that = this
      var reportId = Object.toQueryString('reportId') || ''
      var formDefId = Object.toQueryString('formDefId') || ''
      that.reportId = reportId
      that.formDefId = formDefId
      var res = Object.toAjaxJson(FUI.Handlers.Report, 'getModelJson', { reportId: that.reportId })
      if (res.success) {
        that.data = res.data
        that.reportCode = that.data.reportCode
        that.dataSorceOpt = that.data.dataSorceOpt ? eval('(' + that.data.dataSorceOpt + ')') : { processform: { formKey: '', title: '' }, tableview: { name: '', title: '' }}

        that.options = res.data.options ? eval('(' + res.data.options + ')') : default_options
        that.adOptions = res.data.adOptions ? eval('(' + res.data.adOptions + ')') : { where: '', whereAssembly: '', isJoinAssembly: '', whereOption: [] }
        that.jscript = res.data.jscript
        if (!that.options.chart.legends) {
          that.options.chart.legends = []
        }
        if (!that.options.chart.groupbys) {
          that.options.chart.groupbys = []
        }
        if (that.options.chart.showTitle == undefined) {
          that.options.chart.showTitle = true
        }

        if (!that.options.chart.colors) {
          that.options.chart.colors = []
        }
        if (!that.options.chart.chartType) {
          that.options.chart.chartType = 'column'
        }
        // 其它属性
        if (!that.options.chart.properties) {
          that.options.chart.properties = { digit: 2 }
        }
        // 当前属性
        that.activeProperty = that.options.chart
        $('title').html('图表设计-' + that.data.reportName)
      }
    },
     mounted() {
      var that = this
      if (that.data.rportType) {
        $("div[data-type='" + that.data.rportType + "']").addClass('select')
      }

      document.addEventListener('click', this.listen)
      editorJS = CodeMirror.fromTextArea(document.getElementById('editJscriptTemplateTextarea'), {
        mode: 'text/javascript',
        indentUnit: 2, // 缩进单位，默认2
        smartIndent: true, // 是否智能缩进
        tabSize: 4, // Tab缩进，默认4
        readOnly: false,
        showCursorWhenSelecting: true,
        height: 500,
        lineNumbers: true,
        continueComments: 'Enter',
        extraKeys: {
          'Ctrl-B': 'toggleComment'
        }
      })
      editorJS.setSize($(window).width() - 550, $(window).height() - 100)
    },

    methods: {
      collapsedSider() {
        this.isCollapsed = !this.isCollapsed
      },
       propertyCollapsedSider() {
        this.isPropertyCollapsed = !this.isPropertyCollapsed
      },
       closeEdit() {
        FUI.Window.closeEdit()
      },
       rightMenuMouseleave() {
        this.menuVisible = false
      },
       listen() {
        this.menuVisible = false
      },
       changeChartType(chartType, $event) {
        var targetEl = $event.currentTarget
        $('.config-type div').each(function(i, item) {
          $(item).removeClass('select')
        })
        $(targetEl).addClass('select')
        var that = this
        that.options.chart.chartType = chartType
        that.data.rportType = chartType
      },
       previewChart() {
        var that = this
        // 选中
        $("div[data-type='" + that.echart.chartType + "']").addClass('select')
      },
      // field: 可以是字段名也可以是字段定义的对象
       updateFieldValue(field, newValue, vueDataName, subVueDataName) {
        console.info('updateFieldValue')
        // 更新自己控件值
        var that = this
        var vueDataObj = vueDataName ? that[vueDataName] : that.data
        if (subVueDataName) {
          vueDataObj = that[vueDataName][subVueDataName]
        }
        if (typeof field === 'string') {
          vueDataObj[field] = newValue
        } else {
          if (field.vModel) {
            vueDataObj[field.vModel] = newValue
          } else if (field['field']) {
            vueDataObj[field['field']] = newValue
          }
        }
      },
       appendFieldValue(fieldName, newValue, vueDataName, subVueDataName) {
        console.info('appendFieldValue')
        // 追加值到指定字段
        var that = this
        var vueDataObj = vueDataName ? that[vueDataName] : that.data
        if (subVueDataName) {
          vueDataObj = that[vueDataName][subVueDataName]
        }
        var oleValue = vueDataObj[fieldName] || ''
        if (oleValue) {
          vueDataObj[fieldName] = oleValue + ',' + newValue
        }
        vueDataObj[fieldName] = newValue
      },
       drawerClose(done) {
        done()
      },
       showJson() {
        var that = this
        var json = JSON.stringify(that.fields, null, 2)
        that.drawer = true
        that.drawerTitle = '查看JSON'
        that.drawerContent = json
        // FUI.Window.showMsg(that, json, "查看JSON", 1);
      },
       onAddCol(rowId) {
        var that = this
        var row = that.fields.find(a => a.id == rowId)
        var cols = row.children
        var spanValue = 4
        cols.push({ type: 'col', id: Object.toGuid(), label: '', span: spanValue, style: '', children: [] })
      },
       deleteItemInProps(obj, index, propName) {
        var temp = []
        $.each(obj[propName], function(i, item) {
          if (i != index) {
            temp.push(item)
          }
        })
        obj[propName] = temp
      },
       addItemInProps(arrs, propName) {
        var that = this
        if (propName == 'legends') {
          arrs.push({ title: '', field: '', math: 'count', color: '#3398DB' })
        } else if (propName == 'groupbys') {
          arrs.push({ title: '', field: '' })
        } else if (propName == 'colors') {
          arrs.push({ title: '', color: '#3398DB' })
        }
      },
       onDeleteChildOfObject(obj, id) {
        var that = this
        var childs = obj.children.filter(a => a.id != id)
        obj.children = childs
      },
       tabsClick(tab, event) {
        var that = this
        var label = tab.label
        that.activeProperty.tabSelected = label
        console.log(tab, event)
      },

       rightMenuSelect(key) {
        var that = this
        var fn = that[key]
        fn()
      },
       rightMenuEdit() {
        var that = this
        var currField = this.currentRightData
        var ctrType = currField.ctrType

        // 编辑控件
        var fieldid = currField.fieldId
        var itemId = currField.id
        if (ctrType.indexOf('extend_') > -1) {
          var url = FUI.Handlers.SmartFormHandler + 'onlineFormComponentEdit/?deviceType=' + deviceType + '&formKey=' + formKey + '&formDefId=' + formDefId + '&itemId=' + itemId
          FUI.Window.openEdit(url, '编辑扩展控件', 'Edit', '', 890, 580, null, null, fieldid, true)
        } else if (ctrType != 'subtable') {
          var url = FUI.Handlers.SmartFormHandler + 'formFieldEdit/?deviceType=' + deviceType + '&formDefId=' + formDefId + '&itemId=' + itemId
          FUI.Window.openEdit(url, '编辑控件', 'Edit', '', 880, 540, null, null, fieldid)
        } else if (ctrType == 'subtable') {
          var busObjectId = currField.props.busObjectId
          var url = FUI.Handlers.SmartFormHandler + 'onlineFormSubTableEdit/?deviceType=' + deviceType + '&busObjectId=' + busObjectId + '&formDefId=' + formDefId + '&itemId=' + itemId
          FUI.Window.openEdit(url, '编辑子表列表', 'Edit', '', 880, 540, null, null, null, true)
        }
      },

       onStyleClick(vueObj) {
        var that = this
        WF.SelectorDialog.selectTextEditor(that, 'style', '编辑样式', '样式内容', '编辑为Style样式内容，如：border: 1px solid #DDDDDD;', '只能填写style样式内容，注意使用标准写法，如：border: 1px solid #DDDDDD;', null, null, null, vueObj)
      },
       onSqlClick(inputId) {
        var that = this
        WF.SelectorDialog.selectTextEditor(that, inputId, '编辑SQL', 'Sql内容', '编辑为SQL内容，如：select * from a', '填写SQL内容，注意使用标准写法，如：Select a from b。可使用系统变量。', true, null, null, null)
      },
       selectProcessForm() {
        // 选择表单应用
        var that = this
        WF.SelectorDialog.processFormSelector(that, 'formKey', 'title', true, that.dataSorceOpt.processform)
      },
       selectDbTable(inputId, type) {
        var that = this
        WF.SelectorDialog.selectDbTable(that, inputId, null, type, true, null, that.dataSorceOpt.tableview)
      },

      // ===stand:标准化方法结束============
       submitForm() {
        var that = this
        that.data.options = JSON.stringify(that.options)
        that.data.jscript = that.jscript
        that.data.adOptions = JSON.stringify(that.adOptions)
        that.data.dataSorceOpt = JSON.stringify(that.dataSorceOpt)
        Object.toAjaxJson(FUI.Handlers.Report, 'saveDesinger', that.data, true, null, function(r) {
          if (r.success == true) {
            FUI.Window.showMsg(that, r.msg, null, 1, function() {
              window.location.reload()
            })
          } else {
            FUI.Window.showMsg(that, r.msg)
          }
        })
      },
       cleanAll() {
        this.fields = []
      },
       validateForm(refFormName) {
        // stand:表单校验
        var success = false
        this.$refs[refFormName].validate(valid => {
          success = valid
        })
        return success
      },
       editFormOptions() {
        var that = this
        FUI.Window.openEdit(__webpath + '/workflow/smartForm/formOptionsEdit/?reportId=' + that.reportId, '属性配置', 'Edit', '', 960, 700, null, null, formId)
      },

       selectExtendEventFunctionName() {
        var that = this
        var parm = {
          singleSelect: true,
          data: []
        }
        FUI.dialog(__webpath + '/workflow/smartForm/selectExtendEvent/?formDefId=' + formDefId, '选择扩展事件函数', parm, 500, 620, function(objectData, index, layer) {
          if (objectData.length == 1) {
            var fieldName = objectData[0].value
            var fieldTitle = objectData[0].text
            var func = 'function ' + fieldName + '{\r\n //' + fieldTitle + '\r\n}'
            var js = editorJS.getValue() + func
            var beauifyJs = js_beautify(js)
            editorJS.setValue(beauifyJs)
          } else if (objectData.length > 1) {
            FUI.Window.showMsg2('每次只能选择一个字段函数')
          }
          layer.close(index)
        }, true)
      },
       generateId(ctrtype, id) {
        var that = this
        var newId = 'form_item_' + Object.toGuid(false)
        if (id == 'field') {
          newId = ctrtype + '_' + Object.toGetTimeRandomNum()
        }
        that.activeProperty.id = newId
      },
      // 选择列
       selectDbColumn(vueObj) {
        var that = this
        var formKey = ''
        if (that.data.dataSorceType == 'sql') {
          FUI.Window.showMsg(that, '当前图表数据源为SQL无法使用本选择，请直接填写相应字段名')
          return false
        }
        if (that.data.dataSorceType == 'processform') {
          formKey = that.dataSorceOpt.processform.formKey
        }
        if (formKey == '' && that.data.dataSorceType == 'processform') {
          FUI.Window.showMsg(that, '请选择表单 ')
          return false
        }
        var tableName = that.dataSorceOpt.tableview.name
        if (tableName == '' && that.data.dataSorceType == 'tableview') {
          FUI.Window.showMsg(that, '请选择数据表或视图')
          return false
        }
        WF.SelectorDialog.dbfieldSelect(that, formKey, tableName, 'field', 'title', true, vueObj)
      },
       selectSystemVars(inputId) {
        WF.SelectorDialog.selectSystemVars(this, inputId, null, true, null, this.adOptions)
      },
       selectFormField(inputId) {
        var that = this
        var formKey = ''
        if (that.data.dataSorceType == 'sql') {
          FUI.Window.showMsg(that, '当前图表数据源为SQL无法使用本选择，请直接填写相应字段名')
          return false
        }
        if (that.data.dataSorceType == 'processform') {
          formKey = that.dataSorceOpt.processform.formKey
        }
        if (formKey == '' && that.data.dataSorceType == 'processform') {
          FUI.Window.showMsg(that, '请选择表单 ')
          return false
        }
        var tableName = that.dataSorceOpt.tableview.name
        if (tableName == '' && that.data.dataSorceType == 'tableview') {
          FUI.Window.showMsg(that, '请选择数据表或视图')
          return false
        }
        WF.SelectorDialog.dbfieldSelect(that, formKey, tableName, inputId, null, false, that.adOptions, true)
      },
       editJscriptTemplate() {
        var that = this
        that.currentEditType = 'editJs'
        var js = $('#editJscriptTemplateTextarea').val()
        editorJS.setValue(js)
        $('#jscriptModeToolbar').show()
        $('#normalModeToolbar').hide()
        setTimeout(function() {
          editorJS.setCursor(2)
        }, 300)
      },
       saveEditJscriptTemplate(actionType) {
        var that = this
        if (actionType == 'save') {
          var js = editorJS.getValue()
          that.jscript = js
        }
        $('#jscriptModeToolbar').hide()
        $('#normalModeToolbar').show()
        that.currentEditType = 'designer'
      },

       javascriptFormatter() {
        var that = this
        var js = editorJS.getValue()
        var beauifyJs = js_beautify(js)
        editorJS.setValue(beauifyJs)
        that.jscript = beauifyJs
      },
       colorSelect(vueObj) {
        var that = this
        WF.SelectorDialog.selectColor(that, 'color', vueObj)
      }
    }
  }

  function searchfield() {
    var searchKey = $('#searchKey').val()
    if (searchKey != '') {
      var list = $('#onlineFormFileList')
      $('li', list).hide()
      $("div[title*='" + searchKey + "']", list).each(function(index, item) {
        $(item).parent().show()
        $(item).parent().parent().show()
        $(item).parent().parent().parent().show()
      })
    }
  }
</script>
<style lang="scss" scoped>
  @import "~@/resources/css/reportdisginer.css";
</style>
