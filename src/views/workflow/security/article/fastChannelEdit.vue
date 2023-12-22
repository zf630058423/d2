<template>
  <div class="f2bpm-page-dialog-layout">
    <el-form ref="formRef" size="small" :rules="formRules" :model="data" class="f2bpm-editform" label-width="120px">

      <el-form-item label="链接类型" prop="linkType">
        <el-select v-model="data.linkType">
          <el-option label="请选择" value="" />
          <el-option label="应用项目" value="applicationItem" />
          <el-option label="发起流程" value="startWorkflow" />
          <el-option label="内部链接" value="insidelink" />
          <el-option label="外部链接" value="outsidelink" />
        </el-select>
      </el-form-item>
      <el-form-item :label="(data.linkType=='insidelink'|| data.linkType=='outsidelink')?'标题':'选择项目'" prop="articleTitle">
        <el-input v-model="data.articleTitle" placeholder="请选择项目" />
        <span v-if="data.linkType=='applicationItem'" class="fa fa-search cur font8 mr10" @click="onItemSelect('refEntityId','articleTitle')">选择应用项目</span>
        <span v-if="data.linkType=='startWorkflow'" class="fa fa-search cur font8" @click="onProcessAppSelect('refEntityId','articleTitle')">选择流程</span>
      </el-form-item>
      <el-form-item v-if="data.linkType=='insidelink'|| data.linkType=='outsidelink'" label="链接地址" prop="linkUrl">
        <el-input v-model="data.linkUrl" />
      </el-form-item>
      <el-row>
        <el-col :span="8">
          <el-form-item label="排序" prop="orderNo">
            <el-input-number v-model="data.orderNo" size="small" :min="1" :max="100000" label="排序" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="状态" prop="isAudited">
            <f2bpmui-select :field="isAuditedField" :fieldvalue="data.isAudited" @updatevalue="updateFieldValue" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="8">
          <el-form-item label="图标" prop="icon">
            <el-input v-model="data.icon" style="height: 30px; " class="textBoxShort" placeholder="图标" />
            <span class="cur font12 pl5" @click="selectAweIcon('icon')"><i class="fa fa-search" />选择 </span>
            <span style="margin-left: 10px;margin-right: 10px;">
              <i :style="'font-size:'+(data.fontSize>0?data.fontSize:14)+'px;color:'+data.color" :class="data.icon" />
            </span>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="大小" prop="fontSize">
            <el-input-number v-model="data.fontSize" size="mini" :min="0" :max="500" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="颜色" prop="color">
            <el-color-picker v-model="data.color" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="备注" prop="description">
        <el-input v-model="data.description" placeholder="描述" type="textarea" :rows="4" />
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
         isAuditedField: { field: 'isAudited', title: '发布状态', itemRender: { props: { configtype: '发布状态' }}},
         linkTypeField: { field: 'linkType', title: '链接类型', itemRender: { props: { configtype: '链接类型' }}},
         data: {
          articleTitle: '',
          articleCode: '',
          linkUrl: '',
          articleAuthor: '',
          orderNo: 1000,
          isAudited: '2',
          articleUpdateTime: '',
          description: '',
          linkTarget: '_blank',
          articlePhotoPath: [],
          linkType: 'applicationItem',
          articleContent: '',
          infoType: '',
          functionID: '',
          isClearPic: '',
          creatorId: '',

          icon: '',
          fontSize: '',
          color: '',
          color2: '',
          width: 0,
          height: 0,
          refEntityId: ''

        },
        // stand:表单校验规则
         formRules: {
          articleTitle: [
            { required: true, message: '必填项不能为空' }
            // {validator: FUI.Validator.onlyBigEnglisthChar},
          ],
          linkType: [
            { required: true, message: '必填项不能为空' }
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
      var infoType = 'FastChannel'
      var functionID = 'FastChannel'
      if (formAction == FUI.FormAction.Add) {
        const currUser = FUI.Sys.getAuthor()
        that.data.infoType = infoType
        that.data.functionID = functionID
        that.data.creatorId = currUser.userId
        that.data.articleAuthor = decodeURI(currUser.realName)
        that.data.articleUpdateTime = Object.toGetCurrentDateTimeString()
        that.data.articleCode = Object.toGuid(false)
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
       onItemSelect(keyInput, titleInput) {
        WF.SelectorDialog.selectorApplicationItem(this, keyInput, titleInput, true)
      },
       onProcessAppSelect(keyInput, titleInput) {
        WF.SelectorDialog.selectorProcessApp(this, keyInput, titleInput)
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
