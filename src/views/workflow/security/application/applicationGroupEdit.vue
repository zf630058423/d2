<template>
  <div class="f2bpm-page-dialog-layout">
    <div>
      <el-form
        ref="formRef"
        :rules="formRules"
        size="small"
        :model="data"
        class="f2bpm-editform"
        label-width="120px"
      >
        <el-form-item label="分组标题" prop="groupTitle">
          <el-input
            v-model="data.groupTitle"
            placeholder="分组标题"
            @blur.native.capture="toPinYin('groupTitle', 'groupKey')"
          />
        </el-form-item>
        <el-form-item label="分组编码" prop="groupKey">
          <el-input
            v-model="data.groupKey"
            placeholder="分组编码"
            :disabled="formAction != 'Add'"
          />
        </el-form-item>
        <el-form-item label="分组描述">
          <el-input
            v-model="data.groupDescription"
            type="textarea"
            :rows="4"
            placeholder="分组描述"
          />
        </el-form-item>
        <div class="dialogfooter">
          <el-button
            v-if="formAction != 'View'"
            size="small"
            type="primary"
            @click="submitForm()"
            ><i class="fa fa-save" />保存
          </el-button>
          <el-button id="btn_cancel" size="small" @click="closeEdit"
            ><i class="fa fa-minus-circle" />取消
          </el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      formAction: null,
      treeData: [],
      data: {
        parentId: '',
        groupKey: '',
        groupTitle: '',
        groupType: '',
        groupDescription: '',
        creatorId: '',
        creatorRealName: '',
        createdTime: '',
        tenantid: ''
      },
      formRules: {
        parentId: [{ required: true, message: '必填项不能为空' }],
        groupKey: [{ required: true, message: '必填项不能为空' }],
        groupTitle: [{ required: true, message: '必填项不能为空' }],
        groupType: [{ required: true, message: '必填项不能为空' }],
        groupDescription: [{ required: true, message: '必填项不能为空' }],
        creatorId: [{ required: true, message: '必填项不能为空' }],
        creatorRealName: [{ required: true, message: '必填项不能为空' }],
        createdTime: [{ required: true, message: '必填项不能为空' }],
        tenantid: [{ required: true, message: '必填项不能为空' }]
      }
    }
  },
  created: function () {
    var that = this
    that.formAction = formAction
    if (formAction == FUI.FormAction.Add) {
      const currUser = that.$store.state.user.author
      that.data.creatorId = currUser.userId
      that.data.tenantid = currUser.tenantId
      that.data.creatorRealName = decodeURI(currUser.realName)
      that.data.createdTime = Object.toGetCurrentDateTimeString()
    }
    that.loadData()
  },
  methods: {
    closeEdit () {
      FUI.Window.closeEdit()
    },
    loadData () {
      var that = this
      if (formAction != FUI.FormAction.Add) {
        FUI.Form.bindDataToForm(
          that,
          '/workflow/security/application/',
          'getModelAppLicationGroup',
          keyId,
          null,
          mainTable
        )
      }
    },
    submitForm () {
      var that = this
      var success = that.validateForm('formRef')
      if (!success) return
      FUI.Form.submitForm(
        that,
        that.data,
        '/workflow/security/application/',
        'saveAppLicationGroup',
        formAction,
        keyId,
        parentGridId,
        mainTable
      )
    },
    validateForm (refFormName) {
      var success = false
      this.$refs[refFormName].validate(valid => {
        success = valid
      })
      return success
    },
    toPinYin (sourceField, targetField) {
      if (!this.data[targetField]) {
        const source = this.data[sourceField]
        this.data[targetField] = Object.toPinYin(source)
      }
    }
  }
}
</script>
