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

        <div v-if="!isCollapsed" class="f2bpm-page-left-content mt4" style="height:250px;overflow-y: auto;">
          <el-tree ref="mytree" :data="treeData" :filter-node-method="filterTreeNode" :expand-on-click-node="false" default-expand-all @node-click="onTreeSelected" />
        </div>
      </div>
      <div style="float: left; text-align: center;">
        <div style="padding-left: 10px; text-align: left;">
          <i class="fa fa-italic" aria-hidden="true" />公式运算符及函数：
        </div>
        <div class="line" style="text-align: left; width: 330px">
          <span title="或" class="calcuebtn btn btn-info" @click="addSymbol('+')">+</span>
          <span title="减" class="calcuebtn btn btn-danger" @click="addSymbol('-')">-</span>
          <span title="乖" class="calcuebtn btn btn-warning" @click="addSymbol('*')">*</span>
          <span title="除" class="calcuebtn btn btn-inverse" @click="addSymbol('/')">/</span>

          <span title="左括号" class="calcuebtn btn btn-yellow" @click="addSymbol('(')">(</span>
          <span title="右括号" class="calcuebtn btn btn-yellow" @click="addSymbol(')')">)</span>
          <hr style="margin: 0px;">
          <span tip="或者" class="calcuebtn  mathBtn btn  btn-success" @click="addSymbol('||')">或者</span>
          <span tip="并且" class="calcuebtn  mathBtn btn  btn-success" @click="addSymbol('&&')">并且</span>
          <span tip="等于" class="calcuebtn  mathBtn btn  btn-success" @click="addSymbol('==')">数字等于</span>
          <span tip="字符串等于" class="calcuebtn  mathBtn btn  btn-success" @click="addSymbol('.equalsIgnoreCase()')">字符串等于</span>
          <span tip="等于" class="calcuebtn  mathBtn btn  btn-success" @click="addSymbol('!=')">不等于</span>
          <span title="大于" class="calcuebtn  mathBtn btn  btn-success" @click="addSymbol('>')">大于</span>
          <span title="大于" class="calcuebtn  mathBtn btn  btn-success" @click="addSymbol('>=')">大于等于</span>
          <span title="小于" class="calcuebtn  mathBtn btn  btn-success" @click="addSymbol('<')">小于</span>
          <span title="小于" class="calcuebtn  mathBtn btn  btn-success" @click="addSymbol('<=')">小于等于</span>
        </div>
      </div>
      <div style="padding-left:3px;font-size:8px;line-height: 14px;clear: both;padding:1px;">
        表达式写法与数学运算常规写法一致，使用Java语法，如$A$*($B$+$C$)字段使用“##”或“$$”包起来,不支持中括号运算,变量表达式示例：#CountA#.equals(#CountB#)、#AA#>50或$AA$>50。$$括起来表达的是值类型，##括起来的表示是字符串类型
      </div>
      <div id="resultBoxList" style="width: 98%; display: block; clear: both; padding:5px;">
        <span class="cur" @click="checkMathExpre()">
          <i class="ace-icon fa fa-check   " />公式检查
        </span>
        <span class="cur" @click="clean()">
          <i class="ace-icon fa fa-remove " />清空
        </span>
        <el-input id="mathContent" v-model="data.rowmath" style="margin-top: 3px; width: 99%;   margin-bottom: 2px; font-family: Verdana;" class="mytextarea" type="textarea" :rows="1" placeholder="编辑公式" />
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        notCombieSymbol: ['+', '-', '*', '/', '>', '<', '||', '&&', '==', '>=', '<=', '!=', '.equalsIgnoreCase()'],
        calcSymbol: ['+', '-', '*', '/', '(', ')', '||', '&&', '==', '>', '<', '>=', '<=', '!=', '.equalsIgnoreCase()'],
        isCollapsed: false,
        wid: '',
        treeFilterText: '',
        treeData: [],
        data: {
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
      var wid = Object.toQueryString('wid');
      var parms = {};
      var parmsStr = Object.toQueryString('parms');
      var parms = {};
      if (parmsStr) {
        parmsStr = decodeURIComponent(parmsStr);
        parms = eval('(' + parmsStr + ')');
        var rowmath = parms.rowmath;
        that.data.rowmath = rowmath;
      }

      that.wid = wid;
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
        var treeUrl = FUI.Handlers.Selector + 'getProcessVarTreeJson/?type=All&wid=' + that.wid;
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
        if (data.attributes) {
          var json = data.attributes;
          that.addSymbol(json.varName, json.dataType);
        }
      },
      addSymbol(symbol, dataType) {
        var that = this;
        var mathContent = that.data.rowmath;
        if ($.inArray(symbol, that.calcSymbol) == -1 && symbol.indexOf('Math.') == -1) { symbol = dataType.toLowerCase() == 'number' ? '$' + symbol + '$' : '#' + symbol + '#'; }
        Object.toInsertAtCursor('mathContent', symbol);
        $("[id='mathContent']")[0].dispatchEvent(new Event('input'));
      },
      checkMathExpre() {
        var that = this;
        var formulaExpression = that.data.rowmath;
        if (formulaExpression == '') {
          FUI.Window.showMsg('公式为空请检查！');
          return false;
        }
        var bool = that.checkVarsExpress(formulaExpression);
        if (bool) {
          FUI.Window.showMsg('公式检查通过，以实际运行测试为准', null, 1);
        }
      },
      clean() {
        this.data.rowmath = '';
      },
      checkVarsExpress(formulaExpression) {
        if (formulaExpression == '') return true;
        // 检查是否存在##,)#,#(,(),##这种两个字段拼在一起的情况

        var exp = /\#{1}\#{1}/g;
        if (exp.test(formulaExpression)) {
          FUI.Window.showMsg('公式有误：公式中存在“##”情形，可能空字段或两个字段变量之间没有运算符');
          return false;
        }
        var exp = /\${1}\${1}/g;
        if (exp.test(formulaExpression)) {
          FUI.Window.showMsg('公式有误：公式中存在“$$”情形，可能空字段或两个字段变量之间没有运算符');
          return false;
        }
        var exp = /\){1}\({1}/g;
        if (exp.test(formulaExpression)) {
          FUI.Window.showMsg('公式有误：公式中存在“)(”括号之间要有运算符号');
          return false;
        }
        var exp = /\#{1}\${1}/g;
        if (exp.test(formulaExpression)) {
          FUI.Window.showMsg('公式有误：公式中存在“#$”两个字段变量之间要有运算符号');
          return false;
        }
        var exp = /\|{1}\={1}/g;
        if (exp.test(formulaExpression)) {
          FUI.Window.showMsg('公式有误：公式中存在“|=”两个连续的运算符情况');
          return false;
        }
        var exp = /\={1}\|{1}/g;
        if (exp.test(formulaExpression)) {
          FUI.Window.showMsg('表达式有误：存在“=|”两个连续的运算符情况');
          return false;
        }
        var exp = /\#{1}\#{1}/g;
        if (exp.test(formulaExpression)) {
          FUI.Window.showMsg('表达式有误：存在“$#”两个字段变量之间要有运算符号');
          return false;
        }
        exp = /\){1}\#{1}/g;
        if (exp.test(formulaExpression)) {
          FUI.Window.showMsg('表达式有误：存在“)#”括号与字段之间要有运算符号');
          return false;
        }
        exp = /\){1}\${1}/g;
        if (exp.test(formulaExpression)) {
          FUI.Window.showMsg('表达式有误：存在“)$”括号与字段之间要有运算符号');
          return false;
        }
        exp = /\${1}\({1}/g;
        if (exp.test(formulaExpression)) {
          FUI.Window.showMsg('表达式有误：存在“$(”括号与字段之间要有运算符号');
          return false;
        }

        exp = /\#{1}\({1}/g;
        if (exp.test(formulaExpression)) {
          FUI.Window.showMsg('表达式有误： 存在“#(”，字段后面的括号要有运算符号');
          return false;
        }
        exp = /\({1}\){1}/g;
        if (exp.test(formulaExpression)) {
          FUI.Window.showMsg('表达式有误 存在空的括号“()”');
          return false;
        }
        exp = /\#{1}\#{1}/g;
        if (exp.test(formulaExpression)) {
          FUI.Window.showMsg('表达式有误： 存在“##”，字段间要有运算符号');
          return false;
        }
        if (!validateSymbolExpress(formulaExpression)) {
          return false;
        }
        return true;
      },
      validateSymbolExpress(formulaExpression) {
        if (formulaExpression == '') return true;
        var n = that.notCombieSymbol.length;
        for (var i = 0; i < n; i++) {
          var me = that.notCombieSymbol[i];
          for (var j = 0; j < n; j++) {
            var str = me + that.notCombieSymbol[j];
            if (formulaExpression.indexOf(str) > -1) {
              FUI.Window.showMsg('表达式有误： 存在“' + str + '”两个连续的运算符号，请修正');
              return false;
            }
          }
        }
        var firstChar = formulaExpression.substr(0, 1);
        if ($.inArray(firstChar, that.notCombieSymbol) > -1) {
          FUI.Window.showMsg('表达式有误： 不能以“' + firstChar + '”开头');
          return false;
        }
        firstChar = formulaExpression.substr(0, 2);
        if ($.inArray(firstChar, that.notCombieSymbol) > -1) {
          FUI.Window.showMsg('表达式有误： 不能以“' + firstChar + '”开头');
          return false;
        }
        return true;
      },
      getResult() {
        var that = this;
        if (this.data.rowmath == '') {
          return '';
        }
        return this.data.rowmath;
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
    min-width: 55px;
    display: inline-block;
    border: 2px solid #ddd;
    font-size: 25px;
    margin: 3px;
    height: 35px;
    line-height: 35px;
    text-align: center;
    vertical-align: middle;
    cursor: pointer;
  }

  .mathBtn {
    font-size: 15px;
  }
</style>