<template>
  <div class="f2bpm-page-dialog-layout">
    <div style="padding: 4px; ">
      <el-tabs value="常规">
        <el-tab-pane label="常规" name="常规">
          <div class="pl5" style="height:360px; ">
            <legend style="font-size: 12px; margin: 0px;"><i class="fa fa-square" />系统名称字体颜色</legend>
            <div class="p10" style="line-height: 50px; ">
              <span> 登录界面：</span><el-color-picker v-model="generalKeyValueObj.loginTitleFontColor" style=" margin-left: 3px;" size="mini" />
              <span style="margin-left: 20px;">系统内部 ：</span><el-color-picker v-model="generalKeyValueObj.sysTitleFontColor" style=" margin-left: 3px;" size="mini" />
            </div>
            <legend style="font-size: 12px; margin: 0px;"><i class="fa fa-square" />系统名称字体大小</legend>
            <div class="p10" style="line-height: 50px; ">
              <span> 登录界面：</span>
              <el-input-number v-model="generalKeyValueObj.loginTitleFontSize" size="mini" :min="0" :max="50" label="" /> px
              <span style="margin-left: 20px;">系统内部 ：</span>
              <el-input-number v-model="generalKeyValueObj.sysTitleFontSize" size="mini" :min="0" :max="50" label="" /> px
              （0表示使用默认值）
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
      <div class="dialogfooter">
        <el-button size="small" type="primary" @click="saveAndClose()"><i class="fa fa-save" />确定</el-button>
        <el-button id="btn_cancel" size="small" @click="closeEdit"><i class="fa fa-minus-circle" />取消
        </el-button>
      </div>
    </div>
  </div>
</template>

<script>
  export default { data() {
      return {
        initailData: [],
        generalKeyValueObj: { loginTitleFontColor: '', loginTitleFontSize: '', sysTitleFontColor: '', sysTitleFontSize: '' },
        data: {
          general: { opttitle: '字段属性键值对常规设置', opttype: 'general', params: { 'kvData': [] }}
        }
      }
    },
    created() {
    },
     mounted() {
      var that = this
      window.myvm = that
      setTimeout(function() {
        var win = window.openerWin
        var data = win.getOptions()
        if (typeof data === 'string' && data) {
          data = eval('(' + data + ')')
        }
        that.initailData = data
        that.initail()
      }, 500)
    },
    methods: {
      closeEdit() {
        FUI.Window.closeEdit()
      },
       initail() {
        var that = this
        if (that.initailData == null || that.initailData.length == 0) {
          return false
        }
        $.each(that.initailData, function(opttype, item) {
          if (item != null) {
            var opttype = item.opttype
            that.data[opttype] = item
            if (opttype == 'general') {
              that.initailGeneralResult(item)
            }
          }
        })
      },
       validateForm(refFormName) {
        // stand:表单校验
        var success = false
        this.$refs[refFormName].validate(valid => {
          success = valid
        })
        return success
      },
       collectData() {
        var that = this
        try {
          var data = []
          var kvData = []
          $.each(that.generalKeyValueObj, function(key, value) {
            kvData.push({ 'key': key, 'value': value })
          })
          that.data.general.params.kvData = kvData
          var general = that.data.general
          data.push(general)

          var resultStr = JSON.stringify(data)
          if (resultStr == '[]') {
            return ''
          } else {
            return resultStr
          }
        } catch (err) {
          FUI.Window.showMsg(that, err)
          return false
        }
      },
       initailGeneralResult(jsonObj) {
        var that = this
        var kvData = jsonObj.params.kvData || []
        $.each(kvData, function(i, item) {
          that.generalKeyValueObj[item.key] = item.value
        })
      },
       saveAndClose() {
        var that = this
        var formOptions = that.collectData().replace(/\"/g, "'")
        try {
          window.openerWin.saveOptions(formOptions)
          FUI.Window.closeEdit()
        } catch (err) {
        }
      },
       selectorUserTextValue(inputKey, inputName, passParm, singleSelect, keyName) {
        var that = this
        WF.SelectorDialog.selectorUserTextValue(that, inputKey, inputName, passParm, singleSelect, keyName, null, null, that.data.autoCirculated)
      }
    }
  }
  window.getResult = function() {
    return myvm.getResult()
  }
</script>
