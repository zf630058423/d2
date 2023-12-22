<template>
  <div class="f2bpm-page-dialog-layout">
    <div id="box">
      <div style="float: left; text-align: center;border:solid 1px #BCC2CD ">
        <div class="f2bpm-panel-head">
          <div v-if="!isCollapsed" class="f2bpm-left-search-div">
            <el-input v-model="treeFilterText" class="left-htead-treeFilterText-box" size="small" clearable :placeholder="$t('enterKey')" autocomplete="off" prefix-icon="el-icon-search" />
          </div>
          <div style=" float: right;line-height:35px;padding-right: 5px;">
            <i v-if="!isCollapsed" :title="$t('refresh')" class="fa fa-refresh  cur mr10 font12 " @click="loadTree()" />
            <i title="收起/展开" :class="rotateIcon" @click="collapsedSider" />
          </div>
        </div>

        <div v-if="!isCollapsed" class="f2bpm-page-left-content" style="height:250px;">
          <el-tree ref="mytree" :data="treeData" :filter-node-method="filterTreeNode" :expand-on-click-node="false" default-expand-all @node-click="onTreeSelected" />
        </div>
      </div>
      <div style="float: left; text-align: center;">
        <div style="padding-left: 10px; text-align: left;">
          <i class="fa fa-italic" aria-hidden="true" />公式运算符及函数：
        </div>
        <div class="line" style="text-align: left; width: 500px;height: 275px;">
          <span title="加" class="calcuebtn btn btn-sm btn-default" @click="addSymbol('+')">+</span>
          <span title="减" class="calcuebtn btn btn-sm btn-default" style="line-height:15px"  @click="addSymbol('-')">-</span>
          <span title="乖" class="calcuebtn btn  btn-sm  btn-default" style="line-height:30px" @click="addSymbol('*')">*</span>
          <span title="除" class="calcuebtn btn  btn-sm  btn-default" style="font-size: 18px;"  @click="addSymbol('/')">/</span>
          <span title="左括号" class="calcuebtn btn  btn-sm  btn-default" style="font-size: 18px;"  @click="addSymbol('(')">(</span>
          <span title="右括号" class="calcuebtn btn  btn-sm  btn-default" style="font-size: 18px;" @click="addSymbol(')')">)</span>
          <hr style="margin: 0px;">
          <span tip="求子表某列的合计" class="calcuebtn    mathBtn btn  btn-sm   btn-default" @click="addSymbol('MyMath.sum()')">sum(x)</span>
          <span tip="x的y次方" class="calcuebtn    mathBtn btn  btn-sm  btn-default" @click="addSymbol('Math.pow(x,y)')">x^y</span>
          <span tip="y的平方根" class="calcuebtn    mathBtn btn  btn-sm  btn-default" @click="addSymbol('Math.sqrt()')">sqrt(y)</span>
          <span tip="求x的绝对数" class="calcuebtn    mathBtn btn  btn-sm  btn-default" @click="addSymbol('Math.abs()')">abs(x)</span>
          <span tip="x的正弦值" class="calcuebtn    mathBtn btn  btn-sm  btn-default" @click="addSymbol('Math.sin()')">sin(x)</span>
          <span tip="x的余弦值" class="calcuebtn    mathBtn btn  btn-sm  btn-default" @click="addSymbol('Math.cos()')">cos(x)</span>
          <span onclick="addSymbol('Math.ceil()')" tip="x向上取整计算，它返回的是大于或等于函数参数，并且与之最接近的整数。" class="calcuebtn     mathBtn btn   btn-sm  btn-default" @click="addSymbol('Math.floor()')">ceil(x)</span>
          <span tip="把X数字四舍五入为最接近的整数" class="calcuebtn  mathBtn    btn   btn-sm  btn-default" @click="addSymbol('Math.round()')">round(x)</span>
          <div style="line-height:30px">公式说明：多则运算公式写法与数学运算正常写法一致 A*(B+C)，只是字段使用“[]”包起来,不支持中括号运算,公式示例：[A]*([B]+[C]) 或Math.sqrt([A]*([B]+[C]))或[A]*([B]+Math.sqrt([C]))</div>
        </div>
      </div>
      <div id="resultBoxList" style="width: 100%; display: block; clear: both; padding: 3px 10px 3px 3px; margin-top: 3px; ">
        <!--  <span class="cur" @click="checkMathExpre()">
          <i class="ace-icon fa fa-check   " />公式检查
        </span> -->
        <span class="cur  red" @click="clean()">
          <i class="fa fa-minus-circle" />清空
        </span>
        <el-checkbox v-model="data.formulaType" size="mini" true-label="string" false-label="number" style="margin-right: 5px;"><span style="font-size: 12px">值为字符串</span></el-checkbox>
        <el-checkbox v-model="data.isCapitalAmount" size="mini" true-label="1" false-label="0" style="margin-right: 15px;"><span style="font-size: 12px">值为大写金额</span></el-checkbox>
        <el-checkbox v-model="data.isHoursCalc" size="mini" true-label="1" false-label="0" style="margin-right: 15px;"><span style="font-size: 12px">小时运算</span></el-checkbox>

        数值小数位
        <el-input-number v-model="data.digitlen" size="mini" style="width: 100px;" :min="0" :max="16" label="小数位" />

        <el-input id="mathContent" v-model="data.rowmath" style="width: 100%; margin-top: 2px;   margin-bottom: 2px; font-family: Verdana;" class="mytextarea" type="textarea" :rows="2" placeholder="编辑公式" />
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        isCollapsed: false,
        formDefId: '',
        treeFilterText: '',
        treeData: [],
        data: {
          formulaType: 'number',
          isCapitalAmount: '0',
          isHoursCalc: '0',
          // 保留小数位
          digitlen: 2,
          rowmath: ''
        }
      };
    }, computed: {
      rotateIcon() {
        return this.isCollapsed ? 'icon icon-arrow-right-bold cur' : 'icon icon-arrow-left-bold cur';
      }
    }, watch: {
      treeFilterText(val) {
        this.$refs.mytree.filter(val);
      }
    },
    created() {
      var that = this;
      var formDefId = Object.toQueryString('formDefId');
      var parms = {};
      var isCapitalAmount = '';
      var isHoursCalc = '';
      var digitlen = 2;
      var rowmath = '';
      var formulaType = '';
      var calcSymbol = ['+', '-', '*', '/', '(', ')'];
      var parmsStr = Object.toQueryString('parms');
      var parms = {};
      if (parmsStr) {
        parmsStr = decodeURIComponent(parmsStr);
        parms = eval('(' + parmsStr + ')');
      }
      if (parms != '') {
        rowmath = parms.rowmath;
        formulaType = parms.formulaType || 'number';
        isCapitalAmount = parms.isCapitalAmount || '0';
        isHoursCalc = parms.isHoursCalc || '0';
        if (parms.digitlen == undefined) {
          digitlen = 2;
        } else {
          digitlen = parms.digitlen;
        }
      }
      that.calcSymbol = calcSymbol;
      that.formDefId = formDefId;
      that.data.formulaType = formulaType;
      that.data.isCapitalAmount = isCapitalAmount;
      that.data.isHoursCalc = isHoursCalc;
      that.data.digitlen = digitlen;
      that.data.rowmath = rowmath;
      that.loadTree();
    },
    mounted() {
      window.myvm = this;
      window.autoPageHeight();
    },
    methods: {
      collapsedSider() {
        this.isCollapsed = !this.isCollapsed;
      },
      filterTreeNode(value, data) {
        if (!value) return true;
        return data.title.indexOf(value) !== -1;
      },
      loadTree() {
        var that = this;
        var treeUrl = FUI.Handlers.SmartFormHandler + 'getBoTreeJsonByFormDefId/?isNeedField=true&formDefId=' + that.formDefId;
        Object.toAjaxJson(treeUrl, null, null, true, null, function (res) {
          if (res.success) {
            that.treeData = res.data;
            var msg = res.msg;
          } else {
            FUI.Window.showMsg(that, res.msg);
          }
        });
      },
      onTreeSelected(data, treeNode, thisObj) {
        var that = this;
        var fieldName = data.id;
        if (data.attributes) {
          var json = data.attributes;
          if (json.type != 'field') {
            return false;
          }
        }
        that.addSymbol(fieldName);
      },
      addSymbol(symbol) {
        var that = this;
        var mathContent = that.data.rowmath;
        if ($.inArray(symbol, that.calcSymbol) == -1 && symbol.indexOf('Math.') == -1) { symbol = '[' + symbol + ']'; }
        Object.toInsertAtCursor('mathContent', symbol);
        $("[id='mathContent']")[0].dispatchEvent(new Event('input'));
        // $("#mathContent").val(mathContent)
      },
      checkMathExpre() {
        var that = this;
        var formulaExpression = that.data.rowmath;
        if (formulaExpression == '') {
          FUI.Window.showMsg('公式为空请检查！');
          return false;
        }
        var bool = FUI.F2Grid.math.checkMath(formulaExpression);
        if (bool) {
          FUI.Window.showMsg('公式检查通过，以实际运行测试为准', null, 1);
        }
      },
      clean() {
        this.data.rowmath = '';
      },
      getResult() {
        var that = this;
        if (this.data.rowmath == '') {
          return '';
        }
        return JSON.stringify(that.data).replace(/\"/g, "'");
      }
    }

  };
  window.getResult = function () {
    return myvm.getResult();
  }
</script>
<style type="text/css">
  #box {
    border: 1px solid #ccc;
    padding: 5px;
    width: 98%;
    overflow: hidden;
  }

  /*禁止为所有被激活的输入框添加边框,此样式可去除google浏览器默认加边框*/
  *:focus {
    outline: none;
  }

  .calcuebtn {
    display: inline-block;
    border: 1px solid #ddd;
    font-size: 25px;
    line-height: 20px;
    height: 30px;
    margin: 5px;
    min-width: 50px;
    text-align: center;
    vertical-align: middle;
    cursor: pointer;
  }

  .mathBtn {
    font-size: 15px;
    width: 80px;
  }
</style>
