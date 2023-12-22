<template>
  <div class="amount-interval">
    <el-input
      class="amount-interval_input"
      v-model="amountStart"
      :placeholder="placeholder"
      size="small"
      :disabled="disabled"
      @focus="focusHandler($event,'start')"
      @blur="blurHandler($event,'start')"
    >
    </el-input>
   <span class="amount-interval_line">—</span>
   <el-input
      class="amount-interval_input"
      v-model="amountEnd"
      :placeholder="placeholder"
      size="small"
      :disabled="disabled"
      @focus="focusHandler($event,'end')"
      @blur="blurHandler($event,'end')"
    >
    </el-input>
  </div>
  
</template>
<script>
import inputFun from '@/utils/fun.js'
export default {
  name: 'AmountInterval',
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
      type: [String, Number],
      default: ''
    },
    inputStart: {
      type: [String, Number],
      default:''
    },
    inputEnd: {
      type: [String, Number],
      default:''
    }
  },
  data() {
    return {
      // currentValue: '',
      amountStart: '',
      amountEnd:''
    }
  },

  watch: {
    inputStart: {
      handler(value) {
        if (!value) { 
          this.amountStart = '';
          return
        }
        let val = value;
        if (val && typeof val === 'number') { 
          val = (val).toString();
        }
        const newNal = val == 0 ? '0' : inputFun.getFixed(val, this.decimalNum);
        this.amountStart = newNal.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
       }
    },
    inputEnd: {
      handler(value) {
        if (!value) { 
          this.amountEnd = '';
          return
        }
        let val = value;
        if (val && typeof val === 'number') { 
          val = (val).toString();
        }
        const newNal = val == 0 ? '0' : inputFun.getFixed(val, this.decimalNum);
        this.amountEnd = newNal.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
       }
    }
    // value: {
    //   handler(value) {
    //     if(!value) {
    //       this.currentValue = '';
    //       return
    //     }
    //     let val = value;
    //     if (val && typeof val === 'number') {
    //       val = (val).toString();
    //     }
    //     const newNal = val == 0?'0':inputFun.getFixed(val, this.decimalNum);
    //     this.currentValue = newNal.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    //   },
    //   immediate: true
    // }
  },
  created() {
  },
  methods: {
    focusHandler(e, type) {
      const val = e.target.value
      if (type === 'start') {
        this.amountStart = val.replaceAll(',', '');
      } else if (type === 'end') { 
        this.amountEnd = val.replaceAll(',', '')
      }
    },
    blurHandler(e, type) {
      const val = e.target.value.replaceAll(',', '')
      if (isNaN(val) || !val) {
        this.$emit('change', '','')
        if (type === 'start') {
          this.amountStart = '';
        } else if (type === 'end') {
          this.amountEnd = '';
        }
      } else {
        if (type === 'start') {
          this.amountStart = inputFun.getFixed(val, this.decimalNum);
        } else if (type === 'end') { 
          this.amountEnd = inputFun.getFixed(val, this.decimalNum);
        }
        this.$emit('change', this.amountStart, this.amountEnd)
        this.amountStart = this.amountStart.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
        this.amountEnd = this.amountEnd.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.amount-interval{
  display: flex;
  
  &_line{
    margin: 0 4px;
    color: #DCDFE6;
  }
}
</style>