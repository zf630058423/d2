<template>
  <div class="score">
    <div class="block">
      <el-rate v-model="value"></el-rate>
    </div>
    <!-- <div class="block">
      <span class="demonstration">产品质量</span>
      <el-rate v-model="value2"></el-rate>
    </div>
    <div class="block">
      <span class="demonstration">产品价格</span>
      <el-rate v-model="value3"></el-rate> -->
  </div>
  </div>
</template>

<script>
export default {
  name: "f2bpm-score",
  components: {},
  props: ['field', 'fieldvalue'],
  data: function () {
    return {
      language: "",
      isView: false,
      isShow: true,
      isReadOnly: false,
      value: null,
      value1: null,
      value2: null,
      value3: null,
      colors: ['#99A9BF', '#F7BA2A', '#FF9900']  // 等同于 { 2: '#99A9BF', 4: { value: '#F7BA2A', excluded: true }, 5: '#FF9900' }
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
    that.value = that.fieldvalue;
    that.isView = formAction > 2;
    if (that.isView) {
      that.isReadOnly = true;
    }
  },
  mounted() {
    var that = this;
    FUI.F2Grid.excuteFieldWritePowerByVueFormItem(that);
  },
  methods: {
  }
}
</script>
<style   scoped>
.score .block .el-rate {
  padding: 7px;
}
</style>
