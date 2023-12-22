<template>
  <div class="f2bpm-page-dialog-layout">
    <el-form ref="formRef" size="mini" class="f2bpm-editform font10" label-width="110px">
      <el-form-item v-for="item in data" :label="item.activityName">
        <div><span class="fb">操作按钮：</span><span v-for="btn in item.buttons" class="cube bg-blue mr2 font10">{{ btn.ButtonName }}</span> </div>
        <div style="text-align: left;font-weight: bold;">参与者</div>
        <div class="font10">{{ item.todoActor }}</div>
        <div class="font10">{{ item.todoCirculatedActor }}</div>
        <div class="font10">{{ item.assistActor }}</div>
        <div><span class="fb">自动传阅：</span> {{ item.autoCirculated }}</div>
        <div><span class="fb">驳回方式：</span>{{ item.rejectType }} <span v-for="a in item.rejectActs" class="cube bg-blue mr2 font10">{{ a.activityName }}</span> </div>
        <div><span class="fb">高级属性-常规：</span>  </div>
      </el-form-item>
    </el-form>
    <div class="dialogfooter">
      <a role="button" href="javascript:void(0)" class="btn  btn-sm btn-default " @click="closeEdit"><i class="fa fa-minus-circle" />关闭</a>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        data: []
      }
    },
    created: function() {
      var that = this
      var wid = Object.toQueryString('wid')
      var res = Object.toAjaxJson('/workflow/processDef/', 'configurationCheckView', { 'wid': wid })
      if (res.success) {
        that.data = res.data
      }
    },
    methods: {
      closeEdit() {
        FUI.Window.closeEdit()
      }
    }
  }
</script>
