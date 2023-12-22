<template>
  <div class="f2bpm-page-dialog-layout">
    <el-form ref="formRef" :rules="formRules" size="small" :model="data" class="f2bpm-editform" label-width="120px">
      <el-form-item label="名称" prop="Name">
        <el-input v-model="data.Name" placeholder="" />
      </el-form-item>
      <el-form-item label="JS对象名" prop="JsMethod">
        <el-input v-model="data.JsMethod" placeholder="" />
      </el-form-item>
      <el-form-item label="系统预设" prop="IsSystem">
        <el-select v-model="data.IsSystem">
          <el-option label="请选择" value="" />
          <el-option label="是" :value="1" />
          <el-option label="否" :value="0" />
        </el-select>
      </el-form-item>
      <el-form-item label="备注说明" prop="Remark">
        <el-input v-model="data.Remark" type="textarea" :rows="4" placeholder="备注说明" />
      </el-form-item>
      <div class="dialogfooter2">
        <el-button v-if="formAction!='View'" size="small" type="primary" @click="submitForm()"><i class="fa fa-save" />保存
        </el-button>
        <el-button id="btn_cancel" size="small" @click="closeEdit"><i class="fa fa-minus-circle" />取消
        </el-button>
      </div>
    </el-form>
    <a role="button" href="javascript:void(0)" class="btn btn-primary btn-sm mr2" @click="addParm(this);"><i class="fa fa-plus" />添加参数</a>
    <div id="parmList">
      <table id="parmTable" class="common-grid">
        <tr>
          <td>参数标题</td>
          <td>参数属性</td>
        </tr>
        <tr v-for="item in paramsData">
          <td>
            <el-input v-model="item.title" size="small" placeholder="" />
          </td>
          <td>
            <el-input v-model="item.property" size="small" placeholder="" />
          </td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        formAction: null,
        paramsData: [],
         data: {
          TenantId: '',
          ConfKey: '',
          IsSystem: 0
        },
        // stand:表单校验规则
         formRules: {
          Name: [
            { required: true, message: '必填项不能为空' }
          ],
          JsMethod: [
            { required: true, message: '必填项不能为空' }
          ]
        }
      }
    },
    created: function() {
      var that = this
      var tenantId = Object.toQueryString('tenantId')
      that.formAction = formAction
      if (formAction == FUI.FormAction.Add) {
        that.data.TenantId = tenantId
      }
      that.loadData()
    },
    methods: {
      // ===stand:标准化方法============
      closeEdit() {
        // stand:关闭编辑窗口
        FUI.Window.closeEdit()
      },
      // ===stand:标准化方法结束============
       loadData() {
        var that = this
        if (formAction != FUI.FormAction.Add) {
          FUI.Form.bindDataToForm(that, FUI.Handlers.FuiFrameworkHandler, FUI.Method.AutoGetViewModelMethod, keyId, null, mainTable)
          that.paramsData = eval('(' + that.data.ConfKey.replace(/\\/g, '') + ')')
        }
      },
       submitForm() {
        var that = this
        var success = that.validateForm('formRef')
        if (!success) return
        that.data.ConfKey = JSON.stringify(that.paramsData)
        FUI.Form.submitForm(that, that.data, FUI.Handlers.FuiFrameworkHandler, FUI.Method.AutoSaveMethod, formAction, keyId, parentGridId, mainTable)
      },
       validateForm(refFormName) {
        // stand:表单校验
        var success = false
        this.$refs[refFormName].validate(valid => {
          success = valid
        })
        return success
      },
       addParm() {
        var that = this
        that.paramsData.push({ title: '', property: '' })
      }
    }
  }
</script>
