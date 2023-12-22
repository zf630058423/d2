<template>
  <div class="f2bpm-page-dialog-layout auto-window-height-select">
    <el-form ref="formRef" :rules="formRules" :model="data" size="mini" class="f2bpm-editform" label-width="120px">
      <div>
        <table class="common-FormTable" cellpadding="0" cellspacing="0">
          <tr>
            <td class="leftTdbg"><em>*</em> 控件标题：</td>
            <td>
              <el-input v-model="data.fieldTitle" class="textBoxShort" size="mini" />
            </td>
            <td class="leftTdbg">国际化英文</td>
            <td>
              <el-input v-model="data.fieldAlias" class="textBoxShort" size="mini" />
            </td>
          </tr>
          <tr>
            <td class="leftTdbg"> <em>*</em> 控件类型：</td>
            <td>
              <el-select v-model="data.inputCtrlType" size="mini" class="textBoxShort" filterable placeholder="请选择" @change="onInputCtrlTypeChange">
                <el-option v-for="item in ctrTypeArr" :key="item.value" :label="item.text" :value="item.value" />
              </el-select>
            </td>
            <td class="leftTdbg"><em>*</em> 排序：</td>
            <td>
              <el-input-number v-model="data.fieldOrderNo" size="mini" :min="1" :max="100000" label="排序" />
            </td>
          </tr>
          <tr id="optionTr">
            <td class="leftTdbg">数据源配置：</td>
            <td colspan="3" style="padding: 10px;">
              <el-radio-group v-model="datasourceData.type" style="width:70%" size="mini">
                <div id="optionDatasource" style="margin-bottom: 10px;">
                  <el-radio label="custom">自定义</el-radio>
                  <el-radio id="dicDatasource" label="dic">数据字典</el-radio>
                  <el-radio id="sqlDatasource" label="sql">SQL语句</el-radio>
                </div>
                <div>
                  <el-radio id="dataServiceDatasource" label="dataService">数据服务</el-radio>
                  <el-radio id="selectorDatasource" label="selector">自定义选择器</el-radio>
                  <el-radio id="customdialogDatasource" label="customdialog">自定义选择对话框</el-radio>
                </div>
              </el-radio-group>
              <a id="OptionEdit" role="button" class="btn btn-default btn-sm mr2" @click="editOption('inputCtrlOption')"><i class="icon icon-xitongpeizhi1" />配置数据</a>
            </td>
          </tr>
          <tr id="fieldLengthTr">
            <td class="leftTdbg">长度限制：</td>
            <td>
              <el-input-number v-model="data.fieldLength" size="mini" :min="0" />
            </td>
            <td class="leftTdbg">小数位<span class="fa fa-question-circle-o ml2" title="校验类型为须设置为“数字”才有效,直接配置-1表示不设置小数位约束。 没有小数的数字不做任何改变。"> </span>：</td>
            <td>
              <el-input-number v-model="data.fieldDecimalLen" size="mini" :min="-1" :max="16" />

            </td>
          </tr>
          <tr id="WidthTr">
            <td class="leftTdbg">宽度：</td>
            <td>
              <el-input-number v-model="data.width" size="mini" :min="0" /> px(默认0不限制)
            </td>
            <td class="leftTdbg">高度：</td>
            <td>
              <el-input-number v-model="data.height" size="mini" :min="0" /> px(默认0不限制)
            </td>
          </tr>
          <tr id="option_prefix_tr">
            <td class="leftTdbg">显示地址前缀：</td>
            <td colspan="3">
              <el-input v-model="stampData.showPathPrefix" size="mini" />
            </td>
          </tr>
          <tr id="hyperlink_tr">
            <td class="leftTdbg">配置参数：</td>
            <td colspan="3" style="padding-top: 3px;">
              <div class="p5">
                链接类别：
                <el-select v-model="hyperlinkData.linktype" size="mini" class="textBoxShort">
                  <el-option value="wfsheet" label="流程工单链接" />
                  <el-option value="outside" label="外部链接" />
                  <el-option value="inside" label="内部链接" />
                  <el-option value="customJS" label="调用自定义JS" />
                </el-select>
                打开模式：
                <el-select v-model="hyperlinkData.opentype" size="mini" class="textBoxShort">
                  <el-option label="弹出内部窗口" value="dialog" />
                  <el-option label="打开新窗口" value="openwin" />
                </el-select>
                <el-tooltip class="item ml5" effect="dark" content="链接地址：打开Url会自动加上参数：keyId=输入框的值。外部地址使用‘http://’开头，内部地址使用‘/’开头。工单链接可不填写链接地址。调用自定义JS:填写JS函数名" placement="right">
                  <span> <i class="fa fa-question-circle-o"></i>说明</span>
                </el-tooltip>
              </div>
              <el-input size="mini" v-if="hyperlinkData.linktype!=''&&hyperlinkData.linktype!='wfsheet'" v-model="hyperlinkData.hyperlinkUrl" placeholder="打开Url会自动加上参数：passval=输入框的值。 外部地址使用http:开头。 调用自定义JS则填写JS函数名。" />
            </td>
          </tr>
          <tr v-if="data.inputCtrlType=='qrcode'">
            <td class="leftTdbg">二维码配置参数：</td>
            <td colspan="3" style="padding-top: 3px; padding-bottom:5px;">
              <div class="p5">
                码类别：
                <el-select v-model="qrcodeData.qrtype" size="mini" class="textBoxShort">
                  <el-option label="二维码" value="qrcode" />
                  <el-option label="条形码" value="barcode" />
                </el-select>
                内容类型：
                <el-select v-model="qrcodeData.linktype" size="mini" class="textBoxShort">
                  <el-option value="string" label="字符串" />
                </el-select>
                <el-tooltip class="ml5" effect="dark" content="字符串内容中可使用表单字段占位符，如：你好这是[KongJian.wbk]的请假单或者http://xx.xx.xx/?=[KongJian.wbk]；如果本字段是数据库物理字段则字段的值会拼接在内容的最后面。" placement="right">
                  <span> <i class="fa fa-question-circle-o"></i>说明</span>
                </el-tooltip>
              </div>
              内容：
              <el-input clearable size="mini" v-if="qrcodeData.linktype!=''&&qrcodeData.linktype!='wfsheet'" style="width:500px" v-model="qrcodeData.linkUrl" placeholder="" />
              <span class="fa fa-search ml10" @click="selectorQrCodeFormField()">选择字段</span>
            </td>
          </tr>
          <tr v-if="data.inputCtrlType=='rate'">
            <td class="leftTdbg">五星评价配置:</td>
            <td colspan="3" style="padding-top: 3px; padding-bottom:5px;">
              <div class="p5">
                最大分值(1分代表1颗星)：
                <el-input-number v-model="rateData.max" size="mini" :min="5" :max="100" />
                <div class="mt3">
                  低分和中等分数的界限值，值本身被划分在低分中
                  <el-input-number v-model="rateData.lowThreshold" size="mini" :min="2" :max="50" />
                </div>
                <div class="mt5">
                  高分和中等分数的界限值，值本身被划分在高分中
                  <el-input-number v-model="rateData.highThreshold" size="mini" :min="4" :max="100" />
                </div>
                <div class="mt5">

                  是否显示辅助文字
                  <el-switch v-model="rateData.showText" size="mini" active-color="#13ce66" inactive-color="#DEDEDE" />
                  是否允许半选
                  <el-switch v-model="rateData.allowHalf" size="mini" active-color="#13ce66" inactive-color="#DEDEDE" />
                  辅助文字颜色
                  <el-color-picker v-model="rateData.textColor" style="margin-left: 3px;position: relative; top:8px " size="mini" />

                </div>
                <div class="mt5">
                  辅助文字数组(多个之间使用英文逗号隔开，文字组个数等于最大分数值):
                  <el-input v-model="rateData.texts" style="width:80%" size="mini" placeholder="辅助文字数组,默认为： 极差, 失望, 一般, 满意, 惊喜" />
                </div>
                <div class="mt5">
                  是否显示当前分数（显示分数和显示辅助文字不能同时为真）
                  <el-switch v-model="rateData.showScore" size="mini" active-color="#13ce66" inactive-color="#DEDEDE" />
                </div>

              </div>
            </td>
          </tr>
          <tr v-if="data.inputCtrlType=='progress'">
            <td class="leftTdbg">进度条配置：</td>
            <td colspan="3" style="padding-top: 3px; padding-bottom:5px;">
              <div class="p5">
                进度条类型： <el-radio-group v-model="progressData.type" size="mini">
                  <el-radio label="line">条形</el-radio>
                  <el-radio label="circle">圆形</el-radio>
                  <el-radio label="dashboard">仪表盘</el-radio>
                </el-radio-group>
                <div class="mt5">
                  进度条的宽度，单位 px
                  <el-input-number v-model="progressData.strokeWidth" size="mini" :min="2" :max="50" />
                </div>
                <div class="mt5">
                  是否可修改百分比数字
                  <el-switch v-model="progressData.isEditNumber" size="mini" active-color="#13ce66" inactive-color="#DEDEDE" />
                </div>
                <div class="mt5">
                  进度条背景色（会覆盖 status 状态颜色）
                  <el-color-picker v-model="progressData.color" style="margin-left: 3px;position: relative; top:8px " size="mini" />
                </div>
                <div class="mt5">
                  环形进度条画布宽度（只在 进度条类型为“圆形”或“仪表盘”时可用）
                  <el-input-number v-model="progressData.width" size="mini" :min="80" :max="200" />
                </div>
                <div class="mt5">
                  是否显示进度条文字内容
                  <el-switch v-model="progressData.showText" size="mini" active-color="#13ce66" inactive-color="#DEDEDE" />
                </div>
                <div class="mt5">
                  “圆形”或“仪表盘”类型路径两端的形状
                  <el-radio-group v-model="progressData.strokeLinecap" size="mini">
                    <el-radio label="butt">butt</el-radio>
                    <el-radio label="round">round</el-radio>
                    <el-radio label="square">square</el-radio>
                  </el-radio-group>
                </div>

                <div class="mt5">
                  <em>注意：</em>进度条的值为0到100的数字
                </div>
              </div>
            </td>
          </tr>

          <tr v-if="data.inputCtrlType=='slider'">
            <td class="leftTdbg">滑块配置：</td>
            <td colspan="3" style="padding-top: 3px; padding-bottom:5px;">
              <div class="p5">
                最小值
                <el-input-number v-model="sliderDef.min" size="mini" />
                最大值
                <el-input-number v-model="sliderDef.max" size="mini" />
                步长
                <el-input-number v-model="sliderDef.step" size="mini" />
                <div class="mt5">
                  是否为范围选择（数据类型必须是字符串）
                  <el-switch v-model="sliderDef.range" size="mini" active-color="#13ce66" inactive-color="#DEDEDE" />
                </div>
                <div class="mt5">
                  是否显示输入框，仅在非范围选择时有效
                  <el-switch v-model="sliderDef.showInput" size="mini" active-color="#13ce66" inactive-color="#DEDEDE" />
                </div>
                <div class="mt5">
                  在显示输入框的情况下，是否显示输入框的控制按钮
                  <el-switch v-model="sliderDef.showInputControls" size="mini" active-color="#13ce66" inactive-color="#DEDEDE" />
                </div>
                <div class="mt5">
                  是否显示间断点(步长)
                  <el-switch v-model="sliderDef.showStops" size="mini" active-color="#13ce66" inactive-color="#DEDEDE" />
                  是否显示提示标签
                  <el-switch v-model="sliderDef.showTooltip" size="mini" active-color="#13ce66" inactive-color="#DEDEDE" />
                  是否竖向模式
                  <el-switch v-model="sliderDef.vertical" size="mini" active-color="#13ce66" inactive-color="#DEDEDE" />
                </div>
                <div class="mt5">
                  高度，竖向模式时必填
                  <el-input-number v-model="sliderDef.height" size="mini" :min="50" />
                </div>
              </div>
            </td>
          </tr>

          <tr id="serialnum_tr">
            <td class="leftTdbg">流水号计数器：</td>
            <td colspan="3" style="padding-top: 3px;">
              <el-input v-model="serialNumData.counterCode" size="mini" class="textBoxShort" />
              <span class="cur p3" @click="selectSerialGenerator()"><i class="fa fa-search" />选择流水号生成器</span>

            </td>
          </tr>
          <tr id="richeditor_tr">
            <td class="leftTdbg">工具条类型：</td>
            <td colspan="3" style="padding-top: 3px;">
              <el-select v-model="richeditorData.toolbarsType" size="mini" class="textBoxShort">
                <el-option value="minToolbars" label="极简约" />
                <el-option value="sampleToolbars" label="一般" />
                <el-option value="myToolbars" label="复杂" />
              </el-select>
            </td>
          </tr>
          <tr id="fieldVerifyRuleTr">
            <td class="leftTdbg">校验值类型：</td>
            <td>
              <el-select v-model="data.fieldDataType" size="mini" class="textBoxShort" @change="onFieldDataTypeChange">
                <el-option value="" label="字符串" />

                <el-option value="floatNumber" label="数字" />
                <el-option value="int" label="整数" />
                <el-option value="zint" label="正整数" />
                <el-option value="fint" label="负整数" />
                <el-option value="biggerZero" label="大于0的数字" />
                <el-option value="biggerOrEqualZero" label="大于或等于0的数字" />
                <el-option value="litterOrEqualZero" label="小于或等于0的数字" />

                <el-option value="email" label="邮箱" />
                <el-option value="idcard" label="身份证号码" />
                <el-option value="QQ" label="QQ号码" />
                <el-option value="ZIP" label="邮政编码" />
                <el-option value="CHS" label="汉字" />
                <el-option value="onlyBigEnglisthChar" label="大写字母" />
                <el-option value="englisthOrNumberChar" label="数字或英文" />
                <el-option value="chars" label="数字英文下划线" />
                <el-option value="mobile" label="手机号码" />
                <el-option value="regular" label="正则表达式" />
              </el-select>
            </td>
            <td class="leftTdbg">函数统计：</td>
            <td>
              <el-input v-model="data.countRule" size="mini" class="textBoxShort" />
              <a id="math" role="button" @click="editMath('countRule')"><i class="fa fa-edit ml2" />编辑公式</a>

            </td>
          </tr>
          <tr id="regular_div">
            <td class="leftTdbg">正式表达式</td>
            <td colspan="3">
              <el-input v-model="fieldVerifyRuleData.regular" placeholder="输入正式表达式如：^1\d{10}$" size="mini" style="width: 60%;margin-right: 2px;" class="textBoxShort" />
              <el-input v-model="fieldVerifyRuleData.regularTitle" placeholder="校验错误提示信息" size="mini" style="width:38%;" class="textBoxShort" />
            </td>
          </tr>

          <tr id="isColumnCount_tr">
            <td class="leftTdbg" />
            <td />
            <td class="leftTdbg">子表列</td>
            <td>
              是否列合计：
              <el-switch v-model="data.isColumnCount" active-color="#87DC48" inactive-color="#DEDEDE" />
              &nbsp;&nbsp;&nbsp;
            </td>
          </tr>

          <tr id="defaultValueTr">
            <td class="leftTdbg">默认值：</td>
            <td colspan="3">
              <el-input v-model="data.fieldDefaultValue" placeholder="默认值" size="mini" style="width: 65%;" />
              <a id="editDefaultValue" role="button" @click="editDefaultValue('fieldDefaultValue')"><i class="fa fa-edit ml2 " />编辑</a>
            </td>
          </tr>
          <tr id="tormatTd">
            <td class="leftTdbg">显示格式：</td>
            <td colspan="3">
              <el-select v-model="data.format" size="mini" class="textBoxShort" style="width: 250px;">
                <el-option label="yyyy-MM-dd" value="yyyy-MM-dd" selected="selected" />
                <el-option label="yyyy-MM-dd HH:mm" value="yyyy-MM-dd HH:mm" />
                <el-option label="yyyy-MM-dd HH:mm:ss" value="yyyy-MM-dd HH:mm:ss" />
                <!-- <el-option label="yyyy-MM-dd HH:mm" value="yyyy-MM-dd HH:mm" />  非标准时间格式，一般不使用-->
                <el-option label="HH:mm:ss" value="HH:mm:ss" />
                <el-option label="HH:mm" value="HH:mm" />
                <el-option label="HH时mm分" value="HH时mm分" />
                <el-option label="HH时mm分ss秒" value="HH时mm分ss秒" />

                <el-option label="yyyy年MM月dd日" value="yyyy年MM月dd日" />
                <el-option label="yyyy年MM月" value="yyyy年MM月" />

                <el-option label="年选择" value="year" />
                <el-option label="月选择" value="month" />
                <el-option label="自然周" value="week" />

                <el-option label="多选日期" value="dates" />
                <el-option label="日期范围" value="daterange" />
                <el-option label="日期时间范围" value="datetimerange" />
                <el-option label="月份范围" value="monthrange" />
              </el-select>
              <span style="color: #333;line-height:21px;display: none;">
                <em>注意：</em>不规则日期格式，数据库字段必务使用字符串类型，否则运行时将无法保存。 <br>不规则日期格式是指除了yyyy-MM-dd和yyyy-MM-dd HH:mm:ss之外的日期格式。
              </span>
            </td>
          </tr>
          <tr id="fieldDataTypeTr">
            <td class="leftTdbg">输入类型:</td>
            <td>
              <el-radio v-model="data.entertextType" label="text">明文</el-radio>
              <el-radio v-model="data.entertextType" label="password">密文</el-radio>
            </td>
          </tr>
          <tr id="nameOfId_tr">
            <td class="leftTdbg">转换为显示名：</td>
            <td colspan="3">
              <el-input v-model="data.NameOfId" />
              <a id="editDefaultValue" role="button" class="btn btn-purple btn-xs mr2" @click="editDefaultValue('NameOfId')"><i class="fa fa-edit" />编辑数据源</a>
              （如果字段本身存储的是ID，可使用些转换方法使ID显示为对应的名称，通常用于隐藏域）
            </td>

          </tr>
          <tr id="diwentip_tr">
            <td class="leftTdbg">底纹填写提示：</td>
            <td colspan="3">
              <el-input v-model="data.fieldRemark" type="textarea" :rows="2" placeholder="如填写了“底纹填写提示”则在表单控件显示如同本效果！" />
            </td>
          </tr>
          <tr>
            <td class="leftTdbg">关联说明文章：</td>
            <td colspan="3">
              <span v-html="data.helperArticle" />
              <span v-if="data.helperArticle!=''&&data.helperArticle!=undefined" class="fa fa-times red" @click="clearHelperArticle">清除</span>
              <span class="icon icon-wenjiansousuo cur" @click="selectArticle"> </span><span class="blue">选择文章</span>
            </td>
          </tr>
          <tr>
            <td class="leftTdbg">关联说明：</td>
            <td colspan="3">
              <el-input v-model="data.fieldTip" type="textarea" :rows="2" placeholder="说明的具体内容" />
            </td>
          </tr>
          <tr>
            <td class="leftTdbg">高级属性：</td>
            <td>
              <span class="cur" @click="setFieldOptions()"><i class="icon icon-xitongpeizhi1"></i> <span class="blue"> 属性设置</span></span>
            </td>
            <td class="leftTdbg"><span v-if="isShowFieldLinkages&&isSubtable==false">联动设置：</span></td>
            <td>
              <span class="icon icon-xitongpeizhi1 cur" @click="setFieldLinkages()" v-if="isShowFieldLinkages&&isSubtable==false"><span class="blue">联动设置</span></span>
            </td>
          </tr>

        </table>
        <div class="p10 remark">
          <span class="blue">说明：</span> 此界面的字段控件修改为表单定义中字段元数据定义的修改,将影响所有使用了此表单定义的表单应用。
        </div>
        <input id="formDefId" type="hidden" name="formDefId">
        <input id="fieldCreator " type="hidden" name="fieldCreator ">
        <input id="fieldCreatedTime  " type="hidden" name="fieldCreatedTime  ">
        <input id="fieldLastUpdateTime  " type="hidden" name="fieldLastUpdateTime  ">
        <input id="fieldLastUpdateActor" type="hidden" name="fieldLastUpdateActor">
        <input id="columnId" type="hidden" name="columnId">
        <input id="oleFieldId" type="hidden" name="oleFieldId">
        <input id="busObjectId" type="hidden" name="busObjectId">
        <input id="fieldVerifyRule" type="hidden" name="fieldVerifyRule">
        <input id="fieldOptions" type="hidden" name="fieldOptions">
        <input id="fieldLinkages" type="hidden" name="fieldLinkages">
      </div>
      <div class="dialogfooter">
        <el-button v-if="itemId!=''" size="mini" type="primary" @click="submitForm(1)"><i class="fa fa-save" />保存并替换标签
        </el-button>
        <el-button style="margin-left:30px" v-if="formAction!='View'" size="mini" type="default" @click="submitForm(0)"><i class="fa fa-save" />保存
        </el-button>
        <el-button style="margin-left:30px" v-if="itemId==''" size="mini" type="default" @click="submitForm('onlysave')"><i class="fa fa-save" />仅保存不刷新列表
        </el-button>
        <el-button style="margin-left:30px" id="btn_cancel" size="mini" @click="closeEdit"><span class="mr10 ml10">取消</span>
        </el-button>
      </div>
    </el-form>
  </div>
</template>

<script>

  export default {
    data() {
      return {
        isSubtable:false,
        isShowFieldLinkages: false,
        fieldId: '',
        formAction: null,
        formDefId: '',
        itemId: '',
        deviceType: '',
        treeData: [],
        // 控件类型
        ctrTypeArr: [
          { 'text': '文本框', 'value': 'text' },
          { 'text': '文本域', 'value': 'textarea' },
          { 'text': '富文本编辑器', 'value': 'richeditor' },
          { 'text': '下拉选择框', 'value': 'select' },
          { 'text': '下拉树', 'value': 'droptree' },
          { 'text': '级联选择', 'value': 'cascselect' },
          { 'text': '自动完成', 'value': 'autocompleter' },
          { 'text': '自定义(开发)选择器', 'value': 'selector' },
          { 'text': '自定义选择对话框', 'value': 'customdialog' },
          { 'text': '地图地址', 'value': 'mapAddress' },
          { 'text': '里程碑', 'value': 'steps' },
          { 'text': '单选框组', 'value': 'radio' },
          { 'text': '复选框组', 'value': 'checkbox' },
          { 'text': '附件上传', 'value': 'file' },
          { 'text': '日期时间', 'value': 'datetime' },
          { 'text': '上传图片', 'value': 'picture' },
          { 'text': '上传图章', 'value': 'stamp' },
          { 'text': '手写签名', 'value': 'handsign' },
          { 'text': '超链接', 'value': 'hyperlink' },
          { 'text': '隐藏域', 'value': 'hidden' },
          { 'text': '开关控件', 'value': 'switch' },
          { 'text': '流水号', 'value': 'serialnum' },
          { 'text': '二维码', 'value': 'qrcode' },
          { 'text': '五星评分', 'value': 'rate' },
          { 'text': '进度条', 'value': 'progress' },
          { 'text': '滑块', 'value': 'slider' }


        ],
        sliderDef: {
          min: 0,
          //最大 值
          max: 100,
          //步长
          step: 1,
          //是否显示 tooltip
          showTooltip: true,
          //是否显示间断点
          showStops: false,
          //是否显示输入框，仅在非范围选择时有效
          showInput: false,
          //在显示输入框的情况下，是否显示输入框的控制按钮
          showInputControls: false,
          //是否为范围选择
          range: false,
          //是否竖向模式
          vertical: false,
          //高度，竖向模式时必填
          height: "",
        },
        progressData: {
          //进度条类型:	line/circle/dashboard
          type: "line",
          //进度条背景色（会覆盖 status 状态颜色）
          color: "",
          //进度条的宽度，单位 px
          strokeWidth: 12,
          //环形进度条画布宽度（只在 type 为 circle 或 dashboard 时可用）
          width: 126,
          //是否显示进度条文字内容
          showText: true,
          //circle/dashboard 类型路径两端的形状 butt/round/square
          strokeLinecap: "round",

          isEditNumber: true
        }
        //五星评分配置
        , rateData: {
          //最大分值
          max: 5,
          //低分和中等分数的界限值，值本身被划分在低分中
          lowThreshold: 2,
          //高分和中等分数的界限值，值本身被划分在高分中
          highThreshold: 4,
          //是否显示辅助文字，若为真，则会从 texts 数组中选取当前分数对应的文字内容
          showText: false,
          //是否显示当前分数，show-score 和 show-text 不能同时为真
          showScore: false,
          //辅助文字的颜色
          textColor: "#1F2D3D",
          //极差, 失望, 一般, 满意, 惊喜
          texts: "",

          //是否允许半选
          allowHalf: false,
          colors: "",
          //未选中 icon 的颜色#C6D1DE
          voidColor: "",
          //只读时未选中 icon 的颜色#EFF2F7
          disabledVoidColor: "",
        }
        //二维码数据配置
        , qrcodeData: {
          //qrcode,barcode
          qrtype: "qrcode",
          linktype: "string",
          linkUrl: ''
        },
        hyperlinkData: {
          opentype: '',
          linktype: '',
          hyperlinkUrl: ''
        },

        stampData: {
          showPathPrefix: ''
        },
        serialNumData: {
          counterCode: ''
        },
        richeditorData: {
          toolbarsType: ''
        },
        fieldVerifyRuleData: {
          regular: '',
          regularTitle: ''
        },
        datasourceData: {
          type: '',
          data: []
        },
        data: {
          fieldAlias: '',
          fieldTitle: '',
          inputCtrlType: '',
          isRequired: false,
          fieldOrderNo: 0,
          inputCtrlOption: '',

          fieldLength: 0,
          fieldDecimalLen: -1,
          width: 0,
          height: 0,
          helperArticle: '',

          counterCode: '',
          fieldDataType: '',
          isColumnCount: '',
          fieldDefaultValue: '',
          format: 'yyyy-MM-dd HH:mm:ss',
          entertextType: 'text',
          nameOfId: '',
          fieldRemark: '',
          fieldTip:'', // 关联说明
          formDefId: '',
          fieldCreator: '',
          fieldCreatedTime: '',
          fieldLastUpdateTime: '',
          fieldLastUpdateActor: '',
          columnId: '',
          oleFieldId: '',
          busObjectId: '',
          fieldVerifyRule: '',
          fieldOptions: '',
          fieldLinkages: '',
        },
        // ===========SqlKey==========
        sqlkeyArray: [{
          // dataField: 'groupKeyData',
          // sqlkey: 'CB_CategoryGroup',
          // parm: null,
          // flag: null,
          // change: null
        }],
        // ,configTypeArray:[{
        //     // dataField:'DataTypeData',
        //     // configType:'基本数据类型',
        //     // flag:''
        // }
        // ]
        // stand:表单校验规则
        formRules: {
          Flag: [
            { required: true, message: '必填项不能为空' }
            // {validator: FUI.Validator.onlyBigEnglisthChar},
          ],
          OpinionContent: [
            { required: true, message: '必填项不能为空' }
          ]
        }
      };
    },
    created: function () {
      var that = this;
      var formDefId = Object.toQueryString('formDefId');
      // 如果ItemId不为空，则是从表单设计器打开的
      var itemId = Object.toQueryString('itemId') || '';
      var deviceType = Object.toQueryString('deviceType');
      var isSubtable = Object.toQueryString('isSubtable');
      that.isSubtable=isSubtable==true||isSubtable=='true';
      that.formDefId = formDefId;
      that.fieldId = keyId;
      that.itemId = itemId;
      that.deviceType = deviceType;
      that.formAction = formAction;
      const currUser = FUI.Sys.getAuthor();
      if (formAction == FUI.FormAction.Add) {
        that.data.fieldCreator = decodeURI(currUser.realName);
        that.data.fieldCreatedTime = Object.toGetCurrentDateTimeString();
        that.data.fieldLastUpdateActor = decodeURI(currUser.realName);
        that.data.fieldLastUpdateTime = Object.toGetCurrentDateTimeString();
      } else {
        that.data.fieldLastUpdateActor = decodeURI(currUser.realName);
        that.data.fieldLastUpdateTime = Object.toGetCurrentDateTimeString();
        that.loadData();
      }
      that.showOrHideFieldLinkages();
    },
    mounted() {
      var that = this;
      window.myvm = that;
      var ctrType = that.data.inputCtrlType;
      var inputCtrlOption = that.data.inputCtrlOption;
      that.changeFunction({
        text: '',
        value: ctrType
      });
      if (formAction != FUI.FormAction.Add) {
        that.fieldDataTypeChangeDone(that.data.fieldDataType);
        that.initailSourceType(inputCtrlOption);
        that.loadInputCtrlOption(ctrType, inputCtrlOption);
        that.loadFieldVerifyRule(ctrType, that.data.fieldVerifyRule);
      }

    },
    methods: {
      // ===stand:标准化方法============
      closeEdit() {
        // stand:关闭编辑窗口
        FUI.Window.closeEdit();
      },
      // ===stand:标准化方法结束============
      loadData() {
        var that = this;
        if (formAction != FUI.FormAction.Add) {
          FUI.Form.bindDataToForm(that, FUI.Handlers.SmartFormHandler, 'getModelFormDefField', keyId, null, null);
        }
      },
      //是否显示设置级联配置按钮
      showOrHideFieldLinkages(isClearFieldLinkagesValue) {
        var that = this;
        if (that.data.inputCtrlType == 'radio' || that.data.inputCtrlType == 'checkbox' || that.data.inputCtrlType == 'select' || that.data.inputCtrlType == 'droptree') {
          that.isShowFieldLinkages = true;
        } else {
          that.isShowFieldLinkages = false;
          if (isClearFieldLinkagesValue) {
            that.data.fieldLinkages = "";
          }
        }
      }
      , submitForm(btntype) {
        var that = this;
        var success = that.validateForm('formRef');
        if (!success) return;
        var inputCtrlType = that.data.inputCtrlType;
        if (inputCtrlType == 'stamp') {
          $('#option_prefix_tr').hide();
          // 已不使用此方式了
          // that.saveStampOption();
        } else if (inputCtrlType == 'hyperlink') {
          that.saveHyperlink();
        }
        else if (inputCtrlType == 'qrcode') {
          that.saveQrcodeData();
        }
        else if (inputCtrlType == 'rate') {
          that.saveRateData();
        }
        else if (inputCtrlType == 'progress') {
          that.saveProgressData();
        }
        else if (inputCtrlType == 'slider') {
          that.saveSliderDef();
        }
        else if (inputCtrlType == 'serialnum') {
          that.saveSerialNum();
        } else if (inputCtrlType == 'text') {
          that.saveText();
        } else if (inputCtrlType == 'textarea') {
          that.saveTextarea();
        } else if (inputCtrlType == 'richeditor') {
          that.saveRicheditor();
        } else if (inputCtrlType == 'datetime' && !that.data.format) {
          FUI.Window.showMsg(that, '请选择日期时间显示格式');
          return false;
        }

        var inputCtrlOption = that.data.inputCtrlOption;
        if (inputCtrlOption == '' && (inputCtrlType == 'select' || inputCtrlType == 'cascselect' || inputCtrlType == 'autocompleter' || inputCtrlType == 'selector' || inputCtrlType == 'customdialog' || inputCtrlType == 'radio' || inputCtrlType == 'checkbox')) {
          FUI.Window.showMsg(that, '请点击“配置数据按钮”进行数据源配置');
          return false;
        }
        if (inputCtrlOption == '' && inputCtrlType == 'serialnum') {
          FUI.Window.showMsg(that, '请点击“请选择配置流水号计数器”');
          return false;
        }
        that.showOrHideFieldLinkages(true);
        if (that.itemId != '') {
          FUI.Form.submitForm(that, that.data, FUI.Handlers.SmartFormHandler, 'saveFormDefField', formAction, keyId, null, null, null, null, null, function (obj) {
            if (obj.success != undefined && obj.success) {
              obj.msg = obj.msg || '操作成功！';
            }
            if (obj.success) {
              try {
                var $target = $('#' + that.itemId, $(window.parent.window.document));
                var vmodel = $target.attr('vmodel');
                if (vmodel == undefined) {
                  FUI.Window.showMsg('控件找不到vmodel属性');
                  return false;
                }
                var rowId = $target.attr('rowId');
                var columnId = $target.attr('colId');
                var preFix = vmodel.substring(0, vmodel.lastIndexOf('.'));
                var inputHtml = Object.toAjaxJson(FUI.Handlers.SmartFormHandler, 'getOnlineFormItemHtml', {
                  'formDefId': that.formDefId,
                  'fieldId': that.fieldId,
                  preFix: preFix,
                  'type': that.deviceType
                }, null, null, null, 'html');

                var fieldStr = $('.jsonItem', $(inputHtml)).val();
                var fieldItem = eval('(' + fieldStr + ')');

                if (inputHtml != '') {
                  if (btntype == 0) {
                    // 0不更新标签
                    window.parent.window.myvm.onFieldUpdate(fieldItem, rowId, columnId, that.itemId, false);
                    // var $targetBlock = $("div.online-input-block", $target);
                    // var $newInputBlock = $("div.online-input-block", $(inputHtml));
                    // $targetBlock.after($newInputBlock.prop("outerHTML")).remove();
                  } else {
                    // 1并替换标签
                    window.parent.window.myvm.onFieldUpdate(fieldItem, rowId, columnId, that.itemId);
                    // $target.after(inputHtml).remove();
                    // var newItemId = $(inputHtml).attr("id");
                    // window.parent.window.bindMenu(newItemId);
                  }
                }
              } catch (err) {
                FUI.Window.showMsg(err);
                console.info(err);
                return false;
              }

              // 调用生成新的表单Html字段
              FUI.Window.showMsg(obj.msg, null, 1, function () {
                if (obj.success) {
                  FUI.Window.closeEdit(false);
                }
              });
            } else {
              FUI.Window.showMsg(obj.msg);
            }
          });
        }
         else if (btntype == 'onlysave') {
          FUI.Form.submitForm(that, that.data, FUI.Handlers.SmartFormHandler, 'saveFormDefField', formAction, keyId, parentGridId, null, null, null, null, function (obj) {
            if (obj.success) {
              FUI.Window.showMsg2(that, obj.msg, null, 1, function () {
                if (obj.success) {
                  FUI.Window.closeEdit(false);
                }
              });
            } else {
              FUI.Window.showMsg(obj.msg);
            }
          });
        }
        else {
          FUI.Form.submitForm(that, that.data, FUI.Handlers.SmartFormHandler, 'saveFormDefField', formAction, keyId, parentGridId, mainTable);
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

      selectorUserString(inputKey, inputName, passParm, singleSelect, keyName) {
        var that = this;
        WF.SelectorDialog.selectorUserString(that, inputKey, inputName, passParm, singleSelect, keyName);
      },
      selectorUserTextValue(inputKey, inputName, passParm, singleSelect, keyName) {
        var that = this;
        WF.SelectorDialog.selectorUserTextValue(that, inputKey, inputName, passParm, singleSelect, keyName);
      },
      clearSelectedUsers(inputId, inputName) {
        var that = this;
        that.data[inputId] = '';
        that.data[inputName] = '';
      },
      toPinYin(sourceField, targetField) {
        if (!this.data[targetField]) {
          const source = this.data[sourceField];
          this.data[targetField] = Object.toPinYin(source);
        }
      },
      initailSourceType(data) {
        if (data) {
          try {
            var obj = eval('(' + data + ')');
            var sourceType = obj.type;
            this.datasourceData = obj;
          } catch (err) {
            console.info('JSON解析出错：' + data);
          }
        }
      },
      onInputCtrlTypeChange(v) {
        this.changeFunction({
          text: '',
          value: v
        });
        this.showOrHideFieldLinkages();
        this.ctrlTypeRestoreDefault(v);
      },
      //切换控件时还原有些属性的默认值
      ctrlTypeRestoreDefault(ctrType) {
        var that = this;
        switch (ctrType) {
          case 'slider': {
            that.data.fieldDataType = "";
          }; break;
          case 'progress': {
            that.data.fieldDataType = "";
          }; break;
          case 'rate': {
            that.data.fieldDataType = "";
          }; break;
          case 'qrcode': {
            that.data.fieldDataType = "";
          }; break;
          default:break;
        }
      }
      , onFieldDataTypeChange(value) {
        var type = value;
        this.fieldDataTypeChangeDone(type);
      },
      fieldDataTypeChangeDone(type) {
        var that = this;
        if (type == 'regular') {
          $('#regular_div').show();
        } else {
          that.fieldVerifyRuleData.regular = '';
          that.fieldVerifyRuleData.regularTitle = '';
          $('#regular_div').hide();
        }
      },
      changeFunction(rec) {
        var that = this;
        $('#optionDatasource').show();
        $('#selectorDatasource').hide();
        $('#customdialogDatasource').hide();
        $('#dataServiceDatasource').hide();
        $('#dataServiceRadio').prop('checked', false);
        $('#selectorRadio').prop('checked', false);
        $('#customdialogRadio').prop('checked', false);
        $('#format').hide();
        $('#tormatTd').hide();
        $('#optionTr').hide();
        $('#editDefaultValue').show();
        $('#defaultValueTr').show();
        $('#fieldLengthTr').show();
        $('#fieldVerifyRuleTr').show();
        $('#fieldDataTypeTr').show();
        $('#hyperlink_tr').hide();
        $('#serialnum_tr').hide();
        $('#richeditor_tr').hide();

        $('#nameOfId_tr').hide();
        $('#isColumnCount_tr').show();
        $('#option_prefix_tr').hide();

        switch (rec.value) {
          case 'switch': {
            $('#NameOfId_tr').hide();
            $('#fieldLengthTr').hide();
            $('#isColumnCount_tr').hide();
            $('#fieldDataTypeTr').hide();
            $('#fieldVerifyRuleTr').hide();
            $('#WidthTr').hide();
            $('#diwentip_tr').hide();
            $('#optionTr').hide();
            $('#dicDatasource').hide();
            $('#sqlDatasource').hide();
            $('#dataServiceDatasource').hide();
          }
            break;
          case 'steps': {
            $('#NameOfId_tr').show();
            $('#fieldLengthTr').hide();
            $('#isColumnCount_tr').hide();
            $('#fieldDataTypeTr').hide();
            $('#fieldVerifyRuleTr').hide();
            $('#WidthTr').hide();
            $('#optionTr').show();
            $('#dataServiceDatasource').show();
          }
            break;
          case 'hidden': {
            $('#NameOfId_tr').show();
            $('#fieldLengthTr').hide();
            $('#isColumnCount_tr').hide();
            $('#fieldDataTypeTr').hide();
            $('#fieldVerifyRuleTr').hide();
            $('#WidthTr').hide();
          }

            break;
          case 'file': {
            $('#isColumnCount_tr').hide();
            $('#fieldLengthTr').hide();
            $('#fieldVerifyRuleTr').hide();
            $('#defaultValueTr').hide();
            $('#editDefaultValue').hide();
            $('#fieldDataTypeTr').hide();
            $('#WidthTr').hide();
          }

            break;
          case 'richeditor':
          case 'richeditorofficial': {
            $('#richeditor_tr').show();
            $('#fieldVerifyRuleTr').hide();
            $('#editDefaultValue').hide();
            $('#isColumnCount_tr').hide();
            $('#fieldDataTypeTr').hide();
            if (that.data.width == '' || that.data.width == 0) {
              that.data.width = 0;
            }
            if (that.data.height == '' || that.data.height == 0) {
              that.data.height = 300;
            }
            that.data.fieldDataType = '';
            that.fieldDataTypeChangeDone('');
          }

            break;
          case 'textarea': {
            $('#isColumnCount_tr').hide();
          }

            break;
          case 'label': {
            $('#editDefaultValue').hide();
          }

            break;
          case 'select': {
            $('#fieldLengthTr').hide();
            $('#WidthTr').hide();
            $('#fieldDataTypeTr').hide();
            $('#fieldVerifyRuleTr').hide();
            $('#optionTr').show();
            $('#dataServiceDatasource').show();
          }

            break;
          case 'droptree': {
            $('#fieldLengthTr').hide();
            $('#WidthTr').hide();
            $('#fieldDataTypeTr').hide();
            $('#fieldVerifyRuleTr').hide();
            $('#optionTr').show();
            $('#optionDatasource').hide();
            $('#dataServiceDatasource').show();
          }

            break;
          case 'autocompleter': {
            $('#fieldLengthTr').hide();
            $('#fieldVerifyRuleTr').hide();
            $('#fieldDataTypeTr').hide();
            $('#optionTr').show();
            $('#optionDatasource').hide();
            $('#dataServiceDatasource').show();
            that.data.datasource = 'dataService';
          }

            break;
          case 'cascselect': {
            $('#fieldLengthTr').hide();
            $('#fieldVerifyRuleTr').hide();
            $('#fieldDataTypeTr').hide();

            $('#optionTr').show();

            $('#fieldLengthTr').hide();
            $('#fieldVerifyRuleTr').hide();
            $('#optionDatasource').hide();
            $('#dataServiceDatasource').show();
            that.data.datasource = 'dataService';
          }

            break;
          case 'customdialog': {
            $('#fieldLengthTr').hide();
            $('#fieldVerifyRuleTr').hide();
            $('#optionTr').show();
            $('#fieldDataTypeTr').hide();
            $('#optionDatasource').hide();
            $('#selectorDatasource').hide();
            $('#customdialogDatasource').show();
            that.data.datasource = 'customdialog';
          }

            break;
          case 'selector': {
            $('#fieldLengthTr').hide();
            $('#fieldVerifyRuleTr').hide();
            $('#optionTr').show();
            $('#optionDatasource').hide();
            $('#fieldDataTypeTr').hide();
            $('#selectorDatasource').show();
            that.data.datasource = 'selector';
          }

            break;
          case 'radio': {
            $('#fieldLengthTr').hide();
            $('#fieldVerifyRuleTr').hide();
            $('#fieldDataTypeTr').hide();
            $('#isColumnCount_tr').hide();
            $('#optionTr').show();
            $('#dataServiceDatasource').show();
          }

            break;
          case 'checkbox': {
            $('#fieldLengthTr').hide();
            $('#fieldVerifyRuleTr').hide();
            $('#fieldDataTypeTr').hide();
            $('#isColumnCount_tr').hide();
            $('#optionTr').show();
            $('#dataServiceDatasource').show();
          }

            break;
          case 'datetime': {
            $('#format').show();
            $('#tormatTd').show();
            $('#isColumnCount_tr').hide();
            $('#fieldLengthTr').hide();
            $('#fieldVerifyRuleTr').hide();
            $('#fieldDataTypeTr').hide();
          }
            break;
          case 'picture': {
            $('#format').hide();
            $('#tormatTd').hide();
            $('#isColumnCount_tr').hide();
            $('#fieldLengthTr').hide();
            $('#fieldVerifyRuleTr').hide();
            $('#fieldDataTypeTr').hide();
          }

            break;
          case 'stamp': {
            $('#option_prefix_tr').hide();
            $('#isColumnCount_tr').hide();
            $('#fieldVerifyRuleTr').hide();
            $('#fieldDataTypeTr').hide();
            $('#fieldLengthTr').hide();
          }

            break;
          case 'hyperlink': {
            $('#hyperlink_tr').show();
            $('#isColumnCount_tr').hide();
            $('#fieldVerifyRuleTr').hide();
            $('#fieldDataTypeTr').hide();
            $('#fieldLengthTr').hide();
          }
            break;
          case 'qrcode': {
            $('#isColumnCount_tr').hide();
            $('#fieldVerifyRuleTr').hide();
            $('#fieldDataTypeTr').hide();
            $('#fieldLengthTr').hide();
            $('#defaultValueTr').hide();
            $('#diwentip_tr').hide();
            that.data.fieldDefaultValue = "";
          }
          case 'rate': {
            $('#isColumnCount_tr').hide();
            $('#fieldVerifyRuleTr').hide();
            $('#fieldDataTypeTr').hide();
            $('#fieldLengthTr').hide();
            $('#defaultValueTr').hide();
            $('#diwentip_tr').hide();

            that.data.fieldDefaultValue = "";
          }
            break;
          case 'progress': {
            $('#isColumnCount_tr').hide();
            $('#fieldVerifyRuleTr').hide();
            $('#fieldDataTypeTr').hide();
            $('#fieldLengthTr').hide();
            $('#defaultValueTr').hide();
            $('#diwentip_tr').hide();
            that.data.fieldDefaultValue = "";
          }
            break;
          case 'slider': {
            $('#isColumnCount_tr').hide();
            $('#fieldVerifyRuleTr').hide();
            $('#fieldDataTypeTr').hide();
            $('#fieldLengthTr').hide();
            $('#defaultValueTr').hide();
            $('#diwentip_tr').hide();
            that.data.fieldDefaultValue = "";
          }
            break;
          case 'serialnum': {
            $('#serialnum_tr').show();
            $('#isColumnCount_tr').hide();
            $('#fieldVerifyRuleTr').hide();
            $('#fieldDataTypeTr').hide();
            $('#fieldLengthTr').hide();
            $('#defaultValueTr').hide();
            that.data.fieldDefaultValue = "";
          }

            break;
          case 'handsign': {
            $('#isColumnCount_tr').hide();
            $('#fieldLengthTr').hide();
            $('#fieldVerifyRuleTr').hide();
            $('#fieldDataTypeTr').hide();
          }

            break;
            break;
        }
      },

      saveHyperlink() {
        var that = this;
        var json = that.hyperlinkData;
        that.data.inputCtrlOption = JSON.stringify(json);
      },
      saveQrcodeData() {
        var that = this;
        var json = that.qrcodeData;
        that.data.inputCtrlOption = JSON.stringify(json);
      },
      saveRateData() {
        var that = this;
        var json = that.rateData;
        that.data.inputCtrlOption = JSON.stringify(json);
      },
      saveProgressData() {
        var that = this;
        var json = that.progressData;
        that.data.inputCtrlOption = JSON.stringify(json);
      },
      saveSliderDef() {
        var that = this;
        var json = that.sliderDef;
        that.data.inputCtrlOption = JSON.stringify(json);
      },
      saveSerialNum() {
        var that = this;
        var json = that.serialNumData;
        that.data.inputCtrlOption = JSON.stringify(json);
      },
      saveRicheditor() {
        var that = this;
        var toolbarsType = that.richeditorData.toolbarsType;
        var json = {
          'toolbarsType': toolbarsType
        };
        that.data.inputCtrlOption = JSON.stringify(json);
      },

      saveText() {
        var that = this;
        var regular = that.fieldVerifyRuleData.regular;
        var regularTitle = that.fieldVerifyRuleData.regularTitle;
        var json = {
          'regular': regular,
          'regularTitle': regularTitle
        };
        var jsonStr = JSON.stringify(json).replace(/\"/g, "'");
        that.data.fieldVerifyRule = jsonStr;
      },
      saveTextarea() {
        var that = this;
        var regular = that.fieldVerifyRuleData.regular;
        var regularTitle = that.fieldVerifyRuleData.regularTitle;
        var json = {
          'regular': regular,
          'regularTitle': regularTitle
        };
        var jsonStr = JSON.stringify(json).replace(/\"/g, "'");
        that.data.fieldVerifyRule = jsonStr;
      },
      loadInputCtrlOption(ctrType, optionData) {
        var that = this;
        switch (ctrType) {
          case 'stamp':
            that.loadStampOption(optionData);
            break;
          case 'hyperlink':
            that.loadHyperlink(optionData);
            break;
          case 'qrcode':
            that.loadQrcode(optionData);
            break;
          case 'rate':
            that.loadRate(optionData);
            break;
          case 'progress':
            that.loadProgress(optionData);
            break;
          case 'slider':
            that.loadSlider(optionData);
            break;
          case 'serialnum':
            that.loadSerialNum(optionData);
            break;
          case 'text':
            that.loadTextOption(optionData);
          case 'textarea':
            that.loadTextareaOption(optionData);
            break;
          case 'richeditor':
            that.loadRicheditor(optionData);
            break;
          default:
            break;
        }
      },
      loadFieldVerifyRule(ctrType, fieldVerifyRule) {
        var that = this;
        switch (ctrType) {
          case 'text':
            that.loadTextOption(fieldVerifyRule);
          case 'textarea':
            that.loadTextareaOption(fieldVerifyRule);
            break;
          default:
            break;
        }
      },
      loadStampOption(inputCtrlOptionStr) {
        var that = this;
        if (inputCtrlOptionStr) {
          var json = eval('(' + inputCtrlOptionStr + ')');
          that.stampData = json;
        }
      },
      loadRicheditor(inputCtrlOptionStr) {
        var that = this;
        if (inputCtrlOptionStr) {
          var json = eval('(' + inputCtrlOptionStr + ')');
          that.richeditorData = json;
        }
      },
      loadHyperlink(inputCtrlOptionStr) {
        var that = this;
        if (inputCtrlOptionStr) {
          var json = eval('(' + inputCtrlOptionStr + ')');
          that.hyperlinkData = json;
        }
      },
      loadQrcode(inputCtrlOptionStr) {
        var that = this;
        if (inputCtrlOptionStr) {
          var json = eval('(' + inputCtrlOptionStr + ')');
          that.qrcodeData = json;
        }
      },
      loadRate(inputCtrlOptionStr) {
        var that = this;
        if (inputCtrlOptionStr) {
          var json = eval('(' + inputCtrlOptionStr + ')');
          that.rateData = json;
        }
      },
      loadProgress(inputCtrlOptionStr) {
        var that = this;
        if (inputCtrlOptionStr) {
          var json = eval('(' + inputCtrlOptionStr + ')');
          that.progressData = json;
        }
      },
      loadSlider(inputCtrlOptionStr) {
        var that = this;
        if (inputCtrlOptionStr) {
          var json = eval('(' + inputCtrlOptionStr + ')');
          that.sliderDef = json;
        }
      },
      loadSerialNum(inputCtrlOptionStr) {
        console.info(inputCtrlOptionStr);
        var that = this;
        if (inputCtrlOptionStr) {
          var json = eval('(' + inputCtrlOptionStr + ')');
          that.serialNumData = json;
        }
      },
      loadTextOption(fieldVerifyRule) {
        var that = this;
        if (fieldVerifyRule) {
          var json = eval('(' + fieldVerifyRule + ')');
          that.fieldVerifyRuleData = json;
        }
      },
      loadTextareaOption(fieldVerifyRule) {
        var that = this;
        if (fieldVerifyRule) {
          var json = eval('(' + fieldVerifyRule + ')');
          that.fieldVerifyRuleData = json;
        }
      },
      editOption(inputId) {
        var that = this;
        var typeSource;
        var inputCtrlType = that.data.inputCtrlType;
        var fieldTitle = that.data.fieldTitle;
        // 格式{type:"sql\dic\custom\selector\customdialog",data:}
        var obj = {
          type: that.datasourceData.type,
          data: []
        };
        if (that.datasourceData.type == 'sql') {
          obj.data = '';
        }
        typeSource = obj.type;
        if (!typeSource) {
          FUI.Window.showMsg2('请选择数据源类型');
          return false;
        }
        var inputIdValue = that.data[inputId];
        if (inputIdValue) {
          var json = inputIdValue;
          try {
            obj = eval('(' + inputIdValue + ')');
            if (typeSource != obj.type) {
              obj = {
                type: that.datasourceData.type,
                data: []
              };
              if (typeSource == 'sql') {
                obj.data = '';
              }
            }
          } catch (err) {
            console.info('JSON解析出错：' + json);
          }
        }
        var width = 680;
        var height = 500;
        var url = '';
        var title = '编辑【' + fieldTitle + '】选项';
        var parms = { data: obj.data };
        switch (typeSource) {
          case 'sql': {
            url = '/selector/selectTextEditor/';
            parms = {
              data: obj.data, label: 'SQL语句', isShowSysVars: true, tip: '请填写标准的Sql语句', description: '1.SQL应返回两个字段<br>' +
                '2.字段为值的列重命名为：value ，字段为文本的列重命名为：text<br>' +
                '3.可选择下拉框中的系统变量作为占位符，如：【当前登录用户ID：#CurrentUserId#】  <br>' +
                '4.示例：SELECT RealName as value,RealName as  text FROM sys_Users where userId=#CurrentUserId#'
            };
          }
            break;
          case 'dic':
            url = '/selector/selectDicConfigType/';
            break;
          case 'custom':
            url = '/selector/keyValueEditor/?type=tv';
            width = 500;
            height = 500;
            break;
          case 'selector':
            url = '/smartForm/getSelector/?formDefId=' + that.formDefId;
            title = '【' + fieldTitle + '】设置选择器';
            break;
          case 'dataService':
            var implType = inputCtrlType;
            switch (inputCtrlType) {
              case 'cascselect':
                implType = 'Cascselect';
                break;
              case 'select':
              case 'checkbox':
              case 'radio':
                implType = 'DropSelect';
                break;
              case 'droptree':
                implType = 'Tree';
                break;
              case 'autocompleter':
                implType = 'Autocompleter';
                break;
              default:
                break;
            }
            url = '/smartForm/getDataService/?formDefId=' + that.formDefId + '&implType=' + implType + '&ctrType=' + inputCtrlType;
            title = '【' + fieldTitle + '】设置选择器';
            break;
          case 'customdialog':
            url = '/smartForm/getCustomDialog/?formDefId=' + that.formDefId;
            title = '【' + fieldTitle + '】设置选择对话框';
            break;
        }

        FUI.dialog(__webpath + '/workflow' + url, title, parms, width, height, function (dataObject, index, layer) {
         console.log(dataObject)
          //if (dataObject == false) {
           // return false;
          // }
          var objJson = {
            type: typeSource,
            data: dataObject
          };
          that.datasourceData = objJson;
          var resultStr = JSON.stringify(objJson);
          // resultStr = resultStr.replace(/\"/g, "\'");
          that.data[inputId] = resultStr;
          layer.close(index);
        }, true);
      },
      setFieldOptions() {
        var that = this;
        var fieldTitle = that.data.fieldTitle;
        var ctrType = that.data.inputCtrlType;
        FUI.Window.openEdit(FUI.Handlers.SmartFormHandler + 'fieldOptionsEdit/?ctrType=' + ctrType + '&formDefId=' + that.formDefId + '&fieldId=' + keyId, '【' + fieldTitle + '】属性', 'Edit', '', 700, 480, null, null, keyId);
      },
      setFieldLinkages() {
        var that = this;
        var fieldTitle = that.data.fieldTitle;
        FUI.Window.openEdit(FUI.Handlers.SmartFormHandler + 'fieldLinkagesEdit/?fieldId=' + keyId + "&formDefId=" + that.formDefId, '【' + fieldTitle + '】联动设置', 'Edit', '', 700, 480, null, null, keyId, true, null, null, true);
      },
      editDefaultValue(inputId, fieldTitle) {
        var that = this;
        fieldTitle = fieldTitle || that.data.fieldTitle;
        var initailValue = that.data[inputId];
        var url = __webpath + '/workflow/selector/selectTextEditor/';
        parms = {
          data: initailValue, label: '默认值', tip: '填写或选择默认值', isShowSysVars: true, description: ' 注：【从Sql取单个值】Sql的select字段只能有一个，结果只会查出第一条.' +
            '<br> 示例：  Sql:select   RealName from sys_users where realName=#CurrentRealName#  <br>Sql语句中可包含系统变量的通配符'
        };
        FUI.dialog(url, '编辑【' + fieldTitle + '】的默认值', parms, 600, 450, function (dataObject, index, layer) {
          that.data[inputId] = dataObject;
          layer.close(index);
        }, true);
      },
      editMath(inputId, fieldTitle) {
        var that = this;
        fieldTitle = fieldTitle || that.data.fieldTitle;
        // 格式 countrule = "{rowmath:''}"
        var obj = {
          rowmath: '',
          formulaType: '',
          isCapitalAmount: '0',
          // 小数位
          digitlen: 2
        };
        var value = that.data[inputId];
        if (value != '') {
          obj = eval('(' + value + ')');
        }
        var url = __webpath + '/workflow/smartForm/mathEdit/?formDefId=' + that.formDefId;
        FUI.dialog(url, '编辑【' + fieldTitle + '】的公式', obj, 750, 500, function (dataObject, index, layer) {
          that.data[inputId] = dataObject;
          layer.close(index);
        }, true);
      },
      selectArticle() {
        var that = this;
        var parm = {
          customDialog: 'selectHelptipArticle',
          isMulti: 0,
          width: 800,
          height: 450,
          data: [{
            property: 'ArticleCode',
            field: 'helperArticle'
          }]
        };
        CustomDialog(that, parm);
      },
      clearHelperArticle() {
        this.data.helperArticle = '';
      },
      selectSerialGenerator() {
        var that = this;
        var parm = {
          customDialog: 'SerialNumberGenerator',
          isMulti: false,
          data: [{
            property: 'CounterCode',
            field: 'counterCode'
          }],
          width: 800,
          height: 450
        };
        CustomDialog(that, parm, that.serialNumData);
      }
      ,
      selectorQrCodeFormField() {
        var that = this;
        WF.SelectorDialog.selectorFormField(that, that.formDefId, null, null, null, true, null, function (objectData) {
          $.each(objectData, function (i, item) {
            let value = item.value;
            that.qrcodeData.linkUrl += "[" + value + "]";
          });
        });
      }
    }
  };

  window.getFieldOptions = function () {
    return myvm.data.fieldOptions;
  };

  window.saveFieldOptions = function (v) {
    return myvm.data.fieldOptions = v;
  }
</script>
<style>
  .leftTdbg {
    width: 130px;
  }
</style>
