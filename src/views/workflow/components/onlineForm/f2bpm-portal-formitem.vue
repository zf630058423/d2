<template>
  <div class="component-fieldbox" :style="field.width!=0?'width:'+field.width+'px':''" :fieldname="field.vModel" :fieldvalue="data[field.vModel]">
    <f2bpm-label v-if="field.ctrType=='extend_label'||field.ctrType=='extend_custhtml'" :field="field" :fieldvalue="data[field.vModel]" @updatevalue="updateFieldValue" />
    <f2bpm-button v-else-if="field.ctrType=='button'||field.ctrType=='extend_button'||field.ctrType=='extend_tabtoolbar'" :field="field" :fieldvalue="data[field.vModel]" @updatevalue="updateFieldValue" />
    <f2bpm-iframe v-else-if="field.ctrType=='extend_iframe'" :field="field" :fieldvalue="field.src" />
    <f2bpm-fence v-else-if="field.ctrType=='fence'" :field="field" :fieldvalue="field.vModel" />
  </div>
</template>

<script>
  import f2bpmButton from '@/views/workflow/components/onlineForm/f2bpm-button';
  import f2bpmIframe from '@/views/workflow/components/onlineForm/f2bpm-iframe';
  // 门户表单项组件
  import f2bpmLabel from '@/views/workflow/components/onlineForm/f2bpm-label'
  import f2bpmFence from '@/views/workflow/components/onlineForm/f2bpm-fence'
  export default {
    name: 'F2bpmPortalFormitem',
    components: {
      f2bpmLabel, f2bpmFence, f2bpmButton,f2bpmIframe
    },
    props: ['field', 'fieldvalue'],
    props: ['field', 'fieldvalue', 'parentdata'],
    data: function () {
      return {
        deviceType: '',
        subtableKey: 101,
        // 字段定义
        fieldList: [],
        data: {}
      }
    },
    watch: {
      parentdata: {
        handler(n, o) {
        },
        deep: true,
        immediate: true
      },
      field: {
        handler(newVal, oleVal) {
          var that = this
          if (newVal.ctrType == 'subtable') {
            var newKey = that.subtableKey + 1
            that.subtableKey = newKey
          }
        },
        deep: true,
        immediate: true
      }
    },
    mounted() {
      var that = this
    },
    created: function () {
      var that = this
    },
    methods: {
      renderComponent(keyName) {
        var that = this
        that.$emit('rendercomponent', keyName)
      },
      // field: 可以是字段名也可以是字段定义的对象
      updateFieldValue(field, newValue, vueDataName, subVueDataName) {

      }

    }
  }
</script>