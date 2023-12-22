<template>
  <div class="component-fieldbox" :key="componentKey" :style="field.width!=0?'width:'+field.width+'px':''" :fieldname="field.vModel" :fieldvalue="data[field.vModel]">
    <f2bpm-label 
      v-if="field.ctrType=='extend_label' || field.ctrType == 'extend_custhtml'" 
      :rowindex="rowindex" 
      :colindex="colindex" 
      :field="field" 
      :fieldvalue="data[field.vModel]" 
      @updatevalue="updateFieldValue">
    </f2bpm-label>

    <!-- 文本框 -->
    <f2bpm-textbox 
      v-else-if="field.ctrType=='text' || field.ctrType =='extend_textbox' || field.ctrType=='textarea'" 
      :rowindex="rowindex" 
      :colindex="colindex" 
      :field="field" 
      :fieldvalue="data[field.vModel]" 
      @updatevalue="updateFieldValue">
    </f2bpm-textbox>

    <f2bpm-switch 
      v-else-if="field.ctrType=='switch'" 
      :rowindex="rowindex" 
      :colindex="colindex" 
      :field="field" 
      :fieldvalue="data[field.vModel]" 
      @updatevalue="updateFieldValue">
    </f2bpm-switch>

    <f2bpm-steps v-else-if="field.ctrType=='steps'" :rowindex="rowindex" :colindex="colindex" :field="field" :fieldvalue="data[field.vModel]" @updatevalue="updateFieldValue">
    </f2bpm-steps>
    <f2bpm-divider v-else-if="field.ctrType=='extend_divider'" :rowindex="rowindex" :colindex="colindex" :field="field">
    </f2bpm-divider>
    <f2bpm-radio v-else-if="field.ctrType=='radio'" :rowindex="rowindex" :colindex="colindex" :field="field" :fieldvalue="data[field.vModel]" @updatevalue="updateFieldValue">
    </f2bpm-radio>
    <f2bpm-checkbox v-else-if="field.ctrType=='checkbox'" :rowindex="rowindex" :colindex="colindex" :field="field" :fieldvalue="data[field.vModel]" @updatevalue="updateFieldValue">
    </f2bpm-checkbox>
    <!-- 下拉框 -->
    <f2bpm-select v-else-if="field.ctrType=='select'" :rowindex="rowindex" :colindex="colindex" :field="field" :fieldvalue="data[field.vModel]" @updatevalue="updateFieldValue">
    </f2bpm-select>
    <!-- tree下拉框组件 -->
    <f2bpm-droptree v-else-if="field.ctrType=='droptree'" :rowindex="rowindex" :colindex="colindex" :field="field" :fieldvalue="data[field.vModel]" @updatevalue="updateFieldValue">
    </f2bpm-droptree>

    <f2bpm-datetime v-else-if="field.ctrType=='datetime'" :rowindex="rowindex" :colindex="colindex" :field="field" :fieldvalue="data[field.vModel]" @updatevalue="updateFieldValue">
    </f2bpm-datetime>
    <f2bpm-button v-else-if="field.ctrType=='button'||field.ctrType=='extend_button'||field.ctrType=='extend_tabtoolbar'" :rowindex="rowindex" :colindex="colindex" :field="field" :fieldvalue="data[field.vModel]" @updatevalue="updateFieldValue">
    </f2bpm-button>
    <f2bpm-iframe v-else-if="field.ctrType=='extend_iframe'" :rowindex="rowindex" :colindex="colindex" :field="field" :fieldvalue="field.src"></f2bpm-iframe>

    <f2bpm-file v-else-if="field.ctrType=='file'||field.ctrType=='extend_file'" :rowindex="rowindex" :colindex="colindex" :field="field" :fieldvalue="data[field.vModel]" @updatevalue="updateFieldValue">
    </f2bpm-file>
    <f2bpm-picture v-else-if="field.ctrType=='picture'||field.ctrType=='extend_picture'" :rowindex="rowindex" :colindex="colindex" :field="field" :fieldvalue="data[field.vModel]" @updatevalue="updateFieldValue">
    </f2bpm-picture>
    <f2bpm-serialnum v-else-if="field.ctrType=='serialnum'" :rowindex="rowindex" :colindex="colindex" :field="field" :fieldvalue="data[field.vModel]" @updatevalue="updateFieldValue">
    </f2bpm-serialnum>
    <f2bpm-autocompleter v-else-if="field.ctrType=='autocompleter'" :rowindex="rowindex" :colindex="colindex" :field="field" :fieldvalue="data[field.vModel]" @updatevalue="updateFieldValue" @appendfieldvalue="appendFieldValue">
    </f2bpm-autocompleter>
    <f2bpm-handsign v-else-if="field.ctrType=='handsign'" :rowindex="rowindex" :colindex="colindex" :field="field" :fieldvalue="data[field.vModel]" @updatevalue="updateFieldValue" @appendfieldvalue="appendFieldValue">
    </f2bpm-handsign>
    <f2bpm-hyperlink v-else-if="field.ctrType=='hyperlink'" :rowindex="rowindex" :colindex="colindex" :field="field" :fieldvalue="data[field.vModel]" @updatevalue="updateFieldValue" @appendfieldvalue="appendFieldValue">
    </f2bpm-hyperlink>
    <f2bpm-qrcode v-else-if="field.ctrType=='qrcode'" :rowindex="rowindex" :colindex="colindex" :field="field" :fieldvalue="data[field.vModel]" @updatevalue="updateFieldValue" @appendfieldvalue="appendFieldValue">
    </f2bpm-qrcode>
    <f2bpm-rate v-else-if="field.ctrType=='rate'" :rowindex="rowindex" :colindex="colindex" :field="field" :fieldvalue="data[field.vModel]" @updatevalue="updateFieldValue" @appendfieldvalue="appendFieldValue">
    </f2bpm-rate>
    <f2bpm-progress v-else-if="field.ctrType=='progress'" :rowindex="rowindex" :colindex="colindex" :field="field" :fieldvalue="data[field.vModel]" @updatevalue="updateFieldValue" @appendfieldvalue="appendFieldValue">
    </f2bpm-progress>
    <f2bpm-slider v-else-if="field.ctrType=='slider'" :rowindex="rowindex" :colindex="colindex" :field="field" :fieldvalue="data[field.vModel]" @updatevalue="updateFieldValue" @appendfieldvalue="appendFieldValue">
    </f2bpm-slider>
    <!-- 级联多选 -->
    <!-- <f2bpm-multiple-cascselect v-else-if="field.ctrType=='cascselect'" :rowindex="rowindex" :colindex="colindex" :field="field" :fieldvalue="data[field.vModel]" @updatevalue="updateFieldValue" @appendfieldvalue="appendFieldValue">
    </f2bpm-multiple-cascselect> -->
    <!-- 级联单选 -->
    <f2bpm-cascselect v-else-if="field.ctrType=='cascselect'" :rowindex="rowindex" :colindex="colindex" :field="field" :fieldvalue="data[field.vModel]" @updatevalue="updateFieldValue" @appendfieldvalue="appendFieldValue">
    </f2bpm-cascselect>
    <f2bpm-stamp v-else-if="field.ctrType=='stamp'" :rowindex="rowindex" :colindex="colindex" :field="field" :fieldvalue="data[field.vModel]" @updatevalue="updateFieldValue" @appendfieldvalue="appendFieldValue">
    </f2bpm-stamp>
    <f2bpm-richeditor v-else-if="field.ctrType=='richeditor'" :rowindex="rowindex" :colindex="colindex" :dataself="data" :field="field" :fieldvalue="data[field.vModel]" @updatevalue="updateFieldValue" @appendfieldvalue="appendFieldValue">
    </f2bpm-richeditor>
    <!-- 连接弹框：业务单元、业务中心、跟进入等 -->
    <f2bpm-selector v-else-if="field.ctrType=='selector'" :rowindex="rowindex" :colindex="colindex" :field="field" :fieldvalue="data[field.vModel]" @updatevalue="updateFieldValue" @appendfieldvalue="appendFieldValue">
    </f2bpm-selector>
    <!-- 选择弹框 如： 入库建设单位名称、 项目介绍人等-->
    <f2bpm-customdialog v-else-if="field.ctrType=='customdialog'" :rowindex="rowindex" :colindex="colindex" :field="field" :fieldvalue="data[field.vModel]" @updatevalue="updateFieldValue" @appendfieldvalue="appendFieldValue">
    </f2bpm-customdialog>
    <f2bpm-map-address v-else-if="field.ctrType=='mapAddress'" :rowindex="rowindex" :colindex="colindex" :field="field" :fieldvalue="data[field.vModel]" @updatevalue="updateFieldValue" @appendfieldvalue="appendFieldValue">
    </f2bpm-map-address>
    <f2bpm-subtable :key="subtableKey" v-if="deviceType=='pc'&&field.ctrType=='subtable'" :field="field" :fieldvalue="data[field.vModel]" @updatevalue="updateFieldValue" @appendfieldvalue="appendFieldValue">
    </f2bpm-subtable>
    <f2bpm-mobilesubtable :key="subtableKey" v-else-if="deviceType=='mobile'&&field.ctrType=='subtable'" :field="field" :fieldvalue="data[field.vModel]" @updatevalue="updateFieldValue" @appendfieldvalue="appendFieldValue">
    </f2bpm-mobilesubtable>
  </div>
</template>

<script>
  import Vue from 'vue';
  import f2bpmSelect from '@/views/workflow/components/onlineForm/f2bpm-select';
  import f2bpmLabel from '@/views/workflow/components/onlineForm/f2bpm-label';
  import f2bpmTextbox from '@/views/workflow/components/onlineForm/f2bpm-textbox';
  import f2bpmDroptree from '@/views/workflow/components/onlineForm/f2bpm-droptree';
  import f2bpmMapAddress from '@/views/workflow/components/onlineForm/f2bpm-map-address';
  import f2bpmCustomdialog from '@/views/workflow/components/onlineForm/f2bpm-customdialog';
  import f2bpmAutocompleter from '@/views/workflow/components/onlineForm/f2bpm-autocompleter';
  import f2bpmCascselect from '@/views/workflow/components/onlineForm/f2bpm-cascselect';
  import f2bpmMultipleCascselect from '@/views/workflow/components/onlineForm/f2bpm-multiple-cascselect';
  import f2bpmButton from '@/views/workflow/components/onlineForm/f2bpm-button';
  import f2bpmHandsign from '@/views/workflow/components/onlineForm/f2bpm-handsign';
  import f2bpmSteps from '@/views/workflow/components/onlineForm/f2bpm-steps';
  import f2bpmDivider from '@/views/workflow/components/onlineForm/f2bpm-divider';
  import f2bpmSwitch from '@/views/workflow/components/onlineForm/f2bpm-switch';

  import f2bpmIframe from '@/views/workflow/components/onlineForm/f2bpm-iframe';
  import f2bpmStamp from '@/views/workflow/components/onlineForm/f2bpm-stamp';
  import f2bpmSerialnum from '@/views/workflow/components/onlineForm/f2bpm-serialnum';
  import f2bpmSelector from '@/views/workflow/components/onlineForm/f2bpm-selector';
  import f2bpmRadio from '@/views/workflow/components/onlineForm/f2bpm-radio';
  import f2bpmRicheditor from '@/views/workflow/components/onlineForm/f2bpm-richeditor';
  import f2bpmPicture from '@/views/workflow/components/onlineForm/f2bpm-picture';
  import f2bpmHyperlink from '@/views/workflow/components/onlineForm/f2bpm-hyperlink';
  import f2bpmCheckbox from '@/views/workflow/components/onlineForm/f2bpm-checkbox';
  import f2bpmDatetime from '@/views/workflow/components/onlineForm/f2bpm-datetime';
  import f2bpmFile from '@/views/workflow/components/onlineForm/f2bpm-file';
  import f2bpmQrcode from '@/views/workflow/components/onlineForm/f2bpm-qrcode';
  import f2bpmRate from '@/views/workflow/components/onlineForm/f2bpm-rate';
  import f2bpmProgress from '@/views/workflow/components/onlineForm/f2bpm-progress';
  import f2bpmSlider from '@/views/workflow/components/onlineForm/f2bpm-slider';
  export default {
    name: "f2bpm-onlineformitem",
    components: {
      f2bpmLabel, f2bpmTextbox, f2bpmDroptree, f2bpmMapAddress, f2bpmSteps,
      f2bpmSelect, f2bpmCustomdialog, f2bpmAutocompleter, f2bpmCascselect, f2bpmMultipleCascselect, f2bpmButton, f2bpmHandsign, f2bpmDivider
      , f2bpmSwitch, f2bpmIframe, f2bpmStamp, f2bpmSerialnum, f2bpmSelector, f2bpmRadio, f2bpmRicheditor, f2bpmPicture
      , f2bpmHyperlink, f2bpmCheckbox, f2bpmDatetime, f2bpmFile, f2bpmQrcode, f2bpmRate, f2bpmProgress, f2bpmSlider
    },
    props: ['field', 'fieldvalue', 'parentdata', 'rowindex', 'colindex'],
    //  rowindex:子表时才有值行索引，colindex子表时才有值列索引
    data: function () {
      return {
        deviceType: '',
        subtableKey: 101,
        componentKey: "502",
        // 字段定义
        fieldList: [],
        // 主表时它是主表的数据对象，子表时它是一行的数据对象
        data: {},
        isMultiple:false
      };
    },
    watch: {
      //当是主表控件时为主表数据，当处于子表控件时为子表某一行数据。
      parentdata: {
        handler(n, o) {
        },
        deep: true,
        immediate: true
      },
      field: {
        handler(newVal, oleVal) {
          var that = this;
          // that.isMultiple = newVal.ctrType === 'cascselect' && newVal.label === '片区范围' ? true : false;
          // console.log("that.isMultiple===:",that.isMultiple);
          if (newVal.ctrType == 'subtable') {
            var newKey = that.subtableKey + 1;
            that.subtableKey = newKey;
          }
          else if (oleVal != undefined) {
            console.info("f2bpm.online.formitem componentKey");
            that.componentKey = "componen" + Object.toGuid(false);
          }
        },
        deep: true,
        immediate: true
      }
    },
    mounted() {
      var that = this;
    },
    created: function () {
      var that = this;
      that.deviceType = WFContext.deviceType;
      that.componentKey = "componen" + Object.toGuid(false);
      // JavaScript 中对象和数组是引用类型，指向同一个内存空间，如果 prop 是一个对象或数组，
      // 在子组件内部改变它会影响父组件的状态,所以它data的变化会直接影响到父组件的data
      that.data = that.parentdata;
      that.isMultiple = that.field.ctrType === 'cascselect' && that.field.label === '片区范围' ? true : false;
      if (WFContext.WorkflowInstinceState == 0) {
        // 拟稿时初始化默认值
        var fieldDefaultExpress = that.field.fieldDefaultValue;
        if (fieldDefaultExpress && WFContext.isDesign === false) {
          var defvalue = getSysDefaultValue(fieldDefaultExpress, WFContext);
          that.data[that.field.vModel] = defvalue;
        }
      }
    },
    methods: {
      renderComponent(keyName) {
        var that = this;
        that.$emit('rendercomponent', keyName);
      },
      // field: 可以是字段名也可以是字段定义的对象
      // 更新目标：主表数据对象或子表行的数据对象
      updateFieldValue(field, newValue, vueDataName, subVueDataName) {
        var fieldName = typeof field === 'string' ? field : field.vModel;
        if (typeof field === 'object' && (fieldName == undefined || fieldName == null)) {
          fieldName = field['field'];
        }
        // 子表字段时，更新的是当前行的row对象
        var isSubtable = fieldName.split('.').length >= 3;
        // 更新自己控件值
        var that = this;
        var vueDataObj = vueDataName ? that[vueDataName] : that.data;
        if (subVueDataName) {
          vueDataObj = that[vueDataName][subVueDataName];
        }
        if (fieldName) {
          vueDataObj[fieldName] = newValue;
          // console.info("updateFieldValue formitem字段:" + fieldName);
        }

        that.excuteRowMath();
        // 由于data是引用了父组件的对象，所以是地址引用，所以不需要再次向上触发更新
        // that.$emit('updatevalue', field, newValue, vueDataName, subVueDataName);
      },
      appendFieldValue(fieldName, newValue, vueDataName, subVueDataName) {
        console.info('appendFieldValue');
        // 追加值到指定字段
        var that = this;
        var vueDataObj = vueDataName ? that[vueDataName] : that.data;
        if (subVueDataName) {
          vueDataObj = that[vueDataName][subVueDataName];
        }
        var oleValue = vueDataObj[fieldName] || '';
        if (oleValue) {
          vueDataObj[fieldName] = oleValue + ',' + newValue;
        }
        vueDataObj[fieldName] = newValue;
        // that.$emit('appendfieldvalue',fieldName, newValue, vueDataName,subVueDataName);
      },
      excuteRowMath() {
        var that = this;
        // 第一次页面加载时不触发执行
        if (!f2grid_global_mainVueLoadComplated) {
          return false;
        }
        // 检查我的变化是否要触发行内公式计算
        // 只有 输入框、下拉框、选择器，自定义选择器，日期才会有公式计算，才需要去判断触发公式
        if (that.field.ctrType != 'text' && that.field.ctrType != 'select' && that.field.ctrType != 'selector' && that.field.ctrType != 'customdialog' && that.field.ctrType != 'datetime') {
          return false;
        }
        // console.info("触发公式判断:"+that.field.vModel)
        var isCanMath = FUI.F2Grid.checkMyChangeIsNeedToExcuteMath(that.field.vModel);
        if (isCanMath) {
          // console.info("【执行公式】:" + that.field.fieldTitle)
          // 因为公式字段会被链条式的使用，所以需要触发所有公式进行计算
          FUI.F2Grid.excuteAllMath(that.field.vModel, that.data);
        }
      },
      listens() {

      }
    }
  }
</script>