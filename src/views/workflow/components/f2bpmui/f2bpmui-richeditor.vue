<template>
  <textarea v-model="value" :richeditorContainer="field.vModel" :toolbarsType="toolbarsType" :richeditorContainerType="richeditorType" :id="richeditorId" :field="field.vModel" :style="theStyle"></textarea>
</template>

<script>
  export default {
    name: 'f2bpmuiRicheditor',
    components: {},
    props: ['field', 'fieldvalue','readOnly'],
    data: function () {
      return {
        fieldName:"",
        toolbarsType: 'minToolbars',
        richeditorType: 'richeditor',
        richeditorId: '',
        theStyle: '',
        width: '',
        height: '',
        value: '',

        isReadOnly: false
      }
    },
    watch: {
      field: {
        handler(n, o) {
          this.initail()
        },
        deep: true,
        immediate: false
      },
      value(val, oleVal) {
        var that = this
        if (val != undefined) {
          this.$emit('updatevalue', that.fieldName, val)
        }
      }
    },
    mounted() {
      var that = this
      that.richeditor()
    },
    created: function () {
      var that = this
      that.initail()
      that.value = that.fieldvalue;
      if (that.readOnly != undefined&&that.readOnly!=null) {
        that.isReadOnly = that.readOnly;
      }
    },
    methods: {
      initail() {
        var that = this
        var json ={};
        if (that.field.inputCtrlOption&&that.field.inputCtrlOption!="{}") {
           json = typeof that.field.inputCtrlOption === 'object' ? that.field.inputCtrlOption : eval('(' + that.field.inputCtrlOption + ')')
        }else if(that.field.itemRender&&that.field.itemRender.props&&that.field.itemRender.props.toolbarsType){
          json = that.field.itemRender.props;
        }
        if(typeof that.field=='string'){
          that.fieldName=that.field;
        }else{
          that.fieldName=that.field.fieldName;
        }
   
        that.toolbarsType = json.toolbarsType || 'minToolbars'
        that.richeditorId = 'richeditor_' + Object.toGuid(false)
        var width = json.width
        if (width == 0) {
          that.width = 'width:100%;'
        } else {
          that.width = 'width:' + width + 'px;'
        }
        var height = json.height || 200
        if (height == 0) {
          height = 200
        }
        that.height = 'height:' + height + 'px;'
        that.theStyle = that.width + that.height
      },
      richeditor: function () {
        var that = this
        var defaultvalue = that.field.defaultvalue || ''
        var width = that.width == '' ? '900px' : that.width
        var height = that.height == '' ? '900px' : that.height
        var richeditorType = that.richeditorType
        var richeditorId = that.richeditorId
        var toolbarType = that.toolbarsType || 'minToolbars'
        if (that.isReadOnly) {
          // 不可编辑时直接显示富文本内容(将富文本容器替换成内容)
          var initailHtml = that.value
          if (richeditorType == 'richeditorofficial') {
            $('#' + richeditorId).replaceWith('<div id="' + richeditorId + '" style="' + width + 'margin-left:auto;margin-right:auto; position: relative">' + initailHtml + '</div>').remove()
          } else {
            $('#' + richeditorId).replaceWith('<div id="' + richeditorId + '" style="' + width + 'margin-left:auto;margin-right:auto;">' + initailHtml + '</div>').remove()
          }
        } else {
          var toolbarsJson = window.UEDITOR_CONFIG[toolbarType]
          // 将富文本容器转为UEditor编辑器
          var editorItem = { name: that.field.fieldName, editor: null }
          setTimeout(function () {
            editorItem.editor = UE.getEditor(richeditorId, { toolbars: toolbarsJson })
            editorItem.editor.autoHeightEnabled = false
            // richeditorArr变量放在index.html全局中
            richeditorArr.push(editorItem)
            var initailHtml = that.value
            if (initailHtml) {
              setTimeout(function () {
                editorItem.editor.setContent(initailHtml)
              }, 500)
            }
          }, 500)
        }
      }
    }
  }
</script>