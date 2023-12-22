<template>
  <div v-show="!isPropertyCollapsed" style="padding-right: 5px;font-size: 12px;padding-top: 10px;padding-left:5px; " class="overy auto-window-height formDesigner-rigth-property">
    <!--行属性设置-->
    <el-form label-position="left" v-if="activeProperty.type=='row'" ref="rowFormRef" class="miniform" label-suffix="：" size="mini" label-width="90px">
      <div class="property-group-title">
        <span>行属性</span>
      </div>
      <el-form-item label="行序号">
        {{ activeProperty.orderNum }}
      </el-form-item>
      <el-form-item label="行标题">
        <el-input v-model="activeProperty.label" />
      </el-form-item>
      <el-form-item label="国际化英文">
        <el-input v-model="activeProperty.alias" />
      </el-form-item>
      <el-form-item label="显示标题">
        <el-switch v-model="activeProperty.showLabel" active-color="#87DC48" inactive-color="#DEDEDE" />
      </el-form-item>
      <el-form-item label="显示前缀蓝标">
        <el-switch v-model="activeProperty.showPrefixBar" active-color="#87DC48" inactive-color="#DEDEDE" />
      </el-form-item>
      <el-form-item label="是否间隔空隙">
        <el-switch v-model="activeProperty.showPrefixSpaced" active-color="#87DC48" inactive-color="#DEDEDE" />
      </el-form-item>
      <el-form-item label="标题样式">
        <span class="cur icon icon-xitongpeizhi1 blue font12" title="编辑为Style样式内容，如：border: 1px solid #DDDDDD;" @click="onStyleClick(activeProperty,'sectionStyle')"> 标题样式</span>
      </el-form-item>
      <el-form-item label="默认折叠">
        <el-radio-group v-model="activeProperty.collapse">
          <el-radio-button :label="true">收缩</el-radio-button>
          <el-radio-button :label="false">展开</el-radio-button>
          <el-radio-button :label="0">无</el-radio-button>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="栅格间隔">
        <el-input-number v-model="activeProperty.gutter" />
      </el-form-item>
      <el-form-item label="行样式">
        <span class="cur fa fa-cog  font10" title="编辑为Style样式内容，如：border: 1px solid #DDDDDD;" @click="onStyleClick(activeProperty)">设置行样式</span>
      </el-form-item>
      <div class="property-group-title">
        <span>列配置</span>
        <el-tooltip style="margin-left:5px" class="item" effect="dark" content="一行被切分为24分栏，通过列配置可以将一行划分为多列，每一列指定包含几个分栏。" placement="bottom">
          <i class="fa  fa-question-circle-o" style="margin-left: 15px;"></i>
        </el-tooltip>
      </div>
      <el-form-item label-width="0">
        <div v-for="(col, col_index) in activeProperty.children">
          <i class="fa fa-trash  cur" title="删除列" @click="onDeleteChildOfObject(activeProperty, col.id)" />
          <span class="cur font12 mr2"> 第{{ col_index+1 }}列 </span>
          <el-input-number v-model="col.span" size="mini" :min="0" />
          <span class="cur font12 blue" title="编辑为Style样式内容，如：border: 1px solid #DDDDDD;" @click="onStyleClick(col)"> 样式</span>
        </div>
        <el-tooltip class="item" effect="dark" content="一行最多被切分为24分栏，每一列指定包含几个分栏，所有列的栏数合计不超过24,否则将导航布局异样" placement="bottom">
          <i class="fa  fa-plus cur font12" @click="onAddColByRow(activeProperty)"> 添加列</i>
        </el-tooltip>
      </el-form-item>
      <el-form-item label="ID">
        <el-input v-model="activeProperty.id" :disabled="true" />
      </el-form-item>
    </el-form>
    <!--字段属性设置-->
    <el-form label-position="left" v-else-if="activeProperty.type=='field'||activeProperty.type=='textbox'" ref="fieldFormRef" class="miniform" label-suffix="：" size="mini" label-width="80px">
      <div class="property-group-title">
        <span>基础属性</span>
      </div>
      <el-form-item label="控件标题">
        <el-input v-model="activeProperty.label" />
      </el-form-item>
      <el-form-item label="国际化英文">
        <el-input v-model="activeProperty.alias" />
      </el-form-item>
      <el-form-item label="标签后缀">
        <el-input v-model="activeProperty.labelSuffix" placeholder="比如冒号“：”" />
      </el-form-item>

      <el-form-item label="显示标题">
        <el-switch v-model="activeProperty.showLabel" active-color="#87DC48" inactive-color="#DEDEDE" />
      </el-form-item>

      <el-form-item label="标题样式">
        <span class="cur icon icon-xitongpeizhi1 blue font12" title="编辑为style样式内容，如：border: 1px solid #DDDDDD;" @click="onStyleClick(activeProperty)"> 设置样式</span>
      </el-form-item>
      <el-form-item v-if="activeProperty.ctrType!='extend_label'" label="标题宽度">
        <el-input v-model="activeProperty.labelWidth" size="mini" placeholder="标题宽度,设置为0将去除空白占位；例如80px" />
      </el-form-item>
      <el-form-item label-width="0" v-if="activeProperty.ctrType=='extend_textbox'">
        <span class="font12 mr20">显示格式：</span>
        <el-radio-group v-model="activeProperty.showFormat">
          <el-radio-button label="qianfenwei">千分位</el-radio-button>
          <el-radio-button label="daxiejine">大写金额</el-radio-button>
          <el-radio-button label="">无</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label-width="0">
        <span class="bolder font12">输入提示：</span>
        <br>
        <el-input v-model="activeProperty.fieldRemark" type="textarea" :rows="4" placeholder="如本底纹提示" />
      </el-form-item>
      <div class="property-group-title">
        <span>其它属性</span>
      </div>
      <el-form-item label="序号" label-width="60px">
        {{ activeProperty.orderNum }}
      </el-form-item>
      <el-form-item label="ID" label-width="60px">
        <el-input v-model="activeProperty.id" :disabled="true" size="mini" />
      </el-form-item>
      <el-form-item v-if="activeProperty.ctrType.indexOf('extend_')==-1" label="绑定字段" label-width="60px">
        <el-input v-model="activeProperty.vModel" size="mini" />
        <el-tooltip class="item" effect="dark" content="“绑定字段名”通常不能做修改，非特殊情况下请务修改，以免影响正常使用" placement="bottom-end">
           <span class="fa fa-question-circle-o font10" >说明</span>
        </el-tooltip>
      </el-form-item>
    </el-form>
    <!--tabs控件属性设置-->
    <el-form ref="fieldFormRef" v-else-if="activeProperty.type=='tabs'" class="miniform" label-position="left" label-suffix="：" size="mini" label-width="90px">
      <div class="property-group-title">
        <span>基础属性</span>
      </div>
      <el-form-item label="控件标题">
        <span slot="label" class="bolder"> 控件标题：</span>
        {{ activeProperty.label }}
      </el-form-item>
      <div class="property-group-title">
        <span>风格类型</span>
      </div>
      <el-form-item label="" label-width="0px">
        <el-radio-group v-model="activeProperty.tabType">
          <el-radio-button label="">默认</el-radio-button>
          <el-radio-button label="card">选项卡</el-radio-button>
          <el-radio-button label="border-card">卡片化</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <div class="property-group-title">
        <span>Tab点击事件</span>
      </div>
      <el-form-item label="" label-width="0px">
        <el-input v-model="activeProperty.tabsClick" placeholder="事件的函数名，参数传递：label,tab,field" />
      </el-form-item>

      <div class="property-group-title">
        <span>选项卡位置</span>
      </div>
      <el-form-item label="" label-width="0px">
        <el-radio-group v-model="activeProperty.tabPosition">
          <el-radio-button label="top">顶部</el-radio-button>
          <el-radio-button label="left">左侧</el-radio-button>
          <el-radio-button label="right">右侧</el-radio-button>
          <el-radio-button label="bottom">底部</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <div class="property-group-title">
        <span>选项卡配置项</span>
      </div>
      <el-form-item label-width="0" style="padding-left:5px;font-size: 12px;">
        <div v-for="(child, c_index) in activeProperty.children" style="margin-bottom: 3px;margin-left: 10px;">
          <span class="mr5">第{{ c_index+1 }}项</span>
          <el-input v-model="child.label" placeholder="输入选项卡标题" style="width:100px;" />
          <el-input v-model="child.alias" placeholder="国际化英文" style="width:80px;margin-left: 2px;" />
          <i class="fa fa-trash  cur" title="删除" @click="onDeleteChildOfObject(activeProperty, child.id)" />
        </div>
        <i class="fa  fa-plus cur font12 blue" @click="onAddChildOfObject(activeProperty,'tabpane')"> 添加选项卡</i>
      </el-form-item>
      <div class="property-group-title">
        <span>其他属性</span>
      </div>
      <el-form-item>
        <span slot="label"> 默认标签：</span>
        <el-input v-model="activeProperty.tabSelected" />
      </el-form-item>
      <el-form-item label="序号">
        <span slot="label" class="bolder"> 序号：</span>
        {{ activeProperty.orderNum }}
      </el-form-item>
      <el-form-item label="ID">
        <span slot="label" class="bolder"> ID：</span>
        <el-input v-model="activeProperty.id" :disabled="true" size="mini" />
      </el-form-item>

    </el-form>

    <!-- 表格容器属性设置-->
    <el-form v-else-if="activeProperty.type=='table'" style="font-size: 12px;" ref="fieldFormRef" class="miniform" label-position="left" label-suffix="：" size="mini" label-width="60px">
      <div class="property-group-title">
        <span>基础属性</span>
      </div>
      <el-form-item label="表格标题">
        <el-input v-model="activeProperty.label" />
      </el-form-item>
      <el-form-item label="显示标题">
        <el-switch v-model="activeProperty.showLabel" active-color="#87DC48" inactive-color="#DEDEDE" />
      </el-form-item>

      <el-form-item label="标题样式">
        <span class="cur icon icon-xitongpeizhi1 blue font12" title="编辑为Style样式内容，如：border: 1px solid #DDDDDD;" @click="onStyleClick(activeProperty,'sectionStyle')">标题样式</span>
      </el-form-item>
      <el-form-item label="表格宽度">
        <el-input v-model="activeProperty.tableWidth" style="width: 150px;" placeholder="填写px或%" size="mini" />
      </el-form-item>
      <el-form-item label="表格行高">
        <el-input-number v-model="activeProperty.rowHeight" style="width:100px;" size="mini" :min="30" /> px
      </el-form-item>
      <el-form-item label="表格样式">
        <span class="cur fa fa-edit font10 blue" title="编辑为Style样式内容" @click="onStyleClick(activeProperty,'style')">表格样式</span>
      </el-form-item>
      <el-form-item label="单元格边框">
        <span class="cur fa fa-edit font10 blue" title="编辑为Style样式内容" @click="onStyleClick(activeProperty,'cellStyle')">边框样式</span>
      </el-form-item>
      <div class="property-group-title">
        <span>行配置</span>
        <el-tooltip class="item ml5" effect="dark" content="行配置：在表格的下面插入一行，通过调整序号可调整行的位置" placement="bottom">
          <i class="fa  fa-question-circle-o" style="margin-left: 15px;"></i>
        </el-tooltip>
      </div>
      <el-form-item label-width="0">
        <div v-for="(row, row_index) in activeProperty.children" style="margin-bottom: 3px; ">
          <i class="fa fa-trash  cur" title="删除行" @click="onExtendTableDeleteRow(activeProperty, row.id)" />
          <span class="cur font12">第{{ row_index+1 }}行</span>
          <el-input-number style="width:100px;" v-model="row.orderNum" size="mini" :min="0" />
          <span class="cur   font10" title="编辑为Style样式内容" @click="onStyleClick(row,'style')"> 行样式</span>
        </div>
        <el-tooltip style="margin-left: 0px" class="item" effect="dark" content="向表格中插入一行" placement="bottom">
          <i class="fa  fa-plus cur font12 blue" @click="onExtendTableAddRow(activeProperty)"> 插入表格行</i>
        </el-tooltip>
        <el-tooltip style="margin-left: 0px" class="item" effect="dark" content="按指定的序号调整行的位置" placement="bottom">
          <i class="fa  fa-refresh cur font12 blue ml10" @click="sortExtendTableRow(activeProperty)"> 按序号重置行位置</i>
        </el-tooltip>
        <el-divider></el-divider>
        <div style="font-size: 10px;margin-top: 10px;">
          <span>插入列到 </span>
          <el-input-number style="width:100px;" v-model="appendColAt" size="mini" :min="1" /> 列后
          <br>
          <el-tooltip class="item" effect="dark" content="向表格中在指定列后面插入一列" placement="bottom">
            <i class="fa  fa-plus cur font12 blue" @click="onAddExtendTableTd(activeProperty,appendColAt)"> 插入表格列（当前共{{activeProperty.children[0].children.length}}列）</i>
          </el-tooltip>
        </div>
        <el-divider></el-divider>
        <div style="font-size: 10px;margin-top: 10px;">
          <span> 删除第 </span>
          <el-input-number style="width:100px;" v-model="deleteColAt" size="mini" :min="1" /> 列
          <br>
          <el-tooltip class="item" effect="dark" content="删除指定列" placement="bottom">
            <i class="fa  fa-minus-circle cur font12 blue" @click="onDeleteExtendTableTd(activeProperty,deleteColAt)"> 删除表格列</i>
          </el-tooltip>
        </div>
      </el-form-item>
      <el-divider></el-divider>
      <div class="property-group-title">
        <span>列宽配置</span>
        <el-tooltip class="item ml5" effect="dark" content="列宽配置:宽度单位可以是px相素，也可以是百分比%，不填写则表示自适应" placement="bottom">
          <i class="fa  fa-question-circle-o" style="margin-left: 15px;"> </i>
        </el-tooltip>
      </div>
      <el-form-item label-width="0" style="font-size: 12px;">
        <div v-for="item in activeProperty.colWidths">
          <i class="fa fa-trash  cur" title="删除行" @click="onDeleteExtendTableTdWidth(activeProperty,item)" /><span class="font10"> 第 </span>
          <el-input v-model="item.colnum" style="width: 60px;" placeholder="列数" size="mini"></el-input> <span class="font10"> 列宽 </span>
          <el-input v-model="item.width" style="width: 140px;" placeholder="填写如15px或15%" size="mini"></el-input>
        </div>
        <el-tooltip class="item" effect="dark" content="添加一个列宽配置项" placement="bottom">
          <i class="fa  fa-plus cur font12 blue" @click="onAddExtendTableTdWidth(activeProperty)"> 添加列宽项</i>
        </el-tooltip>
        <el-tooltip class="item" effect="dark" content="添加所有剩下列的配置项" placement="bottom">
          <i class="fa  fa-plus cur font12 blue ml10" @click="onAddExtendTableTdWidth(activeProperty,'auto')"> 自动加满列宽配置项</i>
        </el-tooltip>
      </el-form-item>

      <el-form-item label="序号">
        <span slot="label" class="bolder"> 序号：</span>
        {{ activeProperty.orderNum }}
      </el-form-item>
      <el-form-item label="ID">
        <span slot="label" class="bolder"> ID：</span>
        <el-input v-model="activeProperty.id" :disabled="true" size="mini" />
      </el-form-item>
    </el-form>

    <!--扩展控件属性设置-->
    <el-form v-else-if="activeProperty.ctrType&&((activeProperty.ctrType.indexOf('extend_')>-1&&activeProperty.type!='table'&&activeProperty.type!='tabs'&&activeProperty.type!='field')||activeProperty.ctrType=='subtable')" ref="fieldFormRef" style="font-size: 12px;padding-left: 3px;" class="miniform" label-position="top" label-suffix="：" size="mini" label-width="80px">
      <div class="property-group-title">
        <span>{{ activeProperty.label }}属性</span>
      </div>
      <el-form-item label="控件标题">
        <el-input v-model="activeProperty.label" />
      </el-form-item>
      <!--子表-->
      <el-form-item label="子表必填行数" v-if="activeProperty.ctrType=='subtable'">
        <el-input-number v-model="activeProperty.requiredNumOfRows" :min="0" :max="100" label="子表必填行数"></el-input-number>
      </el-form-item>
      <!--extend_label-->
      <el-form-item v-if="activeProperty.ctrType=='extend_label'" label-width="0">
        <span>文字内容：</span>
        <div>
          <el-input v-model="activeProperty.content" type="textarea" :rows="4" placeholder="文字内容" />
        </div>
        <el-form-item label="国际化英文内容">
          <el-input v-model="activeProperty.alias" type="textarea" :rows="4" />
        </el-form-item>
        <el-row>
          <el-col :span="5" class="font10">样式</el-col>
          <el-col :span="8">
            <span class="cur fa fa-edit font10" title="编辑为Style样式内容" @click="onStyleClick(activeProperty,'style')">样式设置</span>
          </el-col>
        </el-row>
      </el-form-item>
      <!--分割线-->
      <el-form-item v-if="activeProperty.ctrType=='extend_divider'" label-width="0">
        <span>文字内容：</span>
        <div>
          <el-input v-model="activeProperty.content" type="textarea" :rows="4" placeholder="文字内容" />
        </div>
        <el-form-item label="国际化英文内容">
          <el-input v-model="activeProperty.alias" type="textarea" :rows="4" />
        </el-form-item>
        <el-form-item label="文案的位置">
          <el-radio-group v-model="activeProperty.contentPosition">
            <el-radio-button label="left">左侧</el-radio-button>
            <el-radio-button label="center">居中</el-radio-button>
            <el-radio-button label="right">右侧</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="分割线方向">
          <el-radio-group v-model="activeProperty.direction">
            <el-radio-button label="horizontal">水平</el-radio-button>
            <el-radio-button label="vertical">垂直</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-row>
          <el-col :span="5" class="font10">图标</el-col>
          <el-col :span="8">
            <span class="cur" title="选择图标" @click="selectAweIcon(activeProperty,'icon')"><i class="fa fa-search font10 ml4" />选择图标</span>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6" class="font10">字体样式</el-col>
          <el-col :span="18"> <span class="cur fa fa-edit font10" title="编辑为Style样式内容" @click="onStyleClick(activeProperty,'style')">样式设置</span></el-col>
        </el-row>
      </el-form-item>
      <!--自定义Html代码块-->
      <el-form-item v-if="activeProperty.ctrType=='extend_custhtml'" label-width="0">
        <span>Html内容：</span>
        <br>
        <el-input v-model="activeProperty.content" type="textarea" :rows="4" placeholder="Html内容" />
        <el-row>
          <el-col :span="5" class="font10">样式</el-col>
          <el-col :span="8">
            <span class="cur fa fa-edit font10" title="编辑为Style样式内容" @click="onStyleClick(activeProperty,'style')">样式设置</span>
          </el-col>
        </el-row>
      </el-form-item>

      <!--extend_tabtoolbar-->
      <el-form-item v-if="activeProperty.ctrType=='extend_tabtoolbar'" label-width="0" style="padding-left:5px">
        <div class="property-group-title">
          <span>配置项：</span>
        </div>
        <div v-for="(child, c_index) in activeProperty.children" style="margin-bottom: 3px;margin-left: 10px;font-size: 12px;">
          <span class="mr2">第{{ c_index+1 }}个</span>
          <el-input v-model="child.label" style="width: 130px;" />
          <span class="cur" title="编辑为Style样式内容，如：border: 1px solid #DDDDDD;" @click="onStyleClick(child)">样式</span>
          <i class="fa fa-trash  cur" title="删除" @click="onDeleteChildOfObject(activeProperty, child.id)" />
        </div>
        <el-tooltip class="item" effect="dark" content="" placement="bottom">
          <i class="fa  fa-plus cur blue font12 ml5" @click="onAddChildOfObject(activeProperty,'tabbtn')"> 添加按钮</i>
        </el-tooltip>
      </el-form-item>
      <!--extend_picture-->
      <el-form-item v-if="activeProperty.ctrType=='extend_picture'" label="" label-width="0px">
        <el-form-item label="显示标题">
          <el-switch v-model="activeProperty.showLabel" active-color="#87DC48" inactive-color="#DEDEDE" />
        </el-form-item>
        <el-form-item label="标签后缀">
          <el-input v-model="activeProperty.labelSuffix" placeholder="比如冒号“：”" />
        </el-form-item>
        <el-form-item label="标题宽度">

          <el-input v-model="activeProperty.labelWidth" size="mini" placeholder="标题宽度,设置为0将去除空白占位；例如80px" />
        </el-form-item>
        <el-form-item label="图片宽度">
          <el-input-number v-model="activeProperty.imgWidth" size="small" style="width:120px" :min="30" :max="1000" label="图片显示宽度，例如80" />px
        </el-form-item>
        <el-form-item label="图片高度，填写0为自适应">
          <el-input-number v-model="activeProperty.imgHeight" size="small" style="width:120px" :min="0" :max="1000" label="图片显示高度，例如80，可不填，根据宽度同比例绽放" />px
        </el-form-item>
      </el-form-item>
      <!--extend_file-->
      <el-form-item v-if="activeProperty.ctrType=='extend_file'" label="" label-width="0px">
        <el-form-item label="显示标题">
          <el-switch v-model="activeProperty.showLabel" active-color="#87DC48" inactive-color="#DEDEDE" />
        </el-form-item>
        <el-form-item label="标签后缀">
          <el-input v-model="activeProperty.labelSuffix" placeholder="比如冒号“：”" />
        </el-form-item>
        <el-form-item label="标题宽度">
          <el-input v-model="activeProperty.labelWidth" size="mini" placeholder="标题宽度,设置为0将去除空白占位；例如80px" />
        </el-form-item>
      </el-form-item>


      <!--extend_button-->
      <el-form-item v-if="activeProperty.ctrType=='extend_button'" label="" label-width="0px">
        <el-form-item label="显示标题">
          <el-switch v-model="activeProperty.showLabel" active-color="#87DC48" inactive-color="#DEDEDE" />
        </el-form-item>
        <el-form-item v-if="activeProperty.ctrType!='extend_label'" label="标题宽度">
          <el-input v-model="activeProperty.labelWidth" size="mini" placeholder="标题宽度,设置为0将去除空白占位；例如80px" />
        </el-form-item>
        <el-row>
          <el-col :span="8">图标：<span :class="activeProperty.icon.indexOf('fa')>-1?'fa '+activeProperty.icon:'icon '+activeProperty.icon"></span> </el-col>
          <el-col :span="8">
            <span class="cur" title="选择图标" @click="selectAweIcon(activeProperty,'icon')"><i class="fa fa-search font10 ml4" />选择图标</span>
          </el-col>
        </el-row>
        <span style="font-weight:bold">风格类型：</span>
        <br>
        <el-radio-group v-model="activeProperty.btnStyle">
          <el-radio-button label="">默认</el-radio-button>
          <el-radio-button label="plain">素按钮</el-radio-button>
          <el-radio-button label="round">圆角按钮</el-radio-button>
        </el-radio-group>
      </el-form-item>


      <el-form-item v-if="activeProperty.ctrType=='extend_button'" label="按钮大小">
        <el-select v-model="activeProperty.size">
          <el-option label="默认" value="" />
          <el-option label="中等按钮" value="medium" />
          <el-option label="小型按钮" value="small" />
          <el-option label="超小按钮" value="mini" />
        </el-select>
      </el-form-item>
      <el-form-item v-if="activeProperty.ctrType=='extend_button'" label="按钮风格">
        <el-select v-model="activeProperty.btnType">
          <el-option label="主要按钮" value="primary" />
          <el-option label="成功按钮" value="success" />
          <el-option label="信息按钮" value="info" />
          <el-option label="警告按钮" value="warning" />
          <el-option label="危险按钮" value="danger" />
        </el-select>
      </el-form-item>
      <el-form-item v-if="activeProperty.ctrType=='extend_button'||activeProperty.ctrType=='extend_tabtoolbar'" label="按钮事件">
        <el-input v-model="activeProperty.clickEventName" placeholder="请填写按钮的JS事件函数名" />
      </el-form-item>
      <!--extend_iframe-->
      <el-form-item v-if="activeProperty.ctrType=='extend_iframe'" label="iframe地址">
        <el-input v-model="activeProperty.src" placeholder="iframe的src" />
        <div class="mt10">
          <span class="font12 bolder ">高度 </span>
          <el-input-number v-model="activeProperty.height" size="mini" :min="0" label="高度" />
        </div>
        <div class="mt10">
          <span class="font12 bolder ">携带表单字段参数</span>
          <el-input v-model="activeProperty.formFieldParms" placeholder="填写表单字段全名,多个之间使用英文逗号隔开" />
        </div>
      </el-form-item>
      <!--extend_container-->
      <el-form-item v-if="activeProperty.ctrType=='extend_container'" label-width="0" style="padding-left:5px;font-size: 12px;">
        <span class="font12 bolder">配置项：</span>
        <div v-for="(child, c_index) in activeProperty.children" style="margin-bottom: 3px;margin-left: 10px;">
          <span class="font12"> 第{{ c_index+1 }}栏 </span>
          <el-select v-model="child.tag" style="width: 130px">
            <el-option label="aside侧边区" value="aside" />
            <el-option label="main主内容区" value="main" />
            <el-option label="header头部区" value="header" />
          </el-select>
          <span class="cur blue ml2 font12" title="编辑为Style样式内容，如：border: 1px solid #DDDDDD;" @click="onStyleClick(child)">样式</span>
          <i class="fa fa-trash  cur ml5 blue" title="删除" @click="onDeleteChildOfObject(activeProperty, child.id)" />
        </div>
        <i class="fa  fa-plus cur blue ml5 font12" @click="onAddChildOfObject(activeProperty,'containerPane')"> 添加分栏</i>
      </el-form-item>
      <!--字段绑定名称-->
      <el-form-item v-if="activeProperty.ctrType=='extend_button'||activeProperty.ctrType=='extend_tabtoolbar'" label="字段名称">
        <span slot="label" class="bolder">字段名称：</span>
        <el-input v-model="activeProperty.vModel" placeholder="英文名称" />
      </el-form-item>
      <el-form-item v-else-if="activeProperty.ctrType=='extend_picture'||activeProperty.ctrType=='extend_file'||activeProperty.ctrType=='extend_textbox' " label="字段名称">
        <span slot="label" class="bolder">字段名称：</span>
        <el-input v-model="activeProperty.vModel" :disabled="true" placeholder="英文名称" />
      </el-form-item>
      <!--权限设置-->
      <!--       <el-form-item v-if="activeProperty.ctrType=='extend_button'||activeProperty.ctrType=='extend_tabtoolbar'" label="字段权限">
        <span slot="label" class="bolder">权限设置：</span>
        <a class="btn btn-minier btn-purple mr2" title="字段权限设置" @click="editFieldPermission"><i class="fa fa-gears bigger-120" />权限配置</a>
      </el-form-item> -->


      <el-row class="mt10">
        <el-col :span="3">序号</el-col>
        <el-col :span="12">{{ activeProperty.orderNum }}</el-col>
      </el-row>
      <el-row class="mt10 lh30">
        <el-col :span="3">ID</el-col>
        <el-col :span="11">
          <el-input v-model="activeProperty.id" :disabled="true" size="mini" />
        </el-col>
        <el-col :span="6">
          <span v-if="false" class="fa fa-cog cur font12" style="line-height: 20px;" title="分配权限后勿再次修改" @click="generateId(activeProperty.ctrType,'field')"> 生成唯一值 </span>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
  export default {
    name: "leftPanel",
    components: {
    },
    props: {
      designer: Object,
      deviceType: String,
      formKey: String,
      activeProperty: Object
    },
    data() {
      return {
        appendColAt: 1,
        deleteColAt: 0,
        isPropertyCollapsed: false,
        searchKey: "",
        firstTab: 'componentLib',
        scrollerHeight: 0,
        activeNames: ['1', '4']
      };

    },
    watch: {
      activeProperty: {
        handler(newVal, oldVal) {
          if (newVal != this.value && newVal != oldVal && oldVal != undefined) {
            if (newVal.ctrType == "extend_table") {
              this.appendColAt = newVal.children[0].children.length;
              this.deleteColAt = newVal.children[0].children.length;
            }
          }
        },
        deep: true,
        immediate: false
      }
    }
    , computed: {
      rotatePropertyIcon() {
        return this.isPropertyCollapsed ? 'fa fa-angle-double-left' : 'fa fa-angle-double-right';
      }
    },
    mounted() {
      var that = this;

      this.scrollerHeight = window.innerHeight - 56 + 'px';
      $(window).resize(function () {
        that.$nextTick(() => {
          that.scrollerHeight = window.innerHeight - 56 + 'px';
        });
      });
    },
    methods: {
      collapsedSider() {
        this.isCollapsed = !this.isCollapsed;
      },
      searchfield() {
        var that = this;
        var searchKey = that.searchKey;
        if (searchKey != '') {
          var list = $('#onlineFormFileList');
          $('li', list).hide();
          $("div[title*='" + searchKey + "']", list).each(function (index, item) {
            $(item).parent().show();
            $(item).parent().parent().show();
            $(item).parent().parent().parent().show();
          });
        }
      },
      searchReSet() {
        var that = this;
        that.searchKey = "";
        var list = $('#onlineFormFileList');
        $('li', list).show();
      },
      showFormTemplates() {
        return true;
      },
      onStyleClick(vueObj, propName) {
        propName = propName || 'style';
        var that = this;
        WF.SelectorDialog.selectStyle(that, propName, vueObj);
      },
      selectAweIcon(vueObj, propName) {
        var that = this;
        WF.SelectorDialog.selectAweIcon(that, propName, null, null, vueObj);
      },
      onDeleteChildOfObject(obj, id) {
        var that = this;
        var childs = obj.children.filter(a => a.id != id);
        obj.children = childs;
      },
      onAddColByRow(row) {
        var that = this;
        var cols = row.children;
        var spanValue = 4;
        cols.push({ type: 'col', id: Object.toGuid(), label: '', span: spanValue, style: '', children: [] });
      },
      onExtendTableAddRow(table) {
        var that = this;
        var rows = table.children;
        var tr = Object.toDeepClone(table.children[0]);
        tr.style = "";
        tr.id = 'tr_' + Object.toGuid(false);
        tr.orderNum = table.children[table.children.length - 1].orderNum + 1;
        $.each(tr.children, function (i, td) {
          var td_RowColTemplate = Object.toDeepClone(table_td_RowColTemplate);
          td_RowColTemplate.id = + "row_" + Object.toGuid(false);
          td_RowColTemplate.children[0].id = "col_" + Object.toGuid(false);
          td.children = [];
          td.children.push(td_RowColTemplate);
          td.id = 'td_' + Object.toGuid(false);
        });
        rows.push(tr);
      },
      onAddExtendTableTd(table, appendColAt) {
        var that = this;
        var trs = table.children;
        var tds = trs[0].children;
        if (tds.length < (appendColAt - 1)) {
          FUI.Window.showMsg2(that, "输入的列号不存在");
          return false;
        }
        var orderNum = tds[appendColAt - 1].orderNum;
        $.each(trs, function (i, tr) {
          var td = Object.toDeepClone(table_template.children[0].children[0]);
          td.id = 'td_' + Object.toGuid(false);
          td.orderNum = orderNum + 0.5;
          var td_RowColTemplate = Object.toDeepClone(table_td_RowColTemplate);
          td_RowColTemplate.id = + "row_" + Object.toGuid(false);
          td_RowColTemplate.children[0].id = "col_" + Object.toGuid(false);
          td.children.push(td_RowColTemplate);

          tr.children.push(td);
          Object.dataSort(tr.children, 'orderNum', false, true, 1);
        });
        that.onAddExtendTableTdWidth(table, true);
        that.appendColAt = tds.length;
        that.deleteColAt = tds.length;
      },
      onAddExtendTableTdWidth(table, isAutoAppendAll) {
        var that = this;
        var n = table.children[0].children.length;
        var haveN = table.colWidths.length;
        if (haveN >= n) {
          return false;
        }
        if (isAutoAppendAll) {
          var subN = n - haveN;
          for (var i = 0; i < subN; i++) {
            table.colWidths.push({ colnum: 10, width: "100px" });
          }
        } else {
          table.colWidths.push({ colnum: 10, width: "100px" });
        }
        Object.dataSort(table.colWidths, 'colnum', false, true, 1);
      },
      onDeleteExtendTableTdWidth(table, colWidthItem) {
        var that = this;
        table.colWidths = table.colWidths.filter(a => a.colnum != colWidthItem.colnum);
      }
      , onDeleteExtendTableTd(table, deleteColAt) {
        var that = this;
        var rows = table.children;
        if (rows[0].children.length == 1) {
          FUI.Window.showMsg2(that, "已剩下最后一列不可删除。");
          return false;
        }
        var new_col = Object.toDeepClone(table_template.children[0].children[0]);
        $.each(rows, function (i, row) {
          var arr = [];
          $.each(row.children, function (j, c) {
            if ((j + 1) != deleteColAt) {
              arr.push(c);
            }
          });
          row.children = arr;
        });
        that.deleteColAt = rows[0].children.length;
        that.appendColAt = that.deleteColAt;

      },
      onExtendTableDeleteRow(table, rowId) {
        var that = this;
        var rows = table.children;
        if (rows[0].length == 1) {
          FUI.Window.showMsg2(that, "已剩下最后一行不可删除。");
          return false;
        }
        var childs = table.children.filter(a => a.id != rowId);
        table.children = childs;
      },
      sortExtendTableRow(table) {
        //重新排序
        var that = this;
        var rows = table.children;
        Object.dataSort(rows, 'orderNum', false, true, 1);
      }
      , onAddChildOfObject(obj, type) {
        var that = this;
        var childs = obj.children;
        var orderNum = childs.length + 1;
        if (type == 'tabpane') {
          var item = { type: 'tabpane', id: 'tabpane_' + Object.toGuid(false), ctrType: 'tabpane', label: '标签页' + orderNum, orderNum: orderNum, style: '', children: [] };
          childs.push(item);
        } else if (type == 'containerPane') {
          var item = Object.toClone(container_template.children[1]);
          item.id = 'containerPane_' + Object.toGuid(false);
          item.orderNum = orderNum;
          childs.push(item);
        } else if (type == 'tabbtn') {
          var item = Object.toClone(tabtoolbar_template.children[0]);
          item.id = 'tabbtn_' + Object.toGuid(false);
          item.orderNum = orderNum;
          childs.push(item);
        }
      },
      editFieldPermission() {
        var that = this;
        var fieldId = that.activeProperty.id;
        var title = that.activeProperty.label;
        var fieldName = that.activeProperty.vModel;
        if (fieldName == '') {
          FUI.Window.showMsg('“字段名称”不能为空');
          return false;
        }
        // 权限配置
        var rightAppIdData = Object.toAjaxJson(FUI.Handlers.SmartFormHandler, 'getRightIdAppIdByFormKey', { formKey: that.formKey });
        var url = '/workflow/smartForm/formFieldPermissionEdit/?appId=' + rightAppIdData.data.appId + '&rightId=' + rightAppIdData.data.rightId;
        var parms = {
          fieldIds: fieldId,
          fieldTitle: title,
          type: 'extend',
          actionName: fieldName
        };
        FUI.Window.openEdit(url, '设置【' + title + '】的删除行权限', FUI.FormAction.Edit, null, 880, 580, null, null, fieldId, false, null, parms);


      },
      generateId(ctrtype, id) {
        var that = this;
        var newId = 'form_item_' + Object.toGuid(false);
        if (id == 'field') {
          newId = ctrtype + '_' + Object.toGetTimeRandomNum();
        }
        that.activeProperty.id = newId;
      },
    }

  }
</script>

<style lang="scss" scoped>
  @import "/static/f2bpmUI/onlineForm/onlinedisginer.css";

  .formDesigner-rigth-property .el-form-item__content {
    font-size: 12px !important;
  }

  .formDesigner-rigth-property .property-group-title {
    font-size: 12px;
    font-weight: bold;
    color: #303133;
    font-family: Microsoft YaHei;
    padding: 7px 0px;
  }

  .formDesigner-rigth-property .el-divider--horizontal {
    margin: 10px 0;
  }

  .formDesigner-rigth-property {
    font-size: 12px !important;
  }

  .formDesigner-rigth-property .el-form-item__label {
    font-size: 12px;
    font-family: PingFang SC;
  }

  .side-scroll-bar {
    ::v-deep .el-scrollbar__wrap {
      overflow-x: hidden;
    }
  }

  div.panel-container {
    padding-bottom: 10px;
  }

  .no-bottom-margin ::v-deep .el-tabs__header {
    margin-bottom: 0;
  }

  .indent-left-margin {
    ::v-deep .el-tabs__nav {
      margin-left: 20px;
    }
  }

  .el-collapse-item ::v-deep ul>li {
    list-style: none;
  }

  .widget-collapse {
    border-top-width: 0;

    ::v-deep .el-collapse-item__header {
      margin-left: 8px;
      font-weight: bold;
    }

    ::v-deep .el-collapse-item__content {
      padding-bottom: 6px;

      ul {
        padding-left: 10px;
        margin: 0;
        margin-block-start: 0;
        margin-block-end: 0.25em;
        padding-inline-start: 10px;

        &:after {
          content: "";
          display: block;
          clear: both;
        }

        .container-widget-item,
        .field-widget-item {
          display: inline-block;
          height: 28px;
          line-height: 28px;
          width: 115px;
          float: left;
          margin: 2px 6px 6px 0;
          cursor: move;
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
          background: #f1f2f3;
        }

        .container-widget-item:hover,
        .field-widget-item:hover {
          background: #EBEEF5;
          outline: 1px solid;
        }

        .drag-handler {
          position: absolute;
          top: 0;
          left: 160px;
          background-color: #dddddd;
          border-radius: 5px;
          padding-right: 5px;
          font-size: 11px;
          color: #666666;
        }
      }
    }
  }

  .el-card.ft-card {
    border: 1px solid #8896B3;
  }

  .ft-card {
    margin-bottom: 10px;

    .bottom {
      margin-top: 10px;
      line-height: 12px;
    }

    /*
    .image-zoom {
      height: 500px;
      width: 620px
    }
    */

    .ft-title {
      font-size: 13px;
      font-weight: bold;
    }

    .right-button {
      padding: 0;
      float: right;
    }

    .clear-fix:before,
    .clear-fix:after {
      display: table;
      content: "";
    }

    .clear-fix:after {
      clear: both;
    }

  }
</style>