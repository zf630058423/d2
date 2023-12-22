<template>
  <div class="test">
    <el-form label-width="120px" ref="formRef" id="formRef" :model="data" :rules="formRules">
      <div class="projectInfo">
        <div class="title">项目信息</div>
        <div class="formData">
          <el-row :gutter="24" align="middle">
            <el-col :span="8">
              <el-form-item label="单据编号：">
                <el-input :style="{ width: '100%' }" v-model="data.billNo" placeholder="自动填写" disabled></el-input>
              </el-form-item>
              <el-form-item label="施工单位：">
                <el-input :style="{ width: '100%' }" v-model="data.constructionUnit" placeholder="自动填写" disabled ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="项目编号：" prop="projectNo">
                <el-input :style="{ width: '100%' }" v-model="data.projectNo" placeholder="请选择项目" disabled name="testName" >
                  <el-button slot="append" @click=" openCustomDialog('3ddedfb0-9b70-47f4-9016-466a4d684ee5','项目编号','BPM_XiangMuBianHao_4419','ct_bpm_projectfiles',800,500,0)"
                   icon="el-icon-search"></el-button>
                </el-input>
              </el-form-item>
              <el-form-item label="项目经理：">
                <el-input :style="{ width: '100%' }" v-model="data.projectManager" placeholder="自动填写" disabled ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="项目名称：">
                <el-input :style="{ width: '100%' }" v-model="data.projectName" placeholder="自动填写" disabled ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </div>
      <div class="planCenter">
        <div style="border-bottom: 1px solid #f3f3f3;display:flex;justify-content:space-between;align-items:center;">
          <div class="title" style="border:none;">计划内容</div>
          <div class="contentBtn-box" v-if="isReadOnly !== true">
            <el-button type="primary" size="mini" @click="fatherNode('', '')" >新增</el-button>
            <!-- <el-button type="primary" size="mini">导入</el-button>
            <el-button type="primary" size="mini">导出</el-button> -->
          </div>
        </div>

        <div class="formData">
          <el-table :data="data.detail" style="width: 100%;margin-bottom: 20px;" row-key="myId" border default-expand-all
           :tree-props="{ children: 'children', hasChildren: 'hasChildren' }" >
            <el-table-column prop="nodeName" label="任务名称">
            </el-table-column>
            <el-table-column prop="value" label="关键任务" width="180">
              <template v-slot="{ row }">
                <div> {{ row.keyNodes == 1 ? '是' : '否' }}</div>
              </template>
            </el-table-column>
            <el-table-column label="责任人" width="180px" prop="dutyPeople">
            </el-table-column>
            <el-table-column  label="计划开始日期"  prop="planBeginTime"  width="260px">
            </el-table-column>
            <el-table-column  label="计划结束日期"  prop="planEndTime"  width="260px">
            </el-table-column>
            <el-table-column label="操作" align="center" width="150px">
              <template slot-scope="scope" v-if="isReadOnly !== true">
                <el-button type="text" v-if="scope.row.isAllocate == 0" @click="addSonNode(scope.row, 'add')" >新增</el-button>
                <el-button type="text" @click="editNode(scope.row, 'edit')">编辑</el-button>
                <el-button type="text" @click="deleteNode(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <div class="footer">
        <el-row :gutter="24">
          <el-col :span="8">
            <el-form-item label="编制人：">
              <el-input :style="{ width: '100%' }" disabled placeholder="保存生成" v-model="data.createName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="编制人部门：">
              <el-input :style="{ width: '100%' }" disabled placeholder="保存生成" v-model="data.createDept"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="编制时间：">
              <el-input :style="{ width: '100%' }" disabled placeholder="保存生成" v-model="data.createTime"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
    </el-form>
    <addDialog @addNodeData="addNodeData" @editConfim="editConfim" :id="id" :type="type" :parentId="parentId" ref="addDialog"></addDialog>
  </div>
</template>

<script>
import addDialog from './addDialog.vue'
export default {
  components: {
    addDialog
  },
  data () {
    return {
      iframeDom:null,
      isReadOnly: false,
      tableData: [],
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
        detail: []
      },
      formRules: {
        projectNo: [
          { required: true, message: '请选择项目名称', trigger: 'change' }
        ]
      },
      parentId: '',
      id: '',
      type: ''
    }
  },
  mounted () {
    var that = this
    // window.myvm指向当前页面vue实例 复制粘贴
    window.myvm = that
    // window.$urlFormVue指向当前页面vue实例 复制粘贴
    window.$urlFormVue = that

    if (that.$route.query && that.$route.query.formAction === '0') {
      that.getSerialNumber()
    }
    if (that.$route.query.formAction !== '0') {
      that.getProjectData(that.$route.query.wiid)
    }
    window.addEventListener('message',this.deleteFn);
    //获取ifrme dom对象
    that.iframeDom = parent.parent.document.getElementById("urlFormIframe");
    that.iframeDocument = document.getElementById("formRef");
    that.setFormIframeHeight();
  },

  created () {
    this.initailWorkflowParms()
  },
  methods: {

  //动态设置ifrme高度 自适应内容高度
    setFormIframeHeight (){   
      this.$nextTick(()=>{
        this.iframeDom.height = this.iframeDocument.scrollHeight
        console.log("box.scrollHeight:",this.iframeDom.height)
      })        
    },

    // 返回  没用上
    backBtn () {
      FUI.Window.closeEdit()
    },
    // 获取详情
    getProjectData (id) {
      let res = Object.toExtendAjax('/extend/engmanager','/queryPlanOrganization',{ wiid: id },false,'get')
      if (res.code == 200) {
        this.data = res.data
      } else {
        this.$message.error(res.msg)
      }
    },
    // 保存整体数据  没用上
    saveConfirm () {
      const res = this.submitForm()
      if (res == 200) {
        if (this.$route.query.formAction == '0') {
          this.$message.success('新增成功！')
        } else {
          this.$message.success('编辑成功！')
        }
        setTimeout(() => {
          FUI.Window.closeEdit(true, this.$route.query.parentGridId)
        }, 1500)
      }
    },
    // 编辑节点
    editNode (row, type) {
      this.type = type
      this.$refs.addDialog.FormVisible = true
      this.$refs.addDialog.data = JSON.parse(JSON.stringify(row))
    },
    // 编辑节点确认
    editConfim (data) {
      this.recursionFn(this.data.detail, data, 'edit')
    },
    // 子节点
    addSonNode (row, type) {
      this.myId = ''
      this.parentId = row.myId
      this.type = type
      this.$refs.addDialog.FormVisible = true
    },
    // 新增节点
    addNodeData (data) {
      if (data.parentId == '') {
        data.idx = 0
        this.data.detail.push(data);
        this.setFormIframeHeight();
      } else {
        this.recursionFn(this.data.detail, data, 'add')
      }

      console.log("this.data.detail:",this.data.detail);
    },
    // 树结构递归函数
    recursionFn (list, data, type) {
      if (list.length > 0) {
        list.forEach((item, index) => {
          if (type == 'add') {
            this.setFormIframeHeight();
            if (item.myId == data.parentId) {
              data.idx = item.idx + 1
              return item.children.push(data)
            } else {
              return this.recursionFn(item.children, data, 'add')
            }
          } else if (type == 'delete') {
            if (item.myId == data.myId) {
              if (item.children.length > 0) {
                return this.$message.error('无法删除有子任务的节点！')
              } else {
                this.$message.success('删除成功')
                return list.splice(index, 1)
              }
            } else {
              return this.recursionFn(item.children, data, 'delete')
            }
          } else if (type == 'edit') {
            if (item.myId == data.myId) {
              return list.splice(index, 1, data)
            } else {
              return this.recursionFn(item.children, data, 'edit')
            }
          }
        })
      } else {
        return
      }
    },

    // 删除节点
    deleteNode (row) {
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.recursionFn(this.data.detail, row, 'delete')
        })
        .catch(() => {})
    },
    // 新增顶级父节点
    fatherNode (id, parentId) {
      this.myId = id
      this.parentId = parentId
      this.$refs.addDialog.FormVisible = true
    },
    // 获取单据编号
    getSerialNumber () {
      var that = this
      let res = Object.toAjaxJson(
        FUI.Handlers.FuiFrameworkHandler,
        'getSerialNumber',
        { counterCode: 'BPM_test' }
      )
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
    openCustomDialog (id, name, code, ObjName, width, height, radioMultiple) {
      var that = this
      var multi = radioMultiple == '1'
      CustomDialog(that, {
        customDialog: code,
        isTest: false,
        width: width,
        height: height,
        isMulti: multi,
        data: [
          {
            field: 'testName',
            property: 'myid'
          }
        ],
        callBack: function (data) {
          console.log(data)
          //自定义回调函数不是必须的，可删除
          that.data.projectNo = data[0].BillNo
          let {
            ConstructionUnit,
            ProjectName,
            ProjectManager,
            ProjectManagerID,
            MyId,
            ConstructionUnitID
          } = data[0]
          that.data.constructionUnit = ConstructionUnit
          that.data.projectName = ProjectName
          that.data.projectManager = ProjectManager
          that.data.projectManagerID = ProjectManagerID
          that.data.projectId = MyId
          that.data.constructionUnitId = ConstructionUnitID
        }
      })
    },
    // 下面的方法不要动 全部复制粘贴
    //============================================工作流操作按钮交互的函数=====================================
    //初始化iframe中url传入的流程相关参数
    initailWorkflowParms () {
      var that = this
      //获取流程页面的流程上下文[实用的流程信息从这里获取]
      that.wfContext = window.parent.myvm.wfContext
      //流程应用定义ID
      var appId = Object.toQueryString('appId') || ''
      //流程实例ID
      var wiid = Object.toQueryString('wiid') || ''
      // 判断流程实例id如果为空就从上下文取
      if (wiid == '') {
        wiid = that.wfContext.WorkflowInstanceId
      }
      //  当前页面状态：0未有实例，2待办，3查看,4待阅
      var formAction = Object.toQueryString('formAction') || 0
      //待办任务ID，待办时才有此参数
      var taskId = Object.toQueryString('taskId') || ''
      if (formAction > 2) {
        // 判断状态是否禁用输入框
        that.isReadOnly = true
      }
      // 流程表单ID
      that.appId = appId
      // 流程实例ID
      that.wiid = wiid
      // 流程状态
      that.formAction = formAction
      // 流程上下文id, 流程结束之后就不会再有
      that.taskId = taskId
    },
    //工作流点击"保存"时触发此函数，返回true:工作流继续提交， false:工作流不提交
    saveWorkflow (btnDef) {
      var that = this
      console.info('urlFormDemo saveWorkflow:', btnDef)
      var result = ''
      result = that.submitForm()
      return result
    },
    //工作流点击"提交"时触发此函数，返回:空字符串:工作流继续提交，返回"具体错误信息":工作流不提交
    sendWorkflow (btnDef) {
      var that = this
      console.info('urlFormDemo sendWorkflow', btnDef)
      var result = ''
      result = that.submitForm()
      return result
    },
    //工作流点击"驳回"时触发此函数，返回:空字符串:工作流继续提交，返回"具体错误信息":工作流不提交
    rejectWorkflow (btnDef) {
      var that = this
      console.info('urlFormDemo rejectWorkflow', btnDef)
      var result = ''
      result = that.submitForm()
      return result
    },
    //工作流点击"作废"时触发此函数，返回:空字符串:工作流继续提交，返回"具体错误信息":工作流不提交
    //content为作废意见
    invalidWorkflow (content) {
      var that = this
      console.info('urlFormDemo invalidWorkflow', content)
      var result = '' // "invalidWorkflow:"+content;
      return result
    },
    //工作流点击"确认转办"时触发此函数，返回:空字符串:工作流继续提交，返回"具体错误信息":工作流不提交
    //opinion:转办意见
    referredWorkflow (opinion) {
      var that = this
      console.info('urlFormDemo referredWorkflow', opinion)
      var result = '' // "referredWorkflow:"+opinion;
      return result
    },
    //工作流点击"提交"时触发此函数，返回:true校验通过，false校验不通过；
    //也可以返回具体的错误信息：空字符串，校验通过，返回具体错误信息校验不通过，同时弹出具体的错误信息。
    validateWorkflowForm (btnDef) {
      var that = this
      var success = that.validateForm('formRef')
      return success
    },
    //工作流工具栏上的其它按钮操作时返回:空字符串: 按钮继续执行，返回"具体错误信息":按钮不再执行
    otherWorkflowButtonClick (btnDef) {
      var that = this
      var actionName = btnDef.actionName
      //btnDef：按钮的定义实体
      console.info(actionName)
      console.info(btnDef)
      return ''
    },
    //============================================工作流操作按钮交互 结束==================================
    // 绑定表单数据
    loadData () {
      var that = this
      if (that.formAction != 0) {
        FUI.Form.bindDataToForm( that, '/workflow/demo/demoUrlForm/', 'getModelByWiid', that.wiid, null, null)
      }
    },
    // 表单提交
    submitForm () {
      var that = this
      fui_global_richeditorArrValueToInput(that)
      var success = that.validateForm('formRef')
      if (!success) return
      that.data.wiid = that.wiid
      that.data.formId = window.parent.myvm.wfContext.FormId
      that.data.businessKey = window.parent.myvm.wfContext.BusinessKey
      
      // 调用我们自己的表单保存接口
      var res = Object.toExtendAjax( '/extend/engmanager/', 'savePlanOrganization', JSON.stringify(that.data))
      if (res.code == 200) {
        return res.code
      } else {
        return res.msg
      }
    },
    // field: 可以是字段名也可以是字段定义的对象
    updateFieldValue (field, newValue, vueDataName, subVueDataName) {
      // 更新控件值
      var that = this
      var vueDataObj = vueDataName ? that[vueDataName] : that.data
      if (subVueDataName) vueDataObj = that[vueDataName][subVueDataName]
      if (typeof field === 'string') {
        vueDataObj[field] = newValue
      } else {
        if (field.fieldName) {
          vueDataObj[field.fieldName] = newValue
        } else if (field.vModel) {
          vueDataObj[field.vModel] = newValue
        } else if (field['field']) {
          vueDataObj[field['field']] = newValue
        }
      }
    },
    // 表单效验
    validateForm (refFormName) {
      var success = false
      this.$refs[refFormName].validate(valid => {
        success = valid
      })
      return success
    }
  }
}
</script>

<style lang="scss" scoped>
.test {
  .title { vertical-align: middle; display: flex; align-items: center; font-size: 12px; font-weight: bold; color: #0099ff; border-bottom: 1px solid #f3f3f3; 
    padding: 10px 0; line-height: 16px;}
  .title::before { content: ''; display: inline-block; width: 4px; height: 17px; margin-right: 5px; background-color: #006EFF; }
  .projectInfo { margin-bottom: 10px; padding: 0px; background-color: #fff;
    .formData {padding: 20px; }
  }
  .planCenter { min-height: 100px; background-color: #fff; padding:0; margin-bottom: 10px;
    .contentBtn-box{ margin-right: 20px;}
    .formData {padding:20px;
      .el-table--border{ border-left:1px solid #eee;border-top:1px solid #eee;}

    }
  }
  .footer {background-color: #fff;padding:10px 20px; box-sizing: border-box; 
    .el-form-item{ margin: 0;}
  
  }
}
</style>
