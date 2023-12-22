<template>
  <div>
    <div style="display:flex">
      <el-upload
        v-if="!isReadOnly"
        :v-model="field.vModel"
        name="fileUpload"
        class="upload-demo"
        :action="postUrl"
        :data="parms"
        :accept="accept"
        :headers="headers"
        :on-success="handleSuccess"
        :on-change="handleLimit"
        :multiple="isMultiple"
        :limit="limit"
        :show-file-list="false"
        :on-exceed="handleExceed"
        :on-progress="uploadVideoProcess"
      >
        <el-popover
          placement="top-start"
          title="上传文件格式"
          width="500"
          trigger="hover"
          :content="tip"
        >
          <i v-show="tip" slot="reference" class="el-icon-question" style="color: #999999;font-size: 20px;margin-right: 10px;line-height: 32px;"></i>
        </el-popover>
        <el-button
          v-if="!isReadOnly && !uploadDisabled"
          size="small"
          type="primary"
        >点击上传</el-button>
      </el-upload>
      <el-button
        v-if="showData.length > 1"
        style="margin-left: 10px;"
        size="small"
        type="primary"
        @click.stop="downloadAll"
      >批量下载</el-button>
    </div>
    <div style="max-width: 400px; padding-left: 5px">
      <ul class="el-upload-list el-upload-list--text" style="margin-top: 0px">
        <li
          v-for="(f, index) in showData"
          :key="index"
          tabindex="0"
          class="el-upload-list__item is-success"
          style="margin-top: 10px;text-align: left;"
        >
          <a @click="handlePreview(f)">
            <i class="el-icon-document"></i> {{ f.name }}</a>
          <label
            class="my-el-upload-list__item-status-label"
            style="margin-bottom: 10px"
          ><i
            class="icon icon-xiazai pl5 pr5 cur blue"
            title="下载附件"
            @click="formDownloadFile(f, index)"
          ></i><i
            v-if="!isReadOnly"
            class="fa fa-trash-o ml5 pl5 pr5 cur orange"
            title="删除附件"
            @click="deleteFile(f)"
          ></i></label>
          <el-progress
            v-if="f.index > 0 && f.index < 100"
            :percentage="f.index"
            :color="customColors"
          ></el-progress>
        </li>
      </ul>
      <el-progress
        v-if="loadProgressFlag"
        :percentage="loadProgress"
        :color="customColors"
      ></el-progress>
    </div>
    <!-- 图片预览 -->
    <el-image-viewer
      v-if="showImageViewer"
      :url-list="srcList"
      hide-on-click-modal
      teleported
      :on-close="closePre"
    />
  </div>
</template>

<script>
import { downloadFilesAll } from '@/Api/common';
export default {
  name: 'F2bpmFile',
  components: {
    'el-image-viewer': () =>
      import('element-ui/packages/image/src/image-viewer')
  },
  props: ['field', 'fieldvalue', 'rowindex', 'colindex'],
  data: function() {
    return {
      f2bpmToken: '',
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
      accept:
        '.wmv,.avi,.rm,.mp4,.ppt,.pptx,.docx,.xlsx,.jpg,.gif,.jpeg,.bmp,.png,.doc,.xls,.pdf,.rar,.zip,.txt,.rtf,.bak,.sql,.ofd',
      tip: '',
      postUrl: __serverpath + FUI.Handlers.Common + 'uploadFile/',
      // 最终保存到数据库的格式 [filePathName:'2020/08/20200814171353896_5789_.jpg',fileName:'yd4.jpg',groupName:'testGroup']
      value: [],
      // 用于显示的原el的数据格式 例如: [{name: 'food.jpg', url: 'https://xxx.cdn.com/xxx.jpg',fileName,filePathName,groupName,status}]
      showData: [],
      percentage: [],
      loadProgress: 0,
      loadProgressFlag: false,
      customColors: [
        { color: '#f56c6c', percentage: 20 },
        { color: '#e6a23c', percentage: 40 },
        { color: '#5cb87a', percentage: 60 },
        { color: '#1989fa', percentage: 80 },
        { color: '#6f7ad3', percentage: 100 }
      ],
      srcList: [],
      showImageViewer: false
    };
  },
  watch: {
    value(val, oleV) {
      var that = this;
      if (
        val != undefined &&
        oleV != undefined &&
        that.ctrType != 'extend_file' &&
        f2grid_global_mainVueLoadComplated
      ) {
        this.$emit('updatevalue', that.field, val);
      } else if (
        val != undefined &&
        oleV != undefined &&
        that.ctrType == 'extend_file'
      ) {
        that.field.value = val;
      }
    },
    fieldvalue: {
      handler(newV, oleV) {
        var that = this;
        if (newV !== undefined && oleV !== undefined && f2grid_global_mainVueLoadComplated) {
          that.value =
            typeof newV === 'string' && newV !== ''
              ? eval('(' + newV + ')')
              : newV;
          this.$emit('updatevalue', that.field, that.value);
          that.reloadShowFileList()
        }
      },
      immediate: false
    }
  },
  created: function() {
    var that = this;
    that.ctrType = that.field.ctrType;
    var author = this.$store.state.user.author;
    var f2bpmToken = author.token;
    var headerAuthor = { f2bpmToken: f2bpmToken };
    that.f2bpmToken = f2bpmToken;
    that.headers = headerAuthor;
    var formAction = WFContext.WorkflowformAction;
    that.isView = formAction > 2;
    if (that.isView) {
      that.isReadOnly = true;
    } else if (that.field._isReadOnly == true) {
      that.isReadOnly = true;
    }
    that.initailFieldOption();
    if (WFContext.isDesign !== true && that.ctrType == 'extend_file') {
      that.isReadOnly = true;
    }
    var fieldvalue = '';
    if (that.ctrType == 'extend_file') {
      fieldvalue = that.field.value || '';
    } else {
      fieldvalue = that.fieldvalue;
    }
    if (fieldvalue && fieldvalue.length > 0) {
      that.value =
        typeof fieldvalue === 'string' && fieldvalue != ''
          ? eval('(' + fieldvalue + ')')
          : fieldvalue;
      that.reloadShowFileList();
    }
    if (that.field.fieldOptions) {
      // 可配置上传的更多属性
    }
  },
  mounted() {
    var that = this;
    // FUI.F2Grid.excuteFieldWritePowerByVueFormItem(that);
  },
  methods: {
    initailFieldOption() {
      var that = this;
      if (that.field.fieldOptions) {
        var fieldOptions =
          typeof that.field.fieldOptions === 'string'
            ? eval('(' + that.field.fieldOptions + ')')
            : that.field.fieldOptions;
        var general = fieldOptions.find((a) => a.opttype == 'general');
        if (general) {
          var kvData = general.params.kvData;
          var item = kvData.find((a) => a.key == 'isMultiple');
          if (item) {
            that.isMultiple = item.value;
          }
          item = kvData.find((a) => a.key == 'uploadtip');
          if (item) {
            that.tip = item.value;
          }
          item = kvData.find((a) => a.key == 'uploadextension');
          if (item && item.value) {
            that.accept = item.value;
          }
          item = kvData.find((a) => a.key == 'uploadlimit');
          if (item && item.value > 0) {
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
    beforeAvatarUpload(file, data) {
      if (file.name.split('.').length - 1 === 1) {
        const containSpecial = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\]<>《》/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？ ]")
        if (containSpecial.test(file.name)) {
          this.$message.warning('名称不能含有特殊字符！')
          return false
        }
      } else {
        this.$message.warning('名称不能含有特殊字符！')
        return false
      }
    },
    handleSuccess(response, file, fileList) {
      var that = this;
      console.log(file);
      setTimeout(function() {
        that.loadProgressFlag = false;
      }, 500);
      const arr = [];
      if (response.success === true) {
        var valueItem = Object.toClone(response.data);
        that.value.push(valueItem);
        var item = response.data;
        item.name = item.fileName;
        item.index = 0;

        that.showData.push(item);
        console.log(that.showData, 999);
        that.onBlur();
      } else {
        FUI.Window.showMsg2(response.msg);
        that.handleRemove(file, fileList);
      }
    },
    handleError(err, file, fileList) {
      console.log(file, fileList);
    },
    deleteFile(file) {
      var that = this;
      FUI.Window.confirm(`确定删除 ${file.name}？`, null, function() {
        that.handleRemove(file);
      });
    },
    handleRemove(file, fileList) {
      var that = this;
      var filePathName = file.filePathName;
      that.value = that.value.filter((a) => a.filePathName != filePathName);
      that.reloadShowFileList();
    },
    handleExceed(files, fileList) {
      // 文件超出个数限制时的钩子
      this.$message.warning(
        `当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${
          files.length + fileList.length
        } 个文件`
      );
    },
    beforeRemove(file, fileList) {
      var that = this;
      if (that.isReadOnly) {
        return false;
      }
      return that.$confirm(`确定删除 ${file.name}？`);
    },
    handlePreview(file) {
      var that = this;
      var filePath = file.filePathName;
      var extendName = filePath.substr(filePath.toLowerCase().lastIndexOf('.'));
      // var arr = [".xlsx", ".xls", ".doc", ".docx", ".pdf", ".ppt", ".pptx"];
      var arr = ['.pdf', '.PDF'];
      var imgArr = ['.png', '.jpg', '.jpeg', '.gif', '.bmp'];
      if (arr.indexOf(extendName) > -1) {
        that.preview(file, 'pdf');
      } else if (imgArr.indexOf(extendName) > -1) {
        that.preview(file, 'img');
      } else {
        that.formDownloadFile(file);
      }
    },
    preview(file, type) {
      var that = this;
      var fileName = file.fileName;
      var groupName = file.groupName;
      var filePath = file.filePathName;
      var url = '';
      if (type == 'pdf') {
        // 使用pdf-js打工查看PDF(由于pdf-js对非常规字体不支持)
        // url = __webpath + '/workflow/security/pdfview/previewpdf?groupName=' + groupName + '&filePath=' + filePath;
        // 使用浏览器直接打开PDF的Url
        that.openPdfByBrowser(groupName, filePath, fileName);
        return false;
      } else if (type == 'img') {
        that.srcList = [];
        // url = __webpath + '/workflow/security/pdfview/previewpicture?groupName=' + groupName + '&filePath=' + filePath;
        var src =
          __serverpath +
          FUI.Handlers.Common +
          'getShowImage/?groupName=' +
          groupName +
          '&filePath=' +
          filePath;
        that.srcList.push(src);
        that.showPre();
      } else {
        return false;
      }
      // FUI.Window.open(url);
    },
    // 使用浏览器直接打开显示PDF
    openPdfByBrowser(groupName, filePath, fileName) {
      var that = this;
      fileName = fileName.replace('#', '_');
      var url =
        __serverpath +
        '/workflow/security/baseCommon/getPdfData?groupName=' +
        groupName +
        '&filePath=' +
        filePath;
        // "&fileName=" +
        // fileName;
      url = url + '&f2bpmToken=' + that.f2bpmToken;
      const pdfUrl = url;
      const page = window.open(pdfUrl);
    },
    reloadShowFileList() {
      var that = this;
      var showData = [];
      $.each(that.value, function(index, item) {
        var showItem = Object.toClone(item);
        showItem.name = item.fileName;
        showData.push(showItem);
      });
      that.showData = showData;
      console.log(that.showData, '12341123');
      if (that.showData.length >= that.limit) {
        this.uploadDisabled = true;
      } else {
        this.uploadDisabled = false;
      }
    },
    onBlur() {
      var that = this;
      var fieldDef = that.field;
      var fieldValue = that.value;
      // =================字段事件=========================
      const isSubField = that.rowindex != undefined && that.rowindex != null;
      var funcName = that.field.vModel.replace(/\./g, '_');
      if (Object.toIsExitsFunction(funcName)) {
        const parms = {};
        if (isSubField) {
          const row = that.$parent.data;
          parms.row = row;
          parms.rowIndex = that.rowindex;
          parms.colIndex = that.colindex;
        }
        window[funcName](fieldValue, that.field, parms);
      }
      // ================================================
    },
    formDownloadFile(file, index) {
      var that = this;
      var filePath = file.filePathName;
      var groupName = file.groupName;
      var fileName = file.fileName;
      var pathUrl = __serverpath + FUI.Handlers.Common;
      // Object.toAjaxDownloadFile(
      //   actionUrl,
      //   "downloadFile",
      //   { filePath: filePath, fileName: fileName, groupName: groupName },
      //   false,
      //   function (loaded, total) {
      //     //that.$set(that.percentage,index,Math.round( loaded / total *100))
      //     console.log(Math.round((loaded / total) * 100));
      //     that.$set(file, "index", Math.round((loaded / total) * 100));
      //   }
      // );
      fileName = encodeURIComponent(fileName);
      window.open(pathUrl + 'downloadFile?fileName=' + fileName + '&filePath=' + filePath + '&groupName=' + groupName);
    },
    // 上传进度中
    uploadVideoProcess(event, file, fileList) {
      var that = this;
      that.loadProgressFlag = true;
      that.loadProgress = Math.round((event.loaded / event.total) * 100);
    },
    // 批量下载 zip包
    async downloadAll() {
      // let actionUrl = FUI.Handlers.Common;
      // that.showData.forEach(item => {
      //   Object.toAjaxDownloadFile(actionUrl, 'downloadFile', { 'filePath': item.filePathName, 'fileName': item.fileName, 'groupName': item.groupName },false,function(loaded, total){
      //     that.$set(item,'index',Math.round( loaded / total *100))
      //   });
      // })
      const result = [];
      this.showData.forEach((item) => {
        const res = JSON.parse(
          JSON.stringify(item).replace(/filePathName/g, 'filePath')
        );
        result.push(res);
      });
      try {
        const data = await downloadFilesAll(result);
        const url = window.URL.createObjectURL(data);
        const link = document.createElement('a');
        link.href = url;
        link.style.display = 'none';
        var fileName = '附件.zip';
        fileName = fileName.replace(/%/g, '%25');
        const downlaodFileName = decodeURIComponent(fileName);
        link.setAttribute('download', downlaodFileName);
        link.click();
        window.URL.revokeObjectURL(url);
      } catch (error) {
        console.log(error);
      }
    },
    // 打开预览
    showPre() {
      this.showImageViewer = true;
      const m = (e) => {
        e.preventDefault();
      };
      document.body.style.overflow = 'hidden';
      document.addEventListener('touchmove', m, false); // 禁止页面滑动
    },
    // 关闭预览el-image-viewer组件的事件
    closePre() {
      this.showImageViewer = false;
      const m = (e) => {
        e.preventDefault();
      };
      document.body.style.overflow = 'auto';
      document.removeEventListener('touchmove', m, true);
    }
  }
};
</script>
