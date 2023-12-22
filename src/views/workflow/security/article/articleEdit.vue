<template>
  <div class="f2bpm-page-dialog-layout">
    <el-form ref="formRef" size="small" :rules="formRules" :model="data" class="f2bpm-editform" label-width="120px">
      <el-form-item label="标题" prop="articleTitle">
        <el-input v-model="data.articleTitle" />
      </el-form-item>
      <el-row>
        <el-col :span="8">
          <el-form-item label="唯一编码" prop="articleCode">
            <el-input v-model="data.articleCode" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="发布者" prop="articleAuthor">
            <el-input v-model="data.articleAuthor" />
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
            <f2bpmui-select :field="isAuditedField" :fieldvalue="data.isAudited" @updatevalue="updateFieldValue" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="描述" prop="description">
            <el-input v-model="data.description" placeholder="描述" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="关键字" prop="descriptionKey">
            <el-input v-model="data.descriptionKey" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row v-if="data.functionID!='FastChannel'">
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
        <el-col :span="8">
          <el-form-item label="更新时间" prop="articleUpdateTime">
            <span v-html="data.articleUpdateTime" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="7">
          <el-form-item label="图标" prop="icon">
            <el-input v-model="data.icon" style="height: 30px; " class="textBoxShort" placeholder="图标" />
            <span class="cur font12 pl5" @click="selectAweIcon('icon')"><i class="fa fa-search" />选择 </span>
            <span style="margin-left: 10px;margin-right: 10px;">
              <i :style="'font-size:'+(data.fontSize>0?data.fontSize:14)+'px;color:'+data.color" :class="data.icon" />
            </span>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="大小" prop="fontSize">
            <el-input-number v-model="data.fontSize" size="mini" :min="0" :max="500" />
          </el-form-item>
        </el-col>
        <el-col :span="3">
          <el-form-item label="" prop="color">
            <el-color-picker v-model="data.color" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item v-if="data.functionID!='FastChannel' " label="链接地址" prop="linkUrl">
        <el-input v-model="data.linkUrl" />
      </el-form-item>
      <div v-if="data.functionID!='FastChannel'&&data.functionID!='Commonlink' ">
        <el-form-item label="上传图片" prop="articlePhotoPath">
          <f2bpmui-picture :field="articlePhotoPathField" :fieldvalue="data.articlePhotoPath" @updatevalue="updateFieldValue" />
        </el-form-item>
        <el-form-item label="内容" prop="articleContent">
          <f2bpmui-richeditor :field="articleContentField" :fieldvalue="data.articleContent" @updatevalue="updateFieldValue" />
        </el-form-item>
        <el-form-item label="扩展" prop="articleAbout">
          <el-input v-model="data.articleAbout" type="textarea" :rows="4" />
        </el-form-item>
      </div>
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
         isAuditedField: { fieldName: 'isAudited', title: '发布状态', itemRender: { props: { configtype: '发布状态' }}},
         linkTypeField: { fieldName: 'linkType', title: '链接类型', itemRender: { props: { configtype: '链接类型' }}},
         linkTargetField: { fieldName: 'linkTarget', title: '链接打开方式', itemRender: { props: { configtype: '链接打开方式' }}},
         articleContentField: { fieldName: 'articleContent', title: '内容', itemRender: { props: { height: 400 }}},
         articlePhotoPathField: { fieldName: 'articlePhotoPath', title: '上传图片', itemRender: {}},

         data: {

          articleTitle: '',
          linkUrl: '',
          articleAuthor: '',
          orderNo: 1000,
          isAudited: '2',
          articleUpdateTime: '',
          description: '',
          linkTarget: '_blank',
          articlePhotoPath: [],
          linkType: '1',
          articleContent: '',
          infoType: '',
          functionID: '',
          isClearPic: '',

          icon: '',
          fontSize: '',
          color: '',
          color2: '',
          width: 0,
          height: 0

        },
        // stand:表单校验规则
         formRules: {
          articleTitle: [
            { required: true, message: '必填项不能为空' }
            // {validator: FUI.Validator.onlyBigEnglisthChar},
          ],
           articleCode: [
            { required: true, message: '必填项不能为空' }
          ]
        }
      }
    },
    created: function() {
      var that = this
      that.formAction = formAction
      var infoType = Object.toQueryString('infoType') || ''
      if (formAction == FUI.FormAction.Add) {
        const currUser = FUI.Sys.getAuthor()
        var functionID = Object.toQueryString('functionID') || ''
        that.data.infoType = infoType
        that.data.functionID = functionID
        that.data.creatorId = currUser.userId
        that.data.articleAuthor = decodeURI(currUser.realName)
        that.data.articleUpdateTime = Object.toGetCurrentDateTimeString()
        that.data.articleCode = Object.toGuid(false)
      }
      that.articlePhotoPathField.itemRender = { props: { limit: 1, parms: { pathType: infoType }}}
      if (infoType == 'link') {
        that.articleContentField.itemRender = { props: { height: 200 }}
      } else {
        that.articleContentField.itemRender = { props: { height: 400, toolbarsType: 'myToolbars' }}
      }
      that.loadData()
      window.myvm = that
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
          FUI.Form.bindDataToForm(that, '/workflow/security/article/', 'getArticleJson', keyId, null, mainTable)
        }
      },
       submitForm() {
        var that = this
        // 收集富文本框内容到Vue的Data中
        FUI.Form.richeditorArrValueToInput(that, null, false)
        var success = that.validateForm('formRef')
        if (!success) return
        FUI.Form.submitForm(that, that.data, '/workflow/security/article/', 'saveArticle', formAction, keyId, parentGridId, mainTable)
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
       selectAweIcon(inputKey) {
        var that = this
        WF.SelectorDialog.selectAweIcon(that, inputKey, null, null, null, true)
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
<style>
  body {
    color: #646464;
  }
</style>
