<template>
  <div class="f2bpm-page-layout">
    <div id="box" class="fence-box" style="width: 98%">
      <div style="padding-left: 3px; text-align: left;">
        <i class="fa fa-cube" aria-hidden="true" />处理分发任务：
      </div>
      <div class="fence-inner-line column-height" style="width: 99%; height: 390px;text-align: left">
        <div id="AproOpinionDiv">
          <div class="wf-pop-tit" style="height: 35px;">
            <h3>
              <i class="fa fa-commenting-o" />处理意见：
            </h3>
            <el-select value="" size="mini" style="width: 450px;" filterable placeholder="请选择意见模板" @change="aproOpinionChange">
              <el-option v-for="item in aproOpinionData" :label="item.text" :value="item.value" />
            </el-select>
          </div>
          <div class="wf-pop-in p3">
            <el-input v-model="data.opinion" type="textarea" :rows="6" placeholder="意见" />
            <br> <br>
            说明：确定提交完成此分发任务后，如果由此任务存在再次分发出去的未完成子任务<br>将会被强制更新级联完成。
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
        wiid: '',
        taskId: '',
        data: {
          opinion: ''
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
      var wiid = Object.toQueryString('wiid') || ''
      var parms = {}
      var parmsStr = Object.toQueryString('parms')
      var parms = {}
      if (parmsStr) {
        parmsStr = decodeURIComponent(parmsStr)
        parms = eval('(' + parmsStr + ')')
      }
      window.parms = parms

      that.taskId = taskId
      that.wiid = wiid
      const currUser = FUI.Sys.getAuthor()
      that.sqlkeyArray[0].parm = 'opinionType:0,creatorId:' + currUser.userId
      FUI.Form.initailSqlKeyComboBox(this)
    },
     mounted() {
      window.myvm = this
    },

    methods: {
      selectorUserTextValue(inputKey, inputName, passParm, singleSelect, keyName, width, height) {
        var that = this
        WF.SelectorDialog.selectorUserTextValue(that, inputKey, inputName, passParm, singleSelect, keyName, width, height)
      },
       aproOpinionChange(v) {
        this.data.opinion = this.data.opinion + v
      },
       getResult() {
        var that = this
        return that.data.opinion
      }
    }

  }

  window.getResult = function() {
    return myvm.getResult()
  }
</script>
<style lang="scss" scoped>
  @import "~@/resources/css/workflowform.css";

  </style>
