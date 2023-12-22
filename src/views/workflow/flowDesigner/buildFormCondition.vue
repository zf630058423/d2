<template>
  <div>
    <el-form ref="formRef" size="mini" :rules="formRules" :model="data" class="f2bpm-editform" label-width="120px">
      <div class="fence-box" style="width: 320px;height: 350px;">
        <div style="padding-left: 10px; text-align: left;">
          <i class="fa fa-cube" aria-hidden="true" />编辑迁移条件：
        </div>
        <div class="fence-inner-line column-height" style="width: 310px; ">
          <div class="p3">
            表单字段：
            <el-select value="" class="textBoxAutoShort" size="mini" @change="selectChange">
              <el-option label="请选择" value="" />
              <el-option v-for="item in fieldData" :key="item.columnName" :label="item.fieldTitle" :value="item" />
            </el-select>
          </div>
          <table id="table" class="common-FormTable" cellpadding="0" cellspacing="0">
            <tr>
              <td class="leftTdbg">字段名称：</td>
              <td>
                <el-input v-model="data.FieldTitle" size="mini" />

              </td>
            </tr>
            <tr>
              <td class="leftTdbg">字段编码：</td>
              <td class="pl3">
                <el-input v-model="data.FieldName" :disabled="readOnlyFieldName" size="mini" />
              </td>
            </tr>
            <tr>
              <td class="leftTdbg">比较运算符：</td>
              <td style="text-align: left;">
                <el-select v-model="data.Operator" style="width: 100%;" size="mini">
                  <el-option value=">" label="大于" />
                  <el-option value=">=" label="大于等于" />
                  <el-option value="<" label="小于" />
                  <el-option value="<=" label="小于等于" />
                  <el-option value="==" label="等于" />
                  <el-option value="!=" label="不等于" />
                  <el-option value="contain" label="包含有" />
                  <el-option value="uncontain" label="不包含有" />
                </el-select>
              </td>
            </tr>
            <tr>
              <td class="leftTdbg">比较值：</td>
              <td class="p3" style="text-align: left;">
                <el-input v-model="data.ComparValue" size="mini" />
                <div class="p3">
                  <span class="fa fa-search font12 " @click="selectSystemVars('ComparValue')">选择系统变量</span>
                </div>
              </td>
            </tr>
            <tr>
              <td class="leftTdbg">并集运算符：</td>
              <td style="padding-top: 3px;padding-bottom: 3px; text-align: left;">
                <el-select v-model="data.AndOrChar" style="width: 100%;" size="mini">
                  <el-option value="&&" label="并且" />
                  <el-option value="||" label="或者" />
                </el-select>
                <div class="mt4">
                  <span class="p10">即与下一字段条件的运算操作</span>
                </div>
              </td>
            </tr>
          </table>
        </div>
      </div>
      <div class="fence-box" style="width:80px;margin: 0px;border: 0px;padding-top: 140px; ">
        <a href="javascript:void(0);" role="button" class="btn btn-primary btn-sm mr2" @click="save()"><span>{{ currentAction=='add'?'添加':'保存' }}</span> <i class="fa  fa-arrow-right" /></a><br> <br> <a href="javascript:void(0);" title="清空左侧编辑输入，重置后可保存新增按钮" role="button" class="btn btn-primary btn-sm mr2" @click="clearLeft()"><i class="fa  fa-undo" />重置</a>
      </div>
      <div class="fence-box right-result-boxlist" style="width: 230px;height: 350px;">
        <div style="text-align: left; padding-left: 10px; margin-right: 10px;">
          <i class="fa fa-cubes" aria-hidden="true" />按钮列表(双击删除，单击修改)：
        </div>
        <div id="result-boxlist" class="right-result-boxlist fence-inner-line column-height">
          <ul id="listResult">
            <li v-for="(item,index) in resultData" class="fence-li-item" :tabIndex="index" :value="item.FieldName" :text="item.FieldTitle" title="双击删除" @click="editItem(this,item)" @dblclick="deleteItem(this,item.FieldName)">
              <input type="button" disabled="disabled" :value="index" class="fence-li-index">{{ item.FieldTitle }} {{ operatorToText(item.Operator) }} {{ item.ComparValue }} {{ andOrCharText(item.AndOrChar) }}
            </li>
          </ul>
        </div>
      </div>
      <div class="fence-button-column column-height" style="width:80px;">
        <span class="icon icon_sortup" title="向上升序" @click="UpOrderNo('up')" /> <br> <span class="icon icon_sortdown" title="向下降序" onclick="UpOrderNo('down')" />
      </div>
    </el-form>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        type: '',
        fieldSelectValue: '',
        fieldData: [],
        currentAction: 'add',
        currentEditFieldName: '',
        wid: '',
        readOnlyFieldName: false,
        // item: { OrderNum: orderNum, FieldTitle: text, FieldName: value, Operator: operator, ComparValue: comparValue, AndOrChar: andOrChar };
        resultData: [],
        index: 0,
        data: {
          FieldTitle: '',
          FieldName: '',
          Operator: '',
          ComparValue: '',
          AndOrChar: '&&',
          OrderNum: 1000
        },
        // stand:表单校验规则
        formRules: {
          FieldTitle: [
            { required: true, message: '必填项不能为空' }

          ],
          FieldName: [
            { required: true, message: '必填项不能为空' },
            { validator: FUI.Validator.englishchar }
          ],
          Operator: [
            { required: true, message: '必填项不能为空' }
          ],
          ComparValue: [
            { required: true, message: '必填项不能为空' }
          ],
          AndOrChar: [
            { required: true, message: '必填项不能为空' }
          ]
        }
      };
    },
    created: function () {
      var that = this;
      var value = [];
      var wid = Object.toQueryString('wid');
      var type = Object.toQueryString('type');
      that.wid = wid;
      that.type = type;
      if (type == 'FormField') {
        that.loadWindowparms();
      }
      var url = FUI.Handlers.SmartFormHandler;
      var res = Object.toAjaxJson(url, 'getFormFieldByWid', { wid: wid });
      if (res.success == true) {
        that.fieldData = res.data;
        that.fieldData.push({ columnName: 'approAction', fieldTitle: '审核菜单' });
      } else {
        that.fieldData.push({ columnName: 'approAction', fieldTitle: '审核菜单' });
      }
    },
    mounted() {
      window.myvm = this;
    },
    methods: {
      loadWindowparms() {
        const that = this;
        var parmsStr = Object.toQueryString('parms');
        var parms = {};
        if (parmsStr) {
          parmsStr = decodeURIComponent(parmsStr);
          parms = eval('(' + parmsStr + ')');
          if (parms.data != undefined && parms.data.length > 0) {
            that.resultData = eval('(' + parms.data + ')');
          }
        }
      },
      initailResult(data) {
        var that = this;
        index = 0;
        $.each(data, function (index, item) {
          add(item.FieldTitle, item.FieldName, null);
        });
      },
      andOrCharText(char) {
        var that = this;
        switch (char) {
          case '&&': return '并且';
          case '||': return '或者';
          default: return '';
        }
      },
      operatorToText(char) {
        var that = this;
        switch (char) {
          case '>': return '大于';
          case '>=': return '大于等于';
          case '<': return '小于';
          case '<=': return '小于等于';
          case '==': return '等于';
          case '!=': return '不等于';
          case 'contain': return '包含有';
          case 'uncontain': return '不包含有';
          case '||': return ' 或者';
          case '&&': return '并且';
          default: return '';
        }
      },
      buildJS() {
        var that = this;
        if (that.type == 'FormField') {
          var json = JSON.stringify(that.resultData);
          return json;
        }
        var des = '';
        var js = 'if(';
        var n = that.resultData.length;
        $.each(that.resultData, function (index, item) {
          var tem = "WFFormData['{0}']{1}{2}";
          var containTem = "WFFormData['{0}'].indexOf(\"{1}\"){2}-1";
          des += item.FieldTitle + that.operatorToText(item.Operator) + item.ComparValue;
          if (item.Operator != 'contain' && item.Operator != 'uncontain') {
            if (isNaN(item.ComparValue)) {
              item.ComparValue = "'" + item.ComparValue + "'";
            }
            js = js + Object.toStringFormat(tem, item.FieldName, item.Operator, item.ComparValue);
          } else {
            js = js + Object.toStringFormat(containTem, item.FieldName, item.ComparValue, item.Operator == 'contain' ? '>' : '==');
          }
          if (index != n - 1) {
            js = js + item.AndOrChar;
            des += that.operatorToText(item.AndOrChar);
          }
        });
        js += '){return true};return false;';

        return { js: js, des: des };
      },
      buildResult() {
        var that = this;
        var json = JSON.stringify(that.resultData);
        var des = '';
        var js = 'if(';
        var n = that.resultData.length;
        $.each(that.resultData, function (index, item) {
          des += item.FieldTitle + that.operatorToText(item.Operator) + item.ComparValue;
          if (index != n - 1) {
            js = js + item.AndOrChar;
            des += that.operatorToText(item.AndOrChar);
          }
        });
        return { json: json, des: des };
      },
      clearLeft() {
        var that = this;
        that.currentAction = 'add';
        $.each(that.data, function (k) {
          that.data[k] = '';
        });
      },
      cancle() {
        var that = this;
        FUI.Window.closeEdit();
      },

      actinNameState() {
        var that = this;
        if (that.currentAction == 'edit') {
          FUI.Form.setReadOnly('FieldName');
        }
      },
      save() {
        var that = this;
        var text = that.data.FieldTitle;
        var value = that.data.FieldName;
        var operator = that.data.Operator;
        var comparValue = that.data.ComparValue;
        var andOrChar = that.data.AndOrChar;
        var orderNum = that.data.OrderNum;
        if (text == '' || value == '') {
          FUI.Window.showMsg('字段不能为空');
          return false;
        }
        if (operator == '') {
          FUI.Window.showMsg('请选择比较运算符');
          return false;
        }
        if (comparValue == '') {
          FUI.Window.showMsg('比较值不能为空');
          return false;
        }
        if (andOrChar == '') {
          FUI.Window.showMsg('请选择并集运算符');
          return false;
        }
        var jsonItem = { OrderNum: orderNum, FieldTitle: text, FieldName: value, Operator: operator, ComparValue: comparValue, AndOrChar: andOrChar };
        if (that.currentAction == 'add') {
          that.add(text, value, jsonItem);
        } else {
          var tem = [];
          $.each(that.resultData, function (index, item) {
            if (item.FieldName != value) {
              tem.push(item);
            } else {
              tem.push(jsonItem);
            }
          });
          that.resultData = tem;
          // 更新
          var msg = that.currentAction == 'add' ? '添加成功' : '更新成功！';
          FUI.Window.showMsg('【' + text + '】' + msg, null, 1);
          that.clearLeft();
        }
      },
      add(text, value, jsonItem) {
        var that = this;
        // if (that.isExist(value) && that.currentAction == 'add') {
        //   FUI.Window.showMsg('【' + text + '】' + '已存在！');
        //   return false;
        // }
        if (jsonItem) {
          that.addToData(jsonItem);
        }
      },
      addToData(jsonItem) {
        var that = this;
        that.resultData.push(Object.toClone(jsonItem));
        that.clearLeft();
      },
      isExist(addValue) {
        var that = this;
        var exist = false;
        $.each(that.resultData, function (index, item) {
          if (item.FieldName == addValue) {
            exist = true;
            return true;
          }
        });
        return exist;
      },
      editItem(thisObj, item) {
        var that = this;
        that.data = Object.toClone(item);
        that.currentAction = 'edit';
        that.currentEditFieldName = item.FieldName;
        that.actinNameState();
      },
      selectSystemVars(inputId) {
        WF.SelectorDialog.selectSystemVars(this, inputId, null, true);
      },
      deleteItem(thisObj, value) {
        var that = this;
        var tem = [];
        $.each(that.resultData, function (index, item) {
          if (item.FieldName != value) {
            tem.push(item);
          }
        });
        that.resultData = tem;
        that.clearLeft();
      },
      selectChange(item) {
        var that = this;
        that.currentAction = 'add';
        var fieldName = item.columnName;
        var fieldTitle = item.fieldTitle;

        that.data.FieldTitle = fieldTitle;
        that.data.FieldName = fieldName;
        that.data.ComparValue = '';
        that.data.Operator = '==';
        that.data.AndOrChar = '&&';
        that.readOnlyFieldName = true;
      },

      clearAll() {
        var that = this;
        index = 0;
        that.resultData = [];
      },

      UpOrderNo(sort) {
        var that = this;
        Object.toUpdateOrderNo(sort, that.resultData, initailResult, currentEditFieldName, 'FieldName', 'OrderNum');
      },
      getResult() {
        var that = this;
        var result = that.type == 'FormField' ? that.buildResult() : that.buildJS();
        return result;
      }
    }
  };
  window.getResult = function () {
    return myvm.getResult();
  }
</script>
<style>
  .fence-li-item {
    padding-left: 0px !important;
  }
</style>