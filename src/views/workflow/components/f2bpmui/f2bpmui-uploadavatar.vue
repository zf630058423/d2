<template>
  <div>
    <el-upload name="fileUpload" :class="uploaderclass" :action="postUrl" :data="parms" :accept="accept" :headers="headers" :on-success="handleSuccess" :multiple="isMultiple" :show-file-list="false" :on-exceed="handleExceed">
      <img v-if="haveData" :width="thewidth" :src="value" class="avatar"/>
      <i v-if="!haveData" class="el-icon-plus avatar-uploader-icon"></i>
    </el-upload>
    <i class="fa fa-trash-o cur" v-if="haveData" @click="handleRemove">删除</i>
  </div>
</template>
<script>
  export default {
    name: 'f2bpmuiUploadavatar',
    // field*:字段名
    // fieldvalue*：字段值
    // width：图片显示宽度默认值180px
    // imgtype:图片类型：png,jpg默认
    props: ['field', 'fieldvalue','readOnly', 'width', 'imgtype'],
    data: function () {
      return {
        // f2bpmui-avatar-uploader 头像
        uploaderclass: '',
        isReadOnly: false,
        headers: {},
        // 上传时附带的额外参数
        parms: { imgtype: 'jpg' },
        uploadDisabled: false,
        thewidth: '180px',
        // 是否支持多选文件
        isMultiple: false,
        accept: '.jpg,.gif,.jpeg,.bmp,.png',
        tip: '',
        postUrl: __serverpath + FUI.Handlers.Common + 'uploadImageData/',
        haveData: false,
        // base64的图片数据
        value: ''
      }
    },
    watch: {
      value(val, oleV) {
        var that = this
        if (val !== undefined && oleV !== undefined) {
          this.$emit('updatevalue', that.fieldName, val)
        }
      }
    },
    created: function () {
      var that = this
      var author = this.$store.state.user.author
      var f2bpmToken = author.token
      var headerAuthor = { 'f2bpmToken': f2bpmToken }
      that.headers = headerAuthor
      that.haveData = false
      that.uploaderclass = 'f2bpmui-avatar-uploader'
      if (that.fieldvalue && that.fieldvalue.length > 0) {
        that.value = that.fieldvalue
        that.haveData = true
      }
      if (!that.width) {
        // 默认值180px
        that.thewidth = '180px'
      }
      if (that.imgtype) {
        that.parms.imgtype = that.imgtype
      }
      if (that.readOnly != undefined&&that.readOnly!=null) {
        that.isReadOnly = that.readOnly;
      }
    }, 
    mounted() {
    },
    methods: {
      handleSuccess(response, file, fileList) {
        var that = this
        if (response.success === true) {
          that.value = response.data
          that.haveData = true
        } else {
          FUI.Window.showMsg2(response.msg)
        }
      },
      handleError(err, file, fileList) {
      },
      handleRemove() {
        var that = this
        that.value = ''
        that.haveData = false
      },
      handleExceed(files, fileList) {
        
      },
      beforeRemove(file, fileList) {
        var that = this
        if (that.isReadOnly) {
          return false
        }
        return this.$confirm(`确定删除 ${file.name}？`)
      },
      handlePreview(file) {
      }

    }
  }
</script>