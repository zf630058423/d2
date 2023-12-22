<template>
  <div>
    <div v-if="ctrType == 'picture'||(ctrType == 'extend_picture'&&!isReadOnly)">
      <el-upload :action="postUrl" list-type="picture-card" :data="parms" :file-list="showData" :headers="headers" :on-change="handleLimit" :class="{disUoloadSty:uploadDisabled}" :on-success="handleSuccess" :vModel="field.vModel" :accept="accept" :multiple="isMultiple" :limit="limit" name="fileUpload" :auto-upload="true">
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
    <div v-if="ctrType == 'extend_picture'&&isReadOnly">
      <img v-for="img in showData" :src="img.url" :style="getWidthHeightStyle()" />
    </div>
  </div>

</template>

<script>
  export default {
    name: "f2bpm-picture",
    components: {},
    props: ['field', 'fieldvalue', 'rowindex', 'colindex'],
    data: function () {
      return {
        ctrType: "",
        isView: false,
        isShow: true,
        isReadOnly: false,
        headers: {},
        // 上传时附带的额外参数
        parms: {},
        uploadDisabled: false,
        limit: 99,
        // 是否支持多选文件,打开选择窗口一次选择多个
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
      };
    },
    watch: {
      value(val, oleV) {
        var that = this;
        if (val != undefined && oleV != undefined && f2grid_global_mainVueLoadComplated && that.ctrType != "extend_picture") {
          this.$emit('updatevalue', that.field, val);
        } else if (val != undefined && oleV != undefined && that.ctrType == "extend_picture") {
          that.field.value = val;
        }
      }
    },
    created: function () {
      var that = this;
      that.ctrType = that.field.ctrType;
      var author = this.$store.state.user.author;
      var f2bpmToken = author.token;
      var headerAuthor = { 'f2bpmToken': f2bpmToken };
      that.headers = headerAuthor;
      that.initailFieldOption();
      var formAction = WFContext.WorkflowformAction;
      that.isView = formAction > 2;
      if (that.isView) {
        that.isReadOnly = true;
      } else if (that.field._isReadOnly == true) {
        that.isReadOnly = true;
      }
      if (WFContext.isDesign !== true && that.ctrType == "extend_picture") {
        that.isReadOnly = true;
      }
      var fieldvalue = "";
      if (that.ctrType == "extend_picture") {
        fieldvalue = that.field.value || "";
      } else {
        fieldvalue = that.fieldvalue;
      }
      if (fieldvalue && fieldvalue.length > 0) {
        that.value = typeof fieldvalue === 'string' && fieldvalue != '' ? eval('(' + fieldvalue + ')') : fieldvalue;
        that.reloadShowFileList();
      }
      if (that.field.fieldOptions) {
        // 可配置上传的更多属性
      }
    },
    mounted() {
      var that = this;
      //FUI.F2Grid.excuteFieldWritePowerByVueFormItem(that);
      if (that.isReadOnly == true) {
        that.uploadDisabled = true;
      } else {
        that.autoIsShowAddUpload();
      }
    },
    methods: {
      getWidthHeightStyle() {
        var that = this;
        var whset = that.field;
        if (that.field.ctrType != "extend_picture") {
          return "";
        }
        var whexpress = "";
        if (whset && whset.imgWidth) {
          whexpress = "width:" + whset.imgWidth + "px;";
        }
        if (whset && whset.imgHeight) {
          whexpress = "height:" + whset.imgHeight + "px;";
        }
        return whexpress;
      }
      , initailFieldOption() {
        var that = this;
        if (that.field.fieldOptions) {
          var options = typeof that.field.fieldOptions === 'string' ? eval('(' + that.field.fieldOptions + ')') : that.field.fieldOptions;
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
          }
        }
      },
      handleLimit(file, fileList) {
        var that = this;
        if (fileList.length >= that.limit) {
          this.uploadDisabled = true;
        } else {
          this.uploadDisabled = false;
        }
      },
      autoIsShowAddUpload() {
        var that = this;
        if (that.showData.length >= that.limit || that.isReadOnly == true) {
          that.uploadDisabled = true;
        } else {
          that.uploadDisabled = false;
        }
      },
      handleSuccess(response, file, fileList) {
        var that = this;
        if (response.success === true) {
          var valueItem = Object.toClone(response.data);
          that.value.push(valueItem);

          var item = response.data;
          var src = __serverpath + FUI.Handlers.Common + 'getShowImage/?groupName=' + item.groupName + '&filePath=' + item.filePathName;
          item.url = src;
          item.name = item.fileName;
          that.showData.push(item);
        }
        console.log(response);
      },
      handleError(err, file, fileList) {
        console.log(response);
        console.log(file, fileList);
      },
      handleRemove(file) {
        console.info(file);
        var that = this;
        var filePathName = file.filePathName;
        that.value = that.value.filter(a => a.filePathName != filePathName);
        that.reloadShowFileList();
      },
      handleExceed(files, fileList) {
        // 文件超出个数限制时的钩子
        this.$message.warning(`当前限制选择${limit}个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
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
        $.each(that.value, function (index, item) {
          var showItem = Object.toClone(item);
          showItem.name = item.fileName;
          var src = __serverpath + FUI.Handlers.Common + 'getShowImage/?groupName=' + showItem.groupName + '&filePath=' + showItem.filePathName;
          showItem.url = src;
          showData.push(showItem);
        });
        that.showData = showData;
        if (that.showData.length >= that.limit) {
          this.uploadDisabled = true;
        } else {
          this.uploadDisabled = false;
        }
        that.autoIsShowAddUpload();
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