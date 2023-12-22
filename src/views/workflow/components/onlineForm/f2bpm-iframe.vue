<template>
  <div><span v-if="isDesign">iframe控件-当前为设计模式</span><iframe :src="src" :id="field.id" class="extend-iframe" :style="field.style" frameborder="0" :iframesrc="field.src" :iframeheight="field.height" scrolling="yes" width="100%" :height="field.height"></iframe></div>
</template>

<script>
  export default {
    name: "f2bpm-iframe",
    components: {},
    props: ['field', 'fieldvalue', 'rowindex', 'colindex'],
    data: function () {
      return {
        //携带表单字段参数
        formFieldParms: "",
        isDesign: false,
        src: '',
        isView: false,
        isShow: true,
        isReadOnly: false,
        clearable: true,
        inputCtrlOption: null,
        value: ''
      };
    },
    watch: {
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
      if (that.field.formFieldParms) {
        that.formFieldParms = that.field.formFieldParms;
      }
      that.isView = formAction > 2;
      if (that.isView) {
        that.isReadOnly = true;
      }
      that.value = that.fieldvalue;

      if (WFContext.isDesign == true) {
        that.isDesign = true;
      }
      if (WFContext.isDesign == true || that.isShow == false) {
        return false;
      }

    },
    mounted() {
      var that = this;
      if (WFContext.isDesign == true || that.isShow == false) {
        return false;
      }
      //url中有formFieldParms参数拼接到Url参数中
      //父级组件的Data
      var formFieldParmStr = "";
      if (that.formFieldParms) {
        var parentData = that.$parent.data;
        var formFieldArr = that.formFieldParms.split(",");
        $.each(formFieldArr, function (index, name) {
          if (parentData.hasOwnProperty(name)) {
            formFieldParmStr += name + "=" + parentData[name] + "&";
          }
        });
      }
      if (formFieldParmStr) {
        if (that.value.indexOf("?") > -1) {
          that.src = that.value + "&" + formFieldParmStr;
        } else {
          that.src = that.value + "?" + formFieldParmStr;
        }
      } else {
        that.src = that.value;
      }

      console.info(that.src);
    },
    methods: {
      initailFieldOption() {
        var that = this;
      }
    }
  }
</script>