<template>
  <div class="f2bpm-page-layout">
    <div>
      <el-form ref="formRef" :rules="formRules" size="small" :model="data" class="f2bpm-editform" label-width="120px">
        <el-form-item label="门户名称" prop="portalName">
          <el-input v-model="data.portalName" placeholder="应用模板名称" @blur.native.capture="toPinYin('portalName','portalKey')" />
        </el-form-item>
        <el-form-item label="门户编码" prop="portalKey">
          <el-input v-model="data.portalKey" placeholder="应用模板编码" />
        </el-form-item>
        <el-form-item label="门户类型" prop="portalType">
          <el-select v-model="data.portalType">
            <el-option label="请选择" value="" />
            <el-option label="前端" value="front" />
            <el-option label="后端" value="back" />
            <el-option label="手机端" value="mobile" />
          </el-select>
        </el-form-item>
        <el-form-item label="是否启用">
          <el-switch v-model="data.isEnabled" :inactive-value="0" :active-value="1" active-color="#13ce66" inactive-color="#DEDEDE" />
        </el-form-item>
        <el-form-item label="备注" prop="remarks">
          <el-input v-model="data.remarks" type="textarea" :rows="4" placeholder="备注" />
        </el-form-item>

        <div class="dialogfooter">
          <el-button v-if="formAction!='View'" size="small" type="primary" @click="submitForm()"><i class="fa fa-save" />保存
          </el-button>
          <el-button id="btn_cancel" size="small" @click="closeEdit"><i class="fa fa-minus-circle" />取消
          </el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>

  export default {
    data() {
      return {
        formAction: null,
        treeData: [],
         data: {
          portalKey: '',
          portalName: '',
          portalContent: '',
          portalScript: '',
          mobileContent: '',
          mobileScript: '',
          versionNo: 1,
          isMaster: 1,
          isEnabled: 1,
          portalType: 'front',
          createdTime: '',
          creatorRealName: '',
          creatorId: '',
          remarks: '',
          adoptions: '',
          tenantId: ''
        },
         formRules: {
          portalKey: [
            { required: true, message: '必填项不能为空' }
          ],
          portalName: [
            { required: true, message: '必填项不能为空' }
          ],
          portalType: [
            { required: true, message: '必填项不能为空' }
          ]
        }
      }
    },
    created: function() {
      var that = this
      that.formAction = formAction
      if (formAction == FUI.FormAction.Add) {
        const currUser = that.$store.state.user.author
        that.data.creatorId = currUser.userId
        that.data.tenantId = currUser.tenantId
        that.data.creatorRealName = decodeURI(currUser.realName)
        that.data.createdTime = Object.toGetCurrentDateTimeString()
      }
      that.loadData()
    },
    methods: {
      closeEdit() {
        FUI.Window.closeEdit()
      },
       loadData() {
        var that = this
        if (formAction != FUI.FormAction.Add) {
          FUI.Form.bindDataToForm(that, FUI.Handlers.FuiFrameworkHandler, FUI.Method.AutoGetViewModelMethod, keyId, null, mainTable)
        }
      },
       submitForm() {
        var that = this
        var success = that.validateForm('formRef')
        if (!success) return
        FUI.Form.submitForm(that, that.data, '/workflow/frame/appPortal/', 'save', formAction, keyId, parentGridId, mainTable, null, null, null, function(obj) {
          if (obj.success) {
            var msg = '保存成功'
            if (formAction == 'Add') {
              msg = '新增成功，请继续完成门户设计'
            }
            FUI.Window.showMsg(msg, null, 1, function() {
              if (formAction == 'Add') {
                window.parent.window.myvm.appPortalDesigner(obj.msg)
              }
              FUI.Window.closeEdit(true)
            })
          } else {
            FUI.Window.showMsg(obj.msg)
          }
        })
      },
       validateForm(refFormName) {
        var success = false
        this.$refs[refFormName].validate(valid => {
          success = valid
        })
        return success
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
