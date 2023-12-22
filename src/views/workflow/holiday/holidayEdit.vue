<template>
  <div>
    <el-form ref="formRef" :rules="formRules" size="small" :model="data" class="f2bpm-editform" label-width="120px">
      <el-row>
        <el-col :span="12">
          <el-form-item label="假期类别" prop="dayType">
            <el-select v-model="data.dayType">
              <el-option label="休息日" value="Holiday" />
              <el-option label="工作日" value="WorkDay" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="假期日期" prop="holidayTime">
            <el-date-picker v-model="data.holidayTime" size="mini" type="date" class="textBoxShort" format="yyyy-MM-dd" value-format="yyyy-MM-dd" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item label="最近修改者">
            <el-input v-model="data.lastUpdator" :disabled="true" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="最近修时间">
            <el-input v-model="data.lastUpdateTime" :disabled="true">></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="日期名称" prop="holidayName">
        <el-input v-model="data.holidayName" placeholder="日期名称" />
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="data.remark" type="textarea" :rows="4" placeholder="备注" />
      </el-form-item>
      <div class="dialogfooter">
        <el-button v-if="formAction!='View'" size="small" type="primary" @click="submitForm()"><i class="fa fa-save" />保存
        </el-button>
        <el-button v-if="formAction=='Edit'" size="small" type="danger" @click="deleteEvent()"><i class="fa fa-trash-o" />删除
        </el-button>
        <el-button id="btn_cancel" size="small" @click="closeEdit"><i class="fa fa-minus-circle" />取消
        </el-button>

      </div>
    </el-form>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        formAction: null,
        isOnlyMySelf: 1,
        treeData: [],
         data: {
          iD: '',
          dayType: 'Holiday',
          OrderNum: 1,
          holidayTime: '',
          lastUpdator: '',
          lastUpdateTime: '',
          holidayName: '',
          remark: '',
          businessType: 'Public'
        },

         formRules: {
          dayType: [
            { required: true, message: '必填项不能为空' }
          ],
          holidayTime: [
            { required: true, message: '必填项不能为空' }
          ],
          holidayName: [
            { required: true, message: '必填项不能为空' }
          ]
        }
      }
    },
    created: function() {
      var that = this
      that.formAction = formAction
      if (formAction == FUI.FormAction.Add) {
        var holidayTime = Object.toQueryString('holidayTime') || ''
        that.data.holidayTime = holidayTime
        const currUser = FUI.Sys.getAuthor()
        keyId = Object.toGuid()
        that.data.iD = keyId
        that.data.lastUpdator = decodeURI(currUser.realName)
        that.data.lastUpdateTime = Object.toGetCurrentDateTimeString()
      }
      if (formAction != FUI.FormAction.Add) {
        that.loadData()
      }
    },
    methods: {
      closeEdit() {
        FUI.Window.closeEdit()
      },
       loadData() {
        var that = this
        if (formAction != FUI.FormAction.Add) {
          FUI.Form.bindDataToForm(that, FUI.Handlers.WorkflowManageHandler, 'getModelHoliday', keyId, null, mainTable)
        }
      },
       submitForm() {
        var that = this
        var success = that.validateForm('formRef')
        if (!success) return
        FUI.Form.submitForm(that, that.data, FUI.Handlers.WorkflowManageHandler, 'saveHoliday', formAction, keyId, parentGridId, mainTable, null, null, null, function(msg) {
          if (msg.success) {
            var id = that.data.iD
            var dayType = that.data.dayType

            var title = that.data.holidayName
            var start = that.data.holidayTime
            var end = that.data.holidayTime
            if (formAction == 'Edit') {
              if (parent.UpdateEvent != null) { parent.UpdateEvent(id, title, start, end, dayType) }
            } else if (formAction == 'Add') {
              if (parent.refetchEvents != null) {
                parent.AddEvent(id, title, start, end, dayType)
              }
            }
            FUI.Window.closeEdit()
          } else {
            FUI.Window.showMsg(msg.Message)
          }
        })
      },

       validateForm(refFormName) {
        // stand:表单校验
        var success = false
        this.$refs[refFormName].validate(valid => {
          success = valid
        })
        return success
      },
       deleteEvent() {
        var that = this
        Object.toAjaxJson(FUI.Handlers.WorkflowManageHandler, 'deleteHoliday', { keyId: keyId }, true, null, function(data) {
          if (data.success) {
            if (parent.DeleteEvent != null) {
              parent.DeleteEvent(keyId)
            }
            FUI.Window.showMsg2(that, data.msg, null, 'info', function() {
              FUI.Window.closeEdit()
            })
          } else {
            FUI.Window.showMsg(data.msg)
          }
        })
      }
    }
  }
</script>
