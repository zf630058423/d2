<template>
  <div class="f2bpm-page-layout lineht20">
    <div>
      <div class="p10">
        数据操作服务：
        <el-select v-model="currentCode" size="mini" style="width: 65%;" filterable placeholder="请选择" @change="comboboxChange">
          <el-option v-for="item in selectorNameList" :label="item.text" :value="item.value" />
        </el-select>
        <button v-if="isShowBtn" title="将尝试加载字段，第一次已配置的字段将不会被复盖" class="btn btn-sm btn-primary  ml5" @click="onClickReloadField">重新加载属性</button>
        <div v-if="implType != 'Cascselect'" id="common_parms_div" style="display: block; margin-top:20px;">
          <span style="margin-right: 30px;">配置高级参数：</span>
          <a class="btn btn-sm btn-white btn-info btn-bold" @click="keyValueEditor('parms','kv', '数据服务高级参数')"> <i class="ace-icon fa fa-pencil     " />高级参数</a>
        </div>
        <div style="margin-top:15px;">
          携带表单字段参数
          <el-tooltip class="item" effect="dark" content="当点击进触发携带指定的表单字段参数,配置结构：[{key:,value:}]。参数名：自定义参数名；值：表单控件值" placement="right">
            <i style="margin-left: 5px;font-weight: bold" class="fa fa-question-circle-o"> </i>
          </el-tooltip>：
          <a class="btn btn-sm btn-white btn-info" @click="keyValueEditor('formFieldParams','kv', '字段参数')"> <i class="fa fa-cog" />字段参数</a>
          <i class="fa fa-search cur ml2" @click="showTargetValue('formFieldParams')">查看值</i>
          <i class="fa fa-minus-circle cur ml2" @click="clearTargetValue('formFieldParams')">清除值</i>

        </div>
      </div>
      <div v-if="isShowFieldBind" style="overflow: auto;height: 330px;">
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

                <el-select v-if="apply=='assemblyEvent'" v-model="item.field" size="mini">
                  <el-option label="请选择" value="" />
                  <el-option label="流程实例ID" value="wiid" />
                  <el-option label="当前流程状态" value="procInstState" />
                  <el-option label="事件触发所在节点名称" value="eventActivityName" />
                  <el-option label="当前节点及待办处理人" value="currentActivityAndTodoUsers" />
                  <el-option label="流程实例JSON" value="procInstJson" />
                  <el-option label="表单数据JSON" value="onlineFormJson" />
                </el-select>

                <el-select v-if="apply=='actor'" v-model="item.field" size="mini">
                  <el-option label="请选择" value="" />
                  <el-option label="用户姓名" value="realName" />
                  <el-option label="用户ID" value="userId" />
                  <el-option label="组织ID" value="orgId" />
                </el-select>
                <i class="fa fa-times cur" @click="deleteRow(item.property)">删除</i>
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
        isShowBtn: true,
        apply: '',
        isShowFieldBind: true,
        implType: '',
        wid:'',
        selectorNameList: [],
        sqlkeyArray: [{
          dataField: 'selectorNameList',
          sqlkey: 'CB_DataService',
          parm: '',
          flag: null,
          change: null
        }],
        currentCode: '',
        currentTitle: '',
        parmsList: [],
        // 格式：{title:"节点参与者数据服务","code":"WorkflowActivityActor",formFieldParams:"","parms":"","data":[{"title":"标题","property":"realName","field":"value"},{"title":"值","property":"userId","field":"value"}]}
        data: {
          formFieldParams: "",
          parms: [],
          title: '',
          code: '',
          data: []
        }
      };
    },
    created() {
      var that = this;
      var parmsStr = Object.toQueryString('parms');
      var implType = Object.toQueryString('implType') || '';
      // apply:应用的类型，前后置事件 assemblyEvent，参与者actor，对应的绑定字段参数不同。l
      var apply = Object.toQueryString('apply') || '';
      var wid = Object.toQueryString('wid') || '';
      var initailData = {};
      var parms = {};
      if (parmsStr) {
        parmsStr = decodeURIComponent(parmsStr);
        parms = eval('(' + parmsStr + ')');
      }
      var data = parms || [];
      if (data) {
        initailData = data;
      }
      that.wid=wid;
      that.apply = apply;
      that.implType = implType;
      that.sqlkeyArray[0].parm = 'ImplType:' + implType;
      that.initailData = initailData;
      FUI.Form.initailSqlKeyComboBox(that);
      that.listDataBind(initailData);
    },
    mounted() {
      window.myvm = this;
    },
    methods: {
      comboboxChange(code) {
        var that = this;
        var title = that.selectorNameList.find(a => a.value == code).text;
        that.currentTitle = title;
        that.loadFieldList(code);
      },
      onClickReloadField() {
        var that = this;
        that.loadFieldList(that.currentCode, false);
      },
      listDataBind(data) {
        var that = this;
        if (data.length == 0) return false;
        that.data = data;
        that.currentCode = data.code;
        that.currentTitle = data.title || '';
      },
      loadParm(data) {
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
        var json = Object.toAjaxJson('/workflow/security/dataService/', 'getConfigProperty', { code: code });
        var data = {};
        if (json) {
          var configData = [];
          var fieldData = typeof json === 'string' ? json.resultField.replace(/\\/g, '') : json;
          if (fieldData) {
            var data = typeof json === 'string' ? eval('(' + fieldData + ')') : fieldData;
            $.each(data, function (i, item) {
              var newItem = { title: item.title, property: item.property, field: '' };
              if (isClear == false && that.initailData && that.initailData.data && that.initailData.data.length > 0) {
                $.each(that.initailData.data, function (_, theitem) {
                  if (theitem.property == item.property) {
                    newItem.field = theitem.field;
                    return false;
                  }
                });
              }
              configData.push(newItem);
            });
            data = {
              title: that.currentTitle,
              code: that.currentCode,
              parms: [],
              data: configData
            };
          }
        }
        that.loadParm(data);
      },
      keyValueEditor(inputId, type, title) {
        WF.SelectorDialog.keyValueEditor(this, inputId, type, title, null, false);
      }
      , keyValueEditor(inputId, type, title) {
        var that = this;
        var formDefId="";
        var wid=that.wid;
        WF.SelectorDialog.keyValueEditor(this, inputId, type, title, null, null,  formDefId, wid);
      }
      , showTargetValue(key) {
        var that = this;
        var msg = that.data[key]||"";
        FUI.Window.showMsg(msg, null, 1);
      }
      , clearTargetValue(key) {
        var that = this;
        that.data[key] = "";
        FUI.Window.showMsg('清除值成功', null, 1);
      }
      , getResult() {
        var that = this;
        if (that.data.data && that.data.data.length > 0) {
          var existNotBindFiled = false;
          $.each(that.data.data, function (i, item) {
            if (item.field == '') {
              existNotBindFiled = true;
            }
          });
          if (existNotBindFiled) {
            FUI.Window.showMsg('请配置绑定字段，如不需要请删除多余的绑定项。');
            return false;
          }
        }
        return this.data;
      }
    }
  };
  window.getResult = function () {
    return myvm.getResult();
  }
</script>