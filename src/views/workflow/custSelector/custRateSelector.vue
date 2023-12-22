<template>
  <div class="f2bpm-page-layout">
    <div style="font-size: 20px;margin: 20px;">
      内容由开发者自己决定，具体更丰富的救命可参考 selectOnlyUsers.vue
      <el-rate v-model="value1"></el-rate>
    </div>

  </div>
</template>

<script>
  export default {
    data() {
      return {
        a: '',
        dg: {},
        value1: null
      };
    },
    computed: {
    },
    created() {
      var that = this;
      var a = Object.toQueryString("value1");
      that.value1 = a;
    },
    mounted() {
      window.myvm = this;
    },
    methods: {
      getResult() {
        console.log(this.value1);
        return this.value1;
      }
    }

  };
  window.getResult = function () {
    //不想返回时，可直接 返回return false, 则窗口不会关闭
    return myvm.getResult();
  }
</script>
