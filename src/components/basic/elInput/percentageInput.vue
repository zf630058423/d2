<template>
  <div>
    <el-input
      v-model="currentValue"
      :placeholder="placeholder"
      size="small"
      :disabled="disabled"
      @focus="focusHandler"
      @blur="blurHandler"
    >
    </el-input>
  </div>
</template>
<script>
import inputFun from '@/utils/fun.js'
export default {
  name: 'AmountInput',
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    decimalNum: {
      type: Number,
      default: 2
    },
    placeholder: {
      type: String,
      default: '请输入'
    },
    disabled: {
      type: Boolean,
      default: false
    },
    value: {
      type: String | Number,
      default: ''
    },
    // 最小值设置 -1无限小
    minValue: {
      type: Number,
      default: -1
    }
  },
  data() {
    return {
      currentValue: ''
    }
  },
  watch: {
    value: {
      handler(value) {
        if(!value) {
          this.currentValue = '';
          return
        }
        let val = value;
        if (val && typeof val === 'number') {
          val = (val).toString();
        }
        const newNal = inputFun.getFixed(val, this.decimalNum + 2);
        this.currentValue = inputFun.getFixed(newNal * 100, this.decimalNum) + '%'
      },
      immediate: true
    }
  },
  created() {
  },
  methods: {
    focusHandler(e) {
      const val = e.target.value
      const value = val.replaceAll('%', '')
      if (value) this.currentValue = inputFun.getFixed(value, this.decimalNum)
    },
    blurHandler(e) {
      const val = e.target.value
      if (isNaN(val) || !val) {
        this.$emit('change', '')
        this.currentValue = ''
      } else {
        let newNal = inputFun.getFixed(val / 100, this.decimalNum + 2);
        console.log('xxx',newNal,this.minValue != -1 && newNal < 0)
        if(this.minValue != -1 && newNal < 0) newNal = '0';
        this.$emit('change', newNal)
        this.currentValue = inputFun.getFixed(newNal * 100, this.decimalNum) + '%'
      }
    }
  }
}
</script>
