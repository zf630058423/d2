<template>
  <div class="f2bpm-page-dialog-layout">
    <div>
      <div class="p10">
        数据操作服务：
        <el-select v-model="currentselectorName" size="mini" style="width: 65%;" filterable placeholder="请选择" @change="comboboxChange">
          <el-option v-for="item in selectorNameList" :label="item.text" :value="item.value" />
        </el-select>
        <button v-if="isShowBtn" title="将尝试加载字段，第一次已配置的字段将不会被复盖" class="btn btn-sm btn-primary  ml5" @click="onClickReloadField">重新加载属性</button>

        <div v-if="isShowRadio" style="margin-top:5px;">
          <div v-if="implType!= 'Cascselect'&&implType!='DropSelect'">
            【是否多选：
            <el-switch v-model="data.isMulti" active-color="#87DC48" inactive-color="#DEDEDE" />
            】
          </div>
          <div v-if="implType!='Tree'" style="margin-top: 10px;">
            【输入框是否可编辑：
            <el-switch v-model="data.isEnableEdit" active-color="#87DC48" inactive-color="#DEDEDE" />
            】
          </div>
        </div>
        <!--级联查询-->
        <div v-if="implType == 'Cascselect'" id="config_div">
          <div id="isroot_div" style="display: none; margin-top: 5px;">
            是否为顶级：
            <el-switch v-model="data.isRoot" active-color="#87DC48" inactive-color="#DEDEDE" />
          </div>
          <div id="haveempty_div" style="display: none; margin-top: 3px;">
            是否增加空项：
            <el-switch v-model="data.haveEmpty" active-color="#87DC48" inactive-color="#DEDEDE" />
          </div>
          <div id="child_div" style="display: none; margin-top: 3px;">
            子级数据服务：修改默认子级数据服务对象，可配置查询的子级数据服务，填写服务名称，从1级开始填写，如{2:'city',3:'qx',4:'chun'},数字代表层级:数据服务编码。
            <el-input v-model="data.child" size="mini" placeholder="不填写使用默认规则执行，不填写时将使用单个服务中的“上级值字段”来查子级" />
          </div>
          <div class="mt10">
            值绑定到其它字段<el-tooltip class="item" effect="dark" content="即选项值填写到其它哪此字段控件（选项值以逗号隔开的字符串），可为空" placement="right">
              <i style="margin-left: 5px;font-weight: bold" class="fa fa-question-circle-o"> </i>
            </el-tooltip>
            ：
            <el-input v-model="data.parms.cascValueField" style="width: 200px;" size="mini" placeholder="值绑定到其它目标字段，可为空" />
            <i class="fa fa-search cur" @click="selectParmsFormField('cascValueField',true)">选择</i>
          </div>
          <div class="mt10">
            顶级根值<el-tooltip class="item" effect="dark" content="即第一级是使用parent查询出来的，这个值就是parent等于的值，也就是第一级的上一级值，默认为空字符串" placement="right">
              <i style="margin-left: 5px;font-weight: bold" class="fa fa-question-circle-o"> </i>
            </el-tooltip>
            ：
            <el-input v-model="data.parms.cascRootValue" style="width: 200px;" size="mini" placeholder="第一级根值" />
          </div>
        </div>
        <div v-if="implType != 'Cascselect'" id="common_parms_div" style="display: block; margin-top:20px;">
          <span style="margin-right: 30px;">配置高级参数：</span>
          <a class="btn btn-sm btn-white btn-info btn-bold" @click="keyValueEditor('parms','kv', '数据服务高级参数')"> <i class="ace-icon fa fa-pencil     " />高级参数</a>
        </div>
        <!--下拉选项-->
        <div style="margin-top:15px;" v-if="implType == 'DropSelect'||implType =='Autocompleter'">
          表单字段参数
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
                <div v-if="implType=='DropSelect'">
                  <el-select v-model="item.field" size="mini">
                    <el-option label="请选择" value="" />
                    <el-option label="选项标题" value="text" />
                    <el-option label="选项值" value="value" />
                  </el-select>
                  <i class="fa fa-times cur" @click="deleteRow(item.property)">删除</i>
                </div>
                <div v-else>
                  <el-input v-model="item.field" size="mini" class="w250" />
                  <i class="fa fa-search cur" @click="selectFormField(item)">选择</i>
                  <i class="fa fa-times cur" @click="deleteRow(item.property)">删除</i>
                </div>
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
        isShowRadio: true,
        isShowFieldBind: true,

        formDefId: '',
        implType: '',
        //表单控件类型
        ctrType: "",
        selectorNameList: [],
        sqlkeyArray: [{
          dataField: 'selectorNameList',
          sqlkey: 'CB_DataService',
          // 字符串 key:value,key:value参数对
          parm: '',
          flag: null,
          change: null
        }],
        currentselectorName: '',
        parmsList: [],
        data: {
          parms: {},
          isMulti: true,
          isEnableEdit: true,
          isRoot: false,
          haveEmpty: false,
          selectorName: '',
          urlParamsOption: null,
          data: [],
          //需要钻取的表单字段作为参数
          formFieldParams: '',
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
      var urlParamsOption = null;

      var parmsStr = Object.toQueryString('parms');
      var parms = {};
      if (parmsStr) {
        parmsStr = decodeURIComponent(parmsStr);
        parms = eval('(' + parmsStr + ')');
      }
      var jsonData = parms.data;
      var data = jsonData || {};
      if (data) {
        initailData = data;
      }
      var implType = Object.toQueryString('implType') || '';
      var ctrType = Object.toQueryString('ctrType') || '';
      that.ctrType = ctrType;
      that.implType = implType;
      if (that.implType == 'Cascselect') {
        console.info(initailData);
        if (initailData.parms == "" || initailData.parms == null) {
          initailData.parms = {};
        }
        if (initailData.parms.cascValueField == undefined) {
          initailData.parms.cascValueField = "";
        }
        if (initailData.parms.cascRootValue == undefined) {
          initailData.parms.cascRootValue = "";
        }
      }
      if (initailData.formFieldParams == undefined) {
        initailData.formFieldParams = "";
      }
      // 不传ImplType参数时则会取所有
      that.sqlkeyArray[0].parm = 'ImplType:' + implType;
      that.formDefId = formDefId;
      that.initailData = initailData;

      FUI.Form.initailSqlKeyComboBox(that);
      console.info(initailData);
      that.listDataBind(initailData);
      if (that.implType == 'Cascselect') {
        that.isMulti = false;
        that.isEnableEdit = false;
      }
      if (implType == 'DropSelect') {

        that.isShowFieldBind = true;
        that.isShowRadio = false;
      }
      if (implType == 'Tree') {
        that.isShowFieldBind = false;
        that.isShowBtn = false;
      }
      
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
        that.currentselectorName = data.code;
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
        var json = Object.toAjaxJson('/workflow/security/dataService/', 'getConfigProperty', {
          code: code
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
                    newItem.field = theitem.field;
                    return false;
                  }
                });
              }
              configData.push(newItem);
            });
            data = {
              isMulti: false,
              isEnableEdit: false,
              code: that.currentselectorName,
              child: '',
              parms: '',
              data: configData,
              formFieldParams: that.data.formFieldParams
            };
          }
        }
        that.loadParm(data);
      },
      selectFormField(item) {
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
      }
      , keyValueEditor(inputId, type, title) {
        var that = this;
        WF.SelectorDialog.keyValueEditor(this, inputId, type, title, null, null, that.formDefId, null);
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
      , selectorFormFieldParams(inputKey) {
        var that = this;
        WF.SelectorDialog.selectorFormField(that, that.formDefId, "", inputKey, "", false);
      }
      , selectParmsFormField(inputKey, isSingle) {
        var that = this;
        WF.SelectorDialog.selectorFormField(that, that.formDefId, "", inputKey, "", isSingle, that.data.parms);
      }
      ,
      getResult() {
        var that = this;
        if (that.data.data && that.data.data.length > 0) {
          var existNotBindFiled = false;
          $.each(that.data.data, function (i, item) {
            if (item.field == '') {
              existNotBindFiled = true;
            }
          });
        }
        return this.data;
      }
    }
  };
  window.getResult = function () {
    return myvm.getResult();
  }
</script>