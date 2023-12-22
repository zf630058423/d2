<template>
  <div class="f2bpm-page-dialog-layout">
    <div style="overflow: auto; width: 845px;height: 360px;">
      <el-form v-if="resultMsg==''" ref="formRef" :rules="formRules" size="small" :model="data" class="f2bpm-editform" label-width="120px">
        <el-form-item label="常用意见">
          <el-select value="" size="mini" style="width: 450px;" filterable @change="aproOpinionChange">
            <el-option v-for="item in aproOpinionData" :label="item.text" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="审核意见" prop="hidOpinion">
          <el-input v-model="data.hidOpinion" maxlength="1000" show-word-limit type="textarea" :rows="3" :placeholder="$t('actorSelect.fillTheOpinion')" />
        </el-form-item>
      </el-form>
      <div v-if="resultMsg!=''" style="line-height: 25px;margin: 10px;">
        <table class="common-grid" style="width: 100%;">
          <tr>
            <th style="width:40px;">序号</th>
            <th style="width: 180px;">流程单号</th>
            <th style="width: 250px;">标题</th>
            <th style="width:40px;">是否成功</th>
            <th style="max-width: 300px;">信息</th>
          </tr>
          <tr v-for="(item,index) in resultList">
            <td class="first">{{index+1}}</td>
            <td>{{item.sheetId}}</td>
            <td>{{item.title}}</td>
            <td>
              <span v-if="item.isSuccess" class="cube bg-blue">成功</span>
              <span v-else class="cube bg-danger">失败</span>
            </td>
            <td style="text-align: left;">{{item.msg}} </td>
          </tr>
        </table>
        <span v-html="resultMsg"></span>
      </div>
      <div style="font-size: 12px;padding-left: 60px;"><span class="red bolder font14">注意：</span>批量审批是按流程图执行尝试审批，或因数据没填写、或因运行审批条件不满足等因原会导致审批失败。</div>
    </div>
    <div class="dialogfooter">
      <el-button :loading="loading" v-if="resultMsg==''"  size="small" type="primary" @click="submitForm()"><i class="fa fa-save" />提交
      </el-button>
      <el-button id="btn_cancel" size="small" @click="closeEdit"><i class="fa fa-minus-circle" />关闭
      </el-button>
    </div>
  </div>
</template>

<script>

  export default {
    data() {
      return {
        loading: false,
        formAction: null,
        taskIds: "",
        resultMsg: "",
        resultList: [],
        aproOpinionData: [],
        sqlkeyArray: [{
          dataField: 'aproOpinionData',
          sqlkey: 'CB_ProcessOpinion_Select',
          flag: '1',
          parm: ''
        }
        ],
        data: {
          hidOpinion: "",
        },
        formRules: {
          hidOpinion: [
            { required: true, message: '必填项不能为空' }
          ]
        }
      };
    },
    mounted() {
    },
    created: function () {
      var that = this;
      that.taskIds = Object.toQueryString('taskIds');
      that.formAction = formAction;
      const currUser = FUI.Sys.getAuthor();
      that.sqlkeyArray[0].parm = 'opinionType:0,creatorId:' + currUser.userId;
      FUI.Form.initailSqlKeyComboBox(that);
    },
    methods: {
      closeEdit() {
        //关闭并刷新待办列表
        FUI.Window.closeEdit(true);
      },
      submitForm() {
        var that = this;
        var success = that.validateForm('formRef');
        if (!success) return;
        that.loading = true;
        var res = Object.toAjaxJson(FUI.Handlers.WorkflowBusinessHandler, "bathSendTask", {
          taskIds: that.taskIds,
          opinion: that.data.hidOpinion
        }, true, null, function (res) {
          that.resultMsg = res.msg;
          that.resultList = res.data;
          FUI.Window.refreshParentGrid();
        });

      },
      validateForm(refFormName) {
        var success = false;
        this.$refs[refFormName].validate(valid => {
          success = valid;
        });
        return success;
      },
      aproOpinionChange(v) {
        this.data.hidOpinion = this.data.hidOpinion + v;
      }
    }
  }
</script>