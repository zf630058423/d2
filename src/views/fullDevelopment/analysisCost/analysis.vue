<template>
  <div class="cost analysisList" id="costId">
    <el-form label-width="120px" ref="formRef" :model="formObj" :rules="formRules">
      <div class="pageTitle">目标成本分析</div>
      <div class="projectInfo">
        <div class="title">项目信息</div>
        <div class="formData">
          <el-row :gutter="24" align="middle" style="padding-right: 15px">
            <el-col :span="8">
              <el-form-item label="项目编号：">
                <el-input v-model="formObj.projectNo" placeholder="请选择项目" disabled name="testName" size="small">
                </el-input>
              </el-form-item>
              <el-form-item label="施工单位：">
                <el-input v-model="formObj.constructionUnit" placeholder="自动填写" disabled size="small"></el-input>
              </el-form-item>
              <el-form-item label="项目利润率(%)：">
                <el-input v-model="formObj.projectProfitMargin" placeholder="系统计算" disabled size="small"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="项目名称：">
                <el-input v-model="formObj.projectName" placeholder="自动填写" disabled size="small"></el-input>
              </el-form-item>
              <el-form-item label="项目部：">
                <el-input v-model="formObj.projectManager" placeholder="自动填写" disabled size="small"></el-input>
              </el-form-item>
              <el-form-item label="实际利润率(%)：">
                <el-input v-model="formObj.designAmountTaxIncluded" placeholder="系统计算" disabled size="small"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="项目经理：">
                <el-input v-model="formObj.projectManager" placeholder="自动填写" disabled size="small"></el-input>
              </el-form-item>
              <el-form-item label="目标利润率(%)：">
                <el-input v-model="formObj.targetProfitRate" placeholder="系统计算" disabled size="small"></el-input>
              </el-form-item>
            </el-col>
          </el-row>

        </div>
      </div>
      <div class="costInfo">
        <div style="border-bottom: 1px solid #f3f3f3;display:flex;justify-content:space-between;padding-bottom:5px;align-items:center;padding-right: 20px">
          <div class="title" style="border:none;">成本信息
          </div>
          <div class="contentBtn-box" v-if="isAble">
            <el-button type="primary" size="small">导出
            </el-button>
          </div>
        </div>
        <div class="formData" style="padding:0 15px">
          <cost-subtable ref="cost" @showData="showData" @changeHeight="setFormIframeHeight" ></cost-subtable>
        </div>
      </div>
    </el-form>
  </div>
</template>

<script>
  import uploadFile from '../targetCost/upload_file';
  import costSubtable from './costSubtable'
  export default {
    components: {
      uploadFile,costSubtable
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
          actualYield:'',
          targetProfitRate:'',
          detail: [],
          procInstState: 0,
          projectDept:'',
          projectDeptId:''
        },
        getInfo:{
          modifyName:'',
          modifyDept:'',
          modifyTime:'',
          modifyId:'',
        },
        addTableData:[], // 子表数据
        fileData: [], // 附件数据
        formRules: {
          projectNo: [
            {required: true, message: '请选择项目名称', trigger: 'change'},
          ]
        },
        parentId: '',
        id: '',
        type: '',
        getMyId:''
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
      var myId=Object.toQueryString("myId");
      that.getMyId = myId;
      console.log(myId);
      that.getTableData();
    },
    methods: {
      //动态设置ifrme高度 自适应内容高度
      setFormIframeHeight (){
        // this.$nextTick(()=>{
        //   this.iframeDom.height = this.iframeDocument.scrollHeight;
        //   console.log("高度:",this.iframeDom.height)
        // })
      },
      // 获取详情 /targetcost/queryTargetcost
      getProjectData(id) {
        var that = this;
        let res = Object.toExtendAjax('/targetcost', '/queryTargetcost', {'wiid': id}, false, 'get');
        if (res.code === 200) {
          that.formObj = res.data;
          var files = res.data.file;
          // if(arr.length > 0){
          //   that.$refs.treeTab.getObj(arr);
          // }
          if(files){
            that.$refs.file.getObj(files);
          }
        } else {
          that.$message.error(res.msg)
        }

      },
      // 保存整体数据  没用上
      saveConfirm() {
        const res = this.submitForm()
        if (res == 200) {
          if (this.$route.query.formAction == '0') {
            this.$message.success('新增成功！')

          } else {
            this.$message.success('编辑成功！')
          }
          setTimeout(() => {
            FUI.Window.closeEdit(true, this.$route.query.parentGridId);
          }, 1500)

        }

      },
      // 获取单据编号
      getSerialNumber() {
        var that = this;
        let res = Object.toAjaxJson(FUI.Handlers.FuiFrameworkHandler, 'getSerialNumber', {'counterCode': 'BPM_MuBiaoChengBenFenXiBiao'});
        if (res.success) {
          that.formObj.billNo = res.msg
        }
      },
      // 弹框调用 获取字段绑定
      // id：自定义对话框id
      // name：自定义对话框名称
      // code：自定义对话框别名
      // ObjName：自定义对话框数据对象名称（数据库表名）
      // width：弹框宽度
      // height：弹框高度
      // radioMultiple：是否多选
      openCustomDialog(id, name, code, ObjName, width, height, radioMultiple) {
        var that = this;
        var multi = radioMultiple == '1';
        CustomDialog(that, {
          customDialog: code,
          isTest: false,
          width: width,
          height: height,
          isMulti: multi,
          formObj: [
            {
              field: 'projectNo',
              property: 'myId'
            }
          ],
          callBack: function (data) {
            console.log(data);
            //自定义回调函数不是必须的，可删除
            let {ConstructionUnit, ProjectName, ProjectManager, ProjectManagerID, MyId, ConstructionUnitID,ProjectTaxMethod,ProjectNo,ProjectDepartment,ProjectDepartmentID} = data[0];
            that.formObj.constructionUnit = ConstructionUnit;
            that.formObj.projectName = ProjectName;
            that.formObj.projectManager = ProjectManager;
            that.formObj.projectManagerId = ProjectManagerID;
            that.formObj.projectId = MyId;
            that.formObj.constructionUnitId = ConstructionUnitID;
            that.formObj.projectProfitMargin = ProjectTaxMethod;
            that.formObj.projectNo = ProjectNo;
            that.formObj.projectDept= ProjectDepartment;
            that.formObj.projectDeptId = ProjectDepartmentID;
          }
        });
      },
      // 下面的方法不要动 全部复制粘贴
      //============================================工作流操作按钮交互的函数=====================================
      //初始化iframe中url传入的流程相关参数
      initailWorkflowParms() {
        var that = this;
        //获取流程页面的流程上下文[实用的流程信息从这里获取]
        that.wfContext = window.parent.myvm.wfContext;
        //流程应用定义ID
        var appId = Object.toQueryString("appId") || "";
        //流程实例ID
        var wiid = Object.toQueryString("wiid") || "";
        // 判断流程实例id如果为空就从上下文取
        if (wiid == "") {
          wiid = that.wfContext.WorkflowInstanceId;
        }
        //  当前页面状态：0未有实例，2待办，3查看,4待阅
        var formAction = Object.toQueryString("formAction") || 0;
        //待办任务ID，待办时才有此参数
        var taskId = Object.toQueryString("taskId") || "";
        if (formAction > 2) {
          // 判断状态是否禁用输入框
          that.isReadOnly = true;
        }
        // 流程表单ID
        that.appId = appId;
        // 流程实例ID
        that.wiid = wiid;
        // 流程状态
        that.formAction = formAction;
        // 流程上下文id, 流程结束之后就不会再有
        that.taskId = taskId;
      }
      //工作流点击"保存"时触发此函数，返回true:工作流继续提交， false:工作流不提交
      , saveWorkflow(btnDef) {
        var that = this;
        console.info("urlFormDemo saveWorkflow:", btnDef);
        that.formObj.procInstState = 1;
        var result = "";
        result = that.submitForm();
        return result;

      }
      //工作流点击"提交"时触发此函数，返回:空字符串:工作流继续提交，返回"具体错误信息":工作流不提交
      , sendWorkflow(btnDef) {
        var that = this;
        that.formObj.procInstState = 2;
        console.info("urlFormDemo sendWorkflow", btnDef);
        var result = "";
        result = that.submitForm();
        return result;
      }
      //工作流点击"驳回"时触发此函数，返回:空字符串:工作流继续提交，返回"具体错误信息":工作流不提交
      , rejectWorkflow(btnDef) {
        var that = this;
        console.info("urlFormDemo rejectWorkflow", btnDef);
        var result = "";
        result = that.submitForm();
        return result;
      }
      //工作流点击"作废"时触发此函数，返回:空字符串:工作流继续提交，返回"具体错误信息":工作流不提交
      //content为作废意见
      , invalidWorkflow(content) {
        var that = this;
        console.info("urlFormDemo invalidWorkflow", content);
        var result = "";// "invalidWorkflow:"+content;
        return result;
      }
      //工作流点击"确认转办"时触发此函数，返回:空字符串:工作流继续提交，返回"具体错误信息":工作流不提交
      //opinion:转办意见
      , referredWorkflow(opinion) {
        var that = this;
        console.info("urlFormDemo referredWorkflow", opinion);
        var result = "";// "referredWorkflow:"+opinion;
        return result;
      }
      //工作流点击"提交"时触发此函数，返回:true校验通过，false校验不通过；
      //也可以返回具体的错误信息：空字符串，校验通过，返回具体错误信息校验不通过，同时弹出具体的错误信息。
      , validateWorkflowForm(btnDef) {
        var that = this;
        var success = that.validateForm('formRef');
        return success;
      }
      //工作流工具栏上的其它按钮操作时返回:空字符串: 按钮继续执行，返回"具体错误信息":按钮不再执行
      , otherWorkflowButtonClick(btnDef) {
        var that = this;
        var actionName = btnDef.actionName;
        //btnDef：按钮的定义实体
        console.info(actionName);
        console.info(btnDef);
        return "";
      },
      //============================================工作流操作按钮交互 结束==================================
      // 绑定表单数据
      loadData() {
        var that = this;
        if (that.formAction != 0) {
          FUI.Form.bindDataToForm(that, "/workflow/demo/demoUrlForm/", "getModelByWiid", that.wiid, null, null);
        }
      },
      // 表单提交
      submitForm() {
        var that = this;
        fui_global_richeditorArrValueToInput(that);
        var success = that.validateForm('formRef');
        that.getTableData();
        if (!success) return;
        that.formObj.wiid = that.wiid;
        that.formObj.formId = window.parent.myvm.wfContext.FormId;
        that.formObj.businessKey = window.parent.myvm.wfContext.BusinessKey;
        that.formObj.detail = that.addTableData;
        if(that.fileData.length === 0){
          FUI.Window.showMsg('附件不能为空');
          return false
        }else{
          that.formObj.file = JSON.stringify(that.fileData);
        }
        // 调用我们自己的表单保存接口
        setTimeout(function () {
          $.extendAjax("/targetcost/addTargetcost", JSON.stringify(that.formObj), "post", function(res) {
            if (res.code === 200) {
              console.log(res);
            } else {
              FUI.Window.showMsg(res.msg);
              return false;
            }
          });
        }, 500);
      },
      // field: 可以是字段名也可以是字段定义的对象
      updateFieldValue(field, newValue, vueDataName, subVueDataName) {
        // 更新控件值
        var that = this;
        var vueDataObj = vueDataName ? that[vueDataName] : that.data;
        if (subVueDataName) vueDataObj = that[vueDataName][subVueDataName];
        if (typeof field === 'string') {
          vueDataObj[field] = newValue;
        } else {
          if (field.fieldName) {
            vueDataObj[field.fieldName] = newValue;
          } else if (field.vModel) {
            vueDataObj[field.vModel] = newValue;
          } else if (field['field']) {
            vueDataObj[field['field']] = newValue;
          }
        }
      },
      // 表单效验
      validateForm(refFormName) {
        var success = false;
        this.$refs[refFormName].validate(valid => {
          success = valid;
        });
        return success;
      },
      // 获取详情接口
      getTableData(){
        var that = this;
        setTimeout(function () {
          $.extendAjax(`/targetcost/queryTargetcost?projectId=${that.getMyId}`,'', "get", function(res) {
            if (res.code === 200) {
               that.formObj = res.data;
               that.$refs.cost.getObj(that.formObj.detail);
            } else {
              FUI.Window.showMsg(res.msg);
              return false;
            }
          });
        }, 500);
      },
      showData(){}
    }
  }
</script>

<style lang="scss" scoped>
  .analysisList{
    width: 80%;
    margin: 0 auto;
    background-color: #e2e2e2;
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
      margin-bottom: 10px;
      padding: 5px 0;
      background-color: #fff;

      .formData {
        padding: 10px 0;
      }
    }

    .costInfo {
      //  min-height: 400px;
      background-color: #fff;
      padding: 5px 0;
      margin-bottom: 10px;

      .formData {
        padding: 10px 0;
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
  }
</style>
