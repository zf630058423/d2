<template>
  <FuiDialog :visible="visible" :title="title" :is-bottom="true" :confirm-text="confirmText" @on-cancel="close" @on-confirm="onConfirm">
    <el-form class="form-box">
      <el-form-item label="上传附件：">
        <el-button type="primary" size="small" class="button">选择文件<input class="input-file" type="file" @change="changeFile"></el-button>
        {{ fileName }}
      </el-form-item>
      <div style="line-height: 25px;font-size: 12px;margin-top: 8px;">
        图片格式支持：'.png', '.jpg', '.jpeg', '.gif', '.bmp 格式 ，单个文件大小1.95M以内； 文件格式支持：'.png', '.jpg', '.jpeg', '.gif', '.bmp','.flv', '.swf', '.mkv', '.avi', '.rm', '.rmvb', '.mpeg', '.mpg', '.ogg', '.ogv', '.mov', '.wmv', '.mp4', '.webm', '.mp3', '.wav', '.mid','.rar', '.zip', '.tar', '.gz', '.7z', '.bz2', '.cab', '.iso','.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx', '.pdf', '.txt', '.md', '.xml' 单个文件大小50M以内！
      </div>
      <!-- <div><span class="dowloadFile" @click="downloadExcelTemplate"><i class="icon icon-Controls-82"></i> 点击下载Excel模板</span></div> -->
    </el-form>
  </FuiDialog>
</template>
<script>
/**
 * 更新附件 组件
 */
import FuiDialog from '@/components/basic/FuiDialog/index.vue';
// import { downloadTemplateFile, updateFile } from '@/Api/workflowBusssion/index.js'
export default {
  components: {
    FuiDialog
  },
  props: {
    //是否展示当前的控件
    visible: {
      type: Boolean,
      default: false
    },
    //弹框的标题
    title: {
      type: String,
      default: '更新附件'
    },
    confirmText: {
      type: String,
      default: '确认'
    },
    //下载模版的key  后台管理 测试-通用模版 模版关键字
    keyword: {
      type: String,
      default: ''
    },
    //更新附件的id
    fileId: {
      type: String,
      default: ''
    },
    //上传文件的url
    uploaderUrl: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      fileName: '',
      file: {},
      fileInfo: {
        fileFormat: '',  //文件格式
        fileMark: '',  //文件标记
        fileName: this.fileName,  //文件名
        filePathName: '',  //文件路径
        fileSize:'',  //文件大小
      },
      fileInfoList:[]
    }
  },
  methods: {
    changeFile(e) {
      console.log("e===:",e);
      const { name } = e.target.files[0];
      console.log("name===:",name);
      // if (name.indexOf('.xlsx') === -1) {
      //   return
      // }
      this.fileName = name;
      // let nameStr = name.substring(0, name.indexOf(','));
      let xls = name.substring(name.indexOf('.'), name.length)
      this.fileInfo.fileFormat = xls;
      this.fileInfo.fileName = name;
      this.file = e.target.files[0];
      e.target.value = null
    },
    close() {
      this.fileName = '';
      this.$emit('update:visible', false);
    },
    async onConfirm() {
      const dataParms = {
        id: this.fileId,
        fileInfoList: [
          this.fileInfo
        ]
      }
      // const res = await updateFile(this.uploaderUrl, dataParms)
      // if (res.code === 200) {
      //   this.$message.success('上传成功')
      //   this.$emit('updateFileSuccess', res.data)
      // } else {
      //   this.$message.error(res.msg)
      // }
    },
    async downloadExcelTemplate() {
      if (!this.fileName) { 
        this.$message.error("请选择上传文件");
        return false;
      }
      // await downloadTemplateFile(this.keyword)
    }
  }
}
</script>
<style lang="scss" scoped>
.form-box {
  padding: 30px;
  .button {
    position: relative;
  }
  .input-file{
    position: absolute;
    left: 0;
    width: 98px;
    opacity: 0;
  }
  .dowloadFile{
    color: blue;
    margin-top: 30px;
    cursor: pointer;
    display: block;
  }
}

::v-deep .el-form-item{
  margin-bottom: 0;
}
</style>
