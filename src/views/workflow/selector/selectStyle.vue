<template>
  <div class="f2bpm-page-layout p3">
    <el-tabs v-model="activeName">
      <el-tab-pane label="字体" name="first">
        <div class="layui-tab-item layui-show">
          <fieldset class="fieldset" style="width:90%;">
            <legend class="legend-left">文本对齐方式</legend>
            <div id="btnaligns" style="padding-left:15px;">
              <button id="textAlignLeft" title="加粗" class="layui-btn layui-btn-primary layui-btn-sm" @click="setStyle('font-weight', 'bold', '')"><i class="fa fa-bold" /></button>
              <button id="textAlignLeft" title="倾斜" class="layui-btn layui-btn-primary layui-btn-sm" @click="setStyle('font-style', 'italic', '')"><i class="fa fa-italic" /></button>
              <button id="textAlignLeft" title="下划线" class="layui-btn layui-btn-primary layui-btn-sm" @click="setStyle('text-decoration', 'underline', '')"><i class="fa fa-underline" /></button>
              <button id="textAlignLeft" title="上划线" class="layui-btn layui-btn-primary layui-btn-sm" @click="setStyle('text-decoration', 'overline ', '')"><i class="fa fa-underline fa-rotate-180" /></button>
              <button id="textAlignLeft" title="删除线" class="layui-btn layui-btn-primary layui-btn-sm" @click="setStyle('text-decoration', 'line-through', '')"><i class="fa fa-strikethrough" /></button>
              &nbsp; &nbsp;
              <button id="textAlignLeft" title="左对齐" class="layui-btn layui-btn-primary layui-btn-sm" @click="setStyle('text-align', 'left', '')"><i class="fa fa-align-left  fa-flip-vertical" /></button>
              <button id="textAlignCenter" title="居中对齐" class="layui-btn layui-btn-primary layui-btn-sm" @click="setStyle('text-align', 'center', '')"><i class="fa  fa-align-center fa-rotate-180" /></button>
              <button id="textAlignRight" title="右对齐" class="layui-btn layui-btn-primary layui-btn-sm" @click="setStyle('text-align', 'right', '')"><i class="fa fa-align-right  fa-flip-vertical" /></button>
              &nbsp; &nbsp;
              <button id="verticalAligntop" title="顶端对齐" class="layui-btn layui-btn-primary layui-btn-sm" @click="setStyle('vertical-align', 'top', '')"><i class="fa fa-indent fa-rotate-270" /></button>
              <button id="verticalAlignmiddle" title="垂直居中" class="layui-btn layui-btn-primary layui-btn-sm" @click="setStyle('vertical-align', 'middle', '')"><i class="fa fa-navicon" /></button>
              <button id="verticalAlignbottom" title="底部对齐" class="layui-btn layui-btn-primary layui-btn-sm" @click="setStyle('vertical-align', 'bottom', '')"><i class="fa  fa-indent fa-rotate-90" /></button>
              &nbsp; &nbsp;
              <button id="verticalAlignbottom" title="清除" class="layui-btn layui-btn-primary layui-btn-sm" @click="deleteStyle('font-weight,font-style,text-decoration,text-align,vertical-align')"><i class="fa fa-trash-o" /></button>
            </div>
          </fieldset>
          <fieldset class="fieldset" style="width:90%;">
            <legend class="legend-left">字体</legend>
            <el-row style="line-height: 30px">
              <el-col :span="5">
                字体：
                <el-select v-model="data.fontFamily" size="mini" name="interest" class="textBoxMinShort" @change="onfontFamilyChange">
                  <el-option value="" />
                  <el-option label="无" value="">无</el-option>
                  <el-option label="宋体" value="SimSun" />
                  <el-option label="仿宋" value="_GB2312 FangSong_GB2312" />
                  <el-option label="楷体" value="KaiTi" />
                  <el-option label="微软雅黑" value="Microsoft YaHei" />
                  <el-option label="黑体" value="SimHei" />
                  <el-option label="新宋体" value="NSimSun" />
                  <el-option label="华文隶书" value="STLiti" />
                </el-select>
              </el-col>
              <el-col :span="5">
                字号：<el-select v-model="data.fontSize" size="mini" name="interest" class="textBoxMinShort" @change="onFontSizeChange">
                  <el-option value="" />
                  <el-option value="">无</el-option>
                  <el-option value="8">8</el-option>
                  <el-option value="9">9</el-option>
                  <el-option value="10">10</el-option>
                  <el-option value="12">12</el-option>
                  <el-option value="14">14</el-option>
                  <el-option value="16">16</el-option>
                  <el-option value="18">18</el-option>
                  <el-option value="20">20</el-option>
                  <el-option value="22">22</el-option>
                  <el-option value="24">24</el-option>
                  <el-option value="26">26</el-option>
                  <el-option value="28">28</el-option>
                  <el-option value="36">36</el-option>
                  <el-option value="48">48</el-option>
                  <el-option value="72">72</el-option>
                  <el-option value="100">100</el-option>
                  <el-option value="200">200</el-option>
                </el-select>
              </el-col>
              <el-col :span="5">
                行距：<el-select v-model="data.fontLineHeight" size="mini" name="interest" class="textBoxMinShort" @change="onlineHeightChange">
                  <el-option value="" />
                  <el-option value="">无</el-option>
                  <el-option value="8">8</el-option>
                  <el-option value="9">9</el-option>
                  <el-option value="10">10</el-option>
                  <el-option value="12">12</el-option>
                  <el-option value="14">14</el-option>
                  <el-option value="16">16</el-option>
                  <el-option value="18">18</el-option>
                  <el-option value="20">20</el-option>
                  <el-option value="22">22</el-option>
                  <el-option value="24">24</el-option>
                  <el-option value="26">26</el-option>
                  <el-option value="28">28</el-option>
                  <el-option value="36">36</el-option>
                  <el-option value="48">48</el-option>
                  <el-option value="72">72</el-option>
                  <el-option value="100">100</el-option>
                  <el-option value="200">200</el-option>
                </el-select>
              </el-col>
              <el-col :span="8">
                <span style="float: left">颜色：</span>
                <el-color-picker v-model="data.fontColor" style="float: left;margin-left: 3px;" size="mini" @change="fontFolorChange" />
              </el-col>
            </el-row>
          </fieldset>
        </div>
      </el-tab-pane>
      <el-tab-pane label="边框">
        <div class="layui-tab-item">
          <div class="line-border-div" style="height: 160px;margin-top: 3px;">
            <fieldset class="fieldset">
              <legend>边框线条</legend>
              <div class="borderpicker">
                <div class="line-style2-out-div p10" style="width:140px;border: dotted har;">
                  <div class="line-style2-backcolor-div">
                    <div>
                      <div :style="data.borderLineStyle=='none'?'background-color:#F48B0A':''" class="line-style2 line-style2-empty" line-style="empty" @click="borderLineStyleChange('none')">无</div>
                      <div :style="data.borderLineStyle=='dotted'?'background-color:#F48B0A':''" class="line-style2 line-style2-dotted" line-style="dotted" line-size="1" title="圆点虚线" @click="borderLineStyleChange('dotted')" />
                      <div :style="data.borderLineStyle=='dashed'?'background-color:#F48B0A':''" class="line-style2 line-style2-dashed" line-style="dashed" line-size="1" title="方头虚线" @click="borderLineStyleChange('dashed')" />
                      <div :style="data.borderLineStyle=='solid'?'background-color:#F48B0A':''" class="line-style2 line-style2-solid" line-style="solid" line-size="1" title="实线" @click="borderLineStyleChange('solid')" />
                    </div>
                  </div>
                </div>
              </div>
            </fieldset>
          </div>
          <div class="line-border-rightbox-div" style="width: 530px;margin-left: 10px;">
            <fieldset class="fieldset" style="height: 158px;">
              <legend class="legend-left">设置</legend>
              <div class="presets-style">
                <el-row :gutter="10">
                  <el-col :span="8">
                    <div class="p5 tl ml10">边框宽度</div>
                    <el-input-number v-model="data.borderWidth" size="mini" :min="0" :max="99" label="边框宽度" />
                  </el-col>
                  <el-col :span="4">
                    <div class="p5 tl">边框颜色</div>
                    <el-color-picker v-model="data.borderLineColor" style="float: left;margin-left: 3px;" size="small" />
                  </el-col>
                  <el-col :span="9">
                    <div class="p5 tl">设置边框：</div>
                    <el-select v-model="data.border" size="small" @change="borderChange">
                      <el-option label="请选择" value="" />
                      <el-option label="左边框" value="border-left" />
                      <el-option label="右边框" value="border-right" />
                      <el-option label="上边框" value="border-top" />
                      <el-option label="下边框" value="border-bottom" />
                      <el-option label="全边框" value="border" />
                      <el-option label="无边框" value="none" />
                    </el-select>
                  </el-col>
                </el-row>
              </div>
            </fieldset>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="填充" name="fourth">
        <div class="layui-tab-item" style=" line-height:32px;">
          <el-row>
            <el-col :span="9">
              设置为无颜色<br>
              <button class="layui-btn layui-btn-primary layui-btn-fluid grayborder" style="width:252px;height:25px;line-height:20px;border: 1px solid #333; background-color:#FFFFFF;  " @click="deleteStyle('background-color')">
                无颜色
              </button>
            </el-col>
            <el-col :span="15">
              选择填充颜色<br>
              <el-color-picker v-model="data.backgroundColor" style=" margin-right: 30px;" size="small" @change="backgroundColorChange" />
            </el-col>
          </el-row>

        </div>
      </el-tab-pane>
    </el-tabs>
    <div style="padding:7px;">
      <el-input v-model="content" type="textarea" :rows="2" placeholder=" 编辑为Style样式内容，如：border: 1px solid #DDDDDD;" />
    </div>
    <div style="padding:7px;">
      只能填写style样式内容，注意使用标准写法，如：border: 1px solid #DDDDDD;margin: 10px; padding: 10px; <span class="red fa fa-minus-circle fr cur" @click="clearnEmpty">清空</span>
    </div>

    <fieldset class="fieldset" style="width:98%;">
      <legend>预览</legend>
      <div id="btnaligns" style="margin:5px;">
        <table style="width:100%;">
          <tr>
            <td id="textDemo" :style="'width:98%;height:50px;'+content"> AbBbCcYyZz中文</td>
          </tr>
        </table>
      </div>
    </fieldset>
  </div>
</template>

<script>
  export default { data() {
      return {
        activeName: 'first',
        content: '',
        data: {
          fontFamily: '',
          fontSize: '',
          fontLineHeight: '',
          fontColor: '',

          borderLineColor: '#EEEEEE',
          borderWidth: 1,
          borderLineStyle: 'solid',

          backgroundColor: ''

        }
      }
    },
    created() {
      var that = this
      var parmsStr = Object.toQueryString('parms')
      var parms = {}
      if (parmsStr) {
        parmsStr = decodeURIComponent(parmsStr)
        parms = eval('(' + parmsStr + ')')
      }
      var content = parms.data || ''
      that.content = content
    },
     mounted() {
      window.myvm = this
    },
    methods: {
      // 删除Key样式
      deleteStyle(removekeys) {
        var that = this
        if (!removekeys) {
          return false
        }
        var removekeysArr = removekeys.split(',') || []
        var arr = that.content.split(';')
        var newArr = []
        $.each(arr, function(i, item) {
          if (!item) {
            return true
          }
          var itemKey = item.split(':')[0]
          if ($.inArray(itemKey, removekeysArr) != -1) {
            return true
          }
          newArr.push(item)
        })
        var newStyle = ''
        $.each(newArr, function(i, item) {
          newStyle += item + ';'
        })
        that.content = newStyle
      },
      // value为完整的样式项如：color:red
       appendStyle(key, value, removekeys) {
        var that = this
        var border_fourSide = ['border-left', 'border-right', 'border-top', 'border-bottom']
        var removekeysArr = removekeys && removekeys.split(',') || []
        if (that.content == '') {
          that.content = value + ';'
        } else {
          var arr = that.content.split(';')
          var newArr = []
          // 过滤掉旧的样式项
          $.each(arr, function(i, item) {
            if (!item) {
              return true
            }
            var itemKey = item.split(':')[0]
            console.info(itemKey)
            if ($.inArray(itemKey, removekeysArr) != -1) {
              return true
            }
            if (key == 'border') {
              // 排除单独的四边
              if (itemKey != key && $.inArray(itemKey, border_fourSide) == -1) {
                newArr.push(item)
              }
            } else if ($.inArray(key, border_fourSide) > -1) {
              // 排除全边
              if (itemKey != key && itemKey != 'border') {
                newArr.push(item)
              }
            } else if (itemKey != key) {
              newArr.push(item)
            }
          })
          newArr.push(value)
          var newStyle = ''
          $.each(newArr, function(i, item) {
            newStyle += item + ';'
          })
          that.content = newStyle
        }
      },
       setStyle(key, value, removekeys) {
        var that = this
        var itemCss = key + ':' + value
        that.appendStyle(key, itemCss, removekeys)
      },

       onFontSizeChange(v) {
        var that = this
        if (v == '') {
          return false
        }
        var key = that.getCssRealName('fontSize')
        var style = key + ':' + v + 'px'
        that.appendStyle(key, style)
      },
       onlineHeightChange(v) {
        var that = this
        if (v == '') {
          return false
        }
        var key = that.getCssRealName('lineHeight')
        var style = key + ':' + v + 'px'
        that.appendStyle(key, style)
      },
       fontFolorChange(v) {
        var that = this
        if (v == '') {
          return false
        }
        var key = 'color'
        var style = key + ':' + v + ''
        that.appendStyle(key, style)
      },
       textAlignChange(v) {
        var that = this
        if (v == '') {
          return false
        }
        var key = that.getCssRealName('textAlign')
        var style = key + ':' + v + ''
        that.appendStyle(key, style)
      },
       backgroundColorChange(v) {
        var that = this
        if (v == '') {
          return false
        }
        var key = 'background-color'
        var style = key + ':' + v + ''
        that.appendStyle(key, style)
      },
       borderLineStyleChange(v) {
        var that = this
        that.data.borderLineStyle = v
      },
       borderChange(v) {
        var that = this
        if (v == 'none' || that.data.borderLineStyle == 'none') {
          v = 'border-left,border-right,border-top,border-bottom,border'
          that.deleteStyle(v)
          return false
        }
        if (v == '') {
          return false
        }
        var key = v
        var style = key + ':' + that.data.borderLineStyle + ' ' + that.data.borderWidth + 'px ' + that.data.borderLineColor
        that.appendStyle(key, style)
      },
       onfontFamilyChange(v) {
        var that = this
        var key = that.getCssRealName('fontFamily')
        var style = key + ':' + v + ''
        that.appendStyle(key, style)
      },
       clearnEmpty() {
        var that = this
        that.content = ''
      },
       getCssRealName(name) {
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
      },
       getResult() {
        return this.content
      }
    }
  }
  window.getResult = function() {
    return myvm.getResult()
  }
</script>
<style>
  .demo {
    height: 150px;
    width: 400px;
  }
</style>
<style lang="scss" scoped>
  @import "/static/f2bpmUI/onlineExcel/stylepicker.css";
</style>
