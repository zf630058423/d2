<template>
  <div class="center">
    <div style="background-color: rgb(53, 52, 52);height: 35px;line-height: 35px;text-align: right;padding-right: 50px;">
      <el-button size="mini" type="primary" @click="downloadFile"><i class="fa fa-download" />下载
      </el-button>
    </div>
    <div>
      <img :src="src" alt="">
    </div>
  </div>
</template>
<script>
  export default {
    name: 'Pdf',
    data() {
      return {
        filePath: '',
        groupName: '',
        src: ''
      }
    }, computed: {
    },
    created() {
      var that = this
      window.myvm = that
      var filePath = Object.toQueryString('filePath') || ''
      var groupName = Object.toQueryString('groupName') || ''
      that.filePath = filePath
      that.groupName = groupName
      var src = __serverpath + FUI.Handlers.Common + 'getShowImage/?groupName=' + that.groupName + '&filePath=' + that.filePath
      that.src = src
    },
     mounted() {
    },
    methods: {
      downloadFile() {
        var that = this
        var filePath = that.filePath
        var groupName = that.groupName
        var fileName = filePath.substr(filePath.lastIndexOf('/'))
        var actionUrl = FUI.Handlers.Common
        var data = Object.toAjaxDownloadFile(actionUrl, 'downloadFile', { 'filePath': filePath, 'fileName': fileName, 'groupName': groupName })
      }
    }
  }
</script>
