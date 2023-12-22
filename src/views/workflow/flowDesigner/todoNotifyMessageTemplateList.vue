<template>
  <div class="f2bpm-page-dialog-layout">
    <div class="line">
      <div style="padding: 5px;">
        <div>
          是否启用：
          <el-switch v-model="taskNotifyData.params.isEnableTaskNotify" active-color="#13ce66" inactive-color="#DEDEDE" active-value="1" inactive-value="0" />
          <br> <br>
          <span class="cur" @click="editMessageTemplate('Add','taskNotify')">
            <i class="fa fa-plus" />添加配置
          </span>
          <div style="width: 900px;overflow: auto;">
            <table id="taskNotify_table" />
          </div>

        </div>
      </div>
      <div class="dialogfooter">
        <a href="javascript:void(0);" role="button" class="btn btn-primary btn-sm mr2" @click="saveAndClose()"><i class="fa fa-save" />确定</a>
        <a href="javascript:void(0);" role="button" class="btn btn-primary btn-sm" @click="closeEdit"><i class="fa fa-minus-circle" />取消</a>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        attrName: '',
        wid: '',
        dg: null,
        taskNotifyData: { opttype: 'taskNotify', params: { isEnableTaskNotify: false, configData: [] } },
        tableData: [],
        tableColumn: [{
          field: 'commandType',
          title: '动作类型',
          width: 60,
          formatter: 'getCommandType'
        }, {
          field: 'messageType',
          title: '消息发送方式',
          width: 130,
          formatter: 'getMessageTypeTitle'
        }, {
          field: 'title',
          title:this.$t('title'),
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
      }
    },
    created: function () {
      var that = this
      var obj
      var wid = ''
      var attrName = null
      // obj.value格式：[{opttype:taskNotify,params:{isEnableTaskNotify:false,configData:[]}}]
      obj = parent.window.currentWindowTargetObjectValue
      var value = obj.value || []
      var title = obj.title
      var otherParm = eval('(' + obj.otherParm + ')')
      that.wid = otherParm.wid
      attrName = obj.name
      if (value != null && value != '' && Object.toStartWith(value, '#')) {
        value = value.toString().substr(1, value.toString().length - 2)
        value = Object.toStringToJson(value)
      }
      $.each(value, function (i, jsonObj) {
        if (jsonObj.opttype == 'taskNotify') {
          that.taskNotifyData = jsonObj
        }
      })
      that.attrName = attrName
      that.loadtaskNotifyData()
    },
    mounted() {
      var that = this
      var dg = FUI.DataTable.Create('taskNotify_table')
      dg.$vm = that
      dg.SortName = 'commandType'
      dg.Columns = that.tableColumn
      dg.Data = that.tableData
      dg.Bind()
      that.dg = dg
      window.myvm = that
    },
    methods: {
      closeEdit() {
        FUI.Window.closeEdit()
      },
      saveAndClose() {
        var that = this
        FUI.Window.confirm(that, '您确定要提交保存？', '温馨提示', function () {
          var data = []
          var taskNotifyObject = that.taskNotifyData
          data.push(taskNotifyObject)
          var resultStr = JSON.stringify(data)
          if (resultStr == '[]') {
            parent.setTargetValue('')
          } else {
            resultStr = '#' + resultStr + '#'
            parent.setTargetValue(that.attrName, resultStr)
          }
          FUI.Window.closeEditAll()
        })
      },
      loadtaskNotifyData() {
        var that = this
        var jsonObj = that.taskNotifyData
        if (jsonObj && jsonObj.params != undefined && jsonObj.params.configData != null) {
          that.tableData = jsonObj.params.configData
        }
      },
      getResult() {
        var that = this
        return JSON.stringify(that.content)
      },
      // 消息模板配置列表
      editMessageTemplate(formAction, type, id) {
        var that = this
        var itemData = null
        var title = '新增配置'
        if (formAction == 'Edit') {
          title = '编辑配置'
          itemData = that.getItemData(id, type)
        }
        var parm = { data: itemData }// 页面传参
        FUI.dialog(__webpath + '/workflow/flowDesigner/messageTemplateEdit/?wid=' + that.wid + '&formAction=' + formAction + '&type=' + type, title, parm, 860, 550,
          function (json, index, layer) {
            if (json != false) {
              // 回调函数
              if (type == 'taskNotify') {
                if (json.formAction == 'Edit') {
                  that.deleteRowById(type, json.id)
                }
                that.taskNotifyData.params.configData.push(json)
                that.loadtaskNotifyData()
                that.dg.reload({ data: that.tableData })
              }
              layer.close(index)
            }
          }, true, { fit: false, btnAlign: 'c' }, { sure: { text: '确定' } })
      },
      getItemData(id, type) {
        var that = this
        var data = []
        if (type == 'taskNotify') {
          data = that.tableData
        }
        var result = null
        $.each(data, function (i, item) {
          if (item.id == id) {
            result = item
            return false
          }
        })
        return result
      },

      getMessageTypeTitle(messageType) {
        var that = this
        if (messageType == '' || messageType == undefined) return ''
        var titleArr = []
        messageType = $.isArray(messageType) ? messageType : messageType.split(',')
        if ($.inArray('sms', messageType) > -1) {
          titleArr.push('短信')
        }
        if ($.inArray('email', messageType) > -1) {
          titleArr.push('邮件')
        }
        if ($.inArray('syswindow', messageType) > -1) {
          titleArr.push('站内消息')
        }
        if ($.inArray('im', messageType) > -1) {
          titleArr.push('即时通讯')
        }
        return titleArr.toString()
      },
      getCommandType(commandType) {
        var that = this
        if (commandType == 'Approval') {
          return '待办'
        } else if (commandType == 'Reject') {
          return '驳回'
        } else if (commandType == 'Referred') {
          return '转办'
        } else if (commandType == 'Circulated') {
          return '传阅'
        } else if (commandType == "Invalid") {
          return "作废";
        } else if (commandType == "Withdraw") {
          return "撤回";
        }
      },
      getUserType(userType) {
        var that = this
        if (userType == '' || userType == undefined) return ''
        var titleArr = []
        userType = $.isArray(userType) ? userType : userType.split(',')
        if ($.inArray('tasker', userType) > -1) {
          titleArr.push('待办人')
        } else if ($.inArray('cctasker', userType) > -1) {
          titleArr.push('待办人')
        }
        if ($.inArray('startor', userType) > -1) {
          titleArr.push('提单人')
        } else if ($.inArray('ccstartor', userType) > -1) {
          titleArr.push('提单人')
        }
        if ($.inArray('targetor', userType) > -1) {
          titleArr.push('指定人员')
        } else if ($.inArray('cctargetor', userType) > -1) {
          titleArr.push('指定人员')
        }
        return titleArr.toString()
      },
      deleteRowById(type, id) {
        var that = this
        var temData = []
        var data = []
        if (type == 'taskNotify') {
          data = that.taskNotifyData.params.configData
        }
        $.each(data, function (i, item) {
          if (item.id != id) {
            temData.push(item)
          }
        })
        if (type == 'taskNotify') {
          that.taskNotifyData.params.configData = temData
          that.loadtaskNotifyData()
          that.dg.reload({ data: that.tableData })
        }
      },
      deleteMessageTemplateRow(thisObj, type, id) {
        var that = this
        FUI.Window.confirm('确定要删除吗？', '删除数据提示', function (r) {
          that.deleteRowById(type, id)
        })
      },
      operationFormatter(value, row, index) {
        var that = this
        var type = 'taskNotify'
        return "<span class='fa fa-close cur' id='operation-btn-delete' title='删除' onclick=\"proxyDeleteMessageTemplateRow(this,'" + type + "','" + row.id + "')\"></span>&nbsp; &nbsp;<span class='fa fa-edit cur' title='编辑' onclick=\"proxyEditMessageTemplate('Edit', '" + type + "','" + row.id + "')\"></span>"
      }
    }

  }
  window.proxyEditMessageTemplate = function (formAction, type, id) {
    myvm.editMessageTemplate(formAction, type, id)
  }
  window.proxyDeleteMessageTemplateRow = function (that, type, id) {
    myvm.deleteMessageTemplateRow(that, type, id)
  }
</script>