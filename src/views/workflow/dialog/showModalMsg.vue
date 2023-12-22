<template>
  <div style="padding: 5px;">
    <div style="font-size: 14px;margin: 4px;" v-html="label" />
    <el-input v-if="isInput" v-model="inputContent" type="textarea" :rows="6" :placeholder="inputTip" />
    <div style="text-align: left ;font-size: 12px;padding: 5px;">
      <i v-if="description!=''" :class="icon" /> <span v-html="description"  />
    </div>
  </div>
</template>

<script>
  export default { data() {
      return {
        label: '',
        // 是否带填写输入框
        isInput: true,
        // 输入框的提示
        inputTip: '',
        // 输入框内容
        inputContent: '',
        // 描述内容
        description: '',
        icon: ''
      }
    },
    created() {
      var that = this
      var initailText = ''
      var parmsStr = Object.toQueryString('parms')
      var parms = {}
      if (parmsStr) {
        parmsStr = decodeURIComponent(parmsStr)
        parms = eval('(' + parmsStr + ')')
        initailText = parms.data || ''
      }
      that.label = parms.label || ''
      that.icon = parms.icon || ''
      that.description = parms.description || ''
      that.inputTip = parms.inputTip || '请填写内容'
      that.inputContent = parms.inputContent || ''
      if (parms.isInput === false) {
        that.isInput = false
      }
    },
     mounted() {
      window.myvm = this
    },
    methods: {
      getResult() {
        return this.inputContent
      }
    }
  }

  window.getResult = function() {
    return myvm.getResult()
  }
</script>
