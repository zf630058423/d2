<template>
  <div class="f2bpm-page-layout">
    <div style="width: 100%; margin: 0;">
      <div class="wf-box">
        <div class="wf-box-in">
          <div class="wf-pop-in">
            <table>
              <tr>
                <td>
                  <div id="CirculatedActorListContainer" class="ActorListContainer" style="background-color: #fff; padding: 10px 2px 2px 5px; width: 670px; height: 300px; vertical-align: top; text-align: left; overflow-y: auto" v-html="circulatedActorHtml" />
                </td>
              </tr>
            </table>
          </div>
          <div v-show="isShowOpinion" id="AproOpinionDiv">
            <div class="wf-pop-tit" style="height: 35px;">
              <span>传阅意见：</span> 常用意见模板
              <el-select value="" size="mini" style="width: 450px;" filterable placeholder="请选择" @change="aproOpinionChange">
                <el-option v-for="item in aproOpinionData" :label="item.text" :value="item.value" />
              </el-select>
            </div>
            <div class="wf-pop-in p3">
              <el-input v-model="data.hidOpinion" type="textarea" :rows="3" placeholder="审核意见" />
            </div>
          </div>
          <div id="ActorSelectedDiv" style="display: none">
            <input id="hidSelectUsers" name="hidSelectUsers" actorselected="SelectUsers" type="hidden" value="">
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default { data() {
      return {
        // url参数
        appId: '',
        wiid: '',
        taskId: '',
        formAction: null,
        // ======数据============
        isShowOpinion: false,
        wfContext: {},
        circulatedActorHtml: '',
        data: {
          hidSelectUsers: '',
          hidOpinion: ''
        },

        aproOpinionData: [],
        sqlkeyArray: [{
          dataField: 'aproOpinionData',
          sqlkey: 'CB_ProcessOpinion_Select',
          flag: '1',
          parm: ''
        }
        ]
      }
    }, computed: {
      countGridHeight() {
        return $(document).height() - global_datagridHeightDiff
      },
       rotateIcon() {
        return this.isCollapsed ? 'fa fa-angle-double-right' : 'fa fa-angle-double-left'
      }
    },
    watch: {
      treeFilterText(val) {
        this.$refs.mytree.filter(val)
      }
    },
     created() {
      var that = this
      var taskId = Object.toQueryString('taskId') || ''
      var formAction = Object.toQueryString('formAction') || ''
      var parms = {}
      // 是否单选：true单选，false:多选
      var singleSelect = false
      // 参数说明{singleSelect:false,data[{},{}]}
      var resultGridData = []
      var parmsStr = Object.toQueryString('parms')
      var parms = {}
      if (parmsStr) {
        parmsStr = decodeURIComponent(parmsStr)
        parms = eval('(' + parmsStr + ')')
      }
      window.parms = parms

      that.taskId = taskId
      that.formAction = formAction
      const currUser = FUI.Sys.getAuthor()

      // 加载页面Model数据
      var jsonData = Object.toAjaxJson('/workflow/sendActor/', 'getCirculatedActorSelectData', { taskId: taskId })
      that.wfContext = jsonData.wfContext
      that.circulatedActorHtml = jsonData.circulatedActorHtml
      that.isShowOpinion = !that.wfContext.IsShowFormOpinion
      if (that.isShowOpinion) {
        that.sqlkeyArray[0].parm = 'opinionType:0,creatorId:' + currUser.userId
      }
      FUI.Form.initailSqlKeyComboBox(this)
    },
     mounted() {
      window.myvm = this
      loadPageExtends()
      selectedFirstNextActivity()
    },

    methods: {
      collapsedSider() {
        this.isCollapsed = !this.isCollapsed
      },
       aproOpinionChange(v) {
        this.data.hidOpinion = this.data.hidOpinion + v
      },
       selectorUserTextValue(inputKey, inputName, passParm, singleSelect, keyName, width, height) {
        var that = this
        WF.SelectorDialog.selectorUserTextValue(that, inputKey, inputName, passParm, singleSelect, keyName, width, height)
      },
       getResult() {
        var that = this
        var selectedUser = $('#hidSelectUsers').val()
        if (selectedUser == '') {
          FUI.layuiLayer.msg(null, '请选传阅人！')
          return false
        }
        that.data.hidSelectUsers = $('#hidSelectUsers').val()
        return that.data
      }
    }

  }

  window.getResult = function() {
    return myvm.getResult()
  }

  //* ****************业务方法*****************
  //* *选人方法**
  window.loadPageExtends = function() {
    // 选择部门下的所有人员与反选择
    $("#CirculatedActorListContainer input[levelcode='department']").each(function() {
      $(this).click(function() {
        var dpid = $(this).attr('orgid')
        var activityid = $(this).attr('activityid')
        checkedActivityDepartUsers(activityid, dpid, $(this).is(':checked'), 'Circulated')
        onSure('Circulated')
        setAcitivtyUserSelectCount(activityid, 'Circulated')
      })
    })
    $('.addRight3').click()
  }
</script>
<style lang="scss" scoped>
  @import "~@/resources/css/workflowform.css";

  </style>
