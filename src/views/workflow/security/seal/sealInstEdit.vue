<template>
  <div class="f2bpm-page-dialog-layout">
    <div>
      <el-form ref="formRef" :rules="formRules" size="small" :model="data" class="f2bpm-editform" label-width="120px">
        <el-form-item label="审核类型" prop="Flag">
          <el-select v-model="data.Flag">
            <el-option label="请选择" value="" />
            <el-option label="同意类" value="1" />
            <el-option label="不同意类" value="0" />
          </el-select>
        </el-form-item>
        <el-form-item label="排序" prop="OrderNum">
          <el-input-number v-model="data.OrderNum" size="small" :min="1" :max="100000" label="排序" />
        </el-form-item>
        <el-form-item label="审核意见" prop="OpinionContent">
          <el-input v-model="data.OpinionContent" type="textarea" :rows="4" placeholder="审核意见" />
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
        isOnlyMySelf: 1,
        treeData: [],
         data: {
          Flag: '1',
          OrderNum: 1,
          TenantId: '',
          OpinionType: '',
          CreatorId: '',
          CreatorRealName: '',
          CreatorOrgId: '',
          CreatedTime: ''
        },
        // ===========SqlKey==========
         sqlkeyArray: [{
          // dataField: 'groupKeyData',
          // sqlkey: 'CB_CategoryGroup',
          // parm: null,
          // flag: null,
          // change: null
        }],
        // ,configTypeArray:[{
        //     // dataField:'DataTypeData',
        //     // configType:'基本数据类型',
        //     // flag:''
        // }
        // ]
        // stand:表单校验规则
         formRules: {
          Flag: [
            { required: true, message: '必填项不能为空' }
            // {validator: FUI.Validator.onlyBigEnglisthChar},
          ],
          OpinionContent: [
            { required: true, message: '必填项不能为空' }
          ]
        }
      }
    },
    created: function() {
      var that = this
      var isOnlyMySelf = Object.toQueryString('isOnlyMySelf')
      that.isOnlyMySelf = isOnlyMySelf
      that.formAction = formAction
      if (formAction == FUI.FormAction.Add) {
        const currUser = FUI.Sys.getAuthor()
        that.data.CreatorId = currUser.userId
        that.data.CreatorRealName = decodeURI(currUser.realName)
        that.data.CreatedTime = Object.toGetCurrentDateTimeString()
        that.data.TenantId = currUser.tenantId
        if (isOnlyMySelf == true) {
          // 私人
          that.data.OpinionType = '0'
        } else {
          // 公共
          that.data.OpinionType = '1'
        }
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

        if (formAction != FUI.FormAction.Add) {
          FUI.Form.bindDataToForm(that, FUI.Handlers.FuiFrameworkHandler, FUI.Method.AutoGetViewModelMethod, keyId, null, mainTable)
        }
      },
       submitForm() {
        var that = this
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
       toPinYin(sourceField, targetField) {
        if (!this.data[targetField]) {
          const source = this.data[sourceField]
          this.data[targetField] = Object.toPinYin(source)
        }
      }
    }
  }
</script>
