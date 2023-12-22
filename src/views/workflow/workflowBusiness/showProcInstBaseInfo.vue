<template>
  <div class="f2bpm-page-dialog-layout">
    <el-form ref="formRef" size="small" class="f2bpm-editform" label-width="120px">
      <el-row>
        <el-col :span="12">
          <el-form-item :label="$t('workflowform.workflowTitle')">
            <span v-html="pageBaseInfo.workflowTitle"></span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('wfgrid.appName')">
            <span v-html="pageBaseInfo.appName"></span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item :label="$t('workflowform.importance')">
            <el-select v-model="pageBaseInfo.importance" :disabled="true" size="small" filterable placeholder="请选择">
              <el-option v-for="item in importanceData" :label="item.text" :value="item.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('workflowform.urgency')">
            <el-select v-model="pageBaseInfo.urgency" :disabled="true" size="small" filterable placeholder="请选择">
              <el-option v-for="item in urgencyData" :label="item.text" :value="item.value" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item :label="$t('workflowform.sheetId')">
            <span v-html="pageBaseInfo.sheetId"></span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('workflowform.currentActivityName')">
            <span v-html="language=='en-US'?pageBaseInfo.currentActivityAlias:pageBaseInfo.currentActivityName" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item :label="$t('workflowform.startor')">
            <span v-html="pageBaseInfo.creator" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('workflowform.workflowState')">
            <span v-html="langworkflowInstinceState(pageBaseInfo.workflowInstinceState)"></span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item :label="$t('workflowform.startTime')">
            <span v-html="pageBaseInfo.startTime" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('workflowform.finishedTime')">
            <span v-html="pageBaseInfo.finishedTime"></span>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>

  export default {
    data() {
      return {
        language: "",
        loading: false,
        appId: 1,
        wiid: "",
        taskId: "",
        formAction: null,
        isReadOnly: true,
        pageBaseInfo: {},
        importanceData: [],
        urgencyData: [],
        configTypeArray: [
          { dataField: 'importanceData', configType: '流程配置_重要级别', flag: '' },
          { dataField: 'urgencyData', configType: '流程配置_紧急程度', flag: '' }
        ],
        data: {

        }
      };
    },
    computed: {
      langworkflowInstinceState() {
        return function (status) {
          if(status==0){
            return "拟稿";
          }
          return window.getWorkflowStatus(status);
        };
      }
    },
    mounted() {
      var that = this;
      FUI.Form.initailConfigTypeComboBox(this);
      that.loadData();
    },
    created: function () {
      var that = this;
      that.language = that.$store.state.app.language;
      var formAction = Object.toQueryString('formAction') || 0;
      var wiid = Object.toQueryString('wiid');
      var taskId = Object.toQueryString('taskId');
      var appId = Object.toQueryString('appId');
      that.formAction = formAction;
      that.wiid = wiid;
      that.taskId = taskId;
      that.appId = appId;

    },
    methods: {
      closeEdit() {
        FUI.Window.closeEdit();
      },
      loadData() {
        var that = this;
        var res = Object.toAjaxJson('/workflow/workflowform/', 'getProcInstBaseInfo', { appId: that.appId, wiid: that.wiid, taskId: that.taskId, formAction: that.formAction });
        if (res.success) {
          that.pageBaseInfo = res.data;
        }
      }
    }
  }
</script>