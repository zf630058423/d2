<template>
  <div class="f2bpm-page-dialog-layout f2bpm-page-right">
    <el-form ref="formRef" size="small" :rules="formRules" :model="data" class="f2bpm-editform" label-width="120px">
      <el-form-item label="表分类" prop="CategoryCode">
        <treeselect v-model="data.CategoryCode" placeholder="请选择分类" :default-expand-level="3" :multiple="false" :options="treeData" />
      </el-form-item>
      <el-form-item label="表标题" prop="TableTitle">
        <el-input v-model="data.TableTitle" placeholder="表标题" @blur.native.capture="toPinYin('TableTitle','TableName')" />
      </el-form-item>
      <el-form-item label="实体对象名" prop="TableName">
        <el-input v-model="data.TableName" placeholder="实体对象名" :disabled="data.isTableNameDisabled" />
      </el-form-item>
      <el-row v-if="formAction!='Add'">
        <el-col :span="12">
          <el-form-item label="是否已生成">
            <el-switch v-model="data.IsCreateTable" active-color="#87DC48" :active-value="1" :inactive-value="0" inactive-color="#DEDEDE" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="是否外部表">
            <el-switch v-model="data.IsOuterTable" active-color="#87DC48" :active-value="1" :inactive-value="0" inactive-color="#DEDEDE" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="formAction!='Add'">
        <el-col :span="12">
          <el-form-item label="多对多子表">
            <el-switch v-model="data.IsManyToManyTable" active-color="#87DC48" :active-value="1" :inactive-value="0" inactive-color="#DEDEDE" />
            <span class="font10">（极少使用，建议为否）</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="删除物理数据">
            <el-switch v-model="data.IsMtMdelPhysicalData" active-color="#87DC48" :active-value="1" :inactive-value="0" inactive-color="#DEDEDE" />（仅对多对多子表有效）
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="DB数据源">
        <f2bpmui-select sqlkey="CB_DataBaseSourceList" field="DbSourceCode" :fieldvalue="data.DbSourceCode" @updatevalue="updateFieldValue" />
        <span class="font6 ml5">(为空时默认为本地。注意：外部数据源存在与本地数据库事务不一致需自行处理。)</span>
      </el-form-item>
      <el-form-item label="备注">
        <el-input v-model="data.Remark" type="textarea" :rows="4" placeholder="" />
      </el-form-item>
      <div class="dialogfooter">
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
        formDefId: '',
        formAction: null,
        treeData: [],
         data: {
          FormDefId: '',

          TableName: '',
          TableTitle: '',
          CategoryCode: null,
          IsOuterTable: 0,
          InstanceDataType: '',
          CreatedTime: '',
          Status: 'actived',
          Creator: '',
          TenantId: '',
          DbTableName: '',
          IsManyToManyTable: 0,
          IsMtMdelPhysicalData: 0,
          // 禁用状态
          isTableNameDisabled: false,
          DbSourceCode: ""
        },
        // stand:表单校验规则
         formRules: {
          CategoryCode: [
            { required: true, validator: FUI.Validator.required }
          ],
          TableTitle: [
            { required: true, validator: FUI.Validator.required }
          ],
          TableName: [
            { required: true, validator: FUI.Validator.required },
            { validator: FUI.Validator.englishchar },
            { validator: FUI.GetValidatorRule('len[2,30]') }
          ]
        }
      }
    },
    created: function() {
      var that = this
      // 如果有传递formDefId，则保存时需要增加表单定义的关联
      var formDefId = Object.toQueryString('formDefId') || ''
      that.formDefId = formDefId
      that.data.FormDefId = formDefId
      that.formAction = formAction
      that.keyId = keyId
      that.loadTreeSelect()
      that.loadData()
    },
    methods: {
      closeEdit() {
        FUI.Window.closeEdit()
      },
       loadData() {
        var that = this
        if (formAction == FUI.FormAction.Add) {
          const currUser = FUI.Sys.getAuthor()
          that.data.Creator = decodeURI(currUser.realName)
          that.data.CreatedTime = Object.toGetCurrentDateTimeString()
          that.data.TenantId = currUser.tenantId
          that.data.CategoryCode = Object.toQueryString('categoryCode') || null
        } else if (formAction != FUI.FormAction.Add) {
          FUI.Form.bindDataToForm(that, FUI.Handlers.FuiFrameworkHandler, FUI.Method.AutoGetViewModelMethod, keyId, null, mainTable)
          if (that.data.IsCreateTable == 1) {
            that.data.isTableNameDisabled = true
          }
        }
      },
       loadTreeSelect() {
        var that = this
        var treeUrl = FUI.Handlers.CategoryHandler + '?groupKey=BusinessObject&needRoot=false'
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
        FUI.Form.submitForm(that, that.data, FUI.Handlers.SmartFormHandler, 'saveTableDefinition', formAction, keyId, parentGridId, mainTable)
      }, 
       updateFieldValue(fieldName, newVal) {
        var that = this;
        that.data[fieldName] = newVal;
      }
      ,validateForm(refFormName) {
        // stand:表单校验
        var success = false
        this.$refs[refFormName].validate(valid => {
          success = valid
        })
        return success
      }, toPinYin(sourceField, targetField) {
        if (!this.data[targetField]) {
          const source = this.data[sourceField]
          this.data[targetField] = Object.toPinYin(source)
        }
      }
    }
  }
</script>
