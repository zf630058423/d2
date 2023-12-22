<template>
  <div class="cost" id="costId">
    <el-form label-width="120px"
             ref="formRef"
             :model="data"
             :rules="formRules">
      <div class="pageTitle">目标成本调整</div>
      <div class="projectInfo">
        <div class="title">项目信息</div>
        <div class="formData">
          <el-row :gutter="24" align="middle" style="padding-right: 15px">
            <el-col :span="8">
              <el-form-item label="单据编号：">
                <el-input v-model="data.billNo" placeholder="自动填写" disabled size="small"></el-input>
              </el-form-item>
              <el-form-item label="施工单位：">
                <el-input v-model="data.constructionUnit" placeholder="自动填写" disabled size="small"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="项目编号：" prop="projectNo">
                <el-col :span="20" style="padding: 0 5px;vertical-align: middle">
                  <el-input v-if="this.$route.query.formAction === '3'" v-model="data.projectNo" placeholder="请选择项目" disabled name="testName" size="small"></el-input>
                  <el-input v-else v-model="data.projectNo" placeholder="请选择项目" disabled name="projectNo" size="small">
                    <el-button size="small" slot="append"
                               @click="openCustomDialog('3ddedfb0-9b70-47f4-9016-466a4d684ee5' ,'项目编号', 'BPM_XiangMuBianHao_4419' ,'ct_bpm_projectfiles',800,500,0)"
                               icon="el-icon-search"></el-button>
                  </el-input>
                </el-col>
                <el-col :span="4" style="padding: 0;vertical-align: middle">
                  <el-button size="small" class="el-icon-link" type="primary" style="font-size: 18px" plain @click="handleToLink"></el-button>
                </el-col>
              </el-form-item>
              <el-form-item label="项目经理：">
                <el-input v-model="data.projectManager" placeholder="自动填写" disabled size="small"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="项目名称：">
                <el-input v-model="data.projectName" placeholder="自动填写" disabled size="small"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="项目利润率(%)：">
                <el-input v-model="data.projectProfitMargin" placeholder="系统计算" disabled size="small"></el-input>
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
            <!--<el-button type="primary"-->
            <!--size="small"-->
            <!--@click="fatherNode('','')">新增-->
            <!--</el-button>-->
            <!--<el-button type="primary" size="small">导入-->
            <!--</el-button>-->
            <!--<el-button type="primary" size="small">导出-->
            <!--</el-button>-->
          </div>
        </div>
        <div class="formData" style="padding:0 15px">
          <tree-table ref="treeTab" @showData="showData" @changeHeight="setFormIframeHeight" :formAction="this.$route.query.formAction" :isReadOnly="isAble"></tree-table>
        </div>

      </div>
      <div class="footer">
        <div style="border-bottom: 1px solid #f3f3f3;display:flex;justify-content:space-between;padding-bottom:5px;align-items:center;">
          <div class="title" style="border:none;">附件</div>
        </div>
        <el-row :gutter="24" style="padding-right: 15px">
          <el-col :span="24">
            <el-form-item label="附件：" class="is-required">
              <!--<el-button type="primary" size="small">点击上传-->
              <!--</el-button>-->
              <uploadFile ref="file" @showFile="showFile" :isReadOnly="isAble"></uploadFile>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24" style="padding-right: 15px">
          <el-col :span="8">
            <el-form-item label="编制人：">
              <el-input disabled size="small"
                        placeholder="保存生成"
                        v-model="getInfo.createName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="编制人部门：">
              <el-input disabled size="small"
                        placeholder="保存生成"
                        v-model="getInfo.createDept"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="编制时间：">
              <el-input disabled size="small"
                        placeholder="保存生成"
                        v-model="getInfo.createTime"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
    </el-form>
  </div>
</template>

<script>
  import addDialog from "./addDialog.vue";
  import treeTable from './treeTable';
  import uploadFile from '../targetCost/upload_file';
  export default {
    components: {
      addDialog, treeTable,uploadFile
    },
    data() {
      return {
        isReadOnly: false,
        isAble: false,
        newData: {},
        data: {
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
          projectManagerID: '',
          projectProfitMargin: '',
          detail: [],
          procInstState: 0
        },
        getInfo:{
          createDept:'',
          createTime:'',
          createName:'',
          createId:'',
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
        submitObj: {}
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

      if (that.$route.query && that.$route.query.formAction === '0') {
        that.getSerialNumber();
        that.wfContext = window.parent.myvm.wfContext;
        that.getInfo.createName = that.wfContext.ProcInstCreatorRealName;
        that.getInfo.createDept = that.wfContext.ProcInstCreatorOrgName;
        that.getInfo.createTime = that.wfContext.StartedTime;
        that.getInfo.createId = that.wfContext.CreateId;
      }
      if (that.$route.query.formAction !== '0') {
        that.wfContext = window.parent.myvm.wfContext;
        that.getInfo.createName = that.wfContext.ProcInstCreatorRealName;
        that.getInfo.createDept = that.wfContext.ProcInstCreatorOrgName;
        that.getInfo.createTime = that.wfContext.StartedTime;
        that.getInfo.createId = that.wfContext.CreateId;
        that.getProjectData(that.$route.query.wiid)
      }
      //获取ifrme dom对象
      that.iframeDom = parent.parent.document.getElementById("urlFormIframe");
      that.iframeDocument = document.getElementById("costId");
      that.setFormIframeHeight();
    },
    created() {
      var that = this;
      that.initailWorkflowParms();
      //parent.document.querySelectorAll("iframe")[0].height = 0;
      //parent.document.querySelectorAll("iframe")[0].height = 1100;
      var userId = this.$store.state.user.userId; //当前账号userId
      var CurrentUserId = that.wfContext.CurrentUserId; //
      var sate = that.wfContext.WorkflowInstinceState; // 单据状态
      var formAction = that.wfContext.WorkflowformAction; // 操作编号
      if ((userId === CurrentUserId) && Number(sate) < 2) {
        that.isAble = true;
      }else{
        that.isAble = false;
      }
    },
    methods: {
      //动态设置ifrme高度 自适应内容高度
      setFormIframeHeight (){
        this.$nextTick(()=>{
          this.iframeDom.height = this.iframeDocument.scrollHeight;
          console.log("高度:",this.iframeDom.height)
        })
      },
      // 返回  没用上
      backBtn() {
        FUI.Window.closeEdit();
      },
      // 获取详情 /targetcostadjustment/queryTargetcostadjustment
      getProjectData(id) {
        var that = this;
        let res = Object.toExtendAjax('/targetcostadjustment', '/queryTargetcostadjustment', {'wiid': id}, false, 'get');
        if (res.code === 200) {
          that.data = res.data;
          var arr = res.data.detail;
          var files = res.data.file;
          if(arr.length > 0){
            that.$refs.treeTab.getObj(arr);
          }
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
        let res = Object.toAjaxJson(FUI.Handlers.FuiFrameworkHandler, 'getSerialNumber', {'counterCode': 'BPM_mubiaochengbentiaozheng'});
        if (res.success) {
          that.data.billNo = res.msg
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
          data: [
            {
              field: 'projectNo',
              property: 'myId'
            }
          ],
          callBack: function (data) {
            console.log(data);
            //自定义回调函数不是必须的，可删除
            let {ConstructionUnit, ProjectName, ProjectManager, ProjectManagerID, MyId, ConstructionUnitID,ProjectTaxMethod,ProjectNo} = data[0];
            that.data.constructionUnit = ConstructionUnit;
            that.data.projectName = ProjectName;
            that.data.projectManager = ProjectManager;
            that.data.projectManagerID = ProjectManagerID;
            that.data.projectId = MyId;
            that.data.constructionUnitId = ConstructionUnitID;
            that.data.projectProfitMargin = ProjectTaxMethod;
            that.data.projectNo = ProjectNo;
            // 获取详情
            let res = Object.toExtendAjax('/costinformationadjustment', '/queryPageTargetcostinformationController', {'projectId': MyId}, false, 'get');
            if (res.code === 200) {
                that.$refs.treeTab.getObj(res.data);
            } else {
              that.$message.error(res.msg)
            }


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
        that.data.procInstState = 1;
        var result = "";
        result = that.submitForm();
        return result;

      }
      //工作流点击"提交"时触发此函数，返回:空字符串:工作流继续提交，返回"具体错误信息":工作流不提交
      , sendWorkflow(btnDef) {
        var that = this;
        that.data.procInstState = 2;
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
        console.log('12313ttt');
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
        // var success = that.validateForm('formRef');
        // that.getTableData();
        // if (!success) return;
        // that.data.wiid = that.wiid;
        // that.data.formId = window.parent.myvm.wfContext.FormId;
        // that.data.businessKey = window.parent.myvm.wfContext.BusinessKey;
        // that.data.detail = that.addTableData;
        // if(that.fileData.length === 0){
        //   FUI.Window.showMsg('附件不能为空');
        //   return false
        // }else{
        //   that.data.file = JSON.stringify(that.fileData);
        // }
        // 1. 把数据处理为对象
        that.setObj();
        // 2.把对象转成数组
        that.setArr();
        // 调用我们自己的表单保存接口
        // setTimeout(function () {
        //   $.extendAjax("/targetcostadjustment/addTargetcostadjustment", JSON.stringify(that.data), "post", function(res) {
        //     if (res.code === 200) {
        //       console.log(res);
        //     } else {
        //       FUI.Window.showMsg(res.msg);
        //       return false;
        //     }
        //   });
        // }, 500);
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
        var that = this;
        this.$refs[refFormName].validate(valid => {
          success = valid;
        });
        that.getTableData();
        if (!success) return;
        that.data.wiid = that.wiid;
        that.data.formId = window.parent.myvm.wfContext.FormId;
        that.data.businessKey = window.parent.myvm.wfContext.BusinessKey;
        that.data.detail = that.addTableData;
        if(that.fileData.length === 0){
          FUI.Window.showMsg('附件不能为空');
          return false
        }else{
          that.data.file = JSON.stringify(that.fileData);
        }
        var state = that.vaildOnlyData(); // 校验唯一性
        if(state === false){
          return false
        }
        return success;
      },
      getTableData(){
        this.$refs.treeTab.setData();
        this.$refs.file.returnData();
      },
      showData(obj){
        console.log(obj)
        var fieldList = obj.map(x => {
          var arr = x.details;
          var getObj = arr.map(x => {
            var item1 = {
              contractAmount: x.contractAmount === null? -1:x.contractAmount === ''?-1:x.contractAmount,
              expenseItem: x.expenseItem,
              targetCost: x.targetCost === null?-1:x.targetCost === ''?-1:x.targetCost,
              costAfterAdjustment:x.costAfterAdjustment === null?0:x.costAfterAdjustment === ''?0:x.costAfterAdjustment,
              costOfThisAdjustment:x.costOfThisAdjustment === null?0:x.costOfThisAdjustment === ''?0:x.costOfThisAdjustment,
              myId: x.myId?x.myId:'',
              myParentId: x.myParentId?x.myParentId:'',
              id: x.id,
              pid: x.pid,
            };
            return item1;
          });
          var item2 = {
            contractAmount: x.contractAmount === null? -1:x.contractAmount === ''?-1:x.contractAmount,
            details: getObj,
            expenseItem: x.expenseItem,
            targetCost: x.targetCost === null?-1:x.targetCost === ''?-1:x.targetCost,
            costAfterAdjustment:x.costAfterAdjustment === null?0:x.costAfterAdjustment === ''?0:x.costAfterAdjustment,
            costOfThisAdjustment:x.costOfThisAdjustment === null?0:x.costOfThisAdjustment === ''?0:x.costOfThisAdjustment,
            myId: x.myId?x.myId:'',
            myParentId: x.myParentId?x.myParentId:'',
            id: x.id,
            pid: x.pid,
          };
          return item2;
        });
        this.addTableData = fieldList;
      },
      // 接受上次文件
      showFile(arr){
        console.log(arr,'文件');
        this.fileData = arr;
        this.setFormIframeHeight();

      },
      // 链接跳转
      handleToLink() {
        var that = this;
        var val = that.$store.state.user.author.tenantId;
        var tableName = 'ct_' + val + '_projectfiles';
        var id = that.data.projectId;
        if(id){
          Object.toGetNoWiid(tableName,id)
        }else {
          that.$message({
            message: '请先选择需要跳转的项目',
            type: 'warning'
          });
        }
      },
      //数据组装
      setObj(){
        var that = this;
        var name = 'TargetCostAdjustment';
        var subName = 'CostinformationAdjustment';
        that.data.wiid = that.wiid;
        that.data.formId = window.parent.myvm.wfContext.FormId;
        that.data.businessKey = window.parent.myvm.wfContext.BusinessKey;
        that.submitObj[name+'.MyId'] = that.data.myId;
        that.submitObj[name+'.FormId'] = that.data.formId;
        that.submitObj[name+'.BusinessKey'] = that.data.businessKey;
        that.submitObj[name+'.File'] = JSON.stringify(that.fileData);
        that.submitObj[name+'.ProjectId'] = that.data.projectId;
        that.submitObj[name+'.ProjectNo'] = that.data.projectNo;
        that.submitObj[name+'.BillNo'] = that.data.billNo;
        that.submitObj[name+'.ConstructionUnit'] = that.data.constructionUnit;
        that.submitObj[name+'.ConstructionUnitId'] = that.data.constructionUnitId;
        that.submitObj[name+'.ProjectName'] = that.data.projectName;
        that.submitObj[name+'.ProjectManager'] = that.data.projectManager;
        that.submitObj[name+'.ProjectManagerID'] = that.data.projectManagerID;
        that.submitObj[name+'.ProjectProfitMargin'] = that.data.projectProfitMargin;
        that.submitObj[name+'.CreateDept'] = that.getInfo.createDept;
        that.submitObj[name+'.CreateId'] = that.getInfo.createId;
        that.submitObj[name+'.CreateName'] = that.getInfo.createName;
        that.submitObj[name+'.CreateTime']= that.getInfo.createTime;
        that.submitObj['subtable.'+subName] = [];
        var arr = [];
        var arr3 = [];
        var arr2 = that.addTableData;
        var arr5 = [];
        var arr6 = [];
        for(var i=0;i<arr2.length;i++){
          arr5.push(arr2[i]);
          if(arr2[i].details.length > 0){
            var arr4 = arr2[i].details;
            for(var j = 0;j<arr4.length;j++){
              arr3.push(arr4[j])
            }

          }

        }
        arr6 = arr5.concat(arr3);
        arr6.forEach(function (item) {
          var aa = {
            [name+'.'+subName+'.ContractAmount']:item.contractAmount,
            [name+'.'+subName+'.ExpenseItem']:item.expenseItem,
            [name+'.'+subName+'.CostAfterAdjustment']:item.costAfterAdjustment,
            [name+'.'+subName+'.CostOfThisAdjustment']:item.costOfThisAdjustment,
            [name+'.'+subName+'.Id']:item.id,
            [name+'.'+subName+'.MyId']:that.data.myId,
            [name+'.'+subName+'.MyParentId']:item.myParentId,
            [name+'.'+subName+'.Pid']:item.pid,
            [name+'.'+subName+'.TargetCost']:item.targetCost,
          };
          // aa.tempid = "temp_" + Object.toGuid();
          arr.push(aa);
        });
        that.submitObj['subtable.'+subName] = arr;
        console.log(that.submitObj,'asdfd');
      },
      setArr(){
        var that = this;
        var name = 'TargetCostAdjustment';
        var subName = 'CostinformationAdjustment';
        var getArr = [];
        var arr1 = [];
        var arr2 = null;
        var arr3 = [];
        var obj = that.submitObj;
        for(let key in obj){
          if(key.split('.')[1] !== subName){
            arr1.push({
              name: key.split('.')[1],
              value: obj[key] === null?'':obj[key] === undefined?'':obj[key]
            })
          }else{
            arr2 = obj[key];
          }
        }

        for(var i=0;i<arr2.length;i++){
          var aa = arr2[i];
          var bb = []
          if(aa){
            for(let nm in aa){
              bb.push({
                name: nm.split('.')[2],
                value: aa[nm] === null?'':aa[nm] === undefined?'':aa[nm]
              })
            }
            arr3.push(bb);
          }

        }


        console.log(arr1);
        console.log(arr2);
        console.log(arr3);
        getArr[0] = {
          "mainTable": name,
          "data":arr1,
          "subTables":[
            {
              "subTable": subName,
              "data": arr3,
              "deleteData": []
            }
          ]
        }
        that.newData = getArr;
        console.log(getArr,'提交对象');
      },
      // 校验唯一性
      vaildOnlyData(){
        var isOk = false;
        var that = this;
        var val = that.$store.state.user.author.tenantId;
        var table = 'ct_'+val+ '_TargetCostAdjustment';
        // 判断唯一数据唯一性
        var MastercontNo = that.data.projectId;
        var MyId = that.data.myId;

        var data = [{
          tableName: table,
          myId: MyId,
          notProcInstState:[3,99], // 过滤条件
          field: [{
            fieldName: 'ProjectId',
            value: MastercontNo,

          }]
        }];
        //判断数据唯一性接口
        var fieldName = [];
        $.extendAjax("/extend/base/GetIsExist", JSON.stringify(data), "post", function(d) {
          d.data.forEach((item, index) => {
            if (item) {
              fieldName.push(data[index].field.map(x => {
                return x.fieldName
              }));
            }
          });
          isOk = d.data.every(x => x);
        });
        var title = '项目编号';
        if (fieldName.length > 0) {
          FUI.Window.showMsg2("\"" + title.toString() + "\"值已存在");
        }
        return !isOk;

      }
    }
  }
</script>

<style lang="scss" scoped>
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
