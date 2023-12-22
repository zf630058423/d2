<template>
  <div :fieldtext="qrCodeUrl" :name="field.vModel">
    <img v-if="isDesign==false" :src="qrCodeImgData" :width="qrcodeData.width">
    <span v-else class="font12">{{qrcodeData.qrtype=='qrcode'?'二维码':'条码'}}设计状态</span>
  </div>
</template>

<script>
  export default {
    name: "f2bpm-qrcode",
    components: {},
    props: ['field', 'fieldvalue', 'rowindex', 'colindex'],
    //rowindex:子表时才有值行索引，colindex子表时才有值列索引
    data: function () {
      return {
        qrCodeImgData: '',
        qrcodeData: {
          //qrcode,barcode
          qrtype: "qrcode",
          linktype: "wfsheet",
          linkUrl: '',
          width: 150,
        },
        //是否为设计状态
        isDesign: false,
        isView: false,
        isShow: true,
        isReadOnly: false,
        clearable: true,
        inputCtrlOption: null,
        qrCodeUrl: '',
        wiid: "",
        myid: "",
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
      var formAction = WFContext.WorkflowformAction;
      that.isView = formAction > 2;
      if (that.isView) {
        that.isReadOnly = true;
      } else if (that.field._isReadOnly == true) {
        that.isReadOnly = true;
      }
      that.value = that.fieldvalue || "";
      if (that.field.inputCtrlOption) {
        var json = typeof that.field.inputCtrlOption === 'object' ? that.field.inputCtrlOption : eval('(' + that.field.inputCtrlOption + ')');
        that.inputCtrlOption = json;
        var optionJson = that.inputCtrlOption;
        that.qrcodeData.qrtype = optionJson.qrtype;
        that.qrcodeData.linktype = optionJson.linktype;
        that.qrcodeData.linkUrl = optionJson.linkUrl;
      }
      that.qrcodeData.width = that.field.width || 150;
      // that.initailFieldOption();
    }
    , mounted() {
      var that = this;
      if (WFContext.isDesign == true || that.isShow == false) {
        that.isDesign = true;
        return false;
      }
      if (that.qrcodeData.linktype == 'wfsheet' && WFContext.WorkflowInstanceId) {
        that.wiid = WFContext.WorkflowInstanceId;
        //流程表单
        that.qrCodeUrl = __webpath + '/workflow/workflowform/index/?formAction=3&wiid=' + that.wiid;
      } else if (that.qrcodeData.linktype == 'noWorkflowform' && WFContext.myid) {
        that.myid = WFContext.myid;
        //普通表单
        that.qrCodeUrl = __webpath + '/workflow/noWorkflowform/index/?formAction=3&myid=' + that.myid;
      } else if (that.qrcodeData.linktype == 'outside' || that.qrcodeData.linktype == 'inside') {
        that.myid = WFContext.myid || "";
        //外部链接或内部链接
        that.qrCodeUrl = that.qrcodeData.linkUrl;
      } else if (that.qrcodeData.linktype == 'string') {
        that.myid = WFContext.myid || "";
        //字符串内容,翻译表单内容
        var content = that.qrcodeData.linkUrl + that.value;
        if (content.indexOf('[') > -1 && content.indexOf(']') > -1) {
          //提取表单中的占位符变量
          var resultArr = that.getExpressionFieldList(content);
          if (resultArr && resultArr.length > 0) {
            $.each(resultArr, function (index, name) {
              var value = "";
              let arr = name.split('.');
              let isSubTable = arr.length >= 3;
              if (isSubTable) {
                let subTableName = arr[1];
                let row = window.myvm.data['subtable.' + subTableName][that.rowindex];
                value = row[name];
              }
              else {
                value = window.myvm.data[name];
              }
              if (value != undefined) {
                content = content.replace("[" + name + "]", value);
              }
            });
          }
        }
        that.qrCodeUrl = content;
      }
      that.getQrCodeImg();
    },
    methods: {
      getQrCodeImg() {
        let that = this;
        Object.toAjaxJson('/workflow/selector/', 'getQRCodeData',
          {
            linkType: that.qrcodeData.linktype,
            qrtype: that.qrcodeData.qrtype,
            qrCodeUrl: that.qrCodeUrl
          }, true, null,
          function (res) {
            if (res.success) {
              that.qrCodeImgData = res.data;
            } else {
              console.info(res.msg);
            }
          }
        );
      }
      //获取内容中的占位符合
      , getExpressionFieldList(formulaExpression) {
        var fieldExpress = /\[{1}[a-zA-Z0-9_.]{3,}\]{1}/g;
        if (!formulaExpression) return "";
        var arr = formulaExpression.match(fieldExpress);
        var result = [];
        arr = arr || [];
        $.each(arr, function (index, item) {
          var name = item.replace("[", "").replace("]", "");
          result.push(name);
        });
        return result;
      }
      , initailFieldOption() {
        var that = this;
        if (that.field.fieldOptions) {
          var fieldOptions = typeof that.field.fieldOptions === 'string' ? eval('(' + that.field.fieldOptions + ')') : that.field.fieldOptions;
          var general = fieldOptions.find(a => a.opttype == 'general');
          if (general) {
            var kvData = general.params.kvData;
          }
        }
      }
    }
  }
</script>