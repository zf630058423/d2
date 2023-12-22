<template>
  <div class="f2bpm-page-layout" style="padding: 5px;">
    <el-tabs :value="currTabName" @tab-click="tabsClick">
      <el-tab-pane label="时限设置" name="timeLimit">
        <div style="padding: 5px;height: 400px;">
          <div>
            <div class="pb10">
              启用时限：
              <el-switch v-model="timeLimit.params.isEnableTimeLimit" active-color="#13ce66" inactive-color="#DEDEDE" active-value="1" inactive-value="0" />（<em>非必要请勿启用</em>）
            </div>
            <div class="pb10 font12">
              时限规则：<el-radio-group v-model="timeLimit.params.implType" size="mini">
                <el-radio label="default">系统默认</el-radio>
                <el-radio label="formfield">表单时间字段</el-radio>
                <el-radio label="sql">自定义SQL</el-radio>
                <el-radio label="java">自定义JAVA类</el-radio>
              </el-radio-group>
            </div>

            <div v-if="timeLimit.params.implType=='default'" class="pb10">
              审批时限：
              <el-input-number v-model="timeLimit.params.timeLength" size="small" :min="0" :max="240" label="审批时限" /> &nbsp;
              <el-select v-model="timeLimit.params.timeUnit" size="small">
                <el-option label="自然日" value="natureday" />
                <el-option label="工作日" value="workday" />
              </el-select>
              <br><br>
              <span class="font10">工作日：星期一至星期五（节假日需要在系统的公共假期管理中配置），节假日：星期六、星期天</span>
            </div>
            <div v-if="timeLimit.params.implType=='formfield'" class="pb10">
              <el-input v-model="timeLimit.params.implFormfield" size="mini" :clearable="true" style="width: 500px;" placeholder="选择在线表单日期时间字段" class="input-with-select">
                <el-button id="selectId" slot="append" type="primary" icon="el-icon-search" @click="selectFormField('implFormfield')" />
              </el-input>
              <span class="red mt4" style="display: block;margin-top: 5px;"> 选择在线表单时间字段，这个字段日期就是作为未来超时截止的日期。</span>
            </div>
            <div v-if="timeLimit.params.implType=='sql'" class="pb10">
              <el-input v-model="timeLimit.params.implSql" placeholder="请输入SQL脚本，只能返回一个字段日期的结果" size="mini" />
              <span class="red mt4" style="display: block;margin-top: 5px;"> SQL的查询结果只能返回一条只有一个字段的结果，并且结果内容是一个具体的日期，这个日期就是作为未来超时截止的日期。</span>
            </div>

            <div v-if="timeLimit.params.implType=='java'" class="pb10">
              <el-input v-model="timeLimit.params.implJava" placeholder="填写Java类的全路径地址" size="mini" />
              <div class="red" style="padding-top:5px;">Java类需要继续IRule的接口，Java类最终返回一个Date类型的超时截止日期。</div>
            </div>

          </div>
        </div>
      </el-tab-pane>

      <el-tab-pane label="预警设置" name="timeOutWarning">
        <div style="padding: 5px;height: 400px;">
          <div>
            启用预警：
            <el-switch v-model="timeOutWarning.params.isEnableTimeOutWarning" active-color="#13ce66" inactive-color="#DEDEDE" active-value="1" inactive-value="0" />
            （<em>非必要请勿启用</em>）
            <div class="space-4" />
            <span class="cur" @click="editMessageTemplate('Add','timeOutWarning')">
              <i class="fa fa-plus" />添加配置
            </span>
            <table id="timeOutWarning_table" />
          </div>
        </div>
      </el-tab-pane>

      <el-tab-pane label="超期处理设置" name="timeOutDealWith">
        <div style="padding: 5px;height: 400px;">
          <div>
            启用超期处理：
            <el-switch v-model="timeOutDealWith.params.isEnableTimeOutDealWith" active-color="#13ce66" inactive-color="#DEDEDE" active-value="1" inactive-value="0" />（<em>非必要请勿启用</em>）
            <div class="space-4" />
            处理方式：<el-radio-group v-model="timeOutDealWith.params.timeOutDealWithActoin">
              <el-radio label="messageNotify">消息提醒 </el-radio>
              <el-radio label="transferToProcessMonitor">转办到流程监控人 </el-radio>
              <el-radio v-if="act_dealWithAction" label="rejectToPreActivity">尝试退回上一环节办理 </el-radio>
              <el-radio v-if="act_dealWithAction" label="inToNextActivity">尝试自动进入下一环节办理</el-radio>
            </el-radio-group>
            <div class="space-4" />
            <span class="cur" @click="editMessageTemplate('Add','timeOutDealWith')">
              <i class="fa fa-plus" />添加配置
            </span>
            <table id="timeOutDealWith_table" />
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
        act_dealWithAction: true,
        theType: 'timeLimit',
        currTabName: 'timeLimit',
        // 时限设置
        timeLimit: { opttype: 'timeLimit', params: { isEnableTimeLimit: '0', timeLength: 0, timeUnit: 'natureday', implType: 'default', implSql: '', implJava: '', implFormfield: '' } },
        // 预警设置
        timeOutWarning: { opttype: 'timeOutWarning', params: { isEnableTimeOutWarning: '0', configData: [] } },
        // 超期处理设置
        timeOutDealWith: { opttype: 'timeOutDealWith', params: { isEnableTimeOutDealWith: '0', timeOutDealWithActoin: '', configData: [] } },
        // 自定义超时规则
        expirationTime: { opttype: 'expirationTime', params: { implType: '' } },
        timeOutWarning_dg: null,
        timeOutDealWith_dg: null,
        tableData: [],
        tableColumn: [{
          field: 'hour',
          title: '小时',
          width: 60
        }, {
          field: 'messageType',
          title: '消息发送方式',
          width: 130,
          formatter: 'getMessageTypeTitle'
        }, {
          field: 'title',
          title: this.$t('title'),
          width: 240
        }, {
          field: 'sendUserType',
          title: '发送人员',
          width: 130,
          formatter: 'getUserType'
        },
        {
          field: 'ccUserType',
          title: '抄送人员',
          formatter: 'getUserType'
        },
        {
          field: 'operation',
          type: 'empty',
          title: '操作',
          width: 40,
          formatter: 'operationFormatter'
        }
        ]
      };
    },
    created: function () {
      var that = this;
      var obj;
      var attrName = null;
      var resultData = [];
      var expirationTime = null;
      var timeOutWarning = null;
      var timeOutDealWith = null;
      var timeLimit = null;
      // obj = window.dialogArguments;
      // json格式：{opttype:expirationTime,params:{}}
      obj = parent.window.currentWindowTargetObjectValue;
      var value = obj.value || [];
      var title = obj.title;
      var otherParm = eval('(' + obj.otherParm + ')');
      that.wid = otherParm.wid;
      attrName = obj.name;
      if (value != null && value != '' && Object.toStartWith(value, '#')) {
        value = value.toString().substr(1, value.toString().length - 2);
        value = Object.toStringToJson(value);
      }
      resultData = value;
      $.each(resultData, function (i, jsonObj) {
        if (jsonObj.opttype == 'expirationTime') {
          expirationTime = jsonObj;
        } else if (jsonObj.opttype == 'timeOutWarning') {
          timeOutWarning = jsonObj;
        } else if (jsonObj.opttype == 'timeOutDealWith') {
          timeOutDealWith = jsonObj;
        } else if (jsonObj.opttype == 'timeLimit') {
          timeLimit = jsonObj;
        }
      });
      that.attrName = attrName;
      if (timeLimit) {
        that.timeLimit = timeLimit;
      }
      if (timeOutWarning) {
        that.timeOutWarning = timeOutWarning;
      }
      if (timeOutDealWith) {
        that.timeOutDealWith = timeOutDealWith;
      }
      if (expirationTime) {
        that.expirationTime = expirationTime;
      }
    },
    mounted() {
      var that = this;
      that.theType = 'timeOutWarning';
      var timeOutWarning_dg = FUI.DataTable.Create('timeOutWarning_table');
      timeOutWarning_dg.$vm = that;
      timeOutWarning_dg.SortName = 'hour';
      timeOutWarning_dg.Columns = that.tableColumn;
      timeOutWarning_dg.Data = that.timeOutWarning.params.configData;
      timeOutWarning_dg.Bind();
      that.timeOutWarning_dg = timeOutWarning_dg;

      that.theType = 'timeOutDealWith';
      var timeOutDealWith_dg = FUI.DataTable.Create('timeOutDealWith_table');
      timeOutDealWith_dg.$vm = that;
      timeOutDealWith_dg.SortName = 'hour';
      timeOutDealWith_dg.Columns = that.tableColumn;
      timeOutDealWith_dg.Data = that.timeOutDealWith.params.configData;
      timeOutDealWith_dg.Bind();
      that.timeOutDealWith_dg = timeOutDealWith_dg;

      if (that.attrName == 'ProcTimeLimit') {
        that.act_dealWithAction = false;
      }
      window.myvm = that;
    },
    methods: {
      closeEdit() {
        FUI.Window.closeEdit();
      },
      tabsClick(tab, event) {
        this.currTabName = tab.name;
        this.theType = tab.name;
      },
      saveAndClose() {
        var that = this;
        FUI.Window.confirm(that, '您确定要提交暂存？', '温馨提示', function () {
          var data = [];
          data.push(that.timeLimit);
          data.push(that.timeOutWarning);
          data.push(that.timeOutDealWith);
          data.push(that.expirationTime);
          var resultStr = JSON.stringify(data);
          if (resultStr == '[]') {
            parent.setTargetValue('');
          } else {
            resultStr = '#' + resultStr + '#';
            parent.setTargetValue(that.attrName, resultStr);
          }
          console.info(resultStr);
          FUI.Window.closeEditAll();
        });
      },
      loadtaskNotifyData() {
        var that = this;
        var jsonObj = that.taskNotifyData;
        if (jsonObj.params.configData != undefined && jsonObj.params.configData != null) {
          that.tableData = jsonObj.params.configData;
        }
      },
      getResult() {
        var that = this;
        return JSON.stringify(that.content);
      },
      // 消息模板配置列表
      editMessageTemplate(formAction, type, id) {
        var that = this;
        var itemData = null;
        var title = '新增';
        if (formAction == 'Edit') {
          title = '编辑';
          itemData = that.getItemData(id, type);
        }
        var parm = { data: itemData };// 页面传参
        FUI.dialog(__webpath + '/workflow/flowDesigner/messageTemplateEdit/?wid=' + that.wid + '&formAction=' + formAction + '&type=' + type, title + '配置', parm, 860, 550,
          function (json, index, layer) {
            if (json != false) {
              // 回调函数
              if (type == 'timeOutWarning') {
                if (json.formAction == 'Edit') {
                  that.deleteRowById(type, json.id);
                }
                that.timeOutWarning.params.configData.push(json);
                that.timeOutWarning_dg.reload({ data: that.timeOutWarning.params.configData });
                console.info(that.timeOutWarning.params.configData);
              }
              if (type == 'timeOutDealWith') {
                if (json.formAction == 'Edit') {
                  that.deleteRowById(type, json.id);
                }
                that.timeOutDealWith.params.configData.push(json);
                that.timeOutDealWith_dg.reload({ data: that.timeOutDealWith.params.configData });
              }
              layer.close(index);
            }
          }, true, { fit: false, btnAlign: 'c' }, { sure: { text: '确定' } });
      },
      getItemData(id, type) {
        var that = this;
        var data = [];
        if (type == 'taskNotify') {
          data = that.taskNotify.params.configData;
        } else if (type == 'timeOutWarning') {
          data = that.timeOutWarning.params.configData;
        } else if (type == 'timeOutDealWith') {
          data = that.timeOutDealWith.params.configData;
        }
        var result = null;
        $.each(data, function (i, item) {
          if (item.id == id) {
            result = item;
            return false;
          }
        });
        return result;
      },

      getMessageTypeTitle(messageType) {
        var that = this;
        if (messageType == '' || messageType == undefined) return '';
        var titleArr = [];
        messageType = $.isArray(messageType) ? messageType : messageType.split(',');
        if ($.inArray('sms', messageType) > -1) {
          titleArr.push('短信');
        }
        if ($.inArray('email', messageType) > -1) {
          titleArr.push('邮件');
        }
        if ($.inArray('syswindow', messageType) > -1) {
          titleArr.push('站内消息');
        }
        if ($.inArray('im', messageType) > -1) {
          titleArr.push('即时通讯');
        }
        return titleArr.toString();
      },
      getCommandType(commandType) {
        var that = this;
        if (commandType == 'Approval') {
          return '提交';
        } else if (commandType == 'Reject') {
          return '退回';
        } else if (commandType == 'Referred') {
          return '转办';
        } else if (commandType == 'Circulated') {
          return '传阅';
        }
      },
      getUserType(userType) {
        var that = this;
        if (userType == '' || userType == undefined) return '';
        var titleArr = [];
        userType = $.isArray(userType) ? userType : userType.split(',');
        if ($.inArray('tasker', userType) > -1) {
          titleArr.push('待办人');
        } else if ($.inArray('cctasker', userType) > -1) {
          titleArr.push('待办人');
        }
        if ($.inArray('startor', userType) > -1) {
          titleArr.push('提单人');
        } else if ($.inArray('ccstartor', userType) > -1) {
          titleArr.push('提单人');
        }
        if ($.inArray('targetor', userType) > -1) {
          titleArr.push('指定人员');
        } else if ($.inArray('cctargetor', userType) > -1) {
          titleArr.push('指定人员');
        }
        return titleArr.toString();
      },
      deleteRowById(type, id) {
        var that = this;
        var temData = [];
        var data = that[type].params.configData;
        $.each(data, function (i, item) {
          if (item.id != id) {
            temData.push(item);
          }
        });
        that[type].params.configData = temData;
        that[type + '_dg'].reload({ data: temData });
      },
      deleteMessageTemplateRow(thisObj, type, id) {
        var that = this;
        FUI.Window.confirm('确定要删除吗？', '删除数据提示', function (r) {
          that.deleteRowById(type, id);
        });
      },
      operationFormatter(value, row, index) {
        var that = this;
        var type = this.theType;
        return "<span class='fa fa-close cur' id='operation-btn-delete' title='删除' onclick=\"proxyDeleteMessageTemplateRow(this,'" + type + "','" + row.id + "')\"></span>&nbsp; &nbsp;<span class='fa fa-edit cur' title='编辑' onclick=\"proxyEditMessageTemplate('Edit', '" + type + "','" + row.id + "')\"></span>";
      },
      selectFormField(inputId) {
        var that = this;
        var formKey = '';
        var wid = that.wid;
        // 通过wid转formKey
        WF.SelectorDialog.selectorFormField(that, '', wid, inputId, null, true, that.timeLimit.params);
      }
    }

  };

  window.proxyEditMessageTemplate = function (formAction, type, id) {
    window.myvm.editMessageTemplate(formAction, type, id);
  };
  window.proxyDeleteMessageTemplateRow = function (that, type, id) {
    window.myvm.deleteMessageTemplateRow(that, type, id);
  }
</script>