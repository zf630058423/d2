<template>
  <div class="f2bpm-page-dialog-layout">
    <div class="f2bpm-page-layout pl10 pr10">
      <el-tabs v-model="activeName">
        <el-tab-pane label="字体" name="first">
          <div class="layui-tab-item layui-show">
            <fieldset class="fieldset" style="width:90%;">
              <legend class="legend-left">文本对齐方式</legend>
              <div id="btnaligns" style="padding-left:15px;">
                <button id="textAlignLeft" onclick="setStyle(this, 'fontWeight', 'bold', '')" title="加粗" class="layui-btn layui-btn-primary layui-btn-sm"><i class="fa fa-bold" /></button>
                <button id="textAlignLeft" onclick="setStyle(this, 'fontStyle', 'italic', 'normal')" title="倾斜" class="layui-btn layui-btn-primary layui-btn-sm"><i class="fa fa-italic" /></button>
                <button id="textAlignLeft" onclick="setStyle(this, 'textDecoration', 'underline', 'none')" title="下划线" class="layui-btn layui-btn-primary layui-btn-sm"><i class="fa fa-underline" /></button>
                <button id="textAlignLeft" onclick="setStyle(this, 'textDecoration', 'overline ', 'none')" title="上划线" class="layui-btn layui-btn-primary layui-btn-sm"><i class="fa fa-underline fa-rotate-180" /></button>
                <button id="textAlignLeft" onclick="setStyle(this, 'textDecoration', 'line-through', 'none')" title="删除线" class="layui-btn layui-btn-primary layui-btn-sm"><i class="fa fa-strikethrough" /></button>
                &nbsp; &nbsp;
                <button id="textAlignLeft" onclick="setStyle(this, 'textAlign', 'left', '', 'textAlignCenter,textAlignRight')" title="左对齐" class="layui-btn layui-btn-primary layui-btn-sm"><i class="fa fa-align-left  fa-flip-vertical" /></button>
                <button id="textAlignCenter" onclick="setStyle(this, 'textAlign', 'center', '', 'textAlignLeft,textAlignRight')" title="居中对齐" class="layui-btn layui-btn-primary layui-btn-sm"><i class="fa  fa-align-center fa-rotate-180" /></button>
                <button id="textAlignRight" onclick="setStyle(this, 'textAlign', 'right', '', 'textAlignLeft,textAlignCenter')" title="右对齐" class="layui-btn layui-btn-primary layui-btn-sm"><i class="fa fa-align-right  fa-flip-vertical" /></button>
                &nbsp; &nbsp;
                <button id="verticalAligntop" title="顶端对齐" onclick="setStyle(this, 'verticalAlign', 'top', '', 'verticalAlignmiddle,verticalAlignbottom')" class="layui-btn layui-btn-primary layui-btn-sm"><i class="fa fa-indent fa-rotate-270" /></button>
                <button id="verticalAlignmiddle" title="垂直居中" onclick="setStyle(this, 'verticalAlign', 'middle', '', 'verticalAligntop,verticalAlignbottom')" class="layui-btn layui-btn-primary layui-btn-sm"><i class="fa fa-navicon" /></button>
                <button id="verticalAlignbottom" title="底部对齐" onclick="setStyle(this, 'verticalAlign', 'bottom', '', 'verticalAligntop,verticalAlignmiddle')" class="layui-btn layui-btn-primary layui-btn-sm"><i class="fa  fa-indent fa-rotate-90" /></button>

              </div>

            </fieldset>
            <fieldset class="fieldset" style="width:90%;">
              <legend class="legend-left">字体</legend>
              <el-row style="line-height: 30px">
                <el-col :span="5">
                  字体：<select name="interest" class="textBoxMinShort" onchange="onfontFamilyChange(this)">
                    <option value="" />
                    <option value="">无</option>
                    <option value="SimSun">宋体</option>
                    <option value="_GB2312 FangSong_GB2312">仿宋</option>
                    <option value="KaiTi">楷体</option>
                    <option value="Microsoft YaHei">微软雅黑</option>
                    <option value="SimHei">黑体</option>
                    <option value="NSimSun">新宋体</option>
                    <option value="STLiti">华文隶书</option>
                  </select>
                </el-col>
                <el-col :span="5">
                  字号：<select name="interest" class="textBoxMinShort" onchange="onFontSizeChange(this)">
                    <option value="" />
                    <option value="">无</option>
                    <option value="8">8</option>
                    <option value="9">9</option>
                    <option value="10">10</option>
                    <option value="12">12</option>
                    <option value="14">14</option>
                    <option value="16">16</option>
                    <option value="18">18</option>
                    <option value="20">20</option>
                    <option value="22">22</option>
                    <option value="24">24</option>
                    <option value="26">26</option>
                    <option value="28">28</option>
                    <option value="36">36</option>
                    <option value="48">48</option>
                    <option value="72">72</option>
                    <option value="100">100</option>
                    <option value="200">200</option>
                  </select>
                </el-col>
                <el-col :span="5">
                  行距：<select name="interest" class="textBoxMinShort" onchange="onlineHeightChange(this)">
                    <option value="" />
                    <option value="">无</option>
                    <option value="8">8</option>
                    <option value="9">9</option>
                    <option value="10">10</option>
                    <option value="12">12</option>
                    <option value="14">14</option>
                    <option value="16">16</option>
                    <option value="18">18</option>
                    <option value="20">20</option>
                    <option value="22">22</option>
                    <option value="24">24</option>
                    <option value="26">26</option>
                    <option value="28">28</option>
                    <option value="36">36</option>
                    <option value="48">48</option>
                    <option value="72">72</option>
                    <option value="100">100</option>
                    <option value="200">200</option>
                  </select>
                </el-col>
                <el-col :span="8">
                  <span style="float: left">颜色：</span>
                  <el-input v-model="color" size="mini" style="width: 80px;float: left" class="textBoxShort" placeholder="选择或输入字体颜色" />
                  <el-color-picker v-model="color" style="float: left;margin-left: 3px;" size="mini" @change="zhiTiColorPickerChange" />

                </el-col>

              </el-row>
            </fieldset>
            <fieldset class="fieldset" style="width:90%;">
              <legend>预览</legend>
              <div id="btnaligns" style="margin:5px;">
                <table style="width:100%;">
                  <tr>
                    <td id="textDemo" style="width:98%;height:80px;border:solid  1px #ccc5c5"> AbBbCcYyZz中文</td>
                  </tr>
                </table>
              </div>
            </fieldset>
          </div>
        </el-tab-pane>
        <el-tab-pane label="边框">
          <div class="layui-tab-item">
            <div class="line-border-div">
              <fieldset class="fieldset">
                <legend>边框</legend>
                <div class="borderpicker">
                  <div>
                    <label class="color-black">线条:</label>
                  </div>
                  <div class="line-style-out-div">
                    <div class="line-style-backcolor-div" style="background-color: #393d49;border:thin">
                      <div class="line-style line-style-empty" line-style="empty">无</div>
                      <div class="line-style line-style-hair" line-style="dotted" line-size="1" title="圆点虚线" />
                      <div class="line-style line-style-dotted" line-style="dotted" line-size="2" title="粗圆点虚线" />
                      <div class="line-style line-style-dash-dot-dot" line-style="dashed" line-size="1" title="方头虚线" />
                      <div class="line-style line-style-dash-dot" line-style="dashed" line-size="2" title="粗方头虚线" />
                      <div class="line-style line-style-dashed" line-style="dotted" line-size="1" title="圆点虚线" />
                      <div class="line-style line-style-thin" line-style="solid" line-size="1" title="实线" />

                      <div class="line-style line-style-medium-dash-dot-dot" line-style="dotted" line-size="4" title="较粗圆点虚线" />
                      <div class="line-style line-style-slanted-dash-dot" line-style="dashed" line-size="4" title="较粗方头虚线" />
                      <div class="line-style line-style-medium-dash-dot" line-style="dashed" line-size="4" title="较粗方头虚线" />
                      <div class="line-style line-style-medium-dashed" line-style="dashed" line-size="4" title="粗方头虚线" />
                      <div class="line-style line-style-medium" line-style="solid" line-size="2" title="粗实线" />
                      <div class="line-style line-style-thick" line-style="solid" line-size="4" title="较粗实线" />
                      <div class="line-style line-style-double" line-style="double" line-size="3" title="两条平行实线" />
                    </div>
                  </div>
                  <div><label class="color-black">颜色:</label></div>
                  <div class="borderpicker-color gcui-comboframe ui-state-default">
                    <div class="layui-inline" style="left: -2px;">
                      <el-input v-model="borderlineColor" size="mini" style="width: 85px;float: left" class="textBoxShort" placeholder="选择或输入字体颜色" />
                      <el-color-picker v-model="borderlineColor" style="float: left;margin-left: 3px;" size="mini" @change="boderColorPickerChange" />
                    </div>
                  </div>
                </div>

              </fieldset>
            </div>

            <div class="line-border-rightbox-div">
              <fieldset class="fieldset">
                <legend class="legend-left">预置</legend>
                <div class="presets-style">
                  <div>
                    <button id="no-border" onclick="setborderLine(this, 'noBorder', 'noBorder', '', 'outside-border,inside-border')" title="无边框" class="layui-btn layui-btn-primary layui-btn-sm   border-btn">
                      <table class="border-table no-border-table">
                        <tr>
                          <td />
                          <td />
                        </tr>
                        <tr>
                          <td />
                          <td />
                        </tr>
                      </table>
                    </button>
                    <button id="outside-border" onclick="setborderLine(this, 'outsideBorder', 'outsideBorder', '', 'no-border')" title="外边框" class="layui-btn layui-btn-primary layui-btn-sm   border-btn">
                      <table class="border-table outside-border-table">
                        <tr>
                          <td />
                          <td />
                        </tr>
                        <tr>
                          <td />
                          <td />
                        </tr>
                      </table>
                    </button>
                    <button id="inside-border" onclick="setborderLine(this, 'insideBorder', 'insideBorder', '', 'no-border')" title="内部" class="layui-btn layui-btn-primary layui-btn-sm   border-btn">
                      <table class="border-table inside-border-table">
                        <tr>
                          <td />
                          <td />
                        </tr>
                        <tr>
                          <td />
                          <td />
                        </tr>
                      </table>
                    </button>
                  </div>
                  <div>
                    <span class="border-lebel">无</span>
                    <span class="border-lebel">外边框</span>
                    <span class="border-lebel">内部</span>
                  </div>

                </div>
              </fieldset>
            </div>

            <div class="line-border-rightbox-div">
              <fieldset class="fieldset" style="margin-top: 30px;">
                <legend class="legend-left">边框</legend>
                <div class="border-detail-style">
                  <table id="borderTableDemo" class="borderTableDemo">
                    <tbody>
                      <tr>
                        <td />
                        <td />
                      </tr>
                      <tr>
                        <td />
                        <td />
                      </tr>
                    </tbody>
                  </table>
                </div>
              </fieldset>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane v-if="false" label="内边距" name="third">
          <div class="layui-tab-item">
            <div>
              <fieldset class="fieldset" style="width: 90%;">
                <legend>内边距</legend>
                <div>
                  <label class="column1" data-bind="text:res.formatDialog.top">靠上</label>
                  <span class="ui-spinner ui-widget ui-widget-content ui-corner-all"><input class="label-top-padding numeric column1 ui-spinner-input" data-name="top-padding" aria-valuemin="0" aria-valuemax="99" autocomplete="off" role="spinbutton" aria-valuenow="1"><a class="ui-spinner-button ui-spinner-up ui-corner-tr ui-button ui-widget ui-state-default ui-button-text-only" tabindex="-1" role="button" aria-disabled="false"><span class="ui-button-text"><span class="ui-icon ui-icon-triangle-1-n">▲</span></span></a><a class="ui-spinner-button ui-spinner-down ui-corner-br ui-button ui-widget ui-state-default ui-button-text-only" tabindex="-1" role="button" aria-disabled="false"><span class="ui-button-text"><span class="ui-icon ui-icon-triangle-1-s">▼</span></span></a></span>
                </div>
                <div>
                  <label class="column1" data-bind="text:res.formatDialog.right">靠右</label>
                  <span class="ui-spinner ui-widget ui-widget-content ui-corner-all"><input class="label-right-padding numeric column1 ui-spinner-input" data-name="right-padding" aria-valuemin="0" aria-valuemax="99" autocomplete="off" role="spinbutton" aria-valuenow="0"><a class="ui-spinner-button ui-spinner-up ui-corner-tr ui-button ui-widget ui-state-default ui-button-text-only" tabindex="-1" role="button" aria-disabled="false"><span class="ui-button-text"><span class="ui-icon ui-icon-triangle-1-n">▲</span></span></a><a class="ui-spinner-button ui-spinner-down ui-corner-br ui-button ui-widget ui-state-default ui-button-text-only" tabindex="-1" role="button" aria-disabled="false"><span class="ui-button-text"><span class="ui-icon ui-icon-triangle-1-s">▼</span></span></a></span>
                </div>
                <div>
                  <label class="column1" data-bind="text:res.formatDialog.bottom">靠下</label>
                  <span class="ui-spinner ui-widget ui-widget-content ui-corner-all"><input class="label-bottom-padding numeric column1 ui-spinner-input" data-name="bottom-padding" aria-valuemin="0" aria-valuemax="99" autocomplete="off" role="spinbutton" aria-valuenow="0"><a class="ui-spinner-button ui-spinner-up ui-corner-tr ui-button ui-widget ui-state-default ui-button-text-only" tabindex="-1" role="button" aria-disabled="false"><span class="ui-button-text"><span class="ui-icon ui-icon-triangle-1-n">▲</span></span></a><a class="ui-spinner-button ui-spinner-down ui-corner-br ui-button ui-widget ui-state-default ui-button-text-only" tabindex="-1" role="button" aria-disabled="false"><span class="ui-button-text"><span class="ui-icon ui-icon-triangle-1-s">▼</span></span></a></span>
                </div>
                <div>
                  <label class="column1" data-bind="text:res.formatDialog.left">靠左</label>
                  <span class="ui-spinner ui-widget ui-widget-content ui-corner-all"><input class="label-left-padding numeric column1 ui-spinner-input" data-name="left-padding" aria-valuemin="0" aria-valuemax="99" autocomplete="off" role="spinbutton" aria-valuenow="0"><a class="ui-spinner-button ui-spinner-up ui-corner-tr ui-button ui-widget ui-state-default ui-button-text-only" tabindex="-1" role="button" aria-disabled="false"><span class="ui-button-text"><span class="ui-icon ui-icon-triangle-1-n">▲</span></span></a><a class="ui-spinner-button ui-spinner-down ui-corner-br ui-button ui-widget ui-state-default ui-button-text-only" tabindex="-1" role="button" aria-disabled="false"><span class="ui-button-text"><span class="ui-icon ui-icon-triangle-1-s">▼</span></span></a></span>
                </div>
              </fieldset>
              <br><br>
              <fieldset class="fieldset" style="width: 90%;">
                <legend>外边距</legend>
                <div class="label-margin-group-container">
                  <div class="label-margin-group">
                    <div>
                      <label class="label-margin-column" data-bind="text:res.formatDialog.top">靠上</label>
                      <span class="ui-spinner ui-widget ui-widget-content ui-corner-all"><input class="label-top-margin numeric label-margin-column ui-spinner-input" data-name="top-margin" aria-valuemin="0" aria-valuemax="99" autocomplete="off" role="spinbutton" aria-valuenow="0"><a class="ui-spinner-button ui-spinner-up ui-corner-tr ui-button ui-widget ui-state-default ui-button-text-only" tabindex="-1" role="button" aria-disabled="false"><span class="ui-button-text"><span class="ui-icon ui-icon-triangle-1-n">▲</span></span></a><a class="ui-spinner-button ui-spinner-down ui-corner-br ui-button ui-widget ui-state-default ui-button-text-only" tabindex="-1" role="button" aria-disabled="false"><span class="ui-button-text"><span class="ui-icon ui-icon-triangle-1-s">▼</span></span></a></span>
                    </div>
                    <div>
                      <label class="label-margin-column" data-bind="text:res.formatDialog.left">靠左</label>
                      <span class="ui-spinner ui-widget ui-widget-content ui-corner-all"><input class="label-left-margin numeric label-margin-column ui-spinner-input" data-name="left-margin" aria-valuemin="0" aria-valuemax="99" autocomplete="off" role="spinbutton" aria-valuenow="0"><a class="ui-spinner-button ui-spinner-up ui-corner-tr ui-button ui-widget ui-state-default ui-button-text-only" tabindex="-1" role="button" aria-disabled="false"><span class="ui-button-text"><span class="ui-icon ui-icon-triangle-1-n">▲</span></span></a><a class="ui-spinner-button ui-spinner-down ui-corner-br ui-button ui-widget ui-state-default ui-button-text-only" tabindex="-1" role="button" aria-disabled="false"><span class="ui-button-text"><span class="ui-icon ui-icon-triangle-1-s">▼</span></span></a></span>
                    </div>
                  </div>
                  <div class="label-margin-group">
                    <div>
                      <label class="label-margin-column" data-bind="text:res.formatDialog.right">靠右</label>
                      <span class="ui-spinner ui-widget ui-widget-content ui-corner-all"><input class="label-right-margin numeric label-margin-column ui-spinner-input" data-name="right-margin" aria-valuemin="0" aria-valuemax="99" autocomplete="off" role="spinbutton" aria-valuenow="0"><a class="ui-spinner-button ui-spinner-up ui-corner-tr ui-button ui-widget ui-state-default ui-button-text-only" tabindex="-1" role="button" aria-disabled="false"><span class="ui-button-text"><span class="ui-icon ui-icon-triangle-1-n">▲</span></span></a><a class="ui-spinner-button ui-spinner-down ui-corner-br ui-button ui-widget ui-state-default ui-button-text-only" tabindex="-1" role="button" aria-disabled="false"><span class="ui-button-text"><span
                        class="ui-icon ui-icon-triangle-1-s"
                      >▼</span></span></a></span>
                    </div>
                    <div>
                      <label class="label-margin-column" data-bind="text:res.formatDialog.bottom">靠下</label>
                      <span class="ui-spinner ui-widget ui-widget-content ui-corner-all"><input class="label-bottom-margin numeric label-margin-column ui-spinner-input" data-name="bottom-margin" aria-valuemin="0" aria-valuemax="99" autocomplete="off" role="spinbutton" aria-valuenow="0"><a class="ui-spinner-button ui-spinner-up ui-corner-tr ui-button ui-widget ui-state-default ui-button-text-only" tabindex="-1" role="button" aria-disabled="false"><span class="ui-button-text"><span class="ui-icon ui-icon-triangle-1-n">▲</span></span></a><a class="ui-spinner-button ui-spinner-down ui-corner-br ui-button ui-widget ui-state-default ui-button-text-only" tabindex="-1" role="button" aria-disabled="false"><span class="ui-button-text"><span
                        class="ui-icon ui-icon-triangle-1-s"
                      >▼</span></span></a></span>
                    </div>
                  </div>
                </div>
              </fieldset>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="填充" name="fourth">
          <div class="layui-tab-item" style="padding:10px;">
            <button class="layui-btn layui-btn-primary layui-btn-fluid grayborder" onclick="cleanbackColor()" style="width:252px;height:25px;line-height:25px; background-color:#ece9e9;  ">
              无颜色
            </button>
            <div style="width:250px;border:#BCC2CD solid 1px;margin-bottom: 2px;">
              <table class="colorpicker-colortable" cellspacing="0" cellpadding="0">
                <tbody>
                  <tr class="colorpicker-themecolors-firstline">
                    <td>
                      <div class="colorpicker-colorcell" row="0" col="0" style="background: rgb(255, 255, 255); margin: 1px;">
                        <div class="colorpicker-div-inner-colorcell" />
                      </div>
                    </td>
                    <td>
                      <div class="colorpicker-colorcell" row="0" col="1" style="background: rgb(0, 0, 0); margin: 1px;">
                        <div class="colorpicker-div-inner-colorcell" />
                      </div>
                    </td>
                    <td>
                      <div class="colorpicker-colorcell" row="0" col="2" style="background: rgb(231, 230, 230); margin: 1px;">
                        <div class="colorpicker-div-inner-colorcell" />
                      </div>
                    </td>
                    <td>
                      <div class="colorpicker-colorcell" row="0" col="3" style="background: rgb(68, 84, 106); margin: 1px;">
                        <div class="colorpicker-div-inner-colorcell" />
                      </div>
                    </td>
                    <td>
                      <div class="colorpicker-colorcell" row="0" col="4" style="background: rgb(91, 155, 213); margin: 1px;">
                        <div class="colorpicker-div-inner-colorcell" />
                      </div>
                    </td>
                    <td>
                      <div class="colorpicker-colorcell" row="0" col="5" style="background: rgb(237, 125, 49); margin: 1px;">
                        <div class="colorpicker-div-inner-colorcell" />
                      </div>
                    </td>
                    <td>
                      <div class="colorpicker-colorcell" row="0" col="6" style="background: rgb(165, 165, 165); margin: 1px;">
                        <div class="colorpicker-div-inner-colorcell" />
                      </div>
                    </td>
                    <td>
                      <div class="colorpicker-colorcell" row="0" col="7" style="background: rgb(255, 192, 0); margin: 1px;">
                        <div class="colorpicker-div-inner-colorcell" />
                      </div>
                    </td>
                    <td>
                      <div class="colorpicker-colorcell" row="0" col="8" style="background: rgb(68, 114, 196); margin: 1px;">
                        <div class="colorpicker-div-inner-colorcell" />
                      </div>
                    </td>
                    <td>
                      <div class="colorpicker-colorcell" row="0" col="9" style="background: rgb(112, 173, 71); margin: 1px;">
                        <div class="colorpicker-div-inner-colorcell" />
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <div class="colorpicker-colorcell" row="1" col="0" style="background: rgb(242, 242, 242); margin: 1px;">
                        <div class="colorpicker-div-inner-colorcell" />
                      </div>
                    </td>
                    <td>
                      <div class="colorpicker-colorcell" row="1" col="1" style="background: rgb(127, 127, 127); margin: 1px;">
                        <div class="colorpicker-div-inner-colorcell" />
                      </div>
                    </td>
                    <td>
                      <div class="colorpicker-colorcell" row="1" col="2" style="background: rgb(209, 208, 208); margin: 1px;">
                        <div class="colorpicker-div-inner-colorcell" />
                      </div>
                    </td>
                    <td>
                      <div class="colorpicker-colorcell" row="1" col="3" style="background: rgb(214, 221, 228); margin: 1px;">
                        <div class="colorpicker-div-inner-colorcell" />
                      </div>
                    </td>
                    <td>
                      <div class="colorpicker-colorcell" row="1" col="4" style="background: rgb(222, 235, 246); margin: 1px;">
                        <div class="colorpicker-div-inner-colorcell" />
                      </div>
                    </td>
                    <td>
                      <div class="colorpicker-colorcell" row="1" col="5" style="background: rgb(251, 230, 215); margin: 1px;">
                        <div class="colorpicker-div-inner-colorcell" />
                      </div>
                    </td>
                    <td>
                      <div class="colorpicker-colorcell" row="1" col="6" style="background: rgb(236, 236, 236); margin: 1px;">
                        <div class="colorpicker-div-inner-colorcell" />
                      </div>
                    </td>
                    <td>
                      <div class="colorpicker-colorcell" row="1" col="7" style="background: rgb(254, 243, 205); margin: 1px;">
                        <div class="colorpicker-div-inner-colorcell" />
                      </div>
                    </td>
                    <td>
                      <div class="colorpicker-colorcell" row="1" col="8" style="background: rgb(217, 227, 242); margin: 1px;">
                        <div class="colorpicker-div-inner-colorcell" />
                      </div>
                    </td>
                    <td>
                      <div class="colorpicker-colorcell" row="1" col="9" style="background: rgb(227, 239, 218); margin: 1px;">
                        <div class="colorpicker-div-inner-colorcell" />
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <div class="colorpicker-colorcell" row="2" col="0" style="background: rgb(216, 216, 216); margin: 1px;">
                        <div class="colorpicker-div-inner-colorcell" />
                      </div>
                    </td>
                    <td>
                      <div class="colorpicker-colorcell" row="2" col="1" style="background: rgb(89, 89, 89); margin: 1px;">
                        <div class="colorpicker-div-inner-colorcell" />
                      </div>
                    </td>
                    <td>
                      <div class="colorpicker-colorcell" row="2" col="2" style="background: rgb(174, 173, 172); margin: 1px;">
                        <div class="colorpicker-div-inner-colorcell" />
                      </div>
                    </td>
                    <td>
                      <div class="colorpicker-colorcell" row="2" col="3" style="background: rgb(173, 185, 201); margin: 1px;">
                        <div class="colorpicker-div-inner-colorcell" />
                      </div>
                    </td>
                    <td>
                      <div class="colorpicker-colorcell" row="2" col="4" style="background: rgb(190, 215, 238); margin: 1px;">
                        <div class="colorpicker-div-inner-colorcell" />
                      </div>
                    </td>
                    <td>
                      <div class="colorpicker-colorcell" row="2" col="5" style="background: rgb(247, 204, 174); margin: 1px;">
                        <div class="colorpicker-div-inner-colorcell" />
                      </div>
                    </td>
                    <td>
                      <div class="colorpicker-colorcell" row="2" col="6" style="background: rgb(218, 218, 218); margin: 1px;">
                        <div class="colorpicker-div-inner-colorcell" />
                      </div>
                    </td>
                    <td>
                      <div class="colorpicker-colorcell" row="2" col="7" style="background: rgb(254, 230, 154); margin: 1px;">
                        <div class="colorpicker-div-inner-colorcell" />
                      </div>
                    </td>
                    <td>
                      <div class="colorpicker-colorcell" row="2" col="8" style="background: rgb(180, 199, 231); margin: 1px;">
                        <div class="colorpicker-div-inner-colorcell" />
                      </div>
                    </td>
                    <td>
                      <div class="colorpicker-colorcell" row="2" col="9" style="background: rgb(199, 223, 180); margin: 1px;">
                        <div class="colorpicker-div-inner-colorcell" />
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <div class="colorpicker-colorcell" row="3" col="0" style="background: rgb(191, 191, 191); margin: 1px;">
                        <div class="colorpicker-div-inner-colorcell" />
                      </div>
                    </td>
                    <td>
                      <div class="colorpicker-colorcell" row="3" col="1" style="background: rgb(63, 63, 63); margin: 1px;">
                        <div class="colorpicker-div-inner-colorcell" />
                      </div>
                    </td>
                    <td>
                      <div class="colorpicker-colorcell" row="3" col="2" style="background: rgb(119, 113, 113); margin: 1px;">
                        <div class="colorpicker-div-inner-colorcell" />
                      </div>
                    </td>
                    <td>
                      <div class="colorpicker-colorcell" row="3" col="3" style="background: rgb(133, 151, 175); margin: 1px;">
                        <div class="colorpicker-div-inner-colorcell" />
                      </div>
                    </td>
                    <td>
                      <div class="colorpicker-colorcell" row="3" col="4" style="background: rgb(156, 195, 229); margin: 1px;">
                        <div class="colorpicker-div-inner-colorcell" />
                      </div>
                    </td>
                    <td>
                      <div class="colorpicker-colorcell" row="3" col="5" style="background: rgb(244, 177, 133); margin: 1px;">
                        <div class="colorpicker-div-inner-colorcell" />
                      </div>
                    </td>
                    <td>
                      <div class="colorpicker-colorcell" row="3" col="6" style="background: rgb(200, 200, 200); margin: 1px;">
                        <div class="colorpicker-div-inner-colorcell" />
                      </div>
                    </td>
                    <td>
                      <div class="colorpicker-colorcell" row="3" col="7" style="background: rgb(254, 217, 103); margin: 1px;">
                        <div class="colorpicker-div-inner-colorcell" />
                      </div>
                    </td>
                    <td>
                      <div class="colorpicker-colorcell" row="3" col="8" style="background: rgb(142, 172, 219); margin: 1px;">
                        <div class="colorpicker-div-inner-colorcell" />
                      </div>
                    </td>
                    <td>
                      <div class="colorpicker-colorcell" row="3" col="9" style="background: rgb(171, 208, 143); margin: 1px;">
                        <div class="colorpicker-div-inner-colorcell" />
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <div class="colorpicker-colorcell" row="4" col="0" style="background: rgb(165, 165, 165); margin: 1px;">
                        <div class="colorpicker-div-inner-colorcell" />
                      </div>
                    </td>
                    <td>
                      <div class="colorpicker-colorcell" row="4" col="1" style="background: rgb(38, 38, 38); margin: 1px;">
                        <div class="colorpicker-div-inner-colorcell" />
                      </div>
                    </td>
                    <td>
                      <div class="colorpicker-colorcell" row="4" col="2" style="background: rgb(60, 57, 57); margin: 1px;">
                        <div class="colorpicker-div-inner-colorcell" />
                      </div>
                    </td>
                    <td>
                      <div class="colorpicker-colorcell" row="4" col="3" style="background: rgb(51, 64, 81); margin: 1px;">
                        <div class="colorpicker-div-inner-colorcell" />
                      </div>
                    </td>
                    <td>
                      <div class="colorpicker-colorcell" row="4" col="4" style="background: rgb(46, 119, 183); margin: 1px;">
                        <div class="colorpicker-div-inner-colorcell" />
                      </div>
                    </td>
                    <td>
                      <div class="colorpicker-colorcell" row="4" col="5" style="background: rgb(200, 91, 17); margin: 1px;">
                        <div class="colorpicker-div-inner-colorcell" />
                      </div>
                    </td>
                    <td>
                      <div class="colorpicker-colorcell selected" row="4" col="6" style="background: rgb(124, 124, 124); margin: 1px;">
                        <div class="colorpicker-div-inner-colorcell selected" />
                      </div>
                    </td>
                    <td>
                      <div class="colorpicker-colorcell" row="4" col="7" style="background: rgb(192, 144, 0); margin: 1px;">
                        <div class="colorpicker-div-inner-colorcell" />
                      </div>
                    </td>
                    <td>
                      <div class="colorpicker-colorcell" row="4" col="8" style="background: rgb(47, 86, 151); margin: 1px;">
                        <div class="colorpicker-div-inner-colorcell" />
                      </div>
                    </td>
                    <td>
                      <div class="colorpicker-colorcell" row="4" col="9" style="background: rgb(87, 131, 53); margin: 1px;">
                        <div class="colorpicker-div-inner-colorcell" />
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <div class="colorpicker-colorcell" row="5" col="0" style="background: rgb(127, 127, 127); margin: 1px;">
                        <div class="colorpicker-div-inner-colorcell" />
                      </div>
                    </td>
                    <td>
                      <div class="colorpicker-colorcell" row="5" col="1" style="background: rgb(12, 12, 12); margin: 1px;">
                        <div class="colorpicker-div-inner-colorcell" />
                      </div>
                    </td>
                    <td>
                      <div class="colorpicker-colorcell" row="5" col="2" style="background: rgb(24, 23, 22); margin: 1px;">
                        <div class="colorpicker-div-inner-colorcell" />
                      </div>
                    </td>
                    <td>
                      <div class="colorpicker-colorcell" row="5" col="3" style="background: rgb(34, 43, 54); margin: 1px;">
                        <div class="colorpicker-div-inner-colorcell" />
                      </div>
                    </td>
                    <td>
                      <div class="colorpicker-colorcell" row="5" col="4" style="background: rgb(31, 79, 122); margin: 1px;">
                        <div class="colorpicker-div-inner-colorcell" />
                      </div>
                    </td>
                    <td>
                      <div class="colorpicker-colorcell" row="5" col="5" style="background: rgb(133, 61, 11); margin: 1px;">
                        <div class="colorpicker-div-inner-colorcell" />
                      </div>
                    </td>
                    <td>
                      <div class="colorpicker-colorcell" row="5" col="6" style="background: rgb(82, 82, 82); margin: 1px;">
                        <div class="colorpicker-div-inner-colorcell" />
                      </div>
                    </td>
                    <td>
                      <div class="colorpicker-colorcell" row="5" col="7" style="background: rgb(128, 96, 0); margin: 1px;">
                        <div class="colorpicker-div-inner-colorcell" />
                      </div>
                    </td>
                    <td>
                      <div class="colorpicker-colorcell" row="5" col="8" style="background: rgb(31, 58, 101); margin: 1px;">
                        <div class="colorpicker-div-inner-colorcell" />
                      </div>
                    </td>
                    <td>
                      <div class="colorpicker-colorcell" row="5" col="9" style="background: rgb(58, 88, 35); margin: 1px;">
                        <div class="colorpicker-div-inner-colorcell" />
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div style="margin-left: 0px;">
              <form class="layui-form" style="margin:0px;" action="">
                <div class="layui-form-item" style="margin-bottom:0px;">
                  <div class="layui-inline" style="left: -2px;">
                    <el-input v-model="backgroundColor" size="mini" style="width: 125px;float: left" class="textBoxShort" placeholder="选择或输入字体颜色" />
                    <el-color-picker v-model="backgroundColor" style="float: left;margin-left: 3px;" size="mini" @change="backgroundColorPickerChange" />
                  </div>
                </div>
                <fieldset class="fieldset" style="width: 90%;">
                  <legend>示例</legend>
                  <div style="width:90%;border:solid 1px #ccc5c5;padding:10px;">
                    <div id="backgroundcolordemo" style="width:100%;height:50px;" />
                  </div>
                </fieldset>
              </form>
            </div>

          </div>
        </el-tab-pane>
      </el-tabs>
      <div>
        <em>说明:</em>只需设置本次您需要调整的样式,不需要调整的样式不作设置。
      </div>
    </div>
  </div>
</template>

<script>
  window.resultStyleJson = {}
  window.styleJson = { 'backgroundColor': '#c85b11' }
  export default { data() {
      return {
        color: '',
        borderlineColor: '',
        backgroundColor: '',
        activeName: 'first'
      }
    },
    created: function() {
    },
     methods: {
      zhiTiColorPickerChange(v) {
        this.color = v
        resultStyleJson.color = v
        $('#textDemo').css('color', v)
      },
       boderColorPickerChange(v) {
        this.borderlineColor = v
        resultStyleJson.borderlineColor = v
        $('#borderTableDemo').css('border-color', v)
      },
       backgroundColorPickerChange(v) {
        this.backgroundColor = v
        resultStyleJson.backgroundColor = v
        $('#backgroundcolordemo').css('background-color', v)
      }
    }
  }

  window.getResult = function() {
    return resultStyleJson
  }
  // 字体样式
  window.setStyle = function(thisObj, cssname, cssvlaue, nonevalue, cleanOther) {
    var resultCssValue = ''
    if ($(thisObj).hasClass('selected')) {
      resultCssValue = nonevalue
      $(thisObj).removeClass('selected')
    } else {
      resultCssValue = cssvlaue
      $(thisObj).addClass('selected')
    }
    resultStyleJson[cssname] = resultCssValue
    if (cleanOther) {
      var arr = cleanOther.split(',')
      $.each(arr, function(i, btnId) {
        $('#' + btnId).removeClass('selected')
      })
    }
    var setcssName = getCssRealName(cssname)
    $('#textDemo').css(setcssName, resultCssValue)
  }

  // 快捷设置边框
  window.setborderLine = function(thisObj, cssname, cssvlaue, nonevalue, cleanOther) {
    var resultCssValue = ''

    if ($(thisObj).hasClass('selected')) {
      resultCssValue = nonevalue
      $(thisObj).removeClass('selected')
    } else {
      resultCssValue = cssvlaue
      $(thisObj).addClass('selected')
    }

    if (cssname == 'noBorder') {
      resultStyleJson.isNoBorder = $(thisObj).hasClass('selected') ? 1 : 0
      resultStyleJson.isOutsideBorder = 0
      resultStyleJson.isInsideBorder = 0
    }
    if (cssname == 'outsideBorder') {
      resultStyleJson.isNoBorder = undefined
      resultStyleJson.isOutsideBorder = $(thisObj).hasClass('selected') ? 1 : 0
    }
    if (cssname == 'insideBorder') {
      resultStyleJson.isNoBorder = undefined
      resultStyleJson.isInsideBorder = $(thisObj).hasClass('selected') ? 1 : 0
    }
    if (cleanOther) {
      var arr = cleanOther.split(',')
      $.each(arr, function(i, btnId) {
        $('#' + btnId).removeClass('selected')
      })
    }
    showBorderTableDemo()
  }

  window.showBorderTableDemo = function() {
    // 边框
    var lineStyle = 'solid'
    var lineColor = '#000000'
    var lineWidth = '1px'
    var data = resultStyleJson
    if (data.borderlineStyle != undefined) {
      lineStyle = data.borderlineStyle
    }
    if (data.borderlineColor != undefined) {
      lineColor = data.borderlineColor
    }
    if (data.borderlineWidth != undefined) {
      lineWidth = data.borderlineWidth
    }
    var borderStyle = lineStyle + ' ' + lineWidth + ' ' + lineColor
    var noneBorderStyle = ''// lineStyle + "   0px   " + lineColor;
    var $tds = $('#borderTableDemo').find('tr').find('td')
    var maxTrIndex = $('#borderTableDemo').find('tr').length - 1
    var maxColIndex = $('#borderTableDemo').find('tr:eq(0)').find('td').length - 1
    if (data.isNoBorder == 1) {
      $.each($tds, function(index, td) {
        var $td = $(td)
        $td.css('border-lef', noneBorderStyle)
        $td.css('border-right', noneBorderStyle)
        $td.css('border-top', noneBorderStyle)
        $td.css('border-bottom', noneBorderStyle)
      })
    }
    if (data.isOutsideBorder != undefined && data.isNoBorder != 1) {
      var setBoderStyle = data.isOutsideBorder == 1 ? borderStyle : noneBorderStyle
      // 加外边框
      $.each($tds, function(index, td) {
        var $td = $(td)
        var p = getTdPosition($td)
        if (p.col == 0) {
          // 第一列
          $td.css('border-left', setBoderStyle)
        } else if (p.col == maxColIndex) {
          // 最后一列
          $td.css('border-right', setBoderStyle)
        }
        if (p.row == 0) {
          // 第一行
          $td.css('border-top', setBoderStyle)
        } else if (p.row == maxTrIndex) {
          // 最后一行
          $td.css('border-bottom', setBoderStyle)
        }
      })
    }
    if (resultStyleJson.isInsideBorder != undefined && data.isNoBorder != 1) {
      var setBoderStyle = data.isInsideBorder == 1 ? borderStyle : noneBorderStyle
      $.each($tds, function(index, td) {
        var $td = $(td)
        var p = getTdPosition($td)
        if (p.row != maxTrIndex) {
          // 只要不是最后一行
          $td.css('border-bottom', borderStyle)
        }
        if (p.col != maxColIndex) {
          // 只要不是最后一列
          $td.css('border-right', borderStyle)
        }
      })
    }

    // $("#borderTableDemo").css("border-style", resultStyleJson.borderlineStyle);
    // $("#borderTableDemo").css("border-width", resultStyleJson.borderlineWidth);
  }
  // 获取单元格位置,索引位置，从0开始,返回格式：{row:0,col:1}
  window.getTdPosition = function($td) {
    if ($td != undefined) {
      var table = $td.closest('table')
      var pos = {}
      var tr = $td.closest('tr')
      pos.row = table.children('tbody').children('tr').index(tr)
      pos.col = tr.children('td').index($td)
      return pos
    }
  }
  // 字体
  window.onfontFamilyChange = function(thisObj) {
    var resultCssValue = $(thisObj).val()
    var setcssName = getCssRealName('fontFamily')
    resultStyleJson['fontFamily'] = resultCssValue
    $('#textDemo').css(setcssName, resultCssValue)
  }

  // 字号
  window.onFontSizeChange = function(thisObj) {
    var resultCssValue = $(thisObj).val() == '' ? '' : $(thisObj).val() + 'pt'
    var setcssName = getCssRealName('fontSize')
    resultStyleJson['fontSize'] = resultCssValue
    $('#textDemo').css(setcssName, resultCssValue)
  }

  // 行距
  window.onlineHeightChange = function(thisObj) {
    var resultCssValue = $(thisObj).val() == '' ? '' : $(thisObj).val() + 'pt'
    var setcssName = getCssRealName('lineHeight')
    resultStyleJson['lineHeight'] = resultCssValue
    $('#textDemo').css(setcssName, resultCssValue)
  }

  // 边框

  window.getCssRealName = function(name) {
    switch (name) {
      case 'fontWeight':
        return 'font-weight'
      case 'fontStyle':
        return 'font-style'
      case 'textDecoration':
        return 'text-decoration'
      case 'textAlign':
        return 'text-align'
      case 'verticalAlign':
        return 'vertical-align'
      case 'fontSize':
        return 'font-size'
      case 'fontFamily':
        return 'font-family'
      case 'lineHeight':
        return 'line-height'
    }
    return name
  }

  $(function() {
    $('body').css('overflow', 'hidden')
    // 背景填充色
    // FUI.layuiColorpicker.render({
    //     elem: '#colorpanel'
    //     , color: '#a5a5a5'
    //     , predefine: true // 开启预定义颜色
    //     , done: function (color) {
    //         $("#backgroundcolordemo").css("background-color", color);
    //         $("#backcolor").val(color);
    //         resultStyleJson.backgroundColor = color;
    //     }
    // });
    // 小方块选中事件
    $('.colorpicker-div-inner-colorcell').click(function(i, c) {
      var background = $(this).parent().css('background')
      var color = rgbChange(background)
      $('#backgroundcolordemo').css('background-color', color)
      $('#backcolor').val(color)
      resultStyleJson.backgroundColor = color
    })
    // 边框线条选择
    $('.line-style-backcolor-div div').click(function() {
      var linestyle = $(this).attr('line-style')
      var lineSize = $(this).attr('line-size') || '1'
      $('.line-style-backcolor-div div').removeClass('line-style-selected')
      $(this).addClass('line-style-selected')
      resultStyleJson.borderlineStyle = linestyle
      resultStyleJson.borderlineWidth = lineSize + 'px'
      showBorderTableDemo()
    })
  })

  window.cleanbackColor = function() {
    $('#backgroundcolordemo').css('background-color', '')
    $('#backcolor').val('')
    resultStyleJson.backgroundColor = ''
  }

  // rgb转16进制
  window.rgbChange = function(color) {
    var rgb = color.split(',')
    var r = parseInt(rgb[0].split('(')[1])
    var g = parseInt(rgb[1])
    var b = parseInt(rgb[2].split(')')[0])
    var hex = '#' + ((r << 16) + (g << 8) + b).toString(16)
    return hex
  }
</script>
<style lang="scss" scoped>
  @import "/static/f2bpmUI/onlineExcel/stylepicker.css";
  </style>
