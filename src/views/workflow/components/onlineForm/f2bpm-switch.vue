<template>
  <div>
    <el-checkbox v-if="isCheckBoxMode" @change="checkboxChange" :checked="value==activeValue" :true-label="activeValue" :false-label="inActiveValue" :disabled="isReadOnly">{{checkBoxModeTitle}}</el-checkbox>
    <el-switch v-else v-show="isShow" :disabled="isReadOnly" size="mini" v-model="value" active-color="#13ce66" inactive-color="#C0C4CC" :active-text="activeTitle" :inactive-text="inActiveTitle" :active-value="activeValue" :inactive-value="inActiveValue" @change="switchchange">
    </el-switch>

  </div>

</template>

<script>

  export default {
    name: "f2bpm-switch",
    components: {},
    props: ['field', 'fieldvalue', 'rowindex', 'colindex'],
    data: function () {
      return {
        //是否为复选框模式
        isCheckBoxMode: false,
        checkBoxModeTitle: '',
        //激活的文本标题
        activeTitle: "",
        //非激活的文本标题
        inActiveTitle: "",
        //激活值
        activeValue: "1",
        //非激活值
        inActiveValue: "0",
        activeTitle: "",
        inActiveTitle: "",

        language: "",
        isView: false,
        isShow: true,
        isReadOnly: false,
        value: 0
      };
    }, watch: {
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
    computed: {
      getContnet() {
        return function (field) {
          if (this.value) {
            return value;
          }
          var enTitle = field.alias;
          if (enTitle == "" || enTitle == null) {
            enTitle = field.content;
          }
          var zhTitle = field.content;
          return this.language == 'en-US' ? enTitle : zhTitle;
        };
      }
    },
    created: function () {
      var that = this;
      that.language = that.$store.state.app.language;
      var formAction = WFContext.WorkflowformAction;
      that.formAction = formAction;
      that.isView = that.formAction > 2;
      if (that.isView) {
        that.isReadOnly = true;
      }
      else if (that.field._isReadOnly == true) {
        that.isReadOnly = true;
      }
      //获取控件其它属性
      if (that.field.fieldOptions) {
        var fieldOptions = eval("(" + that.field.fieldOptions + ")");
        var general = fieldOptions.find(a => a.opttype == 'general');
        var generalobj = {};
        if (general) {
          var kvData = general.params.kvData;
          $.each(kvData, function (index, item) {
            generalobj[item.key] = item.value;
          });
        }
        that.isCheckBoxMode = generalobj.isCheckBoxMode;
        that.checkBoxModeTitle = generalobj.checkBoxModeTitle;

        var isCustomActiveValue = generalobj.isCustomActiveValue;
        if (isCustomActiveValue) {
          var activeValue = generalobj.activeValue;
          if (activeValue != undefined) {
            that.activeValue = activeValue + "";
          }
          var inActiveValue = generalobj.inActiveValue;
          if (inActiveValue != undefined) {
            that.inActiveValue = inActiveValue + "";
          }
        }
        var isCustomActiveTitle = generalobj.isCustomActiveTitle;
        if (isCustomActiveTitle) {
          var activeTitle = generalobj.activeTitle;
          if (activeTitle != undefined) {
            that.activeTitle = activeTitle;
          }
          var inActiveTitle = generalobj.inActiveTitle;
          if (inActiveTitle != undefined) {
            that.inActiveTitle = inActiveTitle;
          }
        }
      }

      if (that.fieldvalue == undefined || that.fieldvalue == "") {
        that.value = that.inActiveValue;
      } else {
        that.value = that.fieldvalue + "";
      }
    },
    mounted() {
      var that = this;
      FUI.F2Grid.excuteFieldWritePowerByVueFormItem(that);
    },
    methods: {
      checkboxChange(v) {
        var that = this;
        that.value = v;
        that.switchchange(v);
      }
      , switchchange(value) {
        var that = this;
        this.$emit('updatevalue', that.field, value);
        that.triggerFieldLinkages(that.field, value);
        //=================字段事件=========================
        let isSubField = that.rowindex != undefined && that.rowindex != null;
        var funcName = that.field.vModel.replace(/\./g, '_');
        if (Object.toIsExitsFunction(funcName)) {
          let parms = {};
          if (isSubField) {
            let row = that.$parent.data;
            parms.row = row;
            parms.rowIndex = that.rowindex;
            parms.colIndex = that.colindex;
          }
          window[funcName](value, that.field, parms);
        }
        //================================================
      }
      //触发控件联动
      , triggerFieldLinkages(field, value) {
        var that = this;
        if (WFContext.isDesign == true || that.isShow == false) {
          return false;
        }
        FUI.F2Grid.excuteTriggerFieldLinkages(field, value, that.isView);
      }
    }
  }
</script>