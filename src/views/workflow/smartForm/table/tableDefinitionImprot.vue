<template>
  <div class="f2bpm-page-layout f2bpm-page-right">
    <el-form ref="formRef" :rules="formRules" size="small" :model="data" class="f2bpm-editform" label-width="120px">
      <el-form-item label="表分类" prop="CategoryCode">
        <treeselect v-model="data.CategoryCode" placeholder="请选择分类" :default-expand-level="3" :multiple="false" :options="treeData" />
      </el-form-item>
      <el-form-item label="表标题" prop="TableTitle">
        <el-input v-model="data.TableTitle" placeholder="表标题" />
      </el-form-item>
      <el-form-item label="DB数据源">
        <f2bpmui-select sqlkey="CB_DataBaseSourceList" field="dbSourceCode" :fieldvalue="data.dbSourceCode" @updatevalue="updateFieldValue" />
        <br>
        <span class="font6 ml5">(为空时默认为本地。注意：外部数据源存在与本地数据库事务不一致需自行处理。)</span>
      </el-form-item>
      <el-form-item label="外部表" prop="DbTableName">
        <el-input v-model="data.DbTableName" placeholder="请选择或填写外部真实存在的物理表">
          <template slot="append"><i class="fa fa-search cur" @click="selectDbTable">选择</i>
          </template>
        </el-input>
        <el-input v-if="false" v-model="data.formKey" />
      </el-form-item>
      <el-form-item label="实体名" prop="TableName">
        <el-input v-model="data.TableName" placeholder="实体对象名,注意去除前缀" :disabled="data.isTableNameDisabled" />
      </el-form-item>
      <el-form-item label="备注">
        <el-input v-model="data.Remark" type="textarea" :rows="4" placeholder="" />
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
          // 是否同时添加业务对象，表单表关系
          isAddTableBusObject: false,
          formDefId: '',

          // 实体字段
          IsCreateTable: 1,
          TableName: '',
          TableTitle: '',
          CategoryCode: null,
          IsOuterTable: 1,
          InstanceDataType: '',
          CreatedTime: '',
          Status: 'actived',
          Creator: '',
          TenantId: '',
          DbTableName: '',
          dbSourceCode:"",
          // 禁用状态
          isTableNameDisabled: false
        },
        // stand:表单校验规则
         formRules: {
          CategoryCode: [
            { required: true, validator: FUI.Validator.required }
          ],
          DbTableName: [
            { required: true, validator: FUI.Validator.required }
          ],
          TableTitle: [
            { required: true, validator: FUI.Validator.required }
          ],
          TableName: [
          { required: true, validator: FUI.Validator.required },
            { validator: FUI.Validator.englishchar }
          ]
        }
      }
    },
    created: function() {
      var that = this
      that.formAction = formAction
      that.keyId = keyId
      var formDefId = Object.toQueryString('formDefId') || ''
      var isAddTableBusObject = Object.toQueryString('isAddTableBusObject') || false

      that.loadTreeSelect()
      that.loadData()
      that.data.formDefId = formDefId
      that.data.isAddTableBusObject = isAddTableBusObject
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
        FUI.Form.submitForm(that, that.data, FUI.Handlers.SmartFormHandler, 'importExistTableDefinition', formAction, keyId, parentGridId, mainTable)
      },
       validateForm(refFormName) {
        // stand:表单校验
        var success = false
        this.$refs[refFormName].validate(valid => {
          success = valid
        })
        return success
      },
       selectDbTable(value) {
         var that=this;
         var dbSourceCode=that.data.dbSourceCode;
        // 选择表单应用
        WF.SelectorDialog.selectDbTable(this, 'DbTableName', null, 'outtable', true,null,null,dbSourceCode)
      },
       toPinYin(sourceField, targetField) {
        if (!this.data[targetField]) {
          const source = this.data[sourceField]
          this.data[targetField] = Object.toPinYin(source)
        }
      }
      ,updateFieldValue(fieldName, newVal) {
        var that = this
        that.data[fieldName] = newVal
      }
    }
  }
</script>
