<template>
  <div class="f2bpm-page-dialog-layout">
    <div>
      <table class="common-grid" cellpadding="0" cellspacing="0">
        <tr>
          <th :colspan="needActivity?3:2" class="font16">授权详细列表</th>
        </tr>
        <tr>
          <th v-if="needActivity" style="width: 350px;">节点</th>
          <th>授权对象</th>
          <th style="width: 80px;">操作</th>
        </tr>
        <tr v-for="detailItem in detail">
          <td v-if="needActivity">
            <span :class="detailItem.activitys.type=='none'?'cube bg-grey':'cube bg-gree'">{{ detailItem.activitys.type=='all'?'所有节点':detailItem.activitys.type=='detail'?'详细':'无' }}</span>
            <div v-if="detailItem.activitys.type=='detail'">
              <div v-if="detailItem.activitys.detail.act&&detailItem.activitys.detail.act.length>0" class="p5"> <span v-for="a in detailItem.activitys.detail.act"><span class="cube bg-blue mr2" v-html="a.text" /> </span></div>
            </div>
          </td>
          <td style="text-align: left;">
            <span :class="detailItem.users.type=='none'?'cube bg-grey':'cube bg-gree'">{{ detailItem.users.type=='all'?'所有人':detailItem.users.type=='detail'?'详细':'无' }} </span>
            <div v-if="detailItem.users.type=='detail'">
              <div v-if="detailItem.users.detail.user&&detailItem.users.detail.user.length>0" class="p5"><span class="cube bg-orange mr2">用户 》》</span><span v-for="u in detailItem.users.detail.user"><span class="cube bg-blue mr2" v-html="u.text" /> </span></div>
              <div v-if="detailItem.users.detail.org&&detailItem.users.detail.org.length>0" class="p5"> <span class="cube bg-orange mr2">组织 》》</span><span v-for="g in detailItem.users.detail.org"> <span class="cube bg-blue mr2" v-html="g.text" /> </span></div>
              <div v-if="detailItem.users.detail.role&&detailItem.users.detail.role.length>0" class="p5"><span class="cube bg-orange mr2">角色 》》</span><span v-for="r in detailItem.users.detail.role"> <span class="cube bg-blue mr2" v-html="r.text" /> </span></div>
            </div>
          </td>
          <td><span class="fa fa-trash-o cur" @click="deleteItem(detailItem)">删除</span> <span class="fa fa-edit cur" @click="editItem(detailItem)">编辑</span> </td>
        </tr>
      </table>
    </div>
    <hr style="border: 1px solid #dddddd;margin-bottom: 10px;">
    <div>
      <div v-if="currAction==''" style="text-align:right;padding-right: 20px;"><button class="btn btn-sm btn-primary fa fa-plus" @click="add_new">添加</button> </div>
      <table v-if="currAction!=''" class="common-grid" cellpadding="0" cellspacing="0">
        <tr>
          <th colspan="2" class="font16">编辑授权详细</th>
        </tr>
        <tr v-if="needActivity" class="activity_tr">
          <th style="width: 150px;">限定流程节点</th>
          <td style="text-align: left;">
            <el-radio-group v-model="currItem.activitys.type">
              <!-- <el-radio label="none">无</el-radio> -->
              <el-radio label="all">所有节点</el-radio>
              <el-radio label="detail">详细</el-radio>
            </el-radio-group>
            <span class="ml10" v-html="data.activity_des" />
            <button v-if="currItem.activitys.type=='detail'" class="btn btn-minier btn-primary mr2 read fr" :disabled="data.readDisabled" title="设置节点授权" @click="thisSelectActivity('activity_value','activity_des')">
              <i class="fa fa-search bigger-120"> 选择</i>
            </button>
          </td>
        </tr>
        <tr class="activity_tr">
          <th>授权目标用户</th>
          <td style="text-align: left;">
            <el-radio-group v-model="currItem.users.type">
              <!-- <el-radio label="none">无</el-radio> -->
              <el-radio label="all">所有人员</el-radio>
              <el-radio label="detail">详细</el-radio>
            </el-radio-group>
          </td>
        </tr>
      </table>
      <table v-if="currItem.users.type=='detail'" class="common-grid" cellpadding="0" cellspacing="0">
        <tr>
          <th colspan="2">授权目标用户详细</th>
        </tr>
        <tr>
          <th style="width: 150px;">用户授权</th>
          <td>
            <span v-if="false" placeholder="" v-html="data.user_value" />
            <span class="power_des_span_content" v-html="data.user_des" />
            <button class="btn btn-minier btn-primary mr2 read fr" :disabled="data.readDisabled" title="设置用户“显示”授权" @click="selectorUserTextValue('user_value','user_des',null,false,'account');return false;">
              <i class="fa fa-search bigger-120">选择</i>
            </button>
          </td>
        </tr>
        <tr>
          <th>角色授权</th>
          <td>
            <span v-if="false" placeholder="" v-html="data.role_value" />
            <span class="power_des_span_content" v-html="data.role_des" />

            <button class="btn btn-minier btn-primary mr2 read fr" :disabled="data.readDisabled" title="设置角色“显示”授权" @click="selectorTextValue('role_value','role_des','Role');return false;">
              <i class="fa fa-search bigger-120">选择</i>
            </button>
          </td>
        </tr>
        <tr>
          <th>组织授权</th>
          <td>
            <span v-if="false" placeholder="" v-html="data.org_value" />
            <span class="power_des_span_content" v-html="data.org_des" />
            <button class="btn btn-minier btn-primary mr2 read fr" :disabled="data.readDisabled" title="设置组织“显示”授权" @click="selectorTextValue('org_value','org_des','Org');return false;">
              <i class="fa fa-search bigger-120">选择</i>
            </button>
          </td>

        </tr>
      </table>
      <div v-if="currAction!=''" style="text-align:right;padding-right: 20px;">
        <button class="btn btn-sm btn-primary fa fa-save" @click="saveItem"> {{ currAction=='Add'?'确定保存':'确定保存' }} </button>
        <button class="btn btn-sm btn-default ml10 fa fa-minus-circle" @click="cancleItem"> 取消</button>
      </div>
      <div style="margin: 5px;line-height: 20px;">
        <em>设置说明</em><br>
        【所有节点】:表示该授权范围为流程的所有节点。<br>
        【所有人】:表示该授权为所有人都拥有。<br>
        【无】：表示不设置，数据库为空。
        <br> 【详细】：表示按详细规则授权。<br>
      </div>
      <div class="dialogfooter">
        <el-button size="small" type="primary" @click="submitForm()"><i class="fa fa-save" />提交
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
        needActivity: false,
        rightType: '',
        fieldType: '',
        currAction: '',
        appId: '',
        detail: [],
        actionName: '',
        currItem: {},
        currItemTemplate:
        {
          'id': '1',
          'activitys': {
            'type': 'none',
            'detail': {
              'act': []
            }
          },
          'users': {
            'type': 'all',
            'detail': {
              'user': [],
              'org': [],
              'role': []
            }
          }
        },
        data: {
          activity_value: '',
          activity_des: '',

          user_value: '',
          user_des: '',

          role_value: '',
          role_des: '',

          org_value: '',
          org_des: ''
        }
      };
    },
    created: function () {
      var that = this;
      var actionName = null;
      var appId = Object.toQueryString('appId');
      // 授权字段类型fieldType:field字段，button：按钮
      var fieldType = Object.toQueryString('fieldType');
      // 是否为批量详细设置
      var isbathDetail = Object.toQueryString('isbathDetail') || 0;
      var rightType = Object.toQueryString('rightType');
      that.appId = appId;
      that.rightType = rightType;
      that.fieldType = fieldType;
      that.isbathDetail = isbathDetail;
      var openerVm = window.parent.myvm;
      if (window.parent.myvm['updateCurrentFieldDetail']) {
        openerVm = window.parent.myvm;
      } else if (window.openerWin.myvm['updateCurrentFieldDetail']) {
        openerVm = window.openerWin.myvm;
      }
      var parentCurrentDetail = openerVm.currentDetail;
      that.detail = Object.toDeepClone(parentCurrentDetail);
      that.currItem = Object.toDeepClone(that.currItemTemplate);
      if (rightType == 'globalWfForm') {
        that.needActivity = true;
      }
      if (that.needActivity) {
        that.currItemTemplate.activitys.type = 'all';
      }
    },
    mounted() {
      var that = window.myvm;

    },
    methods: {
      closeEdit() {
        FUI.Window.closeEdit();
      },
      add_new() {
        this.currAction = 'Add';
      },
      // 获取描述
      getValueDes(data) {
        var des = '';
        var n = data.length;
        if (n == 0) {
          return '';
        }
        $.each(data, function (index, item) {
          des += item.text;
          if (index != n - 1) {
            des += ',';
          }
        });
        return des;
      },
      clearData() {
        var that = this;
        // 清除Data的值
        $.each(that.data, function (key, v) {
          that.data[key] = '';
        });
      },
      loadData(item) {
        var that = this;
        if (item.activitys.type == 'detail' && item.activitys.detail.act && item.activitys.detail.act.length > 0) {
          var actDes = that.getValueDes(item.activitys.detail.act);
          that.data.activity_des = actDes;
          that.data.activity_value = JSON.stringify(item.activitys.detail.act);
        }

        if (item.users.type == 'detail' && item.users.detail) {
          var user_des = that.getValueDes(item.users.detail.user);
          that.data.user_des = user_des;
          that.data.user_value = item.users.detail.user.length > 0 ? JSON.stringify(item.users.detail.user) : '';

          var org_des = that.getValueDes(item.users.detail.org);
          that.data.org_des = org_des;
          that.data.org_value = item.users.detail.org.length > 0 ? JSON.stringify(item.users.detail.org) : '';

          var role_des = that.getValueDes(item.users.detail.role);
          that.data.role_des = role_des;
          that.data.role_value = item.users.detail.role.length > 0 ? JSON.stringify(item.users.detail.role) : '';
        }
      },
      setCurrDefault() {
        var that = this;
        that.currItem = Object.toDeepClone(that.currItemTemplate);
        that.clearData();
        that.currAction = '';
      },
      editItem(item) {
        var that = this;
        that.currItem = Object.toDeepClone(item);
        that.loadData(that.currItem);
        // 加载data详细数据
        that.currAction = 'Edit';
      },
      deleteItem(item) {
        var that = this;
        var id = item.id;
        var newData = that.detail.filter(a => a.id != id);
        that.detail = newData;
        that.setCurrDefault();
      },
      cancleItem() {
        var that = this;
        that.setCurrDefault();
      },
      saveItem() {
        var that = this;
        var newItem = Object.toDeepClone(that.currItem);
        if (that.currAction == 'Add') {
          newItem.id = Object.toGuid();
        }
        if (newItem.activitys.type == 'detail') {
          // 收集节点详细
          newItem.activitys.detail.act = that.data.activity_value ? eval('(' + that.data.activity_value + ')') : [];
        }
        if (newItem.users.type == 'detail') {
          // 收集用户详细
          newItem.users.detail.user = that.data.user_value ? eval('(' + that.data.user_value + ')') : [];
          newItem.users.detail.org = that.data.org_value ? eval('(' + that.data.org_value + ')') : [];
          newItem.users.detail.role = that.data.role_value ? eval('(' + that.data.role_value + ')') : [];
        }
        if (that.currAction == 'Edit') {
          var newData = that.detail.filter(a => a.id != newItem.id);
          newData.push(newItem);
          that.detail = newData;
        } else {
          that.detail.push(newItem);
        }
        console.info(that.detail);
        that.setCurrDefault();
      },
      submitForm() {
        var that = this;
        if (that.currAction != '') {
          FUI.Window.showMsg('当前正在“编辑授权详细”请先保存或取消！');
          return false;
        }
        var openerVm = window.parent.myvm;
        if (window.parent.myvm['updateCurrentFieldDetail']) {
          openerVm = window.parent.myvm;
        } else if (window.openerWin.myvm['updateCurrentFieldDetail']) {
          openerVm = window.openerWin.myvm;
        }
        openerVm.updateCurrentFieldDetail(that.detail, that.fieldType, that.isbathDetail);
        that.closeEdit();
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
          var target = type + '_value';
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
  };

  window.pageLoad = function () {

  }
</script>