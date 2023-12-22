<template>
  <div class="f2bpm-page-dialog-layout">
    <div>
      <table class="common-grid" cellpadding="0" cellspacing="0">
        <tr>
          <td class="bg-gray" style="width: 50px;">授权类型</td>
          <td id="readTitle" class="bg-gray">显示权限</td>
          <td class="bg-gray bj">编辑权限</td>
        </tr>
        <tr>
          <td class="bg-gray">所有人</td>
          <td>
            <el-switch v-model="data.readPowerAll" active-color="#87DC48" inactive-color="#DEDEDE" @change="readPowerAllChange" />无任何限制
          </td>
          <td class="bj">
            <el-switch v-model="data.writePowerAll" active-color="#87DC48" inactive-color="#DEDEDE" @change="writePowerAllChange" />无任何限制

          </td>
        </tr>
        <tr v-if="appId!=''" class="activity_tr">
          <td class="bg-gray">节点授权</td>
          <td>
            <span v-if="false" placeholder="" v-html="data.activity_read_value" />
            <span v-html="data.activity_read_des" />
            <button class="btn btn-minier btn-primary mr2 read fr" :disabled="data.readDisabled" title="设置节点“显示”授权" @click="thisSelectActivity('activity_read_value','activity_read_des')">
              <i class="fa fa-gears bigger-120" />
            </button>
          </td>
          <td class="bj">
            <span v-if="false" placeholder="" v-html="data.activity_write_value" />
            <span class="textBoxAutoShort noborder" v-html="data.activity_write_des" />
            <button class="btn btn-minier btn-primary mr2 write fr" :disabled="data.writeDisabled" title="设置节点“编辑”授权" @click="thisSelectActivity('activity_write_value','activity_write_des')">
              <i class="fa fa-gears bigger-120" />
            </button>
          </td>
        </tr>
        <tr>
          <td class="bg-gray">用户授权</td>
          <td>
            <span v-if="false" placeholder="" v-html="data.user_read_value" />
            <span class="power_des_span_content" v-html="data.user_read_des" />
            <button class="btn btn-minier btn-primary mr2 read fr" :disabled="data.readDisabled" title="设置用户“显示”授权" @click="selectorUserTextValue('user_read_value','user_read_des',null,false,'account');return false;">
              <i class="fa fa-gears bigger-120" />
            </button>
          </td>
          <td class="bj">
            <span v-if="false" placeholder="" v-html="data.user_write_value" />
            <span class="power_des_span_content" v-html="data.user_write_des" />
            <button class="btn btn-minier btn-primary mr2 write fr" :disabled="data.writeDisabled" title="设置用户“编辑”授权" @click="selectorUserTextValue('user_write_value','user_write_des',null,false,'account');return false;">
              <i class="fa fa-gears bigger-120" />
            </button>
          </td>
        </tr>
        <tr>
          <td class="bg-gray">角色授权</td>
          <td>
            <span v-if="false" placeholder="" v-html="data.role_read_value" />
            <span class="power_des_span_content" v-html="data.role_read_des" />

            <button class="btn btn-minier btn-primary mr2 read fr" :disabled="data.readDisabled" title="设置角色“显示”授权" @click="selectorTextValue('role_read_value','role_read_des','Role');return false;">
              <i class="fa fa-gears bigger-120" />
            </button>
          </td>
          <td class="bj">

            <span v-if="false" placeholder="" v-html="data.role_write_value" />
            <span class="power_des_span_content" v-html="data.role_write_des" />
            <button class="btn btn-minier btn-primary mr2 write fr" :disabled="data.writeDisabled" title="设置角色“编辑”授权" @click="selectorTextValue('role_write_value','role_write_des','Role');return false;">
              <i class="fa fa-gears bigger-120" />
            </button>
          </td>
        </tr>
        <tr>
          <td class="bg-gray">组织授权</td>
          <td>
            <span v-if="false" placeholder="" v-html="data.org_read_value" />
            <span class="power_des_span_content" v-html="data.org_read_des" />

            <button class="btn btn-minier btn-primary mr2 read fr" :disabled="data.readDisabled" title="设置组织“显示”授权" @click="selectorTextValue('org_read_value','org_read_des','Org');return false;">
              <i class="fa fa-gears bigger-120" />
            </button>
          </td>
          <td class="bj">
            <span v-if="false" placeholder="" v-html="data.org_write_value" />
            <span class="power_des_span_content" v-html="data.org_write_des" />
            <button class="btn btn-minier btn-primary mr2 write fr" :disabled="data.writeDisabled" title="设置组织“编辑”授权" @click="selectorTextValue('org_write_value','org_write_des','Org');return false;">
              <i class="fa fa-gears bigger-120" />
            </button>
          </td>
        </tr>

      </table>
      <div style="margin: 5px;line-height: 20px;">
        <em>设置说明</em><br> 【所有人】：如勾选了所有人，则表示此字段忽略任何授权类型的限制，所有任何待办处理人都会显示和可编辑。<br>
        【显示权限】：即表单字段是否显示，只有被授权的对象才会显示，多种授权类型进行“或”运算。<br> 【编辑权限】：即表单字段是否可填写，只有被授权的对象才能填写，多种授权类型进行“或”运算。<br>
        【空白不设置】：空白不设置表示此授权类型不做限制也不参与运算。<br> 【举例说明】：显示权限设置有 用户授权：李四，角色授权：超级管理员，那么权限计算结果求解是：
        当前登录用户是李四或拥有角色为超级管理的人才会显示。 <br>
      </div>
      <div class="dialogfooter">
        <el-button size="small" type="primary" @click="submitForm()"><i class="fa fa-save" />保存
        </el-button>
        <el-button id="btn_cancel" size="small" @click="closeEdit"><i class="fa fa-minus-circle" />取消
        </el-button>
      </div>
      </el-form>
    </div>
  </div>
</template>

<script>

  export default {
    data() {
      return {
        permissionType: [],
        fieldIds: null,
        fieldtitles: '',
        actionName: '',
        type: '',
        appId: '',
        rightId: '',
        rightData: { 'read': [], 'write': [] },
        data: {
          readDisabled: false,
          writeDisabled: false,

          readPowerAll: false,
          writePowerAll: false,

          activity_read_value: '',
          activity_read_des: '',
          activity_write_value: '',
          activity_write_des: '',

          user_read_value: '',
          user_read_des: '',
          user_write_value: '',
          user_write_des: '',

          role_read_value: '',
          role_read_des: '',
          role_write_value: '',
          role_write_des: '',

          org_read_value: '',
          org_read_des: '',
          org_write_value: '',
          org_write_des: ''
        }
      };
    },
    created: function () {
      var appId = Object.toQueryString('appId') || '';
      var rightId = Object.toQueryString('rightId');
      var type = null;
      var actionName = null;
      var data = { 'read': [], 'write': [] };
      var myvm = null;
      var that = this;
      that.permissionType = ['activity', 'user', 'org', 'role'];
      that.powerType = ['read', 'write'];

      that.rightId = rightId;
      that.appId = appId;

      that.rightData = data;
      that.pageLoad();
      that.loadData();
    },
    methods: {
      closeEdit() {
        FUI.Window.closeEdit();
      },
      pageLoad() {
        var that = this;
        var parmsStr = Object.toQueryString('parms');
        var parms = {};
        if (parmsStr) {
          parms = eval('(' + parmsStr + ')');
        }
        that.fieldIds = parms.fieldIds;
        that.fieldtitles = parms.fieldtitles || '';
        console.info('fieldIds:' + that.fieldIds);
        // 是针对字段还是针对ob,   bo时fieldId对应的是"添加行"是bo的ID,删除行是tableId; field时对应的是字段定义的id
        // extend针对的是表单扩展控件
        var type = parms.type || 'field';
        var actionName = parms.actionName || '';
        that.type = type;
        that.actionName = actionName;
        if (that.appId == '') {
          $('.activity_tr').hide();
        }
        if (type == 'bo') {
          $('.bj').hide();
          $('#readTitle').html(actionName.indexOf('addRow') > -1 ? '添加行权限' : '删除行权限');
        }
        if (type == 'extend') {
          $('.bj').hide();
          $('#readTitle').html('扩展控件显示权限');
        }
        if (type == 'button') {
          $('.bj').hide();
          $('#readTitle').html('按钮显示权限');
        }
        if (that.fieldIds && that.fieldIds.indexOf(',') == -1) {
          var mydata = Object.toAjaxJson(FUI.Handlers.WorkflowManageHandler, 'getModelFieldPermissionByFieldId', {
            'rightId': that.rightId,
            'fieldId': that.fieldIds
          });
          if (!mydata.success && !mydata.itemPermission) {
            console.info(mydata.msg);
          } else {
            that.rightData = eval('(' + mydata.itemPermission + ')');
          }
        }
      },
      loadData() {
        var that = this;
        $.each(that.powerType, function (index, power) {
          var powerData = that.rightData[power];
          $.each(powerData, function (index, theItem) {
            var type = theItem.type;
            var valueData = theItem.value;
            var targetValue = type + '_' + power + '_value';
            var targetDes = type + '_' + power + '_des';

            that.data[targetValue] = valueData ? JSON.stringify(valueData) : '';
            that.data[targetDes] = valueData ? that.getValueDes(valueData) : '';

            if (type == 'everyone') {
              that.data[power + 'PowerAll'] = true;
              that.everyOneControl(true, power);
            }
          });
        });
      },
      getValueDes(data) {
        var des = '';
        var n = data.length;
        $.each(data, function (index, item) {
          des += item.text;
          if (index != n - 1) {
            des += ',';
          }
        });
        return des;
      },
      everyOneControl(isEveryOne, powerType) {
        var that = this;
        if (isEveryOne == true) {
          that.data[powerType + 'Disabled'] = true;
          that.cleanAll(powerType);
        } else {
          that.data[powerType + 'Disabled'] = false;
        }
      },
      readPowerAllChange(value) {
        this.everyOneControl(value, 'read');
      },
      writePowerAllChange(value) {
        this.everyOneControl(value, 'write');
      },
      cleanAll(powerType) {
        var that = this;
        $.each(that.permissionType, function (index, type) {
          var target = type + '_' + powerType + '_value';
          var targetDes = type + '_' + powerType + '_des';
          that.data[target] = '';
          that.data[targetDes] = '';
        });
      },
      collectData() {
        var that = this;
        var result = {
          read: [],
          write: {}
        };
        // 读权限
        var readData = [];
        $.each(that.permissionType, function (index, type) {
          var target = type + '_read_value';
          var value = that.data[target];
          if (value == '') { return true; }
          var valueObj = eval(value);
          readData.push({
            'type': type,
            'value': valueObj
          });
        });
        // 所有人
        if (that.data.readPowerAll) {
          readData.push({
            'type': 'everyone',
            'value': ''
          });
        }
        result.read = readData;
        // 写权限
        var writeData = [];
        $.each(that.permissionType, function (index, type) {
          var target = type + '_write_value';
          var value = that.data[target];
          if (value == '') { return true; }
          var valueObj = eval(value);
          writeData.push({
            'type': type,
            'value': valueObj
          });
        });
        // 所有人
        if (that.data.writePowerAll) {
          writeData.push({
            'type': 'everyone',
            'value': ''
          });
        }
        result.write = writeData;
        var str = JSON.stringify(result);
        console.info('提交保存时' + str);
        return str;
      },
      submitForm() {
        var that = this;
        var data = {
          'rightId': that.rightId,
          'fieldIds': that.fieldIds,
          'fieldtitles': that.fieldtitles,
          'actionName': that.actionName,
          'type': that.type,
          'itemPermission': that.collectData()
        };
        console.info(JSON.stringify(data));
        var result = Object.toAjaxJson(FUI.Handlers.WorkflowManageHandler, 'saveFieldPermission', data);
        FUI.Window.showMsg(that, result.msg, null, 1, function () {
          if (result.success == true) {
            FUI.Window.closeEdit();
          }
        });
      },
      thisSelectActivity(inputId, inputText) {
        var that = this;
        WF.SelectorDialog.selectorTextValue(that, inputId, inputText, 'HistoryActivity', {
          appId: that.appId
        });
      },
      selectorTextValue(inputKey, inputName, type) {
        var that = this;
        WF.SelectorDialog.selectorTextValue(that, inputKey, inputName, type);
      },
      selectorUserTextValue(inputKey, inputName, passParm, singleSelect, keyName) {
        var that = this;
        WF.SelectorDialog.selectorUserTextValue(that, inputKey, inputName, passParm, singleSelect, keyName);
      }

    }
  }
</script>