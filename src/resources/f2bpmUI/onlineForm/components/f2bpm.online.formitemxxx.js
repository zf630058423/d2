import Vue from 'vue';
import f2bpmSelect from '@/views/workflow/components/onlineForm/f2bpm-select';
import f2bpmLabel from '@/views/workflow/components/onlineForm/f2bpm-label';
import f2bpmDroptree from '@/views/workflow/components/onlineForm/f2bpm-droptree';
import f2bpmMapAddress from '@/views/workflow/components/onlineForm/f2bpm-map-address';
var f2bpmOnlineformitem = Vue.component('f2bpm-onlineformitem', {
  components: {
    f2bpmLabel, f2bpmDroptree, f2bpmMapAddress,f2bpmSelect
  },
  props: ['field', 'fieldvalue', 'parentdata'],
  data: function () {
    return {
      deviceType: '',
      subtableKey: 101,
      componentKey: "502",
      // 字段定义
      fieldList: [],
      // 主表时它是主表的数据对象，子表时它是一行的数据对象
      data: {}
    };
  },
  watch: {
    parentdata: {
      handler(n, o) {
      },
      deep: true,
      immediate: true
    },
    field: {
      handler(newVal, oleVal) {
        var that = this;
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
  },
  template: '<div class="component-fieldbox" :key="componentKey"  :style="field.width!=0?\'width:\'+field.width+\'px\':\'\'" :fieldname="field.vModel" :fieldvalue="data[field.vModel]" >' +
    '            <f2bpm-label  v-if="field.ctrType==\'extend_label\'||field.ctrType==\'extend_custhtml\'" :field="field" :fieldvalue="data[field.vModel]" @updatevalue="updateFieldValue">' +
    '            </f2bpm-label>' +
    '            <f2bpm-textbox  v-else-if="field.ctrType==\'text\'||field.ctrType==\'extend_textbox\'||field.ctrType==\'textarea\'" :field="field" :fieldvalue="data[field.vModel]" @updatevalue="updateFieldValue">' +
    '            </f2bpm-textbox>' +
    '            <f2bpm-radio   v-else-if="field.ctrType==\'radio\'" :field="field" :fieldvalue="data[field.vModel]" @updatevalue="updateFieldValue">' +
    '            </f2bpm-radio>' +
    '            <f2bpm-checkbox  v-else-if="field.ctrType==\'checkbox\'" :field="field" :fieldvalue="data[field.vModel]" @updatevalue="updateFieldValue">' +
    '            </f2bpm-checkbox>' +
    '            <f2bpm-select v-else-if="field.ctrType==\'select\'" :field="field" :fieldvalue="data[field.vModel]" @updatevalue="updateFieldValue">' +
    '            </f2bpm-select>' +
    '            <f2bpm-droptree v-else-if="field.ctrType==\'droptree\'" :field="field" :fieldvalue="data[field.vModel]" @updatevalue="updateFieldValue">' +
    '            </f2bpm-droptree>' +

    '            <f2bpm-datetime   v-else-if="field.ctrType==\'datetime\'"  :field="field" :fieldvalue="data[field.vModel]" @updatevalue="updateFieldValue">' +
    '            </f2bpm-datetime>' +
    '            <f2bpm-button   v-else-if="field.ctrType==\'button\'||field.ctrType==\'extend_button\'||field.ctrType==\'extend_tabtoolbar\'"  :field="field" :fieldvalue="data[field.vModel]" @updatevalue="updateFieldValue">' +
    '            </f2bpm-button>' +
    '            <f2bpm-iframe v-else-if="field.ctrType==\'extend_iframe\'"  :field="field" :fieldvalue="field.src"></f2bpm-iframe>' +

    '            <f2bpm-file v-else-if="field.ctrType==\'file\'" :field="field" :fieldvalue="data[field.vModel]" @updatevalue="updateFieldValue">' +
    '            </f2bpm-file>' +
    '            <f2bpm-picture v-else-if="field.ctrType==\'picture\'" :field="field" :fieldvalue="data[field.vModel]" @updatevalue="updateFieldValue">' +
    '            </f2bpm-picture>' +
    '            <f2bpm-serialnum v-else-if="field.ctrType==\'serialnum\'" :field="field" :fieldvalue="data[field.vModel]" @updatevalue="updateFieldValue">' +
    '            </f2bpm-serialnum>' +
    '            <f2bpm-autocompleter v-else-if="field.ctrType==\'autocompleter\'" :field="field" :fieldvalue="data[field.vModel]" @updatevalue="updateFieldValue" @appendfieldvalue="appendFieldValue" >' +
    '            </f2bpm-autocompleter>' +
    '            <f2bpm-handsign v-else-if="field.ctrType==\'handsign\'" :field="field" :fieldvalue="data[field.vModel]" @updatevalue="updateFieldValue" @appendfieldvalue="appendFieldValue" >' +
    '            </f2bpm-handsign>' +
    '            <f2bpm-hyperlink v-else-if="field.ctrType==\'hyperlink\'" :field="field" :fieldvalue="data[field.vModel]" @updatevalue="updateFieldValue" @appendfieldvalue="appendFieldValue" >' +
    '            </f2bpm-hyperlink>' +
    '            <f2bpm-cascselect v-else-if="field.ctrType==\'cascselect\'" :field="field" :fieldvalue="data[field.vModel]" @updatevalue="updateFieldValue" @appendfieldvalue="appendFieldValue" >' +
    '            </f2bpm-cascselect>' +
    '            <f2bpm-stamp v-else-if="field.ctrType==\'stamp\'" :field="field" :fieldvalue="data[field.vModel]" @updatevalue="updateFieldValue" @appendfieldvalue="appendFieldValue" >' +
    '            </f2bpm-stamp>' +
    '            <f2bpm-richeditor v-else-if="field.ctrType==\'richeditor\'"  :dataself="data" :field="field" :fieldvalue="data[field.vModel]" @updatevalue="updateFieldValue" @appendfieldvalue="appendFieldValue" >' +
    '            </f2bpm-richeditor>' +
    '            <f2bpm-selector v-else-if="field.ctrType==\'selector\'" :field="field" :fieldvalue="data[field.vModel]" @updatevalue="updateFieldValue" @appendfieldvalue="appendFieldValue" >' +
    '            </f2bpm-selector>' +
    '            <f2bpm-customdialog v-else-if="field.ctrType==\'customdialog\'" :field="field" :fieldvalue="data[field.vModel]"  @updatevalue="updateFieldValue" @appendfieldvalue="appendFieldValue" >' +
    '            </f2bpm-customdialog>' +
    '            <f2bpm-map-address v-else-if="field.ctrType==\'mapAddress\'" :field="field" :fieldvalue="data[field.vModel]"  @updatevalue="updateFieldValue" @appendfieldvalue="appendFieldValue" >' +
    '            </f2bpm-map-address>' +
    '            <f2bpm-subtable  :key="subtableKey" v-if="deviceType==\'pc\'&&field.ctrType==\'subtable\'" :field="field" :fieldvalue="data[field.vModel]" @updatevalue="updateFieldValue" @appendfieldvalue="appendFieldValue">' +
    '           </f2bpm-subtable>' +
    '            <f2bpm-mobilesubtable :key="subtableKey" v-else-if="deviceType==\'mobile\'&&field.ctrType==\'subtable\'" :field="field" :fieldvalue="data[field.vModel]" @updatevalue="updateFieldValue" @appendfieldvalue="appendFieldValue">' +
    '           </f2bpm-mobilesubtable>' +
    ' </div>'
});
