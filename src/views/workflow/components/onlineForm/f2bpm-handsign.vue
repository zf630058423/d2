<template>
  <div :fieldrender="field.vModel">
    <div v-if="isShow&&value!=''">
      <img field="field.vModel" handsign-field="field.vModel" :src="imgSrcData" :width="width" />
      <div v-if="signTime!=''">签名时间：{{signTime}}</div>
    </div>
    <el-button :field="field.vModel" size="mini" v-if="!isReadOnly" type="warning" title="选择" @click="onlineForm_onHandsignDialogClick"><i class="icon icon-a-tianxiexiangqing"></i>手写签名</el-button>
  </div>
</template>

<script>
  export default {
    name: "f2bpm-handsign",
    components: {},
    props: ['field', 'fieldvalue', 'rowindex', 'colindex']
    , data: function () {
      return {
        signTime: "",
        isView: false,
        // 是否为只读
        isReadOnly: false,
        isShow: true,
        width: '',
        prefix: '',
        inputCtrlOption: null,
        imgSrcData: null,
        value: ''
      };
    },
    watch: {
      value(val, oleV) {
        var that = this;
        if (val != undefined && oleV != undefined && f2grid_global_mainVueLoadComplated) {
          this.$emit('updatevalue', that.field, val);
        }
      },
      fieldvalue: {
        handler(newV, oleV) {
          var that = this;
          if (newV != undefined && oleV != undefined && f2grid_global_mainVueLoadComplated) {
            that.value = newV;
          }
        },
        immediate: false
      }
    },
    created: function () {
      var that = this;
      that.value = that.fieldvalue;
      var formAction = WFContext.WorkflowformAction;
      that.isView = formAction > 2;
      if (that.isView) {
        that.isReadOnly = true;
      } else if (that.field._isReadOnly == true) {
        that.isReadOnly = true;
      }
      if (that.field.inputCtrlOption) {
        var json = typeof that.field.inputCtrlOption === 'object' ? that.field.inputCtrlOption : eval('(' + that.field.inputCtrlOption + ')');
        that.inputCtrlOption = json;
        that.prefix = that.inputCtrlOption.showPathPrefix;
      }
      var width = that.field.width || 250;
      if (width == 0) {
        width = 250;
      }
      that.width = width + 'px';
      if (that.value) {
        that.onlineForm_loadSign();
      }
    },
    mounted() {
      var that = this;
      //FUI.F2Grid.excuteFieldWritePowerByVueFormItem(that);
    },
    methods: {
      onlineForm_onHandsignDialogClick() {
        if (WFContext.isDesign == true) {
          return false;
        }
        if (WFContext.deviceType == 'mobile') {
          FUI.Window.showMsg('当前是手机端打开，请在PC端操作');
          return false;
        }
        var that = this;
        var isPass = true;
        var fieldDef = that.field;
        var funcName_before = fieldDef.vModel.replace(/\./g, '_') + "_before";
        if (Object.toIsExitsFunction(funcName_before)) {
          let parms = {};
          let isSubField = that.rowindex != undefined && that.rowindex != null;
          if (isSubField) {
            let row = that.$parent.data;
            parms.row = row;
            parms.rowIndex = that.rowindex;
            parms.colIndex = that.colindex;
          }
          isPass = window[funcName_before](that.value, fieldDef,parms);
        }
        if (isPass == false) {
          return false;
        }

        var optionJson = that.inputCtrlOption;
        var isreSign = 1;
        var signId = that.value || '';
        if (signId == '' || signId == undefined) {
          signId = "bpm_handsign_" + Object.toGuid();
          isreSign = 0;
        }
        // 打开二维码的对话框
        var wiid = WFContext.WorkflowInstanceId;
        var creatorId = WFContext.CurrentUserId;
        var url = __webpath + '/workflow/selector/handsignQRCodeDialog/?isreSign=' + isreSign + '&linkType=wiid&linkEntityId=' + wiid + '&creatorId=' + creatorId + '&signId=' + signId;
        var title = '扫一扫手写签名二维码';
        FUI.dialog(url, title, {}, 400, 450, function (signIdData, index, layer) {
          that.value = signIdData;
          that.onlineForm_loadSign();
          // 获取签名图片数据，显示表单签名图片
          layer.close(index);
          return false;
        }, false, null, { sure: { text: '确认签名' } });
      },
      onlineForm_loadSign() {
        var that = this;
        var signId = that.value;
        var data = Object.toAjaxJson('/workflow/public/', 'getHandSignData', {
          'signId': signId
        });
        if (data.success) {
          that.imgSrcData = data.data.imgData;
          that.signTime = data.data.createdTime;
          this.isShow = true;
        }
        if (that.imgSrcData != '') {
          that.isShow = true;
        } else {
          that.isShow = false;
        }
      }
    }
  }
</script>