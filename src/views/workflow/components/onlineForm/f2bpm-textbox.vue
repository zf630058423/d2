<template>
  <div v-show="isShow">
    <el-tooltip
      placement="bottom"
      :disabled="isShowTip"
      popper-class="atooltip"
      effect="light"
    >
      <template>
        <div slot="content" :style="{ 'max-width': `${inputMaxWidth}px` }" v-html="value"></div>
        <el-input
          :key="componentKey"
          v-model="getValue"
          show-word-limit
          size="small"
          :name="field.vModel"
          :disabled="isReadOnly"
          :show-password="getShowPassWord"
          :clearable="getClearable"
          :maxlength="getMaxLength"
          :rows="getRows"
          :type="getType"
          :placeholder="field.fieldRemark"
          @input="handleChanges"
          @blur.native.capture="validate()"
          @focus.native.capture="changeToNormalInput"
          @mouseover.native="inputOnMouseOver($event)"
        >
        </el-input>
      </template>
    </el-tooltip>
  </div>
</template>

<script>
/**
 * 文本框组件
 * field: 当前控件本身，包括类型、宽高、id、vModel(控件自动名称)、label(标题)等
 * fieldvalue： 回显的值
 * rowIndex: 子表行的索引
 * colIndex: 子表列的索引
 */
import fun from '@/utils/fun'; // 添加防抖事件，解决输入框输完后自动触发事件
const CTRTYPEARRAY = ['text', 'extend_textbox']; // 文本框

export default {
  name: 'F2bpmTextbox',
  props: ['field', 'fieldvalue', 'rowindex', 'colindex'],
  data: function() {
    return {
      fieldName: '',
      componentKey: '502',
      showFormat: '', // 显示格式:千分位qianfenwei,大写金额daxiejine,百分比percent
      isShowFormatterValue: false, // 当前是否为格式化显示
      fieldDecimalLen: -1, // 小数位
      fieldDataType: '', // 校验的输入类型
      isView: false,
      isShow: true,
      isReadOnly: false,
      isSubTable: false,
      value: '',
      isShowTip: true,
      inputMaxWidth: 371,
      password: 'password'
    };
  },
  computed: {
    getValue: {
      get() {
        const { ctrType } = this.field;
        if (this.isShowFormatterValue && this.showFormat !== '' && CTRTYPEARRAY.includes(ctrType)) {
          return this.getFormatterValue;
        } else {
          // 如果是千分符
          if (this.value && typeof (this.value) === 'string' && this.showFormat === 'qianfenwei') {
            const intValue = this.value.replace(/[,]/g, '');
            if (/^\d+(\.\d+)?$/.test(intValue)) this.value = this.value.replace(/[,]/g, '');
          }
          return this.value;
        }
      },
      set(val) {
        if (val !== undefined && f2grid_global_mainVueLoadComplated) {
          this.value = val;
        }
      }
    },
    getJudgeText() { // 用来判断是否是text、和extend_textbox文本框
      return !this.isShowFormatterValue && this.field.fieldLength > 0 && CTRTYPEARRAY.includes(this.field.ctrType);
    },
    getShowPassWord() {
      const { ctrType } = this.field;
      if ((this.getJudgeText) || (!this.isShowFormatterValue && CTRTYPEARRAY.includes(ctrType))) {
        return this.field.entertextType === this.password;
      } else {
        return false;
      }
    },
    getMaxLength() {
      const { ctrType, fieldLength } = this.field;
      if ((this.getJudgeText) || (fieldLength > 0 && ctrType === 'textarea')) {
        return fieldLength;
      } else {
        return '';
      }
    },
    getRows() {
      return this.field.ctrType === 'textarea' ? (this.field.height / 10) : this.field.height;
    },
    getType() {
      return this.field.ctrType === 'textarea' ? 'textarea' : '';
    },
    getClearable() {
      const { ctrType } = this.field;
      if ((this.getJudgeText) || (!this.isShowFormatterValue && CTRTYPEARRAY.includes(ctrType))) {
        return true;
      } else {
        return false;
      }
    },
    getFormatterValue() {
      const showFormat = this.showFormat;
      if (showFormat === 'qianfenwei') {
        let nCurVal = ((this.value != null) && (this.value).toString()) ? Object.tofixed(this.value, this.fieldDecimalLen) : '';
        return Object.toQianfenWeiStr(nCurVal);
      } else if (showFormat === 'daxiejine') {
        return Object.toChinaNum(this.value);
      } else if (showFormat === 'percent') {
        return (this.value).toString() ? Object.tofixed(Number(this.value) * 100, 2) + '%' : '';
      }
    }
  },
  watch: {
    value: {
      handler(val, oleV) {
        if (val != undefined && f2grid_global_mainVueLoadComplated) {
          this.$emit('updatevalue', this.field, val);
        }
      },
      // 当值第一次绑定的时候，不会执行监听函数,第一次时值为undefined
      immediate: false
    },
    fieldvalue: {
      handler(newV, oleV) {
        if (newV !== undefined && oleV !== undefined && f2grid_global_mainVueLoadComplated) {
          this.value = newV;
        }
      },
      immediate: false
    }
  },
  created: function() {
    const { vModel, fieldDataType, fieldDecimalLen, _isReadOnly } = this.field;
    this.fieldName = vModel;
    this.fieldDataType = fieldDataType;
    this.fieldDecimalLen = fieldDecimalLen;
    let num = this.fieldvalue;
    this.initailFieldOption();
    if (this.isValidateNumber(num) && Object.toIsNumber(num) && fieldDecimalLen !== undefined && fieldDecimalLen !== -1 && num) {
      if (this.showFormat !== 'percent') {
        num = Object.tofixed(num, fieldDecimalLen);
      }
    }
    this.value = num;

    const formAction = WFContext.WorkflowformAction;
    this.isReadOnly = !!((formAction > 2 || _isReadOnly));
    if (this.showFormat !== '' && this.showFormat !== undefined) {
      this.isShowFormatterValue = true;
    }
  },
  mounted() {
    // 公式结果字段不可编辑
    if (this.field.countRule && this.field.countRule.rowmath !== '') {
      this.isReadOnly = true;
    }
  },
  methods: {
    initailFieldOption() {
      const { ctrType, fieldOptions, showFormat } = this.field;
      if (WFContext.isDesign) {
        return false;
      }
      if (fieldOptions) {
        const foFieldOptions = typeof fieldOptions === 'string' ? eval('(' + fieldOptions + ')') : fieldOptions;
        const general = foFieldOptions.find(a => a.opttype === 'general');
        if (general) {
          const kvData = general.params.kvData;
          if (ctrType === 'text') {
            const item = kvData.find(a => a.key === 'showFormat');
            if (item) {
              this.showFormat = item.value || '';
            }
          }
        }
      } else if (ctrType === 'extend_textbox') {
        this.showFormat = showFormat || '';
      }
    },
    isValidateNumber() {
      const fieldArray = ['floatNumber', 'biggerZero', 'biggerOrEqualZero', 'litterOrEqualZero'];
      return !!fieldArray.includes(this.fieldDataType);
    },
    changeToNormalInput(e) {
      if (!(this.isShowFormatterValue && this.showFormat != '' && CTRTYPEARRAY.includes(this.field.ctrType))) {
        return false;
      }
      if (this.isReadOnly) {
        return false;
      }
      const dom = e.target;
      const parentDom = $(dom).parent().parent();
      this.isShowFormatterValue = false;
      setTimeout(function() {
        $("input[type='text']", parentDom).focus();
      }, 300);
    },
    validate() {
      if (this.isReadOnly) return false; // 如果控件是只读状态，则不需要再触发
      const fieldDef = this.field;
      let fieldValue = this.value ? $.trim(this.value) : '';
      // if (!Object.toIsEmpty(fieldValue)) {
        const isPass = FUI.validateSingleField(fieldDef, fieldValue, null, true);
        if (isPass !== false) {
          if (!Object.toIsEmpty(fieldValue) && this.isValidateNumber(fieldValue) && Object.toIsNumber(fieldValue) && this.fieldDecimalLen !== undefined && this.fieldDecimalLen !== -1) {
            if (this.showFormat !== 'percent') {
              fieldValue = Object.tofixed(fieldValue, this.fieldDecimalLen);
            }
            this.value = fieldValue;
          }
          // =================字段事件=========================
          const isSubField = this.rowindex !== undefined && this.rowindex !== null;
          const funcName = this.field.vModel.replace(/\./g, '_');
          if (Object.toIsExitsFunction(funcName)) {
            const parms = {};
            if (isSubField) {
              const row = this.$parent.data;
              parms.row = row;
              parms.rowIndex = this.rowindex;
              parms.colIndex = this.colindex;
            }
            window[funcName](fieldValue, this.field, parms);
          }
          if (this.showFormat !== '') {
            this.isShowFormatterValue = true;
          }
        }
      // }
    },
    // 输入数字的时候 输入完成后触发
    handleChanges: fun.debounce(function(data) {
      const { ctrType, vModel } = this.field;
      if (!(this.isShowFormatterValue && CTRTYPEARRAY.includes(ctrType))) {
        return false;
      }
      // =================自定义 字段后置事件=========================
      const funcName = vModel.replace(/\./g, '_') + '_after';
      const fieldValue = this.value;
      if (!Object.toIsEmpty(fieldValue)) {
        if (this.isValidateNumber(fieldValue) && Object.toIsNumber(fieldValue) && this.fieldDecimalLen !== undefined && this.fieldDecimalLen !== -1 && (fieldValue + '').indexOf('.') > -1) {
          this.value = fieldValue;
        }
      } else {
        if (Object.toIsExitsFunction(funcName)) {
          window[funcName](fieldValue);
        }
      }
    }, 200),
    // 鼠标移入的时候
    inputOnMouseOver(event) {
      const { ctrType } = this.field;
      if (!(!this.isShowFormatterValue && ['textarea', ...CTRTYPEARRAY].includes(ctrType))) {
        return false;
      }
      const target = event.target;
      this.inputMaxWidth = target.offsetWidth ? target.offsetWidth : 371;
      if (!this.isShowFormatterValue && ['textarea', ...CTRTYPEARRAY].includes(ctrType)) {
        this.isShowTip = target.offsetWidth >= target.scrollWidth;
      }
    }
  }
}
</script>
<style lang="scss">
@import url('~@/styles/global.scss');
</style>
