<template>
  <div class="online-cascader">
    <el-cascader size="mini" ref="myCascader" v-if="!isReadOnly" v-model="calcValue" class="online-select" clearable style="padding:0px" @change="change" :props="props" collapse-tags></el-cascader>
    <!-- <el-input size="mini" class="online-cascader-input" :id="id" v-model="value" :disabled="!isEnableEdit" :field="field.vModel" style="width:80%;padding:0px" :clearable="clearable" :placeholder="field.fieldRemark"></el-input> -->
  </div>
</template>

<script>
  /**
   * 级联下拉列表组件
   */
  export default {
    name: "f2bpm-cascselect",
    props: ['field', 'fieldvalue', 'rowindex', 'colindex', 'isMultiple'],
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
        // 高级参数{cascValueField:"值绑定到其它目标字段名",cascRootValue:"顶级值，第一级的上级值"}
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
          label: 'text',
          lazy: true,
          lazyLoad: this.lazyLoad,
          multiple: true,
          expandTrigger: 'click',
          checkStrictly: false,
        },
        // props: {
        //   //懒加载的方式
        //   lazy: true,
        //   label: 'text',
        //   //设置父子节点取消选中关联，从而达到选择任意一级选项的目的
        //   checkStrictly: true,
        //   //hover 触发子菜单 click / hover
        //   expandTrigger: 'click',
        //   lazyLoad: this.lazyLoad
        // }
      };
    },
    watch: {
      value(val, oleV) {
        var that = this;
        if (val != undefined && oleV != undefined && f2grid_global_mainVueLoadComplated) {
          this.$emit('updatevalue', that.field, val);
        }
      }
      ,fieldvalue: {
        handler(newV, oleV) {
          var that = this;
          if (newV != undefined && oleV != undefined && f2grid_global_mainVueLoadComplated) {
            that.value = newV;
          }
        },
        immediate: false
      }
    },
    mounted() {
      
    },
    created: function () {
      var that = this;
      var formAction = WFContext.WorkflowformAction;
      that.isView = formAction > 2;
      if (that.isView) {
        that.isReadOnly = true;
      } else if (that.field._isReadOnly == true) {
        that.isReadOnly = true;
      }
      that.initailFieldOption();
      that.value = that.fieldvalue;
      console.log("value===:",that.value);
      that.calcValue = that.value;
      if (that.field.inputCtrlOption) {
        var json = typeof that.field.inputCtrlOption === 'object' ? that.field.inputCtrlOption : eval('(' + that.field.inputCtrlOption + ')');
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
      //FUI.F2Grid.excuteFieldWritePowerByVueFormItem(that);
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
        var defalutRootValue = "";
        var casccode = that.code;
        if (that.parms) {
          if (that.parms.cascRootValue != '') {
            defalutRootValue = that.parms.cascRootValue;
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
            data = data || [];
            clearTimeout(that.timeout);
            that.timeout = setTimeout(function () {
              callback(data || []);
            }, 200);
          }
        });
      },
      // 点击时触发
      change(expandArr) {
        var that = this;
        const expandStr = expandArr.join('/');
        //获取选中的文本
        that.value = that.$refs.myCascader.getCheckedNodes()[0].pathLabels.join('/');
        //that.calcValue = [];
        that.parms = !that.parms ? {
          cascValueField:{}
        } : that.parms;
        if (that.parms && that.parms.cascValueField) {
          var cascValueField = that.parms.cascValueField;
          this.$emit('updatevalue', cascValueField, that.calcValue.toString());
        }
        that.onBlur();
      },
      onBlur() {
        var that = this;
        var fieldDef = that.field;
        var fieldValue = that.value;
       
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
          console.info("that.parms55555===：",that.parms);
          window[funcName](fieldValue, that.field, parms);
        }
        //================================================
      }
    }
  }
</script>