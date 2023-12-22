<template>
  <div class="cost analysisList" id="costId">
    <el-form label-width="120px" ref="formRef" :model="formObj" :rules="formRules">
      <!--<div class="pageTitle"></div>-->
      <div class="projectInfo">
        <div class="title">项目信息</div>
        <div class="formData">
          <el-row :gutter="24" align="middle" style="padding-right: 15px">
            <el-col :span="8">
              <el-form-item label="项目编号：">
                <el-input v-model="formObj.projectNo" placeholder="自动带出" disabled size="small">
                </el-input>
              </el-form-item>
              <el-form-item label="项目经理：">
                <el-input v-model="formObj.projectManager" placeholder="自动带出" disabled size="small"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="项目名称：">
                <el-input v-model="formObj.projectName" placeholder="自动带出" disabled size="small"></el-input>
              </el-form-item>
              <el-form-item label="最近上传人：">
                <el-input v-model="formObj.lastUploader" placeholder="自动带出" disabled size="small"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="施工单位">
                <el-input v-model="formObj.constructionUnit" placeholder="自动带出" disabled size="small"></el-input>
              </el-form-item>
              <el-form-item label="最近上传时间：">
                <el-input v-model="formObj.lastUploaderTime" placeholder="自动带出" disabled size="small"></el-input>
              </el-form-item>
            </el-col>
          </el-row>

        </div>
      </div>
      <div class="costInfo">
        <div class="title">资料信息</div>
        <el-row style="padding: 10px;">
          <el-col :span="12">
            <span>文件名：</span>
            <el-input v-model="fileName" placeholder="请输入" size="small" style="width: 200px" clearable></el-input>
            <el-button type="primary" size="small" style="margin-left: 15px" @click="handelSearchFile">查 询</el-button>
          </el-col>
          <el-col :span="12" style="text-align: right">
            <el-checkbox v-model="checked" @change="(val) => getCheckedValue(val)" v-show="isRoleCode.deletePermission === 'TRUE' || isRoleCode.downLoadPermission === 'TRUE'">全选</el-checkbox>
            <el-button type="primary" size="small" style="margin: 0 10px" @click="handleDeleteFile" v-show="isRoleCode.deletePermission === 'TRUE'">删除</el-button>
            <el-button type="primary" size="small" @click="handleBatchDownload" v-show="isRoleCode.downLoadPermission === 'TRUE'">批量下载</el-button>
          </el-col>
        </el-row>
        <div style="height: 1px;background: #CCCCCC;padding: 0 10px;margin: 10px 0"></div>
        <el-row :gutter="24" class="tableSub" style="margin-bottom: 10px">
          <el-col :span="4" class="table_left">
            <el-tree
              :data="datas"
              :props="defaultProps"
              accordion
              @node-click="handleNodeClick">
            </el-tree>
          </el-col>
          <el-col :span="17" class="table_center">
            <ul class="fileBox">
              <li v-for="(item,index) in fileList" :key="index" @click="handleInfo(item)">
                <span class="fileCheckBox">
                  <el-checkbox v-model="item.isCheck" @change="(val) => handleCheckAllListChange(val, item)"
                               style="transform: scale(1.2)"></el-checkbox>
                </span>
                <div class="fileCont">
                  <img v-if="['png','jpg','jpeg','gif','bmp','PNG','JPG','JPEG','GIF','BMP'].includes(getFilesType(item.fileName))"
                       src="../../../resources/images/fileType/image.png" alt=""
                       style="display: inline-block;width: 50px;height: 50px;">
                  <img v-else-if="['mp4','mov','wmv','flv','avi','mkv'].includes(getFilesType(item.fileName))"
                       src="../../../resources/images/fileType/video.png" alt=""
                       style="display: inline-block;width: 50px;height: 50px;">
                  <img v-else-if="['rar','zip','tar','gz','7z','mkv'].includes(getFilesType(item.fileName))"
                       src="../../../resources/images/fileType/zip.png" alt=""
                       style="display: inline-block;width: 50px;height: 50px;">
                  <img v-else-if="['doc','docx'].includes(getFilesType(item.fileName))"
                       src="../../../resources/images/fileType/word.png" alt=""
                       style="display: inline-block;width: 50px;height: 50px;">
                  <img v-else-if="['pdf'].includes(getFilesType(item.fileName))"
                       src="../../../resources/images/fileType/pdf.png" alt=""
                       style="display: inline-block;width: 50px;height: 50px;">
                  <img v-else-if="['txt'].includes(getFilesType(item.fileName))"
                       src="../../../resources/images/fileType/txt.png" alt=""
                       style="display: inline-block;width: 50px;height: 50px;">
                  <img v-else-if="['ppt','pptx'].includes(getFilesType(item.fileName))"
                       src="../../../resources/images/fileType/ppt.png" alt=""
                       style="display: inline-block;width: 50px;height: 50px;">
                  <img v-else-if="['xls','xlsx'].includes(getFilesType(item.fileName))"
                       src="../../../resources/images/fileType/excel.png" alt=""
                       style="display: inline-block;width: 50px;height: 50px;">
                  <img v-else-if="['md'].includes(getFilesType(item.fileName))"
                       src="../../../resources/images/fileType/md.png" alt=""
                       style="display: inline-block;width: 50px;height: 50px;">
                  <img v-else-if="['js'].includes(getFilesType(item.fileName))"
                       src="../../../resources/images/fileType/js.png" alt=""
                       style="display: inline-block;width: 50px;height: 50px;">
                  <img v-else-if="['json'].includes(getFilesType(item.fileName))"
                       src="../../../resources/images/fileType/JSON.png" alt=""
                       style="display: inline-block;width: 50px;height: 50px;">
                  <img v-else-if="['mp3','wav','aac','wma'].includes(getFilesType(item.fileName))"
                       src="../../../resources/images/fileType/JSON.png" alt=""
                       style="display: inline-block;width: 50px;height: 50px;">
                  <img v-else-if="['xml'].includes(getFilesType(item.fileName))"
                       src="../../../resources/images/fileType/xml.png" alt=""
                       style="display: inline-block;width: 50px;height: 50px;">
                  <img v-else-if="['css'].includes(getFilesType(item.fileName))"
                       src="../../../resources/images/fileType/css.png" alt=""
                       style="display: inline-block;width: 50px;height: 50px;">
                  <img v-else-if="['html'].includes(getFilesType(item.fileName))"
                       src="../../../resources/images/fileType/html.png" alt=""
                       style="display: inline-block;width: 50px;height: 50px;">
                  <img v-else src="../../../resources/images/fileType/ofile.png" alt=""
                       style="display: inline-block;width: 50px;height: 50px;">
                  <div class="el-upload__text">{{item.fileName}}</div>
                </div>
              </li>
              <div class="uploadBox" v-if="getMenuId && isRoleCode.upLoadePermission === 'TRUE'">
                <el-upload
                  class="avatar-uploader"
                  drag
                  multiple
                  :action="postUrl" :accept="accept"
                  :show-file-list="false"
                  :before-upload="beforeAvatarUpload"
                  :on-success="handleAvatarSuccess">
                  <i class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
              </div>
            </ul>
            <el-row style="text-align: right;margin: 15px">
              <!--<el-pagination background layout="prev, pager, next" :total="1000" ></el-pagination>-->
              <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="currentPage"
                :page-sizes="[20,50,100]"
                :page-size="currentSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
              </el-pagination>
            </el-row>
          </el-col>
          <el-col :span="3" class="table_right">
            <span class="labelInfo">上传人：</span>
            <span class="valueInfo">{{getInfo.uploadUserName}}</span>
            <span class="labelInfo">上传时间：</span>
            <span class="valueInfo">{{getInfo.uploadTime}}</span>
            <span class="labelInfo">文件大小：</span>
            <span class="valueInfo">{{getInfo.fileSize}}</span>
            <span class="labelInfo">文件格式：</span>
            <span class="valueInfo">{{getInfo.fileType}}</span>
          </el-col>

        </el-row>
      </div>
    </el-form>
  </div>
</template>

<script>
  //import uploadFile from '../targetCost/upload_file';
  // import costSubtable from './costSubtable'
  import axiosRequest from '@/utils/request'
  import {batchDownloadFiles} from '../../../Api/common'
  export default {
    components: {
      // uploadFile
    },
    data() {
      return {
        isReadOnly: false,
        isAble: false,
        formObj: {
          myId: '',
          wiid: '',
          formId: '',
          businessKey: '',
          projectId: '',
          projectNo: '',
          billNo: '',
          constructionUnit: '',
          constructionUnitId: '',
          projectName: '',
          projectManager: '',
          projectManagerId: '',
          projectProfitMargin: '',
          actualYield: '',
          fileName: '',
          detail: [],
          procInstState: 0,
          projectDept: '',
          projectDeptId: '',
          lastUploader: '',
          lastUploaderTime: ''
        },
        getInfo: {
          fileType: '--',
          fileSize: '--',
          uploadUserName: '--',
          uploadTime: '--',
        },
        addTableData: [], // 子表数据
        fileData: [], // 附件数据
        formRules: {
          projectNo: [
            {required: true, message: '请选择项目名称', trigger: 'change'},
          ]
        },
        parentId: '',
        id: '',
        type: '',
        getProjectNo: '',
        datas: [],
        defaultProps: {
          children: 'children',
          label: 'meanscClass'
        },
        imageUrl: "",
        fileName: "",
        checked: false,
        currentPage: 1,
        currentSize: 10,
        total: null,
        getMenuId: null,
        fileList: [],
        accept: '.wmv,.avi,.rm,.mp4,.ppt,.pptx,.docx,.xlsx,.jpg,.gif,.jpeg,.bmp,.png,.doc,.xls,.pdf,.rar,.zip,.txt,.rtf,.bak,.sql',
        tip: '',
        postUrl: '',
        parms: {},
        multipleSelection: [],
        getTreeNode:{},
        isRoleCode: {
          deletePermission: "FALSE",
          downLoadPermission: "FALSE",
          upLoadePermission: "FALSE"
        }
      }
    },
    mounted() {
      var that = this;
      // window.myvm指向当前页面vue实例 复制粘贴
      window.myvm = that;
      // 自动计算高度
      window.autoPageHeight();
      // window.$urlFormVue指向当前页面vue实例 复制粘贴
      window.$urlFormVue = that;
      //获取ifrme dom对象
      that.iframeDom = parent.parent.document.getElementById("urlFormIframe");
      that.iframeDocument = document.getElementById("costId");
      // that.setFormIframeHeight();
    },
    created() {
      var that = this;
      window.myvm = that;
      var myId = Object.toQueryString("myId");
      that.getProjectNo = myId;
      // that.getProjectNo = 'SGHT_2023022582';
      console.log(myId);
      that.getTreeData();
      that.getTableData();
      that.getFileData();
      // 获取用户角色权限
      that.getUserRoleCode();
    },
    methods: {
      //动态设置ifrme高度 自适应内容高度
      setFormIframeHeight() {
        // this.$nextTick(()=>{
        //   this.iframeDom.height = this.iframeDocument.scrollHeight;
        //   console.log("高度:",this.iframeDom.height)
        // })
      },
      //============================================工作流操作按钮交互 结束==================================
      showData() {
      },
      // 点击树状菜单
      handleNodeClick(data) {
        var that = this;
        console.log(data,'123412341234');
        that.getMenuId = data.myId;
        that.getTreeNode = data;
        that.getFileData();
        // 初始化文件信息
        that.getInfo = {
          fileType: '--',
          fileSize: '--',
          uploadUserName: '--',
          uploadTime: '--',
        }
      },
      beforeAvatarUpload(file){
        var that = this;
        var author = FUI.Sys.getAuthor();
        let formdata = new FormData();
        formdata.append("file", file);
        formdata.append("meansClass",  that.getTreeNode.meanscClass);
        formdata.append("meansClassId",  that.getTreeNode.myId);
        formdata.append("myParentId",  that.formObj.myId);
        formdata.append("userId", author.userId);
        axiosRequest.post(`/meansplace/uploadFiles`, formdata).then(res =>{
          if (res.code === 200) {
            FUI.Window.showMsg(res.msg,'',1);
            that.handleCurrentChange(1)
          } else {
            FUI.Window.showMsg(res.msg);
            return false;
          }
        })
      },
      handleAvatarSuccess(res, file) {
        // this.imageUrl = URL.createObjectURL(file.raw);
        var that = this;
        that.handleCurrentChange(1);
        that.getTableData();
      },
      // 获取项目信息
      getTableData() {
        var that = this;
        setTimeout(function () {
          $.extendAjax(`/meansplace/queryProjectData?projectNo=${that.getProjectNo}`, '', "get", function (res) {
            if (res.code === 200) {
              that.formObj = res.data;
            } else {
              FUI.Window.showMsg(res.msg);
              return false;
            }
          });
        }, 500);
      },
      // 获取树形菜单
      getTreeData() {
        var that = this;
        setTimeout(function () {
          $.extendAjax(`/meansplace/queryDataClassification?projectNo=${that.getProjectNo}`, '', "get", function (res) {
            if (res.code === 200) {
              var arr = res.data;
              if (arr.length > 0) {
                const arr2 = that.listToTreeSimple(arr);
                that.datas = arr2;
                console.log(that.datas)
              }
            } else {
              FUI.Window.showMsg(res.msg);
              return false;
            }
          });
        }, 500);

      },
      // 获取文档资料
      getFileData() {
        var that = this;
        setTimeout(function () {
          var parms = {
            fileName: that.fileName,
            meanClassId: that.getMenuId,
            pageNum: that.currentPage,
            pageSize: that.currentSize,
            projectNo: that.getProjectNo
          };
          $.extendAjax(`/meansplace/queryFileListByMeanClassId`, JSON.stringify(parms), "post", function (res) {
            if (res.code === 200) {
              that.fileList = res.rows;
              that.total = res.total;
            } else {
              that.fileList = [];
              that.total = 0;
              FUI.Window.showMsg(res.msg);
              return false;
            }
          });
        }, 500);
      },
      handleSizeChange(val) {
        var that = this;
        that.currentPage = 1;
        that.currentSize = val;
        that.getFileData();
        console.log(`每页 ${val} 条`);
      },
      handleCurrentChange(val) {
        var that = this;
        that.currentPage = val;
        that.getFileData();
        console.log(`当前页: ${val}`);
      },
      // 资料文件点击事件
      handleInfo(obj) {
        var that = this;
        obj.isCheck = !obj.isCheck;
        console.log(obj);
        that.getInfo = {
          fileType: that.getFilesType(obj.fileName),
          fileSize: obj.fileSize ? obj.fileSize + ' KB' : '--',
          uploadUserName: obj.uploadUserName?obj.uploadUserName:'==',
          uploadTime: obj.uploadTime?obj.uploadTime:'--',
        }
      },
      // 删除
      handleDeleteFile() {
        var that = this;
        var arr = that.fileList;
        if(arr.length >0 ){
          var arr1 = [];
          for(var i=0;i<arr.length;i++){
            arr1.push(arr[i].isCheck)
          }
          if(arr1.includes(true)){
            that.multipleSelection = arr.filter(item => item.isCheck === true);
            console.log(that.multipleSelection,'选中的值');
            that.handleBatchDeleteFile();
            return true
          }else{
            FUI.Window.showMsg('请选择需要删除的附件资料');
            return false;
          }
        }else{
          FUI.Window.showMsg('请选择需要删除的附件资料');
          return false;
        }
      },
      // 批量下载
      handleBatchDownload() {
        var that = this;
        var arr = that.fileList;
        if(arr.length >0 ){
          var arr1 = [];
          for(var i=0;i<arr.length;i++){
            arr1.push(arr[i].isCheck)
          }
          if(arr1.includes(true)){
            that.multipleSelection = arr.filter(item => item.isCheck === true);
            that.handleBatchFile();
            console.log(that.multipleSelection,'选中的值');
            return true
          }else{
            FUI.Window.showMsg('请选择需要下载的附件资料');
            return false;
          }
        }else{
          FUI.Window.showMsg('请选择需要下载的附件资料');
          return false;
        }
      },
      // 全选
      getCheckedValue(val){
        console.log(val,'全选');
        var list = this.fileList;
        for(var i=0;i<list.length;i++){
          list[i].isCheck = val;
        }
      },
      // 获取类型
      getFilesType(val) {
        var type = val.replace(/.+\./, "");
        return type
      },
      // 选中方法
      handleCheckAllListChange(val, item) {
        console.log(val, item);
        item.isCheck = !item.isCheck;
      },
      // 查询方法
      handelSearchFile() {
        var that = this;
        that.handleCurrentChange(1)
      },
      // 执行批量下载的方法
      handleBatchFile(){
          var that = this;
          var list = that.multipleSelection;
          var parms = list.map(x => {
            var item = {
              filePath: x.filePathName,
              fileName: x.fileName,
              groupName: x.groupName
            };
            return item;
          });
        batchDownloadFiles(parms).then((res) =>{
          if (res) {
            console.log(res);
            const link=document.createElement('a');
            try{
              let blob =  res;
              var myDate = new Date();
              let _fileName = '资料归档下载文件--'+ myDate.toDateFormat('yyyyMMddHHmmssS'); //文件名，
              link.style.display='none';
              const url = window.URL || window.webkitURL || window.moxURL;
              link.href=url.createObjectURL(blob);
              link.download = _fileName;   //下载的文件名称
              link.click();
              window.URL.revokeObjectURL(url);
            }catch (e) {
              console.log('下载的文件出错',e)
            }
          }
        })
          // $.extendAjax(`/meansplace/batchDownFiles`, JSON.stringify(parms), "post", function (res) {
          //   if (res.code === 200) {
          //     FUI.Window.showMsg('请求批量下载提交成功','提示',1);
          //   } else {
          //     FUI.Window.showMsg(res.msg);
          //     return false;
          //   }
          // });
      },
      //执行批量删除的方法
      handleBatchDeleteFile(){
        var that = this;
        var list = that.multipleSelection;
        var author = FUI.Sys.getAuthor();
        var parms ={
          'projectId': that.formObj.projectId,
          'projectNo':that.formObj.projectNo,
           'myParentId':that.formObj.myId,
           'projectManager':that.formObj.projectManager,
           'constructionUnit':that.formObj.constructionUnit,
          "userId" :author.userId,
          "path":list
        };
        $.extendAjax(`/meansplace/deleteFile`, JSON.stringify(parms), "post", function (res) {
          if (res.code === 200) {
            FUI.Window.showMsg('删除成功','提示',1);
            that.handleCurrentChange(1)
          } else {
            FUI.Window.showMsg(res.msg);
            return false;
          }
        });
      },
       listToTreeSimple(data) {
        const res = [];
        data.forEach((item) => {
          const parent = data.find((node) => node.myId === item.levelMeansClassId);
          if (parent) {
            parent.children = parent.children || [];
            parent.children.push(item);
          } else {
            // * 根节点
            res.push(item);
          }
        });
        return res;
      },
      // 获取当前用户的角色权限
      getUserRoleCode(){
        var that = this;
        var author = FUI.Sys.getAuthor();
        $.extendAjax(`/meansplace/checkRolePermission?userId=${author.userId}`, '', "get", function (res) {
          if (res.code === 200) {
            that.isRoleCode = res.data;
          } else {
            FUI.Window.showMsg(res.msg);
            return false;
          }
        });

      }

    }
  }
</script>

<style lang="scss" scoped>
  .analysisList {
    width: 80%;
    margin: 0 auto;
    background-color: #FFFFFF;
    overflow: auto;
    height: 100%;
  }

  .cost {
    .title {
      vertical-align: middle;
      display: flex;
      align-items: center;
      font-size: 12px;
      font-weight: bold;
      color: #0D1126;
      border-bottom: 1px solid #f3f3f3;
      padding: 5px 0;
    }

    .title::before {
      content: "";
      display: inline-block;
      width: 4px;
      height: 20px;
      margin-right: 15px;
      background-color: #006EFF;
    }

    .projectInfo {
      margin: 10px 0;
      padding: 5px 0;
      background-color: #fff;

      .formData {
        padding: 10px 0;
      }
    }

    .costInfo {
      min-width: 1280px;
      height: auto;
      background-color: #fff;
      padding: 5px 0;
      margin-bottom: 10px;

      .formData {
        padding: 10px 0;

        label {
          font-weight: normal !important;
        }
      }

    }

    .planCenter {
      // min-height: 600px;
      background-color: #fff;
      padding: 5px 0;
      margin-bottom: 10px;

      .formData {
        padding: 10px 0;
      }
    }

    .footer {
      background-color: #fff;
      padding: 5px 0;
    }

    .pageTitle {
      text-align: center;
      font-size: 26px;
      color: rgb(0, 140, 255);
      height: 48px;
      background: #FFFFFF;
      margin-bottom: 10px;
      line-height: 48px;
    }

    .table_left {
      height: 535px;
      /*border: 1px solid;*/
      background: #FFFFFF;
      overflow: hidden; //超出的文本隐藏
      text-overflow: ellipsis; //溢出用省略号显示
      white-space: nowrap; // 默认不换行；
      .el-tree-node__label{
        overflow: hidden; //超出的文本隐藏
        text-overflow: ellipsis; //溢出用省略号显示
        white-space: nowrap; // 默认不换行；
      }
    }

    .table_center {
      height: auto;
      border-left: 1px solid #CCCCCC;
      border-right: 1px solid #CCCCCC;
      background: #FFFFFF;

      .fileBox {
        width: 100%;
        height: 470px;
        padding: 10px 0;
        display: table;
        overflow-x: scroll;
      }

      .uploadBox {
        width: 22.5%;
        height: 140px;
        // border: 1px solid #CCCCCC;
        box-shadow: 0px 0 5px #FFFFFF;
        border-radius: 2.5px;
        margin-left: 2%;
        margin-bottom: 10px;
        display: inline-block;
        position: relative;
        padding: 10px;
        z-index: 98;
        vertical-align: middle;
      }

      .fileBox li {
        width: 22.5%;
        height: 140px;
        border: 1px solid #eeeeee;
        box-shadow: 0px 0 5px #fafafa;
        border-radius: 2.5px;
        margin-left: 2%;
        margin-bottom: 10px;
        display: inline-block;
        position: relative;
        padding: 10px;
        z-index: 98;
        vertical-align: middle;

        .fileCheckBox {
          position: absolute;
          left: 5px;
          top: 5px;
          z-index: 99;
        }

        .fileCont {
          width: 100%;
          height: 120px;
          border: 0px solid;
          text-align: center;
          display: flex;
          align-content: center;
          flex-direction: column;
          justify-content: space-evenly;
          align-items: center;
        }
      }

      .fileBox li:hover {
        box-shadow: 0px 0 10px #CCCCCC;
      }

      .avatar-uploader {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
        width: 100%;
        height: 120px;
        text-align: center;

        .el-upload-dragger {
          border: none;
          width: 100% !important;
          height: 120px;
        }
      }

      .avatar-uploader:hover {
        border-color: #409EFF;
      }

      .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        min-width: 178px;
        height: 120px;
        line-height: 120px;
        text-align: center;
      }

      .avatar {
        width: 220px;
        height: 120px;
        display: block;
      }
    }

    .table_right {
      height: 535px;
      /*border: 1px solid;*/

      span {
        display: block;
        padding: 5px 10px;
      }

      .labelInfo {
        font-size: 14px;
        color: #333333;
        font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
      }

      .valueInfo {
        font-size: 13px;
        color: #333333;
        font-weight: bold;
        font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
        overflow: hidden; //超出的文本隐藏
        text-overflow: ellipsis; //溢出用省略号显示
        white-space: nowrap; // 默认不换行；

      }
    }
  }
</style>
