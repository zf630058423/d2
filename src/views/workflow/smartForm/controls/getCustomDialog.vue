<template>
  <div class="f2bpm-page-dialog-layout">
    <div>
      <div class="p10">
        自定义选择对话框：
        <el-select v-model="currentCustomDialog" size="mini" filterable placeholder="请选择" @change="comboboxChange">
          <el-option v-for="item in customDialogList" :label="item.text" :value="item.value" />
        </el-select>
        <button title="将尝试加载字段，第一次已配置的字段将不会被复盖" class="btn btn-sm btn-primary btn mr2 ml2" @click="onClickReloadField()">加载字段</button>
        <div style="margin-top:5px;">
          【是否多选：
          <el-switch v-model="data.isMulti" active-color="#87DC48" inactive-color="#DEDEDE" />
          】
          【输入框是否可编辑：
          <el-switch v-model="data.isEnableEdit" active-color="#87DC48" inactive-color="#DEDEDE" />
          】
        </div>
        <div id="common_parms_div" style="margin-top:20px;">
          【配置高级参数】
          <el-tooltip class="item" effect="dark" content="高级参数即是固定参数：[{key:,value:}]。参数名：自定义参数名；值：填写的固定值" placement="right">
            <i style="font-weight: bold" class="fa fa-question-circle-o"> </i>
          </el-tooltip>：
          <a class="btn btn-sm btn-white btn-info" @click="keyValueEditor('parms','kv', '高级参数','false')"> <i class="ace-icon fa fa-cog" />高级参数</a>
          <i class="fa fa-search cur ml10" @click="showTargetValue('parms')">查看值</i>
          <i class="fa fa-minus-circle cur ml10" @click="clearTargetValue('parms')">清除值</i>
        </div>
        <div style="margin-top:15px;">
          【表单字段参数】
          <el-tooltip class="item" effect="dark" content="当点击进触发携带指定的表单字段参数,配置结构：[{key:,value:}]。参数名：自定义参数名；值：表单控件值" placement="right">
            <i style="font-weight: bold" class="fa fa-question-circle-o"> </i>
          </el-tooltip>:
          <a class="btn btn-sm btn-white btn-info ml10" @click="keyValueEditor('formFieldParams','kv', '字段参数')"> <i class="fa fa-cog" />字段参数</a>
          <i class="fa fa-search cur ml10" @click="showTargetValue('formFieldParams')">查看值</i>
          <i class="fa fa-minus-circle cur ml10" @click="clearTargetValue('formFieldParams')">清除值</i>
        </div>
      </div>
      <div style="overflow: auto;height: 330px;">
        <table id="parmTable" class="common-grid">
          <tbody>
            <tr>
              <th>字段名称</th>
              <th>属性名</th>
              <th>绑定字段</th>
            </tr>
            <tr v-for="item in data.data">
              <td>
                <span v-html="item.title" />
              </td>
              <td>
                <span v-html="item.property" />
              </td>
              <td>
                <el-input v-model="item.field" size="mini" class="w250" />
                <i class="fa fa-search cur" @click="selectFormField(item)">选择</i> <i class="fa fa-times cur" @click="deleteRow(item.property)">删除</i>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        formDefId: '',
        customDialogList: [],
        sqlkeyArray: [{
          dataField: 'customDialogList',
          sqlkey: 'CB_CustomDialogList',
          parm: null,
          flag: null,
          change: null
        }],
        currentCustomDialog: '',
        parmsList: [],
        initailData: {},
        data: {
          isMulti: true,
          isEnableEdit: true,
          customDialog: '',
          width: null,
          height: null,
          //需要钻取的表单字段作为参数
          formFieldParams: '',
          urlParamsOption: '',
          //高级参数
          parms: {},
          data: []
        }
      };
    },
    created() {
      var that = this;
      var formDefId = Object.toQueryString('formDefId');
      var width = 801;
      var height = 451;
      var isMulti = true;
      var isEnableEdit = true;
      var initailData = {};
      var urlParamsOption = [];
      var parmsStr = Object.toQueryString('parms');
      var parms = {};
      if (parmsStr) {
        //参数中带有%符号
        parmsStr = parmsStr.replace(/%/g, '%25');
        parmsStr = decodeURIComponent(parmsStr);
        parms = eval('(' + parmsStr + ')');
        var jsonData = parms.data;
        var data = jsonData || [];
        if (data&&typeof data =="object") {
          initailData = data;
        } else if (data&&typeof data =="string") {
          initailData = eval('(' + data + ')');;
        }
      }
      that.formDefId = formDefId;
      if (initailData.formFieldParams == undefined) {
        initailData.formFieldParams = "";
      }
      that.initailData = initailData;
      that.listDataBind(that.initailData);
      FUI.Form.initailSqlKeyComboBox(that);
    },
    mounted() {
      window.myvm = this;
    },
    methods: {
      comboboxChange(code) {
        var that = this;
        that.loadFieldList(code);
      },
      onClickReloadField() {
        var that = this;
        that.loadFieldList(that.currentCustomDialog, false);
      },
      listDataBind(data) {
        var that = this;
        if (data.length == 0) return false;
        that.data = data;
        that.data.width = that.data.width || 801;
        that.data.height = that.data.height || 451;
        if (that.data.isMulti == undefined) {
          that.data.isMulti = true;
        }
        if (that.data.isEnableEdit == undefined) {
          that.data.isEnableEdit = true;
        }
        that.currentCustomDialog = data.customDialog;
      },
      loadParm(data) {
        // var data = { customDialog: "test",isMulti: isMulti,isEnableEdit:isEnableEdit,
        // data: [{ title: "参数1",property: "1", field: "1111" },
        // { title: "参数2", property: "2", field: "2222" }] };
        var that = this;
        that.data = data;
      },
      deleteRow(propertyName) {
        var that = this;
        var dataList = that.data.data.filter(a => a.property != propertyName);
        that.data.data = dataList;
      },
      loadFieldList(code, isClear) {
        var that = this;
        if (isClear == undefined) {
          isClear = true;
        }
        if (code == '') return false;
        // 请求回业的值格式 [{ fieldTitle: "字段1", fieldName: "1", propertyName: "", isKey: 1 }]
        // 返回CustomDialog实体
        var json = Object.toAjaxJson('/workflow/customDialog/', 'getResultFieldJsonByCode', {
          code: code
        });
        var data = {};
        if (json) {
          var width = json.width;
          var height = json.height;
          var urlParamsOption = null;
          if (json.urlParamsOption) {
            urlParamsOption = eval('(' + json.urlParamsOption + ')');
          }
          var configData = [];
          var fieldData = json.resultField.replace(/\\/g, '');
          if (fieldData) {
            $.each(eval('(' + fieldData + ')'), function (i, item) {
              var newItem = {
                title: item.fieldTitle,
                property: item.propertyName,
                field: ''
              };
              if (isClear == false && that.initailData && that.initailData.data && that.initailData.data.length > 0) {
                $.each(that.initailData.data, function (_, theitem) {
                  if (theitem.property == item.propertyName) {
                    newItem.field = theitem.field;
                    return false;
                  }
                });
              }
              configData.push(newItem);
            });
            data = {
              isMulti: that.data.isMulti,
              isEnableEdit: that.data.isEnableEdit,
              customDialog: that.currentCustomDialog,
              width: that.data.width,
              height: that.data.height,
              urlParamsOption: urlParamsOption,
              formFieldParams: that.data.formFieldParams,
              data: configData
            };
          }
        }
        that.loadParm(data);
      },
      selectorFormFieldParams(inputKey) {
        var that = this;
        WF.SelectorDialog.selectorFormField(that, that.formDefId, "", inputKey, "", false);
      }
      , keyValueEditor(inputId, type, title, isSelectField) {
        var that = this;
        WF.SelectorDialog.keyValueEditor(this, inputId, type, title, null, null, that.formDefId, null, isSelectField);
      }
      , showTargetValue(key) {
        var that = this;
        var msg = that.data[key];
        FUI.Window.showMsg(msg, null, 1);
      }
      , clearTargetValue(key) {
        var that = this;
        that.data[key] = "";
        FUI.Window.showMsg('清除值成功', null, 1);
      }
      , selectFormField(item) {
        var that = this;
        var parm = {
          formDefId: that.formDefId,
          isMulti: true,
          data: []
        };
        FUI.dialog(__webpath + '/workflow/selector/selectFormField/?formDefId=' + that.formDefId, '选择表单字段', parm, 450, 500, function (objectData, index, layer) {
          if (objectData.length > 0) {
            var ids = [];
            $.each(objectData, function (i, item) {
              ids.push(item.value);
            });
            item.field = ids.toString();
          } else {
            item.field = '';
          }
          layer.close(index);
        }, true);
      },
      getResult() {
        return this.data;
      }
    }

  };
  window.getResult = function () {
    return myvm.getResult();
  }
</script>