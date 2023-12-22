<template>
  <div>
    <span v-if="isDesign" v-html="field.label" />
    <div :style="'height:'+fenceHeight+'px;'">
      <f2bpm-report v-if="field.fenceType=='report'" :code="report.reportCode" />
    </div>
  </div>

</template>

<script>
  // 栏目组件
  import f2bpmReport from '@/views/workflow/components/onlineForm/f2bpm-report'
  export default {
    name: 'f2bpm-fence',
    components: {
      f2bpmReport
    },
    props: ['field', 'fieldvalue', 'rowindex', 'colindex'],
    data: function() {
      return {
        // 当前是为设计模式
        isDesign: false,
        fenceHeight: 130,
        // 栏目类型参数
        fenceTypeParms: '',
        report: { reportCode: '' },
        isView: false,
        isShow: true,
        isReadOnly: false,
        value: ''
      }
    },
    watch: {
      value(val, oleV) {
        var that = this
        if (val != undefined && oleV != undefined && f2grid_global_mainVueLoadComplated) {
          this.$emit('updatevalue', that.field, val)
        }
      },
      fieldvalue: {
        handler(newV, oleV) {
          var that = this
          if (newV != undefined && oleV != undefined && f2grid_global_mainVueLoadComplated) {
            that.value = newV
          }
        },
        immediate: false
      }
    },
    mounted() {

    },
    created: function() {
      var that = this
      that.value = that.fieldvalue
      that.isDesign = WFContext.isDesign
      if (!that.isDesign) {
        that.fenceTypeParms = that.field.fenceTypeParms
        that.fenceHeight = that.field.fenceHeight
        if (that.field.fenceType == 'report' && that.fenceTypeParms) {
          // 图表
          that.report = eval('(' + that.fenceTypeParms + ')')
        }
      }
    },
    methods: {
    }
  }
</script>
