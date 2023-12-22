<template>
  <div class="f2bpm-page-layout">
    <div id="box" class="fence-box" style="width: 98%">
      <div style="padding-left: 3px; text-align: left;margin-bottom: 4px;">
        <i class="fa fa-cube" aria-hidden="true" />处理沟通任务：
      </div>
      <div class="fence-inner-line column-height" style="width: 99%; height: 390px;text-align: left">
        <div id="AproOpinionDiv">
          <div class="wf-pop-tit" style="height: 35px;">
            <h3>
              <i class="fa fa-commenting-o" />沟通回复意见：
            </h3>
            <el-select value="" size="mini" style="width: 450px;" filterable placeholder="请选择意见模板" @change="aproOpinionChange">
              <el-option v-for="item in aproOpinionData" :label="item.text" :value="item.value" />
            </el-select>
          </div>
          <div class="wf-pop-in p3">
            <br>
            <el-input v-model="data.opinion" type="textarea" :rows="3" placeholder="沟通回复意见" />
            <br> <br>
            <i class="fa fa-user" /> 下一步继续传递沟通用户：
            <el-input v-model="data.actorInputParamDes" style="width: 55%" readonly="readonly" placeholder="选择下一步继续传递沟通用户" size="mini" />
            <a id="selectUsers" href="javascript:void(0)" title="选择用户" @click="selectorUserTextValue('actorJson','actorInputParamDes',null,true,'userId');"> <i class="fa fa-search" />选择用户</a> <a id="clearEmpty2" class="red" href="javascript:void(0)" onclick="onClearEmpty('ActorInputParam')"><i class="fa fa-trash" />清空</a> <br><span style="line-height:20px"> 说明：如果需要继续传递给下一个人进行沟通，请选择“下一步继续传递沟通用户”。 <br> 如果不需要继续向其它人进行沟通，则不需要选择“下一步继续传递沟通用户”。</span>
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
          actorInputParamDes: '',
          actorJson: '',
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
        return that.data
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
