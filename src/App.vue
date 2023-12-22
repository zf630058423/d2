<template>
  <div id="app">
    <router-view :key="key" />
  </div>
</template>

<script>
import WebSoket from '@/utils/connectionWebSoket';

export default {
  name: 'App',
  data(){
      return{
        value: null
      }
  },
    computed: {
      key() {
        // 暂时没有更好的方案，监听特殊参数才重新渲染
        // if (this.$route.path == "/workflow/workflowMonitor/hangupUrgeList/") {
        //   return Date.now();
        // } else if (this.$route.path == "/workflow/security/authorize/authorizeDefList/") {
        //   return Date.now();
        // }
        return 'routerKey'
      }
  },
  mounted() {
    WebSoket.connectionWebSoket();
  },
  destroyed() {
    WebSoket.clearWebSoket();
  }
}
</script>

<style>
  @media screen and (max-width: 500px) {
    .el-message-box{
      zoom: 0.8;
    }
  }
  @media only screen and (min-width: 600px) {
    .el-message-box{
      zoom: 1;
    }
  }
  .avatar-uploader .el-upload-dragger{
    border: none;
    width: 100% !important;
    height: 120px;
  }
  .cost .el-form-item__label{
    font-weight: normal !important;
  }
  .costListClass .el-form-item__label{
    font-weight: normal !important;
  }
  .batchClaimInvoices .el-form-item__label{
    font-weight: normal !important;
  }

  .CodeMirror {
    /* font-family: Arial, monospace; */
    font-family: "JetBrains Mono, 'Courier New', monospace";
    font-size: 14px;
    /* line-height : 20px; */
  }
</style>

