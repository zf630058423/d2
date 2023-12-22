<template>
  <div class="f2bpm-page-dialog-layout">
    <div>
      <el-form ref="formRef" :rules="formRules" size="small" :model="data" class="f2bpm-editform" label-width="100px">
        <el-form-item label="生成行数">
          <el-input-number v-model="data.rowNum" size="small" :min="1" :max="20" label="行数" />
        </el-form-item>
        <el-form-item v-if="deviceType!='mobile'" label="每行列数">
          <el-input-number v-model="data.colNum" size="small" :min="1" :max="4" label="列数" />
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        formDefId: '',
        deviceType: '',
        treeData: [],
         data: {
          rowNum: 2,
          colNum: 2
        },
         formRules: {
        }
      }
    },
    created: function() {
      var that = this
      var formDefId = Object.toQueryString('formDefId')
      var deviceType = Object.toQueryString('deviceType')
      if (deviceType == 'mobile') {
        that.data.colNum = 1
        that.data.rowNum = 1
      }
      that.formDefId = formDefId
      that.deviceType = deviceType
      window.myvm = this
    },
    methods: {
      closeEdit() {
        FUI.Window.closeEdit()
      },
       geteration() {
        var that = this
        var data = Object.toAjaxJson(FUI.Handlers.SmartFormHandler, 'getGenerationTempalte',
         { 'formDefId': that.formDefId, type: that.deviceType, rowNum: that.data.rowNum, colNum: that.data.colNum }, null, null, null, 'html')
        try {
          if (data == '') {
            FUI.Window.showMsg2('生成失败，请检查表单字段是否已配置')
            return false
          }
          var arr = eval('(' + data + ')')
          return arr
        } catch (e) {
          console.info(data)
          return false
        }
        return false
      },
       getResult() {
        return this.geteration()
      }
    }
  }

  window.getResult = function() {
    return myvm.getResult()
  }
</script>
