<template>
  <div>
    <el-upload :class="{uoloadSty:showBtnImg,disUoloadSty:noneBtnImg}" :action="postUrl" list-type="picture-card" :data="parms" :file-list="showData" :headers="headers" :on-exceed="handleExceed" :on-success="handleSuccess" :vModel="field.field" :accept="accept" :multiple="isMultiple" :limit="limit" name="fileUpload" :auto-upload="true">
      <i slot="default" class="el-icon-plus"></i>
      <div slot="file" slot-scope="{file}">
        <img class="el-upload-list__item-thumbnail" :src="file.url" alt=""><span class="el-upload-list__item-actions">
          <span class="el-upload-list__item-preview" @click="handlePreview(file)">
            <i class="el-icon-zoom-in"></i>
          </span>
          <span v-if="!isReadOnly" class="el-upload-list__item-delete" @click="handleDownload(file)">
            <i class="el-icon-download"></i>
          </span>
          <span v-if="!isReadOnly" class="el-upload-list__item-delete" @click="handleRemove(file)">
            <i class="el-icon-delete"></i>
          </span>
        </span>
      </div>
    </el-upload>
    <el-dialog :visible.sync="dialogVisible"> <img width="100%" :src="dialogImageUrl" alt=""></el-dialog>
  </div>
</template>

<script>
  export default {
    name: 'f2bpmuiPicture',
    components: {},
    // field:{ field: 'articlePhotoPath', title: '上传图片', itemRender: { props: { limit: 1,parms:{pathType:'link'} } } }
    props: ['field', 'fieldvalue','readOnly'],
    data: function () {
      return {
        showBtnImg: true,
        noneBtnImg: false,
        isReadOnly: false,
        headers: {},
        // 上传时附带的额外参数,
        // 参数： pathType 业务路径类别,此类别由开发代码决定，会自动在附件的目录下创建此名称的业务目录，此参数由开发时的页面代码决定，上传与展示都在附带此参数，可为空
        parms: {},
        limit: 99,
        // 是否支持多选文件
        isMultiple: false,
        accept: '.jpg,.gif,.jpeg,.bmp,.png,.JPG,.JPEG,.PNG',
        tip: '只能上传jpg/png文件，且不超过500kb,上传提示的描述',
        postUrl: __serverpath + FUI.Handlers.Common + 'uploadFile/',
        // 最终保存到数据库的格式 [filePathName:'2020/08/20200814171353896_5789_.jpg',fileName:'yd4.jpg',groupName:'testGroup']
        value: [],
        // 用于显示的原el的数据格式 例如: [{name: 'food.jpg', url: 'https://xxx.cdn.com/xxx.jpg',其它任意属性}]
        showData: [],
        dialogImageUrl: '',
        dialogVisible: false,
        disabled: false
      }
    },
    watch: {
      value(val, oleVal) {
        var that = this;
        if (val != undefined) {
          this.$emit('updatevalue', that.field.fieldName, JSON.stringify(val));
        }
      }
    },
    mounted() {
      var that = this;
      that.autoIsShowAddUpload();
    },
    created: function () {
      var that = this;
      var author = this.$store.state.user.author;
      var f2bpmToken = author.token;
      var headerAuthor = { 'f2bpmToken': f2bpmToken };
      that.headers = headerAuthor;
      that.initailFieldOption();
      if (that.readOnly != undefined&&that.readOnly!=null) {
        that.isReadOnly = that.readOnly;
      }
      if (that.fieldvalue && that.fieldvalue.length > 0) {
        that.value = typeof that.fieldvalue === 'string' && that.fieldvalue != '' ? eval('(' + that.fieldvalue + ')') : that.fieldvalue
        that.reloadShowFileList();
      }
    },
    methods: {
      initailFieldOption() {
        var that = this
        if (that.field.fieldOptions) {
          //控件定义的属性
          var options = typeof that.field.fieldOptions === 'string' ? eval('(' + that.field.fieldOptions + ')') : that.field.fieldOptions
          var general = options.find(a => a.opttype == 'general');
          if (general) {
            var kvData = general.params.kvData;
            var item = kvData.find(a => a.key == 'isMultiple');
            if (item) {
              that.isMultiple = item.value;
            }
            item = kvData.find(a => a.key == 'uploadlimit');
            if (item && item.value != 0) {
              that.limit = item.value;
            }
            item = kvData.find(a => a.key == 'uploadextension');
            if (item && item.value) {
              that.accept = item.value;
            }

          }
        } else if (that.field.itemRender && that.field.itemRender) {
          //手工配置的属性
          var props = that.field.itemRender.props;
          if (props.isMultiple == true) {
            that.isMultiple = true;
          }
          if (props.limit) {
            that.limit = props.limit;
          }
          if (props.parms) {
            that.parms = props.parms;
          }
          if (props.accept) {
            that.accept = props.accept;
          }
        }

      },
      handleSuccess(response, file, fileList) {
        var that = this;
        if (response.success === true) {
          var valueItem = Object.toClone(response.data);
          that.value.push(valueItem);
          var pathType = that.parms.pathType || '';
          var item = response.data;
          var src = __serverpath + FUI.Handlers.Common + 'getShowImage/?pathType=' + pathType + '&groupName=' + item.groupName + '&filePath=' + item.filePathName;
          item.url = src;
          item.name = item.fileName;
          that.showData.push(item);
          that.reloadShowFileList();
        }
      },
      handleError(err, file, fileList) {
        console.log(response);
        console.log(file, fileList);
      },
      handleRemove(file) {
        var that = this;
        var filePathName = file.filePathName;
        that.value = that.value.filter(a => a.filePathName != filePathName);
        that.reloadShowFileList();
      },
      handleExceed(files, fileList) {
        // 文件超出个数限制时的钩子
        var that = this;
        this.$message.warning(`最多只能上传${that.limit}个图片，本次选择了${files.length}个`);
      },
      beforeRemove(file, fileList) {
        return this.$confirm(`确定删除 ${file.name}？`);
      },
      handlePreview(file) {
        var that = this;
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      },
      handleDownload(file) {
        var that = this;
        that.formDownloadFile(file);
      },
      reloadShowFileList() {
        var that = this;
        var showData = [];
        var pathType = that.parms.pathType || '';
        $.each(that.value, function (index, item) {
          var showItem = Object.toClone(item);
          showItem.name = item.fileName;
          var src = __serverpath + FUI.Handlers.Common + 'getShowImage/?pathType=' + pathType + '&groupName=' + showItem.groupName + '&filePath=' + showItem.filePathName;
          showItem.url = src;
          showData.push(showItem);
        })
        that.showData = showData;
        console.info( that.showData);
        that.autoIsShowAddUpload();
      },
      autoIsShowAddUpload() {
        var that = this;
        that.noneBtnImg = that.showData.length >= that.limit;
      },
      formDownloadFile(file) {
        var filePath = file.filePathName;
        var groupName = file.groupName;
        var fileName = file.fileName;
        var actionUrl = FUI.Handlers.Common;
        var data = Object.toAjaxDownloadFile(actionUrl, 'downloadFile', { 'filePath': filePath, 'fileName': fileName, 'groupName': groupName });
      }
    }
  }
</script>