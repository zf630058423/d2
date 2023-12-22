<template>
  <div v-show="isShow">
    <el-time-picker @change="dateChange" size="small" v-model="value" :disabled="isReadOnly" :name="field.vModel" v-if="field.ctrType=='datetime'&&(field.format=='HH:mm:ss'||field.format=='HH:mm'||field.format=='HH:mm'||field.format=='HH时mm分ss秒'||field.format=='HH时mm分')" :format="field.format" :value-format="field.format" :placeholder="field.fieldRemark">
    </el-time-picker>
    <el-date-picker v-model="value" @change="dateChange" size="small" :disabled="isReadOnly" :name="field.vModel" v-else-if="field.ctrType=='datetime'&&field.format=='year'" type="year" value-format="yyyy" placeholder="请选择年">
    </el-date-picker>
    <el-date-picker v-model="value" @change="dateChange" size="small" :disabled="isReadOnly" :name="field.vModel" v-else-if="field.ctrType=='datetime'&&field.format=='month'" type="month" value-format="yyyy-MM" placeholder="请选择月">
    </el-date-picker>
    <el-date-picker v-model="value" @change="dateChange" size="small" :disabled="isReadOnly" :name="field.vModel" v-else-if="field.ctrType=='datetime'&&field.format=='yyyy年MM月'" type="month" :value-format="field.format" :format="field.format" placeholder="请选择月">
    </el-date-picker>
    <el-date-picker v-model="value" @change="dateChange" size="small" :disabled="isReadOnly" :name="field.vModel" v-else-if="field.ctrType=='datetime'&&field.format=='week'" type="week" format="yyyy第WW周" value-format="yyyy-MM-dd" placeholder="选择周">
    </el-date-picker>

    <el-date-picker v-model="value" @change="dateChange" size="small" :disabled="isReadOnly" :name="field.vModel" v-else-if="field.ctrType=='datetime'&&field.format=='dates'" value-format="yyyy-MM-dd" type="dates" placeholder="选择一个或多个日期">
    </el-date-picker>
    <el-date-picker v-model="value" @change="dateChange" size="small" :disabled="isReadOnly" :name="field.vModel" v-else-if="field.ctrType=='datetime'&&field.format=='daterange'" value-format="yyyy-MM-dd" type="daterange" start-placeholder="开始时间" end-placeholder="结束时间">
    </el-date-picker>
    <el-date-picker v-model="value" @change="dateChange" size="small" :disabled="isReadOnly" :name="field.vModel" v-else-if="field.ctrType=='datetime'&&field.format=='datetimerange'" type="datetimerange" value-format="yyyy-MM-dd HH:mm:ss" start-placeholder="开始时间" end-placeholder="结束时间">
    </el-date-picker>
    <el-date-picker v-model="value" @change="dateChange" size="small" :disabled="isReadOnly" :name="field.vModel" v-else-if="field.ctrType=='datetime'&&field.format=='monthrange'" type="monthrange" value-format="yyyy-MM" start-placeholder="开始月份" end-placeholder="结束月份">
    </el-date-picker>



    <el-date-picker v-model="value" @change="dateChange" size="small" :disabled="isReadOnly" :name="field.vModel" v-else-if="field.ctrType=='datetime'&&(field.format=='yyyy-MM-dd'||field.format=='yyyy年MM月dd日')" type="date" :placeholder="field.fieldRemark" :format="field.format" value-format="yyyy-MM-dd">
    </el-date-picker>
    <el-date-picker v-model="value" @change="dateChange" size="small" :disabled="isReadOnly" :name="field.vModel" v-else-if="field.ctrType=='datetime'" type="datetime" :placeholder="field.fieldRemark" :format="field.format" :value-format="field.format">
    </el-date-picker>
  </div>
</template>

<script>
  export default {
    name: "f2bpm-datetime",
    components: {},
    props: ['field', 'fieldvalue', 'rowindex', 'colindex'],
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
        if (oleV != undefined && f2grid_global_mainVueLoadComplated) {
          this.$emit('updatevalue', that.field, val);
        }
      },
      fieldvalue: {
        handler(newV, oleV) {
          var that = this;
          if (oleV != undefined &&that.value!=newV&& f2grid_global_mainVueLoadComplated) {
            that.value = newV;
          }
        },
        immediate: false
      }
    },
    created: function () {
      var that = this;
      if ((that.field.format == 'dates' || that.field.format == 'daterange' || that.field.format == 'datetimerange' || that.field.format == 'monthrange') && that.fieldvalue) {
        that.value = eval("(" + that.fieldvalue + ")");
      } else {
        that.value = that.fieldvalue;
      }
      var formAction = WFContext.WorkflowformAction;
      that.formAction = formAction;
      that.isView = that.formAction > 2;
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
        if (value == null) {
          that.value = "";
          value="";
        }
        //=================字段事件=========================
        let isSubField = that.rowindex != undefined && that.rowindex != null;
        var funcName = that.field.vModel.replace(/\./g, '_');
        if (Object.toIsExitsFunction(funcName)) {
          let parms = {};
          if (isSubField) {
            let row = that.$parent.data;
            parms.row = row;
            parms.rowIndex = that.rowindex;
            parms.colIndex = that.colindex;
          }
          window[funcName](value, that.field, parms);
        }
        //================================================
      }

    }
  }
</script>
