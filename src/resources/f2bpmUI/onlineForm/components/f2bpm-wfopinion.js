import Vue from 'vue';
// 流程表单意见填写
var f2bpmWfopinion = Vue.component('f2bpm-wfopinion', {
  data: function () {
    return {
      isMustAddOpinion: false,
      isShowFormOpinion: true,
      value: '',
      aproOpinionData: [],
      sqlkeyArray: [{
        dataField: 'aproOpinionData',
        sqlkey: 'CB_ProcessOpinion_Select',
        flag: '1',
        parm: ''
      }
      ]
    };
  },
  watch: {
    value(val, oleVal) {
      var that = this;
      if (val != undefined) {
        this.$emit('updateworkflowformdata', 'hidOpinion', val);
      }
    }
  },
  created: function () {
    var that = this;
    that.value = that.fieldvalue;
    var formAction = WFContext.WorkflowformAction;
    if (WFContext.IsShowFormOpinion == false || formAction > 2) {
      that.isShowFormOpinion = false;
    } else {
      that.isMustAddOpinion = WFContext.IsMustAddOpinion;
      that.sqlkeyArray[0].parm = 'opinionType:0,creatorId:' + WFContext.CurrentUserId;
      FUI.Form.initailSqlKeyComboBox(that);
    }
  },
  methods: {
    aproOpinionChange(v) {
      var oleValue = this.value || '';
      this.value = oleValue + v;
    }
  },
  template: ' <div v-if="isShowFormOpinion" id="workflowFormAproOpinionDiv"   class="wf-box pb10" style="margin-top: 5px;">' +
    '                            <div  style="height: 40px;line-height: 40px">' +
    '<span class="sectionPrefixBlueBar"></span>' +
    '                                <span  class="fb ml15"><i v-if="isMustAddOpinion" class="red">*</i>审核意见：</span>' +
    '                                <el-select value="" size="mini" @change="aproOpinionChange" style="width: 450px;" filterable placeholder="请选择常用意见模板">' +
    '                                    <el-option' +
    '                                            v-for="item in aproOpinionData"' +
    '                                            :label="item.text"' +
    '                                            :value="item.value">' +
    '                                    </el-option>' +
    '                                </el-select>' +
    '                            </div>' +
    '                            <div class="wf-pop-in p3">' +
    '                                <el-input v-model="value"   maxlength="1000" show-word-limit  clearable  type="textarea" :rows="3" placeholder="请填写审核意见"/>' +
    '                            </div>' +
    ' </div>   '
});
