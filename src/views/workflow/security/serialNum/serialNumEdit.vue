<template>
  <div class="f2bpm-page-dialog-layout">
    <el-form ref="formRef" size="small" :rules="formRules" :model="data" class="f2bpm-editform" label-width="120px">
      <el-form-item label="流水号名称" prop="CounterName">
        <el-input v-model="data.CounterName" placeholder="流水号名称" @blur.native.capture="toPinYin('CounterName','CounterCode')" />
      </el-form-item>
      <el-form-item label="流水号编码" prop="CounterCode">
        <el-input v-model="data.CounterCode" placeholder="填写由英文字母组成的编码" :disabled="isDisabled" />
      </el-form-item>

      <el-form-item label="模板" prop="CounterTemplate">
        <el-input v-model="data.CounterTemplate" placeholder="{yyyy}{MM}{DD}{NO}" />
        <br>{yyyy}代表当前时间年，如2019
        <br>{MM}代表当前时间月份，如果小于10号，则前面补0，如1月表示为01
        <br>{mm}代表当前时间月份，如果小于10号，则前面不补0，如1月表示为1
        <br>{DD}代表当前时间的日，如果小于10号，则前面补0，如1号表示为01
        <br>{dd}代表当前时间的日，如果小于10号，则前面不补0，如1号表示为1
        <br>{no}代表流水号，后面补零 <br>{NO}代表流水号，前补零
        <br>在占位符{}大括号之外可以填写任何字符，如JS{yyyy}{MM}{DD}{NO}或ABC{yyyy}-{MM}-{DD}{NO}
      </el-form-item>
      <el-form-item label="当前最大值流水号" prop="CurrMaxSerialNo">
        <el-input v-model="data.CurrMaxSerialNo" placeholder="当前最大值的号,正式使用后请勿修改，以免影响流水号重复" />
        <br>正式使用后请勿修改，以免影响流水号重复
      </el-form-item>
      <el-form-item label="预生成个数" prop="PreMaxCount">
        <el-input-number v-model="data.PreMaxCount" :min="1" :max="1000" label="预生成个数" />
        <span class="font10 ml2">预生成个数不宜过大，建议100以下，当服务器重启后之前没用完的预生成的流水号将被丢弃，过大会造成流水号浪费。</span>
      </el-form-item>

      <el-form-item label="增长类型" prop="IncrementType">
        <el-select v-model="data.IncrementType">
          <el-option label="一直增长" value="forever" />
          <el-option label="每年生成" value="year" />
          <el-option label="每月生成" value="month" />
          <el-option label="每天生成" value="day" />
        </el-select>
        <br>1、 每天生成：每天从初始值开始计数
        <br>2、 每月生成：每月1号从初始值开始计数
        <br>3、 每年生成：每年从1月1号从初始值开始计数
        <br>4、 一直增长：流水号一直增加。
      </el-form-item>
      <el-form-item label="最近增长时间" prop="LastIncrementTime">
        <el-input v-model="data.LastIncrementTime" />
      </el-form-item>
      <el-form-item label="流水号长度" prop="SerialLength">
        <el-input-number v-model="data.SerialLength" :min="1" :max="10" label="流水号长度" />
        <br>流水号长度是指{NO}或{no}这个占位的长度，如长度填写为5，则{NO}当前流水号的计数是6，则结果为00006前面补4个零。{no}当前流水号的计数是6，则结果为60000后面补4个零。流水号达到最大值时，如长度为5，而59999为最大流水号的值，再次增长时会从初始值开始。
      </el-form-item>
      <el-form-item label="初始值" prop="InitailNo">
        <el-input-number v-model="data.InitailNo" :min="1" :max="10" label="流水号长度" />
        <br>初始值：这个初始值为计数的开始值，如1
      </el-form-item>
      <el-form-item label="增长步长" prop="StepSize">
        <el-input-number v-model="data.StepSize" :min="1" :max="10" label="增长步长" />
        步长：是指流水号每次增加的长度，默认为1。比如步长为2，而每次计数在原来的基本上加2.比如初始值是1，则结果是这样的：1，3，5，7，9
      </el-form-item>
      <el-form-item label="备注" prop="Remarks">
        <el-input v-model="data.Remarks" type="textarea" :rows="4" />
      </el-form-item>
      <el-form-item label="流水号生成日志" prop="Logs">
        <el-input v-model="data.Logs" type="textarea" :rows="4" />
      </el-form-item>
      <div class="dialogfooter2">
        <el-button v-if="formAction!='View'" size="small" type="primary" @click="submitForm()"><i class="fa fa-save" />保存</el-button>
        <el-button id="btn_cancel" size="small" @click="closeEdit"> <i class="fa fa-minus-circle" />取消</el-button>

        <el-button  v-if="formAction=='Edit'" title="刷新当前缓存中的预制流水号并按当前配置重置生成预制流水号,参数变化时需要先保存后再点击本刷新按钮" class="btn btn-danger btn-sm mr2" @click="refreshAndGenerateSerialNumber"><i class="fa fa-refresh" />重置预制流水号 </el-button>
      </div>
    </el-form>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        isMultiTenant: false,
        formAction: null,
        isDisabled: false,
        treeData: [],
         data: {
          TenantId: '',
          CreatorId: '',
          Creator: '',
          CreatedTime: '',
          UpdateTime: '',
          CounterTemplate: '{yyyy}{MM}{DD}{NO}',
          CurrMaxSerialNo: 0,
          PreMaxCount: 10,
          IncrementType: 'forever',
          SerialLength: 5,
          InitailNo: 1,
          StepSize: 1,
          CounterName: '',
          CounterCode: ''

        },
        // stand:表单校验规则
         formRules: {
          CounterName: [
            { required: true, message: '必填项不能为空' }
          ],
          CounterCode: [
            { required: true, message: '必填项不能为空' },
            { validator: FUI.Validator.chars }
          ],
          CurrMaxSerialNo: [
            { required: true, message: '必填项不能为空' }
          ],
          PreMaxCount: [
            { required: true, message: '必填项不能为空' }
          ],
          SerialLength: [
            { required: true, message: '必填项不能为空' }
          ],
          InitailNo: [
            { required: true, message: '必填项不能为空' }
          ],
          StepSize: [
            { required: true, message: '必填项不能为空' }
          ],
          CounterTemplate: [
            { required: true, message: '必填项不能为空' }
          ]
        }
      }
    },
    created: function() {
      var that = this
      that.formAction = formAction
      const currUser = FUI.Sys.getAuthor()
      that.isMultiTenant = currUser.isMultiTenant
      if (formAction == FUI.FormAction.Add) {
        that.data.CreatorId = currUser.userId
        that.data.Creator = decodeURI(currUser.realName)
        that.data.CreatedTime = Object.toGetCurrentDateTimeString()
        that.data.UpdateTime = Object.toGetCurrentDateTimeString()
        that.data.TenantId = currUser.tenantId
      } else {
        that.data.UpdateTime = Object.toGetCurrentDateTimeString()
        that.isDisabled = true
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
        if (formAction == FUI.FormAction.Add && that.isMultiTenant) {
          // 编号需要加上租户号
          that.data.CounterCode = that.data.TenantId + '_' + that.data.CounterCode
        }
        FUI.Form.submitForm(that, that.data, FUI.Handlers.FuiFrameworkHandler, FUI.Method.AutoSaveMethod, formAction, keyId, parentGridId, mainTable)
      },
       refreshAndGenerateSerialNumber() {
        var that = this
        FUI.Window.confirm(that, '请警慎操作！如有修改参数，请先保存后再刷新缓存流水号；您确定要重新刷新缓存中的预制流水号吗？', null, function() {
          var data = Object.toAjaxJson('/workflow/security/serialNum/', 'refreshAndGenerateSerialNumber', { counterCode: that.data.CounterCode })
          FUI.Window.showMsg(that, data.msg, null, data.success ? 1 : 7, function() {
            if (data.success == true) {
              window.location.reload()
            }
          })
        })
      },
       toPinYin(sourceField, targetField) {
        if (!this.data[targetField]) {
          const source = this.data[sourceField]
          this.data[targetField] = Object.toPinYin(source)
        }
      },
       validateForm(refFormName) {
        // stand:表单校验
        var success = false
        this.$refs[refFormName].validate(valid => {
          success = valid
        })
        return success
      }
    }
  }
</script>
