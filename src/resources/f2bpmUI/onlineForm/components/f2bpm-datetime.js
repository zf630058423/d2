import Vue from 'vue';
var f2bpmDatetime = Vue.component('f2bpm-datetime', {
  props: ['field', 'fieldvalue'],
  data: function () {
    return {
      isView: false,
      isShow: true,
      isReadOnly: false,
      value: ''
    };
  },
  watch: {
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
  created: function () {
    var that = this;
    that.value = that.fieldvalue;
    that.isView = formAction > 2;
    if (that.isView) {
      that.isReadOnly = true;
    } else if (that.field._isReadOnly == true) {
      that.isReadOnly = true;
    }
  }, mounted() {
    var that = this;
    //FUI.F2Grid.excuteFieldWritePowerByVueFormItem(that);
  },
  methods: {
    dateChange(value) {
      var that = this;
      if (value != undefined) {
        // 字段事件
        var funcName = that.field.vModel.replace(/\./g, '_');
        if (Object.toIsExitsFunction(funcName)) {
          window[funcName](value, that.field);
        }
      }
    }

  },
  template: '<div v-show="isShow"><el-time-picker @change="dateChange" size="small" v-model="value" :disabled="isReadOnly" :name="field.vModel"  v-if="field.ctrType==\'datetime\'&&(field.format==\'HH:mm:ss\'||field.format==\'HH:mm\'||field.format==\'HH:mm\'||field.format==\'HH时mm分ss秒\'||field.format==\'HH时mm分\')" :format="field.format" :value-format="field.format" :placeholder="field.fieldRemark">' +
    '            </el-time-picker>' +
    '            <el-date-picker v-model="value" @change="dateChange"  size="small" :disabled="isReadOnly" :name="field.vModel" v-else-if="field.ctrType==\'datetime\'&&(field.format==\'year\'||field.format==\'month\')" :type="field.format" :placeholder="field.fieldRemark">' +
    '            </el-date-picker>' +
    '            <el-date-picker v-model="value"   @change="dateChange" size="small" :disabled="isReadOnly" :name="field.vModel" v-else-if="field.ctrType==\'datetime\'&&(field.format==\'week\')" :type="field.format" format="yyyy第WW周" :value-format="field.format" placeholder="选择周">' +
    '            </el-date-picker>' +
    '            <el-date-picker v-model="value"   @change="dateChange" size="small" :disabled="isReadOnly" :name="field.vModel" v-else-if="field.ctrType==\'datetime\'&&(field.format==\'monthrange\')" :type="field.format" value-format="yyyy-MM" start-placeholder="开始月份" end-placeholder="结束月份">' +
    '            </el-date-picker>' +
    '            <el-date-picker v-model="value"   @change="dateChange" size="small" :disabled="isReadOnly" :name="field.vModel" v-else-if="field.ctrType==\'datetime\'&&(field.format==\'dates\'||field.format==\'daterange\')" value-format="yyyy-MM-dd"  :type="field.format" start-placeholder="开始时间" end-placeholder="结束时间">' +
    '            </el-date-picker>' +
    '            <el-date-picker v-model="value"   @change="dateChange" size="small" :disabled="isReadOnly" :name="field.vModel" v-else-if="field.ctrType==\'datetime\'&&(field.format==\'datetimerange\')" :type="field.format" value-format="yyyy-MM-dd HH:mm:ss" start-placeholder="开始时间" end-placeholder="结束时间">' +
    '            </el-date-picker>' +
    '            <el-date-picker v-model="value"   @change="dateChange" size="small" :disabled="isReadOnly" :name="field.vModel" v-else-if="field.ctrType==\'datetime\'" type="datetime"  :placeholder="field.fieldRemark" :format="field.format" :value-format="field.format">' +
    '            </el-date-picker>' +
    '</div> '
});
