<template>
  <el-form ref="formRef" class="f2bpm-editform" label-width="120px">
    <span v-if="false" placeholder="" v-html="data.monitorUser" />
    <el-input v-model="data.monitorRealName" placeholder="请选择流程监控人" size="mini">
      <template slot="append"><i class="fa fa-search cur" @click="selectorUserTextValue('monitorUser','monitorRealName',null,true)">选择</i>
      </template>
    </el-input>
    <span class="fa fa-minus-circle red cur mt4" @click="clear">清空</span>
    <div class="dialogfooter">
      <el-button size="small" type="primary" @click="saveAndClose()"><i class="fa fa-save" />保存
      </el-button>
      <el-button id="btn_cancel" size="small" onclick="FUI.Window.closeEdit()"><i class="fa fa-minus-circle" />取消
      </el-button>
    </div>
  </el-form>
</template>

<script>
  export default {
    data() {
      return {
        attrName: '',

        data: {
          monitorUser: '',
          monitorRealName: ''
        }

      }
    },
    created: function() {
      var that = this
      var obj
      var wid
      var attrName
      var value
      obj = parent.window.currentWindowTargetObjectValue
      var title = obj.title
      value = obj.value
      attrName = obj.name
      wid = obj.otherParm
      this.content = value
      this.attrName = attrName
      if (value) {
        // 去掉前后的#号
        value = value.replace('#', '').replace('#', '')
        value = typeof value === 'string' ? eval('(' + value + ')') : value
        this.data.monitorUser = value
        var realNameList = []
        $.each(value, function(i, item) {
          realNameList.push(item.text)
        })
        this.data.monitorRealName = realNameList.toString()
      }
    },
     mounted() {
      window.myvm = this
    },
    methods: {
      selectorUserTextValue(inputKey, inputName, passParm, singleSelect, keyName) {
        var that = this
        WF.SelectorDialog.selectorUserTextValue(that, inputKey, inputName, passParm, singleSelect, keyName)
      },
       clear() {
        this.data.monitorUser = ''
        this.data.monitorRealName = ''
      },
       saveAndClose() {
        var that = this
        var resultStr = that.data.monitorUser
        FUI.Window.confirm(that, '您确定要提交？', '温馨提示', function() {
          if (resultStr == '[]') {
            parent.setTargetValue('')
          } else {
            resultStr = '#' + resultStr + '#'
            parent.setTargetValue(that.attrName, resultStr)
          }
          FUI.Window.closeEditAll()
        })
      }
    }
  }
</script>
