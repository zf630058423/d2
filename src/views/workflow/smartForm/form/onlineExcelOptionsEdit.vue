<template>
  <div class="f2bpm-page-layout" style="padding: 4px;">
    <el-tabs value="图片打印设置">
      <el-tab-pane label="图片打印设置" name="图片打印设置">
        <div class="pl5" style="height: 380px;">
          <legend style="font-size: 12px; margin: 0px;"><i class="fa fa-file-o" />设置打印图片大小</legend>
          <div class="p10">
            <el-row style="margin: 5px;line-height: 40px;">
              <el-col :span="5">
                <el-input clearable v-model="selectedField.title" size="mini" style="width:98%;" placeholder="字段标题" />
              </el-col>
              <el-col :span="8">
                <el-input clearable v-model="selectedField.name" size="mini" style="width: 98%;" placeholder="字段全名" />
              </el-col>
              <el-col :span="11">
                <el-input clearable v-model="selectedField.width" size="mini" style="width:80px;margin-right: 2px;" placeholder="宽度px" />
                px
                <el-input clearable v-model="selectedField.height" size="mini" style="width:80px;" placeholder="高度px" /> px
                <a href="javascript:void(0)" @click="selectorFormField('name', 'title',true,'selectedField')"><i class="fa fa-search" />选择 </a>
              </el-col>
            </el-row>
            <div class="mb10">
              <a href="javascript:void(0)" class="btn btn-sm btn-primary ml3" @click="saveAddField()"><i class="fa fa-save" />添加保存 </a>

            </div>
            <span class="cube bg-blue mb5" style="display: block;line-height:24px; height: 30px;" v-for="item in data.printImgSet.ruleParams">
              <i class="fa fa-remove cur" @click="deleteImgField(item)">删除</i> 【{{item.fieldTitle}}】【字段名：{{item.fieldName}}】【宽：{{item.width}}px】【高：{{item.height}}px】</span>
          </div>

        </div>
      </el-tab-pane>
      <el-tab-pane label="打印设置" name="打印设置">
        <div class="pl5" style="height: 380px;">
          <legend style="font-size: 12px; margin: 0px;"><i class="fa fa-square" />整个表格宽度</legend>
          <div class="p10">
            整个表格宽度
            <el-input-number v-model="data.printArea.ruleParams.excelWidth"  size="small" :min="0" :max="4000" label="整个表格宽度" />px
            <div class="font10 mt4" style="line-height:25px"><em>说明：表格的宽度为必填项，单位px。"0"为默认值,纵向打印使用"0"默认值；<br>一般横向打印时才需要设置“表格宽度”,同时需要设置在"200"以上才有效,A4纸的横向打印宽度具体请结合预览或打印实际效果调整。设置后需要保存打印模板。</em></div> 
          </div>
          <legend style="font-size: 12px; margin: 0px;"><i class="fa fa-square" />打印边界</legend>
          <div class="p10">
            右侧列边界列号：
            <el-input v-model="data.printArea.ruleParams.colno" size="mini" class="textBoxShort" placeholder="填写字母号" />
            下边行边界行号：
            <el-input-number v-model="data.printArea.ruleParams.rowno" size="small" :min="0" :max="2000" label="数字行号" />
            <div class="font10 mt4"><em>说明：只有边界超出时才需要设置，打印区域的边界。列号“不填写”表示列不设置，行号“0”表示行不限定。</em></div> 
          </div>
          
        </div>
      </el-tab-pane>
      <el-tab-pane label="子表明细设置" name="子表明细设置">
        <div class="pl5" style="height: 380px;">
          <legend style="font-size: 12px; margin: 0px;"><i class="fa fa-file-o" />子表明是否自动创建行</legend>
          <div class="p10">
            <el-row style="margin: 5px;line-height: 40px;">
              <el-col :span="8">
                <el-input clearable v-model="subTableIsAutoCreateRow.tableTitle" size="mini" style="width: 98%;" placeholder="子表实体标题" />
              </el-col>
              <el-col :span="8">
                <el-input clearable v-model="subTableIsAutoCreateRow.tableName" size="mini" style="width: 98%;" placeholder="子表实体名" />
              </el-col>
              <el-col :span="8">
                <el-switch v-model="subTableIsAutoCreateRow.autoCreated" :inactive-value="false" :active-value="true" active-color="#13ce66" inactive-color="#DEDEDE" />
                <a class="ml4" href="javascript:void(0)" @click="formTableSelect('tableName', 'tableTitle',true,'subTableIsAutoCreateRow')"><i class="fa fa-search" />选择子表 </a>
              </el-col>
            </el-row>
            <div class="mb10">
              <a href="javascript:void(0)" class="btn btn-sm btn-primary ml3" @click="saveAddItemSubtableIsAutoCreated()"><i class="fa fa-save" />添加保存 </a>
            </div>
            <span class="cube bg-blue mb5" style="display: block;line-height:24px; height: 30px;" v-for="item in data.printSubTableSet.ruleParams">
              <i class="fa fa-remove cur" @click="deleteSubtableIsAutoCreated(item)">删除</i> 【表标题：{{item.tableTitle}}】【子表名：{{item.tableName}}】【是否自动创建行：{{item.autoCreated==true?'是':'否'}} 】  </span>
          </div>
        </div>
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
        selectedField: {
          name: "",
          title: '',
          width: "",
          height: ""
        },
        subTableIsAutoCreateRow: {
          tableName: "", tableTitle: "", autoCreated: true
        }
        , isTemplate: 0,
        formId: '',
        formDefId: "",
        initailData: [],
        data: {
          printArea: {
            ruleTitle: '打印边界设置', ruleType: 'printArea', ruleCode: 'printArea', whenExcute: {}, ruleParams: { excelWidth:0, colno: '', rowno: 0 }
          },
          //图片打印大小设置
          printImgSet: {
            ruleTitle: '图片打印大小设置', ruleType: 'printImgSet', ruleCode: 'printImgSet', whenExcute: {}, ruleParams: []
            /*  [
              { fieldTitle: "上传图章", fieldName: "KongJian.shangChuanTuZhang", width: 200, height: "" }
            ] */
          },
          printSubTableSet: {
            ruleTitle: '子表打印设置', ruleType: 'printSubTableSet', ruleCode: 'printSubTableSet', whenExcute: {}, ruleParams: []
            /*  [
              { tableName: "", tableTitle: "", autoCreated: false}
            ] */
          }
        }
      };
    },
    computed: {},
    created() {
      var that = this;
      //打印模板自己的formId
      var formId = Object.toQueryString('formId') || '';
      var formDefId = Object.toQueryString('formDefId') || '';
      that.formId = formId;
      that.formDefId = formDefId;
      var res = Object.toAjaxJson(FUI.Handlers.SmartFormHandler, 'getFormOptionsData', { 'formId': formId, 'isTemplate': 0 });
      that.initailData = res.data || {};
    },
    mounted() {
      var that = this;
      window.myvm = that;
      that.initail();
    },
    methods: {
      closeEdit() {
        // stand:关闭编辑窗口
        FUI.Window.closeEdit();
      },
      initail() {
        var that = this;
        if (that.initailData == null || that.initailData.length == 0) {
          return false;
        }
        $.each(that.initailData, function (opttype, item) {
          if (item != null) {
            var opttype = item.ruleCode;
            if(opttype=="printArea"&&item.ruleParams.excelWidth==undefined){
              item.ruleParams.excelWidth=0;
            }
            that.data[opttype] = item;
          }
        });
      },
      validateForm(refFormName) {
        // stand:表单校验
        var success = false;
        this.$refs[refFormName].validate(valid => {
          success = valid;
        });
        return success;
      },
      collectData() {
        var that = this;
        try {
          var data = [];
          var printAreaJson = that.data.printArea;
          data.push(printAreaJson);

          var imgJson = that.data.printImgSet;
          data.push(imgJson);


          var subtableAutoJson = that.data.printSubTableSet;
          data.push(subtableAutoJson);

          var resultStr = JSON.stringify(data);
          if (resultStr == '[]') {
            return '';
          } else {
            return resultStr;
          }
        } catch (err) {
          console.info(err);
          FUI.Window.showMsg(err);
          return false;
        }
      },
      validateForm() {
        var that = this;
        var colno = that.data.printArea.ruleParams.colno;
        var result = FUI.ValidValue(colno, 'onlyBigEnglisthChar');
        if (result != '') {
          FUI.Window.showMsg(null, '右侧列边界列号：' + result);
          return false;
        }
        return true;
      },

      saveAndClose() {
        var that = this;
        if (!that.validateForm()) {
          return false;
        }
        var formOptions = that.collectData();

        var data = Object.toAjaxJson(FUI.Handlers.SmartFormHandler, 'saveFormOptions', {
          'formId': that.formId,
          'isTemplate': that.isTemplate,
          'formOptions': formOptions
        });
        if (data.success == true) {
          FUI.Window.showMsg(data.msg, null, 1, function () {
            FUI.Window.closeEdit();
          });
        } else {
          FUI.Window.showMsg(data.msg);
        }
      }
      , saveAddField() {
        var that = this;
        var arr = that.data.printImgSet.ruleParams;
        if (that.selectedField.name == '') {
          FUI.Window.showMsg2(that, "请选择图片字段");
          return false;
        }
        if (that.selectedField.width == '') {
          FUI.Window.showMsg2(that, "图片宽度不允许为空");
          return false;
        }
        var item = arr.find(a => a.fieldName == that.selectedField.name);
        if (item != null) {
          FUI.Window.showMsg2(that, "字段：" + that.selectedField.name + "已存在");
          return false;
        }
        arr.push({ fieldName: that.selectedField.name, fieldTitle: that.selectedField.title, width: that.selectedField.width, height: that.selectedField.height });
      },
      saveAddItemSubtableIsAutoCreated() {
        var that = this;
        var arr = that.data.printSubTableSet.ruleParams;
        if (that.subTableIsAutoCreateRow.tableName == '') {
          FUI.Window.showMsg2(that, "请选择子表实体");
          return false;
        }
        if (that.subTableIsAutoCreateRow.tableTitle == '') {
          FUI.Window.showMsg2(that, "子表实体标题不能为空");
          return false;
        }
        var item = arr.find(a => a.tableName == that.subTableIsAutoCreateRow.tableName);
        if (item != null) {
          FUI.Window.showMsg2(that, "子表" + that.subTableIsAutoCreateRow.tableName + "已存在");
          return false;
        }
        arr.push({ tableName: that.subTableIsAutoCreateRow.tableName, tableTitle: that.subTableIsAutoCreateRow.tableTitle, autoCreated: that.subTableIsAutoCreateRow.autoCreated });
      },
      deleteImgField(item) {
        var that = this;
        var arr = that.data.printImgSet.ruleParams;
        var deleteFieldName = item.fieldName;
        var newArr = arr.filter(a => a.fieldName != deleteFieldName);
        that.data.printImgSet.ruleParams = newArr;

      },
      deleteSubtableIsAutoCreated(item) {
        var that = this;
        var arr = that.data.printSubTableSet.ruleParams;
        var deleteName = item.tableName;
        var newArr = arr.filter(a => a.tableName != deleteName);
        that.data.printSubTableSet.ruleParams = newArr;
      }
      , selectorUserTextValue(inputKey, inputName, passParm, singleSelect, keyName) {
        var that = this;
        WF.SelectorDialog.selectorUserTextValue(that, inputKey, inputName, passParm, singleSelect, keyName, null, null, that.data.autoCirculated);
      }

      , selectorFormField(inputId, inputName, singleSelect, subDataName) {
        var that = this;
        var subObj = null;
        if (subDataName) {
          subObj = that[subDataName];
        }
        WF.SelectorDialog.selectorFormField(that, that.formDefId, null, inputId, inputName, singleSelect, subObj);
      }

      , formTableSelect(inputId, inputName, singleSelect, subDataName) {
        var that = this;
        var subObj = null;
        if (subDataName) {
          subObj = that[subDataName];
        }
        WF.SelectorDialog.formTableSelect(that, that.formDefId, false, "sub", inputId, inputName, singleSelect, subObj,"tableName");
      }
    }
  };
  window.getResult = function () {
    return myvm.getResult();
  }
</script>
<style>
  .common-FormTable td {
    text-align: left
  }
</style>