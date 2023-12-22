<template>
  <el-upload 
   :id="uploadId"
   :vModel="field.field"
   name="fileUpload"
    class="upload-demo"
    :action="postUrl"
    :data="parms"
   :accept="accept"
    :headers="headers"
    :on-success="handleSuccess"
    :on-change="handleLimit"
    :on-preview="handlePreview"
    :on-remove="handleRemove"
    :before-remove="beforeRemove"
    :multiple="isMultiple"
    :limit="limit"
    :on-exceed="handleExceed"
    :file-list="showData">
    <el-button size="small" type="primary" v-if="!isReadOnly&&!uploadDisabled">点击上传</el-button>
    <div slot="tip" class="el-upload__tip">{{tip}}</div>
  </el-upload> 
</template>

<script>
  export default {
    name: 'f2bpmuiFile',
    props: ['field', 'fieldvalue','readOnly'],
    data: function () {
      return {
        uploadId:"01",
        isView: false,
        isShow: true,
        isReadOnly: false,
        headers: {},
        // 上传时附带的额外参数
        parms: {},
        uploadDisabled: false,
        limit: 99,
        // 是否支持多选文件
        isMultiple: true,
        accept: '.wmv,.avi,.rm,.mp4,.ppt,.pptx,.docx,.xlsx,.jpg,.gif,.jpeg,.bmp,.png,.doc,.xls,.pdf,.rar,.zip,.txt,.ppt,.rtf,.bak,.sql',
        tip: '',
        postUrl: __serverpath +FUI.Handlers.Common + 'uploadFile/',
        // 最终保存到数据库的格式 [filePathName:'2020/08/20200814171353896_5789_.jpg',fileName:'yd4.jpg',groupName:'testGroup']
        value: [],
        // 用于显示的原el的数据格式 例如: [{name: 'food.jpg', url: 'https://xxx.cdn.com/xxx.jpg',其它任意属性}]
        showData: []

      }
    },
    watch: {
      value(val, oleV) {
        var that = this
        if (val != undefined && oleV != undefined) {
          var valJson=JSON.stringify(val);
          this.$emit('updatevalue', that.field.fieldName,  valJson);
        }
      }
    },
    created: function () {
      var that = this
      that.uploadId="upload_"+Object.toGuid();
      var author = this.$store.state.user.author
      var f2bpmToken = author.token
      var headerAuthor = { 'f2bpmToken': f2bpmToken }
      that.headers = headerAuthor
      if (that.readOnly != undefined&&that.readOnly!=null) {
        that.isReadOnly = that.readOnly;
        that.isView= that.readOnly;
      }
      that.initailFieldOption()
      if (that.fieldvalue && that.fieldvalue.length > 0) {
        that.value = typeof that.fieldvalue === 'string' && that.fieldvalue != '' ? eval('(' + that.fieldvalue + ')') : that.fieldvalue
        that.reloadShowFileList()
      }
      if (that.field.fieldOptions) {
        // 可配置上传的更多属性
      }
    }, mounted() {
      var that = this
        if (that.value.length >= that.limit) {
          $(".el-upload",$("#"+that.uploadId)).hide();
        } else {
          $(".el-upload",$("#"+that.uploadId)).show();
        }
    },
    methods: {
      initailFieldOption() {
        var that = this
        if (that.field.fieldOptions) {
          var fieldOptions = typeof that.field.fieldOptions === 'string' ? eval('(' + that.field.fieldOptions + ')') : that.field.fieldOptions
          var general = fieldOptions.find(a => a.opttype == 'general')
          if (general) {
            var kvData = general.params.kvData
            var item = kvData.find(a => a.key == 'isMultiple')
            if (item) {
              that.isMultiple = item.value
            }
            item = kvData.find(a => a.key == 'uploadtip')
            if (item) {
              that.tip = item.value
            }
            item = kvData.find(a => a.key == 'uploadextension')
            if (item && item.value) {
              that.accept = item.value
            }
            item = kvData.find(a => a.key == 'uploadlimit')
            if (item && item.value > 0) {
              that.limit = item.value
            }
          }
        }
      },
      handleLimit(file, fileList) {
        var that = this
        if (fileList.length >= that.limit) {
          that.uploadDisabled = true;
          
        } else {
          this.uploadDisabled = false;
        }
      },
      handleSuccess(response, file, fileList) {
        var that = this
        if (response.success === true) {
          var valueItem = Object.toClone(response.data)
          that.value.push(valueItem)

          var item = response.data
          item.name = item.fileName
          that.showData.push(item)
        } else {
          FUI.Window.showMsg2(response.msg)
          that.handleRemove(file, fileList)
        }
        // console.log(file);
        // console.log(fileList);
      },
      handleError(err, file, fileList) {
        console.log(response)
        console.log(file, fileList)
      },
      handleRemove(file, fileList) {
        var that = this
        var filePathName = file.filePathName
        that.value = that.value.filter(a => a.filePathName != filePathName)
        that.reloadShowFileList()
      },
      handleExceed(files, fileList) {
        // 文件超出个数限制时的钩子
        this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
      },
      beforeRemove(file, fileList) {
        var that = this
        if (that.isReadOnly) {
          return false
        }
        return this.$confirm(`确定删除 ${file.name}？`)
      },
      handlePreview(file) {
        var that = this
        that.formDownloadFile(file)
      },
      reloadShowFileList() {
        var that = this
        var showData = []
        $.each(that.value, function (index, item) {
          var showItem = Object.toClone(item)
          showItem.name = item.fileName
          showData.push(showItem)
        })
        that.showData = showData
        that.showData = showData
        if (that.showData.length >= that.limit) {
          this.uploadDisabled = true
        } else {
          this.uploadDisabled = false
        }
      },
      formDownloadFile(file) {
        var filePath = file.filePathName
        var groupName = file.groupName
        var fileName = file.fileName
        var actionUrl = FUI.Handlers.Common
        var data = Object.toAjaxDownloadFile(actionUrl, 'downloadFile', { 'filePath': filePath, 'fileName': fileName, 'groupName': groupName })
      }
    }
  }
</script>