
<template>
  <div class="online-cascader">
    <el-cascader size="mini" v-if="!isReadOnly" style="width:30px;margin-right: 10px;" v-model="calcValue" class="online-select" @change="change" :props="props"></el-cascader>
    
    <el-input size="mini" class="online-cascader-input" :id="id" v-model="value" :disabled="!isEnableEdit" :field="field.fieldDef" style="width:88%;" :clearable="clearable" :placeholder="field.fieldRemark"></el-input>
  </div>
</template>
<script>
   /**
   * 级联下拉组件
   */
  export default {
    name: 'f2bpmuiCascselect',
    components: {},
    props: ['field', 'fieldvalue', 'readOnly'],
    data: function () {
      return {
        timeout: null,
        isView: false,
        isShow: true,
        isReadOnly: false,
        isShowAddressInfo: false,
        url: '/workflow/security/autocompleter/',
        // 数据服务的编码
        code: {},
        // 是否可编辑
        isEnableEdit: false,
        // 是否根
        isRoot: false,
        // 子控件
        child: null,
        // 高级参数
        parms: null,
        // 选中项的回邦到表单字段的配置
        fieldbind: [],
        id: '',
        clearable: false,
        // 级联控件的临时值
        calcValue: [],
        value: '',
        // 显示的文本
        isFirst: true,
        showText: '',
        props: {
          lazy: true,
          label: 'text',
          lazyLoad: this.lazyLoad
        }
      }
    },
    watch: {
      value(val, oleV) {
        var that = this
        if (val != undefined && oleV != undefined) {
          this.$emit('updatevalue', that.field.fieldName, val);
        }
      }
    },
    mounted() {
      var that = this;
    },
    created: function () {
      var that = this;
      if (that.readOnly != undefined&&that.readOnly!=null) {
        that.isReadOnly = that.readOnly;
        that.isView= that.readOnly;
      }
      that.initailFieldOption()
      that.value = that.fieldvalue;
      if (that.field.inputCtrlOption) {
        var json = typeof that.field.inputCtrlOption === 'object' ? that.field.inputCtrlOption : eval('(' + that.field.inputCtrlOption + ')')
        that.code = json.data.code;
        if (json.data.isRoot == 'true' || json.data.isRoot == true) {
          that.isRoot = true;
        }
        if (that.isView == false && (json.data.isEnableEdit == 'true' || json.data.isEnableEdit == true)) {
          that.isEnableEdit = true;
        }
        if (json.data.child) {
          that.child = json.data.child;
        }
        if (json.data.parms) {
          that.parms = json.data.parms;
        }
        that.fieldbind = json.data.fieldbind;

        that.props.code = that.code;
        that.props.parms = that.parms;
        that.props.child = that.child;
      }
      that.id = 'temp_' + Object.toGuid(false);
    }, mounted() {
      var that = this;
      FUI.F2Grid.excuteFieldWritePowerByVueFormItem(that);
    },
    methods: {
      initailFieldOption() {
        var that = this;
        if (that.field.fieldOptions) {
          var fieldOptions = typeof that.field.fieldOptions === 'string' ? eval('(' + that.field.fieldOptions + ')') : that.field.fieldOptions;
          var general = fieldOptions.find(a => a.opttype == 'general');
          if (general) {
            var kvData = general.params.kvData;
            var item = kvData.find(a => a.key == 'clearable');
            if (item) {
              that.clearable = item.value;
            }
          }
        }
      },
      lazyLoad(node, callback) {
        if (WFContext.isDesign == true) {
          return false;
        }
        var that = this;
        // 从0开始
        var level = node.level;
        var isroot = node.root;
        var defalutRootValue = 'root';
        var casccode = that.code;
        if (that.parms) {
          if (that.parms.rootParentValue != '') {
            defalutRootValue = that.parms.rootParentValue;
          }
        }
        if (!isroot && that.child) {
          // 扩展子级的取数据服务
          casccode = that.child[level] ? that.child[level] : casccode;
        }
        if (level == 0) {
          that.text = '';
        }
        var nodeData = node.data || { value: defalutRootValue };
        var parms = { 'casccode': casccode, 'parentValue': nodeData.value };
        var res = Object.toAjaxJson('/workflow/security/autocompleter/', 'getCasSelectListJson', parms, true, null, function (data) {
          if (data.success == false) {
            FUI.Window.showMsg(null, data.msg);
            callback([]);
          } else {
            data = data || []
            // if(data&&that.value&&that.value.length>0&&data.length>0){
            //     var item=data.find(a=>a.value==that.value[level]);
            //     if(item){
            //         that.showText =level==0? item.text:that.showText+"/"+item.text;
            //     }
            //     if(that.isFirst&&that.value.length-1==level){
            //         $("input",$("#"+that.id)).val(that.showText);
            //         that.isFirst=false;
            //     }
            // }
            clearTimeout(that.timeout)
            that.timeout = setTimeout(function () {
              callback(data || []);
            }, 200);
          }
        })
      },
      // 点击时触发
      change(expandArr) {
        var that = this;
        const expandStr = expandArr.join('/');
        that.value = expandStr;
        that.calcValue = [];
        that.onBlur();
      },
      onBlur() {
        var that = this;
        var fieldDef = that.field;
        var fieldValue = that.value;
        var funcName = fieldDef.fieldName.replace(/\./g, '_');
        if (Object.toIsExitsFunction(funcName)) {
          window[funcName](fieldValue, fieldDef);
        }
      }
    }
  }
</script>