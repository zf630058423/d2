<template>
  <div class="f2bpm-page-layout">
    <div>
      <table class="common-FormTable" cellpadding="0" cellspacing="0">
        <tr>
          <td style="width: 200px;" class="leftTdbg">自定义按钮权限：</td>
          <td>
            <div id="toolBarCustomButton" class="p10">
              <span v-for="item in buttons" class="fa fa-cog cur mr10" @click="buttonPermissionSet(item.buttonName,item.buttonTitle)">{{ item.buttonTitle }}</span>
            </div>
          </td>
        </tr>
      </table>
      <div class="dialogfooter2">
        <el-button id="btn_cancel" size="small" @click="closeEdit"><i class="fa fa-minus-circle" />关闭
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
        appId: '',
        rightId: '',
        formAction: null,
        buttons: [],
         data: {

        }
      }
    },
    created: function() {
      var that = this
      var appId = Object.toQueryString('appId') || ''
      var formId = Object.toQueryString('formId') || ''
      that.appId = appId
      // 工具栏自定义按钮Json
      var buttons = []
      var res = Object.toAjaxJson('/workflow/formPermission/', 'getFormCustButtonPermission', { formId: formId, appId: appId })
      console.info(res)
      var rightId = res.data.rightId
      that.rightId = rightId
      buttons = res.data.toolBarCustomButton
      that.buttons = buttons
    },
    methods: {
      // ===stand:标准化方法============
      closeEdit() {
        // stand:关闭编辑窗口
        FUI.Window.closeEdit()
      },
       buttonPermissionSet(actionName, title) {
        var that = this
        var formFieldPermissionEditUrl = '/workflow/smartForm/formFieldPermissionEdit/?appId=' + that.appId + '&rightId=' + that.rightId
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
