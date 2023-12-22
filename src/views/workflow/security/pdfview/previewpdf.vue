<template>
  <div class="center">
    <iframe id="pdfiframe" :src="src" width="100%" height="900" frameborder="0" />
  </div>
</template>
<script>
  export default {
    name: 'Pdf',
    data() {
      return {
        f2bpmToken:"",
        pdfUrl:"",
        filePath: '',
        groupName: '',
        viewerUrl: '/static/pdf/web/viewer.html?file=',
        src: ''
      };
    },
    computed: {
    },
    created() {
      var that = this;
      window.myvm = that;
      let f2bpmToken = "";
      var author = window.sessionStorage.getItem('f2bpmAuthor');
      if (author) {
        author = eval("(" + author + ")");
        f2bpmToken = author.token;
        that.f2bpmToken=f2bpmToken;
      }

      var filePath = Object.toQueryString('filePath') || '';
      var groupName = Object.toQueryString('groupName') || '';
      that.filePath = filePath;
      that.groupName = groupName;

      var url = __serverpath + "/workflow/security/baseCommon/getPdfData?groupName=" + groupName + "&filePath=" + filePath;
      url = url + "&f2bpmToken=" + f2bpmToken;
      that.pdfUrl=url;
      url = encodeURIComponent(url);
      that.src = that.viewerUrl + url + "&local=zh-CN";
    },
    mounted() {
      $('#pdfiframe').attr('height', $(window).height());
      $(window).resize(function () {
        $('#pdfiframe').attr('height', $(window).height());
      });
      window.myvm = this;
    },
    methods: {
      openByBrowser() {
        let that=this;
        FUI.Window.open(that.pdfUrl);
      }
    }
  }
</script>