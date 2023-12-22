<template>
  <div class="f2bpm-page-layout">
    <el-container>
      <el-aside ref="sideLeft" class="f2bpm-page-left" hide-trigger collapsible :width="isCollapsed?'20px':'200px'">
        <div class="f2bpm-panel-head">
          <div v-if="!isCollapsed" class="f2bpm-left-search-div pl10">
            高级设置
          </div>
          <div style=" float: right;line-height:35px;padding-right: 5px;">
            <i title="收起/展开" :class="rotateIcon" @click="collapsedSider" />
          </div>
        </div>
        <div v-if="!isCollapsed" class="auto-window-height-bigger" style="padding:0px !important;">
          <ul class="ul-nav">
            <li v-if="solutionMode.solutionType=='workflowForm'"><a href="javascript:void(0)" :class="type=='workflowApp'?'selected':''" @click="changeType('workflowApp')"><i class="fa fa-list" /> 流程应用</a></li>
          </ul>
        </div>
      </el-aside>
      <el-main class="f2bpm-page-right">
        <div>
          <iframe id="config_iframe" :src="src" width="100%" height="900" frameborder="0" />
        </div>

      </el-main>
    </el-container>
  </div>
</template>

<script>

  export default {
    data() {
      return {
        isCollapsed: false,
        type: 'workflowApp',
        solutionId: '',
        src: '',
        solutionMode: {
          solutionType:"",
          solutionTitle: '',
          categoryCode: null,
          isEnabled: true,
          refAppId: '',
          refFormDefId: '',
          refFormDefName: '',
          formKey: '',
          creatorRealName: '',
          creatorId: '',
          createdTime: '',
          tenantId: ''
        }
      }
    },
    computed: {
      countGridHeight() {
        return $(document).height() - global_datagridHeightDiff
      },
       rotateIcon() {
        return this.isCollapsed ? 'fa fa-angle-double-right' : 'fa fa-angle-double-left'
      },
      positionIcon() {
        return this.isCollapsed ? 'cursor:pointer; position: relative;left: -5px;' : 'cursor:pointer; position: relative;left: 100px;'
      }
    },
    mounted() {
      var that = this
      $('#config_iframe').attr('height', $(window).height())
      $(window).resize(function() {
        $('#config_iframe').attr('height', $(window).height())
      })
      that.changeType('workflowApp')
    },
     created: function() {
      var that = this
      var solutionId = Object.toQueryString('solutionId') || ''
      that.solutionId = solutionId
      var data = Object.toAjaxJson('/workflow/security/solution/', 'getModel', { keyId: that.solutionId, isdrill: true })
      that.solutionMode = data
      console.info(that.solutionMode)
    },
    methods: {
      closeEdit() {
        FUI.Window.closeEdit()
      },
       collapsedSider() {
        this.isCollapsed = !this.isCollapsed
      },
       changeType(type) {
        var that = this
        if (type == 'workflowApp' && that.solutionMode.refAppId) {
          that.type = type
          that.src = '/workflow/security/solution/processAppConfig?formAction=Edit&keyId=' + that.solutionMode.refAppId;
          $('#config_iframe').attr('src', that.src)
         /*  FUI.Window.open(that.src); */
         document.getElementById('config_iframe').contentWindow.location.reload(true)
        }
      }
    }
  }
</script>
