<template>
  <div class="f2bpm-page-dialog-layout">
    <div>
      <div class="p10">
        自定义选择器：
        <el-select v-model="currentselectorName" size="mini" filterable placeholder="请选择" @change="comboboxChange">
          <el-option v-for="item in selectorNameList" :label="item.text" :value="item.value" />
        </el-select>
        <a title="将尝试加载字段，第一次已配置的字段将不会被复盖" class="fa fa-refresh  ml2 red" @click="onClickReloadField()">加载字段</a>
        <div style="margin-top:5px;">
          【是否多选：
          <el-switch v-model="data.isMulti" active-color="#87DC48" inactive-color="#DEDEDE" />
          】
          【输入框是否可编辑：
          <el-switch v-model="data.isEnableEdit" active-color="#87DC48" inactive-color="#DEDEDE" />
          】
        </div>
        <div id="common_parms_div" style="margin-top:5px; margin-bottom: 10px;">
          【配置高级参数】
          <el-tooltip class="item" effect="dark" content="高级参数即是固定参数：[{key:,value:}]。参数名：自定义参数名；值：填写的固定值" placement="right">
            <i style="font-weight: bold" class="fa fa-question-circle-o"> </i>
          </el-tooltip>：
          <a class="btn btn-sm btn-white btn-info" @click="keyValueEditor('parms','kv', '高级参数','false')"> <i class="ace-icon fa fa-cog" />高级参数</a>
          <i class="fa fa-search cur ml10" @click="showTargetValue('parms')">查看值</i>
          <i class="fa fa-minus-circle cur ml10" @click="clearTargetValue('parms')">清除值</i>
        </div>
        <div class="font10 mt2">注意：不需要回绑的字段请将其删除</div>
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
        selectorNameList: [],
        sqlkeyArray: [{
          dataField: 'selectorNameList',
          sqlkey: 'CB_SelectorDailog',
          parm: null,
          flag: null,
          change: null
        }],
        currentselectorName: '',
        parmsList: [],
        data: {
          parms: "",
          isMulti: true,
          isEnableEdit: true,
          selectorName: '',
          urlParamsOption: null,
          data: []
        }
      };
    },
    created() {
      var that = this;
      var parmsStr = Object.toQueryString('parms');
      var parms = {};
      if (parmsStr) {
        parmsStr = decodeURIComponent(parmsStr);
        parms = eval('(' + parmsStr + ')');
      }
      var formDefId = Object.toQueryString('formDefId');
      var width = 801;
      var height = 451;
      var isMulti = true;
      var isEnableEdit = true;
      var initailData = {};
      var urlParamsOption = null;
      // 结果格式：{selectorName:"", isEnableEdit:true, isMulti: true,data:[{text:value:field:}]}
      var jsonData = parms.data;
      var data = jsonData || [];
      if (data) {
        initailData = data;
      }
      that.formDefId = formDefId;
      that.initailData = initailData;
      that.listDataBind(initailData);
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
        that.loadFieldList(that.currentselectorName, false);
      },
      listDataBind(data) {
        var that = this;
        if (data.length == 0) return false;
        that.data = data;
        if (that.data.isMulti == undefined) {
          that.data.isMulti = true;
        }
        if (that.data.isEnableEdit == undefined) {
          that.data.isEnableEdit = true;
        }
        that.currentselectorName = data.selectorName;
      },
      loadParm(data) {
        // var data = { selectorName: "test",isMulti: isMulti,isEnableEdit:isEnableEdit,
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
        // //请求回业的值格式[{"title":"1","property":"1"},{"title":"454","property":"2"},{"title":"4","property":"4"}]
        var json = Object.toAjaxJson('/workflow/selectorDailog/', 'getConfKeyJsonByMethod', {
          selectorName: code
        });
        var data = {};
        if (json) {
          var configData = [];
          var fieldData = typeof json === 'string' ? json.resultField.replace(/\\/g, '') : json;
          if (fieldData) {
            var data = typeof json === 'string' ? eval('(' + fieldData + ')') : fieldData;
            $.each(data, function (i, item) {
              var newItem = {
                title: item.title,
                property: item.property,
                field: ''
              };
              if (isClear == false && that.initailData && that.initailData.data && that.initailData.data.length > 0) {
                $.each(that.initailData.data, function (_, theitem) {
                  if (theitem.property == item.property) {
                    isExist = true;
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
              selectorName: that.currentselectorName,
              urlParamsOption: that.data.urlParamsOption,
              data: configData
            };
          }
        }
        that.loadParm(data);
      },
      keyValueEditor(inputId, type, title, isSelectField) {
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