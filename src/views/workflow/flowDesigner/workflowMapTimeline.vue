<template>
  <div class="f2bpm-page-dialog-layout">
    <form id="form1">
      <div id="layoutDiv" style="width: 100%; overflow: hidden;">
        <div id="wftoolbar" style="padding: 3px; padding-left: 7px;height: 30px;margin-top: 5px;">

          <a style="margin-right: 2px;" title="打印时请在打印机设置勾打印“选背景和图片”" class="btn btn-default btn-sm" @click="workflowMap">
            <i class="fa fa-list" />{{$t('workflowform.processMap')}} 
          </a>
          <a style="margin-right: 2px;" title="打印时请在打印机设置勾打印“选背景和图片”" class="btn btn-default btn-sm" @click="printTable">
            <i class="fa fa-print" />{{$t('print')}} 
          </a>
          <a id="cancel" role="button" onclick="FUI.Window.closeEdit();" class="btn  btn-default btn-sm mr2">
            <i class="fa fa-times" />{{$t('close')}}  
          </a>
        </div>
        <div id="centerDiv" class="auto-window-height-select">
          <div class="block" style="margin-left: 50px;margin-top: 20px;">
            <el-timeline class="timeline">
              <el-timeline-item v-if="tablePage.total==0" type="warning" timestamp="暂无数据" placement="top" />
              <el-timeline-item v-for="r in rows" :type="r.taskState!=2?'warning':'success'" :timestamp="r.activityName" placement="top">
                <el-card>
                  <h4>{{ r.realName }} </h4>
                  <p class="pt10"><span v-html="r.userDpName" /> </p>
                  <p class="pt10">{{$t('approvalHistory.taskState')}}：<span v-html="r.taskStateStr" /> </p>
                  <p class="pt10">{{$t('approvalHistory.opinion')}}： <span v-html="r.opinion" /> </p>
                  <p class="pt10">{{$t('approvalHistory.createdTime')}}:{{ r.createdTime }}</p>
                     <span v-if="r.completedTime!=null"><p class="pt10">  {{$t('approvalHistory.completedTime')}}:{{ r.completedTime }} </p></span> 
                  <p class="pt10" />
                </el-card>
              </el-timeline-item>
            </el-timeline>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        language:"",
        loading: false,
        formAction: null,
        appId: '',
        wid: '',
        wiid: '',
        tablePage: {
          pageCount: 0,
          sort: 'createdTime asc,TaskSeq', // 排序字段
          order: 'asc', // 排序方向
          startIndex: 0,
          total: 0,
          currentPage: 1,
          pageSize: 65535
        },
        treeData: [],
        rows: []
      };
    },
    created: function () {
      var that = this;
      that.language = that.$store.state.app.language;
      window.myvm=that;
      var appId = Object.toQueryString('appId') || '';
      var wid = Object.toQueryString('wid') || '';
      var wiid = Object.toQueryString('wiid') || '';
      that.appId = appId;
      that.wid = wid;
      that.wiid = wiid;
      var parm = {};
      if (appId) {
        parm.appId = that.appId;
      }
      if (wiid) {
        parm.wiid = that.wiid;
      }
      if (wid) {
        parm.wid = that.wid;
      }
      parm.page = that.tablePage.currentPage;
      parm.rows = that.tablePage.pageSize;
      parm.sort = that.tablePage.sort;
      parm.order = that.tablePage.order;
      var res = Object.toAjaxJson(FUI.Handlers.WorkflowBusinessHandler, 'loadApprovalHistory', parm);
      if (res.success) {
        var rows = res.rows;
        $.each(rows, function (index, r) {
          r.opinion = that.opinionFormatter(r);
          r.taskStateStr = taskStateFormatter(r, true);
          console.info(r.taskStateStr);
        });
        that.rows = rows;
        that.tablePage.total = res.total;
        that.tablePage.pageCount = res.pageCount;
      } else {
        FUI.Window.showMsg(that, res.msg);
      }
    },
    methods: {
      closeEdit() {
        FUI.Window.closeEdit();
      },
      opinionFormatter(rec) {
        var value = rec.opinion||"";
        if (value == null) { value = ''; }
        var result = '';
        switch (rec.completedType) {
          case 'Invalid':
            result = '<em>【流程作废】</em>';
            break;
          case 'Activation':
            result = '<em>【流程重新激活】</em>';
            break;
          case 'Reject':
            result = '<em>【退回】</em>';
            break;
          case 'Referred':
            result = '<em>【转办】</em>';
            break;
          case 'TaskCommunication':
            result = '【沟通】';
            break;
        }

        if (rec.approAction) {
          result += '【' + rec.approAction + '】';
        }
        return result + value;
      },
      workflowMap() {
        var that = this;
        var url = __webpath + '/workflow/flowDesigner/workflowMap?appId=' + that.appId + '&wid=' + that.wid + '&wiid=' + that.wiid;
        // FUI.Window.open(url);
        window.location.href = url;
        //无#window.location.reload()
      },
      printTable() {
        $('#wftoolbar').hide();
        print();
        $('#wftoolbar').show();
      }
    }
  }
</script>
<style>

</style>