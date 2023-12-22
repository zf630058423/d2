<template>
  <div class="f2bpm-page-layout">
    <div class="layui-form-item">
      <label class="layui-form-label">选择流程：</label>
      <div class="layui-input-block">
        <input id="workflowIdSelected" sqlkey="CB_MasterWorkflowList" change="myChange" lay-ignore class="textBoxLong"></input>
      </div>
    </div>
    <div class="layui-form-item">
      <label class="layui-form-label">选择节点：</label>
      <div class="layui-input-block">
        <input id="activityJson" type="hidden">
        <textarea id="activityDes" readonly="readonly" style="width: 90%; height: 200px;" placeholder="请选择流程节点" autocomplete="off" class="layui-input" />
        <a class="btn btn-minier btn-primary mr2 write" title="选择节点" onclick="thisSelectActivity('activityJson','activityDes');"> <i class="fa fa-search bigger-120">选择节点</i>
        </a> <a class="btn btn-minier btn-grey mr2 write" title="清空" onclick="myChange(this)"> <i class="fa fa-undo bigger-120">清空</i>
        </a>
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
