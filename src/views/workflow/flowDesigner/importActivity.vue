<template>
  <div>
    <el-form ref="formRef" size="mini" :model="data" class="f2bpm-editform" label-width="110px">
      <el-form-item label="选择流程">
        <f2bpmui-select style="width: 90%;" sqlkey="CB_MasterWorkflowList" field="workflowId" :fieldvalue="data.workflowId" @updatevalue="updateFieldValue" />
      </el-form-item>

      <el-form-item label="选择节点">
        <span class="cube bg-blue   font12  " style=" min-width: 180px;display: inline-block;height: 30px; line-height:24px;" v-html="data.activityDes" />
        <span class="ml10"> <a id="selectDataService" href="javascript:void(0)" title="选择节点" @click="selectActivity('activityJson','activityDes')"><i class="fa fa-search" />选择 </a> </span>
        <i class="fa fa-minus-circle bigger-120 red" @click="onClearEmpty">清空</i>
      </el-form-item>
    </el-form>
    <div class="dialogfooter2">
      <a role="button" href="javascript:void(0)" class="btn btn-primary btn-sm mr2" @click="save"><i class="fa fa-save" />确定</a>
      <a role="button" href="javascript:void(0)" class="btn  btn-sm btn-primary " @click="closeEdit"><i class="fa fa-minus-circle" />取消</a>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        data: {
          workflowId: '',
          activityJson: '',
          activityDes: ''
        }
      }
    },
    created: function() {

    },
    methods: {
      // ===stand:标准化方法============
      closeEdit() {
        // stand:关闭编辑窗口
        FUI.Window.closeEdit()
      },
       selectActivity(inputId, inputText) {
        var that = this
        var wid = that.data.workflowId
        if (wid == '') {
          FUI.Window.showMsg('请选择流程')
          return false
        }
        WF.SelectorDialog.selectorTextValue(that, inputId, inputText, 'HistoryActivity', { 'wid': wid })
      },
       onClearEmpty() {
        var that = this
        that.data.activityJson = ''
        that.data.activityDes = ''
      },
      // ===stand:标准化方法结束============
       save() {
        var that = this
        var sourceActivityJson = that.data.activityJson
        var sourceWid = that.data.workflowId
        var wid = Object.toQueryString('wid')
        if (sourceWid == '') {
          FUI.Window.showMsg('请选择流程')
          return false
        }
        if (sourceActivityJson == '') {
          FUI.Window.showMsg('请选择流程节点')
          return false
        }
        FUI.Window.confirm('您确定要提交导入吗？', '温馨提示', function(r) {
          if (r) {
            var data = Object.toAjaxJson('/workflow/processDef/', 'saveImportActivity', {
              'sourceActivityJson': sourceActivityJson,
              'sourceWid': sourceWid,
              'wid': wid
            })
            FUI.Window.showMsg(data.msg, null, data.success ? 1 : 7, function() {
              if (data.success) {
                window.parent.window.location.reload()
                FUI.Window.closeEdit()
              }
            })
          }
        })
      },
       updateFieldValue(fieldName, newVal) {
        var that = this
        that.data[fieldName] = newVal
      }
    }
  }
</script>
