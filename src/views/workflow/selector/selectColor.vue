<template>
  <div class="f2bpm-page-layout">
    <div style="padding: 20px;text-align: left;">
      <el-color-picker v-model="data.color" />
      <br>
      <el-input v-model="data.color" size="mini" style="width: 400px; margin-bottom: 10px;" />
      <div class="demo" :style="'background-color:'+data.color " />
    </div>
  </div>
</template>

<script>
  export default { data() {
      return {
        // ======stand:标准区=============
        data: {
          color: ''
        }
      }
    },
    created() {
      var that = this
      var parmsStr = Object.toQueryString('parms')
      var parms = {}
      if (parmsStr) {
        parmsStr = decodeURIComponent(parmsStr)
        parms = eval('(' + parmsStr + ')')
      }
      var color = parms.data || ''
      that.data.color = color
    },
     mounted() {
      window.myvm = this
    },
    methods: {
       getResult() {
        return this.data.color
      }
    }
  }
  window.getResult = function() {
    return myvm.getResult()
  }
</script>
<style>
  .demo{
    height: 150px;width: 400px;
  }
</style>
