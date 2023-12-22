<template>
  <div class="f2bpm-page-layout">
    <el-container id="onlinedesigner_maincontainer">
      <el-main class="dash-chart-main" style="overflow: hidden;">
        <f2bpm-report :code="reportCode" />
      </el-main>
    </el-container>
  </div>
</template>

<script>
      import f2bpmReport from '@/views/workflow/components/onlineForm/f2bpm-report'
  export default {
    components: {
			f2bpmReport
		},
     data() {
      return {
        reportCode: ''

      }
    }, computed: {

    },
    created: function() {
      window.myvm = this
      var that = this
      var reportCode = Object.toQueryString('reportCode') || ''
      that.reportCode = reportCode
    },
     mounted() {

    },
    methods: {

    }
  }
</script>
