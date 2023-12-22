<template>
  <el-autocomplete :disabled="isReadOnly" class="textBoxShort" size="small" v-model="value" :name="field.fieldName" :clearable="clearable" :trigger-on-focus="triggerOnFocus" placeholder="输入搜索关键字" :fetch-suggestions="querySearchAsync" @select="handleSelect"></el-autocomplete>
</template>
<script>
  export default {
    name: 'f2bpmuiAutocompleter',
    components: {},
    props: ['field', 'fieldvalue','readOnly'],
    data: function () {
      return {
        isReadOnly: false,
        value: '',
        // 数据服务的编码
        code: '',
        // 就否多选
        isMulti: false,
        // 选中项的回邦到表单字段的配置{title:,property:,field:}
        fieldbind: [],

        // 是否在输入框 focus 时显示建议列表
        clearable: false,
        triggerOnFocus: false,
        timeout: null
      }
    },
    watch: {
      fieldvalue: {
        handler(newVal, oldVal) {
          if (newVal != this.value && newVal != oldVal && oldVal != undefined) {
            this.value = newVal;
          }
        },
        deep: true,
        immediate: false
      },
      value(val, oldVal) {
        var that = this
        if (val != undefined) {
          this.$emit('updatevalue', that.field.fieldName, val)
        }
      }
    },
    created: function () {
      var that = this
      that.initailFieldOption();
      that.value = that.fieldvalue;
      if (that.readOnly!=undefined&&that.readOnly!=null) {
        that.isReadOnly = that.readOnly;
      }
    },
    methods: {
      initailFieldOption() {
        var that = this;
        if (that.field.itemRender && that.field.itemRender.props) {
          if (that.field.itemRender.props.code) {
            that.code = that.field.itemRender.props.code;
          }
          if (that.field.itemRender.props.parm) {
            var json = eval('(' + that.field.itemRender.props.parm + ')');
            if (json.isOnFocusToSearch == true) {
              that.triggerOnFocus = true;
            }
          }
        } else if (that.field.inputCtrlOption) {
          var json = typeof that.field.inputCtrlOption === 'object' ? that.field.inputCtrlOption : eval('(' + that.field.inputCtrlOption + ')')
          that.code = json.data.code
          if (json.data.isMulti == 'true' || json.data.isMulti == true) {
            that.isMulti = true
          }
          that.fieldbind = json.data.fieldbind;
          if (that.field.fieldOptions) {
            var fieldOptions = typeof that.field.fieldOptions === 'string' ? eval('(' + that.field.fieldOptions + ')') : that.field.fieldOptions
            var general = fieldOptions.find(a => a.opttype == 'general')
            if (general) {
              var kvData = general.params.kvData
              var item = kvData.find(a => a.key == 'clearable')
              if (item) {
                that.clearable = item.value
              }
            }
          }

        }
      },
      querySearchAsync(searchKey, callback) {
        searchKey = Object.toTrim(searchKey);
        if (searchKey == '') {
          callback([]);
          return false;
        }
        var that = this
        var url = '/workflow/security/autocompleter/'
        var parms = { 'autocode': that.code, 'searchKey': searchKey, 'parentValue': '', 'topN': 0 }
        var res = Object.toAjaxJson(url, 'getAutoCompleterListJson', parms, true, null, function (data) {
          if (data.success == false) {
            FUI.Window.showMsg2(null, data.msg);
          }
          console.info(data)
          if (that.timeout) {
            clearTimeout(that.timeout);
          }
          that.timeout = setTimeout(function () {
            callback(data);
          }, 1000 * Math.random());
        })
      },
      handleSelect(selectItem) {
        var that = this;
        // 自身值that.value=item.value;
        that.bindMultResultListToTarget(selectItem);
      },
      bindMultResultListToTarget(selectItem) {
        // 绑定其它属性值到目标字段
        var that = this;
        var _isMult = that.isMulti;
        // {title:,property:,field:}
        if (that.fieldbind && that.fieldbind.length > 0) {
          $.each(that.fieldbind, function (i, item) {
            var proname = Object.toTrim(item.property)
            var pval = selectItem[proname];
            var tofieldName = item.field;
            if (tofieldName != that.field.fieldName && pval != '' && pval != null && pval != undefined) {
              if (_isMult === true) {
                that.$emit('appendfieldvalue', tofieldName, pval);
              } else {
                that.$emit('updatevalue', tofieldName, pval);
              }
            }
          })
        }
      }
    }
  }
</script>