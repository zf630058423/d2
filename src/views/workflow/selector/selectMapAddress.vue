<template>
  <div class="f2bpm-page-layout">
    <el-container>
      <el-main class="f2bpm-page-right">
        <iframe id="amapiframe" :src="src" width="100%" height="900" frameborder="0" />
      </el-main>
    </el-container>
  </div>
</template>
<script>
  export default {
    name: 'OpinionList',
    data() {
      return {
        amapAccessKey: '',
        viewerUrl: '/static/html/web/amap.html?',
        data: {
          address: '',
          lon: '',
          lat: ''
        }
      }
    },
    computed: {
      countGridHeight() {
        return $(document).height() - global_datagridHeightDiff
      },
      rotateIcon() {
        return this.isCollapsed
          ? 'fa fa-angle-double-right'
          : 'fa fa-angle-double-left'
      },
      positionIcon() {
        return this.isCollapsed
          ? 'cursor:pointer; position: relative;left: -5px;'
          : 'cursor:pointer; position: relative;left: 100px;'
      }
    },
    mounted() {
      var that = this
      window.myvm = this
      $('#amapiframe').attr('height', $(window).height())
      $(window).resize(function() {
        $('#amapiframe').attr('height', $(window).height())
      })
      var iframe = document.getElementById('amapiframe')
      setTimeout(function() {
        iframe.contentWindow.onPageLoad(that.data)
      }, 1000)
    },
     created() {
      var that = this
      var amapAccessKey = Object.toQueryString('amapAccessKey')
      that.amapAccessKey = amapAccessKey
      that.loadWindowparms()
      that.src = that.viewerUrl + 'amapAccessKey=' + that.amapAccessKey + '&id=' + Object.toGuid()
    },
    methods: {
      loadWindowparms() {
        const that = this
        var parmsStr = Object.toQueryString('parms')
        var parms = {}
        if (parmsStr) {
          parmsStr = decodeURIComponent(parmsStr)
          parms = eval('(' + parmsStr + ')')
          that.data.addr = parms.addr
          that.data.lon = parms.lon
          that.data.lat = parms.lat
        }
      }
    }

  }
  window.getResult = function() {
    var iframe = document.getElementById('amapiframe')
    var result = iframe.contentWindow.getResult()
    return result
  }
</script>
