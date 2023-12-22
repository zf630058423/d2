<template>
  <div class="link-input">
     <el-input
      ref="input"
      v-on="$listeners"
      v-bind="$attrs"
      :value="value"
      onkeyup="this.value=this.value.replace(/[, ]/g,'')"
      >
    </el-input>
  </div>
</template>
<script>

/**
 * 文本框组件包含连接文字或数字
 * value： 默认值
 */
export default {
  name: 'textInput',
  props: {
    value: {
      type: [String, Number],
      default: ''
    },
  },
  data() { 
    return {
      
    }
  },
  //监听属性 类似于data概念
  // computed: { 
  //   inputListeners: function () { 
  //     let vm = this;
  //     // `Object.assign` 将所有的对象合并为一个新对象
  //     return Object.assign(
  //       { },
  //       // 我们从父级添加所有的监听器
  //       this.$listeners,
  //       // 然后我们添加自定义监听器，
  //       // 或覆写一些监听器的行为
  //       { 
  //         // 这里确保组件配合 `v-model` 的工作
  //         input: function (event) { 
  //           vm.$emit("input", vm.valieDataForInput(event));
  //         },
  //       }
  //     );
  //   },
  // },
  created() {
  },
  methods: {
    inputHandler(val) {
      let value = val ? val.replace(/[, ]/g, '') : '';
      this.$emit("input", value);
    }
  }
}
</script>
<style scoped lang="scss">
.text-input{
  position: relative;

  
}

</style>