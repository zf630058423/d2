<template>
  <div v-show="isShow" v-if="field.ctrType=='extend_label' || field.ctrType=='extend_custhtml'" :style="field.style" v-html="getContnet(field)" />
</template>

<script>
  export default {
    name: "f2bpm-label",
    components: {},
    props: ['field', 'fieldvalue', 'rowindex', 'colindex'],
    data: function () {
      return {
        language:"",
        isView: false,
        isShow: true,
        isReadOnly: false,
        value: ''
      };
    },
    watch: {
      value(val, oleV) {
        if (val != undefined && oleV != undefined && f2grid_global_mainVueLoadComplated) {
          this.$emit('updatevalue', this.field, val);
        }
      },
      fieldvalue: {
        handler(newV, oleV) {
          if (newV != undefined && oleV != undefined && f2grid_global_mainVueLoadComplated) {
            this.value = newV;
          }
        },
        immediate: false
      }
    },
    computed: {
      getContnet() {
        return function (field) {
          if(this.value){
            return value;
          }
          let enTitle = field.alias;
          if (enTitle == "" || enTitle == null) {
            enTitle = field.content;
          }
          let zhTitle = field.content;
          return this.language == 'en-US' ? enTitle : zhTitle;
        };
      }
    },
    created: function () {
      this.language = this.$store.state.app.language;
      this.value = this.fieldvalue;
      let formAction = WFContext.WorkflowformAction;
      this.isView = formAction > 2;
      if (this.isView) {
        this.isReadOnly = true;
      }
    },
    mounted() {
      FUI.F2Grid.excuteFieldWritePowerByVueFormItem(this);
    }
  }
</script>