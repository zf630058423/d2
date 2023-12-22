<template>
  <textarea v-model="value" :richeditorContainer="field.vModel" :toolbarsType="toolbarsType" :richeditorContainerType="richeditorType" :id="richeditorId" :field="field.vModel" :style="theStyle"></textarea>
</template>

<script>
  export default {
    name: "f2bpm-richeditor",
    components: {},
    // dataself:数据对象自己，可能是主表的data，也可能是子列表的某行data对象，子列表时必传此值
    props: ['field', 'fieldvalue', 'dataself', 'rowindex', 'colindex'],
    data: function () {
      return {
        isView: false,
        isShow: true,
        isReadOnly: false,
        data: {},
        toolbarsType: 'minToolbars',
        richeditorType: 'richeditor',
        richeditorId: '',
        theStyle: '',
        width: '',
        height: '',
        value: ''
      };
    },
    watch: {
      field: {
        handler(n, o) {
          this.initail();
        },
        deep: true,
        immediate: false
      },
      value(val, oleV) {
        var that = this;
        if (val != undefined && oleV != undefined && f2grid_global_mainVueLoadComplated) {
          this.$emit('updatevalue', that.field, val);
        }
      }
    },
    mounted() {
      var that = this;
      that.data = that.dataself;
      //FUI.F2Grid.excuteFieldWritePowerByVueFormItem(that);
      that.richeditor();
    },
    created: function () {
      var that = this;
      that.initail();
      that.value = that.fieldvalue;
      var formAction = WFContext.WorkflowformAction;
      that.isView = formAction > 2;
      if (that.isView) {
        that.isReadOnly = true;
      } else if (that.field._isReadOnly == true) {
        that.isReadOnly = true;
      }
    },
    methods: {
      initail() {
        var that = this;

        if (that.field.inputCtrlOption) {
          var json = typeof that.field.inputCtrlOption === 'object' ? that.field.inputCtrlOption : eval('(' + that.field.inputCtrlOption + ')');
          that.toolbarsType = json.toolbarsType;
        }
        that.richeditorId = 'richeditor_' + Object.toGuid(false);
        var width = that.field.width;
        if (width == 0) {
          that.width = 'width:100%;';
        } else {
          that.width = 'width:' + width + 'px;';
        }
        var height = that.field.height || 200;
        if (height == 0) {
          height = 200;
        }
        that.height = 'height:' + height + 'px;';
        // that.theStyle = that.width + that.height + 'margin-left:auto;margin-right:auto;position:relative';
        that.theStyle = that.width + that.height;
      },
      richeditor: function () {
        var that = this;
        if (WFContext.isDesign == true || that.isShow == false) {
          return false;
        }
        var defaultvalue = that.field.defaultvalue || '';
        var width = that.width == '' ? '900px' : that.width;
        var height = that.height == '' ? '900px' : that.height;
        var richeditorType = that.richeditorType;
        var richeditorId = that.richeditorId;
        var toolbarType = that.toolbarsType || 'minToolbars';
        if (that.isReadOnly) {
          // 不可编辑时直接显示富文本内容(将富文本容器替换成内容)
          var initailHtml = that.value;
          if (richeditorType == 'richeditorofficial') {
            $('#' + richeditorId).replaceWith('<div id="' + richeditorId + '" style="' + width + 'margin-left:auto;margin-right:auto; position: relative">' + initailHtml + '</div>').remove();
          } else {
            $('#' + richeditorId).replaceWith('<div id="' + richeditorId + '" style="' + width + 'margin-left:auto;margin-right:auto;">' + initailHtml + '</div>').remove();
          }
        } else {
          var toolbarsJson = window.UEDITOR_CONFIG[toolbarType];
          // 将富文本容器转为UEditor编辑器
          var editorItem = { name: that.field.vModel, editor: null };
          setTimeout(function () {
            editorItem.editor = UE.getEditor(richeditorId, { toolbars: toolbarsJson });
            editorItem.editor.autoHeightEnabled = false;
            var arr = that.field.vModel.split('.');
            if (arr.length >= 3) {
              editorItem.dataSelf = that.data;
            }
            // richeditorArr变量放在index.html全局中,可修改xss.js中的getDefaultWhiteList来修改期过滤规则
            richeditorArr.push(editorItem);
            var initailHtml = that.value;
            if (initailHtml) {
              setTimeout(function () {
                try {
                  editorItem.editor.setContent(initailHtml);
                } catch (e) {
                }
              }, 1000);
            }
          }, 800);
        }
      }
    }
  }
</script>