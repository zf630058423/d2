<template>
  <div class="cost">
    <el-form label-width="120px" ref="formRef" id="formRef" :model="data" :rules="formRules" :disabled="isFormDisabled" >
      <div class="pageTitle">项目维修申请</div>
      <div class="projectInfo">
        <div class="title">项目信息</div>
        <div class="formData">
          <el-row :gutter="24" align="middle">
            <el-col :span="8">
              <el-form-item label="单据编号：">
                <el-input v-model="data.billNo" placeholder="自动填写" disabled></el-input>
              </el-form-item>
              <el-form-item label="施工单位：">
                <el-input v-model="data.constructionUnit" placeholder="自动填写" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item class="mininput" label="项目编号：" prop="projectNo">
                <el-input v-model="data.projectNo" placeholder="请选择项目" disabled name="testName">
                  <el-button slot="append" @click="openCustomDialog('3ddedfb0-9b70-47f4-9016-466a4d684ee5' ,'项目编号', 'BPM_XiangMuBianHao_4419' ,'ct_bpm_projectfiles',800,500,0)" icon="el-icon-search"></el-button>
                </el-input>
                <span class="mylink" @click="getNoWiid1">链接</span>
              </el-form-item>
              <el-form-item label="项目经理：">
                <el-input v-model="data.projectManager" placeholder="自动填写" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="项目名称：">
                <el-input v-model="data.projectName" placeholder="自动填写" disabled></el-input>
              </el-form-item>
            </el-col>
            <!-- <el-col :span="8">
              <el-form-item label="项目利润率(%)：">
                <el-input v-model="data.ProjectProfitMargin" placeholder="系统计算" disabled></el-input>
              </el-form-item>
            </el-col> -->
          </el-row>
        </div>
      </div>

      <div class="projectInfo">
        <div class="title">维修信息</div>
        <div class="formData">
          <el-row :gutter="24" align="middle">
            <el-col :span="8">
              <el-form-item label="维修费用金额(元)：">
                <el-input v-model="data.maintenanceCosts" placeholder="自动计算" disabled></el-input>
              </el-form-item>
              <el-form-item label="班组承担(元)：">
                <el-input v-model="data.teamorGroupAssume" placeholder="自动计算" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="项目部承担(元)：">
                <el-input v-model="data.projectAssume" placeholder="自动计算" disabled></el-input>
              </el-form-item>
       
              <el-form-item label="甲方承担(元)：">
                <el-input v-model="data.firstPartyAssume" placeholder="自动计算" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="供应商承担(元)：">
                <el-input v-model="data.supplierAssume" placeholder="自动计算" disabled></el-input>
              </el-form-item>             
              <el-form-item label=" 外部单位承担(元)：">
                <el-input v-model="data.theExternalUnitsAssume" placeholder="自动计算" disabled></el-input>
              </el-form-item>               
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="维修原因说明："  prop="maintenanceReasons">
                <el-input type="textarea" v-model="data.maintenanceReasons" :rows="2" placeholder="请输入维修原因说明" >
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="24">
              <el-form-item label="维修实施计划：" prop="maintenanceImplementationPlan">
                <el-input type="textarea" :rows="2" placeholder="请输入维修实施计划" v-model="data.maintenanceImplementationPlan">
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </div>
      <div class="costInfo">
        <div style="border-bottom: 1px solid #f3f3f3;display:flex;justify-content:space-between;align-items:center;">
          <div class="title" style="border:none;">维修费用分摊信息</div>        
        </div>
        <div v-for="(item,index) in data.sharingInputs" :key="item.id" class="maintenance-allocation">
          <div class="maintenance-allocation-title">
            <h6>分摊信息{{index+1}}</h6>           
            <span v-if="index > 0"  :style="isFormDisabled ? {opacity: 0.4} :''" @click=" !isFormDisabled ? isDelete({text :'确定删除维修费用分摊信息'+(index+1)+'?',dialogVisible: true, btnText:['取消','删除'], btnFn:'deleteMoreList',index:index}) : ''">删除</span>
          </div>
           <div class="formData">
            <el-row :gutter="24" align="middle">
              <el-col :span="8">
                <el-form-item label="问题分类：" :prop="`sharingInputs.${index}.questionClassification`" :rules="formRules.questionClassification"  >
                  <el-input v-model="item.questionClassification" placeholder="输入问题分类"  disabled name="questionClassification">
                    <el-button slot="append" @click=" openCustomDialog1('3ddedfb0-9b70-47f4-9016-466a4d684ee5' ,'问题分类', 'BPM_WeiXiuWenTiFenLei_3454' ,'ct_bpm_repairproblemclassify',800,500,0,index) " icon="el-icon-search"></el-button>
                  </el-input> 
           
                </el-form-item>
                <el-form-item label="其他费用：" >
                  <el-input v-model="item.otherExpenses" placeholder="输入其他费用"   onkeyup="value=value.replace(/[^\d^\.]/g,'')" @blur="getAddNumber($event,index,'otherExpenses')">
                    <template slot="prepend">￥</template>
                  </el-input>
                </el-form-item>       
              </el-col>              
              <el-col :span="8">
                <el-form-item label="材料费：" >
                  <el-input v-model="item.materialsExpenses" placeholder="输入材料费"  onkeyup="value=value.replace(/[^\d^\.]/g,'')"  @blur="getAddNumber($event,index,'materialsExpenses')" >
                    <template slot="prepend">￥</template>
                  </el-input>
                </el-form-item>       
              
                <el-form-item label="费用合计：" :prop="`sharingInputs.${index}.totalCost`"  :rules="formRules.totalCost">
                  <el-input v-model="item.totalCost" placeholder="自动计算" disabled  onkeyup="value=value.replace(/[^\d^\.]/g,'')" >
                    <template slot="prepend">￥</template>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="人工费：" >
                  <el-input v-model="item.costofLabor" placeholder="输入人工费"  onkeyup="value=value.replace(/[^\d^\.]/g,'')"  @blur="getAddNumber($event,index,'costofLabor')"  >
                    <template slot="prepend">￥</template>
                  </el-input>
                </el-form-item>
                <el-form-item label="是否分摊：" :prop="`sharingInputs.${index}.whetherornotSplit`"  :rules="formRules.whetherornotSplit">
                  <el-radio-group v-model="item.whetherornotSplit" @change="whetherornotSplitFn($event,index)">
                    <el-radio label="1">是</el-radio>
                    <el-radio label="0">否</el-radio>
                  </el-radio-group>
                </el-form-item>               
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="维修方案："  :prop="`sharingInputs.${index}.maintenancePlan`"  :rules="formRules.maintenancePlan">
                  <el-input type="textarea" v-model="item.maintenancePlan" :rows="2" placeholder="请输入维修方案" >
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="问题描述：" :prop="`sharingInputs.${index}.problemDescription`"  :rules="formRules.problemDescription">
                  <el-input type="textarea" :rows="2" placeholder="请输入问题描述" v-model="item.problemDescription">
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="原因分析：" :prop="`sharingInputs.${index}.analysisofCauses`"  :rules="formRules.analysisofCauses">
                  <el-input type="textarea" :rows="2" placeholder="请输入原因分析" v-model="item.analysisofCauses">
                  </el-input>
                </el-form-item>       
              </el-col>
            </el-row>
           </div>
           <div class="my-table">
              <ul class="table-th" >                
                <li>序号</li>
                <li>分摊类型</li>
                <li>分摊对象</li>
                <li>分摊金额</li>
                <li><i :style="isFormDisabled ? {opacity: 0.4} :''" @click="!isFormDisabled ? addTableRow(index) :''" class="el-icon-circle-plus-outline adddelicon "></i></li>
              </ul>

              <ul class="table-tr" v-for="(tableItem, i) in item.detailsInputs" :key="tableItem.id+'childer-'+i" >                
                  <li>{{i+1}}</li>
                  <li>
                    <el-form-item style="margin:0" label=" " label-width="10px"  :prop="`sharingInputs.${index}.detailsInputs.${i}.splitType`" :rules="formRules.tableRowType">
                      <el-select v-model="tableItem.splitType" placeholder="请选择分摊类型" @change="typeChange($event,index,i)"  :disabled="item.whetherornotSplit ? false : true ">                    
                        <el-option label="项目部" value="1"></el-option>
                        <el-option label="班组" value="2"></el-option>
                        <el-option label="供应商" value="3"></el-option>
                        <el-option label="甲方" value="4"></el-option>
                        <el-option label="外部单位" value="5"></el-option>                      
                      </el-select>
                    </el-form-item>
                  </li>
                  <li>
                    <!-- //供应商 -->
                    <template v-if="tableItem.splitType==3">                
                      <el-form-item  style="margin:0" label=" " label-width="10px"  :prop="`sharingInputs.${index}.detailsInputs.${i}.shareTheObject`"  :rules="item.whetherornotSplit == 1 && tableItem.splitType ? formRules.tableRowName : [{required: false}]" >
                        <el-input v-model="tableItem.shareTheObject" placeholder="请输入分摊对象 "  :disabled="true" >
                          <el-button slot="append" @click="tableItem.splitType  ? openCustomDialog2('3ddedfb0-9b70-47f4-9016-466a4d684ee5' ,'供应商', 'BPM_GongYingShangDangAn_1852' ,'ct_bpm_customerfiles',800,500,0,[index,i]) :''" icon="el-icon-search"></el-button>
                        </el-input>
                      </el-form-item>  
                    </template>
                    <!-- 甲方 -->
                    <template v-else-if="tableItem.splitType==4">
                      <el-form-item  style="margin:0" label=" " label-width="10px"  :prop="`sharingInputs.${index}.detailsInputs.${i}.shareTheObject`"   :rules="item.whetherornotSplit == 1 && tableItem.splitType ? formRules.tableRowName : [{required: false}]" >
                        <el-input v-model="tableItem.shareTheObject" placeholder="请输入分摊对象"  :disabled="true" :name="tableItem.shareTheObject">
                          <el-button slot="append" @click="tableItem.splitType  ? openCustomDialog3('3ddedfb0-9b70-47f4-9016-466a4d684ee5' ,'建设单位', 'BPM_ClientFile_8313' ,'ct_bpm_customerfiles',800,500,0,[index,i]) : ''" icon="el-icon-search"></el-button>
                        </el-input>
                      </el-form-item>  
                    </template>

                    <!-- //班组/外部单位 -->
                    <template v-else>
                      <el-form-item  style="margin:0" label=" " label-width="10px"  :prop="`sharingInputs.${index}.detailsInputs.${i}.shareTheObject`"  :rules="item.whetherornotSplit == 1 && tableItem.splitType ? formRules.tableRowName : [{required: false}]"  >
                        <el-input v-model="tableItem.shareTheObject" placeholder="请输入分摊对象" :disabled="tableItem.splitType ? false : true " ></el-input>
                      </el-form-item>                        
                    </template>                   
                  </li>
                  <li>
                    <el-form-item  style="margin:0" label=" " label-width="10px"   :prop="`sharingInputs.${index}.detailsInputs.${i}.contributions`" :rules="item.whetherornotSplit == 1 && tableItem.splitType ? formRules.tableRowMoney : [{required: false}]" >
                      <el-input v-model="tableItem.contributions" placeholder="请输入分摊金额"  :disabled="tableItem.splitType ? false : true "  onkeyup="value=value.replace(/[^\d^\.]/g,'')" @blur="getAddTableNumber($event,index,i,'contributions')">
                        <template slot="prepend">￥</template>
                      </el-input>
                    </el-form-item>
                  </li>
                  <li>                    
                    <!-- <el-popconfirm :title="`确认删除序号[${i+1}]分摊项吗？`" @onConfirm="deleteTableRow(index,i)">
                        <i slot="reference" class="el-icon-remove-outline adddelicon"></i>
                    </el-popconfirm> -->
                    <i slot="reference" class="el-icon-remove-outline adddelicon"  :style="isFormDisabled ? {opacity: 0.4} :''"  @click="!isFormDisabled ? isDelete({text :'确认删除序号'+(i+1)+'分摊项吗？',dialogVisible: true, btnText:['取消','删除'], btnFn:'deleteTableRow',index:index,itemIndex:i}) : ''"></i> 
                  </li>
              </ul>
              <div class="total">
                <p v-if=" (item.tableTotal*1) > (item.totalCost*1) ">列表合计金额不能 > 费用合计金额</p>
                <p v-else></p> 
                合计：{{item.tableTotal ? item.tableTotal : '0.00' }}</div> 
           </div>
        </div>

        <div class="contentBtn-box" >  
          <el-button type="primary" size="small" @click="addMoreList">添加明细</el-button>
        </div>  
      </div>

                 
      <div class="projectInfo">        
        <div class="title">附件上传</div>
        <div class="formData">
          <div  class="upload-box">          
              <!-- <f2bpm-file :field="field" :fieldvalue="data[field.vModel]" @updatevalue="updateFieldValue11"></f2bpm-file> -->
              <uploadFile ref="file" @showFile="showFile" :isReadOnly="!isFormDisabled">
                <div name="tip"  style="font-size:14px; color:#666; line-height:24px; margin-top: 10px; ">
                <p>允许上传的文件类型：*.doc;*.docx;*.ppt;*.pptx;*.xls;*.xlsx;*.jpg;*.gif;*.png;*.zip;*.rar;*.pdf;*.vsd;*.ppsx;*.dwt;*.dwg;*.dws;*.dxf;*.mp4;*.bmp;*.vsdx每个文件大小不能超过2G；</p>
                <p>文件名称请使用中英文或数字，特殊字符不能作为文件名</p>
              </div>
              </uploadFile>
      
          </div>
        </div>     
      </div>
      <!-- <div class="planCenter">
        <div style="border-bottom: 1px solid #f3f3f3;display:flex;justify-content:space-between;padding-bottom:5px;align-items:center;">
          <div class="title" style="border:none;">计划内容 </div>
          <div class="contentBtn-box" v-if="isReadOnly!==true">
            <el-button type="primary" size="small" @click="fatherNode('','')">新增 </el-button>
            <el-button type="primary" size="small">导入</el-button>
            <el-button type="primary" size="small">导出</el-button>
          </div>
        </div>

        <div class="formData">
          <el-table :data="data.detail" style="width: 100%;margin-bottom: 20px;" row-key="myId" border default-expand-all :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
            <el-table-column prop="nodeName" label="任务名称"></el-table-column>
            <el-table-column prop="value" label="关键任务" width="180">
              <template v-slot="{row}">
                <div>{{row.keyNodes==1?'是':'否'}}</div>
              </template>
            </el-table-column>
            <el-table-column label="责任人"  width="180px"  prop="dutyPeople"> </el-table-column>
            <el-table-column label="计划开始日期" prop="planBeginTime" width="260px"> </el-table-column>
            <el-table-column label="计划结束日期" prop="planEndTime" width="260px"> </el-table-column>
            <el-table-column label="操作" align="center" width="150px">
              <template slot-scope="scope" v-if="isReadOnly!==true">
                <el-button type="text" v-if="scope.row.isAllocate==0 &&scope.row.idx!==2" @click="addSonNode(scope.row,'add')">新增</el-button>
                <el-button type="text" @click="editNode(scope.row,'edit')">编辑 </el-button>
                <el-button type="text" @click="deleteNode(scope.row)">删除 </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div> -->
      <div class="footer">
        <el-row :gutter="24">
          <el-col :span="8">
            <el-form-item label="编制人：">
              <el-input disabled placeholder="保存生成" v-model="data.createName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="编制人部门：">
              <el-input disabled placeholder="保存生成" v-model="data.createDept"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="编制时间：">
              <el-input disabled placeholder="保存生成" v-model="data.createTime"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
    </el-form>
  </div>
</template>
<script>
  import uploadFile from './upload_file';
  export default {
    components: {
      uploadFile
    },
    data() {
      const validateNumber = (rule,value,callback) =>{      
        console.log("value1:",value);
        if( value ===undefined || value===null || value ==='' ){          
            callback(new Error('金额不能为空'))
         }else{
          if (!(/^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/).test(value)) {
            callback(new Error('请输入数字值'))
          } else{
              // if(value.indexOf(".") != -1 && value.split('.').length > 2){
              //   callback(new Error('请输入正确格式的金额')) //防止输入多个小数点
              // }else if(value.indexOf(".") != -1 && value.split('.')[1].length > 2){
              //   callback(new Error('请输入正确的小数位数')) //小数点后两位
              // }else{
                callback();
              // }
            }
         }
       };

      return {
        testData:{
          parentKey:'ProjectMaintenanceApplication',
          childKey:["sharingInputs","arr1"],  
          id:'0',
          text:'测试',
          sharingInputs:[
            {
              id0:"0-1",
              text0:"测试1",
              obj:{
                id:"0-1-1",
                text:"测试2"
              }
            }
          ],
          sharingInputs :[{
            id1:"1",
            text1:"测试3",
            arr1:[
              {
                id2:"1-1",
                test:'测试4'
              },
              {
                id2:"1-2",
                test:'测试5'
              }
            ]
          },
          {
            id1:"1",
            text1:"测试3",
            arr1:[
              {
                id2:"1-1",
                test:'测试4'
              },
              {
                id2:"1-2",
                test:'测试5'
              }
            ]
          }
        ]
        },

        isFormDisabled:false,
        iframeDom:null,
        iframeDocument:null,
        // isReadOnly: false,        
        data: {  
          // procInstState:0,//
          parentKey:'ProjectMaintenanceApplication',
          childKey:["sharingInputs",'detailsInputs'],     
          createName:'',
          createDept:'',
          createTime:'',
          fileData: [], // 附件数据
          myId: '',         
          formId: '',
          wiid: '',
          projectId: '',
          
          businessKey: '',
          myParentId:'',
          billNo: '',  
          projectNo: '',
          projectName: '',
          constructionUnit: '',
          constructionUnitId: '',
          projectManager: '',
          projectManagerID: '',
          maintenanceCosts:'',


          //维修信息        
          teamorGroupAssume:'',
          projectAssume:'',
          firstPartyAssume:'',
          supplierAssume:'',
          theExternalUnitsAssume:'',
          maintenanceReasons:'',
          maintenanceImplementationPlan:'',

          //费用分摊
          sharingInputs:[
            {
              id:0,
              problemClassification:'1',
              questionClassification:'',
              questionClassificationId:'',
              otherExpenses:'',
              materialsExpenses:'',
              totalCost:'',         
              costofLabor:'',
              whetherornotSplit:'1',
              maintenancePlan:'',
              problemDescription:'',
              analysisofCauses:'',
              tableTotal:'',
              detailsInputs:[
                {
                  id:'00',
                  splitType: '',
                  shareTheObject: '',
                  shareTheObjectId:'',             
                  contributions: '',                 
                }
              ]
            }
          ],

          // ProjectProfitMargin: '',
          detail: []
        },
        formRules: {
          projectNo: [
            {required: true, message: '请选择项目名称', trigger: 'change'},
          ], 
          maintenanceReasons:[ 
            {required: true, message: '请输入维修原因', trigger: 'change'}
          ] ,
          maintenanceImplementationPlan:[ 
            {required: true, message: '请输入维修实施计划', trigger: 'change'}
          ] ,


          questionClassification:[ {required: true, message: '请输入问题分类', trigger: 'change'}] ,
          // otherExpenses:[ { required: true, message: '输入其他费用',  validator: validateNumber, trigger: 'blur' }],
          // materialsExpenses:[ { required: true, message: '输入材料费', validator: validateNumber, trigger: 'blur' }],         
          // costofLabor:[ { required: true, message: '输入人工费', validator: validateNumber, trigger: 'blur' }],
          totalCost:[ { required: true, message: '输入费用合计', trigger: 'change' }],
          whetherornotSplit:[ { required: true, message: '选择是否分摊', trigger: 'blur' }],
          maintenancePlan:[ { required: true, message: '请输入维修方案', trigger: 'blur' }],
          problemDescription:[ { required: true, message: '请输入问题描述', trigger: 'blur' }],
          analysisofCauses:[ { required: true, message: '请输入原因分析', trigger: 'blur' }],
          tableRowType:[ { required: true, message: '请选择分摊类型', trigger: 'change' }],
          tableRowName:[ { required: true, message: '请输入分摊对象', trigger: 'blur' }],
          tableRowMoney:[ { required: true,validator: validateNumber, trigger: 'blur' }]
        },
        parentId: '',
        id: '',
        type: '',    
    
      }
    },

    mounted() {
      var that = this;
      // console.log("that.$route.query:",that.$route.query)
      // window.myvm指向当前页面vue实例 复制粘贴
      window.myvm = that;
      // window.$urlFormVue指向当前页面vue实例 复制粘贴
      window.$urlFormVue = that;   

      if (that.$route.query && that.$route.query.formAction === '0') {
        that.getSerialNumber()
        that.data.wfContext = window.parent.myvm.wfContext;
        that.data.createName = that.wfContext.ProcInstCreatorRealName;
        that.data.createDept = that.wfContext.ProcInstCreatorOrgName;
        that.data.createTime = that.wfContext.StartedTime;
        //获取编制人信息
        that.extend_fuiOnPageLoad();
      }
      if (that.$route.query.formAction !== '0') {
        // console.log("that.$route.query:",that.$route.query)
        that.getProjectData(that.$route.query.wiid)
      }

      window.addEventListener('message',this.deleteFn);
   
      //获取ifrme dom对象
      that.iframeDom = parent.parent.document.getElementById("urlFormIframe");
      that.iframeDocument = document.getElementById("formRef");

      let _testData=JSON.parse(JSON.stringify(that.testData));
      let _newTestData=that.setDataName(_testData,_testData.parentKey,_testData.childKey,null);
      console.log("_newTestData:",_newTestData);
    },

    created() {
      this.initailWorkflowParms()
      this.setFormIframeHeight();
    },
    methods: {      
      // setDataName(_data,parentName){
      //   let _parentName= parentName || 'parent';  
      //   let that=this;
      //   if(_data){
      //     let _newData={};
      //     for(let lableName in _data){
      //       console.log(lableName);
      //       let itemData=_data[lableName];
      //       if(Object.prototype.toString.call(itemData)=='[object Array]'){
      //         console.log("数组子集")
      //         for(let j=0; j<_data[lableName].length ;j++){
      //           _newData[_parentName+'.'+lableName]=that.setDataName( _data[lableName][j],_parentName+'.'+lableName)
      //         }
      //       }else if(Object.prototype.toString.call(itemData)=='[object Object]'){
      //         console.log("对象子集")
      //         if(lableName.indexOf("parent.") !=-1){//是子级 这添加
      //           console.log("对象子集1")
      //           _newData[_parentName+'.'+lableName]=that.setDataName(_data[lableName],_parentName+'.'+lableName)
      //         }else{
      //           _newData[_parentName+'.'+lableName]=that.setDataName(_data[lableName],_parentName+'.'+lableName)
      //         }              
      //       }else{
      //         _newData[_parentName+'.'+lableName]=_data[lableName];
      //       }
      //       console.log( Object.prototype.toString.call(itemData))
      //     }
      //     console.log("_newData:",_newData);
      //     return _newData;
      //   }
      // },

        //设置数据格式  data源数据  parentKey主表名 childKey字表名 parentName拼接属性名
      setDataName(data,parentKey,childKey,parentName){       
        console.log(data,parentKey,childKey,parentName);
        let that=this;
        let _parentName= parentName ? parentName : null; 
        let _parentKey=parentKey ? parentKey : null;
        let _childKey=childKey ? childKey : null;
        let _data=data;  
        let _newData={};  
        if(_data){   
        
          // if(Object.prototype.toString.call(_data)=='[object Array]'){
          //   _newData=[];
          //   let _itemNewData={}
          //   for(let i=0; i<_data.length; i++){
          //     for(let lableName in _data){            
          //       if(lableName!=='parentKey' &&lableName!== 'childKey' ){//排除主表子表表名属性
          //         let itemData =[lableName]
          //         if(_childKey.includes(lableName)){//是子表数据     
          //           if(Object.prototype.toString.call(itemData)=='[object Array]'){
          //             for(let j=0; j<_data[lableName].length ;j++){
          //               _itemNewData['subtable.'+lableName]=that.setDataName(_data[i][lableName][j],_parentKey,_childKey,_parentKey+'.'+lableName)
          //             }
          //           }else if(Object.prototype.toString.call(itemData)=='[object Object]'){        
          //             _itemNewData['subtable.'+lableName]=that.setDataName(_data[i][lableName],_parentKey,_childKey,_parentName+'.'+lableName)
          //           }else{
          //             _itemNewData['subtable.'+lableName]=that.setDataName(_data[i][lableName],_parentKey,_childKey,_parentName+'.'+lableName);
          //           }  
          //         }else{//主表数据或子表子数据
          //           if(Object.prototype.toString.call(itemData)=='[object Array]'){
          //             for(let j=0; j<_data[lableName].length ;j++){
          //               _itemNewData[i][(_parentName!=null  ? _parentName : _parentKey)+'.'+lableName]=that.setDataName( _data[i][lableName][j],_parentKey,_childKey,_parentName+'.'+lableName)
          //             }
          //           }else if(Object.prototype.toString.call(itemData)=='[object Object]'){
          //             _itemNewData[(_parentName!=null ? _parentName : _parentKey)+'.'+lableName]=that.setDataName(_data[i][lableName],_parentKey,_childKey,_parentName+'.'+lableName)              
          //           }else{             
          //             _itemNewData[(_parentName!=null ? _parentName+'.' : _parentKey+'.')+lableName]=_data[i][lableName];
          //           }   
          //         }
          //       }          
          //     }
          //     _newData.push(_itemNewData)
          //   }
          // }else{
            // _newData={};
            for(let lableName in _data){            
              if(lableName!=='parentKey' &&lableName!== 'childKey' ){//排除主表子表表名属性
                let itemData =_data[lableName]
                if(_childKey.includes(lableName)){//是子表数据     
                  if(Object.prototype.toString.call(itemData)=='[object Array]'){
                    _newData=[];
                    let item={};
                    for(let j=0; j<_data[lableName].length ;j++){
                      item['subtable.'+lableName]=that.setDataName(_data[lableName][j],_parentKey,_childKey,_parentKey+'.'+lableName)
                      _newData.push(item);
                    }

                  }else if(Object.prototype.toString.call(itemData)=='[object Object]'){     
                    _newData={};   
                    _newData['subtable.'+lableName]=that.setDataName(_data[lableName],_parentKey,_childKey,_parentName+'.'+lableName)
                  }else{
                    _newData={};   
                    _newData['subtable.'+lableName]=that.setDataName(_data[lableName],_parentKey,_childKey,_parentName+'.'+lableName);
                  }  
                }else{//主表数据或子表子数据
                  if(Object.prototype.toString.call(itemData)=='[object Array]'){
                    _newData=[];
                    let item={};
                    for(let j=0; j<_data[lableName].length ;j++){
                      item[(_parentName!=null  ? _parentName : _parentKey)+'.'+lableName]=that.setDataName( _data[lableName][j],_parentKey,_childKey,_parentName+'.'+lableName)
                      _newData.push(item);
                    }
                  }else if(Object.prototype.toString.call(itemData)=='[object Object]'){
                    _newData={};   
                    _newData[(_parentName!=null ? _parentName : _parentKey)+'.'+lableName]=that.setDataName(_data[lableName],_parentKey,_childKey,_parentName+'.'+lableName)              
                  }else{   
                    _newData={};             
                    _newData[(_parentName!=null ? _parentName+'.' : _parentKey+'.')+lableName]=_data[lableName];
                  }   
                }
              }          
            }  
          // }
     
          return _newData;
        }
      },
      
      //动态设置ifrme高度 自适应内容高度
      setFormIframeHeight (){
         this.$nextTick(()=>{
          this.iframeDom.height = this.iframeDocument.scrollHeight
          console.log("box.scrollHeight:",this.iframeDom.height)
         })      
      },
      

      //FUI页面加载完成之后触发  FUI页面加载完成之后触发
      extend_fuiOnPageLoad() {
        let that=this;
        let userDataOrgId=myvm.$store.state.user.author.orgId;
        //根据 编制人所属部门（根据关联组织 找到 财务组织） 判断自动带出 付款财务组织
        setTimeout(() => {
          // 调用接口
          $.extendAjax(`/extend/everydaywork/queryFinanceOrganization?associatedOrganizationsId=${userDataOrgId}`,'','get',function (d) {
              if (myvm.data['payOrgId'] == '') {
                myvm.data['payOrg'] = d.data.superiorFinancialOrganization
                myvm.data['payOrgId'] = d.data.superiorFinancialOrganizatId
                that.paymentAccountNumber();
              }
            }
          )
        }, 500)
      },

      // 项目编号超链接 打开项目详情
      getNoWiid1() {
            var isOk = false
            var val = myvm.$store.state.user.author.tenantId
            var tableName = 'ct_' + val + '_projectfiles'
            var id = myvm.data['projectId']
            console.log(this.data.projectId);
            if (!id) {
              FUI.Window.showMsg(myvm, '请先选择需要跳转的项目')
              return isOk
            }
            setTimeout(function() {
                var data = [{
                  "tableName": tableName,
                  "myId": id
                }]
                $.extendAjax("/extend/hyperLink/getHyperLink", JSON.stringify(data), "post", function(res) {
                  if (res) {
                    var __webpath = '';
                    var appId = '';
                    var formAction = 3;
                    var wiid = res.data[0].wiId;
                    var formId = res.data[0].formId;
                    var myId = res.data[0].myId;
                    var businessKey = res.data[0].businessKey;            
                    var that = this;
                    var dg = FUI.DataGrid.Create(that, tableName, tableName, 'grid', true, true, true);
                    var url = __webpath + '/workflow/noWorkflowform/index/?formId=' + formId + '&myId=' + myId + '&businessKey=' + businessKey;;
                    var preTitle = '查看';
                    var wfAction = 3;
                    FUI.Window.openEdit(url, preTitle, wfAction, dg.GridId, null, null, null, dg.MainTable, '', true,'','',true);
                  }
                });
            }, 500)

      },
            
      //是否分摊切换 e=选中值(0/1) index=当前明细下标 
      whetherornotSplitFn(e,index){
        console.log("e,index:",e,index);
        if(e==0 || e==undefined){//0
          this.$confirm('修改后会清除当前已填写分摊项列表明细，确定分摊改为否？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$set(this.data.sharingInputs[index],'detailsInputs',[])
            this.sumTableNumber(index);
          }).catch(() => {
            this.$set(this.data.sharingInputs[index],'whetherornotSplit',1)
          });
         
        }else{
          this.$set(this.data.sharingInputs[index],'whetherornotSplit',e)
        }
      },

      //新增明细
      addMoreList(){
        let _length= this.data.sharingInputs.length;
        this.data.sharingInputs.push(
          {
              id:_length,
              problemClassification:'1',
              otherExpenses:'',
              materialsExpenses:'',
              totalCost:'',         
              costofLabor:'',
              whetherornotSplit:'1',
              maintenancePlan:'',
              problemDescription:'',
              analysisofCauses:'',
              detailsInputs:[
                {
                  id:`table${_length}`,
                  splitType: '',
                  shareTheObject: '',
                  shareTheObjectId:'',               
                  contributions: '',                 
                }, 
              ]
          }
        )
        this.setFormIframeHeight();
      },

      //调起父窗口二次询问框 index=当前操作下标 btnText=[]取消确定按钮文字 btnFn=确定删除事件 dialogVisible=是否显示二次询问框 text=询问类容 itemIndex=双重循环第二层下标
      // {text :'确定删除维修费用分摊信息'+(index+1)+'?',dialogVisible: true, btnText:['取消','删除'], btnFn:'deleteMoreList',index:index,itemIndex:i}
      isDelete(data){  
        console.log("data1111:",data);
        window.parent.postMessage(data,'/');        
      },
      
      //二次询问框 确认删除
      deleteFn(deldteData){
        // console.log("data2222:",deldteData);
        if(deldteData.data.btnFn){
          this[deldteData.data.btnFn](deldteData.data.index,deldteData.data.itemIndex);
        }
      },

      //删除明细 index=当前明细下标 
      deleteMoreList(index){
        this.data.sharingInputs.splice(index,1);
        this.sumTableNumber()
        this.setFormIframeHeight();
        this.sumMaintenanceCosts();
      },    

      //添加明细表格单行 i=当前明细下标
      addTableRow(i){
        let _id= this.data.sharingInputs[i]['id'];
        this.data.sharingInputs[i].detailsInputs.push(  {
          id:`${_id}chidler${i}`,
          splitType:'',
          shareTheObject: '',               
          contributions:'',
        })
        this.setFormIframeHeight();     
      },

      //删除明细表格单行 i=当前明细下标  index=当前明细表格行下标
      deleteTableRow(i,index){
        this.data.sharingInputs[i].detailsInputs.splice(index,1)
        this.sumTableNumber(i);      
        this.setFormIframeHeight();
      },

      //计算单项合计  index=当前分摊下标 
      sumNumber(index){
        let item= this.data.sharingInputs[index];
        let newTotal = (item.otherExpenses*1)+ (item.materialsExpenses*1)+ (item.costofLabor*1);
        // this.data.sharingInputs[index]['totalCost']=this.priceFormat(newTotal)
        this.$set(this.data.sharingInputs[index], 'totalCost', this.priceFormat(newTotal));
        this.sumMaintenanceCosts();
      },

      //设置金额格式 el=当前input index=当前分摊项下标 当前下标分摊项 属性名
      getAddNumber(el,index,name){
        console.log("el,index:",el.target.value,index);
        let temp = Number(el.target.value);
        // this.data.sharingInputs[index][name] = this.priceFormat(temp);
        this.$set(this.data.sharingInputs[index], name, this.priceFormat(temp))
        this.sumNumber(index);
      },

      //设置分摊项表格金额格式 el=当前input index=当前分摊项下标 itemIndex=当前下标分摊项detailsInputs当前下标 name=当前下标分摊项属性名
      getAddTableNumber(el,index,itemIndex,name){
        let temp = Number(el.target.value);
        this.data.sharingInputs[index].detailsInputs[itemIndex][name] = this.priceFormat(temp);
        this.sumTableNumber(index);
      },

      //分摊切换组织 el=当前下拉选择值 index=当前分摊项下标 itemIndex=当前下标分摊项detailsInputs当前下标
      typeChange(el,index,itemIndex){   
        this.$set(this.data.sharingInputs[index].detailsInputs[itemIndex], 'shareTheObject','');//清空分摊对象     
        this.sumTableNumber();
      },

      //计算全局合计  
      sumTableNumber(index){      
        let _sharingInputs=this.data.sharingInputs;
        // let _problemClassification=0;
        let _projectAssume=0;
        let _teamorGroupAssume=0;
        let _supplierAssume=0;
        let _firstPartyAssume=0;
        let _theExternalUnitsAssume=0;       
        
        for(let i=0; i<_sharingInputs.length; i++ ){       
          for(let j=0; j<_sharingInputs[i].detailsInputs.length; j++){
            let _splitType=_sharingInputs[i].detailsInputs[j].splitType;
            console.log("_splitType:",_splitType,_sharingInputs[i].detailsInputs[j]);
            switch(_splitType){
              case "1" : 
                _projectAssume+=(_sharingInputs[i].detailsInputs[j].contributions*1)  
                break;
              case "2" :
                 _teamorGroupAssume+=(_sharingInputs[i].detailsInputs[j].contributions*1)                
                break;
              case "3" : 
                _supplierAssume+=(_sharingInputs[i].detailsInputs[j].contributions*1)  
                break;
              case "4" :    
                _firstPartyAssume+=(_sharingInputs[i].detailsInputs[j].contributions*1) 
                break;
              case "5" :
                _theExternalUnitsAssume+=(_sharingInputs[i].detailsInputs[j].contributions*1)           
                break;
            }             
                  
            this.data['firstPartyAssume']=this.priceFormat(_firstPartyAssume) 
            this.data['teamorGroupAssume']=this.priceFormat(_teamorGroupAssume)   
            this.data['supplierAssume']=this.priceFormat(_supplierAssume)   
            this.data['projectAssume']=this.priceFormat(_projectAssume)    
            this.data['theExternalUnitsAssume']=this.priceFormat(_theExternalUnitsAssume) 
                  
          }        
        }

        //计算单项分摊列表合计
        if(index!==undefined &&  index!==null && index!==''){
          let _itemTable=_sharingInputs[index].detailsInputs;
          let _itemTableTotal=0;
          for(let i=0; i< _itemTable.length; i++){
            console.log("index111:",_itemTable[i]);
            _itemTableTotal+=(_itemTable[i].contributions*1)  
          }
          console.log("index222:",index,_itemTableTotal,_itemTable);
          // this.data.sharingInputs[index].tableTotal=this.priceFormat(_itemTableTotal) 
          this.$set(this.data.sharingInputs[index], 'tableTotal', this.priceFormat(_itemTableTotal))
        }

        // _problemClassification=(_firstPartyAssume*1) +(_teamorGroupAssume*1) + (_supplierAssume*1)+ (_projectAssume*1) + (_theExternalUnitsAssume*1);
        // this.data.maintenanceCosts=this.priceFormat(_problemClassification)
      },

      //计算总报销金额
      sumMaintenanceCosts(){
        let _sharingInputs=this.data.sharingInputs;
        let _maintenanceCosts=0;
        for(let i=0; i< _sharingInputs.length; i++){
          _maintenanceCosts+=(_sharingInputs[i].totalCost*1);
        }
        this.$set(this.data, 'maintenanceCosts',this.priceFormat(_maintenanceCosts));  
      },

      //日期字符串转日期
      parserDate (date) {  
        var t = Date.parse(date);  
        if (!isNaN(t)) {  
            return new Date(Date.parse(date.replace(/-/g, "/")));              
        } else {  
            return new Date();  
        }  
      },

    //   saveFormFunc() {
    //     var workflowformSender = "/workflow/workflowformSender/";
    //     var dataJsonParm = {};
    //     dataJsonParm.formAction = WFContext.WorkflowformAction;
    //     dataJsonParm.wiid = WFContext.WorkflowInstanceId;
    //     dataJsonParm.formId = WFContext.FormId;
    //     dataJsonParm.wid = WFContext.WorkflowId;
    //     dataJsonParm.appId = WFContext.AppId;
    //     dataJsonParm.taskId = WFContext.TaskId;
    //     dataJsonParm.WorkflowTitle = '设备进场单';
    //     WF.Workflowform.submitWorkflowform(myvm, workflowformSender, "saveWorkflow", null, dataJsonParm, null, null, function(mssg) {
    //         Object.toCloseLoading();
    //         if (mssg === false) return false;
    //         if (mssg.success) {
    //           if (window.opener != null) {
    //             try {
    //               //如果有自定义的方法调用业务表单自定义刷新父窗口的方法
    //               if (typeof customRefreshOpenerWindow == "function") {
    //                 customRefreshOpenerWindow.call(this);
    //               } else {
    //                 window.opener.window.refreshTargetGrid("grid");
    //               }
    //             } catch (err) {}
    //           }
    //           if (WFContext.WorkflowformAction == WF.WorkflowformAction.NoInstance) {
    //             FUI.Window.showMsg2(null, mssg.msg, null, 1);
    //             //拟稿保存后跳转到草稿模式
    //             window.location = __webpath + "/workflow/workflowform/index/?appId=" + WFContext.AppId + "&formAction=2&wiid=" + WFContext.WorkflowInstanceId + "&taskId=" + WFContext.TaskId;
    //             //无#//无#window.location.reload();
    //           } else {
    //             FUI.Window.showMsg2(mssg.msg, null, 1, function() {
    //               window.location.reload();
    //             });
    //           }
    //         } else {
    //             FUI.Window.showMsg(mssg.msg);
    //         }
    //     }, true);
    // },


      //保留两位小数
      priceFormat (num, n) {
        if(num==='0' || num===0){
          num=0
        }else{
          n = n || 2;
          // let symbol = ",";
          if (num === null) return num;
          if (typeof num !== 'number') throw new TypeError('num参数应该是一个number类型');
          if (n < 0) throw new Error('参数n不应该小于0');
          let hasDot = parseInt(num) != num;//这里检测num是否为小数，true表示小数
          let m = (n != undefined && n != null) ? n : 1;
          num = m == 0 ? num.toFixed(m) + '.' : hasDot ? (n ? num.toFixed(n) : num) : num.toFixed(m);
          // symbol = symbol || ',';
          // num = num.toString().replace(/(\d)(?=(\d{3})+\.)/g, function (match, p1, p2) {
          //   return p1 + symbol;
          // });
          if (n == 0 || (!hasDot && !n)) {//如果n为0或者传入的num是整数并且没有指定整数的保留位数，则去掉前面操作中的小数位
            num = num.substring(0, num.indexOf('.'));
          }
        }
        
        return num;
      },
      //去除千分位中的‘，’
      delcommafy (num) {
        if (!num) return num;
        num = num.toString();
        num = num.replace(/,/gi, '');
        if (num.indexOf('.00') > 0) num = parseInt(num);
        return num;
      },

      //附件上传
      handleRemove(file, fileList) {
        console.log(file, fileList);
      },
      handlePreview(file) {
        console.log(file);
      },
      handleExceed(files, fileList) {
        this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
      },
      beforeRemove(file, fileList) {
        return this.$confirm(`确定移除 ${ file.name }？`);
      },


      // 返回  没用上
      backBtn() {
        FUI.Window.closeEdit();
      },
      // 获取详情
      getProjectData(id) {
        console.log("id:",id)
        let res = Object.toExtendAjax('/extend/projectMaintenanceApplication', '/queryProjectMaintenanceApplication', {'wiid': id}, false, 'get');
        if (res.code == 200) {
          res.data.maintenanceCosts=this.priceFormat(res.data.maintenanceCosts);
          res.data.teamorGroupAssume=this.priceFormat(res.data.teamorGroupAssume);
          res.data.projectAssume=this.priceFormat(res.data.projectAssume);

          res.data.firstPartyAssume=this.priceFormat(res.data.firstPartyAssume);
          res.data.supplierAssume=this.priceFormat(res.data.supplierAssume);
          res.data.theExternalUnitsAssume=this.priceFormat(res.data.theExternalUnitsAssume);
          this.data=res.data;
          var files = res.data.file;
          if(files){
            this.$refs.file.getObj(files);
          }
          this.data.field =res.data.file;
          let _data=JSON.parse(JSON.stringify(this.data.sharingInputs));         
       
          for(let i=0; i<_data.length; i++){
            _data[i].otherExpenses = this.priceFormat( _data[i].otherExpenses)
            _data[i].materialsExpenses =this.priceFormat(_data[i].materialsExpenses)
            _data[i].totalCost =this.priceFormat(_data[i].totalCost)
            _data[i].costofLabor= this.priceFormat( _data[i].costofLabor)
            let _itemTableTotal=0;
            for(let j=0; j<_data[i]['detailsInputs'].length; j++){
              _data[i].detailsInputs[j].contributions = this.priceFormat( _data[i].detailsInputs[j].contributions)
              _itemTableTotal+=( _data[i].detailsInputs[j].contributions*1);
            }
            //计算合计
            _data[i].tableTotal=this.priceFormat( _itemTableTotal);
          }          
          console.log("this.$store.getters.userId:",this.$store.getters.userId,this.data.createId , res.data.procInstState,_data); 
          this.data.sharingInputs = _data;

          // this.sumTableNumber();
          if(this.$store.getters.userId!==this.data.createId || 2 <= res.data.procInstState  ){//判断当前查看人是否是创建人 非创建人不能修改表单
           
            this.isFormDisabled=true;
          } 

        } else {
          this.$message.error(res.msg)
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
      // 编辑节点
      editNode(row, type) {
        this.type = type
        this.$refs.addDialog.FormVisible = true
        this.$refs.addDialog.data = JSON.parse(JSON.stringify(row))
      },
      // 编辑节点确认
      editConfim(data) {
        this.recursionFn(this.data.detail, data, 'edit')
      },
      // 子节点
      addSonNode(row, type) {
        this.myId = ''
        this.parentId = row.myId
        this.type = type
        this.$refs.addDialog.FormVisible = true
      },
      // 新增节点
      addNodeData(data) {
        if (data.parentId == '') {
          data.idx = 0
          this.data.detail.push(data)
        } else {
          this.recursionFn(this.data.detail, data, 'add')
        }
      },
      // 树结构递归函数
      recursionFn(list, data, type) {
        if (list.length > 0) {
          list.forEach((item, index) => {
            if (type == 'add') {
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
                  this.$message.success('删除成功');
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
      deleteNode(row) {
        this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.recursionFn(this.data.detail, row, 'delete')
        }).catch(() => {
        });
      },
      // 新增顶级父节点
      fatherNode(id, parentId) {
        this.myId = id
        this.parentId = parentId
        this.$refs.addDialog.FormVisible = true
      },
      // 获取单据编号
      getSerialNumber() {
        var that = this;
        let res = Object.toAjaxJson(FUI.Handlers.FuiFrameworkHandler, 'getSerialNumber', {'counterCode': 'BPM_test'});
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
      //i 数据列表当前下标
      openCustomDialog(id, name, code, ObjName, width, height, radioMultiple,i) {
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
              field: 'testName',
              property: 'myid'
            }
          ],
          callBack: function (data) {
            console.log(data);
            //自定义回调函数不是必须的，可删除
            that.data.projectNo = data[0].BillNo
            let {ConstructionUnit, ProjectName, ProjectManager, ProjectManagerID, MyId, ConstructionUnitID} = data[0]
            that.data.constructionUnit = ConstructionUnit
            that.data.projectName = ProjectName
            that.data.projectManager = ProjectManager
            that.data.projectManagerID = ProjectManagerID
            that.data.projectId = MyId
            that.data.constructionUnitId = ConstructionUnitID
          }
        });
      },

      //问题分类
      openCustomDialog1(id, name, code, ObjName, width, height, radioMultiple,i) {
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
              field: 'name',
              property: 'myid'
            }
          ],
          callBack: function (data) {
            console.log(data);
            //自定义回调函数不是必须的，可删除           
            that.$set(that.data.sharingInputs[i],"questionClassification", data[0].IssueClass)
            that.$set(that.data.sharingInputs[i],"questionClassificationId",data[0].BillNo)          
          }
        });
      },


      //分摊对象 供应商选择 
      openCustomDialog2(id, name, code, ObjName, width, height, radioMultiple,indexData) {
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
              field: 'testName',
              property: 'myid'
            }
          ],
          callBack: function (data) {
            console.log(data);
            that.$set(that.data.sharingInputs[indexData[0]].detailsInputs[indexData[1]],"shareTheObject", data[0].CustomerName)
            that.$set(that.data.sharingInputs[indexData[0]].detailsInputs[indexData[1]],"shareTheObjectId",data[0].MyId)  
            //自定义回调函数不是必须的，可删除
            // that.data.projectNo = data[0].BillNo
          }
        });
      },
      

      //分摊对象 甲方选择 
      openCustomDialog3(id, name, code, ObjName, width, height, radioMultiple,indexData) {
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
              field: 'testName',
              property: 'myid'
            }
          ],
          callBack: function (data) {
            console.log(data);
            //自定义回调函数不是必须的，可删除           
            that.$set(that.data.sharingInputs[indexData[0]].detailsInputs[indexData[1]],"shareTheObject", data[0].CustomerName)
            that.$set(that.data.sharingInputs[indexData[0]].detailsInputs[indexData[1]],"shareTheObjectId",data[0].myid)  
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
        console.log("appId:",appId);
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
          // that.isReadOnly = true;
          that.isFormDisabled = true;
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
        var result = "";
        result = that.submitForm();
        return result;
      }
      //工作流点击"提交"时触发此函数，返回:空字符串:工作流继续提交，返回"具体错误信息":工作流不提交
      , sendWorkflow(btnDef) {
        var that = this; 
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
      //为二级三级数据加上主表 myId formid wiid  businessKey
      setDataKes(setData){
        let that=this;
        let _data=JSON.parse(setData);
        for(let i=0; i<_data.length; i++){
          // _data[i].myId=that.myId;
          _data[i].wiid = that.wiid;
          _data[i].formId = that.data.formId;
          _data[i].businessKey = that.data.businessKey;
          _data[i].procInstState= that.data.procInstState
          for(let j=0; j<_data[i]['detailsInputs'].length; j++){
           _data[i].detailsInputs[j].myId=that.myId;
           _data[i].detailsInputs[j].wiid = that.wiid;
           _data[i].detailsInputs[j].formId = that.data.formId;
           _data[i].detailsInputs[j].businessKey = that.data.businessKey;
          }
        }
        console.log("格式：",_data);
        return  _data;
      },
      // 表单提交
      submitForm() {
        let that = this;
        let isOk = false;
        fui_global_richeditorArrValueToInput(that);
        let success = that.validateForm('formRef');
        if (!success) return;
        console.log("提交that.data:",that.data);
        let _isUpwardsTotal=that.isUpwardsTotal(that.data.sharingInputs)   
        
        if(that.data.fileData.length === 0){
          console.log("附件不能为空");
          FUI.Window.showMsg('附件不能为空');
          return isOk;
        }else{
          that.data.file = JSON.stringify(that.data.fileData);
        }
        if(_isUpwardsTotal){ 
          that.data.wiid = that.wiid;
          that.data.formId = window.parent.myvm.wfContext.FormId;
          that.data.businessKey = window.parent.myvm.wfContext.BusinessKey; 
          let _data=that.setDataKes(JSON.stringify(that.data.sharingInputs));
          that.data.sharingInputs=_data;    
          let _createTime=JSON.stringify(that.data.createTime);
          that.data.createTime= that.parserDate(_createTime);         
          console.log("_isUpwardsTotal:",_isUpwardsTotal)  
          // setTimeout(function () {
          //   $.extendAjax("/extend/projectMaintenanceApplication/addProjectMaintenanceApplication", JSON.stringify(that.data), "post", function(res) {
          //     if(res){
          //       if (res.code === 200) {
          //           FUI.Window.showMsg(res.msg);
          //         return !isOk
          //       } else {
          //         FUI.Window.showMsg(res.msg);
          //         return isOk
          //       }
          //     }
          //   });
          // }, 500)
        }else{
          FUI.Window.showMsg('列表合计金额不能 > 费用合计金额');
           return isOk
        }
      },

      //单项合计是否大于单项总数
      isUpwardsTotal(newData){
        for(let i=0; i<newData.length; i++){
          if(newData[i].tableTotal *1 > newData[i].totalCost *1){
            return false
          }      
        }
        return true
      },

      // field: 可以是字段名也可以是字段定义的对象
      // updateFieldValue11(field, newValue, vueDataName, subVueDataName) {  
      //   console.log("123323",field, newValue, vueDataName, subVueDataName);
      //   // 更新控件值
      //   var that = this;
      //   var vueDataObj = vueDataName ? that[vueDataName] : that.data;
      //   if (subVueDataName) vueDataObj = that[vueDataName][subVueDataName];
      //   if (typeof field === 'string') {
      //     vueDataObj[field] = newValue;
      //   } else {
      //     if (field.fieldName) {
      //       vueDataObj[field.fieldName] = newValue;
      //     } else if (field.vModel) {
      //       vueDataObj[field.vModel] = newValue;
      //     } else if (field['field']) {
      //       vueDataObj[field['field']] = newValue;
      //     }
      //   }
      // },

      // 接受上传文件
      showFile(arr){
        console.log(arr,'文件');
        this.data.fileData = arr;
      },

      // 表单效验
      validateForm(refFormName) {
        var success = false;
        this.$refs[refFormName].validate(valid => {
          success = valid;
        });
        return success;
      }
    },
    destroyed(){
      // window.removeEventListener('message')
    }

  }
  
</script>

<style lang="scss" scoped>
.form-box{ width: 100%; overflow: hidden; box-sizing: border-box;}
.adddelicon{ font-size: 20px; cursor: pointer;} 
.upload-box{ box-sizing: border-box;}

.mininput{
  .el-form-item__content{ display: flex; justify-content: space-between;align-items: center;
    .el-input-group{ width:80%;}
    .mylink{  width:16%; background: #006EFF; display: inline-block; height: 40px; line-height: 40px; text-align: center; margin-left: 4%; 
      border-radius: 3px; cursor: pointer;  color: #fff;}
  }
}
.maintenance-allocation{ padding-top:20px;
 .maintenance-allocation-title {margin: 0 20px; border-top: 1px dashed #ddd; line-height: 24px; display: flex; justify-content: space-between;
   align-items: center;
    h6{ position: relative;top:-12px; background: #fff; font-size: 12px; line-height: 24px; color: #333; padding-right: 10px;}
    span{ display:inline-block; background: #006EFF; color: #fff; font-size: 1px; line-height: 24px; height: 24px; text-align: center;
  position: relative; top: -12px; cursor: pointer;  width: 40px; border-radius: 4px;}
}
}
.maintenance-allocation:nth-child(1){
    .maintenance-allocation-title { border:0; }
}

.contentBtn-box{ display: flex; align-items: center; justify-content: space-around; margin-bottom: 20px;}
.my-table{  padding:0 20px 10px 120px;
  ul { width: 100%; display: flex; align-items: center;  justify-content: flex-start;
    li { list-style: none;  width:30%; flex-shrink: 1; justify-content: center; align-items: center; display: flex; flex-grow:1;
      .el-form-item{ display: flex; justify-content: flex-start; align-items: center;} 
    }

    li:last-child, li:nth-child(1){ width: 50px; flex-shrink: 0;  flex-grow:0; }
  }
  ul.table-th{ height:40px; background: #efefef; font-size: 14px; color: #333; font-weight: bold;
    li:last-child{ font-size: 30px; font-weight: bold; color: #006EFF;}    
  }
  ul.table-tr{ height:60px; border-top: 1px solid #ddd;background:#fff; 
    li:last-child{ font-size: 30px; font-weight: bold; color: #F00;}
  }
}

.total{display: flex; justify-content: space-between; align-items: center; height: 40px; background: #f9f9f9; 
  border-top: 1px dashed #ddd;padding: 0 20px; box-sizing: border-box; font-size: 16px; font-family: arial;color:#666;
  p{ font-size: 14px; color: #F00; line-height: 40px; }
}
  .cost {
    height: 100%; overflow: hidden;
    .title {
      vertical-align: middle;
      display: flex;
      line-height:36px;
      align-items: center;
      font-size: 14px;
      font-weight: bold;
      color: #0099ff;
      border-bottom: 1px solid #f3f3f3;
      // padding-bottom: 5px;
    }

    .title::before {
      content: "";
      display: inline-block;
      width: 4px;
      height: 17px;
      margin-right:10px;
      background: #006EFF;
    }

    .projectInfo {
      // padding: 5px;
      background-color: #fff;
      margin-bottom: 10px;

      .formData {
        padding: 20px;
      }
    }
    .costInfo{
      min-height: 100px;
      background-color: #fff;
      overflow: hidden;
      margin: 10px auto;



      .formData {
        padding: 20px;
      }

    }

    .planCenter {
      min-height: 600px;
      background-color: #fff;
      padding: 5px;
      margin-bottom: 10px;

      .formData {
        padding: 20px;
      }
    }

    .footer {
      background-color: #fff;
      padding:20px 5px 5px;
      margin-top: 10px;
    }
    .pageTitle{
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
