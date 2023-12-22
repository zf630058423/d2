<template>
  <div class="f2bpm-page-layout" style="line-height: 30px;padding: 20px;font-size: 14px;">
    <div>
      <div style="height: 30px;background-color: rgb(125, 177, 177);color: #FFFFFF;line-height: 30px;padding-left: 10px;">Java虚拟机内存使用情况</div>
      <div>
        Java虚拟机最大可用内存：<span v-html="data.jvmMaxMemory" />MB
      </div>
      <div>
        Java虚拟机中的已用内存：<span v-html="data.jvmTotalMemory" />MB
      </div>
      <div>
        JVM虚拟机剩余可用内存： <span v-html="data.jvmFreeMemory" />MB
      </div>
      <div>
        JVM虚拟机实际剩余可用内存： <span v-html="data.jvmRealFreeMemory" />MB
      </div>
      <div>
        JVM虚拟机当前线程数量： <span v-html="data.jvmTotalThread" />
      </div>

      <div style="height: 30px;background-color: rgb(125, 177, 177);color: #FFFFFF;line-height: 30px;padding-left: 10px;">操作系统内存使用情况</div>
      <div>
        服务器总内存：<span v-html="data.totalMemorySize" />GB
      </div>
      <div>
        服务器已用内存：<span v-html="data.usedMemory" />GB
      </div>
      <div>
        服务器剩余可用内存：<span v-html="data.freePhysicalMemorySize" />GB
      </div>
    </div>
  </div>
</template>

<script>

  export default {
    data() {
      return {
        loading: false,
        formAction: null,
        treeData: [],
         data: {
          jvmMaxMemory: 0,
          jvmFreeMemory: 0,
          jvmTotalMemory: 0,
          jvmRealFreeMemory: 0,
          jvmTotalThread: 0,
          totalMemorySize: 0,
          usedMemory: 0,
          freePhysicalMemorySize: 0

        }
      }
    },
    created: function() {
      var that = this
      that.formAction = formAction
      that.load()
    },
    methods: {

      closeEdit() {
        FUI.Window.closeEdit()
      },
       load() {
        var that = this
        var res = Object.toAjaxJson('/workflow/security/register/', 'getJvmRuntimeInfo')
        if (res.success) {
          that.data = res.data
        } else {
          FUI.Window.showMsg(res.msg)
        }
      },
       submitForm() {
        var that = this
        var success = that.validateForm('formRef')
        if (!success) return
        FUI.Form.submitForm(that, that.data, FUI.Handlers.FuiFrameworkHandler, FUI.Method.AutoSaveMethod, formAction, keyId, parentGridId, mainTable)
      }

    }
  }
</script>
