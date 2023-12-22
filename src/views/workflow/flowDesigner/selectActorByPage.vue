<template>
  <div>
    <div style="padding: 5px;">
      <div>
        <b v-html="nameText" />
        <br>
        <el-input v-model="content" type="textarea" :rows="4" placeholder="" />
        <span v-if="isdescription" />
      </div>
    </div>
    <div class="dialogfooter">
      <a role="button" href="javascript:void(0)" class="btn btn-primary btn-sm mr2" @click="save()"><i class="fa fa-save" />确定</a>
      <a role="button" href="javascript:void(0)" class="btn  btn-sm btn-primary " @click="closeEdit()"><i class="fa fa-minus-circle" />取消</a>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        attrName: '',

        isdescription: false,
        nameText: '',
        content: ''

      }
    },
    created: function() {
      var obj
      var wid
      var attrName
      var value
      obj = parent.window.currentWindowTargetObjectValue
      var title = obj.title
      value = obj.value
      attrName = obj.name
      wid = obj.otherParm
      this.content = value
      this.attrName = attrName
    },
    methods: {
      // ===stand:标准化方法============
      closeEdit() {
        // stand:关闭编辑窗口
        FUI.Window.closeEdit()
      },
      // ===stand:标准化方法结束============
       save() {
        var that = this
        var content = that.content
        content = content.replace(/</g, '〈')
        FUI.Window.confirm('您确定要修改？', '温馨提示', function() {
          parent.setTargetValue(that.attrName, content)
          FUI.Window.closeEdit()
        })
      }
    }
  }
</script>
