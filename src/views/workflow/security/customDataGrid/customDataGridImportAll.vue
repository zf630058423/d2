<template>
  <div v-loading="loading">
    <el-form ref="formRef" :model="data" class="f2bpm-editform" label-width="120px">
      <!-- <el-form-item label="导入方式">
        <el-select v-model="deployType" size="mini">
          <el-option label="请选择" value="" />
          <el-option label="原样导入" value="OriAdd" />
          <el-option label="复制导入" value="CopyAdd" />
        </el-select>
      </el-form-item> -->
      <el-form-item label="上传Xml文件">
        <el-upload ref="upload" name="fileUpload" :headers="headers" action="#" :multiple="true" accept=".xml"  :on-change="onChange" :on-success="onSuccess" :auto-upload="false" :on-error="onError"  >
          <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
          <el-button style="margin-left: 10px;" size="small" type="success"  @click="submitForm()">确定上传
          </el-button>
          <!-- <div slot="tip" class="el-upload__tip">只能上传数据建模Xml文件，默认为原样导入</div> -->
        </el-upload>
      </el-form-item>
         <!--<div style="line-height: 25px;font-size: 12px;padding-left: 30px; ">
        <em>导入方式说明：</em>
        <br>【原样导入】不改变任何ID值原样导入，如果已存在相同的“数据建模”则导入会失败;可应用于数据迁移中导入。
        <br>【复制导入】则会修改所有ID然后再导入，可应用于多租户间导入。
      </div> -->
      <div class="dialogfooter">
        <el-button id="btn_cancel" size="small" @click="closeEdit"><i class="fa fa-minus-circle" />取消
        </el-button>
      </div>
    </el-form>
  </div>
</template>

<script>
  import {uploadImportDataDictXml,uploadImportSerialNumXml,uploadImportCustomDialogXml,uploadImportCustomDataGridXml,
  uploadImportResourceXml,uploadImportFormXml,uploadImportDataService,improtRoles,improtDepart,uploadImportProcessAppXmlBatch, importModelXml} from "@/Api/financialManagement/releasea_api";
  export default {
    data() {
      return {  
        fileList:[],
        subData:{},
        loading:false,
        deployType: 'OriAdd',
        data:{
        }
      };
    },
    created() {
      var author = this.$store.state.user.author;
      var f2bpmToken = author.token;
      this.headers = { 'f2bpmToken': f2bpmToken };
      this.subData= JSON.parse(this.$route.query.parms) ;

    },
    methods: {
      // 选取完文件触发事件
      onChange(a, fileList) {
        this.fileList = fileList;
      },

      //确认上传
      setUpload() {   
        var that = this;  
        var param = new FormData();  
        param.append("fileUpload", that.fileList[0].raw);
        // param.append("deployType",  that.deployType);
        // uploadImportFormDefXml(param).then((res) =>{
        //   if(res.success){     
        //       FUI.Window.showMsg(res.msg);
        //       setTimeout(()=>{
        //         FUI.Window.closeEdit(true);
        //       },700)    
        //     }else{
        //       FUI.Window.showMsg(res.msg);
        //     }            
        // });      
      },
    
      //提交
      async submitForm() {
        var that = this;
        if (that.fileList == "") {
          FUI.Window.showMsg('请先选择 [浏览文件] 后在点击上传!');
          return false
        }
        var param = new FormData();
        param.append("fileUpload", that.fileList[0].raw);
        param.append("deployType", that.deployType);

        if (that.subData.type == 1) {//数据字典
          uploadImportDataDictXml(param).then((res) => {
            if (res.success) {
              FUI.Window.showMsg(that, res.msg, '提示', '', function () {
                FUI.Window.closeEdit(true);
              });
            } else {
              FUI.Window.showMsg2(res.msg);
            }
          })
        }

        if (that.subData.type == 2) {//流水号
          uploadImportSerialNumXml(param).then((res) => {
            if (res.success) {
              FUI.Window.showMsg(that, res.msg, '提示', '', function () {
                FUI.Window.closeEdit(true);
              });
            } else {
              FUI.Window.showMsg2(res.msg);
            }
          })
        }


        if (that.subData.type == 3) {//自定义对话框
          uploadImportCustomDialogXml(param).then((res) => {
            if (res.success) {
              FUI.Window.showMsg(that, res.msg, '提示1', '', function () {
                FUI.Window.closeEdit(true);
              });
            } else {
              FUI.Window.showMsg(res.msg);
            }
          })
        }

        if (that.subData.type == 4) {//自定义列表
          uploadImportCustomDataGridXml(param).then((res) => {
            if (res.success) {
              FUI.Window.showMsg(res.msg);
              FUI.Window.showMsg(that, res.msg, '提示', '', function () {
                FUI.Window.closeEdit(true);
              });
            } else {
              FUI.Window.showMsg(res.msg);
            }
          })
        }

        if (that.subData.type == 5) {//菜单
          uploadImportResourceXml(param).then((res) => {
            if (res.success) {
              FUI.Window.showMsg(that, res.msg, '提示', '', function () {
                FUI.Window.closeEdit(true);
              });
            } else {
              FUI.Window.showMsg(res.msg);
            }
          })
        }
        if (that.subData.type == 6) {//表单
          this.loading = true
          uploadImportFormXml(param).then((res) => {
            if (res.success) {
              FUI.Window.showMsg(that, res.msg, '提示', '', function () {
                that.loading = false
                FUI.Window.closeEdit(true);
                window.location.reload()
              });
            } else {
              FUI.Window.showMsg(res.msg);
            }
          })
        }

        if (that.subData.type == 7) {//流程
          this.loading = true

          uploadImportProcessAppXmlBatch(param).then((res) => {
            if (res.success) {
              FUI.Window.showMsg(that, res.msg, '提示', '', function () {
                that.loading = false
                FUI.Window.closeEdit(true);
              });
            } else {
              FUI.Window.showMsg(res.msg);
            }
          })
        }
        if (that.subData.type == 8) {//数据服务管理
          uploadImportDataService(param).then((res) => {
            if (res.success) {
              FUI.Window.showMsg(that, res.msg, '提示', '', function () {
                FUI.Window.closeEdit(true);
              });
            } else {
              FUI.Window.showMsg(res.msg);
            }
          })
        }
        if (that.subData.type == 9) {//角色管理导入
          improtRoles(param).then((res) => {
            if (res.success) {
              FUI.Window.showMsg(that, res.msg, '提示', '', function () {
                FUI.Window.closeEdit(true);
              });
            } else {
              FUI.Window.showMsg(res.msg);
            }
          })
        }
        if (that.subData.type == 10) {
          //标签管理导入
          improtDepart(param).then((res) => {
            if (res.success) {
              FUI.Window.showMsg(that, res.msg, '提示', '', function () {
                FUI.Window.closeEdit(true);
              });
            } else {
              FUI.Window.showMsg(res.msg);
            }
          })
        }
        if (that.subData.type == 11) {
          importModelXml(param).then((res) => { 
            if (res.success) {
              FUI.Window.showMsg(that, res.msg, '提示', '', function () {
                FUI.Window.closeEdit(true);
              });
            } else {
              FUI.Window.showMsg(res.msg);
            }
          })
        }
        // uploadImportFormDefXmlCheck(param).then((res)=>{
        //   if(res.data){      
        //     if(res.data.code==1){
        //       FUI.Window.showMsg(res.msg);
        //       setTimeout(()=>{
        //         FUI.Window.closeEdit(true);
        //       },700)          
        //     }else if(res.data.code==2){             
        //       that.$confirm(res.data.message).then(()=> {   
        //         this.setUpload();
        //       }).catch(()=> {
        //         console.log("取消");
        //       });
        //     }else{           
        //       FUI.Window.showMsg(res.data.message);   
        //       return false
        //     }          
        //   }       
        // })
      },
      onSuccess(response, file, fileList) {
        var that = this;
        if (response.success) {
          FUI.Window.showMsg(this, response.msg, null, 1, function () {
            FUI.Window.closeEdit(true);
          });
        } else {
          FUI.Window.showMsg(that, response.msg, null, null, function () {
            that.$refs.upload.clearFiles();
          });
        }
      },
      onError(error, file, fileList) {
        var that = this;
        FUI.Window.showMsg(that, error);
      },
      closeEdit() {
        FUI.Window.closeEdit();
      }
    }
  }
</script>