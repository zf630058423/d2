<template>
  <div class="f2bpm-page-dialog-layout">
    <el-form ref="formRef" :rules="formRules" size="small" :model="data" class="f2bpm-editform" label-width="120px">
      <el-form-item label="任务标题" prop="JobTitle">
        <el-input v-model="data.JobTitle" placeholder="中文标题" @blur.native.capture="toPinYin('JobTitle','JobName')" />
      </el-form-item>
      <el-form-item label="任务名称" prop="JobName">
        <el-input v-model="data.JobName" placeholder="Java bean的名称" />
      </el-form-item>
      <el-form-item label="类全名" prop="AssemblyName">
        <el-input v-model="data.AssemblyName" placeholder="类的全路径名" />
      </el-form-item>
      <el-form-item label="执行周期" prop="Cron">
        <el-input v-model="data.Cron" placeholder="quartz参数格式：秒  分  时  日  月  星期 年；示例 0 59 23 * * ?" />
        <div>
          示例参考：严禁频率小于1小时的周期，避免造成服务器资源压力过大。
          <br>【每隔5秒执行一次：*/5 * * * * ?】
          【每1分钟执行一次：0 */1 * * * ?】
          【每1小时执行一次：0 0 */1 * * ?】
          【每2小时执行一次：0 0 */2 * * ?】
          【每2小时执行一次,从整点开始：0 0 0/2 * * ?】
          【每天23点执行一次：0 0 23 * * ?】
          【每天凌晨1点执行一次：0 0 1 * * ?】
          【每月1号凌晨1点执行一次：0 0 1 1 * ?】
          【每月最后一天23点执行一次：0 0 23 L * ?】
          【每周星期天凌晨1点实行一次：0 0 1 ? * L】
          【每小时的26分、29分、33分执行一次：0 26,29,33 * * * ?】
          【每天的0点、13点、18点、21点都执行一次：0 0 0,13,18,21 * * ?】
        </div>
      </el-form-item>
      <el-form-item label="自定义参数" prop="Params">
        <el-input v-model="data.Params" placeholder="自定义参数如： A:a,B:b" />
      </el-form-item>
      <el-form-item label="是否启用" prop="IsEnable">
        <el-switch v-model="data.IsEnable" :inactive-value="0" :active-value="1" active-color="#13ce66" inactive-color="#DEDEDE" />
      </el-form-item>
      <el-form-item label="备注" prop="Remark">
        <el-input v-model="data.Remark" type="textarea" :rows="4" placeholder="备注" />
      </el-form-item>
      <div class="dialogfooter2">
        <el-button v-if="formAction!='View'" size="small" type="primary" @click="submitForm()"><i class="fa fa-save" />保存
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
        treeData: [],
         data: {
          JobName: '',
          JobTitle: '',
          AssemblyName: '',
          Cron: '',
          Params: '',
          IsEnable: 1,
          Remark: '',
          CreatorRealName: '',
          LastUpdatorName: '',
          LastUpdateTime: '',
          CreatedTime: ''
        },
         formRules: {
          JobTitle: [
            { required: true, message: '必填项不能为空' }
          ],
          JobName: [
            { required: true, message: '必填项不能为空' },
            { validator: FUI.Validator.englisthOrChar }
          ],
           AssemblyName: [
            { required: true, message: '必填项不能为空' }
          ],
          Cron: [
            { required: true, message: '必填项不能为空' }
          ]
        }
      }
    },
    created: function() {
      var that = this
      var isOnlyMySelf = Object.toQueryString('isOnlyMySelf')
      that.isOnlyMySelf = isOnlyMySelf
      that.formAction = formAction
      const currUser = FUI.Sys.getAuthor()
      if (formAction == FUI.FormAction.Add) {
        that.data.CreatorId = currUser.userId
        that.data.CreatorRealName = decodeURI(currUser.realName)
        that.data.LastUpdatorName = decodeURI(currUser.realName)
        that.data.CreatedTime = Object.toGetCurrentDateTimeString()
        that.data.LastUpdateTime = Object.toGetCurrentDateTimeString()
        that.data.TenantId = currUser.tenantId
      } else {
        that.data.LastUpdatorName = decodeURI(currUser.realName)
        that.data.LastUpdateTime = Object.toGetCurrentDateTimeString()
      }
      that.loadData()
    },
    methods: {
      closeEdit() {
        FUI.Window.closeEdit()
      },
       loadData() {
        var that = this
        if (formAction != FUI.FormAction.Add) {
          FUI.Form.bindDataToForm(that, FUI.Handlers.FuiFrameworkHandler, FUI.Method.AutoGetViewModelMethod, keyId, null, mainTable)
        }
      },
       submitForm() {
        var that = this
        var success = that.validateForm('formRef')
        if (!success) return
        FUI.Form.submitForm(that, that.data, '/workflow/security/taskJob/', 'save', formAction, keyId, parentGridId, mainTable)
      },
       validateForm(refFormName) {
        // stand:表单校验
        var success = false
        this.$refs[refFormName].validate(valid => {
          success = valid
        })
        return success
      },
       selectorUserString(inputKey, inputName, passParm, singleSelect, keyName) {
        var that = this
        WF.SelectorDialog.selectorUserString(that, inputKey, inputName, passParm, singleSelect, keyName)
      },
       selectorUserTextValue(inputKey, inputName, passParm, singleSelect, keyName) {
        var that = this
        WF.SelectorDialog.selectorUserTextValue(that, inputKey, inputName, passParm, singleSelect, keyName)
      },
       clearSelectedUsers(inputId, inputName) {
        var that = this
        that.data[inputId] = ''
        that.data[inputName] = ''
      },
       toPinYin(sourceField, targetField) {
        if (!this.data[targetField]) {
          const source = this.data[sourceField]
          this.data[targetField] = Object.toPinYin(source)
        }
      }
    }
  }
</script>
