<template>
  <FuiDialog :visible="visible" :title="title" :is-bottom="true" :confirm-text="confirmText" @on-cancel="close" @on-confirm="onConfirm">
    <el-form class="form-box">
      <el-form-item label="上传文件：">
        <el-button type="primary" size="small" class="button">选择文件<input class="input-file" type="file" @change="changeFile"></el-button>
        {{ fileName }}
      </el-form-item>
      <div style="line-height: 25px;font-size: 12px;">
        <em>导入说明：</em>
        <br>
        Excel文件必须是office2010版及以上,只能上传.xlsx文件;
        <br>
        Excel内容上不允许有公式，函数，宏脚本、控件、组件等，必须是纯文本内容。
      </div>
      <div><span class="dowloadFile" @click="downloadExcelTemplate"><i class="icon icon-Controls-82"></i> 点击下载Excel模板</span></div>
    </el-form>
  </FuiDialog>
</template>
<script>
import FuiDialog from '@/components/basic/FuiDialog/index.vue';
// import { downloadTemplateFile, importDataDetails } from '@/Api/workflowBusssion/index.js'
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
      default: '数据导入'
    },
    confirmText: {
      type: String,
      default: '确定导入'
    },
    //下载模版的key  后台管理 测试-通用模版 模版关键字
    keyword: {
      type: String,
      default: ''
    },
    //上传文件的url
    uploaderUrl: {
      type: String,
      default: ''
    },
    //接口调用成功后提示信息
    successText: {
      type: String,
      default:'导入成功'
    },
    // 导入传入额外的参数
    importParams: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      fileName: '',
      file: {}
    }
  },
  methods: {
    changeFile(e) {
      const { name } = e.target.files[0];
      if (name.indexOf('.xlsx') === -1) {
        return
      }
      this.fileName = name;
      this.file = e.target.files[0];
      e.target.value = null
    },
    close() {
      this.fileName = '';
      this.$emit('update:visible', false);
    },
    async onConfirm() {
      if (!this.fileName) { 
        this.$message.error("请选择上传文件");
        return false;
      }
      // const res = await importDataDetails(this.uploaderUrl, { file: this.file, ...this.importParams })
      // if (res.code === 200) {
      //   this.$message.success(this.successText)
      //   this.$emit('importSuccess', res.data)
      // } else {
      //   this.$message.error(res.msg)
      // }
    },
    async downloadExcelTemplate() {
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
</style>
