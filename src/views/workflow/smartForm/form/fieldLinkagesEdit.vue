<template>
  <div class="f2bpm-page-dialog-layout">
    <div style="padding: 4px; ">
      <div>
        <button class="btn  btn-minier btn-primary" @click="addCaseItem" title="添加联动值"><i class="fa fa-plus"></i> 添加</button>
      </div>
      <div :style="countGridHeight+'px;margin-bottom: 25px;overflow-y: auto;'">
        <table class="common-FormTable">
          <tr>
            <th style="width: 40px;">联动所选值</th>
            <th style="width:630px;">目标字段</th>
          </tr>
          <tr v-for="caseItem in data">
            <td class="p5 tc">
              <el-select v-if="inputCtrlType!='checkbox'&&(caseDataSourceType=='custom'||caseDataSourceType=='dic')" v-model="caseItem.case" size="mini" style="width: 150px;">
                <el-option label="请选择" value="" />
                <el-option v-for="tv in customDropData" :label="tv.text" :value="tv.value" />
              </el-select>
              <el-checkbox-group v-else-if="inputCtrlType=='checkbox'&&(caseDataSourceType=='custom'||caseDataSourceType=='dic')" v-model="caseItem.case">
                <el-checkbox v-for="(item,  index) in customDropData" :label="item.value" :key="index">{{item.text}}</el-checkbox>
              </el-checkbox-group>
              <el-input v-else placeholder="请填写联动值" v-model="caseItem.case" size="mini" style="width: 120px;">
              </el-input>
            <td>
              <div v-for="thenitem in caseItem.then" style="border: 1px  dotted #ddd;margin-bottom: 10px;margin-top: 2px;">
                <div class="p5">
                  <span class="cube bg-orange mr5">{{thenitem.fieldTitle}} ({{thenitem.fieldName}})</span>
                  <span class="fa fa-search cur" @click="selectorFormField(thenitem)">选择字段</span>
                </div>
                <div class="p5">
                  <el-switch v-model="thenitem.hidden" active-text="隐藏" inactive-text="显示" size="mini" style="margin-right: 45px;">
                  </el-switch>
                  <el-switch v-model="thenitem.write" active-text="编辑" inactive-text="只读" size="mini" style="margin-right: 45px;">
                  </el-switch>
                  <el-switch v-model="thenitem.required" active-text="必填" inactive-text="非必填" size="mini">
                  </el-switch>
                  <span @click="deleteThenItem(caseItem,thenitem)" class="fa fa-minus-circle p5 red fr cur" title="删除此联动项"> 删除</span>
                </div>
              </div>
              <div><button class="btn  btn-minier btn-default" @click="addThenItem(caseItem)"><i class="fa fa-plus cur" title="添加联动项"> 添加</i></button>
                <span @click="deleteCase(caseItem)" class="fa fa-minus-circle p5 red cur" title="删除此联动值项及所有目标字段"> 删除</span>
              </div>
            </td>
          </tr>
        </table>
      </div>

      <div class="dialogfooter">
        <el-button size="small" type="primary" @click="saveAndClose()"><i class="fa fa-save" />确定</el-button>
        <el-button id="btn_cancel" size="small" @click="closeEdit"><i class="fa fa-minus-circle" />取消
        </el-button>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        isSubtable:false,
        formDefId: "",
        fieldId: '',
        //控件类型
        inputCtrlType: "",
        caseDataSourceType: "",
        //数据字典配置类别
        configType: "",
        customDropData: [],
        //数据源类型：自定义固定值和数据字段可直接，其它使用手动填写
        dataSourceType: "",
        initailData: [],
        templateRow: { id: "", title: "", case: "", then: [{ id: "", type: "field", fieldName: "", fieldTitle: "", hidden: false, write: true, required: false }] },
        data: [
          /*  {
             id: "01", title: "办公费用", case: "办公费用", then: [
               { id: "1", type: "field", fieldName: "cost_pay.bz", fieldTitle: "备注", hidden: false, write: true, required: false },
               { id: "2", type: "field", fieldName: "cost_pay.smA", fieldTitle: "说明", hidden: false, write: true, required: true }
             ]
           },
           {
             id: "02", title: "业务费用", case: "业务费用", then: [
               { id: "3", type: "field", fieldName: "cost_pay.bz", fieldTitle: "备注", hidden: false, write: true, required: false }
             ]
           },
           {
             id: "03", title: "办公用品", case: "办公用品", then: [
               { id: "4", type: "field", fieldName: "cost_pay.bz", fieldTitle: "备注", hidden: true, write: false, required: false }
             ]
           } */
        ]
      };
    },
    computed: {
      countGridHeight() {
        return $(document).height() - 30;
      }
    },
    created() {
    },
    mounted() {
      var that = this;
      window.myvm = that;
      var fieldId = Object.toQueryString('fieldId');
      var formDefId = Object.toQueryString('formDefId');

      that.formDefId = formDefId;
      that.fieldId = fieldId;
      setTimeout(function () {
        var win = window.openerWin;
        var dataJson = win.myvm.data.fieldLinkages;
        var fieldDef = win.myvm.data;
        var datasourceData = win.myvm.datasourceData;
        that.inputCtrlType = fieldDef.inputCtrlType;
        if (datasourceData) {
          var jsonObj = datasourceData;
          that.caseDataSourceType = jsonObj.type;
          console.info(that.caseDataSourceType);
          if (jsonObj.type == 'custom') {
            that.customDropData = jsonObj.data;
          } else if (jsonObj.type == 'dic') {
            var configType = jsonObj.data;
            var configTypeDef = FUI.Data.getDicDataByConfigType(configType);
            if (configTypeDef) {
              that.customDropData = configTypeDef.data;
            }
          }
        }
        if (typeof dataJson === 'string' && dataJson) {
          console.info(dataJson);
          var dataObj = eval('(' + dataJson + ')');
          //复选情况需要转为数组
          if (that.inputCtrlType == 'checkbox' && (that.caseDataSourceType == "custom" || that.caseDataSourceType == "dic")) {
            //多选值,
            $.each(dataObj, function (i, caseItem) {
              if (caseItem.case && caseItem.case instanceof Array) {
              } else if (caseItem.case && typeof caseItem.case == "string") {
                //变成数组
                caseItem.case = caseItem.case.split(",");
              } else {
                caseItem.case = [];
              }
            });
          } else if (that.inputCtrlType == 'checkbox' && that.caseDataSourceType != "custom" && that.caseDataSourceType != "dic") {
            //设置值是输入框所以使用字符串
            $.each(dataObj, function (i, caseItem) {
              if (caseItem.case && caseItem.case instanceof Array) {
                caseItem.case = caseItem.case.toString();
              } else {
                caseItem.case = "";
              }
            });
          }
          else {
            //单选值
            $.each(dataObj, function (i, caseItem) {
              if (caseItem.case && caseItem.case instanceof Array) {
                caseItem.case = "";
              }
            });
          }
          that.data = dataObj || [];
        }
      }, 500);
    },
    methods: {
      closeEdit() {
        // stand:关闭编辑窗口
        FUI.Window.closeEdit();
      },
      addCaseItem() {
        var that = this;
        var caseItem = Object.toDeepClone(that.templateRow);
        if (that.inputCtrlType == 'checkbox' && (that.caseDataSourceType == "custom" || that.caseDataSourceType == "dic")) {
          caseItem.case = [];
        }
        caseItem.id = Object.toGuid();
        that.data.push(caseItem);
      },
      addThenItem(caseItem) {
        var that = this;
        var thenItem = Object.toDeepClone(that.templateRow.then[0]);
        thenItem.id = Object.toGuid();
        caseItem.then.push(thenItem);
      }
      , deleteCase(then) {
        var that = this;
        var tem = that.data.filter(a => a.id != then.id);
        that.data = tem;
      }
      , deleteThenItem(caseItem, thenItem) {
        var that = this;
        caseItem.then = caseItem.then.filter(t => t.id != thenItem.id);
      }
      , validateForm(refFormName) {
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
          var isOtherCheckBox = that.inputCtrlType == 'checkbox' && that.caseDataSourceType != "custom" && that.caseDataSourceType != "dic";
          var data = Object.toDeepClone(that.data);
          if (isOtherCheckBox) {
            $.each(data, function (i, caseItem) {
              //case转成数组存到数据库
              if (caseItem.case && typeof caseItem.case == "string") {
                //变成数组
                caseItem.case = caseItem.case.split(",");
              }
            });
          }
          var resultStr = JSON.stringify(data);
          if (resultStr == '[]') {
            return '';
          } else {
            return resultStr;
          }
        } catch (err) {
          FUI.Window.showMsg(that, err);
          return false;
        }
      },
      initailGeneralResult(jsonObj) {
        var that = this;
        var kvData = jsonObj.params.kvData || [];
        $.each(kvData, function (i, item) {
          that.generalKeyValueObj[item.key] = item.value;
        });
      },
      validateData() {
        var that = this;
        var isPass = true;
        var caseValue = "";

        $.each(that.data, function (i, caseItem) {
          var num = i + 1;
          if (caseItem.case == undefined || caseItem.case == "") {
            FUI.Window.showMsg("第" + num + "个值联动所选值不能为空");
            isPass = false;
            return false;
          }
          else if (caseItem.case == caseValue) {
            FUI.Window.showMsg("第" + num + "个值【" + caseItem.case + "】联动重复了");
            isPass = false;
            return false;
          }
          else if (caseItem.then.length == 0) {
            FUI.Window.showMsg("第" + num + "个值【" + caseItem.case + "】联动请添加目标字段");
            isPass = false;
            return false;
          }
          else {
            $.each(caseItem.then, function (j, thenItem) {
              if (!thenItem.fieldName) {
                FUI.Window.showMsg("第" + num + "个值【" + caseItem.case + "】联动的第" + (j + 1) + "个目标字段不能为空");
                isPass = false;
                return false;
              }
            });
            if (isPass == false) {
              return false;
            }
          }
          caseValue = caseItem.case;
        });
        return isPass;
      }
      , saveAndClose() {
        var that = this;
        if (that.validateData() == false) {
          return false;
        }

        var fieldLinkagesJson = that.collectData().replace(/\"/g, "'");
        console.info(fieldLinkagesJson);
        try {
          window.openerWin.myvm.data.fieldLinkages = fieldLinkagesJson;
          FUI.Window.closeEdit();
        } catch (err) {
        }
      },
      // 选择列
      selectorFormField(vueObj) {
        var that = this;
        WF.SelectorDialog.selectorFormField(that, that.formDefId, null, 'fieldName', 'fieldTitle', true, vueObj);
      },
      selectorUserTextValue(inputKey, inputName, passParm, singleSelect, keyName) {
        var that = this;
        WF.SelectorDialog.selectorUserTextValue(that, inputKey, inputName, passParm, singleSelect, keyName, null, null, that.data.autoCirculated);
      }
      , updateFieldValue(fieldName, newVal) {
        var that = this;
        that.data[fieldName] = newVal;
      }
    }
  }
</script>