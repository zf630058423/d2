<template>
  <div class="f2bpm-page-dialog-layout">
    <div>
      <el-form ref="formRef" size="small" :rules="formRules" :model="data" class="f2bpm-editform" label-width="120px">
        <el-form-item label="委托环节" prop="ActivityName">
          <f2bpmui-select sqlkey="CB_ActivityNameListByAppId" :props="props" field="ActivityName" :fieldvalue="data.ActivityName" @updatevalue="updateFieldValue" />
        </el-form-item>
        <el-form-item label="按钮组" prop="radio">
          <el-radio-group v-model="radio" size="mini">
            <el-radio :label="3">备选项</el-radio>
            <el-radio :label="6">备选项</el-radio>
            <el-radio :label="9">备选项</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="被委托人" prop="ActivityDelegateUserRealName">
          <el-input v-model="data.ActivityDelegateUserRealName" placeholder="请选择被委托的人" class="textAutoBoxLong75" />
          <a id="selectUsers" href="javascript:void(0)" title="选择用户" @click="selectorUserTextValue('ActivityDelegateUserId','ActivityDelegateUserRealName',null,true,'userId')"><i class="fa fa-search" />选择用户</a>
        </el-form-item>
        <el-form-item label="组织名称" prop="OrgName">
          <el-input v-model="data.ColumnTitle" placeholder="组织名称" @blur.native.capture="toPinYin('ColumnTitle','OrgName')" />
        </el-form-item>
        <el-form-item label="字段名" prop="ColumnName">
          <el-input v-model="data.ColumnName" placeholder="段名不能超过30字节长度" :disabled="data.isDisabled" />
        </el-form-item>
        <el-form-item label="组织名称" prop="OrgName">
          <el-input v-model="data.OrgName" />
        </el-form-item>
        <el-form-item label="上级组织" prop="ParentOrgId">
          <treeselect v-model="data.ParentOrgId" :default-expand-level="3" :multiple="false" placeholder="请选择上级组织" :options="treeData" />
        </el-form-item>
        <el-form-item label="是否启用" prop="IsEnabled">
          <el-switch v-model="data.IsEnabled" :inactive-value="0" :active-value="1" active-color="#13ce66" inactive-color="#DEDEDE" />
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="委托开始时间" prop="StartTime">
              <el-date-picker v-model="data.StartTime" size="mini" type="datetime" class="textBoxShort" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="委托结束时间" prop="EndTime">
              <el-date-picker v-model="data.EndTime" size="mini" type="datetime" class="textBoxShort" format="yyyy-MM-dd  HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="审核类型" prop="Flag">
          <el-select v-model="data.Flag">
            <el-option label="请选择" value="" />
            <el-option label="同意类" value="1" />
            <el-option label="不同意类" value="0" />
          </el-select>
        </el-form-item>

        <el-form-item label="上传印章" prop="sealPhoto">
          <f2bpmui-uploadavatar field="sealPhoto" :fieldvalue="data.sealPhoto" @updatevalue="updateFieldValue" />
        </el-form-item>

        <el-row>
          <el-col :span="8">
            <el-form-item label="发布者" prop="articleAuthor">
              <el-input v-model="data.articleAuthor" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="编码" prop="articleCode">
              <el-input v-model="data.articleCode"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="排序" prop="orderNo">
              <el-input-number v-model="data.orderNo" size="small" :min="1" :max="100000" label="排序" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="8">
            <el-form-item label="发布状态" prop="isAudited">
              <f2bpmui-select configtype="发布状态" field="isAudited" :fieldvalue="data.isAudited" @updatevalue="updateFieldValue" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="更新时间" prop="articleUpdateTime">
              <el-date-picker id="StartTime" v-model="searchParams.StartTime" size="mini" type="date" class="textBoxShort" format="yyyy-MM-dd" name="StartTime" />

            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="data.remark" type="textarea" :rows="4" placeholder="备注" />
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="data.description" placeholder="描述" />
        </el-form-item>
        <el-row>
          <el-col :span="8" />
          <el-col :span="8">
            <el-form-item label="链接类型" prop="linkType">
              <f2bpmui-select :field="linkTypeField" :fieldvalue="data.linkType" @updatevalue="updateFieldValue" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="打开方式" prop="linkTarget">
              <f2bpmui-select :field="linkTargetField" :fieldvalue="data.linkTarget" @updatevalue="updateFieldValue" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item v-show="data.formType=='OnlineForm'" label="表单定义">
          <el-input v-model="data.refFormDefName" placeholder="请选择“表单定义”">
            <template slot="append"><i class="fa fa-search cur" @click="onOnlineFormSelect">选择</i></template>
          </el-input>
          <el-input v-show="false" v-model="data.formDefId" />
        </el-form-item>
        <el-form-item label="上传图片" prop="articlePhotoPath">
          <f2bpmui-picture :field="articlePhotoPathField" :fieldvalue="data.articlePhotoPath" @updatevalue="updateFieldValue" />
        </el-form-item>
        <el-form-item label="内容" prop="articleContent">
          <f2bpmui-richeditor :field="articleContentField" :fieldvalue="data.articleContent" @updatevalue="updateFieldValue" />
        </el-form-item>
        <a id="selectUsers" href="javascript:void(0)" title="选择用户" @click="selectorUserTextValue('ActorInputParam','ActorInputParamDes',null,false,'userId')"><i class="fa fa-search" />选择用户</a>
      </el-form>
    </div>
    <div class="dialogfooter2">
      <el-button v-if="formAction!='View'" size="small" type="primary" @click="submitForm()"><i class="fa fa-save" />保存
      </el-button>
      <el-button id="btn_cancel" size="small" @click="closeEdit"><i class="fa fa-minus-circle" />取消
      </el-button>
    </div>
  </div>
</template>

<script>

  export default {
    data() {
      return {
        formAction: null,
        treeData: [],
        isAuditedField: { field: 'isAudited', title: '发布状态', itemRender: { props: { configtype: '发布状态' } } },
        linkTypeField: { field: 'linkType', title: '链接类型', itemRender: { props: { configtype: '链接类型' } } },
        linkTargetField: { field: 'linkTarget', title: '链接打开方式', itemRender: { props: { configtype: '链接打开方式' } } },
        articleContentField: { field: 'articleContent', title: '内容', itemRender: { props: {} } },
        articlePhotoPathField: { field: 'articlePhotoPath', title: '上传图片', itemRender: { props: { limit: 1 } } },

        data: {
          articleTitle: '',
          linkUrl: '',
          articleAuthor: '',
          orderNo: 1000,
          isAudited: '0',
          articleUpdateTime: '',
          description: '',
          linkTarget: '_blank',
          articlePhotoPath: [],
          linkType: '1',
          articleContent: '',
          infoType: '',
          functionID: '',
          isClearPic: ''
        },
        // stand:表单校验规则
        formRules: {
          articleTitle: [
            { required: true, message: '必填项不能为空' }
            // {validator: FUI.Validator.onlyBigEnglisthChar},
          ],
          articleTitle: [
            { required: true, message: '必填项不能为空' }
          ],
          isAudited: [
            { required: true, message: '必填项不能为空' }
          ],
          linkType: [
            { required: true, message: '必填项不能为空' }
          ],
          linkTarget: [
            { required: true, message: '必填项不能为空' }
          ],
          linkUrl: [
            { required: true, message: '必填项不能为空' }
          ]
        }
      }
    },
    created: function () {
      var that = this
      that.formAction = formAction
      if (formAction == FUI.FormAction.Add) {
        const currUser = FUI.Sys.getAuthor()
        var infoType = Object.toQueryString('infoType') || ''
        var functionID = Object.toQueryString('functionID') || ''
        that.data.infoType = infoType
        that.data.functionID = functionID
        that.data.creatorId = currUser.userId
        that.data.articleAuthor = decodeURI(currUser.realName)
        that.data.articleUpdateTime = Object.toGetCurrentDateTimeString()
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
      loadTreeSelect() {
        var that = this
        var treeUrl = FUI.Handlers.OrgImplController + 'getOrgList/?needroot=true'
        Object.toAjaxJson(treeUrl, null, null, true, null, function (res) {
          if (res.success) {
            that.treeData = res.data
          } else {
            that.$message.error(
              res.msg
            )
          }
        })
      },
      loadData() {
        var that = this
        if (formAction != FUI.FormAction.Add) {
          FUI.Form.bindDataToForm(that, FUI.Handlers.FuiFrameworkHandler, FUI.Method.AutoGetViewModelMethod, keyId, null, mainTable)
        }
      },
      submitForm() {
        var that = this
        // FUI.Form.richeditorArrValueToInput(that);
        var success = that.validateForm('formRef')
        if (!success) return
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
      updateFieldValue(fieldName, newVal) {
        var that = this
        that.data[fieldName] = newVal
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