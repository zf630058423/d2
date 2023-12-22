<template>
    <el-divider  :direction="field.direction" :content-position="field.contentPosition"><span :style="field.style">
      <i :class="getIcon(field)"></i> <span  v-html="getContnet(field)"></span> </span> </el-divider>
</template>

<script>
  export default {
    name: "f2bpm-divider",
    components: {},
    props: ['field', 'fieldvalue', 'rowindex', 'colindex'],
    data: function () {
      return {
        language: "",
        icon: "",
        content: "",
        isView: false,
        isShow: true,
        isReadOnly: false,
        value: ''
      };
    },
    watch: {
    }
    , computed: {
      getContnet() {
        return function (field) {
          var enTitle = field.alias;
          if (enTitle == "" || enTitle == null) {
            enTitle = field.content;
          }
          var zhTitle = field.content;
          return this.language == 'en-US' ? enTitle : zhTitle;
        };
      }
      , getIcon() {
        return function (field) {
          var icon = field.icon;
          if (icon && icon.indexOf("fa") > -1) {
            return "fa " + icon;
          }
          if (icon && icon.indexOf("icon") > -1) {
            return "icon " + icon;
          }
          return "";
        };
      }
    },
    created: function () {
      var that = this;
      that.language = that.$store.state.app.language;
    },
    mounted() {
      var that = this;
      FUI.F2Grid.excuteFieldWritePowerByVueFormItem(that);
    },
    methods: {

    }
  }
</script>