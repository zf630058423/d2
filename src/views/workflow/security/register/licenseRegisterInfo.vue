<template>
  <div class="f2bpm-page-layout">
    <div id="RegisteredMachineCode" style="text-align: left; padding: 50px; font-size: 12px;">
      <div style="line-height: 30px;">
        您好：感谢您使用的F2BPM产品， {{ data.message }}请复制下面的注册机器码，并提交到指定的官网邮箱联系我们进行注册，以免影响您正常使用。
      </div>
      <table class="common-FormTable" cellpadding="0" cellspacing="0">
        <tr>
          <td class="leftTdbg">注册系统名称：</td>
          <td>{{ data.currentSystemName }}</td>
        </tr>
        <tr>
          <td class="leftTdbg">注册系统编码：</td>
          <td>{{ data.currentReleaseName }}</td>
        </tr> 
        <tr>
          <td class="leftTdbg">注册授权信息：</td>
          <td>
            <div v-html="registeredInfo" />
          </td>
        </tr>
        <tr>
          <td class="leftTdbg">注册机器码HID：</td>
          <td style="padding: 5px;">
            <el-input size="small" class="textAutoBoxLong75" style="width: 75%;" :value="data.machineCode" />
            <a class="cur ml10" href="javascript:void(0)" @click="downFile"><i class="fa fa-download" />下载机器码</a>
          </td>
        </tr>
         
      </table>
      <div style="line-height: 30px;margin-bottom: 10px;">
        1、请核对以上注册信息是否正确，“当前管理系统”必须与配置文件中的“授权系统”名称一致，如有疑问请联系作者。 <br>
        2、请将机器码提交到邮箱：f2bpm@f2bpm.com 或联系 QQ：1827528476索取注册授权文件。
      </div>
      <div>
        <a href="javascript:void(0)" 　class="fa fa-search" @click="showJVMInfo">查看JVM资源信息</a> 
        <br> <br>{{data.updatePackage}}
      </div>
      <div style="margin-top: 20px;">
        <span style="display:  block;height:30px;">上传授权文件：</span>
        <el-upload
          ref="upload"
          name="fileUpload"
          :limit="1"
          :headers="headers"
          :action="postUrl"
          :multiple="false"
          :data="data"
          accept=".*"
          :before-upload="beforeUpload"
          :on-success="onSuccess"
          :auto-upload="false"
          :on-error="onError"
        >
          <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
          <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">确定上传
          </el-button>
          <div slot="tip" class="el-upload__tip" />
        </el-upload>
        <a href="javascript:void(0)" @click="showHardWareInfo">.</a>

      </div>
    </div>
  </div>
</template>

<script>
  export default { data() {
      return {
        postUrl: __serverpath + '/workflow/security/register/uploadLicense',
        headers: {},
        postData: {},
        registeredInfo: '',
        data: {
          machineCode: '',
          message: '',
          currentSystemName: '',
          currentReleaseName:"",
          updatePackage:""
        }
      }
    },
    created() {
      var that = this
      that.load()
      var author = that.$store.state.user.author
      var f2bpmToken = author.token
      this.headers = { 'f2bpmToken': f2bpmToken }
    },
     mounted() {
    },
    methods: {
      load() {
        var that = this
        var res = Object.toAjaxJson('/workflow/security/register/', 'getLicenseRegisterInfo')
        that.data = res.data
        if (that.data.currentRegisteredInfo.indexOf('激活成功') > -1) {
          that.registeredInfo = that.data.currentRegisteredInfo.replace('激活成功', "<span class='cube bg-gree'>激活成功</span>")
        } else if (that.data.currentRegisteredInfo.indexOf('激活失败') > -1) {
          that.registeredInfo = that.data.currentRegisteredInfo.replace('激活成功', "<span class='cube bg-grey'>激活失败</span>")
        } else {
          that.registeredInfo = that.data.currentRegisteredInfo
        }
      },
       submitUpload() {
        this.$refs.upload.submit()
      },
      beforeUpload() {
        return true
      },
       onSuccess(response, file, fileList) {
        var that = this
        FUI.Window.showMsg2(this, response.msg, null, response.success ? 1 : null, function() {
          window.location.reload()
        })
      },
       onError(error, file, fileList) {
        var that = this
        FUI.Window.showMsg(that, error)
      },
      copyToClipboard() {
        var that = this
        var machineCode = machineCode
        var isSuccess = Object.toCopyToClipboard(machineCode)
        if (isSuccess == true) { FUI.Window.showMsg2('机器码已成功复制到“剪贴板”') } else {
          FUI.Window.showMsg2('浏览器不支持，请手动复制注册机器码HID或者“点击下载成文件”')
        }
      },
       downFile() {
        Object.toAjaxDownloadFile('/workflow/security/register/', 'downLoadHidFile')
      },
       showHardWareInfo() {
        var data = Object.toAjaxJson('/workflow/security/register/', 'getHardWareInfo')
        FUI.Window.showMsg(data.msg, null, 1)
      },
       showJVMInfo() {
        window.location.href = __webpath + '/workflow/security/register/jvmRuntimeInfo'
      }
    }
  }
</script>
