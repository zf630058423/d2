<template>
  <div class="f2bpm-page-dialog-layout f2bpm-page-right"  >
    <el-form ref="formRef" size="small" :rules="formRules" :model="data" class="f2bpm-editform" label-width="120px">
      <el-form-item label="表分类" prop="categoryCode">
        <treeselect v-model="data.categoryCode" placeholder="请选择分类" :default-expand-level="3" :multiple="false" :options="treeData" />
      </el-form-item>
      <el-row>
        <el-col :span="12">
          <el-form-item label="表标题" prop="tableTitle">
            <el-input v-model="data.tableTitle" placeholder="表标题" @blur.native.capture="toPinYin('tableTitle','tableName')" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="实体名" prop="tableName">
            <el-input v-model="data.tableName" placeholder="实体名不能超过30个字符" :disabled="data.isTableNameDisabled" />

          </el-form-item>
        </el-col>
      </el-row>


      <el-row v-if="formAction!='Add'">
        <el-col :span="12">
          <el-form-item label="是否已生成">
            <el-switch v-model="data.isCreateTable" active-color="#87DC48"   inactive-color="#DEDEDE" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="是否外部表">
            <el-switch v-model="data.isOuterTable" active-color="#87DC48"  inactive-color="#DEDEDE" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="formAction!='Add'">
        <el-col :span="12">
          <el-form-item label="多对多子表 ">
            <el-switch v-model="data.isManyToManyTable" active-color="#87DC48"   inactive-color="#DEDEDE" />
            <span class="font10" >（极少使用，务必为否）</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="删除物理数据">
            <el-switch v-model="data.isMtMdelPhysicalData" active-color="#87DC48"  inactive-color="#DEDEDE" />
            <span class="font10" > <span class="fa fa-question-circle-o ml5" title="仅对多对多有效，“否”：只删除REL关系，“是”删除REL关系和子表数据"></span>（仅对多对多子表有效）</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="DB数据源">
        <f2bpmui-select sqlkey="CB_DataBaseSourceList" field="dbSourceCode" :fieldvalue="data.dbSourceCode" @updatevalue="updateFieldValue" />
        <br><span class="font6 ml5">(为空时默认为本地。注意：外部数据源存在与本地数据库事务不一致需自行处理。)</span>
      </el-form-item>
      <el-form-item label="备注">
        <el-input v-model="data.remark" type="textarea" :rows="4" placeholder="" />
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
<!-- 表、业务对象、表单与表关联 三者合一的编辑 -->
<script>
  export default {
    data() {
      return {
        busObjectId: '',
        formDefId: '',
        formAction: null,
        treeData: [],
        data: {
          // 辅助字段
          // 新增表时是否同时添加表单的业务对象
          isAddTableBusObject: true,
          formDefId: '',
          // 实体字段
          tableId: '',
          tableName: '',
          tableTitle: '',
          categoryCode: null,
          isOuterTable: false,
          instanceDataType: '',
          CreatedTime: '',
          status: 'actived',
          creator: '',
          tenantId: '',
          dbTableName: '',
          isManyToManyTable: false,
          isMtMdelPhysicalData: false,
          // 禁用状态
          isTableNameDisabled: false,
          dbSourceCode: ""

        },
        // stand:表单校验规则
        formRules: {
          categoryCode: [
            { required: true, validator: FUI.Validator.required }
          ],
          tableTitle: [
            { required: true, validator: FUI.Validator.required }
          ],
          tableName: [
            { required: true, validator: FUI.Validator.required },
            { validator: FUI.Validator.englishchar },
            { validator: FUI.GetValidatorRule('len[2,30]') }
          ]
        }
      };
    },
    created: function () {
      var that = this;
      // 如果有传递formDefId，则保存时需要增加表单定义的关联
      var formDefId = Object.toQueryString('formDefId') || '';
      // 修改时传入
      var busObjectId = Object.toQueryString('busObjectId') || '';
      that.busObjectId = busObjectId;
      that.formDefId = formDefId;
      that.data.formDefId = formDefId;
      that.formAction = formAction;
      that.keyId = keyId;
      that.loadTreeSelect();
      that.loadData();
    },
    methods: {
      closeEdit() {
        FUI.Window.closeEdit();
      },
      loadData() {
        var that = this;
        if (formAction == FUI.FormAction.Add) {
          const currUser = FUI.Sys.getAuthor();
          that.data.creator = decodeURI(currUser.realName);
          that.data.createdTime = Object.toGetCurrentDateTimeString();
          that.data.tenantId = currUser.tenantId;
          that.data.categoryCode = Object.toQueryString('categoryCode') || null;
        } else if (formAction != FUI.FormAction.Add) {
          var keyId = that.busObjectId;
          FUI.Form.bindDataToForm(that, FUI.Handlers.SmartFormHandler, 'getTablDefinitionBusObjectModel', keyId, null, null);
          if (that.data.isCreateTable == 1) {
            that.data.isTableNameDisabled = true;
          }
          console.info(that.data)
        }
      },
      loadTreeSelect() {
        var that = this;
        var treeUrl = FUI.Handlers.CategoryHandler + '?groupKey=BusinessObject&needRoot=false';
        Object.toAjaxJson(treeUrl, null, null, true, null, function (res) {
          if (res.success) {
            that.treeData = res.data;
          } else {
            that.$message.error(
              res.msg
            );
          }
        });
      },
      submitForm() {
        var that = this;
        var success = that.validateForm('formRef');
        if (!success) return;
        if (formAction == 'Edit') {
          keyId = that.data.tableId;
        }
        FUI.Form.submitForm(that, that.data, FUI.Handlers.SmartFormHandler, 'saveTableDefinition', formAction, keyId, parentGridId, mainTable);
      },
      validateForm(refFormName) { 
        // stand:表单校验
        var success = false;
        this.$refs[refFormName].validate(valid => {
          success = valid;
        });
        return success;
      }
      , updateFieldValue(fieldName, newVal) {
        var that = this;
        that.data[fieldName] = newVal;
      }
      , toPinYin(sourceField, targetField) {
        if (!this.data[targetField]) {
          const source = this.data[sourceField];
          this.data[targetField] = Object.toPinyinFirst(source);
        }
      }
    }
  }
</script>