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
        <el-row>
          <el-col :span="12">
            <el-form-item label="集成类型" prop="integrationType">
              <f2bpmui-select
                :readOnly="formAction != 'Add'"
                :field="integrationType_def"
                :fieldvalue="data.integrationType"
                @updatevalue="updateFieldValue"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="应用名称" prop="agentTitle">
              <el-input v-model="data.agentTitle"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="AgentId" prop="agentId">
              <el-input v-model="data.agentId"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="State" prop="state">
              <el-input
                v-model="data.state"
                placeholder="自定义状态码参数，与企业微信后台配置保持一致,多租户时填写租户ID"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="corpId" prop="corpId">
          <el-input v-model="data.corpId" placeholder="企业ID"></el-input>
        </el-form-item>

        <el-form-item label="应用URL" prop="agentUrl">
          <el-input
            v-model="data.agentUrl"
            placeholder="企业微信的回跳地址RedirectUri"
          ></el-input>
        </el-form-item>
        <el-form-item label="应用secret" prop="agentSecret">
          <el-input
            v-model="data.agentSecret"
            type="textarea"
            :rows="4"
          ></el-input>
        </el-form-item>
        <el-divider></el-divider>

        <el-form-item label="移动端地址" v-if="false" prop="mobileHttp">
          <el-input v-model="data.mobileHttp"></el-input>
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="租户号" v-if="isMultiTenant" prop="tenantId">
              <el-input v-model="data.tenantId"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否启用" prop="isEnabled">
              <el-switch
                v-model="data.isEnabled"
                active-color="#13ce66"
                inactive-color="#DEDEDE"
              />
            </el-form-item>
          </el-col>
        </el-row>
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
      isMultiTenant: false,
      loading: false,
      formAction: null,
      treeData: [],
      integrationType_def: {
        fieldName: 'integrationType',
        fieldTitle: '集成类型',
        itemRender: {},
        inputCtrlOption: {
          data: [
            { orderNum: 1, text: '企业微信', value: 'qyweixin' },
            { orderNum: 2, text: "钉钉", value: "dingding" },
            { orderNum: 3, text: '天眼查', value: 'tianyancha' },
            { orderNum: 4, text: '聚美智数', value: 'jumeizhishu' },
            { orderNum: 5, text: '工盟', value: 'gomeet' },
            { orderNum: 6, text: 'drp1.0单点登陆', value: 'spl1' },
            { orderNum: 7, text: 'drp2.0单点登陆', value: 'spl2' },
            { orderNum: 8, text: '见知', value: 'jianzhi' },
            { orderNum: 9, text: '签章平台', value: 'visa' },
            { orderNum: 10, text: '德思平台', value: 'desi' },
            { orderNum: 11, text: '智链推送', value: 'zhiliants' },
            { orderNum: 12, text: '百望', value: 'baiwang' },
            { orderNum: 13, text: 'drp1.0 API ', value: 'drp1.0API' },
            { orderNum: 13, text: '钉钉OCR ', value: 'dingding_ocr' },
          ],
          type: 'custom'
        }
      },
      data: {
        id: '',
        agentId: '',
        corpId: '',
        integrationType: '',
        mobileHttp: '',
        agentUrl: '',
        corpSecret: '',
        agentTitle: '',
        agentSecret: '',
        isEnabled: true,
        state: '',
        tenantId: ''
      },
      formRules: {
        corpId: [{ required: true, message: '必填项不能为空' }],
        agentId: [{ required: true, message: '必填项不能为空' }],
        integrationType: [{ required: true, message: '必填项不能为空' }],
        agentTitle: [{ required: true, message: '必填项不能为空' }],
        tenantId: [{ required: true, message: '必填项不能为空' }]
      }
    }
  },
  mounted () {
    var that = this
    window.myvm = that
  },
  created: function () {
    var that = this
    var currUser = that.$store.state.user.author
    that.isMultiTenant = currUser.isMultiTenant
    that.formAction = formAction
    if (formAction == FUI.FormAction.Add) {
      const currUser = that.$store.state.user.author
      that.data.tenantId = currUser.tenantId
      that.data.state = currUser.tenantId
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
          '/workflow/security/integration/',
          'getModel',
          keyId,
          null,
          mainTable
        )
      }
    },
    submitForm () {
      var that = this
      //f2bpmui.base.js中全局方法收集富文编辑器数据
      fui_global_richeditorArrValueToInput(that)
      var success = that.validateForm('formRef')
      if (!success) return
      FUI.Form.submitForm(
        that,
        that.data,
        '/workflow/security/integration/',
        'saveModel',
        formAction,
        keyId,
        parentGridId,
        mainTable
      )
    },
    // field: 可以是字段名也可以是字段定义的对象
    updateFieldValue (field, newValue, itemValue, vueDataName, subVueDataName) {
      // 更新控件值
      var that = this
      var vueDataObj = vueDataName ? that[vueDataName] : that.data
      if (subVueDataName) {
        vueDataObj = that[vueDataName][subVueDataName]
      }
      if (typeof field === 'string') {
        vueDataObj[field] = newValue
      } else {
        if (field.fieldName) {
          vueDataObj[field.fieldName] = newValue
        } else if (field.vModel) {
          vueDataObj[field.vModel] = newValue
        } else if (field['field']) {
          vueDataObj[field['field']] = newValue
        }
      }
    },
    validateForm (refFormName) {
      var success = false
      this.$refs[refFormName].validate(valid => {
        success = valid
      })
      return success
    }
  }
}
</script>
