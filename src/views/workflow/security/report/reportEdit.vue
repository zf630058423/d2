<template>
  <div class="f2bpm-page-dialog-layout">
    <el-form ref="formRef" size="small" :rules="formRules" :model="data" class="f2bpm-editform" label-width="120px">
      <el-form-item label="分类" prop="CategoryCode">
        <treeselect v-model="data.CategoryCode" placeholder="请选择分类" :default-expand-level="2" :multiple="false" :options="treeData" />
      </el-form-item>
      <el-form-item label="图表名称" prop="ReportName">
        <el-input v-model="data.ReportName" @blur.native.capture="toPinYin('ReportName','ReportCode')" />
      </el-form-item>
      <el-form-item label="图表编码" prop="ReportCode">
        <el-input v-model="data.ReportCode" />
      </el-form-item>
      <!-- <el-form-item label="图表类型" prop="RportType">
        <el-select v-model="data.RportType" filterable placeholder="请选择">
          <el-option v-for="item in RportTypeData" :label="item.text" :value="item.value">
          </el-option>
        </el-select>
      </el-form-item> -->
      <el-form-item label="是否系统预设">
        <el-switch v-model="data.IsSystem" active-color="#87DC48" inactive-value="0" :active-value="1" inactive-color="#DEDEDE" />
      </el-form-item>
      <el-form-item label="图表介绍" prop="Introduction">
        <el-input v-model="data.Introduction" type="textarea" :rows="4" />
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
        isDisabled: false,
        treeData: [],
         data: {
          CategoryCode: null,
          ReportCode: '',
          ReportName: '',
          RportType: 'chart',
          DataSorceType: '',
          Options: '',
          Creator: '',
          CreatorRealName: '',
          TenantId: '',
          CreatedTime: '',
          LastModifier: '',
          LastModTime: '',
          IsSystem: 0
        },
         RportTypeData: [],
         DataSorceTypeData: [],
         configTypeArray: [{
          dataField: 'RportTypeData',
          configType: '报表_报表类型',
          flag: ''
        }, {
          dataField: 'DataSorceTypeData',
          configType: '报表_数据源类型',
          flag: ''
        }
        ],
        // stand:表单校验规则
         formRules: {
          ReportName: [
            { required: true, message: '必填项不能为空' }
          ],
          CategoryCode: [
            { required: true, message: '必填项不能为空' }
          ],
          RportType: [
            { required: true, message: '必填项不能为空' }
          ],
          DataSorceType: [
            { required: true, message: '必填项不能为空' }
          ],
          ReportCode: [
            { required: true, message: '必填项不能为空' },
            { validator: FUI.Validator.chars }
          ]
        }
      }
    },
    created: function() {
      var that = this
      that.formAction = formAction
      const currUser = that.$store.state.user.author
      if (formAction == FUI.FormAction.Add) {
        that.data.Creator = currUser.userId
        that.data.CreatorRealName = decodeURI(currUser.realName)
        that.data.LastModifier = decodeURI(currUser.realName)
        that.data.CreatedTime = Object.toGetCurrentDateTimeString()
        that.data.LastModTime = Object.toGetCurrentDateTimeString()
        that.data.TenantId = currUser.tenantId
      } else {
        that.data.LastModTime = Object.toGetCurrentDateTimeString()
        that.data.LastModifier = decodeURI(currUser.realName)
      }
      FUI.Form.initailConfigTypeComboBox(this)
      that.loadTreeSelect()
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
        }
      },
       loadTreeSelect() {
        var that = this
        var treeUrl = FUI.Handlers.CategoryHandler + '?groupKey=ReportGroup&needRoot=false'
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
       submitForm() {
        var that = this
        var success = that.validateForm('formRef')
        if (!success) return
        that.data.ReportCode = that.data.ReportCode.indexOf('report_') == -1 ? 'report_' + that.data.ReportCode : that.data.ReportCode
        FUI.Form.submitForm(that, that.data, '/workflow/security/report/', 'save', formAction, keyId, parentGridId, mainTable)
      },
       validateForm(refFormName) {
        // stand:表单校验
        var success = false
        this.$refs[refFormName].validate(valid => {
          success = valid
        })
        return success
      },
       addToSystemResource() {
        if (formAction == FUI.FormAction.Add) {
          FUI.Window.showMsg('当前是新增状态，请先保存后再打开本页面添加到菜单')
        }
        Sys.SelectorDialog.selectResourceCallBack(function(data, index) {
          if (data) {
            var parentId = data[0].nodeId
            var title = $('#ReportName').val()
            var reportCode = $('#ReportCode').val()
            var sysMenu = '/workflow/security/report/dataGridReport/?reportCode=' + reportCode
            var res = Object.toAjaxJson('/admin/resource/', 'saveSample', {
              'resourceId': reportCode,
              'parentId': parentId,
              'name': title,
              'functionUrl': sysMenu
            })
            FUI.Window.showMsg(res.msg, null, res.success == true ? 1 : 7)
          }
        })
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
