<template>
  <div class="f2bpm-page-dialog-layout">
    <div>
      <table class="common-FormTable" cellpadding="0" cellspacing="0">
        <tr>
          <td>【工具栏】自定义按钮权限：</td>
          <td>
            <div id="toolBarCustomButton" class="p10">
              <span v-for="btn in toolbartns" class="fa fa-cog cur mr10" @click="buttonPermissionSet(btn.buttonName,btn.buttonTitle)">{{ btn.buttonTitle }}</span>
            </div>
          </td>
        </tr>
        <tr>
          <td style="width: 200px;">【操作列】自定义按钮权限：</td>
          <td>
            <div id="operationCustomButton" class="p10">
              <span v-for="btn in opbtns" class="fa fa-cog cur mr10" @click="buttonPermissionSet(btn.buttonName,btn.buttonTitle)">{{ btn.buttonTitle }}</span>
            </div>
          </td>
        </tr>

      </table>
      <div class="dialogfooter2">
        <el-button id="btn_cancel" size="small" @click="closeEdit"><i class="fa fa-minus-circle" />关闭
        </el-button>
      </div>

    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        obTableName: '',
        appId: '',
        boId: '',
        rightId: '',
        formAction: null,
        opbtns: [],
        toolbartns: []
      }
    },
    created: function() {
      var that = this
      var boId = Object.toQueryString('boId') || ''
      var appId = Object.toQueryString('appId') || ''
      // bo对应的对象名
      var obTableName = Object.toQueryString('obTableName') || ''
      var rightId = Object.toQueryString('rightId')
      that.boId = boId
      that.appId = appId
      that.rightId = rightId
      that.obTableName = obTableName
      // 操作列自定义按钮Json
      var operationCustomButtonJson = '[]'
      // 工具栏自定义按钮Json
      var toolBarCustomButtonJson = '[]'
      var custBtns = Object.toAjaxJson(FUI.Handlers.SmartFormHandler, 'getBoSubTableCustButtonJson', { 'boId': boId })
      operationCustomButtonJson = custBtns.data.operationCustomButton
      toolBarCustomButtonJson = custBtns.data.toolBarCustomButton
      if (operationCustomButtonJson) {
        that.opbtns = typeof operationCustomButtonJson === 'string' ? eval('(' + operationCustomButtonJson + ')') : operationCustomButtonJson
      }
      if (toolBarCustomButtonJson) {
        that.toolbartns = toolBarCustomButtonJson
      }
    },
    methods: {
      // ===stand:标准化方法============
      closeEdit() {
        // stand:关闭编辑窗口
        FUI.Window.closeEdit()
      },
       buttonPermissionSet(actionName, title) {
        var that = this
        var fieldId = ''
        var parms = {
          fieldIds: that.obTableName + '.' + actionName,
          fieldtitles: title,
          type: 'button',
          'actionName': that.obTableName + '.' + actionName
        }
        var formFieldPermissionEditUrl = '/workflow/smartForm/formFieldPermissionEdit/?appId=' + that.appId + '&rightId=' + that.rightId
        FUI.Window.openEdit(formFieldPermissionEditUrl, '设置【' + title + '】按钮权限', FUI.FormAction.Edit, '', 880, 580, null, null, fieldId, false, null, parms)
      }
    }
  }
</script>
