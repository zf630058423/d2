<template>
  <div class="f2bpm-page-dialog-layout">
    <table class="common-FormTable" cellpadding="0" cellspacing="0">
      <tr>
        <td style="width: 200px;" class="leftTdbg"> 默认按钮权限：</td>
        <td>
          <div class="p10">
            <span class="fa fa-cog cur mr10" @click="buttonPermissionSet('default.add','新增')">新增</span>
            <span class="fa fa-cog cur mr10" @click="buttonPermissionSet('default.edit','编辑')">编辑</span>
            <span class="fa fa-cog cur mr10" @click="buttonPermissionSet('default.delete','删除')"> 删除</span>
            <span class="fa fa-cog cur mr10" @click="buttonPermissionSet('default.view','查看详情')">查看详情</span>
            <span class="fa fa-cog cur mr10" @click="buttonPermissionSet('default.startWorkflow','发起流程按钮')">发起流程按钮</span>
          </div>
        </td>
      </tr>
      <tr>
        <td style="width: 200px;" class="leftTdbg">工具栏自定义按钮权限：</td>
        <td>
          <div id="toolBarCustomButton" class="p10">
            <span v-for="item in toolBarCustomButton" class="fa fa-cog cur mr10" @click="buttonPermissionSet(item.buttonName,item.buttonTitle)">{{ item.buttonTitle }}</span>
          </div>
        </td>
      </tr>
      <tr>
        <td style="width: 200px;" class="leftTdbg">操作列按钮权限：</td>
        <td>
          <div id="operationCustomButton" class="p10">
            <span v-for="item in operationCustomButton" class="fa fa-cog cur mr10" @click="buttonPermissionSet(item.buttonName,item.buttonTitle)">{{ item.buttonTitle }}</span>
          </div>
        </td>
      </tr>
    </table>
    <div class="dialogfooter">
      <el-button id="btn_cancel" size="small" @click="closeEdit"><i class="fa fa-minus-circle" />关闭
      </el-button>
    </div>
    </el-form>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        dataGridId: '',
        rightId: '',
        formAction: null,
        toolBarCustomButton: [],
         operationCustomButton: [],
         data: {

        }
      }
    },
    created: function() {
      var that = this
      var dataGridId = Object.toQueryString('dataGridId') || ''
      that.dataGridId = dataGridId
      // 工具栏自定义按钮Json
      var buttons = []
      var res = Object.toAjaxJson(FUI.Handlers.CustomDataGridHandler, 'getCustomButtonAndRightId', { 'dataGridId': dataGridId })
      var rightId = res.data.rightId
      that.rightId = rightId
      that.toolBarCustomButton = res.data.toolBarCustomButton
      that.operationCustomButton = res.data.operationCustomButton
    },
    methods: {
      // ===stand:标准化方法============
      closeEdit() {
        // stand:关闭编辑窗口
        FUI.Window.closeEdit()
      },
       buttonPermissionSet(actionName, title) {
        var that = this
        var formFieldPermissionEditUrl = '/workflow/smartForm/formFieldPermissionEdit/?rightId=' + that.rightId
        var parms = {
          fieldIds: actionName,
          fieldtitles: title,
          type: 'button',
          'actionName': actionName
        }
        FUI.Window.openEdit(formFieldPermissionEditUrl, '设置【' + title + '】按钮权限', FUI.FormAction.Edit, '', 880, 580, null, null, '', true, null, parms)
      }
    }
  }
</script>
