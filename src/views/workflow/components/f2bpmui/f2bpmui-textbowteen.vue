<template>
  <div style="display: flex;justify-content: space-between;width: 260px;">
    <el-input v-model="startValue" class="textBowteen" size="small" clearable @blur="inputBlur"></el-input>
    <span style="flex:1">-</span>
    <el-input v-model="endValue" class="textBowteen" size="small" clearable @blur="inputBlur"></el-input>
  </div>
</template>

<script>
export default {
  name: 'F2bpmuiTextbowteen',
  components: {},
  props: ['field', 'fieldvalue'],
  data: function() {
    return {
      startValue: '',
      endValue: ''
    };
  },
  watch: {
    fieldvalue: {
      handler(newVal, oldVal) {
        if (newVal) {
          if (newVal.split('~').length > 0) this.startValue = newVal.split('~')[0];
          if (newVal.split('~').length > 1) this.endValueL = newVal.split('~')[1];
        }
      },
      deep: true,
      immediate: false
    },
    startValue(val, oldVal) {
      this.updatevalue()
    },
    endValue(val, oldVal) {
      this.updatevalue()
    }
  },
  methods: {
    updatevalue() {
      var that = this;
      var val = that.startValue + '~' + that.endValue
      if (!that.startValue && !that.endValue) val = ''
      that.$emit('updatevalue', that.field.fieldName, val);
    },
    inputBlur() {
      if (parseFloat(this.startValue) > parseFloat(this.endValue)) {
        FUI.Window.showMsg('区间搜索左边输入的值要≤右边输入框的值')
      }
    }
  }
}
</script>
