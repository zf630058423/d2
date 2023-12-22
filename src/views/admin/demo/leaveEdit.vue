<template>
  <div class="f2bpm-page-dialog-layout">
    <div>

      <el-form ref="formRef" :rules="formRules" size="small" :model="data" class="f2bpm-editform" label-width="120px">
        <el-form-item label="文本域" prop="webBenYun">
          <el-input v-model="data.webBenYun" type="textarea" :rows="4" placeholder="" />
        </el-form-item>
        <el-form-item label="文本框" prop="wenBenKuan">
          <el-input v-model="data.wenBenKuan"></el-input>
        </el-form-item>
        <el-form-item label="下拉选择-数据字典" prop="selectB">
          <f2bpmui-select configtype="发布状态" field="selectB" :fieldvalue="data.selectB" @updatevalue="updateFieldValue" />
        </el-form-item>
        <el-form-item label="下拉选择数据服务" prop="selectD">
          <f2bpmui-select :field="selectD_def" :fieldvalue="data.selectD" @updatevalue="updateFieldValue" />
        </el-form-item>
        <el-form-item label="下拉选择SQL" prop="selectC">
          <f2bpmui-select :field="selectC_def" :fieldvalue="data.selectC" @updatevalue="updateFieldValue" />
        </el-form-item>
        <el-form-item label="下拉选择-自定义" prop="selectA">
          <f2bpmui-select :field="selectA_def" :fieldvalue="data.selectA" @updatevalue="updateFieldValue" />
        </el-form-item>
        <el-form-item label="开始日期" prop="startDate">
          <el-date-picker v-model="data.startDate" size="mini" type="datetime" class="textBoxShort" format="yyyy-MM-dd" value-format="yyyy-MM-dd" />
        </el-form-item>
        <el-form-item label="结束日期" prop="endDate">
          <el-date-picker v-model="data.endDate" size="mini" type="datetime" class="textBoxShort" format="yyyy-MM-dd" value-format="yyyy-MM-dd" />
        </el-form-item>
        <el-form-item label="单选-数据服务" prop="radioD">
          <f2bpmui-radio :field="radioD_def" :fieldvalue="data.radioD" @updatevalue="updateFieldValue" />
        </el-form-item>
        <el-form-item label="单选-数据字典" prop="radioB">
          <f2bpmui-radio :field="radioB_def" :fieldvalue="data.radioB" @updatevalue="updateFieldValue" />
        </el-form-item>
        <el-form-item label="单选-sql" prop="radioC">
          <f2bpmui-radio :field="radioC_def" :fieldvalue="data.radioC" @updatevalue="updateFieldValue" />
        </el-form-item>
        <el-form-item label="单选-自定义" prop="radioA">
          <f2bpmui-radio :field="radioA_def" :fieldvalue="data.radioA" @updatevalue="updateFieldValue" />
        </el-form-item>
        <el-form-item label="复选-自定义" prop="checkA">
          <f2bpmui-checkbox :field="checkA_def" :fieldvalue="data.checkA" @updatevalue="updateFieldValue" />
        </el-form-item>
        <el-form-item label="复选-数据字典" prop="checkB">
          <f2bpmui-checkbox :field="checkB_def" :fieldvalue="data.checkB" @updatevalue="updateFieldValue" />
        </el-form-item>
        <el-form-item label="复选-SQL" prop="checkD">
          <f2bpmui-checkbox :field="checkD_def" :fieldvalue="data.checkD" @updatevalue="updateFieldValue" />
        </el-form-item>
        <el-form-item label="复选-数据服务" prop="checkC">
          <f2bpmui-checkbox :field="checkC_def" :fieldvalue="data.checkC" @updatevalue="updateFieldValue" />
        </el-form-item>
        <el-form-item label="附件" prop="attachemntFies">
          <f2bpmui-file :field="attachemntFies_def" :fieldvalue="data.attachemntFies" @updatevalue="updateFieldValue" />
        </el-form-item>
        <el-form-item label="富文本" prop="fuWebBen">
          <f2bpmui-richeditor :field="fuWebBen_def" :fieldvalue="data.fuWebBen" @updatevalue="updateFieldValue" />
        </el-form-item>
        <el-form-item label="图章上传" prop="stamp">
          <f2bpmui-stamp :field="stamp_def" :fieldvalue="data.stamp" @updatevalue="updateFieldValue" />
        </el-form-item>
        <el-form-item label="图片上传" prop="picture">
          <f2bpmui-picture :field="picture_def" :fieldvalue="data.picture" @updatevalue="updateFieldValue" />
        </el-form-item>
        <el-form-item label="自动完成" prop="autoCompleted">
          <f2bpmui-autocompleter :field="autoCompleted_def" :fieldvalue="data.autoCompleted" @updatevalue="updateFieldValue" />
        </el-form-item>
        <el-form-item label="级联选择" prop="selectCase">
          <f2bpmui-cascselect :field="selectCase_def" :fieldvalue="data.selectCase" @updatevalue="updateFieldValue" />
        </el-form-item>
        <el-form-item label="下拉树" prop="selectTree">
          <f2bpmui-droptree :field="selectTree_def" :fieldvalue="data.selectTree" @updatevalue="updateFieldValue" />
        </el-form-item>
        <el-form-item label="流水号" prop="serialNum">
          <f2bpmui-serialnum :field="serialNum_def" :fieldvalue="data.serialNum" @updatevalue="updateFieldValue" />
        </el-form-item>
        <el-form-item label="手写签名" prop="handSign">
          <el-input v-model="data.handSign"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remarks">
          <el-input v-model="data.remarks"></el-input>
        </el-form-item>
        <el-form-item label="流程实例ID" prop="wiid">
          <el-input v-model="data.wiid"></el-input>
        </el-form-item>
        <el-form-item label="创建时间" prop="createdTime">
          <el-date-picker v-model="data.createdTime" size="mini" type="datetime" class="textBoxShort" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" />
        </el-form-item>
        <el-form-item label="请假天数" prop="leaveTotalDays">
          <el-input v-model="data.leaveTotalDays"></el-input>
        </el-form-item>
        <el-form-item label="租户号" prop="tenantid">
          <el-input v-model="data.tenantid"></el-input>
        </el-form-item>
        <el-form-item label="上级键ID" prop="myparentid">
          <el-input v-model="data.myparentid"></el-input>
        </el-form-item>
        <el-form-item label=" 自定义选择器" prop="custSelector">
          <el-input v-model="data.custSelector"></el-input>
        </el-form-item>
        <el-form-item label="表主键ID" prop="myid">
          <el-input v-model="data.myid"></el-input>
        </el-form-item>
        <el-form-item label=" 请假类别" prop="leaveType">
          <el-input v-model="data.leaveType"></el-input>
        </el-form-item>
        <el-form-item label=" 隐藏域" prop="hiddenYu">
          <el-input v-model="data.hiddenYu"></el-input>
        </el-form-item>
        <el-form-item label=" 超链接" prop="hyLink">
          <el-input v-model="data.hyLink"></el-input>
        </el-form-item>
        <el-form-item label=" 创建人ID" prop="creatorId">
          <el-input v-model="data.creatorId"></el-input>
        </el-form-item>
        <el-form-item label=" 地图地址" prop="mapAddress">
          <el-input v-model="data.mapAddress"></el-input>
        </el-form-item>
        <el-form-item label=" 自定义对话框" prop="custDailog">
          <el-input v-model="data.custDailog"></el-input>
        </el-form-item>
        <el-form-item label="业务键" prop="businesskey">
          <el-input v-model="data.businesskey"></el-input>
        </el-form-item>
        <el-form-item label="表单应用ID" prop="formid">
          <el-input v-model="data.formid"></el-input>
        </el-form-item>

        <div class="dialogfooter">
          <el-button v-if="formAction!='View'" size="small" type="primary" @click="submitForm()"><i class="fa fa-save" />保存
          </el-button>
          <el-button id="btn_cancel" size="small" @click="closeEdit"><i class="fa fa-minus-circle" />取消
          </el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        loading: false,
        formAction: null,
        treeData: [],
        selectD_def: { fieldName: 'selectD', fieldTitle: '下拉选择数据服务', itemRender: {}, inputCtrlOption: { "data": { "isMulti": false, "code": "dropSelect_category", "data": [], "isEnableEdit": false, "child": "", "parms": "[{'key':'groupKey','value':'WorkflowGroup','orderNum':1}]" }, "type": "dataService" } },
        selectC_def: { fieldName: 'selectC', fieldTitle: '下拉选择SQL', itemRender: {}, inputCtrlOption: { "data": "SELECT RealName value,RealName text FROM sys_Users where userId=#CurrentUserId#", "type": "sql" } },
        selectA_def: { fieldName: 'selectA', fieldTitle: '下拉选择-自定义', itemRender: {}, inputCtrlOption: { "data": [{ "orderNum": 1, "text": "Items1", "value": "Items1" }, { "orderNum": 2, "text": "Items2", "value": "Items2" }, { "orderNum": 3, "text": "Items3", "value": "Items3" }, { "orderNum": 4, "text": "Items4", "value": "Items4" }], "type": "custom" } },
        radioD_def: { fieldName: 'radioD', fieldTitle: '单选-数据服务', inputCtrlOption: { "data": { "isMulti": false, "code": "dropSelect_monitorLogType", "data": [], "isEnableEdit": false, "child": "", "parms": "" }, "type": "dataService" }, fieldOptions: null, fieldRemark: '' },
        radioB_def: { fieldName: 'radioB', fieldTitle: '单选-数据字典', inputCtrlOption: { "data": "发布状态", "type": "dic" }, fieldOptions: null, fieldRemark: '' },
        radioC_def: { fieldName: 'radioC', fieldTitle: '单选-sql', inputCtrlOption: { "data": "SELECT RealName as  value,RealName as  text FROM sys_Users where userId=#CurrentUserId#", "type": "sql" }, fieldOptions: null, fieldRemark: '' },
        radioA_def: { fieldName: 'radioA', fieldTitle: '单选-自定义', inputCtrlOption: { "data": [{ "orderNum": 1, "text": "项目", "value": "Items1" }, { "orderNum": 2, "text": "Items2", "value": "Items2" }, { "orderNum": 3, "text": "Items3", "value": "Items3" }, { "orderNum": 4, "text": "Items4", "value": "Items4" }], "type": "custom" }, fieldOptions: null, fieldRemark: '' },
        checkA_def: { fieldName: 'checkA', fieldTitle: '复选-自定义', inputCtrlOption: { "data": [{ "orderNum": 1, "text": "ItemsA", "value": "Items1" }, { "orderNum": 2, "text": "Items2", "value": "Items2" }, { "orderNum": 3, "text": "ItemsC", "value": "Items3" }], "type": "custom" }, fieldOptions: null, fieldRemark: '' },
        checkB_def: { fieldName: 'checkB', fieldTitle: '复选-数据字典', inputCtrlOption: { "data": "发布状态", "type": "dic" }, fieldOptions: null, fieldRemark: '' },
        checkD_def: { fieldName: 'checkD', fieldTitle: '复选-SQL', inputCtrlOption: { "data": "SELECT RealName as  value,RealName as  text FROM sys_Users where userId=#CurrentUserId#", "type": "sql" }, fieldOptions: null, fieldRemark: '' },
        checkC_def: { fieldName: 'checkC', fieldTitle: '复选-数据服务', inputCtrlOption: { "data": { "isMulti": false, "code": "dropSelect_monitorLogType", "data": [], "isEnableEdit": false, "child": "", "parms": "" }, "type": "dataService" }, fieldOptions: null, fieldRemark: '' },
        attachemntFies_def: { fieldName: 'attachemntFies', fieldTitle: '附件', inputCtrlOption: null, fieldOptions: [{ "opttype": "general", "opttitle": "字段属性键值对常规设置", "params": { "kvData": [{ "value": "", "key": "amapAccessKey" }, { "value": false, "key": "isColumnHide" }, { "value": false, "key": "isMultiple" }, { "value": false, "key": "clearable" }, { "value": "只能上传与业务有关的附件", "key": "uploadtip" }, { "value": 1, "key": "uploadlimit" }, { "value": "", "key": "uploadextension" }] } }], fieldRemark: '' },
        fuWebBen_def: { fieldName: 'fuWebBen', fieldTitle: '富文本', inputCtrlOption: { "toolbarsType": "" }, fieldOptions: null, fieldRemark: '' },
        stamp_def: { fieldName: 'stamp', fieldTitle: '图章上传', inputCtrlOption: null, fieldOptions: null, fieldRemark: '' },
        picture_def: { fieldName: 'picture', fieldTitle: '图片上传', inputCtrlOption: null, fieldOptions: [{ "opttype": "general", "opttitle": "字段属性键值对常规设置", "params": { "kvData": [{ "value": "", "key": "amapAccessKey" }, { "value": false, "key": "isColumnHide" }, { "value": false, "key": "isMultiple" }, { "value": false, "key": "clearable" }, { "value": "请上传毕业证，学位证", "key": "uploadtip" }, { "value": 2, "key": "uploadlimit" }, { "value": ".jpg,.png", "key": "uploadextension" }] } }], fieldRemark: '' },
        autoCompleted_def: { fieldName: 'autoCompleted', fieldTitle: '自动完成', inputCtrlOption: { "data": { "isMulti": false, "code": "Auto_DataDict", "data": [], "isEnableEdit": false, "child": "", "parms": "" }, "type": "dataService" }, fieldOptions: null, fieldRemark: '' },
        selectCase_def: { fieldName: 'selectCase', fieldTitle: '级联选择', inputCtrlOption: { "data": { "isMulti": false, "haveEmpty": true, "code": "Casc_ShengShiQuXian", "data": [], "isRoot": true, "isEnableEdit": false, "child": "", "parms": "" }, "type": "dataService" }, fieldOptions: null, fieldRemark: '' },
        selectTree_def: { fieldName: 'selectTree', fieldTitle: '下拉树', inputCtrlOption: { "data": { "isMulti": false, "code": "TreeDataDB", "data": [], "isEnableEdit": false, "child": "", "parms": "" }, "type": "dataService" }, fieldOptions: null, fieldRemark: '' },
        serialNum_def: { fieldName: 'serialNum', fieldTitle: '流水号', inputCtrlOption: { "counterCode": "CeShi" }, fieldOptions: null, fieldRemark: '' },

        data: {
          id: "",
          webBenYun: "",
          wenBenKuan: "",
          selectB: "",
          selectD: "",
          selectC: "",
          selectA: "",
          startDate: "",
          endDate: "",
          radioD: "",
          radioB: "",
          radioC: "",
          radioA: "",
          checkA: "",
          checkB: "",
          checkD: "",
          checkC: "",
          attachemntFies: "",
          fuWebBen: "",
          stamp: "",
          picture: "",
          autoCompleted: "",
          selectCase: "",
          selectTree: "",
          serialNum: "",
          handSign: "",
          remarks: "",
          wiid: "",
          createdTime: "",
          leaveTotalDays: "",
          tenantid: "",
          myparentid: "",
          custSelector: "",
          myid: "",
          leaveType: "",
          hiddenYu: "",
          hyLink: "",
          creatorId: "",
          mapAddress: "",
          custDailog: "",
          businesskey: "",
          formid: ""

        },
        formRules: {
          webBenYun: [{ required: true, message: '必填项不能为空' }],
          wenBenKuan: [{ required: true, message: '必填项不能为空' }],
          selectB: [{ required: true, message: '必填项不能为空' }],
          selectD: [{ required: true, message: '必填项不能为空' }],
          startDate: [{ required: true, message: '必填项不能为空' }],
          endDate: [{ required: true, message: '必填项不能为空' }],
          attachemntFies: [{ required: true, message: '必填项不能为空' }],

        }
      }
    },
    mounted() {
      var that = this;
      window.myvm = that;
    },
    created: function () {
      var that = this;
      that.formAction = formAction;
      if (formAction == FUI.FormAction.Add) {
        const currUser = that.$store.state.user.author;
        that.data.startDate = Object.toGetCurrentDateString();
        that.data.endDate = Object.toGetCurrentDateString();
        that.data.tenantid = currUser.tenantId;

      }
      that.loadData();
    },
    methods: {
      closeEdit() {
        FUI.Window.closeEdit()
      },
      loadData() {
        var that = this
        if (formAction != FUI.FormAction.Add) {
          FUI.Form.bindDataToForm(that, "/admin/demo/leave/", "getModel", keyId, null, mainTable);
        }
      },
      submitForm() {
        var that = this;
        //f2bpmui.base.js中全局方法收集富文编辑器数据
        fui_global_richeditorArrValueToInput(that);
        var success = that.validateForm('formRef');
        if (!success) return;
        FUI.Form.submitForm(that, that.data, "/admin/demo/leave/", "saveModel", formAction, keyId, parentGridId, mainTable);
      },
      // field: 可以是字段名也可以是字段定义的对象
      updateFieldValue(field, newValue, vueDataName, subVueDataName) {
        // 更新控件值
        var that = this
        var vueDataObj = vueDataName ? that[vueDataName] : that.data
        if (subVueDataName) {
          vueDataObj = that[vueDataName][subVueDataName]
        }
        if (typeof field === 'string') {
          vueDataObj[field] = newValue
        } else {
          if (field.fieldName) {
            vueDataObj[field.fieldName] = newValue
          }
          else if (field.vModel) {
            vueDataObj[field.vModel] = newValue
          } else if (field['field']) {
            vueDataObj[field['field']] = newValue
          }
        }
      },
      validateForm(refFormName) {
        var success = false;
        this.$refs[refFormName].validate(valid => {
          success = valid;
        })
        return success;
      }
    }
  }
</script>