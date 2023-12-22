<template>
  <div class="f2bpm-page-dialog-layout">
    <div>
      <el-form ref="formRef" :rules="formRules" size="small" :model="data" class="f2bpm-editform" label-width="120px">
        <el-form-item label="上级分组" prop="parentId">
          <treeselect v-model="data.parentId" :default-expand-level="2" :multiple="false" placeholder="请选择分组" :options="treeData" />
        </el-form-item>
        <el-form-item label="名称" prop="itemName">
          <el-input v-model="data.itemName" placeholder="" />
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="类型" prop="itemBusinessType">
              <el-select v-model="data.itemBusinessType">
                <!--   <el-option label="流程表单" value="workflowForm"></el-option>
                <el-option label="普通表单" value="noWorkflowForm"></el-option> -->

                <el-option label="发起流程" value="startWorkflow" />
                <el-option label="自定义列表" value="customDataGrid" />
                <el-option label="仪表板门户" value="appPortal" />
                <el-option label="内部链接" value="insideitem" />
                <el-option label="外部链接" value="outsideitem" />
                <el-option label="分组" value="group" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item v-if="data.itemBusinessType=='customDataGrid'||data.itemBusinessType=='appPortal'||data.itemBusinessType=='startWorkflow'" label="对象选择">
              <el-input v-model="data.refTitle" size="mini" placeholder="请选择">
                <template slot="append"><i class="fa fa-search cur" @click="onRefSelect('refKey','refTitle')">选择</i></template>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="图标" prop="itemIcon">
          <el-input v-model="data.itemIcon" class="textBoxShort" placeholder="" />
          <span class="ml5 mr5"> <i :style="iconStyle" :class="data.itemIcon" /></span>
          <span class="cur font8" @click="selectAweIcon('itemIcon')"> <i class="fa fa-search " />选择</span>
        </el-form-item>

        <el-row>
          <el-col :span="12">
            <el-form-item label="图标大小" prop="iconSize">
              <el-input-number v-model="data.iconSize" size="mini" :min="0" :max="200" label="图标大小" /> px
              <span class="font8 pl5">(0为默认)</span>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="图标颜色">
              <el-color-picker v-model="data.iconColor" label="图标颜色" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="排序" prop="itemOrderNo">
              <el-input-number v-model="data.itemOrderNo" size="small" :min="1" :max="100000" label="排序" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否启用">
              <el-switch v-model="data.isEnabled" :inactive-value="false" :active-value="true" active-color="#13ce66" inactive-color="#DEDEDE" />
            </el-form-item>
          </el-col>
        </el-row>
        <div v-if="data.itemBusinessType=='insideitem'||data.itemBusinessType=='outsideitem'">
          <el-form-item label="链接地址" prop="itemUrl">
            <el-input v-model="data.itemUrl" placeholder="" />
          </el-form-item>
        </div>
        <el-form-item v-if="false" label="属性设置" prop="itemOpts">
          <el-input v-model="data.itemOpts" placeholder="" />
        </el-form-item>
        <el-form-item label="备注" prop="itemRemarks">
          <el-input v-model="data.itemRemarks" type="textarea" :rows="4" placeholder="" />
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
        itemBusinessTypeDisabled: false,
        formAction: null,
        treeData: [],
         data: {
          refTitle: '',
          refKey: '',
          target: '',
          itemKey: '',
          appId: '',
          workflowKey: '',
          formKey: '',
          formDefId: '',
          parentId: 'Root',
          refApplicationId: '',
          itemId: '',
          itemName: '',
          itemBusinessType: '',
          itemIcon: '',
          isEnabled: true,
          itemOrderNo: 100,
          itemUrl: '',
          itemOpts: '',
          itemRemarks: '',
          creatorId: '',
          createdTime: '',
          fontSize: '',
          iconColor: '',
          iconSize: '',
          tenantId: ''

        },
         formRules: {
          itemName: [
            { required: true, message: '必填项不能为空' }
          ],
          itemBusinessType: [
            { required: true, message: '必填项不能为空' }
          ],
          itemIcon: [
            { required: true, message: '必填项不能为空' }
          ],
          itemOrderNo: [
            { required: true, message: '必填项不能为空' }
          ]
        }
      }
    },
    computed: {
      iconStyle() {
        var that = this
        var style = ''
        if (that.data.iconColor) {
          style += 'color:' + that.data.iconColor + ';'
        }
        if (that.data.iconSize > 0) {
          style += 'font-size:' + that.data.iconSize + 'px;'
        }
        return style
      }
    },
     mounted() {
      this.loadTreeSelect()
    },
     created: function() {
      var that = this
      var applicationId = Object.toQueryString('applicationId') || ''
      var itemBusinessType = Object.toQueryString('itemBusinessType') || ''
      that.formAction = formAction
      if (formAction == FUI.FormAction.Add) {
        that.data.itemBusinessType = itemBusinessType
        if (itemBusinessType == 'group') {
          that.data.itemIcon = 'icon icon-Files-66 '
        }
        that.itemBusinessTypeDisabled = itemBusinessType != ''
        that.data.refApplicationId = applicationId
        const currUser = that.$store.state.user.author
        that.data.creatorId = currUser.userId
        that.data.tenantId = currUser.tenantId
        that.data.createdTime = Object.toGetCurrentDateTimeString()
      } else {
        that.itemBusinessTypeDisabled = true
      }
      that.loadData()
    },
    methods: {
      closeEdit() {
        FUI.Window.closeEdit()
      },
       loadTreeSelect() {
        var that = this
        var treeUrl = '/workflow/security/applicationItem/getItemTreeJson?applicationId=' + that.data.refApplicationId + '&needRoot=true'
        Object.toAjaxJson(treeUrl, null, null, true, null, function(res) {
          if (res.success) {
            that.treeData = res.data
          } else {
            FUI.Window.showMsg(res.msg)
          }
        })
      },
       loadData() {
        var that = this
        if (formAction != FUI.FormAction.Add) {
          FUI.Form.bindDataToForm(that, '/workflow/security/applicationItem/', 'getModel', keyId, null, mainTable)
        }
      },
       submitForm() {
        var that = this
        var success = that.validateForm('formRef')
        if (!success) return
        if (that.data.parentId == that.data.itemId) {
          FUI.Window.showMsg('上组分组不能是自己')
          return false
        }
        FUI.Form.submitForm(that, that.data, '/workflow/security/applicationItem/', 'save', formAction, keyId, parentGridId, mainTable)
      },
       validateForm(refFormName) {
        var success = false
        this.$refs[refFormName].validate(valid => {
          success = valid
        })
        return success
      },
       selectAweIcon(inputKey) {
        var that = this
        WF.SelectorDialog.selectAweIcon(that, inputKey, null, null, null, true)
      },
       onRefSelect(keyInput, titleInput) {
        var that = this
        var itemBusinessType = that.data.itemBusinessType
        if (itemBusinessType == '') {
          FUI.Window.showMsg('请先选择类型')
          return false
        }
        if (itemBusinessType == 'customDataGrid') {
          WF.SelectorDialog.selectCustomDataGrid(this, keyInput, titleInput)
        } else if (itemBusinessType == 'appPortal') {
          WF.SelectorDialog.selectAppPortal(this, keyInput, titleInput)
        } else if (itemBusinessType == 'startWorkflow') {
          WF.SelectorDialog.selectorProcessApp(this, keyInput, titleInput)
        }
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
