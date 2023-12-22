<template>
  <el-input class="textBoxShort" size="small" v-model="value" :disabled="isReadOnly" clearable placeholder=""></el-input>
</template>

<script>
  export default {
    name: 'f2bpmuiTextbox',
    components: {},
    props: ['field', 'fieldvalue','readOnly'],
    data: function () {
      return {
        isReadOnly: false,
        value: ''
      }
    },
    watch: {
      fieldvalue: {
        handler(newVal, oldVal) {
          if (newVal != this.value && newVal != oldVal && oldVal != undefined) {
            this.value = newVal
          }
        },
        deep: true,
        immediate: false
      },
      value(val, oldVal) {
        var that = this
        if (val != undefined) {
          this.$emit('updatevalue', that.field.fieldName, val)
        }
      }
    },
    created: function () {
      var that = this
      that.value = that.fieldvalue;
      if (that.readOnly != undefined&&that.readOnly!=null) {
        that.isReadOnly = that.readOnly;
      }
    },
    methods: {
    }
  }
</script>