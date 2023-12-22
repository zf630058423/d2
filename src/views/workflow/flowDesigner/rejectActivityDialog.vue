<template>
  <div class="f2bpm-page-layout">
    <div>
      <div class="fence-box" style="width: 220px;height: 350px;">
        <div class="fence-box-title">
          <i class="fa fa-table" aria-hidden="true" />流程节点（单击选择）：
        </div>
        <ul id="list">
          <li v-for="item in leftData" class="fence-li-item" :activityid="item.activityId" :activityname="item.activityName" :activitycode="item.activityCode" @click="leftSelected(item.activityId)">
            {{ item.stepId }}-{{ item.activityName }}
          </li>
        </ul>
      </div>
      <div class="fence-box" style="width:80px;margin: 0px;border: 0px;padding-top: 140px; ">
        <a href="javascript:void(0);" title="清空左侧已选节点" role="button" class="btn btn-primary btn-sm mr2" @click="cleanAll"><i class="fa  fa-undo" />清空</a>
      </div>
      <div class="fence-box right-result-boxlist" style="width: 180px;height: 350px;">
        <div class="fence-box-title">
          <i class="fa fa-folder" aria-hidden="true" />已选节点（单击删除）：
        </div>
        <ul id="listResult">
          <li v-for="item in rightData" class="fence-li-item" :activityid="item.activityId" :activityname="item.activityName" :activitycode="item.activityCode" @click="rightSelected(item.activityId)">
            {{ item.stepId }}-{{ item.activityName }}
          </li>
        </ul>
      </div>
    </div>
    <div class="dialogfooter">
      <a href="javascript:void(0);" role="button" class="btn btn-primary btn-sm mr2" @click="saveAndClose"><i class="fa fa-save" />确定</a>
      <a href="javascript:void(0);" role="button" class="btn btn-primary btn-sm" @click="closeEdit"><i class="fa fa-minus-circle" />取消</a>
    </div>
  </div>
</template>

<script>
  export default { data() {
      return {
        attrName: '',
        wid: '',
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
      var wid = Object.toQueryString('wid') || ''
      var obj
      var attrName = null
      var initailData = []
      // obj = window.dialogArguments;
      // json格式：[{text:"节点名称",value:"节点编码"},{}]
      obj = parent.window.currentWindowTargetObjectValue
      var value = obj.value || []
      var title = obj.title
      attrName = obj.name
      if (value != null && value != '' && Object.toStartWith(value, '#')) {
        value = value.toString().substr(1, value.toString().length - 2)
        value = Object.toStringToJson(value)
      }
      initailData = value || []
      var that = this
      that.attrName = attrName
      that.wid = wid
      var res = Object.toAjaxJson('/workflow/flowDesigner/', 'getRejectActivityJson', { wid: wid })
      if (res.success) {
        that.leftData = res.data
      } else {
        FUI.Window.showMsg(that, res.msg)
      }
      if (initailData) {
        that.initailData = initailData
        that.initail()
      }
    },
     mounted() {
      window.myvm = this
    },
    methods: {
      closeEdit() {
        // stand:关闭编辑窗口
        FUI.Window.closeEdit()
      },
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
            var code = it.activityCode
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
       cleanAll() {
        var that = this
        var right = []
        $.each(that.rightData, function(i, item) {
          that.leftData.push(item)
        })
        that.rightData = right
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
       saveAndClose() {
        var that = this
        FUI.Window.confirm(that, '您确定要提交保存？', '温馨提示', function() {
          var resultStr = '#' + that.getResult() + '#'
          parent.setTargetValue(that.attrName, resultStr)
          FUI.Window.closeEditAll()
        })
      },
       getResult() {
        var that = this
        var s = ''
        if (that.rightData.length == 0) {
          s = ''
        } else {
          s = JSON.stringify(that.rightData)
        }
        return s
      }
    }
  }

  window.getResult = function() {
    return myvm.getResult()
  }
</script>
