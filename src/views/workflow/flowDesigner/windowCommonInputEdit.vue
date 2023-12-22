<template>
  <div class="f2bpm-page-layout">
    <div style="padding: 5px;">
      <div>
        <span v-html="nameText" />
        <div class="space-4" />
        <el-input v-model="content" type="textarea" :rows="4" />
        <div class="space-4" />
        <span v-if="isdescription" v-html="description" />
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

        description: '',
        isdescription: false,
        nameText: '',
        content: ''

      }
    },
    created: function() {
      var that = this
      var obj
      var wid
      var attrName
      var value
      obj = parent.window.currentWindowTargetObjectValue
      var title = obj.title
      value = obj.value
      attrName = obj.name
      wid = obj.otherParm
      that.content = value
      that.attrName = attrName
      if (title.indexOf('子流程实现类') > -1) {
        that.isdescription = true
        that.nameText = title + 'Assembly：'
        that.description = '  格式：[带包路径名的类全名]</br>填写示例：com.f2bpm.demo.customExtension.SubWorkflowDemo'
      } else if (title.indexOf('消息模板') > -1) {
        that.isdescription = true
        that.nameText = title + '设置：'
        that.description = '消息通知格式通配符：【单号：#SheetId#】【标题：#Title#】【发起人：#Creator#】【当前环节：#CurrentActivity#】【任务接收人者：#TaskRealName#】【系统网址：#WebUrl#】'
      } else {
        that.nameText = title
      }
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
