<template>
  <div class="f2bpm-page-dialog-layout">
    <div>
      <el-form ref="formRef" :rules="formRules" size="small" :model="data" class="f2bpm-editform" label-width="120px">
        <el-form-item label="印章标题" prop="sealTitle">
          <el-input v-model="data.sealTitle" placeholder="印章标题" @blur.native.capture="toPinYin('sealTitle','sealCode')" />
        </el-form-item>
        <el-form-item label="印章编码" prop="sealCode">
          <el-input v-model="data.sealCode" placeholder="印章编码" />
        </el-form-item>
        <el-form-item label="印章类型" prop="sealType">
          <f2bpmui-select configtype="印章类型" field="sealType" :fieldvalue="data.sealType" @updatevalue="updateFieldValue" />
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="印章宽度" prop="sealWidth">
              <el-input-number v-model="data.sealWidth" size="small" placeholder="0：使用默认值" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="印章高度" prop="sealHeight">
              <el-input-number v-model="data.sealHeight" size="small" placeholder="0：使用默认值" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="印章负责人">
              <el-input v-model="data.sealManager" placeholder="印章负责人" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="负责人电话">
              <el-input v-model="data.sealManagerTel" placeholder="负责人电话" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="印章单位">
              <el-input v-model="data.sealDepart" placeholder="印章单位" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否启用">
              <el-switch v-model="data.isEnable" :inactive-value="0" :active-value="1" active-color="#13ce66" inactive-color="#DEDEDE" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="单位地址" prop="sealDepartAddress">
          <el-input v-model="data.sealDepartAddress" placeholder="单位地址" />
        </el-form-item>

        <el-form-item label="上传印章" prop="sealPhoto">
          <!--  <f2bpmui-uploadavatar field="sealPhoto" imgtype='png' @updatevalue="updateFieldValue" :fieldvalue="data.sealPhoto">
          </f2bpmui-uploadavatar> -->
          <f2bpmui-picture :field="sealPhoto" :fieldvalue="data.sealPhoto" @updatevalue="updateFieldValue" />
        </el-form-item>

        <el-form-item label="印章说明" prop="sealDescript">
          <el-input v-model="data.sealDescript" type="textarea" :rows="4" placeholder="印章说明" />
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
        sealPhoto: { fieldName: 'sealPhoto', fieldTitle: '上传图片', itemRender: { props: { limit: 1, parms: { pathType: 'seal' }}}},
        data: {
          sealTitle: '',
          sealType: '',
          sealCode: '',
          sealWidth: 0,
          sealHeight: 0,
          sealManager: '',
          sealManagerTel: '',
          sealDepart: '',
          isEnable: 1,
          sealDepartAddress: '',
          sealPhoto: '',

          tenantId: '',
          creatorId: '',
          creatorRealName: '',
          createdTime: '',
          isClearPic: ''
        },
         formRules: {
          sealType: [
            { required: true, message: '必填项不能为空' }
          ],
          sealTitle: [
            { required: true, message: '必填项不能为空' }
          ],
          sealCode: [
            { required: true, message: '必填项不能为空' }
          ]
        }
      }
    },
    created: function() {
      var that = this
      that.formAction = formAction
      if (formAction == FUI.FormAction.Add) {
        const currUser = FUI.Sys.getAuthor()
        that.data.creatorId = currUser.userId
        that.data.creatorRealName = decodeURI(currUser.realName)
        that.data.createdTime = Object.toGetCurrentDateTimeString()
        that.data.tenantId = currUser.tenantId
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
       loadData() {
        var that = this
        var url = __serverpath + '/workflow/security/seal/'
        if (formAction != FUI.FormAction.Add) {
          FUI.Form.bindDataToForm(that, url, 'getSealJson', keyId, null, mainTable)
          console.info(that.data.sealPhoto);
         /*  if(that.data.sealPhoto&&that.data.sealPhoto.length>100&&!Object.toStartWith(that.data.sealPhoto, "data:image/")){
            that.data.sealPhoto="data:image/png;base64,"+that.data.sealPhoto;
          } */
        }
      },
       submitForm() {
        var that = this
        var url = '/workflow/security/seal/'
        var success = that.validateForm('formRef')
        if (!success) return
        FUI.Form.submitForm(that, that.data, url, 'saveSeal', formAction, keyId, parentGridId, mainTable)
      },
       validateForm(refFormName) {
        // stand:表单校验
        var success = false
        this.$refs[refFormName].validate(valid => {
          success = valid
        })
        return success
      },
       updateFieldValue(fieldName, newVal) {
        var that = this
        that.data[fieldName] = newVal;
      },
       toPinYin(sourceField, targetField) {
        if (!this.data[targetField]) {
          const source = this.data[sourceField]
          this.data[targetField] = Object.toPinyinFirst(source)
        }
      }
    }
  }
</script>
