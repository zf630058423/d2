<template>
  <div class="f2bpm-page-dialog-layout  f2bpm-page-right">
    <el-form ref="formRef" size="small" :rules="formRules" :model="data" class="f2bpm-editform" label-width="120px">
      <el-form-item label="流程分类" prop="appCategoryID">
        <treeselect v-model="data.appCategoryID" placeholder="请选择分类" :default-expand-level="2" :multiple="false" :options="treeData" />
      </el-form-item>
      <el-form-item label="流程名称" prop="appName">
        <el-input v-model="data.appName" placeholder="" />
      </el-form-item>
      <el-row>
        <el-col :span="12">
          <el-form-item label="流程应用ID" prop="appId">
            <el-input v-model="data.appId" :disabled="formAction=='Edit'" placeholder="长度只能由2位或4位字母组成，建议使用两位大写英文字母，流程应用ID无需一定要有意义，仅作为英文唯一值ID。" />
            <span v-if="formAction=='Add'" style="font-size: 10px;">（新增后将不可修改）</span><span v-if="formAction=='Edit'" style="font-size: 10px;" class="cube bg-gree">已发起流程实例数：{{ appIdInstCount }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="是否启用">
            <el-switch v-model="data.enable" active-color="#87DC48" inactive-color="#DEDEDE" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="表单应用" prop="formKey">
            <el-input v-if="!(isNoneProcessForm)" v-model="data.formName" placeholder="请选择表单应用" :disabled="formAction=='Edit'">
              <template v-if="isCanModify" slot="append"><i class="fa fa-search cur" @click="onFrmKeySelect">选择</i>
              </template>
            </el-input>
            <span style="font-size: 10px;"><span v-if="isCanModify" title="是指只使用流程不使用表单，运行时无在线表单，只使用流程的审批流转。">无需表单<el-switch v-model="isNoneProcessForm" size="mini" active-color="#87DC48" inactive-color="#DEDEDE" @change="changeIsNoneProcessForm" /></span> <span v-if="!isNoneProcessForm">（产生流程实例之后不可修改）</span></span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="表单KEY">
            <span class="cube bg-blue" v-html="data.formKey" /> <span v-if="data.formKey!='NoneForm'" title="打开表单设计" class="fa fa-cog cur   ml5 mr5 font10" @click="openOnlineFormDesigner">表单设计</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-form-item label="显示顺序" prop="showOrder">
            <el-input-number v-model="data.showOrder" placeholder="" />
            </el-input-number>
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item label="手机端发起" prop="isMobileStart">
            <el-switch v-model="data.isMobileStart" active-color="#87DC48" inactive-color="#DEDEDE" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="手机端审批" prop="isMobileApproval">
            <el-switch v-model="data.isMobileApproval" active-color="#87DC48" inactive-color="#DEDEDE" />
          </el-form-item>
        </el-col>
        <el-col v-if="!isNoneProcessForm" :span="6">
          <el-form-item label="表单快照留痕">
            <el-switch v-model="data.isSnapshot" active-color="#87DC48" inactive-color="#DEDEDE" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="标题模板">
        <el-input v-model="data.titleTemplate" type="textarea" :rows="4" placeholder="流程发起时的标题模板" />
        <span class="fa fa-search cur" @click="selectVar('titleTemplate')">选择变量</span>
      </el-form-item>
      <el-form-item label="应用说明">
        <el-input v-model="data.description" type="textarea" :rows="4" placeholder="" />
      </el-form-item>
      <div class="dialogfooter2">
        <el-button v-if="formAction=='Edit'" size="small" type="primary" @click="submitForm(0)"><i class="fa fa-save" />保存
        </el-button>
      </div>
    </el-form>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        // 表单绑定当天内可修改
        appIdInstCount: 0,
        isCanModify: true,
        actionName: 'goProcessAppEdit',
        isNoneProcessForm: false,
        formAction: null,
        loading: false,
        treeData: [],
         data: {
          appId: '',
          appCategoryID: null,
          workflowKey: '',
          formKey: '',
          formName: '',
          workflowName: '',
          creatorRealName: '',
          workflowDefTitle: '',
          titleTemplate: '#WorkflowName#',
          createdTime: null,
          showOrder: 0,
          enable: true,
          isSnapshot: false
        },
        // stand:表单校验规则
         formRules: {
          showOrder: [
            { required: true, validator: FUI.Validator.required },
            { validator: FUI.Validator.number }
          ],
          appCategoryID: [
            { required: true, message: '请选择分类' }
          ],
          formKey: [
            { required: true, message: '请选择“表单应用”或选择“无需表单”按钮' }
          ],
          workflowKey: [
            { required: true, message: '请选择流程定义' }
          ],
          appName: [
            { required: true, message: '名称不能为空' },
            { type: 'string', min: 2, message: '长度不能小于2' }
          ],
          appId: [
            { required: true, message: '流程应用ID不能为空' },
            { type: 'string', min: 2, max: 4, message: '流程应用ID长度只能是2位或4位，无需一定要有意义，仅作为流程应用的唯一值ID使用。' },
            { validator: FUI.Validator.onlyBigEnglisthChar }
          ]
        }
      }
    },
    created: function() {
      var that = this
      that.formAction = formAction
      that.keyId = keyId
      if (formAction == FUI.FormAction.Add) {
        that.loadNewAppId()
        that.data.workflowKey = Object.toGetCurrentDateTimeMillisecond()
      }
      that.loadTreeSelect()
      that.loadData()
    },
    methods: {
      // ===stand:标准化方法============
      closeEdit() {
        // stand:关闭编辑窗口
        FUI.Window.closeEdit()
      },
       changeIsNoneProcessForm(v) {
        var that = this
        if (v) {
          that.data.formKey = 'NoneForm'
          that.data.formName = '无需表单'
          that.data.isSnapshot = false
        } else {
          that.data.formKey = ''
          that.data.formName = ''
        }
      },
       loadNewAppId() {
        var that = this
        var res = Object.toAjaxJson(FUI.Handlers.WorkflowManageHandler, 'getAutoNewAppId', null)
        if (res.success) {
          that.data.appId = res.data
        }
      },
      // ===stand:标准化方法结束============
       loadData() {
        var that = this
        if (formAction != FUI.FormAction.Add) {
          FUI.Form.bindDataToForm(that, FUI.Handlers.WorkflowManageHandler, 'getOneProcessApp', keyId, null, mainTable)
          var createday = Object.toDateFormatDate(that.data.createdTime, 'yyyy-MM-dd')
          var today = Object.toGetCurrentDateString()

          // 是否为无需表单
          that.isNoneProcessForm = that.data.formKey == 'NoneForm'
          if (that.isNoneProcessForm) {
            that.isCanModify = true
          } else {
            // 检查是否有产生流程实例
            var res = Object.toAjaxJson(FUI.Handlers.WorkflowManageHandler, 'getCountAppIdInProcessInstAll', { appId: that.data.appId })
            if (res.success) {
              that.appIdInstCount = res.data
              that.isCanModify = that.appIdInstCount == 0
            }
          }
        }
      },
       loadTreeSelect() {
        var that = this
        var treeUrl = FUI.Handlers.CategoryHandler + '?groupKey=WorkflowGroup&needRoot=false'
        Object.toAjaxJson(treeUrl, null, null, true, null, function(res) {
          if (res.success) {
            that.treeData = res.data
          } else {
            that.$message.error(
              res.msg
            )
          }
        })
      },
       submitForm(isGoNext) {
        var that = this
        if (that.data.formType == 'OnlineForm' && that.data.formDefId == '') {
          FUI.Window.showMsg(that, '请选择在线表单')
          return false
        } else if (that.data.formType != 'OnlineForm') {
          that.data.formDefId = ''
          that.data.refFormDefName = ''
        }
        if (that.data.appId.length != 2 && that.data.appId.length != 4) {
          FUI.Window.showMsg(that, '流程应用ID长度只能是由2位或4位的英文组成，无需一定要有意义，仅作为流程应用的唯一值ID使用。')
          return false
        }

        if (that.formAction == FUI.FormAction.Add) {
          that.data.workflowKey = that.data.appId + '_' + Object.toGetCurrentDateTimeMillisecond()
        }
        var success = that.validateForm('formRef')
        if (!success) return
        if (!that.data.formKey) {
          FUI.Window.showMsg(that, '请选择“表单应用”或选择“无需表单”')
          return false
        }
        FUI.Form.submitForm(that, that.data, FUI.Handlers.WorkflowManageHandler, 'saveProcessApp', formAction, keyId, parentGridId,
          null, null, null, null,
          function(data) {
            if (data.success) {
              FUI.Window.refreshParentGrid()
              FUI.Window.showMsg(that, data.msg, null, 1, function() {
              })
            } else {
              FUI.Window.showMsg(that, data.msg)
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
       onWorkflowKeySelect() {
        WF.SelectorDialog.workflowSelector(this, 'workflowKey', 'workflowDefTitle')
      },
       selectVar(inputId) {
        var that = this
        if (that.data.formKey == '') {
          FUI.Window.showMsg('请配置表单应用')
          return false
        }
        WF.SelectorDialog.selectFormFieldProcInstContextVar(that, null, null, that.data.formKey, inputId, false)
      },

       onFrmKeySelect(value) {
        // 选择表单应用
        WF.SelectorDialog.processFormSelector(this, 'formKey', 'formName')
      },
       openOnlineFormDesigner() {
        var that = this
        var res = Object.toAjaxJson(FUI.Handlers.SmartFormHandler, 'getMasterProcessFormByFormKey', { formKey: that.data.formKey })
        if (res.success) {
          var formDefId = res.data.formDefId
          var formId = res.data.formId
          var formKey = res.data.formKey
          var url = __webpath + '/workflow/smartForm/onlineFormDesigner/?type=pc&formKey=' + formKey + '&formDefId=' + formDefId + '&formId=' + formId
          FUI.Window.open(url, '_blank')
        }
      },
       tabsClick(tab) {
        var that = this
        var name = tab.name
        if (formAction == 'Add') {
          FUI.Window.showMsg('首次新增，请填写并点击“保存”基础信息')
          return
        }
        var fn = that[name]
        fn()
      }
    }
  }
</script>
