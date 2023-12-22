<template>
  <div style="text-align:center;padding-top: 10px;">
    <el-select size="mini" v-model="resultGridData" filterable placeholder="请选择" style="width: 95%">
      <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
    </el-select>
  </div>
</template>

<script>
  export default { data() {
      return {
        options: [],
        resultGridData: ''
      }
    },
    created() {
      var resultGridData = []
      var parmsStr = Object.toQueryString('parms')
      var parms = {}
      if (parmsStr) {
        parmsStr = decodeURIComponent(parmsStr)
        parms = eval('(' + parmsStr + ')')
      }
      if (parms.data) {
        resultGridData = parms.data || ''
      } else {
        resultGridData = parms || ''
      }

      var optionsData = []
      var data = FUI.Data.getConfigTypeData(true)
      $.each(data, function(i, item) {
        var configType = item.configType
        optionsData.push({ value: configType, label: configType })
      })
      this.options = optionsData
      this.resultGridData = resultGridData
    },
     mounted() {
      window.myvm = this
    },
    methods: {
      getResult() {
        return this.resultGridData
      }
    }
  }
  window.getResult = function() {
    return myvm.getResult()
  }
</script>
