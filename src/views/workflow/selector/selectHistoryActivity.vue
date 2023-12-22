<template>
  <div class="f2bpm-page-layout">
    <div>
      <div class="fence-box " style="width: 220px;">
        <div class="fence-box-title">
          <i class="fa fa-table" aria-hidden="true" />流程节点（单击选择）：
        </div>
        <ul id="list" class="auto-window-height-select">
          <li v-for="item in leftData" class="fence-li-item textClass" :activityid="item.activityId" :activityname="item.activityName" :activitycode="item.activityCode" @click="leftSelected(item.activityId)">
            {{ item.stepId }}-{{ item.activityName }}
          </li>
        </ul>
      </div>
      <div class="fence-box right-result-boxlist" style="width: 180px;">
        <div class="fence-box-title">
          <i class="fa fa-folder" aria-hidden="true" />已选节点（单击删除）：
        </div>
        <ul id="listResult" class="auto-window-height-select">
          <li v-for="item in rightData" class="fence-li-item textClass" :activityid="item.activityId" :activityname="item.activityName" :activitycode="item.activityCode" @click="rightSelected(item.activityId)">
            {{ item.stepId }}-{{ item.activityName }}
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
        // text,value的数据格式
        initailData: null,
        // {activityId:'1',activityName:'公司审批',activityCode:'sss',stepId:'1'},{activityId:'3',activityName:'公司审批3',activityCode:'22',stepId:'2'}
        leftData: [],
        rightData: []
      }
    },
    computed: {

    },
     created() {
      var that = this
      var wid = Object.toQueryString('wid') || ''
      var appId = Object.toQueryString('appId') || ''
      var res = Object.toAjaxJson('/workflow/selector/', 'getHistoryActivityJson', { appId: appId, wid: wid })
      if (res.success) {
        that.leftData = res.data
      } else {
        FUI.Window.showMsg(that, res.msg)
      }
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
            if (code == item.activityCode) {
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
       leftSelected(activityid) {
        var that = this
        var left = []
        var theItem = null
        $.each(that.leftData, function(i, item) {
          if (item.activityId != activityid) {
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
       rightSelected(activityid) {
        var that = this
        var right = []
        var theItem = null
        $.each(that.rightData, function(i, item) {
          if (item.activityId != activityid) {
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
        var data = []
        $.each(that.rightData, function(index, item) {
          var activityCode = item.activityCode
          var activityName = item.activityName
          data.push({
            value: activityCode,
            text: activityName
          })
        })
        return data
      }
    }
  }

  window.getResult = function() {
    return myvm.getResult()
  }
</script>
<style scoped>
  .textClass{
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
</style>
