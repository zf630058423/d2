<template>
  <el-date-picker class="textBoxShort" @change="dateChange" size="small" v-model="value" :disabled="isReadOnly" :value-format="dateformat" :format="dateformat" :type="field.itemRender.props.type" clearable></el-date-picker>
</template>

<script>
  export default {
    name: 'f2bpmuiDatetime',
    components: {},
    props: ['field', 'fieldvalue', 'readOnly'],
    data: function () {
      return {
        dateformat: 'yyyy-MM-dd HH:mm:ss',
        isReadOnly: false,
        value: '',
        counterCode: ''
      };
    },
    watch: {
      fieldvalue: {
        handler(newVal, oldVal) {
          if (newVal != this.value && newVal != oldVal) {
            this.value = newVal;
          }
        },
        deep: true,
        immediate: false
      },
      value(val, oldVal) {
        var that = this;
        this.$emit('updatevalue', that.field.fieldName, val);
      }
    },
    created: function () {
      var that = this;
      that.value = that.fieldvalue;
      if (that.readOnly != undefined && that.readOnly != null) {
        that.isReadOnly = that.readOnly;
      }
      if (!that.field.itemRender.props.dateformat) {
        if (that.field.itemRender.props.type == 'datetime') {
          that.dateformat = 'yyyy-MM-dd HH:mm:ss';
        }else if (that.field.itemRender.props.type === 'date') {
          that.dateformat = 'yyyy-MM-dd';
        }else if (that.field.itemRender.props.type === "datetimerange") {
          that.dateformat = 'yyyy-MM-dd HH:mm:ss';
        }else if (that.field.itemRender.props.type === 'daterange') {
          that.dateformat = 'yyyy-MM-dd';
        }
      } else if (that.field.itemRender.props.dateformat) {
        that.dateformat = that.field.itemRender.props.dateformat;
      }
    },
    methods: {
      dateChange(value) {
        var that = this;
        if (value == null) {
          that.value = "";
          value = "";
        }
      }
    }
  }
</script>
