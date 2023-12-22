<template>
  <div>
    <el-form ref="formRef" :model="data" size="small" class="f2bpm-editform" label-width="120px">
      <el-form-item label="传阅到目标用户：">
        <el-input v-model="data.realNames" placeholder="请选择处理人" readonly="readonly" class="textAutoBoxLong75" />
        <i class="fa fa-search cur" @click="selectorUserString('userIds','realNames',null,false,'userId')">选择</i>
        <a href="javascript:void(0)" class="red" @click="clearSelectedUsers('userIds','realNames')"><i class="fa fa-minus-circle" />清除</a>
      </el-form-item>
      <el-form-item label="个人常用审批语" prop="opinion">
        <f2bpmui-select sqlkey="CB_ProcessOpinion_Select" :props="props" field="opinionv" props="props" :fieldvalue="data.ActivityName" @updatevalue="updateFieldValue" />
      </el-form-item>
      <el-form-item label="传阅意见" prop="opinion">
        <el-input v-model="data.opinion" type="textarea" :rows="4" />
      </el-form-item>
    </el-form>
    <div class="dialogfooter">
      <el-button size="small" type="primary" @click="submitForm()"><i class="fa fa-save" />确定传阅
      </el-button>
      <el-button id="btn_cancel" size="small" @click="closeEdit"><i class="fa fa-minus-circle" />取消
      </el-button>
    </div>
  </div>
</template>

<script>

  export default { data() {
      return {
        props: { parm: { OpinionType: 0, CreatorId: '' }},
        opinionv: '',
        data: {
          wiids: '',
          userIds: '',
          realNames: '',
          opinion: ''
        }
      }
    },
    created: function() {
      var that = this;
      that.language =  that.$store.state.app.language;
      var wiids = Object.toQueryString('wiids')
      that.data.wiids = wiids
      that.props.parm.CreatorId = this.$store.state.user.userId
    },
    mounted() {
      window.myvm = this
    },
    methods: {
      // ===stand:标准化方法============
      closeEdit() {
        // stand:关闭编辑窗口
        FUI.Window.closeEdit()
      },
      // ===stand:标准化方法结束============
       selectorUserString(inputKey, inputName, passParm, singleSelect, keyName) {
        var that = this
        WF.SelectorDialog.selectorUserString(that, inputKey, inputName, passParm, singleSelect, keyName)
      },
       clearSelectedUsers(inputId, inputName) {
        var that = this
        that.data[inputId] = ''
        that.data[inputName] = ''
      },
       updateFieldValue(fieldName, newVal) {
        var that = this
        that.data.opinion = that.data.opinion + newVal
      },
       submitForm() {
        var that = this
        var targetUserId = that.data.userIds
        var opinion = that.data.opinion
        var wiids = that.data.wiids
        if (targetUserId == '') {
          FUI.Window.showMsg('请选择传阅到的用户！')
          return false
        }
        FUI.Window.confirm(that, '您确定要提交传阅', '提示', function() {
          var data = Object.toAjaxJson(FUI.Handlers.WorkflowBusinessHandler, 'saveBathCirculationDialog', {
            wiids: wiids,
            toUserIds: targetUserId,
            opinion: opinion
          })
          FUI.Window.showMsg(that, data.msg, null, '', function() {
            if (data.success) { FUI.Window.closeEdit() }
          })
        })
      }
    }
  }
  window.getResult = function() {
    return myvm.getResult()
  }
</script>
