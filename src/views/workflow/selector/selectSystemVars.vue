<template>
  <div class="f2bpm-page-layout">
    <div>
      <div class="fence-box" style="width: 220px;overflow-y:auto;height: 300px ;">
        <div class="fence-box-text" style="text-align: left;padding: 5px;">
          <i class="fa fa-table" aria-hidden="true" />系统变量（单击选择）：
        </div>
        <ul id="list">
          <li v-for="item in leftData" class="fence-li-item" :value="item.value" :text="item.text" @click="leftSelected(item.value)">
            {{ item.text }}
          </li>
        </ul>
      </div>
      <div class="fence-box right-result-boxlist" style="width: 180px;overflow-y:auto;height: 300px ;">
        <div class="fence-box-text">
          <i class="fa fa-folder" aria-hidden="true" />已选变量（单击删除）：
        </div>
        <ul id="listResult">
          <li v-for="item in rightData" class="fence-li-item" :value="item.value" :text="item.text" @click="rightSelected(item.value)">
            {{ item.text }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
  export default { data() {
      return {
        loading: false,
        initailData: null,
        leftData: [
          { text: '当前登录用户ID', value: '#CurrentUserId#' },
          { text: '当前登录用户账号', value: '#CurrentAccount#' },
          { text: '当前登录用户姓名', value: '#CurrentRealName#' },
          { text: '当前登录用户组织ID', value: '#CurrentOrgId#' },
          { text: '当前登录用户组织名称', value: '#CurrentOrgName#' },
          { text: '当前登录用户租户ID', value: '#CurrentTenantId#' },
          { text: '当前日期', value: '#CurrentDate#' },
          { text: '当前日期时间', value: '#CurrentDateTime#' },
          { text: '年月日时分秒字符串', value: '#yyyyMMddhhmmss#' }

        ],
        rightData: []
      }
    },
    computed: {

    },
     created() {
      var that = this
      var parmsStr = Object.toQueryString('parms')
      var parms = {}
      if (parmsStr) {
        parmsStr = decodeURIComponent(parmsStr)
        parms = eval('(' + parmsStr + ')')
      }
      var initailData = parms.data || []
      if (initailData) {
        that.initailData = initailData
        that.initail()
      }
    },
     mounted() {
      window.myvm = this
    },
    methods: {
      initail() {
        var that = this
        var left = []
        var right = []
        if (that.initailData == null || that.initailData.length == 0) {
          return false
        }
        $.each(that.leftData, function(i, item) {
          var theItem = null
          $.each(that.initailData, function(i, it) {
            var code = it.value
            if (code == item.value) {
              right.push(item)
              theItem = item
            }
          })
          if (theItem == null) {
            left.push(item)
          }
        })
        that.leftData = left
        that.rightData = right
      },
       leftSelected(value) {
        var that = this
        var left = []
        var theItem = null
        $.each(that.leftData, function(i, item) {
          if (item.value != value) {
            left.push(item)
          } else {
            theItem = item
          }
        })
        that.leftData = left
        if (theItem) {
          that.rightData.push(theItem)
        }
      },
       rightSelected(value) {
        var that = this
        var right = []
        var theItem = null
        $.each(that.rightData, function(i, item) {
          if (item.value != value) {
            right.push(item)
          } else {
            theItem = item
          }
        })
        that.rightData = right
        if (theItem) {
          that.leftData.push(theItem)
        }
      },
       getResult() {
        var that = this
        var data = that.rightData
        return data
      }
    }
  }

  window.getResult = function() {
    return myvm.getResult()
  }
</script>
